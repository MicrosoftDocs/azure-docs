---
title: Troubleshoot ARM template JSON deployments
description: Learn how to troubleshoot Azure Resource Manager template (ARM template) JSON deployments.
ms.date: 04/05/2023
ms.topic: quickstart
ms.custom: mode-arm, devx-track-arm-template
---

# Quickstart: Troubleshoot ARM template JSON deployments

This quickstart describes how to troubleshoot Azure Resource Manager template (ARM template) JSON deployment errors. You'll set up a template with errors and learn how to fix the errors.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

There are three types of errors that are related to a deployment:

- **Validation errors** occur before a deployment begins and are caused by syntax errors in your file. A code editor like Visual Studio Code can identify these errors.
- **Preflight validation errors** occur when a deployment command is run but resources aren't deployed. These errors are found without starting the deployment. For example, if a parameter value is incorrect, the error is found in preflight validation.
- **Deployment errors** occur during the deployment process and can only be found by assessing the deployment's progress in your Azure environment.

All types of errors return an error code that you use to troubleshoot the deployment. Validation and preflight errors are shown in the activity log but don't appear in your deployment history.

## Prerequisites

To complete this quickstart, you need the following items:

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).

## Create a template with errors

Copy the following template and save it locally. You'll use this file to troubleshoot a validation error, a preflight error, and a deployment error. This quickstart assumes you've named the file _troubleshoot.json_ but you can use any name.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameterss": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ]
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "prefixName": {
      "type": "string"
    }
  },
  "variables": {
    "storageAccountName": "[concat(parameters('prefixName'), uniquestring(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountName": {
      "type": "string",
      "value": "[variables('storageAccountName')]"
    },
    "vnetResult": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.Network/virtualNetworks', 'doesnotexist'), '2021-03-01', 'Full')]"
    }
  }
}
```

## Fix validation error

Open the file in Visual Studio Code. The wavy line under `parameterss:` indicates an error. To see the validation error, hover over the error.

:::image type="content" source="media/quickstart-troubleshoot-arm-deployment/validation-error.png" alt-text="Screenshot of Visual Studio Code highlighting a template validation error with a red wavy line under the misspelled 'parameterss:' in the code.":::

You'll notice that `variables` and `resources` have errors for _undefined parameter reference_. To display the template's validation errors, select **View** > **Problems**.

:::image type="content" source="media/quickstart-troubleshoot-arm-deployment/validation-undefined-parameter.png" alt-text="Screenshot of Visual Studio Code showing the Problems tab listing undefined parameter reference errors for 'variables' and 'resources' sections.":::

All the errors are caused by the incorrect spelling of an element name.

```json
"parameterss": {
```

The error message states _Template validation failed: Could not find member 'parameterss' on object of type 'Template'. Path 'parameterss', line 4, position 16_.

The ARM template syntax for [parameters](../templates/syntax.md#parameters) shows that `parameters` is the correct element name.

To fix the validation error and _undefined parameter reference_ errors, correct the spelling and save the file.

```json
"parameters": {
```

## Fix preflight error

To create a preflight validation error, you'll use an incorrect value for the `prefixName` parameter.

This quickstart uses _troubleshootRG_ for the resource group name, but you can use any name.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name troubleshootRG --location westus
az deployment group create \
  --resource-group troubleshootRG \
  --template-file troubleshoot.json \
  --parameters prefixName=long!!StoragePrefix
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name troubleshootRG -Location westus
New-AzResourceGroupDeployment `
  -ResourceGroupName troubleshootRG `
  -TemplateFile troubleshoot.json `
  -prefixName long!!StoragePrefix
```

---

The template fails preflight validation and the deployment isn't run. The `prefixName` is more than 11 characters and contains special characters and uppercase letters.

Storage names must be between 3 and 24 characters and use only lowercase letters and numbers. The prefix value created an invalid storage name. For more information, see [Resolve errors for storage account names](error-storage-account-name.md). To fix the preflight error, use a prefix that's 11 characters or less and contains only lowercase letters or numbers.

Because the deployment didn't run, there's no deployment history.

:::image type="content" source="media/quickstart-troubleshoot-arm-deployment/preflight-no-deploy.png" alt-text="Screenshot of Azure resource group overview page displaying an empty deployment history section due to a preflight error.":::

The activity log shows the preflight error. Select the log to see the error's details.

:::image type="content" source="media/quickstart-troubleshoot-arm-deployment/preflight-activity-log.png" alt-text="Screenshot of Azure resource group activity log showing a preflight error entry with a red exclamation mark icon.":::

## Fix deployment error

Run the deployment with a valid prefix value, like `storage`.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name troubleshootRG --location westus
az deployment group create \
  --resource-group troubleshootRG \
  --template-file troubleshoot.json \
  --parameters prefixName=storage
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name troubleshootRG -Location westus
New-AzResourceGroupDeployment `
  -ResourceGroupName troubleshootRG `
  -TemplateFile troubleshoot.json `
  -prefixName storage
```

---

The deployment begins and is visible in the deployment history. The deployment fails because `outputs` references a virtual network that doesn't exist in the resource group. However, there were no errors for the storage account, so the resource deployed. The deployment history shows a failed deployment.

:::image type="content" source="media/quickstart-troubleshoot-arm-deployment/deployment-failed.png" alt-text="Screenshot of Azure resource group overview page showing a failed deployment with a red exclamation mark icon in the deployment history section.":::

To fix the deployment error, change the reference function to use a valid resource. For more information, see [Resolve resource not found errors](error-not-found.md). For this quickstart, delete the comma that precedes `vnetResult` and all of `vnetResult`. Save the file and rerun the deployment.

```json
"vnetResult": {
  "type": "object",
  "value": "[reference(resourceId('Microsoft.Network/virtualNetworks', 'doesnotexist'), '2021-03-01', 'Full')]"
}
```

After the validation, preflight, and deployment errors are fixed, the following template deploys a storage account. The deployment history and activity log show a successful deployment.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ]
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "prefixName": {
      "type": "string"
    }
  },
  "variables": {
    "storageAccountName": "[concat(parameters('prefixName'), uniquestring(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountName": {
      "type": "string",
      "value": "[variables('storageAccountName')]"
    }
  }
}
```

## Clean up resources

When the Azure resources are no longer needed, delete the resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name troubleshootRG
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name troubleshootRG
```

---

To delete the resource group from the portal, follow these steps:

1. In the Azure portal, enter **Resource groups** in the search box.
1. In the **Filter by name** field, enter the resource group name.
1. Select the resource group name.
1. Select **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

## Next steps

In this quickstart, you learned how to troubleshoot ARM template deployment errors.

> [!div class="nextstepaction"]
> [Troubleshoot common Azure deployment errors](common-deployment-errors.md)
