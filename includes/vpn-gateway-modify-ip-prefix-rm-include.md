### Add or remove prefixes if you haven't yet created a VPN gateway connection

- **To add** additional address prefixes to a local network gateway that you created, but that doesn't yet have a VPN gateway connection, use the example below.

		$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')


- **To remove** an address prefix from a local network gateway that doesn't have a VPN connection, use the example below. Leave out the prefixes that you no longer need. In this example, we no longer need prefix 20.0.0.0/24 (from the previous example), so we will update the local network gateway and exclude that prefix.

		$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg
		Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local -AddressPrefix @('10.0.0.0/24','30.0.0.0/24')

### Add or remove prefixes if you've already created a VPN gateway connection

If you have created your VPN connection and want to add or remove the IP address prefixes contained in your local network gateway, you'll need to do the following steps in order. This will result in some downtime for your VPN connection.

>[AZURE.IMPORTANT] Don’t delete the VPN gateway. If you do so, you’ll have to go back through the steps to recreate it, as well as reconfigure your on-premises router with the new settings.
 
1. Remove the connection. 
2. Modify the prefixes for your local network gateway. 
3. Create a new connection. 

You can use the following sample as a guideline.

First, we specify the variables.

	$gateway1 = Get-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
	$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg

Next, remove the connection.

	Remove-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg

Modify the prefixes.

	$local = Get-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
	Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local `
	-AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')

Create the connection. In this example, we are configuring an IPsec connection type. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.
	
	New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
	-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec `
	-RoutingWeight 10 -SharedKey 'abc123'
