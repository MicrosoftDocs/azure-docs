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
***\<THIS SECTION IS CONCEPTUAL>***

Microsoft Sentinel is a critical service for monitoring and ensuring your organization’s information security, so you’ll want to rest assured that it’s always running smoothly. You’ll want to be able to make sure that the service's many moving parts are always functioning as intended. You also might like to configure notifications of health drifts for relevant stakeholders who can take action. For example, you can configure email or Microsoft Teams messages to be sent to operations teams, managers, or officers, launch new tickets in your ticketing system, and so on.





- The service isn't being manipulated by unauthorized actions by users, internal or otherwise. 



This article describes how Microsoft Sentinel’s health and audit feature lets you monitor the activity of some of the service’s key resources and inspect logs of user actions within the service. 

## Description

This section describes the function and use cases of the health and audit components.



### Data storage
Health and audit data are collected in two tables in your Log Analytics workspace.

- Health data is collected in the *SentinelHealth* table.
- Audit data is collected in the *SentinelAudit* table.

The prevalent way you'll use this data is by querying these tables.



| Component | Table            | Description | Use cases | Supports resource |
| --------- | ---------------- | ----------- | --------- | ----------------- |
| Health    | *SentinelHealth* | Verifies that various Microsoft Sentinel resources performed as instructed. | Answers the question: **Is the resource running correctly?**<br><br> - Is the data connector receiving data? For example, if you've instructed Microsoft Sentinel to run a query every 5 minutes, you want to check whether that query is being performed, how it's performing, and whether there are any risks or vulnerabilities related to the query.    |• Data connectors<br>• Analytics rules |
|Audit    |*SentinelAudit*         |Checks various user actions against the Microsoft Sentinel service.         |Answers the question: **Who performed the action on the resource?**<br><br> For example, a user turned off a rule, and you want visibility into that action.         |Analytics rules |

Learn [how to use the health and audit feature](monitor-health-audit.md).

> [!IMPORTANT]
>
> The *SentinelHealth* and *SentinelAudit* data tables are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

For features that support both health and audit, health and audit are installed together (you can't use health or audit separately). For features that don't yet support audit, health is supported separately. See the table below for support details.

## Health and audit resources and support 

Health and audit monitoring supports these resources and options.

|Resource  |Uses |Health  |Audit |
|---------|---------|---------|---------|
|Data connectors     |• Monitor your connector health, viewing any service or data source issues, such as authentication, throttling, and more.<br>• Configure notifications for health drifts for relevant stakeholders who can take action. For example, configure email messages, Microsoft Teams messages, new tickets in your ticketing system, and so on. |Supported (Public preview)        |Not supported |
|Analytics rules     |TBD         |Supported (Public preview)       |Supported (Public preview) |

Learn [how to use the health and audit feature](monitor-health-audit.md).

## How Microsoft Sentinel presents health and audit data

To dive into the health and audit data that Microsoft Sentinel generates, you can:

- Run queries on the [*SentinelHealth*](monitor-health-audit.md#run-queries-to-detect-health-drifts) and [*SentinelAudit*](monitor-health-audit.md#run-queries-for-user-audit-analytics-rules) data tables from the Microsoft Sentinel **Logs** blade.
- Use the health monitoring workbook (for data connectors).
- Export the data into various destinations, like your Log Analytics workspace, archiving to a storage account, and more. Learn about the [supported destinations](../azure-monitor/essentials/diagnostic-settings.md) for your logs.
