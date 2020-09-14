---
title: Register and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB SDKs
description: Learn how to register and call stored procedures, triggers, and user-defined functions using the Azure Cosmos DB SDKs
author: timsander1
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/16/2020
ms.author: tisande
ms.custom: devx-track-python, devx-track-javascript, devx-track-csharp
---

# How to register and use stored procedures, triggers, and user-defined functions in Azure Cosmos DB

The SQL API in Azure Cosmos DB supports registering and invoking stored procedures, triggers, and user-defined functions (UDFs) written in JavaScript. You can use the SQL API [.NET](sql-api-sdk-dotnet.md), [.NET Core](sql-api-sdk-dotnet-core.md), [Java](sql-api-sdk-java.md), [JavaScript](sql-api-sdk-node.md), [Node.js](sql-api-sdk-node.md), or [Python](sql-api-sdk-python.md) SDKs to register and invoke the stored procedures. Once you have defined one or more stored procedures, triggers, and user-defined functions, you can load and view them in the [Azure portal](https://portal.azure.com/) by using Data Explorer.

## <a id="stored-procedures"></a>How to run stored procedures

Stored procedures are written using JavaScript. They can create, update, read, query, and delete items within an Azure Cosmos container. For more information on how to write stored procedures in Azure Cosmos DB, see [How to write stored procedures in Azure Cosmos DB](how-to-write-stored-procedures-triggers-udfs.md#stored-procedures) article.

The following examples show how to register and call a stored procedure by using the Azure Cosmos DB SDKs. Refer to [Create a Document](how-to-write-stored-procedures-triggers-udfs.md#create-an-item) as the source for this stored procedure is saved as `spCreateToDoItem.js`.

> [!NOTE]
> For partitioned containers, when executing a stored procedure, a partition key value must be provided in the request options. Stored procedures are always scoped to a partition key. Items that have a different partition key value will not be visible to the stored procedure. This also applied to triggers as well.

### Stored procedures - .NET SDK V2

The following example shows how to register a stored procedure by using the .NET SDK V2:

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

The following code shows how to call a stored procedure by using the .NET SDK V2:

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

### Stored procedures - .NET SDK V3

The following example shows how to register a stored procedure by using the .NET SDK V3:

```csharp
string storedProcedureId = "spCreateToDoItems";
StoredProcedureResponse storedProcedureResponse = await client.GetContainer("myDatabase", "myContainer").Scripts.CreateStoredProcedureAsync(new StoredProcedureProperties
{
    Id = storedProcedureId,
    Body = File.ReadAllText($@"..\js\{storedProcedureId}.js")
});
```

The following code shows how to call a stored procedure by using the .NET SDK V3:

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

### Stored procedures - Java SDK

The following example shows how to register a stored procedure by using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
StoredProcedure newStoredProcedure = new StoredProcedure(
    "{" +
        "  'id':'spCreateToDoItems'," +
        "  'body':" + new String(Files.readAllBytes(Paths.get("..\\js\\spCreateToDoItems.js"))) +
    "}");
//toBlocking() blocks the thread until the operation is complete and is used only for demo.  
StoredProcedure createdStoredProcedure = asyncClient.createStoredProcedure(containerLink, newStoredProcedure, null)
    .toBlocking().single().getResource();
```

The following code shows how to call a stored procedure by using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
String sprocLink = String.format("%s/sprocs/%s", containerLink, "spCreateToDoItems");
final CountDownLatch successfulCompletionLatch = new CountDownLatch(1);

List<ToDoItem> ToDoItems = new ArrayList<ToDoItem>();

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

ToDoItems.add(newItem)

newItem.category = "Personal";
newItem.name = "Doctor";
newItem.description = "Make appointment for check up";
newItem.isComplete = false;

ToDoItems.add(newItem)

RequestOptions requestOptions = new RequestOptions();
requestOptions.setPartitionKey(new PartitionKey("Personal"));

Object[] storedProcedureArgs = new Object[] { ToDoItems };
asyncClient.executeStoredProcedure(sprocLink, requestOptions, storedProcedureArgs)
    .subscribe(storedProcedureResponse -> {
        String storedProcResultAsString = storedProcedureResponse.getResponseAsString();
        successfulCompletionLatch.countDown();
        System.out.println(storedProcedureResponse.getActivityId());
    }, error -> {
        successfulCompletionLatch.countDown();
        System.err.println("an error occurred while executing the stored procedure: actual cause: "
                + error.getMessage());
    });

successfulCompletionLatch.await();
```

### Stored procedures - JavaScript SDK

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
const {body: result} = await container.scripts.storedProcedure(sprocId).execute(newItem, {partitionKey: newItem[0].category});
```

### Stored procedures - Python SDK

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

## <a id="pre-triggers"></a>How to run pre-triggers

The following examples show how to register and call a pre-trigger by using the Azure Cosmos DB SDKs. Refer to the [Pre-trigger example](how-to-write-stored-procedures-triggers-udfs.md#pre-triggers) as the source for this pre-trigger is saved as `trgPreValidateToDoItemTimestamp.js`.

When executing, pre-triggers are passed in the RequestOptions object by specifying `PreTriggerInclude` and then passing the name of the trigger in a List object.

> [!NOTE]
> Even though the name of the trigger is passed as a List, you can still execute only one trigger per operation.

### Pre-triggers - .NET SDK V2

The following code shows how to register a pre-trigger using the .NET SDK V2:

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

The following code shows how to call a pre-trigger using the .NET SDK V2:

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

### Pre-triggers - .NET SDK V3

The following code shows how to register a pre-trigger using the .NET SDK V3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateTriggerAsync(new TriggerProperties
{
    Id = "trgPreValidateToDoItemTimestamp",
    Body = File.ReadAllText("@..\js\trgPreValidateToDoItemTimestamp.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Pre
});
```

The following code shows how to call a pre-trigger using the .NET SDK V3:

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

### Pre-triggers - Java SDK

The following code shows how to register a pre-trigger using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
String triggerId = "trgPreValidateToDoItemTimestamp";
Trigger trigger = new Trigger();
trigger.setId(triggerId);
trigger.setBody(new String(Files.readAllBytes(Paths.get(String.format("..\\js\\%s.js", triggerId)));
trigger.setTriggerOperation(TriggerOperation.Create);
trigger.setTriggerType(TriggerType.Pre);
//toBlocking() blocks the thread until the operation is complete and is used only for demo. 
Trigger createdTrigger = asyncClient.createTrigger(containerLink, trigger, new RequestOptions()).toBlocking().single().getResource();
```

The following code shows how to call a pre-trigger using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
    Document item = new Document("{ "
            + "\"category\": \"Personal\", "
            + "\"name\": \"Groceries\", "
            + "\"description\": \"Pick up strawberries\", "
            + "\"isComplete\": false, "
            + "}"
            );
RequestOptions requestOptions = new RequestOptions();
requestOptions.setPreTriggerInclude(Arrays.asList("trgPreValidateToDoItemTimestamp"));
//toBlocking() blocks the thread until the operation is complete and is used only for demo. 
asyncClient.createDocument(containerLink, item, requestOptions, false).toBlocking();
```

### Pre-triggers - JavaScript SDK

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
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
}, {preTriggerInclude: [triggerId]});
```

### Pre-triggers - Python SDK

The following code shows how to register a pre-trigger using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client

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

## <a id="post-triggers"></a>How to run post-triggers

The following examples show how to register a post-trigger by using the Azure Cosmos DB SDKs. Refer to the [Post-trigger example](how-to-write-stored-procedures-triggers-udfs.md#post-triggers) as the source for this post-trigger is saved as `trgPostUpdateMetadata.js`.

### Post-triggers - .NET SDK V2

The following code shows how to register a post-trigger using the .NET SDK V2:

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

The following code shows how to call a post-trigger using the .NET SDK V2:

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

### Post-triggers - .NET SDK V3

The following code shows how to register a post-trigger using the .NET SDK V3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateTriggerAsync(new TriggerProperties
{
    Id = "trgPostUpdateMetadata",
    Body = File.ReadAllText(@"..\js\trgPostUpdateMetadata.js"),
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Post
});
```

The following code shows how to call a post-trigger using the .NET SDK V3:

```csharp
var newItem = { 
    name: "artist_profile_1023",
    artist: "The Band",
    albums: ["Hellujah", "Rotators", "Spinning Top"]
};

await client.GetContainer("database", "container").CreateItemAsync(newItem, null, new ItemRequestOptions { PostTriggers = new List<string> { "trgPostUpdateMetadata" } });
```

### Post-triggers - Java SDK

The following code shows how to register a post-trigger using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
String triggerId = "trgPostUpdateMetadata";
Trigger trigger = new Trigger();
trigger.setId(triggerId);
trigger.setBody(new String(Files.readAllBytes(Paths.get(String.format("..\\js\\%s.js", triggerId)))));
trigger.setTriggerOperation(TriggerOperation.Create);
trigger.setTriggerType(TriggerType.Post);
Trigger createdTrigger = asyncClient.createTrigger(containerLink, trigger, new RequestOptions()).toBlocking().single().getResource();
```

The following code shows how to call a post-trigger using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
Document item = new Document(String.format("{ "
    + "\"name\": \"artist_profile_1023\", "
    + "\"artist\": \"The Band\", "
    + "\"albums\": [\"Hellujah\", \"Rotators\", \"Spinning Top\"]"
    + "}"
));
RequestOptions requestOptions = new RequestOptions();
requestOptions.setPostTriggerInclude(Arrays.asList("trgPostUpdateMetadata"));
//toBlocking() blocks the thread until the operation is complete, and is used only for demo.
asyncClient.createDocument(containerLink, item, requestOptions, false).toBlocking();
```

### Post-triggers - JavaScript SDK

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

### Post-triggers - Python SDK

The following code shows how to register a post-trigger using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client

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

## <a id="udfs"></a>How to work with user-defined functions

The following examples show how to register a user-defined function by using the Azure Cosmos DB SDKs. Refer to this [User-defined function example](how-to-write-stored-procedures-triggers-udfs.md#udfs) as the source for this post-trigger is saved as `udfTax.js`.

### User-defined functions - .NET SDK V2

The following code shows how to register a user-defined function using the .NET SDK V2:

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

The following code shows how to call a user-defined function using the .NET SDK V2:

```csharp
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var results = client.CreateDocumentQuery<dynamic>(containerUri, "SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000"));

foreach (var result in results)
{
    //iterate over results
}
```

### User-defined functions - .NET SDK V3

The following code shows how to register a user-defined function using the .NET SDK V3:

```csharp
await client.GetContainer("database", "container").Scripts.CreateUserDefinedFunctionAsync(new UserDefinedFunctionProperties
{
    Id = "Tax",
    Body = File.ReadAllText(@"..\js\Tax.js")
});
```

The following code shows how to call a user-defined function using the .NET SDK V3:

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

### User-defined functions - Java SDK

The following code shows how to register a user-defined function using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
String udfId = "Tax";
UserDefinedFunction udf = new UserDefinedFunction();
udf.setId(udfId);
udf.setBody(new String(Files.readAllBytes(Paths.get(String.format("..\\js\\%s.js", udfId)))));
//toBlocking() blocks the thread until the operation is complete and is used only for demo.
UserDefinedFunction createdUDF = client.createUserDefinedFunction(containerLink, udf, new RequestOptions()).toBlocking().single().getResource();
```

The following code shows how to call a user-defined function using the Java SDK:

```java
String containerLink = String.format("/dbs/%s/colls/%s", "myDatabase", "myContainer");
Observable<FeedResponse<Document>> queryObservable = client.queryDocuments(containerLink, "SELECT * FROM Incomes t WHERE udf.Tax(t.income) > 20000", new FeedOptions());
final CountDownLatch completionLatch = new CountDownLatch(1);
queryObservable.subscribe(
        queryResultPage -> {
            System.out.println("Got a page of query result with " +
                    queryResultPage.getResults().size());
        },
        // terminal error signal
        e -> {
            e.printStackTrace();
            completionLatch.countDown();
        },

        // terminal completion signal
        () -> {
            completionLatch.countDown();
        });
completionLatch.await();
```

### User-defined functions - JavaScript SDK

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

### User-defined functions - Python SDK

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

## Next steps

Learn more concepts and how-to write or use stored procedures, triggers, and user-defined functions in Azure Cosmos DB:

- [Working with Azure Cosmos DB stored procedures, triggers, and user-defined functions in Azure Cosmos DB](stored-procedures-triggers-udfs.md)
- [Working with JavaScript language integrated query API in Azure Cosmos DB](javascript-query-api.md)
- [How to write stored procedures, triggers, and user-defined functions in Azure Cosmos DB](how-to-write-stored-procedures-triggers-udfs.md)
- [How to write stored procedures and triggers using Javascript Query API in Azure Cosmos DB](how-to-write-javascript-query-api.md)
