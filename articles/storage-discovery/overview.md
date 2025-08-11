---
title: Azure Storage Discovery Overview
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into their storage estate at entire organization level and aiding business decisions.
author: fauhse

ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 08/01/2025
ms.author: fauhse
---

# What is Azure Storage Discovery (preview)?

**Azure Storage Discovery** (preview) is a fully managed service that provides enterprise-wide visibility into your Azure Blob Storage data estate. In a single pane of glass you can understand and analyze how your data estate evolved over time, optimize costs, enhance security, and drive operational efficiency.

Azure Storage Discovery integrates with Copilot in Azure, enabling you to unlock insights and accelerate decision-making without utilizing any query language.

Whether you're shaping cloud strategy or safeguarding data, Azure Storage Discovery gives you instant clarity on your Blob Storage estate.
From architecture to governance, it delivers fast answers that help you take control of your Azure data landscape.

- Measure how much data is stored across all storage accounts.
- Identify regions experiencing the highest growth.
- Find opportunities to reduce costs by locating infrequently used data.
- Assess whether storage configurations align with security and compliance best practices.

<!-- Whether you're a cloud architect, storage administrator, or data governance lead, Azure Storage Discovery helps you quickly answer key questions about your enterprise data estate in Azure Blob Storage:

- How much data do we store across all our storage accounts?
- What are the regions with the highest growth?
- Can I reduce our costs by finding data that isn't being frequently used?
- Are our storage configurations aligned with security and compliance best practices? -->

:::image type="content" source="media/overview/overview-copilot-small.png" alt-text="Azure portal sowing a Discovery report and copilot chat window." lightbox="media/overview/overview-copilot-big.png":::

## Gain advanced storage insights

Track how your Azure Blob Storage estate is evolving and uncover hidden opportunities to reduce costs, boost performance, and tighten security. Azure Storage Discovery reveals underused data, throttling risks, and ways to optimize spending.
These insights are powered by metrics related to storage capacity (object size and object count), activity on the data estate (transactions, ingress, egress), aggregation of transaction errors and detailed configurations for data protection, cost optimization, and security.

<!-- Analyze how the data estate in Azure Blob Storage is growing, identify opportunities for cost optimization, discover data that is under-utilized, pinpoint workloads that could be getting throttled and find ways to strengthen the security of your storage accounts. These insights are powered by metrics related to storage capacity (object size and object count), activity on the data estate (transactions, ingress, egress), aggregation of transaction errors and detailed configurations for data protection, cost optimization and security. -->

### Interactive reports

Your Discovery resource in the Azure portal offers intuitive reports that reveal trends, highlight top storage accounts, and link directly to the resources behind each chart. Quickly spot patterns, surface key accounts, and jump straight to the data—all from your Discovery dashboard in Azure.
Filter reports by region, redundancy, performance, encryption, and more to focus on the most relevant parts of your data estate.

<!-- Your Discovery resource in the Azure portal features several reports that make it simple to analyze trends over time, drill into top storage accounts, and instantly navigate to the specific resources represented in each chart. The reports can be filtered to focus on specific parts of the data estate based on Storage account configurations like Regions, Redundancy, Performance type, Encryption type, and others. -->

### Organization-wide visibility

Flexible scoping allows you to gather insights for multiple business groups, workloads, or groupings of resources that are meaningful to you. Analyze up to 1 million storage accounts spread across different subscriptions, resource groups, and regions within a single workspace. The ability to drill down and filter data allows you to quickly obtain actionable insights for optimizing your data estate.

### Adding Storage Discovery is simple

**Fully managed service** 
The Discovery service computes and hosts your insights. No other infrastructure needs to be deployed or paid for.

**No impact on storage resources**
Your Azure Storage resources (like storage accounts) experience no transactions or performance impact when analyzing them with Azure Storage Discovery.

**History provided right from the start**
Up to 30 days of historical data is added automatically, once you deploy a Discovery workspace. All insights are retained for up to 18 months. History and retention depend on the [pricing plan](pricing.md) you choose.

**Free and paid pricing plans**
Azure Storage Discovery offers free and paid pricing plans for each workspace. The [pricing article](pricing.md) describes the differences and explains what influences the bill when choosing a paid option.





<!--
is a fully managed Azure service that provides deep, actionable insights into your object storage estate across subscriptions, regions, and resource groups. Its design simplifies data management at scale by offering a unified, no-code experience for analyzing storage usage, activity, configuration, and security posture—all from a single pane of glass in the Azure portal.

With just a few clicks, users can answer critical questions such as:
- How much data do I have across all my storage accounts?
- Which regions or workloads are growing fastest?
- Where can I reduce costs by adjusting access tiers or deleting stale data?
- Are my storage configurations aligned with security and compliance best practices?
!-->

## From insight to action with Azure Storage Discovery

Azure Storage Discovery simplifies the process of uncovering and analyzing insights from thousands of storage accounts, transforming complexity into clarity with just a few clicks. 

### 1. Use the reports

When you deploy Storage Discovery, you get a resource called a *Storage discovery workspace* in one of your resource groups. The [deployment planning](deployment-planning.md) and [workspace creation](create-workspace.md) articles have more details.
Open your workspace, then navigate to the reports. You can adjust your scope to look at a portion of your storage estate, filter whole reports or pivot individual graphs to mine for insights that are relevant and actionable for you. For instance, focus on security or cost relevant insights first.

### 2. Pivot to a list of resources

Every chart in the Discovery reports can be translated into a list of the storage resources that fuel this visualization.
You can navigate from a chart to a browse view.

:::image type="content" source="media/overview/view-resources-small.png" alt-text="A chart tile with the View Resources button highlighted." lightbox="media/overview/view-resources-big.png":::

### 3. Taking action

By browsing resources, you navigate directly to an individual resource for a configuration change. 
Alternatively, you can save the resource list as a *\*.csv* file and use it for bulk operations, like in scripts or terraform.

## Next steps

These articles help plan your Discovery deployment and enable you to successfully create the Discovery workspace resource.

- [Plan a Storage Discovery deployment](deployment-planning.md)
- [Create a Storage Discovery workspace](create-workspace.md)
- [Understand pricing](pricing.md)
