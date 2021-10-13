---
title: Fine-tune your analytics rules in Azure Sentinel
description: Learn how to fine-tune your threat detection rules in Azure Sentinel, using automatically generated recommendations, to reduce false positives while maintaining threat detection coverage.
author: yelevin
ms.author: yelevin
ms.service: azure-sentinel
ms.topic: how-to
ms.date: 10/13/2021

---

# Fine-tune your analytics rules in Azure Sentinel

> [!IMPORTANT]
>
> Detection tuning is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Fine-tuning threat detection rules in your SIEM can be a difficult, delicate, and continuous process of balancing between maximizing your threat detection coverage and minimizing false positive rates. Azure Sentinel simplifies and streamlines this process by using machine learning to analyze billions of signals from your data sources as well as your responses to incidents over time, deducing patterns and providing you with actionable recommendations and insights that can significantly lower your tuning overhead and allow you to focus on detecting and responding to actual threats.

Tuning recommendations and insights are now built in to your analytics rules. This article will explain what these insights show, and how you can implement the recommendations.

## View rule insights

To see if any of your analytics rules have acquired any insights, select **Analytics** from the Azure Sentinel navigation menu.

Any rules that have insights will display a lightbulb icon, as shown here:

:::image type="content" source="media/detection-tuning/rule-list-with-insight.png" alt-text="Screenshot of list of analytics rules with insight indicator." lightbox="media/detection-tuning/rule-list-with-insight.png":::

Edit the rule to view the insights, which will appear on the **Set rule logic** tab of the analytics rule wizard, below the **Results simulation** display.

### Types of insights

The **Tuning insights** display consists of several panes that you can scroll or swipe through, each showing you something different. The time frame - 14 days - for which the insights are displayed is shown at the top of the frame.

1. The first insight pane displays some statistical information - the average number of alerts per incident, the number of open incidents, and the number of closed incidents, grouped by classification (true/false positive). This insight helps you figure out the load on this rule, and understand if any tuning is required - for example, if the grouping settings need to be adjusted.

    This insight is the result of a Log Analytics query. Selecting any of the numbers will take you to the query in Log Analytics that produced the insight.

1. The second insight pane shows you a list of [entities](entities-in-azure-sentinel.md) that are highly correlated with incidents that you closed and classified as **false positive**. Select the plus-sign next to each listed entity to exclude it from the query in future executions of this rule. 

    This insight is produced by Microsoft's advanced data science and machine learning models. This pane's inclusion in the **Tuning insights** display is dependent on there being any results to show.

1. The third insight pane shows the four most frequently-appearing mapped entities across all alerts produced by this rule. (***OR ACROSS ALL ALERTS ACROSS ALL RULES?***) Entity mapping must be configured on the rule for this insight to produce any results.

    This insight is the result of a Log Analytics query. Selecting any of the entities will take you to the query in Log Analytics that produced the insight.



## Next steps

For more information, see:
- [Handle false positives in Azure Sentinel](false-positives.md)
- [Use UEBA data to analyze false positives](investigate-with-ueba.md#use-ueba-data-to-analyze-false-positives)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
