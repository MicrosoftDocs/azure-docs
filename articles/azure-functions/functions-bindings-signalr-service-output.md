---
title: Azure Functions SignalR Service output binding
description: Learn about the SignalR Service output binding for Azure Functions.
author: Y-Sindo
ms.topic: reference
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 01/13/2023
ms.author: zityang
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# SignalR Service output binding for Azure Functions

Use the *SignalR* output binding to send one or more messages using Azure SignalR Service. You can broadcast a message to:

- All connected clients
- Connected clients authenticated to a specific user

The output binding also allows you to manage groups.

For information on setup and configuration details, see the [overview](functions-bindings-signalr-service.md).

## Example

::: zone pivot="programming-language-csharp"

[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

### Broadcast to all clients

# [Isolated worker model](#tab/isolated-process)

The following example shows a function that sends a message using the output binding to all connected clients. The *newMessage* is the name of the method to be invoked on each client.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/SignalR/SignalROutputBindingFunctions2.cs" id="snippet_broadcast_to_all":::

# [In-process model](#tab/in-process)

The following example shows a function that sends a message using the output binding to all connected clients. The *target* is the name of the method to be invoked on each client. The *Arguments* property is an array of zero or more objects to be passed to the client method.

```cs
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message,
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

### Broadcast to all clients

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

::: zone-end
::: zone pivot="programming-language-javascript"

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.bindings.signalRMessages = [{
        "target": "newMessage",
        "arguments": [ req.body ]
    }];
};
```

::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

Here's the Python code:

```python
def main(req: func.HttpRequest, outMessage: func.Out[str]) -> func.HttpResponse:
    message = req.get_json()
    outMessage.set(json.dumps({
        'target': 'newMessage',
        'arguments': [ message ]
    }))
```

::: zone-end
::: zone pivot="programming-language-java"

### Broadcast to all clients

```java
@FunctionName("sendMessage")
@SignalROutput(name = "$return", hubName = "chat")
public SignalRMessage sendMessage(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req) {

    SignalRMessage message = new SignalRMessage();
    message.target = "newMessage";
    message.arguments.add(req.getBody());
    return message;
}
```

::: zone-end
::: zone pivot="programming-language-csharp"

### Send to a user

You can send a message only to connections that have been authenticated to a user by setting the *user ID* in the SignalR message.

# [Isolated worker model](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/SignalR/SignalROutputBindingFunctions2.cs" id="snippet_send_to_user":::

# [In-process model](#tab/in-process)

```cs
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message,
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            // the message will only be sent to this user ID
            UserId = "userId1",
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

### Send to a user

You can send a message only to connections that have been authenticated to a user by setting the *user ID* in the SignalR message.

Example function.json:

```json
{
  "type": "signalR",
  "name": "outRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

::: zone-end
::: zone pivot="programming-language-javascript"
Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.bindings.signalRMessages  = [{
        // message will only be sent to this user ID
        "userId": "userId1",
        "target": "newMessage",
        "arguments": [ req.body ]
    }];
};
```

::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

Here's the Python code:

```python
def main(req: func.HttpRequest, outMessages: func.Out[str]) -> func.HttpResponse:
    message = req.get_json()
    outMessage.set(json.dumps({
        #message will only be sent to this user ID
        'userId': 'userId1',
        'target': 'newMessage',
        'arguments': [ message ]
    }))
```

::: zone-end
::: zone pivot="programming-language-java"
### Send to a user

You can send a message only to connections that have been authenticated to a user by setting the *user ID* in the SignalR message.

```java
@FunctionName("sendMessage")
@SignalROutput(name = "$return", hubName = "chat")
public SignalRMessage sendMessage(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req) {

    SignalRMessage message = new SignalRMessage();
    message.userId = "userId1";
    message.target = "newMessage";
    message.arguments.add(req.getBody());
    return message;
}
```

::: zone-end
::: zone pivot="programming-language-csharp"
### Send to a group

You can send a message only to connections that have been added to a group by setting the *group name* in the SignalR message.

# [Isolated worker model](#tab/isolated-process)

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/SignalR/SignalROutputBindingFunctions2.cs" id="snippet_send_to_group":::

# [In-process model](#tab/in-process)

```cs
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message,
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            // the message will be sent to the group with this name
            GroupName = "myGroup",
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```
---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"
### Send to a group

You can send a message only to connections that have been added to a group by setting the *group name* in the SignalR message.

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```

::: zone-end
::: zone pivot="programming-language-javascript"
Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.bindings.signalRMessages = [{
        // message will only be sent to this group
        "groupName": "myGroup",
        "target": "newMessage",
        "arguments": [ req.body ]
    }];
};
```

::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

Here's the Python code:

```python
def main(req: func.HttpRequest, outMessage: func.Out[str]) -> func.HttpResponse:
    message = req.get_json()
    outMessage.set(json.dumps({
        #message will only be sent to this group
        'groupName': 'myGroup',
        'target': 'newMessage',
        'arguments': [ message ]
    }))
```

::: zone-end
::: zone pivot="programming-language-java"

### Send to a group

You can send a message only to connections that have been added to a group by setting the *group name* in the SignalR message.

```java
@FunctionName("sendMessage")
@SignalROutput(name = "$return", hubName = "chat")
public SignalRMessage sendMessage(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req) {

    SignalRMessage message = new SignalRMessage();
    message.groupName = "myGroup";
    message.target = "newMessage";
    message.arguments.add(req.getBody());
    return message;
}
```

::: zone-end
::: zone pivot="programming-language-csharp"
### Group management

SignalR Service allows users or connections to be added to groups. Messages can then be sent to a group. You can use the `SignalR` output binding to manage groups.

# [Isolated worker model](#tab/isolated-process)

Specify `SignalRGroupActionType` to add or remove a member. The following example removes a user from a group.

:::code language="csharp" source="~/azure-functions-dotnet-worker/samples/Extensions/SignalR/SignalROutputBindingFunctions2.cs" id="snippet_remove_from_group":::

# [In-process model](#tab/in-process)

Specify `GroupAction` to add or remove a member. The following example adds a user to a group.

```csharp
[FunctionName("addToGroup")]
public static Task AddToGroup(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req,
    ClaimsPrincipal claimsPrincipal,
    [SignalR(HubName = "chat")]
        IAsyncCollector<SignalRGroupAction> signalRGroupActions)
{
    var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
    return signalRGroupActions.AddAsync(
        new SignalRGroupAction
        {
            UserId = userIdClaim.Value,
            GroupName = "myGroup",
            Action = GroupAction.Add
        });
}
```

---

> [!NOTE]
> In order to get the `ClaimsPrincipal` correctly bound, you must have configured the authentication settings in Azure Functions.

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"

### Group management

SignalR Service allows users or connections to be added to groups. Messages can then be sent to a group. You can use the `SignalR` output binding to manage groups.

Example *function.json* that defines the output binding:

```json
{
    "type": "signalR",
    "name": "signalRGroupActions",
    "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
    "hubName": "chat",
    "direction": "out"
}
```

::: zone-end
::: zone pivot="programming-language-javascript"

The following example adds a user to a group.

```javascript
module.exports = async function (context, req) {
  context.bindings.signalRGroupActions = [{
    "userId": req.query.userId,
    "groupName": "myGroup",
    "action": "add"
  }];
};
```

The following example removes a user from a group.

```javascript
module.exports = async function (context, req) {
  context.bindings.signalRGroupActions = [{
    "userId": req.query.userId,
    "groupName": "myGroup",
    "action": "remove"
  }];
};
```

::: zone-end
::: zone pivot="programming-language-powershell"

Complete PowerShell examples are pending.
::: zone-end
::: zone pivot="programming-language-python"

The following example adds a user to a group.

```python
def main(req: func.HttpRequest, action: func.Out[str]) -> func.HttpResponse:
    action.set(json.dumps({
        'userId': 'userId1',
        'groupName': 'myGroup',
        'action': 'add'
    }))
```

The following example removes a user from a group.

```python
def main(req: func.HttpRequest, action: func.Out[str]) -> func.HttpResponse:
    action.set(json.dumps({
        'userId': 'userId1',
        'groupName': 'myGroup',
        'action': 'remove'
    }))
```

::: zone-end
::: zone pivot="programming-language-java"

### Group management

SignalR Service allows users or connections to be added to groups. Messages can then be sent to a group. You can use the `SignalR` output binding to manage groups.

The following example adds a user to a group.

```java
@FunctionName("addToGroup")
@SignalROutput(name = "$return", hubName = "chat")
public SignalRGroupAction addToGroup(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req,
        @BindingName("userId") String userId) {

    SignalRGroupAction groupAction = new SignalRGroupAction();
    groupAction.action = "add";
    groupAction.userId = userId;
    groupAction.groupName = "myGroup";
    return action;
}
```

The following example removes a user from a group.

```java
@FunctionName("removeFromGroup")
@SignalROutput(name = "$return", hubName = "chat")
public SignalRGroupAction removeFromGroup(
        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.POST },
            authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req,
        @BindingName("userId") String userId) {

    SignalRGroupAction groupAction = new SignalRGroupAction();
    groupAction.action = "remove";
    groupAction.userId = userId;
    groupAction.groupName = "myGroup";
    return action;
}
```
::: zone-end
::: zone pivot="programming-language-csharp"

## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attribute to define the function. C# script instead uses a [function.json configuration file](#configuration).

# [Isolated worker model](#tab/isolated-process)

The following table explains the properties of the `SignalROutput` attribute.

| Attribute property |Description|
|---------|----------------------|
|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |
# [In-process model](#tab/in-process)

The following table explains the properties of the `SignalR` output attribute.

| Attribute property |Description|
|---------|----------------------|
|**HubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**ConnectionStringSetting**| The name of the app setting that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |


---

::: zone-end
::: zone pivot="programming-language-java"

## Annotations

The following table explains the supported settings for the `SignalROutput` annotation.

|Setting | Description|
|---------|--------|
|**name**| Variable name used in function code for connection info object. |
|**hubName**|This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**connectionStringSetting**|The name of the app setting that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python"
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file.

|function.json property | Description|
|---------|----------------------|
|**type**|  Must be set to `signalR`.|
|**direction**|Must be set to `out`.|
|**name**|  Variable name used in function code for connection info object. |
|**hubName**| This value must be set to the name of the SignalR hub for which the connection information is generated.|
|**connectionStringSetting**| The name of the app setting that contains the SignalR Service connection string, which defaults to `AzureSignalRConnectionString`. |


::: zone-end

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Next steps

- [Handle messages from SignalR Service  (Trigger binding)](./functions-bindings-signalr-service-trigger.md)
- [Return the service endpoint URL and access token (Input binding)](./functions-bindings-signalr-service-input.md)
