import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { _insertRecipe } from '../db-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';
import { InputWithLabel } from '../UI';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../App';


type Props = StackScreenProps<RootStackParams, "AddRecipe">;
const AddRecipeScreen = ({ navigation, route }: Props) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        prep_time: '',
        calories: '',
        image_url: '',
        rating: ''
    });

    const handleConfirmSave = () => {
        if (!form.title.trim()) {
            ToastAndroid.show("Recipe Title is required", ToastAndroid.SHORT);
            return;
        }
        if (!form.prep_time.trim()) {
            ToastAndroid.show("Prep Time is required (e.g., 15 mins)", ToastAndroid.SHORT);
            return;
        }
        if (!form.description.trim()) {
            ToastAndroid.show("Description is required", ToastAndroid.SHORT);
            return;
        }
        if (!form.ingredients.trim()) {
            ToastAndroid.show("Ingredients are required", ToastAndroid.SHORT);
            return;
        }
        if (!form.instructions.trim()) {
            ToastAndroid.show("Cooking Instructions are required", ToastAndroid.SHORT);
            return;
        }
        const calories = parseFloat(form.calories);
        if (isNaN(calories) || calories <= 0) {
            ToastAndroid.show("Please enter valid Calories (> 0)", ToastAndroid.SHORT);
            return;
        }

        const rating = parseFloat(form.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
            ToastAndroid.show("Please enter a valid rating (0-5)", ToastAndroid.SHORT);
            return;
        }

        Alert.alert(
            "Create Recipe",
            "Do you want to add this new recipe to your library?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Create", onPress: saveToDatabase }
            ]
        );
    };

    const saveToDatabase = async () => {
        try {
            await _insertRecipe(
                form.title,
                form.description,
                form.instructions,
                form.ingredients,
                form.prep_time,
                form.image_url || null,
                parseFloat(form.calories),
                parseFloat(form.rating)
            );

            ToastAndroid.show("Recipe Added Successfully!", ToastAndroid.SHORT);

            route.params.refresh();
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not save recipe to database.");
        }
    };

    const handleCancel = () => {
        if (form.title.trim() || form.description.trim()) {
            Alert.alert(
                "Discard Recipe?",
                "You have unsaved changes. Are you sure you want to discard this recipe?",
                [
                    { text: "Keep Editing", style: "cancel" },
                    { text: "Discard", onPress: () => navigation.goBack(), style: "destructive" }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel}>
                    <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>New Recipe</Text>

                <TouchableOpacity onPress={handleConfirmSave}>
                    <Text style={styles.saveText}>CREATE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody}>
                <InputWithLabel
                    label="Recipe Name"
                    placeholder="e.g. Nasi Lemak"
                    value={form.title}
                    onChangeText={(t: string) => setForm({ ...form, title: t })}
                    maxLength={100}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Prep Time"
                    placeholder="e.g. 30 mins"
                    value={form.prep_time}
                    onChangeText={(t: string) => setForm({ ...form, prep_time: t })}
                    maxLength={20}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={form.image_url}
                    onChangeText={(t: string) => setForm({ ...form, image_url: t })}
                    maxLength={500}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Rating (0-5)"
                    placeholder="0.0 to 5.0"
                    keyboardType="decimal-pad"
                    value={form.rating?.toString()}
                    onChangeText={(t: string) => {
                        const cleaned = t.replace(/[^0-9.]/g, '');
                        const parts = cleaned.split('.');
                        const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
                        setForm({ ...form, rating: sanitized });
                    }}
                />
                <InputWithLabel
                    label="Description"
                    placeholder="Fragrant coconut rice served with spicy sambal, anchovies, peanuts, and boiled egg"
                    multiline style={styles.textArea}
                    value={form.description}
                    onChangeText={(t: string) => setForm({ ...form, description: t })}
                    maxLength={1000}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Ingredients"
                    placeholder="eg. Rice, Coconut Milk, Pandan, Anchovies, Peanuts, Chili, Egg"
                    multiline style={styles.textArea}
                    value={form.ingredients}
                    onChangeText={(t: string) => setForm({ ...form, ingredients: t })}
                    maxLength={2000}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Instructions"
                    placeholder="eg. 1. Cook rice with coconut milk and pandan."
                    multiline style={styles.textArea}
                    value={form.instructions}
                    onChangeText={(t: string) => setForm({ ...form, instructions: t })}
                    maxLength={5000}
                    showCounter={true}
                />
                <InputWithLabel
                    label="Calories (kcal)"
                    placeholder="Enter calories"
                    keyboardType="decimal-pad"
                    value={form.calories?.toString()}
                    onChangeText={(t: string) => {
                        const cleaned = t.replace(/[^0-9.]/g, '');
                        const parts = cleaned.split('.');
                        const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
                        setForm({ ...form, calories: sanitized });
                    }}
                />
            </ScrollView>
        </View>
    );
};

export default AddRecipeScreen;