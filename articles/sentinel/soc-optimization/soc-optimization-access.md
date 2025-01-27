---
title: Optimize security operations
description: Use Microsoft Sentinel SOC optimization recommendations to optimize your security operations center (SOC) team activities.
ms.author: bagol
author: batamig
manager: raynew
ms.collection:
  - usx-security
ms.topic: how-to
ms.date: 10/16/2024
appliesto:
  - Microsoft Sentinel in the Microsoft Defender portal
  - Microsoft Sentinel in the Azure portal


#Customer intent: As a SOC analyst, I want to optimize security controls and data ingestion so that I can enhance threat detection and reduce costs without compromising coverage.

---

# Optimize your security operations

Security operations center (SOC) teams look for ways to improve processes and outcomes and ensure you have the data needed to address risks without extra ingestion costs. SOC teams want to make sure that you have all the necessary data to act against risks, without paying for *more* data than needed. At the same time, SOC teams must also adjust security controls as threats and business priorities change, doing so quickly and efficiently to maximize your return on investment.

SOC optimizations are actionable recommendations that surface ways that you can optimize your security controls, gaining more value from Microsoft security services as time goes on.  Recommendations help you reduce costs without affecting SOC needs or coverage, and can help you add security controls and data where needed. These optimizations are tailored to your environment and based on your current coverage and threat landscape.

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

Watch the following video for an overview and demo of SOC optimization in the Microsoft Defender portal. If you just want a demo, jump to minute 8:14. <br><br>

> [!VIDEO https://www.youtube.com/embed/b0rbPZwBuc0?si=DuYJQewK8IZz8T0Y]

## Prerequisites

- SOC optimization uses standard Microsoft Sentinel roles and permissions. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md).

- To use SOC optimization in the Defender portal, onboard Microsoft Sentinel to the Defender portal. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-sentinel-onboard).

## Access the SOC optimization page

Use one of the following tabs, depending on whether you're working in the Azure portal or Defender portal. When your workspace is onboarded for unified security operations, SOC optimizations include coverage from across Microsoft security services.


### [Azure portal](#tab/azure-portal)

In Microsoft Sentinel in the Azure portal, under **Threat management**, select **SOC optimization**.

:::image type="content" source="media/soc-optimization-access/soc-optimization-azure.png" alt-text="Screenshot of the SOC optimization page in the Azure portal.":::

### [Defender portal](#tab/defender-portal)

In the Defender portal, select **SOC optimization**.

:::image type="content" source="media/soc-optimization-access/soc-optimization-xdr.png" alt-text="Screenshot of the SOC optimization page in the Defender portal." lightbox="media/soc-optimization-access/soc-optimization-xdr.png":::

---

## Understand SOC optimization overview metrics

Optimization metrics shown at the top of the **Overview** tab give you a high level understanding of how efficiently you're using your data, and will change over time as you implement recommendations.

Supported metrics at the top of the **Overview** tab include:

### [Azure portal](#tab/azure-portal)

|Title  |Description |
|---------|---------|
| **Ingested data over the last 3 months** | Shows the total data ingested in your workspace over the last three months. |
|**Optimizations status**    | Shows the number of recommended optimizations that are currently active, completed, and dismissed.        |

Select **See all threat scenarios** to view the full list of relevant threats, percentages of active and recommended analytics rules, and coverage levels.

### [Defender portal](#tab/defender-portal)

|Title  | Description |
|---------|---------|
|**Recent optimization value**    | Shows value gained based on recommendations you recently implemented |
|**Data ingested**     | Shows the total data ingested in your workspace over the last 90 days. |
|**Threat-based coverage optimizations**     |  Shows one of the following coverage indicators, based on the number of analytics rules found in your workspace, compared with the number of rules recommended by the Microsoft research team: <br>- **High**: Over 75% of recommended rules are activated <br>- **Medium**: 30%-74% of recommended rules are activated <br>- **Low**: 0%-29% of recommended rules are activated. <br><br>Select **View all threat scenarios** to view the full list of relevant threats, active and recommended detections, and coverage levels. Then, select a threat scenario to drill down for more details about the recommendation on a separate, threat scenario details page. |
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

SOC optimization recommendations are calculated every 24 hours. Each optimization card includes the status, title, the date it was created, a high-level description, and the workspace it applies to.

### Filter optimizations

Filter the optimizations based on optimization type, or search for a specific optimization title using the search box on the side. Optimization types include:

- **Coverage**: Includes threat-based recommendations for adding security controls to help close coverage gaps for various types of attacks.

- **Data value**: Includes recommendations that suggest ways to improve your data usage for maximizing security value from ingested data, or suggest a better data plan for your organization.

### View optimization details and take action

Select one of the following tabs, depending on the portal you're using:

### [Azure portal](#tab/azure-portal)

In each optimization card, select **View details** to see a full description of the observation that led to the recommendation, and the value you see in your environment when that recommendation is implemented.

Scroll down to the bottom of the details pane for a link to where you can take the recommended actions. For example:

- If an optimization includes recommendations to add analytics rules, select **Go to Content Hub**.
- If an optimization includes recommendations to move a table to basic logs, select **Change plan**.

### [Defender portal](#tab/defender-portal)

1. In each optimization card, select **View details** to see a full description of the observation that led to the recommendation, and the value you see in your environment when that recommendation is implemented.

1. For threat-based coverage optimizations:

    - Toggle between the spider charts to understand your coverage across different tactics and techniques, based on the user-defined and out-of-the-box detections active in your environment.
    - Select **View threat scenario in MITRE ATT&CK** to jump to the [**MITRE ATT&CK** page in Microsoft Sentinel](../mitre-coverage.md?tabs=defender-portal), prefiltered for your threat scenario. For more information, see [Understand security coverage by the MITRE ATT&CK® framework].

1. Scroll down to the bottom of the details pane for a link to where you can take the recommended actions. For example:

- If an optimization includes recommendations to add analytics rules, select **Go to Content Hub**.
- If an optimization includes recommendations to move a table to basic logs, select **Change plan**.
- For threat-based coverage optimizations, select **View full threat scenario** to see the full list of relevant threats, active and recommended detections, and coverage levels. From there you can jump directly to the **Content hub** to activate any recommended detections, or to the **MITRE ATT&CK** page to view the [full MITRE ATT&CK coverage for the selected scenario](../mitre-coverage.md?tabs=defender-portal#view-current-mitre-coverage). For example:

    :::image type="content" source="media/soc-optimization-access/threat-scenario-page.png" alt-text="Screenshot of the SOC optimization threat scenario page." lightbox="media/soc-optimization-access/threat-scenario-page.png":::

---

If you install an analytics rule template from the Content hub without the solution installed, only the installed template appears in the solution.

Install the full solution to see all available content items from the selected solution. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md).

### Manage optimizations

By default, optimization statuses are **Active**. Change their statuses as your teams progress through triaging and implementing recommendations. 

Either select the options menu or select **View details** to take one of the following actions:

|Action |Description  |
|---------|---------|
|**Complete**     | Complete an optimization when you completed each recommended action. <br><br>If a change in your environment is detected that makes the recommendation irrelevant, the optimization is automatically completed and moved to the **Completed** tab. <br><br>For example, you might have an optimization related to a previously unused table. If your table is now used in a new analytics rule, the optimization recommendation is now irrelevant. <br><br>In such cases, a banner shows in the **Overview** tab with the number of automatically completed optimizations since your last visit.        |
| **Mark as in progress** / **Mark as active**| Mark an optimization as in progress or active to notify other team members that you're actively working on it. <br><br>Use these two statuses flexibly, but consistently, as needed for your organization. |
|**Dismiss**     |  Dismiss an optimization if you're not planning to take the recommended action and no longer want to see it in the list.       |
|**Provide feedback**     | We invite you to share your thoughts on the recommended actions with the Microsoft team! <br><br>When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).      |

## View completed and dismissed optimizations

If you marked a specific optimization as *Completed* or *Dismissed*, or if an optimization is automatically completed, it's listed on the **Completed** and **Dismissed** tabs, respectively.

From here, either select the options menu or select **View full details** to take one of the following actions:

- **Reactivate the optimization**, sending it back to the **Overview** tab. Reactivated optimizations are recalculated to provide the most updated value and action. Recalculating these details can take up to an hour, so wait before checking the details and recommended actions again.

  Reactivated optimizations might also move directly to the **Completed** tab if, after recalculating the details, they're found to be no longer relevant.

- **Provide further feedback** to the Microsoft team. When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).

## SOC optimization usage flow

This section provides a sample flow for using SOC optimizations, from either the Defender or Azure portal:

1. On the **SOC optimization** page, start by understanding the dashboard:

      - Observe the top metrics for overall optimization status.
      - Review optimization recommendations for data value and threat-based coverage.

1. Use the optimization recommendations to identify tables with low usage, indicating that they're not being used for detections. Select **View full details** to see the size and cost of unused data. Consider one of the following actions:

      - Add analytics rules to use the table for enhanced protection. To use this option, select **Go to the Content Hub** to view and configure specific out-of-the-box analytic rule templates that use the selected table. In the Content hub, you don't need to search for the relevant rule, as you're taken directly to the relevant rule.

        If new analytic rules require extra log sources, consider ingesting them to improve threat coverage.

        For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md) and [Detect threats out-of-the-box](../detect-threats-built-in.md).

      - Change your commitment  tier for cost savings. For more information, see [Reduce costs for Microsoft Sentinel](../billing-reduce-costs.md).

1. Use the optimization recommendations to improve coverage against specific threats. For example, for a human-operated ransomware optimization:

      1. Select **View full details** to see the current coverage and suggested improvements.

      1. Select **View all MITRE ATT&CK technique improvement** to drill down and analyze the relevant tactics and techniques, helping you understand the coverage gap.

      1. Select **Go to Content hub** to view all recommended security content, filtered specifically for this optimization.

1. After configuring new rules or making changes, mark the recommendation as completed or let the system update automatically.

## Related content

- [SOC optimization reference of recommendations](soc-optimization-reference.md)
- [Use SOC optimizations programmatically](soc-optimization-api.md)
- [Blog: SOC optimization: unlock the power of precision-driven security management](https://aka.ms/SOC_Optimization)
