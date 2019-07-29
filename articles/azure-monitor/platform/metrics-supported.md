---
title: Azure Monitor supported metrics by resource type
description: List of metrics available for each resource type with Azure Monitor.
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 05/20/2019
ms.author: ancav
ms.subservice: metrics
---
# Supported metrics with Azure Monitor

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. Below is a complete list of all metrics currently available with Azure Monitor's metric pipeline. Other metrics may be available in the portal or using legacy APIs. This list below only includes metrics available using the consolidated Azure Monitor metric pipeline. To query for and access these metrics please use the [2018-01-01 api-version](https://docs.microsoft.com/rest/api/monitor/metricdefinitions)

> [!NOTE]
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.
>
>

## Microsoft.AnalysisServices/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|qpu_metric|QPU|Count|Average|QPU. Range 0-100 for S1, 0-200 for S2 and 0-400 for S4|ServerResourceType|
|memory_metric|Memory|Bytes|Average|Memory. Range 0-25 GB for S1, 0-50 GB for S2 and 0-100 GB for S4|ServerResourceType|
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
|QueryPoolJobQueueLength|Threads: Query pool job queue length|Count|Average|Number of jobs in the queue of the query thread pool.|ServerResourceType|
|ShortParsingBusyThreads|Threads: Short parsing busy threads|Count|Average|Number of busy threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingIdleThreads|Threads: Short parsing idle threads|Count|Average|Number of idle threads in the short parsing thread pool.|ServerResourceType|
|ShortParsingJobQueueLength|Threads: Short parsing job queue length|Count|Average|Number of jobs in the queue of the short parsing thread pool.|ServerResourceType|
|memory_thrashing_metric|Memory Thrashing|Percent|Average|Average memory thrashing.|ServerResourceType|
|mashup_engine_qpu_metric|M Engine QPU|Count|Average|QPU usage by mashup engine processes|ServerResourceType|
|mashup_engine_memory_metric|M Engine Memory|Bytes|Average|Memory usage by mashup engine processes|ServerResourceType|

## Microsoft.ApiManagement/service

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalRequests|Total Gateway Requests|Count|Total|Number of gateway requests|Location, Hostname|
|SuccessfulRequests|Successful Gateway Requests|Count|Total|Number of successful gateway requests|Location, Hostname|
|UnauthorizedRequests|Unauthorized Gateway Requests|Count|Total|Number of unauthorized gateway requests|Location, Hostname|
|FailedRequests|Failed Gateway Requests|Count|Total|Number of failures in gateway requests|Location, Hostname|
|OtherRequests|Other Gateway Requests|Count|Total|Number of other gateway requests|Location, Hostname|
|Duration|Overall Duration of Gateway Requests|Milliseconds|Average|Overall Duration of Gateway Requests in milliseconds|Location, Hostname|
|Capacity|Capacity|Percent|Average|Utilization metric for ApiManagement service|Location|
|EventHubTotalEvents|Total EventHub Events|Count|Total|Number of events sent to EventHub|Location|
|EventHubSuccessfulEvents|Successful EventHub Events|Count|Total|Number of successful EventHub events|Location|
|EventHubTotalFailedEvents|Failed EventHub Events|Count|Total|Number of failed EventHub events|Location|
|EventHubRejectedEvents|Rejected EventHub Events|Count|Total|Number of rejected EventHub events (wrong configuration or unauthorized)|Location|
|EventHubThrottledEvents|Throttled EventHub Events|Count|Total|Number of throttled EventHub events|Location|
|EventHubTimedoutEvents|Timed Out EventHub Events|Count|Total|Number of timed out EventHub events|Location|
|EventHubDroppedEvents|Dropped EventHub Events|Count|Total|Number of events skipped because of queue size limit reached|Location|
|EventHubTotalBytesSent|Size of EventHub Events|Bytes|Total|Total size of EventHub events in bytes|Location|
|Requests|Requests|Count|Total|Gateway requests|Location, BackendResponseCode, LastErrorReason, GatewayResponseCode|

## Microsoft.Automation/automationAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalJob|Total Jobs|Count|Total|The total number of jobs|Runbook, Status|
|TotalUpdateDeploymentRuns|Total Update Deployment Runs|Count|Total|Total software update deployment runs|SoftwareUpdateConfigurationName, Status|
|TotalUpdateDeploymentMachineRuns|Total Update Deployment Machine Runs|Count|Total|Total software update deployment machine runs in a software update deployment run|SoftwareUpdateConfigurationName, Status, TargetComputer, SoftwareUpdateConfigurationRunId|

## Microsoft.Batch/batchAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CoreCount|Dedicated Core Count|Count|Total|Total number of dedicated cores in the batch account|No Dimensions|
|TotalNodeCount|Dedicated Node Count|Count|Total|Total number of dedicated nodes in the batch account|No Dimensions|
|LowPriorityCoreCount|LowPriority Core Count|Count|Total|Total number of low-priority cores in the batch account|No Dimensions|
|TotalLowPriorityNodeCount|Low-Priority Node Count|Count|Total|Total number of low-priority nodes in the batch account|No Dimensions|
|CreatingNodeCount|Creating Node Count|Count|Total|Number of nodes being created|No Dimensions|
|StartingNodeCount|Starting Node Count|Count|Total|Number of nodes starting|No Dimensions|
|WaitingForStartTaskNodeCount|Waiting For Start Task Node Count|Count|Total|Number of nodes waiting for the Start Task to complete|No Dimensions|
|StartTaskFailedNodeCount|Start Task Failed Node Count|Count|Total|Number of nodes where the Start Task has failed|No Dimensions|
|IdleNodeCount|Idle Node Count|Count|Total|Number of idle nodes|No Dimensions|
|OfflineNodeCount|Offline Node Count|Count|Total|Number of offline nodes|No Dimensions|
|RebootingNodeCount|Rebooting Node Count|Count|Total|Number of rebooting nodes|No Dimensions|
|ReimagingNodeCount|Reimaging Node Count|Count|Total|Number of reimaging nodes|No Dimensions|
|RunningNodeCount|Running Node Count|Count|Total|Number of running nodes|No Dimensions|
|LeavingPoolNodeCount|Leaving Pool Node Count|Count|Total|Number of nodes leaving the Pool|No Dimensions|
|UnusableNodeCount|Unusable Node Count|Count|Total|Number of unusable nodes|No Dimensions|
|PreemptedNodeCount|Preempted Node Count|Count|Total|Number of preempted nodes|No Dimensions|
|TaskStartEvent|Task Start Events|Count|Total|Total number of tasks that have started|No Dimensions|
|TaskCompleteEvent|Task Complete Events|Count|Total|Total number of tasks that have completed|No Dimensions|
|TaskFailEvent|Task Fail Events|Count|Total|Total number of tasks that have completed in a failed state|No Dimensions|
|PoolCreateEvent|Pool Create Events|Count|Total|Total number of pools that have been created|No Dimensions|
|PoolResizeStartEvent|Pool Resize Start Events|Count|Total|Total number of pool resizes that have started|No Dimensions|
|PoolResizeCompleteEvent|Pool Resize Complete Events|Count|Total|Total number of pool resizes that have completed|No Dimensions|
|PoolDeleteStartEvent|Pool Delete Start Events|Count|Total|Total number of pool deletes that have started|No Dimensions|
|PoolDeleteCompleteEvent|Pool Delete Complete Events|Count|Total|Total number of pool deletes that have completed|No Dimensions|
|JobDeleteCompleteEvent|Job Delete Complete Events|Count|Total|Total number of jobs that have been successfully deleted.|No Dimensions|
|JobDeleteStartEvent|Job Delete Start Events|Count|Total|Total number of jobs that have been requested to be deleted.|No Dimensions|
|JobDisableCompleteEvent|Job Disable Complete Events|Count|Total|Total number of jobs that have been successfully disabled.|No Dimensions|
|JobDisableStartEvent|Job Disable Start Events|Count|Total|Total number of jobs that have been requested to be disabled.|No Dimensions|
|JobStartEvent|Job Start Events|Count|Total|Total number of jobs that have been successfully started.|No Dimensions|
|JobTerminateCompleteEvent|Job Terminate Complete Events|Count|Total|Total number of jobs that have been successfully terminated.|No Dimensions|
|JobTerminateStartEvent|Job Terminate Start Events|Count|Total|Total number of jobs that have been requested to be terminated.|No Dimensions|

## Microsoft.Cache/redis

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|connectedclients|Connected Clients|Count|Maximum||ShardId|
|totalcommandsprocessed|Total Operations|Count|Total||ShardId|
|cachehits|Cache Hits|Count|Total||ShardId|
|cachemisses|Cache Misses|Count|Total||ShardId|
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
|cacheLatency|Cache Latency Microseconds (Preview)|Count|Average||ShardId, SampleType|
|errors|Errors|Count|Maximum||ShardId, ErrorType|
|connectedclients0|Connected Clients (Shard 0)|Count|Maximum||No Dimensions|
|totalcommandsprocessed0|Total Operations (Shard 0)|Count|Total||No Dimensions|
|cachehits0|Cache Hits (Shard 0)|Count|Total||No Dimensions|
|cachemisses0|Cache Misses (Shard 0)|Count|Total||No Dimensions|
|getcommands0|Gets (Shard 0)|Count|Total||No Dimensions|
|setcommands0|Sets (Shard 0)|Count|Total||No Dimensions|
|operationsPerSecond0|Operations Per Second (Shard 0)|Count|Maximum||No Dimensions|
|evictedkeys0|Evicted Keys (Shard 0)|Count|Total||No Dimensions|
|totalkeys0|Total Keys (Shard 0)|Count|Maximum||No Dimensions|
|expiredkeys0|Expired Keys (Shard 0)|Count|Total||No Dimensions|
|usedmemory0|Used Memory (Shard 0)|Bytes|Maximum||No Dimensions|
|usedmemoryRss0|Used Memory RSS (Shard 0)|Bytes|Maximum||No Dimensions|
|serverLoad0|Server Load (Shard 0)|Percent|Maximum||No Dimensions|
|cacheWrite0|Cache Write (Shard 0)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead0|Cache Read (Shard 0)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime0|CPU (Shard 0)|Percent|Maximum||No Dimensions|
|connectedclients1|Connected Clients (Shard 1)|Count|Maximum||No Dimensions|
|totalcommandsprocessed1|Total Operations (Shard 1)|Count|Total||No Dimensions|
|cachehits1|Cache Hits (Shard 1)|Count|Total||No Dimensions|
|cachemisses1|Cache Misses (Shard 1)|Count|Total||No Dimensions|
|getcommands1|Gets (Shard 1)|Count|Total||No Dimensions|
|setcommands1|Sets (Shard 1)|Count|Total||No Dimensions|
|operationsPerSecond1|Operations Per Second (Shard 1)|Count|Maximum||No Dimensions|
|evictedkeys1|Evicted Keys (Shard 1)|Count|Total||No Dimensions|
|totalkeys1|Total Keys (Shard 1)|Count|Maximum||No Dimensions|
|expiredkeys1|Expired Keys (Shard 1)|Count|Total||No Dimensions|
|usedmemory1|Used Memory (Shard 1)|Bytes|Maximum||No Dimensions|
|usedmemoryRss1|Used Memory RSS (Shard 1)|Bytes|Maximum||No Dimensions|
|serverLoad1|Server Load (Shard 1)|Percent|Maximum||No Dimensions|
|cacheWrite1|Cache Write (Shard 1)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead1|Cache Read (Shard 1)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime1|CPU (Shard 1)|Percent|Maximum||No Dimensions|
|connectedclients2|Connected Clients (Shard 2)|Count|Maximum||No Dimensions|
|totalcommandsprocessed2|Total Operations (Shard 2)|Count|Total||No Dimensions|
|cachehits2|Cache Hits (Shard 2)|Count|Total||No Dimensions|
|cachemisses2|Cache Misses (Shard 2)|Count|Total||No Dimensions|
|getcommands2|Gets (Shard 2)|Count|Total||No Dimensions|
|setcommands2|Sets (Shard 2)|Count|Total||No Dimensions|
|operationsPerSecond2|Operations Per Second (Shard 2)|Count|Maximum||No Dimensions|
|evictedkeys2|Evicted Keys (Shard 2)|Count|Total||No Dimensions|
|totalkeys2|Total Keys (Shard 2)|Count|Maximum||No Dimensions|
|expiredkeys2|Expired Keys (Shard 2)|Count|Total||No Dimensions|
|usedmemory2|Used Memory (Shard 2)|Bytes|Maximum||No Dimensions|
|usedmemoryRss2|Used Memory RSS (Shard 2)|Bytes|Maximum||No Dimensions|
|serverLoad2|Server Load (Shard 2)|Percent|Maximum||No Dimensions|
|cacheWrite2|Cache Write (Shard 2)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead2|Cache Read (Shard 2)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime2|CPU (Shard 2)|Percent|Maximum||No Dimensions|
|connectedclients3|Connected Clients (Shard 3)|Count|Maximum||No Dimensions|
|totalcommandsprocessed3|Total Operations (Shard 3)|Count|Total||No Dimensions|
|cachehits3|Cache Hits (Shard 3)|Count|Total||No Dimensions|
|cachemisses3|Cache Misses (Shard 3)|Count|Total||No Dimensions|
|getcommands3|Gets (Shard 3)|Count|Total||No Dimensions|
|setcommands3|Sets (Shard 3)|Count|Total||No Dimensions|
|operationsPerSecond3|Operations Per Second (Shard 3)|Count|Maximum||No Dimensions|
|evictedkeys3|Evicted Keys (Shard 3)|Count|Total||No Dimensions|
|totalkeys3|Total Keys (Shard 3)|Count|Maximum||No Dimensions|
|expiredkeys3|Expired Keys (Shard 3)|Count|Total||No Dimensions|
|usedmemory3|Used Memory (Shard 3)|Bytes|Maximum||No Dimensions|
|usedmemoryRss3|Used Memory RSS (Shard 3)|Bytes|Maximum||No Dimensions|
|serverLoad3|Server Load (Shard 3)|Percent|Maximum||No Dimensions|
|cacheWrite3|Cache Write (Shard 3)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead3|Cache Read (Shard 3)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime3|CPU (Shard 3)|Percent|Maximum||No Dimensions|
|connectedclients4|Connected Clients (Shard 4)|Count|Maximum||No Dimensions|
|totalcommandsprocessed4|Total Operations (Shard 4)|Count|Total||No Dimensions|
|cachehits4|Cache Hits (Shard 4)|Count|Total||No Dimensions|
|cachemisses4|Cache Misses (Shard 4)|Count|Total||No Dimensions|
|getcommands4|Gets (Shard 4)|Count|Total||No Dimensions|
|setcommands4|Sets (Shard 4)|Count|Total||No Dimensions|
|operationsPerSecond4|Operations Per Second (Shard 4)|Count|Maximum||No Dimensions|
|evictedkeys4|Evicted Keys (Shard 4)|Count|Total||No Dimensions|
|totalkeys4|Total Keys (Shard 4)|Count|Maximum||No Dimensions|
|expiredkeys4|Expired Keys (Shard 4)|Count|Total||No Dimensions|
|usedmemory4|Used Memory (Shard 4)|Bytes|Maximum||No Dimensions|
|usedmemoryRss4|Used Memory RSS (Shard 4)|Bytes|Maximum||No Dimensions|
|serverLoad4|Server Load (Shard 4)|Percent|Maximum||No Dimensions|
|cacheWrite4|Cache Write (Shard 4)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead4|Cache Read (Shard 4)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime4|CPU (Shard 4)|Percent|Maximum||No Dimensions|
|connectedclients5|Connected Clients (Shard 5)|Count|Maximum||No Dimensions|
|totalcommandsprocessed5|Total Operations (Shard 5)|Count|Total||No Dimensions|
|cachehits5|Cache Hits (Shard 5)|Count|Total||No Dimensions|
|cachemisses5|Cache Misses (Shard 5)|Count|Total||No Dimensions|
|getcommands5|Gets (Shard 5)|Count|Total||No Dimensions|
|setcommands5|Sets (Shard 5)|Count|Total||No Dimensions|
|operationsPerSecond5|Operations Per Second (Shard 5)|Count|Maximum||No Dimensions|
|evictedkeys5|Evicted Keys (Shard 5)|Count|Total||No Dimensions|
|totalkeys5|Total Keys (Shard 5)|Count|Maximum||No Dimensions|
|expiredkeys5|Expired Keys (Shard 5)|Count|Total||No Dimensions|
|usedmemory5|Used Memory (Shard 5)|Bytes|Maximum||No Dimensions|
|usedmemoryRss5|Used Memory RSS (Shard 5)|Bytes|Maximum||No Dimensions|
|serverLoad5|Server Load (Shard 5)|Percent|Maximum||No Dimensions|
|cacheWrite5|Cache Write (Shard 5)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead5|Cache Read (Shard 5)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime5|CPU (Shard 5)|Percent|Maximum||No Dimensions|
|connectedclients6|Connected Clients (Shard 6)|Count|Maximum||No Dimensions|
|totalcommandsprocessed6|Total Operations (Shard 6)|Count|Total||No Dimensions|
|cachehits6|Cache Hits (Shard 6)|Count|Total||No Dimensions|
|cachemisses6|Cache Misses (Shard 6)|Count|Total||No Dimensions|
|getcommands6|Gets (Shard 6)|Count|Total||No Dimensions|
|setcommands6|Sets (Shard 6)|Count|Total||No Dimensions|
|operationsPerSecond6|Operations Per Second (Shard 6)|Count|Maximum||No Dimensions|
|evictedkeys6|Evicted Keys (Shard 6)|Count|Total||No Dimensions|
|totalkeys6|Total Keys (Shard 6)|Count|Maximum||No Dimensions|
|expiredkeys6|Expired Keys (Shard 6)|Count|Total||No Dimensions|
|usedmemory6|Used Memory (Shard 6)|Bytes|Maximum||No Dimensions|
|usedmemoryRss6|Used Memory RSS (Shard 6)|Bytes|Maximum||No Dimensions|
|serverLoad6|Server Load (Shard 6)|Percent|Maximum||No Dimensions|
|cacheWrite6|Cache Write (Shard 6)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead6|Cache Read (Shard 6)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime6|CPU (Shard 6)|Percent|Maximum||No Dimensions|
|connectedclients7|Connected Clients (Shard 7)|Count|Maximum||No Dimensions|
|totalcommandsprocessed7|Total Operations (Shard 7)|Count|Total||No Dimensions|
|cachehits7|Cache Hits (Shard 7)|Count|Total||No Dimensions|
|cachemisses7|Cache Misses (Shard 7)|Count|Total||No Dimensions|
|getcommands7|Gets (Shard 7)|Count|Total||No Dimensions|
|setcommands7|Sets (Shard 7)|Count|Total||No Dimensions|
|operationsPerSecond7|Operations Per Second (Shard 7)|Count|Maximum||No Dimensions|
|evictedkeys7|Evicted Keys (Shard 7)|Count|Total||No Dimensions|
|totalkeys7|Total Keys (Shard 7)|Count|Maximum||No Dimensions|
|expiredkeys7|Expired Keys (Shard 7)|Count|Total||No Dimensions|
|usedmemory7|Used Memory (Shard 7)|Bytes|Maximum||No Dimensions|
|usedmemoryRss7|Used Memory RSS (Shard 7)|Bytes|Maximum||No Dimensions|
|serverLoad7|Server Load (Shard 7)|Percent|Maximum||No Dimensions|
|cacheWrite7|Cache Write (Shard 7)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead7|Cache Read (Shard 7)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime7|CPU (Shard 7)|Percent|Maximum||No Dimensions|
|connectedclients8|Connected Clients (Shard 8)|Count|Maximum||No Dimensions|
|totalcommandsprocessed8|Total Operations (Shard 8)|Count|Total||No Dimensions|
|cachehits8|Cache Hits (Shard 8)|Count|Total||No Dimensions|
|cachemisses8|Cache Misses (Shard 8)|Count|Total||No Dimensions|
|getcommands8|Gets (Shard 8)|Count|Total||No Dimensions|
|setcommands8|Sets (Shard 8)|Count|Total||No Dimensions|
|operationsPerSecond8|Operations Per Second (Shard 8)|Count|Maximum||No Dimensions|
|evictedkeys8|Evicted Keys (Shard 8)|Count|Total||No Dimensions|
|totalkeys8|Total Keys (Shard 8)|Count|Maximum||No Dimensions|
|expiredkeys8|Expired Keys (Shard 8)|Count|Total||No Dimensions|
|usedmemory8|Used Memory (Shard 8)|Bytes|Maximum||No Dimensions|
|usedmemoryRss8|Used Memory RSS (Shard 8)|Bytes|Maximum||No Dimensions|
|serverLoad8|Server Load (Shard 8)|Percent|Maximum||No Dimensions|
|cacheWrite8|Cache Write (Shard 8)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead8|Cache Read (Shard 8)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime8|CPU (Shard 8)|Percent|Maximum||No Dimensions|
|connectedclients9|Connected Clients (Shard 9)|Count|Maximum||No Dimensions|
|totalcommandsprocessed9|Total Operations (Shard 9)|Count|Total||No Dimensions|
|cachehits9|Cache Hits (Shard 9)|Count|Total||No Dimensions|
|cachemisses9|Cache Misses (Shard 9)|Count|Total||No Dimensions|
|getcommands9|Gets (Shard 9)|Count|Total||No Dimensions|
|setcommands9|Sets (Shard 9)|Count|Total||No Dimensions|
|operationsPerSecond9|Operations Per Second (Shard 9)|Count|Maximum||No Dimensions|
|evictedkeys9|Evicted Keys (Shard 9)|Count|Total||No Dimensions|
|totalkeys9|Total Keys (Shard 9)|Count|Maximum||No Dimensions|
|expiredkeys9|Expired Keys (Shard 9)|Count|Total||No Dimensions|
|usedmemory9|Used Memory (Shard 9)|Bytes|Maximum||No Dimensions|
|usedmemoryRss9|Used Memory RSS (Shard 9)|Bytes|Maximum||No Dimensions|
|serverLoad9|Server Load (Shard 9)|Percent|Maximum||No Dimensions|
|cacheWrite9|Cache Write (Shard 9)|BytesPerSecond|Maximum||No Dimensions|
|cacheRead9|Cache Read (Shard 9)|BytesPerSecond|Maximum||No Dimensions|
|percentProcessorTime9|CPU (Shard 9)|Percent|Maximum||No Dimensions|

## Microsoft.ClassicCompute/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s).|No Dimensions|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic).|No Dimensions|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic).|No Dimensions|
|Disk Read Bytes/Sec|Disk Read|BytesPerSecond|Average|Average bytes read from disk during monitoring period.|No Dimensions|
|Disk Write Bytes/Sec|Disk Write|BytesPerSecond|Average|Average bytes written to disk during monitoring period.|No Dimensions|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS.|No Dimensions|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS.|No Dimensions|

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

## Microsoft.CognitiveServices/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalCalls|Total Calls|Count|Total|Total number of calls.|ApiName, OperationName, Region|
|SuccessfulCalls|Successful Calls|Count|Total|Number of successful calls.|ApiName, OperationName, Region|
|TotalErrors|Total Errors|Count|Total|Total number of calls with error response (HTTP response code 4xx or 5xx).|ApiName, OperationName, Region|
|BlockedCalls|Blocked Calls|Count|Total|Number of calls that exceeded rate or quota limit.|ApiName, OperationName, Region|
|ServerErrors|Server Errors|Count|Total|Number of calls with service internal error (HTTP response code 5xx).|ApiName, OperationName, Region|
|ClientErrors|Client Errors|Count|Total|Number of calls with client side error (HTTP response code 4xx).|ApiName, OperationName, Region|
|DataIn|Data In|Bytes|Total|Size of incoming data in bytes.|ApiName, OperationName, Region|
|DataOut|Data Out|Bytes|Total|Size of outgoing data in bytes.|ApiName, OperationName, Region|
|Latency|Latency|MilliSeconds|Average|Latency in milliseconds.|ApiName, OperationName, Region|
|CharactersTranslated|Characters Translated|Count|Total|Total number of characters in incoming text request.|ApiName, OperationName, Region|
|CharactersTrained|Characters Trained|Count|Total|Total number of characters trained.|ApiName, OperationName, Region|
|SpeechSessionDuration|Speech Session Duration|Seconds|Total|Total duration of speech session in seconds.|ApiName, OperationName, Region|
|TotalTransactions|Total Transactions|Count|Total|Total number of transactions.|No Dimensions|
|TotalTokenCalls|Total Token Calls|Count|Total|Total number of token calls.|ApiName, OperationName, Region|

## Microsoft.Compute/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|No Dimensions|
|Network In|Network In Billable|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|No Dimensions|
|Network Out|Network Out Billable|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|No Dimensions|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|No Dimensions|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|No Dimensions|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|No Dimensions|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|No Dimensions|
|CPU Credits Remaining|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|CPU Credits Consumed|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|No Dimensions|
|Per Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Data Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Data Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Per Disk QD|Data Disk QD (Deprecated)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|OS Per Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Read Operations/Sec|OS Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Operations/Sec|OS Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk QD|OS Disk QD (Deprecated)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|Data Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN|
|Data Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN|
|Data Disk Read Operations/Sec|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN|
|Data Disk Write Operations/Sec|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN|
|Data Disk Queue Depth|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN|
|OS Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Read Operations/Sec|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Write Operations/Sec|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Disk Queue Depth|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|Inbound Flows|Inbound Flows (Preview)|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|No Dimensions|
|Outbound Flows|Outbound Flows (Preview)|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|No Dimensions|
|Inbound Flows Maximum Creation Rate|Inbound Flows Maximum Creation Rate (Preview)|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|No Dimensions|
|Outbound Flows Maximum Creation Rate|Outbound Flows Maximum Creation Rate (Preview)|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|No Dimensions|
|Premium Data Disk Cache Read Hit|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN|
|Premium Data Disk Cache Read Miss|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN|
|Premium OS Disk Cache Read Hit|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|No Dimensions|
|Premium OS Disk Cache Read Miss|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|No Dimensions|
|Network In Total|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|No Dimensions|
|Network Out Total|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|No Dimensions|

## Microsoft.Compute/virtualMachineScaleSets

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|VMName|
|Network In|Network In Billable|Bytes|Total|The number of billable bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|VMName|
|Network Out|Network Out Billable|Bytes|Total|The number of billable bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|VMName|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Bytes read from disk during monitoring period|VMName|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Bytes written to disk during monitoring period|VMName|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|VMName|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|VMName|
|CPU Credits Remaining|CPU Credits Remaining|Count|Average|Total number of credits available to burst|No Dimensions|
|CPU Credits Consumed|CPU Credits Consumed|Count|Average|Total number of credits consumed by the Virtual Machine|No Dimensions|
|Per Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|SlotId|
|Per Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|SlotId|
|Per Disk Read Operations/Sec|Data Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|SlotId|
|Per Disk Write Operations/Sec|Data Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|SlotId|
|Per Disk QD|Data Disk QD (Deprecated)|Count|Average|Data Disk Queue Depth(or Queue Length)|SlotId|
|OS Per Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Deprecated)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Read Operations/Sec|OS Disk Read Operations/Sec (Deprecated)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk Write Operations/Sec|OS Disk Write Operations/Sec (Deprecated)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|No Dimensions|
|OS Per Disk QD|OS Disk QD (Deprecated)|Count|Average|OS Disk Queue Depth(or Queue Length)|No Dimensions|
|Data Disk Read Bytes/sec|Data Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period|LUN, VMName|
|Data Disk Write Bytes/sec|Data Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period|LUN, VMName|
|Data Disk Read Operations/Sec|Data Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period|LUN, VMName|
|Data Disk Write Operations/Sec|Data Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period|LUN, VMName|
|Data Disk Queue Depth|Data Disk Queue Depth (Preview)|Count|Average|Data Disk Queue Depth(or Queue Length)|LUN, VMName|
|OS Disk Read Bytes/sec|OS Disk Read Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec read from a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Bytes/sec|OS Disk Write Bytes/Sec (Preview)|CountPerSecond|Average|Bytes/Sec written to a single disk during monitoring period for OS disk|VMName|
|OS Disk Read Operations/Sec|OS Disk Read Operations/Sec (Preview)|CountPerSecond|Average|Read IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Write Operations/Sec|OS Disk Write Operations/Sec (Preview)|CountPerSecond|Average|Write IOPS from a single disk during monitoring period for OS disk|VMName|
|OS Disk Queue Depth|OS Disk Queue Depth (Preview)|Count|Average|OS Disk Queue Depth(or Queue Length)|VMName|
|Inbound Flows|Inbound Flows (Preview)|Count|Average|Inbound Flows are number of current flows in the inbound direction (traffic going into the VM)|VMName|
|Outbound Flows|Outbound Flows (Preview)|Count|Average|Outbound Flows are number of current flows in the outbound direction (traffic going out of the VM)|VMName|
|Inbound Flows Maximum Creation Rate|Inbound Flows Maximum Creation Rate (Preview)|CountPerSecond|Average|The maximum creation rate of inbound flows (traffic going into the VM)|VMName|
|Outbound Flows Maximum Creation Rate|Outbound Flows Maximum Creation Rate (Preview)|CountPerSecond|Average|The maximum creation rate of outbound flows (traffic going out of the VM)|VMName|
|Premium Data Disk Cache Read Hit|Premium Data Disk Cache Read Hit (Preview)|Percent|Average|Premium Data Disk Cache Read Hit|LUN, VMName|
|Premium Data Disk Cache Read Miss|Premium Data Disk Cache Read Miss (Preview)|Percent|Average|Premium Data Disk Cache Read Miss|LUN, VMName|
|Premium OS Disk Cache Read Hit|Premium OS Disk Cache Read Hit (Preview)|Percent|Average|Premium OS Disk Cache Read Hit|VMName|
|Premium OS Disk Cache Read Miss|Premium OS Disk Cache Read Miss (Preview)|Percent|Average|Premium OS Disk Cache Read Miss|VMName|
|Network In Total|Network In Total|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|VMName|
|Network Out Total|Network Out Total|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|VMName|

## Microsoft.ContainerInstance/containerGroups

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuUsage|CPU Usage|Count|Average|CPU usage on all cores in millicores.|containerName|
|MemoryUsage|Memory Usage|Bytes|Average|Total memory usage in byte.|containerName|
|NetworkBytesReceivedPerSecond|Network Bytes Received Per Second|Bytes|Average|The network bytes received per second.|No Dimensions|
|NetworkBytesTransmittedPerSecond|Network Bytes Transmitted Per Second|Bytes|Average|The network bytes transmitted per second.|No Dimensions|

## Microsoft.ContainerRegistry/registries

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalPullCount|Total Pull Count|Count|Average|Number of image pulls in total|No Dimensions|
|SuccessfulPullCount|Successful Pull Count|Count|Average|Number of successful image pulls|No Dimensions|
|TotalPushCount|Total Push Count|Count|Average|Number of image pushes in total|No Dimensions|
|SuccessfulPushCount|Successful Push Count|Count|Average|Number of successful image pushes|No Dimensions|
|RunDuration|Run Duration|Milliseconds|Total|Run Duration in milliseconds|No Dimensions|

## Microsoft.ContainerService/managedClusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|kube_node_status_allocatable_cpu_cores|Total number of available cpu cores in a managed cluster|Count|Total|Total number of available cpu cores in a managed cluster|No Dimensions|
|kube_node_status_allocatable_memory_bytes|Total amount of available memory in a managed cluster|Bytes|Total|Total amount of available memory in a managed cluster|No Dimensions|
|kube_pod_status_ready|Number of pods in Ready state|Count|Total|Number of pods in Ready state|namespace, pod|
|kube_node_status_condition|Statuses for various node conditions|Count|Total|Statuses for various node conditions|condition, status, status2, node|
|kube_pod_status_phase|Number of pods by phase|Count|Total|Number of pods by phase|phase, namespace, pod|

## Microsoft.CustomerInsights/hubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|DCIApiCalls|Customer Insights API Calls|Count|Total||No Dimensions|
|DCIMappingImportOperationSuccessfulLines|Mapping Import Operation Successful Lines|Count|Total||No Dimensions|
|DCIMappingImportOperationFailedLines|Mapping Import Operation Failed Lines|Count|Total||No Dimensions|
|DCIMappingImportOperationTotalLines|Mapping Import Operation Total Lines|Count|Total||No Dimensions|
|DCIMappingImportOperationRuntimeInSeconds|Mapping Import Operation Runtime In Seconds|Seconds|Total||No Dimensions|
|DCIOutboundProfileExportSucceeded|Outbound Profile Export Succeeded|Count|Total||No Dimensions|
|DCIOutboundProfileExportFailed|Outbound Profile Export Failed|Count|Total||No Dimensions|
|DCIOutboundProfileExportDuration|Outbound Profile Export Duration|Seconds|Total||No Dimensions|
|DCIOutboundKpiExportSucceeded|Outbound Kpi Export Succeeded|Count|Total||No Dimensions|
|DCIOutboundKpiExportFailed|Outbound Kpi Export Failed|Count|Total||No Dimensions|
|DCIOutboundKpiExportDuration|Outbound Kpi Export Duration|Seconds|Total||No Dimensions|
|DCIOutboundKpiExportStarted|Outbound Kpi Export Started|Seconds|Total||No Dimensions|
|DCIOutboundKpiRecordCount|Outbound Kpi Record Count|Seconds|Total||No Dimensions|
|DCIOutboundProfileExportCount|Outbound Profile Export Count|Seconds|Total||No Dimensions|
|DCIOutboundInitialProfileExportFailed|Outbound Initial Profile Export Failed|Seconds|Total||No Dimensions|
|DCIOutboundInitialProfileExportSucceeded|Outbound Initial Profile Export Succeeded|Seconds|Total||No Dimensions|
|DCIOutboundInitialKpiExportFailed|Outbound Initial Kpi Export Failed|Seconds|Total||No Dimensions|
|DCIOutboundInitialKpiExportSucceeded|Outbound Initial Kpi Export Succeeded|Seconds|Total||No Dimensions|
|DCIOutboundInitialProfileExportDurationInSeconds|Outbound Initial Profile Export Duration In Seconds|Seconds|Total||No Dimensions|
|AdlaJobForStandardKpiFailed|Adla Job For Standard Kpi Failed In Seconds|Seconds|Total||No Dimensions|
|AdlaJobForStandardKpiTimeOut|Adla Job For Standard Kpi TimeOut In Seconds|Seconds|Total||No Dimensions|
|AdlaJobForStandardKpiCompleted|Adla Job For Standard Kpi Completed In Seconds|Seconds|Total||No Dimensions|
|ImportASAValuesFailed|Import ASA Values Failed Count|Count|Total||No Dimensions|
|ImportASAValuesSucceeded|Import ASA Values Succeeded Count|Count|Total||No Dimensions|
|DCIProfilesCount|Profile Instance Count|Count|Last||No Dimensions|
|DCIInteractionsPerMonthCount|Interactions per Month Count|Count|Last||No Dimensions|
|DCIKpisCount|KPI Count|Count|Last||No Dimensions|
|DCISegmentsCount|Segment Count|Count|Last||No Dimensions|
|DCIPredictiveMatchPoliciesCount|Predictive Match Count|Count|Last||No Dimensions|
|DCIPredictionsCount|Prediction Count|Count|Last||No Dimensions|

## Microsoft.DataBoxEdge/dataBoxEdgeDevices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|NICReadThroughput|Read Throughput (Network)|BytesPerSecond|Average|The read throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|NICWriteThroughput|Write Throughput (Network)|BytesPerSecond|Average|The write throughput of the network interface on the device in the reporting period for all volumes in the gateway.|InstanceName|
|CloudReadThroughputPerShare|Cloud Download Throughput (Share)|BytesPerSecond|Average|The download throughput to Azure from a share during the reporting period.|Share|
|CloudUploadThroughputPerShare|Cloud Upload Throughput (Share)|BytesPerSecond|Average|The upload throughput to Azure from a share during the reporting period.|Share|
|BytesUploadedToCloudPerShare|Cloud Bytes Uploaded (Share)|Bytes|Average|The total number of bytes that is uploaded to Azure from a share during the reporting period.|Share|
|TotalCapacity|Total Capacity|Bytes|Average|Total Capacity|No Dimensions|
|AvailableCapacity|Available Capacity|Bytes|Average|The available capacity in bytes during the reporting period.|No Dimensions|
|CloudUploadThroughput|Cloud Upload Throughput|BytesPerSecond|Average|The cloud upload throughput  to Azure during the reporting period.|No Dimensions|
|CloudReadThroughput|Cloud Download Throughput|BytesPerSecond|Average|The cloud download throughput to Azure during the reporting period.|No Dimensions|
|BytesUploadedToCloud|Cloud Bytes Uploaded (Device)|Bytes|Average|The total number of bytes that is uploaded to Azure from a device during the reporting period.|No Dimensions|
|HyperVVirtualProcessorUtilization|Edge Compute - Percentage CPU|Percent|Average|Percent CPU Usage|InstanceName|
|HyperVMemoryUtilization|Edge Compute - Memory Usage|Percent|Average|Amount of RAM in Use|InstanceName|

## Microsoft.DataFactory/datafactories

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|FailedRuns|Failed Runs|Count|Total||pipelineName, activityName|
|SuccessfulRuns|Successful Runs|Count|Total||pipelineName, activityName|

## Microsoft.DataFactory/factories

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PipelineFailedRuns|Failed pipeline runs metrics|Count|Total||FailureType, Name|
|PipelineSucceededRuns|Succeeded pipeline runs metrics|Count|Total||FailureType, Name|
|ActivityFailedRuns|Failed activity runs metrics|Count|Total||ActivityType, PipelineName, FailureType, Name|
|ActivitySucceededRuns|Succeeded activity runs metrics|Count|Total||ActivityType, PipelineName, FailureType, Name|
|TriggerFailedRuns|Failed trigger runs metrics|Count|Total||Name, FailureType|
|TriggerSucceededRuns|Succeeded trigger runs metrics|Count|Total||Name, FailureType|
|IntegrationRuntimeCpuPercentage|Integration runtime CPU utilization|Percent|Average||IntegrationRuntimeName, NodeName|
|IntegrationRuntimeAvailableMemory|Integration runtime available memory|Bytes|Average||IntegrationRuntimeName, NodeName|
|MaxAllowedResourceCount|Maximum allowed entities count|Count|Maximum||No Dimensions|
|MaxAllowedFactorySizeInGbUnits|Maximum allowed factory size (GB unit)|Count|Maximum||No Dimensions|
|ResourceCount|Total entities count|Count|Maximum||No Dimensions|
|FactorySizeInGbUnits|Total factory size (GB unit)|Count|Maximum||No Dimensions|

## Microsoft.DataLakeAnalytics/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|JobEndedSuccess|Successful Jobs|Count|Total|Count of successful jobs.|No Dimensions|
|JobEndedFailure|Failed Jobs|Count|Total|Count of failed jobs.|No Dimensions|
|JobEndedCancelled|Canceled Jobs|Count|Total|Count of canceled jobs.|No Dimensions|
|JobAUEndedSuccess|Successful AU Time|Seconds|Total|Total AU time for successful jobs.|No Dimensions|
|JobAUEndedFailure|Failed AU Time|Seconds|Total|Total AU time for failed jobs.|No Dimensions|
|JobAUEndedCancelled|Canceled AU Time|Seconds|Total|Total AU time for canceled jobs.|No Dimensions|

## Microsoft.DataLakeStore/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TotalStorage|Total Storage|Bytes|Maximum|Total amount of data stored in the account.|No Dimensions|
|DataWritten|Data Written|Bytes|Total|Total amount of data written to the account.|No Dimensions|
|DataRead|Data Read|Bytes|Total|Total amount of data read from the account.|No Dimensions|
|WriteRequests|Write Requests|Count|Total|Count of data write requests to the account.|No Dimensions|
|ReadRequests|Read Requests|Count|Total|Count of data read requests to the account.|No Dimensions|

## Microsoft.DBforMariaDB/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|No Dimensions|
|memory_percent|Memory percent|Percent|Average|Memory percent|No Dimensions|
|io_consumption_percent|IO percent|Percent|Average|IO percent|No Dimensions|
|storage_percent|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Storage used|Bytes|Average|Storage used|No Dimensions|
|storage_limit|Storage limit|Bytes|Average|Storage limit|No Dimensions|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|serverlog_storage_limit|Server Log storage limit|Bytes|Average|Server Log storage limit|No Dimensions|
|active_connections|Active Connections|Count|Average|Active Connections|No Dimensions|
|connections_failed|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|seconds_behind_master|Replication lag in seconds|Count|Average|Replication lag in seconds|No Dimensions|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|No Dimensions|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|No Dimensions|

## Microsoft.DBforMySQL/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|No Dimensions|
|memory_percent|Memory percent|Percent|Average|Memory percent|No Dimensions|
|io_consumption_percent|IO percent|Percent|Average|IO percent|No Dimensions|
|storage_percent|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Storage used|Bytes|Average|Storage used|No Dimensions|
|storage_limit|Storage limit|Bytes|Average|Storage limit|No Dimensions|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|serverlog_storage_limit|Server Log storage limit|Bytes|Average|Server Log storage limit|No Dimensions|
|active_connections|Active Connections|Count|Average|Active Connections|No Dimensions|
|connections_failed|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|seconds_behind_master|Replication lag in seconds|Count|Average|Replication lag in seconds|No Dimensions|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|No Dimensions|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|No Dimensions|

## Microsoft.DBforPostgreSQL/servers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|No Dimensions|
|memory_percent|Memory percent|Percent|Average|Memory percent|No Dimensions|
|io_consumption_percent|IO percent|Percent|Average|IO percent|No Dimensions|
|storage_percent|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Storage used|Bytes|Average|Storage used|No Dimensions|
|storage_limit|Storage limit|Bytes|Average|Storage limit|No Dimensions|
|serverlog_storage_percent|Server Log storage percent|Percent|Average|Server Log storage percent|No Dimensions|
|serverlog_storage_usage|Server Log storage used|Bytes|Average|Server Log storage used|No Dimensions|
|serverlog_storage_limit|Server Log storage limit|Bytes|Average|Server Log storage limit|No Dimensions|
|active_connections|Active Connections|Count|Average|Active Connections|No Dimensions|
|connections_failed|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|backup_storage_used|Backup Storage used|Bytes|Average|Backup Storage used|No Dimensions|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|No Dimensions|
|pg_replica_log_delay_in_seconds|Replica Lag|Seconds|Maximum|Replica lag in seconds|No Dimensions|
|pg_replica_log_delay_in_bytes|Max Lag Across Replicas|Bytes|Maximum|Lag in bytes of the most lagging replica|No Dimensions|

## Microsoft.DBforPostgreSQL/serversv2

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percent|Percent|Average|CPU percent|No Dimensions|
|memory_percent|Memory percent|Percent|Average|Memory percent|No Dimensions|
|iops|IOPS|Count|Average|IO Operations per second|No Dimensions|
|storage_percent|Storage percent|Percent|Average|Storage percent|No Dimensions|
|storage_used|Storage used|Bytes|Average|Storage used|No Dimensions|
|active_connections|Active Connections|Count|Average|Active Connections|No Dimensions|
|network_bytes_egress|Network Out|Bytes|Total|Network Out across active connections|No Dimensions|
|network_bytes_ingress|Network In|Bytes|Total|Network In across active connections|No Dimensions|

## Microsoft.Devices/IotHubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|d2c.telemetry.ingress.allProtocol|Telemetry message send attempts|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|No Dimensions|
|d2c.telemetry.ingress.success|Telemetry messages sent|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|No Dimensions|
|c2d.commands.egress.complete.success|Commands completed|Count|Total|Number of cloud-to-device commands completed successfully by the device|No Dimensions|
|c2d.commands.egress.abandon.success|Commands abandoned|Count|Total|Number of cloud-to-device commands abandoned by the device|No Dimensions|
|c2d.commands.egress.reject.success|Commands rejected|Count|Total|Number of cloud-to-device commands rejected by the device|No Dimensions|
|devices.totalDevices|Total devices (deprecated)|Count|Total|Number of devices registered to your IoT hub|No Dimensions|
|devices.connectedDevices.allProtocol|Connected devices (deprecated) |Count|Total|Number of devices connected to your IoT hub|No Dimensions|
|d2c.telemetry.egress.success|Routing: telemetry messages delivered|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|No Dimensions|
|d2c.telemetry.egress.dropped|Routing: telemetry messages dropped |Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|No Dimensions|
|d2c.telemetry.egress.orphaned|Routing: telemetry messages orphaned |Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing rules (including the fallback rule). |No Dimensions|
|d2c.telemetry.egress.invalid|Routing: telemetry messages incompatible|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. This value does not include retries.|No Dimensions|
|d2c.telemetry.egress.fallback|Routing: messages delivered to fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|No Dimensions|
|d2c.endpoints.egress.eventHubs|Routing: messages delivered to Event Hub|Count|Total|The number of times IoT Hub routing successfully delivered messages to Event Hub endpoints.|No Dimensions|
|d2c.endpoints.latency.eventHubs|Routing: message latency for Event Hub|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into an Event Hub endpoint.|No Dimensions|
|d2c.endpoints.egress.serviceBusQueues|Routing: messages delivered to Service Bus Queue|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|No Dimensions|
|d2c.endpoints.latency.serviceBusQueues|Routing: message latency for Service Bus Queue|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus queue endpoint.|No Dimensions|
|d2c.endpoints.egress.serviceBusTopics|Routing: messages delivered to Service Bus Topic|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|No Dimensions|
|d2c.endpoints.latency.serviceBusTopics|Routing: message latency for Service Bus Topic|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a Service Bus topic endpoint.|No Dimensions|
|d2c.endpoints.egress.builtIn.events|Routing: messages delivered to messages/events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events). This metric only starts working when routing is enabled (https://aka.ms/iotrouting) for the IoT hub.|No Dimensions|
|d2c.endpoints.latency.builtIn.events|Routing: message latency for messages/events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into the built-in endpoint (messages/events). This metric only starts working when routing is enabled (https://aka.ms/iotrouting) for the IoT hub.|No Dimensions|
|d2c.endpoints.egress.storage|Routing: messages delivered to storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|No Dimensions|
|d2c.endpoints.latency.storage|Routing: message latency for storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and telemetry message ingress into a storage endpoint.|No Dimensions|
|d2c.endpoints.egress.storage.bytes|Routing: data delivered to storage|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|No Dimensions|
|d2c.endpoints.egress.storage.blobs|Routing: blobs delivered to storage|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|No Dimensions|
|EventGridDeliveries|Event Grid deliveries (preview)|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|Result, EventType|
|EventGridLatency|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|EventType|
|d2c.twin.read.success|Successful twin reads from devices|Count|Total|The count of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.read.failure|Failed twin reads from devices|Count|Total|The count of all failed device-initiated twin reads.|No Dimensions|
|d2c.twin.read.size|Response size of twin reads from devices|Bytes|Average|The average, min, and max of all successful device-initiated twin reads.|No Dimensions|
|d2c.twin.update.success|Successful twin updates from devices|Count|Total|The count of all successful device-initiated twin updates.|No Dimensions|
|d2c.twin.update.failure|Failed twin updates from devices|Count|Total|The count of all failed device-initiated twin updates.|No Dimensions|
|d2c.twin.update.size|Size of twin updates from devices|Bytes|Average|The average, min, and max size of all successful device-initiated twin updates.|No Dimensions|
|c2d.methods.success|Successful direct method invocations|Count|Total|The count of all successful direct method calls.|No Dimensions|
|c2d.methods.failure|Failed direct method invocations|Count|Total|The count of all failed direct method calls.|No Dimensions|
|c2d.methods.requestSize|Request size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method requests.|No Dimensions|
|c2d.methods.responseSize|Response size of direct method invocations|Bytes|Average|The average, min, and max of all successful direct method responses.|No Dimensions|
|c2d.twin.read.success|Successful twin reads from back end|Count|Total|The count of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.failure|Failed twin reads from back end|Count|Total|The count of all failed back-end-initiated twin reads.|No Dimensions|
|c2d.twin.read.size|Response size of twin reads from back end|Bytes|Average|The average, min, and max of all successful back-end-initiated twin reads.|No Dimensions|
|c2d.twin.update.success|Successful twin updates from back end|Count|Total|The count of all successful back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.failure|Failed twin updates from back end|Count|Total|The count of all failed back-end-initiated twin updates.|No Dimensions|
|c2d.twin.update.size|Size of twin updates from back end|Bytes|Average|The average, min, and max size of all successful back-end-initiated twin updates.|No Dimensions|
|twinQueries.success|Successful twin queries|Count|Total|The count of all successful twin queries.|No Dimensions|
|twinQueries.failure|Failed twin queries|Count|Total|The count of all failed twin queries.|No Dimensions|
|twinQueries.resultSize|Twin queries result size|Bytes|Average|The average, min, and max of the result size of all successful twin queries.|No Dimensions|
|jobs.createTwinUpdateJob.success|Successful creations of twin update jobs|Count|Total|The count of all successful creation of twin update jobs.|No Dimensions|
|jobs.createTwinUpdateJob.failure|Failed creations of twin update jobs|Count|Total|The count of all failed creation of twin update jobs.|No Dimensions|
|jobs.createDirectMethodJob.success|Successful creations of method invocation jobs|Count|Total|The count of all successful creation of direct method invocation jobs.|No Dimensions|
|jobs.createDirectMethodJob.failure|Failed creations of method invocation jobs|Count|Total|The count of all failed creation of direct method invocation jobs.|No Dimensions|
|jobs.listJobs.success|Successful calls to list jobs|Count|Total|The count of all successful calls to list jobs.|No Dimensions|
|jobs.listJobs.failure|Failed calls to list jobs|Count|Total|The count of all failed calls to list jobs.|No Dimensions|
|jobs.cancelJob.success|Successful job cancellations|Count|Total|The count of all successful calls to cancel a job.|No Dimensions|
|jobs.cancelJob.failure|Failed job cancellations|Count|Total|The count of all failed calls to cancel a job.|No Dimensions|
|jobs.queryJobs.success|Successful job queries|Count|Total|The count of all successful calls to query jobs.|No Dimensions|
|jobs.queryJobs.failure|Failed job queries|Count|Total|The count of all failed calls to query jobs.|No Dimensions|
|jobs.completed|Completed jobs|Count|Total|The count of all completed jobs.|No Dimensions|
|jobs.failed|Failed jobs|Count|Total|The count of all failed jobs.|No Dimensions|
|d2c.telemetry.ingress.sendThrottle|Number of throttling errors|Count|Total|Number of throttling errors due to device throughput throttles|No Dimensions|
|dailyMessageQuotaUsed|Total number of messages used|Count|Average|Number of total messages used today. This is a cumulative value that is reset to zero at 00:00 UTC every day.|No Dimensions|
|deviceDataUsage|Total device data usage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|No Dimensions|
|totalDeviceCount|Total devices (preview)|Count|Average|Number of devices registered to your IoT hub|No Dimensions|
|connectedDeviceCount|Connected devices (preview)|Count|Average|Number of devices connected to your IoT hub|No Dimensions|
|configurations|Configuration Metrics|Count|Total|Metrics for Configuration Operations|No Dimensions|

## Microsoft.Devices/provisioningServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RegistrationAttempts|Registration attempts|Count|Total|Number of device registrations attempted|ProvisioningServiceName, IotHubName, Status|
|DeviceAssignments|Devices assigned|Count|Total|Number of devices assigned to an IoT hub|ProvisioningServiceName, IotHubName|
|AttestationAttempts|Attestation attempts|Count|Total|Number of device attestations attempted|ProvisioningServiceName, Status, Protocol|

## Microsoft.DocumentDB/databaseAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AvailableStorage|Available Storage|Bytes|Total|Total available storage reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|CassandraConnectionClosures|Cassandra Connection Closures|Count|Total|Number of Cassandra connections that were closed, reported at a 1 minute granularity|Region, ClosureReason|
|CassandraRequestCharges|Cassandra Request Charges|Count|Total|RUs consumed for Cassandra requests made|DatabaseName, CollectionName, Region, OperationType, ResourceType|
|CassandraRequests|Cassandra Requests|Count|Count|Number of Cassandra requests made|DatabaseName, CollectionName, Region, OperationType, ResourceType, ErrorCode|
|DataUsage|Data Usage|Bytes|Total|Total data usage reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|DocumentCount|Document Count|Count|Total|Total document count reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|DocumentQuota|Document Quota|Bytes|Total|Total storage quota reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|IndexUsage|Index Usage|Bytes|Total|Total index usage reported at 5 minutes granularity|CollectionName, DatabaseName, Region|
|MetadataRequests|Metadata Requests|Count|Count|Count of metadata requests. Cosmos DB maintains system metadata collection for each account, that allows you to enumerate collections, databases, etc, and their configurations, free of charge.|DatabaseName, CollectionName, Region, StatusCode, |
|MongoRequestCharge|Mongo Request Charge|Count|Total|Mongo Request Units Consumed|DatabaseName, CollectionName, Region, CommandName, ErrorCode|
|MongoRequests|Mongo Requests|Count|Count|Number of Mongo Requests Made|DatabaseName, CollectionName, Region, CommandName, ErrorCode|
|ProvisionedThroughput|Provisioned Throughput|Count|Maximum|Provisioned Throughput|DatabaseName, CollectionName|
|ReplicationLatency|P99 Replication Latency|MilliSeconds|Average|P99 Replication Latency across source and target regions for geo-enabled account|SourceRegion, TargetRegion|
|ServiceAvailability|Service Availability|Percent|Average|Account requests availability at one hour, day or month granularity|No Dimensions|
|TotalRequestUnits|Total Request Units|Count|Total|Request Units consumed|DatabaseName, CollectionName, Region, StatusCode, OperationType|
|TotalRequests|Total Requests|Count|Count|Number of requests made|DatabaseName, CollectionName, Region, StatusCode, OperationType|

## Microsoft.EventGrid/topics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishFailCount|Publish Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|
|PublishSuccessLatencyInMs|Publish Success Latency|Count|Total|Publish success latency in milliseconds|No Dimensions|

## Microsoft.EventGrid/eventSubscriptions

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|MatchedEventCount|Matched Events|Count|Total|Total events matched to this event subscription|No Dimensions|
|DeliveryAttemptFailCount|Delivery Failed Events|Count|Total|Total events failed to deliver to this event subscription|Error, ErrorType|
|DeliverySuccessCount|Delivered Events|Count|Total|Total events delivered to this event subscription|No Dimensions|
|DestinationProcessingDurationInMs|Destination Processing Duration|Milliseconds|Average|Destination processing duration in milliseconds|No Dimensions|
|DroppedEventCount|Dropped Events|Count|Total|Total dropped events matching to this event subscription|DropReason|
|DeadLetteredCount|Dead Lettered Events|Count|Total|Total dead lettered events matching to this event subscription|DeadLetterReason|

## Microsoft.EventGrid/extensionTopics

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PublishSuccessCount|Published Events|Count|Total|Total events published to this topic|No Dimensions|
|PublishFailCount|Failed Events|Count|Total|Total events failed to publish to this topic|ErrorType, Error|
|UnmatchedEventCount|Unmatched Events|Count|Total|Total events not matching any of the event subscriptions for this topic|No Dimensions|
|PublishSuccessLatencyInMs|Publish Success Latency|Count|Total|Publish success latency in milliseconds|No Dimensions|

## Microsoft.EventHub/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests|Count|Total|Successful Requests for Microsoft.EventHub.|EntityName, |
|ServerErrors|Server Errors.|Count|Total|Server Errors for Microsoft.EventHub.|EntityName, |
|UserErrors|User Errors.|Count|Total|User Errors for Microsoft.EventHub.|EntityName, |
|QuotaExceededErrors|Quota Exceeded Errors.|Count|Total|Quota Exceeded Errors for Microsoft.EventHub.|EntityName, |
|ThrottledRequests|Throttled Requests.|Count|Total|Throttled Requests for Microsoft.EventHub.|EntityName, |
|IncomingRequests|Incoming Requests|Count|Total|Incoming Requests for Microsoft.EventHub.|EntityName|
|IncomingMessages|Incoming Messages|Count|Total|Incoming Messages for Microsoft.EventHub.|EntityName|
|OutgoingMessages|Outgoing Messages|Count|Total|Outgoing Messages for Microsoft.EventHub.|EntityName|
|IncomingBytes|Incoming Bytes.|Bytes|Total|Incoming Bytes for Microsoft.EventHub.|EntityName|
|OutgoingBytes|Outgoing Bytes.|Bytes|Total|Outgoing Bytes for Microsoft.EventHub.|EntityName|
|ActiveConnections|ActiveConnections|Count|Average|Total Active Connections for Microsoft.EventHub.|No Dimensions|
|ConnectionsOpened|Connections Opened.|Count|Average|Connections Opened for Microsoft.EventHub.|EntityName|
|ConnectionsClosed|Connections Closed.|Count|Average|Connections Closed for Microsoft.EventHub.|EntityName|
|CaptureBacklog|Capture Backlog.|Count|Total|Capture Backlog for Microsoft.EventHub.|EntityName|
|CapturedMessages|Captured Messages.|Count|Total|Captured Messages for Microsoft.EventHub.|EntityName|
|CapturedBytes|Captured Bytes.|Bytes|Total|Captured Bytes for Microsoft.EventHub.|EntityName|
|Size|Size|Bytes|Average|Size of an EventHub in Bytes.|EntityName|
|INREQS|Incoming Requests (Deprecated)|Count|Total|Total incoming send requests for a namespace (Deprecated)|No Dimensions|
|SUCCREQ|Successful Requests (Deprecated)|Count|Total|Total successful requests for a namespace (Deprecated)|No Dimensions|
|FAILREQ|Failed Requests (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|No Dimensions|
|SVRBSY|Server Busy Errors (Deprecated)|Count|Total|Total server busy errors for a namespace (Deprecated)|No Dimensions|
|INTERR|Internal Server Errors (Deprecated)|Count|Total|Total internal server errors for a namespace (Deprecated)|No Dimensions|
|MISCERR|Other Errors (Deprecated)|Count|Total|Total failed requests for a namespace (Deprecated)|No Dimensions|
|INMSGS|Incoming Messages (Deprecated) (Deprecated)|Count|Total|Total incoming messages for a namespace. This metric is deprecated. Please use Incoming Messages metric instead (Deprecated)|No Dimensions|
|EHINMSGS|Incoming Messages (Deprecated)|Count|Total|Total incoming messages for a namespace (Deprecated)|No Dimensions|
|OUTMSGS|Outgoing Messages (Deprecated) (Deprecated)|Count|Total|Total outgoing messages for a namespace. This metric is deprecated. Please use Outgoing Messages metric instead (Deprecated)|No Dimensions|
|EHOUTMSGS|Outgoing Messages (Deprecated)|Count|Total|Total outgoing messages for a namespace (Deprecated)|No Dimensions|
|EHINMBS|Incoming bytes (Deprecated) (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace. This metric is deprecated. Please use Incoming bytes metric instead (Deprecated)|No Dimensions|
|EHINBYTES|Incoming bytes (Deprecated)|Bytes|Total|Event Hub incoming message throughput for a namespace (Deprecated)|No Dimensions|
|EHOUTMBS|Outgoing bytes (Deprecated) (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace. This metric is deprecated. Please use Outgoing bytes metric instead (Deprecated)|No Dimensions|
|EHOUTBYTES|Outgoing bytes (Deprecated)|Bytes|Total|Event Hub outgoing message throughput for a namespace (Deprecated)|No Dimensions|
|EHABL|Archive backlog messages (Deprecated)|Count|Total|Event Hub archive messages in backlog for a namespace (Deprecated)|No Dimensions|
|EHAMSGS|Archive messages (Deprecated)|Count|Total|Event Hub archived messages in a namespace (Deprecated)|No Dimensions|
|EHAMBS|Archive message throughput (Deprecated)|Bytes|Total|Event Hub archived message throughput in a namespace (Deprecated)|No Dimensions|

## Microsoft.EventHub/clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests (Preview)|Count|Total|Successful Requests for Microsoft.EventHub. (Preview)|No Dimensions|
|ServerErrors|Server Errors. (Preview)|Count|Total|Server Errors for Microsoft.EventHub. (Preview)|No Dimensions|
|UserErrors|User Errors. (Preview)|Count|Total|User Errors for Microsoft.EventHub. (Preview)|No Dimensions|
|QuotaExceededErrors|Quota Exceeded Errors. (Preview)|Count|Total|Quota Exceeded Errors for Microsoft.EventHub. (Preview)|No Dimensions|
|ThrottledRequests|Throttled Requests. (Preview)|Count|Total|Throttled Requests for Microsoft.EventHub. (Preview)|No Dimensions|
|IncomingRequests|Incoming Requests (Preview)|Count|Total|Incoming Requests for Microsoft.EventHub. (Preview)|No Dimensions|
|IncomingMessages|Incoming Messages (Preview)|Count|Total|Incoming Messages for Microsoft.EventHub. (Preview)|No Dimensions|
|OutgoingMessages|Outgoing Messages (Preview)|Count|Total|Outgoing Messages for Microsoft.EventHub. (Preview)|No Dimensions|
|IncomingBytes|Incoming Bytes. (Preview)|Bytes|Total|Incoming Bytes for Microsoft.EventHub. (Preview)|No Dimensions|
|OutgoingBytes|Outgoing Bytes. (Preview)|Bytes|Total|Outgoing Bytes for Microsoft.EventHub. (Preview)|No Dimensions|
|ActiveConnections|ActiveConnections (Preview)|Count|Average|Total Active Connections for Microsoft.EventHub. (Preview)|No Dimensions|
|ConnectionsOpened|Connections Opened. (Preview)|Count|Average|Connections Opened for Microsoft.EventHub. (Preview)|No Dimensions|
|ConnectionsClosed|Connections Closed. (Preview)|Count|Average|Connections Closed for Microsoft.EventHub. (Preview)|No Dimensions|
|CaptureBacklog|Capture Backlog. (Preview)|Count|Total|Capture Backlog for Microsoft.EventHub. (Preview)|No Dimensions|
|CapturedMessages|Captured Messages. (Preview)|Count|Total|Captured Messages for Microsoft.EventHub. (Preview)|No Dimensions|
|CapturedBytes|Captured Bytes. (Preview)|Bytes|Total|Captured Bytes for Microsoft.EventHub. (Preview)|No Dimensions|
|CPU|CPU (Preview)|Percent|Maximum|CPU utilization for the Event Hub Cluster as a percentage|Role|
|AvailableMemory|Available Memory (Preview)|Count|Maximum|Available memory for the Event Hub Cluster in bytes|Role|

## Microsoft.HDInsight/clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|GatewayRequests|Gateway Requests|Count|Total|Number of gateway requests|ClusterDnsName, HttpStatus|
|CategorizedGatewayRequests|Categorized Gateway Requests|Count|Total|Number of gateway requests by categories (1xx/2xx/3xx/4xx/5xx)|ClusterDnsName, HttpStatus|
|NumActiveWorkers|Number of Active Workers|Count|Maximum|Number of Active Workers|ClusterDnsName, MetricName|

## Microsoft.Insights/AutoscaleSettings

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ObservedMetricValue|Observed Metric Value|Count|Average|The value computed by autoscale when executed|MetricTriggerSource|
|MetricThreshold|Metric Threshold|Count|Average|The configured autoscale threshold when autoscale ran.|MetricTriggerRule|
|ObservedCapacity|Observed Capacity|Count|Average|The capacity reported to autoscale when it executed.|No Dimensions|
|ScaleActionsInitiated|Scale Actions Initiated|Count|Total|The direction of the scale operation.|ScaleDirection|

## Microsoft.Insights/Components

(Public Preview)

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|availabilityResults/availabilityPercentage|Availability|Percent|Average|Percentage of successfully completed availability tests|availabilityResult/name, availabilityResult/location|
|availabilityResults/count|Availability tests|Count|Count|Count of availability tests|availabilityResult/name, availabilityResult/location, availabilityResult/success|
|availabilityResults/duration|Availability test duration|MilliSeconds|Average|Availability test duration|availabilityResult/name, availabilityResult/location, availabilityResult/success|
|browserTimings/networkDuration|Page load network connect time|MilliSeconds|Average|Time between user request and network connection. Includes DNS lookup and transport connection.|No Dimensions|
|browserTimings/processingDuration|Client processing time|MilliSeconds|Average|Time between receiving the last byte of a document until the DOM is loaded. Async requests may still be processing.|No Dimensions|
|browserTimings/receiveDuration|Receiving response time|MilliSeconds|Average|Time between the first and last bytes, or until disconnection.|No Dimensions|
|browserTimings/sendDuration|Send request time|MilliSeconds|Average|Time between network connection and receiving the first byte.|No Dimensions|
|browserTimings/totalDuration|Browser page load time|MilliSeconds|Average|Time from user request until DOM, stylesheets, scripts and images are loaded.|No Dimensions|
|dependencies/count|Dependency calls|Count|Count|Count of calls made by the application to external resources.|dependency/type, dependency/performanceBucket, dependency/success, operation/synthetic, cloud/roleInstance, cloud/roleName|
|dependencies/duration|Dependency duration|MilliSeconds|Average|Duration of calls made by the application to external resources.|dependency/type, dependency/performanceBucket, dependency/success, operation/synthetic, cloud/roleInstance, cloud/roleName|
|dependencies/failed|Dependency call failures|Count|Count|Count of failed dependency calls made by the application to external resources.|dependency/type, dependency/performanceBucket, operation/synthetic, cloud/roleInstance, cloud/roleName|
|pageViews/count|Page views|Count|Count|Count of page views.|operation/synthetic|
|pageViews/duration|Page view load time|MilliSeconds|Average|Page view load time|operation/synthetic|
|performanceCounters/requestExecutionTime|HTTP request execution time|MilliSeconds|Average|Execution time of the most recent request.|cloud/roleInstance|
|performanceCounters/requestsInQueue|HTTP requests in application queue|Count|Average|Length of the application request queue.|cloud/roleInstance|
|performanceCounters/requestsPerSecond|HTTP request rate|CountPerSecond|Average|Rate of all requests to the application per second from ASP.NET.|cloud/roleInstance|
|performanceCounters/exceptionsPerSecond|Exception rate|CountPerSecond|Average|Count of handled and unhandled exceptions reported to windows, including .NET exceptions and unmanaged exceptions that are converted into .NET exceptions.|cloud/roleInstance|
|performanceCounters/processIOBytesPerSecond|Process IO rate|BytesPerSecond|Average|Total bytes per second read and written to files, network and devices.|cloud/roleInstance|
|performanceCounters/processCpuPercentage|Process CPU|Percent|Average|The percentage of elapsed time that all process threads used the processor to execute instructions. This can vary between 0 to 100. This metric indicates the performance of w3wp process alone.|cloud/roleInstance|
|performanceCounters/processorCpuPercentage|Processor time|Percent|Average|The percentage of time that the processor spends in non-idle threads.|cloud/roleInstance|
|performanceCounters/memoryAvailableBytes|Available memory|Bytes|Average|Physical memory immediately available for allocation to a process or for system use.|cloud/roleInstance|
|performanceCounters/processPrivateBytes|Process private bytes|Bytes|Average|Memory exclusively assigned to the monitored application's processes.|cloud/roleInstance|
|requests/duration|Server response time|MilliSeconds|Average|Time between receiving an HTTP request and finishing sending the response.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|requests/count|Server requests|Count|Count|Count of HTTP requests completed.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|requests/failed|Failed requests|Count|Count|Count of HTTP requests marked as failed. In most cases these are requests with a response code >= 400 and not equal to 401.|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, cloud/roleName|
|requests/rate|Server request rate|CountPerSecond|Average|Rate of server requests per second|request/performanceBucket, request/resultCode, operation/synthetic, cloud/roleInstance, request/success, cloud/roleName|
|exceptions/count|Exceptions|Count|Count|Combined count of all uncaught exceptions.|cloud/roleName, cloud/roleInstance, client/type|
|exceptions/browser|Browser exceptions|Count|Count|Count of uncaught exceptions thrown in the browser.|No Dimensions|
|exceptions/server|Server exceptions|Count|Count|Count of uncaught exceptions thrown in the server application.|cloud/roleName, cloud/roleInstance|
|traces/count|Traces|Count|Count|Trace document count|trace/severityLevel, operation/synthetic, cloud/roleName, cloud/roleInstance|

## Microsoft.KeyVault/vaults

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServiceApiHit|Total Service Api Hits|Count|Count|Number of total service api hits|ActivityType, ActivityName|
|ServiceApiLatency|Overall Service Api Latency|Milliseconds|Average|Overall latency of service api requests|ActivityType, ActivityName, StatusCode|
|ServiceApiResult|Total Service Api Results|Count|Count|Number of total service api results|ActivityType, ActivityName, StatusCode|

## Microsoft.Kusto/Clusters

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CacheUtilization|Cache Utilization|Percent|Average|Utilization level in the cluster scope|None|
|QueryDuration|Query Duration|Milliseconds|Average|Queries’ duration in seconds|Query Status|
|IngestionUtilization|Ingestion Utilization|Percent|Average|Ratio of used ingestion slots in the cluster|None|
|KeepAlive|Keep Alive|Count|Average|Sanity check indicates the cluster responds to queries|None|
|IngestionVolumeInMB|Ingestion Volume (In MB)|Count|Total|Overall volume of ingested data to the cluster (in MB)|Database|
|IngestionLatencyInSeconds|Ingestion Latency (In seconds)|Seconds|Average|Ingestion time from the source (e.g. message is in EventHub) to the cluster in seconds|None|
|EventProcessedForEventHubs|Events Processed (for Event Hubs)|Count|Total|Number of events processed by the cluster when ingesting from Event Hub|None|
|IngestionResult|Ingestion Result|Count|Count|Number of ingestion operations|Status|
|CPU|CPU|Percent|Average|CPU utilization level|None|
| ContinuousExportNumOfRecordsExported | Number of records exported in continuous export | Count | Total | Number of records exported for every storage artifact written during the export operation  | None |
| ExportUtilization | Export Utilization | Percent | Maximum | Export utilization | None |
| ContinuousExportPendingCount | Continuous Export Pending Count | Count | Maximum | The number of pending continuous export jobs ready for execution | None |
| ContinuousExportMaxLatenessMinutes | Continuous Export Max Lateness Minutes | Count | Maximum | The max time in minutes of all continuous exports which are pending and ready for execution | None |

## Microsoft.LocationBasedServices/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Usage|Usage|Count|Count|Count of API calls|ApiCategory, ApiName|

## Microsoft.Logic/workflows

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|No Dimensions|
|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|No Dimensions|
|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|No Dimensions|
|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|No Dimensions|
|RunsCancelled|Runs Canceled|Count|Total|Number of workflow runs canceled.|No Dimensions|
|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|No Dimensions|
|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|No Dimensions|
|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|No Dimensions|
|RunFailurePercentage|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|No Dimensions|
|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|No Dimensions|
|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|No Dimensions|
|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|No Dimensions|
|ActionsFailed|Actions Failed|Count|Total|Number of workflow actions failed.|No Dimensions|
|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|No Dimensions|
|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|No Dimensions|
|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|No Dimensions|
|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|No Dimensions|
|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|No Dimensions|
|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|No Dimensions|
|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|No Dimensions|
|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|No Dimensions|
|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|No Dimensions|
|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|No Dimensions|
|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|No Dimensions|
|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|No Dimensions|
|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|No Dimensions|
|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|No Dimensions|
|BillableActionExecutions|Billable Action Executions|Count|Total|Number of workflow action executions getting billed.|No Dimensions|
|BillableTriggerExecutions|Billable Trigger Executions|Count|Total|Number of workflow trigger executions getting billed.|No Dimensions|
|TotalBillableExecutions|Total Billable Executions|Count|Total|Number of workflow executions getting billed.|No Dimensions|
|BillingUsageNativeOperation|Billing Usage for Native Operation Executions|Count|Total|Number of native operation executions getting billed.|No Dimensions|
|BillingUsageStandardConnector|Billing Usage for Standard Connector Executions|Count|Total|Number of standard connector executions getting billed.|No Dimensions|
|BillingUsageStorageConsumption|Billing Usage for Storage Consumption Executions|Count|Total|Number of storage consumption executions getting billed.|No Dimensions|
|BillingUsageNativeOperation|Billing Usage for Native Operation Executions|Count|Total|Number of native operation executions getting billed.|No Dimensions|
|BillingUsageStandardConnector|Billing Usage for Standard Connector Executions|Count|Total|Number of standard connector executions getting billed.|No Dimensions|
|BillingUsageStorageConsumption|Billing Usage for Storage Consumption Executions|Count|Total|Number of storage consumption executions getting billed.|No Dimensions|

## Microsoft.Logic/integrationServiceEnvironments

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|No Dimensions|
|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|No Dimensions|
|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|No Dimensions|
|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|No Dimensions|
|RunsCancelled|Runs Canceled|Count|Total|Number of workflow runs canceled.|No Dimensions|
|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|No Dimensions|
|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|No Dimensions|
|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|No Dimensions|
|RunStartThrottledEvents|Run Start Throttled Events|Count|Total|Number of workflow run start throttled events.|No Dimensions|
|RunFailurePercentage|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|No Dimensions|
|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|No Dimensions|
|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|No Dimensions|
|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|No Dimensions|
|ActionsFailed|Actions Failed |Count|Total|Number of workflow actions failed.|No Dimensions|
|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|No Dimensions|
|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|No Dimensions|
|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|No Dimensions|
|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|No Dimensions|
|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|No Dimensions|
|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|No Dimensions|
|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|No Dimensions|
|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|No Dimensions|
|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|No Dimensions|
|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|No Dimensions|
|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|No Dimensions|
|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|No Dimensions|
|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|No Dimensions|
|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|No Dimensions|
|IntegrationServiceEnvironmentWorkflowProcessorUsage|Workflow Processor Usage for Integration Service Environment|Percent|Average|Workflow processor usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentWorkflowMemoryUsage|Workflow Memory Usage for Integration Service Environment|Percent|Average|Workflow memory usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentConnectorProcessorUsage|Connector Processor Usage for Integration Service Environment|Percent|Average|Connector processor usage for integration service environment.|No Dimensions|
|IntegrationServiceEnvironmentConnectorMemoryUsage|Connector Memory Usage for Integration Service Environment|Percent|Average|Connector memory usage for integration service environment.|No Dimensions|

## Microsoft.MachineLearningServices/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Completed Runs|Completed Runs|Count|Total|Number of runs completed successfully for this workspace|Scenario|
|Started Runs|Started Runs|Count|Total|Number of runs started for this workspace|Scenario|
|Failed Runs|Failed Runs|Count|Total|Number of runs failed for this workspace|Scenario|

## Microsoft.Maps/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Usage|Usage|Count|Count|Count of API calls|ApiCategory, ApiName, ResultType, ResponseCode|
|Availability|Availability|Percent|Average|Availability of the APIs|ApiCategory, ApiName|

## Microsoft.NetApp/netAppAccounts/capacityPools/Volumes

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AverageOtherLatency|Average other latency|ms/op|Average|Average other latency (that is not read or write) in milliseconds per operation|No Dimensions|
|AverageReadLatency|Average read latency|ms/op|Average|Average read latency in milliseconds per operation|No Dimensions|
|AverageTotalLatency|Average total latency|ms/op|Average|Average total latency in milliseconds per operation|No Dimensions|
|AverageWriteLatency|Average write latency|ms/op|Average|Average write latency in milliseconds per operation|No Dimensions|
|FilesystemOtherOps|Filesystem other ops|ops|Average|Number of filesystem other operations (that is not read or write)|No Dimensions|
|FilesystemReadOps|Filesystem read ops|ops|Average|Number of filesystem read operations|No Dimensions|
|FilesystemTotalOps|Filesystem total ops|ops|Average|Sum of all filesystem operations|No Dimensions|
|FilesystemWriteOps|Filesystem write ops|ops|Average|Number of filesystem write operations|No Dimensions|
|IoBytesPerOtherOps|Io bytes per other ops|bytes/op|Average|Number of In/out bytes per other operations (that is not read or write)|No Dimensions|
|IoBytesPerReadOps|Io bytes per read ops|bytes/op|Average|Number of In/out bytes per read operation|No Dimensions|
|IoBytesPerTotalOps|Io bytes per op across all operations|bytes/op|Average|Sum of all In/out bytes operation|No Dimensions|
|IoBytesPerWriteOps|Io bytes per write ops|bytes/op|Average|Number of In/out bytes per write operation|No Dimensions|
|OtherIops|Other iops|operations/second|Average|Other In/out operation per second|No Dimensions|
|OtherThroughput|Other throughput|MBps|Average|Other throughput (that is not read or write) in megabytes per second|No Dimensions|
|ReadIops|Read iops|operations/second|Average|Read In/out operations per second|No Dimensions|
|ReadThroughput|Read throughput|MBps|Average|Read throughput in megabytes per second|No Dimensions|
|TotalIops|Total iops|operations/second|Average|Sum of all In/out operations per second|No Dimensions|
|TotalThroughput|Total throughput|MBps|Average|Sum of all throughput in megabytes per second|No Dimensions|
|VolumeAllocatedSize|Volume allocated size|bytes|Average|Allocated size of the volume (Not the actual used bytes)|No Dimensions|
|VolumeLogicalSize|Volume logical size|bytes|Average|Logical size of the volume (used bytes)|No Dimensions|
|VolumeSnapshotSize|Volume snapshot size|bytes|Average|Size of all snapshots in volume|No Dimensions|
|WriteIops|Write iops|operations/second|Average|Write In/out operations per second|No Dimensions|
|WriteThroughput|Write throughput|MBps|Average|Write throughput in megabytes per second|No Dimensions|

## Microsoft.NetApp/netAppAccounts/capacityPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|VolumePoolAllocatedSize|Volume pool allocated size|bytes|Average|Allocated size of the pool (Not the actual used bytes)|No Dimensions|
|VolumePoolAllocatedUsed|Volume pool allocated used|bytes|Average|Allocated used size of the pool|No Dimensions|
|VolumePoolTotalLogicalSize|Volume pool total logical size|bytes|Average|Sum of the logical size of all the volumes belonging to the pool|No Dimensions|
|VolumePoolTotalSnapshotSize|Volume pool total snapshot size|bytes|Average|Sum of all snapshots in pool|No Dimensions|

## Microsoft.Network/networkInterfaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BytesSentRate|Bytes Sent|Count|Total|Number of bytes the Network Interface sent|No Dimensions|
|BytesReceivedRate|Bytes Received|Count|Total|Number of bytes the Network Interface received|No Dimensions|
|PacketsSentRate|Packets Sent|Count|Total|Number of packets the Network Interface sent|No Dimensions|
|PacketsReceivedRate|Packets Received|Count|Total|Number of packets the Network Interface received|No Dimensions|

## Microsoft.Network/loadBalancers

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|VipAvailability|Data Path Availability|Count|Average|Average Load Balancer data path availability per time duration|FrontendIPAddress, FrontendPort|
|DipAvailability|Health Probe Status|Count|Average|Average Load Balancer health probe status per time duration|ProtocolType, BackendPort, FrontendIPAddress, FrontendPort, BackendIPAddress|
|ByteCount|Byte Count|Count|Total|Total number of Bytes transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|PacketCount|Packet Count|Count|Total|Total number of Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|SYNCount|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|FrontendIPAddress, FrontendPort, Direction|
|SnatConnectionCount|SNAT Connection Count|Count|Total|Total number of new SNAT connections created within time period|FrontendIPAddress, BackendIPAddress, ConnectionState|
|AllocatedSnatPorts|Allocated SNAT Ports (Preview)|Count|Total|Total number of SNAT ports allocated within time period|FrontendIPAddress, BackendIPAddress, ProtocolType|
|UsedSnatPorts|Used SNAT Ports (Preview)|Count|Total|Total number of SNAT ports used within time period|FrontendIPAddress, BackendIPAddress, ProtocolType|

## Microsoft.Network/dnszones

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueryVolume|Query Volume|Count|Total|Number of queries served for a DNS zone|No Dimensions|
|RecordSetCount|Record Set Count|Count|Maximum|Number of Record Sets in a DNS zone|No Dimensions|
|RecordSetCapacityUtilization|Record Set Capacity Utilization|Percent|Maximum|Percent of Record Set capacity utilized by a DNS zone|No Dimensions|

## Microsoft.Network/publicIPAddresses

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|PacketsInDDoS|Inbound packets DDoS|CountPerSecond|Maximum|Inbound packets DDoS|No Dimensions|
|PacketsDroppedDDoS|Inbound packets dropped DDoS|CountPerSecond|Maximum|Inbound packets dropped DDoS|No Dimensions|
|PacketsForwardedDDoS|Inbound packets forwarded DDoS|CountPerSecond|Maximum|Inbound packets forwarded DDoS|No Dimensions|
|TCPPacketsInDDoS|Inbound TCP packets DDoS|CountPerSecond|Maximum|Inbound TCP packets DDoS|No Dimensions|
|TCPPacketsDroppedDDoS|Inbound TCP packets dropped DDoS|CountPerSecond|Maximum|Inbound TCP packets dropped DDoS|No Dimensions|
|TCPPacketsForwardedDDoS|Inbound TCP packets forwarded DDoS|CountPerSecond|Maximum|Inbound TCP packets forwarded DDoS|No Dimensions|
|UDPPacketsInDDoS|Inbound UDP packets DDoS|CountPerSecond|Maximum|Inbound UDP packets DDoS|No Dimensions|
|UDPPacketsDroppedDDoS|Inbound UDP packets dropped DDoS|CountPerSecond|Maximum|Inbound UDP packets dropped DDoS|No Dimensions|
|UDPPacketsForwardedDDoS|Inbound UDP packets forwarded DDoS|CountPerSecond|Maximum|Inbound UDP packets forwarded DDoS|No Dimensions|
|BytesInDDoS|Inbound bytes DDoS|BytesPerSecond|Maximum|Inbound bytes DDoS|No Dimensions|
|BytesDroppedDDoS|Inbound bytes dropped DDoS|BytesPerSecond|Maximum|Inbound bytes dropped DDoS|No Dimensions|
|BytesForwardedDDoS|Inbound bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound bytes forwarded DDoS|No Dimensions|
|TCPBytesInDDoS|Inbound TCP bytes DDoS|BytesPerSecond|Maximum|Inbound TCP bytes DDoS|No Dimensions|
|TCPBytesDroppedDDoS|Inbound TCP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound TCP bytes dropped DDoS|No Dimensions|
|TCPBytesForwardedDDoS|Inbound TCP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound TCP bytes forwarded DDoS|No Dimensions|
|UDPBytesInDDoS|Inbound UDP bytes DDoS|BytesPerSecond|Maximum|Inbound UDP bytes DDoS|No Dimensions|
|UDPBytesDroppedDDoS|Inbound UDP bytes dropped DDoS|BytesPerSecond|Maximum|Inbound UDP bytes dropped DDoS|No Dimensions|
|UDPBytesForwardedDDoS|Inbound UDP bytes forwarded DDoS|BytesPerSecond|Maximum|Inbound UDP bytes forwarded DDoS|No Dimensions|
|IfUnderDDoSAttack|Under DDoS attack or not|Count|Maximum|Under DDoS attack or not|No Dimensions|
|DDoSTriggerTCPPackets|Inbound TCP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound TCP packets to trigger DDoS mitigation|No Dimensions|
|DDoSTriggerUDPPackets|Inbound UDP packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound UDP packets to trigger DDoS mitigation|No Dimensions|
|DDoSTriggerSYNPackets|Inbound SYN packets to trigger DDoS mitigation|CountPerSecond|Maximum|Inbound SYN packets to trigger DDoS mitigation|No Dimensions|
|VipAvailability|Data Path Availability|Count|Average|Average IP Address availability per time duration|Port|
|ByteCount|Byte Count|Count|Total|Total number of Bytes transmitted within time period|Port, Direction|
|PacketCount|Packet Count|Count|Total|Total number of Packets transmitted within time period|Port, Direction|
|SynCount|SYN Count|Count|Total|Total number of SYN Packets transmitted within time period|Port, Direction|

## Microsoft.Network/azurefirewalls

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ApplicationRuleHit|Application rules hit count|Count|Total|Number of times Application rules were hit|Status, Reason, Protocol|
|NetworkRuleHit|Network rules hit count|Count|Total|Number of times Network rules were hit|Status, Reason, Protocol|

## Microsoft.Network/applicationGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Throughput|Throughput|BytesPerSecond|Total|Number of bytes per second the Application Gateway has served|No Dimensions|
|UnhealthyHostCount|Unhealthy Host Count|Count|Average|Number of unhealthy backend hosts|BackendSettingsPool|
|HealthyHostCount|Healthy Host Count|Count|Average|Number of healthy backend hosts|BackendSettingsPool|
|TotalRequests|Total Requests|Count|Total|Count of successful requests that Application Gateway has served|BackendSettingsPool|
|FailedRequests|Failed Requests|Count|Total|Count of failed requests that Application Gateway has served|BackendSettingsPool|
|ResponseStatus|Response Status|Count|Total|Http response status returned by Application Gateway|HttpStatusGroup|
|CurrentConnections|Current Connections|Count|Total|Count of current connections established with Application Gateway|No Dimensions|
|CapacityUnits|Current Capacity Units|Count|Average|Capacity Units consumed|No Dimensions|

## Microsoft.Network/virtualNetworkGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AverageBandwidth|Gateway S2S Bandwidth|BytesPerSecond|Average|Average site-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|P2SBandwidth|Gateway P2S Bandwidth|BytesPerSecond|Average|Average point-to-site bandwidth of a gateway in bytes per second|No Dimensions|
|P2SConnectionCount|P2S Connection Count|Count|Maximum|Point-to-site connection count of a gateway|Protocol|
|TunnelAverageBandwidth|Tunnel Bandwidth|BytesPerSecond|Average|Average bandwidth of a tunnel in bytes per second|ConnectionName, RemoteIP|
|TunnelEgressBytes|Tunnel Egress Bytes|Bytes|Total|Outgoing bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressBytes|Tunnel Ingress Bytes|Bytes|Total|Incoming bytes of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPackets|Tunnel Egress Packets|Count|Total|Outgoing packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPackets|Tunnel Ingress Packets|Count|Total|Incoming packet count of a tunnel|ConnectionName, RemoteIP|
|TunnelEgressPacketDropTSMismatch|Tunnel Egress TS Mismatch Packet Drop|Count|Total|Outgoing packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|
|TunnelIngressPacketDropTSMismatch|Tunnel Ingress TS Mismatch Packet Drop|Count|Total|Incoming packet drop count from traffic selector mismatch of a tunnel|ConnectionName, RemoteIP|

## Microsoft.Network/expressRouteCircuits

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|PeeringType|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|PeeringType|

## Microsoft.Network/expressRouteCircuits/peerings

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|No Dimensions|

## Microsoft.Network/connections

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BitsInPerSecond|BitsInPerSecond|CountPerSecond|Average|Bits ingressing Azure per second|No Dimensions|
|BitsOutPerSecond|BitsOutPerSecond|CountPerSecond|Average|Bits egressing Azure per second|No Dimensions|

## Microsoft.Network/trafficManagerProfiles

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QpsByEndpoint|Queries by Endpoint Returned|Count|Total|Number of times a Traffic Manager endpoint was returned in the given time frame|EndpointName|
|ProbeAgentCurrentEndpointStateByProfileResourceId|Endpoint Status by Endpoint|Count|Maximum|1 if an endpoint's probe status is "Enabled", 0 otherwise.|EndpointName|

## Microsoft.Network/networkWatchers/connectionMonitors

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ProbesFailedPercent|% Probes Failed|Percent|Average|% of connectivity monitoring probes failed|No Dimensions|
|AverageRoundtripMs|Avg. Round-trip Time (ms)|MilliSeconds|Average|Average network round-trip time (ms) for connectivity monitoring probes sent between source and destination|No Dimensions|

## Microsoft.Network/frontdoors

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|RequestCount|Request Count|Count|Total|The number of client requests served by the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|RequestSize|Request Size|Bytes|Total|The number of bytes sent as requests from clients to the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|ResponseSize|Response Size|Bytes|Total|The number of bytes sent as responses from HTTP/S proxy to clients|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|BackendRequestCount|Backend Request Count|Count|Total|The number of requests sent from the HTTP/S proxy to backends|HttpStatus, HttpStatusGroup, Backend|
|BackendRequestLatency|Backend Request Latency|MilliSeconds|Average|The time calculated from when the request was sent by the HTTP/S proxy to the backend until the HTTP/S proxy received the last response byte from the backend|Backend|
|TotalLatency|Total Latency|MilliSeconds|Average|The time calculated from when the client request was received by the HTTP/S proxy until the client acknowledged the last response byte from the HTTP/S proxy|HttpStatus, HttpStatusGroup, ClientRegion, ClientCountry|
|BackendHealthPercentage|Backend Health Percentage|Percent|Average|The percentage of successful health probes from the HTTP/S proxy to backends|Backend, BackendPool|
|WebApplicationFirewallRequestCount|Web Application Firewall Request Count|Count|Total|The number of client requests processed by the Web Application Firewall|PolicyName, RuleName, Action|

## Microsoft.NotificationHubs/Namespaces/NotificationHubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|registration.all|Registration Operations|Count|Total|The count of all successful registration operations (creations updates queries and deletions). |No Dimensions|
|registration.create|Registration Create Operations|Count|Total|The count of all successful registration creations.|No Dimensions|
|registration.update|Registration Update Operations|Count|Total|The count of all successful registration updates.|No Dimensions|
|registration.get|Registration Read Operations|Count|Total|The count of all successful registration queries.|No Dimensions|
|registration.delete|Registration Delete Operations|Count|Total|The count of all successful registration deletions.|No Dimensions|
|incoming|Incoming Messages|Count|Total|The count of all successful send API calls. |No Dimensions|
|incoming.scheduled|Scheduled Push Notifications Sent|Count|Total|Scheduled Push Notifications Canceled|No Dimensions|
|incoming.scheduled.cancel|Scheduled Push Notifications Canceled|Count|Total|Scheduled Push Notifications Canceled|No Dimensions|
|scheduled.pending|Pending Scheduled Notifications|Count|Total|Pending Scheduled Notifications|No Dimensions|
|installation.all|Installation Management Operations|Count|Total|Installation Management Operations|No Dimensions|
|installation.get|Get Installation Operations|Count|Total|Get Installation Operations|No Dimensions|
|installation.upsert|Create or Update Installation Operations|Count|Total|Create or Update Installation Operations|No Dimensions|
|installation.patch|Patch Installation Operations|Count|Total|Patch Installation Operations|No Dimensions|
|installation.delete|Delete Installation Operations|Count|Total|Delete Installation Operations|No Dimensions|
|outgoing.allpns.success|Successful notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.allpns.invalidpayload|Payload Errors|Count|Total|The count of pushes that failed because the PNS returned a bad payload error.|No Dimensions|
|outgoing.allpns.pnserror|External Notification System Errors|Count|Total|The count of pushes that failed because there was a problem communicating with the PNS (excludes authentication problems).|No Dimensions|
|outgoing.allpns.channelerror|Channel Errors|Count|Total|The count of pushes that failed because the channel was invalid not associated with the correct app throttled or expired.|No Dimensions|
|outgoing.allpns.badorexpiredchannel|Bad or Expired Channel Errors|Count|Total|The count of pushes that failed because the channel/token/registrationId in the registration was expired or invalid.|No Dimensions|
|outgoing.wns.success|WNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.wns.invalidcredentials|WNS Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked. (Windows Live does not recognize the credentials).|No Dimensions|
|outgoing.wns.badchannel|WNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (WNS status: 404 not found).|No Dimensions|
|outgoing.wns.expiredchannel|WNS Expired Channel Error|Count|Total|The count of pushes that failed because the ChannelURI is expired (WNS status: 410 Gone).|No Dimensions|
|outgoing.wns.throttled|WNS Throttled Notifications|Count|Total|The count of pushes that failed because WNS is throttling this app (WNS status: 406 Not Acceptable).|No Dimensions|
|outgoing.wns.tokenproviderunreachable|WNS Authorization Errors (Unreachable)|Count|Total|Windows Live is not reachable.|No Dimensions|
|outgoing.wns.invalidtoken|WNS Authorization Errors (Invalid Token)|Count|Total|The token provided to WNS is not valid (WNS status: 401 Unauthorized).|No Dimensions|
|outgoing.wns.wrongtoken|WNS Authorization Errors (Wrong Token)|Count|Total|The token provided to WNS is valid but for another application (WNS status: 403 Forbidden). This can happen if the ChannelURI in the registration is associated with another app. Check that the client app is associated with the same app whose credentials are in the notification hub.|No Dimensions|
|outgoing.wns.invalidnotificationformat|WNS Invalid Notification Format|Count|Total|The format of the notification is invalid (WNS status: 400). Note that WNS does not reject all invalid payloads.|No Dimensions|
|outgoing.wns.invalidnotificationsize|WNS Invalid Notification Size Error|Count|Total|The notification payload is too large (WNS status: 413).|No Dimensions|
|outgoing.wns.channelthrottled|WNS Channel Throttled|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-NotificationStatus:channelThrottled).|No Dimensions|
|outgoing.wns.channeldisconnected|WNS Channel Disconnected|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (WNS response header: X-WNS-DeviceConnectionStatus: disconnected).|No Dimensions|
|outgoing.wns.dropped|WNS Dropped Notifications|Count|Total|The notification was dropped because the ChannelURI in the registration is throttled (X-WNS-NotificationStatus: dropped but not X-WNS-DeviceConnectionStatus: disconnected).|No Dimensions|
|outgoing.wns.pnserror|WNS Errors|Count|Total|Notification not delivered because of errors communicating with WNS.|No Dimensions|
|outgoing.wns.authenticationerror|WNS Authentication Errors|Count|Total|Notification not delivered because of errors communicating with Windows Live invalid credentials or wrong token.|No Dimensions|
|outgoing.apns.success|APNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.apns.invalidcredentials|APNS Authorization Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.apns.badchannel|APNS Bad Channel Error|Count|Total|The count of pushes that failed because the token is invalid (APNS status code: 8).|No Dimensions|
|outgoing.apns.expiredchannel|APNS Expired Channel Error|Count|Total|The count of token that were invalidated by the APNS feedback channel.|No Dimensions|
|outgoing.apns.invalidnotificationsize|APNS Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (APNS status code: 7).|No Dimensions|
|outgoing.apns.pnserror|APNS Errors|Count|Total|The count of pushes that failed because of errors communicating with APNS.|No Dimensions|
|outgoing.gcm.success|GCM Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.gcm.invalidcredentials|GCM Authorization Errors (Invalid Credentials)|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.gcm.badchannel|GCM Bad Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was not recognized (GCM result: Invalid Registration).|No Dimensions|
|outgoing.gcm.expiredchannel|GCM Expired Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration was expired (GCM result: NotRegistered).|No Dimensions|
|outgoing.gcm.throttled|GCM Throttled Notifications|Count|Total|The count of pushes that failed because GCM throttled this app (GCM status code: 501-599 or result:Unavailable).|No Dimensions|
|outgoing.gcm.invalidnotificationformat|GCM Invalid Notification Format|Count|Total|The count of pushes that failed because the payload was not formatted correctly (GCM result: InvalidDataKey or InvalidTtl).|No Dimensions|
|outgoing.gcm.invalidnotificationsize|GCM Invalid Notification Size Error|Count|Total|The count of pushes that failed because the payload was too large (GCM result: MessageTooBig).|No Dimensions|
|outgoing.gcm.wrongchannel|GCM Wrong Channel Error|Count|Total|The count of pushes that failed because the registrationId in the registration is not associated to the current app (GCM result: InvalidPackageName).|No Dimensions|
|outgoing.gcm.pnserror|GCM Errors|Count|Total|The count of pushes that failed because of errors communicating with GCM.|No Dimensions|
|outgoing.gcm.authenticationerror|GCM Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials the credentials are blocked or the SenderId is not correctly configured in the app (GCM result: MismatchedSenderId).|No Dimensions|
|outgoing.mpns.success|MPNS Successful Notifications|Count|Total|The count of all successful notifications.|No Dimensions|
|outgoing.mpns.invalidcredentials|MPNS Invalid Credentials|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|outgoing.mpns.badchannel|MPNS Bad Channel Error|Count|Total|The count of pushes that failed because the ChannelURI in the registration was not recognized (MPNS status: 404 not found).|No Dimensions|
|outgoing.mpns.throttled|MPNS Throttled Notifications|Count|Total|The count of pushes that failed because MPNS is throttling this app (WNS MPNS: 406 Not Acceptable).|No Dimensions|
|outgoing.mpns.invalidnotificationformat|MPNS Invalid Notification Format|Count|Total|The count of pushes that failed because the payload of the notification was too large.|No Dimensions|
|outgoing.mpns.channeldisconnected|MPNS Channel Disconnected|Count|Total|The count of pushes that failed because the ChannelURI in the registration was disconnected (MPNS status: 412 not found).|No Dimensions|
|outgoing.mpns.dropped|MPNS Dropped Notifications|Count|Total|The count of pushes that were dropped by MPNS (MPNS response header: X-NotificationStatus: QueueFull or Suppressed).|No Dimensions|
|outgoing.mpns.pnserror|MPNS Errors|Count|Total|The count of pushes that failed because of errors communicating with MPNS.|No Dimensions|
|outgoing.mpns.authenticationerror|MPNS Authentication Errors|Count|Total|The count of pushes that failed because the PNS did not accept the provided credentials or the credentials are blocked.|No Dimensions|
|notificationhub.pushes|All Outgoing Notifications|Count|Total|All outgoing notifications of the notification hub|No Dimensions|
|incoming.all.requests|All Incoming Requests|Count|Total|Total incoming requests for a notification hub|No Dimensions|
|incoming.all.failedrequests|All Incoming Failed Requests|Count|Total|Total incoming failed requests for a notification hub|No Dimensions|

## Microsoft.OperationalInsights/workspaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Average_% Free Inodes|% Free Inodes|Count|Average|Average_% Free Inodes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Free Space|% Free Space|Count|Average|Average_% Free Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Inodes|% Used Inodes|Count|Average|Average_% Used Inodes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Space|% Used Space|Count|Average|Average_% Used Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Read Bytes/sec|Disk Read Bytes/sec|Count|Average|Average_Disk Read Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Reads/sec|Disk Reads/sec|Count|Average|Average_Disk Reads/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Transfers/sec|Disk Transfers/sec|Count|Average|Average_Disk Transfers/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Write Bytes/sec|Disk Write Bytes/sec|Count|Average|Average_Disk Write Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Writes/sec|Disk Writes/sec|Count|Average|Average_Disk Writes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Megabytes|Free Megabytes|Count|Average|Average_Free Megabytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Logical Disk Bytes/sec|Logical Disk Bytes/sec|Count|Average|Average_Logical Disk Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Available Memory|% Available Memory|Count|Average|Average_% Available Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Available Swap Space|% Available Swap Space|Count|Average|Average_% Available Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Memory|% Used Memory|Count|Average|Average_% Used Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Used Swap Space|% Used Swap Space|Count|Average|Average_% Used Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes Memory|Available MBytes Memory|Count|Average|Average_Available MBytes Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes Swap|Available MBytes Swap|Count|Average|Average_Available MBytes Swap|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Page Reads/sec|Page Reads/sec|Count|Average|Average_Page Reads/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Page Writes/sec|Page Writes/sec|Count|Average|Average_Page Writes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pages/sec|Pages/sec|Count|Average|Average_Pages/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used MBytes Swap Space|Used MBytes Swap Space|Count|Average|Average_Used MBytes Swap Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used Memory MBytes|Used Memory MBytes|Count|Average|Average_Used Memory MBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes Transmitted|Total Bytes Transmitted|Count|Average|Average_Total Bytes Transmitted|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes Received|Total Bytes Received|Count|Average|Average_Total Bytes Received|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Bytes|Total Bytes|Count|Average|Average_Total Bytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Packets Transmitted|Total Packets Transmitted|Count|Average|Average_Total Packets Transmitted|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Packets Received|Total Packets Received|Count|Average|Average_Total Packets Received|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Rx Errors|Total Rx Errors|Count|Average|Average_Total Rx Errors|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Tx Errors|Total Tx Errors|Count|Average|Average_Total Tx Errors|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Total Collisions|Total Collisions|Count|Average|Average_Total Collisions|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Read|Avg. Disk sec/Read|Count|Average|Average_Avg. Disk sec/Read|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Transfer|Avg. Disk sec/Transfer|Count|Average|Average_Avg. Disk sec/Transfer|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Write|Avg. Disk sec/Write|Count|Average|Average_Avg. Disk sec/Write|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Physical Disk Bytes/sec|Physical Disk Bytes/sec|Count|Average|Average_Physical Disk Bytes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pct Privileged Time|Pct Privileged Time|Count|Average|Average_Pct Privileged Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Pct User Time|Pct User Time|Count|Average|Average_Pct User Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Used Memory kBytes|Used Memory kBytes|Count|Average|Average_Used Memory kBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Virtual Shared Memory|Virtual Shared Memory|Count|Average|Average_Virtual Shared Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% DPC Time|% DPC Time|Count|Average|Average_% DPC Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Idle Time|% Idle Time|Count|Average|Average_% Idle Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Interrupt Time|% Interrupt Time|Count|Average|Average_% Interrupt Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% IO Wait Time|% IO Wait Time|Count|Average|Average_% IO Wait Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Nice Time|% Nice Time|Count|Average|Average_% Nice Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Privileged Time|% Privileged Time|Count|Average|Average_% Privileged Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Processor Time|% Processor Time|Count|Average|Average_% Processor Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% User Time|% User Time|Count|Average|Average_% User Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Physical Memory|Free Physical Memory|Count|Average|Average_Free Physical Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Space in Paging Files|Free Space in Paging Files|Count|Average|Average_Free Space in Paging Files|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Virtual Memory|Free Virtual Memory|Count|Average|Average_Free Virtual Memory|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Processes|Processes|Count|Average|Average_Processes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Size Stored In Paging Files|Size Stored In Paging Files|Count|Average|Average_Size Stored In Paging Files|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Uptime|Uptime|Count|Average|Average_Uptime|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Users|Users|Count|Average|Average_Users|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Read|Avg. Disk sec/Read|Count|Average|Average_Avg. Disk sec/Read|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Avg. Disk sec/Write|Avg. Disk sec/Write|Count|Average|Average_Avg. Disk sec/Write|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Current Disk Queue Length|Current Disk Queue Length|Count|Average|Average_Current Disk Queue Length|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Reads/sec|Disk Reads/sec|Count|Average|Average_Disk Reads/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Transfers/sec|Disk Transfers/sec|Count|Average|Average_Disk Transfers/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Disk Writes/sec|Disk Writes/sec|Count|Average|Average_Disk Writes/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Free Megabytes|Free Megabytes|Count|Average|Average_Free Megabytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Free Space|% Free Space|Count|Average|Average_% Free Space|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Available MBytes|Available MBytes|Count|Average|Average_Available MBytes|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Committed Bytes In Use|% Committed Bytes In Use|Count|Average|Average_% Committed Bytes In Use|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Received/sec|Bytes Received/sec|Count|Average|Average_Bytes Received/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Sent/sec|Bytes Sent/sec|Count|Average|Average_Bytes Sent/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Bytes Total/sec|Bytes Total/sec|Count|Average|Average_Bytes Total/sec|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_% Processor Time|% Processor Time|Count|Average|Average_% Processor Time|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Average_Processor Queue Length|Processor Queue Length|Count|Average|Average_Processor Queue Length|Computer, ObjectName, InstanceName, CounterPath, SourceSystem|
|Heartbeat|Heartbeat|Count|Total|Heartbeat|Computer, OSType, Version, SourceComputerId|
|Update|Update|Count|Average|Update|Computer, Product, Classification, UpdateState, Optional, Approved|
|Event|Event|Count|Average|Event|Source, EventLog, Computer, EventCategory, EventLevel, EventLevelName, EventID|

## Microsoft.PowerBIDedicated/capacities

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueryDuration|Query Duration|Milliseconds|Average|DAX Query duration in last interval|No Dimensions|
|QueryPoolJobQueueLength|Threads: Query pool job queue length|Count|Average|Number of jobs in the queue of the query thread pool.|No Dimensions|
|qpu_high_utilization_metric|QPU High Utilization|Count|Total|QPU High Utilization In Last Minute, 1 For High QPU Utilization, Otherwise 0|No Dimensions|
|memory_metric|Memory|Bytes|Average|Memory. Range 0-3 GB for A1, 0-5 GB for A2, 0-10 GB for A3, 0-25 GB for A4, 0-50 GB for A5 and 0-100 GB for A6|No Dimensions|
|memory_thrashing_metric|Memory Thrashing|Percent|Average|Average memory thrashing.|No Dimensions|

## Microsoft.Relay/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ListenerConnections-Success|ListenerConnections-Success|Count|Total|Successful ListenerConnections for Microsoft.Relay.|EntityName|
|ListenerConnections-ClientError|ListenerConnections-ClientError|Count|Total|ClientError on ListenerConnections for Microsoft.Relay.|EntityName|
|ListenerConnections-ServerError|ListenerConnections-ServerError|Count|Total|ServerError on ListenerConnections for Microsoft.Relay.|EntityName|
|SenderConnections-Success|SenderConnections-Success|Count|Total|Successful SenderConnections for Microsoft.Relay.|EntityName|
|SenderConnections-ClientError|SenderConnections-ClientError|Count|Total|ClientError on SenderConnections for Microsoft.Relay.|EntityName|
|SenderConnections-ServerError|SenderConnections-ServerError|Count|Total|ServerError on SenderConnections for Microsoft.Relay.|EntityName|
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
|SearchLatency|Search Latency|Seconds|Average|Average search latency for the search service|No Dimensions|
|SearchQueriesPerSecond|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|No Dimensions|
|ThrottledSearchQueriesPercentage|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|No Dimensions|

## Microsoft.ServiceBus/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|SuccessfulRequests|Successful Requests (Preview)|Count|Total|Total successful requests for a namespace (Preview)|EntityName|
|ServerErrors|Server Errors. (Preview)|Count|Total|Server Errors for Microsoft.ServiceBus. (Preview)|EntityName|
|UserErrors|User Errors. (Preview)|Count|Total|User Errors for Microsoft.ServiceBus. (Preview)|EntityName|
|ThrottledRequests|Throttled Requests. (Preview)|Count|Total|Throttled Requests for Microsoft.ServiceBus. (Preview)|EntityName|
|IncomingRequests|Incoming Requests (Preview)|Count|Total|Incoming Requests for Microsoft.ServiceBus. (Preview)|EntityName|
|IncomingMessages|Incoming Messages (Preview)|Count|Total|Incoming Messages for Microsoft.ServiceBus. (Preview)|EntityName|
|OutgoingMessages|Outgoing Messages (Preview)|Count|Total|Outgoing Messages for Microsoft.ServiceBus. (Preview)|EntityName|
|ActiveConnections|ActiveConnections (Preview)|Count|Total|Total Active Connections for Microsoft.ServiceBus. (Preview)|No Dimensions|
|Size|Size (Preview)|Bytes|Average|Size of an Queue/Topic in Bytes. (Preview)|EntityName|
|Messages|Count of messages in a Queue/Topic. (Preview)|Count|Average|Count of messages in a Queue/Topic. (Preview)|EntityName|
|ActiveMessages|Count of active messages in a Queue/Topic. (Preview)|Count|Average|Count of active messages in a Queue/Topic. (Preview)|EntityName|
|DeadletteredMessages|Count of dead-lettered messages in a Queue/Topic. (Preview)|Count|Average|Count of dead-lettered messages in a Queue/Topic. (Preview)|EntityName|
|ScheduledMessages|Count of scheduled messages in a Queue/Topic. (Preview)|Count|Average|Count of scheduled messages in a Queue/Topic. (Preview)|EntityName|
|CPUXNS|CPU usage per namespace|Percent|Maximum|Service bus premium namespace CPU usage metric|No Dimensions|
|WSXNS|Memory size usage per namespace|Percent|Maximum|Service bus premium namespace memory usage metric|No Dimensions|

## Microsoft.ServiceFabricMesh/applications

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|AllocatedCpu|AllocatedCpu|Count|Average|Cpu allocated to this container in millicores|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|AllocatedMemory|AllocatedMemory|Bytes|Average|Memory allocated to this container in MB|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|ActualCpu|ActualCpu|Count|Average|Actual CPU usage in millicores|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|ActualMemory|ActualMemory|Bytes|Average|Actual memory usage in MB|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|CpuUtilization|CpuUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|MemoryUtilization|MemoryUtilization|Percent|Average|Utilization of CPU for this container as percentage of AllocatedCpu|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName|
|ApplicationStatus|ApplicationStatus|Count|Average|Status of Service Fabric Mesh application|ApplicationName, Status|
|ServiceStatus|ServiceStatus|Count|Average|Health Status of a service in Service Fabric Mesh application|ApplicationName, Status, ServiceName|
|ServiceReplicaStatus|ServiceReplicaStatus|Count|Average|Health Status of a service replica in Service Fabric Mesh application|ApplicationName, Status, ServiceName, ServiceReplicaName|
|ContainerStatus|ContainerStatus|Count|Average|Status of the container in Service Fabric Mesh application|ApplicationName, ServiceName, CodePackageName, ServiceReplicaName, Status|
|RestartCount|RestartCount|Count|Average|Restart count of a container in Service Fabric Mesh application|ApplicationName, Status, ServiceName, ServiceReplicaName, CodePackageName|

## Microsoft.SignalRService/SignalR

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ConnectionCount|Connection Count|Count|Maximum|The amount of user connection.|Endpoint|
|MessageCount|Message Count|Count|Total|The total amount of messages.|No Dimensions|
|InboundTraffic|Inbound Traffic|Bytes|Total|The inbound traffic of service|No Dimensions|
|OutboundTraffic|Outbound Traffic|Bytes|Total|The outbound traffic of service|No Dimensions|
|UserErrors|User Errors|Percent|Maximum|The percentage of user errors|No Dimensions|
|SystemErrors|System Errors|Percent|Maximum|The percentage of system errors|No Dimensions|

## Microsoft.Sql/servers/databases

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Average|CPU percentage|No Dimensions|
|physical_data_read_percent|Data IO percentage|Percent|Average|Data IO percentage|No Dimensions|
|log_write_percent|Log IO percentage|Percent|Average|Log IO percentage|No Dimensions|
|dtu_consumption_percent|DTU percentage|Percent|Average|DTU percentage|No Dimensions|
|storage|Data space used|Bytes|Maximum|Total database size|No Dimensions|
|connection_successful|Successful Connections|Count|Total|Successful Connections|No Dimensions|
|connection_failed|Failed Connections|Count|Total|Failed Connections|No Dimensions|
|blocked_by_firewall|Blocked by Firewall|Count|Total|Blocked by Firewall|No Dimensions|
|deadlock|Deadlocks|Count|Total|Deadlocks|No Dimensions|
|storage_percent|Data space used percent|Percent|Maximum|Database size percentage|No Dimensions|
|xtp_storage_percent|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent|No Dimensions|
|workers_percent|Workers percentage|Percent|Average|Workers percentage|No Dimensions|
|sessions_percent|Sessions percentage|Percent|Average|Sessions percentage|No Dimensions|
|dtu_limit|DTU Limit|Count|Average|DTU Limit|No Dimensions|
|dtu_used|DTU used|Count|Average|DTU used|No Dimensions|
|cpu_limit|CPU limit|Count|Average|CPU limit|No Dimensions|
|cpu_used|CPU used|Count|Average|CPU used|No Dimensions|
|dwu_limit|DWU limit|Count|Maximum|DWU limit|No Dimensions|
|dwu_consumption_percent|DWU percentage|Percent|Maximum|DWU percentage|No Dimensions|
|dwu_used|DWU used|Count|Maximum|DWU used|No Dimensions|
|dw_cpu_percent|DW node level CPU percentage|Percent|Average|DW node level CPU percentage|DwLogicalNodeId|
|dw_physical_data_read_percent|DW node level Data IO percentage|Percent|Average|DW node level Data IO percentage|DwLogicalNodeId|
	|cache_hit_percent|Cache hit percentage|Percent|Maximum|Cache hit percentage|No Dimensions|
|cache_used_percent|Cache used percentage|Percent|Maximum|Cache used percentage|No Dimensions|
|local_tempdb_usage_percent|Local tempdb percentage|Percent|Average|Local tempdb percentage|No Dimensions|
|app_cpu_billed|App CPU billed|Count|Total|App CPU billed|No Dimensions|
|app_cpu_percent|App CPU percentage|Percent|Average|App CPU percentage|No Dimensions|
|app_memory_percent|App memory used percentage|Percent|Average|App memory used percentage|No Dimensions|
|allocated_data_storage|Data space allocated|Bytes|Average|Data space allocated|No Dimensions|

## Microsoft.Sql/servers/elasticPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Average|CPU percentage|No Dimensions|
|physical_data_read_percent|Data IO percentage|Percent|Average|Data IO percentage|No Dimensions|
|log_write_percent|Log IO percentage|Percent|Average|Log IO percentage|No Dimensions|
|dtu_consumption_percent|DTU percentage|Percent|Average|DTU percentage|No Dimensions|
|storage_percent|Data space used percent||Percent|Average|Storage percentage|No Dimensions|
|workers_percent|Workers percentage|Percent|Average|Workers percentage|No Dimensions|
|sessions_percent|Sessions percentage|Percent|Average|Sessions percentage|No Dimensions|
|eDTU_limit|eDTU limit|Count|Average|eDTU limit|No Dimensions|
|storage_limit|Data max size|Bytes|Average|Storage limit|No Dimensions|
|eDTU_used|eDTU used|Count|Average|eDTU used|No Dimensions|
|storage_used|Data space used|Bytes|Average|Storage used|No Dimensions|
|xtp_storage_percent|In-Memory OLTP storage percent|Percent|Average|In-Memory OLTP storage percent|No Dimensions|
|cpu_limit|CPU limit|Count|Average|CPU limit|No Dimensions|
|cpu_used|CPU used|Count|Average|CPU used|No Dimensions|
|allocated_data_storage|Data space allocated|Bytes|Average|Data space allocated|No Dimensions|
|allocated_data_storage_percent|Data space allocated percent|Percent|Maximum|Data space allocated percent|No Dimensions|

## Microsoft.Sql/managedInstances

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|virtual_core_count|Virtual core count|Count|Average|Virtual core count|No Dimensions|
|avg_cpu_percent|Average CPU percentage|Percent|Average|Average CPU percentage|No Dimensions|
|reserved_storage_mb|Storage space reserved|Count|Average|Storage space reserved|No Dimensions|
|storage_space_used_mb|Storage space used|Count|Average|Storage space used|No Dimensions|
|io_requests|IO requests count|Count|Average|IO requests count|No Dimensions|
|io_bytes_read|IO bytes read|Bytes|Average|IO bytes read|No Dimensions|
|io_bytes_written|IO bytes written|Bytes|Average|IO bytes written|No Dimensions|

## Microsoft.Storage/storageAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|UsedCapacity|Used capacity|Bytes|Average|Account used capacity|No Dimensions|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|

## Microsoft.Storage/storageAccounts/blobServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|BlobCapacity|Blob Capacity|Bytes|Average|The amount of storage used by the storage account’s Blob service in bytes.|BlobType, Tier|
|BlobCount|Blob Count|Count|Total|The number of Blob in the storage account’s Blob service.|BlobType|		|BlobCount|Blob Count|Count|Average|The number of Blob in the storage account’s Blob service.|BlobType, Tier|
|ContainerCount|Blob Container Count|Count|Average|The number of containers in the storage account’s Blob service.|No Dimensions|
|IndexCapacity|Index Capacity|Bytes|Average|The amount of storage used by ADLS Gen2 (Hierarchical) Index in bytes.|No Dimensions|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|

## Microsoft.Storage/storageAccounts/fileServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|FileCapacity|File Capacity|Bytes|Average|The amount of storage used by the storage account’s File service in bytes.|No Dimensions|
|FileCount|File Count|Count|Average|The number of file in the storage account’s File service.|No Dimensions|
|FileShareCount|File Share Count|Count|Average|The number of file shares in the storage account’s File service.|No Dimensions|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|

## Microsoft.Storage/storageAccounts/queueServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|QueueCapacity|Queue Capacity|Bytes|Average|The amount of storage used by the storage account’s Queue service in bytes.|No Dimensions|
|QueueCount|Queue Count|Count|Average|The number of queue in the storage account’s Queue service.|No Dimensions|
|QueueMessageCount|Queue Message Count|Count|Average|The approximate number of queue messages in the storage account’s Queue service.|No Dimensions|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|

## Microsoft.Storage/storageAccounts/tableServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|TableCapacity|Table Capacity|Bytes|Average|The amount of storage used by the storage account’s Table service in bytes.|No Dimensions|
|TableCount|Table Count|Count|Average|The number of table in the storage account’s Table service.|No Dimensions|
|TableEntityCount|Table Entity Count|Count|Average|The number of table entities in the storage account’s Table service.|No Dimensions|
|Transactions|Transactions|Count|Total|The number of requests made to a storage service or the specified API operation. This number includes successful and failed requests, as well as requests which produced errors. Use ResponseType dimension for the number of different type of response.|ResponseType, GeoType, ApiName, Authentication|
|Ingress|Ingress|Bytes|Total|The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.|GeoType, ApiName, Authentication|
|Egress|Egress|Bytes|Total|The amount of egress data, in bytes. This number includes egress from an external client into Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.|GeoType, ApiName, Authentication|
|SuccessServerLatency|Success Server Latency|Milliseconds|Average|The average latency used by Azure Storage to process a successful request, in milliseconds. This value does not include the network latency specified in AverageE2ELatency.|GeoType, ApiName, Authentication|
|SuccessE2ELatency|Success E2E Latency|Milliseconds|Average|The average end-to-end latency of successful requests made to a storage service or the specified API operation, in milliseconds. This value includes the required processing time within Azure Storage to read the request, send the response, and receive acknowledgment of the response.|GeoType, ApiName, Authentication|
|Availability|Availability|Percent|Average|The percentage of availability for the storage service or the specified API operation. Availability is calculated by taking the TotalBillableRequests value and dividing it by the number of applicable requests, including those that produced unexpected errors. All unexpected errors result in reduced availability for the storage service or the specified API operation.|GeoType, ApiName, Authentication|

## microsoft.storagesync/storageSyncServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ServerSyncSessionResult|Sync Session Result|Count|Average|Metric that logs a value of 1 each time the Server Endpoint successfully completes a Sync Session with the Cloud Endpoint|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncSyncSessionAppliedFilesCount|Files Synced|Count|Total|Count of Files synced|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncSyncSessionPerItemErrorsCount|Files not syncing|Count|Total|Count of files failed to sync|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncBatchTransferredFileBytes|Bytes synced|Bytes|Total|Total file size transferred for Sync Sessions|SyncGroupName, ServerEndpointName, SyncDirection|
|StorageSyncServerHeartbeat|Server Online Status|Count|Maximum|Metric that logs a value of 1 each time the registered server successfully records a heartbeat with the Cloud Endpoint|ServerName|
|StorageSyncRecallIOTotalSizeBytes|Cloud tiering recall|Bytes|Total|Total size of data recalled by the server|ServerName|

## Microsoft.StreamAnalytics/streamingjobs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|ResourceUtilization|SU % Utilization|Percent|Maximum|SU % Utilization|LogicalName, PartitionId|
|InputEvents|Input Events|Count|Total|Input Events|LogicalName, PartitionId|
|InputEventBytes|Input Event Bytes|Bytes|Total|Input Event Bytes|LogicalName, PartitionId|
|LateInputEvents|Late Input Events|Count|Total|Late Input Events|LogicalName, PartitionId|
|OutputEvents|Output Events|Count|Total|Output Events|LogicalName, PartitionId|
|ConversionErrors|Data Conversion Errors|Count|Total|Data Conversion Errors|LogicalName, PartitionId|
|Errors|Runtime Errors|Count|Total|Runtime Errors|LogicalName, PartitionId|
|DroppedOrAdjustedEvents|Out of order Events|Count|Total|Out of order Events|LogicalName, PartitionId|
|AMLCalloutRequests|Function Requests|Count|Total|Function Requests|LogicalName, PartitionId|
|AMLCalloutFailedRequests|Failed Function Requests|Count|Total|Failed Function Requests|LogicalName, PartitionId|
|AMLCalloutInputEvents|Function Events|Count|Total|Function Events|LogicalName, PartitionId|
|DeserializationError|Input Deserialization Errors|Count|Total|Input Deserialization Errors|LogicalName, PartitionId|
|EarlyInputEvents|Early Input Events|Count|Total|Early Input Events|LogicalName, PartitionId|
|OutputWatermarkDelaySeconds|Watermark Delay|Seconds|Maximum|Watermark Delay|LogicalName, PartitionId|
|InputEventsSourcesBacklogged|Backlogged Input Events|Count|Maximum|Backlogged Input Events|LogicalName, PartitionId|
|InputEventsSourcesPerSecond|Input Sources Received|Count|Total|Input Sources Received|LogicalName, PartitionId|

## Microsoft.TimeSeriesInsights/environments

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|IngressReceivedMessages|Ingress Received Messages|Count|Total|Count of messages read from all Event hub or IoT hub event sources|No Dimensions|
|IngressReceivedInvalidMessages|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from all Event hub or IoT hub event sources|No Dimensions|
|IngressReceivedBytes|Ingress Received Bytes|Bytes|Total|Count of bytes read from all event sources|No Dimensions|
|IngressStoredBytes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|No Dimensions|
|IngressStoredEvents|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|No Dimensions|
|IngressReceivedMessagesTimeLag|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|No Dimensions|
|IngressReceivedMessagesCountLag|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of message being processed in Ingress|No Dimensions|
|WarmStorageMaxProperties|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|No Dimensions|
|WarmStorageUsedProperties|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|No Dimensions|

## Microsoft.TimeSeriesInsights/environments/eventsources

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|IngressReceivedMessages|Ingress Received Messages|Count|Total|Count of messages read from the event source|No Dimensions|
|IngressReceivedInvalidMessages|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from the event source|No Dimensions|
|IngressReceivedBytes|Ingress Received Bytes|Bytes|Total|Count of bytes read from the event source|No Dimensions|
|IngressStoredBytes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|No Dimensions|
|IngressStoredEvents|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|No Dimensions|
|IngressReceivedMessagesTimeLag|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|No Dimensions|
|IngressReceivedMessagesCountLag|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of message being processed in Ingress|No Dimensions|
|WarmStorageMaxProperties|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|No Dimensions|
|WarmStorageUsedProperties|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|No Dimensions|

## Microsoft.VMwareCloudSimple/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|DiskReadBytesPerSecond|Disk Read Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to read operations over the sample period.|No Dimensions|
|DiskWriteBytesPerSecond|Disk Write Bytes/Sec|BytesPerSecond|Average|Average disk throughput due to write operations over the sample period.|No Dimensions|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Total disk throughput due to read operations over the sample period.|No Dimensions|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Total disk throughput due to write operations over the sample period.|No Dimensions|
|DiskReadOperations|Disk Read Operations|Count|Total|The number of IO read operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|DiskWriteOperations|Disk Write Operations|Count|Total|The number of IO write operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|The average number of IO read operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|The average number of IO write operations in the previous sample period. Note that these operations may be variable sized.|No Dimensions|
|DiskReadLatency|Disk Read Latency|Milliseconds|Average|Total read latency. The sum of the device and kernel read latencies.|No Dimensions|
|DiskWriteLatency|Disk Write Latency|Milliseconds|Average|Total write latency. The sum of the device and kernel write latencies.|No Dimensions|
|NetworkInBytesPerSecond|Network In Bytes/Sec|BytesPerSecond|Average|Average network throughput for received traffic.|No Dimensions|
|NetworkOutBytesPerSecond|Network Out Bytes/Sec|BytesPerSecond|Average|Average network throughput for transmitted traffic.|No Dimensions|
|Network In|Network In|Bytes|Total|Total network throughput for received traffic.|No Dimensions|
|Network Out|Network Out|Bytes|Total|Total network throughput for transmitted traffic.|No Dimensions|
|MemoryUsed|Memory Used|Bytes|Average|The amount of machine memory that is in use by the VM.|No Dimensions|
|MemoryGranted|Memory Granted|Bytes|Average|The amount of memory that was granted to the VM by the host. Memory is not granted to the host until it is touched one time and granted memory may be swapped out or ballooned away if the VMkernel needs the memory.|No Dimensions|
|MemoryActive|Memory Active|Bytes|Average|The amount of memory used by the VM in the past small window of time. This is the "true" number of how much memory the VM currently has need of. Additional, unused memory may be swapped out or ballooned with no impact to the guest's performance.|No Dimensions|
|Percentage CPU|Percentage CPU|Percent|Average|The CPU utilization. This value is reported with 100% representing all processor cores on the system. As an example, a 2-way VM using 50% of a four-core system is completely using two cores.|No Dimensions|
|PercentageCpuReady|Percentage CPU Ready|Milliseconds|Total|Ready time is the time spend waiting for CPU(s) to become available in the past update interval.|No Dimensions|

## Microsoft.Web/serverfarms

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|Instance|
|DiskQueueLength|Disk Queue Length|Count|Average|Disk Queue Length|Instance|
|HttpQueueLength|Http Queue Length|Count|Average|Http Queue Length|Instance|
|BytesReceived|Data In|Bytes|Total|Data In|Instance|
|BytesSent|Data Out|Bytes|Total|Data Out|Instance|

## Microsoft.Web/sites (excluding functions)

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

## Microsoft.Web/sites (functions)

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
|TotalFrontEnds|Total Front Ends|Count|Average|Total Front Ends|No Dimensions|
|SmallAppServicePlanInstances|Small App Service Plan Workers|Count|Average|Small App Service Plan Workers|No Dimensions|
|MediumAppServicePlanInstances|Medium App Service Plan Workers|Count|Average|Medium App Service Plan Workers|No Dimensions|
|LargeAppServicePlanInstances|Large App Service Plan Workers|Count|Average|Large App Service Plan Workers|No Dimensions|

## Microsoft.Web/hostingEnvironments/workerPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|WorkersTotal|Total Workers|Count|Average|Total Workers|No Dimensions|
|WorkersAvailable|Available Workers|Count|Average|Available Workers|No Dimensions|
|WorkersUsed|Used Workers|Count|Average|Used Workers|No Dimensions|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|Instance|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|Instance|

## Next steps
* [Read about metrics in Azure Monitor](data-platform.md)
* [Create alerts on metrics](alerts-overview.md)
* [Export metrics to storage, Event Hub, or Log Analytics](diagnostic-logs-overview.md)
