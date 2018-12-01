---
title: How to work with stored procedures, triggers, user-defined functions using Azure Cosmos DB SDKs
description: Learn how to register and use stored procedures, triggers, user-defined functions using the Azure Cosmos DB SDKs
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: sample
ms.date: 12/08/2018
ms.author: mjbrown
---

# How to work with stored procedures, triggers, user-defined functions in Azure Cosmos DB

Azure Cosmos DB supports registering and invoking stored procedures, triggers and user-defined functions (UDFs) written in JavaScript, from the Azure Cosmos DB SQL API SDK for [.NET](sql-api-sdk-dotnet.md), [.NET Core](sql-api-sdk-dotnet-core.md), [Java](sql-api-sdk-java.md), [JavaScript](sql-api-sdk-node.md), [Node.js](sql-api-sdk-node.md) and [Python](sql-api-sdk-python.md). Once you have one or more stored procedures, triggers, and user-defined functions written, you can also load them and view them in the [Azure portal](https://portal.azure.com/) using Data Explorer.

## <a id="stored-procedures">How to work with stored procedures

Stored procedures are written using JavaScript and can create, update, read, query and delete items inside a Cosmos container. For more information on how to write stored procedures in Cosmos DB see, [How to write stored procedures in Azure Cosmos DB](how-to-write-sprocs-triggers-udfs.md#stored-procedures)


### Register a stored procedure

Below are examples of how to register a stored procedure using the Cosmos DB SDKs. Refer to [Create a Document](how-to-write-sprocs-triggers-udfs.md#create-an-item) as the source for this stored procedure, saved as `spCreateToDoItem.js`.

#### .NET

```csharp
// Register the createToDoItem stored procedure
string body = File.ReadAllText($@"..\js\spCreateToDoItem.js");
StoredProcedure newStoredProcedure = new StoredProcedure
   {
       Id = "spCreateToDoItem",
       Body = body
   };
Uri containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var response = await client.CreateStoredProcedureAsync(containerUri, newStoredProcedure);
StoredProcedure createdStoredProcedure = response.resource;
```

#### Java

```java
// Register the createToDoItem stored procedure
String body = new String(Files.readAllBytes(Paths.get("..\js\spCreateToDoItem.js")));
StoredProcedure newStoredProcedure = new StoredProcedure(
    "{" +
        "  'id':'spCreateToDoItem'," +
        "  'body':" + body +
    "}");
StoredProcedure createdStoredProcedure = asyncClient.createStoredProcedure(getCollectionLink(), newStoredProcedure, null)
    .toBlocking().single().getResource();
```

#### JavaScript

```javascript
// Register the createToDoItem stored procedure
var body = fs.readFileSync('..\js\spCreateToDoItem.js', 'utf8');
var newStoredProcedure = {
    id: "spCreateToDoItem",
    serverScript: body
}
var createdStoredProcedure;
client.createStoredProcedureAsync('dbs/myDatabase/colls/myContainer', newStoredProcedure)
    .then(function (response) {
        createdStoredProcedure = response.resource;
        console.log("Successfully created stored procedure");
    }, function (error) {
        console.log("Error", error);
    });
```

#### Python

```python
# Register the createToDoItem stored procedure

```

### Use a stored procedure

Using the registered stored procedure above, the examples below show how to call the stored procedure using the Cosmos DB SDKs.

> [!NOTE]
> For partitioned containers, when executing a stored procedure, a partition key value must be provided in the request options. Stored procedures are always scoped to a partition key. Items that have a different partition key value will not be visible to the stored procedure. This also applied to triggers as well.

#### .NET

```csharp
// Call the createToDoItem stored procedure to insert a new item
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

#### Java

```java
// Call the createToDoItem stored procedure to insert a new item
RequestOptions requestOptions = new RequestOptions();
requestOptions.setPartitionKey(new PartitionKey("Personal"));

final CountDownLatch successfulCompletionLatch = new CountDownLatch(1);

// POJO
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

// Execute the stored procedure
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

#### JavaScript

```javascript
// Call the createToDoItem stored procedure to insert a new item that requires a description
var newItem = {
    category: "Personal",
    name: "Groceries",
    description: "Pick up strawberries",
    isComplete: false
};

var containerUri = 'dbs/myDatabase/colls/myContainer/sprocs/CreateToDoItem';
return client.executeStoredProcedureAsync(containerUri, newItem);
    }, function (error) {
        console.log("Error", error);
    })
.then(function (response) {
    console.log(response); // "DocFromSproc"
}, function (error) {
    console.log("Error", error);
});
```

#### Python

```python
# Call the createToDoItem stored procedure to insert a new item that requires a description

```


## <a id="triggers"></a>How to work with triggers

### Register a pre-trigger

Below are examples of how to register a pre-trigger using the Cosmos DB SDKs. Refer to the [Pre-trigger example](how-to-write-sprocs-triggers-udfs.md#pre-triggers) as the source for this pre-trigger, saved as `trgPreValidateToDoItemTimestamp.js`.

#### .NET

```csharp
string body = File.ReadAllText($@"..\js\trgPreValidateToDoItemTimestamp.js");
Trigger trigger = new Trigger
{
    Id =  "trgPreValidateToDoItemTimestamp",
    Body = body,
    TriggerOperation = TriggerOperation.Create,
    TriggerType = TriggerType.Pre
};
containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
await client.CreateTriggerAsync(containerUri, trigger);
```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```

### Use a pre-trigger

Triggers are passed in the RequestOptions object by specifying `PreTriggerInclude` and then passing the name of the trigger in a List object allowing you to pass more than one trigger in.

#### .NET

```csharp
dynamic newItem = new
{
    category = "Personal",
    name = "Groceries",
    description = "Pick up strawberries",
    isComplete = false
};

containerUri = UriFactory.CreateDocumentCollectionUri("myDatabase", "myContainer");
var requestOptions = new RequestOptions { PreTriggerInclude = new List<string> { "trgPreValidateToDoItemTimestamp" } };
await client.CreateDocumentAsync(containerUri, newItem, requestOptions);
```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```

### Register a post-trigger

Below are examples of how to register a post-trigger using the Cosmos DB SDKs. Refer to the [Post-trigger example](how-to-write-sprocs-triggers-udfs.md#post-triggers) as the source for this post-trigger, saved as `trgPostValidateItem.js`.

#### .NET

```csharp

```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```

### Use a post-trigger


#### .NET

```csharp

```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```

## <a id="udfs"></a>How to work with user-defined functions

Below are examples of how to register a user-defined function using the Cosmos DB SDKs. Refer to this [User-defined function example](how-to-write-sprocs-triggers-udfs.md#udfs) as the source for this post-trigger, saved as `udfCalculateTax.js`.

### Register a user-defined function

#### .NET

```csharp

```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```

### Use a user-defined function

#### .NET

```csharp

```

#### Java

```java

```

#### JavaScript

```javascript

```

#### Python

```python

```


## Next steps

Learn more concepts and how-to write and use stored procedures, triggers and user-defined functions in Azure Cosmos DB:

- [Working with Azure Cosmos DB stored procedures, triggers and user-defined functions in Azure Cosmos DB](sprocs-triggers-udfs.md)
- [Working with JavaScript language integrated query API in Azure Cosmos DB](js-query-api.md)
- [How to write stored procedures, triggers and user-defined functions in Azure Cosmos DB](how-to-write-sprocs-triggers-udfs.md)
- [How to write stored procedures and triggers using Javascript Query API in Azure Cosmos DB](how-to-write-js-query-api.md)
