---
title: Deploy resources to resource groups
description: Describes how to deploy resources in an Azure Resource Manager template. It shows how to target more than one resource group.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/05/2022
---

# Resource group deployments with ARM templates

This article describes how to scope your deployment to a resource group. You use an Azure Resource Manager template (ARM template) for the deployment. The article also shows how to expand the scope beyond the resource group in the deployment operation.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [resource group deployments](../bicep/deploy-to-resource-group.md).

## Supported resources

Most resources can be deployed to a resource group. For a list of available resources, see [ARM template reference](/azure/templates).

## Schema

For templates, use the following schema:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  ...
}
```

For parameter files, use:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  ...
}
```

## Deployment commands

To deploy to a resource group, use the resource group deployment commands.

# [Azure CLI](#tab/azure-cli)

For Azure CLI, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create). The following example deploys a template to create a resource group. The resource group you specify in the `--resource-group` parameter is the **target resource group**.

```azurecli-interactive
az deployment group create \
  --name demoRGDeployment \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json" \
  --parameters storageAccountType=Standard_GRS
```

# [PowerShell](#tab/azure-powershell)

For the PowerShell deployment command, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment). The following example deploys a template to create a resource group. The resource group you specify in the `-ResourceGroupName` parameter is the **target resource group**.

```azurepowershell-interactive
New-AzResourceGroupDeployment `
  -Name demoRGDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json `
  -storageAccountType Standard_GRS
```

---

For more detailed information about deployment commands and options for deploying ARM templates, see:

* [Deploy resources with ARM templates and Azure portal](deploy-portal.md)
* [Deploy resources with ARM templates and Azure CLI](deploy-cli.md)
* [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md)
* [Deploy resources with ARM templates and Azure Resource Manager REST API](deploy-rest.md)
* [Use a deployment button to deploy templates from GitHub repository](deploy-to-azure-button.md)
* [Deploy ARM templates from Cloud Shell](deploy-cloud-shell.md)

## Deployment scopes

When deploying to a resource group, you can deploy resources to:

* the target resource group from the operation
* other resource groups in the same subscription or other subscriptions
* any subscription in the tenant
* the tenant for the resource group

An [extension resource](scope-extension-resources.md) can be scoped to a target that is different than the deployment target.

The user deploying the template must have access to the specified scope.

This section shows how to specify different scopes. You can combine these different scopes in a single template.

### Scope to target resource group

To deploy resources to the target resource, add those resources to the resources section of the template.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/default-rg.json" highlight="5":::

For an example template, see [Deploy to target resource group](#deploy-to-target-resource-group).

### Scope to resource group in same subscription

To deploy resources to a different resource group in the same subscription, add a nested deployment and include the `resourceGroup` property. If you don't specify the subscription ID or resource group, the subscription and resource group from the parent template are used. All the resource groups must exist before running the deployment.

In the following example, the nested deployment targets a resource group named `demoResourceGroup`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/same-sub-to-resource-group.json" highlight="9,13":::

For an example template, see [Deploy to multiple resource groups](#deploy-to-multiple-resource-groups).

### Scope to resource group in different subscription

To deploy resources to a resource group in a different subscription, add a nested deployment and include the `subscriptionId` and `resourceGroup` properties. In the following example, the nested deployment targets a resource group named `demoResourceGroup`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/different-sub-to-resource-group.json" highlight="9,10,14":::

For an example template, see [Deploy to multiple resource groups](#deploy-to-multiple-resource-groups).

### Scope to subscription

To deploy resources to a subscription, add a nested deployment and include the `subscriptionId` property. The subscription can be the subscription for the target resource group, or any other subscription in the tenant. Also, set the `location` property for the nested deployment.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/resource-group-to-subscription.json" highlight="9,10,14":::

For an example template, see [Create resource group](#create-resource-group).

### Scope to tenant

To create resources at the tenant, set the `scope` to `/`. The user deploying the template must have the [required access to deploy at the tenant](deploy-to-tenant.md#required-access).

To use a nested deployment, set `scope` and `location`.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/resource-group-to-tenant.json" highlight="9,10,14":::

Or, you can set the scope to `/` for some resource types, like management groups.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/scope/resource-group-create-mg.json" highlight="12,15":::

For more information, see [Management group](deploy-to-management-group.md#management-group).

## Deploy to target resource group

To deploy resources in the target resource group, define those resources in the `resources` section of the template. The following template creates a storage account in the resource group that is specified in the deployment operation.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-outputs/azuredeploy.json":::

## Deploy to multiple resource groups

You can deploy to more than one resource group in a single ARM template. To target a resource group that is different than the one for parent template, use a [nested or linked template](linked-templates.md). Within the deployment resource type, specify values for the subscription ID and resource group that you want the nested template to deploy to. The resource groups can exist in different subscriptions.

> [!NOTE]
> You can deploy to **800 resource groups** in a single deployment. Typically, this limitation means you can deploy to one resource group specified for the parent template, and up to 799 resource groups in nested or linked deployments. However, if your parent template contains only nested or linked templates and does not itself deploy any resources, then you can include up to 800 resource groups in nested or linked deployments.

The following example deploys two storage accounts. The first storage account is deployed to the resource group specified in the deployment operation. The second storage account is deployed to the resource group specified in the `secondResourceGroup` and `secondSubscriptionID` parameters:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/crosssubscription.json":::

If you set `resourceGroup` to the name of a resource group that doesn't exist, the deployment fails.

To test the preceding template and see the results, use PowerShell or Azure CLI.

# [PowerShell](#tab/azure-powershell)

To deploy two storage accounts to two resource groups in the **same subscription**, use:

```azurepowershell-interactive
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

New-AzResourceGroup -Name $firstRG -Location southcentralus
New-AzResourceGroup -Name $secondRG -Location eastus

New-AzResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus
```

To deploy two storage accounts to **two subscriptions**, use:

```azurepowershell-interactive
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

$firstSub = "<first-subscription-id>"
$secondSub = "<second-subscription-id>"

Set-AzContext -Subscription $secondSub
New-AzResourceGroup -Name $secondRG -Location eastus

Set-AzContext -Subscription $firstSub
New-AzResourceGroup -Name $firstRG -Location southcentralus

New-AzResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus `
  -secondSubscriptionID $secondSub
```

# [Azure CLI](#tab/azure-cli)

To deploy two storage accounts to two resource groups in the **same subscription**, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

az group create --name $firstRG --location southcentralus
az group create --name $secondRG --location eastus
az deployment group create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=tfstorage secondResourceGroup=$secondRG secondStorageLocation=eastus
```

To deploy two storage accounts to **two subscriptions**, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

firstSub="<first-subscription-id>"
secondSub="<second-subscription-id>"

az account set --subscription $secondSub
az group create --name $secondRG --location eastus

az account set --subscription $firstSub
az group create --name $firstRG --location southcentralus

az deployment group create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=storage secondResourceGroup=$secondRG secondStorageLocation=eastus secondSubscriptionID=$secondSub
```

---

## Create resource group

From a resource group deployment, you can switch to the level of a subscription and create a resource group. The following template deploys a storage account to the target resource group, and creates a new resource group in the specified subscription.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "type": "string",
      "maxLength": 11
    },
    "newResourceGroupName": {
      "type": "string"
    },
    "nestedSubscriptionID": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "storageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[variables('storageName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "demoSubDeployment",
      "location": "westus",
      "subscriptionId": "[parameters('nestedSubscriptionID')]",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {},
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.Resources/resourceGroups",
              "apiVersion": "2021-04-01",
              "name": "[parameters('newResourceGroupName')]",
              "location": "[parameters('location')]",
              "properties": {}
            }
          ],
          "outputs": {}
        }
      }
    }
  ]
}
```

## Next steps

* For an example of deploying workspace settings for Microsoft Defender for Cloud, see [deployASCwithWorkspaceSettings.json](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/deployASCwithWorkspaceSettings.json).
