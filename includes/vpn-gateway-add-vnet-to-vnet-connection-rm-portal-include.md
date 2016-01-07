When adding a VNet-to-VNet connection, verify that both of your virtual networks have a virtual network gateway and that your virtual networks do not have any overlapping address ranges.

1. From the **Virtual networks** blade, locate your virtual network and click to open the blade. On the blade, you will see your gateway listed as a *Connected device*. You can also configure settings directly from your virtual network gateway without first expanding the VNet.
2. From the virtual network gateway settings, click **Connections**, and then **Add**.
3. **Name** your Connection. 
4. For **Connection type**, select **VNet-to-VNet**
5. For **Virtual network gateway**, the value is fixed because you are connecting from this gateway.
6. For **Second virtual network gateway**, select the gateway you want to create a connection to from this gateway.
8. The remaining values for **Subscription**, **Resource Group**, and **Location** are fixed.
9. Click **OK** to create your connection. You'll see *Creating Connection* flash on the screen.
10. When the connection is complete, you'll see it appear in the **Connections** blade for your Gateway.
