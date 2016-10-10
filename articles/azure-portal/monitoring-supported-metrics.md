<properties
	pageTitle="Azure Monitor metrics - supported metrics per resource type  | Microsoft Azure"
	description="List of metrics available for each resource type with Azure Monitor."
	authors="johnkemnetz"
	manager="rboucher"
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="johnkem"/>

# Supported metrics with Azure Monitor

Azure Monitor provides several ways to interact with metrics, including charting them in the portal, accessing them through the REST API, or querying them using PowerShell or CLI. Below is a complete list of all metrics currently available with Azure Monitor's metric pipeline.

> [AZURE.NOTE] Other metrics may be available in the portal or using legacy APIs. This list only includes public preview metrics available using the public preview of the consolidated Azure Monitor metric pipeline.

## Microsoft.Batch/batchAccounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|CoreCount|Core Count|Count|Total|Total number of cores in the batch account|
|TotalNodeCount|Node Count|Count|Total|Total number of nodes in the batch account|
|CreatingNodeCount|Creating Node Count|Count|Total|Number of nodes being created|
|StartingNodeCount|Starting Node Count|Count|Total|Number of nodes starting|
|WaitingForStartTaskNodeCount|Waiting For Start Task Node Count|Count|Total|Number of nodes waiting for the Start Task to complete|
|StartTaskFailedNodeCount|Start Task Failed Node Count|Count|Total|Number of nodes where the Start Task has failed|
|IdleNodeCount|Idle Node Count|Count|Total|Number of idle nodes|
|OfflineNodeCount|Offline Node Count|Count|Total|Number of offline nodes|
|RebootingNodeCount|Rebooting Node Count|Count|Total|Number of rebooting nodes|
|ReimagingNodeCount|Reimaging Node Count|Count|Total|Number of reimaging nodes|
|RunningNodeCount|Running Node Count|Count|Total|Number of running nodes|
|LeavingPoolNodeCount|Leaving Pool Node Count|Count|Total|Number of nodes leaving the Pool|
|UnusableNodeCount|Unusable Node Count|Count|Total|Number of unusable nodes|
|TaskStartEvent|Task Start Events|Count|Total|Total number of tasks that have started|
|TaskCompleteEvent|Task Complete Events|Count|Total|Total number of tasks that have completed|
|TaskFailEvent|Task Fail Events|Count|Total|Total number of tasks that have completed in a failed state|
|PoolCreateEvent|Pool Create Events|Count|Total|Total number of pools that have been created|
|PoolResizeStartEvent|Pool Resize Start Events|Count|Total|Total number of pool resizes that have started|
|PoolResizeCompleteEvent|Pool Resize Complete Events|Count|Total|Total number of pool resizes that have completed|
|PoolDeleteStartEvent|Pool Delete Start Events|Count|Total|Total number of pool deletes that have started|
|PoolDeleteCompleteEvent|Pool Delete Complete Events|Count|Total|Total number of pool deletes that have completed|

## Microsoft.Cache/redis

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|connectedclients|Connected Clients|Count|Maximum||
|totalcommandsprocessed|Total Operations|Count|Total||
|cachehits|Cache Hits|Count|Total||
|cachemisses|Cache Misses|Count|Total||
|getcommands|Gets|Count|Total||
|setcommands|Sets|Count|Total||
|evictedkeys|Evicted Keys|Count|Total||
|totalkeys|Total Keys|Count|Maximum||
|expiredkeys|Expired Keys|Count|Total||
|usedmemory|Used Memory|Bytes|Maximum||
|usedmemoryRss|Used Memory RSS|Bytes|Maximum||
|serverLoad|Server Load|Percent|Maximum||
|cacheWrite|Cache Write|BytesPerSecond|Maximum||
|cacheRead|Cache Read|BytesPerSecond|Maximum||
|percentProcessorTime|CPU|Percent|Maximum||
|connectedclients0|Connected Clients (Shard 0)|Count|Maximum||
|totalcommandsprocessed0|Total Operations (Shard 0)|Count|Total||
|cachehits0|Cache Hits (Shard 0)|Count|Total||
|cachemisses0|Cache Misses (Shard 0)|Count|Total||
|getcommands0|Gets (Shard 0)|Count|Total||
|setcommands0|Sets (Shard 0)|Count|Total||
|evictedkeys0|Evicted Keys (Shard 0)|Count|Total||
|totalkeys0|Total Keys (Node 0)|Count|Maximum||
|expiredkeys0|Expired Keys (Shard 0)|Count|Total||
|usedmemory0|Used Memory (Shard 0)|Bytes|Maximum||
|usedmemoryRss0|Used Memory RSS (Shard 0)|Bytes|Maximum||
|serverLoad0|Server Load (Shard 0)|Percent|Maximum||
|cacheWrite0|Cache Write (Shard 0)|BytesPerSecond|Maximum||
|cacheRead0|Cache Read (Shard 0)|BytesPerSecond|Maximum||
|percentProcessorTime0|CPU (Shard 0)|Percent|Maximum||
|connectedclients1|Connected Clients (Shard 1)|Count|Maximum||
|totalcommandsprocessed1|Total Operations (Shard 1)|Count|Total||
|cachehits1|Cache Hits (Shard 1)|Count|Total||
|cachemisses1|Cache Misses (Shard 1)|Count|Total||
|getcommands1|Gets (Shard 1)|Count|Total||
|setcommands1|Sets (Shard 1)|Count|Total||
|evictedkeys1|Evicted Keys (Shard 1)|Count|Total||
|totalkeys1|Total Keys (Node 1)|Count|Maximum||
|expiredkeys1|Expired Keys (Shard 1)|Count|Total||
|usedmemory1|Used Memory (Shard 1)|Bytes|Maximum||
|usedmemoryRss1|Used Memory RSS (Shard 1)|Bytes|Maximum||
|serverLoad1|Server Load (Shard 1)|Percent|Maximum||
|cacheWrite1|Cache Write (Shard 1)|BytesPerSecond|Maximum||
|cacheRead1|Cache Read (Shard 1)|BytesPerSecond|Maximum||
|percentProcessorTime1|CPU (Shard 1)|Percent|Maximum||
|connectedclients2|Connected Clients (Shard 2)|Count|Maximum||
|totalcommandsprocessed2|Total Operations (Shard 2)|Count|Total||
|cachehits2|Cache Hits (Shard 2)|Count|Total||
|cachemisses2|Cache Misses (Shard 2)|Count|Total||
|getcommands2|Gets (Shard 2)|Count|Total||
|setcommands2|Sets (Shard 2)|Count|Total||
|evictedkeys2|Evicted Keys (Shard 2)|Count|Total||
|totalkeys2|Total Keys (Node 2)|Count|Maximum||
|expiredkeys2|Expired Keys (Shard 2)|Count|Total||
|usedmemory2|Used Memory (Shard 2)|Bytes|Maximum||
|usedmemoryRss2|Used Memory RSS (Shard 2)|Bytes|Maximum||
|serverLoad2|Server Load (Shard 2)|Percent|Maximum||
|cacheWrite2|Cache Write (Shard 2)|BytesPerSecond|Maximum||
|cacheRead2|Cache Read (Shard 2)|BytesPerSecond|Maximum||
|percentProcessorTime2|CPU (Shard 2)|Percent|Maximum||
|connectedclients3|Connected Clients (Shard 3)|Count|Maximum||
|totalcommandsprocessed3|Total Operations (Shard 3)|Count|Total||
|cachehits3|Cache Hits (Shard 3)|Count|Total||
|cachemisses3|Cache Misses (Shard 3)|Count|Total||
|getcommands3|Gets (Shard 3)|Count|Total||
|setcommands3|Sets (Shard 3)|Count|Total||
|evictedkeys3|Evicted Keys (Shard 3)|Count|Total||
|totalkeys3|Total Keys (Node 3)|Count|Maximum||
|expiredkeys3|Expired Keys (Shard 3)|Count|Total||
|usedmemory3|Used Memory (Shard 3)|Bytes|Maximum||
|usedmemoryRss3|Used Memory RSS (Shard 3)|Bytes|Maximum||
|serverLoad3|Server Load (Shard 3)|Percent|Maximum||
|cacheWrite3|Cache Write (Shard 3)|BytesPerSecond|Maximum||
|cacheRead3|Cache Read (Shard 3)|BytesPerSecond|Maximum||
|percentProcessorTime3|CPU (Shard 3)|Percent|Maximum||
|connectedclients4|Connected Clients (Shard 4)|Count|Maximum||
|totalcommandsprocessed4|Total Operations (Shard 4)|Count|Total||
|cachehits4|Cache Hits (Shard 4)|Count|Total||
|cachemisses4|Cache Misses (Shard 4)|Count|Total||
|getcommands4|Gets (Shard 4)|Count|Total||
|setcommands4|Sets (Shard 4)|Count|Total||
|evictedkeys4|Evicted Keys (Shard 4)|Count|Total||
|totalkeys4|Total Keys (Node 4)|Count|Maximum||
|expiredkeys4|Expired Keys (Shard 4)|Count|Total||
|usedmemory4|Used Memory (Shard 4)|Bytes|Maximum||
|usedmemoryRss4|Used Memory RSS (Shard 4)|Bytes|Maximum||
|serverLoad4|Server Load (Shard 4)|Percent|Maximum||
|cacheWrite4|Cache Write (Shard 4)|BytesPerSecond|Maximum||
|cacheRead4|Cache Read (Shard 4)|BytesPerSecond|Maximum||
|percentProcessorTime4|CPU (Shard 4)|Percent|Maximum||
|connectedclients5|Connected Clients (Shard 5)|Count|Maximum||
|totalcommandsprocessed5|Total Operations (Shard 5)|Count|Total||
|cachehits5|Cache Hits (Shard 5)|Count|Total||
|cachemisses5|Cache Misses (Shard 5)|Count|Total||
|getcommands5|Gets (Shard 5)|Count|Total||
|setcommands5|Sets (Shard 5)|Count|Total||
|evictedkeys5|Evicted Keys (Shard 5)|Count|Total||
|totalkeys5|Total Keys (Node 5)|Count|Maximum||
|expiredkeys5|Expired Keys (Shard 5)|Count|Total||
|usedmemory5|Used Memory (Shard 5)|Bytes|Maximum||
|usedmemoryRss5|Used Memory RSS (Shard 5)|Bytes|Maximum||
|serverLoad5|Server Load (Shard 5)|Percent|Maximum||
|cacheWrite5|Cache Write (Shard 5)|BytesPerSecond|Maximum||
|cacheRead5|Cache Read (Shard 5)|BytesPerSecond|Maximum||
|percentProcessorTime5|CPU (Shard 5)|Percent|Maximum||
|connectedclients6|Connected Clients (Shard 6)|Count|Maximum||
|totalcommandsprocessed6|Total Operations (Shard 6)|Count|Total||
|cachehits6|Cache Hits (Shard 6)|Count|Total||
|cachemisses6|Cache Misses (Shard 6)|Count|Total||
|getcommands6|Gets (Shard 6)|Count|Total||
|setcommands6|Sets (Shard 6)|Count|Total||
|evictedkeys6|Evicted Keys (Shard 6)|Count|Total||
|totalkeys6|Total Keys (Node 6)|Count|Maximum||
|expiredkeys6|Expired Keys (Shard 6)|Count|Total||
|usedmemory6|Used Memory (Shard 6)|Bytes|Maximum||
|usedmemoryRss6|Used Memory RSS (Shard 6)|Bytes|Maximum||
|serverLoad6|Server Load (Shard 6)|Percent|Maximum||
|cacheWrite6|Cache Write (Shard 6)|BytesPerSecond|Maximum||
|cacheRead6|Cache Read (Shard 6)|BytesPerSecond|Maximum||
|percentProcessorTime6|CPU (Shard 6)|Percent|Maximum||
|connectedclients7|Connected Clients (Shard 7)|Count|Maximum||
|totalcommandsprocessed7|Total Operations (Shard 7)|Count|Total||
|cachehits7|Cache Hits (Shard 7)|Count|Total||
|cachemisses7|Cache Misses (Shard 7)|Count|Total||
|getcommands7|Gets (Shard 7)|Count|Total||
|setcommands7|Sets (Shard 7)|Count|Total||
|evictedkeys7|Evicted Keys (Shard 7)|Count|Total||
|totalkeys7|Total Keys (Node 7)|Count|Maximum||
|expiredkeys7|Expired Keys (Shard 7)|Count|Total||
|usedmemory7|Used Memory (Shard 7)|Bytes|Maximum||
|usedmemoryRss7|Used Memory RSS (Shard 7)|Bytes|Maximum||
|serverLoad7|Server Load (Shard 7)|Percent|Maximum||
|cacheWrite7|Cache Write (Shard 7)|BytesPerSecond|Maximum||
|cacheRead7|Cache Read (Shard 7)|BytesPerSecond|Maximum||
|percentProcessorTime7|CPU (Shard 7)|Percent|Maximum||
|connectedclients8|Connected Clients (Shard 8)|Count|Maximum||
|totalcommandsprocessed8|Total Operations (Shard 8)|Count|Total||
|cachehits8|Cache Hits (Shard 8)|Count|Total||
|cachemisses8|Cache Misses (Shard 8)|Count|Total||
|getcommands8|Gets (Shard 8)|Count|Total||
|setcommands8|Sets (Shard 8)|Count|Total||
|evictedkeys8|Evicted Keys (Shard 8)|Count|Total||
|totalkeys8|Total Keys (Node 8)|Count|Maximum||
|expiredkeys8|Expired Keys (Shard 8)|Count|Total||
|usedmemory8|Used Memory (Shard 8)|Bytes|Maximum||
|usedmemoryRss8|Used Memory RSS (Shard 8)|Bytes|Maximum||
|serverLoad8|Server Load (Shard 8)|Percent|Maximum||
|cacheWrite8|Cache Write (Shard 8)|BytesPerSecond|Maximum||
|cacheRead8|Cache Read (Shard 8)|BytesPerSecond|Maximum||
|percentProcessorTime8|CPU (Shard 8)|Percent|Maximum||
|connectedclients9|Connected Clients (Shard 9)|Count|Maximum||
|totalcommandsprocessed9|Total Operations (Shard 9)|Count|Total||
|cachehits9|Cache Hits (Shard 9)|Count|Total||
|cachemisses9|Cache Misses (Shard 9)|Count|Total||
|getcommands9|Gets (Shard 9)|Count|Total||
|setcommands9|Sets (Shard 9)|Count|Total||
|evictedkeys9|Evicted Keys (Shard 9)|Count|Total||
|totalkeys9|Total Keys (Node 9)|Count|Maximum||
|expiredkeys9|Expired Keys (Shard 9)|Count|Total||
|usedmemory9|Used Memory (Shard 9)|Bytes|Maximum||
|usedmemoryRss9|Used Memory RSS (Shard 9)|Bytes|Maximum||
|serverLoad9|Server Load (Shard 9)|Percent|Maximum||
|cacheWrite9|Cache Write (Shard 9)|BytesPerSecond|Maximum||
|cacheRead9|Cache Read (Shard 9)|BytesPerSecond|Maximum||
|percentProcessorTime9|CPU (Shard 9)|Percent|Maximum||

## Microsoft.CognitiveServices/accounts

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|NumberOfCalls|Total number of API calls|Count|Total|Total number of API calls.|
|NumberOfFailedCalls|Total number of failed API calls|Count|Total|Total number of failed API calls.|

## Microsoft.Compute/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Total bytes read from disk during monitoring period|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Total bytes written to disk during monitoring period|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|

## Microsoft.Compute/virtualMachineScaleSets

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Total bytes read from disk during monitoring period|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Total bytes written to disk during monitoring period|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|

## Microsoft.Compute/virtualMachineScaleSets/virtualMachines

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|Percentage CPU|Percentage CPU|Percent|Average|The percentage of allocated compute units that are currently in use by the Virtual Machine(s)|
|Network In|Network In|Bytes|Total|The number of bytes received on all network interfaces by the Virtual Machine(s) (Incoming Traffic)|
|Network Out|Network Out|Bytes|Total|The number of bytes out on all network interfaces by the Virtual Machine(s) (Outgoing Traffic)|
|Disk Read Bytes|Disk Read Bytes|Bytes|Total|Total bytes read from disk during monitoring period|
|Disk Write Bytes|Disk Write Bytes|Bytes|Total|Total bytes written to disk during monitoring period|
|Disk Read Operations/Sec|Disk Read Operations/Sec|CountPerSecond|Average|Disk Read IOPS|
|Disk Write Operations/Sec|Disk Write Operations/Sec|CountPerSecond|Average|Disk Write IOPS|

## Microsoft.Devices/IotHubs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|d2c.telemetry.ingress.allProtocol|Telemetry Message Send Attempts|Count|Total|Number of Device to Cloud telemetry messages attempted to be sent to your IoT hub|
|d2c.telemetry.ingress.success|Telemetry Messages Sent|Count|Total|Number of Device to Cloud telemetry messages sent successfully to your IoT hub|
|c2d.commands.egress.complete.success|Commands Completed|Count|Total|Number of Cloud to Device commands completed successfully by the device|
|c2d.commands.egress.abandon.success|Commands Abandoned|Count|Total|Number of Cloud to Device commands abandoned by the device|
|c2d.commands.egress.reject.success|Commands Rejected|Count|Total|Number of Cloud to Device commands rejected by the device|
|devices.totalDevices|Total Devices|Count|Total|Number of devices registered to your IoT hub|
|devices.connectedDevices.allProtocol|Connected Devices|Count|Total|Number of devices connected to your IoT hub|

## Microsoft.EventHub/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|INREQS|Incoming Requests|Count|Total|Event Hub incoming message throughput for a namespace|
|SUCCREQ|Successful Requests|Count|Total|Total successful requests for a namespace|
|FAILREQ|Failed Requests|Count|Total|Total failed requests for a namespace|
|SVRBSY|Server Busy Errors|Count|Total|Total server busy errors for a namespace|
|INTERR|Internal Server Errors|Count|Total|Total internal server errors for a namespace|
|MISCERR|Other Errors|Count|Total|Total failed requests for a namespace|
|INMSGS|Incoming Messages|Count|Total|Total incoming messages for a namespace|
|OUTMSGS|Outgoing Messages|Count|Total|Total outgoing messages for a namespace|
|EHINMBS|Incoming bytes per second|BytesPerSecond|Total|Event Hub incoming message throughput for a namespace|
|EHOUTMBS|Outgoing bytes per second|BytesPerSecond|Total|Total outgoing messages for a namespace|
|EHABL|Archive backlog messages|Count|Total|Event Hub archive messages in backlog for a namespace|
|EHAMSGS|Archive messages|Count|Total|Event Hub archived messages in a namespace|
|EHAMBS|Archive message throughput|BytesPerSecond|Total|Event Hub archived message throughput in a namespace|

## Microsoft.Logic/workflows

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|
|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|
|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|
|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|
|RunsCancelled|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|
|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|
|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|
|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|
|RunFailurePercentage|Run Failure Percentage|Percent|Total|Percentage of workflow runs failed.|
|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|
|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|
|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|
|ActionsFailed|Actions Failed|Count|Total|Number of workflow actions failed.|
|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|
|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|
|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|
|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|
|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|
|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|
|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|
|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|
|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|
|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|
|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|
|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|
|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|
|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|
|BillableActionExecutions|Billable Action Executions|Count|Total|Number of workflow action executions getting billed.|
|BillableTriggerExecutions|Billable Trigger Executions|Count|Total|Number of workflow trigger executions getting billed.|
|TotalBillableExecutions|Total Billable Executions|Count|Total|Number of workflow executions getting billed.|

## Microsoft.Network/applicationGateways

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|Throughput|Throughput|BytesPerSecond|Average||

## Microsoft.Search/searchServices

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|SearchLatency|Search Latency|Seconds|Average|Average search latency for the search service|
|SearchQueriesPerSecond|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|
|ThrottledSearchQueriesPercentage|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|

## Microsoft.ServiceBus/namespaces

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|CPUXNS|CPU usage per namespace|Percent|Maximum|Service bus premium namespace CPU usage metric|
|WSXNS|Memory size usage per namespace|Percent|Maximum|Service bus premium namespace memory usage metric|

## Microsoft.Sql/servers/databases

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Maximum|CPU percentage|
|physical_data_read_percent|Data IO percentage|Percent|Maximum|Data IO percentage|
|log_write_percent|Log IO percentage|Percent|Maximum|Log IO percentage|
|dtu_consumption_percent|DTU percentage|Percent|Maximum|DTU percentage|
|storage|Total database size|Bytes|Maximum|Total database size|
|connection_successful|Successful Connections|Count|Total|Successful Connections|
|connection_failed|Failed Connections|Count|Total|Failed Connections|
|blocked_by_firewall|Blocked by Firewall|Count|Total|Blocked by Firewall|
|deadlock|Deadlocks|Count|Total|Deadlocks|
|storage_percent|Database size percentage|Percent|Maximum|Database size percentage|
|xtp_storage_percent|In-Memory OLTP storage percent(Preview)|Percent|Maximum|In-Memory OLTP storage percent(Preview)|
|workers_percent|Workers percentage|Percent|Maximum|Workers percent|
|sessions_percent|Sessions percent|Percent|Maximum|Sessions percent|
|dtu_limit|DTU limit|Count|Maximum|DTU limit|
|dtu_used|DTU used|Count|Maximum|DTU used|
|service_level_objective|Service level objective of the database|Count|Total|Service level objective of the database|
|dwu_limit|dwu limit|Count|Maximum|dwu limit|
|dwu_consumption_percent|DWU percentage|Percent|Maximum|DWU percentage|
|dwu_used|DWU used|Count|Maximum|DWU used|

## Microsoft.Sql/servers/elasticPools

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|cpu_percent|CPU percentage|Percent|Maximum|CPU percentage|
|physical_data_read_percent|Data IO percentage|Percent|Maximum|Data IO percentage|
|log_write_percent|Log IO percentage|Percent|Maximum|Log IO percentage|
|dtu_consumption_percent|DTU percentage|Percent|Maximum|DTU percentage|
|storage_percent|Storage percentage|Percent|Maximum|Storage percentage|
|workers_percent|Workers percent|Percent|Maximum|Workers percent|
|sessions_percent|Sessions percent|Percent|Maximum|Sessions percent|
|eDTU_limit|eDTU limit|Count|Maximum|eDTU limit|
|storage_limit|Storage limit|Bytes|Maximum|Storage limit|
|eDTU_used|eDTU used|Count|Maximum|eDTU used|
|storage_used|Storage used|Bytes|Maximum|Storage used|

## Microsoft.StreamAnalytics/streamingjobs

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|ResourceUtilization|SU % Utilization|Percent|Maximum|SU % Utilization|
|InputEvents|Input Events|Count|Total|Input Events|
|InputEventBytes|Input Event Bytes|Bytes|Total|Input Event Bytes|
|LateInputEvents|Late Input Events|Count|Total|Late Input Events|
|OutputEvents|Output Events|Count|Total|Output Events|
|ConversionErrors|Data Conversion Errors|Count|Total|Data Conversion Errors|
|Errors|Runtime Errors|Count|Total|Runtime Errors|
|DroppedOrAdjustedEvents|Out of order Events|Count|Total|Out of order Events|
|AMLCalloutRequests|Function Requests|Count|Total|Function Requests|
|AMLCalloutFailedRequests|Failed Function Requests|Count|Total|Failed Function Requests|
|AMLCalloutInputEvents|Function Events|Count|Total|Function Events|

## Microsoft.Web/serverfarms

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|CpuPercentage|CPU Percentage|Percent|Average|CPU Percentage|
|MemoryPercentage|Memory Percentage|Percent|Average|Memory Percentage|
|DiskQueueLength|Disk Queue Length|Count|Total|Disk Queue Length|
|HttpQueueLength|Http Queue Length|Count|Total|Http Queue Length|
|BytesReceived|Data In|Bytes|Total|Data In|
|BytesSent|Data Out|Bytes|Total|Data Out|

## Microsoft.Web/sites

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|CpuTime|CPU Time|Seconds|Total|CPU Time|
|Requests|Requests|Count|Total|Requests|
|BytesReceived|Data In|Bytes|Total|Data In|
|BytesSent|Data Out|Bytes|Total|Data Out|
|Http2xx|Http 2xx|Count|Total|Http 2xx|
|Http3xx|Http 3xx|Count|Total|Http 3xx|
|Http401|Http 401|Count|Total|Http 401|
|Http403|Http 403|Count|Total|Http 403|
|Http404|Http 404|Count|Total|Http 404|
|Http406|Http 406|Count|Total|Http 406|
|Http4xx|Http 4xx|Count|Total|Http 4xx|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|
|MemoryWorkingSet|Memory working set|Bytes|Total|Memory working set|
|AverageMemoryWorkingSet|Average memory working set|Bytes|Average|Average memory working set|
|AverageResponseTime|Average Response Time|Seconds|Average|Average Response Time|

## Microsoft.Web/sites/slots

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|CpuTime|CPU Time|Seconds|Total|CPU Time|
|Requests|Requests|Count|Total|Requests|
|BytesReceived|Data In|Bytes|Total|Data In|
|BytesSent|Data Out|Bytes|Total|Data Out|
|Http2xx|Http 2xx|Count|Total|Http 2xx|
|Http3xx|Http 3xx|Count|Total|Http 3xx|
|Http401|Http 401|Count|Total|Http 401|
|Http403|Http 403|Count|Total|Http 403|
|Http404|Http 404|Count|Total|Http 404|
|Http406|Http 406|Count|Total|Http 406|
|Http4xx|Http 4xx|Count|Total|Http 4xx|
|Http5xx|Http Server Errors|Count|Total|Http Server Errors|
|MemoryWorkingSet|Memory working set|Bytes|Total|Memory working set|
|AverageMemoryWorkingSet|Average memory working set|Bytes|Average|Average memory working set|
|AverageResponseTime|Average Response Time|Seconds|Average|Average Response Time|

## Next steps

- [Read about metrics in Azure Monitor](./monitoring-overview.md#monitoring-sources)
- [Create alerts on metrics](./insights-receive-alert-notifications.md)
- [Export metrics to storage, Event Hub, or Log Analytics](./monitoring-overview-of-diagnostic-logs.md)
