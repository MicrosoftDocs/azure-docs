---
title: 'Design highly available gateway connectivity'
titleSuffix: Azure VPN Gateway
description: Learn about highly available configuration options for VPN Gateway.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 07/24/2024
ms.author: cherylmc

---
# Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections

This article helps you understand how to design highly available gateway connectivity for cross-premises and VNet-to-VNet connections.

## <a name = "activestandby"></a>About VPN gateway redundancy

Every Azure VPN gateway consists of two instances in an active-standby configuration by default. For any planned maintenance or unplanned disruption that happens to the active instance, the standby instance takes over automatically (failover), and resumes the S2S VPN or VNet-to-VNet connections. The switch over causes a brief interruption. For planned maintenance, the connectivity should be restored within 10 to 15 seconds. For unplanned issues, the connection recovery is longer, about 1 to 3 minutes in the worst case. For P2S VPN client connections to the gateway, the P2S connections are disconnected and the users need to reconnect from the client machines.

:::image type="content" source="./media/vpn-gateway-highlyavailable/active-standby.png" alt-text="Diagram shows an on-premises site with private I P subnets and on-premises V P N connected to an active Azure V P N gateway to connect to subnets hosted in Azure, with a standby gateway available.":::

## Highly Available cross-premises

To provide better availability for your cross premises connections, there are a few options available:

* Multiple on-premises VPN devices
* Active-active Azure VPN gateway
* Combination of both

### <a name = "activeactiveonprem"></a>Multiple on-premises VPN devices

You can use multiple VPN devices from your on-premises network to connect to your Azure VPN gateway, as shown in the following diagram:

:::image type="content" source="./media/vpn-gateway-highlyavailable/multiple-onprem-vpns.png" alt-text="Diagram shows multiple on-premises sites with private IP subnets and on-premises VPN connected to an active Azure VPN gateway to connect to subnets hosted in Azure, with a standby gateway available.":::

This configuration provides multiple active tunnels from the same Azure VPN gateway to your on-premises devices in the same location. In this configuration, the Azure VPN gateway is still in active-standby mode, so the same failover behavior and brief interruption will still happen. But this configuration guards against failures or interruptions on your on-premises network and VPN devices.

There are some requirements and constraints:

1. You need to create multiple S2S VPN connections from your VPN devices to Azure. When you connect multiple VPN devices from the same on-premises network to Azure, create one local network gateway for each VPN device, and one connection from your Azure VPN gateway to each local network gateway.
1. The local network gateways corresponding to your VPN devices must have unique public IP addresses in the "GatewayIpAddress" property.
1. BGP is required for this configuration. Each local network gateway representing a VPN device must have a unique BGP peer IP address specified in the "BgpPeerIpAddress" property.
1. Use BGP to advertise the same prefixes of the same on-premises network prefixes to your Azure VPN gateway. The traffic is forwarded through these tunnels simultaneously.
1. You must use Equal-cost multi-path routing (ECMP).
1. Each connection is counted against the maximum number of tunnels for your Azure VPN gateway. See the [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#gwsku) page for the latest information about tunnels, connections, and throughput.

### Active-active VPN gateways

You can create an Azure VPN gateway in an active-active mode configuration. In active-active mode, both instances of the gateway VMs establish S2S VPN tunnels to your on-premises VPN device, as shown the following diagram:

:::image type="content" source="./media/vpn-gateway-highlyavailable/active-active.png" alt-text="Diagram shows an on-premises site with private I P subnets and on-premises V P N connected to two active Azure V P N gateway to connect to subnets hosted in Azure.":::

[!INCLUDE [active-active gateways](../../includes/vpn-gateway-active-active-gateway-include.md)]

### Dual-redundancy: active-active VPN gateways for both Azure and on-premises networks

The most reliable option is to combine the active-active gateways on both your network and Azure, as shown in the following diagram.

:::image type="content" source="./media/vpn-gateway-highlyavailable/dual-redundancy.png" alt-text="Diagram shows a Dual Redundancy scenario.":::

In this type of configuration, you set up the Azure VPN gateway in an active-active configuration. You create two local network gateways and two connections for your two on-premises VPN devices. The result is a full mesh connectivity of 4 IPsec tunnels between your Azure virtual network and your on-premises network.

All gateways and tunnels are active from the Azure side, so the traffic is spread among all 4 tunnels simultaneously, although each TCP or UDP flow follows the same tunnel or path from the Azure side. By spreading the traffic, you might see slightly better throughput over the IPsec tunnels. However, the primary goal of this configuration is high availability. Due to the statistical nature of traffic spreading, it's difficult to provide the measurement on how different application traffic conditions might affect the aggregate throughput.

This topology requires two local network gateways and two connections to support the pair of on-premises VPN devices, and BGP is required to allow simultaneous connectivity on the two connections to the same on-premises network. These requirements are the same as the [Multiple on-premises VPN devices](#activeactiveonprem) scenario. 

## Highly Available VNet-to-VNet

The same active-active configuration can also apply to Azure VNet-to-VNet connections. You can create active-active VPN gateways for each virtual network, then connect them together to form the same full mesh connectivity of 4 tunnels between the two VNets. This is shown in the following diagram:

:::image type="content" source="./media/vpn-gateway-highlyavailable/vnet-to-vnet.png" alt-text="Diagram shows two Azure regions hosting private I P subnets and two Azure V P N gateways through which the two virtual sites connect.":::

This type of configuration ensures there are always a pair of tunnels between the two virtual networks for any planned maintenance events, providing even better availability. Even though the same topology for cross-premises connectivity requires two connections, the VNet-to-VNet topology in this example only needs one connection for each gateway. BGP is optional unless transit routing over the VNet-to-VNet connection is required.

## Next steps

Configure an active-active VPN gateway using the [Azure portal](tutorial-create-gateway-portal.md) or [PowerShell](create-gateway-powershell.md).

