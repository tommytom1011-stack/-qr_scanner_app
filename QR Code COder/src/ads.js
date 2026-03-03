
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function BannerAdMock(){
  return (
    <View style={styles.banner}>
      <Text style={{color:'#fff'}}>AdMob Banner (mock)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { height: 50, backgroundColor: '#3A506B', alignItems:'center', justifyContent:'center', borderTopWidth:1, borderTopColor:'#223'}
});
