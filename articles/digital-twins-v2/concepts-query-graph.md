---
# Mandatory fields.
title: Query the Azure Digital Twins graph
titleSuffix: Azure Digital Twins
description: Understand how to query the Azure Digital Twins graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/26/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins graph

Recall that the center of Azure Digital Twins is the **digital twin graph**, constructed from [twins](concepts-twins-graph.md) and relationships. This graph can be queried to get information about the twins and relationships it contains. These queries are written in a custom SQL-like query language called **Azure Digital Twin Query Store language**.

To submit a query to the service from a client app, you will use the Azure Digital Twins **Query APIs**. These let developers write queries and apply filters to find sets of twins in the graph, and other information about the Azure Digital Twins scenario.

## Query language features

Azure Digital Twins provides extensive query capabilities against the Azure Digital Twins graph. Queries are described using SQL-like syntax, as a superset of the capabilities of the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md).

Here are the operations available via query:
* Get twins by properties
* Get twins by interfaces
* Get twins by relationships
* Get twins over multiple relationships types and multiple hops (`JOIN` queries). 
* Any combination (`AND`, `OR`, `NOT` operator) of the above
* Get twins based on actual state condition (information about twins and their last known property value)
* Scalar functions support: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTS_WITH`, `ENDS_WITH`
* Custom model function support: `IS_OF_MODEL(twinToCheck, modelName)` allows query authors to filter based on modeling information within DTDL types
* Continuation support: The query object is instantiated with a page size (up to 100). Then you can retrieve the twin one page at a time, by repeating calls to the `nextAsTwin` method.
* Support for query comparison operators: `AND`/`OR`/`NOT`,  `IN`/`NOT IN`, `STARTSWITH`/`ENDSWITH`, `=`, `!=`, `<`, `>`, `<=`, `>=`

## Basic query syntax

Here are some sample queries that perform three possible query operations and illustrate the query language structure.

Get twins by properties:
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.$dtid in ['123', '456']
AND T.firmwareVersion = '1.1'
```

Get twins by model
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.IS_OF_MODEL(T , 'urn:contosocom:DigitalTwins:Space:3')
AND T.roomSize > 50
```

Get twins by relationships:
```sql
SELECT *
FROM DigitalTwins space
JOIN device RELATED space.has  
WHERE space.$dtid = 'Room 123'
AND device.$metadata.model = 'urn:contosocom:DigitalTwins:MxChip:3'
AND has.role = 'Operator'
```

Once you have decided on a query string, you execute it by making a call to the Query APIs.
The following code snippet illustrates this call from the client app:

```csharp
var client = DigitalTwinsServiceClient.CreateFromConnectionString("...");
string results;
IAsynEnumerable<Result<JsonDocument>> result = client.Query("<querystring>");
```

This call returns query results in the form of a JSON string. 
To parse the JSON results returned, you can use the JSON parser of your choice.

## Relationship-based queries

When querying based on twins' relationships, Azure Digital Twins Query Store Language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. An important distinction here from "classical" SQL-type languages is that each expression in this `FROM` clause is not a table; rather, the `FROM` clause expresses a cross-entity relationship traversal, and is written with an Azure Digital Twins version of `JOIN`. 

Recall that with the Azure Digital Twins [modeling](concepts-models.md) capabilities, relationships do not exist independently of twins. This means the Azure Digital Twins Query Store Language's `JOIN` operation is a little different from the general SQL `JOIN` operation, as edges in this case cannot be queried independently and must be tied to a twin.
To mark this difference, the keyword `RELATED` is used within the `JOIN` clause to reference a twin's set of relationships. 

The following section gives several examples of what this looks like.

> [!TIP]
> Conceptually, this feature mimics the document-centric functionality of CosmosDB, where `JOIN`s can be performed on child objects within a document. CosmosDB uses the `IN` keyword to indicate the `JOIN` is intended to iterate over array elements within the current context document.

### Relationship-based query examples

To get a dataset that includes relationships, use a single `FROM` statement followed by N `JOIN` statements, where the `JOIN` statements express relationships on the result of a previous `FROM` or `JOIN` statement.

Here is a sample relationship-based query. This code snippet selects all twins with an *id* property of 'ABC', and all twins related to these twins via a *contains* relationship. 

```sql
SELECT T, CT
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
WHERE T.id = 'ABC' 
```

>[!NOTE] 
> The developer does not need to correlate these `JOIN`s with a key value in the `WHERE` clause (or specify a key value inline with the `JOIN` definition). This correlation is computed automatically by the system, as the relationship properties themselves encode the target entity.

You can also query over multiple levels of relationships, and based on related twins' properties. The following example extends the previous example to get 
the twins with a *reported value* of 123, serviced by  
    the twins contained by
        the twins with an *id* property of 'ABC'.

```sql
SELECT T, CT, CT2
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
JOIN CT2 RELATED CT.servicedBy
WHERE T.id = 'ABC' 
AND CT2.properties.v1.reported.value = 123
```

Additionally, the query author can reference the same "table" multiple times in the query:

```sql
SELECT T, CT, CB
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
JOIN CB RELATED T.servicedBy
WHERE T.id = 'ABC' 
and CT.properties.v1.reported.value = 'DEF' 
and CB.properties.name.reported.value = 'john'
```

Note above that the twin object `T` has both the *contains* and *servicedBy* relationships traversed.

### Query properties of relationships

Similarly to the way twin objects have properties described via DTDL, relationship instances can also have properties. 
The Azure Digital Twins Query Store Language allows filtering and projection of relationship entities, by assigning an alias to the relationship within the `JOIN` clause. 

As an example, consider a *servicedBy* relationship that has a *reportedCondition* property. In the below query, this relationship is given an alias of 'SBR' in order to reference its property.

```sql
SELECT T, CB, SBR
FROM DIGITALTWINS T
JOIN CB RELATED T.servicedBy SBR
WHERE T.id = 'ABC' 
and SBR.reportedCondition = 'clean'
```

In the example above, note how *reportedCondition* is expressed as a property of the *servicedBy* relationship itself (and not of a twin with a *servicedBy* relationship).

### Limitations

These are the current limitations on `JOINs` in the Azure Digital Twins Query Store Language:
* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* Additional runtime limitations may be exposed, such as restricting the number of `JOIN`s which can be performed.
* During the preview release, only one level of `JOIN` is supported.

## Next steps

Learn about the Azure Digital Twins APIs:
* [Use the Azure Digital Twins APIs](concepts-use-apis.md)