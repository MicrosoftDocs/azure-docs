---
title: Tutorial - Deploy a local Azure Resource Manager template
description: Learn how to deploy an Azure Resource Manager template from your local computer.
ms.date: 10/27/2025
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Deploy a local Azure Resource Manager template

Learn how to deploy an Azure Resource Manager template (ARM template) from your local machine. It takes about **8 minutes** to complete.

This tutorial is the first of a series. As you progress through the series, you modularize the template by creating a linked template, store the linked template in a storage account, secure the linked template by using SAS token, and learn how to create a DevOps pipeline to deploy templates. This series focuses on template deployment. If you want to learn template development, see the [beginner tutorials](./template-tutorial-create-first-template.md).

## Get tools

Make sure you have the tools you need to deploy templates.

### Command-line deployment

To deploy the template, you need either Azure PowerShell or the Azure CLI. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Install the Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install the Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install the Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

After installing either Azure PowerShell or the Azure CLI, sign in for the first time. For help, see [Sign in - PowerShell](/powershell/azure/install-az-ps#sign-in) or [Sign in - Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in).

### Editor (Optional)

Templates are JSON files. To review or edit templates, you can use [Visual Studio Code](https://code.visualstudio.com/). 

## Review template

The template deploys a storage account, app service plan, and web app. If you're interested in creating the template, see [Quickstart templates tutorial](template-tutorial-quickstart-template.md). However, you don't need to create the template to complete this tutorial.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "projectName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 11,
      "metadata": {
        "description": "Specify a project name that is used to generate resource names."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify a location for the resources."
      }
    },
    "storageSKU": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_RAGRS",
        "Standard_ZRS",
        "Premium_LRS",
        "Premium_ZRS",
        "Standard_GZRS",
        "Standard_RAGZRS"
      ],
      "metadata": {
        "description": "Specify the storage account type."
      }
    },
    "linuxFxVersion": {
      "type": "string",
      "defaultValue": "php|7.0",
      "metadata": {
        "description": "Specify the Runtime stack of current web app"
      }
    }
  },
  "variables": {
    "storageAccountName": "[format('{0}{1}', parameters('projectName'), uniqueString(resourceGroup().id))]",
    "webAppName": "[format('{0}WebApp', parameters('projectName'))]",
    "appServicePlanName": "[format('{0}Plan', parameters('projectName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2025-06-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageSKU')]"
      },
      "kind": "StorageV2",
      "properties": {
        "supportsHttpsTrafficOnly": true
      }
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2025-03-01",
      "name": "[variables('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "B1",
        "tier": "Basic",
        "size": "B1",
        "family": "B",
        "capacity": 1
      },
      "kind": "linux",
      "properties": {
        "perSiteScaling": false,
        "reserved": true,
        "targetWorkerCount": 0,
        "targetWorkerSizeId": 0
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2025-03-01",
      "name": "[variables('webAppName')]",
      "location": "[parameters('location')]",
      "kind": "app",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
        "siteConfig": {
          "linuxFxVersion": "[parameters('linuxFxVersion')]"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]"
      ]
    }
  ],
  "outputs": {
    "storageEndpoint": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2023-01-01').primaryEndpoints]"
    }
  }
}
```

> [!IMPORTANT]
> Storage account names must be unique, between 3 and 24 characters in length, and use **numbers** and **lowercase** letters only. The sample template's `storageAccountName` variable combines the `projectName` parameter's maximum of 11 characters with a [uniqueString](./template-functions-string.md#uniquestring) value of 13 characters.

Save a copy of the template to your local computer with the _.json_ extension, for example, _azuredeploy.json_. You deploy this template later in the tutorial.

## Sign in to Azure

To start working with Azure PowerShell or the Azure CLI to deploy a template, sign in with your Azure credentials.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

---

If you have multiple Azure subscriptions, select the subscription you want to use. Replace `[SubscriptionID/SubscriptionName]` and the square brackets `[]` with your subscription information:

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzContext [SubscriptionID/SubscriptionName]
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az account set --subscription [SubscriptionID/SubscriptionName]
```

---

## Create resource group

When you deploy a template, you specify a resource group for the resources. Before running the deployment command, create the resource group with the Azure CLI or Azure PowerShell. To choose between Azure PowerShell and the Azure CLI, select the tabs in the following code section. The CLI examples in this article are written for the Bash shell.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource and resource group names"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroup `
  -Name $resourceGroupName `
  -Location "Central US"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter a project name that is used to generate resource and resource group names:"
read projectName
resourceGroupName="${projectName}rg"

az group create \
  --name $resourceGroupName \
  --location "Central US"
```

---

## Deploy template

Use one or both deployment options to deploy the template.

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$projectName = Read-Host -Prompt "Enter the same project name"
$templateFile = Read-Host -Prompt "Enter the template file path and file name"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroupDeployment `
  -Name DeployLocalTemplate `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile $templateFile `
  -projectName $projectName `
  -verbose
```

To learn more about deploying template by using Azure PowerShell, see [Deploy resources with ARM templates and Azure PowerShell](./deploy-powershell.md).

# [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter the same project name:"
read projectName
echo "Enter the template file path and file name:"
read templateFile
resourceGroupName="${projectName}rg"

az deployment group create \
  --name DeployLocalTemplate \
  --resource-group $resourceGroupName \
  --template-file $templateFile \
  --parameters projectName=$projectName \
  --verbose
```

To learn more about deploying template by using the Azure CLI, see [Deploy resources with ARM templates and Azure CLI](./deploy-cli.md).

---

## Clean up resources

To clean up the resources you deployed, delete the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a local template. In the next tutorial, you separate the template into a main template and a linked template. You also learn how to store and secure the linked template.

> [!div class="nextstepaction"]
> [Deploy a linked template](./deployment-tutorial-linked-template.md)
