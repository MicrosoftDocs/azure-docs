---
title: Azure Table storage input bindings for Azure Functions
description: Understand how to use Azure Table storage input bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 09/03/2018
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
---

# Azure Table storage input bindings for Azure Functions

Use the Azure Table storage input binding to read a table in an Azure Storage account.

## Example

# [C#](#tab/csharp)

### One entity

The following example shows a [C# function](functions-dotnet-class-library.md) that reads a single table row. For every message sent to the queue, the function will be triggered.

The row key value "{queueTrigger}" indicates that the row key comes from the queue message string.

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

### CloudTable

`CloudTable` is only supported in the [Functions v2 and and higher runtimes](functions-versions.md).

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

### IQueryable

`IQueryable` is only supported in the [Functions v1 runtime](functions-versions.md).

The following example shows a [C# function](functions-dotnet-class-library.md) that reads multiple table rows where the `MyPoco` class derives from `TableEntity`.

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

# [C# Script](#tab/csharp-script)

### One entity

The following example shows a table input binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function uses a queue trigger to read a single table row. 

The *function.json* file specifies a `partitionKey` and a `rowKey`. The `rowKey` value "{queueTrigger}" indicates that the row key comes from the queue message string.

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

Here's the C# script code:

```csharp
public static void Run(string myQueueItem, Person personEntity, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    log.LogInformation($"Name in Person entity: {personEntity.Name}");
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
}
```

### CloudTable

`IQueryable` isn't supported in the Functions runtime for [versions 2.x and higher)](functions-versions.md). An alternative is to use a `CloudTable` method parameter to read the table by using the Azure Storage SDK. Here's an example of a function that queries an Azure Functions log table:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */1 * * * *"
    },
    {
      "name": "cloudTable",
      "type": "table",
      "connection": "AzureWebJobsStorage",
      "tableName": "AzureWebJobsHostLogscommon",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

```csharp
#r "Microsoft.WindowsAzure.Storage"
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

public static async Task Run(TimerInfo myTimer, CloudTable cloudTable, ILogger log)
{
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

    TableQuery<LogEntity> rangeQuery = new TableQuery<LogEntity>().Where(
    TableQuery.CombineFilters(
        TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, 
            "FD2"),
        TableOperators.And,
        TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.GreaterThan, 
            "a")));

    // Execute the query and loop through the results
    foreach (LogEntity entity in 
    await cloudTable.ExecuteQuerySegmentedAsync(rangeQuery, null))
    {
        log.LogInformation(
            $"{entity.PartitionKey}\t{entity.RowKey}\t{entity.Timestamp}\t{entity.OriginalName}");
    }
}

public class LogEntity : TableEntity
{
    public string OriginalName { get; set; }
}
```

For more information about how to use CloudTable, see [Get started with Azure Table storage](../cosmos-db/tutorial-develop-table-dotnet.md).

If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

### IQueryable

The following example shows a table input binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function reads entities for a partition key that is specified in a queue message.

Here's the *function.json* file:

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
      "name": "tableBinding",
      "type": "table",
      "connection": "MyStorageConnectionAppSetting",
      "tableName": "Person",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The [configuration](#configuration) section explains these properties.

The C# script code adds a reference to the Azure Storage SDK so that the entity type can derive from `TableEntity`:

```csharp
#r "Microsoft.WindowsAzure.Storage"
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.Extensions.Logging;

public static void Run(string myQueueItem, IQueryable<Person> tableBinding, ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    foreach (Person person in tableBinding.Where(p => p.PartitionKey == myQueueItem).ToList())
    {
        log.LogInformation($"Name: {person.Name}");
    }
}

public class Person : TableEntity
{
    public string Name { get; set; }
}
```

# [Java](#tab/java)

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

The following example uses the Filter to query for persons with a specific name in an Azure Table, and limits the number of possible matches to 10 results.

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

# [JavaScript](#tab/javascript)

The following example shows a  table input binding in a *function.json* file and [JavaScript code](functions-reference-node.md) that uses the binding. The function uses a queue trigger to read a single table row. 

The *function.json* file specifies a `partitionKey` and a `rowKey`. The `rowKey` value "{queueTrigger}" indicates that the row key comes from the queue message string.

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
module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.log('Person entity name: ' + context.bindings.personEntity.Name);
    context.done();
};
```

# [PowerShell](#tab/powershell)

The following function uses a queue trigger to read a single table row as input to a function.

In this example, the binding configuration specifies an explicit value for the table's `partitionKey` and uses an expression to pass to the `rowKey`. The `rowKey` expression, `{queueTrigger}`, indicates that the row key comes from the queue message string.

Binding configuration in _function.json_:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnectionAppSetting",
      "name": "MyQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "PersonEntity",
      "type": "table",
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnectionAppSetting",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

PowerShell code in _run.ps1_:

```powershell
param($MyQueueItem, $PersonEntity, $TriggerMetadata)
Write-Host "PowerShell queue trigger function processed work item: $MyQueueItem"
Write-Host "Person entity name: $($PersonEntity.Name)"
```

# [Python](#tab/python)

The following function uses a queue trigger to read a single table row as input to a function.

In this example, binding configuration specifies an explicit value for the table's `partitionKey` and uses an expression to pass to the `rowKey`. The `rowKey` expression, `{id}` indicates that the row key comes from the queue message string.

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

---

## Attributes and annotations

# [C#](#tab/csharp)

 In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a table input binding:

* [TableAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables/TableAttribute.cs)

  The attribute's constructor takes the table name, partition key, and row key. The attribute can be used on an `out` parameter or on the return value of the function, as shown in the following example:

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

  You can set the `Connection` property to specify the storage account to use, as shown in the following example:

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

  For a complete example, see the C# example.

* [StorageAccountAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/StorageAccountAttribute.cs)

  Provides another way to specify the storage account to use. The constructor takes the name of an app setting that contains a storage connection string. The attribute can be applied at the parameter, method, or class level. The following example shows class level and method level:

  ```csharp
  [StorageAccount("ClassLevelStorageAppSetting")]
  public static class AzureFunctions
  {
      [FunctionName("TableInput")]
      [StorageAccount("FunctionLevelStorageAppSetting")]
      public static void Run( //...
  {
      ...
  }
  ```

The storage account to use is determined in the following order:

* The `Table` attribute's `Connection` property.
* The `StorageAccount` attribute applied to the same parameter as the `Table` attribute.
* The `StorageAccount` attribute applied to the function.
* The `StorageAccount` attribute applied to the class.
* The default storage account for the function app ("AzureWebJobsStorage" app setting).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [Java](#tab/java)

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@TableInput` annotation on parameters whose value would come from Table storage.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [PowerShell](#tab/powershell)

Attributes are not supported by PowerShell.

# [Python](#tab/python)

Attributes are not supported by Python.

---

## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Table` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The name of the variable that represents the table or entity in function code. | 
|**tableName** | **TableName** | The name of the table.| 
|**partitionKey** | **PartitionKey** |Optional. The partition key of the table entity to read. See the [usage](#usage) section for guidance on how to use this property.| 
|**rowKey** |**RowKey** | Optional. The row key of the table entity to read. See the [usage](#usage) section for guidance on how to use this property.| 
|**take** |**Take** | Optional. The maximum number of entities to read in JavaScript. See the [usage](#usage) section for guidance on how to use this property.| 
|**filter** |**Filter** | Optional. An OData filter expression for table input in JavaScript. See the [usage](#usage) section for guidance on how to use this property.| 
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. The setting can be the name of an "AzureWebJobs" prefixed app setting or connection string name. For example, if your setting name is "AzureWebJobsMyStorage", you can specify "MyStorage" here. The Functions runtime will automatically look for an app setting that named "AzureWebJobsMyStorage". If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

* **Read one row in**

  Set `partitionKey` and `rowKey`. Access the table data by using a method parameter `T <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` is typically a type that implements `ITableEntity` or derives from `TableEntity`. The `filter` and `take` properties are not used in this scenario.

* **Read one or more rows**

  Access the table data by using a method parameter `IQueryable<T> <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` must be a type that implements `ITableEntity` or derives from `TableEntity`. You can use `IQueryable` methods to do any filtering required. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.  

  > [!NOTE]
  > `IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to [use a CloudTable paramName method parameter](https://stackoverflow.com/questions/48922485/binding-to-table-storage-in-v2-azure-functions-using-cloudtable) to read the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

# [C# Script](#tab/csharp-script)

* **Read one row in**

  Set `partitionKey` and `rowKey`. Access the table data by using a method parameter `T <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` is typically a type that implements `ITableEntity` or derives from `TableEntity`. The `filter` and `take` properties are not used in this scenario.

* **Read one or more rows**

  Access the table data by using a method parameter `IQueryable<T> <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` must be a type that implements `ITableEntity` or derives from `TableEntity`. You can use `IQueryable` methods to do any filtering required. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.  

  > [!NOTE]
  > `IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to [use a CloudTable paramName method parameter](https://stackoverflow.com/questions/48922485/binding-to-table-storage-in-v2-azure-functions-using-cloudtable) to read the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

# [Java](#tab/java)

The [TableInput](/java/api/com.microsoft.azure.functions.annotation.tableinput) attribute gives you access to the table row that triggered the function.

# [JavaScript](#tab/javascript)

Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`. Access the input table entity (or entities) using `context.bindings.<BINDING_NAME>`. The deserialized objects have `RowKey` and `PartitionKey` properties.

# [PowerShell](#tab/powershell)

Data is passed to the input parameter as specified by the `name` key in the *function.json* file. Specifying The `partitionKey` and `rowKey` allows you to filter to specific records. See the [PowerShell example](#example) for more detail.

# [Python](#tab/python)

Table data is passed to the function as a JSON string. De-serialize the message by calling `json.loads` as shown in the input [example](#example).

---

## Next steps

* [Write table storage data from a function](./functions-bindings-storage-table-output.md)
