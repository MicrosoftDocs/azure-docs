---
title: Azure Maps Web SDK best practices
titleSuffix: Microsoft Azure Maps
description: Learn tips & tricks to optimize your use of the Azure Maps Web SDK. 
author: sinnypan
ms.author: sipa
ms.date: 06/23/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Azure Maps Web SDK best practices

This document focuses on best practices for the Azure Maps Web SDK, however, many of the best practices and optimizations outlined can be applied to all other Azure Maps SDKs.

The Azure Maps Web SDK provides a powerful canvas for rendering large spatial data sets in many different ways. In some cases, there are multiple ways to render data the same way, but depending on the size of the data set and the desired functionality, one method may perform better than others. This article highlights best practices and tips and tricks to maximize performance and create a smooth user experience.

Generally, when looking to improve performance of the map, look for ways to reduce the number of layers and sources, and the complexity of the data sets and rendering styles being used.

## Security best practices

For more information on security best practices, see [Authentication and authorization best practices].

### Use the latest versions of Azure Maps

The Azure Maps SDKs go through regular security testing along with any external dependency libraries used by the SDKs. Any known security issue is fixed in a timely manner and released to production. If your application points to the latest major version of the hosted version of the Azure Maps Web SDK, it automatically receives all minor version updates that include security related fixes.

If self-hosting the Azure Maps Web SDK via the npm module, be sure to use the caret (^) symbol to in combination with the Azure Maps npm package version number in your `package.json` file so that it points to the latest minor version.

```json
"dependencies": {
  "azure-maps-control": "^3.0.0"
}
```

> [!TIP]
> Always use the latest version of the npm Azure Maps Control. For more information, see [azure-maps-control] in the npm documentation.

## Optimize initial map load

When a web page is loading, one of the first things you want to do is start rendering something as soon as possible so that the user isn't staring at a blank screen.

### Watch the maps ready event

Similarly, when the map initially loads often it's desired to load data on it as quickly as possible, so the user isn't looking at an empty map. Since the map loads resources asynchronously, you have to wait until the map is ready to be interacted with before trying to render your own data on it. There are two events you can wait for, a `load` event and a `ready` event. The load event will fire after the map has finished completely loading the initial map view and every map tile has loaded. If you see a "Style is not done loading" error, you should use the `load` event and wait for the style to be fully loaded.

The ready event fires when the minimal map resources needed to start interacting with the map. More precisely, the `ready` event is triggered when the map is loading the style data for the first time. The ready event can often fire in half the time of the load event and thus allow you to start loading your data into the map sooner.

### Lazy load the Azure Maps Web SDK

If the map isn't needed right away, lazy load the Azure Maps Web SDK until it's needed. This delays the loading of the JavaScript and CSS files used by the Azure Maps Web SDK until needed. A common scenario where this occurs is when the map is loaded in a tab or flyout panel that isn't displayed on page load.

The [Lazy Load the Map] code sample shows how to delay the loading the Azure Maps Web SDK until a button is pressed. For the source code, see [Lazy Load the Map sample code].

<!------------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/vYEeyOv?height=500&theme-id=default&default-tab=js,result]
--------------------------------------------------------->

### Add a placeholder for the map

If the map takes a while to load due to network limitations or other priorities within your application, consider adding a small background image to the map `div` as a placeholder for the map. This fills the void of the map `div` while it's loading.

### Set initial map style and camera options on initialization

Often apps want to load the map to a specific location or style. Sometimes developers wait until the map has loaded (or wait for the `ready` event), and then use the `setCamera` or `setStyle` functions of the map. This often takes longer to get to the desired initial map view since many resources end up being loaded by default before the resources needed for the desired map view are loaded. A better approach is to pass in the desired map camera and style options into the map when initializing it.

## Optimize data sources

The Web SDK has two data sources,

* **GeoJSON source**: The `DataSource` class, manages raw location data in GeoJSON format locally. Good for small to medium data sets (upwards of hundreds of thousands of features).
* **Vector tile source**: The `VectorTileSource` class, loads data formatted as vector tiles for the current map view, based on the maps tiling system. Ideal for large to massive data sets (millions or billions of features).

### Use tile-based solutions for large datasets

If working with larger datasets containing millions of features, the recommended way to achieve optimal performance is to expose the data using a server-side solution such as vector or raster image tile service.  
Vector tiles are optimized to load only the data that is in view with the geometries clipped to the focus area of the tile and generalized to match the resolution of the map for the zoom level of the tile.

The [Azure Maps Creator platform] retrieves data in vector tile format. Other data formats can be using tools such as [Tippecanoe]. For more information on working with vector tiles, see the Mapbox [awesome-vector-tiles] readme in GitHub.

It's also possible to create a custom service that renders datasets as raster image tiles on the server-side and load the data using the TileLayer class in the map SDK. This provides exceptional performance as the map only needs to load and manage a few dozen images at most. However, there are some limitations with using raster tiles since the raw data isn't available locally. A secondary service is often required to power any type of interaction experience, for example, find out what shape a user clicked on. Additionally, the file size of a raster tile is often larger than a compressed vector tile that contains generalized and zoom level optimized geometries.

For more information about data sources, see [Create a data source].

### Combine multiple datasets into a single vector tile source

The less data sources the map has to manage, the faster it can process all features to be displayed. In particular, when it comes to tile sources, combining two vector tile sources together cuts the number of HTTP requests to retrieve the tiles in half, and the total amount of data would be slightly smaller since there's only one file header.

Combining multiple data sets in a single vector tile source can be achieved using a tool such as [Tippecanoe]. Data sets can be combined into a single feature collection or separated into separate layers within the vector tile known as source-layers. When connecting a vector tile source to a rendering layer, you would specify the source-layer that contains the data that you want to render with the layer.

### Reduce the number of canvas refreshes due to data updates

There are several ways data in a `DataSource` class can be added or updated. The following list shows the different methods and some considerations to ensure good performance.

* The data sources `add` function can be used to add one or more features to a data source. Each time this function is called it triggers a map canvas refresh. If adding many features, combine them into an array or feature collection and passing them into this function once, rather than looping over a data set and calling this function for each feature.
* The data sources `setShapes` function can be used to overwrite all shapes in a data source. Under the hood, it combines the data sources `clear` and `add` functions together and does a single map canvas refresh instead of two, which is faster. Be sure to use this function when you want to update all data in a data source.
* The data sources `importDataFromUrl` function can be used to load a GeoJSON file via a URL into a data source. Once the data has been downloaded, it's passed into the data sources `add` function. If the GeoJSON file is hosted on a different domain, be sure that the other domain supports cross domain requests (CORs). If it doesn't consider copying the data to a local file on your domain or creating a proxy service that has CORs enabled. If the file is large, consider converting it into a vector tile source.
* If features are wrapped with the `Shape` class, the `addProperty`, `setCoordinates`, and `setProperties` functions of the shape all trigger an update in the data source and a map canvas refresh. All features returned by the data sources `getShapes` and `getShapeById` functions are automatically wrapped with the `Shape` class. If you want to update several shapes, it's faster to convert them to JSON using the data sources `toJson` function, editing the GeoJSON, then passing this data into the data sources `setShapes` function.

### Avoid calling the data sources clear function unnecessarily

Calling the clear function of the `DataSource` class causes a map canvas refresh. If the `clear` function is called multiple times in a row, a delay can occur while the map waits for each refresh to occur.

This is a common scenario in applications that clear the data source, download new data, clear the data source again, then adds the new data to the data source. Depending on the desired user experience, the following alternatives would be better.

* Clear the data before downloading the new data, then pass the new data into the data sources `add` or `setShapes` function. If this is the only data set on the map, the map is empty while the new data is downloading.
* Download the new data, then pass it into the data sources `setShapes` function. This replaces all the data on the map.

### Remove unused features and properties

If your dataset contains features that aren't going to be used in your app, remove them. Similarly, remove any properties on features that aren't needed. This has several benefits:

* Reduces the amount of data that has to be downloaded.
* Reduces the number of features that need to be looped through when rendering the data.
* Can sometimes help simplify or remove data-driven expressions and filters, which mean less processing required at render time.

When features have numerous properties or content, it's much more performant to limit what gets added to the data source to just those needed for rendering and to have a separate method or service for retrieving the other property or content when needed. For example, if you have a simple map displaying locations on a map when clicked a bunch of detailed content is displayed. If you want to use data driven styling to customize how the locations are rendered on the map, only load the properties needed into the data source. When you want to display the detailed content, use the ID of the feature to retrieve the other content separately. If the content is stored on the server, you can reduce the amount of data that needs to be downloaded when the map is initially loaded by using a service to retrieve it asynchronously.

Additionally, reducing the number of significant digits in the coordinates of features can also significantly reduce the data size. It isn't uncommon for coordinates to contain 12 or more decimal places; however, six decimal places have an accuracy of about 0.1 meter, which is often more precise than the location the coordinate represents (six decimal places is recommended when working with small location data such as indoor building layouts). Having any more than six decimal places will likely make no difference in how the data is rendered and requires the user to download more data for no added benefit.

Here's a list of [useful tools for working with GeoJSON data].

### Use a separate data source for rapidly changing data

Sometimes there's a need to rapidly update data on the map for things such as showing live updates of streaming data or animating features. When a data source is updated, the rendering engine loops through and render all features in the data source. Improve overall performance by separating static from rapidly changing data into different data sources, reducing the number of features re-rendered during each update.

If using vector tiles with live data, an easy way to support updates is to use the `expires` response header. By default, any vector tile source or raster tile layer will automatically reload tiles when the `expires` date. The traffic flow and incident tiles in the map use this feature to ensure fresh real-time traffic data is displayed on the map. This feature can be disabled by setting the maps `refreshExpiredTiles` service option to `false`.

### Adjust the buffer and tolerance options in GeoJSON data sources

The `DataSource` class converts raw location data into vector tiles local for on-the-fly rendering. These local vector tiles clip the raw data to the bounds of the tile area with a bit of buffer to ensure smooth rendering between tiles. The smaller the `buffer` option is, the fewer overlapping data is stored in the local vector tiles and the better performance, however, the greater the change of rendering artifacts occurring. Try tweaking this option to get the right mix of performance with minimal rendering artifacts.

The `DataSource` class also has a `tolerance` option that is used with the Douglas-Peucker simplification algorithm when reducing the resolution of geometries for rendering purposes. Increasing this tolerance value reduces the resolution of geometries and in turn improve performance. Tweak this option to get the right mix of geometry resolution and performance for your data set.

### Set the max zoom option of GeoJSON data sources

The `DataSource` class converts raw location data into vector tiles local for on-the-fly rendering. By default, it does this until zoom level 18, at which point, when zoomed in closer, it samples data from the tiles generated for zoom level 18. This works well for most data sets that need to have high resolution when zoomed in at these levels. However, when working with data sets that are more likely to be viewed when zoomed out more, such as when viewing state or province polygons, setting the `minZoom` option of the data source to a smaller value such as `12` reduces the amount computation, local tile generation that occurs, and memory used by the data source and increase performance.

### Minimize GeoJSON response

When loading GeoJSON data from a server either through a service or by loading a flat file, be sure to have the data minimized to remove unneeded space characters that makes the download size larger than needed.

### Access raw GeoJSON using a URL

It's possible to store GeoJSON objects inline inside of JavaScript, however this uses more memory as copies of it are stored across the variable you created for this object and the data source instance, which manages it within a separate web worker. Expose the GeoJSON to your app using a URL instead and the data source loads a single copy of data directly into the data sources web worker.  

## Optimize rendering layers

Azure maps provides several different layers for rendering data on a map. There are many optimizations you can take advantage of to tailor these layers to your scenario the increase performances and the overall user experience.

### Create layers once and reuse them

The Azure Maps Web SDK is data driven. Data goes into data sources, which are then connected to rendering layers. If you want to change the data on the map, update the data in the data source or change the style options on a layer. This is often faster than removing, then recreating layers with every change.

### Consider bubble layer over symbol layer

The bubble layer renders points as circles on the map and can easily have their radius and color styled using a data-driven expression. Since the circle is a simple shape for WebGL to draw, the rendering engine is able to render these faster than a symbol layer, which has to load and render an image. The performance difference of these two rendering layers is noticeable when rendering tens of thousands of points.

### Use HTML markers and Popups sparingly

Unlike most layers in the Azure Maps Web control that use WebGL for rendering, HTML Markers and Popups use traditional DOM elements for rendering. As such, the more HTML markers and Popups added a page, the more DOM elements there are. Performance can degrade after adding a few hundred HTML markers or popups. For larger data sets, consider either clustering your data or using a symbol or bubble layer.

The [Reusing Popup with Multiple Pins] code sample shows how to create a single popup and reuse it by updating its content and position. For the source code, see [Reusing Popup with Multiple Pins sample code].

:::image type="content" source="./media/web-sdk-best-practices/reusing-popup-with-multiple-pins.png" alt-text="A screenshot of a map of Seattle with three blue pins, demonstrating how to Reuse Popups with Multiple Pins.":::

<!------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/rQbjvK/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
-------------------------------------------------------->

That said, if you only have a few points to render on the map, the simplicity of HTML markers may be preferred. Additionally, HTML markers can easily be made draggable if needed.

### Combine layers

The map is capable of rendering hundreds of layers, however, the more layers there are, the more time it takes to render a scene. One strategy to reduce the number of layers is to combine layers that have similar styles or can be styled using [data-driven styles].

For example, consider a data set where all features have a `isHealthy` property that can have a value of `true` or `false`. If creating a bubble layer that renders different colored bubbles based on this property, there are several ways to do this as shown in the following list, from least performant to most performant.

* Split the data into two data sources based on the `isHealthy` value and attach a bubble layer with a hard-coded color option to each data source.
* Put all the data into a single data source and create two bubble layers with a hard-coded color option and a filter based on the `isHealthy` property.
* Put all the data into a single data source, create a single bubble layer with a `case` style expression for the color option based on the `isHealthy` property. Here's a code sample that demonstrates this.

```javascript
var layer = new atlas.layer.BubbleLayer(source, null, {
    color: [
        'case',

        //Get the 'isHealthy' property from the feature.
        ['get', 'isHealthy'],

        //If true, make the color 'green'. 
        'green',

        //If false, make the color red.
        'red'
    ]
});
```

### Create smooth symbol layer animations

Symbol layers have collision detection enabled by default. This collision detection aims to ensure that no two symbols overlap. The icon and text options of a symbol layer have two options,

* `allowOverlap` - specifies if the symbol is visible when it collides with other symbols.
* `ignorePlacement` - specifies if the other symbols are allowed to collide with the symbol.

Both of these options are set to `false` by default. When animating a symbol, the collision detection calculations run on each frame of the animation, which can slow down the animation and make it look less fluid. To smooth out the animation, set these options to `true`.

The [Simple Symbol Animation] code sample demonstrates a simple way to animate a symbol layer. For the source code to this sample, see [Simple Symbol Animation sample code].

:::image type="content" source="./media/web-sdk-best-practices/simple-symbol-animation.gif" alt-text="A screenshot of a map of the world with a symbol going in a circle, demonstrating how to animate the position of a symbol on the map by updating the coordinates.":::

<!----------------------------------------------------
> [!VIDEO https://codepen.io/azuremaps/embed/oNgGzRd?height=500&theme-id=default&default-tab=js,result]
------------------------------------------------------->

### Specify zoom level range

If your data meets one of the following criteria, be sure to specify the min and max zoom level of the layer so that the rendering engine can skip it when outside of the zoom level range.

* If the data is coming from a vector tile source, often source layers for different data types are only available through a range of zoom levels.
* If using a tile layer that doesn't have tiles for all zoom levels 0 through 24 and you want it to only rendering at the levels it has tiles, and not try to fill in missing tiles with tiles from other zoom levels.
* If you only want to render a layer at certain zoom levels.
All layers have a `minZoom` and `maxZoom` option where the layer is rendered when between these zoom levels based on this logic `maxZoom > zoom >= minZoom`.

**Example**

```javascript
//Only render this layer between zoom levels 1 and 9. 
var layer = new atlas.layer.BubbleLayer(dataSource, null, {
    minZoom: 1,
    maxZoom: 10
});
```

### Specify tile layer bounds and source zoom range

By default, tile layers load tiles across the whole globe. However, if the tile service only has tiles for a certain area the map tries to load tiles when outside of this area. When this happens, a request for each tile is made and wait for a response that can block other requests being made by the map and thus slow down the rendering of other layers. Specifying the bounds of a tile layer results in the map only requesting tiles that are within that bounding box. Also, if the tile layer is only available between certain zoom levels, specify the min and max source zoom for the same reason.

**Example**

```javascript
var tileLayer = new atlas.layer.TileLayer({
    tileUrl: 'myTileServer/{z}/{y}/{x}.png',
    bounds: [-101.065, 14.01, -80.538, 35.176],
    minSourceZoom: 1,
    maxSourceZoom: 10
});
```

### Use a blank map style when base map not visible

If a layer is overlaid on the map that completely covers the base map, consider setting the map style to `blank` or `blank_accessible` so that the base map isn't rendered. A common scenario for doing this is when overlaying a full globe tile at has no opacity or transparent area above the base map.

### Smoothly animate image or tile layers

If you want to animate through a series of image or tile layers on the map. It's often faster to create a layer for each image or tile layer and to change the opacity than to update the source of a single layer on each animation frame. Hiding a layer by setting the opacity to zero and showing a new layer by setting its opacity to a value greater than zero is faster than updating the source in the layer. Alternatively, the visibility of the layers can be toggled, but be sure to set the fade duration of the layer to zero, otherwise it animates the layer when displaying it, which causes a flicker effect since the previous layer would have been hidden before the new layer is visible.

### Tweak Symbol layer collision detection logic

The symbol layer has two options that exist for both icon and text called `allowOverlap` and `ignorePlacement`. These two options specify if the icon or text of a symbol can overlap or be overlapped. When these are set to `false`, the symbol layer does calculations when rendering each point to see if it collides with any other already rendered symbol in the layer, and if it does, don't render the colliding symbol. This is good at reducing clutter on the map and reducing the number of objects rendered. By setting these options to `false`, this collision detection logic is skipped, and all symbols are rendered on the map. Tweak this option to get the best combination of performance and user experience.

### Cluster large point data sets

When working with large sets of data points you may find that when rendered at certain zoom levels, many of the points overlap and are only partial visible, if at all. Clustering is process of grouping points that are close together and representing them as a single clustered point. As the user zooms in the map, clusters break apart into their individual points. This can significantly reduce the amount of data that needs to be rendered, make the map feel less cluttered, and improve performance. The `DataSource` class has options for clustering data locally. Additionally, many tools that generate vector tiles also have clustering options.

Additionally, increase the size of the cluster radius to improve performance. The larger the cluster radius, the less clustered points there's to keep track of and render.
For more information, see [Clustering point data in the Web SDK].

### Use weighted clustered heat maps

The heat map layer can render tens of thousands of data points easily. For larger data sets, consider enabling clustering on the data source and using a small cluster radius and use the clusters `point_count` property as a weight for the height map. When the cluster radius is only a few pixels in size, there's little visual difference in the rendered heat map. Using a larger cluster radius improves performance more but may reduce the resolution of the rendered heat map.

```javascript
var layer = new atlas.layer.HeatMapLayer(source, null, {
   weight: ['get', 'point_count']
});
```

For more information, see [Clustering and the heat maps layer].

### Keep image resources small

Images can be added to the maps image sprite for rendering icons in a symbol layer or patterns in a polygon layer. Keep these images small to minimize the amount of data that has to be downloaded and the amount of space they take up in the maps image sprite. When using a symbol layer that scales the icon using the `size` option, use an image that is the maximum size your plan to display on the map and no bigger. This ensures the icon is rendered with high resolution while minimizing the resources it uses. Additionally, SVGs can also be used as a smaller file format for simple icon images.

## Optimize expressions

[Data-driven style expressions] provide flexibility and power for filtering and styling data on the map. There are many ways in which expressions can be optimized. Here are a few tips.

### Reduce the complexity of filters

Filters loop over all data in a data source and check to see if each filter matches the logic in the filter. If filters become complex, this can cause performance issues. Some possible strategies to address this include the following.

* If using vector tiles, break up the data into different source layers.
* If using the `DataSource` class, break up that data into separate data sources. Try to balance the number of data sources with the complexity of the filter. Too many data sources can cause performance issues too, so you might need to do some testing to find out what works best for your scenario.
* When using a complex filter on a layer, consider using multiple layers with style expressions to reduce the complexity of the filter. Avoid creating a bunch of layers with hardcoded styles when style expressions can be used as a large number of layers can also cause performance issues.

### Make sure expressions don't produce errors

Expressions are often used to generate code to perform calculations or logical operations at render time. Just like the code in the rest of your application, be sure the calculations and logical make sense and aren't error prone. Errors in expressions cause issues in evaluating the expression, which can result in reduced performance and rendering issues.

One common error to be mindful of is having an expression that relies on a feature property that might not exist on all features. For example, the following code uses an expression to set the color property of a bubble layer to the `myColor` property of a feature.

```javascript
var layer = new atlas.layer.BubbleLayer(source, null, {
    color: ['get', 'myColor']
});
```

The above code functions fine if all features in the data source have a `myColor` property, and the value of that property is a color. This may not be an issue if you have complete control of the data in the data source and know for certain all features have a valid color in a `myColor` property. That said, to make this code safe from errors, a `case` expression can be used with the `has` expression to check that the feature has the `myColor` property. If it does, the `to-color` type expression can then be used to try to convert the value of that property to a color. If the color is invalid, a fallback color can be used. The following code demonstrates how to do this and sets the fallback color to green.

```javascript
var layer = new atlas.layer.BubbleLayer(source, null, {
    color: [
        'case',

        //Check to see if the feature has a 'myColor' property.
        ['has', 'myColor'],

        //If true, try validating that 'myColor' value is a color, or fallback to 'green'. 
        ['to-color', ['get', 'myColor'], 'green'],

        //If false, return a fallback value.
        'green'
    ]
});
```

### Order boolean expressions from most specific to least specific

Reduce the total number of conditional tests required when using boolean expressions that contain multiple conditional tests by ordering them from most to least specific.

### Simplify expressions

Expressions can be powerful and sometimes complex. The simpler an expression is, the faster it's evaluated. For example, if a simple comparison is needed, an expression like `['==', ['get', 'category'], 'restaurant']` would be better than using a match expression like `['match', ['get', 'category'], 'restaurant', true, false]`. In this case, if the property being checked is a boolean value, a `get` expression would be even simpler `['get','isRestaurant']`.

## Web SDK troubleshooting

The following are some tips to debugging some of the common issues encountered when developing with the Azure Maps Web SDK.

**Why doesn't the map display when I load the web control?**

Things to check:

* Ensure that you complete your authentication options in the map. Without authentication, the map loads a blank canvas and returns a 401 error in the network tab of the browser's developer tools.
* Ensure that you have an internet connection.
* Check the console for errors of the browser's developer tools. Some errors may cause the map not to render. Debug your application.
* Ensure you're using a [supported browser].

**All my data is showing up on the other side of the world, what's going on?**

Coordinates, also referred to as positions, in the Azure Maps SDKs aligns with the geospatial industry standard format of `[longitude, latitude]`. This same format is also how coordinates are defined in the GeoJSON schema; the core data formatted used within the Azure Maps SDKs. If your data is appearing on the opposite side of the world, it's most likely due to the longitude and latitude values being reversed in your coordinate/position information.

**Why are HTML markers appearing in the wrong place in the web control?**

Things to check:

* If using custom content for the marker, ensure the `anchor` and `pixelOffset` options are correct. By default, the bottom center of the content is aligned with the position on the map.
* Ensure that the CSS file for Azure Maps has been loaded.
* Inspect the HTML marker DOM element to see if any CSS from your app has appended itself to the marker and is affecting its position.

**Why are icons or text in the symbol layer appearing in the wrong place?**

Check that the `anchor` and the `offset` options are configured correctly to align with the part of your image or text that you want to have aligned with the coordinate on the map.
If the symbol is only out of place when the map is rotated, check the `rotationAlignment` option. By default, symbols rotate with the maps viewport, appearing upright to the user. However, depending on your scenario, it may be desirable to lock the symbol to the map's orientation by setting the `rotationAlignment` option to `map`.

If the symbol is only out of place when the map is pitched/tilted, check the `pitchAlignment` option. By default, symbols stay upright in the maps viewport when the map is pitched or tilted. However, depending on your scenario, it may be desirable to lock the symbol to the map's pitch by setting the `pitchAlignment` option to `map`.

**Why isn't any of my data appearing on the map?**

Things to check:

* Check the console in the browser's developer tools for errors.
* Ensure that a data source has been created and added to the map, and that the data source has been connected to a rendering layer that has also been added to the map.
* Add break points in your code and step through it. Ensure data is added to the data source and the data source and layers are added to the map.
* Try removing data-driven expressions from your rendering layer. It's possible that one of them may have an error in it that is causing the issue.

**Can I use the Azure Maps Web SDK in a sandboxed iframe?**

Yes.

## Get support

The following are the different ways to get support for Azure Maps depending on your issue.

**How do I report a data issue or an issue with an address?**

Report issues using the [Azure Maps feedback] site. Detailed instructions on reporting data issues are provided in the [Provide data feedback to Azure Maps] article.

> [!NOTE]
> Each issue submitted generates a unique URL to track it. Resolution times vary depending on issue type and the time required to verify the change is correct. The changes will appear in the render services weekly update, while other services such as geocoding and routing are updated monthly.

**How do I report a bug in a service or API?**

Report issues on Azure's [Help + support] page by selecting the **Create a support request** button.

**Where do I get technical help for Azure Maps?**

* For questions related to the Azure Maps Power BI visual, contact [Power BI support].

* For all other Azure Maps services, contact [Azure support].

* For question or comments on specific Azure Maps Features, use the [Azure Maps developer forums].

## Next steps

See the following articles for more tips on improving the user experience in your application.

> [!div class="nextstepaction"]
> [Make your application accessible]

Learn more about the terminology used by Azure Maps and the geospatial industry.

> [!div class="nextstepaction"]
> [Azure Maps glossary]

[Authentication and authorization best practices]: authentication-best-practices.md
[awesome-vector-tiles]: https://github.com/mapbox/awesome-vector-tiles#awesome-vector-tiles-
[Azure Maps Creator platform]: creator-indoor-maps.md
[Azure Maps developer forums]: /answers/topics/azure-maps.html
[Azure Maps feedback]: https://feedback.azuremaps.com
[Azure Maps glossary]: glossary.md
[Azure support]: https://azure.com/support
[azure-maps-control]: https://www.npmjs.com/package/azure-maps-control?activeTab=versions
[bug]: https://bugs.webkit.org/show_bug.cgi?id=170075
[Clustering and the heat maps layer]: clustering-point-data-web-sdk.md#clustering-and-the-heat-maps-layer
[Clustering point data in the Web SDK]: clustering-point-data-web-sdk.md
[Create a data source]: create-data-source-web-sdk.md
[Data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[data-driven styles]: data-driven-style-expressions-web-sdk.md
[Help + support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview
[Make your application accessible]: map-accessibility.md
[Power BI support]: https://powerbi.microsoft.com/support
[Provide data feedback to Azure Maps]: how-to-use-feedback-tool.md
[supported browser]: supported-browsers.md
[Tippecanoe]: https://github.com/mapbox/tippecanoe
[useful tools for working with GeoJSON data]: https://github.com/tmcw/awesome-geojson

[Lazy Load the Map]: https://samples.azuremaps.com/map/lazy-load-the-map
[Lazy Load the Map sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Map/Lazy%20Load%20the%20Map/Lazy%20Load%20the%20Map.html
[Reusing Popup with Multiple Pins]: https://samples.azuremaps.com/popups/reusing-popup-with-multiple-pins
[Reusing Popup with Multiple Pins sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Popups/Reusing%20Popup%20with%20Multiple%20Pins/Reusing%20Popup%20with%20Multiple%20Pins.html
[Simple Symbol Animation]: https://samples.azuremaps.com/animations/simple-symbol-animation
[Simple Symbol Animation sample code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Animations/Simple%20Symbol%20Animation/Simple%20Symbol%20Animation.html
