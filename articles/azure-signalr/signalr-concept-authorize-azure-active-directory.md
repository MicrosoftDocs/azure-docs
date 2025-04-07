---
title: Authorize access with Microsoft Entra ID for Azure SignalR Service
description: This article explains how to authorize requests to Azure SignalR Service resources using Microsoft Entra ID. 
author: terencefan
ms.author: tefa
ms.date: 03/12/2025
ms.service: azure-signalr-service
ms.topic: conceptual
---

# Microsoft Entra ID for Azure SignalR Service

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

When you use Microsoft Entra ID, there's no shared key. Instead, Azure SignalR Service uses a *temporary access key* for signing tokens used in client connections. The workflow contains four steps:

1. The security principal requires an OAuth 2.0 token from Microsoft Entra ID to authenticate itself.
2. The security principal calls the SignalR authentication API to get a temporary access key.
3. The security principal signs a client token with the temporary access key for client connections during negotiation.
4. The client uses the client token to connect to Azure SignalR Service resources.

The temporary access key expires in 90 minutes. We recommend that you get a new one and rotate out the old one once an hour.

The workflow is built in the [Azure SignalR Service SDK for app servers](https://github.com/Azure/azure-signalr).

### Cross tenant access when using Microsoft Entra ID

In some cases, your server and your Azure SignalR resource may not be in the same tenant due to security concerns.

A [multitenant applications](/entra/identity-platform/single-and-multi-tenant-apps#best-practices-for-multitenant-apps) could help you in this scenario.

If you've already registered a single-tenant app, see [convert your single-tenant app to multitenant](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

Once you have registered the multitenant application in your `tenantA`, you should provision it as an enterprise application in your `tenantB`.

[Create an enterprise application from a multitenant application in Microsoft Entra ID](/entra/identity/enterprise-apps/create-service-principal-cross-tenant?pivots=msgraph-powershell)

The application registered in your `tenantA` and the enterprise application provisioned in your `tenantB` share the same Application (client) ID.

## Assign Azure roles for access rights

Microsoft Entra ID authorizes access rights to secured resources through [Azure RBAC](../role-based-access-control/overview.md). Azure SignalR Service defines a set of Azure built-in roles that encompass common sets of permissions for accessing Azure SignalR Service resources. You can also define custom roles for access to Azure SignalR Service resources.

### Resource scope

Before assigning Azure RBAC roles to a security principal, it’s essential to define the appropriate scope of access they should have. We advise granting the most limited scope necessary to minimize unnecessary permissions. Keep in mind that Azure RBAC roles assigned at a higher or broader scope are automatically inherited by the resources nested within that scope.

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
| [SignalR App Server](../role-based-access-control/built-in-roles.md#signalr-app-server)           | Access to the server connection creation and key generation APIs.                                                | Most commonly used for app server with Azure SignalR resource run in **Default** mode.                                                                                                             |
| [SignalR Service Owner](../role-based-access-control/built-in-roles.md#signalr-service-owner)     | Full access to all data-plane APIs, including REST APIs, the server connection creation, and key/token generation APIs. | For negotiation server with Azure SignalR resource run in **Serverless** mode, as it requires both REST API permissions and authentication API permissions. |
| [SignalR REST API Owner](../role-based-access-control/built-in-roles.md#signalr-rest-api-owner)   | Full access to data-plane REST APIs.                                                                      | For using [Azure SignalR Management SDK](./signalr-howto-use-management-sdk.md) to manage connections and groups, but does **NOT** make server connections or handle negotiation requests.                          |
| [SignalR REST API Reader](../role-based-access-control/built-in-roles.md#signalr-rest-api-reader) | Read-only access to data-plane REST APIs.                                                                 | Use it when write a monitoring tool that calls readonly REST APIs.

## Next steps

- To learn how to configure Microsoft Entra authorization, see:

  - [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](./signalr-howto-authorize-application.md).
  - [Authorize requests to Azure SignalR Service resources with Managed identities for Azure resources](./signalr-howto-authorize-managed-identity.md).

- To learn more about roles-based access control and role, see:

  - [What is Azure role-based access control (Azure RBAC)?](../role-based-access-control/overview.md).
  - [Steps to create a custom role](../role-based-access-control/custom-roles.md#steps-to-create-a-custom-role).

- To learn how to configure cross tenant authorization with Microsoft Entra, see:

  - [How to configure cross tenant authorization with Microsoft Entra](signalr-howto-authorize-cross-tenant.md)

- To learn how to disable connection string and use only Microsoft Entra authentication, see:

  - [How to disable local authentication](./howto-disable-local-auth.md).
