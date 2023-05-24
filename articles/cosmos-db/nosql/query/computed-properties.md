---
title: Computed properties in Azure Cosmos DB
description: Learn how computed properties simplify complex queries and how they can increase query performance.
author: jcocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: jucocchi
ms.reviewer: jucocchi
---
# Computed properties in Azure Cosmos DB (preview)
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Computed properties in Azure Cosmos DB have values derived from existing item properties but aren't persisted in items themselves. These properties are scoped to a single item and can be referenced in queries as if they were persisted properties. Computed properties make it easier to write complex query logic once and reference it many times. You can add a single index on these properties or use them as part of a composite index for increased performance.

> [!Note]
> Do you have any feedback about computed properties? We want to hear it! Feel free to share feedback directly with the Azure Cosmos DB engineering team: cosmoscomputedprops@microsoft.com

## Computed property definition

Computed properties must be at the top level in the item and can't have a nested path. Each computed property definition has two components: a name and a query. The name is the computed property name, and the query defines logic to calculate the property value for each item. Computed properties are scoped to an individual item and therefore can't use values from multiple items or rely on other computed properties. Every container can have a maximum of 20 computed properties.

Example computed property definition:
```json
{ 
    "computedProperties": [ 
        { 
            "name": "cp_lowerName", 
            "query": "SELECT VALUE LOWER(c.name) FROM c" 
        } 
    ] 
} 
```

### Name constraints

It's strongly recommended that computed properties are named in such a way that there's no collision with a persisted property name. To avoid overlapping property names, you can add a prefix or suffix to all computed property names. This article uses the prefix `cp_` in all name definitions.

> [!IMPORTANT]
> Defining a computed property with the same name as a persisted property won't give an error, but it may lead to unexpected behavior. 
> Regardless of whether the computed property is indexed, values from persisted properties that share a name with a computed property won't be included in the index. 
> Queries will always use the computed property instead of the persisted property, with the exception of the persisted property being returned instead of the computed property if there is a wildcard projection in the SELECT clause. 
> This is because wildcard projection does not automatically include computed properties.

The constraints on computed property names are:

- All computed properties must have unique names. 

- The value of name property represents the top-level property name that can be used to reference the computed property.

- Reserved system property names such as `id`, `_rid`, `_ts` etc. can't be used as computed property names.

- A computed property name can't match a property path that is already indexed. This applies to all indexing paths specified including included paths, excluded paths, spatial indexes and composite indexes.

### Query constraints

Queries in the computed property definition must be valid syntactically and semantically, otherwise the create or update operation will fail. Queries should evaluate to a deterministic value for all items in a container. 

The constraints on computed property query definitions are:

- Queries must specify a FROM clause representing the root item reference. Examples of supported FROM clauses are `FROM c`, `FROM root c` AND `FROM MyContainer c`.

- Queries must use a VALUE clause in the projection.

- Queries can't use any of the following clauses: WHERE, GROUP BY, ORDER BY, TOP, DISTINCT, OFFSET LIMIT, EXISTS, ALL, and NONE.

- Queries can't include a scalar subquery.

- Aggregate functions, spatial functions, non-deterministic functions and user defined functions aren't supported.

## Creating computed properties 

During the preview, computed properties must be created using the .NET v3 SDK. Once the computed properties have been created, you can execute queries that reference them using any method including all SDKs and Data Explorer in the Azure portal.

|**SDK** |**Supported version** |**Notes** |
|--------|----------------------|----------|
|.NET SDK v3 |>= 3.34.0-preview |Computed properties are currently only available in preview package versions. |

### Create computed properties using the SDK

You can either create a new container with computed properties defined, or add them to an existing container. 

Here's an example of how to create computed properties in a new container using the .NET SDK:

```csharp
    ContainerProperties containerProperties = new ContainerProperties("myContainer", "/pk")
    {
        ComputedProperties = new Collection<ComputedProperty>
        {
            new ComputedProperty
            {
                Name = "cp_lowerName",
                Query = "SELECT VALUE LOWER(c.name) FROM c"
            }
        }
    };

    Container container = await client.GetDatabase("myDatabase").CreateContainerAsync(containerProperties);
```

Here's an example of how to update computed properties on an existing container using the .NET SDK:

```csharp
    var container = client.GetDatabase("myDatabase").GetContainer("myContainer");

    // Read the current container properties
    var containerProperties = await container.ReadContainerAsync();
    // Make the necessary updates to the container properties
    containerProperties.Resource.ComputedProperties = new Collection<ComputedProperty>
        {
            new ComputedProperty
            {
                Name = "cp_lowerName",
                Query = "SELECT VALUE LOWER(c.name) FROM c"
            },
            new ComputedProperty
            {
                Name = "cp_upperName",
                Query = "SELECT VALUE UPPER(c.name) FROM c"
            }
        };
    // Update container with changes
    await container.ReplaceContainerAsync(containerProperties);
```

> [!TIP]
> Every time you update container properties, the old values are overwritten. 
> If you have existing computed properties and want to add new ones, ensure you add both new and existing computed properties to the collection.

## Using computed properties in queries

Computed properties can be referenced in queries the same way as persisted properties. Values for computed properties that aren't indexed are evaluated during runtime using the computed property definition. If a computed property is indexed, the index is used in the same way as it is for persisted properties, and the computed property is evaluated on an as needed basis. 

These examples use the quickstart products dataset in [Data Explorer](../../data-explorer.md). Launch the quick start to get started and load the dataset in a new container.

:::image type="content" source="./media/computed-properties/data-explorer-quickstart-data.png" alt-text="A screenshot of the Azure portal showing how to launch the quick start to load a sample dataset." border="false":::

Here's a sample item:

```json
{
    "id": "08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2",
    "categoryId": "75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C",
    "categoryName": "Bikes, Touring Bikes",
    "sku": "BK-T79U-50",
    "name": "Touring-1000 Blue, 50",
    "description": "The product called \"Touring-1000 Blue, 50\"",
    "price": 2384.07,
    "tags": [
        {
            "id": "27B7F8D5-1009-45B8-88F5-41008A0F0393",
            "name": "Tag-61"
        }
    ],
    "_rid": "n7AmAPTJ480GAAAAAAAAAA==",
    "_self": "dbs/n7AmAA==/colls/n7AmAPTJ480=/docs/n7AmAPTJ480GAAAAAAAAAA==/",
    "_etag": "\"01002683-0000-0800-0000-6451fb4b0000\"",
    "_attachments": "attachments/",
    "_ts": 1683094347
}
```

### Projection

If computed properties need to be projected, they must be explicitly referenced. Wildcard projections like `SELECT *` return all persisted properties, but don't include computed properties.

Let's take an example computed property definition to convert the property `name` to lowercase.

```json
{ 
    "name": "cp_lowerName", 
    "query": "SELECT VALUE LOWER(c.name) FROM c" 
} 
```

This property could then be projected in a query.

```sql
SELECT c.cp_lowerName FROM c
```

### WHERE clause

Computed properties can be referenced in filter predicates like any persisted properties. 

Let's take an example computed property definition to calculate a 20 percent price discount.

```json
{ 
    "name": "cp_20PercentDiscount", 
    "query": "SELECT VALUE (c.price * 0.2) FROM c" 
} 
```

This property could then be filtered on to ensure that only products where the discount would be less than $50 are returned.

```sql
SELECT c.price - c.cp_20PercentDiscount as discountedPrice, c.name FROM c WHERE c.cp_20PercentDiscount < 50.00
```

### GROUP BY clause

As with persisted properties, computed properties can be referenced in the GROUP BY clause and use the index whenever possible. 

Let's take an example computed property definition that finds the primary category for each item from the `categoryName` property.

```json
{
    "name": "cp_primaryCategory",
    "query": "SELECT VALUE SUBSTRING(c.categoryName, 0, INDEX_OF(c.categoryName, ',')) FROM c"
}
```

You can then group by `cp_primaryCategory` to get the count of items in each primary category.

```sql
SELECT COUNT(1), c.cp_primaryCategory FROM c GROUP BY c.cp_primaryCategory
```

> [!TIP]
> While you could also achieve this query without using computed properties, using the computed properties greatly simplifies writing the query and allows for increased performance because `cp_primaryCategory` can be indexed. Both [SUBSTRING()](./substring.md) and [INDEX_OF()](./index-of.md) require a [full scan](../../index-overview.md#index-usage) of all items in the container, but if you index the computed property then the entire query can be served from the index instead. The ability to serve the query from the index instead of relying on a full scan increases performance and lowers query RU costs.

### ORDER BY clause

As with persisted properties, computed properties can be referenced in the ORDER BY clause and need to be indexed for the query to succeed. Using computed properties, you can ORDER BY the result of complex logic or system functions, which opens up many new query scenarios using Azure Cosmos DB.

Let's take an example computed property definition that gets the month out of the `_ts` value.

```json
{
    "name": "cp_monthUpdated",
    "query": "SELECT VALUE DateTimePart('m', TimestampToDateTime(c._ts*1000)) FROM c"
}
```

Before you can ORDER BY `cp_monthUpdated`, you must add it to your indexing policy. Once your indexing policy is updated, you can order by the computed property.

```sql
SELECT * FROM c ORDER BY c.cp_monthUpdated
```

## Indexing computed properties

Computed properties aren't indexed by default and aren't covered by wildcard paths in the [indexing policy](../../index-policy.md). You can add single or composite indexes on computed properties in the indexing policy the same way you would add indexes on persisted properties. It's recommended to add relevant indexes to all computed properties as they're most beneficial in increasing performance and reducing RUs when they're indexed. When computed properties are indexed, actual values are evaluated during item write operations to generate and persist index terms. 

There are a few considerations for indexing computed properties including:

- Computed properties can be specified in included paths, excluded paths and composite index paths.

- Computed properties can't have a spatial index defined on them.

- Wildcard paths under the computed property path work like they do for regular properties.

- If you're removing a computed property that has been indexed, all indexes on that property must also be dropped.

> [!NOTE]
> All computed properties are defined at the top level of the item so the path is always `/<computed property name>`.

### Add a single index for computed properties

Add a single index for a computed property named `cp_myComputedProperty`.

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        },
        {
            "path": "/cp_myComputedProperty/?"
        }
    ],
    "excludedPaths": [
        {
            "path": "/\"_etag\"/?"
        }
    ]
}
```

### Add a composite index for computed properties

Add a composite index on two properties where one is computed, `cp_myComputedProperty`, and the other is persisted `myPersistedProperty`.

```json
{
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/\"_etag\"/?"
        }
    ],
    "compositeIndexes": [  
        [  
            {  
               "path":"/cp_myComputedProperty",
            },
            {  
               "path":"/path/to/myPersistedProperty",
            }
        ]
    ]
}
```

## Next steps

- [Getting started with queries](./getting-started.md)
- [Managing indexing policies](../how-to-manage-indexing-policy.md)
