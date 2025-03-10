---
author: cherylmc
ms.author: cherylmc
ms.date: 11/04/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

The client address pool is a range of private IP addresses that you specify. The clients that connect over a point-to-site VPN dynamically receive an IP address from this range. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or the VNet that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

1. In the Azure portal, go to your VPN gateway.
1. On the page for your gateway, in the left pane, select **Point-to-site configuration**.
1. Click **Configure now** to open the configuration page.

   :::image type="content" source="./media/vpn-gateway-client-address-pool/configuration-address-pool.png" alt-text="Screenshot of Point-to-site configuration page - address pool." lightbox="./media/vpn-gateway-client-address-pool/configuration-address-pool.png":::

1. On the **Point-to-site configuration** page, in the **Address pool** box, add the private IP address range that you want to use. VPN clients dynamically receive an IP address from the range that you specify. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.
1. Continue to the next section to configure more settings.