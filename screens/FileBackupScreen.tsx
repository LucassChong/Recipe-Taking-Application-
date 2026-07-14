import React, { useEffect, useState } from "react";
import {Text, View, Alert, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { _exportToFile, _importFromFile, _listBackupFile, _deleteBackupFile, _exportToFileWithName, _exportDataToJson, _generateTimestamp } from "../db-service";
import { styles, Colours } from '../styles';
import { AppButton } from '../UI';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParams } from "../App";

type Props = DrawerScreenProps<DrawerParams, "File Backup">;

const FileBackupScreen = ({ navigation, route }: Props) => {
    const [backupFiles, setBackupFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadBackupFiles = async () => {
        try {
            setLoading(true);
            const files: any = await _listBackupFile();
            setBackupFiles(files);
        } catch (error) {
            Alert.alert("Error", "Failed to load backup files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBackupFiles();
    }, []);

    const handleExportFile = async () => {
    try {
        const jsonData: any = await _exportDataToJson();
        const parsedData = JSON.parse(jsonData);
        const recipeCount = parsedData.recipes ? parsedData.recipes.length : 0;
        
        const timestamp = _generateTimestamp();
        const filenameSafeTimestamp = timestamp.replace(/:/g, '-').replace(/, /g, '_');
        const fileName = `Recipes_${recipeCount}_items_${filenameSafeTimestamp}.json`;
        
        const filePath: any = await _exportToFileWithName(fileName);
        if (filePath) {
            Alert.alert(
                "Backup Created Successfully",
                `File saved:\n\n${fileName}\n\n${recipeCount} recipes backed up successfully!`,
                [{ text: "OK", onPress: () => loadBackupFiles() }]
            );
        }
    } catch (error) {
        Alert.alert("Export Failed", String(error));
    }
};

    const handleImportFile = (filePath: string, fileName: string) => {
        Alert.alert("Confirm Import", `Are you sure you want to import from ${fileName}? This will overwrite your current data.`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Import", onPress: async () => {
                    try {
                        await _importFromFile(filePath);
                        Alert.alert("Import Successful", "File imported successfully.", [
                            { text: "OK", onPress: () => loadBackupFiles() }
                        ]);
                    } catch (error) {
                        Alert.alert("Import failed", String(error));
                    }
                }
            }
        ]);
    };

    const handleDeleteFile = (filePath: string, fileName: string) => {
        Alert.alert("Confirm Delete", `Are you sure you want to delete ${fileName}? This action cannot be undone.`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", onPress: async () => {
                    try {
                        await _deleteBackupFile(filePath);
                        Alert.alert("Delete Successful", "File deleted successfully.", [
                            { text: "OK", onPress: () => loadBackupFiles() }
                        ]);
                    } catch (error) {
                        Alert.alert("Delete failed", String(error));
                    }
                }
            }
        ]);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                    <Ionicons name="menu" size={28} color={Colours.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>File Backup</Text>
                <View style={styles.iconButton} />
            </View>
            <View style={styles.syncContainer}>
                <View style={styles.syncCard}>
                    <Ionicons name="document-text-outline" size={60} color={Colours.secondary} style={{ marginBottom: 15 }} />
                    <Text style={styles.syncLabel}>Local File Backup</Text>
                    <Text style={{ fontSize: 12, color: Colours.textMuted, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' }}>
                        Create and manage backup files on your device
                    </Text>

                    <AppButton
                        title="Create New Backup File"
                        icon="add-circle-outline"
                        onPress={handleExportFile}
                        theme="success"
                        style={styles.syncButton}
                    />
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 30, marginBottom: 10 }]}>
                    SAVED BACKUP FILES ({backupFiles.length})
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color={Colours.primary} style={{ marginTop: 20 }} />
                ) : backupFiles.length === 0 ? (
                    <Text style={styles.emptyText}>No backup files found. Create one above!</Text>
                ) : (
                    <FlatList
                        data={backupFiles}
                        keyExtractor={(item) => item.path}
                        renderItem={({ item }) => (
                            <View style={{
                                backgroundColor: Colours.surface,
                                padding: 15,
                                borderRadius: 10,
                                marginBottom: 10,
                                elevation: 2
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colours.textMain, marginBottom: 5 }}>
                                    {item.name}
                                </Text>
                                <Text style={{ fontSize: 12, color: Colours.textMuted, marginBottom: 10 }}>
                                    Created: {formatDate(item.mtime)}
                                </Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppButton
                                        title="Import"
                                        icon="download-outline"
                                        onPress={() => handleImportFile(item.path, item.name)}
                                        theme="primary"
                                        style={{ flex: 1, marginRight: 5, margin: 0 }}
                                    />

                                    <AppButton
                                        title="Delete"
                                        icon="trash-outline"
                                        onPress={() => handleDeleteFile(item.path, item.name)}
                                        theme="danger"
                                        style={{ flex: 1, marginLeft: 5, margin: 0 }}
                                    />
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default FileBackupScreen;
