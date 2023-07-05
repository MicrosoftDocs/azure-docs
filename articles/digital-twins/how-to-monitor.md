---
# Mandatory fields.
title: Monitor your instance
titleSuffix: Azure Digital Twins
description: Monitor Azure Digital Twins instances with metrics, alerts, and diagnostics.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/17/2023
ms.topic: how-to
ms.service: digital-twins
ms.custom: engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Monitor Azure Digital Twins with metrics, alerts, and diagnostics

Azure Digital Twins integrates with [Azure Monitor](../azure-monitor/overview.md) to provide metrics and diagnostic information that you can use to monitor your Azure Digital Twins resources. **Metrics** are enabled by default, and give you information about the state of Azure Digital Twins resources in your Azure subscription. **Alerts** can proactively notify you when certain conditions are found in your metrics data. You can also collect **diagnostic logs** for your service instance to monitor its performance, access, and other data. 

These monitoring features can help you assess the overall health of the Azure Digital Twins service and the resources connected to it. You can use them to understand what is happening in your Azure Digital Twins instance, and analyze root causes on issues without needing to contact Azure support.

They can be accessed from the [Azure portal](https://portal.azure.com), grouped under the **Monitoring** heading for the Azure Digital Twins resource.

:::image type="content" source="media/how-to-monitor/monitoring.png" alt-text="Screenshot of the Azure portal showing the Monitoring options.":::

## Metrics and alerts

For general information about viewing Azure resource **metrics**, see [Get started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md) in the Azure Monitor documentation. For general information about configuring **alerts** for Azure metrics, see [Create a new alert rule](../azure-monitor/alerts/alerts-create-new-alert-rule.md?tabs=metric).

The rest of this section describes the metrics tracked by each Azure Digital Twins instance, and how each metric relates to the overall status of your instance.

### Metrics for tracking service limits

You can configure these metrics to track when you're approaching a [published service limit](reference-service-limits.md#functional-limits) for some aspect of your solution. 

To set up tracking, use the [alerts](../azure-monitor/alerts/alerts-overview.md) feature in Azure Monitor. You can define thresholds for these metrics so that you receive an alert when a metric reaches a certain percentage of its published limit.

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| TwinCount | Twin Count (Preview) | Count | Total | Total number of twins in the Azure Digital Twins instance. Use this metric to determine if you're approaching the [service limit](reference-service-limits.md#functional-limits) for max number of twins allowed per instance. |  None |
| ModelCount | Model Count (Preview) | Count | Total | Total number of models in the Azure Digital Twins instance. Use this metric to determine if you're approaching the [service limit](reference-service-limits.md#functional-limits) for max number of models allowed per instance. | None |

### API request metrics

Metrics having to do with API requests:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| ApiRequests | API Requests | Count | Total | The number of API Requests made for Digital Twins read, write, delete, and query operations. |  Authentication, <br>Operation, <br>Protocol, <br>Status Code, <br>Status Code Class, <br>Status Text |
| ApiRequestsFailureRate | API Requests Failure Rate | Percent | Average | The percentage of API requests that the service receives for your instance that gives an internal error (500) response code for Digital Twins read, write, delete, and query operations. | Authentication, <br>Operation, <br>Protocol, <br>Status Code, <br>Status Code Class, <br>Status Text
| ApiRequestsLatency | API Requests Latency | Milliseconds | Average | The response time for API requests. This value refers to the time from when the request is received by Azure Digital Twins until the service sends a success/fail result for Digital Twins read, write, delete, and query operations. | Authentication, <br>Operation, <br>Protocol |

### Billing metrics

Metrics having to do with billing:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| BillingApiOperations | Billing API Operations | Count | Total | Billing metric for the count of all API requests made against the Azure Digital Twins service. | Meter ID |
| BillingMessagesProcessed | Billing Messages Processed | Count | Total | Billing metric for the number of messages sent out from Azure Digital Twins to external endpoints.<br><br>To be considered a single message for billing purposes, a payload must be no larger than 1 KB. Payloads larger than this limit will be counted as additional messages in 1 KB increments (so a message between 1 KB and 2 KB will be counted as 2 messages, between 2 KB and 3 KB will be 3 messages, and so on).<br>This restriction also applies to responses—so a call that returns 1.5 KB in the response body, for example, will be billed as 2 operations. | Meter ID |
| BillingQueryUnits | Billing Query Units | Count | Total | The number of Query Units, an internally computed measure of service resource usage, consumed to execute queries. There's also a helper API available for measuring Query Units: [QueryChargeHelper Class](/dotnet/api/azure.digitaltwins.core.querychargehelper?view=azure-dotnet&preserve-view=true) | Meter ID |

For more information on the way Azure Digital Twins is billed, see [Azure Digital Twins pricing](https://azure.microsoft.com/pricing/details/digital-twins/).

### Ingress metrics

Metrics having to do with data ingress:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| IngressEvents | Ingress Events | Count | Total | The number of incoming telemetry events into Azure Digital Twins. | Result |
| IngressEventsFailureRate | Ingress Events Failure Rate | Percent | Average | The percentage of incoming telemetry events for which the service returns an internal error (500) response code. | Result |
| IngressEventsLatency | Ingress Events Latency | Milliseconds | Average | The time from when an event arrives to when it's ready to be egressed by Azure Digital Twins, at which point the service sends a success/fail result. | Result |

### Bulk operation metrics (from the Jobs API)

Metrics having to do with bulk operations from the [Jobs API](/rest/api/digital-twins/dataplane/jobs):

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| ImportJobLatency | Import Job Latency | Milliseconds | Average | Total time taken for an import job to complete. | Operation, <br>Authentication, <br>Protocol |
| ImportJobEntityCount | Import Job Entity Count | Count | Total | The number of twins, models, or relationships processed by an import job. | Operation, <br>Result |              

### Routing metrics

Metrics having to do with routing:

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |
| MessagesRouted | Messages Routed | Count | Total | The number of messages routed to an endpoint Azure service such as Event Hubs, Service Bus, or Event Grid. | Endpoint Type, <br>Result |
| RoutingFailureRate | Routing Failure Rate | Percent | Average | The percentage of events that result in an error as they're routed from Azure Digital Twins to an endpoint Azure service such as Event Hubs, Service Bus, or Event Grid. | Endpoint Type, <br>Result |
| RoutingLatency | Routing Latency | Milliseconds | Average | Time elapsed between an event getting routed from Azure Digital Twins to when it's posted to the endpoint Azure service such as Event Hubs, Service Bus, or Event Grid. | Endpoint Type, <br>Result |

### Metric dimensions

Dimensions help identify more details about the metrics. Some of the routing metrics provide information per endpoint. The table below lists possible values for these dimensions.

| Dimension | Values |
| --- | --- |
| Authentication | OAuth |
| Operation (for API Requests) | Microsoft.DigitalTwins/digitaltwins/delete, <br>Microsoft.DigitalTwins/digitaltwins/write, <br>Microsoft.DigitalTwins/digitaltwins/read, <br>Microsoft.DigitalTwins/eventroutes/read, <br>Microsoft.DigitalTwins/eventroutes/write, <br>Microsoft.DigitalTwins/eventroutes/delete, <br>Microsoft.DigitalTwins/models/read, <br>Microsoft.DigitalTwins/models/write, <br>Microsoft.DigitalTwins/models/delete, <br>Microsoft.DigitalTwins/query/action |
| Endpoint Type | Event Grid, <br>Event Hubs, <br>Service Bus |
| Protocol | HTTPS |
| Result | Success, <br>Failure |
| Status Code | 200, 404, 500, and so on. |
| Status Code Class | 2xx, 4xx, 5xx, and so on. |
| Status Text | Internal Server Error, Not Found, and so on. |

## Diagnostics logs

For general information about Azure **diagnostics settings**, including how to enable them, see [Diagnostic settings in Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md). For information about querying diagnostic logs using **Log Analytics**, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md).

The rest of this section describes the diagnostic log categories that Azure Digital Twins can collect, and their schemas.

### Log categories

Here are more details about the categories of logs that Azure Digital Twins collects.

| Log category | Description |
| --- | --- |
| ADTModelsOperation | Log all API calls related to Models |
| ADTQueryOperation | Log all API calls related to Queries |
| ADTEventRoutesOperation | Log all API calls related to Event Routes and egress of events from Azure Digital Twins to an endpoint service like Event Grid, Event Hubs, and Service Bus |
| ADTDigitalTwinsOperation | Log all API calls related to individual twins |

Each log category consists of operations of write, read, delete, and action. These categories map to REST API calls as follows:

| Event type | REST API operations |
| --- | --- |
| Write | PUT and PATCH |
| Read | GET |
| Delete | DELETE |
| Action | POST |

Here's a comprehensive list of the operations and corresponding [Azure Digital Twins REST API calls](/rest/api/azure-digitaltwins/) that are logged in each category. 

>[!NOTE]
> Each log category contains several operations/REST API calls. In the table below, each log category maps to all operations/REST API calls underneath it until the next log category is listed. 

| Log category | Operation | REST API calls and other events |
| --- | --- | --- |
| ADTModelsOperation | Microsoft.DigitalTwins/models/write | Digital Twin Models Update API |
|  | Microsoft.DigitalTwins/models/read | Digital Twin Models Get By ID and List APIs |
|  | Microsoft.DigitalTwins/models/delete | Digital Twin Models Delete API |
|  | Microsoft.DigitalTwins/models/action | Digital Twin Models Add API |
| ADTQueryOperation | Microsoft.DigitalTwins/query/action | Query Twins API |
| ADTEventRoutesOperation | Microsoft.DigitalTwins/eventroutes/write | Event Routes Add API |
|  | Microsoft.DigitalTwins/eventroutes/read | Event Routes Get By ID and List APIs |
|  | Microsoft.DigitalTwins/eventroutes/delete | Event Routes Delete API |
|  | Microsoft.DigitalTwins/eventroutes/action | Failure while attempting to publish events to an endpoint service (not an API call) |
| ADTDigitalTwinsOperation | Microsoft.DigitalTwins/digitaltwins/write | Digital Twins Add, Add Relationship, Update, Update Component |
|  | Microsoft.DigitalTwins/digitaltwins/read | Digital Twins Get By ID, Get Component, Get Relationship by ID, List Incoming Relationships, List Relationships |
|  | Microsoft.DigitalTwins/digitaltwins/delete | Digital Twins Delete, Delete Relationship |
|  | Microsoft.DigitalTwins/digitaltwins/action | Digital Twins Send Component Telemetry, Send Telemetry |

### Log schemas 

Each log category has a schema that defines how events in that category are reported. Each individual log entry is stored as text and formatted as a JSON blob. The fields in the log and example JSON bodies are provided for each log type below. 

`ADTDigitalTwinsOperation`, `ADTModelsOperation`, and `ADTQueryOperation` use a consistent API log schema. `ADTEventRoutesOperation` extends the schema to contain an `endpointName` field in properties.

#### API log schemas

This log schema is consistent for `ADTDigitalTwinsOperation`, `ADTModelsOperation`, `ADTQueryOperation`. The same schema is also used for `ADTEventRoutesOperation`, except the `Microsoft.DigitalTwins/eventroutes/action` operation name (for more information about that schema, see the next section, [Egress log schemas](#egress-log-schemas)).

The schema contains information pertinent to API calls to an Azure Digital Twins instance.

Here are the field and property descriptions for API logs.

| Field name | Data type | Description |
|-----|------|-------------|
| `Time` | DateTime | The date and time that this event occurred, in UTC |
| `ResourceId` | String | The Azure Resource Manager Resource ID for the resource where the event took place |
| `OperationName` | String  | The type of action being performed during the event |
| `OperationVersion` | String | The API Version used during the event |
| `Category` | String | The type of resource being emitted |
| `ResultType` | String | Outcome of the event |
| `ResultSignature` | String | Http status code for the event |
| `ResultDescription` | String | Additional details about the event |
| `DurationMs` | String | How long it took to perform the event in milliseconds |
| `CallerIpAddress` | String | A masked source IP address for the event |
| `CorrelationId` | Guid | Unique identifier for the event |
| `ApplicationId` | Guid | Application ID used in bearer authorization |
| `Level` | Int | The logging severity of the event |
| `Location` | String | The region where the event took place |
| `RequestUri` | Uri | The endpoint used during the event |
| `TraceId` | String | `TraceId`, as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). The ID of the whole trace used to uniquely identify a distributed trace across systems. |
| `SpanId` | String | `SpanId` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). The ID of this request in the trace. |
| `ParentId` | String | `ParentId` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). A request without a parent ID is the root of the trace. |
| `TraceFlags` | String | `TraceFlags` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). Controls tracing flags such as sampling, trace level, and so on. |
| `TraceState` | String | `TraceState` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). Additional vendor-specific trace identification information to span across different distributed tracing systems. |

Below are example JSON bodies for these types of logs.

##### ADTDigitalTwinsOperation

```json
{
  "time": "2020-03-14T21:11:14.9918922Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/digitaltwins/write",
  "operationVersion": "2020-10-31",
  "category": "DigitalTwinOperation",
  "resultType": "Success",
  "resultSignature": "200",
  "resultDescription": "",
  "durationMs": 8,
  "callerIpAddress": "13.68.244.*",
  "correlationId": "2f6a8e64-94aa-492a-bc31-16b9f0b16ab3",
  "identity": {
    "claims": {
      "appId": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1"
    }
  },
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/digitaltwins/factory-58d81613-2e54-4faa-a930-d980e6e2a884?api-version=2020-10-31",
  "properties": {},
  "traceContext": {
    "traceId": "95ff77cfb300b04f80d83e64d13831e7",
    "spanId": "b630da57026dd046",
    "parentId": "9f0de6dadae85945",
    "traceFlags": "01",
    "tracestate": "k1=v1,k2=v2"
  }
}
```

##### ADTModelsOperation

```json
{
  "time": "2020-10-29T21:12:24.2337302Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/models/write",
  "operationVersion": "2020-10-31",
  "category": "ModelsOperation",
  "resultType": "Success",
  "resultSignature": "201",
  "resultDescription": "",
  "durationMs": "80",
  "callerIpAddress": "13.68.244.*",
  "correlationId": "9dcb71ea-bb6f-46f2-ab70-78b80db76882",
  "identity": {
    "claims": {
      "appId": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1"
    }
  },
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/Models?api-version=2020-10-31",
  "properties": {},
  "traceContext": {
    "traceId": "95ff77cfb300b04f80d83e64d13831e7",
    "spanId": "b630da57026dd046",
    "parentId": "9f0de6dadae85945",
    "traceFlags": "01",
    "tracestate": "k1=v1,k2=v2"
  }
}
```

##### ADTQueryOperation

```json
{
  "time": "2020-12-04T21:11:44.1690031Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/query/action",
  "operationVersion": "2020-10-31",
  "category": "QueryOperation",
  "resultType": "Success",
  "resultSignature": "200",
  "resultDescription": "",
  "durationMs": "314",
  "callerIpAddress": "13.68.244.*",
  "correlationId": "1ee2b6e9-3af4-4873-8c7c-1a698b9ac334",
  "identity": {
    "claims": {
      "appId": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1"
    }
  },
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/query?api-version=2020-10-31",
  "properties": {},
  "traceContext": {
    "traceId": "95ff77cfb300b04f80d83e64d13831e7",
    "spanId": "b630da57026dd046",
    "parentId": "9f0de6dadae85945",
    "traceFlags": "01",
    "tracestate": "k1=v1,k2=v2"
  }
}
```

##### ADTEventRoutesOperation

Here's an example JSON body for an `ADTEventRoutesOperation` that isn't of `Microsoft.DigitalTwins/eventroutes/action` type (for more information about that schema, see the next section, [Egress log schemas](#egress-log-schemas)).

```json
  {
    "time": "2020-10-30T22:18:38.0708705Z",
    "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
    "operationName": "Microsoft.DigitalTwins/eventroutes/write",
    "operationVersion": "2020-10-31",
    "category": "EventRoutesOperation",
    "resultType": "Success",
    "resultSignature": "204",
    "resultDescription": "",
    "durationMs": 42,
    "callerIpAddress": "212.100.32.*",
    "correlationId": "7f73ab45-14c0-491f-a834-0827dbbf7f8e",
    "identity": {
      "claims": {
        "appId": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1"
      }
    },
    "level": "4",
    "location": "southcentralus",
    "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/EventRoutes/egressRouteForEventHub?api-version=2020-10-31",
    "properties": {},
    "traceContext": {
      "traceId": "95ff77cfb300b04f80d83e64d13831e7",
      "spanId": "b630da57026dd046",
      "parentId": "9f0de6dadae85945",
      "traceFlags": "01",
      "tracestate": "k1=v1,k2=v2"
    }
  },
```

#### Egress log schemas

The following example is the schema for `ADTEventRoutesOperation` logs specific to the `Microsoft.DigitalTwins/eventroutes/action` operation name. These contain details related to exceptions and the API operations around egress endpoints connected to an Azure Digital Twins instance.

|Field name | Data type | Description |
|-----|------|-------------|
| `Time` | DateTime | The date and time that this event occurred, in UTC |
| `ResourceId` | String | The Azure Resource Manager Resource ID for the resource where the event took place |
| `OperationName` | String  | The type of action being performed during the event |
| `Category` | String | The type of resource being emitted |
| `ResultDescription` | String | Additional details about the event |
| `CorrelationId` | Guid | Customer provided unique identifier for the event |
| `ApplicationId` | Guid | Application ID used in bearer authorization |
| `Level` | Int | The logging severity of the event |
| `Location` | String | The region where the event took place |
| `TraceId` | String | `TraceId`, as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). The ID of the whole trace used to uniquely identify a distributed trace across systems. |
| `SpanId` | String | `SpanId` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). The ID of this request in the trace. |
| `ParentId` | String | `ParentId` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). A request without a parent ID is the root of the trace. |
| `TraceFlags` | String | `TraceFlags` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). Controls tracing flags such as sampling, trace level, and so on. |
| `TraceState` | String | `TraceState` as part of [W3C's Trace Context](https://www.w3.org/TR/trace-context/). Additional vendor-specific trace identification information to span across different distributed tracing systems. |
| `EndpointName` | String | The name of egress endpoint created in Azure Digital Twins |

Here's an example JSON body for an `ADTEventRoutesOperation` that of `Microsoft.DigitalTwins/eventroutes/action` type.

```json
{
  "time": "2020-11-05T22:18:38.0708705Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/eventroutes/action",
  "operationVersion": "",
  "category": "EventRoutesOperation",
  "resultType": "",
  "resultSignature": "",
  "resultDescription": "Unable to send EventHub message to [myPath] for event Id [f6f45831-55d0-408b-8366-058e81ca6089].",
  "durationMs": -1,
  "callerIpAddress": "",
  "correlationId": "7f73ab45-14c0-491f-a834-0827dbbf7f8e",
  "identity": {
    "claims": {
      "appId": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1"
    }
  },
  "level": "4",
  "location": "southcentralus",
  "uri": "",
  "properties": {
    "endpointName": "myEventHub"
  },
  "traceContext": {
    "traceId": "95ff77cfb300b04f80d83e64d13831e7",
    "spanId": "b630da57026dd046",
    "parentId": "9f0de6dadae85945",
    "traceFlags": "01",
    "tracestate": "k1=v1,k2=v2"
  }
},
```

## Next steps

Read more about Azure Monitor and its capabilities in the [Azure Monitor documentation](../azure-monitor/overview.md).
