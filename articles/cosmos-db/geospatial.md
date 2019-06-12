---
title: Working with geospatial data in Azure Cosmos DB SQL API account
description: Understand how to create, index and query spatial objects with Azure Cosmos DB and the SQL API.
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: sngun

---
# Use Geospatial and GeoJSON location data with Azure Cosmos DB SQL API account

This article is an introduction to the geospatial functionality in Azure Cosmos DB. Currently storing and accessing geospatial data is supported by Cosmos DB SQL API accounts only. After reading this article, you will be able to answer the following questions:

* How do I store spatial data in Azure Cosmos DB?
* How can I query geospatial data in Azure Cosmos DB in SQL and LINQ?
* How do I enable or disable spatial indexing in Azure Cosmos DB?

This article shows how to work with spatial data with the SQL API. See this [GitHub project](https://github.com/Azure/azure-documentdb-dotnet/blob/master/samples/code-samples/Geospatial/Program.cs) for code samples.

## Introduction to spatial data
Spatial data describes the position and shape of objects in space. In most applications, these correspond to objects on the earth and geospatial data. Spatial data can be used to represent the location of a person, a place of interest, or the boundary of a city, or a lake. Common use cases often involve proximity queries, for example, "find all coffee shops near my current location." 

### GeoJSON
Azure Cosmos DB supports indexing and querying of geospatial point data that's represented using the [GeoJSON specification](https://tools.ietf.org/html/rfc7946). GeoJSON data structures are always valid JSON objects, so they can be stored and queried using Azure Cosmos DB without any specialized tools or libraries. The Azure Cosmos DB SDKs provide helper classes and methods that make it easy to work with spatial data. 

### Points, LineStrings, and Polygons
A **Point** denotes a single position in space. In geospatial data, a Point represents the exact location, which could be a street address of a grocery store, a kiosk, an automobile, or a city.  A point is represented in GeoJSON (and Azure Cosmos DB) using its coordinate pair or longitude and latitude. Here's an example JSON for a point.

**Points in Azure Cosmos DB**

```json
{
    "type":"Point",
    "coordinates":[ 31.9, -4.8 ]
}
```

> [!NOTE]
> The GeoJSON specification specifies longitude first and latitude second. Like in other mapping applications, longitude and latitude are angles and represented in terms of degrees. Longitude values are measured from the Prime Meridian and are between -180 degrees and 180.0 degrees, and latitude values are measured from the equator and are between -90.0 degrees and 90.0 degrees. 
> 
> Azure Cosmos DB interprets coordinates as represented per the WGS-84 reference system. See below for more details about coordinate reference systems.
> 
> 

This can be embedded in an Azure Cosmos DB document as shown in this example of a user profile containing location data:

**Use Profile with Location stored in Azure Cosmos DB**

```json
{
    "id":"cosmosdb-profile",
    "screen_name":"@CosmosDB",
    "city":"Redmond",
    "topics":[ "global", "distributed" ],
    "location":{
        "type":"Point",
        "coordinates":[ 31.9, -4.8 ]
    }
}
```

In addition to points, GeoJSON also supports LineStrings and Polygons. **LineStrings** represent a series of two or more points in space and the line segments that connect them. In geospatial data, LineStrings are commonly used to represent highways or rivers. A **Polygon** is a boundary of connected points that forms a closed LineString. Polygons are commonly used to represent natural formations like lakes or political jurisdictions like cities and states. Here's an example of a Polygon in Azure Cosmos DB. 

**Polygons in GeoJSON**

```json
{
    "type":"Polygon",
    "coordinates":[ [
        [ 31.8, -5 ],
        [ 31.8, -4.7 ],
        [ 32, -4.7 ],
        [ 32, -5 ],
        [ 31.8, -5 ]
    ] ]
}
```

> [!NOTE]
> The GeoJSON specification requires that for valid Polygons, the last coordinate pair provided should be the same as the first, to create a closed shape.
> 
> Points within a Polygon must be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.
> 
> 

In addition to Point, LineString, and Polygon, GeoJSON also specifies the representation for how to group multiple geospatial locations, as well as how to associate arbitrary properties with geolocation as a **Feature**. Since these objects are valid JSON, they can all be stored and processed in Azure Cosmos DB. However Azure Cosmos DB only supports automatic indexing of points.

### Coordinate reference systems
Since the shape of the earth is irregular, coordinates of geospatial data are represented in many coordinate reference systems (CRS), each with their own frames of reference and units of measurement. For example, the "National Grid of Britain" is a reference system is accurate for the United Kingdom, but not outside it. 

The most popular CRS in use today is the World Geodetic System  [WGS-84](http://earth-info.nga.mil/GandG/wgs84/). GPS devices, and many mapping services including Google Maps and Bing Maps APIs use WGS-84. Azure Cosmos DB supports indexing and querying of geospatial data using the WGS-84 CRS only. 

## Creating documents with spatial data
When you create documents that contain GeoJSON values, they are automatically indexed with a spatial index in accordance to the indexing policy of the container. If you're working with an Azure Cosmos DB SDK in a dynamically typed language like Python or Node.js, you must create valid GeoJSON.

**Create Document with Geospatial data in Node.js**

```json
var userProfileDocument = {
    "name":"cosmosdb",
    "location":{
        "type":"Point",
        "coordinates":[ -122.12, 47.66 ]
    }
};

client.createDocument(`dbs/${databaseName}/colls/${collectionName}`, userProfileDocument, (err, created) => {
    // additional code within the callback
});
```

If you're working with the SQL APIs, you can use the `Point` and `Polygon` classes within the `Microsoft.Azure.Documents.Spatial` namespace to embed location information within your application objects. These classes help simplify the serialization and deserialization of spatial data into GeoJSON.

**Create Document with Geospatial data in .NET**

```json
using Microsoft.Azure.Documents.Spatial;

public class UserProfile
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("location")]
    public Point Location { get; set; }

    // More properties
}

await client.CreateDocumentAsync(
    UriFactory.CreateDocumentCollectionUri("db", "profiles"), 
    new UserProfile 
    { 
        Name = "cosmosdb", 
        Location = new Point (-122.12, 47.66) 
    });
```

If you don't have the latitude and longitude information, but have the physical addresses or location name like city or country/region, you can look up the actual coordinates by using a geocoding service like Bing Maps REST Services. Learn more about Bing Maps geocoding [here](https://msdn.microsoft.com/library/ff701713.aspx).

## Querying spatial types
Now that we've taken a look at how to insert geospatial data, let's take a look at how to query this data using Azure Cosmos DB using SQL and LINQ.

### Spatial SQL built-in functions
Azure Cosmos DB supports the following Open Geospatial Consortium (OGC) built-in functions for geospatial querying. For more information on the complete set of built-in functions in the SQL language, see [Query Azure Cosmos DB](how-to-sql-query.md).

|**Usage**|**Description**|
|---|---|
| ST_DISTANCE (spatial_expr, spatial_expr) | Returns the distance between the two GeoJSON Point, Polygon, or LineString expressions.|
|ST_WITHIN (spatial_expr, spatial_expr) | Returns a Boolean expression indicating whether the first GeoJSON object (Point, Polygon, or LineString) is within the second GeoJSON object (Point, Polygon, or LineString).|
|ST_INTERSECTS (spatial_expr, spatial_expr)| Returns a Boolean expression indicating whether the two specified GeoJSON objects (Point, Polygon, or LineString) intersect.|
|ST_ISVALID| Returns a Boolean value indicating whether the specified GeoJSON Point, Polygon, or LineString expression is valid.|
| ST_ISVALIDDETAILED| Returns a JSON value containing a Boolean value if the specified GeoJSON Point, Polygon, or LineString expression is valid, and if invalid, additionally the reason as a string value.|

Spatial functions can be used to perform proximity queries against spatial data. For example, here's a query that returns all family documents that are within 30 km of the specified location using the ST_DISTANCE built-in function. 

**Query**

    SELECT f.id 
    FROM Families f 
    WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000

**Results**

    [{
      "id": "WakefieldFamily"
    }]

If you include spatial indexing in your indexing policy, then "distance queries" will be served efficiently through the index. For more information on spatial indexing, see the section below. If you don't have a spatial index for the specified paths, you can still perform spatial queries by specifying `x-ms-documentdb-query-enable-scan` request header with the value set to "true". In .NET, this can be done by passing the optional **FeedOptions** argument to queries with [EnableScanInQuery](https://msdn.microsoft.com/library/microsoft.azure.documents.client.feedoptions.enablescaninquery.aspx#P:Microsoft.Azure.Documents.Client.FeedOptions.EnableScanInQuery) set to true. 

ST_WITHIN can be used to check if a point lies within a Polygon. Commonly Polygons are used to represent boundaries like zip codes, state boundaries, or natural formations. Again if you include spatial indexing in your indexing policy, then "within" queries will be served efficiently through the index. 

Polygon arguments in ST_WITHIN can contain only a single ring, that is, the Polygons must not contain holes in them. 

**Query**

    SELECT * 
    FROM Families f 
    WHERE ST_WITHIN(f.location, {
        'type':'Polygon', 
        'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]
    })

**Results**

    [{
      "id": "WakefieldFamily",
    }]

> [!NOTE]
> Similar to how mismatched types work in Azure Cosmos DB query, if the location value specified in either argument is malformed or invalid, then it evaluates to **undefined** and the evaluated document to be skipped from the query results. If your query returns no results, run ST_ISVALIDDETAILED To debug why the spatial type is invalid.     
> 
> 

Azure Cosmos DB also supports performing inverse queries, that is, you can index polygons or lines in Azure Cosmos DB, then query for the areas that contain a specified point. This pattern is commonly used in logistics to identify, for example, when a truck enters or leaves a designated area. 

**Query**

    SELECT * 
    FROM Areas a 
    WHERE ST_WITHIN({'type': 'Point', 'coordinates':[31.9, -4.8]}, a.location)


**Results**

    [{
      "id": "MyDesignatedLocation",
      "location": {
        "type":"Polygon", 
        "coordinates": [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]
      }
    }]

ST_ISVALID and ST_ISVALIDDETAILED can be used to check if a spatial object is valid. For example, the following query checks the validity of a point with an out of range latitude value (-132.8). ST_ISVALID returns just a Boolean value, and ST_ISVALIDDETAILED returns the Boolean and a string containing the reason why it is considered invalid.

**Query**

    SELECT ST_ISVALID({ "type": "Point", "coordinates": [31.9, -132.8] })

**Results**

    [{
      "$1": false
    }]

These functions can also be used to validate Polygons. For example, here we use ST_ISVALIDDETAILED to validate a Polygon that is not closed. 

**Query**

    SELECT ST_ISVALIDDETAILED({ "type": "Polygon", "coordinates": [[ 
        [ 31.8, -5 ], [ 31.8, -4.7 ], [ 32, -4.7 ], [ 32, -5 ] 
        ]]})

**Results**

    [{
       "$1": { 
            "valid": false, 
            "reason": "The Polygon input is not valid because the start and end points of the ring number 1 are not the same. Each ring of a Polygon must have the same start and end points." 
          }
    }]

### LINQ Querying in the .NET SDK
The SQL .NET SDK also providers stub methods `Distance()` and `Within()` for use within LINQ expressions. The SQL LINQ provider translates this method calls to the equivalent SQL built-in function calls (ST_DISTANCE and ST_WITHIN respectively). 

Here's an example of a LINQ query that finds all documents in the Azure Cosmos DB collection whose "location" value is within a radius of 30 km of the specified point using LINQ.

**LINQ query for Distance**

    foreach (UserProfile user in client.CreateDocumentQuery<UserProfile>(UriFactory.CreateDocumentCollectionUri("db", "profiles"))
        .Where(u => u.ProfileType == "Public" && u.Location.Distance(new Point(32.33, -4.66)) < 30000))
    {
        Console.WriteLine("\t" + user);
    }

Similarly, here's a query for finding all the documents whose "location" is within the specified box/Polygon. 

**LINQ query for Within**

    Polygon rectangularArea = new Polygon(
        new[]
        {
            new LinearRing(new [] {
                new Position(31.8, -5),
                new Position(32, -5),
                new Position(32, -4.7),
                new Position(31.8, -4.7),
                new Position(31.8, -5)
            })
        });

    foreach (UserProfile user in client.CreateDocumentQuery<UserProfile>(UriFactory.CreateDocumentCollectionUri("db", "profiles"))
        .Where(a => a.Location.Within(rectangularArea)))
    {
        Console.WriteLine("\t" + user);
    }


Now that we've taken a look at how to query documents using LINQ and SQL, let's take a look at how to configure Azure Cosmos DB for spatial indexing.

## Indexing
As we described in the [Schema Agnostic Indexing with Azure Cosmos DB](https://www.vldb.org/pvldb/vol8/p1668-shukla.pdf) paper, we designed Azure Cosmos DB’s database engine to be truly schema agnostic and provide first class support for JSON. The write optimized database engine of Azure Cosmos DB natively understands spatial data (points, Polygons, and lines) represented in the GeoJSON standard.

In a nutshell, the geometry is projected from geodetic coordinates onto a 2D plane then divided progressively into cells using a **quadtree**. These cells are mapped to 1D based on the location of the cell within a **Hilbert space filling curve**, which preserves locality of points. Additionally when location data is indexed, it goes through a process known as **tessellation**, that is, all the cells that intersect a location are identified and stored as keys in the Azure Cosmos DB index. At query time, arguments like points and Polygons are also tessellated to extract the relevant cell ID ranges, then used to retrieve data from the index.

If you specify an indexing policy that includes spatial index for /* (all paths), then all points found within the collection are indexed for efficient spatial queries (ST_WITHIN and ST_DISTANCE). Spatial indexes do not have a precision value, and always use a default precision value.

> [!NOTE]
> Azure Cosmos DB supports automatic indexing of Points, Polygons, and LineStrings
> 
> 

The following JSON snippet shows an indexing policy with spatial indexing enabled, that is, index any GeoJSON point found within documents for spatial querying. If you are modifying the indexing policy using the Azure portal, you can specify the following JSON for indexing policy to enable spatial indexing on your collection.

**Collection Indexing Policy JSON with Spatial enabled for points and Polygons**

    {
       "automatic":true,
       "indexingMode":"Consistent",
       "includedPaths":[
          {
             "path":"/*",
             "indexes":[
                {
                   "kind":"Range",
                   "dataType":"String",
                   "precision":-1
                },
                {
                   "kind":"Range",
                   "dataType":"Number",
                   "precision":-1
                },
                {
                   "kind":"Spatial",
                   "dataType":"Point"
                },
                {
                   "kind":"Spatial",
                   "dataType":"Polygon"
                }                
             ]
          }
       ],
       "excludedPaths":[
       ]
    }

Here's a code snippet in .NET that shows how to create a collection with spatial indexing turned on for all paths containing points. 

**Create a collection with spatial indexing**

    DocumentCollection spatialData = new DocumentCollection()
    spatialData.IndexingPolicy = new IndexingPolicy(new SpatialIndex(DataType.Point)); //override to turn spatial on by default
    collection = await client.CreateDocumentCollectionAsync(UriFactory.CreateDatabaseUri("db"), spatialData);

And here's how you can modify an existing collection to take advantage of spatial indexing over any points that are stored within documents.

**Modify an existing collection with spatial indexing**

    Console.WriteLine("Updating collection with spatial indexing enabled in indexing policy...");
    collection.IndexingPolicy = new IndexingPolicy(new SpatialIndex(DataType.Point));
    await client.ReplaceDocumentCollectionAsync(collection);

    Console.WriteLine("Waiting for indexing to complete...");
    long indexTransformationProgress = 0;
    while (indexTransformationProgress < 100)
    {
        ResourceResponse<DocumentCollection> response = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("db", "coll"));
        indexTransformationProgress = response.IndexTransformationProgress;

        await Task.Delay(TimeSpan.FromSeconds(1));
    }

> [!NOTE]
> If the location GeoJSON value within the document is malformed or invalid, then it will not get indexed for spatial querying. You can validate location values using ST_ISVALID and ST_ISVALIDDETAILED.
> 
> If your collection definition includes a partition key, indexing transformation progress is not reported. 
> 
> 

## Next steps
Now that you have learned how to get started with geospatial support in Azure Cosmos DB, next you can:

* Start coding with the [Geospatial .NET code samples on GitHub](https://github.com/Azure/azure-documentdb-dotnet/blob/fcf23d134fc5019397dcf7ab97d8d6456cd94820/samples/code-samples/Geospatial/Program.cs)
* Get hands on with geospatial querying at the [Azure Cosmos DB Query Playground](https://www.documentdb.com/sql/demo#geospatial)
* Learn more about [Azure Cosmos DB Query](how-to-sql-query.md)
* Learn more about [Azure Cosmos DB Indexing Policies](index-policy.md)

