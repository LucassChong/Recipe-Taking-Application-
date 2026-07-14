import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { _queryFavouriteRecipes } from '../db-service';
import { _toggleFavouriteAsync } from '../favourite-service';
import { RootStackParams, TabParams } from '../App';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RecipeList } from '../UI';
import{styles} from '../styles';
import { StackScreenProps } from '@react-navigation/stack';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParams, 'Favourites'>, any>;

const FavouriteScreen = ({ navigation, route }: Props) => {
    const [favourites, setFavourites] = useState<any>([]);
    const [isFetching, setIsFetching] = useState(false);
    const isFocused = useIsFocused();

    const loadFavourites = async () => {
        setIsFetching(true);
        const data = await _queryFavouriteRecipes();
        setFavourites(data);
        setIsFetching(false);
    };

    useEffect(() => {
        loadFavourites();
    }, [isFocused]);

    const handleToggleFavourite = async (item: any) => {
        const newState = await _toggleFavouriteAsync(item.id);
        ToastAndroid.show(newState ? "Added to Favourites!" : "Removed from Favourites", ToastAndroid.SHORT);
        loadFavourites();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                    <Ionicons name="menu" size={28} color="#F97316" />
                </TouchableOpacity>           
                <Text style={styles.headerTitle}>Favourites</Text>
                <View style={styles.iconButton} />
            </View>
            {favourites.length === 0 ? (
                <Text style={styles.emptyText}>No favourites yet. Pull down to refresh if you added some!</Text>
            ) : (
                <RecipeList 
                data={favourites}
                refreshing={isFetching}
                onRefresh={loadFavourites}
                emptyMessage="No favourites yet. Add some from the library!"
                showHeart={true}
                onItemPress={(id: number) => navigation.navigate('ViewRecipe', { id, refresh: loadFavourites })}
                onToggleFavourite={handleToggleFavourite}
            />
            )}
        </View>
    );
};

export default FavouriteScreen;