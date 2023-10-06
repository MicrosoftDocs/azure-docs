---
title: Azure Cosmos DB output binding for Functions 2.x and higher
description: Learn to use the Azure Cosmos DB output binding in Azure Functions.
ms.topic: reference
ms.date: 10/05/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, ignite-2022, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Cosmos DB output binding for Azure Functions 2.x and higher

The Azure Cosmos DB output binding lets you write a new document to an Azure Cosmos DB database using the SQL API.

For information on setup and configuration details, see the [overview](./functions-bindings-cosmosdb-v2.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end
::: zone pivot="programming-language-python"
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.

::: zone-end  
::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]
::: zone-end
## Example

Unless otherwise noted, examples in this article target version 3.x of the [Azure Cosmos DB extension](functions-bindings-cosmosdb-v2.md). For use with extension version 4.x, you need to replace the string `collection` in property and attribute names with `container`.

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

The following code defines a `MyDocument` type:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" range="37-46":::

In the following example, the return type is an [`IReadOnlyList<T>`](/dotnet/api/system.collections.generic.ireadonlylist-1), which is a modified list of documents from trigger binding parameter:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" range="4-35":::

# [In-process model](#tab/in-process)

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
        public string id { get; set; }
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

Apps using [Azure Cosmos DB extension version 4.x](./functions-bindings-cosmosdb-v2.md?tabs=extensionv4) or higher will have different attribute properties which are shown below. The following example shows a [C# function](functions-dotnet-class-library.md) that adds a document to a database, using data provided in message from Queue storage.

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

---

::: zone-end
::: zone pivot="programming-language-java"

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

The following example shows a Java function whose signature is annotated with `@CosmosDBOutput` and has return value of type `String`. The JSON document returned by the function will be automatically written to the corresponding Azure Cosmos DB collection.

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

The following example shows a Java function that writes a document to Azure Cosmos DB via an `OutputBinding<T>` output parameter. In this example, the `outputItem` parameter needs to be annotated with `@CosmosDBOutput`, not the function signature. Using `OutputBinding<T>` lets your function take advantage of the binding to write the document to Azure Cosmos DB while also allowing returning a different value to the function caller, such as a JSON or XML document.

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

The following example shows a Java function that writes multiple documents to Azure Cosmos DB via an `OutputBinding<T>` output parameter. In this example, the `outputItem` parameter is annotated with `@CosmosDBOutput`, not the function signature. The output parameter, `outputItem` has a list of `ToDoItem` objects as its template parameter type. Using `OutputBinding<T>` lets your function take advantage of the binding to write the documents to Azure Cosmos DB while also allowing returning a different value to the function caller, such as a JSON or XML document.

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

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBOutput` annotation on parameters that will be written to Azure Cosmos DB.  The annotation parameter type should be `OutputBinding<T>`, where `T` is either a native Java type or a POJO.

::: zone-end  
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following example shows a storage queue triggered [TypeScript function](functions-reference-node.md?tabs=typescript) for a queue that receives JSON in the following format:

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

Here's the TypeScript code:

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosOutput1.ts" :::

To output multiple documents, return an array instead of a single object. For example:

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosOutput2.ts" id="displayInDocs" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

The following example shows a storage queue triggered [JavaScript function](functions-reference-node.md) for a queue that receives JSON in the following format:

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

Here's the JavaScript code:

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosOutput1.js" :::

To output multiple documents, return an array instead of a single object. For example:

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosOutput2.js" id="displayInDocs" :::

# [Model v3](#tab/nodejs-v3)

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
    module.exports = async function (context) {

      context.bindings.employeeDocument = JSON.stringify({
        id: context.bindings.myQueueItem.name + "-" + context.bindings.myQueueItem.employeeId,
        name: context.bindings.myQueueItem.name,
        employeeId: context.bindings.myQueueItem.employeeId,
        address: context.bindings.myQueueItem.address
      });
    };
```

For bulk insert form the objects first and then run the stringify function. Here's the JavaScript code:

```javascript
    module.exports = async function (context) {
    
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
    };
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows how to write data to Azure Cosmos DB using an output binding. The binding is declared in the function's configuration file (_functions.json_), and takes data from a queue message and writes out to an Azure Cosmos DB document.

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

::: zone-end  
::: zone pivot="programming-language-python"  

The following example demonstrates how to write a document to an Azure Cosmos DB database as the output of a function. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.route()
@app.cosmos_db_output(arg_name="documents", 
                      database_name="DB_NAME",
                      collection_name="COLLECTION_NAME",
                      create_if_not_exists=True,
                      connection_string_setting="CONNECTION_SETTING")
def main(req: func.HttpRequest, documents: func.Out[func.Document]) -> func.HttpResponse:
    request_body = req.get_body()
    documents.set(func.Document.from_json(request_body))
    return 'OK'
```

# [v1](#tab/python-v1)

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

::: zone-end 
::: zone pivot="programming-language-csharp" 
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#azure-cosmos-db-v2-output).

# [Extension 4.x+](#tab/extensionv4/in-process)

[!INCLUDE [functions-cosmosdb-output-attributes-v4](../../includes/functions-cosmosdb-output-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/in-process)

[!INCLUDE [functions-cosmosdb-output-attributes-v3](../../includes/functions-cosmosdb-output-attributes-v3.md)]

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-cosmosdb-output-attributes-v4](../../includes/functions-cosmosdb-output-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

[!INCLUDE [functions-cosmosdb-output-attributes-v3](../../includes/functions-cosmosdb-output-attributes-v3.md)]

---
::: zone-end  

::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `cosmos_db_output`:

| Property    | Description |
|-------------|-----------------------------|
|`arg_name` | The variable name used in function code that represents the list of documents with changes. |
|`database_name`  | The name of the Azure Cosmos DB database with the collection being monitored. |
|`collection_name`  | The name of the Azure Cosmos DB collection being monitored. |
|`create_if_not_exists`  | A Boolean value that indicates whether the database and collection should be created if they do not exist. |
|`connection_string_setting` | The connection string of the Azure Cosmos DB being monitored. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

From the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBOutput` annotation on parameters that write to Azure Cosmos DB. The annotation supports the following properties:

+ [name](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.name)
+ [connectionStringSetting](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.connectionstringsetting)
+ [databaseName](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.databasename)
+ [collectionName](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.collectionname)
+ [createIfNotExists](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.createifnotexists)
+ [dataType](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.datatype)
+ [partitionKey](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.partitionkey)
+ [preferredLocations](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.preferredlocations)
+ [useMultipleWriteLocations](/java/api/com.microsoft.azure.functions.annotation.cosmosdboutput.usemultiplewritelocations)

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `output.cosmosDB()` method. The `type`, `direction`, and `name` properties don't apply to the v4 model.

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:  

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:  

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  

# [Extension 4.x+](#tab/extensionv4)

[!INCLUDE [functions-cosmosdb-settings-v4](../../includes/functions-cosmosdb-output-settings-v4.md)]

# [Functions 2.x+](#tab/functionsv2)

[!INCLUDE [functions-cosmosdb-settings-v3](../../includes/functions-cosmosdb-output-settings-v3.md)]

---

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

By default, when you write to the output parameter in your function, a document is created in your database. You should specify the document ID of the output document by specifying the `id` property in the JSON object passed to the output parameter.

> [!NOTE]  
> When you specify the ID of an existing document, it gets overwritten by the new output document.

::: zone pivot="programming-language-csharp"  

The parameter type supported by the Cosmos DB output binding depends on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension 4.x+](#tab/extensionv4/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Functions 2.x+](#tab/functionsv2/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-bindings-cosmosdb-v2-output-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-output-dotnet-isolated-types.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=isolated-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

---

::: zone-end  

[!INCLUDE [functions-cosmosdb-connections](../../includes/functions-cosmosdb-connections.md)]

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Azure Cosmos DB | [HTTP status codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
