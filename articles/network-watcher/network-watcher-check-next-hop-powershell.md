---
title: Find next hop with Azure Network Watcher Next Hop - PowerShell | Microsoft Docs
description: This article will describe how you can find what the next hop type is and ip address using Next Hop using PowerShell.
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: 6a656c55-17bd-40f1-905d-90659087639c
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---

# Find out what the next hop type is using the Next Hop capability in Azure Network Watcher using PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-next-hop-portal.md)
> - [PowerShell](network-watcher-check-next-hop-powershell.md)
> - [CLI](network-watcher-check-next-hop-cli.md)
> - [Azure REST API](network-watcher-check-next-hop-rest.md)

Next hop is a feature of Network Watcher that provides the ability get the next hop type and IP address based on a specified virtual machine. This feature is useful in determining if traffic leaving a virtual machine traverses a gateway, internet, or virtual networks to get to its destination.

## Before you begin

In this scenario, you will use the Azure portal to find the next hop type and IP address.

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher. The scenario also assumes that a Resource Group with a valid virtual machine exists to be used.

## Scenario

The scenario covered in this article uses Next Hop, a feature of Network Watcher that finds out the next hop type and IP address for a resource. To learn more about Next Hop, visit [Next Hop Overview](network-watcher-next-hop-overview.md).

## Retrieve Network Watcher

The first step is to retrieve the Network Watcher instance. The `$networkWatcher` variable is passed to the next hop verify cmdlet.

```powershell
$nw = Get-AzurermResource | Where {$_.ResourceType -eq "Microsoft.Network/networkWatchers" -and $_.Location -eq "WestCentralUS" } 
$networkWatcher = Get-AzureRmNetworkWatcher -Name $nw.Name -ResourceGroupName $nw.ResourceGroupName 
```

## Get a virtual machine

Next hop returns the next hop and the IP address of the next hop from a virtual machine. An Id of a virtual machine is required for the cmdlet. If you already know the ID of the virtual machine to use, you can skip this step.

```powershell
$VM = Get-AzurermVM -ResourceGroupName "testrg" -Name "testvm1"
```

> [!NOTE]
> Next hop requires that the VM resource is allocated to run.

## Get the network interfaces

The IP address of a NIC on the virtual machine is needed, in this example we retrieve the NICs on a virtual machine. If you already know the IP address that you want to test on the virtual machine, you can skip this step.

```powershell
$Nics = Get-AzureRmNetworkInterface | Where {$_.Id -eq $vm.NetworkInterfaceIDs.ForEach({$_})}
```

## Get Next Hop

Now we call the `Get-AzureRmNetworkWatcherNextHop` cmdlet. We pass the cmdlet the Network Watcher, virtual machine Id, source IP address, and destination IP address. In this example, the destination IP address is to a VM in another virtual network. There is a virtual network gateway between the two virtual networks.

```powershell
Get-AzureRmNetworkWatcherNextHop -NetworkWatcher $networkWatcher -TargetVirtualMachineId $VM.Id -SourceIPAddress $nics[0].IpConfigurations[0].PrivateIpAddress  -DestinationIPAddress 10.0.2.4 
```

## Review results

When complete, the results are provided. The next hop IP address is returned as well as the type of resource it is. In this scenario, it is the public IP address of the virtual network gateway.

```
NextHopIpAddress NextHopType           RouteTableId 
---------------- -----------           ------------ 
13.78.238.92     VirtualNetworkGateway Gateway Route
```

The following list shows the currently available NextHopType values:

**Next Hop Type**

* Internet
* VirtualAppliance
* VirtualNetworkGateway
* VnetLocal
* HyperNetGateway
* VnetPeering
* None

## Next steps

Learn how to review your network security group settings programmatically by visiting [NSG Auditing with Network Watcher](network-watcher-nsg-auditing-powershell.md)

















