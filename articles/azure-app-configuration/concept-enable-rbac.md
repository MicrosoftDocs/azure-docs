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
Azure App Configuration supports using Azure Active Directory (Azure AD) to authorize requests to App Configuration instances.  Azure AD allows you to use role-based access control (RBAC) to grant permissions to a security principal.  A security principal may be a user, or an [application service principal](../active-directory/develop/app-objects-and-service-principals.md).  To learn more about roles and role assignments, see [Understanding different roles](../role-based-access-control/overview.md).

## Overview
Requests made by security principal (a user, or an application) to access an App Configuration resource must be authorized.  With Azure AD, access to a resource is a two-step process.
1. The security principal's identity is authenticated and an OAuth 2.0 token is returned.  The resource name to request a token is `https://login.microsoftonline.com/{tenantID}` where `{tenantID}` matches the Azure Active Directory tenant ID to which the service principal belongs.
2. The token is passed as part of a request to the App Configuration service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime.  If an application is running within an Azure entity, such as an Azure Functions app, an Azure Web App, or an Azure VM, it can use a managed identity to access the resources.  To learn how to authenticate requests made by a managed identity to Azure App Configuration, see [Authenticate access to Azure App Configuration resources with Azure Active Directory and managed identities for Azure Resources](howto-integrate-azure-managed-service-identity.md).

The authorization step requires that one or more RBAC roles be assigned to the security principal. Azure App Configuration provides RBAC roles that encompass sets of permissions for App Configuration resources. The roles that are assigned to a security principal determine the permissions provided to the principal. For more information about RBAC roles, see [Built-in RBAC roles for Azure App Configuration](#built-in-rbac-roles-for-azure-app-configuration). 

## Assign RBAC roles for access rights
Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../role-based-access-control/overview.md).

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access is scoped to the App Configuration resource. An Azure AD security principal may be a user, or an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Built-in RBAC roles for Azure App Configuration
Azure provides the following built-in RBAC roles for authorizing access to App Configuration data using Azure AD and OAuth:

- Azure App Configuration Data Owner: Use this role to give read/write access to App Configuration resources.
- Azure App Configuration Data Reader: Use this role to give read access to App Configuration resources.
- Contributor: Use this role to give admin access to the service without granting access to the data stored in the App Configuration instance.

## Next steps
Learn more about using [managed identities](howto-integrate-azure-managed-service-identity.md) to administer your App Configuration service.