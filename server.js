const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ limit: '50mb' }));

const BACKUP_FILE = path.join(__dirname, 'cloud_backup.json');

// Websocket
io.on('connection', (socket) => {
  console.log('Device connected:', socket.id);

  socket.on('client_connected', (data) => {
    console.log('Client connected', data.status);
  });

  socket.on('client_send', (data) => {
    if (data.action === 'backup') {
      const backupData = {
        timestamp: data.timestamp || new Date().toLocaleString(),
        data: data.payload
      };

      fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));

      socket.emit('server_send', {
        success: true,
        message: 'Backup saved successfully!',
        timestamp: backupData.timestamp
      });
    } else if (data.action === 'restore') {
      if (fs.existsSync(BACKUP_FILE)) {
        const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
        socket.emit('server_send', {
          success: true,
          backup: backup
        });
      } else {
        socket.emit('server_send', {
          success: false,
          message: 'No backup found on cloud.'
        });
      }
    }
  });
});

// GET all recipes
app.get('/api/recipes', (req, res) => {
  if (fs.existsSync(BACKUP_FILE)) {
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
    res.status(200).json(backup.data.recipes || []);
  } else {
    res.status(200).json([]);
  }
});

// GET recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  if (fs.existsSync(BACKUP_FILE)) {
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
    const recipes = backup.data.recipes || [];
    const recipe = recipes.find(r => r.id == req.params.id);
    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } else {
    res.status(404).json({ error: "Recipe not found" });
  }
});

//POST create new recipe
app.post('/api/recipes', (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const { title, description, ingredients, instructions, prep_time, image_url, calories, rating, timestamp } = req.body;

  // VALIDATE INPUT
  const validationErrors = validateRecipe(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  let backup = { timestamp: timestamp || new Date().toLocaleString(), data: { recipes: [], favourites: [] } };

  if (fs.existsSync(BACKUP_FILE)) {
    backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
  }

  const newId = backup.data.recipes.length > 0 ? Math.max(...backup.data.recipes.map(r => r.id)) + 1 : 1;

  // ENSURE TYPES ARE CORRECT
  const newRecipe = {
    id: newId,
    title,
    description,
    ingredients,
    instructions,
    prep_time,
    image_url,
    calories: parseFloat(calories),
    rating: parseFloat(rating)
  };

  backup.data.recipes.push(newRecipe);
  backup.timestamp = timestamp || new Date().toLocaleString();
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));
  res.status(201).json({ id: newId, message: "Recipe added successfully", affected: 1, timestamp: backup.timestamp });
});

// DELETE recipe
app.delete('/api/recipes/:id', (req, res) => {
  if (!req.body || !req.body.id) return res.sendStatus(400);
  if (parseInt(req.body.id) !== parseInt(req.params.id)) return res.sendStatus(400);

  if (!fs.existsSync(BACKUP_FILE)) {
    return res.status(404).json({ error: 'No data found' });
  }

  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
  const recipeIndex = backup.data.recipes.findIndex(r => r.id == req.params.id);

  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  backup.data.recipes.splice(recipeIndex, 1);
  
  const { timestamp } = req.body;
  backup.timestamp = timestamp || new Date().toLocaleString();

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));

  res.status(200).json({ id: req.params.id, affected: 1 });
});

app.post('/api/backup', (req, res) => {
  const { timestamp } = req.body;
  const backupData = {
    timestamp: timestamp || new Date().toLocaleString(),
    data: req.body.data
  };

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));

  io.emit('sync_notification', {
    status: 'Cloud backup updated successfully!',
    timestamp: backupData.timestamp
  });

  res.status(200).json({ message: "Backup saved successfully", timestamp: backupData.timestamp });
});

app.get('/api/restore', (req, res) => {
  if (fs.existsSync(BACKUP_FILE)) {
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
    res.status(200).json(backup);
  } else {
    res.status(404).json({ error: "No backup found on cloud." });
  }
});

app.get('/api/backup/status', (req, res) => {
  if (fs.existsSync(BACKUP_FILE)) {
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
    res.status(200).json({ 
      success: true, 
      timestamp: backup.timestamp || "No backup yet" 
    });
  } else {
    res.status(200).json({ 
      success: false, 
      timestamp: "No backup yet" 
    });
  }
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Cloud Server running on port 5000');
});

// PUT update recipe by ID
app.put('/api/recipes/:id', (req, res) => {
  if (!req.body || !req.body.id) return res.sendStatus(400);
  if (parseInt(req.body.id) !== parseInt(req.params.id)) return res.sendStatus(400);

  // VALIDATE INPUT
  const validationErrors = validateRecipe(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validationErrors
    });
  }

  if (!fs.existsSync(BACKUP_FILE)) {
    return res.status(404).json({ error: 'No data found' });
  }

  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE));
  const recipeIndex = backup.data.recipes.findIndex(r => r.id == req.params.id);

  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const { title, description, instructions, ingredients, prep_time, image_url, calories, rating, timestamp } = req.body;

  backup.data.recipes[recipeIndex] = {
    ...backup.data.recipes[recipeIndex],
    title,
    description,
    instructions,
    ingredients,
    prep_time,
    image_url,
    calories: parseFloat(calories), 
    rating: parseFloat(rating)   
  };

  backup.timestamp = timestamp || new Date().toLocaleString();
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2));

  res.status(200).json({ id: req.params.id, affected: 1, timestamp: backup.timestamp });
});


// Validation helper
function validateRecipe(recipe) {
  const errors = [];

  if (!recipe.title || recipe.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!recipe.prep_time || recipe.prep_time.trim() === '') {
    errors.push('Prep time is required');
  }

  if (!recipe.description || recipe.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!recipe.ingredients || recipe.ingredients.trim() === '') {
    errors.push('Ingredients are required');
  }

  if (!recipe.instructions || recipe.instructions.trim() === '') {
    errors.push('Instructions are required');
  }

  // Validate calories is a number
  const calories = parseFloat(recipe.calories);
  if (isNaN(calories) || calories <= 0) {
    errors.push('Calories must be a positive number');
  }

  // Validate rating is between 0-5
  const rating = parseFloat(recipe.rating);
  if (isNaN(rating) || rating < 0 || rating > 5) {
    errors.push('Rating must be between 0 and 5');
  }

  return errors;
}