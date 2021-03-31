---
title: 'Quickstart: Diagnose a VM network traffic filter problem - Azure PowerShell'
titleSuffix: Azure Network Watcher
description: Learn how to use Azure PowerShell to diagnose a virtual machine network traffic filter problem using the IP flow verify  capability of Azure Network Watcher.
services: network-watcher
documentationcenter: network-watcher
author: damendo
ms.author: damendo
editor: 
ms.date: 01/07/2021
ms.assetid: 
ms.topic: quickstart
ms.service: network-watcher
ms.workload: infrastructure
ms.tgt_pltfrm: network-watcher
ms.devlang: na
tags:
  - azure-resource-manager
ms.custom:
  - mvc
  - devx-track-azurepowershell
  - mode-api
# Customer intent: I need to diagnose a virtual machine (VM) network traffic filter problem that prevents communication to and from a VM.
---

# Quickstart: Diagnose a virtual machine network traffic filter problem - Azure PowerShell

In this quickstart, you deploy a virtual machine (VM), and then check communications to an IP address and URL and from an IP address. You determine the cause of a communication failure and how you can resolve it.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this quickstart requires the Azure PowerShell `Az` module. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.



## Create a VM

Before you can create a VM, you must create a resource group to contain the VM. Create a resource group with [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

Create the VM with [New-AzVM](/powershell/module/az.compute/new-azvm). When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the VM.

```azurepowershell-interactive
$vM = New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVm" `
    -Location "East US"
```

The VM takes a few minutes to create. Don't continue with remaining steps until the VM is created and PowerShell returns output.

## Test network communication

To test network communication with Network Watcher, you must first enable a network watcher in the region the VM that you want to test is in, and then use Network Watcher's IP flow verify capability to test communication.

### Enable network watcher

If you already have a network watcher enabled in the East US region, use [Get-AzNetworkWatcher](/powershell/module/az.network/get-aznetworkwatcher) to retrieve the network watcher. The following example retrieves an existing network watcher named *NetworkWatcher_eastus* that is in the *NetworkWatcherRG* resource group:

```azurepowershell-interactive
$networkWatcher = Get-AzNetworkWatcher `
  -Name NetworkWatcher_eastus `
  -ResourceGroupName NetworkWatcherRG
```

If you don't already have a network watcher enabled in the East US region, use [New-AzNetworkWatcher](/powershell/module/az.network/new-aznetworkwatcher) to create a network watcher in the East US region:

```azurepowershell-interactive
$networkWatcher = New-AzNetworkWatcher `
  -Name "NetworkWatcher_eastus" `
  -ResourceGroupName "NetworkWatcherRG" `
  -Location "East US"
```

### Use IP flow verify

When you create a VM, Azure allows and denies network traffic to and from the VM, by default. You might later override Azure's defaults, allowing or denying additional types of traffic. To test whether traffic is allowed or denied to different destinations and from a source IP address, use the [Test-AzNetworkWatcherIPFlow](/powershell/module/az.network/test-aznetworkwatcheripflow) command.

Test outbound communication from the VM to one of the IP addresses for www.bing.com:

```azurepowershell-interactive
Test-AzNetworkWatcherIPFlow `
  -NetworkWatcher $networkWatcher `
  -TargetVirtualMachineId $vM.Id `
  -Direction Outbound `
  -Protocol TCP `
  -LocalIPAddress 192.168.1.4 `
  -LocalPort 60000 `
  -RemoteIPAddress 13.107.21.200 `
  -RemotePort 80
```

After several seconds, the result returned informs you that access is allowed by a security rule named **AllowInternetOutbound**.

Test outbound communication from the VM to 172.31.0.100:

```azurepowershell-interactive
Test-AzNetworkWatcherIPFlow `
  -NetworkWatcher $networkWatcher `
  -TargetVirtualMachineId $vM.Id `
  -Direction Outbound `
  -Protocol TCP `
  -LocalIPAddress 192.168.1.4 `
  -LocalPort 60000 `
  -RemoteIPAddress 172.31.0.100 `
  -RemotePort 80
```

The result returned informs you that access is denied by a security rule named **DefaultOutboundDenyAll**.

Test inbound communication to the VM from 172.31.0.100:

```azurepowershell-interactive
Test-AzNetworkWatcherIPFlow `
  -NetworkWatcher $networkWatcher `
  -TargetVirtualMachineId $vM.Id `
  -Direction Inbound `
  -Protocol TCP `
  -LocalIPAddress 192.168.1.4 `
  -LocalPort 80 `
  -RemoteIPAddress 172.31.0.100 `
  -RemotePort 60000
```

The result returned informs you that access is denied because of a security rule named **DefaultInboundDenyAll**. Now that you know which security rules are allowing or denying traffic to or from a VM, you can determine how to resolve the problems.

## View details of a security rule

To determine why the rules in [Test network communication](#test-network-communication) are allowing or preventing communication, review the effective security rules for the network interface with [Get-AzEffectiveNetworkSecurityGroup](/powershell/module/az.network/get-azeffectivenetworksecuritygroup):

```azurepowershell-interactive
Get-AzEffectiveNetworkSecurityGroup `
  -NetworkInterfaceName myVm `
  -ResourceGroupName myResourceGroup
```

The returned output includes the following text for the **AllowInternetOutbound** rule that allowed outbound access to www.bing.com in [Use IP flow verify](#use-ip-flow-verify):

```powershell
{
  "Name":
"defaultSecurityRules/AllowInternetOutBound",
  "Protocol": "All",
  "SourcePortRange": [
    "0-65535"
  ],
  "DestinationPortRange": [
    "0-65535"
  ],
  "SourceAddressPrefix": [
    "0.0.0.0/0"
  ],
  "DestinationAddressPrefix": [
    "Internet"
  ],
  "ExpandedSourceAddressPrefix": [],
  "ExpandedDestinationAddressPrefix": [
    "1.0.0.0/8",
    "2.0.0.0/7",
    "4.0.0.0/6",
    "8.0.0.0/7",
    "11.0.0.0/8",
    "12.0.0.0/6",
    ...
    ],
    "Access": "Allow",
    "Priority": 65001,
    "Direction": "Outbound"
  },
```

You can see in the output that **DestinationAddressPrefix** is **Internet**. It's not clear how 13.107.21.200, the address you tested in [Use IP flow verify](#use-ip-flow-verify), relates to **Internet** though. You see several address prefixes listed under **ExpandedDestinationAddressPrefix**. One of the prefixes in the list is **12.0.0.0/6**, which encompasses the 12.0.0.1-15.255.255.254 range of IP addresses. Since 13.107.21.200 is within that address range, the **AllowInternetOutBound** rule allows the outbound traffic. Additionally, there are no higher **priority** (lower number) rules listed in the output returned by `Get-AzEffectiveNetworkSecurityGroup`, that override this rule. To deny outbound communication to 13.107.21.200, you could add a security rule with a higher priority, that denies port 80 outbound to the IP address.

When you ran the `Test-AzNetworkWatcherIPFlow` command to test outbound communication to 172.131.0.100 in [Use IP flow verify](#use-ip-flow-verify), the output informed you that the **DefaultOutboundDenyAll** rule denied the communication. The **DefaultOutboundDenyAll** rule equates to the **DenyAllOutBound** rule listed in the following output from the `Get-AzEffectiveNetworkSecurityGroup` command:

```powershell
{
"Name": "defaultSecurityRules/DenyAllOutBound",
"Protocol": "All",
"SourcePortRange": [
  "0-65535"
],
"DestinationPortRange": [
  "0-65535"
],
"SourceAddressPrefix": [
  "0.0.0.0/0"
],
"DestinationAddressPrefix": [
  "0.0.0.0/0"
],
"ExpandedSourceAddressPrefix": [],
"ExpandedDestinationAddressPrefix": [],
"Access": "Deny",
"Priority": 65500,
"Direction": "Outbound"
}
```

The rule lists **0.0.0.0/0** as the **DestinationAddressPrefix**. The rule denies the outbound communication to 172.131.0.100, because the address is not within the **DestinationAddressPrefix** of any of the other outbound rules in the output from the `Get-AzEffectiveNetworkSecurityGroup` command. To allow the outbound communication, you could add a security rule with a higher priority, that allows outbound traffic to port 80 at 172.131.0.100.

When you ran the `Test-AzNetworkWatcherIPFlow` command to test inbound communication from 172.131.0.100 in [Use IP flow verify](#use-ip-flow-verify), the output informed you that the **DefaultInboundDenyAll** rule denied the communication. The **DefaultInboundDenyAll** rule equates to the **DenyAllInBound** rule listed in the following output from the `Get-AzEffectiveNetworkSecurityGroup` command:

```powershell
{
"Name": "defaultSecurityRules/DenyAllInBound",
"Protocol": "All",
"SourcePortRange": [
  "0-65535"
],
"DestinationPortRange": [
  "0-65535"
],
"SourceAddressPrefix": [
  "0.0.0.0/0"
],
"DestinationAddressPrefix": [
  "0.0.0.0/0"
],
"ExpandedSourceAddressPrefix": [],
"ExpandedDestinationAddressPrefix": [],
"Access": "Deny",
"Priority": 65500,
"Direction": "Inbound"
},
```

The **DenyAllInBound** rule is applied because, as shown in the output, no other higher priority rule exists in the output from the `Get-AzEffectiveNetworkSecurityGroup` command that allows port 80 inbound to the VM from 172.131.0.100. To allow the inbound communication, you could add a security rule with a higher priority that allows port 80 inbound from 172.131.0.100.

The checks in this quickstart tested Azure configuration. If the checks return expected results and you still have network problems, ensure that you don't have a firewall between your VM and the endpoint you're communicating with and that the operating system in your VM doesn't have a firewall that is allowing or denying communication.

## Clean up resources

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this quickstart, you created a VM and diagnosed inbound and outbound network traffic filters. You learned that network security group rules allow or deny traffic to and from a VM. Learn more about [security rules](../virtual-network/network-security-groups-overview.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) and how to [create security rules](../virtual-network/manage-network-security-group.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#create-a-security-rule).

Even with the proper network traffic filters in place, communication to a VM can still fail, due to routing configuration. To learn how to diagnose VM network routing problems, see [Diagnose VM routing problems](diagnose-vm-network-routing-problem-powershell.md) or, to diagnose outbound routing, latency, and traffic filtering problems, with one tool, see [Connection troubleshoot](network-watcher-connectivity-powershell.md).
