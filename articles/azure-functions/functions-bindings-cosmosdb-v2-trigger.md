---
title: Azure Cosmos DB trigger for Functions 2.x and higher
description: Learn to use the Azure Cosmos DB trigger in Azure Functions.
ms.topic: reference
ms.date: 04/04/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, ignite-2022, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Cosmos DB trigger for Azure Functions 2.x and higher

The Azure Cosmos DB Trigger uses the [Azure Cosmos DB change feed](../cosmos-db/change-feed.md) to listen for inserts and updates across partitions. The change feed publishes new and updated items, not including updates from deletions.

For information on setup and configuration details, see the [overview](./functions-bindings-cosmosdb-v2.md).

Cosmos DB scaling decisions for the Consumption and Premium plans are done via target-based scaling. For more information, see [Target-based scaling](functions-target-based-scaling.md).

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

## Example

::: zone pivot="programming-language-csharp"

The usage of the trigger depends on the extension package version and the C# modality used in your function app, which can be one of the following:

# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.

# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
---

The following examples depend on the extension version for the given C# mode.

# [Extension 4.x+](#tab/extensionv4/in-process)

Apps using [Azure Cosmos DB extension version 4.x](./functions-bindings-cosmosdb-v2.md?tabs=extensionv4) or higher will have different attribute properties, which are shown below. This example refers to a simple `ToDoItem` type.

```cs
namespace CosmosDBSamplesV2
{
    // Customize the model with your own desired properties
    public class ToDoItem
    {
        public string id { get; set; }
        public string Description { get; set; }
    }
}
```

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class CosmosTrigger
    {
        [FunctionName("CosmosTrigger")]
        public static void Run([CosmosDBTrigger(
            databaseName: "databaseName",
            containerName: "containerName",
            Connection = "CosmosDBConnectionSetting",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)]IReadOnlyList<ToDoItem> input, ILogger log)
        {
            if (input != null && input.Count > 0)
            {
                log.LogInformation("Documents modified " + input.Count);
                log.LogInformation("First document Id " + input[0].id);
            }
        }
    }
}
```

# [Functions 2.x+](#tab/functionsv2/in-process)

The following example shows a [C# function](functions-dotnet-class-library.md) that is invoked when there are inserts or updates in the specified database and collection.

```cs
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamplesV2
{
    public static class CosmosTrigger
    {
        [FunctionName("CosmosTrigger")]
        public static void Run([CosmosDBTrigger(
            databaseName: "ToDoItems",
            collectionName: "Items",
            ConnectionStringSetting = "CosmosDBConnection",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> documents,
            ILogger log)
        {
            if (documents != null && documents.Count > 0)
            {
                log.LogInformation($"Documents modified: {documents.Count}");
                log.LogInformation($"First document Id: {documents[0].Id}");
            }
        }
    }
}
```

# [Extension 4.x+](#tab/extensionv4/isolated-process)

This example refers to a simple `ToDoItem` type:

```csharp
public class ToDoItem
{
    public string? Id { get; set; }
    public string? Description { get; set; }
}
```

The following function is invoked when there are inserts or updates in the specified database and collection.

```csharp
[Function("CosmosTrigger")]
public void Run([CosmosDBTrigger(
    databaseName: "ToDoItems",
    containerName:"TriggerItems",
    Connection = "CosmosDBConnection",
    LeaseContainerName = "leases",
    CreateLeaseContainerIfNotExists = true)] IReadOnlyList<ToDoItem> todoItems,
    FunctionContext context)
{
    if (todoItems is not null && todoItems.Any())
    {
        foreach (var doc in todoItems)
        {
            _logger.LogInformation("ToDoItem: {desc}", doc.Description);
        }
    }
}
```

# [Functions 2.x+](#tab/functionsv2/isolated-process)

The following code defines a `MyDocument` type:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" range="40-49":::

An [`IReadOnlyList<T>`](/dotnet/api/system.collections.generic.ireadonlylist-1) is used as the Azure Cosmos DB trigger binding parameter in the following example:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" id="docsnippet_exponential_backoff_retry_example":::

This example requires the following `using` statements:

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/CosmosDB/CosmosDBFunction.cs" range="4-7":::

---

::: zone-end
::: zone pivot="programming-language-java"

This function is invoked when there are inserts or updates in the specified database and collection.

# [Functions 2.x+](#tab/functionsv2)

```java
    @FunctionName("cosmosDBMonitor")
    public void cosmosDbProcessor(
        @CosmosDBTrigger(name = "items",
            databaseName = "ToDoList",
            collectionName = "Items",
            leaseCollectionName = "leases",
            createLeaseCollectionIfNotExists = true,
            connectionStringSetting = "AzureCosmosDBConnection") String[] items,
            final ExecutionContext context ) {
                context.getLogger().info(items.length + "item(s) is/are changed.");
            }
```
# [Extension 4.x+](#tab/extensionv4)

[!INCLUDE [functions-cosmosdb-extension-java-note](../../includes/functions-cosmosdb-extension-java-note.md)]

---

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBTrigger` annotation on parameters whose value would come from Azure Cosmos DB.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

::: zone-end  
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an Azure Cosmos DB trigger [TypeScript function](functions-reference-node.md?tabs=typescript). The function writes log messages when Azure Cosmos DB records are added or modified.

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/cosmosDBTrigger1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end  
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

The following example shows an Azure Cosmos DB trigger [JavaScript function](functions-reference-node.md). The function writes log messages when Azure Cosmos DB records are added or modified.

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/cosmosDBTrigger1.js" :::

# [Model v3](#tab/nodejs-v3)

The following example shows an Azure Cosmos DB trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes log messages when Azure Cosmos DB records are added or modified.

Here's the binding data in the *function.json* file:

[!INCLUDE [functions-cosmosdb-trigger-attributes](../../includes/functions-cosmosdb-trigger-attributes.md)]

Here's the JavaScript code:

```javascript
    module.exports = async function (context, documents) {
      context.log('First document Id modified : ', documents[0].id);
    }
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example shows how to run a function as data changes in Azure Cosmos DB.

[!INCLUDE [functions-cosmosdb-trigger-attributes](../../includes/functions-cosmosdb-trigger-attributes.md)]

In the _run.ps1_ file, you have access to the document that triggers the function via the `$Documents` parameter.

```powershell
param($Documents, $TriggerMetadata) 

Write-Host "First document Id modified : $($Documents[0].id)" 
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example shows an Azure Cosmos DB trigger binding. The example depends on whether you use the [v1 or v2 Python programming model](functions-reference-python.md).

# [v2](#tab/python-v2)

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="CosmosDBTrigger")
@app.cosmos_db_trigger(arg_name="documents", 
                       database_name="DB_NAME", 
                       collection_name="COLLECTION_NAME", 
                       connection_string_setting="CONNECTION_SETTING",
 lease_collection_name="leases", create_lease_collection_if_not_exists="true")
def test_function(documents: func.DocumentList) -> str:
    if documents:
        logging.info('Document id: %s', documents[0]['id'])
```

# [v1](#tab/python-v1)

The function writes log messages when Azure Cosmos DB records are modified. Here's the binding data in the *function.json* file:

[!INCLUDE [functions-cosmosdb-trigger-attributes](../../includes/functions-cosmosdb-trigger-attributes.md)]

Here's the Python code:

```python
    import logging
    import azure.functions as func


    def main(documents: func.DocumentList) -> str:
        if documents:
            logging.info('First document Id modified: %s', documents[0]['id'])
```

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the [CosmosDBTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/Trigger/CosmosDBTriggerAttribute.cs) to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#azure-cosmos-db-v2-trigger).

# [Extension 4.x+](#tab/extensionv4/in-process)

[!INCLUDE [functions-cosmosdb-attributes-v4](../../includes/functions-cosmosdb-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/in-process)

[!INCLUDE [functions-cosmosdb-attributes-v3](../../includes/functions-cosmosdb-attributes-v3.md)] 

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-cosmosdb-attributes-v4](../../includes/functions-cosmosdb-attributes-v4.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

[!INCLUDE [functions-cosmosdb-attributes-v3](../../includes/functions-cosmosdb-attributes-v3.md)]

---

::: zone-end  
::: zone pivot="programming-language-python"
## Decorators

_Applies only to the Python v2 programming model._

For Python v2 functions defined using a decorator, the following properties on the `cosmos_db_trigger`:

| Property    | Description |
|-------------|-----------------------------|
|`arg_name` | The variable name used in function code that represents the list of documents with changes. |
|`database_name`  | The name of the Azure Cosmos DB database with the collection being monitored. |
|`collection_name`  | The name of the Azure Cosmos DB collection being monitored. |
|`connection` | The connection string of the Azure Cosmos DB being monitored. |

For Python functions defined by using *function.json*, see the [Configuration](#configuration) section.
::: zone-end

::: zone pivot="programming-language-java"  
## Annotations

# [Functions 2.x+](#tab/functionsv2)

From the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@CosmosDBInput` annotation on parameters that read data from Azure Cosmos DB. The annotation supports the following properties:

+ [name](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.name)
+ [connectionStringSetting](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.connectionstringsetting)
+ [databaseName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.databasename)
+ [collectionName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.collectionname)
+ [leaseConnectionStringSetting](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leaseconnectionstringsetting)
+ [leaseDatabaseName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leasedatabasename)
+ [leaseCollectionName](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leasecollectionname)
+ [createLeaseCollectionIfNotExists](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.createleasecollectionifnotexists)
+ [leasesCollectionThroughput](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leasescollectionthroughput)
+ [leaseCollectionPrefix](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leasecollectionprefix)
+ [feedPollDelay](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.feedpolldelay)
+ [leaseAcquireInterval](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leaseacquireinterval)
+ [leaseExpirationInterval](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leaseexpirationinterval)
+ [leaseRenewInterval](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.leaserenewinterval)
+ [checkpointInterval](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.checkpointinterval)
+ [checkpointDocumentCount](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.checkpointdocumentcount)
+ [maxItemsPerInvocation](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.maxitemsperinvocation)
+ [startFromBeginning](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.startfrombeginning)
+ [preferredLocations](/java/api/com.microsoft.azure.functions.annotation.cosmosdbtrigger.preferredlocations)

# [Extension 4.x+](#tab/extensionv4)

[!INCLUDE [functions-cosmosdb-extension-java-note](../../includes/functions-cosmosdb-extension-java-note.md)]

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
## Configuration
::: zone-end

::: zone pivot="programming-language-python" 
_Applies only to the Python v1 programming model._

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `app.cosmosDB()` method. The `type`, `direction`, and `name` properties don't apply to the v4 model.

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:  

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"  

The following table explains the binding configuration properties that you set in the *function.json* file, where properties differ by extension version:  

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  

# [Functions 2.x+](#tab/functionsv2)

[!INCLUDE [functions-cosmosdb-settings-v3](../../includes/functions-cosmosdb-settings-v3.md)]

# [Extension 4.x+](#tab/extensionv4)

[!INCLUDE [functions-cosmosdb-settings-v4](../../includes/functions-cosmosdb-settings-v4.md)]

---

::: zone-end  

See the [Example section](#example) for complete examples.

## Usage

The trigger requires a second collection that it uses to store _leases_ over the partitions. Both the collection being monitored and the collection that contains the leases must be available for the trigger to work.

::: zone pivot="programming-language-csharp"  
>[!IMPORTANT]
> If multiple functions are configured to use an Azure Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection or specify a different `LeaseCollectionPrefix` for each function. Otherwise, only one of the functions is triggered. For information about the prefix, see the [Attributes section](#attributes).
::: zone-end
::: zone pivot="programming-language-java"  
>[!IMPORTANT]
> If multiple functions are configured to use an Azure Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection or specify a different `leaseCollectionPrefix` for each function. Otherwise, only one of the functions is triggered. For information about the prefix, see the [Annotations section](#annotations).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python"  
>[!IMPORTANT]
> If multiple functions are configured to use an Azure Cosmos DB trigger for the same collection, each of the functions should use a dedicated lease collection or specify a different `leaseCollectionPrefix` for each function. Otherwise, only one of the functions will be triggered. For information about the prefix, see the [Configuration section](#configuration).
::: zone-end

The trigger doesn't indicate whether a document was updated or inserted, it just provides the document itself. If you need to handle updates and inserts differently, you could do that by implementing timestamp fields for insertion or update.

::: zone pivot="programming-language-csharp"

The parameter type supported by the Azure Cosmos DB trigger depends on the Functions runtime version, the extension package version, and the C# modality used.

# [Extension 4.x+](#tab/extensionv4/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cextensionv4&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Functions 2.x+](#tab/functionsv2/in-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

[!INCLUDE [functions-bindings-cosmosdb-v2-trigger-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-trigger-dotnet-isolated-types.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

See [Binding types](./functions-bindings-cosmosdb-v2.md?tabs=isolated-process%2Cfunctionsv2&pivots=programming-language-csharp#binding-types) for a list of supported types.

---

::: zone-end

[!INCLUDE [functions-cosmosdb-connections](../../includes/functions-cosmosdb-connections.md)]

## Next steps

- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)

[version 4.x of the extension]: ./functions-bindings-cosmosdb-v2.md?tabs=extensionv4
