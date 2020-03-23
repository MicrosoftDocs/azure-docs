---
# Mandatory fields.
title: Query the twin graph
titleSuffix: Azure Digital Twins
description: Understand how to query the Azure Digital Twins twin graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/12/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins twin graph

Recall that the center of Azure Digital Twins is the **twin graph**, constructed from [digital twins](concepts-twins-graph.md) and relationships. This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language called **Azure Digital Twins Query Store language**.

To submit a query to the service from a client app, you will use the Azure Digital Twins **Query API**. This lets developers write queries and apply filters to find sets of digital twins in the twin graph, and other information about the Azure Digital Twins scenario.

## Query language features

Azure Digital Twins provides extensive query capabilities against the twin graph. Queries are described using SQL-like syntax, as a superset of the capabilities of the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md).

Here are the operations available in Azure Digital Twins Query Store language:
* Get digital twins by properties
* Get digital twins by relationships
* Get digital twins over multiple relationship types and multiple hops (`JOIN` queries)
* Get digital twins based on actual state condition (information about digital twins and their last known property value)
* Use custom twin type function: `IS_OF_MODEL(twinToCheck, twinTypeName)` allows query authors to filter based on information within DTDL twin types
* Use any combination (`AND`, `OR`, `NOT` operator) of the above
* Use scalar functions support: `IS_BOOL`, `IS_DEFINED`, `IS_NULL`, `IS_NUMBER`, `IS_OBJECT`, `IS_PRIMITIVE`, `IS_STRING`, `STARTS_WITH`, `ENDS_WITH`
* Use support for query comparison operators: `AND`/`OR`/`NOT`,  `IN`/`NOT IN`, `STARTSWITH`/`ENDSWITH`, `=`, `!=`, `<`, `>`, `<=`, `>=`
* Use continuation support: The query object is instantiated with a page size (up to 100). You can retrieve the digital twin one page at a time, by repeating calls to the `nextAsTwin` method

## Basic query syntax

Here are some sample queries that illustrate the query language structure and perform two possible query operations.

Get Azure digital twins by properties (including ID and metadata):
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.firmwareVersion = '1.1'
AND T.$dtId in ['123', '456']
AND T.$metadata.Temperature.reportedValue = 70
```

Get Azure digital twins by twin type
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE IS_OF_MODEL(T , 'urn:contosocom:DigitalTwins:Space:3')
AND T.roomSize > 50
```

> [!TIP]
> The ID of an Azure digital twin is queried using the metadata field `$dtId`.

Once you have decided on a query string, you execute it by making a call to the Query API.
The following code snippet illustrates this call from the client app:

```csharp
var client = new AzureDigitalTwinsAPIClient(<your-credentials>);
client.BaseUri = new Uri(<your-Azure-Digital-Twins-instance-URL>);

QuerySpecification spec = new QuerySpecification("SELECT * FROM digitaltwins");
QueryResult result = await client.Query.QueryTwinsAsync(spec);
```

This call returns query results in form of a QueryResult object. 

Query calls support paging. A complete example with error handling and paging:

```csharp
string query = "SELECT * FROM digitaltwins";
string conToken = null; // continuation token from the query
int page = 0;
try
{
    // Repeat the query while there are pages
    do
    {
        QuerySpecification spec = new QuerySpecification(query, conToken);
        QueryResult qr = await client.Query.QueryTwinsAsync(spec);
        page++;
        Console.WriteLine($"== Query results page {page}:");
        if (qr.Items != null)
        {
            // Query returns are JObjects
            foreach(JObject o in qr.Items)
            {
                string twinId = o.Value<string>("$dtId");
                Console.WriteLine($"  Found {twinId}");
            }
        }
        Console.WriteLine($"== End query results page {page}");
        conToken = qr.ContinuationToken;
    } while (conToken != null);
} catch (ErrorResponseException e)
{
    Console.WriteLine($"*** Error in twin query: ${e.Response.StatusCode}");
}
```

## Relationship-based queries

When querying based on digital twins' relationships, Azure Digital Twins Query Store Language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. An important distinction here from "classical" SQL-type languages is that each expression in this `FROM` clause is not a table; rather, the `FROM` clause expresses a cross-entity relationship traversal, and is written with an Azure Digital Twins version of `JOIN`. 

Recall that with the Azure Digital Twins [twin type](concepts-twin-types.md) capabilities, relationships do not exist independently of twins. This means the Azure Digital Twins Query Store Language's `JOIN` is a little different from the general SQL `JOIN`, as relationships here can't be queried independently and must be tied to a twin.
To mark this difference, the keyword `RELATED` is used in the `JOIN` clause to reference a twin's set of relationships. 

The following section gives several examples of what this looks like.

> [!TIP]
> Conceptually, this feature mimics the document-centric functionality of CosmosDB, where `JOIN` can be performed on child objects within a document. CosmosDB uses the `IN` keyword to indicate the `JOIN` is intended to iterate over array elements within the current context document.

### Relationship-based query examples

To get a dataset that includes relationships, use a single `FROM` statement followed by N `JOIN` statements, where the `JOIN` statements express relationships on the result of a previous `FROM` or `JOIN` statement.

Here is a sample relationship-based query. This code snippet selects all digital twins with an *ID* property of 'ABC', and all digital twins related to these digital twins via a *contains* relationship. 

```sql
SELECT T, CT
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
WHERE T.$dtId = 'ABC' 
```

>[!NOTE] 
> The developer does not need to correlate this `JOIN` with a key value in the `WHERE` clause (or specify a key value inline with the `JOIN` definition). This correlation is computed automatically by the system, as the relationship properties themselves classify the target entity.

You can reference the same digital twin collection multiple times in one query. The below example shows how to traverse two different relationship types, *contains* and *servicedBy*, for the digital twin `T`.

```sql
SELECT T, CT, SBT1
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
JOIN SBT1 RELATED T.servicedBy
WHERE T.$dtId = 'ABC' 
```

You can also query over multiple levels of relationships, and based on related digital twins' properties. The following example extends the previous example to get:
* the digital twins with a *v1* value of '123', that are serviced by  
    * the digital twins contained by
        * the digital twins with an *ID* property of 'ABC'

```sql
SELECT T, CT, SBT2
FROM DIGITALTWINS T
JOIN CT RELATED T.contains
JOIN SBT2 RELATED CT.servicedBy
WHERE T.$dtId = 'ABC' 
AND SBT2.v1 = 123
```

### Query properties of relationships

Similarly to the way Azure digital twins have properties described via DTDL, relationships can also have properties. 
The Azure Digital Twins Query Store Language allows filtering and projection of relationships, by assigning an alias to the relationship within the `JOIN` clause. 

As an example, consider a *servicedBy* relationship that has a *reportedCondition* property. In the below query, this relationship is given an alias of 'SBR' in order to reference its property.

```sql
SELECT T, SBT, R
FROM DIGITALTWINS T
JOIN SBT RELATED T.servicedBy R
WHERE T.$dtId = 'ABC' 
AND R.reportedCondition = 'clean'
```

In the example above, note how *reportedCondition* is a property of the *servicedBy* relationship itself (and not of a digital twin with a *servicedBy* relationship).

### Limitations

These are the current limitations on using `JOIN` in the Azure Digital Twins Query Store Language:
* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* Additional runtime limitations may be exposed, such as restricting how many levels of `JOIN` can be included.
* During the preview release, only one level of `JOIN` is supported.

## Next steps

Learn about the [Azure Digital Twins Query API](how-to-use-apis.md), which is used to run queries on the twin graph.