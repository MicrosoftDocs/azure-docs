---
title: Data Collection Rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/19/2021
ms.custom: references_region

---

# Data collection rules in Azure Monitor
Data Collection Rules (DCRs) in Azure Monitor define data coming into Azure Monitor. DCRs may specify where that data should be sent or stored and may also filter or transform it. Some data collection rules will be created and managed by Azure Monitor, while you may create others to customize data collection for your particular requirements. This article describes DCRs including their contents and structure and how you can create and work with them.

## Types of data collection rules
There are currently two types of data collection rule in Azure Monitor:

- **Standard DCR**. Used with different workflows that send data to Azure Monitor. The workflows currently supported are [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and [custom logs](../logs/custom-logs-overview.md).

- **Workspace transformation DCR**. Used with a workspace to apply transformations to workflows that don't currently support DCRs.

## Limits
For limits that apply to each data collection rule, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).

## Data resiliency and high availability
Data collection rules are stored regionally, and are available in all public regions where Log Analytics is supported. Government regions and clouds are not currently supported. A rule gets created and stored in the region you specify, and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region, making it a **zone-redundant service** which further adds to high availability.

### Single region data residency
This is a preview feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. Single region residency is enabled by default in these regions.

## Creating data collection rules

## Next steps

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
