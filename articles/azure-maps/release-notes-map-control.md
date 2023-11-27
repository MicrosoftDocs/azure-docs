---
title: Release notes - Map Control
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Web SDK. 
author: sinnypan
ms.author: sipa
ms.date: 3/15/2023
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Web SDK map control release notes

This document contains information about new features and other changes to the Map Control.

## v3 (latest)

### [3.0.3] (November 29, 2023)

#### New features (3.0.3)

- Included ESM support.

- Improved copyright control sizing for RWD.

#### Other changes (3.0.3)

- Migrated to the search v2 API for reverse geocoding.

- Enhanced accessibility in the Compass and Pitch controls.

### [3.0.2] (November 1, 2023)

#### Bug fixes (3.0.2)

- Addressed several errors in the type declaration file and added a dependency for `@maplibre/maplibre-gl-style-spec`.

#### Other changes (3.0.2)

- Removed Authorization headers from style, thumbnail, sprite, and glyph requests to enhance CDN caching for static assets.

- Updated the documentation for `map.clear()` and `layers.clear()`.

### [3.0.1] (October 6, 2023)

#### Bug fixes (3.0.1)

- Various accessibility improvements.

- Resolved the issue with dynamic attribution when progressive loading is enabled.

- Fixed missing event names in `HtmlMarkerEvents`.

#### Other changes (3.0.1)

- Modified member methods to be protected for the zoom, pitch, and compass controls.

- Telemetry is disabled by default in the Azure Government cloud.

### [3.0.0] (August 18, 2023)

#### Bug fixes (3.0.0)

- Fixed zoom control to take into account the `maxBounds` [CameraOptions].

- Fixed an issue that mouse positions are shifted after a css scale transform on the map container.

#### Other changes (3.0.0)

- Phased out the style definition version `2022-08-05` and switched the default `styleDefinitionsVersion` to `2023-01-01`.

- Added the `mvc` parameter to encompass the map control version in both definitions and style requests.

#### Installation (3.0.0)

The version is available on [npm][3.0.0] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0][3.0.0]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0/atlas.min.js"></script>
    ```

### [3.0.0-preview.10] (July 11, 2023)

#### Bug fixes (3.0.0-preview.10)

- Dynamic pixel ratio fixed in underlying maplibre-gl dependency.

- Fixed an issue where `sortKey`, `radialOffset`, `variableAnchor` isn't applied when used in `SymbolLayer` options.

#### Installation (3.0.0-preview.10)

The preview is available on [npm][3.0.0-preview.10] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.10][3.0.0-preview.10]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.10/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.10/atlas.min.js"></script>
    ```

### [3.0.0-preview.9] (June 27, 2023)

#### New features (3.0.0-preview.9)

- WebGL2 is used by default.

- Elevation APIs: `atlas.sources.ElevationTileSource`, `map.enableElevation(elevationSource, options)`, `map.disableElevation()`

- Ability to customize maxPitch / minPitch in `CameraOptions`

#### Bug fixes (3.0.0-preview.9)

- Fixed an issue where accessibility-related duplicated DOM elements might result when `map.setServiceOptions` is called

#### Installation (3.0.0-preview.9)
The preview is available on [npm][3.0.0-preview.9] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.9][3.0.0-preview.9]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.9/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.9/atlas.min.js"></script>
    ```
    
### [3.0.0-preview.8] (June 2, 2023)

#### Bug fixes (3.0.0-preview.8)

- Fixed an exception that occurred while updating the property of a layout that no longer exists.

- Fixed an issue where BubbleLayer's accessible indicators didn't update when the data source was modified.

- Fixed an error in subsequent `map.setStyle()` calls if the raw Maplibre style is retrieved in the `stylechanged` event callback on style serialization.

#### Other changes (3.0.0-preview.8)

- Updated attribution logo and link.

#### Installation (3.0.0-preview.8)

The preview is available on [npm][3.0.0-preview.8] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.8][3.0.0-preview.8]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.8/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.8/atlas.min.js"></script>
    ```

### [3.0.0-preview.7] (May 2, 2023)

#### New features (3.0.0-preview.7)

- In addition to map configuration, [Map.setServiceOptions()] now supports changing `domain`, `styleAPIVersion`, `styleDefinitionsVersion` on runtime.

#### Bug fixes (3.0.0-preview.7)

- Fixed token expired exception on relaunches when using Azure AD / shared token / anonymous authentication by making sure authentication is resolved prior to any style definition request

- Fixed redundant style definition and thumbnail requests 

- Fixed incorrect `aria-label` applied to zoom out control button element

- Fixed the possibility of undefined copyright element container when withRuleBasedAttribution is set to false

- Fixed the possibility of event listener removal called on undefined target in `EventManager.remove()`

#### Installation (3.0.0-preview.7)

The preview is available on [npm][3.0.0-preview.7] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.7][3.0.0-preview.7]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.7/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.7/atlas.min.js"></script>
    ```

### [3.0.0-preview.6] (March 31, 2023)

#### Installation (3.0.0-preview.6)

The preview is available on [npm][3.0.0-preview.6] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.6][3.0.0-preview.6]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.6/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.6/atlas.min.js"></script>
    ```

#### New features (3.0.0-preview.6)

- Optimized the internal style transform performance.

#### Bug fixes (3.0.0-preview.6)

- Resolved an issue where the first style set request was unauthenticated for `AAD` authentication.

- Eliminated redundant requests during map initialization and on style changed events.

### [3.0.0-preview.5] (March 15, 2023)

#### Installation (3.0.0-preview.5)

The preview is available on [npm][3.0.0-preview.5] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.5][3.0.0-preview.5]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.5/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.5/atlas.min.js"></script>
    ```

#### New features (3.0.0-preview.5)

- Support dynamically updating mapConfiguration via `map.setServiceOptions({ mapConfiguration: 'MAP_CONFIG' })` 

### [3.0.0-preview.4] (March 10, 2023)  

#### Installation (3.0.0-preview.4)

The preview is available on [npm][3.0.0-preview.4] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.4][3.0.0-preview.4]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.4/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.4/atlas.min.js"></script>
    ```

#### New features (3.0.0-preview.4)

- Extended map coverage in China, Japan, and Korea.

- Preview of refreshed map styles (Road / Night / Hybrid / Gray Scale Dark / Gray Scale Light / Terra / High Contrast Dark / High Contrast Light).

- More details on roads/building footprints/trails coverage.

- Wider zoom level ranges (1~21) for the Terra style.

- Greater details on public transit including ferries, metros, and bus stops.

- Additional information about the altitude of mountains and the location of waterfalls.

#### Changes (3.0.0-preview.4)

- Traffic data now only support relative mode.

- Deprecated `showBuildingModels` in [StyleOptions].

- Changed the default `minZoom` from -2 to 1.

#### Bug fixes (3.0.0-preview.4)

- Cleaned up various memory leaks in [Map.dispose()].

- Improved style picker's tab navigation for accessibility in list layout.

- Optimized style switching by avoiding deep cloning objects.

- Fixed an exception that occurred in [SourceManager] when style switching with sources that weren't vector or raster. 

- **\[BREAKING\]** Previously `sourceadded` events are only emitted if new sources are added to the style. Now `sourceremoved` / `sourceadded` events are emitted when the new source and the original source in the current style aren't equal, even if they have the same source ID.

### [3.0.0-preview.3] (February 2, 2023)

#### Installation (3.0.0-preview.3)

The preview is available on [npm][3.0.0-preview.3] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.3][3.0.0-preview.3]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.3/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.3/atlas.min.js"></script>
    ```

#### New features (3.0.0-preview.3)

- **\[BREAKING\]** Migrated from [adal-angular] to [@azure/msal-browser] used for authentication with Microsoft Azure Active Directory ([Azure AD]).
  Changes that might be required:
  - `Platform / Reply URL` Type must be set to `Single-page application` on Azure AD App Registration portal.
  - Code change is required if a custom `authOptions.authContext` is used.
  - For more information, see [How to migrate a JavaScript app from ADAL.js to MSAL.js][migration guide].

- Allow pitch and bearing being set with [CameraBoundsOptions] in [Map.setCamera(options)].

#### Bug fixes (3.0.0-preview.3)

- Fixed issue in [language mapping], now `zh-Hant-TW` no longer reverts back to `en-US`.

- Fixed the inability to switch between [user regions (view)].

- Fixed exception that occurred when style switching while progressive layer loading is in progress.

- Fixed the accessibility information retrieval from map tile label layers.

- Fixed the occasional issue where vector tiles aren't being rerendered after images are being added via [ImageSpriteManager.add()].

### [3.0.0-preview.2] (December 16, 2022)

#### Installation (3.0.0-preview.2)

The preview is available on [npm][3.0.0-preview.2] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.2][3.0.0-preview.2]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

  ```html
  <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.css" rel="stylesheet" />
  <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.js"></script>
    ```

#### New features (3.0.0-preview.2)

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map. For more information, see [2.2.2 release notes](#222-december-15-2022).

#### Bug fixes (3.0.0-preview.2)

- Fixed an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fixed the inability to disable traffic incidents in [TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used.

- Add `.atlas-map` to all css selectors to scope the styles within the map container. The fix prevents the css from accidentally adding unwanted styles to other elements on the page.

### [3.0.0-preview.1] (November 18, 2022)

### Installation (3.0.0-preview.1)

The preview is available on [npm][3.0.0-preview.1].

- Install [azure-maps-control@next][azure-maps-control] to your dependencies:

    ```shell
    npm i azure-maps-control@next
    ```

#### New features (3.0.0-preview.1)

This update is the first preview of the upcoming 3.0.0 release. The underlying [maplibre-gl] dependency has been upgraded from `1.14` to `3.0.0-pre.1`, offering improvements in stability and performance.

#### Bug fixes (3.0.0-preview.1)

- Fixed a regression issue that prevents IndoorManager from removing a tileset:

  ```js
  indoorManager.setOptions({
      tilesetId: undefined
  })
  ```

## v2

### [2.3.5] (November 29, 2023)

#### New features (2.3.5)

- Improved copyright control sizing for RWD.

#### Other changes (2.3.5)

- Migrated to the search v2 API for reverse geocoding.

### [2.3.4] (November 1, 2023)

#### Other changes (2.3.4)

- Removed Authorization headers from style, thumbnail, sprite, and glyph requests to enhance CDN caching for static assets.

- Updated the documentation for `map.clear()` and `layers.clear()`.

### [2.3.3] (October 6, 2023)

#### Bug fixes (2.3.3)

- Resolved the issue with dynamic attribution when progressive loading is enabled.

### [2.3.2] (August 11, 2023)

#### Bug fixes (2.3.2)

- Fixed an issue where accessibility-related duplicated DOM elements might result when `map.setServiceOptions` is called.

- Fixed zoom control to take into account the `maxBounds` [CameraOptions].

#### Other changes (2.3.2)

- Added the `mvc` parameter to encompass the map control version in both definitions and style requests.

### [2.3.1] (June 27, 2023)

#### Bug fixes (2.3.1)

- Fix `ImageSpriteManager` icon images might get removed during style change 

#### Other changes (2.3.1)

- Security: insecure-randomness fix in UUID generation.

### [2.3.0] (June 2, 2023)

#### New features (2.3.0)

- **\[BREAKING\]** Refactored the internal StyleManager to replace `_stylePatch` with `transformStyle`. This change will allow road shield icons to update and render properly after a style switch.

#### Bug fixes (2.3.0)

- Fixed an exception that occurred while updating the property of a layout that no longer exists.

- Fixed an issue where BubbleLayer's accessible indicators didn't update when the data source was modified.

#### Other changes (2.3.0)

- Updated attribution logo and link.

### [2.2.7] (May 2, 2023)

#### New features (2.2.7)

- In addition to map configuration, [Map.setServiceOptions()] now supports changing `domain`, `styleAPIVersion`, `styleDefinitionsVersion` on runtime.

#### Bug fixes (2.2.7)

- Fixed token expired exception on relaunches when using Azure AD / shared token / anonymous authentication by making sure authentication is resolved prior to any style definition request

- Fixed redundant style definition and thumbnail requests 

- Fixed incorrect `aria-label` applied to zoom out control button element

- Fixed the possibility of undefined copyright element container when withRuleBasedAttribution is set to false

- Fixed the possibility of event listener removal called on undefined target in EventManager.remove()

### [2.2.6]

#### Bug fixes (2.2.6)

- Resolved an issue where the first style set request was unauthenticated for `AAD` authentication.

- Eliminated redundant requests during map initialization and on style changed events.

### [2.2.5]

#### New features (2.2.5)

- Support dynamically updating mapConfiguration via `map.setServiceOptions({ mapConfiguration: 'MAP_CONFIG' })` 

### [2.2.4]

#### Bug fixes (2.2.4)

- Cleaned up various memory leaks in [Map.dispose()].

- Improved style picker's tab navigation for accessibility in list layout.

### [2.2.3]

#### New features (2.2.3)

- Allow pitch and bearing being set with [CameraBoundsOptions] in [Map.setCamera(options)].

#### Bug fixes (2.2.3)

- Fixed issue in [language mapping], now `zh-Hant-TW` no longer reverts back to `en-US`.

- Fixed the inability to switch between [user regions (view)].

- Fixed exception that occurred when style switching while progressive layer loading is in progress.

- Fixed the accessibility information retrieval from map tile label layers.

- Fixed the occasional issue where vector tiles aren't being rerendered after images are being added via [ImageSpriteManager.add()].

### [2.2.2] (December 15, 2022)

#### New features (2.2.2)

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map.

- `progressiveLoading`
  - Enables progressive loading of map layers.
  - Defaults to `false`.
- `progressiveLoadingInitialLayerGroups`
  - Specifies the layer groups to load first.
  - Defaults to `["base"]`.
  - Possible values are `base`, `transit`, `labels`, `buildings`, and `labels_places`.
  - Other layer groups are deferred such that the initial layer groups can be loaded first.

#### Bug fixes (2.2.2)

- Fixed an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fixed the inability to disable traffic incidents in [TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used.

## Next steps

Explore samples showcasing Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Samples]

Stay up to date on Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Blog]

[3.0.3]: https://www.npmjs.com/package/azure-maps-control/v/3.0.3
[3.0.2]: https://www.npmjs.com/package/azure-maps-control/v/3.0.2
[3.0.1]: https://www.npmjs.com/package/azure-maps-control/v/3.0.1
[3.0.0]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0
[3.0.0-preview.10]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.10
[3.0.0-preview.9]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.9
[3.0.0-preview.8]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.8
[3.0.0-preview.7]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.7
[3.0.0-preview.6]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.6
[3.0.0-preview.5]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.5
[3.0.0-preview.4]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.4
[3.0.0-preview.3]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.3
[3.0.0-preview.2]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.2
[3.0.0-preview.1]: https://www.npmjs.com/package/azure-maps-control/v/3.0.0-preview.1
[2.3.5]: https://www.npmjs.com/package/azure-maps-control/v/2.3.5
[2.3.4]: https://www.npmjs.com/package/azure-maps-control/v/2.3.4
[2.3.3]: https://www.npmjs.com/package/azure-maps-control/v/2.3.3
[2.3.2]: https://www.npmjs.com/package/azure-maps-control/v/2.3.2
[2.3.1]: https://www.npmjs.com/package/azure-maps-control/v/2.3.1
[2.3.0]: https://www.npmjs.com/package/azure-maps-control/v/2.3.0
[2.2.7]: https://www.npmjs.com/package/azure-maps-control/v/2.2.7
[2.2.6]: https://www.npmjs.com/package/azure-maps-control/v/2.2.6
[2.2.5]: https://www.npmjs.com/package/azure-maps-control/v/2.2.5
[2.2.4]: https://www.npmjs.com/package/azure-maps-control/v/2.2.4
[2.2.3]: https://www.npmjs.com/package/azure-maps-control/v/2.2.3
[2.2.2]: https://www.npmjs.com/package/azure-maps-control/v/2.2.2
[Azure AD]: ../active-directory/develop/v2-overview.md
[adal-angular]: https://github.com/AzureAD/azure-activedirectory-library-for-js
[@azure/msal-browser]: https://github.com/AzureAD/microsoft-authentication-library-for-js
[migration guide]: ../active-directory/develop/msal-compare-msal-js-and-adal-js.md
[CameraOptions]: /javascript/api/azure-maps-control/atlas.cameraoptions
[CameraBoundsOptions]: /javascript/api/azure-maps-control/atlas.cameraboundsoptions
[Map.dispose()]: /javascript/api/azure-maps-control/atlas.map#azure-maps-control-atlas-map-dispose
[Map.setCamera(options)]: /javascript/api/azure-maps-control/atlas.map#azure-maps-control-atlas-map-setcamera
[language mapping]: https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-maps/supported-languages.md#azure-maps-supported-languages
[user regions (view)]: /javascript/api/azure-maps-control/atlas.styleoptions#azure-maps-control-atlas-styleoptions-view
[ImageSpriteManager.add()]: /javascript/api/azure-maps-control/atlas.imagespritemanager#azure-maps-control-atlas-imagespritemanager-add
[Map.setServiceOptions()]: /javascript/api/azure-maps-control/atlas.map#azure-maps-control-atlas-map-setserviceoptions
[azure-maps-control]: https://www.npmjs.com/package/azure-maps-control
[maplibre-gl]: https://www.npmjs.com/package/maplibre-gl
[SourceManager]: /javascript/api/azure-maps-control/atlas.sourcemanager
[StyleOptions]: /javascript/api/azure-maps-control/atlas.styleoptions
[TrafficControlOptions]: /javascript/api/azure-maps-control/atlas.trafficcontroloptions
[Azure Maps Samples]: https://samples.azuremaps.com
[Azure Maps Blog]: https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog
