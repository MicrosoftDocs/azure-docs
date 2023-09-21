---
title: Azure RBAC permissions required to use Azure Network Watcher capabilities
description: Learn which Azure role-based access control (Azure RBAC) permissions are required to use Azure Network Watcher capabilities.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.date: 08/18/2023
---

# Azure role-based access control permissions required to use Network Watcher capabilities

Azure role-based access control (Azure RBAC) enables you to assign only the specific actions to members of your organization that they require to complete their assigned responsibilities. To use Azure Network Watcher capabilities, the account you log into Azure with, must be assigned to the [Owner](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#owner), [Contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#contributor), or [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#network-contributor) built-in roles, or assigned to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json) that is assigned the actions listed for each Network Watcher capability in the sections that follow. To learn more about Network Watcher's capabilities, see [What is Network Watcher?](network-watcher-monitoring-overview.md)

> [!IMPORTANT]
> [Network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#network-contributor) does not cover Microsoft.Storage/* or Microsoft.Compute/* actions listed in [Additional actions](#additional-actions) section.

## Network Watcher

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/read                              | Get a network watcher                                          |
| Microsoft.Network/networkWatchers/write                             | Create or update a network watcher                             |
| Microsoft.Network/networkWatchers/delete                            | Delete a network watcher                                       |

## Flow logs

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/configureFlowLog/action           | Configure a flow Log                                           |
| Microsoft.Network/networkWatchers/queryFlowLogStatus/action         | Query status for a flow log                                    |
Microsoft.Storage/storageAccounts/listServiceSas/Action, </br> Microsoft.Storage/storageAccounts/listAccountSas/Action, <br> Microsoft.Storage/storageAccounts/listKeys/Action | Fetch shared access signatures (SAS) enabling [secure access to storage account](../storage/common/storage-sas-overview.md) and write to the storage account |

## Connection troubleshoot

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/connectivityCheck/action          | Initiate a connection troubleshoot test
| Microsoft.Network/networkWatchers/queryTroubleshootResult/action    | Query results of a connection troubleshoot test                |
| Microsoft.Network/networkWatchers/troubleshoot/action               | Run a connection troubleshoot test                             |

## Connection monitor

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/connectionMonitors/start/action   | Start a connection monitor                                     |
| Microsoft.Network/networkWatchers/connectionMonitors/stop/action    | Stop a connection monitor                                      |
| Microsoft.Network/networkWatchers/connectionMonitors/query/action   | Query a connection monitor                                     |
| Microsoft.Network/networkWatchers/connectionMonitors/read           | Get a connection monitor                                       |
| Microsoft.Network/networkWatchers/connectionMonitors/write          | Create a connection monitor                                    |
| Microsoft.Network/networkWatchers/connectionMonitors/delete         | Delete a connection monitor                                    |

## Packet capture

Action | Description
---    | ---        
Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action | Query the status of a packet capture.                     
Microsoft.Network/networkWatchers/packetCaptures/stop/action | Stop a packet capture.                                          
Microsoft.Network/networkWatchers/packetCaptures/read | Get a packet capture.                                           
Microsoft.Network/networkWatchers/packetCaptures/write | Create a packet capture.                                        
Microsoft.Network/networkWatchers/packetCaptures/delete | Delete a packet capture.
Microsoft.Network/networkWatchers/packetCaptures/queryStatus/read | View the status of a packet capture.

## IP flow verify

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/ipFlowVerify/action               | Verify an IP flow                                              |

## Next hop

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/nextHop/action                    | Get the next hop from a VM                                     |

## Network security group view

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/securityGroupView/action          | View security groups                                           |

## Topology

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/topology/action                   | Get topology                                                   |
| Microsoft.Network/networkWatchers/topology/read                     | Same as above                                                  |

## Reachability report

| Action                                                              | Description                                                           |
| ---------                                                           | -------------                                                  |
| Microsoft.Network/networkWatchers/azureReachabilityReport/action    | Get an Azure reachability report                               |


## Additional actions

Network Watcher capabilities also require the following actions:

| Action(s)                                                           | Description       |
| ---------                                                           | -------------        |
| Microsoft.Authorization/\*/Read                                     | Fetch Azure role assignments and policy definitions   |
| Microsoft.Resources/subscriptions/resourceGroups/Read               | Enumerate all the resource groups in a subscription    |
| Microsoft.Storage/storageAccounts/Read                              | Get the properties for the specified storage account   |
| Microsoft.Storage/storageAccounts/listServiceSas/Action, </br> Microsoft.Storage/storageAccounts/listAccountSas/Action, <br> Microsoft.Storage/storageAccounts/listKeys/Action | Used to fetch shared access signatures (SAS) enabling [secure access to storage account](../storage/common/storage-sas-overview.md) and write to the storage account |
| Microsoft.Compute/virtualMachines/Read, </br> Microsoft.Compute/virtualMachines/Write| Log in to the VM, do a packet capture and upload it to storage account |
| Microsoft.Compute/virtualMachines/extensions/Read, </br> Microsoft.Compute/virtualMachines/extensions/Write | Check if Network Watcher extension is present, and install if necessary |
| Microsoft.Compute/virtualMachineScaleSets/Read, </br> Microsoft.Compute/virtualMachineScaleSets/Write | Access virtual machine scale sets, do packet captures and upload them to storage account |
| Microsoft.Compute/virtualMachineScaleSets/extensions/Read, </br> Microsoft.Compute/virtualMachineScaleSets/extensions/Write| Check if Network Watcher extension is present, and install if necessary |
| Microsoft.Insights/alertRules/*                                     | Set up metric alerts      |
| Microsoft.Support/*                                                 | Create and update support tickets from Network Watcher |
