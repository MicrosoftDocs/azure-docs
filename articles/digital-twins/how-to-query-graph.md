---
# Mandatory fields.
title: Query the twin graph
titleSuffix: Azure Digital Twins
description: See how to query the Azure Digital Twins twin graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/26/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins twin graph

This article goes in-depth on using the [Azure Digital Twins Query Store language](concepts-query-language.md) to query the [twin graph](concepts-twins-graph.md) for information. You run queries on the graph using the Azure Digital Twins [**Query APIs**](how-to-use-apis-sdks.md).

## Query syntax

Here are some sample queries that illustrate the query language structure and perform possible query operations.

Get [digital twins](concepts-twins-graph.md) by properties (including ID and metadata):
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.firmwareVersion = '1.1'
AND T.$dtId in ['123', '456']
AND T.Temperature = 70
```

Get digital twins by [model](concepts-models.md)
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE IS_OF_MODEL(T , 'dtmi:com:contoso:Space;3')
AND T.roomSize > 50
```

> [!TIP]
> The ID of a digital twin is queried using the metadata field `$dtId`.

## Run queries with an API call

Once you have decided on a query string, you execute it by making a call to the **Query API**.
The following code snippet illustrates this call from the client app:

```csharp
var client = new AzureDigitalTwinsAPIClient(<your-credentials>);
client.BaseUri = new Uri(<your-Azure-Digital-Twins-instance-URL>);

QuerySpecification spec = new QuerySpecification("SELECT * FROM digitaltwins");
QueryResult result = await client.Query.QueryTwinsAsync(spec);
```

This call returns query results in the form of a QueryResult object. 

Query calls support paging. Here is a complete example with error handling and paging:

```csharp
string query = "SELECT * FROM digitaltwins";
try
{
    AsyncPageable<string> qresult = client.QueryAsync(query);
    await foreach (string item in qresult) 
    {
        // Do something with each result
    }
}
catch (RequestFailedException e)
{
    Log.Error($"Error {e.Status}: {e.Message}");
    return null;
}
```

## Query based on relationships

When querying based on digital twins' relationships, Azure Digital Twins Query Store language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. An important distinction from "classical" SQL-type languages is that each expression in this `FROM` clause is not a table; rather, the `FROM` clause expresses a cross-entity relationship traversal, and is written with an Azure Digital Twins version of `JOIN`. 

Recall that with the Azure Digital Twins [model](concepts-models.md) capabilities, relationships do not exist independently of twins. This means the Azure Digital Twins Query Store language's `JOIN` is a little different from the general SQL `JOIN`, as relationships here can't be queried independently and must be tied to a twin.
To incorporate this difference, the keyword `RELATED` is used in the `JOIN` clause to reference a twin's set of relationships. 

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
> The developer does not need to correlate this `JOIN` with a key value in the `WHERE` clause (or specify a key value inline with the `JOIN` definition). This correlation is computed automatically by the system, as the relationship properties themselves identify the target entity.

### Query the properties of a relationship

Similarly to the way digital twins have properties described via DTDL, relationships can also have properties. 
The Azure Digital Twins Query Store language allows filtering and projection of relationships, by assigning an alias to the relationship within the `JOIN` clause. 

As an example, consider a *servicedBy* relationship that has a *reportedCondition* property. In the below query, this relationship is given an alias of 'R' in order to reference its property.

```sql
SELECT T, SBT, R
FROM DIGITALTWINS T
JOIN SBT RELATED T.servicedBy R
WHERE T.$dtId = 'ABC' 
AND R.reportedCondition = 'clean'
```

In the example above, note how *reportedCondition* is a property of the *servicedBy* relationship itself (NOT of some digital twin that has a *servicedBy* relationship).

### Query limitations

There may be a delay of up to 10 seconds before changes in your instance are reflected in queries. For example, if you complete an operation like creating or deleting twins with the DigitalTwins API, the result may not be immediately reflected in Query API requests. Waiting for a short period should be sufficient to resolve.

There are additional limitations on using `JOIN` during preview.
* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* During public preview, graph traversal depth is restricted: only one `JOIN` is allowed per query.
* The source for `JOIN` operations is restricted: query must declare the twins where the query begins.

## Query best practices

Below are some tips for querying with Azure Digital Twins.

* Consider the query pattern during the model design phase. Try to make sure relationships that need to be answered in a single query are modeled as a single-level relationship.
* Design properties in a way that will avoid large result sets from graph traversal.
* You can significantly reduce the number of queries you need by building an array of twins and querying with the `IN` operator. For example, consider a scenario in which *Buildings* contain *Floors* and *Floors* contain *Rooms*. To search for rooms within a building that are hot, you can:

    1. Find floors in the building based on `contains` relationship
        ```sql
        SELECT Floor
        FROM DIGITALTWINS Building
        JOIN Floor RELATED Building.contains
        WHERE Building.$dtId = @buildingId
        ``` 
    2. To find rooms, instead of considering the floors one-by-one and running a `JOIN` query to find the rooms for each one, you can query with a collection of the floors in the building (named *Floor* in the query below).

        In client app:
        ```csharp
        var floors = "['floor1','floor2', ..'floorn']"; 
        ```
        In query:
        ```sql
        SELECT Room
        FROM DIGITALTWINS Floor
        JOIN Room RELATED Floor.contains
        WHERE Floor.$dtId IN ['floor1','floor2', ..'floorn']
        AND Room. Temperature > 72
        AND IS_OF_MODEL(Room, 'dtmi:com:contoso:Room;1')
        ```
* Property names and values are case-sensitive, so take care to use the exact names defined in the models. If property names are misspelled or incorrectly cased, the result set is empty with no errors returned.


## Next steps

Learn more about the [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), including the Query API which is used to run the queries from this article.
