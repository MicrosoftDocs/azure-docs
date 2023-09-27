---
title: Monitor the health and audit the integrity of your Microsoft Sentinel analytics rules
description: Use the SentinelHealth data table to keep track of your analytics rules' execution and performance.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 02/20/2023
---

# Monitor the health and audit the integrity of your analytics rules

To ensure comprehensive, uninterrupted, and tampering-free threat detection in your Microsoft Sentinel service, keep track of your analytics rules' health and integrity and keep them functioning optimally, by monitoring their [execution insights](monitor-optimize-analytics-rule-execution.md#view-analytics-rule-insights), by querying the health and audit logs, and by [using manual rerun to test and optimize your rules](monitor-optimize-analytics-rule-execution.md#use-cases-and-benefits-of-rule-rerun).

Set up notifications of health and audit events for relevant stakeholders, who can then take action. For example, define and send email or Microsoft Teams messages, create new tickets in your ticketing system, and so on.

This article describes how to use Microsoft Sentinel's [auditing and health monitoring features](health-audit.md) to keep track of your analytics rules' health and integrity from within Microsoft Sentinel.

For information on rule insights and manual rerunning of rules, see [Monitor and optimize the execution of your scheduled analytics rules](monitor-optimize-analytics-rule-execution.md).

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Summary

- **Microsoft Sentinel analytics rule health logs:**

    - This log captures events that record the running of analytics rules, and the end result of these runnings&mdash;if they succeeded or failed, and if they failed, why. 
    - The log also records, for each running of an analytics rule: 
        - How many events were captured by the rule's query.
        - Whether the number of events passed the threshold defined in the rule, causing the rule to fire an alert.

    These logs are collected in the *SentinelHealth* table in Log Analytics.
    
- **Microsoft Sentinel analytics rule audit logs:**

    - This log captures events that record changes made to any analytics rule, including the following details:
        - The name of the rule that was changed.
        - Which properties of the rule were changed.
        - The state of the rule settings before and after the change.
        - The user or identity that made the change.
        - The source IP and date/time of the change.
        - ...and more.
    
    These logs are collected in the *SentinelAudit* table in Log Analytics.

## Use the SentinelHealth and SentinelAudit data tables (Preview)

To get audit and health data from the tables described above, you must first turn on the Microsoft Sentinel health feature for your workspace. For more information, see [Turn on auditing and health monitoring for Microsoft Sentinel](enable-monitoring.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your automation rules and playbooks.

### Understanding SentinelHealth and SentinelAudit table events

The following types of analytics rule health events are logged in the *SentinelHealth* table:

- **Scheduled analytics rule run**.

- **NRT analytics rule run**.

    For more information, see [SentinelHealth table columns schema](health-table-reference.md#sentinelhealth-table-columns-schema).

The following types of analytics rule audit events are logged in the *SentinelAudit* table:

- **Create or update analytics rule**.

- **Analytics rule deleted**.

    For more information, see [SentinelAudit table columns schema](audit-table-reference.md#sentinelaudit-table-columns-schema).

### Run queries to detect health and integrity issues

For best results, you should build your queries on the **pre-built functions** on these tables, ***_SentinelHealth()*** and ***_SentinelAudit()***, instead of querying the tables directly. These functions ensure the maintenance of your queries' backward compatibility in the event of changes being made to the schema of the tables themselves.

As a first step, your queries should filter the tables for data related to analytics rules. Use the `SentinelResourceType` parameter.

```kusto
_SentinelHealth()
| where SentinelResourceType == "Analytics Rule"
```

If you want, you can further filter the list for a particular kind of analytics rule. Use the `SentinelResourceKind` parameter for this.

```kusto
| where SentinelResourceKind == "Scheduled"

# OR

| where SentinelResourceKind == "NRT"
```

Here are some sample queries to help you get started:

- Find rules that didn't run successfully:

    ```kusto
    _SentinelHealth()
    | where SentinelResourceType == "Analytics Rule"
    | where Status != "Success"
    ``` 

- Find rules that have been "[auto-disabled](detect-threats-custom.md#issue-a-scheduled-rule-failed-to-execute-or-appears-with-auto-disabled-added-to-the-name)":

    ```kusto
    _SentinelHealth()
    | where SentinelResourceType == "Analytics Rule"
    | where Reason == "The analytics rule is disabled and was not executed."
    ``` 

- Count the rules and runnings that succeeded or failed, by reason:

    ```kusto
    _SentinelHealth()
    | where SentinelResourceType == "Analytics Rule"
    | summarize Occurrence=count(), Unique_rule=dcount(SentinelResourceId) by Status, Reason
    ``` 
 
- Find rule deletion activity:

    ```kusto
    _SentinelAudit()
    | where SentinelResourceType =="Analytic Rule"
    | where Description =="Analytics rule deleted"
    ```

- Find activity on rules, by rule name and activity name:

    ```kusto
    _SentinelAudit()
    | where SentinelResourceType =="Analytic Rule"
    | summarize Count= count() by RuleName=SentinelResourceName, Activity=Description
    ```

- Find activity on rules, by caller name (the identity that performed the activity):

    ```kusto
    _SentinelAudit()
    | where SentinelResourceType =="Analytic Rule"
    | extend Caller= tostring(ExtendedProperties.CallerName)
    | summarize Count = count() by Caller, Activity=Description
    ```

 

### Statuses, errors and suggested steps

For either **Scheduled analytics rule run** or **NRT analytics rule run**, you may see any of the following statuses and descriptions:
- **Success**: Rule executed successfully, generating `<n>` alert(s).

- **Success**: Rule executed successfully, but did not reach the threshold (`<n>`) required to generate an alert.

- **Failure**: These are the possible descriptions for rule failure, and what you can do about them.

    | Description  | Remediation  |
    | ------------ | ------------ |
    | An internal server error occurred while running the query.   |   |
    | The query execution timed out.   |   |
    | A table referenced in the query was not found.   | Verify that the relevant data source is connected.   |
    | A semantic error occurred while running the query.   | Try resetting the analytics rule by editing and saving it (without changing any settings). |
    | A function called by the query is named with a reserved word.   | Remove or rename the function.   |
    | A syntax error occurred while running the query.   | Try resetting the analytics rule by editing and saving it (without changing any settings). |
    | The workspace does not exist.   |   |
    | This query was found to use too many system resources and was prevented from running.   | Review and tune the analytics rule. Consult our Kusto Query Language [overview](kusto-overview.md) and [best practices](/azure/data-explorer/kusto/query/best-practices?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) documentation. |
    | A function called by the query was not found.   | Verify the existence in your workspace of all functions called by the query.   |
    | The workspace used in the query was not found.   | Verify that all workspaces in the query exist.   |
    | You don't have permissions to run this query.   | Try resetting the analytics rule by editing and saving it (without changing any settings).   |
    | You don't have access permissions to one or more of the resources in the query.   |   |
    | The query referred to a storage path that was not found.   |   |
    | The query was denied access to a storage path.   |   |
    | Multiple functions with the same name are defined in this workspace. | Remove or rename the redundant function and reset the rule by editing and saving it. |
    | This query did not return any result.   |   |
    | Multiple result sets in this query are not allowed.   |   |
    | Query results contain inconsistent number of fields per row.   |   |
    | The rule's running was delayed due to long data ingestion times.   |   |
    | The rule's running was delayed due to temporary issues.   |   |
    | The alert was not enriched due to temporary issues.   |   |
    | The alert was not enriched due to entity mapping issues.   |   |
    | \<*number*> entities were dropped in alert \<*name*> due to the 32 KB alert size limit.   |   |
    | \<*number*> entities were dropped in alert \<*name*> due to entity mapping issues.   |   |
    | The query resulted in \<*number*> events, which exceeds the maximum of \<*limit*> results allowed for \<*rule type*> rules with alert-per-row event-grouping configuration. Alert-per-row was generated for first \<*limit*-1> events and an additional aggregated alert was generated to account for all events.<br>- \<*number*> = number of events returned by the query<br>- \<*limit*> = currently 150 alerts for scheduled rules, 30 for NRT rules<br>- \<*rule type*> = Scheduled or NRT

## Use the auditing and health monitoring workbook

1. To make the workbook available in your workspace, you must install the workbook solution from the Microsoft Sentinel content hub:
    1. From the Microsoft Sentinel portal, select **Content hub (Preview)** from the **Content management** menu.

    1. In the **Content hub**, enter *health* in the search bar, and select **Analytics Health & Audit** from among the **Workbook** solutions under **Standalone** in the results.

        :::image type="content" source="media/monitor-analytics-rule-integrity/select-workbook-from-content-hub.png" alt-text="Screenshot of selection of analytics health workbook from content hub.":::

    1. Select **Install** from the details pane, then select **Save** that appears in its place.

1. When the solution indicates it's installed, select **Workbooks** from the **Threat management** menu.

    :::image type="content" source="media/monitor-analytics-rule-integrity/installed.png" alt-text="Screenshot of indication that analytics health workbook solution is installed from content hub.":::

1. In the **Workbooks** gallery, select the **Templates** tab, enter *health* in the search bar, and select **Analytics Health & Audit** from among the results.

    :::image type="content" source="media/monitor-analytics-rule-integrity/select-workbook-template.png" alt-text="Screenshot of selecting analytics health workbook from template gallery.":::

1. Select **Save** in the details pane to create an editable and usable copy of the workbook. When the copy is created, select **View saved workbook**.

1. Once in the workbook, first select the **subscription** and **workspace** you wish to view (they may already be selected), then define the **TimeRange** to filter the data according to your needs. Use the **Show help** toggle to display in-place explanation of the workbook.

    :::image type="content" source="media/monitor-analytics-rule-integrity/analytics-health-workbook-overview.png" alt-text="Screenshot of analytics rule health workbook overview tab.":::

There are three tabbed sections in this workbook:

### Overview tab

The **Overview** tab shows health and audit summaries:
- Health summaries of the status of analytics rule runs in the selected workspace: number of runs, successes and failures, and failure event details.
- Audit summaries of activities on analytics rules in the selected workspace: number of activities over time, number of activities by type, and number of activities of different types by rule.

### Health tab

The **Health** tab lets you drill down to particular health events.

:::image type="content" source="media/monitor-analytics-rule-integrity/analytics-health-workbook-health-tab.png" alt-text="Screenshot of selection of health tab in analytics health workbook.":::

- Filter the whole page data by **status** (success/failure) and **rule type** (scheduled/NRT).
- See the trends of successful and/or failed rule runs (depending on the status filter) over the selected time period. You can "time brush" the trend graph to see a subset of the original time range.
    :::image type="content" source="media/monitor-analytics-rule-integrity/analytics-rule-runs-over-time.png" alt-text="Screenshot of analytics rule runs over time in analytics health workbook.":::
- Filter the rest of the page by **reason**.
- See the total number of runs for all the analytics rules, displayed proportionally by status in a pie chart.
- Following that is a table showing the number of unique analytics rules that ran, broken down by rule type and status.
    - Select a status to filter the remaining charts for that status.
    - Clear the filter by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/number-rule-runs-by-status-and-type.png" alt-text="Screenshot of number of rules run by status and type in the analytics health workbook.":::
- See each status, with the number of possible reasons for that status. (Only reasons represented in the runs in the selected time frame will be shown.)
    - Select a status to filter the remaining charts for that status.
    - Clear the filter by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/unique-reasons-by-status.png" alt-text="Screenshot of number of unique reasons by status in analytics health workbook.":::
- Next, see a list of those reasons, with the number of total rule runs combined and the number of unique rules that were run.
    - Select a reason to filter the following charts for that reason.
    - Clear the filter by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/rule-runs-by-reason.png" alt-text="Screenshot of rule runs by unique reason in analytics health workbook.":::
- After that is a list of the unique analytics rules that ran, with the latest results and trendlines of their success and/or failure (depending on the status selected to filter the list).
    - Select a rule to drill down and show a new table with all the runnings of that rule (in the selected time frame).
    - Clear that table by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/unique-rules-by-status-and-trend.png" alt-text="Screenshot of list of unique rules run, with status and trendlines, in analytics health workbook.":::
- If you selected a rule in the list above, a new table will appear with the health details for the selected rule.
:::image type="content" source="media/monitor-analytics-rule-integrity/health-events-for-rule.png" alt-text="Screenshot of list of runs of selected analytics rule, in analytics health workbook.":::


### Audit tab

The **Audit** tab lets you drill down to particular audit events.

:::image type="content" source="media/monitor-analytics-rule-integrity/analytics-health-workbook-audit-tab.png" alt-text="Screenshot of selection of audit tab in analytics health workbook.":::

- Filter the whole page data by **audit rule type** (scheduled/Fusion).
- See the trends of audited activity on analytics rules over the selected time period. You can "time brush" the trend graph to see a subset of the original time range.
    :::image type="content" source="media/monitor-analytics-rule-integrity/audit-trending-by-activity.png" alt-text="Screenshot of trending audit activity in analytics health workbook.":::
- See the numbers of audited events, broken down by **activity** and **rule type**.
    - Select an activity to filter the following charts for that activity.
    - Clear the filter by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/number-audit-events-by-activity-and-type.png" alt-text="Screenshot of counts of audit events by activity and type in analytics health workbook.":::
- See the number of audited events by **rule name**.
    - Select a rule name to filter the following table for that rule, and to drill down and show a new table with all the activity on that rule (in the selected time frame). (See after the following screenshot.)
    - Clear the filter by selecting the "Clear selection" icon (it looks like an "Undo" icon) in the upper right corner of the chart.
    :::image type="content" source="media/monitor-analytics-rule-integrity/activity-by-rule-name-and-caller.png" alt-text="Screenshot of audited events by rule name and caller in analytics health workbook.":::
- See the number of audited events by **caller** (the identity that performed the activity).
- If you selected a rule name in the chart depicted above, another table will appear showing the audited **activities** on that rule. Select the value that appears as a link in the ExtendedProperties column to open a side panel displaying the changes made to the rule.
    :::image type="content" source="media/monitor-analytics-rule-integrity/audit-activity-for-rule.png" alt-text="Screenshot of audit activity for selected rule in analytics health workbook.":::

## Next steps

- [Monitor and optimize analytics rule execution in Microsoft Sentinel](monitor-optimize-analytics-rule-execution.md).
- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.
