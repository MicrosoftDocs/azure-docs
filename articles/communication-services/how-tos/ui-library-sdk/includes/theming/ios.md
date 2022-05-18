---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

### Defining a Theme

You can customize the theme by changing the primary color and its associated tints, in addition to the option of overriding the light and dark mode color scheme.

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

#### Implementation

Contoso developers can create a custom theme configuration that implements the `ThemeConfiguration` protocol. They'll need to include an instance of that new class in your `CallCompositeOptions`.

```swift
class CustomThemeConfiguration: ThemeConfiguration {

 var primaryColor: UIColor {
  return UIColor(named: "primaryColor")
 }
 
 var primaryColorTint10: UIColor {
  return UIColor(named: "primaryColorTint10")
 }
 
 var primaryColorTint20: UIColor {
  return UIColor(named: "primaryColorTint20")
 }
 
 var primaryColorTint30: UIColor {
  return UIColor(named: "primaryColorTint30")
 }

 var colorSchemeOverride: UIUserInterfaceStyle {
  return UIUserInterfaceStyle.dark
 }
}

let callCompositeOptions = CallCompositeOptions(theme: CustomThemeConfiguration())
```

#### Define Color Assets

Define each color in the assets, with a shade for the light and dark modes.

:::image type="content" source="media/ios_theming.png" alt-text="iOS color assets":::
