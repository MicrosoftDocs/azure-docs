---
title: Bicep functions - scopes
description: Describes the functions to use in a Bicep file to retrieve values about deployment scopes.
ms.topic: conceptual
ms.date: 06/01/2021
---

# Scope functions for Bicep

Resource Manager provides the following functions for getting scope values in your Bicep file:

* [managementGroup](#managementgroup)
* [resourceGroup](#resourcegroup)
* [subscription](#subscription)
* [tenant](#tenant)

## managementGroup

`managementGroup()`

`managementGroup(name)`

Returns an object used for setting the scope to a management group.

### Return value

An object used for setting the `scope` property on a [module](modules.md) or [extension resource type](scope-extension-resources.md).

### Remarks

`managementGroup()` can only be used on a [management group deployments](deploy-to-management-group.md). It returns the current management group for the deployment operation.

`managementGroup(name)` can be used for any deployment scope. Provide the unique identifier, not display name, for the management group to deploy to.

### Management group example

The following example scopes a module to a management group.

```bicep
param managementGroupName string

module  'module.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupName)
}
``` 

## resourceGroup

`resourceGroup()`

Returns an object that represents the current resource group.

### Return value

The returned object is in the following format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "{resourceGroupLocation}",
  "managedBy": "{identifier-of-managing-resource}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

The **managedBy** property is returned only for resource groups that contain resources that are managed by another service. For Managed Applications, Databricks, and AKS, the value of the property is the resource ID of the managing resource.

### Remarks

The `resourceGroup()` function can't be used in a Bicep file that is [deployed at the subscription level](./deploy-to-subscription.md). It can only be used in Bicep files that are deployed to a resource group.

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location for a default parameter value.

```bicep
param location string = resourceGroup().location
```

You can also use the resourceGroup function to apply tags from the resource group to a resource. For more information, see [Apply tags from resource group](../management/tag-resources.md#apply-tags-from-resource-group).

### Resource group example

The following example returns the properties of the resource group.

```bicep
output resourceGroupOutput object = resourceGroup()
```

The preceding example returns an object in the following format:

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/examplegroup",
  "name": "examplegroup",
  "type":"Microsoft.Resources/resourceGroups",
  "location": "southcentralus",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```


## subscription

`subscription()`

`subscription(subscriptionId)`

Returns an object used for setting the scope to a subscription.

Or

Returns details about the subscription for the current deployment.

### Remarks

The subscription function has two distinct uses. One usage is for setting the scope on a module or extension resource type. The other usage is for getting details about the current subscription.

The placement of the function determines its usage. When used to set the `scope` property, it returns a scope object.

`subscription()` and `subscription(subscriptionId)` can be used to set scope. They can be used only on deployments scoped to a subscription or resource group.

`subscription()` can be used for getting details about the subscription.

### Return value

When used for setting scope, the function returns an object that is valid for the `scope` property on a [module](modules.md) or [extension resource type](scope-extension-resources.md).

When used for getting details about the subscription, the function returns the following format:

```json
{
  "id": "/subscriptions/{subscription-id}",
  "subscriptionId": "{subscription-id}",
  "tenantId": "{tenant-id}",
  "displayName": "{name-of-subscription}"
}
```

### Subscription example

The following example scopes a module to the subscription.

```bicep
module exampleModule 'module.bicep' = {
  name: 'deployToSub'
  scope: subscription()
}
```

The next example returns the details for a subscription.

```bicep
output subscriptionOutput object = subscription()
```

## tenant

`tenant()`

Returns an object used for setting the scope to the tenant.

### Return value

An object used for setting the `scope` property on a [module](modules.md) or [extension resource type](scope-extension-resources.md).

### Remarks

`tenant()` can be used with any deployment scope. It always returns the current tenant.

### Tenant example

The following example shows a module deployed to the tenant.

```bicep
module exampleModule 'module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).

