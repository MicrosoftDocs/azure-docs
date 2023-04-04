---
title: Use a query in Azure Cosmos DB for MongoDB using JavaScript
description: Learn how to use a query in your Azure Cosmos DB for MongoDB database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: javascript
ms.topic: how-to
ms.date: 07/29/2022
ms.custom: devx-track-js, ignite-2022, devguide-js, cosmos-db-dev-journey
---

# Query data in Azure Cosmos DB for MongoDB using JavaScript

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Use [queries](#query-for-documents) and [aggregation pipelines](#aggregation-pipelines) to find and manipulate documents in a collection.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[API for MongoDB reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)

## Query for documents

To find documents, use a query to define how the documents are found.

- [MongoClient.Db.Collection.findOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#findOne)
- [MongoClient.Db.Collection.find](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#find)
- [FindCursor](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="read_doc":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="console_result_findone":::

## Aggregation pipelines

Aggregation pipelines are useful to isolate expensive query computation, transformations, and other processing on your Azure Cosmos DB server, instead of performing these operations on the client.

For specific **aggregation pipeline support**, refer to the following:

- [Version 4.2](feature-support-42.md#aggregation-pipeline)
- [Version 4.0](feature-support-40.md#aggregation-pipeline)
- [Version 3.6](feature-support-36.md#aggregation-pipeline)
- [Version 3.2](feature-support-32.md#aggregation-pipeline)

### Aggregation pipeline syntax

A pipeline is an array with a series of stages as JSON objects.

```javascript
const pipeline = [
    stage1,
    stage2
]
```

### Pipeline stage syntax

A _stage_ defines the operation and the data it's applied to, such as:

- $match - find documents
- $addFields - add field to cursor, usually from previous stage
- $limit - limit the number of results returned in cursor
- $project - pass along new or existing fields, can be computed fields
- $group - group results by a field or fields in pipeline
- $sort - sort results

```javascript
// reduce collection to relative documents
const matchStage = {
    '$match': {
        'categoryName': { $regex: 'Bikes' },
    }
}

// sort documents on field `name`
const sortStage = { 
    '$sort': { 
        "name": 1 
    } 
},
```

### Aggregate the pipeline to get iterable cursor

The pipeline is aggregated to produce an iterable cursor.

```javascript
const db = 'adventureworks';
const collection = 'products';

const aggCursor = client.db(databaseName).collection(collectionName).aggregate(pipeline);

await aggCursor.forEach(product => {
    console.log(JSON.stringify(product));
});
```

## Use an aggregation pipeline in JavaScript

Use a pipeline to keep data processing on the server before returning to the client.

### Example product data

The aggregations below use the [sample products collection](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples/blob/main/252-insert-many/products.json) with data in the shape of:

```json
[
    {
        "_id": "08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2",
        "categoryId": "75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C",
        "categoryName": "Bikes, Touring Bikes",
        "sku": "BK-T79U-50",
        "name": "Touring-1000 Blue, 50",
        "description": "The product called \"Touring-1000 Blue, 50\"",
        "price": 2384.0700000000002,
        "tags": [
        ]
    },
    {
        "_id": "0F124781-C991-48A9-ACF2-249771D44029",
        "categoryId": "56400CF3-446D-4C3F-B9B2-68286DA3BB99",
        "categoryName": "Bikes, Mountain Bikes",
        "sku": "BK-M68B-42",
        "name": "Mountain-200 Black, 42",
        "description": "The product called \"Mountain-200 Black, 42\"",
        "price": 2294.9899999999998,
        "tags": [
        ]
    },
    {
        "_id": "3FE1A99E-DE14-4D11-B635-F5D39258A0B9",
        "categoryId": "26C74104-40BC-4541-8EF5-9892F7F03D72",
        "categoryName": "Components, Saddles",
        "sku": "SE-T924",
        "name": "HL Touring Seat/Saddle",
        "description": "The product called \"HL Touring Seat/Saddle\"",
        "price": 52.640000000000001,
        "tags": [
        ]
    },
]
```

### Example 1: Product subcategories, count of products, and average price

Use the following [sample code](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples/blob/main/280-aggregation/average-price-in-each-product-subcategory.js) to report on average price in each product subcategory.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/280-aggregation/average-price-in-each-product-subcategory.js" id="aggregation_1" highlight="26, 43, 53, 56, 66":::

### Example 2: Bike types with price range

Use the following [sample code](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples/blob/main/280-aggregation/bike-types-and-price-ranges.js) to report on the `Bikes` subcategory.

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/280-aggregation/bike-types-and-price-ranges.js" id="aggregation_1" highlight="23, 30, 38, 45, 68, 80, 85, 98":::

## See also

- [Get started with Azure Cosmos DB for MongoDB and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
