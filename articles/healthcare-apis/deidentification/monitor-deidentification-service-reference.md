---
title: Monitoring data reference for the De-identification service in Azure Health Data Services
description: Find resource logs, log tables, and activity log operations for the Azure Health Data Services de-identification service. Use this reference to monitor it.
ms.date: 10/28/2026
ms.custom: horz-monitor
ms.topic: reference
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
---

# Azure Health Data Services de-identification service monitoring data reference
[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

To learn more about the data you can collect for the de-identification service and how to use it, see [Monitor the de-identification service](monitor-deidentification-service.md).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.HealthDataAIServices/deidServices
[!INCLUDE [Microsoft.HealthDataAIServices/deidServices](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-healthdataaiservices-deidservices-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Log tables for the de-identification service
Microsoft.HealthDataAIServices/deidServices
- [AHDSDeidAuditLogs](/azure/azure-monitor/reference/tables/ahdsdeidauditlogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.HealthDataAIServices/deidServices resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsofthealthdataaiservices)

## Related content

- To learn more about monitoring the Health Data Services de-identification service, see [Monitor the Azure Health Data Services de-identification service](monitor-deidentification-service.md).
- To learn more about monitoring Azure resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
