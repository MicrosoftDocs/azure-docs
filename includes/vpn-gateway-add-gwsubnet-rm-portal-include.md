---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/30/2018
 ms.author: cherylmc
 ms.custom: include file
---
1. In the [Azure portal](https://portal.azure.com), select the Resource Manager virtual network for which you want to create a virtual network gateway.

2. In the **Settings** section of your virtual network page, select **Subnets** to expand the **Subnets** page.

3. On the **Subnets** page, select **Gateway subnet** to open the **Add subnet** page.

   ![Add the gateway subnet](./media/vpn-gateway-add-gwsubnet-rm-portal-include/addgwsub.png "Add the gateway subnet")

4. The **Name** for your subnet is automatically autofilled with the value *GatewaySubnet*. This value is required for Azure to recognize the subnet as the gateway subnet. Adjust the autofilled **Address range** values to match your configuration requirements, then select **OK** to create the subnet.

   ![Adding the subnet](./media/vpn-gateway-add-gwsubnet-rm-portal-include/addsubnetgw.png "Adding the subnet")
