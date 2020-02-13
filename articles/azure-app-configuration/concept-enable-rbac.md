---
title: Authorize access to Azure App Configuration using Azure Active Directory
description: Enable RBAC to authorize access to your Azure App Configuration instance
author: lisaguthrie
ms.author: lcozzens
ms.date: 02/13/2020
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Authorize access to Azure App Configuration using Azure Active Directory
Azure App Configuration supports using Azure Active Directory (Azure AD) to authorize requests to App Configuration instances.  With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal.  To learn more about roles and role assignments, see [Understanding different roles](../role-based-access-control/overview.md).

## Overview
When a security principal (a user, or an application) attempts to access an App Configuration resource, the request must be authorized.  With Azure AD, access to a resource is a two-step process.
1. The security principal's identity is authenticated and an OAuth 2.0 token is returned.  The resource name to request a token is `https://login.microsoftonline.com/{tenantID}` where `{tenantID}` matches the Azure Active Directory tenant ID to which the service principal belongs.
1. The token is passed as part of a request to the App Configuration service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime.  If an application is running within an Azure entity, such as an Azure VM, a virtual machine scale set, or an Azure Functions app, it can use a managed identity to access the resources.  To learn how to authenticate requests made by a managed identity to Azure App Configuration, see [Authenticate access to Azure App Configuration resources with Azure Active Directory and managed identities for Azure Resources](concept-auth-managed-identity.md).

The authorization step requires that one or more RBAC roles be assigned to the security principal. Azure App Configuration provides RBAC roles that encompass sets of permissions for App Configuration resources. The roles that are assigned to a security principal determine the permissions that the principal will have. For more information about RBAC roles, see [Built-in RBAC roles for Azure App Configuration](#built-in-rbac-roles-for-azure-app-configuration). 

## Assign RBAC roles for access rights
Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../role-based-access-control/overview.md).

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access is scoped to the App Configuration resource. An Azure AD security principal may be a user, or an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Built-in RBAC roles for Azure App Configuration
Azure provides the following built-in RBAC roles for authorizing access to App Configuration data using Azure AD and OAuth:

- Azure App Configuration Data owner: Use this role to give read/write access to App Configuration resources.
- Azure App Configuration Data reader: Use this role to give read access to App Configuration resources.
- Azure App Configuration Contributor: Use this role to give admin access to the service without granting access to the data stored in the App Configuration instance.

## Next steps
Learn more about using [RBAC to secure access](concept-auth-managed-identity.md) to your App Configuration service.