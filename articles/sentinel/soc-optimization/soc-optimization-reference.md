---
title: SOC optimization reference
description: Learn about the Microsoft Sentinel SOC optimization recommendations available to help you optimize your security operations.
ms.author: bagol
author: batamig
manager: raynew
ms.collection:
  - usx-security
ms.topic: reference
ms.date: 12/18/2024
appliesto:
  - Microsoft Sentinel in the Microsoft Defender portal
  - Microsoft Sentinel in the Azure portal


#Customer intent: As a SOC manager, I want to implement SOC optimization recommendations so that I can close coverage gaps and improve data usage efficiency without manual analysis.

---

# SOC optimization reference of recommendations

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

Microsoft Sentinel SOC optimizations include the following types of recommendations:

- **Threat-based recommendations** suggest adding security controls that help you close coverage gaps.

- **Data value recommendations** suggest ways to improve your data use, such as a better data plan for your organization.

- **Similar organizations recommendations** suggest ingesting data from the types of sources used by organizations which have similar ingestion trends and industry profiles to yours.

This article provides a reference of the SOC optimization recommendations available.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Data value optimization recommendations

To optimize your cost/security value ratio, SOC optimization surfaces hardly used data connectors or tables, and suggests ways to either reduce the cost of a table or improve its value, depending on your coverage. This type of optimization is also called *data value optimization*.

Data value optimizations only look at billable tables that ingested data in the past 30 days.

The following table lists the available data value SOC optimization recommendations:

| Observation | Action |
|---------|---------|
| The table wasn’t used by analytics rules or detections in the last 30 days but was used by other sources, such as workbooks, log queries, hunting queries.     | Turn on analytics rule templates <br>OR<br>Move to [auxiliary logs (Preview) or basic logs](../billing.md#auxiliary-logs-and-basic-logs) if the table is eligible.   |
| The table wasn’t used at all in the last 30 days.     | Turn on analytics rule templates <br>OR<br> Stop data ingestion and remove the table or move the table to long term retention.       |
| The table was only used by Azure Monitor.     | Turn on any relevant analytics rule templates for tables with security value <br>OR<br>Move to a non-security Log Analytics workspace.       |

If a table is chosen for [UEBA](/azure/sentinel/enable-entity-behavior-analytics) or a [threat intelligence matching analytics rule](/azure/sentinel/use-matching-analytics-to-detect-threats), SOC optimization doesn't recommend any changes in ingestion.

> [!IMPORTANT]
> When making changes to ingestion plans, we recommend always ensuring that the limits of your ingestion plans are clear, and that the affected tables aren't ingested for compliance or other similar reasons.
>
## Threat-based optimization recommendations

To optimize data value, SOC optimization recommends adding security controls to your environment in the form of extra detections and data sources, using a threat-based approach. This optimization type is also known as *coverage optimization*, and is based on Microsoft's security research.

To provide threat-based recommendations, SOC optimization looks at your ingested logs and enabled analytics rules, and compares them to the logs and detections that are required to protect, detect, and respond to specific types of attacks.

Threat-based optimizations consider both predefined and user-defined detections.

The following table lists the available threat-based SOC optimization recommendations:

| Observation | Action |
|---------|---------|
| There are data sources, but detections are missing.     | Turn on analytics rule templates based on the threat: Create a rule using an analytics rule template, and adjust the name, description, and query logic to suit your environment. <br><br>For more information, see [Threat detection in Microsoft Sentinel](../threat-detection.md). |
| Templates are turned on, but data sources are missing.     | Connect new data sources.     |
| There are no existing detections or data sources.     | Connect detections and data sources or install a solution.      |

## Similar organizations recommendations

SOC optimization uses advanced machine learning to identify tables that are missing from your workspace, but are used by organizations with similar ingestion trends and industry profiles to yours. It shows how other organizations use these tables and recommends to you the relevant data sources, along with related rules, to improve your security coverage.

| Observation | Action |
|---------|---------|
| Log sources ingested by similar customers are missing   | Connect the suggested data sources. <br><br>This recommendation doesn't include: <ul><li>Custom connectors<li>Custom tables<li>Tables that are ingested by fewer than 10 workspaces <li>Tables that contain multiple log sources, like the `Syslog` or `CommonSecurityLog` tables   |

### Considerations

- Not all workspaces get similar organizations recommendations. A workspace receives these recommendations only if our machine learning model identifies significant similarities with other organizations and discovers tables that they have but you don't. SOCs in their early or onboarding stages are generally more likely to receive these recommendations than SOCs with a higher level of maturity.

- Recommendations are based on machine learning models that rely solely on Organizational Identifiable Information (OII) and system metadata. The models never access or analyze the content of customer logs or ingest them at any point. No customer data, content, or End User Identifiable Information (EUII) is exposed to the analysis.

## Related content

- [Using SOC optimizations programmatically (Preview)](soc-optimization-api.md)
- [Blog: SOC optimization: unlock the power of precision-driven security management](https://aka.ms/SOC_Optimization)

## Next step

- [Access SOC optimization](soc-optimization-access.md)
