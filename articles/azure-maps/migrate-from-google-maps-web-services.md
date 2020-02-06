---
title: 'Tutorial: Migrate web services from Google Maps | Microsoft Azure Maps'
description: How to migrate web services from Google Maps to Microsoft Azure Maps.
author: rbrundritt
ms.author: richbrun
ms.date: 12/17/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: cpendle
ms.custom: 
---

# Migrate web service from Google Maps

Azure Maps and Google Maps provide access to spatial APIs through REST web services. The API interfaces of these two platforms perform similar functionalities, but they each use different naming conventions and response objects.

The following table shows the Azure Maps service API, which provides a similar functionality to a Google Maps service API.

| Google Maps service API | Azure Maps service API                                                                      |
|-------------------------|---------------------------------------------------------------------------------------------|
| Directions              | [Route](https://docs.microsoft.com/rest/api/maps/route)                               |
| Distance Matrix         | [Route Matrix](https://docs.microsoft.com/rest/api/maps/route/postroutematrixpreview) |
| Geocoding               | [Search](https://docs.microsoft.com/rest/api/maps/search)                             |
| Places Search           | [Search](https://docs.microsoft.com/rest/api/maps/search)                             |
| Place Autocomplete      | [Search](https://docs.microsoft.com/rest/api/maps/search)                             |
| Static Map              | [Render](https://docs.microsoft.com/rest/api/maps/render/getmapimage)                 |
| Time Zone               | [Time Zone](https://docs.microsoft.com/rest/api/maps/timezone)                        |

The following service APIs aren't currently available in Azure Maps:

- Elevation
- Geolocation
- Place Details and Place Photos. Phone numbers and website URL are available in the Azure Maps search API.
- Map URLs
- Roads. Speed limit data is available through the route and reverse geocoding APIs in Azure Maps.
- Static street view

Azure Maps has several additional REST web services that may be of interest:

- [Spatial operations](https://docs.microsoft.com/rest/api/maps/spatial): Offload complex spatial calculations and operations, such as geofencing, to a service.
- [Traffic](https://docs.microsoft.com/rest/api/maps/traffic): Access real-time traffic flow and incident data.

## Geocoding addresses

Geocoding is the process of converting an address into a coordinate. For example, "1 Microsoft way, Redmond, WA" converts to "longitude: -122.1298, latitude: 47.64005". Coordinates are necessary to position a marker on a map or center a map.

Azure Maps provides several methods for geocoding addresses:

- [**Free-form address geocoding**](https://docs.microsoft.com/rest/api/maps/search/getsearchaddress): Specify a single address string and process the request immediately. A single string address is "1 Microsoft way, Redmond, WA". This method is recommended when you need to geocode individual addresses quickly.
- [**Structured address geocoding**](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressstructured): Specify the parts of a single address and process the request near real time. Parts of an address include the street name, city, country, and postal code. This method is recommended for two main scenarios. The data is already parsed as individual address parts. Or, You need to geocode individual addresses quickly.
- [**Batch address geocoding**](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressbatchpreview): Create a request containing up to 10,000 addresses and process the request over a period of time. All the addresses will be geocoded in parallel on the server. When geocoding completes, the entire set of results becomes downloadable. This method is recommended for geocoding large data sets.
- [**Fuzzy search**](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy): This API combines address geocoding with point of interest searching. This API takes in a free-form string and processes the request near real time. A free-form string can be an address, place, landmark, point of interest, or point of interest category. This API is recommended when the same textbox is used to query addresses and points of interest.
- [**Fuzzy batch search**](https://docs.microsoft.com/rest/api/maps/search/postsearchfuzzybatchpreview): Create a request containing up to 10,000 addresses and process the request over a period of time. You can request places, landmarks, or point of interests. All data will be processed on the server and in parallel. When completed the, entire set of result becomes downloadable.

The following table cross-references the Google Maps API parameters with the comparable API parameters in Azure Maps.

| Google Maps API parameter | Comparable Azure Maps API parameter  |
|---------------------------|--------------------------------------|
| `address`                   | `query`                            |
| `bounds`                    | `topLeft` and `btmRight`           |
| `components`                | `streetNumber`<br/>`streetName`<br/>`crossStreet`<br/>`postalCode`<br/>`municipality` - city / town<br/>`municipalitySubdivision` – neighborhood, sub / super city<br/>`countrySubdivision` - state or province<br/>`countrySecondarySubdivision` - county<br/>`countryTertiarySubdivision` - district<br/>`countryCode` - two letter country code |
| `key`                       | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                  | `language` – See [supported languages](supported-languages.md) documentation.  |
| `region`                    | `countrySet`                       |

An example of how to use the search service is documented [here](how-to-search-for-address.md). Be sure to review [best practices for search](how-to-use-best-practices-for-search.md).

> [!TIP]
> The free-form address geocoding and fuzzy search APIs can be used in autocomplete mode by adding `&amp;typeahead=true` to the request URL. This will tell the server that the input text is likely partial, and the search will go into predictive mode.

## Reverse geocode a coordinate

Reverse geocoding is the process of converting geographic coordinates into an approximate address. Coordinates with "longitude: -122.1298, latitude: 47.64005" convert to "1 Microsoft way, Redmond, WA".

Azure Maps provides several reverse geocoding methods:

- [**Address reverse geocoder**](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreverse): Specify a single geographic coordinate to get the approximate address corresponding for this coordinate. Process the request near real time.
- [**Cross street reverse geocoder**](https://docs.microsoft.com/rest/api/maps/search/getsearchaddressreversecrossstreet): Specify a single geographic coordinate and retrieve information about nearby cross street. Process the request near real time.
- [**Batch address reverse geocoder**](https://docs.microsoft.com/rest/api/maps/search/postsearchaddressreversebatchpreview): Create a request containing up to 10,000 coordinates and processed the request over a period of time. All the data will be processed in parallel on the server. When completed the entire set of results becomes downloadable.

The following table cross-references the Google Maps API parameters with the comparable API parameters in Azure Maps.

| Google Maps API parameter   | Comparable Azure Maps API parameter   |
|-----------------------------|---------------------------------------|
| `key`                       | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                  | `language` – See [supported languages](supported-languages.md) documentation.  |
| `latlng`                    | `query`  |
| `location_type`             | *N/A*     |
| `result_type`               | `entityType`    |

Review [best practices for search](how-to-use-best-practices-for-search.md).

The Azure Maps reverse geocoding API has some additional features, which aren't available in Google Maps. These features might be useful to integrate with your application, as you migrate your app:

- Retrieve speed limit data
- Retrieve road use information: local road, arterial, limited access, ramp, and so on
- Retrieve the side of street at which a coordinate is located

## Search for points of interest

Point of interest data can be searched in Google Maps using the Places Search API. This API provides three different ways to search for points of interest:

- **Find place from text:** Searches for a point of interest based on its name, address, or phone number.
- **Nearby Search**: Searches for points of interests that are within a certain distance of a location.
- **Text Search:** Searches for places using a free-form text, which includes point of interest and location information. For example, "pizza in New York" or "restaurants near main st".

Azure Maps provides several search APIs for points of interest:

- [**POI search**](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi): Search for points of interests by name. For example, "Starbucks".
- [**POI category search**](https://docs.microsoft.com/rest/api/maps/search/getsearchpoicategory): Search for points of interests by category. For example, "restaurant".
- [**Nearby search**](https://docs.microsoft.com/rest/api/maps/search/getsearchnearby): Searches for points of interests that are within a certain distance of a location.
- [**Fuzzy search**](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy): This API combines address geocoding with point of interest search. This API takes in a free-form string. An address, a place, a landmark, a point of interest, a point of interest category, and so on. This API can process the request near real time. This API is recommended when users search for addresses or points of interest using the same textbox.
- [**Search within geometry**](https://docs.microsoft.com/rest/api/maps/search/postsearchinsidegeometry): Search for points of interests that are within a specified geometry (polygon).
- [**Search along route**](https://docs.microsoft.com/rest/api/maps/search/postsearchalongroute): Search for points of interests that are along a specified route path.
- [**Fuzzy batch search**](https://docs.microsoft.com/rest/api/maps/search/postsearchfuzzybatchpreview): Create a request containing up to 10,000 addresses, places, landmarks, or point of interests and have them processed over a period of time. All the data will be processed in parallel on the server. When the request completes processing, download the full set of results.

Currently, Azure Maps doesn't have a comparable API to the Text Search API in Google Maps.

> [!TIP]
> The POI search API, POI category search API, and fuzzy search APIs can each be used in autocomplete mode. Add `&amp;typeahead=true` to the request URL. This will tell the server that the input text is likely partial, and the search will be completed in predictive mode.

Review [best practices for search](how-to-use-best-practices-for-search.md).

### Find place from text

Use Azure Maps the [POI search](https://docs.microsoft.com/rest/api/maps/search/getsearchpoi) API, or the [Fuzzy search](https://docs.microsoft.com/rest/api/maps/search/getsearchfuzzy) API to search for points of interests by name or by address.

The following table shows the Google Maps API parameters with the respective Azure Maps API parameters.

| Google Maps API parameter | Comparable Azure Maps API parameter |
|---------------------------|-------------------------------------|
| `fields`                  | *N/A*                               |
| `input`                   | `query`                             |
| `inputtype`               | *N/A*                               |
| `key`                     | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                | `language` – See [supported languages](supported-languages.md) documentation.  |
| `locationbias`            | `lat`, `lon` and `radius`<br/>`topLeft` and `btmRight`<br/>`countrySet`  |

### Nearby search

In Azure Maps, retrieve nearby points of interests using the [Nearby search](https://docs.microsoft.com/rest/api/maps/search/getsearchnearby) API.

The following table cross-references the Google Maps API parameters with Azure Maps API parameters.

| Google Maps API parameter | Comparable Azure Maps API parameter  |
|---------------------------|--------------------------------------|
| `key`                       | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `keyword`                   | `categorySet` and `brandSet`        |
| `language`                  | `language` – See [supported languages](supported-languages.md) documentation.  |
| `location`                  | `lat` and `lon`                     |
| `maxprice`                  | *N/A*                               |
| `minprice`                  | *N/A*                               |
| `name`                      | `categorySet` and `brandSet`        |
| `opennow`                   | *N/A*                               |
| `pagetoken`                 | `ofs` and `limit`                   |
| `radius`                    | `radius`                            |
| `rankby`                    | *N/A*                               |
| `type`                      | `categorySet –` See [supported search categories](supported-search-categories.md) documentation.   |

## Calculate routes and directions

Calculate routes and directions using Azure Maps. Azure Maps has many of the same functionalities as the Google Maps routing service, such as:

- Arrival and departure times.
- Real-time and predictive based traffic routes.
- Different modes of transportation. Such as, driving, walking, bicycling.

> [!NOTE]
> Azure Maps requires all waypoints to be coordinates. Addresses need to be geocoded first.

The Azure Maps routing service provides the following APIs for calculating routes:

- [**Calculate route**](https://docs.microsoft.com/rest/api/maps/route/getroutedirections): Calculate a route and process the request near real time. This API supports both GET and POST requests. POST requests are recommended for specifying a large number of waypoints, or using many route options. Using POST ensures that the URL request doesn’t become too long and cause issues.
- [**Batch route**](https://docs.microsoft.com/rest/api/maps/route/postroutedirectionsbatchpreview): Create a request containing up to 1,000 route request. The request processes over a period of time. All data processes in parallel on the server. Download the set as soon as the request completes and the results are ready.
- [**Mobility services**](https://docs.microsoft.com/rest/api/maps/mobility): Calculate routes and directions using public transit.

The following table cross-references the Google Maps API parameters with the comparable API parameters in Azure Maps.

| Google Maps API parameter    | Comparable Azure Maps API parameter  |
|------------------------------|--------------------------------------|
| `alternatives`                 | `maxAlternatives`                  |
| `arrival_time`                | `arriveAt`                          |
| `avoid`                        | `avoid`                            |
| `departure_time`              | `departAt`                          |
| `destination`                  | `query` – coordinates in the format `"lat0,lon0:lat1,lon1…."`  |
| `key`                          | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                     | `language` – See [supported languages](supported-languages.md) documentation.   |
| `mode`                         | `travelMode`                       |
| `optimize`                     | `computeBestOrder`                 |
| `origin`                       | `query`                            |
| `region`                       | *N/A* – This feature is geocoding related. Use the *countrySet* parameter when using the Azure Maps geocoding API.  |
| `traffic_model`               | *N/A* – Can only specify if traffic data should be used with the *traffic* parameter. |
| `transit_mode`                | See [mobility services documentation](https://docs.microsoft.com/rest/api/maps/mobility) |
| `transit_routing_preference` | See [mobility services documentation](https://docs.microsoft.com/rest/api/maps/mobility) |
| `units`                        | *N/A* – Azure Maps only uses the metric system.  |
| `waypoints`                    | `query`                            |

> [!TIP]
> By default, the Azure Maps route API only returns a summary (distance and times) and the coordinates for the route path. Use the `instructionsType` parameter to retrieve turn-by-turn instructions. Use the `routeRepresentation` parameter to filter out the summary and route path.

The Azure Maps routing API has many additional features, which aren't available in Google Maps. It might be useful to integrate these features, as you migrate your app:

- Support for route type: shortest, fastest, trilling, and most fuel efficient.
- Support for additional travel modes: bus, motorcycle, taxi, truck, and van.
- Support for 150 waypoints.
- Compute multiple travel times in a single request; historic traffic, live traffic, no traffic.
- Avoid additional road types: carpool roads, unpaved roads, already used roads.
- Specify custom areas to avoid.
- Limit the elevation, which the route may ascend.
- Route based on engine specifications. Calculate routes for combustion or electric vehicles based on engine specifications, and the remaining fuel or charge.
- Support commercial vehicle route parameters. Such as, vehicle dimensions, weight, number of axels, and cargo type.
- Specify maximum vehicle speed.

In addition to these features, the route service in Azure Maps supports [calculating routable ranges](https://docs.microsoft.com/rest/api/maps/route/getrouterange). Calculating routable ranges is also known as isochrones. It entails generating an area covered with a polygon. Then, calculating travel in any direction from an origin point. All while considering a specified amount of time, and the amount of fuel or charge.

## Retrieve a map image

Azure Maps provides an API for rendering the static map images with data overlaid. The [Map image render](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytile) API in Azure Maps is comparable to the static map API in Google Maps.

> [!NOTE]
> Azure Maps requires the center, all marker, and the path locations to be coordinates in "longitude,latitude" format. On the other hand, Google Maps uses the "latitude,longitude" format. Addresses will need to be geocoded first.

The following table shows the Google Maps API parameters with the comparable Azure Maps API parameters.

| Google Maps API parameter | Comparable Azure Maps API parameter  |
|---------------------------|--------------------------------------|
| `center`                    | `center`                           |
| `format`                    | `format` – specified as part of URL path. Currently only PNG supported. |
| `key`                       | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                  | `language` – See [supported languages](supported-languages.md) documentation.  |
| `maptype`                   | `layer` and `style` – See [Supported map styles](supported-map-styles.md) documentation. |
| `markers`                   | `pins`                             |
| `path`                      | `path`                             |
| `region`                    | *N/A* – This is a geocoding related feature. Use the `countrySet` parameter when using the Azure Maps geocoding API.  |
| `scale`                     | *N/A*                              |
| `size`                      | `width` and `height` – can be up to 8192x8192 in size. |
| `style`                     | *N/A*                              |
| `visible`                   | *N/A*                              |
| `zoom`                      | `zoom`                             |

> [!NOTE]
> Azure Maps uses a tile system with tiles that are twice the size of the map tiles used in Google Maps. As such the zoom level value appear one zoom level closer in Azure Maps compared to Google Maps. Decrement the zoom level by one, in the requests you are migrating. Decrementing the zoom level value compensates for the variation in the tile systems.

For more information, see the [How-to guide on the map image render API](how-to-render-custom-data.md).

In addition to generating a static map image, the Azure Maps render service provides the ability to directly access map tiles in raster (PNG) and vector format:

- [**Map tile**](https://docs.microsoft.com/rest/api/maps/render/getmaptile): Retrieve raster (PNG) and vector tiles for the base maps (roads, boundaries, background).
- [**Map imagery tile**](https://docs.microsoft.com/rest/api/maps/render/getmapimagerytile): Retrieve aerial and satellite imagery tiles.

> [!TIP]
> A few years ago, many Google Maps applications switched from interactive map experiences to static map images, as a cost saving method. In Azure Maps, it is often much more cost effective to use the interactive map control in the Web SDK. The service charge is based on the number of map tiles the application loads. Map tiles in Azure Maps are large. Often, it takes only a few tiles to recreate the same map view as a static map. Map tiles are cached automatically by the browser. As such, the interactive map control often generates a fraction of a transaction when reproducing a static map view. Panning and zooming will load more tiles, however there are options in the map control to disable this behavior. The interactive map control also provides a lot more visualization options than static map services.

### Marker URL parameter format comparison

**Before: Google Maps**

In Google Maps, you can add markers to a static map image using the `markers` parameter in the URL. The `markers` parameter takes in a style and a list of locations to be rendered on the map with that style as shown below:

```
&markers=markerStyles|markerLocation1|markerLocation2|...
```

Additional styles can be used by adding additional `markers` parameters
to the URL with a different style and set of locations.

Marker locations are specified with the format "latitude,longitude".

Marker styles in Google Maps are added with the format `optionName:value`, with multiple styles separated by pipe (\|) characters. Like this: "optionName1:value1\|optionName2:value2". Note the option names and values are separated with a colon (:). The following style option names can be used to style markers in Google Maps:

- `color` – The color of the default marker icon. Can be a 24-bit hex color (`0xrrggbb`) or one of the following values; `black`, `brown`, `green`, `purple`, `yellow`, `blue`, `gray`, `orange`, `red`, `white`.
- `label` – A single uppercase alphanumeric character to display on top of the icon.
- `size` - The size of the marker. Can be `tiny`, `mid`, or `small`.

Custom icons can be added in Google Maps using the following style option names:

- `anchor` – Specifies how to align the icon image to the coordinate. Can be a pixel (x,y) value or one of the following values; `top`, `bottom`, `left`, `right`, `center`, `topleft`, `topright`, `bottomleft`, or `bottomright`.
- `icon` – A URL pointing to the icon image.

For example, in Google Maps, a red, mid-sized marker can be added to the map at coordinates (longitude: -110, latitude: 45) with the following URL parameter:

```
&markers=color:red|size:mid|45,-110
```

<center>

![Google Maps marker](media/migrate-google-maps-web-services/google-maps-marker.png)</center>

**After: Azure Maps**

In Azure Maps, add markers to a static map image by specifying the `pins` parameter in the URL. Like Google Maps, specify a style and a list of locations in this parameter. Specify the `pins` parameter multiple times to support markers with different styles.

```
&pins=iconType|pinStyles||pinLocation1|pinLocation2|...
```

To use additional styles, add additional `pins` parameters to the URL with a different style and set of locations.

For the pin location, Azure Maps requires the coordinates to be in "longitude latitude" format. Google Maps uses "latitude,longitude" format. A space, not a comma, separates longitude and latitude in the Azure Maps format.

The `iconType` specifies the type of pin to create. It can have the following values:

- `default` – The default pin icon.
- `none` – No icon is displayed, only labels will be rendered.
- `custom` – Specifies a custom icon is to be used. A URL pointing to the icon image can be added to the end of the `pins` parameter after the pin location information.
- `{udid}` – A Unique Data ID (UDID) for an icon stored in the Azure
    Maps Data Storage platform.

Add pin styles in Azure Maps with the `optionNameValue` format. Separate multiple styles with the pipe (\|) characters. For example: `iconType|optionName1Value1|optionName2Value2`. The option names and values aren't separated. Use the following style option names to style markers in Azure Maps:

- `al` – Specifies the opacity (alpha) of the marker. Choose a number between 0 and 1.
- `an` – Specifies the pin anchor. X and y pixel values specified in the format "x y".
- `co` – The color of the pin. Must be a 24-bit hex color: `000000` to `FFFFFF`.
- `la` – Specifies the label anchor. X and y pixel values specified in the format "x y".
- `lc` – The color of the label. Must be a 24-bit hex color: `000000` to `FFFFFF`.
- `ls` – The size of the label in pixels. Choose a number greater than 0.
- `ro` – A value in degrees to rotate the icon. Choose a number between -360 and 360.
- `sc` – A scale value for the pin icon. Choose a number greater than 0.

Label values are specified for each pin location. This approach is more efficient than applying a single label value to all markers in the list of locations. The label value can be a string of multiple characters. Wrap the string with single quotes to ensure that it isn’t mistaken as a style or location value.

For example, in Azure Maps, adding a red (`FF0000`) default icon, with the label "Space Needle", positioned below (15 50), with icon at coordinates (longitude: -122.349300, latitude: 47.620180) is done with the following URL parameter:

```
&pins=default|coFF0000|la15 50||'Space Needle' -122.349300 47.620180
```

<center>

![Azure Maps marker](media/migrate-google-maps-web-services/azure-maps-marker.png)</center>

The following example adds three pins with the label values '1', '2', and '3':

```
&pins=default||'1'-122 45|'2'-119.5 43.2|'3'-121.67 47.12
```

<center>

![Azure Maps multiple markers](media/migrate-google-maps-web-services/azure-maps-multiple-markers.png)</center>

### Path URL parameter format comparison

**Before: Google Maps**

In Google Maps, lines and polygons can be added to a static map image using the `path` parameter in the URL. The `path` parameter takes in a style and a list of locations to be rendered on the map, as shown below:

```
&path=pathStyles|pathLocation1|pathLocation2|...
```

Additional styles can be used by adding additional `path` parameters to the URL with a different style and set of locations.

Path locations in Google Maps are specified with the format `latitude1,longitude1|latitude2,longitude2|…`. Paths can be encoded or contain addresses for points.

Path styles in Google Maps are added with the format `optionName:value`, with multiple styles separated by pipe (\|) characters. Like this: `optionName1:value1|optionName2:value2`. Note the option names and values are separated with a colon (:). The following style option names can be used to style paths in Google Maps:

- `color` – The color of the path or polygon outline. Can be a 24-bit hex color (`0xrrggbb`), a 32-bit hex color (`0xrrggbbbaa`) or one of the following values: black, brown, green, purple, yellow, blue, gray, orange, red, white.
- `fillColor` – The color to fill the path area with (polygon). Can be a 24-bit hex color (`0xrrggbb`), a 32-bit hex color (`0xrrggbbbaa`) or one of the following values: black, brown, green, purple, yellow, blue, gray, orange, red, white.
- `geodesic` – Indicates if the path should be a line that follows the curvature of the earth.
- `weight` – The thickness of the path line in pixels.

In Google Maps, a red line opacity and pixel thickness can be added to the map between the coordinates, in the URL parameter. For the example below, the line has a 50% opacity and a thickness of four pixels. The coordinates are longitude: -110, latitude: 45 and longitude: -100, latitude: 50.

```
&path=color:0xFF000088|weight:4|45,-110|50,-100
```

<center>

![Google Maps polyline](media/migrate-google-maps-web-services/google-maps-polyline.png)</center>

**After: Azure Maps**

In Azure Maps, add lines and polygons to a static map image by specifying the `path` parameter in the URL. Like Google Maps, specify a style and a list of locations in this parameter. Specify the `path` parameter multiple times to render multiple circles, lines, and polygons with different styles.

```
&path=pathStyles||pathLocation1|pathLocation2|...
```

When it comes to path locations, Azure Maps requires the coordinates to be in "longitude latitude" format. Google Maps uses "latitude,longitude" format. A space, not a comma, separates longitude and latitude in the Azure Maps format. Azure Maps doesn't support encoded paths or addresses for points. Upload larger data sets as a GeoJSON fills into the Azure Maps Data Storage API as documented [here](how-to-render-custom-data.md#get-data-from-azure-maps-data-storage).

In Azure Maps, add path styles with the `optionNameValue` format. Separate multiple styles by pipe (\|) characters like this `optionName1Value1|optionName2Value2`. The option names and values aren't separated. Use the following style option names to style paths in Azure Maps:

- `fa` - The fill color opacity (alpha) used when rendering polygons. Choose a number between 0 and 1.
- `fc` - The fill color used to render the area of a polygon.
- `la` – The line color opacity (alpha) used when rendering lines and the outline of polygons. Choose a number between 0 and 1.
- `lc` – The line color used to render lines and the outline of polygons.
- `lw` – The width of the line in pixels.
- `ra` – Specifies a circles radius in meters.

In Azure Maps, add a red line opacity and pixel thickness between the coordinates, in the URL parameter. For the example below, the line has 50% opacity and a thickness of four pixels. The coordinates have the following values: longitude: -110, latitude: 45 and longitude: -100, latitude: 50.

```
&path=lcFF0000|la.5|lw4||-110 45|-100 50
```

<center>

![Azure Maps polyline](media/migrate-google-maps-web-services/azure-maps-polyline.png)</center>

## Calculate a distance matrix

Azure Maps provides the distance matrix API. Use this API to calculate the travel times and the distances between a set of locations, with a distance matrix. It's comparable to the distance matrix API in Google Maps.

- [**Route matrix**](https://docs.microsoft.com/rest/api/maps/route/postroutematrixpreview): Asynchronously calculates travel times and distances for a set of origins and destinations. Supports up to 700 cells per request (the number of origins multiplied by the number of destinations. With that constraint in mind, examples of possible matrix dimensions are: 700x1, 50x10, 10x10, 28x25, 10x70.

> [!NOTE]
> A request to the distance matrix API can only be made using a POST request with the origin and destination information in the body of the request. Additionally, Azure Maps requires all origins and destinations to be coordinates. Addresses will need to be geocoded first.

The following table cross-references the Google Maps API parameters with the comparable Azure Maps API parameters.

| Google Maps API parameter      | Comparable Azure Maps API parameter  |
|--------------------------------|--------------------------------------|
| `arrivial_time`                | `arriveAt`                           |
| `avoid`                        | `avoid`                              |
| `depature_time`                | `departAt`                           |
| `destinations`                 | `destination` – specify in the POST request body as GeoJSON. |
| `key`                          | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation. |
| `language`                     | `language` – See [supported languages](supported-languages.md) documentation.  |
| `mode`                         | `travelMode`                         |
| `origins`                      | `origins` – specify in the POST request body as GeoJSON.  |
| `region`                       | *N/A* – This feature is geocoding related. Use the `countrySet` parameter when using the Azure Maps geocoding API. |
| `traffic_model`                | *N/A* – Can only specify if traffic data should be used with the `traffic` parameter. |
| `transit_mode`                 | *N/A* - Transit-based distance matrices aren't currently supported.  |
| `transit_routing_preference`   | *N/A* - Transit-based distance matrices aren't currently supported.  |
| `units`                        | *N/A* – Azure Maps only uses the metric system. |

> [!TIP]
> All the advanced routing options available in the Azure Maps routing API are supported in the Azure Maps distance matrix API. Advanced routing options include: ruck routing, engine specifications, and so on.

## Get a time zone

Azure Maps provides an API for retrieving the time zone of a coordinate. The Azure Maps time zone API is comparable to the time zone API in Google Maps:

- [**Time zone by coordinate**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezonebycoordinates): Specify a coordinate and receive the time zone details of the coordinate.

The following table cross-references the Google Maps API parameters with the comparable API parameters in Azure Maps.

| Google Maps API parameter | Comparable Azure Maps API parameter   |
|---------------------------|---------------------------------------|
| `key`                       | `subscription-key` – See also the [Authentication with Azure Maps](azure-maps-authentication.md) documentation.       |
| `language`                  | `language` – See [supported languages](supported-languages.md) documentation.    |
| `location`                  | `query`             |
| `timestamp`                 | `timeStamp`         |

In addition to this API, the Azure Maps platform provides a number of time zone APIs. These APIs convert the time based on the names or the IDs of the time zone:

- [**Time zone by ID**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezonebyid): Returns current, historical, and future time zone information for the specified IANA time zone ID.
- [**Time zone Enum IANA**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezoneenumiana): Returns a full list of IANA time zone IDs. Updates to the IANA service are reflected in the system within one day.
- [**Time zone Enum Windows**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezoneenumwindows): Returns a full list of Windows Time Zone IDs.
- [**Time zone IANA version**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezoneianaversion): Returns the current IANA version number used by Azure Maps.
- [**Time zone Windows to IANA**](https://docs.microsoft.com/rest/api/maps/timezone/gettimezonewindowstoiana): Returns a corresponding IANA ID, given a valid Windows Time Zone ID. Multiple IANA IDs may be returned for a single Windows ID.

## Client libraries

Azure Maps provides client libraries for the following programming languages:

- JavaScript, TypeScript, Node.js – [documentation](how-to-use-services-module.md) \| [NPM package](https://www.npmjs.com/package/azure-maps-rest)

Open-source client libraries for other programming languages:

- .NET Standard 2.0 – [GitHub project](https://github.com/perfahlen/AzureMapsRestServices) \| [NuGet package](https://www.nuget.org/packages/AzureMapsRestToolkit/)

## Additional resources

The following are some additional documentation and resources for the Azure Maps REST services.

- [Best practices for search](how-to-use-best-practices-for-search.md)
- [Search for an address](how-to-search-for-address.md)
- [Azure Maps REST Service API reference documentation](https://docs.microsoft.com/rest/api/maps/)

## Next steps

Learn more about the Azure Maps REST services.

> [!div class="nextstepaction"]
> [Best practices for using the search service](how-to-use-best-practices-for-search.md)

> [!div class="nextstepaction"]
> [How to use the services module (Web SDK)](how-to-use-services-module.md)

> [!div class="nextstepaction"]
> [Code samples](https://docs.microsoft.com/samples/browse/?products=azure-maps)