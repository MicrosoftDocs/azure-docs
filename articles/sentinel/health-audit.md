---
title: Health monitoring in Microsoft Sentinel 
description: Learn about the Microsoft Sentinel health and audit feature, which monitors service health drifts and user actions.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 08/19/2022
ms.service: microsoft-sentinel
---

# Health monitoring in Microsoft Sentinel 

Microsoft Sentinel is a critical service for monitoring and ensuring your organization’s information security, so you’ll want to rest assured that it’s always running smoothly. You’ll want to be able to make sure that the service's many moving parts are always functioning as intended. You also might like to configure notifications of health drifts for relevant stakeholders who can take action. For example, you can configure email or Microsoft Teams messages to be sent to operations teams, managers, or officers, launch new tickets in your ticketing system, and so on.

This article describes how Microsoft Sentinel’s health monitoring feature lets you monitor the activity of some of the service’s key resources. 

## Description

This section describes the function and use cases of the health monitoring components.

### Data storage

Health data is collected in the *SentinelHealth* table in your Log Analytics workspace. The prevalent way you'll use this data is by querying the table.

> [!IMPORTANT]
>
> - The *SentinelHealth* data table is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> 
> - When monitoring the health of **playbooks**, you'll also need to capture Azure Logic Apps diagnostic events from your playbooks, in addition to the *SentinelHealth* data, in order to get the full picture of your playbook activity.  Azure Logic Apps diagnostic data is collected in the *AzureDiagnostics* table in your workspace.

### Use cases

**Is the data connector running correctly?**

[Is the data connector receiving data](./monitor-data-connector-health.md)? For example, if you've instructed Microsoft Sentinel to run a query every 5 minutes, you want to check whether that query is being performed, how it's performing, and whether there are any risks or vulnerabilities related to the query.

**Did an automation rule run as expected?**

[Did my automation rule run when it was supposed to](./monitor-automation-health.md) - that is, when its conditions were met? Did all the actions in the automation rule run successfully? 

## How Microsoft Sentinel presents health data

To dive into the health data that Microsoft Sentinel generates, you can:

- Run queries on the *SentinelHealth* data table from the Microsoft Sentinel **Logs** blade.
    - [Data connectors](monitor-data-connector-health.md#run-queries-to-detect-health-drifts)
    - [Automation rules and playbooks](monitor-automation-health.md#get-the-complete-automation-picture) (join query with Azure Logic Apps diagnostics)

- Use the health monitoring workbooks provided in Microsoft Sentinel.
    - [Data connectors](monitor-data-connector-health.md#use-the-health-monitoring-workbook)
    - [Automation rules and playbooks](monitor-automation-health.md#use-the-health-monitoring-workbook)

- Export the data into various destinations, like your Log Analytics workspace, archiving to a storage account, and more. Learn about the [supported destinations](../azure-monitor/essentials/diagnostic-settings.md) for your logs.

## Next steps
- [Turn on health monitoring](enable-monitoring.md) in Microsoft Sentinel.
- Monitor the health of your [automation rules and playbooks](monitor-automation-health.md).
- Monitor the health of your [data connectors](monitor-data-connector-health.md).
- See more information about the [*SentinelHealth* table schema](health-table-reference.md).
