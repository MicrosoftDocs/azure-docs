---
title: Monitoring data reference for Azure Service Bus
description: This article contains important reference material you need when you monitor Azure Service Bus by using Azure Monitor.
ms.date: 07/22/2024
ms.custom: horz-monitor
ms.topic: reference
author: spelluru
ms.author: spelluru 
---
# Azure Service Bus monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Service Bus](monitor-service-bus.md) for details on the data you can collect for Service Bus and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.ServiceBus/Namespaces

The following table lists the metrics available for the Microsoft.ServiceBus/Namespaces resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.ServiceBus/Namespaces](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-servicebus-namespaces-metrics-include.md)]

The following sections provide more detailed descriptions for metrics presented in the previous section.

### Request metrics

*Request metrics* count the number of data and management operations requests.

| Metric | Description |
|:-------|:------------|
| Incoming Requests | The number of requests made to the Service Bus service over a specified period. |
| Successful Requests | The number of successful requests made to the Service Bus service over a specified period. |
| [Server Errors](service-bus-messaging-exceptions.md#exception-categories) | The number of requests not processed because of an error in the Service Bus service over a specified period. |
| [User Errors](service-bus-messaging-exceptions.md#exception-categories) | The number of requests not processed because of user errors over a specified period. |
| Throttled Requests | The number of requests that were throttled because the usage was exceeded.</p><p>MessagingErrorSubCode dimension has the following possible values: <br/><ul><li><b>CPU:</b> CPU throttling</li><li><b>Storage:</b>It indicates throttle because of pending checkpoint operations</li><li><b>Namespace:</b>Namespace operations throttling.</li><li><b>Unknown:</b> Other resource throttling.</li></p> |
| Pending Checkpoint Operations Count | The number of pending checkpoint operations on the namespace. Service starts to throttle when the pending checkpoint count exceeds limit of (500,000 + (500,000 * messaging units)) operations. This metric applies only to namespaces using the **premium** tier. |
| Server Send Latency | The time taken by the Service Bus service to complete the request. |

The following two types of errors are classified as *user errors*:

- Client-side errors (In HTTP that would be 400 errors).
- Errors that occur while processing messages, such as [MessageLockLostException](/dotnet/api/azure.messaging.servicebus.servicebusfailurereason).

### Message metrics

The following metrics are *message metrics*.

| Metric | Description |
|:-------|:------------|
| Incoming Messages | The number of events or messages sent to Service Bus over a specified period. For basic and standard tiers, incoming autoforwarded messages are included in this metric. And, for the premium tier, they aren't included. |
| Outgoing Messages | The number of events or messages received from Service Bus over a specified period. The outgoing autoforwarded messages aren't included in this metric. |
| Messages | Count of messages in a queue/topic. This metric includes messages in all the different states like active, dead-lettered, scheduled, etc. |
| Active Messages | Count of active messages in a queue/topic. Active messages are the messages in the queue or subscription that are in the active state and ready for delivery. The messages are available to be received. |
| Dead-lettered messages | Count of dead-lettered messages in a queue/topic. |
| Scheduled messages | Count of scheduled messages in a queue/topic. |
| Completed Messages | The number of messages completed over a specified period. |
| Abandoned Messages | The number of messages abandoned over a specified period. |
| Size | Size of an entity (queue or topic) in bytes. |

> [!IMPORTANT]
> Values for messages, active, dead-lettered, scheduled, completed, and abandoned messages are point-in-time values. Incoming messages that were consumed immediately after that point-in-time might not be reflected in these metrics.

> [!NOTE]
> When a client tries to get the info about a queue or topic, the Service Bus service returns some static information such as name, last updated time, created time, and requires session or not. Some dynamic information like message counts. If the request gets throttled, the service returns the static information and empty dynamic information. That's why message counts are shown as 0 when the namespace is being throttled. This behavior is by design. 

### Connection metrics

The following metrics are *connection metrics*.

| Metric | Description |
|:-------|:------------|
| Active Connections | The number of active connections on a namespace and on an entity in the namespace. Value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time may not be reflected in the metric. |
| Connections Opened | The number of connections opened. Value for this metric is an aggregation, and includes all connections that were opened in the aggregation time window. |
| Connections Closed | The number of connections closed. Value for this metric is an aggregation, and includes all connections that were opened in the aggregation time window. |

### Resource usage metrics

The following *resource metric* is available only with the **premium** tier.

| Metric | Description |
|:-------|:------------|
| CPU usage per namespace | The percentage CPU usage of the namespace. |


The important metrics to monitor for any outages for a premium tier namespace are: **CPU usage per namespace** and **memory size per namespace**. [Set up alerts](/azure/azure-monitor/alerts/alerts-metric) for these metrics using Azure Monitor.

The other metric you could monitor is: **throttled requests**. It shouldn't be an issue though as long as the namespace stays within its memory, CPU, and brokered connections limits. For more information, see [Throttling in Azure Service Bus Premium tier](service-bus-throttling.md#throttling-in-premium-tier)

### Error metrics

The following metrics are *error metrics*.

| Metric | Description |
|:-------|:------------|
| Server Errors | The number of requests not processed because of an error in the Service Bus service over a specified period. |
| User Errors | The number of requests not processed because of user errors over a specified period. |

### Geo-Replication metrics

The following metrics are *geo-replication* metrics:

| Metric | Description |
|:-------|:------------|
| Replication Lag Duration | The offset in seconds between the latest action on the primary and the secondary regions. |
| Replication Lag Count | The offset in number of operations between the latest action on the primary and the secondary regions. |

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- **EntityName** Service Bus supports messaging entities under the namespace. With the Incoming Requests metric, the Entity Name dimension has a value of `-NamespaceOnlyMetric-` in addition to all your queues and topics. This value represents the request, which was made at the namespace level. Examples include a  request to list all queues/topics under the namespace or requests to entities that failed authentication or authorization.
- **MessagingErrorSubCode**
- **OperationResult**
- **Replica**

> [!NOTE]
> Azure Monitor doesn't include dimensions in the exported metrics data sent to a destination like Azure Storage, Azure Event Hubs, or Azure Monitor Logs.

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.ServiceBus/Namespaces

[!INCLUDE [<ResourceType/namespace>](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-servicebus-namespaces-logs-include.md)]

This section lists the types of resource logs you can collect for Azure Service Bus.

- Operational logs
- Virtual network and IP filtering logs
- Runtime Audit logs

Azure Service Bus now has the capability to dispatch logs to either of two destination tables - Azure Diagnostic or [Resource specific tables](/azure/azure-monitor/essentials/resource-logs) in Log Analytics. You could use the toggle available on Azure portal to choose destination tables. 

:::image type="content" source="media/monitor-service-bus-reference/destination-table-toggle.png" alt-text="Screenshot of dialog box to set destination table." lightbox="media/monitor-service-bus-reference/destination-table-toggle.png":::

### Operational logs

Operational log entries include elements listed in the following table:

| Name | Description | Supported in AzureDiagnostics | Supported in AZMSOperationalLogs (Resource Specific table)|
| ------- | ------- |---| ---|
| `ActivityId` | Internal ID, used to identify the specified activity | Yes | Yes|
| `EventName` | Operation name | Yes | Yes|
| `ResourceId` | Azure Resource Manager resource ID | Yes | Yes|
| `SubscriptionId` | Subscription ID | Yes | Yes|
| `EventtimeString`| Operation Time | Yes | No|
| `TimeGenerated [UTC]`|Time of executed operation (in UTC)| No | Yes|
| `EventProperties` | Operation properties | Yes | Yes|
| `Status` | Operation status | Yes | Yes|
| `Caller` | Caller of operation (the Azure portal or management client) | Yes | Yes|
| `Provider`|Name of Service emitting the logs, such as ServiceBus | No | Yes|
|  `Type`| Type of logs emitted | No | Yes|
| `Category`| Log Category | Yes | No|

Here's an example of an operational log JSON string:

AzureDiagnostics:

```json

{
  "ActivityId": "0000000000-0000-0000-0000-00000000000000",
  "EventName": "Create Queue",
  "resourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<SERVICE BUS NAMESPACE NAME>",
  "SubscriptionId": "0000000000-0000-0000-0000-00000000000000",
  "EventTimeString": "9/28/2016 8:40:06 PM +00:00",
  "EventProperties": "{\"SubscriptionId\":\"0000000000-0000-0000-0000-00000000000000\",\"Namespace\":\"mynamespace\",\"Via\":\"https://mynamespace.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
  "Status": "Succeeded",
  "Caller": "ServiceBus Client",
  "category": "OperationalLogs"
}
```

Resource specific table entry:

```json

{
  "ActivityId": "0000000000-0000-0000-0000-00000000000000",
  "EventName": "Retrieve Queue",
  "resourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<SERVICE BUS NAMESPACE NAME>",
  "SubscriptionId": "0000000000-0000-0000-0000-00000000000000",
  "TimeGenerated(UTC)": "9/28/2023 8:40:06 PM +00:00",
  "EventProperties": "{\"SubscriptionId\":\"0000000000-0000-0000-0000-00000000000000\",\"Namespace\":\"mynamespace\",\"Via\":\"https://mynamespace.servicebus.windows.net/f8096791adb448579ee83d30e006a13e/?api-version=2016-07\",\"TrackingId\":\"5ee74c9e-72b5-4e98-97c4-08a62e56e221_G1\"}",
  "Status": "Succeeded",
  "Caller": "ServiceBus Client",
  "type": "AZMSOperationalLogs",
  "Provider" : "SERVICEBUS"
}

```

### Events and operations captured in operational logs

Operational logs capture all management operations that are performed on the Azure Service Bus namespace. Data operations aren't captured, because of the high volume of data operations that are conducted on Azure Service Bus.

> [!NOTE]
> To help you better track data operations, we recommend using client-side tracing.

The following management operations are captured in operational logs:

| Scope | Operation |
|-------|-----------|
| Namespace | - Create Namespace<br>- Update Namespace<br>- Delete Namespace<br>- Update Namespace<br>- Retrieve Namespace<br>- SharedAccess Policy |
| Queue | - Create Queue<br>- Update Queue<br>- Delete Queue<br>- AutoDelete Delete Queue<br>- Retrieve Queue |
| Topic | - Create Topic<br>- Update Topic<br>- Delete Topic<br>- AutoDelete Delete Topic<br>- Retrieve Topic |
| Subscription | - Create Subscription<br>- Update Subscription<br>- Delete Subscription<br>- AutoDelete Delete Subscription<br>- Retrieve Subscription |

> [!NOTE]
> Currently, *Read* operations aren't tracked in the operational logs.

### Virtual network and IP filtering logs

Service Bus virtual network connection event JSON includes elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSVnetConnectionEvents (Resource specific table)  |
| ---  | ----------- |---| ---|
| `SubscriptionId` | Azure subscription ID | Yes | Yes |
| `NamespaceName` | Namespace name | Yes | Yes |
| `IPAddress` | IP address of a client connecting to the Service Bus service | Yes | Yes  |
| `AddressIP` | IP address of client connecting to service bus | Yes | Yes |
| `TimeGenerated [UTC]`|Time of executed operation (in UTC) | Yes | Yes  |
| `Action` | Action done by the Service Bus service when evaluating connection requests. Supported actions are **Accept Connection** and **Deny Connection**. | Yes | Yes  |
| `Reason` | Provides a reason why the action was done | Yes | Yes |
| `Count` | Number of occurrences for the given action | Yes | Yes |
| `ResourceId` | Azure Resource Manager resource ID. | Yes | Yes |
| `Category` |  Log Category | Yes | No |
| `Provider`|Name of Service emitting the logs such as ServiceBus | No | Yes  |
|  `Type`  | Type of Logs Emitted | No | Yes |

> [!NOTE]
> Virtual network logs are generated only if the namespace allows access from selected networks or from specific IP addresses (IP filter rules).

Here's an example of a virtual network log JSON string:

AzureDiagnostics:

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Accept Connection",
    "Reason": "IP is accepted by IPAddress filter.",
    "Count": 1,
    "ResourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<SERVICE BUS NAMESPACE NAME>",
    "Category": "ServiceBusVNetConnectionEvent"
}
```

Resource specific table entry:

```json
{
  "SubscriptionId": "0000000-0000-0000-0000-000000000000",
  "NamespaceName": "namespace-name",
  "AddressIp": "1.2.3.4",
  "Action": "Accept Connection",
  "Message": "IP is accepted by IPAddress filter.",
  "Count": 1,
  "ResourceId": "/SUBSCRIPTIONS/<AZURE SUBSCRIPTION ID>/RESOURCEGROUPS/<RESOURCE GROUP NAME>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<SERVICE BUS NAMESPACE NAME>",
  "Provider" : "SERVICEBUS",
  "Type": "AZMSVNetConnectionEvents"
}
```

## Runtime audit logs

Runtime audit logs capture aggregated diagnostic information for various data plane access operations (such as send or receive messages) in Service Bus.  

> [!NOTE]
> Runtime audit logs are currently available only in the **premium** tier.  

Runtime audit logs include the elements listed in the following table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSRuntimeAuditLogs (Resource specific table)|
| ------- | -------| ---|---|
| `ActivityId` | A randomly generated UUID that ensures uniqueness for the audit activity. | Yes | Yes|
| `ActivityName` | Runtime operation name.  | Yes | Yes|
| `ResourceId` | Resource associated with the activity. | Yes | Yes|
| `Timestamp` | Aggregation time. | Yes | No|
| `time Generated (UTC)` | Aggregated time | No | Yes|
| `Status` | Status of the activity (success or failure).| Yes | Yes|
| `Protocol` | Type of the protocol associated with the operation. | Yes | Yes|
| `AuthType` | Type of authentication (Microsoft Entra ID or SAS Policy). | Yes | Yes|
| `AuthKey` | Microsoft Entra application ID or SAS policy name that's used to authenticate to a resource. | Yes | Yes|
| `NetworkType` | Type of the network access: `Public` or`Private`. | yes | Yes|
| `ClientIP` | IP address of the client application. | Yes | Yes|
| `Count` | Total number of operations performed during the aggregated period of 1 minute. | Yes | Yes|
| `Properties` | Metadata that is specific to the data plane operation. | yes | Yes|
| `Category` | Log category | Yes | No|
| `Provider` |Name of Service emitting the logs, such as ServiceBus | No | Yes |
| `Type`  | Type of Logs emitted | No | Yes|

Here's an example of a runtime audit log entry:

AzureDiagnostics:

```json
{
  "ActivityId": "<activity id>",
  "ActivityName": "ConnectionOpen | Authorization | SendMessage | ReceiveMessage | PeekLockMessage",
  "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<Service Bus namespace>/servicebus/<service bus name>",
  "Time": "1/1/2021 8:40:06 PM +00:00",
  "Status": "Success | Failure",
  "Protocol": "AMQP | HTTP | SBMP", 
  "AuthType": "SAS | AAD", 
  "AuthKey": "<AAD Application Name| SAS policy name>",
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
  "ActivityName": "ConnectionOpen | Authorization | SendMessage | ReceiveMessage | PeekLockMessage",
  "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<Service Bus namespace>/servicebus/<service bus name>",
  "TimeGenerated (UTC)": "1/1/2021 8:40:06 PM +00:00",
  "Status": "Success | Failure",
  "Protocol": "AMQP | HTTP | SBMP", 
  "AuthType": "SAS | AAD", 
  "AuthKey": "<AAD Application Name| SAS policy name>",
  "NetworkType": "Public | Private", 
  "ClientIp": "x.x.x.x",
  "Count": 1, 
  "Provider": "SERVICEBUS",
  "Type"   : "AZMSRuntimeAuditLogs"
}
```

## Diagnostic Error Logs

Diagnostic error logs capture error messages for any client side, throttling, and Quota exceeded errors. They provide detailed diagnostics for error identification.

Diagnostic Error Logs include elements listed in this table:

| Name | Description | Supported in Azure Diagnostics | Supported in AZMSDiagnosticErrorLogs (Resource specific table) |
| ---|---|---|---|
| `ActivityId` | A randomly generated UUID that ensures uniqueness for the audit activity. | Yes | Yes |
| `ActivityName` | Operation name  | Yes | Yes |
| `NamespaceName` | Name of Namespace | Yes | yes |
| `EntityType` | Type of Entity | Yes | Yes  |
| `EntityName` | Name of Entity | Yes | Yes   |
| `OperationResult` | Type of error in Operation (Clienterror or Serverbusy or quotaexceeded) | Yes | Yes |
| `ErrorCount` | Count of identical errors during the aggregation period of 1 minute. | Yes | Yes  |
| `ErrorMessage` | Detailed Error Message | Yes | Yes  |
| `Provider` | Name of Service emitting the logs. Possible values: eventhub, relay, and servicebus | Yes | Yes  |
| `Time Generated (UTC)` | Operation time | No | Yes |
| `EventTimestamp` | Operation Time | Yes | No |
| `Category` | Log category | Yes | No |
| `Type`  | Type of Logs emitted | No | Yes |

Here's an example of Diagnostic error log entry:

```json
{
  "ActivityId": "0000000000-0000-0000-0000-00000000000000",
  "SubscriptionId": "<Azure Subscription Id",
  "NamespaceName": "Name of Service Bus Namespace",
  "EntityType": "Queue",
  "EntityName": "Name of Service Bus Queue",
  "ActivityName": "SendMessage",
  "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<service bus namespace name>",,
  "OperationResult": "ClientError",
  "ErrorCount": 1,
  "EventTimestamp": "3/27/2024 1:02:29.126 PM +00:00",
  "ErrorMessage": "the sessionid was not set on a message, and it cannot be sent to the entity. entities that have session support enabled can only receive messages that have the sessionid set to a valid value.",
  "category": "DiagnosticErrorLogs"
}
```

Resource specific table entry:

```json
{
  "ActivityId": "0000000000-0000-0000-0000-00000000000000",
  "NamespaceName": "Name of Service Bus Namespace",
  "EntityType": "Queue",
  "EntityName": "Name of Service Bus Queue",
  "ActivityName": "SendMessage",
  "ResourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/<Resource Group Name>/PROVIDERS/MICROSOFT.SERVICEBUS/NAMESPACES/<service bus namespace name>",,
  "OperationResult": "ClientError",
  "ErrorCount": 1,
  "TimeGenerated [UTC]": "1/27/2024 4:02:29.126 PM +00:00",
  "ErrorMessage": "the sessionid was not set on a message, and it cannot be sent to the entity. entities that have session support enabled can only receive messages that have the sessionid set to a valid value.",
  "Type": "AZMSDiagnosticErrorLogs"
}
```

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

Azure Service Bus uses Kusto tables from Azure Monitor Logs. You can query these tables with Log Analytics. 

### Service Bus Microsoft.ServiceBus/namespaces

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)
- [AZMSOperationalLogs](/azure/azure-monitor/reference/tables/azmsoperationallogs#columns)
- [AZMSVnetConnectionEvents](/azure/azure-monitor/reference/tables/azmsvnetconnectionevents#columns)
- [AZMSRunTimeAuditLogs](/azure/azure-monitor/reference/tables/azmsruntimeauditlogs#columns)
- [AZMSApplicationMetricLogs](/azure/azure-monitor/reference/tables/azmsapplicationmetricLogs#columns)
- [AZMSDiagnosticErrorLogs](/azure/azure-monitor/reference/tables/azmsdiagnosticerrorlogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Integration resource provider operations](/azure/role-based-access-control/resource-provider-operations#integration)

## Related content

- See [Monitor Azure Service Bus](monitor-service-bus.md) for a description of monitoring Service Bus.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
