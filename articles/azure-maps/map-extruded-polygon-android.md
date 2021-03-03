---
title: Add a polygon extrusion layer to an Android map | Microsoft Azure Maps
description: How to add a polygon extrusion layer to the Microsoft Azure Maps Android SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 02/19/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Add a polygon extrusion layer to the map (Android SDK)

This article shows you how to use the polygon extrusion layer to render areas of `Polygon` and `MultiPolygon` feature geometries as extruded shapes.

## Use a polygon extrusion layer

Connect the polygon extrusion layer to a data source. Then, loaded it on the map. The polygon extrusion layer renders the areas of a `Polygon` and `MultiPolygon` features as extruded shapes. The `height` and `base` properties of the polygon extrusion layer define the base distance from the ground and height of the extruded shape in **meters**. The following code shows how to create a polygon, add it to a data source, and render it using the Polygon extrusion layer class.

> [!Note]
> The `base` value defined in the polygon extrusion layer should be less than or equal to that of the `height`.

```java
//Create a data source and add it to the map.
DataSource source = new DataSource();
map.sources.add(source);

//Create a polygon.
source.add(Polygon.fromLngLats(
    Arrays.asList(
        Arrays.asList(
            Point.fromLngLat(-73.95838379859924, 40.80027995478159),
            Point.fromLngLat(-73.98154735565186, 40.76845986171129),
            Point.fromLngLat(-73.98124694824219, 40.767761062136955),
            Point.fromLngLat(-73.97361874580382, 40.76461637311633),
            Point.fromLngLat(-73.97306084632874, 40.76512830937617),
            Point.fromLngLat(-73.97259950637817, 40.76490890860481),
            Point.fromLngLat(-73.9494466781616, 40.79658450499243),
            Point.fromLngLat(-73.94966125488281, 40.79708807289436),
            Point.fromLngLat(-73.95781517028809, 40.80052360358227),
            Point.fromLngLat(-73.95838379859924, 40.80027995478159)
        )
    )
));

//Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
PolygonExtrusionLayer layer = new PolygonExtrusionLayer(source,
    fillColor("#fc0303"),
    fillOpacity(0.7f),
    height(500f)
);

//Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
map.layers.add(layer, "labels");
```

The following screenshot shows the above code rending a polygon stretched vertically using a polygon extrusion layer.

![Map with polygon stretched vertically using a polygon extrusion layer](media/map-extruded-polygon-android/polygon-extrusion-layer.jpg)

## Add data driven polygons

A choropleth map can be rendered using the polygon extrusion layer. Set the `height` and `fillColor` properties of the extrusion layer to the measurement of the statistical variable in the `Polygon` and `MultiPolygon` feature geometries. The following code sample shows an extruded choropleth map of the United States based on the measurement of the population density by state.

```java
//Create a data source and add it to the map.
DataSource source = new DataSource();
map.sources.add(source);

//Import the geojson data and add it to the data source.
Utils.importData("https://azuremapscodesamples.azurewebsites.net/Common/data/geojson/US_States_Population_Density.json", this,  (String result) -> {
    //Parse the data as a GeoJSON Feature Collection.
    FeatureCollection fc = FeatureCollection.fromJson(result);

    //Add the feature collection to the data source.
    source.add(fc);
});

//Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
PolygonExtrusionLayer layer = new PolygonExtrusionLayer(source,
    fillOpacity(0.7f),
    fillColor(
        step(
            get("density"),
            literal("rgba(0, 255, 128, 1)"),
            stop(10, "rgba(9, 224, 118, 1)"),
            stop(20, "rgba(11, 191, 103, 1)"),
            stop(50, "rgba(247, 227, 5, 1)"),
            stop(100, "rgba(247, 199, 7, 1)"),
            stop(200, "rgba(247, 130, 5, 1)"),
            stop(500, "rgba(247, 94, 5, 1)"),
            stop(1000, "rgba(247, 37, 5, 1)")
        )
    ),
    height(
        interpolate(
            linear(),
            get("density"),
            stop(0, 100),
            stop(1200, 960000)
        )
    )
);

//Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
map.layers.add(layer, "labels");
```

The following screenshot shows a choropleth map of US states colored and stretched vertically as extruded polygons based on population density.

![A choropleth map of US states colored and stretched vertically as extruded polygons based on population density](media/map-extruded-polygon-android/android-extruded-choropleth.jpg)

## Next steps

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Create a data source](create-data-source-android-sdk.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-android-sdk.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](how-to-add-shapes-to-android-map.md)
