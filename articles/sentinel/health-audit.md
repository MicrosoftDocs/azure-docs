---
title: Auditing and health monitoring in Microsoft Sentinel 
description: Learn about the Microsoft Sentinel health and audit feature, which monitors service health drifts and user actions.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 05/20/2024
---

# Auditing and health monitoring in Microsoft Sentinel 

Microsoft Sentinel is a critical service for advancing and protecting the security of your organization’s technological and information assets, so you want to be sure that it's always running smoothly and free of interference. 

You want to verify that the service's many moving parts are always functioning as intended, and it isn't being manipulated by unauthorized actions, whether by internal users or otherwise. You may also like to configure notifications of health drifts or unauthorized actions to be sent to relevant stakeholders who can respond or approve a response. For example, you can set conditions to trigger the sending of emails or Microsoft Teams messages to operations teams, managers, or officers, launch new tickets in your ticketing system, and so on.

This article describes how Microsoft Sentinel’s health monitoring and auditing features let you monitor the activity of some of the service’s key resources and inspect logs of user actions within the service. 


## Health and audit data storage

Health and audit data are collected in two tables in your Log Analytics workspace: *SentinelHealth* and *SentinelAudit*

**Audit data** is collected in the *SentinelAudit* table.

**Health data** is collected in the *SentinelHealth* table, which captures events that record each time an automation rule is run and the end results of those runs. The *SentinelHealth* table includes:

- Whether actions launched in the rule succeed or fail, and the playbooks called by the rule.
- Events that record the on-demand (manual or API-based) triggering of playbooks, including the identities that triggered them, and the end results of those runs

The *SentinelHealth* table doesn't include a record of the execution of a playbook's contents, only whether the playbook was launched successfully. A log of the actions taken within a playbook, which are Logic Apps workflows, are listed in the *AzureDiagnostics* table. The *AzureDiagnostics* provides you with a complete picture of your automation health when used in tandem with the *SentinelHealth* data.

The most common way you'll use this data is by querying these tables. For best results, build your queries on the **pre-built functions** on these tables, ***_SentinelHealth()*** and ***_SentinelAudit()***, instead of querying the tables directly. These functions ensure the maintenance of your queries' backward compatibility in the event of changes being made to the schema of the tables themselves.

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

### Questions to verify service health and audit data

Use the following questions to guide your monitoring of Microsoft Sentinel's health and audit data:

**Is the data connector running correctly?**

[Is the data connector receiving data](./monitor-data-connector-health.md)? For example, if you've instructed Microsoft Sentinel to run a query every 5 minutes, you want to check whether that query is being performed, how it's performing, and whether there are any risks or vulnerabilities related to the query.

**Did an automation rule run as expected?**

[Did your automation rule run when it was supposed to](./monitor-automation-health.md)&mdash;that is, when its conditions were met? Did all the actions in the automation rule run successfully? 

**Did an analytics rule run as expected?**

[Did your analytics rule run when it was supposed to, and did it generate results](monitor-analytics-rule-integrity.md)? If you're expecting to see particular incidents in your queue but you don't, you want to know whether the rule ran but didn't find anything (or enough things), or didn't run at all.

**Were unauthorized changes made to an analytics rule?**

[Was something changed in the rule](monitor-analytics-rule-integrity.md)? You didn't get the results you expected from your analytics rule, and it didn't have any health issues. You want to see if any unplanned changes were made to the rule, and if so, what changes were made, by whom, from where, and when.


## Health and audit monitoring flow

To start collecting health and audit data, you need to [enable health and audit monitoring](enable-monitoring.md) in the Microsoft Sentinel settings. Then you can dive into the health and audit data that Microsoft Sentinel collects:

- Run queries on the *SentinelHealth* and *SentinelAudit* data tables from the Microsoft Sentinel **Logs** blade.
    - [Data connectors](monitor-data-connector-health.md#run-queries-to-detect-health-drifts)
    - [Automation rules and playbooks](monitor-automation-health.md#get-the-complete-automation-picture) (join query with Azure Logic Apps diagnostics)
    - [Analytics rules](monitor-analytics-rule-integrity.md#run-queries-to-detect-health-and-integrity-issues)

- Use the auditing and health monitoring workbooks provided in Microsoft Sentinel.
    - [Data connectors](monitor-data-connector-health.md#use-the-health-monitoring-workbook)
    - [Automation rules and playbooks](monitor-automation-health.md#use-the-health-monitoring-workbook)
    - [Analytics rules](monitor-analytics-rule-integrity.md#use-the-auditing-and-health-monitoring-workbook)

- Use Microsoft Sentinel's execution management tools to [monitor and optimize scheduled analytics rules' execution](monitor-optimize-analytics-rule-execution.md).

- Export the data into various destinations, like your Log Analytics workspace, archiving to a storage account, and more. Learn about the [supported destinations](../azure-monitor/essentials/diagnostic-settings.md) for your logs.

## Next steps

- [Turn on auditing and health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- [Monitor the health of your automation rules and playbooks](monitor-automation-health.md).
- [Monitor the health of your data connectors](monitor-data-connector-health.md).
- [Monitor the health and integrity of your analytics rules](monitor-analytics-rule-integrity.md).
- See more information about the [*SentinelHealth*](health-table-reference.md) and [*SentinelAudit*](audit-table-reference.md) table schemas.

See also:
- Using the [Microsoft Sentinel Solution for SAP](sap/solution-overview.md)? [Monitor its health](monitor-sap-system-health.md) too.
