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

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Supported log categories

Azure Virtual Network Manager currently provides the following log categories:
- Network group membership change 
    - Track when a particular virtual network’s network group membership is modified. In other words, a log is emitted when a virtual network is added to or removed from a network group. This can be used to trace network group membership changes over time and to capture a snapshot of a particular virtual network’s network group membership.
- Rule collection change
    - Track when a particular virtual network’s set of applied security admin rule collections changes. A log is emitted for every rule collection deployed to a virtual network via the network group the rule collection is targeting. Any removal of a rule collection from a network group through a deployment process will also result in a log for each affected virtual network. This schema can be used to track what rule collection(s) have been deployed to a particular virtual network over time.
    - If a virtual network is receiving security admin rule collection(s) from multiple network managers, logs will be emitted separately for each network manager for their respective rule collection changes.
    - If a virtual network is added to or removed from a network group that already has a rule collection(s) deployed onto it, a log will be emitted for that virtual network showing the state of applied rule collection(s).

## Network group membership change attributes 

This category emits one log per network group membership change. So, when a virtual network is added to or removed from a network group, a log is emitted correlating to that single addition or removal for that particular virtual network. The following attributes correspond to the logs that would be sent to your storage account; Log Analytics logs have slightly different attributes. 

| Attribute | Description |
|-----------|-------------|
| time | Datetime when the event was logged. |
| resourceId | Resource ID of the network manager. |
| location | Location of the virtual network resource. |
| operationName | Operation that resulted in the virtual network being added or removed. Always the Microsoft.Network/virtualNetworks/networkGroupMembership/write operation. |
| category | Category of this log. Always NetworkGroupMembershipChange. |
| resultType | Indicates successful or failed operation. |
| correlationId | GUID that can help relate or debug logs. |
| level | Always Info. |
| properties | Collection of properties of the log. |

Within the `properties` attribute are several nested attributes:

| properties attributes | Description |
|--------------------|-------------|
| Message | A static message stating if a network group membership change was successful or unsuccessful. |
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

## Rule collection change attributes

This category emits one log per security admin rule collection change per virtual network. So, when a security admin rule collection is applied to or removed from a virtual network through its network group, a log is emitted correlating to that change in rule collection for that particular virtual network. The following attributes correspond to the logs that would be sent to your storage account; Log Analytics logs will have slightly different attributes.

| Attribute | Description |
|-----------|-------------|
| time | Datetime when the event was logged. |
| resourceId | Resource ID of the network manager. |
| location | Location of the virtual network resource. |
| operationName | Operation that resulted in the virtual network being added or removed. Always the Microsoft.Network/networkManagers/securityAdminRuleCollections/write operation. |
| category | Category of this log. Always RuleCollectionChange. |
| resultType | Indicates successful or failed operation. |
| correlationId | GUID that can help relate or debug logs. |
| level | Always Info. |
| properties | Collection of properties of the log. |

Within the `properties` attribute are several nested attributes:

| properties attributes | Description |
|--------------------|-------------|
| TargetResourceIds | Resource ID of the virtual network that experienced a change in rule collection application. |
| Message | A static message stating if a rule collection change was successful or unsuccessful. |
| AppliedRuleCollectionIds | Collection of what security admin rule collections are applied to the virtual network at the time the log was emitted. There may be multiple rule collection IDs listed since a virtual network can belong to multiple network groups and have multiple rule collections applied simultaneously. |

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

