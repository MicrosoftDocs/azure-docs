---
title: Socket.IO Azure Function trigger and binding
description: This article explains the usage of Azure Function trigger and binding
keywords: Socket.IO, Socket.IO on Azure, serverless, Azure Function, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: kevinguo-ed
ms.author: kevinguo
ms.date: 08/1/2023
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Socket.IO Azure Function trigger and binding

This artical explains how to use Socket.IO serverless integrate with Azure Functions.

| Action | Binding Type |
|---------|---------|
| Get client negotiate result incluing url and access token | [Input binding](#input-binding)
| Triggered by messages from the service | [Trigger binding](#trigger-binding) |
| Invoke service to send messages or manage clients | [Output binding](#output-binding) |

[Source code](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/webpubsub/) |
[Package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSub) |
[API reference documentation](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Microsoft.Azure.WebJobs.Extensions.WebPubSub/api/Microsoft.Azure.WebJobs.Extensions.WebPubSub.netstandard2.0.cs) |
[Product documentation](./index.yml) |
[Samples][samples_ref]

## Input Binding

Socket.IO Input binding generates a `SocketIONegotiationResult` to the client negotiation request. When a Socket.IO client tries to connect to the service, it needs to know the `endpoint`, `path` and `access token` for authentication. It's a common practice to have a server to generate these data, which is called negotiation.

# [C#](#tab/csharp)

```cs
[FunctionName("SocketIONegotiate")]
public static IActionResult Negotiate(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
    [SocketIONegotiation(Hub = "hub")] SocketIONegotiationResult result)
{
    return new OkObjectResult(result);
}
```

### Configuration

| Attribute property | Description |
|---------|---------|
| Hub | The hub name that a client needs to connect to. |
| Connection | The name of the app setting that contains the Socket.IO connection string (defaults to "WebPubSubForSocketIOConnectionString"). |

# [JavaScript Model v4](#tab/javascript-v4)

```js
import { app, HttpRequest, HttpResponseInit, InvocationContext, input, } from "@azure/functions";

const socketIONegotiate = input.generic({
    type: 'socketionegotiation',
    direction: 'in',
    name: 'result',
    hub: 'hub',
});

export async function negotiate(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let result = context.extraInputs.get(socketIONegotiate);
    return { jsonBody: result };
};

// Negotiation
app.http('negotiate', {
    methods: ['GET'],
    authLevel: 'anonymous',
    extraInputs: [socketIONegotiate],
    handler: negotiate
});

```

### Configuration

| Property | Description |
|---------|---------|
| type | Must be `socketionegotiation` |
| direction | Must be `in` |
| name | Variable name used in function code for input connection binding object |
| hub | The hub name that a client needs to connect to. |
| connection | The name of the app setting that contains the Socket.IO connection string (defaults to "WebPubSubForSocketIOConnectionString"). |

---

## Trigger Binding

Azure Function uses trigger binding to trigger a function to process the events from the Web PubSub for Socket.IO.
Due to the The trigger endpoint pattern would be like below which should be set in Web PubSub service side (Portal: settings -> event handler -> URL Template). In the endpoint pattern, the query part `code=<API_KEY>` is **REQUIRED** when you're using Azure Function App for [security](../azure-functions/function-keys-how-to.md#understand-keys) reasons. The key can be found in **Azure portal**. Find your function app resource and navigate to **Functions** -> **App keys** -> **System keys** -> **webpubsub_extension** after you deploy the function app to Azure. Though, this key isn't needed when you're working with local functions.

```
<Function_App_Url>/runtime/webhooks/webpubsub?code=<API_KEY>
```


