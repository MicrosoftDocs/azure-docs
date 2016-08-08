1. In the portal, go to **New** > **Networking** > **Virtual network gateway**. This will open the **Create virtual network gateway** blade.

	![Gateway](./media/vpn-gateway-add-gw-rm-portal-include/creategw250.png)

2. On the **Create virtual network gateway** blade, in the  **Name** field, name your gateway. This is not the same as naming a gateway subnet. It's the name of the gateway object you will be creating.

3. Adjust the **Location** field to point to the location where your virtual network is located. If you don't do this, the VNet list will not show your virtual network.
 
4. Next, choose the virtual network to which you want to add this gateway. Click **Virtual network** to open the **Choose a virtual network** blade. Select the VNet. In order for the VNet to appear in the list, it must already have a valid gateway subnet.

5. Choose a public IP address. Click **Public IP address** to open the **Choose public IP address** blade. Click **+Create New** to open the **Create public IP address blade**. Input a name for your public IP address. This will create a public IP address object to which a public IP address will be dynamically assigned. <br>Click **OK** to save your changes.

5. For **Gateway type**, select the Gateway type that is specified for your configuration.

6. For **VPN type**, select the VPN type that is specified for your configuration.

7. For **Subscription**, verify that the correct subscription is selected.

8. The **Resource group** is determined by the Virtual Network that you select. 

9. Don't adjust the **Location** after you've specified the settings above. 

10. At this point, your blade will look similar to the graphic in step 1. Verify that the settings match the settings for your own configuration. You can select **Pin to dashboard** at the bottom of the blade if you want your gateway to appear on the dashboard.

11. Click **Create** to begin creating the gateway. The settings will be validated and you'll see the "Deploying Virtual network gateway" tile on the dashboard. Creating a gateway can take up to 45 minutes. You may need to refresh your portal page to see the completed status.

	![Gateway](./media/vpn-gateway-add-gw-rm-portal-include/deployvnetgw150.png)

11. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway will appear as a connected device. You can click on the connected device (your virtual network gateway) to view more information.



