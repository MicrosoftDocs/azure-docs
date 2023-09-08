---
title: Azure Relay authentication and authorization | Microsoft Docs
description: This article provides an overview of Shared Access Signature (SAS) authentication with the Azure Relay service.
ms.topic: article
ms.date: 08/10/2023
---

# Azure Relay authentication and authorization
There are two ways to authenticate and authorize access to Azure Relay resources: Azure Active Directory (Azure AD) and Shared Access Signatures (SAS). This article gives you details on using these two types of security mechanisms.

## Azure Active Directory 
Azure AD integration for Azure Relay resources provides Azure role-based access control (Azure RBAC) for fine-grained control over a client’s access to resources. You can use Azure RBAC to grant permissions to a security principal, which may be a user, a group, or an application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can be used to authorize a request to access an Azure Relay resource.

For more information about authenticating with Azure AD, see the following articles:
- [Authenticate with managed identities](authenticate-managed-identity.md)
- [Authenticate from an Azure Active Directory application](authenticate-application.md)

> [!IMPORTANT]
> Authorizing users or applications using OAuth 2.0 token returned by Azure AD provides superior security and ease of use over shared access signatures (SAS). With Azure AD, there is no need to store tokens in your code and risk potential security vulnerabilities. We recommend that you use Azure AD with your Azure Relay applications when possible.

### Built-in roles
For Azure Relay, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the Azure RBAC model. Azure provides the below Azure built-in roles for authorizing access to a Relay namespace:

| Role | Description | 
| ---- | ----------- | 
| [Azure Relay Owner](../role-based-access-control/built-in-roles.md#azure-relay-owner) | Use this role to grant **full** access to Azure Relay resources. |
| [Azure Relay Listener](../role-based-access-control/built-in-roles.md#azure-relay-listener) | Use this role to grant **listen and entity read** access to Azure Relay resources. |
| [Azure Relay Sender](../role-based-access-control/built-in-roles.md#azure-relay-sender) | Use this role to grant **send and entity read** access to Azure Relay resources. | 


## Shared Access Signature
Applications can authenticate to Azure Relay using Shared Access Signature (SAS) authentication. SAS authentication enables applications to authenticate to the Azure Relay service using an access key configured on the Relay namespace. You can then use this key to generate a Shared Access Signature token that clients can use to authenticate to the relay service.

[SAS authentication](../service-bus-messaging/service-bus-sas.md) enables you to grant a user access to Azure Relay resources with specific rights. SAS authentication involves the configuration of a cryptographic key with associated rights on a resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure keys for SAS on a Relay namespace. Unlike Service Bus messaging, [Relay Hybrid Connections](relay-hybrid-connections-protocol.md) supports unauthorized or anonymous senders. You can enable anonymous access for the entity when you create it, as shown in the following screenshot from the portal:

![A dialog box titled "Create Hybrid Connection" has a "Name" text box and a check box labeled "Requires Client Authentication", which is checked.][0]

To use SAS, you can configure a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object on a Relay namespace that consists of the following properties:

* *KeyName* that identifies the rule.
* *PrimaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *SecondaryKey* is a cryptographic key used to sign/validate SAS tokens.
* *Rights* representing the collection of Listen, Send, or Manage rights granted.

Authorization rules configured at the namespace level can grant access to all relay connections in a namespace for clients with tokens signed using the corresponding key. Up to 12 such authorization rules can be configured on a Relay namespace. By default, a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) with all rights is configured for every namespace when it's first provisioned.

To access an entity, the client requires a SAS token generated using a specific [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

SAS authentication support for Azure Relay is included in the Azure .NET SDK versions 2.0 and later. SAS includes support for a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule). All APIs that accept a connection string as a parameter include support for SAS connection strings.

## Samples

- Hybrid Connections: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol), [Java](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/java/role-based-access-control), [JavaScript](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/node/rolebasedaccesscontrol)
- WCF Relay: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay/RoleBasedAccessControl)

## Next steps

- Continue reading [Service Bus authentication with Shared Access Signatures](../service-bus-messaging/service-bus-sas.md) for more details about SAS.
- See the [Azure Relay Hybrid Connections protocol guide](relay-hybrid-connections-protocol.md) for detailed information about the Hybrid Connections capability.
- For corresponding information about Service Bus Messaging authentication and authorization, see [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md). 

[0]: ./media/relay-authentication-and-authorization/hcanon.png
