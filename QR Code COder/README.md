
# Quick QR & Barcode Scanner (Expo/React Native)

A simple, fast QR & barcode scanner with history. Ads and IAP are **mocked** so you can add real AdMob IDs and product IDs later.

## Features
- Scan QR/Barcode (Expo BarCodeScanner)
- Save history locally (AsyncStorage)
- Search, delete, label (labels are Premium-only)
- Batch scan mode (Premium-only)
- CSV export (Premium-only) via FileSystem + Sharing
- QR Generator (URL, Text, Wi‑Fi, Contact)

## Run
```bash
npm install
npx expo start
```

## Build (Android-only for now)
```bash
npx expo run:android
```
