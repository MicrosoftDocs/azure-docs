---
title: Monitor operations, events, and counters for NSGs | Microsoft Docs
description: Learn how to enable counters, events, and operational logging for NSGs
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 2e699078-043f-48bd-8aa8-b011a32d98ca
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/31/2017
ms.author: jdial

---
# Log analytics for network security groups (NSGs)

You can enable the following diagnostic log categories for NSGs:

* **Event:** Contains entries for which NSG rules are applied to VMs and instance roles based on MAC address. The status for these rules is collected every 60 seconds.
* **Rule counter:** Contains entries for how many times each NSG rule is applied to deny or allow traffic.

> [!NOTE]
> Diagnostic logs are only available for NSGs deployed through the Azure Resource Manager deployment model. You cannot enable diagnostic logging for NSGs deployed through the classic deployment model. For a better understanding of the two models, reference the [Understanding Azure deployment models](../resource-manager-deployment-model.md) article.

Activity logging (previously known as audit or operational logs) is enabled by default for NSGs created through either Azure deployment model. To determine which operations were completed on NSGs in the activity log, look for entries that contain the following resource types: 

- Microsoft.ClassicNetwork/networkSecurityGroups 
- Microsoft.ClassicNetwork/networkSecurityGroups/securityRules
- Microsoft.Network/networkSecurityGroups
- Microsoft.Network/networkSecurityGroups/securityRules 

Read the [Overview of the Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md) article to learn more about activity logs. 

## Enable diagnostic logging

Diagnostic logging must be enabled for *each* NSG you want to collect data for. The [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) article explains where diagnostic logs can be sent. If you don't have an existing NSG, complete the steps in the [Create a network security group](virtual-networks-create-nsg-arm-pportal.md) article to create one. You can enable NSG diagnostic logging using any of the following methods:

### Azure portal

To use the portal to enable logging, login to the [portal](https://portal.azure.com). Click **More services**, then type *network security groups*. Select the NSG you want to enable logging for. Follow the instructions for non-compute resources in the [Enable diagnostic logs in the portal](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#enable-diagnostic-logs-in-the-portal) article. Select **NetworkSecurityGroupEvent**, **NetworkSecurityGroupRuleCounter**, or both categories of logs.

### PowerShell

To use PowerShell to enable logging, follow the instructions in the [Enable diagnostic logs via PowerShell](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#enable-diagnostic-logs-via-powershell) article. Evaluate the following information before entering a command from the article:

- You can determine the value to use for the `-ResourceId` parameter by replacing the following [text], as appropriate, then entering the command `Get-AzureRmNetworkSecurityGroup -Name [nsg-name] -ResourceGroupName [resource-group-name]`. The ID output from the command looks similar to */subscriptions/[Subscription Id]/resourceGroups/[resource-group]/providers/Microsoft.Network/networkSecurityGroups/[NSG name]*.
- If you only want to collect data from log category add `-Categories [category]` to the end of the command in the article, where category is either *NetworkSecurityGroupEvent* or *NetworkSecurityGroupRuleCounter*. If you don't use the `-Categories` parameter, data collection is enabled for both log categories.

### Azure command-line interface (CLI)

To use the CLI to enable logging, follow the instructions in the [Enable diagnostic logs via CLI](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#enable-diagnostic-logs-via-cli) article. Evaluate the following information before entering a command from the article:

- You can determine the value to use for the `-ResourceId` parameter by replacing the following [text], as appropriate, then entering the command `azure network nsg show [resource-group-name] [nsg-name]`. The ID output from the command looks similar to */subscriptions/[Subscription Id]/resourceGroups/[resource-group]/providers/Microsoft.Network/networkSecurityGroups/[NSG name]*.
- If you only want to collect data from log category add `-Categories [category]` to the end of the command in the article, where category is either *NetworkSecurityGroupEvent* or *NetworkSecurityGroupRuleCounter*. If you don't use the `-Categories` parameter, data collection is enabled for both log categories.

## Logged data

JSON-formatted data is written for both logs. The specific data written for each log type is listed in the following sections:

### Event log
This log contains information about which NSG rules are applied to VMs and cloud service role instances, based on MAC address. The following example data is logged for each event:

```json
{
	"time": "[DATE-TIME]",
	"systemId": "007d0441-5d6b-41f6-8bfd-930db640ec03",
	"category": "NetworkSecurityGroupEvent",
	"resourceId": "/SUBSCRIPTIONS/[SUBSCRIPTION-ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME]/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG-NAME]",
	"operationName": "NetworkSecurityGroupEvents",
	"properties": {
		"vnetResourceGuid":"{5E8AEC16-C728-441F-B0CA-B791E1DBC2F4}",
		"subnetPrefix":"192.168.1.0/24",
		"macAddress":"00-0D-3A-92-6A-7C",
		"primaryIPv4Address":"192.168.1.4",
		"ruleName":"UserRule_default-allow-rdp",
		"direction":"In",
		"priority":1000,
		"type":"allow",
		"conditions":{
			"protocols":"6",
			"destinationPortRange":"3389-3389",
			"sourcePortRange":"0-65535",
			"sourceIP":"0.0.0.0/0",
			"destinationIP":"0.0.0.0/0"
			}
		}
}
```

### Rule counter log

This log contains information about each rule applied to resources. The following example data is logged each time a rule is applied:

```json
{
	"time": "[DATE-TIME]",
	"systemId": "007d0441-5d6b-41f6-8bfd-930db640ec03",
	"category": "NetworkSecurityGroupRuleCounter",
	"resourceId": "/SUBSCRIPTIONS/[SUBSCRIPTION ID]/RESOURCEGROUPS/[RESOURCE-GROUP-NAME]TESTRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/[NSG-NAME]",
	"operationName": "NetworkSecurityGroupCounters",
	"properties": {
		"vnetResourceGuid":"{5E8AEC16-C728-441F-B0CA-791E1DBC2F4}",
		"subnetPrefix":"192.168.1.0/24",
		"macAddress":"00-0D-3A-92-6A-7C",
		"primaryIPv4Address":"192.168.1.4",
		"ruleName":"UserRule_default-allow-rdp",
		"direction":"In",
		"type":"allow",
		"matchedConnections":125
		}
}
```

## View and analyze logs

To learn how to view activity log data, read the [Overview of the Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) article. To learn how to view diagnostic log data, read the [Overview of Azure Diagnostic Logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) article. If you send diagnostics data to Log Analytics, you can use the [Azure Network Security Group analytics](../log-analytics/log-analytics-azure-networking-analytics.md) (preview) management solution for enhanced insights. 
