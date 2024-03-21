---
description: Learn how to use the Calling composite on iOS.
author: mbellah

ms.author: mbellah
ms.date: 08/16/2023
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Available orientations

The following table lists `OrientationOptions` types for out-of-the-box orientations. If you want to set the orientation of the various screens of the composite, set `OrientationOptions` to `CallComposite`.

|Orientation mode| OrientationOptions type|
|---------|---------|
|`portrait` | `OrientationOptions.portrait`|
|`landscape` | `OrientationOptions.landscape`|
|`landscapeRight` | `OrientationOptions.landscapeRight`|
|`landscapeLeft` | `OrientationOptions.landscapeLeft`|
|`allButUpsideDown` | `OrientationOptions.allButUpsideDown`|

### Orientation API

`OrientationOptions` is a custom type for the iOS UI Library. The name for the orientation type is defined by keeping similarity with the names of the iOS platform's orientation modes.

By default, the setup screen orientation is in `portrait` mode and the calling screen is in `allButUpsideDown` mode. To set a different orientation for the screens, you can pass `OrientationOptions`. Out of the box, the UI Library includes a set of `OrientationOptions` types that are usable with the composite.

```swift

let callCompositeOptions = CallCompositeOptions(localization: localizationConfig,
                                                setupScreenOrientation: OrientationOptions.portrait,
                                                callingScreenOrientation: OrientationOptions.allButUpsideDown)
let callComposite = CallComposite(withOptions: callCompositeOptions)
```
