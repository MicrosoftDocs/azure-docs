---
title:  Metrics export behavior with NULL and zero values
description: Discussion of NULL vs. zero values when exporting metrics and a pointer to a list of what metrics are not exportable.
services: azure-monitor
ms.topic: reference
ms.date: 07/22/2020
ms.reviewer: robb
---
# Azure Monitor platform metrics exportable via Diagnostic Settings

Azure Monitor provides [platform metrics](../essentials/data-platform-metrics.md) by default with no configuration. It provides several ways to interact with platform metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. See [metrics-supported](./metrics-supported.md) for a complete list of platform metrics currently available with Azure Monitor's consolidated metric pipeline. To query for and access these metrics please use the [2018-01-01 api-version](/rest/api/monitor/metricdefinitions). Other metrics may be available in the portal or using legacy APIs.

## Metrics not exportable via diagnostic settings

See the "exportable?" column in the [Supported list of Azure Monitor Metrics](./metrics-supported.md#exporting-platform-metrics-to-other-locations).

There are limitations when exporting metrics via diagnostic settings. However, all metrics are exportable using the REST API.

## Exported zero vs NULL values

Metrics have different behavior when dealing with 0 or NULL values.  Some metrics report 0 when no data is obtained, for example, metrics on http failures. Other metrics store NULLs when no data is obtained because it can indicate that the resource is offline. You can see the difference when charting these metrics with NULL values showing up as [dashed lines](metrics-troubleshoot.md#chart-shows-dashed-line). 

When platform metrics can be exported via diagnostic settings, they match the behavior of the metric. That is, they export NULLs when the resource sends no data.  They export '0's only when they have truly been emitted by the underlying resource. 

If you delete a resource group or a specific resource, metric data from the affected resources no longer is sent to diagnostic setting export destinations. That is, it no longer appears in Event Hubs, Azure Storage accounts and Log Analytics workspaces.

### Metrics that used to export zero for NULL

Before June 1, 2020, the metrics below **used to** emit '0's when there was no data. Those zeros could then be exported into downstream systems like Log Analytics and Azure storage.  This behavior caused some confusion between real '0s' (emitted by resource) and interpreted '0s' (NULLs), and so the behavior was changed to match that of the underlying metric as mentioned in the previous section. 

The change occurred in all public and private clouds.

The change did not impact the behavior of any of the following experiences: 
   - Platform resource logs exported via Diagnostic Settings
   - Metrics charting in Metrics Explorer
   - Alerting on platform metrics
 
Following is a list of the metrics whose behavior changed. 

| ResourceType                    | Metric               |  MetricDisplayName  | 
|---------------------------------|----------------------|---------------------|
| Microsoft.ApiManagement/service | UnauthorizedRequests |  Unauthorized Gateway Requests (Deprecated)  | 
| Microsoft.ApiManagement/service | TotalRequests |  Total Gateway Requests (Deprecated)  | 
| Microsoft.ApiManagement/service | SuccessfulRequests |  Successful Gateway Requests (Deprecated)  | 
| Microsoft.ApiManagement/service | Requests |  Requests  | 
| Microsoft.ApiManagement/service | OtherRequests |  Other Gateway Requests (Deprecated)  | 
| Microsoft.ApiManagement/service | FailedRequests |  Failed Gateway Requests (Deprecated)  | 
| Microsoft.ApiManagement/service | EventHubTotalFailedEvents |  Failed EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubTotalEvents |  Total EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubTotalBytesSent |  Size of EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubTimedoutEvents |  Timed Out EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubThrottledEvents |  Throttled EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubSuccessfulEvents |  Successful EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubRejectedEvents |  Rejected EventHub Events  | 
| Microsoft.ApiManagement/service | EventHubDroppedEvents |  Dropped EventHub Events  | 
| Microsoft.ApiManagement/service | Duration |  Overall Duration of Gateway Requests  | 
| Microsoft.ApiManagement/service | BackendDuration |  Duration of Backend Requests  | 
| Microsoft.DBforMariaDB/servers | storage_used |  Storage used  | 
| Microsoft.DBforMariaDB/servers | storage_percent |  Storage percent  | 
| Microsoft.DBforMariaDB/servers | storage_limit |  Storage limit  | 
| Microsoft.DBforMariaDB/servers | serverlog_storage_usage |  Server Log storage used  | 
| Microsoft.DBforMariaDB/servers | serverlog_storage_percent |  Server Log storage percent  | 
| Microsoft.DBforMariaDB/servers | serverlog_storage_limit |  Server Log storage limit  | 
| Microsoft.DBforMariaDB/servers | seconds_behind_master |  Replication lag in seconds  | 
| Microsoft.DBforMariaDB/servers | network_bytes_ingress |  Network In  | 
| Microsoft.DBforMariaDB/servers | network_bytes_egress |  Network Out  | 
| Microsoft.DBforMariaDB/servers | memory_percent |  Memory percent  | 
| Microsoft.DBforMariaDB/servers | io_consumption_percent |  IO percent  | 
| Microsoft.DBforMariaDB/servers | cpu_percent |  CPU percent  | 
| Microsoft.DBforMariaDB/servers | connections_failed |  Failed Connections  | 
| Microsoft.DBforMariaDB/servers | backup_storage_used |  Backup Storage used  | 
| Microsoft.DBforMariaDB/servers | active_connections |  Active Connections  | 
| Microsoft.DBforMySQL/servers | storage_used |  Storage used  | 
| Microsoft.DBforMySQL/servers | storage_percent |  Storage percent  | 
| Microsoft.DBforMySQL/servers | storage_limit |  Storage limit  | 
| Microsoft.DBforMySQL/servers | serverlog_storage_usage |  Server Log storage used  | 
| Microsoft.DBforMySQL/servers | serverlog_storage_percent |  Server Log storage percent  | 
| Microsoft.DBforMySQL/servers | serverlog_storage_limit |  Server Log storage limit  | 
| Microsoft.DBforMySQL/servers | seconds_behind_master |  Replication lag in seconds  | 
| Microsoft.DBforMySQL/servers | network_bytes_ingress |  Network In  | 
| Microsoft.DBforMySQL/servers | network_bytes_egress |  Network Out  | 
| Microsoft.DBforMySQL/servers | memory_percent |  Memory percent  | 
| Microsoft.DBforMySQL/servers | io_consumption_percent |  IO percent  | 
| Microsoft.DBforMySQL/servers | cpu_percent |  CPU percent  | 
| Microsoft.DBforMySQL/servers | connections_failed |  Failed Connections  | 
| Microsoft.DBforMySQL/servers | backup_storage_used |  Backup Storage used  | 
| Microsoft.DBforMySQL/servers | active_connections |  Active Connections  | 
| Microsoft.Devices/Account | digitaltwins.telemetry.nodes |  Digital Twins Node Telemetry Placeholder  | 
| Microsoft.Devices/IotHubs | twinQueries.success |  Successful twin queries  | 
| Microsoft.Devices/IotHubs | twinQueries.resultSize |  Twin queries result size  | 
| Microsoft.Devices/IotHubs | twinQueries.failure |  Failed twin queries  | 
| Microsoft.Devices/IotHubs | jobs.queryJobs.success |  Successful job queries  | 
| Microsoft.Devices/IotHubs | jobs.queryJobs.failure |  Failed job queries  | 
| Microsoft.Devices/IotHubs | jobs.listJobs.success |  Successful calls to list jobs  | 
| Microsoft.Devices/IotHubs | jobs.listJobs.failure |  Failed calls to list jobs  | 
| Microsoft.Devices/IotHubs | jobs.failed |  Failed jobs  | 
| Microsoft.Devices/IotHubs | jobs.createTwinUpdateJob.success |  Successful creations of twin update jobs  | 
| Microsoft.Devices/IotHubs | jobs.createTwinUpdateJob.failure |  Failed creations of twin update jobs  | 
| Microsoft.Devices/IotHubs | jobs.createDirectMethodJob.success |  Successful creations of method invocation jobs  | 
| Microsoft.Devices/IotHubs | jobs.createDirectMethodJob.failure |  Failed creations of method invocation jobs  | 
| Microsoft.Devices/IotHubs | jobs.completed |  Completed jobs  | 
| Microsoft.Devices/IotHubs | jobs.cancelJob.success |  Successful job cancellations  | 
| Microsoft.Devices/IotHubs | jobs.cancelJob.failure |  Failed job cancellations  | 
| Microsoft.Devices/IotHubs | EventGridLatency |  Event Grid latency (preview)  | 
| Microsoft.Devices/IotHubs | EventGridDeliveries |  Event Grid deliveries(preview)  | 
| Microsoft.Devices/IotHubs | devices.totalDevices |  Total devices (deprecated)  | 
| Microsoft.Devices/IotHubs | devices.connectedDevices.allProtocol |  Connected devices (deprecated)   | 
| Microsoft.Devices/IotHubs | deviceDataUsageV2 |  Total device data usage (preview)  | 
| Microsoft.Devices/IotHubs | deviceDataUsage |  Total device data usage  | 
| Microsoft.Devices/IotHubs | dailyMessageQuotaUsed |  Total number of messages used  | 
| Microsoft.Devices/IotHubs | d2c.twin.update.success |  Successful twin updates from devices  | 
| Microsoft.Devices/IotHubs | d2c.twin.update.size |  Size of twin updates from devices  | 
| Microsoft.Devices/IotHubs | d2c.twin.update.failure |  Failed twin updates from devices  | 
| Microsoft.Devices/IotHubs | d2c.twin.read.success |  Successful twin reads from devices  | 
| Microsoft.Devices/IotHubs | d2c.twin.read.size |  Response size of twin reads from devices  | 
| Microsoft.Devices/IotHubs | d2c.twin.read.failure |  Failed twin reads from devices  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.ingress.success |  Telemetry messages sent  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.ingress.sendThrottle |  Number of throttling errors  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.ingress.allProtocol |  Telemetry message send attempts  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.egress.success |  Routing: telemetry messages delivered  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.egress.orphaned |  Routing: telemetry messages orphaned   | 
| Microsoft.Devices/IotHubs | d2c.telemetry.egress.invalid |  Routing: telemetry messages incompatible  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.egress.fallback |  Routing: messages delivered to fallback  | 
| Microsoft.Devices/IotHubs | d2c.telemetry.egress.dropped |  Routing: telemetry messages dropped   | 
| Microsoft.Devices/IotHubs | d2c.endpoints.latency.storage |  Routing: message latency for storage  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.latency.serviceBusTopics |  Routing: message latency for Service Bus Topic  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.latency.serviceBusQueues |  Routing: message latency for Service Bus Queue  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.latency.eventHubs |  Routing: message latency for Event Hub  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.latency.builtIn.events |  Routing: message latency for messages/events  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage.bytes |  Routing: data delivered to storage  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage.blobs |  Routing: blobs delivered to storage  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage |  Routing: messages delivered to storage  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.serviceBusTopics |  Routing: messages delivered to Service Bus Topic  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.serviceBusQueues |  Routing: messages delivered to Service Bus Queue  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.eventHubs |  Routing: messages delivered to Event Hub  | 
| Microsoft.Devices/IotHubs | d2c.endpoints.egress.builtIn.events |  Routing: messages delivered to messages/events  | 
| Microsoft.Devices/IotHubs | configurations |  Configuration Metrics  | 
| Microsoft.Devices/IotHubs | C2DMessagesExpired |  C2D Messages Expired (preview)  | 
| Microsoft.Devices/IotHubs | c2d.twin.update.success |  Successful twin updates from back end  | 
| Microsoft.Devices/IotHubs | c2d.twin.update.size |  Size of twin updates from back end  | 
| Microsoft.Devices/IotHubs | c2d.twin.update.failure |  Failed twin updates from back end  | 
| Microsoft.Devices/IotHubs | c2d.twin.read.success |  Successful twin reads from back end  | 
| Microsoft.Devices/IotHubs | c2d.twin.read.size |  Response size of twin reads from back end  | 
| Microsoft.Devices/IotHubs | c2d.twin.read.failure |  Failed twin reads from back end  | 
| Microsoft.Devices/IotHubs | c2d.methods.success |  Successful direct method invocations  | 
| Microsoft.Devices/IotHubs | c2d.methods.responseSize |  Response size of direct method invocations  | 
| Microsoft.Devices/IotHubs | c2d.methods.requestSize |  Request size of direct method invocations  | 
| Microsoft.Devices/IotHubs | c2d.methods.failure |  Failed direct method invocations  | 
| Microsoft.Devices/IotHubs | c2d.commands.egress.reject.success |  C2D messages rejected  | 
| Microsoft.Devices/IotHubs | c2d.commands.egress.complete.success |  C2D message deliveries completed  | 
| Microsoft.Devices/IotHubs | c2d.commands.egress.abandon.success |  C2D messages abandoned  | 
| Microsoft.Devices/provisioningServices | RegistrationAttempts |  Registration attempts  | 
| Microsoft.Devices/provisioningServices | DeviceAssignments |  Devices assigned  | 
| Microsoft.Devices/provisioningServices | AttestationAttempts |  Attestation attempts  | 
| Microsoft.DocumentDB/databaseAccounts | TotalRequestUnits |  Total Request Units  | 
| Microsoft.DocumentDB/databaseAccounts | TotalRequests |  Total Requests  | 
| Microsoft.DocumentDB/databaseAccounts | MongoRequests |  Mongo Requests  | 
| Microsoft.DocumentDB/databaseAccounts | MongoRequestCharge |  Mongo Request Charge  | 
| Microsoft.EventGrid/domains | PublishSuccessLatencyInMs |  Publish Success Latency  | 
| Microsoft.EventGrid/domains | PublishSuccessCount |  Published Events  | 
| Microsoft.EventGrid/domains | PublishFailCount |  Publish Failed Events  | 
| Microsoft.EventGrid/domains | MatchedEventCount |  Matched Events  | 
| Microsoft.EventGrid/domains | DroppedEventCount |  Dropped Events  | 
| Microsoft.EventGrid/domains | DeliverySuccessCount |  Delivered Events  | 
| Microsoft.EventGrid/domains | DeadLetteredCount |  Dead Lettered Events  | 
| Microsoft.EventGrid/eventSubscriptions | MatchedEventCount |  Matched Events  | 
| Microsoft.EventGrid/eventSubscriptions | DroppedEventCount |  Dropped Events  | 
| Microsoft.EventGrid/eventSubscriptions | DeliverySuccessCount |  Delivered Events  | 
| Microsoft.EventGrid/eventSubscriptions | DeadLetteredCount |  Dead Lettered Events  | 
| Microsoft.EventGrid/extensionTopics | UnmatchedEventCount |  Unmatched Events  | 
| Microsoft.EventGrid/extensionTopics | PublishSuccessLatencyInMs |  Publish Success Latency  | 
| Microsoft.EventGrid/extensionTopics | PublishSuccessCount |  Published Events  | 
| Microsoft.EventGrid/extensionTopics | PublishFailCount |  Publish Failed Events  | 
| Microsoft.EventGrid/topics | UnmatchedEventCount |  Unmatched Events  | 
| Microsoft.EventGrid/topics | PublishSuccessLatencyInMs |  Publish Success Latency  | 
| Microsoft.EventGrid/topics | PublishSuccessCount |  Published Events  | 
| Microsoft.EventGrid/topics | PublishFailCount |  Publish Failed Events  | 
| Microsoft.EventHub/clusters | OutgoingMessages |  Outgoing Messages  | 
| Microsoft.EventHub/clusters | OutgoingBytes |  Outgoing Bytes.  | 
| Microsoft.EventHub/clusters | IncomingRequests |  Incoming Requests  | 
| Microsoft.EventHub/clusters | IncomingMessages |  Incoming Messages  | 
| Microsoft.EventHub/clusters | IncomingBytes |  Incoming Bytes.  | 
| Microsoft.EventHub/namespaces | SVRBSY |  Server Busy Errors (Deprecated)  | 
| Microsoft.EventHub/namespaces | SUCCREQ |  Successful Requests (Deprecated)  | 
| Microsoft.EventHub/namespaces | OUTMSGS |  Outgoing Messages (obsolete) (Deprecated)  | 
| Microsoft.EventHub/namespaces | OutgoingMessages |  Outgoing Messages  | 
| Microsoft.EventHub/namespaces | OutgoingBytes |  Outgoing Bytes.  | 
| Microsoft.EventHub/namespaces | MISCERR |  Other Errors (Deprecated)  | 
| Microsoft.EventHub/namespaces | INTERR |  Internal Server Errors (Deprecated)  | 
| Microsoft.EventHub/namespaces | INREQS |  Incoming Requests (Deprecated)  | 
| Microsoft.EventHub/namespaces | INMSGS |  Incoming Messages (obsolete) (Deprecated)  | 
| Microsoft.EventHub/namespaces | IncomingRequests |  Incoming Requests  | 
| Microsoft.EventHub/namespaces | IncomingMessages |  Incoming Messages  | 
| Microsoft.EventHub/namespaces | IncomingBytes |  Incoming Bytes.  | 
| Microsoft.EventHub/namespaces | FAILREQ |  Failed Requests (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHOUTMSGS |  Outgoing Messages (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHOUTMBS |  Outgoing bytes (obsolete) (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHOUTBYTES |  Outgoing bytes (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHINMSGS |  Incoming Messages (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHINMBS |  Incoming bytes (obsolete) (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHINBYTES |  Incoming bytes (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHAMSGS |  Archive messages (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHAMBS |  Archive message throughput (Deprecated)  | 
| Microsoft.EventHub/namespaces | EHABL |  Archive backlog messages (Deprecated)  | 
| Microsoft.HDInsight/clusters | NumActiveWorkers |  Number of Active Workers  | 
| Microsoft.HDInsight/clusters | GatewayRequests |  Gateway Requests  | 
| Microsoft.HDInsight/clusters | CategorizedGatewayRequests |  Categorized Gateway Requests  | 
| Microsoft.Insights/AutoscaleSettings | ScaleActionsInitiated |  Scale Actions Initiated  | 
| Microsoft.Insights/Components | traces/count |  Traces  | 
| Microsoft.Insights/Components | performanceCounters/requestsPerSecond |  HTTP request rate  | 
| Microsoft.Insights/Components | performanceCounters/requestsInQueue |  HTTP requests in application queue  | 
| Microsoft.Insights/Components | performanceCounters/exceptionsPerSecond |  Exception rate  | 
| Microsoft.Insights/Components | pageViews/count |  Page views  | 
| Microsoft.Insights/Components | exceptions/count |  Exceptions  | 
| Microsoft.Kusto/Clusters | StreamingIngestResults |  Streaming Ingest Result  | 
| Microsoft.Kusto/Clusters | StreamingIngestDuration |  Streaming Ingest Duration  | 
| Microsoft.Kusto/Clusters | StreamingIngestDataRate |  Streaming Ingest Data Rate  | 
| Microsoft.Kusto/Clusters | SteamingIngestRequestRate |  Streaming Ingest Request Rate  | 
| Microsoft.Kusto/Clusters | QueryDuration |  Query duration  | 
| Microsoft.Kusto/Clusters | KeepAlive |  Keep alive  | 
| Microsoft.Kusto/Clusters | IngestionVolumeInMB |  Ingestion volume (in MB)  | 
| Microsoft.Kusto/Clusters | IngestionUtilization |  Ingestion utilization  | 
| Microsoft.Kusto/Clusters | IngestionResult |  Ingestion result  | 
| Microsoft.Kusto/Clusters | IngestionLatencyInSeconds |  Ingestion latency (in seconds)  | 
| Microsoft.Kusto/Clusters | ExportUtilization |  Export Utilization  | 
| Microsoft.Kusto/Clusters | EventsProcessedForEventHubs |  Events processed (for Event/IoT Hubs)  | 
| Microsoft.Kusto/Clusters | CPU |  CPU  | 
| Microsoft.Kusto/Clusters | ContinuousExportResult |  Continuous Export Result  | 
| Microsoft.Kusto/Clusters | ContinuousExportPendingCount |  Continuous Export Pending Count  | 
| Microsoft.Kusto/Clusters | ContinuousExportNumOfRecordsExported |  Continuous export - num of exported records  | 
| Microsoft.Kusto/Clusters | ContinuousExportMaxLatenessMinutes |  Continuous Export Max Lateness Minutes  | 
| Microsoft.Kusto/Clusters | CacheUtilization |  Cache utilization  | 
| Microsoft.Logic/integrationServiceEnvironments | TriggerThrottledEvents |  Trigger Throttled Events  | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersSucceeded |  Triggers Succeeded   | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersStarted |  Triggers Started   | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersSkipped |  Triggers Skipped  | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersFired |  Triggers Fired   | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersFailed |  Triggers Failed   | 
| Microsoft.Logic/integrationServiceEnvironments | TriggersCompleted |  Triggers Completed   | 
| Microsoft.Logic/integrationServiceEnvironments | RunThrottledEvents |  Run Throttled Events  | 
| Microsoft.Logic/integrationServiceEnvironments | RunStartThrottledEvents |  Run Start Throttled Events  | 
| Microsoft.Logic/integrationServiceEnvironments | RunsSucceeded |  Runs Succeeded  | 
| Microsoft.Logic/integrationServiceEnvironments | RunsStarted |  Runs Started  | 
| Microsoft.Logic/integrationServiceEnvironments | RunsFailed |  Runs Failed  | 
| Microsoft.Logic/integrationServiceEnvironments | RunsCompleted |  Runs Completed  | 
| Microsoft.Logic/integrationServiceEnvironments | RunsCancelled |  Runs Canceled  | 
| Microsoft.Logic/integrationServiceEnvironments | RunFailurePercentage |  Run Failure Percentage  | 
| Microsoft.Logic/integrationServiceEnvironments | ActionThrottledEvents |  Action Throttled Events  | 
| Microsoft.Logic/integrationServiceEnvironments | ActionsSucceeded |  Actions Succeeded   | 
| Microsoft.Logic/integrationServiceEnvironments | ActionsStarted |  Actions Started   | 
| Microsoft.Logic/integrationServiceEnvironments | ActionsSkipped |  Actions Skipped   | 
| Microsoft.Logic/integrationServiceEnvironments | ActionsFailed |  Actions Failed   | 
| Microsoft.Logic/integrationServiceEnvironments | ActionsCompleted |  Actions Completed   | 
| Microsoft.Logic/workflows | TriggerThrottledEvents |  Trigger Throttled Events  | 
| Microsoft.Logic/workflows | TriggersSucceeded |  Triggers Succeeded   | 
| Microsoft.Logic/workflows | TriggersStarted |  Triggers Started   | 
| Microsoft.Logic/workflows | TriggersSkipped |  Triggers Skipped  | 
| Microsoft.Logic/workflows | TriggersFired |  Triggers Fired   | 
| Microsoft.Logic/workflows | TriggersFailed |  Triggers Failed   | 
| Microsoft.Logic/workflows | TriggersCompleted |  Triggers Completed   | 
| Microsoft.Logic/workflows | TotalBillableExecutions |  Total Billable Executions  | 
| Microsoft.Logic/workflows | RunThrottledEvents |  Run Throttled Events  | 
| Microsoft.Logic/workflows | RunStartThrottledEvents |  Run Start Throttled Events  | 
| Microsoft.Logic/workflows | RunsSucceeded |  Runs Succeeded  | 
| Microsoft.Logic/workflows | RunsStarted |  Runs Started  | 
| Microsoft.Logic/workflows | RunsFailed |  Runs Failed  | 
| Microsoft.Logic/workflows | RunsCompleted |  Runs Completed  | 
| Microsoft.Logic/workflows | RunsCancelled |  Runs Canceled  | 
| Microsoft.Logic/workflows | RunFailurePercentage |  Run Failure Percentage  | 
| Microsoft.Logic/workflows | BillingUsageStorageConsumption |  Billing Usage for Storage Consumption Executions  | 
| Microsoft.Logic/workflows | BillingUsageStorageConsumption |  Billing Usage for Storage Consumption Executions  | 
| Microsoft.Logic/workflows | BillingUsageStandardConnector |  Billing Usage for Standard Connector Executions  | 
| Microsoft.Logic/workflows | BillingUsageStandardConnector |  Billing Usage for Standard Connector Executions  | 
| Microsoft.Logic/workflows | BillingUsageNativeOperation |  Billing Usage for Native Operation Executions  | 
| Microsoft.Logic/workflows | BillingUsageNativeOperation |  Billing Usage for Native Operation Executions  | 
| Microsoft.Logic/workflows | BillableTriggerExecutions |  Billable Trigger Executions  | 
| Microsoft.Logic/workflows | BillableActionExecutions |  Billable Action Executions  | 
| Microsoft.Logic/workflows | ActionThrottledEvents |  Action Throttled Events  | 
| Microsoft.Logic/workflows | ActionsSucceeded |  Actions Succeeded   | 
| Microsoft.Logic/workflows | ActionsStarted |  Actions Started   | 
| Microsoft.Logic/workflows | ActionsSkipped |  Actions Skipped   | 
| Microsoft.Logic/workflows | ActionsFailed |  Actions Failed   | 
| Microsoft.Logic/workflows | ActionsCompleted |  Actions Completed   | 
| Microsoft.Network/frontdoors | WebApplicationFirewallRequestCount |  Web Application Firewall Request Count  | 
| Microsoft.Network/frontdoors | TotalLatency |  Total Latency  | 
| Microsoft.Network/frontdoors | ResponseSize |  Response Size  | 
| Microsoft.Network/frontdoors | RequestSize |  Request Size  | 
| Microsoft.Network/frontdoors | RequestCount |  Request Count  | 
| Microsoft.Network/frontdoors | BillableResponseSize |  Billable Response Size  | 
| Microsoft.Network/frontdoors | BackendRequestLatency |  Backend Request Latency  | 
| Microsoft.Network/frontdoors | BackendRequestCount |  Backend Request Count  | 
| Microsoft.Network/frontdoors | BackendHealthPercentage |  Backend Health Percentage  | 
| Microsoft.Network/trafficManagerProfiles | QpsByEndpoint |  Queries by Endpoint Returned  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | scheduled.pending |  Pending Scheduled Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.update |  Registration Update Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.get |  Registration Read Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.delete |  Registration Delete Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.create |  Registration Create Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.all |  Registration Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.wrongtoken |  WNS Authorization Errors (Wrong Token)  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.tokenproviderunreachable |  WNS Authorization Errors (Unreachable)  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.throttled |  WNS Throttled Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.success |  WNS Successful Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.pnserror |  WNS Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidtoken |  WNS Authorization Errors (Invalid Token)  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidnotificationsize |  WNS Invalid Notification Size Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidnotificationformat |  WNS Invalid Notification Format  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidcredentials |  WNS Authorization Errors (Invalid Credentials)  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.expiredchannel |  WNS Expired Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.dropped |  WNS Dropped Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.channelthrottled |  WNS Channel Throttled  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.channeldisconnected |  WNS Channel Disconnected  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.badchannel |  WNS Bad Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.authenticationerror |  WNS Authentication Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.throttled |  MPNS Throttled Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.success |  MPNS Successful Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.pnserror |  MPNS Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.invalidnotificationformat |  MPNS Invalid Notification Format  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.invalidcredentials |  MPNS Invalid Credentials  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.dropped |  MPNS Dropped Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.channeldisconnected |  MPNS Channel Disconnected  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.badchannel |  MPNS Bad Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.authenticationerror |  MPNS Authentication Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.wrongchannel |  GCM Wrong Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.throttled |  GCM Throttled Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.success |  GCM Successful Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.pnserror |  GCM Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidnotificationsize |  GCM Invalid Notification Size Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidnotificationformat |  GCM Invalid Notification Format  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidcredentials |  GCM Authorization Errors (Invalid Credentials)  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.expiredchannel |  GCM Expired Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.badchannel |  GCM Bad Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.authenticationerror |  GCM Authentication Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.success |  APNS Successful Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.pnserror |  APNS Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.invalidnotificationsize |  APNS Invalid Notification Size Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.invalidcredentials |  APNS Authorization Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.expiredchannel |  APNS Expired Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.badchannel |  APNS Bad Channel Error  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.success |  Successful notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.pnserror |  External Notification System Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.invalidpayload |  Payload Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.channelerror |  Channel Errors  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | notificationhub.pushes |  All Outgoing Notifications  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.upsert |  Create or Update Installation Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.patch |  Patch Installation Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.get |  Get Installation Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.delete |  Delete Installation Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.all |  Installation Management Operations  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.scheduled.cancel |  Scheduled Push Notifications Cancelled  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.scheduled |  Scheduled Push Notifications Sent  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.all.requests |  All Incoming Requests  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.all.failedrequests |  All Incoming Failed Requests  | 
| Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming |  Incoming Messages  | 
| Microsoft.OperationalInsights/workspaces | Heartbeat |  Heartbeat  | 
| Microsoft.Relay/namespaces | BytesTransferred |  BytesTransferred  | 
| Microsoft.ServiceBus/namespaces | OutgoingMessages |  Outgoing Messages  | 
| Microsoft.ServiceBus/namespaces | IncomingRequests |  Incoming Requests  | 
| Microsoft.ServiceBus/namespaces | IncomingMessages |  Incoming Messages  | 
| Microsoft.SignalRService/SignalR | UserErrors |  User Errors  | 
| Microsoft.SignalRService/SignalR | SystemErrors |  System Errors  | 
| Microsoft.SignalRService/SignalR | OutboundTraffic |  Outbound Traffic  | 
| Microsoft.SignalRService/SignalR | MessageCount |  Message Count  | 
| Microsoft.SignalRService/SignalR | InboundTraffic |  Inbound Traffic  | 
| Microsoft.SignalRService/SignalR | ConnectionCount |  Connection Count  | 
| Microsoft.Sql/managedInstances | avg_cpu_percent |  Average CPU percentage  | 
| Microsoft.Sql/servers | dtu_used |  DTU used  | 
| Microsoft.Sql/servers | dtu_consumption_percent |  DTU percentage  | 
| Microsoft.Sql/servers/databases | xtp_storage_percent |  In-Memory OLTP storage percent  | 
| Microsoft.Sql/servers/databases | workers_percent |  Workers percentage  | 
| Microsoft.Sql/servers/databases | sessions_percent |  Sessions percentage  | 
| Microsoft.Sql/servers/databases | physical_data_read_percent |  Data IO percentage  | 
| Microsoft.Sql/servers/databases | log_write_percent |  Log IO percentage  | 
| Microsoft.Sql/servers/databases | dwu_used |  DWU used  | 
| Microsoft.Sql/servers/databases | dwu_consumption_percent |  DWU percentage  | 
| Microsoft.Sql/servers/databases | dtu_used |  DTU used  | 
| Microsoft.Sql/servers/databases | dtu_consumption_percent |  DTU percentage  | 
| Microsoft.Sql/servers/databases | deadlock |  Deadlocks  | 
| Microsoft.Sql/servers/databases | cpu_used |  CPU used  | 
| Microsoft.Sql/servers/databases | cpu_percent |  CPU percentage  | 
| Microsoft.Sql/servers/databases | connection_successful |  Successful Connections  | 
| Microsoft.Sql/servers/databases | connection_failed |  Failed Connections  | 
| Microsoft.Sql/servers/databases | cache_hit_percent |  Cache hit percentage  | 
| Microsoft.Sql/servers/databases | blocked_by_firewall |  Blocked by Firewall  | 
| Microsoft.Sql/servers/elasticPools | xtp_storage_percent |  In-Memory OLTP storage percent  | 
| Microsoft.Sql/servers/elasticPools | workers_percent |  Workers percentage  | 
| Microsoft.Sql/servers/elasticPools | sessions_percent |  Sessions percentage  | 
| Microsoft.Sql/servers/elasticPools | physical_data_read_percent |  Data IO percentage  | 
| Microsoft.Sql/servers/elasticPools | log_write_percent |  Log IO percentage  | 
| Microsoft.Sql/servers/elasticPools | eDTU_used |  eDTU used  | 
| Microsoft.Sql/servers/elasticPools | dtu_consumption_percent |  DTU percentage  | 
| Microsoft.Sql/servers/elasticPools | cpu_percent |  CPU percentage  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | TotalFrontEnds |  Total Front Ends  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | SmallAppServicePlanInstances |  Small App Service Plan Workers  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Requests |  Requests  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | MemoryPercentage |  Memory Percentage  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | MediumAppServicePlanInstances |  Medium App Service Plan Workers  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | LargeAppServicePlanInstances |  Large App Service Plan Workers  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | HttpQueueLength |  Http Queue Length  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http5xx |  Http Server Errors  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http4xx |  Http 4xx  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http406 |  Http 406  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http404 |  Http 404  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http403 |  Http 403  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http401 |  Http 401  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http3xx |  Http 3xx  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http2xx |  Http 2xx  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | Http101 |  Http 101  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | DiskQueueLength |  Disk Queue Length  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | CpuPercentage |  CPU Percentage  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | BytesSent |  Data Out  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | BytesReceived |  Data In  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | AverageResponseTime |  Average Response Time  | 
| Microsoft.Web/hostingEnvironments/multiRolePools | ActiveRequests |  Active Requests  | 
| Microsoft.Web/hostingEnvironments/workerPools | WorkersUsed |  Used Workers  | 
| Microsoft.Web/hostingEnvironments/workerPools | WorkersTotal |  Total Workers  | 
| Microsoft.Web/hostingEnvironments/workerPools | WorkersAvailable |  Available Workers  | 
| Microsoft.Web/hostingEnvironments/workerPools | MemoryPercentage |  Memory Percentage  | 
| Microsoft.Web/hostingEnvironments/workerPools | CpuPercentage |  CPU Percentage  | 
| Microsoft.Web/serverfarms | TcpTimeWait |  TCP Time Wait  | 
| Microsoft.Web/serverfarms | TcpSynSent |  TCP Syn Sent  | 
| Microsoft.Web/serverfarms | TcpSynReceived |  TCP Syn Received  | 
| Microsoft.Web/serverfarms | TcpLastAck |  TCP Last Ack  | 
| Microsoft.Web/serverfarms | TcpFinWait2 |  TCP Fin Wait 2  | 
| Microsoft.Web/serverfarms | TcpFinWait1 |  TCP Fin Wait 1  | 
| Microsoft.Web/serverfarms | TcpEstablished |  TCP Established  | 
| Microsoft.Web/serverfarms | TcpClosing |  TCP Closing  | 
| Microsoft.Web/serverfarms | TcpCloseWait |  TCP Close Wait  | 
| Microsoft.Web/serverfarms | MemoryPercentage |  Memory Percentage  | 
| Microsoft.Web/serverfarms | HttpQueueLength |  Http Queue Length  | 
| Microsoft.Web/serverfarms | DiskQueueLength |  Disk Queue Length  | 
| Microsoft.Web/serverfarms | CpuPercentage |  CPU Percentage  | 
| Microsoft.Web/serverfarms | BytesSent |  Data Out  | 
| Microsoft.Web/serverfarms | BytesReceived |  Data In  | 
| Microsoft.Web/sites | TotalAppDomainsUnloaded |  Total App Domains Unloaded  | 
| Microsoft.Web/sites | TotalAppDomains |  Total App Domains  | 
| Microsoft.Web/sites | Threads |  Thread Count  | 
| Microsoft.Web/sites | RequestsInApplicationQueue |  Requests In Application Queue  | 
| Microsoft.Web/sites | Requests |  Requests  | 
| Microsoft.Web/sites | PrivateBytes |  Private Bytes  | 
| Microsoft.Web/sites | MemoryWorkingSet |  Memory working set  | 
| Microsoft.Web/sites | IoWriteOperationsPerSecond |  IO Write Operations Per Second  | 
| Microsoft.Web/sites | IoWriteBytesPerSecond |  IO Write Bytes Per Second  | 
| Microsoft.Web/sites | IoReadOperationsPerSecond |  IO Read Operations Per Second  | 
| Microsoft.Web/sites | IoReadBytesPerSecond |  IO Read Bytes Per Second  | 
| Microsoft.Web/sites | IoOtherOperationsPerSecond |  IO Other Operations Per Second  | 
| Microsoft.Web/sites | IoOtherBytesPerSecond |  IO Other Bytes Per Second  | 
| Microsoft.Web/sites | HttpResponseTime |  Response Time  | 
| Microsoft.Web/sites | Http5xx |  Http Server Errors  | 
| Microsoft.Web/sites | Http4xx |  Http 4xx  | 
| Microsoft.Web/sites | Http406 |  Http 406  | 
| Microsoft.Web/sites | Http404 |  Http 404  | 
| Microsoft.Web/sites | Http403 |  Http 403  | 
| Microsoft.Web/sites | Http401 |  Http 401  | 
| Microsoft.Web/sites | Http3xx |  Http 3xx  | 
| Microsoft.Web/sites | Http2xx |  Http 2xx  | 
| Microsoft.Web/sites | Http101 |  Http 101  | 
| Microsoft.Web/sites | HealthCheckStatus |  Health check status  | 
| Microsoft.Web/sites | Handles |  Handle Count  | 
| Microsoft.Web/sites | Gen2Collections |  Gen 2 Garbage Collections  | 
| Microsoft.Web/sites | Gen1Collections |  Gen 1 Garbage Collections  | 
| Microsoft.Web/sites | Gen0Collections |  Gen 0 Garbage Collections  | 
| Microsoft.Web/sites | FunctionExecutionUnits |  Function Execution Units  | 
| Microsoft.Web/sites | FunctionExecutionCount |  Function Execution Count  | 
| Microsoft.Web/sites | CurrentAssemblies |  Current Assemblies  | 
| Microsoft.Web/sites | CpuTime |  CPU Time  | 
| Microsoft.Web/sites | BytesSent |  Data Out  | 
| Microsoft.Web/sites | BytesReceived |  Data In  | 
| Microsoft.Web/sites | AverageResponseTime |  Average Response Time  | 
| Microsoft.Web/sites | AverageMemoryWorkingSet |  Average memory working set  | 
| Microsoft.Web/sites | AppConnections |  Connections  | 
| Microsoft.Web/sites/slots | TotalAppDomainsUnloaded |  Total App Domains Unloaded  | 
| Microsoft.Web/sites/slots | TotalAppDomains |  Total App Domains  | 
| Microsoft.Web/sites/slots | Threads |  Thread Count  | 
| Microsoft.Web/sites/slots | RequestsInApplicationQueue |  Requests In Application Queue  | 
| Microsoft.Web/sites/slots | Requests |  Requests  | 
| Microsoft.Web/sites/slots | PrivateBytes |  Private Bytes  | 
| Microsoft.Web/sites/slots | MemoryWorkingSet |  Memory working set  | 
| Microsoft.Web/sites/slots | IoWriteOperationsPerSecond |  IO Write Operations Per Second  | 
| Microsoft.Web/sites/slots | IoWriteBytesPerSecond |  IO Write Bytes Per Second  | 
| Microsoft.Web/sites/slots | IoReadOperationsPerSecond |  IO Read Operations Per Second  | 
| Microsoft.Web/sites/slots | IoReadBytesPerSecond |  IO Read Bytes Per Second  | 
| Microsoft.Web/sites/slots | IoOtherOperationsPerSecond |  IO Other Operations Per Second  | 
| Microsoft.Web/sites/slots | IoOtherBytesPerSecond |  IO Other Bytes Per Second  | 
| Microsoft.Web/sites/slots | HttpResponseTime |  Response Time  | 
| Microsoft.Web/sites/slots | Http5xx |  Http Server Errors  | 
| Microsoft.Web/sites/slots | Http4xx |  Http 4xx  | 
| Microsoft.Web/sites/slots | Http406 |  Http 406  | 
| Microsoft.Web/sites/slots | Http404 |  Http 404  | 
| Microsoft.Web/sites/slots | Http403 |  Http 403  | 
| Microsoft.Web/sites/slots | Http401 |  Http 401  | 
| Microsoft.Web/sites/slots | Http3xx |  Http 3xx  | 
| Microsoft.Web/sites/slots | Http2xx |  Http 2xx  | 
| Microsoft.Web/sites/slots | Http101 |  Http 101  | 
| Microsoft.Web/sites/slots | HealthCheckStatus |  Health check status  | 
| Microsoft.Web/sites/slots | Handles |  Handle Count  | 
| Microsoft.Web/sites/slots | Gen2Collections |  Gen 2 Garbage Collections  | 
| Microsoft.Web/sites/slots | Gen1Collections |  Gen 1 Garbage Collections  | 
| Microsoft.Web/sites/slots | Gen0Collections |  Gen 0 Garbage Collections  | 
| Microsoft.Web/sites/slots | FunctionExecutionUnits |  Function Execution Units  | 
| Microsoft.Web/sites/slots | FunctionExecutionCount |  Function Execution Count  | 
| Microsoft.Web/sites/slots | CurrentAssemblies |  Current Assemblies  | 
| Microsoft.Web/sites/slots | CpuTime |  CPU Time  | 
| Microsoft.Web/sites/slots | BytesSent |  Data Out  | 
| Microsoft.Web/sites/slots | BytesReceived |  Data In  | 
| Microsoft.Web/sites/slots | AverageResponseTime |  Average Response Time  | 
| Microsoft.Web/sites/slots | AverageMemoryWorkingSet |  Average memory working set  | 
| Microsoft.Web/sites/slots | AppConnections |  Connections  | 
| Microsoft.Sql/servers/databases | cpu_percent | CPU percentage | 
| Microsoft.Sql/servers/databases | physical_data_read_percent | Data IO percentage | 
| Microsoft.Sql/servers/databases | log_write_percent | Log IO percentage | 
| Microsoft.Sql/servers/databases | dtu_consumption_percent | DTU percentage | 
| Microsoft.Sql/servers/databases | connection_successful | Successful Connections | 
| Microsoft.Sql/servers/databases | connection_failed | Failed Connections | 
| Microsoft.Sql/servers/databases | blocked_by_firewall | Blocked by Firewall | 
| Microsoft.Sql/servers/databases | deadlock | Deadlocks | 
| Microsoft.Sql/servers/databases | xtp_storage_percent | In-Memory OLTP storage percent | 
| Microsoft.Sql/servers/databases | workers_percent | Workers percentage | 
| Microsoft.Sql/servers/databases | sessions_percent | Sessions percentage | 
| Microsoft.Sql/servers/databases | dtu_used | DTU used | 
| Microsoft.Sql/servers/databases | cpu_used | CPU used | 
| Microsoft.Sql/servers/databases | dwu_consumption_percent | DWU percentage | 
| Microsoft.Sql/servers/databases | dwu_used | DWU used | 
| Microsoft.Sql/servers/databases | cache_hit_percent | Cache hit percentage | 
| Microsoft.Sql/servers/databases | wlg_allocation_relative_to_system_percent | Workload group allocation by system percent | 
| Microsoft.Sql/servers/databases | wlg_allocation_relative_to_wlg_effective_cap_percent | Workload group allocation by max resource percent | 
| Microsoft.Sql/servers/databases | wlg_active_queries | Workload group active queries | 
| Microsoft.Sql/servers/databases | wlg_queued_queries | Workload group queued queries | 
| Microsoft.Sql/servers/databases | active_queries | Active queries | 
| Microsoft.Sql/servers/databases | queued_queries | Queued queries | 
| Microsoft.Sql/servers/databases | wlg_active_queries_timeouts | Workload group query timeouts | 
| Microsoft.Sql/servers/databases | wlg_queued_queries_timeouts | Workload group queued query timeouts | 
| Microsoft.Sql/servers/databases | wlg_effective_min_resource_percent | Effective min resource percent | 
| Microsoft.Sql/servers/databases | wlg_effective_cap_resource_percent | Effective cap resource percent | 
| Microsoft.Sql/servers/elasticPools | cpu_percent | CPU percentage | 
| Microsoft.Sql/servers/elasticPools | physical_data_read_percent | Data IO percentage | 
| Microsoft.Sql/servers/elasticPools | log_write_percent | Log IO percentage | 
| Microsoft.Sql/servers/elasticPools | dtu_consumption_percent | DTU percentage | 
| Microsoft.Sql/servers/elasticPools | workers_percent | Workers percentage | 
| Microsoft.Sql/servers/elasticPools | sessions_percent | Sessions percentage | 
| Microsoft.Sql/servers/elasticPools | eDTU_used | eDTU used | 
| Microsoft.Sql/servers/elasticPools | xtp_storage_percent | In-Memory OLTP storage percent | 
| Microsoft.Sql/servers | dtu_consumption_percent | DTU percentage | 
| Microsoft.Sql/servers | dtu_used | DTU used | 
| Microsoft.Sql/managedInstances | avg_cpu_percent | Average CPU percentage |