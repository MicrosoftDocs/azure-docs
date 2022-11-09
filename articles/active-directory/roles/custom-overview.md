---
title: Overview of Azure Active Directory role-based access control (RBAC)
description: Learn how to understand the parts of a role assignment and restricted scope in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 10/06/2021
ms.author: rolyon
ms.reviewer: abhijeetsinha
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Overview of role-based access control in Azure Active Directory

This article describes how to understand Azure Active Directory (Azure AD) role-based access control. Azure AD roles allow you to grant granular permissions to your admins, abiding by the principle of least privilege. Azure AD built-in and custom roles operate on concepts similar to those you will find in [the role-based access control system for Azure resources](../../role-based-access-control/overview.md) (Azure roles). The [difference between these two role-based access control systems](../../role-based-access-control/rbac-and-directory-admin-roles.md) is:

- Azure AD roles control access to Azure AD resources such as users, groups, and applications using the Microsoft Graph API
- Azure roles control access to Azure resources such as virtual machines or storage using Azure Resource Management

Both systems contain similarly used role definitions and role assignments. However, Azure AD role permissions can't be used in Azure custom roles and vice versa.

## Understand Azure AD role-based access control
Azure AD supports 2 types of roles definitions:
* [Built-in roles](./permissions-reference.md)
* [Custom roles](./custom-create.md)

Built-in roles are out of box roles that have a fixed set of permissions. These role definitions cannot be modified. There are many [built-in roles](./permissions-reference.md) that Azure AD supports, and the list is growing. To round off the edges and meet your sophisticated requirements, Azure AD also supports [custom roles](./custom-create.md). Granting permission using custom Azure AD roles is a two-step process that involves creating a custom role definition and then assigning it using a role assignment. A custom role definition is a collection of permissions that you add from a preset list. These permissions are the same permissions used in the built-in roles.  

Once you’ve created your custom role definition (or using a built-in role), you can assign it to a user by creating a role assignment. A role assignment grants the user the permissions in a role definition at a specified scope. This two-step process allows you to create a single role definition and assign it many times at different scopes. A scope defines the set of Azure AD resources the role member has access to. The most common scope is organization-wide (org-wide) scope. A custom role can be assigned at org-wide scope, meaning the role member has the role permissions over all resources in the organization. A custom role can also be assigned at an object scope. An example of an object scope would be a single application. The same role can be assigned to one user over all applications in the organization and then to another user with a scope of only the Contoso Expense Reports app.  

### How Azure AD determines if a user has access to a resource

The following are the high-level steps that Azure AD uses to determine if you have access to a management resource. Use this information to troubleshoot access issues.

1. A user (or service principal) acquires a token to the Microsoft Graph endpoint.
1. The user makes an API call to Azure Active Directory (Azure AD) via Microsoft Graph using the issued token.
1. Depending on the circumstance, Azure AD takes one of the following actions:
   - Evaluates the user’s role memberships based on the [wids claim](../develop/access-tokens.md) in the user’s access token.
   - Retrieves all the role assignments that apply for the user, either directly or via group membership, to the resource on which the action is being taken.
1. Azure AD determines if the action in the API call is included in the roles the user has for this resource.
1. If the user doesn't have a role with the action at the requested scope, access is not granted. Otherwise access is granted.

## Role assignment

A role assignment is an Azure AD resource that attaches a *role definition* to a *security principal* at a particular *scope* to grant access to Azure AD resources. Access is granted by creating a role assignment, and access is revoked by removing a role assignment. At its core, a role assignment consists of three elements:

- Security principal - An identity that gets the permissions. It could be a user, group, or a service principal. 
- Role definition - A collection of permissions. 
- Scope - A way to constrain where those permissions are applicable.

You can [create role assignments](manage-roles-portal.md) and [list the role assignments](view-assignments.md) using the Azure portal, Azure AD PowerShell, or Microsoft Graph API. Azure CLI is not supported for Azure AD role assignments.

The following diagram shows an example of a role assignment. In this example, Chris has been assigned the App Registration Administrator custom role at the scope of the Contoso Widget Builder app registration. The assignment grants Chris the permissions of the App Registration Administrator role for only this specific app registration.

![Role assignment is how permissions are enforced and has three parts.](./media/custom-overview/rbac-overview.png)

### Security principal

A security principal represents a user, group, or service principal that is assigned access to Azure AD resources. A user is an individual who has a user profile in Azure Active Directory. A group is a new Microsoft 365 or security group with the isAssignableToRole property set to true (currently in preview). A service principal is an identity created for use with applications, hosted services, and automated tools to access Azure AD resources.

### Role definition

A role definition, or role, is a collection of permissions. A role definition lists the operations that can be performed on Azure AD resources, such as create, read, update, and delete. There are two types of roles in Azure AD:

- Built-in roles created by Microsoft that can't be changed.
- Custom roles created and managed by your organization.

### Scope

A scope is a way to limit the permitted actions to a particular set of resources as part of a role assignment. For example, if you want to assign a custom role to a developer, but only to manage a specific application registration, you can include the specific application registration as a scope in the role assignment.

When you assign a role, you specify one of the following types of scope:

- Tenant
- [Administrative unit](administrative-units.md)
- Azure AD resource

If you specify an Azure AD resource as a scope, it can be one of the following:

- Azure AD groups
- Enterprise applications
- Application registrations

For more information, see [Assign Azure AD roles at different scopes](assign-roles-different-scopes.md).

## License requirements

Using built-in roles in Azure AD is free, while custom roles requires an Azure AD Premium P1 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## Next steps

- [Understand Azure AD roles](concept-understand-roles.md)
- [Assign Azure AD roles to users](manage-roles-portal.md)
- [Create and assign a custom role](custom-create.md)
