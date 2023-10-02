---
title: Azure Tables input bindings for Azure Functions
description: Understand how to use Azure Tables input bindings in Azure Functions.
ms.topic: reference
ms.date: 11/11/2022
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, ignite-2022, devx-track-extended-java, devx-track-js
zone_pivot_groups: programming-languages-set-functions
---

# Azure Tables input bindings for Azure Functions

Use the Azure Tables input binding to read a table in [Azure Cosmos DB for Table](../cosmos-db/table/introduction.md) or [Azure Table Storage](../storage/tables/table-storage-overview.md).

For information on setup and configuration details, see the [overview](./functions-bindings-storage-table.md).

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Example

::: zone pivot="programming-language-csharp"

The usage of the binding depends on the extension package version and the C# modality used in your function app, which can be one of the following:

# [Isolated worker model](#tab/isolated-process)

An [isolated worker process class library](dotnet-isolated-process-guide.md) compiled C# function runs in a process isolated from the runtime.  
   
# [In-process model](#tab/in-process)

An [in-process class library](functions-dotnet-class-library.md) is a compiled C# function runs in the same process as the Functions runtime.
 
---

Choose a version to see examples for the mode and version. 

# [Azure Tables extension](#tab/table-api/in-process)

The following example shows a [C# function](./functions-dotnet-class-library.md) that reads a single table row. For every message sent to the queue, the function will be triggered.

The row key value `{queueTrigger}` binds the row key to the message metadata, which is the message string.

```csharp
public class TableStorage
{
    public class MyPoco : Azure.Data.Tables.ITableEntity
    {
        public string Text { get; set; }

        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }
    }


    [FunctionName("TableInput")]
    public static void TableInput(
        [QueueTrigger("table-items")] string input, 
        [Table("MyTable", "MyPartition", "{queueTrigger}")] MyPoco poco, 
        ILogger log)
    {
        log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
    }
}
```

Use a `TableClient` method parameter to read the table by using the Azure SDK. Here's an example of a function that queries an Azure Functions log table:

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;
using Azure;
namespace FunctionAppCloudTable2
{
    public class LogEntity : ITableEntity
    {
        public string OriginalName { get; set; }

        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }
    }
    public static class CloudTableDemo
    {
        [FunctionName("CloudTableDemo")]
        public static async Task Run(
            [TimerTrigger("0 */1 * * * *")] TimerInfo myTimer,
            [Table("AzureWebJobsHostLogscommon")] TableClient tableClient,
            ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            AsyncPageable<LogEntity> queryResults = tableClient.QueryAsync<LogEntity>(filter: $"PartitionKey eq 'FD2' and RowKey gt 't'");
            await foreach (LogEntity entity in queryResults)
            {
                log.LogInformation($"{entity.PartitionKey}\t{entity.RowKey}\t{entity.Timestamp}\t{entity.OriginalName}");
            }
        }
    }
}
```
For more information about how to use `TableClient`, see the [Azure.Data.Tables API Reference](/dotnet/api/azure.data.tables.tableclient).

# [Combined Azure Storage extension](#tab/storage-extension/in-process)

The following example shows a [C# function](./functions-dotnet-class-library.md) that reads a single table row. For every message sent to the queue, the function will be triggered.

The row key value `{queueTrigger}` binds the row key to the message metadata, which is the message string.

```csharp
public class TableStorage
{
    public class MyPoco
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string Text { get; set; }
    }

    [FunctionName("TableInput")]
    public static void TableInput(
        [QueueTrigger("table-items")] string input, 
        [Table("MyTable", "MyPartition", "{queueTrigger}")] MyPoco poco, 
        ILogger log)
    {
        log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
    }
}
```

Use a `CloudTable` method parameter to read the table by using the Azure Storage SDK. Here's an example of a function that queries an Azure Functions log table:

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Cosmos.Table;
using System;
using System.Threading.Tasks;

namespace FunctionAppCloudTable2
{
    public class LogEntity : TableEntity
    {
        public string OriginalName { get; set; }
    }
    public static class CloudTableDemo
    {
        [FunctionName("CloudTableDemo")]
        public static async Task Run(
            [TimerTrigger("0 */1 * * * *")] TimerInfo myTimer, 
            [Table("AzureWebJobsHostLogscommon")] CloudTable cloudTable,
            ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            TableQuery<LogEntity> rangeQuery = new TableQuery<LogEntity>().Where(
                TableQuery.CombineFilters(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, 
                        "FD2"),
                    TableOperators.And,
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.GreaterThan, 
                        "t")));

            // Execute the query and loop through the results
            foreach (LogEntity entity in 
                await cloudTable.ExecuteQuerySegmentedAsync(rangeQuery, null))
            {
                log.LogInformation(
                    $"{entity.PartitionKey}\t{entity.RowKey}\t{entity.Timestamp}\t{entity.OriginalName}");
            }
        }
    }
}
```

For more information about how to use CloudTable, see [Get started with Azure Table storage](../cosmos-db/tutorial-develop-table-dotnet.md).

If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

# [Functions 1.x](#tab/functionsv1/in-process)

The following example shows a [C# function](./functions-dotnet-class-library.md) that reads a single table row. For every message sent to the queue, the function will be triggered.

The row key value `{queueTrigger}` binds the row key to the message metadata, which is the message string.

```csharp
public class TableStorage
{
    public class MyPoco
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string Text { get; set; }
    }

    [FunctionName("TableInput")]
    public static void TableInput(
        [QueueTrigger("table-items")] string input, 
        [Table("MyTable", "MyPartition", "{queueTrigger}")] MyPoco poco, 
        ILogger log)
    {
        log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
    }
}
```

The following example shows a [C# function](./functions-dotnet-class-library.md) that reads multiple table rows where the `MyPoco` class derives from `TableEntity`.

```csharp
public class TableStorage
{
    public class MyPoco : TableEntity
    {
        public string Text { get; set; }
    }

    [FunctionName("TableInput")]
    public static void TableInput(
        [QueueTrigger("table-items")] string input, 
        [Table("MyTable", "MyPartition")] IQueryable<MyPoco> pocos, 
        ILogger log)
    {
        foreach (MyPoco poco in pocos)
        {
            log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
        }
    }
}
```

# [Azure Tables extension](#tab/table-api/isolated-process)

The following `MyTableData` class represents a row of data in the table: 

```csharp
public class MyTableData : Azure.Data.Tables.ITableEntity
{
    public string Text { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
```

The following function, which is started by a Queue Storage trigger, reads a row key from the queue, which is used to get the row from the input table. The expression `{queueTrigger}` binds the row key to the message metadata, which is the message string.

```csharp
[Function("TableFunction")]
[TableOutput("OutputTable", Connection = "AzureWebJobsStorage")]
public static MyTableData Run(
    [QueueTrigger("table-items")] string input,
    [TableInput("MyTable", "<PartitionKey>", "{queueTrigger}")] MyTableData tableInput,
    FunctionContext context)
{
    var logger = context.GetLogger("TableFunction");

    logger.LogInformation($"PK={tableInput.PartitionKey}, RK={tableInput.RowKey}, Text={tableInput.Text}");

    return new MyTableData()
    {
        PartitionKey = "queue",
        RowKey = Guid.NewGuid().ToString(),
        Text = $"Output record with rowkey {input} created at {DateTime.Now}"
    };
}
```

The following Queue-triggered function returns the first 5 entities as an `IEnumerable<T>`, with the partition key value set as the queue message.  

```csharp
[Function("TestFunction")]
public static void Run([QueueTrigger("myqueue", Connection = "AzureWebJobsStorage")] string partition,
    [TableInput("inTable", "{queueTrigger}", Take = 5, Filter = "Text eq 'test'", 
    Connection = "AzureWebJobsStorage")] IEnumerable<MyTableData> tableInputs,
    FunctionContext context)
{
    var logger = context.GetLogger("TestFunction");
    logger.LogInformation(partition);
    foreach (MyTableData tableInput in tableInputs)
    {
        logger.LogInformation($"PK={tableInput.PartitionKey}, RK={tableInput.RowKey}, Text={tableInput.Text}");
    }
}
```
The `Filter` and `Take` properties are used to limit the number of entities returned.

# [Combined Azure Storage extension](#tab/storage-extension/isolated-process)

The following `MyTableData` class represents a row of data in the table: 

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Table/TableFunction.cs" range="31-38" :::

The following function, which is started by a Queue Storage trigger, reads a row key from the queue, which is used to get the row from the input table. The expression `{queueTrigger}` binds the row key to the message metadata, which is the message string.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/Table/TableFunction.cs" range="12-29" ::: 

The following Queue-triggered function returns the first 5 entities as an `IEnumerable<T>`, with the partition key value set as the queue message.  

```csharp
[Function("TestFunction")]
public static void Run([QueueTrigger("myqueue", Connection = "AzureWebJobsStorage")] string partition,
    [TableInput("inTable", "{queueTrigger}", Take = 5, Filter = "Text eq 'test'", 
    Connection = "AzureWebJobsStorage")] IEnumerable<MyTableData> tableInputs,
    FunctionContext context)
{
    var logger = context.GetLogger("TestFunction");
    logger.LogInformation(partition);
    foreach (MyTableData tableInput in tableInputs)
    {
        logger.LogInformation($"PK={tableInput.PartitionKey}, RK={tableInput.RowKey}, Text={tableInput.Text}");
    }
}
```

The `Filter` and `Take` properties are used to limit the number of entities returned.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

---

::: zone-end
::: zone pivot="programming-language-java"

The following example shows an HTTP triggered function which returns a list of person objects who are in a specified partition in Table storage. In the example, the partition key is extracted from the http route, and the tableName and connection are from the function settings. 

```java
public class Person {
    private String PartitionKey;
    private String RowKey;
    private String Name;

    public String getPartitionKey() { return this.PartitionKey; }
    public void setPartitionKey(String key) { this.PartitionKey = key; }
    public String getRowKey() { return this.RowKey; }
    public void setRowKey(String key) { this.RowKey = key; }
    public String getName() { return this.Name; }
    public void setName(String name) { this.Name = name; }
}

@FunctionName("getPersonsByPartitionKey")
public Person[] get(
        @HttpTrigger(name = "getPersons", methods = {HttpMethod.GET}, authLevel = AuthorizationLevel.FUNCTION, route="persons/{partitionKey}") HttpRequestMessage<Optional<String>> request,
        @BindingName("partitionKey") String partitionKey,
        @TableInput(name="persons", partitionKey="{partitionKey}", tableName="%MyTableName%", connection="MyConnectionString") Person[] persons,
        final ExecutionContext context) {

    context.getLogger().info("Got query for person related to persons with partition key: " + partitionKey);

    return persons;
}
```

The TableInput annotation can also extract the bindings from the json body of the request, like the following example shows.

```java
@FunctionName("GetPersonsByKeysFromRequest")
public HttpResponseMessage get(
        @HttpTrigger(name = "getPerson", methods = {HttpMethod.GET}, authLevel = AuthorizationLevel.FUNCTION, route="query") HttpRequestMessage<Optional<String>> request,
        @TableInput(name="persons", partitionKey="{partitionKey}", rowKey = "{rowKey}", tableName="%MyTableName%", connection="MyConnectionString") Person person,
        final ExecutionContext context) {

    if (person == null) {
        return request.createResponseBuilder(HttpStatus.NOT_FOUND)
                    .body("Person not found.")
                    .build();
    }

    return request.createResponseBuilder(HttpStatus.OK)
                    .header("Content-Type", "application/json")
                    .body(person)
                    .build();
}
```

The following example uses a filter to query for persons with a specific name in an Azure Table, and limits the number of possible matches to 10 results.

```java
@FunctionName("getPersonsByName")
public Person[] get(
        @HttpTrigger(name = "getPersons", methods = {HttpMethod.GET}, authLevel = AuthorizationLevel.FUNCTION, route="filter/{name}") HttpRequestMessage<Optional<String>> request,
        @BindingName("name") String name,
        @TableInput(name="persons", filter="Name eq '{name}'", take = "10", tableName="%MyTableName%", connection="MyConnectionString") Person[] persons,
        final ExecutionContext context) {

    context.getLogger().info("Got query for person related to persons with name: " + name);

    return persons;
}
```

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"

The following example shows a table input binding that uses a queue trigger to read a single table row. The binding specifies a `partitionKey` and a `rowKey`. The `rowKey` value "{queueTrigger}" indicates that the row key comes from the queue message string.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/tableInput1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/tableInput1.js" :::

# [Model v3](#tab/nodejs-v3)

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "personEntity",
      "type": "table",
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.log('Person entity name: ' + context.bindings.personEntity.Name);
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following function uses a queue trigger to read a single table row as input to a function.

In this example, the binding configuration specifies an explicit value for the table's `partitionKey` and uses an expression to pass to the `rowKey`. The `rowKey` expression, `{queueTrigger}`, indicates that the row key comes from the queue message string.

Binding configuration in _function.json_:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "MyQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "PersonEntity",
      "type": "table",
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

PowerShell code in _run.ps1_:

```powershell
param($MyQueueItem, $PersonEntity, $TriggerMetadata)
Write-Host "PowerShell queue trigger function processed work item: $MyQueueItem"
Write-Host "Person entity name: $($PersonEntity.Name)"
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following function uses an HTTP trigger to read a single table row as input to a function.

In this example, binding configuration specifies an explicit value for the table's `partitionKey` and uses an expression to pass to the `rowKey`. The `rowKey` expression, `{id}` indicates that the row key comes from the `{id}` part of the route in the request.

Binding configuration in the _function.json_ file:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "messageJSON",
      "type": "table",
      "tableName": "messages",
      "partitionKey": "message",
      "rowKey": "{id}",
      "connection": "AzureWebJobsStorage",
      "direction": "in"
    },
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ],
      "route": "messages/{id}"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ],
  "disabled": false
}
```

Python code in the *\_\_init\_\_.py* file:

```python
import json

import azure.functions as func

def main(req: func.HttpRequest, messageJSON) -> func.HttpResponse:

    message = json.loads(messageJSON)
    return func.HttpResponse(f"Table row: {messageJSON}")
```

With this simple binding, you can't programmatically handle a case in which no row that has a row key ID is found. For more fine-grained data selection, use the [storage SDK](/azure/developer/python/sdk/examples/azure-sdk-example-storage-use?tabs=cmd).

---

::: zone-end  
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#table-input).

# [Isolated worker model](#tab/isolated-process)

In [C# class libraries](dotnet-isolated-process-guide.md), the `TableInputAttribute` supports the following properties:

| Attribute property |Description|
|---------|---------|
| **TableName** | The name of the table.| 
| **PartitionKey** |Optional. The partition key of the table entity to read. | 
|**RowKey** | Optional. The row key of the table entity to read. | 
| **Take** | Optional. The maximum number of entities to read into an [`IEnumerable<T>`]. Can't be used with `RowKey`.| 
|**Filter** | Optional. An OData filter expression for entities to read into an [`IEnumerable<T>`]. Can't be used with `RowKey`. | 
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

# [In-process model](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), the `TableAttribute` supports the following properties:

| Attribute property |Description|
|---------|---------|
| **TableName** | The name of the table.| 
| **PartitionKey** |Optional. The partition key of the table entity to read. See the [usage](#usage) section for guidance on how to use this property.| 
|**RowKey** | Optional. The row key of a single table entity to read. Can't be used with `Take` or `Filter`. | 
|**Take** | Optional. The maximum number of entities to return. Can't be used with `RowKey`. | 
|**Filter** | Optional. An OData filter expression for the entities to return from the table. Can't be used with `RowKey`.| 
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

The attribute's constructor takes the table name, partition key, and row key, as shown in the following example:

```csharp
[FunctionName("TableInput")]
public static void Run(
    [QueueTrigger("table-items")] string input, 
    [Table("MyTable", "Http", "{queueTrigger}")] MyPoco poco, 
    ILogger log)
{
    ...
}
```

You can set the `Connection` property to specify the connection to the table service, as shown in the following example:

```csharp
[FunctionName("TableInput")]
public static void Run(
    [QueueTrigger("table-items")] string input, 
    [Table("MyTable", "Http", "{queueTrigger}", Connection = "StorageConnectionAppSetting")] MyPoco poco, 
    ILogger log)
{
    ...
}
```

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@TableInput` annotation on parameters whose value would come from Table storage.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`. This annotation supports the following elements:

| Element |Description|
|---------|---------|
|**[name](/java/api/com.microsoft.azure.functions.annotation.tableinput.name)** |  The name of the variable that represents the table or entity in function code.| 
|**[tableName](/java/api/com.microsoft.azure.functions.annotation.tableinput.tableName)** |  The name of the table.|
|**[partitionKey](/java/api/com.microsoft.azure.functions.annotation.tableinput.partitionkey)** |Optional. The partition key of the table entity to read. | 
|**[rowKey](/java/api/com.microsoft.azure.functions.annotation.tableinput.rowkey)** |Optional. The row key of the table entity to read.| 
|**[take](/java/api/com.microsoft.azure.functions.annotation.tableinput.take)** | Optional. The maximum number of entities to read.| 
|**[filter](/java/api/com.microsoft.azure.functions.annotation.tableinput.filter)** | Optional. An OData filter expression for table input.| 
|**[connection](/java/api/com.microsoft.azure.functions.annotation.tableinput.connection)** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `input.table()` method.

| Property | Description |
|---------|----------------------|
|**tableName** | The name of the table.| 
|**partitionKey** | Optional. The partition key of the table entity to read. | 
|**rowKey** |Optional. The row key of the table entity to read. Can't be used with `take` or `filter`.| 
|**take** | Optional. The maximum number of entities to return. Can't be used with `rowKey`. |
|**filter** | Optional. An OData filter expression for the entities to return from the table. Can't be used with `rowKey`.| 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** |  Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The name of the variable that represents the table or entity in function code. | 
|**tableName** |  The name of the table.| 
|**partitionKey** | Optional. The partition key of the table entity to read. | 
|**rowKey** |Optional. The row key of the table entity to read. Can't be used with `take` or `filter`.| 
|**take** | Optional. The maximum number of entities to return. Can't be used with `rowKey`. |
|**filter** | Optional. An OData filter expression for the entities to return from the table. Can't be used with `rowKey`.| 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type** |  Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The name of the variable that represents the table or entity in function code. | 
|**tableName** |  The name of the table.| 
|**partitionKey** | Optional. The partition key of the table entity to read. | 
|**rowKey** |Optional. The row key of the table entity to read. Can't be used with `take` or `filter`.| 
|**take** | Optional. The maximum number of entities to return. Can't be used with `rowKey`. |
|**filter** | Optional. An OData filter expression for the entities to return from the table. Can't be used with `rowKey`.| 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

::: zone-end  
[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

[!INCLUDE [functions-table-connections](../../includes/functions-table-connections.md)]

## Usage

::: zone pivot="programming-language-csharp"  

The usage of the binding depends on the extension package version, and the C# modality used in your function app, which can be one of the following:

# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.

# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function that runs in the same process as the Functions runtime.
 
---

Choose a version to see usage details for the mode and version. 

# [Azure Tables extension](#tab/table-api/in-process)

To return a specific entity by key, use a binding parameter that derives from [TableEntity](/dotnet/api/azure.data.tables.tableentity).  

To execute queries that return multiple entities, bind to a [TableClient] object. You can then use this object to create and execute queries against the bound table. Note that [TableClient] and related APIs belong to the [Azure.Data.Tables](/dotnet/api/azure.data.tables) namespace.

# [Combined Azure Storage extension](#tab/storage-extension/in-process)

To return a specific entity by key, use a binding parameter that derives from [TableEntity](/dotnet/api/azure.data.tables.tableentity).  

To execute queries that return multiple entities, bind to a [CloudTable] object. You can then use this object to create and execute queries against the bound table. Note that [CloudTable] and related APIs belong to the [Microsoft.Azure.Cosmos.Table](/dotnet/api/microsoft.azure.cosmos.table) namespace.  

# [Functions 1.x](#tab/functionsv1/in-process)

To return a specific entity by key, use a binding parameter that derives from [TableEntity]. The specific `TableName`, `PartitionKey`, and `RowKey` are used to try and get a specific entity from the table. 

To execute queries that return multiple entities, bind to an [`IQueryable<T>`] of a type that inherits from [TableEntity]. 

# [Azure Tables extension](#tab/table-api/isolated-process)

[!INCLUDE [functions-bindings-table-input-dotnet-isolated-types](../../includes/functions-bindings-table-input-dotnet-isolated-types.md)]

# [Combined Azure Storage extension](#tab/storage-extension/isolated-process)

To return a specific entity by key, use a plain-old CLR object (POCO). The specific `TableName`, `PartitionKey`, and `RowKey` are used to try and get a specific entity from the table.

 When returning multiple entities as an [`IEnumerable<T>`], you can instead use `Take` and `Filter` properties to restrict the result set.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

---

::: zone-end  
::: zone pivot="programming-language-java"
The [TableInput](/java/api/com.microsoft.azure.functions.annotation.tableinput) attribute gives you access to the table row that triggered the function.
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
# [Model v4](#tab/nodejs-v4)

Get the input row data by using `context.extraInputs.get()`.

# [Model v3](#tab/nodejs-v3)

Get the input row data by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

---
::: zone-end
::: zone pivot="programming-language-powershell"  
Data is passed to the input parameter as specified by the `name` key in the *function.json* file. Specifying The `partitionKey` and `rowKey` allows you to filter to specific records. 
::: zone-end  
::: zone pivot="programming-language-python"  
Table data is passed to the function as a JSON string. De-serialize the message by calling `json.loads` as shown in the input [example](#example).
::: zone-end  

For specific usage details, see [Example](#example). 

## Next steps

* [Write table data from a function](./functions-bindings-storage-table-output.md)

[TableInputAttribute]: /dotnet/api/microsoft.azure.webjobs.tableinputattribute
[CloudTable]: /dotnet/api/microsoft.azure.cosmos.table.cloudtable
[TableEntity]: /dotnet/api/azure.data.tables.tableentity
[`IQueryable<T>`]: /dotnet/api/system.linq.iqueryable-1
[`IEnumerable<T>`]: /dotnet/api/system.collections.generic.ienumerable-1
