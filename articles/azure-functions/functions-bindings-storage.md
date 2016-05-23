<properties
	pageTitle="Azure Functions triggers and bindings for Azure Storage | Microsoft Azure"
	description="Understand how to use Azure Storage triggers and bindings in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="05/16/2016"
	ms.author="chrande"/>

# Azure Functions triggers and bindings for Azure Storage

This article explains how to configure and code Azure Storage triggers and bindings in Azure Functions. 

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

## <a id="storagequeuetrigger"></a> Azure Storage queue trigger

#### function.json for storage queue trigger

The *function.json* file specifies the following properties.

- `name` : The variable name used in function code for the queue or the queue message. 
- `queueName` : The name of the queue to poll. For queue naming rules, see [Naming Queues and Metadata](https://msdn.microsoft.com/library/dd179349.aspx).
- `connection` : The name of an app setting that contains a storage connection string. If you leave `connection` empty, the trigger will work with the default storage connection string for the function app, which is specified by the AzureWebJobsStorage app setting.
- `type` : Must be set to *queueTrigger*.
- `direction` : Must be set to *in*. 

Example *function.json* for a storage queue trigger:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myQueueItem",
            "queueName": "myqueue-items",
            "connection":"",
            "type": "queueTrigger",
            "direction": "in"
        }
    ]
}
```

#### Queue trigger supported types

The queue message can be deserialized to any of the following types:

* Object (from JSON)
* String
* Byte array 
* `CloudQueueMessage` (C#) 

#### Queue trigger metadata

You can get queue metadata in your function by using these variable names:

* expirationTime
* insertionTime
* nextVisibleTime
* id
* popReceipt
* dequeueCount
* queueTrigger (another way to retrieve the queue message text as a string)

This C# code example retrieves and logs queue metadata:

```csharp
public static void Run(string myQueueItem, 
    DateTimeOffset expirationTime, 
    DateTimeOffset insertionTime, 
    DateTimeOffset nextVisibleTime,
    string queueTrigger,
    string id,
    string popReceipt,
    int dequeueCount,
    TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}\n" +
        $"queueTrigger={queueTrigger}\n" +
        $"expirationTime={expirationTime}\n" +
        $"insertionTime={insertionTime}\n" +
        $"nextVisibleTime={nextVisibleTime}\n" +
        $"id={id}\n" +
        $"popReceipt={popReceipt}\n" + 
        $"dequeueCount={dequeueCount}");
}
```

#### Handling poison queue messages

Messages whose content causes a function to fail are called *poison messages*. When the function fails, the queue message is not deleted and eventually is picked up again, causing the cycle to be repeated. The SDK can automatically interrupt the cycle after a limited number of iterations, or you can do it manually.

The SDK will call a function up to 5 times to process a queue message. If the fifth try fails, the message is moved to a poison queue.

The poison queue is named *{originalqueuename}*-poison. You can write a function to process messages from the poison queue by logging them or sending a notification that manual attention is needed. 

If you want to handle poison messages manually, you can get the number of times a message has been picked up for processing by checking `dequeueCount`.

## <a id="storagequeueoutput"></a> Azure Storage queue output binding

#### function.json for storage queue output binding

The *function.json* file specifies the following properties.

- `name` : The variable name used in function code for the queue or the queue message. 
- `queueName` : The name of the queue. For queue naming rules, see [Naming Queues and Metadata](https://msdn.microsoft.com/library/dd179349.aspx).
- `connection` : The name of an app setting that contains a storage connection string. If you leave `connection` empty, the trigger will work with the default storage connection string for the function app, which is specified by the AzureWebJobsStorage app setting.
- `type` : Must be set to *queue*.
- `direction` : Must be set to *out*. 

Example *function.json* for a storage queue output binding that uses a queue trigger and writes a queue message:

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
      "name": "myQueue",
      "queueName": "samples-workitems-out",
      "connection": "MyStorageConnection",
      "type": "queue",
      "direction": "out"
    }
  ],
  "disabled": false
}
``` 

#### Queue output binding supported types

The `queue` binding can serialize the following types to a queue message:

* Object (`out T` in C#, creates a message with a null object if the parameter is null when the function ends)
* String (`out string` in C#, creates queue message if parameter value is non-null when the function ends)
* Byte array (`out byte[]` in C#, works like string) 
* `out CloudQueueMessage` (C#, works like string) 

In C# you can also bind to `ICollector<T>` or `IAsyncCollector<T>` where `T` is one of the supported types.

#### Queue output binding code examples

This C# code example writes a single output queue message for each input queue message.

```csharp
public static void Run(string myQueueItem, out string myOutputQueueItem, TraceWriter log)
{
    myOutputQueueItem = myQueueItem + "(next step)";
}
```

This C# code example writes multiple messages by using  `ICollector<T>` (use `IAsyncCollector<T>` in an async function):

```csharp
public static void Run(string myQueueItem, ICollector<string> myQueue, TraceWriter log)
{
    myQueue.Add(myQueueItem + "(step 1)");
    myQueue.Add(myQueueItem + "(step 2)");
}
```

## <a id="storageblobtrigger"></a> Azure Storage blob trigger

#### function.json for storage blob trigger

The *function.json* file specifies the following properties.

- `name` : The variable name used in function code for the blob. 
- `path` : A path that specifies the container to monitor, and optionally a blob name pattern.
- `connection` : The name of an app setting that contains a storage connection string. If you leave `connection` empty, the trigger will work with the default storage connection string for the function app, which is specified by the AzureWebJobsStorage app setting.
- `type` : Must be set to *blobTrigger*.
- `direction` : Must be set to *in*.

Example *function.json* for a storage blob trigger that watches for blobs that are added to the samples-workitems container:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myBlob",
            "type": "blobTrigger",
            "direction": "in",
            "path": "samples-workitems",
            "connection":""
        }
    ]
}
```

#### Blob trigger supported types

The blob can be deserialized to any of the following types in Node or C# functions:

* Object (from JSON)
* String

In C# functions you can also bind to any of the following types:

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

#### Blob trigger C# code example

This C# code example logs the contents of each blob that is added to the monitored container.

```csharp
public static void Run(string myBlob, TraceWriter log)
{
    log.Info($"C# Blob trigger function processed: {myBlob}");
}
```

#### Blob trigger name patterns

You can specify a blob name pattern in the `path` property. For example:

```json
"path": "input/original-{name}",
```

This path would find a blob named *original-Blob1.txt* in the *input* container, and the value of the `name` variable in function code would be `Blob1`.

Another example:

```json
"path": "input/{blobname}.{blobextension}",
```

This path would also find a blob named *original-Blob1.txt*, and the value of the `blobname` and `blobextension` variables in function code would be *original-Blob1* and *txt*.

You can restrict the types of blobs that trigger the function by specifying a pattern with a fixed value for the file extension. If you set the `path` to  *samples/{name}.png*, only *.png* blobs in the *samples* container will trigger the function.

If you need to specify a name pattern for blob names that have curly braces in the name, double the curly braces. For example, if you want to find blobs in the *images* container that have names like this:

		{20140101}-soundfile.mp3

use this for the `path` property:

		images/{{20140101}}-{name}

In the example, the `name` variable value would be *soundfile.mp3*. 

#### Blob receipts

The Azure Functions runtime makes sure that no blob trigger function gets called more than once for the same new or updated blob. It does this by maintaining *blob receipts* in order to determine if a given blob version has been processed.

Blob receipts are stored in a container named *azure-webjobs-hosts* in the Azure storage account specified by the AzureWebJobsStorage connection string. A blob receipt has the following  information:

* The function that was called for the blob ("*{function app name}*.Functions.*{function name}*", for example: "functionsf74b96f7.Functions.CopyBlob")
* The container name
* The blob type ("BlockBlob" or "PageBlob")
* The blob name
* The ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

If you want to force reprocessing of a blob, you can manually delete the blob receipt for that blob from the *azure-webjobs-hosts* container.

#### Handling poison blobs

When a blob trigger function fails, the SDK calls it again, in case the failure was caused by a transient error. If the failure is caused by the content of the blob, the function fails every time it tries to process the blob. By default, the SDK calls a function up to 5 times for a given blob. If the fifth try fails, the SDK adds a message to a queue named *webjobs-blobtrigger-poison*.

The queue message for poison blobs is a JSON object that contains the following properties:

* FunctionId (in the format *{function app name}*.Functions.*{function name}*)
* BlobType ("BlockBlob" or "PageBlob")
* ContainerName
* BlobName
* ETag (a blob version identifier, for example: "0x8D1DC6E70A277EF")

#### Blob polling for large containers

If the blob container that the trigger is monitoring contains more than 10,000 blobs, the Functions runtime scans log files to watch for new or changed blobs. This process is not real-time; a function might not get triggered until several minutes or longer after the blob is created. In addition, [storage logs are created on a "best efforts"](https://msdn.microsoft.com/library/azure/hh343262.aspx) basis; there is no guarantee that all events will be captured. Under some conditions, logs might be missed. If the speed and reliability limitations of blob triggers for large containers are not acceptable for your application, the recommended method is to create a queue message when you create the blob, and use a queue trigger instead of a blob trigger to process the blob.
 
## <a id="storageblobbindings"></a> Azure Storage blob input and output bindings

#### function.json for a storage blob input or output binding

The *function.json* file specifies the following properties.

- `name` : The variable name used in function code for the blob . 
- `path` : A path that specifies the container to read the blob from or write the blob to, and optionally a blob name pattern.
- `connection` : The name of an app setting that contains a storage connection string. If you leave `connection` empty, the binding will work with the default storage connection string for the function app, which is specified by the AzureWebJobsStorage app setting.
- `type` : Must be set to *blob*.
- `direction` : Set to *in* or *out*. 

Example *function.json* for a storage blob input or output binding, using a queue trigger to copy a blob:

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
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "MyStorageConnection",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "MyStorageConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
``` 

#### Blob input and output supported types

The `blob` binding can serialize or deserialize the following types in Node.js or C# functions:

* Object (`out T` in C# for output blob: creates a blob as null object if parameter value is null when the function ends)
* String (`out string` in C# for output blob: creates a blob only if the string parameter is non-null when the function returns)

In C# functions, you can also bind to the following types:

* `TextReader` (input only)
* `TextWriter` (output only)
* `Stream`
* `CloudBlobStream` (output only)
* `ICloudBlob`
* `CloudBlockBlob` 
* `CloudPageBlob` 

#### Blob output C# code example

This C# code example copies a blob whose name is received in a queue message.

```csharp
public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

## <a id="storagetablesbindings"></a> Azure Storage tables input and output bindings

#### function.json for storage tables

The *function.json* specifies the following properties.

- `name` : The variable name used in function code for the table binding. 
- `tableName` : The name of the table.
- `partitionKey` and `rowKey` : Used together to read a single entity in a C# or Node function, or to write a single entity in a Node function.
- `take` : The maximum number of rows to read for table input in a Node function.
- `filter` : OData filter expression for table input in a Node function.
- `connection` : The name of an app setting that contains a storage connection string. If you leave `connection` empty, the binding will work with the default storage connection string for the function app, which is specified by the AzureWebJobsStorage app setting.
- `type` : Must be set to *table*.
- `direction` : Set to *in* or *out*. 

The following example *function.json* uses a queue trigger to read a single table row. The JSON provides a hard-coded partition key value and specifies that the row key comes from the queue message.

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
      "name": "personEntity",
      "type": "table",
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnection",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

#### Storage tables input and output supported types

The `table` binding can serialize or deserialize objects in Node.js or C# functions. The objects will have RowKey and PartitionKey properties. 

In C# functions, you can also bind to the following types:

* `T` where `T` implements `ITableEntity`
* `IQueryable<T>` (input only)
* `ICollector<T>` (output only)
* `IAsyncCollector<T>` (output only)

#### Storage tables binding scenarios

The table binding supports the following scenarios:

* Read a single row in a C# or Node function.

	Set `partitionKey` and `rowKey`. The `filter` and `take` properties are not used in this scenario.

* Read multiple rows in a C# function.

	The Functions runtime provides an `IQueryable<T>` object bound to the table. Type `T` must derive from `TableEntity` or implement `ITableEntity`. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario; you can use the `IQueryable` object to do any filtering required. 

* Read multiple rows in a Node function.

	Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`.

* Write one or more rows in a C# function.

	The Functions runtime provides an `ICollector<T>` or `IAsyncCollector<T>` bound to the table, where `T` specifies the schema of the entities you want to add. Typically, type `T` derives from `TableEntity` or implements `ITableEntity`, but it doesn't have to. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.

#### Storage tables example: Read a single table entity in C# or Node

The following C# code example works with the preceding *function.json* file shown earlier to read a single table entity. The queue message has the row key value and the table entity is read into a type that is defined in the *run.csx* file. The type includes `PartitionKey` and `RowKey` properties and does not derive from `TableEntity`. 

```csharp
public static void Run(string myQueueItem, Person personEntity, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    log.Info($"Name in Person entity: {personEntity.Name}");
}

public class Person
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Name { get; set; }
}
```

The following Node code example also works with the preceding *function.json* file to read a single table entity.

```javascript
module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.log('Person entity name: ' + context.bindings.personEntity.Name);
    context.done();
};
```

#### Storage tables example: Read multiple table entities in C# 

The following *function.json* and C# code example reads entities for a partition key that is specified in the queue message.

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
      "name": "tableBinding",
      "type": "table",
      "connection": "MyStorageConnection",
      "tableName": "Person",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The C# code adds a reference to the Azure Storage SDK so that the entity type can derive from `TableEntity`.

```csharp
#r "Microsoft.WindowsAzure.Storage"
using Microsoft.WindowsAzure.Storage.Table;

public static void Run(string myQueueItem, IQueryable<Person> tableBinding, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    foreach (Person person in tableBinding.Where(p => p.PartitionKey == myQueueItem).ToList())
    {
        log.Info($"Name: {person.Name}");
    }
}

public class Person : TableEntity
{
    public string Name { get; set; }
}
``` 

#### Storage tables example: Create table entities in C# 

The following *function.json* and *run.csx* example shows how to write table entities in C#.

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
      "connection": "MyStorageConnection",
      "name": "tableBinding",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

```csharp
public static void Run(string input, ICollector<Person> tableBinding, TraceWriter log)
{
    for (int i = 1; i < 10; i++)
        {
            log.Info($"Adding Person entity {i}");
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

#### Storage tables example: Create a table entity in Node

The following *function.json* and *run.csx* example shows how to write a table entity in Node.

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
      "tableName": "Person",
      "partitionKey": "Test",
      "rowKey": "{queueTrigger}",
      "connection": "MyStorageConnection",
      "name": "personEntity",
      "type": "table",
      "direction": "out"
    }
  ],
  "disabled": true
}
```

```javascript
module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    context.bindings.personEntity = {"Name": "Name" + myQueueItem }
    context.done();
};
```

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)] 
