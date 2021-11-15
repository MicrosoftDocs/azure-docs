---
title: Reference - Azure Web PubSub trigger and bindings for Azure Functions
description: The reference describes Azure Web PubSub trigger and bindings for Azure Functions
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 11/08/2021
---

#  Azure Web PubSub trigger and bindings for Azure Functions

This reference explains how to handle Web PubSub events in Azure Functions.

Web PubSub is an Azure-managed service that helps developers easily build web applications with real-time features and publish-subscribe pattern.

| Action | Type |
|---------|---------|
| Run a function when messages come from service | [Trigger binding](#trigger-binding) |
| Return the service endpoint URL and access token | [Input binding](#input-binding)
| Send Web PubSub messages |[Output binding](#output-binding) |

[Source code](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/webpubsub/) |
[Package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSub) |
[API reference documentation](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/webpubsub/Microsoft.Azure.WebJobs.Extensions.WebPubSub/api/Microsoft.Azure.WebJobs.Extensions.WebPubSub.netstandard2.0.cs) |
[Product documentation](./index.yml) |
[Samples][samples_ref]

## Add to your Functions app

Working with the trigger and bindings requires you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version prerelease | |
| C# Script, JavaScript, Python, PowerShell       | [Explicitly install extensions]                    | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                                   | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

Install the client library from [NuGet](https://www.nuget.org/) with specified package and version.

```bash
func extensions install --package Microsoft.Azure.WebJobs.Extensions.WebPubSub --version 1.0.0-beta.3
```

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebPubSub
[Explicitly install extensions]: ../azure-functions/functions-bindings-register.md#explicitly-install-extensions 
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
[Update your extensions]: ../azure-functions/functions-bindings-register.md

## Key concepts

![Diagram showing the workflow of Azure Web PubSub service working with Function Apps.](./media/reference-functions-bindings/functions-workflow.png)

(1)-(2) `WebPubSubConnection` input binding with HttpTrigger to generate client connection.

(3)-(4) `WebPubSubTrigger` trigger binding or `WebPubSubRequest` input binding with HttpTrigger to handle service request.

(5)-(6) `WebPubSub` output binding to request service do something.

## Trigger binding

Use the function trigger to handle requests from Azure Web PubSub service. 

`WebPubSubTrigger` is used when you need to handle requests from service side. The trigger endpoint pattern would be like below which should be set in Web PubSub service side (Portal: settings -> event handler -> URL Template). In the endpoint pattern, the query part `code=<API_KEY>` is **REQUIRED** when you're using Azure Function App for [security](../azure-functions/security-concepts.md#system-key) reasons. The key can be found in **Azure Portal**. Find your function app resource and navigate to **Functions** -> **App Keys** -> **System Keys** -> **webpubsub_extension** after you deploy the function app to Azure. Though, this key isn't needed when you're working with local functions.

```
<Function_App_Url>/runtime/webhooks/webpubsub?code=<API_KEY>
```

### Example


# [C#](#tab/csharp)

```cs
[FunctionName("WebPubSubTrigger")]
public static void Run(
    [WebPubSubTrigger("<hub>", "message", EventType.User)] 
    ConnectionContext context,
    string message,
    MessageDataType dataType)
{
    Console.WriteLine($"Request from: {context.userId}");
    Console.WriteLine($"Request message: {message}");
    Console.WriteLine($"Request message DataType: {dataType}");
}
```

`WebPubSubTrigger` binding also supports return value in some scenarios, for example, `Connect`, `Message` events, when server can check and deny the client request, or send message to the request client directly. `Connect` event respects `ConnectResponse` and `ErrorResponse`, and `Message` event respects `MessageResponse` and `ErrorResponse`, rest types not matching current scenario will be ignored. And if `ErrorResponse` is returned, service will drop the client connection.

```cs
[FunctionName("WebPubSubTriggerReturnValue")]
public static MessageResponse Run(
    [WebPubSubTrigger("<hub>", "message", EventType.User)] 
    ConnectionContext context,
    string message,
    MessageDataType dataType)
{
    return new MessageResponse
    {
        Message = BinaryData.FromString("ack"),
        DataType = MessageDataType.Text
    };
}
```

# [JavaScript](#tab/javascript)

Define trigger binding in `function.json`.

```json
{
  "disabled": false,
  "bindings": [
    {
      "type": "webPubSubTrigger",
      "direction": "in",
      "name": "message",
      "hub": "<hub>",
      "eventName": "message",
      "eventType": "user"
    }
  ]
}
```

Define function in `index.js`.

```js
module.exports = function (context, message) {
  console.log('Request from: ', context.userId);
  console.log('Request message: ', message);
  console.log('Request message dataType: ', context.bindingData.dataType);
}
```

`WebPubSubTrigger` binding also supports return value in some scenarios, for example, `Connect`, `Message` events. When server can check and deny the client request, or send message to the request client directly. In JavaScript type-less language, it will be deserialized regarding the object keys. And `ErrorResponse` will have the highest priority compare to rest objects, that if `code` is in the return, then it will be parsed to `ErrorResponse` and client connection will be dropped.

```js
module.exports = async function (context) {
  return { 
    "message": "ack",
    "dataType" : "text"
  };
}
```

---


### Attributes and annotations

In [C# class libraries](../azure-functions/functions-dotnet-class-library.md), use the `WebPubSubTrigger` attribute.

Here's an `WebPubSubTrigger` attribute in a method signature:

```csharp
[FunctionName("WebPubSubTrigger")]
public static void Run([WebPubSubTrigger("<hub>", "<eventName>", <eventType>)] 
ConnectionContext context, ILogger log)
{
    ...
}
```

For a complete example, see C# example.

### Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a |Required - must be set to `webPubSubTrigger`. |
| **direction** | n/a | Required - must be set to `in`. |
| **name** | n/a | Required - the variable name used in function code for the parameter that receives the event data. |
| **hub** | Hub | Required - the value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **eventType** | EventType | Required - the value must be set as the event type of messages for the function to be triggered. The value should be either `user` or `system`. |
| **eventName** | EventName | Required - the value must be set as the event of messages for the function to be triggered. </br> For `system` event type, the event name should be in `connect`, `connected`, `disconnect`. </br> For system supported subprotocol `json.webpubsub.azure.v1.`, the event name is user-defined event name. </br> For user-defined subprotocols, the event name is `message`. |

### Usages

In C#, `ConnectionContext` is type recognized binding parameter, rest parameters are bound by parameter name. Check table below of available parameters and types.

In type-less language like JavaScript, `name` in `function.json` will be used to bind the trigger object regarding below mapping table. And will respect `dataType` in `function.json` to convert message accordingly when `name` is set to `message` as the binding object for trigger input. All the parameters can be read from `context.bindingData.<BindingName>` and will be `JObject` converted. 

| Binding Name | Binding Type | Description | Properties |
|---------|---------|---------|---------|
|connectionContext|`ConnectionContext`|Common request information| EventType, EventName, Hub, ConnectionId, UserId, Headers, Signature |
|message|`BinaryData`,`string`,`Stream`,`byte[]`| Request message from client | -|
|dataType|`MessageDataType`| Request message dataType, supports `binary`, `text`, `json` | -|
|claims|`IDictionary<string, string[]>`|User Claims in `connect` request | -|
|query|`IDictionary<string, string[]>`|User query in `connect` request | -|
|subprotocols|`string[]`|Available subprotocols in `connect` request | -|
|clientCertificates|`ClientCertificate[]`|A list of certificate thumbprint from clients in `connect` request|-|
|reason|`string`|Reason in disconnect request|-|

### Return response

`WebPubSubTrigger` will respect customer returned response for synchronous events of `connect` and user event `message`. Only matched response will be sent back to service, otherwise, it will be ignored. 

| Return Type | Description | Properties |
|---------|---------|---------|
|`ConnectResponse`| Response for `connect` event | Groups, Roles, UserId, Subprotocol |
|`MessageResponse`| Response for user event | DataType, Message |
|`ErrorResponse`| Error response for the sync event | Code, ErrorMessage |
|`ServiceResponse`| Base response type of the supported ones used for uncertain return cases | - |

## Input binding

Our extension provides two input binding targeting different needs.

- `WebPubSubConnection`

  To let a client connect to Azure Web PubSub Service, it must know the service endpoint URL and a valid access token. The `WebPubSubConnection` input binding produces required information, so client doesn't need to handle this token generation itself. Because the token is time-limited and can be used to authenticate a specific user to a connection, don't cache the token or share it between clients. An HTTP trigger working with this input binding can be used for clients to retrieve the connection information.

- `WebPubSubRequest`

  When using is Static Web Apps, `HttpTrigger` is the only supported trigger and under Web PubSub scenario, we provide the `WebPubSubRequest` input binding helps users deserialize upstream http request from service side under Web PubSub protocols. So customers can get similar results comparing to `WebPubSubTrigger` to easy handle in functions. See [examples](#example---webpubsubrequest) in below.
  When used with `HttpTrigger`, customer requires to configure the HttpTrigger exposed url in upstream accordingly.

### Example - `WebPubSubConnection`

The following example shows a C# function that acquires Web PubSub connection information using the input binding and returns it over HTTP.

# [C#](#tab/csharp)

```cs
[FunctionName("WebPubSubConnectionInputBinding")]
public static WebPubSubConnection Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubConnection(Hub = "<hub>", UserId = "{query.userid}")] WebPubSubConnection connection)
{
    Console.WriteLine("login");
    return connection;
}
```

# [JavaScript](#tab/javascript)

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

### Authenticated **tokens**

If the function is triggered by an authenticated client, you can add a user ID claim to the generated token. You can easily add authentication to a function app using App Service Authentication.

App Service Authentication sets HTTP headers named `x-ms-client-principal-id` and `x-ms-client-principal-name` that contain the authenticated user's client principal ID and name, respectively.

You can set the UserId property of the binding to the value from either header using a binding expression: `{headers.x-ms-client-principal-id}` or `{headers.x-ms-client-principal-name}`.

```cs
[FunctionName("WebPubSubConnectionInputBinding")]
public static WebPubSubConnection Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubConnection(Hub = "<hub>", UserId = "{headers.x-ms-client-principal-name}")] WebPubSubConnection connection)
{
    Console.WriteLine("login");
    return connection;
}
```

### Example - `WebPubSubRequest`

The following example shows a C# function that acquires Web PubSub Request information using the input binding under connect event type and returns it over HTTP.

# [C#](#tab/csharp)

```cs
[FunctionName("WebPubSubRequestInputBinding")]
public static object Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSubRequest] WebPubSubRequest wpsReq)
{
    if (wpsReq.Request.IsValidationRequest || !wpsReq.Request.Valid)
    {
        return wpsReq.Response;
    }
    var request = wpsReq.Request as ConnectEventRequest;
    var response = new ConnectResponse
    {
        UserId = wpsReq.ConnectionContext.UserId
    };
    return response;
}
```

# [JavaScript](#tab/javascript)

Define input bindings in `function.json`.

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
      "type": "webPubSubRequest",
      "name": "wpsReq",
      "direction": "in"
    }
  ]
}
```

Define function in `index.js`.

```js
module.exports = async function (context, req, wpsReq) {
  if (!wpsReq.request.valid || wpsReq.request.isValidationRequest)
  {
    console.log(`invalid request: ${wpsReq.response.message}.`);
    return wpsReq.response;
  }
  console.log(`user: ${context.bindings.wpsReq.connectionContext.userId} is connecting.`);
  return { body: {"userId": context.bindings.wpsReq.connectionContext.userId} };
};
```

---

### Configuration

#### WebPubSubConnection

The following table explains the binding configuration properties that you set in the function.json file and the `WebPubSubConnection` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSubConnection` |
| **direction** | n/a | Must be set to `in` |
| **name** | n/a | Variable name used in function code for input connection binding object. |
| **hub** | Hub | The value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **userId** | UserId | Optional - the value of the user identifier claim to be set in the access key token. |
| **connectionStringSetting** | ConnectionStringSetting | The name of the app setting that contains the Web PubSub Service connection string (defaults to "WebPubSubConnectionString") |

#### WebPubSubRequest

The following table explains the binding configuration properties that you set in the functions.json file and the `WebPubSubRequest` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSubRequest` |
| **direction** | n/a | Must be set to `in` |
| **name** | n/a | Variable name used in function code for input Web PubSub request. |

### Usage

#### WebPubSubConnection

`WebPubSubConnection` provides below properties.

Binding Name | Binding Type | Description
---------|---------|---------
BaseUrl | string | Web PubSub client connection url
Url | string | Absolute Uri of the Web PubSub connection, contains `AccessToken` generated base on the request
AccessToken | string | Generated `AccessToken` based on request UserId and service information

#### WebPubSubRequest

`WebPubSubRequest` provides below properties.

Binding Name | Binding Type | Description | Properties
---------|---------|---------|---------
connectionContext | `ConnectionContext` | Common request information| EventType, EventName, Hub, ConnectionId, UserId, Headers, Signature
request | `ServiceRequest` | Request from client, see below table for details | IsValidationRequest, Valid, Unauthorized, BadRequest, ErrorMessage, Name, etc.
response | `HttpResponseMessage` | Extension builds response mainly for `AbuseProtection` and errors cases | -

For `ServiceRequest`, it's deserialized to different classes that provides different information about the request scenario. For `ValidationRequest` or `InvalidRequest`, it's suggested to return system build response `WebPubSubRequest.Response` directly, or customer can log errors in need. In different scenarios, customer can read the request properties as below.

Derived Class | Description | Properties
--|--|--
`ValidationRequest` | Use in `AbuseProtection` when `IsValidationRequest` is **true** | -
`ConnectEventRequest` | Used in `Connect` event type | Claims, Query, Subprotocols, ClientCertificates
`ConnectedEventRequest` | Use in `Connected` event type | -
`MessageEventRequest` | Use in user event type | Message, DataType
`DisconnectedEventRequest` | Use in `Disconnected` event type | Reason
`InvalidRequest` | Use when the request is invalid | -

## Output binding

Use the Web PubSub output binding to send one or more messages using Azure Web PubSub Service. You can broadcast a message to:

* All connected clients
* Connected clients authenticated to a specific user
* Connected clients joined in a specific group

The output binding also allows you to manage groups and grant/revoke permissions targeting specific connectionId with group.

For information on setup and configuration details, see the overview.

### Example

# [C#](#tab/csharp)

```cs
[FunctionName("WebPubSubOutputBinding")]
public static async Task RunAsync(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSub(Hub = "<hub>")] IAsyncCollector<WebPubSubOperation> operations)
{
    await operations.AddAsync(new SendToAll
    {
        Message = BinaryData.FromString("Hello Web PubSub"),
        DataType = MessageDataType.Text
    });
}
```

# [JavaScript](#tab/javascript)

Define bindings in `functions.json`.

```json
{
  "disabled": false,
  "bindings": [
    {
      "type": "webPubSub",
      "name": "webPubSubOperation",
      "hub": "<hub>",
      "direction": "out"
    }
  ]
}
```

Define function in `index.js`.

```js
module.exports = async function (context) {
  context.bindings.webPubSubOperation = {
    "operationKind": "sendToAll",
    "message": "hello",
    "dataType": "text"
  };
  context.done();
}
```

---

### WebPubSubOperation 

`WebPubSubOperation` is the base abstract type of output bindings. The derived types represent the operation server want services to invoke. In type-less language like `javascript`, `OperationKind` is the key parameter to resolve the type. And under strong type language like `csharp`, user could create the target operation type directly and customer assigned `OperationKind` value would be ignored.

Derived Class|Properties
--|--
`SendToAll`|Message, DataType, Excluded
`SendToGroup`|Group, Message, DataType, Excluded
`SendToUser`|UserId, Message, DataType
`SendToConnection`|ConnectionId, Message, DataType
`AddUserToGroup`|UserId, Group
`RemoveUserFromGroup`|UserId, Group
`RemoveUserFromAllGroups`|UserId
`AddConnectionToGroup`|ConnectionId, Group
`RemoveConnectionFromGroup`|ConnectionId, Group
`CloseClientConnection`|ConnectionId, Reason
`GrantGroupPermission`|ConnectionId, Group, Permission, TargetName
`RevokeGroupPermission`|ConnectionId, Group, Permission, TargetName

### Configuration

#### WebPubSub

The following table explains the binding configuration properties that you set in the function.json file and the `WebPubSub` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSub` |
| **direction** | n/a | Must be set to `out` |
| **name** | n/a | Variable name used in function code for output binding object. |
| **hub** | Hub | The value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **connectionStringSetting** | ConnectionStringSetting | The name of the app setting that contains the Web PubSub Service connection string (defaults to "WebPubSubConnectionString") |

## Troubleshooting

### Setting up console logging
You can also easily [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#logging) if you want to dig deeper into the requests you're making against the service.

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/functions

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]