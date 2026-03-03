
import React from 'react';
import { Alert } from 'react-native';
import { getPremium, setPremium } from '../storage';

export async function purchasePremiumMock(){
  const has = await getPremium();
  if (has){
    Alert.alert('Premium', 'Already unlocked');
    return true;
  }
  return new Promise((resolve)=>{
    Alert.alert('Purchase (Mock)', 'Simulate one-time Premium unlock?', [
      {text:'Cancel', style:'cancel', onPress:()=>resolve(false)},
      {text:'Unlock', onPress: async ()=>{ await setPremium(true); resolve(true);} }
    ]);
  });
}
