---
title: Azure Tables output bindings for Azure Functions
description: Understand how to use Azure Tables output bindings in Azure Functions.
ms.topic: reference
ms.date: 11/11/2022
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-extended-java, devx-track-js, devx-track-ts
zone_pivot_groups: programming-languages-set-functions
---

# Azure Tables output bindings for Azure Functions

Use an Azure Tables output binding to write entities to a table in [Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction) or [Azure Table Storage](../storage/tables/table-storage-overview.md).

For information on setup and configuration details, see the [overview](./functions-bindings-storage-table.md)

> [!NOTE]
> This output binding only supports creating new entities in a table. If you need to update an existing entity from your function code, instead use an Azure Tables SDK directly.

::: zone pivot="programming-language-javascript,programming-language-typescript"
[!INCLUDE [functions-nodejs-model-tabs-description](../../includes/functions-nodejs-model-tabs-description.md)]
::: zone-end

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro](../../includes/functions-bindings-csharp-intro.md)]

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

# [Isolated worker model](#tab/isolated-process)

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

The following function, which is started by a Queue Storage trigger, writes a new `MyDataTable` entity to a table named **OutputTable**.

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

# [In-process model](#tab/in-process)

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


---

::: zone-end
::: zone pivot="programming-language-java"

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

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"

The following example shows a table output binding that writes multiple table entities.

::: zone-end
::: zone pivot="programming-language-typescript"  

# [Model v4](#tab/nodejs-v4)

:::code language="typescript" source="~/azure-functions-nodejs-v4/ts/src/functions/tableOutput1.ts" :::

# [Model v3](#tab/nodejs-v3)

TypeScript samples are not documented for model v3.

---

::: zone-end
::: zone pivot="programming-language-javascript"  

# [Model v4](#tab/nodejs-v4)

:::code language="javascript" source="~/azure-functions-nodejs-v4/js/src/functions/tableOutput1.js" :::

# [Model v3](#tab/nodejs-v3)

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

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = async function (context) {

    context.bindings.tableBinding = [];

    for (var i = 1; i < 10; i++) {
        context.bindings.tableBinding.push({
            PartitionKey: "Test",
            RowKey: i.toString(),
            Name: "Name " + i
        });
    }
};
```

---

::: zone-end  
::: zone pivot="programming-language-powershell"  

The following example demonstrates how to write multiple entities to a table from a function.

Binding configuration in _function.json_:

```json
{
  "bindings": [
    {
      "name": "InputData",
      "type": "manualTrigger",
      "direction": "in"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnectionAppSetting",
      "name": "TableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

PowerShell code in _run.ps1_:

```powershell
param($InputData, $TriggerMetadata)
  
foreach ($i in 1..10) {
    Push-OutputBinding -Name TableBinding -Value @{
        PartitionKey = 'Test'
        RowKey = "$i"
        Name = "Name $i"
    }
}
```

::: zone-end  
::: zone pivot="programming-language-python"  

The following example demonstrates how to use the Table storage output binding. Configure the `table` binding in the *function.json* by assigning values to `name`, `tableName`, `partitionKey`, and `connection`:

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

---

::: zone-end  
::: zone pivot="programming-language-csharp"
## Attributes 

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the function. C# script instead uses a function.json configuration file as described in the [C# scripting guide](./functions-reference-csharp.md#table-output).

# [Isolated worker model](#tab/isolated-process)

In [C# class libraries](dotnet-isolated-process-guide.md), the `TableInputAttribute` supports the following properties:

| Attribute property |Description|
|---------|---------|
|**TableName** | The name of the table to which to write.| 
|**PartitionKey** | The partition key of the table entity to write. | 
|**RowKey** | The row key of the table entity to write. | 
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

# [In-process model](#tab/in-process)

In [C# class libraries](functions-dotnet-class-library.md), the `TableAttribute` supports the following properties:

| Attribute property |Description|
|---------|---------|
|**TableName** | The name of the table to which to write.| 
|**PartitionKey** | The partition key of the table entity to write. | 
|**RowKey** | The row key of the table entity to write. | 
|**Connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

The attribute's constructor takes the table name. Use the attribute on an `out` parameter or on the return value of the function, as shown in the following example:

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

You can set the `Connection` property to specify a connection to the table service, as shown in the following example:

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

[!INCLUDE [functions-bindings-storage-attribute](../../includes/functions-bindings-storage-attribute.md)]

---

::: zone-end  
::: zone pivot="programming-language-java"  
## Annotations

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [TableOutput](https://github.com/Azure/azure-functions-java-library/blob/master/src/main/java/com/microsoft/azure/functions/annotation/TableOutput.java/) annotation on parameters to write values into your tables. The attribute supports the following elements: 

| Element |Description|
|---------|---------|
|**name**| The variable name used in function code that represents the table or entity. | 
|**dataType**| Defines how Functions runtime should treat the parameter value. To learn more, see [dataType](/java/api/com.microsoft.azure.functions.annotation.tableoutput.datatype).
|**tableName** | The name of the table to which to write.| 
|**partitionKey** | The partition key of the table entity to write. | 
|**rowKey** | The row key of the table entity to write. | 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  

## Configuration

# [Model v4](#tab/nodejs-v4)

The following table explains the properties that you can set on the `options` object passed to the `output.table()` method.

| Property | Description |
|---------|----------------------|
|**tableName** |The name of the table to which to write.| 
|**partitionKey** |The partition key of the table entity to write. | 
|**rowKey** | The row key of the table entity to write. | 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

# [Model v3](#tab/nodejs-v3)

The following table explains the binding configuration properties that you set in the *function.json* file.

| Property | Description |
|---------|----------------------|
|**type** |Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the table or entity. Set to `$return` to reference the function return value.| 
|**tableName** |The name of the table to which to write.| 
|**partitionKey** |The partition key of the table entity to write. | 
|**rowKey** | The row key of the table entity to write. | 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

---

::: zone-end
::: zone pivot="programming-language-powershell,programming-language-python"
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---|---|
|**type** |Must be set to `table`. This property is set automatically when you create the binding in the Azure portal.|
|**direction** |  Must be set to `out`. This property is set automatically when you create the binding in the Azure portal. |
|**name** |  The variable name used in function code that represents the table or entity. Set to `$return` to reference the function return value.| 
|**tableName** |The name of the table to which to write.| 
|**partitionKey** |The partition key of the table entity to write. | 
|**rowKey** | The row key of the table entity to write. | 
|**connection** | The name of an app setting or setting collection that specifies how to connect to the table service. See [Connections](#connections). |

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]
::: zone-end  

[!INCLUDE [functions-table-connections](../../includes/functions-table-connections.md)]

## Usage

::: zone pivot="programming-language-csharp"  

The usage of the binding depends on the extension package version, and the C# modality used in your function app, which can be one of the following:

# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.

# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
---

Choose a version to see usage details for the mode and version. 

# [Azure Tables extension](#tab/table-api/in-process)

The following types are supported for `out` parameters and return types:

- A plain-old CLR object (POCO) that includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity`.
- `ICollector<T>` or `IAsyncCollector<T>` where `T` includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity`.

You can also bind to `TableClient` [from the Azure SDK](/dotnet/api/azure.data.tables.tableclient). You can then use that object to write to the table.

# [Combined Azure Storage extension](#tab/storage-extension/in-process)

The following types are supported for `out` parameters and return types:

- A plain-old CLR object (POCO) that includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.
- `ICollector<T>` or `IAsyncCollector<T>` where `T` includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.

You can also bind to `CloudTable` [from the Storage SDK](/dotnet/api/microsoft.azure.cosmos.table.cloudtable) as a method parameter. You can then use that object to write to the table.

# [Functions 1.x](#tab/functionsv1/in-process)

The following types are supported for `out` parameters and return types:

- A plain-old CLR object (POCO) that includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.
- `ICollector<T>` or `IAsyncCollector<T>` where `T` includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.

You can also bind to `CloudTable` [from the Storage SDK](/dotnet/api/microsoft.azure.cosmos.table.cloudtable) as a method parameter. You can then use that object to write to the table.

# [Azure Tables extension](#tab/table-api/isolated-process)

[!INCLUDE [functions-bindings-table-output-dotnet-isolated-types](../../includes/functions-bindings-table-output-dotnet-isolated-types.md)]

# [Combined Azure Storage extension](#tab/storage-extension/isolated-process)

Return a plain-old CLR object (POCO) with properties that can be mapped to the table entity.

# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated worker process.

---

::: zone-end  
::: zone pivot="programming-language-java"
There are two options for outputting a Table storage row from a function by using the [TableStorageOutput](/java/api/com.microsoft.azure.functions.annotation.tableoutput) annotation:

| Options | Description |
|---|---|
| **Return value**| By applying the annotation to the function itself, the return value of the function persists as a Table storage row. |
|**Imperative**| To explicitly set the table row, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding), where `T` includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.|

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"
# [Model v4](#tab/nodejs-v4)

Set the output row data by returning the value or using `context.extraOutputs.set()`.

# [Model v3](#tab/nodejs-v3)

Set the output row data by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

---
::: zone-end
::: zone pivot="programming-language-powershell"  
To write to table data, use the `Push-OutputBinding` cmdlet, set the `-Name TableBinding` parameter and `-Value` parameter equal to the row data. See the [PowerShell example](#example) for more detail.


::: zone-end  
::: zone pivot="programming-language-python"  
There are two options for outputting a Table storage row message from a function:

| Options | Description |
|---|---|
| **Return value**| Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value persists as a Table storage row.|
|**Imperative**| Pass a value to the [set](/python/api/azure-functions/azure.functions.out#set-val--t-----none) method of the parameter declared as an [Out](/python/api/azure-functions/azure.functions.out) type. The value passed to `set` is persisted as table row.|
::: zone-end  

For specific usage details, see [Example](#example). 

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Table | [Table Error Codes](/rest/api/storageservices/fileservices/table-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue | [Troubleshooting](/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
