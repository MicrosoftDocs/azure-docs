---
title: Deploy resources to management group
description: Describes how to deploy resources at the management group scope in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 11/07/2019
---

# Create resources at the management group level

Typically, you deploy Azure resources to a resource group in your Azure subscription. However, you can also create resources at the management group level. You use management group level deployments to take actions that make sense at that level, such as assigning [role-based access control](../../role-based-access-control/overview.md) or applying [policies](../../governance/policy/overview.md).

Currently, to deploy templates at the management group level, you must use the REST API.

## Supported resources

You can deploy the following resource types at the management group level:

* [deployments](/azure/templates/microsoft.resources/deployments)
* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)

### Schema

The schema you use for management group deployments is different than the schema for resource group deployments.

For templates, use:

```json
https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#
```

For parameter files, use:

```json
https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentParameters.json#
```

## Deployment commands

The command for management group deployments is different than the command for resource group deployments.

For REST API, use [Deployments - Create At Management Group Scope](/rest/api/resources/deployments/createorupdateatmanagementgroupscope).

## Deployment location and name

For management group level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named **azuredeploy.json** creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Use template functions

For management group deployments, there are some important considerations when using template functions:

* The [resourceGroup()](template-functions-resource.md#resourcegroup) function is **not** supported.
* The [subscription()](template-functions-resource.md#subscription) function is **not** supported.
* The [resourceId()](template-functions-resource.md#resourceid) function is supported. Use it to get the resource ID for resources that are used at management group level deployments. For example, get the resource ID for a policy definition with `resourceId('Microsoft.Authorization/policyDefinitions/', parameters('policyDefinition'))`. It returns the resource ID in the format `/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`.
* The [reference()](template-functions-resource.md#reference) and [list()](template-functions-resource.md#list) functions are supported.

## Create policies

### Define policy

The following example shows how to [define](../../governance/policy/concepts/definition-structure.md) a policy at the management group level.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Authorization/policyDefinitions",
      "apiVersion": "2018-05-01",
      "name": "locationpolicy",
      "properties": {
        "policyType": "Custom",
        "parameters": {},
        "policyRule": {
          "if": {
            "field": "location",
            "equals": "northeurope"
          },
          "then": {
            "effect": "deny"
          }
        }
      }
    }
  ]
}
```

### Assign policy

The following example assigns an existing policy definition to the management group. If the policy takes parameters, provide them as an object. If the policy doesn't take parameters, use the default empty object.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "policyDefinitionID": {
      "type": "string"
    },
    "policyName": {
      "type": "string"
    },
    "policyParameters": {
      "type": "object",
      "defaultValue": {}
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "apiVersion": "2018-03-01",
      "name": "[parameters('policyName')]",
      "properties": {
        "policyDefinitionId": "[parameters('policyDefinitionID')]",
        "parameters": "[parameters('policyParameters')]"
      }
    }
  ]
}
```

## Next steps

* To learn about assigning roles, see [Manage access to Azure resources using RBAC and Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).
* For an example of deploying workspace settings for Azure Security Center, see [deployASCwithWorkspaceSettings.json](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/deployASCwithWorkspaceSettings.json).
* To learn about creating Azure Resource Manager templates, see [Authoring templates](template-syntax.md). 
* For a list of the available functions in a template, see [Template functions](template-functions.md).