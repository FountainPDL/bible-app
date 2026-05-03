# FountainPDL's Bible 📖

A professional KJV & NIV Bible app built with React + Vite + Capacitor.  
Deployable as an Android APK via GitHub Actions — no Android Studio required.

---

## ✨ Feature Overview

| Feature | Details |
|---|---|
| **Translations** | KJV & NIV — toggle with one tap from the top bar |
| **Red Letter** | Words of Jesus highlighted in red (NT only, toggleable) |
| **Reading Modes** | Full Chapter (scroll to verse) / Verse Range |
| **Display Modes** | Scroll / Book / Dual Page (landscape) |
| **Theme** | Light · Dark · AMOLED Black + Auto Night Mode |
| **Custom Colors** | Pick any primary + accent from presets or color wheel |
| **Typography** | 9 serif fonts, adjustable size & line spacing |
| **Verse Selection** | Tap one or more verses → floating action bar appears |
| **Highlight** | Verse-level or word/phrase-level, with color picker |
| **Underline** | Verse-level or word/phrase-level |
| **Bookmarks** | Per-verse or whole chapter |
| **Word Annotations** | Annotate specific words or phrases within a verse |
| **Notes** | Topic + body + verse references |
| **Sermon Builder** | Interleave verse boxes and commentary blocks |
| **Reading Marathon** | 8 plans (Full Bible, NT First, Chronological, Gospels, etc.), track per-chapter progress |
| **Library** | 6 tabs: History · Bookmarks · Highlights · Notes · Sermons · Marathon |
| **Offline** | Key passages embedded; all others cached after first load |
| **Persistent** | All data stored in localStorage — survives app restarts |

---

## 📁 Project Structure

```
fountainpdl-bible/
├── .github/
│   └── workflows/
│       └── build-apk.yml          ← GitHub Actions APK build
├── public/
│   ├── manifest.json              ← PWA manifest
│   └── icons/                     ← App icons (add icon-192.png & icon-512.png)
├── src/
│   ├── main.jsx                   ← React entry point
│   ├── App.jsx                    ← Root component, state management
│   ├── constants/
│   │   ├── books.js               ← Book lists, chapter counts, reading plans, Jesus verse sets
│   │   └── verses.js              ← Embedded offline KJV + NIV verse data
│   ├── hooks/
│   │   └── useLocalStorage.js     ← Persistent state hook
│   ├── utils/
│   │   ├── verseApi.js            ← Fetch + cache verses from Claude API
│   │   ├── theme.js               ← Theme builder, color helpers, font list
│   │   └── format.js              ← Date formatting, ref parsing, verse sorting
│   ├── components/
│   │   ├── TopBar.jsx             ← Logo, reference, translation toggle, note button
│   │   ├── BottomNav.jsx          ← Read / Navigate / Library / Settings tabs
│   │   ├── ActionBar.jsx          ← Floating action bar (appears on verse selection)
│   │   └── Modal.jsx              ← Reusable bottom-sheet modal + form helpers
│   ├── pages/
│   │   ├── ReadPage.jsx           ← Scripture display with verse rendering
│   │   ├── NavPage.jsx            ← 3-step book → chapter → verse selector
│   │   ├── LibraryPage.jsx        ← All 6 library tabs + sermon/marathon modals
│   │   └── SettingsPage.jsx       ← All settings: theme, typography, reading, data
│   └── modals/
│       ├── NoteModal.jsx          ← New note form
│       └── WordActionModal.jsx    ← Annotate specific words/phrases
├── index.html
├── vite.config.js
├── capacitor.config.json
└── package.json
```

---

## 🚀 Getting the APK via GitHub Actions

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) → **New repository**
2. Name: `fountainpdl-bible` · Visibility: **Public**
3. Click **Create repository**

### Step 2 — Upload the project

**Option A — Terminal:**
```bash
git clone https://github.com/YOUR_USERNAME/fountainpdl-bible.git
cd fountainpdl-bible

# Copy all files from this project into the folder, then:
git add .
git commit -m "Initial commit"
git push origin main
```

**Option B — GitHub Desktop:**  
File → Add Local Repository → select the project folder → Publish

**Option C — GitHub web upload:**  
Drag the entire folder into the GitHub repo page.

### Step 3 — GitHub Actions builds the APK

After every push to `main`, the workflow at `.github/workflows/build-apk.yml` will:
1. Install Node 20 & dependencies
2. Build the React/Vite app (`npm run build`)
3. Install Capacitor + Android SDK
4. Compile and output a debug APK

⏱ First build takes ~8–12 minutes.

### Step 4 — Download the APK

1. Go to your GitHub repo → **Actions** tab
2. Click the latest **"Build Android APK"** run
3. Scroll to **Artifacts** at the bottom → click **FountainPDL-Bible-APK**
4. Unzip the downloaded file → you'll have `app-debug.apk`

### Step 5 — Install on Android

1. Copy `app-debug.apk` to your phone (via USB, Google Drive, or email)
2. **Settings → Security → Install unknown apps** → allow your file manager or browser
3. Open the APK → **Install**
4. The app appears as **FountainPDL Bible**

---

## 🔑 Optional: Signed Release APK (smaller & faster)

For a production-quality signed APK:

```bash
# 1. Generate a keystore on your computer
keytool -genkey -v \
  -keystore fountainpdl.keystore \
  -alias fountainpdl \
  -keyalg RSA -keysize 2048 -validity 10000

# 2. Base64-encode the keystore
base64 fountainpdl.keystore   # copy the output
```

Add these **GitHub Secrets** (repo → Settings → Secrets and variables → Actions):

| Secret name | Value |
|---|---|
| `KEYSTORE_BASE64` | base64 output from above |
| `KEY_ALIAS` | `fountainpdl` |
| `KEY_PASSWORD` | your password |
| `STORE_PASSWORD` | your store password |

Then push a tag to trigger a release build:
```bash
git tag v1.0.0
git push origin v1.0.0
```

The APK will be attached to a GitHub Release automatically.

---

## 🛠 Local Development

```bash
npm install
npm run dev          # Development server at http://localhost:5173
npm run build        # Production build → dist/
npm run preview      # Preview the production build
```

### Run on Android (requires Android Studio installed):
```bash
npm run build
npm install @capacitor/core @capacitor/android @capacitor/cli
npx cap add android
npx cap sync android
npx cap open android   # Opens Android Studio → Run on device or emulator
```

---

## 📱 Adding App Icons

Place your icon files in `public/icons/`:
- `icon-192.png` — 192×192 px
- `icon-512.png` — 512×512 px

The icon should be the FountainPDL logo on a purple (`#7B2FBE`) background.  
You can generate all required sizes at [maskable.app](https://maskable.app/editor).

---

## 📖 Offline Scripture — Complete ✅

Both translations are **100% offline**. No internet connection is ever required to read scripture.

| Translation | Verses | Chapters | Books | Source |
|---|---|---|---|---|
| KJV | 31,102 | 1,189 | 66 | SQL database (Public Domain, 1769) |
| NIV | 31,086 | 1,189 | 66 | SQL database |

The data is bundled as 4 JavaScript files loaded at startup:
-  — KJV Old Testament (~3.2 MB)
-  — KJV New Testament (~1.0 MB)
-  — NIV Old Testament (~2.9 MB)
-  — NIV New Testament (~0.9 MB)

Vite bundles and minifies these at build time. The final APK includes all ~8 MB of scripture data compressed inside it — no network calls, no API keys needed, works completely offline.
## 📖 Offline Scripture — Complete ✅

Both translations are **100% offline**. No internet connection is ever required to read scripture.

| Translation | Verses | Chapters | Books | Source |
|---|---|---|---|---|
| KJV | 31,102 | 1,189 | 66 | SQL database (Public Domain, 1769) |
| NIV | 31,086 | 1,189 | 66 | SQL database |

The data is bundled as 4 JavaScript files loaded at startup:
-  — KJV Old Testament (~3.2 MB)
-  — KJV New Testament (~1.0 MB)
-  — NIV Old Testament (~2.9 MB)
-  — NIV New Testament (~0.9 MB)

Vite bundles and minifies these at build time. The final APK includes all ~8 MB of scripture data compressed inside it — no network calls, no API keys needed, works completely offline.
## 🎨 Default Theme

| Element | Light | Dark | AMOLED |
|---|---|---|---|
| Background | `#FFFFFF` | `#0F0A1A` | `#000000` |
| Surface | `#FDF8FF` | `#160E24` | `#080408` |
| Primary | `#7B2FBE` (purple) | same | same |
| Accent | `#C0392B` (red) | same | same |

Both colors are fully customizable in Settings with 8 presets + free color picker.

---

## 📄 License

- KJV Scripture: Public domain (1769 Blayney Edition)
- NIV Scripture: © Biblica — for personal study use
- App code: MIT License
# bible-app
