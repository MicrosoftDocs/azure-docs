---
title: Export Resource Manager template with Azure PowerShell | Microsoft Docs
description: Use Azure Resource Manager and Azure PowerShell to export a template from a resource group.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/01/2017
ms.author: tomfitz

---
# Export Azure Resource Manager templates with PowerShell

Resource Manager enables you to export a Resource Manager template from existing resources in your subscription. You can use that generated template to learn about the template syntax or to automate the redeployment of your solution as needed.

It is important to note that there are two different ways to export a template:

* You can export the actual template that you used for a deployment. The exported template includes all the parameters and variables exactly as they appeared in the original template. This approach is helpful when you need to retrieve a template.
* You can export a template that represents the current state of the resource group. The exported template is not based on any template that you used for deployment. Instead, it creates a template that is a snapshot of the resource group. The exported template has many hard-coded values and probably not as many parameters as you would typically define. This approach is useful when you have modified the resource group. Now, you need to capture the resource group as a template.

This topic shows both approaches.

## Deploy a solution

To illustrate both approaches for exporting a template, let's start by deploying a solution to your subscription. If you already have a resource group in your subscription that you want to export, you do not have to deploy this solution. However, the remainder of this article refers to the template for this solution. The example script deploys a storage account.

```powershell
New-AzureRmResourceGroup -Name ExampleGroup -Location "South Central US"
New-AzureRmResourceGroupDeployment -ResourceGroupName ExampleGroup `
  -DeploymentName NewStorage
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```  

## Save template from deployment history

You can retrieve a template from your deployment history by using the [Save-​Azure​Rm​Resource​Group​Deployment​Template](/powershell/module/azurerm.resources/save-azurermresourcegroupdeploymenttemplate) command. The following example saves the template that you previously deploy:

```powershell
Save-AzureRmResourceGroupDeploymentTemplate -ResourceGroupName ExampleGroup -DeploymentName NewStorage
```

It returns the location of the template.

```powershell
Path
----
C:\Users\exampleuser\NewStorage.json
```

Open the file, and notice that it is the exact template you used for deployment. The parameters and variables match the template from GitHub. You can redeploy this template.

## Export resource group as template

Instead of retrieving a template from the deployment history, you can retrieve a template that represents the current state of a resource group by using the [Export-​Azure​Rm​Resource​Group](/powershell/module/azurerm.resources/export-azurermresourcegroup) command. You use this command when you have made many changes to your resource group and no existing template represents all the changes.

```powershell
Export-AzureRmResourceGroup -ResourceGroupName ExampleGroup
```

It returns the location of the template.

```powershell
Path
----
C:\Users\exampleuser\ExampleGroup.json
```

Open the file, and notice that it is different than the template in GitHub. It has different parameters and no variables. The storage SKU and location are hard-coded to values. The following example shows the exported template, but your template has a slightly different parameter name:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccounts_nf3mvst4nqb36standardsa_name": {
      "defaultValue": null,
      "type": "String"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "sku": {
        "name": "Standard_LRS",
        "tier": "Standard"
      },
      "kind": "Storage",
      "name": "[parameters('storageAccounts_nf3mvst4nqb36standardsa_name')]",
      "apiVersion": "2016-01-01",
      "location": "southcentralus",
      "tags": {},
      "properties": {},
      "dependsOn": []
    }
  ]
}
```

You can redeploy this template, but it requires guessing a unique name for the storage account. The name of your parameter is slightly different.

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName ExampleGroup `
  -TemplateFile C:\Users\exampleuser\ExampleGroup.json `
  -storageAccounts_nf3mvst4nqb36standardsa_name tfnewstorage0501
```

## Customize exported template

You can modify this template to make it easier to use and more flexible. To allow for more locations, change the location property to use the same location as the resource group:

```json
"location": "[resourceGroup().location]",
```

To avoid having to guess a uniques name for storage account, remove the parameter for the storage account name. Add a parameter for a storage name suffix, and a storage SKU:

```json
"parameters": {
    "storageSuffix": {
      "type": "string",
      "defaultValue": "standardsa"
    },
    "storageAccountType": {
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS"
      ],
      "type": "string",
      "metadata": {
        "description": "Storage Account type"
      }
    }
},
```

Add a variable that constructs the storage account name with the uniqueString function:

```json
"variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'standardsa')]"
  },
```

Set the name of the storage account to the variable:

```json
"name": "[variables('storageAccountName')]",
```

Set the SKU to the parameter:

```json
"sku": {
    "name": "[parameters('storageAccountType')]",
    "tier": "Standard"
},
```

Your template now looks like:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageSuffix": {
      "type": "string",
      "defaultValue": "standardsa"
    },
    "storageAccountType": {
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS"
      ],
      "type": "string",
      "metadata": {
        "description": "Storage Account type"
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), parameters('storageSuffix'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "sku": {
        "name": "[parameters('storageAccountType')]",
        "tier": "Standard"
      },
      "kind": "Storage",
      "name": "[variables('storageAccountName')]",
      "apiVersion": "2016-01-01",
      "location": "[resourceGroup().location]",
      "tags": {},
      "properties": {},
      "dependsOn": []
    }
  ]
}
```

Redeploy the modified template.

## Next steps
* For information about using the portal to export a template, see [Export an Azure Resource Manager template from existing resources](resource-manager-export-template.md).
* To define parameters in template, see [Authoring templates](resource-group-authoring-templates.md#parameters).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](resource-manager-common-deployment-errors.md).
