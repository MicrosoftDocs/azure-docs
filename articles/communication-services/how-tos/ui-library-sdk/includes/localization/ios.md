---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

### Language Detection

If your application supports localization, the UI Library will be displayed based on user's system preferred language if it's part of the `Available Languages` listed below. Otherwise will default our predefined English (`en`) strings.

### Available Languages

The following table of `locale` with out of the box translations. If you want to localize the composite, pass the `locale` into `LocalizationConfiguration` as options into `CallComposite`.

|         Language         | CommunicationUISupportedLocale       |    identifier  |
|:------------------------:|:------------------:|:------------:|
| Chinese, Simplified | zh | zh |
| Chinese, Simplified | zhHans | zh-Hans |
| Chinese, Simplified (China mainland) | zhHansCN | zh-Hans-CN |
| Chinese, Traditional | zhHant | zh-Hant |
| Chinese, Traditional (Taiwan) | zhHantTW | zh-Hant-TW |
| Dutch | nl | nl |
| Dutch (Netherlands) | nlNL | nl-NL |
| English | en | en |
| English (United Kingdom) | enGB | en-GB |
| English (United States) | enUS | en-US |
| French | fr | fr |
| French (France) | frFR | fr-FR |
| German | de | de |
| German (Germany) | deDE | de-DE |
| Italian | it | it |
| Italian (Italy) | itIT | it-IT |
| Japanese | ja | ja |
| Japanese (Japan) | jaJP | ja-JP |
| Korean | ko | ko |
| Korean (South Korea) | koKR | ko-KR |
| Portuguese | pt | pt |
| Portuguese (Brazil) | ptBR | pt-BR |
| Russian | ru | ru |
| Russian (Russia) | ruRU | ru-RU |
| Spanish | es | es |
| Spanish (Spain) | esES | es-ES |
| Turkish | tr | tr |
| Turkish (Turkey) | trTR | tr-TR |

You can also obtain list of `locale` by the static function `LocalizationConfiguration.supportedLanguages` will return list of Locale structs.

```swift
let locales: [String] = LocalizationConfiguration.supportedLanguages.map{ $0.identifier }
print(locales)

// ["de", "de-DE", "en", "en-GB", "en-US", "es", "es-ES", "fr", "fr-FR", "it", "it-IT", "ja", "ja-JP", "ko", "ko-KR", "nl", "nl-NL", "pt", "pt-BR", "ru", "ru-RU", "tr", "tr-TR", "zh", "zh-Hans", "zh-Hans-CN", "zh-Hant", "zh-Hant-TW"]
```

### LocalizationConfiguration

`LocalizationConfiguration` is an options wrapper that sets all the strings for UI Library components using a `locale` or `locale`. By default, all text labels use our English (`en`) strings. If desired, `LocalizationConfiguration` can be used to set a different `locale` or `locale`. Out of the box, the UI library includes a set of `locale` usable with the UI components and composites.

To use the `LocalizationConfiguration`, specify a `locale` Swift Locale struct (with or without a region code), and pass it to the `CallCompositeOptions`. For the example below, we'll localize the composite to French for France (`fr-FR`).

```swift
// Creating swift Locale struct
var localizationConfig = LocalizationConfiguration(locale: Locale(identifier: "fr-FR"))

// Use intellisense CommunicationUISupportedLocale to get supported Locale struct
localizationConfig = LocalizationConfiguration(locale: CommunicationUISupportedLocale.frFR)

let callCompositeOptions = CallCompositeOptions(localization: localizationConfig)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-localization.png" alt-text="iOS localization":::

### Layout Direction

Certain cultures (Arabic, Hebrew, etc.) may need  for localization to have right-to-left layout. You can specify the `layoutDirection` as part of the `LocalizationConfiguration`. The layout of the composite will be mirrored but the text will remain in the direction of the string.

```swift
var localizationConfig: LocalizationConfiguration

// Initializer with locale and layoutDirection
localizationConfig = LocalizationConfiguration(locale: Locale(identifier: "en"),
                                               layoutDirection: .rightToLeft)

// Initializer with locale, localizableFilename, and layoutDirection
localizationConfig = LocalizationConfiguration(locale: Locale(identifier: "en"),
                                               localizableFilename: "Localizable",
                                               layoutDirection: .rightToLeft)

// Add localization configuration as option
let callCompositeOptions = CallCompositeOptions(localization: localizationConfig)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

You can see below the right-to-left layout mirroring, by default without specifying `layoutDirection` will default to false (left-to-right layout).

|`layoutDirection = .leftToRight` (default) | `layoutDirection = .rightToLeft`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/ios-righttoleft-false.png" alt-text="iOS layout direction left-to-right"::: | :::image type="content" source="media/ios-righttoleft-true.png" alt-text="iOS layout direction right-to-left":::  |

### Customizing Translations

There are two options to customize the language translations that we provide. To override a particular string, you can find the list of localization keys here for the key-value pair. You can specify the `locale` to be one of the supported languages, and when a key isn't provided, will fall back to our supported translation string. If you specified an unsupported language, you should provide translations for all the keys for that language (using Localizable.strings file), and will fall back to English strings when a key isn't provided.

Let's say you wish to have the `ControlBar` with strings from our English (US) locale but you want to change the label of `JoinCall` button to "Start Meeting" (instead of "Join call") in Setup View.

#### Override using Localization.strings file

Enable Localization in the Project, below for the `locale` you want to override. Create a `Localizable.strings` file (or other filename with extension `.strings`) with the key-value pair for selected keys you want to override. In the example below, we're overriding the key `AzureCommunicationUI.SetupView.Button.JoinCall`.

:::image type="content" source="media/ios-setup-project.png" alt-text="iOS setup project":::

To specify you're overriding with Localization.strings, create a `LocalizationConfiguration` object to specify the `locale` and `localizationFilename`. Or when using the `locale` initializer, will look keys in Localizable.strings for `locale.collatorIdentifier` as the language in your project.

```swift
let localizationConfig = LocalizationConfiguration(locale: Locale(identifier: "fr"),
                                                   localizableFilename: "Localizable")
let callCompositeOptions = CallCompositeOptions(localization: localizationConfig)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-custom-string.png" alt-text="iOS custom string":::
