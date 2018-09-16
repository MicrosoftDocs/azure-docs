---
title: 'Azure Cosmos DB feature support for MongoDB | Microsoft Docs'
description: Learn about the feature support the Azure Cosmos DB MongoDB API provides for MongoDB 3.4.
services: cosmos-db
author: alekseys
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-mongo
ms.devlang: na
ms.topic: overview
ms.date: 11/15/2017
ms.author: alekseys
experimental: true
experiment_id: "662dc5fd-886f-4a"
---
# MongoDB API support for MongoDB features and syntax

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the database's MongoDB API through any of the open source MongoDB client [drivers](https://docs.mongodb.org/ecosystem/drivers). The MongoDB API enables the use of existing client drivers by adhering to the MongoDB [wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB MongoDB API, you can enjoy the benefits of the MongoDB APIs you're used to, with all of the enterprise capabilities Azure Cosmos DB provides: [global distribution](distribute-data-globally.md), [automatic sharding](partition-data.md), availability and latency guarantees, automatic indexing of every field, encryption at rest, backups, and much more.

## MongoDB Protocol Support

The Azure Cosmos DB MongoDB API is compatible with MongoDB Server version **3.2** by default. The supported operators and any limitations or exceptions are listed below. Features or query operators added in MongoDB version **3.4** are currently available as a preview feature. Any client driver that understands these protocols should be able to connect to Cosmos DB using the MongoDB API.

The [MongoDB aggregation pipeline](#aggregation-pipeline) is also currently available as a separate preview feature.

## MongoDB query language support

Azure Cosmos DB MongoDB API provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported operations, operators, stages, commands and options.

## Database commands

Azure Cosmos DB supports the following database commands on all MongoDB API accounts.

### Query and write operation commands
- delete
- find
- findAndModify
- getLastError
- getMore
- insert
- update

### Authentication commands
- logout
- authenticate
- getnonce

### Administration commands
- dropDatabase
- listCollections
- drop
- create
- filemd5
- createIndexes
- listIndexes
- dropIndexes
- connectionStatus
- reIndex

### Diagnostics commands
- buildInfo
- collStats
- dbStats
- hostInfo
- listDatabases
- whatsmyuri

<a name="aggregation-pipeline"/>

## Aggregation pipeline</a>

Azure Cosmos DB supports aggregation pipeline in public preview. See the [Azure blog](https://aka.ms/mongodb-aggregation) for instructions on how to onboard to the public preview.

### Aggregation commands
- aggregate
- count
- distinct

### Aggregation stages
- $project
- $match
- $limit
- $skip
- $unwind
- $group
- $sample
- $sort
- $lookup
- $out
- $count
- $addFields

### Aggregation expressions

#### Boolean expressions
- $and
- $or
- $not

#### Set expressions
- $setEquals
- $setIntersection
- $setUnion
- $setDifference
- $setIsSubset
- $anyElementTrue
- $allElementsTrue

#### Comparison expressions
- $cmp
- $eq
- $gt
- $gte
- $lt
- $lte
- $ne

#### Arithmetic expressions
- $abs
- $add
- $ceil
- $divide
- $exp
- $floor
- $ln
- $log
- $log10
- $mod
- $multiply
- $pow
- $sqrt
- $subtract
- $trunc

#### String expressions
- $concat
- $indexOfBytes
- $indexOfCP
- $split
- $strLenBytes
- $strLenCP
- $strcasecmp
- $substr
- $substrBytes
- $substrCP
- $toLower
- $toUpper

#### Array expressions
- $arrayElemAt
- $concatArrays
- $filter
- $indexOfArray
- $isArray
- $range
- $reverseArray
- $size
- $slice
- $in

#### Date expressions
- $dayOfYear
- $dayOfMonth
- $dayOfWeek
- $year
- $month
- $week
- $hour
- $minute
- $second
- $millisecond
- $isoDayOfWeek
- $isoWeek

#### Conditional expressions
- $cond
- $ifNull

## Aggregation accumulators
- $sum
- $avg
- $first
- $last
- $max
- $min
- $push
- $addToSet

## Operators

Following operators are supported with corresponding examples of their use. Consider this sample document used in the queries below:

```json
{
  "Volcano Name": "Rainier",
  "Country": "United States",
  "Region": "US-Washington",
  "Location": {
    "type": "Point",
    "coordinates": [
      -121.758,
      46.87
    ]
  },
  "Elevation": 4392,
  "Type": "Stratovolcano",
  "Status": "Dendrochronology",
  "Last Known Eruption": "Last known eruption from 1800-1899, inclusive"
}
```

Operator | Example |
--- | --- |
$eq	| ``` { "Volcano Name": { $eq: "Rainier" } } ``` |  | -
$gt	| ``` { "Elevation": { $gt: 4000 } } ``` |  | -
$gte | ``` { "Elevation": { $gte: 4392 } } ``` |  | -
$lt | ``` { "Elevation": { $lt: 5000 } } ``` |  | -
$lte | ``` { "Elevation": { $lte: 5000 } } ``` | | -
$ne | ``` { "Elevation": { $ne: 1 } } ``` |  | -
$in | ``` { "Volcano Name": { $in: ["St. Helens", "Rainier", "Glacier Peak"] } } ``` |  | -
$nin | ``` { "Volcano Name": { $nin: ["Lassen Peak", "Hood", "Baker"] } } ``` | | -
$or	| ``` { $or: [ { Elevation: { $lt: 4000 } }, { "Volcano Name": "Rainier" } ] } ``` |  | -
$and | ``` { $and: [ { Elevation: { $gt: 4000 } }, { "Volcano Name": "Rainier" } ] } ``` |  | -
$not | ``` { "Elevation": { $not: { $gt: 5000 } } } ```|  | -
$nor | ``` { $nor: [ { "Elevation": { $lt: 4000 } }, { "Volcano Name": "Baker" } ] } ``` |  | -
$exists | ``` { "Status": { $exists: true } } ```|  | -
$type | ``` { "Status": { $type: "string" } } ```|  | -
$mod | ``` { "Elevation": { $mod: [ 4, 0 ] } } ``` |  | -
$regex | ``` { "Volcano Name": { $regex: "^Rain"} } ```|  | -

### Notes

In $regex queries, Left-anchored expressions allow index search. However, using 'i' modifier (case-insensitivity) and 'm' modifier (multiline) causes the collection scan in all expressions.
When there's a need to include '$' or '|', it is best to create two (or more) regex queries. 
For example, given the following original query: ```find({x:{$regex: /^abc$/})```, it has to be modified as follows:
```find({x:{$regex: /^abc/, x:{$regex:/^abc$/}})```.
The first part will use the index to restrict the search to those documents beginning with ^abc and the second part will match the exact entries. 
The bar operator '|' acts as an "or" function - the query ```find({x:{$regex: /^abc|^def/})``` matches the documents in which field 'x' has values that begin with "abc" or "def". To utilize the index, it's recommended to break the query into two different queries joined by the $or operator: ```find( {$or : [{x: $regex: /^abc/}, {$regex: /^def/}] })```.

### Update operators

#### Field update operators
- $inc
- $mul
- $rename
- $setOnInsert
- $set
- $unset
- $min
- $max
- $currentDate

#### Array update operators
- $addToSet
- $pop
- $pullAll
- $pull  (Note: $pull with condition is not supported)
- $pushAll
- $push
- $each
- $slice
- $sort
- $position

#### Bitwise update operator
- $bit

### Geospatial operators

Operator | Example 
--- | --- |
$geoWithin | ```{ "Location.coordinates": { $geoWithin: { $centerSphere: [ [ -121, 46 ], 5 ] } } }``` | Yes
$geoIntersects |  ```{ "Location.coordinates": { $geoIntersects: { $geometry: { type: "Polygon", coordinates: [ [ [ -121.9, 46.7 ], [ -121.5, 46.7 ], [ -121.5, 46.9 ], [ -121.9, 46.9 ], [ -121.9, 46.7 ] ] ] } } } }``` | Yes
$near | ```{ "Location.coordinates": { $near: { $geometry: { type: "Polygon", coordinates: [ [ [ -121.9, 46.7 ], [ -121.5, 46.7 ], [ -121.5, 46.9 ], [ -121.9, 46.9 ], [ -121.9, 46.7 ] ] ] } } } }``` | Yes
$nearSphere | ```{ "Location.coordinates": { $nearSphere : [ -121, 46  ], $maxDistance: 0.50 } }``` | Yes
$geometry | ```{ "Location.coordinates": { $geoWithin: { $geometry: { type: "Polygon", coordinates: [ [ [ -121.9, 46.7 ], [ -121.5, 46.7 ], [ -121.5, 46.9 ], [ -121.9, 46.9 ], [ -121.9, 46.7 ] ] ] } } } }``` | Yes
$minDistance | ```{ "Location.coordinates": { $nearSphere : { $geometry: {type: "Point", coordinates: [ -121, 46 ]}, $minDistance: 1000, $maxDistance: 1000000 } } }``` | Yes
$maxDistance | ```{ "Location.coordinates": { $nearSphere : [ -121, 46  ], $maxDistance: 0.50 } }``` | Yes
$center | ```{ "Location.coordinates": { $geoWithin: { $center: [ [-121, 46], 1 ] } } }``` | Yes
$centerSphere | ```{ "Location.coordinates": { $geoWithin: { $centerSphere: [ [ -121, 46 ], 5 ] } } }``` | Yes
$box | ```{ "Location.coordinates": { $geoWithin: { $box:  [ [ 0, 0 ], [ -122, 47 ] ] } } }``` | Yes
$polygon | ```{ "Location.coordinates": { $near: { $geometry: { type: "Polygon", coordinates: [ [ [ -121.9, 46.7 ], [ -121.5, 46.7 ], [ -121.5, 46.9 ], [ -121.9, 46.9 ], [ -121.9, 46.7 ] ] ] } } } }``` | Yes

## Additional operators

Operator | Example | Notes 
--- | --- | --- |
$all | ```{ "Location.coordinates": { $all: [-121.758, 46.87] } }``` | 
$elemMatch | ```{ "Location.coordinates": { $elemMatch: {  $lt: 0 } } }``` |  
$size | ```{ "Location.coordinates": { $size: 2 } }``` | 
$comment |  ```{ "Location.coordinates": { $elemMatch: {  $lt: 0 } }, $comment: "Negative values"}``` | 
$text |  | Not supported. Use $regex instead.

## Unsupported operators

The ```$where``` and the ```$eval``` operators are not supported by Azure Cosmos DB.

### Methods

Following methods are supported:

#### Cursor methods

Method | Example | Notes 
--- | --- | --- |
cursor.sort() | ```cursor.sort({ "Elevation": -1 })``` | Documents without sort key do not get returned

## Unique indexes

Azure Cosmos DB indexes every field in documents that are written to the database by default. Unique indexes ensure that a specific field doesn’t have duplicate values across all documents in a collection, similar to the way uniqueness is preserved on the default "_id" key. Now you can create custom indexes in Azure Cosmos DB by using the createIndex command, including the 'unique’ constraint.

Unique indexes are available for all MongoDB API accounts.

## Time-to-live (TTL)

Azure Cosmos DB supports a relative time-to-live (TTL) based on the timestamp of the document. TTL can be enabled for MongoDB API collections through the [Azure portal](https://portal.azure.com).

## User and role management

Azure Cosmos DB does not yet support users and roles. Azure Cosmos DB supports role based access control (RBAC) and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com) (Connection String page).

## Replication

Azure Cosmos DB supports automatic, native replication at the lowest layers. This logic is extended out to achieve low-latency, global replication as well. Azure Cosmos DB does not support manual replication commands.

## Write Concern

Certain MongoDB Apis support specifying a [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/) which specifies the number of responses required during a write operation. Due to how Cosmos DB handles replication in the background all writes are all automatically Quorum by default. Any write concern specified by client code is ignored. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md).

## Sharding

Azure Cosmos DB supports automatic, server-side sharding. Azure Cosmos DB does not support manual sharding commands.

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with an API for MongoDB database.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with an API for MongoDB database.
- Explore Azure Cosmos DB with protocol support for MongoDB [samples](mongodb-samples.md).
