---
title: Azure Relay authentication and authorization | Microsoft Docs
description: This article provides an overview of Shared Access Signature (SAS) authentication with the Azure Relay service.
services: service-bus-relay
documentationcenter: na
author: spelluru
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/21/2020
ms.author: spelluru

---
# Azure Relay authentication and authorization

Applications can authenticate to Azure Relay using Shared Access Signature (SAS) authentication. SAS authentication enables applications to authenticate to the Azure Relay service using an access key configured on the Relay namespace. You can then use this key to generate a Shared Access Signature token that clients can use to authenticate to the relay service.

## Shared Access Signature authentication

[SAS authentication](../service-bus-messaging/service-bus-sas.md) enables you to grant a user access to Azure Relay resources with specific rights. SAS authentication involves the configuration of a cryptographic key with associated rights on a resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure keys for SAS on a Relay namespace. Unlike Service Bus messaging, [Relay Hybrid Connections](relay-hybrid-connections-protocol.md) supports unauthorized or anonymous senders. You can enable anonymous access for the entity when you create it, as shown in the following screenshot from the portal:

![][0]

To use SAS, you can configure a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object on a Relay namespace that consists of the following:

* *KeyName* that identifies the rule.
* *PrimaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *SecondaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *Rights* representing the collection of Listen, Send, or Manage rights granted.

Authorization rules configured at the namespace level can grant access to all relay connections in a namespace for clients with tokens signed using the corresponding key. Up to 12 such authorization rules can be configured on a Relay namespace. By default, a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) with all rights is configured for every namespace when it is first provisioned.

To access an entity, the client requires a SAS token generated using a specific [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

SAS authentication support for Azure Relay is included in the Azure .NET SDK versions 2.0 and later. SAS includes support for a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). All APIs that accept a connection string as a parameter include support for SAS connection strings.

## Next steps

- Continue reading [Service Bus authentication with Shared Access Signatures](../service-bus-messaging/service-bus-sas.md) for more details about SAS.
- See the [Azure Relay Hybrid Connections protocol guide](relay-hybrid-connections-protocol.md) for detailed information about the Hybrid Connections capability.
- For corresponding information about Service Bus Messaging authentication and authorization, see [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md). 

[0]: ./media/relay-authentication-and-authorization/hcanon.png