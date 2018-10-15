---
title: How to diagnose issues with user-defined functions in Azure Digital Twins | Microsoft Docs
description: Guideline on what to investigate if running into issues.
author: stegaw
manager: deshner
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/14/2018
ms.author: stegaw
---

# How to diagnose issues with user-defined functions in Azure Digital Twins

## Enabling Log Analytics for your Digital Twins instance

Logs and metrics for your Digital Twins instance are exposed through Azure Monitor. The following documentation assumes you have created an [Azure Log Analytics](../log-analytics/log-analytics-queries.md) workspace through the [Azure Portal](../log-analytics/log-analytics-quick-create-workspace.md), through [Azure CLI](../log-analytics/log-analytics-quick-create-workspace-cli.md), or through [PowerShell](../log-analytics/log-analytics-quick-create-workspace-posh.md).

Follow this article on [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) to enable diagnostic settings for your Digital Twins instance through the Portal, Azure CLI, or PowerShell. Make sure to select all log categories, metrics, and your Azure Log Analytics workspace.

## Tracing sensor telemetry through Digital Twins execution path

Ensure that diagnostic settings are enabled on your Digital Twins instance, all log categories are selected, and the logs are being sent into Log Analytics.

To correlate a sensor telemetry message to it's respective logs, you can specify a Correlation ID on the event data being sent by setting the `x-ms-client-request-id` property to a GUID.

After sending telemetry, open up Log Analytics within Azure to query for logs with the specified Correlation ID.

```text
AzureDiagnostics
| where CorrelationId = 'yourCorrelationIdentifier'
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourCorrelationIdentifier` | The Correlation ID that was specified on the event data. |

If you log within your user-defined function, those logs will appear in your Log Analytics instance with the category `UserDefinedFunction`. To retrieve these logs, enter the following within your Log Analytics instance.

```text
AzureDiagnostics
| where Category = 'UserDefinedFunction'
```

## Common issues

### Ensure that a role assignment was created for the user-defined function

Without a role assignment created within Management API, the user-defined function will not have access to perform any actions such as sending notifications, retrieving metadata, and setting computed values within the topology.

Check if a role assignment exists for your user-defined function

```text
GET https://yourManagementApiUrl/api/v1.0/roleassignments?path=/&traverse=Down&objectId=yourUserDefinedFunctionId
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourUserDefinedFunctionId` | The id of the user-defined function to retrieve role assignments for|

If there is no role assignment retrieved, follow this article on [How to create a role assignment for your user-defined function](./how-to-user-defined-functions.md#Create-a-role-assignment).

### Check if the matcher will work for a given sensor's telemetry

With the following call against your Digital Twins instances' Management API, you will be able to determine if a given matcher applies for the given sensor.

```text
GET https://yourManagementApiUrl/api/v1.0/matchers/yourMatcherIdentifier/evaluate/yourSensorIdentifier?enableLogging=true
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourMatcherIdentifier` | The id of the matcher you wish to evaluate |
| `yourSensorIdentifier` | The id of the sensor you wish to evaluate |

Response

```javascript
{
    "success": true,
    "logs": [
        "$.dataType: \"Motion\" Equals \"Motion\" => True"
    ]
}
```

### Check what user-defined functions the sensor's telemetry will trigger

With the following call against your Digital Twins instances' Management API, you will be able to determine the identifiers of your user-defined functions that will be triggered by the given sensor's incoming telemetry.

```text
GET https://yourManagementApiUrl/api/v1.0/sensors/yourSensorIdentifier/matchers?includes=UserDefinedFunctions
```

| Custom Attribute Name | Replace With |
| --- | --- |
| `yourManagementApiUrl` | The full URL path for your Management API  |
| `yourSensorIdentifier` | The id of the sensor that will be sending telemetry |

Response:

```javascript
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

When not receiving notifications from within the user-defined function that was triggered, make sure that your topology object type parameter matches the type of the identifier that is being used.

**Incorrect** Example:

```javascript
var customNotification = {
    Message: 'Custom notification that will not work'
};

sendNotification(telemetry.SensorId, "Space", JSON.stringify(customNotification));
```

This will not work because the identifier used is that of a sensor, but the topology object type specified is 'Space'.

**Correct** Example:

```javascript
var customNotification = {
    Message: 'Custom notification that will work'
};

sendNotification(telemetry.SensorId, "Sensor", JSON.stringify(customNotification));
```

The easiest way to not run into this issue is to use the `Notify` method on the metadata object.

Example:

```javascript
function process(telemetry, executionContext) {
    var sensorMetadata = getSensorMetadata(telemetry.SensorId);

    var customNotification = {
        Message: 'Custom notification'
    };

    // Short-hand for above methods where object type is known from metadata.
    sensorMetadata.Notify(JSON.stringify(customNotification));
}
```

### Exceptions

If your diagnostic settings are enabled, these exceptions should be visible in the logs if encountered.

1. Throttling

    - If your user-defined function is executing past the rate limits outlined here: [Service Limits](./concepts-service-limits.md#UDF-rate-limits) then it will be throttled which will have the immmediate effect of no operations successfully executing within the user-defined function.

1. Data Not Found

    - If your user-defined function attempts to access metadata which does not exist, the operation will fail.
1. Not Authorized

    - If your user-defined function doesn't have a role assignment set, or if the role assignment does not give enough permission to access certain metadata from the topology, the operation will fail.