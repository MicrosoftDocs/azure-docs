<properties
   pageTitle="Azure Functions developer reference | Microsoft Azure"
   description="Understand how Azure Functions are develop and configured using triggers and bindings which use a domain specific language."
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
   ms.date="03/09/2016"
   ms.author="chrande"/>

# Azure Functions developer reference

## Core concepts

Azure Functions share a few core technical concepts, regardless of the langauge you choose. Before you jump to learning about how your language of choice works, be sure to read through these core concepts.

### function

A function is the primary concept in WebJobs Scripts. A function is written by you and included in a folder with your configuration file, `function.json`. There are a variety of langauges supported and each one has a slightly different experience which is optimized to work best for that language.

### Runtime (Script Host) & web host

The runtime, otherwise known as the script host, is the underlying WebJobs host which will listen for events, gather and send data, and ultimately run your code. 

To facilitate HTTP Triggers, there is also a web host which is designed to sit in front of the script host in production scenarios. This helps to isolate the script host from the front end traffic managed by the web host.

### function.json & bindings

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

Your `function.json` file contains the configuration, including your bindings, that is specific to your function. This file is used by the runtime to know what event to trigger off of, which data to include when calling the function, and where to send data passed along from the function itself. The `disabled` property will disable your function if set to `true`.

Bindings are the way we configure how we trigger, how data flows into the function, and how data flows out of the function. Each binding shares a few common settings and some settings which are specific to how it works. Every binding requires the following settings:


|property|values/types|comments|
|---|-----|------|
|`type`|string|This value determines the binding that you are using (i.e. `queueTrigger`)|
|`direction`|'in', 'out'| This value communicates whether you're requesting data or outputing data to your binding.
| `name` | string | This value determines the name that will be used to send data into your function (C# bindings to argument names; javascript uses a key/value list)

### Directory Structure

```
# Example
parentFolder (i.e. wwwroot)
 | - host.json
 | - myfunction
 | | - function.json
 | | - index.js
 | | - node_modules
 | | | - ... packages ...
 | | - package.json
 | - myotherfunction
 | | - funciton.json
 | | - run.csx
```

A collection for functions share a parent directory. Each function's code, function.json, and other dependencies are all contained in a single folder. A script host points as the parent directory of a set of functions (which may only consist of a single function (ie. 1 folder)). A host.json file contains some script host specific configuration and sits in the parent directory.

When setting up a project for deploying WebJobs scripts to Azure App Service, you can treat this as your site code. You can use existing tools like continuous integration and deployment, or custom deployment scripts for doing deploy time package installation or code transpilation.

## Node/JavaScript API

The Node/JavaScript experience for WebJobs Scripts makes it easy to export a function which is passed a `context` object for communicating with the core runtime, as well as receiving and sending data via your bindings.

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

All JavaScript functions must export a single `function` via `module.exports` for the core runtime to find the function and run it. This function must always include a `context` object.

The arguments are always passed along to your function, in the order they are specified in your function.json, even if you don't specify any additional arguments. Only bindings of `direction === "in"` will be passed along as function arguments, meaning your can use [`arguments`](https://msdn.microsoft.com/en-us/library/87dw3w1k.aspx) to dynamically handle new inputs (i.e. by using `arguments.length` to iterate over all your inputs). All bindings, regardless of direction, are also passed along on the `context` object (see below). This functionality is very conveinient if you only have a trigger with no additional inputs, as you can predictably access your trigger data without referencing your `context` object.

### `context` Object

```javascript
// You must include a context, but other arguments are optional
module.exports = function(context) {
    // function logic goes here :)
};
```

The Node runtime for WebJobs Script uses a `context` object to pass data to and from your function, as well as allow you to communicate with the core runtime.

The context object is always the first parameter to a function and should always be included because it has methods such as `context.done` and `context.log` which are required to correctly use the runtime. You can name the object whatever you like (i.e. `ctx` or `c`).

### `context.bindings`

```javascript
// myInput contains the input data which may have properties such as "name"
var author = context.bindings.myInput.name;
// Similarly, you can set your output data
context.bindings.myOutput = { 
        some_text: "hello world", 
        a_number: 1 };
```
The `context.bindings` object collects all your input and output data. The data is added onto the `context.bindings` object via the `name` property of the binding. For instance, given the binding below, we could access the contents of the queue via `context.bindings.myInput`. 

<code>
    {
        "type":"queue",
        "direction":"in",
        "name":"myInput"
        ...
    }
</code>

### `context.done([err],[propertyBag])`

```javascript
// Even though we set myOutput to have:
//  -> text: hello world, number: 123
context.bindings.myOutput = { text: 'hello world', number: 123 };
// If we pass an object to the done function...
context.done(null, { myOutput: { text: 'foobar', noNumber: true }});
// the done method will overwrite the myOutput binding to be: 
//  -> text: foobar, noNumber: true
```


The `context.done` function tells the runtime that you're done running. This is important to call when you're done with the function; if you don't, the runtime will still think you're running. The `context.done` function allows you to pass back a user-defined error to the runtime, as well as a property bag of properties which will overwrite the properties on the context.bindings object.

### `context.log(message)`

```javascript
/* You can use context.log to log output specific to this 
function. You can access your bindings via context.bindings */
context.log({hello: "world"}); // logs: { "hello": "world" } 
```

The `context.log` method will allow you to output log statements that are correlated together for logging purposes. If you use `console.log`, your messages will only show for process level logging, which isn't as useful.

### Special case: HTTP Triggers - `context.req` and `context.res`

```javascript
// You can access your http request off of the context ...
if(context.req.body.emoji === ':pizza:') context.log('Yay!');
// and also set your http response
context.res = { status: 202, body: 'You successfully ordered more coffee!' };   
```

In the case of HTTP Triggers, because it is such a common pattern to use `req` and `res` for the HTTP request and response objects, we decided to make it easy to access those off of the context object, instead of forcing you to use the full `context.bindings.name` pattern.

### Node Version & Package Management

```javascript
// Import the underescore.js library
var _ = require('underscore');
var version = process.version; // version === 'v4.1.1'

module.exports = function(context) {
    // Using our imported underscore.js library
    var matched_names = _
        .where(context.bindings.myInput.names, {first: 'Carla'});
```

The node version is currently locked at `4.1.1`. We're investigating adding support for more versions and making it configurable.


You can include packages in your function directory (i.e. via `npm install`) and then import them to your function in the usual ways (i.e. via `require('packagename')`)

### TypeScript/CoffeeScript support

There isn't, yet, any direct support for auto-compiling TypeScript/CoffeeScript via the runtime, so that would all need to be handled outside the runtime (i.e. at deployment time). 

## C\# API

The C# experience for Azure Functions is based on the Azure WebJobs SDK. Data flows into your C# function via the argument name in your `function.json` and special cases for accessing things like the function logger and cancellation tokens. 

We are currently locked to using .NET v4.6.

### How .csx works

The `.csx` format allows for you to write less "boilerplate" and focus on writing just a C# function. For Azure Functions, you just include any packages or libraries you need up top, as usual, and instead of wrapping everything in a class, you can just run your function. If you need to include any classes, for instance to define POCO objects, you can include a class inside the same file.

### Binding to arguments

```csharp
public static void Run(string myBlob, out POCOObject myQueue)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
    myQueue = new POCOObject();
}
```

The various bindings are bound to a C# function via the `name` property in the function.json configuration. Each binding has its own supported types which is documented per binding; for instance a blob trigger can support a string, a POCO, or several other types. You can use the type which best suits your need. 

### Special Case: Logging

```csharp
public static void Run(string myBlob, TraceWriter log)
{
    log.Verbose($"C# Blob trigger function processed: {myBlob}");
}
```

To log output to your streaming logs in C#, you can include a `TextWriter` class (we recommend its named `log`). We recommend you avoid `Console.Write` in Azure Functions.

### Special Case: Cancellation Token

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

In certain cases, you may have operations which are sensitive to being shut down. While it's always best to write code which can handle crashing,  in cases where you want to handle graceful shutdown requests, you can use a [`CancellationToken`](https://msdn.microsoft.com/en-us/library/system.threading.cancellationtoken.aspx). You must make your function `async` in order to use a CancellationToken. 

### Using libraries

```csharp
using System;
using System.Net;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```

If you need to reference other libraries, you can reference them in the same way you're used to.

### Requiring external libraries

```csharp
#r "System.Web.Http"

using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

public static Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
```

You can add external libraries using the `#r "library"` syntax. For instance, if I had more own .dll which I uploaded with my function and I wanted to reference it, I could do so with `#r "mylib.dll"`.

### Package management

```JSON
{
  "frameworks": {
    "net46":{
      "dependencies": {
        "Humanizer": "2.0.1"
        ...
```

For package management, we use the `project.json` format. Most things that work with the project.json format work with Functions. The important thing is including the `frameworks` as `net46`. 

## Bindings

Most of these bindings are easily managed via the portal's integrate UX, but in the case that you wish to understand the underlying functionality, plus some tips and tricks, we've documented each binding in this section.

This is a table of all our supported bindings.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]

### HTTP

### Timer

### Azure Blob Storage

#### Blob trigger

#### Blob input

#### Blob output

### Azure Service Bus

#### Service Bus topic trigger

#### Service Bus output

#### Event Hub trigger

#### Event Hub output