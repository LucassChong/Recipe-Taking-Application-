import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { _queryRecipeById, _updateRecipe } from '../db-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { styles } from '../styles';
import { InputWithLabel } from '../UI';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../App';

type Props = StackScreenProps<RootStackParams, "EditRecipe">;

const EditRecipeScreen = ({ navigation, route }: Props) => {
    const { id, refresh } = route.params;
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCurrentData = async () => {
            try {
                const data: any = await _queryRecipeById(id);
                if (data) {
                    setForm(data);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show("Failed to load recipe", ToastAndroid.SHORT);
            } finally {
                setLoading(false);
            }
        };
        loadCurrentData();
    }, [id]);

    const handleSave = async () => {
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

        await _updateRecipe(
            id,
            form.title,
            form.description,
            form.instructions,
            form.ingredients,
            form.prep_time,
            form.calories,
            form.image_url,
            form.rating
        );

        ToastAndroid.show("Changes Saved!", ToastAndroid.SHORT);

        if (refresh) refresh();
        navigation.goBack();
    };

    const handleSavePress = () => {
        Alert.alert(
            "Save Changes",
            "Are you sure you want to update this recipe?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Save",
                    onPress: handleSave,
                    style: "default"
                }
            ]
        );
    };

    const handleCancelPress = () => {
        Alert.alert(
            "Discard Changes?",
            "You have unsaved changes. Are you sure you want to leave?",
            [
                { text: "Stay", style: "cancel" },
                {
                    text: "Discard",
                    onPress: () => navigation.goBack(),
                    style: "destructive"
                }
            ]
        );
    };

    if (loading || !form) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#286090" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancelPress}>
                    <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit {form.title}</Text>
                <TouchableOpacity onPress={handleSavePress}>
                    <Text style={styles.saveText}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody}>
                <InputWithLabel
                    label="Recipe Name"
                    value={form.title}
                    onChangeText={(t: string) => setForm({ ...form, title: t })}
                    maxLength={100}
                    showCounter={true}
                />

                <InputWithLabel
                    label="Prep Time"
                    value={form.prep_time}
                    onChangeText={(t: string) => setForm({ ...form, prep_time: t })}
                    maxLength={20}
                    showCounter={true}
                />

                <InputWithLabel
                    label="Image URL"
                    placeholder="https://example.com/food.jpg"
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
                    multiline
                    style={styles.textArea}
                    value={form.description}
                    onChangeText={(t: string) => setForm({ ...form, description: t })}
                    maxLength={1000}
                    showCounter={true}
                />

                <InputWithLabel
                    label="Ingredients"
                    multiline
                    style={styles.textArea}
                    value={form.ingredients}
                    onChangeText={(t: string) => setForm({ ...form, ingredients: t })}
                    maxLength={2000}
                    showCounter={true}
                />

                <InputWithLabel
                    label="Instructions"
                    multiline
                    style={styles.textArea}
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

export default EditRecipeScreen;