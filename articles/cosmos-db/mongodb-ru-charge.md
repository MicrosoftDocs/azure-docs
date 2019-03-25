---
title: Find request unit charge
description: Learn how to find the request unit charge when using the MongoDB API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

This article explains how to find the request unit charge for operations executed against Azure Cosmos DB's API for MongoDB.

Request unit charge is exposed by a custom [database command](https://docs.mongodb.com/manual/reference/command/) named `getLastRequestStatistics`. This command returns a document containing the name of the last operation executed, its request charge and its duration.

# Finding the request unit charge from the MongoDB .NET driver

When using the [official .NET driver](https://docs.mongodb.com/ecosystem/drivers/csharp/), commands can be executed by calling the `RunCommand` method on a `IMongoDatabase` object. This method requires an implementation of the `Command<>` abstract class.

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

# Finding the request from the MongoDB Java driver

When using the [official Java driver](http://mongodb.github.io/mongo-java-driver/), commands can be executed by calling the `runCommand` method on a `MongoDatabase` object.

```java
Document stats = database.runCommand(new Document("getLastRequestStatistics", 1));
Double requestCharge = stats.getDouble("RequestCharge");
```

# Finding the request from the MongoDB Node.js driver

When using the [official Node.js driver](https://mongodb.github.io/node-mongodb-native/), commands can be executed by calling the `command` method on a `Db` object.

```javascript
db.command({ getLastRequestStatistics: 1 }, function(err, result) {
    assert.equal(err, null);
    const requestCharge = result['RequestCharge'];
});
```