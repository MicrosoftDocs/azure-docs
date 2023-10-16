---
title: Find request unit (RU) charge for Gremlin API queries in Azure Cosmos DB
description: Learn how to find the request unit (RU) charge for Gremlin queries executed against an Azure Cosmos container. You can use the Azure portal, .NET, Java drivers to find the RU charge. 
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: how-to
ms.date: 10/14/2020
author: manishmsfte
ms.author: mansha
ms.devlang: csharp, java
ms.custom: devx-track-csharp, devx-track-java, ignite-2022, devx-track-dotnet, devx-track-extended-java
---
# Find the request unit charge for operations executed in Azure Cosmos DB for Gremlin
[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short). Request charge is the request units consumed by all your database operations. You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your Azure Cosmos container, costs are always measured by RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see the [request units and it's considerations](../request-units.md) article.

This article presents the different ways you can find the [request unit](../request-units.md) (RU) consumption for any operation executed against a container in Azure Cosmos DB for Gremlin. If you are using a different API, see [API for MongoDB](../mongodb/find-request-unit-charge.md), [Cassandra API](../cassandra/find-request-unit-charge.md), [SQL API](../find-request-unit-charge.md), and [Table API](../table/find-request-unit-charge.md) articles to find the RU/s charge.

Headers returned by the Gremlin API are mapped to custom status attributes, which currently are surfaced by the Gremlin .NET and Java SDK. The request charge is available under the `x-ms-request-charge` key. When you use the Gremlin API, you have multiple options for finding the RU consumption for an operation against an Azure Cosmos container.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](quickstart-console.md) and feed it with data, or select an existing account that already contains data.

1. Go to the **Data Explorer** pane, and then select the container you want to work on.

1. Enter a valid query, and then select **Execute Gremlin Query**.

1. Select **Query Stats** to display the actual request charge for the request you executed.

:::image type="content" source="../media/find-request-unit-charge/portal-gremlin-query.png" alt-text="Screenshot to get a Gremlin query request charge in the Azure portal":::

## Use the .NET SDK driver

When you use the [Gremlin.NET SDK](https://www.nuget.org/packages/Gremlin.Net/), status attributes are available under the `StatusAttributes` property of the `ResultSet<>` object:

```csharp
ResultSet<dynamic> results = client.SubmitAsync<dynamic>("g.V().count()").Result;
double requestCharge = (double)results.StatusAttributes["x-ms-request-charge"];
```

For more information, see [Quickstart: Build a .NET Framework or Core application by using an Azure Cosmos DB for Gremlin account](quickstart-dotnet.md).

## Use the Java SDK driver

When you use the [Gremlin Java SDK](https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver), you can retrieve status attributes by calling the `statusAttributes()` method on the `ResultSet` object:

```java
ResultSet results = client.submit("g.V().count()");
Double requestCharge = (Double)results.statusAttributes().get().get("x-ms-request-charge");
```

For more information, see [Quickstart: Create a graph database in Azure Cosmos DB by using the Java SDK](quickstart-java.md).

## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](../optimize-cost-reads-writes.md)
