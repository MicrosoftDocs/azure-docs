---
title: Azure Functions Web PubSub input binding
description: Learn to handle client events from Web PubSub with HTTP trigger, and return client access URL and token in Azure Functions.
author: Y-Sindo
ms.topic: reference
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/02/2024
ms.author: zityang
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Web PubSub input bindings for Azure Functions

Our extension provides two input binding targeting different needs.

- [`WebPubSubConnection`](#webpubsubconnection)

  To let a client connect to Azure Web PubSub Service, it must know the service endpoint URL and a valid access token. The `WebPubSubConnection` input binding produces required information, so client doesn't need to handle this token generation itself. The token is time-limited and can authenticate a specific user to a connection. Therefore, don't cache the token or share it between clients. An HTTP trigger working with this input binding can be used for clients to retrieve the connection information.

- [`WebPubSubContext`](#webpubsubcontext)

  When using is Static Web Apps, `HttpTrigger` is the only supported trigger and under Web PubSub scenario, we provide the `WebPubSubContext` input binding helps users deserialize upstream http request from service side under Web PubSub protocols. So customers can get similar results comparing to `WebPubSubTrigger` to easily handle in functions.
  When used with `HttpTrigger`, customer requires to configure the HttpTrigger exposed url in event handler accordingly.

## `WebPubSubConnection`

### Example

The following example shows an HTTP trigger function that acquires Web PubSub connection information using the input binding and returns it over HTTP. In following example, the `UserId` is passed in through client request query part like `?userid={User-A}`.

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("WebPubSubConnectionInputBinding")]
public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData req,
[WebPubSubConnectionInput(Hub = "<hub>", , UserId = "{query.userid}", Connection = "<web_pubsub_connection_name>")] WebPubSubConnection connectionInfo)
{
    var response = req.CreateResponse(HttpStatusCode.OK);
    response.WriteAsJsonAsync(connectionInfo);
    return response;
}
```

# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubConnectionInputBinding")]
public static WebPubSubConnection Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubConnection(Hub = "<hub>", UserId = "{query.userid}")] WebPubSubConnection connection)
{
    return connection;
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript"
# [Model v4](#tab/nodejs-v4)

```js
const { app, input } = require('@azure/functions');

const connection = input.generic({
    type: 'webPubSubConnection',
    name: 'connection',
    userId: '{query.userId}',
    hub: '<hub>'
});

app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [connection],
    handler: async (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get('connection')) };
    },
});
```

# [Model v3](#tab/nodejs-v3)

Define input bindings in `function.json`.

```json
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    },
    {
      "type": "webPubSubConnection",
      "name": "connection",
      "userId": "{query.userid}",
      "hub": "<hub>",
      "direction": "in"
    }
  ]
}
```

Define function in `index.js`.

```js
module.exports = function (context, req, connection) {
  context.res = { body: connection };
  context.done();
};
```
---

::: zone-end

::: zone pivot="programming-language-python"

Create a folder *negotiate* and update *negotiate/function.json* and copy following JSON codes.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "webPubSubConnection",
      "name": "connection",
      "userId": "{query.userid}",
      "hub": "<hub>",
      "direction": "in"
    }
  ]
}
```

Define function in *negotiate/__init__.py*.

```python
import logging

import azure.functions as func

def main(req: func.HttpRequest, connection) -> func.HttpResponse:
    return func.HttpResponse(connection)
```

::: zone-end

::: zone pivot="programming-language-powershell"

> [!NOTE]
> Complete samples for this language are pending

::: zone-end

::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.

::: zone-end

### Get authenticated user ID

If the function is triggered by an authenticated client, you can add a user ID claim to the generated token. You can easily add authentication to a function app using App Service Authentication.

App Service Authentication sets HTTP headers named `x-ms-client-principal-id` and `x-ms-client-principal-name` that contain the authenticated user's client principal ID and name, respectively.

You can set the `UserId` property of the binding to the value from either header using a binding expression: `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`.

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("WebPubSubConnectionInputBinding")]
public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData req,
[WebPubSubConnectionInput(Hub = "<hub>", , UserId = "{headers.x-ms-client-principal-id}", Connection = "<web_pubsub_connection_name>")] WebPubSubConnection connectionInfo)
{
    var response = req.CreateResponse(HttpStatusCode.OK);
    response.WriteAsJsonAsync(connectionInfo);
    return response;
}
```

# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubConnectionInputBinding")]
public static WebPubSubConnection Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubConnection(Hub = "<hub>", UserId = "{headers.x-ms-client-principal-id}")] WebPubSubConnection connection)
{
    return connection;
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript"
# [Model v4](#tab/nodejs-v4)

```js
const { app, input } = require('@azure/functions');

const connection = input.generic({
    type: 'webPubSubConnection',
    name: 'connection',
    userId: '{headers.x-ms-client-principal-id}',
    hub: '<hub>'
});

app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [connection],
    handler: async (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get('connection')) };
    },
});
```

# [Model v3](#tab/nodejs-v3)

Define input bindings in `function.json`.

```json
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    },
    {
      "type": "webPubSubConnection",
      "name": "connection",
      "userId": "{headers.x-ms-client-principal-id}",
      "hub": "<hub>",
      "direction": "in"
    }
  ]
}
```

Define function in `index.js`.

```js
module.exports = function (context, req, connection) {
  context.res = { body: connection };
  context.done();
};
```
---

::: zone-end

::: zone pivot="programming-language-python"

Create a folder *negotiate* and update *negotiate/function.json* and copy following JSON codes.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "webPubSubConnection",
      "name": "connection",
      "userId": "{headers.x-ms-client-principal-id}",
      "hub": "<hub>",
      "direction": "in"
    }
  ]
}
```

Define function in *negotiate/__init__.py*.

```python
import logging

import azure.functions as func

def main(req: func.HttpRequest, connection) -> func.HttpResponse:
    return func.HttpResponse(connection)
```

::: zone-end

::: zone pivot="programming-language-powershell"

> [!NOTE]
> Complete samples for this language are pending

::: zone-end

::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.

::: zone-end

### Configuration

The following table explains the binding configuration properties that you set in the function.json file and the `WebPubSubConnection` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSubConnection` |
| **direction** | n/a | Must be set to `in` |
| **name** | n/a | Variable name used in function code for input connection binding object. |
| **hub** | Hub | Required - The value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **userId** | UserId | Optional - the value of the user identifier claim to be set in the access key token. |
| **clientProtocol** | ClientProtocol | Optional - The client protocol type. Valid values include `default` and `mqtt`. <br> For MQTT clients, you must set it to `mqtt`. <br> For other clients, you can omit the property or set it to `default`. |
| **connection** | Connection | Required - The name of the app setting that contains the Web PubSub Service connection string (defaults to "WebPubSubConnectionString"). |

### Usage

::: zone pivot="programming-language-csharp"

`WebPubSubConnection` provides following properties.

| Binding Name | Binding Type | Description |
|---------|---------|---------|
| BaseUri | Uri | Web PubSub client connection uri. |
| Uri | Uri | Absolute Uri of the Web PubSub connection, contains `AccessToken` generated base on the request. |
| AccessToken | string | Generated `AccessToken` based on request UserId and service information. |


::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

`WebPubSubConnection` provides following properties.

| Binding Name | Description |
|---------|---------|
| baseUrl | Web PubSub client connection uri. |
| url | Absolute Uri of the Web PubSub connection, contains `AccessToken` generated base on the request. |
| accessToken | Generated `AccessToken` based on request UserId and service information. |

::: zone-end

::: zone pivot="programming-language-java"
> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.
::: zone-end


### More customization of generated token

Limited to the binding parameter types don't support a way to pass list nor array, the `WebPubSubConnection` isn't fully supported with all the parameters server SDK has, especially `roles`, and also includes `groups` and `expiresAfter`.

::: zone pivot="programming-language-csharp"

When customer needs to add roles or delay building the access token in the function, we suggest you to work with [server SDK for C#](/dotnet/api/overview/azure/messaging.webpubsub-readme).

# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("WebPubSubConnectionCustomRoles")]
public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequestData req)
{
    var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "<hub>", "<web-pubsub-connection-string>");
    var userId = req.Query["userid"].FirstOrDefault();
    // your method to get custom roles.
    var roles = GetRoles(userId);
    var url = await serviceClient.GetClientAccessUriAsync(TimeSpan.FromMinutes(5), userId, roles);
    var response = req.CreateResponse(HttpStatusCode.OK);
    response.WriteString(url.ToString());
    return response;
}
```

# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubConnectionCustomRoles")]
public static async Task<Uri> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
{
    var serviceClient = new WebPubSubServiceClient(new Uri(endpoint), "<hub>", "<web-pubsub-connection-string>");
    var userId = req.Query["userid"].FirstOrDefault();
    // your method to get custom roles.
    var roles = GetRoles(userId);
    return await serviceClient.GetClientAccessUriAsync(TimeSpan.FromMinutes(5), userId, roles);
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript"

When customer needs to add roles or delay building the access token in the function, we suggest you working with [server SDK for JavaScript](/javascript/api/overview/azure/web-pubsub).

# [Model v4](#tab/nodejs-v4)

```js
const { app } = require('@azure/functions');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
app.http('negotiate', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, "<hub>");
        let token = await serviceClient.getAuthenticationToken({ userId: req.query.userid, roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"] });
        return { body: token.url };
    },
});
```

# [Model v3](#tab/nodejs-v3)
Define input bindings in `function.json`.

```json
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
>
Define function in `index.js`.
>
```js
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
>
module.exports = async function (context, req) {
  const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, "<hub>");
  let token = await serviceClient.getAuthenticationToken({ userId: req.query.userid, roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"] });
  context.res = { body: token.url };
  context.done();
};
```

---
::: zone-end

::: zone pivot="programming-language-python,programming-language-powershell"

> [!NOTE]
> Complete samples for this language are pending

::: zone-end
::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.

::: zone-end



## `WebPubSubContext`

### Example

::: zone pivot="programming-language-csharp"

# [Isolated worker model](#tab/isolated-process)

```csharp
// validate method when upstream set as http://<func-host>/api/{event}
[Function("validate")]
public static HttpResponseData Validate(
    [HttpTrigger(AuthorizationLevel.Anonymous, "options")] HttpRequestData req,
    [WebPubSubContextInput] WebPubSubContext wpsReq)
{
    return BuildHttpResponseData(req, wpsReq.Response);
}

// Respond AbuseProtection to put header correctly.
private static HttpResponseData BuildHttpResponseData(HttpRequestData request, SimpleResponse wpsResponse)
{
    var response = request.CreateResponse();
    response.StatusCode = (HttpStatusCode)wpsResponse.Status;
    response.Body = response.Body;
    foreach (var header in wpsResponse.Headers)
    {
        response.Headers.Add(header.Key, header.Value);
    }
    return response;
}
```

# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubContextInputBinding")]
public static object Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubContext] WebPubSubContext wpsContext)
{
    // in the case request is a preflight or invalid, directly return prebuild response by extension.
    if (wpsContext.IsPreflight || wpsContext.HasError)
    {
        return wpsContext.Response;
    }
    var request = wpsContext.Request as ConnectEventRequest;
    var response = new ConnectEventResponse
    {
        UserId = wpsContext.Request.ConnectionContext.UserId
    };
    return response;
}
```

---
::: zone-end

::: zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```js
const { app, input } = require('@azure/functions');

const wpsContext = input.generic({
    type: 'webPubSubContext',
    name: 'wpsContext'
});

app.http('connect', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [wpsContext],
    handler: async (request, context) => {
        var wpsRequest = context.extraInputs.get('wpsContext');

        return { "userId": wpsRequest.request.connectionContext.userId };
    }
});
```

# [Model v3](#tab/nodejs-v3)
Define input bindings in *function.json*.

```json
{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "webPubSubContext",
      "name": "wpsContext",
      "direction": "in"
    }
  ]
}
```

Define function in *index.js*.

```js
module.exports = async function (context, req, wpsContext) {
  // in the case request is a preflight or invalid, directly return prebuilt response by extension.
  if (wpsContext.hasError || wpsContext.isPreflight)
  {
    return wpsContext.response;
  }
  // return an http response with connect event response as body.
  return { body: {"userId": wpsContext.connectionContext.userId} };
};
```

---

::: zone-end
::: zone pivot="programming-language-python,programming-language-powershell"

> [!NOTE]
> Complete samples for this language are pending

::: zone-end
::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.

::: zone-end

### Configuration

The following table explains the binding configuration properties that you set in the functions.json file and the `WebPubSubContext` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSubContext`. |
| **direction** | n/a | Must be set to `in`. |
| **name** | n/a | Variable name used in function code for input Web PubSub request. |
| **connection** | Connection | Optional - the name of an app settings or setting collection that specifies the upstream Azure Web PubSub service. The value is used for [Abuse Protection](https://github.com/cloudevents/spec/blob/v1.0.1/http-webhook.md#4-abuse-protection) and Signature validation. The value is auto resolved with "WebPubSubConnectionString" by default. And `null` means the validation isn't needed and always succeed. |

[!INCLUDE [functions-azure-web-pubsub-authorization-note](../../includes/functions-azure-web-pubsub-authorization-note.md)]

### Usage

`WebPubSubContext` provides following properties.

| Binding Name | Binding Type | Description | Properties |
|---------|---------|---------|---------|
| request | `WebPubSubEventRequest` | Request from client, see following table for details. | `WebPubSubConnectionContext` from request header and other properties deserialized from request body describe the request, for example, `Reason` for `DisconnectedEventRequest`. |
| response | `HttpResponseMessage` | Extension builds response mainly for `AbuseProtection` and errors cases. | - |
| errorMessage | string | Describe the error details when processing the upstream request. | - |
| hasError | bool | Flag to indicate whether it's a valid Web PubSub upstream request. | - |
| isPreflight | bool | Flag to indicate whether it's a preflight request of `AbuseProtection`. | - |

For `WebPubSubEventRequest`, it's deserialized to different classes that provide different information about the request scenario. For `PreflightRequest` or not valid cases, user can check the flags `IsPreflight` and `HasError` to know. We suggest you to return system build response `WebPubSubContext.Response` directly, or customer can log errors on demand. In different scenarios, customer can read the request properties as following.

| Derived Class | Description | Properties |
| -- | -- | -- |
| `PreflightRequest` | Used in `AbuseProtection` when `IsPreflight` is **true** | - |
| `ConnectEventRequest` | Used in system `Connect` event type | Claims, Query, Subprotocols, ClientCertificates |
| `ConnectedEventRequest` | Used in system `Connected` event type | - |
| `UserEventRequest` | Used in user event type | Data, DataType |
| `DisconnectedEventRequest` | Used in system `Disconnected` event type | Reason |

> [!NOTE]
> Though the `WebPubSubContext` is an input binding provides similar request deserialize way under `HttpTrigger` comparing to `WebPubSubTrigger`, there's limitations, i.e. connection state post merge isn't supported. The return response is still respected by the service side, but users require to build the response themselves. If users have needs to set the event response, you should return a `HttpResponseMessage` contains `ConnectEventResponse` or messages for user event as **response body** and put connection state with key `ce-connectionstate` in **response header**.