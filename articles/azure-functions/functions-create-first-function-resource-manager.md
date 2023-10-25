---
title: Create your first function using Azure Resource Manager templates
description: Create and deploy to Azure a simple HTTP triggered serverless function by using an Azure Resource Manager template (ARM template).
ms.date: 07/19/2022
ms.topic: quickstart
ms.service: azure-functions
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create and deploy Azure Functions resources from an ARM template

In this article, you use Azure Functions with an Azure Resource Manager template (ARM template) to create a function app and related resources in Azure. The function app provides an execution context for your function code executions.  

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Ffunction-app-create-dynamic%2Fazuredeploy.json)

After you create the function app, you can deploy Azure Functions project code to that app.

## Prerequisites

### Azure account 

Before you begin, you must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/function-app-create-dynamic/azuredeploy.json":::

The following four Azure resources are created by this template:

+ [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage account, which is required by Functions.
+ [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create a serverless Consumption hosting plan for the function app.
+ [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create a function app.
+ [**microsoft.insights/components**](/azure/templates/microsoft.insights/components): create an Application Insights instance for monitoring.


[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

## Deploy the template

The following scripts are designed for and tested in [Azure Cloud Shell](../cloud-shell/overview.md). Choose **Try It** to open a Cloud Shell instance right in your browser. 

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
read -p "Enter a resource group name that is used for generating resource names:" resourceGroupName &&
read -p "Enter the location (like 'eastus' or 'northeurope'):" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-create-dynamic/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```
# [Azure PowerShell](#tab/azure-powershell)

```powershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter a resource group name that is used for generating resource names"
$location = Read-Host -Prompt "Enter the location (like 'eastus' or 'northeurope')"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-create-dynamic/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```
---

[!INCLUDE [functions-welcome-page](../../includes/functions-welcome-page.md)]

## Clean up resources

If you continue to the next step and add an Azure Storage queue output binding, keep all your resources in place as you'll build on what you've already done.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group delete --name <RESOURCE_GROUP_NAME>
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name <RESOURCE_GROUP_NAME>
```

---

Replace `<RESOURCE_GROUP_NAME>` with the name of your resource group.

## Next steps

Now that you've created your function app resources in Azure, you can deploy your code to the existing app by using one of the following tools: 

* [Visual Studio Code](functions-develop-vs-code.md#republish-project-files)
* [Visual Studio](functions-develop-vs.md#publish-to-azure)
* [Azure Functions Core Tools](functions-run-local.md#publish)
