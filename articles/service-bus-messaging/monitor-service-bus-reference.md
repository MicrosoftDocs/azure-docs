---
title: Monitoring Azure Service Bus data reference
description: Important reference material needed when you monitor Azure Service Bus. 
ms.topic: reference
ms.custom: subject-monitoring
ms.date: 05/18/2021
---


# Monitoring Azure Service Bus data reference
See [Monitoring Azure Service Bus](monitor-service-bus.md) for details on collecting and analyzing monitoring data for Azure Service Bus.

## Metrics
This section lists all the automatically collected platform metrics collected for Azure Service Bus. The resource provider for these metrics is **Microsoft.ServiceBus/namespaces**.

### Request metrics
Counts the number of data and management operations requests.

| Metric Name | Description |
| ------------------- | ----------------- |
| Incoming Requests| The number of requests made to the Service Bus service over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Successful Requests|The number of successful requests made to the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Server Errors|The number of requests not processed because of an error in the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|User Errors |The number of requests not processed because of user errors over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Throttled Requests|The number of requests that were throttled because the usage was exceeded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|

The following two types of errors are classified as **user errors**:

1. Client-side errors (In HTTP that would be 400 errors).
2. Errors that occur while processing messages, such as [MessageLockLostException](/dotnet/api/microsoft.azure.servicebus.messagelocklostexception).


### Message metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Incoming Messages|The number of events or messages sent to Service Bus over a specified period. This metric doesn't include messages that are auto forwarded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Outgoing Messages|The number of events or messages received from Service Bus over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
| Messages| Count of messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Active Messages| Count of active messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Dead-lettered messages| Count of dead-lettered messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/>Dimension: Entity name |
| Scheduled messages| Count of scheduled messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average  <br/> Dimension: Entity name |
| Completed Messages| Count of completed messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Abandoned Messages| Count of abandoned messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Size | Size of an entity (queue or topic) in bytes. <br/><br/>Unit: Count <br/>Aggregation Type: Average <br/>Dimension: Entity name | 

> [!NOTE]
> Values for messages, active, dead-lettered, scheduled, completed, and abandoned messages are point-in-time values. Incoming messages that were consumed immediately after that point-in-time may not be reflected in these metrics. 

### Connection metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Active Connections|The number of active connections on a namespace and on an entity in the namespace. Value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time may not be reflected in the metric.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Connections Opened |The number of open connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Connections Closed |The number of closed connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|

### Resource usage metrics

> [!NOTE] 
> The following metrics are available only with the **premium** tier. 
> 
> The important metrics to monitor for any outages for a premium tier namespace are: **CPU usage per namespace** and **memory size per namespace**. [Set up alerts](../azure-monitor/alerts/alerts-metric.md) for these metrics using Azure Monitor.
> 
> The other metric you could monitor is: **throttled requests**. It shouldn't be an issue though as long as the namespace stays within its memory, CPU, and brokered connections limits. For more information, see [Throttling in Azure Service Bus Premium tier](service-bus-throttling.md#throttling-in-azure-service-bus-premium-tier)

| Metric Name | Description |
| ------------------- | ----------------- |
|CPU usage per namespace|The percentage CPU usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: Entity name|
|Memory size usage per namespace|The percentage memory usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: Entity name|

## Metric dimensions

Azure Service Bus supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you don't add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
| ------------------- | ----------------- |
|Entity Name| Service Bus supports messaging entities under the namespace.|

## Resource logs
This section lists the types of resource logs you can collect for Azure Service Bus.

- Operational logs
- Virtual network and IP filtering logs

### Operational logs
Operational log entries include elements listed in the following table:

| Name | Description |
| ------- | ------- |
| ActivityId | Internal ID, used to identify the specified activity |
| EventName | Operation name |
| ResourceId | Azure Resource Manager resource ID |
| SubscriptionId | Subscription ID |
| EventTimeString | Operation time |
| EventProperties | Operation properties |
| Status | Operation status |
| Caller | Caller of operation (the Azure portal or management client) |
| Category | OperationalLogs |

Here's an example of an operational log JSON string:

```json
{
  "ActivityId": "0000000000-0000-0000-0000-00000000000000",
  "EventName": "Create Queue",
  "resourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<SERVICE BUS NAMESPACE NAME>",
  "SubscriptionId": "0000000000-0000-0000-0000-00000000000000",
  "EventTimeString": "9/28/2016 8:40:06 PM +00:00",
  "EventProperties": "{\"SubscriptionId\":\"0000000000-0000-0000-0000-00000000000000\",\"Namespace\":\"mynamespace\",\"Via\":\"https://mynamespace.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
  "Status": "Succeeded",
  "Caller": "ServiceBus Client",
  "category": "OperationalLogs"
}
```

### Events and operations captured in operational logs
Operational logs capture all management operations that are performed on the Azure Service Bus namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on Azure Service Bus.

> [!NOTE]
> To help you better track data operations, we recommend using client-side tracing.

The following management operations are captured in operational logs: 

| Scope | Operation|
|-------| -------- |
| Namespace | <ul> <li> Create Namespace</li> <li> Update Namespace </li> <li> Delete Namespace </li> <li> Update Namespace SharedAccess Policy </li> </ul> | 
| Queue | <ul> <li> Create Queue</li> <li> Update Queue</li> <li> Delete Queue </li> <li> AutoDelete Delete Queue </li> </ul> | 
| Topic | <ul> <li> Create Topic </li> <li> Update Topic </li> <li> Delete Topic </li> <li> AutoDelete Delete Topic </li> </ul> |
| Subscription | <ul> <li> Create Subscription </li> <li> Update Subscription </li> <li> Delete Subscription </li> <li> AutoDelete Delete Subscription </li> </ul> |

> [!NOTE]
> Currently, *Read* operations aren't tracked in the operational logs.

## Azure Monitor Logs tables
Azure Service Bus uses Kusto tables from Azure Monitor Logs. You can query these tables with Log Analytics. For a list of Kusto tables the service uses, see [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#service-bus).


## Next steps
- For details on monitoring Azure Service Bus, see [Monitoring Azure Service Bus](monitor-service-bus.md).
- For details on monitoring Azure resources, see [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md).
