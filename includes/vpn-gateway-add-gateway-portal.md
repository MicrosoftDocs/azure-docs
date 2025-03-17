---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 03/12/2025
 ms.author: cherylmc

# The numbers in this include are correct. They add on to sections in multiple articles that are already numbered. Please do not change the numbers in any way.
---


1. In **Search resources, services, and docs (G+/)**, enter **virtual network gateway**. Locate **Virtual network gateway** in the **Marketplace** search results and select it to open the **Create virtual network gateway** page.

   :::image type="content" source="./media/vpn-gateway-add-gateway-portal/vpn-gateway-portal.png" alt-text="Screenshot that shows the Instance fields." lightbox="./media/vpn-gateway-add-gateway-portal/vpn-gateway-portal.png":::

2. On the **Basics** tab, fill in the values for **Project details** and **Instance details**.

   | Setting | Value |
   |---|---|
   | Name | Example: VNet1GW |
   | Region | The region for the gateway must be the same as the virtual network. |
   | Gateway type | Select **VPN**. VPN gateways use the virtual network gateway type **VPN**. |
   | SKU | Example: VpnGw2AZ. We recommend that you select a [Gateway SKU](../articles/vpn-gateway/about-gateway-skus.md) that ends in AZ if your region supports [availability zones](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md).|
   | Generation | **Generation 2** |
   | Virtual network | Example: VNet1. If your virtual network isn't available in the dropdown, you need to adjust the region you selected. |
   | Subnet | Example: 10.1.255.0/27, A subnet named **GatewaySubnet** is required to create a VPN gateway. If the gateway subnet doesn't autopopulate, *and* you don't see the option to create one on this page, go back to your virtual network page and create the gateway subnet.|