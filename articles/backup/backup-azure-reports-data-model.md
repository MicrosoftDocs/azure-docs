---
title: Data model for Azure Backup diagnostics events
description: This data model is in reference to the Resource Specific Mode of sending diagnostic events to Log Analytics (LA). 
ms.topic: conceptual
ms.date: 10/30/2019
---
# Data Model for Azure Backup Diagnostics Events

## CoreAzureBackup

This table provides information about core backup entities, such as vaults and backup items.

| **Field**                         | **Data Type** | **Description**                                              |
| --------------------------------- | ------------- | ------------------------------------------------------------ |
| ResourceId                        | Text          | Resource identifier for data being collected. For example, Recovery Services vault resource ID. |
| OperationName                     | Text          | This field represents the name of the current operation - BackupItem, BackupItemAssociation, or  ProtectedContainer. |
| Category                          | Text          | This field represents the category of diagnostics data pushed to Azure Monitor logs. For example, CoreAzureBackup. |
| AgentVersion                      | Text          | Version number of  Agent Backup or the Protection Agent (in case of SC DPM and MABS) |
| AzureBackupAgentVersion           | Text          | Version of the Azure Backup Agent on the Backup Management Server |
| AzureDataCenter                   | Text          | Data center where the vault is located                       |
| BackupItemAppVersion              | Text          | Application version of the backup item                       |
| BackupItemFriendlyName            | Text          | Friendly name of the backup item                             |
| BackupItemName                    | Text          | Name of the backup item                                      |
| BackupItemProtectionState         | Text          | Protection State of the Backup Item                          |
| BackupItemFrontEndSize            | Text          | Front-end size of the backup item                            |
| BackupItemType                    | Text          | Type of backup item. For example: VM, FileFolder             |
| BackupItemUniqueId                | Text          | Unique identifier of the backup item                         |
| BackupManagementServerType        | Text          | Type of the Backup Management Server, as in MABS, SC DPM     |
| BackupManagementServerUniqueId    | Text          | Field to uniquely identify the Backup Management Server      |
| BackupManagementType              | Text          | Provider type for server doing backup job. For example, IaaSVM, FileFolder |
| BackupManagementServerName        | Text          | Name of the Backup Management Server                         |
| BackupManagementServerOSVersion   | Text          | OS version of the Backup Management Server                   |
| BackupManagementServerVersion     | Text          | Version of the Backup Management Server                      |
| LatestRecoveryPointLocation       | Text          | Location of the latest recovery point for the backup item    |
| LatestRecoveryPointTime           | DateTime      | Date time of the latest recovery point for the backup item   |
| OldestRecoveryPointLocation       | Text          | Location of the oldest recovery point for the backup item    |
| OldestRecoveryPointTime           | DateTime      | Date time of the latest recovery point for the backup item   |
| PolicyUniqueId                    | Text          | Unique ID to identify the policy                             |
| ProtectedContainerFriendlyName    | Text          | Friendly name of the protected server                        |
| ProtectedContainerLocation        | Text          | Whether the Protected  Container is located On-premises or in Azure |
| ProtectedContainerName            | Text          | Name of the Protected   Container                            |
| ProtectedContainerOSType          | Text          | OS Type of the  Protected Container                          |
| ProtectedContainerOSVersion       | Text          | OS Version of the Protected Container                        |
| ProtectedContainerProtectionState | Text          | Protection State of the Protected Container                  |
| ProtectedContainerType            | Text          | Whether the Protected Container is a server, or a container  |
| ProtectedContainerUniqueId        | Text          | Unique ID used to identify the protected container for everything except VMs backed up using DPM, MABS |
| ProtectedContainerWorkloadType    | Text          | Type of the Protected  Container backed up. For example, IaaSVMContainer |
| ProtectionGroupName               | Text          | Name of the   Protection Group the Backup Item is protected in, for SC DPM, and MABS, if   applicable |
| ResourceGroupName                 | Text          | Resource group of the resource (for example, Recovery Services vault) for data being collected |
| SchemaVersion                     | Text          | This field denotes the current version of the schema, it is **V2** |
| SecondaryBackupProtectionState    | Text          | Whether secondary protection is enabled for the backup item  |
| State                             | Text          | State of the backup item object. For example, Active, Deleted |
| StorageReplicationType            | Text          | Type of storage  replication for the vault. For example, GeoRedundant |
| SubscriptionId                    | Text          | Subscription identifier of the resource (for example, Recovery Services vault) for which data is collected |
| VaultName                         | Text          | Name of the vault                                            |
| VaultTags                         | Text          | Tags associated with   the vault resource                    |
| VaultUniqueId                     | Text          | Unique Identifier of   the vault                             |
| SourceSystem                      | Text          | Source system of the   current data - Azure                  |

## AddonAzureBackupAlerts

This table provides details about alert related fields.

| **Field**                      | **Data Type** | **Description**                                              |
| :----------------------------- | ------------- | ------------------------------------------------------------ |
| ResourceId                     | Text          | Unique identifier for the resource about which data is collected. For example, a Recovery Services   vault resource ID |
| OperationName                  | Text          | Name of the current operation. For example, Alert            |
| Category                       | Text          | Category of  diagnostics data pushed to Azure Monitor logs - AddonAzureBackupAlerts |
| AlertCode                      | Text          | Code to uniquely  identify an alert type                     |
| AlertConsolidationStatus       | Text          | Identify if the alert is a consolidated alert or not         |
| AlertOccurrenceDateTime        | DateTime      | Date and time when the alert was created                     |
| AlertRaisedOn                  | Text          | Type of entity the alert is raised on                        |
| AlertSeverity                  | Text          | Severity of the alert. For example, Critical                 |
| AlertStatus                    | Text          | Status of the alert. For example, Active                     |
| AlertTimeToResolveInMinutes    | Number        | Time taken to resolve an alert. Blank for active alerts.     |
| AlertType                      | Text          | Type of alert. For example, Backup                           |
| AlertUniqueId                  | Text          | Unique identifier of  the generated alert                    |
| BackupItemUniqueId             | Text          | Unique identifier of  the backup item associated with the alert |
| BackupManagementServerUniqueId | Text          | Field to uniquely identify the Backup Management Server the Backup Item is protected through,  if applicable |
| BackupManagementType           | Text          | Provider type for  server doing backup job, for example, IaaSVM, FileFolder |
| CountOfAlertsConsolidated      | Number        | Number of alerts consolidated if it is a consolidated alert  |
| ProtectedContainerUniqueId     | Text          | Unique identifier of  the protected server associated with the alert |
| RecommendedAction              | Text          | Action recommended to resolve the alert                      |
| SchemaVersion                  | Text          | Current version of the schema, for example **V2**            |
| State                          | Text          | Current state of the alert object, for example, Active, Deleted |
| StorageUniqueId                | Text          | Unique ID used to identify the storage entity                |
| VaultUniqueId                  | Text          | Unique ID used to identify the vault related to the alert    |
| SourceSystem                   | Text          | Source system of the current data - Azure                    |

## AddonAzureBackupProtectedInstance

This table provides basic protected instances-related fields.

| **Field**                      | **Data Type** | **Description**                                              |
| ------------------------------ | ------------- | ------------------------------------------------------------ |
| ResourceId                     | Text          | Unique identifier for the resource about which data is   collected. For example, a Recovery Services vault resource ID |
| OperationName                  | Text          | Name of the operation, for example ProtectedInstance         |
| Category                       | Text          | Category of diagnostics data pushed to Azure Monitor logs -   AddonAzureBackupProtectedInstance |
| BackupItemUniqueId             | Text          | Unique ID of the backup item                                 |
| BackupManagementServerUniqueId | Text          | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupManagementType           | Text          | Provider type for server doing backup job, for example,   IaaSVM, FileFolder |
| ProtectedContainerUniqueId     | Text          | Unique ID to identify the protected container the job is   run on |
| ProtectedInstanceCount         | Text          | Count of Protected Instances for the associated backup item   or protected container on that date-time |
| SchemaVersion                  | Text          | Current version of the schema, for example **V2**            |
| State                          | Text          | State of the backup item object, for example, Active,   Deleted |
| VaultUniqueId                  | Text          | Unique identifier of the protected vault associated with   the protected instance |
| SourceSystem                   | Text          | Source system of the current data - Azure                    |

## AddonAzureBackupJobs

This table provides details about job-related fields.

| **Field**                      | **Data Type** | **Description**                                              |
| ------------------------------ | ------------- | ------------------------------------------------------------ |
| ResourceId                     | Text          | Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| OperationName                  | Text          | This field represents name of the current operation - Job    |
| Category                       | Text          | This field represents category of diagnostics data pushed to Azure Monitor logs - AddonAzureBackupJobs |
| AdhocOrScheduledJob            | Text          | Field to specify if the job is Ad Hoc or Scheduled           |
| BackupItemUniqueId             | Text          | Unique ID used to identify the backup item related to the storage entity |
| BackupManagementServerUniqueId | Text          | Unique ID used to identify the backup management server related to the storage entity |
| BackupManagementType           | Text          | Provider type for performing backup, for example, IaaSVM, FileFolder to which this job belongs to |
| DataTransferredInMB            | Number        | Data transferred in MB for this job                          |
| JobDurationInSecs              | Number        | Total job duration in seconds                                |
| JobFailureCode                 | Text          | Failure Code string because of which job failure happened    |
| JobOperation                   | Text          | Operation for which job is run for example, Backup,   Restore, Configure Backup |
| JobOperationSubType            | Text          | Sub Type of the Job Operation. For example,  'Log', in the case of   Log Backup Job |
| JobStartDateTime               | DateTime      | Date and time when job started running                       |
| JobStatus                      | Text          | Status of the finished job, for example, Completed, Failed   |
| JobUniqueId                    | Text          | Unique ID to identify the job                                |
| ProtectedContainerUniqueId     | Text          | Unique identifier of the protected server associated with the job |
| RecoveryJobDestination         | Text          | Destination of a recovery job, where the data is recovered   |
| RecoveryJobRPDateTime          | DateTime      | The date, time when the recovery point that is being recovered   was created |
| RecoveryJobLocation            | Text          | The location where the recovery point that is being   recovered was stored |
| RecoveryLocationType           | Text          | Type of the Recovery Location                                |
| SchemaVersion                  | Text          | Current version of the schema, for example **V2**            |
| State                          | Text          | Current state of the job object, for example, Active,   Deleted |
| VaultUniqueId                  | Text          | Unique identifier of the protected vault associated with the job |
| SourceSystem                   | Text          | Source system of the current data - Azure                    |

## AddonAzureBackupPolicy

This table provides details about policy-related fields.

| **Field**                       | **Data Type**  | **Description**                                              |
| ------------------------------- | -------------- | ------------------------------------------------------------ |
| ResourceId                      | Text           | Unique identifier for the resource about which data is   collected. For example, a Recovery Services vault resource ID |
| OperationName                   | Text           | Name of the operation, for example, Policy or   PolicyAssociation |
| Category                        | Text           | Category of diagnostics data pushed to Azure Monitor logs -   AddonAzureBackupPolicy |
| BackupDaysOfTheWeek             | Text           | Days of the week when backups have been scheduled            |
| BackupFrequency                 | Text           | Frequency with which backups are run. For example, daily,   weekly |
| BackupManagementType            | Text           | Provider type for server doing backup job. For example,   IaaSVM, FileFolder |
| BackupManagementServerUniqueId  | Text           | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupTimes                     | Text           | Date and time when backups are scheduled                     |
| DailyRetentionDuration          | Whole Number   | Total retention duration in days for configured backups      |
| DailyRetentionTimes             | Text           | Date and time when daily retention was configured            |
| DiffBackupDaysOfTheWeek         | Text           | Days of the week for Differential backups for SQL in Azure   VM Backup |
| DiffBackupFormat                | Text           | Format for Differential backups for SQL in Azure VM backup   |
| DiffBackupRetentionDuration     | Decimal Number | Retention duration for Differential backups for SQL in   Azure VM Backup |
| DiffBackupTime                  | Time           | Time for Differential backups for SQL in Azure VM Backup     |
| LogBackupFrequency              | Decimal Number | Frequency for Log backups for SQL                            |
| LogBackupRetentionDuration      | Decimal Number | Retention duration for Log backups for SQL in Azure VM   Backup |
| MonthlyRetentionDaysOfTheMonth  | Text           | Weeks of the month when monthly retention is configured.  For example, First, Last, etc. |
| MonthlyRetentionDaysOfTheWeek   | Text           | Days of the week selected for monthly retention              |
| MonthlyRetentionDuration        | Text           | Total retention duration in months for configured backups    |
| MonthlyRetentionFormat          | Text           | Type of configuration for monthly retention. For example,   daily for day based, weekly for week based |
| MonthlyRetentionTimes           | Text           | Date and time when monthly retention is configured           |
| MonthlyRetentionWeeksOfTheMonth | Text           | Weeks of the month when monthly retention is configured.   For example, First, Last, etc. |
| PolicyName                      | Text           | Name of the policy defined                                   |
| PolicyUniqueId                  | Text           | Unique ID to identify the policy                             |
| PolicyTimeZone                  | Text           | Timezone in which the Policy Time Fields are specified in   the logs |
| RetentionDuration               | Text           | Retention duration for configured backups                    |
| RetentionType                   | Text           | Type of retention                                            |
| SchemaVersion                   | Text           | This field denotes current version of the schema, it   is **V2** |
| State                           | Text           | Current state of the policy object. For example, Active,   Deleted |
| SynchronisationFrequencyPerDay  | Whole Number   | Number of times in a day a file backup is synchronized for   SC DPM and MABS |
| VaultUniqueId                   | Text           | Unique ID of the vault that this policy belongs to          |
| WeeklyRetentionDaysOfTheWeek    | Text           | Days of the week selected for weekly retention               |
| WeeklyRetentionDuration         | Decimal Number | Total weekly retention duration in weeks for configured   backups |
| WeeklyRetentionTimes            | Text           | Date and time when weekly retention is configured            |
| YearlyRetentionDaysOfTheMonth   | Text           | Dates of the month selected for yearly retention             |
| YearlyRetentionDaysOfTheWeek    | Text           | Days of the week selected for yearly retention               |
| YearlyRetentionDuration         | Decimal Number | Total retention duration in years for configured backups     |
| YearlyRetentionFormat           | Text           | Type of configuration for yearly retention, for example,   daily for day based, weekly for week based |
| YearlyRetentionMonthsOfTheYear  | Text           | Months of the year selected for yearly retention             |
| YearlyRetentionTimes            | Text           | Date and time when yearly retention is configured            |
| YearlyRetentionWeeksOfTheMonth  | Text           | Weeks of the month selected for yearly retention             |
| SourceSystem                    | Text           | Source system of the current data - Azure                    |

## AddonAzureBackupStorage

This table provides details about storage-related fields.

| **Field**                      | **Data Type** | **Description**                                              |
| ------------------------------ | ------------- | ------------------------------------------------------------ |
| ResourceId                     | Text          | Resource identifier for data being collected. For example,   Recovery Services vault resource ID |
| OperationName                  | Text          | This field represents name of the current operation -   Storage or StorageAssociation |
| Category                       | Text          | This field represents category of diagnostics data pushed   to Azure Monitor logs - AddonAzureBackupStorage |
| BackupItemUniqueId             | Text          | Unique ID used to identify the backup item for VMs backed   up using DPM, MABS |
| BackupManagementServerUniqueId | Text          | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupManagementType           | Text          | Provider type for server doing backup job. For example,   IaaSVM, FileFolder |
| PreferredWorkloadOnVolume      | Text          | Workload for which this volume is the preferred storage      |
| ProtectedContainerUniqueId     | Text          | Unique identifier of the protected container associated with the backup item |
| SchemaVersion                  | Text          | Version of the schema. For example, **V2**                   |
| State                          | Text          | State of the backup item object. For example, Active,   Deleted |
| StorageAllocatedInMBs          | Number        | Size of storage allocated by the corresponding backup item   in the corresponding storage of type Disk |
| StorageConsumedInMBs           | Number        | Size of storage consumed by the corresponding backup item   in the corresponding storage |
| StorageName                    | Text          | Name of storage entity. For example, E:\                      |
| StorageTotalSizeInGBs          | Text          | Total size of storage, in GB, consumed by storage entity     |
| StorageType                    | Text          | Type of Storage, for example Cloud, Volume, Disk             |
| StorageUniqueId                | Text          | Unique ID used to identify the storage entity                |
| VaultUniqueId                  | Text          | Unique ID used to identify the vault related to the storage   entity |
| VolumeFriendlyName             | Text          | Friendly name of the storage volume                          |
| SourceSystem                   | Text          | Source system of the current data - Azure                    |

## Next steps

- [Learn how to send diagnostics data to Log Analytics](https://docs.microsoft.com/azure/backup/backup-azure-diagnostic-events)
- [Learn how to write queries on Resource specific tables](https://docs.microsoft.com/azure/backup/backup-azure-monitoring-use-azuremonitor#sample-kusto-queries)
