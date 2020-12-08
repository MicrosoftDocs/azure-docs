---
# Mandatory fields.
title: Query the twin graph
titleSuffix: Azure Digital Twins
description: See how to query the Azure Digital Twins twin graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/19/2020
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperfq2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins twin graph

This article offers query examples and more detailed instructions for using the **Azure Digital Twins query language** to query your [twin graph](concepts-twins-graph.md) for information. (For an introduction to the query language and a full list of its features, see [*Concepts: Query language*](concepts-query-language.md).)

This article begins with sample queries that illustrate the query language structure and common query operations for digital twins. It then describes how to run your queries after you've written them, using the Azure Digital Twins [Query API](/rest/api/digital-twins/dataplane/query) or an [SDK](how-to-use-apis-sdks.md#overview-data-plane-apis).

> [!TIP]
> If you're running the sample queries below with an API or SDK call, you'll need to condense the query text into a single line.

## Show all digital twins

Here is the basic query that will return a list of all digital twins in the instance:

```sql
SELECT *
FROM DIGITALTWINS
```

## Query by property

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
SELECT *​ FROM DIGITALTWINS WHERE IS_DEFINED(Location)
```

This can help you to get twins by their *tag* properties, as described in [Add tags to digital twins](how-to-use-tags.md). Here is a query that gets all twins tagged with *red*:

```sql
SELECT * FROM DIGITALTWINS WHERE IS_DEFINED(tags.red)
```

You can also get twins based on the **type of a property**. Here is a query that gets twins whose *Temperature* property is a number:

```sql
SELECT * FROM DIGITALTWINS​ T WHERE IS_NUMBER(T.Temperature)
```

## Query by model

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

## Query by relationship

When querying based on digital twins' **relationships**, the Azure Digital Twins query language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. An important distinction from "classical" SQL-type languages is that each expression in this `FROM` clause is not a table; rather, the `FROM` clause expresses a cross-entity relationship traversal, and is written with an Azure Digital Twins version of `JOIN`.

Recall that with the Azure Digital Twins [model](concepts-models.md) capabilities, relationships do not exist independently of twins. This means the Azure Digital Twins query language's `JOIN` is a little different from the general SQL `JOIN`, as relationships here can't be queried independently and must be tied to a twin.
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

> [!NOTE]
> The developer does not need to correlate this `JOIN` with a key value in the `WHERE` clause (or specify a key value inline with the `JOIN` definition). This correlation is computed automatically by the system, as the relationship properties themselves identify the target entity.

### Query the properties of a relationship

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

## Count items

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

## Filter results: select top items

You can select the several "top" items in a query using the `Select TOP` clause.

```sql
SELECT TOP (5)
FROM DIGITALTWINS
WHERE ...
```

## Filter results: specify return set with projections

By using projections in the `SELECT` statement, you can choose which columns a query will return.

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

The following query does the same operations as the previous example, but it aliases the property names to `consumerName`, `first`, `second`, and `factoryArea`.

```sql
SELECT Consumer.name AS consumerName, Edge.prop1 AS first, Edge.prop2 AS second, Factory.area AS factoryArea
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area) AND IS_PRIMITIVE(Consumer.name) AND IS_PRIMITIVE(Edge.prop1) AND IS_PRIMITIVE(Edge.prop2)
```

Here is a similar query that queries the same set as above, but projects only the *Consumer.name* property as `consumerName`, and projects the complete *Factory* as a twin.

```sql
SELECT Consumer.name AS consumerName, Factory
FROM DIGITALTWINS Factory
JOIN Consumer RELATED Factory.customer Edge
WHERE Factory.$dtId = 'ABC'
AND IS_PRIMITIVE(Factory.area) AND IS_PRIMITIVE(Consumer.name)
```

## Build efficient queries with the IN operator

You can significantly reduce the number of queries you need by building an array of twins and querying with the `IN` operator. 

For example, consider a scenario in which *Buildings* contain *Floors* and *Floors* contain *Rooms*. To search for rooms within a building that are hot, one way is to follow these steps.

1. Find floors in the building based on the `contains` relationship.

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

## Other compound query examples

You can **combine** any of the above types of query using combination operators to include more detail in a single query. Here are some additional examples of compound queries that query for more than one type of twin descriptor at once.

| Description | Query |
| --- | --- |
| Out of the devices that *Room 123* has, return the MxChip devices that serve the role of Operator | `SELECT device​`<br>​`FROM DigitalTwins space​`​<br>​`JOIN device RELATED space.has​`<br>​`WHERE space.$dtid = 'Room 123'`​<br>​`AND device.$metadata.model = 'dtmi:contoso:com:DigitalTwins:MxChip:3'`<br>​`AND has.role = 'Operator'` ​|
| Get twins that have a relationship named *Contains* with another twin that has an ID of *id1* | ​`​SELECT Room​`​<br>​`FROM DIGITALTWINS Room​​`​<br>​`JOIN Thermostat RELATED Room.Contains​​`​<br>​`WHERE Thermostat.$dtId = 'id1'`​ |
| Get all the rooms of this room model that are contained by *floor11* | `SELECT Room`​<br>​`FROM DIGITALTWINS Floor​`​<br>​`JOIN Room RELATED Floor.Contains​`​<br>​`WHERE Floor.$dtId = 'floor11'​`​<br>​`AND IS_OF_MODEL(Room, 'dtmi:contoso:com:DigitalTwins:Room;1')​` |

## Run queries with the API

Once you have decided on a query string, you execute it by making a call to the [**Query API**](/rest/api/digital-twins/dataplane/query).

You can call the API directly, or use one of the [SDKs](how-to-use-apis-sdks.md#overview-data-plane-apis) available for Azure Digital Twins.

The following code snippet illustrates the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true) call from a client app:

```csharp
    string adtInstanceEndpoint = "https://<your-instance-hostname>";

    var credential = new DefaultAzureCredential();
    DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceEndpoint), credential);

    // Run a query for all twins   
    string query = "SELECT * FROM DIGITALTWINS";
    AsyncPageable<BasicDigitalTwin> result = client.QueryAsync<BasicDigitalTwin>(query);
```

This call returns query results in the form of a [BasicDigitalTwin](/dotnet/api/azure.digitaltwins.core.basicdigitaltwin?view=azure-dotnet&preserve-view=true) object.

Query calls support paging. Here is a complete example using `BasicDigitalTwin` as query result type with error handling and paging:

```csharp
try
{
    await foreach(BasicDigitalTwin twin in result)
        {
            // You can include your own logic to print the result
            // The logic below prints the twin's ID and contents
            Console.WriteLine($"Twin ID: {twin.Id} \nTwin data");
            IDictionary<string, object> contents = twin.Contents;
            foreach (KeyValuePair<string, object> kvp in contents)
            {
                Console.WriteLine($"{kvp.Key}  {kvp.Value}");
            }
        }
}
catch (RequestFailedException e)
{
    Console.WriteLine($"Error {e.Status}: {e.Message}");
    throw;
}
```

## Next steps

Learn more about the [Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md), including the Query API that is used to run the queries from this article.
