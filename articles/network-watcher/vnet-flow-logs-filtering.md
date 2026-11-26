---
title: Filter Virtual Network Flow Logs 
titleSuffix: Azure Network Watcher
description: Learn how to apply filtering in Azure Network Watcher virtual network flow logs to capture specific traffic based on flow state, actions, IP ranges, ports, protocols, and more.
author: huzefafw
ms.author: hufurnit
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/24/2026
---

# Filter virtual network flow logs 

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [Virtual network flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn about virtual network flow logs filtering capability. The filtering capability provides users with options to record traffic within a virtual network (intra-VNet traffic) or with two or more virtual networks (inter-VNet traffic). It also helps users identify CIDR range-based traffic, inbound outbound traffic, internet traffic, and allowed/denied traffic. 

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

All the fields can take comma-separated values as input. All are case-insensitive.

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

# [**Azure Portal**](#tab/version2)

1. In the Azure portal, go to **Network Watcher** > **Flow logs**, and select **+ Create**.
2. On the **Basics** tab, enter the required details for the flow log, and then select **Next: Configure**.
3. On the **Configure** tab, under **Configure traffic capture**, select a **Traffic capture mode**:
   - **Capture all traffic (default)**: Captures all supported traffic for the selected resources.
   - **Custom traffic filters**: Captures only traffic that matches the filters you configure.


:::image type="content" source="./media/vnet-flow-logs-filtering/enable-filtering-on-portal.png" alt-text="Screenshot that shows custom traffic filters for a virtual network flow log in the Azure portal." lightbox="./media/vnet-flow-logs-filtering/enable-filtering-on-portal.png":::

4. If you select **Custom traffic filters**, configure the filters under **Configure traffic filters**:
   1. In **Record type**, select one or more values.
   2. Select **+ Add condition**.
   3. For the condition, set the following values:

      | Field | Description |
      |---|---|
      | **Attribute** | The traffic property to filter on. Select one of: **Source IP**, **Source port**, **Destination IP**, **Destination port**, **Protocol**, **Encryption**, or **Direction**. |
      | **Operator** | The comparison to apply. |
      | **Value** | The value to match, such as an IP address or range, port, or protocol. |

   4. To add more conditions, select **+ Add condition** again and choose a **Connector** to combine them with the previous condition. 
   5. To remove a condition, select the **Delete** icon in its row.
5. Select **Next: Analytics** and configure Traffic Analytics if needed.
6. Optionally, add **Tags**.
7. Select **Review + create**, review the settings, and then select **Create**.

# [**PowerShell**](#tab/version5)

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

---

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
## Filtering based on RecordTypes

You can filter virtual network flow logs based on the state of a network flow. Flow state represents the lifecycle stage of a connection as observed by Network Watcher, such as when a flow begins, continues, ends, or is denied. 

Use the RecordTypes parameter to specify which flow states you want to record. The parameter accepts one or more comma‑separated values.

### Supported RecordType Values

| Value | Description |
|-------|-------------|
| B     | Begin: when a flow is created. No statistics are provided. |
| C     | Continuing: an ongoing flow. Statistics are provided at five-minute intervals. |
| E     | End: when a flow is terminated. Statistics are provided. |
| D     | Deny: when a flow is denied. |

:::image type="content" source="./media/vnet-flow-logs-filtering/record-type-filtering-on-portal.png" alt-text="Screenshot that shows the Begin, Continuing, End, and Deny record type options for a virtual network flow log in the Azure portal." lightbox="./media/vnet-flow-logs-filtering/record-type-filtering-on-portal.png":::

### Example scenarios using RecordTypes

| Scenario | RecordTypes value |
|----------|-------------------|
| Capture only denied traffic | "D" |
| Capture flow creation and termination events | "B,E" |
| Capture only active traffic statistics | "C" |
| Capture full flow lifecycle | "B,C,E" |

## Manage RecordTypes filtering condition

You can enable RecordTypes filtering during flow log creation by choosing which flow record formats to collect in order to tailor logging output without generating unnecessary data. You can also update RecordTypes filterning condition for an existing flow log.

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

## Related content

- [Virtual network flow logs overview](vnet-flow-logs-overview.md)
- [Create and manage virtual network flow logs](vnet-flow-logs-manage.md)
- [Log network traffic to and from a virtual network using the Azure portal](vnet-flow-logs-tutorial.md)

