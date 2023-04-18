---
title: Add a polygon extrusion layer to an iOS map
titleSuffix: Microsoft Azure Maps
description: How to add a polygon extrusion layer to the Microsoft Azure Maps iOS SDK.
author: sinnypan
ms.author: sipa
ms.date: 11/23/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a polygon extrusion layer to the map in the iOS SDK (Preview)

This article shows you how to use the polygon extrusion layer to render areas of `Polygon` and `MultiPolygon` feature geometries as extruded shapes.

## Use a polygon extrusion layer

Connect the polygon extrusion layer to a data source. Then, loaded it on the map. The polygon extrusion layer renders the areas of a `Polygon` and `MultiPolygon` features as extruded shapes. The `height` and `base` properties of the polygon extrusion layer define the base distance from the ground and height of the extruded shape in **meters**. The following code shows how to create a polygon, add it to a data source, and render it using the Polygon extrusion layer class.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a rectangular polygon.
source.add(geometry: Polygon([
    CLLocationCoordinate2D(latitude: 40.800279, longitude: -73.958383),
    CLLocationCoordinate2D(latitude: 40.768459, longitude: -73.981547),
    CLLocationCoordinate2D(latitude: 40.767761, longitude: -73.981246),
    CLLocationCoordinate2D(latitude: 40.764616, longitude: -73.973618),
    CLLocationCoordinate2D(latitude: 40.765128, longitude: -73.973060),
    CLLocationCoordinate2D(latitude: 40.764908, longitude: -73.972599),
    CLLocationCoordinate2D(latitude: 40.796584, longitude: -73.949446),
    CLLocationCoordinate2D(latitude: 40.797088, longitude: -73.949661),
    CLLocationCoordinate2D(latitude: 40.800523, longitude: -73.957815),
    CLLocationCoordinate2D(latitude: 40.800279, longitude: -73.958383)
]))

// Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
map.layers.insertLayer(
    PolygonExtrusionLayer(source: source, options: [
        .fillColor(.red),
        .fillOpacity(0.7),
        .height(500)
    ]),
    below: "labels"
)
```

The following screenshot shows the above code rendering a polygon stretched vertically using a polygon extrusion layer.

:::image type="content" source="./media/ios-sdk/add-polygon-extrusion-layer-to-map-ios/simple.png" alt-text="An image showing the above code rendering a polygon stretched vertically using a polygon extrusion layer.":::

## Add data driven polygons

A choropleth map can be rendered using the polygon extrusion layer. Set the `height` and `fillColor` properties of the extrusion layer to the measurement of the statistical variable in the `Polygon` and `MultiPolygon` feature geometries. The following code sample shows an extruded choropleth map of the United States based on the measurement of the population density by state.

```swift
// Create a data source and add it to the map.
let source = DataSource()

// Import the geojson data and add it to the data source.
source.importData(fromURL: Bundle.main.url(forResource: "US_States_Population_Density", withExtension: "json")!)

map.sources.add(source)

// Create and add a polygon extrusion layer to the map below the labels so that they are still readable.
let densityColorSteps: [Int: UIColor] = [
    0: UIColor(red: 0, green: 1, blue: 0.5, alpha: 1),
    10: UIColor(red: 9 / 255, green: 224 / 255, blue: 118 / 255, alpha: 1),
    20: UIColor(red: 11 / 255, green: 191 / 255, blue: 103 / 255, alpha: 1),
    50: UIColor(red: 247 / 255, green: 227 / 255, blue: 5 / 255, alpha: 1),
    100: UIColor(red: 247 / 255, green: 199 / 255, blue: 7 / 255, alpha: 1),
    200: UIColor(red: 247 / 255, green: 130 / 255, blue: 5 / 255, alpha: 1),
    500: UIColor(red: 247 / 255, green: 94 / 255, blue: 5 / 255, alpha: 1),
    1000: UIColor(red: 247 / 255, green: 37 / 255, blue: 5 / 255, alpha: 1)
]
let colorExpression = NSExpression(
    forAZMStepping: NSExpression(forKeyPath: "density"),
    from: NSExpression(forConstantValue: UIColor(red: 0, green: 1, blue: 0.5, alpha: 1)),
    stops: NSExpression(forConstantValue: densityColorSteps)
)

let densityHeightSteps: [Int: Int] = [
    0: 100,
    1200: 960_000
]
let heightExpression = NSExpression(
    forAZMInterpolating: NSExpression(forKeyPath: "density"),
    curveType: .linear,
    parameters: nil,
    stops: NSExpression(forConstantValue: densityHeightSteps)
)

map.layers.insertLayer(
    PolygonExtrusionLayer(source: source, options: [
        .fillOpacity(0.7),
        .fillColor(from: colorExpression),
        .height(from: heightExpression)
    ]),
    below: "labels"
)
```

The following screenshot shows a choropleth map of US states colored and stretched vertically as extruded polygons based on population density.

:::image type="content" source="./media/ios-sdk/add-polygon-extrusion-layer-to-map-ios/data-driven.png" alt-text="A choropleth map of US states colored and stretched vertically as extruded polygons based on population density." lightbox="./media/ios-sdk/add-polygon-extrusion-layer-to-map-ios/data-driven.png":::

## Additional information

See the following articles for more code samples to add to your maps:

- [Create a data source](create-data-source-ios-sdk.md)
- [Use data-driven style expressions](data-driven-style-expressions-ios-sdk.md)
- [Add a polygon layer](add-polygon-layer-map-ios.md)
