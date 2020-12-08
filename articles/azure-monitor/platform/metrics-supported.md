---
title: Azure Monitor supported metrics by resource type
description: List of metrics available for each resource type with Azure Monitor.
author: rboucher
services: azure-monitor
ms.topic: reference
ms.date: 07/16/2020
ms.author: robb
ms.subservice: metrics
---
# Supported metrics with Azure Monitor

> [!NOTE]
> This list is largely auto-generated from the Azure Monitor Metrics REST API. Any modification made to this list via GitHub may be written over without warning. Contact the author of this article for details on how to make permanent updates.

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. 

This article is a complete list of all platform (that is, automatically collected) metrics currently available with Azure Monitor's consolidated metric pipeline. The list was last updated March 27th, 2020. Metrics changed or added after this date may not appear below. To query for and access the list of metrics programmatically, please use the [2018-01-01 api-version](/rest/api/monitor/metricdefinitions). Other metrics not on this list may be available in the portal or using legacy APIs.

The metrics are organized by resource providers and resource type. For a list of services and the resource providers that belong to them, see [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md). 

## Exporting platform metrics to other locations

You can export the platform metrics from the Azure monitor pipeline to other locations in one of two ways.
1. Use the [metrics REST API](/rest/api/monitor/metrics/list)
2. Use [diagnostics settings](diagnostic-settings.md) to route platform metrics to 
    - Azure Storage
    - Azure Monitor Logs (and thus Log Analytics)
    - Event hubs, which is how you get them to non-Microsoft systems 

Using diagnostic settings is the easiest way to route the metrics, but there are some limitations: 

- **Some not exportable** - All metrics are exportable using the REST API, but some cannot be exported using Diagnostic Settings because of intricacies in the Azure Monitor backend. The column *Exportable via Diagnostic Settings* in the tables below list which metrics can be exported in this way.  

- **Multi-dimensional metrics** - Sending multi-dimensional metrics to other locations via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values. *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.

## Guest OS and Host OS Metrics

> [!WARNING]
> Metrics for the guest operating system (guest OS) which runs in Azure Virtual Machines, Service Fabric, and Cloud Services are **NOT** listed here. Guest OS metrics must be collected through the one or more agents which run on or as part of the guest operating system.  Guest OS metrics include performance counters which track guest CPU percentage or memory usage, both of which are  frequently used for auto-scaling or alerting. 
>
> **Host OS metrics ARE available and listed below.** They are not the same. The Host OS metrics relate to the Hyper-V session hosting your guest OS session. 

> [!TIP]
> Best practice is to use and configure the [Azure Diagnostics extension](diagnostics-extension-overview.md) to send guest OS performance metrics into the same Azure Monitor metric database where platform metrics are stored. The extension routes guest OS metrics through the [custom metrics](metrics-custom-overview.md) API. Then you can chart, alert and otherwise use guest OS metrics like platform metrics. Alternatively or in addition, you can use the Log Analytics agent to send guest OS metrics to Azure Monitor Logs / Log Analytics. There you can query on those metrics in combination with non-metric data. 

For important additional information, see [Monitoring Agents Overview](agents-overview.md).    

## Table formatting

> [!IMPORTANT] 
> This latest update adds a new column and reordered the metrics to be alphabetic. The addition information means that the tables below may have a horizontal scroll bar at the bottom, depending on the width of your browser window. If you believe you are missing information, use the scroll bar to see the entirety of the table.


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
|QueryPoolJobQueueLength|Yes|Threads: Query pool job queue length|Count|Average|Number of jobs in the queue of the query thread pool.|ServerResourceType|
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
|jvm.gc.live.data.size|Yes|jvm.gc.live.data.size|Bytes|Average|Size of old generation memory pool after a full GC|Deployment, AppName, Pod|
|jvm.gc.max.data.size|Yes|jvm.gc.max.data.size|Bytes|Average|Max size of old generation memory pool|Deployment, AppName, Pod|
|jvm.gc.memory.allocated|Yes|jvm.gc.memory.allocated|Bytes|Maximum|Incremented for an increase in the size of the young generation memory pool after one GC to before the next|Deployment, AppName, Pod|
|jvm.gc.memory.promoted|Yes|jvm.gc.memory.promoted|Bytes|Maximum|Count of positive increases in the size of the old generation memory pool before GC to after GC|Deployment, AppName, Pod|
|jvm.gc.pause.total.count|Yes|jvm.gc.pause.total.count|Count|Total|GC Pause Count|Deployment, AppName, Pod|
|jvm.gc.pause.total.time|Yes|jvm.gc.pause.total.time|Milliseconds|Total|GC Pause Total Time|Deployment, AppName, Pod|
|jvm.memory.committed|Yes|jvm.memory.committed|Bytes|Average|Memory assigned to JVM in bytes|Deployment, AppName, Pod|
|jvm.memory.max|Yes|jvm.memory.max|Bytes|Maximum|The maximum amount of memory in bytes that can be used for memory management|Deployment, AppName, Pod|
|jvm.memory.used|Yes|jvm.memory.used|Bytes|Average|App Memory Used in bytes|Deployment, AppName, Pod|
|process.cpu.usage|Yes|process.cpu.usage|Percent|Average|App JVM CPU Usage Percentage|Deployment, AppName, Pod|
|system.cpu.usage|Yes|system.cpu.usage|Percent|Average|The recent cpu usage for the whole system|Deployment, AppName, Pod|
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


## Microsoft.Automation/automationAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|TotalJob|Yes|Total Jobs|Count|Total|The total number of jobs|Runbook, Status|
|TotalUpdateDeploymentMachineRuns|Yes|Total Update Deployment Machine Runs|Count|Total|Total software update deployment machine runs in a software update deployment run|SoftwareUpdateConfigurationName, Status, TargetComputer, SoftwareUpdateConfigurationRunId|
|TotalUpdateDeploymentRuns|Yes|Total Update Deployment Runs|Count|Total|Total software update deployment runs|SoftwareUpdateConfigurationName, Status|


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


## Microsoft.Blockchain/blockchainMembers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BroadcastProcessedCount|Yes|Broadcast Processed Count|Count|Average|The number of transactions processed|Node, channel, type, status|
|ConnectionAccepted|Yes|Accepted Connections|Count|Total|Accepted Connections|Node|
|ConnectionActive|Yes|Active Connections|Count|Average|Active Connections|Node|
|ConnectionHandled|Yes|Handled Connections|Count|Total|Handled Connections|Node|
|ConsensusEtcdraftCommittedBlockNumber|Yes|Consensus Etcdraft Committed Block Number|Count|Average|The block number of the latest block committed|Node, channel|
|CpuUsagePercentageInDouble|Yes|CPU Usage Percentage|Percent|Maximum|CPU Usage Percentage|Node|
|EndorserEndorsementFailures|Yes|Endorser Endorsement Failures|Count|Average|The number of failed endorsements.|Node, channel, chaincode, chaincodeerror|
|GossipLeaderElectionLeader|Yes|Gossip Leader Election Leader|Count|Total|Peer is leader (1) or follower (0)|Node, channel|
|GossipMembershipTotalPeersKnown|Yes|Gossip Membership Total Peers Known|Count|Average|Total known peers|Node, channel|
|GossipStateHeight|Yes|Gossip State Height|Count|Average|Current ledger height|Node, channel|
|IOReadBytes|Yes|IO Read Bytes|Bytes|Total|IO Read Bytes|Node|
|IOWriteBytes|Yes|IO Write Bytes|Bytes|Total|IO Write Bytes|Node|
|LedgerTransactionCount|Yes|Ledger Transaction Count|Count|Average|Number of transactions processed|Node, channel, transaction_type, chaincode, validation_code|
|MemoryLimit|Yes|Memory Limit|Bytes|Average|Memory Limit|Node|
|MemoryUsage|Yes|Memory Usage|Bytes|Average|Memory Usage|Node|
|MemoryUsagePercentageInDouble|Yes|Memory Usage Percentage|Percent|Average|Memory Usage Percentage|Node|
|PendingTransactions|Yes|Pending Transactions|Count|Average|Pending Transactions|Node|
|ProcessedBlocks|Yes|Processed Blocks|Count|Total|Processed Blocks|Node|
|ProcessedTransactions|Yes|Processed Transactions|Count|Total|Processed Transactions|Node|
|QueuedTransactions|Yes|Queued Transactions|Count|Average|Queued Transactions|Node|
|RequestHandled|Yes|Handled Requests|Count|Total|Handled Requests|Node|
|StorageUsage|Yes|Storage Usage|Bytes|Average|Storage Usage|Node|


## Microsoft.Cache/redis

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
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


## Microsoft.Cdn/cdnwebapplicationfirewallpolicies

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
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
|ProcessedImages|Yes|Processed Images|Count|Total| Number of Transactions for image processing.|ApiName, FeatureName, UsageChannel, Region|
|ServerErrors|Yes|Server Errors|Count|Total|Number of calls with service internal error (HTTP response code 5xx).|ApiName, OperationName, Region|
|SpeechSessionDuration|Yes|Speech Session Duration|Seconds|Total|Total duration of speech session in seconds.|ApiName, OperationName, Region|
|SuccessfulCalls|Yes|Successful Calls|Count|Total|Number of successful calls.|ApiName, OperationName, Region|
|TotalCalls|Yes|Total Calls|Count|Total|Total number of calls.|ApiName, OperationName, Region|
|TotalErrors|Yes|Total Errors|Count|Total|Total number of calls with error response (HTTP response code 4xx or 5xx).|ApiName, OperationName, Region|
|TotalTokenCalls|Yes|Total Token Calls|Count|Total|Total number of token calls.|ApiName, OperationName, Region|
|TotalTransactions|Yes|Total Transactions|Count|Total|Total number of transactions.|No Dimensions|


## Microsoft.Compute/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
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
|OS Disk Queue Depth|Yes|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk QD|Yes|OS Disk QD (Deprecated)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Per Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|No Dimensions|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|No Dimensions|
|Per Disk QD|Yes|Data Disk QD (Deprecated)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|Per Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|No Dimensions|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|No Dimensions|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|No Dimensions|


## Microsoft.Compute/virtualMachineScaleSets

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN, VMName|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN, VMName|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN, VMName|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN, VMName|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN, VMName|
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
|OS Disk Queue Depth|Yes|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|VMName|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|VMName|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Per Disk QD|Yes|OS Disk QD (Deprecated)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Per Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|VMName|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|VMName|
|Per Disk QD|Yes|Data Disk QD (Deprecated)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|Per Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|VMName|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN, VMName|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN, VMName|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|VMName|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|VMName|


## Microsoft.Compute/virtualMachineScaleSets/virtualMachines

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CPU Credits Consumed|Yes|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|No Dimensions|
|CPU Credits Remaining|Yes|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|Data Disk Queue Depth|Yes|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|Data Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
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
|OS Disk Queue Depth|Yes|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk QD|Yes|OS Disk QD (Deprecated)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|OS Per Disk Read Bytes/sec|Yes|OS Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Read Operations/Sec|Yes|OS Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Bytes/sec|Yes|OS Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Operations/Sec|Yes|OS Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|Outbound Flows|Yes|Outbound Flows|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|No Dimensions|
|Outbound Flows Maximum Creation Rate|Yes|Outbound Flows Maximum Creation Rate|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|No Dimensions|
|Per Disk QD|Yes|Data Disk QD (Deprecated)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|Per Disk Read Bytes/sec|Yes|Data Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Yes|Data Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Yes|Data Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Yes|Data Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Percentage CPU|Yes|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|No Dimensions|
|Premium Data Disk Cache Read Hit|Yes|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Yes|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Yes|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|No Dimensions|
|Premium OS Disk Cache Read Miss|Yes|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|No Dimensions|


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
|kube_node_status_allocatable_cpu_cores|No|Total number of available cpu cores in a managed cluster|Count|Average|Total number of available cpu cores in a managed cluster|No Dimensions|
|kube_node_status_allocatable_memory_bytes|No|Total amount of available memory in a managed cluster|Bytes|Average|Total amount of available memory in a managed cluster|No Dimensions|
|kube_node_status_condition|No|Statuses for various node conditions|Count|Average|Statuses for various node conditions|condition, status, status2, node|
|kube_pod_status_phase|No|Number of pods by phase|Count|Average|Number of pods by phase|phase, namespace, pod|
|kube_pod_status_ready|No|Number of pods in Ready state|Count|Average|Number of pods in Ready state|namespace, pod|


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
|PipelineFailedRuns|Yes|Failed pipeline runs metrics|Count|Total||FailureType, Name|
|PipelineSucceededRuns|Yes|Succeeded pipeline runs metrics|Count|Total||FailureType, Name|
|ResourceCount|Yes|Total entities count|Count|Maximum||No Dimensions|
|TriggerCancelledRuns|Yes|Cancelled trigger runs metrics|Count|Total||Name, FailureType|
|TriggerFailedRuns|Yes|Failed trigger runs metrics|Count|Total||Name, FailureType|
|TriggerSucceededRuns|Yes|Succeeded trigger runs metrics|Count|Total||Name, FailureType|


## Microsoft.DataLakeStore/accounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|DataRead|Yes|Data Read|Bytes|Total|Total amount of data read from the account.|No Dimensions|
|DataWritten|Yes|Data Written|Bytes|Total|Total amount of data written to the account.|No Dimensions|
|ReadRequests|Yes|Read Requests|Count|Total|Count of data read requests to the account.|No Dimensions|
|TotalStorage|Yes|Total Storage|Bytes|Maximum|Total amount of data stored in the account.|No Dimensions|
|WriteRequests|Yes|Write Requests|Count|Total|Count of data write requests to the account.|No Dimensions|


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
|serverlog_storage_limit|Yes|Server Log storage limit|Bytes|Average|Server Log storage limit|No Dimensions|
|serverlog_storage_percent|Yes|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Yes|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|storage_limit|Yes|Storage limit|Bytes|Maximum|Storage limit|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


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


## Microsoft.DBforPostgreSQL/servers

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


## Microsoft.DBforPostgreSQL/singleservers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|active_connections|Yes|Active Connections|Count|Average|Active Connections|No Dimensions|
|connections_failed|Yes|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|connections_succeeded|Yes|Succeeded Connections|Count|Total|Succeeded Connections|No Dimensions|
|cpu_percent|Yes|CPU percent|Percent|Average|CPU percent|No Dimensions|
|iops|Yes|IOPS|Count|Average|IO Operations per second|No Dimensions|
|maximum_used_transactionIDs|Yes|Maximum Used Transaction IDs|Count|Average|Maximum Used Transaction IDs|No Dimensions|
|memory_percent|Yes|Memory percent|Percent|Average|Memory percent|No Dimensions|
|network_bytes_egress|Yes|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Yes|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|storage_percent|Yes|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Yes|Storage used|Bytes|Average|Storage used|No Dimensions|


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
|C2DMessagesExpired|Yes|C2D Messages Expired (preview)|Count|Total|Number of expired cloud-to-device messages|No Dimensions|
|configurations|Yes|Configuration Metrics|Count|Total|Metrics for Configuration Operations|No Dimensions|
|connectedDeviceCount|No|Connected devices (preview)|Count|Average|Number of devices connected to your IoT hub|No Dimensions|
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
|EventGridDeliveries|Yes|Event Grid deliveries (preview)|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|Result, EventType|
|EventGridLatency|Yes|Event Grid latency (preview)|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|EventType|
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
|totalDeviceCount|No|Total devices (preview)|Count|Average|Number of devices registered to your IoT hub|No Dimensions|
|twinQueries.failure|Yes|Failed twin queries|Count|Total|The count of all failed twin queries.|No Dimensions|
|twinQueries.resultSize|Yes|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|No Dimensions|
|twinQueries.success|Yes|Successful twin queries|Count|Total|The count of all successful twin queries.|No Dimensions|


## Microsoft.Devices/provisioningServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AttestationAttempts|Yes|Attestation attempts|Count|Total|Number of device attestations attempted|ProvisioningServiceName, Status, Protocol|
|DeviceAssignments|Yes|Devices assigned|Count|Total|Number of devices assigned to an IoT hub|ProvisioningServiceName, IotHubName|
|RegistrationAttempts|Yes|Registration attempts|Count|Total|Number of device registrations attempted|ProvisioningServiceName, IotHubName, Status|


## Microsoft.DocumentDB/databaseAccounts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AddRegion|Yes|Region Added|Count|Count|Region Added|Region|
|AutoscaleMaxThroughput|No|Autoscale Max Throughput|Count|Maximum|Autoscale Max Throughput|DatabaseName, CollectionName|
|AvailableStorage|No|(deprecated) Available Storage|Bytes|Total|"Available Storage" will be removed from Azure Monitor at the end of September 2020. Cosmos DB collection storage size is now unlimited. The only restriction is that the storage size for each logical partition key is 20GB. You can enable PartitionKeyStatistics in Diagnostic Log to know the storage consumption for top partition keys. For more info about Cosmos DB storage quota, please check this doc https://docs.microsoft.com/azure/cosmos-db/concepts-limits. After deprecation, the remaining alert rules still defined on the deprecated metric will be automatically disabled post the deprecation date.|CollectionName, DatabaseName, Region|
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
|MongoRequestsCount|No|Mongo Request Rate|CountPerSecond|Average|Mongo request Count per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsDelete|No|Mongo Delete Request Rate|CountPerSecond|Average|Mongo Delete request per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsInsert|No|Mongo Insert Request Rate|CountPerSecond|Average|Mongo Insert count per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsQuery|No|Mongo Query Request Rate|CountPerSecond|Average|Mongo Query request per second|DatabaseName, CollectionName, Region, ErrorCode|
|MongoRequestsUpdate|No|Mongo Update Request Rate|CountPerSecond|Average|Mongo Update request per second|DatabaseName, CollectionName, Region, ErrorCode|
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


## Microsoft.EventGrid/systemTopics

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


## Microsoft.EventGrid/topics

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


## Microsoft.EventHub/clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.|No Dimensions|
|AvailableMemory|No|Available Memory|Percent|Maximum|Available memory for the Event Hub Cluster as a percentage of total memory.|Role|
|CaptureBacklog|No|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|No Dimensions|
|CapturedBytes|No|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|No Dimensions|
|CapturedMessages|No|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|No Dimensions|
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|No Dimensions|
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|No Dimensions|
|CPU|No|CPU|Percent|Maximum|CPU utilization for the Event Hub Cluster as a percentage|Role|
|IncomingBytes|Yes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|No Dimensions|
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|No Dimensions|
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|No Dimensions|
|OutgoingBytes|Yes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|No Dimensions|
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|No Dimensions|
|QuotaExceededErrors|No|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|No Dimensions|
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|No Dimensions|
|Size|No|Size|Bytes|Average|Size of an EventHub in Bytes.|Role|
|SuccessfulRequests|No|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|No Dimensions|
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|No Dimensions|
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|No Dimensions|


## Microsoft.EventHub/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.|No Dimensions|
|CaptureBacklog|No|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|EntityName|
|CapturedBytes|No|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|EntityName|
|CapturedMessages|No|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|EntityName|
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|EntityName|
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|EntityName|
|EHABL|Yes|Archive backlog messages (Deprecated)|Count|Total|Event Hub archive messages in backlog for a namespace (Deprecated)|No Dimensions|
|EHAMBS|Yes|Archive message throughput (Deprecated)|Bytes|Total|Event Hub archived message throughput in a namespace (Deprecated)|No Dimensions|
|EHAMSGS|Yes|Archive messages (Deprecated)|Count|Total|Event Hub archived messages in a namespace (Deprecated)|No Dimensions|
|EHINBYTES|Yes|Incoming bytes (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace (Deprecated)|No Dimensions|
|EHINMBS|Yes|Incoming bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace. This metric is deprecated. Please use Incoming bytes metric instead (Deprecated)|No Dimensions|
|EHINMSGS|Yes|Incoming Messages (Deprecated)|Count|Total|Total incoming messages for a namespace (Deprecated)|No Dimensions|
|EHOUTBYTES|Yes|Outgoing bytes (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace (Deprecated)|No Dimensions|
|EHOUTMBS|Yes|Outgoing bytes (obsolete) (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace. This metric is deprecated. Please use Outgoing bytes metric instead (Deprecated)|No Dimensions|
|EHOUTMSGS|Yes|Outgoing Messages (Deprecated)|Count|Total|Total outgoing messages for a namespace (Deprecated)|No Dimensions|
|FAILREQ|Yes|Failed Requests (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|No Dimensions|
|IncomingBytes|Yes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|EntityName|
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|EntityName|
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|EntityName|
|INMSGS|Yes|Incoming Messages (obsolete) (Deprecated)|Count|Total|Total incoming messages for a namespace. This metric is deprecated. Please use Incoming Messages metric instead (Deprecated)|No Dimensions|
|INREQS|Yes|Incoming Requests (Deprecated)|Count|Total|Total incoming send requests for a namespace (Deprecated)|No Dimensions|
|INTERR|Yes|Internal Server Errors (Deprecated)|Count|Total|Total internal server errors for a namespace (Deprecated)|No Dimensions|
|MISCERR|Yes|Other Errors (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|No Dimensions|
|OutgoingBytes|Yes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|EntityName|
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|EntityName|
|OUTMSGS|Yes|Outgoing Messages (obsolete) (Deprecated)|Count|Total|Total outgoing messages for a namespace. This metric is deprecated. Please use Outgoing Messages metric instead (Deprecated)|No Dimensions|
|QuotaExceededErrors|No|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|EntityName, |
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|EntityName, |
|Size|No|Size|Bytes|Average|Size of an EventHub in Bytes.|EntityName|
|SuccessfulRequests|No|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|EntityName, |
|SUCCREQ|Yes|Successful Requests (Deprecated)|Count|Total|Total successful requests for a namespace (Deprecated)|No Dimensions|
|SVRBSY|Yes|Server Busy Errors (Deprecated)|Count|Total|Total server busy errors for a namespace (Deprecated)|No Dimensions|
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|EntityName, |
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|EntityName, |


## Microsoft.HDInsight/clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CategorizedGatewayRequests|Yes|Categorized Gateway Requests|Count|Total|Number of gateway requests by categories (1xx/2xx/3xx/4xx/5xx)|HttpStatus|
|GatewayRequests|Yes|Gateway Requests|Count|Total|Number of gateway requests|HttpStatus|
|NumActiveWorkers|Yes|Number of Active Workers|Count|Maximum|Number of Active Workers|MetricName|


## Microsoft.Insights/AutoscaleSettings

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|MetricThreshold|Yes|Metric Threshold|Count|Average|The configured autoscale threshold when autoscale ran.|MetricTriggerRule|
|ObservedCapacity|Yes|Observed Capacity|Count|Average|The capacity reported to autoscale when it executed.|No Dimensions|
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
|c2d.property.read.failure|Yes|Failed Device Property Reads from IoT Central|Count|Total|The count of all failed property reads initiated from IoT Central|No Dimensions|
|c2d.property.read.success|Yes|Successful Device Property Reads from IoT Central|Count|Total|The count of all successful property reads initiated from IoT Central|No Dimensions|
|c2d.property.update.failure|Yes|Failed Device Property Updates from IoT Central|Count|Total|The count of all failed property updates initiated from IoT Central|No Dimensions|
|c2d.property.update.success|Yes|Successful Device Property Updates from IoT Central|Count|Total|The count of all successful property updates initiated from IoT Central|No Dimensions|
|connectedDeviceCount|No|Total Connected Devices|Count|Average|Number of devices connected to IoT Central|No Dimensions|
|d2c.property.read.failure|Yes|Failed Device Property Reads from Devices|Count|Total|The count of all failed property reads initiated from devices|No Dimensions|
|d2c.property.read.success|Yes|Successful Device Property Reads from Devices|Count|Total|The count of all successful property reads initiated from devices|No Dimensions|
|d2c.property.update.failure|Yes|Failed Device Property Updates from Devices|Count|Total|The count of all failed property updates initiated from devices|No Dimensions|
|d2c.property.update.success|Yes|Successful Device Property Updates from Devices|Count|Total|The count of all successful property updates initiated from devices|No Dimensions|


## Microsoft.KeyVault/vaults

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Availability|Yes|Overall Vault Availability|Percent|Average|Vault requests availability|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|SaturationShoebox|No|Overall Vault Saturation|Percent|Average|Vault capacity used|ActivityType, ActivityName, TransactionType|
|ServiceApiHit|Yes|Total Service Api Hits|Count|Count|Number of total service api hits|ActivityType, ActivityName|
|ServiceApiLatency|Yes|Overall Service Api Latency|Milliseconds|Average|Overall latency of service api requests|ActivityType, ActivityName, StatusCode, StatusCodeClass|
|ServiceApiResult|Yes|Total Service Api Results|Count|Count|Number of total service api results|ActivityType, ActivityName, StatusCode, StatusCodeClass|


## Microsoft.Kusto/Clusters

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BatchBlobCount|Yes|Batch Blob Count|Count|Average|Number of data sources in an aggregated batch for ingestion.|Database|
|BatchDuration|Yes|Batch Duration|Seconds|Average|The duration of the aggregation phase in the ingestion flow.|Database|
|BatchesProcessed|Yes|Batches Processed|Count|Average|Number of batches aggregated for ingestion. Batch Completion Reason: Whether the batch reached batching time, data size or number of files limit set by batching policy|Database, SealReason|
|BatchSize|Yes|Batch Size|Bytes|Average|Uncompressed expected data size in an aggregated batch for ingestion.|Database|
|CacheUtilization|Yes|Cache utilization|Percent|Average|Utilization level in the cluster scope|No Dimensions|
|ContinuousExportMaxLatenessMinutes|Yes|Continuous Export Max Lateness|Count|Maximum|The lateness (in minutes) reported by the continuous export jobs in the cluster|No Dimensions|
|ContinuousExportNumOfRecordsExported|Yes|Continuous export – num of exported records|Count|Total|Number of records exported, fired for every storage artifact written during the export operation|ContinuousExportName, Database|
|ContinuousExportPendingCount|Yes|Continuous Export Pending Count|Count|Maximum|The number of pending continuous export jobs ready for execution|No Dimensions|
|ContinuousExportResult|Yes|Continuous Export Result|Count|Count|Indicates whether Continuous Export succeeded or failed|ContinuousExportName, Result, Database|
|CPU|Yes|CPU|Percent|Average|CPU utilization level|No Dimensions|
|EventsProcessedForEventHubs|Yes|Events processed (for Event/IoT Hubs)|Count|Total|Number of events processed by the cluster when ingesting from Event/IoT Hub|EventStatus|
|ExportUtilization|Yes|Export Utilization|Percent|Maximum|Export utilization|No Dimensions|
|IngestionLatencyInSeconds|Yes|Ingestion latency (in seconds)|Seconds|Average|Ingestion time from the source (e.g. message is in EventHub) to the cluster in seconds|No Dimensions|
|IngestionResult|Yes|Ingestion result|Count|Count|Number of ingestion operations|IngestionResultDetails|
|IngestionUtilization|Yes|Ingestion utilization|Percent|Average|Ratio of used ingestion slots in the cluster|No Dimensions|
|IngestionVolumeInMB|Yes|Ingestion volume (in MB)|Count|Total|Overall volume of ingested data to the cluster (in MB)|No Dimensions|
|InstanceCount|Yes|Instance Count|Count|Average|Total instance count|No Dimensions|
|KeepAlive|Yes|Keep alive|Count|Average|Sanity check indicates the cluster responds to queries|No Dimensions|
|QueryDuration|Yes|Query duration|Milliseconds|Average|Queries’ duration in seconds|QueryStatus|
|SteamingIngestRequestRate|Yes|Streaming Ingest Request Rate|Count|RateRequestsPerSecond|Streaming ingest request rate (requests per second)|No Dimensions|
|StreamingIngestDataRate|Yes|Streaming Ingest Data Rate|Count|Average|Streaming ingest data rate (MB per second)|No Dimensions|
|StreamingIngestDuration|Yes|Streaming Ingest Duration|Milliseconds|Average|Streaming ingest duration in milliseconds|No Dimensions|
|StreamingIngestResults|Yes|Streaming Ingest Result|Count|Average|Streaming ingest result|Result|
|TotalNumberOfConcurrentQueries|Yes|Total number of concurrent queries|Count|Total|Total number of concurrent queries|No Dimensions|
|TotalNumberOfExtents|Yes|Total number of extents|Count|Total|Total number of data extents|No Dimensions|
|TotalNumberOfThrottledCommands|Yes|Total number of throttled commands|Count|Total|Total number of throttled commands|CommandType|
|TotalNumberOfThrottledQueries|Yes|Total number of throttled queries|Count|Total|Total number of throttled queries|No Dimensions|


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
|Cancel Requested Runs|Yes|Cancel Requested Runs|Count|Total|Number of runs where cancel was requested for this workspace. Count is updated when cancellation request has been received for a run.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Cancelled Runs|Yes|Cancelled Runs|Count|Total|Number of runs cancelled for this workspace. Count is updated when a run is successfully cancelled.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Completed Runs|Yes|Completed Runs|Count|Total|Number of runs completed successfully for this workspace. Count is updated when a run has completed and output has been collected.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|CpuUtilization|Yes|CpuUtilization|Count|Average|Percentage of memory utilization on a CPU node. Utilization is reported at one minute intervals.|Scenario, runId, NodeId, ClusterName|
|Errors|Yes|Errors|Count|Total|Number of run errors in this workspace. Count is updated whenever run encounters an error.|Scenario|
|Failed Runs|Yes|Failed Runs|Count|Total|Number of runs failed for this workspace. Count is updated when a run fails.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Finalizing Runs|Yes|Finalizing Runs|Count|Total|Number of runs entered finalizing state for this workspace. Count is updated when a run has completed but output collection still in progress.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|GpuUtilization|Yes|GpuUtilization|Count|Average|Percentage of memory utilization on a GPU node. Utilization is reported at one minute intervals.|Scenario, runId, NodeId, DeviceId, ClusterName|
|Idle Cores|Yes|Idle Cores|Count|Average|Number of idle cores|Scenario, ClusterName|
|Idle Nodes|Yes|Idle Nodes|Count|Average|Number of idle nodes. Idle nodes are the nodes which are not running any jobs but can accept new job if available.|Scenario, ClusterName|
|Leaving Cores|Yes|Leaving Cores|Count|Average|Number of leaving cores|Scenario, ClusterName|
|Leaving Nodes|Yes|Leaving Nodes|Count|Average|Number of leaving nodes. Leaving nodes are the nodes which just finished processing a job and will go to Idle state.|Scenario, ClusterName|
|Model Deploy Failed|Yes|Model Deploy Failed|Count|Total|Number of model deployments that failed in this workspace|Scenario, StatusCode|
|Model Deploy Started|Yes|Model Deploy Started|Count|Total|Number of model deployments started in this workspace|Scenario|
|Model Deploy Succeeded|Yes|Model Deploy Succeeded|Count|Total|Number of model deployments that succeeded in this workspace|Scenario|
|Model Register Failed|Yes|Model Register Failed|Count|Total|Number of model registrations that failed in this workspace|Scenario, StatusCode|
|Model Register Succeeded|Yes|Model Register Succeeded|Count|Total|Number of model registrations that succeeded in this workspace|Scenario|
|Not Responding Runs|Yes|Not Responding Runs|Count|Total|Number of runs not responding for this workspace. Count is updated when a run enters Not Responding state.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Not Started Runs|Yes|Not Started Runs|Count|Total|Number of runs in Not Started state for this workspace. Count is updated when a request is received to create a run but run information has not yet been populated. |Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Preempted Cores|Yes|Preempted Cores|Count|Average|Number of preempted cores|Scenario, ClusterName|
|Preempted Nodes|Yes|Preempted Nodes|Count|Average|Number of preempted nodes. These nodes are the low priority nodes which are taken away from the available node pool.|Scenario, ClusterName|
|Preparing Runs|Yes|Preparing Runs|Count|Total|Number of runs that are preparing for this workspace. Count is updated when a run enters Preparing state while the run environment is being prepared.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Provisioning Runs|Yes|Provisioning Runs|Count|Total|Number of runs that are provisioning for this workspace. Count is updated when a run is waiting on compute target creation or provisioning.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Queued Runs|Yes|Queued Runs|Count|Total|Number of runs that are queued for this workspace. Count is updated when a run is queued in compute target. Can occur when waiting for required compute nodes to be ready.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Quota Utilization Percentage|Yes|Quota Utilization Percentage|Count|Average|Percent of quota utilized|Scenario, ClusterName, VmFamilyName, VmPriority|
|Started Runs|Yes|Started Runs|Count|Total|Number of runs running for this workspace. Count is updated when run starts running on required resources.|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Starting Runs|Yes|Starting Runs|Count|Total|Number of runs started for this workspace. Count is updated after request to create run and run info, such as the Run Id, has been populated|Scenario, RunType, PublishedPipelineId, ComputeType, PipelineStepType|
|Total Cores|Yes|Total Cores|Count|Average|Number of total cores|Scenario, ClusterName|
|Total Nodes|Yes|Total Nodes|Count|Average|Number of total nodes. This total includes some of Active Nodes, Idle Nodes, Unusable Nodes, Preempted Nodes, Leaving Nodes|Scenario, ClusterName|
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
|ContentKeyPolicyCount|Yes|Content Key Policy count|Count|Average|How many content key policies are already created in current media service account|No Dimensions|
|ContentKeyPolicyQuota|Yes|Content Key Policy quota|Count|Average|How many content key polices are allowed for current media service account|No Dimensions|
|ContentKeyPolicyQuotaUsedPercentage|Yes|Content Key Policy quota used percentage|Percent|Average|Content Key Policy used percentage in current media service account|No Dimensions|
|StreamingPolicyCount|Yes|Streaming Policy count|Count|Average|How many streaming policies are already created in current media service account|No Dimensions|
|StreamingPolicyQuota|Yes|Streaming Policy quota|Count|Average|How many streaming policies are allowed for current media service account|No Dimensions|
|StreamingPolicyQuotaUsedPercentage|Yes|Streaming Policy quota used percentage|Percent|Average|Streaming Policy used percentage in current media service account|No Dimensions|


## Microsoft.Media/mediaservices/streamingEndpoints

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|Egress|Yes|Egress|Bytes|Total|The amount of Egress data, in bytes.|OutputFormat|
|Requests|Yes|Requests|Count|Total|Requests to a Streaming Endpoint.|OutputFormat, HttpStatusCode, ErrorCode|
|SuccessE2ELatency|Yes|Success end to end Latency|Milliseconds|Average|The average latency for successful requests in milliseconds.|OutputFormat|


## Microsoft.NetApp/netAppAccounts/capacityPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|VolumePoolAllocatedSize|Yes|Pool Allocated Size|Bytes|Average|Provisioned size of this pool|No Dimensions|
|VolumePoolAllocatedUsed|Yes|Pool Allocated To Volume Size|Bytes|Average|Allocated used size of the pool|No Dimensions|
|VolumePoolTotalLogicalSize|Yes|Pool Consumed Size|Bytes|Average|Sum of the logical size of all the volumes belonging to the pool|No Dimensions|
|VolumePoolTotalSnapshotSize|Yes|Total Snapshot size for the pool|Bytes|Average|Sum of snapshot size of all volumes in this pool|No Dimensions|


## Microsoft.NetApp/netAppAccounts/capacityPools/volumes

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageReadLatency|Yes|Average read latency|MilliSeconds|Average|Average read latency in milliseconds per operation|No Dimensions|
|AverageWriteLatency|Yes|Average write latency|MilliSeconds|Average|Average write latency in milliseconds per operation|No Dimensions|
|CbsVolumeBackupActive|Yes|Volume backup active state|Count|Average|Is backup currently suspended for the volume.|No Dimensions|
|CbsVolumeLogicalBackupBytes|Yes|Logical bytes backed up|Bytes|Average|Total un-compressed/un-encrypted bytes backed up for this Volume.|No Dimensions|
|CbsVolumeOperationComplete|Yes|Operation state|Count|Average|Is last backup/restore operation successful.|No Dimensions|
|CbsVolumeOperationTransferredBytes|Yes|Bytes transferred for operation|Bytes|Average|Total bytes transferred for last backup/restore operation.|No Dimensions|
|CbsVolumeProtected|Yes|Volume protected state|Count|Average|Is volume protected by cloud backup service.|No Dimensions|
|ReadIops|Yes|Read iops|CountPerSecond|Average|Read In/out operations per second|No Dimensions|
|VolumeAllocatedSize|Yes|Volume allocated size|Bytes|Average|The provisioned size of a volume|No Dimensions|
|VolumeLogicalSize|Yes|Volume Consumed Size|Bytes|Average|Logical size of the volume (used bytes)|No Dimensions|
|VolumeSnapshotSize|Yes|Volume snapshot size|Bytes|Average|Size of all snapshots in volume|No Dimensions|
|WriteIops|Yes|Write iops|CountPerSecond|Average|Write In/out operations per second|No Dimensions|
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
|ClientRtt|No|Client RTT|MilliSeconds|Average|Average round trip time between clients and Application Gateway. This metric indicates how long it takes to establish connections and return acknowledgments|Listener|
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


## Microsoft.Network/connections

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond|Yes|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|Yes|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|No Dimensions|


## Microsoft.Network/dnszones

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|QueryVolume|Yes|Query Volume|Count|Total|Number of queries served for a DNS zone|No Dimensions|
|RecordSetCapacityUtilization|No|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a DNS zone|No Dimensions|
|RecordSetCount|Yes|Record Set Count|Count|Maximum|Number of Record Sets in a DNS zone|No Dimensions|


## Microsoft.Network/expressRouteCircuits

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ArpAvailability|Yes|Arp Availability|Percent|Average|ARP Availability from MSEE towards all peers.|PeeringType, Peer|
|BgpAvailability|Yes|Bgp Availability|Percent|Average|BGP Availability from MSEE towards all peers.|PeeringType, Peer|
|BitsInPerSecond|No|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|PeeringType|
|BitsOutPerSecond|No|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|PeeringType|
|GlobalReachBitsInPerSecond|No|GlobalReachBitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|PeeredCircuitSKey|
|GlobalReachBitsOutPerSecond|No|GlobalReachBitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|PeeredCircuitSKey|
|QosDropBitsInPerSecond|No|DroppedInBitsPerSecond|CountPerSecond|Average|Ingress bits of data dropped per second|No Dimensions|
|QosDropBitsOutPerSecond|No|DroppedOutBitsPerSecond|CountPerSecond|Average|Egress bits of data dropped per second|No Dimensions|


## Microsoft.Network/expressRouteCircuits/peerings

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BitsInPerSecond|Yes|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|Yes|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|No Dimensions|


## Microsoft.Network/expressRouteGateways

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ErGatewayConnectionBitsInPerSecond|No|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|ConnectionName|
|ErGatewayConnectionBitsOutPerSecond|No|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|ConnectionName|


## Microsoft.Network/expressRoutePorts

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdminState|Yes|AdminState|Count|Average|Admin state of the port|Link|
|LineProtocol|Yes|LineProtocol|Count|Average|Line protocol status of the port|Link|
|PortBitsInPerSecond|Yes|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|Link|
|PortBitsOutPerSecond|Yes|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|Link|
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
|ByteCount|Yes|Byte Count|Count|Total|Total number of Bytes transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|DipAvailability|Yes|Health Probe Status|Count|Average|Average Load Balancer health probe status per time duration|ProtocolType, BackendPort, FrontendIPAddress, FrontendPort, BackendIPAddress|
|PacketCount|Yes|Packet Count|Count|Total|Total number of Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|SnatConnectionCount|Yes|SNAT Connection Count|Count|Total|Total number of new SNAT connections created within time period|FrontendIPAddress, BackendIPAddress, ConnectionState|
|SYNCount|Yes|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|UsedSnatPorts|No|Used SNAT Ports|Count|Average|Total number of SNAT ports used within time period|FrontendIPAddress, BackendIPAddress, ProtocolType, |
|VipAvailability|Yes|Data Path Availability|Count|Average|Average Load Balancer data path availability per time duration|FrontendIPAddress, FrontendPort|


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
|AverageRoundtripMs|Yes|Avg. Round-trip Time (ms)|MilliSeconds|Average|Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination|No Dimensions|
|ChecksFailedPercent|Yes|Checks Failed Percent (Preview)|Percent|Average|% of connectivity monitoring checks failed|SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName|
|ProbesFailedPercent|Yes|% Probes Failed|Percent|Average|% of connectivity monitoring probes failed|No Dimensions|
|RoundTripTimeMs|Yes|Round-Trip Time (ms) (Preview)|MilliSeconds|Average|Round-trip time in milliseconds for the connectivity monitoring checks|SourceAddress, SourceName, SourceResourceId, SourceType, Protocol, DestinationAddress, DestinationName, DestinationResourceId, DestinationType, DestinationPort, TestGroupName, TestConfigurationName|


## Microsoft.Network/publicIPAddresses

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ByteCount|Yes|Byte Count|Count|Total|Total number of Bytes transmitted within time period|Port, Direction|
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
|P2SBandwidth|Yes|Gateway P2S Bandwidth|BytesPerSecond|Average|Average point-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|P2SConnectionCount|Yes|P2S Connection Count|Count|Maximum|Point-to-site connection count of a gateway|Protocol|
|TunnelAverageBandwidth|Yes|Tunnel Bandwidth|BytesPerSecond|Average|Average bandwidth of a tunnel in bytes per second|ConnectionName, RemoteIP|
|TunnelEgressBytes|Yes|Tunnel Egress Bytes|Bytes|Total|Outgoing bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPacketDropTSMismatch|Yes|Tunnel Egress TS Mismatch Packet Drop|Count|Total|Outgoing packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPackets|Yes|Tunnel Egress Packets|Count|Total|Outgoing packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressBytes|Yes|Tunnel Ingress Bytes|Bytes|Total|Incoming bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPacketDropTSMismatch|Yes|Tunnel Ingress TS Mismatch Packet Drop|Count|Total|Incoming packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPackets|Yes|Tunnel Ingress Packets|Count|Total|Incoming packet count of a tunnel|ConnectionName, RemoteIP|


## Microsoft.Network/virtualNetworks

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PingMeshAverageRoundtripMs|Yes|Round trip time for Pings to a VM|MilliSeconds|Average|Round trip time for Pings sent to a destination VM|SourceCustomerAddress, DestinationCustomerAddress|
|PingMeshProbesFailedPercent|Yes|Failed Pings to a VM|Percent|Average|Percent of number of failed Pings to total sent Pings of a destination VM|SourceCustomerAddress, DestinationCustomerAddress|


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
|EgressTrafficRate|Yes|Egress Traffic Rate|BitsPerSecond|Average|Egress traffic rate in bits per second|ConnectionId|
|IngressTrafficRate|Yes|Ingress Traffic Rate|BitsPerSecond|Average|Ingress traffic rate in bits per second|ConnectionId|
|SessionAvailabilityV4|Yes|Session Availability V4|Percent|Average|Availability of the V4 session|ConnectionId|
|SessionAvailabilityV6|Yes|Session Availability V6|Percent|Average|Availability of the V6 session|ConnectionId|


## Microsoft.Peering/peeringServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|PrefixLatency|Yes|Prefix Latency|Milliseconds|Average|Median prefix latency|PrefixName|


## Microsoft.PowerBIDedicated/capacities

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|memory_metric|Yes|Memory|Bytes|Average|Memory. Range 0-3 GB for A1, 0-5 GB for A2, 0-10 GB for A3, 0-25 GB for A4, 0-50 GB for A5 and 0-100 GB for A6|No Dimensions|
|memory_thrashing_metric|Yes|Memory Thrashing (Datasets)|Percent|Average|Average memory thrashing.|No Dimensions|
|qpu_high_utilization_metric|Yes|QPU High Utilization|Count|Total|QPU High Utilization In Last Minute, 1 For High QPU Utilization, Otherwise 0|No Dimensions|
|QueryDuration|Yes|Query Duration (Datasets)|Milliseconds|Average|DAX Query duration in last interval|No Dimensions|
|QueryPoolJobQueueLength|Yes|Query Pool Job Queue Length (Datasets)|Count|Average|Number of jobs in the queue of the query thread pool.|No Dimensions|


## Microsoft.Relay/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Total|Total ActiveConnections for Microsoft.Relay.|EntityName|
|ActiveListeners|No|ActiveListeners|Count|Total|Total ActiveListeners for Microsoft.Relay.|EntityName|
|BytesTransferred|Yes|BytesTransferred|Count|Total|Total BytesTransferred for Microsoft.Relay.|EntityName|
|ListenerConnections-ClientError|No|ListenerConnections-ClientError|Count|Total|ClientError on ListenerConnections for Microsoft.Relay.|EntityName, |
|ListenerConnections-ServerError|No|ListenerConnections-ServerError|Count|Total|ServerError on ListenerConnections for Microsoft.Relay.|EntityName, |
|ListenerConnections-Success|No|ListenerConnections-Success|Count|Total|Successful ListenerConnections for Microsoft.Relay.|EntityName, |
|ListenerConnections-TotalRequests|No|ListenerConnections-TotalRequests|Count|Total|Total ListenerConnections for Microsoft.Relay.|EntityName|
|ListenerDisconnects|No|ListenerDisconnects|Count|Total|Total ListenerDisconnects for Microsoft.Relay.|EntityName|
|SenderConnections-ClientError|No|SenderConnections-ClientError|Count|Total|ClientError on SenderConnections for Microsoft.Relay.|EntityName, |
|SenderConnections-ServerError|No|SenderConnections-ServerError|Count|Total|ServerError on SenderConnections for Microsoft.Relay.|EntityName, |
|SenderConnections-Success|No|SenderConnections-Success|Count|Total|Successful SenderConnections for Microsoft.Relay.|EntityName, |
|SenderConnections-TotalRequests|No|SenderConnections-TotalRequests|Count|Total|Total SenderConnections requests for Microsoft.Relay.|EntityName|
|SenderDisconnects|No|SenderDisconnects|Count|Total|Total SenderDisconnects for Microsoft.Relay.|EntityName|


## Microsoft.Search/searchServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|SearchLatency|Yes|Search Latency|Seconds|Average|Average search latency for the search service|No Dimensions|
|SearchQueriesPerSecond|Yes|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|No Dimensions|
|ThrottledSearchQueriesPercentage|Yes|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|No Dimensions|


## Microsoft.ServiceBus/namespaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ActiveConnections|No|ActiveConnections|Count|Total|Total Active Connections for Microsoft.ServiceBus.|No Dimensions|
|ActiveMessages|No|Count of active messages in a Queue/Topic.|Count|Average|Count of active messages in a Queue/Topic.|EntityName|
|ConnectionsClosed|No|Connections Closed.|Count|Average|Connections Closed for Microsoft.ServiceBus.|EntityName|
|ConnectionsOpened|No|Connections Opened.|Count|Average|Connections Opened for Microsoft.ServiceBus.|EntityName|
|CPUXNS|No|CPU (Deprecated)|Percent|Maximum|Service bus premium namespace CPU usage metric. This metric is deprecated. Please use the CPU metric (NamespaceCpuUsage) instead.|No Dimensions|
|DeadletteredMessages|No|Count of dead-lettered messages in a Queue/Topic.|Count|Average|Count of dead-lettered messages in a Queue/Topic.|EntityName|
|IncomingMessages|Yes|Incoming Messages|Count|Total|Incoming Messages for Microsoft.ServiceBus.|EntityName|
|IncomingRequests|Yes|Incoming Requests|Count|Total|Incoming Requests for Microsoft.ServiceBus.|EntityName|
|Messages|No|Count of messages in a Queue/Topic.|Count|Average|Count of messages in a Queue/Topic.|EntityName|
|NamespaceCpuUsage|No|CPU|Percent|Maximum|Service bus premium namespace CPU usage metric.|No Dimensions|
|NamespaceMemoryUsage|No|Memory Usage|Percent|Maximum|Service bus premium namespace memory usage metric.|No Dimensions|
|OutgoingMessages|Yes|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.ServiceBus.|EntityName|
|ScheduledMessages|No|Count of scheduled messages in a Queue/Topic.|Count|Average|Count of scheduled messages in a Queue/Topic.|EntityName|
|ServerErrors|No|Server Errors.|Count|Total|Server Errors for Microsoft.ServiceBus.|EntityName, |
|Size|No|Size|Bytes|Average|Size of an Queue/Topic in Bytes.|EntityName|
|SuccessfulRequests|No|Successful Requests|Count|Total|Total successful requests for a namespace|EntityName, |
|ThrottledRequests|No|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.ServiceBus.|EntityName, |
|UserErrors|No|User Errors.|Count|Total|User Errors for Microsoft.ServiceBus.|EntityName, |
|WSXNS|No|Memory Usage (Deprecated)|Percent|Maximum|Service bus premium namespace memory usage metric. This metric is deprecated. Please use the  Memory Usage (NamespaceMemoryUsage) metric instead.|No Dimensions|


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
|dw_backup_size_gb|Yes|Data Storage Size (GB)|Count|Total|Data Storage Size is comprised of the size of your data and the transaction log. The metric is counted towards the ‘Storage’ portion of your bill. Applies only to data warehouses.|No Dimensions|
|dw_geosnapshot_size_gb|Yes|Disaster Recovery Storage Size (GB)|Count|Total|Disaster Recovery Storage Size is reflected as ‘Disaster Recovery Storage’ in your bill. Applies only to data warehouses.|No Dimensions|
|dw_snapshot_size_gb|Yes|Snapshot Storage Size (GB)|Count|Total|Snapshot Storage Size is the size of the incremental changes captured by snapshots to create user-defined and automatic restore points. The metric is counted towards the ‘Storage’ portion of your bill. Applies only to data warehouses.|No Dimensions|
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
|tempdb_data_size|Yes|Tempdb Data File Size Kilobytes|Count|Maximum|Tempdb Data File Size Kilobytes. Not applicable to data warehouses.|No Dimensions|
|tempdb_log_size|Yes|Tempdb Log File Size Kilobytes|Count|Maximum|Tempdb Log File Size Kilobytes. Not applicable to data warehouses.|No Dimensions|
|tempdb_log_used_percent|Yes|Tempdb Percent Log Used|Percent|Maximum|Tempdb Percent Log Used. Not applicable to data warehouses.|No Dimensions|
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
|tempdb_data_size|Yes|Tempdb Data File Size Kilobytes|Count|Maximum|Tempdb Data File Size Kilobytes|No Dimensions|
|tempdb_log_size|Yes|Tempdb Log File Size Kilobytes|Count|Maximum|Tempdb Log File Size Kilobytes|No Dimensions|
|tempdb_log_used_percent|Yes|Tempdb Percent Log Used|Percent|Maximum|Tempdb Percent Log Used|No Dimensions|
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
|UsedCapacity|No|Used capacity|Bytes|Average|The amount of storage used by the storage account. For standard storage accounts, it's the sum of capacity used by blob, table, file, and queue. For premium storage accounts and Blob storage accounts, it is the same as BlobCapacity or FileCapacity.|No Dimensions|


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


## microsoft.storagesync/storageSyncServices

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerSyncSessionResult|Yes|Sync Session Result|Count|Average|Metric that logs a value of 1 each time the Server Endpoint successfully completes a Sync Session with the Cloud Endpoint|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncBatchTransferredFileBytes|Yes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncRecalledNetworkBytesByApplication|Yes|Cloud tiering recall size by application|Bytes|Total|Size of data recalled by application|SyncGroupName, ServerName, ApplicationName|
|StorageSyncRecalledTotalNetworkBytes|Yes|Cloud tiering recall size|Bytes|Total|Size of data recalled|SyncGroupName, ServerName|
|StorageSyncRecallIOTotalSizeBytes|Yes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerName|
|StorageSyncRecallThroughputBytesPerSecond|Yes|Cloud tiering recall throughput|BytesPerSecond|Average|Size of data recall throughput|SyncGroupName, ServerName|
|StorageSyncServerHeartbeat|Yes|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the registered server successfully records a heartbeat with the Cloud Endpoint|ServerName|
|StorageSyncSyncSessionAppliedFilesCount|Yes|Files Synced|Count|Total|Count of Files synced|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncSyncSessionPerItemErrorsCount|Yes|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName, ServerEndpointName, SyncDirection|


## microsoft.storagesync/storageSyncServices/registeredServers

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|ServerHeartbeat|Yes|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the registered server successfully records a heartbeat with the Cloud Endpoint|ServerResourceId, ServerName|
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
|ResourceUtilization|Yes|SU % Utilization|Percent|Maximum|SU % Utilization|LogicalName, PartitionId|


## Microsoft.Synapse/workspaces

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|OrchestrationActivityRunsEnded|No|Activity runs ended|Count|Total|Count of orchestration activities that succeeded, failed, or were cancelled|Result, FailureType, Activity, ActivityType, Pipeline|
|OrchestrationPipelineRunsEnded|No|Pipeline runs ended|Count|Total|Count of orchestration pipeline runs that succeeded, failed, or were cancelled|Result, FailureType, Pipeline|
|OrchestrationTriggersEnded|No|Triggers ended|Count|Total|Count of orchestration triggers that succeeded, failed, or were cancelled|Result, FailureType, Trigger|
|SQLOnDemandLoginAttempts|No|Login attempts|Count|Total|Count of login attempts that succeeded or failed|Result|
|SQLOnDemandQueriesEnded|No|Queries ended|Count|Total|Count of queries that succeeded, failed, or were cancelled|Result|
|SQLOnDemandQueryProcessedBytes|No|Data processed|Bytes|Total|Amount of data processed by queries|No Dimensions|


## Microsoft.Synapse/workspaces/bigDataPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CoresCapacity|No|Cores capacity|Count|Maximum|Cores capacity|No Dimensions|
|MemoryCapacityGB|No|Memory capacity (GB)|Count|Maximum|Memory capacity (GB)|No Dimensions|
|SparkJobsEnded|Yes|Ended applications|Count|Total|Count of ended applications|JobType, JobResult|


## Microsoft.Synapse/workspaces/sqlPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AdaptiveCacheHitPercent|No|Adaptive cache hit percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache hit percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|No Dimensions|
|AdaptiveCacheUsedPercent|No|Adaptive cache used percentage|Percent|Maximum|Measures how well workloads are utilizing the adaptive cache. Use this metric with the cache used percentage metric to determine whether to scale for additional capacity or rerun workloads to hydrate the cache|No Dimensions|
|Connections|Yes|Connections|Count|Total|Count of Total logins to the dedicated SQL pool|Result|
|ConnectionsBlockedByFirewall|No|Connections blocked by firewall|Count|Total|Count of connections blocked by firewall rules. Revisit access control policies for your dedicated SQL pool and monitor these connections if the count is high|No Dimensions|
|DWULimit|No|DWU limit|Count|Maximum|Service level objective of the dedicated SQL pool|No Dimensions|
|DWUUsed|No|DWU used|Count|Maximum|Represents a high-level representation of usage across the dedicated SQL pool. Measured by DWU limit * DWU percentage|No Dimensions|
|DWUUsedPercent|No|DWU used percentage|Percent|Maximum|Represents a high-level representation of usage across the dedicated SQL pool. Measured by taking the maximum between CPU percentage and Data IO percentage|No Dimensions|
|LocalTempDBUsedPercent|No|Local tempdb used percentage|Percent|Maximum|Local tempdb utilization across all compute nodes - values are emitted every five minute|No Dimensions|
|MemoryUsedPercent|No|Memory used percentage|Percent|Maximum|Memory utilization across all nodes in the dedicated SQL pool|No Dimensions|
|wlg_effective_min_resource_percent|Yes|Effective min resource percent|Percent|Minimum|The effective min resource percentage setting allowed considering the service level and the workload group settings. The effective min_percentage_resource can be adjusted higher on lower service levels|IsUserDefined, WorkloadGroup|
|WLGActiveQueries|No|Workload group active queries|Count|Total|The active queries within the workload group. Using this metric unfiltered and unsplit displays all active queries running on the system|IsUserDefined, WorkloadGroup|
|WLGActiveQueriesTimeouts|No|Workload group query timeouts|Count|Total|Queries for the workload group that have timed out. Query timeouts reported by this metric are only once the query has started executing (it does not include wait time due to locking or resource waits)|IsUserDefined, WorkloadGroup|
|WLGAllocationByMaxResourcePercent|No|Workload group allocation by max resource percent|Percent|Maximum|Displays the percentage allocation of resources relative to the Effective cap resource percent per workload group. This metric provides the effective utilization of the workload group|IsUserDefined, WorkloadGroup|
|WLGAllocationBySystemPercent|No|Workload group allocation by system percent|Percent|Maximum|The percentage allocation of resources relative to the entire system|IsUserDefined, WorkloadGroup|
|WLGEffectiveCapResourcePercent|Yes|Effective cap resource percent|Percent|Maximum|The effective cap resource percent for the workload group. If there are other workload groups with min_percentage_resource > 0, the effective_cap_percentage_resource is lowered proportionally|IsUserDefined, WorkloadGroup|
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
|ActiveRequests|Yes|Active Requests|Count|Total|Active Requests|Instance|
|AverageResponseTime|Yes|Average Response Time|Seconds|Average|Average Response Time|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|Data Out|Instance|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|DiskQueueLength|Yes|Disk Queue Length|Count|Average|Disk Queue Length|Instance|
|Http101|Yes|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Yes|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Yes|Http 401|Count|Total|Http 401|Instance|
|Http403|Yes|Http 403|Count|Total|Http 403|Instance|
|Http404|Yes|Http 404|Count|Total|Http 404|Instance|
|Http406|Yes|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|Http Server Errors|Instance|
|HttpQueueLength|Yes|Http Queue Length|Count|Average|Http Queue Length|Instance|
|LargeAppServicePlanInstances|Yes|Large App Service Plan Workers|Count|Average|Large App Service Plan Workers|No Dimensions|
|MediumAppServicePlanInstances|Yes|Medium App Service Plan Workers|Count|Average|Medium App Service Plan Workers|No Dimensions|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|Memory Percentage|Instance|
|Requests|Yes|Requests|Count|Total|Requests|Instance|
|SmallAppServicePlanInstances|Yes|Small App Service Plan Workers|Count|Average|Small App Service Plan Workers|No Dimensions|
|TotalFrontEnds|Yes|Total Front Ends|Count|Average|Total Front Ends|No Dimensions|


## Microsoft.Web/hostingEnvironments/workerPools

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|Memory Percentage|Instance|
|WorkersAvailable|Yes|Available Workers|Count|Average|Available Workers|No Dimensions|
|WorkersTotal|Yes|Total Workers|Count|Average|Total Workers|No Dimensions|
|WorkersUsed|Yes|Used Workers|Count|Average|Used Workers|No Dimensions|


## Microsoft.Web/serverfarms

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|BytesReceived|Yes|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|Data Out|Instance|
|CpuPercentage|Yes|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|DiskQueueLength|Yes|Disk Queue Length|Count|Average|Disk Queue Length|Instance|
|HttpQueueLength|Yes|Http Queue Length|Count|Average|Http Queue Length|Instance|
|MemoryPercentage|Yes|Memory Percentage|Percent|Average|Memory Percentage|Instance|
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

## Microsoft.Web/sites (excluding functions) 

> [!NOTE]
> **File System Usage** is a new metric being rolled out globally, no data is expected unless you have been whitelisted for private preview.

> [!IMPORTANT]
> **Average Response Time** will be deprecated to avoid confusion with metric aggregations. Use **Response Time** as a replacement.

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections|Yes|Connections|Count|Average|Connections|Instance|
|AverageMemoryWorkingSet|Yes|Average memory working set|Bytes|Average|Average memory working set|Instance|
|AverageResponseTime|Yes|Average Response Time **(deprecated)**|Seconds|Average|Average Response Time|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|Data Out|Instance|
|CpuTime|Yes|CPU Time|Seconds|Total|CPU Time|Instance|
|CurrentAssemblies|Yes|Current Assemblies|Count|Average|Current Assemblies|Instance|
|FileSystemUsage|Yes|File System Usage|Bytes|Average|File System Usage|No Dimensions|
|Gen0Collections|Yes|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Yes|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Yes|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|Handles|Yes|Handle Count|Count|Average|Handle Count|Instance|
|HealthCheckStatus|Yes|Health check status|Count|Average|Health check status|Instance|
|Http101|Yes|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Yes|Http 401|Count|Total|Http 401|Instance|
|Http403|Yes|Http 403|Count|Total|Http 403|Instance|
|Http404|Yes|Http 404|Count|Total|Http 404|Instance|
|Http406|Yes|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|Http Server Errors|Instance|
|HttpResponseTime|Yes|Response Time|Seconds|Average|Response Time|Instance|
|IoOtherBytesPerSecond|Yes|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoOtherOperationsPerSecond|Yes|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|IoReadBytesPerSecond|Yes|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoReadOperationsPerSecond|Yes|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteBytesPerSecond|Yes|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoWriteOperationsPerSecond|Yes|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|MemoryWorkingSet|Yes|Memory working set|Bytes|Average|Memory working set|Instance|
|PrivateBytes|Yes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|Requests|Yes|Requests|Count|Total|Requests|Instance|
|RequestsInApplicationQueue|Yes|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|Threads|Yes|Thread Count|Count|Average|Thread Count|Instance|
|TotalAppDomains|Yes|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Yes|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|

## Microsoft.Web/sites (functions)

> [!NOTE]
> **File System Usage** is a new metric being rolled out globally, no data is expected unless you have been whitelisted for private preview.

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AverageMemoryWorkingSet|Yes|Average memory working set|Bytes|Average|Average memory working set|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|Data Out|Instance|
|CurrentAssemblies|Yes|Current Assemblies|Count|Average|Current Assemblies|Instance|
|FileSystemUsage|Yes|File System Usage|Bytes|Average|File System Usage|No Dimensions|
|FunctionExecutionCount|Yes|Function Execution Count|Count|Total|Function Execution Count|Instance|
|FunctionExecutionUnits|Yes|Function Execution Units|Count|Total|[Function Execution Units](https://github.com/Azure/Azure-Functions/wiki/Consumption-Plan-Cost-Billing-FAQ#how-can-i-view-graphs-of-execution-count-and-gb-seconds)|Instance|
|Gen0Collections|Yes|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Yes|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Yes|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|HealthCheckStatus|Yes|Health check status|Count|Average|Health check status|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|Http Server Errors|Instance|
|IoOtherBytesPerSecond|Yes|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoOtherOperationsPerSecond|Yes|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|IoReadBytesPerSecond|Yes|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoReadOperationsPerSecond|Yes|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteBytesPerSecond|Yes|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoWriteOperationsPerSecond|Yes|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|MemoryWorkingSet|Yes|Memory working set|Bytes|Average|Memory working set|Instance|
|PrivateBytes|Yes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|RequestsInApplicationQueue|Yes|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|TotalAppDomains|Yes|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Yes|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|

## Microsoft.Web/sites/slots

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AppConnections|Yes|Connections|Count|Average|Connections|Instance|
|AverageMemoryWorkingSet|Yes|Average memory working set|Bytes|Average|Average memory working set|Instance|
|AverageResponseTime|Yes|Average Response Time|Seconds|Average|Average Response Time|Instance|
|BytesReceived|Yes|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Yes|Data Out|Bytes|Total|Data Out|Instance|
|CpuTime|Yes|CPU Time|Seconds|Total|CPU Time|Instance|
|CurrentAssemblies|Yes|Current Assemblies|Count|Average|Current Assemblies|Instance|
|FileSystemUsage|Yes|File System Usage|Bytes|Average|File System Usage|No Dimensions|
|FunctionExecutionCount|Yes|Function Execution Count|Count|Total|Function Execution Count|Instance|
|FunctionExecutionUnits|Yes|Function Execution Units|Count|Total|Function Execution Units|Instance|
|Gen0Collections|Yes|Gen 0 Garbage Collections|Count|Total|Gen 0 Garbage Collections|Instance|
|Gen1Collections|Yes|Gen 1 Garbage Collections|Count|Total|Gen 1 Garbage Collections|Instance|
|Gen2Collections|Yes|Gen 2 Garbage Collections|Count|Total|Gen 2 Garbage Collections|Instance|
|Handles|Yes|Handle Count|Count|Average|Handle Count|Instance|
|HealthCheckStatus|Yes|Health check status|Count|Average|Health check status|Instance|
|Http101|Yes|Http 101|Count|Total|Http 101|Instance|
|Http2xx|Yes|Http 2xx|Count|Total|Http 2xx|Instance|
|Http3xx|Yes|Http 3xx|Count|Total|Http 3xx|Instance|
|Http401|Yes|Http 401|Count|Total|Http 401|Instance|
|Http403|Yes|Http 403|Count|Total|Http 403|Instance|
|Http404|Yes|Http 404|Count|Total|Http 404|Instance|
|Http406|Yes|Http 406|Count|Total|Http 406|Instance|
|Http4xx|Yes|Http 4xx|Count|Total|Http 4xx|Instance|
|Http5xx|Yes|Http Server Errors|Count|Total|Http Server Errors|Instance|
|HttpResponseTime|Yes|Response Time|Seconds|Average|Response Time|Instance|
|IoOtherBytesPerSecond|Yes|IO Other Bytes Per Second|BytesPerSecond|Total|IO Other Bytes Per Second|Instance|
|IoOtherOperationsPerSecond|Yes|IO Other Operations Per Second|BytesPerSecond|Total|IO Other Operations Per Second|Instance|
|IoReadBytesPerSecond|Yes|IO Read Bytes Per Second|BytesPerSecond|Total|IO Read Bytes Per Second|Instance|
|IoReadOperationsPerSecond|Yes|IO Read Operations Per Second|BytesPerSecond|Total|IO Read Operations Per Second|Instance|
|IoWriteBytesPerSecond|Yes|IO Write Bytes Per Second|BytesPerSecond|Total|IO Write Bytes Per Second|Instance|
|IoWriteOperationsPerSecond|Yes|IO Write Operations Per Second|BytesPerSecond|Total|IO Write Operations Per Second|Instance|
|MemoryWorkingSet|Yes|Memory working set|Bytes|Average|Memory working set|Instance|
|PrivateBytes|Yes|Private Bytes|Bytes|Average|Private Bytes|Instance|
|Requests|Yes|Requests|Count|Total|Requests|Instance|
|RequestsInApplicationQueue|Yes|Requests In Application Queue|Count|Average|Requests In Application Queue|Instance|
|Threads|Yes|Thread Count|Count|Average|Thread Count|Instance|
|TotalAppDomains|Yes|Total App Domains|Count|Average|Total App Domains|Instance|
|TotalAppDomainsUnloaded|Yes|Total App Domains Unloaded|Count|Average|Total App Domains Unloaded|Instance|


## Next steps
* [Read about metrics in Azure Monitor](data-platform.md)
* [Create alerts on metrics](alerts-overview.md)
* [Export metrics to storage, Event Hub, or Log Analytics](platform-logs-overview.md)
