When adding a site-to-site connection to your virtual network gateway, you first need to create a local network gateway in order to refer to it from your configuration. Verify that you have a local network gateway configured. You can look for local network gateways by using **Browse** and filtering for **Local network gateways**.

1. From the **Virtual networks** blade, locate your virtual network and click to open the blade. On the blade, you will see your gateway listed as a *Connected device*.
2. Click on the ***name of your virtual network gateway*** -> **Virtual network gateway** -> **Settings** -> **Connections** and then click **Add**.
3. **Name** your Connection. For the purposes of this example, we'll use *GW1S2S*
4. For **Connection type**, select **Site-to-site(IPSec)**
5. For **Virtual network gateway**, the value is fixed because you are connecting from this gateway.
6. For **Local network gateway**, click **Choose a local network gateway** and select the local network gateway that you want to use. For this example, we'll use *GW1LocalNet*
7. For **Shared Key**, the values here must match what you have for your local VPN device. If your VPN device on your local network doesn't provide a shared key, you can make one up and input it here and on your local device. The important thing is that they both match.
8. The remaining values for **Subscription**, **Resource Group**, and **Location** are fixed.
9. Click **OK** to create your connection. You'll see *Creating Connection* flash on the screen.
10. When the connection is complete, you'll see it appear in the **Connections** blade for your Gateway.