To create a local network gateway, follow the steps below:

1. Use **Browse** and fildter to locate the **Local network gateways** blade, then click **Add**.
2. On the **Create local network gateways blade**, **Name** your local network gateway object. For this example, we'll name the local network gateway *GW1LocalNet*.
3. Configure an **IP address** for your gateway. This is the IP address of the external VPN device that you want to connect to. It cannot be behind NAT and has to be reachable by Azure. This is the device IP address that your Azure gateway will connect to.
4. **Address Space** refers to the address ranges on your local (typically on-premises) network. You can add multiple address space ranges. The ranges that you enter here cannot overlap any of the address space ranges that you are using for any of the virtual networks that will communicate through the gateway.  You will need to coordinate with your on-premises configuration as well as with your Azure virtual network address spaces. 
5. For **Subscription**, verify that the correct subscription is showing.
6. For **Resource Group**, select the resource group that you want to use. You can either create a new resource group, or select one that you have already created. To create a new resource group, type the name in the box. To select a resource group that you've already created, click **Resource Group** to open the **Resource group** blade, and then select the resource group that you want to use.
7. For **Location**, verify that the location is the same as the virtual network gateway that you will associate this with.
8. Leave "Pin to dashboard" selected if you want to find this local network gateway easily from the dashboard.
9. Click **Create** to create the local network gateway. You'll see "Deploying Local network gateway" on your dashboard. This shouldn't take very long to create.
