---
description: In this tutorial, you learn how to use the Calling composite on iOS.
author: mbellah

ms.author: mbellah
ms.date: 08/16/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling)

### Available orientations

The following is a table of `OrientationOptions` with out of the box orientations. If you want to set orientation of the different screens of the composite, set the `OrientationOptions` into `CallComposite`.

|Orientation Mode| OrientationOptions|
|---------|---------|
|portrait | OrientationOptions.portrait|
|landscape | OrientationOptions.landscape|
|landscapeRight | OrientationOptions.landscapeRight|
|landscapeLeft | OrientationOptions.landscapeLeft|
|allButUpsideDown | OrientationOptions.allButUpsideDown|

### Orientation API

`OrientationOptions` is a custom type for UI Library for iOS. The name for the orientation type is defined by keeping similarity between iOS Platform's orientation mode names. By default, the setup screen orientation is set with `portrait` mode and calling screen is set with `allButUpsideDown` mode. To set a different orientation for the screens other than default one, developers can pass `OrientationOptions`. Out of the box, the UI Library includes a set of `OrientationOptions` usable with the composite.

```swift

let callCompositeOptions = CallCompositeOptions(localization: localizationConfig,
                                                setupScreenOrientation: OrientationOptions.portrait,
                                                callingScreenOrientation: OrientationOptions.allButUpsideDown)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```