import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { _exportDataToJson, _restoreFromJson, _generateTimestamp } from "../db-service";
import { styles, Colours } from '../styles';
import { AppButton } from '../UI';
import io from 'socket.io-client';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParams } from "../App";

const SERVER_URL = 'http://10.0.2.2:5000';
const socket = io(SERVER_URL, { transports: ['websocket'] });

type Props = DrawerScreenProps<DrawerParams, "Cloud Sync">;

const CloudSyncScreen = ({ navigation, route }: Props) => {
    const [lastBackupTime, setLastBackupTime] = useState("No backup yet");
    const [loadingBackup, setLoadingBackup] = useState(false);
    const [loadingRestore, setLoadingRestore] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Not Connected");

    const fetchBackupStatus = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/backup/status`);
            const data = await res.json();
            setLastBackupTime(data.timestamp);
        } catch (error) {
            setLastBackupTime("Unable to fetch backup time");
        }
    };

    useEffect(() => {
        // CHECK IF ALREADY CONNECTED (when component mounts)
        if (socket.connected) {
            console.log('Socket was already connected!');
            setConnectionStatus("Connected to Cloud");
            fetchBackupStatus();
        }

        const handleConnect = () => {
            console.log('Socket connected!');
            setConnectionStatus("Connected to Cloud");
            socket.emit('client_connected', { status: 'Connected' });
            fetchBackupStatus();
        };

        const handleDisconnect = () => {
            console.log('Socket disconnected!');
            setConnectionStatus("Disconnected from Cloud");
            setLastBackupTime("Unknown (Server Offline)");
        };

        const handleConnectError = () => {
            console.log('Socket connection error');
            setConnectionStatus("Server Offline");
            setLastBackupTime("Unknown (Server Offline)");
        };

        const handleServerSend = (data: any) => {
            if (data.success) {
                if (data.timestamp) setLastBackupTime(data.timestamp);
                if (data.message) setConnectionStatus(data.message);
            } else {
                Alert.alert("Sync Error", data.message || "An error occurred during synchronization.");
            }
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('server_send', handleServerSend);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.off('server_send', handleServerSend);
            socket.disconnect();
        };
    }, []);

    const handleBackup = async () => {
        if (!socket.connected) {
            Alert.alert("Server Offline", "Cannot connect to cloud server right now. Please try again.");
            return;
        }

        setLoadingBackup(true);
        setConnectionStatus("Backing up to Cloud...");

        try {
            const jsonData: any = await _exportDataToJson();
            const parsedData = JSON.parse(jsonData);
            const timestamp = _generateTimestamp();
            setConnectionStatus("Uploading backup to Cloud...");
            socket.emit('client_send', { action: 'backup', payload: parsedData, timestamp });

            socket.once('server_send', (response) => {
                if (response.success) {
                    setConnectionStatus("Backup successful!");
                    Alert.alert("Backup Successful", "Your data has been backed up to the cloud successfully.");
                    fetchBackupStatus();
                } else {
                    Alert.alert("Backup Failed", response.message || "An error occurred during backup.");
                }
                setLoadingBackup(false);
            });
        } catch (error) {
            Alert.alert("Backup Failed", "An error occurred during backup. Please try again.");
            setConnectionStatus("Backup failed");
            setLoadingBackup(false);
        }
    };

    const handleRestore = async () => {
        if (!socket.connected) {
            Alert.alert("Server Offline", "Cannot connect to cloud server right now. Please try again.");
            return;
        }

        Alert.alert(
            "Confirm Restore",
            "Restoring from cloud will overwrite your local data. Are you sure you want to proceed?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Restore",
                    onPress: async () => {
                        setLoadingRestore(true);
                        setConnectionStatus("Restoring from Cloud...");
                        try {
                            socket.emit('client_send', { action: 'restore' });
                            socket.once('server_send', async (response) => {
                                if (response.success && response.backup) {
                                    setConnectionStatus("Wiping and replacing local data...");
                                    try {
                                        await _restoreFromJson(JSON.stringify(response.backup.data));
                                        setConnectionStatus("Restore successful!");
                                        Alert.alert("Restore Successful", "Your data has been restored from the cloud successfully.");
                                        if (route.params?.refresh) route.params.refresh();
                                    } catch (error) {
                                        Alert.alert("Restore Failed", "An error occurred while restoring data: " + error);
                                    }
                                } else {
                                    Alert.alert("Restore Failed", response.message || "An error occurred during restore.");
                                }
                                setLoadingRestore(false);
                            });
                        } catch (error) {
                            Alert.alert("Restore Failed", "An error occurred during restore. Please try again.");
                            setConnectionStatus("Restore failed");
                            setLoadingRestore(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colours.background }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
                    <Ionicons name="menu" size={28} color={Colours.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cloud Sync</Text>
                <View style={styles.iconButton} />
            </View>
            <View style={styles.syncContainer}>
                <Text style={styles.syncStatusText}>Connection: {connectionStatus}</Text>

                <View style={styles.syncCard}>
                    <Ionicons name="cloud-outline" size={60} color={Colours.primary} style={{ marginBottom: 15 }} />
                    <Text style={styles.syncLabel}>Last Cloud Backup:</Text>
                    <Text style={styles.syncTimeText}>{lastBackupTime}</Text>
                    <View style={styles.syncDivider} />

                    {loadingBackup ? (
                        <ActivityIndicator size="large" color={Colours.primary} style={{ marginVertical: 15 }} />
                    ) : (
                        <AppButton
                            title="Backup to Cloud"
                            icon="cloud-upload-outline"
                            onPress={handleBackup}
                            theme="primary"
                            style={styles.syncButton}
                        />
                    )}

                    {loadingRestore ? (
                        <ActivityIndicator size="large" color={Colours.secondary} style={{ marginVertical: 15 }} />
                    ) : (
                        <AppButton
                            title="Restore from Cloud"
                            icon="cloud-download-outline"
                            onPress={handleRestore}
                            theme="success"
                            style={styles.syncRestoreBtn}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CloudSyncScreen;