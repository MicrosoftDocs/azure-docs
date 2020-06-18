---
title: What is Azure role-based access control (Azure RBAC)?
description: Get an overview of Azure role-based access control (Azure RBAC). Use role assignments to control access to Azure resources.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 8f8aadeb-45c9-4d0e-af87-f1f79373e039
ms.service: role-based-access-control
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/17/2020
ms.author: rolyon
ms.reviewer: bagovind

#Customer intent: As a dev, devops, or it admin, I want to learn how permissions and roles work in Azure, so that I can better understand how to grant access to resources.
---

# What is Azure role-based access control (Azure RBAC)?

Access management for cloud resources is a critical function for any organization that is using the cloud. Azure role-based access control (Azure RBAC) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to.

Azure RBAC is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) that provides fine-grained access management of Azure resources.

## What can I do with Azure RBAC?

Here are some examples of what you can do with Azure RBAC:

- Allow one user to manage virtual machines in a subscription and another user to manage virtual networks
- Allow a DBA group to manage SQL databases in a subscription
- Allow a user to manage all resources in a resource group, such as virtual machines, websites, and subnets
- Allow an application to access all resources in a resource group

## How Azure RBAC works

The way you control access to resources using Azure RBAC is to create role assignments. This is a key concept to understand – it's how permissions are enforced. A role assignment consists of three elements: security principal, role definition, and scope.

### Security principal

A *security principal* is an object that represents a user, group, service principal, or managed identity that is requesting access to Azure resources.

![Security principal for a role assignment](./media/overview/rbac-security-principal.png)

- User - An individual who has a profile in Azure Active Directory. You can also assign roles to users in other tenants. For information about users in other organizations, see [Azure Active Directory B2B](../active-directory/b2b/what-is-b2b.md).
- Group - A set of users created in Azure Active Directory. When you assign a role to a group, all users within that group have that role. 
- Service principal - A security identity used by applications or services to access specific Azure resources. You can think of it as a *user identity* (username and password or certificate) for an application.
- Managed identity - An identity in Azure Active Directory that is automatically managed by Azure. You typically use [managed identities](../active-directory/managed-identities-azure-resources/overview.md) when developing cloud applications to manage the credentials for authenticating to Azure services.

### Role definition

A *role definition* is a collection of permissions. It's typically just called a *role*. A role definition lists the operations that can be performed, such as read, write, and delete. Roles can be high-level, like owner, or specific, like virtual machine reader.

![Role definition for a role assignment](./media/overview/rbac-role-definition.png)

Azure includes several [built-in roles](built-in-roles.md) that you can use. The following lists four fundamental built-in roles. The first three apply to all resource types.

- [Owner](built-in-roles.md#owner) - Has full access to all resources including the right to delegate access to others.
- [Contributor](built-in-roles.md#contributor) - Can create and manage all types of Azure resources but can't grant access to others.
- [Reader](built-in-roles.md#reader) - Can view existing Azure resources.
- [User Access Administrator](built-in-roles.md#user-access-administrator) - Lets you manage user access to Azure resources.

The rest of the built-in roles allow management of specific Azure resources. For example, the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role allows a user to create and manage virtual machines. If the built-in roles don't meet the specific needs of your organization, you can create your own [Azure custom roles](custom-roles.md).

Azure has data operations that enable you to grant access to data within an object. For example, if a user has read data access to a storage account, then they can read the blobs or messages within that storage account. For more information, see [Understand Azure role definitions](role-definitions.md).

### Scope

*Scope* is the set of resources that the access applies to. When you assign a role, you can further limit the actions allowed by defining a scope. This is helpful if you want to make someone a [Website Contributor](built-in-roles.md#website-contributor), but only for one resource group.

In Azure, you can specify a scope at multiple levels: [management group](../governance/management-groups/overview.md), subscription, resource group, or resource. Scopes are structured in a parent-child relationship.

![Scope for a role assignment](./media/overview/rbac-scope.png)

When you grant access at a parent scope, those permissions are inherited to the child scopes. For example:

- If you assign the [Owner](built-in-roles.md#owner) role to a user at the management group scope, that user can manage everything in all subscriptions in the management group.
- If you assign the [Reader](built-in-roles.md#reader) role to a group at the subscription scope, the members of that group can view every resource group and resource in the subscription.
- If you assign the [Contributor](built-in-roles.md#contributor) role to an application at the resource group scope, it can manage resources of all types in that resource group, but not other resource groups in the subscription.

### Role assignments

A *role assignment* is the process of attaching a role definition to a user, group, service principal, or managed identity at a particular scope for the purpose of granting access. Access is granted by creating a role assignment, and access is revoked by removing a role assignment.

The following diagram shows an example of a role assignment. In this example, the Marketing group has been assigned the [Contributor](built-in-roles.md#contributor) role for the pharma-sales resource group. This means that users in the Marketing group can create or manage any Azure resource in the pharma-sales resource group. Marketing users do not have access to resources outside the pharma-sales resource group, unless they are part of another role assignment.

![Role assignment to control access](./media/overview/rbac-overview.png)

You can create role assignments using the Azure portal, Azure CLI, Azure PowerShell, Azure SDKs, or REST APIs. You can have up to **2000** role assignments in each subscription. This limit includes role assignments at the subscription, resource group, and resource scopes. You can have up to **500** role assignments in each management group. To create and remove role assignments, you must have `Microsoft.Authorization/roleAssignments/*` permission. This permission is granted through the [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator) roles.

## Multiple role assignments

So what happens if you have multiple overlapping role assignments? Azure RBAC is an additive model, so your effective permissions are the sum of your role assignments. Consider the following example where a user is granted the Contributor role at the subscription scope and the Reader role on a resource group. The sum of the Contributor permissions and the Reader permissions is effectively the Contributor role for the resource group. Therefore, in this case, the Reader role assignment has no impact.

![Multiple role assignments](./media/overview/rbac-multiple-roles.png)

## Deny assignments

Previously, Azure RBAC was an allow-only model with no deny, but now Azure RBAC supports deny assignments in a limited way. Similar to a role assignment, a *deny assignment* attaches a set of deny actions to a user, group, service principal, or managed identity at a particular scope for the purpose of denying access. A role assignment defines a set of actions that are *allowed*, while a deny assignment defines a set of actions that are *not allowed*. In other words, deny assignments block users from performing specified actions even if a role assignment grants them access. Deny assignments take precedence over role assignments. For more information, see [Understand Azure deny assignments](deny-assignments.md).

## How Azure RBAC determines if a user has access to a resource

The following are the high-level steps that Azure RBAC uses to determine if you have access to a resource on the management plane. This is helpful to understand if you are trying to troubleshoot an access issue.

1. A user (or service principal) acquires a token for Azure Resource Manager.

    The token includes the user's group memberships (including transitive group memberships).

1. The user makes a REST API call to Azure Resource Manager with the token attached.

1. Azure Resource Manager retrieves all the role assignments and deny assignments that apply to the resource upon which the action is being taken.

1. Azure Resource Manager narrows the role assignments that apply to this user or their group and determines what roles the user has for this resource.

1. Azure Resource Manager determines if the action in the API call is included in the roles the user has for this resource.

1. If the user doesn't have a role with the action at the requested scope, access is not granted. Otherwise, Azure Resource Manager checks if a deny assignment applies.

1. If a deny assignment applies, access is blocked. Otherwise access is granted.

## License requirements

[!INCLUDE [Azure AD free license](../../includes/active-directory-free-license.md)]

## Next steps

- [Quickstart: View the access a user has to Azure resources](check-access.md)
- [Add or remove Azure role assignments using the Azure portal](role-assignments-portal.md)
- [Understand the different roles](rbac-and-directory-admin-roles.md)
- [Cloud Adoption Framework: Resource access management in Azure](/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management)
