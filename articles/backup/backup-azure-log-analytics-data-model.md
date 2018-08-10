---
title: Log Analytics data model for Azure Backup
description: This article talks about Log Analytics data model details for Azure Backup data.
services: backup
author: adiganmsft
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 07/24/2017
ms.author: adigan
ms.custom: H1Hack27Feb2017
---
# Log Analytics data model for Azure Backup data
Use the Log Analytics data model to create reports. With the data model, you can create custom queries and dashboards, or customize Azure Backup data, however you like.

## Using Azure Backup data model
You can use the following fields provided as part of the data model to create visuals, custom queries, and dashboard as per your requirements.

### Alert
This table provides details about alert related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| AlertUniqueId_s |Text |Unique identifier of the generated alert |
| AlertType_s |Text |Type of alert, for example, Backup |
| AlertStatus_s |Text |Status of the alert, for example, Active |
| AlertOccurenceDateTime_s |Date/Time |Date and time when alert was created |
| AlertSeverity_s |Text |Severity of the alert, for example, Critical |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |
| BackupItemUniqueId_s |Text |Unique identifier of the backup item associated with the alert |
| SchemaVersion_s |Text |Current version of the schema, for example **V1** |
| State_s |Text |Current state of the alert object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup, for example, IaaSVM, FileFolder to which this alert belongs to |
| OperationName |Text |Name of the current operation, for example, Alert |
| Category |Text |Category of diagnostics data pushed to Log Analytics. Always AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique identifier of the protected server associated with the alert |
| VaultUniqueId_s |Text |Unique identifier of the protected vault associated with the alert |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Unique identifier for the resource about which data is collected. For example, a Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### BackupItem
This table provides details about backup item-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique identifier of the backup item |
| BackupItemId_s |Text |Identifier of backup item |
| BackupItemName_s |Text |Name of backup item |
| BackupItemFriendlyName_s |Text |Friendly name of backup item |
| BackupItemType_s |Text |Type of backup item, for example, VM, FileFolder |
| ProtectedServerName_s |Text |Name of protected server to which backup item belongs to |
| ProtectionState_s |Text |Current protection state of the backup item, for example, Protected, ProtectionStopped |
| SchemaVersion_s |Text |Version of the schema, for example, **V1** |
| State_s |Text |State of the backup item object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for performing backup, for example, IaaSVM, FileFolder to which this backup item belongs to |
| OperationName |Text |Name of the operation, for example, BackupItem |
| Category |Text |Category of diagnostics data pushed to Log Analytics. Always AzureBackupReport |
| Resource |Text |Resource for which data is collected, for example, Recovery Services vault name |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource id for data being collected, for example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (for ex. Recovery Services vault) for data being collected |
| ResourceGroup |Text |Resource group of the resource (for ex. Recovery Services vault) for data being collected |
| ResourceProvider |Text |Resource provider for data being collected, for example, Microsoft.RecoveryServices |
| ResourceType |Text |Type of the resource for data being collected, for example, Vaults |

### BackupItemAssociation
This table provides details about backup item associations with various entities.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |  
| BackupItemUniqueId_s |Text |Unique Id of the backup item |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the backup item association object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - BackupItemAssociation |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text |Unique identifier for the policy associated with the backup item |
| ProtectedServerUniqueId_s |Text |Unique identifier of the protected server associated with the backup item |
| VaultUniqueId_s |Text |Unique identifier of the vault containing the backup item |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceGroup |Text |Resource group of the resource (for ex. Recovery Services vault) for which data is being collected |
| ResourceProvider |Text |Resource provider for data being collected, for example, Microsoft.RecoveryServices |
| ResourceType |Text |Type of the resource for data is being collected, for example, Vaults |

### Job
This table provides details about job-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |Name of the event. Always AzureBackupCentralReport |
| BackupItemUniqueId_s |Text |Unique identifier of the backup item |
| SchemaVersion_s |Text |Version of the schema, for example, **V1** |
| State_s |Text |Current state of the job object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - Job |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique identifier of the protected server associated the job |
| VaultUniqueId_s |Text |Unique identifier of the protected vault |
| JobOperation_s |Text |Operation for which job is run for example, Backup, Restore, Configure Backup |
| JobStatus_s |Text |Status of the finished job, for example, Completed, Failed |
| JobFailureCode_s |Text |Failure Code string because of which job failure happened |
| JobStartDateTime_s |Date/Time |Date and time when job started running |
| BackupStorageDestination_s |Text |Destination of backup storage, for example, Cloud, Disk  |
| JobDurationInSecs_s | Number |Total job duration in seconds |
| DataTransferredInMB_s | Number |Data transferred in MB for this job|
| JobUniqueId_g |Text |Unique Id to identify the job |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id|
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### Policy
This table provides details about policy-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the policy object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - Policy |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text |Unique Id to identify the policy |
| PolicyName_s |Text |Name of the policy defined |
| BackupFrequency_s |Text |Frequency with which backups are run, for example, daily, weekly |
| BackupTimes_s |Text |Date and time when backups are scheduled |
| BackupDaysOfTheWeek_s |Text |Days of the week when backups have been scheduled |
| RetentionDuration_s |Whole Number |Retention duration for configured backups |
| DailyRetentionDuration_s |Whole Number |Total retention duration in days for configured backups |
| DailyRetentionTimes_s |Text |Date and time when daily retention was configured |
| WeeklyRetentionDuration_s |Decimal Number |Total weekly retention duration in weeks for configured backups |
| WeeklyRetentionTimes_s |Text |Date and time when weekly retention is configured |
| WeeklyRetentionDaysOfTheWeek_s |Text |Days of the week selected for weekly retention |
| MonthlyRetentionDuration_s |Decimal Number |Total retention duration in months for configured backups |
| MonthlyRetentionTimes_s |Text |Date and time when monthly retention is configured |
| MonthlyRetentionFormat_s |Text |Type of configuration for monthly retention, for example, daily for day based, weekly for week based |
| MonthlyRetentionDaysOfTheWeek_s |Text |Days of the week selected for monthly retention |
| MonthlyRetentionWeeksOfTheMonth_s |Text |Weeks of the month when monthly retention is configured, for example, First, Last etc. |
| YearlyRetentionDuration_s |Decimal Number |Total retention duration in years for configured backups |
| YearlyRetentionTimes_s |Text |Date and time when yearly retention is configured |
| YearlyRetentionMonthsOfTheYear_s |Text |Months of the year selected for yearly retention |
| YearlyRetentionFormat_s |Text |Type of configuration for yearly retention, for example, daily for day based, weekly for week based |
| YearlyRetentionDaysOfTheMonth_s |Text |Dates of the month selected for yearly retention |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### PolicyAssociation
This table provides details about policy associations with various entities.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the policy object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - PolicyAssociation |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| PolicyUniqueId_g |Text |Unique Id to identify the policy |
| VaultUniqueId_s |Text |Unique Id of the vault to which this policy belongs to |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### ProtectedServer
This table provides details about protected server-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| ProtectedServerName_s |Text |Name of protected server |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the protected server object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - ProtectedServer |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique Id of the protected server |
| RegisteredContainerId_s |Text |Id of container registered for backup |
| ProtectedServerType_s |Text |Type of protected server, for example, Windows |
| ProtectedServerFriendlyName_s |Text |Friendly name of protected server |
| AzureBackupAgentVersion_s |Text |Version number of Agent Backup Version |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### ProtectedServerAssociation
This table provides details about protected server associations with other entities.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the protected server association object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - ProtectedServerAssociation |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique Id of the protected server |
| VaultUniqueId_s |Text |Unique Id of the vault to which this protected server belongs to |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### Storage
This table provides details about storage-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| CloudStorageInBytes_s |Decimal Number |Cloud backup storage used by backups, calculated based on latest value |
| ProtectedInstances_s |Decimal Number |Number of protected instances used for calculating frontend storage in billing, calculated based on latest value |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the storage object, for example, Active, Deleted |
| BackupManagementType_s |Text |Provider type for server doing backup job, for example, IaaSVM, FileFolder |
| OperationName |Text |This field represents name of the current operation - Storage |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| ProtectedServerUniqueId_s |Text |Unique Id of the protected server for which storage is calculated |
| VaultUniqueId_s |Text |Unique Id of the vault for storage is calculated |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

### Vault
This table provides details about vault-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| EventName_s |Text |This field represents name of this event, it is always AzureBackupCentralReport |
| SchemaVersion_s |Text |This field denotes current version of the schema, it is **V1** |
| State_s |Text |Current state of the vault object, for example, Active, Deleted |
| OperationName |Text |This field represents name of the current operation - Vault |
| Category |Text |This field represents category of diagnostics data pushed to Log Analytics, it is AzureBackupReport |
| Resource |Text |This is the resource for which data is being collected, it shows Recovery Services vault name |
| VaultUniqueId_s |Text |Unique Id of the vault |
| VaultName_s |Text |Name of the vault |
| AzureDataCenter_s |Text |Data center where vault is located |
| StorageReplicationType_s |Text |Type of storage replication for the vault, for example, GeoRedundant |
| SourceSystem |Text |Source system of the current data - Azure |
| ResourceId |Text |Resource identifier for data being collected. For example, Recovery Services vault resource id |
| SubscriptionId |Text |Subscription identifier of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceGroup |Text |Resource group of the resource (ex. Recovery Services vault) for which data is collected |
| ResourceProvider |Text |Resource provider for which data is collected. For example, Microsoft.RecoveryServices |
| ResourceType |Text |Resource type for which data is collected. For example, Vaults |

## Next steps
Once you review the data model for creating Azure Backup reports, you can start [creating dashboard](../log-analytics/log-analytics-dashboards.md) in Log Analytics.
