import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParams } from '../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles,Colours } from '../styles';
import { FeatureItem } from '../UI';


type Props = DrawerScreenProps<DrawerParams,"About">;

const AboutScreen = ({ navigation, route }: Props) => {
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                    <Ionicons name="menu" size={28} color={Colours.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={styles.iconButton} />
            </View>
            <ScrollView style={styles.scrollBody}>
                 <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Ionicons name="restaurant" size={80} color={Colours.primary} />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colours.textMain, marginTop: 10 }}>
                        Recipe Manager
                    </Text>
                    <Text style={{ fontSize: 14, color: Colours.textMuted }}>Version 1.0.0</Text>
                </View>
                <Text style={styles.sectionLabel}>ABOUT THIS APP</Text>
                <Text style={styles.valueText}>
                    Recipe Manager helps you organize, discover, and share your favorite recipes. 
                    Save family recipes, explore new cuisines, and keep everything synced across devices 
                    with our cloud backup feature.
                </Text>
                <Text style={styles.sectionLabel}>FEATURES</Text>
                <View style={{ marginBottom: 20 }}>
                    <FeatureItem icon="create-outline" text="Create and edit unlimited recipes" />
                    <FeatureItem icon="heart" text="Mark your favorite recipes for quick access" />
                    <FeatureItem icon="cloud-upload-outline" text="Secure cloud backup and restore" />
                    <FeatureItem icon="search-outline" text="Search and organize your collection" />
                    <FeatureItem icon="time-outline" text="Track prep time and calories" />
                    <FeatureItem icon="star" text="Rate recipes with 5-star system" />
                </View>
                 <Text style={styles.sectionLabel}>DEVELOPER</Text>
                <Text style={styles.valueText}>
                    Developed by students of UTAR{'\n'}
                    Bachelor of Software Engineering (Honours)
                </Text>
            </ScrollView>
        </View>
    )
}

export default AboutScreen;