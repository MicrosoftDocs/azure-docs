<properties
	pageTitle="Overview of Metrics in Microsoft Azure | Microsoft Azure"
	description="Learn how to customize monitoring charts in Azure."
	authors="rboucher"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/08/2015"
	ms.author="robb"/>

# Overview of Metrics in Microsoft Azure

All Azure services track key metrics that allow you to monitor the health, performance, availability and usage of your services. You can view these metrics in the Azure portal, and you can also use the [REST API](https://msdn.microsoft.com/library/azure/dn931930.aspx) or [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Insights/) to access the full set of metrics programmatically.

For some services, you may need to turn on diagnostics in order to see any metrics. For others, such as virtual machines, you will get a basic set of metrics, but need to enable the full set high-frequency metrics. See [Enable monitoring and diagnostics](insights-how-to-use-diagnostics.md) to learn more.

## Using monitoring charts

You can chart any of the metrics them over any time period you choose.

1. In the [Azure Portal](https://portal.azure.com/), click **Browse**, and then a resource you're interested in monitoring.

2. The **Monitoring** section contains the most important metrics for each Azure resource. For example, a web app has **Requests and Errors**, where as a virtual machine would have **CPU percentage** and **Disk read and write**:
    ![Monitoring lens](./media/insights-how-to-customize-monitoring/Insights_MonitoringChart.png)

3. Clicking on any chart will show you the **Metric** blade. On the blade, in addition to the graph, is a table that shows you aggregations of the metrics (such as average, minimum and maximum, over the time range you chose). Below that are the alert rules for the resource.
    ![Metric blade](./media/insights-how-to-customize-monitoring/Insights_MetricBlade.png)

4. To customize the lines that appear, click the **Edit** button on the chart, or, the **Edit chart** command on the Metric blade.

5. On the Edit Query blade you can do three things:
    - Change the time range
    - Switch the appearance between Bar and Line
    - Choose different metics
    ![Edit Query](./media/insights-how-to-customize-monitoring/Insights_EditQuery.png)

6. Changing the time range is as easy as selecting a different range (such as **Past Hour**) and clicking **Save** at the bottom of the blade. You can also choose **Custom**, which allows you to choose any period of time over the past 2 weeks. For example, you can see the whole two weeks, or, just 1 hour from yesterday. Type in the text box to enter a different hour.
    ![Custom time range](./media/insights-how-to-customize-monitoring/Insights_CustomTime.png)

7. Below the time range, you chan choose any number of metrics to show on the chart.

8. When you click Save your changes will be saved for that particular resource. For example, if you have two virtual machines, and you change a chart on one, it will not impact the other.

## Creating side-by-side charts

With the powerful customization in the portal you can add as many charts as you want.

1. In the **...** menu at the top of the blade click **Add tiles**:  
    ![Add Menu](./media/insights-how-to-customize-monitoring/Insights_AddMenu.png)
2. Then, you can select select a chart from the **Gallery** on the right side of your screen:
    ![Gallery](./media/insights-how-to-customize-monitoring/Insights_Gallery.png)
3. If you don't see the metric you want, you can always add one of the preset metrics, and **Edit** the chart to show the metric that you need.

## Monitoring usage quotas

Most metrics show you trends over time, but certain data, like usage quotas, are point-in-time information with a threshold.

You can also see usage quotas on the blade for resources that have quotas:

![Usage](./media/insights-how-to-customize-monitoring/Insights_UsageChart.png)

Like with metrics, you can use the [REST API](https://msdn.microsoft.com/library/azure/dn931963.aspx) or [.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Insights/) to access the full set of usage quotas programmatically.

## Supported metrics per resource type

> [AZURE.NOTE] This list is a point-in-time view of the metrics available from resources in Azure. For the most up-to-date list, use the Get Metric Definitions [REST API](https://msdn.microsoft.com/library/azure/dn931939.aspx), [PowerShell cmdlet](insights-powershell-samples.md#get-a-list-of-available-metrics-for-alerts), or Cross Platform CLI.


> [AZURE.WARNING] Not all metrics in this list support alerts today.

|Resource Type|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|---|
|Microsoft.Batch/batchAccounts|CoreCount|Core Count|Count|Last||
|Microsoft.Batch/batchAccounts|TotalNodeCount|Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|CreatingNodeCount|Creating Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|StartingNodeCount|Starting Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|WaitingForStartTaskNodeCount|Waiting For Start Task Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|StartTaskFailedNodeCount|Start Task Failed Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|IdleNodeCount|Idle Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|OfflineNodeCount|Offline Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|RebootingNodeCount|Rebooting Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|ReimagingNodeCount|Reimaging Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|RunningNodeCount|Running Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|LeavingPoolNodeCount|Leaving Pool Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|UnusableNodeCount|Unusable Node Count|Count|Last||
|Microsoft.Batch/batchAccounts|TaskStartEvent|Task Start Events|Count|Total||
|Microsoft.Batch/batchAccounts|TaskCompleteEvent|Task Complete Events|Count|Total||
|Microsoft.Batch/batchAccounts|TaskFailEvent|Task Fail Events|Count|Total||
|Microsoft.Batch/batchAccounts|PoolCreateEvent|Pool Create Events|Count|Total||
|Microsoft.Batch/batchAccounts|PoolResizeStartEvent|Pool Resize Start Events|Count|Total||
|Microsoft.Batch/batchAccounts|PoolResizeCompleteEvent|Pool Resize Complete Events|Count|Total||
|Microsoft.Batch/batchAccounts|PoolDeleteStartEvent|Pool Delete Start Events|Count|Total||
|Microsoft.Batch/batchAccounts|PoolDeleteCompleteEvent|Pool Delete Complete Events|Count|Total||
|Microsoft.Cache/redis|connectedclients|Connected Clients|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed|Total Operations|Count|Total||
|Microsoft.Cache/redis|cachehits|Cache Hits|Count|Total||
|Microsoft.Cache/redis|cachemisses|Cache Misses|Count|Total||
|Microsoft.Cache/redis|getcommands|Gets|Count|Total||
|Microsoft.Cache/redis|setcommands|Sets|Count|Total||
|Microsoft.Cache/redis|evictedkeys|Evicted Keys|Count|Total||
|Microsoft.Cache/redis|totalkeys|Total Keys|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys|Expired Keys|Count|Total||
|Microsoft.Cache/redis|usedmemory|Used Memory|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss|Used Memory RSS|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad|Server Load|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite|Cache Write|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead|Cache Read|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime|CPU|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients0|Connected Clients (Shard 0)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed0|Total Operations (Shard 0)|Count|Total||
|Microsoft.Cache/redis|cachehits0|Cache Hits (Shard 0)|Count|Total||
|Microsoft.Cache/redis|cachemisses0|Cache Misses (Shard 0)|Count|Total||
|Microsoft.Cache/redis|getcommands0|Gets (Shard 0)|Count|Total||
|Microsoft.Cache/redis|setcommands0|Sets (Shard 0)|Count|Total||
|Microsoft.Cache/redis|evictedkeys0|Evicted Keys (Shard 0)|Count|Total||
|Microsoft.Cache/redis|totalkeys0|Total Keys (Node 0)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys0|Expired Keys (Shard 0)|Count|Total||
|Microsoft.Cache/redis|usedmemory0|Used Memory (Shard 0)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss0|Used Memory RSS (Shard 0)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad0|Server Load (Shard 0)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite0|Cache Write (Shard 0)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead0|Cache Read (Shard 0)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime0|CPU (Shard 0)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients1|Connected Clients (Shard 1)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed1|Total Operations (Shard 1)|Count|Total||
|Microsoft.Cache/redis|cachehits1|Cache Hits (Shard 1)|Count|Total||
|Microsoft.Cache/redis|cachemisses1|Cache Misses (Shard 1)|Count|Total||
|Microsoft.Cache/redis|getcommands1|Gets (Shard 1)|Count|Total||
|Microsoft.Cache/redis|setcommands1|Sets (Shard 1)|Count|Total||
|Microsoft.Cache/redis|evictedkeys1|Evicted Keys (Shard 1)|Count|Total||
|Microsoft.Cache/redis|totalkeys1|Total Keys (Node 1)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys1|Expired Keys (Shard 1)|Count|Total||
|Microsoft.Cache/redis|usedmemory1|Used Memory (Shard 1)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss1|Used Memory RSS (Shard 1)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad1|Server Load (Shard 1)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite1|Cache Write (Shard 1)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead1|Cache Read (Shard 1)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime1|CPU (Shard 1)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients2|Connected Clients (Shard 2)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed2|Total Operations (Shard 2)|Count|Total||
|Microsoft.Cache/redis|cachehits2|Cache Hits (Shard 2)|Count|Total||
|Microsoft.Cache/redis|cachemisses2|Cache Misses (Shard 2)|Count|Total||
|Microsoft.Cache/redis|getcommands2|Gets (Shard 2)|Count|Total||
|Microsoft.Cache/redis|setcommands2|Sets (Shard 2)|Count|Total||
|Microsoft.Cache/redis|evictedkeys2|Evicted Keys (Shard 2)|Count|Total||
|Microsoft.Cache/redis|totalkeys2|Total Keys (Node 2)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys2|Expired Keys (Shard 2)|Count|Total||
|Microsoft.Cache/redis|usedmemory2|Used Memory (Shard 2)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss2|Used Memory RSS (Shard 2)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad2|Server Load (Shard 2)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite2|Cache Write (Shard 2)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead2|Cache Read (Shard 2)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime2|CPU (Shard 2)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients3|Connected Clients (Shard 3)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed3|Total Operations (Shard 3)|Count|Total||
|Microsoft.Cache/redis|cachehits3|Cache Hits (Shard 3)|Count|Total||
|Microsoft.Cache/redis|cachemisses3|Cache Misses (Shard 3)|Count|Total||
|Microsoft.Cache/redis|getcommands3|Gets (Shard 3)|Count|Total||
|Microsoft.Cache/redis|setcommands3|Sets (Shard 3)|Count|Total||
|Microsoft.Cache/redis|evictedkeys3|Evicted Keys (Shard 3)|Count|Total||
|Microsoft.Cache/redis|totalkeys3|Total Keys (Node 3)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys3|Expired Keys (Shard 3)|Count|Total||
|Microsoft.Cache/redis|usedmemory3|Used Memory (Shard 3)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss3|Used Memory RSS (Shard 3)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad3|Server Load (Shard 3)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite3|Cache Write (Shard 3)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead3|Cache Read (Shard 3)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime3|CPU (Shard 3)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients4|Connected Clients (Shard 4)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed4|Total Operations (Shard 4)|Count|Total||
|Microsoft.Cache/redis|cachehits4|Cache Hits (Shard 4)|Count|Total||
|Microsoft.Cache/redis|cachemisses4|Cache Misses (Shard 4)|Count|Total||
|Microsoft.Cache/redis|getcommands4|Gets (Shard 4)|Count|Total||
|Microsoft.Cache/redis|setcommands4|Sets (Shard 4)|Count|Total||
|Microsoft.Cache/redis|evictedkeys4|Evicted Keys (Shard 4)|Count|Total||
|Microsoft.Cache/redis|totalkeys4|Total Keys (Node 4)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys4|Expired Keys (Shard 4)|Count|Total||
|Microsoft.Cache/redis|usedmemory4|Used Memory (Shard 4)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss4|Used Memory RSS (Shard 4)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad4|Server Load (Shard 4)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite4|Cache Write (Shard 4)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead4|Cache Read (Shard 4)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime4|CPU (Shard 4)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients5|Connected Clients (Shard 5)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed5|Total Operations (Shard 5)|Count|Total||
|Microsoft.Cache/redis|cachehits5|Cache Hits (Shard 5)|Count|Total||
|Microsoft.Cache/redis|cachemisses5|Cache Misses (Shard 5)|Count|Total||
|Microsoft.Cache/redis|getcommands5|Gets (Shard 5)|Count|Total||
|Microsoft.Cache/redis|setcommands5|Sets (Shard 5)|Count|Total||
|Microsoft.Cache/redis|evictedkeys5|Evicted Keys (Shard 5)|Count|Total||
|Microsoft.Cache/redis|totalkeys5|Total Keys (Node 5)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys5|Expired Keys (Shard 5)|Count|Total||
|Microsoft.Cache/redis|usedmemory5|Used Memory (Shard 5)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss5|Used Memory RSS (Shard 5)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad5|Server Load (Shard 5)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite5|Cache Write (Shard 5)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead5|Cache Read (Shard 5)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime5|CPU (Shard 5)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients6|Connected Clients (Shard 6)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed6|Total Operations (Shard 6)|Count|Total||
|Microsoft.Cache/redis|cachehits6|Cache Hits (Shard 6)|Count|Total||
|Microsoft.Cache/redis|cachemisses6|Cache Misses (Shard 6)|Count|Total||
|Microsoft.Cache/redis|getcommands6|Gets (Shard 6)|Count|Total||
|Microsoft.Cache/redis|setcommands6|Sets (Shard 6)|Count|Total||
|Microsoft.Cache/redis|evictedkeys6|Evicted Keys (Shard 6)|Count|Total||
|Microsoft.Cache/redis|totalkeys6|Total Keys (Node 6)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys6|Expired Keys (Shard 6)|Count|Total||
|Microsoft.Cache/redis|usedmemory6|Used Memory (Shard 6)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss6|Used Memory RSS (Shard 6)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad6|Server Load (Shard 6)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite6|Cache Write (Shard 6)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead6|Cache Read (Shard 6)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime6|CPU (Shard 6)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients7|Connected Clients (Shard 7)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed7|Total Operations (Shard 7)|Count|Total||
|Microsoft.Cache/redis|cachehits7|Cache Hits (Shard 7)|Count|Total||
|Microsoft.Cache/redis|cachemisses7|Cache Misses (Shard 7)|Count|Total||
|Microsoft.Cache/redis|getcommands7|Gets (Shard 7)|Count|Total||
|Microsoft.Cache/redis|setcommands7|Sets (Shard 7)|Count|Total||
|Microsoft.Cache/redis|evictedkeys7|Evicted Keys (Shard 7)|Count|Total||
|Microsoft.Cache/redis|totalkeys7|Total Keys (Node 7)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys7|Expired Keys (Shard 7)|Count|Total||
|Microsoft.Cache/redis|usedmemory7|Used Memory (Shard 7)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss7|Used Memory RSS (Shard 7)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad7|Server Load (Shard 7)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite7|Cache Write (Shard 7)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead7|Cache Read (Shard 7)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime7|CPU (Shard 7)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients8|Connected Clients (Shard 8)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed8|Total Operations (Shard 8)|Count|Total||
|Microsoft.Cache/redis|cachehits8|Cache Hits (Shard 8)|Count|Total||
|Microsoft.Cache/redis|cachemisses8|Cache Misses (Shard 8)|Count|Total||
|Microsoft.Cache/redis|getcommands8|Gets (Shard 8)|Count|Total||
|Microsoft.Cache/redis|setcommands8|Sets (Shard 8)|Count|Total||
|Microsoft.Cache/redis|evictedkeys8|Evicted Keys (Shard 8)|Count|Total||
|Microsoft.Cache/redis|totalkeys8|Total Keys (Node 8)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys8|Expired Keys (Shard 8)|Count|Total||
|Microsoft.Cache/redis|usedmemory8|Used Memory (Shard 8)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss8|Used Memory RSS (Shard 8)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad8|Server Load (Shard 8)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite8|Cache Write (Shard 8)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead8|Cache Read (Shard 8)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime8|CPU (Shard 8)|Percent|Maximum||
|Microsoft.Cache/redis|connectedclients9|Connected Clients (Shard 9)|Count|Maximum||
|Microsoft.Cache/redis|totalcommandsprocessed9|Total Operations (Shard 9)|Count|Total||
|Microsoft.Cache/redis|cachehits9|Cache Hits (Shard 9)|Count|Total||
|Microsoft.Cache/redis|cachemisses9|Cache Misses (Shard 9)|Count|Total||
|Microsoft.Cache/redis|getcommands9|Gets (Shard 9)|Count|Total||
|Microsoft.Cache/redis|setcommands9|Sets (Shard 9)|Count|Total||
|Microsoft.Cache/redis|evictedkeys9|Evicted Keys (Shard 9)|Count|Total||
|Microsoft.Cache/redis|totalkeys9|Total Keys (Node 9)|Count|Maximum||
|Microsoft.Cache/redis|expiredkeys9|Expired Keys (Shard 9)|Count|Total||
|Microsoft.Cache/redis|usedmemory9|Used Memory (Shard 9)|Bytes|Maximum||
|Microsoft.Cache/redis|usedmemoryRss9|Used Memory RSS (Shard 9)|Bytes|Maximum||
|Microsoft.Cache/redis|serverLoad9|Server Load (Shard 9)|Percent|Maximum||
|Microsoft.Cache/redis|cacheWrite9|Cache Write (Shard 9)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|cacheRead9|Cache Read (Shard 9)|BytesPerSecond|Maximum||
|Microsoft.Cache/redis|percentProcessorTime9|CPU (Shard 9)|Percent|Maximum||
|Microsoft.CognitiveServices/accounts|NumberOfCalls|Total number of API calls|Count|Total|Total number of API calls.|
|Microsoft.CognitiveServices/accounts|NumberOfFailedCalls|Total number of failed API calls|Count|Total|Total number of failed API calls.|
|Microsoft.Devices/IotHubs|d2c.telemetry.ingress.allProtocol|Telemetry Messages Send Attempts|Count|Total|Number of Device to Cloud Telemetry Messages attempted to be sent to the cloud|
|Microsoft.Devices/IotHubs|d2c.telemetry.ingress.success|Telemetry Messages Sent|Count|Total|Number of Device to Cloud Telemetry Messages sent successfully to the cloud|
|Microsoft.Devices/IotHubs|c2d.commands.egress.complete.success|Commands Completed|Count|Total|Number of Cloud to Device Commands completed successfully by the device|
|Microsoft.Devices/IotHubs|c2d.commands.egress.abandon.success|Commands Abandoned|Count|Total|Number of Cloud to Device Commands abandoned by the device|
|Microsoft.Devices/IotHubs|c2d.commands.egress.reject.success|Commands Rejected|Count|Total|Number of Cloud to Device Commands rejected by the device|
|Microsoft.Devices/IotHubs|devices.totalDevices|Total Devices|Count|Total|Number of devices in your IoT hub|
|Microsoft.Devices/IotHubs|devices.connectedDevices.allProtocol|Connected Devices|Count|Total|Number of connected devices in your IoT hub|
|Microsoft.EventHub/namespaces|INREQS|Incoming Requests|Count|Total||
|Microsoft.EventHub/namespaces|SUCCREQ|Successful Requests|Count|Total||
|Microsoft.EventHub/namespaces|FAILREQ|Failed Requests|Count|Total||
|Microsoft.EventHub/namespaces|SVRBSY|Server Busy Errors|Count|Total||
|Microsoft.EventHub/namespaces|INTERR|Internal Server Errors|Count|Total||
|Microsoft.EventHub/namespaces|MISCERR|Other Errors|Count|Total||
|Microsoft.EventHub/namespaces|INMSGS|Incoming Messages|Count|Total||
|Microsoft.EventHub/namespaces|OUTMSGS|Outgoing Messages|Count|Total||
|Microsoft.EventHub/namespaces|EHINMBS|Incoming bytes per second|BytesPerSecond|Total||
|Microsoft.EventHub/namespaces|EHOUTMBS|Outgoing bytes per second|BytesPerSecond|Total||
|Microsoft.Logic/workflows|RunsStarted|Runs Started|Count|Total|Number of workflow runs started.|
|Microsoft.Logic/workflows|RunsCompleted|Runs Completed|Count|Total|Number of workflow runs completed.|
|Microsoft.Logic/workflows|RunsSucceeded|Runs Succeeded|Count|Total|Number of workflow runs succeeded.|
|Microsoft.Logic/workflows|RunsFailed|Runs Failed|Count|Total|Number of workflow runs failed.|
|Microsoft.Logic/workflows|RunsCancelled|Runs Cancelled|Count|Total|Number of workflow runs cancelled.|
|Microsoft.Logic/workflows|RunLatency|Run Latency|Seconds|Average|Latency of completed workflow runs.|
|Microsoft.Logic/workflows|RunSuccessLatency|Run Success Latency|Seconds|Average|Latency of succeeded workflow runs.|
|Microsoft.Logic/workflows|RunThrottledEvents|Run Throttled Events|Count|Total|Number of workflow action or trigger throttled events.|
|Microsoft.Logic/workflows|ActionsStarted|Actions Started |Count|Total|Number of workflow actions started.|
|Microsoft.Logic/workflows|ActionsCompleted|Actions Completed |Count|Total|Number of workflow actions completed.|
|Microsoft.Logic/workflows|ActionsSucceeded|Actions Succeeded |Count|Total|Number of workflow actions succeeded.|
|Microsoft.Logic/workflows|ActionsFailed|Actions Failed|Count|Total|Number of workflow actions failed.|
|Microsoft.Logic/workflows|ActionsSkipped|Actions Skipped |Count|Total|Number of workflow actions skipped.|
|Microsoft.Logic/workflows|ActionLatency|Action Latency |Seconds|Average|Latency of completed workflow actions.|
|Microsoft.Logic/workflows|ActionSuccessLatency|Action Success Latency |Seconds|Average|Latency of succeeded workflow actions.|
|Microsoft.Logic/workflows|ActionThrottledEvents|Action Throttled Events|Count|Total|Number of workflow action throttled events..|
|Microsoft.Logic/workflows|TriggersStarted|Triggers Started |Count|Total|Number of workflow triggers started.|
|Microsoft.Logic/workflows|TriggersCompleted|Triggers Completed |Count|Total|Number of workflow triggers completed.|
|Microsoft.Logic/workflows|TriggersSucceeded|Triggers Succeeded |Count|Total|Number of workflow triggers succeeded.|
|Microsoft.Logic/workflows|TriggersFailed|Triggers Failed |Count|Total|Number of workflow triggers failed.|
|Microsoft.Logic/workflows|TriggersSkipped|Triggers Skipped|Count|Total|Number of workflow triggers skipped.|
|Microsoft.Logic/workflows|TriggersFired|Triggers Fired |Count|Total|Number of workflow triggers fired.|
|Microsoft.Logic/workflows|TriggerLatency|Trigger Latency |Seconds|Average|Latency of completed workflow triggers.|
|Microsoft.Logic/workflows|TriggerFireLatency|Trigger Fire Latency |Seconds|Average|Latency of fired workflow triggers.|
|Microsoft.Logic/workflows|TriggerSuccessLatency|Trigger Success Latency |Seconds|Average|Latency of succeeded workflow triggers.|
|Microsoft.Logic/workflows|TriggerThrottledEvents|Trigger Throttled Events|Count|Total|Number of workflow trigger throttled events.|
|Microsoft.Search/searchServices|Latency|Latency|Seconds|Average|Average latency for the search service|
|Microsoft.Search/searchServices|SearchLatency|Search Latency|Seconds|Average|Average search latency for the search service|
|Microsoft.Search/searchServices|SearchQueriesPerSecond|Search queries per second|CountPerSecond|Average|Search queries per second for the search service|
|Microsoft.Search/searchServices|ThrottledSearchQueriesPercentage|Throttled search queries percentage|Percent|Average|Percentage of search queries that were throttled for the search service|
|Microsoft.ServiceBus/namespaces|INREQS|Incoming Requests|Count|Total||
|Microsoft.ServiceBus/namespaces|SUCCREQ|Successful Requests|Count|Total||
|Microsoft.ServiceBus/namespaces|FAILREQ|Failed Requests|Count|Total||
|Microsoft.ServiceBus/namespaces|SVRBSY|Server Busy Errors|Count|Total||
|Microsoft.ServiceBus/namespaces|INTERR|Internal Server Errors|Count|Total||
|Microsoft.ServiceBus/namespaces|MISCERR|Other Errors|Count|Total||
|Microsoft.ServiceBus/namespaces|INMSGS|Incoming Messages|Count|Total||
|Microsoft.ServiceBus/namespaces|OUTMSGS|Outgoing Messages|Count|Total||
|Microsoft.ServiceBus/namespaces|CPUXNS|CPU usage per namespace|Percent|Maximum||
|Microsoft.ServiceBus/namespaces|PMSXNS|Memory size usage per namespace|Percent|Maximum||
|Microsoft.Sql/servers/databases|cpu_percent|CPU percentage|Percent|Maximum|CPU percentage|
|Microsoft.Sql/servers/databases|physical_data_read_percent|Data IO percentage|Percent|Maximum|Data IO percentage|
|Microsoft.Sql/servers/databases|log_write_percent|Log IO percentage|Percent|Maximum|Log IO percentage|
|Microsoft.Sql/servers/databases|dtu_consumption_percent|DTU percentage|Percent|Maximum|DTU percentage|
|Microsoft.Sql/servers/databases|storage|Total database size|Bytes|Maximum|Total database size|
|Microsoft.Sql/servers/databases|connection_successful|Successful Connections|Count|Total|Successful Connections|
|Microsoft.Sql/servers/databases|connection_failed|Failed Connections|Count|Total|Failed Connections|
|Microsoft.Sql/servers/databases|blocked_by_firewall|Blocked by Firewall|Count|Total|Blocked by Firewall|
|Microsoft.Sql/servers/databases|deadlock|Deadlocks|Count|Total|Deadlocks|
|Microsoft.Sql/servers/databases|storage_percent|Database size percentage|Percent|Maximum|Database size percentage|
|Microsoft.Sql/servers/databases|workers_percent|Workers percentage|Percent|Maximum|Workers percent|
|Microsoft.Sql/servers/databases|sessions_percent|Sessions percent|Percent|Maximum|Sessions percent|
|Microsoft.Sql/servers/databases|dtu_limit|DTU limit|Count|Maximum|DTU limit|
|Microsoft.Sql/servers/databases|dtu_used|DTU used|Count|Maximum|DTU used|
|Microsoft.Sql/servers/databases|service_level_objective|Service level objective of the database|Count|Total|Service level objective of the database|
|Microsoft.Sql/servers/databases|dwu_limit|dwu limit|Count|Maximum|dwu limit|
|Microsoft.Sql/servers/databases|dwu_consumption_percent|DWU percentage|Percent|Maximum|DWU percentage|
|Microsoft.Sql/servers/databases|dwu_used|DWU used|Count|Maximum|DWU used|
|Microsoft.Sql/servers/elasticPools|cpu_percent|CPU percentage|Percent|Maximum|CPU percentage|
|Microsoft.Sql/servers/elasticPools|physical_data_read_percent|Data IO percentage|Percent|Maximum|Data IO percentage|
|Microsoft.Sql/servers/elasticPools|log_write_percent|Log IO percentage|Percent|Maximum|Log IO percentage|
|Microsoft.Sql/servers/elasticPools|dtu_consumption_percent|DTU percentage|Percent|Maximum|DTU percentage|
|Microsoft.Sql/servers/elasticPools|storage_percent|Storage percentage|Percent|Maximum|Storage percentage|
|Microsoft.Sql/servers/elasticPools|workers_percent|Workers percent|Percent|Maximum|Workers percent|
|Microsoft.Sql/servers/elasticPools|sessions_percent|Sessions percent|Percent|Maximum|Sessions percent|
|Microsoft.Sql/servers/elasticPools|eDTU_limit|eDTU limit|Count|Maximum|eDTU limit|
|Microsoft.Sql/servers/elasticPools|storage_limit|Storage limit|Bytes|Maximum|Storage limit|
|Microsoft.Sql/servers/elasticPools|eDTU_used|eDTU used|Count|Maximum|eDTU used|
|Microsoft.Sql/servers/elasticPools|storage_used|Storage used|Bytes|Maximum|Storage used|



## Next steps

* [Receive alert notifications](insights-receive-alert-notifications.md) whenever a metric crosses a threshold.
* [Enable monitoring and diagnostics](insights-how-to-use-diagnostics.md) to collect detailed high-frequency metrics on your service.
* [Scale instance count automatically](insights-how-to-scale.md) to make sure your service is available and responsive.
* [Monitor application performance](insights-perf-analytics.md) if you want to understand exactly how your code is performing in the cloud.
* Use [Application Insights for JavaScript apps and web pages](../application-insights/app-insights-web-track-usage.md) to get client analytics about the browsers that visit a web page.
* [Monitor availability and responsiveness of any web page](../application-insights/app-insights-monitor-web-app-availability.md) with Application Insights so you can find out if your page is down.
