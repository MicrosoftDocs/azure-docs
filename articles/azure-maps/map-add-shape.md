---
title: Add a shape with Azure Maps | Microsoft Docs
description: How to add a shape to a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 10/30/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a shape to a map

This article shows you how to render geometries on the map using line and polygon layers. The Azure Maps Web SDK also supports the creation of Circle geometries as defined in the [extended GeoJSON schema](extend-geojson.md#circle). All feature geometries can also be easily updated if wrapped with the [Shape](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) class.

<a id="addALine"></a>

## Add lines to the map

`LineString` and `MultiLineString` features are used to represent paths and outlines on the map.

### Add a line

<iframe height='500' scrolling='no' title='Add a line to a map' src='//codepen.io/azuremaps/embed/qomaKv/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qomaKv/'>Add a line to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code in the code above constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A [LineString](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.linestring?view=azure-iot-typescript-latest) object is created and added to the data source.

A [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) renders line objects wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest). The last block of code creates and adds a line layer to the map. See properties of a line layer at [LineLayerOptions](/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest). The data source and the line layer are created and added to the map within the [event handler](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the line is displayed after the map loads fully.

### Add symbols along a line

This sample shows how to add arrow icons along a line on the map. When using a symbol layer, set the "placement" option to "line", this will render the symbols along the line and rotate the icons (0 degrees = right).

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Show arrow along line" src="//codepen.io/azuremaps/embed/drBJwX/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/drBJwX/'>Show arrow along line</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### <a name="line-stroke-gradient"></a> Add a stroke gradient to a line

In addition to being able to apply a single stroke color to a line you can also fill a line with a gradient of colors to show transition from one line segment to the next. For example, line gradients can be used to represent changes over time and distance, or different temperatures across a connected line of objects. In order to apply this feature to a line, the data source must have the `lineMetrics` option set to true, and then a color gradient expression can be passed to the `strokeColor` option of the line. The stroke gradient expression has to reference the `['line-progress']` data expression that exposes the calculated line metrics to the expression.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Line with Stroke Gradient" src="//codepen.io/azuremaps/embed/wZwWJZ/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/wZwWJZ/'>Line with Stroke Gradient</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Customize a line layer

The Line layer several styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='Line Layer Options' src='//codepen.io/azuremaps/embed/GwLrgb/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/GwLrgb/'>Line Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<a id="addAPolygon"></a>

## Add a polygon to the map

`Polygon` and `MultiPolygon` features are often used to represent an area on a map. 

### Use a polygon layer 

A polygon layer renders the area of a polygon. 

<iframe height='500' scrolling='no' title='Add a polygon to a map ' src='//codepen.io/azuremaps/embed/yKbOvZ/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yKbOvZ/'>Add a polygon to a map </a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A [Polygon](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.polygon?view=azure-iot-typescript-latest) is created from an array of coordinates and added to the data source. 

A [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest) renders data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) on the map. The last block of code creates and adds a polygon layer to the map. See properties of a polygon layer at [PolygonLayerOptions](/javascript/api/azure-maps-control/atlas.polygonlayeroptions?view=azure-iot-typescript-latest). The data source and the polygon layer are created and added to the map within the [event handler](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the polygon is displayed after the map loads fully.

### Use a polygon and line layer together

A line layer can be used to render the outline of a polygon. 

<iframe height='500' scrolling='no' title='Polygon and line layer to add polygon' src='//codepen.io/azuremaps/embed/aRyEPy/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/aRyEPy/'>Polygon and line layer to add polygon</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A [Polygon](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.polygon?view=azure-iot-typescript-latest) is created from an array of coordinates and added to the data source. 

A [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest) renders data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) on the map. See properties of a polygon layer at [PolygonLayerOptions](/javascript/api/azure-maps-control/atlas.polygonlayeroptions?view=azure-iot-typescript-latest). A [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) is an array of lines. See properties of a line layer at [LineLayerOptions](/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest). The third block of code creates polygon and line layers.

The last block of code adds the polygon and line layers to the map. The data source and the layers are created and added to the map within the [event handler](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the polygon is displayed after the map loads fully.

> [!TIP]
> Line layers by default will render the coordinates of polygons as well as lines in a data source. To limit the layer such that it only renders LineString features set the `filter` property of the layer to `['==', ['geometry-type'], 'LineString']` or `['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']]` if you want to include MultiLineString features as well.

### Fill a polygon with a pattern

In addition to filling a polygon with a color an image pattern can also be used. Load an image pattern into the maps image sprite resources and then reference this image with the `fillPattern` property of the polygon layer.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Polygon fill pattern" src="//codepen.io/azuremaps/embed/JzQpYX/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/JzQpYX/'>Polygon fill pattern</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Customize a polygon layer

The Polygon layer only has a few styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='LXvxpg' src='//codepen.io/azuremaps/embed/LXvxpg/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/LXvxpg/'>LXvxpg</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<a id="addACircle"></a>

## Add a circle to the map

Azure Maps uses an extended version of the GeoJSON schema that provides a definition for circles as noted [here](extend-geojson.md#circle). A circle can be rendered on the map by creating a `Point` feature that has a `subType` property with a value of `"Circle"` and a `radius` property that has a number that represents the radius in meters. For example:

```javascript
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.126986, 47.639754]
    },
    "properties": {
        "subType": "Circle",
        "radius": 100
    }
}  
```

The Azure Maps Web SDK converts these `Pooint` features into `Polygon` features under the covers and can be rendered on the map using polygon and line layers as shown here.

<iframe height='500' scrolling='no' title='Add a circle to a map' src='//codepen.io/azuremaps/embed/PRmzJX/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PRmzJX/'>Add a circle to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code in the code above constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A circle is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) and has a `subType` property set to `"Circle"` and a `radius` property value in meters. When a Point feature with a `subType` of `"Circle"` is added to a data source, it converted into a circular polygon within the map.

A [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest) renders data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) on the map. The last block of code creates and adds a polygon layer to the map. See properties of a polygon layer at [PolygonLayerOptions](/javascript/api/azure-maps-control/atlas.polygonlayeroptions?view=azure-iot-typescript-latest). The data source and the polygon layer are created and added to the map within the [event handler](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the circle is displayed after the map loads fully.

## Make a geometry easy to update

A `Shape` class wraps a [Geometry](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.geometry?view=azure-iot-typescript-latest) or [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) and makes it easy to update and maintain them.
`new Shape(data: Feature<data.Geometry, any>)` constructs a shape object and initializes it with the specified feature.

<br/>

<iframe height='500' scrolling='no' title='Update shape properties' src='//codepen.io/azuremaps/embed/ZqMeQY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZqMeQY/'>Update shape properties</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code above constructs a Map object. You can see [create a map](./map-create.md) for instructions.

A point is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) the class. The second block of code initializes the radius value for the HTML slider element and then constructs and wraps a point object in a [Shape](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) class object.

The third code block creates a function that takes the value from the HTML range slider element and changes the radius value using the shape class [addProperty](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) method.

In the fourth block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. The point is then added to data source.

A [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest) renders data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) on the map. The third block of code creates a polygon layer. See properties of a polygon layer at [PolygonLayerOptions](/javascript/api/azure-maps-control/atlas.polygonlayeroptions?view=azure-iot-typescript-latest). The data source, the click event handler, and the polygon layer are created and added to the map within the [event handler](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) to ensure that the point is displayed after the map loads fully.

## Next steps

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)
