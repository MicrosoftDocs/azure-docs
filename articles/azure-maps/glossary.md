---
title: Azure Maps glossary
description: A glossary of terms associated with Azure Maps, location-based services, and geographic information systems.
author: faterceros
ms.author: aterceros
ms.date: 10/05/2026
ms.topic: glossary
ms.service: azure-maps
ms.subservice: general
---

# Glossary

The following list describes common words used with the Azure Maps services.

## A

<!-- Update this definition and add a direct link after Task 39905584 is completed: https://msazure.visualstudio.com/One/_workitems/edit/39905584 -->

<a name="address-validation"></a> **Address validation**: The process of verifying the existence of an address.

<a name="advanced-routing"></a> **Advanced routing**: Routing capabilities that support complex route analysis and planning scenarios, such as calculating reachable ranges (isochrones), generating route matrices, and processing route requests in batches. These capabilities help applications evaluate travel times, distances, accessibility, and logistics at scale. For more information, see [Best practices for Azure Maps Route service].

<a name="aerial-imagery"></a> **Aerial imagery**: Imagery of Earth's surface captured from an aircraft or another airborne platform. The Azure Maps satellite map style combines aerial and [satellite imagery]. For more information, see [Supported map styles].

<a name="along-a-route-search"></a> **Along a route search**: A Search v1 spatial query that finds points of interest within a specified detour time or distance from a route path. For more information, see [Search v1 - Post Search Along Route]. See also [Find along route].

<a name="altitude"></a> **Altitude**: The vertical distance of a point above a reference surface, such as mean sea level. Altitude measurements are defined relative to a specified vertical datum. See also [Elevation].

<a name="ambiguous"></a> **Ambiguous**: A condition in which a value, query, or geographic reference can be interpreted in more than one valid way, resulting in multiple possible matches. For example, the geocoding query "CA" may refer to either Canada or California.

<a name="annotation"></a> **Annotation**: Text, symbols, or graphics displayed on a map to convey information about geographic features, locations, or the map itself. Annotations can identify, describe, label, or provide context for map features.

<a name="antimeridian"></a> **Antimeridian**: The meridian at 180° longitude, opposite the prime meridian, where -180° and 180° longitude meet. The International Date Line generally follows the antimeridian but deviates around some countries/regions and territories.

<a name="api-key"></a> **API key**: See [Subscription key].

<a name="application-programming-interface-api"></a> **Application programming interface (API)**: A set of rules and endpoints that enables software applications to communicate and exchange data or functionality. Azure Maps provides REST APIs and client SDKs for accessing its geospatial capabilities. For more information, see [Azure Maps REST API] and [Azure Maps Web SDK].

<a name="area-of-interest-aoi"></a> **Area of interest (AOI)**: A geographic area selected as the focus of a map, analysis, search, or data-processing operation. An AOI is typically defined by a geographic boundary, such as a bounding box or polygon. See also [Bounding box], [Point of interest (POI)], and [Polygon].

<a name="asset-tracking"></a> **Asset tracking**: The process of monitoring the location and movement of assets, such as vehicles, equipment, shipments, or people, over time.

<a name="asynchronous-request"></a> **Asynchronous request**: An HTTP request for a long-running operation that initially returns an identifier. The client uses the identifier to check the operation status and retrieve the result when processing is complete.

<a name="attribution"></a> **Attribution**: Copyright, licensing, and data-provider information that you must display when using Azure Maps rendered maps, tiles, or other map data. For more information, see [Show the correct copyright attribution].

<a name="autocomplete"></a> **Autocomplete**: A search experience that returns address and place suggestions, including points of interest (POIs), that match a query prefix as a user types. For more information, see [Search - Get Geocode Autocomplete].

<a name="autosuggest"></a> **Autosuggest**: A term commonly used to describe type-ahead search suggestions that appear as a user types. In Azure Maps, this functionality is provided by Geocode Autocomplete. For more information, see [Search - Get Geocode Autocomplete].

<a name="azure-maps-account"></a> **Azure Maps account**: An Azure resource that provides access to Azure Maps services and manages authentication, networking, security, and usage settings. For more information, see [Manage an Azure Maps account].

<a name="azure-maps-key"></a> **Azure Maps key**: See [Subscription key].

<a name="azure-maps-services"></a> **Azure Maps services**: Cloud-based geospatial capabilities provided by Azure Maps, including the [Geolocation service], [Render service], [Route service], [Search service], [Timezone service], [Traffic service], and [Weather service]. For more information, see [Azure Maps REST API].

<a name="azure-role-based-access-control"></a> **Azure role-based access control (Azure RBAC)**: An authorization system that assigns permissions to identities at a defined scope, such as a subscription, resource group, or resource. Azure Maps uses Azure RBAC with Microsoft Entra authentication and shared access signature (SAS) tokens. For more information, see [Authentication with Azure Maps].

## B

<a name="base-map"></a> **Base map**: The background map that provides geographic reference information, such as roads, landmarks, political boundaries, and terrain features. You can display data and operational layers on top of the base map. For available Azure Maps base-map options, see [Supported map styles].

<a name="batch-request"></a> **Batch request**: A request that submits multiple search, routing, or other operations in a single call for processing together. This request reduces the number of individual HTTP requests required. You can process large batch requests asynchronously. See also [Asynchronous request].

<a name="bearing"></a> **Bearing**: The horizontal direction from one point to another. It's expressed as an angle measured clockwise from north, ranging from 0° to 360°.

<a name="boundary"></a> **Boundary**: A line or polygon separating adjacent political entities, such as countries/regions, districts, and properties. A boundary is a line that may or may not follow physical features, such as rivers, mountains, or walls.

<a name="bounding-box"></a> **Bounding box**: A set of coordinates used to represent a rectangular area on the map.

<a name="bounds"></a> **Bounds**: See [Bounding box].

<a name="bubble-layer"></a> **Bubble layer**: A Web SDK layer that renders point features as circles with a fixed pixel radius. For more information, see [Add a bubble layer to a map].

## C

<a name="cadastre"></a> **Cadastre**: A record of registered land and properties. See also [Parcel].

<a name="camera"></a> **Camera**: In an interactive map control, the camera defines the map view by specifying properties such as the center position, [zoom level], [pitch], and [bearing]. For more information, see [Use the Azure Maps map control].

<a name="centroid"></a> **Centroid**: The geometric center of a feature. The centroid of a line would be the midpoint while the centroid of a polygon would be its center of area.

<a name="choropleth-map"></a> **Choropleth map**: A map that shades or colors geographic areas according to an associated statistical value. For example, a choropleth map can color each US state according to its population.

<a name="clustering"></a> **Clustering**: The process of grouping nearby point features into clusters as the map zoom level changes. Clustering can improve rendering performance and make dense point data easier to visualize and interpret. For more information, see [Cluster point data in the Web SDK].

<a name="concave-hull"></a> **Concave hull**: A shape that represents a possible concave geometry that encloses all shapes in the specified data set. The generated shape is similar to wrapping the data with plastic wrap and then heating it, thus causing large spans between points to cave in towards other data points.

<a name="consumption-model"></a> **Consumption model**: Information that defines the rate at which a vehicle consumes fuel or electricity. Also see the [consumption model documentation].

<a name="contour-line"></a> **Contour line**: A line that connects locations of equal elevation. Contour lines represent the shape and steepness of terrain and can be generated from digital elevation model (DEM) data. For more information, see [Create elevation data and services].

<a name="control"></a> **Control**: A reusable user interface component that provides specific functionality and supports user interactions. For example, the Azure Maps map control displays a map and enables users to interact with it.

<a name="convex-hull"></a> **Convex hull**: The smallest convex geometry that completely encloses a set of spatial features. A convex hull can be visualized as the shape formed by stretching an elastic band around the outermost features. See also [Concave hull].

<a name="coordinate"></a> **Coordinate**: A set of longitude and latitude values used to represent a location on a map.

<a name="coordinate-reference-system-crs"></a> **Coordinate reference system (CRS)**: A coordinate system combined with a datum and parameters that define how coordinate values relate to locations on Earth. Azure Maps uses [EPSG:3857] for map rendering and accepts [WGS 84] longitude and latitude coordinates for input geometry.

<a name="coordinate-system"></a> **Coordinate system**: A reference framework that defines how coordinates represent locations in two-dimensional or three-dimensional space.

<a name="iso-3166-1-identifier"></a><a name="country-code"></a> **`countryCode`**: An Azure Maps property that contains an ISO 3166-1 identifier. Alpha-2 codes contain two letters, such as `US`, while alpha-3 codes contain three letters, such as `USA`.

<a name="country-secondary-subdivision"></a> **`countrySecondarySubdivision`**: An Azure Maps property for a second-level administrative division, such as a county or district.

<a name="country-subdivision"></a> **`countrySubdivision`**: An Azure Maps property for a first-level administrative division, such as a state, province, or territory.

<a name="country-tertiary-subdivision"></a> **`countryTertiarySubdivision`**: An Azure Maps property for a third-level administrative division, such as a municipality or ward.

<a name="cross-street"></a> **Cross street**: A point where two or more streets intersect.

<a name="cross-origin-resource-sharing-cors"></a> **Cross-Origin Resource Sharing (CORS)**: A browser security mechanism that controls which web application origins are allowed to access an Azure Maps account from client-side code. For more information, see [Authentication best practices].

<a name="cylindrical-projection"></a> **Cylindrical projection**: A projection that transforms points from a spheroid or sphere onto a tangent or secant cylinder. The cylinder is then sliced from top to bottom and flattened into a plane.

## D

<a name="data-residency"></a> **Data residency**: The geographic location where customer data is processed and stored. In Azure Maps, an account's selected geographic region determines its geographic scope. For more information, see [Azure Maps service geographic scope].

<a name="data-source"></a> **Data source**: A Web SDK component that stores and manages spatial data for querying and rendering on a map. Data sources provide data to map layers and can support clustering. For more information, see [Create a data source].

<a name="datum"></a> **Datum**: A reference that defines how coordinates or elevations relate to locations on Earth. A horizontal datum defines positions on Earth's surface, while a vertical datum defines heights or depths relative to a reference surface.

<a name="dbf-file"></a> **DBF file**: A dBASE table file used in a shapefile dataset to store attribute data for geographic features. For more information, see [Read and write spatial data].

<a name="degree-minutes-seconds-dms"></a> **Degrees, minutes, seconds (DMS)**: A format for expressing latitude and longitude coordinates. A full circle contains 360 degrees (°). Each degree is divided into 60 angular minutes (′), and each angular minute is divided into 60 angular seconds (″).

<a name="delaunay-triangulation"></a> **Delaunay triangulation**: A technique for creating a mesh of contiguous, nonoverlapping triangles from a dataset of points. Each triangle's circumscribing circle contains no points from the dataset in its interior.

<a name="destination"></a> **Destination**: An end point or location in which someone is traveling to.

<a name="digital-elevation-model-dem"></a> **Digital elevation model (DEM)**: A raster dataset of elevation values sampled at regular intervals across an area relative to a common datum. DEMs are used to create terrain surfaces, contour lines, and other elevation-based visualizations. For more information, see [Create elevation data and services].

<a name="dijkstra's-algorithm"></a> **Dijkstra's algorithm**: An algorithm that examines the connectivity of a network to find the shortest path between two points.

<a name="distance-matrix"></a> **Distance matrix**: See [Route matrix].

## E

<a name="elevation"></a> **Elevation**: The vertical distance of a location above or below a reference surface or datum, commonly mean sea level. Elevation typically refers to the height of Earth's surface relative to that reference. For more information, see [Create elevation data and services]. See also [Altitude].

<a name="entity-type"></a> **Entity type**: A Search service value that identifies the kind or geographic level of a result, such as an address, municipality, or country/region subdivision. Applications can use entity types to determine whether a result is appropriate for the search scenario. For more information, see [Best practices for Azure Maps Search service].

<a name="envelope"></a> **Envelope**: See [Bounding box].

<a name="estimated-arrival-time-eta"></a> **Estimated arrival time (ETA)**: The predicted time at which a traveler or vehicle reaches a destination. Azure Maps route calculations can account for current and historical traffic when calculating an ETA.

<a name="extended-postal-code"></a> **Extended postal code**: A postal code that may include more information. For example, in the USA, zip codes have five digits. But, an extended zip code, known as zip+4, includes four more digits. These digits are used to identify a geographic segment within the five-digit delivery area, such as a city block, a group of apartments, or a post office box. Knowing the geographic segment aids in efficient mail sorting and delivery.

<a name="extent"></a> **Extent**: See [Bounding box].

## F

<a name="feature"></a> **Feature**: A GeoJSON object that combines a geometry with properties that describe the geographic feature it represents.

<a name="feature-collection"></a> **Feature collection**: A GeoJSON object that contains an array of feature objects.

<a name="feature-state"></a> **Feature state**: Mutable state associated with a rendered map feature that you can use to change its styling without modifying the source data. Feature state commonly supports interactions such as selection, hovering, and highlighting.

<a name="find-along-route"></a> **Find along route**: See [Along a route search].

<a name="find-nearby"></a> **Find nearby**: See [Nearby search].

<a name="fleet-management"></a> **Fleet management**: The management of commercial vehicles such as cars, trucks, ships, and planes. Fleet management can include a range of functions, such as vehicle financing, maintenance, telematics (tracking and diagnostics) as well as driver, speed, fuel, and health and safety management. Fleet Management is a process used by companies who rely on transportation in their business. The companies want to minimize the risks and reduce their overall transportation and staff costs, while ensuring compliance with government legislation.

<a name="free-flow-speed"></a> **Free flow speed**: The free flow speed expected under ideal conditions. Usually the speed limit.

<a name="free-form-address"></a> **Free-form address**: An address represented as a single unstructured line of text.

<a name="fuzzy-search"></a> **Fuzzy search**: A legacy Search v1 operation that accepted a free-form address or point-of-interest query and could also provide type-ahead results. For new development, use the intent-specific Search APIs. For more information, see [Migrate Azure Maps Search 1.0 APIs].

## G

<a name="geobias"></a> **Geobias**: A geographic location used to influence the ranking of search results based on proximity. You typically specify a geobias by coordinates and it can include a radius that defines its area of influence.

<a name="geocode"></a> **Geocode**: The geographic coordinate produced by geocoding an address, place, or other location description. See also [Geocoding].

<a name="geocoding"></a> **Geocoding**: The process of converting an address, place, or other location description into geographic coordinates. See also [Geocode]. For more information, see [Search - Get Geocoding].

<a name="geocoding-confidence"></a> **Geocoding confidence**: A Search service value that indicates the confidence level of a geocoding result. Applications should evaluate this value together with [Match code] and [Entity type] values to assess the result's quality and suitability. For more information, see [Best practices for Azure Maps Search service].

<a name="geodesic-path"></a> **Geodesic path**: The shortest path between two points on a curved surface. When rendered on Azure Maps this path appears as a curved line due to the Mercator projection.

<a name="geofence"></a> **Geofence**: A defined geographic region used to determine when a device enters or exits the region. For an Azure Maps geofence event scenario, see [React to Azure Maps events by using Event Grid].

<a name="geographic-scope"></a> **Geographic scope**: The Azure geography in which Azure Maps request data is processed and stored. You can use geographic endpoints to constrain processing and storage to supported geographic areas to meet data residency requirements. See also [Data residency]. For more information, see [Azure Maps service geographic scope].

<a name="geojson"></a> **GeoJSON**: A JSON-based format for representing geographic vector data, including points, lines, polygons, and collections of geographic features. For information about the Azure Maps extensions to GeoJSON, see [Extended GeoJSON].

<a name="geolocation-service"></a> **Geolocation service**: An Azure Maps service that determines the geographic entity associated with a specified IP address and returns its two-letter ISO 3166-1 alpha-2 code. See also [ISO 3166-1 code]. For more information, see [Azure Maps Geolocation service].

<a name="geometry"></a> **Geometry**: A spatial object that defines the shape and location of a geographic feature. Common geometry types include points, lines, and polygons.

<a name="geometrycollection"></a> **GeometryCollection**: A GeoJSON geometry that contains an array of geometry objects, which can be of different types, such as Point, LineString, and Polygon.

<a name="geopol"></a> **GeoPol**: See [Regional view].

<a name="georeference"></a> **Georeference**: The process of aligning geographic data or imagery to a known coordinate system. This process may consist of shifting, rotating, scaling, or skewing the data.

<a name="georss"></a> **GeoRSS**: An XML extension for adding spatial data to RSS feeds.

<a name="gis"></a> **GIS (Geographic Information System)**: A system for collecting, managing, analyzing, and visualizing geographic and spatial data.

<a name="global-data-processing-consent"></a> **Global data processing consent**: Customer authorization that allows Azure Maps to process specified search requests outside the account's selected geographic scope when required to return search results. See also [Geographic scope] and [Data residency]. For more information, see [Consent management].

<a name="gml"></a> **GML** (Geography Markup Language): An XML file extension for storing spatial data.

<a name="gps"></a> **GPS** (Global Positioning System): A satellite-based system used to determine a device's position on Earth. Orbiting satellites transmit signals that allow a GPS receiver to calculate its location through trilateration.

<a name="gpx"></a> **GPX** (GPS Exchange Format):An XML-based file format for storing and exchanging GPS data, including waypoints, routes, and tracks. For information about using GPX and other spatial file formats with Azure Maps, see [Read and write spatial data].

<a name="great-circle-distance"></a> **Great-circle distance**: The shortest distance between two points on the surface of a sphere.

<a name="greenwich-mean-time-gmt"></a> **Greenwich Mean Time (GMT)**: The time at the prime meridian, which runs through the Royal Observatory in Greenwich, England.

## H

<a name="haversine-formula"></a> **Haversine formula**: A common equation used for calculating the great-circle distance between two points on a sphere.

<a name="heading"></a> **Heading**: The direction something is pointing or facing. See also [Bearing].

<a name="heatmap"></a> **Heat map**: A data visualization in which a range of colors represents the density of points in an area. For more information, see [Add a heat map layer to a map].

<a name="hybrid-imagery"></a> **Hybrid imagery**: The Azure Maps `satellite_road_labels` map style, which overlays roads and labels on satellite and aerial imagery. For more information, see [Supported map styles].

## I

<a name="iana"></a> **IANA (Internet Assigned Numbers Authority)**: The organization that coordinates internet identifier systems and maintains the IANA Time Zone Database. The [Azure Maps Timezone service] uses IANA time zone IDs for time zone queries and conversions.

<a name="image-layer"></a> **Image layer**: An Azure Maps Web SDK layer that displays an image over a specified geographic area by positioning its corners at defined coordinates. For more information, see [Add an image layer to a map].

<a name="isochrone"></a> **Isochrone**: A geographic area representing all locations that you can reach from an origin within a specified travel time by using a particular mode of transportation. For more information, see [Route - Post Route Range]. See also [Reachable range].

<a name="isodistance"></a> **Isodistance**: A geographic area representing all locations that you can reach from an origin within a specified travel distance by using a particular mode of transportation. For more information, see [Route - Post Route Range]. See also [Reachable range].

## K

<a name="kml"></a> **KML** (Keyhole Markup Language): An XML-based format for representing geographic data and map content, including points, lines, polygons, styles, and overlays. For information about using KML and other spatial file formats with Azure Maps, see [Read and write spatial data].

## L

<a name="latitude"></a> **Latitude**: The angular distance measured in degrees from equator in a north or south direction.

<a name="layer"></a> **Layer**: A Web SDK component that determines how data from a data source is rendered on a map. Common layer types include bubble, heat map, line, polygon, symbol, tile, and WebGL layers. For more information, see [Create a data source].

<a name="level-of-detail"></a> **Level of detail (LOD)**: A measure of the amount of geographic detail displayed at a given zoom level. In Azure Maps, level of detail generally corresponds to the map's [zoom level].

<a name="lidar"></a> **Lidar (Light Detection and Ranging)**: A remote-sensing technology that uses laser pulses to measure distances to surfaces and generate highly accurate elevation and terrain data.

<a name="line-layer"></a> **Line layer**: A Web SDK layer that renders LineString and MultiLineString features as paths on a map. For more information, see [Add a line layer to a map].

<a name="linear-interpolation"></a> **Linear interpolation**: A method for estimating an unknown value between two known values by assuming a straight-line relationship between them.

<a name="linestring"></a> **LineString**: A GeoJSON geometry that represents a line. Also known as a polyline.

<a name="localization"></a> **Localization**: Support for displaying Azure Maps data in different languages and regional views. For more information, see [Localization support in Azure Maps].

<a name="logistics"></a> **Logistics**: The process of moving people, vehicles, supplies, or assets in a coordinated way.

<a name="longitude"></a> **Longitude**: The angular distance measured in degrees from the prime meridian in an east or west direction.

## M

<a name="managed-identity"></a> **Managed identity**: An automatically managed identity in Microsoft Entra ID that an Azure resource can use to authenticate to Azure Maps without storing application credentials. For more information, see [Authentication with Azure Maps].

<a name="map-control"></a> **Map Control**: The core client-side component of the Azure Maps Web SDK that displays an interactive map and provides capabilities for navigation, visualization, user interaction, and data rendering. For more information, see [Use the Azure Maps map control].

<a name="map-style"></a> **Map style**: A configuration that defines the visual appearance of a base map, including colors, labels, and displayed features. For more information, see [Supported map styles].

<a name="map-tile"></a> **Map tile**: A rectangular section of map content in raster or vector format. For more information, see [Zoom levels and tile grid]. For API details, see [Render - Get Map Tile].

<a name="marker"></a> **Marker**: Also called a pin or pushpin, a visual element placed at a geographic coordinate to represent a location on a map. For Azure Maps marker and symbol-layer options, see [Add a symbol layer to a map].

<a name="match-code"></a> **Match code**: A Search service value that indicates how a geocoding result was derived from the input query. Values can indicate a good match, an ambiguous match, or a fallback to a broader geographic level. See also [Geocoding confidence] and [Entity type]. For more information, see [Best practices for Azure Maps Search service].

<a name="mercator-projection"></a> **Mercator projection**: A cylindrical map projection that became the standard map projection for nautical purposes because of its ability to represent lines of constant course, known as rhumb lines, as straight segments that conserve the angles with the meridians. All flat map projections distort the shapes or sizes of the map when compared to the true layout of the Earth's surface. The Mercator projection exaggerates areas far from the equator, such that smaller areas appear larger on the map as you approach the poles.

<a name="azure-active-directory"></a> **Microsoft Entra ID**: Microsoft's cloud-based identity and access management service. Azure Maps accepts OAuth 2.0 access tokens issued by Microsoft Entra ID and supports Azure role-based access control (Azure RBAC) for fine-grained access to Azure Maps resources. For more information, see [Authentication with Azure Maps] and [Manage authentication in Azure Maps].

<a name="multilinestring"></a> **MultiLineString**: A GeoJSON geometry that represents a collection of one or more LineString objects.

<a name="multipoint"></a> **MultiPoint**: A GeoJSON geometry that represents a collection of point locations.

<a name="multipolygon"></a> **MultiPolygon**: A GeoJSON geometry that represents a collection of polygonal areas. For example, the state of Hawaii can be represented as a MultiPolygon, with each island represented as a polygon.

<a name="municipality"></a> **Municipality**: A local administrative division of a country/region, such as a city, town, or other incorporated community.

<a name="municipality-subdivision"></a> **Municipality subdivision**: A named subdivision of a municipality, such as a neighborhood, district, borough, or local area.

## N

<a name="navigation-bar"></a> **Navigation bar**: The set of controls on a map used for adjusting the zoom level, pitch, rotation, and switching the base map layer.

<a name="nearby-search"></a> **Nearby search**: A Search v1 spatial query that returns points of interest within a specified radius of a geographic coordinate. See also [Find nearby] and [Radial search]. For more information, see [Search v1 - Get Search Nearby].

<a name="neutral-ground-truth"></a> **Neutral Ground Truth (NGT)**: An Azure Maps label localization option that displays place names in official local languages and scripts when available. For geopolitically disputed borders and labels, see [Regional view]. For more information, see [Localization support in Azure Maps].

## O

<a name="oauth-2-access-token"></a> **OAuth 2.0 access token**: A security token issued by Microsoft Entra ID that a client application presents to Azure Maps to authenticate and authorize requests. For more information, see [Authentication with Azure Maps].

<a name="origin"></a> **Origin**: A start point or location in which a user is.

## P

<a name="panning"></a> **Panning**: Moving a map view in any direction to display a different geographic area without changing the zoom level.

<a name="parcel"></a> **Parcel**: A defined area of land identified by boundaries and commonly used for ownership, taxation, land management, or cadastral records. See also [Cadastre].

<a name="pitch"></a> **Pitch**: The angle of the map view relative to a straight-down view. A pitch of 0° looks directly down at the map, while higher values tilt the view toward the horizon.

<a name="pmtiles"></a> **PMTiles**: A single-file archive format for tiled vector or raster map data. Through a custom protocol, the Azure Maps Web SDK can fetch specific tiles on demand without downloading the entire archive. For more information, see [Add custom protocol PMTiles].

<a name="point"></a> **Point**: A GeoJSON geometry that represents a single geographic position defined by one coordinate.

<a name="point-of-interest-poi"></a> **Point of interest (POI)**: A named place, such as a business, landmark, or facility, that you can search for by name or category and display on a map. For more information, see [Search - Get Geocoding].

<a name="polygon"></a> **Polygon**: A GeoJSON geometry that represents an area enclosed by a closed outer boundary and, optionally, one or more inner boundaries that define holes.

<a name="polygon-layer"></a> **Polygon layer**: A Web SDK layer that renders the filled areas of Polygon and MultiPolygon features. For more information, see [Add a polygon layer to a map].

<a name="polyline"></a> **Polyline**: A geometry used to represent a line. Also known as a LineString.

<a name="position"></a> **Position**: A GeoJSON coordinate array that represents a geographic location using longitude, latitude, and an optional altitude value, in that order.

<a name="post-code"></a> **Post code**: See [Postal code].

<a name="postal-code"></a> **Postal code**: A series of letters, numbers, or both used by a postal service to identify a geographic delivery area.

<a name="primary-key"></a> **Primary key**: The first of two subscription keys generated for an Azure Maps account. See [Shared key authentication].

<a name="prime-meridian"></a> **Prime meridian**: The line at 0° longitude used as the reference for measuring longitude east and west around Earth.

<a name="private-endpoint"></a> **Private endpoint**: A network interface that assigns an Azure Maps account a private IP address in a virtual network so that service traffic can use Azure Private Link instead of the public internet. This feature is in preview. For more information, see [Use private endpoints with Azure Maps].

<a name="prj"></a> **PRJ**: A text file, commonly included with a [Shapefile (SHP)] dataset, that defines the [coordinate reference system (CRS)] of the spatial data using a Well-Known Text representation.

<a name="projection"></a> **Projection**: A projected coordinate system based on a map projection such as transverse Mercator, Albers equal area, and Robinson. Projection enables the earth's spherical surface to be represented on a two-dimensional Cartesian coordinate plane. Projected coordinate systems are sometimes referred to as map projections.

## Q

<a name="quadkey"></a> **Quadkey**: A string of digits that uniquely identifies a map tile in a quadtree tiling system. See also [Quadtree]. For more information, see [Zoom levels and tile grid].

<a name="quadtree"></a> **Quadtree**: A hierarchical data structure that recursively divides an area into four quadrants. In map tiling systems, each tile is subdivided into four tiles at the next zoom level. For more information, see [Zoom levels and tile grid].

<a name="queries-per-second-qps"></a> **Queries per second (QPS)**: The number of requests received by a service in one second. For Azure Maps service limits and throttling behavior, see [Azure Maps QPS rate limits].

## R

<a name="radial-search"></a> **Radial search**: See [Nearby search].

<a name="raster-data"></a> **Raster data**: Data stored as a grid of cells, or pixels, arranged in rows and columns. Each cell contains a value representing information such as color, elevation, or temperature. Examples include aerial photographs, satellite imagery, digital images, and scanned maps. Azure Maps can display raster imagery using image and tile layers. For more information, see [Add an image layer to a map] and [Add a tile layer to a map].

<a name="raster-layer"></a> **Raster layer**: A map layer that displays raster data, typically as a single image or a set of image tiles. See also [Raster data] and [Tile layer].

<a name="raster-tile"></a> **Raster tile**: A map tile that represents map content as an image composed of colored pixels rather than geographic features. See also [Vector tile].

<a name="rate-limiting"></a> **Rate limiting**: The enforcement of request rate limits for an Azure Maps service. Requests that exceed the applicable limit receive HTTP status code 429 (Too Many Requests). For more information, see [Azure Maps QPS rate limits].

<a name="reachable-range"></a> **Reachable range**: The area that you can reach from a location within a specified travel time or distance for a mode of transportation. For more information, see [Route - Post Route Range]. See also [Isochrone] and [Isodistance].

<a name="regional-view"></a> **Regional view**: A two-letter ISO 3166 country/region code used with the Azure Maps `view` parameter to determine how geopolitically disputed borders and place labels are returned. `Unified` is the default view, and `Auto` derives the view from the request IP address. For more information, see [Localization support in Azure Maps].

<a name="remote-sensing"></a> **Remote sensing**: The process of collecting and interpreting information about Earth's surface from a distance using sensors.

<a name="render-service"></a> **Render service**: An Azure Maps service that returns raster and vector map tiles, static map images, and attribution information. For more information, see [Azure Maps Render service].

<a name="reproject"></a> **Reproject**: See [Transformation].

<a name="requests-per-second-rps"></a> **Requests Per Second (RPS)**: See [Queries Per Second (QPS)].

<a name="rest-api"></a> **REST API**: An application programming interface that uses URLs and HTTP methods to interact with resources. For more information about available Azure Maps operations, see [Azure Maps REST API].

<a name="reverse-geocode"></a> **Reverse geocoding**: The process of converting geographic coordinates into a human-readable address or place name. For more information, see [Search - Get Reverse Geocoding].

<a name="route"></a> **Route**: A path between two or more locations that can include travel information and instructions for waypoints. For more information, see [Route - Post Route Directions].

<a name="route-matrix"></a> **Route matrix**: A table of travel times, distances, or both for each origin-destination pair in sets of origins and destinations. For more information, see [Route - Post Route Matrix].

<a name="route-service"></a> **Route service**: An Azure Maps service that calculates routes, travel times, distances, reachable ranges, and route matrices for supported travel modes. For more information, see [Azure Maps Route service].

## S

<a name="satellite-imagery"></a> **Satellite imagery**: Imagery of Earth's surface captured by satellites. Azure Maps uses a combination of satellite and aerial imagery in its satellite map style. For more information, see [Supported map styles].

<a name="search-service"></a> **Search service**: An Azure Maps service for geocoding addresses and coordinates, finding places and businesses, returning autocomplete suggestions, and retrieving administrative boundary polygons. For more information, see [Azure Maps Search service].

<a name="secondary-key"></a> **Secondary key**: The second of two subscription keys generated for an Azure Maps account. It supports key rotation without interrupting access. See [Shared key authentication].

<a name="shapefile-shp"></a> **Shapefile (SHP)**: Also called an Esri shapefile, a vector data format stored as a set of related files that describe the locations, shapes, and attributes of geographic features. For information about using shapefiles and other spatial formats with Azure Maps, see [Read and write spatial data].

<a name="shared-access-signature-sas-token"></a> **Shared access signature (SAS) token**: A time-limited JSON Web Token that is cryptographically signed by using a user-assigned managed identity associated with an Azure Maps account. Azure RBAC determines the token's permissions. For more information, see [Authentication with Azure Maps].

<a name="shared-key-authentication"></a> **Shared key authentication**: An authentication method that passes an Azure Maps account key with each request. Two keys are provided to support key rotation. Treat the keys as secrets and rotate them regularly. For more information, see [Authentication with Azure Maps] and [Manage authentication in Azure Maps].

<a name="snap-to-roads"></a> **Snap to Roads**: A Route service operation that map-matches GPS coordinates to the most likely roads in the Azure Maps road network and returns their snapped positions. For more information, see [Route - Snap to Roads].

<a name="software-development-kit-sdk"></a> **Software development kit (SDK)**: A collection of documentation, sample code, and sample apps to help a developer use an API to build apps.

<a name="spatial-query"></a> **Spatial query**: A request that finds or evaluates data based on geographic relationships or constraints, such as searching within a specified distance of a point or along a route. See also [Nearby search] and [Along a route search].

<a name="spatial-reference"></a> **Spatial reference**: See [Coordinate reference system (CRS)].

<a name="spherical-mercator-projection"></a> **Spherical Mercator projection**: See [Web Mercator].

<a name="static-map"></a> **Static map**: A server-rendered map image generated for a specified center, zoom level, size, map style, and optional overlays. Unlike an interactive map, a static map is returned as a single image. For more information, see [Render - Get Map Static Image].

<a name="style-expression"></a> **Style expression**: A Web SDK expression that dynamically controls layer styling based on feature properties, data conditions, or the current zoom level. For more information, see [Data-driven style expressions].

<a name="subscription-key"></a> **Subscription key**: One of two account keys generated for an Azure Maps account and used to authenticate requests through Shared Key authentication. See [Shared key authentication].

<a name="symbol-layer"></a> **Symbol layer**: A Web SDK layer that renders point data as icons, text labels, or both. For more information, see [Add a symbol layer to a map].

<a name="synchronous-request"></a> **Synchronous request**: An HTTP request in which the client waits for the server to complete processing and return a response as part of the same request-response exchange. See also [Asynchronous request].

## T

<a name="telematics"></a> **Telematics**: Sending, receiving, and storing information via telecommunication devices along with effecting control on remote objects.

<a name="temporal-data"></a> **Temporal data**: Data that specifically refers to times or dates. Temporal data may refer to discrete events, such as lightning strikes; moving objects, such as trains; or repeated observations, such as counts from traffic sensors.

<a name="terrain"></a> **Terrain**: An area of land having a particular characteristic, such as sandy terrain or mountainous terrain.

<a name="tile-layer"></a> **Tile layer**: A layer displayed by assembling map tiles (rectangular sections) into a continuous layer. The tiles are either raster image tiles or vector tiles. Raster tile layers are typically rendered ahead of time, and they're stored as images on a server. Raster tile layers may use a large storage space. Vector tile layers are rendered near real time within the client application. Thus, the server-side storage requirements are smaller for vector tile layers.

<a name="tileset"></a> **Tileset**: A collection of raster or vector data divided into a uniform grid of square map tiles and identified by a tileset ID. For more information, see [Render - Get Map Tile].

<a name="time-zone"></a> **Time zone**: A region of the globe that observes a uniform standard time for legal, commercial, and social purposes. Time zones tend to follow the boundaries of countries/regions and their subdivisions.

<a name="timezone-service"></a> **Timezone service**: An Azure Maps service that returns current, historical, and future time zone information for a location. For more information, see [Azure Maps Timezone service].

<a name="traffic-flow"></a> **Traffic flow**: Data that describes observed road speeds and travel times. For information about regional availability, see [Azure Maps traffic coverage].

<a name="traffic-incident"></a> **Traffic incident**: An event that affects travel on a road network, such as congestion, construction, a road closure, or a collision. For more information, see [Traffic - Get Traffic Incident].

<a name="traffic-service"></a> **Traffic service**: An Azure Maps service that provides current traffic incident data. You can visualize traffic flow by using tiles from the Render service. For more information, see [Azure Maps Traffic service].

<a name="transaction"></a> **Transaction**: A unit of Azure Maps service usage used for billing. The calculation varies by service and operation. For current service-specific calculations, see [Understanding Azure Maps Transactions].

<a name="transformation"></a> **Transformation**: The process of converting data between geographic coordinate systems. For example, data captured in the OSGB 1936 coordinate system must be transformed before it can be displayed with Azure Maps, which renders map data in [EPSG:3857].

<a name="traveling-salesman-problem-tsp"></a> **Traveling Salesman Problem (TSP)**: An optimization problem that seeks the shortest or most efficient route that visits a set of locations exactly once and returns to the starting location. You can use Azure Maps routing and route matrix capabilities as part of solutions that address TSP scenarios. For an Azure Maps optimization workflow, see [Create a multi-itinerary optimization service].

<a name="trilateration"></a> **Trilateration**: The process of determining the position of a point on the earth's surface, with respect to two other points, by measuring the distances between all three points.

<a name="turn-by-turn-navigation"></a> **Turn-by-turn navigation**: Navigation that provides step-by-step maneuver instructions, such as turns, exits, and merges, along a route. Azure Maps [Route service] responses can include the guidance instructions needed to support turn-by-turn navigation.

## U

<a name="usage-based-pricing"></a> **Usage-based pricing**: A pricing model in which charges are based on Azure Maps service usage measured as billable [transactions]. For more information, see [Azure Maps account pricing] and [Understanding Azure Maps Transactions].

## V

<a name="vector-data"></a> **Vector data**: Spatial data represented by coordinates that define geometries such as points, lines, and polygons. The Azure Maps Web SDK can render vector data from [GeoJSON] features and [vector tiles].

<a name="vector-tile"></a> **Vector tile**: A map tile that encodes geographic features as vector geometries and properties instead of a prerendered pixel image. Azure Maps uses vector tiles to deliver map content that clients render and style for the current map view. For more information, see [Render - Get Map Tile]. See also [Vector data] and [Raster tile].

<a name="vehicle-routing-problem-vrp"></a> **Vehicle Routing Problem (VRP)**: An optimization problem that determines efficient routes for a fleet of vehicles while considering constraints such as delivery time windows, vehicle capacities, and travel duration. Azure Maps routing and route matrix capabilities can be used as part of solutions that address VRP scenarios. For an Azure Maps optimization workflow, see [Create a multi-itinerary optimization service].

<a name="viewport"></a> **Viewport**: The geographic area currently visible in a map control, determined by camera settings such as the map center, zoom level, pitch, and bearing.

## W

<a name="waypoint"></a> **Waypoint**: A geographic location, typically defined by longitude and latitude coordinates, used as an origin, destination, or intermediate stop in a route. For more information, see [Route - Post Route Directions].

<a name="waypoint-optimization"></a> **Waypoint optimization**: The process of reordering a set of [waypoints] to minimize travel time, distance, or other routing costs. Depending on the objectives and constraints, waypoint optimization can be modeled as a [Traveling Salesman Problem (TSP)] or [Vehicle Routing Problem (VRP)]. For an Azure Maps optimization workflow, see [Create a multi-itinerary optimization service].

<a name="weather-service"></a> **Weather service**: An Azure Maps service that provides current, forecast, and historical weather conditions, air quality, tropical storm information, and weather along a route. For more information, see [Azure Maps Weather service].

<a name="web-map-service-wms"></a> **Web Map Service (WMS)**: An Open Geospatial Consortium (OGC) standard for retrieving georeferenced map images over the web. Azure Maps supports displaying data from WMS services through OGC map layers. For more information, see [Add an Open Geospatial Consortium map layer].

<a name="web-map-tile-service-wmts"></a> **Web Map Tile Service (WMTS)**: An Open Geospatial Consortium (OGC) standard for serving prerendered map tiles. Azure Maps can display data from WMTS services through OGC map layers. For more information, see [Add an Open Geospatial Consortium map layer].

<a name="web-mercator"></a> **Web Mercator**: A projected coordinate system based on the Mercator projection and commonly used in web mapping applications. Azure Maps accepts [WGS 84] longitude and latitude coordinates for input geometry and renders map data using Web Mercator ([EPSG:3857]), which supports the global tile system used for map display and navigation. For more information, see [Zoom levels and tile grid].

<a name="web-sdk"></a> **Web SDK**: The Azure Maps JavaScript and TypeScript libraries for adding interactive maps, data sources, layers, controls, and Azure Maps service integrations to web applications. For more information, see [Use the Azure Maps map control].

<a name="webgl-layer"></a> **WebGL layer**: A custom Web SDK layer that renders two-dimensional or three-dimensional graphics by using the browser's WebGL rendering context. For more information, see [Add a custom WebGL layer].

<a name="well-known-text-wkt"></a> **Well-Known Text (WKT)**: An Open Geospatial Consortium (OGC) text format for representing vector geometries. The Azure Maps Web SDK Spatial IO module can read and write WKT and other spatial data formats. For more information, see [Read and write spatial data].

<a name="wgs84"></a> **WGS 84**: A geodetic reference system commonly used by GPS to represent geographic coordinates as longitude and latitude. Azure Maps accepts WGS 84 coordinates for input geometry and projects them into [EPSG:3857] for map rendering. See also [Web Mercator] and [Coordinate reference system (CRS)].

## Z

<a name="z-coordinate"></a> **Z-coordinate**: See [Altitude].

<a name="zip-code"></a> **Zip code**: See [Postal code].

<a name="zoom-level"></a> **Zoom level**: A value that controls the scale and level of detail visible on a map. At zoom level 0, the entire world is visible, and higher zoom levels show progressively greater detail. Azure Maps map tiles are available at zoom levels 0 through 22, while the Web SDK supports zoom levels 0 through 24. For more information, see [Zoom levels and tile grid].

[Altitude]: #altitude
[Add a bubble layer to a map]: map-add-bubble-layer.md
[Add a custom WebGL layer]: webgl-custom-layer.md
[Add a heat map layer to a map]: map-add-heat-map-layer.md
[Add a line layer to a map]: map-add-line-layer.md
[Add a polygon layer to a map]: map-add-shape.md
[Add a symbol layer to a map]: map-add-pin.md
[Add an image layer to a map]: map-add-image-layer.md
[Add a tile layer to a map]: map-add-tile-layer.md
[Add an Open Geospatial Consortium map layer]: spatial-io-add-ogc-map-layer.md
[Add custom protocol PMTiles]: add-custom-protocol-pmtiles.md
[Along a route search]: #along-a-route-search
[Asynchronous request]: #asynchronous-request
[Authentication best practices]: authentication-best-practices.md
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Maps Geolocation service]: /rest/api/maps/geolocation
[Azure Maps account pricing]: how-to-manage-pricing-tier.md
[Azure Maps QPS rate limits]: azure-maps-qps-rate-limits.md
[Azure Maps Render service]: /rest/api/maps/render
[Azure Maps REST API]: rest-api-azure-maps.md
[Azure Maps Route service]: /rest/api/maps/route
[Azure Maps Search service]: /rest/api/maps/search
[Azure Maps service geographic scope]: geographic-scope.md
[Azure Maps Timezone service]: /rest/api/maps/timezone
[Azure Maps traffic coverage]: traffic-coverage.md
[Azure Maps Traffic service]: /rest/api/maps/traffic
[Azure Maps Weather service]: /rest/api/maps/weather
[Azure Maps Web SDK]: about-azure-maps.md#web-sdk
[Bearing]: #bearing
[Best practices for Azure Maps Route service]: how-to-use-best-practices-for-routing.md
[Best practices for Azure Maps Search service]: how-to-use-best-practices-for-search.md
[Bounding box]: #bounding-box
[Cadastre]: #cadastre
[Cluster point data in the Web SDK]: clustering-point-data-web-sdk.md
[Concave hull]: #concave-hull
[Consent management]: consent-management.md
[consumption model documentation]: consumption-model.md
[Coordinate reference system (CRS)]: #coordinate-reference-system-crs
[ISO 3166-1 code]: #iso-3166-1-identifier
[Create a data source]: create-data-source-web-sdk.md
[Create a multi-itinerary optimization service]: itinerary-optimization-service.md
[Create elevation data and services]: elevation-data-services.md
[Data-driven style expressions]: data-driven-style-expressions-web-sdk.md
[Data residency]: #data-residency
[Elevation]: #elevation
[Entity type]: #entity-type
[EPSG:3857]: https://epsg.io/3857
[Extended GeoJSON]: extend-geojson.md
[Find along route]: #find-along-route
[Find nearby]: #find-nearby
[Geocode]: #geocode
[Geocoding]: #geocoding
[Geocoding confidence]: #geocoding-confidence
[Geographic scope]: #geographic-scope
[Geolocation service]: #geolocation-service
[GeoJSON]: #geojson
[Isochrone]: #isochrone
[Isodistance]: #isodistance
[Localization support in Azure Maps]: supported-languages.md
[Manage an Azure Maps account]: how-to-manage-account-keys.md
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[Match code]: #match-code
[Migrate Azure Maps Search 1.0 APIs]: migrate-search-v1-api.md
[Nearby search]: #nearby-search
[Parcel]: #parcel
[Pitch]: #pitch
[Point of interest (POI)]: #point-of-interest-poi
[Polygon]: #polygon
[Postal code]: #postal-code
[Quadtree]: #quadtree
[Queries per second (QPS)]: #queries-per-second-qps
[Radial search]: #radial-search
[Raster data]: #raster-data
[Raster tile]: #raster-tile
[React to Azure Maps events by using Event Grid]: azure-maps-event-grid-integration.md
[Reachable range]: #reachable-range
[Read and write spatial data]: spatial-io-read-write-spatial-data.md
[Regional view]: #regional-view
[Render service]: #render-service
[Render - Get Map Static Image]: /rest/api/maps/render/get-map-static-image
[Render - Get Map Tile]: /rest/api/maps/render/get-map-tile
[Route - Post Route Directions]: /rest/api/maps/route/post-route-directions
[Route - Post Route Matrix]: /rest/api/maps/route/post-route-matrix
[Route - Post Route Range]: /rest/api/maps/route/post-route-range
[Route - Snap to Roads]: /rest/api/maps/route/post-snap-to-roads
[Route matrix]: #route-matrix
[Route service]: #route-service
[Satellite imagery]: #satellite-imagery
[Search service]: #search-service
[Search - Get Geocode Autocomplete]: /rest/api/maps/search/get-geocode-autocomplete
[Search - Get Geocoding]: /rest/api/maps/search/get-geocoding
[Search - Get Reverse Geocoding]: /rest/api/maps/search/get-reverse-geocoding
[Search v1 - Get Search Nearby]: /rest/api/maps/search/get-search-nearby?view=rest-maps-1.0&preserve-view=true
[Search v1 - Post Search Along Route]: /rest/api/maps/search/post-search-along-route?view=rest-maps-1.0&preserve-view=true
[Shapefile (SHP)]: #shapefile-shp
[Shared key authentication]: #shared-key-authentication
[Subscription key]: #subscription-key
[Show the correct copyright attribution]: how-to-show-attribution.md
[Supported map styles]: supported-map-styles.md
[Tile layer]: #tile-layer
[Timezone service]: #timezone-service
[Traffic service]: #traffic-service
[transactions]: #transaction
[Transformation]: #transformation
[Traveling Salesman Problem (TSP)]: #traveling-salesman-problem-tsp
[Traffic - Get Traffic Incident]: /rest/api/maps/traffic/get-traffic-incident
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[Use private endpoints with Azure Maps]: private-endpoints.md
[Use the Azure Maps map control]: how-to-use-map-control.md
[Vector data]: #vector-data
[Vector tile]: #vector-tile
[vector tiles]: #vector-tile
[Vehicle Routing Problem (VRP)]: #vehicle-routing-problem-vrp
[waypoints]: #waypoint
[Web Mercator]: #web-mercator
[Weather service]: #weather-service
[WGS 84]: #wgs84
[Zoom level]: #zoom-level
[Zoom levels and tile grid]: zoom-levels-and-tile-grid.md
