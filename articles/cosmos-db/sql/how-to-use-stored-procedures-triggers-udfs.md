---
title: Register and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB SDKs
description: Learn how to register and call stored procedures, triggers, and user-defined functions using the Azure Cosmos DB SDKs
author: seesharprun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 11/03/2021
ms.author: sidandrews
ms.reviewer: jucocchi
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-python, devx-track-js, devx-track-csharp
---

# How to register and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

The SQL API in Azure Cosmos DB supports registering and invoking stored procedures, triggers, and user-defined functions (UDFs) written in JavaScript. Once you've defined one or more stored procedures, triggers, and user-defined functions, you can load and view them in the [Azure portal](https://portal.azure.com/) by using Data Explorer.

You can use the SQL API SDK across multiple platforms including [.NET v2 (legacy)](sql-api-sdk-dotnet.md), [.NET v3](sql-api-sdk-dotnet-standard.md), [Java](sql-api-sdk-java.md), [JavaScript](sql-api-sdk-node.md), or [Python](sql-api-sdk-python.md) SDKs to perform these tasks. If you haven't worked with one of these SDKs before, see the *"Quickstart"* article for the appropriate SDK:

| SDK | Getting started |
| :--- | :--- |
| .NET v3 | [Quickstart: Build a .NET console app to manage Azure Cosmos DB SQL API resources](create-sql-api-dotnet.md) |
| Java | [Quickstart: Build a Java app to manage Azure Cosmos DB SQL API data](create-sql-api-java.md)
| JavaScript | [Quickstart: Use Node.js to connect and query data from Azure Cosmos DB SQL API account](create-sql-api-nodejs.md) |
| Python | [Quickstart: Build a Python application using an Azure Cosmos DB SQL API account](create-sql-api-python.md) |

## How to run stored procedures

Stored procedures are written using JavaScript. They can create, update, read, query, and delete items within an Azure Cosmos container. For more information on how to write stored procedures in Azure Cosmos DB, see [How to write stored procedures in Azure Cosmos DB](how-to-write-stored-procedures-triggers-udfs.md#stored-procedures) article.

The following examples show how to register and call a stored procedure by using the Azure Cosmos DB SDKs. Refer to [Create a Document](how-to-write-stored-procedures-triggers-udfs.md#create-an-item) as the source for this stored procedure is saved as `spCreateToDoItem.js`.

> [!NOTE]
> For partitioned containers, when executing a stored procedure, a partition key value must be provided in the request options. Stored procedures are always scoped to a partition key. Items that have a different partition key value will not be visible to the stored procedure. This also applied to triggers as well.

### [.NET SDK v2](#tab/dotnet-sdk-v2)

The following example shows how to register a stored procedure by using the .NET SDK v2:

```csharp
string storedProcedureId = "spCreateToDoItems";
StoredProcedure newStoredProcedure = new StoredProcedure
   {
       Id = storedProcedureId,
       Body = File.ReadAllText($@"..\js\{storedProcedureId}.js")
   };
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var response = await client.CreateStoredProcedureAsync(containerUri, newStoredProcedure);
StoredProcedure createdStoredProcedure = response.Resource;
```

The following code shows how to call a stored procedure by using the .NET SDK v2:

```csharp
dynamic[] newItems = new dynamic[]
{
    new {
        category = "Personal",
        name = "Groceries",
        description = "Pick up strawberries",
        isComplete = false
    },
    new {
        category = "Personal",
        name = "Doctor",
        description = "Make appointment for check up",
        isComplete = false
    }
};

Uri uri = UriFactory.CreateStoredProcedureUri("myDatabase", "myContainer", "spCreateToDoItem");
RequestOptions options = new RequestOptions { PartitionKey = new PartitionKey("Personal") };
var result = await client.ExecuteStoredProcedureAsync<string>(uri, options, new[] { newItems });
```

### [.NET SDK v3](#tab/dotnet-sdk-v3)

The following example shows how to register a stored procedure by using the .NET SDK v3:

```csharp
string storedProcedureId = "spCreateToDoItems";
StoredProcedureResponse storedProcedureResponse = await client.GetContainer("myDatabase", "myContainer").Scripts.CreateStoredProcedureAsync(new StoredProcedureProperties
{
    Id = storedProcedureId,
    Body = File.ReadAllText($@"..\js\{storedProcedureId}.js")
});
```

The following code shows how to call a stored procedure by using the .NET SDK v3:

```csharp
dynamic[] newItems = new dynamic[]
{
    new {
        category = "Personal",
        name = "Groceries",
        description = "Pick up strawberries",
        isComplete = false
    },
    new {
        category = "Personal",
        name = "Doctor",
        description = "Make appointment for check up",
        isComplete = false
    }
};

var result = await client.GetContainer("database", "container").Scripts.ExecuteStoredProcedureAsync<string>("spCreateToDoItem", new PartitionKey("Personal"), new[] { newItems });
```

### [Java SDK](#tab/java-sdk)

The following example shows how to register a stored procedure by using the Java SDK:

```java
CosmosStoredProcedureProperties definition = new CosmosStoredProcedureProperties(
    "spCreateToDoItems", 
    Files.readString(Paths.get("createToDoItems.js"))
);

CosmosStoredProcedureResponse response = container
    .getScripts()
    .createStoredProcedure(definition);
```

The following code shows how to call a stored procedure by using the Java SDK:

```java
CosmosStoredProcedure sproc = container   
    .getScripts()
    .getStoredProcedure("spCreateToDoItems");

List<Object> items = new ArrayList<Object>();

ToDoItem firstItem = new ToDoItem();
firstItem.category = "Personal";
firstItem.name = "Groceries";
firstItem.description = "Pick up strawberries";
firstItem.isComplete = false;
items.add(firstItem);

ToDoItem secondItem = new ToDoItem();
secondItem.category = "Personal";
secondItem.name = "Doctor";
secondItem.description = "Make appointment for check up";
secondItem.isComplete = true;
items.add(secondItem);

CosmosStoredProcedureRequestOptions options = new CosmosStoredProcedureRequestOptions();
options.setPartitionKey(
    new PartitionKey("Personal")
);

CosmosStoredProcedureResponse response = sproc.execute(
    items, 
    options
); 
```

### [JavaScript SDK](#tab/javascript-sdk)

The following example shows how to register a stored procedure by using the JavaScript SDK

```javascript
const container = client.database("myDatabase").container("myContainer");
const sprocId = "spCreateToDoItems";
await container.scripts.storedProcedures.create({
    id: sprocId,
    body: require(`../js/${sprocId}`)
});
```

The following code shows how to call a stored procedure by using the JavaScript SDK:

```javascript
const newItem = [{
    category: "Personal",
    name: "Groceries",
    description: "Pick up strawberries",
    isComplete: false
}];
const container = client.database("myDatabase").container("myContainer");
const sprocId = "spCreateToDoItems";
const {resource: result} = await container.scripts.storedProcedure(sprocId).execute(newItem, {partitionKey: newItem[0].category});
```

### [Python SDK](#tab/python-sdk)

The following example shows how to register a stored procedure by using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client

url = "your_cosmos_db_account_URI"
key = "your_cosmos_db_account_key"
database_name = 'your_cosmos_db_database_name'
container_name = 'your_cosmos_db_container_name'

with open('../js/spCreateToDoItems.js') as file:
    file_contents = file.read()

sproc = {
    'id': 'spCreateToDoItem',
    'serverScript': file_contents,
}
client = cosmos_client.CosmosClient(url, key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)
created_sproc = container.scripts.create_stored_procedure(body=sproc) 
```

The following code shows how to call a stored procedure by using the Python SDK:

```python
import uuid

new_id= str(uuid.uuid4())

# Creating a document for a container with "id" as a partition key.

new_item =   {
      "id": new_id, 
      "category":"Personal",
      "name":"Groceries",
      "description":"Pick up strawberries",
      "isComplete":False
   }
result = container.scripts.execute_stored_procedure(sproc=created_sproc,params=[[new_item]], partition_key=new_id) 
```

---

## How to run pre-triggers

The following examples show how to register and call a pre-trigger by using the Azure Cosmos DB SDKs. Refer to the [Pre-trigger example](how-to-write-stored-procedures-triggers-udfs.md#pre-triggers) as the source for this pre-trigger is saved as `trgPreValidateToDoItemTimestamp.js`.

Pre-triggers are passed in the RequestOptions object, when executing an operation, by specifying `PreTriggerInclude` and then passing the name of the trigger in a List object.

> [!NOTE]
> Even though the name of the trigger is passed as a List, you can still execute only one trigger per operation.

### [.NET SDK v2](#tab/dotnet-sdk-v2)

The following code shows how to register a pre-trigger using the .NET SDK v2:

```csharp
string triggerId = "trgPreValidateToDoItemTimestamp";
Trigger trigger = new Trigger
{
    Id =  triggerId,
    Body = File.ReadAllText($@"..\js\{triggerId}.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Pre
};
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateTriggerAsync(containerUri, trigger);
```

The following code shows how to call a pre-trigger using the .NET SDK v2:

```csharp
dynamic newItem = new
{
    category = "Personal",
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
};

Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
RequestOptions requestOptions = new RequestOptions { PreTriggerInclude = new List<string> { "trgPreValidateToDoItemTimestamp" } };
await client.CreateDocumentAsync(containerUri, newItem, requestOptions);
```

### [.NET SDK v3](#tab/dotnet-sdk-v3)

The following code shows how to register a pre-trigger using the .NET SDK v3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateTriggerAsync(new TriggerProperties
{
    Id = "trgPreValidateToDoItemTimestamp",
    Body = File.ReadAllText("@..\js\trgPreValidateToDoItemTimestamp.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Pre
});
```

The following code shows how to call a pre-trigger using the .NET SDK v3:

```csharp
dynamic newItem = new
{
    category = "Personal",
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
};

await client.GetContainer("database", "container").CreateItemAsync(newItem, null, new ItemRequestOptions { PreTriggers = new List<string> { "trgPreValidateToDoItemTimestamp" } });
```

### [Java SDK](#tab/java-sdk)

The following code shows how to register a pre-trigger using the Java SDK:

```java
CosmosTriggerProperties definition = new CosmosTriggerProperties(
    "preValidateToDoItemTimestamp",
    Files.readString(Paths.get("validateToDoItemTimestamp.js"))
);
definition.setTriggerOperation(TriggerOperation.CREATE);
definition.setTriggerType(TriggerType.PRE);

CosmosTriggerResponse response = container
    .getScripts()
    .createTrigger(definition);
```

The following code shows how to call a pre-trigger using the Java SDK:

```java
ToDoItem item = new ToDoItem();
item.category = "Personal";
item.name = "Groceries";
item.description = "Pick up strawberries";
item.isComplete = false;
    
CosmosItemRequestOptions options = new CosmosItemRequestOptions();
options.setPreTriggerInclude(
    Arrays.asList("preValidateToDoItemTimestamp")
);

CosmosItemResponse<ToDoItem> response = container.createItem(item, options);
```

### [JavaScript SDK](#tab/javascript-sdk)

The following code shows how to register a pre-trigger using the JavaScript SDK:

```javascript
const container = client.database("myDatabase").container("myContainer");
const triggerId = "trgPreValidateToDoItemTimestamp";
await container.triggers.create({
    id: triggerId,
    body: require(`../js/${triggerId}`),
    triggerOperation: "create",
    triggerType: "pre"
});
```

The following code shows how to call a pre-trigger using the JavaScript SDK:

```javascript
const container = client.database("myDatabase").container("myContainer");
const triggerId = "trgPreValidateToDoItemTimestamp";
await container.items.create({
    category: "Personal",
    name: "Groceries",
    description: "Pick up strawberries",
    isComplete: false
}, {preTriggerInclude: [triggerId]});
```

### [Python SDK](#tab/python-sdk)

The following code shows how to register a pre-trigger using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client
from azure.cosmos import documents

url = "your_cosmos_db_account_URI"
key = "your_cosmos_db_account_key"
database_name = 'your_cosmos_db_database_name'
container_name = 'your_cosmos_db_container_name'

with open('../js/trgPreValidateToDoItemTimestamp.js') as file:
    file_contents = file.read()

trigger_definition = {
    'id': 'trgPreValidateToDoItemTimestamp',
    'serverScript': file_contents,
    'triggerType': documents.TriggerType.Pre,
    'triggerOperation': documents.TriggerOperation.All
}
client = cosmos_client.CosmosClient(url, key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)
trigger = container.scripts.create_trigger(trigger_definition)
```

The following code shows how to call a pre-trigger using the Python SDK:

```python
item = {'category': 'Personal', 'name': 'Groceries',
        'description': 'Pick up strawberries', 'isComplete': False}
container.create_item(item, {'pre_trigger_include': 'trgPreValidateToDoItemTimestamp'})
```

---

## How to run post-triggers

The following examples show how to register a post-trigger by using the Azure Cosmos DB SDKs. Refer to the [Post-trigger example](how-to-write-stored-procedures-triggers-udfs.md#post-triggers) as the source for this post-trigger is saved as `trgPostUpdateMetadata.js`.

### [.NET SDK v2](#tab/dotnet-sdk-v2)

The following code shows how to register a post-trigger using the .NET SDK v2:

```csharp
string triggerId = "trgPostUpdateMetadata";
Trigger trigger = new Trigger
{
    Id = triggerId,
    Body = File.ReadAllText($@"..\js\{triggerId}.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Post
};
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateTriggerAsync(containerUri, trigger);
```

The following code shows how to call a post-trigger using the .NET SDK v2:

```csharp
var newItem = { 
    name: "artist_profile_1023",
    artist: "The Band",
    albums: ["Hellujah", "Rotators", "Spinning Top"]
};

RequestOptions options = new RequestOptions { PostTriggerInclude = new List<string> { "trgPostUpdateMetadata" } };
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.createDocumentAsync(containerUri, newItem, options);
```

### [.NET SDK v3](#tab/dotnet-sdk-v3)

The following code shows how to register a post-trigger using the .NET SDK v3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateTriggerAsync(new TriggerProperties
{
    Id = "trgPostUpdateMetadata",
    Body = File.ReadAllText(@"..\js\trgPostUpdateMetadata.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Post
});
```

The following code shows how to call a post-trigger using the .NET SDK v3:

```csharp
var newItem = { 
    name: "artist_profile_1023",
    artist: "The Band",
    albums: ["Hellujah", "Rotators", "Spinning Top"]
};

await client.GetContainer("database", "container").CreateItemAsync(newItem, null, new ItemRequestOptions { PostTriggers = new List<string> { "trgPostUpdateMetadata" } });
```

### [Java SDK](#tab/java-sdk)

The following code shows how to register a post-trigger using the Java SDK:

```java
CosmosTriggerProperties definition = new CosmosTriggerProperties(
    "postUpdateMetadata",
    Files.readString(Paths.get("updateMetadata.js"))
);
definition.setTriggerOperation(TriggerOperation.CREATE);
definition.setTriggerType(TriggerType.POST);

CosmosTriggerResponse response = container
    .getScripts()
    .createTrigger(definition);
```

The following code shows how to call a post-trigger using the Java SDK:

```java
ToDoItem item = new ToDoItem();
item.category = "Personal";
item.name = "Doctor";
item.description = "Make appointment for check up";
item.isComplete = true;
    
CosmosItemRequestOptions options = new CosmosItemRequestOptions();
options.setPostTriggerInclude(
    Arrays.asList("postUpdateMetadata")
);

CosmosItemResponse<ToDoItem> response = container.createItem(item, options);
```

### [JavaScript SDK](#tab/javascript-sdk)

The following code shows how to register a post-trigger using the JavaScript SDK:

```javascript
const container = client.database("myDatabase").container("myContainer");
const triggerId = "trgPostUpdateMetadata";
await container.triggers.create({
    id: triggerId,
    body: require(`../js/${triggerId}`),
    triggerOperation: "create",
    triggerType: "post"
});
```

The following code shows how to call a post-trigger using the JavaScript SDK:

```javascript
const item = {
    name: "artist_profile_1023",
    artist: "The Band",
    albums: ["Hellujah", "Rotators", "Spinning Top"]
};
const container = client.database("myDatabase").container("myContainer");
const triggerId = "trgPostUpdateMetadata";
await container.items.create(item, {postTriggerInclude: [triggerId]});
```

### [Python SDK](#tab/python-sdk)

The following code shows how to register a post-trigger using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client
from azure.cosmos import documents

url = "your_cosmos_db_account_URI"
key = "your_cosmos_db_account_key"
database_name = 'your_cosmos_db_database_name'
container_name = 'your_cosmos_db_container_name'

with open('../js/trgPostValidateToDoItemTimestamp.js') as file:
    file_contents = file.read()

trigger_definition = {
    'id': 'trgPostValidateToDoItemTimestamp',
    'serverScript': file_contents,
    'triggerType': documents.TriggerType.Post,
    'triggerOperation': documents.TriggerOperation.All
}
client = cosmos_client.CosmosClient(url, key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)
trigger = container.scripts.create_trigger(trigger_definition)
```

The following code shows how to call a post-trigger using the Python SDK:

```python
item = {'category': 'Personal', 'name': 'Groceries',
        'description': 'Pick up strawberries', 'isComplete': False}
container.create_item(item, {'post_trigger_include': 'trgPreValidateToDoItemTimestamp'})
```

---

## How to work with user-defined functions

The following examples show how to register a user-defined function by using the Azure Cosmos DB SDKs. Refer to this [User-defined function example](how-to-write-stored-procedures-triggers-udfs.md#udfs) as the source for this post-trigger is saved as `udfTax.js`.

### [.NET SDK v2](#tab/dotnet-sdk-v2)

The following code shows how to register a user-defined function using the .NET SDK v2:

```csharp
string udfId = "Tax";
var udfTax = new UserDefinedFunction
{
    Id = udfId,
    Body = File.ReadAllText($@"..\js\{udfId}.js")
};

Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateUserDefinedFunctionAsync(containerUri, udfTax);

```

The following code shows how to call a user-defined function using the .NET SDK v2:

```csharp
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var results = client.CreateDocumentQuery<dynamic>(containerUri, "SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000"));

foreach (var result in results)
{
    //iterate over results
}
```

### [.NET SDK v3](#tab/dotnet-sdk-v3)

The following code shows how to register a user-defined function using the .NET SDK v3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateUserDefinedFunctionAsync(new UserDefinedFunctionProperties
{
    Id = "Tax",
    Body = File.ReadAllText(@"..\js\Tax.js")
});
```

The following code shows how to call a user-defined function using the .NET SDK v3:

```csharp
var iterator = client.GetContainer("database", "container").GetItemQueryIterator<dynamic>("SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000");
while (iterator.HasMoreResults)
{
    var results = await iterator.ReadNextAsync();
    foreach (var result in results)
    {
        //iterate over results
    }
}
```

### [Java SDK](#tab/java-sdk)

The following code shows how to register a user-defined function using the Java SDK:

```java
CosmosUserDefinedFunctionProperties definition = new CosmosUserDefinedFunctionProperties(
    "udfTax",
    Files.readString(Paths.get("tax.js"))
);

CosmosUserDefinedFunctionResponse response = container
    .getScripts()
    .createUserDefinedFunction(definition);
```

The following code shows how to call a user-defined function using the Java SDK:

```java
CosmosQueryRequestOptions options = new CosmosQueryRequestOptions();

CosmosPagedIterable<ToDoItem> iterable = container.queryItems(
    "SELECT t.cost, udf.udfTax(t.cost) AS costWithTax FROM t", 
    options, 
    ToDoItem.class);
```

### [JavaScript SDK](#tab/javascript-sdk)

The following code shows how to register a user-defined function using the JavaScript SDK:

```javascript
const container = client.database("myDatabase").container("myContainer");
const udfId = "Tax";
await container.userDefinedFunctions.create({
    id: udfId,
    body: require(`../js/${udfId}`)
```

The following code shows how to call a user-defined function using the JavaScript SDK:

```javascript
const container = client.database("myDatabase").container("myContainer");
const sql = "SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000";
const {result} = await container.items.query(sql).toArray();
```

### [Python SDK](#tab/python-sdk)

The following code shows how to register a user-defined function using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client

url = "your_cosmos_db_account_URI"
key = "your_cosmos_db_account_key"
database_name = 'your_cosmos_db_database_name'
container_name = 'your_cosmos_db_container_name'

with open('../js/udfTax.js') as file:
    file_contents = file.read()
udf_definition = {
    'id': 'Tax',
    'serverScript': file_contents,
}
client = cosmos_client.CosmosClient(url, key)
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)
udf = container.scripts.create_user_defined_function(udf_definition)
```

The following code shows how to call a user-defined function using the Python SDK:

```python
results = list(container.query_items(
    'query': 'SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000'))
```

---

## Next steps

Learn more concepts and how-to write or use stored procedures, triggers, and user-defined functions in Azure Cosmos DB:

- [Working with Azure Cosmos DB stored procedures, triggers, and user-defined functions in Azure Cosmos DB](stored-procedures-triggers-udfs.md)
- [Working with JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md)
- [How to write stored procedures, triggers, and user-defined functions in Azure Cosmos DB](how-to-write-stored-procedures-triggers-udfs.md)
- [How to write stored procedures and triggers using JavaScript Query API in Azure Cosmos DB](how-to-write-javascript-query-api.md)
