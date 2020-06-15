---
title: Upstream Settings in Azure SignalR Service
description: An introduction of Upstream Settings and protocol of upstream messages
author: chenyl
ms.service: signalr
ms.topic: conceptual
ms.date: 06/11/2020
ms.author: chenyl
---

# Upstream Settings

Upstream is a feature that allows SignalR Service to send messages and connection events to a set of endpoints in serverless mode. Upstream can be used to invoke hub method from clients in serverless mode and let endpoints get notified when client connections are connected or disconnected.

> [!NOTE]
> Only serverless mode can configure Upstream Settings.

## Upstream Settings details

Upstream Settings consist of a list of order sensitive items. Each item consists of an `URL Template`, which specifies where messages send to, a set of `Rules` and `Authentication` configurations. When the specified event happens, item's `Rules` will be checked one by one in order and messages will be sent to the first matching item's Upstream URL.

### URL Template Settings

The URL can be parameterized to support various patterns. There are three predefined parameters:

|Predefined parameter|Description|
|---------|---------|
|{hub}| Hub is a concept of SignalR. A hub is a unit of isolation, the scope of users and messages delivery is constrained to a hub|
|{category}| Category can be one of the following values: <ul><li>**connections**: Connection lifetime events. Fired when a client connection is connected or disconnected. Including *connected* and *disconnected* events</li><li>**messages**: Fired when clients invoke hub method. Including all other events except those in *connections* category</li></ul>|
|{event}| For *messages* category, event is the *target* in [invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding) that clients send. For *connections* category, only *connected* and *disconnected* is used.|

These predefined parameters can be used in the `URL Pattern` and parameters will be replaced with a specified value when evaluating the Upstream URL. E.g. 
```
http://host.com/{hub}/api/{category}/{event}
```
When a client connection in hub 'chat' is connected, a message will be sent to URL:
```
http://host.com/chat/api/connections/connected
```
When a client in hub `chat` invokes hub method `broadcast`, a message will be sent to URL:
```
http://host.com/chat/api/messages/broadcast
```

### Rules Settings

You can set rules for *Hub Rules*, *Category Rules* and *Event Rules* separately. The matching rule supports three formats. Take the *Event Rules* as an example:
1. Use asterisk(*) to match any events.
2. User comma(,) to join multiple events. For example, `connected, disconnected` matches events *connected* and *disconnected*.
3. Use the full event name to match the event. For example, `connected` matches *connected* event.

### Authentication Settings

You can configure *Authentication* for each Upstream Settings item separately. When configured *Authentication*, a token will be set in the *Authentication* header of the upstream message. Current, SignalR Service support the following Authentication type
- None
- ManagedIdentity

When select *ManagedIdentity*, you must enable Managed Identity in SignalR Service in advance and optionally specify a *Resource*. See [How to use managed identities for Azure SignalR Service](signalr-howto-use-managed-identity.md) for details.

## Create Upstream Settings

### Create Upstream Settings via ARM Template

To create Upstream Settings using a [Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview), set `upstream` property in the `properties` property. The following snippets show how to set the `upstream` property for creating and updating Upstream Settings.

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

## SignalR Serverless Protocol

SignalR Service sending messages to endpoints that follow the following protocols.

### Method

POST

### Request Header

|Name |Description|
|---------|---------|
|X-ASRS-Connection-Id |The connection-id for the client connection|
|X-ASRS-Hub |The hub that the client connection belongs to|
|X-ASRS-Category |The category that the message belongs to|
|X-ASRS-Event |The event that the message belongs to|
|X-ASRS-Signature |An HMAC that used for validation. See [Signature](#signature) for details.|
|X-ASRS-User-Claims |A group of claims of the client connection|
|X-ASRS-User-Id |The user identity of the client which sends the message|
|X-ASRS-Client-Query |The query of the request when clients connect to the service|
|Authentication |An optional token when using *ManagedIdentity* |

### Request Body

#### Connected

Content-Type: application/json

#### Disconnected

Content-Type: `application/json`

|Name  |Type  |Description  |
|---------|---------|---------|
|Error |string |The error message of connection closed. Empty when connections close with no error|

#### Invocation Message

Content-Type: `application/json` or `application/x-msgpack`

|Name  |Type  |Description  |
|---------|---------|---------|
|InvocationId |string | An optional string represents an invocation message. Find details in [Invocations](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocations).|
|Target |string | The same as *event* and the same as the *target* in [Invocation message](https://github.com/dotnet/aspnetcore/blob/master/src/SignalR/docs/specs/HubProtocol.md#invocation-message-encoding). |
|Arguments |Array of object |An Array containing arguments to apply to the method referred to in Target. |

### Signature

The service will calculate SHA256 code for the `X-ASRS-Connection-Id` value using both primary access key and secondary access key as the `HMAC` key, and will set it in the `X-ASRS-Signature` header when making HTTP requests to the Upstream:
```
Hex_encoded(HMAC_SHA256(accessKey, connection-id))
```

## Next steps

- [How to use managed identities for Azure SignalR Service](signalr-howto-use-managed-identity.md)
- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
