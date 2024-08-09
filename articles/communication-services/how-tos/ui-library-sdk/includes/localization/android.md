---
description: Learn how to use the Calling composite on Android.
author: garchiro7

ms.author: jorgegarc
ms.date: 04/03/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Available languages

The following table lists `CallCompositeSupportedLocale` IDs for out-of-the-box translations. If you want to localize the composite, pass a `Locale` object from `CallCompositeSupportedLocale` into `CallCompositeLocalizationOptions` as options into `CallComposite`.

|Language| CallCompositeSupportedLocale|
|---------|---------|
| Arabic (Saudi Arabia) | `CallCompositeSupportedLocale.AR_SA`     |
| German (Germany)      | `CallCompositeSupportedLocale.DE_DE`     |
| English (US)          | `CallCompositeSupportedLocale.EN_US`     |
| English (UK)          | `CallCompositeSupportedLocale.EN_UK`     |
| Spanish (Spain)       | `CallCompositeSupportedLocale.ES_ES`     |
| Spanish               | `CallCompositeSupportedLocale.ES`        |
| Finnish (Finland)     | `CallCompositeSupportedLocale.FI_FI`     |
| French (France)       | `CallCompositeSupportedLocale.FR_FR`     |
| French                | `CallCompositeSupportedLocale.FR`        |
| Hebrew (Israel)       | `CallCompositeSupportedLocale.IW_IL`     |
| Italian (Italy)       | `CallCompositeSupportedLocale.IT_IT`     |
| Italian               | `CallCompositeSupportedLocale.IT`        |
| Japanese (Japan)      | `CallCompositeSupportedLocale.JA_JP`     |
| Japanese              | `CallCompositeSupportedLocale.JA`        |
| Korean (Korea)        | `CallCompositeSupportedLocale.KO_KR`     |
| Korean                | `CallCompositeSupportedLocale.KO`        |
| Dutch (Netherlands)   | `CallCompositeSupportedLocale.NL_NL`     |
| Dutch                 | `CallCompositeSupportedLocale.NL`        |
| Norwegian (Bokmål)    | `CallCompositeSupportedLocale.NB_NO`     |
| Polish (Poland)       | `CallCompositeSupportedLocale.PL_PL`     |
| Polish                | `CallCompositeSupportedLocale.PL`        |
| Portuguese (Brazil)   | `CallCompositeSupportedLocale.PT_BR`     |
| Portuguese            | `CallCompositeSupportedLocale.PT`        |
| Russian (Russia)      | `CallCompositeSupportedLocale.RU_RU`     |
| Russian               | `CallCompositeSupportedLocale.RU`        |
| Swedish (Sweden)      | `CallCompositeSupportedLocale.SV_SE`     |
| Turkish (Turkey)      | `CallCompositeSupportedLocale.TR_TR`     |
| Turkish               | `CallCompositeSupportedLocale.TR`        |
| Chinese (Simplified)  | `CallCompositeSupportedLocale.ZH_CN`     |
| Chinese (Traditional) | `CallCompositeSupportedLocale.ZH_TW`     |
| Chinese               | `CallCompositeSupportedLocale.ZH`        |


### Localization provider

`CallCompositeLocalizationOptions` is an options wrapper that sets all the strings for Android UI Library components by using `CallCompositeSupportedLocale`. By default, all text labels use English strings. You can use `CallCompositeLocalizationOptions` to set a different language by passing a `Locale` object from `CallCompositeSupportedLocale`. Out of the box, the UI Library includes a set of `Locale` objects that are usable with the UI components and composites.

You can also get a list of `Locale` objects by using the static function `CallCompositeSupportedLocale.getSupportedLocales()`.

:::image type="content" source="media/android-localization.png" alt-text="Screenshot that shows Android localization.":::

To use `CallCompositeLocalizationOptions`, specify `CallCompositeSupportedLocale` and pass it to `CallCompositeBuilder`. The following example localizes the composite to French.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale

// CallCompositeSupportedLocale provides a list of supported locales
val callComposite: CallComposite =
            CallCompositeBuilder().localization(
                CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR)
            ).build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale;

// CallCompositeSupportedLocale provides a list of supported locales
CallComposite callComposite = 
    new CallCompositeBuilder()
        .localization(new CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR))
        .build();
```

-----

### Layout direction

Certain cultures (for example, Arabic and Hebrew) might need localization to have a right-to-left layout. You can specify `layoutDirection` as part of `CallCompositeLocalizationOptions`. The layout of the composite will be mirrored, but the text will remain in the direction of the string.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale

// CallCompositeSupportedLocale provides a list of supported locales
val callComposite: CallComposite =
            CallCompositeBuilder().localization(
                CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR, LayoutDirection.LTR)
            ).build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale;

// CallCompositeSupportedLocale provides a list of supported locales
CallComposite callComposite = 
    new CallCompositeBuilder()
        .localization(new CallCompositeLocalizationOptions(CallCompositeSupportedLocale.FR, LayoutDirection.LTR))
        .build();
```

-----

|`LayoutDirection.RTL` | `LayoutDirection.LTR`     |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| :::image type="content" source="media/android-rtl.png" alt-text="Screenshot of Android right-to-left layout."::: | :::image type="content" source="media/android-ltr.png" alt-text="Screenshot of Android left-to-right layout.":::  |

### Customizing translations

There are two options to customize the language translations that we provide. You can use the [list of localization keys](https://github.com/Azure/communication-ui-library-android/blob/main/azure-communication-ui/calling/src/main/res/values/azure_communication_ui_calling_strings.xml) to override a particular string for the key/value pair. You can specify the locale as one of the supported languages. When a key isn't provided, it will fall back to a supported translation string. If you specify an unsupported language, you should provide translations for all the keys for that language (by using the `string.xml` file) and then fall back to English strings when a key isn't provided.

Let's say you want to have the control bar use strings from the English (US) locale, but you want to change the label of the **Join Call** button to **Start Meeting** in setup view. Create a `string.xml` file (or other file name) with the key/value pair for selected keys that you want to override. The following example overrides the key `azure_communication_ui_calling_setup_view_button_join_call`.

:::image type="content" source="media/android-localization-project.png" alt-text="Screenshot that shows the Android localization setup project.":::

:::image type="content" source="media/android-localization-custom-label.png" alt-text="Screenshot that shows the Android example custom label.":::
