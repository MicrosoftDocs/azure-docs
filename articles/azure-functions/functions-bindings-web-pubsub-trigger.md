---
title: Azure Web PubSub trigger for Azure Functions
description: Learn how to handle Azure Web PubSub client events from Azure Functions
ms.topic: reference
ms.date: 09/02/2024
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-python, devx-track-extended-java, devx-track-js, devx-track-ts
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Web PubSub trigger binding for Azure Functions

Use Azure Web PubSub trigger to handle client events from Azure Web PubSub service.

The trigger endpoint pattern would be as follows, which should be set in Web PubSub service side (Portal: settings -> event handler -> URL Template). In the endpoint pattern, the query part `code=<API_KEY>` is **REQUIRED** when you're using Azure Function App for [security](../azure-functions/function-keys-how-to.md#understand-keys) reasons. The key can be found in **Azure portal**. Find your function app resource and navigate to **Functions** -> **App keys** -> **System keys** -> **webpubsub_extension** after you deploy the function app to Azure. Though, this key isn't needed when you're working with local functions.

```
<Function_App_Url>/runtime/webhooks/webpubsub?code=<API_KEY>
```

:::image type="content" source="../azure-web-pubsub/media/quickstart-serverless/func-keys.png" alt-text="Screenshot of get function system keys.":::

::: zone pivot="programming-language-csharp"

## Example

The following sample shows how to handle user events from clients.
# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("Broadcast")]
public static void Run(
[WebPubSubTrigger("<hub>", WebPubSubEventType.User, "message")] UserEventRequest request, ILogger log)
{
    log.LogInformation($"Request from: {request.ConnectionContext.UserId}");
    log.LogInformation($"Request message data: {request.Data}");
    log.LogInformation($"Request message dataType: {request.DataType}");
}
```


# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubTrigger")]
public static void Run(
    [WebPubSubTrigger("<hub>", WebPubSubEventType.User, "message")] UserEventRequest request, ILogger log)
{
    log.LogInformation($"Request from: {request.ConnectionContext.UserId}");
    log.LogInformation($"Request message data: {request.Data}");
    log.LogInformation($"Request message dataType: {request.DataType}");
}
```

---

`WebPubSubTrigger` binding also supports return value in synchronize scenarios, for example, system `Connect` and user event, when server can check and deny the client request, or send messages to the caller directly. `Connect` event respects `ConnectEventResponse` and `EventErrorResponse`, and user event respects `UserEventResponse` and `EventErrorResponse`, rest types not matching current scenario is ignored.

# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("Broadcast")]
public static UserEventResponse Run(
[WebPubSubTrigger("<hub>", WebPubSubEventType.User, "message")] UserEventRequest request)
{
    return new UserEventResponse("[SYSTEM ACK] Received.");
}
```

# [In-process model](#tab/in-process)
```cs
[FunctionName("WebPubSubTriggerReturnValueFunction")]
public static UserEventResponse Run(
    [WebPubSubTrigger("hub", WebPubSubEventType.User, "message")] UserEventRequest request)
{
    return request.CreateResponse(BinaryData.FromString("ack"), WebPubSubDataType.Text);
}
```

---

::: zone-end

::: zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)
```js
const { app, trigger } = require('@azure/functions');

const wpsTrigger = trigger.generic({
    type: 'webPubSubTrigger',
    name: 'request',
    hub: '<hub>',
    eventName: 'message',
    eventType: 'user'
});

app.generic('message', {
    trigger: wpsTrigger,
    handler: async (request, context) => {
        context.log('Request from: ', request.connectionContext.userId);
        context.log('Request message data: ', request.data);
        context.log('Request message dataType: ', request.dataType);
    }
});
```
# [Model v3](#tab/nodejs-v3)

Define trigger binding in *function.json*.

```json
{
  "disabled": false,
  "bindings": [
    {
      "type": "webPubSubTrigger",
      "direction": "in",
      "name": "data",
      "hub": "<hub>",
      "eventName": "message",
      "eventType": "user"
    }
  ]
}
```

Define function in *index.js*.

```js
module.exports = function (context, data) {
  context.log('Request from: ', context.bindingData.request.connectionContext.userId);
  context.log('Request message data: ', data);
  context.log('Request message dataType: ', context.bindingData.request.dataType);
}
```

---

`WebPubSubTrigger` binding also supports return value in synchronize scenarios, for example, system `Connect` and user event, when server can check and deny the client request, or send message to the request client directly. In JavaScript weakly typed language, it's deserialized regarding the object keys. And `EventErrorResponse` has the highest priority compare to rest objects, that if `code` is in the return, then it's parsed to `EventErrorResponse`.


# [Model v4](#tab/nodejs-v4)

```js
app.generic('message', {
    trigger: wpsTrigger,
    handler: async (request, context) => {
          return {
              "data": "ack",
              "dataType" : "text"
          };
    }
});
```

# [Model v3](#tab/nodejs-v3)

```js
module.exports = async function (context) {
  return {
    "data": "ack",
    "dataType" : "text"
  };
}
```

---

::: zone-end
::: zone pivot="programming-language-python,programming-language-powershell"
> [!NOTE]
> Complete samples for this language are pending.
::: zone-end
::: zone pivot="programming-language-java"
> [!NOTE]
> The Web PubSub extensions for Java isn't supported yet.
::: zone-end


## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a |Required - must be set to `webPubSubTrigger`. |
| **direction** | n/a | Required - must be set to `in`. |
| **name** | n/a | Required - the variable name used in function code for the parameter that receives the event data. |
| **hub** | Hub | Required - the value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **eventType** | WebPubSubEventType | Required - the value must be set as the event type of messages for the function to be triggered. The value should be either `user` or `system`. |
| **eventName** | EventName | Required - the value must be set as the event of messages for the function to be triggered. </br> </br> For `system` event type, the event name should be in `connect`, `connected`, `disconnected`. </br> </br> For user-defined subprotocols, the event name is `message`. </br> </br> For system supported subprotocol `json.webpubsub.azure.v1.`, the event name is user-defined event name. |
| **clientProtocols** | ClientProtocols | Optional - specifies which client protocol can trigger the Web PubSub trigger functions. </br> </br> The following case-insensitive values are valid: </br> `all`: Accepts all client protocols. Default value. </br>`webPubSub`: Accepts only Web PubSub protocols. </br>`mqtt`: Accepts only MQTT protocols. |
| **connection** | Connection | Optional - the name of an app settings or setting collection that specifies the upstream Azure Web PubSub service. The value is used for signature validation. And the value is auto resolved with app settings `WebPubSubConnectionString` by default. And `null` means the validation isn't needed and always succeed. |

[!INCLUDE [functions-azure-web-pubsub-authorization-note](../../includes/functions-azure-web-pubsub-authorization-note.md)]

## Usages

In C#, `WebPubSubEventRequest` is type recognized binding parameter, rest parameters are bound by parameter name. Check following table for available parameters and types.

In weakly typed language like JavaScript, `name` in `function.json` is used to bind the trigger object regarding following mapping table. And respect `dataType` in `function.json` to convert message accordingly when `name` is set to `data` as the binding object for trigger input. All the parameters can be read from `context.bindingData.<BindingName>` and is `JObject` converted.

| Binding Name | Binding Type | Description | Properties |
|---------|---------|---------|---------|
|request|`WebPubSubEventRequest`|Describes the upstream request|Property differs by different event types, including derived classes `ConnectEventRequest`, `MqttConnectEventRequest`, `ConnectedEventRequest`, `MqttConnectedEventRequest`, `UserEventRequest`, `DisconnectedEventRequest`, and `MqttDisconnectedEventRequest`. |
|connectionContext|`WebPubSubConnectionContext`|Common request information| EventType, EventName, Hub, ConnectionId, UserId, Headers, Origin, Signature, States |
|data|`BinaryData`,`string`,`Stream`,`byte[]`| Request message data from client in user `message` event | -|
|dataType|`WebPubSubDataType`| Request message dataType, which supports `binary`, `text`, `json` | -|
|claims|`IDictionary<string, string[]>`|User Claims in system `connect` request | -|
|query|`IDictionary<string, string[]>`|User query in system `connect` request | -|
|subprotocols|`IList<string>`|Available subprotocols in system `connect` request | -|
|clientCertificates|`IList<ClientCertificate>`|A list of certificate thumbprint from clients in system `connect` request|-|
|reason|`string`|Reason in system `disconnected` request|-|

> [!IMPORTANT]
> In C#, multiple types supported parameter __MUST__ be put in the first, i.e. `request` or `data` that other than the default `BinaryData` type to make the function binding correctly.

### Return response

`WebPubSubTrigger` respects customer returned response for synchronous events of `connect` and user event. Only matched response is sent back to service, otherwise, it's ignored. Besides, `WebPubSubTrigger` return object supports users to `SetState()` and `ClearStates()` to manage the metadata for the connection. And the extension merges the results from return value with the original ones from request `WebPubSubConnectionContext.States`. Value in existing key is overwrite and value in new key is added.

| Return Type | Description | Properties |
|---------|---------|---------|
|[`ConnectEventResponse`](/dotnet/api/microsoft.azure.webpubsub.common.connecteventresponse)| Response for `connect` event | Groups, Roles, UserId, Subprotocol |
|[`UserEventResponse`](/dotnet/api/microsoft.azure.webpubsub.common.usereventresponse)| Response for user event | DataType, Data |
|[`EventErrorResponse`](/dotnet/api/microsoft.azure.webpubsub.common.eventerrorresponse)| Error response for the sync event | Code, ErrorMessage |
|[`*WebPubSubEventResponse`](/dotnet/api/microsoft.azure.webpubsub.common.webpubsubeventresponse)| Base response type of the supported ones used for uncertain return cases | - |


