---
title: How to call stored procedures, triggers, user-defined functions using Azure Cosmos DB SDKs
description: Learn how to register and call stored procedures, triggers, user-defined functions using the Azure Cosmos DB SDKs
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 12/08/2018
ms.author: mjbrown
---

# How to work with stored procedures, triggers, user-defined functions in Azure Cosmos DB

Azure Cosmos DB supports registering and invoking stored procedures, triggers and user-defined functions (UDFs) written in JavaScript, from the Azure Cosmos DB SQL API SDK for [.NET](sql-api-sdk-dotnet.md), [.NET Core](sql-api-sdk-dotnet-core.md), [Java](sql-api-sdk-java.md), [JavaScript](sql-api-sdk-node.md), [Node.js](sql-api-sdk-node.md) and [Python](sql-api-sdk-python.md). Once you have one or more stored procedures, triggers, and user-defined functions written, you can also load them and view them in the [Azure portal](https://portal.azure.com/) using Data Explorer.

## <a id="stored-procedures">How to work with stored procedures</a>

Stored procedures are written using JavaScript and can create, update, read, query and delete items inside a Cosmos container. For more information on how to write stored procedures in Cosmos DB see, [How to write stored procedures in Azure Cosmos DB](how-to-write-sprocs-triggers-udfs.md#stored-procedures)

Below are examples of how to register and call a stored procedure using the Cosmos DB SDKs. Refer to [Create a Document](how-to-write-sprocs-triggers-udfs.md#create-an-item) as the source for this stored procedure, saved as `spCreateToDoItem.js`.

> [!NOTE]
> For partitioned containers, when executing a stored procedure, a partition key value must be provided in the request options. Stored procedures are always scoped to a partition key. Items that have a different partition key value will not be visible to the stored procedure. This also applied to triggers as well.

### Stored procedures - .NET

Register a stored procedure

```csharp
string storedProcedureId = "spCreateToDoItem";
StoredProcedure newStoredProcedure = new StoredProcedure
   {
       Id = storedProcedureId,
       Body = File.ReadAllText($@"..\js\{storedProcedureId}.js")
   };
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var response = await client.CreateStoredProcedureAsync(containerUri, newStoredProcedure);
StoredProcedure createdStoredProcedure = response.Resource;
```

Call a stored procedure

```csharp
dynamic newItem = new
{
    category = "Personal",
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
};

Uri uri = UriFactory.CreateStoredProcedureUri("myDatabase", "myContainer", "spCreateToDoItem");
RequestOptions options = new RequestOptions { PartitionKey = new PartitionKey("Personal") };
var result = await client.ExecuteStoredProcedureAsync<string>(uri, options, newItem);
var id = result.Response;
```

### Stored procedures - Java

Register a stored procedure

```java
StoredProcedure newStoredProcedure = new StoredProcedure(
    "{" +
        "  'id':'spCreateToDoItem'," +
        "  'body':" + String(Files.readAllBytes(Paths.get("..\js\spCreateToDoItem.js"))) +
    "}");
StoredProcedure createdStoredProcedure = asyncClient.createStoredProcedure(getCollectionLink(), newStoredProcedure, null)
    .toBlocking().single().getResource();
```

Call a stored procedure

```java
final CountDownLatch successfulCompletionLatch = new CountDownLatch(1);

class ToDoItem {
    public String category;
    public String name;
    public String description;
    public boolean isComplete;
}

ToDoItem newItem = new ToDoItem();
newItem.category = "Personal";
newItem.name = "Groceries";
newItem.description = "Pick up strawberries";
newItem.isComplete = false;

RequestOptions requestOptions = new RequestOptions();
requestOptions.setPartitionKey(new PartitionKey("Personal"));

Object[] storedProcedureArgs = new Object[] { newItem };
asyncClient.executeStoredProcedure(getSprocLink(storedProcedure), requestOptions, storedProcedureArgs)
        .subscribe(storedProcedureResponse -> {
            String storedProcResultAsString = storedProcedureResponse.getResponseAsString();
            assertThat(storedProcResultAsString, equalTo("\"a is my temp value\""));
            successfulCompletionLatch.countDown();
            System.out.println(storedProcedureResponse.getActivityId());
        }, error -> {
            System.err.println("an error occurred while executing the stored procedure: actual cause: "
                    + error.getMessage());
        });

successfulCompletionLatch.await();
```

### Stored procedures - JavaScript

Register a stored procedure

```javascript
const newStoredProcedure = {
    id: "spCreateToDoItem",
    serverScript: require("../js/spCreateToDoItem.js")
};
const { database } = await client.databases.create({ id: 'MyDatabase' });
const { container } = await database.containers.create({ id: 'MyContainer' });
const { createdStoredProcedure, body: body } = await container.storedProcedures.upsert(newStoredProcedure);
```

Call a stored procedure

```javascript
var newItem = [{
    category: "Personal",
    name: "Groceries",
    description: "Pick up strawberries",
    isComplete: false
}];

const { database } = await client.databases.create({ id: 'MyDatabase' });
const { container } = await database.containers.create({ id: 'MyContainer' });
const spCreateToDoItem =  await.container.storedProcedures('spCreateToDoItem');
var requestOptions =  new RequestOptions { PartitionKey = new PartitionKey("Personal") };
const {body: results, headers} = await spCreateToDoItem.execute(newItem, requestOptions);

if (results)
   var id = results.Response;
```

### Stored procedures - Python

Register a stored procedure

```python


```

Call a stored procedure

```python


```

## <a id="pre-triggers">How to work with pre-triggers</a>

Below are examples of how to register and call a pre-trigger using the Cosmos DB SDKs. Refer to the [Pre-trigger example](how-to-write-sprocs-triggers-udfs.md#pre-triggers) as the source for this pre-trigger, saved as `trgPreValidateToDoItemTimestamp.js`.

When executed, pre-triggers are passed in the RequestOptions object by specifying `PreTriggerInclude` and then passing the name of the trigger in a List object.

> [!NOTE]
> Even though the name of the trigger is passed in a List, you can still only execute one trigger per operation.

### Pre-triggers - .NET

Register a pre-trigger

```csharp
string triggerId = "trgPreValidateToDoItemTimestamp";
Trigger trigger = new Trigger
{
    Id =  triggerId,
    Body = File.ReadAllText($@"..\js\{triggerId}.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Pre
};
containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateTriggerAsync(containerUri, trigger);
```

Call a pre-trigger

```csharp
dynamic newItem = new
{
    category = "Personal",
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
};

containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
RequestOptions requestOptions = new RequestOptions { PreTriggerInclude = new List<string> { "trgPreValidateToDoItemTimestamp" } };
await client.CreateDocumentAsync(containerUri, newItem, requestOptions);
```

### Pre-triggers - Java

Register a pre-trigger

```java

```

Call a pre-trigger

```java

```

### Pre-triggers - JavaScript

Register a pre-trigger

```javascript

```

Call a pre-trigger

```javascript

```

### Pre-triggers - Python

Register a pre-trigger

```python

```

Call a pre-trigger

```python

```

## <a id="post-triggers">How to work with post-triggers</a>

Below are examples of how to register a post-trigger using the Cosmos DB SDKs. Refer to the [Post-trigger example](how-to-write-sprocs-triggers-udfs.md#post-triggers) as the source for this post-trigger, saved as `trgPostUpdateMetadata.js`.

### Post-triggers - .NET

Register a post-trigger

```csharp
string triggerId = "trgPostUpdateMetadata";
Trigger trigger = new Trigger
{
    Id = triggerId,
    Body = File.ReadAllText($@"..\js\{triggerId}.js");,
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Post
};
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateTriggerAsync(containerUri, trigger);
```

Call a post-trigger

```csharp
var newItem = { 
    name: "artist_profile_1023",
    artist: "The Band",
    albums: ["Hellujah", "Rotators", "Spinning Top"]
};

var options = { postTriggerInclude: "trgPostUpdateMetadata" };
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.createDocumentAsync(containerUri, newItem, options);
```

### Post-triggers - Java

Register a post-trigger

```java

```

Call a post-trigger

```java

```

### Post-triggers - JavaScript

Register a post-trigger

```javascript

```

Call a post-trigger

```javascript

```

### Post-triggers - Python

Register a post-trigger

```python

```

Call a post-trigger

```python

```

## <a id="udfs">How to work with user-defined functions</a>

Below are examples of how to register a user-defined function using the Cosmos DB SDKs. Refer to this [User-defined function example](how-to-write-sprocs-triggers-udfs.md#udfs) as the source for this post-trigger, saved as `udfTax.js`.

### User-defined functions - .NET

Register a user-defined function

```csharp
string udfId = "udfTax";
var udfTax = new UserDefinedFunction
{
    Id = udfId,
    Body = File.ReadAllText($@"..\js\{udfId}.js"),
};

containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateUserDefinedFunctionAsync(containerUri, udfTax);

```

Call a user-defined function

```csharp
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var results = client.CreateDocumentQuery<dynamic>(containerUri, "SELECT * FROM Incomes t WHERE udf.tax(t.income) > 20000"));

foreach (var result in results)
{
    //iterate over results
}
```

### User-defined functions - Java

Register a user-defined function

```java

```

Call a user-defined function

```java

```

### User-defined functions - JavaScript

Register a user-defined function

```javascript

```

Call a user-defined function

```javascript

```

### User-defined functions - Python

Register a user-defined function

```python

```

Call a user-defined function

```python

```

## Next steps

Learn more concepts and how-to write and use stored procedures, triggers and user-defined functions in Azure Cosmos DB:

- [Working with Azure Cosmos DB stored procedures, triggers and user-defined functions in Azure Cosmos DB](sprocs-triggers-udfs.md)
- [Working with JavaScript language integrated query API in Azure Cosmos DB](js-query-api.md)
- [How to write stored procedures, triggers and user-defined functions in Azure Cosmos DB](how-to-write-sprocs-triggers-udfs.md)
- [How to write stored procedures and triggers using Javascript Query API in Azure Cosmos DB](how-to-write-js-query-api.md)
