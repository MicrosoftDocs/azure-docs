<properties
	pageTitle="Azure Functions triggers and bindings | Microsoft Azure"
	description="Understand how to use triggers and bindings in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="04/07/2016"
	ms.author="chrande"/>

# Azure Functions triggers and bindings developer reference

This article explains how to configure and code triggers and bindings in Azure Functions. Most of these bindings are easily managed via the Azure portal's **Integrate** UI, but the portal doesn't explain all of the functionality and options for each binding.

This article assumes that you've already read the [Azure Functions developer reference](functions-reference.md) and the [C#](functions-reference-csharp.md) or [Node](functions-reference-node.md) developer reference articles.

## HTTP and WebHook triggers and bindings

You can use an HTTP or WebHook trigger to call a function in response to an HTTP request. The request must include an API key, which is currently only available in the Azure portal UI. 

The function URL is a combination of the function app URL and the function name:

```
 https://{function app name}.azurewebsites.net/api/{function name} 
```

The *function.json* file provides properties that pertain to the HTTP request and response.

Properties for the HTTP request:

- `name` : Variable name used in function code for the request object (or the request body in the case of Node.js functions).
- `type` : Must be set to *httpTrigger*.
- `direction` : Must be set to *in*. 
- `webHookType` : For WebHook triggers, valid values are *github*, *slack*, and *genericJson*. For an HTTP trigger that isn't a WebHook, set this property to an empty string. For more information on WebHooks, see the following [WebHook triggers](#webhook-triggers) section.
- `authLevel` : Doesn't apply to WebHook triggers. Set to "function" to require the API key, "anonymous" to drop the API key requirement, or "admin" to require the master API key. See [API keys](#apikeys) below for more information.

Properties for the HTTP response:

- `name` : Variable name used in function code for the response object.
- `type` : Must be set to *http*.
- `direction` : Must be set to *out*. 
 
Example *function.json*:

```json
{
  "bindings": [
    {
      "webHookType": "",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
      "authLevel": "function"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

### WebHook triggers

A WebHook trigger is an HTTP trigger that has the following features designed for WebHooks:

* For specific WebHook providers (currently GitHub and Slack are supported), the Functions runtime validates the provider's signature.
* For Node.js functions, the Functions runtime provides the request body instead of the request object. There is no special handling for C# functions, because you control what is provided by specifying the parameter type. If you specify `HttpRequestMessage` you get the request object. If you specify a POCO type, the Functions runtime tries to parse a JSON object in the body of the request to populate the object properties.
* To trigger a WebHook function the HTTP request must include an API key. For non-WebHook HTTP triggers,  this requirement is optional.

For information about how to set up a GitHub WebHook, see [GitHub Developer - Creating WebHooks](http://go.microsoft.com/fwlink/?LinkID=761099&clcid=0x409).

### API keys

By default, an API key must be included with an HTTP request to trigger an HTTP or WebHook function. The key can be included in a query string variable named `code`, or it can be included in an `x-functions-key` HTTP header. For non-WebHook functions, you can indicate that an API key is not required by setting the `authLevel` property to "anonymous" in the *function.json* file.

You can find API key values in the *D:\home\data\Functions\secrets* folder in the file system of the function app.  The master key and function key are set in the *host.json* file, as shown in this example. 

```json
{
  "masterKey": "K6P2VxK6P2VxK6P2VxmuefWzd4ljqeOOZWpgDdHW269P2hb7OSJbDg==",
  "functionKey": "OBmXvc2K6P2VxK6P2VxK6P2VxVvCdB89gChyHbzwTS/YYGWWndAbmA=="
}
```

The function key from *host.json* can be used to trigger any function but won't trigger a disabled function. The master key can be used to trigger any function and will trigger a function even if it's disabled. You can configure a function to require the master key by setting the `authLevel` property to "admin". 

If the *secrets* folder contains a JSON file with the same name as a function, the `key` property in that file can also be used to trigger the function, and this key will only work with the function it refers to. For example, the API key for a function named `HttpTrigger` is specified in *HttpTrigger.json* in the *secrets* folder. Here is an example:

```json
{
  "key":"0t04nmo37hmoir2rwk16skyb9xsug32pdo75oce9r4kg9zfrn93wn4cx0sxo4af0kdcz69a4i"
}
```

> [AZURE.NOTE] When you're setting up a WebHook trigger, don't share the master key with the WebHook provider. Use a key that will only work with the function that processes the WebHook.  The master key can be used to trigger any function, even disabled functions.

### Example C# code for an HTTP trigger function 

The example code looks for a `name` parameter either in the query string or the body of the HTTP request.

```csharp
using System.Net;
using System.Threading.Tasks;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");

    // parse query parameter
    string name = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
        .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    name = name ?? data?.name;

    return name == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
        : req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
}
```

### Example Node.js code for an HTTP trigger function 

This example code looks for a `name` parameter either in the query string or the body of the HTTP request.

```javascript
module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};
```

### Example C# code for a GitHub WebHook function 

This example code logs GitHub issue comments.

```csharp
#r "Newtonsoft.Json"

using System;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;

public static async Task<object> Run(HttpRequestMessage req, TraceWriter log)
{
    string jsonContent = await req.Content.ReadAsStringAsync();
    dynamic data = JsonConvert.DeserializeObject(jsonContent);

    log.Info($"WebHook was triggered! Comment: {data.comment.body}");

    return req.CreateResponse(HttpStatusCode.OK, new {
        body = $"New GitHub comment: {data.comment.body}"
    });
}
```

### Example Node.js code for a GitHub WebHook function 

This example code logs GitHub issue comments.

```javascript
module.exports = function (context, data) {
    context.log('GitHub WebHook triggered!', data.comment.body);
    context.res = { body: 'New GitHub comment: ' + data.comment.body };
    context.done();
};
```

## Timer trigger

The *function.json* file provides a schedule expression and a switch that indicates whether the function should be triggered immediately.

```json
{
  "bindings": [
    {
      "schedule": "0 * * * * *",
      "runOnStartup": true,
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The timer trigger handles multi-instance scale-out automatically: only a single instance of a particular timer function will be running across all instances.

### Format of schedule expression

The schedule expression can be a [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that includes 6 fields:  {second} {minute} {hour} {day} {month} {day of the week}. Many of the cron expression documents you find online omit the {second} field, so if you copy from one of those you'll have to adjust for the extra field. 

The schedule expression may also be in the format *hh:mm:ss* to specify the delay between each time the function is triggered. 

Here are some schedule expression examples.

To trigger once every 5 minutes:

```json
"schedule": "0 */5 * * * *",
"runOnStartup": false,
```

To trigger immediately and then every two hours thereafter:

```json
"schedule": "0 0 */2 * * *",
"runOnStartup": true,
```

To trigger every 15 seconds:

```json
"schedule": "00:00:15",
"runOnStartup": false,
```

### Timer trigger C# code example

This C# code example writes a single log each time the function is triggered.

```csharp
public static void Run(TimerInfo myTimer, TraceWriter log)
{
    log.Info($"C# Timer trigger function executed at: {DateTime.Now}");    
}
```

## Azure Storage (queues, blobs, tables) triggers and bindings

This section contains the following subsections:

* [Azure Storage connection property in function.json](#storageconnection)
* [Azure Storage queue trigger](#storagequeuetrigger)
* [Azure Storage queue output binding](#storagequeueoutput)
* [Azure Storage blob trigger](#storageblobtrigger)
* [Azure Storage blob input and output bindings](#storageblobbindings)
* [Azure Storage tables input and output bindings](#storagetablesbindings)

### <a id="storageconnection"></a> Azure Storage connection property in function.json

For all Azure Storage triggers and bindings, the *function.json* file includes a `connection` property. For example:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myQueueItem",
            "type": "queueTrigger",
            "direction": "in",
            "queueName": "myqueue-items",
            "connection":""
        }
    ]
}
```

If you leave `connection` empty, the trigger or binding will work with the default storage account for the function app. If you want the trigger or binding to work with a different storage account, create an app setting in the function app that points to the storage account you want to use, and set `connection` to the app setting name. To add an app setting, follow these steps:

1. On the **Function app** blade of the Azure portal, click **Function App Settings > Go to App Service settings**.

2. In the **Settings** blade, click **Application Settings**.

3. Scroll down to the **App settings** section, and add an entry with **Key** = *{some unique value of your choice}* and **Value** = the connection string for the storage account.

### <a id="storagequeuetrigger"></a> Azure Storage queue trigger

The *function.json* file provides the name of the queue to poll and the variable name for the queue message. For example:

```json
{
    "disabled": false,
    "bindings": [
        {
            "name": "myQueueItem",
            "type": "queueTrigger",
            "direction": "in",
            "queueName": "myqueue-items",
            "connection":""
        }
    ]
}
```

#### Queue trigger supported types

The queue message can be deserialized to any of these types:

* `string`
* `byte[]`
* JSON object   
* `CloudQueueMessage`

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

### <a id="storagequeueoutput"></a> Azure Storage queue output binding

The *function.json* file provides the name of the output queue and a variable name for the content of the message. This example uses a queue trigger and writes a queue message.

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
      "type": "queue",
      "queueName": "samples-workitems-out",
      "connection": "MyStorageConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
``` 

#### Queue output binding supported types

The `queue` binding can serialize the following types to a queue message:

* `string` (creates queue message if parameter value is non-null when the function ends)
* `byte[]` (works like string) 
* `CloudQueueMessage` (works like string) 
* JSON object (creates a message with a null object if the parameter is null when the function ends)

#### Queue output binding code example

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

### <a id="storageblobtrigger"></a> Azure Storage blob trigger

The *function.json* provides a path that specifies the container to monitor, and optionally a blob name pattern. This example triggers on any blobs that are added to the samples-workitems container.

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

> [AZURE.NOTE] If the blob container that the trigger is monitoring contains more than 10,000 blobs, the Functions runtime scans log files to watch for new or changed blobs. This process is not real-time; a function might not get triggered until several minutes or longer after the blob is created. In addition, [storage logs are created on a "best efforts"](https://msdn.microsoft.com/library/azure/hh343262.aspx) basis; there is no guarantee that all events will be captured. Under some conditions, logs might be missed. If the speed and reliability limitations of blob triggers for large containers are not acceptable for your application, the recommended method is to create a queue message when you create the blob, and use a queue trigger instead of a blob trigger to process the blob.

#### Blob trigger supported types

Blobs can be deserialized to these types:

* string
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

This C# code example logs the contents of each blob that is added to the container.

```csharp
public static void Run(string myBlob, TraceWriter log)
{
    log.Info($"C# Blob trigger function processed: {myBlob}");
}
```

#### Blob trigger name patterns

You can specify a blob name pattern in the `path`. For example:

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

### <a id="storageblobbindings"></a> Azure Storage blob input and output bindings

The *function.json* provides the name of the container and variable names for blob name and content. This example uses a queue trigger to copy a blob:

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

The `blob` binding can serialize or deserialize the following types:

* `Stream`
* `TextReader`
* `TextWriter`
* `string` (for output blob: creates a blob only if the string parameter is non-null when the function returns)
* JSON object (for output blob: creates a blob as null object if parameter value is null when the function ends)
* `CloudBlobStream` (output only)
* `ICloudBlob`
* `CloudBlockBlob` 
* `CloudPageBlob` 

#### Blob output C# code example

This C# code example copies a blob whose name is received in a queue message.

```CSHARP
public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, TraceWriter log)
{
    log.Info($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

### <a id="storagetablesbindings"></a> Azure Storage tables input and output bindings

The *function.json* for storage tables provides several properties:

* `name` - The name of the variable to use in code for the table binding.
* `tableName`
* `partitionKey` and `rowKey` - Used together to read a single entity in a C# or Node function, or to write a single entity in a Node function.
* `take` - The maximum number of rows to read for table input in a Node function.
* `filter` - OData filter expression for table input in a Node function.

These properties support the following scenarios:

* Read a single row in a C# or Node function.

	Set `partitionKey` and `rowKey`. The `filter` and `take` properties are not used in this scenario.

* Read multiple rows in a C# function.

	The Functions runtime provides an `IQueryable<T>` object bound to the table. Type `T` must derive from `TableEntity` or implement `ITableEntity`. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario; you can use the `IQueryable` object to do any filtering required. 

* Read multiple rows in a Node function.

	Set the `filter` and `take` properties. Don't set `partitionKey` or `rowKey`.

* Write one or more rows in a C# function.

	The Functions runtime provides an `ICollector<T>` or `IAsyncCollector<T>` bound to the table, where `T` specifies the schema of the entities you want to add. Typically, type `T` derives from `TableEntity` or implements `ITableEntity`, but it doesn't have to. The `partitionKey`, `rowKey`, `filter`, and `take` properties are not used in this scenario.

#### Read a single table entity in C# or Node

This *function.json* example uses a queue trigger to read a single table row, with a hard-coded partition key value and the row key provided in the queue message.

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
The following C# code example works with the preceding *function.json* file to to read a single table entity. The queue message has the row key value and the table entity is read into a type that is defined in the *run.csx* file. The type includes `PartitionKey` and `RowKey` properties and does not derive from `TableEntity`. 

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

#### Read multiple table entities in C# 

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

#### Create table entities in C# 

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

#### Create a table entity in Node

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

## Azure Service Bus triggers and bindings

This section contains the following subsections:

* [Azure Service Bus: PeekLock behavior](#sbpeeklock)
* [Azure Service Bus: poison message handling](#sbpoison)
* [Azure Service Bus: single-threading](#sbsinglethread)
* [Azure Service Bus queue or topic trigger](#sbtrigger)
* [Azure Storage Bus queue or topic output binding](#sboutput)

### <a id="sbpeeklock"></a> Azure Service Bus: PeekLock behavior

The Functions runtime receives a message in `PeekLock` mode and calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed.

### <a id="sbpoison"></a> Azure Service Bus: poison message handling

Service Bus does its own poison message handling which can't be controlled or configured in Azure Functions configuration or code. 

### <a id="sbsinglethread"></a> Azure Service Bus: single-threading

By default the Functions runtime processes multiple queue messages concurrently. To direct the runtime to process only a single queue or topic message at a time, set `serviceBus.maxConcurrrentCalls` to 1 in the *host.json* file. For information about the *host.json* file, see [Folder Structure](functions-reference.md#folder-structure) in the Developer reference article, and [host.json](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json) in the WebJobs.Script repository wiki.

### <a id="sbtrigger"></a> Azure Service Bus queue or topic trigger

The *function.json* file for a Service Bus trigger specifies the following properties.

- `name` : The variable name used in function code for the queue or topic, or the queue or topic message. 
- `queueName` : For queue trigger only, the name of the queue to poll.
- `topicName` : For topic trigger only, the name of the topic to poll.
- `subscriptionName` : For topic trigger only, the subscription name.
- `connection` : The name of an app setting that contains a Service Bus connection string. The connection string must be for a Service Bus namespace, not limited to a specific queue or topic. If the connection string doesn't have manage rights, set the `accessRights` property. If you leave `connection` empty, the trigger or binding will work with the default Service Bus connection string for the function app, which is specified by the AzureWebJobsServiceBus app setting.
- `accessRights` : Specifies the access rights available for the connection string. Default value is `manage`. Set to `listen` if you're using a connection string that doesn't provide manage permissions. Otherwise the Functions runtime might try and fail to do operations that require manage rights.
- `type` : Must be set to *serviceBusTrigger*.
- `direction` : Must be set to *in*. 

The Service Bus queue message can be deserialized to any of the following types:

* Object (from JSON)
* string
* byte array 
* `BrokeredMessage` (C#) 

#### *Function.json* example for using a Service Bus queue trigger

```json
{
  "bindings": [
    {
      "queueName": "testqueue",
      "connection": "MyServiceBusConnection",
      "name": "myQueueItem",
      "type": "serviceBusTrigger",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

#### C# code example that processes a Service Bus queue message

```csharp
public static void Run(string myQueueItem, TraceWriter log)
{
    log.Info($"C# ServiceBus queue trigger function processed message: {myQueueItem}");
}
```

#### Node.js code example that processes a Service Bus queue message

```javascript
module.exports = function(context, myQueueItem) {
    context.log('Node.js ServiceBus queue trigger function processed message', myQueueItem);
    context.done();
};
```

### <a id="sboutput"></a> Azure Service Bus queue or topic output

The *function.json* file for a Service Bus output binding specifies the following properties.

- `name` : The variable name used in function code for the queue or queue message. 
- `queueName` : For queue trigger only, the name of the queue to poll.
- `topicName` : For topic trigger only, the name of the topic to poll.
- `subscriptionName` : For topic trigger only, the subscription name.
- `connection` : Same as for Service Bus trigger.
- `accessRights` : Specifies the access rights available for the connection string. Default value is `manage`. Set to `send` if you're using a connection string that doesn't provide manage permissions. Otherwise the Functions runtime might try and fail to do operations that require manage rights, such as creating queues.
- `type` : Must be set to *serviceBus*.
- `direction` : Must be set to *out*. 

Azure Functions can create a Service Bus queue message from any of the following types.

* Object (always creates a JSON message, creates the message with a null object if the value is null when the function ends)
* string (creates a message if the value is non-null when the function ends)
* byte array (works like string) 
* `BrokeredMessage` (C#, works like string)

For creating multiple messages in a C# function, you can use `ICollector<T>` or `IAsyncCollector<T>`. A message is created when you call the `Add` method.

#### *function.json* example for using a timer trigger to write Service Bus queue messages

```JSON
{
  "bindings": [
    {
      "schedule": "0/15 * * * * *",
      "name": "myTimer",
      "runsOnStartup": true,
      "type": "timerTrigger",
      "direction": "in"
    },
    {
      "name": "outputSbQueue",
      "type": "serviceBus",
      "queueName": "testqueue",
      "connection": "MyServiceBusConnection",
      "direction": "out"
    }
  ],
  "disabled": false
}
``` 

#### C# code examples that create Service Bus queue messages

```csharp
public static void Run(TimerInfo myTimer, TraceWriter log, out string outputSbQueue)
{
	string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue = message;
}
```

```csharp
public static void Run(TimerInfo myTimer, TraceWriter log, ICollector<string> outputSbQueue)
{
	string message = $"Service Bus queue message created at: {DateTime.Now}";
    log.Info(message); 
    outputSbQueue.Add("1 " + message);
    outputSbQueue.Add("2 " + message);
}
```

#### Node.js code example that creates a Service Bus queue message

```javascript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if(myTimer.isPastDue)
    {
        context.log('Node.js is running late!');
    }
    var message = 'Service Bus queue message created at ' + timeStamp;
    context.log(message);   
    context.bindings.outputSbQueueMsg = message;
    context.done();
};
```

## Azure DocumentDB bindings

This section contains the following subsections:

* [Azure DocumentDB input binding](#docdbinput)
* [Azure DocumentDB output binding](#docdboutput)

### <a id="docdbinput"></a> Azure DocumentDB input binding

Input bindings can load a document from a DocumentDB collection and pass it directly to your binding. The document id can be determined based on the trigger that invoked the function. In a C# function, any changes made to the record will be automatically sent back to the collection when the function exits successfully.

The function.json file provides the following properties for use with DocumentDB input binding:

- `name` : Variable name used in function code for the document.
- `type` : must be set to "documentdb".
- `databaseName` : The database containing the document.
- `collectionName` : The collection containing the document.
- `id` : The Id of the document to retrieve. This property supports bindings similar to "{queueTrigger}", which will use the string value of the queue message as the document Id.
- `connection` : This string must be an Application Setting set to the endpoint for your DocumentDB account. If you choose your account from the Integrate tab, a new App setting will be created for you with a name that takes the following form, yourAccount_DOCUMENTDB. If you need to manually create the App setting, the actual connection string must take the following form, AccountEndpoint=<Endpoint for your account>;AccountKey=<Your primary access key>;.
- `direction  : must be set to *"in"*.

Example function.json:
 
	{
	  "bindings": [
	    {
	      "name": "document",
	      "type": "documentdb",
	      "databaseName": "MyDatabase",
	      "collectionName": "MyCollection",
	      "id" : "{queueTrigger}",
	      "connection": "MyAccount_DOCUMENTDB",     
	      "direction": "in"
	    }
	  ],
	  "disabled": false
	}

#### Azure DocumentDB input code example for a C# queue trigger
 
Using the example function.json above, the DocumentDB input binding will retrieve the document with the id that matches the queue message string and pass it to the 'document' parameter. If that document is not found, the 'document' parameter will be null. The document is then updated with the new text value when the function exits.
 
	public static void Run(string myQueueItem, dynamic document)
	{   
	    document.text = "This has changed.";
	}

#### Azure DocumentDB input code example for a Node.js queue trigger
 
Using the example function.json above, the DocumentDB input binding will retrieve the document with the id that matches the queue message string and pass it to the `documentIn` binding property. In Node.js functions, updated documents are not sent back to the collection. However, you can pass the input binding directly to a DocumentDB output binding named `documentOut` to support updates. This code example updates the text property of the input document and sets it as the output document.
 
	module.exports = function (context, input) {   
	    context.bindings.documentOut = context.bindings.documentIn;
	    context.bindings.documentOut.text = "This was updated!";
	    context.done();
	};

### <a id="docdboutput"></a> Azure DocumentDB output bindings

Your functions can write JSON documents to an Azure DocumentDB database using the **Azure DocumentDB Document** output binding. For more information on Azure DocumentDB review the [Introduction to DocumentDB](../documentdb/documentdb-introduction.md) and the [Getting Started tutorial](../documentdb/documentdb-get-started.md).

The function.json file provides the following properties for use with DocumentDB output binding:

- `name` : Variable name used in function code for the new document.
- `type` : must be set to *"documentdb"*.
- `databaseName` : The database containing the collection where the new document will be created.
- `collectionName` : The collection where the new document will be created.
- `createIfNotExists` : This is a boolean value to indicate whether the collection will be created if it does not exist. The default is *false*. The reason for this is new collections are created with reserved throughput, which has pricing implications. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).
- `connection` : This string must be an **Application Setting** set to the endpoint for your DocumentDB account. If you choose your account from the **Integrate** tab, a new App setting will be created for you with a name that takes the following form, `yourAccount_DOCUMENTDB`. If you need to manually create the App setting, the actual connection string must take the following form, `AccountEndpoint=<Endpoint for your account>;AccountKey=<Your primary access key>;`. 
- `direction` : must be set to *"out"*. 
 
Example function.json:

	{
	  "bindings": [
	    {
	      "name": "document",
	      "type": "documentdb",
	      "databaseName": "MyDatabase",
	      "collectionName": "MyCollection",
	      "createIfNotExists": false,
	      "connection": "MyAccount_DOCUMENTDB",
	      "direction": "out"
	    }
	  ],
	  "disabled": false
	}


#### Azure DocumentDB output code example for a Node.js queue trigger

	module.exports = function (context, input) {
	   
	    context.bindings.document = {
	        text : "I'm running in a Node function! Data: '" + input + "'"
	    }   
	 
	    context.done();
	};

The output document:

	{
	  "text": "I'm running in a Node function! Data: 'example queue data'",
	  "id": "01a817fe-f582-4839-b30c-fb32574ff13f"
	}
 

#### Azure DocumentDB output code example for a C# queue trigger


	using System;

	public static void Run(string myQueueItem, out object document, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
	   
	    document = new {
	        text = $"I'm running in a C# function! {myQueueItem}"
	    };
	}


#### Azure DocumentDB output code example setting file name

If you want to set the name of the document in the function, just set the `id` value.  For example, if JSON content for an employee was being dropped into the queue similar to the following:

	{
	  "name" : "John Henry",
      "employeeId" : "123456",
	  "address" : "A town nearby"
	}

You could use the following C# code in a queue trigger function: 
	
	#r "Newtonsoft.Json"
	
	using System;
	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	
	public static void Run(string myQueueItem, out object employeeDocument, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
	    
	    dynamic employee = JObject.Parse(myQueueItem);
	    
	    employeeDocument = new {
	        id = employee.name + "-" + employee.employeeId,
	        name = employee.name,
	        employeeId = employee.employeeId,
	        address = employee.address
	    };
	}

Example output:

	{
	  "id": "John Henry-123456",
	  "name": "John Henry",
	  "employeeId": "123456",
	  "address": "A town nearby"
	}

## Azure Mobile Apps easy tables bindings

Azure App Service Mobile Apps lets you expose table endpoint data to mobile clients. This same tabular data can be used in both input and output bindings with Azure Functions. When you have a Node.js backend mobile app, you can work with this tabular data in the Azure portal using *easy tables*. Easy tables supports dynamic schema so that columns are added automatically to match the shape of the data being inserted, simplifying schema development. Dynamic schema is enabled by default and should be disabled in a production mobile app. For more information on easy tables in Mobile Apps, see [How to: Work with easy tables in the Azure portal](../app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk.md#in-portal-editing). Note that easy tables in the portal are not currently supported for .NET backend mobile apps. You can still use .NET backend mobile app table endpoints function bindings, however dynamic schema is not supported .NET backend mobile apps.

This section contains the following subsections:

* [Azure Mobile Apps easy tables API key](#easytablesapikey)
* [Azure Mobile Apps easy tables input binding](#easytablesinput)
* [Azure Mobile Apps easy tables output binding](#easytablesoutput)

### <a id="easytablesapikey"></a> Use an API key to secure access to your Mobile Apps easy tables endpoints.

Azure Functions currently cannot access endpoints secured by App Service authentication. This means that any Mobile Apps endpoints used in your functions with easy tables bindings must allow anonymous access, which is the default. Easy tables bindings let you specify an API key, which is a shared secret that can be used to prevent unwanted access from apps other than your functions. Mobile Apps does not have built-in support for API key authentication. However, you can implement an API key in your Node.js backend mobile app by following the examples in [Azure App Service Mobile Apps backend implementing an API key](https://github.com/Azure/azure-mobile-apps-node/tree/master/samples/api-key).

>[AZURE.IMPORTANT] This API key must not be distributed with your mobile app clients, it should only be distributed securely to service-side clients, like Azure Functions.

### <a id="easytablesinput"></a> Azure Mobile Apps easy tables input binding

Input bindings can load a record from a Mobile Apps table endpoint and pass it directly to your binding. The record ID is determined based on the trigger that invoked the function. In a C# function, any changes made to the record are automatically sent back to the table when the function exits successfully.

The function.json file supports the following properties for use with Mobile Apps easy table input bindings:

- `name` : Variable name used in function code for the new record.
- `type` : Biding type must be set to *easyTable*.
- `tableName` : The table where the new record will be created.
- `id` : The ID of the record to retrieve. This property supports bindings similar to `{queueTrigger}`, which will use the string value of the queue message as the record Id.
- `apiKey` : String that is the application setting that specifies the optional API key for the mobile app. This is required when your mobile app uses an API key to restrict client access.
- `connection` : String that is the application setting that specifies the URI of your mobile app.
- `direction` : Binding direction, which must be set to *in*.

Example function.json:

	{
	  "bindings": [
	    {
	      "name": "record",
	      "type": "easyTable",
	      "tableName": "MyTable",
	      "id" : "{queueTrigger}",
	      "connection": "My_MobileApp_Uri",
	      "apiKey": "My_MobileApp_Key",
	      "direction": "in"
	    }
	  ],
	  "disabled": false
	}

#### Azure Mobile Apps easy tables code example for a C# queue trigger

Based on the example function.json above, the input binding retrieves the record with the ID that matches the queue message string and passes it to the *record* parameter. When the record is not found, the parameter is null. The record is then updated with the new *Text* value when the function exits.

	#r "Newtonsoft.Json"	
	using Newtonsoft.Json.Linq;
	
	public static void Run(string myQueueItem, JObject record)
	{
	    if (record != null)
	    {
	        record["Text"] = "This has changed.";
	    }    
	}

#### Azure Mobile Apps easy tables code example for a Node.js queue trigger

Based on the example function.json above, the input binding retrieves the record with the ID that matches the queue message string and passes it to the *record* parameter. In Node.js functions, updated records are not sent back to the table. This code example writes the retrieved record to the log.

	module.exports = function (context, input) {    
	    context.log(context.bindings.record);
	    context.done();
	};


### <a id="easytablesoutput"></a> Azure Mobile Apps easy tables output binding

Your function can write a record to a Mobile Apps table endpoint using an easy table output binding. 

The function.json file supports the following properties for use with Easy Table output binding:

- `name` : Variable name used in function code for the new record.
- `type` : Binding type that must be set to *easyTable*.
- `tableName` : The table where the new record is created.
- `apiKey` : String that is the application setting that specifies the optional API key for the mobile app. This is required when your mobile app uses an API key to restrict client access.
- `connection` : String that is the application setting that specifies the URI of your mobile app.
- `direction` : Binding direction, which must be set to *out*.

Example function.json:

	{
	  "bindings": [
	    {
	      "name": "record",
	      "type": "easyTable",
	      "tableName": "MyTable",
	      "connection": "My_MobileApp_Uri",
	      "apiKey": "My_MobileApp_Key",
	      "direction": "out"
	    }
	  ],
	  "disabled": false
	}

#### Azure Mobile Apps easy tables code example for a C# queue trigger

This C# code example inserts a new record with a *Text* property into the table specified in the above binding.

	public static void Run(string myQueueItem, out object record)
	{
	    record = new {
	        Text = $"I'm running in a C# function! {myQueueItem}"
	    };
	}

#### Azure Mobile Apps easy tables code example for a Node.js queue trigger

This Node.js code example inserts a new record with a *text* property into the table specified in the above binding.

	module.exports = function (context, input) {
	
	    context.bindings.record = {
	        text : "I'm running in a Node function! Data: '" + input + "'"
	    }   
	
	    context.done();
	};

## Azure Notification Hub output binding

Your functions can send push notifications using a configured Azure Notification Hub with a very few lines of code. However, the notification hub must be configured for the Platform Notifications Services (PNS) you want to use. For more information on configuring an Azure Notification Hub and developing a client applications that register for notifications, see [Getting started with Notification Hubs](../notification-hubs/notification-hubs-windows-store-dotnet-get-started.md) and click your target client platform at the top.

The function.json file provides the following properties for use with a notification hub output binding:

- `name` : Variable name used in function code for the notification hub message.
- `type` : must be set to *"notificationHub"*.
- `tagExpression` : Tag expressions allow you to specify that notifications be delivered to a set of devices who have registered to receive notifications that match the tag expression.  For more information, see [Routing and tag expressions](../notification-hubs/notification-hubs-routing-tag-expressions.md).
- `hubName` : Name of the notification hub resource in the Azure portal.
- `connection` : This connection string must be an **Application Setting** connection string set to the *DefaultFullSharedAccessSignature* value for your notification hub.
- `direction` : must be set to *"out"*. 
 
Example function.json:

	{
	  "bindings": [
	    {
	      "name": "notification",
	      "type": "notificationHub",
	      "tagExpression": "",
	      "hubName": "my-notification-hub",
	      "connection": "MyHubConnectionString",
	      "direction": "out"
	    }
	  ],
	  "disabled": false
	}

### Azure Notification Hub connection string setup

To use a Notification hub output binding you must configure the connection string for the hub. You can do this on the *Integrate* tab by simply selecting your notification hub or creating a new one. 

You can also manually add a connection string for an existing hub by adding a connection string for the *DefaultFullSharedAccessSignature* to your notification hub. This connection string provides your function access permission to send notification messages. The *DefaultFullSharedAccessSignature* connection string value can be accessed from the **keys** button in the main blade of your notification hub resource in the Azure portal. To manually add a connection string for your hub, use the following steps: 

1. On the **Function app** blade of the Azure portal, click **Function App Settings > Go to App Service settings**.

2. In the **Settings** blade, click **Application Settings**.

3. Scroll down to the **Connection strings** section, and add an named entry for *DefaultFullSharedAccessSignature* value for you notification hub. Change the type to **Custom**.
4. Reference your connection string name in the output bindings. Similar to **MyHubConnectionString** used in the example above.

### Azure Notification Hub code example for a Node.js timer trigger 

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates.md) that contains `location` and `message`.

	module.exports = function (context, myTimer) {
	    var timeStamp = new Date().toISOString();
	   
	    if(myTimer.isPastDue)
	    {
	        context.log('Node.js is running late!');
	    }
	    context.log('Node.js timer trigger function ran!', timeStamp);  
	    context.bindings.notification = {
	        location: "Redmond",
	        message: "Hello from Node!"
	    };
	    context.done();
	};

### Azure Notification Hub code example for a C# queue trigger

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates.md) that contains `message`.


	using System;
	using System.Threading.Tasks;
	using System.Collections.Generic;
	 
	public static void Run(string myQueueItem,  out IDictionary<string, string> notification, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
        notification = GetTemplateProperties(myQueueItem);
	}
	 
	private static IDictionary<string, string> GetTemplateProperties(string message)
	{
	    Dictionary<string, string> templateProperties = new Dictionary<string, string>();
	    templateProperties["message"] = message;
	    return templateProperties;
	}

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates.md) that contains `message` using a valid JSON string.

	using System;
	 
	public static void Run(string myQueueItem,  out string notification, TraceWriter log)
	{
		log.Info($"C# Queue trigger function processed: {myQueueItem}");
		notification = "{\"message\":\"Hello from C#. Processed a queue item!\"}";
	}

### Azure Notification Hub queue trigger C# code example using Notification type

This example shows how to use the `Notification` type that is defined in the [Microsoft Azure Notification Hubs Library](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/). In order to use this type, and the library, you must upload a *project.json* file for your function app. The project.json file is a JSON text file which will look similar to the follow:

	{
	  "frameworks": {
	    ".NETFramework,Version=v4.6": {
	      "dependencies": {
	        "Microsoft.Azure.NotificationHubs": "1.0.4"
	      }
	    }
	  }
	}

For more information on uploading your project.json file, see [uploading a project.json file](http://stackoverflow.com/questions/36411536/how-can-i-use-nuget-packages-in-my-azure-functions).

Example code:

	using System;
	using System.Threading.Tasks;
	using Microsoft.Azure.NotificationHubs;
	 
	public static void Run(string myQueueItem,  out Notification notification, TraceWriter log)
	{
	   log.Info($"C# Queue trigger function processed: {myQueueItem}");
	   notification = GetTemplateNotification(myQueueItem);
	}
	private static TemplateNotification GetTemplateNotification(string message)
	{
	    Dictionary<string, string> templateProperties = new Dictionary<string, string>();
	    templateProperties["message"] = message;
	    return new TemplateNotification(templateProperties);
	}

## Next steps

For more information, see the following resources:

* [Azure Functions developer reference](functions-reference.md)
* [Azure Functions C# developer reference](functions-reference-csharp.md)
* [Azure Functions NodeJS developer reference](functions-reference-node.md)
