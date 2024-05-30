---
title: Monitoring data reference for Azure Site Recovery
description: This article contains important reference material you need when you monitor Azure Site Recovery.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: site-recovery
---

# Azure Site Recovery monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Site Recovery](monitor-site-recovery.md) for details on the data you can collect for Azure Site Recovery and how to use it.

## Metrics

There are no automatically collected metrics for Azure Site Recovery. All the automatically collected metrics for the `Microsoft.RecoveryServices/Vaults` namespace are for the Azure Backup service. For information about Azure Backup metrics, see [Monitor Azure Backup](/azure/backup/backup-azure-monitoring-built-in-monitor).

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.RecoveryServices/Vaults

Note that some of the following logs apply to Azure Backup and others apply to Azure Site Recovery, as noted in the **Category display name** column.

[!INCLUDE [Microsoft.RecoveryServices/Vaults](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-recoveryservices-vaults-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Recovery Services Vaults
Microsoft.RecoveryServices/Vaults

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [ASRJobs](/azure/azure-monitor/reference/tables/ASRJobs#columns)
- [ASRReplicatedItems](/azure/azure-monitor/reference/tables/ASRReplicatedItems#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.RecoveryServices](/azure/role-based-access-control/permissions/management-and-governance#microsoftrecoveryservices)

## Related content

- See [Monitor Site Recovery](monitor-site-recovery.md) for a description of monitoring Site Recovery.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
