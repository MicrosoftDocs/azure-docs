---
title: 'Create an Azure Virtual WAN virtual hub route table to steer to NVA | Microsoft Docs'
description: Virtual WAN virtual hub route table to steer traffic to a network virtual appliance.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to work with routing tables for NVA.
---

# Create a Virtual Hub route table to steer traffic to a Network Virtual Appliance

This article shows you how to steer traffic from a Virtual Hub to a Network Virtual Appliance. 

![Virtual WAN diagram](./media/virtual-wan-route-table/vwanroute.png)

In this article you'll learn how to:

* Create a WAN
* Create a hub
* Create hub virtual network connections
* Create a hub route
* Create a route table
* Apply the route table

## Before you begin

Verify that you have met the following criteria:

1. You have a Network Virtual Appliance (NVA) is a third-party software of your choice that is typically provisioned from Azure Marketplace (Link) in a virtual network.
2. You have a private IP assigned to the NVA network interface. 
3. NVA cannot be deployed in the virtual hub. It must be deployed in a separate VNet. For this article, the VNet is referred to as the 'DMZ VNet'.
4. The ‘DMZ VNet’ may have one or many virtual networks connected to it. In this article, this VNet is referred to as ‘Indirect spoke VNet’. These VNets can be connected to the DMZ VNet using VNet peering.
5. Verify that you have 2 VNets already created. These will be used as spoke VNets. For this article, the VNet spoke address spaces are 10.0.2.0/24 and 10.0.3.0/24. If you need information on how to create a VNet, see [Create a virtual network using PowerShell](../virtual-network/quick-create-powershell.md).
6. Ensure there are no virtual network gateways in any VNets.

## <a name="signin"></a>1. Sign in

Make sure you install the latest version of the Resource Manager PowerShell cmdlets. For more information about installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/overview). This is important because earlier versions of the cmdlets do not contain the current values that you need for this exercise.

1. Open your PowerShell console with elevated privileges, and sign in to your Azure account. This cmdlet prompts you for the sign-in credentials. After signing in, it downloads your account settings so that they are available to Azure PowerShell.

  ```powershell
  Connect-AzureRmAccount
  ```
2. Get a list of your Azure subscriptions.

  ```powershell
  Get-AzureRmSubscription
  ```
3. Specify the subscription that you want to use.

  ```powershell
  Select-AzureRmSubscription -SubscriptionName "Name of subscription"
  ```

## <a name="rg"></a>2. Create resources

1. Create a resource group.

  ```powershell
  New-AzureRmResourceGroup -Location "West US" -Name "testRG"
  ```
2. Create a virtual WAN.

  ```powershell
  $virtualWan = New-AzureRmVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN" -Location "West US"
  ```
3. Create a virtual hub.

  ```powershell
  New-AzureRmVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.0.1.0/24"
  ```

## <a name="connections"></a>3. Create connections

Create hub virtual network connections from Indirect Spoke VNet and the DMZ VNet to the virtual hub.

  ```powershell
  $remoteVirtualNetwork1= Get-AzureRmVirtualNetwork -Name “indirectspoke1” -ResourceGroupName “testRG”
  $remoteVirtualNetwork2= Get-AzureRmVirtualNetwork -Name “indirectspoke2” -ResourceGroupName “testRG”
  $remoteVirtualNetwork3= Get-AzureRmVirtualNetwork -Name “dmzvnet” -ResourceGroupName “testRG”

  New-AzureRmVirtualHubVnetConnection -ResourceGroupName “testRG” -VirtualHubName “westushub” -Name  “testvnetconnection1” -RemoteVirtualNetwork $remoteVirtualNetwork1
  New-AzureRmVirtualHubVnetConnection -ResourceGroupName “testRG” -VirtualHubName “westushub” -Name  “testvnetconnection2” -RemoteVirtualNetwork $remoteVirtualNetwork2
  New-AzureRmVirtualHubVnetConnection -ResourceGroupName “testRG” -VirtualHubName “westushub” -Name  “testvnetconnection3” -RemoteVirtualNetwork $remoteVirtualNetwork3
  ```

## <a name="route"></a>4. Create a virtual hub route

For this article, the Indirect Spoke VNet address spaces are 10.0.2.0/24 and 10.0.3.0/24, and the DMZ NVA network interface private IP address is 10.0.4.5.

```powershell
$route1 = New-AzureRmVirtualHubRoute -AddressPrefix @("10.0.2.0/24", "10.0.3.0/24") -NextHopIpAddress "10.0.4.5"
```

## <a name="applyroute"></a>5. Create a virtual hub route table

Create a virtual hub route table, then apply the created route to it.
 
```powershell
$routeTable = New-AzureRmVirtualHubRouteTable -Route @($route1)
```

## <a name="commit"></a>6. Commit the changes

Commit the changes into the virtual hub.

```powershell
Set-AzureRmVirtualHub -VirtualWanId $virtualWan.Id -ResourceGroupName "testRG" -Name "westushub” -RouteTable $routeTable
```

## <a name="cleanup"></a>Clean up resources

When you no longer need these resources, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains. Replace "myResourceGroup" with the name of your resource group and run the following PowerShell command:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.