---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/10/2021
 ms.author: cherylmc
 ms.custom: include file
---

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. When modifying this value, you can also modify the address prefixes at the same time. Be sure to use the existing name of your local network gateway in order to overwrite the current settings. If you use a different name, you create a new local network gateway, instead of overwriting the existing one.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name Site1 `
-Location "East US" -AddressPrefix @('10.101.0.0/24','10.101.1.0/24') `
-GatewayIpAddress "5.4.3.2" -ResourceGroupName TestRG1
```
