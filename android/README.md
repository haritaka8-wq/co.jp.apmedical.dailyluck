# 陰陽五行の日運占い (Waunreki Fortune) - Android Native Project

## 1. プロジェクト概要 & 仕様対応
- **パッケージID**: `com.waunreki.fortune`
- **対象プラットフォーム**: Android (Kotlin, Jetpack Compose)
- **targetSdk**: `36` (Google Play 2026年最新提出要件準拠)
- **minSdk**: `26` (Android 8.0 Oreo 以上)
- **アーキテクチャ**: MVVM + Clean Architecture + Repository Pattern
- **オフライン動作**: 外部サーバー・有料AI API完全不要、端末内完結 (Room + Preferences DataStore)
- **占術仕様**: 四柱推命不使用。生年月日からの独自五行判定 `N = (Y + 3M + 7D) mod 10`、8問の五行体質診断、経過日数 `days mod 5` による当日の五行、相生・相剋による決定論的日運計算。

## 2. ディレクトリ構成
```
android/
├── app/
│   ├── build.gradle.kts
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   └── java/com/waunreki/fortune/
│       │       ├── domain/engine/
│       │       │   ├── FiveElementsEngine.kt  (N式, 当日五行, 相生相剋, スコア)
│       │       │   ├── QuizEngine.kt          (8問集計, タイブレーク固定順)
│       │       │   └── FortuneAdvisor.kt      (決定論的アドバイス生成)
│       │       └── data/local/
│       │           └── FortuneHistoryEntity.kt(Room DB エンティティ & DAO)
│       └── test/
│           └── java/com/waunreki/fortune/
│               └── FiveElementsEngineTest.kt  (JUnit5 自動テスト 15項目)
└── build.gradle.kts
```

## 3. Google Play提出用AABのビルド手順
1. **テスト実行**:
   ```bash
   ./gradlew test
   ```
2. **デバッグAPK生成**:
   ```bash
   ./gradlew assembleDebug
   # 出力先: app/build/outputs/apk/debug/app-debug.apk
   ```
3. **Google Play提出用AAB生成 (Release Bundle)**:
   ```bash
   ./gradlew bundleRelease
   # 出力先: app/build/outputs/bundle/release/app-release.aab
   ```

## 4. リリース署名 (Release Signing) 設定について
セキュリティ規約に従い、キーストア秘密鍵およびパスワードはコードリポジトリに埋め込まず、環境変数または `keystore.properties` にて注入します。
```kotlin
// build.gradle.kts 署名設定例
signingConfigs {
    create("release") {
        storeFile = file(System.getenv("KEYSTORE_PATH") ?: "my-release-key.jks")
        storePassword = System.getenv("KEYSTORE_PASSWORD")
        keyAlias = System.getenv("KEY_ALIAS")
        keyPassword = System.getenv("KEY_PASSWORD")
    }
}
```
