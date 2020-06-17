---
title: Azure Monitor supported metrics by resource type
description: List of metrics available for each resource type with Azure Monitor.
author: rboucher
services: azure-monitor
ms.topic: reference
ms.date: 04/06/2020
ms.author: robb
ms.subservice: metrics
---
# Supported metrics with Azure Monitor

> [!NOTE]
> This list is largely auto-generated from the Azure Monitor Metrics REST API. Any modification made to this list via GitHub may be written over without warning. Contact the author of this article for details on how to make permanent updates.

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. 

This article is a complete list of all platform (that is, automatically collected) metrics currently available with Azure Monitor's consolidated metric pipeline. The list was last updated March 27th, 2020. Metrics changed or added after this date may not appear below. To query for and access the list of metrics programmatically, please use the [2018-01-01 api-version](https://docs.microsoft.com/rest/api/monitor/metricdefinitions). Other metrics not on this list may be available in the portal or using legacy APIs.

The metrics are organized by resource providers and resource type. For a list of services and the resource providers that belong to them, see [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md). 


## Guest OS Metrics

Metrics for the guest operating system (guest os) which runs in Azure Virtual Machines, Service Fabric, and Cloud Services are **NOT** listed here. Instead, guest os performance metrics must be collected through the one or more agents which run on or as part of the guest operating system.  Guest os metrics include performance counters which track guest CPU percentage or memory usage, both of which are  frequently used for auto-scaling or alerting.  Using the [Azure Diagnostics extension](diagnostics-extension-overview.md), you can send guest os performance metrics into the same database where platform metrics are stored. It routes guest os metrics through the [custom metrics](metrics-custom-overview.md) API. Then you can chart, alert and otherwise use guest os metrics like platform metrics. For more information, see [Monitoring Agents Overview](agents-overview.md).    

## Routing platform metrics to other locations

You can use [diagnostics settings](diagnostic-settings.md) to route platform metrics to Azure Storage, Azure Monitor Logs (and thus Log Analytics), and Event hubs.  

There are some limitations in what can be routed and the form in which they are stored. 
- Not all metrics are exportable to other locations. For a list of platform metrics exportable via diagnostic settings, see [this article](metrics-supported-export-diagnostic-settings.md).

- Sending multi-dimensional metrics to other locations via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
*For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.


## Microsoft.AnalysisServices/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|qpu_metric|QPU|Count|Average|QPU. Range 0-100 for S1, 0-200 for S2 and 0-400 for S4|ServerResourceType|
|memory_metric|Memory|Bytes|Average|Memory. Range 0-25 GB for S1, 0-50 GB for S2 and 0-100 GB for S4|ServerResourceType|
|private_bytes_metric|Private Bytes|Bytes|Average|Private bytes.|ServerResourceType|
|virtual_bytes_metric|Virtual Bytes|Bytes|Average|Virtual bytes.|ServerResourceType|
|TotalConnectionRequests|Total Connection Requests|Count|Average|Total connection requests. These are arrivals.|ServerResourceType|
|SuccessfullConnectionsPerSec|Successful Connections Per Sec|CountPerSecond|Average|Rate of successful connection completions.|ServerResourceType|
|TotalConnectionFailures|Total Connection Failures|Count|Average|Total failed connection attempts.|ServerResourceType|
|CurrentUserSessions|Current User Sessions|Count|Average|Current number of user sessions established.|ServerResourceType|
|QueryPoolBusyThreads|Query Pool Busy Threads|Count|Average|Number of busy threads in the query thread pool.|ServerResourceType|
|CommandPoolJobQueueLength|Command Pool Job Queue Length|Count|Average|Number of jobs in the queue of the command thread pool.|ServerResourceType|
|ProcessingPoolJobQueueLength|Processing Pool Job Queue Length|Count|Average|Number of non-I/O jobs in the queue of the processing thread pool.|ServerResourceType|
|CurrentConnections|Connection: Current connections|Count|Average|Current number of client connections established.|ServerResourceType|
|CleanerCurrentPrice|Memory: Cleaner Current Price|Count|Average|Current price of memory, $/byte/time, normalized to 1000.|ServerResourceType|
|CleanerMemoryShrinkable|Memory: Cleaner Memory shrinkable|Bytes|Average|Amount of memory, in bytes, subject to purging by the background cleaner.|ServerResourceType|
|CleanerMemoryNonshrinkable|Memory: Cleaner Memory nonshrinkable|Bytes|Average|Amount of memory, in bytes, not subject to purging by the background cleaner.|ServerResourceType|
|MemoryUsage|Memory: Memory Usage|Bytes|Average|Memory usage of the server process as used in calculating cleaner memory price. Equal to counter Process\PrivateBytes plus the size of memory-mapped data, ignoring any memory which was mapped or allocated by the xVelocity in-memory analytics engine (VertiPaq) in excess of the xVelocity engine Memory Limit.|ServerResourceType|
|MemoryLimitHard|Memory: Memory Limit Hard|Bytes|Average|Hard memory limit, from configuration file.|ServerResourceType|
|MemoryLimitHigh|Memory: Memory Limit High|Bytes|Average|High memory limit, from configuration file.|ServerResourceType|
|MemoryLimitLow|Memory: Memory Limit Low|Bytes|Average|Low memory limit, from configuration file.|ServerResourceType|
|MemoryLimitVertiPaq|Memory: Memory Limit VertiPaq|Bytes|Average|In-memory limit, from configuration file.|ServerResourceType|
|Quota|Memory: Quota|Bytes|Average|Current memory quota, in bytes. Memory quota is also known as a memory grant or memory reservation.|ServerResourceType|
|QuotaBlocked|Memory: Quota Blocked|Count|Average|Current number of quota requests that are blocked until other memory quotas are freed.|ServerResourceType|
|VertiPaqNonpaged|Memory: VertiPaq Nonpaged|Bytes|Average|Bytes of memory locked in the working set for use by the in-memory engine.|ServerResourceType|
|VertiPaqPaged|Memory: VertiPaq Paged|Bytes|Average|Bytes of paged memory in use for in-memory data.|ServerResourceType|
|RowsReadPerSec|Processing: Rows read per sec|CountPerSecond|Average|Rate of rows read from all relational databases.|ServerResourceType|
|RowsConvertedPerSec|Processing: Rows converted per sec|CountPerSecond|Average|Rate of rows converted during processing.|ServerResourceType|
|RowsWrittenPerSec|Processing: Rows written per sec|CountPerSecond|Average|Rate of rows written during processing.|ServerResourceType|
|CommandPoolBusyThreads|Threads: Command pool busy threads|Count|Average|Number of busy threads in the command thread pool.|ServerResourceType|
|CommandPoolIdleThreads|Threads: Command pool idle threads|Count|Average|Number of idle threads in the command thread pool.|ServerResourceType|
|LongParsingBusyThreads|Threads: Long parsing busy threads|Count|Average|Number of busy threads in the long parsing thread pool.|ServerResourceType|
|LongParsingIdleThreads|Threads: Long parsing idle threads|Count|Average|Number of idle threads in the long parsing thread pool.|ServerResourceType|
|LongParsingJobQueueLength|Threads: Long parsing job queue length|Count|Average|Number of jobs in the queue of the long parsing thread pool.|ServerResourceType|
|ProcessingPoolBusyIOJobThreads|Threads: Processing pool busy I/O job threads|Count|Average|Number of threads running I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolBusyNonIOThreads|Threads: Processing pool busy non-I/O threads|Count|Average|Number of threads running non-I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolIOJobQueueLength|Threads: Processing pool I/O job queue length|Count|Average|Number of I/O jobs in the queue of the processing thread pool.|ServerResourceType|
|ProcessingPoolIdleIOJobThreads|Threads: Processing pool idle I/O job threads|Count|Average|Number of idle threads for I/O jobs in the processing thread pool.|ServerResourceType|
|ProcessingPoolIdleNonIOThreads|Threads: Processing pool idle non-I/O threads|Count|Average|Number of idle threads in the processing thread pool dedicated to non-I/O jobs.|ServerResourceType|
|QueryPoolIdleThreads|Threads: Query pool idle threads|Count|Average|Number of idle threads for I/O jobs in the processing thread pool.|ServerResourceType|
|QueryPoolJobQueueLength|Threads: Query pool job queue lengt|Count|Average|Number of jobs in the queue of the query thread pool.|ServerResourceType|
|ShortParsingBusyThreads|Threads: Short parsing busy threads|Count|Average|Number of busy threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingIdleThreads|Threads: Short parsing idle threads|Count|Average|Number of idle threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingJobQueueLength|Threads: Short parsing job queue length|Count|Average|Number of jobs in the queue of the short parsing thread pool.|ServerResourceType|
|memory_thrashing_metric|Memory Thrashing|Percent|Average|Average memory thrashing.|ServerResourceType|
|mashup_engine_qpu_metric|M Engine QPU|Count|Average|QPU usage by mashup engine processes|ServerResourceType|
|mashup_engine_memory_metric|M Engine Memory|Bytes|Average|Memory usage by mashup engine processes|ServerResourceType|
|mashup_engine_private_bytes_metric|M Engine Private Bytes|Bytes|Average|Private bytes usage by mashup engine processes.|ServerResourceType|
|mashup_engine_virtual_bytes_metric|M Engine Virtual Bytes|Bytes|Average|Virtual bytes usage by mashup engine processes.|ServerResourceType|


## Microsoft.ApiManagement/service

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalRequests|Total Gateway Requests (Deprecated)|Count|Total|Number of gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location,Hostname|
|SuccessfulRequests|Successful Gateway Requests (Deprecated)|Count|Total|Number of successful gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location,Hostname|
|UnauthorizedRequests|Unauthorized Gateway Requests (Deprecated)|Count|Total|Number of unauthorized gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location,Hostname|
|FailedRequests|Failed Gateway Requests (Deprecated)|Count|Total|Number of failures in gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location,Hostname|
|OtherRequests|Other Gateway Requests (Deprecated)|Count|Total|Number of other gateway requests - Use multi-dimension request metric with GatewayResponseCodeCategory dimension instead|Location,Hostname|
|Duration|Overall Duration of Gateway Requests|Milliseconds|Average|Overall Duration of Gateway Requests in milliseconds|Location,Hostname|
|BackendDuration|Duration of Backend Requests|Milliseconds|Average|Duration of Backend Requests in milliseconds|Location,Hostname|
|Capacity|Capacity|Percent|Average|Utilization metric for ApiManagement service|Location|
|EventHubTotalEvents|Total EventHub Events|Count|Total|Number of events sent to EventHub|Location|
|EventHubSuccessfulEvents|Successful EventHub Events|Count|Total|Number of successful EventHub events|Location|
|EventHubTotalFailedEvents|Failed EventHub Events|Count|Total|Number of failed EventHub events|Location|
|EventHubRejectedEvents|Rejected EventHub Events|Count|Total|Number of rejected EventHub events (wrong configuration or unauthorized)|Location|
|EventHubThrottledEvents|Throttled EventHub Events|Count|Total|Number of throttled EventHub events|Location|
|EventHubTimedoutEvents|Timed Out EventHub Events|Count|Total|Number of timed out EventHub events|Location|
|EventHubDroppedEvents|Dropped EventHub Events|Count|Total|Number of events skipped because of queue size limit reached|Location|
|EventHubTotalBytesSent|Size of EventHub Events|Bytes|Total|Total size of EventHub events in bytes|Location|
|Requests|Requests|Count|Total|Gateway request metrics with multiple dimensions|Location,Hostname,LastErrorReason,BackendResponseCode,GatewayResponseCode,BackendResponseCodeCategory,GatewayResponseCodeCategory|
|NetworkConnectivity|Network Connectivity Status of Resources (Preview)|Count|Total|Network Connectivity status of dependent resource types from API Management service|Location,ResourceType|


## Microsoft.AppConfiguration/configurationStores

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|HttpIncomingRequestCount|HttpIncomingRequestCount|Count|Count|Total number of incoming http requests.|StatusCode|
|HttpIncomingRequestDuration|HttpIncomingRequestDuration|Count|Average|Latency on an http request.|StatusCode|


## Microsoft.AppPlatform/Spring

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SystemCpuUsagePercentage|System CPU Usage Percentage|Percent|Average|The recent cpu usage for the whole system|AppName,Pod|
|AppCpuUsagePercentage|App CPU Usage Percentage|Percent|Average|App JVM CPU Usage Percentage|AppName,Pod|
|AppMemoryCommitted|App Memory Assigned|Bytes|Average|Memory assigned to JVM in bytes|AppName,Pod|
|AppMemoryUsed|App Memory Used|Bytes|Average|App Memory Used in bytes|AppName,Pod|
|AppMemoryMax|App Memory Max|Bytes|Maximum|The maximum amount of memory in bytes that can be used for memory management|AppName,Pod|
|MaxOldGenMemoryPoolBytes|Max Available Old Generation Data Size|Bytes|Average|Max size of old generation memory pool|AppName,Pod|
|OldGenMemoryPoolBytes|Old Generation Data Size|Bytes|Average|Size of old generation memory pool after a full GC|AppName,Pod|
|OldGenPromotedBytes|Promote to Old Generation Data Size|Bytes|Maximum|Count of positive increases in the size of the old generation memory pool before GC to after GC|AppName,Pod|
|YoungGenPromotedBytes|Promote to Young Generation Data Size|Bytes|Maximum|Incremented for an increase in the size of the young generation memory pool after one GC to before the next|AppName,Pod|
|GCPauseTotalCount|GC Pause Count|Count|Total|GC Pause Count|AppName,Pod|
|GCPauseTotalTime|GC Pause Total Time|Milliseconds|Total|GC Pause Total Time|AppName,Pod|
|TomcatSentBytes|Tomcat Total Sent Bytes|Bytes|Total|Tomcat Total Sent Bytes|AppName,Pod|
|TomcatReceivedBytes|Tomcat Total Received Bytes|Bytes|Total|Tomcat Total Received Bytes|AppName,Pod|
|TomcatRequestTotalTime|Tomcat Request Total Times|Milliseconds|Total|Tomcat Request Total Times|AppName,Pod|
|TomcatRequestTotalCount|Tomcat Request Total Count|Count|Total|Tomcat Request Total Count|AppName,Pod|
|TomcatResponseAvgTime|Tomcat Request Average Time|Milliseconds|Average|Tomcat Request Average Time|AppName,Pod|
|TomcatRequestMaxTime|Tomcat Request Max Time|Milliseconds|Maximum|Tomcat Request Max Time|AppName,Pod|
|TomcatErrorCount|Tomcat Global Error|Count|Total|Tomcat Global Error|AppName,Pod|
|TomcatSessionActiveMaxCount|Tomcat Session Max Active Count|Count|Total|Tomcat Session Max Active Count|AppName,Pod|
|TomcatSessionAliveMaxTime|Tomcat Session Max Alive Time|Milliseconds|Maximum|Tomcat Session Max Alive Time|AppName,Pod|
|TomcatSessionActiveCurrentCount|Tomcat Session Alive Count|Count|Total|Tomcat Session Alive Count|AppName,Pod|
|TomcatSessionCreatedCount|Tomcat Session Created Count|Count|Total|Tomcat Session Created Count|AppName,Pod|
|TomcatSessionExpiredCount|Tomcat Session Expired Count|Count|Total|Tomcat Session Expired Count|AppName,Pod|
|TomcatSessionRejectedCount|Tomcat Session Rejected Count|Count|Total|Tomcat Session Rejected Count|AppName,Pod|


## Microsoft.Automation/automationAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalJob|Total Jobs|Count|Total|The total number of jobs|Runbook,Status|
|TotalUpdateDeploymentRuns|Total Update Deployment Runs|Count|Total|Total software update deployment runs|SoftwareUpdateConfigurationName,Status|
|TotalUpdateDeploymentMachineRuns|Total Update Deployment Machine Runs|Count|Total|Total software update deployment machine runs in a software update deployment run|SoftwareUpdateConfigurationName,Status,TargetComputer,SoftwareUpdateConfigurationRunId|


## Microsoft.Batch/batchAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CoreCount|Dedicated Core Count|Count|Total|Total number of dedicated cores in the batch account|None|
|TotalNodeCount|Dedicated Node Count|Count|Total|Total number of dedicated nodes in the batch account|None|
|LowPriorityCoreCount|LowPriority Core Count|Count|Total|Total number of low-priority cores in the batch account|None|
|TotalLowPriorityNodeCount|Low-Priority Node Count|Count|Total|Total number of low-priority nodes in the batch account|None|
|CreatingNodeCount|Creating Node Count|Count|Total|Number of nodes being created|None|
|StartingNodeCount|Starting Node Count|Count|Total|Number of nodes starting|None|
|WaitingForStartTaskNodeCount|Waiting For Start Task Node Count|Count|Total|Number of nodes waiting for the Start Task to complete|None|
|StartTaskFailedNodeCount|Start Task Failed Node Count|Count|Total|Number of nodes where the Start Task has failed|None|
|IdleNodeCount|Idle Node Count|Count|Total|Number of idle nodes|None|
|OfflineNodeCount|Offline Node Count|Count|Total|Number of offline nodes|None|
|RebootingNodeCount|Rebooting Node Count|Count|Total|Number of rebooting nodes|None|
|ReimagingNodeCount|Reimaging Node Count|Count|Total|Number of reimaging nodes|None|
|RunningNodeCount|Running Node Count|Count|Total|Number of running nodes|None|
|LeavingPoolNodeCount|Leaving Pool Node Count|Count|Total|Number of nodes leaving the Pool|None|
|UnusableNodeCount|Unusable Node Count|Count|Total|Number of unusable nodes|None|
|PreemptedNodeCount|Preempted Node Count|Count|Total|Number of preempted nodes|None|
|TaskStartEvent|Task Start Events|Count|Total|Total number of tasks that have started|poolId,jobId|
|TaskCompleteEvent|Task Complete Events|Count|Total|Total number of tasks that have completed|poolId,jobId|
|TaskFailEvent|Task Fail Events|Count|Total|Total number of tasks that have completed in a failed state|poolId,jobId|
|PoolCreateEvent|Pool Create Events|Count|Total|Total number of pools that have been created|poolId|
|PoolResizeStartEvent|Pool Resize Start Events|Count|Total|Total number of pool resizes that have started|poolId|
|PoolResizeCompleteEvent|Pool Resize Complete Events|Count|Total|Total number of pool resizes that have completed|poolId|
|PoolDeleteStartEvent|Pool Delete Start Events|Count|Total|Total number of pool deletes that have started|poolId|
|PoolDeleteCompleteEvent|Pool Delete Complete Events|Count|Total|Total number of pool deletes that have completed|poolId|
|JobDeleteCompleteEvent|Job Delete Complete Events|Count|Total|Total number of jobs that have been successfully deleted.|jobId|
|JobDeleteStartEvent|Job Delete Start Events|Count|Total|Total number of jobs that have been requested to be deleted.|jobId|
|JobDisableCompleteEvent|Job Disable Complete Events|Count|Total|Total number of jobs that have been successfully disabled.|jobId|
|JobDisableStartEvent|Job Disable Start Events|Count|Total|Total number of jobs that have been requested to be disabled.|jobId|
|JobStartEvent|Job Start Events|Count|Total|Total number of jobs that have been successfully started.|jobId|
|JobTerminateCompleteEvent|Job Terminate Complete Events|Count|Total|Total number of jobs that have been successfully terminated.|jobId|
|JobTerminateStartEvent|Job Terminate Start Events|Count|Total|Total number of jobs that have been requested to be terminated.|jobId|


## Microsoft.BatchAI/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Job Submitted|Job Submitted|Count|Total|Number of jobs submitted|Scenario,ClusterName|
|Job Completed|Job Completed|Count|Total|Number of jobs completed|Scenario,ClusterName,ResultType|
|Total Nodes|Total Nodes|Count|Average|Number of total nodes|Scenario,ClusterName|
|Active Nodes|Active Nodes|Count|Average|Number of running nodes|Scenario,ClusterName|
|Idle Nodes|Idle Nodes|Count|Average|Number of idle nodes|Scenario,ClusterName|
|Unusable Nodes|Unusable Nodes|Count|Average|Number of unusable nodes|Scenario,ClusterName|
|Preempted Nodes|Preempted Nodes|Count|Average|Number of preempted nodes|Scenario,ClusterName|
|Leaving Nodes|Leaving Nodes|Count|Average|Number of leaving nodes|Scenario,ClusterName|
|Total Cores|Total Cores|Count|Average|Number of total cores|Scenario,ClusterName|
|Active Cores|Active Cores|Count|Average|Number of active cores|Scenario,ClusterName|
|Idle Cores|Idle Cores|Count|Average|Number of idle cores|Scenario,ClusterName|
|Unusable Cores|Unusable Cores|Count|Average|Number of unusable cores|Scenario,ClusterName|
|Preempted Cores|Preempted Cores|Count|Average|Number of preempted cores|Scenario,ClusterName|
|Leaving Cores|Leaving Cores|Count|Average|Number of leaving cores|Scenario,ClusterName|
|Quota Utilization Percentage|Quota Utilization Percentage|Count|Average|Percent of quota utilized|Scenario,ClusterName,VmFamilyName,VmPriority|

## Microsoft.Blockchain/blockchainMembers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuUsagePercentageInDouble|CPU Usage Percentage|Percent|Maximum|CPU Usage Percentage|Node|
|MemoryUsage|Memory Usage|Bytes|Average|Memory Usage|Node|
|MemoryLimit|Memory Limit|Bytes|Average|Memory Limit|Node|
|MemoryUsagePercentageInDouble|Memory Usage Percentage|Percent|Average|Memory Usage Percentage|Node|
|StorageUsage|Storage Usage|Bytes|Average|Storage Usage|Node|
|IOReadBytes|IO Read Bytes|Bytes|Total|IO Read Bytes|Node|
|IOWriteBytes|IO Write Bytes|Bytes|Total|IO Write Bytes|Node|
|ConnectionAccepted|Accepted Connections|Count|Total|Accepted Connections|Node|
|ConnectionHandled|Handled Connections|Count|Total|Handled Connections|Node|
|ConnectionActive|Active Connections|Count|Average|Active Connections|Node|
|RequestHandled|Handled Requests|Count|Total|Handled Requests|Node|
|ProcessedBlocks|Processed Blocks|Count|Total|Processed Blocks|Node|
|ProcessedTransactions|Processed Transactions|Count|Total|Processed Transactions|Node|
|PendingTransactions|Pending Transactions|Count|Average|Pending Transactions|Node|
|QueuedTransactions|Queued Transactions|Count|Average|Queued Transactions|Node|



## Microsoft.Cache/redis

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|connectedclients|Connected Clients|Count|Maximum||ShardId|
|totalcommandsprocessed|Total Operations|Count|Total||ShardId|
|cachehits|Cache Hits|Count|Total||ShardId|
|cachemisses|Cache Misses|Count|Total||ShardId|
|cachemissrate|Cache Miss Rate|Percent|cachemissrate||ShardId|
|getcommands|Gets|Count|Total||ShardId|
|setcommands|Sets|Count|Total||ShardId|
|operationsPerSecond|Operations Per Second|Count|Maximum||ShardId|
|evictedkeys|Evicted Keys|Count|Total||ShardId|
|totalkeys|Total Keys|Count|Maximum||ShardId|
|expiredkeys|Expired Keys|Count|Total||ShardId|
|usedmemory|Used Memory|Bytes|Maximum||ShardId|
|usedmemorypercentage|Used Memory Percentage|Percent|Maximum||ShardId|
|usedmemoryRss|Used Memory RSS|Bytes|Maximum||ShardId|
|serverLoad|Server Load|Percent|Maximum||ShardId|
|cacheWrite|Cache Write|BytesPerSecond|Maximum||ShardId|
|cacheRead|Cache Read|BytesPerSecond|Maximum||ShardId|
|percentProcessorTime|CPU|Percent|Maximum||ShardId|
|cacheLatency|Cache Latency Microseconds (Preview)|Count|Average||ShardId|
|errors|Errors|Count|Maximum||ShardId,ErrorType|
|connectedclients0|Connected Clients (Shard 0)|Count|Maximum||None|
|totalcommandsprocessed0|Total Operations (Shard 0)|Count|Total||None|
|cachehits0|Cache Hits (Shard 0)|Count|Total||None|
|cachemisses0|Cache Misses (Shard 0)|Count|Total||None|
|getcommands0|Gets (Shard 0)|Count|Total||None|
|setcommands0|Sets (Shard 0)|Count|Total||None|
|operationsPerSecond0|Operations Per Second (Shard 0)|Count|Maximum||None|
|evictedkeys0|Evicted Keys (Shard 0)|Count|Total||None|
|totalkeys0|Total Keys (Shard 0)|Count|Maximum||None|
|expiredkeys0|Expired Keys (Shard 0)|Count|Total||None|
|usedmemory0|Used Memory (Shard 0)|Bytes|Maximum||None|
|usedmemoryRss0|Used Memory RSS (Shard 0)|Bytes|Maximum||None|
|serverLoad0|Server Load (Shard 0)|Percent|Maximum||None|
|cacheWrite0|Cache Write (Shard 0)|BytesPerSecond|Maximum||None|
|cacheRead0|Cache Read (Shard 0)|BytesPerSecond|Maximum||None|
|percentProcessorTime0|CPU (Shard 0)|Percent|Maximum||None|
|connectedclients1|Connected Clients (Shard 1)|Count|Maximum||None|
|totalcommandsprocessed1|Total Operations (Shard 1)|Count|Total||None|
|cachehits1|Cache Hits (Shard 1)|Count|Total||None|
|cachemisses1|Cache Misses (Shard 1)|Count|Total||None|
|getcommands1|Gets (Shard 1)|Count|Total||None|
|setcommands1|Sets (Shard 1)|Count|Total||None|
|operationsPerSecond1|Operations Per Second (Shard 1)|Count|Maximum||None|
|evictedkeys1|Evicted Keys (Shard 1)|Count|Total||None|
|totalkeys1|Total Keys (Shard 1)|Count|Maximum||None|
|expiredkeys1|Expired Keys (Shard 1)|Count|Total||None|
|usedmemory1|Used Memory (Shard 1)|Bytes|Maximum||None|
|usedmemoryRss1|Used Memory RSS (Shard 1)|Bytes|Maximum||None|
|serverLoad1|Server Load (Shard 1)|Percent|Maximum||None|
|cacheWrite1|Cache Write (Shard 1)|BytesPerSecond|Maximum||None|
|cacheRead1|Cache Read (Shard 1)|BytesPerSecond|Maximum||None|
|percentProcessorTime1|CPU (Shard 1)|Percent|Maximum||None|
|connectedclients2|Connected Clients (Shard 2)|Count|Maximum||None|
|totalcommandsprocessed2|Total Operations (Shard 2)|Count|Total||None|
|cachehits2|Cache Hits (Shard 2)|Count|Total||None|
|cachemisses2|Cache Misses (Shard 2)|Count|Total||None|
|getcommands2|Gets (Shard 2)|Count|Total||None|
|setcommands2|Sets (Shard 2)|Count|Total||None|
|operationsPerSecond2|Operations Per Second (Shard 2)|Count|Maximum||None|
|evictedkeys2|Evicted Keys (Shard 2)|Count|Total||None|
|totalkeys2|Total Keys (Shard 2)|Count|Maximum||None|
|expiredkeys2|Expired Keys (Shard 2)|Count|Total||None|
|usedmemory2|Used Memory (Shard 2)|Bytes|Maximum||None|
|usedmemoryRss2|Used Memory RSS (Shard 2)|Bytes|Maximum||None|
|serverLoad2|Server Load (Shard 2)|Percent|Maximum||None|
|cacheWrite2|Cache Write (Shard 2)|BytesPerSecond|Maximum||None|
|cacheRead2|Cache Read (Shard 2)|BytesPerSecond|Maximum||None|
|percentProcessorTime2|CPU (Shard 2)|Percent|Maximum||None|
|connectedclients3|Connected Clients (Shard 3)|Count|Maximum||None|
|totalcommandsprocessed3|Total Operations (Shard 3)|Count|Total||None|
|cachehits3|Cache Hits (Shard 3)|Count|Total||None|
|cachemisses3|Cache Misses (Shard 3)|Count|Total||None|
|getcommands3|Gets (Shard 3)|Count|Total||None|
|setcommands3|Sets (Shard 3)|Count|Total||None|
|operationsPerSecond3|Operations Per Second (Shard 3)|Count|Maximum||None|
|evictedkeys3|Evicted Keys (Shard 3)|Count|Total||None|
|totalkeys3|Total Keys (Shard 3)|Count|Maximum||None|
|expiredkeys3|Expired Keys (Shard 3)|Count|Total||None|
|usedmemory3|Used Memory (Shard 3)|Bytes|Maximum||None|
|usedmemoryRss3|Used Memory RSS (Shard 3)|Bytes|Maximum||None|
|serverLoad3|Server Load (Shard 3)|Percent|Maximum||None|
|cacheWrite3|Cache Write (Shard 3)|BytesPerSecond|Maximum||None|
|cacheRead3|Cache Read (Shard 3)|BytesPerSecond|Maximum||None|
|percentProcessorTime3|CPU (Shard 3)|Percent|Maximum||None|
|connectedclients4|Connected Clients (Shard 4)|Count|Maximum||None|
|totalcommandsprocessed4|Total Operations (Shard 4)|Count|Total||None|
|cachehits4|Cache Hits (Shard 4)|Count|Total||None|
|cachemisses4|Cache Misses (Shard 4)|Count|Total||None|
|getcommands4|Gets (Shard 4)|Count|Total||None|
|setcommands4|Sets (Shard 4)|Count|Total||None|
|operationsPerSecond4|Operations Per Second (Shard 4)|Count|Maximum||None|
|evictedkeys4|Evicted Keys (Shard 4)|Count|Total||None|
|totalkeys4|Total Keys (Shard 4)|Count|Maximum||None|
|expiredkeys4|Expired Keys (Shard 4)|Count|Total||None|
|usedmemory4|Used Memory (Shard 4)|Bytes|Maximum||None|
|usedmemoryRss4|Used Memory RSS (Shard 4)|Bytes|Maximum||None|
|serverLoad4|Server Load (Shard 4)|Percent|Maximum||None|
|cacheWrite4|Cache Write (Shard 4)|BytesPerSecond|Maximum||None|
|cacheRead4|Cache Read (Shard 4)|BytesPerSecond|Maximum||None|
|percentProcessorTime4|CPU (Shard 4)|Percent|Maximum||None|
|connectedclients5|Connected Clients (Shard 5)|Count|Maximum||None|
|totalcommandsprocessed5|Total Operations (Shard 5)|Count|Total||None|
|cachehits5|Cache Hits (Shard 5)|Count|Total||None|
|cachemisses5|Cache Misses (Shard 5)|Count|Total||None|
|getcommands5|Gets (Shard 5)|Count|Total||None|
|setcommands5|Sets (Shard 5)|Count|Total||None|
|operationsPerSecond5|Operations Per Second (Shard 5)|Count|Maximum||None|
|evictedkeys5|Evicted Keys (Shard 5)|Count|Total||None|
|totalkeys5|Total Keys (Shard 5)|Count|Maximum||None|
|expiredkeys5|Expired Keys (Shard 5)|Count|Total||None|
|usedmemory5|Used Memory (Shard 5)|Bytes|Maximum||None|
|usedmemoryRss5|Used Memory RSS (Shard 5)|Bytes|Maximum||None|
|serverLoad5|Server Load (Shard 5)|Percent|Maximum||None|
|cacheWrite5|Cache Write (Shard 5)|BytesPerSecond|Maximum||None|
|cacheRead5|Cache Read (Shard 5)|BytesPerSecond|Maximum||None|
|percentProcessorTime5|CPU (Shard 5)|Percent|Maximum||None|
|connectedclients6|Connected Clients (Shard 6)|Count|Maximum||None|
|totalcommandsprocessed6|Total Operations (Shard 6)|Count|Total||None|
|cachehits6|Cache Hits (Shard 6)|Count|Total||None|
|cachemisses6|Cache Misses (Shard 6)|Count|Total||None|
|getcommands6|Gets (Shard 6)|Count|Total||None|
|setcommands6|Sets (Shard 6)|Count|Total||None|
|operationsPerSecond6|Operations Per Second (Shard 6)|Count|Maximum||None|
|evictedkeys6|Evicted Keys (Shard 6)|Count|Total||None|
|totalkeys6|Total Keys (Shard 6)|Count|Maximum||None|
|expiredkeys6|Expired Keys (Shard 6)|Count|Total||None|
|usedmemory6|Used Memory (Shard 6)|Bytes|Maximum||None|
|usedmemoryRss6|Used Memory RSS (Shard 6)|Bytes|Maximum||None|
|serverLoad6|Server Load (Shard 6)|Percent|Maximum||None|
|cacheWrite6|Cache Write (Shard 6)|BytesPerSecond|Maximum||None|
|cacheRead6|Cache Read (Shard 6)|BytesPerSecond|Maximum||None|
|percentProcessorTime6|CPU (Shard 6)|Percent|Maximum||None|
|connectedclients7|Connected Clients (Shard 7)|Count|Maximum||None|
|totalcommandsprocessed7|Total Operations (Shard 7)|Count|Total||None|
|cachehits7|Cache Hits (Shard 7)|Count|Total||None|
|cachemisses7|Cache Misses (Shard 7)|Count|Total||None|
|getcommands7|Gets (Shard 7)|Count|Total||None|
|setcommands7|Sets (Shard 7)|Count|Total||None|
|operationsPerSecond7|Operations Per Second (Shard 7)|Count|Maximum||None|
|evictedkeys7|Evicted Keys (Shard 7)|Count|Total||None|
|totalkeys7|Total Keys (Shard 7)|Count|Maximum||None|
|expiredkeys7|Expired Keys (Shard 7)|Count|Total||None|
|usedmemory7|Used Memory (Shard 7)|Bytes|Maximum||None|
|usedmemoryRss7|Used Memory RSS (Shard 7)|Bytes|Maximum||None|
|serverLoad7|Server Load (Shard 7)|Percent|Maximum||None|
|cacheWrite7|Cache Write (Shard 7)|BytesPerSecond|Maximum||None|
|cacheRead7|Cache Read (Shard 7)|BytesPerSecond|Maximum||None|
|percentProcessorTime7|CPU (Shard 7)|Percent|Maximum||None|
|connectedclients8|Connected Clients (Shard 8)|Count|Maximum||None|
|totalcommandsprocessed8|Total Operations (Shard 8)|Count|Total||None|
|cachehits8|Cache Hits (Shard 8)|Count|Total||None|
|cachemisses8|Cache Misses (Shard 8)|Count|Total||None|
|getcommands8|Gets (Shard 8)|Count|Total||None|
|setcommands8|Sets (Shard 8)|Count|Total||None|
|operationsPerSecond8|Operations Per Second (Shard 8)|Count|Maximum||None|
|evictedkeys8|Evicted Keys (Shard 8)|Count|Total||None|
|totalkeys8|Total Keys (Shard 8)|Count|Maximum||None|
|expiredkeys8|Expired Keys (Shard 8)|Count|Total||None|
|usedmemory8|Used Memory (Shard 8)|Bytes|Maximum||None|
|usedmemoryRss8|Used Memory RSS (Shard 8)|Bytes|Maximum||None|
|serverLoad8|Server Load (Shard 8)|Percent|Maximum||None|
|cacheWrite8|Cache Write (Shard 8)|BytesPerSecond|Maximum||None|
|cacheRead8|Cache Read (Shard 8)|BytesPerSecond|Maximum||None|
|percentProcessorTime8|CPU (Shard 8)|Percent|Maximum||None|
|connectedclients9|Connected Clients (Shard 9)|Count|Maximum||None|
|totalcommandsprocessed9|Total Operations (Shard 9)|Count|Total||None|
|cachehits9|Cache Hits (Shard 9)|Count|Total||None|
|cachemisses9|Cache Misses (Shard 9)|Count|Total||None|
|getcommands9|Gets (Shard 9)|Count|Total||None|
|setcommands9|Sets (Shard 9)|Count|Total||None|
|operationsPerSecond9|Operations Per Second (Shard 9)|Count|Maximum||None|
|evictedkeys9|Evicted Keys (Shard 9)|Count|Total||None|
|totalkeys9|Total Keys (Shard 9)|Count|Maximum||None|
|expiredkeys9|Expired Keys (Shard 9)|Count|Total||None|
|usedmemory9|Used Memory (Shard 9)|Bytes|Maximum||None|
|usedmemoryRss9|Used Memory RSS (Shard 9)|Bytes|Maximum||None|
|serverLoad9|Server Load (Shard 9)|Percent|Maximum||None|
|cacheWrite9|Cache Write (Shard 9)|BytesPerSecond|Maximum||None|
|cacheRead9|Cache Read (Shard 9)|BytesPerSecond|Maximum||None|
|percentProcessorTime9|CPU (Shard 9)|Percent|Maximum||None|




## Microsoft.Cdn/cdnwebapplicationfirewallpolicies

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|WebApplicationFirewallRequestCount|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName,RuleName,Action|


## Microsoft.ClassicCompute/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s).|None|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic).|None|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic).|None|
|Disk Read Bytes/Sec|Disk Read|BytesPerSecond|Average|Average bytes read from disk during monitoring period.|None|
|Disk Write Bytes/Sec|Disk Write|BytesPerSecond|Average|Average bytes written to disk during monitoring period.|None|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS.|None|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS.|None|


## Microsoft.ClassicCompute/domainNames/slots/roles

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s).|RoleInstanceId|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic).|RoleInstanceId|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic).|RoleInstanceId|
|Disk Read Bytes/Sec|Disk Read|BytesPerSecond|Average|Average bytes read from disk during monitoring period.|RoleInstanceId|
|Disk Write Bytes/Sec|Disk Write|BytesPerSecond|Average|Average bytes written to disk during monitoring period.|RoleInstanceId|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS.|RoleInstanceId|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS.|RoleInstanceId|



## Microsoft.ClassicStorage/storageAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|UsedCapacity|Used capacity|Bytes|Average|Account used capacity|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.ClassicStorage/storageAccounts/blobServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BlobCapacity|Blob Capacity|Bytes|Average|The amount of storage used by the storage account's Blob service in bytes.|BlobType,Tier|
|BlobCount|Blob Count|Count|Average|The number of Blob in the storage account's Blob service.|BlobType,Tier|
|ContainerCount|Blob Container Count|Count|Average|The number of containers in the storage account's Blob service.|None|
|IndexCapacity|Index Capacity|Bytes|Average|The amount of storage used by ADLS Gen2 (Hierarchical) Index in bytes.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.ClassicStorage/storageAccounts/tableServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TableCapacity|Table Capacity|Bytes|Average|The amount of storage used by the storage account's Table service in bytes.|None|
|TableCount|Table Count|Count|Average|The number of table in the storage account's Table service.|None|
|TableEntityCount|Table Entity Count|Count|Average|The number of table entities in the storage account's Table service.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.ClassicStorage/storageAccounts/fileServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|FileCapacity|File Capacity|Bytes|Average|The amount of storage used by the storage account's File service in bytes.|FileShare|
|FileCount|File Count|Count|Average|The number of file in the storage account's File service.|FileShare|
|FileShareCount|File Share Count|Count|Average|The number of file shares in the storage account's File service.|None|
|FileShareSnapshotCount|File Share Snapshot Count|Count|Average|The number of snapshots present on the share in storage account's Files Service.|FileShare|
|FileShareSnapshotSize|File Share Snapshot Size|Bytes|Average|The amount of storage used by the snapshots in storage account's File service in bytes.|FileShare|
|FileShareQuota|File share quota size|Bytes|Average|The upper limit on the amount of storage that can be used by Azure Files Service in bytes.|FileShare|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication,FileShare|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication,FileShare|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication,FileShare|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType,ApiName,Authentication,FileShare|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication,FileShare|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication,FileShare|

## Microsoft.ClassicStorage/storageAccounts/queueServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueueCapacity|Queue Capacity|Bytes|Average|The amount of storage used by the storage account's Queue service in bytes.|None|
|QueueCount|Queue Count|Count|Average|The number of queue in the storage account's Queue service.|None|
|QueueMessageCount|Queue Message Count|Count|Average|The approximate number of queue messages in the storage account's Queue service.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in SuccessE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|


## Microsoft.CognitiveServices/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalCalls|Total Calls|Count|Total|Total number of calls.|ApiName,OperationName,Region|
|SuccessfulCalls|Successful Calls|Count|Total|Number of successful calls.|ApiName,OperationName,Region|
|TotalErrors|Total Errors|Count|Total|Total number of calls with error response (HTTP response code 4xx or 5xx).|ApiName,OperationName,Region|
|BlockedCalls|Blocked Calls|Count|Total|Number of calls that exceeded rate or quota limit.|ApiName,OperationName,Region|
|ServerErrors|Server Errors|Count|Total|Number of calls with service internal error (HTTP response code 5xx).|ApiName,OperationName,Region|
|ClientErrors|Client Errors|Count|Total|Number of calls with client side error (HTTP response code 4xx).|ApiName,OperationName,Region|
|DataIn|Data In|Bytes|Total|Size of incoming data in bytes.|ApiName,OperationName,Region|
|DataOut|Data Out|Bytes|Total|Size of outgoing data in bytes.|ApiName,OperationName,Region|
|Latency|Latency|MilliSeconds|Average|Latency in milliseconds.|ApiName,OperationName,Region|
|TotalTokenCalls|Total Token Calls|Count|Total|Total number of token calls.|ApiName,OperationName,Region|
|CharactersTranslated|Characters Translated|Count|Total|Total number of characters in incoming text request.|ApiName,OperationName,Region|
|CharactersTrained|Characters Trained|Count|Total|Total number of characters trained.|ApiName,OperationName,Region|
|SpeechSessionDuration|Speech Session Duration|Seconds|Total|Total duration of speech session in seconds.|ApiName,OperationName,Region|
|TotalTransactions|Total Transactions|Count|Total|Total number of transactions.|None|
|ProcessedImages|Processed Images|Count|Total| Number of Transactions for image processing.|ApiName,FeatureName,Channel,Region|

## Microsoft.Compute/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|None|
|Network In|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|None|
|Network Out|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|None|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|None|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|None|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|None|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|None|
|CPU Credits Remaining|CPU Credits Remaining|Count|Average|Total number of credits available to burst|None|
|CPU Credits Consumed|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|None|
|Per Disk Read Bytes/sec|Data Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Data Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Data Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Data Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Per Disk QD|Data Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)](portal-disk-metrics-deprecation.md)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|OS Per Disk Read Bytes/sec|OS Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Bytes/sec|OS Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|None|
|OS Per Disk Read Operations/Sec|OS Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Operations/Sec|OS Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk QD|OS Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)|Count|Average|OS Disk Queue Depth(or Queue Length)|None|
|Data Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
|Data Disk Queue Depth|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|OS Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|None|
|OS Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|None|
|OS Disk Read Operations/Sec|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|None|
|OS Disk Write Operations/Sec|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|None|
|OS Disk Queue Depth|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|None|
|Inbound Flows|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|None|
|Outbound Flows|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|None|
|Inbound Flows Maximum Creation Rate|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|None|
|Outbound Flows Maximum Creation Rate|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|None|
|Premium Data Disk Cache Read Hit|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|None|
|Premium OS Disk Cache Read Miss|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|None|
|Network In Total|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|None|
|Network Out Total|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|None|


## Microsoft.Compute/virtualMachineScaleSets

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|VMName|
|Network In|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|VMName|
|Network Out|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|VMName|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|VMName|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|VMName|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|VMName|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|VMName|
|CPU Credits Remaining|CPU Credits Remaining|Count|Average|Total number of credits available to burst|None|
|CPU Credits Consumed|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|None|
|Per Disk Read Bytes/sec|Data Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Data Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Data Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Data Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Per Disk QD|Data Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|OS Per Disk Read Bytes/sec|OS Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Bytes/sec|OS Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|None|
|OS Per Disk Read Operations/Sec|OS Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Operations/Sec|OS Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk QD|OS Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)|Count|Average|OS Disk Queue Depth(or Queue Length)|None|
|Data Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN,VMName|
|Data Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN,VMName|
|Data Disk Read Operations/Sec|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN,VMName|
|Data Disk Write Operations/Sec|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN,VMName|
|Data Disk Queue Depth|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN,VMName|
|OS Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|VMName|
|OS Disk Read Operations/Sec|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Operations/Sec|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Queue Depth|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|VMName|
|Inbound Flows|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|VMName|
|Outbound Flows|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|VMName|
|Inbound Flows Maximum Creation Rate|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|VMName|
|Outbound Flows Maximum Creation Rate|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|VMName|
|Premium Data Disk Cache Read Hit|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN,VMName|
|Premium Data Disk Cache Read Miss|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN,VMName|
|Premium OS Disk Cache Read Hit|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|VMName|
|Premium OS Disk Cache Read Miss|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|VMName|
|Network In Total|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|VMName|
|Network Out Total|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|VMName|


## Microsoft.Compute/virtualMachineScaleSets/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|None|
|Network In|Network In Billable (Deprecated)|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic) (Deprecated)|None|
|Network Out|Network Out Billable (Deprecated)|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic) (Deprecated)|None|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|None|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|None|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|None|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|None|
|CPU Credits Remaining|CPU Credits Remaining|Count|Average|Total number of credits available to burst|None|
|CPU Credits Consumed|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|None|
|Per Disk Read Bytes/sec|Data Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Data Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Data Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Data Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Per Disk QD|Data Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|OS Per Disk Read Bytes/sec|OS Disk Read Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Bytes/sec|OS Disk Write Bytes/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|None|
|OS Per Disk Read Operations/Sec|OS Disk Read Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk Write Operations/Sec|OS Disk Write Operations/Sec [(Deprecated)](portal-disk-metrics-deprecation.md)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|None|
|OS Per Disk QD|OS Disk QD [(Deprecated)](portal-disk-metrics-deprecation.md)|Count|Average|OS Disk Queue Depth(or Queue Length)|None|
|Data Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
|Data Disk Queue Depth|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|OS Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|None|
|OS Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|None|
|OS Disk Read Operations/Sec|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|None|
|OS Disk Write Operations/Sec|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|None|
|OS Disk Queue Depth|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|None|
|Inbound Flows|Inbound Flows|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|None|
|Outbound Flows|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|None|
|Inbound Flows Maximum Creation Rate|Inbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|None|
|Outbound Flows Maximum Creation Rate|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|None|
|Premium Data Disk Cache Read Hit|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|None|
|Premium OS Disk Cache Read Miss|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|None|
|Network In Total|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|None|
|Network Out Total|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|None|

## Microsoft.ContainerInstance/containerGroups

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuUsage|CPU Usage|Count|Average|CPU usage on all cores in millicores.|containerName|
|MemoryUsage|Memory Usage|Bytes|Average|Total memory usage in byte.|containerName|
|NetworkBytesReceivedPerSecond|Network Bytes Received Per Second|Bytes|Average|The network bytes received per second.|None|
|NetworkBytesTransmittedPerSecond|Network Bytes Transmitted Per Second|Bytes|Average|The network bytes transmitted per second.|None|

## Microsoft.ContainerRegistry/registries

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalPullCount|Total Pull Count|Count|Average|Number of image pulls in total|None|
|SuccessfulPullCount|Successful Pull Count|Count|Average|Number of successful image pulls|None|
|TotalPushCount|Total Push Count|Count|Average|Number of image pushes in total|None|
|SuccessfulPushCount|Successful Push Count|Count|Average|Number of successful image pushes|None|
|RunDuration|Run Duration|Milliseconds|Total|Run Duration in milliseconds|None|


## Microsoft.ContainerService/managedClusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|kube_node_status_allocatable_cpu_cores|Total number of available cpu cores in a managed cluster|Count|Average|Total number of available cpu cores in a managed cluster|None|
|kube_node_status_allocatable_memory_bytes|Total amount of available memory in a managed cluster|Bytes|Average|Total amount of available memory in a managed cluster|None|
|kube_pod_status_ready|Number of pods in Ready state|Count|Average|Number of pods in Ready state|namespace,pod|
|kube_node_status_condition|Statuses for various node conditions|Count|Average|Statuses for various node conditions|condition,status,status2,node|
|kube_pod_status_phase|Number of pods by phase|Count|Average|Number of pods by phase|phase,namespace,pod|



## Microsoft.CustomProviders/resourceproviders

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfullRequests|Successful Requests|Count|Total|Successful requests made by the custom provider|HttpMethod,CallPath,StatusCode|
|FailedRequests|Failed Requests|Count|Total|Gets the available logs for Custom Resource Providers|HttpMethod,CallPath,StatusCode|

## Microsoft.DataBoxEdge/dataBoxEdgeDevices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|NICReadThroughput|Read Throughput (Network)|BytesPerSecond|Average|The read throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|NICWriteThroughput|Write Throughput (Network)|BytesPerSecond|Average|The write throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|CloudReadThroughputPerShare|Cloud Download Throughput (Share)|BytesPerSecond|Average|The download throughput to Azure from a share during the reporting period.|Share|
|CloudUploadThroughputPerShare|Cloud Upload Throughput (Share)|BytesPerSecond|Average|The upload throughput to Azure from a share during the reporting period.|Share|
|BytesUploadedToCloudPerShare|Cloud Bytes Uploaded (Share)|Bytes|Average|The total number of bytes that is uploaded to Azure from a share during the reporting period.|Share|
|TotalCapacity|Total Capacity|Bytes|Average|Total Capacity|None|
|AvailableCapacity|Available Capacity|Bytes|Average|The available capacity in bytes during the reporting period.|None|
|CloudUploadThroughput|Cloud Upload Throughput|BytesPerSecond|Average|The cloud upload throughput  to Azure during the reporting period.|None|
|CloudReadThroughput|Cloud Download Throughput|BytesPerSecond|Average|The cloud download throughput to Azure during the reporting period.|None|
|BytesUploadedToCloud|Cloud Bytes Uploaded (Device)|Bytes|Average|The total number of bytes that is uploaded to Azure from a device during the reporting period.|None|
|HyperVVirtualProcessorUtilization|Edge Compute - Percentage CPU|Percent|Average|Percent CPU Usage|InstanceName|
|HyperVMemoryUtilization|Edge Compute - Memory Usage|Percent|Average|Amount of RAM in Use|InstanceName|


## Microsoft.DataCatalog/datacatalogs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AssetDistributionByClassification|Asset distribution by classification|Count|Total|Indicates the number of assets with a certain classification assigned, i.e. they are classified with that label.|Classification,Source|
|AssetDistributionByStorageType|Asset distribution by storage type|Count|Total|Indicates the number of assets with a certain storage type.|StorageType|
|NumberOfAssetsWithClassifications|Number of assets with at least one classification|Count|Average|Indicates the number of assets with at least one tag classification.|None|
|ScanCancelled|Scan Cancelled|Count|Total|Indicates the number of scans cancelled.|None|
|ScanCompleted|Scan Completed|Count|Total|Indicates the number of scans completed successfully.|None|
|ScanFailed|Scan Failed|Count|Total|Indicates the number of scans failed.|None|
|ScanTimeTaken|Scan time taken|Seconds|Total|Indicates the total scan time in seconds.|None|
|CatalogActiveUsers|Daily Active Users|Count|Total|Number of active users daily|None|
|CatalogUsage|Usage Distribution by Operation|Count|Total|Indicate the number of operation user makes to the catalog, i.e., Access, Search, Glossary.|Operation|


## Microsoft.DataFactory/datafactories

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|FailedRuns|Failed Runs|Count|Total||pipelineName,activityName|
|SuccessfulRuns|Successful Runs|Count|Total||pipelineName,activityName|


## Microsoft.DataFactory/factories

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PipelineFailedRuns|Failed pipeline runs metrics|Count|Total||FailureType,Name|
|PipelineSucceededRuns|Succeeded pipeline runs metrics|Count|Total||FailureType,Name|
|PipelineCancelledRuns|Cancelled pipeline runs metrics|Count|Total||FailureType,Name|
|ActivityFailedRuns|Failed activity runs metrics|Count|Total||ActivityType,PipelineName,FailureType,Name|
|ActivitySucceededRuns|Succeeded activity runs metrics|Count|Total||ActivityType,PipelineName,FailureType,Name|
|ActivityCancelledRuns|Cancelled activity runs metrics|Count|Total||ActivityType,PipelineName,FailureType,Name|
|TriggerFailedRuns|Failed trigger runs metrics|Count|Total||Name,FailureType|
|TriggerSucceededRuns|Succeeded trigger runs metrics|Count|Total||Name,FailureType|
|TriggerCancelledRuns|Cancelled trigger runs metrics|Count|Total||Name,FailureType|
|IntegrationRuntimeCpuPercentage|Integration runtime CPU utilization|Percent|Average||IntegrationRuntimeName,NodeName|
|IntegrationRuntimeAvailableMemory|Integration runtime available memory|Bytes|Average||IntegrationRuntimeName,NodeName|
|IntegrationRuntimeAverageTaskPickupDelay|Integration runtime queue duration|Seconds|Average||IntegrationRuntimeName|
|IntegrationRuntimeQueueLength|Integration runtime queue length|Count|Average||IntegrationRuntimeName|
|IntegrationRuntimeAvailableNodeNumber|Integration runtime available node count|Count|Average||IntegrationRuntimeName|
|MaxAllowedResourceCount|Maximum allowed entities count|Count|Maximum||None|
|MaxAllowedFactorySizeInGbUnits|Maximum allowed factory size (GB unit)|Count|Maximum||None|
|ResourceCount|Total entities count|Count|Maximum||None|
|FactorySizeInGbUnits|Total factory size (GB unit)|Count|Maximum||None|

## Microsoft.DataLakeAnalytics/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|JobEndedSuccess|Successful Jobs|Count|Total|Count of successful jobs.|None|
|JobEndedFailure|Failed Jobs|Count|Total|Count of failed jobs.|None|
|JobEndedCancelled|Cancelled Jobs|Count|Total|Count of cancelled jobs.|None|
|JobAUEndedSuccess|Successful AU Time|Seconds|Total|Total AU time for successful jobs.|None|
|JobAUEndedFailure|Failed AU Time|Seconds|Total|Total AU time for failed jobs.|None|
|JobAUEndedCancelled|Cancelled AU Time|Seconds|Total|Total AU time for cancelled jobs.|None|
|JobStage|Jobs in Stage|Count|Total|Number of jobs in each stage.|None|


## Microsoft.DataLakeStore/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalStorage|Total Storage|Bytes|Maximum|Total amount of data stored in the account.|None|
|DataWritten|Data Written|Bytes|Total|Total amount of data written to the account.|None|
|DataRead|Data Read|Bytes|Total|Total amount of data read from the account.|None|
|WriteRequests|Write Requests|Count|Total|Count of data write requests to the account.|None|
|ReadRequests|Read Requests|Count|Total|Count of data read requests to the account.|None|


## Microsoft.DataShare/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ShareCount|Sent Shares|Count|Maximum|Number of sent shares in the account|ShareName|
|ShareSubscriptionCount|Received Shares|Count|Maximum|Number of received shares in the account|ShareSubscriptionName|
|SucceededShareSynchronizations|Sent Share Succeeded Snapshots|Count|Count|Number of sent share succeeded snapshots in the account|None|
|FailedShareSynchronizations|Sent Share Failed Snapshots|Count|Count|Number of sent share failed snapshots in the account|None|
|SucceededShareSubscriptionSynchronizations|Received Share Succeeded Snapshots|Count|Count|Number of received share succeeded snapshots in the account|None|
|FailedShareSubscriptionSynchronizations|Received Share Failed Snapshots|Count|Count|Number of received share failed snapshots in the account|None|


## Microsoft.DBforMariaDB/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|None|
|memory_percent|Memory percent|Percent|Average|Memory percent|None|
|io_consumption_percent|IO percent|Percent|Average|IO percent|None|
|storage_percent|Storage percent|Percent|Average|Storage percent|None|
|storage_used|Storage used|Bytes|Average|Storage used|None|
|storage_limit|Storage limit|Bytes|Maximum|Storage limit|None|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|None|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|None|
|serverlog_storage_limit|Server Log storage limit|Bytes|Average|Server Log storage limit|None|
|active_connections|Active Connections|Count|Average|Active Connections|None|
|connections_failed|Failed Connections|Count|Total|Failed Connections|None|
|seconds_behind_master|Replication lag in seconds|Count|Maximum|Replication lag in seconds|None|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|None|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|None|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|None|


## Microsoft.DBforMySQL/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|None|
|memory_percent|Memory percent|Percent|Average|Memory percent|None|
|io_consumption_percent|IO percent|Percent|Average|IO percent|None|
|storage_percent|Storage percent|Percent|Average|Storage percent|None|
|storage_used|Storage used|Bytes|Average|Storage used|None|
|storage_limit|Storage limit|Bytes|Maximum|Storage limit|None|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|None|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|None|
|serverlog_storage_limit|Server Log storage limit|Bytes|Maximum|Server Log storage limit|None|
|active_connections|Active Connections|Count|Average|Active Connections|None|
|connections_failed|Failed Connections|Count|Total|Failed Connections|None|
|seconds_behind_master|Replication lag in seconds|Count|Maximum|Replication lag in seconds|None|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|None|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|None|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|None|


## Microsoft.DBforPostgreSQL/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|None|
|memory_percent|Memory percent|Percent|Average|Memory percent|None|
|io_consumption_percent|IO percent|Percent|Average|IO percent|None|
|storage_percent|Storage percent|Percent|Average|Storage percent|None|
|storage_used|Storage used|Bytes|Average|Storage used|None|
|storage_limit|Storage limit|Bytes|Maximum|Storage limit|None|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|None|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|None|
|serverlog_storage_limit|Server Log storage limit|Bytes|Maximum|Server Log storage limit|None|
|active_connections|Active Connections|Count|Average|Active Connections|None|
|connections_failed|Failed Connections|Count|Total|Failed Connections|None|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|None|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|None|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|None|
|pg_replica_log_delay_in_seconds|Replica Lag|Seconds|Maximum|Replica lag in seconds|None|
|pg_replica_log_delay_in_bytes|Max Lag Across Replicas|Bytes|Maximum|Lag in bytes of the most lagging replica|None|


## Microsoft.DBforPostgreSQL/serversv2

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|None|
|memory_percent|Memory percent|Percent|Average|Memory percent|None|
|iops|IOPS|Count|Average|IO Operations per second|None|
|storage_percent|Storage percent|Percent|Average|Storage percent|None|
|storage_used|Storage used|Bytes|Average|Storage used|None|
|active_connections|Active Connections|Count|Average|Active Connections|None|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|None|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|None|


## Microsoft.DBforPostgreSQL/singleservers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|None|
|memory_percent|Memory percent|Percent|Average|Memory percent|None|
|iops|IOPS|Count|Average|IO Operations per second|None|
|storage_percent|Storage percent|Percent|Average|Storage percent|None|
|storage_used|Storage used|Bytes|Average|Storage used|None|
|active_connections|Active Connections|Count|Average|Active Connections|None|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|None|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|None|
|connections_failed|Failed Connections|Count|Total|Failed Connections|None|
|connections_succeeded|Succeeded Connections|Count|Total|Succeeded Connections|None|
|maximum_used_transactionIDs|Maximum Used Transaction IDs|Count|Average|Maximum Used Transaction IDs|None|





## Microsoft.Devices/IotHubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|d2c.telemetry.ingress.allProtocol|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|None|
|d2c.telemetry.ingress.success|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|None|
|c2d.commands.egress.complete.success|C2D message deliveries completed|Count|Total|Number of cloud-to-device message deliveries completed successfully by the device|None|
|c2d.commands.egress.abandon.success|C2D messages abandoned|Count|Total|Number of cloud-to-device messages abandoned by the device|None|
|c2d.commands.egress.reject.success|C2D messages rejected|Count|Total|Number of cloud-to-device messages rejected by the device|None|
|C2DMessagesExpired|C2D Messages Expired (preview)|Count|Total|Number of expired cloud-to-device messages|None|
|devices.totalDevices|Total devices (deprecated)|Count|Total|Number of devices registered to your IoT hub|None|
|devices.connectedDevices.allProtocol|Connected devices (deprecated) |Count|Total|Number of devices connected to your IoT hub|None|
|d2c.telemetry.egress.success|Routing: telemetry messages delivered|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|None|
|d2c.telemetry.egress.dropped|Routing: telemetry messages dropped |Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|None|
|d2c.telemetry.egress.orphaned|Routing: telemetry messages orphaned |Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing rules (including the fallback rule). |None|
|d2c.telemetry.egress.invalid|Routing: telemetry messages incompatible|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. This value does not include retries.|None|
|d2c.telemetry.egress.fallback|Routing: messages delivered to fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|None|
|d2c.endpoints.egress.eventHubs|Routing: messages delivered to Event Hub|Count|Total|The number of times IoT Hub routing successfully delivered messages to Event Hub endpoints.|None|
|d2c.endpoints.latency.eventHubs|Routing: message latency for Event Hub|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into an Event Hub endpoint.|None|
|d2c.endpoints.egress.serviceBusQueues|Routing: messages delivered to Service Bus Queue|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|None|
|d2c.endpoints.latency.serviceBusQueues|Routing: message latency for Service Bus Queue|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus queue endpoint.|None|
|d2c.endpoints.egress.serviceBusTopics|Routing: messages delivered to Service Bus Topic|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|None|
|d2c.endpoints.latency.serviceBusTopics|Routing: message latency for Service Bus Topic|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus topic endpoint.|None|
|d2c.endpoints.egress.builtIn.events|Routing: messages delivered to messages/events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events).|None|
|d2c.endpoints.latency.builtIn.events|Routing: message latency for messages/events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into the built-in endpoint (messages/events).|None|
|d2c.endpoints.egress.storage|Routing: messages delivered to storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|None|
|d2c.endpoints.latency.storage|Routing: message latency for storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a storage endpoint.|None|
|d2c.endpoints.egress.storage.bytes|Routing: data delivered to storage|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|None|
|d2c.endpoints.egress.storage.blobs|Routing: blobs delivered to storage|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|None|
|EventGridDeliveries|Event Grid deliveries (preview)|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|ResourceId,Result,EventType|
|EventGridLatency|Event Grid latency (preview)|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|ResourceId,EventType|
|RoutingDeliveries|Routing Deliveries (preview)|Milliseconds|Total|The number of times IoT Hub attempted to deliver messages to all endpoints using routing. To see the number of successful or failed attempts, use the Result dimension. To see the reason of failure, like invalid, dropped, or orphaned, use the FailureReasonCategory dimension. You can also use the EndpointName and EndpointType dimensions to understand how many messages were delivered to your different endpoints. The metric value increases by one for each delivery attempt, including if the message is delivered to multiple endpoints or if the message is delivered to the same endpoint multiple times.|ResourceId,EndpointType,EndpointName,FailureReasonCategory,Result,RoutingSource|
|RoutingDeliveryLatency|Routing Delivery Latency (preview)|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into an endpoint. You can use the EndpointName and EndpointType dimensions to understand the latency to your different endpoints.|ResourceId,EndpointType,EndpointName,RoutingSource|
|d2c.twin.read.success|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|None|
|d2c.twin.read.failure|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|None|
|d2c.twin.read.size|Response size of twin reads from devices|Bytes|Average|The average, min, and max of all successful device-initiated twin reads.|None|
|d2c.twin.update.success|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|None|
|d2c.twin.update.failure|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|None|
|d2c.twin.update.size|Size of twin updates from devices|Bytes|Average|The average, min, and max size of all successful device-initiated twin updates.|None|
|c2d.methods.success|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|None|
|c2d.methods.failure|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|None|
|c2d.methods.requestSize|Request size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method requests.|None|
|c2d.methods.responseSize|Response size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method responses.|None|
|c2d.twin.read.success|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|None|
|c2d.twin.read.failure|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|None|
|c2d.twin.read.size|Response size of twin reads from back end|Bytes|Average|The average, min, and max of all successful back-end-initiated twin reads.|None|
|c2d.twin.update.success|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|None|
|c2d.twin.update.failure|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|None|
|c2d.twin.update.size|Size of twin updates from back end|Bytes|Average|The average, min, and max size of all successful back-end-initiated twin updates.|None|
|twinQueries.success|Successful twin queries|Count|Total|The count of all successful twin queries.|None|
|twinQueries.failure|Failed twin queries|Count|Total|The count of all failed twin queries.|None|
|twinQueries.resultSize|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|None|
|jobs.createTwinUpdateJob.success|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|None|
|jobs.createTwinUpdateJob.failure|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|None|
|jobs.createDirectMethodJob.success|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|None|
|jobs.createDirectMethodJob.failure|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|None|
|jobs.listJobs.success|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|None|
|jobs.listJobs.failure|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|None|
|jobs.cancelJob.success|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|None|
|jobs.cancelJob.failure|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|None|
|jobs.queryJobs.success|Successful job queries|Count|Total|The count of all successful calls to query jobs.|None|
|jobs.queryJobs.failure|Failed job queries|Count|Total|The count of all failed calls to query jobs.|None|
|jobs.completed|Completed jobs|Count|Total|The count of all completed jobs.|None|
|jobs.failed|Failed jobs|Count|Total|The count of all failed jobs.|None|
|d2c.telemetry.ingress.sendThrottle|Number of throttling errors|Count|Total|Number of throttling errors due to device throughput throttles|None|
|dailyMessageQuotaUsed|Total number of messages used|Count|Average|Number of total messages used today|None|
|deviceDataUsage|Total device data usage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|deviceDataUsageV2|Total device data usage (preview)|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|totalDeviceCount|Total devices (preview)|Count|Average|Number of devices registered to your IoT hub|None|
|connectedDeviceCount|Connected devices (preview)|Count|Average|Number of devices connected to your IoT hub|None|
|configurations|Configuration Metrics|Count|Total|Metrics for Configuration Operations|None|


## Microsoft.Devices/provisioningServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RegistrationAttempts|Registration attempts|Count|Total|Number of device registrations attempted|ProvisioningServiceName,IotHubName,Status|
|DeviceAssignments|Devices assigned|Count|Total|Number of devices assigned to an IoT hub|ProvisioningServiceName,IotHubName|
|AttestationAttempts|Attestation attempts|Count|Total|Number of device attestations attempted|ProvisioningServiceName,Status,Protocol|




## Microsoft.DocumentDB/databaseAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AddRegion|Region Added|Count|Count|Region Added|Region|
|AvailableStorage|Available Storage|Bytes|Total|Total available storage reported at 5 minutes granularity|CollectionName,DatabaseName,Region|
|CassandraConnectionClosures|Cassandra Connection Closures|Count|Total|Number of Cassandra connections that were closed, reported at a 1 minute granularity|APIType,Region,ClosureReason|
|CassandraKeyspaceDelete|Cassandra Keyspace Deleted|Count|Count|Cassandra Keyspace Deleted|ResourceName,ApiKind,ApiKindResourceType,OperationType|
|CassandraKeyspaceThroughputUpdate|Cassandra Keyspace Throughput Updated|Count|Count|Cassandra Keyspace Throughput Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|CassandraKeyspaceUpdate|Cassandra Keyspace Updated|Count|Count|Cassandra Keyspace Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|CassandraRequestCharges|Cassandra Request Charges|Count|Total|RUs consumed for Cassandra requests made|APIType,DatabaseName,CollectionName,Region,OperationType,ResourceType|
|CassandraRequests|Cassandra Requests|Count|Count|Number of Cassandra requests made|APIType,DatabaseName,CollectionName,Region,OperationType,ResourceType,ErrorCode|
|CassandraTableDelete|Cassandra Table Deleted|Count|Count|Cassandra Table Deleted|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,OperationType|
|CassandraTableThroughputUpdate|Cassandra Table Throughput Updated|Count|Count|Cassandra Table Throughput Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|CassandraTableUpdate|Cassandra Table Updated|Count|Count|Cassandra Table Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|CreateAccount|Account Created|Count|Count|Account Created|None|
|DataUsage|Data Usage|Bytes|Total|Total data usage reported at 5 minutes granularity|CollectionName,DatabaseName,Region|
|DeleteAccount|Account Deleted|Count|Count|Account Deleted|None|
|DocumentCount|Document Count|Count|Total|Total document count reported at 5 minutes granularity|CollectionName,DatabaseName,Region|
|DocumentQuota|Document Quota|Bytes|Total|Total storage quota reported at 5 minutes granularity|CollectionName,DatabaseName,Region|
|GremlinDatabaseDelete|Gremlin Database Deleted|Count|Count|Gremlin Database Deleted|ResourceName,ApiKind,ApiKindResourceType,OperationType|
|GremlinDatabaseThroughputUpdate|Gremlin Database Throughput Updated|Count|Count|Gremlin Database Throughput Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|GremlinDatabaseUpdate|Gremlin Database Updated|Count|Count|Gremlin Database Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|GremlinGraphDelete|Gremlin Graph Deleted|Count|Count|Gremlin Graph Deleted|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,OperationType|
|GremlinGraphThroughputUpdate|Gremlin Graph Throughput Updated|Count|Count|Gremlin Graph Throughput Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|GremlinGraphUpdate|Gremlin Graph Updated|Count|Count|Gremlin Graph Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|IndexUsage|Index Usage|Bytes|Total|Total index usage reported at 5 minutes granularity|CollectionName,DatabaseName,Region|
|MetadataRequests|Metadata Requests|Count|Count|Count of metadata requests. Cosmos DB maintains system metadata collection for each account, that allows you to enumerate collections, databases, etc, and their configurations, free of charge.|DatabaseName,CollectionName,Region,StatusCode,Role|
|MongoCollectionDelete|Mongo Collection Deleted|Count|Count|Mongo Collection Deleted|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,OperationType|
|MongoCollectionThroughputUpdate|Mongo Collection Throughput Updated|Count|Count|Mongo Collection Throughput Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|MongoCollectionUpdate|Mongo Collection Updated|Count|Count|Mongo Collection Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|MongoDBDatabaseUpdate|Mongo Database Updated|Count|Count|Mongo Database Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|MongoDatabaseDelete|Mongo Database Deleted|Count|Count|Mongo Database Deleted|ResourceName,ApiKind,ApiKindResourceType,OperationType|
|MongoDatabaseThroughputUpdate|Mongo Database Throughput Updated|Count|Count|Mongo Database Throughput Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|MongoRequestCharge|Mongo Request Charge|Count|Total|Mongo Request Units Consumed|DatabaseName,CollectionName,Region,CommandName,ErrorCode,Status|
|MongoRequests|Mongo Requests|Count|Count|Number of Mongo Requests Made|DatabaseName,CollectionName,Region,CommandName,ErrorCode,Status|
|MongoRequestsCount|Mongo Request Rate|CountPerSecond|Average|Mongo request Count per second|DatabaseName,CollectionName,Region,CommandName,ErrorCode|
|MongoRequestsDelete|Mongo Delete Request Rate|CountPerSecond|Average|Mongo Delete request per second|DatabaseName,CollectionName,Region,CommandName,ErrorCode|
|MongoRequestsInsert|Mongo Insert Request Rate|CountPerSecond|Average|Mongo Insert count per second|DatabaseName,CollectionName,Region,CommandName,ErrorCode|
|MongoRequestsQuery|Mongo Query Request Rate|CountPerSecond|Average|Mongo Query request per second|DatabaseName,CollectionName,Region,CommandName,ErrorCode|
|MongoRequestsUpdate|Mongo Update Request Rate|CountPerSecond|Average|Mongo Update request per second|DatabaseName,CollectionName,Region,CommandName,ErrorCode|
|NormalizedRUConsumption|Normalized RU Consumption|Percent|Maximum|Max RU consumption percentage per minute|CollectionName,DatabaseName,Region|
|ProvisionedThroughput|Provisioned Throughput|Count|Maximum|Provisioned Throughput|DatabaseName,CollectionName|
|RegionFailover|Region Failed Over|Count|Count|Region Failed Over|None|
|RemoveRegion|Region Removed|Count|Count|Region Removed|Region|
|ReplicationLatency|P99 Replication Latency|MilliSeconds|Average|P99 Replication Latency across source and target regions for geo-enabled account|SourceRegion,TargetRegion|
|ServerSideLatency|Server Side Latency|MilliSeconds|Average|Server Side Latency|DatabaseName,CollectionName,Region,ConnectionMode,OperationType,PublicAPIType|
|ServiceAvailability|Service Availability|Percent|Average|Account requests availability at one hour, day or month granularity|None|
|SqlContainerDelete|Sql Container Deleted|Count|Count|Sql Container Deleted|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,OperationType|
|SqlContainerThroughputUpdate|Sql Container Throughput Updated|Count|Count|Sql Container Throughput Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|SqlContainerUpdate|Sql Container Updated|Count|Count|Sql Container Updated|ResourceName,ChildResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|SqlDatabaseDelete|Sql Database Deleted|Count|Count|Sql Database Deleted|ResourceName,ApiKind,ApiKindResourceType,OperationType|
|SqlDatabaseThroughputUpdate|Sql Database Throughput Updated|Count|Count|Sql Database Throughput Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|SqlDatabaseUpdate|Sql Database Updated|Count|Count|Sql Database Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|TableTableDelete|AzureTable Table Deleted|Count|Count|AzureTable Table Deleted|ResourceName,ApiKind,ApiKindResourceType,OperationType|
|TableTableThroughputUpdate|AzureTable Table Throughput Updated|Count|Count|AzureTable Table Throughput Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|TableTableUpdate|AzureTable Table Updated|Count|Count|AzureTable Table Updated|ResourceName,ApiKind,ApiKindResourceType,IsThroughputRequest|
|TotalRequestUnits|Total Request Units|Count|Total|Request Units consumed|DatabaseName,CollectionName,Region,StatusCode,OperationType,Status|
|TotalRequests|Total Requests|Count|Count|Number of requests made|DatabaseName,CollectionName,Region,StatusCode,OperationType,Status|
|UpdateAccountKeys|Account Keys Updated|Count|Count|Account Keys Updated|KeyType|
|UpdateAccountNetworkSettings|Account Network Settings Updated|Count|Count|Account Network Settings Updated|None|
|UpdateAccountReplicationSettings|Account Replication Settings Updated|Count|Count|Account Replication Settings Updated|None|
|UpdateDiagnosticsSettings|Account Diagnostic Settings Updated|Count|Count|Account Diagnostic Settings Updated|DiagnosticSettingsName,ResourceGroupName|



## Microsoft.EnterpriseKnowledgeGraph/services

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TransactionCount|Transaction Count|Count|Count|Total Transaction Count|TransactionCount|
|SuccessCount|Success Count|Count|Count|Succeeded Transactions Count|SuccessCount|
|FailureCount|Failure Count|Count|Count|Failed Transactions Count|FailureCount|
|SuccessLatency|Success Latency|MilliSeconds|Average|Latency of Successful Transactions|SuccessCount|

## Microsoft.EventGrid/domains

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|Topic|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|Topic,ErrorType,Error|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,Error,ErrorType|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|Topic,EventSubscriptionName,DomainEventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,DropReason|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|Topic,EventSubscriptionName,DomainEventSubscriptionName,DeadLetterReason|

## Microsoft.EventGrid/topics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType,Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error,ErrorType,EventSubscriptionName|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason,EventSubscriptionName|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason,EventSubscriptionName|

## Microsoft.EventGrid/systemTopics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType,Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|EventSubscriptionName|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error,ErrorType,EventSubscriptionName|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|EventSubscriptionName|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|EventSubscriptionName|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason,EventSubscriptionName|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason,EventSubscriptionName|

## Microsoft.EventGrid/eventSubscriptions

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|None|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error,ErrorType|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|None|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|None|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason|

## Microsoft.EventGrid/extensionTopics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|None|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType,Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|None|
|PublishSuccessLatencyInMs|Publish Success Latency|Milliseconds|Total|Publish success latency in milliseconds|None|




## Microsoft.EventHub/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|EntityName,OperationResult|
|ServerErrors|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|EntityName,OperationResult|
|UserErrors|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|EntityName,OperationResult|
|QuotaExceededErrors|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|EntityName,OperationResult|
|ThrottledRequests|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|EntityName,OperationResult|
|IncomingRequests|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|EntityName|
|IncomingMessages|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|EntityName|
|OutgoingMessages|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|EntityName|
|IncomingBytes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|EntityName|
|OutgoingBytes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|EntityName|
|ActiveConnections|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.|None|
|ConnectionsOpened|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|EntityName|
|ConnectionsClosed|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|EntityName|
|CaptureBacklog|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|EntityName|
|CapturedMessages|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|EntityName|
|CapturedBytes|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|EntityName|
|Size|Size|Bytes|Average|Size of an EventHub in Bytes.|EntityName|
|INREQS|Incoming Requests (Deprecated)|Count|Total|Total incoming send requests for a namespace (Deprecated)|None|
|SUCCREQ|Successful Requests (Deprecated)|Count|Total|Total successful requests for a namespace (Deprecated)|None|
|FAILREQ|Failed Requests (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|None|
|SVRBSY|Server Busy Errors (Deprecated)|Count|Total|Total server busy errors for a namespace (Deprecated)|None|
|INTERR|Internal Server Errors (Deprecated)|Count|Total|Total internal server errors for a namespace (Deprecated)|None|
|MISCERR|Other Errors (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|None|
|INMSGS|Incoming Messages (obsolete) (Deprecated)|Count|Total|Total incoming messages for a namespace. This metric is deprecated. Please use Incoming Messages metric instead (Deprecated)|None|
|EHINMSGS|Incoming Messages (Deprecated)|Count|Total|Total incoming messages for a namespace (Deprecated)|None|
|OUTMSGS|Outgoing Messages (obsolete) (Deprecated)|Count|Total|Total outgoing messages for a namespace. This metric is deprecated. Please use Outgoing Messages metric instead (Deprecated)|None|
|EHOUTMSGS|Outgoing Messages (Deprecated)|Count|Total|Total outgoing messages for a namespace (Deprecated)|None|
|EHINMBS|Incoming bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace. This metric is deprecated. Please use Incoming bytes metric instead (Deprecated)|None|
|EHINBYTES|Incoming bytes (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace (Deprecated)|None|
|EHOUTMBS|Outgoing bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace. This metric is deprecated. Please use Outgoing bytes metric instead (Deprecated)|None|
|EHOUTBYTES|Outgoing bytes (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace (Deprecated)|None|
|EHABL|Archive backlog messages (Deprecated)|Count|Total|Event Hub archive messages in backlog for a namespace (Deprecated)|None|
|EHAMSGS|Archive messages (Deprecated)|Count|Total|Event Hub archived messages in a namespace (Deprecated)|None|
|EHAMBS|Archive message throughput (Deprecated)|Bytes|Total|Event Hub archived message throughput in a namespace (Deprecated)|None|

## Microsoft.EventHub/clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|OperationResult|
|ServerErrors|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|OperationResult|
|UserErrors|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|OperationResult|
|QuotaExceededErrors|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|OperationResult|
|ThrottledRequests|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|OperationResult|
|IncomingRequests|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|None|
|IncomingMessages|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|None|
|OutgoingMessages|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|None|
|IncomingBytes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|None|
|OutgoingBytes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|None|
|ActiveConnections|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.|None|
|ConnectionsOpened|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|None|
|ConnectionsClosed|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|None|
|CaptureBacklog|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|None|
|CapturedMessages|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|None|
|CapturedBytes|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|None|
|CPU|CPU|Percent|Maximum|CPU utilization for the Event Hub Cluster as a percentage|Role|
|AvailableMemory|Available Memory|Percent|Maximum|Available memory for the Event Hub Cluster as a percentage of total memory.|Role|
|Size|Size of an EventHub in Bytes.|Bytes|Average|Size of an EventHub in Bytes.|Role|


## Microsoft.HDInsight/clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|GatewayRequests|Gateway Requests|Count|Total|Number of gateway requests|HttpStatus|
|CategorizedGatewayRequests|Categorized Gateway Requests|Count|Total|Number of gateway requests by categories (1xx/2xx/3xx/4xx/5xx)|HttpStatus|
|NumActiveWorkers|Number of Active Workers|Count|Maximum|Number of Active Workers|MetricName|


## Microsoft.Insights/AutoscaleSettings

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ObservedMetricValue|Observed Metric Value|Count|Average|The value computed by autoscale when executed|MetricTriggerSource|
|MetricThreshold|Metric Threshold|Count|Average|The configured autoscale threshold when autoscale ran.|MetricTriggerRule|
|ObservedCapacity|Observed Capacity|Count|Average|The capacity reported to autoscale when it executed.|None|
|ScaleActionsInitiated|Scale Actions Initiated|Count|Total|The direction of the scale operation.|ScaleDirection|

## Microsoft.Insights/Components

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|availabilityResults/availabilityPercentage|Availability|Percent|Average|Percentage of successfully completed availability tests|availabilityResult/name,availabilityResult/location|
|availabilityResults/count|Availability tests|Count|Count|Count of availability tests|availabilityResult/name,availabilityResult/location,availabilityResult/success|
|availabilityResults/duration|Availability test duration|MilliSeconds|Average|Availability test duration|availabilityResult/name,availabilityResult/location,availabilityResult/success|
|browserTimings/networkDuration|Page load network connect time|MilliSeconds|Average|Time between user request and network connection. Includes DNS lookup and transport connection.|None|
|browserTimings/processingDuration|Client processing time|MilliSeconds|Average|Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing.|None|
|browserTimings/receiveDuration|Receiving response time|MilliSeconds|Average|Time between the first and last bytes, or until disconnection.|None|
|browserTimings/sendDuration|Send request time|MilliSeconds|Average|Time between network connection and receiving the first byte.|None|
|browserTimings/totalDuration|Browser page load time|MilliSeconds|Average|Time from user request until DOM, stylesheets, scripts and images are loaded.|None|
|dependencies/count|Dependency calls|Count|Count|Count of calls made by the application to external resources.|dependency/type,dependency/performanceBucket,dependency/success,dependency/target,dependency/resultCode,operation/synthetic,cloud/roleInstance,cloud/roleName|
|dependencies/duration|Dependency duration|MilliSeconds|Average|Duration of calls made by the application to external resources.|dependency/type,dependency/performanceBucket,dependency/success,dependency/target,dependency/resultCode,operation/synthetic,cloud/roleInstance,cloud/roleName|
|dependencies/failed|Dependency call failures|Count|Count|Count of failed dependency calls made by the application to external resources.|dependency/type,dependency/performanceBucket,dependency/success,dependency/target,dependency/resultCode,operation/synthetic,cloud/roleInstance,cloud/roleName|
|pageViews/count|Page views|Count|Count|Count of page views.|operation/synthetic,cloud/roleName|
|pageViews/duration|Page view load time|MilliSeconds|Average|Page view load time|operation/synthetic,cloud/roleName|
|performanceCounters/requestExecutionTime|HTTP request execution time|MilliSeconds|Average|Execution time of the most recent request.|cloud/roleInstance|
|performanceCounters/requestsInQueue|HTTP requests in application queue|Count|Average|Length of the application request queue.|cloud/roleInstance|
|performanceCounters/requestsPerSecond|HTTP request rate|CountPerSecond|Average|Rate of all requests to the application per second from ASP.NET.|cloud/roleInstance|
|performanceCounters/exceptionsPerSecond|Exception rate|CountPerSecond|Average|Count of handled and unhandled exceptions reported to windows, including .NET exceptions and unmanaged exceptions that are converted into .NET exceptions.|cloud/roleInstance|
|performanceCounters/processIOBytesPerSecond|Process IO rate|BytesPerSecond|Average|Total bytes per second read and written to files, network and devices.|cloud/roleInstance|
|performanceCounters/processCpuPercentage|Process CPU|Percent|Average|The percentage of elapsed time that all process threads used the processor to execute instructions. This can vary between 0 to 100. This metric indicates the performance of w3wp process alone.|cloud/roleInstance|
|performanceCounters/processorCpuPercentage|Processor time|Percent|Average|The percentage of time that the processor spends in non-idle threads.|cloud/roleInstance|
|performanceCounters/memoryAvailableBytes|Available memory|Bytes|Average|Physical memory immediately available for allocation to a process or for system use.|cloud/roleInstance|
|performanceCounters/processPrivateBytes|Process private bytes|Bytes|Average|Memory exclusively assigned to the monitored application's processes.|cloud/roleInstance|
|requests/duration|Server response time|MilliSeconds|Average|Time between receiving an HTTP request and finishing sending the response.|request/performanceBucket,request/resultCode,operation/synthetic,cloud/roleInstance,request/success,cloud/roleName|
|requests/count|Server requests|Count|Count|Count of HTTP requests completed.|request/performanceBucket,request/resultCode,operation/synthetic,cloud/roleInstance,request/success,cloud/roleName|
|requests/failed|Failed requests|Count|Count|Count of HTTP requests marked as failed. In most cases these are requests with a response code >= 400 and not equal to 401.|request/performanceBucket,request/resultCode,request/success,operation/synthetic,cloud/roleInstance,cloud/roleName|
|requests/rate|Server request rate|CountPerSecond|Average|Rate of server requests per second|request/performanceBucket,request/resultCode,operation/synthetic,cloud/roleInstance,request/success,cloud/roleName|
|exceptions/count|Exceptions|Count|Count|Combined count of all uncaught exceptions.|cloud/roleName,cloud/roleInstance,client/type|
|exceptions/browser|Browser exceptions|Count|Count|Count of uncaught exceptions thrown in the browser.|client/isServer,cloud/roleName|
|exceptions/server|Server exceptions|Count|Count|Count of uncaught exceptions thrown in the server application.|client/isServer,cloud/roleName,cloud/roleInstance|
|traces/count|Traces|Count|Count|Trace document count|trace/severityLevel,operation/synthetic,cloud/roleName,cloud/roleInstance|


## Microsoft.IoTCentral/IoTApps

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|connectedDeviceCount|Total Connected Devices|Count|Average|Number of devices connected to IoT Central|None|
|c2d.property.read.success|Successful Device Property Reads from IoT Central|Count|Total|The count of all successful property reads initiated from IoT Central|None|
|c2d.property.read.failure|Failed Device Property Reads from IoT Central|Count|Total|The count of all failed property reads initiated from IoT Central|None|
|d2c.property.read.success|Successful Device Property Reads from Devices|Count|Total|The count of all successful property reads initiated from devices|None|
|d2c.property.read.failure|Failed Device Property Reads from Devices|Count|Total|The count of all failed property reads initiated from devices|None|
|c2d.property.update.success|Successful Device Property Updates from IoT Central|Count|Total|The count of all successful property updates initiated from IoT Central|None|
|c2d.property.update.failure|Failed Device Property Updates from IoT Central|Count|Total|The count of all failed property updates initiated from IoT Central|None|
|d2c.property.update.success|Successful Device Property Updates from Devices|Count|Total|The count of all successful property updates initiated from devices|None|
|d2c.property.update.failure|Failed Device Property Updates from Devices|Count|Total|The count of all failed property updates initiated from devices|None|


## Microsoft.KeyVault/vaults

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServiceApiHit|Total Service Api Hits|Count|Count|Number of total service api hits|ActivityType,ActivityName|
|ServiceApiLatency|Overall Service Api Latency|Milliseconds|Average|Overall latency of service api requests|ActivityType,ActivityName,StatusCode,StatusCodeClass|
|ServiceApiResult|Total Service Api Results|Count|Count|Number of total service api results|ActivityType,ActivityName,StatusCode,StatusCodeClass|
|SaturationShoebox|Overall Vault Saturation|Percent|Average|Vault capacity used|ActivityType,ActivityName,TransactionType|
|Availability|Overall Vault Availability|Percent|Average|Vault requests availability|ActivityType,ActivityName,StatusCode,StatusCodeClass|

## Microsoft.Kusto/Clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CacheUtilization|Cache utilization|Percent|Average|Utilization level in the cluster scope|None|
|QueryDuration|Query duration|Milliseconds|Average|Queries' duration in seconds|QueryStatus|
|IngestionUtilization|Ingestion utilization|Percent|Average|Ratio of used ingestion slots in the cluster|None|
|KeepAlive|Keep alive|Count|Average|Sanity check indicates the cluster responds to queries|None|
|IngestionVolumeInMB|Ingestion volume (in MB)|Count|Total|Overall volume of ingested data to the cluster (in MB)|Database|
|IngestionLatencyInSeconds|Ingestion latency (in seconds)|Seconds|Average|Ingestion time from the source (e.g. message is in EventHub) to the cluster in seconds|None|
|EventsProcessedForEventHubs|Events processed (for Event/IoT Hubs)|Count|Total|Number of events processed by the cluster when ingesting from Event/IoT Hub|EventStatus|
|IngestionResult|Ingestion result|Count|Count|Number of ingestion operations|IngestionResultDetails|
|CPU|CPU|Percent|Average|CPU utilization level|None|
|ContinuousExportNumOfRecordsExported|Continuous export – num of exported records|Count|Total|Number of records exported, fired for every storage artifact written during the export operation|ContinuousExportName,Database|
|ExportUtilization|Export Utilization|Percent|Maximum|Export utilization|None|
|ContinuousExportPendingCount|Continuous Export Pending Count|Count|Maximum|The number of pending continuous export jobs ready for execution|None|
|ContinuousExportMaxLatenessMinutes|Continuous Export Max Lateness|Count|Maximum|The lateness (in minutes) reported by the continuous export jobs in the cluster|None|
|ContinuousExportResult|Continuous Export Result|Count|Count|Indicates whether Continuous Export succeeded or failed|ContinuousExportName,Result,Database|
|StreamingIngestDuration|Streaming Ingest Duration|Milliseconds|Average|Streaming ingest duration in milliseconds|None|
|StreamingIngestDataRate|Streaming Ingest Data Rate|Count|Average|Streaming ingest data rate (MB per second)|None|
|SteamingIngestRequestRate|Streaming Ingest Request Rate|Count|RateRequestsPerSecond|Streaming ingest request rate (requests per second)|None|
|StreamingIngestResults|Streaming Ingest Result|Count|Average|Streaming ingest result|Result|
|TotalNumberOfConcurrentQueries|Total number of concurrent queries|Count|Total|Total number of concurrent queries|None|
|TotalNumberOfThrottledQueries|Total number of throttled queries|Count|Total|Total number of throttled queries|None|
|TotalNumberOfThrottledCommands|Total number of throttled commands|Count|Total|Total number of throttled commands|CommandType|
|TotalNumberOfExtents|Total number of extents|Count|Total|Total number of data extents|None|
|InstanceCount|Instance Count|Count|Average|Total instance count|None|


## Microsoft.Logic/workflows

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|None|
|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|None|
|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|None|
|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|None|
|RunsCancelled|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|None|
|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|None|
|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|None|
|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|None|
|RunStartThrottledEvents|Run Start Throttled Events|Count|Total|Number of workflow run start throttled events.|None|
|RunFailurePercentage|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|None|
|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|None|
|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|None|
|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|None|
|ActionsFailed|Actions Failed |Count|Total|Number of workflow actions failed.|None|
|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|None|
|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|None|
|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|None|
|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|None|
|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|None|
|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|None|
|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|None|
|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|None|
|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|None|
|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|None|
|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|None|
|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|None|
|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|None|
|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|None|
|BillableActionExecutions|Billable Action Executions|Count|Total|Number of workflow action executions getting billed.|None|
|BillableTriggerExecutions|Billable Trigger Executions|Count|Total|Number of workflow trigger executions getting billed.|None|
|TotalBillableExecutions|Total Billable Executions|Count|Total|Number of workflow executions getting billed.|None|
|BillingUsageNativeOperation|Billing Usage for Native Operation Executions|Count|Total|Number of native operation executions getting billed.|None|
|BillingUsageStandardConnector|Billing Usage for Standard Connector Executions|Count|Total|Number of standard connector executions getting billed.|None|
|BillingUsageStorageConsumption|Billing Usage for Storage Consumption Executions|Count|Total|Number of storage consumption executions getting billed.|None|

## Microsoft.Logic/integrationServiceEnvironments

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|None|
|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|None|
|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|None|
|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|None|
|RunsCancelled|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|None|
|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|None|
|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|None|
|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|None|
|RunStartThrottledEvents|Run Start Throttled Events|Count|Total|Number of workflow run start throttled events.|None|
|RunFailurePercentage|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|None|
|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|None|
|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|None|
|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|None|
|ActionsFailed|Actions Failed |Count|Total|Number of workflow actions failed.|None|
|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|None|
|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|None|
|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|None|
|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|None|
|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|None|
|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|None|
|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|None|
|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|None|
|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|None|
|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|None|
|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|None|
|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|None|
|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|None|
|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|None|
|IntegrationServiceEnvironmentWorkflowProcessorUsage|Workflow Processor Usage for Integration Service Environment|Percent|Average|Workflow processor usage for integration service environment.|None|
|IntegrationServiceEnvironmentWorkflowMemoryUsage|Workflow Memory Usage for Integration Service Environment|Percent|Average|Workflow memory usage for integration service environment.|None|
|IntegrationServiceEnvironmentConnectorProcessorUsage|Connector Processor Usage for Integration Service Environment|Percent|Average|Connector processor usage for integration service environment.|None|
|IntegrationServiceEnvironmentConnectorMemoryUsage|Connector Memory Usage for Integration Service Environment|Percent|Average|Connector memory usage for integration service environment.|None|

## Microsoft.MachineLearningServices/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Cancelled Runs|Cancelled Runs|Count|Total|Number of runs cancelled for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Cancel Requested Runs|Cancel Requested Runs|Count|Total|Number of runs where cancel was requested for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Completed Runs|Completed Runs|Count|Total|Number of runs completed successfully for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Failed Runs|Failed Runs|Count|Total|Number of runs failed for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Finalizing Runs|Finalizing Runs|Count|Total|Number of runs entered finalizing state for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Not Responding Runs|Not Responding Runs|Count|Total|Number of runs not responding for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Not Started Runs|Not Started Runs|Count|Total|Number of runs in not started state for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Preparing Runs|Preparing Runs|Count|Total|Number of runs that are preparing for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Provisioning Runs|Provisioning Runs|Count|Total|Number of runs that are provisioning for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Queued Runs|Queued Runs|Count|Total|Number of runs that are queued for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Started Runs|Started Runs|Count|Total|Number of runs started for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Starting Runs|Starting Runs|Count|Total|Number of runs started for this workspace|Scenario,RunType,PublishedPipelineId,ComputeType,PipelineStepType|
|Errors|Errors|Count|Total|Number of run errors in this workspace|Scenario|
|Warnings|Warnings|Count|Total|Number of run warnings in this workspace|Scenario|
|Model Register Succeeded|Model Register Succeeded|Count|Total|Number of model registrations that succeeded in this workspace|Scenario|
|Model Register Failed|Model Register Failed|Count|Total|Number of model registrations that failed in this workspace|Scenario,StatusCode|
|Model Deploy Started|Model Deploy Started|Count|Total|Number of model deployments started in this workspace|Scenario|
|Model Deploy Succeeded|Model Deploy Succeeded|Count|Total|Number of model deployments that succeeded in this workspace|Scenario|
|Model Deploy Failed|Model Deploy Failed|Count|Total|Number of model deployments that failed in this workspace|Scenario,StatusCode|
|Total Nodes|Total Nodes|Count|Average|Number of total nodes. This total includes some of Active Nodes, Idle Nodes, Unusable Nodes, Premepted Nodes, Leaving Nodes|Scenario,ClusterName|
|Active Nodes|Active Nodes|Count|Average|Number of Acitve nodes. These are the nodes which are actively running a job.|Scenario,ClusterName|
|Idle Nodes|Idle Nodes|Count|Average|Number of idle nodes. Idle nodes are the nodes which are not running any jobs but can accept new job if available.|Scenario,ClusterName|
|Unusable Nodes|Unusable Nodes|Count|Average|Number of unusable nodes. Unusable nodes are not functional due to some unresolvable issue. Azure will recycle these nodes.|Scenario,ClusterName|
|Preempted Nodes|Preempted Nodes|Count|Average|Number of preempted nodes. These nodes are the low priority nodes which are taken away from the available node pool.|Scenario,ClusterName|
|Leaving Nodes|Leaving Nodes|Count|Average|Number of leaving nodes. Leaving nodes are the nodes which just finished processing a job and will go to Idle state.|Scenario,ClusterName|
|Total Cores|Total Cores|Count|Average|Number of total cores|Scenario,ClusterName|
|Active Cores|Active Cores|Count|Average|Number of active cores|Scenario,ClusterName|
|Idle Cores|Idle Cores|Count|Average|Number of idle cores|Scenario,ClusterName|
|Unusable Cores|Unusable Cores|Count|Average|Number of unusable cores|Scenario,ClusterName|
|Preempted Cores|Preempted Cores|Count|Average|Number of preempted cores|Scenario,ClusterName|
|Leaving Cores|Leaving Cores|Count|Average|Number of leaving cores|Scenario,ClusterName|
|Quota Utilization Percentage|Quota Utilization Percentage|Count|Average|Percent of quota utilized|Scenario,ClusterName,VmFamilyName,VmPriority|
|CpuUtilization|CpuUtilization|Count|Average|CPU (Preview)|Scenario,runId,NodeId,CreatedTime|
|GpuUtilization|GpuUtilization|Count|Average|GPU (Preview)|Scenario,runId,NodeId,CreatedTime,DeviceId|


## Microsoft.Maps/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Usage|Usage|Count|Count|Count of API calls|ApiCategory,ApiName,ResultType,ResponseCode|
|Availability|Availability|Percent|Average|Availability of the APIs|ApiCategory,ApiName|

## Microsoft.Media/mediaservices/streamingEndpoints

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Egress|Egress|Bytes|Total|The amount of Egress data, in bytes.|OutputFormat|
|SuccessE2ELatency|Success end to end Latency|Milliseconds|Average|The average latency for successful requests in milliseconds.|OutputFormat|
|Requests|Requests|Count|Total|Requests to a Streaming Endpoint.|OutputFormat,HttpStatusCode,ErrorCode|


## Microsoft.Media/mediaservices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AssetQuota|Asset quota|Count|Average|How many assets are allowed for current media service account|None|
|AssetCount|Asset count|Count|Average|How many assets are already created in current media service account|None|
|AssetQuotaUsedPercentage|Asset quota used percentage|Percent|Average|Asset used percentage in current media service account|None|
|ContentKeyPolicyQuota|Content Key Policy quota|Count|Average|How many content key polices are allowed for current media service account|None|
|ContentKeyPolicyCount|Content Key Policy count|Count|Average|How many content key policies are already created in current media service account|None|
|ContentKeyPolicyQuotaUsedPercentage|Content Key Policy quota used percentage|Percent|Average|Content Key Policy used percentage in current media service account|None|
|StreamingPolicyQuota|Streaming Policy quota|Count|Average|How many streaming policies are allowed for current media service account|None|
|StreamingPolicyCount|Streaming Policy count|Count|Average|How many streaming policies are already created in current media service account|None|
|StreamingPolicyQuotaUsedPercentage|Streaming Policy quota used percentage|Percent|Average|Streaming Policy used percentage in current media service account|None|


## Microsoft.MixedReality/remoteRenderingAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AssetsConverted|Assets Converted|Count|Total|Total number of assets converted|AppId,ResourceId,SDKVersion|
|ActiveRenderingSessions|Active Rendering Sessions|Count|Total|Total number of active rendering sessions|AppId,ResourceId,SessionType,SDKVersion|

## Microsoft.NetApp/netAppAccounts/capacityPools/volumes

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AverageReadLatency|Average read latency|MilliSeconds|Average|Average read latency in milliseconds per operation|None|
|AverageWriteLatency|Average write latency|MilliSeconds|Average|Average write latency in milliseconds per operation|None|
|VolumeLogicalSize|Volume Consumed Size|Bytes|Average|Logical size of the volume (used bytes)|None|
|VolumeSnapshotSize|Volume snapshot size|Bytes|Average|Size of all snapshots in volume|None|
|ReadIops|Read iops|CountPerSecond|Average|Read In/out operations per second|None|
|WriteIops|Write iops|CountPerSecond|Average|Write In/out operations per second|None|

## Microsoft.NetApp/netAppAccounts/capacityPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|VolumePoolAllocatedUsed|Pool Allocated To Volume Size|Bytes|Average|Allocated used size of the pool|None|
|VolumePoolTotalLogicalSize|Pool Consumed Size|Bytes|Average|Sum of the logical size of all the volumes belonging to the pool|None|

## Microsoft.Network/networkInterfaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BytesSentRate|Bytes Sent|Bytes|Total|Number of bytes the Network Interface sent|None|
|BytesReceivedRate|Bytes Received|Bytes|Total|Number of bytes the Network Interface received|None|
|PacketsSentRate|Packets Sent|Count|Total|Number of packets the Network Interface sent|None|
|PacketsReceivedRate|Packets Received|Count|Total|Number of packets the Network Interface received|None|

## Microsoft.Network/loadBalancers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|VipAvailability|Data Path Availability|Count|Average|Average Load Balancer data path availability per time duration|FrontendIPAddress,FrontendPort|
|DipAvailability|Health Probe Status|Count|Average|Average Load Balancer health probe status per time duration|ProtocolType,BackendPort,FrontendIPAddress,FrontendPort,BackendIPAddress|
|ByteCount|Byte Count|Count|Total|Total number of Bytes transmitted within time period|FrontendIPAddress,FrontendPort,Direction|
|PacketCount|Packet Count|Count|Total|Total number of Packets transmitted within time period|FrontendIPAddress,FrontendPort,Direction|
|SYNCount|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|FrontendIPAddress,FrontendPort,Direction|
|SnatConnectionCount|SNAT Connection Count|Count|Total|Total number of new SNAT connections created within time period|FrontendIPAddress,BackendIPAddress,ConnectionState|
|AllocatedSnatPorts|Allocated SNAT Ports (Preview)|Count|Total|Total number of SNAT ports allocated within time period|FrontendIPAddress,BackendIPAddress,ProtocolType,IsAwaitingRemoval|
|UsedSnatPorts|Used SNAT Ports (Preview)|Count|Total|Total number of SNAT ports used within time period|FrontendIPAddress,BackendIPAddress,ProtocolType,IsAwaitingRemoval|

## Microsoft.Network/dnszones

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueryVolume|Query Volume|Count|Total|Number of queries served for a DNS zone|None|
|RecordSetCount|Record Set Count|Count|Maximum|Number of Record Sets in a DNS zone|None|
|RecordSetCapacityUtilization|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a DNS zone|None|


## Microsoft.Network/publicIPAddresses

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PacketsInDDoS|Inbound packets DDoS|CountPerSecond|Maximum|Inbound packets DDoS|None|
|PacketsDroppedDDoS|Inbound packets dropped DDoS|CountPerSecond|Maximum|Inbound packets dropped DDoS|None|
|PacketsForwardedDDoS|Inbound packets forwarded DDoS|CountPerSecond|Maximum|Inbound packets forwarded DDoS|None|
|TCPPacketsInDDoS|Inbound TCP packets DDoS|CountPerSecond|Maximum|Inbound TCP packets DDoS|None|
|TCPPacketsDroppedDDoS|Inbound TCP packets dropped DDoS|CountPerSecond|Maximum|Inbound TCP packets dropped DDoS|None|
|TCPPacketsForwardedDDoS|Inbound TCP packets forwarded DDoS|CountPerSecond|Maximum|Inbound TCP packets forwarded DDoS|None|
|UDPPacketsInDDoS|Inbound UDP packets DDoS|CountPerSecond|Maximum|Inbound UDP packets DDoS|None|
|UDPPacketsDroppedDDoS|Inbound UDP packets dropped DDoS|CountPerSecond|Maximum|Inbound UDP packets dropped DDoS|None|
|UDPPacketsForwardedDDoS|Inbound UDP packets forwarded DDoS|CountPerSecond|Maximum|Inbound UDP packets forwarded DDoS|None|
|BytesInDDoS|Inbound bytes DDoS|BytesPerSecond|Maximum|Inbound bytes DDoS|None|
|BytesDroppedDDoS|Inbound bytes dropped DDoS|BytesPerSecond|Maximum|Inbound bytes dropped DDoS|None|
|BytesForwardedDDoS|Inbound bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound bytes forwarded DDoS|None|
|TCPBytesInDDoS|Inbound TCP bytes DDoS|BytesPerSecond|Maximum|Inbound TCP bytes DDoS|None|
|TCPBytesDroppedDDoS|Inbound TCP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound TCP bytes dropped DDoS|None|
|TCPBytesForwardedDDoS|Inbound TCP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound TCP bytes forwarded DDoS|None|
|UDPBytesInDDoS|Inbound UDP bytes DDoS|BytesPerSecond|Maximum|Inbound UDP bytes DDoS|None|
|UDPBytesDroppedDDoS|Inbound UDP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound UDP bytes dropped DDoS|None|
|UDPBytesForwardedDDoS|Inbound UDP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound UDP bytes forwarded DDoS|None|
|IfUnderDDoSAttack|Under DDoS attack or not|Count|Maximum|Under DDoS attack or not|None|
|DDoSTriggerTCPPackets|Inbound TCP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound TCP packets to trigger DDoS mitigation|None|
|DDoSTriggerUDPPackets|Inbound UDP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound UDP packets to trigger DDoS mitigation|None|
|DDoSTriggerSYNPackets|Inbound SYN packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound SYN packets to trigger DDoS mitigation|None|
|VipAvailability|Data Path Availability|Count|Average|Average IP Address availability per time duration|Port|
|ByteCount|Byte Count|Count|Total|Total number of Bytes transmitted within time period|Port,Direction|
|PacketCount|Packet Count|Count|Total|Total number of Packets transmitted within time period|Port,Direction|
|SynCount|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|Port,Direction|



## Microsoft.Network/virtualNetworks

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PingMeshAverageRoundtripMs|Round trip time for Pings to a VM|MilliSeconds|Average|Round trip time for Pings sent to a destination VM|SourceCustomerAddress,DestinationCustomerAddress|
|PingMeshProbesFailedPercent|Failed Pings to a VM|Percent|Average|Percent of number of failed Pings to total sent Pings of a destination VM|SourceCustomerAddress,DestinationCustomerAddress|


## Microsoft.Network/azurefirewalls

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ApplicationRuleHit|Application rules hit count|Count|Total|Number of times Application rules were hit|Status,Reason,Protocol|
|NetworkRuleHit|Network rules hit count|Count|Total|Number of times Network rules were hit|Status,Reason,Protocol|
|FirewallHealth|Firewall health state|Percent|Average|Firewall health state|Status,Reason|
|DataProcessed|Data processed|Bytes|Total|Total amount of data processed by Firewall|None|
|SNATPortUtilization|SNAT port utilization|Percent|Average|SNAT port utilization|None|


## Microsoft.Network/applicationGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Throughput|Throughput|BytesPerSecond|Average|Number of bytes per second the Application Gateway has served|None|
|UnhealthyHostCount|Unhealthy Host Count|Count|Average|Number of unhealthy backend hosts|BackendSettingsPool|
|HealthyHostCount|Healthy Host Count|Count|Average|Number of healthy backend hosts|BackendSettingsPool|
|TotalRequests|Total Requests|Count|Total|Count of successful requests that Application Gateway has served|BackendSettingsPool|
|AvgRequestCountPerHealthyHost|Requests per minute per Healthy Host|Count|Average|Average request count per minute per healthy backend host in a pool|BackendSettingsPool|
|FailedRequests|Failed Requests|Count|Total|Count of failed requests that Application Gateway has served|BackendSettingsPool|
|ResponseStatus|Response Status|Count|Total|Http response status returned by Application Gateway|HttpStatusGroup|
|CurrentConnections|Current Connections|Count|Total|Count of current connections established with Application Gateway|None|
|NewConnectionsPerSecond|New connections per second|CountPerSecond|Average|New connections per second established with Application Gateway|None|
|CpuUtilization|CPU Utilization|Percent|Average|Current CPU utilization of the Application Gateway|None|
|CapacityUnits|Current Capacity Units|Count|Average|Capacity Units consumed|None|
|FixedBillableCapacityUnits|Fixed Billable Capacity Units|Count|Average|Minimum capacity units that will be charged|None|
|EstimatedBilledCapacityUnits|Estimated Billed Capacity Units|Count|Average|Estimated capacity units that will be charged|None|
|ComputeUnits|Current Compute Units|Count|Average|Compute Units consumed|None|
|BackendResponseStatus|Backend Response Status|Count|Total|The number of HTTP response codes generated by the backend members. This does not include any response codes generated by the Application Gateway.|BackendServer,BackendPool,BackendHttpSetting,HttpStatusGroup|
|TlsProtocol|Client TLS Protocol|Count|Total|The number of TLS and non-TLS requests initiated by the client that established connection with the Application Gateway. To view TLS protocol distribution, filter by the dimension TLS Protocol.|Listener,TlsProtocol|
|BytesSent|Bytes Sent|Bytes|Total|The total number of bytes sent by the Application Gateway to the clients|Listener|
|BytesReceived|Bytes Received|Bytes|Total|The total number of bytes received by the Application Gateway from the clients|Listener|
|ClientRtt|Client RTT|MilliSeconds|Average|Average round trip time between clients and Application Gateway. This metric indicates how long it takes to establish connections and return acknowledgements|Listener|
|ApplicationGatewayTotalTime|Application Gateway Total Time|MilliSeconds|Average|Average time that it takes for a request to be processed and its response to be sent. This is calculated as average of the interval from the time when Application Gateway receives the first byte of an HTTP request to the time when the response send operation finishes. It's important to note that this usually includes the Application Gateway processing time, time that the request and response packets are traveling over the network and the time the backend server took to respond.|Listener|
|BackendConnectTime|Backend Connect Time|MilliSeconds|Average|Time spent establishing a connection with a backend server|Listener,BackendServer,BackendPool,BackendHttpSetting|
|BackendFirstByteResponseTime|Backend First Byte Response Time|MilliSeconds|Average|Time interval between start of establishing a connection to backend server and receiving the first byte of the response header, approximating processing time of backend server|Listener,BackendServer,BackendPool,BackendHttpSetting|
|BackendLastByteResponseTime|Backend Last Byte Response Time|MilliSeconds|Average|Time interval between start of establishing a connection to backend server and receiving the last byte of the response body|Listener,BackendServer,BackendPool,BackendHttpSetting|
|MatchedCount|Web Application Firewall v1 Total Rule Distribution|Count|Total|Web Application Firewall v1 Total Rule Distribution for the incoming traffic|RuleGroup,RuleId|
|BlockedCount|Web Application Firewall v1 Blocked Requests Rule Distribution|Count|Total|Web Application Firewall v1 blocked requests rule distribution|RuleGroup,RuleId|
|BlockedReqCount|Web Application Firewall v1 Blocked Requests Count|Count|Total|Web Application Firewall v1 blocked requests count|None|


## Microsoft.Network/virtualNetworkGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AverageBandwidth|Gateway S2S Bandwidth|BytesPerSecond|Average|Average site-to-site bandwidth of a gateway in bytes per second|None|
|P2SBandwidth|Gateway P2S Bandwidth|BytesPerSecond|Average|Average point-to-site bandwidth of a gateway in bytes per second|None|
|P2SConnectionCount|P2S Connection Count|Count|Maximum|Point-to-site connection count of a gateway|Protocol|
|TunnelAverageBandwidth|Tunnel Bandwidth|BytesPerSecond|Average|Average bandwidth of a tunnel in bytes per second|ConnectionName,RemoteIP|
|TunnelEgressBytes|Tunnel Egress Bytes|Bytes|Total|Outgoing bytes of a tunnel|ConnectionName,RemoteIP|
|TunnelIngressBytes|Tunnel Ingress Bytes|Bytes|Total|Incoming bytes of a tunnel|ConnectionName,RemoteIP|
|TunnelEgressPackets|Tunnel Egress Packets|Count|Total|Outgoing packet count of a tunnel|ConnectionName,RemoteIP|
|TunnelIngressPackets|Tunnel Ingress Packets|Count|Total|Incoming packet count of a tunnel|ConnectionName,RemoteIP|
|TunnelEgressPacketDropTSMismatch|Tunnel Egress TS Mismatch Packet Drop|Count|Total|Outgoing packet drop count from traffic selector mismatch of a tunnel|ConnectionName,RemoteIP|
|TunnelIngressPacketDropTSMismatch|Tunnel Ingress TS Mismatch Packet Drop|Count|Total|Incoming packet drop count from traffic selector mismatch of a tunnel|ConnectionName,RemoteIP|


## Microsoft.Network/expressRoutePorts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RxLightLevel|RxLightLevel|Count|Average|Rx Light level in dBm|Link,Lane|
|TxLightLevel|TxLightLevel|Count|Average|Tx light level in dBm|Link,Lane|
|AdminState|AdminState|Count|Average|Admin state of the port|Link|
|LineProtocol|LineProtocol|Count|Average|Line protocol status of the port|Link|
|PortBitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|Link|
|PortBitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|Link|



## Microsoft.Network/expressRouteCircuits

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|PeeringType|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|PeeringType|
|GlobalReachBitsInPerSecond|GlobalReachBitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|PeeredCircuitSKey|
|GlobalReachBitsOutPerSecond|GlobalReachBitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|PeeredCircuitSKey|
|BgpAvailability|Bgp Availability|Percent|Average|BGP Availability from MSEE towards all peers.|PeeringType,Peer|
|ArpAvailability|Arp Availability|Percent|Average|ARP Availability from MSEE towards all peers.|PeeringType,Peer|
|QosDropBitsInPerSecond|DroppedInBitsPerSecond|CountPerSecond|Average|Ingress bits of data dropped per second|None|
|QosDropBitsOutPerSecond|DroppedOutBitsPerSecond|CountPerSecond|Average|Egress bits of data dropped per second|None|

## Microsoft.Network/expressRouteCircuits/peerings

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|None|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|None|

## Microsoft.Network/connections

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|None|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|None|

## Microsoft.Network/expressRouteGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ErGatewayConnectionBitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|ConnectionName|
|ErGatewayConnectionBitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|ConnectionName|

## Microsoft.Network/trafficManagerProfiles

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QpsByEndpoint|Queries by Endpoint Returned|Count|Total|Number of times a Traffic Manager endpoint was returned in the given time frame|EndpointName|
|ProbeAgentCurrentEndpointStateByProfileResourceId|Endpoint Status by Endpoint|Count|Maximum|1 if an endpoint's probe status is "Enabled", 0 otherwise.|EndpointName|



## Microsoft.Network/networkWatchers/connectionMonitors

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ProbesFailedPercent|% Probes Failed|Percent|Average|% of connectivity monitoring probes failed|None|
|AverageRoundtripMs|Avg. Round-trip Time (ms)|MilliSeconds|Average|Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination|None|
|ChecksFailedPercent|Checks Failed Percent (Preview)|Percent|Average|% of connectivity monitoring checks failed|SourceAddress,SourceName,SourceResourceId,SourceType,Protocol,DestinationAddress,DestinationName,DestinationResourceId,DestinationType,DestinationPort,TestGroupName,TestConfigurationName|
|RoundTripTimeMs|Round-Trip Time (ms) (Preview)|MilliSeconds|Average|Round-trip time in milliseconds for the connectivity monitoring checks|SourceAddress,SourceName,SourceResourceId,SourceType,Protocol,DestinationAddress,DestinationName,DestinationResourceId,DestinationType,DestinationPort,TestGroupName,TestConfigurationName|


## Microsoft.Network/frontdoors

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RequestCount|Request Count|Count|Total|The number of client requests served by the HTTP/S proxy|HttpStatus,HttpStatusGroup,ClientRegion,ClientCountry|
|RequestSize|Request Size|Bytes|Total|The number of bytes sent as requests from clients to the HTTP/S proxy|HttpStatus,HttpStatusGroup,ClientRegion,ClientCountry|
|ResponseSize|Response Size|Bytes|Total|The number of bytes sent as responses from HTTP/S proxy to clients|HttpStatus,HttpStatusGroup,ClientRegion,ClientCountry|
|BillableResponseSize|Billable Response Size|Bytes|Total|The number of billable bytes (minimum 2KB per request) sent as responses from HTTP/S proxy to clients.|HttpStatus,HttpStatusGroup,ClientRegion,ClientCountry|
|BackendRequestCount|Backend Request Count|Count|Total|The number of requests sent from the HTTP/S proxy to backends|HttpStatus,HttpStatusGroup,Backend|
|BackendRequestLatency|Backend Request Latency|MilliSeconds|Average|The time calculated from when the request was sent by the HTTP/S proxy to the backend until the HTTP/S proxy received the last response byte from the backend|Backend|
|TotalLatency|Total Latency|MilliSeconds|Average|The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy|HttpStatus,HttpStatusGroup,ClientRegion,ClientCountry|
|BackendHealthPercentage|Backend Health Percentage|Percent|Average|The percentage of successful health probes from the HTTP/S proxy to backends|Backend,BackendPool|
|WebApplicationFirewallRequestCount|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName,RuleName,Action|


## Microsoft.Network/privateDnsZones

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueryVolume|Query Volume|Count|Total|Number of queries served for a Private DNS zone|None|
|RecordSetCount|Record Set Count|Count|Maximum|Number of Record Sets in a Private DNS zone|None|
|RecordSetCapacityUtilization|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a Private DNS zone|None|
|VirtualNetworkLinkCount|Virtual Network Link Count|Count|Maximum|Number of Virtual Networks linked to a Private DNS zone|None|
|VirtualNetworkLinkCapacityUtilization|Virtual Network Link Capacity Utilization|Percent|Maximum|Percent of Virtual Network Link capacity utilized by a Private DNS zone|None|
|VirtualNetworkWithRegistrationLinkCount|Virtual Network Registration Link Count|Count|Maximum|Number of Virtual Networks linked to a Private DNS zone with auto-registration enabled|None|
|VirtualNetworkWithRegistrationCapacityUtilization|Virtual Network Registration Link Capacity Utilization|Percent|Maximum|Percent of Virtual Network Link with auto-registration capacity utilized by a Private DNS zone|None|

## Microsoft.NotificationHubs/Namespaces/NotificationHubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|registration.all|Registration Operations|Count|Total|The count of all successful registration operations (creations updates queries and deletions). |None|
|registration.create|Registration Create Operations|Count|Total|The count of all successful registration creations.|None|
|registration.update|Registration Update Operations|Count|Total|The count of all successful registration updates.|None|
|registration.get|Registration Read Operations|Count|Total|The count of all successful registration queries.|None|
|registration.delete|Registration Delete Operations|Count|Total|The count of all successful registration deletions.|None|
|incoming|Incoming Messages|Count|Total|The count of all successful send API calls. |None|
|incoming.scheduled|Scheduled Push Notifications Sent|Count|Total|Scheduled Push Notifications Cancelled|None|
|incoming.scheduled.cancel|Scheduled Push Notifications Cancelled|Count|Total|Scheduled Push Notifications Cancelled|None|
|scheduled.pending|Pending Scheduled Notifications|Count|Total|Pending Scheduled Notifications|None|
|installation.all|Installation Management Operations|Count|Total|Installation Management Operations|None|
|installation.get|Get Installation Operations|Count|Total|Get Installation Operations|None|
|installation.upsert|Create or Update Installation Operations|Count|Total|Create or Update Installation Operations|None|
|installation.patch|Patch Installation Operations|Count|Total|Patch Installation Operations|None|
|installation.delete|Delete Installation Operations|Count|Total|Delete Installation Operations|None|
|outgoing.allpns.success|Successful notifications|Count|Total|The count of all successful notifications.|None|
|outgoing.allpns.invalidpayload|Payload Errors|Count|Total|The count of pushes that failed because the PNS returned a bad payload error.|None|
|outgoing.allpns.pnserror|External Notification System Errors|Count|Total|The count of pushes that failed because there was a problem communicating with the PNS (excludes authentication problems).|None|
|outgoing.allpns.channelerror|Channel Errors|Count|Total|The count of pushes that failed because the channel was invalid not associated with the correct app throttled or expired.|None|
|outgoing.allpns.badorexpiredchannel|Bad or Expired Channel Errors|Count|Total|The count of pushes that failed because the channel/token/registrationId in the registration was expired or invalid.|None|
|outgoing.wns.success|WNS Successful Notifications|Count|Total|The count of all successful notifications.|None|
|outgoing.wns.invalidcredentials|WNS Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. (Windows Live does not recognize the credentials).|None|
|outgoing.wns.badchannel|WNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (WNS status: 404 not found).|None|
|outgoing.wns.expiredchannel|WNS Expired Channel Error|Count|Total|The count of pushes that failed because the ChannelURI is expired (WNS status: 410 Gone).|None|
|outgoing.wns.throttled|WNS Throttled Notifications|Count|Total|The count of pushes that failed because WNS is throttling this app (WNS status: 406 Not Acceptable).|None|
|outgoing.wns.tokenproviderunreachable|WNS Authorization Errors (Unreachable)|Count|Total|Windows Live is not reachable.|None|
|outgoing.wns.invalidtoken|WNS Authorization Errors (Invalid Token)|Count|Total|The token provided to WNS is not valid (WNS status: 401 Unauthorized).|None|
|outgoing.wns.wrongtoken|WNS Authorization Errors (Wrong Token)|Count|Total|The token provided to WNS is valid but for another application (WNS status: 403 Forbidden). This can happen if the ChannelURI in the registration is associated with another app. Check that the client app is associated with the same app whose credentials are in the notification hub.|None|
|outgoing.wns.invalidnotificationformat|WNS Invalid Notification Format|Count|Total|The format of the notification is invalid (WNS status: 400). Note that WNS does not reject all invalid payloads.|None|
|outgoing.wns.invalidnotificationsize|WNS Invalid Notification Size Error|Count|Total|The notification payload is too large (WNS status: 413).|None|
|outgoing.wns.channelthrottled|WNS Channel Throttled|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-NotificationStatus:channelThrottled).|None|
|outgoing.wns.channeldisconnected|WNS Channel Disconnected|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-DeviceConnectionStatus: disconnected).|None|
|outgoing.wns.dropped|WNS Dropped Notifications|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (X-WNS-NotificationStatus: dropped but not X-WNS-DeviceConnectionStatus: disconnected).|None|
|outgoing.wns.pnserror|WNS Errors|Count|Total|Notification not delivered because of errors communicating with WNS.|None|
|outgoing.wns.authenticationerror|WNS Authentication Errors|Count|Total|Notification not delivered because of errors communicating with Windows Live invalid credentials or wrong token.|None|
|outgoing.apns.success|APNS Successful Notifications|Count|Total|The count of all successful notifications.|None|
|outgoing.apns.invalidcredentials|APNS Authorization Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|None|
|outgoing.apns.badchannel|APNS Bad Channel Error|Count|Total|The count of pushes that failed because the token is invalid (APNS status code: 8).|None|
|outgoing.apns.expiredchannel|APNS Expired Channel Error|Count|Total|The count of token that were invalidated by the APNS feedback channel.|None|
|outgoing.apns.invalidnotificationsize|APNS Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (APNS status code: 7).|None|
|outgoing.apns.pnserror|APNS Errors|Count|Total|The count of pushes that failed because of errors communicating with APNS.|None|
|outgoing.gcm.success|GCM Successful Notifications|Count|Total|The count of all successful notifications.|None|
|outgoing.gcm.invalidcredentials|GCM Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|None|
|outgoing.gcm.badchannel|GCM Bad Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was not recognized (GCM result: Invalid Registration).|None|
|outgoing.gcm.expiredchannel|GCM Expired Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was expired (GCM result: NotRegistered).|None|
|outgoing.gcm.throttled|GCM Throttled Notifications|Count|Total|The count of pushes that failed because GCM throttled this app (GCM status code: 501-599 or result:Unavailable).|None|
|outgoing.gcm.invalidnotificationformat|GCM Invalid Notification Format|Count|Total|The count of pushes that failed because the payload was not formatted correctly (GCM result: InvalidDataKey or InvalidTtl).|None|
|outgoing.gcm.invalidnotificationsize|GCM Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (GCM result: MessageTooBig).|None|
|outgoing.gcm.wrongchannel|GCM Wrong Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration is not associated to the current app (GCM result: InvalidPackageName).|None|
|outgoing.gcm.pnserror|GCM Errors|Count|Total|The count of pushes that failed because of errors communicating with GCM.|None|
|outgoing.gcm.authenticationerror|GCM Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials the credentials are blocked or the SenderId is not correctly configured in the app (GCM result: MismatchedSenderId).|None|
|outgoing.mpns.success|MPNS Successful Notifications|Count|Total|The count of all successful notifications.|None|
|outgoing.mpns.invalidcredentials|MPNS Invalid Credentials|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|None|
|outgoing.mpns.badchannel|MPNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (MPNS status: 404 not found).|None|
|outgoing.mpns.throttled|MPNS Throttled Notifications|Count|Total|The count of pushes that failed because MPNS is throttling this app (WNS MPNS: 406 Not Acceptable).|None|
|outgoing.mpns.invalidnotificationformat|MPNS Invalid Notification Format|Count|Total|The count of pushes that failed because the payload of the notification was too large.|None|
|outgoing.mpns.channeldisconnected|MPNS Channel Disconnected|Count|Total|The count of pushes that failed because the ChannelURI in the registration was disconnected (MPNS status: 412 not found).|None|
|outgoing.mpns.dropped|MPNS Dropped Notifications|Count|Total|The count of pushes that were dropped by MPNS (MPNS response header: X-NotificationStatus: QueueFull or Suppressed).|None|
|outgoing.mpns.pnserror|MPNS Errors|Count|Total|The count of pushes that failed because of errors communicating with MPNS.|None|
|outgoing.mpns.authenticationerror|MPNS Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|None|
|notificationhub.pushes|All Outgoing Notifications|Count|Total|All outgoing notifications of the notification hub|None|
|incoming.all.requests|All Incoming Requests|Count|Total|Total incoming requests for a notification hub|None|
|incoming.all.failedrequests|All Incoming Failed Requests|Count|Total|Total incoming failed requests for a notification hub|None|

## Microsoft.OperationalInsights/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Average_% Free Inodes|% Free Inodes|Count|Average|Average_% Free Inodes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Free Space|% Free Space|Count|Average|Average_% Free Space|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Used Inodes|% Used Inodes|Count|Average|Average_% Used Inodes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Used Space|% Used Space|Count|Average|Average_% Used Space|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Disk Read Bytes/sec|Disk Read Bytes/sec|Count|Average|Average_Disk Read Bytes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Disk Reads/sec|Disk Reads/sec|Count|Average|Average_Disk Reads/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Disk Transfers/sec|Disk Transfers/sec|Count|Average|Average_Disk Transfers/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Disk Write Bytes/sec|Disk Write Bytes/sec|Count|Average|Average_Disk Write Bytes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Disk Writes/sec|Disk Writes/sec|Count|Average|Average_Disk Writes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Free Megabytes|Free Megabytes|Count|Average|Average_Free Megabytes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Logical Disk Bytes/sec|Logical Disk Bytes/sec|Count|Average|Average_Logical Disk Bytes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Available Memory|% Available Memory|Count|Average|Average_% Available Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Available Swap Space|% Available Swap Space|Count|Average|Average_% Available Swap Space|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Used Memory|% Used Memory|Count|Average|Average_% Used Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Used Swap Space|% Used Swap Space|Count|Average|Average_% Used Swap Space|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Available MBytes Memory|Available MBytes Memory|Count|Average|Average_Available MBytes Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Available MBytes Swap|Available MBytes Swap|Count|Average|Average_Available MBytes Swap|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Page Reads/sec|Page Reads/sec|Count|Average|Average_Page Reads/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Page Writes/sec|Page Writes/sec|Count|Average|Average_Page Writes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Pages/sec|Pages/sec|Count|Average|Average_Pages/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Used MBytes Swap Space|Used MBytes Swap Space|Count|Average|Average_Used MBytes Swap Space|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Used Memory MBytes|Used Memory MBytes|Count|Average|Average_Used Memory MBytes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Bytes Transmitted|Total Bytes Transmitted|Count|Average|Average_Total Bytes Transmitted|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Bytes Received|Total Bytes Received|Count|Average|Average_Total Bytes Received|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Bytes|Total Bytes|Count|Average|Average_Total Bytes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Packets Transmitted|Total Packets Transmitted|Count|Average|Average_Total Packets Transmitted|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Packets Received|Total Packets Received|Count|Average|Average_Total Packets Received|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Rx Errors|Total Rx Errors|Count|Average|Average_Total Rx Errors|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Tx Errors|Total Tx Errors|Count|Average|Average_Total Tx Errors|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Total Collisions|Total Collisions|Count|Average|Average_Total Collisions|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Avg. Disk sec/Read|Avg. Disk sec/Read|Count|Average|Average_Avg. Disk sec/Read|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Avg. Disk sec/Transfer|Avg. Disk sec/Transfer|Count|Average|Average_Avg. Disk sec/Transfer|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Avg. Disk sec/Write|Avg. Disk sec/Write|Count|Average|Average_Avg. Disk sec/Write|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Physical Disk Bytes/sec|Physical Disk Bytes/sec|Count|Average|Average_Physical Disk Bytes/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Pct Privileged Time|Pct Privileged Time|Count|Average|Average_Pct Privileged Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Pct User Time|Pct User Time|Count|Average|Average_Pct User Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Used Memory kBytes|Used Memory kBytes|Count|Average|Average_Used Memory kBytes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Virtual Shared Memory|Virtual Shared Memory|Count|Average|Average_Virtual Shared Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% DPC Time|% DPC Time|Count|Average|Average_% DPC Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Idle Time|% Idle Time|Count|Average|Average_% Idle Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Interrupt Time|% Interrupt Time|Count|Average|Average_% Interrupt Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% IO Wait Time|% IO Wait Time|Count|Average|Average_% IO Wait Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Nice Time|% Nice Time|Count|Average|Average_% Nice Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Privileged Time|% Privileged Time|Count|Average|Average_% Privileged Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Processor Time|% Processor Time|Count|Average|Average_% Processor Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% User Time|% User Time|Count|Average|Average_% User Time|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Free Physical Memory|Free Physical Memory|Count|Average|Average_Free Physical Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Free Space in Paging Files|Free Space in Paging Files|Count|Average|Average_Free Space in Paging Files|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Free Virtual Memory|Free Virtual Memory|Count|Average|Average_Free Virtual Memory|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Processes|Processes|Count|Average|Average_Processes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Size Stored In Paging Files|Size Stored In Paging Files|Count|Average|Average_Size Stored In Paging Files|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Uptime|Uptime|Count|Average|Average_Uptime|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Users|Users|Count|Average|Average_Users|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Current Disk Queue Length|Current Disk Queue Length|Count|Average|Average_Current Disk Queue Length|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Available MBytes|Available MBytes|Count|Average|Average_Available MBytes|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_% Committed Bytes In Use|% Committed Bytes In Use|Count|Average|Average_% Committed Bytes In Use|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Bytes Received/sec|Bytes Received/sec|Count|Average|Average_Bytes Received/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Bytes Sent/sec|Bytes Sent/sec|Count|Average|Average_Bytes Sent/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Bytes Total/sec|Bytes Total/sec|Count|Average|Average_Bytes Total/sec|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Average_Processor Queue Length|Processor Queue Length|Count|Average|Average_Processor Queue Length|Computer,ObjectName,InstanceName,CounterPath,SourceSystem|
|Heartbeat|Heartbeat|Count|Total|Heartbeat|Computer,OSType,Version,SourceComputerId|
|Update|Update|Count|Average|Update|Computer,Product,Classification,UpdateState,Optional,Approved|
|Event|Event|Count|Average|Event|Source,EventLog,Computer,EventCategory,EventLevel,EventLevelName,EventID|

## Microsoft.Peering/peeringServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PrefixLatency|Prefix Latency|Milliseconds|Average|Median prefix latency|PrefixName|

## Microsoft.Peering/peerings

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SessionAvailabilityV4|Session Availability V4|Percent|Average|Availability of the V4 session|ConnectionId|
|SessionAvailabilityV6|Session Availability V6|Percent|Average|Availability of the V6 session|ConnectionId|
|IngressTrafficRate|Ingress Traffic Rate|BitsPerSecond|Average|Ingress traffic rate in bits per second|ConnectionId|
|EgressTrafficRate|Egress Traffic Rate|BitsPerSecond|Average|Egress traffic rate in bits per second|ConnectionId|


## Microsoft.PowerBIDedicated/capacities

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueryDuration|Query Duration|Milliseconds|Average|DAX Query duration in last interval|No Dimensions|
|QueryPoolJobQueueLength|Threads: Query pool job queue length|Count|Average|Number of jobs in the queue of the query thread pool.|No Dimensions|
|qpu_high_utilization_metric|QPU High Utilization|Count|Total|QPU High Utilization In Last Minute, 1 For High QPU Utilization, Otherwise 0|No Dimensions|
|memory_metric|Memory|Bytes|Average|Memory. Range 0-3 GB for A1, 0-5 GB for A2, 0-10 GB for A3, 0-25 GB for A4, 0-50 GB for A5 and 0-100 GB for A6|No Dimensions|
|memory_thrashing_metric|Memory Thrashing|Percent|Average|Average memory thrashing.|No Dimensions|


## Microsoft.ProjectBabylon/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AssetDistributionByClassification|Asset distribution by classification|Count|Total|Indicates the number of assets with a certain classification assigned, i.e. they are classified with that label.|Classification,Source,ResourceId|
|AssetDistributionByStorageType|Asset distribution by storage type|Count|Total|Indicates the number of assets with a certain storage type.|StorageType,ResourceId|
|CatalogActiveUsers|Daily Active Users|Count|Total|Number of active users daily|ResourceId|
|CatalogUsage|Usage Distribution by Operation|Count|Total|Indicate the number of operation user makes to the catalog, i.e., Access, Search, Glossary.|Operation,ResourceId|
|NumberOfAssetsWithClassifications|Number of assets with at least one classification|Count|Average|Indicates the number of assets with at least one tag classification.|ResourceId|
|ScanCancelled|Scan Cancelled|Count|Total|Indicates the number of scans cancelled.|ResourceId|
|ScanCompleted|Scan Completed|Count|Total|Indicates the number of scans completed successfully.|ResourceId|
|ScanFailed|Scan Failed|Count|Total|Indicates the number of scans failed.|ResourceId|
|ScanTimeTaken|Scan time taken|Seconds|Total|Indicates the total scan time in seconds.|ResourceId|




## Microsoft.Relay/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ListenerConnections-Success|ListenerConnections-Success|Count|Total|Successful ListenerConnections for Microsoft.Relay.|EntityName,OperationResult|
|ListenerConnections-ClientError|ListenerConnections-ClientError|Count|Total|ClientError on ListenerConnections for Microsoft.Relay.|EntityName,OperationResult|
|ListenerConnections-ServerError|ListenerConnections-ServerError|Count|Total|ServerError on ListenerConnections for Microsoft.Relay.|EntityName,OperationResult|
|SenderConnections-Success|SenderConnections-Success|Count|Total|Successful SenderConnections for Microsoft.Relay.|EntityName,OperationResult|
|SenderConnections-ClientError|SenderConnections-ClientError|Count|Total|ClientError on SenderConnections for Microsoft.Relay.|EntityName,OperationResult|
|SenderConnections-ServerError|SenderConnections-ServerError|Count|Total|ServerError on SenderConnections for Microsoft.Relay.|EntityName,OperationResult|
|ListenerConnections-TotalRequests|ListenerConnections-TotalRequests|Count|Total|Total ListenerConnections for Microsoft.Relay.|EntityName|
|SenderConnections-TotalRequests|SenderConnections-TotalRequests|Count|Total|Total SenderConnections requests for Microsoft.Relay.|EntityName|
|ActiveConnections|ActiveConnections|Count|Total|Total ActiveConnections for Microsoft.Relay.|EntityName|
|ActiveListeners|ActiveListeners|Count|Total|Total ActiveListeners for Microsoft.Relay.|EntityName|
|BytesTransferred|BytesTransferred|Count|Total|Total BytesTransferred for Microsoft.Relay.|EntityName|
|ListenerDisconnects|ListenerDisconnects|Count|Total|Total ListenerDisconnects for Microsoft.Relay.|EntityName|
|SenderDisconnects|SenderDisconnects|Count|Total|Total SenderDisconnects for Microsoft.Relay.|EntityName|


## Microsoft.Search/searchServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SearchLatency|Search Latency|Seconds|Average|Average search latency for the search service|None|
|SearchQueriesPerSecond|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|None|
|ThrottledSearchQueriesPercentage|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|None|


## Microsoft.ServiceBus/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests|Count|Total|Total successful requests for a namespace|EntityName,OperationResult|
|ServerErrors|Server Errors.|Count|Total|Server Errors for Microsoft.ServiceBus.|EntityName,OperationResult|
|UserErrors|User Errors.|Count|Total|User Errors for Microsoft.ServiceBus.|EntityName,OperationResult|
|ThrottledRequests|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.ServiceBus.|EntityName,OperationResult|
|IncomingRequests|Incoming Requests|Count|Total|Incoming Requests for Microsoft.ServiceBus.|EntityName|
|IncomingMessages|Incoming Messages|Count|Total|Incoming Messages for Microsoft.ServiceBus.|EntityName|
|OutgoingMessages|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.ServiceBus.|EntityName|
|ActiveConnections|ActiveConnections|Count|Total|Total Active Connections for Microsoft.ServiceBus.|None|
|ConnectionsOpened|Connections Opened.|Count|Average|Connections Opened for Microsoft.ServiceBus.|EntityName|
|ConnectionsClosed|Connections Closed.|Count|Average|Connections Closed for Microsoft.ServiceBus.|EntityName|
|Size|Size|Bytes|Average|Size of an Queue/Topic in Bytes.|EntityName|
|Messages|Count of messages in a Queue/Topic.|Count|Average|Count of messages in a Queue/Topic.|EntityName|
|ActiveMessages|Count of active messages in a Queue/Topic.|Count|Average|Count of active messages in a Queue/Topic.|EntityName|
|DeadletteredMessages|Count of dead-lettered messages in a Queue/Topic.|Count|Average|Count of dead-lettered messages in a Queue/Topic.|EntityName|
|ScheduledMessages|Count of scheduled messages in a Queue/Topic.|Count|Average|Count of scheduled messages in a Queue/Topic.|EntityName|
|NamespaceCpuUsage|CPU|Percent|Maximum|Service bus premium namespace CPU usage metric.|Replica|
|NamespaceMemoryUsage|Memory Usage|Percent|Maximum|Service bus premium namespace memory usage metric.|Replica|
|CPUXNS|CPU (Deprecated)|Percent|Maximum|Service bus premium namespace CPU usage metric. This metric is depricated. Please use the CPU metric (NamespaceCpuUsage) instead.|Replica|
|WSXNS|Memory Usage (Deprecated)|Percent|Maximum|Service bus premium namespace memory usage metric. This metric is deprecated. Please use the  Memory Usage (NamespaceMemoryUsage) metric instead.|Replica|


## Microsoft.ServiceFabricMesh/applications

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AllocatedCpu|AllocatedCpu|Count|Average|Cpu allocated to this container in milli cores|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|AllocatedMemory|AllocatedMemory|Bytes|Average|Memory allocated to this container in MB|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|ActualCpu|ActualCpu|Count|Average|Actual CPU usage in milli cores|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|ActualMemory|ActualMemory|Bytes|Average|Actual memory usage in MB|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|CpuUtilization|CpuUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|MemoryUtilization|MemoryUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName|
|ApplicationStatus|ApplicationStatus|Count|Average|Status of Service Fabric Mesh application|ApplicationName,Status|
|ServiceStatus|ServiceStatus|Count|Average|Health Status of a service in Service Fabric Mesh application|ApplicationName,Status,ServiceName|
|ServiceReplicaStatus|ServiceReplicaStatus|Count|Average|Health Status of a service replica in Service Fabric Mesh application|ApplicationName,Status,ServiceName,ServiceReplicaName|
|ContainerStatus|ContainerStatus|Count|Average|Status of the container in Service Fabric Mesh application|ApplicationName,ServiceName,CodePackageName,ServiceReplicaName,Status|
|RestartCount|RestartCount|Count|Average|Restart count of a container in Service Fabric Mesh application|ApplicationName,Status,ServiceName,ServiceReplicaName,CodePackageName|

## Microsoft.SignalRService/SignalR

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ConnectionCount|Connection Count|Count|Maximum|The amount of user connection.|Endpoint|
|MessageCount|Message Count|Count|Total|The total amount of messages.|None|
|InboundTraffic|Inbound Traffic|Bytes|Total|The inbound traffic of service|None|
|OutboundTraffic|Outbound Traffic|Bytes|Total|The outbound traffic of service|None|
|UserErrors|User Errors|Percent|Maximum|The percentage of user errors|None|
|SystemErrors|System Errors|Percent|Maximum|The percentage of system errors|None|



## Microsoft.Sql/servers/databases

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Average|CPU percentage|None|
|physical_data_read_percent|Data IO percentage|Percent|Average|Data IO percentage|None|
|log_write_percent|Log IO percentage|Percent|Average|Log IO percentage. Not applicable to data warehouses.|None|
|dtu_consumption_percent|DTU percentage|Percent|Average|DTU Percentage. Applies to DTU-based databases.|None|
|storage|Data space used|Bytes|Maximum|Data space used. Not applicable to data warehouses.|None|
|connection_successful|Successful Connections|Count|Total|Successful Connections|None|
|connection_failed|Failed Connections|Count|Total|Failed Connections|None|
|blocked_by_firewall|Blocked by Firewall|Count|Total|Blocked by Firewall|None|
|deadlock|Deadlocks|Count|Total|Deadlocks. Not applicable to data warehouses.|None|
|storage_percent|Data space used percent|Percent|Maximum|Data space used percent. Not applicable to data warehouses or hyperscale databases.|None|
|xtp_storage_percent|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent. Not applicable to data warehouses.|None|
|workers_percent|Workers percentage|Percent|Average|Workers percentage. Not applicable to data warehouses.|None|
|sessions_percent|Sessions percentage|Percent|Average|Sessions percentage. Not applicable to data warehouses.|None|
|dtu_limit|DTU Limit|Count|Average|DTU Limit. Applies to DTU-based databases.|None|
|dtu_used|DTU used|Count|Average|DTU used. Applies to DTU-based databases.|None|
|cpu_limit|CPU limit|Count|Average|CPU limit. Applies to vCore-based databases.|None|
|cpu_used|CPU used|Count|Average|CPU used. Applies to vCore-based databases.|None|
|dwu_limit|DWU limit|Count|Maximum|DWU limit. Applies only to data warehouses.|None|
|dwu_consumption_percent|DWU percentage|Percent|Maximum|DWU percentage. Applies only to data warehouses.|None|
|dwu_used|DWU used|Count|Maximum|DWU used. Applies only to data warehouses.|None|
|cache_hit_percent|Cache hit percentage|Percent|Maximum|Cache hit percentage. Applies only to data warehouses.|None|
|cache_used_percent|Cache used percentage|Percent|Maximum|Cache used percentage. Applies only to data warehouses.|None|
|sqlserver_process_core_percent<sup>1</sup> |SQL Server process core percent|Percent|Maximum|CPU usage percentage for the SQL Server process, as measured by the operating system.|None|
|sqlserver_process_memory_percent<sup>1</sup> |SQL Server process memory percent|Percent|Maximum|Memory usage percentage for the SQL Server process, as measured by the operating system.|None|
|tempdb_data_size<sup>2</sup> |Tempdb Data File Size Kilobytes|Count|Maximum|Tempdb Data File Size Kilobytes.|None|
|tempdb_log_size<sup>2</sup> |Tempdb Log File Size Kilobytes|Count|Maximum|Tempdb Log File Size Kilobytes.|None|
|tempdb_log_used_percent<sup>2</sup> |Tempdb Percent Log Used|Percent|Maximum|Tempdb Percent Log Used.|None|
|local_tempdb_usage_percent|Local tempdb percentage|Percent|Average|Local tempdb percentage. Applies only to data warehouses.|None|
|app_cpu_billed|App CPU billed|Count|Total|App CPU billed. Applies to serverless databases.|None|
|app_cpu_percent|App CPU percentage|Percent|Average|App CPU percentage. Applies to serverless databases.|None|
|app_memory_percent|App memory percentage|Percent|Average|App memory percentage. Applies to serverless databases.|None|
|allocated_data_storage|Data space allocated|Bytes|Average|Allocated data storage. Not applicable to data warehouses.|None|
|memory_usage_percent|Memory percentage|Percent|Maximum|Memory percentage. Applies only to data warehouses.|None|
|dw_backup_size_gb|Data Storage Size|Count|Total|Data Storage Size is comprised of the size of your data and the transaction log. The metric is counted towards the 'Storage' portion of your bill. Applies only to data warehouses.|None|
|dw_snapshot_size_gb|Snapshot Storage Size|Count|Total|Snapshot Storage Size is the size of the incremental changes captured by snapshots to create user-defined and automatic restore points. The metric is counted towards the 'Storage' portion of your bill. Applies only to data warehouses.|None|
|dw_geosnapshot_size_gb|Disaster Recovery Storage Size|Count|Total|Disaster Recovery Storage Size is reflected as 'Disaster Recovery Storage' in your bill. Applies only to data warehouses.|None|
|wlg_allocation_relative_to_system_percent|Workload group allocation by system percent|Percent|Maximum|Allocated percentage of resources relative to the entire system per workload group. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|wlg_allocation_relative_to_wlg_effective_cap_percent|Workload group allocation by cap resource percent|Percent|Maximum|Allocated percentage of resources relative to the specified cap resources per workload group. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|wlg_active_queries|Workload group active queries|Count|Total|Active queries within the workload group. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|wlg_queued_queries|Workload group queued queries|Count|Total|Queued queries within the workload group. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|active_queries|Active queries|Count|Total|Active queries across all workload groups. Applies only to data warehouses.|None|
|queued_queries|Queued queries|Count|Total|Queued queries across all workload groups. Applies only to data warehouses.|None|
|wlg_active_queries_timeouts|Workload group query timeouts|Count|Total|Queries that have timed out for the workload group. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|wlg_effective_min_resource_percent|Effective min resource percent|Percent|Maximum|Minimum percentage of resources reserved and isolated for the workload group, taking into account the service level minimum. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|wlg_effective_cap_resource_percent|Effective cap resource percent|Percent|Maximum|A hard limit on the percentage of resources allowed for the workload group, taking into account Effective Min Resource Percentage allocated for other workload groups. Applies only to data warehouses.|WorkloadGroupName,IsUserDefined|
|full_backup_size_bytes|Full backup storage size|Bytes|Maximum|Cumulative full backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases.|None|
|diff_backup_size_bytes|Differential backup storage size|Bytes|Maximum|Cumulative differential backup storage size. Applies to vCore-based databases. Not applicable to Hyperscale databases.|None|
|log_backup_size_bytes|Log backup storage size|Bytes|Maximum|Cumulative log backup storage size. Applies to vCore-based and Hyperscale databases.|None|
|snapshot_backup_size_bytes|Snapshot backup storage size|Bytes|Maximum|Cumulative snapshot backup storage size. Applies to Hyperscale databases.|None|
|base_blob_size_bytes|Base blob storage size|Bytes|Maximum|Base blob storage size. Applies to Hyperscale databases.|None|

<sup>1</sup> This metric is available for databases using the vCore purchasing model with 2 vCores and higher, or 200 DTU and higher for DTU-based purchasing models. 

<sup>2</sup> This metric is available for databases using the vCore purchasing model with 2 vCores and higher, or 200 DTU and higher for DTU-based purchasing models. This metric is not currently available for Hyperscale databases or data warehouses.

## Microsoft.Sql/servers/elasticPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Average|CPU percentage|None|
|database_cpu_percent|CPU percentage|Percent|Average|CPU percentage|DatabaseResourceId|
|physical_data_read_percent|Data IO percentage|Percent|Average|Data IO percentage|None|
|database_physical_data_read_percent|Data IO percentage|Percent|Average|Data IO percentage|DatabaseResourceId|
|log_write_percent|Log IO percentage|Percent|Average|Log IO percentage|None|
|database_log_write_percent|Log IO percentage|Percent|Average|Log IO percentage|DatabaseResourceId|
|dtu_consumption_percent|DTU percentage|Percent|Average|DTU Percentage. Applies to DTU-based elastic pools.|None|
|database_dtu_consumption_percent|DTU percentage|Percent|Average|DTU percentage|DatabaseResourceId|
|storage_percent|Data space used percent|Percent|Average|Data space used percent|None|
|workers_percent|Workers percentage|Percent|Average|Workers percentage|None|
|database_workers_percent|Workers percentage|Percent|Average|Workers percentage|DatabaseResourceId|
|sessions_percent|Sessions percentage|Percent|Average|Sessions percentage|None|
|database_sessions_percent|Sessions percentage|Percent|Average|Sessions percentage|DatabaseResourceId|
|eDTU_limit|eDTU limit|Count|Average|eDTU limit. Applies to DTU-based elastic pools.|None|
|storage_limit|Data max size|Bytes|Average|Data max size|None|
|eDTU_used|eDTU used|Count|Average|eDTU used. Applies to DTU-based elastic pools.|None|
|database_eDTU_used|eDTU used|Count|Average|eDTU used|DatabaseResourceId|
|storage_used|Data space used|Bytes|Average|Data space used|None|
|database_storage_used|Data space used|Bytes|Average|Data space used|DatabaseResourceId|
|xtp_storage_percent|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent|None|
|cpu_limit|CPU limit|Count|Average|CPU limit. Applies to vCore-based elastic pools.|None|
|database_cpu_limit|CPU limit|Count|Average|CPU limit|DatabaseResourceId|
|cpu_used|CPU used|Count|Average|CPU used. Applies to vCore-based elastic pools.|None|
|database_cpu_used|CPU used|Count|Average|CPU used|DatabaseResourceId|
|sqlserver_process_core_percent<sup>1</sup>|SQL Server process core percent|Percent|Maximum|CPU usage percentage for the SQL Server process, as measured by the operating system. Applies to elastic pools. |None|
|sqlserver_process_memory_percent<sup>1</sup>|SQL Server process memory percent|Percent|Maximum|Memory usage percentage for the SQL Server process, as measured by the operating system. Applies to elastic pools. |None|
|tempdb_data_size<sup>2</sup>|Tempdb Data File Size Kilobytes|Count|Maximum|Tempdb Data File Size Kilobytes.|None|
|tempdb_log_size<sup>2</sup>|Tempdb Log File Size Kilobytes|Count|Maximum|Tempdb Log File Size Kilobytes. |None|
|tempdb_log_used_percent<sup>2</sup>|Tempdb Percent Log Used|Percent|Maximum|Tempdb Percent Log Used.|None|
|allocated_data_storage|Data space allocated|Bytes|Average|Data space allocated|None|
|database_allocated_data_storage|Data space allocated|Bytes|Average|Data space allocated|DatabaseResourceId|
|allocated_data_storage_percent|Data space allocated percent|Percent|Maximum|Data space allocated percent|None|

<sup>1</sup> This metric is available for databases using the vCore purchasing model with 2 vCores and higher, or 200 DTU and higher for DTU-based purchasing models. 

<sup>2</sup> This metric is available for databases using the vCore purchasing model with 2 vCores and higher, or 200 DTU and higher for DTU-based purchasing models. This metric is not currently available for Hyperscale databases.


## Microsoft.Sql/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|dtu_consumption_percent|DTU percentage|Percent|Average|DTU percentage|ElasticPoolResourceId|
|database_dtu_consumption_percent|DTU percentage|Percent|Average|DTU percentage|DatabaseResourceId,ElasticPoolResourceId|
|storage_used|Data space used|Bytes|Average|Data space used|ElasticPoolResourceId|
|database_storage_used|Data space used|Bytes|Average|Data space used|DatabaseResourceId,ElasticPoolResourceId|
|dtu_used|DTU used|Count|Average|DTU used|DatabaseResourceId|

## Microsoft.Sql/managedInstances

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|virtual_core_count|Virtual core count|Count|Average|Virtual core count|None|
|avg_cpu_percent|Average CPU percentage|Percent|Average|Average CPU percentage|None|
|reserved_storage_mb|Storage space reserved|Count|Average|Storage space reserved|None|
|storage_space_used_mb|Storage space used|Count|Average|Storage space used|None|
|io_requests|IO requests count|Count|Average|IO requests count|None|
|io_bytes_read|IO bytes read|Bytes|Average|IO bytes read|None|
|io_bytes_written|IO bytes written|Bytes|Average|IO bytes written|None|



## Microsoft.Storage/storageAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|UsedCapacity|Used capacity|Bytes|Average|Account used capacity|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.Storage/storageAccounts/blobServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BlobCapacity|Blob Capacity|Bytes|Average|The amount of storage used by the storage account's Blob service in bytes.|BlobType,Tier|
|BlobCount|Blob Count|Count|Average|The number of Blob in the storage account's Blob service.|BlobType,Tier|
|ContainerCount|Blob Container Count|Count|Average|The number of containers in the storage account's Blob service.|None|
|IndexCapacity|Index Capacity|Bytes|Average|The amount of storage used by ADLS Gen2 (Hierarchical) Index in bytes.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.Storage/storageAccounts/tableServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TableCapacity|Table Capacity|Bytes|Average|The amount of storage used by the storage account's Table service in bytes.|None|
|TableCount|Table Count|Count|Average|The number of table in the storage account's Table service.|None|
|TableEntityCount|Table Entity Count|Count|Average|The number of table entities in the storage account's Table service.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|

## Microsoft.Storage/storageAccounts/fileServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|FileCapacity|File Capacity|Bytes|Average|The amount of storage used by the storage account's File service in bytes.|FileShare|
|FileCount|File Count|Count|Average|The number of file in the storage account's File service.|FileShare|
|FileShareCount|File Share Count|Count|Average|The number of file shares in the storage account's File service.|None|
|FileShareSnapshotCount|File share snapshot count|Count|Average|The number of snapshots present on the share in storage account's Files Service.|FileShare|
|FileShareSnapshotSize|File share snapshot size|Bytes|Average|The amount of storage used by the snapshots in storage account's File service in bytes.|FileShare|
|FileShareQuota|File share quota size|Bytes|Average|The upper limit on the amount of storage that can be used by Azure Files Service in bytes.|FileShare|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication,FileShare|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication,FileShare|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication,FileShare|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType,ApiName,Authentication,FileShare|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication,FileShare|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication,FileShare|

## Microsoft.Storage/storageAccounts/queueServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueueCapacity|Queue Capacity|Bytes|Average|The amount of storage used by the storage account's Queue service in bytes.|None|
|QueueCount|Queue Count|Count|Average|The number of queue in the storage account's Queue service.|None|
|QueueMessageCount|Queue Message Count|Count|Average|The approximate number of queue messages in the storage account's Queue service.|None|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType,GeoType,ApiName,Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType,ApiName,Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType,ApiName,Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType,ApiName,Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType,ApiName,Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType,ApiName,Authentication|





## Microsoft.StorageCache/caches

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ClientIOPS|Total Client IOPS|Count|Average|The rate of client files operations processed by the Cache.|None|
|ClientLatency|Average Client Latency|Milliseconds|Average|Average latency of client file operations to the Storage Cache.|None|
|ClientReadIOPS|Client Read IOPS|CountPerSecond|Average|Client read operations per second.|None|
|ClientReadThroughput|Average Cache Read Throughput|BytesPerSecond|Average|Client read data transfer rate.|None|
|ClientWriteIOPS|Client Write IOPS|CountPerSecond|Average|Client write operations per second.|None|
|ClientWriteThroughput|Average Cache Write Throughput|BytesPerSecond|Average|Client write data transfer rate.|None|
|ClientMetadataReadIOPS|Client Metadata Read IOPS|CountPerSecond|Average|The rate of client file operations sent to the Cache, excluding data reads, that do not modify persistent state.|None|
|ClientMetadataWriteIOPS|Client Metadata Write IOPS|CountPerSecond|Average|The rate of client file operations sent to the Cache, excluding data writes, that modify persistent state.|None|
|ClientLockIOPS|Client Lock IOPS|CountPerSecond|Average|Client file locking operations per second.|None|
|StorageTargetHealth|Storage Target Health|Count|Average|Boolean results of connectivity test between the Cache and Storage Targets.|None|
|Uptime|Uptime|Count|Average|Boolean results of connectivity test between the Cache and monitoring system.|None|
|StorageTargetIOPS|Total StorageTarget IOPS|Count|Average|The rate of all file operations the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetWriteIOPS|StorageTarget Write IOPS|Count|Average|The rate of the file write operations the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetAsyncWriteThroughput|StorageTarget Asynchronous Write Throughput|BytesPerSecond|Average|The rate the Cache asynchronously writes data to a particular StorageTarget. These are opportunistic writes that do not cause clients to block.|StorageTarget|
|StorageTargetSyncWriteThroughput|StorageTarget Synchronous Write Throughput|BytesPerSecond|Average|The rate the Cache synchronously writes data to a particular StorageTarget. These are writes that do cause clients to block.|StorageTarget|
|StorageTargetTotalWriteThroughput|StorageTarget Total Write Throughput|BytesPerSecond|Average|The total rate that the Cache writes data to a particular StorageTarget.|StorageTarget|
|StorageTargetLatency|StorageTarget Latency|Milliseconds|Average|The average round trip latency of all the file operations the Cache sends to a partricular StorageTarget.|StorageTarget|
|StorageTargetMetadataReadIOPS|StorageTarget Metadata Read IOPS|CountPerSecond|Average|The rate of file operations that do not modify persistent state, and excluding the read operation, that the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetMetadataWriteIOPS|StorageTarget Metadata Write IOPS|CountPerSecond|Average|The rate of file operations that do modify persistent state and excluding the write operation, that the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetReadIOPS|StorageTarget Read IOPS|CountPerSecond|Average|The rate of file read operations the Cache sends to a particular StorageTarget.|StorageTarget|
|StorageTargetReadAheadThroughput|StorageTarget Read Ahead Throughput|BytesPerSecond|Average|The rate the Cache opportunisticly reads data from the StorageTarget.|StorageTarget|
|StorageTargetFillThroughput|StorageTarget Fill Throughput|BytesPerSecond|Average|The rate the Cache reads data from the StorageTarget to handle a cache miss.|StorageTarget|
|StorageTargetTotalReadThroughput|StorageTarget Total Read Throughput|BytesPerSecond|Average|The total rate that the Cache reads data from a particular StorageTarget.|StorageTarget|

## microsoft.storagesync/storageSyncServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServerSyncSessionResult|Sync Session Result|Count|Average|Metric that logs a value of 1 each time the Server Endpoint successfully completes a Sync Session with the Cloud Endpoint|SyncGroupName,ServerEndpointName,SyncDirection|
|StorageSyncSyncSessionAppliedFilesCount|Files Synced|Count|Total|Count of Files synced|SyncGroupName,ServerEndpointName,SyncDirection|
|StorageSyncSyncSessionPerItemErrorsCount|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName,ServerEndpointName,SyncDirection|
|StorageSyncBatchTransferredFileBytes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName,ServerEndpointName,SyncDirection|
|StorageSyncServerHeartbeat|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the resigtered server successfully records a heartbeat with the Cloud Endpoint|ServerName|
|StorageSyncRecallIOTotalSizeBytes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerName|
|StorageSyncRecalledTotalNetworkBytes|Cloud tiering recall size|Bytes|Total|Size of data recalled|SyncGroupName,ServerName|
|StorageSyncRecallThroughputBytesPerSecond|Cloud tiering recall throughput|BytesPerSecond|Average|Size of data recall throughput|SyncGroupName,ServerName|
|StorageSyncRecalledNetworkBytesByApplication|Cloud tiering recall size by application|Bytes|Total|Size of data recalled by application|SyncGroupName,ServerName,ApplicationName|

## microsoft.storagesync/storageSyncServices/syncGroups

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SyncGroupSyncSessionAppliedFilesCount|Files Synced|Count|Total|Count of Files synced|SyncGroupName,ServerEndpointName,SyncDirection|
|SyncGroupSyncSessionPerItemErrorsCount|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName,ServerEndpointName,SyncDirection|
|SyncGroupBatchTransferredFileBytes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName,ServerEndpointName,SyncDirection|

## microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServerEndpointSyncSessionAppliedFilesCount|Files Synced|Count|Total|Count of Files synced|ServerEndpointName,SyncDirection|
|ServerEndpointSyncSessionPerItemErrorsCount|Files not syncing|Count|Total|Count of files failed to sync|ServerEndpointName,SyncDirection|
|ServerEndpointBatchTransferredFileBytes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|ServerEndpointName,SyncDirection|

## microsoft.storagesync/storageSyncServices/registeredServers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServerHeartbeat|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the resigtered server successfully records a heartbeat with the Cloud Endpoint|ServerResourceId,ServerName|
|ServerRecallIOTotalSizeBytes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerResourceId,ServerName|



## Microsoft.StreamAnalytics/streamingjobs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ResourceUtilization|SU % Utilization|Percent|Maximum|SU % Utilization|LogicalName,PartitionId|
|InputEvents|Input Events|Count|Total|Input Events|LogicalName,PartitionId|
|InputEventBytes|Input Event Bytes|Bytes|Total|Input Event Bytes|LogicalName,PartitionId|
|LateInputEvents|Late Input Events|Count|Total|Late Input Events|LogicalName,PartitionId|
|OutputEvents|Output Events|Count|Total|Output Events|LogicalName,PartitionId|
|ConversionErrors|Data Conversion Errors|Count|Total|Data Conversion Errors|LogicalName,PartitionId|
|Errors|Runtime Errors|Count|Total|Runtime Errors|LogicalName,PartitionId|
|DroppedOrAdjustedEvents|Out of order Events|Count|Total|Out of order Events|LogicalName,PartitionId|
|AMLCalloutRequests|Function Requests|Count|Total|Function Requests|LogicalName,PartitionId|
|AMLCalloutFailedRequests|Failed Function Requests|Count|Total|Failed Function Requests|LogicalName,PartitionId|
|AMLCalloutInputEvents|Function Events|Count|Total|Function Events|LogicalName,PartitionId|
|DeserializationError|Input Deserialization Errors|Count|Total|Input Deserialization Errors|LogicalName,PartitionId|
|EarlyInputEvents|Early Input Events|Count|Total|Early Input Events|LogicalName,PartitionId|
|OutputWatermarkDelaySeconds|Watermark Delay|Seconds|Maximum|Watermark Delay|LogicalName,PartitionId|
|InputEventsSourcesBacklogged|Backlogged Input Events|Count|Maximum|Backlogged Input Events|LogicalName,PartitionId|
|InputEventsSourcesPerSecond|Input Sources Received|Count|Total|Input Sources Received|LogicalName,PartitionId|

## Microsoft.Synapse/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|OrchestrationPipelineRunsEnded|Pipeline runs ended|Count|Total|Count of orchestration pipeline runs that succeeded, failed, or were cancelled|Result,FailureType,Pipeline|
|OrchestrationActivityRunsEnded|Activity runs ended|Count|Total|Count of orchestration activities that succeeded, failed, or were cancelled|Result,FailureType,Activity,ActivityType,Pipeline|
|OrchestrationTriggersEnded|Triggers ended|Count|Total|Count of orchestration triggers that succeeded, failed, or were cancelled|Result,FailureType,Trigger|
|SQLOnDemandLoginAttempts|Login attempts|Count|Total|Count of login attempts that succeded or failed|Result|
|SQLOnDemandQueriesEnded|Queries ended|Count|Total|Count of queries that succeeded, failed, or were cancelled|Result|
|SQLOnDemandQueryProcessedBytes|Data processed|Bytes|Total|Amount of data processed by queries|None|

## Microsoft.Synapse/workspaces/bigDataPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SparkJobsEnded|Ended applications|Count|Total|Count of ended applications|JobType,JobResult|
|CoresCapacity|Cores capacity|Count|Maximum|Cores capacity|None|
|MemoryCapacityGB|Memory capacity (GB)|Count|Maximum|Memory capacity (GB)|None|

## Microsoft.Synapse/workspaces/sqlPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|DWULimit|DWU limit|Count|Maximum|Service level objective of the SQL pool|None|
|DWUUsed|DWU used|Count|Maximum|Represents a high-level representation of usage across the SQL pool. Measured by DWU limit * DWU percentage|None|
|DWUUsedPercent|DWU used percentage|Percent|Maximum|Represents a high-level representation of usage across the SQL pool. Measured by taking the maximum between CPU percentage and Data IO percentage|None|
|ConnectionsBlockedByFirewall|Connections blocked by firewall|Count|Total|Count of connections blocked by firewall rules. Revisit access control policies for your SQL pool and monitor these connections if the count is high|None|
|AdaptiveCacheHitPercent|Adaptive cache hit percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache hit percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|None|
|AdaptiveCacheUsedPercent|Adaptive cache used percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache used percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|None|
|LocalTempDBUsedPercent|Local tempdb used percentage|Percent|Maximum|Local tempdb utilization across all compute nodes - values are emitted every five minute|None|
|MemoryUsedPercent|Memory used percentage|Percent|Maximum|Memory utilization across all nodes in the SQL pool|None|
|Connections|Connections|Count|Total|Count of Total logins to the SQL pool|Result|
|WLGActiveQueries|Workload group active queries|Count|Total|The active queries within the workload group. Using this metric unfiltered and unsplit displays all active queries running on the system|IsUserDefined,WorkloadGroup|
|WLGActiveQueriesTimeouts|Workload group query timeouts|Count|Total|Queries for the workload group that have timed out. Query timeouts reported by this metric are only once the query has started executing (it does not include wait time due to locking or resource waits)|IsUserDefined,WorkloadGroup|
|WLGAllocationBySystemPercent|Workload group allocation by system percent|Percent|Maximum|The percentage allocation of resources relative to the entire system|IsUserDefined,WorkloadGroup|
|WLGAllocationByMaxResourcePercent|Workload group allocation by max resource percent|Percent|Maximum|Displays the percentage allocation of resources relative to the Effective cap resource percent per workload group. This metric provides the effective utilization of the workload group|IsUserDefined,WorkloadGroup|
|WLGEffectiveCapResourcePercent|Effective cap resource percent|Percent|Maximum|The effective cap resource percent for the workload group. If there are other workload groups with min_percentage_resource > 0, the effective_cap_percentage_resource is lowered proportionally|IsUserDefined,WorkloadGroup|
|wlg_effective_min_resource_percent|Effective min resource percent|Percent|Minimum|The effective min resource percentage setting allowed considering the service level and the workload group settings. The effective min_percentage_resource can be adjusted higher on lower service levels|IsUserDefined,WorkloadGroup|
|WLGQueuedQueries|Workload group queued queries|Count|Total|Cumulative count of requests queued after the max concurrency limit was reached|IsUserDefined,WorkloadGroup|

## Microsoft.TimeSeriesInsights/environments

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|IngressReceivedMessages|Ingress Received Messages|Count|Total|Count of messages read from all Event hub or IoT hub event sources|None|
|IngressReceivedInvalidMessages|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from all Event hub or IoT hub event sources|None|
|IngressReceivedBytes|Ingress Received Bytes|Bytes|Total|Count of bytes read from all event sources|None|
|IngressStoredBytes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|None|
|IngressStoredEvents|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|None|
|IngressReceivedMessagesTimeLag|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|None|
|IngressReceivedMessagesCountLag|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress|None|
|WarmStorageMaxProperties|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|None|
|WarmStorageUsedProperties|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|None|



## Microsoft.TimeSeriesInsights/environments/eventsources

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|IngressReceivedMessages|Ingress Received Messages|Count|Total|Count of messages read from the event source|None|
|IngressReceivedInvalidMessages|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from the event source|None|
|IngressReceivedBytes|Ingress Received Bytes|Bytes|Total|Count of bytes read from the event source|None|
|IngressStoredBytes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|None|
|IngressStoredEvents|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|None|
|IngressReceivedMessagesTimeLag|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|None|
|IngressReceivedMessagesCountLag|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress|None|
|WarmStorageMaxProperties|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|None|
|WarmStorageUsedProperties|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|None|

## Microsoft.VMwareCloudSimple/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|DiskReadBytesPerSecond|Disk Read Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to read operations over the sample period.|None|
|DiskWriteBytesPerSecond|Disk Write Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to write operations over the sample period.|None|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Total disk throughput due to read operations over the sample period.|None|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Total disk throughput due to write operations over the sample period.|None|
|DiskReadOperations|Disk Read Operations|Count|Total|The number of IO read operations in the previous sample period. Note that these operations may be variable sized.|None|
|DiskWriteOperations|Disk Write Operations|Count|Total|The number of IO write operations in the previous sample period. Note that these operations may be variable sized.|None|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|The average number of IO read operations in the previous sample period. Note that these operations may be variable sized.|None|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|The average number of IO write operations in the previous sample period. Note that these operations may be variable sized.|None|
|DiskReadLatency|Disk Read Latency|Milliseconds|Average|Total read latency. The sum of the device and kernel read latencies.|None|
|DiskWriteLatency|Disk Write Latency|Milliseconds|Average|Total write latency. The sum of the device and kernel write latencies.|None|
|NetworkInBytesPerSecond|Network In Bytes/Sec|BytesPerSecond|Average|Average network throughput for received traffic.|None|
|NetworkOutBytesPerSecond|Network Out Bytes/Sec|BytesPerSecond|Average|Average network throughput for transmitted traffic.|None|
|Network In|Network In|Bytes|Total|Total network throughput for received traffic.|None|
|Network Out|Network Out|Bytes|Total|Total network throughput for transmitted traffic.|None|
|MemoryUsed|Memory Used|Bytes|Average|The amount of machine memory that is in use by the VM.|None|
|MemoryGranted|Memory Granted|Bytes|Average|The amount of memory that was granted to the VM by the host. Memory is not granted to the host until it is touched one time and granted memory may be swapped out or ballooned away if the VMkernel needs the memory.|None|
|MemoryActive|Memory Active|Bytes|Average|The amount of memory used by the VM in the past small window of time. This is the "true" number of how much memory the VM currently has need of. Additional, unused memory may be swapped out or ballooned with no impact to the guest's performance.|None|
|Percentage CPU|Percentage CPU|Percent|Average|The CPU utilization. This value is reported with 100% representing all processor cores on the system. As an example, a 2-way VM using 50% of a four-core system is completely using two cores.|None|
|PercentageCpuReady|Percentage CPU Ready|Milliseconds|Total|Ready time is the time spend waiting for CPU(s) to become available in the past update interval.|None|

## Microsoft.Web/serverfarms

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|Instance|
|DiskQueueLength|Disk Queue Length|Count|Average|Disk Queue Length|Instance|
|HttpQueueLength|Http Queue Length|Count|Average|Http Queue Length|Instance|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|
|TcpSynSent|TCP Syn Sent|Count|Average|TCP Syn Sent|Instance|
|TcpSynReceived|TCP Syn Received|Count|Average|TCP Syn Received|Instance|
|TcpEstablished|TCP Established|Count|Average|TCP Established|Instance|
|TcpFinWait1|TCP Fin Wait 1|Count|Average|TCP Fin Wait 1|Instance|
|TcpFinWait2|TCP Fin Wait 2|Count|Average|TCP Fin Wait 2|Instance|
|TcpClosing|TCP Closing|Count|Average|TCP Closing|Instance|
|TcpCloseWait|TCP Close Wait|Count|Average|TCP Close Wait|Instance|
|TcpLastAck|TCP Last Ack|Count|Average|TCP Last Ack|Instance|
|TcpTimeWait|TCP Time Wait|Count|Average|TCP Time Wait|Instance|

## Microsoft.Web/sites (excluding functions) 

> [!NOTE]
> **File System Usage** is a new metric being rolled out globally, no data is expected unless you have been whitelisted for private preview.

> [!IMPORTANT]
> **Average Response Time** will be deprecated to avoid confusion with metric aggregations. Use **Response Time** as a replacement.

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuTime|CPU Time|Seconds|Total|CPU Time|Instance|
|Requests|Requests|Count|Total|Requests|Instance|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|
|Http101|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Http 401|Count|Total|Http 401|Instance|
|Http403|Http 403|Count|Total|Http 403|Instance|
|Http404|Http 404|Count|Total|Http 404|Instance|
|Http406|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|Instance|
|MemoryWorkingSet|Memory working set|Bytes|Average|Memory working set|Instance|
|AverageMemoryWorkingSet|Average memory working set|Bytes|Average|Average memory working set|Instance|
|HttpResponseTime|Response Time|Seconds|Total|Response Time|Instance|
|AverageResponseTime|Average Response Time (deprecated)|Seconds|Average|Average Response Time|Instance|
|AppConnections|Connections|Count|Average|Connections|Instance|
|Handles|Handle Count|Count|Average|Handle Count|Instance|
|Threads|Thread Count|Count|Average|Thread Count|Instance|
|PrivateBytes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|IoReadBytesPerSecond|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoWriteBytesPerSecond|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoOtherBytesPerSecond|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoReadOperationsPerSecond|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteOperationsPerSecond|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|IoOtherOperationsPerSecond|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|RequestsInApplicationQueue|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|CurrentAssemblies|Current Assemblies|Count|Average|Current Assemblies|Instance|
|TotalAppDomains|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|
|Gen0Collections|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|HealthCheckStatus|Health check status|Count|Average|Health check status|Instance|
|FileSystemUsage|File System Usage|Bytes|Average|File System Usage|None|

## Microsoft.Web/sites (functions)

> [!NOTE]
> **File System Usage** is a new metric being rolled out globally, no data is expected unless you have been whitelisted for private preview.

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|Instance|
|MemoryWorkingSet|Memory working set|Bytes|Average|Memory working set|Instance|
|AverageMemoryWorkingSet|Average memory working set|Bytes|Average|Average memory working set|Instance|
|FunctionExecutionUnits|Function Execution Units|MB / Milliseconds|Total|[Function Execution Units](https://github.com/Azure/Azure-Functions/wiki/Consumption-Plan-Cost-Billing-FAQ#how-can-i-view-graphs-of-execution-count-and-gb-seconds)|Instance|
|FunctionExecutionCount|Function Execution Count|Count|Total|Function Execution Count|Instance|
|PrivateBytes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|IoReadBytesPerSecond|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoWriteBytesPerSecond|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoOtherBytesPerSecond|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoReadOperationsPerSecond|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteOperationsPerSecond|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|IoOtherOperationsPerSecond|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|RequestsInApplicationQueue|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|CurrentAssemblies|Current Assemblies|Count|Average|Current Assemblies|Instance|
|TotalAppDomains|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|
|Gen0Collections|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|HealthCheckStatus|Health check status|Count|Average|Health check status|Instance|
|FileSystemUsage|File System Usage|Bytes|Average|File System Usage|None|

## Microsoft.Web/sites/slots

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuTime|CPU Time|Seconds|Total|CPU Time|Instance|
|Requests|Requests|Count|Total|Requests|Instance|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|
|Http101|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Http 401|Count|Total|Http 401|Instance|
|Http403|Http 403|Count|Total|Http 403|Instance|
|Http404|Http 404|Count|Total|Http 404|Instance|
|Http406|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|Instance|
|MemoryWorkingSet|Memory working set|Bytes|Average|Memory working set|Instance|
|AverageMemoryWorkingSet|Average memory working set|Bytes|Average|Average memory working set|Instance|
|AverageResponseTime|Average Response Time|Seconds|Average|Average Response Time|Instance|
|HttpResponseTime|Response Time|Seconds|Average|Response Time|Instance|
|FunctionExecutionUnits|Function Execution Units|Count|Total|Function Execution Units|Instance|
|FunctionExecutionCount|Function Execution Count|Count|Total|Function Execution Count|Instance|
|AppConnections|Connections|Count|Average|Connections|Instance|
|Handles|Handle Count|Count|Average|Handle Count|Instance|
|Threads|Thread Count|Count|Average|Thread Count|Instance|
|PrivateBytes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|IoReadBytesPerSecond|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoWriteBytesPerSecond|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoOtherBytesPerSecond|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoReadOperationsPerSecond|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteOperationsPerSecond|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|IoOtherOperationsPerSecond|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|RequestsInApplicationQueue|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|CurrentAssemblies|Current Assemblies|Count|Average|Current Assemblies|Instance|
|TotalAppDomains|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|
|Gen0Collections|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|HealthCheckStatus|Health check status|Count|Average|Health check status|Instance|
|FileSystemUsage|File System Usage|Bytes|Average|File System Usage|None|

## Microsoft.Web/hostingEnvironments/multiRolePools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Requests|Requests|Count|Total|Requests|Instance|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|
|Http101|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Http 401|Count|Total|Http 401|Instance|
|Http403|Http 403|Count|Total|Http 403|Instance|
|Http404|Http 404|Count|Total|Http 404|Instance|
|Http406|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|Instance|
|AverageResponseTime|Average Response Time|Seconds|Average|Average Response Time|Instance|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|Instance|
|DiskQueueLength|Disk Queue Length|Count|Average|Disk Queue Length|Instance|
|HttpQueueLength|Http Queue Length|Count|Average|Http Queue Length|Instance|
|ActiveRequests|Active Requests|Count|Total|Active Requests|Instance|
|TotalFrontEnds|Total Front Ends|Count|Average|Total Front Ends|None|
|SmallAppServicePlanInstances|Small App Service Plan Workers|Count|Average|Small App Service Plan Workers|None|
|MediumAppServicePlanInstances|Medium App Service Plan Workers|Count|Average|Medium App Service Plan Workers|None|
|LargeAppServicePlanInstances|Large App Service Plan Workers|Count|Average|Large App Service Plan Workers|None|

## Microsoft.Web/hostingEnvironments/workerPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|WorkersTotal|Total Workers|Count|Average|Total Workers|None|
|WorkersAvailable|Available Workers|Count|Average|Available Workers|None|
|WorkersUsed|Used Workers|Count|Average|Used Workers|None|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|Instance|
## Next steps
* [Read about metrics in Azure Monitor](data-platform.md)
* [Create alerts on metrics](alerts-overview.md)
* [Export metrics to storage, Event Hub, or Log Analytics](platform-logs-overview.md)

