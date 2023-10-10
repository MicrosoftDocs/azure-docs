---
title: Authorize access with Microsoft Entra ID for Azure SignalR Service
description: This article provides information on authorizing access to Azure SignalR Service resources using Microsoft Entra ID.
author: vicancy
ms.author: lianwei
ms.date: 09/06/2021
ms.service: signalr
ms.topic: conceptual
---

# Authorize access with Microsoft Entra ID for Azure SignalR Service

Azure SignalR Service supports Microsoft Entra ID for authorizing requests to SignalR resources. With Microsoft Entra ID, you can utilize role-based access control (RBAC) to grant permissions to a security principal<sup>[<a href="#security-principal">1</a>]</sup>. The security principal is authenticated by Microsoft Entra ID, which returns an OAuth 2.0 token. The token is then used to authorize a request against the SignalR resource.

Authorizing requests against SignalR with Microsoft Entra ID provides superior security and ease of use compared to Access Key authorization. It is highly recommended to use Microsoft Entra ID for authorizing whenever possible, as it ensures access with the minimum required privileges.

<a id="security-principal"></a>
_[1] security principal: a user/resource group, an application, or a service principal such as system-assigned identities and user-assigned identities._

> [!IMPORTANT]
> Disabling local authentication can have following influences.
>
> - The current set of access keys will be permanently deleted.
> - Tokens signed with access keys will no longer be available.

## Overview of Microsoft Entra ID

When a security principal attempts to access a SignalR resource, the request must be authorized. Get access to a resource requires 2 steps when using Microsoft Entra ID.

1. The security principal has to be authenticated by Microsoft Entra ID, which will then return an OAuth 2.0 token.
1. The token is passed as part of a request to the SignalR resource for authorizing the request.

### Client-side authentication with Microsoft Entra ID

When using Access Key, the key is shared between your app server (or Function App) and the SignalR resource. The SignalR service authenticates the client connection request with the shared key.

When using Microsoft Entra ID, there is no shared key. Instead, SignalR uses a **temporary access key** for signing tokens used in client connections. The workflow contains four steps.

1. The security principal requires an OAuth 2.0 token from Microsoft Entra ID to authenticate itself.
2. The security principal calls SignalR Auth API to get a **temporary access key**.
3. The security principal signs a client token with the **temporary access key** for client connections during negotiation.
4. The client uses the client token to connect to Azure SignalR resources.

The **temporary access key** expires in 90 minutes. It's recommend getting a new one and rotate the old one once an hour.

The workflow is built in the [Azure SignalR SDK for app server](https://github.com/Azure/azure-signalr).

## Assign Azure roles for access rights

Microsoft Entra authorizes access rights to secured resources through [Azure role-based access control](../role-based-access-control/overview.md). Azure SignalR defines a set of Azure built-in roles that encompass common sets of permissions used to access SignalR resources. You can also define custom roles for access to SignalR resources.

### Resource scope

You may have to determine the scope of access that the security principal should have before you assign any Azure RBAC role to a security principal. It is recommended to only grant the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

You can scope access to Azure SignalR resources at the following levels, beginning with the narrowest scope:

| Scope                       | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **An individual resource.** | Applies to only the target resource.                                                 |
| **A resource group.**       | Applies to all of the resources in a resource group.                                 |
| **A subscription.**         | Applies to all of the resources in a subscription.                                   |
| **A management group.**     | Applies to all of the resources in the subscriptions included in a management group. |

## Azure built-in roles for SignalR resources

| Role                                                                                              | Description                                                                                               | Use case                                                                                                                                     |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [SignalR App Server](../role-based-access-control/built-in-roles.md#signalr-app-server)           | Access to Websocket connection creation API and Auth APIs.                                                | Most commonly for an App Server.                                                                                                             |
| [SignalR Service Owner](../role-based-access-control/built-in-roles.md#signalr-service-owner)     | Full access to all data-plane APIs, including REST APIs, WebSocket connection creation API and Auth APIs. | Use for **Serverless mode** for Authorization with Microsoft Entra ID since it requires both REST APIs permissions and Auth API permissions. |
| [SignalR REST API Owner](../role-based-access-control/built-in-roles.md#signalr-rest-api-owner)   | Full access to data-plane REST APIs.                                                                      | Often used to write a tool that manages connections and groups but does **NOT** make connections or call Auth APIs.                          |
| [SignalR REST API Reader](../role-based-access-control/built-in-roles.md#signalr-rest-api-reader) | Read-only access to data-plane REST APIs.                                                                 | Commonly used to write a monitoring tool that calls **ONLY** SignalR data-plane **READONLY** REST APIs.                                      |

## Next steps

To learn how to create an Azure application and use Microsoft Entra authorization, see:

- [Authorize request to SignalR resources with Microsoft Entra applications](signalr-howto-authorize-application.md)

To learn how to configure a managed identity and use Microsoft Entra authorization, see:

- [Authorize request to SignalR resources with Microsoft Entra managed identities](signalr-howto-authorize-managed-identity.md)

To learn more about roles and role assignments, see:

- [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md).

To learn how to create custom roles, see:

- [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role)

To learn how to use only Microsoft Entra authentication, see:

- [Disable local authentication](./howto-disable-local-auth.md)
