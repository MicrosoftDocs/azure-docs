---
title: Upstream endpoints in Azure SignalR Service
description: Introduction to upstream endpoints settings and upstream message protocols.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 12/09/2022
ms.author: lianwei
---

# Upstream endpoints

The upstream endpoints feature allows Azure SignalR Service to send messages and connection events to a set of endpoints in serverless mode. You can use upstream endpoints to invoke a hub method from clients in serverless mode to notify endpoints when client connections are connected or disconnected.

> [!NOTE]
> Upstream endpoints can only be configured in serverless mode.

## Upstream endpoint settings

An upstream endpoint's settings consist of a list of order-sensitive items:

* A URL template, which specifies where messages send to.
* A set of rules.
* Authentication configurations.

When an event is fired, an item's rules are checked one by one in order. Messages will be sent to the first matching item's upstream endpoint URL.

### URL template settings

You can parameterize the upstream endpoint URL to support various patterns. There are three predefined parameters:

|Predefined parameter|Description|
|---------|---------|
|{hub}| A hub is a concept of Azure SignalR Service. A hub is a unit of isolation. The scope of users and message delivery is constrained to a hub.|
|{category}| A category can be one of the following values: <ul><li>**connections**: Connection lifetime events. It's fired when a client connection is connected or disconnected. It includes connected and disconnected events.</li><li>**messages**: Fired when clients invoke a hub method. It includes all other events, except events in the **connections** category.</li></ul>|
|{event}| For the **messages** category, an event is the target in an [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding) that clients send. For the **connections** category, only *connected* and *disconnected* are used.|

These predefined parameters can be used in the URL pattern. Parameters will be replaced with a specified value when you're evaluating the upstream endpoint URL. For example: 
```
http://host.com/{hub}/api/{category}/{event}
```
When a client connection in the "chat" hub is connected, a message will be sent to this URL:
```
http://host.com/chat/api/connections/connected
```
When a client in the "chat" hub invokes the hub method `broadcast`, a message will be sent to this URL:
```
http://host.com/chat/api/messages/broadcast
```

### Key Vault secret reference in URL template settings

The upstream endpoint URL isn't encrypted. You can secure sensitive upstream endpoints using Key Vault and access them with a managed identity. 

To enable managed identity in your SignalR service instance and grant it Key Vault access:

1. Add a system-assigned identity or user-assigned identity. See [How to add managed identity in Azure portal](./howto-use-managed-identity.md#add-a-system-assigned-identity).
2. Grant secret read permission for the managed identity in the Access policies in the Key Vault. See [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md)

3. Replace your sensitive text with the below syntax in the upstream endpoint URL Pattern:
   ```
   {@Microsoft.KeyVault(SecretUri=<secret-identity>)}
   ```
   `<secret-identity>` is the full data-plane URI of a secret in Key Vault, optionally including a version, e.g., https://myvault.vault.azure.net/secrets/mysecret/ or https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931
   
   For example, a complete reference would look like the following:
   ```
   {@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)}
   ```
   
   An upstream endpoint URL to Azure Function would look like the following:
   ```
   https://contoso.azurewebsites.net/runtime/webhooks/signalr?code={@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)}
   ```

> [!NOTE]
> Every 30 minutes, or whenever the upstream endpoint settings or managed identity change, the service rereads the secret content. You can immediately trigger an update by changing the upstream endpoint settings.

### Rule settings

You can set *hub rules*, *category rules*, and *event rules* separately. The matching rule supports three formats:

* Use an asterisk (*) to match any event.
* Use a comma (,) to join multiple events. For example, `connected, disconnected` matches the connected and disconnected events.
* Use the full event name to match the event. For example, `connected` matches the connected event.

> [!NOTE]
> If you're using Azure Functions with [SignalR trigger](../azure-functions/functions-bindings-signalr-service-trigger.md), SignalR trigger will expose a single endpoint in the following format: `<Function_App_URL>/runtime/webhooks/signalr?code=<API_KEY>`.
> You can just configure **URL template settings** to this url and keep **Rule settings** default. See [SignalR Service integration](../azure-functions/functions-bindings-signalr-service-trigger.md#signalr-service-integration) for details about how to find `<Function_App_URL>` and `<API_KEY>`.

### Authentication settings

You can configure authentication for each upstream endpoint setting separately. When you configure authentication, a token is set in the `Authentication` header of the upstream message. Currently, Azure SignalR Service supports the following authentication types:
- `None`
- `ManagedIdentity`

When you select `ManagedIdentity`, you must first enable a managed identity in Azure SignalR Service and optionally, specify a resource. See [Managed identities for Azure SignalR Service](howto-use-managed-identity.md) for details.

## Configure upstream endpoint settings via the Azure portal

> [!NOTE]
> Integration with App Service Environment is currently not supported.

1. Go to Azure SignalR Service.
1. Select **Settings**.
1. Switch **Service Mode** to **Serverless**.
1. Add URLs under **Upstream URL Pattern**.
  :::image type="content" source="media/concept-upstream/upstream-portal.png" alt-text="Screenshot of AzureSignalR Service Upstream settings.":::
1. Select **Hub Rules** to open **Upstream Settings**.
  :::image type="content" source="media/concept-upstream/upstream-detail-portal.png" alt-text="Screenshot of Azure SignalR Upstream setting details.":::
1. Change **Hub Rules**, **Event Rules** and **Category Rules** by entering rule value in the corresponding field.
1. Under **Upstream Authentication** select 
1. **Use Managed Identity**. (Ensure that you've enabled managed identity)
1. Choose any options under **Audience in the issued token**. See [Managed identities for Azure SignalR Service](howto-use-managed-identity.md) for details.

## Configure upstream endpoint settings via Resource Manager template

To configure upstream endpoint settings by using an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md), set the `upstream` property in the `properties` property. The following snippet shows how to set the `upstream` property for creating and updating upstream endpoint settings.

```JSON
{
  "properties": {
    "upstream": {
      "templates": [
        {
          "UrlTemplate": "http://host.com/{hub}/api/{category}/{event}",
          "EventPattern": "*",
          "HubPattern": "*",
          "CategoryPattern": "*",
          "Auth": {
            "Type": "ManagedIdentity",
            "ManagedIdentity": {
              "Resource": "<resource>"
            }
          }
        }
      ]
    }
  }
}
```

## Serverless protocols

Azure SignalR Service sends messages to endpoints that follow the following protocols. You can use [SignalR Service trigger binding](../azure-functions/functions-bindings-signalr-service-trigger.md) with Function App, which handles these protocols for you.

### Method

POST

### Request header

|Name |Description|
|---------|---------|
|X-ASRS-Connection-Id |The connection ID for the client connection.|
|X-ASRS-Hub |The hub that the client connection belongs to.|
|X-ASRS-Category |The category that the message belongs to.|
|X-ASRS-Event |The event that the message belongs to.|
|X-ASRS-Signature |A hash-based message authentication code (HMAC) that's used for validation. See [Signature](#signature) for details.|
|X-ASRS-User-Claims |A group of claims of the client connection.|
|X-ASRS-User-Id |The user identity of the client that sends the message.|
|X-ASRS-Client-Query |The query of the request when clients connect to the service.|
|Authentication |An optional token when you're using `ManagedIdentity`. |

### Request body

#### Connected

Content-Type: `application/json`

#### Disconnected

Content-Type: `application/json`

|Name  |Type  |Description  |
|---------|---------|---------|
|Error |string |The error message of a closed connection. Empty when connections close with no error.|

#### Invocation message

Content-Type: `application/json` or `application/x-msgpack`

|Name  |Type  |Description  |
|---------|---------|---------|
|InvocationId |string | An optional string that represents an invocation message. Find details in [Invocations](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocations).|
|Target |string | The same as the event and the same as the target in an [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding). |
|Arguments |Array of object |An array that contains arguments to apply to the method referred to in `Target`. |

### Signature

The service will calculate SHA256 code for the `X-ASRS-Connection-Id` value by using both the primary access key and the secondary access key as the `HMAC` key. The service will set it in the `X-ASRS-Signature` header when making HTTP requests to an upstream endpoint:

```text
Hex_encoded(HMAC_SHA256(accessKey, connection-id))
```

## Next steps

- [Managed identities for Azure SignalR Service](howto-use-managed-identity.md)
- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
- [Handle messages from SignalR Service (Trigger binding)](../azure-functions/functions-bindings-signalr-service-trigger.md)
- [SignalR Service Trigger binding sample](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/BidirectionChat)
