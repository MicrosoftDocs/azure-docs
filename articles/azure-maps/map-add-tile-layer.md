---
title: Add a tile layer to a map | Microsoft Azure Maps
description: In this article, you will learn how to overlay a tile Layer on a map by using the Microsoft Azure Maps Web SDK. Tile layers allow you to render images on a map.
author: rbrundritt
ms.author: richbrun
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a tile layer to a map

This article shows you how to overlay a Tile layer on the map. Tile layers allow you to superimpose images on top of Azure Maps base map tiles. For more information on Azure Maps tiling system, see [Zoom levels and tile grid](zoom-levels-and-tile-grid.md).

A Tile layer loads in tiles from a server. These images can either be pre-rendered or dynamically rendered. Pre-rendered images are stored like any other image on a server using a naming convention that the tile layer understands. Dynamically rendered images use a service to load the images close to real time. There are three different tile service naming conventions supported by Azure Maps [TileLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.tilelayer?view=azure-iot-typescript-latest) class: 

* X, Y, Zoom notation - X is the column, Y is the row position of the tile in the tile grid, and the Zoom notation a value based on the zoom level.
* Quadkey notation - Combines x, y, and zoom information into a single string value. This string value becomes a unique identifier for a single tile.
* Bounding Box -  Specify an image in the Bounding box coordinates format: `{west},{south},{east},{north}`. This format is commonly used by [Web Mapping Services (WMS)](https://www.opengeospatial.org/standards/wms).

> [!TIP]
> A [TileLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.tilelayer?view=azure-iot-typescript-latest) is a great way to visualize large data sets on the map. Not only can a tile layer be generated from an image, vector data can also be rendered as a tile layer too. By rendering vector data as a tile layer, map control only needs to load the tiles which are smaller in file size than the vector data they represent. This technique is commonly used to render millions of rows of data on the map.

The tile URL passed into a Tile layer must be an http or an https URL to a TileJSON resource or a tile URL template that uses the following parameters: 

* `{x}` - X position of the tile. Also needs `{y}` and `{z}`.
* `{y}` - Y position of the tile. Also needs `{x}` and `{z}`.
* `{z}` - Zoom level of the tile. Also needs `{x}` and `{y}`.
* `{quadkey}` - Tile quadkey identifier based on the Bing Maps tile system naming convention.
* `{bbox-epsg-3857}` - A bounding box string with the format `{west},{south},{east},{north}` in the EPSG 3857 Spatial Reference System.
* `{subdomain}` - A placeholder for the subdomain values, if specified the `subdomain` will be added.

## Add a tile layer

 This sample shows how to create a tile layer that points to a set of tiles. This sample uses the x, y, zoom tiling system. The source of this tile layer is a weather radar overlay from the [Iowa Environmental Mesonet of Iowa State University](https://mesonet.agron.iastate.edu/ogc/). When viewing radar data, ideally users would clearly see the labels of cities as they navigate the map. This behavior can be implemented by inserting the tile layer below the `labels` layer.

```javascript
//Create a tile layer and add it to the map below the label layer.
//Weather radar tiles from Iowa Environmental Mesonet of Iowa State University.
map.layers.add(new atlas.layer.TileLayer({
    tileUrl: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png',
    opacity: 0.8,
    tileSize: 256
}), 'labels');
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Tile Layer using X, Y, and Z' src='//codepen.io/azuremaps/embed/BGEQjG/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/BGEQjG/'>Tile Layer using X, Y, and Z</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize a tile layer

The tile layer class has many styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='Tile Layer Options' src='//codepen.io/azuremaps/embed/xQeRWX/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xQeRWX/'>Tile Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [TileLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.tilelayer?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [TileLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.tilelayeroptions?view=azure-iot-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add an image layer](./map-add-image-layer.md)
