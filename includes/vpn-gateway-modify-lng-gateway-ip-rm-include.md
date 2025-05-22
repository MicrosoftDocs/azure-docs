---
ms.author: cherylmc
author: cherylmc
ms.date: 12/02/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

If you change the public IP address for your VPN device, you need to modify the local network gateway with the updated IP address. When modifying this value, you can also modify the address prefixes at the same time. When modifying, be sure to use the existing name of your local network gateway. If you use a different name, you create a new local network gateway, instead of overwriting the existing gateway information.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name Site1 `
-Location "East US" -AddressPrefix @('10.101.0.0/24','10.101.1.0/24') `
-GatewayIpAddress "5.4.3.2" -ResourceGroupName TestRG1
```
