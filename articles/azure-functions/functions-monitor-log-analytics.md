---
title: Monitoring Azure Functions with Azure Monitor Logs
description: Learn how to use Azure Monitor Logs with Azure Functions to monitor function executions.
author: ahmedelnably
manager: gwallace
ms.service: azure-functions
ms.topic: conceptual
ms.date: 09/16/2019
ms.author: aelnably
# Customer intent: As a developer, I want to monitor my functions so I can know if they're running correctly.
---

# Monitoring Azure Functions with Azure Monitor Logs

[Azure Functions](functions-overview.md) offers an integration with [Azure Monitor Logs](../azure-monitor/platform/data-platform-logs.md) to monitor functions. This article shows you how to configure Azure Functions to send system-generated and user-generated logs to Azure Monitor Logs..

Azure Monitor Logs gives you the ability to consolidate logs from different resources in the same workspace, where it can be analyzed with [queries](../azure-monitor/log-query/log-query-overview.md) to quickly retrieve, consolidate, and analyze collected data.  You can create and test queries using [Log Analytics](../azure-monitor/log-query/portals.md) in the Azure portal and then either directly analyze the data using these tools or save queries for use with [visualizations](../azure-monitor/visualizations.md) or [alert rules](../azure-monitor/platform/alerts-overview.md).

Azure Monitor uses a version of the [Kusto query language](/azure/kusto/query/) used by Azure Data Explorer that is suitable for simple log queries but also includes advanced functionality such as aggregations, joins, and smart analytics. You can quickly learn the query language using [multiple lessons](../azure-monitor/log-query/get-started-queries.md).

> [!NOTE]
> Integration with Azure Monitor Logs is currently supported for Windows Consumption, Premium, and Dedicated tiers of Azure Functions

## Setting up

TODO: go through the different screens to setup sending logs to a log analytics workspace. Need to wait for new portal + ANT 85 for that as a new table name will show up, screen shots provided for extra clarity

From the Monitoring section, select **Diagnostic settings** and the click **Add**

![Add a diagnostic setting](media/functions-monitor-log-analytics/diagnostic-settings-add.png)

In the setting page, choose **Send to Log Analytics**, and under **LOG** choose the **insert new name here** table name, this table contains the desired logs.

![Add a diagnostic setting](media/functions-monitor-log-analytics/choose-table.png)

## User generated logs

TODO: go through the different languages and have an example for emitting logs or exceptions 

**JavaScript**

**Python**

**.NET**

**Java**

**PowerShell**

## Querying the logs

To query the generated logs, go to the log analytics workspace and click **Logs**

![Query window in LA workspace](media/functions-monitor-log-analytics/querying.png)

Azure Functions write all logs to **table-name** table, here are some sample queries

QUESTION: should we have the different column names of the table here?

TODO: show sample queries

**Function App logs**

TODO: sample query

**Function App platform logs (Host Logs)**

TODO: sample query

**A specific function logs**

TODO: sample query

**Exceptions**

TODO: sample query

## Next steps

- Review the [Azure Functions overview](functions-overview.md)
- Learn more about [Azure Monitor Logs](../azure-monitor/platform/data-platform-logs.md)
- Learn more about the [query language](../azure-monitor/log-query/get-started-queries.md).
