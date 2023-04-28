---
description: In this tutorial, you learn how to use the Calling composite on Android
author: jorgegarc

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Available Languages

The following is table of `CallCompositeSupportedLocale` with out of the box translations. If you want to localize the composite, pass the `Locale` from `CallCompositeSupportedLocale` into `CallCompositeLocalizationOptions` as options into `CallComposite`.

|Language| CallCompositeSupportedLocale|
|---------|---------|
|German| CallCompositeSupportedLocale.DE|
|Japanese| CallCompositeSupportedLocale.JA|
|English| CallCompositeSupportedLocale.EN_US|
|Chinese (Traditional)| CallCompositeSupportedLocale.ZH_TW|
|Spanish |CallCompositeSupportedLocale.ES|
|Chinese (Simplified) |CallCompositeSupportedLocale.ZH_CN|
|Italian |CallCompositeSupportedLocale.IT|
|English (United Kingdom) |CallCompositeSupportedLocale.EN_UK|
|Korean |CallCompositeSupportedLocale.KO|
|Turkish |CallCompositeSupportedLocale.TR|
|Russian |CallCompositeSupportedLocale.RU|
|French |CallCompositeSupportedLocale.FR|
|Dutch |CallCompositeSupportedLocale.NL|
|Portuguese |CallCompositeSupportedLocale.PT_BR|

### Localization Provider

`CallCompositeLocalizationOptions` is an options wrapper that sets all the strings for UI Library for Android components using a `CallCompositeSupportedLocale`. By default, all text labels use English strings. If desired `CallCompositeLocalizationOptions` can be used to set a different language by passing a `Locale` object from `CallCompositeSupportedLocale`. Out of the box, the UI library includes a set of `Locale` usable with the UI components and composites.

You can also obtain list of `Locale` by the static function `CallCompositeSupportedLocale.getSupportedLocales()`.

:::image type="content" source="media/android-localization.png" alt-text="Android localization":::

#### Usage

To use the `CallCompositeLocalizationOptions`, specify a `CallCompositeSupportedLocale` and pass it to the `CallCompositeBuilder`. For the example below, we'll localize the composite to French.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale

// CallCompositeSupportedLocale provides list of supported locale
val callComposite: CallComposite =
            CallCompositeBuilder().localization(
                CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR)
            ).build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale;

// CallCompositeSupportedLocale provides list of supported locale
CallComposite callComposite = 
    new CallCompositeBuilder()
        .localization(new CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR))
        .build();
```

-----

### Layout Direction

Certain cultures (Arabic, Hebrew, etc.) may need for localization to have right-to-left layout. You can specify the `layoutDirection` as part of the `CallCompositeLocalizationOptions`. The layout of the composite will be mirrored but the text will remain in the direction of the string.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale

// CallCompositeSupportedLocale provides list of supported locale
val callComposite: CallComposite =
            CallCompositeBuilder().localization(
                CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR, LayoutDirection.LTR)
            ).build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale;

// CallCompositeSupportedLocale provides list of supported locale
CallComposite callComposite = 
    new CallCompositeBuilder()
        .localization(new CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR, LayoutDirection.LTR))
        .build();
```

|`LayoutDirection.RTL` | `LayoutDirection.LTR`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/android-rtl.png" alt-text="Android RTL"::: | :::image type="content" source="media/android-ltr.png" alt-text="Android LTR":::  |

### Customizing Translations

There are two options to customize the language translations that we provide. You can find the list of localization keys [here](https://github.com/Azure/communication-ui-library-android/blob/main/azure-communication-ui/calling/src/main/res/values/azure_communication_ui_calling_strings.xml) to override a particular string for the key-value pair. You can specify the locale as one of the supported languages, and when a key isn't provided, it will fall back to our supported translation string. If you specified an unsupported language, you should provide translations for all the keys for that language (using the `string.xml` file) and will fall back to English strings when a key isn't provided.

Let's say you wish to have the Control Bar with strings from our English (US) locale, but you want to change the label of the "Join Call" button to "Start Meeting" (instead of "Join call") in Setup View.

#### Override using string.xml file

Create a `string.xml` file (or other filename) with the key-value pair for selected keys you want to override. In the example below, we're overriding the key `azure_communication_ui_calling_setup_view_button_join_call`.

:::image type="content" source="media/android-localization-project.png" alt-text="Screenshot that shows the Android localization setup project":::

:::image type="content" source="media/android-localization-custom-label.png" alt-text="Screenshot that shows the Android example custom label":::
