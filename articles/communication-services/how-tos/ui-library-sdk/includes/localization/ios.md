---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

### Available Languages

The following table of `languageCode` with out of the box translations. If you want to localize the composite, pass the `languageCode` into `LocalizationConfiguration` as options into `CallComposite`.

|         Language         | LanguageCode (Enum)       |    rawValue  |
|:------------------------:|:------------------:|:------------:|
|          German          |         de        |      de      |
|         Japanese         |         ja        |      ja      |
|          English         |         en        |      en      |
|   Chinese (Traditional)  |         zhHant    |    zh-Hant   |
|          Spanish         |         es        |      es      |
|   Chinese (Simplified)   |         zhHans    |    zh-Hans   |
|          Italian         |         it        |      it      |
| English (United Kingdom) |         enGB      |     en-GB    |
|          Korean          |         ko        |      ko      |
|          Turkish         |         tr        |      tr      |
|          Russian         |         ru        |      ru      |
|          French          |         fr        |      fr      |
|           Dutch          |         nl        |      nl      |
|        Portuguese        |         pt        |      pt      |

You can also obtain list of `languageCode` by the static function `LocalizationConfiguration.supportedLanguages`.

```swift
let languageCodes: [String] = LocalizationConfiguration.supportedLanguages
print(languageCodes)

// ["de", "ja", "en", "zh-Hant", "es", "zh-Hans", "it", "en-GB", "ko", "tr", "ru", "fr", "nl", "pt"]
```

### LocalizationConfiguration

`LocalizationConfiguration` is an options wrapper that sets all the strings for UI Library components using a `languageCode`. By default, all text labels use our English (`en`) strings. If desired, `LocalizationConfiguration` can be used to set a different `languageCode`. Out of the box, the UI library includes a set of `languageCode` usable with the UI components and composites.

#### Usage

To use the `LocalizationConfiguration`, specify a `languageCode` and pass it to the `CallCompositeOptions`. For the example below, we'll localize the composite to French (`fr`).

```swift
let localizationConfig = LocalizationConfiguration(languageCode: "fr")
let callCompositeOptions = CallCompositeOptions(localization: localizationConfig)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-localization.png" alt-text="iOS localization":::

### Layout Direction

Certain cultures (Arabic, Hebrew, etc.) may need  for localization to have right-to-left layout. You can specify the `layoutDirection` as part of the `LocalizationConfiguration`. The layout of the composite will be mirrored but the text will remain in the direction of the string.

```swift
var localizationConfig: LocalizationConfiguration

// Initializer with langaugeCode and layoutDirection
localizationConfig = LocalizationConfiguration(languageCode: LanguageCode.en,
                                               layoutDirection: .rightToLeft)

// Initializer with langaugeCode, localizableFilename, and layoutDirection
localizationConfig = LocalizationConfiguration(languageCode: LanguageCode.en,
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

There are two options to customize the language translations that we provide. To override a particular string, you can find the list of localization keys here for the key-value pair. You can specify the `languageCode` to be one of the supported languages, and when a key isn't provided, will fall back to our supported translation string. If you specified an unsupported language, you should provide translations for all the keys for that language (using Localizable.strings file), and will fall back to English strings when a key isn't provided.

Let's say you wish to have the `ControlBar` with strings from our English (US) locale but you want to change the label of `JoinCall` button to "Start Meeting" (instead of "Join call") in Setup View.

#### Override using Localization.strings file

Enable Localization in the Project, below for the `languageCode` you want to override. Create a `Localizable.strings` file (or other filename with extension `.strings`) with the key-value pair for selected keys you want to override. In the example below, we're overriding the key `AzureCommunicationUI.SetupView.Button.JoinCall`.

:::image type="content" source="media/ios-setup-project.png" alt-text="iOS setup project":::

To specify you're overriding with Localization.strings, create a `LocalizationConfiguration` object to specify the `languageCode` and `localizationFilename`.

```swift
let localizationConfig = LocalizationConfiguration(languageCode: LanguageCode.fr.rawValue,
                                                   localizableFilename: "Localizable")
let callCompositeOptions = CallCompositeOptions(localization: localizationConfig)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```

:::image type="content" source="media/ios-custom-string.png" alt-text="iOS custom string":::
