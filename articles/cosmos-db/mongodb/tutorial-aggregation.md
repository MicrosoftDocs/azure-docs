---
title: Getting Started with Aggregation Pipeline
description: Learn how to get started with Cosmos DB for MongoDB aggregation pipeline for advanced data analysis and manipulation.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: tutorial
ms.date: 01/24/2023
ms.reviewer: mjbrown
---

# Getting Started with Aggregation Pipeline

The aggregation pipeline is a powerful tool that allows developers to perform advanced data analysis and manipulation on their collections. The pipeline is a sequence of data processing operations, which are performed on the input documents to produce a computed output. The pipeline stages process the input documents and pass the result to the next stage. Each stage performs a specific operation on the data, such as filtering, grouping, sorting, and transforming.

## Basic Syntax

The basic syntax for an aggregation pipeline is as follows:

```javascript
db.collection.aggregate([    { stage1 },    { stage2 },    ...    { stageN }])
```

Where db.collection is the MongoDB collection you want to perform the aggregation on, and stage1, stage2, ..., stageN are the pipeline stages you want to apply.

## Sample Stages

Cosmos DB for MongoDB provides a wide range of stages that you can use in your pipeline, including:

* $match: Filters the documents to pass only the documents that match the specified condition.
* $project: Transforms the documents to a new form by adding, removing, or updating fields.
* $group: Groups documents by one or more fields and performs various aggregate functions on the grouped data.
* $sort: Sorts the documents based on the specified fields.
* $skip: Skips the specified number of documents.
* $limit: Limits the number of documents passed to the next stage.
* $unwind: Deconstructs an array field from the input documents to output a document for each element.

To view all available stages, see [supported features](feature-support-42.md)

## Examples

Here are some examples of how you can use the aggregation pipeline to perform various operations on your data:

Filtering: To filter documents that have a "quantity" field greater than 20, you can use the following pipeline:
```javascript
db.collection.aggregate([
    { $match: { quantity: { $gt: 20 } } }
])
```

Grouping: To group documents by the "category" field and calculate the total "quantity" for each group, you can use the following pipeline:
```javascript
db.collection.aggregate([
    { $group: { _id: "$category", totalQuantity: { $sum: "$quantity" } } }
])
```

Sorting: To sort documents by the "price" field in descending order, you can use the following pipeline:
```javascript
db.collection.aggregate([
    { $sort: { price: -1 } }
])
```

Transforming: To add a new field "discount" to documents that have a "price" greater than 100, you can use the following pipeline:

```javascript
db.collection.aggregate([
    { $project: { item: 1, price: 1, discount: { $cond: [{ $gt: ["$price", 100] }, 10, 0 ] } } }
])
```

Unwinding: To separate all the subdocuments from the array field 'tags' and create a new document for each value, you can use the following pipeline:
```javascript
db.collection.aggregate([
    { $unwind: "$tags" }
])
```

## Example with multiple stages

```javascript
db.sales.aggregate([
  { $match: { date: { $gte: "2021-01-01", $lt: "2021-03-01" } } },
  { $group: { _id: "$category", totalSales: { $sum: "$sales" } } },
  { $sort: { totalSales: -1 } },
  { $limit: 5 }
])
```

In this example, we are using a sample collection called "sales" which has documents with the following fields: "date", "category", and "sales".

The first stage { $match: { date: { $gte: "2021-01-01", $lt: "2021-03-01" } } } filters the documents by the "date" field, only passing documents with a date between January 1st, 2021 and February 28th, 2021. We are using a string date format with the format "YYYY-MM-DD".

The second stage { $group: { _id: "$category", totalSales: { $sum: "$sales" } } } groups the documents by the "category" field and calculates the total sales for each group.

The third stage { $sort: { totalSales: -1 } } sorts the documents by the "totalSales" field in descending order.

The fourth stage { $limit: 5 } limits the number of documents passed to the next stage to only the top 5.

As a result, the pipeline will return the top 5 categories by total sales for the specified date range.

## Next steps

- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
  - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md).
  - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md).
