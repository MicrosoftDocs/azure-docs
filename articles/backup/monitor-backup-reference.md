---
title: Monitoring data reference for Azure Backup
description: This article contains important reference material you need when you monitor Azure Backup by using Azure Monitor.
ms.date: 03/05/2025
ms.custom: horz-monitor
ms.topic: reference
author: FuzziWumpus
ms.author: mkluck
ms.service: azure-backup
# Customer intent: "As a cloud operations engineer, I want to access detailed monitoring data for Azure Backup, so that I can effectively track performance and ensure reliable data protection for our applications."
---

# Azure Backup monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Backup](monitor-backup.md) for details on the data you can collect for Azure Backup and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.DataProtection/BackupVaults

The following table lists the metrics available for the Microsoft.DataProtection/BackupVaults resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.DataProtection/BackupVaults](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-dataprotection-backupvaults-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- [Supported metrics](metrics-overview.md#supported-metrics)

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.DataProtection/BackupVaults

[!INCLUDE [Microsoft.DataProtection/BackupVaults](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-dataprotection-backupvaults-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Backup Microsoft.RecoveryServices/Vaults

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [ASRJobs](/azure/azure-monitor/reference/tables/asrjobs#columns)
- [ASRReplicatedItems](/azure/azure-monitor/reference/tables/asrreplicateditems#columns)
- [AzureBackupOperations](/azure/azure-monitor/reference/tables/azurebackupoperations#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)
- [CoreAzureBackup](/azure/azure-monitor/reference/tables/coreazurebackup#columns)
- [AddonAzureBackupJobs](/azure/azure-monitor/reference/tables/addonazurebackupjobs#columns)
- [AddonAzureBackupAlerts](/azure/azure-monitor/reference/tables/addonazurebackupalerts#columns)
- [AddonAzureBackupPolicy](/azure/azure-monitor/reference/tables/addonazurebackuppolicy#columns)
- [AddonAzureBackupStorage](/azure/azure-monitor/reference/tables/addonazurebackupstorage#columns)
- [AddonAzureBackupProtectedInstance](/azure/azure-monitor/reference/tables/addonazurebackupprotectedinstance#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Management and governance resource provider operations](/azure/role-based-access-control/resource-provider-operations#management-and-governance)

## Related content

- See [Monitor Azure Backup](monitor-backup.md) for a description of monitoring Azure Backup.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
