---
title: Monitoring data reference for Azure Container Registry
description: This article contains important reference material you need when you monitor Azure Container Registry.
ms.date: 05/20/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
---

<!-- 
IMPORTANT 

According to the Content Pattern guidelines all comments must be removed before publication!!!

To make this template easier to use, first:
1. Search and replace [TODO-replace-with-service-name] with the official name of your service.
2. Search and replace [TODO-replace-with-service-filename] with the service name to use in GitHub filenames.-->

<!-- VERSION 3.0 2024_01_01
For background about this template, see https://review.learn.microsoft.com/en-us/help/contribute/contribute-monitoring?branch=main -->

<!-- All sections are required unless otherwise noted. Add service-specific information after the includes.

Your service should have the following two articles:

1. The primary monitoring article (based on the template monitor-service-template.md)
   - Title: "Monitor [TODO-replace-with-service-name]"
   - TOC title: "Monitor"
   - Filename: "monitor-[TODO-replace-with-service-filename].md"

2. A reference article that lists all the metrics and logs for your service (based on this template).
   - Title: "[TODO-replace-with-service-name] monitoring data reference"
   - TOC title: "Monitoring data reference"
   - Filename: "monitor-[TODO-replace-with-service-filename]-reference.md".
-->

# Azure Container Registry monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Container Registry](monitor-container-registry.md) for details on the data you can collect for Azure Container Registry and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.ContainerRegistry/registries

The following table lists the metrics available for the Microsoft.ContainerRegistry/registries resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.ContainerRegistry/registries](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-containerregistry-metrics-include.md)]

<!-- from original:
## Metrics

### Container Registry metrics

Resource Provider and Type: [Microsoft.ContainerRegistry/registries](../azure-monitor/essentials/metrics-supported.md#microsoftcontainerregistryregistries)

| Metric | Exportable via Diagnostic Settings? | Unit | Aggregation Type | Description | Dimensions  |  
|:-------|:-----|:-----|:------------|:------------------|:----- |
|     AgentPoolCPUTime   | Yes |   Seconds   | Total |   CPU time used by [ACR tasks](container-registry-tasks-overview.md) running on dedicated [agent pools](tasks-agent-pools.md)	         | None | 
|     RunDuration   | Yes |  Milliseconds   |  Total |  Duration of [ACR tasks](container-registry-tasks-overview.md) runs       | None | 
|     StorageUsed   |  No | Bytes   |   Average | Storage used by the container registry<br/><br/>Sum of storage for unique and shared layers, manifest files, and replica copies in all repositories<sup>1</sup>	         | Geolocation | 
|     SuccessfulPullCount | Yes  |   Count   | Total | Successful pulls of container images and other artifacts from the registry	           | None | 
|     SuccessfulPushCount   | Yes |   Count   | Total | Successful pushes of container images and other artifacts to the registry          | None | 
|     TotalPullCount   |   Yes | Count   |     Total |  Total pulls of container images and other artifacts from the registry	      | None | 
|     TotalPushCount   | Yes |  Count   |   Total |  Total pushes of container images and other artifacts to the registry	        | None | 

<sup>1</sup>Because of layer sharing, registry storage used may be less than the sum of storage for individual repositories. When you [delete](container-registry-delete.md) a repository or tag, you recover only the storage used by manifest files and the unique layers referenced.

For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).
-->

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- Geolocation

<!-- FROM ORIGINAL:


## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure Container Registry has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Geolocation** | The Azure region for a registry or [geo-replica](container-registry-geo-replication.md). |



-->

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.ContainerRegistry/registries

[!INCLUDE [Microsoft.ContainerRegistry/registries](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-containerregistry-logs-include.md)]

<!-- ## Log tables -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

<!-- Repeat the following section for each resource type/namespace in your service. Find the table(s) for your service at https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype. 
Replace the <ResourceType/namespace> and tablename placeholders with the namespace name. -->

### Container Registry Microsoft.ContainerRegistry/registries

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/containerregistryloginevents#columns)
- [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/containerregistryrepositoryevents#columns)

<!-- FROM original:
## Resource logs

This section lists the types of resource logs you can collect for Azure Container Registry. 

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

### Container Registries

Resource Provider and Type: [Microsoft.ContainerRegistry/registries](../azure-monitor/essentials/resource-logs-categories.md#microsoftcontainerregistryregistries)

| Category | Display Name | Details  |
|:---------|:-------------|------------------|
| ContainerRegistryLoginEvents  | Login Events | Registry authentication events and status, including the incoming identity and IP address |
| ContainerRegistryRepositoryEvents | Repository Events           | Operations on images and other artifacts in registry repositories<br/><br/> The following operations are logged: push, pull, untag, delete (including repository delete), purge tag, and purge manifest<sup>1</sup> |

<sup>1</sup>Purge events are logged only if a registry [retention policy](container-registry-retention-policy.md) is configured.

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Container Registry and available for query by Log Analytics. 

### Container Registry

| Table |  Description | 
|:---------|:-------------|
| [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)   | Entries from the Azure Activity log that provide insight into any subscription-level or management group level events that have occurred in Azure. | 
| [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics) | Metric data emitted by Azure services that measure their health and performance.    |  
|  [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/containerregistryloginevents)               | Azure Container Registry Login Auditing Logs                             |                                                     
|  [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/containerregistryrepositoryevents)               | Azure Container Registry Repository Auditing Logs                         |                                                    

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

## Activity log

The following table lists operations related to Azure Container Registry that may be created in the [Activity log](../azure-monitor/essentials/activity-log.md). This list is not exhaustive.

| Operation | Description |
|:---|:---|
| Create or Update Container Registry | Create a container registry or update a registry property |
| Delete Container Registry | Delete a container registry |
| List Container Registry Login Credentials | Show credentials for registry's admin account |
| Import Image | Import an image or other artifact to a registry |
| Create Role Assignment | Assign an identity an RBAC role to access a resource  |


 -->

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.ContainerRegistry resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftcontainerregistry)

<!-- FROM original: 

# Monitoring Azure Container Registry data reference

See [Monitor Azure Container Registry](monitor-service.md) for details on collecting and analyzing monitoring data for Azure Container Registry.


## Schemas

The following schemas are in use by Azure Container Registry's resource logs.

| Schema | Description |
|:--- |:---|
| [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/ContainerRegistryLoginEvents)  | Schema for registry authentication events and status, including the incoming identity and IP address |
| [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/ContainerRegistryRepositoryEvents) | Schema for operations on images and other artifacts in registry repositories |

-->

## Related content

- See [Monitor Azure Container Registry](monitor-container-registry.md) for a description of monitoring Container Registry.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
