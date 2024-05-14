---
title: SOC optimization reference (preview)
description: Learn about the SOC optimization recommendations available to help you optimize your security operations.
ms.service: defender-xdr
ms.pagetype: security
ms.author: bagol
author: batamig
manager: raynew
ms.collection:
  - m365-security
  - tier1
  - usx-security
ms.topic: reference
ms.date: 04/30/2024
appliesto:
  - Microsoft Sentinel in the Microsoft Defender portal
  - Microsoft Sentinel in the Azure portal
#customerIntent: As a SOC admin or SOC engineer, I want to learn about the SOC optimization recommendations available to help me optimize my security operations.
---

# SOC optimization reference of recommendations (preview)

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

Microsoft Sentinel SOC optimizations include the following types of recommendations:

- **Threat-based optimizations** recommend adding security controls that help you close coverage gaps.

- **Data value optimizations** recommend ways to improve your data use, such as a better data plan for your organization.

This article provides a reference of the SOC optimization recommendations available.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Data value optimizations

To optimize your cost to security value ratio, SOC optimization surfaces hardly used data connectors or tables, and suggests ways to either reduce the cost of a table or improve its value, depending on your coverage. This type of optimization is also called *data value optimization*.

Data value optimizations only look at billable tables that ingested data in the past 30 days.

The following table lists the available data value SOC optimization recommendations:

|Observation  |Action  |
|---------|---------|
|The table wasn’t used by analytic rules or detections in the last 30 days but was used by other sources, such as workbooks, log queries, hunting queries.     |    Turn on analytics rule templates <br>OR<br>Move to basic logs if the table is eligible    |
|The table wasn’t used at all in the last 30 days     | Turn on analytics rule templates <br>OR<br> Stop data ingestion or archive the table       |
|The table was only used by Azure Monitor     |  Turn on any relevant analytics rule templates for tables with security value <br>OR<br>Move to a nonsecurity Log Analytics workspace       |

If a table is chosen for [UEBA](/azure/sentinel/enable-entity-behavior-analytics) or a [threat intelligence matching analytics rule](/azure/sentinel/use-matching-analytics-to-detect-threats), SOC optimization doesn't recommend any changes in ingestion.

> [!IMPORTANT]
> When making changes to ingestion plans, we recommend always ensuring that the limits of your ingestion plans are clear, and that the affected tables aren't ingested for compliance or other similar reasons.
>
## Threat-based optimization

To optimize data value, SOC optimization recommends adding security controls to your environment in the form of extra detections and data sources, using a threat-based approach.

To provide threat-based recommendations, SOC optimization looks at your ingested logs and enabled analytics rules, and compares it to the logs and detections that are required to protect, detect, and respond to specific types of attacks. This optimization type is also known as *coverage optimization*, and is based on Microsoft's security research.

The following table lists the available threat-based SOC optimization recommendations:

|Observation  |Action  |
|---------|---------|
|There are data sources, but detections are missing.     |   Turn on analytics rule templates based on the threat.      |
|Templates are turned on, but data sources are missing.     |    Connect new data sources.     |
|There are no existing detections or data sources.     |   Connect detections and data sources or install a solution.      |


## Next step

- [Access SOC optimization](soc-optimization-access.md)
