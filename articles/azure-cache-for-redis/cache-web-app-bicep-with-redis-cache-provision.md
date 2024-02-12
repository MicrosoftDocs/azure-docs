---
title: Provision Web App that uses Azure Cache for Redis using Bicep
description: Use Bicep to deploy web app with Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.custom: devx-track-bicep
ms.topic: conceptual
ms.date: 05/24/2022
ms.author: franlanglois 
---

# Create a Web App plus Azure Cache for Redis using Bicep

In this article, you use Bicep to deploy an Azure Web App that uses Azure Cache for Redis, as well as an App Service plan.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

You can use this Bicep file for your own deployments. The Bicep file provides unique names for the Azure Web App, the App Service plan, and the Azure Cache for Redis. If you'd like, you can customize the Bicep file after you save it to your local device to meet your requirements.

For more information about creating Bicep files, see [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md). To learn about Bicep syntax, see [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.web/web-app-with-redis-cache/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.web/web-app-with-redis-cache/main.bicep":::

With this Bicep file, you deploy:

* [**Microsoft.Cache/Redis**](/azure/templates/microsoft.cache/redis)
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites)
* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

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

To learn more about Bicep, continue to the following article:

* [Bicep overview](../azure-resource-manager/bicep/overview.md)
