---
title: Authorize access with Azure Active Directory for Azure Web PubSub
description: This article provides information on authorizing access to Azure Web PubSub Service resources using Azure Active Directory. 
author: terencefan

ms.author: tefa
ms.date: 11/08/2021
ms.service: azure-web-pubsub
ms.topic: conceptual
---

# Authorize access to Web PubSub resources using Azure Active Directory
Azure Web PubSub Service supports using Azure Active Directory (Azure AD) to authorize requests to Web PubSub resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal<sup>[<a href="#security-principal">1</a>]</sup>. The security principal will be authenticated by Azure AD, who will return an OAuth 2.0 token. The token can then be used to authorize a request against the Web PubSub resource.

Authorizing requests against Web PubSub with Azure AD provides superior security and ease of use over Access Key authorization. Microsoft recommends using Azure AD authorization with your Web PubSub resources when possible to assure access with minimum required privileges.

<a id="security-principal"></a>
*[1] security principal: a user/resource group, an application, or a service principal such as system-assigned identities and user-assigned identities.*

## Overview of Azure AD for Web PubSub

When a security principal attempts to access a Web PubSub resource, the request must be authorized. With Azure AD, access to a resource requires two steps. 

1. First, the security principal has to be authenticated by Azure, who will return an OAuth 2.0 token. 
2. Next, the token is passed as part of a request to the Web PubSub resource and used by the service to authorize access to the specified resource.

### Client-side authentication while using Azure AD

When using Access Key, the key is shared between your negotiation server (or Function App) and the Web PubSub resource, which means the Web PubSub service could authenticate the client connection request with the shared key. However, there is no access key when using Azure AD to authorize. 

To solve this problem, we provided a REST API for generating the client token that can be used to connect to the Azure Web PubSub service.

1. First, the negotiation server requires an **Aad Token** from Azure to authenticate itself.
1. Second, the negotiation server calls Web PubSub Auth API with the **Aad Token** to get a **Client Token** and returns it to client.
1. Finally, the client uses the **Client Token** to connect to the Azure Web PubSub service.

We provided helper functions (for example `GenerateClientAccessUri) for supported programming languages.

## Assign Azure roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control](../role-based-access-control/overview.md). Azure Web PubSub defines a set of Azure built-in roles that encompass common sets of permissions used to access Web PubSub resources. You can also define custom roles for access to Web PubSub resources.

### Resource scope

You may have to determine the scope of access that the security principal should have before you assign any Azure RBAC role to a security principal. It is recommended to only grant the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

You can scope access to Azure SignalR resources at the following levels, beginning with the narrowest scope:

- **An individual resource.** 

  At this scope, a role assignment applies to only the target resource.

- **A resource group.** 

  At this scope, a role assignment applies to all of the resources in the resource group.

- **A subscription.**

  At this scope, a role assignment applies to all of the resources in all of the resource groups in the subscription.

- **A management group.** 

  At this scope, a role assignment applies to all of the resources in all of the resource groups in all of the subscriptions in the management group.

## Azure built-in roles for Web PubSub resources.

- `Web PubSub Service Owner`

	Full access to data-plane permissions, including read/write REST APIs and Auth APIs.

	This is the most common used role for building a upstream server.

- `Web PubSub Service Reader`

	Use to grant read-only REST APIs permissions to Web PubSub resources.

	It is usually used when you'd like to write a monitoring tool that calling **ONLY** Web PubSub data-plane **READONLY** REST APIs.

## Next steps

To learn how to create an Azure application and use AAD Auth, see
- [Authorize request to Web PubSub resources with Azure AD from Azure applications](howto-authorize-from-application.md)

To learn how to configure a managed identity and use AAD Auth, see
- [Authorize request to Web PubSub resources with Azure AD from managed identities](howto-authorize-from-managed-identity.md)

To learn more about roles and role assignments, see 
- [What is Azure role-based access control](../role-based-access-control/overview.md).

To learn how to create custom roles, see 
- [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)