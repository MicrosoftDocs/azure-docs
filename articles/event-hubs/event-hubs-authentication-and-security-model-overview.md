---
title: Authentication and security model - Azure Event Hubs | Microsoft Docs
description: This article describes the authentication and security model of Azure Event Hubs. 
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 93841e30-0c5c-4719-9dc1-57a4814342e7
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija

---
# Azure Event Hubs - Authentication and security model

The Azure Event Hubs security model meets the following requirements:

* Only clients that present valid credentials can send data to an event hub.
* A client cannot impersonate another client.
* A rogue client can be blocked from sending data to an event hub.

## Client authentication

The Event Hubs security model is based on a combination of [Shared Access Signature (SAS)](../service-bus-messaging/service-bus-sas.md) tokens and *event publishers*. An event publisher defines a virtual endpoint for an event hub. The publisher can only be used to send messages to an event hub. It is not possible to receive messages from a publisher.

Typically, an event hub employs one publisher per client. All messages that are sent to any of the publishers of an event hub are enqueued within that event hub. Publishers enable fine-grained access control and throttling.

Each Event Hubs client is assigned a unique token, which is uploaded to the client. The tokens are produced such that each unique token grants access to a different unique publisher. A client that possesses a token can only send to one publisher, but no other publisher. If multiple clients share the same token, then each of them shares a publisher.

Although not recommended, it is possible to equip devices with tokens that grant direct access to an event hub. Any device that holds this token can send messages directly into that event hub. Such a device will not be subject to throttling. Furthermore, the device cannot be blacklisted from sending to that event hub.

All tokens are signed with a SAS key. Typically, all tokens are signed with the same key. Clients are not aware of the key; this prevents other clients from manufacturing tokens.

### Create the SAS key

When creating an Event Hubs namespace, the service automatically generates a 256-bit SAS key named **RootManageSharedAccessKey**. This rule has an associated pair of primary and secondary keys that grant send, listen, and manage rights to the namespace. You can also create additional keys. It is recommended that you produce a key that grants send permissions to the specific event hub. For the remainder of this topic, it is assumed that you named this key **EventHubSendKey**.

The following example creates a send-only key when creating the event hub:

```csharp
// Create namespace manager.
string serviceNamespace = "YOUR_NAMESPACE";
string namespaceManageKeyName = "RootManageSharedAccessKey";
string namespaceManageKey = "YOUR_ROOT_MANAGE_SHARED_ACCESS_KEY";
Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", serviceNamespace, string.Empty);
TokenProvider td = TokenProvider.CreateSharedAccessSignatureTokenProvider(namespaceManageKeyName, namespaceManageKey);
NamespaceManager nm = new NamespaceManager(namespaceUri, namespaceManageTokenProvider);

// Create event hub with a SAS rule that enables sending to that event hub
EventHubDescription ed = new EventHubDescription("MY_EVENT_HUB") { PartitionCount = 32 };
string eventHubSendKeyName = "EventHubSendKey";
string eventHubSendKey = SharedAccessAuthorizationRule.GenerateRandomKey();
SharedAccessAuthorizationRule eventHubSendRule = new SharedAccessAuthorizationRule(eventHubSendKeyName, eventHubSendKey, new[] { AccessRights.Send });
ed.Authorization.Add(eventHubSendRule); 
nm.CreateEventHub(ed);
```

### Generate tokens

You can generate tokens using the SAS key. You must produce only one token per client. Tokens can then be produced using the following method. All tokens are generated using the **EventHubSendKey** key. Each token is assigned a unique URI. The 'resource' parameter corresponds to the URI endpoint of the service(event hub in this case).

```csharp
public static string SharedAccessSignatureTokenProvider.GetSharedAccessSignature(string keyName, string sharedAccessKey, string resource, TimeSpan tokenTimeToLive)
```

When calling this method, the URI should be specified as `https://<NAMESPACE>.servicebus.windows.net/<EVENT_HUB_NAME>/publishers/<PUBLISHER_NAME>`. For all tokens, the URI is identical, with the exception of `PUBLISHER_NAME`, which should be different for each token. Ideally, `PUBLISHER_NAME` represents the ID of the client that receives that token.

This method generates a token with the following structure:

```csharp
SharedAccessSignature sr={URI}&sig={HMAC_SHA256_SIGNATURE}&se={EXPIRATION_TIME}&skn={KEY_NAME}
```

The token expiration time is specified in seconds from Jan 1, 1970. The following is an example of a token:

```csharp
SharedAccessSignature sr=contoso&sig=nPzdNN%2Gli0ifrfJwaK4mkK0RqAB%2byJUlt%2bGFmBHG77A%3d&se=1403130337&skn=RootManageSharedAccessKey
```

Typically, the tokens have a lifespan that resembles or exceeds the lifespan of the client. If the client has the capability to obtain a new token, tokens with a shorter lifespan can be used.

### Sending data

Once the tokens have been created, each client is provisioned with its own unique token.

When the client sends data into an event hub, it tags its send request with the token. To prevent an attacker from eavesdropping and stealing the token, the communication between the client and the event hub must occur over an encrypted channel.

### Blacklisting clients

If a token is stolen by an attacker, the attacker can impersonate the client whose token has been stolen. Blacklisting a client renders that client unusable until it receives a new token that uses a different publisher.

## Authentication of back-end applications

To authenticate back-end applications that consume the data generated by Event Hubs clients, Event Hubs employs a security model that is similar to the model that is used for Service Bus topics. An Event Hubs consumer group is equivalent to a subscription to a Service Bus topic. A client can create a consumer group if the request to create the consumer group is accompanied by a token that grants manage privileges for the event hub, or for the namespace to which the event hub belongs. A client is allowed to consume data from a consumer group if the receive request is accompanied by a token that grants receive rights on that consumer group, the event hub, or the namespace to which the event hub belongs.

The current version of Service Bus does not support SAS rules for individual subscriptions. The same holds true for Event Hubs consumer groups. SAS support will be added for both features in the future.

In the absence of SAS authentication for individual consumer groups, you can use SAS keys to secure all consumer groups with a common key. This approach enables an application to consume data from any of the consumer groups of an event hub.

## Next steps

To learn more about Event Hubs, visit the following topics:

* [Event Hubs overview]
* [Overview of Shared Access Signatures]
* [Sample applications that use Event Hubs]

[Event Hubs overview]: event-hubs-what-is-event-hubs.md
[Sample applications that use Event Hubs]: https://github.com/Azure/azure-event-hubs/tree/master/samples
[Overview of Shared Access Signatures]: ../service-bus-messaging/service-bus-sas.md

