---
title: Azure Functions Web PubSub output binding
description: Learn about the Web PubSub output binding for Azure Functions.
author: Y-Sindo
ms.topic: reference
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 09/02/2024
ms.author: zityang
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure Web PubSub output binding for Azure Functions

Use the *Web PubSub* output binding to invoke Azure Web PubSub service to do something. You can send a message to:

* All connected clients
* Connected clients authenticated to a specific user
* Connected clients joined in a specific group
* A specific client connection

The output binding also allows you to manage clients and groups, and grant/revoke permissions targeting specific connectionId with group.

* Add connection to group
* Add user to group
* Remove connection from a group
* Remove user from a group
* Remove user from all groups
* Close all client connections
* Close a specific client connection
* Close connections in a group
* Grant permission of a connection
* Revoke permission of a connection

For information on setup and configuration details, see the [overview](functions-bindings-web-pubsub.md).

## Example

::: zone pivot="programming-language-csharp"
# [Isolated worker model](#tab/isolated-process)

```csharp
[Function("WebPubSubOutputBinding")]
[WebPubSubOutput(Hub = "<hub>", Connection = "<web_pubsub_connection_name>")]
public static WebPubSubAction Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
{
    return new SendToAllAction
    {
        Data = BinaryData.FromString("Hello Web PubSub!"),
        DataType = WebPubSubDataType.Text
    };
}

```

# [In-process model](#tab/in-process)

```csharp
[FunctionName("WebPubSubOutputBinding")]
public static async Task RunAsync(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req,
    [WebPubSub(Hub = "<hub>")] IAsyncCollector<WebPubSubAction> actions)
{
    await actions.AddAsync(WebPubSubAction.CreateSendToAllAction("Hello Web PubSub!", WebPubSubDataType.Text));
}
```

---
::: zone-end

::: zone pivot="programming-language-javascript"

# [Model v4](#tab/nodejs-v4)

```js
const { app, output } = require('@azure/functions');
const wpsMsg = output.generic({
    type: 'webPubSub',
    name: 'actions',
    hub: '<hub>',
});

app.http('message', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [wpsMsg],
    handler: async (request, context) => {
        context.extraOutputs.set(wpsMsg, [{
            "actionName": "sendToAll",
            "data": `Hello world`,
            "dataType": `text`
        }]);
    }
});
```

# [Model v3](#tab/nodejs-v3)

Define bindings in *functions.json*.

```json
{
  "disabled": false,
  "bindings": [
    {
      "type": "webPubSub",
      "name": "actions",
      "hub": "<hub>",
      "direction": "out"
    }
  ]
}
```

Define function in *index.js*.

```js
module.exports = async function (context) {
  context.bindings.actions = {
    "actionName": "sendToAll",
    "data": "Hello world",
    "dataType": "text"
  };
  context.done();
}
```


---

::: zone-end
::: zone pivot="programming-language-python,programming-language-powershell"

> [!NOTE]
> Complete samples for this language are pending

::: zone-end
::: zone pivot="programming-language-java"

> [!NOTE]
> The Web PubSub extensions for Java is not supported yet.

::: zone-end

### WebPubSubAction

`WebPubSubAction` is the base abstract type of output bindings. The derived types represent the action server want service to invoke.

::: zone pivot="programming-language-csharp"


In C# language, we provide a few static methods under `WebPubSubAction` to help discover available actions. For example, user can create the `SendToAllAction` by call `WebPubSubAction.CreateSendToAllAction()`.

| Derived Class | Properties |
| -- | -- |
| `SendToAllAction`|Data, DataType, Excluded |
| `SendToGroupAction`|Group, Data, DataType, Excluded |
| `SendToUserAction`|UserId, Data, DataType |
| `SendToConnectionAction`|ConnectionId, Data, DataType |
| `AddUserToGroupAction`|UserId, Group |
| `RemoveUserFromGroupAction`|UserId, Group |
| `RemoveUserFromAllGroupsAction`|UserId |
| `AddConnectionToGroupAction`|ConnectionId, Group |
| `RemoveConnectionFromGroupAction`|ConnectionId, Group |
| `CloseAllConnectionsAction`|Excluded, Reason |
| `CloseClientConnectionAction`|ConnectionId, Reason |
| `CloseGroupConnectionsAction`|Group, Excluded, Reason |
| `GrantPermissionAction`|ConnectionId, Permission, TargetName |
| `RevokePermissionAction`|ConnectionId, Permission, TargetName |

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

**`actionName`** is the key parameter to resolve the type. Available actions are listed as follows.

| ActionName | Properties |
| -- | -- |
| `sendToAll`|Data, DataType, Excluded |
| `sendToGroup`|Group, Data, DataType, Excluded |
| `sendToUser`|UserId, Data, DataType |
| `sendToConnection`|ConnectionId, Data, DataType |
| `addUserToGroup`|UserId, Group |
| `removeUserFromGroup`|UserId, Group |
| `removeUserFromAllGroups`|UserId |
| `addConnectionToGroup`|ConnectionId, Group |
| `removeConnectionFromGroup`|ConnectionId, Group |
| `closeAllConnections`|Excluded, Reason |
| `closeClientConnection`|ConnectionId, Reason |
| `closeGroupConnections`|Group, Excluded, Reason |
| `grantPermission`|ConnectionId, Permission, TargetName |
| `revokePermission`|ConnectionId, Permission, TargetName |

> [!IMPORTANT]
> The message data property in the sent message related actions must be `string` if data type is set to `json` or `text` to avoid data conversion ambiguity. Please use `JSON.stringify()` to convert the json object in need. This is applied to any place using message property, for example, `UserEventResponse.Data` working with `WebPubSubTrigger`.
>
> When data type is set to `binary`, it's allowed to leverage binding naturally supported `dataType` as `binary` configured in the `function.json`, see [Trigger and binding definitions](../azure-functions/functions-triggers-bindings.md?tabs=csharp#trigger-and-binding-definitions) for details.

::: zone-end

### Configuration

The following table explains the binding configuration properties that you set in the function.json file and the `WebPubSub` attribute.

| function.json property | Attribute property | Description |
|---------|---------|---------|
| **type** | n/a | Must be set to `webPubSub` |
| **direction** | n/a | Must be set to `out` |
| **name** | n/a | Variable name used in function code for output binding object. |
| **hub** | Hub | The value must be set to the name of the Web PubSub hub for the function to be triggered. We support set the value in attribute as higher priority, or it can be set in app settings as a global value. |
| **connection** | Connection | The name of the app setting that contains the Web PubSub Service connection string (defaults to "WebPubSubConnectionString"). |

[!INCLUDE [functions-azure-web-pubsub-authorization-note](../../includes/functions-azure-web-pubsub-authorization-note.md)]

## Troubleshooting

### Setting up console logging
You can also easily [enable console logging](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/core/Azure.Core/samples/Diagnostics.md#logging) if you want to dig deeper into the requests you're making against the service.

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/functions
