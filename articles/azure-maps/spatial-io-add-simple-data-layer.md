---
title:  title | Microsoft Azure Maps
description: 
author: farah-alyasari
ms.author: v-faalya
ms.date: 02/29/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
#Customer intent: As an Azure Maps web sdk user, I want to add simple data layer so that I can render styled features on the map.
---

# Add a simple data layer

The spatial IO module provides a `SimpleDataLayer` class. This class makes it easy to render styled features on the map. It achieves this by wrapping multiple rendering layers and using style expressions to look for common style properties in the properties of the feature. All styling properties are supported, except the `marker-symbol` styling properties defined by [GitHub's GeoJSON map support](https://help.github.com/en/github/managing-files-in-a-repository/mapping-geojson-files-on-github). Then, the `atlas.io.read` function and the `atlas.io.write` function use these properties to read and write styles into supported file formats. After adding the properties to a supported file, the file can be loaded to display the styled features on the map.

In addition to styling, the `SimpleDataLayer` provides a popup feature with a popup template. The popup displays when a feature is clicked. There is also the option to disable the built-in popup, if desired. Moreover, this layer supports clustered data. When a cluster is clicked, the map will zoom into the cluster and expand it into individual points and sub-clusters.

Note: The `SimpleDataLayer` class can make it easy to render data sets that contain a mix geometry types and/or has style properties, however, this adds six layers that have a lot of style expressions. If only a couple geometry types need to be rendered or there is few styles defined on the features, it will be more performant to use one of the core rendering layers directly (bubble, symbol, line, polygon, extruded polygon). 

## Use a simple data layer

The `SimpleDataLayer` class is used just like other rendering layer as shown in the code below.

```javascript
//Create a data source and add it to the map.
var datasource = new atlas.source.DataSource();
map.sources.add(datasource);
                
//Add a simple data layer for rendering data.
var layer = new atlas.layer.SimpleDataLayer(datasource);
map.layers.add(layer);
```

Add your features to the data source and the simple data layer will figure out how best to render them. Styles for individual features can be set as properties on the feature. The following code shows a GeoJSON point feature with a `color` property set to `red`. 

```json
{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [0, 0]
	},
	"properties": {
		"color": "red"
	}
}
```

The following is the complete code that renders the above point feature using the simple data layer. 

//TODO: codepen - (create a sample from the above code, I haven't created one in the sample gallery)

The real power of the simple data layer comes when there is several different types of features in a data source and/or they have several style properties set on them individually, or when your not sure what data set contains exactly (for example when parsing XML data feeds). The following example shows the power of the simple data layer by rendering the features of a KML file.

## Simple data layer options

The simple data layer has several options. Here is a tool to try them out.

//TODO: codepen - Simple data layer options

## Default supported style properties

The simple data layer wraps several of the core rendering layers (bubble, symbol, line, polygon, and extruded polygon) and uses expressions to search for valid style properties on individual features. Most layer options property names are supported as style properties of features. Expressions have been added to some layer options to support additional common style property names that may be used in other platforms. For example, [GitHub's GeoJSON map support](https://help.github.com/en/github/managing-files-in-a-repository/mapping-geojson-files-on-github) document outlines a set of style properties that it looks for on GeoJSON files as a way to support styling of GeoJSON files stored and rendered within GitHub. All but the `marker-symbol` style option is supported by the simple data layer.

These default style expressions can be overridden by using the `getLayers` function of the simple data layer and updating the options on any of the layers. 

The following section provides details on the default style properties that the simple data layer supports by default. The order of the supported property names is also the priority. If two style properties for the same layer option are defined, the first one in the list will be used.

### Bubble layer style properties

If a feature is a `Point` or `MultiPoint` and doesn't have an `image` property that would be used as a custom icon to render the point as a symbol, the feature will be rendered with a `BubbleLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `color` | `color`, `marker-color` | `'#1A73AA'` |
| `radius` | `size`<sup>1</sup>, `marker-size`<sup>2</sup>, `scale`<sup>1</sup> | `8` |
| `strokeColor` |  | `white` |

1. The `size` and `scale` values are considered scalar values and will be multiplied by `8`. 
2. If `marker-size` is specified (used by GitHub), the following values will be used for the radius.

| Marker size | Radius |
|-------------|--------|
| `small`     | `6`    |
| `medium`    | `8`    |
| `large`     | `12`   |

Clusters are also rendered using the bubble layer. By default the radius of a cluster is set to `16` and the color varies depending on the number of points in the cluster as defined below.

| # of points | Color    |
|-------------|----------|
| &gt;= 100   | `red`    |
| &gt;= 10    | `yellow` |
| &lt; 10     | `green`  |

### Symbol style properties

If a feature is a `Point` or `MultiPoint` and has an `image` property that would be used as a custom icon to render the point as a symbol, the feature will be rendered with a `SymbolLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `image` | `image` | ``none`` |
| `size` | `size`, `marker-size`<sup>1</sup> | `1` |
| `rotation` | `rotation` | `0` |
| `offset` | 'offset' | `[0, 0]` |
| `anchor` | `anchor` | `'bottom'` |

1. If `marker-size` is specified (used by GitHub), the following values will be used for the icon size option.

| Marker size | Symbol size |
|-------------|-------------|
| `small`     | `0.5`       |
| `medium`    | `1`         |
| `large`     | `2`         |

If the point feature is a cluster, the `point_count_abbreviated` property will be rendered as a text label, no image will be rendered.

### Line style properties

If the feature is a `LineString`, `MultiLineString`, `Polygon` or `MultiPolygon`, the feature will be rendered with a `LineLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `strokeColor` | `strokeColor`, `stroke` | `'#1E90FF'` |
| `strokeWidth` | `strokeWidth`, `stroke-width`, `stroke-thickness` | `3` |
| `strokeOpacity` | `strokeOpacity`, `stroke-opacity` | `1` |

### Polygon style properties

If the feature is a `Polygon` or `MultiPolygon`, and either does not have a `height` property or the `height` property is zero, the feature will be rendered with a `PolygonLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `fillColor` | `fillColor`, `fill` | `'#1E90FF'` |
| `fillOpacity` | `fillOpacity`, '`fill-opacity` | `0.5` |

### Extruded polygon style properties

If the feature is a `Polygon` or `MultiPolygon`, and has a `height` property with a value greater than 0, the feature will be rendered with an `PolygonExtrusionLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `base` | `base` | `0` |
| `fillColor` | `fillColor`, `fill` | `'#1E90FF'` |
| `height` | `height` |  |

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [SimpleDataLayer](https://docs.microsoft.com/en-us/javascript/api/azure-maps-spatial-io/atlas.layer.simpledatalayer)

> [!div class="nextstepaction"]
> [SimpleDataLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-spatial-io/atlas.simpledatalayeroptions)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Read and write spatial data](spatial-io-read-write-spatial-data.md)

> [!div class="nextstepaction"]
> [Add an OGC map layer](spatial-io-add-ogc-map-layer.md)

> [!div class="nextstepaction"]
> [Connect to a WFS service](spatial-io-connect-wfs-service.md)

> [!div class="nextstepaction"]
> [Leverage core operations](spatial-io-core-operations.md)

> [!div class="nextstepaction"]
> [Supported data format details](spatial-io-supported-data-format-details.md)
