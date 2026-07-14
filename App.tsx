import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator,DrawerContentScrollView, DrawerItemList  } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import { _createTables } from './db-service';
import Ionicons from "react-native-vector-icons/Ionicons";
import RecipeLibraryScreen from './screens/RecipeLibraryScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import ViewRecipeScreen from './screens/ViewRecipeScreen';
import EditRecipeScreen from './screens/EditRecipeScreen';
import CloudSyncScreen from './screens/CloudSyncScreen';
import FileBackupScreen from './screens/FileBackupScreen';
import AboutScreen from './screens/AboutScreen';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);


export type TabParams = {
    'Recipe Library': undefined;
    'Favourites': undefined;
};

export type RecipeDetailsTabParams = {
    Description: { recipe: any, onToggle: () => void };
    Ingredients: { recipe: any };
    Instructions: { recipe: any };
};

export type DrawerParams = {
    Home: undefined;
    'Cloud Sync': { refresh: () => void } | undefined;
    "File Backup": { refresh: () => void } | undefined;
    About: undefined;
};

export type RootStackParams = {
    DrawerRoot: undefined;
    ViewRecipe: { id: number, refresh: () => void };
    EditRecipe: { id: number, refresh: () => void, homeRefresh: () => void };
    AddRecipe: { refresh: () => void };
};

const Tab = createBottomTabNavigator<TabParams>();
const Drawer = createDrawerNavigator<DrawerParams>();
const Stack = createStackNavigator<RootStackParams>();


const MainTabs = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
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

                    if (route.name === 'Recipe Library') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Favourites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    }
                    return <Ionicons name={iconName} size={26} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Recipe Library" component={RecipeLibraryScreen} />
            <Tab.Screen name="Favourites" component={FavouriteScreen} />
        </Tab.Navigator >
    );
};
const CustomDrawerContent = (props: any) => {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 , paddingTop: 0}}>
            <View style={{
                backgroundColor: '#F97316',
                padding: 20,
                paddingTop: 50,
                paddingBottom: 30,
                marginBottom: 10,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="restaurant" size={40} color="#FFFFFF" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 24,
                            fontWeight: 'bold',
                        }}>
                            Recipe Manager
                        </Text>
                        <Text style={{
                            color: '#FFF7ED',
                            fontSize: 14,
                            marginTop: 4,
                        }}>
                            Organize & Share Recipes
                        </Text>
                    </View>
                </View>
            </View>

            <DrawerItemList {...props} />

            <View style={{
                marginTop: 'auto',
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
            }}>
                <Text style={{
                    fontSize: 12,
                    color: '#9CA3AF',
                    textAlign: 'center',
                }}>
                    Version 1.0.0
                </Text>
                <Text style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    textAlign: 'center',
                    marginTop: 4,
                }}>
                    UTAR BSE Project
                </Text>
            </View>
        </DrawerContentScrollView>
    );
};

const MainDrawer = () => {
    return (
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerActiveTintColor: '#F97316', 
                drawerInactiveTintColor: '#6B7280', 
                drawerActiveBackgroundColor: '#FFF7ED', 
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '600',
                    marginLeft: -16,
                },
                drawerItemStyle: {
                    paddingVertical: 8,
                    marginVertical: 2,
                    borderRadius: 8,
                    marginHorizontal: 8,
                },
            }}
        >
            <Drawer.Screen 
                name="Home" 
                component={MainTabs} 
                options={{ 
                    headerShown: false, 
                    drawerIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
                    drawerLabel: 'My Recipes'
                }} 
            />
            <Drawer.Screen 
                name="Cloud Sync" 
                component={CloudSyncScreen} 
                options={{ 
                    headerShown: false, 
                    drawerIcon: ({ color }) => <Ionicons name="cloud-upload" size={28} color={color} />
                }} 
            />
            <Drawer.Screen 
                name="File Backup" 
                component={FileBackupScreen} 
                options={{ 
                    headerShown: false, 
                    drawerIcon: ({ color }) => <Ionicons name="document-text" size={28} color={color} />
                }} 
            />
            <Drawer.Screen 
                name="About" 
                component={AboutScreen} 
                options={{ 
                    headerShown: false, 
                    drawerIcon: ({ color }) => <Ionicons name="information-circle" size={28} color={color} />
                }} 
            />
        </Drawer.Navigator>
    );
};


const App = () => {

    const loadData = async () => {
        try {
            await _createTables();
        } catch (error) {
            console.error('Error creating tables:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="DrawerRoot">
                <Stack.Screen name="DrawerRoot" component={MainDrawer} options={{ headerShown: false }} />
                <Stack.Screen name="AddRecipe" component={AddRecipeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewRecipe" component={ViewRecipeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EditRecipe" component={EditRecipeScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;