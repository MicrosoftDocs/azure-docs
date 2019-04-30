---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 12/19/2018
 ms.author: cherylmc
 ms.custom: include file
---
1. In the portal, click **+Create a resource**.
2. In the search box, type **Local network gateway**, then press **Enter** to search. This will return a list of results. Click **Local network gateway**, then click the **Create** button to open the **Create local network gateway** page.

   ![Create the local network gateway](./media/vpn-gateway-add-local-network-gateway-portal-include/create-local-network-gateway.png "Create the local network gateway")

3. On the **Create local network gateway page**, specify the values for your local network gateway.

   - **Name:** Specify a name for your local network gateway object.
   - **IP address:** This is the public IP address of the VPN device that you want Azure to connect to. Specify a valid public IP address. If you don't have the IP address right now, you can use the values shown in the example, but you'll need to go back and replace your placeholder IP address with the public IP address of your VPN device. Otherwise, Azure will not be able to connect.
   - **Address Space** refers to the address ranges for the network that this local network represents. You can add multiple address space ranges. Make sure that the ranges you specify here do not overlap with ranges of other networks that you want to connect to. Azure will route the address range that you specify to the on-premises VPN device IP address. *Use your own values here if you want to connect to your on-premises site, not the values shown in the example*.
   - **Configure BGP settings:** Use only when configuring BGP. Otherwise, don't select this.
   - **Subscription:** Verify that the correct subscription is showing.
   - **Resource Group:** Select the resource group that you want to use. You can either create a new resource group, or select one that you have already created.
   - **Location:** Select the location that this object will be created in. You may want to select the same location that your VNet resides in, but you are not required to do so.

4. When you have finished specifying the values, click the **Create** button at the bottom of the page to create the local network gateway.
