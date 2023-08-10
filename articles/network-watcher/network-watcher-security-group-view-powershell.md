---
title: Analyze network security - Security Group View - Azure PowerShell
titleSuffix: Azure Network Watcher
description: This article will describe how to use PowerShell to analyze a virtual machines security with Security Group View.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/20/2020
ms.author: halkazwini
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Analyze your Virtual Machine security with Security Group View using PowerShell

> [!div class="op_single_selector"]
> - [PowerShell](network-watcher-security-group-view-powershell.md)
> - [Azure CLI](network-watcher-security-group-view-cli.md)
> - [REST API](network-watcher-security-group-view-rest.md)

> [!NOTE]
> The Security Group View API is no longer being maintained and will be deprecated soon. Please use the [Effective Security Rules feature](./network-watcher-security-group-view-overview.md) which provides the same functionality. 

Security group view returns configured and effective network security rules that are applied to a virtual machine. This capability is useful to audit and diagnose Network Security Groups and rules that are configured on a VM to ensure traffic is being correctly allowed or denied. In this article, we show you how to retrieve the configured and effective security rules to a virtual machine using PowerShell


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Before you begin

In this scenario, you run the `Get-AzNetworkWatcherSecurityGroupView` cmdlet to retrieve the security rule information.

This scenario assumes you have already followed the steps in [Create a Network Watcher](network-watcher-create.md) to create a Network Watcher.

## Scenario

The scenario covered in this article retrieves the configured and effective security rules for a given virtual machine.

## Retrieve Network Watcher

The first step is to retrieve the Network Watcher instance. This variable is passed to the `Get-AzNetworkWatcherSecurityGroupView` cmdlet.

```powershell
$nw = Get-AzResource | Where {$_.ResourceType -eq "Microsoft.Network/networkWatchers" -and $_.Location -eq "WestCentralUS" }
$networkWatcher = Get-AzNetworkWatcher -Name $nw.Name -ResourceGroupName $nw.ResourceGroupName
```

## Get a VM

A virtual machine is required to run the `Get-AzNetworkWatcherSecurityGroupView` cmdlet against. The following example gets a VM object.

```powershell
$VM = Get-AzVM -ResourceGroupName testrg -Name testvm1
```

## Retrieve security group view

The next step is to retrieve the security group view result.

```powershell
$secgroup = Get-AzNetworkWatcherSecurityGroupView -NetworkWatcher $networkWatcher -TargetVirtualMachineId $VM.Id
```

## Viewing the results

The following example is a shortened response of the results returned. The results show all the effective and applied security rules on the virtual machine broken down in groups of **NetworkInterfaceSecurityRules**, **DefaultSecurityRules**, and **EffectiveSecurityRules**.

```
NetworkInterfaces : [
                      {
                        "NetworkInterfaceSecurityRules": [
                          {
                            "Name": "default-allow-rdp",
                            "Etag": "W/\"d4c411d4-0d62-49dc-8092-3d4b57825740\"",
                            "Id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg2/providers/Microsoft.Network/networkSecurityGroups/testvm2-nsg/securityRules/default-allow-rdp",
                            "Protocol": "TCP",
                            "SourcePortRange": "*",
                            "DestinationPortRange": "3389",
                            "SourceAddressPrefix": "*",
                            "DestinationAddressPrefix": "*",
                            "Access": "Allow",
                            "Priority": 1000,
                            "Direction": "Inbound",
                            "ProvisioningState": "Succeeded"
                          }
                          ...
                        ],
                        "DefaultSecurityRules": [
                          {
                            "Name": "AllowVnetInBound",
                            "Id": "/subscriptions00000000-0000-0000-0000-000000000000/resourceGroups/testrg2/providers/Microsoft.Network/networkSecurityGroups/testvm2-nsg/defaultSecurityRules/",
                            "Description": "Allow inbound traffic from all VMs in VNET",
                            "Protocol": "*",
                            "SourcePortRange": "*",
                            "DestinationPortRange": "*",
                            "SourceAddressPrefix": "VirtualNetwork",
                            "DestinationAddressPrefix": "VirtualNetwork",
                            "Access": "Allow",
                            "Priority": 65000,
                            "Direction": "Inbound",
                            "ProvisioningState": "Succeeded"
                          }
                          ...
                        ],
                        "EffectiveSecurityRules": [
                          {
                            "Name": "DefaultOutboundDenyAll",
                            "Protocol": "All",
                            "SourcePortRange": "0-65535",
                            "DestinationPortRange": "0-65535",
                            "SourceAddressPrefix": "*",
                            "DestinationAddressPrefix": "*",
                            "ExpandedSourceAddressPrefix": [],
                            "ExpandedDestinationAddressPrefix": [],
                            "Access": "Deny",
                            "Priority": 65500,
                            "Direction": "Outbound"
                          },
                          ...
                        ]
                      }
                    ]
```

## Next steps

Visit [Auditing Network Security Groups (NSG) with Network Watcher](network-watcher-nsg-auditing-powershell.md) to learn how to automate validation of Network Security Groups.
