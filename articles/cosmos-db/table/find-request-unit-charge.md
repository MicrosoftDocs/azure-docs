---
title: Find request unit (RU) charge for a API for Table queries in Azure Cosmos DB
description: Learn how to find the request unit (RU) charge for API for Table queries executed against an Azure Cosmos DB container. You can use the Azure portal, .NET, Java, Python, and Node.js languages to find the RU charge. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: table
ms.topic: how-to
ms.date: 10/14/2020
ms.author: sidandrews
ms.devlang: csharp
ms.custom: ignite-2022, devx-track-dotnet, devx-track-extended-java, devx-track-python
---
# Find the request unit charge for operations executed in Azure Cosmos DB for Table
[!INCLUDE[Table](../includes/appliesto-table.md)]

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short). Request charge is the request units consumed by all your database operations. You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your Azure Cosmos DB container, costs are always measured by RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see the [request units and it's considerations](../request-units.md) article.

This article presents the different ways you can find the [request unit](../request-units.md) (RU) consumption for any operation executed against a container in Azure Cosmos DB for Table. If you are using a different API, see [API for MongoDB](../mongodb/find-request-unit-charge.md), [API for Cassandra](../cassandra/find-request-unit-charge.md), [API for Gremlin](../gremlin/find-request-unit-charge.md), and [API for NoSQL](../find-request-unit-charge.md) articles to find the RU/s charge.

## Use the .NET SDK

Currently, the only SDK that returns the RU charge for table operations is the [.NET Standard SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table). The `TableResult` object exposes a `RequestCharge` property that is populated by the SDK when you use it against the Azure Cosmos DB for Table:

```csharp
CloudTable tableReference = client.GetTableReference("table");
TableResult tableResult = tableReference.Execute(TableOperation.Insert(new DynamicTableEntity("partitionKey", "rowKey")));
if (tableResult.RequestCharge.HasValue) // would be false when using Azure Storage Tables
{
    double requestCharge = tableResult.RequestCharge.Value;
}
```

For more information, see [Quickstart: Build a API for Table app by using the .NET SDK and Azure Cosmos DB](quickstart-dotnet.md).

## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](../optimize-cost-reads-writes.md)
