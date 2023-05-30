---
title: Event log options for Azure Virtual Network Manager
description: This article covers the event log  options for Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: conceptual
ms.service: virtual-network-manager
ms.date: 04/13/2023
---

# Event log options for Azure Virtual Network Manager

Azure Virtual Network Manager uses Azure Monitor for data collection and analysis like many other Azure services. Azure Virtual Network Manager provides event logs for each network manager. You can store and view event logs with Azure Monitor’s Log Analytics tool in the Azure portal, and through a storage account. You may also send these logs to an event hub or partner solution. 

## Supported log categories

Azure Virtual Network Manager currently provides the following log categories:
- Network group membership change 
    - Track when a particular virtual network’s network group membership is modified. In other words, a log is emitted when a virtual network is added to or removed from a network group. This can be used to trace network group membership changes over time and to capture a snapshot of a particular virtual network’s network group membership.

## Network group membership change attributes 

This category emits one log per network group membership change. So, when a virtual network is added to or removed from a network group, a log is emitted correlating to that single addition or removal for that particular virtual network. The following attributes correspond to the logs that would be sent to your storage account; Log Analytics logs have slightly different attributes. 

| Attribute | Description |
|-----------|-------------|
| time | Datetime when the event was logged. |
| resourceId | Resource ID of the network manager. |
| location | Location of the virtual network resource. |
| operationName | Operation that resulted in the VNet being added or removed. Always the Microsoft.Network/virtualNetworks/networkGroupMembership/write operation. |
| category | Category of this log. Always NetworkGroupMembershipChange. |
| resultType | Indicates successful or failed operation. |
| correlationId | GUID that can help relate or debug logs. |
| level | Always Info. |
| properties | Collection of properties of the log. |

Within the `properties` attribute are several nested attributes:

| properties attributes | Description |
|--------------------|-------------|
| Message | Basic success or failure message. |
| MembershipId | Default membership ID of the virtual network. |
| GroupMemberships | Collection of what network groups the virtual network belongs to. There may be multiple `NetworkGroupId` and `Sources` listed within this property since a virtual network can belong to multiple network groups simultaneously. |
| MemberResourceIds | Resource ID of the virtual network that was added to or removed from a network group. |

Within the `GroupMemberships` attribute are several nested attributes:

| GroupMemberships attributes | Description |
|-----------------------------|-------------|
| NetworkGroupId | ID of a network group the virtual network belongs to. |
| Sources | Collection of how the virtual network is a member of the network group. |

Within the `Sources` attribute are several nested attributes:

| Sources attributes | Description |
|-------------------|-------------|
| Type | Denotes whether the virtual network was added manually (StaticMembership) or conditionally via Azure Policy (Policy). |
| StaticMemberId | If the Type value is StaticMembership, this property appears. |
| PolicyAssignmentId | If the Type value is Policy, this property appears. ID of the Azure Policy assignment that associates the Azure Policy definition to the network group. |
| PolicyDefinitionId | If the Type value is Policy, this property appears. ID of the Azure Policy definition that contains the conditions for the network group’s membership. |

## Accessing logs

Depending on how you consume event logs, you need to set up a Log Analytics workspace or a storage account for storing your log events. 
- Learn to [create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).
- Learn to [create a storage account](../storage/common/storage-account-create.md).

When setting up a Log Analytics workspace or a storage account, you need to select a region. If you’re using a storage account, it needs to be in the same region of the virtual network manager you’re accessing logs from. If you’re using a Log Analytics workspace, it can be in any region. 

The network manager accessing the events isn't required to be in the same subscription as the Log Analytics workspace or the storage account used for storage, but permissions may restrict your ability to access logs across different subscriptions. 

> [!NOTE]
> At least one virtual network must be added or removed from a network group in order to generate logs. A log will generate for this event a couple minutes after network group membership change occurs. 

## Next steps
- Learn to Configure Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
- Learn more about [network groups](concept-network-groups.md) in Azure Virtual Network Manager.

