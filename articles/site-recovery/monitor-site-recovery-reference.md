---
title: Monitoring data reference for Azure Site Recovery
description: This article contains important reference material you need when you monitor Azure Site Recovery.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: azure-site-recovery
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

### Event logs available for Azure Site Recovery

Azure Site Recovery provides the following resource-specific and legacy tables. Each event provides detailed data on a specific set of site recovery related artifacts.

**Resource-specific tables**:

- [AzureSiteRecoveryJobs](/azure/azure-monitor/reference/tables/asrjobs)
- [ASRReplicatedItems](/azure/azure-monitor/reference/tables/ASRReplicatedItems)

**Legacy tables**:

- Azure Site Recovery Events
- Azure Site Recovery Replicated Items  
- Azure Site Recovery Replication Stats
- Azure Site Recovery Points
- Azure Site Recovery Replication Data Upload Rate
- Azure Site Recovery Protected Disk Data Churn
- Azure Site Recovery Replicated Item Details

## Log Analytics data model

This section describes the Log Analytics data model for Azure Site Recover that's added to the Azure Diagnostics table (if your vaults are configured with diagnostics settings to send data to a Log Analytics workspace in Azure Diagnostics mode). You can use this data model to write queries on Log Analytics data to create custom alerts or reporting dashboards.

To understand the fields of each Site Recovery table in Log Analytics, review the details for the Azure Site Recovery Replicated Item Details and Azure Site Recovery Jobs tables. You can find information about the [diagnostic tables](/azure/azure-monitor/reference/tables/azurediagnostics).

> [!TIP]
> Expand this table for better readability.

| Category | Category Display Name | Log Table | [Supports basic log plan](../azure-monitor/logs/data-platform-logs.md#table-plans) | [Supports ingestion-time transformation](../azure-monitor/essentials/data-collection-transformations.md) | Example queries | Costs to export |
| --- | --- | --- | --- | --- | --- | --- |
| *ASRReplicatedItems* | Azure Site Recovery Replicated Item Details | [ASRReplicatedItems](/azure/azure-monitor/reference/tables/asrreplicateditems) <br> This table contains details of Azure Site Recovery replicated items, such as associated vault, policy, replication health, failover readiness. etc. Data is pushed once a day to this table for all replicated items, to provide the latest information for each item. | No | No | [Queries](/azure/azure-monitor/reference/queries/asrreplicateditems) | Yes | 
| *AzureSiteRecoveryJobs* | Azure Site Recovery Jobs | [ASRJobs](/azure/azure-monitor/reference/tables/asrjobs) <br> This table contains records of Azure Site Recovery jobs such as failover, test failover, reprotection etc., with key details for monitoring and diagnostics, such as the replicated item information, duration, status, description, and so on. Whenever an Azure Site Recovery job is completed (that is, succeeded or failed), a corresponding record for the job is sent to this table. You can view history of Azure Site Recovery jobs by querying this table over a larger time range, provided your workspace has the required retention configured. | No | No | [Queries](/azure/azure-monitor/reference/queries/asrjobs) | No |
| *AzureSiteRecoveryEvents* | Azure Site Recovery Events | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics) | No |
| *AzureSiteRecoveryProtectedDiskDataChurn* | Azure Site Recovery Protected Disk Data Churn | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics#queries-for-microsoftrecoveryservices) | No | 
| *AzureSiteRecoveryRecoveryPoints* | Azure Site Recovery Points | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics#queries-for-microsoftrecoveryservices) | No |
| *AzureSiteRecoveryReplicatedItems* | Azure Site Recovery Replicated Items | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics#queries-for-microsoftrecoveryservices) | No |
| *AzureSiteRecoveryReplicationDataUploadRate* | Azure Site Recovery Replication Data Upload Rate | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics#queries-for-microsoftrecoveryservices) | No |
| *AzureSiteRecoveryReplicationStats* | Azure Site Recovery Replication Stats | [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) <br> Logs from multiple Azure resources. | No | No | [Queries](/azure/azure-monitor/reference/queries/azurediagnostics#queries-for-microsoftrecoveryservices) | No |

### ASRReplicatedItems

This is a resource specific table that contains details of Azure Site Recovery replicated items, such as associated vault, policy, replication health, failover readiness. etc. Data is pushed once a day to this table for all replicated items, to provide the latest information for each item.

#### Fields

| Attribute | Value |
|----|----|
| Resource types | microsoft.recoveryservices/vaults |
| Categories |Audit |
| Solutions | LogManagement  |
| Basic log | No |
| Ingestion-time transformation | No |
| Sample Queries | Yes | 

#### Columns

| Column Name |  Type | Description |
|----|----|----|
| ActiveLocation | string | Current active location for the replicated item. If the item is in failed over state, the active location is the secondary (target) region. Otherwise, it is the primary region. |
| BilledSize | real | The record size in bytes |
| Category | string | The category of the log. |
| DatasourceFriendlyName | string | Friendly name of the datasource being replicated. |
| DatasourceType | string | ARM type of the resource configured for replication. |
| DatasourceUniqueId | string | Unique ID of the datasource being replicated. |
| FailoverReadiness | string | Denotes whether there are any configuration issues that could affect the failover operation success for the Azure Site Recovery  replicated item. |
| IRProgressPercentage | int | Progress percentage of the initial replication phase for the replicated item. |
| IsBillable | string | Specifies whether ingesting the data is billable. When _IsBillable is false ingestion isn't billed to your Azure account |
| LastHeartbeat | datetime | Time at which the Azure Site Recovery  agent associated with the replicated item last made a call to the Azure Site Recovery  service. Useful for debugging error scenarios where you wish to identify the time at which issues started arising. |
| LastRpoCalculatedTime | datetime | Time at which the RPO was last calculated by the Azure Site Recovery  service for the replicated item. |
| LastSuccessfulTestFailoverTime | datetime | Time of the last successful failover performed on the replicated item. |
| MultiVMGroupId | string | For scenarios where multi-VM consistency feature is enabled for replicated virtual machines, this field specifies the ID of the multi-VM group associated with the replicated virtual machine. |
| OperationName | string | The name of the operation. |
| OSFamily | string | OS family of the resource being replicated. |
| PolicyFriendlyName | string | Friendly name of the replication policy applied to the replicated item. |
| PolicyId | string | ARM ID of the replication policy applied to the replicated item. |
| PolicyUniqueId | string | Unique ID of the replication policy applied for the replicated item. |
| PrimaryFabricName | string | Represents the source region of the replicated item. By default, the value is the name of the source region, however if you have specified a custom name for the primary fabric while enabling replication, then that custom name shows up under this field. |
| PrimaryFabricType | string | Fabric type associated with the source region of the replicated item. Depending on whether the replicated item is an Azure virtual machine, Hyper-V virtual machine or VMware virtual machine, the value for this field varies. |
| ProtectionInfo | string | Protection status of the replicated item. |
| RecoveryFabricName | string | Represents the target region of the replicated item. By default, the value is the name of the target region. However, if you specify a custom name for the recovery fabric while enabling replication, then that custom name shows up under this field. |
| RecoveryFabricType | string | Fabric type associated with the target region of the replicated item. Depending on whether the replicated item is an Azure virtual machine, Hyper-V virtual machine or VMware virtual machine, the value for this field varies. |
| RecoveryRegion | string | Target region to which the resource is replicated. |
| ReplicatedItemFriendlyName | string | Friendly name of the resource being replicated. |
| ReplicatedItemId | string | ARM ID of the replicated item. |
| ReplicatedItemUniqueId | string | Unique ID of the replicated item. |
| ReplicationHealthErrors | string | List of issues that might be affecting the recovery point generation for the replicated item. |
| ReplicationStatus | string | Status of replication for the Azure Site Recovery  replicated item. |
| _ResourceId | string | A unique identifier for the resource that the record is associated with |
| SourceResourceId | string | ARM ID of the datasource being replicated. |
| SourceSystem | string | The agent type that collected the event. For example, OpsManager for Windows agent, either direct connect or Operations Manager, Linux for all Linux agents, or Azure for Azure Diagnostics |
| _SubscriptionId | string | A unique identifier for the subscription that the record is associated with |
| TenantId | string | The Log Analytics workspace ID |
| TimeGenerated | datetime | The timestamp (UTC) when the log was generated. |
| Type | string | The name of the table |
| VaultLocation | string | Location of the vault associated with the replicated item. |
| VaultName | string | Name of the vault associated with the replicated item. |
| VaultType | string | Type of the vault associated with the replicated item. |
| Version | string | The API version. |

### AzureSiteRecoveryJobs

This table contains records of Azure Site Recovery jobs such as failover, test failover, reprotection etc., with key details for monitoring and diagnostics, such as the replicated item information, duration, status, description, and so on. Whenever an Azure Site Recovery job is completed (that is, succeeded or failed), a corresponding record for the job is sent to this table. You can view history of Azure Site Recovery jobs by querying this table over a larger time range, provided your workspace has the required retention configured.

#### Fields

| Attribute | Value |
|----|----|
| Resource types | microsoft.recoveryservices/vaults |
| Categories | Audit |
| Solutions | LogManagement |
| Basic log | No |
| Ingestion-time transformation | No |
| Sample Queries | Yes |

#### Columns

| Column Name | Type | Description |
|----|----|----|
| _BilledSize | real | The record size in bytes |
| Category | string | The category of the log. |
| CorrelationId | string | Correlation ID associated with the Azure Site Recovery  job for debugging purposes. |
| DurationMs | int | Duration of the Azure Site Recovery  job. |
| EndTime | datetime | End time of the Azure Site Recovery  job. |
| _IsBillable | string | Specifies whether ingesting the data is billable. When _IsBillable is false ingestion isn't billed to your Azure account |
| JobUniqueId | string | Unique ID of the Azure Site Recovery  job. |
| OperationName | string | Type of Azure Site Recovery  job, for example, Test failover. |
| PolicyFriendlyName | string | Friendly name of the replication policy applied to the replicated item (if applicable). |
| PolicyId | string | ARM ID of the replication policy applied to the replicated item (if applicable). |
| PolicyUniqueId | string | Unique ID of the replication policy applied to the replicated item (if applicable). |
| ReplicatedItemFriendlyName | string | Friendly name of replicated item associated with the Azure Site Recovery  job (if applicable). |
| ReplicatedItemId | string | ARM ID of the replicated item associated with the Azure Site Recovery  job (if applicable). |
| ReplicatedItemUniqueId | string | Unique ID of the replicated item associated with the Azure Site Recovery  job (if applicable). |
| ReplicationScenario | string | Field used to identify whether the replication is being done for an Azure resource or an on-premises resource. |
| _ResourceId | string | A unique identifier for the resource that the record is associated with |
| ResultDescription | string | Result of the Azure Site Recovery  job. |
| SourceFriendlyName | string | Friendly name of the resource on which the Azure Site Recovery  job was executed. |
| SourceResourceGroup | string | Resource Group of the source. |
| SourceResourceId | string | ARM ID of the resource on which the Azure Site Recovery  job was executed. |
| SourceSystem | string | The agent type that collected the event. For example, OpsManager for Windows agent, either direct connect or Operations Manager, Linux for all Linux agents, or Azure for Azure Diagnostics |
| SourceType | string | Type of resource on which the Azure Site Recovery  job was executed. |
| StartTime | datetime | Start time of the Azure Site Recovery  job. |
| Status | string | Status of the Azure Site Recovery  job. |
| _SubscriptionId | string | A unique identifier for the subscription that the record is associated with |
| TenantId | string | The Log Analytics workspace ID |
| TimeGenerated | datetime | The timestamp (UTC) when the log was generated. |
| Type | string | The name of the table |
| VaultLocation | string | Location of the vault associated with the Azure Site Recovery  job. |
| VaultName | string | Name of the vault associated with the Azure Site Recovery  job. |
| VaultType | string | Type of the vault associated with the Azure Site Recovery  job. |
| Version | string | The API version. |

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.RecoveryServices](/azure/role-based-access-control/permissions/management-and-governance#microsoftrecoveryservices)

## Related content

- See [Monitor Site Recovery](monitor-site-recovery.md) for a description of monitoring Site Recovery.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
