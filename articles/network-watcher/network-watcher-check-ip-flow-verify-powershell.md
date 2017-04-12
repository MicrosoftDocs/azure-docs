---
title: verify traffic with Azure Network Watcher IP flow verify - PowerShell | Microsoft Docs
description: This article describes how to check if traffic to or from a virtual machine is allowed or denied using PowerShell
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: e1dad757-8c5d-467f-812e-7cc751143207
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace

---
# Check if traffic is allowed or denied to or from a VM with IP flow verify a component of Azure Network Watcher

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-check-ip-flow-verify-portal.md)
> - [PowerShell](network-watcher-check-ip-flow-verify-powershell.md)
> - [CLI](network-watcher-check-ip-flow-verify-cli.md)
> - [Azure REST API](network-watcher-check-ip-flow-verify-rest.md)

IP flow verify is a feature of Network Watcher that allows you to verify if traffic is allowed to or from a virtual machine. This scenario is useful to get a current state of whether a virtual machine can talk to an external resource or backend. IP flow verify can be used to verify if your Network Security Group (NSG) rules are properly configured and troubleshoot flows that are being blocked by NSG rules. Another reason for using IP flow verify is to ensure traffic that you want blocked is being blocked properly by the NSG.

## Before you begin

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher or have an existing instance of Network Watcher. The scenario also assumes that a Resource Group with a valid virtual machine exists to be used.

## Scenario

This scenario uses IP flow verify to verify if a virtual machine can talk to a known Bing IP address. If the traffic is denied, it returns the security rule that is denying that traffic. To learn more about IP flow verify, visit [IP flow verify Overview](network-watcher-ip-flow-verify-overview.md)

## Retrieve Network Watcher

The first step is to retrieve the Network Watcher instance. The `$networkWatcher` variable is passed to the IP flow verify cmdlet.

```powershell
$nw = Get-AzurermResource | Where {$_.ResourceType -eq "Microsoft.Network/networkWatchers" -and $_.Location -eq "WestCentralUS" } 
$networkWatcher = Get-AzureRmNetworkWatcher -Name $nw.Name -ResourceGroupName $nw.ResourceGroupName 
```

## Get a VM

IP flow verify tests traffic to or from an IP address on a virtual machine to or from a remote destination. An Id of a virtual machine is required for the cmdlet. If you already know the ID of the virtual machine to use, you can skip this step.

```powershell
$VM = Get-AzurermVM -ResourceGroupName "testrg" -Name "testvm1"
```

## Get the NICS

The IP address of a NIC on the virtual machine is needed, in this example we retrieve the NICs on a virtual machine. If you already know the IP address that you want to test on the virtual machine, you can skip this step.

```powershell
$Nics = Get-AzureRmNetworkInterface | Where {$_.Id -eq $vm.NetworkInterfaceIDs.ForEach({$_})}
```

## Run IP flow verify

Now that we have the information needed to run the cmdlet, we run the `Test-AzureRmNetworkWatcherIPFlow` cmdlet to test the traffic. In this example, we are using the first IP address on the first NIC.

```powershell
Test-AzureRmNetworkWatcherIPFlow -NetworkWatcher $networkWatcher -TargetVirtualMachineId $VM.Id `
-Direction Outbound -Protocol TCP `
-LocalIPAddress $nics[0].IpConfigurations[0].PrivateIpAddress -LocalPort 6895 -RemoteIPAddress 204.79.197.200 -RemotePort 80
```

> [!NOTE]
> IP flow verify requires that the VM resource is allocated to run.

## Review Results

After running `Test-AzureRmNetworkWatcherIPFlow` the results are returned, the following example is the results returned from the preceding step.

```
Access RuleName                                  
------ --------                                  
Allow  defaultSecurityRules/AllowInternetOutBound
```

## Next steps

If traffic is being blocked and it should not be, see [Manage Network Security Groups](../virtual-network/virtual-network-manage-nsg-arm-portal.md) to track down the network security group and security rules that are defined.

[1]: ./media/network-watcher-check-ip-flow-verify-portal/figure1.png
[2]: ./media/network-watcher-check-ip-flow-verify-portal/figure2.png













