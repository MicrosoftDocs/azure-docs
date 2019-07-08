---
title: Azure Table storage bindings for Azure Functions
description: Understand how to use Azure Table storage bindings in Azure Functions.
services: functions
documentationcenter: na
author: craigshoemaker
manager: gwallace
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture

ms.service: azure-functions
ms.devlang: multiple
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

## Packages - Functions 2.x

The Table storage bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk](https://github.com/Azure/azure-webjobs-sdk/tree/dev/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Input

Use the Azure Table storage input binding to read a table in an Azure Storage account.

## Input - example

See the language-specific example:

* [C# read one entity](#input---c-example---one-entity)
* [C# bind to IQueryable](#input---c-example---iqueryable)
* [C# bind to CloudTable](#input---c-example---cloudtable)
* [C# script read one entity](#input---c-script-example---one-entity)
* [C# script bind to IQueryable](#input---c-script-example---iqueryable)
* [C# script bind to CloudTable](#input---c-script-example---cloudtable)
* [F#](#input---f-example)
* [JavaScript](#input---javascript-example)
* [Java](#input---java-example)

### Input - C# example - one entity

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

### Input - C# example - IQueryable

The following example shows a [C# function](functions-dotnet-class-library.md) that reads multiple table rows. Note that the `MyPoco` class derives from `TableEntity`.

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

### Input - C# example - CloudTable

`IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to use a `CloudTable` method parameter to read the table by using the Azure Storage SDK. Here's an example of a 2.x function that queries an Azure Functions log table:

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

### Input - C# script example - one entity

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

### Input - C# script example - IQueryable

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

### Input - C# script example - CloudTable

`IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to use a `CloudTable` method parameter to read the table by using the Azure Storage SDK. Here's an example of a 2.x function that queries an Azure Functions log table:

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

### Input - F# example

The following example shows a table input binding in a *function.json* file and [F# script](functions-reference-fsharp.md) code that uses the binding. The function uses a queue trigger to read a single table row. 

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

Here's the F# code:

```fsharp
[<CLIMutable>]
type Person = {
  PartitionKey: string
  RowKey: string
  Name: string
}

let Run(myQueueItem: string, personEntity: Person) =
    log.LogInformation(sprintf "F# Queue trigger function processed: %s" myQueueItem)
    log.LogInformation(sprintf "Name in Person entity: %s" personEntity.Name)
```

### Input - JavaScript example

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

### Input - Java example

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


## Input - attributes
 
In [C# class libraries](functions-dotnet-class-library.md), use the following attributes to configure a table input binding:

* [TableAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables/TableAttribute.cs)

  The attribute's constructor takes the table name, partition key, and row key. It can be used on an out parameter or on the return value of the function, as shown in the following example:

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

## Input - Java annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the `@TableInput` annotation on parameters whose value would come from Table storage.  This annotation can be used with native Java types, POJOs, or nullable values using Optional<T>. 

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
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Input - usage

The Table storage input binding supports the following scenarios:

* **Read one row in C# or C# script**

  Set `partitionKey` and `rowKey`. Access the table data by using a method parameter `T <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` is typically a type that implements `ITableEntity` or derives from `TableEntity`. The `filter` and `take` properties are not used in this scenario. 

* **Read one or more rows in C# or C# script**

  Access the table data by using a method parameter `IQueryable<T> <paramName>`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` must be a type that implements `ITableEntity` or derives from `TableEntity`. You can use `IQueryable` methods to do any filtering required. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.  

  > [!NOTE]
  > `IQueryable` isn't supported in the [Functions v2 runtime](functions-versions.md). An alternative is to [use a CloudTable paramName method parameter](https://stackoverflow.com/questions/48922485/binding-to-table-storage-in-v2-azure-functions-using-cloudtable) to read the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x).

* **Read one or more rows in JavaScript**

  Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`. Access the input table entity (or entities) using `context.bindings.<name>`. The deserialized objects have `RowKey` and `PartitionKey` properties.

## Output

Use an Azure Table storage output binding to write entities to a table in an Azure Storage account.

> [!NOTE]
> This output binding does not support updating existing entities. Use the `TableOperation.Replace` operation [from the Azure Storage SDK](https://docs.microsoft.com/azure/cosmos-db/tutorial-develop-table-dotnet#delete-an-entity) to update an existing entity.   

## Output - example

See the language-specific example:

* [C#](#output---c-example)
* [C# script (.csx)](#output---c-script-example)
* [F#](#output---f-example)
* [JavaScript](#output---javascript-example)

### Output - C# example

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

### Output - C# script example

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

### Output - F# example

The following example shows a table output binding in a *function.json* file and [F# script](functions-reference-fsharp.md) code that uses the binding. The function writes multiple table entities.

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

Here's the F# code:

```fsharp
[<CLIMutable>]
type Person = {
  PartitionKey: string
  RowKey: string
  Name: string
}

let Run(input: string, tableBinding: ICollector<Person>, log: ILogger) =
    for i = 1 to 10 do
        log.LogInformation(sprintf "Adding Person entity %d" i)
        tableBinding.Add(
            { PartitionKey = "Test"
              RowKey = i.ToString()
              Name = "Name" + i.ToString() })
```

### Output - JavaScript example

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

## Output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [TableAttribute](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs.Extensions.Storage/Tables/TableAttribute.cs).

The attribute's constructor takes the table name. It can be used on an `out` parameter or on the return value of the function, as shown in the following example:

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

For a complete example, see [Output - C# example](#output---c-example).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Input - attributes](#input---attributes).

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
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "AzureWebJobsMyStorage." If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Output - usage

The Table storage output binding supports the following scenarios:

* **Write one row in any language**

  In C# and C# script, access the output table entity by using a method parameter such as `out T paramName` or the function return value. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` can be any serializable type if the partition key and row key are provided by the *function.json* file or the `Table` attribute. Otherwise, `T` must be a type that includes `PartitionKey` and `RowKey` properties. In this scenario, `T` typically implements `ITableEntity` or derives from `TableEntity`, but it doesn't have to.

* **Write one or more rows in C# or C# script**

  In C# and C# script, access the output table entity by using a method parameter `ICollector<T> paramName` or `IAsyncCollector<T> paramName`. In C# script, `paramName` is the value specified in the `name` property of *function.json*. `T` specifies the schema of the entities you want to add. Typically, `T` derives from `TableEntity` or implements `ITableEntity`, but it doesn't have to. The partition key and row key values in *function.json* or the `Table` attribute constructor are not used in this scenario.

  An alternative is to use a `CloudTable` method parameter to write to the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](#azure-storage-sdk-version-in-functions-1x). For an example of code that binds to `CloudTable`, see the input binding examples for [C#](#input---c-example---cloudtable) or [C# script](#input---c-script-example---cloudtable) earlier in this article.

* **Write one or more rows in JavaScript**

  In JavaScript functions, access the table output using `context.bindings.<name>`.

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Table | [Table Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/table-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](https://docs.microsoft.com/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue | [Troubleshooting](https://docs.microsoft.com/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
