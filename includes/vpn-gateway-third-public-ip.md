---
 ms.topic: include
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 12/06/2024
 ms.author: cherylmc
---

If you have an active-active mode gateway, you need to specify a third public IP address to configure point-to-site. In the example, we create the third public IP address using the example value **VNet1GWpip3**. If your gateway isn't in active-active mode, you don't need to add another public IP address.

:::image type="content" source="./media/vpn-gateway-third-public-ip-portal/public-ip.png" alt-text="Screenshot of Point-to-site configuration page - public IP address." lightbox="./media/vpn-gateway-third-public-ip-portal/public-ip.png":::