---
title: Data collection rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2024
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules in Azure Monitor
Data collection rules (DCRs) are sets of instructions supporting data collection using the [Azure Monitor pipeline](./pipeline-overview.md). They provide a consistent and centralized way to define and customize different data collection scenarios. Depending on the scenario, DCRs specify such details as what data should be collected, how to transform that data, and where to send it. 

DCRs are stored in Azure so that you can centrally manage them. Different components of a data collection workflow will access the DCR for particular information that it requires. In some cases, you can use the Azure portal to configure data collection, and Azure Monitor will create and manage the DCR for you. Other scenarios will require you to create your own DCR. You may also choose to customize an existing DCR to meet your required functionality.

For example, the following diagram illustrates data collection for the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) running on a virtual machine. In this scenario, the DCR specifies events and performance data to collect, which the agent uses to determine what data to collect from the machine and send to Azure Monitor. Once the data is delivered, the data pipeline runs the transformation specified in the DCR to filter and modify the data and then sends the data to the specified workspace and table. DCRs for other data collection scenarios may contain different information.

:::image type="content" source="media/data-collection-rule-overview/overview-agent.png" lightbox="media/data-collection-rule-overview/overview-agent.png" alt-text="Diagram that shows basic operation for DCR using Azure Monitor Agent." border="false":::


## Data collection rule associations

Some data collection scenarios will use data collection rule associations (DCRAs), which associate a DCR with an object being monitored. A single object can be associated with multiple DCRs, and a single DCR can be associated with multiple objects. This allows you to manage a single DCR for a group of objects.

For example, the diagram above illustrates data collection for the Azure Monitor agent. When the agent is installed, it connects to Azure Monitor to retrieve any DCRs that are associated with it. You can create an association with to the same DCRs for multiple VMs.


## Supported regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.

## Data resiliency and high availability
A DCR gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.
