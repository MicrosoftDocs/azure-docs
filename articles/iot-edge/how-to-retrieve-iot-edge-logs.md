---
title: Retrieve Azure IoT Edge logs
description: Retrieve Azure IoT Edge logs and upload them to Azure Blob Storage for remote monitoring.
author: PatAltimore

ms.author: patricka
ms.date: 06/03/2025
ms.topic: how-to
ms.service: azure-iot-edge
ms.custom: devx-track-azurecli
services: iot-edge
---
# Retrieve logs from IoT Edge deployments

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Get logs from your IoT Edge deployments without physical or SSH access by using direct methods in the IoT Edge agent module. Direct methods run on the device and you can invoke them from the cloud. The IoT Edge agent has direct methods that help you monitor and manage your IoT Edge devices remotely. The direct methods in this article are available starting with version 1.0.10.

For more information about direct methods, how to use them, and how to add them to your own modules, see [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).

The names of these direct methods are case-sensitive.

## Recommended logging format

For best compatibility with this feature, use the following logging format:

```
<{Log Level}> {Timestamp} {Message Text}
```

Format `{Timestamp}` as `yyyy-MM-dd HH:mm:ss.fff zzz`. Use `{Log Level}` values from the following table, based on the [Severity code in the Syslog standard](https://wikipedia.org/wiki/Syslog#Severity_level).

| Value | Severity |
|-|-|
| 0 | Emergency |
| 1 | Alert |
| 2 | Critical |
| 3 | Error |
| 4 | Warning |
| 5 | Notice |
| 6 | Informational |
| 7 | Debug |

The [Logger class in IoT Edge](https://github.com/Azure/iotedge/blob/main/edge-util/src/Microsoft.Azure.Devices.Edge.Util/Logger.cs) is a canonical implementation.

## Retrieve module logs

Use the **GetModuleLogs** direct method to get the logs of an IoT Edge module.

>[!TIP]
>Use the `since` and `until` filter options to limit the range of logs retrieved. If you call this direct method without bounds, it gets all the logs, which can be large, time consuming, or costly.
>
>The IoT Edge troubleshooting page in the Azure portal gives you a simpler way to view module logs. For more information, see [Monitor and troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

This method accepts a JSON payload with the following schema:

```json
    {
       "schemaVersion": "1.0",
       "items": [
          {
             "id": "regex string",
             "filter": {
                "tail": "int",
                "since": "string",
                "until": "string",
                "loglevel": "int",
                "regex": "regex string"
             }
          }
       ],
       "encoding": "gzip/none",
       "contentType": "json/text" 
    }
```

| Name | Type | Description |
|-|-|-|
| schemaVersion | string | Set to `1.0` |
| items | JSON array | An array with `id` and `filter` tuples. |
| id | string | A regular expression that specifies the module name. It can match multiple modules on an edge device. [.NET Regular Expressions](/dotnet/standard/base-types/regular-expressions) format is expected. If multiple items have an ID that matches the same module, only the filter options of the first matching ID apply to that module. |
| filter | JSON section | Log filters to apply to the modules matching the `id` regular expression in the tuple. |
| tail | integer | Number of log lines in the past to get, starting from the latest. OPTIONAL. |
| since | string | Only return logs since this time, as an rfc3339 timestamp, UNIX timestamp, or a duration (days (d), hours (h), minutes (m)). For example, a duration for one day, 12 hours, and 30 minutes can be specified as *1 day 12 hours 30 minutes* or *1d 12h 30m*. If both `tail` and `since` are specified, the logs are filtered using the `since` value first, then the `tail` value is applied to the result. OPTIONAL. |
| until | string | Only return logs before the specified time, as an rfc3339 timestamp, UNIX timestamp, or duration (days (d), hours (h), minutes (m)). For example, a duration of 90 minutes can be specified as *90 minutes* or *90m*. If both `tail` and `since` are specified, the logs are filtered using the `since` value first, then the `tail` value is applied to the result. OPTIONAL. |
| loglevel | integer | Filter log lines equal to the specified log level. Log lines should follow the recommended logging format and use the [Syslog severity level](https://en.wikipedia.org/wiki/Syslog#Severity_level) standard. If you need to filter by multiple log level severity values, use regex matching, provided the module uses a consistent format for different severity levels. OPTIONAL. |
| regex | string | Filter log lines that match the specified regular expression using [.NET Regular Expressions](/dotnet/standard/base-types/regular-expressions) format. OPTIONAL. |
| encoding | string | Either `gzip` or `none`. Default is `none`. |
| contentType | string | Either `json` or `text`. Default is `text`. |

> [!NOTE]
> If the log content exceeds the response size limit for direct methods, which is currently 128 KB, the response returns an error.

A successful log retrieval returns a **"status": 200** followed by a payload with the logs from the module, filtered by the settings you specify in your request.

For example:

```azurecli
az iot hub invoke-module-method --method-name 'GetModuleLogs' -n <hub name> -d <device id> -m '$edgeAgent' --method-payload \
'
    {
       "schemaVersion": "1.0",
       "items": [
          {
             "id": "edgeAgent",
             "filter": {
                "tail": 10
             }
          }
       ],
       "encoding": "none",
       "contentType": "text"
    }
'
```

In the Azure portal, invoke the method `GetModuleLogs` and the following JSON payload:

```json
    {
       "schemaVersion": "1.0",
       "items": [
          {
             "id": "edgeAgent",
             "filter": {
                "tail": 10
             }
          }
       ],
       "encoding": "none",
       "contentType": "text"
    }
```

:::image type="content" source="./media/how-to-retrieve-iot-edge-logs/invoke-get-module-logs.png" alt-text="Screenshot of how to invoke direct method GetModuleLogs in the Azure portal.":::

You can also pipe the CLI output to Linux utilities, like [gzip](https://en.wikipedia.org/wiki/Gzip), to process a compressed response. For example:

```azurecli
az iot hub invoke-module-method \
  --method-name 'GetModuleLogs' \
  -n <hub name> \
  -d <device id> \
  -m '$edgeAgent' \
  --method-payload '{"contentType": "text","schemaVersion": "1.0","encoding": "gzip","items": [{"id": "edgeHub","filter": {"since": "2d","tail": 1000}}],}' \
  -o tsv --query 'payload[0].payloadBytes' \
  | base64 --decode \
  | gzip -d
```

## Upload module logs

Use the **UploadModuleLogs** direct method to send the requested logs to a specific Azure Blob Storage container.

> [!NOTE]
> Use the `since` and `until` filter options to limit the range of logs retrieved. Calling this direct method without bounds retrieves all the logs, which can be large, time consuming, or costly.
>
> To upload logs from a device behind a gateway device, make sure the [API proxy and blob storage modules](how-to-configure-api-proxy-module.md) are configured on the top layer device. These modules route logs from your lower layer device through your gateway device to your storage in the cloud.

This method accepts a JSON payload similar to **GetModuleLogs**, with the added "sasUrl" key:

```json
    {
       "schemaVersion": "1.0",
       "sasUrl": "Full path to SAS URL",
       "items": [
          {
             "id": "regex string",
             "filter": {
                "tail": "int",
                "since": "string",
                "until": "string",
                "loglevel": "int",
                "regex": "regex string"
             }
          }
       ],
       "encoding": "gzip/none",
       "contentType": "json/text" 
    }
```

| Name | Type | Description |
|-|-|-|
| sasURL | string (URI) | [Shared Access Signature URL with write access to Azure Blob Storage container](/archive/blogs/jpsanders/easily-create-a-sas-to-download-a-file-from-azure-storage-using-azure-storage-explorer). |

A successful request to upload logs returns a **"status": 200** followed by a payload with the following schema:

```json
    {
        "status": "string",
        "message": "string",
        "correlationId": "GUID"
    }
```

| Name | Type | Description |
|-|-|-|
| status | string | One of `NotStarted`, `Running`, `Completed`, `Failed`, or `Unknown`. |
| message | string | Message if there's an error, or an empty string otherwise. |
| correlationId | string   | ID to check the status of the upload request. |

For example, the following invocation uploads the last 100 log lines from all modules in compressed JSON format:

```azurecli
az iot hub invoke-module-method --method-name UploadModuleLogs -n <hub name> -d <device id> -m '$edgeAgent' --method-payload \
'
    {
        "schemaVersion": "1.0",
        "sasUrl": "<sasUrl>",
        "items": [
            {
                "id": ".*",
                "filter": {
                    "tail": 100
                }
            }
        ],
        "encoding": "gzip",
        "contentType": "json"
    }
'
```

The following invocation uploads the last 100 log lines from edgeAgent and edgeHub, and the last 1,000 log lines from the tempSensor module in uncompressed text format:

```azurecli
az iot hub invoke-module-method --method-name UploadModuleLogs -n <hub name> -d <device id> -m '$edgeAgent' --method-payload \
'
    {
        "schemaVersion": "1.0",
        "sasUrl": "<sasUrl>",
        "items": [
            {
                "id": "edge",
                "filter": {
                    "tail": 100
                }
            },
            {
                "id": "tempSensor",
                "filter": {
                    "tail": 1000
                }
            }
        ],
        "encoding": "none",
        "contentType": "text"
    }
'
```

In the Azure portal, invoke the method with the method name `UploadModuleLogs` and the following JSON payload after replacing the sasUrl with your information:

```json
    {
       "schemaVersion": "1.0",
       "sasUrl": "<sasUrl>",
       "items": [
          {
             "id": "edgeAgent",
             "filter": {
                "tail": 10
             }
          }
       ],
       "encoding": "none",
       "contentType": "text"
    }
```

:::image type="content" source="./media/how-to-retrieve-iot-edge-logs/invoke-upload-module-logs.png" alt-text="Screenshot of invoking the UploadModuleLogs direct method in the Azure portal.":::

## Upload support bundle diagnostics

Use the **UploadSupportBundle** direct method to bundle and upload a zip file of IoT Edge module logs to an available Azure Blob Storage container. This direct method runs the [`iotedge support-bundle`](./troubleshoot.md#gather-debug-information-with-support-bundle-command) command on your IoT Edge device to obtain the logs.

> [!NOTE]
> To upload logs from a device behind a gateway device, make sure the [API proxy and blob storage modules](how-to-configure-api-proxy-module.md) are set up on the top layer device. These modules route logs from your lower layer device through your gateway device to your storage in the cloud.

This method accepts a JSON payload with the following schema:

```json
    {
        "schemaVersion": "1.0",
        "sasUrl": "Full path to SAS url",
        "since": "2d",
        "until": "1d",
        "edgeRuntimeOnly": false
    }
```

| Name | Type | Description |
|-|-|-|
| schemaVersion | string | Set to `1.0`. |
| sasURL | string (URI) | [Shared Access Signature URL with write access to Azure Blob Storage container](/archive/blogs/jpsanders/easily-create-a-sas-to-download-a-file-from-azure-storage-using-azure-storage-explorer). |
| since | string | Return logs since this time, as an RFC 3339 timestamp, UNIX timestamp, or a duration (days (d), hours (h), minutes (m)). For example, specify one day, 12 hours, and 30 minutes as *1 day 12 hours 30 minutes* or *1d 12h 30m*. Optional. |
| until | string | Return logs before this time, as an RFC 3339 timestamp, UNIX timestamp, or duration (days (d), hours (h), minutes (m)). For example, specify 90 minutes as *90 minutes* or *90m*. Optional. |
| edgeRuntimeOnly | boolean | If true, return logs only from Edge Agent, Edge Hub, and the Edge Security Daemon. Default: false. Optional. |

> [!IMPORTANT]
> The IoT Edge support bundle can contain personally identifiable information.

A successful upload logs request returns a **"status": 200** and a payload with the same schema as the **UploadModuleLogs** response:

```json
    {
        "status": "string",
        "message": "string",
        "correlationId": "GUID"
    }
```

| Name | Type | Description |
|-|-|-|
| status | string | One of `NotStarted`, `Running`, `Completed`, `Failed`, or `Unknown`. |
| message | string | Message if error, empty string otherwise. |
| correlationId | string   | ID to query to status of the upload request. |

In the following example, replace the placeholder text *`<hub name>`* and *`<device id>`* with your own values.

```azurecli
az iot hub invoke-module-method --method-name 'UploadSupportBundle' -n <hub name> -d <device id> -m '$edgeAgent' --method-payload \
'
    {
        "schemaVersion": "1.0",
        "sasUrl": "Full path to SAS url",
        "since": "2d",
        "until": "1d",
        "edgeRuntimeOnly": false
    }
'
```

In the Azure portal, invoke the method with the method name `UploadSupportBundle` and the following JSON payload after you relace your own SAS URL:

```json
    {
        "schemaVersion": "1.0",
        "sasUrl": "Full path to SAS url",
        "since": "2d",
        "until": "1d",
        "edgeRuntimeOnly": false
    }
```

:::image type="content" source="./media/how-to-retrieve-iot-edge-logs/invoke-upload-support-bundle.png" alt-text="Screenshot of invoking the UploadSupportBundle direct method in the Azure portal.":::

## Get upload request status

Use the **GetTaskStatus** direct method to check the status of an upload logs request. The **GetTaskStatus** request payload uses the `correlationId` from the upload logs request to get the task status. The `correlationId` comes from the response to the **UploadModuleLogs** direct method call.

This method accepts a JSON payload with the following schema:

```json
    {
      "schemaVersion": "1.0",
      "correlationId": "<GUID>"
    }
```

A successful request to upload logs returns a **"status": 200** followed by a payload with the same schema as the **UploadModuleLogs** response:

```json
    {
        "status": "string",
        "message": "string",
        "correlationId": "GUID"
    }
```

| Name | Type | Description |
|-|-|-|
| status | string | One of `NotStarted`, `Running`, `Completed`, `Failed`, `Cancelled`, or `Unknown`. |
| message | string | Message if error, empty string otherwise. |
| correlationId | string   | ID to query to status of the upload request. |

For example:

```azurecli
az iot hub invoke-module-method --method-name 'GetTaskStatus' -n <hub name> -d <device id> -m '$edgeAgent' --method-payload \
'
    {
      "schemaVersion": "1.0",
      "correlationId": "<GUID>"
    }
'
```

In the Azure portal, invoke the method with the method name `GetTaskStatus` and the following JSON payload. Replace *`<GUID>`* with your own value.

```json
    {
      "schemaVersion": "1.0",
      "correlationId": "<GUID>"
    }
```

:::image type="content" source="./media/how-to-retrieve-iot-edge-logs/invoke-get-task-status.png" alt-text="Screenshot of the Azure portal showing how to invoke the direct method GetTaskStatus.":::

## Next steps

[Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md)
