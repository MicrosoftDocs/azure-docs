---
title: Authorize access to Azure App Configuration using Azure Active Directory
description: Enable Azure RBAC to authorize access to your Azure App Configuration instance
author: maud-lv
ms.author: malev
ms.date: 05/26/2020
ms.topic: conceptual
ms.service: azure-app-configuration

---
# Authorize access to Azure App Configuration using Azure Active Directory
Besides using Hash-based Message Authentication Code (HMAC), Azure App Configuration supports using Azure Active Directory (Azure AD) to authorize requests to App Configuration instances.  Azure AD allows you to use Azure role-based access control (Azure RBAC) to grant permissions to a security principal.  A security principal may be a user, a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) or an [application service principal](../active-directory/develop/app-objects-and-service-principals.md).  To learn more about roles and role assignments, see [Understanding different roles](../role-based-access-control/overview.md).

## Overview
Requests made by a security principal to access an App Configuration resource must be authorized. With Azure AD, access to a resource is a two-step process:
1. The security principal's identity is authenticated and an OAuth 2.0 token is returned.  The resource name to request a token is `https://login.microsoftonline.com/{tenantID}` where `{tenantID}` matches the Azure Active Directory tenant ID to which the service principal belongs.
2. The token is passed as part of a request to the App Configuration service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime.  If an application is running within an Azure entity, such as an Azure Functions app, an Azure Web App, or an Azure VM, it can use a managed identity to access the resources.  To learn how to authenticate requests made by a managed identity to Azure App Configuration, see [Authenticate access to Azure App Configuration resources with Azure Active Directory and managed identities for Azure Resources](howto-integrate-azure-managed-service-identity.md).

The authorization step requires that one or more Azure roles be assigned to the security principal. Azure App Configuration provides Azure roles that encompass sets of permissions for App Configuration resources. The roles that are assigned to a security principal determine the permissions provided to the principal. For more information about Azure roles, see [Azure built-in roles for Azure App Configuration](#azure-built-in-roles-for-azure-app-configuration). 

## Assign Azure roles for access rights
Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access is scoped to the App Configuration resource. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Azure built-in roles for Azure App Configuration
Azure provides the following Azure built-in roles for authorizing access to App Configuration data using Azure AD:

- **App Configuration Data Owner**: Use this role to give read/write/delete access to App Configuration data. This does not grant access to the App Configuration resource.
- **App Configuration Data Reader**: Use this role to give read access to App Configuration data. This does not grant access to the App Configuration resource.
- **Contributor** or **Owner**: Use this role to manage the App Configuration resource. It grants access to the resource's access keys. While the App Configuration data can be accessed using access keys, this role does not grant direct access to the data using Azure AD. This role is required if you access the App Configuration data via ARM template, Bicep, or Terraform during deployment. For more information, see [authorization](quickstart-resource-manager.md#authorization).
- **Reader**: Use this role to give read access to the App Configuration resource. This does not grant access to the resource's access keys, nor to the data stored in App Configuration.

> [!NOTE]
> After a role assignment is made for an identity, allow up to 15 minutes for the permission to propagate before accessing data stored in App Configuration using this identity.

## Next steps
Learn more about using [managed identities](howto-integrate-azure-managed-service-identity.md) to administer your App Configuration service.
