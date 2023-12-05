---
title: 'Quickstart: Create an internal Azure load balancer - Bicep'
description: This quickstart shows how to create an internal Azure load balancer using Bicep.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.author: mbender
ms.date: 05/01/2023
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-bicep,engagement-fy23
---

# Quickstart: Create an internal load balancer to load balance VMs using Bicep

This quickstart describes how to use Bicep to create an internal Azure load balancer.

:::image type="content" source="media/quickstart-load-balancer-standard-internal-portal/internal-load-balancer-resources.png" alt-text="Diagram of resources deployed for internal load balancer.":::

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/2-vms-internal-load-balancer/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.compute/2-vms-internal-load-balancer/main.bicep":::

Multiple Azure resources have been defined in the Bicep file:

- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): Virtual machine storage accounts for boot diagnostics.
- [**Microsoft.Compute/availabilitySets**](/azure/templates/microsoft.compute/availabilitySets): Availability set for virtual machines.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks): Virtual network for load balancer and virtual machines.
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkInterfaces): Network interfaces for virtual machines.
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers): Internal load balancer.
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualMachines): Virtual machines.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name CreateIntLBQS-rg --location eastus
    az deployment group create --resource-group CreateIntLBQS-rg --template-file main.bicep --parameters adminUsername=AzureAdmin
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name CreateIntLBQS-rg -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName CreateIntLBQS-rg -TemplateFile ./main.bicep -adminUsername "<admin-user>"
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-user\>** with the admin username. You'll also be prompted to enter **adminPassword**.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group CreateIntLBQS-rg
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName CreateIntLBQS-rg
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name CreateIntLBQS-rg
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name CreateIntLBQS-rg
```

---

## Next steps

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
