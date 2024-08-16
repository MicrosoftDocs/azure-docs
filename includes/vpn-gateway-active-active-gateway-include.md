---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 07/11/2024
 ms.author: cherylmc

---

In this configuration, each Azure gateway instance has a unique public IP address, and each will establish an IPsec/IKE S2S VPN tunnel to your on-premises VPN device specified in your local network gateway and connection. Both VPN tunnels are actually part of the same connection. You'll still need to configure your on-premises VPN device to accept or establish two S2S VPN tunnels to those two Azure VPN gateway public IP addresses.

Because the Azure gateway instances are in active-active configuration, the traffic from your Azure virtual network to your on-premises network will be routed through both tunnels simultaneously, even if your on-premises VPN device might favor one tunnel over the other. For a single TCP or UDP flow, Azure attempts to use the same tunnel when sending packets to your on-premises network. However, your on-premises network could use a different tunnel to send packets to Azure.

When a planned maintenance or unplanned event happens to one gateway instance, the IPsec tunnel from that instance to your on-premises VPN device will be disconnected. The corresponding routes on your VPN devices should be removed or withdrawn automatically so that the traffic will be switched over to the other active IPsec tunnel. On the Azure side, the switch over will happen automatically from the affected instance to the active instance.