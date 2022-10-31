---
title: Monitoring Azure Container Instances data reference 
description: Important reference material needed when you monitor Azure Container Instances 
author: tomvcassidy
ms.topic: reference
ms.author: tomcassidy
ms.service: container-instances
ms.custom: subject-monitoring
ms.date: 06/06/2022
---

# Monitoring Azure Container Instances data reference

See [Monitoring Azure Container Instances](monitor-azure-container-instances.md) for details on collecting and analyzing monitoring data for Azure Container Instances.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Container Instances.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Container Instances | [Microsoft.ContainerInstance/containerGroups](/azure/azure-monitor/platform/metrics-supported#microsoftcontainerinstancecontainergroups) |

## Metric dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Azure Container Instances has the following dimension associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **containerName** | The name of the container. The name must be between 1 and 63 characters long. It can contain only lowercase letters numbers, and dashes. Dashes can't begin or end the name, and dashes can't be consecutive. The name must be unique in its resource group. |

## Activity log

The following table lists the operations that Azure Container Instances may record in the Activity log. This is a subset of the possible entries you might find in the activity log. You can also find this information in the [Azure role-based access control (RBAC) Resource provider operations documentation](../role-based-access-control/resource-provider-operations.md#microsoftcontainerinstance).

| Operation | Description |
|:---|:---|
| Microsoft.ContainerInstance/register/action | Registers the subscription for the container instance resource provider and enables the creation of container groups. |
| Microsoft.ContainerInstance/containerGroupProfiles/read | Get all container group profiles. |
| Microsoft.ContainerInstance/containerGroupProfiles/write | Create or update a specific container group profile. |
| Microsoft.ContainerInstance/containerGroupProfiles/delete | Delete the specific container group profile. |
| Microsoft.ContainerInstance/containerGroups/read | Get all container groups. |
| Microsoft.ContainerInstance/containerGroups/write | Create or update a specific container group. |
| Microsoft.ContainerInstance/containerGroups/delete | Delete the specific container group. |
| Microsoft.ContainerInstance/containerGroups/restart/action | Restarts a specific container group. This log only captures customer-intiated restarts, not restarts initiated by Azure Container Instances infrastructure. |
| Microsoft.ContainerInstance/containerGroups/stop/action | Stops a specific container group. Compute resources will be deallocated and billing will stop. |
| Microsoft.ContainerInstance/containerGroups/start/action | Starts a specific container group. |
| Microsoft.ContainerInstance/containerGroups/containers/exec/action | Exec into a specific container. |
| Microsoft.ContainerInstance/containerGroups/containers/attach/action | Attach to the output stream of a container. |
| Microsoft.ContainerInstance/containerGroups/containers/buildlogs/read | Get build logs for a specific container. |
| Microsoft.ContainerInstance/containerGroups/containers/logs/read | Get logs for a specific container. |
| Microsoft.ContainerInstance/containerGroups/detectors/read | List Container Group Detectors |
| Microsoft.ContainerInstance/containerGroups/operationResults/read | Get async operation result |
| Microsoft.ContainerInstance/containerGroups/outboundNetworkDependenciesEndpoints/read | List Container Group Detectors |
| Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the container group. |
| Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the container group. |
| Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for container group. |
| Microsoft.ContainerInstance/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerInstance that virtual network or subnet is being deleted. |
| Microsoft.ContainerInstance/locations/cachedImages/read | Gets the cached images for the subscription in a region. |
| Microsoft.ContainerInstance/locations/capabilities/read | Get the capabilities for a region. |
| Microsoft.ContainerInstance/locations/operationResults/read | Get async operation result |
| Microsoft.ContainerInstance/locations/operations/read | List the operations for Azure Container Instance service. |
| Microsoft.ContainerInstance/locations/usages/read | Get the usage for a specific region. |
| Microsoft.ContainerInstance/operations/read | List the operations for Azure Container Instance service. |
| Microsoft.ContainerInstance/serviceassociationlinks/delete | Delete the service association link created by Azure Container Instance resource provider on a subnet. |

See [all the possible resource provider operations in the activity log](../role-based-access-control/resource-provider-operations.md).  

For more information on the schema of Activity Log entries, see [Activity Log schema](../azure-monitor/essentials/activity-log-schema.md).

## Schemas

The following schemas are in use by Azure Container Instances.

> [!NOTE]
> Some of the columns listed below only exist as part of the schema, and won't have any data emitted in logs. These columns are denoted below with a description of 'Empty'.

### ContainerInstanceLog_CL

| Column | Type | Description |
|-|-|-|
|Computer|string|Empty|
|ContainerGroup_s|string|The name of the container group associated with the record|
|ContainerID_s|string|A unique identifier for the container associated with the record|
|ContainerImage_s|string|The name of the container image associated with the record|
|Location_s|string|The location of the resource associated with the record|
|Message|string|If applicable, the message from the container|
|OSType_s|string|The name of the operating system the container is based on|
|RawData|string|Empty|
|ResourceGroup|string|Name of the resource group that the record is associated with|
|Source_s|string|Name of the logging component, "LoggingAgent"|
|SubscriptionId|string|A unique identifier for the subscription that the record is associated with|
|TimeGenerated|datetime|Timestamp when the event was generated by the Azure service processing the request corresponding the event|
|Type|string|The name of the table|
|_ResourceId|string|A unique identifier for the resource that the record is associated with|
|_SubscriptionId|string|A unique identifier for the subscription that the record is associated with|

### ContainerEvent_CL

|Column|Type|Description|
|-|-|-|
|Computer|string|Empty|
|ContainerGroupInstanceId_g|string|A unique identifier for the container group associated with the record|
|ContainerGroup_s|string|The name of the container group associated with the record|
|ContainerName_s|string|The name of the container associated with the record|
|Count_d|real|How many times the event has occurred since the last poll|
|FirstTimestamp_t|datetime|The timestamp of the first time the event occurred|
|Location_s|string|The location of the resource associated with the record|
|Message|string|If applicable, the message from the container|
|OSType_s|string|The name of the operating system the container is based on|
|RawData|string|Empty|
|Reason_s|string|Empty|
|ResourceGroup|string|The name of the resource group that the record is associated with|
|SubscriptionId|string|A unique identifier for the subscription that the record is associated with|
|TimeGenerated|datetime|Timestamp when the event was generated by the Azure service processing the request corresponding the event|
|Type|string|The name of the table|
|_ResourceId|string|A unique identifier for the resource that the record is associated with|
|_SubscriptionId|string|A unique identifier for the subscription that the record is associated with|

## See also

- See [Monitoring Azure Container Instances](monitor-azure-container-instances.md) for a description of monitoring Azure Container Instances.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.