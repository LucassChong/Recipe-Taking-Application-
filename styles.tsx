import { StyleSheet } from 'react-native';


export const Colours = {
    primary: '#F97316',
    secondary: '#10B981',
    danger: '#EF4444',
    star: '#F59E0B',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    textMain: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',

}

export const styles = StyleSheet.create({
    //Common Styles
    container: {
        flex: 1,
        backgroundColor: Colours.background
    },
    whiteContainer: {
        flex: 1,
        backgroundColor: Colours.surface
    },
    syncContainer: {
        flex: 1,
        backgroundColor: Colours.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollBody: {
        padding: 20
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: Colours.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colours.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 70,
        backgroundColor: Colours.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colours.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colours.textMain,
        flex: 1,
        textAlign: 'center',
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colours.textMain,
        textAlign: 'center',
        flex: 1
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    syncButton: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
    },
    syncRestoreBtn: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    saveText: {
        color: '#286090',
        fontWeight: 'bold',
        fontSize: 16
    },
    syncButtonText: {
        color: Colours.surface,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Input Styles
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colours.primary,
        marginTop: 15,
        textTransform: 'uppercase',
    },
    syncLabel: {
        fontSize: 16,
        color: Colours.textMuted,
        fontWeight: 'bold',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: Colours.border,
        paddingVertical: 10,
        fontSize: 16,
        color: Colours.textMain
    },
    textArea: {
        textAlignVertical: 'top',
        minHeight: 80
    },
    // Screens / Tabs
    mainImage: {
        height: 250,
        resizeMode: 'cover',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    placeholder: {
        backgroundColor: Colours.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabContent: {
        flex: 1,
        padding: 20,
        backgroundColor: Colours.background
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    contentTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginRight: 10
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFEDD5',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoValue: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: Colours.textMain,
    },
    sectionLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colours.primary,
        textTransform: 'uppercase',
        marginBottom: 10,
        letterSpacing: 1
    },
    valueText: {
        fontSize: 16,
        color: Colours.textMain,
        lineHeight: 24,
        marginBottom: 20
    },
    emptyText: {
        padding: 20,
        fontSize: 16,
        color: Colours.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 40
    },
    syncCard: {
        backgroundColor: Colours.surface,
        padding: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colours.border,
        width: '100%',
        alignItems: 'center',
        elevation: 2,
    },
    syncStatusText: {
        color: Colours.textMuted,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    syncTimeText: {
        fontSize: 20,
        color: Colours.textMain,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    syncDivider: {
        height: 1,
        backgroundColor: Colours.border,
        width: '100%',
        marginVertical: 20,
    },
});