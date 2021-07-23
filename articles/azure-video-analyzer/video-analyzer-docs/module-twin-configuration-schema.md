---
title: Azure Video Analyzer module twin JSON schema 
description: This article provides an overview of an Azure Video Analyzer module twin JSON schema.
ms.topic: how-to
ms.date: 06/01/2021

---
# Module twin configuration schema

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. Azure IoT Hub maintains a device twin for each device that you connect to IoT Hub. For detailed explanation, see [Understand and use module twins in IoT Hub.](../../iot-hub/iot-hub-devguide-module-twins.md)

This topic describes module twin JSON schema of Azure Video Analyzer.

## Module twin properties

Azure Video Analyzer exposes the following module twin properties.

| Property                    | Required | Dynamic | Description                                                  |
| :-------------------------- | :------- | :------ | :----------------------------------------------------------- |
| `ProvisioningToken`          | Yes      | No      | Authentication token to validate the edge module and provision cloud services (including access to Video analyzer account) |
| `ApplicationDataDirectory`    | Yes      | No      | Path within the module's file system that maps to a mounted volume for persisting configuration.       |
| `DiagnosticsEventsOutputName` | No       | Yes     | Hub output for diagnostics events. (Empty means diagnostics are not published) |
| `OperationalEventsOutputName` | No       | Yes     | Hub output for operational events. (Empty means operational events are not published) |
| `LogLevel`                    | No       | Yes     | One of the following: · Verbose · Information (Default) · Warning · Error · None |
| `LogCategories`               | No       | Yes     | A comma-separated list of the following: Application, MediaPipeline, Events Default: Application, Events |
| `AllowUnsecuredEndpoints`     | No       | Yes     | Boolean setting to allow creation of topologies with unsecured endpoints such as `#Microsoft.VideoAnalyzer.UnsecuredEndpoint`, default -true        |
| `TelemetryOptOut`             | No       | No     | Boolean setting for opting out of telemetry submission, default -false       |
| `DebugLogsDirectory`          | No       | Yes     | Directory for debug logs. If present logs are generated, if not present debug logs are disabled.       |

Dynamic properties can be updated without the restarting the module. 

See the article on [Monitoring and logging](monitor-log-edge.md) for more information about the role of the optional diagnostics settings.

```json
{
    "properties.desired": {
        "ProvisioningToken": "$AVA_PROVISIONING_TOKEN",
        "ApplicationDataDirectory": "/var/lib/videoanalyzer",
        "DiagnosticsEventsOutputName": "diagnostics",
        "OperationalEventsOutputName": "operational",
        "LogLevel": "information",
        "LogCategories": "Application,Events",
        "DebugLogsDirectory": "/tmp/logs",
        "AllowUnsecuredEndpoints": true,
        "TelemetryOptOut": false    
     
    }
}
```

## Next steps

[Direct methods](direct-methods.md)
