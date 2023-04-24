---
title: 'Add multiple VPN Gateway site-to-site connections to a VNet: Azure portal'
description: Learn how to add additional site-to-site connections to a VPN gateway.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 04/10/2023
ms.author: cherylmc

---
# Add additional S2S connections to a VNet: Azure portal

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md)
> * [PowerShell (classic)](vpn-gateway-multi-site.md)
>

This article helps you add additional site-to-site (S2S) connections to a VPN gateway that has an existing connection. This architecture is often referred to as a "multi-site" configuration. You can add a S2S connection to a VNet that already has a S2S connection, point-to-site connection, or VNet-to-VNet connection. There are some limitations when adding connections. Check the [Prerequisites](#before) section in this article to verify before you start your configuration.

:::image type="content" source="./media/vpn-gateway-howto-multi-site-to-site-resource-manager-portal/multi-site.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connection with multiple sites." lightbox="./media/vpn-gateway-howto-multi-site-to-site-resource-manager-portal/multi-site.png":::

**About ExpressRoute/site-to-site coexisting connections**

* You can use the steps in this article to add a new VPN connection to an already existing ExpressRoute/site-to-site coexisting connection.
* You can't use the steps in this article to configure a new ExpressRoute/site-to-site coexisting connection. To create a new coexisting connection see: [ExpressRoute/S2S coexisting connections](../expressroute/expressroute-howto-coexist-resource-manager.md).

## <a name="before"></a>Prerequisites

Verify the following items:

* You're NOT configuring a new coexisting ExpressRoute and VPN Gateway site-to-site connection.
* You have a virtual network that was created using the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) with an existing connection.
* The virtual network gateway for your VNet is RouteBased. If you have a PolicyBased VPN gateway, you must delete the virtual network gateway and create a new VPN gateway as RouteBased.
* None of the address ranges overlap for any of the VNets that this VNet is connecting to.
* You have compatible VPN device and someone who is able to configure it. See [About VPN Devices](vpn-gateway-about-vpn-devices.md). If you aren't familiar with configuring your VPN device, or are unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you.
* You have an externally facing public IP address for your VPN device.

## <a name="configure"></a>Configure a connection

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.
1. Select **All resources** and locate your **virtual network gateway** from the list of resources and select it.
1. On the **Virtual network gateway** page, select **Connections**.

   :::image type="content" source="./media/vpn-gateway-howto-multi-site-to-site-resource-manager-portal/connections.png" alt-text="VPN gateway connections":::
1. On the **Connections** page, select **+Add**.
1. This opens the **Add connection** page.

   :::image type="content" source="./media/vpn-gateway-howto-multi-site-to-site-resource-manager-portal/add-connection.png" alt-text="Add connection page":::
1. On the **Add connection** page, fill out the following fields:

   * **Name:** The name you want to give to the site you're creating the connection to.
   * **Connection type:** Select **Site-to-site (IPsec)**.

## <a name="local"></a>Add a local network gateway

1. For the **Local network gateway** field, select ***Choose a local network gateway***. This opens the **Choose local network gateway** page.
1. Select **+ Create new** to open the **Create local network gateway** page.

   :::image type="content" source="./media/vpn-gateway-howto-multi-site-to-site-resource-manager-portal/create-local-network-gateway.png" alt-text="Create local network gateway page":::
1. On the **Create local network gateway** page, fill out the following fields:

   * **Name:** The name you want to give to the local network gateway resource.
   * **Endpoint:** The public IP address of the VPN device on the site that you want to connect to, or the FQDN of the endpoint. If you want to create a connection to another VPN gateway, you can use the IP address of the other gateway in this field.
   * **Address space:** The address space that you want to be routed to the new local network site.
1. Select **OK** on the **Create local network gateway** page to save the changes.

## <a name="part3"></a>Add the shared key

1. After creating the local network gateway, return to the **Add connection** page.
1. Complete the remaining fields. For the **Shared key (PSK)**, you can either get the shared key from your VPN device, or make one up here and then configure your VPN device to use the same shared key. The important thing is that the keys are exactly the same.

## <a name="create"></a>Create the connection

1. At the bottom of the page, select **OK** to create the connection. The connection begins creating immediately.
1. Once the connection completes, you can view and verify it.

## <a name="verify"></a>View and verify the VPN connection

[!INCLUDE [Verify the connection](../../includes/vpn-gateway-verify-connection-portal-include.md)]

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual machines learning paths](/training/paths/deploy-a-website-with-azure-virtual-machines/).
