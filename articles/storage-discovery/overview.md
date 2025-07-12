---
title: Introduction to Azure Storage Discovery | Microsoft Docs
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into their storage estate at entire organization level and aiding business decisions.
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 08/01/2025
ms.author: shaas
---

# What is Azure Storage Discovery?

**Azure Storage Discovery** is a fully managed Azure service that provides deep, actionable insights into your object storage estate across subscriptions, regions, and resource groups. It is designed to simplify data management at scale by offering a unified, no-code experience for analyzing storage usage, activity, configuration, and security posture—all from a single pane of glass in the Azure portal.

With just a few clicks, users can answer critical questions such as:
- How much data do I have across all my storage accounts?
- Which regions or workloads are growing fastest?
- Where can I reduce costs by adjusting access tiers or deleting stale data?
- Are my storage configurations aligned with security and compliance best practices?

## Value proposition
Azure Storage Discovery delivers value across multiple dimensions:

### Unified Visibility Across the Storage Estate
Gain organization-wide visibility into up to 1 million storage accounts. Discovery aggregates insights across subscriptions, resource groups, and regions, enabling users to monitor their entire storage footprint in one place.

### Actionable Insights Without Engineering Overhead
Out-of-the-box dashboards surface trends in capacity, transactions, errors, and configuration changes. Users can drill down into specific accounts or filter by tags, regions, or redundancy settings - without writing a single line of code or deploying infrastructure.

### AI-Powered Exploration with Copilot
Integrated with Azure Copilot, Discovery allows users to ask natural language questions like “Which storage accounts have the highest egress this month?” and receive visual, contextual answers powered by KQL behind the scenes.

### Security and Compliance Monitoring
Visualize and audit storage configurations to ensure alignment with best practices. Identify accounts with settings that do not align with your business needs and take corrective action.

### Long-Term Trend Analysis
With up to 30 days<sup>1</sup> of historical data and automatic backfill of the previous month, Discovery supports long-term planning and workload optimization.

### Seamless Integration and Scalability
Discovery integrates with Azure Storage Center and other data management tools, offering a scalable solution that grows with your data estate.

<sup>1</sup> Storage Discovery will soon support 6 months of historical data through upcoming backfill enhancements for Standard pricing plan.

## Why It Matters

As organizations scale their digital footprint, managing storage across thousands of accounts becomes increasingly complex. Azure Storage Discovery eliminates the need for custom scripts, fragmented dashboards, or manual audits. It empowers storage admins, architects, and governance leads to:
- Make faster, data-driven decisions
- Improve operational efficiency
- Strengthen security posture

## Next steps

These articles will help you plan your Discovery deployment and enable you to successfully create the Discovery workspace resource.

- [Planning for an Azure Storage Discovery deployment](deploy-planning.md)
- [Create Storage Discovery Workspace by using the Azure portal](create-workspace.md)
- [Pricing and billing](pricing.md)