---
title: 'Tutorial - Create S2S VPN connection between on-premises network and Azure virtual network: Azure portal'
description: In this tutorial, you learn how to create a VPN Gateway site-to-site IPsec connection between your on-premises network and a virtual network.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: tutorial
ms.date: 08/13/2024

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

* If you're unfamiliar with the IP address ranges located in your on-premises network configuration, you need to coordinate with someone who can provide those details for you. When you create this configuration, you must specify the IP address range prefixes that Azure routes to your on-premises location. None of the subnets of your on-premises network can overlap with the virtual network subnets that you want to connect to.
* VPN devices:
  * Make sure you have a compatible VPN device and someone who can configure it. For more information about compatible VPN devices and device configuration, see [About VPN devices](vpn-gateway-about-vpn-devices.md).
  * Verify that you have an externally facing public IPv4 address for your VPN device.
  * Verify that your VPN device supports active-active mode gateways. This article creates an active-active mode VPN gateway, which is recommended for highly available connectivity. Active-active mode specifies that both gateway VM instances are active and uses two public IP addresses, one for each gateway VM instance. You configure your VPN device to connect to the IP address for each gateway VM instance. If your VPN device doesn't support this mode, don't enable this mode for your gateway. For more information, see [Design highly available connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md) and [About active-active mode VPN gateways](about-active-active-gateways.md).

## <a name="CreatVNet"></a>Create a virtual network

In this section, you create a virtual network by using the following values:

* **Resource group**: TestRG1
* **Name**: VNet1
* **Region**: (US) East US
* **IPv4 address space**: 10.1.0.0/16
* **Subnet name**: FrontEnd
* **Subnet address space**: 
[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

After you create your virtual network, you can optionally configure Azure DDoS Protection. Azure DDoS Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. For more information about Azure DDoS Protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

## Create a gateway subnet

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="VNetGateway"></a>Create a VPN gateway

In this step, you create a virtual network gateway (VPN gateway) for your virtual network. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

### Create a VPN gateway

Create a virtual network gateway (VPN gateway) by using the following values:

* **Name**: VNet1GW
* **Gateway type**: VPN
* **SKU**: VpnGw2AZ
* **Generation**: Generation 2
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.255.0/27
* **Public IP address**: Create new
* **Public IP address name:** VNet1GWpip1
* **Public IP address SKU:** Standard
* **Assignment:** Static
* **Second Public IP address name:** VNet1GWpip2
* **Enable active-active mode**: Enabled
* **Configure BGP**: Disabled

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-azgw-portal-include.md)]

[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-azgw-pip-portal-include.md)]

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the **Overview** page for your gateway.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

### <a name="view"></a>View public IP address

To view the IP address associated with each virtual network gateway VM instance, go to your virtual network gateway in the portal.

1. Go to your virtual network gateway **Properties** page (not the Overview page). You might need to expand **Settings** to see the **Properties** page in the list.
1. If your gateway in active-passive mode, you'll only see one IP address. If your gateway is in active-active mode, you'll see two public IP addresses listed, one for each gateway VM instance. When you create a site-to-site connection, you must specify each IP address when configuring your VPN device because both gateway VMs are active.
1. To view more information about the IP address object, click the associated IP address link.

## <a name="LocalNetworkGateway"></a>Create a local network gateway

The local network gateway is a specific object deployed to Azure that represents your on-premises location (the site) for routing purposes. You give the site a name by which Azure can refer to it, and then specify the IP address of the on-premises VPN device to which you create a connection. You also specify the IP address prefixes that are routed through the VPN gateway to the VPN device. The address prefixes you specify are the prefixes located on your on-premises network. If your on-premises network changes or you need to change the public IP address for the VPN device, you can easily update the values later. You create a separate local network gateway for each VPN device that you want to connect to. Some highly available connectivity designs specify multiple on-premises VPN devices.

Create a local network gateway by using the following values:

* **Name**: Site1
* **Resource Group**: TestRG1
* **Location**: East US

[!INCLUDE [Add a local network gateway](../../includes/vpn-gateway-add-local-network-gateway-portal-include.md)]

## <a name="VPNDevice"></a>Configure your VPN device

Site-to-site connections to an on-premises network require a VPN device. In this step, you configure your VPN device. When you configure your VPN device, you need the following values:

* **Shared key**: This shared key is the same one that you specify when you create your site-to-site VPN connection. In our examples, we use a simple shared key. We recommend that you generate a more complex key to use.
* **Public IP addresses of your virtual network gateway instances**: Obtain the IP address for each VM instance. If your gateway is in active-active mode, you'll have an IP address for each gateway VM instance. Be sure to configure your device with both IP addresses, one for each active gateway VM. Active-standby mode gateways have only one IP address.

> [!NOTE]
> [!INCLUDE [active-active establish two tunnels](../../includes/vpn-gateway-active-active-tunnel.md)]

[!INCLUDE [Configure a VPN device](../../includes/vpn-gateway-configure-vpn-device-include.md)]

## <a name="CreateConnection"></a>Create VPN connections

Create a site-to-site VPN connection between your virtual network gateway and your on-premises VPN device. If you're using an active-active mode gateway (recommended), each gateway VM instance has a separate IP address. To properly configure [highly available connectivity](vpn-gateway-highlyavailable.md), you must establish a tunnel between each VM instance and your VPN device. Both tunnels are part of the same connection.

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

### <a name="reset"></a>Reset a gateway

Resetting an Azure VPN gateway is helpful if you lose cross-premises VPN connectivity on one or more site-to-site VPN tunnels. In this situation, your on-premises VPN devices are all working correctly but aren't able to establish IPsec tunnels with the Azure VPN gateways. If you need to reset an active-active gateway, you can reset both instances using the portal. You can also use PowerShell or CLI to reset each gateway instance separately using instance VIPs. For more information, see [Reset a connection or a gateway](reset-gateway.md#reset-a-gateway).

[!INCLUDE [reset a gateway](../../includes/vpn-gateway-reset-gw-portal-include.md)]

### <a name="addconnect"></a>Add another connection

A gateway can have multiple connections. If you want to configure connections to multiple on-premises sites from the same VPN gateway, the address spaces can't overlap between any of the connections.

1. If you're connecting using a site-to-site VPN and you don't have a local network gateway for the site you want to connect to, create another local network gateway and specify the site details. For more information, see [Create a local network gateway](#LocalNetworkGateway).
1. To add a connection, go to the VPN gateway and then select **Connections** to open the **Connections** page.
1. Select **+ Add** to add your connection. Adjust the connection type to reflect either VNet-to-VNet (if connecting to another virtual network gateway) or site-to-site.
1. Specify the shared key that you want to use and then select **OK** to create the connection.

### Update a connection shared key

You can specify a different shared key for your connection.

1. In the portal, go to the connection.
1. Change the shared key on the **Authentication** page.
1. Save your changes.
1. Update your VPN device with the new shared key as necessary.

### <a name="resize"></a>Resize or change a gateway SKU

You can resize a gateway SKU, or you can change the gateway SKU. There are specific rules regarding which option is available, depending on the SKU your gateway is currently using. For more information, see [Resize or change gateway SKUs](about-gateway-skus.md#resizechange).

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
