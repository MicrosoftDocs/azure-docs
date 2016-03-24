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

The arguments are always passed along to the function in the order they occur in *function.json*, even if you don't specify in your exports statement. 


Only bindings of `direction === "in"` are passed along as function arguments, meaning you can use [`arguments`](https://msdn.microsoft.com/library/87dw3w1k.aspx) to dynamically handle new inputs (for example, by using `arguments.length` to iterate over all your inputs). This functionality is very convenient if you only have a trigger with no additional inputs, as you can predictably access your trigger data without referencing your `context` object.

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

Azure Functions currently supports only .NET v4.6.

### How .csx works

The `.csx` format allows for you to write less "boilerplate" and focus on writing just a C# function. For Azure Functions, you just include any packages or libraries you need up top, as usual, and instead of wrapping everything in a class, you can just run your function. If you need to include any classes, for instance to define POCO objects, you can include a class inside the same file.

### Binding to arguments

The various bindings are bound to a C# function via the `name` property in the *function.json* configuration. Each binding has its own supported types which is documented per binding; for instance, a blob trigger can support a string, a POCO, or several other types. You can use the type which best suits your need. 

```csharp
public static void Run(string myBlob, out POCOObject myQueue)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
    myQueue = new POCOObject();
}
```

### Logging

To log output to your streaming logs in C#, you can include a `TraceWriter` class (we recommend naming it `log`). We recommend you avoid `Console.Write` in Azure Functions.

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

In certain cases, you may have operations which are sensitive to being shut down. While it's always best to write code which can handle crashing, in cases where you want to handle graceful shutdown requests, you can use a [`CancellationToken`](https://msdn.microsoft.com/library/system.threading.cancellationtoken.aspx). You must make your function `async` in order to use a `CancellationToken`. 

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

### Using libraries

If you need to reference other libraries, you can reference them in the same way you're used to.

```csharp
using System;
using System.Net;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```

### Requiring external libraries

You can add external libraries using the `#r "library"` syntax. For instance, if I had my own .dll which I uploaded with my function and I wanted to reference it, I could do so with `#r "mylib.dll"`.

```csharp
#r "System.Web.Http"

using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```

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

Most of these bindings are easily managed via the portal's integrate UX, but in case you wish to understand the underlying functionality, plus some tips and tricks, we've documented each binding in this section.

This is a table of all our supported bindings.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

### <a id="queuetrigger"></a> Azure Storage - queue trigger

To poll a storage queue, you specify the name of the queue to poll and the variable name for the queue message.

Sample *function.json*:

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

The queue message can be deserialized to any of the following types:

* `string`
* A POCO type if the message has been serialized as JSON.   
* `byte[]`
* `CloudQueueMessage`

Here is C# code that works with the preceding *function.json* example.

```CSHARP
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, TraceWriter log)
{
    log.Verbose($"C# Queue trigger function processed: {myQueueItem}");
}
```

You can get queue metadata in your function by using the following variable names:

* expirationTime
* insertionTime
* nextVisibleTime
* id
* popReceipt
* dequeueCount
* queueTrigger (another way to retrieve the queue message text as a string)

The following C# code example retrieves queue metadata.

```CSHARP
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

To create a new storage queue message, you provide the name of the queue to create messages in, and the content of the message to create.

Sample *function.json* for a function that is triggered by a queue message and writes a queue message:

```JSON
{
  "bindings": [
    {
      "queueName": "myqueue-items",
      "connection": "azurefunctions4e62e828_STORAGE",
      "name": "myQueueItem",
      "type": "queueTrigger",
      "direction": "in"
    },
    {
      "name": "myQueue",
      "type": "queue",
      "queueName": "samples-workitems-out",
      "connection": "azurefunctions4e62e828_STORAGE",
      "direction": "out"
    }
  ],
  "disabled": false
}``` 

Here is sample C# code that works with the preceding *function.json* example.

```CSHARP
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, out string myQueue, TraceWriter log)
{
    myQueue = myQueueItem + "(next step)";
}
```

To create multiple messages in a C# function, make the parameter type for the output queue `ICollector<T>` or `IAsyncCollector<T>`, as shown in the following example:

```CSHARP
using System;
using System.Threading.Tasks;

public static void Run(string myQueueItem, ICollector<string> myQueue, TraceWriter log)
{
    myQueue.Add(myQueueItem + "(step 1)");
    myQueue.Add(myQueueItem + "(step 2)");
}
```

The `queue` binding works with the following types.

* `out string` (creates queue message if parameter value is non-null when the function ends)
* `out byte[]` (works like string) 
* `out CloudQueueMessage` (works like string) 
* `out POCO` (a serializable type, creates a message with a null object if the parameter is null when the function ends)
* `ICollector`
* `IAsyncCollector`
* `CloudQueue` (for creating messages manually using the Azure Storage API directly)

### Azure Storage - blob trigger

To trigger a function when a blob is created or updated, you provide a `path` that specifies the container to monitor, and optionally a blob name pattern. 

You can restrict the types of blobs that trigger the function by specifying a pattern with a fixed value for the file extension. If you set the `path` to  *samples/{name}.png*, only *.png* blobs in the *samples* container will trigger the function.

Sample *function.json*:

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

### Azure Storage - blob input/output

Sample *function.json*:

```JSON
``` 

### Azure Storage - tables input/output

Sample *function.json*:

```JSON
``` 

### Azure Service Bus - queue or topic trigger

To poll a Service Bus queue or topic, you provide the name of the queue or topic and the variable name to use for the message in the function code.

Sample *function.json*:

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

### Azure Service Bus - queue or topic output

To create a new Service Bus queue message, you provide the name of the queue to create messages in, and the content of the message to create.

Sample *function.json*:

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

### Azure Service Bus - EventHub trigger

Sample *function.json*:

```JSON
``` 

### Azure Service Bus - EventHub output

Sample *function.json*:

```JSON
``` 
