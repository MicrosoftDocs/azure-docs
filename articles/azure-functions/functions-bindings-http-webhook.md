---
title: Azure Functions HTTP and webhook bindings | Microsoft Docs
description: Understand how to use HTTP and webhook triggers and bindings in Azure Functions.
services: functions
documentationcenter: na
author: mattchenderson
manager: cfowler
editor: ''
tags: ''
keywords: azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture, HTTP, API, REST

ms.assetid: 2b12200d-63d8-4ec1-9da8-39831d5a51b1
ms.service: functions
ms.devlang: multiple
ms.topic: reference
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 08/26/2017
ms.author: mahender

---
# Azure Functions HTTP and webhook bindings
[!INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and work with HTTP triggers and bindings in Azure Functions.
With these, you can use Azure Functions to build serverless APIs and respond to webhooks.

Azure Functions provides the following bindings:
- An [HTTP trigger](#httptrigger) lets you invoke a function with an HTTP request. This can be customized to respond to [webhooks](#hooktrigger).
- An [HTTP output binding](#output) allows you to respond to the request.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

[!INCLUDE [HTTP client best practices](../../includes/functions-http-client-best-practices.md)]

<a name="httptrigger"></a>

## HTTP trigger
The HTTP trigger executes your function in response to an HTTP request. You can customize it to respond to a particular URL or set of HTTP methods. An HTTP trigger can also be configured to respond to webhooks. 

If using the Functions portal, you can also get started right away using a pre-made template. Select **New function** and choose "API & Webhooks" from the **Scenario** dropdown. Select one of the templates and click **Create**.

By default, an HTTP trigger responds to the request with an HTTP 200 OK status code and an empty body. To modify the response, configure an [HTTP output binding](#output)

### Configuring an HTTP trigger
An HTTP trigger is defined by a JSON object in the `bindings` array of function.json, as shown in the following example:

```json
{
    "name": "req",
    "type": "httpTrigger",
    "direction": "in",
    "authLevel": "function",
    "methods": [ "get" ],
    "route": "values/{id}"
},
```
The binding supports the following properties:

|Property  |Description  |
|---------|---------|
| **name** | Required - the variable name used in function code for the request or request body. See [Working with an HTTP trigger from code](#httptriggerusage). |
| **type** | Required - must be set to `httpTrigger`. |
| **direction** | Required - must be set to `in`. |
| **authLevel** | Determines what keys, if any, need to be present on the request in order to invoke the function. The value can be one of the following values: <ul><li><code>anonymous</code>&mdash;No API key is required.</li><li><code>function</code>&mdash;A function-specific API key is required. This is the default value if none is provided.</li><li><code>admin</code>&mdash;The master key is required.</li></ul> For more information, see [Working with keys](#keys). |
| **methods** | An array of the HTTP methods to which the function  responds. If not specified, the function responds to all HTTP methods. See [Customizing the HTTP endpoint](#url). |
| **route** | Defines the route template, controlling to which request URLs your function responds. The default value if none is provided is `<functionname>`. For more information, see [Customizing the HTTP endpoint](#url). |
| **webHookType** | Configures the HTTP trigger to act as a webhook receiver for the specified provider. Do not use the _methods_ property when using this setting. The value can be one of the following values:<ul><li><code>genericJson</code>&mdash;A general-purpose webhook endpoint without logic for a specific provider.</li><li><code>github</code>&mdash;The function responds to GitHub webhooks. Do not use the  _authLevel_ property when using this value.</li><li><code>slack</code>&mdash;The function responds to Slack webhooks. Do not use the _authLevel_ property when using this value.</li></ul> For more information, see [Responding to webhooks](#hooktrigger). |

<a name="httptriggerusage"></a>
### Working with an HTTP trigger from code
For C# and F# functions, you can declare the type of your trigger input to be either `HttpRequestMessage` or a custom .NET type. If you choose `HttpRequestMessage`, you get full access to the request object. For a custom .NET type, Functions tries to parse the JSON request body to set the object properties. 

For Node.js functions, the Functions runtime provides the request body instead of the request object. For more information, see [HTTP trigger samples](#httptriggersample).


<a name="output"></a>
## HTTP response output binding
Use the HTTP output binding to respond to the HTTP request sender. This binding requires an HTTP trigger and allows you to customize the response associated with the trigger's request. If an HTTP output binding is not provided, an HTTP trigger returns HTTP 200 OK with an empty body. 

### Configuring an HTTP output binding
An HTTP output binding is defined a JSON object in the `bindings` array of function.json, as shown in the following example:

```json
{
    "name": "res",
    "type": "http",
    "direction": "out"
}
```
The binding supports the following required properties:

|Property  |Description  |
|---------|---------|
|**name** | The variable name used in function code for the response. See [Working with an HTTP output binding from code](#outputusage). |
| **type** |Must be set to `http`. |
| **direction** | Must be set to `out`. |

<a name="outputusage"></a>
### Working with an HTTP output binding from code
You can use the output parameter to respond to the http or webhook caller. You can also use the language-standard response patterns. For example responses, see [HTTP trigger samples](#httptriggersample) and [Webhook trigger samples](#hooktriggersample).


<a name="hooktrigger"></a>
## Responding to webhooks
An HTTP trigger with the _webHookType_ property is configured to respond to [webhooks](https://en.wikipedia.org/wiki/Webhook). The basic configuration uses the "genericJson" setting. This restricts requests to only those using HTTP POST and with the `application/json` content type.

The trigger can additionally be tailored to a specific webhook provider, such as [GitHub](https://developer.github.com/webhooks/) or [Slack](https://api.slack.com/outgoing-webhooks). When a provider is specified, the Functions runtime can handle the provider validation logic for you.  

### Configuring GitHub as a webhook provider
To respond to GitHub webhooks, first create your function with an HTTP Trigger, and set the **webHookType** property to `github`. Then copy its [URL](#url) and [API key](#keys) into the **Add webhook** page of your GitHub repository. 

![](./media/functions-bindings-http-webhook/github-add-webhook.png)

For an example, see [Create a function triggered by a GitHub webhook](functions-create-github-webhook-triggered-function.md).

### Configuring Slack as a webhook provider
The Slack webhook generates a token for you instead of letting you specify it, so you must configure
a function-specific key with the token from Slack. See [Working with keys](#keys).

<a name="url"></a>
## Customizing the HTTP endpoint
By default when you create a function for an HTTP trigger, or WebHook, the function is addressable with a route of the form:

    http://<yourapp>.azurewebsites.net/api/<funcname> 

You can customize this route using the optional `route` property on the HTTP trigger's input binding. As an example, the following *function.json* file defines a `route` property for an HTTP trigger:

```json
{
    "bindings": [
    {
        "type": "httpTrigger",
        "name": "req",
        "direction": "in",
        "methods": [ "get" ],
        "route": "products/{category:alpha}/{id:int?}"
    },
    {
        "type": "http",
        "name": "res",
        "direction": "out"
    }
    ]
}
```

Using this configuration, the function is now addressable with the following route instead of the original route.

    http://<yourapp>.azurewebsites.net/api/products/electronics/357

This allows the function code to support two parameters in the address, _category_ and _id_. You can use any [Web API Route Constraint](https://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#constraints) with your parameters. The following C# function code makes use of both parameters.

```csharp
public static Task<HttpResponseMessage> Run(HttpRequestMessage req, string category, int? id, 
                                                TraceWriter log)
{
    if (id == null)
        return  req.CreateResponse(HttpStatusCode.OK, $"All {category} items were requested.");
    else
        return  req.CreateResponse(HttpStatusCode.OK, $"{category} item with id = {id} has been requested.");
}
```

Here is Node.js function code to use the same route parameters.

```javascript
module.exports = function (context, req) {

    var category = context.bindingData.category;
    var id = context.bindingData.id;

    if (!id) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "All " + category + " items were requested."
        };
    }
    else {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: category + " item with id = " + id + " was requested."
        };
    }

    context.done();
} 
```

By default, all function routes are prefixed with *api*. You can also customize or remove the prefix using the `http.routePrefix` property in your *host.json* file. The following example removes the *api* route prefix by using an empty string for the prefix in the *host.json* file.

```json
{
    "http": {
    "routePrefix": ""
    }
}
```

For detailed information on how to update the *host.json* file for your function, See, [How to update function app files](functions-reference.md#fileupdate). 

For information on other properties you can configure in your *host.json* file, see [host.json reference](https://github.com/Azure/azure-webjobs-sdk-script/wiki/host.json).


<a name="keys"></a>
## Working with keys
HTTP triggers let you use keys for added security. A standard HTTP trigger can use these as an API key, requiring the key to be present on the request. Webhooks can use keys to authorize requests in a variety of ways, depending on what the provider supports.

Keys are stored as part of your function app in Azure and are encrypted at rest. To view your keys, create new ones, or roll keys to new values, navigate to one of your functions within the portal and select "Manage." 

There are two types of keys:
- **Host keys**: These keys are shared by all functions within the function app. When used as an API key, these allow access to any function within the function app.
- **Function keys**: These keys apply only to the specific functions under which they are defined. When used as an API key, these only allow access to that function.

Each key is named for reference, and there is a default key (named "default") at the function and host level. The **master key** is a default host key named "_master" that is defined for each function app. This key cannot be revoked. It provides administrative access to the runtime APIs. Using `"authLevel": "admin"` in the binding JSON requires this key to be presented on the request; any other key results in authorization failure.

> [!IMPORTANT]  
> Due to the elevated permissions granted by the master key, you should not share this key with third parties or distribute it in native client applications. Use caution when choosing the admin authorization level.

### API key authorization
By default, an HTTP trigger requires an API key in the HTTP request. So your HTTP request normally looks like the following:

    https://<yourapp>.azurewebsites.net/api/<function>?code=<ApiKey>

The key can be included in a query string variable named `code`, as above, or it can be included in an `x-functions-key` HTTP header. The value of the key can be any function key defined for the function, or any host key.

You can allow anonymous requests, which do not require keys. You can also require that the master key be used. You change the default authorization level by using the `authLevel` property in the binding JSON. For more information, see [HTTP trigger](#httptrigger).

### Keys and webhooks
Webhook authorization is handled by the webhook receiver component, part of the HTTP trigger, and the mechanism varies based on the webhook type. Each mechanism does, however rely on a key. By default, the function key named "default" is used. To use a different key, configure the webhook provider to send the key name with the request in one of the following ways:

- **Query string**: The provider passes the key name in the `clientid` query string parameter, such as `https://<yourapp>.azurewebsites.net/api/<funcname>?clientid=<keyname>`.
- **Request header**: The provider passes the key name in the `x-functions-clientid` header.

> [!NOTE]
> Function keys take precedence over host keys. When two keys are defined with the same name, the function key is always used.


<a name="httptriggersample"></a>
## HTTP trigger samples
Suppose you have the following HTTP trigger in the `bindings` array of function.json:

```json
{
    "name": "req",
    "type": "httpTrigger",
    "direction": "in",
    "authLevel": "function"
},
```

See the language-specific sample that looks for a `name` parameter either in the query string or the body of the HTTP request.

* [C#](#httptriggercsharp)
* [F#](#httptriggerfsharp)
* [Node.js](#httptriggernodejs)


<a name="httptriggercsharp"></a>
### HTTP trigger sample in C# #
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

You can also bind to a .NET object instead of **HttpRequestMessage**. This object is created from the body of the request, parsed as JSON. Similarly, a type can be passed to the HTTP response output binding and returned as the response body, along with a 200 status code.

```csharp
using System.Net;
using System.Threading.Tasks;

public static string Run(CustomObject req, TraceWriter log)
{
    return "Hello " + req?.name;
}

public class CustomObject {
     public String name {get; set;}
}
}
```

<a name="httptriggerfsharp"></a>
### HTTP trigger sample in F# #
```fsharp
open System.Net
open System.Net.Http
open FSharp.Interop.Dynamic

let Run(req: HttpRequestMessage) =
    async {
        let q =
            req.GetQueryNameValuePairs()
                |> Seq.tryFind (fun kv -> kv.Key = "name")
        match q with
        | Some kv ->
            return req.CreateResponse(HttpStatusCode.OK, "Hello " + kv.Value)
        | None ->
            let! data = Async.AwaitTask(req.Content.ReadAsAsync<obj>())
            try
                return req.CreateResponse(HttpStatusCode.OK, "Hello " + data?name)
            with e ->
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Please pass a name on the query string or in the request body")
    } |> Async.StartAsTask
```

You need a `project.json` file that uses NuGet to reference the `FSharp.Interop.Dynamic` and `Dynamitey` assemblies, like the following:

```json
{
  "frameworks": {
    "net46": {
      "dependencies": {
        "Dynamitey": "1.0.2",
        "FSharp.Interop.Dynamic": "3.0.0"
      }
    }
  }
}
```

This uses NuGet to fetch your dependencies and references them in your script.

<a name="httptriggernodejs"></a>
### HTTP trigger sample in Node.JS
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
     
<a name="hooktriggersample"></a>
## Webhook samples
Suppose you have the following webhook trigger in the `bindings` array of function.json:

```json
{
    "webHookType": "github",
    "name": "req",
    "type": "httpTrigger",
    "direction": "in",
},
```

See the language-specific sample that logs GitHub issue comments.

* [C#](#hooktriggercsharp)
* [F#](#hooktriggerfsharp)
* [Node.js](#hooktriggernodejs)

<a name="hooktriggercsharp"></a>

### Webhook sample in C# #
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

<a name="hooktriggerfsharp"></a>

### Webhook sample in F# #
```fsharp
open System.Net
open System.Net.Http
open FSharp.Interop.Dynamic
open Newtonsoft.Json

type Response = {
    body: string
}

let Run(req: HttpRequestMessage, log: TraceWriter) =
    async {
        let! content = req.Content.ReadAsStringAsync() |> Async.AwaitTask
        let data = content |> JsonConvert.DeserializeObject
        log.Info(sprintf "GitHub WebHook triggered! %s" data?comment?body)
        return req.CreateResponse(
            HttpStatusCode.OK,
            { body = sprintf "New GitHub comment: %s" data?comment?body })
    } |> Async.StartAsTask
```

<a name="hooktriggernodejs"></a>

### Webhook sample in Node.JS
```javascript
module.exports = function (context, data) {
    context.log('GitHub WebHook triggered!', data.comment.body);
    context.res = { body: 'New GitHub comment: ' + data.comment.body };
    context.done();
};
```


## Next steps
[!INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]

