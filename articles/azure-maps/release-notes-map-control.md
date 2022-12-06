---
title: Release notes - Map Control
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Web SDK. 
author: stevemunk
ms.author: v-munksteve
ms.date: 12/06/2022
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Release notes - Map Control

See below for information about new features and other changes to the Map Control.

## 3.0.0-preview.2

- Add `trafficSpeedAnimation` to TrafficOptions to enable traffic flow animation. This addresses an accessibility issue where traffic levels could not be distinguished if colors are not taken into account.

- Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to StyleOptions to enable the capability of loading map layers progressively. This improves the perceived loading time of the map. See [2.2.1 release notes](#221) for more details.

- Fix an issue that the ordering of user layers was not preserved after calling `map.layers.move()`.

- Add `.atlas-map` to all css selectors to scope the stylesheet within the map container. This prevents the stylesheet from accidentally adding unwanted styles to other elements on the page.

## 3.0.0-preview.1

- This is the first preview of the upcoming 3.0.0 release. There is no breaking change except that the underlying [maplibre-gl][maplibre-gl] dependency has been upgraded from 1.14 to 3.0.0-pre.1 which offers improvements in stability and performance.

- Fix a regression issue that prevents IndoorManager from removing a tileset by using
    ```js
    indoorManager.setOptions({
        tilesetId: undefined
    })
    ```

## 2.2.1

- Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to StyleOptions to enable the capability of loading map layers progressively. This improves the perceived loading time of the map.
  - `progressiveLoading`
    - Enables progressive loading of map layers.
    - Defaults to false.
  - `progressiveLoadingInitialLayerGroups`
    - Specifies the layer groups to load first.
    - Defaults to ["base"].
    - Possible values are `base`, `transit`, `labels`, `buildings`, and `labels_places`.
    - Other layer groups are deferred such that the initial layer groups can be loaded first.

- Fix an issue that the ordering of user layers was not preserved after calling `map.layers.move()`.

## Next steps

Explore samples showcasing Azure Maps:

[Azure Maps Samples](https://samples.azuremaps.com)

Stay up to date on Azure Maps:

[Azure Maps Blog](https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog)

[maplibre-gl]: https://www.npmjs.com/package/maplibre-gl
