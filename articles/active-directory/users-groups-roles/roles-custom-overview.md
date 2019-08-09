---
title: Preview Azure administrator roles with customizable permissions - Azure Active Directory | Microsoft Docs
description: Preview custom Azure AD roles for delegating identity management. Manage Azure roles in the Azure portal, PowerShell, or Graph API.
services: active-directory
author: curtand
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 07/31/2019
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Custom administrator roles in Azure Active Directory (preview)

This article describes how to understand the new custom RBAC (roles-based access control) and resource scopes in Azure Active Directory (Azure AD). Custom RBAC roles surfaces the underlying permissions of the [built-in roles](directory-assign-admin-roles.md) , so you can create and organize your own custom roles. Resource scopes gives you a way to assign the custom role to manage some resources (e.g. one application) without giving access to all resources (all applications).

Granting permission using custom RBAC roles is a two-step process. First, you create a custom role definition and add permissions to it from the preset list. These are the same permissions used in the built-in roles. Once you’ve created your role, you assign it to someone by creating a role assignment. This two-step process allows you to create one role and assign it many times at different scopes. A custom role can be assigned at directory scope, or it can be assigned at an object scope. An example of an object scope would be a single application. This way the same role can be assigned to Sally over all applications in the directory and then Naveen over just the Contoso Expense Reports app.

This first release of custom RBAC roles includes the ability to create a role to assign permissions for managing app registrations. Over time, additional permissions for organization resources like enterprise applications, users, and devices will be added.

Azure AD role-based access control is a public preview feature of Azure AD and is available with any paid Azure AD license plan. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Understand Azure AD role-based access control

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

A security principal represents the user or service principal that is to be assigned access to Azure AD resources. A *user* is an individual who has a user profile in Azure Active Directory. A *service principal* is a security identity used by applications or services to access specific Azure AD resources.

A security principal is similar to a user identity in that it represents a username and password or certificate, but for an application or service instead of a user.

### Role

A role definition, or role, is a collection of permissions. A role definition lists the operations that can be performed on Azure AD resources, such as create, read, update, and delete. There are two types of roles in Azure AD:

- Built-in roles created by Microsoft that can't be changed. The Global administrator built-in role has all permissions on all Azure AD resources.
- Custom roles created and managed by your organization.

### Scope

A scope is the restriction of permitted actions to a particular Azure AD resource. When you assign a role, you can specify a scope that limits the administrator's allowable actions to a specific resource. For example, if you want grant a developer a custom role, but only to manage a specific application registration, you can include the specific application registration as a scope in the role assignment.

  > [!Note]
  > Custom roles can be assigned at directory scope and resource scoped. They cannot yet be assigned at Administrative Unit scope.
  > Built-in roles can can be assigned at directory scope, and in some cases Administrative Unit scope. They cannot yet be assigned at object scope.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom role assignments using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md#view-the-assignments-of-a-role-with-single-application-scope-using-the-azure-ad-portal-preview)
