---
title: Azure Monitor logs data model 
description: In this article, learn about the Azure Monitor Log Analytics data model details for Azure Backup data.
ms.topic: how-to
ms.date: 11/30/2022
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Log Analytics data model for Azure Backup data

This article describes the Log Analytics data model for Azure Backup that's added to the Azure Diagnostics table (if your vaults are configured with diagnostics settings to send data to a Log Analytics workspace in Azure Diagnostics mode). You can use this data model to write queries on Log Analytics data to create custom alerts or reporting dashboards.

>[!Note]
>We recommend you to [use the new resource-specific mode](backup-azure-diagnostic-events.md#steps-to-move-to-new-diagnostics-settings-for-a-log-analytics-workspace) to query data in Log Analytics or [use system functions](backup-reports-system-functions.md).

In this article, you'll learn about:

> [!div class="checklist"]
> - Using the Azure Backup data model
> - Sample Kusto queries
> - V1 schema vs V2 schema

## Use the Azure Backup data model

You can use the following fields provided as part of the data model to create visuals, custom queries, and dashboard according to your requirements.

### Alert

The following table provides details about alert related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| AlertUniqueId_s |Text |Unique identifier of the generated alert |
| AlertType_s |Text |Type of alert, for example, Backup |
| AlertStatus_s |Text |Status of the alert, for example, Active |
| AlertOccurrenceDateTime_s |Date/Time |Date and time when alert was created |
| AlertSeverity_s |Text |Severity of the alert, for example, Critical |
|AlertTimeToResolveInMinutes_s    | Number        |Time taken to resolve an alert. Blank for active alerts.         |
|AlertConsolidationStatus_s   |Text         |Identify if the alert is a consolidated alert or not         |
|CountOfAlertsConsolidated_s     |Number         |Number of alerts consolidated if it's a consolidated alert          |
|AlertRaisedOn_s     |Text         |Type of entity the alert is raised on         |
|AlertCode_s     |Text         |Code to uniquely identify an alert type         |
|RecommendedAction_s   |Text         |Action recommended resolving the alert         |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |
| BackupItemUniqueId_s |Text |Unique identifier of the backup item associated with the alert |
| SchemaVersion_s |Text |Current version of the schema, for example **V2** |
| State_s |Text |Current state of the alert object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup, for example, IaaSVM, FileFolder to which this alert belongs |
| OperationName |Text |Name of the current operation, for example, Alert |
| Category |Text |Category of diagnostics data pushed to Azure Monitor logs. Always AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedContainerUniqueId_s |Text |Unique identifier of the protected server associated with the alert (Was ProtectedServerUniqueId_s in V1)|
| VaultUniqueId_s |Text |Unique identifier of the protected vault associated with the alert |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Unique identifier for the resource about which data is collected. For example, a Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### BackupItem

The following table provides details about the backup item-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique identifier of the backup item |
| BackupItemId_s |Text |Identifier of backup item (This field is only for v1 schema) |
| BackupItemName_s |Text |Name of backup item |
| BackupItemFriendlyName_s |Text |Friendly name of backup item |
| BackupItemType_s |Text |Type of backup item, for example, VM, FileFolder |
| BackupItemProtectionState_s |Text |Protection State of the Backup Item |
| BackupItemAppVersion_s |Text |Application version of the backup item |
| ProtectionState_s |Text |Current protection state of the backup item, for example, Protected, ProtectionStopped |
| ProtectionGroupName_s |Text | Name of the Protection Group the Backup Item is protected in, for SC DPM, and MABS, if applicable|
| SecondaryBackupProtectionState_s |Text |Whether secondary protection is enabled for the backup item|
| SchemaVersion_s |Text |Version of the schema, for example, **V2** |
| State_s |Text |State of the backup item object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup, for example, IaaSVM, FileFolder to which this backup item belongs |
| OperationName |Text |Name of the operation, for example, BackupItem |
| Category |Text |Category of diagnostics data pushed to Azure Monitor logs. Always AzureBackupReport |
| Resource |Text |Resource for which data is collected, for example, Recovery Services vault name |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource ID for data being collected, for example, Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (for ex. Recovery Services vault) for data being collected |
| ResourceGroup |Text |Resource group of the resource (for ex. Recovery Services vault) for data being collected |
| ResourceProvider |Text |Resource provider for data being collected, for example, Microsoft.RecoveryServices |
| ResourceType |Text |Type of the resource for data being collected, for example, Vaults |

### BackupItemAssociation

The following table provides details about backup item associations with various entities.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event. It's always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique ID of the backup item |
| SchemaVersion_s |Text |This field denotes the current version of the schema. It is **V2** |
| State_s |Text |Current state of the backup item association object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| BackupItemSourceSize_s |Text | Front-end size of the backup item |
| BackupManagementServerUniqueId_s |Text | Field to uniquely identify the Backup Management Server the Backup Item is protected through, if applicable |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics. It is AzureBackupReport |
| OperationName |Text |This field represents name of the current operation - BackupItemAssociation |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedContainerUniqueId_s |Text |Unique identifier of the protected server associated with the backup item (Was ProtectedServerUniqueId_s in V1) |
| VaultUniqueId_s |Text |Unique identifier of the vault containing the backup item |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceGroup |Text |Resource group of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceProvider |Text |Resource provider for data being collected, for example, Microsoft.RecoveryServices |
| ResourceType |Text |Type of the resource for data is being collected, for example, Vaults |

### BackupManagementServer

The following table provides details about backup item associations with various entities.

| Field | Data Type | Description |
| --- | --- | --- |
|BackupManagementServerName_s     |Text         |Name of the Backup Management Server        |
|AzureBackupAgentVersion_s     |Text         |Version of the Azure Backup Agent on the Backup Management Server          |
|BackupManagementServerVersion_s     |Text         |Version of the Backup Management Server|
|BackupManagementServerOSVersion_s    |Text            |OS version of the Backup Management Server|
|BackupManagementServerType_s     |Text         |Type of the Backup Management Server, as MABS, SC DPM|
|BackupManagementServerUniqueId_s     |Text         |Field to uniquely identify the Backup Management Server       |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceGroup |Text |Resource group of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceProvider |Text |Resource provider for data being collected, for example, Microsoft.RecoveryServices |
| ResourceType |Text |Type of the resource for data is being collected, for example, Vaults |

### Job

The following table provides details about job-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |
| BackupItemUniqueId_s |Text |Unique identifier of the backup item |
| SchemaVersion_s |Text |Version of the schema, for example, **V2** |
| State_s |Text |Current state of the job object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - Job |
| Category |Text |This field represents category of diagnostics data pushed to Azure Monitor logs. It is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique identifier of the protected server associated the job |
| ProtectedContainerUniqueId_s |Text | Unique ID to identify the protected container the job is run on |
| VaultUniqueId_s |Text |Unique identifier of the protected vault |
| JobOperation_s |Text |Operation for which job is run for example, Backup, Restore, Configure Backup |
| JobStatus_s |Text |Status of the finished job, for example, Completed, Failed |
| JobFailureCode_s |Text |Failure Code string because of which job failure happened |
| JobStartDateTime_s |Date/Time |Date and time when job started running |
| BackupStorageDestination_s |Text |Destination of backup storage, for example, Cloud, Disk  |
| AdHocOrScheduledJob_s |Text | Field to specify if the job is Ad Hoc or Scheduled |
| JobDurationInSecs_s | Number |Total job duration in seconds |
| DataTransferredInMB_s | Number |Data transferred in MB for this job|
| JobUniqueId_g |Text |Unique ID to identify the job |
| RecoveryJobDestination_s |Text | Destination of a recovery job, where the data is recovered |
| RecoveryJobRPDateTime_s |DateTime | The date, time when the recovery point that's being recovered was created |
| RecoveryJobRPLocation_s |Text | The location where the recovery point that's being recovered was stored|
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource ID|
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### Policy

The following table provides details about policy-related fields.

| Field | Data Type | Versions Applicable | Description |
| --- | --- | --- | --- |
| EventName_s |Text ||This field represents name of this event. It's always AzureBackupCentralReport |
| SchemaVersion_s |Text ||This field denotes current version of the schema. It is **V2** |
| State_s |Text ||Current state of the policy object, for example, Active, Deleted |
| BackupManagementType_s |Text ||Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text ||This field represents name of the current operation - Policy |
| Category |Text ||This field represents category of diagnostics data pushed to Azure Monitor logs. It is AzureBackupReport |
| Resource |Text ||This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text ||Unique ID to identify the policy |
| PolicyName_s |Text ||Name of the policy defined |
| BackupFrequency_s |Text ||Frequency with which backups are run, for example, daily, weekly |
| BackupTimes_s |Text ||Date and time when backups are scheduled |
| BackupDaysOfTheWeek_s |Text ||Days of the week when backups have been scheduled |
| RetentionDuration_s |Whole Number ||Retention duration for configured backups |
| DailyRetentionDuration_s |Whole Number ||Total retention duration in days for configured backups |
| DailyRetentionTimes_s |Text ||Date and time when daily retention was configured |
| WeeklyRetentionDuration_s |Decimal Number ||Total weekly retention duration in weeks for configured backups |
| WeeklyRetentionTimes_s |Text ||Date and time when weekly retention is configured |
| WeeklyRetentionDaysOfTheWeek_s |Text ||Days of the week selected for weekly retention |
| MonthlyRetentionDuration_s |Decimal Number ||Total retention duration in months for configured backups |
| MonthlyRetentionTimes_s |Text ||Date and time when monthly retention is configured |
| MonthlyRetentionFormat_s |Text ||Type of configuration for monthly retention, for example, daily for day based, weekly for week based |
| MonthlyRetentionDaysOfTheWeek_s |Text ||Days of the week selected for monthly retention |
| MonthlyRetentionWeeksOfTheMonth_s |Text ||Weeks of the month when monthly retention is configured, for example, First, Last |
| YearlyRetentionDuration_s |Decimal Number ||Total retention duration in years for configured backups |
| YearlyRetentionTimes_s |Text | | Date and time when yearly retention is configured |
| YearlyRetentionMonthsOfTheYear_s |Text | | Months of the year selected for yearly retention |
| YearlyRetentionFormat_s |Text ||Type of configuration for yearly retention, for example, daily for day based, weekly for week based |
| YearlyRetentionDaysOfTheMonth_s |Text ||Dates of the month selected for yearly retention |
| SynchronisationFrequencyPerDay_s |Whole Number |v2|Number of times in a day a file backup is synchronized for SC DPM and MABS |
| DiffBackupFormat_s |Text |v2|Format for Differential backups for SQL in Azure VM backup |
| DiffBackupTime_s |Time |v2|Time for Differential backups for SQL in Azure VM Backup|
| DiffBackupRetentionDuration_s |Decimal Number |v2|Retention duration for Differential backups for SQL in Azure VM Backup|
| LogBackupFrequency_s |Decimal Number |v2|Frequency for Log backups for SQL|
| LogBackupRetentionDuration_s |Decimal Number |v2|Retention duration for Log backups for SQL in Azure VM Backup|
| DiffBackupDaysofTheWeek_s |Text |v2|Days of the week for Differential backups for SQL in Azure VM Backup|
| SourceSystem |Text ||Source system of the current data - Azure |
| ResourceId |Text ||Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text ||Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text ||Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text ||Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text ||Resource type for which data is collected. For example, Vaults |

### PolicyAssociation

The following table provides details about policy associations with various entities.

| Field | Data Type | Versions Applicable | Description |
| --- | --- | --- | --- |
| EventName_s |Text ||This field represents name of this event. It's always AzureBackupCentralReport |
| SchemaVersion_s |Text ||This field denotes current version of the schema. It is **V2** |
| State_s |Text ||Current state of the policy object, for example, Active, Deleted |
| BackupManagementType_s |Text ||Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text ||This field represents name of the current operation - PolicyAssociation |
| Category |Text ||This field represents category of diagnostics data pushed to Azure Monitor logs. It is AzureBackupReport |
| Resource |Text ||This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text ||Unique ID to identify the policy |
| VaultUniqueId_s |Text ||Unique ID of the vault to which this policy belongs |
| BackupManagementServerUniqueId_s |Text |v2 |Field to uniquely identify the Backup Management Server the Backup Item is protected through, if applicable        |
| SourceSystem |Text ||Source system of the current data - Azure |
| ResourceId |Text ||Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text ||Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text ||Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text ||Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text ||Resource type for which data is collected. For example, Vaults |

### Protected Container

The following table provides basic fields about Protected Containers. (Was ProtectedServer in v1)

| Field | Data Type | Description |
| --- | --- | --- |
| ProtectedContainerUniqueId_s |Text | Field to uniquely identify a Protected Container |
| ProtectedContainerOSType_s |Text |OS Type of the Protected Container |
| ProtectedContainerOSVersion_s |Text |OS Version of the Protected Container |
| AgentVersion_s |Text |Version number of Agent Backup or the Protection Agent (In the case of SC DPM and MABS) |
| BackupManagementType_s |Text |Provider type for performing backup. For example, IaaSVM, FileFolder |
| EntityState_s |Text |Current state of the protected server object. For example, Active, Deleted |
| ProtectedContainerFriendlyName_s |Text |Friendly name of protected server |
| ProtectedContainerName_s |Text |Name of the Protected Container |
| ProtectedContainerWorkloadType_s |Text |Type of the Protected Container backed up. For example, IaaSVMContainer |
| ProtectedContainerLocation_s |Text |Whether the Protected Container is located On-premises or in Azure |
| ProtectedContainerType_s |Text |Whether the Protected Container is a server, or a container |
| ProtectedContainerProtectionState_s’  |Text |Protection State of the Protected Container |

### Storage

The following table provides details about storage-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| CloudStorageInBytes_s |Decimal Number |Cloud backup storage used by backups, calculated based on latest value (This field is only for v1 schema)|
| ProtectedInstances_s |Decimal Number |Number of protected instances used for calculating frontend storage in billing, calculated based on latest value |
| EventName_s |Text |This field represents name of this event. It's always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema. It is **V2** |
| State_s |Text |Current state of the storage object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - Storage |
| Category |Text |This field represents category of diagnostics data pushed to Azure Monitor logs. It is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique ID of the protected server for which storage is calculated |
| VaultUniqueId_s |Text |Unique ID of the vault for storage is calculated |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |
| StorageUniqueId_s |Text |Unique ID used to identify the storage entity |
| StorageType_s |Text |Type of Storage, for example Cloud, Volume, Disk |
| StorageName_s |Text |Name of storage entity, for example E:\ |
| StorageTotalSizeInGBs_s |Text |Total size of storage, in GB, consumed by storage entity|

### StorageAssociation

The following table provides basic storage-related fields connecting storage to other entities.

| Field | Data Type | Description |
| --- | --- |  --- |
| StorageUniqueId_s |Text |Unique ID used to identify the storage entity |
| SchemaVersion_s |Text |This field denotes current version of the schema. It is **V2** |
| BackupItemUniqueId_s |Text |Unique ID used to identify the backup item related to the storage entity |
| BackupManagementServerUniqueId_s |Text |Unique ID used to identify the backup management server related to the storage entity|
| VaultUniqueId_s |Text |Unique ID used to identify the vault related to the storage entity|
| StorageConsumedInMBs_s |Number|Size of storage consumed by the corresponding backup item in the corresponding storage |
| StorageAllocatedInMBs_s |Number |Size of storage allocated by the corresponding backup item in the corresponding storage of type Disk|

### Vault

The following table provides details about vault-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event. It's always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema. It is **V2** |
| State_s |Text |Current state of the vault object, for example, Active, Deleted |
| OperationName |Text |This field represents name of the current operation - Vault |
| Category |Text |This field represents category of diagnostics data pushed to Azure Monitor logs. It is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| VaultUniqueId_s |Text |Unique ID of the vault |
| VaultName_s |Text |Name of the vault |
| AzureDataCenter_s |Text |Data center where vault is located |
| StorageReplicationType_s |Text |Type of storage replication for the vault, for example, GeoRedundant |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### Backup Management Server

The following table provides basic fields about Backup Management Servers.

|Field  |Data Type  | Description  |
|---------|---------|----------|
|BackupManagementServerName_s     |Text         |Name of the Backup Management Server        |
|AzureBackupAgentVersion_s     |Text         |Version of the Azure Backup Agent on the Backup Management Server          |
|BackupManagementServerVersion_s     |Text         |Version of the Backup Management Server|
|BackupManagementServerOSVersion_s     |Text            |OS version of the Backup Management Server|
|BackupManagementServerType_s     |Text         |Type of the Backup Management Server, as MABS, SC DPM|
|BackupManagementServerUniqueId_s     |Text         |Field to uniquely identify the Backup Management Server       |

### PreferredWorkloadOnVolume

The following table specifies the workload(s) a Volume is associated with.

| Field | Data Type | Description |
| --- | --- | --- |
| StorageUniqueId_s |Text |Unique ID used to identify the storage entity |
| BackupItemType_s |Text |The workloads for which this volume is the preferred storage|

### ProtectedInstance

The following table provides basic protected instances-related fields.

| Field | Data Type |Versions Applicable | Description |
| --- | --- | --- | --- |
| BackupItemUniqueId_s |Text |v2|Unique ID used to identify the backup item for VMs backed up using DPM, MABS|
| ProtectedContainerUniqueId_s |Text |v2|Unique ID used to identify the protected container for everything except VMs backed up using DPM, MABS|
| ProtectedInstanceCount_s |Text |v2|Count of Protected Instances for the associated backup item or protected container on that date-time|

### RecoveryPoint

The following table provides basic recovery point related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| BackupItemUniqueId_s |Text |Unique ID used to identify the backup item for VMs backed up using DPM, MABS|
| OldestRecoveryPointTime_s |Text |Date time of the oldest recovery point for the backup item|
| OldestRecoveryPointLocation_s |Text |Location of the oldest recovery point for the backup item|
| LatestRecoveryPointTime_s |Text |Date time of the latest recovery point for the backup item|
| LatestRecoveryPointLocation_s |Text |Location of the latest recovery point for the backup item|

## Sample Kusto queries

Below are a few samples to help you write queries on Azure Backup data that resides in the Azure Diagnostics table:

- All successful backup jobs

    ````Kusto
    AzureDiagnostics
    | where Category == "AzureBackupReport"
    | where SchemaVersion_s == "V2"
    | where OperationName == "Job" and JobOperation_s == "Backup"
    | where JobStatus_s == "Completed"
    ````

- All failed backup jobs

    ````Kusto
    AzureDiagnostics
    | where Category == "AzureBackupReport"
    | where SchemaVersion_s == "V2"
    | where OperationName == "Job" and JobOperation_s == "Backup"
    | where JobStatus_s == "Failed"
    ````

- All successful Azure VM backup jobs

    ````Kusto
    AzureDiagnostics
    | where Category == "AzureBackupReport"
    | where SchemaVersion_s == "V2"
    | extend JobOperationSubType_s = columnifexists("JobOperationSubType_s", "")
    | where OperationName == "Job" and JobOperation_s == "Backup" and JobStatus_s == "Completed" and JobOperationSubType_s != "Log" and JobOperationSubType_s != "Recovery point_Log"
    | join kind=inner
    (
        AzureDiagnostics
        | where Category == "AzureBackupReport"
        | where OperationName == "BackupItem"
        | where SchemaVersion_s == "V2"
        | where BackupItemType_s == "VM" and BackupManagementType_s == "IaaSVM"
        | distinct BackupItemUniqueId_s, BackupItemFriendlyName_s
        | project BackupItemUniqueId_s , BackupItemFriendlyName_s
    )
    on BackupItemUniqueId_s
    | extend Vault= Resource
    | project-away Resource
    ````

- All successful SQL log backup jobs

    ````Kusto
    AzureDiagnostics
    | where Category == "AzureBackupReport"
    | where SchemaVersion_s == "V2"
    | extend JobOperationSubType_s = columnifexists("JobOperationSubType_s", "")
    | where OperationName == "Job" and JobOperation_s == "Backup" and JobStatus_s == "Completed" and JobOperationSubType_s == "Log"
    | join kind=inner
    (
        AzureDiagnostics
        | where Category == "AzureBackupReport"
        | where OperationName == "BackupItem"
        | where SchemaVersion_s == "V2"
        | where BackupItemType_s == "SQLDataBase" and BackupManagementType_s == "AzureWorkload"
        | distinct BackupItemUniqueId_s, BackupItemFriendlyName_s
        | project BackupItemUniqueId_s , BackupItemFriendlyName_s
    )
    on BackupItemUniqueId_s
    | extend Vault= Resource
    | project-away Resource
    ````

- All successful Azure Backup agent jobs

    ````Kusto
    AzureDiagnostics
    | where Category == "AzureBackupReport"
    | where SchemaVersion_s == "V2"
    | extend JobOperationSubType_s = columnifexists("JobOperationSubType_s", "")
    | where OperationName == "Job" and JobOperation_s == "Backup" and JobStatus_s == "Completed" and JobOperationSubType_s != "Log" and JobOperationSubType_s != "Recovery point_Log"
    | join kind=inner
    (
        AzureDiagnostics
        | where Category == "AzureBackupReport"
        | where OperationName == "BackupItem"
        | where SchemaVersion_s == "V2"
        | where BackupItemType_s == "FileFolder" and BackupManagementType_s == "MAB"
        | distinct BackupItemUniqueId_s, BackupItemFriendlyName_s
        | project BackupItemUniqueId_s , BackupItemFriendlyName_s
    )
    on BackupItemUniqueId_s
    | extend Vault= Resource
    | project-away Resource
    ````

## V1 schema vs V2 schema

Earlier, diagnostics data for Azure Backup Agent and Azure VM backup was sent to Azure Diagnostics table in a schema referred to as ***V1 schema***. Subsequently, new columns were added to support other scenarios and workloads, and diagnostics data was pushed in a new schema referred to as ***V2 schema***.  

For the backward-compatibility reasons, diagnostics data for Azure Backup agent and Azure VM backup is currently sent to Azure Diagnostics table in both V1 and V2 schema (with V1 schema now on a deprecation path). You can identify which records in Log Analytics are of V1 schema by filtering records for SchemaVersion_s=="V1" in your log queries.

See the third column 'Description' in the [data model](#use-the-azure-backup-data-model) described above to identify which columns belong to V1 schema only.

### Modify the queries to use the V2 schema

As the V1 schema is on a deprecation path, we recommend you to use only the V2 schema in all your custom queries on Azure Backup diagnostic data.

To update your queries to remove dependency on V1 schema, follow these steps:

1. Identify if your query is using any field that's only applicable to the V1 schema. Assume you have a query to list all the backup items and their associated protected servers as follows:

    ````Kusto
    AzureDiagnostics
    | where Category=="AzureBackupReport"
    | where OperationName=="BackupItemAssociation"
    | distinct BackupItemUniqueId_s, ProtectedServerUniqueId_s
    ````

    The above query uses the field ProtectedServerUniqueId_s, which is only applicable to V1 schema. The V2 schema equivalent of this field is ProtectedContainerUniqueId_s (refer tables above). The field BackupItemUniqueId_s is applicable even to V2 schema and the same field can be used in this query.

2. Update the query to use the V2 schema field names. It's a recommended practice to use the filter **where SchemaVersion_s=="V2"** in all your queries, so that only records corresponding to V2 schema are parsed by the query:

    ````Kusto
    AzureDiagnostics
    | where Category=="AzureBackupReport"
    | where OperationName=="BackupItemAssociation"
    | where SchemaVersion_s=="V2"
    | distinct BackupItemUniqueId_s, ProtectedContainerUniqueId_s
    ````

## Next steps

After the data model review is complete, start [creating custom queries](../azure-monitor/visualize/tutorial-logs-dashboards.md) in Azure Monitor logs to build your own dashboard.
