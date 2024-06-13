---
title: 'Tutorial - Create S2S VPN connection between on-premises network and Azure virtual network: Azure portal'
description: In this tutorial, you learn how to create a VPN Gateway site-to-site IPsec connection between your on-premises network and a virtual network.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.author: cherylmc
ms.service: vpn-gateway
ms.topic: tutorial
ms.date: 04/16/2024

#customer intent: As a network engineer, I want to create a site-to-site VPN connection between my on-premises location and my Azure virtual network.
---

# Tutorial: Create a site-to-site VPN connection in the Azure portal

In this tutorial, you use the Azure portal to create a site-to-site (S2S) VPN gateway connection between your on-premises network and a virtual network. You can also create this configuration by using [Azure PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md) or the [Azure CLI](vpn-gateway-howto-site-to-site-resource-manager-cli.md).

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Diagram that shows site-to-site VPN gateway cross-premises connections." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

In this tutorial, you:

> [!div class="checklist"]
> * Create a virtual network.
> * Create a VPN gateway.
> * Create a local network gateway.
> * Create a VPN connection.
> * Verify the connection.
> * Connect to a virtual machine.

## Prerequisites

* You need an Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).
* Verify that you have an externally facing public IPv4 address for your VPN device.
* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure will route to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.

## <a name="CreatVNet"></a>Create a virtual network

In this section, you create a virtual network by using the following values:

* **Resource group**: TestRG1
* **Name**: VNet1
* **Region**: (US) East US
* **IPv4 address space**: 10.1.0.0/16
* **Subnet name**: FrontEnd
* **Subnet address space**: 10.1.0.0/24

[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

After you create your virtual network, you can optionally configure Azure DDoS Protection. Azure DDoS Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. For more information about Azure DDoS Protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

## Create a gateway subnet

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

## <a name="VNetGateway"></a>Create a VPN gateway

In this step, you create the virtual network gateway for your virtual network. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

### Create the gateway

Create a virtual network gateway (VPN gateway) by using the following values:

* **Name**: VNet1GW
* **Region**: East US
* **Gateway type**: VPN
* **SKU**: VpnGw2
* **Generation**: Generation 2
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.255.0/27
* **Public IP address**: Create new
* **Public IP address name**: VNet1GWpip
* **Enable active-active mode**: Disabled
* **Configure BGP**: Disabled

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]

[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

You can see the deployment status on the **Overview** page for your gateway. A gateway can take up to 45 minutes to fully create and deploy. After the gateway is created, you can view the IP address that was assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

### <a name="view"></a>View the public IP address

You can view the gateway public IP address on the **Overview** page for your gateway.

:::image type="content" source="./media/tutorial-create-gateway-portal/address.png" alt-text="Screenshot that shows the public IP address." lightbox= "./media/tutorial-create-gateway-portal/address.png":::

To see more information about the public IP address object, select the name/IP address link next to **Public IP address**.

## <a name="LocalNetworkGateway"></a>Create a local network gateway

The local network gateway is a specific object that represents your on-premises location (the site) for routing purposes. You give the site a name by which Azure can refer to it, and then specify the IP address of the on-premises VPN device to which you create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later.


> [!Note]
> The local network gateway object is deployed in Azure, not to your on-premises location.

Create a local network gateway by using the following values:

* **Name**: Site1
* **Resource Group**: TestRG1
* **Location**: East US

[!INCLUDE [Add a local network gateway](../../includes/vpn-gateway-add-local-network-gateway-portal-include.md)]

## <a name="VPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When you configure your VPN device, you need the following values:

* **Shared key**: This shared key is the same one that you specify when you create your site-to-site VPN connection. In our examples, we use a very simple shared key. We recommend that you generate a more complex key to use.
* **Public IP address of your virtual network gateway**: You can view the public IP address by using the Azure portal, PowerShell, or the Azure CLI. To find the public IP address of your VPN gateway by using the Azure portal, go to **Virtual network gateways** and then select the name of your gateway.

[!INCLUDE [Configure a VPN device](../../includes/vpn-gateway-configure-vpn-device-include.md)]

## <a name="CreateConnection"></a>Create VPN connections

Create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device.

Create a connection by using the following values:

* **Local network gateway name**: Site1
* **Connection name**: VNet1toSite1
* **Shared key**: For this example, you use **abc123**. But you can use whatever is compatible with your VPN hardware. The important thing is that the values match on both sides of the connection.

[!INCLUDE [Add a site-to-site connection](../../includes/vpn-gateway-add-site-to-site-connection-portal-include.md)]

### <a name="configure-connect"></a>Configure more connection settings (optional)

You can configure more settings for your connection, if necessary. Otherwise, skip this section and leave the defaults in place. For more information, see [Configure custom IPsec/IKE connection policies](ipsec-ike-policy-howto.md).

[!INCLUDE [Configure additional connection settings with screenshot](../../includes/vpn-gateway-connection-settings-portal-include.md)]

## <a name="VerifyConnection"></a>Verify the VPN connection

[!INCLUDE [Verify the connection](../../includes/vpn-gateway-verify-connection-portal-include.md)]

## <a name="connectVM"></a>Connect to a virtual machine

[!INCLUDE [Connect to a VM](../../includes/vpn-gateway-connect-vm.md)]

## Optional steps

This section describes options that are available to you.

### <a name="resize"></a>Resize a gateway SKU

There are specific rules about resizing versus changing a gateway SKU. In this section, you resize the SKU. For more information, see [Resize or change gateway SKUs](about-gateway-skus.md#resizechange).

[!INCLUDE [resize a gateway](../../includes/vpn-gateway-resize-gw-portal-include.md)]

### <a name="reset"></a>Reset a gateway

Resetting an Azure VPN gateway is helpful if you lose cross-premises VPN connectivity on one or more site-to-site VPN tunnels. In this situation, your on-premises VPN devices are all working correctly but aren't able to establish IPsec tunnels with the Azure VPN gateways.

[!INCLUDE [reset a gateway](../../includes/vpn-gateway-reset-gw-portal-include.md)]

### <a name="addconnect"></a>Add another connection

You can create a connection to multiple on-premises sites from the same VPN gateway. If you want to configure multiple connections, the address spaces can't overlap between any of the connections.

1. To add another connection, go to the VPN gateway and then select **Connections** to open the **Connections** page.
1. Select **+ Add** to add your connection. Adjust the connection type to reflect either network-to-network (if connecting to another virtual network gateway) or site-to-site.
1. If you're connecting by using site-to-site and you haven't already created a local network gateway for the site you want to connect to, you can create a new one.
1. Specify the shared key that you want to use and then select **OK** to create the connection.

### Update a connection shared key

You can specify a different shared key for your connection. In the portal, go to the connection. Change the shared key on the **Authentication** page.

### <a name="additional"></a>More configuration considerations

You can customize site-to-site configurations in various ways. For more information, see the following articles:

* For information about BGP, see the [BGP overview](vpn-gateway-bgp-overview.md) and [How to configure BGP](vpn-gateway-bgp-resource-manager-ps.md).
* For information about forced tunneling, see [About forced tunneling](vpn-gateway-forced-tunneling-rm.md).
* For information about highly available active-active connections, see [Highly available cross-premises and VNet-to-VNet connectivity](vpn-gateway-highlyavailable.md).
* For information about how to limit network traffic to resources in a virtual network, see [Network security](../virtual-network/network-security-groups-overview.md).
* For information about how Azure routes traffic between Azure, on-premises, and internet resources, see [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).

## Clean up resources

If you're not going to continue to use this application or go to the next tutorial, delete these resources.

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.
1. Select **Delete resource group**.
1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

After you configure a site-to-site connection, you can add a point-to-site connection to the same gateway.

> [!div class="nextstepaction"]
> [Point-to-site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
