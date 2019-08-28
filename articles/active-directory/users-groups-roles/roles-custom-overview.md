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

This article describes how to understand the new custom roles-based access control (RBAC) and resource scopes in Azure Active Directory (Azure AD). Custom RBAC roles surfaces the underlying permissions of the [built-in roles](directory-assign-admin-roles.md) , so you can create and organize your own custom roles. This approach allows you to grant access in a more granular way than built-in roles, when needed. This first release of custom RBAC roles includes the ability to create a role to assign permissions for managing app registrations. Over time, additional permissions for organization resources like enterprise applications, users, and devices will be added.  

Additionally, custom RBAC roles support assignments on a per-resource basis, in addition to the more traditional organization-wide assignments. This approach gives you the ability to grant access to manage some resources (for example, one app registration) without giving access to all resources (all app registrations).

Azure AD role-based access control is a public preview feature of Azure AD and is available with any paid Azure AD license plan. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Understand Azure AD role-based access control

Granting permission using custom RBAC roles is a two-step process that involves creating a custom role definition and then assigning it using a role assignment. A custom role definition is a collection of permissions that you add from a preset list. These permissions are the same permissions used in the built-in roles.  

Once you’ve created your role definition, you can assign it to someone by creating a role assignment. A role assignment grants someone the permissions in a role definition at a specific scope. This two-step process allows you to create one role definition and assign it many times at different scopes. A scope defines the set of resources the role member has access to. The most common scope is organization-wide (org-wide) scope. A custom role can be assigned at org-wide scope, meaning the role member has the role permissions over all resources in the organization. A custom role can also be assigned at an object scope. An example of an object scope would be a single application. This way the same role can be assigned to Sally over all applications in the organization and then Naveen over just the Contoso Expense Reports app.  

Azure AD RBAC operates on concepts similar to [Azure role-based access control](../../role-based-access-control/overview.md). The difference being Azure RBAC controls access to Azure resources such as virtual machines and websites, and Azure AD RBAC controls access to Azure AD. Both systems leverage the concept of role definitions and role assignments.

### Role assignments

A role assignment is the process of attaching a role definition to a user at a particular scope for the purpose of granting access. Access is granted by creating a role assignment, and access is revoked by removing a role assignment. A role assignment consists of three elements:
- User
- Role definition
- Resource scope

You can [create role assignments](roles-create-custom.md) using the Azure portal, Azure AD PowerShell, or Graph API. You can also [view the assignments for a custom role](roles-view-assignments.md#view-the-assignments-of-a-role-with-single-application-scope-using-the-azure-ad-portal-preview).

The following diagram shows an example of a role assignment. In this example, Chris Green has been assigned the App registration administrator custom role at the scope of the Contoso Widget Builder app registration. This assignment grants Chris the permissions of the App registration administrator role only on this specific app registration.

![Role assignment is how permissions are enforced and has three parts](./media/roles-custom-overview/rbac-overview.png)

### Security principal

A security principal represents the user that is to be assigned access to Azure AD resources. A *user* is an individual who has a user profile in Azure Active Directory.

### Role

A role definition, or role, is a collection of permissions. A role definition lists the operations that can be performed on Azure AD resources, such as create, read, update, and delete. There are two types of roles in Azure AD:

- Built-in roles created by Microsoft that can't be changed. The Global administrator built-in role has all permissions on all Azure AD resources.
- Custom roles created and managed by your organization.

### Scope

A scope is the restriction of permitted actions to a particular Azure AD resource as part of a role assignment. When you assign a role, you can specify a scope that limits the administrator's access to a specific resource. For example, if you want to grant a developer a custom role, but only to manage a specific application registration, you can include the specific application registration as a scope in the role assignment.

  > [!Note]
  > Custom roles can be assigned at directory scope and resource scoped. They cannot yet be assigned at Administrative Unit scope.
  > Built-in roles can can be assigned at directory scope, and in some cases Administrative Unit scope. They cannot yet be assigned at object scope.

## Required license plan

[!INCLUDE [License requirement for using custom roles in Azure AD](../../../includes/active-directory-p1-license.md)]

## Next steps

- Create custom role assignments using [the Azure portal, Azure AD PowerShell, and Graph API](roles-create-custom.md)
- [View the assignments for a custom role](roles-view-assignments.md#view-the-assignments-of-a-role-with-single-application-scope-using-the-azure-ad-portal-preview)
