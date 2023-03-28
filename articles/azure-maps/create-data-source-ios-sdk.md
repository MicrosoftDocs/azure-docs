---
title: Create a data source for iOS maps | Microsoft Azure Maps
description: "Find out how to create a data source for a map. Learn about the data sources that the Azure Maps iOS SDK uses: GeoJSON sources and vector tiles."
author: sinnypan
ms.author: sipa
ms.date: 10/22/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Create a data source in the iOS SDK (Preview)

The Azure Maps iOS SDK stores data in data sources. Using data sources optimizes the data operations for querying and rendering. Currently there are two types of data sources:

- **GeoJSON source**: Manages raw location data in GeoJSON format locally. Good for small to medium data sets (upwards of hundreds of thousands of shapes).
- **Vector tile source**: Loads data formatted as vector tiles for the current map view, based on the maps tiling system. Ideal for large to massive data sets (millions or billions of shapes).

## GeoJSON data source

Azure Maps uses GeoJSON as one of its primary data models. GeoJSON is an open geospatial standard way for representing geospatial data in JSON format. GeoJSON classes available in the Azure Maps iOS SDK to easy create, and serialize GeoJSON data. Load and store GeoJSON data in the `DataSource` class and render it using layers. The following code shows how GeoJSON objects can be created in Azure Maps.

```swift
/*
    Raw GeoJSON feature

    {
        type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-100, 45]
        },
        "properties": {
            "custom-property": "value"
        }
    }

*/

//Create a point feature.
let feature = Feature(Point(CLLocationCoordinate2D(latitude: 45, longitude: -100)))

//Add a property to the feature.
feature.addProperty("custom-property", value: "value")

//Add the feature to the data source.
source.add(feature: feature)
```

Alternatively the properties can be loaded into a dictionary (JSON) first then passed into the feature when creating it, as shown below.

```swift
//Create a dictionary to store properties for the feature.
var properties: [String: Any] = [:]
properties["custom-property"] = "value"

let feature = Feature(Point(CLLocationCoordinate2D(latitude: 45, longitude: -100)), properties: properties)
```

Once you have a GeoJSON feature created, a data source can be added to the map through the `sources` property of the map. The following code shows how to create a `DataSource`, add it to the map, and add a feature to the data source.

```swift
//Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

//Add GeoJSON feature to the data source.
source.add(feature: feature)
```

The following code shows several ways to create a GeoJSON `Feature`, `FeatureCollection`, and geometries.

```swift
// GeoJSON Point Geometry
let point = Point(location)

// GeoJSON LineString Geometry
let polyline = Polyline(locations)

// GeoJSON Polygon Geometry
let polygon = Polygon(locations)

let polygonWithInteriorPolygons = Polygon(locations, interiorPolygons: polygons)

// GeoJSON MultiPoint Geometry
let pointCollection = PointCollection(locations)

// GeoJSON MultiLineString Geometry
let multiPolyline = MultiPolyline(polylines)

let multiPolylineFromLocations = MultiPolyline(locations: arrayOfLocationArrays) // [[CLLocationCoordinate2D]]

// GeoJSON MultiPolygon Geometry
let multiPolygon = MultiPolygon(polygons)

let multiPolygonFromLocations = MultiPolygon(locations: arrayOfLocationArrays) // [[CLLocationCoordinate2D]]

// GeoJSON GeometryCollection Geometry

let geometryCollection = GeometryCollection(geometries)

// GeoJSON Feature
let pointFeature = Feature(Point(location))

// GeoJSON FeatureCollection
let featureCollection = FeatureCollection(features)
```

### Serialize and deserialize GeoJSON

The feature collection, feature, and geometry classes all have `fromJson(_:)` and `toJson()` static methods, which help with serialization. The formatted valid JSON String passed through the `fromJson()` method will create the geometry object. This `fromJson()` method also means you can use `JSONSerialization` or other serialization/deserialization strategies. The following code shows how to take a stringified GeoJSON feature and deserialize it into the `Feature` class, then serialize it back into a GeoJSON string.

```swift
// Take a stringified GeoJSON object.
let geoJSONString = """
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-100, 45]
        },
        "properties": {
            "custom-property": "value"
        }
    }
"""

// Deserialize the JSON string into a feature.
guard let feature = Feature.fromJson(geoJSONString) else {
    throw GeoJSONSerializationError.couldNotSerialize
}

// Serialize a feature collection to a string.
let featureString = feature.toJson()
```

### Import GeoJSON data from web or assets folder

Most GeoJSON files contain a `FeatureCollection`. Read GeoJSON files as strings and use the `FeatureCollection.fromJson(_:)` method to deserialize it.

The `DataSource` class has a built in method called `importData(fromURL:)` that can load in GeoJSON files using a URL to a file on the web or the device.

```swift
// Create a data source.
let source = DataSource()

// Import the geojson data and add it to the data source.
let url = URL(string: "URL_or_FilePath_to_GeoJSON_data")!
source.importData(fromURL: url)

// Examples:
// source.importData(fromURL: URL(string: "asset://sample_file.json")!)
// source.importData(fromURL: URL(string: "https://example.com/sample_file.json")!)

// Add data source to the map.
map.sources.add(source)
```

The `importData(fromURL:)` method provides an easily way to load a GeoJSON feed into a data source but provides limited control on how the data is loaded and what happens after its been loaded. The following code is a reusable class for importing data from the web or assets folder and returning it to the UI thread via a callback function. In the callback you can then add additional post load logic to process the data, add it to the map, calculate its bounding box, and update the maps camera.

```swift
import Foundation

@objc
public class Utils: NSObject {
    /// Imports data from a web url or local file url and returns it as a string to a callback on the main thread.
    /// - Parameters:
    ///     - url: A web url or local file url that points to data to load.
    ///     - completion: The callback function to return the data to.
    @objc
    public static func importData(fromURL url: URL, completion: @escaping (String?) -> Void) {
        URLSession.shared.dataTask(with: url) { data, _, _ in
            DispatchQueue.main.async {
                if let data = data {
                    completion(String(decoding: data, as: UTF8.self))
                } else {
                    completion(nil)
                }
            }
        }.resume()
    }
}
```

The code below shows how to use this utility to import GeoJSON data as a string and return it to the main thread via a callback. In the callback, the string data can be serialized into a GeoJSON Feature collection and added to the data source. Optionally, update the maps camera to focus in on the data.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a web url or a local file url
let url = URL(string: "URL_to_GeoJSON_data")!
// Examples:
// let url = Bundle.main.url(forResource: "FeatureCollectionSample", withExtension: "geojson")!
// let url = URL(string: "www.yourdomain.com/path_to_feature_collection_sample")!

// Import the geojson data and add it to the data source.
Utils.importData(fromURL: url) { result in
    guard let result = result else {
        // No data imported.
        return
    }

    // Parse the data as a GeoJSON Feature Collection.
    guard let fc = FeatureCollection.fromJson(result) else {
        // Invalid data for FeatureCollection type.
        return
    }

    // Add the feature collection to the data source.
    source.add(featureCollection: fc)

    // Optionally, update the maps camera to focus in on the data.

    // Calculate the bounding box of all the data in the Feature Collection.
    guard let bbox = BoundingBox.fromData(fc) else {
        // The feature collection is empty.
        return
    }

    // Update the maps camera so it is focused on the data.
    map.setCameraBoundsOptions([
        .bounds(bbox),
        .padding(20)
    ])
}
```

### Update a feature

The `DataSource` class makes its easy to add and remove features. Updating the geometry or properties of a feature requires replacing the feature in the data source. There are two methods that can be used to update a feature(s):

1. Create the new feature(s) with the desired updates and replace all features in the data source using the `set` method. This method works well when you want to update all features in a data source.

``` swift
var source: DataSource!

private func onReady(map: AzureMap) {
    // Create a data source and add it to the map.
    source = DataSource()
    map.sources.add(source)

    // Create a feature and add it to the data source.
    let myFeature = Feature(Point(CLLocationCoordinate2D(latitude: 0, longitude: 0)))
    myFeature.addProperty("Name", value: "Original value")
    source.add(feature: myFeature)
}

private func updateFeature() {
    // Create a new replacement feature with an updated geometry and property value.
    let myNewFeature = Feature(Point(CLLocationCoordinate2D(latitude: -10, longitude: 10)))
    myNewFeature.addProperty("Name", value: "New value")

    // Replace all features to the data source with the new one.
    source.set(feature: myNewFeature)
}
```

1. Keep track of the feature instance in a variable, and pass it into the data sources `remove` method to remove it. Create the new feature(s) with the desired updates, updated the variable reference, and add it to the data source using the `add` method.

```swift
var source: DataSource!
var myFeature: Feature!

private func onReady(map: AzureMap) {
    // Create a data source and add it to the map.
    source = DataSource()
    map.sources.add(source)

    // Create a feature and add it to the data source.
    myFeature = Feature(Point(CLLocationCoordinate2D(latitude: 0, longitude: 0)))
    myFeature.addProperty("Name", value: "Original value")
    source.add(feature: myFeature)
}

private func updateFeature() {
    // Remove the feature instance from the data source.
    source.remove(feature: myFeature)

    // Get properties from original feature.
    var props = myFeature.properties

    // Update a property.
    props["Name"] = "New value"

    // Create a new replacement feature with an updated geometry.
    myFeature = Feature(
        Point(CLLocationCoordinate2D(latitude: -10, longitude: 10)),
        properties: props
    )

    // Re-add the feature to the data source.
    source.add(feature: myFeature)
}
```

> [!TIP]
> If you have some data that is going to be regularly updated, and other data that is will rarely be changed, it is best to split these into separate data source instances. When an update occurs in a data source it forces the map to repaint all features in the data source. By splitting this data up, only the features that are regularly updated would be repainted when an update occurs in that one data source while the features in the other data source wouldn't need to be repainted. This helps with performance.

## Vector tile source

A vector tile source describes how to access a vector tile layer. Use the `VectorTileSource` class to instantiate a vector tile source. Vector tile layers are similar to tile layers, but they aren't the same. A tile layer is a raster image. Vector tile layers are a compressed file, in **PBF** format. This compressed file contains vector map data, and one or more layers. The file can be rendered and styled on the client, based on the style of each layer. The data in a vector tile contain geographic features in the form of points, lines, and polygons. There are several advantages of using vector tile layers instead of raster tile layers:

- A file size of a vector tile is typically much smaller than an equivalent raster tile. As such, less bandwidth is used. It means lower latency, a faster map, and a better user experience.
- Since vector tiles are rendered on the client, they adapt to the resolution of the device they're being displayed on. As a result, the rendered maps appear more well defined, with crystal clear labels.
- Changing the style of the data in the vector maps doesn't require downloading the data again, since the new style can be applied on the client. In contrast, changing the style of a raster tile layer typically requires loading tiles from the server then applying the new style.
- Since the data is delivered in vector form, there's less server-side processing required to prepare the data. As a result, the newer data can be made available faster.

Azure Maps adheres to the [Mapbox Vector Tile Specification](https://github.com/mapbox/vector-tile-spec), an open standard. Azure Maps provides the following vector tiles services as part of the platform:

- Road tiles [documentation](/rest/api/maps/render-v2/get-map-tile) | [data format details](https://developer.tomtom.com/maps-api/maps-api-documentation-vector/tile)
- Traffic incidents [documentation](/rest/api/maps/traffic/gettrafficincidenttile) | [data format details](https://developer.tomtom.com/traffic-api/traffic-api-documentation-traffic-incidents/vector-incident-tiles)
- Traffic flow [documentation](/rest/api/maps/traffic/gettrafficflowtile) | [data format details](https://developer.tomtom.com/traffic-api/traffic-api-documentation-traffic-flow/vector-flow-tiles)
- Azure Maps Creator also allows custom vector tiles to be created and accessed through the [Render V2-Get Map Tile API](/rest/api/maps/render-v2/get-map-tile)

> [!TIP]
> When using vector or raster image tiles from the Azure Maps render service with the iOS SDK, you can replace `atlas.microsoft.com` with the `AzureMap`'s property' `domainPlaceholder`. This placeholder will be replaced with the same domain used by the map and will automatically append the same authentication details as well. This greatly simplifies authentication with the render service when using Azure Active Directory authentication.

To display data from a vector tile source on the map, connect the source to one of the data rendering layers. All layers that use a vector source must specify a `sourceLayer` value in the options. The following code loads the Azure Maps traffic flow vector tile service as a vector tile source, then displays it on a map using a line layer. This vector tile source has a single set of data in the source layer called "Traffic flow". The line data in this data set has a property called `traffic_level` that is used in this code to select the color and scale the size of lines.

```swift
// Formatted URL to the traffic flow vector tiles.
let trafficFlowUrl = "\(map.domainPlaceholder)/traffic/flow/tile/pbf?api-version=1.0&style=relative&zoom={z}&x={x}&y={y}"

// Create a vector tile source and add it to the map.
let source = VectorTileSource(options: [
    .tiles([trafficFlowUrl]),
    .maxSourceZoom(22)
])
map.sources.add(source)

// Create a layer for traffic flow lines.
let layer = LineLayer(
    source: source,
    options: [

        // The name of the data layer within the data source to pass into this rendering layer.
        .sourceLayer("Traffic flow"),

        // Color the roads based on the traffic_level property.
        .strokeColor(
            from: NSExpression(
                forAZMInterpolating: NSExpression(forKeyPath: "traffic_level"),
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    0: UIColor.red,
                    0.33: UIColor.yellow,
                    0.66: UIColor.green
                ])
            )
        ),

        // Scale the width of roads based on the traffic_level property.
        .strokeWidth(
            from: NSExpression(
                forAZMInterpolating: NSExpression(forKeyPath: "traffic_level"),
                curveType: .linear,
                parameters: nil,
                stops: NSExpression(forConstantValue: [
                    0: 6,
                    1: 1
                ])
            )
        )
    ]
)

// Add the traffic flow layer below the labels to make the map clearer.
map.layers.insertLayer(layer, below: "labels")
```

:::image type="content" source="./media/ios-sdk/Create-data-source-ios/ios-vector-tile-source-line-layer.png" alt-text="Screenshot of a map with color coded road lines showing traffic flow levels.":::

## Connect a data source to a layer

Data is rendered on the map using rendering layers. A single data source can be referenced by one or more rendering layers. The following rendering layers require a data source:

- [Bubble layer](add-bubble-layer-map-ios.md) - renders point data as scaled circles on the map.
- [Symbol layer](add-symbol-layer-ios.md) - renders point data as icons or text.
- [Heat map layer](add-heat-map-layer-ios.md) - renders point data as a density heat map.
- [Line layer](add-line-layer-map-ios.md) - render a line and or render the outline of polygons.
- [Polygon layer](add-polygon-layer-map-ios.md) - fills the area of a polygon with a solid color or image pattern.

The following code shows how to create a data source, add it to the map, import GeoJSON point data from a remote location into the data source, and then connect it to a bubble layer.

```swift
// Create a data source.
let source = DataSource()

// Create a web url or a local file url
let url = URL(string: "URL_or_FilePath_to_GeoJSON_data")!
// Examples:
// let url = Bundle.main.url(forResource: "FeatureCollectionSample", withExtension: "geojson")!
// let url = URL(string: "yourdomain.com/path_to_feature_collection_sample")!

// Import the geojson data and add it to the data source.
source.importData(fromURL: url)

// Add data source to the map.
map.sources.add(source)

// Create a layer that defines how to render points in the data source and add it to the map.
let layer = BubbleLayer(source: source)
map.layers.addLayer(layer)
```

There are additional rendering layers that don't connect to these data sources, but they directly load the data for rendering.

- [Tile layer](add-tile-layer-map-ios.md) - superimposes a raster tile layer on top of the map.

## One data source with multiple layers

Multiple layers can be connected to a single data source. There are many different scenarios in which this option is useful. For example, consider the scenario in which a user draws a polygon. We should render and fill the polygon area as the user adds points to the map. Adding a styled line to outline the polygon makes it easier see the edges of the polygon, as the user draws. To conveniently edit an individual position in the polygon, we may add a handle, like a pin or a marker, above each position.

:::image type="content" source="./media/ios-sdk/Create-data-source-ios/multiple-layers-one-datasource.png" alt-text="Screenshot of a map showing multiple layers rendering data from a single data source.":::

In most mapping platforms, you would need a polygon object, a line object, and a pin for each position in the polygon. As the polygon is modified, you would need to manually update the line and pins, which can quickly become complex.

With Azure Maps, all you need is a single polygon in a data source as shown in the code below.

```swift
// Create a data source and add it to the map.
let source = DataSource()
map.sources.add(source)

// Create a polygon and add it to the data source.
source.add(geometry: Polygon([
    CLLocationCoordinate2D(latitude: 33.15, longitude: -104.5),
    CLLocationCoordinate2D(latitude: 38.5, longitude: -113.5),
    CLLocationCoordinate2D(latitude: 43, longitude: -111.5),
    CLLocationCoordinate2D(latitude: 43.5, longitude: -107),
    CLLocationCoordinate2D(latitude: 43.6, longitude: -94)
]))

// Create a polygon layer to render the filled in area of the polygon.
let polygonLayer = PolygonLayer(
    source: source,
    options: [.fillColor(UIColor(red: 1, green: 165/255, blue: 0, alpha: 0.2))]
)

// Create a line layer for greater control of rendering the outline of the polygon.
let lineLayer = LineLayer(source: source, options: [
    .strokeColor(.orange),
    .strokeWidth(2)
])

// Create a bubble layer to render the vertices of the polygon as scaled circles.
let bubbleLayer = BubbleLayer(
    source: source,
    options: [
        .bubbleColor(.orange),
        .bubbleRadius(5),
        .bubbleStrokeColor(.white),
        .bubbleStrokeWidth(2)
    ]
)

// Add all layers to the map.
map.layers.addLayers([polygonLayer, lineLayer, bubbleLayer])
```

> [!TIP]
> You can also use `map.layers.insertLayer(_:below:)` method, where the ID or instance of an existing layer can be passed in as a second parameter. This would tell that map to insert the new layer being added below the existing layer. In addition to passing in a layer ID this method also supports the following values.
>
> - `"labels"` - Inserts the new layer below the map label layers.
> - `"transit"` - Inserts the new layer below the map road and transit layers.

## Additional information

See the following articles for more code samples to add to your maps:

- [Cluster point data](clustering-point-data-ios-sdk.md)
- [Add a symbol layer](Add-symbol-layer-ios.md)
- [Add a bubble layer](add-bubble-layer-map-ios.md)
- [Add a line layer](add-line-layer-map-ios.md)
- [Add a polygon layer](Add-polygon-layer-map-ios.md)
- [Add a heat map](Add-heat-map-layer-ios.md)
- [Web SDK Code samples](/samples/browse/?products=azure-maps)
