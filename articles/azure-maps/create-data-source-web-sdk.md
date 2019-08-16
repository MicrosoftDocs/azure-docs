---
title: Create a data source in Azure Maps | Microsoft Docs
description: How to create a data source and use it with Azure Maps Web SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 08/08/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Create a data source

The Azure Maps Web SDK stores data in data sources that optimizes the data for querying and rendering. Currently there are two types of data sources:

**GeoJSON data source**

A GeoJSON based data source can load and store data locally using the `DataSource` class. GeoJSON data can be manually created or created using the helper classes in the [atlas.data](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data) namespace. The `DataSource` class provides functions for importing local or remote GeoJSON files. Remote GeoJSON files must be hosted on a CORs enabled endpoint. The `DataSource` class provides functionality for clustering point data. 

**Vector tile source**

A vector tile source describes how to access a vector tile layer and can be created using the [VectorTileSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.vectortilesource) class. Azure Maps aligns with the [Mapbox Vector Tile Specification](https://github.com/mapbox/vector-tile-spec), which is an open standard. Vector tile layers are similar to tile layers, however, instead of each tile being a raster image, they're a compressed file (PBF format) that contains vector map data and one or more layers that can be rendered and styled on the client based on the style of each layer. The data in a vector tile contain geographic features in the form of points, lines, and polygons. There are several advantages of vector tile layers over raster tile layers;

 - A file size of a vector tile is typically much smaller than an equivalent raster tile. As such, less bandwidth is used, which means lower latency and a faster map. This creates a better user experience.
 - Since vector tiles are rendered on the client, they can adapt to the resolution of the device they're being displayed on. This makes allows the rendered maps that appear much more well defined and with crystal clear labels. 
 - Changing the style of the data in the vector maps doesn’t require downloading the data again since the new style can be applied on the client. In contrast, changing the style of a raster tile layer typically requires loading tiles from the server that have the new style applied to them.
 - Since the data is delivered in vector form, there's less server-side processing required to prepare the data, which means that newer data can be made available faster.

All layers that use a vector source must specify a `sourceLayer` value. 

Once created, data sources can be added to the map through the `map.sources` property, which is a [SourceManager](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.sourcemanager). The following code shows how to create a `DataSource` and add it to the map.

```javascript
//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);
```

## Connecting a data source to a layer

Data is rendered on the map using rendering layers. A single data source can be referenced by one or more rendering layers. The following rendering layers require a data source to be power it:

- [Bubble layer](map-add-bubble-layer.md) - renders point data as scaled circles on the map.
- [Symbol layer](map-add-pin.md) - renders point data as icons and/or text.
- [Heat map layer](map-add-heat-map-layer.md) - renders point data as a density heat map.
- [Line layer](map-add-shape.md) - can be used to render line and or the outline of polygons. 
- [Polygon layer](map-add-shape.md) - fills the area of a polygon with a solid color or image pattern.

The following code shows how to create a data source, add it to the map and connect it to a bubble layer, then import GeoJSON point data from a remote location into it. 

```javascript
//Create a data source and add it to the map.
var datasource = new atlas.source.DataSource();
map.sources.add(datasource);

//Create a layer that defines how to render points in the data source and add it to the map.
map.layers.add(new atlas.layer.BubbleLayer(datasource));

//Load the earthquake data.
datasource.importDataFromUrl('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson');
```

There are additional rendering layers that don't connect to these data sources, but instead load the data they render directly. 

- [Image layer](map-add-image-layer.md) - overlays a single image on top of the map and binds its corners to a set of specified coordinates.
- [Tile layer](map-add-tile-layer.md) - superimposes a raster tile layer on top of the map.

## One data source with multiple layers

Multiple layers can be connected to a single data source. This may sound odd, but there are many different scenarios where this becomes useful. Take, for example, the scenario of creating a polygon drawing experience. When letting a user draw a polygon, we should render the fill polygon area as the user is adding points to the map. Adding a styled line that outlines the polygon will make it easier see the edges of the polygon as it is being drawn. Finally adding some sort of handle, such as a pin or marker, above each position in the polygon would make it easier to edit each individual position. Here is an image that demonstrates this scenario.

![Map showing multiple layers rendering data from a single data source](media/create-data-source-web-sdk/multiple-layers-one-datasource.png)

To accomplish this scenario in most mapping platforms you would need to create a polygon object, a line object, and pin for each position in the polygon. As the polygon is modified, you would need to manually update the line and pins, which can become complex quickly.

With Azure Maps all you need is a single polygon in a data source as shown in the code below.

```javascript
//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);

//Create a polygon and add it to the data source.
dataSource.add(new atlas.data.Polygon([[[/* Coordinates for polygon */]]]));

//Create a polygon layer to render the filled in area of the polygon.
var polygonLayer = new atlas.layer.PolygonLayer(dataSource, 'myPolygonLayer', {
     fillColor: 'rgba(255,165,0,0.2)'
});

//Create a line layer for greater control of rendering the outline of the polygon.
var lineLayer = new atlas.layer.LineLayer(dataSource, 'myLineLayer', {
     color: 'orange',
     width: 2
});

//Create a bubble layer to render the vertices of the polygon as scaled circles.
var bubbleLayer = new atlas.layer.BubbleLayer(dataSource, 'myBubbleLayer', {
     color: 'orange',
     radius: 5,
     outlineColor: 'white',
     outlineWidth: 2
});

//Add all layers to the map.
map.layers.add([polygonLayer, lineLayer, bubbleLayer]);
```

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [DataSourceOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.datasourceoptions?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [VectorTileSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.vectortilesource?view=azure-maps-typescript-latest)

> [!div class="nextstepaction"]
> [VectorTileSourceOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.vectortilesourceoptions?view=azure-maps-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add a popup](map-add-popup.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a symbol layer](map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add a line layer](map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)

> [!div class="nextstepaction"]
> [Add a heat map](map-add-heat-map-layer.md)

> [!div class="nextstepaction"]
> [Code samples](https://docs.microsoft.com/samples/browse/?products=azure-maps)