<properties
	pageTitle="Azure Functions developer reference | Microsoft Azure"
	description="Understand how Azure Functions are developed and configured using triggers and bindings and a domain-specific language."
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
	ms.date="03/23/2016"
	ms.author="chrande"/>

# Azure Functions developer reference

## Core concepts

Azure Functions share a few core technical concepts, regardless of the language you choose. Before you jump into learning about how your language of choice works, be sure to read through these core concepts.

This article assumes that you've already read the [Azure Functions overview](functions-overview.md) and are familiar with [WebJobs SDK concepts such as triggers, bindings, and the JobHost runtime](../app-service-web/websites-dotnet-webjobs-sdk.md). Azure Functions is based on the WebJobs SDK. 

### function

A *function* is the primary concept in Azure Functions. You write code for a function in a language of your choice and save the code file(s) and a configuration file in the same folder. Configuration is in JSON, and the file is named `function.json`. A variety of languages are supported, and each one has a slightly different experience optimized to work best for that language. Sample folder structure:

```
mynodefunction
| - function.json
| - index.js
| - node_modules
| | - ... packages ...
| - package.json
mycsharpfunction
| - function.json
| - run.csx
```

### function.json and bindings

The `function.json` file contains configuration specific to a function, including its bindings. The runtime reads this file to determine which events to trigger off of, which data to include when calling the function, and where to send data passed along from the function itself. 

```JSON
{
    "disabled":false,
    "bindings":[
        // ... bindings here
        {
            "type": "bindingType",
            "direction": "in",
            "name": "myParamName",
            // ... more depending on binding
        }
    ]
}
```
You can prevent the runtime from running the function by setting the `disabled` property to `true`.

The `bindings` property is where you configure both triggers and bindings. Each binding shares a few common settings and some settings which are specific to a particular type of binding. Every binding requires the following settings:

|Property|Values/Types|Comments|
|---|-----|------|
|`type`|string|Binding type. For example, `queueTrigger`.
|`direction`|'in', 'out'| Indicates whether the binding is for receiving data into the function or sending data from the function.
| `name` | string | The name that will be used for the bound data in the function. For C# this will be an argument name; for JavaScript it will be the key in a key/value list.

### Runtime (script host and web host)

The runtime, otherwise known as the script host, is the underlying WebJobs SDK host which listens for events, gathers and sends data, and ultimately runs your code. 

To facilitate HTTP triggers, there is also a web host which is designed to sit in front of the script host in production scenarios. This helps to isolate the script host from the front end traffic managed by the web host.

### Folder Structure

A script host points to a folder that contains a configuration file and one or more functions.

```
parentFolder (for example, wwwroot)
 | - host.json
 | - mynodefunction
 | | - function.json
 | | - index.js
 | | - node_modules
 | | | - ... packages ...
 | | - package.json
 | - mycsharpfunction
 | | - funciton.json
 | | - run.csx
```

The *host.json* file contains some script host specific configuration and sits in the parent folder.

Each function has a folder that contains code file(s), *function.json*, and other dependencies.

When setting up a project for deploying functions to a function app in Azure App Service, you can treat this folder structure as your site code. You can use existing tools like continuous integration and deployment, or custom deployment scripts for doing deploy time package installation or code transpilation.

### Parallel execution

When multiple triggering events occur faster than a single function instance can process them, The Azure Functions runtime may call multiple instances of the function. If a function app is using the [Dynamic Hosting Plan](functions-scale.md#dynamic-hosting-plan), the concurrent execution limit is 4. 

## Node/JavaScript API

The Node/JavaScript experience for Azure Functions makes it easy to export a function which is passed a `context` object for communicating with the runtime, as well as receiving and sending data via bindings.

### Exporting a function

```javascript
// You must include a context, but other arguments are optional
module.exports = function(context) {
    // Additional inputs can be accessed by the arguments property
    if(arguments.length === 4) {
        context.log('This function has 4 inputs');
    }
};
// or you can include additional inputs in your arguments
module.exports = function(context, myTrigger, myInput, myOtherInput) {
    // function logic goes here :)
};
```

All JavaScript functions must export a single `function` via `module.exports` for the runtime to find the function and run it. This function must always include a `context` object.

Bindings of `direction === "in"` are passed along as function arguments, meaning you can use [`arguments`](https://msdn.microsoft.com/library/87dw3w1k.aspx) to dynamically handle new inputs (for example, by using `arguments.length` to iterate over all your inputs). This functionality is very convenient if you only have a trigger with no additional inputs, as you can predictably access your trigger data without referencing your `context` object.

The arguments are always passed along to the function in the order they occur in *function.json*, even if you don't specify them in your exports statement. For example, if you have `function(context, a, b)` and change it to `function(context, a)`, you can still get the value of `b` in function code by referring to `arguments[3]`.

All bindings, regardless of direction, are also passed along on the `context` object (see below). 

### context object

The runtime uses a `context` object to pass data to and from your function and to let you communicate with the runtime.

The context object is always the first parameter to a function and should always be included because it has methods such as `context.done` and `context.log` which are required to correctly use the runtime. You can name the object whatever you like (i.e. `ctx` or `c`).

```javascript
// You must include a context, but other arguments are optional
module.exports = function(context) {
    // function logic goes here :)
};
```

### context.bindings

The `context.bindings` object collects all your input and output data. The data is added onto the `context.bindings` object via the `name` property of the binding. For instance, given the following binding definition in *function.json*, you can access the contents of the queue via `context.bindings.myInput`. 

```json
    {
        "type":"queue",
        "direction":"in",
        "name":"myInput"
        ...
    }
```

```javascript
// myInput contains the input data which may have properties such as "name"
var author = context.bindings.myInput.name;
// Similarly, you can set your output data
context.bindings.myOutput = { 
        some_text: "hello world", 
        a_number: 1 };
```

### `context.done([err],[propertyBag])`

The `context.done` function tells the runtime that you're done running. This is important to call when you're done with the function; if you don't, the runtime will still never know that your function completed. 

The `context.done` function allows you to pass back a user-defined error to the runtime, as well as a property bag of properties which will overwrite the properties on the `context.bindings` object.

```javascript
// Even though we set myOutput to have:
//  -> text: hello world, number: 123
context.bindings.myOutput = { text: 'hello world', number: 123 };
// If we pass an object to the done function...
context.done(null, { myOutput: { text: 'hello there, world', noNumber: true }});
// the done method will overwrite the myOutput binding to be: 
//  -> text: hello there, world, noNumber: true
```

### context.log(message)

The `context.log` method allows you to output log statements that are correlated together for logging purposes. If you use `console.log`, your messages will only show for process level logging, which isn't as useful.

```javascript
/* You can use context.log to log output specific to this 
function. You can access your bindings via context.bindings */
context.log({hello: "world"}); // logs: { "hello": "world" } 
```

### HTTP triggers: context.req and `context.res

In the case of HTTP Triggers, because it is such a common pattern to use `req` and `res` for the HTTP request and response objects, we decided to make it easy to access those on the context object, instead of forcing you to use the full `context.bindings.name` pattern.

```javascript
// You can access your http request off of the context ...
if(context.req.body.emoji === ':pizza:') context.log('Yay!');
// and also set your http response
context.res = { status: 202, body: 'You successfully ordered more coffee!' };   
```

### Node Version & Package Management

The node version is currently locked at `4.1.1`. We're investigating adding support for more versions and making it configurable.

You can include packages in your function directory (i.e. via `npm install`) and then import them to your function in the usual ways (i.e. via `require('packagename')`)

```javascript
// Import the underescore.js library
var _ = require('underscore');
var version = process.version; // version === 'v4.1.1'

module.exports = function(context) {
    // Using our imported underscore.js library
    var matched_names = _
        .where(context.bindings.myInput.names, {first: 'Carla'});
```

### TypeScript/CoffeeScript support

There isn't, yet, any direct support for auto-compiling TypeScript/CoffeeScript via the runtime, so that would all need to be handled outside the runtime, at deployment time. 

## C\# API

The C# experience for Azure Functions is based on the Azure WebJobs SDK. Data flows into your C# function via method arguments. Argument names are specified in `function.json` and there are predefined names for accessing things like the function logger and cancellation tokens.

The Azure Functions runtime supports .NET v4.6.

### How .csx works

The `.csx` format allows to write less "boilerplate" and focus on writing just a C# function. For Azure Functions, you just include any assembly references and namespaces you need up top, as usual, and instead of wrapping everything in a namespace and class, you can just define your `Run` method. If you need to include any classes, for instance to define POCO objects, you can include a class inside the same file.

### Binding to arguments

The various bindings are bound to a C# function via the `name` property in the *function.json* configuration. Each binding has its own supported types which is documented per binding; for instance, a blob trigger can support a string, a POCO, or several other types. You can use the type which best suits your need. 

```csharp
public static void Run(string myBlob, out MyClass myQueueItem)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
    myQueueItem = new MyClass() { Id = "myid" };
}

public class MyClass
{
    public string Id { get; set; }
}
```

### Logging

To log output to your streaming logs in C#, you can include a `TraceWriter` typed argument. We recommend that you name it `log`. We recommend you avoid `Console.Write` in Azure Functions.

```csharp
public static void Run(string myBlob, TraceWriter log)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
}
```

### Async

To make a function asynchronous, use the `async` keyword and return a `Task` object.

```csharp
public async static Task ProcessQueueMessageAsync(
        string blobName, 
        Stream blobInput,
        Stream blobOutput)
    {
        await blobInput.CopyToAsync(blobOutput, 4096, token);
    }
```

### Cancellation Token

In certain cases, you may have operations which are sensitive to being shut down. While it's always best to write code which can handle crashing,  in cases where you want to handle graceful shutdown requests, you define a [`CancellationToken`](https://msdn.microsoft.com/library/system.threading.cancellationtoken.aspx) typed argument.  A `CancellationToken` will be provided if a host shutdown is triggered. 

```csharp
public async static Task ProcessQueueMessageAsyncCancellationToken(
        string blobName, 
        Stream blobInput,
        Stream blobOutput,
        CancellationToken token)
    {
        await blobInput.CopyToAsync(blobOutput, 4096, token);
    }
```

### Importing namespaces

If you need import namespaces, you can do so as usual, with the `using` clause.

```csharp
using System;
using System.Net;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```
The following namespaces are automatically imported and are therefore optional:

* `System`
* `System.Collections.Generic`
* `System.Linq`
* `System.Net.Http`
* `Microsoft.Azure.WebJobs`
* `Microsoft.Azure.WebJobs.Host`.

### Referencing External Assemblies

For framework assemblies, you can add references by using the `#r "AssemblyName"` directive.

```csharp
#r "System.Web.Http"

using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```
The following assemblies are automatically added by the Azure Functions hosting environment:

* `mscorlib`,
* `System`
* `System.Core`
* `System.Xml`
* `System.Net.Http`
* `Microsoft.Azure.WebJobs`
* `Microsoft.Azure.WebJobs.Host`
* `Microsoft.Azure.WebJobs.Extensions`
* `System.Web.Http`
* `System.Net.Http.Formatting`.

In addition, the following assemblies are special cased and may be referenced by simplename (e.g. `#r "AssemblyName"`):

* `Newtonsoft.Json`
* `Microsoft.AspNet.WebHooks.Receivers`
* `Microsoft.AspNEt.WebHooks.Common`.

If you need to reference a private assembly, you can upload the assembly file into a `bin` folder relative to your function and reference it by using the file name (e.g.  `#r "MyAssembly.dll"`).

### Package management

For package management, use a *project.json* file. Most things that work with the *project.json* format work with Azure Functions. The important thing is including the `frameworks` as `net46`. 

```JSON
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Humanizer": "2.0.1"
        ...
```

## Bindings

The available bindings are documented in this section. Most of these bindings are easily managed via the Azure portal's **Integrate** UI, but the portal doesn't explain all of the functionality and options for each binding.

This is a table of all supported bindings.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

### <a id="queuetrigger"></a> Azure Storage - queue trigger

The *function.json* file provides the name of the queue to poll and the variable name for the queue message. For example:

```JSON
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
using System;
using System.Threading.Tasks;

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
    log.Verbose($"C# Queue trigger function processed: {myQueueItem}\n" +
        $"queueTrigger={queueTrigger}\n" +
        $"expirationTime={expirationTime}\n" +
        $"insertionTime={insertionTime}\n" +
        $"nextVisibleTime={nextVisibleTime}\n" +
        $"id={id}\n" +
        $"popReceipt={popReceipt}\n" + 
        $"dequeueCount={dequeueCount}");
}
```

### Azure Storage - queue output

The *function.json* file provides the name of the output queue and a variable name for the content of the message. This example uses a queue trigger and writes a queue message.

```JSON
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myQueue",
      "type": "queue",
      "queueName": "samples-workitems-out",
      "connection": "",
      "direction": "out"
    }
  ],
  "disabled": false
}``` 

#### Queue output supported types

The `queue` binding can serialize the following types to a queue message:

* `string` (creates queue message if parameter value is non-null when the function ends)
* `byte[]` (works like string) 
* `CloudQueueMessage` (works like string) 
* JSON object (creates a message with a null object if the parameter is null when the function ends)

##### Queue output code example

This C# code example writes a single output queue message for each input queue message.

```csharp
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, out string myQueue, TraceWriter log)
{
    myQueue = myQueueItem + "(next step)";
}
```

This C# code example writes multiple messages by using  `ICollector<T>` (use `IAsyncCollector<T>` in an async function):

```csharp
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, ICollector<string> myQueue, TraceWriter log)
{
    myQueue.Add(myQueueItem + "(step 1)");
    myQueue.Add(myQueueItem + "(step 2)");
}
```

### Azure Storage - blob trigger

The *function.json* provides a path that specifies the container to monitor, and optionally a blob name pattern. This example triggers on any blobs that are added to the samples-workitems container.

```JSON
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

> [AZURE.NOTE] The Functions runtime scans log files to watch for new or changed blobs. This process is not real-time; a function might not get triggered until several minutes or longer after the blob is created. In addition, [storage logs are created on a "best efforts"](https://msdn.microsoft.com/library/azure/hh343262.aspx) basis; there is no guarantee that all events will be captured. Under some conditions, logs might be missed. If the speed and reliability limitations of blob triggers are not acceptable for your application, the recommended method is to create a queue message when you create the blob, and use a queue trigger instead of a blob trigger to process the blob.

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

#### Blob trigger code example

This C# code example logs the contents of each blob that is added to the container.

```csharp
using System;
using System.Threading.Tasks;

public static void Run(string myBlob, TraceWriter log)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
}
```

#### Blob trigger name patterns

You can specify a blob name pattern in the `path`. For example:

```JSON
"path": "input/original-{name}",
```

This path would find a blob named *original-Blob1.txt* in the *input* container, and the value of the `name` variable in function code would be `Blob1`.

Another example:

```JSON
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

### Azure Storage - blob input and output

The *function.json* provides the name of the container and variable names for blob name and content. This example uses a queue trigger to copy a blob:

```JSON
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myInputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}",
      "connection": "",
      "direction": "in"
    },
    {
      "name": "myOutputBlob",
      "type": "blob",
      "path": "samples-workitems/{queueTrigger}-Copy",
      "connection": "",
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

##### Blob output code example

This C# code example copies a blob whose name is received in a queue message.

```CSHARP
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, string myInputBlob, out string myOutputBlob, TraceWriter log)
{
    log.Verbose($"C# Queue trigger function processed: {myQueueItem}");
    myOutputBlob = myInputBlob;
}
```

### Azure Storage - tables input/output

### Azure Service Bus triggers and bindings

To use a Service Bus trigger or binding, set up the function app by adding a connection string for your Service Bus namespace in an app setting named AzureWebJobsServiceBus. 

1. On the Function App blade of the Azure portal, click **Function App Settings > Go to App Service settings**.

2. In the **Settings** blade, click **Application Settings**.

3. Scroll down to the App settings section, and add an entry with **Key** = AzureWebJobsServiceBus and **Value** = the connection string for your Service Bus namespace.

### </a> Azure Service Bus - queue or topic trigger

The *function.json* file provides the name of the queue or topic to poll and the variable name for the queue or topic message. For example:

```JSON
{
    "disabled": false,
    "bindings": [
        {
            "name": "myQueueItem",
            "type": "serviceBusTrigger",
            "direction": "in",
            "queueName": "samples-input",
            "subscriptionName": ""
        }
    ]
}
```

This C# code example writes a log message for each Service Bus queue or topic message received.

```csharp
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, TraceWriter log)
{
    log.Verbose($"C# Service Bus queue trigger function processed: {myQueueItem}");
}
```
 
### Azure Service Bus - queue or topic output

To use a Service Bus trigger or binding, set up the function app by adding a connection string named AzureWebJobsServiceBus. For directions, see [Service Bus queue or topic trigger](#sbqueue) earlier in this article. 

The *function.json* file provides the name of the queue and the variable name for the content of the message. The following example uses a timer trigger and and writes messages to a Service Bus queue.

```JSON
{
  "bindings": [
    {
      "schedule": "0/10 * * * * *",
      "runOnStartup": true,
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in"
    },
    {
      "name": "OutPutQueueItem",
      "type": "serviceBus",
      "queueName": "tomssbqueue",
      "subscriptionName": "",
      "direction": "out"
    }
  ],
  "disabled": true
}
``` 

#### Service Bus queue or topic supported types

The output parameter for creating a Service Bus queue message can be any of the following types.

* `string` (creates queue message if parameter value is non-null when the function ends)
* `byte[]` (works like string) 
* `BrokeredMessage` (works like string) 
* JSON object (creates a message with a null object if the parameter is null when the function ends)

### Service Bus queue or topic code example

This C# code example works with the preceding *function.json* file to write a single `string` message to a Service Bus queue.

```csharp
using System;

public static void Run(TimerInfo myTimer, out string OutPutQueueItem, TraceWriter log)
{
    log.Verbose($"C# Timer trigger function executed at: {DateTime.Now}"); 
    OutPutQueueItem = $"C# Timer trigger function executed at: {DateTime.Now}";
    
}
```

This C# code example creates multiple messages by using `ICollector<T>` (use `IAsyncCollector<T>` in an async function):

```csharp
using System;

public static void Run(TimerInfo myTimer, ICollector<string> OutPutQueueItem, TraceWriter log)
{
    log.Verbose($"C# Timer trigger function executed at: {DateTime.Now}"); 
    OutPutQueueItem.Add($"C# Timer trigger function executed at: {DateTime.Now} (item 1)");
    OutPutQueueItem.Add($"C# Timer trigger function executed at: {DateTime.Now} (item 2)");
}
```

### Azure Service Bus - EventHub trigger


### Azure Service Bus - EventHub output
