import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = '@favourite_recipes';

export const _getFavourites = async (): Promise<number[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAV_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Error reading favourites", e);
        return [];
    }
};

export const _checkIsFavourite = async (id: number): Promise<boolean> => {
    const favs = await _getFavourites();
    return favs.includes(id);
};

export const _toggleFavouriteAsync = async (id: number): Promise<boolean> => {
    try {
        let favs = await _getFavourites();
        const isFav = favs.includes(id);
        
        if (isFav) {
            favs = favs.filter(favId => favId !== id);
        } else {
            favs.push(id);
        }
        
        await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
        return !isFav;
    } catch (e) {
        console.error("Error toggling favourite", e);
        return false;
    }
};