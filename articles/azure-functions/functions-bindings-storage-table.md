---
title: Azure Table storage bindings for Azure Functions
description: Understand how to use Azure Table storage bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 09/03/2018
ms.author: cshoe
---
# Azure Table storage bindings for Azure Functions

This article explains how to work with Azure Table storage bindings in Azure Functions. Azure Functions supports input and output bindings for Azure Table storage.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The Table storage bindings are provided in the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/v2.x/src/Microsoft.Azure.WebJobs.Storage/Table) GitHub repository.

[!INCLUDE [functions-package-auto](../../includes/functions-package-auto.md)]

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## Packages - Functions 2.x and higher

The Table storage bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/dev/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Input

Use the Azure Table storage input binding to read a table in an Azure Storage account.

# [C#](#tab/csharp)

### One entity

The following example shows a [C# function](functions-dotnet-class-library.md) that reads a single table row. 

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

### IQueryable

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

### CloudTable

`IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to use a `CloudTable` method parameter to read the table by using the Azure Storage SDK. Here's an example of a function that queries an Azure Functions log table:

```csharp
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
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

For more information about how to use CloudTable, see [Get started with Azure Table storage](../cosmos-db/table-storage-how-to-use-dotnet.md).

If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

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

The [configuration](#input---configuration) section explains these properties.

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

The [configuration](#input---configuration) section explains these properties.

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

For more information about how to use CloudTable, see [Get started with Azure Table storage](../cosmos-db/table-storage-how-to-use-dotnet.md).

If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).


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

The [configuration](#input---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.log('Person entity name: ' + context.bindings.personEntity.Name);
    context.done();
};
```

# [Python](#tab/python)

Single table row 

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

```python
import json

import azure.functions as func

def main(req: func.HttpRequest, messageJSON) -> func.HttpResponse:

    message = json.loads(messageJSON)
    return func.HttpResponse(f"Table row: {messageJSON}")
```

# [Java](#tab/java)

The following example shows an HTTP triggered function which returns the total count of the items in a specified partition in Table storage.

```java
@FunctionName("getallcount")
public int run(
   @HttpTrigger(name = "req",
                 methods = {HttpMethod.GET},
                 authLevel = AuthorizationLevel.ANONYMOUS) Object dummyShouldNotBeUsed,
   @TableInput(name = "items",
                tableName = "mytablename",  partitionKey = "myparkey",
                connection = "myconnvarname") MyItem[] items
) {
    return items.length;
}
```

---

## Input - attributes and annotations

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

  For a complete example, see Input - C# example.

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

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@TableInput` annotation on parameters whose value would come from Table storage.  This annotation can be used with native Java types, POJOs, or nullable values using `Optional<T>`.

---

## Input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Table` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** | n/a | Must be set to `in`. This property is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The name of the variable that represents the table or entity in function code. | 
|**tableName** | **TableName** | The name of the table.| 
|**partitionKey** | **PartitionKey** |Optional. The partition key of the table entity to read. See the [usage](#input---usage) section for guidance on how to use this property.| 
|**rowKey** |**RowKey** | Optional. The row key of the table entity to read. See the [usage](#input---usage) section for guidance on how to use this property.| 
|**take** |**Take** | Optional. The maximum number of entities to read in JavaScript. See the [usage](#input---usage) section for guidance on how to use this property.| 
|**filter** |**Filter** | Optional. An OData filter expression for table input in JavaScript. See the [usage](#input---usage) section for guidance on how to use this property.| 
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "MyStorage". If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Input - usage

# [C#](#tab/csharp)

* **Read one row in**

  Set `partitionKey` and `rowKey`. Access the table data by using a method parameter `T <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` is typically a type that implements `ITableEntity` or derives from `TableEntity`. The `filter` and `take` properties are not used in this scenario.

* **Read one or more rows**

  Access the table data by using a method parameter `IQueryable<T> <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` must be a type that implements `ITableEntity` or derives from `TableEntity`. You can use `IQueryable` methods to do any filtering required. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.  

  > [!NOTE]
  > `IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to [use a CloudTable paramName method parameter](https://stackoverflow.com/questions/48922485/binding-to-table-storage-in-v2-azure-functions-using-cloudtable) to read the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

# [C# Script](#tab/csharp-script)

* **Read one row in**

  Set `partitionKey` and `rowKey`. Access the table data by using a method parameter `T <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` is typically a type that implements `ITableEntity` or derives from `TableEntity`. The `filter` and `take` properties are not used in this scenario.

* **Read one or more rows**

  Access the table data by using a method parameter `IQueryable<T> <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` must be a type that implements `ITableEntity` or derives from `TableEntity`. You can use `IQueryable` methods to do any filtering required. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.  

  > [!NOTE]
  > `IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to [use a CloudTable paramName method parameter](https://stackoverflow.com/questions/48922485/binding-to-table-storage-in-v2-azure-functions-using-cloudtable) to read the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

# [JavaScript](#tab/javascript)

Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`. Access the input table entity (or entities) using `context.bindings.<BINDING_NAME>`. The deserialized objects have `RowKey` and `PartitionKey` properties.

# [Python](#tab/python)

Table data is passed to the function as a JSON string. De-serialize the message by calling `json.loads` as shown in the input [example](#input).

# [Java](#tab/java)

The [TableInput](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.annotation.tableinput) attribute gives you access to the table row that triggered the function.

---

## Output

Use an Azure Table storage output binding to write entities to a table in an Azure Storage account.

> [!NOTE]
> This output binding does not support updating existing entities. Use the `TableOperation.Replace` operation [from the Azure Storage SDK](../cosmos-db/tutorial-develop-table-dotnet.md#delete-an-entity) to update an existing entity.

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that uses an HTTP trigger to write a single table row. 

```csharp
public class TableStorage
{
    public class MyPoco
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string Text { get; set; }
    }

    [FunctionName("TableOutput")]
    [return: Table("MyTable")]
    public static MyPoco TableOutput([HttpTrigger] dynamic input, ILogger log)
    {
        log.LogInformation($"C# http trigger function processed: {input.Text}");
        return new MyPoco { PartitionKey = "Http", RowKey = Guid.NewGuid().ToString(), Text = input.Text };
    }
}
```

# [C# Script](#tab/csharp-script)

The following example shows a table output binding in a *function.json* file and [C# script](functions-reference-csharp.md) code that uses the binding. The function writes multiple table entities.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "name": "input",
      "type": "manualTrigger",
      "direction": "in"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnectionAppSetting",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The [configuration](#output---configuration) section explains these properties.

Here's the C# script code:

```csharp
public static void Run(string input, ICollector<Person> tableBinding, ILogger log)
{
    for (int i = 1; i < 10; i++)
        {
            log.LogInformation($"Adding Person entity {i}");
            tableBinding.Add(
                new Person() { 
                    PartitionKey = "Test", 
                    RowKey = i.ToString(), 
                    Name = "Name" + i.ToString() }
                );
        }

}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
}

```

# [JavaScript](#tab/javascript)

The following example shows a  table output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function writes multiple table entities.

Here's the *function.json* file:

```json
{
  "bindings": [
    {
      "name": "input",
      "type": "manualTrigger",
      "direction": "in"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnectionAppSetting",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The [configuration](#output---configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context) {

    context.bindings.tableBinding = [];

    for (var i = 1; i < 10; i++) {
        context.bindings.tableBinding.push({
            PartitionKey: "Test",
            RowKey: i.toString(),
            Name: "Name " + i
        });
    }
    
    context.done();
};
```

# [Python](#tab/python)

The following example demonstrates how to use the Table storage output binding. The `table` binding is configured in the *function.json* by assigning values to `name`, `tableName`, `partitionKey`, and `connection`:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "message",
      "type": "table",
      "tableName": "messages",
      "partitionKey": "message",
      "connection": "AzureWebJobsStorage",
      "direction": "out"
    },
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
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

The following function generates a unique UUI for the `rowKey` value and persists the message into Table storage.

```python
import logging
import uuid
import json

import azure.functions as func

def main(req: func.HttpRequest, message: func.Out[str]) -> func.HttpResponse:

    rowKey = str(uuid.uuid4())

    data = {
        "Name": "Output binding message",
        "PartitionKey": "message",
        "RowKey": rowKey
    }

    message.set(json.dumps(data))

    return func.HttpResponse(f"Message created with the rowKey: {rowKey}")
```

# [Java](#tab/java)

The following example shows a Java function that uses an HTTP trigger to write a single table row.

```java
public class Person {
    private String PartitionKey;
    private String RowKey;
    private String Name;

    public String getPartitionKey() {return this.PartitionKey;}
    public void setPartitionKey(String key) {this.PartitionKey = key; }
    public String getRowKey() {return this.RowKey;}
    public void setRowKey(String key) {this.RowKey = key; }
    public String getName() {return this.Name;}
    public void setName(String name) {this.Name = name; }
}
    public class AddPerson {

    @FunctionName("addPerson")
    public HttpResponseMessage get(
            @HttpTrigger(name = "postPerson", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION, route="persons/{partitionKey}/{rowKey}") HttpRequestMessage<Optional<Person>> request,
            @BindingName("partitionKey") String partitionKey,
            @BindingName("rowKey") String rowKey,
            @TableOutput(name="person", partitionKey="{partitionKey}", rowKey = "{rowKey}", tableName="%MyTableName%", connection="MyConnectionString") OutputBinding<Person> person,
            final ExecutionContext context) {

        Person outPerson = new Person();
        outPerson.setPartitionKey(partitionKey);
        outPerson.setRowKey(rowKey);
        outPerson.setName(request.getBody().get().getName());

        person.setValue(outPerson);

        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(outPerson)
                        .build();
    }
}
```

The following example shows a Java function that uses an HTTP trigger to write multiple table rows.

```java
public class Person {
    private String PartitionKey;
    private String RowKey;
    private String Name;

    public String getPartitionKey() {return this.PartitionKey;}
    public void setPartitionKey(String key) {this.PartitionKey = key; }
    public String getRowKey() {return this.RowKey;}
    public void setRowKey(String key) {this.RowKey = key; }
    public String getName() {return this.Name;}
    public void setName(String name) {this.Name = name; }
}

public class AddPersons {

    @FunctionName("addPersons")
    public HttpResponseMessage get(
            @HttpTrigger(name = "postPersons", methods = {HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION, route="persons/") HttpRequestMessage<Optional<Person[]>> request,
            @TableOutput(name="person", tableName="%MyTableName%", connection="MyConnectionString") OutputBinding<Person[]> persons,
            final ExecutionContext context) {

        persons.setValue(request.getBody().get());

        return request.createResponseBuilder(HttpStatus.OK)
                        .header("Content-Type", "application/json")
                        .body(request.getBody().get())
                        .build();
    }
}
```

---

## Output - attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [TableAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables/TableAttribute.cs).

The attribute's constructor takes the table name. The attribute can be used on an `out` parameter or on the return value of the function, as shown in the following example:

```csharp
[FunctionName("TableOutput")]
[return: Table("MyTable")]
public static MyPoco TableOutput(
    [HttpTrigger] dynamic input, 
    ILogger log)
{
    ...
}
```

You can set the `Connection` property to specify the storage account to use, as shown in the following example:

```csharp
[FunctionName("TableOutput")]
[return: Table("MyTable", Connection = "StorageConnectionAppSetting")]
public static MyPoco TableOutput(
    [HttpTrigger] dynamic input, 
    ILogger log)
{
    ...
}
```

For a complete example, see [Output - C# example](#output).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Input - attributes](#input---attributes-and-annotations).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [TableOutput](https://github.com/Azure/azure-functions-java-library/blob/master/src/main/java/com/microsoft/azure/functions/annotation/TableOutput.java/) annotation on parameters to write values into table storage.

See the [example for more detail](#output).

---

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Table` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**type** | n/a | Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** | n/a | Must be set to `out`. This property is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the table or entity. Set to `$return` to reference the function return value.| 
|**tableName** |**TableName** | The name of the table.| 
|**partitionKey** |**PartitionKey** | The partition key of the table entity to write. See the [usage section](#output---usage) for guidance on how to use this property.| 
|**rowKey** |**RowKey** | The row key of the table entity to write. See the [usage section](#output---usage) for guidance on how to use this property.| 
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "MyStorage". If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage

# [C#](#tab/csharp)

Access the output table entity by using a method parameter `ICollector<T> paramName` or `IAsyncCollector<T> paramName` where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`.

Alternatively you can use a `CloudTable` method parameter to write to the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

# [C# Script](#tab/csharp-script)

Access the output table entity by using a method parameter `ICollector<T> paramName` or `IAsyncCollector<T> paramName` where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`. The `paramName` value is specified in the `name` property of *function.json*.

Alternatively you can use a `CloudTable` method parameter to write to the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

# [JavaScript](#tab/javascript)

Access the output event by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

# [Python](#tab/python)

There are two options for outputting a Table storage row message from a function:

- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as a Table storage row.

- **Imperative**: Pass a value to the [set](https://docs.microsoft.com/python/api/azure-functions/azure.functions.out?view=azure-python#set-val--t-----none) method of the parameter declared as an [Out](https://docs.microsoft.com/python/api/azure-functions/azure.functions.out?view=azure-python) type. The value passed to `set` is persisted as an Event Hub message.

# [Java](#tab/java)

There are two options for outputting a Table storage row from a function by using the [TableStorageOutput](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.annotation.tableoutput?view=azure-java-stablet) annotation:

- **Return value**: By applying the annotation to the function itself, the return value of the function is persisted as a Table storage row.

- **Imperative**: To explicitly set the message value, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](https://docs.microsoft.com/java/api/com.microsoft.azure.functions.OutputBinding), where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`.

---

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Table | [Table Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/table-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue | [Troubleshooting](https://docs.microsoft.com/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
