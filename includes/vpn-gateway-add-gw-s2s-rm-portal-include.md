1. On the left side of the portal page, click **+** and type 'Virtual Network Gateway' in search. In **Results**, locate and click **Virtual network gateway**. At the bottom of the **Virtual network gateway** blade, click **Create**. This opens the **Create virtual network gateway** blade.
2. On the **Create virtual network gateway** blade, fill in the values for your virtual network gateway.

  ![Create virtual network gateway blade fields](./media/vpn-gateway-add-gw-s2s-rm-portal-include/newgw.png "New gateway")
3. **Name**: Name your gateway. This is not the same as naming a gateway subnet. It's the name of the gateway object you are creating.
4. **Gateway type**: Select **VPN**. VPN gateways use the virtual network gateway type **VPN**. 
5. **VPN type**: Select the VPN type that is specified for your configuration. Most configurations require a Route-based VPN type.
6. **SKU**: Select the gateway SKU from the dropdown. The SKUs listed in the dropdown depend on the VPN type you select.
7. **Location**: You may need to scroll to see Location. Adjust the **Location** field to point to the location where your virtual network is located. If the location is not pointing to the region where your virtual network resides, the virtual network will not appear in the next step 'Choose a virtual network' dropdown.
8. **Virtual network**: Choose the virtual network to which you want to add this gateway. Click **Virtual network** to open the **Choose a virtual network** blade. Select the VNet. If you don't see your VNet, make sure the **Location** field is pointing to the region in which your virtual network is located.
9. **Create public IP address**: This blade creates a public IP address object to which a public IP address will be dynamically assigned. Click **Public IP address** to open the **Choose public IP address** blade. Click **+Create New** to open the **Create public IP address blade**. Input a name for your public IP address. Click **OK** to save your changes to this blade. The IP address is dynamically assigned when the VPN gateway is created. VPN Gateway currently only supports *Dynamic* Public IP address allocation. However, this does not mean that the IP address changes after it has been assigned to your VPN gateway. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

  ![Create public IP](./media/vpn-gateway-add-gw-s2s-rm-portal-include/createpip.png "Create PIP")
10. **Subscription**: Verify that the correct subscription is selected.
11. **Resource group**: This setting is determined by the Virtual Network that you select. 
12. Don't adjust the **Location** after you've specified the previous settings.
13. Verify the settings. You can select **Pin to dashboard** at the bottom of the blade if you want your gateway to appear on the dashboard.
14. Click **Create** to begin creating the gateway. The settings will be validated and you'll see the "Deploying Virtual network gateway" tile on the dashboard. Creating a gateway can take up to 45 minutes. You may need to refresh your portal page to see the completed status.
    
  ![Create gateway](./media/vpn-gateway-add-gw-s2s-rm-portal-include/creategw.png "Create gateway")
15. After the gateway is created, view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway will appear as a connected device. You can click the connected device (your virtual network gateway) to view more information.