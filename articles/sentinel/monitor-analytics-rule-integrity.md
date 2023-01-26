---
title: Monitor the health and audit the integrity of your Microsoft Sentinel analytics rules
description: Use the SentinelHealth data table to keep track of your analytics rules' execution and performance.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/17/2023
---

# Monitor the health and audit the integrity of your analytics rules

To ensure uninterrupted and tampering-free threat detection in your Microsoft Sentinel service, keep track of your analytics rules' health and integrity by monitoring their execution and audit logs.

Set up notifications of health and audit events for relevant stakeholders, who can then take action. For example, define and send email or Microsoft Teams messages, create new tickets in your ticketing system, and so on.

This article describes how to use Microsoft Sentinel's [auditing and health monitoring features](health-audit.md) to keep track of your analytics rules' health and integrity from within Microsoft Sentinel.

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Summary

- **Microsoft Sentinel analytics rule health logs:**

    - This log captures events that record the running of analytics rules, and the end result of these runnings&mdash;if they succeeded or failed, and if they failed, why. 
    - The log also records how many events were captured by the query, whether or not that number passed the threshold and caused an alert to be fired.
    - These logs are collected in the *SentinelHealth* table in Log Analytics.
    
- **Microsoft Sentinel analytics rule audit logs:**

    - This log captures events that record changes made to any analytics rule, including which rule was changed, what the change was, the state of the rule settings before and after the change, the user or identity that made the change, the source IP and date/time of the change. and more.
    - These logs are collected in the *SentinelAudit* table in Log Analytics.

## Use the SentinelHealth and SentinelAudit data tables (Preview)

To get audit and health data from the tables described above, you must first turn on the Microsoft Sentinel health feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](enable-monitoring.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your automation rules and playbooks.

### Understanding SentinelHealth table events

The following types of analytics rule health events are logged in the *SentinelHealth* table:

- **Scheduled analytics rule run**.

- **NRT analytics rule run**.

    For more information, see [SentinelHealth table columns schema](health-table-reference.md#sentinelhealth-table-columns-schema).

The following types of analytics rule audit events are logged in the *SentinelAudit* table:

- **Create or update analytics rule**.

- **Analytics rule deleted**.

    For more information, see [SentinelAudit table columns schema](audit-table-reference.md#sentinelaudit-table-columns-schema).

### Statuses, errors and suggested steps

For either **Scheduled analytics rule run** or **NRT analytics rule run**, you may see any of the following statuses and descriptions:
- **Success**: Rule executed successfully, generating `<n>` alert(s).

- **Success**: Rule executed successfully, but did not reach the threshold (`<n>`) required to generate an alert.

- **Failure**: These are the possible descriptions for rule failure, and what you can do about them.

    | Description                                                          | Remediation                                                                          |
    | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
    | An internal server error occurred while running the query.           |                                                                                      |
    | The query execution timed out.                                       |                                                                                      |
    | A table referenced in the query was not found.                       | Verify that the relevant data source is connected.                                   |
    | A semantic error occurred while running the query.                 | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | A function called by the query is named with a reserved word.        | Remove or rename the function.                                                       |
    | A syntax error occurred while running the query.                   | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | The workspace does not exist.                                        |                                                                                      |
    | This query was found to use too many system resources and was prevented from running. |                                                                     |
    | A function called by the query was not found.                        | Verify the existence in your workspace of all functions called by the query.         |
    | The workspace used in the query was not found.                       | Verify that all workspaces in the query exist.                                       |
    | You don't have permissions to run this query.                      | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | You don't have access permissions to one or more of the resources in the query.       |                                                                     |
    | The query referred to a storage path that was not found.             |                                                                                      |
    | The query was denied access to a storage path.                       |                                                                                      |
    | Multiple functions with the same name are defined in this workspace. | Remove or rename the redundant function and reset the rule by editing and saving it. |
    | This query did not return any result.                                |                                                                                      |
    | Multiple result sets in this query are not allowed.                  |                                                                                      |
    | Query results contain inconsistent number of fields per row.         |                                                                                      |
    | The rule's running was delayed due to long data ingestion times.     |                                                                                      |
    | The rule's running was delayed due to temporary issues.              |                                                                                      |
    | The alert was not enriched due to temporary issues.                  |                                                                                      |
    | The alert was not enriched due to entity mapping issues.             |                                                                                      |
    | \<number> entities were dropped in alert \<name> due to the 32 KB alert size limit.   |                                                                     |
    | \<number> entities were dropped in alert \<name> due to entity mapping issues.        |                                                                     |


## Next steps

- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.
