---
title: "Network Security Groups connector for Microsoft Sentinel"
description: "Learn how to install the connector Network Security Groups to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Network Security Groups connector for Microsoft Sentinel

Azure network security groups (NSG) allow you to filter network traffic to and from Azure resources in an Azure virtual network. A network security group includes rules that allow or deny traffic to a virtual network subnet, network interface, or both.

When you enable logging for an NSG, you can gather the following types of resource log information:

- **Event:** Entries are logged for which NSG rules are applied to VMs, based on MAC address.
- **Rule counter:** Contains entries for how many times each NSG rule is applied to deny or allow traffic. The status for these rules is collected every 300 seconds.


This connector lets you stream your NSG diagnostics logs into Microsoft Sentinel, allowing you to continuously monitor activity in all your instances. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2223718&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | NetworkSecurityGroupEvent<br/> NetworkSecurityGroupRuleCounter<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-networksecuritygroup?tab=Overview) in the Azure Marketplace.
