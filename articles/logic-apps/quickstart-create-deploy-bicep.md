---
title: Quickstart - Create and deploy logic app workflow using Bicep
description: How to create and deploy a logic app using Bicep.
author: schaffererin
services: logic-apps
ms.suite: integration
ms.topic: quickstart
ms.author: v-eschaffer
ms.custom: mvc, subject-armqs, devx-track-azurepowershell, mode-arm
ms.date: 04/07/2022
#Customer intent: As a developer, I want to automate creating and deploying a logic app workflow to whichever environment that I want using Bicep.
---

# Quickstart: Create and deploy a logic app workflow using Bicep

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) is a cloud service that helps you create and run automated workflows that integrate data, apps, cloud-based services, and on-premises systems by selecting from [hundreds of connectors](/connectors/connector-reference/connector-reference-logicapps-connectors). This quickstart focuses on the process for deploying a Bicep file to create a basic logic app that checks the status for Azure on an hourly schedule.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.logic/logic-app-create/main.bicep).

The quickstart template creates a logic app workflow that uses the Recurrence trigger, which is set to run every hour, and an HTTP [*built-in* action](../connectors/built-in.md), which calls a URL that returns the status for Azure. A built-in action is native to the Azure Logic Apps platform.

This Bicep file creates the following Azure resource:

* [**Microsoft.Logic/workflows**](/azure/templates/microsoft.logic/workflows), which creates the workflow for a logic app.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.logic/logic-app-create/main.bicep":::

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters logicAppName=<logic-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -logicAppName "<logic-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<logic-name\>** with the name of the logic app to create.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
