---
title: Azure Service Bus authentication and authorization
description: Learn how to securely authenticate and authorize access to Azure Service Bus, including best practices for managing access keys and using Microsoft Entra ID.
ms.topic: article
ms.date: 02/23/2024
---

# Service Bus authentication and authorization
There are two ways to authenticate and authorize access to Azure Service Bus resources: 

- Microsoft Entra ID
- Shared Access Signatures (SAS). 

This article gives you details on using these two types of security mechanisms. 

<a name='azure-active-directory'></a>

## Microsoft Entra ID
Microsoft Entra integration with Service Bus provides role-based access control (RBAC) to Service Bus resources. You can use Azure RBAC to grant permissions to a security principal, which can be a user, a group, an application service principal, or a managed identity. Microsoft Entra authenticates the security principal and returns an OAuth 2.0 token. This token can be used to authorize a request to access a Service Bus resource (queue, topic, and subscription).

For more information about authenticating with Microsoft Entra ID, see the following articles:

- [Authenticate with managed identities](service-bus-managed-service-identity.md)
- [Authenticate from an application](authenticate-application.md)

> [!NOTE]
> [Service Bus REST API](/rest/api/servicebus/) supports OAuth authentication with Microsoft Entra ID.

> [!IMPORTANT]
> Authorizing users or applications using OAuth 2.0 token returned by Microsoft Entra ID provides superior security and ease of use over shared access signatures (SAS). With Microsoft Entra ID, there is no need to store tokens in your code and risk potential security vulnerabilities. We recommend that you use Microsoft Entra ID with your Azure Service Bus applications when possible. 
> 
> You can disable local or SAS key authentication for a Service Bus namespace and allow only Microsoft Entra authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).

## Shared access signature
[SAS authentication](service-bus-sas.md) enables you to grant a user access to Service Bus resources, with specific rights. SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure shared access policies on a Service Bus namespace. The key applies to all messaging entities within that namespace. You can also configure shared access policies on Service Bus queues and topics. To use SAS, you can configure a shared access authorization rule on a namespace, queue, or topic. This rule consists of the following elements:

* **KeyName**: identifies the rule.
* **PrimaryKey**: a cryptographic key used to sign/validate SAS tokens.
* **SecondaryKey**: a cryptographic key used to sign/validate SAS tokens.
* **Rights**: represents the collection of **Listen**, **Send**, or **Manage** rights granted.

Authorization rules configured at the namespace level can grant access to all entities in a namespace for clients with tokens signed using the corresponding key. You can configure up to 12 such authorization rules on a Service Bus namespace, queue, or topic. By default, a shared access authorization rule with all rights is configured for every namespace when it's first provisioned.

To access an entity, the client requires a SAS token generated using a specific shared access authorization rule. The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

For detailed information on using SAS for authentication, see [Authentication with Shared Access Signatures](service-bus-sas.md).


## Related content
For more information about authenticating with Microsoft Entra ID, see the following articles:

- [Authentication with managed identities](service-bus-managed-service-identity.md)
- [Authentication from an application](authenticate-application.md)

For more information about authenticating with SAS, see the following articles:

- [Authentication with SAS](service-bus-sas.md)
