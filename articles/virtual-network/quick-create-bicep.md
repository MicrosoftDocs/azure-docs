---
title: 'Quickstart: Create a virtual network using Bicep'
titleSuffix: Azure Virtual Network
description: Learn how to use Bicep to create an Azure virtual network.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 06/24/2022
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-arm
---

# Quickstart: Create a virtual network - Bicep

In this quickstart, you learn how to create a virtual network with two subnets using Bicep. A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like VMs, to securely communicate with each other and with the internet.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-two-subnets)

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/vnet-two-subnets/main.bicep" :::

The following Azure resources have been defined in the Bicep file:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): Create an Azure virtual network.
- [**Microsoft.Network/virtualNetworks/subnets**](/azure/templates/microsoft.network/virtualnetworks/subnets): Create a subnet.

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

Use Azure CLI or Azure PowerShell to review the deployed resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

You can use the Azure portal to explore the resources by browsing the settings blades for **VNet1**.

1. On the **Overview** tab, you will see the defined address space of **10.0.0.0/16**.
2. On the **Subnets** tab, you will see the deployed subnets of **Subnet1** and **Subnet2** with the appropriate values from the Bicep file.

## Clean up resources

When you no longer need the resources that you created with the virtual network, use Azure portal, Azure CLI, or Azure PowerShell to delete the resource group. This removes the virtual network and all the related resources.

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

In this quickstart, you deployed an Azure virtual network with two subnets. To learn more about Azure virtual networks, continue to the tutorial for virtual networks.

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
