---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/04/2018
 ms.author: cherylmc
 ms.custom: include file
---
1. In the portal, navigate to the virtual network for which you want to create a virtual network gateway.
2. In the **Settings** section of your VNet page, click **Subnets** to expand the Subnets page.
3. On the **Subnets** page, click **+Gateway subnet** at the top to open the **Add subnet** page.

   ![Add the gateway subnet](./media/vpn-gateway-add-gateway-subnet-portal-include/gateway-subnet.png "Add the gateway subnet")
  
4. The **Name** for your subnet is automatically filled in with the value 'GatewaySubnet'. The GatewaySubnet value is required in order for Azure to recognize the subnet as the gateway subnet. Adjust the auto-filled **Address range** values to match your configuration requirements.

   ![Adding the gateway subnet](./media/vpn-gateway-add-gateway-subnet-portal-include/add-gateway-subnet.png "Adding the gateway subnet")
  
5. To create the subnet, click **OK** at the bottom of the page.
