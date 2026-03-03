
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { getPremium } from '../storage';
import { purchasePremiumMock } from '../billing/iap';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getHistory } from '../storage';

export default function SettingsScreen(){
  const [premium, setPremium] = useState(false);

  const load = async ()=> setPremium(await getPremium());
  useEffect(()=>{ load(); },[]);

  const buy = async ()=>{
    const ok = await purchasePremiumMock();
    if (ok) setPremium(true);
  };

  const exportCsv = async ()=>{
    if (!premium){ alert('CSV export is Premium-only (mock).'); return; }
    const items = await getHistory();
    const header = 'id,type,format,content,label,createdAt
';
    const rows = items.map(it=> [it.id, it.type, it.format, JSON.stringify(it.content), JSON.stringify(it.label||''), it.createdAt].join(','));
    const csv = header + rows.join('
');
    const path = FileSystem.cacheDirectory + `scan_history_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(path, csv, {encoding: FileSystem.EncodingType.UTF8});
    const available = await Sharing.isAvailableAsync();
    if (available){
      await Sharing.shareAsync(path, {mimeType: 'text/csv'});
    } else {
      alert('CSV saved to: ' + path);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.item}>Premium: {premium? 'Unlocked' : 'Locked'}</Text>
      <TouchableOpacity onPress={buy} style={styles.btn}><Text style={styles.btnText}>Unlock Premium (Mock)</Text></TouchableOpacity>
      <TouchableOpacity onPress={exportCsv} style={styles.btn}><Text style={styles.btnText}>Export CSV</Text></TouchableOpacity>
      <Text style={styles.note}>Notes: Ads and purchases are mocked. Add real AdMob & IAP later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor: colors.bg, padding: 16},
  title: {color:'#fff', fontSize:20, marginBottom:16},
  item: {color:'#fff', marginBottom: 8},
  btn: {backgroundColor: colors.primary, padding: 12, borderRadius: 10, marginTop: 10},
  btnText: {color:'#fff', textAlign:'center'},
  note: {color: colors.subtle, marginTop: 12}
});
