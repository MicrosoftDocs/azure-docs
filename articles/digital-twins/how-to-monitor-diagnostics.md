---
# Mandatory fields.
title: Monitor with diagnostic logs
titleSuffix: Azure Digital Twins
description: In this article, learn how to enable logging with diagnostics settings and query the logs for immediate viewing. Also, learn about the log categories and their schemas.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/10/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q1, contentperf-fy22q3
---

# Monitor Azure Digital Twins with diagnostics logs

This article shows you how to configure diagnostic settings in the [Azure portal](https://portal.azure.com), including what types of logs to collect and where to store them (such as Log Analytics or a storage account of your choice). Then, you can query the logs to quickly gather custom insights.

Azure Digital Twins can collect *logs* for your service instance to monitor its performance, access, and other data. You can use these logs to get an idea of what is happening in your Azure Digital Twins instance, and analyze root causes on issues without needing to contact Azure support.

This article also contains information about all the log categories that Azure Digital Twins can collect, and their schemas.

## Turn on diagnostic settings 

Turn on diagnostic settings to start collecting logs on your Azure Digital Twins instance. You can also choose the destination where the exported logs should be stored. Here's how to enable diagnostic settings for your Azure Digital Twins instance.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Diagnostic settings** from the menu, then **Add diagnostic setting**.

    :::image type="content" source="media/how-to-monitor-diagnostics/diagnostic-settings.png" alt-text="Screenshot showing the diagnostic settings page in the Azure portal and button to add." lightbox="media/how-to-monitor-diagnostics/diagnostic-settings.png":::

3. On the page that follows, fill in the following values:
     * **Diagnostic setting name**: Give the diagnostic settings a name.
     * **Category details**: Choose which operations you want to monitor, and check the boxes to enable diagnostics for those operations. The operations that diagnostic settings can report on are:
        - DigitalTwinsOperation
        - EventRoutesOperation
        - ModelsOperation
        - QueryOperation
        - AllMetrics
        
        For more details about these categories and the information they contain, see the [Log categories](#log-categories) section below.
     * **Destination details**: Choose where you want to send the logs. You can select any combination of the three options:
        - Send to Log Analytics
        - Archive to a storage account
        - Stream to an event hub

        You may be asked to fill in more details if they're necessary for your destination selection.  
    
4. Save the new settings. 

    :::image type="content" source="media/how-to-monitor-diagnostics/diagnostic-settings-details.png" alt-text="Screenshot showing the diagnostic setting page in the Azure portal where the user has filled in a diagnostic setting information." lightbox="media/how-to-monitor-diagnostics/diagnostic-settings-details.png":::

New settings take effect in about 10 minutes. After that, logs appear in the configured target back on the **Diagnostic settings** page for your instance. 

For more detailed information on diagnostic settings and their setup options, you can visit [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).

## View and query logs

After configuring storage details of your Azure Digital Twins logs, you can write *custom queries* for them to generate insights and troubleshoot issues. The service also provides a few example queries that can help you get started, by addressing common questions that customers may have about their instances.

Here's how to query the logs for your instance.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. Select **Logs** from the menu to open the log query page. The page opens to a window called **Queries**.

    :::image type="content" source="media/how-to-monitor-diagnostics/logs.png" alt-text="Screenshot showing the Logs page for an Azure Digital Twins instance in the Azure portal with the Queries window overlaid, showing prebuilt queries." lightbox="media/how-to-monitor-diagnostics/logs.png":::

    These queries are prebuilt examples written for various logs. You can select one of the queries to load it into the query editor and run it to see these logs for your instance.

    You can also close the **Queries** window without running anything to go straight to the query editor page, where you can write or edit custom query code.

3. After exiting the **Queries** window, you'll see the main query editor page. Here you can view and edit the text of the example queries, or write your own queries from scratch.
    :::image type="content" source="media/how-to-monitor-diagnostics/logs-query.png" alt-text="Screenshot showing the Logs page for an Azure Digital Twins instance in the Azure portal. It includes a list of logs, query code, and Queries History." lightbox="media/how-to-monitor-diagnostics/logs-query.png":::

    In the left pane, 
    - The **Tables** tab shows the different Azure Digital Twins [log categories](#log-categories) that are available to use in your queries. 
    - The **Queries** tab contains the example queries that you can load into the editor.
    - The **Filter** tab lets you customize a filtered view of the data that the query returns.

For more detailed information on log queries and how to write them, you can visit [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

## Log categories

Here are more details about the categories of logs that Azure Digital Twins collects.

| Log category | Description |
| --- | --- |
| ADTModelsOperation | Log all API calls related to Models |
| ADTQueryOperation | Log all API calls related to Queries |
| ADTEventRoutesOperation | Log all API calls related to to Event Routes and egress of events from Azure Digital Twins to an endpoint service like Event Grid, Event Hubs, and Service Bus |
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

## Log schemas 

Each log category has a schema that defines how events in that category are reported. Each individual log entry is stored as text and formatted as a JSON blob. The fields in the log and example JSON bodies are provided for each log type below. 

`ADTDigitalTwinsOperation`, `ADTModelsOperation`, and `ADTQueryOperation` use a consistent API log schema. `ADTEventRoutesOperation` extends the schema to contain an `endpointName` field in properties.

### API log schemas

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

#### ADTDigitalTwinsOperation

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

#### ADTModelsOperation

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

#### ADTQueryOperation

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

#### ADTEventRoutesOperation

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

### Egress log schemas

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

Below are example JSON bodies for these types of logs.

#### ADTEventRoutesOperation for Microsoft.DigitalTwins/eventroutes/action

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

* For more information about configuring diagnostics, see [Collect and consume log data from your Azure resources](../azure-monitor/essentials/platform-logs-overview.md).
* For information about the Azure Digital Twins metrics, see [Monitor with metrics](how-to-monitor-metrics.md).
* To see how to enable alerts for your Azure Digital Twins metrics, see [Monitor with alerts](how-to-monitor-alerts.md).