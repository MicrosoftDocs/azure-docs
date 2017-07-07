### <a name="noconnection"></a>To modify local network gateway IP address prefixes - no gateway connection

To add additional address prefixes:

```powershell
$local = Get-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName -ResourceGroupName MyRGName `
Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local `
-AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')
```

To remove address prefixes:<br>
Leave out the prefixes that you no longer need. In this example, we no longer need prefix 20.0.0.0/24 (from the previous example), so we update the local network gateway, excluding that prefix.

```powershell
$local = Get-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName -ResourceGroupName MyRGName `
Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local `
-AddressPrefix @('10.0.0.0/24','30.0.0.0/24')
```

### <a name="withconnection"></a>To modify local network gateway IP address prefixes - existing gateway connection

If you have a gateway connection and want to add or remove the IP address prefixes contained in your local network gateway, you need to do the following steps, in order. This results in some downtime for your VPN connection. When modifying IP address prefixes, you don't need to delete the VPN gateway. You only need to remove the connection.


1. Remove the connection.

  ```powershell
  Remove-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName -ResourceGroupName MyRGName
  ```
2. Modify the address prefixes for your local network gateway.
   
  Set the variable for the LocalNetworkGateway.

  ```powershell
  $local = Get-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName -ResourceGroupName MyRGName
  ```
   
  Modify the prefixes.
   
  ```powershell
  Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $local `
  -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24')
  ```
3. Create the connection. In this example, we configure an IPsec connection type. When you recreate your connection, use the connection type that is specified for your configuration. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.
   
  Set the variable for the VirtualNetworkGateway.

  ```powershell
  $gateway1 = Get-AzureRmVirtualNetworkGateway -Name RMGateway  -ResourceGroupName MyRGName
  ```
   
  Create the connection. This example uses the variable $local that you set in step 2.

  ```powershell
  New-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName `
  -ResourceGroupName MyRGName -Location 'West US' `
  -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
  -ConnectionType IPsec `
  -RoutingWeight 10 -SharedKey 'abc123'
  ```