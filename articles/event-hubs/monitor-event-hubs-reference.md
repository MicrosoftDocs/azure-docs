---
title: Monitoring data reference for Azure Event Hubs
description: This article contains important reference material you need when you monitor Azure Event Hubs by using Azure Monitor.
ms.date: 06/20/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
---

# Azure Event Hubs monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Event Hubs](monitor-event-hubs.md) for details on the data you can collect for Event Hubs and how to use it.

Azure Event Hubs creates monitoring data using [Azure Monitor](../azure-monitor/overview.md), which is a full stack monitoring service in Azure. Azure Monitor provides a complete set of features to monitor your Azure resources. It can also monitor resources in other clouds and on-premises.

Azure Event Hubs collects the same kinds of monitoring data as other Azure resources that are described in [Monitoring data from Azure resources](../azure-monitor/essentials/monitor-azure-resource.md#monitoring-data).

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.EventHub/clusters

The following table lists the metrics available for the Microsoft.EventHub/clusters resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.EventHub/clusters](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-eventhub-clusters-metrics-include.md)]

### Supported metrics for Microsoft.EventHub/Namespaces

The following table lists the metrics available for the Microsoft.EventHub/Namespaces resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-eventhub-namespaces-metrics-include.md)]

The following tables list all the automatically collected platform metrics collected for Azure Event Hubs. The resource provider for these metrics is `Microsoft.EventHub/clusters` or `Microsoft.EventHub/namespaces`.

*Request metrics* count the number of data and management operations requests. This table provides more information about values from the preceding tables.

| Metric name         | Description |
|:--------------------|:------------|
| Incoming Requests   | The number of requests made to the Event Hubs service over a specified period. This metric includes all the data and management plane operations. |
| Successful Requests | The number of successful requests made to the Event Hubs service over a specified period. |
| Throttled Requests  | The number of requests that were throttled because the usage was exceeded. |

This table provides more information for message metrics from the preceding tables.

| Metric name | Description |
|:------------|:------------|
| Incoming Messages | The number of events or messages sent to Event Hubs over a specified period. |
| Outgoing Messages | The number of events or messages received from Event Hubs over a specified period. |
| Captured Messages | The number of captured messages. |
| Incoming Bytes    | Incoming bytes for an event hub over a specified period. |
| Outgoing Bytes    | Outgoing bytes for an event hub over a specified period. |
| Size              | Size of an event hub in bytes. |

> [!NOTE]
> - These values are point-in-time values. Incoming messages that are consumed immediately after that point-in-time might not be reflected in these metrics.
> - The Incoming Requests metric includes all the data and management plane operations. The Incoming Messages metric gives you the total number of events that are sent to the event hub. For example, if you send a batch of 100 events to an event hub, it counts as 1 incoming request and 100 incoming messages.

This table provides more information for capture metrics from the preceding tables.

| Metric name | Description |
|:------------|:------------|
| Captured Messages | The number of captured messages.  |
| Captured Bytes    | Captured bytes for an event hub.  |
| Capture Backlog   | Capture backlog for an event hub. |

This table provides more information for connection metrics from the preceding tables.

| Metric name | Description |
|:------------|:------------|
| Active Connections | The number of active connections on a namespace and on an entity (event hub) in the namespace. Value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time might not be reflected in the metric. |
| Connections Opened | The number of open connections. |
| Connections Closed | The number of closed connections. |

This table provides more information for error metrics from the preceding tables.

| Metric name | Description |
|:------------|:------------|
| Server Errors         | The number of requests not processed because of an error in the Event Hubs service over a specified period. |
| User Errors           | The number of requests not processed because of user errors over a specified period. |
| Quota Exceeded Errors | The number of errors caused by exceeding quotas over a specified period. |

The following two types of errors are classified as *user errors*:

1. Client-side errors (In HTTP that would be 400 errors).
2. Errors that occur while processing messages.

> [!NOTE]
> Logic Apps creates epoch receivers. Receivers can be moved from one node to another depending on the service load. During those moves, `ReceiverDisconnection` exceptions might occur. They are counted as user errors on the Event Hubs service side. Logic Apps can collect failures from Event Hubs clients so that you can view them in user logs.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

| Dimension name  | Description |
|:----------------|:------------|
| EntityName      | Name of the event hub. With the 'Incoming Requests' metric, the Entity Name dimension has a value of `-NamespaceOnlyMetric-` in addition to all your event hubs. It represents the requests that were made at the namespace level. Examples include a  request to list all event hubs in the namespace or requests to entities that failed authentication or authorization. |
| OperationResult | Either indicates `success` or the appropriate error state, such as `serverbusy`, `clienterror` or `quotaexceeded`. |

Adding dimensions to your metrics is optional. If you don't add dimensions, metrics are specified at the namespace level.

> [!NOTE]
> When you enable metrics in a diagnostic setting, dimension information isn't currently included as part of the information sent to a storage account, event hub, or log analytics.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.EventHub/Namespaces

[!INCLUDE [Microsoft.EventHub/Namespaces](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-eventhub-namespaces-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Event Hubs Microsoft.EventHub/namespaces

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)
- [AZMSApplicationMetricLogs](/azure/azure-monitor/reference/tables/azmsapplicationmetriclogs#columns)
- [AZMSOperationalLogs](/azure/azure-monitor/reference/tables/azmsoperationallogs#columns)
- [AZMSRunTimeAuditLogs](/azure/azure-monitor/reference/tables/azmsruntimeauditlogs#columns)
- [AZMSDiagnosticErrorLogs](/azure/azure-monitor/reference/tables/azmsdiagnosticerrorlogs#columns)
- [AZMSVnetConnectionEvents](/azure/azure-monitor/reference/tables/azmsvnetconnectionevents#columns)
- [AZMSArchiveLogs](/azure/azure-monitor/reference/tables/azmsarchivelogs#columns)
- [AZMSAutoscaleLogs](/azure/azure-monitor/reference/tables/azmsautoscalelogs#columns)
- [AZMSKafkaCoordinatorLogs](/azure/azure-monitor/reference/tables/azmskafkacoordinatorlogs#columns)
- [AZMSKafkaUserErrorLogs](/azure/azure-monitor/reference/tables/azmskafkausererrorlogs#columns)
- [AZMSCustomerManagedKeyUserLogs](/azure/azure-monitor/reference/tables/azmscustomermanagedkeyuserlogs#columns)

### Event Hubs resource logs

Azure Event Hubs now has the capability to dispatch logs to either of two destination tables: Azure Diagnostic or [Resource specific tables](~/articles/azure-monitor/essentials/resource-logs.md) in Log Analytics. You could use the toggle available on Azure portal to choose destination tables.

:::image type="content" source="media/monitor-event-hubs-reference/destination-table-toggle.png" alt-text="Screenshot of dialog box to set destination table." lightbox="media/monitor-event-hubs-reference/destination-table-toggle.png":::

Azure Event Hubs uses Kusto tables from Azure Monitor Logs. You can query these tables with Log Analytics. For a list of Kusto tables the service uses, see [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#event-hubs).

You can view our sample queries to get started with different log categories.

> [!IMPORTANT]
> Dimensions aren't exported to a Log Analytics workspace.

[!INCLUDE [event-hubs-diagnostic-log-schema](./includes/event-hubs-diagnostic-log-schema.md)]

### Runtime audit logs

Runtime audit logs capture aggregated diagnostic information for all data plane access operations (such as send or receive events) in Event Hubs.

> [!NOTE]
> Runtime audit logs are available only in **premium** and **dedicated** tiers.  

Runtime audit logs include the elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in Resource Specific table |
|:------- |:-------|:-----|:-----|
| `ActivityId` | A randomly generated UUID that ensures uniqueness for the audit activity. | Yes | Yes  |
| `ActivityName` | Runtime operation name.| Yes | Yes  |
| `ResourceId` | Resource associated with the activity. | Yes | Yes |
| `Timestamp` | Aggregation time. | Yes | No |
| `TimeGenerated [UTC]`|Time of executed operation (in UTC) | No | Yes |
| `Status` | Status of the activity (success or failure). | Yes | Yes  |
| `Protocol` | Type of the protocol associated with the operation. | Yes | Yes  |
| `AuthType` | Type of authentication (Microsoft Entra ID or SAS Policy). | Yes | Yes  |
| `AuthKey` | Microsoft Entra ID application ID or SAS policy name that's used to authenticate to a resource. | Yes | Yes  |
| `NetworkType` | Type of the network access: `Public` or `Private`. | Yes | Yes |
| `ClientIP` | IP address of the client application. | Yes | Yes  |
| `Count` | Total number of operations performed during the aggregated period of 1 minute. | Yes | Yes  |
| `Properties` | Metadata that are specific to the data plane operation. | Yes | Yes  |
| `Category` | Log category | Yes | No |
| `Provider`|Name of Service emitting the logs, such as EventHubs | No | Yes  |
| `Type`  | Type of logs emitted | No | Yes |

Here's an example of a runtime audit log entry:

AzureDiagnostics:

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

### Application metrics logs

Application metrics logs capture the aggregated information on certain metrics related to data plane operations. The captured information includes the following runtime metrics.

> [!NOTE]
> Application metrics logs are available only in **premium** and **dedicated** tiers.

| Name | Description |
|:-------|:------- |
| `ConsumerLag` | Indicate the lag between consumers and producers.  |
| `NamespaceActiveConnections` | Details of active connections established from a client to the event hub.  |
| `GetRuntimeInfo` | Obtain run time information from Event Hubs.  |
| `GetPartitionRuntimeInfo` | Obtain the approximate runtime information for a logical partition of an event hub.  |
| `IncomingMessages` | Details of number of messages published to Event Hubs.  |
| `IncomingBytes` | Details of Publisher throughput sent to Event Hubs |
| `OutgoingMessages` | Details of number of messages consumed from Event Hubs.  |
| `OutgoingBytes` | Details of Consumer throughput from Event Hubs. |
| `OffsetCommit` | Number of offset commit calls made to the event hub  |
| `OffsetFetch` | Number of offset fetch calls made to the event hub. |

### Diagnostic Error Logs

Diagnostic error logs capture error messages for any client side, throttling, and Quota exceeded errors. They provide detailed diagnostics for error identification.

Diagnostic Error Logs include elements listed in following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSDiagnosticErrorLogs (Resource specific table) |
|:---|:---|:---|:---|
| `ActivityId` | A randomly generated UUID that ensures uniqueness for the audit activity. | Yes | Yes |
| `ActivityName` | Operation name  | Yes | Yes |
| `NamespaceName` | Name of Namespace | Yes | yes |
| `EntityType` | Type of Entity | Yes | Yes  |
| `EntityName` | Name of Entity | Yes | Yes   |
| `OperationResult` | Type of error in Operation (`clienterror` or `serverbusy` or `quotaexceeded`) | Yes | Yes |
| `ErrorCount` | Count of identical errors during the aggregation period of 1 minute. | Yes | Yes  |
| `ErrorMessage` | Detailed Error Message | Yes | Yes  |
| `ResourceProvider` | Name of Service emitting the logs. Possible values: `Microsoft.EventHub` and `Microsoft.ServiceBus` | Yes | Yes  |
| `Time Generated (UTC)` | Operation time | No | Yes |
| `EventTimestamp` | Operation Time | Yes | No |
| `Category` | Log category | Yes | No |
| `Type`  | Type of Logs emitted | No | Yes |

Here's an example of Diagnostic error log entry:

```json
{
    "ActivityId": "0000000000-0000-0000-0000-00000000000000",
    "SubscriptionId": "<Azure Subscription Id",
    "NamespaceName": "Name of Event Hubs Namespace",
    "EntityType": "EventHub",
    "EntityName": "Name of Event Hub",
    "ActivityName": "SendMessage",
    "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event hub namespace name>",,
    "OperationResult": "ServerBusy",
    "ErrorCount": 1,
    "EventTimestamp": "3/27/2024 1:02:29.126 PM +00:00",
    "ErrorMessage": "the request was terminated because the entity is being throttled by the application group with application group name <application group name> and policy name <throttling policy name>.error code: 50013.",
    "category": "DiagnosticErrorLogs"
 }

```

Resource specific table entry:

```json
{
    "ActivityId": "0000000000-0000-0000-0000-00000000000000",
    "NamespaceName": "Name of Event Hubs Namespace",
    "EntityType": "Event Hub",
    "EntityName": "Name of Event Hub",
    "ActivityName": "SendMessage",
    "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/<Event hub namespace name>",,
    "OperationResult": "ServerBusy",
    "ErrorCount": 1,
    "TimeGenerated [UTC]": "1/27/2024 4:02:29.126 PM +00:00",
    "ErrorMessage": "The request was terminated because the entity is being throttled by the application group with application group name <application group name> and policy name <throttling policy name>.error code: 50013.",
    "Type": "AZMSDiagnosticErrorLogs"
 }

```

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.EventHub resource provider operations](/azure/role-based-access-control/permissions/integration#microsofteventhub)

## Related content

- See [Monitor Azure Event Hubs](monitor-event-hubs.md) for a description of monitoring Event Hubs.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
