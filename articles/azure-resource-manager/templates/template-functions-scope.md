---
title: Template functions - scope
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to retrieve values about deployment scope.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Scope functions for ARM templates

Resource Manager provides the following functions for getting deployment scope values in your Azure Resource Manager template (ARM template):

* [managementGroup](#managementgroup)
* [resourceGroup](#resourcegroup)
* [subscription](#subscription)
* [tenant](#tenant)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](template-functions-deployment.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [scope](../bicep/bicep-functions-scope.md) functions.

## managementGroup

`managementGroup()`

Returns an object with properties from the management group in the current deployment.

In Bicep, use the [managementGroup](../bicep/bicep-functions-scope.md#managementgroup) scope function.

### Remarks

`managementGroup()` can only be used on a [management group deployments](deploy-to-management-group.md). It returns the current management group for the deployment operation. Use to get properties for the current management group.

### Return value

An object with the properties for the current management group.

### Management group example

The following example returns properties for the current management group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "mgInfo": "[managementGroup()]"
  },
  "resources": [],
  "outputs": {
    "mgResult": {
      "type": "object",
      "value": "[variables('mgInfo')]"
    }
  }
}
```

It returns:

```json
"mgResult": {
  "type": "Object",
  "value": {
    "id": "/providers/Microsoft.Management/managementGroups/examplemg1",
    "name": "examplemg1",
    "properties": {
      "details": {
        "parent": {
          "displayName": "Tenant Root Group",
          "id": "/providers/Microsoft.Management/managementGroups/00000000-0000-0000-0000-000000000000",
          "name": "00000000-0000-0000-0000-000000000000"
        },
        "updatedBy": "00000000-0000-0000-0000-000000000000",
        "updatedTime": "2020-07-23T21:05:52.661306Z",
        "version": "1"
      },
      "displayName": "Example MG 1",
      "tenantId": "00000000-0000-0000-0000-000000000000"
    },
    "type": "/providers/Microsoft.Management/managementGroups"
  }
}
```

The next example creates a new management group and uses this function to set the parent management group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mgName": {
      "type": "string",
      "defaultValue": "[format('mg-{0}', uniqueString(newGuid()))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Management/managementGroups",
      "apiVersion": "2020-05-01",
      "scope": "/",
      "name": "[parameters('mgName')]",
      "properties": {
        "details": {
          "parent": {
            "id": "[managementGroup().id]"
          }
        }
      }
    }
  ],
  "outputs": {
    "newManagementGroup": {
      "type": "string",
      "value": "[parameters('mgName')]"
    }
  }
}
```

## resourceGroup

`resourceGroup()`

Returns an object that represents the current resource group.

In Bicep, use the [resourceGroup](../bicep/bicep-functions-scope.md#resourcegroup) scope function.

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

The `resourceGroup()` function can't be used in a template that is [deployed at the subscription level](deploy-to-subscription.md). It can only be used in templates that are deployed to a resource group. You can use the `resourceGroup()` function in a [linked or nested template (with inner scope)](linked-templates.md) that targets a resource group, even when the parent template is deployed to the subscription. In that scenario, the linked or nested template is deployed at the resource group level. For more information about targeting a resource group in a subscription level deployment, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location for a default parameter value.

```json
"parameters": {
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
}
```

You can also use the `resourceGroup` function to apply tags from the resource group to a resource. For more information, see [Apply tags from resource group](../management/tag-resources-templates.md#apply-tags-from-resource-group).

When using nested templates to deploy to multiple resource groups, you can specify the scope for evaluating the `resourceGroup` function. For more information, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

### Resource group example

The following example returns the properties of the resource group.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/resourcegroup.json":::

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

Returns details about the subscription for the current deployment.

In Bicep, use the [subscription](../bicep/bicep-functions-scope.md#subscription) scope function.

### Return value

The function returns the following format:

```json
{
  "id": "/subscriptions/{subscription-id}",
  "subscriptionId": "{subscription-id}",
  "tenantId": "{tenant-id}",
  "displayName": "{name-of-subscription}"
}
```

### Remarks

When using nested templates to deploy to multiple subscriptions, you can specify the scope for evaluating the subscription function. For more information, see [Deploy Azure resources to more than one subscription or resource group](./deploy-to-resource-group.md).

### Subscription example

The following example shows the subscription function called in the outputs section.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/resource/subscription.json":::

## tenant

`tenant()`

Returns the tenant of the user.

In Bicep, use the [tenant](../bicep/bicep-functions-scope.md#tenant) scope function.

### Remarks

`tenant()` can be used with any deployment scope. It always returns the current tenant. Use this function to get properties for the current tenant.

When setting the scope for a linked template or extension resource, use the syntax: `"scope": "/"`.

### Return value

An object with properties about the current tenant.

### Tenant example

The following example returns the properties for a tenant.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "variables": {
    "tenantInfo": "[tenant()]"
  },
  "resources": [],
  "outputs": {
    "tenantResult": {
      "type": "object",
      "value": "[variables('tenantInfo')]"
    }
  }
}
```

It returns:

```json
"tenantResult": {
  "type": "Object",
  "value": {
    "countryCode": "US",
    "displayName": "Contoso",
    "id": "/tenants/00000000-0000-0000-0000-000000000000",
    "tenantId": "00000000-0000-0000-0000-000000000000"
  }
}
```

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To merge multiple templates, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
* To see how to deploy the template you've created, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
