---
title: Authorize access with Microsoft Entra ID for Azure SignalR Service
description: This article provides information on authorizing access to Azure SignalR Service resources by using Microsoft Entra ID.
author: vicancy
ms.author: lianwei
ms.date: 09/06/2021
ms.service: signalr
ms.topic: conceptual
---

# Authorize access with Microsoft Entra ID for Azure SignalR Service

Azure SignalR Service supports Microsoft Entra ID for authorizing requests to its resources. With Microsoft Entra ID, you can use role-based access control (RBAC) to grant permissions to a *security principal*. A security principal is a user/resource group, an application, or a service principal such as system-assigned identities and user-assigned identities.

Microsoft Entra ID authenticates the security principal and returns an OAuth 2.0 token. The token is then used to authorize a request against the Azure SignalR Service resource.

Authorizing requests against Azure SignalR Service by using Microsoft Entra ID provides superior security and ease of use compared to access key authorization. We highly recommend that you use Microsoft Entra ID for authorizing whenever possible, because it ensures access with the minimum required privileges.

> [!IMPORTANT]
> Disabling local authentication can have the following consequences:
>
> - The current set of access keys is permanently deleted.
> - Tokens signed with the current set of access keys become unavailable.

## Overview of Microsoft Entra ID

When a security principal tries to access an Azure SignalR Service resource, the request must be authorized. Using Microsoft Entra ID to get access to a resource requires two steps:

1. Microsoft Entra ID authenticates the security principal and then returns an OAuth 2.0 token.
1. The token is passed as part of a request to the Azure SignalR Service resource for authorizing the request.

### Client-side authentication with Microsoft Entra ID

When you use an access key, the key is shared between your app server (or function app) and the Azure SignalR Service resource. Azure SignalR Service authenticates the client connection request by using the shared key.

When you use Microsoft Entra ID, there is no shared key. Instead, Azure SignalR Service uses a *temporary access key* for signing tokens used in client connections. The workflow contains four steps:

1. The security principal requires an OAuth 2.0 token from Microsoft Entra ID to authenticate itself.
2. The security principal calls the SignalR authentication API to get a temporary access key.
3. The security principal signs a client token with the temporary access key for client connections during negotiation.
4. The client uses the client token to connect to Azure SignalR Service resources.

The temporary access key expires in 90 minutes. We recommend that you get a new one and rotate out the old one once an hour.

The workflow is built in the [Azure SignalR Service SDK for app servers](https://github.com/Azure/azure-signalr).

## Assign Azure roles for access rights

Microsoft Entra ID authorizes access rights to secured resources through [Azure RBAC](../role-based-access-control/overview.md). Azure SignalR Service defines a set of Azure built-in roles that encompass common sets of permissions for accessing Azure SignalR Service resources. You can also define custom roles for access to Azure SignalR Service resources.

### Resource scope

You might have to determine the scope of access that the security principal should have before you assign any Azure RBAC role to a security principal. We recommend that you grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

You can scope access to Azure SignalR Service resources at the following levels, beginning with the narrowest scope.

| Scope                       | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Individual resource | Applies to only the target resource.                                                 |
| Resource group       | Applies to all of the resources in a resource group.                                 |
| Subscription         | Applies to all of the resources in a subscription.                                   |
| Management group     | Applies to all of the resources in the subscriptions included in a management group. |

## Azure built-in roles for Azure SignalR Service resources

| Role                                                                                              | Description                                                                                               | Use case                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [SignalR App Server](../role-based-access-control/built-in-roles.md#signalr-app-server)           | Access to the WebSocket connection creation API and authentication APIs.                                                | Most commonly used for an app server.                                                                                                             |
| [SignalR Service Owner](../role-based-access-control/built-in-roles.md#signalr-service-owner)     | Full access to all data-plane APIs, including REST APIs, the WebSocket connection creation API, and authentication APIs. | Use for *serverless mode* for authorization with Microsoft Entra ID, because it requires both REST API permissions and authentication API permissions. |
| [SignalR REST API Owner](../role-based-access-control/built-in-roles.md#signalr-rest-api-owner)   | Full access to data-plane REST APIs.                                                                      | Often used to write a tool that manages connections and groups, but does *not* make connections or call authentication APIs.                          |
| [SignalR REST API Reader](../role-based-access-control/built-in-roles.md#signalr-rest-api-reader) | Read-only access to data-plane REST APIs.                                                                 | Commonly used to write a monitoring tool that calls *only* Azure SignalR Service data-plane read-only REST APIs.                                      |

## Next steps

- To learn how to create an Azure application and use Microsoft Entra authorization, see [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](signalr-howto-authorize-application.md).

- To learn how to configure a managed identity and use Microsoft Entra authorization, see [Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities](signalr-howto-authorize-managed-identity.md).

- To learn more about roles and role assignments, see [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md).

- To learn how to create custom roles, see [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

- To learn how to use only Microsoft Entra authentication, see [Disable local authentication](./howto-disable-local-auth.md).
