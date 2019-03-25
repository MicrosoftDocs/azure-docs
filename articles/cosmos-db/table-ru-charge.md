---
title: Find request unit charge
description: Learn how to find the request unit charge when using the Table API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

This article explains how to find the request unit charge for operations executed against Azure Cosmos DB's Table API.

The only SDK currently returning request unit charge for table operations is the [.NET Standard SDK](https://www.nuget.org/packages/Microsoft.Azure.Cosmos.Table). The `TableResult` object exposes a `RequestCharge` property that gets populated by the SDK when used against Cosmos DB's Table API.

```csharp
CloudTable tableReference = client.GetTableReference("table");
TableResult tableResult = tableReference.Execute(TableOperation.Insert(new DynamicTableEntity("partitionKey", "rowKey")));
if (tableResult.RequestCharge.HasValue) // would be false when using Azure Storage Tables
{
    double requestCharge = tableResult.RequestCharge.Value;
}
```