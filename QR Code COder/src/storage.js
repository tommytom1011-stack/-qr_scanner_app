
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'scan_history_v1';
const PREMIUM_KEY = 'premium_unlocked_v1';

export async function getHistory(){
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHistory(items){
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export async function addHistory(item){
  const items = await getHistory();
  items.unshift(item);
  await saveHistory(items);
}

export async function clearHistory(){
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function getPremium(){
  const v = await AsyncStorage.getItem(PREMIUM_KEY);
  return v === '1';
}

export async function setPremium(v){
  await AsyncStorage.setItem(PREMIUM_KEY, v ? '1' : '0');
}
