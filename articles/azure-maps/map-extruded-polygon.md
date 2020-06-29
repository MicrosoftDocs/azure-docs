---
title: Add a polygon extrusion layer to a map | Microsoft Azure Maps
description: How to add a polygon extrusion layer to the Microsoft Azure Maps Web SDK.
author: philmea
ms.author: philmea
ms.date: 10/08/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a polygon extrusion layer to the map

This article shows you how to use the polygon extrusion layer to render areas of `Polygon` and `MultiPolygon` feature geometries as extruded shapes. The Azure Maps Web SDK supports rendering of Circle geometries as defined in the [extended GeoJSON schema](extend-geojson.md#circle). These circles can be transformed into polygons when rendered on the map. All feature geometries may be updated easily when wrapped with the [atlas.Shape](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) class.

## Use a polygon extrusion layer

Connect the [polygon extrusion layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonextrusionlayer?view=azure-maps-typescript-latest) to a data source. Then, loaded it on the map. The polygon extrusion layer renders the areas of a `Polygon` and `MultiPolygon` features as extruded shapes. The  `height` and `base` properties of the polygon extrusion layer define the base distance from the ground and height of the extruded shape in **meters**. The following code shows how to create a polygon, add it to a data source, and render it using the Polygon extrusion layer class.

> [!Note]
> The `base` value defined in the polygon extrusion layer should be less than or equal to that of the `height`.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Extruded polygon" src="https://codepen.io/azuremaps/embed/wvvBpvE?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/wvvBpvE'>Extruded polygon</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>


## Add data driven polygons

A choropleth map can be rendered using the polygon extrusion layer. Set the `height` and `fillColor` properties of the extrusion layer to the measurement of the statistical variable in the `Polygon` and `MultiPolygon` feature geometries. The following code sample shows an extruded choropleth Map of the U.S based on the measurement of the population density by state.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Extruded choropleth map" src="https://codepen.io/azuremaps/embed/eYYYNox?height=265&theme-id=0&default-tab=result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/eYYYNox'>Extruded choropleth map</a> by Azure Maps(<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add a circle to the map

Azure Maps uses an extended version of the GeoJSON schema that provides a definition for circles as noted [here](https://docs.microsoft.com/azure/azure-maps/extend-geojson#circle). An extruded circle can be rendered on the map by creating a `point` feature with a `subType` property of `Circle` and a numbered `Radius` property representing the radius in **meters**. For example:

```Javascript
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-105.203135, 39.664087]
    },
    "properties": {
        "subType": "Circle",
        "radius": 1000
    }
} 
```

The Azure Maps Web SDK converts these `Point` features into `Polygon` features under the hood. These `Point` features can be rendered on the map using polygon extrusion layer as shown in the following code sample.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Drone airspace polygon" src="https://codepen.io/azuremaps/embed/zYYYrxo?height=265&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/zYYYrxo'>Drone airspace polygon</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize a polygon extrusion layer

The Polygon Extrusion layer has several styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='PoogBRJ' src='//codepen.io/azuremaps/embed/PoogBRJ/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PoogBRJ/'>PoogBRJ</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Polygon](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.polygon?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [polygon extrusion layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.polygonextrusionlayer?view=azure-maps-typescript-latest)

Additional resources:

> [!div class="nextstepaction"]
> [Azure Maps GeoJSON specification extension](extend-geojson.md#circle)
