
import { useEffect, useState, useRef } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function useScanner(batch=false){
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const scanningRef = useRef(false);

  useEffect(()=>{
    (async ()=>{
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  },[]);

  const onScanned = (handler) => async ({ type, data }) => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanned(true);
    await handler({type, data});
    if (batch){
      setScanned(false);
      scanningRef.current = false;
    }
  };

  return { hasPermission, scanned, setScanned, onScanned };
}
