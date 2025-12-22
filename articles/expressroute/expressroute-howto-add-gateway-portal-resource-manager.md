---
title: 'Configure a virtual network gateway for ExpressRoute using the Azure portal'
description: Learn how to create, configure, and manage virtual network gateways for ExpressRoute using the Azure portal. This guide covers gateway creation, SKU upgrades, and configuration settings.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 07/25/2025
ms.author: duau
ms.custom:
  - reference_regions
  - sfi-image-nochange
---

# Configure a virtual network gateway for ExpressRoute using the Azure portal
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> 

This article shows you how to create, configure, and manage a virtual network gateway for ExpressRoute using the Azure portal. You can use these steps to create a gateway for a virtual network created with the Resource Manager deployment model. For more information about virtual network gateways and gateway configuration settings, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md).

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing an ExpressRoute gateway connected to the ExpressRoute circuit." lightbox="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png":::

## Prerequisites

Before you begin, make sure you have:

- An Azure account with an active subscription.
- An existing virtual network where you want to create the gateway. For more information, see [Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal).
- Sufficient address space in your virtual network for a gateway subnet (/27 or larger).

> [!IMPORTANT]
> ExpressRoute virtual network gateways no longer support the Basic public IP SKU. Azure automatically creates an auto-assigned Standard public IP address and associates it with your virtual network gateway. For more information, see [ExpressRoute auto-assigned public IP](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip).

### Example configuration values

This article uses the following example values for reference. You can use these values to create a test environment, or refer to them to better understand the examples:

- **Virtual network name**: vnet-1
- **Virtual network address space**: 10.0.0.0/16
- **Subnet name**: default
- **Subnet address space**: 10.0.0.0/24
- **Resource group**: vnetdemo
- **Location**: West US 3
- **Gateway subnet name**: GatewaySubnet (you must always name the gateway subnet *GatewaySubnet*)
- **Gateway subnet address space**: 10.0.1.0/24
- **Gateway name**: myERGwScale
- **Gateway type**: ExpressRoute

<a name="create-the-gateway-subnet"></a>
## Create a gateway subnet

Before you create a virtual network gateway, you need to create a gateway subnet in your virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your virtual network.

1. In the **Settings** section, select **Subnets**.

1. Select **+ Gateway subnet**.

1. The **Name** field is automatically populated with **GatewaySubnet**. This name is required for Azure to recognize the subnet as a gateway subnet.

1. Configure the **Address range** to meet your requirements:
   - For most configurations, use a /27 or larger subnet (/26, /25, etc.).
   - Subnets /28 or smaller aren't supported for new deployments.
   - If you plan to connect 16 or more ExpressRoute circuits to your gateway, you must use a /26 or larger subnet.

1. (Optional) If you're using a dual stack virtual network with IPv6-based private peering:
   1. Select **Add IPv6 address space**.
   1. Enter the **IPv6 address range** values.

1. Select **Save** to create the gateway subnet.

<a name="create-the-virtual-network-gateway"></a>
## Create a virtual network gateway

1. In the Azure portal, select **Create a resource**.

1. In the search box, enter **Virtual Network Gateway**, and then press Enter.

1. Select **Virtual network gateway** from the results, and then select **Create**.

1. On the **Create virtual network gateway** page, enter or select the following settings:

    | Setting | Value |
    | --------| ----- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | This field is automatically populated after you select your virtual network. |
    | **Instance details** |  |
    | Name | Enter a name for your gateway. This name is for the gateway resource, not the gateway subnet. |
    | Region | Select the region where your virtual network is located. If you want to deploy in an [Azure Extended Zone](../extended-zones/overview.md), select **Deploy to an Azure Extended Zone**. |
    | Gateway type | Select **ExpressRoute**. |
    | SKU | Select a gateway SKU. For more information about SKUs, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md#gwsku). |
    | Minimum Scale Units | (ErGwScale SKU only) Enter the minimum number of scale units (1-40). For more information, see [About ExpressRoute scalable gateway](scalable-gateway.md). |
    | Maximum Scale Units | (ErGwScale SKU only) Enter the maximum number of scale units (1-40). For more information, see [About ExpressRoute scalable gateway](scalable-gateway.md). |
    | Virtual network | Select your virtual network. |
    | **Public IP address** | Azure automatically assigns a Standard public IP address to your ExpressRoute gateway. For more information, see [Auto-assigned public IP](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip). |

    > [!IMPORTANT]
    > If you plan to use IPv6-based private peering over ExpressRoute, create your gateway with a Standard, Static public IP address using the [PowerShell instructions](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).

    > [!NOTE]
    > To create a gateway in an [Azure Extended Zone](../extended-zones/overview.md), you must first [request access to the Extended Zone](../extended-zones/request-access.md).
    >
    > The following considerations apply to virtual network gateways in Extended Zones:
    > - Availability Zones aren't supported in Azure Extended Zones.
    > - Only the following SKUs are supported: Standard, HighPerformance, and UltraPerformance.
    > - Local SKU circuits aren't supported with gateways in Azure Extended Zones.

1. Select **Review + create** to validate your configuration.

1. After validation passes, select **Create** to begin the deployment.

The deployment can take up to 45 minutes to complete.

<a name="enable-or-disable-vnet-to-vnet-or-vnet-to-virtual-wan-traffic-through-expressroute"></a>
## Enable VNet-to-VNet or VNet-to-Virtual WAN traffic

By default, virtual network-to-virtual network (VNet-to-VNet) and VNet-to-Virtual WAN traffic is disabled through ExpressRoute. You can enable this connectivity using the following steps.

> [!NOTE]
> You must complete these steps on all virtual networks that need to communicate with each other through ExpressRoute.

1. In the Azure portal, go to your ExpressRoute virtual network gateway.

1. Under **Settings**, select **Configuration**.

1. Select one or both of the following options:
   - **Allow traffic from remote virtual networks** - Enables VNet-to-VNet traffic through ExpressRoute.
   - **Allow traffic from remote Virtual WAN network** - Enables VNet-to-Virtual WAN traffic through ExpressRoute.

    :::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/allow-remote-virtual-network-wan.png" alt-text="Screenshot showing the Configuration page with checkboxes for allowing traffic from remote virtual networks and Virtual WAN networks.":::

1. Select **Save** to apply your changes.

<a name="upgrade-the-gateway-sku"></a>
## Upgrade a gateway SKU

You can upgrade your gateway SKU to a higher-performance SKU without deleting and recreating the gateway.

1. In the Azure portal, go to your ExpressRoute virtual network gateway.

1. Under **Settings**, select **Configuration**.

1. In the **SKU** dropdown, select your desired SKU.

1. Select **Save** to apply the change.

You can upgrade between the following SKU types:

- **Non-availability zone SKUs**: Standard, HighPerformance, UltraPerformance

    [![Screenshot showing the Configuration page for upgrading non-availability zone gateway SKUs.](./media/expressroute-howto-add-gateway-portal-resource-manager/non-az-upgrade.png)](./media/expressroute-howto-add-gateway-portal-resource-manager/non-az-upgrade.png)

- **Availability zone-enabled SKUs**: ErGw1Az, ErGw2Az, ErGw3Az

    [![Screenshot showing the Configuration page for upgrading availability zone-enabled gateway SKUs.](./media/expressroute-howto-add-gateway-portal-resource-manager/az-enabled-upgrade.png)](./media/expressroute-howto-add-gateway-portal-resource-manager/az-enabled-upgrade.png)

> [!NOTE]
> For all other scenarios (such as downgrading SKUs or switching between availability zone and non-availability zone SKUs), you must delete and recreate the gateway. This process incurs downtime.

## Delete a gateway

If you no longer need your ExpressRoute gateway, you can delete it.

> [!IMPORTANT]
> Before you delete a gateway, make sure it doesn't have any connections to ExpressRoute circuits.

1. In the Azure portal, go to your virtual network gateway.

1. Select **Delete**.

1. Confirm the deletion.

## Next steps

- [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md)
- [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md)
- [About ExpressRoute scalable gateway](scalable-gateway.md)


