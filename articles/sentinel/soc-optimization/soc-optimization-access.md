---
title: Optimize security operations (Preview)
description: Use SOC optimization recommendations with Microsoft Defender XDR and Microsoft Sentinel to optimize your security operations center (SOC) team activities.
ms.service: microsoft-sentinel
ms.author: bagol
author: batamig
ms.collection:
  - usx-security
ms.topic: how-to
ms.date: 03/05/2024
appliesto: Microsoft Sentinel in both the Azure and Microsoft Defender portals
#customerIntent: As a SOC admin or SOC engineer, I want to learn about about how to optimize my security operations center with SOC optimization recommendations.
---

# Optimize your security operations with Microsoft Defender XDR (Preview)

Security operations center (SOC) teams actively look for opportunities to optimize both processes and outcomes. You want to ensure that you have all the data you need to take action against risks in your environment, while also ensuring that you're not paying to ingest *more* data than you need. At the same time, your teams must regularly adjust security controls as threat landscapes and business priorities change, adjusting quickly and efficiently to keep your return on investments high. SOC optimization surfaces ways you can optimize your security controls, gaining more and more value from Microsoft security services as time goes on.

SOC optimizations are high-fidelity and actionable recommendations to help you identify areas where you can reduce costs, without affecting SOC needs or coverage, or where you can add security controls and data where its found to be missing. SOC optimizations are tailored to your environment and based on your current coverage and threat landscape.
SOC optimizations are high-fidelity and actionable recommendations to help you identify areas where you can reduce costs, without affecting SOC needs or coverage, or where you can add security controls and data where its found to be missing. SOC optimizations are tailored to your environment and based on your current coverage and threat landscape.

Use SOC optimization recommendations to help you close coverage gaps against specific threats and tighten your ingestion rates against data that doesn't provide security value. SOC optimizations help you optimize your Microsoft Sentinel workspace, without having your SOC teams spend time on manual analysis and research.

> [!NOTE]
> SOC optimization is available for Microsoft Sentinel customers, with Microsoft Sentinel integrated into Microsoft Defender XDR. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR (preview)](/microsoft-365/security/defender/microsoft-sentinel-onboard).
>

## Prerequisites

To access SOC optimization in the Microsoft Defender portal, you must be a Microsoft Sentinel customer, with Microsoft Sentinel integrated into Microsoft Defender XDR.

For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR (preview)](/microsoft-365/security/defender/microsoft-sentinel-onboard).

<!--roles?-->

## Access the SOC optimization page

In the Microsoft Defender portal, select **SOC optimization** from the left-side navigation menu. For example:

:::image type="content" source="media/soc-optimization-access/soc-optimization-xdr.png" alt-text="Screenshot of the SOC optimization page in Microsoft Defender XDR.":::

## Understand SOC optimization overview metrics

Optimization metrics shown at the top of the **Overview** tab differ, depending on how efficiently you are using your data. For example, customers with few recommendations to implement will see fewer metrics.

Supported metrics at the top of the **Overview** tab include:

|Title  |Description |
|---------|---------|
|**Recent optimization value**    | Shows value gained based on recommendations you recently implemented        |
|**Ingested data**     | Shows the total data ingested in your workspace over the last 90 days.        |
|**Threat-based coverage optimizations**     |   Shows coverage levels for relevant threats. <br>Coverage levels are based on the number of analytics rules found in your workspace, compared with the number of rules recommended by the Microsoft research team. <br><br>Supported coverage levels include:<br>- **Best**: 	90% to 100% of recommended rules are found<br>- **Better**: 60% to 89% of recommended rules were created<br>- **Good**: 40% to 59% of recommended rules were created<br>- **Moderate**: 20% to 39% of recommended rules were created<br>- **None**: 0% to 19% of recommended rules were created<br><br>Select **View all use cases** to view the full list of relevant threats, active and recommended detections, and coverage levels.    |
|**Optimization status**     | Shows the number of recommended optimizations that are currently active, completed, and dismissed.        |

## View and manage optimization recommendations

Optimization recommendations are listed in the **Your Optimizations** area on the **SOC optimizations** tab. Each optimization card includes the status, title, the date it was created, a high-level description, and the workspace it applies to.
Optimization recommendations are listed in the **Your Optimizations** area on the **SOC optimizations** tab. Each optimization card includes the status, title, the date it was created, a high-level description, and the workspace it applies to.

### Filter optimizations

Filter the optimizations based on optimization type, or search for a specific optimization title using the search box on the right. Optimization types include:
Filter the optimizations based on optimization type, or search for a specific optimization title using the search box on the right. Optimization types include:

- **Coverage**: Includes threat-based recommendations for adding security controls to help close coverage gaps for various types of attacks for various types of attacks.

- **Data value**: Include cost-based optimizations that suggest ways to improve your data usage for maximizing security value from ingested data, for maximizing security value from ingested data, or suggest suggest a better data plan for your organization.

### View optimization details and take action

In each optimization card, select **View full details** to see a full description of the observation that led to the recommendation, and the value you'll see in your environment when that recommendation is implemented.

Scroll down to the bottom of the details pane for a link to where you can take the recommended actions. For example, if an optimization includes recommendations to add analytics rules, select **Got to Content Hub**.

### Manage optimizations

Manage your optimizations by selecting one of the following actions:

|Action |Description  |
|---------|---------|
|**Complete**     | Complete an optimization when you've completed each recommended action. <br><br>If a change in your environment is detected that makes the recommendation irrelevant, the optimization is automatically completed and moved to the **Completed** tab. <br><br>For example, you might have an optimization related to a previously unused table. If your table is now used in a new analytics rule, the optimization recommendation is now irrelevant. <br><br>In such cases, a banner shows in the **Overview** tab with the number of automatically completed optimizations since your last visit.        |
|**Dismiss**     |  Dismiss an optimization if you're not planning to take the recommended action and no longer want to see it in the list.       |
|**Provide feedback***     | We invite you to share your thoughts on the recommended actions with the Microsoft team! <br><br>When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).      |

<!--find a better phrasing for feedback-->

Select an action either from the options menu at the top right of each optimization card, or after selecting **View full details**, from the optimization details pane.

## View completed and dismissed optimizations

If you've marked a specific optimization as *Completed* or *Dismissed*, or if an optimization was automatically completed, it's listed on the **Completed** and **Dismissed** tabs, respectively.

From here, either select the options menu or select **View full details** to take one of the following actions:

- **Reactivate the optimization**, sending it back to the **Overview** tab. Reactivated optimizations are recalculated to provide the most updated value and action. Recalculating these details can take up to an hour, so wait before checking the details and recommended actions again. <!--update this when we see the new button-->

    Reactivated optimizations might also move directly to the **Completed** tab if, after recalculating the details, they're found to be no longer relevant.

- **Provide further feedback** to the Microsoft team. When sharing your feedback, be careful not to share any confidential data. For more information, see  [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement). 

<!--find a better phrasing for feedback-->


## Related content

[SOC optimization reference of recommendations (Preview)](soc-optimization-reference.md)
