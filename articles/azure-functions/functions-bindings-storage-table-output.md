---
title: Azure Table storage output bindings for Azure Functions
description: Understand how to use Azure Table storage output bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 09/03/2018
ms.author: cshoe
ms.custom: "devx-track-csharp, devx-track-python"
---
# Azure Table storage output bindings for Azure Functions

Use an Azure Table storage output binding to write entities to a table in an Azure Storage account.

> [!NOTE]
> This output binding does not support updating existing entities. Use the `TableOperation.Replace` operation [from the Azure Storage SDK](../cosmos-db/tutorial-develop-table-dotnet.md#delete-an-entity) to update an existing entity.

## Example

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

The [configuration](#configuration) section explains these properties.

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

The [configuration](#configuration) section explains these properties.

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

# [PowerShell](#tab/powershell)

The following example demonstrates how to write multiple entities to a table from a function.

Binding configuration in _function.json_:

```json
{
  "bindings": [
    {
      "name": "InputData",
      "type": "manualTrigger",
      "direction": "in"
    },
    {
      "tableName": "Person",
      "connection": "MyStorageConnectionAppSetting",
      "name": "TableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

PowerShell code in _run.ps1_:

```powershell
param($InputData, $TriggerMetadata)
  
foreach ($i in 1..10) {
    Push-OutputBinding -Name TableBinding -Value @{
        PartitionKey = 'Test'
        RowKey = "$i"
        Name = "Name $i"
    }
}
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

---

## Attributes and annotations

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

For a complete example, see the [C# example](#example).

You can use the `StorageAccount` attribute to specify the storage account at class, method, or parameter level. For more information, see [Input - attributes](./functions-bindings-storage-table-input.md#attributes-and-annotations).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [Java](#tab/java)

In the [Java functions runtime library](/java/api/overview/azure/functions/runtime), use the [TableOutput](https://github.com/Azure/azure-functions-java-library/blob/master/src/main/java/com/microsoft/azure/functions/annotation/TableOutput.java/) annotation on parameters to write values into table storage.

See the [example for more detail](#example).

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
|**direction** | n/a | Must be set to `out`. This property is set automatically when you create the binding in the Azure portal. |
|**name** | n/a | The variable name used in function code that represents the table or entity. Set to `$return` to reference the function return value.| 
|**tableName** |**TableName** | The name of the table.| 
|**partitionKey** |**PartitionKey** | The partition key of the table entity to write. See the [usage section](#usage) for guidance on how to use this property.| 
|**rowKey** |**RowKey** | The row key of the table entity to write. See the [usage section](#usage) for guidance on how to use this property.| 
|**connection** |**Connection** | The name of an app setting that contains the Storage connection string to use for this binding. If the app setting name begins with "AzureWebJobs", you can specify only the remainder of the name here. For example, if you set `connection` to "MyStorage", the Functions runtime looks for an app setting that is named "MyStorage". If you leave `connection` empty, the Functions runtime uses the default Storage connection string in the app setting that is named `AzureWebJobsStorage`.|

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Usage

# [C#](#tab/csharp)

Access the output table entity by using a method parameter `ICollector<T> paramName` or `IAsyncCollector<T> paramName` where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`.

Alternatively you can use a `CloudTable` method parameter to write to the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

# [C# Script](#tab/csharp-script)

Access the output table entity by using a method parameter `ICollector<T> paramName` or `IAsyncCollector<T> paramName` where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`. The `paramName` value is specified in the `name` property of *function.json*.

Alternatively you can use a `CloudTable` method parameter to write to the table by using the Azure Storage SDK. If you try to bind to `CloudTable` and get an error message, make sure that you have a reference to [the correct Storage SDK version](./functions-bindings-storage-table.md#azure-storage-sdk-version-in-functions-1x).

# [Java](#tab/java)

There are two options for outputting a Table storage row from a function by using the [TableStorageOutput](/java/api/com.microsoft.azure.functions.annotation.tableoutput) annotation:

- **Return value**: By applying the annotation to the function itself, the return value of the function is persisted as a Table storage row.

- **Imperative**: To explicitly set the message value, apply the annotation to a specific parameter of the type [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding), where `T` includes the `PartitionKey` and `RowKey` properties. These properties are often accompanied by implementing `ITableEntity` or inheriting `TableEntity`.

# [JavaScript](#tab/javascript)

Access the output event by using `context.bindings.<name>` where `<name>` is the value specified in the `name` property of *function.json*.

# [PowerShell](#tab/powershell)

To write to table data, use the `Push-OutputBinding` cmdlet, set the `-Name TableBinding` parameter and `-Value` parameter equal to the row data. See the [PowerShell example](#example) for more detail.

# [Python](#tab/python)

There are two options for outputting a Table storage row message from a function:

- **Return value**: Set the `name` property in *function.json* to `$return`. With this configuration, the function's return value is persisted as a Table storage row.

- **Imperative**: Pass a value to the [set](/python/api/azure-functions/azure.functions.out#set-val--t-----none) method of the parameter declared as an [Out](/python/api/azure-functions/azure.functions.out) type. The value passed to `set` is persisted as an Event Hub message.

---

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Table | [Table Error Codes](/rest/api/storageservices/fileservices/table-service-error-codes) |
| Blob, Table, Queue | [Storage Error Codes](/rest/api/storageservices/fileservices/common-rest-api-error-codes) |
| Blob, Table, Queue | [Troubleshooting](/rest/api/storageservices/fileservices/troubleshooting-api-operations) |

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
