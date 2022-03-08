---
title: Create Azure RBAC resources by using Bicep
description: Describes how to create role assignments and role definitions by using Bicep.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.date: 12/20/2021
---
# Create Azure RBAC resources by using Bicep

Azure has a powerful role-based access control (RBAC) system. By using Bicep, you can programmatically define your RBAC role assignments and role definitions.

## Role assignments

To define a role assignment, create a resource with type [`Microsoft.Authorization/roleAssignments`](/azure/templates/microsoft.authorization/roleassignments?tabs=bicep). A role definition has multiple properties, including a scope, a name, a role definition ID, a principal ID, and a principal type.

### Scope

Role assignments are [extension resources](scope-extension-resources.md), which means they apply to another resource. The following example shows how to create a storage account and a role assignment scoped to that storage account:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-rbac/scope.bicep" highlight="17" :::

If you don't explicitly specify the scope, Bicep uses the file's `targetScope`. In the following example, no `scope` property is specified, so the role assignment applies to the subscription:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-rbac/scope-default.bicep" highlight="4" :::

> [!TIP]
> Ensure you use the smallest scope required for your requirements.
>
> For example, if you need to grant a managed identity access to a single storage account, it's good security practice to create the role assignment at the scope of the storage account, not at the resource group or subscription scope.

### Name

A role assignment's resource name must be a globally unique identifier (GUID). It's a good practice to create a GUID that uses the scope, principal ID, and role ID together. Role assignment resource names must be unique within the Azure Active Directory tenant, even if the scope is narrower.

> [!TIP]
> Use the `guid()` function to help you to create a deterministic GUID for your role assignment names, like in this example:
>
> ```bicep
> name: guid(subscription().id, principalId, roleDefinitionResourceId)
> ```

### Role definition ID

The role you assign can be a built-in role definition or a [custom role definition](#custom-role-definitions). To use a built-in role definition, [find the appropriate role definition ID](../../role-based-access-control/built-in-roles.md). For example, the *Contributor* role has a role definition ID of `b24988ac-6180-42a0-ab88-20f7382dd24c`.

When you create the role assignment resource, you need to specify a fully qualified resource ID. Built-in role definition IDs are subscription-scoped resources. It's a good practice to use an `existing` resource to refer to the built-in role, and to access its fully qualified resource ID by using the `.id` property:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-rbac/built-in-role.bicep" highlight="3-7, 12" :::

### Principal

The `principalId` property must be set to a GUID that represents the Azure Active Directory (Azure AD) identifier for the principal. In Azure AD, this is sometimes referred to as the *object ID*.

The `principalType` property specifies whether the principal is a user, a group, or a service principal. Managed identities are a form of service principal.

> [!TIP]
> It's important to set the `principalType` property when you create a role assignment in Bicep. Otherwise, you might get intermittent deployment errors, especially when you work with service principals and managed identities.

The following example shows how to create a user-assigned managed identity and a role assignment:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-rbac/managed-identity.bicep" highlight="15-16" :::

## Custom role definitions

To create a custom role definition, define a resource of type `Microsoft.Authorization/roleDefinitions`. See the [Create a new role def via a subscription level deployment](https://azure.microsoft.com/resources/templates/create-role-def/) quickstart for an example.

Role definition resource names must be unique within the Azure Active Directory tenant, even if the assignable scopes are narrower.

> [!NOTE]
> Some services manage their own role definitions and assignments. For example, Azure Cosmos DB maintains its own [`Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments`](/azure/templates/microsoft.documentdb/databaseaccounts/sqlroleassignments?tabs=bicep) and [`Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions`](/azure/templates/microsoft.documentdb/databaseaccounts/sqlroledefinitions?tabs=bicep) resources. For more information, see the specific service's documentation.

## Related resources

- Resource documentation
  - [`Microsoft.Authorization/roleAssignments`](/azure/templates/microsoft.authorization/roleassignments?tabs=bicep)
  - [`Microsoft.Authorization/roleDefinitions`](/azure/templates/microsoft.authorization/roledefinitions?tabs=bicep)
- [Extension resources](scope-extension-resources.md)
- Scopes
  - [Resource group](deploy-to-resource-group.md)
  - [Subscription](deploy-to-subscription.md)
  - [Management group](deploy-to-management-group.md)
  - [Tenant](deploy-to-tenant.md)
- Quickstart templates
  - [Create a new role def via a subscription level deployment](https://azure.microsoft.com/resources/templates/create-role-def/)
  - [Assign a role at subscription scope](https://azure.microsoft.com/resources/templates/subscription-role-assignment/)
  - [Assign a role at tenant scope](https://azure.microsoft.com/resources/templates/tenant-role-assignment/)
  - [Create a resourceGroup, apply a lock and RBAC](https://azure.microsoft.com/resources/templates/create-rg-lock-role-assignment/)