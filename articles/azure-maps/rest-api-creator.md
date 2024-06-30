---
title: Links to the Azure Maps Creator Rest API
titleSuffix: Microsoft Azure Maps Creator
description: Links to the Azure Maps Creator Rest API
author: eriklindeman
ms.author: eriklind
ms.date: 02/05/2024
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Creator Rest API

Indoor mapping is a technology that enables the creation of digital maps of the interior of buildings. It helps visitors navigate through buildings and locate points of interest such as restrooms, conference rooms, and offices. Indoor mapping can be used to create a more convenient and enjoyable visitor experience. Visitors can spend less time searching for building directories and more time discovering new points of interest. With Azure Maps Creator, you can create indoor maps that enable customers to zoom in and out of a building to see each floor and navigate to any desired location using Creator's wayfinding service. In addition to common mapping functionality, Azure Maps Creator offers an array of useful services that enable you to implement functionality such as asset tracking, facility management, workspace optimization, hybrid work models to support a blend of in-office, remote, and on-the-go working, and much more.

The following tables offer high-level overviews of the services that Azure Maps Creator offers:

## Latest release

The most recent stable release of the Creator services.

| API | API version | Description |
|-----|-------------|-------------|
| [Alias] | 2.0 | This API allows the caller to assign an alias to reference a resource. |
| [Conversion] | 2.0 | Used to import a set of DWG design files as a zipped [Drawing Package](https://aka.ms/am-drawing-package) into Azure Maps.|
| [Dataset] | 2.0 | A collection containing the indoor map [features](/azure/azure-maps/glossary#feature) of a facility. This API allows the caller to create a dataset from previously uploaded data. |
| [Feature State] | 2.0 | The Feature stateset can be used to dynamically render features in a facility according to their current state and respective map style. |
| [Tileset] | 2.0 | A `tileset` is a collection of vector tiles that render on the map, created from an existing dataset. |
| [WFS] | 2.0 | Use the Web Feature Service (WFS) API to query for all feature collections or a specific collection within a dataset. For example, you can use WFS to find all mid-size meeting rooms in a specific building and floor level. |

## Latest preview

Pre-release version of a Creator service. Preview releases contain new functionality or updates to existing functionality that will be included in a future release.

| API | API version | Description |
|-----|-------------|-------------|
| [Alias][Alias-preview] | 2023-03-01-preview | This API allows the caller to assign an alias to reference a resource. |
| [Conversion][Conversion-preview] | 2023-03-01-preview | Used to import a set of DWG design files as a zipped [Drawing Package](https://aka.ms/am-drawing-package) into Azure Maps.|
| [Dataset][Dataset-preview] | 2023-03-01-preview | A collection of indoor map [features](/azure/azure-maps/glossary#feature) in a facility. This API allows the caller to create a dataset from previously uploaded data. |
| [Feature State][Feature State-preview] | 2023-03-01-preview | The Feature stateset can be used to dynamically render features in a facility according to their current state and respective map style. |
| [Features] | 2023-03-01-preview | An instance of an object produced from the [Conversion][Conversion-preview] service that combines a geometry with metadata information. |
| [Map Configuration] | 2023-03-01-preview | Map Configuration in indoor mapping refers to the default settings of a map that are applied when the map is loaded. It includes the default zoom level, center point, and other map settings. |
| [Routeset] | 2023-03-01-preview | Use the routeset API to create the data that the wayfinding service needs to generate paths. |
| [Style] | 2023-03-01-preview | Use the Style API to customize your facility's look and feel. Everything is configurable from the color of a feature, the icon that renders, or the zoom level when a feature should appear or disappear. |
| [Tileset][Tileset-preview] | 2023-03-01-preview | A collection of vector tiles that render on the map, created from an existing dataset. |
| [Wayfinding] | 2023-03-01-preview | Wayfinding is a technology that helps people navigate through complex indoor environments such as malls, offices, stadiums, airports and office buildings. |

<!--- V2 is the latest stable release of each Creator service --->

[Alias]: /rest/api/maps-creator/alias
[Conversion]: /rest/api/maps-creator/conversion
[Dataset]: /rest/api/maps-creator/dataset
[Feature State]: /rest/api/maps-creator/feature-state
[Tileset]: /rest/api/maps-creator/tileset
[WFS]: /rest/api/maps-creator/wfs

<!---  2023-03-01-preview  is the latest preview release of each Creator service  ---->

[Alias-preview]: /rest/api/maps-creator/alias?view=rest-maps-creator-2023-03-01-preview
[Conversion-preview]: /rest/api/maps-creator/conversion?view=rest-maps-creator-2023-03-01-preview
[Dataset-preview]: /rest/api/maps-creator/dataset?view=rest-maps-creator-2023-03-01-preview
[Feature State-preview]: /rest/api/maps-creator/feature-state?view=rest-maps-creator-2023-03-01-preview
[Features]: /rest/api/maps-creator/features?view=rest-maps-creator-2023-03-01-preview
[Map configuration]: /rest/api/maps-creator/map-configuration?view=rest-maps-creator-2023-03-01-preview
[Routeset]: /rest/api/maps-creator/routeset?view=rest-maps-creator-2023-03-01-preview
[Style]: /rest/api/maps-creator/style?view=rest-maps-creator-2023-03-01-preview
[Tileset-preview]: /rest/api/maps-creator/tileset?view=rest-maps-creator-2023-03-01-preview
[Wayfinding]: /rest/api/maps-creator/wayfinding?view=rest-maps-creator-2023-03-01-preview