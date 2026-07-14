import { _getFavourites } from './favourite-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export const _generateTimestamp = (): string => {
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
};

let SQLite = require('react-native-sqlite-storage');

const PromiseDB = () => {
    return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase(
            { name: 'recipes.sqlite', location: 'default' },
            () => { resolve(db); },
            (error: any) => { reject(error); },
        );
    });
};

export const _createTables = async () => {
    try {
        const db: any = await PromiseDB();
        await db.executeSql(`CREATE TABLE IF NOT EXISTS recipes(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title VARCHAR(100),
            description TEXT,
            instructions TEXT, 
            ingredients TEXT, 
            prep_time VARCHAR(50), 
            image_url TEXT, 
            calories DOUBLE,
            rating REAL DEFAULT 0
        )`);

        db.executeSql('SELECT COUNT(*) as count FROM recipes', [], (results: any) => {
            if (results.rows.item(0).count === 0) {
                db.executeSql(`INSERT INTO recipes (title, description, instructions, ingredients, prep_time, image_url, calories, rating) VALUES 
                    ('Nasi Lemak', 'Fragrant coconut rice served with spicy sambal, anchovies, peanuts, and boiled egg.', '1. Cook rice with coconut milk and pandan.\n2. Fry anchovies and peanuts.\n3. Prepare sambal paste.\n4. Serve all together.', 'Rice, Coconut Milk, Pandan, Anchovies, Peanuts, Chili, Egg', '45 mins', 'https://images.getrecipekit.com/20231116072724-c2-a9andy_cooks_thumbnails_nasi_lemak_01.jpg?aspect_ratio=4:3&quality=90&', 650, 4.9),
                    ('Beef Rendang', 'Slow-cooked beef in a rich, spicy coconut milk and spice reduction.', '1. Blend spices into a paste.\n2. Sauté paste and add beef.\n3. Add coconut milk and simmer.\n4. Cook until liquid is absorbed.', 'Beef, Coconut Milk, Lemongrass, Galangal, Turmeric, Kerisik', '4 hrs', 'https://soyummyrecipes.com/wp-content/uploads/2020/04/Beef-rendang-1-1.jpg', 450, 4.8),
                    ('Chicken Satay', 'Grilled marinated chicken skewers served with peanut sauce.', '1. Marinate chicken.\n2. Skewer the meat.\n3. Grill until charred.\n4. Serve with spicy peanut sauce.', 'Chicken, Turmeric, Peanuts, Lemongrass, Sugar', '30 mins', 'https://takestwoeggs.com/wp-content/uploads/2025/04/Thai-Chicken-Satay-1-500x500.jpg', 400, 4.7),
                    ('Char Kway Teow', 'Wok-fried flat rice noodles with prawns and Chinese sausage.', '1. Heat wok with lard.\n2. Fry garlic and prawns.\n3. Add noodles and sauces.\n4. Toss in sprouts and egg.', 'Flat Noodles, Prawns, Sausage, Eggs, Beansprouts, Soy Sauce', '15 mins', 'https://noobcook.com/wp-content/uploads/2014/03/charkwayteow2.jpg', 740, 4.5),
                    ('Laksa Nyonya', 'Spicy coconut noodle soup with prawns and fishcakes.', '1. Prepare laksa broth.\n2. Add coconut milk.\n3. Blanch noodles.\n4. Garnish and serve.', 'Rice Vermicelli, Prawns, Fishcake, Coconut Milk, Laksa Leaves', '40 mins', 'https://substackcdn.com/image/fetch/$s_!yZEF!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2d295e92-0959-4dd8-b13b-11c5d822113f_2048x1537.jpeg', 600, 4.9),
                    ('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil.', '1. Roll dough.\n2. Add sauce and cheese.\n3. Bake in hot oven.\n4. Top with fresh basil.', 'Dough, Tomato Sauce, Mozzarella, Basil, Olive Oil', '15 mins', 'https://www.foodandwine.com/thmb/7BpSJWDh1s-2M2ooRPHoy07apq4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mozzarella-pizza-margherita-FT-RECIPE0621-11fa41ceb1a5465d9036a23da87dd3d4.jpg', 800, 4.4),
                    ('Pad Thai', 'Thai stir-fried rice noodles with shrimp, tofu, and peanuts.', '1. Soak noodles.\n2. Fry tofu/shrimp.\n3. Add noodles and sauce.\n4. Stir in eggs and peanuts.', 'Rice Noodles, Shrimp, Tofu, Tamarind, Peanuts, Lime', '25 mins', 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/7DE647CE-2E09-4CBE-88EE-CFFCC70D7440/Derivates/F8CA1C89-596A-4EC0-9A63-6505DDBD528C.jpg', 500, 4.7),
                    ('Tom Yum Soup', 'Spicy and sour Thai soup with prawns and lemongrass.', '1. Boil water with herbs.\n2. Add prawns/mushrooms.\n3. Season with fish sauce/lime.\n4. Add chili paste.', 'Prawns, Mushrooms, Lemongrass, Galangal, Chili, Lime', '20 mins', 'https://asianinspirations.com.au/wp-content/uploads/2019/11/R00098_Seafood_Tom_Yum_Soup-2-619x412.jpg', 250, 4.6),
                    ('Roti Canai', 'Malaysian flaky flatbread served with dhal or curry.', '1. Knead and rest dough.\n2. Stretch until thin.\n3. Fold and fry.\n4. Serve hot with curry.', 'Flour, Water, Ghee, Salt, Dhal Curry', '2 hrs', 'https://www.rotinrice.com/wp-content/uploads/2011/04/RotiCanai-1.jpg', 380, 4.9)`);
                console.log("Database initialized with sample data.");
            }
        });

    } catch (error) { console.log(error); }
}

export const _queryRecipes = async () => {
    try {
        const favIds = await _getFavourites();
        const db: any = await PromiseDB();
        return new Promise((resolve, reject) => {
            db.executeSql('SELECT * FROM recipes ORDER BY title', [],
                (results: any) => {
                    const rawData = results.rows.raw();
                    const withFavourites = rawData.map((recipe: any) => ({
                        ...recipe,
                        is_favourite: favIds.includes(recipe.id)
                    }));
                    resolve(withFavourites);
                },
                (error: any) => { reject(error); }
            );
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const _queryFavouriteRecipes = async () => {
    try {
        const favIds = await _getFavourites();

        if (!favIds || favIds.length === 0) {
            return [];
        }

        const placeholders = favIds.map(() => '?').join(',');
        const db: any = await PromiseDB();
        return new Promise((resolve, reject) => {
            db.executeSql(`SELECT * FROM recipes WHERE id IN (${placeholders}) ORDER BY title`, favIds,
                (results: any) => {
                    const rawData = results.rows.raw();
                    const withFavourites = rawData.map((recipe: any) => ({
                        ...recipe,
                        is_favourite: true
                    }));
                    resolve(withFavourites);
                },
                (error: any) => { reject(error); }
            );
        });
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const _queryRecipeById = async (id: number) => {
    try {
        const db: any = await PromiseDB();
        return new Promise((resolve, reject) => {
            db.executeSql('SELECT * FROM recipes WHERE id = ?', [id],
                (results: any) => { resolve(results.rows.raw()[0]); },
                (error: any) => { reject(error); }
            );
        });
    } catch (error) { console.log(error); }
}

export const _insertRecipe = async (title: string, description: string, instructions: string, ingredients: string, prepTime: string, imageUrl: string | null, calories: number, rating: number) => {
    const db: any = await PromiseDB();
    return new Promise((resolve, reject) => {
        db.executeSql('INSERT INTO recipes (title,description, instructions, ingredients, prep_time, image_url, calories, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, instructions, ingredients, prepTime, imageUrl, calories, rating],
            (results: any) => resolve(results),
            (error: any) => reject(error)
        );
    });
};

export const _updateRecipe = async (id: number, title: string, description: string, instructions: string, ingredients: string, prep_time: string, calories: number, image_url: string | null, rating: number) => {
    try {
        const db: any = await PromiseDB();
        return new Promise((resolve, reject) => {
            db.executeSql(
                'UPDATE recipes SET title=?, description=?, instructions=?, ingredients=?, prep_time=?, calories=?, image_url=?, rating=? WHERE id=?',
                [title, description, instructions, ingredients, prep_time, calories, image_url, rating, id],
                (results: any) => resolve(results),
                (error: any) => reject(error)
            );
        });
    } catch (error) { console.log(error); }
}

export const _deleteRecipe = async (id: number) => {
    try {
        const db: any = await PromiseDB();
        return new Promise((resolve, reject) => {
            db.executeSql('DELETE FROM recipes WHERE id = ?', [id],
                (results: any) => { resolve(results); },
                (error: any) => { reject(error); }
            );
        });
    } catch (error) { console.log(error); }
}

const FAV_KEY = '@favourite_recipes';

export const _exportDataToJson = async () => {
    const db: any = await PromiseDB();

    return new Promise(async (resolve, reject) => {
        try {
            const recipes = await new Promise((res, rej) => {
                db.executeSql('SELECT * FROM recipes', [],
                    (results: any) => res(results.rows.raw()),
                    (error: any) => rej(error)
                );
            });

            const favsJson = await AsyncStorage.getItem(FAV_KEY);
            const favourites = favsJson != null ? JSON.parse(favsJson) : [];

            const combinedPayload = {
                recipes: recipes,
                favourites: favourites
            };

            resolve(JSON.stringify(combinedPayload));
        } catch (error) {
            reject(error);
        }
    });
};


export const _restoreFromJson = async (jsonString: string) => {
    const db: any = await PromiseDB();

    let parsedData;
    try {
        parsedData = JSON.parse(jsonString);
    } catch (error) {
        throw new Error("Invalid JSON backup data");
    }

    const recipes = parsedData.recipes || [];
    const favourites = parsedData.favourites || [];

    return new Promise(async (resolve, reject) => {
        try {
            await db.executeSql('DELETE FROM recipes');

            for (const recipe of recipes) {
                await db.executeSql(
                    `INSERT INTO recipes (id, title, description, instructions, ingredients, prep_time, image_url, calories, rating) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [recipe.id, recipe.title, recipe.description, recipe.instructions, recipe.ingredients, recipe.prep_time, recipe.image_url, recipe.calories, recipe.rating]
                );
            }

            await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favourites));

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

export const _exportToFile = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData: any = await _exportDataToJson();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `recipe_backup_${timestamp}.json`;
            const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            await RNFS.writeFile(path, jsonData, 'utf8');
            resolve(path);
        } catch (error) {
            reject(error);
        }
    });
};

export const _importFromFile = async (filePath: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
                reject(new Error("Selected file does not exist"));
                return;
            }
            const fileContent = await RNFS.readFile(filePath, 'utf8');
            await _restoreFromJson(fileContent);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};
export const _listBackupFile = async () => {
    return new Promise( async(resolve, reject) => {
        try {
            const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
            const backupFiles = files.filter(file => file.name.endsWith('.json'));
            const sortedFiles = backupFiles.sort((a, b) => 
            {
                const timeA = a.mtime ? a.mtime.getTime() : 0;
                const timeB = b.mtime ? b.mtime.getTime() : 0;
                return timeB - timeA;
            });
            resolve(sortedFiles);
        } catch (error) {
            reject(error);
        }
    });
};

export const _deleteBackupFile = async (filePath: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
                reject(new Error("File does not exist"));
                return;
            }
            await RNFS.unlink(filePath);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

export const _exportToFileWithName = async (fileName: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonData: any = await _exportDataToJson();
            const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            await RNFS.writeFile(path, jsonData, 'utf8');
            resolve(path);
        } catch (error) {
            reject(error);
        }
    });
};


