---
title: Optimize security operations (preview)
description: Use SOC optimization recommendations to optimize your security operations center (SOC) team activities.
ms.service: defender-xdr
ms.pagetype: security
ms.author: bagol
author: batamig
manager: raynew
ms.collection:
  - m365-security
  - tier1
  - usx-security
ms.topic: how-to
ms.date: 05/05/2024
appliesto:
  - Microsoft Sentinel in the Microsoft Defender portal
  - Microsoft Sentinel in the Azure portal
#customerIntent: As a SOC admin or SOC engineer, I want to learn about about how to optimize my security operations center with SOC optimization recommendations.
---

# Optimize your security operations (preview)

Security operations center (SOC) teams actively look for opportunities to optimize both processes and outcomes. You want to ensure that you have all the data you need to take action against risks in your environment, while also ensuring that you're not paying to ingest *more* data than you need. At the same time, your teams must regularly adjust security controls as threat landscapes and business priorities change, adjusting quickly and efficiently to keep your return on investments high.

SOC optimization surfaces ways you can optimize your security controls, gaining more value from Microsoft security services as time goes on.

SOC optimizations are high-fidelity and actionable recommendations to help you identify areas where you can reduce costs, without affecting SOC needs or coverage, or where you can add security controls and data where its found to be missing. SOC optimizations are tailored to your environment and based on your current coverage and threat landscape.

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

Watch the following video for an overview and demo of SOC optimization in the Defender portal. If you just want a demo, jump to minute 8:14. <br>

> [!VIDEO https://www.youtube.com/embed/b0rbPZwBuc0?si=DuYJQewK8IZz8T0Y]

## Prerequisites

- SOC optimization uses standard Microsoft Sentinel roles and permissions. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md).

- To use SOC optimization in the Microsoft Defender portal, you must have Microsoft Sentinel integrated with Microsoft Defender XDR. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard).

## Access the SOC optimization page

Use one of the following tabs, depending on whether you're working in the unified SOC operations platform or in the Azure portal:

### [Azure portal](#tab/azure-portal)

In Microsoft Sentinel in the Azure portal, under **Threat management**, select **SOC optimization**.

:::image type="content" source="media/soc-optimization-access/soc-optimization-azure.png" alt-text="Screenshot of the SOC optimization page in the Azure portal.":::

### [Defender portal](#tab/defender-portal)

In the unified SOC operations platform in the Microsoft Defender portal, select **SOC optimization**.

:::image type="content" source="media/soc-optimization-access/soc-optimization-xdr.png" alt-text="Screenshot of the SOC optimization page in Microsoft Defender XDR." lightbox="media/soc-optimization-access/soc-optimization-xdr.png":::

---

## Understand SOC optimization overview metrics

Optimization metrics shown at the top of the **Overview** tab give you a high level understanding of how efficiently you're using your data, and will change over time as you implement recommendations.

Supported metrics at the top of the **Overview** tab include:

### [Azure portal](#tab/azure-portal)

|Title  |Description |
|---------|---------|
| **Ingested data over the last 3 months** | Shows the total data ingested in your workspace over the last three months. |
|**Optimizations status**    | Shows the number of recommended optimizations that are currently active, completed, and dismissed.        |

Select **See all threat scenarios** to view the full list of relevant threats, active and recommended detections, and coverage levels.

### [Defender portal](#tab/defender-portal)

|Title  | Description |
|---------|---------|
|**Recent optimization value**    | Shows value gained based on recommendations you recently implemented |
|**Ingested data**     | Shows the total data ingested in your workspace over the last 90 days. |
|**Threat-based coverage optimizations**     |   Shows coverage levels for relevant threats. <br>Coverage levels are based on the number of analytics rules found in your workspace, compared with the number of rules recommended by the Microsoft research team. <br><br>Supported coverage levels include:<br>- **Best**: 	90% to 100% of recommended rules are found<br>- **Better**: 60% to 89% of recommended rules were created<br>- **Good**: 40% to 59% of recommended rules were created<br>- **Moderate**: 20% to 39% of recommended rules were created<br>- **None**: 0% to 19% of recommended rules were created<br><br>Select **View all threat scenarios** to view the full list of relevant threats, active and recommended detections, and coverage levels.    |
|**Optimization status**     | Shows the number of recommended optimizations that are currently active, completed, and dismissed.        |

---

## View and manage optimization recommendations

### [Azure portal](#tab/azure-portal)

In the Azure portal, SOC optimization recommendations are listed on the **SOC optimization > Overview** tab. 

For example:

:::image type="content" source="media/soc-optimization-access/soc-optimization-overview-azure.png" alt-text="Screenshot of the SOC optimization Overview tab in the Azure portal." lightbox="media/soc-optimization-access/soc-optimization-overview-azure.png":::


### [Defender portal](#tab/defender-portal)

In the Defender portal, SOC optimization recommendations are listed in the **Your Optimizations** area on the **SOC optimizations** tab. 

:::image type="content" source="media/soc-optimization-access/soc-optimization-overview-defender.png" alt-text="Screenshot of the SOC optimization Overview tab in the Defender portal." lightbox="media/soc-optimization-access/soc-optimization-overview-defender.png":::

---

Each optimization card includes the status, title, the date it was created, a high-level description, and the workspace it applies to.

### Filter optimizations

Filter the optimizations based on optimization type, or search for a specific optimization title using the search box on the side. Optimization types include:

- **Coverage**: Includes threat-based recommendations for adding security controls to help close coverage gaps for various types of attacks.

- **Data value**: Includes recommendations that suggest ways to improve your data usage for maximizing security value from ingested data, or suggest a better data plan for your organization.

### View optimization details and take action

In each optimization card, select **View full details** to see a full description of the observation that led to the recommendation, and the value you see in your environment when that recommendation is implemented.

Scroll down to the bottom of the details pane for a link to where you can take the recommended actions. For example:

- If an optimization includes recommendations to add analytics rules, select **Go to Content Hub**.
- If an optimization includes recommendations to move a table to basic logs, select **Change plan**.

If you choose to install an analytics rule template from the Content Hub, and you don't already have the solution installed, only the analytics rule template that you install is shown in the solution when you're done. Install the full solution to see all available content items from the selected solution. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

### Manage optimizations

By default, optimization statuses are **Active**. Change their statuses as your teams progress through triaging and implementing recommendations. 

Either select the options menu or select **View full details** to take one of the following actions:

|Action |Description  |
|---------|---------|
|**Complete**     | Complete an optimization when you completed each recommended action. <br><br>If a change in your environment is detected that makes the recommendation irrelevant, the optimization is automatically completed and moved to the **Completed** tab. <br><br>For example, you might have an optimization related to a previously unused table. If your table is now used in a new analytics rule, the optimization recommendation is now irrelevant. <br><br>In such cases, a banner shows in the **Overview** tab with the number of automatically completed optimizations since your last visit.        |
| **Mark as in progress** / **Mark as active**| Mark an optimization as in progress or active to notify other team members that you're actively working on it. <br><br>Use these two statuses flexibly, but consistently, as needed for your organization. |
|**Dismiss**     |  Dismiss an optimization if you're not planning to take the recommended action and no longer want to see it in the list.       |
|**Provide feedback**     | We invite you to share your thoughts on the recommended actions with the Microsoft team! <br><br>When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).      |

## View completed and dismissed optimizations

If you marked a specific optimization as *Completed* or *Dismissed*, or if an optimization was automatically completed, it's listed on the **Completed** and **Dismissed** tabs, respectively.

From here, either select the options menu or select **View full details** to take one of the following actions:

- **Reactivate the optimization**, sending it back to the **Overview** tab. Reactivated optimizations are recalculated to provide the most updated value and action. Recalculating these details can take up to an hour, so wait before checking the details and recommended actions again.

  Reactivated optimizations might also move directly to the **Completed** tab if, after recalculating the details, they're found to be no longer relevant.

- **Provide further feedback** to the Microsoft team. When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).

## Use optimizations via API

The `Recommendations` operation group provides access to SOC optimizations via the Azure REST API. For example, use the API to get details about a specific recommendations, or all current recommendations across your workspaces, or to reevaluate a recommendation if you've made changes.

While SOC optimizations are in preview, API documentation is available only in the Swagger specification, and not in the REST API reference. For more information, see [API versions of Microsoft Sentinel REST APIs](/rest/api/securityinsights/api-versions).

## SOC optimization usage flow

This section provides a sample flow for using SOC optimizations, from either the Defender or Azure portal:

1. On the **SOC optimization** page, start by understanding the dashboard:

      - Observe the top metrics for overall optimization status.
      - Review optimization recommendations for data value and threat-based coverage.

1. Use the optimization recommendations to identify tables with low usage, indicating that they're not being used for detections. Select **View full details** to see the size and cost of unused data. Consider one of the following actions:

      - Add analytics rules to use the table for enhanced protection. To use this option, select **Go to the Content Hub** to view and configure specific out-of-the-box analytic rule templates that use the selected table. In the Content hub, you don't need to search for the relevant rule, as you're taken directly to the relevant rule.

        If new analytic rules require additional log sources, consider ingesting them to improve threat coverage.

        For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md) and [Detect threats out-of-the-box](../detect-threats-built-in.md).

      - Change your commitment  tier for cost savings. For more information, see [Reduce costs for Microsoft Sentinel](../billing-reduce-costs.md).

1. Use the optimization recommendations to improve coverage against specific threats. For example, for a human-operated ransomware optimization:

      1. Select **View full details** to see the current coverage and suggested improvements.

      1. Select **View all MITRE ATT&CK technique improvement** to drill down and analyze the relevant tactics and techniques, helping you understand the coverage gap.

      1. Select **Go to Content hub** to view all recommended security content, filtered specifically for this optimization.

1. After configuring new rules or making changes, mark the recommendation as completed or let the system update automatically.

## Related content

- [SOC optimization reference of recommendations (preview)](soc-optimization-reference.md)
