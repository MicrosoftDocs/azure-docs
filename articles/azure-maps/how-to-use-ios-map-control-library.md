---
title: Get started with iOS map control | Microsoft Azure Maps
description: Become familiar with the Azure Maps iOS SDK. See how to install the SDK and create an interactive map.
author: sinnypan
ms.author: sipa
ms.date: 11/23/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Get started with Azure Maps iOS SDK (Preview)

The Azure Maps iOS SDK is a vector map library for iOS. This article guides you through the processes of installing the Azure Maps iOS SDK and loading a map.

## Prerequisites

Be sure to complete the steps in the  [Quickstart: Create an iOS app](quick-ios-app.md) article.

## Localizing the map

The Azure Maps iOS SDK provides three ways of setting the language and regional view of the map. The following code demonstrates the different ways of setting the *language* to French ("fr-FR") and the *regional view* to "Auto".

1. Pass the language and regional view information into the `AzureMaps` class using the static `language` and `view` properties. This sets the default language and regional view properties in your app.

    ```swift
    // Alternatively use Azure Active Directory authenticate.
    AzureMaps.configure(aadClient: "<Your aad clientId>", aadAppId: "<Your aad AppId>", aadTenant: "<Your aad Tenant>")
    
    // Set your Azure Maps Key.
    // AzureMaps.configure(subscriptionKey: "<Your Azure Maps Key>")
    
    // Set the language to be used by Azure Maps.
    AzureMaps.language = "fr-FR"
    
    // Set the regional view to be used by Azure Maps.
    AzureMaps.view = "Auto"
    ```

1. You can also pass the language and regional view information to the map control init.

    ```swift
    MapControl(options: [
        StyleOption.language("fr-FR"),
        StyleOption.view("Auto")
    ])
    ```

1. The final way of programmatically setting the language and regional view properties uses the maps `setStyle` method. Do this any time you need to change the language and regional view of the map.

    ```swift
    mapControl.getMapAsync { map in
        map.setStyleOptions([
            StyleOption.language("fr-FR"),
            StyleOption.view("Auto")
        ])
    }
    ```

Here is an example of an Azure Maps application with the language set to "fr-FR" and regional view set to "Auto".

:::image type="content" source="media/ios-sdk/how-to-use-ios-map-control-library/fr-borderless.png" alt-text="A map image showing labels in French.":::

For a complete list of supported languages and regional views, see [Localization support in Azure Maps](supported-languages.md).

## Navigating the map

This section details the various ways to navigate when in an Azure Maps program.

### Zoom the map

* Touch the map with two fingers and pinch together to zoom out or spread the fingers apart to zoom in.
* Double tap the map to zoom in one level.
* Double tap with two fingers to zoom out the map one level.
* Tap twice; on second tap, hold your finger on the map and drag up to zoom in, or down to zoom out.

### Pan the map

* Touch the map and drag in any direction.

### Rotate the map

* Touch the map with two fingers and rotate.

### Pitch the map

* Touch the map with two fingers and drag them up or down together.

## Azure Government cloud support

The Azure Maps iOS SDK supports using the Azure Government cloud. You specify using the Azure Maps government cloud domain by adding the following line of code where the Azure Maps authentication details are specified:

```
AzureMaps.domain = "atlas.azure.us"
```

Be sure to use Azure Maps authentication details from the Azure Government cloud platform when authenticating the map and services.

## Additional information

See the following articles for additional code examples:

* [Quickstart: Create an iOS app](quick-ios-app.md)
* [Change map styles in iOS maps](set-map-style-ios-sdk.md)
* [Add a symbol layer](add-symbol-layer-ios.md)
* [Add a line layer](add-line-layer-map-ios.md)
* [Add a polygon layer](add-polygon-layer-map-ios.md)
