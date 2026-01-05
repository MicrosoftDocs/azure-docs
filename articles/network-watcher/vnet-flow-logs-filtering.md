---
title: Filter Virtual Network Flow Logs (Preview)
titleSuffix: Azure Network Watcher
description: Learn how to apply filtering in Azure Network Watcher virtual network flow logs to capture specific traffic based on flow state, actions, IP ranges, ports, protocols, and more.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 12/26/2025
---

# Filter virtual network flow logs (preview)

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [Virtual network flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn about virtual network flow logs filtering capability. The filtering capability provides users with options to record traffic within a virtual network (intra-VNet traffic) or with two or more virtual networks (inter-VNet traffic). It also helps users identify CIDR range-based traffic, inbound outbound traffic, internet traffic, and allowed/denied traffic. 

> [!IMPORTANT]
> Virtual network flow logs filtering is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported fields

| Field           | Filter based on                        | Example                                                                   |
|-----------------|----------------------------------------|---------------------------------------------------------------------------|
| Direction       | Traffic direction                      | Inbound, Outbound                                                         |
| SrcIP           | Source IP address / CIDR range         | 192.168.1.1, 2001:db8::1/64                                               |
| SrcPort         | Source port ranges and values          | 1024-65535, 80, 443                                                       |
| DstIP           | Destination IP addresses / CIDR range  | 192.168.2.1, 2001:db8::2/64                                               |
| DstPort         | Destination port ranges and values     | 22, 8080-8090                                                             |
| Protocol        | Protocol type                          | TCP, UDP                                                                  |
| Encryption      | Encryption status                      | All supported encryption values and `NX_ALL` (not encrypted for any reason) |

All the fields can take comma separate value as input. All are case-insensitive.

## Supported operations

Virtual network flow logs support `=` and `!=` for every field.

## Supported operands

Virtual network flow logs support logical operands `&&` and `||` between any two fields.

## Supported format

- Fields can be provided in any combination.
- Brackets aren't currently supported.
- Fields are evaluated honoring logical operand precedence (**AND before OR**) from left to right.
- The maximum length of the filtering string can be **1000 characters**.

## Enable filtering

To create virtual network flow logs with filtering, use the [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) cmdlet.  


```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name 'myVNet' -ResourceGroupName 'myResourceGroup'

# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Create a traffic analytics workspace and place its configuration into a variable.
$workspace = New-AzOperationalInsightsWorkspace -Name 'myWorkspace' -ResourceGroupName 'myResourceGroup' -Location 'EastUS'

# Create a VNet flow log with the following filtering criteria: dstip=20.252.145.59 || DstPort=443
New-AzNetworkWatcherFlowLog -Enabled $true -Name 'myVNetFlowLog' -NetworkWatcherName 'NetworkWatcher_eastus' `
    -ResourceGroupName 'NetworkWatcherRG' -StorageId $storageAccount.Id -TargetResourceId $vnet.Id `
    -FormatVersion 2 -EnabledFilteringCriteria 'dstip=20.252.145.59 || DstPort=54300-54400' `
    -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId `
    -EnableRetention $true -RetentionPolicyDays 15
```
  
## Update existing filtering

You can modify existing filtering criteria for virtual network flow logs using the [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) cmdlet with updated conditions without the need to recreate the flow log.

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name 'myVNet' -ResourceGroupName 'myResourceGroup'

# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Place the workspace configuration into a variable.
$workspace = Get-AzOperationalInsightsWorkspace -Name 'myWorkspace' -ResourceGroupName 'myResourceGroup'

# Update the VNet flow log.
Set-AzNetworkWatcherFlowLog -Enabled $true -Name 'myVNetFlowLog' -NetworkWatcherName 'NetworkWatcher_eastus' `
    -ResourceGroupName 'NetworkWatcherRG' -StorageId $storageAccount.Id -TargetResourceId $vnet.Id `
    -FormatVersion 2 -EnabledFilteringCriteria 'dstip=20.252.145.59 || DstPort=443' `
    -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId `
    -EnableRetention $true -RetentionPolicyDays 15
```

## Update RecordTypes filtering condition

You can enable RecordTypes filtering during flow log creation by choosing which flow record formats to collect in order to tailor logging output without generating unnecessary data.

```azurepowershell-interactive
# Enable RecordTypes filtering while creating flowlog 
New-AzNetworkWatcherFlowLog `
  -Enabled $true -Name <FlowLog Name> `
  -NetworkWatcherName <Network Watcher Name> `
  -ResourceGroupName NetworkWatcherRG `
  -StorageId <Storage Account ID> `
  -TargetResourceId <Target Resource/VNet ID> `
  -RecordTypes "<Record Types>"
```

```azurepowershell-interactive
# Update RecordTypes filtering condition on existing flow log
Set-AzNetworkWatcherFlowLog `
  -Enabled $true  -Name <FlowLog Name> `
  -NetworkWatcherName <Network Watcher Name> `
  -ResourceGroupName <Resource Group Name> `
  -StorageId <Storage Account ID> `
  -TargetResourceId <Target Resource/VNet ID> `
  -RecordTypes "<Record Types>"
```

```azurepowershell-interactive
# Remove RecordTypes filtering condition from existing flow log
Set-AzNetworkWatcherFlowLog `
  -Enabled $true  -Name <FlowLog Name> `
  -NetworkWatcherName <Network Watcher Name> `
  -ResourceGroupName <Resource Group Name> `
  -StorageId <Storage Account ID> `
  -TargetResourceId <Target Resource/VNet ID> `
  -RecordTypes ""
```

```azurepowershell-interactive
# Enable RecordTypes and EnabledFilteringCriteria filtering while creating flow log
New-AzNetworkWatcherFlowLog `
  -Enabled $true -Name <FlowLog Name> `
  -NetworkWatcherName <Network Watcher Name> `
  -ResourceGroupName <Resource Group Name> `
  -StorageId <Storage Account ID> `
  -TargetResourceId <Target Resource/VNet ID> `
  -EnabledFilteringCriteria "<Filtering Criteria Expression>" `
  -RecordTypes "<Record Types>"
```

## Related content

- [Virtual network flow logs overview](vnet-flow-logs-overview.md)
- [Create and manage virtual network flow logs](vnet-flow-logs-manage.md)
- [Log network traffic to and from a virtual network using the Azure portal](vnet-flow-logs-tutorial.md)

