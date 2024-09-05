---
title: Monitoring data reference for Azure Container Registry
description: This article contains important reference material you need when you monitor Azure Container Registry.
ms.date: 06/17/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
---

# Azure Container Registry monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Container Registry](monitor-container-registry.md) for details on the data you can collect for Azure Container Registry and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.ContainerRegistry/registries

The following table lists the metrics available for the Microsoft.ContainerRegistry/registries resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.ContainerRegistry/registries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-containerregistry-registries-metrics-include.md)]

> [!NOTE]
> Because of layer sharing, registry **Storage used** might be less than the sum of storage for individual repositories. When you [delete](container-registry-delete.md) a repository or tag, you recover only the storage used by manifest files and the unique layers referenced.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- **Geolocation**. The Azure region for a registry or [geo-replica](container-registry-geo-replication.md).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.ContainerRegistry/registries

[!INCLUDE [Microsoft.ContainerRegistry/registries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-containerregistry-registries-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

For a reference of all Azure Monitor Logs and Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

### Container Registry Microsoft.ContainerRegistry/registries

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns). Entries from the Azure Activity log that provide insight into any subscription-level or management group level events that occurred in Azure.
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns). Metric data emitted by Azure services that measure their health and performance.
- [ContainerRegistryLoginEvents](/azure/azure-monitor/reference/tables/containerregistryloginevents#columns). Registry authentication events and status, including the incoming identity and IP address.
- [ContainerRegistryRepositoryEvents](/azure/azure-monitor/reference/tables/containerregistryrepositoryevents#columns). Operations on images and other artifacts in registry repositories. The following operations are logged: push, pull, untag, delete (including repository delete), purge tag, and purge manifest.

  Purge events are logged only if a registry [retention policy](container-registry-retention-policy.md) is configured.

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.ContainerRegistry resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftcontainerregistry)

The following table lists operations related to Azure Container Registry that can be created in the Activity log. This list isn't exhaustive.

| Operation | Description |
|:---|:---|
| Create or Update Container Registry | Create a container registry or update a registry property |
| Delete Container Registry | Delete a container registry |
| List Container Registry Login Credentials | Show credentials for registry's admin account |
| Import Image | Import an image or other artifact to a registry |
| Create Role Assignment | Assign an identity a Role-based access control (RBAC) role to access a resource  |

## Related content

- See [Monitor Azure Container Registry](monitor-container-registry.md) for a description of monitoring Container Registry.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
