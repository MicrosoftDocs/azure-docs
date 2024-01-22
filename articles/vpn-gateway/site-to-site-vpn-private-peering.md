---
title: 'Site-to-Site VPN connections over ExpressRoute private peering'
titleSuffix: Azure VPN Gateway
description: Learn how to configure site-to-site VPN connections over ExpressRoute private peering in order to encrypt traffic.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc

---
# Configure a Site-to-Site VPN connection over ExpressRoute private peering

You can configure a Site-to-Site VPN to a virtual network gateway over an ExpressRoute private peering using an RFC 1918 IP address. This configuration provides the following benefits:

* Traffic over private peering is encrypted.

* Point-to-site users connecting to a virtual network gateway can use ExpressRoute (via the Site-to-Site tunnel) to access on-premises resources.

* It's possible to deploy Site-to-Site VPN connections over ExpressRoute private peering at the same time as Site-to-Site VPN connections via the Internet on the same VPN gateway.

This feature is available for the following SKUs:

* VpnGw1AZ, VpnGw2AZ, VpnGw3AZ, VpnGw4AZ, VpnGw5AZ with standard public IP with one or more zones

  >[!NOTE]
  >This feature is supported on gateways with a standard public IP only.
  >

## Prerequisites

To complete this configuration, verify that you meet the following prerequisites:

* You have a functioning ExpressRoute circuit that is linked to the VNet where the VPN gateway is (or will be) created.

* You can reach resources over RFC1918 (private) IP in the VNet over the ExpressRoute circuit.

## <a name="routing"></a>Routing

**Figure 1** shows an example of VPN connectivity over ExpressRoute private peering. In this example, you see a network within the on-premises network that is connected to the Azure hub VPN gateway over ExpressRoute private peering. An important aspect of this configuration is the routing between the on-premises networks and Azure over both the ExpressRoute and VPN paths.

Figure 1

:::image type="content" source="media/site-to-site-vpn-private-peering/routing.png" alt-text="Figure 1":::

Establishing connectivity is straightforward:

1. Establish ExpressRoute connectivity with an ExpressRoute circuit and private peering.

1. Establish the VPN connectivity using the steps in this article.

### Traffic from on-premises networks to Azure

For traffic from on-premises networks to Azure, the Azure prefixes are advertised via both the ExpressRoute private peering BGP, and the VPN BGP if BGP is configured on your VPN Gateway. The result is two network routes (paths) toward Azure from the on-premises networks:

• One network route over the IPsec-protected path.

• One network route directly over ExpressRoute without IPsec protection.

To apply encryption to the communication, you must make sure that for the VPN-connected network in **Figure 1**, Azure routes via the on-premises VPN gateway are preferred over the direct ExpressRoute path.

### Traffic from Azure to on-premises networks

The same requirement applies to the traffic from Azure to on-premises networks. To ensure that the IPsec path is preferred over the direct ExpressRoute path (without IPsec), you have two options:

• **Advertise more specific prefixes on the VPN BGP session for the VPN-connected network**. You can advertise a larger range that encompasses the VPN-connected network over ExpressRoute private peering, then more specific ranges in the VPN BGP session. For example, advertise 10.0.0.0/16 over ExpressRoute, and 10.0.1.0/24 over VPN.

• **Advertise disjoint prefixes for VPN and ExpressRoute**. If the VPN-connected network ranges are disjoint from other ExpressRoute connected networks, you can advertise the prefixes in the VPN and ExpressRoute BGP sessions respectively. For example, advertise 10.0.0.0/24 over ExpressRoute, and 10.0.1.0/24 over VPN.

In both of these examples, Azure will send traffic to 10.0.1.0/24 over the VPN connection rather than directly over ExpressRoute without VPN protection.

>[!Warning]
>If you advertise the same prefixes over both ExpressRoute and VPN connections, >Azure will use the ExpressRoute path directly without VPN protection.
>

## <a name="portal"></a>Portal steps

1. Configure a Site-to-Site connection. For steps, see the [Site-to-site configuration](./tutorial-site-to-site-portal.md) article. Be sure to pick a gateway with a Standard Public IP. 

   :::image type="content" source="media/site-to-site-vpn-private-peering/gateway.png" alt-text="Gateway Private IPs":::
1. Enable Private IPs on the gateway. Select **Configuration**, then set **Gateway Private IPs** to **Enabled**. Select **Save** to save your changes.
1. On the **Overview** page, select **See More** to view the private IP address. Write down this information to use later in the configuration steps.

   :::image type="content" source="media/site-to-site-vpn-private-peering/gateway-overview.png" alt-text="Overview page" lightbox="media/site-to-site-vpn-private-peering/gateway-overview.png":::
1. To enable **Use Azure Private IP Address** on the connection, select  **Configuration**. Set **Use Azure Private IP Address** to **Enabled**, then select **Save**.

   :::image type="content" source="media/site-to-site-vpn-private-peering/connection.png" alt-text="Gateway Private IPs - Enabled":::
1. Use the private IP that you wrote down in step 3 as the remote IP on your on-premises firewall to establish the Site-to-Site tunnel over the ExpressRoute private peering.

   >[!NOTE]
   > Configurig BGP on your VPN Gateway is not required to achieve a VPN connection over ExpressRoute private peering.
   >

## <a name="powershell"></a>PowerShell steps

1. Configure a Site-to-Site connection. For steps, see the [Configure a Site-to-Site VPN](./tutorial-site-to-site-portal.md) article. Be sure to pick a gateway with a Standard Public IP.
1. Set the flag to use the private IP on the gateway using the following PowerShell commands:

   ```azurepowershell-interactive
   $Gateway = Get-AzVirtualNetworkGateway -Name <name of gateway> -ResourceGroup <name of resource group>

   Set-AzVirtualNetworkGateway -VirtualNetworkGateway $Gateway -EnablePrivateIpAddress $true
   ```

   You should see a public and a private IP address. Write down the IP address under the “TunnelIpAddresses” section of the output. You'll use this information in a later step.
1. Set the connection to use the private IP address by using the following PowerShell command:

   ```azurepowershell-interactive
   $Connection = get-AzVirtualNetworkGatewayConnection -Name <name of the connection> -ResourceGroupName <name of resource group>

   Set-AzVirtualNetworkGatewayConnection --VirtualNetworkGatewayConnection $Connection -UseLocalAzureIpAddress $true
   ```
1. From your firewall, ping the private IP that you wrote down in step 2. It should be reachable over the ExpressRoute private peering.
1. Use this private IP as the remote IP on your on-premises firewall to establish the Site-to-Site tunnel over the ExpressRoute private peering.

## Next steps

For more information about VPN Gateway, see [What is VPN Gateway?](vpn-gateway-about-vpngateways.md)
