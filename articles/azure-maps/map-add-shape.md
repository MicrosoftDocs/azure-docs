---
title: Add a polygon layer to Azure Maps | Microsoft Docs
description: How to add a polygon layer to the Azure Maps Web SDK.
author: jingjing-z
ms.author: jinzh
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a polygon layer to the map

This article shows you how to render the areas of `Polygon` and `MultiPolygon` feature geometries on the map using a polygon layer. The Azure Maps Web SDK also supports the creation of Circle geometries as defined in the [extended GeoJSON schema](extend-geojson.md#circle). These circles are transformed into polygons when rendered on the map. All feature geometries can also be easily updated if wrapped with the [atlas.Shape](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) class.

## Use a polygon layer 

When a polygon layer is connected to a data source and loaded on the map, it renders the area of a `Polygon` and `MultiPolygon` features. The following code shows how to create a polygon, add it to a data source and render it with a polygon layer using the [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest) class.

```javascript
//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);

//Create a rectangular polygon.
dataSource.add(new atlas.data.Feature(
	new atlas.data.Polygon([[
		[-73.98235, 40.76799],
		[-73.95785, 40.80044],
		[-73.94928, 40.7968],
		[-73.97317, 40.76437],
		[-73.98235, 40.76799]
	]])
));

//Create and add a polygon layer to render the polygon to the map.
map.layers.add(new atlas.layer.PolygonLayer(dataSource, null,{
	fillColor: 'red',
	opacaty: 0.5
}));
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Add a polygon to a map ' src='//codepen.io/azuremaps/embed/yKbOvZ/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yKbOvZ/'>Add a polygon to a map </a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Use a polygon and line layer together

A line layer can be used to render the outline of polygons. The following code sample renders a polygon like the previous example, but now adds a line layer as a second layer connected to the data source.  

<iframe height='500' scrolling='no' title='Polygon and line layer to add polygon' src='//codepen.io/azuremaps/embed/aRyEPy/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/aRyEPy/'>Polygon and line layer to add polygon</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Fill a polygon with a pattern

In addition to filling a polygon with a color, an image pattern can also be used. Load an image pattern into the maps image sprite resources and then reference this image with the `fillPattern` property of the polygon layer.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Polygon fill pattern" src="//codepen.io/azuremaps/embed/JzQpYX/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/JzQpYX/'>Polygon fill pattern</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


> [!TIP]
> The Azure Maps web SDK provides several customizable image templates you can use as fill patterns. For more information, see the [How to use image templates](how-to-use-image-templates-web-sdk.md) document.

## Customize a polygon layer

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

The Azure Maps Web SDK converts these `Point` features into `Polygon` features under the covers and can be rendered on the map using polygon and line layers as shown in the following code sample.

<br/>

<iframe height='500' scrolling='no' title='Add a circle to a map' src='//codepen.io/azuremaps/embed/PRmzJX/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PRmzJX/'>Add a circle to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Make a geometry easy to update

A `Shape` class wraps a [Geometry](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.geometry?view=azure-iot-typescript-latest) or [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) and makes it easy to update and maintain them. A shape can be created by passing in a geometry and a set of properties, or by passing in a feature as shown in the following code.

```javascript
//Creating a shape by passing in a geometry and a object containing properties.
var shape1 = new atlas.Shape(new atlas.data.Point[0,0], { myProperty: 1 });

//Creating a shape using a feature.
var shape2 = new atlas.Shape(new atlas.data.Feature(new atlas.data.Point[0,0], { myProperty: 1 });
```

The following code sample shows how to wrap a circle GeoJSON object with a shape class and easily update it's radius property using a slider. As the radius value changes in the shape, the rendering of the circle automatically updates on the map.

<br/>

<iframe height='500' scrolling='no' title='Update shape properties' src='//codepen.io/azuremaps/embed/ZqMeQY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZqMeQY/'>Update shape properties</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Polygon](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.polygon?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [PolygonLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonlayer?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [PolygonLayerOptions](/javascript/api/azure-maps-control/atlas.polygonlayeroptions?view=azure-iot-typescript-latest)

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [Create a data source](create-data-source-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a popup](map-add-popup.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)

> [!div class="nextstepaction"]
> [How to use image templates](how-to-use-image-templates-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a line layer](map-add-line-layer.md)

Additional resources:

> [!div class="nextstepaction"]
> [Azure Maps GeoJSON specification extension](extend-geojson.md#circle)