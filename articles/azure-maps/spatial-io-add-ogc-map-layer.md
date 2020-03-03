---
title:  Read and write spatial data | Microsoft Azure Maps
description: Learn how to read and write data using the Spatial IO module, provided by Azure Maps Web SDK.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/02/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


## Add an OGC map layer

The `atlas.layer.OgcMapLayer` class adds support for overlaying imagery from Web Mapping Services (WMS) and Web Mapping Tile Services (WMTS) on top of the map. 

The following outlines the web mapping service features supported by the `OgcMapLayer` class.

**Web Mapping Service (WMS)**

- Supported versions: 1.0.0, 1.1.0, 1.1.1, 1.3.0
- The service must support `EPSG:3857` or handle reprojections. 
- GetFeatureInfo requires the service to support `EPSG:4326` or handle reprojections. 
- Supported operations:

| | |
| :-- | :-- |
| GetCapabilities | Retrieved the capabilities, such as: supported operations, parameters, available layers, and metadata |
| GetMap | Retrieved a map image for a specified region|
| GetFeatureInfo | Retrieves `feature_info` |

**Web Mapping Tile Service (WMTS)**

- Supported versions: 1.0.0
- Tiles must be square, such that `TileWidth == TileHeight`.
- CRS supported: `EPSG:3857` or `GoogleMapsCompatible` 
- TileMatrix identifier must be an integer value that corresponds to a zoom level on the map. `"00"` is not supported.
- Supported operations: 

| | |
| :-- | :-- |
| GetCapabilities | |
| GetTile | |

## Overlay an OGC map layer

The `url` can be the base URL for the service or a full URL with the query for getting the capabilities of the service. Depending on the details provided, the WFS client may try several different standard URL formats to determine how to access the service initially. 

The following code shows how to overlay an OGC map layer on the map. 

<br/>

<iframe height='500' scrolling='no' title='OGC Map layer example' src='/codepen.io/azuremaps/embed/xxGLZWB/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xxGLZWB/'>OGC Map layer example</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## OGC map layer options

//TODO: codepen - OGC map layer options (Have this show the results tab like the layer options examples)

## OGC Web Map Service explorer

The following code sample is a tool for viewing Web Map Services (WMS) and Web Map Tile Services (WMTS) as layers on the map, as well as being able to select which layers in the service are rendered and display the associated legends.

//TODO: codepen - OGC Web Map Service explorer (Have this show the results tab like the layer options examples)

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [OgcMapLayer](https://docs.microsoft.com/en-us/javascript/api/azure-maps-spatial-io/atlas.layer.ogcmaplayer)

> [!div class="nextstepaction"]
> [OgcMapLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.ogcmaplayeroptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Connect to a WFS service](spatial-io-connect-wfs-service.md)

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
