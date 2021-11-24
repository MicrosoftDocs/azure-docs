---
title: Azure Cosmos DB output binding for Functions 2.x and higher
description: Learn to use the Azure Cosmos DB output binding in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 09/01/2021
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
---

# Azure Cosmos DB output binding for Azure Functions 2.x and higher

The Azure Cosmos DB output binding lets you write a new document to an Azure Cosmos DB database using the SQL API.

For information on setup and configuration details, see the [overview](./functions-bindings-cosmosdb-v2.md).

<a id="example" name="example"></a>

# [C#](#tab/csharp)

This section contains the following examples:

* [Queue trigger, write one doc](#queue-trigger-write-one-doc-c)
* [Queue trigger, write one doc (v4 extension)](#queue-trigger-write-one-doc-v4-c)
* [Queue trigger, write docs using IAsyncCollector](#queue-trigger-write-docs-using-iasynccollector-c)

The examples refer to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

<a id="queue-trigger-write-one-doc-c"></a>

### Queue trigger, write one doc

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using System;

namespace CosmosDBSamplesV2
{
    public static class WriteOneDoc
    {
        [FunctionName("WriteOneDoc")]
        public static void Run(
            [QueueTrigger("todoqueueforwrite")] string queueMessage,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")]out dynamic document,
            ILogger log)
        {
            document = new { Description = queueMessage, id = Guid.NewGuid() };

            log.LogInformation($"C# Queue trigger function inserted one row");
            log.LogInformation($"Description={queueMessage}");
        }
    }
}
```

<a id="queue-trigger-write-one-doc-v4-c"></a>

### Queue trigger, write one doc (v4 extension)

Apps using Cosmos DB [extension version 4.x](./functions-bindings-cosmosdb-v2.md#cosmos-db-extension-4x-and-higher) or higher will have different attribute properties which are shown below. The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using System;

namespace CosmosDBSamplesV2
{
    public static class WriteOneDoc
    {
        [FunctionName("WriteOneDoc")]
        public static void Run(
            [QueueTrigger("todoqueueforwrite")] string queueMessage,
            [CosmosDB(
                databaseName: "ToDoItems",
                containerName: "Items",
                Connection = "CosmosDBConnection")]out dynamic document,
            ILogger log)
        {
            document = new { Description = queueMessage, id = Guid.NewGuid() };

            log.LogInformation($"C# Queue trigger function inserted one row");
            log.LogInformation($"Description={queueMessage}");
        }
    }
}
```

<a id="queue-trigger-write-docs-using-iasynccollector-c"></a>

### Queue trigger, write docs using IAsyncCollector

The following example shows a [C# function](functions-dotnet-class-library.md) that adds a collection of documents to a database, using data provided in a queue message JSON.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class WriteDocsIAsyncCollector
    {
        [FunctionName("WriteDocsIAsyncCollector")]
        public static async Task Run(
            [QueueTrigger("todoqueueforwritemulti")] ToDoItem[] toDoItemsIn,
            [CosmosDB(
                databaseName: "ToDoItems",
                collectionName: "Items",
                ConnectionStringSetting = "CosmosDBConnection")]
                IAsyncCollector<ToDoItem> toDoItemsOut,
            ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed {toDoItemsIn?.Length} items");

            foreach (ToDoItem toDoItem in toDoItemsIn)
            {
                log.LogInformation($"Description={toDoItem.Description}");
                await toDoItemsOut.AddAsync(toDoItem);
            }
        }
    }
}
```

# [C# Script](#tab/csharp-script)

This section contains the following examples:

* [Queue trigger, write one doc](#queue-trigger-write-one-doc-c-script)
* [Queue trigger, write docs using IAsyncCollector](#queue-trigger-write-docs-using-iasynccollector-c-script)


<a id="queue-trigger-write-one-doc-c-script"></a>

### Queue trigger, write one doc

The following example shows an Azure Cosmos DB output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function uses a queue input binding for a queue that receives JSON in the following format:

```json
{
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

The function creates Azure Cosmos DB documents in the following format for each record:

```json
{
    "id": "John Henry-123456",
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

Here's the binding data in the *function.json* file:

```json
{
    "name": "employeeDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "out"
}
```

The [configuration](#configuration) section explains these properties.

Here's the C# script code:

```cs
    #r "Newtonsoft.Json"

    using Microsoft.Azure.WebJobs.Host;
    using Newtonsoft.Json.Linq;
    using Microsoft.Extensions.Logging;

    public static void Run(string myQueueItem, out object employeeDocument, ILogger log)
    {
      log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

      dynamic employee = JObject.Parse(myQueueItem);

      employeeDocument = new {
        id = employee.name + "-" + employee.employeeId,
        name = employee.name,
        employeeId = employee.employeeId,
        address = employee.address
      };
    }
```

<a id="queue-trigger-write-docs-using-iasynccollector-c-script"></a>

### Queue trigger, write docs using IAsyncCollector

To create multiple documents, you can bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

This example refers to a simple `ToDoItem` type:

```cs
namespace CosmosDBSamplesV2
{
    public class ToDoItem
    {
        public string Id { get; set; }
        public string Description { get; set; }
    }
}
```

Here's the function.json file:

```json
{
  "bindings": [
    {
      "name": "toDoItemsIn",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "todoqueueforwritemulti",
      "connectionStringSetting": "AzureWebJobsStorage"
    },
    {
      "type": "cosmosDB",
      "name": "toDoItemsOut",
      "databaseName": "ToDoItems",
      "collectionName": "Items",
      "connectionStringSetting": "CosmosDBConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
using System;
using Microsoft.Extensions.Logging;

public static async Task Run(ToDoItem[] toDoItemsIn, IAsyncCollector<ToDoItem> toDoItemsOut, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed {toDoItemsIn?.Length} items");

    foreach (ToDoItem toDoItem in toDoItemsIn)
    {
        log.LogInformation($"Description={toDoItem.Description}");
        await toDoItemsOut.AddAsync(toDoItem);
    }
}
```

# [Java](#tab/java)

* [Queue trigger, save message to database via return value](#queue-trigger-save-message-to-database-via-return-value-java)
* [HTTP trigger, save one document to database via return value](#http-trigger-save-one-document-to-database-via-return-value-java)
* [HTTP trigger, save one document to database via OutputBinding](#http-trigger-save-one-document-to-database-via-outputbinding-java)
* [HTTP trigger, save multiple documents to database via OutputBinding](#http-trigger-save-multiple-documents-to-database-via-outputbinding-java)


<a id="queue-trigger-save-message-to-database-via-return-value-java"></a>

### Queue trigger, save message to database via return value

The following example shows a Java function that adds a document to a database with data from a message in Queue storage.

```java
@FunctionName("getItem")
@CosmosDBOutput(name = "database",
  databaseName = "ToDoList",
  collectionName = "Items",
  connectionStringSetting = "AzureCosmosDBConnection")
public String cosmosDbQueryById(
    @QueueTrigger(name = "msg",
      queueName = "myqueue-items",
      connection = "AzureWebJobsStorage")
    String message,
    final ExecutionContext context)  {
     return "{ id: \"" + System.currentTimeMillis() + "\", Description: " + message + " }";
   }
```
<a id="http-trigger-save-one-document-to-database-via-return-value-java"></a>

#### HTTP trigger, save one document to database via return value

The following example shows a Java function whose signature is annotated with ```@CosmosDBOutput``` and has return value of type ```String```. The JSON document returned by the function will be automatically written to the corresponding CosmosDB collection.

```java
    @FunctionName("WriteOneDoc")
    @CosmosDBOutput(name = "database",
      databaseName = "ToDoList",
      collectionName = "Items",
      connectionStringSetting = "Cosmos_DB_Connection_String")
    public String run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) {

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());

        // Parse query parameter
        String query = request.getQueryParameters().get("desc");
        String name = request.getBody().orElse(query);

        // Generate random ID
        final int id = Math.abs(new Random().nextInt());

        // Generate document
        final String jsonDocument = "{\"id\":\"" + id + "\", " +
                                    "\"description\": \"" + name + "\"}";

        context.getLogger().info("Document to be saved: " + jsonDocument);

        return jsonDocument;
    }
```

<a id="http-trigger-save-one-document-to-database-via-outputbinding-java"></a>

### HTTP trigger, save one document to database via OutputBinding

The following example shows a Java function that writes a document to CosmosDB via an ```OutputBinding<T>``` output parameter. In this example, the ```outputItem``` parameter needs to be annotated with ```@CosmosDBOutput```, not the function signature. Using ```OutputBinding<T>``` lets your function take advantage of the binding to write the document to CosmosDB while also allowing returning a different value to the function caller, such as a JSON or XML document.

```java
    @FunctionName("WriteOneDocOutputBinding")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBOutput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            OutputBinding<String> outputItem,
            final ExecutionContext context) {

        // Parse query parameter
        String query = request.getQueryParameters().get("desc");
        String name = request.getBody().orElse(query);

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());

        // Generate random ID
        final int id = Math.abs(new Random().nextInt());

        // Generate document
        final String jsonDocument = "{\"id\":\"" + id + "\", " +
                                    "\"description\": \"" + name + "\"}";

        context.getLogger().info("Document to be saved: " + jsonDocument);

        // Set outputItem's value to the JSON document to be saved
        outputItem.setValue(jsonDocument);

        // return a different document to the browser or calling client.
        return request.createResponseBuilder(HttpStatus.OK)
                      .body("Document created successfully.")
                      .build();
    }
```

<a id="http-trigger-save-multiple-documents-to-database-via-outputbinding-java"></a>

### HTTP trigger, save multiple documents to database via OutputBinding

The following example shows a Java function that writes multiple documents to CosmosDB via an ```OutputBinding<T>``` output parameter. In this example, the ```outputItem``` parameter is annotated with ```@CosmosDBOutput```, not the function signature. The output parameter, ```outputItem``` has a list of ```ToDoItem``` objects as its template parameter type. Using ```OutputBinding<T>``` lets your function take advantage of the binding to write the documents to CosmosDB while also allowing returning a different value to the function caller, such as a JSON or XML document.

```java
    @FunctionName("WriteMultipleDocsOutputBinding")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req",
              methods = {HttpMethod.GET, HttpMethod.POST},
              authLevel = AuthorizationLevel.ANONYMOUS)
            HttpRequestMessage<Optional<String>> request,
            @CosmosDBOutput(name = "database",
              databaseName = "ToDoList",
              collectionName = "Items",
              connectionStringSetting = "Cosmos_DB_Connection_String")
            OutputBinding<List<ToDoItem>> outputItem,
            final ExecutionContext context) {

        // Parse query parameter
        String query = request.getQueryParameters().get("desc");
        String name = request.getBody().orElse(query);

        // Item list
        context.getLogger().info("Parameters are: " + request.getQueryParameters());

        // Generate documents
        List<ToDoItem> items = new ArrayList<>();

        for (int i = 0; i < 5; i ++) {
          // Generate random ID
          final int id = Math.abs(new Random().nextInt());

          // Create ToDoItem
          ToDoItem item = new ToDoItem(String.valueOf(id), name);

          items.add(item);
        }

        // Set outputItem's value to the list of POJOs to be saved
        outputItem.setValue(items);
        context.getLogger().info("Document to be saved: " + items);

        // return a different document to the browser or calling client.
        return request.createResponseBuilder(HttpStatus.OK)
                      .body("Documents created successfully.")
                      .build();
    }
```

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBOutput` annotation on parameters that will be written to Cosmos DB.  The annotation parameter type should be ```OutputBinding<T>```, where T is either a native Java type or a POJO.

# [JavaScript](#tab/javascript)

The following example shows an Azure Cosmos DB output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function uses a queue input binding for a queue that receives JSON in the following format:

```json
{
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

The function creates Azure Cosmos DB documents in the following format for each record:

```json
{
    "id": "John Henry-123456",
    "name": "John Henry",
    "employeeId": "123456",
    "address": "A town nearby"
}
```

Here's the binding data in the *function.json* file:

```json
{
    "name": "employeeDocument",
    "type": "cosmosDB",
    "databaseName": "MyDatabase",
    "collectionName": "MyCollection",
    "createIfNotExists": true,
    "connectionStringSetting": "MyAccount_COSMOSDB",
    "direction": "out"
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
    module.exports = function (context) {

      context.bindings.employeeDocument = JSON.stringify({
        id: context.bindings.myQueueItem.name + "-" + context.bindings.myQueueItem.employeeId,
        name: context.bindings.myQueueItem.name,
        employeeId: context.bindings.myQueueItem.employeeId,
        address: context.bindings.myQueueItem.address
      });

      context.done();
    };
```

For bulk insert form the objects first and then run the stringify function. Here's the JavaScript code:

```javascript
    module.exports = function (context) {
    
        context.bindings.employeeDocument = JSON.stringify([
        {
            "id": "John Henry-123456",
            "name": "John Henry",
            "employeeId": "123456",
            "address": "A town nearby"
        },
        {
            "id": "John Doe-123457",
            "name": "John Doe",
            "employeeId": "123457",
            "address": "A town far away"
        }]);
    
      context.done();
    };
```

# [PowerShell](#tab/powershell)

The following example show how to write data to Cosmos DB using an output binding. The binding is declared in the function's configuration file (_functions.json_), and take data from a queue message and writes out to a Cosmos DB document.

```json
{ 
  "name": "EmployeeDocument",
  "type": "cosmosDB",
  "databaseName": "MyDatabase",
  "collectionName": "MyCollection",
  "createIfNotExists": true,
  "connectionStringSetting": "MyStorageConnectionAppSetting",
  "direction": "out" 
} 
```

In the _run.ps1_ file, the object returned from the function is mapped to an `EmployeeDocument` object, which is persisted in the database.

```powershell
param($QueueItem, $TriggerMetadata) 

Push-OutputBinding -Name EmployeeDocument -Value @{ 
    id = $QueueItem.name + '-' + $QueueItem.employeeId 
    name = $QueueItem.name 
    employeeId = $QueueItem.employeeId 
    address = $QueueItem.address 
} 
```

# [Python](#tab/python)

The following example demonstrates how to write a document to an Azure Cosmos DB database as the output of a function.

The binding definition is defined in *function.json* where *type* is set to `cosmosDB`.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "cosmosDB",
      "direction": "out",
      "name": "doc",
      "databaseName": "demodb",
      "collectionName": "data",
      "createIfNotExists": "true",
      "connectionStringSetting": "AzureCosmosDBConnectionString"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

To write to the database, pass a document object to the `set` method of the database parameter.

```python
import azure.functions as func

def main(req: func.HttpRequest, doc: func.Out[func.Document]) -> func.HttpResponse:

    request_body = req.get_body()

    doc.set(func.Document.from_json(request_body))

    return 'OK'
```

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [CosmosDB](https://github.com/Azure/azure-webjobs-sdk-extensions/tree/dev/test/WebJobs.Extensions.CosmosDB.Tests) attribute.

The attribute's constructor takes the database name and collection name. For information about those settings and other properties that you can configure, see [Output - configuration](#configuration). Here's a `CosmosDB` attribute example in a method signature:

```csharp
    [FunctionName("QueueToDocDB")]
    public static void Run(
        [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] string myQueueItem,
        [CosmosDB("ToDoList", "Items", Id = "id", ConnectionStringSetting = "myCosmosDB")] out dynamic document)
    {
        ...
    }
```

In [extension version 4.x](./functions-bindings-cosmosdb-v2.md#cosmos-db-extension-4x-and-higher) some settings and properties have been removed or renamed. For detailed information about the changes, see [Output - configuration](#configuration). Here's a `CosmosDB` attribute example in a method signature:

```csharp
    [FunctionName("QueueToCosmosDB")]
    public static void Run(
      [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] string myQueueItem,
      [CosmosDB("database", "container", Connection = "CosmosDBConnectionSetting")] out dynamic document)
    {
        ...
    }
```

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [Java](#tab/java)

The `CosmosDBOutput` annotation is available to write data to Cosmos DB. You can apply the annotation to the function or to an individual function parameter. When used on the function method, the return value of the function is what is written to Cosmos DB. If you use the annotation with a parameter, the parameter's type must be declared as an `OutputBinding<T>` where `T` a native Java type or a POJO.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [PowerShell](#tab/powershell)

Attributes are not supported by PowerShell.

# [Python](#tab/python)

Attributes are not supported by Python.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `CosmosDB` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type**     | n/a | Must be set to `cosmosDB`.        |
|**direction**     | n/a | Must be set to `out`.         |
|**name**     | n/a | Name of the binding parameter that represents the document in the function.  |
|**databaseName** | **DatabaseName**|The database containing the collection where the document is created.     |
|**collectionName** <br> or <br> **containerName** |**CollectionName** <br> or <br> **ContainerName** | The name of the collection where the document is created. <br><br> In [version 4.x of the extension] this property is called `ContainerName`. |
|**createIfNotExists**  |**CreateIfNotExists**    | A boolean value to indicate whether the collection is created when it doesn't exist. The default is *false* because new collections are created with reserved throughput, which has cost implications. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).  |
|**partitionKey**|**PartitionKey** |When `CreateIfNotExists` is true, it defines the partition key path for the created collection.|
|**collectionThroughput** <br> or <br> **containerThroughput**|**CollectionThroughput** <br> or <br> **ContainerThroughput**| When `CreateIfNotExists` is true, it defines the [throughput](../cosmos-db/set-throughput.md) of the created collection. <br><br> In [version 4.x of the extension] this property is called `ContainerThroughput`. |
|**connectionStringSetting** <br> or <br> **connection**   |**ConnectionStringSetting** <br> or <br> **Connection**| The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account. See [Connections](#connections) <br><br> In [version 4.x of the extension] this property is called `connection`. |
|**preferredLocations**| **PreferredLocations**| (Optional) Defines preferred locations (regions) for geo-replicated database accounts in the Azure Cosmos DB service. Values should be comma-separated. For example, "East US,South Central US,North Europe". |
|**useMultipleWriteLocations**| **UseMultipleWriteLocations**| (Optional) When set to `true` along with `PreferredLocations`, it can leverage [multi-region writes](../cosmos-db/how-to-manage-database-account.md#configure-multiple-write-regions) in the Azure Cosmos DB service. <br><br> This property is not available in [version 4.x of the extension]. |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

[!INCLUDE [functions-cosmosdb-connections](../../includes/functions-cosmosdb-connections.md)]

## Usage

By default, when you write to the output parameter in your function, a document is created in your database. This document has an automatically generated GUID as the document ID. You can specify the document ID of the output document by specifying the `id` property in the JSON object passed to the output parameter.

> [!Note]
> When you specify the ID of an existing document, it gets overwritten by the new output document.

## Exceptions and return codes

| Binding | Reference |
|---|---|
| CosmosDB | [CosmosDB Error Codes](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

<a name="host-json"></a>

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

```json
{
    "version": "2.0",
    "extensions": {
        "cosmosDB": {
            "connectionMode": "Gateway",
            "protocol": "Https",
            "leaseOptions": {
                "leasePrefix": "prefix1"
            }
        }
    }
}
```

|Property  |Default |Description |
|----------|--------|------------|
|GatewayMode|Gateway|The connection mode used by the function when connecting to the Azure Cosmos DB service. Options are `Direct` and `Gateway`|
|Protocol|Https|The connection protocol used by the function when connection to the Azure Cosmos DB service. Read [here for an explanation of both modes](../cosmos-db/performance-tips.md#networking). <br><br> This setting is not available in [version 4.x of the extension]. |
|leasePrefix|n/a|Lease prefix to use across all functions in an app. <br><br> This setting is not available in [version 4.x of the extension].|

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)

[version 4.x of the extension]: ./functions-bindings-cosmosdb-v2.md#cosmos-db-extension-4x-and-higher
