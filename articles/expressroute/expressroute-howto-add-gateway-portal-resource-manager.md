---
title: 'Tutorial: Azure ExpressRoute - Add a gateway to a VNet (Azure portal)'
description: This tutorial walks you through adding a virtual network gateway to a VNet for ExpressRoute using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 03/03/2021
ms.author: duau
ms.custom: seodec18

---
# Tutorial: Configure a virtual network gateway for ExpressRoute using the Azure portal
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> * [Video - Azure portal](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-a-vpn-gateway-for-your-virtual-network)
> 

This tutorial walks you through the steps to add a virtual network gateway for a pre-existing VNet. This article walks you through the steps to add, resize, and remove a virtual network (VNet) gateway for a pre-existing VNet. The steps for this configuration are specifically for VNets that were created using the Resource Manager deployment model that will be used in an ExpressRoute configuration. For more information about virtual network gateways and gateway configuration settings for ExpressRoute, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md). 

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a gateway subnet.
> - Create Virtual Network gateway.

## Prerequisites

The steps for this task use a VNet based on the values in the following configuration reference list. We use this list in our example steps. You can copy the list to use as a reference, replacing the values with your own.

**Configuration reference list**

* Virtual Network Name = "TestVNet"
* Virtual Network address space = 192.168.0.0/16
* Subnet Name = "FrontEnd" 
	* Subnet address space = "192.168.1.0/24"
* Resource Group = "TestRG"
* Location = "East US"
* Gateway Subnet name: "GatewaySubnet" You must always name a gateway subnet *GatewaySubnet*.
	* Gateway Subnet address space = "192.168.200.0/26"
* Gateway Name = "ERGW"
* Gateway Public IP Name = "MyERGWVIP"
* Gateway type = "ExpressRoute" This type is required for an ExpressRoute configuration.

You can view a [Video](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-a-vpn-gateway-for-your-virtual-network) of these steps before beginning your configuration.

> [!IMPORTANT]
> IPv6 support for private peering is currently in **Public Preview**. If you would like to connect your virtual network to an ExpressRoute circuit with IPv6-based private peering configured, please make sure that your virtual network is dual stack and follows the guidelines for [IPv6 for Azure VNet](https://docs.microsoft.com/azure/virtual-network/ipv6-overview).
> 
> 

## Create the gateway subnet

1. In the [portal](https://portal.azure.com), navigate to the Resource Manager virtual network for which you want to create a virtual network gateway.
1. In the **Settings** section of your VNet, select **Subnets** to expand the Subnet settings.
1. In the **Subnets** settings, select **+ Gateway subnet** to add a gateway subnet. 
   
    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/add-gateway-subnet.png" alt-text="Add the gateway subnet":::

1. The **Name** for your subnet is automatically filled in with the value 'GatewaySubnet'. This value is required in order for Azure to recognize the subnet as the gateway subnet. Adjust the autofilled **Address range** values to match your configuration requirements. We recommend creating a gateway subnet with a /27 or larger (/26, /25, and so on.).

    If you are using a dual stack virtual network and plan to use IPv6-based private peering over ExpressRoute, click **Add IP6 address space** and input **IPv6 address range** values.

    Then, select **OK** to save the values and create the gateway subnet.

    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/add-subnet-gateway.png" alt-text="Adding the subnet":::

## Create the virtual network gateway

1. In the portal, on the left side, select **Create a resource**, and type 'Virtual Network Gateway' in search. Locate **Virtual network gateway** in the search return and select the entry. On the **Virtual network gateway** page, select **Create**.
1. On the **Create virtual network gateway** page, enter, or select these settings:

    | Setting | Value |
    | --------| ----- |
    | Subscription | Verify that the correct subscription is selected. |
    | Resource Group | The resource group will automatically be chosen once you select the virtual network. | 
    | Name | Name your gateway. This isn't the same as naming a gateway subnet. It's the name of the gateway object you're creating.|
    | Region | Change the **Region** field to point to the location where your virtual network is located. If the location isn't pointing to the region where your virtual network is, the virtual network won't appear in the 'Choose a virtual network' dropdown. |
    | Gateway type | Select **ExpressRoute**|
    | SKU | Select the gateway SKU from the dropdown. |
    | Virtual network | Select *TestVNet*. |
    | Public IP address | Select **Create new**.|
    | Public IP address name | Provide a name for the public IP address. |

    > [!IMPORTANT]
    > If you plan to use IPv6-based private peering over ExpressRoute, make sure to select an AZ SKU (ErGw1AZ, ErGw2AZ, ErGw3AZ) for **SKU**.
    > 
    > 

1. Select **Review + Create**, and then **Create** to begin creating the gateway. The settings are validated and the gateway deploys. Creating virtual network gateway can take up to 45 minutes to complete.

    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway.png" alt-text="Create virtual network gateway page fields":::

## Clean up resources

If you no longer need the ExpressRoute gateway, locate the gateway in the virtual network resource group and select **Delete**. Ensure the gateway doesn't have any connections to a circuit.

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/delete-gateway.png" alt-text="Delete virtual network gateway":::

## Next steps
After you've created the VNet gateway, you can link your VNet to an ExpressRoute circuit. 

> [!div class="nextstepaction"]
> [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
