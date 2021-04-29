---
title: Azure Monitor supported metrics by resource type
description: List of metrics available for each resource type with Azure Monitor.
author: rboucher
services: azure-monitor
ms.topic: reference
ms.date: 04/15/2021
ms.author: robb
---
# Supported metrics with Azure Monitor

> [!NOTE]
> This list is largely auto-generated. Any modification made to this list via GitHub may be written over without warning. Contact the author of this article for details on how to make permanent updates.

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. 

This article is a complete list of all platform (that is, automatically collected) metrics currently available with Azure Monitor's consolidated metric pipeline. Metrics changed or added after the date at the top of this article may not yet appear below. To query for and access the list of metrics programmatically, please use the [2018-01-01 api-version](/rest/api/monitor/metricdefinitions). Other metrics not on this list may be available in the portal or using legacy APIs.

The metrics are organized by resource providers and resource type. For a list of services and the resource providers and types that belong to them, see [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md).  

## Exporting platform metrics to other locations

You can export the platform metrics from the Azure monitor pipeline to other locations in one of two ways.
1. Use the [metrics REST API](/rest/api/monitor/metrics/list)
2. Use [diagnostics settings](../essentials/diagnostic-settings.md) to route platform metrics to 
    - Azure Storage
    - Azure Monitor Logs (and thus Log Analytics)
    - Event hubs, which is how you get them to non-Microsoft systems 

Using diagnostic settings is the easiest way to route the metrics, but there are some limitations: 

- **Some not exportable** - All metrics are exportable using the REST API, but some cannot be exported using Diagnostic Settings because of intricacies in the Azure Monitor backend. The column *Exportable via Diagnostic Settings* in the tables below list which metrics can be exported in this way.  

- **Multi-dimensional metrics** - Sending multi-dimensional metrics to other locations via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values. *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.

## Guest OS and Host OS Metrics

> [!WARNING]
> Metrics for the guest operating system (guest OS) which runs in Azure Virtual Machines, Service Fabric, and Cloud Services are **NOT** listed here. Guest OS metrics must be collected through the one or more agents which run on or as part of the guest operating system.  Guest OS metrics include performance counters which track guest CPU percentage or memory usage, both of which are frequently used for auto-scaling or alerting. 
>
> **Host OS metrics ARE available and listed below.** They are not the same. The Host OS metrics relate to the Hyper-V session hosting your guest OS session. 

> [!TIP]
> Best practice is to use and configure the [Azure Diagnostics extension](../agents/diagnostics-extension-overview.md) to send guest OS performance metrics into the same Azure Monitor metric database where platform metrics are stored. The extension routes guest OS metrics through the [custom metrics](../essentials/metrics-custom-overview.md) API. Then you can chart, alert and otherwise use guest OS metrics like platform metrics. Alternatively or in addition, you can use the Log Analytics agent to send guest OS metrics to Azure Monitor Logs / Log Analytics. There you can query on those metrics in combination with non-metric data. 

For important additional information, see [Monitoring Agents Overview](../agents/agents-overview.md).

## Table formatting

> [!IMPORTANT] 
> This latest update adds a new column and reordered the metrics to be alphabetic. The addition information means that the tables below may have a horizontal scroll bar at the bottom, depending on the width of your browser window. If you believe you are missing information, use the scroll bar to see the entirety of the table.
## microsoft.aadiam/azureADMetrics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ThrottledRequests|No|ThrottledRequests|Count|Average|azureADMetrics type metric|No Dimensions|


## Microsoft.AnalysisServices/servers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CleanerCurrentPrice|Yes|Memory: Cleaner Current Price|Count|Average|Current price of memory, $/byte/time, normalized to 1000.|ServerResourceType|
|CleanerMemoryNonshrinkable|Yes|Memory: Cleaner Memory nonshrinkable|Bytes|Average|Amount of memory, in bytes, not subject to purging by the background cleaner.|ServerResourceType|
|CleanerMemoryShrinkable|Yes|Memory: Cleaner Memory shrinkable|Bytes|Average|Amount of memory, in bytes, subject to purging by the background cleaner.|ServerResourceType|
|CommandPoolBusyThreads|Yes|Threads: Command pool busy threads|Count|Average|Number of busy threads in the command thread pool.|ServerResourceType|
|CommandPoolIdleThreads|Yes|Threads: Command pool idle threads|Count|Average|Number of idle threads in the command thread pool.|ServerResourceType|
|CommandPoolJobQueueLength|Yes|Command Pool Job Queue Length|Count|Average|Number of jobs in the queue of the command thread pool.|ServerResourceType|
|CurrentConnections|Yes|Connection: Current connections|Count|Average|Current number of client connections established.|ServerResourceType|
|CurrentUserSessions|Yes|Current User Sessions|Count|Average|Current number of user sessions established.|ServerResourceType|
|LongParsingBusyThreads|Yes|Threads: Long parsing busy threads|Count|Average|Number of busy threads in the long parsing thread pool.|ServerResourceType|
|LongParsingIdleThreads|Yes|Threads: Long parsing idle threads|Count|Average|Number of idle threads in the long parsing thread pool.|ServerResourceType|
|LongParsingJobQueueLength|Yes|Threads: Long parsing job queue length|Count|Average|Number of jobs in the queue of the long parsing thread pool.|ServerResourceType|
|mashup_engine_memory_metric|Yes|M Engine Memory|Bytes|Average|Memory usage by mashup engine processes|ServerResourceType|
|mashup_engine_private_bytes_metric|Yes|M Engine Private Bytes|Bytes|Average|Private bytes usage by mashup engine processes.|ServerResourceType|
|mashup_engine_qpu_metric|Yes|M Engine QPU|Count|Average|QPU usage by mashup engine processes|ServerResourceType|
|mashup_engine_virtual_bytes_metric|Yes|M Engine Virtual Bytes|Bytes|Average|Virtual bytes usage by mashup engine processes.|ServerResourceType|
|memory_metric|Yes|Memory|Bytes|Average|Memory. Range 0-25 GB for S1, 0-50 GB for S2 and 0-100 GB for S4|ServerResourceType|
|memory_thrashing_metric|Yes|Memory Thrashing|Percent|Average|Average memory thrashing.|ServerResourceType|
|MemoryLimitHard|Yes|Memory: Memory Limit Hard|Bytes|Average|Hard memory limit, from configuration file.|ServerResourceType|
|MemoryLimitHigh|Yes|Memory: Memory Limit High|Bytes|Average|High memory limit, from configuration file.|ServerResourceType|
|MemoryLimitLow|Yes|Memory: Memory Limit Low|Bytes|Average|Low memory limit, from configuration file.|ServerResourceType|
|MemoryLimitVertiPaq|Yes|Memory: Memory Limit VertiPaq|Bytes|Average|In-memory limit, from configuration file.|ServerResourceType|
|MemoryUsage|Yes|Memory: Memory Usage|Bytes|Average|Memory usage of the server process as used in calculating cleaner memory price. Equal to counter Process\PrivateBytes plus the size of memory-mapped data, ignoring any memory which was mapped or allocated by the xVelocity in-memory analytics engine (VertiPaq) in excess of the xVelocity engine Memory Limit.|ServerResourceType|
|private_bytes_metric|Yes|Private Bytes|Bytes|Average|Private bytes.|ServerResourceType|
|ProcessingPoolBusyIOJobThreads|Yes|Threads: Processing pool busy I/O job threads|Count|Average|Number of threads running I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolBusyNonIOThreads|Yes|Threads: Processing pool busy non-I/O threads|Count|Average|Number of threads running non-I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolIdleIOJobThreads|Yes|Threads: Processing pool idle I/O job threads|Count|Average|Number of idle threads for I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolIdleNonIOThreads|Yes|Threads: Processing pool idle non-I/O threads|Count|Average|Number of idle threads in the processing thread pool dedicated to non-I/O jobs.|ServerResourceType|
|ProcessingPoolIOJobQueueLength|Yes|Threads: Processing pool I/O job queue length|Count|Average|Number of I/O jobs in the queue of the processing thread pool.|ServerResourceType|
|ProcessingPoolJobQueueLength|Yes|Processing Pool Job Queue Length|Count|Average|Number of non-I/O jobs in the queue of the processing thread pool.|ServerResourceType|
|qpu_metric|Yes|QPU|Count|Average|QPU. Range 0-100 for S1, 0-200 for S2 and 0-400 for S4|ServerResourceType|
|QueryPoolBusyThreads|Yes|Query Pool Busy Threads|Count|Average|Number of busy threads in the query thread pool.|ServerResourceType|
|QueryPoolIdleThreads|Yes|Threads: Query pool idle threads|Count|Average|Number of idle threads for I/O jobs in the processing thread pool.|ServerResourceType|
|QueryPoolJobQueueLength|Yes|Threads: Query pool job queue lengt|Count|Average|Number of jobs in the queue of the query thread pool.|ServerResourceType|
|Quota|Yes|Memory: Quota|Bytes|Average|Current memory quota, in bytes. Memory quota is also known as a memory grant or memory reservation.|ServerResourceType|
|QuotaBlocked|Yes|Memory: Quota Blocked|Count|Average|Current number of quota requests that are blocked until other memory quotas are freed.|ServerResourceType|
|RowsConvertedPerSec|Yes|Processing: Rows converted per sec|CountPerSecond|Average|Rate of rows converted during processing.|ServerResourceType|
|RowsReadPerSec|Yes|Processing: Rows read per sec|CountPerSecond|Average|Rate of rows read from all relational databases.|ServerResourceType|
|RowsWrittenPerSec|Yes|Processing: Rows written per sec|CountPerSecond|Average|Rate of rows written during processing.|ServerResourceType|
|ShortParsingBusyThreads|Yes|Threads: Short parsing busy threads|Count|Average|Number of busy threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingIdleThreads|Yes|Threads: Short parsing idle threads|Count|Average|Number of idle threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingJobQueueLength|Yes|Threads: Short parsing job queue length|Count|Average|Number of jobs in the queue of the short parsing thread pool.|ServerResourceType|
|SuccessfullConnectionsPerSec|Yes|Successful Connections Per Sec|CountPerSecond|Average|Rate of successful connection completions.|ServerResourceType|
|TotalConnectionFailures|Yes|Total Connection Failures|Count|Average|Total failed connection attempts.|ServerResourceType|
|TotalConnectionRequests|Yes|Total Connection Requests|Count|Average|Total connection requests. These are arrivals.|ServerResourceType|
|VertiPaqNonpaged|Yes|Memory: VertiPaq Nonpaged|Bytes|Average|Bytes of memory locked in the working set for use by the in-memory engine.|ServerResourceType|
|VertiPaqPaged|Yes|Memory: VertiPaq Paged|Bytes|Average|Bytes of paged memory in use for in-memory data.|ServerResourceType|
|virtual_bytes_metric|Yes|Virtual Bytes|Bytes|Average|Virtual bytes.|ServerResourceType|


## Microsoft.ApiManagement/service

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackendDuration|Yes|Duration of Backend Requests|Milliseconds|Average|Duration of Backend Requests in milliseconds|Location, Hostname|
|Capacity|Yes|Capacity|Percent|Average|Utilization metric for ApiManagement service|Location|
|Duration|Yes|Overall Duration of Gateway Requests|Milliseconds|Average|Overall Duration of Gateway Requests in milliseconds|Location, Hostname|
|EventHubDroppedEvents|Yes|Dropped EventHub Events|Count|Total|Number of events skipped because of queue size limit reached|Location|
|EventHubRejectedEvents|Yes|Rejected EventHub Events|Count|Total|Number of rejected EventHub events (wrong configuration or unauthorized)|Location|
|EventHubSuccessfulEvents|Yes|Successful EventHub Events|Count|Total|Number of successful EventHub events|Location|
|EventHubThrottledEvents|Yes|Throttled EventHub Events|Count|Total|Number of throttled EventHub events|Location|
|EventHubTimedoutEvents|Yes|Timed Out EventHub Events|Count|Total|Number of timed out EventHub events|Location|
|EventHubTotalBytesSent|Yes|Size of EventHub Events|Bytes|Total|Total size of EventHub events in bytes|Location|
|EventHubTotalEvents|Yes|Total EventHub Events|Count|Total|Number of events sent to EventHub|Location|
|EventHubTotalFailedEvents|Yes|Failed EventHub Events|Count|Total|Number of failed EventHub events|Location|
|FailedRequests|Yes|Failed Gateway Requests (Deprecated)|Count|Total|Number of failures in gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location, Hostname|
|NetworkConnectivity|Yes|Network Connectivity Status of Resources (Preview)|Count|Average|Network Connectivity status of dependent resource types from API Management service|Location, ResourceType|
|OtherRequests|Yes|Other Gateway Requests (Deprecated)|Count|Total|Number of other gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location, Hostname|
|Requests|Yes|Requests|Count|Total|Gateway request metrics with multiple dimensions|Location, Hostname, LastErrorReason, BackendResponseCode, GatewayResponseCode, BackendResponseCodeCategory, GatewayResponseCodeCategory|
|SuccessfulRequests|Yes|Successful Gateway Requests (Deprecated)|Count|Total|Number of successful gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location, Hostname|
|TotalRequests|Yes|Total Gateway Requests (Deprecated)|Count|Total|Number of gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location, Hostname|
|UnauthorizedRequests|Yes|Unauthorized Gateway Requests (Deprecated)|Count|Total|Number of unauthorized gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location, Hostname|


## Microsoft.AppConfiguration/configurationStores

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HttpIncomingRequestCount|Yes|HttpIncomingRequestCount|Count|Count|Total number of incoming http requests.|StatusCode, Authentication|
|HttpIncomingRequestDuration|Yes|HttpIncomingRequestDuration|Count|Average|Latency on an http request.|StatusCode, Authentication|
|ThrottledHttpRequestCount|Yes|ThrottledHttpRequestCount|Count|Count|Throttled http requests.|No Dimensions|

## Microsoft.AppPlatform/Spring

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active-timer-count|Yes|active-timer-count|Count|Average|Number of timers that are currently active|Deployment, AppName, Pod|
|alloc-rate|Yes|alloc-rate|Bytes|Average|Number of bytes allocated in the managed heap|Deployment, AppName, Pod|
|AppCpuUsage|Yes|App CPU Usage |Percent|Average|The recent CPU usage for the app|Deployment, AppName, Pod|
|assembly-count|Yes|assembly-count|Count|Average|Number of Assemblies Loaded|Deployment, AppName, Pod|
|cpu-usage|Yes|cpu-usage|Percent|Average|% time the process has utilized the CPU|Deployment, AppName, Pod|
|current-requests|Yes|current-requests|Count|Average|Total number of requests in processing in the lifetime of the process|Deployment, AppName, Pod|
|exception-count|Yes|exception-count|Count|Total|Number of Exceptions|Deployment, AppName, Pod|
|failed-requests|Yes|failed-requests|Count|Average|Total number of failed requests in the lifetime of the process|Deployment, AppName, Pod|
|gc-heap-size|Yes|gc-heap-size|Count|Average|Total heap size reported by the GC (MB)|Deployment, AppName, Pod|
|gen-0-gc-count|Yes|gen-0-gc-count|Count|Average|Number of Gen 0 GCs|Deployment, AppName, Pod|
|gen-0-size|Yes|gen-0-size|Bytes|Average|Gen 0 Heap Size|Deployment, AppName, Pod|
|gen-1-gc-count|Yes|gen-1-gc-count|Count|Average|Number of Gen 1 GCs|Deployment, AppName, Pod|
|gen-1-size|Yes|gen-1-size|Bytes|Average|Gen 1 Heap Size|Deployment, AppName, Pod|
|gen-2-gc-count|Yes|gen-2-gc-count|Count|Average|Number of Gen 2 GCs|Deployment, AppName, Pod|
|gen-2-size|Yes|gen-2-size|Bytes|Average|Gen 2 Heap Size|Deployment, AppName, Pod|
|jvm.gc.live.data.size|Yes|jvm.gc.live.data.size|Bytes|Average|Size of old generation memory pool after a full GC|Deployment, AppName, Pod|
|jvm.gc.max.data.size|Yes|jvm.gc.max.data.size|Bytes|Average|Max size of old generation memory pool|Deployment, AppName, Pod|
|jvm.gc.memory.allocated|Yes|jvm.gc.memory.allocated|Bytes|Maximum|Incremented for an increase in the size of the young generation memory pool after one GC to before the next|Deployment, AppName, Pod|
|jvm.gc.memory.promoted|Yes|jvm.gc.memory.promoted|Bytes|Maximum|Count of positive increases in the size of the old generation memory pool before GC to after GC|Deployment, AppName, Pod|
|jvm.gc.pause.total.count|Yes|jvm.gc.pause.total.count|Count|Total|GC Pause Count|Deployment, AppName, Pod|
|jvm.gc.pause.total.time|Yes|jvm.gc.pause.total.time|Milliseconds|Total|GC Pause Total Time|Deployment, AppName, Pod|
|jvm.memory.committed|Yes|jvm.memory.committed|Bytes|Average|Memory assigned to JVM in bytes|Deployment, AppName, Pod|
|jvm.memory.max|Yes|jvm.memory.max|Bytes|Maximum|The maximum amount of memory in bytes that can be used for memory management|Deployment, AppName, Pod|
|jvm.memory.used|Yes|jvm.memory.used|Bytes|Average|App Memory Used in bytes|Deployment, AppName, Pod|
|loh-size|Yes|loh-size|Bytes|Average|LOH Heap Size|Deployment, AppName, Pod|
|monitor-lock-contention-count|Yes|monitor-lock-contention-count|Count|Average|Number of times there were contention when trying to take the monitor lock|Deployment, AppName, Pod|
|process.cpu.usage|Yes|process.cpu.usage|Percent|Average|The recent CPU usage for the JVM process|Deployment, AppName, Pod|
|requests-per-second|Yes|requests-rate|Count|Average|Request rate|Deployment, AppName, Pod|
|system.cpu.usage|Yes|system.cpu.usage|Percent|Average|The recent CPU usage for the whole system|Deployment, AppName, Pod|
|threadpool-completed-items-count|Yes|threadpool-completed-items-count|Count|Average|ThreadPool Completed Work Items Count|Deployment, AppName, Pod|
|threadpool-queue-length|Yes|threadpool-queue-length|Count|Average|ThreadPool Work Items Queue Length|Deployment, AppName, Pod|
|threadpool-thread-count|Yes|threadpool-thread-count|Count|Average|Number of ThreadPool Threads|Deployment, AppName, Pod|
|time-in-gc|Yes|time-in-gc|Percent|Average|% time in GC since the last GC|Deployment, AppName, Pod|
|tomcat.global.error|Yes|tomcat.global.error|Count|Total|Tomcat Global Error|Deployment, AppName, Pod|
|tomcat.global.received|Yes|tomcat.global.received|Bytes|Total|Tomcat Total Received Bytes|Deployment, AppName, Pod|
|tomcat.global.request.avg.time|Yes|tomcat.global.request.avg.time|Milliseconds|Average|Tomcat Request Average Time|Deployment, AppName, Pod|
|tomcat.global.request.max|Yes|tomcat.global.request.max|Milliseconds|Maximum|Tomcat Request Max Time|Deployment, AppName, Pod|
|tomcat.global.request.total.count|Yes|tomcat.global.request.total.count|Count|Total|Tomcat Request Total Count|Deployment, AppName, Pod|
|tomcat.global.request.total.time|Yes|tomcat.global.request.total.time|Milliseconds|Total|Tomcat Request Total Time|Deployment, AppName, Pod|
|tomcat.global.sent|Yes|tomcat.global.sent|Bytes|Total|Tomcat Total Sent Bytes|Deployment, AppName, Pod|
|tomcat.sessions.active.current|Yes|tomcat.sessions.active.current|Count|Total|Tomcat Session Active Count|Deployment, AppName, Pod|
|tomcat.sessions.active.max|Yes|tomcat.sessions.active.max|Count|Total|Tomcat Session Max Active Count|Deployment, AppName, Pod|
|tomcat.sessions.alive.max|Yes|tomcat.sessions.alive.max|Milliseconds|Maximum|Tomcat Session Max Alive Time|Deployment, AppName, Pod|
|tomcat.sessions.created|Yes|tomcat.sessions.created|Count|Total|Tomcat Session Created Count|Deployment, AppName, Pod|
|tomcat.sessions.expired|Yes|tomcat.sessions.expired|Count|Total|Tomcat Session Expired Count|Deployment, AppName, Pod|
|tomcat.sessions.rejected|Yes|tomcat.sessions.rejected|Count|Total|Tomcat Session Rejected Count|Deployment, AppName, Pod|
|tomcat.threads.config.max|Yes|tomcat.threads.config.max|Count|Total|Tomcat Config Max Thread Count|Deployment, AppName, Pod|
|tomcat.threads.current|Yes|tomcat.threads.current|Count|Total|Tomcat Current Thread Count|Deployment, AppName, Pod|
|total-requests|Yes|total-requests|Count|Average|Total number of requests in the lifetime of the process|Deployment, AppName, Pod|
|working-set|Yes|working-set|Count|Average|Amount of working set used by the process (MB)|Deployment, AppName, Pod|

## Microsoft.Automation/automationAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|TotalJob|Yes|Total Jobs|Count|Total|The total number of jobs|Runbook, Status|
|TotalUpdateDeploymentMachineRuns|Yes|Total Update Deployment Machine Runs|Count|Total|Total software update deployment machine runs in a software update deployment run|SoftwareUpdateConfigurationName, Status, TargetComputer, SoftwareUpdateConfigurationRunId|
|TotalUpdateDeploymentRuns|Yes|Total Update Deployment Runs|Count|Total|Total software update deployment runs|SoftwareUpdateConfigurationName, Status|


## Microsoft.AVS/privateClouds

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CapacityLatest|Yes|Datastore Disk Total Capacity|Bytes|Average|The total capacity of disk in the datastore|dsname|
|DiskUsedPercentage|Yes| Percentage Datastore Disk Used|Percent|Average|Percent of available disk used in Datastore|dsname|
|EffectiveCpuAverage|Yes|Percentage CPU|Percent|Average|Percentage of Used CPU resources in Cluster|clustername|
|EffectiveMemAverage|Yes|Average Effective Memory|Bytes|Average|Total available amount of machine memory in cluster|clustername|
|OverheadAverage|Yes|Average Memory Overhead|Bytes|Average|Host physical memory consumed by the virtualization infrastructure|clustername|
|TotalMbAverage|Yes|Average Total Memory|Bytes|Average|Total memory in cluster|clustername|
|UsageAverage|Yes|Average Memory Usage|Percent|Average|Memory usage as percentage of total configured or available memory|clustername|
|UsedLatest|Yes|Datastore Disk Used|Bytes|Average|The total amount of disk used in the datastore|dsname|


## Microsoft.Batch/batchAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CoreCount|No|Dedicated Core Count|Count|Total|Total number of dedicated cores in the batch account|No Dimensions|
|CreatingNodeCount|No|Creating Node Count|Count|Total|Number of nodes being created|No Dimensions|
|IdleNodeCount|No|Idle Node Count|Count|Total|Number of idle nodes|No Dimensions|
|JobDeleteCompleteEvent|Yes|Job Delete Complete Events|Count|Total|Total number of jobs that have been successfully deleted.|jobId|
|JobDeleteStartEvent|Yes|Job Delete Start Events|Count|Total|Total number of jobs that have been requested to be deleted.|jobId|
|JobDisableCompleteEvent|Yes|Job Disable Complete Events|Count|Total|Total number of jobs that have been successfully disabled.|jobId|
|JobDisableStartEvent|Yes|Job Disable Start Events|Count|Total|Total number of jobs that have been requested to be disabled.|jobId|
|JobStartEvent|Yes|Job Start Events|Count|Total|Total number of jobs that have been successfully started.|jobId|
|JobTerminateCompleteEvent|Yes|Job Terminate Complete Events|Count|Total|Total number of jobs that have been successfully terminated.|jobId|
|JobTerminateStartEvent|Yes|Job Terminate Start Events|Count|Total|Total number of jobs that have been requested to be terminated.|jobId|
|LeavingPoolNodeCount|No|Leaving Pool Node Count|Count|Total|Number of nodes leaving the Pool|No Dimensions|
|LowPriorityCoreCount|No|LowPriority Core Count|Count|Total|Total number of low-priority cores in the batch account|No Dimensions|
|OfflineNodeCount|No|Offline Node Count|Count|Total|Number of offline nodes|No Dimensions|
|PoolCreateEvent|Yes|Pool Create Events|Count|Total|Total number of pools that have been created|poolId|
|PoolDeleteCompleteEvent|Yes|Pool Delete Complete Events|Count|Total|Total number of pool deletes that have completed|poolId|
|PoolDeleteStartEvent|Yes|Pool Delete Start Events|Count|Total|Total number of pool deletes that have started|poolId|
|PoolResizeCompleteEvent|Yes|Pool Resize Complete Events|Count|Total|Total number of pool resizes that have completed|poolId|
|PoolResizeStartEvent|Yes|Pool Resize Start Events|Count|Total|Total number of pool resizes that have started|poolId|
|PreemptedNodeCount|No|Preempted Node Count|Count|Total|Number of preempted nodes|No Dimensions|
|RebootingNodeCount|No|Rebooting Node Count|Count|Total|Number of rebooting nodes|No Dimensions|
|ReimagingNodeCount|No|Reimaging Node Count|Count|Total|Number of reimaging nodes|No Dimensions|
|RunningNodeCount|No|Running Node Count|Count|Total|Number of running nodes|No Dimensions|
|StartingNodeCount|No|Starting Node Count|Count|Total|Number of nodes starting|No Dimensions|
|StartTaskFailedNodeCount|No|Start Task Failed Node Count|Count|Total|Number of nodes where the Start Task has failed|No Dimensions|
|TaskCompleteEvent|Yes|Task Complete Events|Count|Total|Total number of tasks that have completed|poolId, jobId|
|TaskFailEvent|Yes|Task Fail Events|Count|Total|Total number of tasks that have completed in a failed state|poolId, jobId|
|TaskStartEvent|Yes|Task Start Events|Count|Total|Total number of tasks that have started|poolId, jobId|
|TotalLowPriorityNodeCount|No|Low-Priority Node Count|Count|Total|Total number of low-priority nodes in the batch account|No Dimensions|
|TotalNodeCount|No|Dedicated Node Count|Count|Total|Total number of dedicated nodes in the batch account|No Dimensions|
|UnusableNodeCount|No|Unusable Node Count|Count|Total|Number of unusable nodes|No Dimensions|
|WaitingForStartTaskNodeCount|No|Waiting For Start Task Node Count|Count|Total|Number of nodes waiting for the Start Task to complete|No Dimensions|


## Microsoft.BatchAI/workspaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Active Cores|Yes|Active Cores|Count|Average|Number of active cores|Scenario, ClusterName|
|Active Nodes|Yes|Active Nodes|Count|Average|Number of running nodes|Scenario, ClusterName|
|Idle Cores|Yes|Idle Cores|Count|Average|Number of idle cores|Scenario, ClusterName|
|Idle Nodes|Yes|Idle Nodes|Count|Average|Number of idle nodes|Scenario, ClusterName|
|Job Completed|Yes|Job Completed|Count|Total|Number of jobs completed|Scenario, ClusterName, ResultType|
|Job Submitted|Yes|Job Submitted|Count|Total|Number of jobs submitted|Scenario, ClusterName|
|Leaving Cores|Yes|Leaving Cores|Count|Average|Number of leaving cores|Scenario, ClusterName|
|Leaving Nodes|Yes|Leaving Nodes|Count|Average|Number of leaving nodes|Scenario, ClusterName|
|Preempted Cores|Yes|Preempted Cores|Count|Average|Number of preempted cores|Scenario, ClusterName|
|Preempted Nodes|Yes|Preempted Nodes|Count|Average|Number of preempted nodes|Scenario, ClusterName|
|Quota Utilization Percentage|Yes|Quota Utilization Percentage|Count|Average|Percent of quota utilized|Scenario, ClusterName, VmFamilyName, VmPriority|
|Total Cores|Yes|Total Cores|Count|Average|Number of total cores|Scenario, ClusterName|
|Total Nodes|Yes|Total Nodes|Count|Average|Number of total nodes|Scenario, ClusterName|
|Unusable Cores|Yes|Unusable Cores|Count|Average|Number of unusable cores|Scenario, ClusterName|
|Unusable Nodes|Yes|Unusable Nodes|Count|Average|Number of unusable nodes|Scenario, ClusterName|

## microsoft.bing/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BlockedCalls|Yes|Blocked Calls|Count|Total|Number of calls that exceeded the rate or quota limit|ApiName, ServingRegion, StatusCode|
|ClientErrors|Yes|Client Errors|Count|Total|Number of calls with any client error (HTTP status code 4xx)|ApiName, ServingRegion, StatusCode|
|DataIn|Yes|Data In|Bytes|Total|Incoming request Content-Length in bytes|ApiName, ServingRegion, StatusCode|
|DataOut|Yes|Data Out|Bytes|Total|Outgoing response Content-Length in bytes|ApiName, ServingRegion, StatusCode|
|Latency|Yes|Latency|Milliseconds|Average|Latency in milliseconds|ApiName, ServingRegion, StatusCode|
|ServerErrors|Yes|Server Errors|Count|Total|Number of calls with any server error (HTTP status code 5xx)|ApiName, ServingRegion, StatusCode|
|SuccessfulCalls|Yes|Successful Calls|Count|Total|Number of successful calls (HTTP status code 2xx)|ApiName, ServingRegion, StatusCode|
|TotalCalls|Yes|Total Calls|Count|Total|Total number of calls|ApiName, ServingRegion, StatusCode|
|TotalErrors|Yes|Total Errors|Count|Total|Number of calls with any error (HTTP status code 4xx or 5xx)|ApiName, ServingRegion, StatusCode|


## Microsoft.Blockchain/blockchainMembers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BroadcastProcessedCount|Yes|BroadcastProcessedCountDisplayName|Count|Average|The number of transactions processed.|Node, channel, type, status|
|ChaincodeExecuteTimeouts|Yes|ChaincodeExecuteTimeoutsDisplayName|Count|Average|The number of chaincode executions (Init or Invoke) that have timed out.|Node, chaincode|
|ChaincodeLaunchFailures|Yes|ChaincodeLaunchFailuresDisplayName|Count|Average|The number of chaincode launches that have failed.|Node, chaincode|
|ChaincodeLaunchTimeouts|Yes|ChaincodeLaunchTimeoutsDisplayName|Count|Average|The number of chaincode launches that have timed out.|Node, chaincode|
|ChaincodeShimRequestsCompleted|Yes|ChaincodeShimRequestsCompletedDisplayName|Count|Average|The number of chaincode shim requests completed.|Node, type, channel, chaincode, success|
|ChaincodeShimRequestsReceived|Yes|ChaincodeShimRequestsReceivedDisplayName|Count|Average|The number of chaincode shim requests received.|Node, type, channel, chaincode|
|ClusterCommEgressQueueCapacity|Yes|ClusterCommEgressQueueCapacityDisplayName|Count|Average|Capacity of the egress queue.|Node, host, msg_type, channel|
|ClusterCommEgressQueueLength|Yes|ClusterCommEgressQueueLengthDisplayName|Count|Average|Length of the egress queue.|Node, host, msg_type, channel|
|ClusterCommEgressQueueWorkers|Yes|ClusterCommEgressQueueWorkersDisplayName|Count|Average|Count of egress queue workers.|Node, channel|
|ClusterCommEgressStreamCount|Yes|ClusterCommEgressStreamCountDisplayName|Count|Average|Count of streams to other nodes.|Node, channel|
|ClusterCommEgressTlsConnectionCount|Yes|ClusterCommEgressTlsConnectionCountDisplayName|Count|Average|Count of TLS connections to other nodes.|Node|
|ClusterCommIngressStreamCount|Yes|ClusterCommIngressStreamCountDisplayName|Count|Average|Count of streams from other nodes.|Node|
|ClusterCommMsgDroppedCount|Yes|ClusterCommMsgDroppedCountDisplayName|Count|Average|Count of messages dropped.|Node, host, channel|
|ConnectionAccepted|Yes|Accepted Connections|Count|Total|Accepted Connections|Node|
|ConnectionActive|Yes|Active Connections|Count|Average|Active Connections|Node|
|ConnectionHandled|Yes|Handled Connections|Count|Total|Handled Connections|Node|
|ConsensusEtcdraftActiveNodes|Yes|ConsensusEtcdraftActiveNodesDisplayName|Count|Average|Number of active nodes in this channel.|Node, channel|
|ConsensusEtcdraftClusterSize|Yes|ConsensusEtcdraftClusterSizeDisplayName|Count|Average|Number of nodes in this channel.|Node, channel|
|ConsensusEtcdraftCommittedBlockNumber|Yes|ConsensusEtcdraftCommittedBlockNumberDisplayName|Count|Average|The block number of the latest block committed.|Node, channel|
|ConsensusEtcdraftConfigProposalsReceived|Yes|ConsensusEtcdraftConfigProposalsReceivedDisplayName|Count|Average|The total number of proposals received for config type transactions.|Node, channel|
|ConsensusEtcdraftIsLeader|Yes|ConsensusEtcdraftIsLeaderDisplayName|Count|Average|The leadership status of the current node: 1 if it is the leader else 0.|Node, channel|
|ConsensusEtcdraftLeaderChanges|Yes|ConsensusEtcdraftLeaderChangesDisplayName|Count|Average|The number of leader changes since process start.|Node, channel|
|ConsensusEtcdraftNormalProposalsReceived|Yes|ConsensusEtcdraftNormalProposalsReceivedDisplayName|Count|Average|The total number of proposals received for normal type transactions.|Node, channel|
|ConsensusEtcdraftProposalFailures|Yes|ConsensusEtcdraftProposalFailuresDisplayName|Count|Average|The number of proposal failures.|Node, channel|
|ConsensusEtcdraftSnapshotBlockNumber|Yes|ConsensusEtcdraftSnapshotBlockNumberDisplayName|Count|Average|The block number of the latest snapshot.|Node, channel|
|ConsensusKafkaBatchSize|Yes|ConsensusKafkaBatchSizeDisplayName|Count|Average|The mean batch size in bytes sent to topics.|Node, topic|
|ConsensusKafkaCompressionRatio|Yes|ConsensusKafkaCompressionRatioDisplayName|Count|Average|The mean compression ratio (as percentage) for topics.|Node, topic|
|ConsensusKafkaIncomingByteRate|Yes|ConsensusKafkaIncomingByteRateDisplayName|Count|Average|Bytes/second read off brokers.|Node, broker_id|
|ConsensusKafkaLastOffsetPersisted|Yes|ConsensusKafkaLastOffsetPersistedDisplayName|Count|Average|The offset specified in the block metadata of the most recently committed block.|Node, channel|
|ConsensusKafkaOutgoingByteRate|Yes|ConsensusKafkaOutgoingByteRateDisplayName|Count|Average|Bytes/second written to brokers.|Node, broker_id|
|ConsensusKafkaRecordSendRate|Yes|ConsensusKafkaRecordSendRateDisplayName|Count|Average|The number of records per second sent to topics.|Node, topic|
|ConsensusKafkaRecordsPerRequest|Yes|ConsensusKafkaRecordsPerRequestDisplayName|Count|Average|The mean number of records sent per request to topics.|Node, topic|
|ConsensusKafkaRequestLatency|Yes|ConsensusKafkaRequestLatencyDisplayName|Count|Average|The mean request latency in ms to brokers.|Node, broker_id|
|ConsensusKafkaRequestRate|Yes|ConsensusKafkaRequestRateDisplayName|Count|Average|Requests/second sent to brokers.|Node, broker_id|
|ConsensusKafkaRequestSize|Yes|ConsensusKafkaRequestSizeDisplayName|Count|Average|The mean request size in bytes to brokers.|Node, broker_id|
|ConsensusKafkaResponseRate|Yes|ConsensusKafkaResponseRateDisplayName|Count|Average|Requests/second sent to brokers.|Node, broker_id|
|ConsensusKafkaResponseSize|Yes|ConsensusKafkaResponseSizeDisplayName|Count|Average|The mean response size in bytes from brokers.|Node, broker_id|
|CpuUsagePercentageInDouble|Yes|CPU Usage Percentage|Percent|Maximum|CPU Usage Percentage|Node|
|DeliverBlocksSent|Yes|DeliverBlocksSentDisplayName|Count|Average|The number of blocks sent by the deliver service.|Node, channel, filtered, data_type|
|DeliverRequestsCompleted|Yes|DeliverRequestsCompletedDisplayName|Count|Average|The number of deliver requests that have been completed.|Node, channel, filtered, data_type, success|
|DeliverRequestsReceived|Yes|DeliverRequestsReceivedDisplayName|Count|Average|The number of deliver requests that have been received.|Node, channel, filtered, data_type|
|DeliverStreamsClosed|Yes|DeliverStreamsClosedDisplayName|Count|Average|The number of GRPC streams that have been closed for the deliver service.|Node|
|DeliverStreamsOpened|Yes|DeliverStreamsOpenedDisplayName|Count|Average|The number of GRPC streams that have been opened for the deliver service.|Node|
|EndorserChaincodeInstantiationFailures|Yes|EndorserChaincodeInstantiationFailuresDisplayName|Count|Average|The number of chaincode instantiations or upgrade that have failed.|Node, channel, chaincode|
|EndorserDuplicateTransactionFailures|Yes|EndorserDuplicateTransactionFailuresDisplayName|Count|Average|The number of failed proposals due to duplicate transaction ID.|Node, channel, chaincode|
|EndorserEndorsementFailures|Yes|EndorserEndorsementFailuresDisplayName|Count|Average|The number of failed endorsements.|Node, channel, chaincode, chaincodeerror|
|EndorserProposalAclFailures|Yes|EndorserProposalAclFailuresDisplayName|Count|Average|The number of proposals that failed ACL checks.|Node, channel, chaincode|
|EndorserProposalSimulationFailures|Yes|EndorserProposalSimulationFailuresDisplayName|Count|Average|The number of failed proposal simulations.|Node, channel, chaincode|
|EndorserProposalsReceived|Yes|EndorserProposalsReceivedDisplayName|Count|Average|The number of proposals received.|Node|
|EndorserProposalValidationFailures|Yes|EndorserProposalValidationFailuresDisplayName|Count|Average|The number of proposals that have failed initial validation.|Node|
|EndorserSuccessfulProposals|Yes|EndorserSuccessfulProposalsDisplayName|Count|Average|The number of successful proposals.|Node|
|FabricVersion|Yes|FabricVersionDisplayName|Count|Average|The active version of Fabric.|Node, version|
|GossipCommMessagesReceived|Yes|GossipCommMessagesReceivedDisplayName|Count|Average|Number of messages received.|Node|
|GossipCommMessagesSent|Yes|GossipCommMessagesSentDisplayName|Count|Average|Number of messages sent.|Node|
|GossipCommOverflowCount|Yes|GossipCommOverflowCountDisplayName|Count|Average|Number of outgoing queue buffer overflows.|Node|
|GossipLeaderElectionLeader|Yes|GossipLeaderElectionLeaderDisplayName|Count|Average|Peer is leader (1) or follower (0).|Node, channel|
|GossipMembershipTotalPeersKnown|Yes|GossipMembershipTotalPeersKnownDisplayName|Count|Average|Total known peers.|Node, channel|
|GossipPayloadBufferSize|Yes|GossipPayloadBufferSizeDisplayName|Count|Average|Size of the payload buffer.|Node, channel|
|GossipStateHeight|Yes|GossipStateHeightDisplayName|Count|Average|Current ledger height.|Node, channel|
|GrpcCommConnClosed|Yes|GrpcCommConnClosedDisplayName|Count|Average|gRPC connections closed. Open minus closed is the active number of connections.|Node|
|GrpcCommConnOpened|Yes|GrpcCommConnOpenedDisplayName|Count|Average|gRPC connections opened. Open minus closed is the active number of connections.|Node|
|GrpcServerStreamMessagesReceived|Yes|GrpcServerStreamMessagesReceivedDisplayName|Count|Average|The number of stream messages received.|Node, service, method|
|GrpcServerStreamMessagesSent|Yes|GrpcServerStreamMessagesSentDisplayName|Count|Average|The number of stream messages sent.|Node, service, method|
|GrpcServerStreamRequestsCompleted|Yes|GrpcServerStreamRequestsCompletedDisplayName|Count|Average|The number of stream requests completed.|Node, service, method, code|
|GrpcServerUnaryRequestsReceived|Yes|GrpcServerUnaryRequestsReceivedDisplayName|Count|Average|The number of unary requests received.|Node, service, method|
|IOReadBytes|Yes|IO Read Bytes|Bytes|Total|IO Read Bytes|Node|
|IOWriteBytes|Yes|IO Write Bytes|Bytes|Total|IO Write Bytes|Node|
|LedgerBlockchainHeight|Yes|LedgerBlockchainHeightDisplayName|Count|Average|Height of the chain in blocks.|Node, channel|
|LedgerTransactionCount|Yes|LedgerTransactionCountDisplayName|Count|Average|Number of transactions processed.|Node, channel, transaction_type, chaincode, validation_code|
|LoggingEntriesChecked|Yes|LoggingEntriesCheckedDisplayName|Count|Average|Number of log entries checked against the active logging level.|Node, level|
|LoggingEntriesWritten|Yes|LoggingEntriesWrittenDisplayName|Count|Average|Number of log entries that are written.|Node, level|
|MemoryLimit|Yes|Memory Limit|Bytes|Average|Memory Limit|Node|
|MemoryUsage|Yes|Memory Usage|Bytes|Average|Memory Usage|Node|
|MemoryUsagePercentageInDouble|Yes|Memory Usage Percentage|Percent|Average|Memory Usage Percentage|Node|
|PendingTransactions|Yes|Pending Transactions|Count|Average|Pending Transactions|Node|
|ProcessedBlocks|Yes|Processed Blocks|Count|Total|Processed Blocks|Node|
|ProcessedTransactions|Yes|Processed Transactions|Count|Total|Processed Transactions|Node|
|QueuedTransactions|Yes|Queued Transactions|Count|Average|Queued Transactions|Node|
|RequestHandled|Yes|Handled Requests|Count|Total|Handled Requests|Node|
|StorageUsage|Yes|Storage Usage|Bytes|Average|Storage Usage|Node|


## microsoft.botservice/botservices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|RequestLatency|Yes|Request Latency|Milliseconds|Total|Time taken by the server to process the request|Operation, Authentication, Protocol, DataCenter|
|RequestsTraffic|Yes|Requests Traffic|Percent|Count|Number of Requests Made|Operation, Authentication, Protocol, StatusCode, StatusCodeClass, DataCenter|


## Microsoft.Cache/redis

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|allcachehits|Yes|Cache Hits (Instance Based)|Count|Total||ShardId, Port, Primary|
|allcachemisses|Yes|Cache Misses (Instance Based)|Count|Total||ShardId, Port, Primary|
|allcacheRead|Yes|Cache Read (Instance Based)|BytesPerSecond|Maximum||ShardId, Port, Primary|
|allcacheWrite|Yes|Cache Write (Instance Based)|BytesPerSecond|Maximum||ShardId, Port, Primary|
|allconnectedclients|Yes|Connected Clients (Instance Based)|Count|Maximum||ShardId, Port, Primary|
|allevictedkeys|Yes|Evicted Keys (Instance Based)|Count|Total||ShardId, Port, Primary|
|allexpiredkeys|Yes|Expired Keys (Instance Based)|Count|Total||ShardId, Port, Primary|
|allgetcommands|Yes|Gets (Instance Based)|Count|Total||ShardId, Port, Primary|
|alloperationsPerSecond|Yes|Operations Per Second (Instance Based)|Count|Maximum||ShardId, Port, Primary|
|allserverLoad|Yes|Server Load (Instance Based)|Percent|Maximum||ShardId, Port, Primary|
|allsetcommands|Yes|Sets (Instance Based)|Count|Total||ShardId, Port, Primary|
|alltotalcommandsprocessed|Yes|Total Operations  (Instance Based)|Count|Total||ShardId, Port, Primary|
|alltotalkeys|Yes|Total Keys (Instance Based)|Count|Maximum||ShardId, Port, Primary|
|allusedmemory|Yes|Used Memory (Instance Based)|Bytes|Maximum||ShardId, Port, Primary|
|allusedmemorypercentage|Yes|Used Memory Percentage (Instance Based)|Percent|Maximum||ShardId, Port, Primary|
|allusedmemoryRss|Yes|Used Memory RSS (Instance Based)|Bytes|Maximum||ShardId, Port, Primary|
|cachehits|Yes|Cache Hits|Count|Total||ShardId|
|cachehits0|Yes|Cache Hits (Shard 0)|Count|Total||No Dimensions|
|cachehits1|Yes|Cache Hits (Shard 1)|Count|Total||No Dimensions|
|cachehits2|Yes|Cache Hits (Shard 2)|Count|Total||No Dimensions|
|cachehits3|Yes|Cache Hits (Shard 3)|Count|Total||No Dimensions|
|cachehits4|Yes|Cache Hits (Shard 4)|Count|Total||No Dimensions|
|cachehits5|Yes|Cache Hits (Shard 5)|Count|Total||No Dimensions|
|cachehits6|Yes|Cache Hits (Shard 6)|Count|Total||No Dimensions|
|cachehits7|Yes|Cache Hits (Shard 7)|Count|Total||No Dimensions|
|cachehits8|Yes|Cache Hits (Shard 8)|Count|Total||No Dimensions|
|cachehits9|Yes|Cache Hits (Shard 9)|Count|Total||No Dimensions|
|cacheLatency|Yes|Cache Latency Microseconds (Preview)|Count|Average||ShardId|
|cachemisses|Yes|Cache Misses|Count|Total||ShardId|
|cachemisses0|Yes|Cache Misses (Shard 0)|Count|Total||No Dimensions|
|cachemisses1|Yes|Cache Misses (Shard 1)|Count|Total||No Dimensions|
|cachemisses2|Yes|Cache Misses (Shard 2)|Count|Total||No Dimensions|
|cachemisses3|Yes|Cache Misses (Shard 3)|Count|Total||No Dimensions|
|cachemisses4|Yes|Cache Misses (Shard 4)|Count|Total||No Dimensions|
|cachemisses5|Yes|Cache Misses (Shard 5)|Count|Total||No Dimensions|
|cachemisses6|Yes|Cache Misses (Shard 6)|Count|Total||No Dimensions|
|cachemisses7|Yes|Cache Misses (Shard 7)|Count|Total||No Dimensions|
|cachemisses8|Yes|Cache Misses (Shard 8)|Count|Total||No Dimensions|
|cachemisses9|Yes|Cache Misses (Shard 9)|Count|Total||No Dimensions|
|cachemissrate|Yes|Cache Miss Rate|Percent|cachemissrate||ShardId|
|cacheRead|Yes|Cache Read|BytesPerSecond|Maximum||ShardId|
|cacheRead0|Yes|Cache Read (Shard 0)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead1|Yes|Cache Read (Shard 1)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead2|Yes|Cache Read (Shard 2)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead3|Yes|Cache Read (Shard 3)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead4|Yes|Cache Read (Shard 4)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead5|Yes|Cache Read (Shard 5)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead6|Yes|Cache Read (Shard 6)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead7|Yes|Cache Read (Shard 7)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead8|Yes|Cache Read (Shard 8)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead9|Yes|Cache Read (Shard 9)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite|Yes|Cache Write|BytesPerSecond|Maximum||ShardId|
|cacheWrite0|Yes|Cache Write (Shard 0)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite1|Yes|Cache Write (Shard 1)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite2|Yes|Cache Write (Shard 2)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite3|Yes|Cache Write (Shard 3)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite4|Yes|Cache Write (Shard 4)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite5|Yes|Cache Write (Shard 5)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite6|Yes|Cache Write (Shard 6)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite7|Yes|Cache Write (Shard 7)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite8|Yes|Cache Write (Shard 8)|BytesPerSecond|Maximum||No Dimensions|
|cacheWrite9|Yes|Cache Write (Shard 9)|BytesPerSecond|Maximum||No Dimensions|
|connectedclients|Yes|Connected Clients|Count|Maximum||ShardId|
|connectedclients0|Yes|Connected Clients (Shard 0)|Count|Maximum||No Dimensions|
|connectedclients1|Yes|Connected Clients (Shard 1)|Count|Maximum||No Dimensions|
|connectedclients2|Yes|Connected Clients (Shard 2)|Count|Maximum||No Dimensions|
|connectedclients3|Yes|Connected Clients (Shard 3)|Count|Maximum||No Dimensions|
|connectedclients4|Yes|Connected Clients (Shard 4)|Count|Maximum||No Dimensions|
|connectedclients5|Yes|Connected Clients (Shard 5)|Count|Maximum||No Dimensions|
|connectedclients6|Yes|Connected Clients (Shard 6)|Count|Maximum||No Dimensions|
|connectedclients7|Yes|Connected Clients (Shard 7)|Count|Maximum||No Dimensions|
|connectedclients8|Yes|Connected Clients (Shard 8)|Count|Maximum||No Dimensions|
|connectedclients9|Yes|Connected Clients (Shard 9)|Count|Maximum||No Dimensions|
|errors|Yes|Errors|Count|Maximum||ShardId, ErrorType|
|evictedkeys|Yes|Evicted Keys|Count|Total||ShardId|
|evictedkeys0|Yes|Evicted Keys (Shard 0)|Count|Total||No Dimensions|
|evictedkeys1|Yes|Evicted Keys (Shard 1)|Count|Total||No Dimensions|
|evictedkeys2|Yes|Evicted Keys (Shard 2)|Count|Total||No Dimensions|
|evictedkeys3|Yes|Evicted Keys (Shard 3)|Count|Total||No Dimensions|
|evictedkeys4|Yes|Evicted Keys (Shard 4)|Count|Total||No Dimensions|
|evictedkeys5|Yes|Evicted Keys (Shard 5)|Count|Total||No Dimensions|
|evictedkeys6|Yes|Evicted Keys (Shard 6)|Count|Total||No Dimensions|
|evictedkeys7|Yes|Evicted Keys (Shard 7)|Count|Total||No Dimensions|
|evictedkeys8|Yes|Evicted Keys (Shard 8)|Count|Total||No Dimensions|
|evictedkeys9|Yes|Evicted Keys (Shard 9)|Count|Total||No Dimensions|
|expiredkeys|Yes|Expired Keys|Count|Total||ShardId|
|expiredkeys0|Yes|Expired Keys (Shard 0)|Count|Total||No Dimensions|
|expiredkeys1|Yes|Expired Keys (Shard 1)|Count|Total||No Dimensions|
|expiredkeys2|Yes|Expired Keys (Shard 2)|Count|Total||No Dimensions|
|expiredkeys3|Yes|Expired Keys (Shard 3)|Count|Total||No Dimensions|
|expiredkeys4|Yes|Expired Keys (Shard 4)|Count|Total||No Dimensions|
|expiredkeys5|Yes|Expired Keys (Shard 5)|Count|Total||No Dimensions|
|expiredkeys6|Yes|Expired Keys (Shard 6)|Count|Total||No Dimensions|
|expiredkeys7|Yes|Expired Keys (Shard 7)|Count|Total||No Dimensions|
|expiredkeys8|Yes|Expired Keys (Shard 8)|Count|Total||No Dimensions|
|expiredkeys9|Yes|Expired Keys (Shard 9)|Count|Total||No Dimensions|
|getcommands|Yes|Gets|Count|Total||ShardId|
|getcommands0|Yes|Gets (Shard 0)|Count|Total||No Dimensions|
|getcommands1|Yes|Gets (Shard 1)|Count|Total||No Dimensions|
|getcommands2|Yes|Gets (Shard 2)|Count|Total||No Dimensions|
|getcommands3|Yes|Gets (Shard 3)|Count|Total||No Dimensions|
|getcommands4|Yes|Gets (Shard 4)|Count|Total||No Dimensions|
|getcommands5|Yes|Gets (Shard 5)|Count|Total||No Dimensions|
|getcommands6|Yes|Gets (Shard 6)|Count|Total||No Dimensions|
|getcommands7|Yes|Gets (Shard 7)|Count|Total||No Dimensions|
|getcommands8|Yes|Gets (Shard 8)|Count|Total||No Dimensions|
|getcommands9|Yes|Gets (Shard 9)|Count|Total||No Dimensions|
|operationsPerSecond|Yes|Operations Per Second|Count|Maximum||ShardId|
|operationsPerSecond0|Yes|Operations Per Second (Shard 0)|Count|Maximum||No Dimensions|
|operationsPerSecond1|Yes|Operations Per Second (Shard 1)|Count|Maximum||No Dimensions|
|operationsPerSecond2|Yes|Operations Per Second (Shard 2)|Count|Maximum||No Dimensions|
|operationsPerSecond3|Yes|Operations Per Second (Shard 3)|Count|Maximum||No Dimensions|
|operationsPerSecond4|Yes|Operations Per Second (Shard 4)|Count|Maximum||No Dimensions|
|operationsPerSecond5|Yes|Operations Per Second (Shard 5)|Count|Maximum||No Dimensions|
|operationsPerSecond6|Yes|Operations Per Second (Shard 6)|Count|Maximum||No Dimensions|
|operationsPerSecond7|Yes|Operations Per Second (Shard 7)|Count|Maximum||No Dimensions|
|operationsPerSecond8|Yes|Operations Per Second (Shard 8)|Count|Maximum||No Dimensions|
|operationsPerSecond9|Yes|Operations Per Second (Shard 9)|Count|Maximum||No Dimensions|
|percentProcessorTime|Yes|CPU|Percent|Maximum||ShardId|
|percentProcessorTime0|Yes|CPU (Shard 0)|Percent|Maximum||No Dimensions|
|percentProcessorTime1|Yes|CPU (Shard 1)|Percent|Maximum||No Dimensions|
|percentProcessorTime2|Yes|CPU (Shard 2)|Percent|Maximum||No Dimensions|
|percentProcessorTime3|Yes|CPU (Shard 3)|Percent|Maximum||No Dimensions|
|percentProcessorTime4|Yes|CPU (Shard 4)|Percent|Maximum||No Dimensions|
|percentProcessorTime5|Yes|CPU (Shard 5)|Percent|Maximum||No Dimensions|
|percentProcessorTime6|Yes|CPU (Shard 6)|Percent|Maximum||No Dimensions|
|percentProcessorTime7|Yes|CPU (Shard 7)|Percent|Maximum||No Dimensions|
|percentProcessorTime8|Yes|CPU (Shard 8)|Percent|Maximum||No Dimensions|
|percentProcessorTime9|Yes|CPU (Shard 9)|Percent|Maximum||No Dimensions|
|serverLoad|Yes|Server Load|Percent|Maximum||ShardId|
|serverLoad0|Yes|Server Load (Shard 0)|Percent|Maximum||No Dimensions|
|serverLoad1|Yes|Server Load (Shard 1)|Percent|Maximum||No Dimensions|
|serverLoad2|Yes|Server Load (Shard 2)|Percent|Maximum||No Dimensions|
|serverLoad3|Yes|Server Load (Shard 3)|Percent|Maximum||No Dimensions|
|serverLoad4|Yes|Server Load (Shard 4)|Percent|Maximum||No Dimensions|
|serverLoad5|Yes|Server Load (Shard 5)|Percent|Maximum||No Dimensions|
|serverLoad6|Yes|Server Load (Shard 6)|Percent|Maximum||No Dimensions|
|serverLoad7|Yes|Server Load (Shard 7)|Percent|Maximum||No Dimensions|
|serverLoad8|Yes|Server Load (Shard 8)|Percent|Maximum||No Dimensions|
|serverLoad9|Yes|Server Load (Shard 9)|Percent|Maximum||No Dimensions|
|setcommands|Yes|Sets|Count|Total||ShardId|
|setcommands0|Yes|Sets (Shard 0)|Count|Total||No Dimensions|
|setcommands1|Yes|Sets (Shard 1)|Count|Total||No Dimensions|
|setcommands2|Yes|Sets (Shard 2)|Count|Total||No Dimensions|
|setcommands3|Yes|Sets (Shard 3)|Count|Total||No Dimensions|
|setcommands4|Yes|Sets (Shard 4)|Count|Total||No Dimensions|
|setcommands5|Yes|Sets (Shard 5)|Count|Total||No Dimensions|
|setcommands6|Yes|Sets (Shard 6)|Count|Total||No Dimensions|
|setcommands7|Yes|Sets (Shard 7)|Count|Total||No Dimensions|
|setcommands8|Yes|Sets (Shard 8)|Count|Total||No Dimensions|
|setcommands9|Yes|Sets (Shard 9)|Count|Total||No Dimensions|
|totalcommandsprocessed|Yes|Total Operations|Count|Total||ShardId|
|totalcommandsprocessed0|Yes|Total Operations (Shard 0)|Count|Total||No Dimensions|
|totalcommandsprocessed1|Yes|Total Operations (Shard 1)|Count|Total||No Dimensions|
|totalcommandsprocessed2|Yes|Total Operations (Shard 2)|Count|Total||No Dimensions|
|totalcommandsprocessed3|Yes|Total Operations (Shard 3)|Count|Total||No Dimensions|
|totalcommandsprocessed4|Yes|Total Operations (Shard 4)|Count|Total||No Dimensions|
|totalcommandsprocessed5|Yes|Total Operations (Shard 5)|Count|Total||No Dimensions|
|totalcommandsprocessed6|Yes|Total Operations (Shard 6)|Count|Total||No Dimensions|
|totalcommandsprocessed7|Yes|Total Operations (Shard 7)|Count|Total||No Dimensions|
|totalcommandsprocessed8|Yes|Total Operations (Shard 8)|Count|Total||No Dimensions|
|totalcommandsprocessed9|Yes|Total Operations (Shard 9)|Count|Total||No Dimensions|
|totalkeys|Yes|Total Keys|Count|Maximum||ShardId|
|totalkeys0|Yes|Total Keys (Shard 0)|Count|Maximum||No Dimensions|
|totalkeys1|Yes|Total Keys (Shard 1)|Count|Maximum||No Dimensions|
|totalkeys2|Yes|Total Keys (Shard 2)|Count|Maximum||No Dimensions|
|totalkeys3|Yes|Total Keys (Shard 3)|Count|Maximum||No Dimensions|
|totalkeys4|Yes|Total Keys (Shard 4)|Count|Maximum||No Dimensions|
|totalkeys5|Yes|Total Keys (Shard 5)|Count|Maximum||No Dimensions|
|totalkeys6|Yes|Total Keys (Shard 6)|Count|Maximum||No Dimensions|
|totalkeys7|Yes|Total Keys (Shard 7)|Count|Maximum||No Dimensions|
|totalkeys8|Yes|Total Keys (Shard 8)|Count|Maximum||No Dimensions|
|totalkeys9|Yes|Total Keys (Shard 9)|Count|Maximum||No Dimensions|
|usedmemory|Yes|Used Memory|Bytes|Maximum||ShardId|
|usedmemory0|Yes|Used Memory (Shard 0)|Bytes|Maximum||No Dimensions|
|usedmemory1|Yes|Used Memory (Shard 1)|Bytes|Maximum||No Dimensions|
|usedmemory2|Yes|Used Memory (Shard 2)|Bytes|Maximum||No Dimensions|
|usedmemory3|Yes|Used Memory (Shard 3)|Bytes|Maximum||No Dimensions|
|usedmemory4|Yes|Used Memory (Shard 4)|Bytes|Maximum||No Dimensions|
|usedmemory5|Yes|Used Memory (Shard 5)|Bytes|Maximum||No Dimensions|
|usedmemory6|Yes|Used Memory (Shard 6)|Bytes|Maximum||No Dimensions|
|usedmemory7|Yes|Used Memory (Shard 7)|Bytes|Maximum||No Dimensions|
|usedmemory8|Yes|Used Memory (Shard 8)|Bytes|Maximum||No Dimensions|
|usedmemory9|Yes|Used Memory (Shard 9)|Bytes|Maximum||No Dimensions|
|usedmemorypercentage|Yes|Used Memory Percentage|Percent|Maximum||ShardId|
|usedmemoryRss|Yes|Used Memory RSS|Bytes|Maximum||ShardId|
|usedmemoryRss0|Yes|Used Memory RSS (Shard 0)|Bytes|Maximum||No Dimensions|
|usedmemoryRss1|Yes|Used Memory RSS (Shard 1)|Bytes|Maximum||No Dimensions|
|usedmemoryRss2|Yes|Used Memory RSS (Shard 2)|Bytes|Maximum||No Dimensions|
|usedmemoryRss3|Yes|Used Memory RSS (Shard 3)|Bytes|Maximum||No Dimensions|
|usedmemoryRss4|Yes|Used Memory RSS (Shard 4)|Bytes|Maximum||No Dimensions|
|usedmemoryRss5|Yes|Used Memory RSS (Shard 5)|Bytes|Maximum||No Dimensions|
|usedmemoryRss6|Yes|Used Memory RSS (Shard 6)|Bytes|Maximum||No Dimensions|
|usedmemoryRss7|Yes|Used Memory RSS (Shard 7)|Bytes|Maximum||No Dimensions|
|usedmemoryRss8|Yes|Used Memory RSS (Shard 8)|Bytes|Maximum||No Dimensions|
|usedmemoryRss9|Yes|Used Memory RSS (Shard 9)|Bytes|Maximum||No Dimensions|


## Microsoft.Cache/redisEnterprise

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|cachehits|Yes|Cache Hits|Count|Total||No Dimensions|
|cacheLatency|Yes|Cache Latency Microseconds (Preview)|Count|Average||InstanceId|
|cachemisses|Yes|Cache Misses|Count|Total||InstanceId|
|cacheRead|Yes|Cache Read|BytesPerSecond|Maximum||InstanceId|
|cacheWrite|Yes|Cache Write|BytesPerSecond|Maximum||InstanceId|
|connectedclients|Yes|Connected Clients|Count|Maximum||InstanceId|
|errors|Yes|Errors|Count|Maximum||InstanceId, ErrorType|
|evictedkeys|Yes|Evicted Keys|Count|Total||No Dimensions|
|expiredkeys|Yes|Expired Keys|Count|Total||No Dimensions|
|getcommands|Yes|Gets|Count|Total||No Dimensions|
|operationsPerSecond|Yes|Operations Per Second|Count|Maximum||No Dimensions|
|percentProcessorTime|Yes|CPU|Percent|Maximum||InstanceId|
|serverLoad|Yes|Server Load|Percent|Maximum||No Dimensions|
|setcommands|Yes|Sets|Count|Total||No Dimensions|
|totalcommandsprocessed|Yes|Total Operations|Count|Total||No Dimensions|
|totalkeys|Yes|Total Keys|Count|Maximum||No Dimensions|
|usedmemory|Yes|Used Memory|Bytes|Maximum||No Dimensions|
|usedmemorypercentage|Yes|Used Memory Percentage|Percent|Maximum||InstanceId|


## Microsoft.Cdn/cdnwebapplicationfirewallpolicies

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|WebApplicationFirewallRequestCount|Yes|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName, RuleName, Action|


## Microsoft.Cdn/profiles

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteHitRatio|Yes|Byte Hit Ratio|Percent|Average|This is the ratio of the total bytes served from the cache compared to the total response bytes|Endpoint|
|OriginHealthPercentage|Yes|Origin Health Percentage|Percent|Average|The percentage of successful health probes from AFDX to backends.|Origin, OriginGroup|
|OriginLatency|Yes|Origin Latency|MilliSeconds|Average|The time calculated from when the request was sent by AFDX edge to the backend until AFDX received the last response byte from the backend.|Origin, Endpoint|
|OriginRequestCount|Yes|Origin Request Count|Count|Total|The number of requests sent from AFDX to origin.|HttpStatus, HttpStatusGroup, Origin, Endpoint|
|Percentage4XX|Yes|Percentage of 4XX|Percent|Average|The percentage of all the client requests for which the response status code is 4XX|Endpoint, ClientRegion, ClientCountry|
|Percentage5XX|Yes|Percentage of 5XX|Percent|Average|The percentage of all the client requests for which the response status code is 5XX|Endpoint, ClientRegion, ClientCountry|
|RequestCount|Yes|Request Count|Count|Total|The number of client requests served by the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint|
|RequestSize|Yes|Request Size|Bytes|Total|The number of bytes sent as requests from clients to AFDX.|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint|
|ResponseSize|Yes|Response Size|Bytes|Total|The number of bytes sent as responses from HTTP/S proxy to clients|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint|
|TotalLatency|Yes|Total Latency|MilliSeconds|Average|The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry, Endpoint|
|WebApplicationFirewallRequestCount|Yes|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName, RuleName, Action|


## Microsoft.ClassicCompute/domainNames/slots/roles

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes/Sec|No|Disk Read|BytesPerSecond|Average|Average bytes read from disk during monitoring period.|RoleInstanceId|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS.|RoleInstanceId|
|Disk Write Bytes/Sec|No|Disk Write|BytesPerSecond|Average|Average bytes written to disk during monitoring period.|RoleInstanceId|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS.|RoleInstanceId|
|Network In|Yes|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic).|RoleInstanceId|
|Network Out|Yes|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic).|RoleInstanceId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s).|RoleInstanceId|


## Microsoft.ClassicCompute/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes/Sec|No|Disk Read|BytesPerSecond|Average|Average bytes read from disk during monitoring period.|No Dimensions|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS.|No Dimensions|
|Disk Write Bytes/Sec|No|Disk Write|BytesPerSecond|Average|Average bytes written to disk during monitoring period.|No Dimensions|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS.|No Dimensions|
|Network In|Yes|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic).|No Dimensions|
|Network Out|Yes|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic).|No Dimensions|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s).|No Dimensions|


## Microsoft.ClassicStorage/storageAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|UsedCapacity|No|Used capacity|Bytes|Average|Account used capacity|No Dimensions|


## Microsoft.ClassicStorage/storageAccounts/blobServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|BlobCapacity|No|Blob Capacity|Bytes|Average|The amount of storage used by the storage account’s Blob service in bytes.|BlobType, Tier|
|BlobCount|No|Blob Count|Count|Average|The number of Blob in the storage account’s Blob service.|BlobType, Tier|
|ContainerCount|Yes|Blob Container Count|Count|Average|The number of containers in the storage account’s Blob service.|No Dimensions|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|IndexCapacity|No|Index Capacity|Bytes|Average|The amount of storage used by ADLS Gen2 (Hierarchical) Index in bytes.|No Dimensions|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.ClassicStorage/storageAccounts/fileServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication, FileShare|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication, FileShare|
|FileCapacity|No|File Capacity|Bytes|Average|The amount of storage used by the storage account’s File service in bytes.|FileShare|
|FileCount|No|File Count|Count|Average|The number of file in the storage account’s File service.|FileShare|
|FileShareCount|No|File Share Count|Count|Average|The number of file shares in the storage account’s File service.|No Dimensions|
|FileShareQuota|No|File share quota size|Bytes|Average|The upper limit on the amount of storage that can be used by Azure Files Service in bytes.|FileShare|
|FileShareSnapshotCount|No|File Share Snapshot Count|Count|Average|The number of snapshots present on the share in storage account’s Files Service.|FileShare|
|FileShareSnapshotSize|No|File Share Snapshot Size|Bytes|Average|The amount of storage used by the snapshots in storage account’s File service in bytes.|FileShare|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication, FileShare|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication, FileShare|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication, FileShare|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication, FileShare|


## Microsoft.ClassicStorage/storageAccounts/queueServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|QueueCapacity|Yes|Queue Capacity|Bytes|Average|The amount of storage used by the storage account’s Queue service in bytes.|No Dimensions|
|QueueCount|Yes|Queue Count|Count|Average|The number of queue in the storage account’s Queue service.|No Dimensions|
|QueueMessageCount|Yes|Queue Message Count|Count|Average|The approximate number of queue messages in the storage account’s Queue service.|No Dimensions|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.ClassicStorage/storageAccounts/tableServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|TableCapacity|Yes|Table Capacity|Bytes|Average|The amount of storage used by the storage account’s Table service in bytes.|No Dimensions|
|TableCount|Yes|Table Count|Count|Average|The number of table in the storage account’s Table service.|No Dimensions|
|TableEntityCount|Yes|Table Entity Count|Count|Average|The number of table entities in the storage account’s Table service.|No Dimensions|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.CognitiveServices/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BlockedCalls|Yes|Blocked Calls|Count|Total|Number of calls that exceeded rate or quota limit.|ApiName, OperationName, Region|
|CharactersTrained|Yes|Characters Trained|Count|Total|Total number of characters trained.|ApiName, OperationName, Region|
|CharactersTranslated|Yes|Characters Translated|Count|Total|Total number of characters in incoming text request.|ApiName, OperationName, Region|
|ClientErrors|Yes|Client Errors|Count|Total|Number of calls with client side error (HTTP response code 4xx).|ApiName, OperationName, Region|
|DataIn|Yes|Data In|Bytes|Total|Size of incoming data in bytes.|ApiName, OperationName, Region|
|DataOut|Yes|Data Out|Bytes|Total|Size of outgoing data in bytes.|ApiName, OperationName, Region|
|Latency|Yes|Latency|MilliSeconds|Average|Latency in milliseconds.|ApiName, OperationName, Region|
|LearnedEvents|Yes|Learned Events|Count|Total|Number of Learned Events.|IsMatchBaseline, Mode, RunId|
|MatchedRewards|Yes|Matched Rewards|Count|Total| Number of Matched Rewards.|IsMatchBaseline, Mode, RunId|
|ObservedRewards|Yes|Observed Rewards|Count|Total|Number of Observed Rewards.|IsMatchBaseline, Mode, RunId|
|ProcessedCharacters|Yes|Processed Characters|Count|Total|Number of Characters.|ApiName, FeatureName, UsageChannel, Region|
|ProcessedTextRecords|Yes|Processed Text Records|Count|Total|Count of Text Records.|ApiName, FeatureName, UsageChannel, Region|
|ServerErrors|Yes|Server Errors|Count|Total|Number of calls with service internal error (HTTP response code 5xx).|ApiName, OperationName, Region|
|SpeechSessionDuration|Yes|Speech Session Duration|Seconds|Total|Total duration of speech session in seconds.|ApiName, OperationName, Region|
|SuccessfulCalls|Yes|Successful Calls|Count|Total|Number of successful calls.|ApiName, OperationName, Region|
|TotalCalls|Yes|Total Calls|Count|Total|Total number of calls.|ApiName, OperationName, Region|
|TotalErrors|Yes|Total Errors|Count|Total|Total number of calls with error response (HTTP response code 4xx or 5xx).|ApiName, OperationName, Region|
|TotalTokenCalls|Yes|Total Token Calls|Count|Total|Total number of token calls.|ApiName, OperationName, Region|
|TotalTransactions|Yes|Total Transactions|Count|Total|Total number of transactions.|No Dimensions|


## Microsoft.Communication/CommunicationServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|APIRequestAuthentication|No|Authentication API Requests|Count|Count|Count of all requests against the Communication Services Authentication endpoint.|Operation, StatusCode, StatusCodeClass|
|APIRequestChat|Yes|Chat API Requests|Count|Count|Count of all requests against the Communication Services Chat endpoint.|Operation, StatusCode, StatusCodeClass|
|APIRequestSMS|Yes|SMS API Requests|Count|Count|Count of all requests against the Communication Services SMS endpoint.|Operation, StatusCode, StatusCodeClass|


## Microsoft.Compute/cloudServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|RoleInstanceId, RoleId|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|RoleInstanceId, RoleId|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|RoleInstanceId, RoleId|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|RoleInstanceId, RoleId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|RoleInstanceId, RoleId|


## Microsoft.Compute/cloudServices/roles

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|RoleInstanceId, RoleId|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|RoleInstanceId, RoleId|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|RoleInstanceId, RoleId|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|RoleInstanceId, RoleId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|RoleInstanceId, RoleId|


## microsoft.compute/disks

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Composite Disk Read Bytes/sec|No|Disk Read Bytes/sec(Preview)|Bytes|Average|Bytes/sec read from disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available||
|Composite Disk Read Operations/sec|No|Disk Read Operations/sec(Preview)|Bytes|Average|Number of read IOs performed on a disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available||
|Composite Disk Write Bytes/sec|No|Disk Write Bytes/sec(Preview)|Bytes|Average|Bytes/sec written to disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available||
|Composite Disk Write Operations/sec|No|Disk Write Operations/sec(Preview)|Bytes|Average|Number of Write IOs performed on a disk during monitoring period, please note, this metric is in preview and is subject to change before becoming generally available||


## Microsoft.Compute/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst. Only available on B-series burstable VMs|No Dimensions|
|Data Disk Bandwidth Consumed Percentage|Yes|Data Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of data disk bandwidth consumed per minute|LUN|
|Data Disk IOPS Consumed Percentage|Yes|Data Disk IOPS Consumed Percentage|Percent|Average|Percentage of data disk I/Os consumed per minute|LUN|
|Data Disk Max Burst Bandwidth|Yes|Data Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput Data Disk can achieve with bursting|LUN|
|Data Disk Max Burst IOPS|Yes|Data Disk Max Burst IOPS|Count|Average|Maximum IOPS Data Disk can achieve with bursting|LUN|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Target Bandwidth|Yes|Data Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput Data Disk can achieve without bursting|LUN|
|Data Disk Target IOPS|Yes|Data Disk Target IOPS|Count|Average|Baseline IOPS Data Disk can achieve without bursting|LUN|
|Data Disk Used Burst BPS Credits Percentage|Yes|Data Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of Data Disk burst bandwidth credits used so far|LUN|
|Data Disk Used Burst IO Credits Percentage|Yes|Data Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of Data Disk burst I/O credits used so far|LUN|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|No Dimensions|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|No Dimensions|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|No Dimensions|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|No Dimensions|
|Inbound Flows|Yes|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|No Dimensions|
|Inbound Flows Maximum Creation Rate|Yes|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|No Dimensions|
|Network In|Yes|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|No Dimensions|
|Network In Total|Yes|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|No Dimensions|
|Network Out|Yes|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|No Dimensions|
|Network Out Total|Yes|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|No Dimensions|
|OS Disk Bandwidth Consumed Percentage|Yes|OS Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of operating system disk bandwidth consumed per minute|LUN|
|OS Disk IOPS Consumed Percentage|Yes|OS Disk IOPS Consumed Percentage|Percent|Average|Percentage of operating system disk I/Os consumed per minute|LUN|
|OS Disk Max Burst Bandwidth|Yes|OS Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput OS Disk can achieve with bursting|LUN|
|OS Disk Max Burst IOPS|Yes|OS Disk Max Burst IOPS|Count|Average|Maximum IOPS OS Disk can achieve with bursting|LUN|
|OS Disk Queue Depth|Yes|OS Disk Queue Depth|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Target Bandwidth|Yes|OS Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput OS Disk can achieve without bursting|LUN|
|OS Disk Target IOPS|Yes|OS Disk Target IOPS|Count|Average|Baseline IOPS OS Disk can achieve without bursting|LUN|
|OS Disk Used Burst BPS Credits Percentage|Yes|OS Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of OS Disk burst bandwidth credits used so far|LUN|
|OS Disk Used Burst IO Credits Percentage|Yes|OS Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of OS Disk burst I/O credits used so far|LUN|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|No Dimensions|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|No Dimensions|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|No Dimensions|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit|Percent|Average|Premium OS Disk Cache Read Hit|No Dimensions|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss|Percent|Average|Premium OS Disk Cache Read Miss|No Dimensions|
|VM Cached Bandwidth Consumed Percentage|Yes|VM Cached Bandwidth Consumed Percentage|Percent|Average|Percentage of cached disk bandwidth consumed by the VM|No Dimensions|
|VM Cached IOPS Consumed Percentage|Yes|VM Cached IOPS Consumed Percentage|Percent|Average|Percentage of cached disk IOPS consumed by the VM|No Dimensions|
|VM Uncached Bandwidth Consumed Percentage|Yes|VM Uncached Bandwidth Consumed Percentage|Percent|Average|Percentage of uncached disk bandwidth consumed by the VM|No Dimensions|
|VM Uncached IOPS Consumed Percentage|Yes|VM Uncached IOPS Consumed Percentage|Percent|Average|Percentage of uncached disk IOPS consumed by the VM|No Dimensions|


## Microsoft.Compute/virtualMachineScaleSets

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst. Only available on B-series burstable VMs|No Dimensions|
|Data Disk Bandwidth Consumed Percentage|Yes|Data Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of data disk bandwidth consumed per minute|LUN, VMName|
|Data Disk IOPS Consumed Percentage|Yes|Data Disk IOPS Consumed Percentage|Percent|Average|Percentage of data disk I/Os consumed per minute|LUN, VMName|
|Data Disk Max Burst Bandwidth|Yes|Data Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput Data Disk can achieve with bursting|LUN, VMName|
|Data Disk Max Burst IOPS|Yes|Data Disk Max Burst IOPS|Count|Average|Maximum IOPS Data Disk can achieve with bursting|LUN, VMName|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN, VMName|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN, VMName|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN, VMName|
|Data Disk Target Bandwidth|Yes|Data Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput Data Disk can achieve without bursting|LUN, VMName|
|Data Disk Target IOPS|Yes|Data Disk Target IOPS|Count|Average|Baseline IOPS Data Disk can achieve without bursting|LUN, VMName|
|Data Disk Used Burst BPS Credits Percentage|Yes|Data Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of Data Disk burst bandwidth credits used so far|LUN, VMName|
|Data Disk Used Burst IO Credits Percentage|Yes|Data Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of Data Disk burst I/O credits used so far|LUN, VMName|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN, VMName|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN, VMName|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|VMName|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|VMName|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|VMName|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|VMName|
|Inbound Flows|Yes|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|VMName|
|Inbound Flows Maximum Creation Rate|Yes|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|VMName|
|Network In|Yes|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|VMName|
|Network In Total|Yes|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|VMName|
|Network Out|Yes|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|VMName|
|Network Out Total|Yes|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|VMName|
|OS Disk Bandwidth Consumed Percentage|Yes|OS Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of operating system disk bandwidth consumed per minute|LUN, VMName|
|OS Disk IOPS Consumed Percentage|Yes|OS Disk IOPS Consumed Percentage|Percent|Average|Percentage of operating system disk I/Os consumed per minute|LUN, VMName|
|OS Disk Max Burst Bandwidth|Yes|OS Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput OS Disk can achieve with bursting|LUN, VMName|
|OS Disk Max Burst IOPS|Yes|OS Disk Max Burst IOPS|Count|Average|Maximum IOPS OS Disk can achieve with bursting|LUN, VMName|
|OS Disk Queue Depth|Yes|OS Disk Queue Depth|Count|Average|OS Disk Queue Depth(or Queue Length)|VMName|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|VMName|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Target Bandwidth|Yes|OS Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput OS Disk can achieve without bursting|LUN, VMName|
|OS Disk Target IOPS|Yes|OS Disk Target IOPS|Count|Average|Baseline IOPS OS Disk can achieve without bursting|LUN, VMName|
|OS Disk Used Burst BPS Credits Percentage|Yes|OS Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of OS Disk burst bandwidth credits used so far|LUN, VMName|
|OS Disk Used Burst IO Credits Percentage|Yes|OS Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of OS Disk burst I/O credits used so far|LUN, VMName|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|VMName|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|VMName|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|VMName|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|VMName|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit|Percent|Average|Premium Data Disk Cache Read Hit|LUN, VMName|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss|Percent|Average|Premium Data Disk Cache Read Miss|LUN, VMName|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit|Percent|Average|Premium OS Disk Cache Read Hit|VMName|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss|Percent|Average|Premium OS Disk Cache Read Miss|VMName|
|VM Cached Bandwidth Consumed Percentage|Yes|VM Cached Bandwidth Consumed Percentage|Percent|Average|Percentage of cached disk bandwidth consumed by the VM|VMName|
|VM Cached IOPS Consumed Percentage|Yes|VM Cached IOPS Consumed Percentage|Percent|Average|Percentage of cached disk IOPS consumed by the VM|VMName|
|VM Uncached Bandwidth Consumed Percentage|Yes|VM Uncached Bandwidth Consumed Percentage|Percent|Average|Percentage of uncached disk bandwidth consumed by the VM|VMName|
|VM Uncached IOPS Consumed Percentage|Yes|VM Uncached IOPS Consumed Percentage|Percent|Average|Percentage of uncached disk IOPS consumed by the VM|VMName|


## Microsoft.Compute/virtualMachineScaleSets/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine. Only available on B-series burstable VMs|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst. Only available on B-series burstable VMs|No Dimensions|
|Data Disk Bandwidth Consumed Percentage|Yes|Data Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of data disk bandwidth consumed per minute|LUN|
|Data Disk IOPS Consumed Percentage|Yes|Data Disk IOPS Consumed Percentage|Percent|Average|Percentage of data disk I/Os consumed per minute|LUN|
|Data Disk Max Burst Bandwidth|Yes|Data Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput Data Disk can achieve with bursting|LUN|
|Data Disk Max Burst IOPS|Yes|Data Disk Max Burst IOPS|Count|Average|Maximum IOPS Data Disk can achieve with bursting|LUN|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Target Bandwidth|Yes|Data Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput Data Disk can achieve without bursting|LUN|
|Data Disk Target IOPS|Yes|Data Disk Target IOPS|Count|Average|Baseline IOPS Data Disk can achieve without bursting|LUN|
|Data Disk Used Burst BPS Credits Percentage|Yes|Data Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of Data Disk burst bandwidth credits used so far|LUN|
|Data Disk Used Burst IO Credits Percentage|Yes|Data Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of Data Disk burst I/O credits used so far|LUN|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|No Dimensions|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|No Dimensions|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|No Dimensions|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|No Dimensions|
|Inbound Flows|Yes|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|No Dimensions|
|Inbound Flows Maximum Creation Rate|Yes|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|No Dimensions|
|Network In|Yes|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|No Dimensions|
|Network In Total|Yes|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|No Dimensions|
|Network Out|Yes|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|No Dimensions|
|Network Out Total|Yes|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|No Dimensions|
|OS Disk Bandwidth Consumed Percentage|Yes|OS Disk Bandwidth Consumed Percentage|Percent|Average|Percentage of operating system disk bandwidth consumed per minute|LUN|
|OS Disk IOPS Consumed Percentage|Yes|OS Disk IOPS Consumed Percentage|Percent|Average|Percentage of operating system disk I/Os consumed per minute|LUN|
|OS Disk Max Burst Bandwidth|Yes|OS Disk Max Burst Bandwidth|Count|Average|Maximum bytes per second throughput OS Disk can achieve with bursting|LUN|
|OS Disk Max Burst IOPS|Yes|OS Disk Max Burst IOPS|Count|Average|Maximum IOPS OS Disk can achieve with bursting|LUN|
|OS Disk Queue Depth|Yes|OS Disk Queue Depth|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec|BytesPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Target Bandwidth|Yes|OS Disk Target Bandwidth|Count|Average|Baseline bytes per second throughput OS Disk can achieve without bursting|LUN|
|OS Disk Target IOPS|Yes|OS Disk Target IOPS|Count|Average|Baseline IOPS OS Disk can achieve without bursting|LUN|
|OS Disk Used Burst BPS Credits Percentage|Yes|OS Disk Used Burst BPS Credits Percentage|Percent|Average|Percentage of OS Disk burst bandwidth credits used so far|LUN|
|OS Disk Used Burst IO Credits Percentage|Yes|OS Disk Used Burst IO Credits Percentage|Percent|Average|Percentage of OS Disk burst I/O credits used so far|LUN|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec|BytesPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|No Dimensions|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|No Dimensions|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|No Dimensions|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit|Percent|Average|Premium OS Disk Cache Read Hit|No Dimensions|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss|Percent|Average|Premium OS Disk Cache Read Miss|No Dimensions|
|VM Cached Bandwidth Consumed Percentage|Yes|VM Cached Bandwidth Consumed Percentage|Percent|Average|Percentage of cached disk bandwidth consumed by the VM|No Dimensions|
|VM Cached IOPS Consumed Percentage|Yes|VM Cached IOPS Consumed Percentage|Percent|Average|Percentage of cached disk IOPS consumed by the VM|No Dimensions|
|VM Uncached Bandwidth Consumed Percentage|Yes|VM Uncached Bandwidth Consumed Percentage|Percent|Average|Percentage of uncached disk bandwidth consumed by the VM|No Dimensions|
|VM Uncached IOPS Consumed Percentage|Yes|VM Uncached IOPS Consumed Percentage|Percent|Average|Percentage of uncached disk IOPS consumed by the VM|No Dimensions|


## Microsoft.ContainerInstance/containerGroups

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuUsage|Yes|CPU Usage|Count|Average|CPU usage on all cores in millicores.|containerName|
|MemoryUsage|Yes|Memory Usage|Bytes|Average|Total memory usage in byte.|containerName|
|NetworkBytesReceivedPerSecond|Yes|Network Bytes Received Per Second|Bytes|Average|The network bytes received per second.|No Dimensions|
|NetworkBytesTransmittedPerSecond|Yes|Network Bytes Transmitted Per Second|Bytes|Average|The network bytes transmitted per second.|No Dimensions|


## Microsoft.ContainerRegistry/registries

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AgentPoolCPUTime|Yes|AgentPool CPU Time|Seconds|Total|AgentPool CPU Time in seconds|No Dimensions|
|RunDuration|Yes|Run Duration|Milliseconds|Total|Run Duration in milliseconds|No Dimensions|
|SuccessfulPullCount|Yes|Successful Pull Count|Count|Average|Number of successful image pulls|No Dimensions|
|SuccessfulPushCount|Yes|Successful Push Count|Count|Average|Number of successful image pushes|No Dimensions|
|TotalPullCount|Yes|Total Pull Count|Count|Average|Number of image pulls in total|No Dimensions|
|TotalPushCount|Yes|Total Push Count|Count|Average|Number of image pushes in total|No Dimensions|


## Microsoft.ContainerService/managedClusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|apiserver_current_inflight_requests|No|Inflight Requests|Count|Average|Maximum number of currently used inflight requests on the apiserver per request kind in the last second|requestKind|
|cluster_autoscaler_cluster_safe_to_autoscale|No|Cluster Health|Count|Average|Determines whether or not cluster autoscaler will take action on the cluster||
|cluster_autoscaler_scale_down_in_cooldown|No|Scale Down Cooldown|Count|Average|Determines if the scale down is in cooldown - No nodes will be removed during this timeframe||
|cluster_autoscaler_unneeded_nodes_count|No|Unneeded Nodes|Count|Average|Cluster auotscaler marks those nodes as candidates for deletion and are eventually deleted||
|cluster_autoscaler_unschedulable_pods_count|No|Unschedulable Pods|Count|Average|Number of pods that are currently unschedulable in the cluster||
|kube_node_status_allocatable_cpu_cores|No|Total number of available cpu cores in a managed cluster|Count|Average|Total number of available cpu cores in a managed cluster||
|kube_node_status_allocatable_memory_bytes|No|Total amount of available memory in a managed cluster|Bytes|Average|Total amount of available memory in a managed cluster||
|kube_node_status_condition|No|Statuses for various node conditions|Count|Average|Statuses for various node conditions|condition, status, status2, node|
|kube_pod_status_phase|No|Number of pods by phase|Count|Average|Number of pods by phase|phase, namespace, pod|
|kube_pod_status_ready|No|Number of pods in Ready state|Count|Average|Number of pods in Ready state|namespace, pod, condition|
|node_cpu_usage_millicores|Yes|CPU Usage Millicores|MilliCores|Average|Aggregated measurement of CPU utilization in millicores across the cluster|node, nodepool|
|node_cpu_usage_percentage|Yes|CPU Usage Percentage|Percent|Average|Aggregated average CPU utilization measured in percentage across the cluster|node, nodepool|
|node_disk_usage_bytes|Yes|Disk Used Bytes|Bytes|Average|Disk space used in bytes by device|node, nodepool, device|
|node_disk_usage_percentage|Yes|Disk Used Percentage|Percent|Average|Disk space used in percent by device|node, nodepool, device|
|node_memory_rss_bytes|Yes|Memory RSS Bytes|Bytes|Average|Container RSS memory used in bytes|node, nodepool|
|node_memory_rss_percentage|Yes|Memory RSS Percentage|Percent|Average|Container RSS memory used in percent|node, nodepool|
|node_memory_working_set_bytes|Yes|Memory Working Set Bytes|Bytes|Average|Container working set memory used in bytes|node, nodepool|
|node_memory_working_set_percentage|Yes|Memory Working Set Percentage|Percent|Average|Container working set memory used in percent|node, nodepool|
|node_network_in_bytes|Yes|Network In Bytes|Bytes|Average|Network received bytes|node, nodepool|
|node_network_out_bytes|Yes|Network Out Bytes|Bytes|Average|Network transmitted bytes|node, nodepool|


## Microsoft.CustomProviders/resourceproviders

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedRequests|Yes|Failed Requests|Count|Total|Gets the available logs for Custom Resource Providers|HttpMethod, CallPath, StatusCode|
|SuccessfullRequests|Yes|Successful Requests|Count|Total|Successful requests made by the custom provider|HttpMethod, CallPath, StatusCode|


## Microsoft.DataBoxEdge/dataBoxEdgeDevices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AvailableCapacity|Yes|Available Capacity|Bytes|Average|The available capacity in bytes during the reporting period.|No Dimensions|
|BytesUploadedToCloud|Yes|Cloud Bytes Uploaded (Device)|Bytes|Average|The total number of bytes that is uploaded to Azure from a device during the reporting period.|No Dimensions|
|BytesUploadedToCloudPerShare|Yes|Cloud Bytes Uploaded (Share)|Bytes|Average|The total number of bytes that is uploaded to Azure from a share during the reporting period.|Share|
|CloudReadThroughput|Yes|Cloud Download Throughput|BytesPerSecond|Average|The cloud download throughput to Azure during the reporting period.|No Dimensions|
|CloudReadThroughputPerShare|Yes|Cloud Download Throughput (Share)|BytesPerSecond|Average|The download throughput to Azure from a share during the reporting period.|Share|
|CloudUploadThroughput|Yes|Cloud Upload Throughput|BytesPerSecond|Average|The cloud upload throughput  to Azure during the reporting period.|No Dimensions|
|CloudUploadThroughputPerShare|Yes|Cloud Upload Throughput (Share)|BytesPerSecond|Average|The upload throughput to Azure from a share during the reporting period.|Share|
|HyperVMemoryUtilization|Yes|Edge Compute - Memory Usage|Percent|Average|Amount of RAM in Use|InstanceName|
|HyperVVirtualProcessorUtilization|Yes|Edge Compute - Percentage CPU|Percent|Average|Percent CPU Usage|InstanceName|
|NICReadThroughput|Yes|Read Throughput (Network)|BytesPerSecond|Average|The read throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|NICWriteThroughput|Yes|Write Throughput (Network)|BytesPerSecond|Average|The write throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|TotalCapacity|Yes|Total Capacity|Bytes|Average|Total Capacity|No Dimensions|


## Microsoft.DataCollaboration/workspaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataAssetCount|Yes|Created Data Assets|Count|Maximum|Number of created data assets|DataAssetName|
|PipelineCount|Yes|Created Pipelines|Count|Maximum|Number of created pipelines|PipelineName|
|ProposalCount|Yes|Created Proposals|Count|Maximum|Number of created proposals|ProposalName|
|ScriptCount|Yes|Created Scripts|Count|Maximum|Number of created scripts|ScriptName|


## Microsoft.DataFactory/datafactories

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedRuns|Yes|Failed Runs|Count|Total||pipelineName, activityName|
|SuccessfulRuns|Yes|Successful Runs|Count|Total||pipelineName, activityName|


## Microsoft.DataFactory/factories

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActivityCancelledRuns|Yes|Cancelled activity runs metrics|Count|Total||ActivityType, PipelineName, FailureType, Name|
|ActivityFailedRuns|Yes|Failed activity runs metrics|Count|Total||ActivityType, PipelineName, FailureType, Name|
|ActivitySucceededRuns|Yes|Succeeded activity runs metrics|Count|Total||ActivityType, PipelineName, FailureType, Name|
|FactorySizeInGbUnits|Yes|Total factory size (GB unit)|Count|Maximum||No Dimensions|
|IntegrationRuntimeAvailableMemory|Yes|Integration runtime available memory|Bytes|Average||IntegrationRuntimeName, NodeName|
|IntegrationRuntimeAvailableNodeNumber|Yes|Integration runtime available node count|Count|Average||IntegrationRuntimeName|
|IntegrationRuntimeAverageTaskPickupDelay|Yes|Integration runtime queue duration|Seconds|Average||IntegrationRuntimeName|
|IntegrationRuntimeCpuPercentage|Yes|Integration runtime CPU utilization|Percent|Average||IntegrationRuntimeName, NodeName|
|IntegrationRuntimeQueueLength|Yes|Integration runtime queue length|Count|Average||IntegrationRuntimeName|
|MaxAllowedFactorySizeInGbUnits|Yes|Maximum allowed factory size (GB unit)|Count|Maximum||No Dimensions|
|MaxAllowedResourceCount|Yes|Maximum allowed entities count|Count|Maximum||No Dimensions|
|PipelineCancelledRuns|Yes|Cancelled pipeline runs metrics|Count|Total||FailureType, Name|
|PipelineElapsedTimeRuns|Yes|Elapsed Time Pipeline Runs Metrics|Count|Total||RunId, Name|
|PipelineFailedRuns|Yes|Failed pipeline runs metrics|Count|Total||FailureType, Name|
|PipelineSucceededRuns|Yes|Succeeded pipeline runs metrics|Count|Total||FailureType, Name|
|ResourceCount|Yes|Total entities count|Count|Maximum||No Dimensions|
|SSISIntegrationRuntimeStartCancel|Yes|Cancelled SSIS integration runtime start metrics|Count|Total||IntegrationRuntimeName|
|SSISIntegrationRuntimeStartFailed|Yes|Failed SSIS integration runtime start metrics|Count|Total||IntegrationRuntimeName|
|SSISIntegrationRuntimeStartSucceeded|Yes|Succeeded SSIS integration runtime start metrics|Count|Total||IntegrationRuntimeName|
|SSISIntegrationRuntimeStopStuck|Yes|Stuck SSIS integration runtime stop metrics|Count|Total||IntegrationRuntimeName|
|SSISIntegrationRuntimeStopSucceeded|Yes|Succeeded SSIS integration runtime stop metrics|Count|Total||IntegrationRuntimeName|
|SSISPackageExecutionCancel|Yes|Cancelled SSIS package execution metrics|Count|Total||IntegrationRuntimeName|
|SSISPackageExecutionFailed|Yes|Failed SSIS package execution metrics|Count|Total||IntegrationRuntimeName|
|SSISPackageExecutionSucceeded|Yes|Succeeded SSIS package execution metrics|Count|Total||IntegrationRuntimeName|
|TriggerCancelledRuns|Yes|Cancelled trigger runs metrics|Count|Total||Name, FailureType|
|TriggerFailedRuns|Yes|Failed trigger runs metrics|Count|Total||Name, FailureType|
|TriggerSucceededRuns|Yes|Succeeded trigger runs metrics|Count|Total||Name, FailureType|


## Microsoft.DataLakeAnalytics/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|JobAUEndedCancelled|Yes|Cancelled AU Time|Seconds|Total|Total AU time for cancelled jobs.|No Dimensions|
|JobAUEndedFailure|Yes|Failed AU Time|Seconds|Total|Total AU time for failed jobs.|No Dimensions|
|JobAUEndedSuccess|Yes|Successful AU Time|Seconds|Total|Total AU time for successful jobs.|No Dimensions|
|JobEndedCancelled|Yes|Cancelled Jobs|Count|Total|Count of cancelled jobs.|No Dimensions|
|JobEndedFailure|Yes|Failed Jobs|Count|Total|Count of failed jobs.|No Dimensions|
|JobEndedSuccess|Yes|Successful Jobs|Count|Total|Count of successful jobs.|No Dimensions|
|JobStage|Yes|Jobs in Stage|Count|Total|Number of jobs in each stage.|No Dimensions|


## Microsoft.DataLakeStore/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataRead|Yes|Data Read|Bytes|Total|Total amount of data read from the account.|No Dimensions|
|DataWritten|Yes|Data Written|Bytes|Total|Total amount of data written to the account.|No Dimensions|
|ReadRequests|Yes|Read Requests|Count|Total|Count of data read requests to the account.|No Dimensions|
|TotalStorage|Yes|Total Storage|Bytes|Maximum|Total amount of data stored in the account.|No Dimensions|
|WriteRequests|Yes|Write Requests|Count|Total|Count of data write requests to the account.|No Dimensions|


## Microsoft.DataShare/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|FailedShareSubscriptionSynchronizations|Yes|Received Share Failed Snapshots|Count|Count|Number of received share failed snapshots in the account|No Dimensions|
|FailedShareSynchronizations|Yes|Sent Share Failed Snapshots|Count|Count|Number of sent share failed snapshots in the account|No Dimensions|
|ShareCount|Yes|Sent Shares|Count|Maximum|Number of sent shares in the account|ShareName|
|ShareSubscriptionCount|Yes|Received Shares|Count|Maximum|Number of received shares in the account|ShareSubscriptionName|
|SucceededShareSubscriptionSynchronizations|Yes|Received Share Succeeded Snapshots|Count|Count|Number of received share succeeded snapshots in the account|No Dimensions|
|SucceededShareSynchronizations|Yes|Sent Share Succeeded Snapshots|Count|Count|Number of sent share succeeded snapshots in the account|No Dimensions|


## Microsoft.DBforMariaDB/servers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|backup_storage_used|Yes|Backup Storage used|Bytes|Average|Backup Storage used|No Dimensions|
|connections_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|io_consumption_percent|Yes|IO percent|Percent|Average|IO percent|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|seconds_behind_master|Yes|Replication lag in seconds|Count|Maximum|Replication lag in seconds|No Dimensions|
|serverlog_storage_limit|Yes|Server Log storage limit|Bytes|Maximum|Server Log storage limit|No Dimensions|
|serverlog_storage_percent|Yes|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Yes|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|storage_limit|Yes|Storage limit|Bytes|Maximum|Storage limit|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


## Microsoft.DBforMySQL/flexibleServers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|aborted_connections|Yes|Aborted Connections|Count|Total|Aborted Connections|No Dimensions|
|active_connections|Yes|Active Connections|Count|Maximum|Active Connections|No Dimensions|
|backup_storage_used|Yes|Backup Storage Used|Bytes|Maximum|Backup Storage Used|No Dimensions|
|cpu_percent|Yes|Host CPU Percent|Percent|Maximum|Host CPU Percent|No Dimensions|
|io_consumption_percent|Yes|IO Percent|Percent|Maximum|IO Percent|No Dimensions|
|memory_percent|Yes|Host Memory Percent|Percent|Maximum|Host Memory Percent|No Dimensions|
|network_bytes_egress|Yes|Host Network Out|Bytes|Total|Host Network egress in bytes|No Dimensions|
|network_bytes_ingress|Yes|Host Network In|Bytes|Total|Host Network ingress in bytes|No Dimensions|
|Queries|Yes|Queries|Count|Total|Queries|No Dimensions|
|replication_lag|Yes|Replication Lag In Seconds|Seconds|Maximum|Replication lag in seconds|No Dimensions|
|storage_limit|Yes|Storage Limit|Bytes|Maximum|Storage Limit|No Dimensions|
|storage_percent|Yes|Storage Percent|Percent|Maximum|Storage Percent|No Dimensions|
|storage_used|Yes|Storage Used|Bytes|Maximum|Storage Used|No Dimensions|
|total_connections|Yes|Total Connections|Count|Total|Total Connections|No Dimensions|


## Microsoft.DBforMySQL/servers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|backup_storage_used|Yes|Backup Storage used|Bytes|Average|Backup Storage used|No Dimensions|
|connections_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|io_consumption_percent|Yes|IO percent|Percent|Average|IO percent|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|seconds_behind_master|Yes|Replication lag in seconds|Count|Maximum|Replication lag in seconds|No Dimensions|
|serverlog_storage_limit|Yes|Server Log storage limit|Bytes|Maximum|Server Log storage limit|No Dimensions|
|serverlog_storage_percent|Yes|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Yes|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|storage_limit|Yes|Storage limit|Bytes|Maximum|Storage limit|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


## Microsoft.DBforPostgreSQL/flexibleServers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|backup_storage_used|Yes|Backup Storage Used|Bytes|Average|Backup Storage Used|No Dimensions|
|connections_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|connections_succeeded|Yes|Succeeded Connections|Count|Total|Succeeded Connections|No Dimensions|
|cpu_credits_consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the database server|No Dimensions|
|cpu_credits_remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|disk_queue_depth|Yes|Disk Queue Depth|Count|Average|Number of outstanding I/O operations to the data disk|No Dimensions|
|iops|Yes|IOPS|Count|Average|IO Operations per second|No Dimensions|
|maximum_used_transactionIDs|Yes|Maximum Used Transaction IDs|Count|Average|Maximum Used Transaction IDs|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|read_iops|Yes|Read IOPS|Count|Average|Number of data disk I/O read operations per second|No Dimensions|
|read_throughput|Yes|Read Throughput Bytes/Sec|Count|Average|Bytes read per second from the data disk during monitoring period|No Dimensions|
|storage_free|Yes|Storage Free|Bytes|Average|Storage Free|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|
|txlogs_storage_used|Yes|Transaction Log Storage Used|Bytes|Average|Transaction Log Storage Used|No Dimensions|
|write_iops|Yes|Write IOPS|Count|Average|Number of data disk I/O write operations per second|No Dimensions|
|write_throughput|Yes|Write Throughput Bytes/Sec|Count|Average|Bytes written per second to the data disk during monitoring period|No Dimensions|


## Microsoft.DBForPostgreSQL/serverGroupsv2

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|ServerName|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|ServerName|
|iops|Yes|IOPS|Count|Average|IO operations per second|ServerName|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|ServerName|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|ServerName|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|ServerName|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|ServerName|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|ServerName|


## Microsoft.DBforPostgreSQL/servers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|backup_storage_used|Yes|Backup Storage Used|Bytes|Average|Backup Storage Used|No Dimensions|
|connections_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|io_consumption_percent|Yes|IO percent|Percent|Average|IO percent|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|pg_replica_log_delay_in_bytes|Yes|Max Lag Across Replicas|Bytes|Maximum|Lag in bytes of the most lagging replica|No Dimensions|
|pg_replica_log_delay_in_seconds|Yes|Replica Lag|Seconds|Maximum|Replica lag in seconds|No Dimensions|
|serverlog_storage_limit|Yes|Server Log storage limit|Bytes|Maximum|Server Log storage limit|No Dimensions|
|serverlog_storage_percent|Yes|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Yes|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|storage_limit|Yes|Storage limit|Bytes|Maximum|Storage limit|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


## Microsoft.DBforPostgreSQL/serversv2

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|iops|Yes|IOPS|Count|Average|IO Operations per second|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


## Microsoft.Devices/ElasticPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|elasticPool.requestedUsageRate|Yes|requested usage rate|Percent|Average|requested usage rate|No Dimensions|


## Microsoft.Devices/ElasticPools/IotHubTenants

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|c2d.commands.egress.abandon.success|Yes|C2D messages abandoned|Count|Total|Number of cloud-to-device messages abandoned by the device|No Dimensions|
|c2d.commands.egress.complete.success|Yes|C2D message deliveries completed|Count|Total|Number of cloud-to-device message deliveries completed successfully by the device|No Dimensions|
|c2d.commands.egress.reject.success|Yes|C2D messages rejected|Count|Total|Number of cloud-to-device messages rejected by the device|No Dimensions|
|c2d.methods.failure|Yes|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|No Dimensions|
|c2d.methods.requestSize|Yes|Request size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method requests.|No Dimensions|
|c2d.methods.responseSize|Yes|Response size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method responses.|No Dimensions|
|c2d.methods.success|Yes|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|No Dimensions|
|c2d.twin.read.failure|Yes|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.size|Yes|Response size of twin reads from back end|Bytes|Average|The average, min, and max of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.success|Yes|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.update.failure|Yes|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.size|Yes|Size of twin updates from back end|Bytes|Average|The average, min, and max size of all successful back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.success|Yes|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|No Dimensions|
|C2DMessagesExpired|Yes|C2D Messages Expired|Count|Total|Number of expired cloud-to-device messages|No Dimensions|
|configurations|Yes|Configuration Metrics|Count|Total|Metrics for Configuration Operations|No Dimensions|
|connectedDeviceCount|Yes|Connected devices|Count|Average|Number of devices connected to your IoT hub|No Dimensions|
|d2c.endpoints.egress.builtIn.events|Yes|Routing: messages delivered to messages/events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events).|No Dimensions|
|d2c.endpoints.egress.eventHubs|Yes|Routing: messages delivered to Event Hub|Count|Total|The number of times IoT Hub routing successfully delivered messages to Event Hub endpoints.|No Dimensions|
|d2c.endpoints.egress.serviceBusQueues|Yes|Routing: messages delivered to Service Bus Queue|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|No Dimensions|
|d2c.endpoints.egress.serviceBusTopics|Yes|Routing: messages delivered to Service Bus Topic|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|No Dimensions|
|d2c.endpoints.egress.storage|Yes|Routing: messages delivered to storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|No Dimensions|
|d2c.endpoints.egress.storage.blobs|Yes|Routing: blobs delivered to storage|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|No Dimensions|
|d2c.endpoints.egress.storage.bytes|Yes|Routing: data delivered to storage|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|No Dimensions|
|d2c.endpoints.latency.builtIn.events|Yes|Routing: message latency for messages/events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into the built-in endpoint (messages/events).|No Dimensions|
|d2c.endpoints.latency.eventHubs|Yes|Routing: message latency for Event Hub|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into an Event Hub endpoint.|No Dimensions|
|d2c.endpoints.latency.serviceBusQueues|Yes|Routing: message latency for Service Bus Queue|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus queue endpoint.|No Dimensions|
|d2c.endpoints.latency.serviceBusTopics|Yes|Routing: message latency for Service Bus Topic|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus topic endpoint.|No Dimensions|
|d2c.endpoints.latency.storage|Yes|Routing: message latency for storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a storage endpoint.|No Dimensions|
|d2c.telemetry.egress.dropped|Yes|Routing: telemetry messages dropped |Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|No Dimensions|
|d2c.telemetry.egress.fallback|Yes|Routing: messages delivered to fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|No Dimensions|
|d2c.telemetry.egress.invalid|Yes|Routing: telemetry messages incompatible|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. This value does not include retries.|No Dimensions|
|d2c.telemetry.egress.orphaned|Yes|Routing: telemetry messages orphaned |Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing rules (including the fallback rule). |No Dimensions|
|d2c.telemetry.egress.success|Yes|Routing: telemetry messages delivered|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|No Dimensions|
|d2c.telemetry.ingress.allProtocol|Yes|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|No Dimensions|
|d2c.telemetry.ingress.sendThrottle|Yes|Number of throttling errors|Count|Total|Number of throttling errors due to device throughput throttles|No Dimensions|
|d2c.telemetry.ingress.success|Yes|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|No Dimensions|
|d2c.twin.read.failure|Yes|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|No Dimensions|
|d2c.twin.read.size|Yes|Response size of twin reads from devices|Bytes|Average|The average, min, and max of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.read.success|Yes|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.update.failure|Yes|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|No Dimensions|
|d2c.twin.update.size|Yes|Size of twin updates from devices|Bytes|Average|The average, min, and max size of all successful device-initiated twin updates.|No Dimensions|
|d2c.twin.update.success|Yes|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|No Dimensions|
|dailyMessageQuotaUsed|Yes|Total number of messages used|Count|Maximum|Number of total messages used today|No Dimensions|
|deviceDataUsage|Yes|Total device data usage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|No Dimensions|
|deviceDataUsageV2|Yes|Total device data usage (preview)|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|No Dimensions|
|devices.connectedDevices.allProtocol|Yes|Connected devices (deprecated) |Count|Total|Number of devices connected to your IoT hub|No Dimensions|
|devices.totalDevices|Yes|Total devices (deprecated)|Count|Total|Number of devices registered to your IoT hub|No Dimensions|
|EventGridDeliveries|Yes|Event Grid deliveries|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|Result, EventType|
|EventGridLatency|Yes|Event Grid latency|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|EventType|
|jobs.cancelJob.failure|Yes|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|No Dimensions|
|jobs.cancelJob.success|Yes|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|No Dimensions|
|jobs.completed|Yes|Completed jobs|Count|Total|The count of all completed jobs.|No Dimensions|
|jobs.createDirectMethodJob.failure|Yes|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|No Dimensions|
|jobs.createDirectMethodJob.success|Yes|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|No Dimensions|
|jobs.createTwinUpdateJob.failure|Yes|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|No Dimensions|
|jobs.createTwinUpdateJob.success|Yes|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|No Dimensions|
|jobs.failed|Yes|Failed jobs|Count|Total|The count of all failed jobs.|No Dimensions|
|jobs.listJobs.failure|Yes|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|No Dimensions|
|jobs.listJobs.success|Yes|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|No Dimensions|
|jobs.queryJobs.failure|Yes|Failed job queries|Count|Total|The count of all failed calls to query jobs.|No Dimensions|
|jobs.queryJobs.success|Yes|Successful job queries|Count|Total|The count of all successful calls to query jobs.|No Dimensions|
|RoutingDataSizeInBytesDelivered|Yes|Routing Delivery Message Size in Bytes (preview)|Bytes|Total|The total size in bytes of messages delivered by IoT hub to an endpoint. You can use the EndpointName and EndpointType dimensions to view the size of the messages in bytes delivered to your different endpoints. The metric value increases for every message delivered, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times.|EndpointType, EndpointName, RoutingSource|
|RoutingDeliveries|Yes|Routing Deliveries (preview)|Count|Total|The number of times IoT Hub attempted to deliver messages to all endpoints using routing. To see the number of successful or failed attempts, use the Result dimension. To see the reason of failure, like invalid, dropped, or orphaned, use the FailureReasonCategory dimension. You can also use the EndpointName and EndpointType dimensions to understand how many messages were delivered to your different endpoints. The metric value increases by one for each delivery attempt, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times.|EndpointType, EndpointName, FailureReasonCategory, Result, RoutingSource|
|RoutingDeliveryLatency|Yes|Routing Delivery Latency (preview)|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into an endpoint. You can use the EndpointName and EndpointType dimensions to understand the latency to your different endpoints.|EndpointType, EndpointName, RoutingSource|
|tenantHub.requestedUsageRate|Yes|requested usage rate|Percent|Average|requested usage rate|No Dimensions|
|totalDeviceCount|Yes|Total devices|Count|Average|Number of devices registered to your IoT hub|No Dimensions|
|twinQueries.failure|Yes|Failed twin queries|Count|Total|The count of all failed twin queries.|No Dimensions|
|twinQueries.resultSize|Yes|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|No Dimensions|
|twinQueries.success|Yes|Successful twin queries|Count|Total|The count of all successful twin queries.|No Dimensions|


## Microsoft.Devices/IotHubs

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|c2d.commands.egress.abandon.success|Yes|C2D messages abandoned|Count|Total|Number of cloud-to-device messages abandoned by the device|No Dimensions|
|c2d.commands.egress.complete.success|Yes|C2D message deliveries completed|Count|Total|Number of cloud-to-device message deliveries completed successfully by the device|No Dimensions|
|c2d.commands.egress.reject.success|Yes|C2D messages rejected|Count|Total|Number of cloud-to-device messages rejected by the device|No Dimensions|
|c2d.methods.failure|Yes|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|No Dimensions|
|c2d.methods.requestSize|Yes|Request size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method requests.|No Dimensions|
|c2d.methods.responseSize|Yes|Response size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method responses.|No Dimensions|
|c2d.methods.success|Yes|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|No Dimensions|
|c2d.twin.read.failure|Yes|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.size|Yes|Response size of twin reads from back end|Bytes|Average|The average, min, and max of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.success|Yes|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.update.failure|Yes|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.size|Yes|Size of twin updates from back end|Bytes|Average|The average, min, and max size of all successful back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.success|Yes|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|No Dimensions|
|C2DMessagesExpired|Yes|C2D Messages Expired|Count|Total|Number of expired cloud-to-device messages|No Dimensions|
|configurations|Yes|Configuration Metrics|Count|Total|Metrics for Configuration Operations|No Dimensions|
|connectedDeviceCount|No|Connected devices|Count|Average|Number of devices connected to your IoT hub|No Dimensions|
|d2c.endpoints.egress.builtIn.events|Yes|Routing: messages delivered to messages/events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events).|No Dimensions|
|d2c.endpoints.egress.eventHubs|Yes|Routing: messages delivered to Event Hub|Count|Total|The number of times IoT Hub routing successfully delivered messages to Event Hub endpoints.|No Dimensions|
|d2c.endpoints.egress.serviceBusQueues|Yes|Routing: messages delivered to Service Bus Queue|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|No Dimensions|
|d2c.endpoints.egress.serviceBusTopics|Yes|Routing: messages delivered to Service Bus Topic|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|No Dimensions|
|d2c.endpoints.egress.storage|Yes|Routing: messages delivered to storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|No Dimensions|
|d2c.endpoints.egress.storage.blobs|Yes|Routing: blobs delivered to storage|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|No Dimensions|
|d2c.endpoints.egress.storage.bytes|Yes|Routing: data delivered to storage|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|No Dimensions|
|d2c.endpoints.latency.builtIn.events|Yes|Routing: message latency for messages/events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into the built-in endpoint (messages/events).|No Dimensions|
|d2c.endpoints.latency.eventHubs|Yes|Routing: message latency for Event Hub|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into an Event Hub endpoint.|No Dimensions|
|d2c.endpoints.latency.serviceBusQueues|Yes|Routing: message latency for Service Bus Queue|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus queue endpoint.|No Dimensions|
|d2c.endpoints.latency.serviceBusTopics|Yes|Routing: message latency for Service Bus Topic|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus topic endpoint.|No Dimensions|
|d2c.endpoints.latency.storage|Yes|Routing: message latency for storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a storage endpoint.|No Dimensions|
|d2c.telemetry.egress.dropped|Yes|Routing: telemetry messages dropped |Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|No Dimensions|
|d2c.telemetry.egress.fallback|Yes|Routing: messages delivered to fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|No Dimensions|
|d2c.telemetry.egress.invalid|Yes|Routing: telemetry messages incompatible|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. This value does not include retries.|No Dimensions|
|d2c.telemetry.egress.orphaned|Yes|Routing: telemetry messages orphaned |Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing rules (including the fallback rule). |No Dimensions|
|d2c.telemetry.egress.success|Yes|Routing: telemetry messages delivered|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|No Dimensions|
|d2c.telemetry.ingress.allProtocol|Yes|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|No Dimensions|
|d2c.telemetry.ingress.sendThrottle|Yes|Number of throttling errors|Count|Total|Number of throttling errors due to device throughput throttles|No Dimensions|
|d2c.telemetry.ingress.success|Yes|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|No Dimensions|
|d2c.twin.read.failure|Yes|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|No Dimensions|
|d2c.twin.read.size|Yes|Response size of twin reads from devices|Bytes|Average|The average, min, and max of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.read.success|Yes|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.update.failure|Yes|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|No Dimensions|
|d2c.twin.update.size|Yes|Size of twin updates from devices|Bytes|Average|The average, min, and max size of all successful device-initiated twin updates.|No Dimensions|
|d2c.twin.update.success|Yes|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|No Dimensions|
|dailyMessageQuotaUsed|Yes|Total number of messages used|Count|Maximum|Number of total messages used today|No Dimensions|
|deviceDataUsage|Yes|Total device data usage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|No Dimensions|
|deviceDataUsageV2|Yes|Total device data usage (preview)|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|No Dimensions|
|devices.connectedDevices.allProtocol|Yes|Connected devices (deprecated) |Count|Total|Number of devices connected to your IoT hub|No Dimensions|
|devices.totalDevices|Yes|Total devices (deprecated)|Count|Total|Number of devices registered to your IoT hub|No Dimensions|
|EventGridDeliveries|Yes|Event Grid deliveries|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|Result, EventType|
|EventGridLatency|Yes|Event Grid latency|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|EventType|
|jobs.cancelJob.failure|Yes|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|No Dimensions|
|jobs.cancelJob.success|Yes|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|No Dimensions|
|jobs.completed|Yes|Completed jobs|Count|Total|The count of all completed jobs.|No Dimensions|
|jobs.createDirectMethodJob.failure|Yes|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|No Dimensions|
|jobs.createDirectMethodJob.success|Yes|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|No Dimensions|
|jobs.createTwinUpdateJob.failure|Yes|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|No Dimensions|
|jobs.createTwinUpdateJob.success|Yes|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|No Dimensions|
|jobs.failed|Yes|Failed jobs|Count|Total|The count of all failed jobs.|No Dimensions|
|jobs.listJobs.failure|Yes|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|No Dimensions|
|jobs.listJobs.success|Yes|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|No Dimensions|
|jobs.queryJobs.failure|Yes|Failed job queries|Count|Total|The count of all failed calls to query jobs.|No Dimensions|
|jobs.queryJobs.success|Yes|Successful job queries|Count|Total|The count of all successful calls to query jobs.|No Dimensions|
|RoutingDataSizeInBytesDelivered|Yes|Routing Delivery Message Size in Bytes (preview)|Bytes|Total|The total size in bytes of messages delivered by IoT hub to an endpoint. You can use the EndpointName and EndpointType dimensions to view the size of the messages in bytes delivered to your different endpoints. The metric value increases for every message delivered, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times.|EndpointType, EndpointName, RoutingSource|
|RoutingDeliveries|Yes|Routing Deliveries (preview)|Count|Total|The number of times IoT Hub attempted to deliver messages to all endpoints using routing. To see the number of successful or failed attempts, use the Result dimension. To see the reason of failure, like invalid, dropped, or orphaned, use the FailureReasonCategory dimension. You can also use the EndpointName and EndpointType dimensions to understand how many messages were delivered to your different endpoints. The metric value increases by one for each delivery attempt, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times.|EndpointType, EndpointName, FailureReasonCategory, Result, RoutingSource|
|RoutingDeliveryLatency|Yes|Routing Delivery Latency (preview)|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into an endpoint. You can use the EndpointName and EndpointType dimensions to understand the latency to your different endpoints.|EndpointType, EndpointName, RoutingSource|
|totalDeviceCount|No|Total devices|Count|Average|Number of devices registered to your IoT hub|No Dimensions|
|twinQueries.failure|Yes|Failed twin queries|Count|Total|The count of all failed twin queries.|No Dimensions|
|twinQueries.resultSize|Yes|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|No Dimensions|
|twinQueries.success|Yes|Successful twin queries|Count|Total|The count of all successful twin queries.|No Dimensions|


## Microsoft.Devices/provisioningServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AttestationAttempts|Yes|Attestation attempts|Count|Total|Number of device attestations attempted|ProvisioningServiceName, Status, Protocol|
|DeviceAssignments|Yes|Devices assigned|Count|Total|Number of devices assigned to an IoT hub|ProvisioningServiceName, IotHubName|
|RegistrationAttempts|Yes|Registration attempts|Count|Total|Number of device registrations attempted|ProvisioningServiceName, IotHubName, Status|


## Microsoft.DigitalTwins/digitalTwinsInstances

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApiRequests|Yes|API Requests|Count|Total|The number of API requests made for Digital Twins read, write, delete and query operations.|Operation, Authentication, Protocol, StatusCode, StatusCodeClass, StatusText|
|ApiRequestsFailureRate|Yes|API Requests Failure Rate|Percent|Average|The percentage of API requests that the service receives for your instance that return an internal error (500) response code for Digital Twins read, write, delete and query operations.|Operation, Authentication, Protocol|
|ApiRequestsLatency|Yes|API Requests Latency|Milliseconds|Average|The response time for API requests, i.e. from when the request is received by Azure Digital Twins until the service sends a success/fail result for Digital Twins read, write, delete and query operations.|Operation, Authentication, Protocol, StatusCode, StatusCodeClass, StatusText|
|BillingApiOperations|Yes|Billing API Operations|Count|Total|Billing metric for the count of all API requests made against the Azure Digital Twins service.|MeterId|
|BillingMessagesProcessed|Yes|Billing Messages Processed|Count|Total|Billing metric for the number of messages sent out from Azure Digital Twins to external endpoints.|MeterId|
|BillingQueryUnits|Yes|Billing Query Units|Count|Total|The number of Query Units, an internally computed measure of service resource usage, consumed to execute queries.|MeterId|
|IngressEvents|Yes|Ingress Events|Count|Total|The number of incoming telemetry events into Azure Digital Twins.|Result|
|IngressEventsFailureRate|Yes|Ingress Events Failure Rate|Percent|Average|The percentage of incoming telemetry events for which the service returns an internal error (500) response code.|No Dimensions|
|IngressEventsLatency|Yes|Ingress Events Latency|Milliseconds|Average|The time from when an event arrives to when it is ready to be egressed by Azure Digital Twins, at which point the service sends a success/fail result.|Result|
|ModelCount|Yes|Model Count|Count|Total|Total number of models in the Azure Digital Twins instance. Use this metric to determine if you are approaching the service limit for max number of models allowed per instance.|No Dimensions|
|Routing|Yes|Messages Routed|Count|Total|The number of messages routed to an endpoint Azure service such as Event Hub, Service Bus or Event Grid.|EndpointType, Result|
|RoutingFailureRate|Yes|Routing Failure Rate|Percent|Average|The percentage of events that result in an error as they are routed from Azure Digital Twins to an endpoint Azure service such as Event Hub, Service Bus or Event Grid.|EndpointType|
|RoutingLatency|Yes|Routing Latency|Milliseconds|Average|Time elapsed between an event getting routed from Azure Digital Twins to when it is posted to the endpoint Azure service such as Event Hub, Service Bus or Event Grid.|EndpointType, Result|
|TwinCount|Yes|Twin Count|Count|Total|Total number of twins in the Azure Digital Twins instance. Use this metric to determine if you are approaching the service limit for max number of twins allowed per instance.|No Dimensions|


## Microsoft.DocumentDB/databaseAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AddRegion|Yes|Region Added|Count|Count|Region Added|Region|
|AutoscaleMaxThroughput|No|Autoscale Max Throughput|Count|Maximum|Autoscale Max Throughput|DatabaseName, CollectionName|
|AvailableStorage|No|(deprecated) Available Storage|Bytes|Total|"Available Storage" will be removed from Azure Monitor at the end of September 2023. Cosmos DB collection storage size is now unlimited. The only restriction is that the storage size for each logical partition key is 20GB. You can enable PartitionKeyStatistics in Diagnostic Log to know the storage consumption for top partition keys. For more info about Cosmos DB storage quota, please check this doc https://docs.microsoft.com/azure/cosmos-db/concepts-limits. After deprecation, the remaining alert rules still defined on the deprecated metric will be automatically disabled post the deprecation date.|CollectionName, DatabaseName, Region|
|CassandraConnectionClosures|No|Cassandra Connection Closures|Count|Total|Number of Cassandra connections that were closed, reported at a 1 minute granularity|Region, ClosureReason|
|CassandraConnectorAvgReplicationLatency|No|Cassandra Connector Average ReplicationLatency|MilliSeconds|Average|Cassandra Connector Average ReplicationLatency|No Dimensions|
|CassandraConnectorReplicationHealthStatus|No|Cassandra Connector Replication Health Status|Count|Count|Cassandra Connector Replication Health Status|NotStarted, ReplicationInProgress, Error|
|CassandraKeyspaceCreate|No|Cassandra Keyspace Created|Count|Count|Cassandra Keyspace Created|ResourceName, |
|CassandraKeyspaceDelete|No|Cassandra Keyspace Deleted|Count|Count|Cassandra Keyspace Deleted|ResourceName, |
|CassandraKeyspaceThroughputUpdate|No|Cassandra Keyspace Throughput Updated|Count|Count|Cassandra Keyspace Throughput Updated|ResourceName, |
|CassandraKeyspaceUpdate|No|Cassandra Keyspace Updated|Count|Count|Cassandra Keyspace Updated|ResourceName, |
|CassandraRequestCharges|No|Cassandra Request Charges|Count|Total|RUs consumed for Cassandra requests made|DatabaseName, CollectionName, Region, OperationType, ResourceType|
|CassandraRequests|No|Cassandra Requests|Count|Count|Number of Cassandra requests made|DatabaseName, CollectionName, Region, OperationType, ResourceType, ErrorCode|
|CassandraTableCreate|No|Cassandra Table Created|Count|Count|Cassandra Table Created|ResourceName, ChildResourceName, |
|CassandraTableDelete|No|Cassandra Table Deleted|Count|Count|Cassandra Table Deleted|ResourceName, ChildResourceName, |
|CassandraTableThroughputUpdate|No|Cassandra Table Throughput Updated|Count|Count|Cassandra Table Throughput Updated|ResourceName, ChildResourceName, |
|CassandraTableUpdate|No|Cassandra Table Updated|Count|Count|Cassandra Table Updated|ResourceName, ChildResourceName, |
|CreateAccount|Yes|Account Created|Count|Count|Account Created|No Dimensions|
|DataUsage|No|Data Usage|Bytes|Total|Total data usage reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|DedicatedGatewayRequests|Yes|DedicatedGatewayRequests|Count|Count|Requests at the dedicated gateway|DatabaseName, CollectionName, CacheExercised, OperationName, Region|
|DeleteAccount|Yes|Account Deleted|Count|Count|Account Deleted|No Dimensions|
|DocumentCount|No|Document Count|Count|Total|Total document count reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|DocumentQuota|No|Document Quota|Bytes|Total|Total storage quota reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|GremlinDatabaseCreate|No|Gremlin Database Created|Count|Count|Gremlin Database Created|ResourceName, |
|GremlinDatabaseDelete|No|Gremlin Database Deleted|Count|Count|Gremlin Database Deleted|ResourceName, |
|GremlinDatabaseThroughputUpdate|No|Gremlin Database Throughput Updated|Count|Count|Gremlin Database Throughput Updated|ResourceName, |
|GremlinDatabaseUpdate|No|Gremlin Database Updated|Count|Count|Gremlin Database Updated|ResourceName, |
|GremlinGraphCreate|No|Gremlin Graph Created|Count|Count|Gremlin Graph Created|ResourceName, ChildResourceName, |
|GremlinGraphDelete|No|Gremlin Graph Deleted|Count|Count|Gremlin Graph Deleted|ResourceName, ChildResourceName, |
|GremlinGraphThroughputUpdate|No|Gremlin Graph Throughput Updated|Count|Count|Gremlin Graph Throughput Updated|ResourceName, ChildResourceName, |
|GremlinGraphUpdate|No|Gremlin Graph Updated|Count|Count|Gremlin Graph Updated|ResourceName, ChildResourceName, |
|IndexUsage|No|Index Usage|Bytes|Total|Total index usage reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|IntegratedCacheEvictedEntriesSize|No|IntegratedCacheEvictedEntriesSize|Bytes|Average|Size of the entries evicted from the integrated cache|CacheType, Region|
|IntegratedCacheHitRate|No|IntegratedCacheHitRate|Percent|Average|Cache hit rate for integrated caches|CacheType, Region|
|IntegratedCacheSize|No|IntegratedCacheSize|Bytes|Average|Size of the integrated caches for dedicated gateway requests|CacheType, Region|
|IntegratedCacheTTLExpirationCount|No|IntegratedCacheTTLExpirationCount|Count|Average|Number of entries removed from the integrated cache due to TTL expiration|CacheType, Region|
|MetadataRequests|No|Metadata Requests|Count|Count|Count of metadata requests. Cosmos DB maintains system metadata collection for each account, that allows you to enumerate collections, databases, etc, and their configurations, free of charge.|DatabaseName, CollectionName, Region, StatusCode, |
|MongoCollectionCreate|No|Mongo Collection Created|Count|Count|Mongo Collection Created|ResourceName, ChildResourceName, |
|MongoCollectionDelete|No|Mongo Collection Deleted|Count|Count|Mongo Collection Deleted|ResourceName, ChildResourceName, |
|MongoCollectionThroughputUpdate|No|Mongo Collection Throughput Updated|Count|Count|Mongo Collection Throughput Updated|ResourceName, ChildResourceName, |
|MongoCollectionUpdate|No|Mongo Collection Updated|Count|Count|Mongo Collection Updated|ResourceName, ChildResourceName, |
|MongoDatabaseDelete|No|Mongo Database Deleted|Count|Count|Mongo Database Deleted|ResourceName, |
|MongoDatabaseThroughputUpdate|No|Mongo Database Throughput Updated|Count|Count|Mongo Database Throughput Updated|ResourceName, |
|MongoDBDatabaseCreate|No|Mongo Database Created|Count|Count|Mongo Database Created|ResourceName, |
|MongoDBDatabaseUpdate|No|Mongo Database Updated|Count|Count|Mongo Database Updated|ResourceName, |
|MongoRequestCharge|Yes|Mongo Request Charge|Count|Total|Mongo Request Units Consumed|DatabaseName, CollectionName, Region, CommandName, ErrorCode, Status|
|MongoRequests|Yes|Mongo Requests|Count|Count|Number of Mongo Requests Made|DatabaseName, CollectionName, Region, CommandName, ErrorCode, Status|
|MongoRequestsCount|No|(deprecated) Mongo Request Rate|CountPerSecond|Average|Mongo request Count per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsDelete|No|(deprecated) Mongo Delete Request Rate|CountPerSecond|Average|Mongo Delete request per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsInsert|No|(deprecated) Mongo Insert Request Rate|CountPerSecond|Average|Mongo Insert count per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsQuery|No|(deprecated) Mongo Query Request Rate|CountPerSecond|Average|Mongo Query request per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsUpdate|No|(deprecated) Mongo Update Request Rate|CountPerSecond|Average|Mongo Update request per second|DatabaseName, CollectionName, Region, ErrorCode|
|NormalizedRUConsumption|No|Normalized RU Consumption|Percent|Maximum|Max RU consumption percentage per minute|CollectionName, DatabaseName, Region, PartitionKeyRangeId|
|ProvisionedThroughput|No|Provisioned Throughput|Count|Maximum|Provisioned Throughput|DatabaseName, CollectionName|
|RegionFailover|Yes|Region Failed Over|Count|Count|Region Failed Over|No Dimensions|
|RemoveRegion|Yes|Region Removed|Count|Count|Region Removed|Region|
|ReplicationLatency|Yes|P99 Replication Latency|MilliSeconds|Average|P99 Replication Latency across source and target regions for geo-enabled account|SourceRegion, TargetRegion|
|ServerSideLatency|No|Server Side Latency|MilliSeconds|Average|Server Side Latency|DatabaseName, CollectionName, Region, ConnectionMode, OperationType, PublicAPIType|
|ServiceAvailability|No|Service Availability|Percent|Average|Account requests availability at one hour, day or month granularity|No Dimensions|
|SqlContainerCreate|No|Sql Container Created|Count|Count|Sql Container Created|ResourceName, ChildResourceName, |
|SqlContainerDelete|No|Sql Container Deleted|Count|Count|Sql Container Deleted|ResourceName, ChildResourceName, |
|SqlContainerThroughputUpdate|No|Sql Container Throughput Updated|Count|Count|Sql Container Throughput Updated|ResourceName, ChildResourceName, |
|SqlContainerUpdate|No|Sql Container Updated|Count|Count|Sql Container Updated|ResourceName, ChildResourceName, |
|SqlDatabaseCreate|No|Sql Database Created|Count|Count|Sql Database Created|ResourceName, |
|SqlDatabaseDelete|No|Sql Database Deleted|Count|Count|Sql Database Deleted|ResourceName, |
|SqlDatabaseThroughputUpdate|No|Sql Database Throughput Updated|Count|Count|Sql Database Throughput Updated|ResourceName, |
|SqlDatabaseUpdate|No|Sql Database Updated|Count|Count|Sql Database Updated|ResourceName, |
|TableTableCreate|No|AzureTable Table Created|Count|Count|AzureTable Table Created|ResourceName, |
|TableTableDelete|No|AzureTable Table Deleted|Count|Count|AzureTable Table Deleted|ResourceName, |
|TableTableThroughputUpdate|No|AzureTable Table Throughput Updated|Count|Count|AzureTable Table Throughput Updated|ResourceName, |
|TableTableUpdate|No|AzureTable Table Updated|Count|Count|AzureTable Table Updated|ResourceName, |
|TotalRequests|Yes|Total Requests|Count|Count|Number of requests made|DatabaseName, CollectionName, Region, StatusCode, OperationType, Status|
|TotalRequestUnits|Yes|Total Request Units|Count|Total|Request Units consumed|DatabaseName, CollectionName, Region, StatusCode, OperationType, Status|
|UpdateAccountKeys|Yes|Account Keys Updated|Count|Count|Account Keys Updated|KeyType|
|UpdateAccountNetworkSettings|Yes|Account Network Settings Updated|Count|Count|Account Network Settings Updated|No Dimensions|
|UpdateAccountReplicationSettings|Yes|Account Replication Settings Updated|Count|Count|Account Replication Settings Updated|No Dimensions|
|UpdateDiagnosticsSettings|No|Account Diagnostic Settings Updated|Count|Count|Account Diagnostic Settings Updated|DiagnosticSettingsName, ResourceGroupName|


## Microsoft.EventGrid/domains

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, DeadLetterReason|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, Error, ErrorType|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName, DropReason|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|Topic, EventSubscriptionName, DomainEventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|Topic, ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|Topic|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|


## Microsoft.EventGrid/eventSubscriptions

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|No Dimensions|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|No Dimensions|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|No Dimensions|


## Microsoft.EventGrid/extensionTopics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Microsoft.EventGrid/partnerNamespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Microsoft.EventGrid/partnerTopics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Microsoft.EventGrid/systemTopics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Microsoft.EventGrid/topics

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdvancedFilterEvaluationCount|Yes|Advanced Filter Evaluations|Count|Total|Total advanced filters evaluated across event subscriptions for this topic.|EventSubscriptionName|
|DeadLetteredCount|Yes|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason, EventSubscriptionName|
|DeliveryAttemptFailCount|No|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType, EventSubscriptionName|
|DeliverySuccessCount|Yes|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|No|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Yes|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason, EventSubscriptionName|
|MatchedEventCount|Yes|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|PublishFailCount|Yes|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|PublishSuccessCount|Yes|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishSuccessLatencyInMs|Yes|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|No Dimensions|
|UnmatchedEventCount|Yes|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|


## Microsoft.EventHub/clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.||
|AvailableMemory|No|Available Memory|Percent|Maximum|Available memory for the Event Hub Cluster as a percentage of total memory.|Role|
|CaptureBacklog|No|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.||
|CapturedBytes|No|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.||
|CapturedMessages|No|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.||
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.||
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.||
|CPU|No|CPU|Percent|Maximum|CPU utilization for the Event Hub Cluster as a percentage|Role|
|IncomingBytes|Yes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.||
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.||
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.||
|OutgoingBytes|Yes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.||
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.||
|QuotaExceededErrors|No|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|OperationResult|
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|OperationResult|
|Size|No|Size|Bytes|Average|Size of an EventHub in Bytes.|Role|
|SuccessfulRequests|No|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|OperationResult|
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|OperationResult|
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|OperationResult|


## Microsoft.EventHub/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.||
|CaptureBacklog|No|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|EntityName|
|CapturedBytes|No|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|EntityName|
|CapturedMessages|No|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|EntityName|
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|EntityName|
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|EntityName|
|EHABL|Yes|Archive backlog messages (Deprecated)|Count|Total|Event Hub archive messages in backlog for a namespace (Deprecated)||
|EHAMBS|Yes|Archive message throughput (Deprecated)|Bytes|Total|Event Hub archived message throughput in a namespace (Deprecated)||
|EHAMSGS|Yes|Archive messages (Deprecated)|Count|Total|Event Hub archived messages in a namespace (Deprecated)||
|EHINBYTES|Yes|Incoming bytes (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace (Deprecated)||
|EHINMBS|Yes|Incoming bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace. This metric is deprecated. Please use Incoming bytes metric instead (Deprecated)||
|EHINMSGS|Yes|Incoming Messages (Deprecated)|Count|Total|Total incoming messages for a namespace (Deprecated)||
|EHOUTBYTES|Yes|Outgoing bytes (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace (Deprecated)||
|EHOUTMBS|Yes|Outgoing bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace. This metric is deprecated. Please use Outgoing bytes metric instead (Deprecated)||
|EHOUTMSGS|Yes|Outgoing Messages (Deprecated)|Count|Total|Total outgoing messages for a namespace (Deprecated)||
|FAILREQ|Yes|Failed Requests (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)||
|IncomingBytes|Yes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|EntityName|
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|EntityName|
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|EntityName|
|INMSGS|Yes|Incoming Messages (obsolete) (Deprecated)|Count|Total|Total incoming messages for a namespace. This metric is deprecated. Please use Incoming Messages metric instead (Deprecated)||
|INREQS|Yes|Incoming Requests (Deprecated)|Count|Total|Total incoming send requests for a namespace (Deprecated)||
|INTERR|Yes|Internal Server Errors (Deprecated)|Count|Total|Total internal server errors for a namespace (Deprecated)||
|MISCERR|Yes|Other Errors (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)||
|OutgoingBytes|Yes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|EntityName|
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|EntityName|
|OUTMSGS|Yes|Outgoing Messages (obsolete) (Deprecated)|Count|Total|Total outgoing messages for a namespace. This metric is deprecated. Please use Outgoing Messages metric instead (Deprecated)||
|QuotaExceededErrors|No|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|EntityName, OperationResult|
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|EntityName, OperationResult|
|Size|No|Size|Bytes|Average|Size of an EventHub in Bytes.|EntityName|
|SuccessfulRequests|No|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|EntityName, OperationResult|
|SUCCREQ|Yes|Successful Requests (Deprecated)|Count|Total|Total successful requests for a namespace (Deprecated)||
|SVRBSY|Yes|Server Busy Errors (Deprecated)|Count|Total|Total server busy errors for a namespace (Deprecated)||
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|EntityName, OperationResult|
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|EntityName, OperationResult|


## Microsoft.HDInsight/clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CategorizedGatewayRequests|Yes|Categorized Gateway Requests|Count|Total|Number of gateway requests by categories (1xx/2xx/3xx/4xx/5xx)|HttpStatus|
|GatewayRequests|Yes|Gateway Requests|Count|Total|Number of gateway requests|HttpStatus|
|KafkaRestProxy.ConsumerRequest.m1_delta|Yes|REST proxy Consumer RequestThroughput|CountPerSecond|Total|Number of consumer requests to Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.ConsumerRequestFail.m1_delta|Yes|REST proxy Consumer Unsuccessful Requests|CountPerSecond|Total|Consumer request exceptions|Machine, Topic|
|KafkaRestProxy.ConsumerRequestTime.p95|Yes|REST proxy Consumer RequestLatency|Milliseconds|Average|Message latency in a consumer request through Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.ConsumerRequestWaitingInQueueTime.p95|Yes|REST proxy Consumer Request Backlog|Milliseconds|Average|Consumer REST proxy queue length|Machine, Topic|
|KafkaRestProxy.MessagesIn.m1_delta|Yes|REST proxy Producer MessageThroughput|CountPerSecond|Total|Number of producer messages through Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.MessagesOut.m1_delta|Yes|REST proxy Consumer MessageThroughput|CountPerSecond|Total|Number of consumer messages through Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.OpenConnections|Yes|REST proxy ConcurrentConnections|Count|Total|Number of concurrent connections through Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.ProducerRequest.m1_delta|Yes|REST proxy Producer RequestThroughput|CountPerSecond|Total|Number of producer requests to Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.ProducerRequestFail.m1_delta|Yes|REST proxy Producer Unsuccessful Requests|CountPerSecond|Total|Producer request exceptions|Machine, Topic|
|KafkaRestProxy.ProducerRequestTime.p95|Yes|REST proxy Producer RequestLatency|Milliseconds|Average|Message latency in a producer request through Kafka REST proxy|Machine, Topic|
|KafkaRestProxy.ProducerRequestWaitingInQueueTime.p95|Yes|REST proxy Producer Request Backlog|Milliseconds|Average|Producer REST proxy queue length|Machine, Topic|
|NumActiveWorkers|Yes|Number of Active Workers|Count|Maximum|Number of Active Workers|MetricName|


## Microsoft.HealthcareApis/services

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The availability rate of the service.|No Dimensions|
|CosmosDbCollectionSize|Yes|Cosmos DB Collection Size|Bytes|Total|The size of the backing Cosmos DB collection, in bytes.|No Dimensions|
|CosmosDbIndexSize|Yes|Cosmos DB Index Size|Bytes|Total|The size of the backing Cosmos DB collection's index, in bytes.|No Dimensions|
|CosmosDbRequestCharge|Yes|Cosmos DB RU usage|Count|Total|The RU usage of requests to the service's backing Cosmos DB.|Operation, ResourceType|
|CosmosDbRequests|Yes|Service Cosmos DB requests|Count|Sum|The total number of requests made to a service's backing Cosmos DB.|Operation, ResourceType|
|CosmosDbThrottleRate|Yes|Service Cosmos DB throttle rate|Count|Sum|The total number of 429 responses from a service's backing Cosmos DB.|Operation, ResourceType|
|IoTConnectorDeviceEvent|Yes|Number of Incoming Messages|Count|Sum|The total number of messages received by the Azure IoT Connector for FHIR prior to any normalization.|Operation, ConnectorName|
|IoTConnectorDeviceEventProcessingLatencyMs|Yes|Average Normalize Stage Latency|Milliseconds|Average|The average time between an event's ingestion time and the time the event is processed for normalization.|Operation, ConnectorName|
|IoTConnectorMeasurement|Yes|Number of Measurements|Count|Sum|The number of normalized value readings received by the FHIR conversion stage of the Azure IoT Connector for FHIR.|Operation, ConnectorName|
|IoTConnectorMeasurementGroup|Yes|Number of Message Groups|Count|Sum|The total number of unique groupings of measurements across type, device, patient, and configured time period generated by the FHIR conversion stage.|Operation, ConnectorName|
|IoTConnectorMeasurementIngestionLatencyMs|Yes|Average Group Stage Latency|Milliseconds|Average|The time period between when the IoT Connector received the device data and when the data is processed by the FHIR conversion stage.|Operation, ConnectorName|
|IoTConnectorNormalizedEvent|Yes|Number of Normalized Messages|Count|Sum|The total number of mapped normalized values outputted from the normalization stage of the the Azure IoT Connector for FHIR.|Operation, ConnectorName|
|IoTConnectorTotalErrors|Yes|Total Error Count|Count|Sum|The total number of errors logged by the Azure IoT Connector for FHIR|Name, Operation, ErrorType, ErrorSeverity, ConnectorName|
|ServiceApiErrors|Yes|Service Errors|Count|Sum|The total number of internal server errors generated by the service.|Protocol, Authentication, Operation, ResourceType, StatusCode, StatusCodeClass, StatusCodeText|
|ServiceApiLatency|Yes|Service Latency|Milliseconds|Average|The response latency of the service.|Protocol, Authentication, Operation, ResourceType, StatusCode, StatusCodeClass, StatusCodeText|
|ServiceApiRequests|Yes|Service Requests|Count|Sum|The total number of requests received by the service.|Protocol, Authentication, Operation, ResourceType, StatusCode, StatusCodeClass, StatusCodeText|
|TotalErrors|Yes|Total Errors|Count|Sum|The total number of internal server errors encountered by the service.|Protocol, StatusCode, StatusCodeClass, StatusCodeText|
|TotalLatency|Yes|Total Latency|Milliseconds|Average|The response latency of the service.|Protocol|
|TotalRequests|Yes|Total Requests|Count|Sum|The total number of requests received by the service.|Protocol|


## microsoft.hybridnetwork/networkfunctions

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HyperVVirtualProcessorUtilization|Yes|Average CPU Utilization|Percent|Average|Total average percentage of virtual CPU utilization at one minute interval. The total number of virtual CPU is based on user configured value in SKU definition. Further filter can be applied based on RoleName defined in SKU.|InstanceName|


## microsoft.hybridnetwork/virtualnetworkfunctions

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|HyperVVirtualProcessorUtilization|Yes|Average CPU Utilization|Percent|Average|Total average percentage of virtual CPU utilization at one minute interval. The total number of virtual CPU is based on user configured value in SKU definition. Further filter can be applied based on RoleName defined in SKU.|InstanceName|


## microsoft.insights/autoscalesettings

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|MetricThreshold|Yes|Metric Threshold|Count|Average|The configured autoscale threshold when autoscale ran.|MetricTriggerRule|
|ObservedCapacity|Yes|Observed Capacity|Count|Average|The capacity reported to autoscale when it executed.||
|ObservedMetricValue|Yes|Observed Metric Value|Count|Average|The value computed by autoscale when executed|MetricTriggerSource|
|ScaleActionsInitiated|Yes|Scale Actions Initiated|Count|Total|The direction of the scale operation.|ScaleDirection|


## Microsoft.Insights/Components

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|availabilityResults/availabilityPercentage|Yes|Availability|Percent|Average|Percentage of successfully completed availability tests|availabilityResult/name, availabilityResult/location|
|availabilityResults/count|No|Availability tests|Count|Count|Count of availability tests|availabilityResult/name, availabilityResult/location, availabilityResult/success|
|availabilityResults/duration|Yes|Availability test duration|MilliSeconds|Average|Availability test duration|availabilityResult/name, availabilityResult/location, availabilityResult/success|
|browserTimings/networkDuration|Yes|Page load network connect time|MilliSeconds|Average|Time between user request and network connection. Includes DNS lookup and transport connection.|No Dimensions|
|browserTimings/processingDuration|Yes|Client processing time|MilliSeconds|Average|Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing.|No Dimensions|
|browserTimings/receiveDuration|Yes|Receiving response time|MilliSeconds|Average|Time between the first and last bytes, or until disconnection.|No Dimensions|
|browserTimings/sendDuration|Yes|Send request time|MilliSeconds|Average|Time between network connection and receiving the first byte.|No Dimensions|
|browserTimings/totalDuration|Yes|Browser page load time|MilliSeconds|Average|Time from user request until DOM, stylesheets, scripts and images are loaded.|No Dimensions|
|dependencies/count|No|Dependency calls|Count|Count|Count of calls made by the application to external resources.|dependency/type, dependency/performanceBucket, dependency/success, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName|
|dependencies/duration|Yes|Dependency duration|MilliSeconds|Average|Duration of calls made by the application to external resources.|dependency/type, dependency/performanceBucket, dependency/success, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName|
|dependencies/failed|No|Dependency call failures|Count|Count|Count of failed dependency calls made by the application to external resources.|dependency/type, dependency/performanceBucket, dependency/target, dependency/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName|
|exceptions/browser|No|Browser exceptions|Count|Count|Count of uncaught exceptions thrown in the browser.|cloud/roleName|
|exceptions/count|Yes|Exceptions|Count|Count|Combined count of all uncaught exceptions.|cloud/roleName, cloud/roleInstance, client/type|
|exceptions/server|No|Server exceptions|Count|Count|Count of uncaught exceptions thrown in the server application.|cloud/roleName, cloud/roleInstance|
|pageViews/count|Yes|Page views|Count|Count|Count of page views.|operation/synthetic, cloud/roleName|
|pageViews/duration|Yes|Page view load time|MilliSeconds|Average|Page view load time|operation/synthetic, cloud/roleName|
|performanceCounters/exceptionsPerSecond|Yes|Exception rate|CountPerSecond|Average|Count of handled and unhandled exceptions reported to windows, including .NET exceptions and unmanaged exceptions that are converted into .NET exceptions.|cloud/roleInstance|
|performanceCounters/memoryAvailableBytes|Yes|Available memory|Bytes|Average|Physical memory immediately available for allocation to a process or for system use.|cloud/roleInstance|
|performanceCounters/processCpuPercentage|Yes|Process CPU|Percent|Average|The percentage of elapsed time that all process threads used the processor to execute instructions. This can vary between 0 to 100. This metric indicates the performance of w3wp process alone.|cloud/roleInstance|
|performanceCounters/processIOBytesPerSecond|Yes|Process IO rate|BytesPerSecond|Average|Total bytes per second read and written to files, network and devices.|cloud/roleInstance|
|performanceCounters/processorCpuPercentage|Yes|Processor time|Percent|Average|The percentage of time that the processor spends in non-idle threads.|cloud/roleInstance|
|performanceCounters/processPrivateBytes|Yes|Process private bytes|Bytes|Average|Memory exclusively assigned to the monitored application's processes.|cloud/roleInstance|
|performanceCounters/requestExecutionTime|Yes|HTTP request execution time|MilliSeconds|Average|Execution time of the most recent request.|cloud/roleInstance|
|performanceCounters/requestsInQueue|Yes|HTTP requests in application queue|Count|Average|Length of the application request queue.|cloud/roleInstance|
|performanceCounters/requestsPerSecond|Yes|HTTP request rate|CountPerSecond|Average|Rate of all requests to the application per second from ASP.NET.|cloud/roleInstance|
|requests/count|No|Server requests|Count|Count|Count of HTTP requests completed.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|requests/duration|Yes|Server response time|MilliSeconds|Average|Time between receiving an HTTP request and finishing sending the response.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|requests/failed|No|Failed requests|Count|Count|Count of HTTP requests marked as failed. In most cases these are requests with a response code >= 400 and not equal to 401.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName|
|requests/rate|No|Server request rate|CountPerSecond|Average|Rate of server requests per second|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|traces/count|Yes|Traces|Count|Count|Trace document count|trace/severityLevel, operation/synthetic, cloud/roleName, cloud/roleInstance|


## Microsoft.IoTCentral/IoTApps

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|c2d.commands.failure|Yes|Failed command invocations|Count|Total|The count of all failed command requests initiated from IoT Central|No Dimensions|
|c2d.commands.requestSize|Yes|Request size of command invocations|Bytes|Total|Request size of all command requests initiated from IoT Central|No Dimensions|
|c2d.commands.responseSize|Yes|Response size of command invocations|Bytes|Total|Response size of all command responses initiated from IoT Central|No Dimensions|
|c2d.commands.success|Yes|Successful command invocations|Count|Total|The count of all successful command requests initiated from IoT Central|No Dimensions|
|c2d.property.read.failure|Yes|Failed Device Property Reads from IoT Central|Count|Total|The count of all failed property reads initiated from IoT Central|No Dimensions|
|c2d.property.read.success|Yes|Successful Device Property Reads from IoT Central|Count|Total|The count of all successful property reads initiated from IoT Central|No Dimensions|
|c2d.property.update.failure|Yes|Failed Device Property Updates from IoT Central|Count|Total|The count of all failed property updates initiated from IoT Central|No Dimensions|
|c2d.property.update.success|Yes|Successful Device Property Updates from IoT Central|Count|Total|The count of all successful property updates initiated from IoT Central|No Dimensions|
|connectedDeviceCount|No|Total Connected Devices|Count|Average|Number of devices connected to IoT Central|No Dimensions|
|d2c.property.read.failure|Yes|Failed Device Property Reads from Devices|Count|Total|The count of all failed property reads initiated from devices|No Dimensions|
|d2c.property.read.success|Yes|Successful Device Property Reads from Devices|Count|Total|The count of all successful property reads initiated from devices|No Dimensions|
|d2c.property.update.failure|Yes|Failed Device Property Updates from Devices|Count|Total|The count of all failed property updates initiated from devices|No Dimensions|
|d2c.property.update.success|Yes|Successful Device Property Updates from Devices|Count|Total|The count of all successful property updates initiated from devices|No Dimensions|
|d2c.telemetry.ingress.allProtocol|Yes|Total Telemetry Message Send Attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to the IoT Central application|No Dimensions|
|d2c.telemetry.ingress.success|Yes|Total Telemetry Messages Sent|Count|Total|Number of device-to-cloud telemetry messages successfully sent to the IoT Central application|No Dimensions|
|dataExport.error|Yes|Data Export Errors|Count|Total|Number of errors encountered for data export|exportId, exportDisplayName, destinationId, destinationDisplayName|
|dataExport.messages.filtered|Yes|Data Export Messages Filtered|Count|Total|Number of messages that have passed through filters in data export|exportId, exportDisplayName, destinationId, destinationDisplayName|
|dataExport.messages.received|Yes|Data Export Messages Received|Count|Total|Number of messages incoming to data export, before filtering and enrichment processing|exportId, exportDisplayName, destinationId, destinationDisplayName|
|dataExport.messages.written|Yes|Data Export Messages Written|Count|Total|Number of messages written to a destination|exportId, exportDisplayName, destinationId, destinationDisplayName|
|dataExport.statusChange|Yes|Data Export Status Change|Count|Total|Number of status changes|exportId, exportDisplayName, destinationId, destinationDisplayName, status|
|deviceDataUsage|Yes|Total Device Data Usage|Bytes|Total|Bytes transferred to and from any devices connected to IoT Central application|No Dimensions|
|provisionedDeviceCount|No|Total Provisioned Devices|Count|Average|Number of devices provisioned in IoT Central application|No Dimensions|

## microsoft.keyvault/managedhsms

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|No|Overall Service Availability|Percent|Average|Service requests availability|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|ServiceApiHit|Yes|Total Service Api Hits|Count|Count|Number of total service api hits|ActivityType, ActivityName|
|ServiceApiLatency|No|Overall Service Api Latency|Milliseconds|Average|Overall latency of service api requests|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|ServiceApiResult|Yes|Total Service Api Results|Count|Count|Number of total service api results|ActivityType, ActivityName, StatusCode, StatusCodeClass|


## Microsoft.KeyVault/vaults

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Overall Vault Availability|Percent|Average|Vault requests availability|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|SaturationShoebox|No|Overall Vault Saturation|Percent|Average|Vault capacity used|ActivityType, ActivityName, TransactionType|
|ServiceApiHit|Yes|Total Service Api Hits|Count|Count|Number of total service api hits|ActivityType, ActivityName|
|ServiceApiLatency|Yes|Overall Service Api Latency|Milliseconds|Average|Overall latency of service api requests|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|ServiceApiResult|Yes|Total Service Api Results|Count|Count|Number of total service api results|ActivityType, ActivityName, StatusCode, StatusCodeClass|


## microsoft.kubernetes/connectedClusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|capacity_cpu_cores|Yes|Total number of cpu cores in a connected cluster|Count|Total|Total number of cpu cores in a connected cluster||


## Microsoft.Kusto/Clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BatchBlobCount|Yes|Batch Blob Count|Count|Average|Number of data sources in an aggregated batch for ingestion.|Database|
|BatchDuration|Yes|Batch Duration|Seconds|Average|The duration of the aggregation phase in the ingestion flow.|Database|
|BatchesProcessed|Yes|Batches Processed|Count|Total|Number of batches aggregated for ingestion. Batching Type: whether the batch reached batching time, data size or number of files limit set by batching policy|Database, SealReason|
|BatchSize|Yes|Batch Size|Bytes|Average|Uncompressed expected data size in an aggregated batch for ingestion.|Database|
|BlobsDropped|Yes|Blobs Dropped|Count|Total|Number of blobs permanently rejected by a component.|Database, ComponentType, ComponentName|
|BlobsProcessed|Yes|Blobs Processed|Count|Total|Number of blobs processed by a component.|Database, ComponentType, ComponentName|
|BlobsReceived|Yes|Blobs Received|Count|Total|Number of blobs received from input stream by a component.|Database, ComponentType, ComponentName|
|CacheUtilization|Yes|Cache utilization|Percent|Average|Utilization level in the cluster scope|No Dimensions|
|ContinuousExportMaxLatenessMinutes|Yes|Continuous Export Max Lateness|Count|Maximum|The lateness (in minutes) reported by the continuous export jobs in the cluster|No Dimensions|
|ContinuousExportNumOfRecordsExported|Yes|Continuous export – num of exported records|Count|Total|Number of records exported, fired for every storage artifact written during the export operation|ContinuousExportName, Database|
|ContinuousExportPendingCount|Yes|Continuous Export Pending Count|Count|Maximum|The number of pending continuous export jobs ready for execution|No Dimensions|
|ContinuousExportResult|Yes|Continuous Export Result|Count|Count|Indicates whether Continuous Export succeeded or failed|ContinuousExportName, Result, Database|
|CPU|Yes|CPU|Percent|Average|CPU utilization level|No Dimensions|
|DiscoveryLatency|Yes|Discovery Latency|Seconds|Average|Reported by data connections (if exist). Time in seconds from when a message is enqueued or event is created until it is discovered by data connection. This time is not included in the Azure Data Explorer total ingestion duration.|ComponentType, ComponentName|
|EventsDropped|Yes|Events Dropped|Count|Total|Number of events dropped permanently by data connection. An Ingestion result metric with a failure reason will be sent.|ComponentType, ComponentName|
|EventsProcessed|Yes|Events Processed|Count|Total|Number of events processed by the cluster|ComponentType, ComponentName|
|EventsProcessedForEventHubs|Yes|Events Processed (for Event/IoT Hubs)|Count|Total|Number of events processed by the cluster when ingesting from Event/IoT Hub|EventStatus|
|EventsReceived|Yes|Events Received|Count|Total|Number of events received by data connection.|ComponentType, ComponentName|
|ExportUtilization|Yes|Export Utilization|Percent|Maximum|Export utilization|No Dimensions|
|IngestionLatencyInSeconds|Yes|Ingestion Latency|Seconds|Average|Latency of data ingested, from the time the data was received in the cluster until it's ready for query. The ingestion latency period depends on the ingestion scenario.|No Dimensions|
|IngestionResult|Yes|Ingestion result|Count|Total|Number of ingestion operations|IngestionResultDetails|
|IngestionUtilization|Yes|Ingestion utilization|Percent|Average|Ratio of used ingestion slots in the cluster|No Dimensions|
|IngestionVolumeInMB|Yes|Ingestion Volume|Bytes|Total|Overall volume of ingested data to the cluster|Database|
|InstanceCount|Yes|Instance Count|Count|Average|Total instance count|No Dimensions|
|KeepAlive|Yes|Keep alive|Count|Average|Sanity check indicates the cluster responds to queries|No Dimensions|
|MaterializedViewAgeMinutes|Yes|Materialized View Age|Count|Average|The materialized view age in minutes|Database, MaterializedViewName|
|MaterializedViewDataLoss|Yes|Materialized View Data Loss|Count|Maximum|Indicates potential data loss in materialized view|Database, MaterializedViewName, Kind|
|MaterializedViewExtentsRebuild|Yes|Materialized View Extents Rebuild|Count|Average|Number of extents rebuild|Database, MaterializedViewName|
|MaterializedViewHealth|Yes|Materialized View Health|Count|Average|The health of the materialized view (1 for healthy, 0 for non-healthy)|Database, MaterializedViewName|
|MaterializedViewRecordsInDelta|Yes|Materialized View Records In Delta|Count|Average|The number of records in the non-materialized part of the view|Database, MaterializedViewName|
|MaterializedViewResult|Yes|Materialized View Result|Count|Average|The result of the materialization process|Database, MaterializedViewName, Result|
|QueryDuration|Yes|Query duration|Milliseconds|Average|Queries’ duration in seconds|QueryStatus|
|QueryResult|No|Query Result|Count|Count|Total number of queries.|QueryStatus|
|QueueLength|Yes|Queue Length|Count|Average|Number of pending messages in a component's queue.|ComponentType|
|QueueOldestMessage|Yes|Queue Oldest Message|Count|Average|Time in seconds from when the oldest message in queue was inserted.|ComponentType|
|ReceivedDataSizeBytes|Yes|Received Data Size Bytes|Bytes|Average|Size of data received by data connection. This is the size of the data stream, or of raw data size if provided.|ComponentType, ComponentName|
|StageLatency|Yes|Stage Latency|Seconds|Average|Cumulative time from when a message is discovered until it is received by the reporting component for processing (discovery time is set when message is enqueued for ingestion queue, or when discovered by data connection).|Database, ComponentType|
|SteamingIngestRequestRate|Yes|Streaming Ingest Request Rate|Count|RateRequestsPerSecond|Streaming ingest request rate (requests per second)|No Dimensions|
|StreamingIngestDataRate|Yes|Streaming Ingest Data Rate|Count|Average|Streaming ingest data rate (MB per second)|No Dimensions|
|StreamingIngestDuration|Yes|Streaming Ingest Duration|Milliseconds|Average|Streaming ingest duration in milliseconds|No Dimensions|
|StreamingIngestResults|Yes|Streaming Ingest Result|Count|Average|Streaming ingest result|Result|
|TotalNumberOfConcurrentQueries|Yes|Total number of concurrent queries|Count|Maximum|Total number of concurrent queries|No Dimensions|
|TotalNumberOfExtents|Yes|Total number of extents|Count|Total|Total number of data extents|No Dimensions|
|TotalNumberOfThrottledCommands|Yes|Total number of throttled commands|Count|Total|Total number of throttled commands|CommandType|
|TotalNumberOfThrottledQueries|Yes|Total number of throttled queries|Count|Maximum|Total number of throttled queries|No Dimensions|


## Microsoft.Logic/integrationServiceEnvironments

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActionLatency|Yes|Action Latency |Seconds|Average|Latency of completed workflow actions.|No Dimensions|
|ActionsCompleted|Yes|Actions Completed |Count|Total|Number of workflow actions completed.|No Dimensions|
|ActionsFailed|Yes|Actions Failed |Count|Total|Number of workflow actions failed.|No Dimensions|
|ActionsSkipped|Yes|Actions Skipped |Count|Total|Number of workflow actions skipped.|No Dimensions|
|ActionsStarted|Yes|Actions Started |Count|Total|Number of workflow actions started.|No Dimensions|
|ActionsSucceeded|Yes|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|No Dimensions|
|ActionSuccessLatency|Yes|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|No Dimensions|
|ActionThrottledEvents|Yes|Action Throttled Events|Count|Total|Number of workflow action throttled events..|No Dimensions|
|IntegrationServiceEnvironmentConnectorMemoryUsage|Yes|Connector Memory Usage for Integration Service Environment|Percent|Average|Connector memory usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentConnectorProcessorUsage|Yes|Connector Processor Usage for Integration Service Environment|Percent|Average|Connector processor usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentWorkflowMemoryUsage|Yes|Workflow Memory Usage for Integration Service Environment|Percent|Average|Workflow memory usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentWorkflowProcessorUsage|Yes|Workflow Processor Usage for Integration Service Environment|Percent|Average|Workflow processor usage for integration service environment.|No Dimensions|
|RunFailurePercentage|Yes|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|No Dimensions|
|RunLatency|Yes|Run Latency|Seconds|Average|Latency of completed workflow runs.|No Dimensions|
|RunsCancelled|Yes|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|No Dimensions|
|RunsCompleted|Yes|Runs Completed|Count|Total|Number of workflow runs completed.|No Dimensions|
|RunsFailed|Yes|Runs Failed|Count|Total|Number of workflow runs failed.|No Dimensions|
|RunsStarted|Yes|Runs Started|Count|Total|Number of workflow runs started.|No Dimensions|
|RunsSucceeded|Yes|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|No Dimensions|
|RunStartThrottledEvents|Yes|Run Start Throttled Events|Count|Total|Number of workflow run start throttled events.|No Dimensions|
|RunSuccessLatency|Yes|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|No Dimensions|
|RunThrottledEvents|Yes|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|No Dimensions|
|TriggerFireLatency|Yes|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|No Dimensions|
|TriggerLatency|Yes|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|No Dimensions|
|TriggersCompleted|Yes|Triggers Completed |Count|Total|Number of workflow triggers completed.|No Dimensions|
|TriggersFailed|Yes|Triggers Failed |Count|Total|Number of workflow triggers failed.|No Dimensions|
|TriggersFired|Yes|Triggers Fired |Count|Total|Number of workflow triggers fired.|No Dimensions|
|TriggersSkipped|Yes|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|No Dimensions|
|TriggersStarted|Yes|Triggers Started |Count|Total|Number of workflow triggers started.|No Dimensions|
|TriggersSucceeded|Yes|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|No Dimensions|
|TriggerSuccessLatency|Yes|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|No Dimensions|
|TriggerThrottledEvents|Yes|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|No Dimensions|


## Microsoft.Logic/workflows

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActionLatency|Yes|Action Latency |Seconds|Average|Latency of completed workflow actions.|No Dimensions|
|ActionsCompleted|Yes|Actions Completed |Count|Total|Number of workflow actions completed.|No Dimensions|
|ActionsFailed|Yes|Actions Failed |Count|Total|Number of workflow actions failed.|No Dimensions|
|ActionsSkipped|Yes|Actions Skipped |Count|Total|Number of workflow actions skipped.|No Dimensions|
|ActionsStarted|Yes|Actions Started |Count|Total|Number of workflow actions started.|No Dimensions|
|ActionsSucceeded|Yes|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|No Dimensions|
|ActionSuccessLatency|Yes|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|No Dimensions|
|ActionThrottledEvents|Yes|Action Throttled Events|Count|Total|Number of workflow action throttled events..|No Dimensions|
|BillableActionExecutions|Yes|Billable Action Executions|Count|Total|Number of workflow action executions getting billed.|No Dimensions|
|BillableTriggerExecutions|Yes|Billable Trigger Executions|Count|Total|Number of workflow trigger executions getting billed.|No Dimensions|
|BillingUsageNativeOperation|Yes|Billing Usage for Native Operation Executions|Count|Total|Number of native operation executions getting billed.|No Dimensions|
|BillingUsageStandardConnector|Yes|Billing Usage for Standard Connector Executions|Count|Total|Number of standard connector executions getting billed.|No Dimensions|
|BillingUsageStorageConsumption|Yes|Billing Usage for Storage Consumption Executions|Count|Total|Number of storage consumption executions getting billed.|No Dimensions|
|RunFailurePercentage|Yes|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|No Dimensions|
|RunLatency|Yes|Run Latency|Seconds|Average|Latency of completed workflow runs.|No Dimensions|
|RunsCancelled|Yes|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|No Dimensions|
|RunsCompleted|Yes|Runs Completed|Count|Total|Number of workflow runs completed.|No Dimensions|
|RunsFailed|Yes|Runs Failed|Count|Total|Number of workflow runs failed.|No Dimensions|
|RunsStarted|Yes|Runs Started|Count|Total|Number of workflow runs started.|No Dimensions|
|RunsSucceeded|Yes|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|No Dimensions|
|RunStartThrottledEvents|Yes|Run Start Throttled Events|Count|Total|Number of workflow run start throttled events.|No Dimensions|
|RunSuccessLatency|Yes|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|No Dimensions|
|RunThrottledEvents|Yes|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|No Dimensions|
|TotalBillableExecutions|Yes|Total Billable Executions|Count|Total|Number of workflow executions getting billed.|No Dimensions|
|TriggerFireLatency|Yes|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|No Dimensions|
|TriggerLatency|Yes|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|No Dimensions|
|TriggersCompleted|Yes|Triggers Completed |Count|Total|Number of workflow triggers completed.|No Dimensions|
|TriggersFailed|Yes|Triggers Failed |Count|Total|Number of workflow triggers failed.|No Dimensions|
|TriggersFired|Yes|Triggers Fired |Count|Total|Number of workflow triggers fired.|No Dimensions|
|TriggersSkipped|Yes|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|No Dimensions|
|TriggersStarted|Yes|Triggers Started |Count|Total|Number of workflow triggers started.|No Dimensions|
|TriggersSucceeded|Yes|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|No Dimensions|
|TriggerSuccessLatency|Yes|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|No Dimensions|
|TriggerThrottledEvents|Yes|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|No Dimensions|


## Microsoft.MachineLearningServices/workspaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Active Cores|Yes|Active Cores|Count|Average|Number of active cores|Scenario, ClusterName|
|Active Nodes|Yes|Active Nodes|Count|Average|Number of Acitve nodes. These are the nodes which are actively running a job.|Scenario, ClusterName|
|Cancel Requested Runs|Yes|Cancel Requested Runs|Count|Total|Number of runs where cancel was requested for this workspace. Count is updated when cancellation request has been received for a run.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Cancelled Runs|Yes|Cancelled Runs|Count|Total|Number of runs cancelled for this workspace. Count is updated when a run is successfully cancelled.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Completed Runs|Yes|Completed Runs|Count|Total|Number of runs completed successfully for this workspace. Count is updated when a run has completed and output has been collected.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|CpuUtilization|Yes|CpuUtilization|Count|Average|Percentage of utilization on a CPU node. Utilization is reported at one minute intervals.|Scenario, runId, NodeId, ClusterName|
|Errors|Yes|Errors|Count|Total|Number of run errors in this workspace. Count is updated whenever run encounters an error.|Scenario|
|Failed Runs|Yes|Failed Runs|Count|Total|Number of runs failed for this workspace. Count is updated when a run fails.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Finalizing Runs|Yes|Finalizing Runs|Count|Total|Number of runs entered finalizing state for this workspace. Count is updated when a run has completed but output collection still in progress.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|GpuMemoryUtilization|Yes|GpuMemoryUtilization|Count|Average|Percentage of memory utilization on a GPU node. Utilization is reported at one minute intervals.|Scenario, runId, NodeId, DeviceId, ClusterName|
|GpuUtilization|Yes|GpuUtilization|Count|Average|Percentage of utilization on a GPU node. Utilization is reported at one minute intervals.|Scenario, runId, NodeId, DeviceId, ClusterName|
|Idle Cores|Yes|Idle Cores|Count|Average|Number of idle cores|Scenario, ClusterName|
|Idle Nodes|Yes|Idle Nodes|Count|Average|Number of idle nodes. Idle nodes are the nodes which are not running any jobs but can accept new job if available.|Scenario, ClusterName|
|Leaving Cores|Yes|Leaving Cores|Count|Average|Number of leaving cores|Scenario, ClusterName|
|Leaving Nodes|Yes|Leaving Nodes|Count|Average|Number of leaving nodes. Leaving nodes are the nodes which just finished processing a job and will go to Idle state.|Scenario, ClusterName|
|Model Deploy Failed|Yes|Model Deploy Failed|Count|Total|Number of model deployments that failed in this workspace|Scenario, StatusCode|
|Model Deploy Started|Yes|Model Deploy Started|Count|Total|Number of model deployments started in this workspace|Scenario|
|Model Deploy Succeeded|Yes|Model Deploy Succeeded|Count|Total|Number of model deployments that succeeded in this workspace|Scenario|
|Model Register Failed|Yes|Model Register Failed|Count|Total|Number of model registrations that failed in this workspace|Scenario, StatusCode|
|Model Register Succeeded|Yes|Model Register Succeeded|Count|Total|Number of model registrations that succeeded in this workspace|Scenario|
|Not Responding Runs|Yes|Not Responding Runs|Count|Total|Number of runs not responding for this workspace. Count is updated when a run enters Not Responding state.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Not Started Runs|Yes|Not Started Runs|Count|Total|Number of runs in Not Started state for this workspace. Count is updated when a request is received to create a run but run information has not yet been populated. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Preempted Cores|Yes|Preempted Cores|Count|Average|Number of preempted cores|Scenario, ClusterName|
|Preempted Nodes|Yes|Preempted Nodes|Count|Average|Number of preempted nodes. These nodes are the low priority nodes which are taken away from the available node pool.|Scenario, ClusterName|
|Preparing Runs|Yes|Preparing Runs|Count|Total|Number of runs that are preparing for this workspace. Count is updated when a run enters Preparing state while the run environment is being prepared.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Provisioning Runs|Yes|Provisioning Runs|Count|Total|Number of runs that are provisioning for this workspace. Count is updated when a run is waiting on compute target creation or provisioning.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Queued Runs|Yes|Queued Runs|Count|Total|Number of runs that are queued for this workspace. Count is updated when a run is queued in compute target. Can occure when waiting for required compute nodes to be ready.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Quota Utilization Percentage|Yes|Quota Utilization Percentage|Count|Average|Percent of quota utilized|Scenario, ClusterName, VmFamilyName, VmPriority|
|Started Runs|Yes|Started Runs|Count|Total|Number of runs running for this workspace. Count is updated when run starts running on required resources.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Starting Runs|Yes|Starting Runs|Count|Total|Number of runs started for this workspace. Count is updated after request to create run and run info, such as the Run Id, has been populated|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType, ExperimentName|
|Total Cores|Yes|Total Cores|Count|Average|Number of total cores|Scenario, ClusterName|
|Total Nodes|Yes|Total Nodes|Count|Average|Number of total nodes. This total includes some of Active Nodes, Idle Nodes, Unusable Nodes, Premepted Nodes, Leaving Nodes|Scenario, ClusterName|
|Unusable Cores|Yes|Unusable Cores|Count|Average|Number of unusable cores|Scenario, ClusterName|
|Unusable Nodes|Yes|Unusable Nodes|Count|Average|Number of unusable nodes. Unusable nodes are not functional due to some unresolvable issue. Azure will recycle these nodes.|Scenario, ClusterName|
|Warnings|Yes|Warnings|Count|Total|Number of run warnings in this workspace. Count is updated whenever a run encounters a warning.|Scenario|


## Microsoft.Maps/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|Availability of the APIs|ApiCategory, ApiName|
|Usage|No|Usage|Count|Count|Count of API calls|ApiCategory, ApiName, ResultType, ResponseCode|


## Microsoft.Media/mediaservices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AssetCount|Yes|Asset count|Count|Average|How many assets are already created in current media service account|No Dimensions|
|AssetQuota|Yes|Asset quota|Count|Average|How many assets are allowed for current media service account|No Dimensions|
|AssetQuotaUsedPercentage|Yes|Asset quota used percentage|Percent|Average|Asset used percentage in current media service account|No Dimensions|
|ChannelsAndLiveEventsCount|Yes|Live event count|Count|Average|The total number of live events in the current media services account|No Dimensions|
|ContentKeyPolicyCount|Yes|Content Key Policy count|Count|Average|How many content key policies are already created in current media service account|No Dimensions|
|ContentKeyPolicyQuota|Yes|Content Key Policy quota|Count|Average|How many content key polices are allowed for current media service account|No Dimensions|
|ContentKeyPolicyQuotaUsedPercentage|Yes|Content Key Policy quota used percentage|Percent|Average|Content Key Policy used percentage in current media service account|No Dimensions|
|MaxChannelsAndLiveEventsCount|Yes|Max live event quota|Count|Maximum|The maximum number of live events allowed in the current media services account|No Dimensions|
|MaxRunningChannelsAndLiveEventsCount|Yes|Max running live event quota|Count|Maximum|The maximum number of running live events allowed in the current media services account|No Dimensions|
|RunningChannelsAndLiveEventsCount|Yes|Running live event count|Count|Average|The total number of running live events in the current media services account|No Dimensions|
|StreamingPolicyCount|Yes|Streaming Policy count|Count|Average|How many streaming policies are already created in current media service account|No Dimensions|
|StreamingPolicyQuota|Yes|Streaming Policy quota|Count|Average|How many streaming policies are allowed for current media service account|No Dimensions|
|StreamingPolicyQuotaUsedPercentage|Yes|Streaming Policy quota used percentage|Percent|Average|Streaming Policy used percentage in current media service account|No Dimensions|


## Microsoft.Media/mediaservices/liveEvents

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngestBitrate|Yes|Live Event ingest bitrate|BitsPerSecond|Average|The incoming bitrate ingested for a live event, in bits per second.|TrackName|
|IngestDriftValue|Yes|Live Event ingest drift value|Seconds|Maximum|Drift between the timestamp of the ingested content and the system clock, measured in seconds per minute. A non zero value indicates that the ingested content is arriving slower than system clock time.|TrackName|
|IngestLastTimestamp|Yes|Live Event ingest last timestamp|Milliseconds|Maximum|Last timestamp ingested for a live event.|TrackName|
|LiveOutputLastTimestamp|Yes|Last output timestamp|Milliseconds|Maximum|Timestamp of the last fragment uploaded to storage for a live event output.|TrackName|


## Microsoft.Media/mediaservices/streamingEndpoints

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU|Yes|CPU usage|Percent|Average|CPU usage for premium streaming endpoints. This data is not available for standard streaming endpoints.|No Dimensions|
|Egress|Yes|Egress|Bytes|Total|The amount of Egress data, in bytes.|OutputFormat|
|EgressBandwidth|No|Egress bandwidth|BitsPerSecond|Average|Egress bandwidth in bits per second.|No Dimensions|
|Requests|Yes|Requests|Count|Total|Requests to a Streaming Endpoint.|OutputFormat, HttpStatusCode, ErrorCode|
|SuccessE2ELatency|Yes|Success end to end Latency|Milliseconds|Average|The average latency for successful requests in milliseconds.|OutputFormat|


## Microsoft.MixedReality/remoteRenderingAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveRenderingSessions|Yes|Active Rendering Sessions|Count|Average|Total number of active rendering sessions|SessionType, SDKVersion|
|AssetsConverted|Yes|Assets Converted|Count|Total|Total number of assets converted|SDKVersion|


## Microsoft.MixedReality/spatialAnchorsAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AnchorsCreated|Yes|Anchors Created|Count|Total|Number of Anchors created|DeviceFamily, SDKVersion|
|AnchorsDeleted|Yes|Anchors Deleted|Count|Total|Number of Anchors deleted|DeviceFamily, SDKVersion|
|AnchorsQueried|Yes|Anchors Queried|Count|Total|Number of Spatial Anchors queried|DeviceFamily, SDKVersion|
|AnchorsUpdated|Yes|Anchors Updated|Count|Total|Number of Anchors updated|DeviceFamily, SDKVersion|
|PosesFound|Yes|Poses Found|Count|Total|Number of Poses returned|DeviceFamily, SDKVersion|
|TotalDailyAnchors|Yes|Total Daily Anchors|Count|Average|Total number of Anchors - Daily|DeviceFamily, SDKVersion|


## Microsoft.NetApp/netAppAccounts/capacityPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|VolumePoolAllocatedSize|Yes|Pool Allocated Size|Bytes|Average|Provisioned size of this pool|No Dimensions|
|VolumePoolAllocatedToVolumeThroughput|Yes|Pool allocated throughput|BytesPerSecond|Average|Sum of the throughput of all the volumes belonging to the pool|No Dimensions|
|VolumePoolAllocatedUsed|Yes|Pool Allocated To Volume Size|Bytes|Average|Allocated used size of the pool|No Dimensions|
|VolumePoolProvisionedThroughput|Yes|Provisioned throughput for the pool|BytesPerSecond|Average|Provisioned throughput of this pool|No Dimensions|
|VolumePoolTotalLogicalSize|Yes|Pool Consumed Size|Bytes|Average|Sum of the logical size of all the volumes belonging to the pool|No Dimensions|
|VolumePoolTotalSnapshotSize|Yes|Total Snapshot size for the pool|Bytes|Average|Sum of snapshot size of all volumes in this pool|No Dimensions|


## Microsoft.NetApp/netAppAccounts/capacityPools/volumes

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageReadLatency|Yes|Average read latency|MilliSeconds|Average|Average read latency in milliseconds per operation|No Dimensions|
|AverageWriteLatency|Yes|Average write latency|MilliSeconds|Average|Average write latency in milliseconds per operation|No Dimensions|
|CbsVolumeBackupActive|Yes|Is Volume Backup suspended|Count|Average|Is the backup policy suspended for the volume? 0 if yes, 1 if no.|No Dimensions|
|CbsVolumeLogicalBackupBytes|Yes|Volume Backup Bytes|Bytes|Average|Total bytes backed up for this Volume.|No Dimensions|
|CbsVolumeOperationComplete|Yes|Is Volume Backup Operation Complete|Count|Average|Did the last volume backup or restore operation complete successfully? 1 if yes, 0 if no.|No Dimensions|
|CbsVolumeOperationTransferredBytes|Yes|Volume Backup Last Transferred Bytes|Bytes|Average|Total bytes transferred for last backup or restore operation.|No Dimensions|
|CbsVolumeProtected|Yes|Is Volume Backup Enabled|Count|Average|Is backup enabled for the volume? 1 if yes, 0 if no.|No Dimensions|
|OtherThroughput|Yes|Other throughput|BytesPerSecond|Average|Other throughput (that is not read or write) in bytes per second|No Dimensions|
|ReadIops|Yes|Read iops|CountPerSecond|Average|Read In/out operations per second|No Dimensions|
|ReadThroughput|Yes|Read throughput|BytesPerSecond|Average|Read throughput in bytes per second|No Dimensions|
|TotalThroughput|Yes|Total throughput|BytesPerSecond|Average|Sum of all throughput in bytes per second|No Dimensions|
|VolumeAllocatedSize|Yes|Volume allocated size|Bytes|Average|The provisioned size of a volume|No Dimensions|
|VolumeConsumedSizePercentage|Yes|Percentage Volume Consumed Size|Percent|Average|The percentage of the volume consumed including snapshots.|No Dimensions|
|VolumeLogicalSize|Yes|Volume Consumed Size|Bytes|Average|Logical size of the volume (used bytes)|No Dimensions|
|VolumeSnapshotSize|Yes|Volume snapshot size|Bytes|Average|Size of all snapshots in volume|No Dimensions|
|WriteIops|Yes|Write iops|CountPerSecond|Average|Write In/out operations per second|No Dimensions|
|WriteThroughput|Yes|Write throughput|BytesPerSecond|Average|Write throughput in bytes per second|No Dimensions|
|XregionReplicationHealthy|Yes|Is volume replication status healthy|Count|Average|Condition of the relationship, 1 or 0.|No Dimensions|
|XregionReplicationLagTime|Yes|Volume replication lag time|Seconds|Average|The amount of time in seconds by which the data on the mirror lags behind the source.|No Dimensions|
|XregionReplicationLastTransferDuration|Yes|Volume replication last transfer duration|Seconds|Average|The amount of time in seconds it took for the last transfer to complete.|No Dimensions|
|XregionReplicationLastTransferSize|Yes|Volume replication last transfer size|Bytes|Average|The total number of bytes transferred as part of the last transfer.|No Dimensions|
|XregionReplicationRelationshipProgress|Yes|Volume replication progress|Bytes|Average|Total amount of data transferred for the current transfer operation.|No Dimensions|
|XregionReplicationRelationshipTransferring|Yes|Is volume replication transferring|Count|Average|Whether the status of the Volume Replication is 'transferring'.|No Dimensions|
|XregionReplicationTotalTransferBytes|Yes|Volume replication total transfer|Bytes|Average|Cumulative bytes transferred for the relationship.|No Dimensions|


## Microsoft.Network/applicationGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApplicationGatewayTotalTime|No|Application Gateway Total Time|MilliSeconds|Average|Average time that it takes for a request to be processed and its response to be sent. This is calculated as average of the interval from the time when Application Gateway receives the first byte of an HTTP request to the time when the response send operation finishes. It's important to note that this usually includes the Application Gateway processing time, time that the request and response packets are traveling over the network and the time the backend server took to respond.|Listener|
|AvgRequestCountPerHealthyHost|No|Requests per minute per Healthy Host|Count|Average|Average request count per minute per healthy backend host in a pool|BackendSettingsPool|
|BackendConnectTime|No|Backend Connect Time|MilliSeconds|Average|Time spent establishing a connection with a backend server|Listener, BackendServer, BackendPool, BackendHttpSetting|
|BackendFirstByteResponseTime|No|Backend First Byte Response Time|MilliSeconds|Average|Time interval between start of establishing a connection to backend server and receiving the first byte of the response header, approximating processing time of backend server|Listener, BackendServer, BackendPool, BackendHttpSetting|
|BackendLastByteResponseTime|No|Backend Last Byte Response Time|MilliSeconds|Average|Time interval between start of establishing a connection to backend server and receiving the last byte of the response body|Listener, BackendServer, BackendPool, BackendHttpSetting|
|BackendResponseStatus|Yes|Backend Response Status|Count|Total|The number of HTTP response codes generated by the backend members. This does not include any response codes generated by the Application Gateway.|BackendServer, BackendPool, BackendHttpSetting, HttpStatusGroup|
|BlockedCount|Yes|Web Application Firewall Blocked Requests Rule Distribution|Count|Total|Web Application Firewall blocked requests rule distribution|RuleGroup, RuleId|
|BlockedReqCount|Yes|Web Application Firewall Blocked Requests Count|Count|Total|Web Application Firewall blocked requests count|No Dimensions|
|BytesReceived|Yes|Bytes Received|Bytes|Total|The total number of bytes received by the Application Gateway from the clients|Listener|
|BytesSent|Yes|Bytes Sent|Bytes|Total|The total number of bytes sent by the Application Gateway to the clients|Listener|
|CapacityUnits|No|Current Capacity Units|Count|Average|Capacity Units consumed|No Dimensions|
|ClientRtt|No|Client RTT|MilliSeconds|Average|Average round trip time between clients and Application Gateway. This metric indicates how long it takes to establish connections and return acknowledgements|Listener|
|ComputeUnits|No|Current Compute Units|Count|Average|Compute Units consumed|No Dimensions|
|CpuUtilization|No|CPU Utilization|Percent|Average|Current CPU utilization of the Application Gateway|No Dimensions|
|CurrentConnections|Yes|Current Connections|Count|Total|Count of current connections established with Application Gateway|No Dimensions|
|EstimatedBilledCapacityUnits|No|Estimated Billed Capacity Units|Count|Average|Estimated capacity units that will be charged|No Dimensions|
|FailedRequests|Yes|Failed Requests|Count|Total|Count of failed requests that Application Gateway has served|BackendSettingsPool|
|FixedBillableCapacityUnits|No|Fixed Billable Capacity Units|Count|Average|Minimum capacity units that will be charged|No Dimensions|
|HealthyHostCount|Yes|Healthy Host Count|Count|Average|Number of healthy backend hosts|BackendSettingsPool|
|MatchedCount|Yes|Web Application Firewall Total Rule Distribution|Count|Total|Web Application Firewall Total Rule Distribution for the incoming traffic|RuleGroup, RuleId|
|NewConnectionsPerSecond|No|New connections per second|CountPerSecond|Average|New connections per second established with Application Gateway|No Dimensions|
|ResponseStatus|Yes|Response Status|Count|Total|Http response status returned by Application Gateway|HttpStatusGroup|
|Throughput|No|Throughput|BytesPerSecond|Average|Number of bytes per second the Application Gateway has served|No Dimensions|
|TlsProtocol|Yes|Client TLS Protocol|Count|Total|The number of TLS and non-TLS requests initiated by the client that established connection with the Application Gateway. To view TLS protocol distribution, filter by the dimension TLS Protocol.|Listener, TlsProtocol|
|TotalRequests|Yes|Total Requests|Count|Total|Count of successful requests that Application Gateway has served|BackendSettingsPool|
|UnhealthyHostCount|Yes|Unhealthy Host Count|Count|Average|Number of unhealthy backend hosts|BackendSettingsPool|


## Microsoft.Network/azurefirewalls

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ApplicationRuleHit|Yes|Application rules hit count|Count|Total|Number of times Application rules were hit|Status, Reason, Protocol|
|DataProcessed|Yes|Data processed|Bytes|Total|Total amount of data processed by this firewall|No Dimensions|
|FirewallHealth|Yes|Firewall health state|Percent|Average|Indicates the overall health of this firewall|Status, Reason|
|NetworkRuleHit|Yes|Network rules hit count|Count|Total|Number of times Network rules were hit|Status, Reason, Protocol|
|SNATPortUtilization|Yes|SNAT port utilization|Percent|Average|Percentage of outbound SNAT ports currently in use|Protocol|
|Throughput|No|Throughput|BitsPerSecond|Average|Throughput processed by this firewall|No Dimensions|


## microsoft.network/bastionHosts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|pingmesh|No|Bastion Communication Status|Count|Average|Communication status shows 1 if all communication is good and 0 if its bad.||
|sessions|No|Session Count|Count|Total|Sessions Count for the Bastion. View in sum and per instance.|host|
|total|Yes|Total Memory|Count|Average|Total memory stats.|host|
|usage_user|No|Used CPU|Count|Average|CPU Usage stats.|cpu, host|
|used|Yes|Used Memory|Count|Average|Memory Usage stats.|host|


## Microsoft.Network/connections

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond|Yes|BitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|Yes|BitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|No Dimensions|


## Microsoft.Network/dnszones

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|QueryVolume|No|Query Volume|Count|Total|Number of queries served for a DNS zone|No Dimensions|
|RecordSetCapacityUtilization|No|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a DNS zone|No Dimensions|
|RecordSetCount|No|Record Set Count|Count|Maximum|Number of Record Sets in a DNS zone|No Dimensions|


## Microsoft.Network/expressRouteCircuits

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ArpAvailability|Yes|Arp Availability|Percent|Average|ARP Availability from MSEE towards all peers.|PeeringType, Peer|
|BgpAvailability|Yes|Bgp Availability|Percent|Average|BGP Availability from MSEE towards all peers.|PeeringType, Peer|
|BitsInPerSecond|No|BitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|PeeringType, DeviceRole|
|BitsOutPerSecond|No|BitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|PeeringType, DeviceRole|
|GlobalReachBitsInPerSecond|No|GlobalReachBitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|PeeredCircuitSKey|
|GlobalReachBitsOutPerSecond|No|GlobalReachBitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|PeeredCircuitSKey|
|QosDropBitsInPerSecond|Yes|DroppedInBitsPerSecond|BitsPerSecond|Average|Ingress bits of data dropped per second|No Dimensions|
|QosDropBitsOutPerSecond|Yes|DroppedOutBitsPerSecond|BitsPerSecond|Average|Egress bits of data dropped per second|No Dimensions|


## Microsoft.Network/expressRouteCircuits/peerings

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond|Yes|BitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|Yes|BitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|No Dimensions|


## Microsoft.Network/expressRouteGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ErGatewayConnectionBitsInPerSecond|No|BitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|ConnectionName|
|ErGatewayConnectionBitsOutPerSecond|No|BitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|ConnectionName|
|ExpressRouteGatewayCountOfRoutesAdvertisedToPeer|Yes|Count Of Routes Advertised to Peer(Preview)|Count|Maximum|Count Of Routes Advertised To Peer by ExpressRouteGateway|roleInstance|
|ExpressRouteGatewayCountOfRoutesLearnedFromPeer|Yes|Count Of Routes Learned from Peer (Preview)|Count|Maximum|Count Of Routes Learned From Peer by ExpressRouteGateway|roleInstance|
|ExpressRouteGatewayCpuUtilization|Yes|CPU utilization|Count|Average|CPU Utilization of the ExpressRoute Gateway|roleInstance|
|ExpressRouteGatewayFrequencyOfRoutesChanged|No|Frequency of Routes change (Preview)|Count|Total|Frequency of Routes change in ExpressRoute Gateway|roleInstance|
|ExpressRouteGatewayNumberOfVmInVnet|No|Number of VMs in the Virtual Network(Preview)|Count|Maximum|Number of VMs in the Virtual Network|No Dimensions|
|ExpressRouteGatewayPacketsPerSecond|No|Packets per second|CountPerSecond|Average|Packet count of ExpressRoute Gateway|roleInstance|


## Microsoft.Network/expressRoutePorts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdminState|Yes|AdminState|Count|Average|Admin state of the port|Link|
|LineProtocol|Yes|LineProtocol|Count|Average|Line protocol status of the port|Link|
|PortBitsInPerSecond|Yes|BitsInPerSecond|BitsPerSecond|Average|Bits ingressing Azure per second|Link|
|PortBitsOutPerSecond|Yes|BitsOutPerSecond|BitsPerSecond|Average|Bits egressing Azure per second|Link|
|RxLightLevel|Yes|RxLightLevel|Count|Average|Rx Light level in dBm|Link, Lane|
|TxLightLevel|Yes|TxLightLevel|Count|Average|Tx light level in dBm|Link, Lane|


## Microsoft.Network/frontdoors

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BackendHealthPercentage|Yes|Backend Health Percentage|Percent|Average|The percentage of successful health probes from the HTTP/S proxy to backends|Backend, BackendPool|
|BackendRequestCount|Yes|Backend Request Count|Count|Total|The number of requests sent from the HTTP/S proxy to backends|HttpStatus, HttpStatusGroup, Backend|
|BackendRequestLatency|Yes|Backend Request Latency|MilliSeconds|Average|The time calculated from when the request was sent by the HTTP/S proxy to the backend until the HTTP/S proxy received the last response byte from the backend|Backend|
|BillableResponseSize|Yes|Billable Response Size|Bytes|Total|The number of billable bytes (minimum 2KB per request) sent as responses from HTTP/S proxy to clients.|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|RequestCount|Yes|Request Count|Count|Total|The number of client requests served by the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|RequestSize|Yes|Request Size|Bytes|Total|The number of bytes sent as requests from clients to the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|ResponseSize|Yes|Response Size|Bytes|Total|The number of bytes sent as responses from HTTP/S proxy to clients|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|TotalLatency|Yes|Total Latency|MilliSeconds|Average|The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|WebApplicationFirewallRequestCount|Yes|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName, RuleName, Action|


## Microsoft.Network/loadBalancers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AllocatedSnatPorts|No|Allocated SNAT Ports|Count|Average|Total number of SNAT ports allocated within time period|FrontendIPAddress, BackendIPAddress, ProtocolType, |
|ByteCount|Yes|Byte Count|Bytes|Total|Total number of Bytes transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|DipAvailability|Yes|Health Probe Status|Count|Average|Average Load Balancer health probe status per time duration|ProtocolType, BackendPort, FrontendIPAddress, FrontendPort, BackendIPAddress|
|PacketCount|Yes|Packet Count|Count|Total|Total number of Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|SnatConnectionCount|Yes|SNAT Connection Count|Count|Total|Total number of new SNAT connections created within time period|FrontendIPAddress, BackendIPAddress, ConnectionState|
|SYNCount|Yes|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|UsedSnatPorts|No|Used SNAT Ports|Count|Average|Total number of SNAT ports used within time period|FrontendIPAddress, BackendIPAddress, ProtocolType, |
|VipAvailability|Yes|Data Path Availability|Count|Average|Average Load Balancer data path availability per time duration|FrontendIPAddress, FrontendPort|


## Microsoft.Network/natGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteCount|Yes|Bytes|Bytes|Total|Total number of Bytes transmitted within time period|Protocol, Direction|
|DatapathAvailability|Yes|Datapath Availability (Preview)|Count|Average|NAT Gateway Datapath Availability|No Dimensions|
|PacketCount|Yes|Packets|Count|Total|Total number of Packets transmitted within time period|Protocol, Direction|
|PacketDropCount|Yes|Dropped Packets|Count|Total|Count of dropped packets|No Dimensions|
|SNATConnectionCount|Yes|SNAT Connection Count|Count|Total|Total concurrent active connections|Protocol, ConnectionState|
|TotalConnectionCount|Yes|Total SNAT Connection Count|Count|Total|Total number of active SNAT connections|Protocol|


## Microsoft.Network/networkInterfaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesReceivedRate|Yes|Bytes Received|Bytes|Total|Number of bytes the Network Interface received|No Dimensions|
|BytesSentRate|Yes|Bytes Sent|Bytes|Total|Number of bytes the Network Interface sent|No Dimensions|
|PacketsReceivedRate|Yes|Packets Received|Count|Total|Number of packets the Network Interface received|No Dimensions|
|PacketsSentRate|Yes|Packets Sent|Count|Total|Number of packets the Network Interface sent|No Dimensions|


## Microsoft.Network/networkWatchers/connectionMonitors

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageRoundtripMs|Yes|Avg. Round-trip Time (ms) (classic)|MilliSeconds|Average|Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination|No Dimensions|
|ChecksFailedPercent|Yes|Checks Failed Percent|Percent|Average|% of connectivity monitoring checks failed|SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet|
|ProbesFailedPercent|Yes|% Probes Failed (classic)|Percent|Average|% of connectivity monitoring probes failed|No Dimensions|
|RoundTripTimeMs|Yes|Round-Trip Time (ms)|MilliSeconds|Average|Round-trip time in milliseconds for the connectivity monitoring checks|SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet|
|TestResult|Yes|Test Result|Count|Average|Connection monitor test result|SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName, TestResultCriterion, SourceIP, DestinationIP, SourceSubnet, DestinationSubnet|


## Microsoft.Network/p2sVpnGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|P2SBandwidth|Yes|Gateway P2S Bandwidth|BytesPerSecond|Average|Average point-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|P2SConnectionCount|Yes|P2S Connection Count|Count|Total|Point-to-site connection count of a gateway|Protocol|


## Microsoft.Network/privateDnsZones

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|QueryVolume|Yes|Query Volume|Count|Total|Number of queries served for a Private DNS zone|No Dimensions|
|RecordSetCapacityUtilization|No|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a Private DNS zone|No Dimensions|
|RecordSetCount|Yes|Record Set Count|Count|Maximum|Number of Record Sets in a Private DNS zone|No Dimensions|
|VirtualNetworkLinkCapacityUtilization|No|Virtual Network Link Capacity Utilization|Percent|Maximum|Percent of Virtual Network Link capacity utilized by a Private DNS zone|No Dimensions|
|VirtualNetworkLinkCount|Yes|Virtual Network Link Count|Count|Maximum|Number of Virtual Networks linked to a Private DNS zone|No Dimensions|
|VirtualNetworkWithRegistrationCapacityUtilization|No|Virtual Network Registration Link Capacity Utilization|Percent|Maximum|Percent of Virtual Network Link with auto-registration capacity utilized by a Private DNS zone|No Dimensions|
|VirtualNetworkWithRegistrationLinkCount|Yes|Virtual Network Registration Link Count|Count|Maximum|Number of Virtual Networks linked to a Private DNS zone with auto-registration enabled|No Dimensions|


## Microsoft.Network/privateEndpoints

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PEBytesIn|Yes|Bytes In|Count|Total|Total number of Bytes Out|PrivateEndpointId|
|PEBytesOut|Yes|Bytes Out|Count|Total|Total number of Bytes Out|PrivateEndpointId|


## Microsoft.Network/privateLinkServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PLSBytesIn|Yes|Bytes In|Count|Total|Total number of Bytes Out|PrivateLinkServiceId|
|PLSBytesOut|Yes|Bytes Out|Count|Total|Total number of Bytes Out|PrivateLinkServiceId|
|PLSNatPortsUsage|Yes|Nat Ports Usage|Percent|Average|Nat Ports Usage|PrivateLinkServiceId, PrivateLinkServiceIPAddress|


## Microsoft.Network/publicIPAddresses

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteCount|Yes|Byte Count|Bytes|Total|Total number of Bytes transmitted within time period|Port, Direction|
|BytesDroppedDDoS|Yes|Inbound bytes dropped DDoS|BytesPerSecond|Maximum|Inbound bytes dropped DDoS|No Dimensions|
|BytesForwardedDDoS|Yes|Inbound bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound bytes forwarded DDoS|No Dimensions|
|BytesInDDoS|Yes|Inbound bytes DDoS|BytesPerSecond|Maximum|Inbound bytes DDoS|No Dimensions|
|DDoSTriggerSYNPackets|Yes|Inbound SYN packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound SYN packets to trigger DDoS mitigation|No Dimensions|
|DDoSTriggerTCPPackets|Yes|Inbound TCP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound TCP packets to trigger DDoS mitigation|No Dimensions|
|DDoSTriggerUDPPackets|Yes|Inbound UDP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound UDP packets to trigger DDoS mitigation|No Dimensions|
|IfUnderDDoSAttack|Yes|Under DDoS attack or not|Count|Maximum|Under DDoS attack or not|No Dimensions|
|PacketCount|Yes|Packet Count|Count|Total|Total number of Packets transmitted within time period|Port, Direction|
|PacketsDroppedDDoS|Yes|Inbound packets dropped DDoS|CountPerSecond|Maximum|Inbound packets dropped DDoS|No Dimensions|
|PacketsForwardedDDoS|Yes|Inbound packets forwarded DDoS|CountPerSecond|Maximum|Inbound packets forwarded DDoS|No Dimensions|
|PacketsInDDoS|Yes|Inbound packets DDoS|CountPerSecond|Maximum|Inbound packets DDoS|No Dimensions|
|SynCount|Yes|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|Port, Direction|
|TCPBytesDroppedDDoS|Yes|Inbound TCP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound TCP bytes dropped DDoS|No Dimensions|
|TCPBytesForwardedDDoS|Yes|Inbound TCP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound TCP bytes forwarded DDoS|No Dimensions|
|TCPBytesInDDoS|Yes|Inbound TCP bytes DDoS|BytesPerSecond|Maximum|Inbound TCP bytes DDoS|No Dimensions|
|TCPPacketsDroppedDDoS|Yes|Inbound TCP packets dropped DDoS|CountPerSecond|Maximum|Inbound TCP packets dropped DDoS|No Dimensions|
|TCPPacketsForwardedDDoS|Yes|Inbound TCP packets forwarded DDoS|CountPerSecond|Maximum|Inbound TCP packets forwarded DDoS|No Dimensions|
|TCPPacketsInDDoS|Yes|Inbound TCP packets DDoS|CountPerSecond|Maximum|Inbound TCP packets DDoS|No Dimensions|
|UDPBytesDroppedDDoS|Yes|Inbound UDP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound UDP bytes dropped DDoS|No Dimensions|
|UDPBytesForwardedDDoS|Yes|Inbound UDP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound UDP bytes forwarded DDoS|No Dimensions|
|UDPBytesInDDoS|Yes|Inbound UDP bytes DDoS|BytesPerSecond|Maximum|Inbound UDP bytes DDoS|No Dimensions|
|UDPPacketsDroppedDDoS|Yes|Inbound UDP packets dropped DDoS|CountPerSecond|Maximum|Inbound UDP packets dropped DDoS|No Dimensions|
|UDPPacketsForwardedDDoS|Yes|Inbound UDP packets forwarded DDoS|CountPerSecond|Maximum|Inbound UDP packets forwarded DDoS|No Dimensions|
|UDPPacketsInDDoS|Yes|Inbound UDP packets DDoS|CountPerSecond|Maximum|Inbound UDP packets DDoS|No Dimensions|
|VipAvailability|Yes|Data Path Availability|Count|Average|Average IP Address availability per time duration|Port|


## Microsoft.Network/trafficManagerProfiles

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ProbeAgentCurrentEndpointStateByProfileResourceId|Yes|Endpoint Status by Endpoint|Count|Maximum|1 if an endpoint's probe status is "Enabled", 0 otherwise.|EndpointName|
|QpsByEndpoint|Yes|Queries by Endpoint Returned|Count|Total|Number of times a Traffic Manager endpoint was returned in the given time frame|EndpointName|


## Microsoft.Network/virtualNetworkGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageBandwidth|Yes|Gateway S2S Bandwidth|BytesPerSecond|Average|Average site-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|ExpressRouteGatewayCountOfRoutesAdvertisedToPeer|Yes|Count Of Routes Advertised to Peer(Preview)|Count|Maximum|Count Of Routes Advertised To Peer by ExpressRouteGateway|roleInstance|
|ExpressRouteGatewayCountOfRoutesLearnedFromPeer|Yes|Count Of Routes Learned from Peer (Preview)|Count|Maximum|Count Of Routes Learned From Peer by ExpressRouteGateway|roleInstance|
|ExpressRouteGatewayCpuUtilization|Yes|CPU utilization|Count|Average|CPU Utilization of the ExpressRoute Gateway|roleInstance|
|ExpressRouteGatewayFrequencyOfRoutesChanged|No|Frequency of Routes change (Preview)|Count|Total|Frequency of Routes change in ExpressRoute Gateway|roleInstance|
|ExpressRouteGatewayNumberOfVmInVnet|No|Number of VMs in the Virtual Network(Preview)|Count|Maximum|Number of VMs in the Virtual Network|No Dimensions|
|ExpressRouteGatewayPacketsPerSecond|No|Packets per second|CountPerSecond|Average|Packet count of ExpressRoute Gateway|roleInstance|
|P2SBandwidth|Yes|Gateway P2S Bandwidth|BytesPerSecond|Average|Average point-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|P2SConnectionCount|Yes|P2S Connection Count|Count|Maximum|Point-to-site connection count of a gateway|Protocol|
|TunnelAverageBandwidth|Yes|Tunnel Bandwidth|BytesPerSecond|Average|Average bandwidth of a tunnel in bytes per second|ConnectionName, RemoteIP|
|TunnelEgressBytes|Yes|Tunnel Egress Bytes|Bytes|Total|Outgoing bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPacketDropTSMismatch|Yes|Tunnel Egress TS Mismatch Packet Drop|Count|Total|Outgoing packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPackets|Yes|Tunnel Egress Packets|Count|Total|Outgoing packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressBytes|Yes|Tunnel Ingress Bytes|Bytes|Total|Incoming bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPacketDropTSMismatch|Yes|Tunnel Ingress TS Mismatch Packet Drop|Count|Total|Incoming packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPackets|Yes|Tunnel Ingress Packets|Count|Total|Incoming packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelNatAllocations|No|Tunnel NAT Allocations|Count|Total|Count of allocations for a NAT rule on a tunnel|NatRule, ConnectionName, RemoteIP|
|TunnelNatedBytes|No|Tunnel NATed Bytes|Bytes|Total|Number of bytes that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP|
|TunnelNatedPackets|No|Tunnel NATed Packets|Count|Total|Number of packets that were NATed on a tunnel by a NAT rule|NatRule, ConnectionName, RemoteIP|
|TunnelNatFlowCount|No|Tunnel NAT Flows|Count|Total|Number of NAT flows on a tunnel by flow type and NAT rule|NatRule, ConnectionName, RemoteIP, FlowType|
|TunnelNatPacketDrop|No|Tunnel NAT Packet Drops|Count|Total|Number of NATed packets on a tunnel that dropped by drop type and NAT rule|NatRule, ConnectionName, RemoteIP, DropType|
|TunnelReverseNatedBytes|No|Tunnel Reverse NATed Bytes|Bytes|Total|Number of bytes that were reverse NATed on a tunnel by a NAT rule|NatRule, ConnectionName, RemoteIP|
|TunnelReverseNatedPackets|No|Tunnel Reverse NATed Packets|Count|Total|Number of packets on a tunnel that were reverse NATed by a NAT rule|NatRule, ConnectionName, RemoteIP|


## Microsoft.Network/virtualNetworks

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PingMeshAverageRoundtripMs|Yes|Round trip time for Pings to a VM|MilliSeconds|Average|Round trip time for Pings sent to a destination VM|SourceCustomerAddress, DestinationCustomerAddress|
|PingMeshProbesFailedPercent|Yes|Failed Pings to a VM|Percent|Average|Percent of number of failed Pings to total sent Pings of a destination VM|SourceCustomerAddress, DestinationCustomerAddress|


## Microsoft.Network/virtualRouters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PeeringAvailability|Yes|Bgp Availability|Percent|Average|BGP Availability between VirtualRouter and remote peers|Peer|


## Microsoft.Network/vpnGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageBandwidth|Yes|Gateway S2S Bandwidth|BytesPerSecond|Average|Average site-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|TunnelAverageBandwidth|Yes|Tunnel Bandwidth|BytesPerSecond|Average|Average bandwidth of a tunnel in bytes per second|ConnectionName, RemoteIP|
|TunnelEgressBytes|Yes|Tunnel Egress Bytes|Bytes|Total|Outgoing bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPacketDropTSMismatch|Yes|Tunnel Egress TS Mismatch Packet Drop|Count|Total|Outgoing packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPackets|Yes|Tunnel Egress Packets|Count|Total|Outgoing packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressBytes|Yes|Tunnel Ingress Bytes|Bytes|Total|Incoming bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPacketDropTSMismatch|Yes|Tunnel Ingress TS Mismatch Packet Drop|Count|Total|Incoming packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPackets|Yes|Tunnel Ingress Packets|Count|Total|Incoming packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelNatAllocations|No|Tunnel NAT Allocations|Count|Total|Count of allocations for a NAT rule on a tunnel|NatRule, ConnectionName, RemoteIP|
|TunnelNatedBytes|No|Tunnel NATed Bytes|Bytes|Total|Number of bytes that were NATed on a tunnel by a NAT rule |NatRule, ConnectionName, RemoteIP|
|TunnelNatedPackets|No|Tunnel NATed Packets|Count|Total|Number of packets that were NATed on a tunnel by a NAT rule|NatRule, ConnectionName, RemoteIP|
|TunnelNatFlowCount|No|Tunnel NAT Flows|Count|Total|Number of NAT flows on a tunnel by flow type and NAT rule|NatRule, ConnectionName, RemoteIP, FlowType|
|TunnelNatPacketDrop|No|Tunnel NAT Packet Drops|Count|Total|Number of NATed packets on a tunnel that dropped by drop type and NAT rule|NatRule, ConnectionName, RemoteIP, DropType|
|TunnelReverseNatedBytes|No|Tunnel Reverse NATed Bytes|Bytes|Total|Number of bytes that were reverse NATed on a tunnel by a NAT rule|NatRule, ConnectionName, RemoteIP|
|TunnelReverseNatedPackets|No|Tunnel Reverse NATed Packets|Count|Total|Number of packets on a tunnel that were reverse NATed by a NAT rule|NatRule, ConnectionName, RemoteIP|


## Microsoft.NotificationHubs/Namespaces/NotificationHubs

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|incoming|Yes|Incoming Messages|Count|Total|The count of all successful send API calls. |No Dimensions|
|incoming.all.failedrequests|Yes|All Incoming Failed Requests|Count|Total|Total incoming failed requests for a notification hub|No Dimensions|
|incoming.all.requests|Yes|All Incoming Requests|Count|Total|Total incoming requests for a notification hub|No Dimensions|
|incoming.scheduled|Yes|Scheduled Push Notifications Sent|Count|Total|Scheduled Push Notifications Cancelled|No Dimensions|
|incoming.scheduled.cancel|Yes|Scheduled Push Notifications Cancelled|Count|Total|Scheduled Push Notifications Cancelled|No Dimensions|
|installation.all|Yes|Installation Management Operations|Count|Total|Installation Management Operations|No Dimensions|
|installation.delete|Yes|Delete Installation Operations|Count|Total|Delete Installation Operations|No Dimensions|
|installation.get|Yes|Get Installation Operations|Count|Total|Get Installation Operations|No Dimensions|
|installation.patch|Yes|Patch Installation Operations|Count|Total|Patch Installation Operations|No Dimensions|
|installation.upsert|Yes|Create or Update Installation Operations|Count|Total|Create or Update Installation Operations|No Dimensions|
|notificationhub.pushes|Yes|All Outgoing Notifications|Count|Total|All outgoing notifications of the notification hub|No Dimensions|
|outgoing.allpns.badorexpiredchannel|Yes|Bad or Expired Channel Errors|Count|Total|The count of pushes that failed because the channel/token/registrationId in the registration was expired or invalid.|No Dimensions|
|outgoing.allpns.channelerror|Yes|Channel Errors|Count|Total|The count of pushes that failed because the channel was invalid not associated with the correct app throttled or expired.|No Dimensions|
|outgoing.allpns.invalidpayload|Yes|Payload Errors|Count|Total|The count of pushes that failed because the PNS returned a bad payload error.|No Dimensions|
|outgoing.allpns.pnserror|Yes|External Notification System Errors|Count|Total|The count of pushes that failed because there was a problem communicating with the PNS (excludes authentication problems).|No Dimensions|
|outgoing.allpns.success|Yes|Successful notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.apns.badchannel|Yes|APNS Bad Channel Error|Count|Total|The count of pushes that failed because the token is invalid (APNS status code: 8).|No Dimensions|
|outgoing.apns.expiredchannel|Yes|APNS Expired Channel Error|Count|Total|The count of token that were invalidated by the APNS feedback channel.|No Dimensions|
|outgoing.apns.invalidcredentials|Yes|APNS Authorization Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.apns.invalidnotificationsize|Yes|APNS Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (APNS status code: 7).|No Dimensions|
|outgoing.apns.pnserror|Yes|APNS Errors|Count|Total|The count of pushes that failed because of errors communicating with APNS.|No Dimensions|
|outgoing.apns.success|Yes|APNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.gcm.authenticationerror|Yes|GCM Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials the credentials are blocked or the SenderId is not correctly configured in the app (GCM result: MismatchedSenderId).|No Dimensions|
|outgoing.gcm.badchannel|Yes|GCM Bad Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was not recognized (GCM result: Invalid Registration).|No Dimensions|
|outgoing.gcm.expiredchannel|Yes|GCM Expired Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was expired (GCM result: NotRegistered).|No Dimensions|
|outgoing.gcm.invalidcredentials|Yes|GCM Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.gcm.invalidnotificationformat|Yes|GCM Invalid Notification Format|Count|Total|The count of pushes that failed because the payload was not formatted correctly (GCM result: InvalidDataKey or InvalidTtl).|No Dimensions|
|outgoing.gcm.invalidnotificationsize|Yes|GCM Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (GCM result: MessageTooBig).|No Dimensions|
|outgoing.gcm.pnserror|Yes|GCM Errors|Count|Total|The count of pushes that failed because of errors communicating with GCM.|No Dimensions|
|outgoing.gcm.success|Yes|GCM Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.gcm.throttled|Yes|GCM Throttled Notifications|Count|Total|The count of pushes that failed because GCM throttled this app (GCM status code: 501-599 or result:Unavailable).|No Dimensions|
|outgoing.gcm.wrongchannel|Yes|GCM Wrong Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration is not associated to the current app (GCM result: InvalidPackageName).|No Dimensions|
|outgoing.mpns.authenticationerror|Yes|MPNS Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.mpns.badchannel|Yes|MPNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (MPNS status: 404 not found).|No Dimensions|
|outgoing.mpns.channeldisconnected|Yes|MPNS Channel Disconnected|Count|Total|The count of pushes that failed because the ChannelURI in the registration was disconnected (MPNS status: 412 not found).|No Dimensions|
|outgoing.mpns.dropped|Yes|MPNS Dropped Notifications|Count|Total|The count of pushes that were dropped by MPNS (MPNS response header: X-NotificationStatus: QueueFull or Suppressed).|No Dimensions|
|outgoing.mpns.invalidcredentials|Yes|MPNS Invalid Credentials|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.mpns.invalidnotificationformat|Yes|MPNS Invalid Notification Format|Count|Total|The count of pushes that failed because the payload of the notification was too large.|No Dimensions|
|outgoing.mpns.pnserror|Yes|MPNS Errors|Count|Total|The count of pushes that failed because of errors communicating with MPNS.|No Dimensions|
|outgoing.mpns.success|Yes|MPNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.mpns.throttled|Yes|MPNS Throttled Notifications|Count|Total|The count of pushes that failed because MPNS is throttling this app (WNS MPNS: 406 Not Acceptable).|No Dimensions|
|outgoing.wns.authenticationerror|Yes|WNS Authentication Errors|Count|Total|Notification not delivered because of errors communicating with Windows Live invalid credentials or wrong token.|No Dimensions|
|outgoing.wns.badchannel|Yes|WNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (WNS status: 404 not found).|No Dimensions|
|outgoing.wns.channeldisconnected|Yes|WNS Channel Disconnected|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-DeviceConnectionStatus: disconnected).|No Dimensions|
|outgoing.wns.channelthrottled|Yes|WNS Channel Throttled|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-NotificationStatus:channelThrottled).|No Dimensions|
|outgoing.wns.dropped|Yes|WNS Dropped Notifications|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (X-WNS-NotificationStatus: dropped but not X-WNS-DeviceConnectionStatus: disconnected).|No Dimensions|
|outgoing.wns.expiredchannel|Yes|WNS Expired Channel Error|Count|Total|The count of pushes that failed because the ChannelURI is expired (WNS status: 410 Gone).|No Dimensions|
|outgoing.wns.invalidcredentials|Yes|WNS Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. (Windows Live does not recognize the credentials).|No Dimensions|
|outgoing.wns.invalidnotificationformat|Yes|WNS Invalid Notification Format|Count|Total|The format of the notification is invalid (WNS status: 400). Note that WNS does not reject all invalid payloads.|No Dimensions|
|outgoing.wns.invalidnotificationsize|Yes|WNS Invalid Notification Size Error|Count|Total|The notification payload is too large (WNS status: 413).|No Dimensions|
|outgoing.wns.invalidtoken|Yes|WNS Authorization Errors (Invalid Token)|Count|Total|The token provided to WNS is not valid (WNS status: 401 Unauthorized).|No Dimensions|
|outgoing.wns.pnserror|Yes|WNS Errors|Count|Total|Notification not delivered because of errors communicating with WNS.|No Dimensions|
|outgoing.wns.success|Yes|WNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.wns.throttled|Yes|WNS Throttled Notifications|Count|Total|The count of pushes that failed because WNS is throttling this app (WNS status: 406 Not Acceptable).|No Dimensions|
|outgoing.wns.tokenproviderunreachable|Yes|WNS Authorization Errors (Unreachable)|Count|Total|Windows Live is not reachable.|No Dimensions|
|outgoing.wns.wrongtoken|Yes|WNS Authorization Errors (Wrong Token)|Count|Total|The token provided to WNS is valid but for another application (WNS status: 403 Forbidden). This can happen if the ChannelURI in the registration is associated with another app. Check that the client app is associated with the same app whose credentials are in the notification hub.|No Dimensions|
|registration.all|Yes|Registration Operations|Count|Total|The count of all successful registration operations (creations updates queries and deletions). |No Dimensions|
|registration.create|Yes|Registration Create Operations|Count|Total|The count of all successful registration creations.|No Dimensions|
|registration.delete|Yes|Registration Delete Operations|Count|Total|The count of all successful registration deletions.|No Dimensions|
|registration.get|Yes|Registration Read Operations|Count|Total|The count of all successful registration queries.|No Dimensions|
|registration.update|Yes|Registration Update Operations|Count|Total|The count of all successful registration updates.|No Dimensions|
|scheduled.pending|Yes|Pending Scheduled Notifications|Count|Total|Pending Scheduled Notifications|No Dimensions|


## Microsoft.OperationalInsights/workspaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Average_% Available Memory|Yes|% Available Memory|Count|Average|Average_% Available Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Available Swap Space|Yes|% Available Swap Space|Count|Average|Average_% Available Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Committed Bytes In Use|Yes|% Committed Bytes In Use|Count|Average|Average_% Committed Bytes In Use|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% DPC Time|Yes|% DPC Time|Count|Average|Average_% DPC Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Free Inodes|Yes|% Free Inodes|Count|Average|Average_% Free Inodes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Free Space|Yes|% Free Space|Count|Average|Average_% Free Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Idle Time|Yes|% Idle Time|Count|Average|Average_% Idle Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Interrupt Time|Yes|% Interrupt Time|Count|Average|Average_% Interrupt Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% IO Wait Time|Yes|% IO Wait Time|Count|Average|Average_% IO Wait Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Nice Time|Yes|% Nice Time|Count|Average|Average_% Nice Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Privileged Time|Yes|% Privileged Time|Count|Average|Average_% Privileged Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Processor Time|Yes|% Processor Time|Count|Average|Average_% Processor Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Inodes|Yes|% Used Inodes|Count|Average|Average_% Used Inodes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Memory|Yes|% Used Memory|Count|Average|Average_% Used Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Space|Yes|% Used Space|Count|Average|Average_% Used Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Swap Space|Yes|% Used Swap Space|Count|Average|Average_% Used Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% User Time|Yes|% User Time|Count|Average|Average_% User Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes|Yes|Available MBytes|Count|Average|Average_Available MBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes Memory|Yes|Available MBytes Memory|Count|Average|Average_Available MBytes Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes Swap|Yes|Available MBytes Swap|Count|Average|Average_Available MBytes Swap|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Read|Yes|Avg. Disk sec/Read|Count|Average|Average_Avg. Disk sec/Read|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Transfer|Yes|Avg. Disk sec/Transfer|Count|Average|Average_Avg. Disk sec/Transfer|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Write|Yes|Avg. Disk sec/Write|Count|Average|Average_Avg. Disk sec/Write|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Received/sec|Yes|Bytes Received/sec|Count|Average|Average_Bytes Received/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Sent/sec|Yes|Bytes Sent/sec|Count|Average|Average_Bytes Sent/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Total/sec|Yes|Bytes Total/sec|Count|Average|Average_Bytes Total/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Current Disk Queue Length|Yes|Current Disk Queue Length|Count|Average|Average_Current Disk Queue Length|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Read Bytes/sec|Yes|Disk Read Bytes/sec|Count|Average|Average_Disk Read Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Reads/sec|Yes|Disk Reads/sec|Count|Average|Average_Disk Reads/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Transfers/sec|Yes|Disk Transfers/sec|Count|Average|Average_Disk Transfers/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Write Bytes/sec|Yes|Disk Write Bytes/sec|Count|Average|Average_Disk Write Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Writes/sec|Yes|Disk Writes/sec|Count|Average|Average_Disk Writes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Megabytes|Yes|Free Megabytes|Count|Average|Average_Free Megabytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Physical Memory|Yes|Free Physical Memory|Count|Average|Average_Free Physical Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Space in Paging Files|Yes|Free Space in Paging Files|Count|Average|Average_Free Space in Paging Files|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Virtual Memory|Yes|Free Virtual Memory|Count|Average|Average_Free Virtual Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Logical Disk Bytes/sec|Yes|Logical Disk Bytes/sec|Count|Average|Average_Logical Disk Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Page Reads/sec|Yes|Page Reads/sec|Count|Average|Average_Page Reads/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Page Writes/sec|Yes|Page Writes/sec|Count|Average|Average_Page Writes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pages/sec|Yes|Pages/sec|Count|Average|Average_Pages/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pct Privileged Time|Yes|Pct Privileged Time|Count|Average|Average_Pct Privileged Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pct User Time|Yes|Pct User Time|Count|Average|Average_Pct User Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Physical Disk Bytes/sec|Yes|Physical Disk Bytes/sec|Count|Average|Average_Physical Disk Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Processes|Yes|Processes|Count|Average|Average_Processes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Processor Queue Length|Yes|Processor Queue Length|Count|Average|Average_Processor Queue Length|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Size Stored In Paging Files|Yes|Size Stored In Paging Files|Count|Average|Average_Size Stored In Paging Files|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes|Yes|Total Bytes|Count|Average|Average_Total Bytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes Received|Yes|Total Bytes Received|Count|Average|Average_Total Bytes Received|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes Transmitted|Yes|Total Bytes Transmitted|Count|Average|Average_Total Bytes Transmitted|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Collisions|Yes|Total Collisions|Count|Average|Average_Total Collisions|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Packets Received|Yes|Total Packets Received|Count|Average|Average_Total Packets Received|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Packets Transmitted|Yes|Total Packets Transmitted|Count|Average|Average_Total Packets Transmitted|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Rx Errors|Yes|Total Rx Errors|Count|Average|Average_Total Rx Errors|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Tx Errors|Yes|Total Tx Errors|Count|Average|Average_Total Tx Errors|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Uptime|Yes|Uptime|Count|Average|Average_Uptime|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used MBytes Swap Space|Yes|Used MBytes Swap Space|Count|Average|Average_Used MBytes Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used Memory kBytes|Yes|Used Memory kBytes|Count|Average|Average_Used Memory kBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used Memory MBytes|Yes|Used Memory MBytes|Count|Average|Average_Used Memory MBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Users|Yes|Users|Count|Average|Average_Users|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Virtual Shared Memory|Yes|Virtual Shared Memory|Count|Average|Average_Virtual Shared Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Event|Yes|Event|Count|Average|Event|Source, EventLog, Computer, EventCategory, EventLevel, EventLevelName, EventID|
|Heartbeat|Yes|Heartbeat|Count|Total|Heartbeat|Computer, OSType, Version, SourceComputerId|
|Update|Yes|Update|Count|Average|Update|Computer, Product, Classification, UpdateState, Optional, Approved|


## Microsoft.Peering/peerings

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|EgressTrafficRate|Yes|Egress Traffic Rate|BitsPerSecond|Average|Egress traffic rate in bits per second|ConnectionId, SessionIp, TrafficClass|
|IngressTrafficRate|Yes|Ingress Traffic Rate|BitsPerSecond|Average|Ingress traffic rate in bits per second|ConnectionId, SessionIp, TrafficClass|
|SessionAvailability|Yes|Session Availability|Count|Average|Availability of the peering session|ConnectionId, SessionIp|


## Microsoft.Peering/peeringServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PrefixLatency|Yes|Prefix Latency|Milliseconds|Average|Median prefix latency|PrefixName|


## Microsoft.PowerBIDedicated/capacities

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|memory_metric|Yes|Memory (Gen1)|Bytes|Average|Memory. Range 0-3 GB for A1, 0-5 GB for A2, 0-10 GB for A3, 0-25 GB for A4, 0-50 GB for A5 and 0-100 GB for A6. Supported only for Power BI Embedded Generation 1 resources.|No Dimensions|
|memory_thrashing_metric|Yes|Memory Thrashing (Datasets) (Gen1)|Percent|Average|Average memory thrashing. Supported only for Power BI Embedded Generation 1 resources.|No Dimensions|
|qpu_high_utilization_metric|Yes|QPU High Utilization (Gen1)|Count|Total|QPU High Utilization In Last Minute, 1 For High QPU Utilization, Otherwise 0. Supported only for Power BI Embedded Generation 1 resources.|No Dimensions|
|QueryDuration|Yes|Query Duration (Datasets) (Gen1)|Milliseconds|Average|DAX Query duration in last interval. Supported only for Power BI Embedded Generation 1 resources.|No Dimensions|
|QueryPoolJobQueueLength|Yes|Query Pool Job Queue Length (Datasets) (Gen1)|Count|Average|Number of jobs in the queue of the query thread pool. Supported only for Power BI Embedded Generation 1 resources.|No Dimensions|


## microsoft.purview/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ScanCancelled|Yes|Scan Cancelled|Count|Total|Indicates the number of scans cancelled.||
|ScanCompleted|Yes|Scan Completed|Count|Total|Indicates the number of scans completed successfully.||
|ScanFailed|Yes|Scan Failed|Count|Total|Indicates the number of scans failed.||
|ScanTimeTaken|Yes|Scan time taken|Seconds|Total|Indicates the total scan time in seconds.||


## Microsoft.Relay/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Total|Total ActiveConnections for Microsoft.Relay.|EntityName|
|ActiveListeners|No|ActiveListeners|Count|Total|Total ActiveListeners for Microsoft.Relay.|EntityName|
|BytesTransferred|Yes|BytesTransferred|Bytes|Total|Total BytesTransferred for Microsoft.Relay.|EntityName|
|ListenerConnections-ClientError|No|ListenerConnections-ClientError|Count|Total|ClientError on ListenerConnections for Microsoft.Relay.|EntityName, OperationResult|
|ListenerConnections-ServerError|No|ListenerConnections-ServerError|Count|Total|ServerError on ListenerConnections for Microsoft.Relay.|EntityName, OperationResult|
|ListenerConnections-Success|No|ListenerConnections-Success|Count|Total|Successful ListenerConnections for Microsoft.Relay.|EntityName, OperationResult|
|ListenerConnections-TotalRequests|No|ListenerConnections-TotalRequests|Count|Total|Total ListenerConnections for Microsoft.Relay.|EntityName|
|ListenerDisconnects|No|ListenerDisconnects|Count|Total|Total ListenerDisconnects for Microsoft.Relay.|EntityName|
|SenderConnections-ClientError|No|SenderConnections-ClientError|Count|Total|ClientError on SenderConnections for Microsoft.Relay.|EntityName, OperationResult|
|SenderConnections-ServerError|No|SenderConnections-ServerError|Count|Total|ServerError on SenderConnections for Microsoft.Relay.|EntityName, OperationResult|
|SenderConnections-Success|No|SenderConnections-Success|Count|Total|Successful SenderConnections for Microsoft.Relay.|EntityName, OperationResult|
|SenderConnections-TotalRequests|No|SenderConnections-TotalRequests|Count|Total|Total SenderConnections requests for Microsoft.Relay.|EntityName|
|SenderDisconnects|No|SenderDisconnects|Count|Total|Total SenderDisconnects for Microsoft.Relay.|EntityName|


## microsoft.resources/subscriptions

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Latency|Yes|Http Incoming Requests Latency data|Count|Average|Http Incoming Requests latency data|Method, Namespace, RequestRegion, ResourceType, Microsoft.SubscriptionId|
|Traffic|Yes|Traffic|Count|Average|Http traffic|RequestRegion, StatusCode, StatusCodeClass, ResourceType, Namespace, Microsoft.SubscriptionId|


## Microsoft.Search/searchServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|SearchLatency|Yes|Search Latency|Seconds|Average|Average search latency for the search service|No Dimensions|
|SearchQueriesPerSecond|Yes|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|No Dimensions|
|ThrottledSearchQueriesPercentage|Yes|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|No Dimensions|


## Microsoft.ServiceBus/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Total|Total Active Connections for Microsoft.ServiceBus.||
|ActiveMessages|No|Count of active messages in a Queue/Topic.|Count|Average|Count of active messages in a Queue/Topic.|EntityName|
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.ServiceBus.|EntityName|
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.ServiceBus.|EntityName|
|CPUXNS|No|CPU (Deprecated)|Percent|Maximum|Service bus premium namespace CPU usage metric. This metric is depricated. Please use the CPU metric (NamespaceCpuUsage) instead.|Replica|
|DeadletteredMessages|No|Count of dead-lettered messages in a Queue/Topic.|Count|Average|Count of dead-lettered messages in a Queue/Topic.|EntityName|
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.ServiceBus.|EntityName|
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.ServiceBus.|EntityName|
|Messages|No|Count of messages in a Queue/Topic.|Count|Average|Count of messages in a Queue/Topic.|EntityName|
|NamespaceCpuUsage|No|CPU|Percent|Maximum|Service bus premium namespace CPU usage metric.|Replica|
|NamespaceMemoryUsage|No|Memory Usage|Percent|Maximum|Service bus premium namespace memory usage metric.|Replica|
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.ServiceBus.|EntityName|
|ScheduledMessages|No|Count of scheduled messages in a Queue/Topic.|Count|Average|Count of scheduled messages in a Queue/Topic.|EntityName|
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.ServiceBus.|EntityName, OperationResult|
|Size|No|Size|Bytes|Average|Size of an Queue/Topic in Bytes.|EntityName|
|SuccessfulRequests|No|Successful Requests|Count|Total|Total successful requests for a namespace|EntityName, OperationResult|
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.ServiceBus.|EntityName, OperationResult|
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.ServiceBus.|EntityName, OperationResult|
|WSXNS|No|Memory Usage (Deprecated)|Percent|Maximum|Service bus premium namespace memory usage metric. This metric is deprecated. Please use the  Memory Usage (NamespaceMemoryUsage) metric instead.|Replica|


## Microsoft.ServiceFabricMesh/applications

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActualCpu|No|ActualCpu|Count|Average|Actual CPU usage in milli cores|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|ActualMemory|No|ActualMemory|Bytes|Average|Actual memory usage in MB|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|AllocatedCpu|No|AllocatedCpu|Count|Average|Cpu allocated to this container in milli cores|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|AllocatedMemory|No|AllocatedMemory|Bytes|Average|Memory allocated to this container in MB|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|ApplicationStatus|No|ApplicationStatus|Count|Average|Status of Service Fabric Mesh application|ApplicationName, Status|
|ContainerStatus|No|ContainerStatus|Count|Average|Status of the container in Service Fabric Mesh application|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName, Status|
|CpuUtilization|No|CpuUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|MemoryUtilization|No|MemoryUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|RestartCount|No|RestartCount|Count|Average|Restart count of a container in Service Fabric Mesh application|ApplicationName, Status, ServiceName, ServiceReplicaName, CodePackageName|
|ServiceReplicaStatus|No|ServiceReplicaStatus|Count|Average|Health Status of a service replica in Service Fabric Mesh application|ApplicationName, Status, ServiceName, ServiceReplicaName|
|ServiceStatus|No|ServiceStatus|Count|Average|Health Status of a service in Service Fabric Mesh application|ApplicationName, Status, ServiceName|


## Microsoft.SignalRService/SignalR

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ConnectionCount|Yes|Connection Count|Count|Maximum|The amount of user connection.|Endpoint|
|InboundTraffic|Yes|Inbound Traffic|Bytes|Total|The inbound traffic of service|No Dimensions|
|MessageCount|Yes|Message Count|Count|Total|The total amount of messages.|No Dimensions|
|OutboundTraffic|Yes|Outbound Traffic|Bytes|Total|The outbound traffic of service|No Dimensions|
|SystemErrors|Yes|System Errors|Percent|Maximum|The percentage of system errors|No Dimensions|
|UserErrors|Yes|User Errors|Percent|Maximum|The percentage of user errors|No Dimensions|


## Microsoft.SignalRService/WebPubSub

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|InboundTraffic|Yes|Inbound Traffic|Bytes|Total|The inbound traffic of service|No Dimensions|
|OutboundTraffic|Yes|Outbound Traffic|Bytes|Total|The outbound traffic of service|No Dimensions|
|TotalConnectionCount|Yes|Connection Count|Count|Maximum|The amount of user connection.|No Dimensions|

## Microsoft.Sql/managedInstances

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|avg_cpu_percent|Yes|Average CPU percentage|Percent|Average|Average CPU percentage|No Dimensions|
|io_bytes_read|Yes|IO bytes read|Bytes|Average|IO bytes read|No Dimensions|
|io_bytes_written|Yes|IO bytes written|Bytes|Average|IO bytes written|No Dimensions|
|io_requests|Yes|IO requests count|Count|Average|IO requests count|No Dimensions|
|reserved_storage_mb|Yes|Storage space reserved|Count|Average|Storage space reserved|No Dimensions|
|storage_space_used_mb|Yes|Storage space used|Count|Average|Storage space used|No Dimensions|
|virtual_core_count|Yes|Virtual core count|Count|Average|Virtual core count|No Dimensions|


## Microsoft.Sql/servers/databases

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_queries|Yes|Active queries|Count|Total|Active queries across all workload groups. Applies only to data warehouses.|No Dimensions|
|allocated_data_storage|Yes|Data space allocated|Bytes|Average|Allocated data storage. Not applicable to data warehouses.|No Dimensions|
|app_cpu_billed|Yes|App CPU billed|Count|Total|App CPU billed. Applies to serverless databases.|No Dimensions|
|app_cpu_percent|Yes|App CPU percentage|Percent|Average|App CPU percentage. Applies to serverless databases.|No Dimensions|
|app_memory_percent|Yes|App memory percentage|Percent|Average|App memory percentage. Applies to serverless databases.|No Dimensions|
|base_blob_size_bytes|Yes|Base blob storage size|Bytes|Maximum|Base blob storage size. Applies to Hyperscale databases.|No Dimensions|
|blocked_by_firewall|Yes|Blocked by Firewall|Count|Total|Blocked by Firewall|No Dimensions|
|cache_hit_percent|Yes|Cache hit percentage|Percent|Maximum|Cache hit percentage. Applies only to data warehouses.|No Dimensions|
|cache_used_percent|Yes|Cache used percentage|Percent|Maximum|Cache used percentage. Applies only to data warehouses.|No Dimensions|
|connection_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|connection_successful|Yes|Successful Connections|Count|Total|Successful Connections|No Dimensions|
|cpu_limit|Yes|CPU limit|Count|Average|CPU limit. Applies to vCore-based databases.|No Dimensions|
|cpu_percent|Yes|CPU percentage|Percent|Average|CPU percentage|No Dimensions|
|cpu_used|Yes|CPU used|Count|Average|CPU used. Applies to vCore-based databases.|No Dimensions|
|deadlock|Yes|Deadlocks|Count|Total|Deadlocks. Not applicable to data warehouses.|No Dimensions|
|diff_backup_size_bytes|Yes|Differential backup storage size|Bytes|Maximum|Cumulative differential backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases.|No Dimensions|
|dtu_consumption_percent|Yes|DTU percentage|Percent|Average|DTU Percentage. Applies to DTU-based databases.|No Dimensions|
|dtu_limit|Yes|DTU Limit|Count|Average|DTU Limit. Applies to DTU-based databases.|No Dimensions|
|dtu_used|Yes|DTU used|Count|Average|DTU used. Applies to DTU-based databases.|No Dimensions|
|dwu_consumption_percent|Yes|DWU percentage|Percent|Maximum|DWU percentage. Applies only to data warehouses.|No Dimensions|
|dwu_limit|Yes|DWU limit|Count|Maximum|DWU limit. Applies only to data warehouses.|No Dimensions|
|dwu_used|Yes|DWU used|Count|Maximum|DWU used. Applies only to data warehouses.|No Dimensions|
|full_backup_size_bytes|Yes|Full backup storage size|Bytes|Maximum|Cumulative full backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases.|No Dimensions|
|local_tempdb_usage_percent|Yes|Local tempdb percentage|Percent|Average|Local tempdb percentage. Applies only to data warehouses.|No Dimensions|
|log_backup_size_bytes|Yes|Log backup storage size|Bytes|Maximum|Cumulative log backup storage size. Applies to vCore-based and Hyperscale databases.|No Dimensions|
|log_write_percent|Yes|Log IO percentage|Percent|Average|Log IO percentage. Not applicable to data warehouses.|No Dimensions|
|memory_usage_percent|Yes|Memory percentage|Percent|Maximum|Memory percentage. Applies only to data warehouses.|No Dimensions|
|physical_data_read_percent|Yes|Data IO percentage|Percent|Average|Data IO percentage|No Dimensions|
|queued_queries|Yes|Queued queries|Count|Total|Queued queries across all workload groups. Applies only to data warehouses.|No Dimensions|
|sessions_percent|Yes|Sessions percentage|Percent|Average|Sessions percentage. Not applicable to data warehouses.|No Dimensions|
|snapshot_backup_size_bytes|Yes|Snapshot backup storage size|Bytes|Maximum|Cumulative snapshot backup storage size. Applies to Hyperscale databases.|No Dimensions|
|sqlserver_process_core_percent|Yes|SQL Server process core percent|Percent|Maximum|CPU usage as a percentage of the SQL DB process. Not applicable to data warehouses.|No Dimensions|
|sqlserver_process_memory_percent|Yes|SQL Server process memory percent|Percent|Maximum|Memory usage as a percentage of the SQL DB process. Not applicable to data warehouses.|No Dimensions|
|storage|Yes|Data space used|Bytes|Maximum|Data space used. Not applicable to data warehouses.|No Dimensions|
|storage_percent|Yes|Data space used percent|Percent|Maximum|Data space used percent. Not applicable to data warehouses or hyperscale databases.|No Dimensions|
|tempdb_data_size|Yes|Tempdb Data File Size Kilobytes|Count|Maximum|Space used in tempdb data files in kilobytes. Not applicable to data warehouses.|No Dimensions|
|tempdb_log_size|Yes|Tempdb Log File Size Kilobytes|Count|Maximum|Space used in tempdb transaction log file in kilobytes. Not applicable to data warehouses.|No Dimensions|
|tempdb_log_used_percent|Yes|Tempdb Percent Log Used|Percent|Maximum|Space used percentage in tempdb transaction log file. Not applicable to data warehouses.|No Dimensions|
|wlg_active_queries|Yes|Workload group active queries|Count|Total|Active queries within the workload group. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_active_queries_timeouts|Yes|Workload group query timeouts|Count|Total|Queries that have timed out for the workload group. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_allocation_relative_to_system_percent|Yes|Workload group allocation by system percent|Percent|Maximum|Allocated percentage of resources relative to the entire system per workload group. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_allocation_relative_to_wlg_effective_cap_percent|Yes|Workload group allocation by cap resource percent|Percent|Maximum|Allocated percentage of resources relative to the specified cap resources per workload group. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_effective_cap_resource_percent|Yes|Effective cap resource percent|Percent|Maximum|A hard limit on the percentage of resources allowed for the workload group, taking into account Effective Min Resource Percentage allocated for other workload groups. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_effective_min_resource_percent|Yes|Effective min resource percent|Percent|Maximum|Minimum percentage of resources reserved and isolated for the workload group, taking into account the service level minimum. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|wlg_queued_queries|Yes|Workload group queued queries|Count|Total|Queued queries within the workload group. Applies only to data warehouses.|WorkloadGroupName, IsUserDefined|
|workers_percent|Yes|Workers percentage|Percent|Average|Workers percentage. Not applicable to data warehouses.|No Dimensions|
|xtp_storage_percent|Yes|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent. Not applicable to data warehouses.|No Dimensions|


## Microsoft.Sql/servers/elasticPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|allocated_data_storage|Yes|Data space allocated|Bytes|Average|Data space allocated|No Dimensions|
|allocated_data_storage_percent|Yes|Data space allocated percent|Percent|Maximum|Data space allocated percent|No Dimensions|
|cpu_limit|Yes|CPU limit|Count|Average|CPU limit. Applies to vCore-based elastic pools.|No Dimensions|
|cpu_percent|Yes|CPU percentage|Percent|Average|CPU percentage|No Dimensions|
|cpu_used|Yes|CPU used|Count|Average|CPU used. Applies to vCore-based elastic pools.|No Dimensions|
|database_allocated_data_storage|No|Data space allocated|Bytes|Average|Data space allocated|DatabaseResourceId|
|database_cpu_limit|No|CPU limit|Count|Average|CPU limit|DatabaseResourceId|
|database_cpu_percent|No|CPU percentage|Percent|Average|CPU percentage|DatabaseResourceId|
|database_cpu_used|No|CPU used|Count|Average|CPU used|DatabaseResourceId|
|database_dtu_consumption_percent|No|DTU percentage|Percent|Average|DTU percentage|DatabaseResourceId|
|database_eDTU_used|No|eDTU used|Count|Average|eDTU used|DatabaseResourceId|
|database_log_write_percent|No|Log IO percentage|Percent|Average|Log IO percentage|DatabaseResourceId|
|database_physical_data_read_percent|No|Data IO percentage|Percent|Average|Data IO percentage|DatabaseResourceId|
|database_sessions_percent|No|Sessions percentage|Percent|Average|Sessions percentage|DatabaseResourceId|
|database_storage_used|No|Data space used|Bytes|Average|Data space used|DatabaseResourceId|
|database_workers_percent|No|Workers percentage|Percent|Average|Workers percentage|DatabaseResourceId|
|dtu_consumption_percent|Yes|DTU percentage|Percent|Average|DTU Percentage. Applies to DTU-based elastic pools.|No Dimensions|
|eDTU_limit|Yes|eDTU limit|Count|Average|eDTU limit. Applies to DTU-based elastic pools.|No Dimensions|
|eDTU_used|Yes|eDTU used|Count|Average|eDTU used. Applies to DTU-based elastic pools.|No Dimensions|
|log_write_percent|Yes|Log IO percentage|Percent|Average|Log IO percentage|No Dimensions|
|physical_data_read_percent|Yes|Data IO percentage|Percent|Average|Data IO percentage|No Dimensions|
|sessions_percent|Yes|Sessions percentage|Percent|Average|Sessions percentage|No Dimensions|
|sqlserver_process_core_percent|Yes|SQL Server process core percent|Percent|Maximum|CPU usage as a percentage of the SQL DB process. Applies to elastic pools.|No Dimensions|
|sqlserver_process_memory_percent|Yes|SQL Server process memory percent|Percent|Maximum|Memory usage as a percentage of the SQL DB process. Applies to elastic pools.|No Dimensions|
|storage_limit|Yes|Data max size|Bytes|Average|Data max size|No Dimensions|
|storage_percent|Yes|Data space used percent|Percent|Average|Data space used percent|No Dimensions|
|storage_used|Yes|Data space used|Bytes|Average|Data space used|No Dimensions|
|tempdb_data_size|Yes|Tempdb Data File Size Kilobytes|Count|Maximum|Space used in tempdb data files in kilobytes.|No Dimensions|
|tempdb_log_size|Yes|Tempdb Log File Size Kilobytes|Count|Maximum|Space used in tempdb transaction log file in kilobytes.|No Dimensions|
|tempdb_log_used_percent|Yes|Tempdb Percent Log Used|Percent|Maximum|Space used percentage in tempdb transaction log file|No Dimensions|
|workers_percent|Yes|Workers percentage|Percent|Average|Workers percentage|No Dimensions|
|xtp_storage_percent|Yes|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent|No Dimensions|


## Microsoft.Storage/storageAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|UsedCapacity|Yes|Used capacity|Bytes|Average|The amount of storage used by the storage account. For standard storage accounts, it's the sum of capacity used by blob, table, file, and queue. For premium storage accounts and Blob storage accounts, it is the same as BlobCapacity or FileCapacity.|No Dimensions|


## Microsoft.Storage/storageAccounts/blobServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|BlobCapacity|No|Blob Capacity|Bytes|Average|The amount of storage used by the storage account’s Blob service in bytes.|BlobType, Tier|
|BlobCount|No|Blob Count|Count|Average|The number of blob objects stored in the storage account.|BlobType, Tier|
|BlobProvisionedSize|No|Blob Provisioned Size|Bytes|Average|The amount of storage provisioned in the storage account’s Blob service in bytes.|BlobType, Tier|
|ContainerCount|Yes|Blob Container Count|Count|Average|The number of containers in the storage account.|No Dimensions|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|IndexCapacity|No|Index Capacity|Bytes|Average|The amount of storage used by Azure Data Lake Storage Gen2 hierarchical index.|No Dimensions|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.Storage/storageAccounts/fileServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication, FileShare|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication, FileShare|
|FileCapacity|No|File Capacity|Bytes|Average|The amount of File storage used by the storage account.|FileShare|
|FileCount|No|File Count|Count|Average|The number of files in the storage account.|FileShare|
|FileShareCapacityQuota|No|File Share Capacity Quota|Bytes|Average|The upper limit on the amount of storage that can be used by Azure Files Service in bytes.|FileShare|
|FileShareCount|No|File Share Count|Count|Average|The number of file shares in the storage account.|No Dimensions|
|FileShareProvisionedIOPS|No|File Share Provisioned IOPS|Bytes|Average|The baseline number of provisioned IOPS for the premium file share in the premium files storage account. This number is calculated based on the provisioned size (quota) of the share capacity.|FileShare|
|FileShareSnapshotCount|No|File Share Snapshot Count|Count|Average|The number of snapshots present on the share in storage account’s Files Service.|FileShare|
|FileShareSnapshotSize|No|File Share Snapshot Size|Bytes|Average|The amount of storage used by the snapshots in storage account’s File service in bytes.|FileShare|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication, FileShare|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication, FileShare|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication, FileShare|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication, FileShare|


## Microsoft.Storage/storageAccounts/queueServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|QueueCapacity|Yes|Queue Capacity|Bytes|Average|The amount of Queue storage used by the storage account.|No Dimensions|
|QueueCount|Yes|Queue Count|Count|Average|The number of queues in the storage account.|No Dimensions|
|QueueMessageCount|Yes|Queue Message Count|Count|Average|The number of unexpired queue messages in the storage account.|No Dimensions|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.Storage/storageAccounts/tableServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|
|Egress|Yes|Egress|Bytes|Total|The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|Ingress|Yes|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Yes|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Yes|Success Server Latency|Milliseconds|Average|The average time used to process a successful request by Azure Storage. This value does not include the network latency specified in SuccessE2ELatency.|GeoType, ApiName, Authentication|
|TableCapacity|Yes|Table Capacity|Bytes|Average|The amount of Table storage used by the storage account.|No Dimensions|
|TableCount|Yes|Table Count|Count|Average|The number of tables in the storage account.|No Dimensions|
|TableEntityCount|Yes|Table Entity Count|Count|Average|The number of table entities in the storage account.|No Dimensions|
|Transactions|Yes|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|


## Microsoft.StorageCache/caches

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ClientIOPS|Yes|Total Client IOPS|Count|Average|The rate of client file operations processed by the Cache.|No Dimensions|
|ClientLatency|Yes|Average Client Latency|Milliseconds|Average|Average latency of client file operations to the Cache.|No Dimensions|
|ClientLockIOPS|Yes|Client Lock IOPS|CountPerSecond|Average|Client file locking operations per second.|No Dimensions|
|ClientMetadataReadIOPS|Yes|Client Metadata Read IOPS|CountPerSecond|Average|The rate of client file operations sent to the Cache, excluding data reads, that do not modify persistent state.|No Dimensions|
|ClientMetadataWriteIOPS|Yes|Client Metadata Write IOPS|CountPerSecond|Average|The rate of client file operations sent to the Cache, excluding data writes, that modify persistent state.|No Dimensions|
|ClientReadIOPS|Yes|Client Read IOPS|CountPerSecond|Average|Client read operations per second.|No Dimensions|
|ClientReadThroughput|Yes|Average Cache Read Throughput|BytesPerSecond|Average|Client read data transfer rate.|No Dimensions|
|ClientWriteIOPS|Yes|Client Write IOPS|CountPerSecond|Average|Client write operations per second.|No Dimensions|
|ClientWriteThroughput|Yes|Average Cache Write Throughput|BytesPerSecond|Average|Client write data transfer rate.|No Dimensions|
|StorageTargetAsyncWriteThroughput|Yes|StorageTarget Asynchronous Write Throughput|BytesPerSecond|Average|The rate the Cache asynchronously writes data to a particular StorageTarget. These are opportunistic writes that do not cause clients to block.|StorageTarget|
|StorageTargetFillThroughput|Yes|StorageTarget Fill Throughput|BytesPerSecond|Average|The rate the Cache reads data from the StorageTarget to handle a cache miss.|StorageTarget|
|StorageTargetHealth|Yes|Storage Target Health|Count|Average|Boolean results of connectivity test between the Cache and Storage Targets.|No Dimensions|
|StorageTargetIOPS|Yes|Total StorageTarget IOPS|Count|Average|The rate of all file operations the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetLatency|Yes|StorageTarget Latency|Milliseconds|Average|The average round trip latency of all the file operations the Cache sends to a partricular StorageTarget.|StorageTarget|
|StorageTargetMetadataReadIOPS|Yes|StorageTarget Metadata Read IOPS|CountPerSecond|Average|The rate of file operations that do not modify persistent state, and excluding the read operation, that the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetMetadataWriteIOPS|Yes|StorageTarget Metadata Write IOPS|CountPerSecond|Average|The rate of file operations that do modify persistent state and excluding the write operation, that the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetReadAheadThroughput|Yes|StorageTarget Read Ahead Throughput|BytesPerSecond|Average|The rate the Cache opportunisticly reads data from the StorageTarget.|StorageTarget|
|StorageTargetReadIOPS|Yes|StorageTarget Read IOPS|CountPerSecond|Average|The rate of file read operations the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetSyncWriteThroughput|Yes|StorageTarget Synchronous Write Throughput|BytesPerSecond|Average|The rate the Cache synchronously writes data to a particular StorageTarget. These are writes that do cause clients to block.|StorageTarget|
|StorageTargetTotalReadThroughput|Yes|StorageTarget Total Read Throughput|BytesPerSecond|Average|The total rate that the Cache reads data from a particular StorageTarget.|StorageTarget|
|StorageTargetTotalWriteThroughput|Yes|StorageTarget Total Write Throughput|BytesPerSecond|Average|The total rate that the Cache writes data to a particular StorageTarget.|StorageTarget|
|StorageTargetWriteIOPS|Yes|StorageTarget Write IOPS|Count|Average|The rate of the file write operations the Cache sends to a particular StorageTarget.|StorageTarget|
|Uptime|Yes|Uptime|Count|Average|Boolean results of connectivity test between the Cache and monitoring system.|No Dimensions|


## microsoft.storagesync/storageSyncServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerSyncSessionResult|Yes|Sync Session Result|Count|Average|Metric that logs a value of 1 each time the Server Endpoint successfully completes a Sync Session with the Cloud Endpoint|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncBatchTransferredFileBytes|Yes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncRecallComputedSuccessRate|Yes|Cloud tiering recall success rate|Percent|Average|Percentage of all recalls that were successful|SyncGroupName, ServerName|
|StorageSyncRecalledNetworkBytesByApplication|Yes|Cloud tiering recall size by application|Bytes|Total|Size of data recalled by application|SyncGroupName, ServerName, ApplicationName|
|StorageSyncRecalledTotalNetworkBytes|Yes|Cloud tiering recall size|Bytes|Total|Size of data recalled|SyncGroupName, ServerName|
|StorageSyncRecallIOTotalSizeBytes|Yes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerName|
|StorageSyncRecallThroughputBytesPerSecond|Yes|Cloud tiering recall throughput|BytesPerSecond|Average|Size of data recall throughput|SyncGroupName, ServerName|
|StorageSyncServerHeartbeat|Yes|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the resigtered server successfully records a heartbeat with the Cloud Endpoint|ServerName|
|StorageSyncSyncSessionAppliedFilesCount|Yes|Files Synced|Count|Total|Count of Files synced|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncSyncSessionPerItemErrorsCount|Yes|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName, ServerEndpointName, SyncDirection|


## microsoft.storagesync/storageSyncServices/registeredServers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerHeartbeat|Yes|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the resigtered server successfully records a heartbeat with the Cloud Endpoint|ServerResourceId, ServerName|
|ServerRecallIOTotalSizeBytes|Yes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerResourceId, ServerName|


## microsoft.storagesync/storageSyncServices/syncGroups

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|SyncGroupBatchTransferredFileBytes|Yes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName, ServerEndpointName, SyncDirection|
|SyncGroupSyncSessionAppliedFilesCount|Yes|Files Synced|Count|Total|Count of Files synced|SyncGroupName, ServerEndpointName, SyncDirection|
|SyncGroupSyncSessionPerItemErrorsCount|Yes|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName, ServerEndpointName, SyncDirection|


## microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerEndpointBatchTransferredFileBytes|Yes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|ServerEndpointName, SyncDirection|
|ServerEndpointSyncSessionAppliedFilesCount|Yes|Files Synced|Count|Total|Count of Files synced|ServerEndpointName, SyncDirection|
|ServerEndpointSyncSessionPerItemErrorsCount|Yes|Files not syncing|Count|Total|Count of files failed to sync|ServerEndpointName, SyncDirection|


## Microsoft.StreamAnalytics/streamingjobs

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AMLCalloutFailedRequests|Yes|Failed Function Requests|Count|Total|Failed Function Requests|LogicalName, PartitionId|
|AMLCalloutInputEvents|Yes|Function Events|Count|Total|Function Events|LogicalName, PartitionId|
|AMLCalloutRequests|Yes|Function Requests|Count|Total|Function Requests|LogicalName, PartitionId|
|ConversionErrors|Yes|Data Conversion Errors|Count|Total|Data Conversion Errors|LogicalName, PartitionId|
|DeserializationError|Yes|Input Deserialization Errors|Count|Total|Input Deserialization Errors|LogicalName, PartitionId|
|DroppedOrAdjustedEvents|Yes|Out of order Events|Count|Total|Out of order Events|LogicalName, PartitionId|
|EarlyInputEvents|Yes|Early Input Events|Count|Total|Early Input Events|LogicalName, PartitionId|
|Errors|Yes|Runtime Errors|Count|Total|Runtime Errors|LogicalName, PartitionId|
|InputEventBytes|Yes|Input Event Bytes|Bytes|Total|Input Event Bytes|LogicalName, PartitionId|
|InputEvents|Yes|Input Events|Count|Total|Input Events|LogicalName, PartitionId|
|InputEventsSourcesBacklogged|Yes|Backlogged Input Events|Count|Maximum|Backlogged Input Events|LogicalName, PartitionId|
|InputEventsSourcesPerSecond|Yes|Input Sources Received|Count|Total|Input Sources Received|LogicalName, PartitionId|
|LateInputEvents|Yes|Late Input Events|Count|Total|Late Input Events|LogicalName, PartitionId|
|OutputEvents|Yes|Output Events|Count|Total|Output Events|LogicalName, PartitionId|
|OutputWatermarkDelaySeconds|Yes|Watermark Delay|Seconds|Maximum|Watermark Delay|LogicalName, PartitionId|
|ProcessCPUUsagePercentage|Yes|CPU % Utilization (Preview)|Percent|Maximum|CPU % Utilization (Preview)|LogicalName, PartitionId|
|ResourceUtilization|Yes|SU % Utilization|Percent|Maximum|SU % Utilization|LogicalName, PartitionId|


## Microsoft.Synapse/workspaces
|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BuiltinSqlPoolDataProcessedBytes|No|Data processed (bytes)|Bytes|Total|Amount of data processed by queries|No Dimensions|
|BuiltinSqlPoolLoginAttempts|No|Login attempts|Count|Total|Count of login attempts that succeded or failed|Result|
|BuiltinSqlPoolRequestsEnded|No|Requests ended|Count|Total|Count of Requests that succeeded, failed, or were cancelled|Result|
|IntegrationActivityRunsEnded|No|Activity runs ended|Count|Total|Count of integration activities that succeeded, failed, or were cancelled|Result, FailureType, Activity, ActivityType, Pipeline|
|IntegrationPipelineRunsEnded|No|Pipeline runs ended|Count|Total|Count of integration pipeline runs that succeeded, failed, or were cancelled|Result, FailureType, Pipeline|
|IntegrationTriggerRunsEnded|No|Trigger Runs ended|Count|Total|Count of integration triggers that succeeded, failed, or were cancelled|Result, FailureType, Trigger|
|SQLStreamingBackloggedInputEventSources|No|Backlogged input events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events sources backlogged.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingConversionErrors|No|Data conversion errors (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of output events that could not be converted to the expected output schema. Error policy can be changed to 'Drop' to drop events that encounter this scenario.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingDeserializationError|No|Input deserialization errors (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events that could not be deserialized.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingEarlyInputEvents|No|Early input events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events which application time is considered early compared to arrival time, according to early arrival policy.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingInputEventBytes|No|Input event bytes (preview)|Count|Total|This is a preview metric available in East US, West Europe. Amount of data received by the streaming job, in bytes. This can be used to validate that events are being sent to the input source.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingInputEvents|No|Input events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingInputEventsSourcesPerSecond|No|Input sources received (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events sources per second.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingLateInputEvents|No|Late input events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of input events which application time is considered late compared to arrival time, according to late arrival policy.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingOutOfOrderEvents|No|Out of order events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of Event Hub Events (serialized messages) received by the Event Hub Input Adapter, received out of order that were either dropped or given an adjusted timestamp, based on the Event Ordering Policy.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingOutputEvents|No|Output events (preview)|Count|Total|This is a preview metric available in East US, West Europe. Number of output events.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingOutputWatermarkDelaySeconds|No|Watermark delay (preview)|Count|Maximum|This is a preview metric available in East US, West Europe. Output watermark delay in seconds.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingResourceUtilization|No|Resource % utilization (preview)|Percent|Maximum|This is a preview metric available in East US, West Europe.
 Resource utilization expressed as a percentage. High utilization indicates that the job is using close to the maximum allocated resources.|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|
|SQLStreamingRuntimeErrors|No|Runtime errors (preview)|Count|Total|This is a preview metric available in East US, West Europe. Total number of errors related to query processing (excluding errors found while ingesting events or outputting results).|ResourceName, SQLPoolName, SQLDatabaseName, JobName, LogicalName, PartitionId, ProcessorInstance|


## Microsoft.Synapse/workspaces/bigDataPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BigDataPoolAllocatedCores|No|vCores allocated|Count|Maximum|Allocated vCores for an Apache Spark Pool|SubmitterId|
|BigDataPoolAllocatedMemory|No|Memory allocated (GB)|Count|Maximum|Allocated Memory for Apach Spark Pool (GB)|SubmitterId|
|BigDataPoolApplicationsActive|No|Active Apache Spark applications|Count|Maximum|Total Active Apache Spark Pool Applications|JobState|
|BigDataPoolApplicationsEnded|No|Ended Apache Spark applications|Count|Total|Count of Apache Spark pool applications ended|JobType, JobResult|


## Microsoft.Synapse/workspaces/sqlPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveQueries|No|Active queries|Count|Total|The active queries. Using this metric unfiltered and unsplit displays all active queries running on the system|IsUserDefined|
|AdaptiveCacheHitPercent|No|Adaptive cache hit percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache hit percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|No Dimensions|
|AdaptiveCacheUsedPercent|No|Adaptive cache used percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache used percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|No Dimensions|
|Connections|Yes|Connections|Count|Total|Count of Total logins to the SQL pool|Result|
|ConnectionsBlockedByFirewall|No|Connections blocked by firewall|Count|Total|Count of connections blocked by firewall rules. Revisit access control policies for your SQL pool and monitor these connections if the count is high|No Dimensions|
|CPUPercent|No|CPU used percentage|Percent|Maximum|CPU utilization across all nodes in the SQL pool|No Dimensions|
|DWULimit|No|DWU limit|Count|Maximum|Service level objective of the SQL pool|No Dimensions|
|DWUUsed|No|DWU used|Count|Maximum|Represents a high-level representation of usage across the SQL pool. Measured by DWU limit * DWU percentage|No Dimensions|
|DWUUsedPercent|No|DWU used percentage|Percent|Maximum|Represents a high-level representation of usage across the SQL pool. Measured by taking the maximum between CPU percentage and Data IO percentage|No Dimensions|
|LocalTempDBUsedPercent|No|Local tempdb used percentage|Percent|Maximum|Local tempdb utilization across all compute nodes - values are emitted every five minute|No Dimensions|
|MemoryUsedPercent|No|Memory used percentage|Percent|Maximum|Memory utilization across all nodes in the SQL pool|No Dimensions|
|QueuedQueries|No|Queued queries|Count|Total|Cumulative count of requests queued after the max concurrency limit was reached|IsUserDefined|
|WLGActiveQueries|No|Workload group active queries|Count|Total|The active queries within the workload group. Using this metric unfiltered and unsplit displays all active queries running on the system|IsUserDefined, WorkloadGroup|
|WLGActiveQueriesTimeouts|No|Workload group query timeouts|Count|Total|Queries for the workload group that have timed out. Query timeouts reported by this metric are only once the query has started executing (it does not include wait time due to locking or resource waits)|IsUserDefined, WorkloadGroup|
|WLGAllocationByEffectiveCapResourcePercent|No|Workload group allocation by max resource percent|Percent|Maximum|Displays the percentage allocation of resources relative to the Effective cap resource percent per workload group. This metric provides the effective utilization of the workload group|IsUserDefined, WorkloadGroup|
|WLGAllocationBySystemPercent|No|Workload group allocation by system percent|Percent|Maximum|The percentage allocation of resources relative to the entire system|IsUserDefined, WorkloadGroup|
|WLGEffectiveCapResourcePercent|No|Effective cap resource percent|Percent|Maximum|The effective cap resource percent for the workload group. If there are other workload groups with min_percentage_resource > 0, the effective_cap_percentage_resource is lowered proportionally|IsUserDefined, WorkloadGroup|
|WLGEffectiveMinResourcePercent|No|Effective min resource percent|Percent|Maximum|The effective min resource percentage setting allowed considering the service level and the workload group settings. The effective min_percentage_resource can be adjusted higher on lower service levels|IsUserDefined, WorkloadGroup|
|WLGQueuedQueries|No|Workload group queued queries|Count|Total|Cumulative count of requests queued after the max concurrency limit was reached|IsUserDefined, WorkloadGroup|


## Microsoft.TimeSeriesInsights/environments

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngressReceivedBytes|Yes|Ingress Received Bytes|Bytes|Total|Count of bytes read from all event sources|No Dimensions|
|IngressReceivedInvalidMessages|Yes|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from all Event hub or IoT hub event sources|No Dimensions|
|IngressReceivedMessages|Yes|Ingress Received Messages|Count|Total|Count of messages read from all Event hub or IoT hub event sources|No Dimensions|
|IngressReceivedMessagesCountLag|Yes|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress|No Dimensions|
|IngressReceivedMessagesTimeLag|Yes|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|No Dimensions|
|IngressStoredBytes|Yes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|No Dimensions|
|IngressStoredEvents|Yes|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|No Dimensions|
|WarmStorageMaxProperties|Yes|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|No Dimensions|
|WarmStorageUsedProperties|Yes|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|No Dimensions|


## Microsoft.TimeSeriesInsights/environments/eventsources

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|IngressReceivedBytes|Yes|Ingress Received Bytes|Bytes|Total|Count of bytes read from the event source|No Dimensions|
|IngressReceivedInvalidMessages|Yes|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from the event source|No Dimensions|
|IngressReceivedMessages|Yes|Ingress Received Messages|Count|Total|Count of messages read from the event source|No Dimensions|
|IngressReceivedMessagesCountLag|Yes|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress|No Dimensions|
|IngressReceivedMessagesTimeLag|Yes|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|No Dimensions|
|IngressStoredBytes|Yes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|No Dimensions|
|IngressStoredEvents|Yes|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|No Dimensions|
|WarmStorageMaxProperties|Yes|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|No Dimensions|
|WarmStorageUsedProperties|Yes|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|No Dimensions|


## Microsoft.VMwareCloudSimple/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Disk Read Bytes|Yes|Disk Read Bytes|Bytes|Total|Total disk throughput due to read operations over the sample period.|No Dimensions|
|Disk Read Operations/Sec|Yes|Disk Read Operations/Sec|CountPerSecond|Average|The average number of IO read operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|Disk Write Bytes|Yes|Disk Write Bytes|Bytes|Total|Total disk throughput due to write operations over the sample period.|No Dimensions|
|Disk Write Operations/Sec|Yes|Disk Write Operations/Sec|CountPerSecond|Average|The average number of IO write operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|DiskReadBytesPerSecond|Yes|Disk Read Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to read operations over the sample period.|No Dimensions|
|DiskReadLatency|Yes|Disk Read Latency|Milliseconds|Average|Total read latency. The sum of the device and kernel read latencies.|No Dimensions|
|DiskReadOperations|Yes|Disk Read Operations|Count|Total|The number of IO read operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|DiskWriteBytesPerSecond|Yes|Disk Write Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to write operations over the sample period.|No Dimensions|
|DiskWriteLatency|Yes|Disk Write Latency|Milliseconds|Average|Total write latency. The sum of the device and kernel write latencies.|No Dimensions|
|DiskWriteOperations|Yes|Disk Write Operations|Count|Total|The number of IO write operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|MemoryActive|Yes|Memory Active|Bytes|Average|The amount of memory used by the VM in the past small window of time. This is the "true" number of how much memory the VM currently has need of. Additional, unused memory may be swapped out or ballooned with no impact to the guest's performance.|No Dimensions|
|MemoryGranted|Yes|Memory Granted|Bytes|Average|The amount of memory that was granted to the VM by the host. Memory is not granted to the host until it is touched one time and granted memory may be swapped out or ballooned away if the VMkernel needs the memory.|No Dimensions|
|MemoryUsed|Yes|Memory Used|Bytes|Average|The amount of machine memory that is in use by the VM.|No Dimensions|
|Network In|Yes|Network In|Bytes|Total|Total network throughput for received traffic.|No Dimensions|
|Network Out|Yes|Network Out|Bytes|Total|Total network throughput for transmitted traffic.|No Dimensions|
|NetworkInBytesPerSecond|Yes|Network In Bytes/Sec|BytesPerSecond|Average|Average network throughput for received traffic.|No Dimensions|
|NetworkOutBytesPerSecond|Yes|Network Out Bytes/Sec|BytesPerSecond|Average|Average network throughput for transmitted traffic.|No Dimensions|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The CPU utilization. This value is reported with 100% representing all processor cores on the system. As an example, a 2-way VM using 50% of a four-core system is completely using two cores.|No Dimensions|
|PercentageCpuReady|Yes|Percentage CPU Ready|Milliseconds|Total|Ready time is the time spend waiting for CPU(s) to become available in the past update interval.|No Dimensions|


## Microsoft.Web/hostingEnvironments/multiRolePools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveRequests|Yes|Active Requests (deprecated)|Count|Total|Active Requests|Instance|
|AverageResponseTime|Yes|Average Response Time (deprecated)|Seconds|Average|The average time taken for the front end to serve requests, in seconds.|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|The average incoming bandwidth used across all front ends, in MiB.|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|The average incoming bandwidth used across all front end, in MiB.|Instance|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|The average CPU used across all instances of front end.|Instance|
|DiskQueueLength|Yes|Disk Queue Length|Count|Average|The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down because of excessive disk I/O.|Instance|
|Http101|Yes|Http 101|Count|Total|The count of requests resulting in an HTTP status code 101.|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|The count of requests resulting in an HTTP status code = 200 but < 300.|Instance|
|Http3xx|Yes|Http 3xx|Count|Total|The count of requests resulting in an HTTP status code = 300 but < 400.|Instance|
|Http401|Yes|Http 401|Count|Total|The count of requests resulting in HTTP 401 status code.|Instance|
|Http403|Yes|Http 403|Count|Total|The count of requests resulting in HTTP 403 status code.|Instance|
|Http404|Yes|Http 404|Count|Total|The count of requests resulting in HTTP 404 status code.|Instance|
|Http406|Yes|Http 406|Count|Total|The count of requests resulting in HTTP 406 status code.|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|The count of requests resulting in an HTTP status code = 400 but < 500.|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|The count of requests resulting in an HTTP status code = 500 but < 600.|Instance|
|HttpQueueLength|Yes|Http Queue Length|Count|Average|The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load.|Instance|
|HttpResponseTime|Yes|Response Time|Seconds|Average|The time taken for the front end to serve requests, in seconds.|Instance|
|LargeAppServicePlanInstances|Yes|Large App Service Plan Workers|Count|Average|Large App Service Plan Workers|No Dimensions|
|MediumAppServicePlanInstances|Yes|Medium App Service Plan Workers|Count|Average|Medium App Service Plan Workers|No Dimensions|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|The average memory used across all instances of front end.|Instance|
|Requests|Yes|Requests|Count|Total|The total number of requests regardless of their resulting HTTP status code.|Instance|
|SmallAppServicePlanInstances|Yes|Small App Service Plan Workers|Count|Average|Small App Service Plan Workers|No Dimensions|
|TotalFrontEnds|Yes|Total Front Ends|Count|Average|Total Front Ends|No Dimensions|


## Microsoft.Web/hostingEnvironments/workerPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|The average CPU used across all instances of the worker pool.|Instance|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|The average memory used across all instances of the worker pool.|Instance|
|WorkersAvailable|Yes|Available Workers|Count|Average|Available Workers|No Dimensions|
|WorkersTotal|Yes|Total Workers|Count|Average|Total Workers|No Dimensions|
|WorkersUsed|Yes|Used Workers|Count|Average|Used Workers|No Dimensions|


## Microsoft.Web/serverfarms

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesReceived|Yes|Data In|Bytes|Total|The average incoming bandwidth used across all instances of the plan.|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|The average outgoing bandwidth used across all instances of the plan.|Instance|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|The average CPU used across all instances of the plan.|Instance|
|DiskQueueLength|Yes|Disk Queue Length|Count|Average|The average number of both read and write requests that were queued on storage. A high disk queue length is an indication of an app that might be slowing down because of excessive disk I/O.|Instance|
|HttpQueueLength|Yes|Http Queue Length|Count|Average|The average number of HTTP requests that had to sit on the queue before being fulfilled. A high or increasing HTTP Queue length is a symptom of a plan under heavy load.|Instance|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|The average memory used across all instances of the plan.|Instance|
|SocketInboundAll|Yes|SocketInboundAll|Count|Average|SocketInboundAll|Instance|
|SocketLoopback|Yes|SocketLoopback|Count|Average|SocketLoopback|Instance|
|SocketOutboundAll|Yes|SocketOutboundAll|Count|Average|SocketOutboundAll|Instance|
|SocketOutboundEstablished|Yes|SocketOutboundEstablished|Count|Average|SocketOutboundEstablished|Instance|
|SocketOutboundTimeWait|Yes|SocketOutboundTimeWait|Count|Average|SocketOutboundTimeWait|Instance|
|TcpCloseWait|Yes|TCP Close Wait|Count|Average|TCP Close Wait|Instance|
|TcpClosing|Yes|TCP Closing|Count|Average|TCP Closing|Instance|
|TcpEstablished|Yes|TCP Established|Count|Average|TCP Established|Instance|
|TcpFinWait1|Yes|TCP Fin Wait 1|Count|Average|TCP Fin Wait 1|Instance|
|TcpFinWait2|Yes|TCP Fin Wait 2|Count|Average|TCP Fin Wait 2|Instance|
|TcpLastAck|Yes|TCP Last Ack|Count|Average|TCP Last Ack|Instance|
|TcpSynReceived|Yes|TCP Syn Received|Count|Average|TCP Syn Received|Instance|
|TcpSynSent|Yes|TCP Syn Sent|Count|Average|TCP Syn Sent|Instance|
|TcpTimeWait|Yes|TCP Time Wait|Count|Average|TCP Time Wait|Instance|


## Microsoft.Web/sites

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections|Yes|Connections|Count|Average|The number of bound sockets existing in the sandbox (w3wp.exe and its child processes). A bound socket is created by calling bind()/connect() APIs and remains until said socket is closed with CloseHandle()/closesocket().|Instance|
|AverageMemoryWorkingSet|Yes|Average memory working set|Bytes|Average|The average amount of memory used by the app, in megabytes (MiB).|Instance|
|AverageResponseTime|Yes|Average Response Time (deprecated)|Seconds|Average|The average time taken for the app to serve requests, in seconds.|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|The amount of incoming bandwidth consumed by the app, in MiB.|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|The amount of outgoing bandwidth consumed by the app, in MiB.|Instance|
|CpuTime|Yes|CPU Time|Seconds|Total|The amount of CPU consumed by the app, in seconds. For more information about this metric. Not applicable to Azure Functions. Please see https://aka.ms/website-monitor-cpu-time-vs-cpu-percentage (CPU time vs CPU percentage).|Instance|
|CurrentAssemblies|Yes|Current Assemblies|Count|Average|The current number of Assemblies loaded across all AppDomains in this application.|Instance|
|FileSystemUsage|Yes|File System Usage|Bytes|Average|Percentage of filesystem quota consumed by the app.|No Dimensions|
|FunctionExecutionCount|Yes|Function Execution Count|Count|Total|Function Execution Count. Only present for Azure Functions.|Instance|
|FunctionExecutionUnits|Yes|Function Execution Units|Count|Total|Function Execution Units. Only present for Azure Functions.|Instance|
|Gen0Collections|Yes|Gen 0 Garbage Collections|Count|Total|The number of times the generation 0 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|Instance|
|Gen1Collections|Yes|Gen 1 Garbage Collections|Count|Total|The number of times the generation 1 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|Instance|
|Gen2Collections|Yes|Gen 2 Garbage Collections|Count|Total|The number of times the generation 2 objects are garbage collected since the start of the app process.|Instance|
|Handles|Yes|Handle Count|Count|Average|The total number of handles currently open by the app process.|Instance|
|HealthCheckStatus|Yes|Health check status|Count|Average|Health check status|Instance|
|Http101|Yes|Http 101|Count|Total|The count of requests resulting in an HTTP status code 101.|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|The count of requests resulting in an HTTP status code = 200 but < 300.|Instance|
|Http3xx|Yes|Http 3xx|Count|Total|The count of requests resulting in an HTTP status code = 300 but < 400.|Instance|
|Http401|Yes|Http 401|Count|Total|The count of requests resulting in HTTP 401 status code.|Instance|
|Http403|Yes|Http 403|Count|Total|The count of requests resulting in HTTP 403 status code.|Instance|
|Http404|Yes|Http 404|Count|Total|The count of requests resulting in HTTP 404 status code.|Instance|
|Http406|Yes|Http 406|Count|Total|The count of requests resulting in HTTP 406 status code.|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|The count of requests resulting in an HTTP status code = 400 but < 500.|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|The count of requests resulting in an HTTP status code = 500 but < 600.|Instance|
|HttpResponseTime|Yes|Response Time|Seconds|Average|The time taken for the app to serve requests, in seconds.|Instance|
|IoOtherBytesPerSecond|Yes|IO Other Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is issuing bytes to I/O operations that don't involve data, such as control operations.|Instance|
|IoOtherOperationsPerSecond|Yes|IO Other Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing I/O operations that aren't read or write operations.|Instance|
|IoReadBytesPerSecond|Yes|IO Read Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is reading bytes from I/O operations.|Instance|
|IoReadOperationsPerSecond|Yes|IO Read Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing read I/O operations.|Instance|
|IoWriteBytesPerSecond|Yes|IO Write Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is writing bytes to I/O operations.|Instance|
|IoWriteOperationsPerSecond|Yes|IO Write Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing write I/O operations.|Instance|
|MemoryWorkingSet|Yes|Memory working set|Bytes|Average|The current amount of memory used by the app, in MiB.|Instance|
|PrivateBytes|Yes|Private Bytes|Bytes|Average|Private Bytes is the current size, in bytes, of memory that the app process has allocated that can't be shared with other processes.|Instance|
|Requests|Yes|Requests|Count|Total|The total number of requests regardless of their resulting HTTP status code.|Instance|
|RequestsInApplicationQueue|Yes|Requests In Application Queue|Count|Average|The number of requests in the application request queue.|Instance|
|Threads|Yes|Thread Count|Count|Average|The number of threads currently active in the app process.|Instance|
|TotalAppDomains|Yes|Total App Domains|Count|Average|The current number of AppDomains loaded in this application.|Instance|
|TotalAppDomainsUnloaded|Yes|Total App Domains Unloaded|Count|Average|The total number of AppDomains unloaded since the start of the application.|Instance|


## Microsoft.Web/sites/slots

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections|Yes|Connections|Count|Average|The number of bound sockets existing in the sandbox (w3wp.exe and its child processes). A bound socket is created by calling bind()/connect() APIs and remains until said socket is closed with CloseHandle()/closesocket().|Instance|
|AverageMemoryWorkingSet|Yes|Average memory working set|Bytes|Average|The average amount of memory used by the app, in megabytes (MiB).|Instance|
|AverageResponseTime|Yes|Average Response Time (deprecated)|Seconds|Average|The average time taken for the app to serve requests, in seconds.|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|The amount of incoming bandwidth consumed by the app, in MiB.|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|The amount of outgoing bandwidth consumed by the app, in MiB.|Instance|
|CpuTime|Yes|CPU Time|Seconds|Total|The amount of CPU consumed by the app, in seconds. For more information about this metric. Not applicable to Azure Functions. Please see https://aka.ms/website-monitor-cpu-time-vs-cpu-percentage (CPU time vs CPU percentage).|Instance|
|CurrentAssemblies|Yes|Current Assemblies|Count|Average|The current number of Assemblies loaded across all AppDomains in this application.|Instance|
|FileSystemUsage|Yes|File System Usage|Bytes|Average|Percentage of filesystem quota consumed by the app.|No Dimensions|
|FunctionExecutionCount|Yes|Function Execution Count|Count|Total|Function Execution Count|Instance|
|FunctionExecutionUnits|Yes|Function Execution Units|Count|Total|Function Execution Units|Instance|
|Gen0Collections|Yes|Gen 0 Garbage Collections|Count|Total|The number of times the generation 0 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|Instance|
|Gen1Collections|Yes|Gen 1 Garbage Collections|Count|Total|The number of times the generation 1 objects are garbage collected since the start of the app process. Higher generation GCs include all lower generation GCs.|Instance|
|Gen2Collections|Yes|Gen 2 Garbage Collections|Count|Total|The number of times the generation 2 objects are garbage collected since the start of the app process.|Instance|
|Handles|Yes|Handle Count|Count|Average|The total number of handles currently open by the app process.|Instance|
|HealthCheckStatus|Yes|Health check status|Count|Average|Health check status|Instance|
|Http101|Yes|Http 101|Count|Total|The count of requests resulting in an HTTP status code 101.|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|The count of requests resulting in an HTTP status code = 200 but < 300.|Instance|
|Http3xx|Yes|Http 3xx|Count|Total|The count of requests resulting in an HTTP status code = 300 but < 400.|Instance|
|Http401|Yes|Http 401|Count|Total|The count of requests resulting in HTTP 401 status code.|Instance|
|Http403|Yes|Http 403|Count|Total|The count of requests resulting in HTTP 403 status code.|Instance|
|Http404|Yes|Http 404|Count|Total|The count of requests resulting in HTTP 404 status code.|Instance|
|Http406|Yes|Http 406|Count|Total|The count of requests resulting in HTTP 406 status code.|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|The count of requests resulting in an HTTP status code = 400 but < 500.|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|The count of requests resulting in an HTTP status code = 500 but < 600.|Instance|
|HttpResponseTime|Yes|Response Time|Seconds|Average|The time taken for the app to serve requests, in seconds.|Instance|
|IoOtherBytesPerSecond|Yes|IO Other Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is issuing bytes to I/O operations that don't involve data, such as control operations.|Instance|
|IoOtherOperationsPerSecond|Yes|IO Other Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing I/O operations that aren't read or write operations.|Instance|
|IoReadBytesPerSecond|Yes|IO Read Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is reading bytes from I/O operations.|Instance|
|IoReadOperationsPerSecond|Yes|IO Read Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing read I/O operations.|Instance|
|IoWriteBytesPerSecond|Yes|IO Write Bytes Per Second|BytesPerSecond|Total|The rate at which the app process is writing bytes to I/O operations.|Instance|
|IoWriteOperationsPerSecond|Yes|IO Write Operations Per Second|BytesPerSecond|Total|The rate at which the app process is issuing write I/O operations.|Instance|
|MemoryWorkingSet|Yes|Memory working set|Bytes|Average|The current amount of memory used by the app, in MiB.|Instance|
|PrivateBytes|Yes|Private Bytes|Bytes|Average|Private Bytes is the current size, in bytes, of memory that the app process has allocated that can't be shared with other processes.|Instance|
|Requests|Yes|Requests|Count|Total|The total number of requests regardless of their resulting HTTP status code.|Instance|
|RequestsInApplicationQueue|Yes|Requests In Application Queue|Count|Average|The number of requests in the application request queue.|Instance|
|Threads|Yes|Thread Count|Count|Average|The number of threads currently active in the app process.|Instance|
|TotalAppDomains|Yes|Total App Domains|Count|Average|The current number of AppDomains loaded in this application.|Instance|
|TotalAppDomainsUnloaded|Yes|Total App Domains Unloaded|Count|Average|The total number of AppDomains unloaded since the start of the application.|Instance|


## Microsoft.Web/staticSites

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesSent|Yes|Data Out|Bytes|Total|BytesSent|Instance|
|FunctionErrors|Yes|FunctionErrors|Count|Total|FunctionErrors|Instance|
|FunctionHits|Yes|FunctionHits|Count|Total|FunctionHits|Instance|
|SiteErrors|Yes|SiteErrors|Count|Total|SiteErrors|Instance|
|SiteHits|Yes|SiteHits|Count|Total|SiteHits|Instance|

## Next steps

- [Read about metrics in Azure Monitor](../data-platform.md)
- [Create alerts on metrics](../alerts/alerts-overview.md)
- [Export metrics to storage, Event Hub, or Log Analytics](../essentials/platform-logs-overview.md)
