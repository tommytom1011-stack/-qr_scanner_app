
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { colors } from '../theme';
import { useScanner } from '../hooks/useScanner';
import { addHistory, getPremium } from '../storage';
import ActionSheet from '../components/ActionSheet';

function classifyContent(data){
  if (/^https?:\/\//i.test(data)) return 'URL';
  if (/^WIFI:/.test(data)) return 'WIFI';
  if (/^BEGIN:VCARD/.test(data)) return 'CONTACT';
  return 'TEXT';
}

export default function ScannerScreen(){
  const [result, setResult] = useState(null);
  const [batch, setBatch] = useState(false);
  const { hasPermission, scanned, setScanned, onScanned } = useScanner(batch);

  const handleScan = async ({ type, data }) => {
    const contentType = classifyContent(data);
    const record = {
      id: Date.now(),
      format: String(type),
      type: contentType,
      content: data,
      label: null,
      createdAt: Date.now()
    };
    await addHistory(record);
    setResult({ content: data, type: contentType });
  };

  const toggleBatch = async ()=>{
    const premium = await getPremium();
    if (!premium){
      alert('Batch mode is Premium-only (mock). Go to Settings to unlock.');
      return;
    }
    setBatch(v=>!v);
  };

  if (hasPermission === null){
    return <View style={styles.center}><Text style={styles.text}>Requesting camera permission…</Text></View>
  }
  if (hasPermission === false){
    return <View style={styles.center}><Text style={styles.text}>No access to camera</Text></View>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : onScanned(handleScan)}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Quick QR & Barcode Scanner</Text>
        <View style={styles.frame} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={()=>setScanned(false)}>
            <Text style={styles.btnText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, batch && {backgroundColor: colors.accent}]} onPress={toggleBatch}>
            <Text style={styles.btnText}>Batch: {batch? 'ON':'OFF'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {result && <ActionSheet result={result} onClose={()=>setResult(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor: 'black'},
  overlay: {position:'absolute', top:0, left:0, right:0, bottom:0, alignItems:'center', justifyContent:'flex-end', paddingBottom: 100},
  title: {position:'absolute', top: 50, color: '#fff', fontSize: 18},
  frame: {width: 260, height: 260, borderColor: colors.accent, borderWidth: 2, borderRadius: 12},
  row: {flexDirection:'row', gap: 12, marginTop: 16},
  btn: {backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8},
  btnText: {color: '#fff'},
  center: {flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.bg},
  text: {color:'#fff'}
});
