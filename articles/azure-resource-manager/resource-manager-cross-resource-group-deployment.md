---
title: Deploy Azure resources to multiple subscription and resource groups | Microsoft Docs
description: Shows how to target more than one Azure subscription and resource group during deployment.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/01/2017
ms.author: tomfitz

---

# Deploy Azure resources to more than one subscription or resource group

Typically, you deploy all the resources in your template to a single resource group. However, there are scenarios where you want to deploy a set of resources together but place them in different resource groups or subscriptions. For example, you may want to deploy the backup virtual machine for Azure Site Recovery to a separate resource group and location. Resource Manager enables you to use nested templates to target different subscriptions and resource groups than the subscription and resource group used for the parent template.

The resource group is the lifecycle container for the application and its collection of resources. You create the resource group outside of the template, and specify the resource group to target during deployment. For an introduction to resource groups, see [Azure Resource Manager overview](resource-group-overview.md).

## Specify a subscription and resource group

To target a different resource, you must use a nested or linked template during deployment. The `Microsoft.Resources/deployments` resource type provides parameters for `subscriptionId` and `resourceGroup`. These properties enable you to specify a different subscription and resource group for the nested deployment. All the resource groups must exist before running the deployment. If you do not specify either the subscription ID or resource group, the subscription and resource group from the parent template is used.

The following example deploys two storage accounts - one in the resource group specified during deployment, and one in a resource group specified in the `secondResourceGroup` parameter:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storagePrefix": {
            "type": "string",
            "maxLength": 11
        },
        "secondResourceGroup": {
            "type": "string"
        },
        "secondSubscriptionID": {
            "type": "string",
            "defaultValue": ""
        },
        "secondStorageLocation": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "variables": {
        "firstStorageName": "[concat(parameters('storagePrefix'), uniqueString(resourceGroup().id))]",
        "secondStorageName": "[concat(parameters('storagePrefix'), uniqueString(parameters('secondSubscriptionID'), parameters('secondResourceGroup')))]"
    },
    "resources": [
        {
            "apiVersion": "2017-05-10",
            "name": "nestedTemplate",
            "type": "Microsoft.Resources/deployments",
            "resourceGroup": "[parameters('secondResourceGroup')]",
            "subscriptionId": "[parameters('secondSubscriptionID')]",
            "properties": {
                "mode": "Incremental",
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "parameters": {},
                    "variables": {},
                    "resources": [
                        {
                            "type": "Microsoft.Storage/storageAccounts",
                            "name": "[variables('secondStorageName')]",
                            "apiVersion": "2017-06-01",
                            "location": "[parameters('secondStorageLocation')]",
                            "sku":{
                                "name": "Standard_LRS"
                            },
                            "kind": "Storage",
                            "properties": {
                            }
                        }
                    ]
                },
                "parameters": {}
            }
        },
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('firstStorageName')]",
            "apiVersion": "2017-06-01",
            "location": "[resourceGroup().location]",
            "sku":{
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {
            }
        }
    ]
}
```

If you set `resourceGroup` to the name of a resource group that does not exist, the deployment fails.

## Deploy the template

To deploy the example template, use a release of Azure PowerShell or Azure CLI from May 2017 or later. For these examples, use the [cross subscription template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/crosssubscription.json) in GitHub.

### Two resource groups in the same subscription

For PowerShell, to deploy two storage accounts to two resource groups in the same subscription, use:

```powershell
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

New-AzureRmResourceGroup -Name $firstRG -Location southcentralus
New-AzureRmResourceGroup -Name $secondRG -Location eastus

New-AzureRmResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus
```

For Azure CLI, to deploy two storage accounts to two resource groups in the same subscription, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

az group create --name $firstRG --location southcentralus
az group create --name $secondRG --location eastus
az group deployment create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=tfstorage secondResourceGroup=$secondRG secondStorageLocation=eastus
```

After deployment completes, you see two resource groups. Each resource group contains a storage account.

### Two resource groups in different subscriptions

For PowerShell, to deploy two storage accounts to two subscriptions, use:

```powershell
$firstRG = "primarygroup"
$secondRG = "secondarygroup"

$firstSub = "<first-subscription-id>"
$secondSub = "<second-subscription-id>"

Select-AzureRmSubscription -Subscription $secondSub
New-AzureRmResourceGroup -Name $secondRG -Location eastus

Select-AzureRmSubscription -Subscription $firstSub
New-AzureRmResourceGroup -Name $firstRG -Location southcentralus

New-AzureRmResourceGroupDeployment `
  -ResourceGroupName $firstRG `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json `
  -storagePrefix storage `
  -secondResourceGroup $secondRG `
  -secondStorageLocation eastus `
  -secondSubscriptionID $secondSub
```

For Azure CLI, to deploy two storage accounts to two subscriptions, use:

```azurecli-interactive
firstRG="primarygroup"
secondRG="secondarygroup"

firstSub="<first-subscription-id>"
secondSub="<second-subscription-id>"

az account set --subscription $secondSub
az group create --name $secondRG --location eastus

az account set --subscription $firstSub
az group create --name $firstRG --location southcentralus

az group deployment create \
  --name ExampleDeployment \
  --resource-group $firstRG \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crosssubscription.json \
  --parameters storagePrefix=storage secondResourceGroup=$secondRG secondStorageLocation=eastus secondSubscriptionID=$secondSub
```

## Use the resourceGroup() function

For cross resource group deployments, the [resourceGroup() function](resource-group-template-functions-resource.md#resourcegroup) resolves differently based on how you specify the nested template. 

If you embed one template within another template, resourceGroup() in the nested template resolves to the parent resource group. An embedded template uses the following format:

```json
"apiVersion": "2017-05-10",
"name": "embeddedTemplate",
"type": "Microsoft.Resources/deployments",
"resourceGroup": "crossResourceGroupDeployment",
"properties": {
    "mode": "Incremental",
    "template": {
        ...
        resourceGroup() refers to parent resource group
    }
}
```

If you link to a separate template, resourceGroup() in the linked template resolves to the nested resource group. A linked template uses the following format:

```json
"apiVersion": "2017-05-10",
"name": "linkedTemplate",
"type": "Microsoft.Resources/deployments",
"resourceGroup": "crossResourceGroupDeployment",
"properties": {
    "mode": "Incremental",
    "templateLink": {
        ...
        resourceGroup() in linked template refers to linked resource group
    }
}
```

To test the different ways `resourceGroup()` resolves, deploy an [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/crossresourcegroupproperties.json) that returns the resource group object for the parent template, inline template, and linked template. The parent and inline template both resolve to the same resource group. The linked template resolves to the linked resource group.

For PowerShell, use:

```powershell
New-AzureRmResourceGroup -Name parentGroup -Location southcentralus
New-AzureRmResourceGroup -Name inlineGroup -Location southcentralus
New-AzureRmResourceGroup -Name linkedGroup -Location southcentralus

New-AzureRmResourceGroupDeployment `
  -ResourceGroupName parentGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crossresourcegroupproperties.json
```

For Azure CLI, use:

```azurecli-interactive
az group create --name parentGroup --location southcentralus
az group create --name inlineGroup --location southcentralus
az group create --name linkedGroup --location southcentralus

az group deployment create \
  --name ExampleDeployment \
  --resource-group parentGroup \
  --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/crossresourcegroupproperties.json 
```

## Next steps

* To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
* For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
