---
title: Release notes - Map Control
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Web SDK. 
author: sinnypan
ms.author: sipa
ms.date: 04/09/2025
ms.topic: reference
ms.service: azure-maps
ms.subservice: web-sdk
---

# Web SDK map control release notes

This document contains information about new features and other changes to the Map Control.

## v3 (latest)

### [3.6.1] (CDN: April 7, 2025, npm: April 9, 2025)

#### Bug fixes
* Fix the issue where `maxBounds` wasn't included in `map.getCamera()`, causing it to be unset when `setCamera()` is called.

### [3.6.0] (CDN: February 18, 2025, npm: February 20, 2025)

#### New features
* Add a new option `StyleOptions.styleOverrides` which controls the visibility of various map elements, including `countryRegion`, `adminDistrict`, `adminDistrict2`, `buildingFootprint`, and `roadDetails`.
* Add `auto` option to `StyleOptions.language` and `atlas.setLanguage` which sets the language option to match the browser's Accept-Language header.

#### Bug fixes
* Resolve the issue where clicking the close button of a popup within a form element triggers the form submission.
* Fix the issue where `ImageLayer.setOptions()` potentially causing abort errors if the image is large and the request has not completed.

#### Other changes
* Disable the telemetry by default.

### [3.5.0] (CDN: November 4, 2024, npm: November 7, 2024)

#### New features
- Add support for fullscreen control.

#### Bug fixes
- Expose new type on `PolygonExtrusionLayerOptions.fillPattern` to support `DataDrivenPropertyValueSpecification<string>`.

### [3.4.0] (CDN: September 30, 2024, npm: October 2, 2024)

#### New features
- Add support for PMTiles.

#### Bug fixes
- Accessibility: Fix overflow issue with the style picker label in small containers.
- Fix attribution not updating after style changes with a GeoJSON data source.
- Fix `setCamera` with bounds and min/max zoom.
- Use `ResizeObserver` instead of window resize events.
- Fix footer logo width.

#### Other changes
- Add `@types/geojson` as a dependency.
- Update dependency `@microsoft/applicationinsights-web` to `^3.3.0`

### [3.3.0] (August 8, 2024)

#### New features
- Update the Copyright control
  - Make the copyright text smaller and ensure it fits on one line.
  - Use different types of Microsoft logos for different CSS themes to improve visibility.
  - Implement RWD to hide part of the component (MS logo) when the map canvas is relatively small.
- Enhance base layer class by adding abstract `getOptions` and `setOptions` functions.

#### Bug fixes
- Skip existing sources when copying user layers.
- **\[BREAKING\]** Address the incorrect ordering of latitude and longitude values in `Position.fromLatLng()`.
- Fix hidden accessible element visible issue on control buttons.

### [3.2.1] (May 13, 2024)

#### New features
- Constrain horizontal panning when `renderWorldCopies` is set to `false`.
- Make `easeTo` and `flyTo` animation smoother when the target point is close to the limits: maxBounds, vertical world edges, or antimeridian.


#### Bug fixes
- Correct accessible numbers for hidden controls while using 'Show numbers' command.
- Fix memory leak in worker when the map is removed.
- Fix unwanted zoom and panning changes at the end of a panning motion.

#### Other changes
- Improve the format of inline code in the document.

### [3.2.0] (March 29, 2024)

#### Other changes

- Upgrade MapLibre to [V4](https://github.com/maplibre/maplibre-gl-js/releases/tag/v4.0.0).

- Correct the default value of `HtmlMarkerOptions.pixelOffset` from `[0, -18]` to `[0, 0]` in the doc.

### [3.1.2] (February 22, 2024)

#### New features

- Added `fillAntialias` option to `PolygonLayer` for enabling MSAA antialiasing on polygon fills.
 
#### Other changes

- Update the feedback icon and link.

### [3.1.1] (January 26, 2024)

#### New features

- Added a new option, `enableAccessibilityLocationFallback`, to enable or disable reverse-geocoding API fallback for accessibility (screen reader).

#### Bug fixes

- Resolved an issue where ApplicationInsights v3.0.5 was potentially sending a large number of requests.

### [3.1.0] (January 12, 2024)

#### New features

- Added a new control, `atlas.control.ScaleControl`, to display a scale bar on the map.

- Introduced functions for accessing, updating, and deleting a feature state.

#### Bug fixes

- Addressed the issue of layer ordering after a style update, when a user layer is inserted before another user layer.

- **\[BREAKING\]** Aligned the polygon fill pattern behavior with Maplibre. Now, the `fillPattern` option consistently disables the `fillColor` option. When configuring `fillColor` for polygon layers, ensure that `fillPattern` is set to `undefined`.

### [3.0.3] (November 29, 2023)

#### New features

- Included ESM support.

#### Other changes

- The accessibility feature for screen reader has been upgraded to utilize the Search v2 API (reverse geocoding).

- Enhanced accessibility in the Compass and Pitch controls.

### [3.0.2] (November 1, 2023)

#### Bug fixes

- Addressed several errors in the type declaration file and added a dependency for `@maplibre/maplibre-gl-style-spec`.

#### Other changes

- Removed Authorization headers from style, thumbnail, sprite, and glyph requests to enhance CDN caching for static assets.

- Updated the documentation for `map.clear()` and `layers.clear()`.

### [3.0.1] (October 6, 2023)

#### Bug fixes

- Various accessibility improvements.

- Resolved the issue with dynamic attribution when progressive loading is enabled.

- Fixed missing event names in `HtmlMarkerEvents`.

#### Other changes

- Modified member methods to be protected for the zoom, pitch, and compass controls.

- Telemetry is disabled by default in the Azure Government cloud.

### [3.0.0] (August 18, 2023)

#### Bug fixes

- Fixed zoom control to take into account the `maxBounds` [CameraOptions].

- Fixed an issue that mouse positions are shifted after a css scale transform on the map container.

#### Other changes

- Phased out the style definition version `2022-08-05` and switched the default `styleDefinitionsVersion` to `2023-01-01`.

- Added the `mvc` parameter to encompass the map control version in both definitions and style requests.

#### Installation

The version is available on [npm][3.0.0] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0][3.0.0]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0/atlas.min.js"></script>
    ```

### [3.0.0-preview.10] (July 11, 2023)

#### Bug fixes

- Dynamic pixel ratio fixed in underlying maplibre-gl dependency.

- Fixed an issue where `sortKey`, `radialOffset`, `variableAnchor` isn't applied when used in `SymbolLayer` options.

#### Installation

The preview is available on [npm][3.0.0-preview.10] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.10][3.0.0-preview.10]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.10/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.10/atlas.min.js"></script>
    ```

### [3.0.0-preview.9] (June 27, 2023)

#### New features

- WebGL2 is used by default.

- Elevation APIs: `atlas.sources.ElevationTileSource`, `map.enableElevation(elevationSource, options)`, `map.disableElevation()`

- Ability to customize maxPitch / minPitch in `CameraOptions`

#### Bug fixes

- Fixed an issue where accessibility-related duplicated DOM elements might result when `map.setServiceOptions` is called

#### Installation
The preview is available on [npm][3.0.0-preview.9] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.9][3.0.0-preview.9]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.9/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.9/atlas.min.js"></script>
    ```
    
### [3.0.0-preview.8] (June 2, 2023)

#### Bug fixes

- Fixed an exception that occurred while updating the property of a layout that no longer exists.

- Fixed an issue where BubbleLayer's accessible indicators didn't update when the data source was modified.

- Fixed an error in subsequent `map.setStyle()` calls if the raw Maplibre style is retrieved in the `stylechanged` event callback on style serialization.

#### Other changes

- Updated attribution logo and link.

#### Installation

The preview is available on [npm][3.0.0-preview.8] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.8][3.0.0-preview.8]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.8/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.8/atlas.min.js"></script>
    ```

### [3.0.0-preview.7] (May 2, 2023)

#### New features

- In addition to map configuration, [Map.setServiceOptions()] now supports changing `domain`, `styleAPIVersion`, `styleDefinitionsVersion` on runtime.

#### Bug fixes

- Fixed token expired exception on relaunches when using Azure AD / shared token / anonymous authentication by making sure authentication is resolved prior to any style definition request

- Fixed redundant style definition and thumbnail requests 

- Fixed incorrect `aria-label` applied to zoom out control button element

- Fixed the possibility of undefined copyright element container when withRuleBasedAttribution is set to false

- Fixed the possibility of event listener removal called on undefined target in `EventManager.remove()`

#### Installation

The preview is available on [npm][3.0.0-preview.7] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.7][3.0.0-preview.7]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.7/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.7/atlas.min.js"></script>
    ```

### [3.0.0-preview.6] (March 31, 2023)

#### Installation

The preview is available on [npm][3.0.0-preview.6] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.6][3.0.0-preview.6]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.6/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.6/atlas.min.js"></script>
    ```

#### New features

- Optimized the internal style transform performance.

#### Bug fixes

- Resolved an issue where the first style set request was unauthenticated for `AAD` authentication.

- Eliminated redundant requests during map initialization and on style changed events.

### [3.0.0-preview.5] (March 15, 2023)

#### Installation

The preview is available on [npm][3.0.0-preview.5] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.5][3.0.0-preview.5]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.5/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.5/atlas.min.js"></script>
    ```

#### New features

- Support dynamically updating mapConfiguration via `map.setServiceOptions({ mapConfiguration: 'MAP_CONFIG' })` 

### [3.0.0-preview.4] (March 10, 2023)  

#### Installation

The preview is available on [npm][3.0.0-preview.4] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.4][3.0.0-preview.4]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.4/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.4/atlas.min.js"></script>
    ```

#### New features

- Extended map coverage in China, Japan, and Korea.

- Preview of refreshed map styles (Road / Night / Hybrid / Gray Scale Dark / Gray Scale Light / Terra / High Contrast Dark / High Contrast Light).

- More details on roads/building footprints/trails coverage.

- Wider zoom level ranges (1~21) for the Terra style.

- Greater details on public transit including ferries, metros, and bus stops.

- Additional information about the altitude of mountains and the location of waterfalls.

#### Changes

- Traffic data now only support relative mode.

- Deprecated `showBuildingModels` in [StyleOptions].

- Changed the default `minZoom` from -2 to 1.

#### Bug fixes

- Cleaned up various memory leaks in [Map.dispose()].

- Improved style picker's tab navigation for accessibility in list layout.

- Optimized style switching by avoiding deep cloning objects.

- Fixed an exception that occurred in [SourceManager] when style switching with sources that weren't vector or raster. 

- **\[BREAKING\]** Previously `sourceadded` events are only emitted if new sources are added to the style. Now `sourceremoved` / `sourceadded` events are emitted when the new source and the original source in the current style aren't equal, even if they have the same source ID.

### [3.0.0-preview.3] (February 2, 2023)

#### Installation

The preview is available on [npm][3.0.0-preview.3] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.3][3.0.0-preview.3]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

    ```html
    <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.3/atlas.min.css" rel="stylesheet" />
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.3/atlas.min.js"></script>
    ```

#### New features

- **\[BREAKING\]** Migrated from [adal-angular] to [@azure/msal-browser] used for authentication with Microsoft Azure Active Directory ([Azure AD]).
  Changes that might be required:
  - `Platform / Reply URL` Type must be set to `Single-page application` on Azure AD App Registration portal.
  - Code change is required if a custom `authOptions.authContext` is used.
  - For more information, see [How to migrate a JavaScript app from ADAL.js to MSAL.js][migration guide].

- Allow pitch and bearing being set with [CameraBoundsOptions] in [Map.setCamera(options)].

#### Bug fixes

- Fixed issue in [language mapping], now `zh-Hant-TW` no longer reverts back to `en-US`.

- Fixed the inability to switch between [user regions (view)].

- Fixed exception that occurred when style switching while progressive layer loading is in progress.

- Fixed the accessibility information retrieval from map tile label layers.

- Fixed the occasional issue where vector tiles aren't being rerendered after images are being added via [ImageSpriteManager.add()].

### [3.0.0-preview.2] (December 16, 2022)

#### Installation

The preview is available on [npm][3.0.0-preview.2] and CDN.

- **NPM:** Refer to the instructions at [azure-maps-control@3.0.0-preview.2][3.0.0-preview.2]

- **CDN:** Reference the following CSS and JavaScript in the `<head>` element of an HTML file:

  ```html
  <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.css" rel="stylesheet" />
  <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3.0.0-preview.2/atlas.min.js"></script>
    ```

#### New features

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map. For more information, see [2.2.2 release notes](#222-december-15-2022).

#### Bug fixes

- Fixed an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fixed the inability to disable traffic incidents in [TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used.

- Add `.atlas-map` to all css selectors to scope the styles within the map container. The fix prevents the css from accidentally adding unwanted styles to other elements on the page.

### [3.0.0-preview.1] (November 18, 2022)

### Installation

The preview is available on [npm][3.0.0-preview.1].

- Install [azure-maps-control@next][azure-maps-control] to your dependencies:

    ```shell
    npm i azure-maps-control@next
    ```

#### New features

This update is the first preview of the upcoming 3.0.0 release. The underlying [maplibre-gl] dependency has been upgraded from `1.14` to `3.0.0-pre.1`, offering improvements in stability and performance.


## v2

### [2.3.7] (February 22, 2024)

#### New features

- Added `fillAntialias` option to `PolygonLayer` for enabling MSAA antialiasing on polygon fills.
- Added a new option, `enableAccessibilityLocationFallback`, to enable or disable reverse-geocoding API fallback for accessibility (screen reader).
 
#### Other changes

- Update the feedback icon and link.

### [2.3.6] (January 12, 2024)

#### New features

- Added a new control, `atlas.control.ScaleControl`, to display a scale bar on the map.

- Introduced functions for accessing, updating, and deleting a feature state.

#### Bug fixes

- Addressed the issue of layer ordering after a style update, when a user layer is inserted before another user layer.

### [2.3.5] (November 29, 2023)

#### Other changes

- The accessibility feature for screen reader has been upgraded to utilize the Search v2 API (reverse geocoding).

### [2.3.4] (November 1, 2023)

#### Other changes

- Removed Authorization headers from style, thumbnail, sprite, and glyph requests to enhance CDN caching for static assets.

- Updated the documentation for `map.clear()` and `layers.clear()`.

### [2.3.3] (October 6, 2023)

#### Bug fixes

- Resolved the issue with dynamic attribution when progressive loading is enabled.

### [2.3.2] (August 11, 2023)

#### Bug fixes

- Fixed an issue where accessibility-related duplicated DOM elements might result when `map.setServiceOptions` is called.

- Fixed zoom control to take into account the `maxBounds` [CameraOptions].

#### Other changes

- Added the `mvc` parameter to encompass the map control version in both definitions and style requests.

### [2.3.1] (June 27, 2023)

#### Bug fixes

- Fix `ImageSpriteManager` icon images might get removed during style change 

#### Other changes

- Security: insecure-randomness fix in UUID generation.

### [2.3.0] (June 2, 2023)

#### New features

- **\[BREAKING\]** Refactored the internal StyleManager to replace `_stylePatch` with `transformStyle`. This change will allow road shield icons to update and render properly after a style switch.

#### Bug fixes

- Fixed an exception that occurred while updating the property of a layout that no longer exists.

- Fixed an issue where BubbleLayer's accessible indicators didn't update when the data source was modified.

#### Other changes

- Updated attribution logo and link.

### [2.2.7] (May 2, 2023)

#### New features

- In addition to map configuration, [Map.setServiceOptions()] now supports changing `domain`, `styleAPIVersion`, `styleDefinitionsVersion` on runtime.

#### Bug fixes

- Fixed token expired exception on relaunches when using Azure AD / shared token / anonymous authentication by making sure authentication is resolved prior to any style definition request

- Fixed redundant style definition and thumbnail requests 

- Fixed incorrect `aria-label` applied to zoom out control button element

- Fixed the possibility of undefined copyright element container when withRuleBasedAttribution is set to false

- Fixed the possibility of event listener removal called on undefined target in EventManager.remove()

### [2.2.6]

#### Bug fixes

- Resolved an issue where the first style set request was unauthenticated for `AAD` authentication.

- Eliminated redundant requests during map initialization and on style changed events.

### [2.2.5]

#### New features

- Support dynamically updating mapConfiguration via `map.setServiceOptions({ mapConfiguration: 'MAP_CONFIG' })` 

### [2.2.4]

#### Bug fixes

- Cleaned up various memory leaks in [Map.dispose()].

- Improved style picker's tab navigation for accessibility in list layout.

### [2.2.3]

#### New features

- Allow pitch and bearing being set with [CameraBoundsOptions] in [Map.setCamera(options)].

#### Bug fixes

- Fixed issue in [language mapping], now `zh-Hant-TW` no longer reverts back to `en-US`.

- Fixed the inability to switch between [user regions (view)].

- Fixed exception that occurred when style switching while progressive layer loading is in progress.

- Fixed the accessibility information retrieval from map tile label layers.

- Fixed the occasional issue where vector tiles aren't being rerendered after images are being added via [ImageSpriteManager.add()].

### [2.2.2] (December 15, 2022)

#### New features

Add `progressiveLoading` and `progressiveLoadingInitialLayerGroups` to [StyleOptions] to enable the capability of loading map layers progressively. This feature improves the perceived loading time of the map.

- `progressiveLoading`
  - Enables progressive loading of map layers.
  - Defaults to `false`.
- `progressiveLoadingInitialLayerGroups`
  - Specifies the layer groups to load first.
  - Defaults to `["base"]`.
  - Possible values are `base`, `transit`, `labels`, `buildings`, and `labels_places`.
  - Other layer groups are deferred such that the initial layer groups can be loaded first.

#### Bug fixes

- Fixed an issue that the ordering of user layers wasn't preserved after calling `map.layers.move()`.

- Fixed the inability to disable traffic incidents in [TrafficControlOptions] when `new atlas.control.TrafficControl({incidents: false})` is used.

## Next steps

Explore samples showcasing Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Samples]

Stay up to date on Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Blog]

[3.6.1]: https://www.npmjs.com/package/azure-maps-control/v/3.6.1
[3.6.0]: https://www.npmjs.com/package/azure-maps-control/v/3.6.0
[3.5.0]: https://www.npmjs.com/package/azure-maps-control/v/3.5.0
[3.4.0]: https://www.npmjs.com/package/azure-maps-control/v/3.4.0
[3.3.0]: https://www.npmjs.com/package/azure-maps-control/v/3.3.0
[3.2.1]: https://www.npmjs.com/package/azure-maps-control/v/3.2.1
[3.2.0]: https://www.npmjs.com/package/azure-maps-control/v/3.2.0
[3.1.2]: https://www.npmjs.com/package/azure-maps-control/v/3.1.2
[3.1.1]: https://www.npmjs.com/package/azure-maps-control/v/3.1.1
[3.1.0]: https://www.npmjs.com/package/azure-maps-control/v/3.1.0
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
[2.3.7]: https://www.npmjs.com/package/azure-maps-control/v/2.3.7
[2.3.6]: https://www.npmjs.com/package/azure-maps-control/v/2.3.6
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
