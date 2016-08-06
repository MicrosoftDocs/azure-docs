### <a name="noconnection"></a>How to add or remove prefixes without a gateway connection

- **To add** additional address prefixes to a local network gateway that you created, but that doesn't yet have a gateway connection, use the example below.

		$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
		Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')

- **To remove** an address prefix from a local network gateway that doesn't have a VPN connection, use the example below. Leave out the prefixes that you no longer need. In this example, we no longer need prefix 20.0.0.0/24 (from the previous example), so we will update the local network gateway and exclude that prefix.

		$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
		Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','30.0.0.0/24')

### <a name="withconnection"></a>How to add or remove prefixes with a gateway connection

If you have created your gateway connection and want to add or remove the IP address prefixes contained in your local network gateway, you'll need to do the following steps in order. This will result in some downtime for your VPN connection. When updating your prefixes, you'll first remove the connection, modify the prefixes, and then create a new connection. 

>[AZURE.IMPORTANT] Don’t delete the VPN gateway. If you do so, you’ll have to go back through the steps to recreate it, as well as reconfigure your on-premises router with the new settings.
 
1. Remove the connection.

		Remove-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg

2. Modify the address prefixes for your local network gateway.

	Set the variable for the LocalNetworkGateway

		$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

	Modify the prefixes.

		Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local `
		-AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')

4. Create the connection. In this example, we are configuring an IPsec connection type. When you recreate your connection, use the connection type that is specified for your configuration. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.

 	Set the variable for the VirtualNetworkGateway.

		$gateway1 = Get-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg

	Create the connection. Note that this sample uses the variable $local that you set in the preceding step.
	
		New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
		-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec `
		-RoutingWeight 10 -SharedKey 'abc123'
