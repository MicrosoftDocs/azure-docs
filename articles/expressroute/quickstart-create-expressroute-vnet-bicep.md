---
title: 'Quickstart: Create an Azure ExpressRoute circuit using Bicep'
description: This quickstart shows you how to create an ExpressRoute circuit using Bicep.
services: expressroute
author: duongau
ms.author: duau
ms.date: 06/30/2023
ms.topic: quickstart
ms.service: expressroute
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create an ExpressRoute circuit with private peering using Bicep

This quickstart describes how to use Bicep to create an ExpressRoute circuit with private peering.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using bicep.":::

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/expressroute-private-peering-vnet).

In this quickstart, you create an ExpressRoute circuit with *Equinix* as the service provider. The circuit is using a *Premium SKU*, with a bandwidth of *50 Mbps*, and the peering location of *Washington DC*. Private peering is enabled with a primary and secondary subnet of *192.168.10.16/30* and *192.168.10.20/30* respectively. A virtual network gets created along with a *HighPerformance ExpressRoute gateway*.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/expressroute-private-peering-vnet/main.bicep":::

Multiple Azure resources have been defined in the Bicep file:

* [**Microsoft.Network/expressRouteCircuits**](/azure/templates/microsoft.network/expressRouteCircuits)
* [**Microsoft.Network/expressRouteCircuits/peerings**](/azure/templates/microsoft.network/expressRouteCircuits/peerings) (Used to enabled private peering on the circuit)
* [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networkSecurityGroups) (network security group is applied to the subnets in the virtual network)
* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks)
* [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicIPAddresses) (Public IP is used by the ExpressRoute gateway)
* [**Microsoft.Network/virtualNetworkGateways**](/azure/templates/microsoft.network/virtualNetworkGateways) (ExpressRoute gateway is used to link VNet to the circuit)

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

> [!NOTE]
> You will need to call the provider to complete the provisioning process before you can link the virtual network to the circuit.

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

In this quickstart, you created a:

* ExpressRoute circuit
* Virtual Network
* VPN Gateway
* Public IP
* Network security group

To learn how to link a virtual network to a circuit, continue to the ExpressRoute tutorials.

> [!div class="nextstepaction"]
> [ExpressRoute tutorials](expressroute-howto-linkvnet-portal-resource-manager.md)
