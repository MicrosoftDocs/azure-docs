---
title: Enhance reslience by replicating your Log Analytics workspace across regions
description: Use the workspace replication feature in Log Analytics to create copies of a workspace in different regions for data resiliency.
ms.topic: how-to
author: noakup
ms.author: noakuper
ms.date: 04/26/2024
ms.custom: references_regions 

# Customer intent: As a Log Analytics workspace administrator, I want to replicate my workspace across regions to protect and continue to access my log data in the event of a regional failure.
---

# Enhance reslience by replicating your Log Analytics workspace across regions

Replicating your Log Analytics workspace across regions enhances resilience by enabling you to switch over to the replicated workspace and continue operations in the event of a regional failure. Your original workspace and region are referred to as the **primary**. The replicated workspace and alternate region are referred to as the **secondary**.

This article explains how Log Analytics workspace replication works, how to replicate your workspace, and how to switch over and back.

## Permissions required

| Action | Permissions required |
| --- | --- |
| Enable workspace replication | `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](manage-access.md#log-analytics-contributor), for example |
| Trigger switchover | `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspace at the **resource group level**, as provided by the [Log Analytics Contributor built-in role](manage-access.md#log-analytics-contributor), for example |
| Trigger switchover | `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspace at the **resource group level**, as provided by the [Log Analytics Contributor built-in role](manage-access.md#log-analytics-contributor), for example |
| Check workspace state | `Microsoft.OperationalInsights/workspaces/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](manage-access.md#log-analytics-reader), for example |

## How Log Analytics workspace replication works

The workspace replication process creates an instance of your workspace in the secondary region. The process creates the secondary workspace with the same configuration as your primary workspace, and Azure Monitor automatically updates the secondary workspace with any future changes you make to your primary workspace configuration. 

The secondary workspace is a "shadow" workspace for resiliency purposes only. You can’t see the secondary workspace in the Azure portal, and you can't manage or access it directly.

When you enable workspace replication, Azure Monitor sends new logs ingested to your primary workspace to your secondary region also. Logs you ingest to the workspace before you enable workspace replication aren’t copied over. 

If an outage affects your primary region, you can trigger switchover to reroute all ingestion and query requests to your secondary region. After you mitigate the outage and restore your primary workspace, you can switch back over to your primary region.

When you switch over, the secondary workspace becomes active and your primary becomes inactive. Azure Monitor then ingests new data through the ingestion pipeline in your secondary region, rather than the primary region. During switchover, Azure Monitor replicates all data you ingest from the secondary region to the primary region. The process is asynchronous and doesn't affect your ingestion latency.

> [!IMPORTANT]
> If the primary region can't process incoming log data, Azure Monitor buffers the data in the secondary region for up to 11 days. During the first four days, Azure Monitor automatically reattempts to replicate the data periodically. If your primary workspace isn't functional for a longer period, contact Microsoft to initiate replication.

:::image type="content" source="media/workspace-replication/log-analyics-workspace-replication-ingestion-flows.png" alt-text="Diagram that shows ingestion flows during normal and switchover modes." lightbox="media/workspace-replication/log-analyics-workspace-replication-ingestion-flows.png" border="false":::


### Supported regions

Workspace replication is currently supported for workspaces in a limited set of regions, organized by region groups (groups of geographically adjacent regions). When you enable replication, select a secondary location from the list of supported regions in the same region group as the workspace primary location. For example, a workspace in West Europe can be replicated in North Europe, but not in West US 2, since these regions are in different region groups. 

These region groups and regions are currently supported:

| Region group | Regions | JSON value | Notes |
| --- | --- | --- | --- |
| **US (United States)** | East US | `eastus`  | Replication isn't supported to or from the East US 2 region. |
|                        | East US 2 | `eastus2` | Replication isn't supported to or from the East US region. |
|                        | West US 2 | `westus2` | 
| **European**           | West Europe  | `westeurope`  |
|                        | North Europe | `northeurope` |

### Data residency requirements

Different customers have different data residency requirements, so it's important that you control where your data is stored. Azure Monitor process and stores logs in the primary and secondary regions that you choose. For more information, see [Supported regions and region groups](#support-for-regions-and-region-groups).

### Support for Sentinel and other services

Various services and features that use Log Analytics workspaces are compatible with workspace replication and switchover. These services and features continue to work when you switch over to a replicated workspace in another region.

For example, regional network issues that cause log ingestion latency can impact Sentinel customers. Customers that use replicated workspaces can switch over to their secondary region to continue working with their Log Analytics workspace and Sentinel. However, if the network issue impacts the Sentinel service health, switching to another region doesn't mitigate the issue.

Some Azure Monitor experiences, including Azure Application Insights and Azure Virtual Machines Insights, are currently only partially compatible with workspace replication and switchover. For the full list, see [Restrictions and limitations](#restrictions-and-limitations).

## Enable and disable workspace replication

You enable and disable workspace replication by using a REST command. The command triggers a long running operation, which means that it can take a few minutes for the new settings to apply. After you enable replication, it can take up to one hour for all data types to begin replicating, and some data types might start replicating before others. Changes you make to table schemas after you enable workspace replication - for example, new custom log tables or custom fields you create, or diagnostic logs set up for new resource types - can take up to one hour to start replicating.

### Enable workspace replication

To enable replication on your Log Analytics workspace, use this `PUT` command:

```http
PUT 

https://management.azure.com/subscriptions/<subscription_id>/resourcegroups/<resourcegroup_name>/providers/microsoft.operationalinsights/workspaces/<workspace_name>?api-version=2023-01-01-preview

body:
{
    "properties": {
        "replication": {
            "enabled": true,
            "location": "<secondary_location>"
        }
    },
    "location": "<primary_location>"
}
```

Where:

- `<subscription_id>`: Your account subscription ID.
- `<resourcegroup_name>` : The resource group that contains your Log Analytics workspace resource.
- `<workspace_name>`: The name of your workspace.
- `<primary_location>`: The primary region for your Log Analytics workspace.
- `<secondary_location>`: The region to switch to when the primary workspace region isn't healthy.

For the allowed region values, see [Supported regions and region groups](#support-for-regions-and-region-groups).

The `PUT` command is a long running operation that can take some time to complete. A successful call returns a `200` status code. You can track the provisioning state of your request, as described in [Check workspace state](#check-workspace-state).

### Check workspace replication provisioning state

To check the Log Analytics workspace replication provisioning state, run this `GET` command:

```http
GET
https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/<resourcegroup_name>/providers/Microsoft.OperationalInsights/workspaces/<workspace_name>?api-version=2023-01-01-preview
```

Where:

- `<subscription_id>`: Your account subscription ID.
- `<resourcegroup_name>`: The resource group that contains your Log Analytics workspace resource.
- `<workspace_name>`: The name of your Log Analytics workspace.
 
The `GET` command verifies that the workspace provisioning state changes from `Updating` to `Succeeded`, and the secondary region is set as expected.


> [!NOTE]
> When you enable replication for workspaces that interact with Sentinel, it can take up to 12 days to fully replicate Watchlist and Threat Intelligence data to the secondary workspace.

### Associate data collection rules with the system data collection endpoint

You use [data collection rules (DCR)](../essentials/data-collection-rule-overview.md) to collect log data using Azure Monitor Agent and the Logs Ingestion API.

If you have data collection rules that send data to your primary workspace, you need to associate them to a system [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md), which Azure Monitor creates when you enable replication on your workspace. The name of the system data collection endpoint is identical to your workspace ID. Only data collection rules you associate to the workspace's system data collection endpoint enable replication and switchover. This behavior lets you specify the set of log streams to replicate, which helps you control your replication costs.

To replicate data you collect using data collection rules, associate your data collection rules to the system data collection endpoint for your Log Analytics workspace:

1. In the Azure portal, select **Data collection rules**.
1. From the **Data collection rules** screen, select a data collection rule that sends data to your primary Log Analytics workspace.
1. On the data collection rule **Overview** page, select **Configure DCE** and select the system data collection endpoint from the available list:

   :::image type="content" source="media/workspace-replication/configure-dce.png" alt-text="Screenshot that shows how to configure a data collection endpoint for an existing data collection rule in the Azure portal." lightbox="media/workspace-replication/configure-dce.png":::
   For details about the System DCE, check the workspace object properties.

> [!IMPORTANT]
> - If you use data collection rules to send logs to your workspace, you must connect each data collection rule to the newly created data collection endpoint to support replication and switchover.
> - Data collection rules connected to a workspace's system data collection endpoint can target only that specific workspace. The data collection rules **must not** target other destinations, such as other workspaces or Azure Storage accounts.

### Disable workspace replication

To disable replication for a workspace, use this `PUT` command:

```http
PUT 

https://management.azure.com/subscriptions/<subscription_id>/resourcegroups/<resourcegroup_name>/providers/microsoft.operationalinsights/workspaces/<workspace_name>?api-version=2023-01-01-preview

body:
{
    "properties": {
        "replication": {
            "enabled": false
        }
    },
    "location": "<primary_location>"
}
```

Where:

- `<subscription_id>`: Your account subscription ID.
- `<resourcegroup_name>` : The resource group that contains your workspace resource.
- `<workspace_name>`: The name of your workspace.
- `<primary_location>`: The primary region for your workspace.

The `PUT` command is a long running operation that can take some time to complete. The call to the command returns 200. You can track the process, as described in [Check workspace state](#check-workspace-state).

## Monitor workspace and service health

Ingestion latency or query failures are examples of issues that can often be handled by failing over to your secondary region. Such issues can be detected by using Service Health notifications and log queries.

Service Health notifications are useful for service-related issues. To identify issues impacting your specific workspace (and possibly not the entire service), you can use other measures:

- [Create alerts based on the workspace resource health](log-analytics-workspace-health.md#view-log-analytics-workspace-health-and-set-up-health-status-alerts)
- Set your own thresholds for [workspace health metrics](log-analytics-workspace-health.md#view-log-analytics-workspace-health-metrics)
- Create your own monitoring queries to serve as custom health indicators for your workspace, as described in [Use queries to monitor workspace performance](#use-queries-to-monitor-workspace-performance), to:
   - Measure ingestion latency per table
   - Identify whether the source of latency is the collection agents or the ingestion pipeline
   - Monitor ingestion volume anomalies per table and resource
   - Monitor query success rate per table, user, or resource
   - Create alerts based on your queries

> [!NOTE]
> You can also use log queries to monitor your secondary workspace, but keep in mind that logs replication is done in batch operations. The measured latency can fluctuate and doesn't indicate any health issue with your secondary workspace. For more information, see [Audit the inactive workspace](#audit-the-inactive-workspace).

## Switch over to the secondary workspace

During switchover, most operations work the same as when you use the primary workspace and region. However, some operations have slightly different behavior or are blocked.

### When should I switch over and switch back?

You decide when to switch over to your secondary workspace and switch back to your primary workspace based on ongoing performance and health monitoring and your system standards and requirements. 

There are several points to consider in your plan for switchover:

- Type and scope of the issue
- Duration of the issue, momentary or continuous
- Data available in your secondary workspace

The following sections explore these considerations.

#### Issue type and scope

The switchover process routes ingestion and query requests to your secondary region, which usally bypasses any faulty component that might be causing latency or failure on your primary region. As a result, switchover isn't likely to help if:

- There's a cross-regional issue with an underlying resource. For example, if the same resource types fail in both your primary and secondary regions.
- You experience an issue related to workspace management, such as changing workspace retention. Workspace management operations are always handled in your primary region. During switchover, workspace management operations are blocked.

#### Issue duration

Switchover isn't instantaneous. The process of rerouting requests relies on DNS updates, which some clients pick up within minutes while others can take more time. Therefore, it's helpful to understand whether the issue can be resolved within a few minutes. If the observed issue is consistent or continuous, don't wait to switch over. Here are some examples:

- **Ingestion**: Issues with the ingestion pipeline in your primary region can affect data replication to your secondary workspace. During switchover, logs are instead sent to the ingestion pipeline in the secondary region.

- **Query**: If queries in your primary workspace fail or timeout, Log search alerts can be affected. In this scenario, trigger switchover to make sure all your alerts are triggered correctly.

#### Secondary workspace data

When you enable replication, all logs ingested to your primary workspace eventually (and asynchronously) replicate to your secondary workspace. Logs ingested to your primary workspace before you enable replication aren't copied to the secondary workspace. If you enabled workspace replication three hours ago and you now trigger switchover, your queries can only return data from the last three hours.

## Trigger switchover

Before you trigger switchover, [confirm that the workspace replication operation completed successfully](#check-workspace-replication-provisioning-state). Switchover only succeeds when the secondary workspace is configured correctly. 

To switch over to your secondary workspace, use this `POST` command:

```http
POST 
https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/<resourcegroup_name>/providers/Microsoft.OperationalInsights/locations/<secondary_location>/workspaces/<workspace_name>/failover?api-version=2023-01-01-preview
```

Where:

- `<subscription_id>`: Your account subscription ID.
- `<resourcegroup_name>` : The resource group that contains your workspace resource.
- `<secondary_location>`: The region to switch to during switchover.
- `<workspace_name>`: The name of the workspace to switch to during switchover.

The `POST` command is a long running operation that can take some time to complete. The call to the command returns 202. You can track the process, as described in [Check workspace state](#check-workspace-state).

### Client behavior during switchover

Log ingestion to your primary workspace can use different types of clients, including MMA (legacy), Azure Monitor Agent, code (by using the HTTP data collection API), custom logs, and other services, such as Sentinel. All ingestion requests sent while the primary workspace is in switchover reroute to your secondary region for processing. Rerouting is accomplished by updating the DNS mapping of the ingestion endpoints.

After the DNS records update, most clients resume routing to the primary workspace endpoints within minutes. Some HTTP clients might have "sticky connections" that can take more time to create new connections. During switchover, these clients might attempt to ingest logs through the primary region for some time.

#### Azure Monitor Agent 

Azure Monitor Agent uses DCRs to send logs to the workspace. When you enable workspace replication, a special System DCE is created with the required configuration according to the workspace object properties.

To configure traffic from Azure Monitor Agent to support switchover, you need to manually update your DCRs to use this System DCE. DCRs that point to a System DCE must not send logs to any destination except the workspace that owns the DCE.

> [!WARNING]
> When Azure Monitor Agent uses DCRs that don't point to the workspace DCE, the DCRs don't receive the replication settings. As a result, logs collected by these DCRs aren't replicated and aren't available during switchover.

### Restrictions and limitations

Before you switch regions during switchover, your secondary workspace needs to contain a useful volume of logs. The recommendation is to wait at least one week after you enable replication and before you trigger switchover. The seven days allow for sufficient data to be available on your secondary region.

Here are some other considerations:

- When you enable replication for workspaces that interact with Sentinel, it can take up to 12 days to fully replicate Watchlist and Threat Intelligence data to the secondary workspace.

- During switchover, workspace management operations aren't supported, including:
   - Change workspace retention, pricing tier, daily cap, and so on
   - Change network settings
   - Change schema through new custom logs or connecting platform logs from new resource providers, such as sending diagnostic logs from a new resource type
   - Any other management operation of the workspace

- The solution targeting capability of MMA agents isn't supported during switchover.

   > [!WARNING]
   > Because solution targeting can't work during switchover, solutions data is ingested from **all** agents during switchover.

The following features are partially supported or not currently supported:

| Feature | Support | Notes |
| --- | --- | --- |
| Search jobs, Restore | Partial support| Both search jobs and restore operations create tables and populate them with the operation outputs (the search results or restored data). After you enable workspace replication, new tables created for these operations in the future replicate to your secondary workspace. Tables populated **before** you enable replication aren't replicated. If these operations are in progress when you trigger switchover, the outcome is unexpected. It might complete successfully but not replicate, or it might fail, depending on your workspace health and the exact timing. |
| Azure Application Insights over Log Analytics workspaces | Partial support | |
| Azure Virtual Machines Insights | Partial support | |
| Container Insights | Partial support | |
| Private links | No current support | |

## Explore failback for replicated workspaces

The failback process cancels the rerouting of queries and log ingestion requests to the secondary workspace that are implemented during switchover. When you trigger failback, routing of queries and log ingestion requests returns to your primary workspace. 

During switchover, logs ingest to your secondary workspace and then (asynchronously) replicate to your primary workspace. While switchover is in progress, if an outage impacts the log ingestion process on the primary region, it can take time for the logs to complete the ingestion process.

There are several points to consider in your plan for failback:

- Complete replication for logs ingested during switchover
- No outstanding Service Health notifications
- Proper logs ingestion and query processing

The following sections explore these considerations.

### Logs ingestion replication state

Before you trigger failback, verify all logs ingested during switchover complete their replication to the primary region. If you fail back before all logs replicate to the primary workspace, your queries might return partial results until log ingestion completes.

You can query your primary workspace in the Azure portal for the inactive region and check the replication status for each log. For more information, see [Audit the inactive workspace](#audit-the-inactive-workspace).

### Primary workspace health

There are two important health items to check in preparation for failback to your primary workspace:

- Confirm there are no outstanding Service Health notifications for the primary workspace and region.
- Confirm your primary workspace is ingesting logs and processing queries as expected.

For examples on how to query your primary workspace during switchover, and bypass the rerouting of requests to your secondary workspace, see [Audit the inactive workspace](#audit-the-inactive-workspace).

## Trigger failback

Before you trigger failback, confirm the [Primary workspace health](#primary-workspace-health) and complete [replication of logs ingestion](#logs-ingestion-replication-state). 

The failback process updates your DNS records. After the DNS records update, it can take extra time for all clients to receive the updated DNS settings and resume routing to the primary workspace.

You trigger failback by using a `POST` command with the following values:

- `<subscription_id>`: Your account subscription ID.
- `<resourcegroup_name>` : The resource group that contains your workspace resource.
- `<workspace_name>`: The name of the workspace to switch to during failback.

The `POST` command is a long running operation that can take some time to complete. The call to the command returns 202. You can track the process, as described in [Check workspace state](#check-workspace-state).

The following code demonstrates the `POST` command:

```http
POST
https://management.azure.com/subscriptions/<subscription_id>/resourceGroups/<resourcegroup_name>/providers/Microsoft.OperationalInsights/workspaces/<workspace_name>/failback?api-version=2023-01-01-preview

Expected response: 202 Accepted
```

## Audit the inactive workspace

By default, queries that target your workspace are sent to the _active_ region. The active region is typically your primary region in your primary workspace. When the primary workspace is in switchover, the secondary workspace is in use and the primary region is _inactive_. The secondary region is then active and handles all queries.

In some scenarios, you might want to intentionally query the _inactive_ region. A common use is to check the secondary workspace before you trigger switchover for your primary workspace. You want to ensure your secondary workspace has complete replication of ingested logs before initiating switchover.

### Enable query of inactive region

Follow these steps to query the available logs on the inactive workspace:

1. In the Azure portal, go to your workspace.

1. On the left, select **Logs**.

1. On the query toolbar, select **More options** (...) at the right.

1. In the dropdown menu, enable the **Query inactive region** option:

   :::image type="content" source="media/workspace-replication/query-inactive-region.png" alt-text="Screenshot that shows how to query the inactive region through the workspace Logs page in the Azure portal." lightbox="media/workspace-replication/query-inactive-region.png":::

After you enable the **Query inactive region** option, the queries update to show log results for the inactive region rather than the active region.

When your workspace is in switchover, queries route to the secondary region as the active region. If you enable the **Query inactive region** option in this scenario, the queries show log results for the primary region because it's currently inactive.

### Use LAQueryLogs schema properties

Query auditing lets you discover the workspace region target for a query. You can also determine whether the workspace was in switchover during the query.

To support query auditing, the following properties are available in the LAQueryLogs schema:

- `isWorkspaceInFailover`: Indicates whether the workspace was in switchover mode during the query. The data type is Boolean (True, False).
- `workspaceRegion`: The region of the workspace targeted by the query. The data type is String.

## Use queries to monitor workspace performance

You can monitor your workspace by using queries to create alert rules. The queries can send you notifications about possible workspace health or performance issues. The results can you help determine whether to trigger switchover for your workspace.  

In the query rule, you can define a condition to trigger switchover after a specified number of violations occurs. For more information, see [Create or edit an alert rule](../alerts/alerts-create-metric-alert-rule.yml).

Two significant measurements of workspace performance include _ingestion latency_ and _ingestion volume_. The following sections explore these monitoring options.

### Understand ingestion latency monitoring

Ingestion latency measures the time required to ingest logs to the workspace. The time measurement starts from the initial log ingestion event and ends when the log is stored in your workspace. The total ingestion latency is composed of two parts:

- **Agent latency**: The time required by the agent to report an event.
- **Ingestion pipeline (backend) latency**: The time required for the ingestion pipeline to process the logs and write them to your workspace.

Different data types have different ingestion latency. A general measurement might satisfy your needs or a separate ingestion measurement for each data type might be more helpful. You can create a generic query for all types and a more fine-grained query for specific types that are of higher priority to your scenario. A common preference is to measure the 90th percentile of the ingestion latency, which is more sensitive to change than the average or the 50th percentile (median).

The following sections demonstrate a series of queries that you can use to check the ingestion latency for your workspace. 

#### Evaluate baseline ingestion latency

To start measuring your workspace performance, a good first step is to query the baseline ongoing latency of the specific data types (tables) over several days.

The following query creates a chart of the 90th percentile of ingestion latency on the Perf table. After you run the query, review the rendered chart and table to determine the expected latency for that data type.

```kusto
// assess the ingestion latency baseline for each data type
Perf
| where TimeGenerated > ago(3d) 
| project TimeGenerated, 
IngestionDurationSeconds = (ingestion_time()-TimeGenerated)/1s
| summarize LatencyIngestion90Percentile=percentile(IngestionDurationSeconds, 90) by datatype, bin(TimeGenerated, 1h) 
| render timechart
```

#### Measure current ingestion latency

After you establish the baseline ingestion latency for a specific data type, you can create an alert for the data type based on changes in the latency over a short time.

The following query calculates ingestion latency over the past 20 minutes. Because you expect some fluctuations, create an alert rule condition to check if the query returns a value significantly greater than the baseline.

```kusto
// track the recent ingestion latency (in seconds) of a specific data type
Perf
| where TimeGenerated > ago(20m) 
| extend IngestionDurationSeconds = (ingestion_time()-TimeGenerated)/1s
| summarize Ingestion90Percent_seconds=percentile(IngestionDurationSeconds, 90)
```

#### Monitor ingestion latency breakdown

The final step in the ingestion latency process consists of two functional parts:

- **Agents**: Collect logs and send them to the ingestion endpoint, which is the entry point of the ingestion pipeline.
- **Ingestion pipeline (backend)**: Process the logs and store them in your workspace (specifically, the database cluster underlying your workspace).

When you notice your total ingestion latency is going up, you can use queries to determine whether the source of the latency is the agents or the ingestion pipeline.

The following query produces separate 90th percentile breakdown charts for the latency of the agents and the ingestion pipeline. 

```kusto
// Agent and pipeline (backend) latency
Perf
| where TimeGenerated > ago(1h) 
| extend AgentLatencySeconds = (_TimeReceived-TimeGenerated)/1s,
	  PipelineLatencySeconds=(ingestion_time()-_TimeReceived)/1s
| summarize percentile(AgentLatencySeconds,90), percentile(PipelineLatencySeconds,90) by bin(TimeGenerated,5m)
| render columnchart
```

> [!NOTE]
> Although the breakdown charts display the 90th percentile data as stacked columns, the sum of the data in the two charts doesn't equal the _total_ ingestion 90th percentile.

### Understand ingestion volume monitoring

Ingestion volume measurements reveal unexpected changes to the total or table-specific ingestion volume for your workspace. The query volume measurements can help you identify performance issues with logs ingestion. Some useful volume measurements include:

- Total ingestion volume per data type
- Constant ingestion volume (standstill)
- Spikes and dips in ingestion volume

The following sections demonstrate different queries to check the ingestion volume for your workspace. 

#### Monitor total volume per data type

You can define a query to monitor the ingestion volume per data type in your workspace. The query can include an alert that checks for unexpected changes to the total or table-specific volume. 

The following query calculates the total ingestion volume over the past hour per data type in megabytes per second (MBs):

```kusto
Usage 
| where TimeGenerated > ago(1h) 
| summarize BillableDataMB = sum(_BilledSize)/1.E6 by bin(TimeGenerated,1h) , DataType
```

#### Check for ingestion standstill

If you ingest logs through agents, you can use the agent's _heartbeat_ to detect connectivity. A still heartbeat can reveal a stop in logs ingestion to your workspace. When the query data reveals an ingestion standstill, you can define a condition to trigger a desired response.

The following query checks the agent's heartbeat to detect connectivity:

```kusto
Heartbeat | where TimeGenerated>ago(10m) | count
```

#### Analyze volume spikes and dips

You can identify spikes and dips in your workspace ingestion volume data in various ways. A common approach is to decompose the query data to reveal specific anomalies by using the `series_decompose_anomalies` operator. You can also compose your own anomaly detector to support your unique workspace scenarios.

##### Use series_decompose_anomalies operator

To identify anomalies in a series of data values, your query can include the `series_decompose_anomalies` operator. The following query calculates the ingestion volume per data type per hour, and applies the `series_decompose_anomalies` operator to identify anomalies:

```kusto
Usage
| where TimeGenerated > ago(24h)
| project TimeGenerated, DataType, Quantity
| summarize IngestionVolumeMB=sum(Quantity) by bin(TimeGenerated, 1h), DataType
| summarize
    Timestamp=make_list(TimeGenerated),
    IngestionVolumeMB=make_list(IngestionVolumeMB)
    by DataType
| extend series_decompose_anomalies(IngestionVolumeMB)
| mv-expand
    Timestamp,
    IngestionVolumeMB,
    series_decompose_anomalies_IngestionVolumeMB_ad_flag,
    series_decompose_anomalies_IngestionVolumeMB_ad_score,
    series_decompose_anomalies_IngestionVolumeMB_baseline
| where series_decompose_anomalies_IngestionVolumeMB_ad_flag != 0
```

##### Create custom anomaly detector

You can create a custom anomaly detector to support the scenario requirements for your workspace configuration. This section provides an example to demonstrate the process.

The following query calculates the following data:

- **Expected ingestion volume**: Per hour, by data type (based on the median of medians, but you can customize the logic)
- **Actual ingestion volume**: Per hour, by data type

To filter out insignificant differences between the expected and the actual ingestion volume, the query applies two filters:

- **Rate of change**: Over 150% or under 66% of the expected volume, per type
- **Volume of change**: Indicates whether the increased or decreased volume is more than 0.1% of the monthly volume of that type

```kusto
let TimeRange=24h;
let MonthlyIngestionByType=
    Usage
    | where TimeGenerated > ago(30d)
    | summarize MonthlyIngestionMB=sum(Quantity) by DataType;
// calculating the expected ingestion volume by median of hourly medians
let ExpectedIngestionVolumeByType=
    Usage
    | where TimeGenerated > ago(TimeRange)
    | project TimeGenerated, DataType, Quantity
    | summarize IngestionMedian=percentile(Quantity, 50) by bin(TimeGenerated, 1h), DataType
    | summarize ExpectedIngestionVolumeMB=percentile(IngestionMedian, 50) by DataType;
Usage
| where TimeGenerated > ago(TimeRange)
| project TimeGenerated, DataType, Quantity
| summarize IngestionVolumeMB=sum(Quantity) by bin(TimeGenerated, 1h), DataType
| join kind=inner (ExpectedIngestionVolumeByType) on DataType
| extend GapVolumeMB = round(IngestionVolumeMB-ExpectedIngestionVolumeMB,2)
| where GapVolumeMB != 0
| extend Trend=iff(GapVolumeMB > 0, "Up", "Down")
| extend IngestedVsExpectedAsPercent = round(IngestionVolumeMB * 100 / ExpectedIngestionVolumeMB, 2)
| join kind=inner (MonthlyIngestionByType) on DataType
| extend GapAsPercentOfMonthlyIngestion = round(abs(GapVolumeMB) * 100 / MonthlyIngestionMB, 2)
| project-away DataType1, DataType2
// Find if the spike/deep is substantial: over 150% or under 66% of the expected volume for this data type
| where IngestedVsExpectedAsPercent > 150 or IngestedVsExpectedAsPercent < 66
// Find if the volume of the gap is significant: over 0.1% of the total monthly ingestion volume to this workspace
| where GapAsPercentOfMonthlyIngestion > 0.1
| project
    Timestamp=format_datetime(todatetime(TimeGenerated), 'yyyy-MM-dd HH:mm:ss'),
    Trend,
    IngestionVolumeMB,
    ExpectedIngestionVolumeMB,
    IngestedVsExpectedAsPercent,
    GapAsPercentOfMonthlyIngestion
```

### Monitor query success and failure

Each query returns a response code that indicates success or failure. When the query fails, the response also includes the types of any errors. A high surge of errors can indicate a problem with the workspace availability or service performance.

The following query counts how many queries returned a server error code:

```kusto
LAQueryLogs | where ResponseCode>=500 and ResponseCode<600 | count
```

## Related content

- [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md)
- [Set up the Microsoft Monitoring Agent (MMA)](/services-hub/unified/health/mma-setup)