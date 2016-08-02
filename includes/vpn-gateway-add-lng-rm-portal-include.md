1. In the Azure Portal, navigate to **New** **>** **Networking** **>** **Local network gateway**.

	![create local network gateway](./media/vpn-gateway-add-lng-rm-portal-include/addlng250.png)

2. On the **Create local network gateway blade**, specify a **Name** for your local network gateway object.
 
3. Specify an **IP address** for your gateway. This is the IP address of the external VPN device that you want to connect to. It cannot be behind NAT and has to be reachable by Azure.

4. **Address Space** refers to the address ranges on your local (typically on-premises) network. You can add multiple address space ranges. The ranges that you enter here cannot overlap any of the address space ranges that you are using for any of the virtual networks that will communicate through the gateway.  You will need to coordinate with your on-premises configuration as well as with your Azure virtual network address spaces.
 
5. For **Subscription**, verify that the correct subscription is showing.

6. For **Resource Group**, select the resource group that you want to use. You can either create a new resource group, or select one that you have already created. To create a new resource group, type the name in the box. To select a resource group that you've already created, click **Resource Group** to open the **Resource group** blade, and then select the resource group that you want to use.

7. For **Location**, if you are creating a new local network gateway, you can use the same location as the virtual network gateway. But, this is not required. The local network gateway can be in a different location. 

8. Leave "Pin to dashboard" selected if you want to find this local network gateway easily from the dashboard.

9. Click **Create** to create the local network gateway. You'll see "Deploying Local network gateway" on your dashboard.

10. When the local network gateway has been created, it will open in the portal for you to view.

	
