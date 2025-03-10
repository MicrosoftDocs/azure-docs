---
title: 'About active-active VPN gateways'
titleSuffix: Azure VPN Gateway
description: Learn about active-active VPN gateways, including configuration and design.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 11/01/2024
ms.author: cherylmc 

---
# About active-active mode VPN gateways

Azure VPN gateways can be configured as active-standby or active-active. This article explains active-active mode gateway configurations and highlights the benefits of using active-active mode.

## Why create an active-active gateway?

VPN gateways consist of two instances in an active-standby configuration unless you specify active-active mode.

### Active-standby mode behavior

In active-standby mode, during any planned maintenance or unplanned disruption affecting the active instance, the following behavior occurs:

* **S2S and VNet-to-VNet**: The standby instance takes over automatically (failover), and resumes the site-to-site (S2S) VPN or VNet-to-VNet connections. This switch over causes a brief interruption. For planned maintenance, connectivity is restored quickly. For unplanned issues, the connection recovery is longer.
* **P2S**: For point-to-site (P2S) VPN client connections to the gateway, P2S connections are disconnected. Users need to reconnect from the client machines.

To avoid interruptions, create your gateway in **active-active** mode, or switch an active-standby gateway to active-active.

### Active-active mode design

In an active-active configuration for a S2S connection, both instances of the gateway VMs establish S2S VPN tunnels to your on-premises VPN device, as shown the following diagram:

:::image type="content" source="./media/vpn-gateway-highlyavailable/active-active.png" alt-text="Diagram shows an on-premises site with private IP subnets and an on-premises gateway connected to two VPN gateway instances.":::

In this configuration, each Azure gateway instance has a unique public IP address, and each will establish an IPsec/IKE S2S VPN tunnel to the on-premises VPN device. Both tunnels are part of the same connection. Configure your on-premises VPN device to accept two S2S VPN tunnels, one for each gateway instance. P2S connections to gateways in active-active mode require no additional configuration.

In an active-active configuration, Azure routes traffic from your virtual network to your on-premises network through both tunnels simultaneously, even if your on-premises VPN device might favor one tunnel over the other. For a single TCP or UDP flow, Azure attempts to use the same tunnel when sending packets to your on-premises network. However, your on-premises network might use a different tunnel to send packets back to Azure.

When a planned maintenance or unplanned event happens to one gateway instance, the IPsec tunnel from that instance to your on-premises VPN device will be disconnected. The corresponding routes on your VPN devices should be removed or withdrawn automatically so that the traffic will be switched over to the other active IPsec tunnel. On the Azure side, the switch over will happen automatically from the affected instance to the other active instance.

> [!NOTE]
> [!INCLUDE [establish two tunnels](../../includes/vpn-gateway-active-active-tunnel.md)]

### Dual-redundancy active-active mode design

The most reliable design option is to combine the active-active gateways on both your network and Azure, as shown in the following diagram.

:::image type="content" source="./media/vpn-gateway-highlyavailable/dual-redundancy.png" alt-text="Diagram shows a Dual Redundancy scenario.":::

In this configuration, you create and set up the Azure VPN gateway in active-active mode. You create two local network gateways and two connections for your two on-premises VPN devices. The result is a full mesh connectivity of four IPsec tunnels between your Azure virtual network and your on-premises network.

All gateways and tunnels are active from the Azure side, so the traffic is spread among all four tunnels simultaneously, although each TCP or UDP flow will follow the same tunnel or path from the Azure side. Even though by spreading the traffic, you might see slightly better throughput over the IPsec tunnels, the primary goal of this configuration is for high availability. And due to the statistical nature of the spreading, it's difficult to provide the measurement on how different application traffic conditions affect the aggregate throughput.

This topology requires two local network gateways and two connections to support the pair of on-premises VPN devices. For more information, see [About highly available connectivity](vpn-gateway-highlyavailable.md).

## Configure an active-active mode gateway

You can configure an active-active gateway using the [Azure portal](tutorial-create-gateway-portal.md), PowerShell, or CLI. You can also change an active-standby gateway to active-active mode. For steps, see [Change a gateway to active-active](gateway-change-active-active.md).

An active-active gateway has slightly different configuration requirements than an active-standby gateway.

* You can't configure an active-active gateway using the Basic gateway SKU.
* The VPN must be route based. It can't be policy based.
* Two public IP addresses are required. Both must be **Standard SKU** public IP addresses that are assigned as **Static**.
* An active-active gateway configuration costs the same as an active-standby configuration. However, active-active configurations require two public IP addresses instead of one. See [IP Address pricing](https://azure.microsoft.com/pricing/details/ip-addresses/).

## Reset an active-active mode gateway

If you need to reset an active-active gateway, you can reset both instances using the portal. You can also use PowerShell or CLI to reset each gateway instance separately using instance VIPs. See [Reset a connection or a gateway](reset-gateway.md#ps).

## Next steps

* [Configure an active-active gateway - Azure portal](tutorial-create-gateway-portal.md)
* [Change a gateway to active-active mode](gateway-change-active-active.md)
* [Reset an active-active gateway](reset-gateway.md#ps)
