import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TransactionItem from '../components/transaction-item';
import { useTransactions } from '../hooks/use-transactions';
import type { TransactionItem as TransactionItemType } from '../types/transaction';
import { ErrorState } from '../components/resilience/error-state';
import { EmptyState } from '../components/resilience/empty-state';
import { useAppTheme } from '@/context/ThemeContext';

/**
 * Placeholder account used when no accountId is passed via route params.
 */
const DEMO_ACCOUNT_ID =
    'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN';

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function SkeletonRow({ skeletonColor }: { skeletonColor: string }) {
    return (
        <View style={[skeleton.row]}>
            <View style={[skeleton.circle, { backgroundColor: skeletonColor }]} />
            <View style={skeleton.lines}>
                <View style={[skeleton.line, { width: '55%', backgroundColor: skeletonColor }]} />
                <View style={[skeleton.line, { width: '35%', marginTop: 6, backgroundColor: skeletonColor }]} />
            </View>
            <View style={[skeleton.line, { width: 60, alignSelf: 'center', backgroundColor: skeletonColor }]} />
        </View>
    );
}

const skeleton = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'transparent',
    },
    circle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 14,
    },
    lines: { flex: 1 },
    line: {
        height: 12,
        borderRadius: 6,
    },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function TransactionsScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const s = makeStyles(colors);

    const params = useLocalSearchParams<{ accountId?: string }>();
    const accountId = (params.accountId ?? DEMO_ACCOUNT_ID).trim();

    const { transactions, loading, refreshing, error, hasMore, refresh, loadMore } =
        useTransactions(accountId);

    const shortAccount = `${accountId.slice(0, 6)}…${accountId.slice(-4)}`;

    const renderItem = ({ item }: ListRenderItemInfo<TransactionItemType>) => (
        <TransactionItem item={item} accountId={accountId} />
    );

    const ListHeader = (
        <View style={s.listHeader}>
            <Text style={s.accountPill}>{shortAccount}</Text>
        </View>
    );

    const ListEmpty = loading ? (
        <View>
            {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} skeletonColor={colors.skeleton} />
            ))}
        </View>
    ) : error ? (
        <ErrorState
            message={error}
            onRetry={refresh}
        />
    ) : (
        <EmptyState
            title="No transactions yet"
            message="Payments sent or received to this account will appear here."
            icon="receipt-outline"
        />
    );

    const ListFooter = hasMore ? (
        <View style={s.footer}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
        </View>
    ) : null;

    return (
        <SafeAreaView style={s.container} edges={['top', 'bottom']}>
            {/* ── Header ── */}
            <View style={s.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={s.backBtn}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Text style={s.backChevron}>‹</Text>
                </TouchableOpacity>
                <Text style={s.headerTitle}>Transaction History</Text>
                <View style={s.backBtn} />
            </View>

            {/* ── Transaction List ── */}
            <FlatList<TransactionItemType>
                data={transactions}
                keyExtractor={item => item.pagingToken}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={ListEmpty}
                ListFooterComponent={ListFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        tintColor={colors.textSecondary}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.8}
                contentContainerStyle={
                    (transactions.length === 0 || error) && !loading
                        ? s.emptyFill
                        : undefined
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        // Header
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.surface,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontSize: 17,
            fontWeight: '600',
            color: colors.text,
        },
        backBtn: {
            width: 36,
            alignItems: 'center',
        },
        backChevron: {
            fontSize: 28,
            color: colors.text,
            lineHeight: 32,
        },

        // List header
        listHeader: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        accountPill: {
            alignSelf: 'flex-start',
            backgroundColor: colors.pillBg,
            color: colors.pillText,
            fontSize: 12,
            fontWeight: '600',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 99,
            overflow: 'hidden',
            fontFamily: 'monospace',
        },

        // Empty state
        emptyFill: {
            flexGrow: 1,
        },

        // Footer (load-more indicator)
        footer: {
            paddingVertical: 20,
            alignItems: 'center',
        },
    });
}
