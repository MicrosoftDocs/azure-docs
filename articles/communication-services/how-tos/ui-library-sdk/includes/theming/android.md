---
description: In this tutorial, you learn how to use the Calling composite on Android
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Defining a Theme

Theming on Android is handled via XML resource files. We expose the following resource IDs to the public scope:

```XML
<resources>
    <public name="AzureCommunicationUICalling.Theme" type="style" />
    <public name="azure_communication_ui_calling_primary_color" type="attr" />
    <public name="azure_communication_ui_calling_primary_color_tint10" type="attr" />
    <public name="azure_communication_ui_calling_primary_color_tint20" type="attr" />
    <public name="azure_communication_ui_calling_primary_color_tint30" type="attr" />
</resources>
```

Contoso developers can implement a **Theme** within their apps like this one to supply the primary color and tints.

```XML
<style name="MyCompany.CallComposite" parent="AzureCommunicationUICalling.Theme">
    <item name="azure_communication_ui_calling_primary_color">#7800D4</item>
    <item name="azure_communication_ui_calling_primary_color_tint10">#882BD8</item>
    <item name="azure_communication_ui_calling_primary_color_tint20">#E0C7F4</item>
    <item name="azure_communication_ui_calling_primary_color_tint30">#ECDEF9</item>
</style>
```

#### Affected UI

- PrimaryColor:
  - Avatar/Video - Border - Speaking Indication
  - Join Call Button - Background
- PrimaryColorTint10 Color:
  - Join Call Button - Background - Highlighted - Light Mode
  - Join Call Button - Border - Light/Dark Mode
- PrimaryColorTint20 Color:
  - Join Call Button - Background - Highlighted - Dark Mode
- PrimaryColorTint30 Color:
  - Join Call Button - Border - Highlighted - Light/Dark Mode

#### Applying the Theme

The theme style will be applied to pass the Theme resource ID to the ThemeConfiguration/Theme in the `CallCompositeBuilder`.

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite =
        CallCompositeBuilder()
            .theme(R.style.MyCompany_CallComposite)
            .build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .theme(R.style.MyCompany_CallComposite)
        .build();
```

----

#### Light/Dark modes

The Android resource system handles the night theme. Night mode on Android is a system-wide configuration. When night mode is enabled, preference is given to resources in the `-night/` folders. To specify night mode colors, a second theme.xml would be added to the `values-night/`.

To enable night mode programmatically, Android provides the following function. However, this configuration applies globally to the application. There's no reliable way to set night mode for a single activity. Contoso can enforce a dark theme, they can use the below setting in their applications.

`AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)`
