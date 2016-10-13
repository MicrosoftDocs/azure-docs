To modify the gateway IP address, use the `New-AzureRmVirtualNetworkGatewayConnection` cmdlet. As long as you keep the name of the local network gateway exactly the same as the existing name, the settings will overwrite. At this time, the "Set" cmdlet does not support modifying the gateway IP address.

### <a name="gwipnoconnection"></a>How to modify the gateway IP address - no gateway connection

To update the gateway IP address for your local network gateway that doesn't yet have a connection, use the example below. You can also update the address prefixes at the same time. The settings you specify will overwrite the existing settings. Be sure to use the existing name of your local network gateway. If you don't, you'll be creating a new local network gateway, not overwriting the existing one.

Use the following example, replacing the values for your own.

	New-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName `
	-Location "West US" -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24') `
	-GatewayIpAddress "5.4.3.2" -ResourceGroupName MyRGName


### <a name="gwipwithconnection"></a>How to modify the gateway IP address - existing gateway connection

If a gateway connection already exists, you'll first need to remove the connection. Then, you can modify the gateway IP address and recreate a new connection. This will result in some downtime for your VPN connection.


>[AZURE.IMPORTANT] Don’t delete the VPN gateway. If you do so, you’ll have to go back through the steps to recreate it, as well as reconfigure your on-premises router with the IP address that will be assigned to the newly created gateway.
 

1. Remove the connection. You can find the name of your connection by using the `Get-AzureRmVirtualNetworkGatewayConnection` cmdlet.

		Remove-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName `
		-ResourceGroupName MyRGName

2. Modify the GatewayIpAddress value. You can also modify your address prefixes at this time, if necessary. Note that this will overwrite the existing local network gateway settings. Use the existing name of your local network gateway when modifying so that the settings will overwrite. If you don't, you'll be creating a new local network gateway, not modifying the existing one.

		New-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName `
		-Location "West US" -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24') `
		-GatewayIpAddress "104.40.81.124" -ResourceGroupName MyRGName

3. Create the connection. In this example, we are configuring an IPsec connection type. When you recreate your connection, use the connection type that is specified for your configuration. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.  To obtain the VirtualNetworkGateway name, you can run the `Get-AzureRmVirtualNetworkGateway` cmdlet.

	Set the variables:

		$local = Get-AzureRMLocalNetworkGateway -Name MyLocalNetworkGWName -ResourceGroupName MyRGName `
		$vnetgw = Get-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName MyRGName

	Create the connection:
	
		New-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName -ResourceGroupName MyRGName `
		-Location "West US" `
		-VirtualNetworkGateway1 $vnetgw `
		-LocalNetworkGateway2 $local `
		-ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'

