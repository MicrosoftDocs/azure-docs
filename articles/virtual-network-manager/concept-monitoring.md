---
title: Monitoring Azure Virtual Network Manager
description: This article describes monitoring option for Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: conceptual
ms.service: azure-virtual-network-manager
ms.date: 04/12/2023
---

# Monitoring Azure Virtual Network Manager

Azure Virtual Network Manager uses Azure Monitor for telemetry collection and analysis like many other Azure services. Azure Virtual Network Manager provides event logs for each network manager that you can interact with through Azure Monitor’s Log Analytics tool in the Azure Portal, as well as through a storage account. You may also send these logs to an event hub or partner solution. 

## Supported log categories

Azure Virtual Network Manager currently provides the following log categories:
- Network group membership change 
    - Track when a particular virtual network’s network group membership is modified. In other words, a log is emitted when a virtual network is added to or removed from a network group. This can be used to trace network group membership changes over time and to capture a snapshot of a particular virtual network’s network group membership.

## Network group membership change attributes 

This category emits one log per network group membership change. So, when a virtual network is added to or removed from a network group, a log is emitted correlating to that single addition or removal for that particular virtual network. The following attributes correspond to the logs that would be sent to your storage account; Log Analytics logs will have slightly different attributes. 

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


