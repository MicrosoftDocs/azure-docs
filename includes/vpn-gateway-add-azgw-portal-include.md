---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 07/31/2024
 ms.author: cherylmc
---


1. In **Search resources, services, and docs (G+/)**, enter **virtual network gateway**. Locate **Virtual network gateway** in the **Marketplace** search results and select it to open the **Create virtual network gateway** page.

2. On the **Basics** tab, fill in the values for **Project details** and **Instance details**.

   :::image type="content" source="./media/vpn-gateway-add-azgw-portal/instance-details.png" alt-text="Screenshot that shows the Instance fields." lightbox="./media/vpn-gateway-add-azgw-portal/instance-details.png":::

   * **Subscription**: Select the subscription you want to use from the dropdown list.
   * **Resource group**: This value is autofilled when you select your virtual network on this page.
   * **Name**: This is the name of the gateway object you're creating. This is different than the gateway subnet to which gateway resources will be deployed.
   * **Region**: Select the region in which you want to create this resource. The region for the gateway must be the same as the virtual network.
   * **Gateway type**: Select **VPN**. VPN gateways use the virtual network gateway type **VPN**.
   * **SKU**: From the dropdown list, select a [gateway SKU](../articles/vpn-gateway/about-gateway-skus.md) that supports the features you want to use.
      * We recommend that you select a SKU that ends in AZ when possible. AZ SKUs support [availability zones](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md).
      * The Basic SKU isn't available in the portal. To configure a Basic SKU gateway, you must use [PowerShell](../articles/vpn-gateway/create-gateway-basic-sku-powershell.md) or CLI.
   * **Generation**: Select **Generation2** from the dropdown.
   * **Virtual network**: From the dropdown list, select the virtual network to which you want to add this gateway. If you can't see the virtual network you want to use, make sure you selected the correct subscription and region in the previous settings.
   * **Gateway subnet address range** or **Subnet**: The gateway subnet is required to create a VPN gateway.

     Currently, this field can show different settings options, depending on the virtual network address space and whether you already created a subnet named **GatewaySubnet** for your virtual network.

     If you don't have a gateway subnet *and* you don't see the option to create one on this page, go back to your virtual network and create the gateway subnet. Then, return to this page and configure the VPN gateway.
