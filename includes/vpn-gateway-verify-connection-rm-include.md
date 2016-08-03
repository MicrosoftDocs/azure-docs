### To verify your connection by using the Azure portal

You can verify a VPN connection in the Azure portal by navigating to **Virtual network gateways** > **click your gateway name** > **Settings** > **Connections**.

Select the name of the connection that you want to view. Pay attention to the **Connection Status**. The status will be "Succeeded" and "Connected" when you have made a successful connection. You can check the data flowing through by looking at **Data in** and **Data out**.

In the example below, the **Connection Status** is "Not connected". 

![Verify connection](./media/vpn-gateway-verify-connection-rm-include/connectionverify450.png)


### To verify your connection using PowerShell

It is also possible to verify that your connection succeeded by using `Get-AzureRmVirtualNetworkGatewayConnection`. You can use the following cmdlet example, configuring the values to match your own. If prompted, select 'A' in order to run All. In the example here, -Name refers to the name of the connection that you created and want to test.

	Get-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg

 After the cmdlet has finished, scroll through to view the values. In the example below, the connection status shows as "Connected" and you can see ingress and egress bytes.

	Body:
	{
	  "name": "localtovon",
	  "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/connections/loca
	ltovon",
	  "properties": {
	    "provisioningState": "Succeeded",
	    "resourceGuid": "1c484f82-23ec-47e2-8cd8-231107450446b",
	    "virtualNetworkGateway1": {
	      "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworkGa
	teways/vnetgw1"
	    },
	    "localNetworkGateway2": {
	      "id":
	"/subscriptions/086cfaa0-0d1d-4b1c-9455-f8e3da2a0c7789/resourceGroups/testrg/providers/Microsoft.Network/localNetworkGate
	ways/LocalSite"
	    },
	    "connectionType": "IPsec",
	    "routingWeight": 10,
	    "sharedKey": "abc123",
	    "connectionStatus": "Connected",
	    "ingressBytesTransferred": 33509044,
	    "egressBytesTransferred": 4142431
	  }