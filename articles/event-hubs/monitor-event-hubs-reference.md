---
title: Monitoring Azure Event Hubs data reference
description: Important reference material needed when you monitor Azure Event Hubs. 
ms.topic: reference
ms.custom: subject-monitoring
ms.date: 10/06/2022
---


# Monitoring Azure Event Hubs data reference
See [Monitoring Azure Event Hubs](monitor-event-hubs.md) for details on collecting and analyzing monitoring data for Azure Event Hubs.

> [!NOTE]
> Azure Monitor doesn't include dimensions in the exported metrics data, that's sent to a destination like Azure Storage, Azure Event Hubs, Log Analytics, etc.


## Metrics
This section lists all the automatically collected platform metrics collected for Azure Event Hubs. The resource provider for these metrics is **Microsoft.EventHub/clusters** or **Microsoft.EventHub/namespaces**.

### Request metrics
Counts the number of data and management operations requests.

| Metric Name |  Exportable via diagnostic settings | Unit | Aggregation type |  Description | Dimensions | 
| ---------- | ---------- | ----- | --- | --- | --- | 
| Incoming Requests| Yes | Count | Count |  The number of requests made to the Event Hubs service over a specified period. This metric includes all the data and management plane operations. | Entity name| 
| Successful Requests| No | Count | Count |  The number of successful requests made to the Event Hubs service over a specified period. |  Entity name<br/><br/>Operation Result | 
| Throttled Requests| No | Count | Count |   The number of requests that were throttled because the usage was exceeded. | Entity name<br/><br/>Operation Result |

The following two types of errors are classified as **user errors**:

1. Client-side errors (In HTTP that would be 400 errors).
2. Errors that occur while processing messages.


### Message metrics
| Metric Name |  Exportable via diagnostic settings | Unit | Aggregation type |  Description | Dimensions | 
| ---------- | ---------- | ----- | --- | --- | --- | 
|Incoming Messages|  Yes | Count | Count |  The number of events or messages sent to Event Hubs over a specified period. | Entity name|
|Outgoing Messages| Yes | Count | Count |  The number of events or messages received from Event Hubs over a specified period. | Entity name | 
| Captured Messages| No | Count| Count |  The number of captured messages.  |  Entity name | 
|Incoming Bytes | Yes |  Bytes | Count |  Incoming bytes for an event hub over a specified period.  | Entity name| 
|Outgoing Bytes | Yes |  Bytes | Count | Outgoing bytes for an event hub over a specified period.  | Entity name | 
| Size | No |  Bytes | Average |  Size of an event hub in bytes.|Entity name |


> [!NOTE]
> - These values are point-in-time values. Incoming messages that were consumed immediately after that point-in-time may not be reflected in these metrics. 
> - The **Incoming requests** metric includes all the data and management plane operations. The **Incoming messages** metric gives you the total number of events that are sent to the event hub. For example, if you send a batch of 100 events to an event hub, it'll count as 1 incoming request and 100 incoming messages. 

### Capture metrics
| Metric Name |  Exportable via diagnostic settings | Unit | Aggregation type |  Description | Dimensions | 
| ------------------- | ----------------- | --- | --- | --- | --- | 
| Captured Messages| No | Count| Count |  The number of captured messages.  | Entity name |
| Captured Bytes | No | Bytes | Count |  Captured bytes for an event hub | Entity name | 
| Capture Backlog | No | Count| Count |  Capture backlog for an event hub | Entity name | 


### Connection metrics
| Metric Name |  Exportable via diagnostic settings | Unit | Aggregation type |  Description | Dimensions | 
| ------------------- | ----------------- | --- | --- | --- | --- | 
|Active Connections| No | Count | Average | The number of active connections on a namespace and on an entity (event hub) in the namespace. Value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time may not be reflected in the metric.| Entity name | 
|Connections Opened | No | Count | Average |  The number of open connections. | Entity name | 
|Connections Closed | No | Count | Average|  The number of closed connections. | Entity name | 

### Error metrics
| Metric Name |  Exportable via diagnostic settings | Unit | Aggregation type |  Description | Dimensions |
| ------------------- | ----------------- | --- | --- | --- | --- | 
|Server Errors| No | Count | Count |  The number of requests not processed because of an error in the Event Hubs service over a specified period. | Entity name<br/><br/>Operation Result |
|User Errors | No | Count | Count |  The number of requests not processed because of user errors over a specified period. | Entity name<br/><br/>Operation Result|
|Quota Exceeded Errors | No |Count | Count |  The number of errors caused by exceeding quotas over a specified period. | Entity name<br/><br/>Operation Result|

> [!NOTE]
> Logic Apps creates epoch receivers and receivers may be moved from one node to another depending on the service load. During those moves, `ReceiverDisconnection` exceptions may occur. They are counted as user errors on the Event Hubs service side. Logic Apps may collect failures from Event Hubs clients so that you can view them in user logs.

## Metric dimensions

Azure Event Hubs supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you don't add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
| ------------------- | ----------------- |
|Entity Name| Name of the event hub. With the 'Incoming Requests' metric, the Entity Name dimension has a value of '-NamespaceOnlyMetric-' in addition to all your event hubs. It represents the requests that were made at the namespace level. Examples include a  request to list all event hubs in the namespace or requests to entities that failed authentication or authorization.|


## Resource logs

Azure Event Hubs now has the capability to dispatch logs to either of two destination tables - Azure Diagnostic or [Resource specific tables](~/articles/azure-monitor/essentials/resource-logs.md) in Log Analytics. You could use the toggle available on Azure portal to choose destination tables. 

:::image type="content" source="media/monitor-event-hubs-reference/destination-table-toggle.png" alt-text="Screenshot of dialog box to set destination table." lightbox="media/monitor-event-hubs-reference/destination-table-toggle.png":::

[!INCLUDE [event-hubs-diagnostic-log-schema](./includes/event-hubs-diagnostic-log-schema.md)]


## Runtime audit logs
Runtime audit logs capture aggregated diagnostic information for all data plane access operations (such as send or receive events) in Event Hubs. 

> [!NOTE] 
> Runtime audit logs are available only in **premium** and **dedicated** tiers.  

Runtime audit logs include the elements listed in the following table:


Name | Description | Supported in Azure Diagnostics | Supported in Resource Specific table
------- | -------| -----| -----|
`ActivityId` | A randomly generated UUID that ensures uniqueness for the audit activity. | Yes | Yes 
`ActivityName` | Runtime operation name.| Yes | Yes 
`ResourceId` | Resource associated with the activity. | Yes | Yes
`Timestamp` | Aggregation time. | Yes | No
 `TimeGenerated [UTC]`|Time of executed operation (in UTC)| No | Yes
`Status` | Status of the activity (success or failure). | Yes | Yes 
`Protocol` | Type of the protocol associated with the operation. | Yes | Yes 
`AuthType` | Type of authentication (Azure Active Directory or SAS Policy). | Yes | Yes 
`AuthKey` | Azure Active Directory application ID or SAS policy name that's used to authenticate to a resource. | Yes | Yes 
`NetworkType` | Type of the network access: `Public` or `Private`. | Yes | Yes
`ClientIP` | IP address of the client application. | Yes | Yes 
`Count` | Total number of operations performed during the aggregated period of 1 minute. | Yes | Yes 
`Properties` | Metadata that are specific to the data plane operation. | Yes | Yes 
`Category` | Log category | Yes | NO
 `Provider`|Name of Service emitting the logs e.g., Eventhub | No | Yes 
 `Type`  | Type of logs emitted | No | Yes



Here's an example of a runtime audit log entry:

AzureDiagnostics :
```json
{
    "ActivityId": "<activity id>",
    "ActivityName": "ConnectionOpen | Authorization | SendMessage | ReceiveMessage",
    "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs namespace>/eventhubs/<event hub name>",
    "Time": "1/1/2021 8:40:06 PM +00:00",
    "Status": "Success | Failure",
    "Protocol": "AMQP | KAFKA | HTTP | Web Sockets", 
    "AuthType": "SAS | Azure Active Directory", 
    "AuthId": "<AAD application name | SAS policy name>",
    "NetworkType": "Public | Private", 
    "ClientIp": "x.x.x.x",
    "Count": 1,
    "Category": "RuntimeAuditLogs"
 }

```
Resource specific table entry:
```json 
{
    "ActivityId": "<activity id>",
    "ActivityName": "ConnectionOpen | Authorization | SendMessage | ReceiveMessage",
    "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event Hubs namespace>/eventhubs/<event hub name>",
    "TimeGenerated (UTC)": "1/1/2021 8:40:06 PM +00:00",
    "Status": "Success | Failure",
    "Protocol": "AMQP | KAFKA | HTTP | Web Sockets", 
    "AuthType": "SAS | Azure Active Directory", 
    "AuthId": "<AAD application name | SAS policy name>",
    "NetworkType": "Public | Private", 
    "ClientIp": "x.x.x.x",
    "Count": 1,
    "Type": "AZMSRuntimeAUditLogs",
    "Provider":"EVENTHUB"
 }

```

## Application metrics logs
Application metrics logs capture the aggregated information on certain metrics related to data plane operations. The captured information includes the following runtime metrics. 

> [!NOTE] 
> Application metrics logs are available only in **premium** and **dedicated** tiers. 

Name | Description
------- | -------
`ConsumerLag` | Indicate the lag between consumers and producers. 
`NamespaceActiveConnections` | Details of active connections established from a client to the event hub. 
`GetRuntimeInfo` | Obtain run time information from Event Hubs. 
`GetPartitionRuntimeInfo` | Obtain the approximate runtime information for a logical partition of an event hub. 
`IncomingMessages` | Details of number of messages published to Event Hubs. 
`IncomingBytes` | Details of Publisher throughput sent to Event Hubs
`OutgoinMessages` | Details of number of messages consumed from Event Hubs. 
`OutgoingBytes` | Details of Consumer throughput from Event Hubs.
`OffsetCommit` | Number of offset commit calls made to the event hub 
`OffsetFetch` | Number of offset fetch calls made to the event hub.


## Azure Monitor Logs tables
Azure Event Hubs uses Kusto tables from Azure Monitor Logs. You can query these tables with Log Analytics. For a list of Kusto tables the service uses, see [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#event-hubs).

You can view our sample queries to get started with different log categories. 

> [!IMPORTANT]
> Dimensions aren't exported to a Log Analytics workspace. 


## Next steps
- For details on monitoring Azure Event Hubs, see [Monitoring Azure Event Hubs](monitor-event-hubs.md).
- For details on monitoring Azure resources, see [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md).
