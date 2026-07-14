import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams, TabParams } from '../App';
import { _queryRecipes } from '../db-service';
import { _toggleFavouriteAsync } from '../favourite-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { RecipeList } from '../UI';
import{styles} from '../styles';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParams, 'Recipe Library'>, any>;

const RecipeLibraryScreen = ({ navigation, route }: Props) => {
    const [recipes, setRecipes] = useState<any>([]);
    const [isFetching, setIsFetching] = useState(false);

    const loadRecipes = async () => {
        setIsFetching(true);
        const data = await _queryRecipes();
        setRecipes(data);
        setIsFetching(false);
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            loadRecipes();
        }
    }, [isFocused]);

    const handleToggleFavourite = async (item: any) => {
        const newState = await _toggleFavouriteAsync(item.id);
        ToastAndroid.show(newState ? "Added to Favourites!" : "Removed from Favourites", ToastAndroid.SHORT);
        loadRecipes();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                    <Ionicons name="menu" size={28} color="#F97316" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Library</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('AddRecipe', { refresh: loadRecipes })}
                style={styles.iconButton}
            >
                <Ionicons name="add-circle" size={32} color="#F97316" />
            </TouchableOpacity>
        </View>
            {recipes && recipes.length === 0 ? (
                <Text style={styles.emptyText}>Your library is empty.</Text>
            ) : (

                <RecipeList
                    data={recipes}
                    refreshing={isFetching}
                    onRefresh={loadRecipes}
                    emptyMessage="Your library is empty. Tap + to add recipes!"
                    onItemPress={(id: number) => navigation.navigate('ViewRecipe', { id, refresh: loadRecipes })}
                    onToggleFavourite={handleToggleFavourite}
                />
            )}
        </View>
    );
};



export default RecipeLibraryScreen;