---
title: JavaScript developer reference for Azure Functions | Microsoft Docs
description: Understand how to develop functions by using JavaScript.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture

ms.assetid: 45dedd78-3ff9-411f-bb4b-16d29a11384c
ms.service: azure-functions
ms.devlang: nodejs
ms.topic: reference
ms.date: 10/26/2018
ms.author: glenga

---
# Azure Functions JavaScript developer guide

This guide contains information about the intricacies of writing Azure Functions with JavaScript.

A JavaScript function is an exported `function` that executes when triggered ([triggers are configured in function.json](functions-triggers-bindings.md)). The first argument every function is passed is a `context` object which is used for receiving and sending binding data, logging, and communicating with the runtime.

This article assumes that you have already read the [Azure Functions developer reference](functions-reference.md). You should also complete the Functions quickstart to create your first function, using [Visual Studio Code](functions-create-first-function-vs-code.md) or [in the portal](functions-create-first-azure-function.md).

## Folder structure

The required folder structure for a JavaScript project looks like the following. This default can be changed. For more information, see the [scriptFile](#using-scriptfile) section below.

```
FunctionsProject
 | - MyFirstFunction
 | | - index.js
 | | - function.json
 | - MySecondFunction
 | | - index.js
 | | - function.json
 | - SharedCode
 | | - myFirstHelperFunction.js
 | | - mySecondHelperFunction.js
 | - node_modules
 | - host.json
 | - package.json
 | - extensions.csproj
 | - bin
```

At the root of the project, there's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has a folder with its own code file (.js) and binding configuration file (function.json). The name of `function.json`'s parent directory is always the name of your function.

The binding extensions required in [version 2.x](functions-versions.md) of the Functions runtime are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](functions-triggers-bindings.md#local-development-azure-functions-core-tools). When developing functions in the Azure portal, this registration is done for you.

## Exporting a function

JavaScript functions must be exported via [`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) (or [`exports`](https://nodejs.org/api/modules.html#modules_exports)). Your exported function should be a JavaScript function that executes when triggered.

By default, the Functions runtime looks for your function in `index.js`, where `index.js` shares the same parent directory as its corresponding `function.json`. In the default case, your exported function should be the only export from its file or the export named `run` or `index`. To configure the file location and export name of your function, read about [configuring your function's entry point](functions-reference-node.md#configure-function-entry-point) below.

Your exported function is passed a number of arguments on execution. The first argument it takes is always a `context` object. If your function is synchronous (does not return a Promise), you must pass the `context` object, as calling `context.done` is required for correct use.

```javascript
// You should include context, other arguments are optional
module.exports = function(context, myTrigger, myInput, myOtherInput) {
    // function logic goes here :)
    context.done();
};
```

### Exporting an async function
When using the [`async function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) declaration or plain JavaScript [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) in version 2.x of the Functions runtime, you do not need to explicitly call the [`context.done`](#contextdone-method) callback to signal that your function has completed. Your function completes when the exported async function/Promise completes. For functions targeting the version 1.x runtime, you must still call [`context.done`](#contextdone-method) when your code is done executing.

The following example is a simple function that logs that it was triggered and immediately completes execution.

```javascript
module.exports = async function (context) {
    context.log('JavaScript trigger function processed a request.');
};
```

When exporting an async function, you can also configure an output binding to take the `return` value. This is recommended if you only have one output binding.

To assign an output using `return`, change the `name` property to `$return` in `function.json`.

```json
{
  "type": "http",
  "direction": "out",
  "name": "$return"
}
```

In this case, your function should look like the following example:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // You can call and await an async method here
    return {
        body: "Hello, world!"
    };
}
```

## Bindings 
In JavaScript, [bindings](functions-triggers-bindings.md) are configured and defined in a function's function.json. Functions interact with bindings a number of ways.

### Inputs
Input are divided into two categories in Azure Functions: one is the trigger input and the other is the additional input. Trigger and other input bindings (bindings of `direction === "in"`) can be read by a function in three ways:
 - **_[Recommended]_ As parameters passed to your function.** They are passed to the function in the same order that they are defined in *function.json*. Note that the `name` property defined in *function.json* does not need to match the name of your parameter, although it should.
 
   ```javascript
   module.exports = async function(context, myTrigger, myInput, myOtherInput) { ... };
   ```
   
 - **As members of the [`context.bindings`](#contextbindings-property) object.** Each member is named by the `name` property defined in *function.json*.
 
   ```javascript
   module.exports = async function(context) { 
       context.log("This is myTrigger: " + context.bindings.myTrigger);
       context.log("This is myInput: " + context.bindings.myInput);
       context.log("This is myOtherInput: " + context.bindings.myOtherInput);
   };
   ```
   
 - **As inputs using the JavaScript [`arguments`](https://msdn.microsoft.com/library/87dw3w1k.aspx) object.** This is essentially the same as passing inputs as parameters, but allows you to dynamically handle inputs.
 
   ```javascript
   module.exports = async function(context) { 
       context.log("This is myTrigger: " + arguments[1]);
       context.log("This is myInput: " + arguments[2]);
       context.log("This is myOtherInput: " + arguments[3]);
   };
   ```

### Outputs
Outputs (bindings of `direction === "out"`) can be written to by a function in a number of ways. In all cases, the `name` property of the binding as defined in *function.json* corresponds to the name of the object member written to in your function. 

You can assign data to output bindings in one of the following ways. You should not combine these methods.
- **_[Recommended for multiple outputs]_ Returning an object.** If you are using a async/Promise returning function, you can return an object with assigned output data. In the example below, the output bindings are named "httpResponse" and "queueOutput" in *function.json*.

  ```javascript
  module.exports = async function(context) {
      let retMsg = 'Hello, world!';
      return {
          httpResponse: {
              body: retMsg
          },
          queueOutput: retMsg
      };
  };
  ```
  
  If you are using a synchronous function, you can return this object using [`context.done`](#contextdone-method) (see example).
- **_[Recommended for single output]_ Returning a value directly and using the $return binding name.** This only works for async/Promise returning functions. See example in [exporting an async function](#exporting-an-async-function). 
- **Assigning values to `context.bindings`** You can assign values directly to context.bindings.

  ```javascript
  module.exports = async function(context) {
      let retMsg = 'Hello, world!';
      context.bindings.httpResponse = {
          body: retMsg
      };
      context.bindings.queueOutput = retMsg;
      return;
  };
  ```
 
### Bindings data type

To define the data type for an input binding, use the `dataType` property in the binding definition. For example, to read the content of an HTTP request in binary format, use the type `binary`:

```json
{
    "type": "httpTrigger",
    "name": "req",
    "direction": "in",
    "dataType": "binary"
}
```

Options for `dataType` are: `binary`, `stream`, and `string`.

## context object
The runtime uses a `context` object to pass data to and from your function and to let you communicate with the runtime. The context object can be used for reading and setting data from bindings, writing logs, and using the `context.done` callback when your exported function is synchronous.

The `context` object is always the first parameter to a function. It should be included because it has important methods such as `context.done` and `context.log`. You can name the object whatever you would like (for example, `ctx` or `c`).

```javascript
// You must include a context, but other arguments are optional
module.exports = function(ctx) {
    // function logic goes here :)
    ctx.done();
};
```

### context.bindings property

```js
context.bindings
```

Returns a named object that contains all your input and output data. For example, the following binding definitions in your function.json let you access the contents of a queue from `context.bindings.myInput` and assign outputs to a queue using `context.bindings.myOutput`.

```json
{
    "type":"queue",
    "direction":"in",
    "name":"myInput"
    ...
},
{
    "type":"queue",
    "direction":"out",
    "name":"myOutput"
    ...
}
```

```javascript
// myInput contains the input data, which may have properties such as "name"
var author = context.bindings.myInput.name;
// Similarly, you can set your output data
context.bindings.myOutput = { 
        some_text: 'hello world', 
        a_number: 1 };
```

You can choose to define output binding data using the `context.done` method instead of the `context.binding` object (see below).

### context.bindingData property

```js
context.bindingData
```

Returns a named object that contains trigger metadata and function invocation data (`invocationId`, `sys.methodName`, `sys.utcNow`, `sys.randGuid`). For an example of trigger metadata, see this [event hubs example](functions-bindings-event-hubs.md#trigger---javascript-example).

### context.done method

```js
context.done([err],[propertyBag])
```

Lets the runtime know that your code has completed. When your function uses the [`async function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) declaration, you do not need to use `context.done()`. The `context.done` callback is implicitly called. Async functions are available in Node 8 or a later version, which requires version 2.x of the Functions runtime.

If your function is not an async function, **you must call** `context.done` to inform the runtime that your function is complete. The execution times out if it is missing.

The `context.done` method allows you to pass back both a user-defined error to the runtime and a JSON object containing output binding data. Properties passed to `context.done` overwrite anything set on the `context.bindings` object.

```javascript
// Even though we set myOutput to have:
//  -> text: 'hello world', number: 123
context.bindings.myOutput = { text: 'hello world', number: 123 };
// If we pass an object to the done function...
context.done(null, { myOutput: { text: 'hello there, world', noNumber: true }});
// the done method overwrites the myOutput binding to be: 
//  -> text: 'hello there, world', noNumber: true
```

### context.log method  

```js
context.log(message)
```

Allows you to write to the streaming function logs at the default trace level. On `context.log`, additional logging methods are available that let you write function logs at other trace levels:


| Method                 | Description                                |
| ---------------------- | ------------------------------------------ |
| **error(_message_)**   | Writes to error level logging, or lower.   |
| **warn(_message_)**    | Writes to warning level logging, or lower. |
| **info(_message_)**    | Writes to info level logging, or lower.    |
| **verbose(_message_)** | Writes to verbose level logging.           |

The following example writes a log at the warning trace level:

```javascript
context.log.warn("Something has happened."); 
```

You can [configure the trace-level threshold for logging](#configure-the-trace-level-for-console-logging) in the host.json file. For more information on writing logs, see [writing trace outputs](#writing-trace-output-to-the-console) below.

Read [monitoring Azure Functions](functions-monitoring.md) to learn more about viewing and querying function logs.

## Writing trace output to the console 

In Functions, you use the `context.log` methods to write trace output to the console. In Functions v2.x, trace outputs using `console.log` are captured at the Function App level. This means that outputs from `console.log` are not tied to a specific function invocation, and hence aren't displayed in a specific function's logs. They do, however, propagate to Application Insights. In Functions v1.x, you cannot use `console.log` to write to the console.

When you call `context.log()`, your message is written to the console at the default trace level, which is the _info_ trace level. The following code writes to the console at the info trace level:

```javascript
context.log({hello: 'world'});  
```

This code is equivalent to the code above:

```javascript
context.log.info({hello: 'world'});  
```

This code writes to the console at the error level:

```javascript
context.log.error("An error has occurred.");  
```

Because _error_ is the highest trace level, this trace is written to the output at all trace levels as long as logging is enabled.

All `context.log` methods support the same parameter format that's supported by the Node.js [util.format method](https://nodejs.org/api/util.html#util_util_format_format). Consider the following code, which writes function logs by using the default trace level:

```javascript
context.log('Node.js HTTP trigger function processed a request. RequestUri=' + req.originalUrl);
context.log('Request Headers = ' + JSON.stringify(req.headers));
```

You can also write the same code in the following format:

```javascript
context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
context.log('Request Headers = ', JSON.stringify(req.headers));
```

### Configure the trace level for console logging

Functions lets you define the threshold trace level for writing to the console, which makes it easy to control the way traces are written to the console from your function. To set the threshold for all traces written to the console, use the `tracing.consoleLevel` property in the host.json file. This setting applies to all functions in your function app. The following example sets the trace threshold to enable verbose logging:

```json
{
    "tracing": {
        "consoleLevel": "verbose"
    }
}  
```

Values of **consoleLevel** correspond to the names of the `context.log` methods. To disable all trace logging to the console, set **consoleLevel** to _off_. For more information, see [host.json reference](functions-host-json.md).

## HTTP triggers and bindings

HTTP and webhook triggers and HTTP output bindings use request and response objects to represent the HTTP messaging.  

### Request object

The `context.req` (request) object has the following properties:

| Property      | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| _body_        | An object that contains the body of the request.               |
| _headers_     | An object that contains the request headers.                   |
| _method_      | The HTTP method of the request.                                |
| _originalUrl_ | The URL of the request.                                        |
| _params_      | An object that contains the routing parameters of the request. |
| _query_       | An object that contains the query parameters.                  |
| _rawBody_     | The body of the message as a string.                           |


### Response object

The `context.res` (response) object has the following properties:

| Property  | Description                                               |
| --------- | --------------------------------------------------------- |
| _body_    | An object that contains the body of the response.         |
| _headers_ | An object that contains the response headers.             |
| _isRaw_   | Indicates that formatting is skipped for the response.    |
| _status_  | The HTTP status code of the response.                     |

### Accessing the request and response 

When you work with HTTP triggers, you can access the HTTP request and response objects in a number of ways:

+ **From `req` and `res` properties on the `context` object.** In this way, you can use the conventional pattern to access HTTP data from the context object, instead of having to use the full `context.bindings.name` pattern. The following example shows how to access the `req` and `res` objects on the `context`:

    ```javascript
    // You can access your http request off the context ...
    if(context.req.body.emoji === ':pizza:') context.log('Yay!');
    // and also set your http response
    context.res = { status: 202, body: 'You successfully ordered more coffee!' }; 
    ```

+ **From the named input and output bindings.** In this way, the HTTP trigger and bindings work the same as any other binding. The following example sets the response object by using a named `response` binding: 

    ```json
    {
        "type": "http",
        "direction": "out",
        "name": "response"
    }
    ```
    ```javascript
    context.bindings.response = { status: 201, body: "Insert succeeded." };
    ```
+ **_[Response only]_ By calling `context.res.send(body?: any)`.** An HTTP response is created with input `body` as the response body. `context.done()` is implicitly called.

+ **_[Response only]_ By calling `context.done()`.** A special kind of HTTP binding returns the response that is passed to the `context.done()` method. The following HTTP output binding defines a `$return` output parameter:

    ```json
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
    ``` 
    ```javascript
     // Define a valid response object.
    res = { status: 201, body: "Insert succeeded." };
    context.done(null, res);   
    ```  

## Node version

The following table shows the Node.js version used by each major version of the Functions runtime:

| Functions version | Node.js version | 
|---|---|
| 1.x | 6.11.2 (locked by the runtime) |
| 2.x  | _Active LTS_ and even-numbered _Current_ Node.js versions (8.11.1 and 10.6.0 recommended). Set the version by using the WEBSITE_NODE_DEFAULT_VERSION [app setting](functions-how-to-use-azure-function-app-settings.md#settings).|

You can see the current version that the runtime is using by checking the above app setting or by printing `process.version` from any function.

## Dependency management
In order to use community libraries in your JavaScript code, as is shown in the below example, you need to ensure that all dependencies are installed on your Function App in Azure.

```javascript
// Import the underscore.js library
var _ = require('underscore');
var version = process.version; // version === 'v6.5.0'

module.exports = function(context) {
    // Using our imported underscore.js library
    var matched_names = _
        .where(context.bindings.myInput.names, {first: 'Carla'});
```

> [!NOTE]
> You should define a `package.json` file at the root of your Function App. Defining the file lets all functions in the app share the same cached packages, which gives the best performance. If a version conflict arises, you can resolve it by adding a `package.json` file in the folder of a specific function.  

When deploying Function Apps from source control, any `package.json` file present in your repo, will trigger an `npm install` in its folder during deployment. But when deploying via the Portal or CLI, you will have to manually install the packages.

There are two ways to install packages on your Function App: 

### Deploying with Dependencies
1. Install all requisite packages locally by running `npm install`.

2. Deploy your code, and ensure that the `node_modules` folder is included in the deployment. 


### Using Kudu
1. Go to `https://<function_app_name>.scm.azurewebsites.net`.

2. Click **Debug Console** > **CMD**.

3. Go to `D:\home\site\wwwroot`, and then drag your package.json file to the **wwwroot** folder at the top half of the page.  
    You can upload files to your function app in other ways also. For more information, see [How to update function app files](functions-reference.md#fileupdate). 

4. After the package.json file is uploaded, run the `npm install` command in the **Kudu remote execution console**.  
    This action downloads the packages indicated in the package.json file and restarts the function app.

## Environment variables

In Functions, [app settings](functions-app-settings.md), such as service connection strings, are exposed as environment variables during execution. You can access these settings using `process.env`, as shown here in the `GetEnvironmentVariable` function:

```javascript
module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    context.log('Node.js timer trigger function ran!', timeStamp);
    context.log(GetEnvironmentVariable("AzureWebJobsStorage"));
    context.log(GetEnvironmentVariable("WEBSITE_SITE_NAME"));

    context.done();
};

function GetEnvironmentVariable(name)
{
    return name + ": " + process.env[name];
}
```

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

When running locally, app settings are read from the [local.settings.json](functions-run-local.md#local-settings-file) project file.

## Configure function entry point

The `function.json` properties `scriptFile` and `entryPoint` can be used to configure the location and name of your exported function. These properties can be important when your JavaScript is transpiled.

### Using `scriptFile`

By default, a JavaScript function is executed from `index.js`, a file that shares the same parent directory as its corresponding `function.json`.

`scriptFile` can be used to get a folder structure that looks like the following example:

```
FunctionApp
 | - host.json
 | - myNodeFunction
 | | - function.json
 | - lib
 | | - nodeFunction.js
 | - node_modules
 | | - ... packages ...
 | - package.json
```

The `function.json` for `myNodeFunction` should include a `scriptFile` property pointing to the file with the exported function to run.

```json
{
  "scriptFile": "../lib/nodeFunction.js",
  "bindings": [
    ...
  ]
}
```

### Using `entryPoint`

In `scriptFile` (or `index.js`), a function must be exported using `module.exports` in order to be found and run. By default, the function that executes when triggered is the only export from that file, the export named `run`, or the export named `index`.

This can be configured using `entryPoint` in `function.json`, as in the following example:

```json
{
  "entryPoint": "logFoo",
  "bindings": [
    ...
  ]
}
```

In Functions v2.x, which supports the `this` parameter in user functions, the function code could then be as in the following example:

```javascript
class MyObj {
    constructor() {
        this.foo = 1;
    };

    function logFoo(context) { 
        context.log("Foo is " + this.foo); 
        context.done(); 
    }
}

const myObj = new MyObj();
module.exports = myObj;
```

In this example, it is important to note that although an object is being exported, there are no guarantess around preserving state between executions.

## Considerations for JavaScript functions

When you work with JavaScript functions, be aware of the considerations in the following sections.

### Choose single-vCPU App Service plans

When you create a function app that uses the App Service plan, we recommend that you select a single-vCPU plan rather than a plan with multiple vCPUs. Today, Functions runs JavaScript functions more efficiently on single-vCPU VMs, and using larger VMs does not produce the expected performance improvements. When necessary, you can manually scale out by adding more single-vCPU VM instances, or you can enable auto-scale. For more information, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md?toc=%2fazure%2fapp-service-web%2ftoc.json).    

### TypeScript and CoffeeScript support

Because direct support does not yet exist for auto-compiling TypeScript or CoffeeScript via the runtime, such support needs to be handled outside the runtime, at deployment time. 

### Cold Start

When developing Azure Functions in the serverless hosting model, cold starts are a reality. *Cold start* refers to the fact that when your function app starts for the first time after a period of inactivity, it takes longer to start up. For JavaScript functions with large dependency trees in particular, cold start can be significant. To speed up the cold start process, [run your functions as a package file](run-functions-from-deployment-package.md) when possible. Many deployment methods use the run from package model by default, but if you're experiencing large cold starts and are not running this way, this change can offer a significant improvement.

## Next steps

For more information, see the following resources:

+ [Best practices for Azure Functions](functions-best-practices.md)
+ [Azure Functions developer reference](functions-reference.md)
+ [Azure Functions triggers and bindings](functions-triggers-bindings.md)
