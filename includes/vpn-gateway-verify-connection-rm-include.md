You can verify a VPN connection in the Azure portal by navigating to **Virtual network gateways** **>** ***click your gateway name*** **>** **Settings** **>** **Connections**. By selecting the name of the connection, you can view more information about the connection. In the example below, the connection is not connected and there is no data flowing through.


![Verify connection](./media/vpn-gateway-verify-connection-rm-include/connectionverify450.png)


### To verify your connection using PowerShell

It is also possible to verify that your connection succeeded by using `Get-AzureRmVirtualNetworkGatewayConnection –Debug`. You can use the following cmdlet example, configuring the values to match your own. When prompted, select 'A' in order to run All.

	Get-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Debug

 After the cmdlet has finished, scroll through to view the values. In the example below, the connection status shows as *Connected* and you can see ingress and egress bytes.

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