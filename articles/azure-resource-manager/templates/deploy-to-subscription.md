---
title: Deploy resources to subscription
description: Describes how to create a resource group in an Azure Resource Manager template. It also shows how to deploy resources at the Azure subscription scope.
ms.topic: how-to
ms.date: 08/01/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
---

# Subscription deployments with ARM templates

To simplify the management of resources, you can use an Azure Resource Manager template (ARM template) to deploy resources at the level of your Azure subscription. For example, you can deploy [policies](../../governance/policy/overview.md) and [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) to your subscription, which applies them across your subscription. You can also create resource groups within the subscription and deploy resources to resource groups in the subscription.

> [!NOTE]
> You can deploy to 800 different resource groups in a subscription-level deployment.

To deploy templates at the subscription level, use Azure CLI, PowerShell, REST API, or the portal.

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [subscription deployments](../bicep/deploy-to-subscription.md).

## Supported resources

Not all resource types can be deployed to the subscription level. This section lists which resource types are supported.

For Azure Blueprints, use:

* [artifacts](/azure/templates/microsoft.blueprint/blueprints/artifacts)
* [blueprints](/azure/templates/microsoft.blueprint/blueprints)
* [blueprintAssignments](/azure/templates/microsoft.blueprint/blueprintassignments)
* [versions (Blueprints)](/azure/templates/microsoft.blueprint/blueprints/versions)

For Azure Policies, use:

* [policyAssignments](/azure/templates/microsoft.authorization/policyassignments)
* [policyDefinitions](/azure/templates/microsoft.authorization/policydefinitions)
* [policySetDefinitions](/azure/templates/microsoft.authorization/policysetdefinitions)
* [remediations](/azure/templates/microsoft.policyinsights/remediations)

For access control, use:

* [accessReviewScheduleDefinitions](/azure/templates/microsoft.authorization/accessreviewscheduledefinitions)
* [accessReviewScheduleSettings](/azure/templates/microsoft.authorization/accessreviewschedulesettings)
* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleAssignmentScheduleRequests](/azure/templates/microsoft.authorization/roleassignmentschedulerequests)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)
* [roleEligibilityScheduleRequests](/azure/templates/microsoft.authorization/roleeligibilityschedulerequests)
* [roleManagementPolicyAssignments](/azure/templates/microsoft.authorization/rolemanagementpolicyassignments)

For nested templates that deploy to resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For creating new resource groups, use:

* [resourceGroups](/azure/templates/microsoft.resources/resourcegroups)

For managing your subscription, use:

* [budgets](/azure/templates/microsoft.consumption/budgets)
* [configurations - Advisor ](/azure/templates/microsoft.advisor/configurations)
* [lineOfCredit](/azure/templates/microsoft.billing/billingaccounts/lineofcredit)
* [locks](/azure/templates/microsoft.authorization/locks)
* [profile - Change Analysis ](/azure/templates/microsoft.changeanalysis/profile)
* [supportPlanTypes](/azure/templates/microsoft.addons/supportproviders/supportplantypes)
* [tags](/azure/templates/microsoft.resources/tags)

For monitoring, use:

* [diagnosticSettings](/azure/templates/microsoft.insights/diagnosticsettings)
* [logprofiles](/azure/templates/microsoft.insights/logprofiles)

For security, use:

* [advancedThreatProtectionSettings](/azure/templates/microsoft.security/advancedthreatprotectionsettings)
* [alertsSuppressionRules](/azure/templates/microsoft.security/alertssuppressionrules)
* [assessmentMetadata](/azure/templates/microsoft.security/assessmentmetadata)
* [assessments](/azure/templates/microsoft.security/assessments)
* [autoProvisioningSettings](/azure/templates/microsoft.security/autoprovisioningsettings)
* [connectors](/azure/templates/microsoft.security/connectors)
* [deviceSecurityGroups](/azure/templates/microsoft.security/devicesecuritygroups)
* [ingestionSettings](/javascript/api/@azure/arm-security/ingestionsettings)
* [pricings](/azure/templates/microsoft.security/pricings)
* [securityContacts](/azure/templates/microsoft.security/securitycontacts)
* [settings](/azure/templates/microsoft.security/settings)
* [workspaceSettings](/azure/templates/microsoft.security/workspacesettings)

Other supported types include:

* [scopeAssignments](/azure/templates/microsoft.managednetwork/scopeassignments)
* [eventSubscriptions](/azure/templates/microsoft.eventgrid/eventsubscriptions)
* [peerAsns](/azure/templates/microsoft.peering/2019-09-01-preview/peerasns)

## Schema

The schema you use for subscription-level deployments is different than the schema for resource group deployments.

For templates, use:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
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

To deploy to a subscription, use the subscription-level deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create). The following example deploys a template to create a resource group:

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/emptyrg.json" \
  --parameters rgName=demoResourceGroup rgLocation=centralus
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzDeployment](/powershell/module/az.resources/new-azdeployment) or its alias `New-AzSubscriptionDeployment`. The following example deploys a template to create a resource group:

```azurepowershell-interactive
New-AzSubscriptionDeployment `
  -Name demoSubDeployment `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/emptyrg.json" `
  -rgName demoResourceGroup `
  -rgLocation centralus
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

For subscription-level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data. [Management group](deploy-to-management-group.md) and [tenant](deploy-to-tenant.md) deployments also require a location. For [resource group](deploy-to-resource-group.md) deployments, the location of the resource group is used to store the deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named _azuredeploy.json_ creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. For example, if you create a subscription deployment with the name **deployment1** in **centralus**, you can't later create another deployment with the name **deployment1** but a location of **westus**. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Deployment scopes

When deploying to a subscription, you can deploy resources to:

* the target subscription from the operation
* any subscription in the tenant
* resource groups within the subscription or other subscriptions
* the tenant for the subscription

[!INCLUDE [Scope transitions](../../../includes/resource-manager-scope-transition.md)]

An [extension resource](scope-extension-resources.md) can be scoped to a target that's different from the deployment target.

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to target subscription

To deploy resources to the target subscription, add those resources to the **resources** section of the template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    subscription-level-resources
  ],
  "outputs": {}
}
```

For examples of deploying to the subscription, see [Create resource groups](#create-resource-groups) and [Assign policy definition](#assign-policy-definition).

### Scope to other subscription

To deploy resources to a subscription that's different than the subscription from the operation, add a nested deployment. Set the `subscriptionId` property to the ID of the subscription to which you want to deploy. Set the `location` property for the nested deployment:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2025-04-01",
      "name": "nestedDeployment",
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "location": "westus",
      "properties": {
        "mode": "Incremental",
        "template": {
          subscription-resources
        }
      }
    }
  ],
  "outputs": {}
}
```

### Scope to resource group

To deploy resources to a resource group within the subscription, add a nested deployment and include the `resourceGroup` property. In the following example, the nested deployment targets a resource group named `demoResourceGroup`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2025-04-01",
      "name": "nestedDeployment",
      "resourceGroup": "demoResourceGroup",
      "properties": {
        "mode": "Incremental",
        "template": {
          resource-group-resources
        }
      }
    }
  ],
  "outputs": {}
}
```

For an example of deploying to a resource group, see [Create resource group and resources](#create-resource-group-and-resources).

### Scope to tenant

To create resources at the tenant, set the `scope` to `/`. The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

To use a nested deployment, set `scope` and `location`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2025-04-01",
      "name": "nestedDeployment",
      "location": "centralus",
      "scope": "/",
      "properties": {
        "mode": "Incremental",
        "template": {
          tenant-resources
        }
      }
    }
  ],
  "outputs": {}
}
```

Or, you can set the scope to `/` for some resource types like management groups:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "mgName": {
      "type": "string",
      "defaultValue": "[concat('mg-', uniqueString(newGuid()))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Management/managementGroups",
      "apiVersion": "2024-02-01-preview",
      "name": "[parameters('mgName')]",
      "scope": "/",
      "location": "eastus",
      "properties": {}
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

For more information, see [Management group](deploy-to-management-group.md#management-group).

## Resource groups

### Create resource groups

To create a resource group in an ARM template, define a [Microsoft.Resources/resourceGroups](/azure/templates/microsoft.resources/allversions) resource with a name and location for the resource group.

The following template creates an empty resource group:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "rgName": {
      "type": "string"
    },
    "rgLocation": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2025-04-01",
      "name": "[parameters('rgName')]",
      "location": "[parameters('rgLocation')]",
      "properties": {}
    }
  ],
  "outputs": {}
}
```

Use the [copy element](copy-resources.md) with resource groups to create more than one resource group.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "rgNamePrefix": {
      "type": "string"
    },
    "rgLocation": {
      "type": "string"
    },
    "instanceCount": {
      "type": "int"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2025-04-01",
      "location": "[parameters('rgLocation')]",
      "name": "[concat(parameters('rgNamePrefix'), copyIndex())]",
      "copy": {
        "name": "rgCopy",
        "count": "[parameters('instanceCount')]"
      },
      "properties": {}
    }
  ],
  "outputs": {}
}
```

For information about resource iteration, see [Resource iteration in ARM templates](./copy-resources.md), and [Tutorial: Create multiple resource instances with ARM templates](./template-tutorial-create-multiple-instances.md).

### Create resource group and resources

To create the resource group and deploy resources to it, use a nested template. The nested template defines the resources to deploy to the resource group. Set the nested template as dependent on the resource group to make sure the resource group exists before deploying the resources. You can deploy to up to 800 resource groups.

The following example creates a resource group and deploys a storage account to the resource group:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "rgName": {
      "type": "string"
    },
    "rgLocation": {
      "type": "string"
    },
    "storagePrefix": {
      "type": "string",
      "maxLength": 11
    }
  },
  "variables": {
    "storageName": "[format('{0}{1}', parameters('storagePrefix'), uniqueString(subscription().id, parameters('rgName')))]"
  },
  "resources": [
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2025-04-01",
      "name": "[parameters('rgName')]",
      "location": "[parameters('rgLocation')]",
      "properties": {}
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2025-04-01",
      "name": "storageDeployment",
      "resourceGroup": "[parameters('rgName')]",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2025-06-01",
              "name": "[variables('storageName')]",
              "location": "[parameters('rgLocation')]",
              "sku": {
                "name": "Standard_LRS"
              },
              "kind": "StorageV2"
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Resources/resourceGroups/', parameters('rgName'))]"
      ]
    }
  ]
}
```

## Azure Policy

### Assign policy definition

The following example assigns an existing policy definition to the subscription. If the policy definition takes parameters, provide them as an object. If the policy definition doesn't take parameters, use the default empty object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
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
      "apiVersion": "2025-03-01",
      "name": "[parameters('policyName')]",
      "properties": {
        "scope": "[subscription().id]",
        "policyDefinitionId": "[parameters('policyDefinitionID')]",
        "parameters": "[parameters('policyParameters')]"
      }
    }
  ]
}
```

To deploy this template with Azure CLI, use:

```azurecli-interactive
# Built-in policy definition that accepts parameters
definition=$(az policy definition list --query "[?displayName=='Allowed locations'].id" --output tsv)

az deployment sub create \
  --name demoDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/policyassign.json" \
  --parameters policyDefinitionID=$definition policyName=setLocation policyParameters="{'listOfAllowedLocations': {'value': ['westus']} }"
```

To deploy this template with PowerShell, use:

```azurepowershell-interactive
$definition = Get-AzPolicyDefinition | Where-Object { $_.Properties.DisplayName -eq 'Allowed locations' }

$locations = @("westus", "westus2")
$policyParams =@{listOfAllowedLocations = @{ value = $locations}}

New-AzSubscriptionDeployment `
  -Name policyassign `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/policyassign.json" `
  -policyDefinitionID $definition.PolicyDefinitionId `
  -policyName setLocation `
  -policyParameters $policyParams
```

### Create and assign policy definitions

You can [define](../../governance/policy/concepts/definition-structure.md) and assign a policy definition in the same template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Authorization/policyDefinitions",
      "apiVersion": "2025-03-01",
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
    },
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "apiVersion": "2025-03-01",
      "name": "location-lock",
      "dependsOn": [
        "locationpolicy"
      ],
      "properties": {
        "scope": "[subscription().id]",
        "policyDefinitionId": "[subscriptionResourceId('Microsoft.Authorization/policyDefinitions', 'locationpolicy')]"
      }
    }
  ]
}
```

To create the policy definition in your subscription, and assign it to the subscription, use the following CLI command:

```azurecli
az deployment sub create \
  --name demoDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/policydefineandassign.json"
```

To deploy this template with PowerShell, use:

```azurepowershell
New-AzSubscriptionDeployment `
  -Name definePolicy `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/policydefineandassign.json"
```

## Azure Blueprints

### Create blueprint definition

You can [create](../../governance/blueprints/tutorials/create-from-sample.md) a blueprint definition from a template.

:::code language="json" source="~/quickstart-templates/subscription-deployments/blueprints-new-blueprint/azuredeploy.json":::

To create the blueprint definition in your subscription, use the following CLI command:

```azurecli
az deployment sub create \
  --name demoDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/subscription-deployments/blueprints-new-blueprint/azuredeploy.json"
```

To deploy this template with PowerShell, use:

```azurepowershell
New-AzSubscriptionDeployment `
  -Name demoDeployment `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/subscription-deployments/blueprints-new-blueprint/azuredeploy.json"
```

## Access control

To learn about assigning roles, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

The following example creates a resource group, applies a lock to it, and assigns a role to a principal:

:::code language="json" source="~/quickstart-templates/subscription-deployments/create-rg-lock-role-assignment/azuredeploy.json":::

## Next steps

* For an example of deploying workspace settings for Microsoft Defender for Cloud, see [_deployASCwithWorkspaceSettings.json_](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/deployASCwithWorkspaceSettings.json).
* Sample templates can be found at [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/subscription-deployments).
* You can also deploy templates at the [management-group level](deploy-to-management-group.md) and [tenant level](deploy-to-tenant.md).
