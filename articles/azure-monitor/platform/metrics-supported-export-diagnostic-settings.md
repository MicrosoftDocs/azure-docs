---
title:  Azure Monitor platform metrics exportable via Diagnostic Settings
description: List of metrics available for each resource type with Azure Monitor.
services: azure-monitor
ms.service: azure-monitor
ms.topic: reference
ms.date: 05/20/2019
author: rboucher
ms.author: robb
ms.subservice: metrics
---
# Azure Monitor platform metrics exportable via Diagnostic Settings

Azure Monitor provides [platform metrics](data-platform-metrics.md) by default with no configuration. It provides several ways to interact with platform metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. See [metrics-supported](metrics-supported.md) for a complete list of platform metrics currently available with Azure Monitor's consolidated metric pipeline. To query for and access these metrics please use the [2018-01-01 api-version](https://docs.microsoft.com/rest/api/monitor/metricdefinitions). Other metrics may be available in the portal or using legacy APIs.

You can export the platform metrics from the Azure monitor pipeline to other locations in one of two ways.
1. Using [diagnostic settings](diagnostic-settings.md) to send to Log Analytics, Event Hubs or Azure Storage.
2. Use the [metrics REST API](https://docs.microsoft.com/rest/api/monitor/metrics/list)

Because of intricacies in the Azure Monitor backend, not all metrics are exportable using diagnostic settings. The table below lists which can and cannot be exported using diagnostic settings.

Exportable via Diagnostic Settings? | ResourceType | Metric | MetricDisplayName | Unit | AggregationType
|----|-----|------|----|----|-----|
Yes | Microsoft.AnalysisServices/servers | CleanerCurrentPrice | Memory: Cleaner Current Price | Count | Average
Yes | Microsoft.AnalysisServices/servers | CleanerMemoryNonshrinkable | Memory: Cleaner Memory nonshrinkable | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | CleanerMemoryShrinkable | Memory: Cleaner Memory shrinkable | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | CommandPoolBusyThreads | Threads: Command pool busy threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | CommandPoolIdleThreads | Threads: Command pool idle threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | CommandPoolJobQueueLength | Command Pool Job Queue Length | Count | Average
Yes | Microsoft.AnalysisServices/servers | CurrentConnections | Connection: Current connections | Count | Average
Yes | Microsoft.AnalysisServices/servers | CurrentUserSessions | Current User Sessions | Count | Average
Yes | Microsoft.AnalysisServices/servers | LongParsingBusyThreads | Threads: Long parsing busy threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | LongParsingIdleThreads | Threads: Long parsing idle threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | LongParsingJobQueueLength | Threads: Long parsing job queue length | Count | Average
Yes | Microsoft.AnalysisServices/servers | mashup_engine_memory_metric | M Engine Memory | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | mashup_engine_private_bytes_metric | M Engine Private Bytes | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | mashup_engine_qpu_metric | M Engine QPU | Count | Average
Yes | Microsoft.AnalysisServices/servers | mashup_engine_virtual_bytes_metric | M Engine Virtual Bytes | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | memory_metric | Memory | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | memory_thrashing_metric | Memory Thrashing | Percent | Average
Yes | Microsoft.AnalysisServices/servers | MemoryLimitHard | Memory: Memory Limit Hard | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | MemoryLimitHigh | Memory: Memory Limit High | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | MemoryLimitLow | Memory: Memory Limit Low | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | MemoryLimitVertiPaq | Memory: Memory Limit VertiPaq | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | MemoryUsage | Memory: Memory Usage | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | private_bytes_metric | Private Bytes | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolBusyIOJobThreads | Threads: Processing pool busy I/O job threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolBusyNonIOThreads | Threads: Processing pool busy non-I/O threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolIdleIOJobThreads | Threads: Processing pool idle I/O job threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolIdleNonIOThreads | Threads: Processing pool idle non-I/O threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolIOJobQueueLength | Threads: Processing pool I/O job queue length | Count | Average
Yes | Microsoft.AnalysisServices/servers | ProcessingPoolJobQueueLength | Processing Pool Job Queue Length | Count | Average
Yes | Microsoft.AnalysisServices/servers | qpu_metric | QPU | Count | Average
Yes | Microsoft.AnalysisServices/servers | QueryPoolBusyThreads | Query Pool Busy Threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | QueryPoolIdleThreads | Threads: Query pool idle threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | QueryPoolJobQueueLength | Threads: Query pool job queue length | Count | Average
Yes | Microsoft.AnalysisServices/servers | Quota | Memory: Quota | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | QuotaBlocked | Memory: Quota Blocked | Count | Average
Yes | Microsoft.AnalysisServices/servers | RowsConvertedPerSec | Processing: Rows converted per sec | CountPerSecond | Average
Yes | Microsoft.AnalysisServices/servers | RowsReadPerSec | Processing: Rows read per sec | CountPerSecond | Average
Yes | Microsoft.AnalysisServices/servers | RowsWrittenPerSec | Processing: Rows written per sec | CountPerSecond | Average
Yes | Microsoft.AnalysisServices/servers | ShortParsingBusyThreads | Threads: Short parsing busy threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ShortParsingIdleThreads | Threads: Short parsing idle threads | Count | Average
Yes | Microsoft.AnalysisServices/servers | ShortParsingJobQueueLength | Threads: Short parsing job queue length | Count | Average
Yes | Microsoft.AnalysisServices/servers | SuccessfullConnectionsPerSec | Successful Connections Per Sec | CountPerSecond | Average
Yes | Microsoft.AnalysisServices/servers | TotalConnectionFailures | Total Connection Failures | Count | Average
Yes | Microsoft.AnalysisServices/servers | TotalConnectionRequests | Total Connection Requests | Count | Average
Yes | Microsoft.AnalysisServices/servers | VertiPaqNonpaged | Memory: VertiPaq Nonpaged | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | VertiPaqPaged | Memory: VertiPaq Paged | Bytes | Average
Yes | Microsoft.AnalysisServices/servers | virtual_bytes_metric | Virtual Bytes | Bytes | Average
Yes | Microsoft.ApiManagement/service | BackendDuration | Duration of Backend Requests | Milliseconds | Average
Yes | Microsoft.ApiManagement/service | Capacity | Capacity | Percent | Average
Yes | Microsoft.ApiManagement/service | Duration | Overall Duration of Gateway Requests | Milliseconds | Average
Yes | Microsoft.ApiManagement/service | EventHubDroppedEvents | Dropped EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubRejectedEvents | Rejected EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubSuccessfulEvents | Successful EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubThrottledEvents | Throttled EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubTimedoutEvents | Timed Out EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubTotalBytesSent | Size of EventHub Events | Bytes | Total
Yes | Microsoft.ApiManagement/service | EventHubTotalEvents | Total EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | EventHubTotalFailedEvents | Failed EventHub Events | Count | Total
Yes | Microsoft.ApiManagement/service | FailedRequests | Failed Gateway Requests (Deprecated) | Count | Total
Yes | Microsoft.ApiManagement/service | OtherRequests | Other Gateway Requests (Deprecated) | Count | Total
Yes | Microsoft.ApiManagement/service | Requests | Requests | Count | Total
Yes | Microsoft.ApiManagement/service | SuccessfulRequests | Successful Gateway Requests (Deprecated) | Count | Total
Yes | Microsoft.ApiManagement/service | TotalRequests | Total Gateway Requests (Deprecated) | Count | Total
Yes | Microsoft.ApiManagement/service | UnauthorizedRequests | Unauthorized Gateway Requests (Deprecated) | Count | Total
Yes | Microsoft.AppPlatform/Spring | AppCpuUsagePercentage | App CPU Usage Percentage | Percent | Average
Yes | Microsoft.AppPlatform/Spring | AppMemoryCommitted | App Memory Assigned | Bytes | Average
Yes | Microsoft.AppPlatform/Spring | AppMemoryMax | App Memory Max | Bytes | Maximum
Yes | Microsoft.AppPlatform/Spring | AppMemoryUsed | App Memory Used | Bytes | Average
Yes | Microsoft.AppPlatform/Spring | GCPauseTotalCount | GC Pause Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | GCPauseTotalTime | GC Pause Total Time | Milliseconds | Total
Yes | Microsoft.AppPlatform/Spring | MaxOldGenMemoryPoolBytes | Max Available Old Generation Data Size | Bytes | Average
Yes | Microsoft.AppPlatform/Spring | OldGenMemoryPoolBytes | Old Generation Data Size | Bytes | Average
Yes | Microsoft.AppPlatform/Spring | OldGenPromotedBytes | Promote to Old Generation Data Size | Bytes | Maximum
Yes | Microsoft.AppPlatform/Spring | SystemCpuUsagePercentage | System CPU Usage Percentage | Percent | Average
Yes | Microsoft.AppPlatform/Spring | TomcatErrorCount | Tomcat Global Error | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatReceivedBytes | Tomcat Total Received Bytes | Bytes | Total
Yes | Microsoft.AppPlatform/Spring | TomcatRequestMaxTime | Tomcat Request Max Time | Milliseconds | Maximum
Yes | Microsoft.AppPlatform/Spring | TomcatRequestTotalCount | Tomcat Request Total Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatRequestTotalTime | Tomcat Request Total Times | Milliseconds | Total
Yes | Microsoft.AppPlatform/Spring | TomcatResponseAvgTime | Tomcat Request Average Time | Milliseconds | Average
Yes | Microsoft.AppPlatform/Spring | TomcatSentBytes | Tomcat Total Sent Bytes | Bytes | Total
Yes | Microsoft.AppPlatform/Spring | TomcatSessionActiveCurrentCount | Tomcat Session Alive Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatSessionActiveMaxCount | Tomcat Session Max Active Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatSessionAliveMaxTime | Tomcat Session Max Alive Time | Milliseconds | Maximum
Yes | Microsoft.AppPlatform/Spring | TomcatSessionCreatedCount | Tomcat Session Created Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatSessionExpiredCount | Tomcat Session Expired Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | TomcatSessionRejectedCount | Tomcat Session Rejected Count | Count | Total
Yes | Microsoft.AppPlatform/Spring | YoungGenPromotedBytes | Promote to Young Generation Data Size | Bytes | Maximum
Yes | Microsoft.Automation/automationAccounts | TotalJob | Total Jobs | Count | Total
Yes | Microsoft.Automation/automationAccounts | TotalUpdateDeploymentMachineRuns | Total Update Deployment Machine Runs | Count | Total
Yes | Microsoft.Automation/automationAccounts | TotalUpdateDeploymentRuns | Total Update Deployment Runs | Count | Total
No | Microsoft.Batch/batchAccounts | CoreCount | Dedicated Core Count | Count | Total
No | Microsoft.Batch/batchAccounts | CreatingNodeCount | Creating Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | IdleNodeCount | Idle Node Count | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobDeleteCompleteEvent | Job Delete Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobDeleteStartEvent | Job Delete Start Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobDisableCompleteEvent | Job Disable Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobDisableStartEvent | Job Disable Start Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobStartEvent | Job Start Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobTerminateCompleteEvent | Job Terminate Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | JobTerminateStartEvent | Job Terminate Start Events | Count | Total
No | Microsoft.Batch/batchAccounts | LeavingPoolNodeCount | Leaving Pool Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | LowPriorityCoreCount | LowPriority Core Count | Count | Total
No | Microsoft.Batch/batchAccounts | OfflineNodeCount | Offline Node Count | Count | Total
Yes | Microsoft.Batch/batchAccounts | PoolCreateEvent | Pool Create Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | PoolDeleteCompleteEvent | Pool Delete Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | PoolDeleteStartEvent | Pool Delete Start Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | PoolResizeCompleteEvent | Pool Resize Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | PoolResizeStartEvent | Pool Resize Start Events | Count | Total
No | Microsoft.Batch/batchAccounts | PreemptedNodeCount | Preempted Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | RebootingNodeCount | Rebooting Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | ReimagingNodeCount | Reimaging Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | RunningNodeCount | Running Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | StartingNodeCount | Starting Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | StartTaskFailedNodeCount | Start Task Failed Node Count | Count | Total
Yes | Microsoft.Batch/batchAccounts | TaskCompleteEvent | Task Complete Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | TaskFailEvent | Task Fail Events | Count | Total
Yes | Microsoft.Batch/batchAccounts | TaskStartEvent | Task Start Events | Count | Total
No | Microsoft.Batch/batchAccounts | TotalLowPriorityNodeCount | Low-Priority Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | TotalNodeCount | Dedicated Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | UnusableNodeCount | Unusable Node Count | Count | Total
No | Microsoft.Batch/batchAccounts | WaitingForStartTaskNodeCount | Waiting For Start Task Node Count | Count | Total
Yes | Microsoft.BatchAI/workspaces | Active Cores | Active Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Active Nodes | Active Nodes | Count | Average
Yes | Microsoft.BatchAI/workspaces | Idle Cores | Idle Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Idle Nodes | Idle Nodes | Count | Average
Yes | Microsoft.BatchAI/workspaces | Job Completed | Job Completed | Count | Total
Yes | Microsoft.BatchAI/workspaces | Job Submitted | Job Submitted | Count | Total
Yes | Microsoft.BatchAI/workspaces | Leaving Cores | Leaving Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Leaving Nodes | Leaving Nodes | Count | Average
Yes | Microsoft.BatchAI/workspaces | Preempted Cores | Preempted Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Preempted Nodes | Preempted Nodes | Count | Average
Yes | Microsoft.BatchAI/workspaces | Quota Utilization Percentage | Quota Utilization Percentage | Count | Average
Yes | Microsoft.BatchAI/workspaces | Total Cores | Total Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Total Nodes | Total Nodes | Count | Average
Yes | Microsoft.BatchAI/workspaces | Unusable Cores | Unusable Cores | Count | Average
Yes | Microsoft.BatchAI/workspaces | Unusable Nodes | Unusable Nodes | Count | Average
Yes | Microsoft.Blockchain/blockchainMembers | ConnectionAccepted | Accepted Connections | Count | Total
Yes | Microsoft.Blockchain/blockchainMembers | ConnectionActive | Active Connections | Count | Average
Yes | Microsoft.Blockchain/blockchainMembers | ConnectionHandled | Handled Connections | Count | Total
Yes | Microsoft.Blockchain/blockchainMembers | CpuUsagePercentageInDouble | CPU Usage Percentage | Percent | Maximum
Yes | Microsoft.Blockchain/blockchainMembers | IOReadBytes | IO Read Bytes | Bytes | Total
Yes | Microsoft.Blockchain/blockchainMembers | IOWriteBytes | IO Write Bytes | Bytes | Total
Yes | Microsoft.Blockchain/blockchainMembers | MemoryLimit | Memory Limit | Bytes | Average
Yes | Microsoft.Blockchain/blockchainMembers | MemoryUsage | Memory Usage | Bytes | Average
Yes | Microsoft.Blockchain/blockchainMembers | MemoryUsagePercentageInDouble | Memory Usage Percentage | Percent | Average
Yes | Microsoft.Blockchain/blockchainMembers | PendingTransactions | Pending Transactions | Count | Average
Yes | Microsoft.Blockchain/blockchainMembers | ProcessedBlocks | Processed Blocks | Count | Total
Yes | Microsoft.Blockchain/blockchainMembers | ProcessedTransactions | Processed Transactions | Count | Total
Yes | Microsoft.Blockchain/blockchainMembers | QueuedTransactions | Queued Transactions | Count | Average
Yes | Microsoft.Blockchain/blockchainMembers | RequestHandled | Handled Requests | Count | Total
Yes | Microsoft.Blockchain/blockchainMembers | StorageUsage | Storage Usage | Bytes | Average
Yes | Microsoft.Cache/redis | cachehits | Cache Hits | Count | Total
Yes | Microsoft.Cache/redis | cachehits0 | Cache Hits (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | cachehits1 | Cache Hits (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | cachehits2 | Cache Hits (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | cachehits3 | Cache Hits (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | cachehits4 | Cache Hits (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | cachehits5 | Cache Hits (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | cachehits6 | Cache Hits (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | cachehits7 | Cache Hits (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | cachehits8 | Cache Hits (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | cachehits9 | Cache Hits (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | cacheLatency | Cache Latency Microseconds (Preview) | Count | Average
Yes | Microsoft.Cache/redis | cachemisses | Cache Misses | Count | Total
Yes | Microsoft.Cache/redis | cachemisses0 | Cache Misses (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses1 | Cache Misses (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses2 | Cache Misses (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses3 | Cache Misses (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses4 | Cache Misses (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses5 | Cache Misses (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses6 | Cache Misses (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses7 | Cache Misses (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses8 | Cache Misses (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | cachemisses9 | Cache Misses (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | cacheRead | Cache Read | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead0 | Cache Read (Shard 0) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead1 | Cache Read (Shard 1) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead2 | Cache Read (Shard 2) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead3 | Cache Read (Shard 3) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead4 | Cache Read (Shard 4) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead5 | Cache Read (Shard 5) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead6 | Cache Read (Shard 6) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead7 | Cache Read (Shard 7) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead8 | Cache Read (Shard 8) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheRead9 | Cache Read (Shard 9) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite | Cache Write | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite0 | Cache Write (Shard 0) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite1 | Cache Write (Shard 1) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite2 | Cache Write (Shard 2) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite3 | Cache Write (Shard 3) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite4 | Cache Write (Shard 4) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite5 | Cache Write (Shard 5) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite6 | Cache Write (Shard 6) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite7 | Cache Write (Shard 7) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite8 | Cache Write (Shard 8) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | cacheWrite9 | Cache Write (Shard 9) | BytesPerSecond | Maximum
Yes | Microsoft.Cache/redis | connectedclients | Connected Clients | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients0 | Connected Clients (Shard 0) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients1 | Connected Clients (Shard 1) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients2 | Connected Clients (Shard 2) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients3 | Connected Clients (Shard 3) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients4 | Connected Clients (Shard 4) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients5 | Connected Clients (Shard 5) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients6 | Connected Clients (Shard 6) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients7 | Connected Clients (Shard 7) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients8 | Connected Clients (Shard 8) | Count | Maximum
Yes | Microsoft.Cache/redis | connectedclients9 | Connected Clients (Shard 9) | Count | Maximum
Yes | Microsoft.Cache/redis | errors | Errors | Count | Maximum
Yes | Microsoft.Cache/redis | evictedkeys | Evicted Keys | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys0 | Evicted Keys (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys1 | Evicted Keys (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys2 | Evicted Keys (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys3 | Evicted Keys (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys4 | Evicted Keys (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys5 | Evicted Keys (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys6 | Evicted Keys (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys7 | Evicted Keys (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys8 | Evicted Keys (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | evictedkeys9 | Evicted Keys (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys | Expired Keys | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys0 | Expired Keys (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys1 | Expired Keys (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys2 | Expired Keys (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys3 | Expired Keys (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys4 | Expired Keys (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys5 | Expired Keys (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys6 | Expired Keys (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys7 | Expired Keys (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys8 | Expired Keys (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | expiredkeys9 | Expired Keys (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | getcommands | Gets | Count | Total
Yes | Microsoft.Cache/redis | getcommands0 | Gets (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | getcommands1 | Gets (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | getcommands2 | Gets (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | getcommands3 | Gets (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | getcommands4 | Gets (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | getcommands5 | Gets (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | getcommands6 | Gets (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | getcommands7 | Gets (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | getcommands8 | Gets (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | getcommands9 | Gets (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | operationsPerSecond | Operations Per Second | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond0 | Operations Per Second (Shard 0) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond1 | Operations Per Second (Shard 1) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond2 | Operations Per Second (Shard 2) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond3 | Operations Per Second (Shard 3) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond4 | Operations Per Second (Shard 4) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond5 | Operations Per Second (Shard 5) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond6 | Operations Per Second (Shard 6) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond7 | Operations Per Second (Shard 7) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond8 | Operations Per Second (Shard 8) | Count | Maximum
Yes | Microsoft.Cache/redis | operationsPerSecond9 | Operations Per Second (Shard 9) | Count | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime | CPU | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime0 | CPU (Shard 0) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime1 | CPU (Shard 1) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime2 | CPU (Shard 2) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime3 | CPU (Shard 3) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime4 | CPU (Shard 4) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime5 | CPU (Shard 5) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime6 | CPU (Shard 6) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime7 | CPU (Shard 7) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime8 | CPU (Shard 8) | Percent | Maximum
Yes | Microsoft.Cache/redis | percentProcessorTime9 | CPU (Shard 9) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad | Server Load | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad0 | Server Load (Shard 0) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad1 | Server Load (Shard 1) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad2 | Server Load (Shard 2) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad3 | Server Load (Shard 3) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad4 | Server Load (Shard 4) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad5 | Server Load (Shard 5) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad6 | Server Load (Shard 6) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad7 | Server Load (Shard 7) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad8 | Server Load (Shard 8) | Percent | Maximum
Yes | Microsoft.Cache/redis | serverLoad9 | Server Load (Shard 9) | Percent | Maximum
Yes | Microsoft.Cache/redis | setcommands | Sets | Count | Total
Yes | Microsoft.Cache/redis | setcommands0 | Sets (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | setcommands1 | Sets (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | setcommands2 | Sets (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | setcommands3 | Sets (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | setcommands4 | Sets (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | setcommands5 | Sets (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | setcommands6 | Sets (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | setcommands7 | Sets (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | setcommands8 | Sets (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | setcommands9 | Sets (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed | Total Operations | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed0 | Total Operations (Shard 0) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed1 | Total Operations (Shard 1) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed2 | Total Operations (Shard 2) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed3 | Total Operations (Shard 3) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed4 | Total Operations (Shard 4) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed5 | Total Operations (Shard 5) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed6 | Total Operations (Shard 6) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed7 | Total Operations (Shard 7) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed8 | Total Operations (Shard 8) | Count | Total
Yes | Microsoft.Cache/redis | totalcommandsprocessed9 | Total Operations (Shard 9) | Count | Total
Yes | Microsoft.Cache/redis | totalkeys | Total Keys | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys0 | Total Keys (Shard 0) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys1 | Total Keys (Shard 1) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys2 | Total Keys (Shard 2) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys3 | Total Keys (Shard 3) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys4 | Total Keys (Shard 4) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys5 | Total Keys (Shard 5) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys6 | Total Keys (Shard 6) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys7 | Total Keys (Shard 7) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys8 | Total Keys (Shard 8) | Count | Maximum
Yes | Microsoft.Cache/redis | totalkeys9 | Total Keys (Shard 9) | Count | Maximum
Yes | Microsoft.Cache/redis | usedmemory | Used Memory | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory0 | Used Memory (Shard 0) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory1 | Used Memory (Shard 1) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory2 | Used Memory (Shard 2) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory3 | Used Memory (Shard 3) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory4 | Used Memory (Shard 4) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory5 | Used Memory (Shard 5) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory6 | Used Memory (Shard 6) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory7 | Used Memory (Shard 7) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory8 | Used Memory (Shard 8) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemory9 | Used Memory (Shard 9) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemorypercentage | Used Memory Percentage | Percent | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss | Used Memory RSS | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss0 | Used Memory RSS (Shard 0) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss1 | Used Memory RSS (Shard 1) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss2 | Used Memory RSS (Shard 2) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss3 | Used Memory RSS (Shard 3) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss4 | Used Memory RSS (Shard 4) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss5 | Used Memory RSS (Shard 5) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss6 | Used Memory RSS (Shard 6) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss7 | Used Memory RSS (Shard 7) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss8 | Used Memory RSS (Shard 8) | Bytes | Maximum
Yes | Microsoft.Cache/redis | usedmemoryRss9 | Used Memory RSS (Shard 9) | Bytes | Maximum
No | Microsoft.ClassicCompute/domainNames/slots/roles | Disk Read Bytes/Sec | Disk Read | BytesPerSecond | Average
Yes | Microsoft.ClassicCompute/domainNames/slots/roles | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
No | Microsoft.ClassicCompute/domainNames/slots/roles | Disk Write Bytes/Sec | Disk Write | BytesPerSecond | Average
Yes | Microsoft.ClassicCompute/domainNames/slots/roles | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.ClassicCompute/domainNames/slots/roles | Network In | Network In | Bytes | Total
Yes | Microsoft.ClassicCompute/domainNames/slots/roles | Network Out | Network Out | Bytes | Total
Yes | Microsoft.ClassicCompute/domainNames/slots/roles | Percentage CPU | Percentage CPU | Percent | Average
No | Microsoft.ClassicCompute/virtualMachines | Disk Read Bytes/Sec | Disk Read | BytesPerSecond | Average
Yes | Microsoft.ClassicCompute/virtualMachines | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
No | Microsoft.ClassicCompute/virtualMachines | Disk Write Bytes/Sec | Disk Write | BytesPerSecond | Average
Yes | Microsoft.ClassicCompute/virtualMachines | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.ClassicCompute/virtualMachines | Network In | Network In | Bytes | Total
Yes | Microsoft.ClassicCompute/virtualMachines | Network Out | Network Out | Bytes | Total
Yes | Microsoft.ClassicCompute/virtualMachines | Percentage CPU | Percentage CPU | Percent | Average
Yes | Microsoft.ClassicStorage/storageAccounts | Availability | Availability | Percent | Average
Yes | Microsoft.ClassicStorage/storageAccounts | Egress | Egress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts | Ingress | Ingress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts | Transactions | Transactions | Count | Total
No | Microsoft.ClassicStorage/storageAccounts | UsedCapacity | Used capacity | Bytes | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | Availability | Availability | Percent | Average
No | Microsoft.ClassicStorage/storageAccounts/blobServices | BlobCapacity | Blob Capacity | Bytes | Average
No | Microsoft.ClassicStorage/storageAccounts/blobServices | BlobCount | Blob Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | ContainerCount | Blob Container Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | Egress | Egress | Bytes | Total
No | Microsoft.ClassicStorage/storageAccounts/blobServices | IndexCapacity | Index Capacity | Bytes | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/blobServices | Transactions | Transactions | Count | Total
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | Availability | Availability | Percent | Average
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | Egress | Egress | Bytes | Total
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileCapacity | File Capacity | Bytes | Average
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileCount | File Count | Count | Average
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareCount | File Share Count | Count | Average
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareQuota | File share quota size | Bytes | Average
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareSnapshotCount | File Share Snapshot Count | Count | Average
No | Microsoft.ClassicStorage/storageAccounts/fileServices | FileShareSnapshotSize | File Share Snapshot Size | Bytes | Average
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/fileServices | Transactions | Transactions | Count | Total
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | Availability | Availability | Percent | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | Egress | Egress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | QueueCapacity | Queue Capacity | Bytes | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | QueueCount | Queue Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | QueueMessageCount | Queue Message Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/queueServices | Transactions | Transactions | Count | Total
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | Availability | Availability | Percent | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | Egress | Egress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | TableCapacity | Table Capacity | Bytes | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | TableCount | Table Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | TableEntityCount | Table Entity Count | Count | Average
Yes | Microsoft.ClassicStorage/storageAccounts/tableServices | Transactions | Transactions | Count | Total
Yes | Microsoft.CognitiveServices/accounts | BlockedCalls | Blocked Calls | Count | Total
Yes | Microsoft.CognitiveServices/accounts | CharactersTrained | Characters Trained | Count | Total
Yes | Microsoft.CognitiveServices/accounts | CharactersTranslated | Characters Translated | Count | Total
Yes | Microsoft.CognitiveServices/accounts | ClientErrors | Client Errors | Count | Total
Yes | Microsoft.CognitiveServices/accounts | DataIn | Data In | Bytes | Total
Yes | Microsoft.CognitiveServices/accounts | DataOut | Data Out | Bytes | Total
Yes | Microsoft.CognitiveServices/accounts | Latency | Latency | MilliSeconds | Average
Yes | Microsoft.CognitiveServices/accounts | ServerErrors | Server Errors | Count | Total
Yes | Microsoft.CognitiveServices/accounts | SpeechSessionDuration | Speech Session Duration | Seconds | Total
Yes | Microsoft.CognitiveServices/accounts | SuccessfulCalls | Successful Calls | Count | Total
Yes | Microsoft.CognitiveServices/accounts | TotalCalls | Total Calls | Count | Total
Yes | Microsoft.CognitiveServices/accounts | TotalErrors | Total Errors | Count | Total
Yes | Microsoft.CognitiveServices/accounts | TotalTokenCalls | Total Token Calls | Count | Total
Yes | Microsoft.CognitiveServices/accounts | TotalTransactions | Total Transactions | Count | Total
Yes | Microsoft.Compute/virtualMachines | CPU Credits Consumed | CPU Credits Consumed | Count | Average
Yes | Microsoft.Compute/virtualMachines | CPU Credits Remaining | CPU Credits Remaining | Count | Average
Yes | Microsoft.Compute/virtualMachines | Data Disk Queue Depth | Data Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachines | Data Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Data Disk Read Operations/Sec | Data Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Data Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Data Disk Write Operations/Sec | Data Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Disk Read Bytes | Disk Read Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Disk Write Bytes | Disk Write Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Inbound Flows | Inbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachines | Inbound Flows Maximum Creation Rate | Inbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Network In | Network In Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | Network In Total | Network In Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | Network Out | Network Out Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | Network Out Total | Network Out Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachines | OS Disk Queue Depth | OS Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachines | OS Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Disk Read Operations/Sec | OS Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Disk Write Operations/Sec | OS Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Per Disk QD | OS Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachines | OS Per Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Per Disk Read Operations/Sec | OS Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Per Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | OS Per Disk Write Operations/Sec | OS Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Outbound Flows | Outbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachines | Outbound Flows Maximum Creation Rate | Outbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Per Disk QD | Data Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachines | Per Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Per Disk Read Operations/Sec | Data Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Per Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Per Disk Write Operations/Sec | Data Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachines | Percentage CPU | Percentage CPU | Percent | Average
Yes | Microsoft.Compute/virtualMachines | Premium Data Disk Cache Read Hit | Premium Data Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachines | Premium Data Disk Cache Read Miss | Premium Data Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachines | Premium OS Disk Cache Read Hit | Premium OS Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachines | Premium OS Disk Cache Read Miss | Premium OS Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | CPU Credits Consumed | CPU Credits Consumed | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | CPU Credits Remaining | CPU Credits Remaining | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Data Disk Queue Depth | Data Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Data Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Data Disk Read Operations/Sec | Data Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Data Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Data Disk Write Operations/Sec | Data Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Disk Read Bytes | Disk Read Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Disk Write Bytes | Disk Write Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Inbound Flows | Inbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Inbound Flows Maximum Creation Rate | Inbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Network In | Network In Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | Network In Total | Network In Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | Network Out | Network Out Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | Network Out Total | Network Out Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Disk Queue Depth | OS Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Disk Read Operations/Sec | OS Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Disk Write Operations/Sec | OS Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Per Disk QD | OS Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Per Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Per Disk Read Operations/Sec | OS Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Per Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | OS Per Disk Write Operations/Sec | OS Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Outbound Flows | Outbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Outbound Flows Maximum Creation Rate | Outbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Per Disk QD | Data Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Per Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Per Disk Read Operations/Sec | Data Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Per Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Per Disk Write Operations/Sec | Data Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Percentage CPU | Percentage CPU | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Premium Data Disk Cache Read Hit | Premium Data Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Premium Data Disk Cache Read Miss | Premium Data Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Premium OS Disk Cache Read Hit | Premium OS Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets | Premium OS Disk Cache Read Miss | Premium OS Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | CPU Credits Consumed | CPU Credits Consumed | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | CPU Credits Remaining | CPU Credits Remaining | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Data Disk Queue Depth | Data Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Data Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Data Disk Read Operations/Sec | Data Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Data Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Data Disk Write Operations/Sec | Data Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Disk Read Bytes | Disk Read Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Disk Write Bytes | Disk Write Bytes | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Inbound Flows | Inbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Inbound Flows Maximum Creation Rate | Inbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Network In | Network In Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Network In Total | Network In Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Network Out | Network Out Billable (Deprecated) | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Network Out Total | Network Out Total | Bytes | Total
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Disk Queue Depth | OS Disk Queue Depth (Preview) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Disk Read Operations/Sec | OS Disk Read Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Disk Write Operations/Sec | OS Disk Write Operations/Sec (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Per Disk QD | OS Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Per Disk Read Bytes/sec | OS Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Per Disk Read Operations/Sec | OS Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Per Disk Write Bytes/sec | OS Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | OS Per Disk Write Operations/Sec | OS Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Outbound Flows | Outbound Flows | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Outbound Flows Maximum Creation Rate | Outbound Flows Maximum Creation Rate (Preview) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Per Disk QD | Data Disk QD (Deprecated) | Count | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Per Disk Read Bytes/sec | Data Disk Read Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Per Disk Read Operations/Sec | Data Disk Read Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Per Disk Write Bytes/sec | Data Disk Write Bytes/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Per Disk Write Operations/Sec | Data Disk Write Operations/Sec (Deprecated) | CountPerSecond | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Percentage CPU | Percentage CPU | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Premium Data Disk Cache Read Hit | Premium Data Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Premium Data Disk Cache Read Miss | Premium Data Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Premium OS Disk Cache Read Hit | Premium OS Disk Cache Read Hit (Preview) | Percent | Average
Yes | Microsoft.Compute/virtualMachineScaleSets/virtualMachines | Premium OS Disk Cache Read Miss | Premium OS Disk Cache Read Miss (Preview) | Percent | Average
Yes | Microsoft.ContainerInstance/containerGroups | CpuUsage | CPU Usage | Count | Average
Yes | Microsoft.ContainerInstance/containerGroups | MemoryUsage | Memory Usage | Bytes | Average
Yes | Microsoft.ContainerInstance/containerGroups | NetworkBytesReceivedPerSecond | Network Bytes Received Per Second | Bytes | Average
Yes | Microsoft.ContainerInstance/containerGroups | NetworkBytesTransmittedPerSecond | Network Bytes Transmitted Per Second | Bytes | Average
Yes | Microsoft.ContainerRegistry/registries | RunDuration | Run Duration | Milliseconds | Total
Yes | Microsoft.ContainerRegistry/registries | SuccessfulPullCount | Successful Pull Count | Count | Average
Yes | Microsoft.ContainerRegistry/registries | SuccessfulPushCount | Successful Push Count | Count | Average
Yes | Microsoft.ContainerRegistry/registries | TotalPullCount | Total Pull Count | Count | Average
Yes | Microsoft.ContainerRegistry/registries | TotalPushCount | Total Push Count | Count | Average
No | Microsoft.ContainerService/managedClusters | kube_node_status_allocatable_cpu_cores | Total number of available cpu cores in a managed cluster | Count | Average
No | Microsoft.ContainerService/managedClusters | kube_node_status_allocatable_memory_bytes | Total amount of available memory in a managed cluster | Bytes | Average
No | Microsoft.ContainerService/managedClusters | kube_node_status_condition | Statuses for various node conditions | Count | Average
No | Microsoft.ContainerService/managedClusters | kube_pod_status_phase | Number of pods by phase | Count | Average
No | Microsoft.ContainerService/managedClusters | kube_pod_status_ready | Number of pods in Ready state | Count | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | AvailableCapacity | Available Capacity | Bytes | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | BytesUploadedToCloud | Cloud Bytes Uploaded (Device) | Bytes | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | BytesUploadedToCloudPerShare | Cloud Bytes Uploaded (Share) | Bytes | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | CloudReadThroughput | Cloud Download Throughput | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | CloudReadThroughputPerShare | Cloud Download Throughput (Share) | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | CloudUploadThroughput | Cloud Upload Throughput | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | CloudUploadThroughputPerShare | Cloud Upload Throughput (Share) | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | HyperVMemoryUtilization | Edge Compute - Memory Usage | Percent | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | HyperVVirtualProcessorUtilization | Edge Compute - Percentage CPU | Percent | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | NICReadThroughput | Read Throughput (Network) | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | NICWriteThroughput | Write Throughput (Network) | BytesPerSecond | Average
Yes | Microsoft.DataBoxEdge/dataBoxEdgeDevices | TotalCapacity | Total Capacity | Bytes | Average
Yes | Microsoft.DataFactory/datafactories | FailedRuns | Failed Runs | Count | Total
Yes | Microsoft.DataFactory/datafactories | SuccessfulRuns | Successful Runs | Count | Total
Yes | Microsoft.DataFactory/factories | ActivityCancelledRuns | Cancelled activity runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | ActivityFailedRuns | Failed activity runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | ActivitySucceededRuns | Succeeded activity runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | FactorySizeInGbUnits | Total factory size (GB unit) | Count | Maximum
Yes | Microsoft.DataFactory/factories | IntegrationRuntimeAvailableMemory | Integration runtime available memory | Bytes | Average
Yes | Microsoft.DataFactory/factories | IntegrationRuntimeAverageTaskPickupDelay | Integration runtime queue duration | Seconds | Average
Yes | Microsoft.DataFactory/factories | IntegrationRuntimeCpuPercentage | Integration runtime CPU utilization | Percent | Average
Yes | Microsoft.DataFactory/factories | IntegrationRuntimeQueueLength | Integration runtime queue length | Count | Average
Yes | Microsoft.DataFactory/factories | MaxAllowedFactorySizeInGbUnits | Maximum allowed factory size (GB unit) | Count | Maximum
Yes | Microsoft.DataFactory/factories | MaxAllowedResourceCount | Maximum allowed entities count | Count | Maximum
Yes | Microsoft.DataFactory/factories | PipelineCancelledRuns | Cancelled pipeline runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | PipelineFailedRuns | Failed pipeline runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | PipelineSucceededRuns | Succeeded pipeline runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | ResourceCount | Total entities count | Count | Maximum
Yes | Microsoft.DataFactory/factories | TriggerCancelledRuns | Cancelled trigger runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | TriggerFailedRuns | Failed trigger runs metrics | Count | Total
Yes | Microsoft.DataFactory/factories | TriggerSucceededRuns | Succeeded trigger runs metrics | Count | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobAUEndedCancelled | Cancelled AU Time | Seconds | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobAUEndedFailure | Failed AU Time | Seconds | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobAUEndedSuccess | Successful AU Time | Seconds | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobEndedCancelled | Cancelled Jobs | Count | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobEndedFailure | Failed Jobs | Count | Total
Yes | Microsoft.DataLakeAnalytics/accounts | JobEndedSuccess | Successful Jobs | Count | Total
Yes | Microsoft.DataLakeStore/accounts | DataRead | Data Read | Bytes | Total
Yes | Microsoft.DataLakeStore/accounts | DataWritten | Data Written | Bytes | Total
Yes | Microsoft.DataLakeStore/accounts | ReadRequests | Read Requests | Count | Total
Yes | Microsoft.DataLakeStore/accounts | TotalStorage | Total Storage | Bytes | Maximum
Yes | Microsoft.DataLakeStore/accounts | WriteRequests | Write Requests | Count | Total
Yes | Microsoft.DBforMariaDB/servers | active_connections | Active Connections | Count | Average
Yes | Microsoft.DBforMariaDB/servers | backup_storage_used | Backup Storage used | Bytes | Average
Yes | Microsoft.DBforMariaDB/servers | connections_failed | Failed Connections | Count | Total
Yes | Microsoft.DBforMariaDB/servers | cpu_percent | CPU percent | Percent | Average
Yes | Microsoft.DBforMariaDB/servers | io_consumption_percent | IO percent | Percent | Average
Yes | Microsoft.DBforMariaDB/servers | memory_percent | Memory percent | Percent | Average
Yes | Microsoft.DBforMariaDB/servers | network_bytes_egress | Network Out | Bytes | Total
Yes | Microsoft.DBforMariaDB/servers | network_bytes_ingress | Network In | Bytes | Total
Yes | Microsoft.DBforMariaDB/servers | seconds_behind_master | Replication lag in seconds | Count | Maximum
Yes | Microsoft.DBforMariaDB/servers | serverlog_storage_limit | Server Log storage limit | Bytes | Average
Yes | Microsoft.DBforMariaDB/servers | serverlog_storage_percent | Server Log storage percent | Percent | Average
Yes | Microsoft.DBforMariaDB/servers | serverlog_storage_usage | Server Log storage used | Bytes | Average
Yes | Microsoft.DBforMariaDB/servers | storage_limit | Storage limit | Bytes | Maximum
Yes | Microsoft.DBforMariaDB/servers | storage_percent | Storage percent | Percent | Average
Yes | Microsoft.DBforMariaDB/servers | storage_used | Storage used | Bytes | Average
Yes | Microsoft.DBforMySQL/servers | active_connections | Active Connections | Count | Average
Yes | Microsoft.DBforMySQL/servers | backup_storage_used | Backup Storage used | Bytes | Average
Yes | Microsoft.DBforMySQL/servers | connections_failed | Failed Connections | Count | Total
Yes | Microsoft.DBforMySQL/servers | cpu_percent | CPU percent | Percent | Average
Yes | Microsoft.DBforMySQL/servers | io_consumption_percent | IO percent | Percent | Average
Yes | Microsoft.DBforMySQL/servers | memory_percent | Memory percent | Percent | Average
Yes | Microsoft.DBforMySQL/servers | network_bytes_egress | Network Out | Bytes | Total
Yes | Microsoft.DBforMySQL/servers | network_bytes_ingress | Network In | Bytes | Total
Yes | Microsoft.DBforMySQL/servers | seconds_behind_master | Replication lag in seconds | Count | Maximum
Yes | Microsoft.DBforMySQL/servers | serverlog_storage_limit | Server Log storage limit | Bytes | Maximum
Yes | Microsoft.DBforMySQL/servers | serverlog_storage_percent | Server Log storage percent | Percent | Average
Yes | Microsoft.DBforMySQL/servers | serverlog_storage_usage | Server Log storage used | Bytes | Average
Yes | Microsoft.DBforMySQL/servers | storage_limit | Storage limit | Bytes | Maximum
Yes | Microsoft.DBforMySQL/servers | storage_percent | Storage percent | Percent | Average
Yes | Microsoft.DBforMySQL/servers | storage_used | Storage used | Bytes | Average
Yes | Microsoft.DBforPostgreSQL/servers | active_connections | Active Connections | Count | Average
Yes | Microsoft.DBforPostgreSQL/servers | backup_storage_used | Backup Storage used | Bytes | Average
Yes | Microsoft.DBforPostgreSQL/servers | connections_failed | Failed Connections | Count | Total
Yes | Microsoft.DBforPostgreSQL/servers | cpu_percent | CPU percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/servers | io_consumption_percent | IO percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/servers | memory_percent | Memory percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/servers | network_bytes_egress | Network Out | Bytes | Total
Yes | Microsoft.DBforPostgreSQL/servers | network_bytes_ingress | Network In | Bytes | Total
Yes | Microsoft.DBforPostgreSQL/servers | pg_replica_log_delay_in_bytes | Max Lag Across Replicas | Bytes | Maximum
Yes | Microsoft.DBforPostgreSQL/servers | pg_replica_log_delay_in_seconds | Replica Lag | Seconds | Maximum
Yes | Microsoft.DBforPostgreSQL/servers | serverlog_storage_limit | Server Log storage limit | Bytes | Maximum
Yes | Microsoft.DBforPostgreSQL/servers | serverlog_storage_percent | Server Log storage percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/servers | serverlog_storage_usage | Server Log storage used | Bytes | Average
Yes | Microsoft.DBforPostgreSQL/servers | storage_limit | Storage limit | Bytes | Maximum
Yes | Microsoft.DBforPostgreSQL/servers | storage_percent | Storage percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/servers | storage_used | Storage used | Bytes | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | active_connections | Active Connections | Count | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | cpu_percent | CPU percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | iops | IOPS | Count | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | memory_percent | Memory percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | network_bytes_egress | Network Out | Bytes | Total
Yes | Microsoft.DBforPostgreSQL/serversv2 | network_bytes_ingress | Network In | Bytes | Total
Yes | Microsoft.DBforPostgreSQL/serversv2 | storage_percent | Storage percent | Percent | Average
Yes | Microsoft.DBforPostgreSQL/serversv2 | storage_used | Storage used | Bytes | Average
Yes | Microsoft.Devices/Account | digitaltwins.telemetry.nodes | Digital Twins Node Telemetry Placeholder | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.commands.egress.abandon.success | C2D messages abandoned | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.commands.egress.complete.success | C2D message deliveries completed | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.commands.egress.reject.success | C2D messages rejected | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.methods.failure | Failed direct method invocations | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.methods.requestSize | Request size of direct method invocations | Bytes | Average
Yes | Microsoft.Devices/IotHubs | c2d.methods.responseSize | Response size of direct method invocations | Bytes | Average
Yes | Microsoft.Devices/IotHubs | c2d.methods.success | Successful direct method invocations | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.twin.read.failure | Failed twin reads from back end | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.twin.read.size | Response size of twin reads from back end | Bytes | Average
Yes | Microsoft.Devices/IotHubs | c2d.twin.read.success | Successful twin reads from back end | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.twin.update.failure | Failed twin updates from back end | Count | Total
Yes | Microsoft.Devices/IotHubs | c2d.twin.update.size | Size of twin updates from back end | Bytes | Average
Yes | Microsoft.Devices/IotHubs | c2d.twin.update.success | Successful twin updates from back end | Count | Total
Yes | Microsoft.Devices/IotHubs | C2DMessagesExpired | C2D Messages Expired (preview) | Count | Total
Yes | Microsoft.Devices/IotHubs | configurations | Configuration Metrics | Count | Total
No | Microsoft.Devices/IotHubs | connectedDeviceCount | Connected devices (preview) | Count | Average
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.builtIn.events | Routing: messages delivered to messages/events | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.eventHubs | Routing: messages delivered to Event Hub | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.serviceBusQueues | Routing: messages delivered to Service Bus Queue | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.serviceBusTopics | Routing: messages delivered to Service Bus Topic | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage | Routing: messages delivered to storage | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage.blobs | Routing: blobs delivered to storage | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.egress.storage.bytes | Routing: data delivered to storage | Bytes | Total
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.latency.builtIn.events | Routing: message latency for messages/events | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.latency.eventHubs | Routing: message latency for Event Hub | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.latency.serviceBusQueues | Routing: message latency for Service Bus Queue | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.latency.serviceBusTopics | Routing: message latency for Service Bus Topic | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | d2c.endpoints.latency.storage | Routing: message latency for storage | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.egress.dropped | Routing: telemetry messages dropped  | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.egress.fallback | Routing: messages delivered to fallback | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.egress.invalid | Routing: telemetry messages incompatible | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.egress.orphaned | Routing: telemetry messages orphaned  | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.egress.success | Routing: telemetry messages delivered | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.ingress.allProtocol | Telemetry message send attempts | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.ingress.sendThrottle | Number of throttling errors | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.telemetry.ingress.success | Telemetry messages sent | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.twin.read.failure | Failed twin reads from devices | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.twin.read.size | Response size of twin reads from devices | Bytes | Average
Yes | Microsoft.Devices/IotHubs | d2c.twin.read.success | Successful twin reads from devices | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.twin.update.failure | Failed twin updates from devices | Count | Total
Yes | Microsoft.Devices/IotHubs | d2c.twin.update.size | Size of twin updates from devices | Bytes | Average
Yes | Microsoft.Devices/IotHubs | d2c.twin.update.success | Successful twin updates from devices | Count | Total
Yes | Microsoft.Devices/IotHubs | dailyMessageQuotaUsed | Total number of messages used | Count | Average
Yes | Microsoft.Devices/IotHubs | deviceDataUsage | Total device data usage | Bytes | Total
Yes | Microsoft.Devices/IotHubs | deviceDataUsageV2 | Total device data usage (preview) | Bytes | Total
Yes | Microsoft.Devices/IotHubs | devices.connectedDevices.allProtocol | Connected devices (deprecated)  | Count | Total
Yes | Microsoft.Devices/IotHubs | devices.totalDevices | Total devices (deprecated) | Count | Total
Yes | Microsoft.Devices/IotHubs | EventGridDeliveries | Event Grid deliveries(preview) | Count | Total
Yes | Microsoft.Devices/IotHubs | EventGridLatency | Event Grid latency (preview) | Milliseconds | Average
Yes | Microsoft.Devices/IotHubs | jobs.cancelJob.failure | Failed job cancellations | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.cancelJob.success | Successful job cancellations | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.completed | Completed jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.createDirectMethodJob.failure | Failed creations of method invocation jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.createDirectMethodJob.success | Successful creations of method invocation jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.createTwinUpdateJob.failure | Failed creations of twin update jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.createTwinUpdateJob.success | Successful creations of twin update jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.failed | Failed jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.listJobs.failure | Failed calls to list jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.listJobs.success | Successful calls to list jobs | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.queryJobs.failure | Failed job queries | Count | Total
Yes | Microsoft.Devices/IotHubs | jobs.queryJobs.success | Successful job queries | Count | Total
No | Microsoft.Devices/IotHubs | totalDeviceCount | Total devices (preview) | Count | Average
Yes | Microsoft.Devices/IotHubs | twinQueries.failure | Failed twin queries | Count | Total
Yes | Microsoft.Devices/IotHubs | twinQueries.resultSize | Twin queries result size | Bytes | Average
Yes | Microsoft.Devices/IotHubs | twinQueries.success | Successful twin queries | Count | Total
Yes | Microsoft.Devices/provisioningServices | AttestationAttempts | Attestation attempts | Count | Total
Yes | Microsoft.Devices/provisioningServices | DeviceAssignments | Devices assigned | Count | Total
Yes | Microsoft.Devices/provisioningServices | RegistrationAttempts | Registration attempts | Count | Total
No | Microsoft.DocumentDB/databaseAccounts | AvailableStorage | Available Storage | Bytes | Total
No | Microsoft.DocumentDB/databaseAccounts | CassandraConnectionClosures | Cassandra Connection Closures | Count | Total
No | Microsoft.DocumentDB/databaseAccounts | CassandraRequestCharges | Cassandra Request Charges | Count | Total
No | Microsoft.DocumentDB/databaseAccounts | CassandraRequests | Cassandra Requests | Count | Count
No | Microsoft.DocumentDB/databaseAccounts | DataUsage | Data Usage | Bytes | Total
Yes | Microsoft.DocumentDB/databaseAccounts | DeleteVirtualNetwork | DeleteVirtualNetwork | Count | Count
No | Microsoft.DocumentDB/databaseAccounts | DocumentCount | Document Count | Count | Total
No | Microsoft.DocumentDB/databaseAccounts | DocumentQuota | Document Quota | Bytes | Total
No | Microsoft.DocumentDB/databaseAccounts | IndexUsage | Index Usage | Bytes | Total
No | Microsoft.DocumentDB/databaseAccounts | MetadataRequests | Metadata Requests | Count | Count
Yes | Microsoft.DocumentDB/databaseAccounts | MongoRequestCharge | Mongo Request Charge | Count | Total
Yes | Microsoft.DocumentDB/databaseAccounts | MongoRequests | Mongo Requests | Count | Count
No | Microsoft.DocumentDB/databaseAccounts | MongoRequestsCount | Mongo Request Rate | CountPerSecond | Average
No | Microsoft.DocumentDB/databaseAccounts | MongoRequestsDelete | Mongo Delete Request Rate | CountPerSecond | Average
No | Microsoft.DocumentDB/databaseAccounts | MongoRequestsInsert | Mongo Insert Request Rate | CountPerSecond | Average
No | Microsoft.DocumentDB/databaseAccounts | MongoRequestsQuery | Mongo Query Request Rate | CountPerSecond | Average
No | Microsoft.DocumentDB/databaseAccounts | MongoRequestsUpdate | Mongo Update Request Rate | CountPerSecond | Average
No | Microsoft.DocumentDB/databaseAccounts | ProvisionedThroughput | Provisioned Throughput | Count | Maximum
Yes | Microsoft.DocumentDB/databaseAccounts | ReplicationLatency | P99 Replication Latency | MilliSeconds | Average
No | Microsoft.DocumentDB/databaseAccounts | ServiceAvailability | Service Availability | Percent | Average
Yes | Microsoft.DocumentDB/databaseAccounts | TotalRequests | Total Requests | Count | Count
Yes | Microsoft.DocumentDB/databaseAccounts | TotalRequestUnits | Total Request Units | Count | Total
No | Microsoft.EnterpriseKnowledgeGraph/services | FailureCount | Failure Count | Count | Count
No | Microsoft.EnterpriseKnowledgeGraph/services | SuccessCount | Success Count | Count | Count
No | Microsoft.EnterpriseKnowledgeGraph/services | SuccessLatency | Success Latency | MilliSeconds | Average
No | Microsoft.EnterpriseKnowledgeGraph/services | TransactionCount | Transaction Count | Count | Count
Yes | Microsoft.EventGrid/domains | DeadLetteredCount | Dead Lettered Events | Count | Total
No | Microsoft.EventGrid/domains | DeliveryAttemptFailCount | Delivery Failed Events | Count | Total
Yes | Microsoft.EventGrid/domains | DeliverySuccessCount | Delivered Events | Count | Total
No | Microsoft.EventGrid/domains | DestinationProcessingDurationInMs | Destination Processing Duration | Milliseconds | Average
Yes | Microsoft.EventGrid/domains | DroppedEventCount | Dropped Events | Count | Total
Yes | Microsoft.EventGrid/domains | MatchedEventCount | Matched Events | Count | Total
Yes | Microsoft.EventGrid/domains | PublishFailCount | Publish Failed Events | Count | Total
Yes | Microsoft.EventGrid/domains | PublishSuccessCount | Published Events | Count | Total
Yes | Microsoft.EventGrid/domains | PublishSuccessLatencyInMs | Publish Success Latency | Count | Total
Yes | Microsoft.EventGrid/eventSubscriptions | DeadLetteredCount | Dead Lettered Events | Count | Total
No | Microsoft.EventGrid/eventSubscriptions | DeliveryAttemptFailCount | Delivery Failed Events | Count | Total
Yes | Microsoft.EventGrid/eventSubscriptions | DeliverySuccessCount | Delivered Events | Count | Total
No | Microsoft.EventGrid/eventSubscriptions | DestinationProcessingDurationInMs | Destination Processing Duration | Milliseconds | Average
Yes | Microsoft.EventGrid/eventSubscriptions | DroppedEventCount | Dropped Events | Count | Total
Yes | Microsoft.EventGrid/eventSubscriptions | MatchedEventCount | Matched Events | Count | Total
Yes | Microsoft.EventGrid/extensionTopics | PublishFailCount | Publish Failed Events | Count | Total
Yes | Microsoft.EventGrid/extensionTopics | PublishSuccessCount | Published Events | Count | Total
Yes | Microsoft.EventGrid/extensionTopics | PublishSuccessLatencyInMs | Publish Success Latency | Count | Total
Yes | Microsoft.EventGrid/extensionTopics | UnmatchedEventCount | Unmatched Events | Count | Total
Yes | Microsoft.EventGrid/topics | PublishFailCount | Publish Failed Events | Count | Total
Yes | Microsoft.EventGrid/topics | PublishSuccessCount | Published Events | Count | Total
Yes | Microsoft.EventGrid/topics | PublishSuccessLatencyInMs | Publish Success Latency | Count | Total
Yes | Microsoft.EventGrid/topics | UnmatchedEventCount | Unmatched Events | Count | Total
No | Microsoft.EventHub/clusters | ActiveConnections | ActiveConnections | Count | Average
No | Microsoft.EventHub/clusters | AvailableMemory | Available Memory | Percent | Maximum
No | Microsoft.EventHub/clusters | CaptureBacklog | Capture Backlog. | Count | Total
No | Microsoft.EventHub/clusters | CapturedBytes | Captured Bytes. | Bytes | Total
No | Microsoft.EventHub/clusters | CapturedMessages | Captured Messages. | Count | Total
No | Microsoft.EventHub/clusters | ConnectionsClosed | Connections Closed. | Count | Average
No | Microsoft.EventHub/clusters | ConnectionsOpened | Connections Opened. | Count | Average
No | Microsoft.EventHub/clusters | CPU | CPU | Percent | Maximum
Yes | Microsoft.EventHub/clusters | IncomingBytes | Incoming Bytes. | Bytes | Total
Yes | Microsoft.EventHub/clusters | IncomingMessages | Incoming Messages | Count | Total
Yes | Microsoft.EventHub/clusters | IncomingRequests | Incoming Requests | Count | Total
Yes | Microsoft.EventHub/clusters | OutgoingBytes | Outgoing Bytes. | Bytes | Total
Yes | Microsoft.EventHub/clusters | OutgoingMessages | Outgoing Messages | Count | Total
No | Microsoft.EventHub/clusters | QuotaExceededErrors | Quota Exceeded Errors. | Count | Total
No | Microsoft.EventHub/clusters | ServerErrors | Server Errors. | Count | Total
No | Microsoft.EventHub/clusters | SuccessfulRequests | Successful Requests | Count | Total
No | Microsoft.EventHub/clusters | ThrottledRequests | Throttled Requests. | Count | Total
No | Microsoft.EventHub/clusters | UserErrors | User Errors. | Count | Total
No | Microsoft.EventHub/namespaces | ActiveConnections | ActiveConnections | Count | Average
No | Microsoft.EventHub/namespaces | CaptureBacklog | Capture Backlog. | Count | Total
No | Microsoft.EventHub/namespaces | CapturedBytes | Captured Bytes. | Bytes | Total
No | Microsoft.EventHub/namespaces | CapturedMessages | Captured Messages. | Count | Total
No | Microsoft.EventHub/namespaces | ConnectionsClosed | Connections Closed. | Count | Average
No | Microsoft.EventHub/namespaces | ConnectionsOpened | Connections Opened. | Count | Average
Yes | Microsoft.EventHub/namespaces | EHABL | Archive backlog messages (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | EHAMBS | Archive message throughput (Deprecated) | Bytes | Total
Yes | Microsoft.EventHub/namespaces | EHAMSGS | Archive messages (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | EHINBYTES | Incoming bytes (Deprecated) | Bytes | Total
Yes | Microsoft.EventHub/namespaces | EHINMBS | Incoming bytes (obsolete) (Deprecated) | Bytes | Total
Yes | Microsoft.EventHub/namespaces | EHINMSGS | Incoming Messages (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | EHOUTBYTES | Outgoing bytes (Deprecated) | Bytes | Total
Yes | Microsoft.EventHub/namespaces | EHOUTMBS | Outgoing bytes (obsolete) (Deprecated) | Bytes | Total
Yes | Microsoft.EventHub/namespaces | EHOUTMSGS | Outgoing Messages (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | FAILREQ | Failed Requests (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | IncomingBytes | Incoming Bytes. | Bytes | Total
Yes | Microsoft.EventHub/namespaces | IncomingMessages | Incoming Messages | Count | Total
Yes | Microsoft.EventHub/namespaces | IncomingRequests | Incoming Requests | Count | Total
Yes | Microsoft.EventHub/namespaces | INMSGS | Incoming Messages (obsolete) (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | INREQS | Incoming Requests (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | INTERR | Internal Server Errors (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | MISCERR | Other Errors (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | OutgoingBytes | Outgoing Bytes. | Bytes | Total
Yes | Microsoft.EventHub/namespaces | OutgoingMessages | Outgoing Messages | Count | Total
Yes | Microsoft.EventHub/namespaces | OUTMSGS | Outgoing Messages (obsolete) (Deprecated) | Count | Total
No | Microsoft.EventHub/namespaces | QuotaExceededErrors | Quota Exceeded Errors. | Count | Total
No | Microsoft.EventHub/namespaces | ServerErrors | Server Errors. | Count | Total
No | Microsoft.EventHub/namespaces | Size | Size | Bytes | Average
No | Microsoft.EventHub/namespaces | SuccessfulRequests | Successful Requests | Count | Total
Yes | Microsoft.EventHub/namespaces | SUCCREQ | Successful Requests (Deprecated) | Count | Total
Yes | Microsoft.EventHub/namespaces | SVRBSY | Server Busy Errors (Deprecated) | Count | Total
No | Microsoft.EventHub/namespaces | ThrottledRequests | Throttled Requests. | Count | Total
No | Microsoft.EventHub/namespaces | UserErrors | User Errors. | Count | Total
Yes | Microsoft.HDInsight/clusters | CategorizedGatewayRequests | Categorized Gateway Requests | Count | Total
Yes | Microsoft.HDInsight/clusters | GatewayRequests | Gateway Requests | Count | Total
Yes | Microsoft.HDInsight/clusters | NumActiveWorkers | Number of Active Workers | Count | Maximum
Yes | Microsoft.HDInsight/clusters | ScalingRequests | Scaling requests | Count | Maximum
Yes | Microsoft.Insights/AutoscaleSettings | MetricThreshold | Metric Threshold | Count | Average
Yes | Microsoft.Insights/AutoscaleSettings | ObservedCapacity | Observed Capacity | Count | Average
Yes | Microsoft.Insights/AutoscaleSettings | ObservedMetricValue | Observed Metric Value | Count | Average
Yes | Microsoft.Insights/AutoscaleSettings | ScaleActionsInitiated | Scale Actions Initiated | Count | Total
Yes | Microsoft.Insights/Components | availabilityResults/availabilityPercentage | Availability | Percent | Average
No | Microsoft.Insights/Components | availabilityResults/count | Availability tests | Count | Count
Yes | Microsoft.Insights/Components | availabilityResults/duration | Availability test duration | MilliSeconds | Average
Yes | Microsoft.Insights/Components | browserTimings/networkDuration | Page load network connect time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | browserTimings/processingDuration | Client processing time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | browserTimings/receiveDuration | Receiving response time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | browserTimings/sendDuration | Send request time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | browserTimings/totalDuration | Browser page load time | MilliSeconds | Average
No | Microsoft.Insights/Components | dependencies/count | Dependency calls | Count | Count
Yes | Microsoft.Insights/Components | dependencies/duration | Dependency duration | MilliSeconds | Average
No | Microsoft.Insights/Components | dependencies/failed | Dependency call failures | Count | Count
No | Microsoft.Insights/Components | exceptions/browser | Browser exceptions | Count | Count
Yes | Microsoft.Insights/Components | exceptions/count | Exceptions | Count | Count
No | Microsoft.Insights/Components | exceptions/server | Server exceptions | Count | Count
Yes | Microsoft.Insights/Components | pageViews/count | Page views | Count | Count
Yes | Microsoft.Insights/Components | pageViews/duration | Page view load time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | performanceCounters/exceptionsPerSecond | Exception rate | CountPerSecond | Average
Yes | Microsoft.Insights/Components | performanceCounters/memoryAvailableBytes | Available memory | Bytes | Average
Yes | Microsoft.Insights/Components | performanceCounters/processCpuPercentage | Process CPU | Percent | Average
Yes | Microsoft.Insights/Components | performanceCounters/processIOBytesPerSecond | Process IO rate | BytesPerSecond | Average
Yes | Microsoft.Insights/Components | performanceCounters/processorCpuPercentage | Processor time | Percent | Average
Yes | Microsoft.Insights/Components | performanceCounters/processPrivateBytes | Process private bytes | Bytes | Average
Yes | Microsoft.Insights/Components | performanceCounters/requestExecutionTime | HTTP request execution time | MilliSeconds | Average
Yes | Microsoft.Insights/Components | performanceCounters/requestsInQueue | HTTP requests in application queue | Count | Average
Yes | Microsoft.Insights/Components | performanceCounters/requestsPerSecond | HTTP request rate | CountPerSecond | Average
No | Microsoft.Insights/Components | requests/count | Server requests | Count | Count
Yes | Microsoft.Insights/Components | requests/duration | Server response time | MilliSeconds | Average
No | Microsoft.Insights/Components | requests/failed | Failed requests | Count | Count
No | Microsoft.Insights/Components | requests/rate | Server request rate | CountPerSecond | Average
Yes | Microsoft.Insights/Components | traces/count | Traces | Count | Count
Yes | Microsoft.KeyVault/vaults | ServiceApiHit | Total Service Api Hits | Count | Count
Yes | Microsoft.KeyVault/vaults | ServiceApiLatency | Overall Service Api Latency | Milliseconds | Average
Yes | Microsoft.KeyVault/vaults | ServiceApiResult | Total Service Api Results | Count | Count
Yes | Microsoft.Kusto/Clusters | CacheUtilization | Cache utilization | Percent | Average
Yes | Microsoft.Kusto/Clusters | ContinuousExportMaxLatenessMinutes | Continuous Export Max Lateness Minutes | Count | Maximum
Yes | Microsoft.Kusto/Clusters | ContinuousExportNumOfRecordsExported | Continuous export - num of exported records | Count | Total
Yes | Microsoft.Kusto/Clusters | ContinuousExportPendingCount | Continuous Export Pending Count | Count | Maximum
Yes | Microsoft.Kusto/Clusters | ContinuousExportResult | Continuous Export Result | Count | Count
Yes | Microsoft.Kusto/Clusters | CPU | CPU | Percent | Average
Yes | Microsoft.Kusto/Clusters | EventsProcessedForEventHubs | Events processed (for Event/IoT Hubs) | Count | Total
Yes | Microsoft.Kusto/Clusters | ExportUtilization | Export Utilization | Percent | Maximum
Yes | Microsoft.Kusto/Clusters | IngestionLatencyInSeconds | Ingestion latency (in seconds) | Seconds | Average
Yes | Microsoft.Kusto/Clusters | IngestionResult | Ingestion result | Count | Count
Yes | Microsoft.Kusto/Clusters | IngestionUtilization | Ingestion utilization | Percent | Average
Yes | Microsoft.Kusto/Clusters | IngestionVolumeInMB | Ingestion volume (in MB) | Count | Total
Yes | Microsoft.Kusto/Clusters | KeepAlive | Keep alive | Count | Average
Yes | Microsoft.Kusto/Clusters | QueryDuration | Query duration | Milliseconds | Average
Yes | Microsoft.Kusto/Clusters | SteamingIngestRequestRate | Streaming Ingest Request Rate | Count | RateRequestsPerSecond
Yes | Microsoft.Kusto/Clusters | StreamingIngestDataRate | Streaming Ingest Data Rate | Count | Average
Yes | Microsoft.Kusto/Clusters | StreamingIngestDuration | Streaming Ingest Duration | Milliseconds | Average
Yes | Microsoft.Kusto/Clusters | StreamingIngestResults | Streaming Ingest Result | Count | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionLatency | Action Latency  | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionsCompleted | Actions Completed  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionsFailed | Actions Failed  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionsSkipped | Actions Skipped  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionsStarted | Actions Started  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionsSucceeded | Actions Succeeded  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionSuccessLatency | Action Success Latency  | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | ActionThrottledEvents | Action Throttled Events | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | IntegrationServiceEnvironmentConnectorMemoryUsage | Connector Memory Usage for Integration Service Environment | Percent | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | IntegrationServiceEnvironmentConnectorProcessorUsage | Connector Processor Usage for Integration Service Environment | Percent | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | IntegrationServiceEnvironmentWorkflowMemoryUsage | Workflow Memory Usage for Integration Service Environment | Percent | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | IntegrationServiceEnvironmentWorkflowProcessorUsage | Workflow Processor Usage for Integration Service Environment | Percent | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | RunFailurePercentage | Run Failure Percentage | Percent | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunLatency | Run Latency | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | RunsCancelled | Runs Canceled | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunsCompleted | Runs Completed | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunsFailed | Runs Failed | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunsStarted | Runs Started | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunsSucceeded | Runs Succeeded | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunStartThrottledEvents | Run Start Throttled Events | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | RunSuccessLatency | Run Success Latency | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | RunThrottledEvents | Run Throttled Events | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggerFireLatency | Trigger Fire Latency  | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggerLatency | Trigger Latency  | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersCompleted | Triggers Completed  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersFailed | Triggers Failed  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersFired | Triggers Fired  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersSkipped | Triggers Skipped | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersStarted | Triggers Started  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggersSucceeded | Triggers Succeeded  | Count | Total
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggerSuccessLatency | Trigger Success Latency  | Seconds | Average
Yes | Microsoft.Logic/integrationServiceEnvironments | TriggerThrottledEvents | Trigger Throttled Events | Count | Total
Yes | Microsoft.Logic/workflows | ActionLatency | Action Latency  | Seconds | Average
Yes | Microsoft.Logic/workflows | ActionsCompleted | Actions Completed  | Count | Total
Yes | Microsoft.Logic/workflows | ActionsFailed | Actions Failed  | Count | Total
Yes | Microsoft.Logic/workflows | ActionsSkipped | Actions Skipped  | Count | Total
Yes | Microsoft.Logic/workflows | ActionsStarted | Actions Started  | Count | Total
Yes | Microsoft.Logic/workflows | ActionsSucceeded | Actions Succeeded  | Count | Total
Yes | Microsoft.Logic/workflows | ActionSuccessLatency | Action Success Latency  | Seconds | Average
Yes | Microsoft.Logic/workflows | ActionThrottledEvents | Action Throttled Events | Count | Total
Yes | Microsoft.Logic/workflows | BillableActionExecutions | Billable Action Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillableTriggerExecutions | Billable Trigger Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageNativeOperation | Billing Usage for Native Operation Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageNativeOperation | Billing Usage for Native Operation Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageStandardConnector | Billing Usage for Standard Connector Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageStandardConnector | Billing Usage for Standard Connector Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageStorageConsumption | Billing Usage for Storage Consumption Executions | Count | Total
Yes | Microsoft.Logic/workflows | BillingUsageStorageConsumption | Billing Usage for Storage Consumption Executions | Count | Total
Yes | Microsoft.Logic/workflows | RunFailurePercentage | Run Failure Percentage | Percent | Total
Yes | Microsoft.Logic/workflows | RunLatency | Run Latency | Seconds | Average
Yes | Microsoft.Logic/workflows | RunsCancelled | Runs Canceled | Count | Total
Yes | Microsoft.Logic/workflows | RunsCompleted | Runs Completed | Count | Total
Yes | Microsoft.Logic/workflows | RunsFailed | Runs Failed | Count | Total
Yes | Microsoft.Logic/workflows | RunsStarted | Runs Started | Count | Total
Yes | Microsoft.Logic/workflows | RunsSucceeded | Runs Succeeded | Count | Total
Yes | Microsoft.Logic/workflows | RunStartThrottledEvents | Run Start Throttled Events | Count | Total
Yes | Microsoft.Logic/workflows | RunSuccessLatency | Run Success Latency | Seconds | Average
Yes | Microsoft.Logic/workflows | RunThrottledEvents | Run Throttled Events | Count | Total
Yes | Microsoft.Logic/workflows | TotalBillableExecutions | Total Billable Executions | Count | Total
Yes | Microsoft.Logic/workflows | TriggerFireLatency | Trigger Fire Latency  | Seconds | Average
Yes | Microsoft.Logic/workflows | TriggerLatency | Trigger Latency  | Seconds | Average
Yes | Microsoft.Logic/workflows | TriggersCompleted | Triggers Completed  | Count | Total
Yes | Microsoft.Logic/workflows | TriggersFailed | Triggers Failed  | Count | Total
Yes | Microsoft.Logic/workflows | TriggersFired | Triggers Fired  | Count | Total
Yes | Microsoft.Logic/workflows | TriggersSkipped | Triggers Skipped | Count | Total
Yes | Microsoft.Logic/workflows | TriggersStarted | Triggers Started  | Count | Total
Yes | Microsoft.Logic/workflows | TriggersSucceeded | Triggers Succeeded  | Count | Total
Yes | Microsoft.Logic/workflows | TriggerSuccessLatency | Trigger Success Latency  | Seconds | Average
Yes | Microsoft.Logic/workflows | TriggerThrottledEvents | Trigger Throttled Events | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Active Cores | Active Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Active Nodes | Active Nodes | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Completed Runs | Completed Runs | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Failed Runs | Failed Runs | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Idle Cores | Idle Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Idle Nodes | Idle Nodes | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Leaving Cores | Leaving Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Leaving Nodes | Leaving Nodes | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Model Deploy Failed | Model Deploy Failed | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Model Deploy Started | Model Deploy Started | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Model Deploy Succeeded | Model Deploy Succeeded | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Model Register Failed | Model Register Failed | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Model Register Succeeded | Model Register Succeeded | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Preempted Cores | Preempted Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Preempted Nodes | Preempted Nodes | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Quota Utilization Percentage | Quota Utilization Percentage | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Started Runs | Started Runs | Count | Total
Yes | Microsoft.MachineLearningServices/workspaces | Total Cores | Total Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Total Nodes | Total Nodes | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Unusable Cores | Unusable Cores | Count | Average
Yes | Microsoft.MachineLearningServices/workspaces | Unusable Nodes | Unusable Nodes | Count | Average
Yes | Microsoft.Maps/accounts | Availability | Availability | Percent | Average
No | Microsoft.Maps/accounts | Usage | Usage | Count | Count
Yes | Microsoft.Media/mediaservices | AssetCount | Asset count | Count | Average
Yes | Microsoft.Media/mediaservices | AssetQuota | Asset quota | Count | Average
Yes | Microsoft.Media/mediaservices | AssetQuotaUsedPercentage | Asset quota used percentage | Percent | Average
Yes | Microsoft.Media/mediaservices | ContentKeyPolicyCount | Content Key Policy count | Count | Average
Yes | Microsoft.Media/mediaservices | ContentKeyPolicyQuota | Content Key Policy quota | Count | Average
Yes | Microsoft.Media/mediaservices | ContentKeyPolicyQuotaUsedPercentage | Content Key Policy quota used percentage | Percent | Average
Yes | Microsoft.Media/mediaservices | StreamingPolicyCount | Streaming Policy count | Count | Average
Yes | Microsoft.Media/mediaservices | StreamingPolicyQuota | Streaming Policy quota | Count | Average
Yes | Microsoft.Media/mediaservices | StreamingPolicyQuotaUsedPercentage | Streaming Policy quota used percentage | Percent | Average
Yes | Microsoft.Media/mediaservices/streamingEndpoints | Egress | Egress | Bytes | Total
Yes | Microsoft.Media/mediaservices/streamingEndpoints | Requests | Requests | Count | Total
Yes | Microsoft.Media/mediaservices/streamingEndpoints | SuccessE2ELatency | Success end to end Latency | Milliseconds | Average
Yes | Microsoft.Microservices4Spring/appClusters | GCPauseTotalCount | GC Pause Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | GCPauseTotalTime | GC Pause Total Time | Milliseconds | Total
Yes | Microsoft.Microservices4Spring/appClusters | MaxOldGenMemoryPoolBytes | Max Available Old Generation Data Size | Bytes | Average
Yes | Microsoft.Microservices4Spring/appClusters | OldGenMemoryPoolBytes | Old Generation Data Size | Bytes | Average
Yes | Microsoft.Microservices4Spring/appClusters | OldGenPromotedBytes | Promote to Old Generation Data Size | Bytes | Maximum
Yes | Microsoft.Microservices4Spring/appClusters | ServiceCpuUsagePercentage | Service CPU Usage Percentage | Percent | Average
Yes | Microsoft.Microservices4Spring/appClusters | ServiceMemoryCommitted | Service Memory Assigned | Bytes | Average
Yes | Microsoft.Microservices4Spring/appClusters | ServiceMemoryMax | Service Memory Max | Bytes | Maximum
Yes | Microsoft.Microservices4Spring/appClusters | ServiceMemoryUsed | Service Memory Used | Bytes | Average
Yes | Microsoft.Microservices4Spring/appClusters | SystemCpuUsagePercentage | System CPU Usage Percentage | Percent | Average
Yes | Microsoft.Microservices4Spring/appClusters | TomcatErrorCount | Tomcat Global Error | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatReceivedBytes | Tomcat Total Received Bytes | Bytes | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatRequestMaxTime | Tomcat Request Max Time | Milliseconds | Maximum
Yes | Microsoft.Microservices4Spring/appClusters | TomcatRequestTotalCount | Tomcat Request Total Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatRequestTotalTime | Tomcat Request Total Times | Milliseconds | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatResponseAvgTime | Tomcat Request Average Time | Milliseconds | Average
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSentBytes | Tomcat Total Sent Bytes | Bytes | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionActiveCurrentCount | Tomcat Session Alive Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionActiveMaxCount | Tomcat Session Max Active Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionAliveMaxTime | Tomcat Session Max Alive Time | Milliseconds | Maximum
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionCreatedCount | Tomcat Session Created Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionExpiredCount | Tomcat Session Expired Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | TomcatSessionRejectedCount | Tomcat Session Rejected Count | Count | Total
Yes | Microsoft.Microservices4Spring/appClusters | YoungGenPromotedBytes | Promote to Young Generation Data Size | Bytes | Maximum
Yes | Microsoft.NetApp/netAppAccounts/capacityPools | VolumePoolAllocatedUsed | Volume pool allocated used | Bytes | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools | VolumePoolTotalLogicalSize | Volume pool total logical size | Bytes | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | AverageReadLatency | Average read latency | MilliSeconds | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | AverageWriteLatency | Average write latency | MilliSeconds | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | ReadIops | Read iops | CountPerSecond | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | VolumeLogicalSize | Volume logical size | Bytes | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | VolumeSnapshotSize | Volume snapshot size | Bytes | Average
Yes | Microsoft.NetApp/netAppAccounts/capacityPools/volumes | WriteIops | Write iops | CountPerSecond | Average
No | Microsoft.Network/applicationGateways | ApplicationGatewayTotalTime | Application Gateway Total Time | MilliSeconds | Average
No | Microsoft.Network/applicationGateways | AvgRequestCountPerHealthyHost | Requests per minute per Healthy Host | Count | Average
No | Microsoft.Network/applicationGateways | BackendConnectTime | Backend Connect Time | MilliSeconds | Average
No | Microsoft.Network/applicationGateways | BackendFirstByteResponseTime | Backend First Byte Response Time | MilliSeconds | Average
No | Microsoft.Network/applicationGateways | BackendLastByteResponseTime | Backend Last Byte Response Time | MilliSeconds | Average
Yes | Microsoft.Network/applicationGateways | BackendResponseStatus | Backend Response Status | Count | Total
Yes | Microsoft.Network/applicationGateways | BlockedCount | Web Application Firewall Blocked Requests Rule Distribution | Count | Total
Yes | Microsoft.Network/applicationGateways | BlockedReqCount | Web Application Firewall Blocked Requests Count | Count | Total
Yes | Microsoft.Network/applicationGateways | BytesReceived | Bytes Received | Bytes | Total
Yes | Microsoft.Network/applicationGateways | BytesSent | Bytes Sent | Bytes | Total
No | Microsoft.Network/applicationGateways | CapacityUnits | Current Capacity Units | Count | Average
No | Microsoft.Network/applicationGateways | ClientRtt | Client RTT | MilliSeconds | Average
No | Microsoft.Network/applicationGateways | ComputeUnits | Current Compute Units | Count | Average
Yes | Microsoft.Network/applicationGateways | CurrentConnections | Current Connections | Count | Total
Yes | Microsoft.Network/applicationGateways | FailedRequests | Failed Requests | Count | Total
Yes | Microsoft.Network/applicationGateways | HealthyHostCount | Healthy Host Count | Count | Average
Yes | Microsoft.Network/applicationGateways | MatchedCount | Web Application Firewall Total Rule Distribution | Count | Total
Yes | Microsoft.Network/applicationGateways | ResponseStatus | Response Status | Count | Total
No | Microsoft.Network/applicationGateways | Throughput | Throughput | BytesPerSecond | Average
Yes | Microsoft.Network/applicationGateways | TlsProtocol | Client TLS Protocol | Count | Total
Yes | Microsoft.Network/applicationGateways | TotalRequests | Total Requests | Count | Total
Yes | Microsoft.Network/applicationGateways | UnhealthyHostCount | Unhealthy Host Count | Count | Average
Yes | Microsoft.Network/azurefirewalls | ApplicationRuleHit | Application rules hit count | Count | Total
Yes | Microsoft.Network/azurefirewalls | DataProcessed | Data processed | Bytes | Total
Yes | Microsoft.Network/azurefirewalls | FirewallHealth | Firewall health state | Percent | Average
Yes | Microsoft.Network/azurefirewalls | NetworkRuleHit | Network rules hit count | Count | Total
Yes | Microsoft.Network/azurefirewalls | SNATPortUtilization | SNAT port utilization | Percent | Average
Yes | Microsoft.Network/connections | BitsInPerSecond | BitsInPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/connections | BitsOutPerSecond | BitsOutPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/dnszones | QueryVolume | Query Volume | Count | Total
No | Microsoft.Network/dnszones | RecordSetCapacityUtilization | Record Set Capacity Utilization | Percent | Maximum
Yes | Microsoft.Network/dnszones | RecordSetCount | Record Set Count | Count | Maximum
Yes | Microsoft.Network/expressRouteCircuits | ArpAvailability | Arp Availability | Percent | Average
Yes | Microsoft.Network/expressRouteCircuits | BgpAvailability | Bgp Availability | Percent | Average
No | Microsoft.Network/expressRouteCircuits | BitsInPerSecond | BitsInPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteCircuits | BitsOutPerSecond | BitsOutPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteCircuits | GlobalReachBitsInPerSecond | GlobalReachBitsInPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteCircuits | GlobalReachBitsOutPerSecond | GlobalReachBitsOutPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteCircuits | QosDropBitsInPerSecond | DroppedInBitsPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteCircuits | QosDropBitsOutPerSecond | DroppedOutBitsPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/expressRouteCircuits/peerings | BitsInPerSecond | BitsInPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/expressRouteCircuits/peerings | BitsOutPerSecond | BitsOutPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteGateways | ErGatewayConnectionBitsInPerSecond | BitsInPerSecond | CountPerSecond | Average
No | Microsoft.Network/expressRouteGateways | ErGatewayConnectionBitsOutPerSecond | BitsOutPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/expressRoutePorts | AdminState | AdminState | Count | Average
Yes | Microsoft.Network/expressRoutePorts | LineProtocol | LineProtocol | Count | Average
Yes | Microsoft.Network/expressRoutePorts | PortBitsInPerSecond | BitsInPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/expressRoutePorts | PortBitsOutPerSecond | BitsOutPerSecond | CountPerSecond | Average
Yes | Microsoft.Network/expressRoutePorts | RxLightLevel | RxLightLevel | Count | Average
Yes | Microsoft.Network/expressRoutePorts | TxLightLevel | TxLightLevel | Count | Average
Yes | Microsoft.Network/frontdoors | BackendHealthPercentage | Backend Health Percentage | Percent | Average
Yes | Microsoft.Network/frontdoors | BackendRequestCount | Backend Request Count | Count | Total
Yes | Microsoft.Network/frontdoors | BackendRequestLatency | Backend Request Latency | MilliSeconds | Average
Yes | Microsoft.Network/frontdoors | BillableResponseSize | Billable Response Size | Bytes | Total
Yes | Microsoft.Network/frontdoors | RequestCount | Request Count | Count | Total
Yes | Microsoft.Network/frontdoors | RequestSize | Request Size | Bytes | Total
Yes | Microsoft.Network/frontdoors | ResponseSize | Response Size | Bytes | Total
Yes | Microsoft.Network/frontdoors | TotalLatency | Total Latency | MilliSeconds | Average
Yes | Microsoft.Network/frontdoors | WebApplicationFirewallRequestCount | Web Application Firewall Request Count | Count | Total
No | Microsoft.Network/loadBalancers | AllocatedSnatPorts | Allocated SNAT Ports (Preview) | Count | Total
Yes | Microsoft.Network/loadBalancers | ByteCount | Byte Count | Count | Total
Yes | Microsoft.Network/loadBalancers | DipAvailability | Health Probe Status | Count | Average
Yes | Microsoft.Network/loadBalancers | PacketCount | Packet Count | Count | Total
Yes | Microsoft.Network/loadBalancers | SnatConnectionCount | SNAT Connection Count | Count | Total
Yes | Microsoft.Network/loadBalancers | SYNCount | SYN Count | Count | Total
No | Microsoft.Network/loadBalancers | UsedSnatPorts | Used SNAT Ports (Preview) | Count | Total
Yes | Microsoft.Network/loadBalancers | VipAvailability | Data Path Availability | Count | Average
Yes | Microsoft.Network/networkInterfaces | BytesReceivedRate | Bytes Received | Bytes | Total
Yes | Microsoft.Network/networkInterfaces | BytesSentRate | Bytes Sent | Bytes | Total
Yes | Microsoft.Network/networkInterfaces | PacketsReceivedRate | Packets Received | Count | Total
Yes | Microsoft.Network/networkInterfaces | PacketsSentRate | Packets Sent | Count | Total
Yes | Microsoft.Network/networkWatchers/connectionMonitors | AverageRoundtripMs | Avg. Round-trip Time (ms) | MilliSeconds | Average
Yes | Microsoft.Network/networkWatchers/connectionMonitors | ChecksFailedPercent | Checks Failed Percent (Preview) | Percent | Average
Yes | Microsoft.Network/networkWatchers/connectionMonitors | ProbesFailedPercent | % Probes Failed | Percent | Average
Yes | Microsoft.Network/networkWatchers/connectionMonitors | RoundTripTimeMs | Round-Trip Time (ms) (Preview) | MilliSeconds | Average
Yes | Microsoft.Network/publicIPAddresses | ByteCount | Byte Count | Count | Total
Yes | Microsoft.Network/publicIPAddresses | BytesDroppedDDoS | Inbound bytes dropped DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | BytesForwardedDDoS | Inbound bytes forwarded DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | BytesInDDoS | Inbound bytes DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | DDoSTriggerSYNPackets | Inbound SYN packets to trigger DDoS mitigation | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | DDoSTriggerTCPPackets | Inbound TCP packets to trigger DDoS mitigation | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | DDoSTriggerUDPPackets | Inbound UDP packets to trigger DDoS mitigation | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | IfUnderDDoSAttack | Under DDoS attack or not | Count | Maximum
Yes | Microsoft.Network/publicIPAddresses | PacketCount | Packet Count | Count | Total
Yes | Microsoft.Network/publicIPAddresses | PacketsDroppedDDoS | Inbound packets dropped DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | PacketsForwardedDDoS | Inbound packets forwarded DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | PacketsInDDoS | Inbound packets DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | SynCount | SYN Count | Count | Total
Yes | Microsoft.Network/publicIPAddresses | TCPBytesDroppedDDoS | Inbound TCP bytes dropped DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | TCPBytesForwardedDDoS | Inbound TCP bytes forwarded DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | TCPBytesInDDoS | Inbound TCP bytes DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | TCPPacketsDroppedDDoS | Inbound TCP packets dropped DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | TCPPacketsForwardedDDoS | Inbound TCP packets forwarded DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | TCPPacketsInDDoS | Inbound TCP packets DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPBytesDroppedDDoS | Inbound UDP bytes dropped DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPBytesForwardedDDoS | Inbound UDP bytes forwarded DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPBytesInDDoS | Inbound UDP bytes DDoS | BytesPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPPacketsDroppedDDoS | Inbound UDP packets dropped DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPPacketsForwardedDDoS | Inbound UDP packets forwarded DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | UDPPacketsInDDoS | Inbound UDP packets DDoS | CountPerSecond | Maximum
Yes | Microsoft.Network/publicIPAddresses | VipAvailability | Data Path Availability | Count | Average
Yes | Microsoft.Network/trafficManagerProfiles | ProbeAgentCurrentEndpointStateByProfileResourceId | Endpoint Status by Endpoint | Count | Maximum
Yes | Microsoft.Network/trafficManagerProfiles | QpsByEndpoint | Queries by Endpoint Returned | Count | Total
Yes | Microsoft.Network/virtualNetworkGateways | AverageBandwidth | Gateway S2S Bandwidth | BytesPerSecond | Average
Yes | Microsoft.Network/virtualNetworkGateways | P2SBandwidth | Gateway P2S Bandwidth | BytesPerSecond | Average
Yes | Microsoft.Network/virtualNetworkGateways | P2SConnectionCount | P2S Connection Count | Count | Maximum
Yes | Microsoft.Network/virtualNetworkGateways | TunnelAverageBandwidth | Tunnel Bandwidth | BytesPerSecond | Average
Yes | Microsoft.Network/virtualNetworkGateways | TunnelEgressBytes | Tunnel Egress Bytes | Bytes | Total
Yes | Microsoft.Network/virtualNetworkGateways | TunnelEgressPacketDropTSMismatch | Tunnel Egress TS Mismatch Packet Drop | Count | Total
Yes | Microsoft.Network/virtualNetworkGateways | TunnelEgressPackets | Tunnel Egress Packets | Count | Total
Yes | Microsoft.Network/virtualNetworkGateways | TunnelIngressBytes | Tunnel Ingress Bytes | Bytes | Total
Yes | Microsoft.Network/virtualNetworkGateways | TunnelIngressPacketDropTSMismatch | Tunnel Ingress TS Mismatch Packet Drop | Count | Total
Yes | Microsoft.Network/virtualNetworkGateways | TunnelIngressPackets | Tunnel Ingress Packets | Count | Total
Yes | Microsoft.Network/virtualNetworks | PingMeshAverageRoundtripMs | Round trip time for Pings to a VM | MilliSeconds | Average
Yes | Microsoft.Network/virtualNetworks | PingMeshProbesFailedPercent | Failed Pings to a VM | Percent | Average
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming | Incoming Messages | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.all.failedrequests | All Incoming Failed Requests | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.all.requests | All Incoming Requests | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.scheduled | Scheduled Push Notifications Sent | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | incoming.scheduled.cancel | Scheduled Push Notifications Cancelled | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.all | Installation Management Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.delete | Delete Installation Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.get | Get Installation Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.patch | Patch Installation Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | installation.upsert | Create or Update Installation Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | notificationhub.pushes | All Outgoing Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.badorexpiredchannel | Bad or Expired Channel Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.channelerror | Channel Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.invalidpayload | Payload Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.pnserror | External Notification System Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.allpns.success | Successful notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.badchannel | APNS Bad Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.expiredchannel | APNS Expired Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.invalidcredentials | APNS Authorization Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.invalidnotificationsize | APNS Invalid Notification Size Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.pnserror | APNS Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.apns.success | APNS Successful Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.authenticationerror | GCM Authentication Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.badchannel | GCM Bad Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.expiredchannel | GCM Expired Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidcredentials | GCM Authorization Errors (Invalid Credentials) | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidnotificationformat | GCM Invalid Notification Format | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.invalidnotificationsize | GCM Invalid Notification Size Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.pnserror | GCM Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.success | GCM Successful Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.throttled | GCM Throttled Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.gcm.wrongchannel | GCM Wrong Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.authenticationerror | MPNS Authentication Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.badchannel | MPNS Bad Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.channeldisconnected | MPNS Channel Disconnected | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.dropped | MPNS Dropped Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.invalidcredentials | MPNS Invalid Credentials | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.invalidnotificationformat | MPNS Invalid Notification Format | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.pnserror | MPNS Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.success | MPNS Successful Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.mpns.throttled | MPNS Throttled Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.authenticationerror | WNS Authentication Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.badchannel | WNS Bad Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.channeldisconnected | WNS Channel Disconnected | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.channelthrottled | WNS Channel Throttled | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.dropped | WNS Dropped Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.expiredchannel | WNS Expired Channel Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidcredentials | WNS Authorization Errors (Invalid Credentials) | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidnotificationformat | WNS Invalid Notification Format | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidnotificationsize | WNS Invalid Notification Size Error | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.invalidtoken | WNS Authorization Errors (Invalid Token) | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.pnserror | WNS Errors | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.success | WNS Successful Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.throttled | WNS Throttled Notifications | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.tokenproviderunreachable | WNS Authorization Errors (Unreachable) | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | outgoing.wns.wrongtoken | WNS Authorization Errors (Wrong Token) | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.all | Registration Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.create | Registration Create Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.delete | Registration Delete Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.get | Registration Read Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | registration.update | Registration Update Operations | Count | Total
Yes | Microsoft.NotificationHubs/Namespaces/NotificationHubs | scheduled.pending | Pending Scheduled Notifications | Count | Total
Yes | Microsoft.OperationalInsights/workspaces | Average_% Available Memory | % Available Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Available Swap Space | % Available Swap Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Committed Bytes In Use | % Committed Bytes In Use | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% DPC Time | % DPC Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Free Inodes | % Free Inodes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Free Space | % Free Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Free Space | % Free Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Idle Time | % Idle Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Interrupt Time | % Interrupt Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% IO Wait Time | % IO Wait Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Nice Time | % Nice Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Privileged Time | % Privileged Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Processor Time | % Processor Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Processor Time | % Processor Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Used Inodes | % Used Inodes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Used Memory | % Used Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Used Space | % Used Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% Used Swap Space | % Used Swap Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_% User Time | % User Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Available MBytes | Available MBytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Available MBytes Memory | Available MBytes Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Available MBytes Swap | Available MBytes Swap | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Avg. Disk sec/Read | Avg. Disk sec/Read | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Avg. Disk sec/Read | Avg. Disk sec/Read | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Avg. Disk sec/Transfer | Avg. Disk sec/Transfer | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Avg. Disk sec/Write | Avg. Disk sec/Write | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Avg. Disk sec/Write | Avg. Disk sec/Write | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Bytes Received/sec | Bytes Received/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Bytes Sent/sec | Bytes Sent/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Bytes Total/sec | Bytes Total/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Current Disk Queue Length | Current Disk Queue Length | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Read Bytes/sec | Disk Read Bytes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Reads/sec | Disk Reads/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Reads/sec | Disk Reads/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Transfers/sec | Disk Transfers/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Transfers/sec | Disk Transfers/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Write Bytes/sec | Disk Write Bytes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Writes/sec | Disk Writes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Disk Writes/sec | Disk Writes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Free Megabytes | Free Megabytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Free Megabytes | Free Megabytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Free Physical Memory | Free Physical Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Free Space in Paging Files | Free Space in Paging Files | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Free Virtual Memory | Free Virtual Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Logical Disk Bytes/sec | Logical Disk Bytes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Page Reads/sec | Page Reads/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Page Writes/sec | Page Writes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Pages/sec | Pages/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Pct Privileged Time | Pct Privileged Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Pct User Time | Pct User Time | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Physical Disk Bytes/sec | Physical Disk Bytes/sec | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Processes | Processes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Processor Queue Length | Processor Queue Length | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Size Stored In Paging Files | Size Stored In Paging Files | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Bytes | Total Bytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Bytes Received | Total Bytes Received | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Bytes Transmitted | Total Bytes Transmitted | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Collisions | Total Collisions | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Packets Received | Total Packets Received | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Packets Transmitted | Total Packets Transmitted | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Rx Errors | Total Rx Errors | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Total Tx Errors | Total Tx Errors | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Uptime | Uptime | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Used MBytes Swap Space | Used MBytes Swap Space | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Used Memory kBytes | Used Memory kBytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Used Memory MBytes | Used Memory MBytes | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Users | Users | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Average_Virtual Shared Memory | Virtual Shared Memory | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Event | Event | Count | Average
Yes | Microsoft.OperationalInsights/workspaces | Heartbeat | Heartbeat | Count | Total
Yes | Microsoft.OperationalInsights/workspaces | Update | Update | Count | Average
Yes | Microsoft.PowerBIDedicated/capacities | memory_metric | Memory | Bytes | Average
Yes | Microsoft.PowerBIDedicated/capacities | memory_thrashing_metric | Memory Thrashing (Datasets) | Percent | Average
Yes | Microsoft.PowerBIDedicated/capacities | qpu_high_utilization_metric | QPU High Utilization | Count | Total
Yes | Microsoft.PowerBIDedicated/capacities | QueryDuration | Query Duration (Datasets) | Milliseconds | Average
Yes | Microsoft.PowerBIDedicated/capacities | QueryPoolJobQueueLength | Query Pool Job Queue Length (Datasets) | Count | Average
No | Microsoft.Relay/namespaces | ActiveConnections | ActiveConnections | Count | Total
No | Microsoft.Relay/namespaces | ActiveListeners | ActiveListeners | Count | Total
Yes | Microsoft.Relay/namespaces | BytesTransferred | BytesTransferred | Count | Total
No | Microsoft.Relay/namespaces | ListenerConnections-ClientError | ListenerConnections-ClientError | Count | Total
No | Microsoft.Relay/namespaces | ListenerConnections-ServerError | ListenerConnections-ServerError | Count | Total
No | Microsoft.Relay/namespaces | ListenerConnections-Success | ListenerConnections-Success | Count | Total
No | Microsoft.Relay/namespaces | ListenerConnections-TotalRequests | ListenerConnections-TotalRequests | Count | Total
No | Microsoft.Relay/namespaces | ListenerDisconnects | ListenerDisconnects | Count | Total
No | Microsoft.Relay/namespaces | SenderConnections-ClientError | SenderConnections-ClientError | Count | Total
No | Microsoft.Relay/namespaces | SenderConnections-ServerError | SenderConnections-ServerError | Count | Total
No | Microsoft.Relay/namespaces | SenderConnections-Success | SenderConnections-Success | Count | Total
No | Microsoft.Relay/namespaces | SenderConnections-TotalRequests | SenderConnections-TotalRequests | Count | Total
No | Microsoft.Relay/namespaces | SenderDisconnects | SenderDisconnects | Count | Total
Yes | Microsoft.Search/searchServices | SearchLatency | Search Latency | Seconds | Average
Yes | Microsoft.Search/searchServices | SearchQueriesPerSecond | Search queries per second | CountPerSecond | Average
Yes | Microsoft.Search/searchServices | ThrottledSearchQueriesPercentage | Throttled search queries percentage | Percent | Average
No | Microsoft.ServiceBus/namespaces | ActiveConnections | ActiveConnections | Count | Total
No | Microsoft.ServiceBus/namespaces | ActiveMessages | Count of active messages in a Queue/Topic. | Count | Average
No | Microsoft.ServiceBus/namespaces | ConnectionsClosed | Connections Closed. | Count | Average
No | Microsoft.ServiceBus/namespaces | ConnectionsOpened | Connections Opened. | Count | Average
No | Microsoft.ServiceBus/namespaces | CPUXNS | CPU (Deprecated) | Percent | Maximum
No | Microsoft.ServiceBus/namespaces | DeadletteredMessages | Count of dead-lettered messages in a Queue/Topic. | Count | Average
Yes | Microsoft.ServiceBus/namespaces | IncomingMessages | Incoming Messages | Count | Total
Yes | Microsoft.ServiceBus/namespaces | IncomingRequests | Incoming Requests | Count | Total
No | Microsoft.ServiceBus/namespaces | Messages | Count of messages in a Queue/Topic. | Count | Average
No | Microsoft.ServiceBus/namespaces | NamespaceCpuUsage | CPU | Percent | Maximum
No | Microsoft.ServiceBus/namespaces | NamespaceMemoryUsage | Memory Usage | Percent | Maximum
Yes | Microsoft.ServiceBus/namespaces | OutgoingMessages | Outgoing Messages | Count | Total
No | Microsoft.ServiceBus/namespaces | ScheduledMessages | Count of scheduled messages in a Queue/Topic. | Count | Average
No | Microsoft.ServiceBus/namespaces | ServerErrors | Server Errors. | Count | Total
No | Microsoft.ServiceBus/namespaces | Size | Size | Bytes | Average
No | Microsoft.ServiceBus/namespaces | SuccessfulRequests | Successful Requests | Count | Total
No | Microsoft.ServiceBus/namespaces | ThrottledRequests | Throttled Requests. | Count | Total
No | Microsoft.ServiceBus/namespaces | UserErrors | User Errors. | Count | Total
No | Microsoft.ServiceBus/namespaces | WSXNS | Memory Usage (Deprecated) | Percent | Maximum
No | Microsoft.ServiceFabricMesh/applications | ActualCpu | ActualCpu | Count | Average
No | Microsoft.ServiceFabricMesh/applications | ActualMemory | ActualMemory | Bytes | Average
No | Microsoft.ServiceFabricMesh/applications | AllocatedCpu | AllocatedCpu | Count | Average
No | Microsoft.ServiceFabricMesh/applications | AllocatedMemory | AllocatedMemory | Bytes | Average
No | Microsoft.ServiceFabricMesh/applications | ApplicationStatus | ApplicationStatus | Count | Average
No | Microsoft.ServiceFabricMesh/applications | ContainerStatus | ContainerStatus | Count | Average
No | Microsoft.ServiceFabricMesh/applications | CpuUtilization | CpuUtilization | Percent | Average
No | Microsoft.ServiceFabricMesh/applications | MemoryUtilization | MemoryUtilization | Percent | Average
No | Microsoft.ServiceFabricMesh/applications | RestartCount | RestartCount | Count | Average
No | Microsoft.ServiceFabricMesh/applications | ServiceReplicaStatus | ServiceReplicaStatus | Count | Average
No | Microsoft.ServiceFabricMesh/applications | ServiceStatus | ServiceStatus | Count | Average
Yes | Microsoft.SignalRService/SignalR | ConnectionCount | Connection Count | Count | Maximum
Yes | Microsoft.SignalRService/SignalR | InboundTraffic | Inbound Traffic | Bytes | Total
Yes | Microsoft.SignalRService/SignalR | MessageCount | Message Count | Count | Total
Yes | Microsoft.SignalRService/SignalR | OutboundTraffic | Outbound Traffic | Bytes | Total
Yes | Microsoft.SignalRService/SignalR | SystemErrors | System Errors | Percent | Maximum
Yes | Microsoft.SignalRService/SignalR | UserErrors | User Errors | Percent | Maximum
Yes | Microsoft.Sql/managedInstances | avg_cpu_percent | Average CPU percentage | Percent | Average
Yes | Microsoft.Sql/managedInstances | io_bytes_read | IO bytes read | Bytes | Average
Yes | Microsoft.Sql/managedInstances | io_bytes_written | IO bytes written | Bytes | Average
Yes | Microsoft.Sql/managedInstances | io_requests | IO requests count | Count | Average
Yes | Microsoft.Sql/managedInstances | reserved_storage_mb | Storage space reserved | Count | Average
Yes | Microsoft.Sql/managedInstances | storage_space_used_mb | Storage space used | Count | Average
Yes | Microsoft.Sql/managedInstances | virtual_core_count | Virtual core count | Count | Average
No | Microsoft.Sql/servers | database_dtu_consumption_percent | DTU percentage | Percent | Average
No | Microsoft.Sql/servers | database_storage_used | Data space used | Bytes | Average
Yes | Microsoft.Sql/servers | dtu_consumption_percent | DTU percentage | Percent | Average
Yes | Microsoft.Sql/servers | dtu_used | DTU used | Count | Average
Yes | Microsoft.Sql/servers | storage_used | Data space used | Bytes | Average
Yes | Microsoft.Sql/servers/databases | allocated_data_storage | Data space allocated | Bytes | Average
Yes | Microsoft.Sql/servers/databases | app_cpu_billed | App CPU billed | Count | Total
Yes | Microsoft.Sql/servers/databases | app_cpu_percent | App CPU percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | app_memory_percent | App memory percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | blocked_by_firewall | Blocked by Firewall | Count | Total
Yes | Microsoft.Sql/servers/databases | cache_hit_percent | Cache hit percentage | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | cache_used_percent | Cache used percentage | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | connection_failed | Failed Connections | Count | Total
Yes | Microsoft.Sql/servers/databases | connection_successful | Successful Connections | Count | Total
Yes | Microsoft.Sql/servers/databases | cpu_limit | CPU limit | Count | Average
Yes | Microsoft.Sql/servers/databases | cpu_percent | CPU percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | cpu_used | CPU used | Count | Average
Yes | Microsoft.Sql/servers/databases | deadlock | Deadlocks | Count | Total
Yes | Microsoft.Sql/servers/databases | dtu_consumption_percent | DTU percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | dtu_limit | DTU Limit | Count | Average
Yes | Microsoft.Sql/servers/databases | dtu_used | DTU used | Count | Average
Yes | Microsoft.Sql/servers/databases | dwu_consumption_percent | DWU percentage | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | dwu_limit | DWU limit | Count | Maximum
Yes | Microsoft.Sql/servers/databases | dwu_used | DWU used | Count | Maximum
Yes | Microsoft.Sql/servers/databases | local_tempdb_usage_percent | Local tempdb percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | log_write_percent | Log IO percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | memory_usage_percent | Memory percentage | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | physical_data_read_percent | Data IO percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | sessions_percent | Sessions percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | storage | Data space used | Bytes | Maximum
Yes | Microsoft.Sql/servers/databases | storage_percent | Data space used percent | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | tempdb_data_size | Tempdb Data File Size Kilobytes | Count | Maximum
Yes | Microsoft.Sql/servers/databases | tempdb_log_size | Tempdb Log File Size Kilobytes | Count | Maximum
Yes | Microsoft.Sql/servers/databases | tempdb_log_used_percent | Tempdb Percent Log Used | Percent | Maximum
Yes | Microsoft.Sql/servers/databases | workers_percent | Workers percentage | Percent | Average
Yes | Microsoft.Sql/servers/databases | xtp_storage_percent | In-Memory OLTP storage percent | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | allocated_data_storage | Data space allocated | Bytes | Average
Yes | Microsoft.Sql/servers/elasticPools | allocated_data_storage_percent | Data space allocated percent | Percent | Maximum
Yes | Microsoft.Sql/servers/elasticPools | cpu_limit | CPU limit | Count | Average
Yes | Microsoft.Sql/servers/elasticPools | cpu_percent | CPU percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | cpu_used | CPU used | Count | Average
No | Microsoft.Sql/servers/elasticPools | database_allocated_data_storage | Data space allocated | Bytes | Average
No | Microsoft.Sql/servers/elasticPools | database_cpu_limit | CPU limit | Count | Average
No | Microsoft.Sql/servers/elasticPools | database_cpu_percent | CPU percentage | Percent | Average
No | Microsoft.Sql/servers/elasticPools | database_cpu_used | CPU used | Count | Average
No | Microsoft.Sql/servers/elasticPools | database_dtu_consumption_percent | DTU percentage | Percent | Average
No | Microsoft.Sql/servers/elasticPools | database_eDTU_used | eDTU used | Count | Average
No | Microsoft.Sql/servers/elasticPools | database_log_write_percent | Log IO percentage | Percent | Average
No | Microsoft.Sql/servers/elasticPools | database_physical_data_read_percent | Data IO percentage | Percent | Average
No | Microsoft.Sql/servers/elasticPools | database_sessions_percent | Sessions percentage | Percent | Average
No | Microsoft.Sql/servers/elasticPools | database_storage_used | Data space used | Bytes | Average
No | Microsoft.Sql/servers/elasticPools | database_workers_percent | Workers percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | dtu_consumption_percent | DTU percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | eDTU_limit | eDTU limit | Count | Average
Yes | Microsoft.Sql/servers/elasticPools | eDTU_used | eDTU used | Count | Average
Yes | Microsoft.Sql/servers/elasticPools | log_write_percent | Log IO percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | physical_data_read_percent | Data IO percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | sessions_percent | Sessions percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | storage_limit | Data max size | Bytes | Average
Yes | Microsoft.Sql/servers/elasticPools | storage_percent | Data space used percent | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | storage_used | Data space used | Bytes | Average
Yes | Microsoft.Sql/servers/elasticPools | tempdb_data_size | Tempdb Data File Size Kilobytes | Count | Maximum
Yes | Microsoft.Sql/servers/elasticPools | tempdb_log_size | Tempdb Log File Size Kilobytes | Count | Maximum
Yes | Microsoft.Sql/servers/elasticPools | tempdb_log_used_percent | Tempdb Percent Log Used | Percent | Maximum
Yes | Microsoft.Sql/servers/elasticPools | workers_percent | Workers percentage | Percent | Average
Yes | Microsoft.Sql/servers/elasticPools | xtp_storage_percent | In-Memory OLTP storage percent | Percent | Average
Yes | Microsoft.Storage/storageAccounts | Availability | Availability | Percent | Average
Yes | Microsoft.Storage/storageAccounts | Egress | Egress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts | Ingress | Ingress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts | Transactions | Transactions | Count | Total
No | Microsoft.Storage/storageAccounts | UsedCapacity | Used capacity | Bytes | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | Availability | Availability | Percent | Average
No | Microsoft.Storage/storageAccounts/blobServices | BlobCapacity | Blob Capacity | Bytes | Average
No | Microsoft.Storage/storageAccounts/blobServices | BlobCount | Blob Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | ContainerCount | Blob Container Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | Egress | Egress | Bytes | Total
No | Microsoft.Storage/storageAccounts/blobServices | IndexCapacity | Index Capacity | Bytes | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/blobServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/blobServices | Transactions | Transactions | Count | Total
Yes | Microsoft.Storage/storageAccounts/fileServices | Availability | Availability | Percent | Average
Yes | Microsoft.Storage/storageAccounts/fileServices | Egress | Egress | Bytes | Total
No | Microsoft.Storage/storageAccounts/fileServices | FileCapacity | File Capacity | Bytes | Average
No | Microsoft.Storage/storageAccounts/fileServices | FileCount | File Count | Count | Average
No | Microsoft.Storage/storageAccounts/fileServices | FileShareCount | File Share Count | Count | Average
No | Microsoft.Storage/storageAccounts/fileServices | FileShareQuota | File share quota size | Bytes | Average
No | Microsoft.Storage/storageAccounts/fileServices | FileShareSnapshotCount | File share snapshot count | Count | Average
No | Microsoft.Storage/storageAccounts/fileServices | FileShareSnapshotSize | File share snapshot size | Bytes | Average
Yes | Microsoft.Storage/storageAccounts/fileServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/fileServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/fileServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/fileServices | Transactions | Transactions | Count | Total
Yes | Microsoft.Storage/storageAccounts/queueServices | Availability | Availability | Percent | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | Egress | Egress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/queueServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/queueServices | QueueCapacity | Queue Capacity | Bytes | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | QueueCount | Queue Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | QueueMessageCount | Queue Message Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/queueServices | Transactions | Transactions | Count | Total
Yes | Microsoft.Storage/storageAccounts/tableServices | Availability | Availability | Percent | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | Egress | Egress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/tableServices | Ingress | Ingress | Bytes | Total
Yes | Microsoft.Storage/storageAccounts/tableServices | SuccessE2ELatency | Success E2E Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | SuccessServerLatency | Success Server Latency | Milliseconds | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | TableCapacity | Table Capacity | Bytes | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | TableCount | Table Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | TableEntityCount | Table Entity Count | Count | Average
Yes | Microsoft.Storage/storageAccounts/tableServices | Transactions | Transactions | Count | Total
Yes | Microsoft.StorageCache/caches | ClientIOPS | Total Client IOPS | Count | Average
Yes | Microsoft.StorageCache/caches | ClientLatency | Average Client Latency | Milliseconds | Average
Yes | Microsoft.StorageCache/caches | ClientLockIOPS | Client Lock IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientMetadataReadIOPS | Client Metadata Read IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientMetadataWriteIOPS | Client Metadata Write IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientReadIOPS | Client Read IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientReadThroughput | Average Cache Read Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientWriteIOPS | Client Write IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | ClientWriteThroughput | Average Cache Write Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetAsyncWriteThroughput | StorageTarget Asynchronous Write Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetFillThroughput | StorageTarget Fill Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetHealth | Storage Target Health | Count | Average
Yes | Microsoft.StorageCache/caches | StorageTargetIOPS | Total StorageTarget IOPS | Count | Average
Yes | Microsoft.StorageCache/caches | StorageTargetLatency | StorageTarget Latency | Milliseconds | Average
Yes | Microsoft.StorageCache/caches | StorageTargetMetadataReadIOPS | StorageTarget Metadata Read IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetMetadataWriteIOPS | StorageTarget Metadata Write IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetReadAheadThroughput | StorageTarget Read Ahead Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetReadIOPS | StorageTarget Read IOPS | CountPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetSyncWriteThroughput | StorageTarget Synchronous Write Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetTotalReadThroughput | StorageTarget Total Read Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetTotalWriteThroughput | StorageTarget Total Write Throughput | BytesPerSecond | Average
Yes | Microsoft.StorageCache/caches | StorageTargetWriteIOPS | StorageTarget Write IOPS | Count | Average
Yes | Microsoft.StorageCache/caches | Uptime | Uptime | Count | Average
Yes | microsoft.storagesync/storageSyncServices | ServerSyncSessionResult | Sync Session Result | Count | Average
Yes | microsoft.storagesync/storageSyncServices | StorageSyncBatchTransferredFileBytes | Bytes synced | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices | StorageSyncRecalledNetworkBytesByApplication | Cloud tiering recall size by application | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices | StorageSyncRecalledTotalNetworkBytes | Cloud tiering recall size | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices | StorageSyncRecallIOTotalSizeBytes | Cloud tiering recall | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices | StorageSyncRecallThroughputBytesPerSecond | Cloud tiering recall throughput | BytesPerSecond | Average
Yes | microsoft.storagesync/storageSyncServices | StorageSyncServerHeartbeat | Server Online Status | Count | Maximum
Yes | microsoft.storagesync/storageSyncServices | StorageSyncSyncSessionAppliedFilesCount | Files Synced | Count | Total
Yes | microsoft.storagesync/storageSyncServices | StorageSyncSyncSessionPerItemErrorsCount | Files not syncing | Count | Total
Yes | microsoft.storagesync/storageSyncServices/registeredServers | ServerHeartbeat | Server Online Status | Count | Maximum
Yes | microsoft.storagesync/storageSyncServices/registeredServers | ServerRecallIOTotalSizeBytes | Cloud tiering recall | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups | SyncGroupBatchTransferredFileBytes | Bytes synced | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups | SyncGroupSyncSessionAppliedFilesCount | Files Synced | Count | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups | SyncGroupSyncSessionPerItemErrorsCount | Files not syncing | Count | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints | ServerEndpointBatchTransferredFileBytes | Bytes synced | Bytes | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints | ServerEndpointSyncSessionAppliedFilesCount | Files Synced | Count | Total
Yes | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints | ServerEndpointSyncSessionPerItemErrorsCount | Files not syncing | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | AMLCalloutFailedRequests | Failed Function Requests | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | AMLCalloutInputEvents | Function Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | AMLCalloutRequests | Function Requests | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | ConversionErrors | Data Conversion Errors | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | DeserializationError | Input Deserialization Errors | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | DroppedOrAdjustedEvents | Out of order Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | EarlyInputEvents | Early Input Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | Errors | Runtime Errors | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | InputEventBytes | Input Event Bytes | Bytes | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | InputEvents | Input Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | InputEventsSourcesBacklogged | Backlogged Input Events | Count | Maximum
Yes | Microsoft.StreamAnalytics/streamingjobs | InputEventsSourcesPerSecond | Input Sources Received | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | LateInputEvents | Late Input Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | OutputEvents | Output Events | Count | Total
Yes | Microsoft.StreamAnalytics/streamingjobs | OutputWatermarkDelaySeconds | Watermark Delay | Seconds | Maximum
Yes | Microsoft.StreamAnalytics/streamingjobs | ResourceUtilization | SU % Utilization | Percent | Maximum
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Disk Read Bytes | Disk Read Bytes | Bytes | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Disk Read Operations/Sec | Disk Read Operations/Sec | CountPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Disk Write Bytes | Disk Write Bytes | Bytes | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Disk Write Operations/Sec | Disk Write Operations/Sec | CountPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskReadBytesPerSecond | Disk Read Bytes/Sec | BytesPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskReadLatency | Disk Read Latency | Milliseconds | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskReadOperations | Disk Read Operations | Count | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskWriteBytesPerSecond | Disk Write Bytes/Sec | BytesPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskWriteLatency | Disk Write Latency | Milliseconds | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | DiskWriteOperations | Disk Write Operations | Count | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | MemoryActive | Memory Active | Bytes | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | MemoryGranted | Memory Granted | Bytes | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | MemoryUsed | Memory Used | Bytes | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Network In | Network In | Bytes | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Network Out | Network Out | Bytes | Total
Yes | Microsoft.VMwareCloudSimple/virtualMachines | NetworkInBytesPerSecond | Network In Bytes/Sec | BytesPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | NetworkOutBytesPerSecond | Network Out Bytes/Sec | BytesPerSecond | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | Percentage CPU | Percentage CPU | Percent | Average
Yes | Microsoft.VMwareCloudSimple/virtualMachines | PercentageCpuReady | Percentage CPU Ready | Milliseconds | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | ActiveRequests | Active Requests | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | AverageResponseTime | Average Response Time | Seconds | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | BytesReceived | Data In | Bytes | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | BytesSent | Data Out | Bytes | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | CpuPercentage | CPU Percentage | Percent | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | DiskQueueLength | Disk Queue Length | Count | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http101 | Http 101 | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http2xx | Http 2xx | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http3xx | Http 3xx | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http401 | Http 401 | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http403 | Http 403 | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http404 | Http 404 | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http406 | Http 406 | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http4xx | Http 4xx | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Http5xx | Http Server Errors | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | HttpQueueLength | Http Queue Length | Count | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | LargeAppServicePlanInstances | Large App Service Plan Workers | Count | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | MediumAppServicePlanInstances | Medium App Service Plan Workers | Count | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | MemoryPercentage | Memory Percentage | Percent | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | Requests | Requests | Count | Total
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | SmallAppServicePlanInstances | Small App Service Plan Workers | Count | Average
Yes | Microsoft.Web/hostingEnvironments/multiRolePools | TotalFrontEnds | Total Front Ends | Count | Average
Yes | Microsoft.Web/hostingEnvironments/workerPools | CpuPercentage | CPU Percentage | Percent | Average
Yes | Microsoft.Web/hostingEnvironments/workerPools | MemoryPercentage | Memory Percentage | Percent | Average
Yes | Microsoft.Web/hostingEnvironments/workerPools | WorkersAvailable | Available Workers | Count | Average
Yes | Microsoft.Web/hostingEnvironments/workerPools | WorkersTotal | Total Workers | Count | Average
Yes | Microsoft.Web/hostingEnvironments/workerPools | WorkersUsed | Used Workers | Count | Average
Yes | Microsoft.Web/serverfarms | BytesReceived | Data In | Bytes | Total
Yes | Microsoft.Web/serverfarms | BytesSent | Data Out | Bytes | Total
Yes | Microsoft.Web/serverfarms | CpuPercentage | CPU Percentage | Percent | Average
Yes | Microsoft.Web/serverfarms | DiskQueueLength | Disk Queue Length | Count | Average
Yes | Microsoft.Web/serverfarms | HttpQueueLength | Http Queue Length | Count | Average
Yes | Microsoft.Web/serverfarms | MemoryPercentage | Memory Percentage | Percent | Average
Yes | Microsoft.Web/serverfarms | TcpCloseWait | TCP Close Wait | Count | Average
Yes | Microsoft.Web/serverfarms | TcpClosing | TCP Closing | Count | Average
Yes | Microsoft.Web/serverfarms | TcpEstablished | TCP Established | Count | Average
Yes | Microsoft.Web/serverfarms | TcpFinWait1 | TCP Fin Wait 1 | Count | Average
Yes | Microsoft.Web/serverfarms | TcpFinWait2 | TCP Fin Wait 2 | Count | Average
Yes | Microsoft.Web/serverfarms | TcpLastAck | TCP Last Ack | Count | Average
Yes | Microsoft.Web/serverfarms | TcpSynReceived | TCP Syn Received | Count | Average
Yes | Microsoft.Web/serverfarms | TcpSynSent | TCP Syn Sent | Count | Average
Yes | Microsoft.Web/serverfarms | TcpTimeWait | TCP Time Wait | Count | Average
Yes | Microsoft.Web/sites | AppConnections | Connections | Count | Average
Yes | Microsoft.Web/sites | AverageMemoryWorkingSet | Average memory working set | Bytes | Average
Yes | Microsoft.Web/sites | AverageResponseTime | Average Response Time | Seconds | Average
Yes | Microsoft.Web/sites | BytesReceived | Data In | Bytes | Total
Yes | Microsoft.Web/sites | BytesSent | Data Out | Bytes | Total
Yes | Microsoft.Web/sites | CpuTime | CPU Time | Seconds | Total
Yes | Microsoft.Web/sites | CurrentAssemblies | Current Assemblies | Count | Average
Yes | Microsoft.Web/sites | FunctionExecutionCount | Function Execution Count | Count | Total
Yes | Microsoft.Web/sites | FunctionExecutionUnits | Function Execution Units | Count | Total
Yes | Microsoft.Web/sites | Gen0Collections | Gen 0 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites | Gen1Collections | Gen 1 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites | Gen2Collections | Gen 2 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites | Handles | Handle Count | Count | Average
Yes | Microsoft.Web/sites | HealthCheckStatus | Health check status | Count | Average
Yes | Microsoft.Web/sites | Http101 | Http 101 | Count | Total
Yes | Microsoft.Web/sites | Http2xx | Http 2xx | Count | Total
Yes | Microsoft.Web/sites | Http3xx | Http 3xx | Count | Total
Yes | Microsoft.Web/sites | Http401 | Http 401 | Count | Total
Yes | Microsoft.Web/sites | Http403 | Http 403 | Count | Total
Yes | Microsoft.Web/sites | Http404 | Http 404 | Count | Total
Yes | Microsoft.Web/sites | Http406 | Http 406 | Count | Total
Yes | Microsoft.Web/sites | Http4xx | Http 4xx | Count | Total
Yes | Microsoft.Web/sites | Http5xx | Http Server Errors | Count | Total
Yes | Microsoft.Web/sites | HttpResponseTime | Response Time | Seconds | Average
Yes | Microsoft.Web/sites | IoOtherBytesPerSecond | IO Other Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | IoOtherOperationsPerSecond | IO Other Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | IoReadBytesPerSecond | IO Read Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | IoReadOperationsPerSecond | IO Read Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | IoWriteBytesPerSecond | IO Write Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | IoWriteOperationsPerSecond | IO Write Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites | MemoryWorkingSet | Memory working set | Bytes | Average
Yes | Microsoft.Web/sites | PrivateBytes | Private Bytes | Bytes | Average
Yes | Microsoft.Web/sites | Requests | Requests | Count | Total
Yes | Microsoft.Web/sites | RequestsInApplicationQueue | Requests In Application Queue | Count | Average
Yes | Microsoft.Web/sites | Threads | Thread Count | Count | Average
Yes | Microsoft.Web/sites | TotalAppDomains | Total App Domains | Count | Average
Yes | Microsoft.Web/sites | TotalAppDomainsUnloaded | Total App Domains Unloaded | Count | Average
Yes | Microsoft.Web/sites/slots | AppConnections | Connections | Count | Average
Yes | Microsoft.Web/sites/slots | AverageMemoryWorkingSet | Average memory working set | Bytes | Average
Yes | Microsoft.Web/sites/slots | AverageResponseTime | Average Response Time | Seconds | Average
Yes | Microsoft.Web/sites/slots | BytesReceived | Data In | Bytes | Total
Yes | Microsoft.Web/sites/slots | BytesSent | Data Out | Bytes | Total
Yes | Microsoft.Web/sites/slots | CpuTime | CPU Time | Seconds | Total
Yes | Microsoft.Web/sites/slots | CurrentAssemblies | Current Assemblies | Count | Average
Yes | Microsoft.Web/sites/slots | FunctionExecutionCount | Function Execution Count | Count | Total
Yes | Microsoft.Web/sites/slots | FunctionExecutionUnits | Function Execution Units | Count | Total
Yes | Microsoft.Web/sites/slots | Gen0Collections | Gen 0 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites/slots | Gen1Collections | Gen 1 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites/slots | Gen2Collections | Gen 2 Garbage Collections | Count | Total
Yes | Microsoft.Web/sites/slots | Handles | Handle Count | Count | Average
Yes | Microsoft.Web/sites/slots | HealthCheckStatus | Health check status | Count | Average
Yes | Microsoft.Web/sites/slots | Http101 | Http 101 | Count | Total
Yes | Microsoft.Web/sites/slots | Http2xx | Http 2xx | Count | Total
Yes | Microsoft.Web/sites/slots | Http3xx | Http 3xx | Count | Total
Yes | Microsoft.Web/sites/slots | Http401 | Http 401 | Count | Total
Yes | Microsoft.Web/sites/slots | Http403 | Http 403 | Count | Total
Yes | Microsoft.Web/sites/slots | Http404 | Http 404 | Count | Total
Yes | Microsoft.Web/sites/slots | Http406 | Http 406 | Count | Total
Yes | Microsoft.Web/sites/slots | Http4xx | Http 4xx | Count | Total
Yes | Microsoft.Web/sites/slots | Http5xx | Http Server Errors | Count | Total
Yes | Microsoft.Web/sites/slots | HttpResponseTime | Response Time | Seconds | Average
Yes | Microsoft.Web/sites/slots | IoOtherBytesPerSecond | IO Other Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | IoOtherOperationsPerSecond | IO Other Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | IoReadBytesPerSecond | IO Read Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | IoReadOperationsPerSecond | IO Read Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | IoWriteBytesPerSecond | IO Write Bytes Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | IoWriteOperationsPerSecond | IO Write Operations Per Second | BytesPerSecond | Total
Yes | Microsoft.Web/sites/slots | MemoryWorkingSet | Memory working set | Bytes | Average
Yes | Microsoft.Web/sites/slots | PrivateBytes | Private Bytes | Bytes | Average
Yes | Microsoft.Web/sites/slots | Requests | Requests | Count | Total
Yes | Microsoft.Web/sites/slots | RequestsInApplicationQueue | Requests In Application Queue | Count | Average
Yes | Microsoft.Web/sites/slots | Threads | Thread Count | Count | Average
Yes | Microsoft.Web/sites/slots | TotalAppDomains | Total App Domains | Count | Average
Yes | Microsoft.Web/sites/slots | TotalAppDomainsUnloaded | Total App Domains Unloaded | Count | Average
