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
ms.date: 06/27/2017
ms.author: sethm

---
# Service Bus authentication and authorization

Applications can authenticate to Azure Service Bus using either Shared Access Signature (SAS) authentication, or through Azure Active Directory Access Control (also known as Access Control Service or ACS). Shared Access Signature authentication enables applications to authenticate to Service Bus using an access key configured on the namespace, or on the entity with which specific rights are associated. You can then use this key to generate a Shared Access Signature token that clients can use to authenticate to Service Bus.

> [!IMPORTANT]
> SAS is recommended over ACS, as it provides a simple, flexible, and easy-to-use authentication scheme for Service Bus. Applications can use SAS in scenarios in which they do not need to manage the notion of an authorized "user." 

## Shared Access Signature authentication
[SAS authentication](service-bus-sas.md) enables you to grant a user access to Service Bus resources with specific rights. SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure keys for SAS on a Service Bus namespace. The key applies to all messaging entities in that namespace. You can also configure keys on Service Bus queues and topics. SAS is also supported on [Azure Relay](../service-bus-relay/relay-authentication-and-authorization.md).

To use SAS, you can configure a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object on a namespace, queue, or topic that consists of the following:

* *KeyName* that identifies the rule.
* *PrimaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *SecondaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *Rights* representing the collection of Listen, Send, or Manage rights granted.

Authorization rules configured at the namespace level can grant access to all entities in a namespace for clients with tokens signed using the corresponding key. Up to 12 such authorization rules can be configured on a Service Bus namespace, queue, or topic. By default, a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) with all rights is configured for every namespace when it is first provisioned.

To access an entity, the client requires a SAS token generated using a specific [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

SAS authentication support for Service Bus is included in the Azure .NET SDK versions 2.0 and later. SAS includes support for a [SharedAccessAuthorizationRule](https://docs.microsoft.com/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). All APIs that accept a connection string as a parameter include support for SAS connection strings.

## ACS authentication
Service Bus authentication through ACS is managed through a companion "-sb" ACS namespace. If you want a companion ACS namespace to be created for a Service Bus namespace, you cannot create your Service Bus namespace using the Azure classic portal; you must create the namespace using the [New-AzureSBNamespace](/powershell/module/azure/new-azuresbnamespace?view=azuresmps-3.7.0) PowerShell cmdlet. For example:

```powershell
New-AzureSBNamespace <namespaceName> "<Region>” -CreateACSNamespace $true
```

To avoid creating an ACS namespace, issue the following command:

```powershell
New-AzureSBNamespace <namespaceName> "<Region>” -CreateACSNamespace $false
```

For example, if you create a Service Bus namespace called **contoso.servicebus.windows.net**, a companion ACS namespace named **contoso-sb.accesscontrol.windows.net** is provisioned automatically. For all namespaces that were created before August 2014, an accompanying ACS namespace was also created.

A default service identity "owner," with all rights, is provisioned by default in this companion ACS namespace. You can obtain fine-grained control to any Service Bus entity through ACS by configuring the appropriate trust relationships. You can configure additional service identities for managing access to Service Bus entities.

To access an entity, the client requests an SWT token from ACS with the appropriate claims by presenting its credentials. The SWT token must then be sent as a part of the request to Service Bus to enable the authorization of the client for access to the entity.

ACS authentication support for Service Bus is included in the Azure .NET SDK versions 2.0 and later. This authentication includes support for a [SharedSecretTokenProvider](/dotnet/api/microsoft.servicebus.sharedsecrettokenprovider). All APIs that accept a connection string as a parameter include support for ACS connection strings.

## Next steps

Continue reading [Service Bus authentication with Shared Access Signatures](service-bus-sas.md) for more details about SAS.

For corresponding information about Azure Relay authentication and authorization, see [Azure Relay authentication and authorization](../service-bus-relay/relay-authentication-and-authorization.md). 

