---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 09/12/2018
 ms.author: cherylmc
 ms.custom: include file
---

If you do not already have a VNet, you can quickly create one using PowerShell. You can also create a virtual network using the Azure portal.

* Be sure to verify that the address space for the VNet that you create does not overlap with any of the address ranges for other VNets that you want to connect to, or with your on-premises network address spaces. 
* If you already have a VNet, verify that it meets the required criteria and does not have a virtual network gateway.

You can easily create your VNet by clicking "Try It" in this article to open a PowerShell console. Adjust the values, then copy and paste the commands into the console window.

### Create a resource group

Adjust the PowerShell commands, then create a resource group.

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName WANTestRG -Location WestUS
```

### Create a VNet

Adjust the PowerShell commands to create the VNet that is compatible for your environment.

```azurepowershell-interactive
$fesub1 = New-AzureRmVirtualNetworkSubnetConfig -Name FrontEnd -AddressPrefix "10.1.0.0/24"
$vnet   = New-AzureRmVirtualNetwork `
            -Name WANVNet1 `
            -ResourceGroupName WANTestRG `
            -Location WestUS `
            -AddressPrefix "10.1.0.0/16" `
            -Subnet $fesub1
```