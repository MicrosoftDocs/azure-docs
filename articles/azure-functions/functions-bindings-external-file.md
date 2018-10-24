---
title: External File bindings for Azure Functions (experimental)
description: Using External File bindings in Azure Functions
services: functions
author: alexkarcher-msft
manager: jeconnoc

ms.assetid:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 11/27/2017
ms.author: alkarche

---
# Azure Functions External File bindings (experimental)
This article shows how to manipulate files from different SaaS providers (such as Dropbox or Google Drive) in Azure Functions. Azure Functions supports trigger, input, and output bindings for external files. These bindings create API connections to SaaS providers, or use existing API connections from your Function App's resource group.

> [!IMPORTANT]
> The External File bindings are experimental and might never reach Generally Available (GA) status. They are included only in Azure Functions 1.x, and there are no plans to add them to Azure Functions 2.x. For scenarios that require access to data in SaaS providers, consider using [logic apps that call into functions](functions-twitter-email.md). See the [Logic Apps File System connector](../logic-apps/logic-apps-using-file-connector.md).

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Available file connections

|Connector|Trigger|Input|Output|
|:-----|:---:|:---:|:---:|
|[Box](https://www.box.com)|x|x|x
|[Dropbox](https://www.dropbox.com)|x|x|x
|[FTP](https://docs.microsoft.com/azure/app-service/app-service-deploy-ftp)|x|x|x
|[OneDrive](https://onedrive.live.com)|x|x|x
|[OneDrive for Business](https://onedrive.live.com/about/business/)|x|x|x
|[SFTP](https://docs.microsoft.com/azure/connectors/connectors-create-api-sftp)|x|x|x
|[Google Drive](https://www.google.com/drive/)||x|x|

> [!NOTE]
> External File connections can also be used in [Azure Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list).

## Trigger

The external file trigger lets you monitor a remote folder and run your function code when changes are detected.

## Trigger - example

See the language-specific example:

* [C# script](#trigger---c-script-example)
* [JavaScript](#trigger---javascript-example)

### Trigger - C# script example

The following example shows an external file trigger binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function logs the contents of each file that is added to the monitored folder.

Here's the binding data in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myFile",
            "type": "apiHubFileTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection": "<name of external file connection>"
        }
    ]
}
```

Here's the C# script code:

```cs
public static void Run(string myFile, TraceWriter log)
{
    log.Info($"C# File trigger function processed: {myFile}");
}
```

### Trigger - JavaScript example

The following example shows an external file trigger binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function logs the contents of each file that is added to the monitored folder.

Here's the binding data in the *function.json* file:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myFile",
            "type": "apiHubFileTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection": "<name of external file connection>"
        }
    ]
}
```

Here's the JavaScript code:

```javascript
module.exports = function(context) {
    context.log('Node.js File trigger function processed', context.bindings.myFile);
    context.done();
};
```

## Trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** | Must be set to `apiHubFileTrigger`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the event item in function code. | 
|**connection**| Identifies the app setting that stores the connection string. The app setting is created automatically when you add a connection in the integrate UI in the Azure portal.|
|**path** | The folder to monitor, and optionally a name pattern.|

### Name patterns

You can specify a file name pattern in the `path` property. The folder referenced must exist in the SaaS provider.

Examples:

```json
"path": "input/original-{name}",
```

This path would find a file named *original-File1.txt* in the *input* folder, and the value of the `name` variable in function code would be `File1.txt`.

Another example:

```json
"path": "input/{filename}.{fileextension}",
```

This path would also find a file named *original-File1.txt*, and the value of the `filename` and `fileextension` variables in function code
would be *original-File1* and *txt*.

You can restrict the file type of files by using a fixed value for the file extension. For example:

```json
"path": "samples/{name}.png",
```

In this case, only *.png* files in the *samples* folder trigger the function.

Curly braces are special characters in name patterns. To specify file names that have curly braces in the name, double the curly braces.
For example:

```json
"path": "images/{{20140101}}-{name}",
```

This path would find a file named *{20140101}-soundfile.mp3* in the *images* folder, and the `name` variable value in the function code
would be *soundfile.mp3*.

## Trigger - usage

In C# functions, you bind to the input file data by using a named parameter in your function signature, like `<T> <name>`.
Where `T` is the data type that you want to deserialize the data into, and `paramName` is the name you specified in the
[trigger JSON](#trigger). In Node.js functions, you access the input file data using `context.bindings.<name>`.

The file can be deserialized into any of the following types:

* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - useful for JSON-serialized file data.
  If you declare a custom input type (e.g. `FooType`), Azure Functions attempts to deserialize the JSON data
  into your specified type.
* String - useful for text file data.

In C# functions, you can also bind to any of the following types, and the Functions runtime attempts to
deserialize the file data using that type:

* `string`
* `byte[]`
* `Stream`
* `StreamReader`
* `TextReader`

<!--- ## Trigger - file receipts
The Azure Functions runtime makes sure that no external file trigger function gets called more than once for the same new or updated file.
It does so by maintaining *file receipts* to determine if a given file version has been processed.

File receipts are stored in a folder named *azure-webjobs-hosts* in the Azure storage account for your function app
(specified by the `AzureWebJobsStorage` app setting). A file receipt has the following information:

* The triggered function ("*&lt;function app name>*.Functions.*&lt;function name>*", for example: "functionsf74b96f7.Functions.CopyFile")
* The folder name
* The file type ("BlockFile" or "PageFile")
* The file name
* The ETag (a file version identifier, for example: "0x8D1DC6E70A277EF")

To force reprocessing of a file, delete the file receipt for that file from the *azure-webjobs-hosts* folder manually.
--->

## Trigger - poison files

When an external file trigger function fails, Azure Functions retries that function up to 5 times by default (including the first try) for a given file.
If all 5 tries fail, Functions adds a message to a Storage queue named *webjobs-apihubtrigger-poison*. The queue message for poison files
is a JSON object that contains the following properties:

* FunctionId (in the format *&lt;function app name>*.Functions.*&lt;function name>*)
* FileType
* FolderName
* FileName
* ETag (a file version identifier, for example: "0x8D1DC6E70A277EF")

## Input

The Azure external file input binding enables you to use a file from an external folder in your function.

## Input - example

See the language-specific example:

* [C# script](#input---c-script-example)
* [JavaScript](#input---javascript-example)

### Input - C# script example

The following example shows external file input and output bindings in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function copies an input file to an output file.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputFile",
      "type": "apiHubFile",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "<name of external file connection>",
      "direction": "in"
    },
    {
      "name": "myOutputFile",
      "type": "apiHubFile",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "<name of external file connection>",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the C# script code:

```cs
public static void Run(string myQueueItem, string myInputFile, out string myOutputFile, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputFile = myInputFile;
}
```

### Input - JavaScript example

The following example shows external file input and output bindings in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding. The function copies an input file to an output file.

Here's the binding data in the *function.json* file:

```json
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "MyStorageConnection",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputFile",
      "type": "apiHubFile",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "<name of external file connection>",
      "direction": "in"
    },
    {
      "name": "myOutputFile",
      "type": "apiHubFile",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "<name of external file connection>",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

Here's the JavaScript code:

```javascript
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputFile = context.bindings.myInputFile;
    context.done();
};
```

## Input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** | Must be set to `apiHubFile`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `in`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the event item in function code. | 
|**connection**| Identifies the app setting that stores the connection string. The app setting is created automatically when you add a connection in the integrate UI in the Azure portal.|
|**path** | Must contain the folder name and the file name. For example, if you have a [queue trigger](functions-bindings-storage-queue.md) in your function, you can use `"path": "samples-workitems/{queueTrigger}"` to point to a file in the `samples-workitems` folder with a name that matches the file name specified in the trigger message.   

## Input - usage

In C# functions, you bind to the input file data by using a named parameter in your function signature, like `<T> <name>`. `T` is the data type that you want to deserialize the data into, and `name` is the name you specified in the input binding. In Node.js functions, you access the input file data using `context.bindings.<name>`.

The file can be deserialized into any of the following types:

* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - useful for JSON-serialized file data.
  If you declare a custom input type (e.g. `InputType`), Azure Functions attempts to deserialize the JSON data
  into your specified type.
* String - useful for text file data.

In C# functions, you can also bind to any of the following types, and the Functions runtime attempts to deserialize the file data using that type:

* `string`
* `byte[]`
* `Stream`
* `StreamReader`
* `TextReader`

## Output

The Azure external file output binding enables you to write files to an external folder in your function.

## Output - example

See the [input binding example](#input---example).

## Output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|---------|----------------------|
|**type** | Must be set to `apiHubFile`. This property is set automatically when you create the trigger in the Azure portal.|
|**direction** | Must be set to `out`. This property is set automatically when you create the trigger in the Azure portal. |
|**name** | The name of the variable that represents the event item in function code. | 
|**connection**| Identifies the app setting that stores the connection string. The app setting is created automatically when you add a connection in the integrate UI in the Azure portal.|
|**path** | Must contain the folder name and the file name. For example, if you have a [queue trigger](functions-bindings-storage-queue.md) in your function, you can use `"path": "samples-workitems/{queueTrigger}"` to point to a file in the `samples-workitems` folder with a name that matches the file name specified in the trigger message.   

## Output - usage

In C# functions, you bind to the output file by using the named `out` parameter in your function signature, like `out <T> <name>`, where `T` is the data type that you want to serialize the data into, and `name` is the name you specified in the
output binding. In Node.js functions, you access the output file using `context.bindings.<name>`.

You can write to the output file using any of the following types:

* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - useful for JSON-serialization.
  If you declare a custom output type (e.g. `out OutputType paramName`), Azure Functions attempts to serialize object
  into JSON. If the output parameter is null when the function exits, the Functions runtime creates a file as
  a null object.
* String - (`out string paramName`) useful for text file data. the Functions runtime creates a file only if the
  string parameter is non-null when the function exits.

In C# functions you can also output to any of the following types:

* `TextWriter`
* `Stream`
* `CloudFileStream`
* `ICloudFile`
* `CloudBlockFile`
* `CloudPageFile`

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
