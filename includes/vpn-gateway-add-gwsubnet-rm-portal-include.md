1. In the portal, navigate to the virtual network to which you want to connect a gateway.

2. In the **Settings** section of your VNet blade, click **Subnets** to expand the Subnets blade.

3. On the **Subnets** blade, click **+Gateway subnet** at the top. This will open the **Add subnet** blade. The **Name** for your subnet will automatically be filled in with the value 'GatewaySubnet'. This value is required in order for Azure to recognize the subnet as the gateway subnet.

	![Add the gateway subnet](./media/vpn-gateway-add-gwsubnet-rm-portal-include/addgwsubnet250.png)

4. You can change the address range CIDR block if necessary. Check the specific requirements for your configuration to confirm the recommended CIDR block.

5. Click **OK** at the bottom of the blade to create the subnet.



