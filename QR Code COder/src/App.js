
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View } from 'react-native';
import ScannerScreen from './screens/ScannerScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import GeneratorScreen from './screens/GeneratorScreen';
import { colors } from './theme';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card, text: '#fff', primary: colors.accent }
};

function HeaderActions({navigation}){
  return (
    <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>navigation.navigate('History')} style={{marginHorizontal:8}}><Text style={{color: colors.accent}}>History</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Generator')} style={{marginHorizontal:8}}><Text style={{color: colors.accent}}>Generate</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Settings')} style={{marginHorizontal:8}}><Text style={{color: colors.accent}}>Settings</Text></TouchableOpacity>
    </View>
  );
}

export default function App(){
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={({navigation})=>({
        headerRight: () => <HeaderActions navigation={navigation} />
      })}>
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{title:'Scan'}} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Generator" component={GeneratorScreen} options={{title:'Generate'}} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
