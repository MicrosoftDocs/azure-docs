---
title: Find request unit charge for Azure Cosmos DB API for MongoDB operations
description: Learn how to find the request unit (RU) charge for MongoDB queries executed against an Azure Cosmos container. You can use the Azure portal, MongoDB .NET, Java, Node.js drivers.
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/14/2020
ms.author: thweiss
ms.custom: devx-track-js
---

# Find the request unit charge for operations executed in Azure Cosmos DB API for MongoDB

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short). You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your Azure Cosmos container, costs are always measured by RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see the [request units and it's considerations](request-units.md) article.

This article presents the different ways you can find the [request unit](request-units.md) (RU) consumption for any operation executed against a container in Azure Cosmos DB API for MongoDB. If you are using a different API, see [SQL API](find-request-unit-charge.md), [Cassandra API](), [Gremlin API](find-request-unit-charge-gremlin.md), and [Table API]() articles to find the RU/s charge.

The RU charge is exposed by a custom [database command](https://docs.mongodb.com/manual/reference/command/) named `getLastRequestStatistics`. The command returns a document that contains the name of the last operation executed, its request charge, and its duration. If you use the Azure Cosmos DB API for MongoDB, you have multiple options for retrieving the RU charge.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-mongodb-dotnet.md#create-a-database-account) and feed it with data, or select an existing account that already contains data.

1. Go to the **Data Explorer** pane, and then select the container you want to work on.

1. Select **New Query**.

1. Enter a valid query, and then select **Execute Query**.

1. Select **Query Stats** to display the actual request charge for the request you executed.

:::image type="content" source="./media/find-request-unit-charge/portal-mongodb-query.png" alt-text="Screenshot of a MongoDB query request charge in the Azure portal":::

## Use the MongoDB .NET driver

When you use the [official MongoDB .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/), you can execute commands by calling the `RunCommand` method on a `IMongoDatabase` object. This method requires an implementation of the `Command<>` abstract class:

```csharp
class GetLastRequestStatisticsCommand : Command<Dictionary<string, object>>
{
    public override RenderedCommand<Dictionary<string, object>> Render(IBsonSerializerRegistry serializerRegistry)
    {
        return new RenderedCommand<Dictionary<string, object>>(new BsonDocument("getLastRequestStatistics", 1), serializerRegistry.GetSerializer<Dictionary<string, object>>());
    }
}

Dictionary<string, object> stats = database.RunCommand(new GetLastRequestStatisticsCommand());
double requestCharge = (double)stats["RequestCharge"];
```

For more information, see [Quickstart: Build a .NET web app by using an Azure Cosmos DB API for MongoDB](create-mongodb-dotnet.md).

## Use the MongoDB Java driver


When you use the [official MongoDB Java driver](https://mongodb.github.io/mongo-java-driver/), you can execute commands by calling the `runCommand` method on a `MongoDatabase` object:

```java
Document stats = database.runCommand(new Document("getLastRequestStatistics", 1));
Double requestCharge = stats.getDouble("RequestCharge");
```

For more information, see [Quickstart: Build a web app by using the Azure Cosmos DB API for MongoDB and the Java SDK](create-mongodb-java.md).

## Use the MongoDB Node.js driver

When you use the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/), you can execute commands by calling the `command` method on a `db` object:

```javascript
db.command({ getLastRequestStatistics: 1 }, function(err, result) {
    assert.equal(err, null);
    const requestCharge = result['RequestCharge'];
});
```

For more information, see [Quickstart: Migrate an existing MongoDB Node.js web app to Azure Cosmos DB](create-mongodb-nodejs.md).

## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request units and throughput in Azure Cosmos DB](request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](optimize-cost-queries.md)