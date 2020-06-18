---
title: Quickstart - Create and deploy logic app workflow by using Azure Resource Manager template
description: Quickstart - Create and deploy a logic app workflow by using an Azure Resource Manager template
services: logic-apps
ms.suite: integration
ms.reviewer: jonfan, logicappspm
ms.topic: quickstart
ms.custom: mvc, subject-armqs
ms.date: 06/30/2020

# Customer intent: As a developer, I want to automate creating and deploying a logic app workflow to whichever environment that I want by using Azure Resource Manager templates.

---

# Quickstart: Create and deploy a logic app workflow by using an Azure Resource Manager template


[Azure Logic Apps](../logic-apps/logic-apps-overview.md) is a cloud service that helps you create and run automated workflows that integrate data, apps, cloud-based services, and on-premises systems by selecting from [hundreds of connectors](https://docs.microsoft.com/connectors/connector-reference/connector-reference-logicapps-connectors). This quickstart focuses on the process for deploying an Azure Resource Manager template to create a basic logic app that checks the status for Azure on an hourly schedule. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Create a logic app

### Review the template

This quickstart uses the [Create a logic app](https://azure.microsoft.com/resources/templates/101-logic-app-create/) template, which you can find in the [Azure Quickstart Templates Gallery](https://azure.microsoft.com/resources/templates) but is too long to show here. To view the template's "azuredeploy.json" file, see [`https://azure.microsoft.com/resources/templates/101-logic-app-create/azuredeploy.json`](https://azure.microsoft.com/resources/templates/101-logic-app-create/azuredeploy.json).

This template defines the Azure resource, [**Microsoft.Logic/workflows**](https://docs.microsoft.com/azure/templates/microsoft.logic/workflows), which creates a logic app workflow. This logic app uses the Recurrence trigger, which is set to fire every hour, and an HTTP [*built-in* action](https://docs.microsoft.com/azure/connectors/apis-list#connector-types), which calls a URL that returns the status for Azure. A built-in action is native to the Azure Logic Apps platform.

To find more template samples for Azure Logic Apps, review the [Microsoft.Logic](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Logic) templates in the gallery.

### Deploy the template

If your environment meets the prerequisites and you're familiar with using Azure Resource Manager templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

The Azure portal is used here to deploy the template. You can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md)

1. Select the following image to sign in to Azure and open the template.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json)

### Review deployed resources


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
> [Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)