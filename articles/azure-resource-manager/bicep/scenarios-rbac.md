---
title: Use Bicep to create Azure role-based access control (Azure RBAC) resources
description: Learn how to use Bicep to create role assignments and definitions.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 03/25/2025
---

# Use Bicep to create Azure role-based access control (Azure RBAC) resources 

Azure has a powerful role-based access control (RBAC) system. For more information on Azure RBAC, see [What is Azure Role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md) By using Bicep, you can programmatically define your RBAC role assignments and role definitions.

## Role assignments

Role assignments enable you to grant a principal such as a user, a group, or a service principal access to a specific Azure resource.

To define a role assignment, create a resource with type [`Microsoft.Authorization/roleAssignments`](/azure/templates/microsoft.authorization/roleassignments?tabs=bicep). A role definition has multiple properties, including a scope, a name, a role definition ID, a principal ID, and a principal type.

### Scope

Role assignments apply at a specific _scope_, which defines the resource or set of resources to which you're granting access. For more information, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Role assignments are [extension resources](scope-extension-resources.md), meaning that they apply to another resource. The following example shows how to create a storage account and a role assignment scoped to that storage account:

```bicep
param location string = resourceGroup().location
param storageAccountName string = 'stor${uniqueString(resourceGroup().id)}'
param storageSkuName string = 'Standard_LRS'
param roleDefinitionResourceId string
param principalId string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
   name: storageSkuName
  }
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(storageAccount.id, principalId, roleDefinitionResourceId)
  properties: {
    roleDefinitionId: roleDefinitionResourceId
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

If you don't explicitly specify the scope, Bicep uses the file's `targetScope`. In the following example, no `scope` property is specified, so the role assignment is scoped to the subscription:

```bicep
param roleDefinitionResourceId string
param principalId string

targetScope = 'subscription'

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().id, principalId, roleDefinitionResourceId)
  properties: {
    roleDefinitionId: roleDefinitionResourceId
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

> [!TIP]
> Use the smallest scope that you need to meet your requirements.
>
> For example, if you need to grant a managed identity access to a single storage account, it's good security practice to create the role assignment at the scope of the storage account and not at the resource group or subscription scope.

### Name

A role assignment's resource name must be a globally unique identifier (GUID).

Role assignment resource names must be unique within the Microsoft Entra tenant, even if the scope is narrower.

For your Bicep deployment to be repeatable, it's important for the name to be deterministic; i.e., use the same name every time you deploy. It's a good practice to create a GUID that uses the scope, principal ID, and role ID together. It's a good idea to use the `guid()` function to help you to create a deterministic GUID for your role assignment names, like in this example:

```bicep
name: guid(subscription().id, principalId, roleDefinitionResourceId)
```

### Role definition ID

The role you assign can be a built-in role definition or a [custom role definition](#custom-role-definitions). To use a built-in role definition, [find the appropriate role definition ID](../../role-based-access-control/built-in-roles.md). For example, the _Contributor_ role has a role definition ID of `b24988ac-6180-42a0-ab88-20f7382dd24c`.

When you create the role assignment resource, you need to specify a fully qualified resource ID. Built-in role definition IDs are subscription-scoped resources. It's recommended to use an `existing` resource to refer to the built-in role and to use the `.id` property to access its fully qualified resource ID:

```bicep
param principalId string

@description('This is the built-in Contributor role. See https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#contributor')
resource contributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: 'b24988ac-6180-42a0-ab88-20f7382dd24c'
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, principalId, contributorRoleDefinition.id)
  properties: {
    roleDefinitionId: contributorRoleDefinition.id
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Principal

The `principalId` property must be set to a GUID that represents the Microsoft Entra identifier for the principal. In Microsoft Entra ID, this is sometimes referred to as the _object ID_.

The `principalType` property specifies whether the principal is a user, a group, or a service principal. Managed identities are a form of service principal.

> [!TIP]
> It's important to set the `principalType` property when you create a role assignment in Bicep. Otherwise, you might get intermittent deployment errors, especially when you work with service principals and managed identities.

The following example shows how to create a user-assigned managed identity and a role assignment:

```bicep
param location string = resourceGroup().location
param roleDefinitionResourceId string

var managedIdentityName = 'MyManagedIdentity'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentity.id, roleDefinitionResourceId)
  properties: {
    roleDefinitionId: roleDefinitionResourceId
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Resource deletion behavior

When you delete a user, group, service principal, or managed identity from Microsoft Entra ID, it's recommended to delete any role assignments. They aren't deleted automatically.

Any role assignments that refer to a deleted principal ID become invalid. If you try to reuse a role assignment's name for another role assignment, the deployment will fail. To work around this behavior, you should either remove the old role assignment before you recreate it, or ensure that you use a unique name when you deploy a new role assignment. This [quickstart template](/samples/azure/azure-quickstart-templates/key-vault-managed-identity-role-assignment) illustrates how you can define a role assignment in a Bicep module and use a principal ID as a seed value for the role assignment name.

## Custom role definitions

Custom role definitions enable you to define a set of permissions that can then be assigned to a principal by using a role assignment. For more information on role definitions, see [Understand Azure role definitions](../../role-based-access-control/role-definitions.md).

To create a custom role definition, define a resource of type `Microsoft.Authorization/roleDefinitions`. See the [Create a new role def via a subscription-level deployment](https://azure.microsoft.com/resources/templates/create-role-def/) quickstart for an example.

Role definition resource names must be unique within the Microsoft Entra tenant, even if the assignable scopes are more narrow.

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
  - [Create a new role def via a subscription-level deployment](https://azure.microsoft.com/resources/templates/create-role-def/)
  - [Assign a role at subscription scope](https://azure.microsoft.com/resources/templates/subscription-role-assignment/)
  - [Assign a role at tenant scope](https://azure.microsoft.com/resources/templates/tenant-role-assignment/)
  - [Create a resourceGroup, apply a lock and RBAC](https://azure.microsoft.com/resources/templates/create-rg-lock-role-assignment/)
  - [Create key vault, managed identity, and role assignment](/samples/azure/azure-quickstart-templates/key-vault-managed-identity-role-assignment)
- Community blog posts
  - [Create role assignments for different scopes with Bicep](https://4bes.nl/2022/04/24/create-role-assignments-for-different-scopes-with-bicep/), by Barbara Forbes
