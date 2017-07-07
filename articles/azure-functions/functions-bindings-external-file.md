---
title: Azure Functions External File bindings (Preview) | Microsoft Docs
description: Using External File bindings in Azure Functions
services: functions
documentationcenter: ''
author: alexkarcher-msft
manager: erikre
editor: ''

ms.assetid:
ms.service: functions
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/12/2017
ms.author: alkarche

---
# Azure Functions External File bindings (Preview)
This article shows how to manipulate files from different SaaS providers (e.g. OneDrive, Dropbox) within your function utilizing built-in bindings. Azure functions supports trigger, input, and output bindings for external file.

This binding creates API connections to SaaS providers, or uses existing API connections from your Function App's resource group.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Supported File connections

|Connector|Trigger|Input|Output|
|:-----|:---:|:---:|:---:|
|[Box](https://www.box.com)|x|x|x
|[Dropbox](https://www.dropbox.com)|x|x|x
|[File System](https://docs.microsoft.com/azure/logic-apps/logic-apps-using-file-connector)|x|x|x
|[FTP](https://docs.microsoft.com/azure/app-service-web/app-service-deploy-ftp)|x|x|x
|[OneDrive](https://onedrive.live.com)|x|x|x
|[OneDrive for Business](https://onedrive.live.com/about/business/)|x|x|x
|[SFTP](https://docs.microsoft.com/azure/connectors/connectors-create-api-sftp)|x|x|x
|[Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/)||x|x|
|[Google Drive](https://www.google.com/drive/)||x|x|

> [!NOTE]
> External File connections can also be used in [Azure Logic Apps](https://docs.microsoft.com/azure/connectors/apis-list)

## External File trigger binding

The Azure external file trigger lets you monitor a remote folder and run your function code when changes are detected.

The external file trigger uses the following JSON objects in the `bindings` array of function.json

```json
{
  "type": "apiHubFileTrigger",
  "name": "<Name of input parameter in function signature>",
  "direction": "in",
  "path": "<folder to monitor, and optionally a name pattern - see below>",
  "connection": "<name of external file connection - see above>"
}
```
<!---
See one of the following subheadings for more information:

* [Name patterns](#pattern)
* [File receipts](#receipts)
* [Handling poison files](#poison)
--->

<a name="pattern"></a>

### Name patterns
You can specify a file name pattern in the `path` property. For example:

```json
"path": "input/original-{name}",
```

This path would find a file named *original-File1.txt* in the *input* folder, and the value of the `name` variable in function code would be `File1`.

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

<a name="receipts"></a>

<!--- ### File receipts
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
<a name="poison"></a>

### Handling poison files
When an external file trigger function fails, Azure Functions retries that function up to 5 times by default (including the first try) for a given file.
If all 5 tries fail, Functions adds a message to a Storage queue named *webjobs-apihubtrigger-poison*. The queue message for poison files
is a JSON object that contains the following properties:

* FunctionId (in the format *&lt;function app name>*.Functions.*&lt;function name>*)
* FileType
* FolderName
* FileName
* ETag (a file version identifier, for example: "0x8D1DC6E70A277EF")


<a name="triggerusage"></a>

## Trigger usage
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

* `TextReader`
* `Stream`
* `ICloudBlob`
* `CloudBlockBlob`
* `CloudPageBlob`
* `CloudBlobContainer`
* `CloudBlobDirectory`
* `IEnumerable<CloudBlockBlob>`
* `IEnumerable<CloudPageBlob>`
* Other types deserialized by [ICloudBlobStreamBinder](../app-service-web/websites-dotnet-webjobs-sdk-storage-blobs-how-to.md#icbsb)


## Trigger sample
Suppose you have the following function.json, that defines an external file trigger:

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

See the language-specific sample that logs the contents of each file that is added to the monitored folder.

* [C#](#triggercsharp)
* [Node.js](#triggernodejs)

<a name="triggercsharp"></a>

### Trigger usage in C# #

```cs
public static void Run(string myFile, TraceWriter log)
{
    log.Info($"C# File trigger function processed: {myFile}");
}
```

<!--
<a name="triggerfsharp"></a>
### Trigger usage in F# ##
```fsharp

```
-->

<a name="triggernodejs"></a>

### Trigger usage in Node.js

```javascript
module.exports = function(context) {
    context.log('Node.js File trigger function processed', context.bindings.myFile);
    context.done();
};
```

<a name="input"></a>

## External File input binding
The Azure external file input binding enables you to use a file from an external folder in your function.

The external file input to a function uses the following JSON objects in the `bindings` array of function.json:

```json
{
  "name": "<Name of input parameter in function signature>",
  "type": "apiHubFile",
  "direction": "in",
  "path": "<Path of input file - see below>",
  "connection": "<name of external file connection>"
},
```

Note the following:

* `path` must contain the folder name and the file name. For example, if you have a [queue trigger](functions-bindings-storage-queue.md)
  in your function, you can use `"path": "samples-workitems/{queueTrigger}"` to point to a file in the `samples-workitems` folder with a name that
  matches the file name specified in the trigger message.   

<a name="inputusage"></a>

## Input usage
In C# functions, you bind to the input file data by using a named parameter in your function signature, like `<T> <name>`.
Where `T` is the data type that you want to deserialize the data into, and `paramName` is the name you specified in the
[input binding](#input). In Node.js functions, you access the input file data using `context.bindings.<name>`.

The file can be deserialized into any of the following types:

* Any [Object](https://msdn.microsoft.com/library/system.object.aspx) - useful for JSON-serialized file data.
  If you declare a custom input type (e.g. `InputType`), Azure Functions attempts to deserialize the JSON data
  into your specified type.
* String - useful for text file data.

In C# functions, you can also bind to any of the following types, and the Functions runtime attempts to
deserialize the file data using that type:

* `TextReader`
* `Stream`
* `ICloudBlob`
* `CloudBlockBlob`
* `CloudPageBlob`


<a name="output"></a>

## External File output binding
The Azure external file output binding enables you to write files to an external folder in your function.

The external file output for a function uses the following JSON objects in the `bindings` array of function.json:

```json
{
  "name": "<Name of output parameter in function signature>",
  "type": "apiHubFile",
  "direction": "out",
  "path": "<Path of input file - see below>",
  "connection": "<name of external file connection>"
}
```

Note the following:

* `path` must contain the folder name and the file name to write to. For example, if you have a [queue trigger](functions-bindings-storage-queue.md)
  in your function, you can use `"path": "samples-workitems/{queueTrigger}"` to point to a file in the `samples-workitems` folder with a name that
  matches the file name specified in the trigger message.   

<a name="outputusage"></a>

## Output usage
In C# functions, you bind to the output file by using the named `out` parameter in your function signature, like `out <T> <name>`,
where `T` is the data type that you want to serialize the data into, and `paramName` is the name you specified in the
[output binding](#output). In Node.js functions, you access the output file using `context.bindings.<name>`.

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

<a name="outputsample"></a>

<a name="sample"></a>

## Input + Output sample
Suppose you have the following function.json, that defines a [Storage queue trigger](functions-bindings-storage-queue.md),
an external file input, and an external file output:

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

See the language-specific sample that copies the input file to the output file.

* [C#](#incsharp)
* [Node.js](#innodejs)

<a name="incsharp"></a>

### Usage in C# #

```cs
public static void Run(string myQueueItem, string myInputFile, out string myOutputFile, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputFile = myInputFile;
}
```

<!--
<a name="infsharp"></a>
### Input usage in F# ##
```fsharp

```
-->

<a name="innodejs"></a>

### Usage in Node.js

```javascript
module.exports = function(context) {
    context.log('Node.js Queue trigger function processed', context.bindings.myQueueItem);
    context.bindings.myOutputFile = context.bindings.myInputFile;
    context.done();
};
```

## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
