---
title: Add a simple data layer
titleSuffix: Microsoft Azure Maps
description: Learn how to add a simple data layer using the Spatial IO module, provided by Azure Maps Web SDK.
author: dubiety
ms.author: yuchungchen
ms.date: 06/19/2023
ms.topic: how-to
ms.service: azure-maps
#Customer intent: As an Azure Maps web sdk user, I want to add simple data layer so that I can render styled features on the map.
---

# Add a simple data layer

The spatial IO module provides a `SimpleDataLayer` class. This class makes it easy to render styled features on the map. It can even render data sets that have style properties and data sets that contain mixed geometry types. The simple data layer achieves this functionality by wrapping multiple rendering layers and using style expressions. The style expressions search for common style properties of the features inside these wrapped layers. The `atlas.io.read` function and the `atlas.io.write` function use these properties to read and write styles into a supported file format. After adding the properties to a supported file format, the file can be used for various purposes. For example, the file can be used to display the styled features on the map.

In addition to styling features, the `SimpleDataLayer` provides a built-in popup feature with a popup template. The popup displays when a feature is clicked. The default popup feature can be disabled, if desired. This layer also supports clustered data. When a cluster is clicked, the map zooms into the cluster and expands it into individual points and subclusters.

The `SimpleDataLayer` class is intended to be used on large data sets with many geometry types and many styles applied on the features. When used, this class adds an overhead of six layers containing style expressions. So, there are cases when it's more efficient to use the core rendering layers. For example, use a core layer to render a couple of geometry types and a few styles on a feature

## Use a simple data layer

The `SimpleDataLayer` class is used like the other rendering layers are used. The following code shows how to use a simple data layer in a map:

```javascript
//Create a data source and add it to the map.
var datasource = new atlas.source.DataSource();
map.sources.add(datasource);

//Add a simple data layer for rendering data.
var layer = new atlas.layer.SimpleDataLayer(datasource);
map.layers.add(layer);
```

The following code snippet demonstrates using a simple data layer, referencing the data from an online source.

```javascript
function InitMap()
{
  var map = new atlas.Map('myMap', {
    center: [-73.967605, 40.780452],
    zoom: 12,
    view: "Auto",

    //Add authentication details for connecting to Azure Maps.
    authOptions: {
      // Get an Azure Maps key at https://azuremaps.com/.
      authType: 'subscriptionKey',
      subscriptionKey: '{Your-Azure-Maps-Subscription-key}'
    },
  });    

  //Wait until the map resources are ready.
  map.events.add('ready', function () {

    //Create a data source and add it to the map.
    var datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    //Add a simple data layer for rendering data.
    var layer = new atlas.layer.SimpleDataLayer(datasource);
    map.layers.add(layer);

    //Load an initial data set.
    loadDataSet('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1717245/use-simple-data-layer.json');

    function loadDataSet(url) {
      //Read the spatial data and add it to the map.
      atlas.io.read(url).then(r => {
      if (r) {
        //Update the features in the data source.
        datasource.setShapes(r);

        //If bounding box information is known for data, set the map view to it.
        if (r.bbox) {
          map.setCamera({
            bounds: r.bbox,
            padding: 50
          });
        }
      }
      });
    }
  });
}
```

The url passed to the `loadDataSet` function points to the following json:

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

Once you add features to the data source, the simple data layer figures out how best to render them. Styles for individual features can be set as properties on the feature.

The above sample code shows a GeoJSON point feature with a `color` property set to `red`.

This sample code renders the point feature using the simple data layer, and appears as follows:

:::image type="content" source="./media/spatial-io-add-simple-data-layer/simple-data-layer.png"alt-text="A screenshot of map with coordinates of 0, 0 that shows a red dot over blue water, the red dot was added using the symbol layer.":::

> [!NOTE]
> Notice that the coordinates set when the map was initialized:
>
> &emsp; center: [-73.967605, 40.780452]
>
> Are overwritten by the value from the datasource:
>
> &emsp; "coordinates": [0, 0]

<!------------------------------------
<iframe height="500" scrolling="no" title="Use the Simple data layer" src="//codepen.io/azuremaps/embed/zYGzpQV/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder='no' loading="lazy" allowtransparency="true" allowfullscreen="true"> See the Pen <a href='https://codepen.io/azuremaps/pen/zYGzpQV/'>Use the simple data layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>
------------------------------------>

The real power of the simple data layer comes when:

- There are several different types of features in a data source; or
- Features in the data set have several style properties individually set on them; or
- You're not sure what the data set exactly contains.

For example when parsing XML data feeds, you may not know the exact styles and geometry types of the features. The [Simple data layer options] sample shows the power of the simple data layer by rendering the features of a KML file. It also demonstrates various options that the simple data layer class provides. For the source code for this sample, see [Simple data layer options.html] in the Azure Maps code samples in GitHub.

:::image type="content" source="./media/spatial-io-add-simple-data-layer/simple-data-layer-options.png"alt-text="A screenshot of map with a panel on the left showing the different simple data layer options.":::

<!------------------------------------
<iframe height="700" scrolling="no" title="Simple data layer options" src="//codepen.io/azuremaps/embed/gOpRXgy/?height=700&theme-id=0&default-tab=result" frameborder='no' loading="lazy" allowtransparency="true" allowfullscreen="true"> See the Pen <a href='https://codepen.io/azuremaps/pen/gOpRXgy/'>Simple data layer options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>
------------------------------------>

> [!NOTE]
> This simple data layer uses the [popup template] class to display KML balloons or feature properties as a table. By default, all content rendered in the popup will be sandboxed inside of an iframe as a security feature. However, there are limitations:
>
> - All scripts, forms, pointer lock and top navigation functionality is disabled. Links are allowed to open up in a new tab when clicked.
> - Older browsers that don't support the `srcdoc` parameter on iframes will be limited to rendering a small amount of content.
>
> If you trust the data being loaded into the popups and potentially want these scripts loaded into popups be able to access your application, you can disable this by setting the popup templates `sandboxContent` option to false.

## Default supported style properties

As mentioned earlier, the simple data layer wraps several of the core rendering layers: bubble, symbol, line, polygon, and extruded polygon. It then uses expressions to search for valid style properties on individual features.

Azure Maps and GitHub style properties are the two main sets of supported property names. Most property names of the different Azure maps layer options are supported as style properties of features in the simple data layer. Expressions have been added to some layer options to support style property names that are commonly used by GitHub. [GitHub's GeoJSON map support] defines these property names, and they're used to style GeoJSON files that are stored and rendered within the platform. All GitHub's styling properties are supported in the simple data layer, except the `marker-symbol` styling properties.

If the reader comes across a less common style property, it converts it to the closest Azure Maps style property. Additionally, the default style expressions can be overridden by using the `getLayers` function of the simple data layer and updating the options on any of the layers.

The following sections provide details on the default style properties supported by the simple data layer. The order of the supported property name is also the priority of the property. If two style properties are defined for the same layer option, then the first one in the list has higher precedence. Colors can be any CSS3 color value; HEX, RGB, RGBA, HSL, HSLA, or named color value.

### Bubble layer style properties

If a feature is a `Point` or a `MultiPoint`, and the feature doesn't have an `image` property that would be used as a custom icon to render the point as a symbol, then the feature is rendered with a `BubbleLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `color` | `color`, `marker-color` | `'#1A73AA'` |
| `radius` | `size`<sup>1</sup>, `marker-size`<sup>2</sup>, `scale`<sup>1</sup> | `8` |
| `strokeColor` | `strokeColor`, `stroke` | `'#FFFFFF'` |

\[1\] The `size` and `scale` values are considered scalar values, and are multiplied by `8`

\[2\] If the GitHub `marker-size` option is specified, then the following values are used for the radius.

| Marker size | Radius |
|-------------|--------|
| `small`     | `6`    |
| `medium`    | `8`    |
| `large`     | `12`   |

Clusters are also rendered using the bubble layer. By default the radius of a cluster is set to `16`. The color of the cluster varies depending on the number of points in the cluster, as defined in the following table:

| # of points | Color    |
|-------------|----------|
| &gt;= 100   | `red`    |
| &gt;= 10    | `yellow` |
| &lt; 10     | `green`  |

### Symbol style properties

If a feature is a `Point` or a `MultiPoint`, and the feature and has an `image` property that would be used as a custom icon to render the point as a symbol, then the feature is rendered with a `SymbolLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `image`      | `image`                    | ``none``      |
| `size`       | `size`, `marker-size`<sup>1</sup> | `1`    |
| `rotation`   | `rotation`                 | `0`           |
| `offset`     | `offset`                   | `[0, 0]`      |
| `anchor`     | `anchor`                   | `'bottom'`    |

\[1\] If the GitHub `marker-size` option is specified, then the following values are used for the icon size option.

| Marker size | Symbol size |
|-------------|-------------|
| `small`     | `0.5`       |
| `medium`    | `1`         |
| `large`     | `2`         |

If the point feature is a cluster, the `point_count_abbreviated` property is rendered as a text label. No image is rendered.

### Line style properties

If the feature is a `LineString`, `MultiLineString`, `Polygon`, or `MultiPolygon`, then the feature is rendered with a `LineLayer`.

| Layer option    | Supported property name(s) | Default value |
|-----------------|----------------------------|---------------|
| `strokeColor`   | `strokeColor`, `stroke`    | `'#1E90FF'`   |
| `strokeWidth`   | `strokeWidth`, `stroke-width`, `stroke-thickness` | `3` |
| `strokeOpacity` | `strokeOpacity`, `stroke-opacity` | `1`    |

### Polygon style properties

If the feature is a `Polygon` or a `MultiPolygon`, and the feature either doesn't have a `height` property or the `height` property is zero, then the feature is rendered with a `PolygonLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `fillColor`  | `fillColor`, `fill`        | `'#1E90FF'`   |
| `fillOpacity`|`fillOpacity`, '`fill-opacity`| `0.5`       |

### Extruded polygon style properties

If the feature is a `Polygon` or a `MultiPolygon`, and has a `height` property with a value greater than zero, the feature is rendered with an `PolygonExtrusionLayer`.

| Layer option | Supported property name(s) | Default value |
|--------------|----------------------------|---------------|
| `base`       | `base`                     | `0`           |
| `fillColor`  | `fillColor`, `fill`        | `'#1E90FF'`   |
| `height`     | `height`                   | `0`           |

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [SimpleDataLayer]

> [!div class="nextstepaction"]
> [SimpleDataLayerOptions]

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Read and write spatial data]

> [!div class="nextstepaction"]
> [Add an OGC map layer]

> [!div class="nextstepaction"]
> [Connect to a WFS service]

> [!div class="nextstepaction"]
> [Leverage core operations]

> [!div class="nextstepaction"]
> [Supported data format details]

[Add an OGC map layer]: spatial-io-add-ogc-map-layer.md
[Connect to a WFS service]: spatial-io-connect-wfs-service.md
[GitHub's GeoJSON map support]: https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files#mapping-geojsontopojson-files-on-github
[Leverage core operations]: spatial-io-core-operations.md
[popup template]: map-add-popup.md#add-popup-templates-to-the-map
[Read and write spatial data]: spatial-io-read-write-spatial-data.md
[Simple data layer options.html]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Spatial%20IO%20Module/Simple%20data%20layer%20options/Simple%20data%20layer%20options.html
[Simple data layer options]: https://samples.azuremaps.com/spatial-io-module/simple-data-layer-options
[SimpleDataLayer]: /javascript/api/azure-maps-spatial-io/atlas.layer.simpledatalayer
[SimpleDataLayerOptions]: /javascript/api/azure-maps-spatial-io/atlas.simpledatalayeroptions
[Supported data format details]: spatial-io-supported-data-format-details.md
