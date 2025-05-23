---
author: cherylmc
ms.author: cherylmc
ms.date: 03/12/2025
ms.service: azure-vpn-gateway
ms.topic: include
---

The client address pool is a range of private IP addresses that you specify. The clients that connect over a point-to-site VPN dynamically receive an IP address from this range. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or the virtual network that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

1. In the Azure portal, go to your VPN gateway.
1. On the page for your gateway, in the left pane, select **Point-to-site configuration**.
1. On the **Point-to-site configuration** page, click **Configure now**.
1. On the point-to-site configuration page, you'll see the configuration box for **Address pool**.
1. In the **Address pool** box, add the private IP address range that you want to use. For example, if you add the address range `172.16.201.0/24`, connecting VPN clients receive one of the IP addresses from this range. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.

After you add the range, continue to the next sections to configure the rest of the required settings.