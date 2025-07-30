---
title: Introduction to Azure Storage Discovery | Microsoft Docs
description: Storage Discovery provides insights on storage capacity, transactions, and configurations - providing visibility into their storage estate at entire organization level and aiding business decisions.
author: fauhse

ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 08/01/2025
ms.author: fauhse
---

# What is Azure Storage Discovery?

**Azure Storage Discovery** is a fully managed Azure service that provides deep, actionable insights into your object storage estate across subscriptions, regions, and resource groups. Its design simplifies data management at scale by offering a unified, no-code experience for analyzing storage usage, activity, configuration, and security posture—all from a single pane of glass in the Azure portal.

With just a few clicks, users can answer critical questions such as:
- How much data do I have across all my storage accounts?
- Which regions or workloads are growing fastest?
- Where can I reduce costs by adjusting access tiers or deleting stale data?
- Are my storage configurations aligned with security and compliance best practices?

## How do I use Storage Discovery?
Azure Storage Discovery can be used to gain insights across multiple dimensions. The following use cases illustrate how users frequently leverage the service:

- **Unified Visibility Across the Storage Estate**<br/>
Gain organization-wide visibility into up to 1 million storage accounts. Discovery aggregates insights across subscriptions, resource groups, and regions, enabling users to monitor their entire storage footprint in one place.

- **Actionable Insights Without Engineering Overhead**<br/>
Out-of-the-box dashboards surface trends in capacity, transactions, errors, and configuration changes. Users can drill down into specific accounts or filter by tags, regions, or redundancy settings - without writing a single line of code or deploying infrastructure.

- **AI-Powered Exploration with Copilot**<br/>
Integrated with Azure Copilot, Discovery allows users to ask natural language questions like `"Which storage accounts have the highest egress this month?"` and receive visual, contextual answers powered by Kusto Query Language (KQL) behind the scenes.

- **Security and Compliance Monitoring**<br/>
Visualize and audit storage configurations to ensure alignment with best practices. Identify accounts with settings that don't align with your business needs and take corrective action.

- **Long-Term Trend Analysis**<br/>
Discovery supports long-term planning and workload optimization with up to 30 days<sup>1</sup> of historical data automatically available within hours of deploying Azure Storage Discovery. All insights are retained for up to 18 months

- **Seamless Integration and Scalability**<br/>
Discovery integrates with Azure Storage Center and other data management tools, offering a scalable solution that grows with your data estate.

<sup>1</sup> Storage Discovery will soon support 3 months of historical data through upcoming backfill enhancements for the Standard pricing plan.

## Why do I need Storage Discovery?

As organizations scale their digital footprint, managing storage across thousands of accounts becomes increasingly complex. Azure Storage Discovery eliminates the need for custom scripts, fragmented dashboards, or manual audits. It empowers storage admins, architects, and governance enables you to:

- Make faster, data-driven decisions.
- Improve operational efficiency.
- Strengthen security posture.

## Next steps

These articles will help you plan your Discovery deployment and enable you to successfully create the Discovery workspace resource.

- [Planning for an Azure Storage Discovery deployment](deployment-planning.md)
- [Create Storage Discovery Workspace by using the Azure portal](create-workspace.md)
- [Pricing and billing](pricing.md)