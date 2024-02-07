---
description: Learn how to use the Calling composite on iOS.
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Language detection

If your application supports localization, the UI Library is displayed based on the user's system-preferred language if it's part of the available languages listed in the next section. Otherwise, the language defaults to the predefined English (`en`) strings.

### Available languages

The following table lists out-of-the-box translations for `locale`. If you want to localize the composite, pass `locale` into `LocalizationOptions` as options into `CallComposite`.

|         Language         | SupportedLocale       |    Identifier  |
|:------------------------:|:------------------:|:------------:|
| Chinese, Simplified | `zh` | `zh` |
| Chinese, Simplified | `zhHans` | `zh-Hans` |
| Chinese, Simplified (China mainland) | `zhHansCN` | `zh-Hans-CN` |
| Chinese, Traditional | `zhHant` | `zh-Hant` |
| Chinese, Traditional (Taiwan) | `zhHantTW` | `zh-Hant-TW` |
| Dutch | `nl` | `nl` |
| Dutch (Netherlands) | `nlNL` | `nl-NL` |
| English | `en` | `en` |
| English (United Kingdom) | `enGB` | `en-GB` |
| English (United States) | `enUS` | `en-US` |
| French | `fr` | `fr` |
| French (France) | `frFR` | `fr-FR` |
| German | `de` | `de` |
| German (Germany) | `deDE` | `de-DE` |
| Italian | `it` | `it` |
| Italian (Italy) | `itIT` | `it-IT` |
| Japanese | `ja` | `ja` |
| Japanese (Japan) | `jaJP` | `ja-JP` |
| Korean | `ko` | `ko` |
| Korean (South Korea) | `koKR` | `ko-KR` |
| Portuguese | `pt` | `pt` |
| Portuguese (Brazil) | `ptBR` | `pt-BR` |
| Russian | `ru` | `ru` |
| Russian (Russia) | `ruRU` | `ru-RU` |
| Spanish | `es` | `es` |
| Spanish (Spain) | `esES` | `es-ES` |
| Turkish | `tr` | `tr` |
| Turkish (Türkiye) | `trTR` | `tr-TR` |

You can also get a list of `locale` structures by using the static function `SupportedLocale.values`.

```swift
let locales: [Locale] = SupportedLocale.values.map{ $0.identifier }
print(locales)

// ["de", "de-DE", "en", "en-GB", "en-US", "es", "es-ES", "fr", "fr-FR", "it", "it-IT", "ja", "ja-JP", "ko", "ko-KR", "nl", "nl-NL", "pt", "pt-BR", "ru", "ru-RU", "tr", "tr-TR", "zh", "zh-Hans", "zh-Hans-CN", "zh-Hant", "zh-Hant-TW"]
```

### LocalizationOptions

`LocalizationOptions` is an options wrapper that sets all the strings for UI Library components by using `locale`. By default, all text labels use English (`en`) strings. You can use `LocalizationOptions` to set a different `locale` structure. Out of the box, the UI Library includes a set of `locale` structures that are usable with the UI components and composites.

To use `LocalizationOptions`, specify a Swift `locale` structure (with or without a region code) and pass it to `CallCompositeOptions`. The following example localizes the composite to French for France (`fr-FR`).

```swift
// Creating a Swift locale structure
var localizationOptions = LocalizationOptions(locale: Locale(identifier: "fr-FR"))

// Use IntelliSense SupportedLocale to get supported locale structures
localizationOptions = LocalizationOptions(locale: SupportedLocale.frFR)

let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-localization.png" alt-text="Screenshot that shows iOS localization.":::

### Layout direction

Certain cultures (for example, Arabic and Hebrew) might need localization to have right-to-left layout. You can specify `layoutDirection` as part of `LocalizationOptions`. The layout of the composite will be mirrored, but the text will remain in the direction of the string.

```swift
var localizationOptions: LocalizationOptions

// Initializer with locale and layoutDirection
localizationOptions = LocalizationOptions(locale: Locale(identifier: "en"),
                                          layoutDirection: .rightToLeft)

// Initializer with locale, localizableFilename, and layoutDirection
localizationOptions = LocalizationOptions(locale: Locale(identifier: "en"),
                                          localizableFilename: "Localizable",
                                          layoutDirection: .rightToLeft)

// Add localizationOptions as an option
let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

The following example shows right-to-left layout mirroring. If you don't specify `layoutDirection`, it defaults to `false` (left-to-right layout).

|`layoutDirection = .leftToRight` (default) | `layoutDirection = .rightToLeft`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/ios-righttoleft-false.png" alt-text="Screenshot that shows an iOS layout direction of left to right."::: | :::image type="content" source="media/ios-righttoleft-true.png" alt-text="Screenshot that shows an iOS layout direction of right to left.":::  |

### Customizing translations

There are two options to customize the language translations that we provide. To override a particular string, you can use the [list of localization keys](https://github.com/Azure/communication-ui-library-ios/blob/main/AzureCommunicationUI/AzureCommunicationUIDemoApp/Sources/Views/en.lproj/Localizable.strings) for the key/value pair. You can specify `locale` as one of the supported languages. When a key isn't provided, it falls back to a supported translation string. If you specify an unsupported language, you should provide translations for all the keys for that language (by using the `Localizable.strings` file) and then fall back to English strings when a key isn't provided.

Let's say you want to have the control bar use strings from the English (US) locale, but you want to change the label of the **Join Call** button to **Start Meeting** in setup view. Enable localization in the project for the `locale` instance that you want to override. Create a `Localizable.strings` file (or another file name with the extension `.strings`) with the key/value pair for selected keys that you want to override. The following example overrides the key `AzureCommunicationUI.SetupView.Button.JoinCall`.

:::image type="content" source="media/ios-setup-project.png" alt-text="Screenshot that shows an iOS setup project.":::

:::image type="content" source="media/ios-custom-string.png" alt-text="Screenshot that shows an iOS custom string.":::

To specify that you're overriding with `Localizable.strings`, create a `LocalizationOptions` object to specify `locale` and `localizationFilename`. Or when you're using the `locale` initializer, it looks at keys in `Localizable.strings` for `locale.collatorIdentifier` as the language in your project.

```swift
let localizationOptions = LocalizationOptions(locale: Locale(identifier: "fr"),
                                              localizableFilename: "Localizable")
let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

### Accessibility voiceover for localization

For voiceover to work properly for a localization, make sure the language is added into your app's localizations. The voiceover then detects that the app supports the language specified in `LocalizationOptions` for `locale`. It selects the speech voice for the language by using the voice found in **Settings** > **Accessibility** > **Speech** on the device. You can verify that the language is added to your project, as shown in the following example.

:::image type="content" source="media/ios-xcode-project-localizations.png" alt-text="Screenshot that shows iOS Xcode project localizations.":::
