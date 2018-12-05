---
title: How to debug UDFs in Azure Digital Twins | Microsoft Docs
description: Guideline about how to debug UDFs in Azure Digital Twins
author: stefanmsft
manager: deshner
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: stefanmsft
---

# How to debug issues with user-defined functions in Azure Digital Twins

This article summarizes how to diagnose user-defined functions. Then, it identifies some of the most common scenarios encountered when working with them.

## Debug issues

Knowing how to diagnose any issues that arise within your Azure Digital Twins instance will aid you to effectively identify the issue, the cause of the problem, and a solution.

### Enable log analytics for your instance

Logs and metrics for your Azure Digital Twins instance are exposed through Azure Monitor. The following documentation assumes you have created an [Azure Log Analytics](../azure-monitor/log-query/log-query-overview.md) workspace through the [Azure Portal](../log-analytics/log-analytics-quick-create-workspace.md), through [Azure CLI](../log-analytics/log-analytics-quick-create-workspace-cli.md), or through [PowerShell](../log-analytics/log-analytics-quick-create-workspace-posh.md).

> [!NOTE]
> You may experience a 5 minute delay when sending events to **Log Analytics** for the first time.

Read the article ["Collect and consume log data from your Azure resources"](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) to enable diagnostic settings for your Azure Digital Twins instance through the Portal, Azure CLI, or PowerShell. Make sure to select all log categories, metrics, and your Azure Log Analytics workspace.

### Trace sensor telemetry

Ensure that diagnostic settings are enabled on your Azure Digital Twins instance, all log categories are selected, and that the logs are being sent to Azure Log Analytics.

To match a sensor telemetry message to its respective logs, you can specify a Correlation ID on the event data being sent. To do so, set the `x-ms-client-request-id` property to a GUID.

After sending telemetry, open up Azure Log Analytics to query for logs using the set Correlation ID:

```Kusto
AzureDiagnostics
| where CorrelationId = 'YOUR_CORRELATION_IDENTIFIER'
```

| Query value | Replace with |
| --- | --- |
| YOUR_CORRELATION_IDENTIFIER | The Correlation ID that was specified on the event data |

If you log your user-defined function, those logs will appear in your Azure Log Analytics instance with the category `UserDefinedFunction`. To retrieve them, enter the following query condition in Azure Log Analytics:

```Kusto
AzureDiagnostics
| where Category = 'UserDefinedFunction'
```

For more information about powerful query operations, see [getting started with queries](https://docs.microsoft.com/azure/log-analytics/query-language/get-started-queries).

## Identify common issues

Both diagnosing and identifying common issues are important when troubleshooting your solution. Several Common issues encountered when developing user-defined functions are summarized below.

[!INCLUDE [Digital Twins Management API](../../includes/digital-twins-management-api.md)]

### Ensure a role assignment was created

Without a role assignment created within Management API, the user-defined function will not have access to perform any actions such as sending notifications, retrieving metadata, and setting computed values within the topology.

Check if a role assignment exists for your user-defined function through your Management API:

```plaintext
GET YOUR_MANAGEMENT_API_URL/roleassignments?path=/&traverse=Down&objectId=YOUR_USER_DEFINED_FUNCTION_ID
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_USER_DEFINED_FUNCTION_ID* | The ID of the user-defined function to retrieve role assignments for|

If no role assignment is retrieved, follow this article on [How to create a role assignment for your user-defined function](./how-to-user-defined-functions.md).

### Check if the matcher will work for a sensor's telemetry

With the following call against your Azure Digital Twins instances' Management API, you will be able to determine if a given matcher applies for the given sensor.

```plaintext
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

### Check what a sensor will trigger

With the following call against your Azure Digital Twins instances' Management API, you will be able to determine the identifiers of your user-defined functions that will be triggered by the given sensor's incoming telemetry:

```plaintext
GET YOUR_MANAGEMENT_API_URL/sensors/YOUR_SENSOR_IDENTIFIER/matchers?includes=UserDefinedFunctions
```

| Parameter | Replace with |
| --- | --- |
| *YOUR_SENSOR_IDENTIFIER* | The ID of the sensor that will be sending telemetry |

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

When not receiving notifications from within the triggered user-defined function, make sure that your topology object type parameter matches the type of the identifier that is being used.

**Incorrect** Example:

```JavaScript
var customNotification = {
    Message: 'Custom notification that will not work'
};

sendNotification(telemetry.SensorId, "Space", JSON.stringify(customNotification));
```

This scenario arises because the used identifier refers to a sensor while the topology object type specified is 'Space'.

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

1. **Throttling**: if your user-defined function exceeds the execution rate limits outlined in the [Service Limits](./concepts-service-limits.md) article, it will be throttled. Throttling entails no further operations successfully executing until the limits expire.

1. **Data Not Found**: if your user-defined function attempts to access metadata that does not exist, the operation will fail.

1. **Not Authorized**: if your user-defined function doesn't have a role assignment set or lacks enough permission to access certain metadata from the topology, the operation will fail.

## Next steps

Learn how to enable [monitoring and logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) in Azure Digital Twins.
