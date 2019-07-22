---
title: Preview custom administrator roles grant scope to restrict identity access identity management - Azure Active Directory | Microsoft Docs
description: Preview custom administrator roles for delegating identity management. You can now manage the scope of an Azure AD administrator role in the Azure portal, Azure AD PowerShell, or Graph API.
services: active-directory
author: curtand
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/22/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Custom administrator roles in Azure Active Directory (preview)

This article describes how to understand the new custom roles in Azure Active Directory (Azure AD). Azure Active Directory (Azure AD) supports provides the ability to assign administrative privileges restricted to a customized Azure AD resource scope. Custom roles such as these are part of a preview release of the Azure AD role-based access control model. [Built-in roles](directory-assign-admin-roles.md) provide an adequate granularity for many situations, but when you want more fine-grained permissions, you can create custom roles to reduce the scope of control for the role to the level of a single Azure AD resource.

The preview release of Azure AD role-based access control exposes two scopes: an organization-wide scope (allowing the permitted actions for all Azure AD objects in the organization) and a custom scope, with permissions restricted to application registrations. In this custom role, you can edit app registration permissions. Over time, additional permissions for directory objects like enterprise applications, users, and devices will be added.

Preview features:

- Portal UI updates for creating and managing custom roles and assigning them to users at organization-wide scope
- A preview PowerShell module with new cmdlets to:
  - Create and manage custom roles
  - Assign custom roles with either a directory-wide or per-app registration scope
  - Assign built-in roles at directory-wide scope (parity with GA cmdlets)
  - Azure AD Graph API support

Azure AD role-based access control is a public preview feature of Azure Active Directory (Azure AD) and is available with any paid Azure AD license plan. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What is Azure AD role-based access control?

Azure AD role-based access control allows you to assign roles that are customized to allow permitted actions on only a single type of Azure AD resource. Azure AD role-based access operates on concepts similar to Azure role-based access control ([Azure RBAC](../../role-based-access-control/overview.md) for Azure resource access, but Azure AD role-based access control is based on Microsoft Graph and Azure RBAC is based on Azure Resource Manager. However, both systems base their functions on role assignments.

### Role assignments

The way you control access using Azure AD role-based access control is to create **role assignments**, which are used to enforce permissions. A role assignment consists of three elements:

- Security principal
- Role definition
- Resource scope

Access is granted by creating a role assignment, and access is revoked by removing a role assignment. You can [create role assignments](roles-create-custom.md) using the Azure portal, Azure AD PowerShell, and Graph API. You can separately [view the assignments for a custom role](roles-view-assignments.md#view-the-assignments-of-a-role-with-single-application-scope-using-the-azure-ad-portal-preview).

The following diagram shows an example of a role assignment. In this example, Chris Green has been assigned the [Application administrator](directory-assign-admin-roles.md#application-administrator) role in the scope of the SalesForce application. Chris doesn't have access to manage any other application, unless they are part of a different role assignment.

![Role assignment is how permissions are enforced and has three parts](./media/roles-custom-overview/rbac-overview.png)

### Security principal

A security principal represents the user or service principal that is to be assigned access to Azure AD resources.

- A user is n individual who has a user profile in Azure Active Directory.
- A service principal is a security identity used by applications or services to access specific Azure AD resources.

A security principal is similar to a user identity in that it represents a username and password or certificate, but for an application or service instead of a user.

### Role

A role definition, or role, is a collection of permissions. A role definition lists the operations that can be performed on Azure AD objects, such as create, read, update, and delete. There are two types of roles in Azure AD:

- Built-in roles created by Microsoft that can't be changed. The Global Administrator built-in role has all permissions on all types
- Custom roles created and managed by your organization

### Scope

A scope is the restriction of permitted actions on a particular Azure AD resource. When you assign a role, you can customize the role to limit the administrator's allowable actions by defining a scope of action. For example, if your developers don't need to fully manage all applications, you can use Azure AD custom roles to allow them to manage only app registrations.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom role assignments using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md#view-the-assignments-of-a-role-with-single-application-scope-using-the-azure-ad-portal-preview)