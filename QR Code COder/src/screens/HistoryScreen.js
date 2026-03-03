
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { colors } from '../theme';
import { getHistory, saveHistory, getPremium } from '../storage';
import { BannerAdMock } from '../ads';

export default function HistoryScreen(){
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [premium, setPremium] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tempLabel, setTempLabel] = useState('');

  const load = async ()=>{
    setItems(await getHistory());
    setPremium(await getPremium());
  };
  useEffect(()=>{ const t = setInterval(load, 600); return ()=>clearInterval(t); },[]);

  const openRename = async (id)=>{
    if (!premium){ alert('Renaming is Premium-only (mock).'); return; }
    const item = items.find(i=>i.id===id);
    setTempLabel(item?.label || '');
    setEditingId(id);
  };

  const saveRename = async ()=>{
    const next = items.map(it=> it.id===editingId ? {...it, label: tempLabel} : it);
    setItems(next);
    await saveHistory(next);
    setEditingId(null);
  };

  const del = async (id)=>{
    const next = items.filter(it=>it.id!==id);
    setItems(next);
    await saveHistory(next);
  };

  const filtered = items.filter(it=> (it.content+ (it.label||'') + it.type).toLowerCase().includes(q.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search" placeholderTextColor={colors.subtle} style={styles.search} value={q} onChangeText={setQ} />
      <FlatList
        data={filtered}
        keyExtractor={it=>String(it.id)}
        renderItem={({item})=> (
          <View style={styles.row}>
            <View style={{flex:1}}>
              <Text style={styles.type}>{item.type} · {item.format}</Text>
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
              {item.label ? <Text style={styles.label}>Label: {item.label}</Text> : null}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>openRename(item.id)} style={styles.actionBtn}><Text style={styles.actionText}>Label</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>del(item.id)} style={styles.actionBtn}><Text style={styles.actionText}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{color:colors.subtle, textAlign:'center', marginTop:32}}>No scans yet</Text>}
      />
      <BannerAdMock />

      <Modal visible={editingId!==null} transparent animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={{color:'#fff', marginBottom:8}}>Set label</Text>
            <TextInput value={tempLabel} onChangeText={setTempLabel} style={styles.modalInput} placeholder="Enter label" placeholderTextColor={colors.subtle} />
            <View style={{flexDirection:'row', justifyContent:'flex-end', gap:8, marginTop:8}}>
              <TouchableOpacity onPress={()=>setEditingId(null)} style={styles.modalBtn}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={saveRename} style={styles.modalBtn}><Text style={styles.actionText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor: colors.bg, paddingTop: 8},
  search: {marginHorizontal:16, marginBottom:8, padding:12, backgroundColor: colors.card, color:'#fff', borderRadius:8},
  row: {flexDirection:'row', gap: 12, padding: 12, marginHorizontal: 12, marginVertical:6, backgroundColor: colors.card, borderRadius: 12},
  type: {color: colors.accent, marginBottom: 6},
  content: {color: '#fff'},
  label: {color: colors.subtle, marginTop:4},
  actions: {justifyContent:'center', alignItems:'flex-end', gap:8},
  actionBtn: {backgroundColor: colors.primary, paddingHorizontal:10, paddingVertical:6, borderRadius:8},
  actionText: {color:'#fff'},
  modalWrap: {flex:1, backgroundColor:'rgba(0,0,0,0.6)', alignItems:'center', justifyContent:'center'},
  modalCard: {backgroundColor: colors.card, padding: 16, borderRadius: 12, width: '84%'},
  modalInput: {backgroundColor: colors.bg, color:'#fff', padding:10, borderRadius:8},
  modalBtn: {paddingHorizontal:10, paddingVertical:8, backgroundColor: colors.primary, borderRadius:8}
});
