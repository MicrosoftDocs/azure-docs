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

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Create a logic app

### Review the template

This quickstart uses the [**Create a logic app**](https://azure.microsoft.com/resources/templates/101-logic-app-create/) template, which you can find in the [Azure Quickstart Templates Gallery](https://azure.microsoft.com/resources/templates) but is too long to show here. Instead, you can review the template's ["azuredeploy.json file"](https://azure.microsoft.com/resources/templates/101-logic-app-create/azuredeploy.json) in the templates gallery.

The template creates a logic app workflow that uses the Recurrence trigger, which is set to run every hour, and an HTTP [*built-in* action](https://docs.microsoft.com/azure/connectors/apis-list#connector-types), which calls a URL that returns the status for Azure. A built-in action is native to the Azure Logic Apps platform.

This template creates the following Azure resource:

* [**Microsoft.Logic/workflows**](https://docs.microsoft.com/azure/templates/microsoft.logic/workflows), which creates the workflow for a logic app.

To find more template samples for Azure Logic Apps, review the [Microsoft.Logic](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Logic) templates in the gallery.

<a name="deploy-template"></a>

### Deploy the template

To deploy the template, you can use any of these options:

* [Azure portal](../logic-apps/quickstart-create-deploy-azure-resource-manager-template.md?tabs=azure-portal#deploy-template)
* [Azure CLI](../logic-apps/quickstart-create-deploy-azure-resource-manager-template.md?tabs=azure-cli#deploy-template)
* [Azure PowerShell](../logic-apps/quickstart-create-deploy-azure-resource-manager-template.md?tabs=azure-powershell#deploy-template)
* [Azure Resource Manager REST API](../logic-apps/quickstart-create-deploy-azure-resource-manager-template.md?tabs=rest-api#deploy-template)

<a name="deploy-azure-portal"></a>

#### [Portal](#tab/azure-portal)

If your environment meets the prerequisites, and you're familiar with using ARM templates, select the **Deploy to Azure** button below, which prompts you to sign in with your Azure account and opens the template in the Azure portal. For more information, see [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md).

1. Select the following image to sign in with your Azure account and open the template in the Azure portal:

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-logic-app-create%2fazuredeploy.json)

1. In the portal, on the **Create a logic app using a template** page, enter or select these values:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Subscription** | <*Azure-subscription-name*> | The name for the Azure subscription to use |
   | **Resource group** | <*Azure-resource-group-name*> | The name for a new or existing Azure resource group. This example uses `Check-Azure-Status-RG`. |
   | **Region** | <*Azure-region*> | The Azure datacenter region to use your logic app. This example uses `West US`. |
   | **Logic App Name** | <*logic-app-name*> | The name to use for your logic app. This example uses `Check-Azure-Status-LA`. |
   | **Test Uri** | <*test-URI*> | The URI for the service to call based on a specific schedule. This example uses `https://status.azure.com/en-us/status/`, which is the Azure status page. |
   | **Location** |  <*Azure-region-for-all-resources*> | The Azure region to use for all resources, if different from the default value. This example uses the default value, `[resourceGroup().location]`, which is the resource group location. |
   ||||

   Here is how the page looks with the values used in this example:

   ![Provide information for your logic app template](./media/quickstart-create-deploy-azure-resource-manager-template/create-logic-app-template-portal.png)

1. When you're done, select **Review + create**.

1. Continue with the steps in [Review deployed resources](#review-deployed-resources).

---

#### [CLI](#tab/azure-cli)

The Azure command-line interface (Azure CLI) is a set of commands for creating and managing Azure resources. To run `az deployment group create`, you need Azure CLI version 2.6 or later. To display the version, type `az --version`.

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

For more information, see these topics:

* [What is Azure CLI](https://docs.microsoft.com/cli/azure/what-is-azure-cli?view=azure-cli-latest)
* [Get started with Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest)
* [az deployment group](https://docs.microsoft.com/cli/azure/deployment/group)
* [Deploy resources with ARM templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

---

#### [PowerShell](#tab/azure-powershell)

Azure PowerShell provides a set of cmdlets that use the Azure Resource Manager model for managing your Azure resources.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name to use for generating resource names"
$location = Read-Host -Prompt "Enter the location, such as 'westus'"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json"

$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location "$location"
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

Read-Host -Prompt "Press [ENTER] to continue ..."
```

For more information, see these topics:

* [Azure PowerShell Overview](https://docs.microsoft.com/powershell/azure/azurerm/overview)
* [Get started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/azurerm/get-started-azureps)
* [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md)

---

#### [REST API](#tab/rest-api)

Azure provides Representational State Transfer (REST) APIs, which are service endpoints that support HTTP operations (methods) that you use to create, retrieve, update, or delete access to service resources.

For more information, see these topics:

* [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)
* [Resource Manager REST API](https://docs.microsoft.com/rest/api/resources/)
* [Logic Apps REST API](https://docs.microsoft.com/rest/api/logic/)
* [Deploy resources with ARM templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md)

<a name="review-deployed-resources"></a>

## Review deployed resources

To view the logic app, you can use the Azure portal, or you can use a script created with Azure CLI or Azure PowerShell.

### [Portal](#tab/azure-portal)


---

### [CLI](#tab/azure-cli)

To run `az logic workflow show`, you need Azure CLI version 2.6 or later. To display the version, type `az --version`. For more information, see [az logic workflow show](https://docs.microsoft.com/cli/azure/ext/logic/logic/workflow?view=azure-cli-latest#ext-logic-az-logic-workflow-show).

```azurecli-interactive
echo "Enter your logic app name:" &&
read logicAppName &&
az logic workflow show --name $logicAppName &&
echo "Press [ENTER] to continue ..."
```

---

### [PowerShell](#tab/azure-powershell)

For more information, see [Get-AzureRmLogicApp](https://docs.microsoft.com/powershell/module/azurerm.logicapp/Get-AzureRmLogicApp).

```azurepowershell-interactive
$logicAppName = Read-Host -Prompt "Enter your logic app name"
Get-AzureRmLogicApp -Name $logicAppName
Write-Host "Press [ENTER] to continue..."
```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to keep these resources. When you no longer need the logic app, delete the resource group by using either the Azure portal, Azure CLI, Azure PowerShell, or Resource Manager REST API:

### [Portal](#tab/azure-portal)

For more information, see these topics:

* [Delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group)
* [Delete the resource](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource)

---

### [CLI](#tab/azure-cli)

For more information, see [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete).

```azurecli-interactive
echo "Enter your resource group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

---

### [PowerShell](#tab/azure-powershell)

For more information, see [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/remove-azurermresourcegroup).

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the resource group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)