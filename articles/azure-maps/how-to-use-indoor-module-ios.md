---
title: Use the Azure Maps Indoor Maps module to develop iOS applications with Microsoft Creator services
description: Learn how to use the Microsoft Azure Maps Indoor Maps module for the iOS SDK to render maps by embedding the module's JavaScript libraries.
author: stevemunk
ms.author: v-munksteve
ms.date: 11/15/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: eriklind
---

# Using indoor maps in the iOS SDK

The Azure Maps iOS SDK allows you to render indoor maps created in Azure Maps Creator services.

## Prerequisites

1. [Create a Creator resource](how-to-manage-creator.md)
2. Get a `tilesetId` by completing the [tutorial for creating Indoor maps](tutorial-creator-indoor-maps.md). You'll need to use this identifier to render indoor maps with the Azure Maps iOS SDK.
3. Be sure to complete the steps in the [Quickstart: Create an iOS app](quick-ios-app.md). Code blocks in this article can be inserted into the  `viewDidLoad` function of `ViewController`.

## Instantiate the Indoor Manager

To load the indoor tilesets and map style of the tiles, you must instantiate an `IndoorManager` and keep a strong reference to it.

```swift
guard let indoor = try? IndoorManager(azureMap: map, options: [.tilesetID("YOUR_TILESET_ID")]) else { return }
self.indoorManager = indoor
```

> [!IMPORTANT]
> This guide assumes that your Creator service was created in the United States. If your Creator service was created in Europe, add the following code:
>
> ```swift
> self.indoorManager.setOptions([.geography(.eu)])
> ```

## Indoor Level Picker Control

The *Indoor Level Picker* control allows you to change the level of the rendered map. You can optionally initialize an `IndoorControl` and set to the appropriate option on the `IndoorManager` as in the following code:

```swift
let levelControl = IndoorControl(options: [.controlPosition(.topRight)])
self.indoorManager.setOptions([.levelControl(levelControl)])
```

> [!TIP]
> The *level picker* appears when you select the stairwell feature.

## Indoor Events

In order to listen to indoor map events, you must add a delegate to the `IndoorManager`.

```swift
self.indoorManager.addDelegate(self)
```

`IndoorManagerDelegate` has one method which invoked when a facility or floor has been changed.

```swift
func indoorManager(
    _ manager: IndoorManager,
    didSelectFacility selectedFacility: IndoorFacilitySelection,
    previousSelection: IndoorFacilitySelection
) {
    // code that you want to run after a facility or floor has been changed
    print("New selected facility's ID:", selectedFacility.facilityID)
    print("New selected floor:", selectedFacility.levelsOrdinal)
}
```

## Example

The screenshot below shows the above code displaying an indoor map.

![Indoor map example](/media/ios-sdk/indoor-maps/indoor.png)

## Additional Information

- [Creator for indoor maps](creator-indoor-maps.md)
- [Drawing package requirements](drawing-requirements.md)
