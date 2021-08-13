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

### Remarks

`managementGroup()` can only be used on a [management group deployments](deploy-to-management-group.md). It returns the current management group for the deployment operation.

`managementGroup(name)` can be used for any deployment scope.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| name |No |string |The unique identifier for the management group to deploy to. Don't use the display name for the management group. If you don't provide a value, the current management group is returned. |

### Return value

An object used for setting the `scope` property on a [module](modules.md#configure-module-scopes) or [extension resource type](scope-extension-resources.md).

### Management group example

The following example sets the scope for a module to a management group.

```bicep
param managementGroupName string

module  'module.bicep' = {
  name: 'deployToMG'
  scope: managementGroup(managementGroupName)
}
``` 

## resourceGroup

`resourceGroup()`

`resourceGroup(resourceGroupName)`

`resourceGroup(subscriptionId, resourceGroupName)`

Returns an object used for setting the scope to a resource group.

Or

Returns an object that represents the current resource group.

### Remarks

The resourceGroup function has two distinct uses. One usage is for setting the scope on a [module](modules.md#configure-module-scopes) or [extension resource type](scope-extension-resources.md). The other usage is for getting details about the current resource group. The placement of the function determines its usage. When used to set the `scope` property, it returns a scope object.

`resourceGroup()` can be used for either setting scope or getting details about the resource group.

`resourceGroup(resourceGroupName)` and `resourceGroup(subscriptionId, resourceGroupName)` can only be used for setting scope.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceGroupName |No |string | The name of the resource group to deploy to. If you don't provide a value, the current resource group is returned. |
| subscriptionId |No |string |The unique identifier for the subscription to deploy to. If you don't provide a value, the current subscription is returned. |

### Return value

When used for setting scope, the function returns an object that is valid for the `scope` property on a module or extension resource type.

When used for getting details about the resource group, the function returns the following format:

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

### Resource group example

The following example scopes a module to a resource group.

```bicep
param resourceGroupName string

module exampleModule 'module.bicep' = {
  name: 'exampleModule'
  scope: resourceGroup(resourceGroupName)
}
```

The next example returns the properties of the resource group.

```bicep
output resourceGroupOutput object = resourceGroup()
```

It returns an object in the following format:

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

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location for a default parameter value.

```bicep
param location string = resourceGroup().location
```

You can also use the resourceGroup function to apply tags from the resource group to a resource. For more information, see [Apply tags from resource group](../management/tag-resources.md#apply-tags-from-resource-group).

## subscription

`subscription()`

`subscription(subscriptionId)`

Returns an object used for setting the scope to a subscription.

Or

Returns details about the subscription for the current deployment.

### Remarks

The subscription function has two distinct uses. One usage is for setting the scope on a [module](modules.md#configure-module-scopes) or [extension resource type](scope-extension-resources.md). The other usage is for getting details about the current subscription. The placement of the function determines its usage. When used to set the `scope` property, it returns a scope object.

`subscription(subscriptionId)` can only be used for setting scope.

`subscription()` can be used for setting scope or getting details about the subscription.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |string |The unique identifier for the subscription to deploy to. If you don't provide a value, the current subscription is returned. |

### Return value

When used for setting scope, the function returns an object that is valid for the `scope` property on a module or extension resource type.

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

### Remarks

`tenant()` can be used with any deployment scope. It always returns the current tenant.

### Return value

An object used for setting the `scope` property on a [module](modules.md#configure-module-scopes) or [extension resource type](scope-extension-resources.md).

### Tenant example

The following example shows a module deployed to the tenant.

```bicep
module exampleModule 'module.bicep' = {
  name: 'deployToTenant'
  scope: tenant()
}
```

## Next steps

To learn more about deployment scopes, see:

* [Resource group deployments](deploy-to-resource-group.md)
* [Subscription deployments](deploy-to-subscription.md)
* [Management group deployments](deploy-to-management-group.md)
* [Tenant deployments](deploy-to-tenant.md)
