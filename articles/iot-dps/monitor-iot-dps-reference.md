---
title: Monitoring DPS data reference
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Important reference material needed when you monitor Azure IoT Hub Device Provisioning Service using Azure Monitor
author: kgremban

ms.topic: reference
ms.author: kgremban
ms.service: iot-dps
ms.custom: subject-monitoring
ms.date: 04/15/2022
---

# Monitoring Azure IoT Hub Device Provisioning Service data reference

See [Monitoring Iot Hub Device Provisioning Service](monitor-iot-dps.md) for details on collecting and analyzing monitoring data for Azure IoT Hub Device Provisioning Service (DPS).

## Metrics

This section lists all the automatically collected platform metrics collected for DPS.  

Resource Provider and Type: [Microsoft.Devices/provisioningServices](/azure/azure-monitor/platform/metrics-supported#microsoftdevicesprovisioningservices).

|Metric|Exportable via Diagnostic Settings?|Metric Display Name|Unit|Aggregation Type|Description|Dimensions|
|---|---|---|---|---|---|---|
|AttestationAttempts|Yes|Attestation attempts|Count|Total|Number of device attestations attempted|ProvisioningServiceName, Status, Protocol|
|DeviceAssignments|Yes|Devices assigned|Count|Total|Number of devices assigned to an IoT hub|ProvisioningServiceName, IotHubName|
|RegistrationAttempts|Yes|Registration attempts|Count|Total|Number of device registrations attempted|ProvisioningServiceName, IotHubName, Status|

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric dimensions

DPS has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| IotHubName | The name of the target IoT hub. |
| Protocol | The device or service protocol used. |
| ProvisioningServiceName | The name of the DPS instance. |
| Status | The status of the operation. |

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

## Resource logs

This section lists the types of resource logs you can collect for DPS.

Resource Provider and Type: [Microsoft.Devices/provisioningServices](../azure-monitor/essentials/resource-logs-categories.md#microsoftdevicesprovisioningservices).

| Category |  Description  |
|:---------|------------------|
| DeviceOperations   | Logs related to device attestation events. See device APIs listed in [Billable service operations and pricing](about-iot-dps.md#billable-service-operations-and-pricing). |
| ServiceOperations   | Logs related to DPS service events. See DPS service APIs listed in [Billable service operations and pricing](about-iot-dps.md#billable-service-operations-and-pricing). |

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
| Resource | String | The name forOF the resource where the event took place. For example, "MYEXAMPLEDPS". |
| ResourceGroup | String | The name of the resource group where the resource is located. |
| ResourceId | String | The Azure Resource Manager Resource ID for the resource where the event took place. |
| ResourceProvider | String | The resource provider for the the event. For example, "MICROSOFT.DEVICES". |
| ResourceType | String | The resource type for the event. For example, "PROVISIONINGSERVICES". |
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

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to DPS and available for query by Log Analytics. For a list of these tables and links to more information for the DPS resource type, see [Device Provisioning Services](/azure/azure-monitor/reference/tables/tables-resourcetype#device-provisioning-services) in the Azure Monitor Logs table reference.

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md).

## See Also

- See [Monitoring Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md) for a description of monitoring Azure IoT Hub Device Provisioning Service.

- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.