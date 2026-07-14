import React from 'react';
import { View, Text, TextInput, TouchableNativeFeedback, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colours ,styles } from './styles';


export const InputWithLabel = (props: any) => {
    const orientationDirection = (props.orientation === 'horizontal') ? 'row' : 'column';
    const { maxLength, value, label, showCounter = false, ...otherProps } = props;
    
    return (
        <View style={{ flexDirection: orientationDirection, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.label}>{label}</Text>
                {showCounter && maxLength && (
                    <Text style={{ fontSize: 11, color: Colours.textMuted }}>
                        {value?.length || 0}/{maxLength}
                    </Text>
                )}
            </View>
            <TextInput
                style={[styles.input, props.style]}
                placeholderTextColor="#9ca3af"
                maxLength={maxLength}
                value={value}
                {...otherProps}
            />
        </View>
    );
}


export const AppButton = (props: any) => {
    let backgroundColorTheme = Colours.primary; 
    if (props.theme === 'success') backgroundColorTheme = Colours.secondary;
    if (props.theme === 'danger') backgroundColorTheme = Colours.danger;

    return (
        <TouchableNativeFeedback onPress={props.onPress} onLongPress={props.onLongPress}>
            <View style={[buttonStyles.button, { backgroundColor: backgroundColorTheme }, props.style]}>
                {props.icon && <Ionicons name={props.icon} size={24} color={Colours.surface} style={{ marginRight: 10 }} />}
                <Text style={buttonStyles.buttonText}>{props.title}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

export const RecipeList = (props: any) => {
    if (!props.data || props.data.length === 0) {
        return <Text style={listStyles.emptyText}>{props.emptyMessage}</Text>;
    }

    return (
        <FlatList
            data={props.data}
            keyExtractor={(item: any) => item.id.toString()}
            contentContainerStyle={listStyles.listContent}
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
            renderItem={({ item }: any) => (
                <TouchableNativeFeedback onPress={() => props.onItemPress(item.id)}>
                    <View style={listStyles.card}>
                        
                        {item.image_url ? (
                            <Image source={{ uri: item.image_url }} style={listStyles.cardImage} />
                        ) : (
                            <View style={[listStyles.cardImage, listStyles.placeholder]}>
                                <Ionicons name="image-outline" size={40} color="#9ca3af" />
                            </View>
                        )}

                        <View style={listStyles.cardContent}>
                          <View style={listStyles.titleRow}>
                                <Text style={listStyles.cardTitle} numberOfLines={1}>{item.title}</Text>
                                
                                <TouchableOpacity 
                                    onPress={() => props.onToggleFavourite(item)} 
                                    style={listStyles.heartButton}
                                >
                                    <Ionicons 
                                        name={item.is_favourite ? "heart" : "heart-outline"} 
                                        size={26} 
                                        color={item.is_favourite ? Colours.danger : Colours.textMuted} 
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={listStyles.detailRow}>
                                <View style={listStyles.iconText}>
                                    <Ionicons name="time-outline" size={14} color={Colours.primary} />
                                    <Text style={listStyles.detailText}>{item.prep_time}</Text>
                                </View>
                                <View style={listStyles.iconText}>
                                    <Ionicons name="flame-outline" size={14} color={Colours.danger} />
                                    <Text style={listStyles.detailText}>{Number(item.calories || 0).toFixed(1)} kcal</Text>
                                </View>
                                <View style={listStyles.iconText}>
                                    <Ionicons name="star" size={14} color={Colours.star} />
                                    <Text style={listStyles.detailText}>{Number(item.rating || 0).toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            )}
        />
    );
};

export const FeatureItem = ({ icon, text }: { icon: string, text: string }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name={icon} size={20} color={Colours.primary} />
            <Text style={{ marginLeft: 10, fontSize: 14, color: Colours.textMain }}>{text}</Text>
        </View>
    );
};


const buttonStyles = StyleSheet.create({
    button: { margin: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'},
    buttonText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
});

const inputStyles = StyleSheet.create({
    container: { height: 90, marginBottom: 10 },
    label: { flex: 1, fontSize: 16, fontWeight: 'bold', marginLeft: 3, textAlignVertical: 'center' },
    input: { flex: 2, fontSize: 18, color: Colours.textMain, borderBottomWidth: 1, borderColor: Colours.border },
});

const listStyles = StyleSheet.create({
    emptyText: { padding: 20, fontSize: 16, color: Colours.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 40 },
    listContent: { padding: 16 },
    card: { backgroundColor: Colours.surface, borderRadius: 15, marginBottom: 20, overflow: 'hidden', elevation: 4 },
    cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
    cardContent: { padding: 15 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: Colours.textMain, marginBottom: 10 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    iconText: { flexDirection: 'row', alignItems: 'center' },
    detailText: { fontSize: 15, color: Colours.textMuted, marginLeft: 4 },
    placeholder: { backgroundColor: Colours.background, justifyContent: 'center', alignItems: 'center' },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    heartButton: { padding: 4 },
});

