---
title: Log Analytics agent data sources in Azure Monitor
description: Data sources define the log data that Azure Monitor collects from agents and other connected sources. This article describes how Azure Monitor uses data sources, explains how to configure them, and summarizes the different data sources available.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 10/19/2023
ms.reviewer: shseth

---

# Log Analytics agent data sources in Azure Monitor

The data that Azure Monitor collects from virtual machines with the legacy [Log Analytics](./log-analytics-agent.md) agent is defined by the data sources that you configure in the [Log Analytics workspace](../logs/data-platform-logs.md). Each data source creates records of a particular type. Each type has its own set of properties.

:::image type="content" source="media/agent-data-sources/overview.png" lightbox="media/agent-data-sources/overview.png" alt-text="Diagram that shows log data collection.":::

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

> [!IMPORTANT]
> The data sources described in this article apply only to virtual machines running the Log Analytics agent.

## Summary of data sources

The following table lists the agent data sources that are currently available with the Log Analytics agent. Each agent data source links to an article that provides information for that data source. It also provides information on their method and frequency of collection.

| Data source | Platform | Log Analytics agent | Operations Manager agent | Azure Storage | Operations Manager required? | Operations Manager agent data sent via management group | Collection frequency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Custom logs](data-sources-custom-logs.md) | Windows |&#8226; |  | |  |  | On arrival. |
| [Custom logs](data-sources-custom-logs.md) | Linux   |&#8226; |  | |  |  | On arrival. |
| [IIS logs](data-sources-iis-logs.md) | Windows |&#8226; |&#8226; |&#8226; |  |  |Depends on the Log File Rollover setting. |
| [Performance counters](data-sources-performance-counters.md) | Windows |&#8226; |&#8226; |  |  |  |As scheduled, minimum of 10 seconds. |
| [Performance counters](data-sources-performance-counters.md) | Linux |&#8226; |  |  |  |  |As scheduled, minimum of 10 seconds. |
| [Syslog](data-sources-syslog.md) | Linux |&#8226; |  |  |  |  |From Azure Storage is 10 minutes. From agent is on arrival. |
| [Windows Event logs](data-sources-windows-events.md) |Windows |&#8226; |&#8226; |&#8226; |  |&#8226; | On arrival. |

## Configure data sources

To configure data sources for Log Analytics agents, go to the **Log Analytics workspaces** menu in the Azure portal and select a workspace. Select **Legacy agents management**. Select the tab for the data source you want to configure. Use the links in the preceding table to access documentation for each data source and information on their configuration.

Any configuration is delivered to all agents connected to that workspace. You can't exclude any connected agents from this configuration.

:::image type="content" source="media/agent-data-sources/configure-events.png" lightbox="media/agent-data-sources/configure-events.png" alt-text="Screenshot that shows configuring Windows events.":::

## Data collection

Data source configurations are delivered to agents that are directly connected to Azure Monitor within a few minutes. The specified data is collected from the agent and delivered directly to Azure Monitor at intervals specific to each data source. See the documentation for each data source for these specifics.

For System Center Operations Manager agents in a connected management group, data source configurations are translated into management packs and delivered to the management group every 5 minutes by default. The agent downloads the management pack like any other and collects the specified data. Depending on the data source, the data will either be sent to a management server, which forwards the data to the Azure Monitor, or the agent will send the data to Azure Monitor without going through the management server.

For more information, see [Data collection details for monitoring solutions in Azure](../monitor-reference.md). You can read about details of connecting Operations Manager and Azure Monitor and modifying the frequency that configuration is delivered at [Configure integration with System Center Operations Manager](./om-agents.md).

If the agent is unable to connect to Azure Monitor or Operations Manager, it will continue to collect data that it will deliver when it establishes a connection. Data can be lost if the amount of data reaches the maximum cache size for the client, or if the agent can't establish a connection within 24 hours.

## Log records

All log data collected by Azure Monitor is stored in the workspace as records. Records collected by different data sources will have their own set of properties and be identified by their **Type** property. See the documentation for each data source and solution for details on each record type.

## Next steps

* Learn about [monitoring solutions](/previous-versions/azure/azure-monitor/insights/solutions) that add functionality to Azure Monitor and also collect data into the workspace.
* Learn about [log queries](../logs/log-query-overview.md) to analyze the data collected from data sources and monitoring solutions.
* Configure [alerts](../alerts/alerts-overview.md) to proactively notify you of critical data collected from data sources and monitoring solutions.
