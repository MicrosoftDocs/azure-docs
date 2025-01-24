---
title: Monitoring data reference for Azure API Management
description: This article contains important reference material you need when you monitor Azure API Management by using Azure Monitor.
ms.date: 01/06/2025
ms.custom: horz-monitor
ms.topic: reference
author: dlepow
ms.author: danlep
ms.service: azure-api-management
---

# API Management monitoring data reference

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor API Management](monitor-api-management.md) for details on the data you can collect for Azure API Management and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.ApiManagement/service

The following table lists the metrics available for the Microsoft.ApiManagement/service resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.ApiManagement/service](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-apimanagement-service-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- ApiId
- BackendResponseCode
- BackendResponseCodeCategory
- Destination
- GatewayResponseCode
- GatewayResponseCodeCategory
- Hostname
- LastErrorReason
- Location
- ResourceType
- Source
- State

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.ApiManagement/service

[!INCLUDE [Microsoft.ApiManagement/service](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-apimanagement-service-logs-include.md)]

### Supported resource logs for Microsoft.ApiManagement/service/workspaces

[!INCLUDE [Microsoft.ApiManagement/service/workspaces](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-apimanagement-service-workspaces-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### API Management Microsoft.ApiManagement/service

- [APIMDevPortalAuditDiagnosticLog](/azure/azure-monitor/reference/tables/apimdevportalauditdiagnosticlog#columns)
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)
- [ApiManagementGatewayLogs](/azure/azure-monitor/reference/tables/apimanagementgatewaylogs#columns)
- [ApiManagementWebSocketConnectionLogs](/azure/azure-monitor/reference/tables/apimanagementwebsocketconnectionlogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Microsoft.ApiManagement resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftapimanagement)

## Related content

- See [Monitor API Management](monitor-api-management.md) for a description of monitoring Azure API Management.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.