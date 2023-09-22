---
# Mandatory fields.
title: Query the twin graph
titleSuffix: Azure Digital Twins
description: See how to query the Azure Digital Twins twin graph for information.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/02/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy21q2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the Azure Digital Twins twin graph

This article offers query examples and instructions for using the *Azure Digital Twins query language* to query your [twin graph](concepts-twins-graph.md) for information. (For an introduction to the query language, see [Query language](concepts-query-language.md).)

The article contains sample queries that illustrate the query language structure and common query operations for digital twins. It also describes how to run your queries after you've written them, using the [Azure Digital Twins Query API](/rest/api/digital-twins/dataplane/query) or an [SDK](concepts-apis-sdks.md#data-plane-apis).

> [!NOTE]
> If you're running the sample queries below with an API or SDK call, you'll need to condense the query text into a single line.

[!INCLUDE [digital-twins-query-reference.md](../../includes/digital-twins-query-reference.md)]

## Show all digital twins

Here's the basic query that will return a list of all digital twins in the instance:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="GetAllTwins":::

## Query by property

Get digital twins by properties (including ID and metadata):

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByProperty1":::

As shown in the query above, the ID of a digital twin is queried using the metadata field `$dtId`.

>[!TIP]
> If you are using Cloud Shell to run a query with metadata fields that begin with `$`, you should escape the `$` with a backslash to let Cloud Shell know it's not a variable and should be consumed as a literal in the query text.

You can also get twins based on whether a certain property is defined. Here's a query that gets twins that have a defined `Location` property:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByProperty2":::

This query can help you get twins by their `tag` properties, as described in [Add tags to digital twins](how-to-use-tags.md). Here's a query that gets all twins tagged with `red`:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryMarkerTags1":::

You can also get twins based on the type of a property. Here's a query that gets twins whose `Temperature` property is a number:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByProperty3":::

### Query Map properties

If a property is of the complex type `Map`, you can use the map keys and values directly in the query, like this:
:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByProperty4":::

If the map key starts with a numeric character, you'll need to wrap the key in double square brackets (`[[<mapKey>]]`) to escape it in the query, similar to the strategy for [querying with reserved keywords](reference-query-reserved.md#escaping-reserved-keywords-in-queries).

## Query by model

The `IS_OF_MODEL` operator can be used to filter based on the twin's [model](concepts-models.md).

It considers [inheritance](concepts-models.md#model-inheritance) and model [versioning](how-to-manage-model.md#update-models), and evaluates to `true` for a given twin if the twin meets either of these conditions:

* The twin directly implements the model provided to `IS_OF_MODEL()`, and the version number of the model on the twin is greater than or equal to the version number of the provided model
* The twin implements a model that extends the model provided to `IS_OF_MODEL()`, and the twin's extended model version number is greater than or equal to the version number of the provided model

So for example, if you query for twins of the model `dtmi:example:widget;4`, the query will return all twins based on version 4 or greater of the widget model, and also twins based on version 4 or greater of any models that inherit from widget.

`IS_OF_MODEL` can take several different parameters, and the rest of this section is dedicated to its different overload options.

The simplest use of `IS_OF_MODEL` takes only a `twinTypeName` parameter: `IS_OF_MODEL(twinTypeName)`.
Here's a query example that passes a value in this parameter:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByModel1":::

To specify a twin collection to search when there's more than one (like when a `JOIN` is used), add the `twinCollection` parameter: `IS_OF_MODEL(twinCollection, twinTypeName)`.
Here's a query example that adds a value for this parameter:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByModel2":::

To do an exact match, add the `exact` parameter: `IS_OF_MODEL(twinTypeName, exact)`.
Here's a query example that adds a value for this parameter:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByModel3":::

You can also pass all three arguments together: `IS_OF_MODEL(twinCollection, twinTypeName, exact)`.
Here's a query example specifying a value for all three parameters:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByModel4":::

## Query by relationship

When querying based on digital twins' relationships, the Azure Digital Twins query language has a special syntax.

Relationships are pulled into the query scope in the `FROM` clause. Unlike in "classical" SQL-type languages, each expression in the `FROM` clause isn't a table; rather, the `FROM` clause expresses a cross-entity relationship traversal. To traverse across relationships, Azure Digital Twins uses a custom version of `JOIN`.

Recall that with the Azure Digital Twins [model](concepts-models.md) capabilities, relationships don't exist independently of twins, meaning that relationships here can't be queried independently and must be tied to a twin.
To reflect this fact, the keyword `RELATED` is used in the `JOIN` clause to pull in the set of a certain type of relationship coming from the twin collection. The query must then filter in the `WHERE` clause, to indicate which specific twin(s) to use in the relationship query (using the twins' `$dtId` values).

The following sections give examples of what this looks like.

### Basic relationship query

Here's a sample relationship-based query. This code snippet selects all digital twins with an `ID` property of `ABC`, and all digital twins related to these digital twins via a `contains` relationship.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByRelationship1":::

The type of the relationship (`contains` in the example above) is indicated using the relationship's `name` field from its [DTDL definition](concepts-models.md#basic-relationship-example).

> [!NOTE]
> The developer does not need to correlate this `JOIN` with a key value in the `WHERE` clause (or specify a key value inline with the `JOIN` definition). This correlation is computed automatically by the system, as the relationship properties themselves identify the target entity.

### Query by the source or target of a relationship

You can use the relationship query structure to identify a digital twin that's the source or the target of a relationship.

For instance, you can start with a source twin and follow its relationships to find the target twins of the relationships. Here's an example of a query that finds the target twins of the `feeds` relationships coming from the twin source-twin.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByRelationshipSource":::

You can also start with the target of the relationship and trace the relationship back to find the source twin. Here's an example of a query that finds the source twin of a `feeds` relationship to the twin target-twin.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByRelationshipTarget":::

### Query the properties of a relationship

Similarly to the way digital twins have properties described via DTDL, relationships can also have properties. You can query twins based on the properties of their relationships.
The Azure Digital Twins query language allows filtering and projection of relationships, by assigning an alias to the relationship within the `JOIN` clause.

As an example, consider a `servicedBy` relationship that has a `reportedCondition` property. In the below query, this relationship is given an alias of `R` to reference its property.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByRelationship2":::

In the example above, note how `reportedCondition` is a property of the `servicedBy` relationship itself (NOT of some digital twin that has a `servicedBy` relationship).

### Query with multiple JOINs

Up to five `JOIN`s are supported in a single query, which allows you to traverse multiple levels of relationships at once. 

To query on multiple levels of relationships, use a single `FROM` statement followed by N `JOIN` statements, where the `JOIN` statements express relationships on the result of a previous `FROM` or `JOIN` statement.

Here's an example of a multi-join query, which gets all the light bulbs contained in the light panels in rooms 1 and 2.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="QueryByRelationship3":::

## Count items

You can count the number of items in a result set using the `Select COUNT` clause:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="SelectCount1":::

Add a `WHERE` clause to count the number of items that meet a certain criteria. Here are some examples of counting with an applied filter based on the type of twin model (for more on this syntax, see [Query by model](#query-by-model) below):

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="SelectCount2":::

You can also use `COUNT` along with the `JOIN` clause. Here's a query that counts all the light bulbs contained in the light panels of rooms 1 and 2:

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="SelectCount3":::

## Filter results: select top items

You can select the several "top" items in a query using the `Select TOP` clause.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="SelectTop":::

## Filter results: specify return set with projections

By using projections in the `SELECT` statement, you can choose which columns a query will return. Projection is now supported for both primitive and complex properties. For more information about projections with Azure Digital Twins, see the [SELECT clause reference documentation](reference-query-clause-select.md#select-columns-with-projections).

Here's an example of a query that uses projection to return twins and relationships. The following query projects the Consumer, Factory, and Edge from a scenario where a Factory with an ID of `ABC` is related to the Consumer through a relationship of `Factory.customer`, and that relationship is presented as the `Edge`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="Projections1":::

You can also use projection to return a property of a twin. The following query projects the `Name` property of the Consumers that are related to the Factory with an ID of `ABC` through a relationship of `Factory.customer`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="Projections2":::

You can also use projection to return a property of a relationship. Like in the previous example, the following query projects the `Name` property of the Consumers related to the Factory with an ID of `ABC` through a relationship of `Factory.customer`; but now it also returns two properties of that relationship, `prop1` and `prop2`. It does this by naming the relationship `Edge` and gathering its properties.  

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="Projections3":::

You can also use aliases to simplify queries with projection.

The following query does the same operations as the previous example, but it aliases the property names to `consumerName`, `first`, `second`, and `factoryArea`.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="Projections4":::

Here's a similar query that queries the same set as above, but projects only the `Consumer.name` property as `consumerName`, and projects the complete Factory as a twin.

:::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="Projections5":::

## Build efficient queries with the IN operator

You can significantly reduce the number of queries you need by building an array of twins and querying with the `IN` operator. 

For example, consider a scenario in which Buildings contain Floors and Floors contain Rooms. To search for rooms within a building that are hot, one way is to follow these steps.

1. Find floors in the building based on the `contains` relationship.

    :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="INOperatorWithout":::

2. To find rooms, instead of considering the floors one-by-one and running a `JOIN` query to find the rooms for each one, you can query with a collection of the floors in the building (named Floor in the query below).

    In client app:
    
    ```csharp
    var floors = "['floor1','floor2', ..'floorn']"; 
    ```
    
    In query:
    
    :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="INOperatorWith":::

## Other compound query examples

You can combine any of the above types of query using combination operators to include more detail in a single query. Here are some other examples of compound queries that query for more than one type of twin descriptor at once.

* Out of the devices that Room 123 has, return the MxChip devices that serve the role of Operator
    :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="OtherExamples1":::
* Get twins that have a relationship named `Contains` with another twin that has an ID of `id1`
    :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="OtherExamples2":::
* Get all the rooms of this room model that are contained by floor11
    :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="OtherExamples3":::

## Run queries with the API

Once you've decided on a query string, you execute it by making a call to the [Query API](/rest/api/digital-twins/dataplane/query).

You can call the API directly, or use one of the [SDKs](concepts-apis-sdks.md#data-plane-apis) available for Azure Digital Twins.

The following code snippet illustrates the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme) call from a client app:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/queries.cs" id="RunQuery":::

The query used in this call returns a list of digital twins, which the above example represents with [BasicDigitalTwin](/dotnet/api/azure.digitaltwins.core.basicdigitaltwin?view=azure-dotnet&preserve-view=true) objects. The return type of your data for each query will depend on what terms you specify with the `SELECT` statement:
* Queries that begin with `SELECT * FROM ...` will return a list of digital twins (which can be serialized as `BasicDigitalTwin` objects, or other custom digital twin types that you may have created).
* Queries that begin in the format `SELECT <A>, <B>, <C> FROM ...` will return a dictionary with keys `<A>`, `<B>`, and `<C>`.
* Other formats of `SELECT` statements can be crafted to return custom data. You might consider creating your own classes to handle customized result sets. 

### Query with paging

Query calls support paging. Here's a complete example using `BasicDigitalTwin` as query result type with error handling and paging:

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/queries.cs" id="FullQuerySample":::

## Next steps

Learn more about the [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md), including the Query API that is used to run the queries from this article.
