---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Language Detection

If your application supports localization, the UI Library will be displayed based on user's system preferred language if it's part of the `Available Languages` listed below. Otherwise will default our predefined English (`en`) strings.

### Available Languages

The following table of `locale` with out of the box translations. If you want to localize the composite, pass the `locale` into `LocalizationOptions` as options into `CallComposite`.

|         Language         | SupportedLocale       |    identifier  |
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
| Turkish (Türkiye) | trTR | tr-TR |

You can also obtain list of `locale` by the static function `SupportedLocale.values` will return list of Locale structs.

```swift
let locales: [Locale] = SupportedLocale.values.map{ $0.identifier }
print(locales)

// ["de", "de-DE", "en", "en-GB", "en-US", "es", "es-ES", "fr", "fr-FR", "it", "it-IT", "ja", "ja-JP", "ko", "ko-KR", "nl", "nl-NL", "pt", "pt-BR", "ru", "ru-RU", "tr", "tr-TR", "zh", "zh-Hans", "zh-Hans-CN", "zh-Hant", "zh-Hant-TW"]
```

### LocalizationOptions

`LocalizationOptions` is an options wrapper that sets all the strings for UI Library components using a `locale`. By default, all text labels use our English (`en`) strings. If desired, `LocalizationOptions` can be used to set a different `locale`. Out of the box, the UI library includes a set of `locale` usable with the UI components and composites.

To use the `LocalizationOptions`, specify a `locale` Swift Locale struct (with or without a region code), and pass it to the `CallCompositeOptions`. For the example below, we'll localize the composite to French for France (`fr-FR`).

```swift
// Creating swift Locale struct
var localizationOptions = LocalizationOptions(locale: Locale(identifier: "fr-FR"))

// Use intellisense SupportedLocale to get supported Locale struct
localizationOptions = LocalizationOptions(locale: SupportedLocale.frFR)

let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-localization.png" alt-text="iOS localization":::

### Layout Direction

Certain cultures (Arabic, Hebrew, etc.) may need  for localization to have right-to-left layout. You can specify the `layoutDirection` as part of the `LocalizationOptions`. The layout of the composite will be mirrored but the text will remain in the direction of the string.

```swift
var localizationOptions: LocalizationOptions

// Initializer with locale and layoutDirection
localizationOptions = LocalizationOptions(locale: Locale(identifier: "en"),
                                          layoutDirection: .rightToLeft)

// Initializer with locale, localizableFilename, and layoutDirection
localizationOptions = LocalizationOptions(locale: Locale(identifier: "en"),
                                          localizableFilename: "Localizable",
                                          layoutDirection: .rightToLeft)

// Add localizationOptions as option
let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

You can see below the right-to-left layout mirroring, by default without specifying `layoutDirection` will default to false (left-to-right layout).

|`layoutDirection = .leftToRight` (default) | `layoutDirection = .rightToLeft`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/ios-righttoleft-false.png" alt-text="iOS layout direction left-to-right"::: | :::image type="content" source="media/ios-righttoleft-true.png" alt-text="iOS layout direction right-to-left":::  |

### Customizing Translations

There are two options to customize the language translations that we provide. To override a particular string, you can find the list of localization keys [here](https://github.com/Azure/communication-ui-library-ios/blob/main/AzureCommunicationUI/AzureCommunicationUIDemoApp/Sources/Views/en.lproj/Localizable.strings) for the key-value pair. You can specify the `locale` to be one of the supported languages, and when a key isn't provided, will fall back to our supported translation string. If you specified an unsupported language, you should provide translations for all the keys for that language (using `Localizable.strings` file), and will fall back to English strings when a key isn't provided.

Let's say you wish to have the `ControlBar` with strings from our English (US) locale but you want to change the label of `JoinCall` button to "Start Meeting" (instead of "Join call") in Setup View.

#### Override using Localization.strings file

Enable Localization in the Project, below for the `locale` you want to override. Create a `Localizable.strings` file (or other filename with extension `.strings`) with the key-value pair for selected keys you want to override. In the example below, we're overriding the key `AzureCommunicationUI.SetupView.Button.JoinCall`.

:::image type="content" source="media/ios-setup-project.png" alt-text="iOS setup project":::

:::image type="content" source="media/ios-custom-string.png" alt-text="iOS custom string":::

To specify you're overriding with Localization.strings, create a `LocalizationOptions` object to specify the `locale` and `localizationFilename`. Or when using the `locale` initializer, will look keys in Localizable.strings for `locale.collatorIdentifier` as the language in your project.

```swift
let localizationOptions = LocalizationOptions(locale: Locale(identifier: "fr"),
                                              localizableFilename: "Localizable")
let callCompositeOptions = CallCompositeOptions(localization: localizationOptions)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

### Accessibility VoiceOver for Localization

For VoiceOver to work properly for a localization, make sure the language is added into your app's Localizations. So the VoiceOver will detect the app supports the language specified in LocalizationOptions locale, and select the Speech voice for the language using the voice found in device's Settings -> Accessibility -> Speech. You can verify if the language is added to your project as shown below.

:::image type="content" source="media/ios-xcode-project-localizations.png" alt-text="iOS XCode Project Localizations":::
