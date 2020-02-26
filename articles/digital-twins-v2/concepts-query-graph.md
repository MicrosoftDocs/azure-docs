---
# Mandatory fields.
title: Query the Azure Digital Twins graph
titleSuffix: Azure Digital Twins
description: Understand how to query the Azure Digital Twins graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins graph

Recall that the center of Azure Digital Twins is the **digital twin graph**, constructed from [twins](concepts-twins-graph.md) and relationships. This graph is queryable, to get information about the twins and relationships it contains. 

Azure Digital Twins **Query APIs** let developers apply filters and find sets of twins in the graph across relationships.

## Query language features

Azure Digital Twins provides extensive query capabilities against the Azure Digital Twins graph. Queries are described using SQL-like syntax, as a superset of the capabilities of the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md).

Query capabilities:
* Get twins by properties
* Get twins by interfaces
* Get twins by relationship properties
* Get twins over multiple relationships types and multiple hops (`JOIN` queries). There are limitations on number of `JOIN`s allowed (one level for preview release)
* Any combination (`AND`, `OR`, `NOT` operator) of the above
* Continuation support: The query object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the `nextAsTwin` method multiple times.
* Support for query comparison operators: `AND`/`OR`/`NOT`,  `IN`/`NOT IN`, `STARTSWITH`/`ENDSWITH`, `=`, `!=`, `<`, `>`, `<=`, `>=`
* Get twins based on actual state condition (information about twins and their last known property value)
* Scalar Functions support: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTS_WITH`, `ENDS_WITH`

## Query examples

Here are some example queries that illustrate the query language structure, as well as some of the operations you can perform.

Get twins by properties
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.$dtid in ['123', '456']
AND T.firmwareVersion = '1.1'"
Get twins by model
SELECT  * 
FROM DigitalTwins T  
WHERE T.IS_OF_MODEL(T , 'urn:contosocom:DigitalTwins:Space:3')
AND T.roomSize > 50
```

Get twins by traversing relationships
```sql
SELECT *
FROM DigitalTwins space
JOIN device RELATED space.has  
WHERE space.$dtid = 'Room 123'
AND device.$metadata.model = 'urn:contosocom:DigitalTwins:MxChip:3'
AND has.role = 'Operator'"
The following example shows how to execute queries:
var client = DigitalTwinsServiceClient.CreateFromConnectionString("...");
string results;
IAsynEnumerable<Result<JsonDocument>> result = client.Query("querystring");
```

This query returns results in the form of a JSON string. 
To parse the JSON results returned, use the JSON parser of your choice.

## Next steps

Learn about the Azure Digital Twins APIs:
* [Use the Azure Digital Twins APIs](concepts-use-apis.md)