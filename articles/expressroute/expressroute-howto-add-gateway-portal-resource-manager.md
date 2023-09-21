---
title: 'Tutorial: Configure a virtual network gateway for ExpressRoute using Azure portal'
description: This tutorial walks you through adding a virtual network gateway to a virtual network for ExpressRoute using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: tutorial
ms.date: 08/31/2023
ms.author: duau
ms.custom: seodec18, template-tutorial

---
# Tutorial: Configure a virtual network gateway for ExpressRoute using the Azure portal
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> 

This tutorial walks you through the steps to add and remove a virtual network gateway for a pre-existing virtual network (virtual network). The steps for this configuration apply to VNets that were created using the Resource Manager deployment model for an ExpressRoute configuration. For more information about virtual network gateways and gateway configuration settings for ExpressRoute, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md).

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing an ExpressRoute gateway connected to the ExpressRoute circuit.":::

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a gateway subnet.
> - Create virtual network gateway.

## Prerequisites

The steps for this tutorial use the values in the following configuration reference list. You can copy the list to use as a reference, replacing the values with your own.

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

## Create the gateway subnet

1. In the [portal](https://portal.azure.com), navigate to the Resource Manager virtual network for which you want to create a virtual network gateway.
1. In the **Settings** section of your virtual network, select **Subnets** to expand the Subnet settings.
1. Select **+ Gateway subnet** to add a gateway subnet. 
   
    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/add-gateway-subnet.png" alt-text="Screenshot that shows the button to add the gateway subnet.":::

1. The **Name** for your subnet is automatically filled in with the value 'GatewaySubnet'. This value is required in order for Azure to recognize the subnet as the gateway subnet. Adjust the autofilled **Address range** values to match your configuration requirements. We recommend creating a gateway subnet with a /27 or larger (/26, /25, and so on.). If you plan on connecting 16 ExpressRoute circuits to your gateway, you **must** create a gateway subnet of /26 or larger.

    If you're using a dual stack virtual network and plan to use IPv6-based private peering over ExpressRoute, select **Add IP6 address space** and enter **IPv6 address range** values.

    Then, select **OK** to save the values and create the gateway subnet.

    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/add-subnet-gateway.png" alt-text="Screenshot that shows the Add subnet page for adding  the gateway subnet.":::

## Create the virtual network gateway

1. In the portal, on the left side, select **Create a resource**, and type 'Virtual Network Gateway' in search. Locate **Virtual network gateway** in the search return and select the entry. On the **Virtual network gateway** page, select **Create**.
1. On the **Create virtual network gateway** page, enter or select these settings:

    | Setting | Value |
    | --------| ----- |
    | Subscription | Verify that the correct subscription is selected. |
    | Resource Group | The resource group gets automatically chosen once you select the virtual network. | 
    | Name | Name your gateway. This name isn't the same as naming a gateway subnet. It's the name of the gateway resource you're creating.|
    | Region | Change the **Region** field to point to the location where your virtual network is located. If the region isn't pointing to the location where your virtual network is, the virtual network doesn't appear in the **Virtual network** dropdown. |
    | Gateway type | Select **ExpressRoute**|
    | SKU | Select the gateway SKU from the dropdown. |
    | Virtual network | Select *TestVNet*. |
    | Public IP address | Select **Create new**.|
    | Public IP address name | Provide a name for the public IP address. |

    > [!IMPORTANT]
    > If you plan to use IPv6-based private peering over ExpressRoute, please make sure to create your gateway with a Public IP address of type Standard, Static using the [PowerShell instructions](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).
    > 
    > 

1. Select **Review + Create**, and then **Create** to begin creating the gateway. The settings are validated and the gateway deploys. Creating virtual network gateway can take up to 45 minutes to complete.

## Clean up resources

If you no longer need the ExpressRoute gateway, locate the gateway in the virtual network resource group and select **Delete**. Ensure the gateway doesn't have any connections to a circuit.

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/delete-gateway.png" alt-text="Screenshot that shows how to delete the virtual network gateway.":::

## Next steps

In this tutorial, you learned how to create a virtual network gateway. For more information about virtual network gateways, see: [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To learn how to link your virtual network to an ExpressRoute circuit, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)