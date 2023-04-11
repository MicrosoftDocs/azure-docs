---
title: Create your function app resources in Azure using Bicep
description: Create and deploy to Azure a simple HTTP triggered serverless function using Bicep.
author: mijacobs
ms.author: mijacobs
ms.date: 06/12/2022
ms.topic: quickstart
ms.service: azure-functions
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create and deploy Azure Functions resources using Bicep

In this article, you use Azure Functions with Bicep to create a function app and related resources in Azure. The function app provides an execution context for your function code executions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

After you create the function app, you can deploy Azure Functions project code to that app.

## Prerequisites

### Azure account

Before you begin, you must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/function-app-create-dynamic/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/function-app-create-dynamic/main.bicep":::

The following four Azure resources are created by this Bicep file:

+ [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage account, which is required by Functions.
+ [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create a serverless Consumption hosting plan for the function app.
+ [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create a function app.
+ [**microsoft.insights/components**](/azure/templates/microsoft.insights/components): create an Application Insights instance for monitoring.

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters appInsightsLocation=<app-location>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -appInsightsLocation "<app-location>"
    ```

    ---

    > [!NOTE]
    > Replace **\<app-location\>** with the region for Application Insights, which is usually the same as the resource group.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use Azure CLI or Azure PowerShell to validate the deployment.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

[!INCLUDE [functions-welcome-page](../../includes/functions-welcome-page.md)]

## Clean up resources

If you continue to the next step and add an Azure Storage queue output binding, keep all your resources in place as you'll build on what you've already done.

Otherwise, if you no longer need the resources, use Azure CLI, PowerShell, or Azure portal to delete the resource group and its resources.

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

Now that you've created your function app resources in Azure, you can deploy your code to the existing app by using one of the following tools: 

* [Visual Studio Code](functions-develop-vs-code.md#republish-project-files)
* [Visual Studio](functions-develop-vs.md#publish-to-azure)
* [Azure Functions Core Tools](functions-run-local.md#publish)
