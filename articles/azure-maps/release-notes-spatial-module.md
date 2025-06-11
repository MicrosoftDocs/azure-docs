---
title: Release notes - Spatial IO Module
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Spatial IO Module. 
author: sinnypan
ms.author: sipa
ms.date: 02/22/2024
ms.topic: reference
ms.service: azure-maps
ms.subservice: web-sdk
---

# Spatial IO Module release notes

This document contains information about new features and other changes to the Azure Maps Spatial IO Module.

## [0.1.8] (February 22, 2024)

### Bug fixes (0.1.8)

- Fix issue while processing replacement character when it doesn't have the expected binary code in spatial data.

## [0.1.7]

### New features (0.1.7)

- Introduced a new customization option, `bubbleRadiusFactor`, to enable users to adjust the default multiplier for the bubble radius in a SimpleDataLayer.

## [0.1.6]

### Other changes (0.1.6)

- Remove dependency on core Node.js modules, including `crypto` and `work_threads`.

## [0.1.5]

### Bug fixes (0.1.5)

- Adds missing check-in [WmsClient.getFeatureInfoHtml] that decides service capabilities.

## [0.1.4]

### Bug fixes (0.1.4)

- Make sure parsed geojson features (from KML) are always assigned with valid IDs

- Unescape XML &amp; that otherwise breaks valid urls

- Handles empty `<Icon><\Icon>` inside KMLReader

## Next steps

Explore samples showcasing Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Spatial IO Samples]

Stay up to date on Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Blog]

[WmsClient.getFeatureInfoHtml]: /javascript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient#azure-maps-spatial-io-atlas-io-ogc-wfsclient-getfeatureinfo
[0.1.8]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.8
[0.1.7]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.7
[0.1.6]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.6
[0.1.5]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.5
[0.1.4]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.4
[Azure Maps Spatial IO Samples]: https://samples.azuremaps.com/?search=Spatial%20IO%20Module
[Azure Maps Blog]: https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog
