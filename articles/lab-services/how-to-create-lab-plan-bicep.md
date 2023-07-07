---
title: Create a lab plan using Bicep
titleSuffix: Azure Lab Services
description: Learn how to create an Azure Lab Services lab plan by using Bicep.
ms.topic: how-to
ms.date: 05/23/2022
ms.custom: mode-api, devx-track-bicep
---

# Create a lab plan in Azure Lab Services using a Bicep file

In this article, you learn how to create a lab plan using a Bicep file.  For a detailed overview of Azure Lab Services, see [An introduction to Azure Lab Services](lab-services-overview.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]

## Review the Bicep file

The Bicep file used in this article is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/lab-plan/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.labservices/lab-plan/main.bicep":::

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminUsername=<admin-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminUsername "<admin-username>"
    ```

    ---

  > [!NOTE]
  > Replace **\<admin-username\>** with a unique username. You'll also be prompted to enter adminPassword. The minimum password length is 12 characters.

  When the deployment finishes, you should see a messaged indicating the deployment succeeded.

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

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the VM and all of the resources in the resource group.

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

In this article, you deployed a simple virtual machine using a Bicep file. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Managing Labs](how-to-manage-labs.md)
