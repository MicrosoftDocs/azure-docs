---
title: 'Azure ExpressRoute: Add IPv6 support for private peering'
description: Learn how to add IPv6 support to connect to Azure deployments using the Azure portal, Azure CLI, or Azure PowerShell.
services: expressroute
author: vishalme
ms.service: azure-expressroute
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.date: 07/25/2025 
ms.author: duau
---

# Add IPv6 support for private peering

This article describes how to add IPv6 support to connect via ExpressRoute to your resources in Azure using the Azure portal, Azure CLI, or Azure PowerShell.

> [!NOTE]
> Some aspects of the portal experience are still being implemented. Therefore, when using the Azure portal, follow the exact order of steps provided in this document to successfully add IPv6 support. Specifically, make sure to create your virtual network and subnet, or add IPv6 address space to your existing virtual network and GatewaySubnet, *prior* to creating a new virtual network gateway in the portal.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

# [Portal](#tab/portal)

## Sign in to the Azure portal

From a web browser, sign in to the [Azure portal](https://portal.azure.com).

# [Azure CLI](#tab/cli)

* Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

# [PowerShell](#tab/powershell)

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

---

## Add IPv6 Private Peering to your ExpressRoute circuit

# [Portal](#tab/portal)

1. [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) or navigate to the existing circuit you want to change.

1. Select the **Azure private** peering configuration.

1. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration by selecting "Both" for **Subnets**, or only enable IPv6 Private Peering on your new circuit by selecting "IPv6". Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. **Save** your peering configuration once you defined all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-peering.png" alt-text="Screenshot of adding Ipv6 on private peering page.":::

1. After the configuration is accepted successfully, you should see something similar to the following example.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/view-ipv6-peering.png" alt-text="Screenshot of Ipv6 configured for private peering.":::

# [Azure CLI](#tab/cli)

1. [Create an ExpressRoute circuit](howto-circuit-cli.md) or use an existing circuit. View the circuit details by running the following command:

    ```azurecli-interactive
    az network express-route show --resource-group "<ExpressRouteResourceGroup>" --name "<MyCircuit>"
    ```

2. View the private peering configuration for the circuit by running the following command:

    ```azurecli-interactive
    az network express-route peering show -g "<ExpressRouteResourceGroup>" --circuit-name "<MyCircuit>" --name AzurePrivatePeering
    ```

3. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration. Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router.

    ```azurecli-interactive
    az network express-route peering update -g "<ExpressRouteResourceGroup>" --circuit-name "<MyCircuit>" --name AzurePrivatePeering --ip-version ipv6 --primary-peer-subnet "<X:X:X:X/126>" --secondary-peer-subnet "<Y:Y:Y:Y/126>"
    ```

# [PowerShell](#tab/powershell)

1. [Create an ExpressRoute circuit](./expressroute-howto-circuit-arm.md) or use an existing circuit. Retrieve the circuit by running the **Get-AzExpressRouteCircuit** command:

    ```azurepowershell-interactive
    $ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
    ```

2. Retrieve the private peering configuration for the circuit by running **Get-AzExpressRouteCircuitPeeringConfig**:

    ```azurepowershell-interactive
    Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt
    ```

3. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration. Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router.

    > [!Note]
    > The peer ASN and VlanId should match those in your IPv4 Private Peering configuration.

    ```azurepowershell-interactive
    Set-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 200 -PeerAddressType IPv6

    Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
    ```

4. After the configuration is saved successfully, get the circuit again by running the **Get-AzExpressRouteCircuit** command. The response should look similar to the following example:

    ```azurepowershell
    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : eastus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                       }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : Provisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                         "ServiceProviderName": "Equinix",
                                         "PeeringLocation": "Washington DC",
                                         "BandwidthInMbps": 50
                                       }
    ExpressRoutePort                 : null
    BandwidthInGbps                  :
    Stag                             : 29
    ServiceKey                       : **************************************
    Peerings                         : [
                                         {
                                           "Name": "AzurePrivatePeering",
                                           "Etag": "W/\"facc8972-995c-4861-a18d-9a82aaa7167e\"",
                                           "Id": "/subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit/peerings/AzurePrivatePeering",
                                           "PeeringType": "AzurePrivatePeering",
                                           "State": "Enabled",
                                           "AzureASN": 12076,
                                           "PeerASN": 100,
                                           "PrimaryPeerAddressPrefix": "192.168.15.16/30",
                                           "SecondaryPeerAddressPrefix": "192.168.15.20/30",
                                           "PrimaryAzurePort": "",
                                           "SecondaryAzurePort": "",
                                           "VlanId": 200,
                                           "ProvisioningState": "Succeeded",
                                           "GatewayManagerEtag": "",
                                           "LastModifiedBy": "Customer",
                                           "Ipv6PeeringConfig": {
                                             "State": "Enabled",
                                             "PrimaryPeerAddressPrefix": "3FFE:FFFF:0:CD30::/126",
                                             "SecondaryPeerAddressPrefix": "3FFE:FFFF:0:CD30::4/126"
                                           },
                                           "Connections": [],
                                           "PeeredConnections": []
                                         },
                                       ]
    Authorizations                   : []
    AllowClassicOperations           : False
    GatewayManagerEtag               :
    ```

---

## Update your connection to an existing virtual network

To use IPv6 Private Peering with your existing Azure resources, follow these steps:

# [Portal](#tab/portal)

Follow these steps if you have an existing environment of Azure resources that you would like to use your IPv6 Private Peering with.

1. Navigate to the virtual network that your ExpressRoute circuit is connected to.

1. Navigate to the **Address space** tab and add an IPv6 address space to your virtual network. **Save** your address space.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-space.png" alt-text="Screenshot of add Ipv6 address space to virtual network.":::

1. Navigate to the **Subnets** tab and select the **GatewaySubnet**. Check **Add IPv6 address space** and provide an IPv6 address space for your subnet. The gateway IPv6 subnet should be /64 or larger. **Save** your configuration once you defined all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-gateway-space.png" alt-text="Screenshot of add Ipv6 address space to the subnet.":::
    
1. If you have an existing zone-redundant gateway, run the following command in PowerShell to enable IPv6 connectivity (note that it can take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](./expressroute-howto-add-gateway-portal-resource-manager.md) using any SKU and a Standard, Static public IP address. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this option is only available for circuits using ExpressRoute Direct).

    ```azurepowershell-interactive
    $gw = Get-AzVirtualNetworkGateway -Name "GatewayName" -ResourceGroupName "ExpressRouteResourceGroup"
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw
    ```

# [Azure CLI](#tab/cli)

1. Add an IPv6 address space to the virtual network that your ExpressRoute circuit is connected to.

    ```azurecli-interactive
    az network vnet update -g "<MyResourceGroup>" -n "<MyVNet>" --address-prefixes "X:X:X:X::/64"
    ```

2. Add IPv6 address space to your gateway subnet. The gateway IPv6 subnet should be /64 or larger.

    ```azurecli-interactive
    az network vnet subnet update -g "<MyResourceGroup>" -n "<MySubnet>" -vnet-name "<MyVNet>" --address-prefixes "10.0.0.0/26", "X:X:X:X::/64"
    ```

3. If you have an existing zone-redundant gateway, run the following to enable IPv6 connectivity (note that it can take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this feature is only available for circuits using ExpressRoute Direct).

    ```azurecli-interactive
    az network vnet-gateway update --name "<GatewayName>" --resource-group "<MyResourceGroup>"
    ```

# [PowerShell](#tab/powershell)

1. Retrieve the virtual network that your ExpressRoute circuit is connected to.

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -Name "VirtualNetwork" -ResourceGroupName "ExpressRouteResourceGroup"
    ```

2. Add an IPv6 address space to your virtual network.

    ```azurepowershell-interactive
    $vnet.AddressSpace.AddressPrefixes.add("ace:daa:daaa:deaa::/64")
    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```

3. Add IPv6 address space to your gateway subnet. The gateway IPv6 subnet should be /64 or larger.

    ```azurepowershell-interactive
    Set-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix "10.0.0.0/26", "ace:daa:daaa:deaa::/64"
    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```

4. If you have an existing zone-redundant gateway, run the following to enable IPv6 connectivity (note that it can take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](./expressroute-howto-add-gateway-resource-manager.md) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this feature is only available for circuits using ExpressRoute Direct).

    ```azurepowershell-interactive
    $gw = Get-AzVirtualNetworkGateway -Name "GatewayName" -ResourceGroupName "ExpressRouteResourceGroup"
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw
    ```

---

> [!NOTE]
> If you have an existing gateway that is not zone-redundant (meaning it is Standard, High Performance, or Ultra Performance SKU) and uses a public IP address of Basic SKU, you will need to delete and recreate the gateway using any SKU.
>  The gateway of type zone-redundant SKU (meaning it is Standard, High Performance, or Ultra Performance) can be deployed only in availability-zone supported regions.

## Create a connection to a new virtual network

To connect to a new set of Azure resources via IPv6 Private Peering, follow these steps:

# [Portal](#tab/portal)

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network).

1. [Create the dual-stack gateway subnet](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet).

1. [Create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md) using any SKU and a Standard, Static public IP address. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this option is only available for circuits using ExpressRoute Direct). **NOTE:** Use the PowerShell instructions for this step as the Azure portal experience is still under development.

1. [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md).

# [Azure CLI](#tab/cli)

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-cli.md).

1. [Create the dual-stack gateway subnet](expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).

1. [Create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that feature is only available for circuits using ExpressRoute Direct).

1. [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-cli.md).

# [PowerShell](#tab/powershell)

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network).

1. [Create the dual-stack gateway subnet](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).

1. [Create the virtual network gateway](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this feature is only available for circuits using ExpressRoute Direct).

1. [Link your virtual network to your ExpressRoute circuit](./expressroute-howto-linkvnet-arm.md).

---

## Limitations

While IPv6 support is available for connections to deployments in global Azure regions, it doesn't support the following use cases:

* Connections to *existing* ExpressRoute gateways that aren't zone-redundant. *Newly* created ExpressRoute gateways of any SKU (both zone-redundant and not) using a Standard, Static IP address can be used for dual-stack ExpressRoute connections
* Use of ExpressRoute with Virtual WAN
* Use of ExpressRoute with [Route Server](../route-server/route-server-faq.md#does-azure-route-server-support-ipv6) (Portal only)
* FastPath with non-ExpressRoute Direct circuits
* FastPath with circuits in the following peering locations: Dubai
* Coexistence with VPN Gateway for IPv6 traffic. You can still configure coexistence with VPN Gateway in a dual-stack virtual network, but VPN Gateway only supports IPv4 traffic.
* It isn't possible to connect a dual-stack ExpressRoute Virtual Network Gateway to an ExpressRoute Circuit that only has IPv4 enabled on the Private Peering. IPv6 must also be enabled on the ExpressRoute Circuit. You must also configure IPv6 on your on-premises CPE device.

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
