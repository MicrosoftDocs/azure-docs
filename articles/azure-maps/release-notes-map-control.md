---
title: Release notes - Map Control
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Web SDK. 
author: stevemunk
ms.author: v-munksteve
ms.date: 12/16/2022
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Web SDK map control release notes

This document contains information about new features and other changes to the Map Control.

## [3.0.0-preview.2](https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.2) (December 16, 2022)

### New features

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions][StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map. For more information, see [2.2.2 release notes](#222-december-15-2022).

The preview is available on [npm](https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.2) and CDN.

  - Install [azure-maps-control@next][azure-maps-control] to your dependencies:
    ```shell
    npm i azure-maps-control@next
    ```

  - Reference the following CSS and JavaScript in the `<head>` element of an HTML file:
    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.js"></script>
    ```

### Bug fixes

- Fix an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fix the inability to disable traffic incidents in [TrafficControlOptions][TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used. 

- Add `.atlas-map` to all css selectors to scope the styles within the map container. The fix prevents the css from accidentally adding unwanted styles to other elements on the page.

## [3.0.0-preview.1](https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.1) (November 18, 2022)

### New features

This update is the first preview of the upcoming 3.0.0 release. The underlying [maplibre-gl][maplibre-gl] dependency has been upgraded from `1.14` to `3.0.0-pre.1`, offering improvements in stability and performance. The preview is available on [npm](https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.1).

  - Install [azure-maps-control@next][azure-maps-control] to your dependencies:
    ```shell
    npm i azure-maps-control@next
    ```

### Bug fixes

- Fix a regression issue that prevents IndoorManager from removing a tileset by using
    ```js
    indoorManager.setOptions({
        tilesetId: undefined
    })
    ```

## [2.2.2](https://www.npmjs.com/package/azure-maps-control/v/2.2.2) (December 15, 2022)

### New features

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions][StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map.
- `progressiveLoading`
  - Enables progressive loading of map layers.
  - Defaults to `false`.
- `progressiveLoadingInitialLayerGroups`
  - Specifies the layer groups to load first.
  - Defaults to `["base"]`.
  - Possible values are `base`, `transit`, `labels`, `buildings`, and `labels_places`.
  - Other layer groups are deferred such that the initial layer groups can be loaded first.

### Bug fixes

- Fix an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fix the inability to disable traffic incidents in [TrafficControlOptions][TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used. 

## Next steps

Explore samples showcasing Azure Maps:

[Azure Maps Samples](https://samples.azuremaps.com)

Stay up to date on Azure Maps:

[Azure Maps Blog](https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog)

[azure-maps-control]: https://www.npmjs.com/package/azure-maps-control
[maplibre-gl]: https://www.npmjs.com/package/maplibre-gl
[StyleOptions]: /javascript/api/azure-maps-control/atlas.styleoptions
[TrafficControlOptions]: /javascript/api/azure-maps-control/atlas.trafficcontroloptions