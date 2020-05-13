---
title: Frequently asked questions about the Gremlin API in Azure Cosmos DB
description: Get answers to frequently asked questions about the Gremlin API in Azure Cosmos DB
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/28/2020
ms.author: sngun
---

# Frequently asked questions about the Gremlin API in Azure Cosmos DB

This article explains answers to some frequently asked questions about Gremlin API in Azure Cosmos DB.

## How to evaluate the efficiency of Gremlin queries

The **executionProfile()** preview step can be used to provide an analysis of the query execution plan. This step needs to be added to the end of any Gremlin query as illustrated by the following example:

**Query example**

```
g.V('mary').out('knows').executionProfile()
```

**Example output**

```json
[
  {
    "gremlin": "g.V('mary').out('knows').executionProfile()",
    "totalTime": 8,
    "metrics": [
      {
        "name": "GetVertices",
        "time": 3,
        "annotations": {
          "percentTime": 37.5
        },
        "counts": {
          "resultCount": 1
        }
      },
      {
        "name": "GetEdges",
        "time": 5,
        "annotations": {
          "percentTime": 62.5
        },
        "counts": {
          "resultCount": 0
        },
        "storeOps": [
          {
            "count": 0,
            "size": 0,
            "time": 0.6
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

The output of the above profile shows how much time is spent obtaining the vertex objects, the edge objects, and the size of the working data set. This is related to the standard cost measurements for Azure Cosmos DB queries.

## Other frequently asked questions

### How are RU/s charged when running queries on a graph database?

All graph objects, vertices, and edges, are shown as JSON documents in the backend. Since one Gremlin query can modify one or many graph objects at a time, the cost associated with it is directly related to the objects, edges that are processed by the query. This is the same process that Azure Cosmos DB uses for all other APIs. For more information, see [Request Units in Azure Cosmos DB](request-units.md).

The RU charge is based on the working data set of the traversal, and not the result set. For example, if a query aims to obtain a single vertex as a result but needs to traverse more than one other object on the way, then the cost will be based on all the graph objects that it will take to compute the one result vertex.

### What's the maximum scale that a graph database can have in Azure Cosmos DB Gremlin API?

Azure Cosmos DB makes use of [horizontal partitioning](partition-data.md) to automatically address increase in storage and throughput requirements. The maximum throughput and storage capacity of a workload is determined by the number of partitions that are associated with a given container. However, a Gremlin API container has a specific set of guidelines to ensure a proper performance experience at scale. For more information about partitioning, and best practices, see [partitioning in Azure Cosmos DB](partition-data.md) article.

### For C#/.NET development, should I use the Microsoft.Azure.Graphs package or Gremlin.NET?

Azure Cosmos DB Gremlin API leverages the open-source drivers as the main connectors for the service. So the recommended option is to use [drivers that are supported by Apache Tinkerpop](https://tinkerpop.apache.org/).

### How can I protect against injection attacks using Gremlin drivers?

Most native Apache Tinkerpop Gremlin drivers allow the option to provide a dictionary of parameters for query execution. This is an example of how to do it in [Gremlin.Net](https://tinkerpop.apache.org/docs/3.2.7/reference/#gremlin-DotNet) and in [Gremlin-Javascript](https://github.com/Azure-Samples/azure-cosmos-db-graph-nodejs-getting-started/blob/master/app.js).

### Why am I getting the "Gremlin Query Compilation Error: Unable to find any method" error?

Azure Cosmos DB Gremlin API implements a subset of the functionality defined in the Gremlin surface area. For supported steps and more information, see [Gremlin support](gremlin-support.md) article.

The best workaround is to rewrite the required Gremlin steps with the supported functionality, since all essential Gremlin steps are supported by Azure Cosmos DB.

### Why am I getting the "WebSocketException: The server returned status code '200' when status code '101' was expected" error?

This error is likely thrown when the wrong endpoint is being used. The endpoint that generates this error has the following pattern:

`https:// YOUR_DATABASE_ACCOUNT.documents.azure.com:443/`

This is the documents endpoint for your graph database.  The correct endpoint to use is the Gremlin Endpoint, which has the following format:

`https://YOUR_DATABASE_ACCOUNT.gremlin.cosmosdb.azure.com:443/`

### Why am I getting the "RequestRateIsTooLarge" error?

This error means that the allocated Request Units per second aren't enough to serve the query. This error is usually seen when you run a query that obtains all vertices:

```
// Query example:
g.V()
```

This query will attempt to retrieve all vertices from the graph. So, the cost of this query will be equal to at least the number of vertices in terms of RUs. The RU/s setting should be adjusted to address this query.

### Why do my Gremlin driver connections get dropped eventually?

A Gremlin connection is made through a WebSocket connection. Although WebSocket connections don't have a specific time to live, Azure Cosmos DB Gremlin API will terminate idle connections after 30 minutes of inactivity.

### Why can't I use fluent API calls in the native Gremlin drivers?

Fluent API calls aren't yet supported by the Azure Cosmos DB Gremlin API. Fluent API calls require an internal formatting feature known as bytecode support that currently isn't supported by Azure Cosmos DB Gremlin API. Due to the same reason, the latest Gremlin-JavaScript driver is also currently not supported.

## Next steps

* [Azure Cosmos DB Gremlin wire protocol support](gremlin-support.md)
* Create, query, and traverse an Azure Cosmos DB graph database using the [Gremlin console](create-graph-gremlin-console.md)
