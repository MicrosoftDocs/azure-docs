<properties
	pageTitle="Azure Functions HTTP and webhook bindings | Microsoft Azure"
	description="Understand how to use HTTP and webhook triggers and bindings in Azure Functions."
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
	ms.date="10/07/2016"
	ms.author="chrande"/>

# Azure Functions HTTP and webhook bindings

[AZURE.INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code HTTP and webhook triggers and bindings in Azure Functions. 
Azure Functions supports trigger and output bindings for HTTP requests and webhooks.

An [HTTP trigger binding](#httptrigger) lets you invoke a function with an HTTP request. A 
[webhook trigger binding](#hooktrigger) trigger is an HTTP trigger that's tailored for
a specific [webhook](https://en.wikipedia.org/wiki/Webhook) provider (e.g. [GitHub](https://developer.github.com/webhooks/) and 
[Slack](https://api.slack.com/outgoing-webhooks)).

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

<a name="httptrigger"></a>
## HTTP trigger binding

Use the HTTP trigger to respond to an HTTP request. 

The HTTP trigger to a function uses the following JSON object in the `bindings` array of function.json:

    {
        "name": "{Name of request object (or request body for Node.js) in function signature}",
        "type": "httpTrigger",
        "direction": "in",
        "authLevel": "{'function', 'anonymous', or 'admin' - see below}"
    },

`authLevel` defines how the HTTP trigger validates the HTTP requests:

- `anonymous`: no the API key required
- `function`: function-specific API key required
- `admin`: master API key required

See [Validate requests with API keys](#validate) below for more information.

<a name="httptriggerusage"></a>
## HTTP trigger usage

* For Node.js functions, the Functions runtime provides the request body instead of the request object. There is no special handling for C# functions, because you control what is provided by specifying the parameter type. If you specify `HttpRequestMessage` you get the request object. If you specify a POCO type, the Functions runtime tries to parse a JSON object in the body of the request to populate the object properties.

See the language-specific sample that looks for a `name` parameter either in the query string or the body of the HTTP request.

- [C#](#httptriggercsharp)
- [F#](#httptriggerfsharp)
- [Node.js](#httptriggernodejs)

<a name="httptriggercsharp"></a>
### HTTP trigger usage in C\# 

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

<a name="httptriggerfsharp"></a>
### HTTP trigger usage in F\# 

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

You will need a `project.json` file that uses NuGet to reference the `FSharp.Interop.Dynamic` and `Dynamitey` assemblies, like this:

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

This will use NuGet to fetch your dependencies and will reference them in your script.

<a name="httptriggernodejs"></a>
### HTTP trigger usage in nodejs 

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

<a name="hooktrigger"></a>
## Webhook trigger binding

Use the webhook trigger to respond to a specific webhook provider. A webhook trigger is an HTTP trigger that has the 
following features designed for webhooks:

* The request handlers are implemented using [Microsft ASP.NET WebHooks](https://github.com/aspnet/WebHooks).
* For some webhook providers (e.g. [GitHub](http://go.microsoft.com/fwlink/?LinkID=761099&clcid=0x409)), the Functions runtime takes care of the 
[validation logic](https://developer.github.com/webhooks/securing/#validating-payloads-from-github) for you.

The webhook trigger to a function uses the following JSON object in the `bindings` array of function.json:

    {
        "webHookType": "{github|slack|genericJson}",
        "name": "{Name of request object (or request body for Node.js) in function signature}",
        "type": "httpTrigger",
        "direction": "in",
    },

<a name="hooktriggerusage"></a>
## Webhook trigger usage

See the language-specific sample that logs GitHub issue comments.

- [C#](#hooktriggercsharp)
- [F#](#hooktriggerfsharp)
- [Node.js](#hooktriggernodejs)

<a name="hooktriggercsharp"></a>
### Webhook usage in C\# 

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
### Webhook usage in F\# 

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
### Webhook usage in nodejs 

```javascript
module.exports = function (context, data) {
    context.log('GitHub WebHook triggered!', data.comment.body);
    context.res = { body: 'New GitHub comment: ' + data.comment.body };
    context.done();
};
```

<a name="output"></a>
## HTTP and Webhook output binding

Use the HTTP output binding to respond to the HTTP request sender.

    {
        "name": "res",
        "type": "http",
        "direction": "out"
    }

<a name="outputusage"></a>
## Output usage

See the language-specific sample that ....

- [C#](#outcsharp)
- [F#](#outfsharp)
- [Node.js](#outnodejs)

<a name="outcsharp"></a>
### Output usage in C\# 

<a name="outfsharp"></a>
### Output usage in F\# 

<a name="outnodejs"></a>
### Output usage in Node.js

<a name="url"></a>
## URL to trigger the function

To trigger a function, send an HTTP request to the following URL:

    https://{function app name}.azurewebsites.net/api/{function name} 

If you need to validate API keys in HTTP requests, see [Validate requests with API keys](#validate) for information on crafting your web request.

<a name="validate"></a>
## Validate requests with API keys

By default, an HTTP or webhook triggered function requires an API key in the HTTP request. So your HTTP request normally looks like this: 

    https://{functionapp}.azurewebsites.net/api/{function}?code={API key}

The key can be included in a query string variable named `code`, or it can be included in an `x-functions-key` HTTP header. 

### Disable API keys

For generic HTTP triggers, turn off the API key requirement by using `"authLevel": "anonymous"` in the binding JSON 
(see [HTTP trigger binding](#httptrigger)).

Webhook triggers require HTTP request validation, so you cannot disable API keys.

<a name="keytypes"></a>
### Types of API keys

The following list shows you the three types of API keys you can use and where each is defined in the file system of the function app: 

- Function-specific `key`: defined in *D:\home\data\Functions\secrets\{function name}.json*. Use it to trigger only the function that matches the filename.
- `masterKey`: defined in *D:\home\data\Functions\secrets\host.json*. Use it to trigger any function in your function app, even if it's disabled. 
- `functionKey`: defined in *D:\home\data\Functions\secrets\host.json*. Use it to trigger any function in your function app that is not disabled. 

If you configure an [HTTP trigger binding](#httptrigger) with `"authLevel": "admin"` in the binding JSON, then the funtion accepts only 
the `masterKey` API key.

>[AZURE.NOTE] To minimize your function app's attach surface, only share the function-specific `key` with your HTTP request sender. Do not 
share the `masterKey` API key with the webhook provider.

## Configure webhook providers

The GitHub webhook is simple to configure. You create GitHub webhook trigger in Functions, and copy its [URL](#url) and [API key](validate) 
into your GitHub repository's **Add webhook** page.

![](./media/functions-bindings-http-webhook/github-add-webhook.png)

The [Slack webhook](https://api.slack.com/outgoing-webhooks) generates a token for you instead of letting you specify it, so you must configure
the your function-specific `key` API key with the token from Slack (to see where to define the API key, see [Types of API keys](#keytypes)).

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)] 
