---
title: Find request unit charge for Azure Cosmos DB for MongoDB operations
description: Learn how to find the request unit (RU) charge for MongoDB queries executed against an Azure Cosmos DB container. You can use the Azure portal, MongoDB .NET, Java, Node.js drivers.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 05/12/2022
ms.devlang: csharp, java, javascript
ms.custom: devx-track-csharp, devx-track-java, ignite-2022, devx-track-dotnet, devx-track-extended-java
---

# Find the request unit charge for operations executed in Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Azure Cosmos DB supports many APIs, such as SQL, MongoDB, Cassandra, Gremlin, and Table. Each API has its own set of database operations. These operations range from simple point reads and writes to complex queries. Each database operation consumes system resources based on the complexity of the operation.

The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short). Request charge is the request units consumed by all your database operations. You can think of RUs as a performance currency abstracting the system resources such as CPU, IOPS, and memory that are required to perform the database operations supported by Azure Cosmos DB. No matter which API you use to interact with your Azure Cosmos DB container, costs are always measured by RUs. Whether the database operation is a write, point read, or query, costs are always measured in RUs. To learn more, see the [request units and it's considerations](../request-units.md) article.

This article presents the different ways you can find the [request unit](../request-units.md) (RU) consumption for any operation executed against a container in Azure Cosmos DB for MongoDB. If you're using a different API, see [API for NoSQL](../find-request-unit-charge.md), [API for Cassandra](../cassandra/find-request-unit-charge.md), [API for Gremlin](../gremlin/find-request-unit-charge.md), and [API for Table](../table/find-request-unit-charge.md) articles to find the RU/s charge.

The RU charge is exposed by a custom database command named `getLastRequestStatistics`. The command returns a document that contains the name of the last operation executed, its request charge, and its duration. If you use the Azure Cosmos DB for MongoDB, you have multiple options for retrieving the RU charge.

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](create-mongodb-dotnet.md#create-an-azure-cosmos-db-account) and feed it with data, or select an existing account that already contains data.

1. Go to the **Data Explorer** pane, and then select the container you want to work on.

1. Select the **...** next to the container name and select **New Query**.

1. Enter a valid query, and then select **Execute Query**.

1. Select **Query Stats** to display the actual request charge for the request you executed. This query editor allows you to run and view request unit charges for only query predicates. You can't use this editor for data manipulation commands such as insert statements.

   :::image type="content" source="../media/find-request-unit-charge/portal-mongodb-query.png" alt-text="Screenshot of a MongoDB query request charge in the Azure portal":::

1. To get request charges for data manipulation commands, run the `getLastRequestStatistics` command from a shell based UI such as Mongo shell, [Robo 3T](connect-using-robomongo.md), [MongoDB Compass](connect-using-compass.md), or a VS Code extension with shell scripting.

   `db.runCommand({getLastRequestStatistics: 1})`

## Programmatically 

### [Mongo Shell](#tab/mongo-shell)

When you use the Mongo shell, you can execute commands by using runCommand().

```javascript
db.runCommand('getLastRequestStatistics')
```

### [.NET driver](#tab/dotnet-driver)

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

For more information, see [Quickstart: Build a .NET web app by using an Azure Cosmos DB for MongoDB](create-mongodb-dotnet.md).

### [Java driver](#tab/java-driver)

When you use the [official MongoDB Java driver](https://mongodb.github.io/mongo-java-driver/), you can execute commands by calling the `runCommand` method on a `MongoDatabase` object:

```java
Document stats = database.runCommand(new Document("getLastRequestStatistics", 1));
Double requestCharge = stats.getDouble("RequestCharge");
```

For more information, see [Quickstart: Build a web app by using the Azure Cosmos DB for MongoDB and the Java SDK](quickstart-java.md).

### [Node.js driver](#tab/node-driver)

When you use the [official MongoDB Node.js driver](https://mongodb.github.io/node-mongodb-native/), you can execute commands by calling the `command` method on a `db` object:

```javascript
db.command({ getLastRequestStatistics: 1 }, function(err, result) {
    assert.equal(err, null);
    const requestCharge = result['RequestCharge'];
});
```

For more information, see [Quickstart: Migrate an existing MongoDB Node.js web app to Azure Cosmos DB](create-mongodb-nodejs.md).

### [Python driver](#tab/python-driver)

```python
response = db.command('getLastRequestStatistics')
requestCharge = response['RequestCharge']
```

---

## Next steps

To learn about optimizing your RU consumption, see these articles:

* [Request units and throughput in Azure Cosmos DB](../request-units.md)
* [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)
* [Optimize query cost in Azure Cosmos DB](../optimize-cost-reads-writes.md)
* Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    * If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
    * If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
