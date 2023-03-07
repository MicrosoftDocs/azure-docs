---
title: JavaScript developer reference for Azure Functions 
description: Understand how to develop functions by using JavaScript.

ms.assetid: 45dedd78-3ff9-411f-bb4b-16d29a11384c
ms.topic: conceptual
ms.date: 02/24/2022
ms.devlang: javascript
ms.custom: devx-track-js, vscode-azure-extension-update-not-needed
---
# Azure Functions JavaScript developer guide

This guide contains detailed information to help you succeed developing Azure Functions using JavaScript.

As an Express.js, Node.js, or JavaScript developer, if you're new to Azure Functions, please consider first reading one of the following articles:

| Getting started | Concepts| Guided learning |
| -- | -- | -- | 
| <ul><li>[Node.js function using Visual Studio Code](./create-first-function-vs-code-node.md)</li><li>[Node.js function with terminal/command prompt](./create-first-function-cli-node.md)</li><li>[Node.js function using the Azure portal](functions-create-function-app-portal.md)</li></ul> | <ul><li>[Developer guide](functions-reference.md)</li><li>[Hosting options](functions-scale.md)</li><li>[TypeScript functions](#typescript)</li><li>[Performance&nbsp; considerations](functions-best-practices.md)</li></ul> | <ul><li>[Create serverless applications](/training/paths/create-serverless-applications/)</li><li>[Refactor Node.js and Express APIs to Serverless APIs](/training/modules/shift-nodejs-express-apis-serverless/)</li></ul> |

## JavaScript function basics

A JavaScript (Node.js) function is an exported `function` that executes when triggered ([triggers are configured in function.json](functions-triggers-bindings.md)). The first argument passed to every function is a `context` object, which is used for receiving and sending binding data, logging, and communicating with the runtime.

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
```

At the root of the project, there's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has a folder with its own code file (.js) and binding configuration file (function.json). The name of `function.json`'s parent directory is always the name of your function.

The binding extensions required in [version 2.x](functions-versions.md) of the Functions runtime are defined in the `extensions.csproj` file, with the actual library files in the `bin` folder. When developing locally, you must [register binding extensions](./functions-bindings-register.md#extension-bundles). When developing functions in the Azure portal, this registration is done for you.

<a name="#exporting-an-async-function"></a>

## Exporting a function

JavaScript functions must be exported via [`module.exports`](https://nodejs.org/api/modules.html#modules_module_exports) (or [`exports`](https://nodejs.org/api/modules.html#modules_exports)). Your exported function should be a JavaScript function that executes when triggered.

By default, the Functions runtime looks for your function in `index.js`, where `index.js` shares the same parent directory as its corresponding `function.json`. In the default case, your exported function should be the only export from its file or the export named `run` or `index`. To configure the file location and export name of your function, read about [configuring your function's entry point](functions-reference-node.md#configure-function-entry-point) below.

Your exported function is passed a number of arguments on execution. The first argument it takes is always a `context` object. 

# [2.x+](#tab/v2-v3-v4-export)


When using the [`async function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) declaration or plain JavaScript [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) in version 2.x, 3.x, or 4.x of the Functions runtime, you don't need to explicitly call the [`context.done`](#contextdone-method) callback to signal that your function has completed. Your function completes when the exported async function/Promise completes. 

The following example is a simple function that logs that it was triggered and immediately completes execution.

```javascript
module.exports = async function (context) {
    context.log('JavaScript trigger function processed a request.');
};
```

When exporting an async function, you can also configure an output binding to take the `return` value. This is recommended if you only have one output binding.

# [1.x](#tab/v1-export)

If your function is synchronous (doesn't return a Promise), you must pass the `context` object, as calling `context.done` is required for correct use.

```javascript
// You should include `context`
// Other arguments like `myTrigger` are optional
module.exports = function(context, myTrigger, myInput, myOtherInput) {
    // function logic goes here :)
    context.done();
};
```


---

### Returning from the function

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
 - **_[Recommended]_ As parameters passed to your function.** They're passed to the function in the same order that they're defined in *function.json*. The `name` property defined in *function.json* doesn't need to match the name of your parameter, although it should.
 
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

### Outputs
Outputs (bindings of `direction === "out"`) can be written to by a function in a number of ways. In all cases, the `name` property of the binding as defined in *function.json* corresponds to the name of the object member written to in your function. 

You can assign data to output bindings in one of the following ways (don't combine these methods):

- **_[Recommended for multiple outputs]_ Returning an object.** If you are using an async/Promise returning function, you can return an object with assigned output data. In the example below, the output bindings are named "httpResponse" and "queueOutput" in *function.json*.

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

  
- **_[Recommended for single output]_ Returning a value directly and using the $return binding name.** This only works for async/Promise returning functions. See example in [exporting an async function](#exporting-a-function). 
- **Assigning values to `context.bindings`** You can assign values directly to context.bindings.

  ```javascript
  module.exports = async function(context) {
      let retMsg = 'Hello, world!';
      context.bindings.httpResponse = {
          body: retMsg
      };
      context.bindings.queueOutput = retMsg;
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

The runtime uses a `context` object to pass data to and from your function and the runtime. Used to read and set data from bindings and for writing to logs, the `context` object is always the first parameter passed to a function.


```javascript
module.exports = async function(context){

    // function logic goes here

    context.log("The function has executed.");
};
```

The context passed into your function exposes an `executionContext` property, which is an object with the following properties:

| Property name  | Type  | Description |
|---------|---------|---------|
| `invocationId` | String | Provides a unique identifier for the specific function invocation. |
| `functionName` | String | Provides the name of the running function |
| `functionDirectory` | String | Provides the functions app directory. |

The following example shows how to return the `invocationId`.

```javascript
module.exports = async function (context, req) {
    context.res = {
        body: context.executionContext.invocationId
    };
};
```

## context.bindings property

```js
context.bindings
```

Returns a named object that is used to read or assign binding data. Input and trigger binding data can be accessed by reading properties on `context.bindings`. Output binding data can be assigned by adding data to `context.bindings`

For example, the following binding definitions in your function.json let you access the contents of a queue from `context.bindings.myInput` and assign outputs to a queue using `context.bindings.myOutput`.

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

In a synchronous function, you can choose to define output binding data using the `context.done` method instead of the `context.binding` object (see below).

## context.bindingData property

```js
context.bindingData
```

Returns a named object that contains trigger metadata and function invocation data (`invocationId`, `sys.methodName`, `sys.utcNow`, `sys.randGuid`). For an example of trigger metadata, see this [event hubs example](functions-bindings-event-hubs-trigger.md).

## context.done method

# [2.x](#tab/v2-v3-v4-done)

In 2.x, 3.x, and 4.x, the function should be marked as async even if there's no awaited function call inside the function, and the function doesn't need to call context.done to indicate the end of the function.

```javascript
//you don't need an awaited function call inside to use async
module.exports = async function (context, req) {
    context.log("you don't need an awaited function call inside to use async")
};
```
# [1.x](#tab/v1-done)

The **context.done** method is used by 1.x synchronous functions. In 2.x, 3.x, and 4.x, the function should be marked as async even if there's no awaited function call inside the function, and the function doesn't need to call context.done to indicate the end of the function.

```javascript
module.exports = function (context, req) {
    // 1.x Synchronous code only
    // Even though we set myOutput to have:
    //  -> text: 'hello world', number: 123
    context.bindings.myOutput = { text: 'hello world', number: 123 };
    
    // If we pass an object to the done function...
    context.done(null, { myOutput: { text: 'hello there, world', noNumber: true }});
    // the done method overwrites the myOutput binding to be: 
    //  -> text: 'hello there, world', noNumber: true
}
```


---

## context.log method  

```js
context.log(message)
```

Allows you to write to the streaming function logs at the default trace level, with other logging levels available. Trace logging is described in detail in the next section. 

## Write trace output to logs

In Functions, you use the `context.log` methods to write trace output to the logs and the console. When you call `context.log()`, your message is written to the logs at the default trace level, which is the _info_ trace level. Functions integrates with Azure Application Insights to better capture your function app logs. Application Insights, part of Azure Monitor, provides facilities for collection, visual rendering, and analysis of both application telemetry and your trace outputs. To learn more, see [monitoring Azure Functions](functions-monitoring.md).

The following example writes a log at the info trace level, including the invocation ID:

```javascript
context.log("Something has happened. " + context.invocationId); 
```

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

> [!NOTE]  
> Don't use `console.log` to write trace outputs. Because output from `console.log` is captured at the function app level, it's not tied to a specific function invocation and isn't displayed in a specific function's logs. Also, version 1.x of the Functions runtime doesn't support using `console.log` to write to the console.

### Trace levels

In addition to the default level, the following logging methods are available that let you write function logs at specific trace levels.

| Method                 | Description                                |
| ---------------------- | ------------------------------------------ |
| **context.log.error(_message_)**   | Writes an error-level event to the logs.   |
| **context.log.warn(_message_)**    | Writes a warning-level event to the logs. |
| **context.log.info(_message_)**    | Writes to info level logging, or lower.    |
| **context.log.verbose(_message_)** | Writes to verbose level logging.           |

The following example writes the same log at the warning trace level, instead of the info level:

```javascript
context.log.warn("Something has happened. " + context.invocationId); 
```

Because _error_ is the highest trace level, this trace is written to the output at all trace levels as long as logging is enabled.

### Configure the trace level for logging

Functions lets you define the threshold trace level for writing to the logs or the console. The specific threshold settings depend on your version of the Functions runtime.

# [2.x+](#tab/v2)

To set the threshold for traces written to the logs, use the `logging.logLevel` property in the host.json file. This JSON object lets you define a default threshold for all functions in your function app, plus you can define specific thresholds for individual functions. To learn more, see [How to configure monitoring for Azure Functions](configure-monitoring.md).

# [1.x](#tab/v1)

To set the threshold for all traces written to logs and the console, use the `tracing.consoleLevel` property in the host.json file. This setting applies to all functions in your function app. The following example sets the trace threshold to enable verbose logging:

```json
{
    "tracing": {
        "consoleLevel": "verbose"
    }
}  
```

Values of **consoleLevel** correspond to the names of the `context.log` methods. To disable all trace logging to the console, set **consoleLevel** to _off_. For more information, see [host.json v1.x reference](functions-host-json-v1.md).

---

## Log custom telemetry

By default, Functions writes output as traces to Application Insights. For more control, you can instead use the [Application Insights Node.js SDK](https://github.com/microsoft/applicationinsights-node.js) to send custom telemetry data to your Application Insights instance. 

# [2.x+](#tab/v2-log-custom-telemetry)

```javascript
const appInsights = require("applicationinsights");
appInsights.setup();
const client = appInsights.defaultClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Use this with 'tagOverrides' to correlate custom telemetry to the parent function invocation.
    var operationIdOverride = {"ai.operation.id":context.traceContext.traceparent};

    client.trackEvent({name: "my custom event", tagOverrides:operationIdOverride, properties: {customProperty2: "custom property value"}});
    client.trackException({exception: new Error("handled exceptions can be logged with this method"), tagOverrides:operationIdOverride});
    client.trackMetric({name: "custom metric", value: 3, tagOverrides:operationIdOverride});
    client.trackTrace({message: "trace message", tagOverrides:operationIdOverride});
    client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL", tagOverrides:operationIdOverride});
    client.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true, tagOverrides:operationIdOverride});
};
```

# [1.x](#tab/v1-log-custom-telemetry)

```javascript
const appInsights = require("applicationinsights");
appInsights.setup();
const client = appInsights.defaultClient;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Use this with 'tagOverrides' to correlate custom telemetry to the parent function invocation.
    var operationIdOverride = {"ai.operation.id":context.operationId};

    client.trackEvent({name: "my custom event", tagOverrides:operationIdOverride, properties: {customProperty2: "custom property value"}});
    client.trackException({exception: new Error("handled exceptions can be logged with this method"), tagOverrides:operationIdOverride});
    client.trackMetric({name: "custom metric", value: 3, tagOverrides:operationIdOverride});
    client.trackTrace({message: "trace message", tagOverrides:operationIdOverride});
    client.trackDependency({target:"http://dbname", name:"select customers proc", data:"SELECT * FROM Customers", duration:231, resultCode:0, success: true, dependencyTypeName: "ZSQL", tagOverrides:operationIdOverride});
    client.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true, tagOverrides:operationIdOverride});

    context.done();
};
```

---

The `tagOverrides` parameter sets the `operation_Id` to the function's invocation ID. This setting enables you to correlate all of the automatically generated and custom telemetry for a given function invocation.

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
| _cookies_ | An array of HTTP cookie objects that are set in the response. An HTTP cookie object has a `name`, `value`, and other cookie properties, such as `maxAge` or `sameSite`. |

### Accessing the request and response 

When you work with HTTP triggers, you can access the HTTP request and response objects in a number of ways:

+ **From `req` and `res` properties on the `context` object.** In this way, you can use the conventional pattern to access HTTP data from the context object, instead of having to use the full `context.bindings.name` pattern. The following example shows how to access the `req` and `res` objects on the `context`:

    ```javascript
    // You can access your HTTP request off the context ...
    if(context.req.body.emoji === ':pizza:') context.log('Yay!');
    // and also set your HTTP response
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

+ **_[Response only]_ By returning the response.** A special binding name of `$return` allows you to assign the function's return value to the output binding. The following HTTP output binding defines a `$return` output parameter:

    ```json
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
    ``` 

    # [2.x+](#tab/v2-accessing-request-and-response)

    In a 2.x+ function, you can return the response object directly:

    ```javascript
    return { status: 201, body: "Insert succeeded." };
    ```

    # [1.x](#tab/v1-accessing-request-and-response)

    In a 1.x sync function, return the response object using the second argument of `context.done()`:

    ```javascript
     // Define a valid response object.
    res = { status: 201, body: "Insert succeeded." };
    context.done(null, res);   
    ```  
    ---

Request and response keys are in lowercase.

## Scaling and concurrency

By default, Azure Functions automatically monitors the load on your application and creates additional host instances for Node.js as needed. Functions uses built-in (not user configurable) thresholds for different trigger types to decide when to add instances, such as the age of messages and queue size for QueueTrigger. For more information, see [How the Consumption and Premium plans work](event-driven-scaling.md).

This scaling behavior is sufficient for many Node.js applications. For CPU-bound applications, you can improve performance further by using multiple language worker processes.

By default, every Functions host instance has a single language worker process. You can increase the number of worker processes per host (up to 10) by using the [FUNCTIONS_WORKER_PROCESS_COUNT](functions-app-settings.md#functions_worker_process_count) application setting. Azure Functions then tries to evenly distribute simultaneous function invocations across these workers. This makes it less likely that a CPU-intensive function blocks other functions from running.

The FUNCTIONS_WORKER_PROCESS_COUNT applies to each host that Functions creates when scaling out your application to meet demand. 

## Node version

The following table shows current supported Node.js versions for each major version of the Functions runtime, by operating system:

| Functions version | Node version (Windows) | Node Version (Linux) |
|---|---| --- |
| 4.x (recommended) | `~18`(preview)<br/>`~16`<br/>`~14` | `node|18`(preview)<br/>`node|16`<br/>`node|14` |
| 3.x | `~14`<br/>`~12`<br/>`~10` | `node|14`<br/>`node|12`<br/>`node|10` |
| 2.x  | `~12`<br/>`~10`<br/>`~8` | `node|10`<br/>`node|8`  |
| 1.x | 6.11.2 (locked by the runtime) | n/a |

You can see the current version that the runtime is using by logging `process.version` from any function.

### Setting the Node version

# [Windows](#tab/windows-setting-the-node-version)

For Windows function apps, target the version in Azure by setting the `WEBSITE_NODE_DEFAULT_VERSION` [app setting](functions-how-to-use-azure-function-app-settings.md#settings) to a supported LTS version, such as `~16`.

# [Linux](#tab/linux-setting-the-node-version)

For Linux function apps, run the following Azure CLI command to update the Node version.

```azurecli
az functionapp config set --linux-fx-version "node|14" --name "<MY_APP_NAME>" --resource-group "<MY_RESOURCE_GROUP_NAME>"
```

---

To learn more about Azure Functions runtime support policy, please refer to this [article](./language-support-policy.md).

## Dependency management
In order to use community libraries in your JavaScript code, as is shown in the below example, you need to ensure that all dependencies are installed on your Function App in Azure.

```javascript
// Import the underscore.js library
const _ = require('underscore');

module.exports = async function(context) {
    // Using our imported underscore.js library
    const matched_names = _
        .where(context.bindings.myInput.names, {first: 'Carla'});
}
```

> [!NOTE]
> You should define a `package.json` file at the root of your Function App. Defining the file lets all functions in the app share the same cached packages, which gives the best performance. If a version conflict arises, you can resolve it by adding a `package.json` file in the folder of a specific function.  

When deploying Function Apps from source control, any `package.json` file present in your repo, will trigger an `npm install` in its folder during deployment. But when deploying via the Portal or CLI, you'll have to manually install the packages.

There are two ways to install packages on your Function App: 

### Deploying with Dependencies
1. Install all requisite packages locally by running `npm install`.

2. Deploy your code, and ensure that the `node_modules` folder is included in the deployment. 


### <a name="using-kudu"></a>Using Kudu (Windows only)
1. Go to `https://<function_app_name>.scm.azurewebsites.net`.

2. Select **Debug Console** > **CMD**.

3. Go to `D:\home\site\wwwroot`, and then drag your package.json file to the **wwwroot** folder at the top half of the page.  
    You can upload files to your function app in other ways also. For more information, see [How to update function app files](functions-reference.md#fileupdate). 

4. After the package.json file is uploaded, run the `npm install` command in the **Kudu remote execution console**.  
    This action downloads the packages indicated in the package.json file and restarts the function app.

## Environment variables

Add your own environment variables to a function app, in both your local and cloud environments, such as operational secrets (connection strings, keys, and endpoints) or environmental settings (such as profiling variables). Access these settings using `process.env` in your function code.

### In local development environment

When running locally, your functions project includes a [`local.settings.json` file](./functions-run-local.md), where you store your environment variables in the `Values` object. 

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "translatorTextEndPoint": "https://api.cognitive.microsofttranslator.com/",
    "translatorTextKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "languageWorkers__node__arguments": "--prof"
  }
}
```

### In Azure cloud environment

When running in Azure, the function app lets you set and use [Application settings](functions-app-settings.md), such as service connection strings, and exposes these settings as environment variables during execution. 

[!INCLUDE [Function app settings](../../includes/functions-app-settings.md)]

### Access environment variables in code

Access application settings as environment variables  using `process.env`, as shown here in the second and third calls to `context.log()` where we log the `AzureWebJobsStorage` and `WEBSITE_SITE_NAME` environment variables:

```javascript
module.exports = async function (context, myTimer) {
    context.log("AzureWebJobsStorage: " + process.env["AzureWebJobsStorage"]);
    context.log("WEBSITE_SITE_NAME: " + process.env["WEBSITE_SITE_NAME"]);
};
```

## <a name="ecmascript-modules"></a>ECMAScript modules (preview)

> [!NOTE]
> As ECMAScript modules are currently a preview feature in Node.js 14 and 16 Azure Functions.

[ECMAScript modules](https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_modules_ecmascript_modules) (ES modules) are the new official standard module system for Node.js. So far, the code samples in this article use the CommonJS syntax. When running Azure Functions in Node.js 14 or higher, you can choose to write your functions using ES modules syntax.

To use ES modules in a function, change its filename to use a `.mjs` extension. The following *index.mjs* file example is an HTTP triggered function that uses ES modules syntax to import the `uuid` library and return a value.

```js
import { v4 as uuidv4 } from 'uuid';

export default async function (context, req) {
    context.res.body = uuidv4();
};
```

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
 | | - sayHello.js
 | - node_modules
 | | - ... packages ...
 | - package.json
```

The `function.json` for `myNodeFunction` should include a `scriptFile` property pointing to the file with the exported function to run.

```json
{
  "scriptFile": "../lib/sayHello.js",
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

In Functions v2.x or higher, which supports the `this` parameter in user functions, the function code could then be as in the following example:

```javascript
class MyObj {
    constructor() {
        this.foo = 1;
    };

    async logFoo(context) { 
        context.log("Foo is " + this.foo); 
    }
}

const myObj = new MyObj();
module.exports = myObj;
```

In this example, it's important to note that although an object is being exported, there are no guarantees for preserving state between executions.

## Local debugging

When started with the `--inspect` parameter, a Node.js process listens for a debugging client on the specified port. In Azure Functions 2.x or higher, you can specify arguments to pass into the Node.js process that runs your code by adding the environment variable or App Setting `languageWorkers:node:arguments = <args>`. 

To debug locally, add `"languageWorkers:node:arguments": "--inspect=5858"` under `Values` in your [local.settings.json](./functions-develop-local.md#local-settings-file) file and attach a debugger to port 5858.

When debugging using VS Code, the `--inspect` parameter is automatically added using the `port` value in the project's launch.json file.

In version 1.x, setting `languageWorkers:node:arguments` won't work. The debug port can be selected with the [`--nodeDebugPort`](./functions-run-local.md#start) parameter on Azure Functions Core Tools.

> [!NOTE]
> You can only configure `languageWorkers:node:arguments` when running the function app locally.

## Testing 

Testing your functions includes:

* **HTTP end-to-end**: To test a function from its HTTP endpoint, you can use any tool that can make an HTTP request such as cURL, Postman, or JavaScript's fetch method. 
* **Integration testing**: Integration test includes the function app layer. This testing means you need to control the parameters into the function including the request and the context. The context is unique to each kind of trigger and means you need to know the incoming and outgoing bindings for that [trigger type](functions-triggers-bindings.md?tabs=javascript#supported-bindings).

    Learn more about integration testing and mocking the context layer with an experimental GitHub repo, [https://github.com/anthonychu/azure-functions-test-utils](https://github.com/anthonychu/azure-functions-test-utils).

* **Unit testing**: Unit testing is performed within the function app. You can use any tool that can test JavaScript, such as Jest or Mocha. 

## TypeScript

When you target version 2.x or higher of the Functions runtime, both [Azure Functions for Visual Studio Code](./create-first-function-cli-typescript.md) and the [Azure Functions Core Tools](functions-run-local.md) let you create function apps using a template that supports TypeScript function app projects. The template generates `package.json` and `tsconfig.json` project files that make it easier to transpile, run, and publish JavaScript functions from TypeScript code with these tools.

A generated `.funcignore` file is used to indicate which files are excluded when a project is published to Azure.  

TypeScript files (.ts) are transpiled into JavaScript files (.js) in the `dist` output directory. TypeScript templates use the [`scriptFile` parameter](#using-scriptfile) in `function.json` to indicate the location of the corresponding .js file in the `dist` folder. The output location is set by the template by using `outDir` parameter in the `tsconfig.json` file. If you change this setting or the name of the folder, the runtime isn't able to find the code to run.

The way that you locally develop and deploy from a TypeScript project depends on your development tool.

### Visual Studio Code

The [Azure Functions for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) extension lets you develop your functions using TypeScript. The Core Tools is a requirement of the Azure Functions extension.

To create a TypeScript function app in Visual Studio Code, choose `TypeScript` as your language when you create a function app.

When you press **F5** to run the app locally, transpilation is done before the host (func.exe) is initialized. 

When you deploy your function app to Azure using the **Deploy to function app...** button, the Azure Functions extension first generates a production-ready build of JavaScript files from the TypeScript source files.

### Azure Functions Core Tools

There are several ways in which a TypeScript project differs from a JavaScript project when using the Core Tools.

#### Create project

To create a TypeScript function app project using Core Tools, you must specify the TypeScript language option when you create your function app. You can do this in one of the following ways:

- Run the `func init` command, select `node` as your language stack, and then select `typescript`.

- Run the `func init --worker-runtime typescript` command.

#### Run local

To run your function app code locally using Core Tools, use the following commands instead of `func host start`: 

```command
npm install
npm start
```

The `npm start` command is equivalent to the following commands:

- `npm run build`
- `func extensions install`
- `tsc`
- `func start`

#### Publish to Azure

Before you use the [`func azure functionapp publish`] command to deploy to Azure, you create a production-ready build of JavaScript files from the TypeScript source files. 

The following commands prepare and publish your TypeScript project using Core Tools: 

```command
npm run build:production 
func azure functionapp publish <APP_NAME>
```

In this command, replace `<APP_NAME>` with the name of your function app.

## Considerations for JavaScript functions

When you work with JavaScript functions, be aware of the considerations in the following sections.

### Choose single-vCPU App Service plans

When you create a function app that uses the App Service plan, we recommend that you select a single-vCPU plan rather than a plan with multiple vCPUs. Today, Functions runs JavaScript functions more efficiently on single-vCPU VMs, and using larger VMs doesn't produce the expected performance improvements. When necessary, you can manually scale out by adding more single-vCPU VM instances, or you can enable autoscale. For more information, see [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md?toc=/azure/app-service/toc.json).

### Cold Start

When developing Azure Functions in the serverless hosting model, cold starts are a reality. *Cold start* refers to the fact that when your function app starts for the first time after a period of inactivity, it takes longer to start up. For JavaScript functions with large dependency trees in particular, cold start can be significant. To speed up the cold start process, [run your functions as a package file](run-functions-from-deployment-package.md) when possible. Many deployment methods use the run from package model by default, but if you're experiencing large cold starts and aren't running this way, this change can offer a significant improvement.

### Connection Limits

When you use a service-specific client in an Azure Functions application, don't create a new client with every function invocation. Instead, create a single, static client in the global scope. For more information, see [managing connections in Azure Functions](manage-connections.md).

### Use `async` and `await`

When writing Azure Functions in JavaScript, you should write code using the `async` and `await` keywords. Writing code using `async` and `await` instead of callbacks or `.then` and `.catch` with Promises helps avoid two common problems:
 - Throwing uncaught exceptions that [crash the Node.js process](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly), potentially affecting the execution of other functions.
 - Unexpected behavior, such as missing logs from context.log, caused by asynchronous calls that aren't properly awaited.

In the example below, the asynchronous method `fs.readFile` is invoked with an error-first callback function as its second parameter. This code causes both of the issues mentioned above. An exception that isn't explicitly caught in the correct scope crashed the entire process (issue #1). Calling the 1.x `context.done()` outside of the scope of the callback function means that the function invocation may end before the file is read (issue #2). In this example, calling 1.x `context.done()` too early results in missing log entries starting with `Data from file:`.

```javascript
// NOT RECOMMENDED PATTERN
const fs = require('fs');

module.exports = function (context) {
    fs.readFile('./hello.txt', (err, data) => {
        if (err) {
            context.log.error('ERROR', err);
            // BUG #1: This will result in an uncaught exception that crashes the entire process
            throw err;
        }
        context.log(`Data from file: ${data}`);
        // context.done() should be called here
    });
    // BUG #2: Data is not guaranteed to be read before the Azure Function's invocation ends
    context.done();
}
```

Using the `async` and `await` keywords helps avoid both of these errors. You should use the Node.js utility function [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original) to turn error-first callback-style functions into awaitable functions.

In the example below, any unhandled exceptions thrown during the function execution only fail the individual invocation that raised an exception. The `await` keyword means that steps following `readFileAsync` only execute after `readFile` is complete. With `async` and `await`, you also don't need to call the `context.done()` callback.

```javascript
// Recommended pattern
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

module.exports = async function (context) {
    let data;
    try {
        data = await readFileAsync('./hello.txt');
    } catch (err) {
        context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
    }
    context.log(`Data from file: ${data}`);
}
```

## Next steps

For more information, see the following resources:

+ [Best practices for Azure Functions](functions-best-practices.md)
+ [Azure Functions developer reference](functions-reference.md)
+ [Azure Functions triggers and bindings](functions-triggers-bindings.md)

[`func azure functionapp publish`]: functions-run-local.md#project-file-deployment
