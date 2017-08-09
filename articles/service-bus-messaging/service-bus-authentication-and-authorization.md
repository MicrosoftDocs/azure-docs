---
title: Azure Service Bus authentication and authorization | Microsoft Docs
description: Authenticate apps to Service Bus with Shared Access Signature (SAS) authentication.
services: service-bus-messaging
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 18bad0ed-1cee-4a5c-a377-facc4785c8c9
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/09/2017
ms.author: sethm

---
# Service Bus authentication and authorization

Applications can authenticate to Azure Service Bus using Shared Access Signature (SAS) authentication. Shared Access Signature authentication enables applications to authenticate to Service Bus using an access key configured on the namespace, or on the entity with which specific rights are associated. You can then use this key to generate a Shared Access Signature token that clients can use to authenticate to Service Bus.

> [!IMPORTANT]
> SAS is strongly recommended over Azure Active Directory Access Control (also known as Access Control Service or ACS), and ACS is being deprecated. SAS provides a simple, flexible, and easy-to-use authentication scheme for Service Bus. Applications can use SAS in scenarios in which they do not need to manage the notion of an authorized "user." For more information, see [this blog post](https://blogs.msdn.microsoft.com/servicebus/2017/06/01/upcoming-changes-to-acs-enabled-namespaces/).

## Shared Access Signature authentication

[SAS authentication](service-bus-sas.md) enables you to grant a user access to Service Bus resources with specific rights. SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure keys for SAS on a Service Bus namespace. The key applies to all messaging entities in that namespace. You can also configure keys on Service Bus queues and topics. SAS is also supported on [Azure Relay](../service-bus-relay/relay-authentication-and-authorization.md).

To use SAS, you can configure a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object on a namespace, queue, or topic. This rule consists of the following elements:

* *KeyName* that identifies the rule.
* *PrimaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *SecondaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *Rights* representing the collection of Listen, Send, or Manage rights granted.

Authorization rules configured at the namespace level can grant access to all entities in a namespace for clients with tokens signed using the corresponding key. Up to 12 such authorization rules can be configured on a Service Bus namespace, queue, or topic. By default, a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) with all rights is configured for every namespace when it is first provisioned.

To access an entity, the client requires a SAS token generated using a specific [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

SAS authentication support for Service Bus is included in the Azure .NET SDK versions 2.0 and later. SAS includes support for a [SharedAccessAuthorizationRule](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). All APIs that accept a connection string as a parameter include support for SAS connection strings.

## Next steps

- Continue reading [Service Bus authentication with Shared Access Signatures](service-bus-sas.md) for more details about SAS.
- [Changes To ACS Enabled namespaces.](https://blogs.msdn.microsoft.com/servicebus/2017/06/01/upcoming-changes-to-acs-enabled-namespaces/)
- For corresponding information about Azure Relay authentication and authorization, see [Azure Relay authentication and authorization](../service-bus-relay/relay-authentication-and-authorization.md). 

