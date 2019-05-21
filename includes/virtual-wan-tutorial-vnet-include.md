---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 04/23/2019
 ms.author: cherylmc
 ms.custom: include file
---

To quickly create a VNet, you can click "Try It" in this article to open a PowerShell console. Adjust the values, then copy and paste the commands into the console window. To learn more about the new Az module and AzureRM compatibility, see
[Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az). For
Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

Be sure to verify that the address space for the VNet that you create does not overlap with any of the address ranges for other VNets that you want to connect to, or with your on-premises network address spaces.

### Create a resource group

If you don't already have a resource group that you want to use, create a new one. Adjust the PowerShell commands to reflect the resource group name you want to use, then run the following cmdlet:

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName WANTestRG -Location WestUS
```

### Create a VNet

Adjust the PowerShell commands to create a VNet that is compatible for your environment.

```azurepowershell-interactive
$fesub1 = New-AzVirtualNetworkSubnetConfig -Name FrontEnd -AddressPrefix "10.1.0.0/24"
$vnet   = New-AzVirtualNetwork `
            -Name WANVNet1 `
            -ResourceGroupName WANTestRG `
            -Location WestUS `
            -AddressPrefix "10.1.0.0/16" `
            -Subnet $fesub1
```