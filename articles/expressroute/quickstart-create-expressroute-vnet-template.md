---
title: Create an ExpressRoute circuit by using an Azure Resource Manager template (ARM template)
description: Learn how to create an ExpressRoute circuit by using Azure Resource Manager template (ARM template).
services: expressroute
author: duongau
mnager: kumud
ms.service: expressroute
ms.topic: quickstart
ms.custom: subject-armsq
ms.date: 08/27/2020
ms.author: duau
---

# Quickstart: Create an ExpressRoute circuit with private peering using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM Template) to create an ExpressRoute circuit with private peering.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-expressroute-private-peering-vnet%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-expressroute-private-peering-vnet).

In this quickstart, you'll create an ExpressRoute circuit with *Equinix* as the service provider. The circuit will be using a *Premium SKU*, with a bandwidth of *50 Mbps*, and the peering location of *Washington DC*. Private peering will be enabled with a primary and secondary subnet of *192.168.10.16/30* and *192.168.10.20/30* respectively. A virtual network will also be created along with a *HighPerformance ExpressRoute gateway*.

:::code language="json" source="~/quickstart-templates/101-expressroute-private-peering-vnet/azuredeploy.json":::

Multiple Azures resources have been defined in the template:

* [**Microsoft.Network/expressRouteCircuits**](/azure/templates/microsoft.network/expressRouteCircuits)
* [**Microsoft.Network/expressRouteCircuits/peerings**](/azure/templates/microsoft.network/expressRouteCircuits/peerings) (Used to enabled private peering on the circuit)
* [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networkSecurityGroups) (NSG is applied to the subnets in the virtual network)
* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks) 
* [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicIPAddresses) (Public IP is used by the ExpressRoute gateway)
* [**Microsoft.Network/virtualNetworkGateways**](/azure/templates/microsoft.network/virtualNetworkGateways) (ExpressRoute gateway is used to link VNet to the circuit)

To find more templates that are related to ExpressRoute, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure. 

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-expressroute-private-peering-vnet/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

    Wait until you see the prompt from the console.

1. Select **Copy** from the previous code block to copy the PowerShell script.

1. Right-click the shell console pane and then select **Paste**.

1. Enter the values.

    The resource group name is the project name with **rg** appended.

It takes about 20 minutes to deploy the template. When completed, the output is similar to:

:::image type="content" source="./media/quickstart-create-expressroute-vnet/er-arm-psoutput.png" alt-text="ExpressRoute Resource Manager template PowerShell deployment output":::

Azure PowerShell is used to deploy the template. In addition to Azure PowerShell, you can also use the Azure portal, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md).

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Resource groups** from the left pane.

1. Select the resource group that you created in the previous section. The default resource group name is the project name with **rg** appended.

1. The resource group should contain the following resources seen here:

     :::image type="content" source="./media/quickstart-create-expressroute-vnet/er-arm-rg.png" alt-text="ExpressRoute deployment resource group":::

1. Select the ExpressRoute circuit **er-ck01** to verify that the circuit status is **Enabled**, provider status is **Not provisioned** and private peering has the status of **Provisioned**.

    :::image type="content" source="./media/quickstart-create-expressroute-vnet/er-arm-circuit.png" alt-text="ExpressRoute deployment circuit":::

## Clean up resources

When you're done, delete the resource groups, ExpressRoute circuit, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

## Next steps

In this quickstart, you created a:
* ExpressRoute circuit
* Virtual Network
* VPN Gateway
* Public IP
* Network Security Group

To learn more about linking a virtual network to a circuit, continue to the ExpressRoute tutorials.

> [!div class="nextstepaction"]
> [ExpressRoute tutorials](expressroute-howto-linkvnet-portal-resource-manager.md)

* For more information about ExpressRoute workflows, see [ExpressRoute workflows](expressroute-workflows.md).
* For more information about circuit peering, see [ExpressRoute circuits and routing domains](expressroute-circuit-peerings.md).
* For more information about working with virtual networks, see [Virtual network overview](../virtual-network/virtual-networks-overview.md).