---
title: Monitor and troubleshoot the execution of your Microsoft Sentinel scheduled analytics rules
description: Use the SentinelHealth data table to keep track of your scheduled analytics rules' execution and performance.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 06/19/2023
---

# Monitor and troubleshoot the execution of your scheduled analytics rules

To ensure that Microsoft Sentinel's threat detection provides complete coverage in your environment, take advantage of its execution management tools. These tools use Microsoft Sentinel's [health and audit data](monitor-analytics-rule-integrity.md) to show you insights on your [scheduled analytics rules'](detect-threats-built-in.md#scheduled) execution, and they also allow you to rerun failed attempts on specific execution windows for testing or troubleshooting purposes.

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Summary

There are two execution management tools for scheduled analytics rules: built-in scheduled rule insights and the capability to rerun scheduled rules on-demand.

On the **Analytics** page, the **Insights** panel displays as another tab in the details pane, alongside the **Info** tab. The **Insights** panel provides information about a rule's activity and results. For example: failed executions, top health issues, alert count over time, and closing classifications of incidents created by the rule. These insights help your security analysts identify potential issues or misconfigurations with analytics rules, and allow them to troubleshoot rule failures and optimize rule configurations for better performance and accuracy. 

Also on the **Analytics** page, you have the ability to rerun analytics rules on-demand. This capability provides flexibility and control in validating the effectiveness of the rules. It can be useful in scenarios such as rule refinement, testing, validation, and others. Having the flexibility to initiate manual reruns can support efficient security operations, enable effective incident response, and enhance the overall detection and response capabilities of the system. 

## Use cases and benefits of rule rerun

Here are some scenarios that can benefit from replaying specific runs of analytics rules: 

**Rule refinement and tuning:** Analytics rules may require periodic adjustments and fine-tuning based on the evolving threat landscape and changing organizational needs. By manually rerunning rules, your analysts can assess the impact of rule modifications and validate their effectiveness before deploying them in a production environment.

**Testing and validation:** When introducing new analytics rules, making significant changes to existing ones, or developing new incident playbooks, it is essential to thoroughly test their performance and accuracy. Manual rerunning allows you to simulate different scenarios, including end-to-end automated incident flow, and validate the rules against a consistent set of data inputs. This process ensures that the rules generate the expected alerts without producing excessive false positives.

**Incident investigation:** In the event of a security incident or suspicious activity, your analysts may want to surface additional details in the alerts already generated. They can do this by updating the rule and rerunning it on specific execution intervals (going back up to seven days) to gather additional information and identify related events. Manual rerunning allows your analysts to perform in-depth investigations and helps ensure comprehensive coverage.

**Compliance and auditing:** Some regulatory requirements or internal policies may necessitate rerunning analytics rules periodically or on-demand to demonstrate continuous monitoring and compliance. Manual rerunning provides the ability to meet such obligations by ensuring that rules are consistently applied and generate appropriate alerts. 

## View analytics rule insights

To take advantage of these tools, start by examining the insights on a given rule.

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Find and select a rule (**Scheduled** or **NRT**) whose insights you'd like to see.

1. Select the **Insights** tab in the details pane.

    :::image type="content" source="media/monitor-troubleshoot-analytics-rule-execution/analytics-screen-select-rule.png" alt-text="Screenshot of selecting an analytics rule.":::

1. When you select the **Insights** tab, the time frame selector will appear. Select a time frame, or leave it as the default of the last 24 hours.

    :::image type="content" source="media/monitor-troubleshoot-analytics-rule-execution/time-frame.png" alt-text="Screenshot of time frame selector on Analytics page.":::

The **Insights** panel currently shows four kinds of insights. Each insight is followed by a **View all** link that takes you to the **Logs** page and displays the query that produced the insight along with the full raw results. Here are the insights:

- **Failed executions** displays a list of failed runs of this rule in the given time frame. This insight is also followed by a link to the **Rule runs** panel, where you can see a list of all the times the rule has run, and you can [replay specific runs of the rule](#rerun-analytics-rules).

- **Top health issues** displays a list of the most common health issues for this rule during the given time frame. This insight is also followed by a **View runs** link that takes you to the **Logs** page where you'll see a query of all the times this rule has run.

- **Alert graph** shows a chart of the number of alerts generated by this rule in the given time frame.

- **Incident classification** shows a summary of the classification of closed incidents created by this rule during the given time frame.

## Rerun analytics rules



## Next steps

- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.
