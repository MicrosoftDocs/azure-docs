---
title:  Add an Open Geospatial Consortium (OGC) map layer | Microsoft Azure Maps
description: Learn how to overlay an OGC map layer on the map, and how to use the different options in the OgcMapLayer class.
author: philmea
ms.author: philmea
ms.date: 03/02/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a map layer from the Open Geospatial Consortium (OGC)

The `atlas.layer.OgcMapLayer` class can overlay Web Map Services (WMS) imagery and Web Map Tile Services (WMTS) imagery on the map. WMS is a standard protocol developed by OGC for serving georeferenced map images over the internet. Image georeferencing is the processes of associating an image to a geographical location. WMTS is also a standard protocol developed by OGC. It's designed for serving pre-rendered and georeferenced map tiles.

The following sections outline the web map service features that are supported by the `OgcMapLayer` class.

**Web Map Service (WMS)**

- Supported versions: `1.0.0`, `1.1.0`, `1.1.1`, and `1.3.0`
- The service must support the `EPSG:3857` projection system, or handle reprojections.
- GetFeatureInfo requires the service to support `EPSG:4326` or handle reprojections. 
- Supported operations:

    | | |
    | :-- | :-- |
    | GetCapabilities | Retrieves metadata about the service with the supported capabilities |
    | GetMap | Retrieves a map image for a specified region |
    | GetFeatureInfo | Retrieves `feature_info`, which contains underlying data about the feature |

**Web Map Tile Service (WMTS)**

- Supported versions: `1.0.0`
- Tiles must be square, such that `TileWidth == TileHeight`.
- CRS supported: `EPSG:3857` or `GoogleMapsCompatible` 
- TileMatrix identifier must be an integer value that corresponds to a zoom level on the map. On an azure map, the zoom level is a value between `"0"` and `"22"`. So, `"0"` is supported, but `"00"` isn't supported.
- Supported operations:

    | | |
    | :-- | :-- |
    | GetCapabilities | Retrieves the supported operations and features |
    | GetTile | Retrieves imagery for a particular tile |

## Overlay an OGC map layer

The `url` can be the base URL for the service or a full URL with the query for getting the capabilities of the service. Depending on the details provided, the WFS client may try several standard URL formats to determine how to initially access the service.

The following code shows how to overlay an OGC map layer on the map.

<br/>

<iframe height='700' scrolling='no' title='OGC Map layer example' src='//codepen.io/azuremaps/embed/xxGLZWB/?height=700&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xxGLZWB/'>OGC Map layer example</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## OGC map layer options

The below sample demonstrates the different OGC map layer options. You may click on the code pen button at the top-right corner to edit the code pen.

<br/>

<iframe height='700' scrolling='no' title='OGC map layer options' src='//codepen.io/azuremaps/embed/abOyEVQ/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/abOyEVQ/'>OGC map layer options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## OGC Web Map Service explorer

The following tool overlays imagery from the Web Map Services (WMS) and Web Map Tile Services (WMTS) as layers. You may select which layers in the service are rendered on the map. You may also view the associated legends for these layers.

<br/>

<iframe height='750' style='width: 100%;' scrolling='no' title='OGC Web Map Service explorer' src='//codepen.io/azuremaps/embed/YzXxYdX/?height=750&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/YzXxYdX/'>OGC Web Map Service explorer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

You may also specify the map settings to use a proxy service. The proxy service lets you load resources that are hosted on domains that don't have CORS enabled.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [OgcMapLayer](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.layer.ogcmaplayer)

> [!div class="nextstepaction"]
> [OgcMapLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.ogcmaplayeroptions)

See the following articles, which contain code samples you could add to your maps:

> [!div class="nextstepaction"]
> [Connect to a WFS service](spatial-io-connect-wfs-service.md)

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
