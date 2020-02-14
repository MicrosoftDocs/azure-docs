---
# Mandatory fields.
title: Query the ADT graph
description: See how to get information out of an Azure Digital Twins graph using Digital Twins Query Language.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Query the digital twin graph

## Here is an info dump.

	Query APIs. The Query APIs let developers find sets of twins in the graph across relationships and applying filters

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Query Digital Twins
ADT provides extensive query capabilities against the Digital Twins graph. Queries are described using SQL syntax, as a superset of the capabilities of the IoT Hub query language Add references to the Hub Query documentation.
Some example queries:
Query	Explanation
SELECT * 
FROM Twins T
WHERE T.$id = ‘ABC’	Find a twin with a specific ID
SELECT * 
FROM Twins T  
WHERE T.$id in [‘ABC’, ‘DEF’, ‘1234’]	Find twins from a set of IDs
SELECT *
FROM TWINS T1
WHERE T1.$id = ‘ABC’ OR 
T1.$id = ‘DEF’ OR T1.$id = ‘1234’  	
SELECT * 
FROM Twins T  
WHERE T.roomSize > 50	Find all twins that have a roomSIze property with a value > 50
SELECT *
FROM TWINS T1
JOIN T2 RELATED T1.contains
WHERE T1.$id = ‘ABC’	Find all twins that are related to the twin with the ID ABC via a relationship of the name “contains”
SELECT *
FROM TWINS T1
JOIN T2 RELATED T1.contains
WHERE T1.$id = ‘ABC’
AND T2.model NOT IN [‘Dell’, ‘Intel’]	Same as above, but only return connected items that have a model property that does not have the value “Dell” or “Intel” 

Capability Description
One single API with SQL-LIKE query language getting twins (devices and non-devices) and relationships – Compatible with Hub query language
Get twins by properties, including property/keys
Get twins by Interfaces
Get twins by relationship instance (query by name of the relationship)
Any combination of above (AND, OR, NOT operator): Get Twins by relationship instance and property lookup
Continuation support: The query object is instantiated with a page size (up to 100). Then multiple pages are retrieved by calling the nextAsTwin method multiple times.
Support for query comparison operators: AND/OR/NOT,  IN/NOT IN, STARTSWITH/ENDSWITH, =, !=, <,  >, <=, >=
Get twins based on actual state condition (Get twins and their last known telemetry value) – via setting a property on event handler
Get twins by relationship properties
Scalar Functions support: IS_BOOL, IS_DEFINED, IS_NULL, IS_NUMBER, IS_OBJECT, IS_PRIMITIVE, IS_STRING, STARTS_WITH, ENDS_WITH
Queries over multiple relationships types and multiple hops (JOIN queries). Have limitations on number of JOINs allowed
Access control based on single role (all or nothing access ?)
Throttling based on RU consumed without a time frame, based on SKU limits, etc.

The following example shows how to execute queries:
var client = DigitalTwinsServiceClient.CreateFromConnectionString(“...”);
string results;
IAsynEnumerable<Result<JsonDocument>> result = client.Query(“querystring”);
This returns the query results in form of a JSON string. 
To parse the JSON results returned, use the Json parser of your choice. 
Documentation of the query results
