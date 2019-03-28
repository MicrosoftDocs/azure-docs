---
title: Find request unit charge
description: Learn how to find the request unit charge when using the Gremlin API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

# How to find the request unit charge when using the Gremlin API

This article explains how to find the request unit charge for operations executed against Azure Cosmos DB's Gremlin API.

Headers returned by the Gremlin API are mapped to custom status attributes which are currently surfaced by the Gremlin .NET and Java SDK. The request charge is available under the `x-ms-request-charge` key.

## Using the Gremlin.NET SDK

When using the [Gremlin.NET SDK](https://www.nuget.org/packages/Gremlin.Net/) (see [this quickstart](create-graph-dotnet.md) regarding its usage), status attributes are available under the `StatusAttributes` property of the `ResultSet<>` object.

```csharp
ResultSet<dynamic> results = client.SubmitAsync<dynamic>("g.V().count()").Result;
double requestCharge = (double)results.StatusAttributes["x-ms-request-charge"];
```

## Using the Gremlin Java SDK

When using the [Gremlin Java SDK](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver) (see [this quickstart](create-graph-java.md) regarding its usage), status attributes can be retrieved by calling the `statusAttributes()` method on the `ResultSet` object.

```java
ResultSet results = client.submit("g.V().count()");
Double requestCharge = (Double)results.statusAttributes().get().get("x-ms-request-charge");
```

## Next steps

See the following articles to learn about Azure Cosmos DB's Gremlin API:

* [Supported features and syntax](gremlin-support.md)
* [Using a partitioned graph in Azure Cosmos DB](graph-partitioning.md)