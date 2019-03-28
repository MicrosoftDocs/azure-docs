---
title: Evaluate your Gremlin queries using the execution profile step
description: Learn how to troubleshoot and improve your Gremlin queries using the execution profile step
services: cosmos-db
keywords: graph, gremlin, troubleshoot, evaluate, performance, test, query, profile, executionprofile
author: luisbosquez
manager: kfile
editor: cgronlun

ms.service: cosmos-db
ms.component: cosmosdb-graph
ms.devlang: na
ms.topic: tutorial
ms.date: 01/14/2019
ms.author: lbosq
ms.custom: mvc

---

This tutorial provides an overview of how to use the execution profile step for Gremlin databases and graph accounts. This step provides relevant information for troubleshooting and query optimizations, and it is compatible with any Gremlin query that can be executed against a Cosmos DB Gremlin API account.

# Using the executionProfile step to evaluate your queries

To use this step, simply append the `executionProfile()` function call at the end of your Gremlin query. **Your Gremlin query will be executed** and the result of the operation will return a JSON response object with the query execution profile.

For example:

```csharp
    // Basic traversal
    g.V('mary').out()

    // Basic traversal with execution profile call
    g.V('mary').out().executionProfile()
```

After calling the `executionProfile()` step, the response will be a JSON object that includes the executed Gremlin step, the total time it took, and an array of the back-end operations that the statement resulted in.

The following is an example of the output that will be returned:

```json
[
  {
    "gremlin": "g.V('mary').out().executionProfile()",
    "totalTime": 27,
    "metrics": [
      {
        "name": "GetVertices",
        "time": 16,
        "annotations": {
          "percentTime": 59.26
        },
        "counts": {
          "resultCount": 1
        }
      },
      {
        "name": "GetEdges",
        "time": 11,
        "annotations": {
          "percentTime": 40.74
        },
        "counts": {
          "resultCount": 0
        },
        "storeOps": [
          {
            "partitionsAccessed": 1,
            "count": 0,
            "size": 49,
            "time": 0.57
          }
        ]
      },
      {
        "name": "GetNeighborVertices",
        "time": 0,
        "annotations": {
          "percentTime": 0
        },
        "counts": {
          "resultCount": 0
        }
      },
      {
        "name": "ProjectOperator",
        "time": 0,
        "annotations": {
          "percentTime": 0
        },
        "counts": {
          "resultCount": 0
        }
      }
    ]
  }
]
```

> [!NOTE]
> The executionProfile step will execute the preceding functions. This includes the `addV` or `addE`steps, which will result in the creation and persistence of either kind of objects. The equivalent RU charge of the preceding functions will also be charged.

## Analyzing an execution profile response

The response of an executionProfile() function will yield a hierarchy of JSON objects with the following structure:
  - Gremlin operation object: Represents the entire Gremlin operation that was executed. Contains the following properties.
    - `gremlin`: The explicit Gremlin statement that was executed.
    - `totalTime`: The time, in milliseconds, that the execution of the step incurred in. 
    - `metrics`: An array that contains each of the back-end substeps that were executed to fulfill the query. This list is sorted in order of execution.
  - Back-end step objects: Represents each of the components of the entire Gremlin operation. This list is sorted in order of execution. Each object contains the following properties:
    - `name`: Name of the back-end step. This is the type of step that was evaluated and executed. Read more in the table below.
    - `time`: Amount of time, in milliseconds, that a given back-end step took.
    - `annotations`: Contains additional information, specific to the back-end step that was executed.
    - `annotations.percentTime`: Percentage of the total time that it took to execute the specific back-end step.
    - `counts`: Number of objects that were returned from the storage layer by this back-end step. This is contained in the `counts.resultCount` scalar value within.
    - `storeOps`: Represents a persistence layer operation that can span one or multiple data partitions.

Back-end Step|Description
---|---
`GetVertices`| This step obtains a predicated set of objects from the persistence layer. 
`GetEdges`| This step obtains the edges that are adjacent to a set of vertices. This step can result in one or many store operations.
`GetNeighboringVertices`| This step obtains the vertices that are connected to a set of edges. The edges contain the partition keys and ID's of both their source and target vertices.
`Coalesce`| This step accounts for the evaluation of two operations whenever the `coalesce()` Gremlin step is executed.
`QueryDerivedTableOperator`| This step executes a storage operation for an object that will be executed on with another operation.
`CartesianProductOperator`| This step computes a cartesian product between two datasets.
`ConstantSourceOperator`| This step obtains the edges that are adjacent to a set of vertices. This step can result in one or many store operations.
`ProjectOperator`| This step prepares and serializes a response using the result of preceding operations.
`ProjectAggregation`| This step prepares a and serializes a response for an aggregate operation.


## Next steps
* Learn about the [supported Gremlin features](gremlin-support.md) in Azure Cosmos DB. 
* Learn more about the [Gremlin API in Azure Cosmos DB](graph-introduction.md).
