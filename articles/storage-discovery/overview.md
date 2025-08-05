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

**Azure Storage Discovery** is a fully managed service that provides enterprise-wide visibility into your Azure Blob Storage data estate. In a single pane of glass you can understand and analyze how your data estate has evolved over time, optimize costs, enhance security, and drive operational efficiency.

Azure Storage Discovery integrates with Copilot in Azure, enabling you to unlock insights and accelerate decision-making without utilizing any query language.

Whether you're a cloud architect, storage administrator, or data governance lead, Azure Storage Discovery helps you quickly answer key questions about your enterprise data estate in Azure Blob Storage:
- How much data do we store across all our storage accounts?
- Which regions are experiencing the highest growth?
- Can I reduce our costs by finding data that is not being frequently used?
- Are our storage configurations aligned with security and compliance best practices?

:::image type="content" source="media/overview/overview-copilot-small.png" alt-text="Azure portal sowing a Discovery report and copilot chat window." lightbox="media/overview/overview-copilot-big.png":::




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
<!-- 
Render test.
Keep one and remove the others
 -->
:::row:::
    :::column:::
        :::image type="content" source="media/overview/overview-glass-bullet-1.png" alt-text="Bullet point 1.":::
    :::column-end:::
    :::column:::
        Use the Discovery reports or engage Copilot to mine for actionable insights. For instance, focus on security, or cost relevant insights first.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="content" source="media/overview/overview-glass-bullet-2.png" alt-text="Bullet point 2.":::
    :::column-end:::
    :::column:::
        Every chart in the Discovery reports can be translated into a list of the storage resources behind it.
        :::image type="content" source="media/overview/view-resources-small.png" alt-text="A chart tile with the View Resources button highlighted." lightbox="media/overview/view-resources-big.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="content" source="media/overview/overview-glass-bullet-3.png" alt-text="Bullet point 3.":::
    :::column-end:::
    :::column:::
        You can review the list of resources and directly navigate to a resource for a configuration change. Alternatively, you can save the resource list as a *\*.csv* file and use it for bulk operations, like in scripts or terraform.
    :::column-end:::
:::row-end:::

<!-- 
Render test.
Keep one and remove the others
 -->

|                                                                                                          |         |
|----------------------------------------------------------------------------------------------------------|---------|
|:::image type="content" source="media/overview/overview-glass-bullet-1.png" alt-text="Bullet point 1."::: | Use the Discovery reports or engage Azure Copilot to mine for actionable insights. For instance, focus on security, or cost relevant insights first.        |
|:::image type="content" source="media/overview/overview-glass-bullet-2.png" alt-text="Bullet point 2."::: | Every chart in the Discovery reports can be translated into a list of the storage resources behind it.        |
|:::image type="content" source="media/overview/overview-glass-bullet-3.png" alt-text="Bullet point 3."::: |         |

<table>
    <tr>
        <td> :::image type="content" source="media/overview/overview-glass-bullet-1.png" alt-text="Bullet point 1."::: </td>
        <td>Row 1, Column 2</td>
    </tr>
    <tr>
        <td> :::image type="content" source="media/overview/overview-glass-bullet-2.png" alt-text="Bullet point 2."::: </td>
        <td>Every chart in the Discovery reports can be translated into a list of the storage resources behind it.
        :::image type="content" source="media/overview/view-resources-small.png" alt-text="A chart tile with the View Resources button highlighted." lightbox="media/overview/view-resources-big.png"::: </td>
    </tr>
    <tr>
        <td> :::image type="content" source="media/overview/overview-glass-bullet-3.png" alt-text="Bullet point 3."::: </td>
        <td>Row 3, Column 2</td>
    </tr>
</table>
<!-- 
Render test.
Keep one and remove the others
 -->



Use this clarity to mine for actionable insights - then list the storage resources you've identified that can save money, improve security, or optimize your Storage estate across 

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