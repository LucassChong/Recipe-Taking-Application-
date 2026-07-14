import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParams, RecipeDetailsTabParams } from '../App';
import { _queryRecipeById, _deleteRecipe } from '../db-service';
import { _checkIsFavourite, _toggleFavouriteAsync } from '../favourite-service';
import { Alert } from 'react-native';
import { styles } from '../styles';
import { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParams, 'ViewRecipe'>;

const Tab = createBottomTabNavigator<RecipeDetailsTabParams>();

const DescriptionTab = ({ route }: any) => {
    const { recipe, isFavourite, onToggle } = route.params;

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <View style={styles.headerRow}>
                <Text style={styles.contentTitle}>{recipe.title}</Text>
                <TouchableOpacity onPress={onToggle}>
                    <Ionicons
                        name={isFavourite ? "heart" : "heart-outline"}
                        size={32}
                        color={isFavourite ? "#ef4444" : "#9ca3af"}
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.valueText}>{recipe.description}</Text>

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={20} color="#286090" />
                    <Text style={styles.infoValue}>{recipe.prep_time}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="flame-outline" size={20} color="#ef4444" />
                    <Text style={styles.infoValue}>{Number(recipe.calories).toFixed(1)} kcal</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="star" size={20} color="#f59e0b" />
                    <Text style={styles.infoValue}>{Number(recipe.rating).toFixed(1)}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const IngredientsTab = ({ route }: any) => {
    const ingredientsList = route.params.recipe.ingredients?.split(',') || [];

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <Text style={styles.sectionLabel}>Required Ingredients</Text>
            <View style={{
                backgroundColor: '#FFF7ED',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: '#FED7AA',
                marginTop: 8
            }}>
                {ingredientsList.length > 0 ? (
                    ingredientsList.map((item: string, index: number) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#F97316" />
                            <Text style={{ marginLeft: 10, fontSize: 20, color: '#374151' }}>
                                {item.trim()}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.valueText}>No ingredients listed.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const InstructionsTab = ({ route }: any) => (
    <ScrollView
        style={styles.tabContent}
        contentContainerStyle={{ paddingBottom: 80 }}
    >
        <Text style={styles.sectionLabel}>Cooking Steps</Text>
        <View style={{
            backgroundColor: '#FFF7ED',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: '#FED7AA',
            marginTop: 8
        }}>
            <Text style={{ fontSize: 20, color: '#4B5563', lineHeight: 26 }}>
                {route.params.recipe.instructions}
            </Text>
        </View>
    </ScrollView>
);


const ViewRecipeScreen = ({ navigation, route }: Props) => {
    const [recipe, setRecipe] = useState<any>(null);
    const [isFavourite, setIsFavourite] = useState(false);

    const loadData = async () => {
        const data = await _queryRecipeById(route.params.id);
        setRecipe(data);

        const isFav = await _checkIsFavourite(route.params.id);
        setIsFavourite(isFav);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Recipe",
            `Are you sure you want to delete "${recipe.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await _deleteRecipe(recipe.id);
                            ToastAndroid.show("Recipe Deleted", ToastAndroid.SHORT);

                            if (route.params.refresh) route.params.refresh();
                            navigation.goBack();
                        } catch (error) {
                            console.error(error);
                            ToastAndroid.show("Failed to delete recipe", ToastAndroid.SHORT);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        loadData();
    }, [route.params.id]);

    const handleToggleFavourite = async () => {
        if (recipe) {
            const newState = await _toggleFavouriteAsync(recipe.id);

            setIsFavourite(newState);
            const message = newState
                ? "Added to Favourites!"
                : "Removed from Favourites"

            ToastAndroid.show(message, ToastAndroid.SHORT);

            route.params.refresh();
        }
    };

    if (!recipe) return null;

    return (
        <View style={styles.container}>
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconButton}>
                    <Ionicons name="arrow-back" size={24} color="#000000" />
                </TouchableOpacity>

                <Text style={styles.headerText} numberOfLines={1}>{recipe.title}</Text>

                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={handleDelete} style={styles.headerIconButton}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('EditRecipe', {
                            id: recipe.id,
                            refresh: loadData,
                            homeRefresh: route.params.refresh
                        })}
                        style={styles.headerIconButton}
                    >
                        <Ionicons name="create-outline" size={24} color="#286090" />
                    </TouchableOpacity>
                </View>
            </View>

            {recipe.image_url ? (
                <View style={{
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginVertical: 16,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                }}>
                    <Image
                        source={{ uri: recipe.image_url }}
                        style={{
                            height: 250,
                            resizeMode: 'cover',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    />
                </View>
            ) : (
                <View style={[styles.mainImage, styles.placeholder]}>
                    <Ionicons name="image-outline" size={60} color="#9ca3af" />
                </View>
            )}

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#F97316',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarStyle: {
                        height: 70,
                        paddingBottom: 10,
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: '600',
                        marginTop: 4,
                    },
                    tabBarIconStyle: {
                        marginTop: -4,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = 'ellipse';

                        if (route.name === 'Description') {
                            iconName = focused ? 'information-circle' : 'information-circle-outline';
                        } else if (route.name === 'Ingredients') {
                            iconName = focused ? 'restaurant' : 'restaurant-outline';
                        } else if (route.name === 'Instructions') {
                            iconName = focused ? 'list' : 'list-outline';
                        }

                        return <Ionicons name={iconName} size={26} color={color} />;
                    }
                })}
            >
                <Tab.Screen name="Description">
                    {(props) => <DescriptionTab {...props} route={{ ...props.route, params: { recipe, isFavourite, onToggle: handleToggleFavourite } }} />}
                </Tab.Screen>
                <Tab.Screen name="Ingredients">
                    {(props) => <IngredientsTab {...props} route={{ ...props.route, params: { recipe } }} />}
                </Tab.Screen>
                <Tab.Screen name="Instructions">
                    {(props) => <InstructionsTab {...props} route={{ ...props.route, params: { recipe } }} />}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
};

export default ViewRecipeScreen;