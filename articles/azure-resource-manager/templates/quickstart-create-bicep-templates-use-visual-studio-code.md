---
title: Create Bicep templates - Visual Studio Code
description: Use Visual Studio Code and the Bicep extension to work on Azure Resource Manager templates (ARM templates) in Bicep.
author: mumian
ms.date: 02/23/2021
ms.topic: quickstart
ms.author: jgao

#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.

---

# Quickstart: Create ARM Bicep templates with Visual Studio Code

The Bicep extension for Visual Studio Code provide language support and resource autocompletion. These tools help create and validate Azure Resource Manager Bicep templates (ARM Bicep templates). In this quickstart, you use the extension to create a Bicep template from scratch. While doing so you experience the extensions capabilities such as ARM template snippets, validation, and completions.

To complete this quickstart, you need [Visual Studio Code](https://code.visualstudio.com/), with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) installed. You also need either the [Azure CLI](/cli/azure/?view=azure-cli-latest&preserve-view=true) or the [Azure PowerShell module](/powershell/azure/new-azureps-module-az?view=azps-3.7.0&preserve-view=true) installed and authenticated.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create an ARM template

Create and open with Visual Studio Code a new file named *azuredeploy.bicep*.

## Add an Azure resource

Add a basic storage account resource to the bicep file.

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: 'storageaccount1' // must be globally unique
  location: 'eastus'
  tags:{
    diplayName: 'storageaccount1'
  }
  sku: {
      name: 'Standard_LRS'
      tier: 'Standard'
  }
  kind: 'Storage'
}
```

## Completion and validation

One of the most powerful capabilities of the extension is its integration with Azure schemas. Azure schemas provide the extension with validation and resource-aware completion capabilities. Let's modify the storage account to see validation and completion in action.

First, update the storage account kind to an invalid value such as `megaStorage`. Notice that this action produces a warning indicating that `megaStorage` is not a valid value.

![Image showing an invalid storage configuration](./media/quickstart-create-bicep-templates-use-visual-studio-code/7.png)

To use the completion capabilities, remove `megaStorage`, place the cursor inside of the single quotes, and press `ctrl` + `space`. This action presents a completion list of valid values.

![Image showing extension auto-completion](./media/quickstart-create-bicep-templates-use-visual-studio-code/8.png)

## Add template parameters

Now create and use a parameter to specify the storage account name.

Add the following code to the beginning of the file:

```bicep
param storageAccountName string {
  metadata: {
    description: 'storage account name'
  }
  minLength: 3
  maxLength: 24
}
```

Azure storage account names have a minimum length of 3 characters and a maximum of 24. Use `minLength` and `maxLength` to provide appropriate values.

Now, on the storage resource, update the name property to use the parameter. To do so, remove the current storage resource name including the single quotes. press `ctrl` + `space`. Select the **storageAccountName** parameter from the list.

![Image showing auto-completion when using parameters in ARM template resources](./media/quickstart-create-bicep-templates-use-visual-studio-code/12.png)

## Deploy the template

Open the integrated Visual Studio Code terminal using the `ctrl` + ```` ` ```` key combination and use either the Azure CLI or Azure PowerShell module to deploy the template.

# [CLI](#tab/CLI)

```azurecli
az group create --name arm-vscode --location eastus

az deployment group create --resource-group arm-vscode --template-file azuredeploy.bicep --parameters azuredeploy.parameters.bicep
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name arm-vscode -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName arm-vscode -TemplateFile ./azuredeploy.bicep -storageAccountName mystore0223
```

---

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

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
