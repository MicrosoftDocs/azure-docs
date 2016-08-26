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
	ms.date="05/16/2016"
	ms.author="chrande"/>

# Azure Functions HTTP and webhook bindings

This article explains how to configure and code HTTP and webhook triggers and bindings in Azure Functions. 

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

## function.json for HTTP and webhook bindings

The *function.json* file provides properties that pertain to both the request and response.

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
      "direction": "in",
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

## WebHook triggers

A WebHook trigger is an HTTP trigger that has the following features designed for WebHooks:

* For specific WebHook providers (currently GitHub and Slack are supported), the Functions runtime validates the provider's signature.
* For Node.js functions, the Functions runtime provides the request body instead of the request object. There is no special handling for C# functions, because you control what is provided by specifying the parameter type. If you specify `HttpRequestMessage` you get the request object. If you specify a POCO type, the Functions runtime tries to parse a JSON object in the body of the request to populate the object properties.
* To trigger a WebHook function the HTTP request must include an API key. For non-WebHook HTTP triggers,  this requirement is optional.

For information about how to set up a GitHub WebHook, see [GitHub Developer - Creating WebHooks](http://go.microsoft.com/fwlink/?LinkID=761099&clcid=0x409).

## URL to trigger the function

To trigger a function, you send an HTTP request to a URL that is a combination of the function app URL and the function name:

```
 https://{function app name}.azurewebsites.net/api/{function name} 
```

## API keys

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

## Example C# code for an HTTP trigger function 

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

## Example Node.js code for an HTTP trigger function 

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

## Example C# code for a GitHub WebHook function 

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

## Example Node.js code for a GitHub WebHook function 

This example code logs GitHub issue comments.

```javascript
module.exports = function (context, data) {
    context.log('GitHub WebHook triggered!', data.comment.body);
    context.res = { body: 'New GitHub comment: ' + data.comment.body };
    context.done();
};
```

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)] 
