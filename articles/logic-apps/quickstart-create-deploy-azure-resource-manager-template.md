---
title: Quickstart - Create and deploy logic app workflow by using Azure Resource Manager templates
description: How to create and deploy a logic app using Azure Resource Manager templates
services: logic-apps
ms.suite: integration
ms.reviewer: jonfan, logicappspm
ms.topic: quickstart
ms.custom: mvc, subject-armqs
ms.date: 06/30/2020

# Customer intent: As a developer, I want to automate creating and deploying a logic app workflow to whichever environment that I want by using Azure Resource Manager templates.

---

# Quickstart: Create and deploy a logic app workflow by using an Azure Resource Manager template

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) is a cloud service that helps you create and run automated workflows that integrate data, apps, cloud-based services, and on-premises systems by selecting from [hundreds of connectors](https://docs.microsoft.com/connectors/connector-reference/connector-reference-logicapps-connectors). This quickstart focuses on the process for deploying an Azure Resource Manager (ARM) template to create a basic logic app that checks the status for Azure on an hourly schedule. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

* **Azure CLI**: The Azure command-line interface (Azure CLI) is a set of commands for creating and managing Azure resources. For more information, see [What is Azure CLI](https://docs.microsoft.com/cli/azure/what-is-azure-cli?view=azure-cli-latest) and [Get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest).

* **Azure PowerShell**: Azure PowerShell provides a set of cmdlets that use the Azure Resource Manager model for managing your Azure resources. For more information, see [Azure PowerShell Overview](https://docs.microsoft.com/powershell/azure/azurerm/overview) and [Get started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/azurerm/get-started-azureps).

* **Azure REST API**: Azure provides Representational State Transfer (REST) APIs, which are service endpoints that support HTTP operations (methods) that you use to create, retrieve, update, or delete access to service resources. To work with Azure Logic Apps, see the following topics:<p>

  * [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)
  * [Resource Manager REST API](https://docs.microsoft.com/rest/api/resources/) to create and manage Azure resources in general
  * [Logic Apps REST API](https://docs.microsoft.com/rest/api/logic/) to create and manage logic apps

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Create a logic app

### Review the template

This quickstart uses the [Create a logic app](https://azure.microsoft.com/resources/templates/101-logic-app-create/) template, which you can find in the [Azure Quickstart Templates Gallery](https://azure.microsoft.com/resources/templates). The template creates a logic app workflow that uses the Recurrence trigger, which is set to run every hour, and an HTTP [*built-in* action](https://docs.microsoft.com/azure/connectors/apis-list#connector-types), which calls a URL that returns the status for Azure. A built-in action is native to the Azure Logic Apps platform.

This template creates the following Azure resource:

* [**Microsoft.Logic/workflows**](https://docs.microsoft.com/azure/templates/microsoft.logic/workflows), which creates the workflow for a logic app.

To view the template's azuredeploy.json file  in the templates gallery, see [azuredeploy.json](https://azure.microsoft.com/resources/templates/101-logic-app-create/azuredeploy.json), or review the template here:

:::code language="json" source="~/quickstart-templates/101-logic-app-create/azuredeploy.json" range="1-150" highlight="107-148":::

To find more template samples for Azure Logic Apps, review the [Microsoft.Logic](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Logic) templates in the gallery.

### Deploy the template

To deploy the template, you can use any of these options:

* [Azure portal](#deploy-azure-portal)
* [Azure CLI](#deploy-azure-cli)
* [Azure PowerShell](#deploy-azure-powershell)
* [Azure Resource Manager REST API]

<a name="deploy-azure-portal"></a>

#### Azure portal

If your environment meets the prerequisites, and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal. For more information, see [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md).

1. Select the following image to sign in to Azure and open the template.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json)

<a name="deploy-azure-cli"></a>

#### [CLI](#tab/CLI)

To run `az deployment group create`, you need Azure CLI version 2.6 or later. To display the version, type `az --version`. For more information, see [**az deployment group**](https://docs.microsoft.com/cli/azure/deployment/group) and [Deploy resources with ARM templates and Azure CLI](../azure/azure-resource-manager/templates/deploy-cli.md).

```azurecli-interactive
read -p "Enter a project name to use for generating resource names:" projectName &&
read -p "Enter the location, such as  'westus':" location &&
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json" &&
resourceGroupName="${projectName}rg" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
echo "Press [ENTER] to continue ..." &&
read
```

<a name="deploy-azure-powershell"></a>

#### [PowerShell](#tab/PowerShell)

For more information, see [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name to use for generating resource names"
$location = Read-Host -Prompt "Enter the location, such as 'westus'"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json"

$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```

#### Resource Manager REST API

[Deploy resources with ARM templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md)

### Review deployed resources

To view the logic app, you can use the Azure portal, or you can use an Azure CLI or Azure PowerShell script.

#### Azure portal


#### [CLI](#tab/CLI)

To run `az logic workflow show`, you need Azure CLI version 2.6 or later. To display the version, type `az --version`. For more information, see [**az deployment group**](https://docs.microsoft.com/cli/azure/deployment/group) and [Deploy resources with ARM templates and Azure CLI](../azure/azure-resource-manager/templates/deploy-cli.md).

```azurecli-interactive
echo "Enter your logic app name:" &&
read logicAppName &&
az logic workflow show --name $logicAppName &&
echo "Press [ENTER] to continue ..."
```

For more information, see [az logic workflow show](https://docs.microsoft.com/cli/azure/ext/logic/logic/workflow?view=azure-cli-latest#ext-logic-az-logic-workflow-show).

#### [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$logicAppName = Read-Host -Prompt "Enter your logic app name"
Get-AzureRmLogicApp -Name $logicAppName
Write-Host "Press [ENTER] to continue..."
```

For more information, see [Get-AzureRmLogicApp](https://docs.microsoft.com/powershell/module/azurerm.logicapp/Get-AzureRmLogicApp).

### Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to keep these resources. When you no longer need the logic app, delete the resource group by using either the Azure portal, Azure CLI, or Azure PowerShell: 

[delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

#### [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the resource group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

#### [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)