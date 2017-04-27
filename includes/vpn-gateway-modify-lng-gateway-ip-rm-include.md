To modify the gateway IP address, use the 'New-AzureRmVirtualNetworkGatewayConnection' cmdlet. Currently, the 'Set' cmdlet does not support modifying the gateway IP address.

### <a name="gwipnoconnection"></a>Modify the gateway IP address - no gateway connection
To modify the gateway IP address for your local network gateway that doesn't yet have a connection, use the example below. You can also modify the address prefixes at the same time. Be sure to use the existing name of your local network gateway to overwrite the current settings. If you don't, you create a new local network gateway, instead of overwriting the existing one.

Use the following example, replacing the values for your own:

```powershell
New-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName `
-Location "West US" -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24') `
-GatewayIpAddress "5.4.3.2" -ResourceGroupName MyRGName
```

### <a name="gwipwithconnection"></a>Modify the gateway IP address - existing gateway connection
If a gateway connection already exists, you first need to remove the connection. After the connection is removed, you can modify the gateway IP address and recreate a new connection. You can also modify the address prefixes at the same time. This results in some downtime for your VPN connection.

> [!IMPORTANT]
> Don’t delete the VPN gateway. If you do so, you have to go back through the steps to recreate it. Additionally, you must update your on-premises VPN device with the new VPN gateway IP address.
> 
> 

1. Remove the connection. You can find the name of your connection by using the 'Get-AzureRmVirtualNetworkGatewayConnection' cmdlet.

  ```powershell
  Remove-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName `
  -ResourceGroupName MyRGName
  ```
2. Modify the 'GatewayIpAddress' value. You can also modify the address prefixes at the same time. Be sure to use the existing name of your local network gateway to overwrite the current settings. If you don't, you create a new local network gateway, instead of overwriting the existing one.

  ```powershell
  New-AzureRmLocalNetworkGateway -Name MyLocalNetworkGWName `
  -Location "West US" -AddressPrefix @('10.0.0.0/24','20.0.0.0/24','30.0.0.0/24') `
  -GatewayIpAddress "104.40.81.124" -ResourceGroupName MyRGName
  ```
3. Create the connection. In this example, we configure an IPsec connection type. When you recreate your connection, use the connection type that is specified for your configuration. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.  To obtain the VirtualNetworkGateway name, you can run the 'Get-AzureRmVirtualNetworkGateway' cmdlet.
   
    Set the variables.

  ```powershell
  $local = Get-AzureRMLocalNetworkGateway -Name MyLocalNetworkGWName -ResourceGroupName MyRGName `
  $vnetgw = Get-AzureRmVirtualNetworkGateway -Name RMGateway -ResourceGroupName MyRGName
  ```
   
    Create the connection.

  ```powershell 
  New-AzureRmVirtualNetworkGatewayConnection -Name MyGWConnectionName -ResourceGroupName MyRGName `
  -Location "West US" `
  -VirtualNetworkGateway1 $vnetgw `
  -LocalNetworkGateway2 $local `
  -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
  ```