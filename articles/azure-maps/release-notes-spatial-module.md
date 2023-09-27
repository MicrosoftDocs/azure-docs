---
title: Release notes - Spatial IO Module
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Spatial IO Module. 
author: sipa
ms.author: sipa
ms.date: 5/23/2023
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Spatial IO Module release notes

This document contains information about new features and other changes to the Azure Maps Spatial IO Module.

## [0.1.5]

### Bug fixes (0.1.5)

- adds missing check in [WmsClient.getFeatureInfoHtml] that decides service capabilities.

## [0.1.4]

### Bug fixes (0.1.4)

- make sure parsed geojson features (from KML) are always assigned with valid IDs

- unescape XML &amp; that otherwise breaks valid urls

- handles empty `<Icon><\Icon>` inside KMLReader

## Next steps

Explore samples showcasing Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Spatial IO Samples]

Stay up to date on Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Blog]

[WmsClient.getFeatureInfoHtml]: /javascript/api/azure-maps-spatial-io/atlas.io.ogc.wfsclient#azure-maps-spatial-io-atlas-io-ogc-wfsclient-getfeatureinfo
[0.1.5]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.5
[0.1.4]: https://www.npmjs.com/package/azure-maps-spatial-io/v/0.1.4
[Azure Maps Spatial IO Samples]: https://samples.azuremaps.com/?search=Spatial%20IO%20Module
[Azure Maps Blog]: https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog
