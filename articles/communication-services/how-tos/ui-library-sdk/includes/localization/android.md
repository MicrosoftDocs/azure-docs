---
description: In this tutorial, you learn how to use the Calling composite on Android
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-library-quick-start)

### Available Languages

The following is table of `CommunicationUISupportedLocale` with out of the box translations. If you want to localize the composite, pass the `Locale` from `CommunicationUISupportedLocale` into `LocalizationConfiguration` as options into `CallComposite`.

|Language| CommunicationUISupportedLocale|
|---------|---------|
|German| CommunicationUISupportedLocale.DE|
|Japanese| CommunicationUISupportedLocale.JA|
|English| CommunicationUISupportedLocale.EN_US|
|Chinese (Traditional)| CommunicationUISupportedLocale.ZH_TW|
|Spanish |CommunicationUISupportedLocale.ES|
|Chinese (Simplified) |CommunicationUISupportedLocale.ZH_CN|
|Italian |CommunicationUISupportedLocale.IT|
|English (United Kingdom) |CommunicationUISupportedLocale.EN_UK|
|Korean |CommunicationUISupportedLocale.KO|
|Turkish |CommunicationUISupportedLocale.TR|
|Russian |CommunicationUISupportedLocale.RU|
|French |CommunicationUISupportedLocale.FR|
|Dutch |CommunicationUISupportedLocale.NL|
|Portuguese |CommunicationUISupportedLocale.PT_BR|

### Localization Provider

`LocalizationConfiguration` is an options wrapper that sets all the strings for Mobile UI Library components using a `CommunicationUISupportedLocale`. By default, all text labels use English strings. If desired `LocalizationConfiguration` can be used to set a different language by passing a `Locale` object from `CommunicationUISupportedLocale`. Out of the box, the UI library includes a set of `Locale` usable with the UI components and composites.

You can also obtain list of `Locale` by the static function `CommunicationUISupportedLocale.getSupportedLocales()`.

:::image type="content" source="media/android-localization.png" alt-text="Android localization":::

#### Usage

To use the `LocalizationConfiguration`, specify a `CommunicationUISupportedLocale` and pass it to the `CallCompositeOptions`. For the example below, we'll localize the composite to French.

```Kotlin
val callComposite: CallComposite = CallCompositeBuilder().localization(LocalizationConfiguration(CommunicationUISupportedLocale.FR).build()
```

### Layout Direction

Certain cultures (Arabic, Hebrew, etc.) may need for localization to have right-to-left layout. You can specify the `layoutDirection` as part of the `LocalizationConfiguration`. The layout of the composite will be mirrored but the text will remain in the direction of the string.

```Koltin
val callComposite: CallComposite = CallCompositeBuilder().localization(LocalizationConfiguration(CommunicationUISupportedLocale.FR,LaytoutDirection.RTL)).build()
```

|`LayoutDirection.RTL` | `LayoutDirection.LTR`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/android-rtl.png" alt-text="Android RTL"::: | :::image type="content" source="media/android-ltr.png" alt-text="Android LTR":::  |

### Customizing Translations

To override a particular string, you can find the list of localization keys here for the key-value pair. You can specify the `languageCode` to be one of the supported languages, and when a key isn't provided, will fall back to our supported translation string. If you specified an unsupported language, you should provide translations for all the keys for that language, and will fall back to English strings when a key isn't provided.

Create a `string.xml` file (or other filename) with the key-value pair for selected keys you want to override.
