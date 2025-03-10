---
title: 'Configure a virtual network gateway for ExpressRoute using Azure portal'
description: This article walks you through adding a virtual network gateway to a virtual network for ExpressRoute using the Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 12/06/2024
ms.author: duau
ms.custom:
  - reference_regions
  - ignite-2023
---

# Configure a virtual network gateway for ExpressRoute using the Azure portal
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> 

This article walks you through the steps to add and remove a virtual network gateway for a pre-existing virtual network (virtual network). The steps for this configuration apply to VNets that were created using the Resource Manager deployment model for an ExpressRoute configuration. For more information about virtual network gateways and gateway configuration settings for ExpressRoute, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md).

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing an ExpressRoute gateway connected to the ExpressRoute circuit." lightbox="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png":::

## Prerequisites

The steps for this tutorial use the values in the following configuration reference list. You can copy the list to use as a reference, replacing the values with your own.

**Configuration reference list**

* Virtual Network Name = "vnet-1"
* Virtual Network address space = 10.0.0.0/16
* Subnet Name = "default" 
	* Subnet address space = "10.0.0.0/24"
* Resource Group = "vnetdemo"
* Location = "West US 3"
* Gateway Subnet name: "GatewaySubnet" You must always name a gateway subnet *GatewaySubnet*.
	* Gateway Subnet address space = "10.0.1.0/24"
* Gateway Name = "myERGwScale"
* Gateway Public IP Name = "myERGwScaleIP"
* Gateway type = "ExpressRoute" This type is required for an ExpressRoute configuration.

    > [!IMPORTANT]
    > ExpressRoute Virtual Network Gateways no longer support the Basic Public IP SKU. Associate a Standard IP to create the Virtual Network Gateway.
    >

## Create the gateway subnet

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to the virtual network for which you want to create a virtual network gateway.

1. In the **Settings** section of your virtual network, select **Subnets** to expand the Subnet settings.

1. Select **+ Gateway subnet** to add a gateway subnet. 

1. The **Name** for your subnet is automatically filled in with the value 'GatewaySubnet'. This value is required in order for Azure to recognize the subnet as the gateway subnet. Adjust the autofilled **Address range** values to match your configuration requirements. **You need to create the GatewaySubnet with a /27 or larger** (/26, /25, and so on.). /28 or smaller subnets are not supported for new deployments. If you plan on connecting 16 ExpressRoute circuits to your gateway, you **must** create a gateway subnet of /26 or larger.

    If you're using a dual stack virtual network and plan to use IPv6-based private peering over ExpressRoute, select **Add IPv6 address space** and enter **IPv6 address range** values.

    Then, select **OK** to save the values and create the gateway subnet.

## Create the virtual network gateway

1. In the portal, on the left side, select **Create a resource**, and type 'Virtual Network Gateway' in search. Locate **Virtual network gateway** in the search return and select the entry. On the **Virtual network gateway** page, select **Create**.

1. On the **Create virtual network gateway** page, enter or select these settings:

    | Setting | Value |
    | --------| ----- |
    | **Project details** |  |
    | Subscription | Verify that the correct subscription is selected. |
    | Resource Group | The resource group gets automatically chosen once you select the virtual network. |
    | **Instance details** |  |
    | Name | Name your gateway. This name isn't the same as naming a gateway subnet. It's the name of the gateway resource you're creating.|
    | Region | Change the **Region** field to point to the location where your virtual network is located. If the region isn't pointing to the location where your virtual network is, the virtual network doesn't appear in the **Virtual network** dropdown. <br>  If you want to create the gateway in an [Azure Extended Zone](../extended-zones/overview.md), select **Deploy to an Azure Extended Zone**.|
    | Gateway type | Select **ExpressRoute**.|
    | SKU | Select a gateway SKU from the dropdown. For more information, see [ExpressRoute gateway SKUs](expressroute-about-virtual-network-gateways.md#gwsku). |
    | Minimum Scale Units | This option is only available when you select the **ErGwScale (Preview)** SKU. Enter the minimum number of scale units you want to use. For more information, see [ExpressRoute Gateway Scale Units](expressroute-about-virtual-network-gateways.md#expressroute-scalable-gateway-preview). |
    | Maximum Scale Units | This option is only available when you select the **ErGwScale (Preview)** SKU. Enter the maximum number of scale units you want to use. For more information, see [ExpressRoute Gateway Scale Units](expressroute-about-virtual-network-gateways.md#expressroute-scalable-gateway-preview). |
    | Virtual network | Select *vnet-1*. |
    | **Public IP address** | |
    | Public IP address | Select **Create new**.|
    | Public IP address name | Provide a name for the public IP address. |
    | Public IP address SKU | Select **Standard**. Scalable gateways only support Standard SKU IP address. |
    | Assignment | By default, all Standard SKU public IP addresses are assigned statically. |
    | Availability zone | Select if you want to use availability zones. For more information, see [Zone redundant gateways](../vpn-gateway/about-zone-redundant-vnet-gateways.md).|

    > [!IMPORTANT]
    > If you plan to use IPv6-based private peering over ExpressRoute, please make sure to create your gateway with a Public IP address of type Standard, Static using the [PowerShell instructions](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).
    > 

    > [!NOTE]
    > To create the gateway in an [Azure Extended Zone](../extended-zones/overview.md), you must first [request access to the Extended Zone](../extended-zones/request-access.md). Once you have access, you can create the gateway.
    >
    > The following considerations apply when creating a virtual network gateway in an Extended Zone:
    > - Availability Zones aren't supported in Azure Extended Zones.
    > - The following SKUs are currently supported in Azure Extended Zones: *Standard*, *HighPerformance*, *UltraPerformance*.
    > - Local SKU circuit isn't supported with gateways in Azure Extended Zone.

1. Select **Review + Create**, and then **Create** to begin creating the gateway. The settings are validated and the gateway deploys. Creating virtual network gateway can take up to 45 minutes to complete.

## Enable or disable VNet to VNet or VNet to Virtual WAN traffic through ExpressRoute

You can enable or disable VNet to VNet or VNet to WAN connectivity through ExpressRoute. By default, VNet to VNet or VNet to WAN traffic is disabled through ExpressRoute. You can enable this traffic by using the following steps.

1. In the Azure portal, navigate to the ExpressRoute virtual network gateway.

1. In the **Settings** section, select **Configuration**.

1. In the **Configuration** section, select the checkbox for **Allow traffic from remote virtual networks**. You can also enable traffic from remote Virtual WAN networks by selecting the checkbox for **Allow traffic from remote Virtual WAN network**.

    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/allow-remote-virtual-network-wan.png" alt-text="Screenshot that shows how to enable VNet to VNet and VNet to WAN traffic.":::

These steps will need to be completed on all virtual networks that need to communicate with each other through ExpressRoute.

## Clean up resources

If you no longer need the ExpressRoute gateway, locate the gateway in the virtual network resource group and select **Delete**. Ensure the gateway doesn't have any connections to a circuit.

## Next steps

In this tutorial, you learned how to create a virtual network gateway. For more information about virtual network gateways, see: [ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

To learn how to link your virtual network to an ExpressRoute circuit, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
