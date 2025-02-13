---
title: 'Tutorial: Create an ExpressRoute association to Azure Virtual WAN'
description: In this tutorial, learn how to use Azure Virtual WAN to create ExpressRoute connections to Azure and on-premises environments.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: tutorial
ms.date: 12/12/2024
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect my corporate on-premises network(s) to my VNets using Virtual WAN and ExpressRoute.
---
# Tutorial: Create an ExpressRoute association to Virtual WAN - Azure portal

This tutorial shows you how to use Virtual WAN to connect to your resources in Azure over an ExpressRoute circuit. For more conceptual information about ExpressRoute in Virtual WAN, see [About ExpressRoute in Virtual WAN](virtual-wan-expressroute-about.md). You can also create this configuration using the [PowerShell](expressroute-powershell.md) steps.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual WAN
> * Create a hub and a gateway
> * Connect a VNet to a hub
> * Connect a circuit to a hub gateway
> * Test connectivity
> * Change a gateway size
> * Advertise a default route

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network in the Azure portal, see the [Quickstart](../virtual-network/quick-create-portal.md).

* Your virtual network doesn't have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead to the Virtual WAN hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub can't overlap with any of your existing virtual networks that you connect to. It also can't overlap with your address ranges that you connect to on-premises. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* The following ExpressRoute circuit SKUs can be connected to the hub gateway: Local, Standard, and Premium.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="openvwan"></a>Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="hub"></a>Create a virtual hub and gateway

In this section, you'll create an ExpressRoute gateway for your virtual hub. You can either create the gateway when you [create a new virtual hub](#newhub), or you can create the gateway in an [existing hub](#existinghub) by editing it.


### <a name="newhub"></a>To create a new virtual hub and a gateway

Create a new virtual hub. Once a hub is created, you'll be charged for the hub, even if you don't attach any sites.

#### Basics page

[!INCLUDE [Create a hub](../../includes/virtual-wan-hub-basics.md)]

#### ExpressRoute page

[!INCLUDE [Create ExpressRoute gateway](../../includes/virtual-wan-hub-expressroute-gateway.md)]

### <a name="existinghub"></a>To create a gateway in an existing hub

You can also create a gateway in an existing hub by editing the hub.

1. Go to the virtual WAN.
1. In the left pane, select **Hubs**.
1. On the **Virtual WAN | Hubs** page, click the hub that you want to edit.
1. On the **Virtual HUB** page, at the top of the page, click **Edit virtual hub**.
1. On the **Edit virtual hub** page, select the checkbox **Include ExpressRoute gateway** and adjust any other settings that you require.
1. Select **Confirm** to confirm your changes. It takes about 30 minutes for the hub and hub resources to fully create.

### To view a gateway

Once you've created an ExpressRoute gateway, you can view gateway details. Navigate to the hub, select **ExpressRoute**, and view the gateway.

:::image type="content" source="./media/virtual-wan-expressroute-portal/viewgw.png" alt-text="Screenshot shows viewing a gateway." border="false":::

## <a name="connectvnet"></a>Connect your VNet to the hub

In this section, you create the peering connection between your hub and a VNet. Repeat these steps for each VNet that you want to connect.

1. On the page for your virtual WAN, click **Virtual network connection**.
2. On the virtual network connection page, click **+Add connection**.
3. On the **Add connection** page, fill in the following fields:

    * **Connection name** - Name your connection.
    * **Hubs** - Select the hub you want to associate with this connection.
    * **Subscription** - Verify the subscription.
    * **Virtual network** - Select the virtual network you want to connect to this hub. The virtual network can't have an already existing virtual network gateway (neither VPN nor ExpressRoute).

## <a name="connectcircuit"></a>Connect your circuit to the hub gateway

Once the gateway is created, you can connect an [ExpressRoute circuit](../expressroute/expressroute-howto-circuit-portal-resource-manager.md) to it.

### To connect the circuit to the hub gateway

First, verify that your circuit's peering status is provisioned in the **ExpressRoute circuit -> Peerings** page in Portal. Then, go to the **Virtual hub -> Connectivity -> ExpressRoute** page. If you have access in your subscription to an ExpressRoute circuit, you'll see the circuit you want to use in the list of circuits. If you don’t see any circuits, but have been provided with an authorization key and peer circuit URI, you can redeem and connect a circuit. See [To connect by redeeming an authorization key](#authkey).

1. Select the circuit.
1. Select **Connect circuit(s)**.

### <a name="authkey"></a>To connect by redeeming an authorization key

Use the authorization key and circuit URI you were provided in order to connect.

1. On the ExpressRoute page, click **+Redeem authorization key**
2. On the Redeem authorization key page, fill in the values.
3. Select **Add** to add the key.
4. View the circuit. A redeemed circuit only shows the name (without the type, provider and other information) because it is in a different subscription than that of the user.

## To test connectivity

After the circuit connection is established, the hub connection status will indicate 'this hub', implying the connection is established to the hub ExpressRoute gateway. Wait approximately 5 minutes before you test connectivity from a client behind your ExpressRoute circuit, for example, a VM in the VNet that you created earlier.

## To change the size of a gateway

If you want to change the size of your ExpressRoute gateway, locate the ExpressRoute gateway inside the hub, and select the scale units from the dropdown. Save your change. It will take approximately 30 minutes to update the hub gateway.

## To advertise default route 0.0.0.0/0 to endpoints

If you would like the Azure virtual hub to advertise the default route 0.0.0.0/0 to your ExpressRoute end points, you'll need to enable 'Propagate default route'.

1. Select your **Circuit ->…-> Edit connection**.

   :::image type="content" source="./media/virtual-wan-expressroute-portal/defaultroute1.png" alt-text="Screenshot shows Edit ExpressRoute Gateway page." border="false":::
1. Select **Enable** to propagate the default route.

   :::image type="content" source="./media/virtual-wan-expressroute-portal/defaultroute2.png" alt-text="Screenshot shows enable propagate default route." border="false":::

## To see your Virtual WAN connection from the ExpressRoute circuit blade

Navigate to the **Connections** page for your ExpressRoute circuit to see each ExpressRoute gateway that your ExpressRoute circuit is connected to. If the gateway is in a different subscription than the circuit, then the **Peer** field will be the circuit authorization key.
   :::image type="content" source="./media/virtual-wan-expressroute-portal/view-expressroute-connection.png" alt-text="Screenshot shows the initial container page." lightbox="./media/virtual-wan-expressroute-portal/view-expressroute-connection.png":::

## Enable or disable VNet to Virtual WAN traffic over ExpressRoute

By default, VNet to Virtual WAN traffic is disabled over ExpressRoute. You can enable this connectivity by using the following steps.

1. In the "Edit virtual hub" blade, enable **Allow traffic from non Virtual WAN networks**.
1. In the "Virtual network gateway" blade, enable **Allow traffic from remote Virtual WAN networks.** See instructions [here.](../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#enable-or-disable-vnet-to-vnet-or-vnet-to-virtual-wan-traffic-through-expressroute)

:::image type="content" source="./media/virtual-wan-expressroute-portal/allow-non-virtual-wan-traffic.png" alt-text="Azure portal Screenshot of Virtual Hub Edit with ExpressRoute toggle for allowing traffic from non Virtual WAN networks." lightbox="./media/virtual-wan-expressroute-portal/allow-non-virtual-wan-traffic.png":::

We recommend that you keep these toggles disabled and instead create a Virtual Network connection between the standalone virtual network and Virtual WAN hub. This offers better performance and lower latency, as conveyed in our [FAQ.](virtual-wan-faq.md#when-theres-an-expressroute-circuit-connected-as-a-bow-tie-to-a-virtual-wan-hub-and-a-standalone-vnet-what-is-the-path-for-the-standalone-vnet-to-reach-the-virtual-wan-hub)

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

[!INCLUDE [Delete resources](../../includes/virtual-wan-resource-cleanup.md)]

## Next steps

Next, to learn more about ExpressRoute in Virtual WAN, see:

> [!div class="nextstepaction"]
> * [About ExpressRoute in Virtual WAN](virtual-wan-expressroute-about.md)
