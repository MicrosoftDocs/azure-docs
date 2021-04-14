---
title: Add a tile layer to a map | Microsoft Azure Maps
description: Learn how to superimpose images on maps. See an example that uses the Azure Maps Web SDK to add a tile layer containing a weather radar overlay to a map.
author: rbrundritt
ms.author: richbrun
ms.date: 3/25/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen, devx-track-js
---

# Add a tile layer to a map

This article shows you how to overlay a Tile layer on the map. Tile layers allow you to superimpose images on top of Azure Maps base map tiles. For more information on Azure Maps tiling system, see [Zoom levels and tile grid](zoom-levels-and-tile-grid.md).

A Tile layer loads in tiles from a server. These images can either be pre-rendered or dynamically rendered. Pre-rendered images are stored like any other image on a server using a naming convention that the tile layer understands. Dynamically rendered images use a service to load the images close to real time. There are three different tile service naming conventions supported by Azure Maps [TileLayer](/javascript/api/azure-maps-control/atlas.layer.tilelayer) class:

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
* `{subdomain}` - A placeholder for the subdomain values, if specified the `subdomain` will be added.
* `{azMapsDomain}` - A placeholder to align the domain and authentication of tile requests with the same values used by the map.

## Add a tile layer

 This sample shows how to create a tile layer that points to a set of tiles. This sample uses the x, y, zoom tiling system. he source of this tile layer is the [OpenSeaMap project](https://openseamap.org/index.php), which contains crowd sourced nautical charts. When viewing radar data, ideally users would clearly see the labels of cities as they navigate the map. This behavior can be implemented by inserting the tile layer below the `labels` layer.

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

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Tile Layer using X, Y, and Z' src='//codepen.io/azuremaps/embed/BGEQjG/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/BGEQjG/'>Tile Layer using X, Y, and Z</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add an OGC web-mapping service (WMS)

A web-mapping service (WMTS) is an Open Geospatial Consortium (OGC) standard for serving images of map data. There are many open data sets available in this format that you can use with Azure Maps. This type of service can be used with a tile layer if the service supports the `EPSG:3857` coordinate reference system (CRS). When using a WMS service, set the width and height parameters to the same value that is supported by the service, be sure to set this same value in the `tileSize` option. In the formatted URL, set the `BBOX` parameter of the service with the `{bbox-epsg-3857}` placeholder.

The following screenshot shows the above code overlaying a web-mapping service of geological data from the [U.S. Geological Survey (USGS)](https://mrdata.usgs.gov/) on top of a map, below the labels.

<br/>

<iframe height="265" style="width: 100%;" scrolling="no" title="WMS Tile Layer" src="https://codepen.io/azuremaps/embed/BapjZqr?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/BapjZqr'>WMS Tile Layer</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add an OGC web-mapping tile service (WMTS)

A web-mapping tile service (WMTS) is an Open Geospatial Consortium (OGC) standard for serving tiled based overlays for maps. There are many open data sets available in this format that you can use with Azure Maps. This type of service can be used with a tile layer if the service supports the `EPSG:3857` or `GoogleMapsCompatible` coordinate reference system (CRS). When using a WMTS service, set the width and height parameters to the same value that is supported by the service, be sure to set this same value in the `tileSize` option. In the formatted URL, replace the following placeholders accordingly:

* `{TileMatrix}` => `{z}`
* `{TileRow}` => `{y}`
* `{TileCol}` => `{x}`

The following screenshot shows the above code overlaying a web-mapping tile service of imagery from the [U.S. Geological Survey (USGS) National Map](https://viewer.nationalmap.gov/services/) on top of a map, below the roads and labels.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="WMTS tile layer" src="https://codepen.io/azuremaps/embed/BapjZVY?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/BapjZVY'>WMTS tile layer</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize a tile layer

The tile layer class has many styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='Tile Layer Options' src='//codepen.io/azuremaps/embed/xQeRWX/?height=700&theme-id=0&default-tab=result' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xQeRWX/'>Tile Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [TileLayer](/javascript/api/azure-maps-control/atlas.layer.tilelayer)

> [!div class="nextstepaction"]
> [TileLayerOptions](/javascript/api/azure-maps-control/atlas.tilelayeroptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add an image layer](./map-add-image-layer.md)
