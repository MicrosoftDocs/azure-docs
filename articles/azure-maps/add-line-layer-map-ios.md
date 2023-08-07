---
title: Add a line layer to iOS maps
titleSuffix: Microsoft Azure Maps
description: Learn how to add lines to maps. See examples that use the Azure Maps iOS SDK to add line layers to maps and to customize lines with symbols and color gradients.
author: dubiety
ms.author: yuchungchen 
ms.date: 11/23/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a line layer to the map in the iOS SDK (Preview)

A line layer can be used to render `LineString` and `MultiLineString` features as paths or routes on the map. A line layer can also be used to render the outline of `Polygon` and `MultiPolygon` features. A data source is connected to a line layer to provide it with data to render.

> [!TIP]
> Line layers by default will render the coordinates of polygons as well as lines in a data source. To limit the layer so that it only renders LineString geometry features, set the `filter` option of the layer to `NSPredicate(format: "%@ == \"LineString\"", NSExpression.geometryTypeAZMVariable)`. If you want to include MultiLineString features as well, use `NSCompoundPredicate`.

## Prerequisites

Be sure to complete the steps in the [Quickstart: Create an iOS app] document. Code blocks in this article can be inserted into the  `viewDidLoad` function of `ViewController`.

## Add a line layer

The following code shows how to create a line. Add the line to a data source, then render it with a line layer using the `LineLayer` class.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a list of points.
let points = [
    CLLocationCoordinate2D(latitude: 40.74327, longitude: -73.97234),
    CLLocationCoordinate2D(latitude: 40.75680, longitude: -74.00442)
]

// Create a Polyline geometry and add it to the data source.
source.add(geometry: Polyline(points))

// Create a line layer and add it to the map.
let layer = LineLayer(source: source, options: [
    .strokeWidth(5),
    .strokeColor(.blue)
])
map.layers.addLayer(layer)
```

The following screenshot shows the above code rendering a line in a line layer.

:::image type="content" source="./media/ios-sdk/add-line-layer-map-ios/simple.png" alt-text="A simple line displayed on the map in a line layer.":::

## Data-driven line style

The following code creates two line features and adds a speed limit value as a property to each line. A line layer uses a data-drive style expression color the lines based on the speed limit value. Since the line data overlays along roads, the following code adds the line layer below the label layer so that road labels remain visible.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a line feature.
let feature = Feature(Polyline([
    CLLocationCoordinate2D(latitude: 47.704033, longitude: -122.131821),
    CLLocationCoordinate2D(latitude: 47.703678, longitude: -122.099919)
]))

// Add a property to the feature.
feature.addProperty("speedLimitMph", value: 35)

// Add the feature to the data source.
source.add(feature: feature)

// Create a second line feature.
let feature2 = Feature(Polyline([
    CLLocationCoordinate2D(latitude: 47.708265, longitude: -122.126662),
    CLLocationCoordinate2D(latitude: 47.703980, longitude: -122.126877)
]))

// Add a property to the second feature.
feature2.addProperty("speedLimitMph", value: 15)

// Add the second feature to the data source.
source.add(feature: feature2)

// Create a line layer and add it to the map.
let stops: [Int: UIColor] = [
    0: .green,
    30: .yellow,
    60: .red
]
let colorExpression = NSExpression(
    forAZMInterpolating: NSExpression(forKeyPath: "speedLimitMph"),
    curveType: .linear,
    parameters: nil,
    stops: NSExpression(forConstantValue: stops)
)

let layer = LineLayer(source: source, options: [
    .strokeWidth(5),
    .strokeColor(from: colorExpression)
])

map.layers.insertLayer(layer, below: "labels")
```

The following screenshot shows the above code that renders two lines in a line layer with their color retrieved from a data driven style expression based on a property in the line features.

:::image type="content" source="./media/ios-sdk/add-line-layer-map-ios/data-driven.png" alt-text="Add a line layer to a map.":::

## Add a stroke gradient to a line

You may apply a single stroke color to a line. You can also fill a line with a gradient of colors to show transition from one line segment to the next line segment. For example, line gradients can be used to represent changes over time and distance, or different temperatures across a connected line of objects. In order to apply this feature to a line, the data source must have the `lineMetrics` option set to `true`, and then a color gradient expression can be passed to the `strokeGradient` option of the line. The stroke gradient expression has to reference the `NSExpression.lineProgressAZMVariable` data expression that exposes the calculated line metrics to the expression.

```swift
// Create a data source and add it to the map.
let source = DataSource(options: [
    // Enable line metrics on the data source. This is needed to enable support for strokeGradient.
    .lineMetrics(true)
])
map.sources.add(source)

// Create a line and add it to the data source.
source.add(geometry: Polyline([
    CLLocationCoordinate2D(latitude: 47.63208, longitude: -122.18822),
    CLLocationCoordinate2D(latitude: 47.63196, longitude: -122.18204),
    CLLocationCoordinate2D(latitude: 47.62976, longitude: -122.17243),
    CLLocationCoordinate2D(latitude: 47.63023, longitude: -122.16419),
    CLLocationCoordinate2D(latitude: 47.62942, longitude: -122.15852),
    CLLocationCoordinate2D(latitude: 47.62988, longitude: -122.15183),
    CLLocationCoordinate2D(latitude: 47.63451, longitude: -122.14256),
    CLLocationCoordinate2D(latitude: 47.64041, longitude: -122.13483),
    CLLocationCoordinate2D(latitude: 47.64422, longitude: -122.13466),
    CLLocationCoordinate2D(latitude: 47.65440, longitude: -122.13844),
    CLLocationCoordinate2D(latitude: 47.66515, longitude: -122.13277),
    CLLocationCoordinate2D(latitude: 47.66712, longitude: -122.12779),
    CLLocationCoordinate2D(latitude: 47.66712, longitude: -122.11595),
    CLLocationCoordinate2D(latitude: 47.66735, longitude: -122.11063),
    CLLocationCoordinate2D(latitude: 47.67035, longitude: -122.10668),
    CLLocationCoordinate2D(latitude: 47.67498, longitude: -122.10565)
]))

// Create a line layer and add it to the map.
let stops: [Double: UIColor] = [
    0: .blue,
    0.1: UIColor(red: 0.25, green: 0.41, blue: 1, alpha: 1), // Royal Blue
    0.3: .cyan,
    0.5: UIColor(red: 0, green: 1, blue: 0, alpha: 1), // Lime
    0.7: .yellow,
    1: .red
]
let colorExpression = NSExpression(
    forAZMInterpolating: NSExpression.lineProgressAZMVariable,
    curveType: .linear,
    parameters: nil,
    stops: NSExpression(forConstantValue: stops)
)

map.layers.addLayer(LineLayer(source: source, options: [
    .strokeWidth(5),
    .strokeGradient(from: colorExpression)
]))
```

The following screenshot shows the above code displaying a line rendered using a gradient stroke color.

:::image type="content" source="./media/ios-sdk/add-line-layer-map-ios/gradient.png" alt-text="Add a gradient line layer to a map.":::

## Add symbols along a line

This sample shows how to add arrow icons along a line on the map. When using a symbol layer, set the `symbolPlacement` option to `.line`. This option renders the symbols along the line and rotates the icons (0 degrees = right).

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Load a image of an arrow into the map image sprite and call it "arrow-icon".
map.images.add(UIImage(named: "purple-arrow-right")!, withID: "arrow-icon")

// Create a line and add it to the data source.
source.add(geometry: Polyline([
    CLLocationCoordinate2D(latitude: 47.63208, longitude: -122.18822),
    CLLocationCoordinate2D(latitude: 47.63196, longitude: -122.18204),
    CLLocationCoordinate2D(latitude: 47.62976, longitude: -122.17243),
    CLLocationCoordinate2D(latitude: 47.63023, longitude: -122.16419),
    CLLocationCoordinate2D(latitude: 47.62942, longitude: -122.15852),
    CLLocationCoordinate2D(latitude: 47.62988, longitude: -122.15183),
    CLLocationCoordinate2D(latitude: 47.63451, longitude: -122.14256),
    CLLocationCoordinate2D(latitude: 47.64041, longitude: -122.13483),
    CLLocationCoordinate2D(latitude: 47.64422, longitude: -122.13466),
    CLLocationCoordinate2D(latitude: 47.65440, longitude: -122.13844),
    CLLocationCoordinate2D(latitude: 47.66515, longitude: -122.13277),
    CLLocationCoordinate2D(latitude: 47.66712, longitude: -122.12779),
    CLLocationCoordinate2D(latitude: 47.66712, longitude: -122.11595),
    CLLocationCoordinate2D(latitude: 47.66735, longitude: -122.11063),
    CLLocationCoordinate2D(latitude: 47.67035, longitude: -122.10668),
    CLLocationCoordinate2D(latitude: 47.67498, longitude: -122.10565)
]))

// Create a line layer and add it to the map.
map.layers.addLayer(LineLayer(source: source, options: [
    .strokeWidth(5),
    .strokeColor(.purple)
]))

// Create a symbol layer and add it to the map.
map.layers.addLayer(SymbolLayer(source: source, options: [
    // Space symbols out along line.
    .symbolPlacement(.line),

    // Spread the symbols out 100 points apart.
    .symbolSpacing(100),

    // Use the arrow icon as the symbol.
    .iconImage("arrow-icon"),

    // Allow icons to overlap so that they aren't hidden if they collide with other map elements.
    .iconAllowOverlap(true),

    // Center the symbol icon.
    .iconAnchor(.center),

    // Scale the icon size.
    .iconSize(0.8)
]))
```

For this sample, the following image was loaded into the assets folder of the app.

| ![purple_arrow_right](./media/ios-sdk/add-line-layer-map-ios/purple-arrow-right.png) |
|:------------------------------------------------------------------------------------:|
|                           `purple-arrow-right.png`                                   |

The following screenshot shows the above code displaying a line with arrow icons displayed along it.

:::image type="content" source="./media/ios-sdk/add-line-layer-map-ios/symbol.png" alt-text="A line with purple arrow icons displayed along it pointing in the direction of the route.":::

## Additional information

See the following articles for more code samples to add to your maps:

* [Create a data source]
* [Use data-driven style expressions]
* [Add a polygon layer]

[Quickstart: Create an iOS app]: quick-ios-app.md
[Create a data source]: create-data-source-ios-sdk.md
[Use data-driven style expressions]: data-driven-style-expressions-ios-sdk.md
[Add a polygon layer]: add-polygon-layer-map-ios.md