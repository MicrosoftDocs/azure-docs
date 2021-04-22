---
title: Azure Service Bus authentication and authorization | Microsoft Docs
description: Authenticate apps to Service Bus with Shared Access Signature (SAS) authentication.
ms.topic: article
ms.date: 06/23/2020
---

# Service Bus authentication and authorization
There are two ways to authenticate and authorize access to Azure Service Bus resources: Azure Activity Directory (Azure AD) and Shared Access Signatures (SAS). This article gives you details on using these two types of security mechanisms. 

## Azure Active Directory
Azure AD integration for Service Bus resources provides Azure role-based access control (RBAC) for fine-grained control over a client’s access to resources. You can use Azure RBAC to grant permissions to a security principal, which may be a user, a group, or an application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can be used to authorize a request to access a Service Bus resource (queue, topic, and so on).

For more information about authenticating with Azure AD, see the following articles:

- [Authenticate with managed identities](service-bus-managed-service-identity.md)
- [Authenticate from an application](authenticate-application.md)

> [!NOTE]
> [Service Bus REST API](/rest/api/servicebus/) supports OAuth authentication with Azure AD.

> [!IMPORTANT]
> Authorizing users or applications using OAuth 2.0 token returned by Azure AD provides superior security and ease of use over shared access signatures (SAS). With Azure AD, there is no need to store the tokens in your code and risk potential security vulnerabilities. We recommend that you use Azure AD with your Azure Service Bus applications when possible. 

## Shared access signature
[SAS authentication](service-bus-sas.md) enables you to grant a user access to Service Bus resources, with specific rights. SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients can then gain access to that resource by presenting a SAS token, which consists of the resource URI being accessed and an expiry signed with the configured key.

You can configure keys for SAS on a Service Bus namespace. The key applies to all messaging entities within that namespace. You can also configure keys on Service Bus queues and topics. SAS is also supported on [Azure Relay](../azure-relay/relay-authentication-and-authorization.md).

To use SAS, you can configure a shared access authorization rule on a namespace, queue, or topic. This rule consists of the following elements:

* *KeyName*: identifies the rule.
* *PrimaryKey*: a cryptographic key used to sign/validate SAS tokens.
* *SecondaryKey*: a cryptographic key used to sign/validate SAS tokens.
* *Rights*: represents the collection of **Listen**, **Send**, or **Manage** rights granted.

Authorization rules configured at the namespace level can grant access to all entities in a namespace for clients with tokens signed using the corresponding key. You can configure up to 12 such authorization rules on a Service Bus namespace, queue, or topic. By default, a  shared access authorization rule with all rights is configured for every namespace when it's first provisioned.

To access an entity, the client requires a SAS token generated using a specific shared access authorization rule. The SAS token is generated using the HMAC-SHA256 of a resource string that consists of the resource URI to which access is claimed, and an expiry with a cryptographic key associated with the authorization rule.

SAS authentication support for Service Bus is included in the Azure .NET SDK versions 2.0 and later. SAS includes support for a shared access authorization rule. All APIs that accept a connection string as a parameter include support for SAS connection strings.

> [!IMPORTANT]
> If you are using Azure Active Directory Access Control (also known as Access Control Service or ACS) with Service Bus, note that the support for this method is now limited and you should [migrate your application to use SAS](service-bus-migrate-acs-sas.md) or use OAuth 2.0 authentication with Azure AD (recommended).For more information about deprecation of ACS, see [this blog post](/archive/blogs/servicebus/upcoming-changes-to-acs-enabled-namespaces).

## Next steps
For more information about authenticating with Azure AD, see the following articles:

- [Authentication with managed identities](service-bus-managed-service-identity.md)
- [Authentication from an application](authenticate-application.md)

For more information about authenticating with SAS, see the following articles:

- [Authentication with SAS](service-bus-sas.md)
