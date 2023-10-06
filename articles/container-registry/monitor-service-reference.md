---
title: Monitoring Azure Container Registry data reference 
description: Important reference material needed when you monitor your Azure container registry. Provides details about metrics, resource logs, and log schemas. 
author: tejaswikolli-web
ms.author: tejaswikolli
ms.topic: reference
ms.custom: subject-monitoring
ms.service: container-registry
ms.date: 10/11/2022
---

# Monitoring Azure Container Registry data reference

See [Monitor Azure Container Registry](monitor-service.md) for details on collecting and analyzing monitoring data for Azure Container Registry.

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

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

Azure Container Registry has the following dimensions associated with its metrics.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Geolocation** | The Azure region for a registry or [geo-replica](container-registry-geo-replication.md). |


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


## Schemas

The following schemas are in use by Azure Container Registry's resource logs.

| Schema | Description |
|:--- |:---|
| [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/ContainerRegistryLoginEvents)  | Schema for registry authentication events and status, including the incoming identity and IP address |
| [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/ContainerRegistryRepositoryEvents) | Schema for operations on images and other artifacts in registry repositories |
## Next steps

- See [Monitor Azure Container Registry](monitor-service.md) for a description of monitoring an Azure container registry.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/overview.md) for details on monitoring Azure resources.