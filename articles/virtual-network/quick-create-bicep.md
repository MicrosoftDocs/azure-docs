---
title: 'Quickstart: Use Bicep to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use Bicep templates to create and connect through an Azure virtual network and virtual machines.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/06/2023
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-arm
#Customer intent: I want to use Bicep templates to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use Bicep templates to create a virtual network

This quickstart shows you how to create a virtual network by using a Bicep template.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file this quickstart uses is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-two-subnets)

The Bicep template defines the following Azure resources:

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Creates an Azure virtual network.
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Creates a subnet.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/vnet-two-subnets/main.bicep" :::

## Deploy the Bicep template

1. Save the Bicep file to your local computer as *main.bicep*.
1. Deploy the Bicep file by using either Azure CLI or Azure PowerShell.

   # [CLI](#tab/CLI)

   ```azurecli
   az group create --name TestRG --location eastus
   az deployment group create --resource-group TestRG --template-file main.bicep
   ```

   # [PowerShell](#tab/PowerShell)

   ```azurepowershell
   New-AzResourceGroup -Name TestRG -Location eastus
   New-AzResourceGroupDeployment -ResourceGroupName TestRG -TemplateFile ./main.bicep
   ```

   ---

   When the deployment finishes, a message indicates that the deployment succeeded.

## Review deployed resources

Use Azure CLI or Azure PowerShell to review the deployed resources.

# [CLI](#tab/CLI)

```azurecli
az resource list --resource-group TestRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName TestRG
```

---

You can use the Azure portal to explore the resources by browsing the settings blades for **VNet1**.

1. On the **Overview** tab, you see the defined address space of **10.0.0.0/16**.
2. On the **Subnets** tab, you see the deployed subnets of **Subnet1** and **Subnet2** with the appropriate values from the Bicep file.

## Clean up resources

When you're done with the virtual network, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and all its resources.

# [CLI](#tab/CLI)

```azurecli
az group delete --name TestRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name TestRG
```

---

## Next steps

In this quickstart, you created and deployed an Azure virtual network with two subnets. To learn more about Azure virtual networks, continue to the tutorial for virtual networks.

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
