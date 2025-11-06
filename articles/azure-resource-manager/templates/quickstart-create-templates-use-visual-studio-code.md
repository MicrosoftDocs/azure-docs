---
title: Create template - Visual Studio Code
description: Use Visual Studio Code to work on Azure Resource Manager templates (ARM templates).
ms.date: 07/23/2025
ms.topic: quickstart
ms.custom:
  - mode-ui
  - devx-track-arm-template
  - sfi-image-nochange
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.
---

# Quickstart: Create ARM templates with Visual Studio Code

In this Quickstart, you use Visual Studio Code to create Azure Resource Manager templates (ARM templates). For a tutorial that is more focused on syntax, see [Tutorial: Create and deploy your first ARM template](./template-tutorial-create-first-template.md).

> [!IMPORTANT]
> [Azure Resource Manager (ARM) Tools extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) is deprecated and will no longer be supported after October 1, 2025. For Bicep development, we recommend using the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). To learn more, see [Quickstart: Create Bicep files with Visual Studio Code](../bicep/quickstart-create-bicep-use-visual-studio-code.md). Note that "transient install" methods like GitHub Codespaces will continue to function even after deprecation. To manually install the extension, you can get it [here](https://github.com/microsoft/vscode-azurearmtools/releases/tag/v0.15.15)."

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

To complete this quickstart, you need [Visual Studio Code](https://code.visualstudio.com/). You also need either the [Azure CLI](/cli/azure/) or the [Azure PowerShell module](/powershell/azure/new-azureps-module-az) installed and authenticated.

## Create an ARM template

Create and open with Visual Studio Code a new file named *azuredeploy.json*.

Add the following JSON snippet to the file for scaffolding out an ARM template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [],
  "outputs": {}
}
```

The template has the following sections: `parameters`, `functions`, `variables`, `resources`, and `outputs`. Each section is currently empty.

## Add an Azure resource

Update the resources section with the following snippet to include a storage account.

```json
"resources": [{
  "name": "storageaccount1",
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2025-06-01",
  "tags": {
    "displayName": "storageaccount1"
  },
  "location": "[resourceGroup().location]",
  "kind": "StorageV2",
  "sku": {
    "name": "Premium_LRS",
    "tier": "Premium"
  }
}],
```

Use [ALT] + [SHIFT] + [F] to format the document for better readability.

## Add template parameters

Update the parameters section to include a parameter for the storage account name. 

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "metadata": {
      "description": "Storage account name"
    },
    "defaultValue": "[format('storage{0}', uniqueString(resourceGroup().id))]"
  }
},
```

Azure storage account names have a minimum length of three characters and a maximum of 24. Add both `minLength` and `maxLength` to the parameter and provide appropriate values.

```json
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Storage account name"
      },
      "defaultValue": "[format('storage{0}', uniqueString(resourceGroup().id))]",
      "minLength": 3,
      "maxLength": 24
    }
  },
```

Now, on the storage resource, update the name property to use the parameter. 

```json
  "resources": [
    {
      "name": "[parameters('storageAccountName')]",
      "type": "Microsoft.Storage/storageAccounts",
      ...
```

Upon completion, your template looks like:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Storage account name"
      },
      "defaultValue": "[format('storage{0}', uniqueString(resourceGroup().id))]",
      "minLength": 3,
      "maxLength": 24
    }
  },
  "functions": [],
  "variables": {},
  "resources": [
    {
      "name": "[parameters('storageAccountName')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "tags": {
        "displayName": "storageaccount1"
      },
      "location": "[resourceGroup().location]",
      "kind": "StorageV2",
      "sku": {
        "name": "Premium_LRS",
        "tier": "Premium"
      }
    }
  ],
  "outputs": {}
}
```

## Deploy the template

Open the integrated Visual Studio Code terminal using the `ctrl` + ```` ` ```` key combination and use either the Azure CLI or Azure PowerShell module to deploy the template.

# [CLI](#tab/CLI)

```azurecli
az group create --name arm-vscode --location eastus

az deployment group create --resource-group arm-vscode --template-file azuredeploy.json 
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name arm-vscode -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName arm-vscode -TemplateFile ./azuredeploy.json 
```

---

## Clean up resources

When you no longer need the Azure resources, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name arm-vscode
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name arm-vscode
```

---

## Next steps

> [!div class="nextstepaction"]
> [Beginner tutorials](./template-tutorial-create-first-template.md)
