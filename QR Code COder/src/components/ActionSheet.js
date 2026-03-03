
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme';

export default function ActionSheet({result, onClose}){
  if (!result) return null;
  const { content, type } = result;

  const openUrl = async () => {
    if (content && content.startsWith('http')) {
      await Linking.openURL(content);
    }
  };

  const copy = async () => {
    await Clipboard.setStringAsync(content);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type}</Text>
      <Text style={styles.content} numberOfLines={4}>{content}</Text>
      <View style={styles.actions}>
        {type === 'URL' && <Button title="Open" onPress={openUrl} />}
        <Button title="Copy" onPress={copy} />
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
}

function Button({title, onPress}){
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}><Text style={styles.btnText}>{title}</Text></TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.card, padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16},
  title: {color: colors.accent, fontSize: 16, marginBottom: 8},
  content: {color: colors.text, marginBottom: 12},
  actions: {flexDirection:'row', gap: 12},
  btn: {backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8},
  btnText: {color: '#fff'}
});
