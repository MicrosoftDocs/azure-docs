---
title: Deploy resources to subscription
description: Describes how to create a resource group in an Azure Resource Manager template. It also shows how to deploy resources at the Azure subscription scope.
ms.topic: conceptual
ms.date: 10/20/2020
---

# Create resource groups and resources at the subscription level

To simplify the management of resources, you can use an Azure Resource Manager template (ARM template) to deploy resources at the level of your Azure subscription. For example, you can deploy [policies](../../governance/policy/overview.md) and [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) to your subscription, which applies them across your subscription. You can also create resource groups within the subscription and deploy resources to resource groups in the subscription.

> [!NOTE]
> You can deploy to 800 different resource groups in a subscription level deployment.

To deploy templates at the subscription level, use Azure CLI, PowerShell, REST API, or the portal.

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

For Azure role-based access control (Azure RBAC), use:

* [roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [roleDefinitions](/azure/templates/microsoft.authorization/roledefinitions)

For nested templates that deploy to resource groups, use:

* [deployments](/azure/templates/microsoft.resources/deployments)

For creating new resource groups, use:

* [resourceGroups](/azure/templates/microsoft.resources/resourcegroups)

For managing your subscription, use:

* [Advisor configurations](/azure/templates/microsoft.advisor/configurations)
* [budgets](/azure/templates/microsoft.consumption/budgets)
* [Change Analysis profile](/azure/templates/microsoft.changeanalysis/profile)
* [supportPlanTypes](/azure/templates/microsoft.addons/supportproviders/supportplantypes)
* [tags](/azure/templates/microsoft.resources/tags)

Other supported types include:

* [scopeAssignments](/azure/templates/microsoft.managednetwork/scopeassignments)
* [eventSubscriptions](/azure/templates/microsoft.eventgrid/eventsubscriptions)
* [peerAsns](/azure/templates/microsoft.peering/2019-09-01-preview/peerasns)

## Schema

The schema you use for subscription-level deployments is different than the schema for resource group deployments.

For templates, use:

```json
https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#
```

The schema for a parameter file is the same for all deployment scopes. For parameter files, use:

```json
https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#
```

## Deployment commands

The commands for subscription-level deployments are different than the commands for resource group deployments.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create). The following example deploys a template to create a resource group:

```azurecli-interactive
az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/emptyRG.json" \
  --parameters rgName=demoResourceGroup rgLocation=centralus
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzDeployment](/powershell/module/az.resources/new-azdeployment) or **New-AzSubscriptionDeployment**. The following example deploys a template to create a resource group:

```azurepowershell-interactive
New-AzSubscriptionDeployment `
  -Name demoSubDeployment `
  -Location centralus `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/emptyRG.json" `
  -rgName demoResourceGroup `
  -rgLocation centralus
```

---

For REST API, use [Deployments - Create At Subscription Scope](/rest/api/resources/deployments/createorupdateatsubscriptionscope).

## Deployment scopes

When deploying to a subscription, you can deploy resources to:

* the target subscription from the operation
* resource groups within the subscription
* the tenant for the subscription

You can't deploy to a subscription that is different than the target subscription. The user deploying the template must have access to the specified scope.

### Deploy to subscription

To deploy resources to the target subscription, add those resources to the resources section of the template.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/default-sub.json" highlight="5":::

For examples of deploying to the subscription, see [Create resource groups](#create-resource-groups) and [Assign policy definition](#assign-policy-definition).

### Deploy to resource group

To deploy resources to a resource group within the subscription, add a nested deployment and include the `resourceGroup` property. In the following example, the nested deployment targets a resource group named `rg2`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/sub-to-resource-group.json" highlight="9,13":::

For an example of deploying to a resource group, see [Create resource group and resources](#create-resource-group-and-resources).

### Deploy to tenant

You can create resources at the tenant by adding a nested deployment with the `scope` set to `/`. In the following example, the nested deployment is scoped to `/`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/sub-to-tenant.json" highlight="9,13":::

## Deployment location and name

For subscription level deployments, you must provide a location for the deployment. The location of the deployment is separate from the location of the resources you deploy. The deployment location specifies where to store deployment data.

You can provide a name for the deployment, or use the default deployment name. The default name is the name of the template file. For example, deploying a template named **azuredeploy.json** creates a default deployment name of **azuredeploy**.

For each deployment name, the location is immutable. You can't create a deployment in one location when there's an existing deployment with the same name in a different location. If you get the error code `InvalidDeploymentLocation`, either use a different name or the same location as the previous deployment for that name.

## Use template functions

For subscription-level deployments, there are some important considerations when using template functions:

* The [resourceGroup()](template-functions-resource.md#resourcegroup) function is **not** supported.
* The [reference()](template-functions-resource.md#reference) and [list()](template-functions-resource.md#list) functions are supported.
* Don't use [resourceId()](template-functions-resource.md#resourceid) to get the resource ID for resources that are deployed at subscription level. Instead, use the [subscriptionResourceId()](template-functions-resource.md#subscriptionresourceid) function.

  For example, to get the resource ID for a policy definition that is deployed to a subscription, use:

  ```json
  subscriptionResourceId('Microsoft.Authorization/roleDefinitions/', parameters('roleDefinition'))
  ```

  The returned resource ID has the following format:

  ```json
  /subscriptions/{subscriptionId}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
  ```

## Resource groups

### Create resource groups

To create a resource group in an ARM template, define a [Microsoft.Resources/resourceGroups](/azure/templates/microsoft.resources/allversions) resource with a name and location for the resource group.

The following template creates an empty resource group.

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
      "apiVersion": "2020-06-01",
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
      "apiVersion": "2020-06-01",
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

For information about resource iteration, see [Deploy more than one instance of a resource  in Azure Resource Manager Templates](./copy-resources.md), and [Tutorial: Create multiple resource instances with Resource Manager templates](./template-tutorial-create-multiple-instances.md).

### Create resource group and resources

To create the resource group and deploy resources to it, use a nested template. The nested template defines the resources to deploy to the resource group. Set the nested template as dependent on the resource group to make sure the resource group exists before deploying the resources. You can deploy to up to 800 resource groups.

The following example creates a resource group, and deploys a storage account to the resource group.

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
    "storageName": "[concat(parameters('storagePrefix'), uniqueString(subscription().id, parameters('rgName')))]"
  },
  "resources": [
    {
      "type": "Microsoft.Resources/resourceGroups",
      "apiVersion": "2020-06-01",
      "name": "[parameters('rgName')]",
      "location": "[parameters('rgLocation')]",
      "properties": {}
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-06-01",
      "name": "storageDeployment",
      "resourceGroup": "[parameters('rgName')]",
      "dependsOn": [
        "[resourceId('Microsoft.Resources/resourceGroups/', parameters('rgName'))]"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {},
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2019-06-01",
              "name": "[variables('storageName')]",
              "location": "[parameters('rgLocation')]",
              "sku": {
                "name": "Standard_LRS"
              },
              "kind": "StorageV2"
            }
          ],
          "outputs": {}
        }
      }
    }
  ],
  "outputs": {}
}
```

## Azure Policy

### Assign policy definition

The following example assigns an existing policy definition to the subscription. If the policy definition takes parameters, provide them as an object. If the policy definition doesn't take parameters, use the default empty object.

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
      "apiVersion": "2018-03-01",
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

You can [define](../../governance/policy/concepts/definition-structure.md) and assign a policy definition in the same template.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
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
    },
    {
      "type": "Microsoft.Authorization/policyAssignments",
      "apiVersion": "2018-05-01",
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

To learn about assigning roles, see [Add Azure role assignments using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

The following example creates a resource group, applies a lock to it, and assigns a role to a principal.

:::code language="json" source="~/quickstart-templates/subscription-deployments/create-rg-lock-role-assignment/azuredeploy.json":::

## Next steps

* For an example of deploying workspace settings for Azure Security Center, see [deployASCwithWorkspaceSettings.json](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/deployASCwithWorkspaceSettings.json).
* Sample templates can be found at [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/subscription-deployments).
* You can also deploy templates at [management group level](deploy-to-management-group.md) and [tenant level](deploy-to-tenant.md).
