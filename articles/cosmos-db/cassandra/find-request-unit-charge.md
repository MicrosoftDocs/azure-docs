---
title: Find request unit (RU) charge for a API for Cassandra query in Azure Cosmos DB
description: Learn how to find the request unit (RU) charge for Cassandra queries executed against an Azure Cosmos DB container. You can use the Azure portal, .NET and Java drivers to find the RU charge. 
author: IriaOsara
ms.author: iriaosara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 10/14/2020
ms.devlang: csharp, java, golang
ms.custom: devx-track-csharp, devx-track-java, devx-track-golang, ignite-2022, devx-track-dotnet, devx-track-extended-java
---
# Find the request unit charge for operations executed in Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short). Request charge is the request units consumed by all your database operations. You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your Azure Cosmos DB container, costs are always measured by RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see the [request units and it's considerations](../request-units.md) article.

This article presents the different ways you can find the [request unit](../request-units.md) (RU) consumption for any operation executed against a container in Azure Cosmos DB for Apache Cassandra. If you are using a different API, see [API for MongoDB](../mongodb/find-request-unit-charge.md), [API for NoSQL](../find-request-unit-charge.md), [API for Gremlin](../gremlin/find-request-unit-charge.md), and [API for Table](../table/find-request-unit-charge.md) articles to find the RU/s charge.

When you perform operations against the Azure Cosmos DB for Apache Cassandra, the RU charge is returned in the incoming payload as a field named `RequestCharge`. You have multiple options for retrieving the RU charge.

## Use a Cassandra Driver

### [.NET Driver](#tab/dotnet-driver)

When you use the [.NET SDK](https://www.nuget.org/packages/CassandraCSharpDriver/), you can retrieve the incoming payload under the `Info` property of a `RowSet` object:

```csharp
RowSet rowSet = session.Execute("SELECT table_name FROM system_schema.tables;");
double requestCharge = BitConverter.ToDouble(rowSet.Info.IncomingPayload["RequestCharge"].Reverse().ToArray(), 0);
```

For more information, see [Quickstart: Build a Cassandra app by using the .NET SDK and Azure Cosmos DB](manage-data-dotnet.md).

### [Java Driver](#tab/java-driver)

When you use the [Java SDK](https://mvnrepository.com/artifact/com.datastax.cassandra/cassandra-driver-core), you can retrieve the incoming payload by calling the `getExecutionInfo()` method on a `ResultSet` object:

```java
ResultSet resultSet = session.execute("SELECT table_name FROM system_schema.tables;");
Double requestCharge = resultSet.getExecutionInfo().getIncomingPayload().get("RequestCharge").getDouble();
```

For more information, see [Quickstart: Build a Cassandra app by using the Java SDK and Azure Cosmos DB](manage-data-java.md).

### [GOCQL Driver](#tab/gocql-driver)

When you use the [GOCQL driver](https://github.com/gocql/gocql), you can retrieve the incoming payload by calling the `GetCustomPayload()` method on a [`Iter`](https://pkg.go.dev/github.com/gocql/gocql#Iter) type:

```go
query := session.Query(fmt.Sprintf("SELECT * FROM <keyspace.table> where <value> = ?", keyspace, table)).Bind(<value>)
iter := query.Iter()
requestCharge := iter.GetCustomPayload()["RequestCharge"]
requestChargeBits := binary.BigEndian.Uint64(requestCharge)
requestChargeValue := math.Float64frombits(requestChargeBits)
fmt.Printf("%v\n", requestChargeValue)
```

For more information, see [Quickstart: Build a Cassandra app by using GOCQL and Azure Cosmos DB](manage-data-go.md).

---
## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](../optimize-cost-reads-writes.md)
