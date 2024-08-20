---
title: Monitoring Device Provisioning Service data reference
description: This article contains important reference material you need when you monitor Azure IoT Hub Device Provisioning Service.
ms.date: 06/28/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: kgremban
ms.author: kgremban
ms.service: iot-dps
---

# Azure IoT Hub Device Provisioning Service monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md) for details on the data you can collect for IoT Hub Device Provisioning Service and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Devices/provisioningServices

The following table lists the metrics available for the Microsoft.Devices/provisioningServices resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Devices/provisioningServices](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-devices-provisioningservices-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

| Dimension Name          | Description |
|:------------------------|:-------------------------------------|
| IotHubName              | The name of the target IoT hub.      |
| Protocol                | The device or service protocol used. |
| ProvisioningServiceName | The name of the DPS instance.        |
| Status                  | The status of the operation.         |

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Devices/provisioningServices

[!INCLUDE [Microsoft.Devices/provisioningServices](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-devices-provisioningservices-logs-include.md)]

The following list provides additional information about the preceding logs:

- DeviceOperations: Logs related to device attestation events. See device APIs listed in [Billable service operations and pricing](about-iot-dps.md#billable-service-operations-and-pricing).
- ServiceOperations: Logs related to DPS service events. See DPS service APIs listed in [Billable service operations and pricing](about-iot-dps.md#billable-service-operations-and-pricing).

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

DPS uses the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table to store resource log information. The following columns are relevant.

| Property | Data type | Description |
|:--- |:---|:---|
| ApplicationId | GUID | Application ID used in bearer authorization. |
| CallerIpAddress | String | A masked source IP address for the event. |
| Category | String | Type of operation, either **ServiceOperations** or **DeviceOperations**. |
| CorrelationId | GUID | Unique identifier for the event. |
| DurationMs | String | How long it took to perform the event in milliseconds. |
| Level | Int | The logging severity of the event. For example, Information or Error. |
| OperationName | String | The type of action performed during the event. For example: Query, Get, Upsert, and so on.  |
| OperationVersion | String | The API Version used during the event. |
| Resource | String | The name forOF the resource where the event took place. For example, `MYEXAMPLEDPS`. |
| ResourceGroup | String | The name of the resource group where the resource is located. |
| ResourceId | String | The Azure Resource Manager Resource ID for the resource where the event took place. |
| ResourceProvider | String | The resource provider for the event. For example, `MICROSOFT.DEVICES`. |
| ResourceType | String | The resource type for the event. For example, `PROVISIONINGSERVICES`. |
| ResultDescription | String | Error details for the event if unsuccessful. |
| ResultSignature | String | HTTP status code for the event if unsuccessful. |
| ResultType | String | Outcome of the event: Success, Failure, ClientError, and so on. |
| SubscriptionId | GUID | The subscription ID of the Azure subscription where the resource is located. |
| TenantId | GUID | The tenant ID for the Azure tenant where the resource is located. |
| TimeGenerated | DateTime | The date and time that this event occurred, in UTC. |
| location_s | String | The Azure region where the event took place. |
| properties_s | JSON | Additional information details for the event. |

### DeviceOperations

The following JSON is an example of a successful attestation attempt from a device. The registration ID for the device is identified in the `properties_s` property.

```json
  {
    "CallerIPAddress": "24.18.226.XXX",
    "Category": "DeviceOperations",
    "CorrelationId": "68952383-80c0-436f-a2e3-f8ae9a41c69d",
    "DurationMs": "226",
    "Level": "Information",
    "OperationName": "AttestationAttempt",
    "OperationVersion": "March2019",
    "Resource": "MYEXAMPLEDPS",
    "ResourceGroup": "MYRESOURCEGROUP",
    "ResourceId": "/SUBSCRIPTIONS/747F1067-xxx-xxx-xxxx-9DEAA894152F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DEVICES/PROVISIONINGSERVICES/MYEXAMPLEDPS",
    "ResourceProvider": "MICROSOFT.DEVICES",
    "ResourceType": "PROVISIONINGSERVICES",
    "ResultDescription": "",
    "ResultSignature": "",
    "ResultType": "Success",
    "SourceSystem": "Azure",
    "SubscriptionId": "747F1067-xxx-xxx-xxxx-9DEAA894152F",
    "TenantId": "37dcb621-xxxx-xxxx-xxxx-e8c8addbc4e5",
    "TimeGenerated": "2022-04-02T00:05:51Z",
    "Type": "AzureDiagnostics",
    "_ResourceId": "/subscriptions/747F1067-xxx-xxx-xxxx-9DEAA894152F/resourcegroups/myresourcegroup/providers/microsoft.devices/provisioningservices/myexampledps",
    "location_s": "centralus",
    "properties_s": "{\"id\":\"my-device-1\",\"type\":\"Registration\",\"protocol\":\"Mqtt\"}",
  }

```

### ServiceOperations

The following JSON is an example of a successful add (`Upsert`) individual enrollment operation. The registration ID for the enrollment and the type of enrollment are identified in the `properties_s` property.

```json
  {
    "CallerIPAddress": "13.91.244.XXX",
    "Category": "ServiceOperations",
    "CorrelationId": "23bd419d-d294-452b-9b1b-520afef5ef52",
    "DurationMs": "98",
    "Level": "Information",
    "OperationName": "Upsert",
    "OperationVersion": "October2021",
    "Resource": "MYEXAMPLEDPS",
    "ResourceGroup": "MYRESOURCEGROUP",
    "ResourceId": "/SUBSCRIPTIONS/747F1067-xxxx-xxxx-xxxx-9DEAA894152F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DEVICES/PROVISIONINGSERVICES/MYEXAMPLEDPS",
    "ResourceProvider": "MICROSOFT.DEVICES",
    "ResourceType": "PROVISIONINGSERVICES",
    "ResultDescription": "",
    "ResultSignature": "",
    "ResultType": "Success",
    "SourceSystem": "Azure",
    "SubscriptionId": "747f1067-xxxx-xxxx-xxxx-9deaa894152f",
    "TenantId": "37dcb621-xxxx-xxxx-xxxx-e8c8addbc4e5",
    "TimeGenerated": "2022-04-01T00:52:00Z",
    "Type": "AzureDiagnostics",
    "_ResourceId": "/subscriptions/747F1067-xxxx-xxxx-xxxx-9DEAA894152F/resourcegroups/myresourcegroup/providers/microsoft.devices/provisioningservices/myexampledps",
    "location_s": "centralus",
    "properties_s": "{\"id\":\"my-device-1\",\"type\":\"IndividualEnrollment\",\"protocol\":\"Http\"}",
  }
```

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### IoT Hub Device Provisioning Service Microsoft.Devices/ProvisioningServices

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.Devices resource provider operations](/azure/role-based-access-control/resource-provider-operations#internet-of-things)

## Related content

- See [Monitor Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md) for a description of monitoring IoT Hub Device Provisioning Service.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
