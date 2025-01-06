---
title: Socket.IO Azure Function trigger and binding
description: This article explains the usage of Azure Function trigger and binding
keywords: Socket.IO, Socket.IO on Azure, serverless, Azure Function, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 9/1/2024
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Socket.IO Azure Function trigger and binding (Preview)

This article explains how to use Socket.IO serverless integrate with Azure Functions.

| Action | Binding Type |
|---------|---------|
| Get client negotiate result including url and access token | [Input binding](#input-binding)
| Triggered by messages from the service | [Trigger binding](#trigger-binding) |
| Invoke service to send messages or manage clients | [Output binding](#output-binding) |

[Source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/webpubsub/Microsoft.Azure.WebJobs.Extensions.WebPubSubForSocketIO) |
[Package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSubForSocketIO) |
[API reference documentation](/dotnet/api/microsoft.azure.webjobs.extensions.webpubsubforsocketio) |
[Product documentation](./index.yml) |
[Samples](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-socketio-extension/examples)

> [!IMPORTANT]
> Azure Function bindings can only integrate with Web PubSub for Socket.IO in Serverless Mode.

### Authenticate and Connection String

In order to let the extension work with Web PubSub for Socket.IO, you need to provide either access keys or identity based configuration to authenticate with the service. 

#### Access key based configuration

| Configuration Name | Description|
|---------|----------|
|WebPubSubForSocketIOConnectionString| Required. Key based connection string to the service|


You can find the connection string in **Keys** blade in you Web PubSub for Socket.IO in the [Azure portal](https://portal.azure.com/).

For the local development, use the `local.settings.json` file to store the connection string. Set `WebPubSubForSocketIOConnectionString` to the connection string copied from the previous step:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    `WebPubSubForSocketIOConnectionString`: "Endpoint=https://<webpubsub-name>.webpubsub.azure.com;AccessKey=<access-key>;Version=1.0;"
  }
}
```

When deployed use the [application settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md) to set the connection string.

#### Identity based configuration

| Configuration Name | Description|
|---------|----------|
|WebPubSubForSocketIOConnectionString__endpoint| Required. The Endpoint of the service. For example, https://mysocketio.webpubsub.azure.com|
|WebPubSubForSocketIOConnectionString__credential |  Defines how a token should be obtained for the connection. This setting should be set to `managedidentity` if your deployed Azure Function intends to use managed identity authentication. This value is only valid when a managed identity is available in the hosting environment.|
|WebPubSubForSocketIOConnectionString__clientId | When `credential` is set to `managedidentity`, this property can be set to specify the user-assigned identity to be used when obtaining a token. The property accepts a client ID corresponding to a user-assigned identity assigned to the application. If not specified, the system-assigned identity is used.|

The function binding follows the common properties for identity based configuration. See [Common properties for identity-based connections](../azure-functions/functions-reference.md?#common-properties-for-identity-based-connections) for more unmentioned properties.

For the local development, use the `local.settings.json` file to store the connection string. Set `WebPubSubForSocketIOConnectionString` to the connection string copied from the previous step:

```json
{
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "WebPubSubForSocketIOConnectionString__endpoint": "https://<webpubsub-name>.webpubsub.azure.com",
    "WebPubSubForSocketIOConnectionString__tenant": "<tenant id you're in>",
  }
}
```

If you want to use identity based configuration and running online, the `AzureWebJobsStorage` should refer to [Connecting to host storage with an identity](../azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity).

## Input Binding

Socket.IO Input binding generates a `SocketIONegotiationResult` to the client negotiation request. When a Socket.IO client tries to connect to the service, it needs to know the `endpoint`, `path`, and `access token` for authentication. It's a common practice to have a server to generate these data, which is called negotiation.

# [C#](#tab/csharp)

```cs
[FunctionName("SocketIONegotiate")]
public static IActionResult Negotiate(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
    [SocketIONegotiation(Hub = "hub", UserId = "userId")] SocketIONegotiationResult result)
{
    return new OkObjectResult(result);
}
```

### Attribute

The attribute for input binding is `[SocketIONegotiation]`.

| Attribute property | Description |
|---------|---------|
| Hub | The hub name that a client needs to connect to. |
| Connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |
| UserId | The userId of the connection. It applies to all sockets in the connection. It becomes the `sub` claim in the generated token. |

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
| connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |
| userId | The userId of the connection. It applies to all sockets in the connection. It becomes the `sub` claim in the generated token. |

# [Python Model v2](#tab/python-v2)

A function always needs a trigger binding. We use HttpTrigger as an example in codes.

```python
import azure.functions as func
app = func.FunctionApp()

@app.function_name(name="negotiate")
@app.route(auth_level=func.AuthLevel.ANONYMOUS)
@app.generic_input_binding(arg_name="negotiate", type="socketionegotiation", hub="hub")
def negotiate(req: func.HttpRequest, negotiate) -> func.HttpResponse:
    return func.HttpResponse(negotiate)
```

### Annotation

| Property | Description |
|---------|---------|
| arg_name | The variable name of the argument in function to represent the input binding. |
| type | Must be `socketionegotiation` |
| hub | The hub name that a client needs to connect to. |
| connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |
| userId | The userId of the connection. It applies to all sockets in the connection. It becomes the `sub` claim in the generated token. |

---

## Trigger Binding

Azure Function uses trigger binding to trigger a function to process the events from the Web PubSub for Socket.IO.

Trigger binding exposes a specific path followed the Azure Function endpoint. The url should be set as the URL Template of the service (Portal: settings -> event handler -> URL Template). In the endpoint pattern, the query part `code=<API_KEY>` is **REQUIRED** when you're using Azure Function App for [security](../azure-functions/function-keys-how-to.md#understand-keys) reasons. The key can be found in **Azure portal**. Find your function app resource and navigate to **Functions** -> **App keys** -> **System keys** -> **socketio_extension** after you deploy the function app to Azure. Though, this key isn't needed when you're working with local functions.

```
<Function_App_Endpoint>/runtime/webhooks/socketio?code=<API_KEY>
```

# [C#](#tab/csharp)

Function triggers for socket connect event.

```cs
[FunctionName("SocketIOTriggerConnect")]
public static async Task<SocketIOEventHandlerResponse> Connect(
    [SocketIOTrigger("hub", "connect")] SocketIOConnectRequest request)
{
    return new SocketIOConnectResponse();
}
```

Function triggers for socket connected event.

```cs
[FunctionName("SocketIOTriggerConnected")]
public static async Task Connected(
    [SocketIOTrigger("hub", "connected")] SocketIOConnectedRequest request)
{
}
```

Function triggers for socket disconnect event.

```cs
[FunctionName("SocketIOTriggerDisconnected")]
public static async Task Disconnected(
    [SocketIOTrigger("hub", "disconnected")] SocketIODisconnectedRequest request)
{
}
```

Function triggers for normal messages from clients.

```cs
[FunctionName("SocketIOTriggerMessage")]
public static async Task NewMessage(
    [SocketIOTrigger("hub", "new message")] SocketIOMessageRequest request,
    [SocketIOParameter] string arg)
{
}
```

### Attributes

The attribute for trigger binding is `[SocketIOTrigger]`.

| Attribute property | Description |
|---------|---------|
| Hub | The hub name that a client needs to connect to. |
| Namespace | The namespace of the socket. Default: "/" |
| EventName | The event name that the function triggers for. Some event names are predefined: `connect` for socket connect event. `connected` for socket connected event. `disconnected` for socket disconnected event. And other events are defined by user and it need to match the event name sent by client side. |
| ParameterNames | The parameter name list of the event. The length of list should be consistent with event sent from client. And the name uses the [Binding expressions](../azure-functions/functions-bindings-expressions-patterns.md) and access by the same-name function parameter. |

### Binding Data

`[SocketIOTrigger]` binds some variables to binding data. You can learn more about it from [Azure Functions binding expression patterns](../azure-functions/functions-bindings-expressions-patterns.md)

#### SocketIOAttribute

`SocketIOAttribute` is an alternative of `ParameterNames`, which simplifies the function definition. For example, the following two definitions have the same effect:

```cs
[FunctionName("SocketIOTriggerMessage")]
public static async Task NewMessage(
    [SocketIOTrigger("hub", "new message")] SocketIOMessageRequest request,
    [SocketIOParameter] string arg)
{
}
```

```cs
[FunctionName("SocketIOTriggerMessage")]
public static async Task NewMessage(
    [SocketIOTrigger("hub", "new message", ParameterNames = new[] {"arg"})] SocketIOMessageRequest request,
    string arg)
{
}
```

Note that `ParameterNames` and `[SocketIOParameter]` can't be used together.

# [JavaScript Model v4](#tab/javascript-v4)

Function triggers for socket connect event.

```js
import { app, InvocationContext, input, trigger } from "@azure/functions";


export async function connect(request: any, context: InvocationContext): Promise<any> {
    return {};
}

// Trigger for connect
app.generic('connect', {
  trigger: trigger.generic({
    type: 'socketiotrigger',
    hub: 'hub',
    eventName: 'connect'
  }),
  handler: connect
});
```

Function triggers for socket connected event.

```js
import { app, InvocationContext, trigger } from "@azure/functions";

export async function connected(request: any, context: InvocationContext): Promise<void> {
}

// Trigger for connected
app.generic('connected', {
    trigger: trigger.generic({
        type: 'socketiotrigger',
        hub: 'hub',
        eventName: 'connected'
    }),
    handler: connected
});
```

Function triggers for socket disconnected event.

```js
import { app, InvocationContext, trigger } from "@azure/functions";

export async function disconnected(request: any, context: InvocationContext): Promise<void> {
}

// Trigger for connected
app.generic('disconnected', {
    trigger: trigger.generic({
        type: 'socketiotrigger',
        hub: 'hub',
        eventName: 'disconnected'
    }),
    handler: disconnected
});
```

Function triggers for normal messages from clients.

```js
import { app, InvocationContext, trigger, output } from "@azure/functions";

export async function newMessage(request: any, context: InvocationContext): Promise<void> {
}

// Trigger for new message
app.generic('newMessage', {
    trigger: trigger.generic({
        type: 'socketiotrigger',
        hub: 'hub',
        eventName: 'new message'
    }),
    handler: newMessage
});
```

### Configuration

| Property | Description |
|---------|---------|
| type | Must be `socketiotrigger` |
| hub | The hub name that a client needs to connect to. |
| namespace | The namespace of the socket. Default: "/" |
| eventName | The event name that the function triggers for. Some event names are predefined: `connect` for socket connect event. `connected` for socket connected event. `disconnected` for socket disconnected event. And other events are defined by user and it need to match the event name sent by client side. |
| ParameterNames | The parameter name list of the event. The length of list should be consistent with event sent from client. And the name uses the [Binding expressions](../azure-functions/functions-bindings-expressions-patterns.md) and access by `context.bindings.<name>`. |

# [Python Model v2](#tab/python-v2)

Function triggers for socket connect event.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json
app = func.FunctionApp()

@app.generic_trigger(arg_name="sio", type="socketiotrigger", data_type=DataType.STRING, hub="hub", eventName="connect")
def connect(sio: str) -> str:
    return json.dumps({'statusCode': 200})
```

Function triggers for socket connected event.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json
app = func.FunctionApp()

@app.generic_trigger(arg_name="sio", type="socketiotrigger", data_type=DataType.STRING, hub="hub", eventName="connected")
def connected(sio: str) -> None:
    print("connected")
```

Function triggers for socket disconnected event.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json
app = func.FunctionApp()

@app.generic_trigger(arg_name="sio", type="socketiotrigger", data_type=DataType.STRING, hub="hub", eventName="disconnected")
def connected(sio: str) -> None:
    print("disconnected")
```

Function triggers for normal messages from clients.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json
app = func.FunctionApp()

@app.generic_trigger(arg_name="sio", type="socketiotrigger", data_type=DataType.STRING, hub="hub", eventName="chat")
def chat(sio: str) -> None:
    # do something else
```

Function trigger for normal messages with callback.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json
app = func.FunctionApp()

@app.generic_trigger(arg_name="sio", type="socketiotrigger", data_type=DataType.STRING, hub="hub", eventName="chat")
def chat(sio: str) -> str:
    return json.dumps({'ack': ["param1"]})
```

### Annotation


| Property | Description |
|---------|---------|
| arg_name | The variable name of the argument in function to represent the trigger binding. |
| type | Must be `socketiotrigger` |
| hub | The hub name that a client needs to connect to. |
| data_type | Must be `DataType.STRING` |
| namespace | The namespace of the socket. Default: "/" |
| eventName | The event name that the function triggers for. Some event names are predefined: `connect` for socket connect event. `connected` for socket connected event. `disconnected` for socket disconnected event. And other events are defined by user and it need to match the event name sent by client side. |


---

### Request of Input Binding

The data structure of input binding arguments varies depending on the message type.

#### Connect

```json
{
    "namespace": "",
    "socketId": "",
    "claims": {
        "<claim-type>": [ "<claim-value>" ]
    },
    "query": {
        "<query-key>": [ "<query-value>" ]
    },
    "headers":{
        "<header-name>": [ "<header-value>" ]
    },
    "clientCertificates":{
        {
            "thumbprint": "",
            "content": ""
        }
    }
}
```

| Property | Description |
|---------|---------|
| namespace | The namespace of the socket. |
| socketId | The unique identity of the socket. |
| claims | The claim of JWT of the client connection. Note, it's not the JWT when the service request the function, but the JWT when the Engine.IO client connects to the service. |
| query | The query of the client connection. Note, it's not the query when the service request the function, but the query when the Engine.IO client connects to the service. |
| headers | The headers of the client connection. Note, it's not the headers when the service request the function, but the headers when the Engine.IO client connects to the service. |
| clientCertificates | The client certificate if it's enabled |

#### Connected

```json
{
    "namespace": "",
    "socketId": "",
}
```

| Property | Description |
|---------|---------|
| namespace | The namespace of the socket. |
| socketId | The unique identity of the socket. |

#### Disconnected

```json
{
    "namespace": "",
    "socketId": "",
    "reason": ""
}
```

| Property | Description |
|---------|---------|
| namespace | The namespace of the socket. |
| socketId | The unique identity of the socket. |
| reason | The connection close reason description. |

#### Normal events

```json
{
    "namespace": "",
    "socketId": "",
    "payload": "",
    "eventName": "",
    "parameters": []
}
```

| Property | Description |
|---------|---------|
| namespace | The namespace of the socket. |
| socketId | The unique identity of the socket. |
| payload | The message payload in Engine.IO protocol |
| eventName | The event name of the request. |
| parameters | List of parameters of the message. |

## Output Binding

The output binding currently support the following functionality:

- Add a socket to room
- Remove a socket from room
- Send messages to a socket
- Send messages to a room
- Send messages to a namespace
- Disconnect sockets

# [C#](#tab/csharp)

```cs
[FunctionName("SocketIOOutput")]
public static async Task<IActionResult> SocketIOOutput(
    [SocketIOTrigger("hub", "new message")] SocketIOMessageRequest request,
    [SocketIO(Hub = "hub")] IAsyncCollector<SocketIOAction> collector)
{
    await collector.AddAsync(SocketIOAction.CreateSendToNamespaceAction("new message", new[] { "arguments" }));
}
```

### Attribute

The attribute for input binding is `[SocketIO]`.

| Attribute property | Description |
|---------|---------|
| Hub | The hub name that a client needs to connect to. |
| Connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |

# [JavaScript Model v4](#tab/javascript-v4)

```js
import { app, InvocationContext, trigger, output } from "@azure/functions";

const socketio = output.generic({
  type: 'socketio',
  hub: 'hub',
})

export async function newMessage(request: any, context: InvocationContext): Promise<void> {
    context.extraOutputs.set(socketio, {
      actionName: 'sendToNamespace',
      namespace: '/',
      eventName: 'new message',
      parameters: [
        "argument"
      ]
    });
}

// Trigger for new message
app.generic('newMessage', {
    trigger: trigger.generic({
        type: 'socketiotrigger',
        hub: 'hub',
        eventName: 'new message'
    }),
    extraOutputs: [socketio],
    handler: newMessage
});
```

### Configuration

| Attribute property | Description |
|---------|---------|
| type | Must be `socketio` |
| hub | The hub name that a client needs to connect to. |
| connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |

# [Python Model v2](#tab/python-v2)

A function always needs a trigger binding. We use TimerTrigger as an example in codes.

```python
import azure.functions as func
from azure.functions.decorators.core import DataType
import json

app = func.FunctionApp()

@app.timer_trigger(schedule="* * * * * *", arg_name="myTimer", run_on_startup=False,
              use_monitor=False)
@app.generic_output_binding(arg_name="sio", type="socketio", data_type=DataType.STRING, hub="hub")
def new_message(myTimer: func.TimerRequest,
                 sio: func.Out[str]) -> None:
    sio.set(json.dumps({
        'actionName': 'sendToNamespace',
        'namespace': '/',
        'eventName': 'update',
        'parameters': [
            "message"
        ]
    }))
```

### Annotation

| Attribute property | Description |
|---------|---------|
| arg_name | The variable name of the argument in function to represent the output binding. |
| type | Must be `socketio` |
| data_type | Use `DataType.STRING` |
| hub | The hub name that a client needs to connect to. |
| connection | The name of the app setting that contains the Socket.IO connection string (defaults to `WebPubSubForSocketIOConnectionString`). |

---

### Actions

Output binding uses actions to perform operations. Currently, we support the following actions:

#### AddSocketToRoomAction

```json
{
    "type": "AddSocketToRoom",
    "socketId": "",
    "room": ""
}
```

#### RemoveSocketFromRoomAction

```json
{
    "type": "RemoveSocketFromRoom",
    "socketId": "",
    "room": ""
}
```

#### SendToNamespaceAction

```json
{
    "type": "SendToNamespace",
    "eventName": "",
    "parameters": [],
    "exceptRooms": []
}
```

#### SendToRoomsAction

```json
{
    "type": "SendToRoom",
    "eventName": "",
    "parameters": [],
    "rooms": [],
    "exceptRooms": []
}
```

#### SendToSocketAction

```json
{
    "type": "SendToSocket",
    "eventName": "",
    "parameters": [],
    "socketId": ""
}
```

#### DisconnectSocketsAction

```json
{
    "type": "DisconnectSockets",
    "rooms": [],
    "closeUnderlyingConnection": false
}
```