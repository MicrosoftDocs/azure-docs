---
title: Create your function app resources using Azure Resource Manager templates
description: Create and deploy to Azure a simple HTTP triggered serverless function by using an Azure Resource Manager template (ARM template).
ms.date: 03/17/2025
ms.topic: quickstart
ms.service: azure-functions
zone_pivot_groups: programming-languages-set-functions
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create and deploy Azure Functions resources from an ARM template

In this article, you use an Azure Resource Manager template (ARM template) to create a function app in a Flex Consumption plan in Azure, along with its required Azure resources. The function app provides a serverless execution context for your function code executions. The app uses Microsoft Entra ID with managed identities to connect to other Azure resources.    

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account. 

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Ffunction-app-flex-managed-identities%2Fazuredeploy.json":::

After you create the function app, you can deploy your Azure Functions project code to that app. A final code deployment step is outside the scope of this quickstart article.

## Prerequisites

### Azure account 

Before you begin, you must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/function-app-flex-managed-identities/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json":::

This template creates these Azure resources needed by a function app that securely connects to Azure services:

[!INCLUDE [functions-azure-resources-list](../../includes/functions-azure-resources-list.md)]

[!INCLUDE [functions-deployment-considerations-infra](../../includes/functions-deployment-considerations-infra.md)]

## Deploy the template

These scripts are designed for and tested in [Azure Cloud Shell](../cloud-shell/overview.md). Choose **Try It** to open a Cloud Shell instance right in your browser. When prompted, enter the name of a region that [supports the Flex Consumption plan](./flex-consumption-how-to.md#view-currently-supported-regions), such as `eastus` or `northeurope`.

### [Azure CLI](#tab/azure-cli)
::: zone pivot="programming-language-csharp"  
```azurecli-interactive 
read -p "Enter a supported Azure region: " location &&
resourceGroupName=exampleRG &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri --parameters functionAppRuntime=dotnet-isolated functionAppRuntimeVersion=8.0 &&
echo "Press [ENTER] to continue ..." &&
read
```
::: zone-end  
::: zone pivot="programming-language-java" 
```azurecli-interactive 
read -p "Enter a supported Azure region: " location &&
resourceGroupName=exampleRG &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri --parameters functionAppRuntime=java functionAppRuntimeVersion=17 &&
echo "Press [ENTER] to continue ..." &&
read
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
```azurecli-interactive 
read -p "Enter a supported Azure region: " location &&
resourceGroupName=exampleRG &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri --parameters functionAppRuntime=node functionAppRuntimeVersion=20 &&
echo "Press [ENTER] to continue ..." &&
read
```
::: zone-end 
::: zone pivot="programming-language-python"  
```azurecli-interactive 
read -p "Enter a supported Azure region: " location &&
resourceGroupName=exampleRG &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri --parameters functionAppRuntime=python functionAppRuntimeVersion=3.11 &&
echo "Press [ENTER] to continue ..." &&
read
```
::: zone-end  
::: zone pivot="programming-language-powershell"  
```azurecli-interactive 
read -p "Enter a supported Azure region: " location &&
resourceGroupName=exampleRG &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri --parameters functionAppRuntime=powerShell functionAppRuntimeVersion=7.4 &&
echo "Press [ENTER] to continue ..." &&
read
```
::: zone-end 

### [Azure PowerShell](#tab/azure-powershell)
::: zone pivot="programming-language-csharp"  
```powershell-interactive
$resourceGroupName = "exampleRG"
$location = Read-Host -Prompt "Enter a supported Azure region"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -functionAppRuntime "dotnet-isolated" -functionAppRuntimeVersion "8.0"

Read-Host -Prompt "Press [ENTER] to continue ..."
```
::: zone-end  
::: zone pivot="programming-language-java"  
```powershell-interactive
$resourceGroupName = "exampleRG"
$location = Read-Host -Prompt "Enter a supported Azure region"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -functionAppRuntime "java" -functionAppRuntimeVersion "17"

Read-Host -Prompt "Press [ENTER] to continue ..."
```
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
```powershell-interactive
$resourceGroupName = "exampleRG"
$location = Read-Host -Prompt "Enter a supported Azure region"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -functionAppRuntime "node" -functionAppRuntimeVersion "20"

Read-Host -Prompt "Press [ENTER] to continue ..."
```
::: zone-end  
::: zone pivot="programming-language-python"  
```powershell-interactive
$resourceGroupName = "exampleRG"
$location = Read-Host -Prompt "Enter a supported Azure region"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -functionAppRuntime "python" -functionAppRuntimeVersion "3.11"

Read-Host -Prompt "Press [ENTER] to continue ..."
```
::: zone-end  
::: zone pivot="programming-language-powershell"  
```powershell-interactive
$resourceGroupName = "exampleRG"
$location = Read-Host -Prompt "Enter a supported Azure region"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/function-app-flex-managed-identities/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -functionAppRuntime "powershell" -functionAppRuntimeVersion "7.4"

Read-Host -Prompt "Press [ENTER] to continue ..."
```
::: zone-end  

---

When the deployment finishes, you should see a message indicating the deployment succeeded.

[!INCLUDE [functions-welcome-page](../../includes/functions-welcome-page.md)]

## Clean up resources

[!INCLUDE [functions-cleanup-resources-infra](../../includes/functions-cleanup-resources-infra.md)]

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]
