---
title: Upstream settings in Azure SignalR Service
description: Get an introduction of upstream settings and protocols of upstream messages.
author: chenyl
ms.service: signalr
ms.topic: conceptual
ms.date: 06/11/2020
ms.author: chenyl
---

# Upstream settings

Upstream is a feature that allows Azure SignalR Service to send messages and connection events to a set of endpoints in serverless mode. You can use upstream to invoke a hub method from clients in serverless mode and let endpoints get notified when client connections are connected or disconnected.

> [!NOTE]
> Only serverless mode can configure upstream settings.

## Details of upstream settings

Upstream settings consist of a list of order-sensitive items. Each item consists of:

* A URL template, which specifies where messages send to.
* A set of rules.
* Authentication configurations. 

When the specified event happens, an item's rules are checked one by one in order. Messages will be sent to the first matching item's upstream URL.

### URL template settings

You can parameterize the URL to support various patterns. There are three predefined parameters:

|Predefined parameter|Description|
|---------|---------|
|{hub}| A hub is a concept of Azure SignalR Service. A hub is a unit of isolation. The scope of users and message delivery is constrained to a hub.|
|{category}| A category can be one of the following values: <ul><li>**connections**: Connection lifetime events. It's fired when a client connection is connected or disconnected. It includes connected and disconnected events.</li><li>**messages**: Fired when clients invoke a hub method. It includes all other events, except those in the **connections** category.</li></ul>|
|{event}| For the **messages** category, an event is the target in an [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding) that clients send. For the **connections** category, only *connected* and *disconnected* are used.|

These predefined parameters can be used in the URL pattern. Parameters will be replaced with a specified value when you're evaluating the upstream URL. For example: 
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

### Rule settings

You can set rules for *hub rules*, *category rules*, and *event rules* separately. The matching rule supports three formats. Take event rules as an example:
- Use an asterisk(*) to match any events.
- Use a comma (,) to join multiple events. For example, `connected, disconnected` matches the connected and disconnected events.
- Use the full event name to match the event. For example, `connected` matches the connected event.

### Authentication settings

You can configure authentication for each upstream setting item separately. When you configure authentication, a token is set in the `Authentication` header of the upstream message. Currently, Azure SignalR Service supports the following authentication types:
- `None`
- `ManagedIdentity`

When you select `ManagedIdentity`, you must enable a managed identity in Azure SignalR Service in advance and optionally specify a resource. See [Managed identities for Azure SignalR Service](howto-use-managed-identity.md) for details.

## Create upstream settings via the Azure portal

1. Go to Azure SignalR Service.
2. Select **Settings** and switch **Service Mode** to **Serverless**. The upstream settings will appear:

    :::image type="content" source="media/concept-upstream/upstream-portal.png" alt-text="Upstream settings":::

3. Add URLs under **Upstream URL Pattern**. Then settings such as **Hub Rules** will show the default value.
4. To set settings for **Hub Rules**, **Event Rules**, **Category Rules**, and **Upstream Authentication**, select the value of **Hub Rules**. A page that allows you to edit settings appears:

    :::image type="content" source="media/concept-upstream/upstream-detail-portal.png" alt-text="Upstream settings":::

5. To set **Upstream Authentication**, make sure you've enabled a managed identity first. Then select **Use Managed Identity**. According to your needs, you can choose any options under **Auth Resource ID**. See [Managed identities for Azure SignalR Service](howto-use-managed-identity.md) for details.

## Create upstream settings via Resource Manager template

To create upstream settings by using an [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview), set the `upstream` property in the `properties` property. The following snippet shows how to set the `upstream` property for creating and updating upstream settings.

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

Azure SignalR Service sends messages to endpoints that follow the following protocols.

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

Content-Type: application/json

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

The service will calculate SHA256 code for the `X-ASRS-Connection-Id` value by using both the primary access key and the secondary access key as the `HMAC` key. The service will set it in the `X-ASRS-Signature` header when making HTTP requests to upstream:
```
Hex_encoded(HMAC_SHA256(accessKey, connection-id))
```

## Next steps

- [Managed identities for Azure SignalR Service](howto-use-managed-identity.md)
- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
