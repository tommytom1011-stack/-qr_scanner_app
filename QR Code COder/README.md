
# Quick QR & Barcode Scanner (Final, Android-only)

**Important:** Replace the placeholder EAS Project ID in `app.json` before building on Expo:

```
"extra": { "eas": { "projectId": "REPLACE_WITH_YOUR_EAS_PROJECT_ID" } }
```

## Where to find your EAS Project ID
On https://expo.dev → open your project → **Project settings → General** → copy **Project ID** (UUID). Paste it into `app.json`.

## Build (Expo cloud → APK)
1. Upload this folder **at the repo root** on GitHub.
2. On https://expo.dev → connect GitHub repo to your project.
3. Go to **Builds → Create a build** → Platform **Android**, Profile **production**, Base directory **(leave blank)**.
4. Ignore the "Missing lockfile" warning. When complete, click **Download APK**.

## Notes
- `eas.json` has `cli.appVersionSource = "remote"` to satisfy future EAS requirement.
- Scanner uses `expo-camera` (no expo-barcode-scanner).
- If you choose to keep code in a subfolder, set **Base directory** to that exact folder name in the build modal.
