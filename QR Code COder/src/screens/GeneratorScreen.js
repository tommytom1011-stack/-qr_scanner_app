
import React, { useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme';

function buildWifi({ssid, password, security}){
  const T = security || 'WPA';
  const S = ssid || '';
  const P = password || '';
  return `WIFI:T:${T};S:${S};P:${P};;`;
}

function buildVCard({name, phone, email}){
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    name ? `FN:${name}` : null,
    phone ? `TEL;TYPE=CELL:${phone}` : null,
    email ? `EMAIL:${email}` : null,
    'END:VCARD'
  ].filter(Boolean);
  return lines.join('\n');
}

export default function GeneratorScreen(){
  const [mode, setMode] = useState('URL'); // URL | TEXT | WIFI | CONTACT
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState({ssid:'', password:'', security:'WPA'});
  const [contact, setContact] = useState({name:'', phone:'', email:''});
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#FFFFFF');
  const [size, setSize] = useState(260);

  const ref = useRef(null);

  const value = useMemo(()=>{
    switch(mode){
      case 'URL': return url;
      case 'TEXT': return text;
      case 'WIFI': return buildWifi(wifi);
      case 'CONTACT': return buildVCard(contact);
      default: return '';
    }
  }, [mode, url, text, wifi, contact]);

  const copyContent = async ()=>{
    await Clipboard.setStringAsync(value);
  };

  const savePng = async ()=>{
    if (!ref.current) return;
    ref.current.toDataURL(async (data) => {
      const path = FileSystem.cacheDirectory + `qr_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(path, data, { encoding: FileSystem.EncodingType.Base64 });
      const available = await Sharing.isAvailableAsync();
      if (available){
        await Sharing.shareAsync(path, { mimeType: 'image/png' });
      } else {
        alert('Saved to: ' + path);
      }
    });
  };

  const ColorSwatch = ({c, onPress}) => (
    <TouchableOpacity onPress={()=>onPress(c)} style={[styles.swatch, {backgroundColor:c}]} />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      <Text style={styles.title}>Generate QR</Text>

      <View style={styles.modeRow}>
        {['URL','TEXT','WIFI','CONTACT'].map(m => (
          <TouchableOpacity key={m} onPress={()=>setMode(m)} style={[styles.modeBtn, mode===m && styles.modeBtnActive]}>
            <Text style={styles.modeText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode==='URL' && (
        <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://example.com" placeholderTextColor={colors.subtle} />
      )}
      {mode==='TEXT' && (
        <TextInput style={[styles.input, {height: 100}]} value={text} onChangeText={setText} placeholder="Enter text" placeholderTextColor={colors.subtle} multiline />
      )}
      {mode==='WIFI' && (
        <View>
          <TextInput style={styles.input} value={wifi.ssid} onChangeText={(v)=>setWifi({...wifi, ssid:v})} placeholder="Wi‑Fi SSID" placeholderTextColor={colors.subtle} />
          <TextInput style={styles.input} value={wifi.password} onChangeText={(v)=>setWifi({...wifi, password:v})} placeholder="Password" placeholderTextColor={colors.subtle} secureTextEntry />
          <View style={styles.modeRow}>
            {['WPA','WEP','nopass'].map(sec => (
              <TouchableOpacity key={sec} onPress={()=>setWifi({...wifi, security:sec})} style={[styles.modeBtn, wifi.security===sec && styles.modeBtnActive]}>
                <Text style={styles.modeText}>{sec}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {mode==='CONTACT' && (
        <View>
          <TextInput style={styles.input} value={contact.name} onChangeText={(v)=>setContact({...contact, name:v})} placeholder="Full name" placeholderTextColor={colors.subtle} />
          <TextInput style={styles.input} value={contact.phone} onChangeText={(v)=>setContact({...contact, phone:v})} placeholder="Phone" placeholderTextColor={colors.subtle} keyboardType="phone-pad" />
          <TextInput style={styles.input} value={contact.email} onChangeText={(v)=>setContact({...contact, email:v})} placeholder="Email" placeholderTextColor={colors.subtle} keyboardType="email-address" />
        </View>
      )}

      <View style={styles.previewCard}>
        <View style={{alignItems:'center'}}>
          <QRCode value={value || ' '} size={size} color={fg} backgroundColor={bg} getRef={c=>ref.current=c} />
          <Text style={styles.value} numberOfLines={2}>{value || ' '}</Text>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity onPress={copyContent} style={styles.btn}><Text style={styles.btnText}>Copy Content</Text></TouchableOpacity>
          <TouchableOpacity onPress={savePng} style={[styles.btn, {backgroundColor: colors.accent}]}><Text style={[styles.btnText, {color:'#0B132B'}]}>Save / Share PNG</Text></TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subheading}>Colors</Text>
      <View style={styles.row}>
        {["#000000","#1C2541","#3A506B","#5BC0BE","#FFFFFF","#FF5252","#4CAF50","#FFC107"].map(c => (
          <ColorSwatch key={'fg-'+c} c={c} onPress={setFg} />
        ))}
      </View>
      <Text style={styles.note}>Tap a color to set **foreground**. Long-press to set **background**.</Text>
      <View style={styles.row}>
        {["#FFFFFF","#F5F7FA","#E3F2FD","#FFFDE7","#FFF3E0","#ECEFF1"].map(c => (
          <ColorSwatch key={'bg-'+c} c={c} onPress={setBg} />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor: colors.bg, padding: 16},
  title: {color:'#fff', fontSize:20, marginBottom:12},
  subheading: {color:'#fff', marginTop:16, marginBottom:8},
  input: {backgroundColor: colors.card, color:'#fff', padding:12, borderRadius:10, marginBottom:8},
  modeRow: {flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:8},
  modeBtn: {backgroundColor: colors.card, paddingVertical:8, paddingHorizontal:12, borderRadius:8},
  modeBtnActive: {backgroundColor: colors.primary},
  modeText: {color:'#fff'},
  previewCard: {backgroundColor: colors.card, padding: 16, borderRadius: 12, marginTop: 8},
  rowBetween: {flexDirection:'row', justifyContent:'space-between', marginTop: 12},
  row: {flexDirection:'row', flexWrap:'wrap', gap:8},
  btn: {backgroundColor: colors.primary, paddingVertical:10, paddingHorizontal:12, borderRadius:8},
  btnText: {color:'#fff'},
  swatch: {width:34, height:34, borderRadius:8, borderWidth:1, borderColor:'#222'},
  value: {color: colors.subtle, marginTop: 12, textAlign:'center'}
});
