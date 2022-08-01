---
title: Use a query in Azure Cosmos DB MongoDB API using JavaScript
description: Learn how to use a query in your Azure Cosmos DB MongoDB API database using the JavaScript SDK.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: javascript
ms.topic: how-to
ms.date: 07/29/2022
ms.custom: devx-track-js
---

# Query data in Azure Cosmos DB MongoDB API using JavaScript

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Use [queries](#query-for-documents) and [aggregation pipelines](#aggregation-pipelines) to find and manipulate documents in a collection.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/cosmos-db-mongodb-api-javascript-samples) are available on GitHub as a JavaScript project.

[MongoDB API reference documentation](https://docs.mongodb.com/drivers/node) | [MongoDB Package (npm)](https://www.npmjs.com/package/mongodb)


## Query for documents

To find documents, use a query to define how the documents are found. 

* [MongoClient.Db.Collection.findOne](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#findOne)
* [MongoClient.Db.Collection.find](https://mongodb.github.io/node-mongodb-native/4.7/classes/Collection.html#find)
* [FindCursor](https://mongodb.github.io/node-mongodb-native/4.7/classes/FindCursor.html)

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="read_doc":::

The preceding code snippet displays the following example console output:

:::code language="console" source="~/samples-cosmosdb-mongodb-javascript/275-find/index.js" id="console_result_findone":::

## Aggregation pipelines

Aggregation pipelines are useful to isolate expensive query computation, transformations, and other processing on your Cosmos DB server, instead of performing these operations on the client. 

For specific **aggregation pipeline support**, refer to the following: 

* [Version 4.2](feature-support-42.md#aggregation-pipeline)
* [Version 4.0](feature-support-40.md#aggregation-pipeline)
* [Version 3.6](feature-support-36.md#aggregation-pipeline)
* [Version 3.2](feature-support-32.md#aggregation-pipeline)

### Aggregation pipeline syntax

A pipeline is an array with a series of stages as JSON objects. 

```javascript
const pipeline = [
    stage1,
    stage2
]
```

### Pipeline stage syntax

A _stage_ defines the operation and the data it is applied to, such as:

* $match - find documents
* $addFields - add field to cursor, usually from previous stage
* $limit - limit the number of results returned in cursor
* $project - pass along new or existing fields, can be computed fields
* $group - group results by a field or fields in pipeline
* $sort - sort results

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

## Use a aggregation pipeline in JavaScript

Use a pipeline to keep data processing on the server before returning to the client. 

### Example 1: Product subcategories, count of products, and average price

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/280-aggregation/average-price-in-each-product-subcategory.js" id="aggregation_1":::


### Example 2: Bike types with price range

:::code language="javascript" source="~/samples-cosmosdb-mongodb-javascript/280-aggregation/bike-types-and-price-ranges.js" id="aggregation_1":::



## See also

- [Get started with Azure Cosmos DB MongoDB API and JavaScript](how-to-javascript-get-started.md)
- [Create a database](how-to-javascript-manage-databases.md)
