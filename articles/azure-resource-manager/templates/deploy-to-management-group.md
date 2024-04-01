---
title: Deploy resources to management group
description: Describes how to deploy resources at the management group scope in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 03/20/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
---

# Management group deployments with ARM templates

As your organization matures, you can deploy an Azure Resource Manager template (ARM template) to create resources at the management group level. For example, you may need to define and assign [policies](../../governance/policy/overview.md) or [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) for a management group. With management group level templates, you can declaratively apply policies and assign roles at the management group level.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [management group deployments](../bicep/deploy-to-management-group.md).

## Supported resources

Not all resource types can be deployed to the management group level. This section lists which resource types are supported.

For Azure Blueprints, use:

* [artifacts](/azure/templates/microsoft.blueprint/blueprints/artifacts)
* [blueprints](/azure/templates/microsoft.blueprint/blueprints)
* [blueprintAssignments](/azure/templates/microsoft.blueprint/blueprintassignments)
* [versions](/azure/templates/microsoft.blueprint/blueprints/versions)

For Azure Policy, use:

* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [remediations](/azure/templates/microsoft.policyinsights/remediations)

For access control, use:

* [privateLinkAssociations](/azure/templates/microsoft.authorization/privatelinkassociations)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleAssignmentScheduleRequests](/azure/templates/microsoft.authorization/roleassignmentschedulerequests)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)
* [roleEligibilityScheduleRequests](/azure/templates/microsoft.authorization/roleeligibilityschedulerequests)
* [roleManagementPolicyAssignments](/azure/templates/microsoft.authorization/rolemanagementpolicyassignments)

For nested templates that deploy to subscriptions or resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For managing your resources, use:

* [diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings)
* [tags](/azure/templates/microsoft.resources/tags)

Management groups are tenant-level resources. However, you can create management groups in a management group deployment by setting the scope of the new management group to the tenant. See [Management group](#management-group).

## Schema

The schema you use for management group deployments is different than the schema for resource group deployments.

For templates, use:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  ...
}
```

The schema for a parameter file is the same for all deployment scopes. For parameter files, use:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  ...
}
```

## Deployment commands

To deploy to a management group, use the management group deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create):

```azurecli-interactive
az deployment mg create \
  --name demoMGDeployment \
  --location WestUS \
  --management-group-id myMG \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/management-level-deployment/azuredeploy.json"
```

# [PowerShell](#tab/azure-powershell)

For Azure PowerShell, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/new-azmanagementgroupdeployment).

```azurepowershell-interactive
New-AzManagementGroupDeployment `
  -Name demoMGDeployment `
  -Location "West US" `
  -ManagementGroupId "myMG" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/management-level-deployment/azuredeploy.json"
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure portal](deploy-portal.md)
* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy resources with ARM templates and Azure Resource Manager REST API](deploy-rest.md)
* [Use a deployment button to deploy templates from GitHub repository](deploy-to-azure-button.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment location and name

For management group level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Subscription](deploy-to-subscription.md) and [tenant](deploy-to-tenant.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named _azuredeploy.json_ creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. For example, if you create a management group deployment with the name **deployment1** in **centralus**, you can't later create another deployment with the name **deployment1** but a location of **westus**. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Deployment scopes

When deploying to a management group, you can deploy resources to:

* the target management group from the operation
* another management group in the tenant
* subscriptions in the management group
* resource groups in the management group
* the tenant for the resource group

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to target management group

Resources defined within the resources section of the template are applied to the management group from the deployment command.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/default-mg.json" highlight="5":::

### Scope to another management group

To target another management group, add a nested deployment and specify the `scope` property. Set the `scope` property to a value in the format `Microsoft.Management/managementGroups/<mg-name>`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/scope-mg.json" highlight="10,17,18,22":::

### Scope to subscription

You can also target subscriptions within a management group. The user deploying the template must have access to the specified scope.

To target a subscription within the management group, use a nested deployment and the `subscriptionId` property.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/mg-to-subscription.json" highlight="9,10,18":::

### Scope to resource group

You can also target resource groups within the management group. The user deploying the template must have access to the specified scope.

To target a resource group within the management group, use a nested deployment. Set the `subscriptionId` and `resourceGroup` properties. Don't set a location for the nested deployment because it's deployed in the location of the resource group.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/mg-to-resource-group.json" highlight="9,10,18":::

To use a management group deployment for creating a resource group within a subscription and deploying a storage account to that resource group, see [Deploy to subscription and resource group](#deploy-to-subscription-and-resource-group).

### Scope to tenant

To create resources at the tenant, set the `scope` to `/`. The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

To use a nested deployment, set `scope` and `location`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/management-group-to-tenant.json" highlight="9,10,14":::

Or, you can set the scope to `/` for some resource types, like management groups. Creating a new management group is described in the next section.

## Management group

To create a management group in a management group deployment, you must set the scope to `/` for the management group.

The following example creates a new management group in the root management group.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/management-group-create-mg.json" highlight="12,15":::

The next example creates a new management group in the management group specified as the parent. Notice that the scope is set to `/`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mgName": {
      "type": "string",
      "defaultValue": "[concat('mg-', uniqueString(newGuid()))]"
    },
    "parentMG": {
      "type": "string"
    }
  },
  "resources": [
    {
      "name": "[parameters('mgName')]",
      "type": "Microsoft.Management/managementGroups",
      "apiVersion": "2021-04-01",
      "scope": "/",
      "location": "eastus",
      "properties": {
        "details": {
          "parent": {
            "id": "[tenantResourceId('Microsoft.Management/managementGroups', parameters('parentMG'))]"
          }
        }
      }
    }
  ],
  "outputs": {
    "output": {
      "type": "string",
      "value": "[parameters('mgName')]"
    }
  }
}
```

## Subscriptions

To use an ARM template to create a new Azure subscription in a management group, see:

* [Programmatically create Azure Enterprise Agreement subscriptions](../../cost-management-billing/manage/programmatically-create-subscription-enterprise-agreement.md)
* [Programmatically create Azure subscriptions for a Microsoft Customer Agreement](../../cost-management-billing/manage/programmatically-create-subscription-microsoft-customer-agreement.md)
* [Programmatically create Azure subscriptions for a Microsoft Partner Agreement](../../cost-management-billing/manage/programmatically-create-subscription-microsoft-partner-agreement.md)

To deploy a template that moves an existing Azure subscription to a new management group, see [Move subscriptions in ARM template](../../governance/management-groups/manage.md#move-subscriptions-in-arm-template)

## Azure Policy

Custom policy definitions that are deployed to the management group are extensions of the management group. To get the ID of a custom policy definition, use the [extensionResourceId()](template-functions-resource.md#extensionresourceid) function. Built-in policy definitions are tenant level resources. To get the ID of a built-in policy definition, use the [tenantResourceId()](template-functions-resource.md#tenantresourceid) function.

The following example shows how to [define](../../governance/policy/concepts/definition-structure.md) a policy at the management group level, and assign it.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "targetMG": {
      "type": "string",
      "metadata": {
        "description": "Target Management Group"
      }
    },
    "allowedLocations": {
      "type": "array",
      "defaultValue": [
        "australiaeast",
        "australiasoutheast",
        "australiacentral"
      ],
      "metadata": {
        "description": "An array of the allowed locations, all other locations will be denied by the created policy."
      }
    }
  },
  "variables": {
    "mgScope": "[tenantResourceId('Microsoft.Management/managementGroups', parameters('targetMG'))]",
    "policyDefinition": "LocationRestriction"
  },
  "resources": [
    {
      "type": "Microsoft.Authorization/policyDefinitions",
      "name": "[variables('policyDefinition')]",
      "apiVersion": "2020-09-01",
      "properties": {
        "policyType": "Custom",
        "mode": "All",
        "parameters": {
        },
        "policyRule": {
          "if": {
            "not": {
              "field": "location",
              "in": "[parameters('allowedLocations')]"
            }
          },
          "then": {
            "effect": "deny"
          }
        }
      }
    },
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "name": "location-lock",
      "apiVersion": "2020-09-01",
      "dependsOn": [
        "[variables('policyDefinition')]"
      ],
      "properties": {
        "scope": "[variables('mgScope')]",
        "policyDefinitionId": "[extensionResourceId(variables('mgScope'), 'Microsoft.Authorization/policyDefinitions', variables('policyDefinition'))]"
      }
    }
  ]
}
```

## Deploy to subscription and resource group

From a management group level deployment, you can target a subscription within the management group. The following example creates a resource group within a subscription and deploys a storage account to that resource group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "nestedsubId": {
      "type": "string"
    },
    "nestedRG": {
      "type": "string"
    },
    "storageAccountName": {
      "type": "string"
    },
    "nestedLocation": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedSub",
      "location": "[parameters('nestedLocation')]",
      "subscriptionId": "[parameters('nestedSubId')]",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
          },
          "variables": {
          },
          "resources": [
            {
              "type": "Microsoft.Resources/resourceGroups",
              "apiVersion": "2021-04-01",
              "name": "[parameters('nestedRG')]",
              "location": "[parameters('nestedLocation')]"
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedRG",
      "subscriptionId": "[parameters('nestedSubId')]",
      "resourceGroup": "[parameters('nestedRG')]",
      "dependsOn": [
        "nestedSub"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2021-04-01",
              "name": "[parameters('storageAccountName')]",
              "location": "[parameters('nestedLocation')]",
              "kind": "StorageV2",
              "sku": {
                "name": "Standard_LRS"
              }
            }
          ]
        }
      }
    }
  ]
}
```

## Next steps

* To learn about assigning roles, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).
* For an example of deploying workspace settings for Microsoft Defender for Cloud, see [deployASCwithWorkspaceSettings.json](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/deployASCwithWorkspaceSettings.json).
* You can also deploy templates at [subscription level](deploy-to-subscription.md) and [tenant level](deploy-to-tenant.md).
