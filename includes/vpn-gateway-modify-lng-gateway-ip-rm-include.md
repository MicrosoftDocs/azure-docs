---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 01/15/2020
 ms.author: cherylmc
 ms.custom: include file
---
### <a name="gwipnoconnection"></a> To modify the local network gateway 'GatewayIpAddress' - no gateway connection

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. Use the example to modify a local network gateway that does not have a gateway connection.

When modifying this value, you can also modify the address prefixes at the same time. Be sure to use the existing name of your local network gateway in order to overwrite the current settings. If you use a different name, you create a new local network gateway, instead of overwriting the existing one.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name Site1 `
-Location "East US" -AddressPrefix @('10.101.0.0/24','10.101.1.0/24') `
-GatewayIpAddress "5.4.3.2" -ResourceGroupName TestRG1
```

### <a name="gwipwithconnection"></a>To modify the local network gateway 'GatewayIpAddress' - existing gateway connection

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. If a gateway connection already exists, you first need to remove the connection. After the connection is removed, you can modify the gateway IP address and recreate a new connection. You can also modify the address prefixes at the same time. This results in some downtime for your VPN connection. When modifying the gateway IP address, you don't need to delete the VPN gateway. You only need to remove the connection.
 

1. Remove the connection. You can find the name of your connection by using the 'Get-AzVirtualNetworkGatewayConnection' cmdlet.

   ```azurepowershell-interactive
   Remove-AzVirtualNetworkGatewayConnection -Name VNet1toSite1 `
   -ResourceGroupName TestRG1
   ```
2. Modify the 'GatewayIpAddress' value. You can also modify the address prefixes at the same time. Be sure to use the existing name of your local network gateway to overwrite the current settings. If you don't, you create a new local network gateway, instead of overwriting the existing one.

   ```azurepowershell-interactive
   New-AzLocalNetworkGateway -Name Site1 `
   -Location "East US" -AddressPrefix @('10.101.0.0/24','10.101.1.0/24') `
   -GatewayIpAddress "104.40.81.124" -ResourceGroupName TestRG1
   ```
3. Create the connection. In this example, we configure an IPsec connection type. When you recreate your connection, use the connection type that is specified for your configuration. For additional connection types, see the [PowerShell cmdlet](https://msdn.microsoft.com/library/mt603611.aspx) page.  To obtain the VirtualNetworkGateway name, you can run the 'Get-AzVirtualNetworkGateway' cmdlet.
   
    Set the variables.

   ```azurepowershell-interactive
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1

   $vnetgw = Get-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1
   ```
   
    Create the connection.

   ```azurepowershell-interactive 
   New-AzVirtualNetworkGatewayConnection -Name VNet1Site1 -ResourceGroupName TestRG1 `
   -Location "East US" `
   -VirtualNetworkGateway1 $vnetgw `
   -LocalNetworkGateway2 $local `
   -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
   ```