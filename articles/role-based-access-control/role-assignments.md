---
title: Understand Azure role assignments - Azure RBAC
description: Learn about Azure role assignments in Azure role-based access control (Azure RBAC) for fine-grained access management of Azure resources.
services: active-directory
documentationcenter: ''
author: johndowns
ms.service: role-based-access-control
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2022
ms.author: jodowns
ms.custom:
---
# Understand Azure role assignments

Role assignments enable you to grant a principal (such as a user, a group, a managed identity, or a service principal) access to a specific Azure resource. Access is granted by creating a role assignment, and access is revoked by removing a role assignment.

Role assignments have several components, including:

- The *principal*, or *who* is assigned the role.
- The *role definition* that they're assigned.
- The *scope* at which the role is assigned.
- The *name* of the role assignment, and a *description* that helps you to explain why the role has been assigned.

For example, you can use Azure RBAC to assign roles like:

- User Sally has owner access to the storage account *contoso123* in the resource group *ContosoStorage*.
- Everybody in the Cloud Administrators group in Azure Active Directory has reader access to all resources in the resource group *ContosoStorage*.
- The managed identity associated with an application is allowed to restart virtual machines within Contoso's subscription.

## Scope

When you create a role assignment, you need to specify the scope at which it's applied. The scope represents the resource, or set of resources, that the principal is allowed to access. You can scope a role assignment to a single resource, a resource group, a subscription, or a management group.

> [!TIP]
> Use the smallest scope that you need to meet your requirements.
>
> For example, if you need to grant a managed identity access to a single storage account, it's good security practice to create the role assignment at the scope of the storage account, not at the resource group or subscription scope.

For more information about scope, see [Understand scope](scope-overview.md).

## Role to assign

A role assignment is associated with a role definition. The role definition specifies the permissions that the principal should have within the role assignment's scope.

You can assign a built-in role definition or a custom role definition.

For more information about role definitions, see [Understand role definitions](role-definitions.md).

## Principal

Principals include users, security groups, managed identities, workload identities, and service principals. Principals are created and managed in your Azure Active Directory (Azure AD) tenant. You can assign a role to any principal. Use the Azure AD *object ID* to identify the principal that you want to assign the role to.

When you create a role assignment by using Azure PowerShell, the Azure CLI, Bicep, or another infrastructure as code (IaC) technology, you specify the *principal type*. Principal types include *User*, *Group*, and *ServicePrincipal*. It's important to specify the correct principal type. Otherwise, you might get intermittent deployment errors, especially when you work with service principals and managed identities.

## Name

A role assignment's resource name must be a globally unique identifier (GUID).

Role assignment resource names must be unique within the Azure Active Directory tenant, even if the scope is narrower.

> [!TIP]
> When you create a role assignment by using the Azure portal, Azure PowerShell, or the Azure CLI, the creation process gives the role assignment a unique name for you automatically.
>
> If you create a role assignment by using Bicep or another infrastructure as code (IaC) technology, you need to carefully plan how you name your role assignments. For more information, see [Create Azure RBAC resources by using Bicep](../azure-resource-manager/bicep/scenarios-rbac.md).

### Resource deletion behavior

When you delete a user, group, service principal, or managed identity from Azure AD, it's a good practice to delete any role assignments. They aren't deleted automatically.

Any role assignments that refer to a deleted principal ID become invalid. If you try to reuse a role assignment's name for another role assignment, the deployment will fail. To work around this behavior, you should either remove the old role assignment before you recreate it, or ensure that you use a unique name when you deploy a new role assignment.

## Description

You can add a text description to a role assignment. While descriptions are optional, it's a good practice to add them to your role assignments. Provide a short justification for why the principal needs the assigned role. When you or your organization audit the role assignments, descriptions can help to understand why they've been created and whether they're still applicable.

## Next steps

* [Understand role definitions](role-definitions.md)
