1. In the portal, from **All resources**, click **+Add**. In the **Everything** blade search box, type **Local network gateway**, then click to return a list of resources. Click **Local network gateway** to open the blade, then click **Create** to open the **Create local network gateway** blade.
   
	![create local network gateway](./media/vpn-gateway-add-lng-rm-portal-include/lng.png)

2. On the **Create local network gateway blade**, specify a **Name** for your local network gateway object. If possible, use something intuitive, such as **ClassicVNetLocal** or **TestVNet1Local**. This makes it easier for you to identify the local network gateway in the portal.
3. Specify a valid Public **IP address** for the VPN device or virtual network gateway to which you want to connect.<br>**If this local network represents an on-premises location:** Specify the Public IP address of the VPN device that you want to connect to. It cannot be behind NAT and has to be reachable by Azure.<br>**If this local network represents another VNet:** Specify the Public IP address that was assigned to the virtual network gateway for that VNet.<br>**If you don't yet have the IP address:** You can make up a valid placeholder IP address, and then come back and modify this setting before connecting.
4. **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks to which you connect.
5. For **Subscription**, verify that the correct subscription is showing.
6. For **Resource Group**, select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
7. For **Location**, select the location in which this resource will be created. You may want to select the same location that your VNet resides in, but you are not required to do so.
8. Click **Create** to create the local network gateway.

