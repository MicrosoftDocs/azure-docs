---
description: In this tutorial, you learn how to use the Calling composite on iOS
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Defining a Theme

You can customize the theme by changing the primary color and its associated tints and the option of overriding the light and dark  mode color scheme.

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

Contoso developers can create custom theme options that implement the `ThemeOptions` protocol. They'll need to include an instance of that new class in your `CallCompositeOptions`.

```swift
class CustomThemeOptions: ThemeOptions {

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

let callCompositeOptions = CallCompositeOptions(theme: CustomThemeOptions())
```

#### Define Color Assets

Define each color in the assets, with a shade for the light and dark modes. Like the below reference image, describe how Contoso can configure the assets on the XCODE project.

:::image type="content" source="media/ios-theming.png" alt-text="Screenshot of a I O S color assets example configuration.":::
