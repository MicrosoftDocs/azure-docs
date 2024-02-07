---
title:  Add an Open Geospatial Consortium (OGC) map layer
titleSuffix: Microsoft Azure Maps
description: Learn how to overlay an OGC map layer on the map, and how to use the different options in the OgcMapLayer class.
author: sinnypan
ms.author: sipa
ms.date: 06/16/2023
ms.topic: how-to
ms.service: azure-maps
---

# Add a map layer from the Open Geospatial Consortium (OGC)

The `atlas.layer.OgcMapLayer` class can overlay Web Map Services (WMS) imagery and Web Map Tile Services (WMTS) imagery on the map. WMS is a standard protocol developed by OGC for serving georeferenced map images over the internet. Image georeferencing is the processes of associating an image to a geographical location. WMTS is also a standard protocol developed by OGC. It's designed for serving prerendered and georeferenced map tiles.

The following sections outline the web map service features supported by the `OgcMapLayer` class.

**Web Map Service (WMS)**

- Supported versions: `1.0.0`, `1.1.0`, `1.1.1`, and `1.3.0`
- The service must support the `EPSG:3857` projection system, or handle reprojections.
- GetFeatureInfo requires the service to support `EPSG:4326` or handle reprojections.
- Supported operations:

    | Operation | Description |
    | :-- | :-- |
    | GetCapabilities | Retrieves metadata about the service with the supported capabilities |
    | GetMap | Retrieves a map image for a specified region |
    | GetFeatureInfo | Retrieves `feature_info`, which contains underlying data about the feature |

**Web Map Tile Service (WMTS)**

- Supported versions: `1.0.0`
- Tiles must be square, such that `TileWidth == TileHeight`.
- CRS supported: `EPSG:3857` or `GoogleMapsCompatible`
- TileMatrix identifier must be an integer value that corresponds to a zoom level on the map. In Azure Maps, the zoom level is a value between `"0"` and `"22"`. So, `"0"` is supported, but `"00"` isn't supported.
- Supported operations:

    | Operation | Description |
    | :-- | :-- |
    | GetCapabilities | Retrieves the supported operations and features |
    | GetTile | Retrieves imagery for a particular tile |

## Overlay an OGC map layer

The `url` can be the base URL for the service or a full URL with the query for getting the capabilities of the service. Depending on the details provided, the WFS client may try several standard URL formats to determine how to initially access the service.

The [OGC map layer] sample shows how to overlay an OGC map layer on the map. For the source code for this sample, see [OGC map layer source code].

:::image type="content" source="./media/spatial-io-add-ogc-map-layer/ogc-map-layer.png"alt-text="A screenshot that shows the snap grid on map.":::

<!----------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/xxGLZWB/?height=700&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------->
## OGC map layer options

The [OGC map layer options] sample demonstrates the different OGC map layer options. For the source code for this sample, see [OGC map layer options source code].

:::image type="content" source="./media/spatial-io-add-ogc-map-layer/ogc-map-layer-options.png"alt-text="A screenshot that shows a map along with the OGC map layer options.":::

<!----------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/abOyEVQ/?height=700&theme-id=0&default-tab=result&embed-version=2&editable=true]
---------------------------------------------->

## OGC Web Map Service explorer

The [OGC Web Map Service explorer] sample overlays imagery from the Web Map Services (WMS) and Web Map Tile Services (WMTS) as layers. You may select which layers in the service are rendered on the map. You may also view the associated legends for these layers. For the source code for this sample, see [OGC Web Map Service explorer source code].

:::image type="content" source="./media/spatial-io-add-ogc-map-layer/ogc-web-map-service-explorer.png"alt-text="A screenshot that shows a map with a WMTS layer that comes from the world geology survey. Left of the map is a drop-down list showing the OGC services that can be selected.":::

<!----------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/YzXxYdX/?height=750&theme-id=0&default-tab=result&embed-version=2&editable=true]
---------------------------------------------->

You may also specify the map settings to use a proxy service. The proxy service lets you load resources that are hosted on domains that don't have CORS enabled.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [OgcMapLayer]

> [!div class="nextstepaction"]
> [OgcMapLayerOptions]

See the following articles, which contain code samples you could add to your maps:

> [!div class="nextstepaction"]
> [Connect to a WFS service]

> [!div class="nextstepaction"]
> [Leverage core operations]

> [!div class="nextstepaction"]
> [Supported data format details]

[Connect to a WFS service]: spatial-io-connect-wfs-service.md
[Leverage core operations]: spatial-io-core-operations.md
[OGC map layer options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/OGC%20map%20layer%20options/OGC%20map%20layer%20options.html
[OGC map layer options]: https://samples.azuremaps.com/spatial-io-module/ogc-map-layer-options
[OGC map layer source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/OGC%20map%20layer%20example/OGC%20map%20layer%20example.html
[OGC map layer]: https://samples.azuremaps.com/spatial-io-module/ogc-map-layer-example
[OGC Web Map Service explorer source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/OGC%20Web%20Map%20Service%20explorer/OGC%20Web%20Map%20Service%20explorer.html
[OGC Web Map Service explorer]: https://samples.azuremaps.com/spatial-io-module/ogc-web-map-service-explorer
[OgcMapLayer]: /javascript/api/azure-maps-spatial-io/atlas.layer.ogcmaplayer
[OgcMapLayerOptions]: /javascript/api/azure-maps-spatial-io/atlas.ogcmaplayeroptions
[Supported data format details]: spatial-io-supported-data-format-details.md
