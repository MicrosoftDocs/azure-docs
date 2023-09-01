---
title: Azure Maps Glossary | Microsoft Docs 
description: A glossary of commonly used terms associated with Azure Maps, Location-Based Services, and GIS. 
author: eriklindeman
ms.author: eriklind
ms.date: 09/18/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Glossary

The following list describes common words used with the Azure Maps services.

## A

<a name="address-validation"></a> **Address validation**: The process of verifying the existence of an address.

<a name="advanced-routing"></a> **Advanced routing**: A collection of services that perform advance operations using road routing data; such as, calculating reachable ranges (isochrones), distance matrices, and batch route requests.

<a name="aerial-imagery"></a> **Aerial imagery**: See [Satellite imagery].

<a name="along-a-route-search"></a> **Along a route search**: A spatial query that looks for data within a specified detour time or distance from a route path.

<a name="altitude"></a> **Altitude**: The height or vertical elevation of a point above a reference surface. Altitude measurements are based on a given reference datum, such as mean sea level. See also elevation.

<a name="ambiguous"></a> **Ambiguous**: A state of uncertainty in data classification that exists when an object may appropriately be assigned two or more values for a given attribute. For example, when geocoding "CA", two ambiguous results are returned: "Canada" and "California". "CA" is a country/region and a state code, for "Canada" and "California", respectively.

<a name="annotation"></a> **Annotation**: Text or graphics displayed on the map to provide information to the user. Annotation may identify or describe a specific map entity, provide general information about an area on the map, or supply information about the map itself.

<a name="antimeridian"></a> **Antimeridian**: Or _180<sup>th</sup> Meridian_. The point where -180 degrees and 180 degrees of longitude meet, the opposite of the prime meridian on the globe.

<a name="application-programming-interface-api"></a> **Application Programming Interface (API)**: A specification that allows developers to create applications.

<a name="api-key"></a> **API key**: See [Shared key authentication].

<a name="area-of-interest-aoi"></a> **Area of Interest (AOI)**: The extent used to define a focus area for either a map or a database production.

<a name="asset-tracking"></a> **Asset tracking**: The process of tracking the location of an asset, such as a person, vehicle, or some other object.

<a name="asynchronous-request"></a> **Asynchronous request**: An HTTP request that opens a connection and makes a request to the server that returns an identifier for the asynchronous request, then closes the connection. The server continues to process the request and the user can check the status using the identifier. When the request is finished processing, the user can then download the response. This type of request is used for long running processes.

<a name="autocomplete"></a> **Autocomplete**: A feature in an application that predicts the rest of a word a user is typing.

<a name="autosuggest"></a> **Autosuggest**: A feature in an application that predicts logical possibilities for what the user is typing.

<a name="azure-location-based-services-lbs"></a> **Azure Location Based Services (LBS)**: The former name of Azure Maps when it was in preview.

<a name="azure-active-directory"></a> **Azure Active Directory (Azure AD)**: Azure AD is Microsoft's cloud-based identity and access management service. Azure Maps Azure AD integration is currently available in preview for all Azure Maps APIs. Azure AD supports Azure role-based access control (Azure RBAC) to allow fine-grained access to Azure Maps resources. To learn more about Azure Maps Azure AD integration, see [Azure Maps and Azure AD] and [Manage authentication in Azure Maps].

<a name="azure-maps-key"></a> **Azure Maps key**: See [Shared key authentication].

## B

<a name="base-map"></a> **Base map**: The part of a map application that displays background reference information such as roads, landmarks, and political boundaries.

<a name="batch-request"></a> **Batch request**: The process of combining multiple requests into a single request.

<a name="bearing"></a> **Bearing**: The horizontal direction of a point in relation to another point. This is expressed as an angle relative to north, from 0-degrees  to 360 degrees in a clockwise direction.

<a name="boundary"></a> **Boundary**: A line or polygon separating adjacent political entities, such as countries/regions, districts, and properties. A boundary is a line that may or may not follow physical features, such as rivers, mountains, or walls.

<a name="bounds"></a> **Bounds**: See [Bounding box].

<a name="bounding-box"></a> **Bounding box**: A set of coordinates used to represent a rectangular area on the map.

## C

<a name="cadastre"></a> **Cadastre**: A record of registered land and properties. See also [Parcel].

<a name="camera"></a> **Camera**: In the context of an interactive map control, a camera defines the maps field of view. The viewport of the camera is determined based on several map parameters: center, zoom level, pitch, bearing. 

<a name="centroid"></a> **Centroid**: The geometric center of a feature. The centroid of a line would be the midpoint while the centroid of a polygon would be its center of area.

<a name="choropleth-map"></a> **Choropleth map**: A thematic map in which areas are shaded in proportion to a measurement of a statistical variable. This statistical variable is displayed on the map. For example, coloring the boundary of each US state based on its relative population to all other states.

<a name="concave-hull"></a> **Concave hull**: A shape that represents a possible concave geometry that encloses all shapes in the specified data set. The generated shape is similar to wrapping the data with plastic wrap and then heating it, thus causing large spans between points to cave in towards other data points.

<a name="consumption-model"></a> **Consumption model**: Information that defines the rate at which a vehicle consumes fuel or electricity. Also see the [consumption model documentation].

<a name="control"></a> **Control**: A self-contained or reusable component consisting of a graphical user interface that defines a set of behaviors for the interface. For example, a map control, is generally the portion of the user interface that loads an interactive map.

<a name="convex-hull"></a> **Convex hull**: A convex hull is a shape that represents the minimum convex geometry that encloses all shapes in the specified data set. The generated shape is similar to wrapping an elastic band around the data set.

<a name="coordinate"></a> **Coordinate**: Consists of the longitude and latitude values used to represent a location on a map.

<a name="coordinate-system"></a> **Coordinate system**: A reference framework used to define the positions of points in space in two or three dimensions.

<a name="country-code"></a> **Country code**: A unique identifier for a country/region based on the ISO standard. ISO2 is a two-character code for a country/region (for example, US), which ISO3 represents a three-character code (for example, USA).

<a name="country-subdivision"></a> **Country subdivision**: A first-level subdivision of a country/region, commonly known as a state or province.

<a name="country-secondary-subdivision"></a> **Country secondary subdivision**: A second-level subdivision of a country/region, commonly known as a county.

<a name="country-tertiary-subdivision"></a> **Country tertiary subdivision**: A third-level subdivision of a country/region, typically a named area such as a ward.

<a name="cross-street"></a> **Cross street**: A point where two or more streets intersect.

<a name="cylindrical-projection"></a> **Cylindrical projection**: A projection that transforms points from a spheroid or sphere onto a tangent or secant cylinder. The cylinder is then sliced from top to bottom and flattened into a plane.

## D

<a name="datum"></a> **Datum**: The reference specifications of a measurement system, a system of coordinate positions on a surface (a horizontal datum) or heights above or below a surface (a vertical datum).

<a name="dbf-file"></a> **DBF file**: A database file format that is used in combination with Shapefiles (SHP).

<a name="degree-minutes-seconds-dms"></a> **Degree Minutes Seconds (DMS)**: The unit of measure for describing latitude and longitude. A degree is 1/360<sup>th</sup> of a circle. A degree is further divided into 60 minutes, and a minute is divided into 60 seconds.

<a name="delaunay-triangulation"></a> **Delaunay triangulation**: A technique for creating a mesh of contiguous, nonoverlapping triangles from a dataset of points. Each triangle's circumscribing circle contains no points from the dataset in its interior.

<a name="demographics"></a> **Demographics**: The statistical characteristics (such as age, birth rate, and income) of a human population.

<a name="destination"></a> **Destination**: An end point or location in which someone is traveling to.

<a name="digital-elevation-model-dem"></a> **Digital Elevation Model (DEM)**: A dataset of elevation values related to a surface, captured over an area in regular intervals using a common datum. DEMs are typically used to represent terrain relief.

<a name="dijkstra's-algorithm"></a> **Dijkstra's algorithm**: An algorithm that examines the connectivity of a network to find the shortest path between two points.

<a name="distance-matrix"></a> **Distance matrix**: A matrix that contains travel time and distance information between a set of origins and destinations.

## E

<a name="elevation"></a> **Elevation**: The vertical distance of a point or an object above or below a reference surface or datum. Generally, the reference surface is mean sea level. Elevation generally refers to the vertical height of land.

<a name="envelope"></a> **Envelope**: See [Bounding box].

<a name="extended-postal-code"></a> **Extended postal code**: A postal code that may include more information. For example, in the USA, zip codes have five digits. But, an extended zip code, known as zip+4, includes four more digits. These digits are used to identify a geographic segment within the five-digit delivery area, such as a city block, a group of apartments, or a post office box. Knowing the geographic segment aids in efficient mail sorting and delivery.

<a name="extent"></a> **Extent**: See [Bounding box].

## F

<a name="federated-authentication"></a> **Federated authentication**: An authentication method that allows a single logon/authentication mechanism to be used across multiple web and mobile apps.

<a name="feature"></a> **Feature**: An object that combines a geometry with metadata information.

<a name="feature-collection"></a> **Feature collection**: A collection of feature objects.

<a name="find-along-route"></a> **Find along route**: A spatial query that looks for data that is within a specified detour time or distance from a route path.

<a name="find-nearby"></a> **Find nearby**: A spatial query that searches a fixed straight-line distance (as the crow flies) from a point.

<a name="fleet-management"></a> **Fleet management**: The management of commercial vehicles such as cars, trucks, ships, and planes. Fleet management can include a range of functions, such as vehicle financing, maintenance, telematics (tracking and diagnostics) as well as driver, speed, fuel, and health and safety management. Fleet Management is a process used by companies who rely on transportation in their business. The companies want to minimize the risks and reduce their overall transportation and staff costs, while ensuring compliance with government legislation.

<a name="free-flow-speed"></a> **Free flow speed**: The free flow speed expected under ideal conditions. Usually the speed limit.

<a name="free-form-address"></a> **Free form address**: A full address that is represented as a single line of text.

<a name="fuzzy-search"></a> **Fuzzy search**: A search that takes in a free form string of text that may be an address or point of interest.

## G

<a name="geocode"></a> **Geocode**: An address or location that has been converted into a coordinate that can be used to display that location on a map.

<a name="geocoding"></a> **Geocoding**: Or _forward geocoding_, is the process of converting address of location data into coordinates.

<a name="geodesic-path"></a> **Geodesic path**: The shortest path between two points on a curved surface. When rendered on Azure Maps this path appears as a curved line due to the Mercator projection.

<a name="geofence"></a> **Geofence**: A defined geographical region that can be used to trigger events when a device enters or exists the region.

<a name="geojson"></a> **GeoJSON**: Is a common JSON-based file format used for storing geographical vector data such as points, lines, and polygons. For more information Azure Maps use of an extended version of GeoJSON, see  [Extended geojson].

<a name="geometry"></a> **Geometry**: Represents a spatial object such as a point, line, or polygon.

<a name="geometrycollection"></a> **GeometryCollection**: A collection of geometry objects.

<a name="geopol"></a> **GeoPol**: Refers to geopolitically sensitive data, such as disputed borders and place names.

<a name="georeference"></a> **Georeference**: The process of aligning geographic data or imagery to a known coordinate system. This process may consist of shifting, rotating, scaling, or skewing the data.

<a name="georss"></a> **GeoRSS**: An XML extension for adding spatial data to RSS feeds.

<a name="gis"></a> **GIS**: An acronym for "Geographic Information System". A common term used to describe the mapping industry.

<a name="gml"></a> **GML** (Geography Markup Language): An XML file extension for storing spatial data.

<a name="gps"></a> **GPS** (Global Positioning System): A system of satellites used for determining a devices position on the earth. The orbiting satellites transmit signals that allow a GPS receiver anywhere on earth to calculate its own location through trilateration.

<a name="gpx"></a> **GPX** (GPS eXchange format): An XML file format commonly created from GPS devices.  

<a name="great-circle-distance"></a> **Great-circle distance**: The shortest distance between two points on the surface of a sphere.

<a name="greenwich-mean-time-gmt"></a> **Greenwich Mean Time (GMT)**: The time at the prime meridian, which runs through the Royal Observatory in Greenwich, England.

<a name="guid"></a> **GUID** (globally unique identifier): A string used to uniquely identify an interface, class, type library, component category, or record.

## H

<a name="haversine-formula"></a> **Haversine formula**: A common equation used for calculating the great-circle distance between two points on a sphere.

<a name="hd-maps"></a> **HD maps** (High Definition Maps): consists of high fidelity road network information such as lane markings, signage, and direction lights required for autonomous driving.

<a name="heading"></a> **Heading**: The direction something is pointing or facing. See also [Bearing].

<a name="heatmap"></a> **Heatmap**: A data visualization in which a range of colors represent the density of points in a particular area. See also Thematic map.

<a name="hybrid-imagery"></a> **Hybrid imagery**: Satellite or aerial imagery that has road data and labels overlaid on top of it.

## I

<a name="iana"></a> **IANA**: An acronym for the Internet Assigned Numbers Authority. A nonprofit group that oversees global IP address allocation.

<a name="isochrone"></a> **Isochrone**: An isochrone defines the area in which someone can travel within a specified time for a mode of transportation in any direction from a given location. See also [Reachable Range].

<a name="isodistance"></a> **Isodistance**: Given a location, an isochrone defines the area in which someone can travel within a specified distance for a mode of transportation in any direction. See also [Reachable Range].

## K

<a name="kml"></a> **KML**: Also known as Keyhole Markup Language, is a common XML file format for storing geographic vector data such as points, lines, and polygons.

## L

<a name="landsat"></a> **Landsat**: Multispectral, earth-orbiting satellites developed by NASA that gather imagery of land. This imagery is used in many industries such as agriculture, forestry, and cartography.

<a name="latitude"></a> **Latitude**: The angular distance measured in degrees from equator in a north or south direction.

<a name="level-of-detail"></a> **Level of detail**: See Zoom level.

<a name="lidar"></a> **Lidar**: Acronym for light detection and ranging. A remote-sensing technique that uses lasers to measure distances to reflective surfaces.

<a name="linear-interpolation"></a> **Linear interpolation**: The estimation of an unknown value using the linear distance between known values.

<a name="linestring"></a> **LineString**: A geometry used to represent a line. Also known as a polyline.

<a name="localization"></a> **Localization**: Support for different languages and cultures.

<a name="logistics"></a> **Logistics**: The process of moving people, vehicles, supplies, or assets in a coordinated way.

<a name="longitude"></a> **Longitude**: The angular distance measured in degrees from the prime meridian in an east or west direction.

## M

<a name="map-tile"></a> **Map Tile**: A rectangular image that represents a partition of a map canvas. For more information, see [Zoom levels and tile grid].

<a name="marker"></a> **Marker**: Also called a pin or pushpin, is an icon that represents a point location on a map.

<a name="mercator-projection"></a> **Mercator projection**: A cylindrical map projection that became the standard map projection for nautical purposes because of its ability to represent lines of constant course, known as rhumb lines, as straight segments that conserve the angles with the meridians. All flat map projections distort the shapes or sizes of the map when compared to the true layout of the Earth's surface. The Mercator projection exaggerates areas far from the equator, such that smaller areas appear larger on the map as you approach the poles.

<a name="multilinestring"></a> **MultiLineString**: A geometry that represents a collection of LineString objects.

<a name="multipoint"></a> **MultiPoint**: A geometry that represents a collection of Point objects.

<a name="multipolygon"></a> **MultiPolygon**: A geometry that represents a collection of Polygon objects. For example, to show the boundary of Hawaii, each island would be outlined with a polygon. Thus, the boundary of Hawaii would thus be a MultiPolygon.

<a name="municipality"></a> **Municipality**: A city or town.

<a name="municipality-subdivision"></a> **Municipality subdivision**: A subdivision of a municipality, such as a neighborhood or local area name such as "downtown".

## N

<a name="navigation-bar"></a> **Navigation bar**: The set of controls on a map used for adjusting the zoom level, pitch, rotation, and switching the base map layer.

<a name="nearby-search"></a> **Nearby search**: A spatial query that searches a fixed straight-line distance (as the crow flies) from a point.

<a name="neutral-ground-truth"></a> **Neutral Ground Truth**: A map that renders labels in the official language of the region it represents and in local scripts if available.

## O

<a name="origin"></a> **Origin**: A start point or location in which a user is.

## P

<a name="panning"></a> **Panning**: The process of moving the map in any direction while maintaining a constant zoom level.

<a name="parcel"></a> **Parcel**: A plot of land or property boundary.

<a name="pitch"></a> **Pitch**: The amount of tilt the map has relative to the vertical where 0 is looking straight down at the map.

<a name="point"></a> **Point**: A geometry that represents a single position on the map.

<a name="points-of-interest-poi"></a> **Points of interest (POI)**: A business, landmark, or common place of interest.

<a name="polygon"></a> **Polygon**: A solid geometry that represents an area on a map.

<a name="polyline"></a> **Polyline**: A geometry used to represent a line. Also known as a LineString.

<a name="position"></a> **Position**: The longitude, latitude, and altitude (x,y,z coordinates) of a point.

<a name="post-code"></a> **Post code**: See [Postal code].

<a name="postal-code"></a> **Postal code**: A series of letters or numbers, or both, in a specific format. The postal-code is used by the postal service of a country/region to divide geographic areas into zones in order to simplify delivery of mail.

<a name="primary-key"></a> **Primary key**: The first of two subscription keys provided for Azure Maps shared key authentication. See [Shared key authentication].

<a name="prime-meridian"></a> **Prime meridian**: A line of longitude that represents 0-degrees longitude. Generally, longitude values decrease when traveling in a westerly direction until 180 degrees and increase when traveling in easterly directions to -180-degrees.

<a name="prj"></a> **PRJ**: A text file often accompanying a `Shapefile` file that contains information about the projected coordinate system the data set is in.

<a name="projection"></a> **Projection**: A projected coordinate system based on a map projection such as transverse Mercator, Albers equal area, and Robinson. Projection enables the earth's spherical surface to be represented on a two-dimensional Cartesian coordinate plane. Projected coordinate systems are sometimes referred to as map projections.

## Q

<a name="quadkey"></a> **`Quadkey`**: A base-4 address index for a tile within a `quadtree` tiling system. For more information, see [Zoom levels and tile grid].

<a name="quadtree"></a> **`Quadtree`**: A data structure in which each node has exactly four children. The tiling system used in Azure Maps uses a 'quadtree' structure such that as a user zooms in one level, each map tile breaks up into four subtiles.  For more information, see [Zoom levels and tile grid].

<a name="queries-per-second-qps"></a> **Queries Per Second (QPS)**: The number of queries or requests that can be made to a service or platform within one second.

## R

<a name="radial-search"></a> **Radial search**: A spatial query that searches a fixed straight-line distance (as the crow flies) from a point.

<a name="raster-data"></a> **Raster data**: A matrix of cells (or pixels) organized into rows and columns (or a grid) where each cell contains a value representing information, such as temperature. Raster's include digital aerial photographs, imagery from satellites, digital pictures, and scanned maps.

<a name="raster-layer"></a> **Raster layer**: A tile layer that consists of raster images.

<a name="reachable-range"></a> **Reachable range**: A reachable range defines the area in which someone can travel within a specified time or distance, for a mode of transportation to travel, in any direction from a location. See also [Isochrone] and [Isodistance].

<a name="remote-sensing"></a> **Remote sensing**: The process of collecting and interpreting sensor data from a distance.

<a name="rest-service"></a> **REST service**: The acronym REST stands for Representational State Transfer. A REST service is a URL-based web service that relies on basic web technology to communicate, the most common methods being HTTP GET and POST requests. These types of services tend to me much quicker and smaller than traditional SOAP-based services.

<a name="reverse-geocode"></a> **Reverse geocode**: The process of taking a coordinate and determining the address it represents on a map.

<a name="reproject"></a> **Reproject**: See [Transformation].

<a name="rest-service"></a> **REST service**: Acronym for Representational State Transfer. An architecture for exchanging information between peers in a decentralized, distributed environment. REST allows programs on different computers to communicate independently of an operating system or platform. A service can send a Hypertext Transfer Protocol (HTTP) request to a uniform resource locator (URL) and get back data.

<a name="route"></a> **Route**: A path between two or more locations, which may also include additional information such as instructions for waypoints along the route.

<a name="requests-per-second-rps"></a> **Requests Per Second (RPS)**: See [Queries Per Second (QPS)].

<a name="rss"></a> **RSS**: Acronym for Really Simple Syndication, Resource Description Framework (RDF) Site Summary, or Rich Site Summary, depending on the source. A simple, structured XML format for sharing content among different Web sites. RSS documents include key metadata elements such as author, date, title, a brief description, and a hypertext link. This information helps a user (or an RSS publisher service) decide what materials are worth further investigation.

## S

<a name="satellite-imagery"></a> **Satellite imagery**: Imagery captured by planes and satellites pointing straight down.

<a name="secondary-key"></a> **Secondary key**: The second of two subscriptions keys provided for Azure Maps shared key authentication. See [Shared key authentication].

<a name="shapefile-shp"></a> **Shapefile (SHP)**: Or _ESRI Shapefile_, is a vector data storage format for storing the location, shape, and attributes of geographic features. A shapefile is stored in a set of related files.

<a name="shared-key-authentication"></a> **Shared key authentication**: Shared Key authentication relies on passing Azure Maps account generated keys with each request to Azure Maps. These keys are often referred to as subscription keys. It's recommended that keys are regularly regenerated for security. Two keys are provided so that you can maintain connections using one key while regenerating the other. When you regenerate your keys, you must update any applications that access this account to use the new keys. To learn more about Azure Maps authentication, see [Azure Maps and Azure AD] and [Manage authentication in Azure Maps].

<a name="software-development-kit-sdk"></a> **Software development kit (SDK)**: A collection of documentation, sample code, and sample apps to help a developer use an API to build apps.

<a name="spherical-mercator-projection"></a> **Spherical Mercator projection**: See [Web Mercator].

<a name="spatial-query"></a> **Spatial query**: A request made to a service that performs a spatial operation. Such as a radial search, or along a route search.

<a name="spatial-reference"></a> **Spatial reference**: A coordinate-based local, regional, or global system used to precisely locate geographical entities. It defines the coordinate system used to relate map coordinates to locations in the real world. Spatial references ensure spatial data from different layers, or sources, can be integrated for accurate viewing or analysis. Azure Maps uses the [EPSG:3857] coordinate reference system and WGS 84 for input geometry data.

<a name="sql-spatial"></a> **SQL spatial**: Refers to the spatial functionality built into SQL Azure and SQL Server 2008 and above. This spatial functionality is also available as a .NET library that can be used independently of SQL Server. For more information, see [Spatial Data (SQL Server)].

<a name="subscription-key"></a> **Subscription key**: See [Shared key authentication].

<a name="synchronous-request"></a> **Synchronous request**: An HTTP request opens a connection and waits for a response. Browsers limit the number of concurrent HTTP requests that can be made from a page. If multiple long running synchronous requests are made at the same time, then this limit can be reached. Requests are delayed until one of the other requests has completed.

## T

<a name="telematics"></a> **Telematics**: Sending, receiving, and storing information via telecommunication devices along with effecting control on remote objects.

<a name="temporal-data"></a> **Temporal data**: Data that specifically refers to times or dates. Temporal data may refer to discrete events, such as lightning strikes; moving objects, such as trains; or repeated observations, such as counts from traffic sensors.

<a name="terrain"></a> **Terrain**: An area of land having a particular characteristic, such as sandy terrain or mountainous terrain.

<a name="thematic-maps"></a> **Thematic maps**: A thematic map is a simple map made to reflect a theme about a geographic area. A common scenario for this type of map is to color the administrative regions such as countries/regions based on some metric of data.

<a name="tile-layer"></a> **Tile layer**: A layer displayed by assembling map tiles (rectangular sections) into a continuous layer. The tiles are either raster image tiles or vector tiles. Raster tile layers are typically rendered ahead of time, and they're stored as images on a server. Raster tile layers may use a large storage space. Vector tile layers are rendered near real time within the client application. Thus, the server-side storage requirements are smaller for vector tile layers.

<a name="time-zone"></a> **Time zone**: A region of the globe that observes a uniform standard time for legal, commercial, and social purposes. Time zones tend to follow the boundaries of countries/regions and their subdivisions.

<a name="transaction"></a> **Transaction**: Azure Maps uses a transactional licensing model where;

- One transaction is created for every 15 map or traffic tiles requested.
- One transaction is created for each API call to one of the services in Azure Maps. Searching and routing are examples of Azure Maps service.

<a name="transformation"></a> **Transformation**: The process of converting data between different geographic coordinate systems. You may, for example, have some data that was captured in the United Kingdom and based on the OSGB 1936 geographic coordinate system. Azure Maps uses the [EPSG:3857] coordinate reference system variant of WGS84. As such to display the data correctly, it needs to have its coordinates transformed from one system to another.

<a name="traveling-salesmen-problem-tsp"></a> **Traveling Salesmen Problem (TSP)**:  A Hamiltonian circuit problem in which a salesperson must find the most efficient way to visit a series of stops, then return to the starting location.  

<a name="trilateration"></a> **Trilateration**: The process of determining the position of a point on the earth's surface, with respect to two other points, by measuring the distances between all three points.

<a name="turn-by-turn-navigation"></a> **Turn-by-turn navigation**: An application that provides route instructions for each step of a route as the users approaches the next maneuver.

## V

<a name="vector-data"></a> **Vector data**: Coordinate based data that is represented as points, lines, or polygons.

<a name="vector-tile"></a> **Vector tile**: An open data specification for storing geospatial vector data using the same tile system as the map control. See also [Tile layer].

<a name="vehicle-routing-problem-vrp"></a> **Vehicle Routing Problem (VRP)**: A class of problems, in which a set of ordered routes for a fleet of vehicles is calculated while taking into consideration as set of constraints. These constraints may include delivery time windows, multiple route capacities, and travel duration constraints.

<a name="voronoi-diagram"></a> **Voronoi diagram**: A partition of space into areas, or cells, that surrounds a set of geometric objects, usually point features. These cells, or polygons, must satisfy the criteria for Delaunay triangles. All locations within an area are closer to the object it surrounds than to any other object in the set. Voronoi diagrams are often used to delineate areas of influence around geographic features.

## W

<a name="waypoint"></a> **Waypoint**: A waypoint is a specified geographical location defined by longitude and latitude that is used for navigational purposes. Often used to represent a point in which someone navigates a route through.

<a name="waypoint-optimization"></a> **Waypoint optimization**: The process of reordering a set of waypoints to minimize the travel time or distance required to pass through all provided waypoints. Depending on the complexity of the optimization, this optimization is often referred to as the [Traveling Salesmen Problem] or [Vehicle Routing Problem].

<a name="web-map-service-wms"></a> **Web Map Service (WMS)**: WMS is an Open Geographic Consortium (OGC) standard that defines image-based map services. WMS services provide map images for specific areas within a map on demand. Images include prerendered symbology and may be rendered in one of several named styles if defined by the service.

<a name="web-mercator"></a> **Web Mercator**: Also known as Spherical Mercator projection. It's a slight variant of the Mercator projection, one used primarily in Web-based mapping programs. It uses the same formulas as the standard Mercator projection as used for small-scale maps. However, the Web Mercator uses the spherical formulas at all scales, but large-scale Mercator maps normally use the ellipsoidal form of the projection. The discrepancy is imperceptible at the global scale, but it causes maps of local areas to deviate slightly from true ellipsoidal Mercator maps, at the same scale.

<a name="wgs84"></a> **WGS84**: A set of constants used to relate spatial coordinates to locations on the surface of the map. The WGS84 datum is the standard one used by most online mapping providers and GPS devices. Azure Maps uses the [EPSG:3857] coordinate reference system variant of WGS84.

## Z

<a name="z-coordinate"></a> **Z-coordinate**: See [Altitude].

<a name="zip-code"></a> **Zip code**: See [Postal code].

<a name="Zoom level"></a> **Zoom level**: Specifies the level of detail and how much of the map is visible. When zoomed all the way to level 0, the full world map is often visible. But, the map shows limited details such as country/region names, borders, and ocean names. When zoomed in closer to level 17, the map displays an area of a few city blocks with detailed road information. In Azure Maps, the highest zoom level is 22. For more information, see the [Zoom levels and tile grid] documentation.

[Altitude]: #altitude
[Azure Maps and Azure AD]: azure-maps-authentication.md
[Bearing]: #heading
[Bounding box]: #bounding-box
[consumption model documentation]: consumption-model.md
[EPSG:3857]: https://epsg.io/3857
[Extended geojson]: extend-geojson.md
[Isochrone]: #isochrone
[Isodistance]: #isodistance
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[Parcel]: #parcel
[Postal code]: #postal-code
[Queries Per Second (QPS)]: #queries-per-second-qps
[Reachable Range]: #reachable-range
[Satellite imagery]: #satellite-imagery
[Shared key authentication]: #shared-key-authentication
[Spatial Data (SQL Server)]: /sql/relational-databases/spatial/spatial-data-sql-server
[Tile layer]: #tile-layer
[Transformation]: #transformation
[Traveling Salesmen Problem]: #traveling-salesmen-problem-tsp
[Vehicle Routing Problem]: #vehicle-routing-problem-vrp
[Web Mercator]: #web-mercator
[Zoom levels and tile grid]: zoom-levels-and-tile-grid.md
