---
title: Monitoring [TODO-replace-with-service-name] data reference #Required; *your official service name*  
description: Important reference material needed when you monitor [TODO-replace-with-service-name] 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; Microsoft alias of author; optional team alias.
ms.topic: subject-monitoring
ms.service: #Required; service you are monitoring
ms.date: #Required; mm/dd/yyyy format.
---
<!-- VERSION 2
Template for monitoring data reference article for Azure services. This article is support for the main "Monitor [servicename]" article for the service. -->

<!-- IMPORTANT STEP 1.  Do a search and replace of [TODO-replace-with-service-name] with the name of your service. That will make the template easier to read -->

# Monitoring [TODO-replace-with-service-name] data reference

See [Monitor [TODO-replace-with-service-name]](monitor-service.md) for details on collecting and analyzing monitoring data for [TODO-replace-with-service-name].

## Metrics

This section lists all the automatically collected platform metrics collected for Azure IoT Hub. The resource provider namespace for IoT Hub metrics is Microsoft.Devices and the type Namespace is IoTHubs. The following sub-sections provide important information specific to IoT Hub metrics, break them out by general category, and list them by the display name that they appear in the Azure portal with. You can also find a listing of the IoT Hub metrics by metric name, see [Microsoft.Devices/IotHubs](/azure/azure-monitor/platform/metrics-supported#microsoftdevicesiothubs). To learn about metrics supported by other Azure services, you can see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).

### Supported aggregations

The **Aggregation Type** column in each table corresponds to the default aggregation that is used when the metric is selected for a chart or alert.

   ![Screenshot showing aggregation for metrics](./media/iot-hub-metrics-reference/aggregation-type.png)

For most metrics, all aggregation types are valid; however, for count metrics, those with a **Unit** column value of **Count**, only some aggregations are valid. Count metrics can be one of two types:

* For **Single-point** count metrics, IoT Hub registers a single data point -- essentially a 1 -- every time the measured operation occurs. Azure Monitor then sums these data points over the specified granularity. Examples of **Single-point** metrics are *Telemetry messages sent* and *C2D message deliveries completed*. For these metrics, the only relevant aggregation type is Total (Sum). The portal allows you to choose minimum, maximum, and average; however, these values will always be 1.

* For **Snapshot** count metrics, IoT Hub registers a total count when the measured operation occurs. Currently, there are three **Snapshot** metrics emitted by IoT Hub: *Total number of messages used*, *Total devices (preview)*, and *Connected devices (preview)*. Because these metrics present a "total" quantity every time they are emitted, summing them over the specified granularity makes no sense. Azure Monitor limits you to selecting average, minimum, and maximum for the aggregation type for these metrics.

### Cloud to device command metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|C2D Messages Expired (preview)|C2DMessagesExpired|Count|Total|Number of expired cloud-to-device messages|None|
|C2D message deliveries completed|c2d.commands.egress.<br>complete.success|Count|Total|Number of cloud-to-device message deliveries completed successfully by the device|None|
|C2D messages abandoned|c2d.commands.egress.<br>abandon.success|Count|Total|Number of cloud-to-device messages abandoned by the device|None|
|C2D messages rejected|c2d.commands.egress.<br>reject.success|Count|Total|Number of cloud-to-device messages rejected by the device|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Cloud to device direct methods metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Failed direct method invocations|c2d.methods.failure|Count|Total|The count of all failed direct method calls.|None|
|Request size of direct method invocations|c2d.methods.requestSize|Bytes|Average|The count of all successful direct method requests.|None|
|Response size of direct method invocations|c2d.methods.responseSize|Bytes|Average|The count of all successful direct method responses.|None|
|Successful direct method invocations|c2d.methods.success|Count|Total|The count of all successful direct method calls.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Cloud to device twin operations metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Failed twin reads from back end|c2d.twin.read.failure|Count|Total|The count of all failed back-end-initiated twin reads.|None|
|Failed twin updates from back end|c2d.twin.update.failure|Count|Total|The count of all failed back-end-initiated twin updates.|None|
|Response size of twin reads from back end|c2d.twin.read.size|Bytes|Average|The count of all successful back-end-initiated twin reads.|None|
|Size of twin updates from back end|c2d.twin.update.size|Bytes|Average|The total size of all successful back-end-initiated twin updates.|None|
|Successful twin reads from back end|c2d.twin.read.success|Count|Total|The count of all successful back-end-initiated twin reads.|None|
|Successful twin updates from back end|c2d.twin.update.success|Count|Total|The count of all successful back-end-initiated twin updates.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Configurations metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Configuration Metrics|configurations|Count|Total|Number of total CRUD operations performed for device configuration and IoT Edge deployment, on a set of target devices. This also includes the number of operations that modify the device twin or module twin because of these configurations.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Daily quota metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Total device data usage|deviceDataUsage|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|Total device data usage (preview)|deviceDataUsageV2|Bytes|Total|Bytes transferred to and from any devices connected to IotHub|None|
|Total number of messages used|dailyMessageQuotaUsed|Count|Average|Number of total messages used today. This is a cumulative value that is reset to zero at 00:00 UTC every day.|None|

For *Total number of messages used* only minimum, maximum, and average aggregations are supported. For more information, see [Supported aggregations](#supported-aggregations).

### Device metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Total devices (deprecated)|devices.totalDevices|Count|Total|Number of devices registered to your IoT hub|None|
|Connected devices (deprecated) |devices.connectedDevices.<br>allProtocol|Count|Total|Number of devices connected to your IoT hub|None|
|Total devices (preview)|totalDeviceCount|Count|Average|Number of devices registered to your IoT hub|None|
|Connected devices (preview)|connectedDeviceCount|Count|Average|Number of devices connected to your IoT hub|None|

For *Total devices (deprecated)* and *Connected devices (deprecated)* only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

For *Total devices (preview)* and *Connected devices (preview)* only minimum, maximum, and average aggregations are valid. For more information, see [Supported aggregations](#supported-aggregations).

### Device telemetry metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Number of throttling errors|d2c.telemetry.ingress.<br>sendThrottle|Count|Total|Number of throttling errors due to device throughput throttles|None|
|Telemetry message send attempts|d2c.telemetry.ingress.<br>allProtocol|Count|Total|Number of device-to-cloud telemetry messages attempted to be sent to your IoT hub|None|
|Telemetry messages sent|d2c.telemetry.ingress.<br>success|Count|Total|Number of device-to-cloud telemetry messages sent successfully to your IoT hub|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Device to cloud twin operations metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Failed twin reads from devices|d2c.twin.read.failure|Count|Total|The count of all failed device-initiated twin reads.|None|
|Failed twin updates from devices|d2c.twin.update.failure|Count|Total|The count of all failed device-initiated twin updates.|None|
|Response size of twin reads from devices|d2c.twin.read.size|Bytes|Average|The number of all successful device-initiated twin reads.|None|
|Size of twin updates from devices|d2c.twin.update.size|Bytes|Average|The total size of all successful device-initiated twin updates.|None|
|Successful twin reads from devices|d2c.twin.read.success|Count|Total|The count of all successful device-initiated twin reads.|None|
|Successful twin updates from devices|d2c.twin.update.success|Count|Total|The count of all successful device-initiated twin updates.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Event grid metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Event Grid deliveries(preview)|EventGridDeliveries|Count|Total|The number of IoT Hub events published to Event Grid. Use the Result dimension for the number of successful and failed requests. EventType dimension shows the type of event (https://aka.ms/ioteventgrid).|ResourceId,<br/>Result,<br/>EventType|
|Event Grid latency (preview)|EventGridLatency|Milliseconds|Average|The average latency (milliseconds) from when the Iot Hub event was generated to when the event was published to Event Grid. This number is an average between all event types. Use the EventType dimension to see latency of a specific type of event.|ResourceId,<br/>EventType|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Jobs metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Completed jobs|jobs.completed|Count|Total|The count of all completed jobs.|None|
|Failed calls to list jobs|jobs.listJobs.failure|Count|Total|The count of all failed calls to list jobs.|None|
|Failed creations of method invocation jobs|jobs.createDirectMethodJob.<br>failure|Count|Total|The count of all failed creation of direct method invocation jobs.|None|
|Failed creations of twin update jobs|jobs.createTwinUpdateJob.<br>failure|Count|Total|The count of all failed creation of twin update jobs.|None|
|Failed job cancellations|jobs.cancelJob.failure|Count|Total|The count of all failed calls to cancel a job.|None|
|Failed job queries|jobs.queryJobs.failure|Count|Total|The count of all failed calls to query jobs.|None|
|Failed jobs|jobs.failed|Count|Total|The count of all failed jobs.|None|
|Successful calls to list jobs|jobs.listJobs.success|Count|Total|The count of all successful calls to list jobs.|None|
|Successful creations of method invocation jobs|jobs.createDirectMethodJob.<br>success|Count|Total|The count of all successful creation of direct method invocation jobs.|None|
|Successful creations of twin update jobs|jobs.createTwinUpdateJob.<br>success|Count|Total|The count of all successful creation of twin update jobs.|None|
|Successful job cancellations|jobs.cancelJob.success|Count|Total|The count of all successful calls to cancel a job.|None|
|Successful job queries|jobs.queryJobs.success|Count|Total|The count of all successful calls to query jobs.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Routing metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
| Routing Delivery Attempts (preview) |RoutingDeliveries | Count | Total |This is the routing delivery metric. Use the dimensions to identify the delivery status for a specific endpoint or for a specific routing source.| ResourceID,<br>Result,<br>RoutingSource,<br>EndpointType,<br>FailureReasonCategory,<br>EndpointName<br>*For more information, see [Metric dimensions](#metric-dimensions)*. |
| Routing Delivery Data Size In Bytes (preview)|RoutingDataSizeInBytesDelivered| Bytes | Total |The total number of bytes routed by IoT Hub to custom endpoint and built-in endpoint. Use the dimensions to identify data size routed to a specific endpoint or for a specific routing source.| ResourceID,<br>RoutingSource,<br>EndpointType<br>EndpointName<br>*For more information, see [Metric dimensions](#metric-dimensions)*.|
| Routing Latency (preview) |RoutingDeliveryLatency| Milliseconds | Average |This is the routing delivery latency metric. Use the dimensions to identify the latency for a specific endpoint or for a specific routing source.| ResourceID,<br>RoutingSource,<br>EndpointType,<br>EndpointName<br>*For more information, see [Metric dimensions](#metric-dimensions)*.|
|Routing: blobs delivered to storage|d2c.endpoints.egress.<br>storage.blobs|Count|Total|The number of times IoT Hub routing delivered blobs to storage endpoints.|None|
|Routing: data delivered to storage|d2c.endpoints.egress.<br>storage.bytes|Bytes|Total|The amount of data (bytes) IoT Hub routing delivered to storage endpoints.|None|
|Routing: message latency for Event Hub|d2c.endpoints.latency.<br>eventHubs|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into custom endpoints of type Event Hub. This does not include messages routes to built-in endpoint (events).|None|
|Routing: message latency for Service Bus Queue|d2c.endpoints.latency.<br>serviceBusQueues|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus queue endpoint.|None|
|Routing: message latency for Service Bus Topic|d2c.endpoints.latency.<br>serviceBusTopics|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a Service Bus topic endpoint.|None|
|Routing: message latency for messages/events|d2c.endpoints.latency.<br>builtIn.events|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into the built-in endpoint (messages/events) and fallback route.|None|
|Routing: message latency for storage|d2c.endpoints.latency.<br>storage|Milliseconds|Average|The average latency (milliseconds) between message ingress to IoT Hub and message ingress into a storage endpoint.|None|
|Routing: messages delivered to Event Hub|d2c.endpoints.egress.<br>eventHubs|Count|Total|The number of times IoT Hub routing successfully delivered messages to custom endpoints of type Event Hub. This does not include messages routes to built-in endpoint (events).|None|
|Routing: messages delivered to Service Bus Queue|d2c.endpoints.egress.<br>serviceBusQueues|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus queue endpoints.|None|
|Routing: messages delivered to Service Bus Topic|d2c.endpoints.egress.<br>serviceBusTopics|Count|Total|The number of times IoT Hub routing successfully delivered messages to Service Bus topic endpoints.|None|
|Routing: messages delivered to fallback|d2c.telemetry.egress.<br>fallback|Count|Total|The number of times IoT Hub routing delivered messages to the endpoint associated with the fallback route.|None|
|Routing: messages delivered to messages/events|d2c.endpoints.egress.<br>builtIn.events|Count|Total|The number of times IoT Hub routing successfully delivered messages to the built-in endpoint (messages/events) and fallback route.|None|
|Routing: messages delivered to storage|d2c.endpoints.egress.<br>storage|Count|Total|The number of times IoT Hub routing successfully delivered messages to storage endpoints.|None|
|Routing: telemetry messages delivered|d2c.telemetry.egress.<br>success|Count|Total|The number of times messages were successfully delivered to all endpoints using IoT Hub routing. If a message is routed to multiple endpoints, this value increases by one for each successful delivery. If a message is delivered to the same endpoint multiple times, this value increases by one for each successful delivery.|None|
|Routing: telemetry messages dropped |d2c.telemetry.egress.<br>dropped|Count|Total|The number of times messages were dropped by IoT Hub routing due to dead endpoints. This value does not count messages delivered to fallback route as dropped messages are not delivered there.|None|
|Routing: telemetry messages incompatible|d2c.telemetry.egress.<br>invalid|Count|Total|The number of times IoT Hub routing failed to deliver messages due to an incompatibility with the endpoint. A message is incompatible with an endpoint when Iot Hub attempts to deliver the message to an endpoint and it fails with an non transient error. Invalid messages are not retried. This value does not include retries.|None|
|Routing: telemetry messages orphaned |d2c.telemetry.egress.<br>orphaned|Count|Total|The number of times messages were orphaned by IoT Hub routing because they didn't match any routing query, when fallback route is disabled.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

### Twin query metrics

|Metric Display Name|Metric|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|
|Failed twin queries|twinQueries.failure|Count|Total|The count of all failed twin queries.|None|
|Successful twin queries|twinQueries.success|Count|Total|The count of all successful twin queries.|None|
|Twin queries result size|twinQueries.resultSize|Bytes|Average|The total of the result size of all successful twin queries.|None|

For metrics with a **Unit** value of **Count** only total (sum) aggregation is valid. Minimum, maximum, and average aggregations always return 1. For more information, see [Supported aggregations](#supported-aggregations).

## Metric dimensions

Azure IoT Hub has the following dimensions associated with some of its routing metrics.

|Dimension Name | Description|
|---|---|
|**ResourceID**|Your IoT Hub resource ID.|
|**Result**| Either **success** or **failure**.|
|**RoutingSource**| Device Messages<br>Twin Change Events<br>Device Lifecycle Events|
|**EndpointType**|One of the following: **eventHubs**, **serviceBusQueues**, **cosmosDB**, **serviceBusTopics**. **builtin**, or **blobStorage**.|
|**FailureReasonCategory**| One of the following: **invalid**, **dropped**, **orphaned**, or **null**.|
|**EndpointName**| The endpoint name.|

To learn more about metric dimensions, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for [TODO-replace-with-service-name]. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-categories, which is auto generated from the REST API.  Not all resource log types metrics are published depending on whether your product group wants them to be.  If the resource log is published, but category display names are wrong or missing, contact your PM and tell them to update them in the Azure Monitor "shoebox" manifest.  If this article is missing resource logs that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the resource log category types collected for [TODO-replace-with-service-name].  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Web Sites

Resource Provider and Type: [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

### Web Site Slots

Resource Provider and Type: [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

--------------**END Examples** -------------

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to [TODO-replace-with-service-name] and available for query by Log Analytics. 

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

|Resource Type | Notes |
|-------|-----|
| [Virtual Machines](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machines) | |
| [Virtual machine scale sets](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | |

--------------**OPTION 2 EXAMPLE** -------------

<!--  OPTION 2 -  List out your tables adding additional information on what each table is for. Individually link to each table using the table name.  For example, link to [AzureMetrics](https://docs.microsoft.com/azure/azure-monitor/reference/tables/azuremetrics).  

NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the automatically generated list. You can group these sections however you want provided you include the proper links back to the proper tables. 
-->

### Virtual Machines

| Table |  Description | *TODO replace this label with proper title for your additional information*  |
|:---------|:-------------|------------------|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)   | <!-- description copied from previous link --> Entries from the Azure Activity log that provides insight into any subscription-level or management group level events that have occurred in Azure. | *TODO other important information about this type |
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | <!-- description copied from previous link --> Metric data emitted by Azure services that measure their health and performance.    | *TODO other important information about this type |
|  etc.               |                              |                                                   |  

### Virtual Machine Scale Sets

| Table |  Description | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| [ADAssessmentRecommendation](/azure/azure-monitor/reference/tables/adassessmentrecommendation)   | <!-- description copied from previous link --> Recommendations generated by AD assessments that are started through a scheduled task. When you schedule the assessment it runs by default every 7 days and upload the data into Azure Log Analytics | *TODO other important information about this type |
| [ADReplicationResult](/azure/azure-monitor/reference/tables/adreplicationresult) | <!-- description copied from previous link --> The AD Replication Status solution regularly monitors your Active Directory environment for any replication failures.    | *TODO other important information about this type |
|  etc.               |                              |                                                   |  

<!-- Add extra information if required -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

--------------**END EXAMPLES** -------------

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

[TODO-replace-with-service-name] uses the [Azure Diagnostics](https://docs.microsoft.com/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to [TODO-replace-with-service-name] that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by [TODO-replace-with-service-name]

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitor Azure [TODO-replace-with-service-name]](monitor-service-name.md) for a description of monitoring Azure [TODO-replace-with-service-name].
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.