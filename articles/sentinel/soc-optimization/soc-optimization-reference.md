---
title: SOC optimization reference
description: Learn about the SOC optimization recommendations available in the Microsoft Defender portal with Microsoft Sentinel.
ms.service: microsoft-sentinel
ms.author: bagol
author: batamig
ms.collection:
  - usx-security
ms.topic: reference
ms.date: 03/05/2024
appliesto: Microsoft Sentinel in both the Azure and Microsoft Defender portals
#customer intent: As a SOC admin, I want to learn about the SOC optimization recommendations available to me in the Microsoft Defender portal with Microsoft Sentinel.
---

# SOC optimization reference of recommendations (Preview)

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

Microsoft Sentinel SOC optimizations in the Microsoft Defender portal include the following types of recommendations:

- **Threat-based optimization recommendations** suggest adding security controls that help you close coverage gaps.

- **Cost-based optimization recommendations** suggest ways to improve your data use, such as a better data plan for your organization.

This article provides a reference of the SOC optimization recommendations available.

> [!NOTE]
> SOC optimization is available for Microsoft Sentinel customers, with Microsoft Sentinel integrated into Microsoft Defender XDR. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR (preview)](microsoft-sentinel-onboard.md).
>

## Cost-based optimizations

To optimize your costs, SOC optimization surfaces hardly-used data connectors or tables, and suggests ways to either reduce the cost of a table or improve its value, depending on your coverage. This type of optimization is also called *data value optimization*.

SOC optimization <!--is this general or only for cost-based optimizations?--> only looks at data from billable tables that ingested data in the past 30 days.

The following table lists the available cost-based SOC optimization recommendations:

|Observation  |Action  |
|---------|---------|
|The table wasn’t used by analytic rules or detections in the last 30 days but was used by other sources, such as workbooks, log queries, hunting queries.     |    Turn on analytics rule templates <br>OR<br>Move to basic logs if you're eligible    |
|The table wasn’t used at all in the last 30 days     | Turn on analytics rule templates <br>OR<br> Stop data ingestion or archive the table       |
|The table was only used by Azure Monitor     |  Turn on any relevant analytics rule templates for tables with security value <br>OR<br>Move to a non-security Log Analytics workspace       |

If a table is chosen for [UEBA](/azure/sentinel/enable-entity-behavior-analytics) or a [threat intelligence matching analytics rule](/azure/sentinel/use-matching-analytics-to-detect-threats), SOC optimization doesn't recommend any changes in ingestion.

> [!IMPORTANT]
> When making changes to ingestion plans, we recommend always ensuring that the limits of your ingestion plans are clear, and that the affected tables aren't ingested for compliance or other similar reasons.
>
## Threat-based optimization

To optimize data value, SOC optimization recommends adding security controls to your environment in the form of extra detections and data sources, using a threat-based approach.

To provide threat-based recommendations, SOC optimization looks at the first- and third-party coverage, and compares it to specific use cases based on Microsoft's security research. This optimization type is also known as *coverage optimization*.

The following table lists the available threat-based SOC optimization recommendations:

|Observation  |Action  |
|---------|---------|
|There are data sources, but detections are missing.     |   Turn on analytics rule templates based on the threat.      |
|Templates are turned on, but data sources are missing.     |    Connect new data sources.     |
|There are no existing detections or data sources.     |   Connect detections and data sources or install a solution.      |

## Next step

[Access SOC optimization](soc-optimization-access.md)