<properties 
    pageTitle="Working with Geospatial data in Azure DocumentDB | Microsoft Azure" 
    description="Understand how to create, index and query spatial objects with Azure DocumentDB." 
    services="documentdb" 
    documentationCenter="" 
    authors="arramac" 
    manager="jhubbard" 
    editor="monicar"/>

<tags 
    ms.service="documentdb" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="data-services" 
    ms.date="08/05/2015" 
    ms.author="arramac"/>
    
# Working with Geospatial data in Azure DocumentDB

This article is an introduction to the geospatial functionality in [Azure DocumentDB](http://azure.microsoft.com/services/documentdb/). After reading this, you will be able to answer the following questions:

- How do I store spatial data in Azure DocumentDB?
- How can I query geospatial data in Azure DocumentDB in SQL and LINQ?
- How do I enable or disable spatial indexing in DocumentDB?

##<a id="Introduction"></a> Introduction to Spatial data
Spatial data describes the position and shape of objects in space. In most applications, these correspond to objects on the earth, i.e. geospatial data. Spatial data can be used to represent the location of a person or a place of interest, or or the boundary of a city or a lake. Common use cases often involve proximity queries, for e.g., "find all coffee shops near my current location". 

### GeoJSON
DocumentDB supports indexing and querying of geospatial data that's represented using the [GeoJSON specification](http://geojson.org/geojson-spec.html). GeoJSON data structures are always valid JSON objects, so they can be stored and queried using DocumentDB without any specialized tools or libraries. The DocumentDB SDKs provide helper classes and methods that make it easy to work with spatial data. 

### Points, Linestrings and Polygons
**Points** denote a single position in space. In geospatial data, a point represents the exact location, which could be a street address of a grocery store, a kiosk, an automobile or a city.  A point is represented in GeoJSON (and DocumentDB) using its coordinate pair or longitude and latitude. Here's an example JSON for a point.

**Points in DocumentDB**

    {
       "type":"Point",
       "coordinates":[ 31.9, -4.8 ]
    }

>[AZURE.NOTE] The GeoJSON specification specifies longitude first and latitude second. Like in other mapping applications, longitude and latitude are angles and represented in terms of degrees. Longitude values are measured from the Prime Meridian and are between -180 and 180.0 degrees, and latitude values are measured from the equator and are between -90.0 and 90.0 degrees. 
>
> DocumentDB interprets coordinates as represented per the WGS-84 reference system. Please see below for more details about coordinate reference systems.

This can be embedded in a DocumentDB document as shown in this example of a user profile containing location data:

**Use Profile with Location stored in DocumentDB**

    {
       "id":"documentdb-profile",
       "screen_name":"@DocumentDB",
       "city":"Redmond",
       "topics":[ "NoSQL", "Javascript" ],
       "location":{
          "type":"Point",
          "coordinates":[ 31.9, -4.8 ]
       }
    }

**LineStrings** represent a series of two or more points in space and the line segments that connect them. In geospatial data, linestrings are commonly used to represent highways or rivers.

**LineStrings in DocumentDB**

    {
       "type":"LineString",
       "coordinates":[
          [ 31.9, -4.8 ],
          [ 31.7, -5.2 ]
       ]
    }

A **polygon** is a boundary of connected points that forms a closed LineString. Polygons are commonly used to represent natural formations like lakes or polical jurisdictions like cities and states. Here's an example of a polygon in DocumentDB. 

**Polygons in DocumentDB**

    {
       "type":"Polygon",
       "coordinates":[
           [ 31.8, -5 ],
           [ 31.8, -4.7 ],
           [ 32, -4.7 ],
           [ 32, -5 ],
           [ 31.8, -5 ]
       ]
    }

>[AZURE.NOTE] The GeoJSON specification requires that for valid polygons, the last coordinate pair provided should be the same as the first, to create a closed shape. 

In addition to Point, LineString and Polygon, GeoJSON also supports MultiPoint, MultiLineString, MultiPolygon, and GeometryCollection for grouping geospatial locations. GeoJSON also supports Feature and FeatureCollection that support arbitrary properties to be associated with locations. Since these types are valid JSON, they can all be stored and processed in DocumentDB.

### Coordinate Reference Systems

Since the shape of the earth is irregular, coordinates of geospatial data is represented in many coordinate reference systems (CRS), each with their own frames of reference and units of measurement. For example, the National Grid of Britain is a reference system is very accurate for the United Kingdom, but not outside it. Most mapping systems including GPS apps, Google Maps and Bing Maps APIs use the World Geodetic system [WGS-84](http://earth-info.nga.mil/GandG/wgs84/) CRS. DocumentDB supports indexing and querying only using the WGS-84 CRS. 

##<a id="CreatingSpatialObjects"></a> Creating Spatial Objects 

### Spatial classes in .NET

##<a id="SpatialQuery"></a> Querying Spatial Types

### Spatial SQL Built-in functions

### LINQ Querying in the .NET SDK

##<a id="SpatialIndexing"></a> Indexing

**Create a collection with spatial indexing**

**Modify an existing collection with spatial indexing**

### How does spatial indexing work?

##<a id="NextSteps"></a> Next Steps
