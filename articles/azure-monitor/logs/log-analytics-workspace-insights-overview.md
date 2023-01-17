---
title: Log Analytics Workspace Insights
description: An overview of Log Analytics Workspace Insights - ingestion, usage, health, agents, and more.
services: azure-monitor 
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: noakuper
ms.date: 06/27/2022

---

# Log Analytics Workspace Insights

Log Analytics Workspace Insights provides comprehensive monitoring of your workspaces through a unified view of your workspace usage, performance, health, agent, queries, and change log. This article helps you understand how to onboard and use Log Analytics Workspace Insights.

## Overview your Log Analytics workspaces

When you access Log Analytics Workspace Insights through Azure Monitor Insights, the **At scale** perspective is shown. Here you can:

- See how your workspaces are spread across the globe.
- Review their retention.
- See color-coded capping and license details.
- Choose a workspace to see its insights.

:::image type="content" source="media/log-analytics-workspace-insights-overview/at-scale.png" alt-text="Screenshot that shows a Log Analytics Workspace Insights list of workspaces." lightbox="media/log-analytics-workspace-insights-overview/at-scale-expanded.png":::

To launch Log Analytics Workspace Insights at scale:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Monitor** from the pane on the left in the Azure portal. Under the **Insights Hub** section, select **Log Analytics Workspace Insights**.

## View Insights for a Log Analytics workspace

You can use Insights in the context of a specific workspace to display rich data and analytics of the workspace performance, usage, health, agents, queries, and changes.

:::image type="content" source="media/log-analytics-workspace-insights-overview/at-resource.png" alt-text="Screenshot that shows Log Analytics Workspace Insights overview." lightbox="media/log-analytics-workspace-insights-overview/at-resource.png":::

To access Log Analytics Workspace Insights:

1. Open Log Analytics Workspace Insights from Azure Monitor (as explained).

1. Select a workspace to drill into.

Or you can use these steps:

1. In the Azure portal, select **Log Analytics Workspaces**.

1. Choose a Log Analytics workspace.

1. Under **Monitoring**, select **Insights** on the workspace menu.

The data is organized in tabs. The time range on top defaults to 24 hours and applies to all tabs. Some charts and tables use a different time range, as indicated in their titles.

## Overview tab

On the **Overview** tab, you can see:

* Main statistics and settings:
    - The monthly ingestion volume of the workspace.
    - How many machines sent heartbeats. That is, the machines that are connected to this workspace in the selected time range.
    - Machines that haven't sent heartbeats in the last hour in the selected time range.
    - The data retention period set.
    - The daily cap set and how much data was already ingested on the recent day.

* Top five tables: Charts that analyze the five most-ingested tables over the past month.
    - Volume of data ingested to each table.
    - The daily ingestion to each of them to visually display spikes or dips.
    - Ingestion anomalies: A list of identified spikes and dips in ingestion to these tables.

## Usage tab

This tab provides a dashboard display.

### Usage dashboard

This tab provides information on the workspace's usage. The dashboard subtab shows ingestion data displayed in tables. It defaults to the five most-ingested tables in the selected time range. These same tables are displayed on the **Overview** page. Use the **Workspace Tables** dropdown to choose which tables to display.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-usage.png" alt-text="Screenshot that shows the workspace Usage tab." lightbox="media/log-analytics-workspace-insights-overview/workspace-usage.png":::

* Main grid: Here you can see tables grouped by solutions and information about each table:
    - How much data was ingested to it during the selected time range.
    - The percentage this table takes, from the entire ingestion volume during the selected time range: This information helps identify the tables that affect your ingestion the most. In the following screenshot, you can see AzureDiagnostics and ContainerLog alone stand for more than two-thirds (64%) of the data ingested to this workspace.
    - When was the last update of usage statistics regarding each table: We normally expect usage stats to refresh hourly. Refreshing usage statistics is a recurrent service-internal operation. A delay in refreshing that data is only noted so that you would know to interpret the data correctly. There's no action you (as a user) should take.
    - Billable: Indicates which tables are billed for and which are free.

* Table-specific details:

    At the bottom of the page, you can see detailed information on the table selected in the main grid.
    - Ingestion volume: How much data was ingested to the table from each resource and how it spreads over time. Resources ingesting more than 30% of the total volume sent to this table are marked with a warning sign.
    - Ingestion latency: How much time ingestion took, analyzed for the 50th, 90th, or 95th percentiles of requests sent to this table. The top chart in this area depicts the total ingestion time of the requests (for the selected percentile) from end to end - from the time the event occurred, and until it was ingested to the workspace.
    The chart below it shows separately the latency of the agent, which is the time it took the agent to send the log to the workspace. The chart also shows the latency of the pipeline, which is the time it took the service to process the data and push it to the workspace.
    :::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-usage-ingestion-latency.png" alt-text="Screenshot that shows the workspace usage ingestion latency subtab." lightbox="media/log-analytics-workspace-insights-overview/workspace-usage-ingestion-latency.png":::

### Additional usage queries

The **Additional Queries** subtab exposes queries that run across all workspace tables (instead of relying on the usage metadata, refreshed hourly). Because their queries are much more extensive and less efficient, they aren't run automatically. They can surface interesting information about which resources send most logs to the workspace and perhaps affect billing.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-usage-additional-queries.png" alt-text="Screenshot that shows the workspace usage Additional Queries tab." lightbox="media/log-analytics-workspace-insights-overview/workspace-usage-additional-queries.png":::

One such query is **What Azure resources send most logs to this workspace** (showing top 50).
In our demo workspace, you can clearly see that three Kuberbetes clusters send far more data than all other resources combined. One cluster loads the workspace the most.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-usage-additional-query-run.png" alt-text="Screenshot that shows the workspace usage Additional Queries tab with the results of an additional query." lightbox="media/log-analytics-workspace-insights-overview/workspace-usage-additional-query-run.png":::

## Health tab

This tab shows the workspace health state, when it was last reported, and operational [errors and warnings](../logs/monitor-workspace.md) retrieved from the `_LogOperation` table. For more information on the listed issues and mitigation steps, see [Monitor health of a Log Analytics workspace in Azure Monitor](../logs/monitor-workspace.md#categories).

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-health.png" alt-text="Screenshot that shows the workspace Health tab." lightbox="media/log-analytics-workspace-insights-overview/workspace-health.png":::

## Agents tab

This tab provides information on the agents that sends logs to this workspace.
:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-agents.png" alt-text="Screenshot that shows the workspace Agents tab." lightbox="media/log-analytics-workspace-insights-overview/workspace-agents.png":::

* Operation errors and warnings: these are errors and warning related specifically to agents. They are grouped by the error/warning title to help you get a clearer view of different issues that may occur, but can be expanded to show the exact times and resources they refer to. Also note you can click 'Run query in Logs' to query the _LogOperation table through the Logs experience, see the raw data and analyze if further.
* Workspace agents: these are the agents that sent logs to the workspace during the selected time range. You can see the agents' types and health state. Agents marked healthy aren't necessarily working well - it only indicated they sent a heartbeat during the last hour. A more detailed health state is detailed in the below grid.
* Agents activity: This grid shows information on either all agents, healthy or unhealthy agents. Here too "Healthy" only indicates the agent sent a heartbeat during the last hour. To understand its state better, review the trend shown in the grid. It shows how many heartbeats this agent sent over time. The true health state can only be inferred if you know how the monitored resource operates. For example, if a computer is intentionally shut down at particular times, you can expect the agent's heartbeats to appear intermittently, in a matching pattern.

## Query Audit tab

Query auditing creates logs about the execution of queries on the workspace. If enabled, this data is greatly beneficial to understanding and improving queries performance, efficiency, and load. To enable query auditing on your workspace or learn more about it, see [Audit queries in Azure Monitor Logs](../logs/query-audit.md).

#### Performance

This tab shows:

* Query duration: 95th percentile and 50th percentile (median) duration in ms, over time.
* Number of rows returned: 95th percentile and 50th percentile (median) of rows count, over time.
* The volume of data processed: 95th percentile, 50th percentile, and the total of processed data in all requests, over time.
* Response codes: the distribution of response codes to all queries in the selected time range.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-query-audit-performance.png" alt-text="Screenshot that shows the Query Audit tab performance subtab.]" lightbox="media/log-analytics-workspace-insights-overview/workspace-query-audit-performance.png":::

### Slow and inefficient queries
This **Slow & Inefficient Queries** subtab shows two grids to help you identify slow and inefficient queries you might want to rethink. These queries shouldn't be used in dashboards or alerts because they'll create unneeded chronic load on your workspace.
* Most resource-intensive queries: The 10 most CPU-demanding queries, along with the volume of data processed (KB), the time range, and the text of each query.
* Slowest queries: The 10 slowest queries, along with the time range and text of each query.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-query-audit-slow-queries.png" alt-text="Screenshot that shows the Query Audit tab and the Slow & Inefficient Queries subtab." lightbox="media/log-analytics-workspace-insights-overview/workspace-query-audit-slow-queries.png":::

### Query users
The **Users** subtab shows user activity against this workspace:

* Queries by user: How many queries each user ran in the selected time range.
* Throttled users: Users that ran queries that were throttled (due to over-querying the workspace).

## Change Log tab

This tab shows configuration changes made on the workspace during the last 90 days regardless of the time range selected. It also shows who made the changes. It's intended to help you monitor who changes important workspace settings, such as data capping or workspace license.

:::image type="content" source="media/log-analytics-workspace-insights-overview/workspace-change-log.png" alt-text="Screenshot that shows the workspace Change Log tab." lightbox="media/log-analytics-workspace-insights-overview/workspace-change-log.png":::

## Next steps

To learn the scenarios that workbooks are designed to support and how to author new and customize existing reports, see [Create interactive reports with Azure Monitor workbooks](../visualize/workbooks-overview.md).
