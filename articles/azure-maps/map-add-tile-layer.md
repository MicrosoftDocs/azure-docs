---
title: Add a tile layer to a map
titleSuffix: Microsoft Azure Maps
description: Learn how to superimpose images on maps. See an example that uses the Azure Maps Web SDK to add a tile layer containing a weather radar overlay to a map.
author: sinnypan
ms.author: sipa
ms.date: 06/08/2023
ms.topic: how-to
ms.service: azure-maps
---

# Add a tile layer to a map

This article shows you how to overlay a Tile layer on the map. Tile layers allow you to superimpose images on top of Azure Maps base map tiles. For more information on Azure Maps tiling system, see [Zoom levels and tile grid](zoom-levels-and-tile-grid.md).

A Tile layer loads in tiles from a server. These images can either be prerendered or dynamically rendered. Prerendered images are stored like any other image on a server using a naming convention that the tile layer understands. Dynamically rendered images use a service to load the images close to real time. There are three different tile service naming conventions supported by Azure Maps [TileLayer](/javascript/api/azure-maps-control/atlas.layer.tilelayer) class:

* X, Y, Zoom notation - X is the column, Y is the row position of the tile in the tile grid, and the Zoom notation a value based on the zoom level.
* Quadkey notation - Combines x, y, and zoom information into a single string value. This string value becomes a unique identifier for a single tile.
* Bounding Box -  Specify an image in the Bounding box coordinates format: `{west},{south},{east},{north}`. This format is commonly used by [web-mapping Services (WMS)](https://www.opengeospatial.org/standards/wms).

> [!TIP]
> A [TileLayer](/javascript/api/azure-maps-control/atlas.layer.tilelayer) is a great way to visualize large data sets on the map. Not only can a tile layer be generated from an image, vector data can also be rendered as a tile layer too. By rendering vector data as a tile layer, map control only needs to load the tiles which are smaller in file size than the vector data they represent. This technique is commonly used to render millions of rows of data on the map.

The tile URL passed into a Tile layer must be an http or an https URL to a TileJSON resource or a tile URL template that uses the following parameters:

* `{x}` - X position of the tile. Also needs `{y}` and `{z}`.
* `{y}` - Y position of the tile. Also needs `{x}` and `{z}`.
* `{z}` - Zoom level of the tile. Also needs `{x}` and `{y}`.
* `{quadkey}` - Tile quadkey identifier based on the Bing Maps tile system naming convention.
* `{bbox-epsg-3857}` - A bounding box string with the format `{west},{south},{east},{north}` in the EPSG 3857 Spatial Reference System.
* `{subdomain}` - A placeholder for the subdomain values, if specified the `subdomain` is added.
* `{azMapsDomain}` - A placeholder to align the domain and authentication of tile requests with the same values used by the map.

## Add a tile layer

 This sample shows how to create a tile layer that points to a set of tiles. This sample uses the x, y, zoom tiling system. The source of this tile layer is the [OpenSeaMap project], which contains crowd sourced nautical charts. Ideally users would clearly see the labels of cities as they navigate the map when viewing radar data. This behavior can be implemented by inserting the tile layer below the `labels` layer.

```javascript
//Create a tile layer and add it to the map below the label layer.
map.layers.add(new atlas.layer.TileLayer({
    tileUrl: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    opacity: 0.8,
    tileSize: 256,
    minSourceZoom: 7,
    maxSourceZoom: 17
}), 'labels');
```

For a fully functional sample that shows how to create a tile layer that points to a set of tiles using the x, y, zoom tiling system, see the [Tile Layer using X, Y, and Z] sample in the [Azure Maps Samples]. The source of the tile layer in this sample is a nautical chart from the [OpenSeaMap project], an OpenStreetMaps project licensed under ODbL. For the source code for this sample, see [Tile Layer using X, Y, and Z source code].

:::image type="content" source="./media/map-add-tile-layer/tile-layer.png"alt-text="A screenshot of map with a tile layer that points to a set of tiles using the x, y, zoom tiling system. The source of this tile layer is the OpenSeaMap project.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/BGEQjG/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------->

## Add an OGC web-mapping service (WMS)

A web-mapping service (WMTS) is an Open Geospatial Consortium (OGC) standard for serving images of map data. There are many open data sets available in this format that you can use with Azure Maps. This type of service can be used with a tile layer if the service supports the `EPSG:3857` coordinate reference system (CRS). When using a WMS service, set the width and height parameters to the value supported by the service, be sure to set this value in the `tileSize` option. In the formatted URL, set the `BBOX` parameter of the service with the `{bbox-epsg-3857}` placeholder.

For a fully functional sample that shows how to create a tile layer that points to a Web Mapping Service (WMS), see the [WMS Tile Layer] sample in the [Azure Maps Samples]. For the source code for this sample, see [WMS Tile Layer source code].

The following screenshot shows the [WMS Tile Layer] sample that overlays a web-mapping service of geological data from the [U.S. Geological Survey (USGS)] on top of the map and below the labels.

:::image type="content" source="./media/map-add-tile-layer/wms-tile-layer.png"alt-text="A screenshot of a world map with a tile layer that points to a Web Mapping Service (WMS).":::

<!--------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/BapjZqr?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------->

## Add an OGC web-mapping tile service (WMTS)

A web-mapping tile service (WMTS) is an Open Geospatial Consortium (OGC) standard for serving tiled based overlays for maps. There are many open data sets available in this format that you can use with Azure Maps. This type of service can be used with a tile layer if the service supports the `EPSG:3857` or `GoogleMapsCompatible` coordinate reference system (CRS). When using a WMTS service, set the width and height parameters to the same value supported by the service, be sure to also set this value in the `tileSize` option. In the formatted URL, replace the following placeholders accordingly:

* `{TileMatrix}` => `{z}`
* `{TileRow}` => `{y}`
* `{TileCol}` => `{x}`

For a fully functional sample that shows how to create a tile layer that points to a Web Mapping Tile Service (WMTS), see the [WMTS Tile Layer] sample in the [Azure Maps Samples]. For the source code for this sample, see [WMTS Tile Layer source code].

The following screenshot shows the WMTS Tile Layer sample overlaying a web-mapping tile service of imagery from the U.S. Geological Survey (USGS) National Map on top of a map, below roads and labels.

:::image type="content" source="./media/map-add-tile-layer/wmts-tile-layer.png"alt-text="A screenshot of a map with a tile layer that points to a Web Mapping Tile Service (WMTS) overlay.":::

<!--------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/BapjZVY?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------->

## Customize a tile layer

The tile layer class has many styling options. The [Tile Layer Options] sample is a tool to try them out. For the source code for this sample, see [Tile Layer Options source code].

:::image type="content" source="./media/map-add-tile-layer/tile-layer-options.png"alt-text="A screenshot of Tile Layer Options sample.":::

<!--------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/xQeRWX/?height=700&theme-id=0&default-tab=result]
----------------------------------------------->

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [TileLayer](/javascript/api/azure-maps-control/atlas.layer.tilelayer)

> [!div class="nextstepaction"]
> [TileLayerOptions](/javascript/api/azure-maps-control/atlas.tilelayeroptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add an image layer](./map-add-image-layer.md)

[Azure Maps Samples]: https://samples.azuremaps.com
[Tile Layer Options]: https://samples.azuremaps.com/tile-layers/tile-layer-options
[WMS Tile Layer]: https://samples.azuremaps.com/tile-layers/wms-tile-layer
[WMTS Tile Layer]: https://samples.azuremaps.com/tile-layers/wmts-tile-layer
[Tile Layer using X, Y, and Z]: https://samples.azuremaps.com/tile-layers/tile-layer-using-x,-y-and-z

[Tile Layer Options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Tile%20Layers/Tile%20Layer%20Options/Tile%20Layer%20Options.html
[WMS Tile Layer source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Tile%20Layers/WMS%20Tile%20Layer/WMS%20Tile%20Layer.html
[WMTS Tile Layer source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Tile%20Layers/WMTS%20Tile%20Layer/WMTS%20Tile%20Layer.html
[Tile Layer using X, Y, and Z source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Tile%20Layers/Tile%20Layer%20using%20X,%20Y%20and%20Z/Tile%20Layer%20using%20X,%20Y%20and%20Z.html

[OpenSeaMap project]: https://openseamap.org/index.php
[U.S. Geological Survey (USGS)]: https://mrdata.usgs.gov/
[U.S. Geological Survey (USGS) National Map]:https://viewer.nationalmap.gov/services
