---
title: 'Quickstart: Use a Resource Manager template to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use an Azure Resource Manager template to create an Azure virtual network.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 12/12/2022
ms.author: allensu
ms.custom: mode-arm, FY23 content-maintenance, devx-track-arm-template
---

# Quickstart: Use a Resource Manager template to create a virtual network

In this quickstart, you learn how to create a virtual network with two subnets by using an Azure Resource Manager template. A virtual network is the fundamental building block for your private network in Azure. It enables Azure resources, like virtual machines (VMs), to securely communicate with each other and with the internet.

:::image type="content" source="./media/quick-create-bicep/virtual-network-bicep-resources.png" alt-text="Diagram of resources created in the virtual network quickstart.":::

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart by using the [Azure portal](quick-create-portal.md), [Azure PowerShell](quick-create-powershell.md), or the [Azure CLI](quick-create-cli.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template that you use in this quickstart is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/vnet-two-subnets/azuredeploy.json" :::

The template defines the following Azure resources:

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): Create a virtual network.
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): Create a subnet.

## Deploy the template

Deploy the Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates a virtual network with two subnets.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fvnet-two-subnets%2Fazuredeploy.json":::

1. In the portal, on the **Create a Virtual Network with two Subnets** page, enter or select the following values:
   - **Resource group**: Select **Create new**, enter **CreateVNetQS-rg** for the resource group name, and then select **OK**.
   - **Virtual Network Name**: Enter a name for the new virtual network.
1. Select **Review + create**, and then select **Create**.
1. When deployment finishes, select the **Go to resource** button to review the resources that you deployed.

## Review deployed resources

Explore the resources that you created with the virtual network by browsing through the settings panes for **VNet1**:

- The **Overview** tab shows the defined address space of **10.0.0.0/16**.

- The **Subnets** tab shows the deployed subnets of **Subnet1** and **Subnet2** with the appropriate values from the template.

To learn about the JSON syntax and properties for a virtual network in a template, see [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks).

## Clean up resources

When you no longer need the resources that you created with the virtual network, delete the resource group. This action removes the virtual network and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

In this quickstart, you deployed an Azure virtual network with two subnets. To learn more about Azure virtual networks, continue to the tutorial for virtual networks:

> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
