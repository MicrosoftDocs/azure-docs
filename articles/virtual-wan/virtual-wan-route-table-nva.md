---
title: 'Virtual WAN: Create virtual hub route table to NVA: Azure PowerShell'
description: Virtual WAN virtual hub route table to steer traffic to a network virtual appliance.
services: virtual-wan
author: cherylmc

ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/27/2025
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
# Customer intent: As someone with a networking background, I want to work with routing tables for NVA.
---

# Create a Virtual Hub route table to steer traffic to a Network Virtual Appliance

This article shows you how to steer traffic from a Virtual Hub to a Network Virtual Appliance. 

:::image type="content" source="./media/virtual-wan-route-table-nva/vwanroute.png" alt-text="Screenshot of Virtual WAN diagram PowerShell." lightbox="./media/virtual-wan-route-table-nva/vwanroute.png":::

In this article you learn how to:

* Create a WAN
* Create a hub
* Create hub virtual network connections
* Create a hub route
* Create a route table
* Apply the route table

## Before you begin

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

Verify that you have met the following criteria:

* You have a Network Virtual Appliance (NVA). This is a third-party software of your choice that is typically provisioned from Azure Marketplace in a virtual network.
* You have a private IP assigned to the NVA network interface. 
* The NVA can't be deployed in the virtual hub. It must be deployed in a separate VNet. For this article, the NVA VNet is referred to as the 'DMZ VNet'.
* The ‘DMZ VNet’ may have one or many virtual networks connected to it. In this article, this VNet is referred to as ‘Indirect spoke VNet’. These VNets can be connected to the DMZ VNet using VNet peering.
* Verify that you have 2 VNets already created. These will be used as spoke VNets. For this article, the VNet spoke address spaces are 10.0.2.0/24 and 10.0.3.0/24. If you need information on how to create a VNet, see [Create a virtual network using PowerShell](../virtual-network/quick-create-powershell.md).
* Ensure there are no virtual network gateways in any VNets.

## <a name="signin"></a>1. Sign in

Make sure you install the latest version of the Resource Manager PowerShell cmdlets. For more information about installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell). This is important because earlier versions of the cmdlets don't contain the current values that you need for this exercise.

1. Open your PowerShell console with elevated privileges, and sign in to your Azure account. This cmdlet prompts you for the sign-in credentials. After signing in, it downloads your account settings so that they're available to Azure PowerShell.

   ```powershell
   Connect-AzAccount
   ```
2. Get a list of your Azure subscriptions.

   ```powershell
   Get-AzSubscription
   ```
3. Specify the subscription that you want to use.

   ```powershell
   Select-AzSubscription -SubscriptionName "Name of subscription"
   ```

## <a name="rg"></a>2. Create resources

1. Create a resource group.

   ```powershell
   New-AzResourceGroup -Location "West US" -Name "testRG"
   ```
2. Create a virtual WAN.

   ```powershell
   $virtualWan = New-AzVirtualWan -ResourceGroupName "testRG" -Name "myVirtualWAN" -Location "West US"
   ```
3. Create a virtual hub.

   ```powershell
   New-AzVirtualHub -VirtualWan $virtualWan -ResourceGroupName "testRG" -Name "westushub" -AddressPrefix "10.0.1.0/24" -Location "West US"
   ```

## <a name="connections"></a>3. Create connections

Create hub virtual network connections from Indirect Spoke VNet and the DMZ VNet to the virtual hub.

  ```powershell
  $remoteVirtualNetwork1= Get-AzVirtualNetwork -Name "indirectspoke1" -ResourceGroupName "testRG"
  $remoteVirtualNetwork2= Get-AzVirtualNetwork -Name "indirectspoke2" -ResourceGroupName "testRG"
  $remoteVirtualNetwork3= Get-AzVirtualNetwork -Name "dmzvnet" -ResourceGroupName "testRG"

  New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name  "testvnetconnection1" -RemoteVirtualNetwork $remoteVirtualNetwork1
  New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name  "testvnetconnection2" -RemoteVirtualNetwork $remoteVirtualNetwork2
  New-AzVirtualHubVnetConnection -ResourceGroupName "testRG" -VirtualHubName "westushub" -Name  "testvnetconnection3" -RemoteVirtualNetwork $remoteVirtualNetwork3
  ```

## <a name="route"></a>4. Create a virtual hub route

For this article, the Indirect Spoke VNet address spaces are 10.0.2.0/24 and 10.0.3.0/24, and the DMZ NVA network interface private IP address is 10.0.4.5.

```powershell
$route1 = New-AzVirtualHubRoute -AddressPrefix @("10.0.2.0/24", "10.0.3.0/24") -NextHopIpAddress "10.0.4.5"
```

## <a name="applyroute"></a>5. Create a virtual hub route table

Create a virtual hub route table, then apply the created route to it.
 
```powershell
$routeTable = New-AzVirtualHubRouteTable -Route @($route1)
```

## <a name="commit"></a>6. Commit the changes

Commit the changes into the virtual hub.

```powershell
Update-AzVirtualHub -ResourceGroupName "testRG" -Name "westushub" -RouteTable $routeTable
```

## Next steps

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.
