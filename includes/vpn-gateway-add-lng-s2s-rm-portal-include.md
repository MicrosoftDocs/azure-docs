1. In the portal, from **All resources**, click **+Add**. In the **Everything** blade search box, type **Local network gateway**, then click to search. This will return a list. Click **Local network gateway** to open the blade, then click **Create** to open the **Create local network gateway** blade.

  	![create local network gateway](./media/vpn-gateway-add-lng-s2s-rm-portal-include/createlng.png)
2. On the **Create local network gateway blade**, specify a **Name** for your local network gateway object.
3. Specify a valid public **IP address** for the VPN device or virtual network gateway to which you want to connect.<br>This is the public IP address of the VPN device that you want to connect to. It cannot be behind NAT and has to be reachable by Azure. *Use your own values, not the values shown in the screenshot*.
4. **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to. Azure will route the address range that you specify to the on-premises VPN device IP address. *Use your own values here, not the values shown in the screenshot*.
5. For **Subscription**, verify that the correct subscription is showing.
6. For **Resource Group**, select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
7. For **Location**, select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.
8. Click **Create** to create the local network gateway.