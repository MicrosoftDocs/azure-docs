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

    - This log captures events that record changes made to any analytics rule, including which rule was changed, what the change was, the state of the rule settings before and after the change, the user or identity that made the change, the source IP and date/time of the change. and more., whether they succeeded or failed, and if they failed, why.
    - These logs are collected in the *SentinelAudit* table in Log Analytics.

## Use the SentinelHealth and SentinelAudit data tables (Preview)

To get audit and health data from the tables described above, you must first turn on the Microsoft Sentinel health feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](enable-monitoring.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your automation rules and playbooks.

### Understanding SentinelHealth table events

The following types of analytics rule health events are logged in the *SentinelHealth* table:

- **Scheduled analytics rule run**.

- **NRT analytics rule run**.

The following types of analytics rule audit events are logged in the *SentinelAudit* table:

- **Create or update analytics rule**.

- **Analytics rule deleted**.



<!-- REPLACE THIS WITH ANALYTICS RULE MESSAGES

- **Automation rule run**. Logged whenever an automation rule's conditions are met, causing it to run. Besides the fields in the basic *SentinelHealth* table, these events will include [extended properties unique to the running of automation rules](health-table-reference.md#automation-rules), including a list of the playbooks called by the rule. The following sample query will display these events:

    ```kusto
    SentinelHealth
    | where OperationName == "Automation rule run"
    ```

- **Playbook was triggered**. Logged whenever a playbook is triggered on an incident manually from the portal or through the API. Besides the fields in the basic *SentinelHealth* table, these events will include [extended properties unique to the manual triggering of playbooks](health-table-reference.md#playbooks). The following sample query will display these events:

    ```kusto
    SentinelHealth
    | where OperationName == "Playbook was triggered"
    ```
-->

For more information, see [SentinelHealth table columns schema](health-table-reference.md#sentinelhealth-table-columns-schema).

### Statuses, errors and suggested steps

For either **Scheduled analytics rule run** or **NRT analytics rule run**, you may see any of the following statuses:
- Success: Rule executed successfully, generating `<n>` alert(s).
- Success: Rule executed successfully, but did not reach the threshold (`<n>`) required to generate an alert.

<!-- REPLACE THIS WITH ANALYTICS RULE MESSAGES

For **Automation rule run**, you may see the following statuses:
- Success: rule executed successfully, triggering all actions.
- Partial success: rule executed and triggered at least one action, but some actions failed.
- Failure: automation rule did not run any action due to one of the following reasons:
    - Conditions evaluation failed.
    - Conditions met, but the first action failed.

For **Playbook was triggered**, you may see the following statuses:
- Success: playbook was triggered successfully.
- Failure: playbook could not be triggered. 
    > [!NOTE]
    > 
    > "Success" means only that the automation rule successfully triggered a playbook. It doesn't tell you when the playbook started or ended, the results of the actions in the playbook, or the final result of the playbook. To find this information, query the Logic Apps diagnostics logs (see the instructions later in this article).
-->

- Failure: These are the possible reasons for failure.

    | Failure reason                                 | Description                                                                           | Remediation                                                                            |
    | ---------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
    | **GENERAL_ERROR**                              | An internal server error occurred while running the query.                            |                                                                                        |
    | **QUERY_TIMEOUT**                              | The query execution timed out.                                                        |                                                                                        |
    | **TABLE_NOT_EXISTS**                           | A table referenced in the query was not found.                                        | Verify that the relevant data source is connected.                                     |
    | **SEMANTIC_ERROR**                             | A semantic error occurred while running the query.                                    | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | **FUNCTION_RESERVED_FUNCTION**                 | A function called by the query is named with a reserved word.                         | Remove or rename the function.                                                         |
    | **SYNTAX_ERROR**                               | A syntax error occurred while running the query.                                      | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | **WORKSPACE_NOT_EXIST**                        | The workspace does not exist.                                                         |                                                                                        |
    | **QUERY_CONSUMES_TOO_MANY_RESOURCES**          | This query was found to use too many system resources and was prevented from running. |                                                                                        |
    | **UNKNOWN_FUNCTION**                           | A function called by the query was not found.                                         | Verify the existence in your workspace of all functions called by the query.           |
    | **FAILED_TO_RESOLVE_RESOURCE**                 | The workspace used in the query was not found.                                        | Verify that all workspaces in the query exist.                                         |
    | **INSUFFICIENT_ACCESS_TO_QUERY**               | You don't have permissions to run this query.                                         | Try resetting the alert rule by editing and saving it (without changing any settings). |
    | **INSUFFICIENT_ACCESS_TO_RESOURCE**            | You don't have access permissions to one or more of the resources in the query.       |                                                                                        |
    | **PERSISTENT_STORAGE_PATH_NOT_EXIST**          | The query referred to a storage path that was not found.                              |                                                                                        |
    | **PERSISTENT_STORAGE_ACCESS_DENIED**           | The query was denied access to a storage path.                                        |                                                                                        |
    | **MULTIPLE_FUNCTIONS_WITH_SAME_NAME**          | Multiple functions with the same name are defined in this workspace.                  | Remove or rename the redundant function and reset the rule by editing and saving it.   |
    | **QUERT_RESULT_MISSING**                       | This query did not return any result.                                                 |                                                                                        |
    | **MULTIPLE_RESULT_SET_NOT_ALLOWED**            | Multiple result sets in this query are not allowed.                                   |                                                                                        |
    | **WRONG_NUMBER_OF_FIELDS**                     | Query results contain inconsistent number of fields per row.                          |                                                                                        |
    | **INGESTION_DELAY**                            | The rule's running was delayed due to long data ingestion times.                      |                                                                                        |
    | **TEMPORARY_ISSUE_DELAY**                      | The rule's running was delayed due to temporary issues.                               |                                                                                        |
    | **ENRICHMENT_ABORTED_DUE_TO_TEMPRARY_ISSUES**  | The alert was not enriched due to temporary issues.                                   |                                                                                        |
    | **ENRICHMENT_ABORTED_DUE_TO_PERMENANT_ISSUES** | The alert was not enriched due to entity mapping issues.                              |                                                                                        |
    | **ENTITIES_DROPPED_DUE_TO_SIZE_LIMIT**         | X entities were dropped in alert Y due to the 32 KB alert size limit.                 |                                                                                        |
    | **ENTITIES_DROPPED_DUE_TO_MAPPING_ISSUES**     | X entities were dropped in alert Y due to entity mapping issues.                      |                                                                                        |


## Next steps

- Learn what [health monitoring in Microsoft Sentinel](health-audit.md) can do for you.
- [Turn on health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- Monitor the health of your [data connectors](monitor-data-connector-health.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.
