---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/21/2020
 ms.author: cherylmc
 ms.custom: include file
---

1. In the portal, go to the virtual network gateway that you want to reset.
1. On the page for the virtual network gateway, select **Reset**.

   :::image type="content" source="./media/vpn-gateway-reset-gw-portal/reset.png" alt-text="Reset gateway":::
1. On the **Reset** page, select **Reset**. Once the command is issued, the current active instance of the Azure VPN gateway is rebooted immediately. Resetting the gateway will cause a gap in VPN connectivity, and may limit future root cause analysis of the issue.
