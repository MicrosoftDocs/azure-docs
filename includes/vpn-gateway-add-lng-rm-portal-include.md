1. In the portal, navigate to **New** > **Networking** > **Local network gateway**.

	![create local network gateway](./media/vpn-gateway-add-lng-rm-portal-include/addlng250.png)

2. On the **Create local network gateway blade**, specify a **Name** for your local network gateway object.
 
3. Specify a valid public **IP address** for the VPN device or virtual network gateway to which you want to connect.<br>If this local network represents an on-premises location, this is the public IP address of the VPN device that you want to connect to. It cannot be behind NAT and has to be reachable by Azure.<br>If this local network represents another VNet, you will specify the public IP address that was assigned to the virtual network gateway for that VNet.<br>

4. **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to.
 
5. For **Subscription**, verify that the correct subscription is showing.

6. For **Resource Group**, select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.

7. For **Location**, select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.

8. Click **Create** to create the local network gateway.
