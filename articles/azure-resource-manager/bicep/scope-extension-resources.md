---
title: Scope on extension resource types (Bicep)
description: Describes how to use the scope property when deploying extension resource types with Bicep.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 07/01/2021
---

# Set scope for extension resources in Bicep

An extension resource is a resource that modifies another resource. For example, you can assign a role to a resource. The role assignment is an extension resource type.

For a full list of extension resource types, see [Resource types that extend capabilities of other resources](../management/extension-resource-types.md).

This article shows how to set the scope for an extension resource type when deployed with a Bicep file. It describes the scope property that is available for extension resources when applying to a resource.

> [!NOTE]
> The scope property is only available to extension resource types. To specify a different scope for a resource type that isn't an extension type, use a [module](modules.md).

## Apply at deployment scope

To apply an extension resource type at the target deployment scope, you add the resource to your template, as would with any resource type. The available scopes are [resource group](deploy-to-resource-group.md), [subscription](deploy-to-subscription.md), [management group](deploy-to-management-group.md), and [tenant](deploy-to-tenant.md). The deployment scope must support the resource type.

The following template deploys a lock.

```bicep
resource createRgLock 'Microsoft.Authorization/locks@2016-09-01' = {
  name: 'rgLock'
  properties: {
    level: 'CanNotDelete'
    notes: 'Resource group should not be deleted.'
  }
}
```

The next example assigns a role.

```bicep
targetScope = 'subscription'

@description('The principal to assign the role to')
param principalId string

@allowed([
  'Owner'
  'Contributor'
  'Reader'
])
@description('Built-in role to assign')
param builtInRoleType string

@description('A new GUID used to identify the role assignment')
param roleNameGuid string = newGuid()

var role = {
  Owner: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
  Contributor: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
  Reader: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7'
}

resource roleAssignSub 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: roleNameGuid
  properties: {
    roleDefinitionId: role[builtInRoleType]
    principalId: principalId
  }
}
```

## Apply to resource

To apply an extension resource to a resource, use the `scope` property. In the scope property, reference the resource you're adding the extension to. You reference the resource by providing the symbolic name for the resource. The scope property is a root property for the extension resource type.

The following example creates a storage account and applies a role to it.

```bicep
@description('The principal to assign the role to')
param principalId string

@allowed([
  'Owner'
  'Contributor'
  'Reader'
])
@description('Built-in role to assign')
param builtInRoleType string

@description('A new GUID used to identify the role assignment')
param roleNameGuid string = newGuid()
param location string = resourceGroup().location

var role = {
  Owner: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
  Contributor: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c'
  Reader: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7'
}
var uniqueStorageName = 'storage${uniqueString(resourceGroup().id)}'

resource demoStorageAcct 'Microsoft.Storage/storageAccounts@2019-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  properties: {}
}

resource roleAssignStorage 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: roleNameGuid
  properties: {
    roleDefinitionId: role[builtInRoleType]
    principalId: principalId
  }
  scope: demoStorageAcct
  dependsOn: [
    demoStorageAcct
  ]
}
```

## Next steps

To learn about deploying to scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)