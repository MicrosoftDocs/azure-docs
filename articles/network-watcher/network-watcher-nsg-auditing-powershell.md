---
title: Automate NSG auditing with Azure Network Watcher Security group view | Microsoft Docs
description: This page provides instructions on how to configure auditing of a Network Security Group
services: network-watcher
documentationcenter: na
author: KumudD
manager: twooley
editor: 

ms.assetid: 78a01bcf-74fe-402a-9812-285f3501f877
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: kumud

---

# Automate NSG auditing with Azure Network Watcher Security group view

Customers are often faced with the challenge of verifying the security posture of their infrastructure. This challenge is no different for their VMs in Azure. It is important to have a similar security profile based on the Network Security Group (NSG) rules applied. Using the Security Group View, you can now get the list of rules applied to a VM within an NSG. You can define a golden NSG security profile and initiate Security Group View on a weekly cadence and compare the output to the golden profile and create a report. This way you can identify with ease all the VMs that do not conform to the prescribed security profile.

If you are unfamiliar with Network Security Groups, see [Network Security Overview](../virtual-network/security-overview.md).


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Before you begin

In this scenario, you compare a known good baseline to the security group view results returned for a virtual machine.

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher. The scenario also assumes that a Resource Group with a valid virtual machine exists to be used.

## Scenario

The scenario covered in this article gets the security group view for a virtual machine.

In this scenario, you will:

- Retrieve a known good rule set
- Retrieve a virtual machine with Rest API
- Get security group view for virtual machine
- Evaluate Response

## Retrieve rule set

The first step in this example is to work with an existing baseline. The following example is some json extracted from an existing Network Security Group using the `Get-AzNetworkSecurityGroup` cmdlet that is used as the baseline for this example.

```json
[
    {
        "Description":  null,
        "Protocol":  "TCP",
        "SourcePortRange":  "*",
        "DestinationPortRange":  "3389",
        "SourceAddressPrefix":  "*",
        "DestinationAddressPrefix":  "*",
        "Access":  "Allow",
        "Priority":  1000,
        "Direction":  "Inbound",
        "ProvisioningState":  "Succeeded",
        "Name":  "default-allow-rdp",
        "Etag":  "W/\"d8859256-1c4c-4b93-ba7d-73d9bf67c4f1\"",
        "Id":  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/networkSecurityGroups/testvm1-nsg/securityRules/default-allow-rdp"
    },
    {
        "Description":  null,
        "Protocol":  "*",
        "SourcePortRange":  "*",
        "DestinationPortRange":  "111",
        "SourceAddressPrefix":  "*",
        "DestinationAddressPrefix":  "*",
        "Access":  "Allow",
        "Priority":  1010,
        "Direction":  "Inbound",
        "ProvisioningState":  "Succeeded",
        "Name":  "MyRuleDoNotDelete",
        "Etag":  "W/\"d8859256-1c4c-4b93-ba7d-73d9bf67c4f1\"",
        "Id":  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/networkSecurityGroups/testvm1-nsg/securityRules/MyRuleDoNotDelete"
    },
    {
        "Description":  null,
        "Protocol":  "*",
        "SourcePortRange":  "*",
        "DestinationPortRange":  "112",
        "SourceAddressPrefix":  "*",
        "DestinationAddressPrefix":  "*",
        "Access":  "Allow",
        "Priority":  1020,
        "Direction":  "Inbound",
        "ProvisioningState":  "Succeeded",
        "Name":  "My2ndRuleDoNotDelete",
        "Etag":  "W/\"d8859256-1c4c-4b93-ba7d-73d9bf67c4f1\"",
        "Id":  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/networkSecurityGroups/testvm1-nsg/securityRules/My2ndRuleDoNotDelete"
    },
    {
        "Description":  null,
        "Protocol":  "TCP",
        "SourcePortRange":  "*",
        "DestinationPortRange":  "5672",
        "SourceAddressPrefix":  "*",
        "DestinationAddressPrefix":  "*",
        "Access":  "Deny",
        "Priority":  1030,
        "Direction":  "Inbound",
        "ProvisioningState":  "Succeeded",
        "Name":  "ThisRuleNeedsToStay",
        "Etag":  "W/\"d8859256-1c4c-4b93-ba7d-73d9bf67c4f1\"",
        "Id":  "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Network/networkSecurityGroups/testvm1-nsg/securityRules/ThisRuleNeedsToStay"
    }
]
```

## Convert rule set to PowerShell objects

In this step, we are reading a json file that was created earlier with the rules that are expected to be on the Network Security Group for this example.

```powershell
$nsgbaserules = Get-Content -Path C:\temp\testvm1-nsg.json | ConvertFrom-Json
```

## Retrieve Network Watcher

The next step is to retrieve the Network Watcher instance. The `$networkWatcher` variable is passed to the `AzNetworkWatcherSecurityGroupView` cmdlet.

```powershell
$nw = Get-AzResource | Where {$_.ResourceType -eq "Microsoft.Network/networkWatchers" -and $_.Location -eq "WestCentralUS" } 
$networkWatcher = Get-AzNetworkWatcher -Name $nw.Name -ResourceGroupName $nw.ResourceGroupName 
```

## Get a VM

A virtual machine is required to run the `Get-AzNetworkWatcherSecurityGroupView` cmdlet against. The following example gets a VM object.

```powershell
$VM = Get-AzVM -ResourceGroupName "testrg" -Name "testvm1"
```

## Retrieve security group view

The next step is to retrieve the security group view result. This result is compared to the "baseline" json that was shown earlier.

```powershell
$secgroup = Get-AzNetworkWatcherSecurityGroupView -NetworkWatcher $networkWatcher -TargetVirtualMachineId $VM.Id
```

## Analyzing the results

The response is grouped by Network interfaces. The different types of rules returned are effective and default security rules. The result is further broken down by how it is applied, either on a subnet or a virtual NIC.

The following PowerShell script compares the results of the Security Group View to an existing output of an NSG. The following example is a simple example of how the results can be compared with `Compare-Object` cmdlet.

```powershell
Compare-Object -ReferenceObject $nsgbaserules `
-DifferenceObject $secgroup.NetworkInterfaces[0].NetworkInterfaceSecurityRules `
-Property Name,Description,Protocol,SourcePortRange,DestinationPortRange,SourceAddressPrefix,DestinationAddressPrefix,Access,Priority,Direction
```

The following example is the result. You can see two of the rules that were in the first rule set were not present in the comparison.

```
Name                     : My2ndRuleDoNotDelete
Description              : 
Protocol                 : *
SourcePortRange          : *
DestinationPortRange     : 112
SourceAddressPrefix      : *
DestinationAddressPrefix : *
Access                   : Allow
Priority                 : 1020
Direction                : Inbound
SideIndicator            : <=

Name                     : ThisRuleNeedsToStay
Description              : 
Protocol                 : TCP
SourcePortRange          : *
DestinationPortRange     : 5672
SourceAddressPrefix      : *
DestinationAddressPrefix : *
Access                   : Deny
Priority                 : 1030
Direction                : Inbound
SideIndicator            : <=
```

## Next steps

If settings have been changed, see [Manage Network Security Groups](../virtual-network/manage-network-security-group.md) to track down the network security group and security rules that are in question.













