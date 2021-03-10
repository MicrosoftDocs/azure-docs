---
title: Authorize access with Azure Active Directory
description: This article provides information on authorizing access to Azure SignalR Service resources using Azure Active Directory. 
author: terencefan

ms.author: tefa
ms.date: 08/03/2020
ms.service: signalr
ms.topic: conceptual
---

# Authorize access to Azure SignalR Service resources using Azure Active Directory
Azure SignalR Service supports using Azure Active Directory (Azure AD) to authorize requests to Azure SignalR Service resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal. To learn more about roles and role assignments, see [Understanding the different roles](../role-based-access-control/overview.md).

## Overview
When a security principal (an application) attempts to access a Azure SignalR Service resource, the request must be authorized. With Azure AD, access to a resource is a two-step process. 

 1. First, the security principal’s identity is authenticated, and an OAuth 2.0 token is returned. The resource name to request a token is `https://signalr.azure.com/`.
 2. Next, the token is passed as part of a request to the Azure SignalR Service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime. If your hub server is running within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Function app, it can use a managed identity to access the resources. To learn how to authenticate requests made by a managed identity to Azure SignalR Service, see [Authenticate access to Azure SignalR Service resources with Azure Active Directory and managed identities for Azure Resources](authenticate-managed-identity.md). 

The authorization step requires that one or more RBAC roles be assigned to the security principal. Azure SignalR Service provides RBAC roles that encompass sets of permissions for Azure SignalR resources. The roles that are assigned to a security principal determine the permissions that the principal will have. For more information about RBAC roles, see [Azure built-in roles for Azure SignalR Service](#azure-built-in-roles-for-azure-signalr-service). 

SignalR Hub Server that isn't running within an Azure entity can also authorize with Azure AD. To learn how to request an access token and use it to authorize requests for Azure SignalR Service resources, see [Authenticate access to Azure SignalR Service with Azure AD from an application](authenticate-application.md). 

## Azure Built-in roles for Azure SignalR Service

- [SignalR App Server]
- [SignalR Service Reader]
- [SignalR Service Owner]

## Assign RBAC roles for access rights
Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../role-based-access-control/overview.md). Azure SignalR Service defines a set of Azure built-in roles that encompass common sets of permissions used to access Azure SignalR Service and you can also define custom roles for accessing the resource.

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, or any Azure SignalR Service resource. An Azure AD security principal may be a user, or an application, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Built-in roles for Azure SignalR Service
Azure provides the following Azure built-in roles for authorizing access to Azure SignalR Service resource using Azure AD and OAuth:

### SignalR App Server

Use this role to give the access to Get a temporary access key for signing client tokens.

### SignalR Serverless Contributor

Use this role to give the access to Get a client token from Azure SignalR Service directly.

## Next steps

See the following related articles:

- [Authenticate an application with Azure AD to to access Azure SignalR Service](authenticate-application.md)
- [Authenticate a managed identity with Azure AD to access Azure SignalR Service](authenticate-managed-identity.md)