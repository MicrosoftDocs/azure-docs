---
title: Find request unit charge
description: Learn how to find the request unit charge when using the Cassandra API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

# How to find the request unit charge when using the Cassandra API

This article explains how to find the request unit charge for operations executed against data stored in Azure Cosmos DB's Cassandra API account.

When performing operations against Azure Cosmos DB's Cassandra API, request unit charge is returned in the incoming payload as a field named `RequestCharge`.

## Using the DataStax .NET SDK

When using the [DataStax .NET SDK](https://www.nuget.org/packages/CassandraCSharpDriver/) (see [this quickstart](create-cassandra-dotnet.md) regarding its usage), the incoming payload can be retrieved under the `Info` property of a `RowSet` object.

```csharp
RowSet rowSet = session.Execute("SELECT ALL");
double requestCharge = BitConverter.ToDouble(rowSet.Info.IncomingPayload["RequestCharge"], 0);
```

## Using the DataStax Java SDK

When using the [DataStax Java SDK](https://mvnrepository.com/artifact/com.datastax.cassandra/cassandra-driver-core) (see [this quickstart](create-cassandra-java.md) regarding its usage), the incoming payload can be retrieved by calling the `getExecutionInfo()` method on a `ResultSet` object.

```java
ResultSet resultSet = session.execute("SELECT ALL");
Double requestCharge = resultSet.getExecutionInfo().getIncomingPayload().get("RequestCharge").getDouble();
```

## Next steps

See the following articles to learn about Azure Cosmos DB's Cassandra API:

* [Supported features and syntax](cassandra-support.md)
* [Connect to Azure Cosmos DB Cassandra API from Spark](cassandra-spark-generic.md)