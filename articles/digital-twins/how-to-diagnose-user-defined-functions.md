---
title: How to debug UDFs - Azure Digital Twins | Microsoft Docs
description: Learn about recommended approaches to debug user-defined functions in Azure Digital Twins.
ms.author: alinast
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 01/21/2020
ms.custom: seodec18
---

# How to debug user-defined functions in Azure Digital Twins

This article summarizes how to diagnose and debug user-defined functions in Azure Digital Twins. Then, it identifies some of the most common scenarios found when debugging them.

>[!TIP]
> Read [How to configure monitoring and logging](./how-to-configure-monitoring.md) to learn more about setting up debugging tools in Azure Digital Twins using Activity Logs, Diagnostic Logs, and Azure Monitor.

## Debug issues

Knowing how to diagnose issues within Azure Digital Twins allows you to effectively analyze issues, identify the causes of problems, and provide appropriate solutions for them.

A variety of logging, analytics, and diagnostic tools are provided to that end.

### Enable logging for your instance

Azure Digital Twins supports robust logging, monitoring, and analytics. Solutions developers can use Azure Monitor logs, diagnostic logs, activity logs, and other services to support the complex monitoring needs of an IoT app. Logging options can be combined to query or display records across several services and to provide granular logging coverage for many services.

* For logging configuration specific to Azure Digital Twins, read [How to configure monitoring and logging](./how-to-configure-monitoring.md).
* Consult the [Azure Monitor](../azure-monitor/overview.md) overview to learn about powerful log settings enabled through Azure Monitor.
* Review the article [Collect and consume log data from your Azure resources](../azure-monitor/platform/platform-logs-overview.md) for configuring diagnostic log settings in Azure Digital Twins through the Azure portal, Azure CLI, or PowerShell.

Once configured, you'll be able to select all log categories, metrics, and use powerful Azure Monitor log analytics workspaces to support your debugging efforts.

### Trace sensor telemetry

To trace sensor telemetry, verify that diagnostic settings are enabled for your Azure Digital Twins instance. Then, ensure that all desired log categories are selected. Lastly, confirm that the desired logs are being sent to Azure Monitor logs.

To match a sensor telemetry message to its respective logs, you can specify a Correlation ID on the event data being sent. To do so, set the `x-ms-client-request-id` property to a GUID.

After sending telemetry, open Azure Monitor log analytics to query for logs using the set Correlation ID:

```Kusto
AzureDiagnostics
| where CorrelationId == 'YOUR_CORRELATION_IDENTIFIER'
```

| Query value | Replace with |
| --- | --- |
| YOUR_CORRELATION_IDENTIFIER | The Correlation ID that was specified on the event data |

To read all recent telemetry logs query:

```Kusto
AzureDiagnostics
| order by CorrelationId desc
```

If you enable logging for your user-defined function, those logs appear in your log analytics instance with the category `UserDefinedFunction`. To retrieve them, enter the following query condition in log analytics:

```Kusto
AzureDiagnostics
| where Category == 'UserDefinedFunction'
```

For more information about powerful query operations, read [Getting started with queries](../azure-monitor/log-query/get-started-queries.md).

## Identify common issues

Both diagnosing and identifying common issues are important when troubleshooting your solution. Several issues that are commonly encountered when developing user-defined functions are summarized in the following subsections.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

### Check if a role assignment was created

Without a role assignment created within the Management API, the user-defined function doesn't have access to perform any actions such as sending notifications, retrieving metadata, and setting computed values within the topology.

Check if a role assignment exists for your user-defined function through your Management API:

```URL
GET YOUR_MANAGEMENT_API_URL/roleassignments?path=/&traverse=Down&objectId=YOUR_USER_DEFINED_FUNCTION_ID
```

| Parameter value | Replace with |
| --- | --- |
| YOUR_USER_DEFINED_FUNCTION_ID | The ID of the user-defined function to retrieve role assignments for|

Learn [How to create a role assignment for your user-defined function](./how-to-user-defined-functions.md), if no role assignments exist.

### Check if the matcher works for a sensor's telemetry

With the following call against your Azure Digital Twins instances' Management API, you're able to determine if a given matcher applies for the given sensor.

```URL
GET YOUR_MANAGEMENT_API_URL/matchers/YOUR_MATCHER_IDENTIFIER/evaluate/YOUR_SENSOR_IDENTIFIER?enableLogging=true
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_MATCHER_IDENTIFIER* | The ID of the matcher you wish to evaluate |
| *YOUR_SENSOR_IDENTIFIER* | The ID of the sensor you wish to evaluate |

Response:

```JavaScript
{
    "success": true,
    "logs": [
        "$.dataType: \"Motion\" Equals \"Motion\" => True"
    ]
}
```

### Check what a sensor triggers

With the following call against the Azure Digital Twins Management APIs, you're able to determine the identifiers of your user-defined functions triggered by the given sensor's incoming telemetry:

```URL
GET YOUR_MANAGEMENT_API_URL/sensors/YOUR_SENSOR_IDENTIFIER/matchers?includes=UserDefinedFunctions
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_SENSOR_IDENTIFIER* | The ID of the sensor to send telemetry |

Response:

```JavaScript
[
    {
        "id": "48a64768-797e-4832-86dd-de625f5f3fd9",
        "name": "MotionMatcher",
        "spaceId": "2117b3e1-b6ce-42c1-9b97-0158bef59eb7",
        "conditions": [
            {
                "id": "024a067a-414f-415b-8424-7df61392541e",
                "target": "Sensor",
                "path": "$.dataType",
                "value": "\"Motion\"",
                "comparison": "Equals"
            }
        ],
        "userDefinedFunctions": [
            {
                "id": "373d03c5-d567-4e24-a7dc-f993460120fc",
                "spaceId": "2117b3e1-b6ce-42c1-9b97-0158bef59eb7",
                "name": "Motion User-Defined Function",
                "disabled": false
            }
        ]
    }
]
```

### Issue with receiving notifications

When you're not receiving notifications from the triggered user-defined function, confirm that your topology object type parameter matches the type of identifier that's being used.

**Incorrect** Example:

```JavaScript
var customNotification = {
    Message: 'Custom notification that will not work'
};

sendNotification(telemetry.SensorId, "Space", JSON.stringify(customNotification));
```

This scenario arises because the used identifier refers to a sensor while the topology object type specified is `Space`.

**Correct** Example:

```JavaScript
var customNotification = {
    Message: 'Custom notification that will work'
};

sendNotification(telemetry.SensorId, "Sensor", JSON.stringify(customNotification));
```

The easiest way to not run into this issue is to use the `Notify` method on the metadata object.

Example:

```JavaScript
function process(telemetry, executionContext) {
    var sensorMetadata = getSensorMetadata(telemetry.SensorId);

    var customNotification = {
        Message: 'Custom notification'
    };

    // Short-hand for above methods where object type is known from metadata.
    sensorMetadata.Notify(JSON.stringify(customNotification));
}
```

## Common diagnostic exceptions

If you enable diagnostic settings, you might encounter these common exceptions:

1. **Throttling**: if your user-defined function exceeds the execution rate limits outlined in the [Service Limits](./concepts-service-limits.md) article, it will be throttled. No further operations are successfully executed until the throttling limits expire.

1. **Data Not Found**: if your user-defined function attempts to access metadata that does not exist, the operation fails.

1. **Not Authorized**: if your user-defined function doesn't have a role assignment set or lacks enough permission to access certain metadata from the topology, the operation fails.

## Next steps

- Learn how to enable [monitoring and logs](./how-to-configure-monitoring.md) in Azure Digital Twins.

- Read the [Overview of Azure Activity log](../azure-monitor/platform/platform-logs-overview.md) article for more Azure logging options.
