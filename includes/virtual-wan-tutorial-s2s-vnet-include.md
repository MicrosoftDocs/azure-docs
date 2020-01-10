---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/19/2019
 ms.author: cherylmc
 ms.custom: include file
---
1. **Create a resource group**. If you don't already have a resource group that you want to use, create a new one. Adjust the PowerShell commands to reflect the resource group name you want to use, then run the cmdlet. Sometimes you will see breaking change warnings. These warnings do not apply to this particular command. It's OK to ignore them.

   ```azurepowershell-interactive
   New-AzResourceGroup -ResourceGroupName WANTestRG -Location WestUS
   ```
2. **Create a VNet**. Adjust the PowerShell commands to create a VNet that is compatible for your environment.

   ```azurepowershell-interactive
   $fesub1 = New-AzVirtualNetworkSubnetConfig -Name FrontEnd -AddressPrefix "10.1.0.0/24"
   $vnet = New-AzVirtualNetwork -Name WANVNet1 -ResourceGroupName WANTestRG -Location WestUS -AddressPrefix "10.1.0.0/16" -Subnet $fesub1
   ```
