---
title: Monitoring data reference for Azure Cache for Redis
description: This article contains important reference material you need when you monitor Azure Cache for Redis.
ms.date: 01/29/2024
ms.custom: horz-monitor
ms.topic: reference
author: GitHub-alias
ms.author: microsoft-alias
ms.service: your-service
---

# Azure Cache for Redis monitoring data reference

<!-- Intro -->
[!INCLUDE [horz-monitor-ref-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Cache for Redis](monitor-cache.md) for details on the data you can collect for Azure Cache for Redis and how to use it.

<!-- ## Metrics -->
[!INCLUDE [horz-monitor-ref-metrics-intro](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Cache/redis
The following table lists the metrics available for the Microsoft.Cache/redis resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-cache-redis-metrics-include.md)]

### Supported metrics for Microsoft.Cache/redisEnterprise
The following table lists the metrics available for the Microsoft.Cache/redisEnterprise resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.Cache/redisEnterprise](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-cache-redisenterprise-metrics-include.md)]

<!-- ## Resource logs -->
[!INCLUDE [horz-monitor-ref-resource-logs](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Cache/redis
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-cache-redis-logs-include.md)]
<!-- Add any further information here.
<!-- Repeat the ### heading, tableheader #include, table, and further information for each resource type/namespace. -->

### Supported resource logs for Microsoft.Cache/redisEnterprise/databases
[!INCLUDE [Microsoft.Cache/redis](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-cache-redisenterprise-databases-logs-include.md)]

<!-- ## Azure Monitor Logs tables -->
[!INCLUDE [horz-monitor-ref-logs-tables](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Microsoft.Cache/redis
Azure Cache for Redis logs use the following columns.

#### ACRConnectedClientList
[!INCLUDE [ACRConnectedClientList](~/azure-reference-other-repo/azure-monitor-ref/includes/acrconnectedclientlist-include.md)]

#### AzureActivity
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)

#### AzureMetrics
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)

### Microsoft.Cache/redisEnterprise
Azure Cache for Redis Enterprise logs use the following columns.

#### REDConnectionEvents
[!INCLUDE [REDConnectionEvents](~/azure-reference-other-repo/azure-monitor-ref/includes/redconnectionevents-include.md)]

<!-- ## Activity log -->
[!INCLUDE [horz-monitor-ref-activity-log](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Cache](/azure/role-based-access-control/resource-provider-operations#microsoftcache)

<!-- ## Other schemas. If your service doesn't use other schemas, remove this section. If your service uses other schemas, list them after the following include. Please keep heading in this order. -->
<!--[!INCLUDE [horz-monitor-ref-other-schemas](~/articles/reusable-content/azure-monitor/horizontals/horz-monitor-ref-other-schemas.md)]
<!-- List other schemas and their usage here. These can be resource logs, alerts, event hub formats, etc. depending on what you think is important. You can put JSON messages, API responses not listed in the REST API docs, and other similar types of info here.  -->

## Related content

- See [Monitor Azure Cache for Redis](monitor-cache.md) for a description of monitoring Azure Cache for Redis.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
