1. In the portal, go to **New**, then **Browse**. Select **Virtual network gateways** from the list.
2. Click **Add**.
3. Name your gateway. This is not the same as naming a gateway subnet. This is the name of the gateway object. 
4. In **Virtual network**, select the VNet that you want to connect to this gateway.
5. In the settings for the VNet, for the **Public IP address** value, create a name your public IP address. Note that this is not asking for an IP address. The IP address will be assigned dynamically. Rather, this is the name of the IP address object that the address will be assigned to. 
6. For **VPN type**, the choices are policy-based and route-based. Be sure to select the VPN gateway type that is both supported by the configuration scenario, and, if required for your configuration, supported by the VPN gateway device you plan to use.
7. For **Resource Group**, choose **select existing** and choose the resource group that your VNet resides in, unless your configuration requires a different choice.
8. For **Location**, make sure it's showing the location that both your Resource Group and VNet exist in.
9. Click **Create**. You'll see the *Deploying Virtual network gateway* tile on the dashboard. Creating a gateway takes some time. There is a lot going on in the background. Plan for 15 minutes or more. You may need to refresh your portal page in order to see the completed status.
10. After the gateway is created, you can view the IP address that has been assigned to it by looking at the Virtual Network in the portal. The gateway will appear as a connected device. You can view the name and the IP address assigned to the gateway.