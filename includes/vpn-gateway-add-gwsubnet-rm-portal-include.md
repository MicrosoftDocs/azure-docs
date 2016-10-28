1. In the portal, navigate to the virtual network to which you want to connect a gateway.

2. In the **Settings** section of your VNet blade, click **Subnets** to expand the Subnets blade.

3. On the **Subnets** blade, click **+Gateway subnet** at the top. This will open the **Add subnet** blade. 

	![Add the gateway subnet](./media/vpn-gateway-add-gwsubnet-rm-portal-include/newgwsubnet450.png "Add the gateway subnet")

4. The **Name** for your subnet will automatically be filled in with the value 'GatewaySubnet'. This value is required in order for Azure to recognize the subnet as the gateway subnet. Adjust the auto-filled **Address range** values to match your configuration requirements.

	![Adding the subnet](./media/vpn-gateway-add-gwsubnet-rm-portal-include/addgwsubnet300.png "Adding the subnet")

6. Click **OK** at the bottom of the blade to create the subnet.

