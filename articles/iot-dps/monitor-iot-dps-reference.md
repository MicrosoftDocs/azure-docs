---
title: Monitoring Azure IoT Hub Device Provisioning Service data reference #Required; *your official service name*  
description: Important reference material needed when you monitor Azure IoT Hub Device Provisioning Service 
author: kgremban
ms.topic: reference
ms.author: kgremban
ms.service: iot-dps
ms.custom: subject-monitoring
ms.date: 03/29/2022
---
<!-- VERSION 2.3
Template for monitoring data reference article for Azure services. This article is support for the main "Monitoring [servicename]" article for the service. -->

<!-- IMPORTANT STEP 1.  Do a search and replace of [TODO-replace-with-service-name] with the name of your service. That will make the template easier to read -->

# Monitoring Azure IoT Hub Device Provisioning Service data reference

See [Monitoring Iot Hub Device Provisioning Service](monitor-iot-dps.md) for details on collecting and analyzing monitoring data for Azure IoT Hub Device Provisioning Service (DPS).

## Metrics

<!-- REQUIRED if you support Metrics. If you don't, keep the section but call that out. Some services are only onboarded to logs.
<!-- Please keep headings in this order -->

<!-- 2 options here depending on the level of extra content you have. -->

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the automatically collected platform metrics collected for DPS.  

|Metric Type | Resource Provider / Type Namespace |
|-------|-----|
| Device Provisioning Service | [Microsoft.Devices/provisioningServices](/azure/azure-monitor/platform/metrics-supported#microsoftdevicesprovisioningservices) |

<!-- Add additional explanation of reference information as needed here. Link to other articles such as your Monitor [servicename] article as appropriate. -->

<!-- Keep this text as-is -->
For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

<!-- REQUIRED. Please  keep headings in this order -->
<!-- If you have metrics with dimensions, outline it here. If you have no dimensions, say so.  Questions email azmondocs@microsoft.com -->

DPS has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **IotHubName** | The name of the target IoT Hub for **DeviceAssignments** and **RegistrationAttempts**. |
| **Protocol** | The device or service protocol for **AttestationAttempts** and **RegistrationAttempts**. Supported values are: |
| **ProvisioningServiceName** | The name of the DPS instance. |
| **Status** | The status of **AttestationAttempts** or **RegistrationAttempts**. Supported values are: . |

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for DPS.

Resource Provider and Type: [Microsoft.Devices/provisioningServices](/azure/azure-monitor/essentials/resource-logs-categories?branch=pr-en-us-193324#microsoftdevicesprovisioningservices)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| DeviceOperations   | Device Operations  | *TODO other important information about this type* |
| ServiceOperations   | Service Operations | *TODO other important information about this type* |

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

## Azure Monitor Logs tables
<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to DPS and available for query by Log Analytics.

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

|Resource Type | Notes |
|-------|-----|
| [Device Provisioning Service](/azure/azure-monitor/reference/tables/tables-resourcetype#device-provisioning-services) | |

<!-- Add extra information if required -->

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

DPS uses the [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table to store resource log information. The following columns are relevant.

| Property | Data type | Description |
|:--- |:---|:---|
| Time | DateTime | The date and time that this event occurred, in UTC. |
| ResourceId | String | The Azure Resource Manager Resource ID for the resource where the event took place. |
| OperationName | String | The type of action performed during the event. For example: Query, Get, Upsert, and so on.  |
| OperationVersion | String | The API Version used during the event. |
| Category | String | Type of operation, either **ServiceOperations** or **DeviceOperations**. |
| ResultType | String | Outcome of the event: Success, Failure, ClientError. |
| ResultSignature | String | HTTP status code for the event if unsuccessful. |
| ResultDescription | String | Error details for the event if unsuccessful. |
| DurationMs | String | How long it took to perform the event in milliseconds. |
| CallerIpAddress | String | A masked source IP address for the event. |
| CorrelationId | GUID | Customer provided unique identifier for the event. |
| ApplicationId | GUID | Application ID used in bearer authorization. |
| Level | Int | The logging severity of the event. |
| location_s | String | The region where the event took place. |
| properties_s | JSON | Additional information details for the event. |

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to DPS that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema).

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by DPS:

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure IoT Hub Device Provisioning Service](monitor-iot-dps.md) for a description of monitoring Azure IoT Hub Device Provisioning Service.

- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
