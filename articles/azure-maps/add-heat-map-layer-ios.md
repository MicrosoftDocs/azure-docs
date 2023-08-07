---
title: Add a heat map layer to iOS maps
titleSuffix: Microsoft Azure Maps
description: Learn how to create a heat map. See how to use the Azure Maps iOS SDK to add a heat map layer to a map. Find out how to customize heat map layers.
author: dubiety
ms.author: yuchungchen 
ms.date: 11/23/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add a heat map layer in the iOS SDK (Preview)

Heat maps, also known as point density maps, are a type of data visualization. They're used to represent the density of data using a range of colors and show the data "hot spots" on a map. Heat maps are a great way to render datasets with large number of points.

Rendering tens of thousands of points as symbols can cover most of the map area. This case likely results in many symbols overlapping. Making it difficult to gain a better understanding of the data. However, visualizing this same dataset as a heat map makes it easy to see the density and the relative density of each data point.

You can use heat maps in many different scenarios, including:

- **Temperature data**: Provides approximations for what the temperature is between two data points.
- **Data for noise sensors**: Shows not only the intensity of the noise where the sensor is, but it can also provide insight into the dissipation over a distance. The noise level at any one site might not be high. If the noise coverage area from multiple sensors overlaps, it's possible that this overlapping area might experience higher noise levels. As such, the overlapped area would be visible in the heat map.
- **GPS trace**: Includes the speed as a weighted height map, where the intensity of each data point is based on the speed. For example, this functionality provides a way to see where a vehicle was speeding.

> [!TIP]
> Heat map layers by default render the coordinates of all geometries in a data source. To limit the layer so that it only renders point geometry features, set the `filter` option of the layer to `NSPredicate(format: "%@ == \"Point\"", NSExpression.geometryTypeAZMVariable)`. If you want to include MultiPoint features as well, use `NSCompoundPredicate`.

[Internet of Things Show - Heat Maps and Image Overlays in Azure Maps]

## Prerequisites

Be sure to complete the steps in the [Quickstart: Create an iOS app] document. Code blocks in this article can be inserted into the  `viewDidLoad` function of `ViewController`.

## Add a heat map layer

To render a data source of points as a heat map, pass your data source into an instance of the `HeatMapLayer` class, and add it to the map.

The following code sample loads a GeoJSON feed of earthquakes from the past week and renders them as a heat map. Each data point is rendered with a radius of 10 points at all zoom levels. To ensure a better user experience, the heat map is below the label layer so the labels stay clearly visible. The data in this sample is from the [USGS Earthquake Hazards Program].

```swift
// Create a data source.
let source = DataSource()

// Import the geojson data and add it to the data source.
let url = URL(string: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")!
source.importData(fromURL: url)

// Add data source to the map.
map.sources.add(source)

// Create a heat map layer.
let layer = HeatMapLayer(
    source: source,
    options: [
        .heatmapRadius(10),
        .heatmapOpacity(0.8)
    ]
)

// Add the layer to the map, below the labels.
map.layers.insertLayer(layer, below: "labels")
```

The following screenshot shows a map loading a heat map using the above code.

:::image type="content" source="./media/ios-sdk/add-heat-map-layer-ios/ios-heat-map-layer.png" alt-text="Map with heat map layer of recent earthquakes." lightbox="./media/ios-sdk/add-heat-map-layer-ios/ios-heat-map-layer.png":::

## Customize the heat map layer

The previous example customized the heat map by setting the radius and opacity options. The heat map layer provides several options for customization, including:

- `heatmapRadius`: Defines a radius in points in which to render each data point. You can set the radius as a fixed number or as an expression. By using an expression, you can scale the radius based on the zoom level, and represent a consistent spatial area on the map (for example, a 5-mile radius).
- `heatmapColor`: Specifies how the heat map is colorized. A color gradient is a common feature of heat maps. You can achieve the effect with an `NSExpression(forAZMInterpolating:curveType:parameters:stops:)` expression. You can also use a `NSExpression(forAZMStepping:from:stops:)` expression for colorizing the heat map, breaking up the density visually into ranges that resemble a contour or radar style map. These color palettes define the colors from the minimum to the maximum density value.

  You specify color values for heat maps as an expression on the `NSExpression.heatmapDensityAZMVariable` value. The color of area where there's no data is defined at index 0 of the "Interpolation" expression, or the default color of a "Stepped" expression. You can use this value to define a background color. Often, this value is set to transparent, or a semi-transparent black.

  Here are examples of color expressions:

```swift
// Interpolated color expression
NSExpression(
    forAZMInterpolating: .heatmapDensityAZMVariable,
    curveType: .linear,
    parameters: nil,
    stops: NSExpression(forConstantValue: [
        0: UIColor.magenta.withAlphaComponent(0),
        0.01: UIColor.magenta,
        0.5: UIColor(red: 251/255, green: 0, blue: 251/255, alpha: 1),
        1: UIColor(red: 0, green: 195/255, blue: 1, alpha: 1)
    ])
)
```

```swift
// Stepped color expression
NSExpression(
    forAZMStepping: .heatmapDensityAZMVariable,
    from: NSExpression(forConstantValue: UIColor.clear),
    stops: NSExpression(forConstantValue: [
        0.01: UIColor(red: 0, green: 0, blue: 128/255, alpha: 1),
        0.25: UIColor.cyan,
        0.5: UIColor.green,
        0.75: UIColor.yellow,
        1: UIColor.red
    ])
)
```

- `heatmapOpacity`: Specifies how opaque or transparent the heat map layer is.
- `heatmapIntensity`: Applies a multiplier to the weight of each data point to increase the overall intensity of the heatmap. It causes a difference in the weight of data points, making it easier to visualize.
- `heatmapWeight`: By default, all data points have a weight of 1, and are weighted equally. The weight option acts as a multiplier, and you can set it as a number or an expression. If a number is set as the weight, it's the equivalence of placing each data point on the map twice. For instance, if the weight is `2`, then the density doubles. Setting the weight option to a number renders the heat map in a similar way to using the intensity option.

  However, if you use an expression, the weight of each data point can be based on the properties of each data point. For example, suppose each data point represents an earthquake. The magnitude value has been an important metric for each earthquake data point. Earthquakes happen all the time, but most have a low magnitude, and aren't noticed. Use the magnitude value in an expression to assign the weight to each data point. By using the magnitude value to assign the weight, you get a better representation of the significance of earthquakes within the heat map.
- `minZoom` and `maxZoom`: The zoom level range where the layer should be displayed.
- `filter`: A filter predicate used to limit the retrieved from the source and rendered in the layer.
- `sourceLayer`: If the data source connected to the layer is a vector tile source, a source layer within the vector tiles must be specified.
- `visible`: Hides or shows the layer.

The following example demonstrates a heat map using a liner interpolation expression to create a smooth color gradient. The `mag` property defined in the data is used with an exponential interpolation to set the weight or relevance of each data point.

```swift
let layer = HeatMapLayer(source: source, options: [
    .heatmapRadius(10),

    // A linear interpolation is used to create a smooth color gradient based on the heat map density.
    .heatmapColor(
        from: NSExpression(
            forAZMInterpolating: .heatmapDensityAZMVariable,
            curveType: .linear,
            parameters: nil,
            stops: NSExpression(forConstantValue: [
                0: UIColor.black.withAlphaComponent(0),
                0.01: UIColor.black,
                0.25: UIColor.magenta,
                0.5: UIColor.red,
                0.75: UIColor.yellow,
                1: UIColor.white
            ])
        )
    ),

    // Using an exponential interpolation since earthquake magnitudes are on an exponential scale.
    .heatmapWeight(
        from: NSExpression(
            forAZMInterpolating: NSExpression(forKeyPath: "mag"),
            curveType: .exponential,
            parameters: NSExpression(forConstantValue: 2),
            stops: NSExpression(forConstantValue: [
                0: 0,
                // Any earthquake above a magnitude of 6 will have a weight of 1
                6: 1
            ])
        )
    )
])
```

The following screenshot shows the above custom heat map layer using the same data from the previous heat map example.

:::image type="content" source="./media/ios-sdk/add-heat-map-layer-ios/ios-custom-heat-map-layer.png" alt-text="Map with custom heat map layer of recent earthquakes." lightbox="./media/ios-sdk/add-heat-map-layer-ios/ios-custom-heat-map-layer.png":::

## Consistent zoomable heat map

By default, the radii of data points rendered in the heat map layer have a fixed point radius for all zoom levels. As you zoom the map, the data aggregates together and the heat map layer looks different. The following video shows the default behavior of the heat map where it maintains a point radius when zooming the map.

:::image type="content" source="./media/ios-sdk/add-heat-map-layer-ios/ios-heat-map-layer-zoom.gif" alt-text="Animation showing a map zooming with a heat map layer showing a consistent point size.":::

Use a `zoom` expression to scale the radius for each zoom level, such that each data point covers the same physical area of the map. This expression makes the heat map layer look more static and consistent. Each zoom level of the map has twice as many points vertically and horizontally as the previous zoom level.

Scaling the radius so that it doubles with each zoom level creates a heat map that looks consistent on all zoom levels. To apply this scaling, use `NSExpression.zoomLevelAZMVariable` with a base 2 `exponential interpolation` expression, with the point radius set for the minimum zoom level and a scaled radius for the maximum zoom level calculated as `pow(2, maxZoom - minZoom) * radius` as shown in the following sample. Zoom the map to see how the heat map scales with the zoom level.

```swift
let layer = HeatMapLayer(source: source, options: [
    .heatmapOpacity(0.75),
    .heatmapRadius(
        from: NSExpression(
            forAZMInterpolating: .zoomLevelAZMVariable,
            curveType: .exponential,
            parameters: NSExpression(forConstantValue: 2),
            stops: NSExpression(forConstantValue: [

                // For zoom level 1 set the radius to 2 points.
                1: 2,

                // Between zoom level 1 and 19, exponentially scale the radius from 2 points to 2 * 2^(maxZoom - minZoom) points.
                19: pow(2, 19 - 1) * 2
            ])
        )
    )
])
```

The following video shows a map running the above code, which scales the radius while the map is being zoomed to create a consistent heat map rendering across zoom levels.

:::image type="content" source="./media/ios-sdk/add-heat-map-layer-ios/ios-consistent-zoomable-heat-map-layer.gif" alt-text="Animation showing a map zooming with a heat map layer showing a consistent geospatial size.":::

> [!TIP]
> When you enable clustering on the data source, points that are close to one another are grouped together as a clustered point. You can use the point count of each cluster as the weight expression for the heat map. This can significantly reduce the number of points to be rendered. The point count of a cluster is stored in a `point_count` property of the point feature:
>
> ```swift
> let layer = HeatMapLayer(source: source, options: [
>     .heatmapWeight(from: NSExpression(forKeyPath: "point_count"))
> ])
> ```
>
> If the clustering radius is only a few points, there would be a small visual difference in the rendering. A larger radius groups more points into each cluster, and improves the performance of the heatmap.

## Additional information

For more code examples to add to your maps, see the following articles:

- [Create a data source]
- [Use data-driven style expressions]

[Internet of Things Show - Heat Maps and Image Overlays in Azure Maps]: /shows/internet-of-things-show/heat-maps-and-image-overlays-in-azure-maps/player?format=ny
[Quickstart: Create an iOS app]: quick-ios-app.md
[USGS Earthquake Hazards Program]: https://earthquake.usgs.gov
[Create a data source]: create-data-source-ios-sdk.md
[Use data-driven style expressions]: data-driven-style-expressions-ios-sdk.md
