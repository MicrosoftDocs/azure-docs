---
description: Learn how to use the Calling composite on iOS.
author: garchiro7

ms.author: jorgegarc
ms.date: 05/24/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Defining a theme

You can customize the theme by changing the primary color and its associated tints. You also have the option of overriding the light and dark modes in the color scheme.

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

You can create custom theme options that implement the `ThemeOptions` protocol. You need to include an instance of that new class in `CallCompositeOptions`.

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

### Defining color assets

Define each color in the assets, with a shade for the light and dark modes. The following reference image shows how to configure the assets on an Xcode project.

:::image type="content" source="media/ios-theming.png" alt-text="Screenshot of an example configuration of iOS color assets.":::
