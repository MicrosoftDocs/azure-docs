


## Add an OGC map layer

The `atlas.layer.OgcMapLayer` class adds support for overlaying imagery from Web Mapping Services (WMS) and Web Mapping Tile Services (WMTS) on top of the map. 

The following outlines the web mapping service features supported by the `OgcMapLayer` class.

**Web Mapping Service (WMS)**

- Supported versions: 1.0.0, 1.1.0, 1.1.1, 1.3.0
- Supported operations: `GetCapabilities` (capabilities), `GetMap` (map), `GetFeatureInfo` (`feature_info`)
- The service must support `EPSG:3857` or handle reprojections. 
- GetFeatureInfo requires the service to support `EPSG:4326` or handle reprojections. 

**Web Mapping Tile Service (WMTS)**

- Supported versions: 1.0.0
- Supported operations: `GetCapabilities`, `GetTile`
- Tiles must be square (`TileWidth == TileHeight`).
- CRS supported: `EPSG:3857` or `GoogleMapsCompatible` 
- TileMatrix identifier must be an integer value that corrosponds to a zoom level on the map. `"00"` not supported.

## Overlay an OGC map layer

The `url` can be the base URL for the service or a full URL with the query for getting the capabilities of the service. Depending on the details provided, the WFS client may try several different standard URL formats to determine how to access the service initially. 

The following code shows how to overlay an OGC map layer on the map. 

//TODO: codepen - OGC Map layer example

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
