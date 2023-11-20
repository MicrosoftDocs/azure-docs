---
title: Azure Monitor REST API index
description: Lists the operation groups for the Azure Monitor REST API, which includes Application Insights, Log Analytics, and Monitor.
ms.date: 11/14/2023
ms.topic: reference
---

# Azure Monitor REST API index

Organized by subject area.

| Operation groups                                            | Description |
|-------------------------------------------------------------|-------------|
| [Operations](/rest/api/monitor/alertsmanagement/operations) | Lists the available REST API operations for Azure Monitor. |
| ***Activity Log*** |  |
| [Activity log(s)](/rest/api/monitor/activity-logs) | Get a list of event entries in the [activity log](./essentials/platform-logs-overview.md). |
| [(Activity log) event categories](/rest/api/monitor/event-categories) | Lists the types of Activity Log Entries. |
| [Activity log profiles](/rest/api/monitor/log-profiles) | Operations to manage [activity log profiles](./essentials/platform-logs-overview.md) so you can route activity log events to other locations. |
| [Activity log tenant events](/rest/api/monitor/tenant-activity-logs) | Gets the [Activity Log](./essentials/platform-logs-overview.md) event entries for a specific tenant. |
| ***Alerts Management and Action Groups*** |  |
| [Action groups](/rest/api/monitor/action-groups) | Manages and lists [action groups](./alerts/action-groups.md). |
| [Activity log alerts](/rest/api/monitor/activity-log-alerts) | Manages and lists [activity log alert rules](./alerts/alerts-types.md#activity-log-alerts). |
| [Alert management](/rest/api/monitor/alertsmanagement/alerts) | Lists and updates [fired alerts](./alerts/alerts-overview.md). |
| [Alert processing rules](/rest/api/monitor/alertsmanagement/alert-processing-rules) | Manages and lists [alert processing rules](./alerts/alerts-processing-rules.md). |
| [Metric alert baseline](/rest/api/monitor/baselines) | List the metric baselines used in alert rules with [dynamic thresholds](./alerts/alerts-dynamic-thresholds.md). |
| [Metric alerts](/rest/api/monitor/metric-alerts) | Manages and lists [metric alert rules](./alerts/alerts-overview.md). |
| [Metric alerts status](/rest/api/monitor/metric-alerts-status) | Lists the status of [metric alert rules](./alerts/alerts-overview.md). |
| [Prometheus rule groups](/rest/api/monitor/prometheus-rule-groups) | Manages and lists [Prometheus rule groups](./essentials/prometheus-rule-groups.md) (alert rules and recording rules). |
| [Scheduled query rules - 2023-03-15 (preview)](/rest/api/monitor/scheduled-query-rules?view=rest-monitor-2023-03-15-preview&preserve-view=true) | Manages and lists [log alert rules](./alerts/alerts-types.md#log-alerts). |
| [Scheduled query rules - 2018-04-16](/rest/api/monitor/scheduled-query-rules?view=rest-monitor-2018-04-16&preserve-view=true) | Manages and lists [log alert rules](./alerts/alerts-types.md#log-alerts). |
| [Scheduled query rules - 2021-08-01](/rest/api/monitor/scheduled-query-rules?view=rest-monitor-2021-08-01&preserve-view=true) | Manages and lists [log alert rules](./alerts/alerts-types.md#log-alerts). |
| [Smart Detector alert rules](/rest/api/monitor/smart-detector-alert-rules) | Manages and lists [smart detection alert rules](./alerts/alerts-types.md#smart-detection-alerts). |
| ***Application Insights*** |  |
| [Components](/rest/api/application-insights/components) | Enables you to manage components that contain Application Insights data. |
| [Data Access](./logs/api/overview.md) | Query Application Insights data. |
| [Events](/rest/api/application-insights/events) | Retrieve the data for a single event or multiple events by event type and retrieve the Odata EDMX metadata for an application. |
| [Metadata](/rest/api/application-insights/metadata) | Retrieve and export the metadata information for an application. |
| [Metrics](/rest/api/application-insights/metrics) | Retrieve or export the metric data for an application and retrieve the metadata describing the available metrics for an application. |
| [Query](/rest/api/application-insights/query) | The Query operation group, which includes Execute and Get operations, enables running analytics queries on resources and retrieving the results, even for large data sets that require extended processing time. |
| [Web Tests](/rest/api/application-insights/web-tests) | Set up web tests to monitor a web endpoint’s availability and responsiveness. |
| [Workbooks](/rest/api/application-insights/workbooks) | Manage Azure workbooks for an Application Insights component resource and retrieve workbooks within resource group  or subscription by category. |
| ***Autoscale Settings*** |  |
| [Autoscale settings](/rest/api/monitor/autoscale-settings) | Operations to manage autoscale settings. |
| [Predictive metric](/rest/api/monitor/predictive-metric) | Retrieves predicted autoscale metric data. |
| ***Data Collection Endpoints*** |  |
| [Data collection endpoints](/rest/api/monitor/data-collection-endpoints) | Create and manage a data collection endpoint and retrieve the data collection endpoints within a resource group or subscription. |
| ***Data Collection Rules*** | Create and manage a data collection rule and retrieve the data collection rules within a resource group or subscription. |
| [Data collection rule associations](/rest/api/monitor/data-collection-rule-associations) | Create and manage a data collection rule association and retrieve the data collection rule associations for a data collection endpoint, resource, or data collection rule. |
| [Data collection rules](/rest/api/monitor/data-collection-rules) | Create and manage a data collection rule and retrieve the data collection rules within a resource group or subscription. |
| ***Diagnostic Settings*** |  |
| [Diagnostic settings](/rest/api/monitor/diagnostic-settings) | COMING SOON |
| [Diagnostic settings category](/rest/api/monitor/diagnostic-settings-category) | COMING SOON |
| [Management group diagnostic settings](/rest/api/monitor/management-group-diagnostic-settings) | COMING SOON |
| [Subscription diagnostic settings](/rest/api/monitor/subscription-diagnostic-settings) | COMING SOON |
| ***Manage Log Analytics workspaces and related resources*** |  |
| [Available service tiers](/rest/api/loganalytics/available-service-tiers) | Retrieve the available service tiers for a Log Analytics workspace. |
| [Clusters](/rest/api/loganalytics/clusters) | Manage Log Analytics clusters. |
| [Data Collector Logs (Preview)](/rest/api/loganalytics/data%20collector%20logs%20%28preview%29) | Delete or retrieve a data collector log tables for a Log Analytics workspace and retrieve all data collector log tables for a Log Analytics workspace. |
| [Data exports](/rest/api/loganalytics/data-exports) | Manage a data export for a Log Analytics workspace or retrieve the data export instances within a Log Analytics workspace. |
| [Data Sources](/rest/api/loganalytics/data-sources) | Create or update data sources. |
| [Deleted workspaces](/rest/api/loganalytics/deleted-workspaces) | Retrieve the recently deleted workspaces within a subscription or resource group. |
| [Gateways](/rest/api/loganalytics/gateways) | Delete a Log Analytics gateway. |
| [Intelligence Packs](/rest/api/loganalytics/intelligence-packs) | Enable or disable an intelligence pack for a Log Analytics workspace or retrieve all intelligence packs for a Log Analytics workspace. |
| [Linked Services](/rest/api/loganalytics/linked-services) | Create or update linked services. |
| [Linked Storage Accounts](/rest/api/loganalytics/linked-storage-accounts) | Manage a link relation between a workspace and storage accounts and retrieve all linked storage accounts associated with a workspace. |
| [Management Groups](/rest/api/loganalytics/management-groups) | Retrieve all management groups connected to a Log Analytics workspace. |
| [Metadata](/rest/api/loganalytics/metadata) | Retrieve the metadata information for a Log Analytics workspace. |
| [Operation Statuses](/rest/api/loganalytics/operation-statuses) | Retrieve the status of a long running azure asynchronous operation. |
| [Operations](/rest/api/loganalytics/operations) | Retrieve all of the available OperationalInsights Rest API operations. |
| [Query](/rest/api/loganalytics/query) | Execute a batch of Analytics queries for data. |
| [Query pack queries](/rest/api/monitor/query-pack-queries) | Manage a query defined within a Log Analytics QueryPack and retrieve or search the list of queries defined within a Log Analytics QueryPack. |
| [Query packs](/rest/api/monitor/query-packs) | Manage a Log Analytics QueryPack including updating its tags and retrieve a list of all Log Analytics QueryPacks within a subscription or resource group. |
| [Saved Searches](/rest/api/loganalytics/saved-searches) | Create or update saved searches. |
| [Storage Insights](/rest/api/loganalytics/storage-insights) | Create or update storage insights. |
| [Tables](/rest/api/loganalytics/tables) | Manage Log Analytics workspace tables. |
| [Workspace purge](/rest/api/loganalytics/workspace-purge) | Retrieve the status of an ongoing purge operation or purge the data in a Log Analytics workspace. |
| [Workspace schema](/rest/api/loganalytics/workspace-schema) | Retrieves the schema for a Log Analytics workspace. |
| [Workspace shared keys](/rest/api/loganalytics/workspace-shared-keys) | Retrieve or regenerate the shared keys for a Log Analytics workspace. |
| [Workspace usages](/rest/api/loganalytics/workspace-usages) | Retrieve the usage metrics for a Log Analytics workspace. |
| [Workspaces](/rest/api/loganalytics/workspaces) | Manage Log Analytics workspaces. |
| ***Metrics*** |  |
| [Azure Monitor Workspaces](/rest/api/monitor/azure-monitor-workspaces) | COMING SOON |
| [Metric definitions](/rest/api/monitor/metric-definitions) | Lists the metric definitions available for the resource. That is, what [specific metrics](/azure/azure-monitor/reference/supported-metrics/metrics-index) can you collect. |
| [Metric namespaces](/rest/api/monitor/metric-namespaces) | Lists the metric namespaces. Most relevant when using [custom metrics](./essentials/metrics-custom-overview.md). |
| [Metrics Batch](/rest/api/monitor/metrics-batch) | COMING SOON |
| [Metrics](/rest/api/monitor/metrics) | Lists the metric values for a resource you identify. |
| [Metrics – Custom](/rest/api/monitor/metrics-custom) | COMING SOON |
| ***Private Link Networking*** |  |
| [Private endpoint connections (preview)](/rest/api/monitor/private-endpoint-connections) | Approve, reject, delete, and retrieve a private endpoint connection and retrieve all project endpoint connections on a private link scope. |
| [Private link resources (preview)](/rest/api/monitor/private-link-resources) | Retrieve a single private link resource that needs to be created for an Azure Monitor PrivateLinkScope or all private link resources within an Azure Monitor PrivateLinkScope resource that need to be created for an Azure Monitor PrivateLinkScope. |
| [Private link scope operation status (preview)](/rest/api/monitor/private-link-scope-operation-status) | Retrieves the status of an Azure asynchronous operation associated with a private link scope operation. |
| [Private link scoped resources (preview)](/rest/api/monitor/private-link-scoped-resources) | Approve, reject, delete, and retrieve a scoped resource object and retrieve all scoped resource objects within an Azure Monitor PrivateLinkScope resource. |
| [Private link scopes (preview)](/rest/api/monitor/private-link-scopes) | Manage an Azure Monitor PrivateLinkScope including its tags and retrieve a list of all Azure Monitor PrivateLinkScopes within a subscription or resource group. |
| ***Query log data*** |  |
| [Data Access](./logs/api/overview.md) | Query Log Analytics data. |
| ***Send Custom Log Data to Log Analytics*** |  |
| [Logs Ingestion](./logs/logs-ingestion-api-overview.md) | Lets you send data to a Log Analytics workspace using either a [REST API call](./logs/logs-ingestion-api-overview.md#rest-api-call) or [client libraries](./logs/logs-ingestion-api-overview.md#client-libraries). |
| ***Retired or being retired*** |  |
| [Alerts (classic) rule incidents](/rest/api/monitor/alert-rule-incidents) | [Being retired in 2019](/previous-versions/azure/azure-monitor/alerts/monitoring-classic-retirement) in the public cloud. Older classic alerts functions. Gets an incident associated to a [classic metric alert rule](./alerts/alerts-classic.overview.md). When an alert rule fires because the threshold is crossed in the up or down direction, an incident is created and an entry added to the [Activity Log](./essentials/platform-logs-overview.md). |
| [Alert (classic) rules](/rest/api/monitor/alert-rules) | [Being retired in 2019](/previous-versions/azure/azure-monitor/alerts/monitoring-classic-retirement) in the public cloud. Provides operations for managing [classic alert](./alerts/alerts-classic.overview.md) rules. |
| [Data Collector](/rest/api/loganalytics/create-request) | Data Collector API Reference. |