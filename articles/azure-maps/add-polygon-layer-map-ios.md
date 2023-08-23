---
title: Add a polygon layer to iOS maps
titleSuffix: Microsoft Azure Maps
description: Learn how to add polygons or circles to maps. See how to use the Azure Maps iOS SDK to customize geometric shapes and make them easy to update and maintain.
author: dubiety
ms.author: yuchungchen 
ms.date: 11/23/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a polygon layer to the map in the iOS SDK (Preview)

This article shows you how to render the areas of `Polygon` and `MultiPolygon` feature geometries on the map using a polygon layer.

## Prerequisites

Be sure to complete the steps in the [Quickstart: Create an iOS app] document. Code blocks in this article can be inserted into the  `viewDidLoad` function of `ViewController`.

## Use a polygon layer

When a polygon layer is connected to a data source and loaded on the map, it renders the area with `Polygon` and `MultiPolygon` features. To create a polygon, add it to a data source, and render it with a polygon layer using the `PolygonLayer` class.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a rectangular polygon.
source.add(geometry: Polygon([
    CLLocationCoordinate2D(latitude: 40.76799, longitude: -73.98235),
    CLLocationCoordinate2D(latitude: 40.80044, longitude: -73.95785),
    CLLocationCoordinate2D(latitude: 40.79680, longitude: -73.94928),
    CLLocationCoordinate2D(latitude: 40.76437, longitude: -73.97317),
    CLLocationCoordinate2D(latitude: 40.76799, longitude: -73.98235)
]))

// Create and add a polygon layer to render the polygon on the map, below the label layer.
map.layers.insertLayer(
    PolygonLayer(source: source, options: [
        .fillColor(.red),
        .fillOpacity(0.7)
    ]),
    below: "labels"
)
```

The following screenshot shows the above code rendering the area of a polygon using a polygon layer.

:::image type="content" source="./media/ios-sdk/add-polygon-layer-map-ios/polygon.png" alt-text="Image showing a polygon using a polygon layer." lightbox="./media/ios-sdk/add-polygon-layer-map-ios/polygon.png":::

## Use a polygon and line layer together

A line layer is used to render the outline of polygons. The following code sample renders a polygon like the previous example, but now adds a line layer. This line layer is a second layer connected to the data source.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a rectangular polygon.
source.add(geometry: Polygon([
    CLLocationCoordinate2D(latitude: 40.76799, longitude: -73.98235),
    CLLocationCoordinate2D(latitude: 40.80044, longitude: -73.95785),
    CLLocationCoordinate2D(latitude: 40.79680, longitude: -73.94928),
    CLLocationCoordinate2D(latitude: 40.76437, longitude: -73.97317),
    CLLocationCoordinate2D(latitude: 40.76799, longitude: -73.98235)
]))

// Create and add a polygon layer to render the polygon on the map, below the label layer.
map.layers.insertLayer(
    PolygonLayer(source: source, options: [
        .fillColor(UIColor(red: 0, green: 0.78, blue: 0.78, alpha: 0.5))
    ]),
    below: "labels"
)

// Create and add a line layer to render the outline of the polygon.
map.layers.addLayer(LineLayer(source: source, options: [
    .strokeColor(.red),
    .strokeWidth(2)
]))
```

The following screenshot shows the above code rendering a polygon with its outline rendered using a line layer.

:::image type="content" source="./media/ios-sdk/add-polygon-layer-map-ios/polygon-and-line.png" alt-text="Image showing a polygon with its outline rendered using a line layer." lightbox="./media/ios-sdk/add-polygon-layer-map-ios/polygon-and-line.png":::

> [!TIP]
> When outlining a polygon with a line layer, be sure to close all rings in polygons such that each array of points has the same start and end point. If this is not done, the line layer may not connect the last point of the polygon to the first point.

## Fill a polygon with a pattern

In addition to filling a polygon with a color, you may use an image pattern to fill the polygon. Load an image pattern into the maps image sprite resources and then reference this image with the `fillPattern` option of the polygon layer.

```swift
// Load an image pattern into the map image sprite.
map.images.add(UIImage(named: "fill-checker-red")!, withID: "fill-checker-red")

// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a polygon.
source.add(geometry: Polygon([
    CLLocationCoordinate2D(latitude: -20, longitude: -50),
    CLLocationCoordinate2D(latitude: 40, longitude: 0),
    CLLocationCoordinate2D(latitude: -20, longitude: 50),
    CLLocationCoordinate2D(latitude: -20, longitude: -50)
]))

// Create and add a polygon layer to render the polygon on the map, below the label layer.
map.layers.insertLayer(
    PolygonLayer(source: source, options: [
        .fillPattern("fill-checker-red"),
        .fillOpacity(0.5)
    ]),
    below: "labels"
)
```

For this sample, the following image was loaded into the assets folder of the app.

| :::image type="content" source="./media/ios-sdk/add-polygon-layer-map-ios/fill-checker-red.png" alt-text="Image showing a polygon with a red checker fill pattern.":::
|:-----------------------------------------------------------------------:|
| `fill-checker-red.png`                                                  |

The following is a screenshot of the above code rendering a polygon with a fill pattern on the map.

:::image type="content" source="./media/ios-sdk/add-polygon-layer-map-ios/pattern.png" alt-text="Image showing the above code rendering a polygon with a fill pattern on the map." lightbox="./media/ios-sdk/add-polygon-layer-map-ios/pattern.png":::

## Additional information

See the following articles for more code samples to add to your maps:

- [Create a data source]
- [Use data-driven style expressions]
- [Add a line layer]
- [Add a polygon extrusion layer]

[Quickstart: Create an iOS app]: quick-ios-app.md
[Create a data source]: create-data-source-ios-sdk.md
[Use data-driven style expressions]: data-driven-style-expressions-ios-sdk.md
[Add a line layer]: add-line-layer-map-ios.md
[Add a polygon extrusion layer]: add-polygon-extrusion-layer-map-ios.md
