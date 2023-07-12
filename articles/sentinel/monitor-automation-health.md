---
title: Monitor the health of your Microsoft Sentinel automation rules and playbooks
description: Use the SentinelHealth and AzureDiagnostics data tables to keep track of your automation rules' and playbooks' execution and performance.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/09/2022
ms.service: microsoft-sentinel
---

# Monitor the health of your automation rules and playbooks

To ensure proper functioning and performance of your security orchestration, automation, and response operations in your Microsoft Sentinel service, keep track of the health of your automation rules and playbooks by monitoring their execution logs.

Set up notifications of health events for relevant stakeholders, who can then take action. For example, define and send email or Microsoft Teams messages, create new tickets in your ticketing system, and so on.

This article describes how to use Microsoft Sentinel's [health monitoring features](health-audit.md) to keep track of your automation rules and playbooks' health from within Microsoft Sentinel.

## Summary




- **Microsoft Sentinel automation health logs:**

    - This log captures events that record the running of automation rules, and the end result of these runnings - if they succeeded or failed, and if they failed, why. The log records the collective success or failure of the launch of the actions in the rule, and it also lists the playbooks called by the rule.
    - The log also captures events that record the on-demand (manual or API-based) triggering of playbooks, including the **identities that triggered them**, whether they succeeded or failed, and if they failed, why.
    - This log *does not include* a record of the execution of the contents of a playbook, only of the success or failure of the launching of the playbook. For a log of the actions taken within a playbook, see the next list below.
    - These logs are collected in the *SentinelHealth* table in Log Analytics.
    
    > [!IMPORTANT]
    >
    > The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

- **Azure Logic Apps diagnostics logs:**

    - These logs capture the results of the running of playbooks (also known as Logic Apps workflows) and the actions in them.
    - These logs provide you with a complete picture of your automation health when used in tandem with the automation health logs.
    - These logs are collected in the *AzureDiagnostics* table in Log Analytics.

## Use the SentinelHealth data table (Public preview)

To get automation health data from the *SentinelHealth* data table, you must first turn on the Microsoft Sentinel health feature for your workspace. For more information, see [Turn on health monitoring for Microsoft Sentinel](enable-monitoring.md).

Once the health feature is turned on, the *SentinelHealth* data table is created at the first success or failure event generated for your automation rules and playbooks.

### Understanding SentinelHealth table events

The following types of automation health events are logged in the *SentinelHealth* table:

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

For more information, see [SentinelHealth table columns schema](health-table-reference.md#sentinelhealth-table-columns-schema).

### Statuses, errors and suggested steps

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

#### Error descriptions and suggested actions

| Error description                 | Suggested actions                         |
| --------------------------------- | ----------------------------------------- |
| **Could not add task: *\<TaskName>*.**<br>Incident/alert was not found. | Make sure the incident/alert exists and try again. |
| **Could not modify property: *\<PropertyName>*.**<br>Incident/alert was not found. | Make sure the incident/alert exists and try again. |
| **Could not modify property: *\<PropertyName>*.**<br>Too many requests, exceeding throttling limits. |  |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Incident/alert was not found. | If the error occurred when trying to trigger a playbook on demand, make sure the incident/alert exists and try again. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Either the playbook was not found, or Microsoft Sentinel was missing permissions on it. | Edit the automation rule, find and select the playbook in its new location, and save. Make sure Microsoft Sentinel has [permission to run this playbook](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents). |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Contains an unsupported trigger type. | Make sure your playbook starts with the [correct Logic Apps trigger](playbook-triggers-actions.md#microsoft-sentinel-triggers-summary): Microsoft Sentinel Incident or Microsoft Sentinel Alert. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>The subscription is disabled and marked as read-only. Playbooks in this subscription cannot be run until the subscription is re-enabled. | Re-enable the Azure subscription in which the playbook is located. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>The playbook was disabled. | Enable your playbook, in Microsoft Sentinel in the Active Playbooks tab under Automation, or in the Logic Apps resource page. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Invalid template definition. | There is an error in the playbook definition. Go to the Logic Apps designer to fix the issues and save the playbook. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Access control configuration restricts Microsoft Sentinel. | Logic Apps configurations allow restricting access to trigger the playbook. This restriction is in effect for this playbook. Remove this restriction so Microsoft Sentinel is not blocked. [Learn more](../logic-apps/logic-apps-securing-a-logic-app.md?tabs=azure-portal#restrict-access-by-ip-address-range) |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Microsoft Sentinel is missing permissions to run it. | Microsoft Sentinel requires [permissions to run playbooks](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents). |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Playbook wasn’t migrated to new permissions model. Grant Microsoft Sentinel permissions to run this playbook and resave the rule. | Grant Microsoft Sentinel [permissions to run this playbook](tutorial-respond-threats-playbook.md?tabs=LAC#respond-to-incidents) and resave the rule. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Too many requests, exceeding workflow throttling limits. | The number of waiting workflow runs has exceeded the maximum allowed limit. Try increasing the value of `'maximumWaitingRuns'` in [trigger concurrency configuration](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs-limit). |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Too many requests, exceeding throttling limits. | Learn more about [subscription and tenant limits](../azure-resource-manager/management/request-limits-and-throttling.md#subscription-and-tenant-limits). |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Access was forbidden. Managed identity is missing configuration or Logic Apps network restriction has been set. | If the playbook uses managed identity, [make sure the managed identity was assigned with permissions](authenticate-playbooks-to-sentinel.md#authenticate-with-managed-identity). The playbook may have network restriction rules preventing it from being triggered as they block Microsoft Sentinel service. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>The subscription or resource group was locked. | Remove the lock to allow Microsoft Sentinel trigger playbooks in the locked scope. Learn more about [locked resources](../azure-resource-manager/management/lock-resources.md?tabs=json). |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Caller is missing required playbook-triggering permissions on playbook, or Microsoft Sentinel is missing permissions on it. | The user trying to trigger the playbook on demand is missing Logic Apps Contributor role on the playbook or to trigger the playbook. [Learn more](../logic-apps/logic-apps-securing-a-logic-app.md?tabs=azure-portal#restrict-access-by-ip-address-range) |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Invalid credentials in connection. | [Check the credentials your connection is using](authenticate-playbooks-to-sentinel.md#manage-your-api-connections) in the **API connections** service in the Azure portal. |
| **Could not trigger playbook: *\<PlaybookName>*.**<br>Playbook ARM ID is not valid. |  |

## Get the complete automation picture

Microsoft Sentinel's health monitoring table allows you to track the triggering of playbooks, but to monitor what happens inside your playbooks and their results when they're run, you must also [turn on diagnostics in Azure Logic Apps](../logic-apps/monitor-workflows-collect-diagnostic-data.md) to ingest the following events to the *AzureDiagnostics* table:

- {Action name} started
- {Action name} ended
- Workflow (playbook) started
- Workflow (playbook) ended

These added events will give you additional insights into the actions being taken in your playbooks.

### Turn on Azure Logic Apps diagnostics

For each playbook you are interested in monitoring, [enable Log Analytics for your logic app](../logic-apps/monitor-workflows-collect-diagnostic-data.md). Make sure to select **Send to Log Analytics workspace** as your log destination, and choose your Microsoft Sentinel workspace.

### Correlate Microsoft Sentinel and Azure Logic Apps logs

Now that you have logs for your automation rules and playbooks *and* logs for your individual Logic Apps workflows in your workspace, you can correlate them to get the complete picture. Consider the following sample query:

```kusto
SentinelHealth 
| where SentinelResourceType == "Automation rule"
| mv-expand TriggeredPlaybooks = ExtendedProperties.TriggeredPlaybooks
| extend runId = tostring(TriggeredPlaybooks.RunId)
| join (AzureDiagnostics 
    | where OperationName == "Microsoft.Logic/workflows/workflowRunCompleted"
    | project
        resource_runId_s,
        playbookName = resource_workflowName_s,
        playbookRunStatus = status_s)
    on $left.runId == $right.resource_runId_s
| project
    RecordId,
    TimeGenerated,
    AutomationRuleName= SentinelResourceName,
    AutomationRuleStatus = Status,
    Description,
    workflowRunId = runId,
    playbookName,
    playbookRunStatus
```

## Use the health monitoring workbook

The **Automation health** workbook helps you visualize your health data, as well as the correlation between the two types of logs that we just mentioned. The workbook includes the following displays:
- Automation rule health and details
- Playbook trigger health and details
- Playbook runs health and details (requires Azure Diagnostic enabled on the Playbook level)
- Automation details per incident

:::image type="content" source="media/monitor-automation-health/automation-health-monitoring-workbook.png" alt-text="Screenshot shows the opening panel of the automation health workbook.":::

Select the **Playbooks run by Automation Rules** tab to see playbook activity.

:::image type="content" source="media/monitor-automation-health/automation-health-monitoring-workbook-playbooks.png" alt-text="Screenshot shows a list of the playbooks called by automation rules.":::

Select a playbook to see the list of its runs in the drill-down chart below.

:::image type="content" source="media/monitor-automation-health/automation-health-monitoring-workbook-playbook-run-list.png" alt-text="Screenshot shows a list of runs of the chosen playbook.":::

Select a particular run to see the results of the actions in the playbook.

:::image type="content" source="media/monitor-automation-health/automation-health-monitoring-workbook-playbook-runs.png" alt-text="Screenshot shows the actions taken in a given run of this playbook." lightbox="media/monitor-automation-health/automation-health-monitoring-workbook-playbook-runs.png":::

## Next steps

- Learn about [auditing and health monitoring in Microsoft Sentinel](health-audit.md).
- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- [Monitor the health and integrity of your analytics rules](monitor-analytics-rule-integrity.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.
