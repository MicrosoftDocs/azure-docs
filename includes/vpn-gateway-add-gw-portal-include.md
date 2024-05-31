---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/16/2024
 ms.author: cherylmc
---

1. In **Search resources, services, and docs (G+/)**, enter **virtual network gateway**. Locate **Virtual network gateway** in the **Marketplace** search results and select it to open the **Create virtual network gateway** page.

1. On the **Basics** tab, fill in the values for **Project details** and **Instance details**.

   :::image type="content" source="./media/vpn-gateway-add-gw-portal/instance-details.png" alt-text="Screenshot that shows the Instance fields." lightbox="./media/vpn-gateway-add-gw-portal/instance-details.png":::

   * **Subscription**: Select the subscription you want to use from the dropdown list.
   * **Resource group**: This setting is autofilled when you select your virtual network on this page.
   * **Name**: Name your gateway. Naming your gateway isn't the same as naming a gateway subnet. It's the name of the gateway object you're creating.
   * **Region**: Select the region in which you want to create this resource. The region for the gateway must be the same as the virtual network.
   * **Gateway type**: Select **VPN**. VPN gateways use the virtual network gateway type **VPN**.
   * **SKU**: From the dropdown list, select the gateway SKU that supports the features you want to use. See [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md#gwsku). In the portal, the SKUs available in the dropdown list depend on the `VPN type` you select. [!INCLUDE [Basic SKU](vpn-gateway-basic-sku.md)]
   * **Generation**: Select the generation you want to use. We recommend using a Generation2 SKU. For more information, see [Gateway SKUs](../articles/vpn-gateway/vpn-gateway-about-vpngateways.md#gwsku).
   * **Virtual network**: From the dropdown list, select the virtual network to which you want to add this gateway. If you can't see the virtual network for which you want to create a gateway, make sure you selected the correct subscription and region in the previous settings.
   * **Gateway subnet address range** or **Subnet**: The gateway subnet is required to create a VPN gateway.

     At this time, this field can show various different settings options, depending on the virtual network address space and whether you already created a subnet named **GatewaySubnet** for your virtual network.

     If you don't have a gateway subnet *and* you don't see the option to create one on this page, go back to your virtual network and create the gateway subnet. Then, return to this page and configure the VPN gateway.
