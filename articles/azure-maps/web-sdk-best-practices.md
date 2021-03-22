---
title: Azure Maps Web SDK Best Practices | Microsoft Azure Maps
description: Learn tips & tricks to optimize your use of the Azure Maps Web SDK. 
author: rbrundritt
ms.author: richbrun
ms.date: 3/22/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Azure Maps Web SDK Best Practices

This document focuses on best practices for the Azure Maps Web SDK, however, many of the best practices and optimizations outlined can be applied to all other Azure Maps SDKs.
The Azure Maps Web SDK provides a powerful canvas for rendering large spatial data sets in many different ways. In some cases, there are multiple ways to render data the same way, but depending on the size of the data set and the desired functionality, one method may perform better than others. This article highlights best practices as well as tips and tricks to maximize performance and create a smooth user experience.
Generally, when looking to improve performance of the map, look for ways to reduce the number of layers and sources, and the complexity of the data sets and rendering styles being used.

## Security basics

The single most important part of your application is its security. If your applications isn’t secure a hacker can ruin any application, no matter how good the user experience might be. The following are some tips to keep your Azure Maps application secure. When using Azure, be sure to familiarize yourself with the security tools available to you. See this document for an [introduction to Azure security](https://docs.microsoft.com/azure/security/fundamentals/overview).

> [!IMPORTANT]
> Azure Maps provides two methods of authentication.
> * Subscription key-based authentication
> * Azure Active Directory authentication
> Use Azure Active Directory in all production applications.
> Subscription key-based authentication is simple and what most mapping platforms use as a light way method to measure your usage of the platform for billing purposes. However, this is not a secure form of authentication and should only be used locally when developing apps.   Some platforms provide the ability to restrict which IP addresses and/or HTTP referrer is in requests, however, this information can easily be spoofed. If you do use subscription keys, be sure to [rotate them regularly](how-to-manage-authentication.md#manage-and-rotate-shared-keys).
> Azure Active Directory is an enterprise identity service that has a large selection of security features and settings for all sorts of application scenarios. Microsoft recommends that all production applications using Azure Maps use Azure Active Directory for authentication.
> Learn more about [managing authentication in Azure Maps](how-to-manage-authentication.md) in this document.

### Secure your private data

When data is added to the Azure Maps interactive map SDK’s it is rendered locally on the end user’s device and is never sent back out to the internet for any reason.
If your application is loading data that should not be publicly accessible  , make sure that the data is stored in a secure location, is accessed in a secure manner, and that the application itself is locked down     and only available to your desired users. If any of these steps are skipped an unauthorized person has the potential to access this data. Azure Active Directory can assist you with locking this down.
See this tutorial on [adding authentication to your web app running on Azure App Service](https://docs.microsoft.com/azure/app-service/scenario-secure-app-authentication-app-service)

### Use the latest versions of Azure Maps

The Azure Maps SDKs go through regular security testing along with any external dependency libraries that may be used by the SDKs. Any known security issue is fixed in a timely manner and released to production. If your application points to the latest major version of the hosted version of the Azure Maps Web SDK, it will automatically receive all minor version updates which will include security related fixes.
If self-hosting the Azure Maps Web SDK via the NPM module be sure to add use the caret (^) symbol to in combination with the Azure Maps NPM package version number in your `package.json` file so that it will always point to the latest minor version.

```json
"dependencies": {
  "azure-maps-control": "^2.0.30"
}
```

## Optimize initial map load

When a web page is loading, one of the first things you want to do is start rendering something as soon as possible so that the user isn’t staring at a blank screen.

### Watch the maps ready event

Similarly, when the map initially loads often it is desired to load data on it as quickly as possible, so the user isn’t looking at an empty map. Since the map loads resources asynchronously, you have to wait until the map is ready to be interacted with before trying to render your own data on it. There are two events you can wait for, a `load` event and a `ready` event. The load event will fire after the map has finished completely loading the initial map view and every map tile has loaded. The ready event will fire when the minimal map resources needed to start interacting with the map. The ready event can often fire in half the time of the load event and thus allow you to start loading your data into the map sooner.

### Lazy load the Azure Maps Web SDK

If the map isn’t needed right away, lazy load the Azure Maps Web SDK until it is needed. This will delay the loading of the JavaScript and CSS files used by the Azure Maps Web SDK until needed. A common scenario where this occurs is when the map is loaded in a tab or flyout panel that isn’t displayed on page load.
The following code sample shows how delay the loading the Azure Maps Web SDK until a button is pressed.

<br/>

<iframe height="265" style="width: 100%;" scrolling="no" title="Lazy load the map" src="https://codepen.io/azuremaps/embed/vYEeyOv?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/vYEeyOv'>Lazy load the map</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Add a placeholder for the map

If the map takes a while to load due to network limitations or other priorities within your application, consider adding a small background image to the map `div` as a placeholder for the map. This will fill the void of the map `div` while it is loading.

### Set initial map style and camera options on initialization

Often apps want to load the map to a specific location or style. Sometimes developers will wait until the map has loaded (or wait for the `ready` event), and then use the `setCemer` or `setStyle` functions of the map. This will often take longer to get to the desired initial map view since a lot of additional resources end up being loaded by default before the resources needed for the desired map view are loaded. A better approach is to pass in the desired map camera and style options into the map when initializing it.

## Optimize data sources

The Web SDK has two data sources,

* **GeoJSON source**: Known as the `DataSource` class, manages raw location data in GeoJSON format locally. Good for small to medium data sets (upwards of hundreds of thousands of features).
* **Vector tile source**: Known at the `VectorTileSource` class, loads data formatted as vector tiles for the current map view, based on the maps tiling system. Ideal for large to massive data sets (millions or billions of features).

### Use tile-based solutions for large datasets

If working with larger datasets containing millions of features, the recommended way to achieve optimal performance is to expose the data using a server side solution such as vector or raster image tile service.  
Vector tiles are optimized to load only the data that is in view with the geometries clipped to the focus area of the tile and generalized to match the resolution of the map for the zoom level of the tile.

The [Azure Maps Creator platform](creator-indoor-maps.md) provides the ability to retrieve data in vector tile format. Other data formats can be using tools such as [Tippecanoe](https://github.com/mapbox/tippecanoe) or one of the many [resources list on this page](https://github.com/mapbox/awesome-vector-tiles).

It is also possible to create a custom service that renders datasets as raster image tiles on the server side and load the data using the TileLayer class in the map SDK. This provides exceptional performance as the map only needs to load and manage a few dozen images at most. However, there are some limitations with using raster tiles since the raw data is not available locally . A secondary service is usually required to power any type of interaction experience, for example, find out what shape a user clicked on. Additionally, the file size of a raster tile is often larger than a compressed vector tile that contains generalized and zoom level optimized geometries.

Learn more about data sources in the [Create a data source](create-data-source-web-sdk.md) document.

### Combine multiple datasets into a single vector tile source

The less data sources the map has to manage, the faster it can process all features to be displayed. In particular, when it comes to tile sources, combining two vector tile sources together cuts the number of HTTP requests to retrieve the tiles in half, and the total amount of data would be slightly smaller since there is only one file header.

Combining multiple data sets in a single vector tile source can be achieved using a tool such as [Tippecanoe](https://github.com/mapbox/tippecanoe). Data sets can be combined into a single feature collection or separated into separate layers within the vector tile known as source-layers. When connecting a vector tile source to a rendering layer, you would specify the source-layer that contains the data that you want to render with the layer.

### Reduce the number of canvas refreshes due to data updates

There are several ways data in a `DataSource` class can be added or updated. Listed below are the different methods and some considerations to ensure good performance.

* The data sources `add` function can be used to add one or more features to a data source. Each time this function is called it will trigger a map canvas refresh. If adding a lot of features, combine them into an array or feature collection and passing them into this function once, rather than looping over a data set and calling this function for each feature.
* The data sources `setShapes` function can be used to overwrite all shapes in a data source. Under the hood it combines the data sources `clear` and `add` functions together and does a single map canvas refresh instead of two, which is much faster. Be sure to use this when you want to update all data in a data source.
* The data sources `importDataFromUrl` function can be used to load a GeoJSON file via a URL into a data source. Once the data has been downloaded it is passed into the data sources `add` function. If the GeoJSON file is hosted on a different domain, be sure that the other domain supports cross domain requests (CORs). If it doesn’t consider copying the data to a local file on your domain or creating a proxy service which has CORs enabled. If the file is large, consider converting it into a vector tile source.
* If features are wrapped with the `Shape` class, the `addProperty`, `setCoordinates`, and `setProperties` functions of the shape will all trigger an update in the data source and a map canvas refresh. Note that all features returned by the data sources `getShapes` and `getShapeById` functions are automatically wrapped with the `Shape` class. If you want to update several shapes, it is faster to convert them to JSON using the data sources `toJson` function, editing the GeoJSON, then passing this data into the data sources `setShapes` function.

### Avoid calling the data sources clear function unnecessarily

Calling the clear function of the `DataSource` class causes a map canvas refresh. If the `clear` function is called multiple times in a row, a delay can occur while the map waits for each refresh to occur.

A common scenario where this often appears in applications is when an app clears the data source, downloads new data, clears the data source again then adds the new data to the data source. Depending on the desired user experience the following alternatives would be better.

* Clear the data before downloading the new data, then pass the new data into the data sources `add` or `setShapes` function. If this is the only data set on the map, the map will be empty while the new data is downloading.
* Download the new data, then pass it into the data sources `setShapes` function. This will replace all the data on the map.

### Remove unused features and properties

If your dataset contains features that aren’t going to be used in your app, remove them. Similarly, remove any properties on features that aren’t needed. This has several benefits:

* Reduces the amount of data that has to be downloaded.
* Reduces the number of features that need to be looped through when rendering the data.
* Can sometimes help simplify or remove data-driven expressions and filters which means less processing required at render time.

When features have a lot of properties or content it is much more performant to limit what gets added to the data source to just those needed for rendering and to have a separate method or service for retrieving the additional property or content when needed. For example, if you have a simple map displaying locations on a map when clicked a bunch of detailed content is displayed. If you want to use data driven styling to customize how the locations are rendered on the map, only load the properties needed into the data source. When you want to display the detailed content, use the ID of the feature to retrieve the additional content separately. If the content is stored on the server side, a service can be used to retrieve it asynchronously which would drastically reduce the amount of data that needs to be downloaded when the map is initially loaded.

Additionally, reducing the number of significant digits in the coordinates of features can also significantly reduce the data size. It is not uncommon for coordinates to contain 12 or more decimal places; however, six decimal places has an accuracy of about 0.1 meters which is often more precise than the location the coordinate represents (six place is recommended when working with very small location data such as indoor building layouts). Having any more than six decimal places will likely make no difference in how the data is rendered and will only require the user to download more data for no added benefit.

Here is a list of [useful tools for working with GeoJSON data](https://github.com/tmcw/awesome-geojson).

### Use a separate data source for rapidly changing data

Sometimes there is a need to rapidly update data on the map for things such as showing live updates of streaming data or animating features. When a data source is updated the rendering engine will loop through and render all features in the data source. Separating static data from rapidly changing data into different data sources can significantly reduce the number of features that are re-rendered on each update to the data source and improve overall performance.

If using vector tiles with live data, an easy way to support updates is to use the `expires` response header. By default, any vector tile source or raster tile layer will automatically reload tiles when the `expires` date. The traffic flow and incident tiles in the map use this feature to ensure fresh real-time traffic data is displayed on the map. This feature can be disabled by setting the maps `refreshExpiredTiles` service option to `false`.

### Adjust the buffer and tolerance options in GeoJSON data sources

The `DataSource` class converts raw location data into vector tiles local for on-the-fly rendering. These local vector tiles clip the raw data to the bounds of the tile area with a bit of buffer to ensure smooth rendering between tiles. The smaller the `buffer` option is, the fewer overlapping data is stored in the local vector tiles and the better performance, however, the greater the change of rendering artifacts occurring. Try tweaking this option to get the right mix of performance with minimal rendering artifacts.

The `DataSource` class also has a `tolerance` option which is used with the Douglas-Peucker simplification algorithm when reducing the resolution of geometries for rendering purposes. Increasing this tolerance value will reduce the resolution of geometries and in turn improve performance. Tweak this option to get the right mix of geometry resolution and performance for your data set.

### Set the max zoom option of GeoJSON data sources

The `DataSource` class converts raw location data into vector tiles local for on-the-fly rendering. By default, it will do this until zoom level 18, at which point, when zoomed in closer, it will sample data from the tiles generated for zoom level 18. This works well for most data sets that need to have high resolution when zoomed in at these levels. However, when working with data sets that are more likely to be viewed when zoomed out more, such as when viewing state or province polygons, setting the `minZoom` option of the data source to a smaller value such as `12` will reduce the amount computation, local tile generation that occurs, and memory used by the data source and increase performance.

### Minimize GeoJSON response

When loading GeoJSON data from a server either through a service or by loading a flat file, be sure to have the data minimized to remove unneeded space characters that makes the download size larger than needed.

### Access raw GeoJSON using a URL

It is possible to store GeoJSON objects inline inside of JavaScript, however this will use up a lot of memory as copies of it will be stored across the variable you created for this object and the data source instance which manages it within a separate web worker. Expose the GeoJSON to your app using a URL instead and the data source will load a single copy of data directly into the data sources web worker.  

## Optimize rendering layers

Azure maps provides several different layers for rendering data on a map. There are many optimizations you can take advantage of to tailor these layers to your scenario the increase performances and the overall user experience.

### Create layers once and reuse them

The Azure Maps Web SDK is decided to be data driven. Data goes into data sources, which are then connected to rendering layers. If you want to change the data on the map, update the data in the data source or change the style options on a layer. This is often much faster than removing and then recreating layers whenever there is a change.

### Consider bubble layer over symbol layer

The bubble layer renders points as circles on the map and can easily have their radius and color styled using a data-driven expression. Since the circle is a simple shape for WebGL to draw, the rendering engine will be able to render these much faster than a symbol layer which has to load and render an image. The performance difference of these two rendering layers is noticeable when rendering tens of thousands of points.

### Use HTML markers and Popups sparingly

Unlike most layers in the Azure Maps Web control which use WebGL for rendering, HTML Markers and Popups use traditional DOM elements for rendering. As such, the more HTML markers and Popups added a page, the more DOM elements there are. Performance can degrade after adding a few hundred HTML markers or popups. For larger data sets consider either clustering your data or using a symbol or bubble layer. For popups, a common strategy is to create a single popup and reuse it by updating its content and position as shown in the below example:

<br/>

<iframe height='500' scrolling='no' title='Reusing Popup with Multiple Pins' src='//codepen.io/azuremaps/embed/rQbjvK/?height=500&theme-id=0&default-tab=result&embed-version=2&editable=true' frameborder='no' loading="lazy" allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/rQbjvK/'>Reusing Popup with Multiple Pins</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

That said, if you only have a few points to render on the map, the simplicity of HTML markers may be preferred. Additionally, HTML markers can easily be made draggable if needed.

### Combine layers

The map is capable of rendering hundreds of layers, however, the more layers there are, the more time it takes to render a scene. One strategy to reduce the number of layers is to combine layers that have similar styles or can be styled using a [data-driven styles](data-driven-style-expressions-web-sdk.md).

For example, consider a data set where all features have a `isHealthy` property that can have a value of `true` or `false`. If creating a bubble layer that renders different colored bubbles based on this property, there are several ways to do this as listed below from least performant to most performant.

* Split the data into two data sources based on the `isHealthy` value and attach a bubble layer with a hard-coded color option to each data source.
* Put all the data into a single data source and create two bubble layers with a hard-coded color option and a filter based on the `isHealthy` property. 
* Put all the data into a single data source, create a single bubble layer with a `case` style expression for the color option based on the `isHealthy` property. Here is a code sample that demonstrates this.

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

* `allowOverlap` - specifies if the symbol will be visible if it collides with other symbols.
* `ignorePlacement` - specifies if the other symbols are allowed to collide with the symbol.

Both of these options are set to `false` by default. When animating a symbol, the collision detection calculations will run on each frame of the animation which can slow the animation down and make it look less fluid. To smooth the animation out, set these options to `true`.

The following code sample a simple way to animate a symbol layer.

<br/>

<iframe height="265" style="width: 100%;" scrolling="no" title="Symbol layer animation" src="https://codepen.io/azuremaps/embed/oNgGzRd?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/oNgGzRd'>Symbol layer animation</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Specify zoom level range

If your data meets one of the following criteria, be sure to specify the min and max zoom level of the layer so that the rendering engine can skip it when outside of the zoom level range.

* If the data is coming from a vector tile source. Often source layers for different data types are only available through a range of zoom levels.
* If using a tile layer that doesn’t have tiles for all zoom levels 0 through 24 and you want it to only rendering at the levels it has tiles, and not try and fill in missing tiles with tiles from other zoom levels.
* If you only want to render a layer at certain zoom levels.
All layers have a `minZoom` and `maxZoom` option where the layer will be rendered when between these zoom levels based on this logic ` maxZoom > zoom >= minZoom`.

**Example**

```javascript
//Only render this layer between zoom levels 1 and 9. 
var layer = new atlas.layer.BubbleLayer(dataSource, null, {
    minZoom: 1,
    maxZoom: 10
});
```

### Specify tile layer bounds and source zoom range

By default, tile layers will load tiles try and load tiles across the whole globe. However, if the tile service only has tiles for a certain area the map will try and load tiles when outside of this area. When this happens a request for each tile will be made and wait for a response which can block other requests being made by the map and thus slow down the rendering of other layers. Specifying the bounds of a tile layer will result in the map only requesting tiles that are within that bounding box. Also, if the tile layer is only available between certain zoom levels, specify the min and max source zoom for the same reason.

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

If a layer is being overlaid on the map that will completely cover the base map, consider setting the map style to `blank` or `blank_accessible` so that the base map isn’t rendered. A common scenario for doing this is when overlaying a full globe tile at has no opacity or transparent area above the base map.

### Smoothly animate image or tile layers

If you want to animate through a series of image or tile layers on the map. It is often faster to create a layer for each image or tile layer and to change the opacity than to update the source of a single layer on each animation frame. Hiding a layer by setting the opacity to zero and showing a new layer by setting its opacity to a value greater than zero is much faster than updating the source in the layer. Alternatively, the visibility of the layers can be toggled, but be sure to set the fade duration of the layer to zero, otherwise it will animate the layer when displaying it which will cause a flicker effect since the previous layer would have been hidden before the new layer is visible.

### Tweak Symbol layer collision detection logic

The symbol layer has two options that exist for both icon and text called `allowOverlap` and `ignorePlacement`. These two options specify if the icon or text of a symbol can overlap or be overlapped. When these are set to `false`, the symbol layer will do calculations when rendering each point to see if it collides with any other already rendered symbol in the layer, and if it does, will not render the colliding symbol. This is good at reducing clutter on the map and reducing the number of objects rendered. By setting these options to `false`, this collision detection logic will be skipped, and all symbols will be rendered on the map. Tweak this option to get the best combination of performance and user experience.

### Cluster large point data sets

When working with large sets of data points you may find that when rendered at certain zoom levels, many of the points overlap and are only partial visible, if at all. Clustering is process of grouping points that are close together and representing them as a single clustered point. As the user zooms the map in clusters will break apart into their individual points. This can significantly reduce the amount of data that needs to be rendered, make the map feel less cluttered, and improve performance. The `DataSource` class has options for clustering data locally. Additionally, many tools that generate vector tiles also have clustering options.

Additionally, increase the size of the cluster radius to improve performance. The larger the cluster radius, the less clustered points there is to keep track of and render.
Learn more in the [Clustering point data document](clustering-point-data-web-sdk.md)

### Use weighted clustered heat maps

The heat map layer can render tens of thousands of data points easily. For larger data sets, consider enabling clustering on the data source and using a small cluster radius and use the clusters `point_count` property as a weight for the height map. When the cluster radius is only a few pixels in size, there will be little visual difference in the rendered heat map. Using a larger cluster radius will improve performance more but may reduce the resolution of the rendered heat map.

```javascript
var layer = new atlas.layer.HeatMapLayer(source, null, {
   weight: ['get', 'point_count']
});
```

Learn more in the [Clustering and heat maps in this document](clustering-point-data-web-sdk.md #clustering-and-the-heat-maps-layer)

### Keep image resources small

Images can be added to the maps image sprite for rendering icons in a symbol layer or patterns in a polygon layer. Keep these images small to minimize the amount of data that has to be downloaded and the amount of space they take up in the maps image sprite. When using a symbol layer that scales the icon using the `size` option, use an image that is the maximum size your plan to display on the map and no bigger. This will ensure the icon is rendered with high resolution while minimizing the resources it uses. Additionally, SVG’s can also be used as a smaller file format for simple icon images.

## Optimize expressions

[Data-driven style expressions](data-driven-style-expressions-web-sdk.md) provide a lot of flexibility and power for filtering and styling data on the map. There are many ways in which expressions can be optimized. Here are a few tips.

### Reduce the complexity of filters

Filters loop over all data in a data source and check to see if each filter matches the logic in the filter. If filters become complex, this can cause performance issues. Some possible strategies to address this include the following.

* If using vector tiles, break the data up into different source layers.
* If using the `DataSource` class, break that data up into separate data sources. Try and balance the number of data sources with the complexity of the filter. Too many data sources can cause performance issues too, so you might need to do some testing to find out what works best for your scenario.
* When using a complex filter on a layer, consider using multiple layers with style expressions to reduce the complexity of the filter. Avoid creating a bunch of layers with hardcoded styles when style expressions can be used as a large number of layers can also cause performance issues.

### Make sure expressions don’t produce errors

Expressions are often used to generate code to perform calculations or logical operations at render time. Just like the code in the rest of your application, be sure the calculations and logical make sense and are not error prone. Errors in expressions will cause issues in evaluating the expression which can result in reduced performance and rendering issues.

One common error to be mindful of is having an expression that relies on a feature property that might not exist on all features. For example, the following code uses an expression to set the color property of a bubble layer to the `myColor` property of a feature.

```javascript
var layer = new atlas.layer.BubbleLayer(source, null, {
    color: ['get', 'myColor']
});
```

The above code will function fine if all features in the data source have a `myColor` property, and the value of that property is a color. This may not be an issue if you have complete control of the data in the data source and know for certain all features will have a valid color in a `myColor` property. That said, to make this code safe from errors, a `case` expression can be used with the `has` expression to check that the feature has the `myColor` property. If it does, the `to-color` type expression can then be used to try and convert the value of that property to a color. If the color is invalid, a fallback color can be used. The following code demonstrates how to do this and sets the fallback color to green.

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

### Order boolean expressions from most specific to leas specific

When using boolean expressions that contain multiple conditional tests, order the conditional tests from most specific to least specific. By doing this, the first condition should reduce the amount of data the second condition has to be tested against, thus reducing the total number of conditional tests that need to be performed.

### Simplify expressions

Expressions can be very powerful and sometimes complex. The simpler an expression is, the faster it will be evaluated. For example, if a simple comparison is needed, an expression like `['==', ['get', 'category'], 'restaurant']` would be better than using a match expression like `['match', ['get', 'category'], 'restaurant', true, false]`. In this case, if the property being checked is a boolean value, a `get` expression would be even simpler `['get','isRestaurant']`.

## Web SDK troubleshooting

The following are some tips to debugging some of the common issues encountered when developing with the Azure Maps Web SDK.

**Why doesn’t the map display when I load the web control?**

Do the following:

* Ensure that you have added your added authentication options to the map. If this is not added, the map will load with a blank canvas since it can’t access the base map data without authentication and 401 errors will appear in the network tab of the browser’s developer tools.
* Ensure that you have an internet connection.
* Check the console for errors of the browser’s developer tools. Some errors may cause the map not to render. Debug your application.
* Ensure you are using a [supported browser](supported-browsers.md).

**All my data is showing up on the other side of the world, what’s going on?**
Coordinates, also referred to as positions, in the Azure Maps SDKs aligns with the geospatial industry standard format of `[longitude, latitude]`. This same format is also how coordinates are defined in the GeoJSON schema; the core data formatted used within the Azure Maps SDKs. If your data is appearing on the opposite side of the world, it is most likely due to the longitude and latitude values being reversed in your coordinate/position information.

**Why are HTML markers appearing in the wrong place in the web control?**

Things to check:

* If using custom content for the marker, ensure the `anchor` and `pixelOffset` options are correct. By default, the bottom center of the content is aligned with the position on the map.
* Ensure that the CSS file for Azure Maps has been loaded.
* Inspect the HTML marker DOM element to see if any CSS from your app has appended itself to the marker and is affecting its position.

**Why are icons or text in the symbol layer appearing in the wrong place?**
Check that the `anchor` and the `offset` options are correctly configured to align with the part of your image or text that you want to have aligned with the coordinate on the map.
If the symbol is only out of place when the map is rotated, check the `rotationAlignment` option. By default, symbols we will rotate with the maps viewport so that they appear upright to the user. However, depending on your scenario, it may be desirable to lock the symbol to the map’s orientation. Set the `rotationAlignment` option to `’map’` to do this.
If the symbol is only out of place when the map is pitched/tilted, check the `pitchAlignment` option. By default, symbols we will stay upright with the maps viewport as the map is pitched or tilted. However, depending on your scenario, it may be desirable to lock the symbol to the map’s pitch. Set the `pitchAlignment` option to `’map’` to do this.

**Why isn’t any of my data appearing on the map?**

Things to check:

* Check the console in the browser’s developer tools for errors.
* Ensure that a data source has been created and added to the map, and that the data source has been connected to a rendering layer which has also been added to the map.
* Add break points in your code and step through it to ensure data is being added to the data source and the data source and layers are being added to the map without any errors occurring.
* Try removing data-driven expressions from your rendering layer. Its possible that one of them may have an error in it which is causing the issue.

**Can I use the Azure Maps Web SDK in a sandboxed iframe?**

Yes, however, note that [Safari has a bug](https://bugs.webkit.org/show_bug.cgi?id=170075) which prevents sandboxed iframes from running web workers which is requirement of the Azure Maps Web SDK. The solution is to add the `"allow-same-origin"` tag to the sandbox property of the iframe.

## Get support

The following are the different ways to get support for Azure Maps depending on your issue.

**How do I report a data issue or an issue with an address?**

Azure Maps has a data feedback tool where data issues can be reported and tracked. [https://feedback.azuremaps.com/](https://feedback.azuremaps.com/) Each issue submitted generates a unique URL you can use to track the progress of the data issue. The time it takes to resolve a data issue varies depending on the type of issue and how easy it is to verify the change is correct. Once fixed, the render service will see the update in the weekly update, while other services such as geocoding and routing will see the update in the monthly update. Detailed instructions on how to report a data issue is provided in this [document](how-to-use-feedback-tool.md).

**How do I report a bug in a service or API?**

https://azure.com/support

**Where do I get technical help for Azure Maps?**

If related to the Azure Maps visual in Power BI: https://powerbi.microsoft.com/support/
For all other Azure Maps services: https://azure.com/support
or the developer forums: https://docs.microsoft.com/answers/topics/azure-maps.html

**How do I make a feature request?**

Make a feature request on our user voice site: https://feedback.azure.com/forums/909172-azure-maps

## Next steps

See the following articles for more tips on improving the user experience in your application.

> [!div class="nextstepaction"]
> [Make your application accessible](map-accessibility.md)

Learn more about the terminology used by Azure Maps and the geospatial industry.

> [!div class="nextstepaction"]
> [Azure Maps glossary](glossary.md)
