---
title: Authorize access with Azure Active Directory for Azure SignalR Service
description: This article provides information on authorizing access to Azure SignalR Service resources using Azure Active Directory. 
author: terencefan

ms.author: tefa
ms.date: 09/06/2021
ms.service: signalr
ms.topic: conceptual
---

# Authorize access with Azure Active Directory for Azure SignalR Service

Azure SignalR Service supports using Azure Active Directory (Azure AD) to authorize requests to SignalR resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal<sup>[<a href="#security-principal">1</a>]</sup>. The security principal will be authenticated by Azure AD, who will return an OAuth 2.0 token. The token can then be used to authorize a request against the SignalR resource.

Authorizing requests against SignalR with Azure AD provides superior security and ease of use over Access Key authorization. Microsoft recommends using Azure AD authorization with your SignalR resources when possible to assure access with minimum required privileges.

<a id="security-principal"></a>
*[1] security principal: a user/resource group, an application, or a service principal such as system-assigned identities and user-assigned identities.*

## Overview of Azure AD for SignalR

When a security principal attempts to access a SignalR resource, the request must be authorized. With Azure AD, access to a resource requires 2 steps. 

1. First, the security principal has to be authenticated by Azure, who will return an OAuth 2.0 token. 
2. Next, the token is passed as part of request to the SignalR resource and used by the service to authorize access to the specified resource.

### Client-side authentication while using Azure AD

When using Access Key, the key is shared between your app server (or Function App) and the SignalR resource, results in the SignalR service could authenticate the client connection request with the shared key. However, there is no shared key when using Azure AD to authorize. 

To solve this problem, we introduced a **temporary access key** that can be used to sign tokens for client connections. The workflow contains four steps.

1. First, the security principal requires an OAuth 2.0 token from Azure to authenticate itself.
2. Second, the security principal calls SignalR Auth API to get a **temporary access key**.
3. Next, the security principal signs a client token with the **temporary access key** for client connections during negotiation.
4. Finally, the client uses the client token to connect to Azure SignalR resources.

The **temporary access key** will expire in 90 minutes, which means it's recommend getting a new one and rotate the old one once an hour. 

The workflow is built in our [Server SDK](https://github.com/Azure/azure-signalr).

## Assign Azure roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control](../role-based-access-control/overview.md). Azure SignalR defines a set of Azure built-in roles that encompass common sets of permissions used to access SignalR resources. You can also define custom roles for access to SignalR resources.

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

## Azure built-in roles for SignalR resources

- [SignalR App Server](../role-based-access-control/built-in-roles.md#signalr-app-server)

	Access to Websocket connection creation API and Auth APIs.
	
	This is the most common used role for an App Server.

- [SignalR Service Owner](../role-based-access-control/built-in-roles.md#signalr-service-owner)

	Full access to all data-plane APIs, including all REST APIs, WebSocket connection creation API and Auth APIs.

	**Serverless mode** should use this role to support Authorization with Azure AD since it requires both REST APIs permissions and Auth API permissions.

- [SignalR REST API Owner](../role-based-access-control/built-in-roles.md#signalr-rest-api-owner)

	Full access to data-plane REST APIs.

	It is usually used when you'd like to write a management tool that manages connections and groups but does **NOT** make connections or call Auth APIs.

- [SignalR REST API Reader](../role-based-access-control/built-in-roles.md#signalr-rest-api-reader)

	Read-only access to data-plane REST APIs.

	It is usually used when you'd like to write a monitoring tool that calls **ONLY** SignalR data-plane **READONLY** REST APIs.

## Next steps

To learn how to create an Azure application and use Azure AD Auth, see
- [Authorize request to SignalR resources with Azure AD from Azure applications](signalr-howto-authorize-application.md)

To learn how to configure a managed identity and use Azure AD Auth, see
- [Authorize request to SignalR resources with Azure AD from managed identities](signalr-howto-authorize-managed-identity.md)

To learn more about roles and role assignments, see 
- [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md).

To learn how to create custom roles, see 
- [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)