import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Clipboard,
} from 'react-native';
import type { TransactionItem as TransactionItemType } from '../types/transaction';
import { useAppTheme } from '@/context/ThemeContext';

interface Props {
    item: TransactionItemType;
    /** The connected account ID used to determine payment direction */
    accountId: string;
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatAsset(asset: string): string {
    // If asset is "CODE:ISSUER" → show "CODE"
    const colonIdx = asset.indexOf(':');
    return colonIdx === -1 ? asset : asset.slice(0, colonIdx);
}

function shortenHash(hash: string): string {
    return `${hash.slice(0, 6)}…${hash.slice(-6)}`;
}

export default function TransactionItem({ item }: Props) {
    const { colors } = useAppTheme();
    const s = makeStyles(colors);
    const assetLabel = formatAsset(item.asset);

    const handleCopyHash = () => {
        Clipboard.setString(item.txHash);
    };

    return (
        <View style={s.row}>
            {/* Left: icon + asset */}
            <View style={s.iconWrap}>
                <Text style={s.assetIcon}>{assetLabel.slice(0, 3)}</Text>
            </View>

            {/* Middle: asset name, memo, date */}
            <View style={s.middle}>
                <Text style={s.assetName}>
                    {assetLabel}
                </Text>
                {item.memo ? (
                    <Text style={s.memo} numberOfLines={1}>
                        {item.memo}
                    </Text>
                ) : null}
                <TouchableOpacity onPress={handleCopyHash} activeOpacity={0.6}>
                    <Text style={s.txHash}>{shortenHash(item.txHash)}</Text>
                </TouchableOpacity>
                <Text style={s.date}>{formatDate(item.timestamp)}</Text>
            </View>

            {/* Right: amount */}
            <View style={s.right}>
                <Text style={s.amount} numberOfLines={1} adjustsFontSizeToFit>
                    {parseFloat(item.amount).toFixed(2)}
                </Text>
                <Text style={s.assetCode}>{assetLabel}</Text>
            </View>
        </View>
    );
}

function makeStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
    return StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
        },
        iconWrap: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
        },
        assetIcon: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.textSecondary,
            letterSpacing: -0.5,
        },
        middle: {
            flex: 1,
            gap: 2,
        },
        assetName: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
        },
        memo: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        txHash: {
            fontSize: 11,
            color: colors.textMuted,
            fontFamily: 'monospace',
        },
        date: {
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 1,
        },
        right: {
            alignItems: 'flex-end',
            marginLeft: 8,
            maxWidth: 110,
        },
        amount: {
            fontSize: 15,
            fontWeight: '700',
            color: colors.text,
        },
        assetCode: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
        },
    });
}
