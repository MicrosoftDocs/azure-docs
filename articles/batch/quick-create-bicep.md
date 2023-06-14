---
title: Azure Quickstart - Create a Batch account - Bicep file
description: This quickstart shows how to create a Batch account by using a Bicep file.
author: FuzziWumpus
ms.date: 04/11/2023
ms.topic: quickstart
ms.author: padmalathas
ms.custom: subject-armqs, mode-arm, devx-track-bicep
tags: azure-resource-manager, bicep
---

# Quickstart: Create a Batch account by using a Bicep file

Get started with Azure Batch by using a Bicep file to create a Batch account, including storage. You need a Batch account to create compute resources (pools of compute nodes) and Batch jobs. You can link an Azure Storage account with your Batch account, which is useful to deploy applications and store input and output data for most real-world workloads.

After completing this quickstart, you'll understand the key concepts of the Batch service and be ready to try Batch with more realistic workloads at larger scale.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

You must have an active Azure subscription.

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/batchaccount-with-storage/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.batch/batchaccount-with-storage/main.bicep":::

Two Azure resources are defined in the Bicep file:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): Creates a storage account.
- [Microsoft.Batch/batchAccounts](/azure/templates/microsoft.batch/batchaccounts): Creates a Batch account.

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

## Validate the deployment

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

If you plan to continue on with more of our [tutorials](./tutorial-parallel-dotnet.md), you may want to leave these resources in place. When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and all of its resources.

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

In this quickstart, you created a Batch account and a storage account using Bicep. To learn more about Azure Batch, continue to the Azure Batch tutorials.

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-parallel-dotnet.md)
