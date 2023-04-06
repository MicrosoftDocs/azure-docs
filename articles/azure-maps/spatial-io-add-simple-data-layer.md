---
title: Add a simple data layer | Microsoft Azure Maps
description: Learn how to add a simple data layer using the Spatial IO module, provided by Azure Maps Web SDK.
author: eriklindeman
ms.author: eriklind
ms.date: 02/29/2020
ms.topic: conceptual
ms.service: azure-maps
ms.custom: devx-track-js
#Customer intent: As an Azure Maps web sdk user, I want to add simple data layer so that I can render styled features on the map.
---

# Add a simple data layer

The spatial IO module provides a `SimpleDataLayer` class. This class makes it easy to render styled features on the map. It can even render data sets that have style properties and data sets that contain mixed geometry types. The simple data layer achieves this functionality by wrapping multiple rendering layers and using style expressions. The style expressions search for common style properties of the features inside these wrapped layers. The `atlas.io.read` function and the `atlas.io.write` function use these properties to read and write styles into a supported file format. After adding the properties to a supported file format, the file can be used for various purposes. For example, the file can be used to display the styled features on the map.

In addition to styling features, the `SimpleDataLayer` provides a built-in popup feature with a popup template. The popup displays when a feature is clicked. The default popup feature can be disabled, if desired. This layer also supports clustered data. When a cluster is clicked, the map will zoom into the cluster and expand it into individual points and subclusters.

The `SimpleDataLayer` class is intended to be used on large data sets with many geometry types and many styles applied on the features. When used, this class adds an overhead of six layers containing style expressions. So, there are cases when it's more efficient to use the core rendering layers. For example, use a core layer to render a couple of geometry types and a few styles on a feature

## Use a simple data layer

The `SimpleDataLayer` class is used like the other rendering layers are used. The code below shows how to use a simple data layer in a map:

```javascript
//Create a data source and add it to the map.
var datasource = new atlas.source.DataSource();
map.sources.add(datasource);

//Add a simple data layer for rendering data.
var layer = new atlas.layer.SimpleDataLayer(datasource);
map.layers.add(layer);
```

Add features to the data source. Then, the simple data layer will figure out how best to render the features. Styles for individual features can be set as properties on the feature. The following code shows a GeoJSON point feature with a `color` property set to `red`. 

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

The following code renders the above point feature using the simple data layer. 

<br/>

<iframe height="500" scrolling="no" title="Use the Simple data layer" src="//codepen.io/azuremaps/embed/zYGzpQV/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder='no' loading="lazy" allowtransparency="true" allowfullscreen="true"> See the Pen <a href='https://codepen.io/azuremaps/pen/zYGzpQV/'>Use the simple data layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The real power of the simple data layer comes when:

- There are several different types of features in a data source; or
- Features in the data set have several style properties individually set on them; or
- You're not sure what the data set exactly contains.

For example when parsing XML data feeds, you may not know the exact styles and geometry types of the features. The following sample shows the power of the simple data layer by rendering the features of a KML file. It also demonstrates various options that the simple data layer class provides.

<br/>

<iframe height="700" scrolling="no" title="Simple data layer options" src="//codepen.io/azuremaps/embed/gOpRXgy/?height=700&theme-id=0&default-tab=result" frameborder='no' loading="lazy" allowtransparency="true" allowfullscreen="true"> See the Pen <a href='https://codepen.io/azuremaps/pen/gOpRXgy/'>Simple data layer options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


> [!NOTE]
> This simple data layer uses the [popup template](map-add-popup.md#add-popup-templates-to-the-map) class to display KML balloons or feature properties as a table. By default, all content rendered in the popup will be sandboxed inside of an iframe as a security feature. However, there are limitations:
>
> - All scripts, forms, pointer lock and top navigation functionality is disabled. Links are allowed to open up in a new tab when clicked. 
> - Older browsers that don't support the `srcdoc` parameter on iframes will be limited to rendering a small amount of content.
> 
> If you trust the data being loaded into the popups and potentially want these scripts loaded into popups be able to access your application, you can disable this by setting the popup templates `sandboxContent` option to false. 

## Default supported style properties

As mentioned earlier, the simple data layer wraps several of the core rendering layers: bubble, symbol, line, polygon, and extruded polygon. It then uses expressions to search for valid style properties on individual features.

Azure Maps and GitHub style properties are the two main sets of supported property names. Most property names of the different Azure maps layer options are supported as style properties of features in the simple data layer. Expressions have been added to some layer options to support style property names that are commonly used by GitHub. These property names are defined by [GitHub's GeoJSON map support](https://help.github.com/en/github/managing-files-in-a-repository/mapping-geojson-files-on-github), and they're used to style GeoJSON files that are stored and rendered within the platform. All GitHub's styling properties are supported in the simple data layer, except the `marker-symbol` styling properties.

If the reader comes across a less common style property, it will convert it to the closest Azure Maps style property. Additionally, the default style expressions can be overridden by using the `getLayers` function of the simple data layer and updating the options on any of the layers.

The following sections provide details on the default style properties that are supported by the simple data layer. The order of the supported property name is also the priority of the property. If two style properties are defined for the same layer option, then the first one in the list has higher precedence. Colors can be any CSS3 color value; HEX, RGB, RGBA, HSL, HSLA, or named color value.

### Bubble layer style properties

If a feature is a `Point` or a `MultiPoint`, and the feature doesn't have an `image` property that would be used as a custom icon to render the point as a symbol, then the feature will be rendered with a `BubbleLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `color` | `color`, `marker-color` | `'#1A73AA'` |
| `radius` | `size`<sup>1</sup>, `marker-size`<sup>2</sup>, `scale`<sup>1</sup> | `8` |
| `strokeColor` | `strokeColor`, `stroke` | `'#FFFFFF'` |

\[1\] The `size` and `scale` values are considered scalar values, and they'll be multiplied by `8`

\[2\] If the GitHub `marker-size` option is specified, then the following values will be used for the radius.

| Marker size | Radius |
|-------------|--------|
| `small`     | `6`    |
| `medium`    | `8`    |
| `large`     | `12`   |

Clusters are also rendered using the bubble layer. By default the radius of a cluster is set to `16`. The color of the cluster varies depending on the number of points in the cluster, as defined below:

| # of points | Color    |
|-------------|----------|
| &gt;= 100   | `red`    |
| &gt;= 10    | `yellow` |
| &lt; 10     | `green`  |

### Symbol style properties

If a feature is a `Point` or a `MultiPoint`, and the feature and has an `image` property that would be used as a custom icon to render the point as a symbol, then the feature will be rendered with a `SymbolLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `image` | `image` | ``none`` |
| `size` | `size`, `marker-size`<sup>1</sup> | `1` |
| `rotation` | `rotation` | `0` |
| `offset` | `offset` | `[0, 0]` |
| `anchor` | `anchor` | `'bottom'` |

\[1\] If the GitHub `marker-size` option is specified, then the following values will be used for the icon size option.

| Marker size | Symbol size |
|-------------|-------------|
| `small`     | `0.5`       |
| `medium`    | `1`         |
| `large`     | `2`         |

If the point feature is a cluster, the `point_count_abbreviated` property will be rendered as a text label. No image will be rendered.

### Line style properties

If the feature is a `LineString`, `MultiLineString`, `Polygon`, or `MultiPolygon`, then the feature will be rendered with a `LineLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `strokeColor` | `strokeColor`, `stroke` | `'#1E90FF'` |
| `strokeWidth` | `strokeWidth`, `stroke-width`, `stroke-thickness` | `3` |
| `strokeOpacity` | `strokeOpacity`, `stroke-opacity` | `1` |

### Polygon style properties

If the feature is a `Polygon` or a `MultiPolygon`, and the feature either doesn't have a `height` property or the `height` property is zero, then the feature will be rendered with a `PolygonLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `fillColor` | `fillColor`, `fill` | `'#1E90FF'` |
| `fillOpacity` | `fillOpacity`, '`fill-opacity` | `0.5` |

### Extruded polygon style properties

If the feature is a `Polygon` or a `MultiPolygon`, and has a `height` property with a value greater than 0, the feature will be rendered with an `PolygonExtrusionLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `base` | `base` | `0` |
| `fillColor` | `fillColor`, `fill` | `'#1E90FF'` |
| `height` | `height` | `0` |

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [SimpleDataLayer](/javascript/api/azure-maps-spatial-io/atlas.layer.simpledatalayer)

> [!div class="nextstepaction"]
> [SimpleDataLayerOptions](/javascript/api/azure-maps-spatial-io/atlas.simpledatalayeroptions)

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