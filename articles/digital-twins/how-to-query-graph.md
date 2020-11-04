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

This article offers examples and more detail for using the [Azure Digital Twins query language](concepts-query-language.md) to query the [twin graph](concepts-twins-graph.md) for information. You run queries on the graph using the Azure Digital Twins [**Query APIs**](/rest/api/digital-twins/dataplane/query).

[!INCLUDE [digital-twins-query-operations.md](../../includes/digital-twins-query-operations.md)]

The rest of this article provides examples of how to use these operations.

## Query syntax

This section contains sample queries that illustrate the query language structure and perform possible query operations on [digital twins](concepts-twins-graph.md).

### Show all existing digital twins

Here is the basic query that will return a list of all digital twins in the instance:

```sql
SELECT *
FROM DIGITALTWINS
```

### Select top items

You can select the several "top" items in a query using the `Select TOP` clause.

```sql
SELECT TOP (5)
FROM DIGITALTWINS
WHERE ...
```

### Count items

You can count the number of items in a result set using the `Select COUNT` clause:

```sql
SELECT COUNT()
FROM DIGITALTWINS
```

Add a `WHERE` clause to count the number of items that meet a certain criteria. Here are some examples of counting with an applied filter based on the type of twin model (for more on this syntax, see [*Query by model*](#query-by-model) below):

```sql
SELECT COUNT()
FROM DIGITALTWINS
WHERE IS_OF_MODEL('dtmi:sample:Room;1')

SELECT COUNT()
FROM DIGITALTWINS c
WHERE IS_OF_MODEL('dtmi:sample:Room;1') AND c.Capacity > 20
```

You can also use `COUNT` along with the `JOIN` clause. Here is a query that counts all the light bulbs contained in the light panels of rooms 1 and 2:

```sql
SELECT COUNT()  
FROM DIGITALTWINS Room  
JOIN LightPanel RELATED Room.contains  
JOIN LightBulb RELATED LightPanel.contains  
WHERE IS_OF_MODEL(LightPanel, 'dtmi:contoso:com:lightpanel;1')  
AND IS_OF_MODEL(LightBulb, 'dtmi:contoso:com:lightbulb ;1')  
AND Room.$dtId IN ['room1', 'room2']
```

### Specify return set with projections

Using projections, you can choose which columns a query will return.

>[!NOTE]
>At this time, complex properties are not supported. To make sure that projection properties are valid, combine the projections with an `IS_PRIMITIVE` check.

Here is an example of a query that uses projection to return twins and relationships. The following query projects the *Consumer*, *Factory* and *Edge* from a scenario where a *Factory* with an ID of *ABC* is related to the *Consumer* through a relationship of *Factory.customer*, and that relationship is presented as the *Edge*.

```sql
SELECT Consumer, Factory, Edge
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
```

You can also use projection to return a property of a twin. The following query projects the *Name* property of the *Consumers* that are related to the *Factory* with an ID of *ABC* through a relationship of *Factory.customer*.

```sql
SELECT Consumer.name
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Consumer.name)
```

You can also use projection to return a property of a relationship. Like in the previous example, the following query projects the *Name* property of the *Consumers* related to the *Factory* with an ID of *ABC* through a relationship of *Factory.customer*; but now it also returns two properties of that relationship, *prop1* and *prop2*. It does this by naming the relationship *Edge* and gathering its properties.  

```sql
SELECT Consumer.name, Edge.prop1, Edge.prop2, Factory.area
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area) AND IS_PRIMITIVE(Consumer.name) AND IS_PRIMITIVE(Edge.prop1) AND IS_PRIMITIVE(Edge.prop2)
```

You can also use aliases to simplify queries with projection.

The following query does the same operations as the previous example, but it aliases the property names to `consumerName`, `first`, `second` and `factoryArea`.

```sql
SELECT Consumer.name AS consumerName, Edge.prop1 AS first, Edge.prop2 AS second, Factory.area AS factoryArea
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area) AND IS_PRIMITIVE(Consumer.name) AND IS_PRIMITIVE(Edge.prop1) AND IS_PRIMITIVE(Edge.prop2)"
```

Here is a similar query that queries the same set as above, but projects only the *Consumer.name* property as `consumerName`, and projects the complete *Factory* as a twin.

```sql
SELECT Consumer.name AS consumerName, Factory
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area) AND IS_PRIMITIVE(Consumer.name)
```

### Query by property

Get digital twins by **properties** (including ID and metadata):

```sql
SELECT  *
FROM DigitalTwins T  
WHERE T.firmwareVersion = '1.1'
AND T.$dtId in ['123', '456']
AND T.Temperature = 70
```

> [!TIP]
> The ID of a digital twin is queried using the metadata field `$dtId`.

You can also get twins based on **whether a certain property is defined**. Here is a query that gets twins that have a defined *Location* property:

```sql
SELECT *​
FROM DIGITALTWINS WHERE IS_DEFINED(Location)
```

This can help you to get twins by their *tag* properties, as described in [Add tags to digital twins](how-to-use-tags.md). Here is a query that gets all twins tagged with *red*:

```sql
SELECT * FROM DIGITALTWINS WHERE IS_DEFINED(tags.red)
```

You can also get twins based on the **type of a property**. Here is a query that gets twins whose *Temperature* property is a number:

```sql
SELECT * FROM DIGITALTWINS​ T
WHERE IS_NUMBER(T.Temperature)
```

### Query by model

The `IS_OF_MODEL` operator can be used to filter based on the twin's [**model**](concepts-models.md).

It considers [inheritance](concepts-models.md#model-inheritance) and model [versioning](how-to-manage-model.md#update-models), and evaluates to **true** for a given twin if the twin meets either of these conditions:

* The twin directly implements the model provided to `IS_OF_MODEL()`, and the version number of the model on the twin is *greater than or equal to* the version number of the provided model
* The twin implements a model that *extends* the model provided to `IS_OF_MODEL()`, and the twin's extended model version number is *greater than or equal to* the version number of the provided model

So for example, if you query for twins of the model `dtmi:example:widget;4`, the query will return all twins based on **version 4 or greater** of the **widget** model, and also twins based on version **4 or greater** of any **models that inherit from widget**.

`IS_OF_MODEL` can take several different parameters, and the rest of this section is dedicated to its different overload options.

The simplest use of `IS_OF_MODEL` takes only a `twinTypeName` parameter: `IS_OF_MODEL(twinTypeName)`.
Here is a query example that passes a value in this parameter:

```sql
SELECT * FROM DIGITALTWINS WHERE IS_OF_MODEL('dtmi:example:thing;1')
```

To specify a twin collection to search when there is more than one (like when a `JOIN` is used), add the `twinCollection` parameter: `IS_OF_MODEL(twinCollection, twinTypeName)`.
Here is a query example that adds a value for this parameter:

```sql
SELECT * FROM DIGITALTWINS DT WHERE IS_OF_MODEL(DT, 'dtmi:example:thing;1')
```

To do an exact match, add the `exact` parameter: `IS_OF_MODEL(twinTypeName, exact)`.
Here is a query example that adds a value for this parameter:

```sql
SELECT * FROM DIGITALTWINS WHERE IS_OF_MODEL('dtmi:example:thing;1', exact)
```

You can also pass all three arguments together: `IS_OF_MODEL(twinCollection, twinTypeName, exact)`.
Here is a query example specifying a value for all three parameters:

```sql
SELECT ROOM FROM DIGITALTWINS DT WHERE IS_OF_MODEL(DT, 'dtmi:example:thing;1', exact)
```

### Query based on relationships

When querying based on digital twins' **relationships**, the Azure Digital Twins query language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. An important distinction from "classical" SQL-type languages is that each expression in this `FROM` clause is not a table; rather, the `FROM` clause expresses a cross-entity relationship traversal, and is written with an Azure Digital Twins version of `JOIN`.

Recall that with the Azure Digital Twins [model](concepts-models.md) capabilities, relationships do not exist independently of twins. This means the Azure Digital Twins query language's `JOIN` is a little different from the general SQL `JOIN`, as relationships here can't be queried independently and must be tied to a twin.
To incorporate this difference, the keyword `RELATED` is used in the `JOIN` clause to reference a twin's set of relationships.

The following section gives several examples of what this looks like.

> [!TIP]
> Conceptually, this feature mimics the document-centric functionality of CosmosDB, where `JOIN` can be performed on child objects within a document. CosmosDB uses the `IN` keyword to indicate the `JOIN` is intended to iterate over array elements within the current context document.

#### Relationship-based query examples

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

#### Query the properties of a relationship

Similarly to the way digital twins have properties described via DTDL, relationships can also have properties. You can query twins **based on the properties of their relationships**.
The Azure Digital Twins query language allows filtering and projection of relationships, by assigning an alias to the relationship within the `JOIN` clause.

As an example, consider a *servicedBy* relationship that has a *reportedCondition* property. In the below query, this relationship is given an alias of 'R' in order to reference its property.

```sql
SELECT T, SBT, R
FROM DIGITALTWINS T
JOIN SBT RELATED T.servicedBy R
WHERE T.$dtId = 'ABC'
AND R.reportedCondition = 'clean'
```

In the example above, note how *reportedCondition* is a property of the *servicedBy* relationship itself (NOT of some digital twin that has a *servicedBy* relationship).

### Query with multiple JOINs

Up to five `JOIN`s are supported in a single query. This allows you to traverse multiple levels of relationships at once.

Here is an example of a multi-join query, which gets all the light bulbs contained in the light panels in rooms 1 and 2.

```sql
SELECT LightBulb
FROM DIGITALTWINS Room
JOIN LightPanel RELATED Room.contains
JOIN LightBulb RELATED LightPanel.contains
WHERE IS_OF_MODEL(LightPanel, 'dtmi:contoso:com:lightpanel;1')
AND IS_OF_MODEL(LightBulb, 'dtmi:contoso:com:lightbulb ;1')
AND Room.$dtId IN ['room1', 'room2']
```

### Other compound query examples

You can **combine** any of the above types of query using combination operators to include more detail in a single query. Here are some additional examples of compound queries that query for more than one type of twin descriptor at once.

| Description | Query |
| --- | --- |
| Out of the devices that *Room 123* has, return the MxChip devices that serve the role of Operator | `SELECT device​`<br>​`FROM DigitalTwins space​`​<br>​`JOIN device RELATED space.has​`<br>​`WHERE space.$dtid = 'Room 123'`​<br>​`AND device.$metadata.model = 'dtmi:contosocom:DigitalTwins:MxChip:3'`<br>​`AND has.role = 'Operator'` ​|
| Get twins that have a relationship named *Contains* with another twin that has an ID of *id1* | ​`​SELECT Room​`​<br>​`FROM DIGITALTWINS Room​​`​<br>​`JOIN Thermostat RELATED Room.Contains​​`​<br>​`WHERE Thermostat.$dtId = 'id1'`​ |
| Get all the rooms of this room model that are contained by *floor11* | `SELECT Room`​<br>​`FROM DIGITALTWINS Floor​`​<br>​`JOIN Room RELATED Floor.Contains​`​<br>​`WHERE Floor.$dtId = 'floor11'​`​<br>​`AND IS_OF_MODEL(Room, 'dtmi:contosocom:DigitalTwins:Room;1')​` |

## Reference: Expressions and conditions

This section contains reference for the operators and functions available when writing Azure Digital Twins queries.

### Operators

The following operators are supported:

| Family | Operators |
| --- | --- |
| Logical |AND, OR, NOT |
| Comparison |=, !=, <, >, <=, >= |
| Contains | IN, NIN |

### Functions

The following type checking and casting functions are supported:

| Function | Description |
| -------- | ----------- |
| IS_DEFINED | Returns a Boolean indicating if the property has been assigned a value. This is supported only when the value is a primitive type. Primitive types include string, Boolean, numeric, or `null`. DateTime, object types and arrays are not supported. |
| IS_OF_MODEL | Returns a Boolean value indicating if the specified twin matches the specified model type |
| IS_BOOL | Returns a Boolean value indicating if the type of the specified expression is a Boolean. |
| IS_NUMBER | Returns a Boolean value indicating if the type of the specified expression is a number. |
| IS_STRING | Returns a Boolean value indicating if the type of the specified expression is a string. |
| IS_NULL | Returns a Boolean value indicating if the type of the specified expression is null. |
| IS_PRIMITIVE | Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or `null`). |
| IS_OBJECT | Returns a Boolean value indicating if the type of the specified expression is a JSON object. |

The following string functions are supported:

| Function | Description |
| -------- | ----------- |
| STARTSWITH(x, y) | Returns a Boolean indicating whether the first string expression starts with the second. |
| ENDSWITH(x, y) | Returns a Boolean indicating whether the first string expression ends with the second. |

## Run queries with an API call

Once you have decided on a query string, you execute it by making a call to the **Query API**.
The following code snippet illustrates this call from the client app:

```csharp

var adtInstanceEndpoint = new Uri(your-Azure-Digital-Twins-instance-URL>);
var tokenCredential = new DefaultAzureCredential();

var client = new DigitalTwinsClient(adtInstanceEndpoint, tokenCredential);

string query = "SELECT * FROM digitaltwins";
AsyncPageable<string> result = await client.QueryAsync<string>(query);
```

This call returns query results in the form of a string object.

Query calls support paging. Here is a complete example using `BasicDigitalTwin` as query result type with error handling and paging:

```csharp
string query = "SELECT * FROM digitaltwins";
try
{
    AsyncPageable<BasicDigitalTwin> qresult = client.QueryAsync<BasicDigitalTwin>(query);
    await foreach (BasicDigitalTwin item in qresult)
    {
        // Do something with each result
    }
}
catch (RequestFailedException e)
{
    Log.Error($"Error {e.Status}: {e.Message}");
    throw;
}
```

## Query limitations

There may be a delay of up to 10 seconds before changes in your instance are reflected in queries. For example, if you complete an operation like creating or deleting twins with the DigitalTwins API, the result may not be immediately reflected in Query API requests. Waiting for a short period should be sufficient to resolve.

There are additional limitations on using `JOIN`.

* No subqueries are supported within the `FROM` statement.
* `OUTER JOIN` semantics are not supported, meaning if the relationship has a rank of zero, then the entire "row" is eliminated from the output result set.
* Graph traversal depth is restricted to five `JOIN` levels per query.
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
