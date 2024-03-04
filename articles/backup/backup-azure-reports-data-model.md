---
title: Data model for Azure Backup diagnostics events
description: This data model is in reference to the Resource Specific Mode of sending diagnostic events to Log Analytics (LA). 
ms.topic: conceptual
ms.date: 04/18/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Data Model for Azure Backup Diagnostics Events

> [!NOTE]
> For creating custom reporting views, it is recommended to use [system functions on Azure Monitor logs](backup-reports-system-functions.md) instead of working with the raw tables listed below.

## Differences in schema for Recovery Services vaults and Backup vaults

Recovery Services vaults and Backup vaults send data to a common set of tables that are listed in this article. However, there are slight differences in the schema for Recovery Services vaults and Backup vaults. 

- One of the main reasons for this difference is that for Backup vaults, Azure Backup service does a 'flattening' of schemas to reduce the number of joins needed in queries, hence improving query performance. For example, if you are looking to write a query that lists all Backup vault jobs along with the friendly name of the datasource, and friendly name of the vault, you can get all of this information fro the AddonAzureBackupJobs table (without needing to do a join with CoreAzureBackup to get the datasource and vault names). Flattened schemas are currently supported only for Backup vaults and not yet for Recovery Services vaults.
- Apart from the above, there are also certain scenarios that are currently applicable for Recovery Services vaults only (for example, fields related to DPM workloads). This also leads to some differences in the schema between Backup vaults and Recovery Services vaults.

To understand which fields are specific to a particular vault type, and which fields are common across vault types, refer to the **Applicable Resource Types** column provided in the below sections. For more information on how to write queries on these tables for Recovery Services vaults and Backup vaults, see the [sample queries](./backup-azure-monitoring-use-azuremonitor.md#sample-kusto-queries).

## CoreAzureBackup

This table provides information about core backup entities, such as vaults and backup items.

| **Field**                         | **Data Type** |  **Applicable Resource Types**   | **Description**            |
| --------------------------------- | ------------- | ---------------------------------|--------------------------- |
| ResourceId                        | Text          | Recovery Services vault, Backup vault | Resource identifier for data being collected. For example, Recovery Services vault resource ID. |
| OperationName                     | Text          | Recovery Services vault, Backup vault | This field represents the name of the current operation - BackupItem, BackupItemAssociation, or  ProtectedContainer. |
| Category                          | Text          | Recovery Services vault, Backup vault | This field represents the category of diagnostics data pushed to Azure Monitor logs. For example, CoreAzureBackup. |
| AgentVersion                      | Text          | Recovery Services vault | Version number of  Agent Backup or the Protection Agent (in the case of SC DPM and MABS) |
| AzureBackupAgentVersion           | Text          | Recovery Services vault | Version of the Azure Backup Agent on the Backup Management Server |
| AzureDataCenter                   | Text          | Recovery Services vault, Backup vault | Data center where the vault is located                       |
| BackupItemAppVersion              | Text          | Recovery Services vault | Application version of the backup item                       |
| BackupItemFriendlyName            | Text          | Recovery Services vault, Backup vault | Friendly name of the backup item                             |
| BackupItemName                    | Text          | Recovery Services vault, Backup vault | Name of the backup item                                      |
| BackupItemProtectionState         | Text          | Recovery Services vault, Backup vault | Protection State of the Backup Item                          |
| BackupItemFrontEndSize            | Text          | Recovery Services vault, Backup vault | Front-end size (in MBs) of the backup item                   |
| BackupItemType                    | Text          | Recovery Services vault, Backup vault | Type of backup item. For example: VM, FileFolder             |
| BackupItemUniqueId                | Text          | Recovery Services vault, Backup vault | Unique identifier of the backup item                         |
| BackupManagementServerType        | Text          | Recovery Services vault | Type of the Backup Management Server, as in MABS, SC DPM     |
| BackupManagementServerUniqueId    | Text          | Recovery Services vault | Field to uniquely identify the Backup Management Server      |
| BackupManagementType              | Text          | Recovery Services vault | Provider type for server doing backup job. For example, IaaSVM, FileFolder |
| BackupManagementServerName        | Text          | Recovery Services vault | Name of the Backup Management Server                         |
| BackupManagementServerOSVersion   | Text          | Recovery Services vault | OS version of the Backup Management Server                   |
| BackupManagementServerVersion     | Text          | Recovery Services vault | Version of the Backup Management Server                      |
| LatestRecoveryPointLocation       | Text          | Recovery Services vault | Location of the latest recovery point for the backup item    |
| LatestRecoveryPointTime           | DateTime      | Recovery Services vault | Date time of the latest recovery point for the backup item   |
| OldestRecoveryPointLocation       | Text          | Recovery Services vault | Location of the oldest recovery point for the backup item    |
| OldestRecoveryPointTime           | DateTime      | Recovery Services vault | Date time of the latest recovery point for the backup item   |
| PolicyUniqueId                    | Text          | Recovery Services vault, Backup vault | Unique ID to identify the policy                             |
| ProtectedContainerFriendlyName    | Text          | Recovery Services vault | Friendly name of the protected server                        |
| ProtectedContainerLocation        | Text          | Recovery Services vault | Whether the Protected  Container is located On-premises or in Azure |
| ProtectedContainerName            | Text          | Recovery Services vault | Name of the Protected   Container                            |
| ProtectedContainerOSType          | Text          | Recovery Services vault | OS Type of the  Protected Container                          |
| ProtectedContainerOSVersion       | Text          | Recovery Services vault | OS Version of the Protected Container                        |
| ProtectedContainerProtectionState | Text          | Recovery Services vault | Protection State of the Protected Container                  |
| ProtectedContainerType            | Text          | Recovery Services vault | Whether the Protected Container is a server, or a container  |
| ProtectedContainerUniqueId        | Text          | Recovery Services vault | Unique ID used to identify the protected container for everything except VMs backed up using DPM, MABS |
| ProtectedContainerWorkloadType    | Text          | Recovery Services vault | Type of the Protected  Container backed up. For example, IaaSVMContainer |
| ProtectionGroupName               | Text          | Recovery Services vault | Name of the   Protection Group the Backup Item is protected in, for SC DPM, and MABS, if   applicable |
| ResourceGroupName                 | Text          | Recovery Services vault, Backup vault| Resource group of the resource (for example, Recovery Services vault) for data being collected |
| SchemaVersion                     | Text          | Recovery Services vault, Backup vault | This field denotes the current version of the schema. It is **V2** |
| SecondaryBackupProtectionState    | Text          | Recovery Services vault | Whether secondary protection is enabled for the backup item  |
| State                             | Text          | Recovery Services vault | State of the backup item object. For example, Active, Deleted |
| StorageReplicationType            | Text          | Recovery Services vault, Backup vault | Type of storage replication for the vault. For example, GeoRedundant |
| SubscriptionId                    | Text          | Recovery Services vault, Backup vault | Subscription identifier of the resource (for example, Recovery Services vault) for which data is collected |
| VaultName                         | Text          | Recovery Services vault, Backup vault | Name of the vault                                          |
| VaultTags                         | Text          | Recovery Services vault, Backup vault | Tags associated with the vault resource                    |
| VaultUniqueId                     | Text          | Recovery Services vault, Backup vault | Unique Identifier of the vault                             |
| SourceSystem                      | Text          | Recovery Services vault, Backup vault | Source system of the current data - Azure                  |
| DatasourceSetFriendlyName         | Text          | Backup vault |  Friendly name of the parent resource of the datasource (wherever applicable). For example, for an Azure PostgreSQL database, this field will contain the friendly name of the PostgreSQL server   |
| DatasourceSetResourceId           | Text          | Backup vault |  Azure Resource Manager (ARM) ID of the parent resource of the datasource (wherever applicable). For example, for an Azure PostgreSQL database, this field will contain the ARM ID of the PostgreSQL server             |
| DatasourceSetType                 | Text          | Backup vault |  Type of the DatasourceSet, for example, Microsoft.Compute/disks            |
| DatasourceFriendlyName            | Text          | Backup vault |  Friendly name of the datasource being backed up                 |
| DatasourceResourceId              | Text          | Backup vault |  Azure Resource Manager (ARM) ID of the datasource being backed up                 |
| DatasourceType                    | Text          | Backup vault |  Type of the datasource being backed up, for example, Microsoft.DBforPostgreSQL/servers/databases                |
| BillingGroupUniqueId              | Text          | Backup vault |  Unique ID of the billing group associated with the backup item                |
| BillingGroupFriendlyName          | Text          | Backup vault |  Friendly name of the billing group associated with the backup item                |
| DatasourceResourceGroupName       | Text          | Backup vault |  Resource group  of the datasource being backed up                 |
| DatasourceSubscriptionId          | Text          | Backup vault |  Subscription ID of the datasource being backed up                 |
| BackupItemId                      | Text          | Backup vault |  Azure Resource Manager (ARM) ID of the backup item                 |
| StorageConsumedInMBs              | Text          | Backup vault |  Backup storage consumed by the backup item                 |
| VaultType                         | Text          | Backup vault |  Type of vault. For Backup vaults, the value is Microsoft.DataProtection/backupVaults. For Recovery Services vaults, this field is currently empty              |
| PolicyName                        | Text          | Backup vault |  Name of the policy associated with the backup item               |
| PolicyId                          | Text          | Backup vault |  Azure Resource Manager (ARM) ID of the policy associated with the backup item                 |


## AddonAzureBackupAlerts

This table provides details about alert related fields.

> [!NOTE]
> AddonAzureBackupAlerts refers to the alerts being generated by the classic alerts solution. As classic alerts solution is on deprecation path in favour of Azure Monitor based alers, we recommend you not to select this event AddonAzureBackupAlerts when configuring diagnostics settings. To send the fired Azure Monitor based alerts to a destination of your choice, you can create an alert processing rule and action group that routes these alerts to a logic app, webhook, or runbook that in turn sends these alerts to the required destination.

| **Field**                      | **Data Type** | **Applicable Resource Types** | **Description**                                              |
| ----------------------------- | -------------  | ------------------------------ | ------------------------------ |
| ResourceId                     | Text          | Recovery Services vault | Unique identifier for the resource about which data is collected. For example, a Recovery Services   vault resource ID |
| OperationName                  | Text          | Recovery Services vault | Name of the current operation. For example, Alert            |
| Category                       | Text          | Recovery Services vault | Category of  diagnostics data pushed to Azure Monitor logs - AddonAzureBackupAlerts |
| AlertCode                      | Text          | Recovery Services vault | Code to uniquely  identify an alert type                     |
| AlertConsolidationStatus       | Text          | Recovery Services vault | Identify if the alert is a consolidated alert or not         |
| AlertOccurrenceDateTime        | DateTime      | Recovery Services vault | Date and time when the alert was created                     |
| AlertRaisedOn                  | Text          | Recovery Services vault | Type of entity the alert is raised on                        |
| AlertSeverity                  | Text          | Recovery Services vault | Severity of the alert. For example, Critical                 |
| AlertStatus                    | Text          | Recovery Services vault | Status of the alert. For example, Active                     |
| AlertTimeToResolveInMinutes    | Number        | Recovery Services vault | Time taken to resolve an alert. Blank for active alerts.     |
| AlertType                      | Text          | Recovery Services vault | Type of alert. For example, Backup                           |
| AlertUniqueId                  | Text          | Recovery Services vault | Unique identifier of  the generated alert                    |
| BackupItemUniqueId             | Text          | Recovery Services vault | Unique identifier of  the backup item associated with the alert |
| BackupManagementServerUniqueId | Text          | Recovery Services vault | Field to uniquely identify the Backup Management Server the Backup Item is protected through,  if applicable |
| BackupManagementType           | Text          | Recovery Services vault | Provider type for  server doing backup job, for example, IaaSVM, FileFolder |
| CountOfAlertsConsolidated      | Number        | Recovery Services vault | Number of alerts consolidated if it's a consolidated alert  |
| ProtectedContainerUniqueId     | Text          | Recovery Services vault | Unique identifier of  the protected server associated with the alert |
| RecommendedAction              | Text          | Recovery Services vault | Action recommended to resolving the alert                      |
| SchemaVersion                  | Text          | Recovery Services vault | Current version of the schema, for example **V2**            |
| State                          | Text          | Recovery Services vault | Current state of the alert object, for example, Active, Deleted |
| StorageUniqueId                | Text          | Recovery Services vault | Unique ID used to identify the storage entity                |
| VaultUniqueId                  | Text          | Recovery Services vault | Unique ID used to identify the vault related to the alert    |
| SourceSystem                   | Text          | Recovery Services vault | Source system of the current data - Azure                    |

## AddonAzureBackupProtectedInstance

This table provides basic protected instances-related fields.

| **Field**                      | **Data Type** | **Applicable Resource Types**  | **Description**                                              |
| ------------------------------ | ------------- | ----- | ------------------------------------------------------- |
| ResourceId                     | Text          | Recovery Services vault, Backup vault | Unique identifier for the resource about which data is collected. For example, a Recovery Services vault resource ID |
| OperationName                  | Text          | Recovery Services vault, Backup vault | Name of the operation, for example ProtectedInstance         |
| Category                       | Text          | Recovery Services vault, Backup vault | Category of diagnostics data pushed to Azure Monitor logs - AddonAzureBackupProtectedInstance |
| BackupItemUniqueId             | Text          | Recovery Services vault | Unique ID of the backup item                                 |
| BackupManagementServerUniqueId | Text          | Recovery Services vault | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupManagementType           | Text          | Recovery Services vault | Provider type for server doing backup job, for example,   IaaSVM, FileFolder |
| ProtectedContainerUniqueId     | Text          | Recovery Services vault | Unique ID to identify the protected container the job is   run on |
| ProtectedInstanceCount         | Integer       | Recovery Services vault, Backup vault | Count of Protected Instances for the associated billing entity on that date-time |
| SchemaVersion                  | Text          | Recovery Services vault, Backup vault | Current version of the schema, for example **V2**            |
| State                          | Text          | Recovery Services vault | State of the backup item object, for example, Active, Deleted |
| VaultUniqueId                  | Text          | Recovery Services vault, Backup vault | Unique identifier of the protected vault associated with the protected instance |
| SourceSystem                   | Text          | Recovery Services vault, Backup vault | Source system of the current data - Azure                    |
| BillingGroupFriendlyName       | Text          | Backup vault | Friendly name of the billing group (unit at which billing information is calculated) |
| BillingGroupUniqueId           | Text          | Backup vault | Unique ID of the billing group (unit at which billing information is calculated)                |
| StorageConsumedInMBs           | Double        | Backup vault | Current value of backup storage consumed by the billing group         |
| VaultTags                      | Text          | Backup vault |  Tags of the vault associated with the billing group                  |
| AzureDataCenter                | Text          | Backup vault |  Location of the vault associated with the billing group              |
| VaultType                      | Text          | Backup vault |  Type of the vault associated with the billing group. For Backup vaults, the value is Microsoft.DataProtection/backupVaults. For Recovery Services vaults, this field is currently empty     |
| StorageReplicationType         | Text          | Backup vault |  Type of storage  replication for the vault. For example, LocallyRedundant                 |
| SubscriptionId                 | Text          | Backup vault |  Subscription ID of the billing group                 |
| ResourceGroupName              | Text          | Backup vault |  Resource Group of the billing group             |
| VaultName                      | Text          | Backup vault |  Name of the vault associated with the billing group                |
| DatasourceType                 | Text          | Backup vault |  Type of the datasource being backed up, for example, Microsoft.DBforPostgreSQL/servers/databases                   |
| BillingGroupType               | Text          | Backup vault |  Type of the billing group, used to denote the unit at which billing information is calculated. For example, in the case of Azure PostgreSQL backup, protected instances and storage consumed are calculated at the server (DatasourceSet) level so the value is DatasourceSet in this scenario                  |
| SourceSizeInMBs                | Double        | Backup vault | Frontend size of the billing group                   |
| BillingGroupResourceGroupName  | Text          | Backup vault | Resource group in which the billing group exists                  |


## AddonAzureBackupJobs

This table provides details about job-related fields.

| **Field**                      | **Data Type** |  **Applicable Resource Types**     | **Description**                                              |
| ------------------------------ | ------------- | ------ | ------------------------------------------------------ |
| ResourceId                     | Text          | Recovery Services vault, Backup vault | Resource identifier for data being collected. For example, Recovery Services vault resource ID |
| OperationName                  | Text          | Recovery Services vault, Backup vault | This field represents name of the current operation - Job    |
| Category                       | Text          | Recovery Services vault, Backup vault | This field represents category of diagnostics data pushed to Azure Monitor logs - AddonAzureBackupJobs |
| AdhocOrScheduledJob            | Text          | Recovery Services vault, Backup vault | Field to specify if the job is Ad Hoc or Scheduled           |
| BackupItemUniqueId             | Text          | Recovery Services vault, Backup vault | Unique ID used to identify the backup item related to the storage entity |
| BackupManagementServerUniqueId | Text          | Recovery Services vault | Unique ID used to identify the backup management server related to the storage entity |
| BackupManagementType           | Text          | Recovery Services vault | Provider type for performing backup, for example, IaaS VM, File-Folder to which this job belongs. |
| DataTransferredInMB            | Number        | Recovery Services vault | Data transferred in MB for this job                          |
| JobDurationInSecs              | Number        | Recovery Services vault, Backup vault | Total job duration in seconds                                |
| JobFailureCode                 | Text          | Recovery Services vault, Backup vault | Failure Code string because of which job failure happened    |
| JobOperation                   | Text          | Recovery Services vault, Backup vault | Operation for which job, is run for example, Backup,   Restore, Configure Backup |
| JobOperationSubType            | Text          | Recovery Services vault, Backup vault | Sub Type of the Job Operation. For example, 'Log', in the case of Log Backup Job |
| JobStartDateTime               | DateTime      | Recovery Services vault, Backup vault | Date and time when job started running                       |
| JobStatus                      | Text          | Recovery Services vault, Backup vault | Status of the finished job, for example, Completed, Failed   |
| JobUniqueId                    | Text          | Recovery Services vault, Backup vault | Unique ID to identify the job                                |
| ProtectedContainerUniqueId     | Text          | Recovery Services vault | Unique identifier of the protected server associated with the job |
| RecoveryJobDestination         | Text          | Recovery Services vault | Destination of a recovery job, where the data is recovered   |
| RecoveryJobRPDateTime          | DateTime      | Recovery Services vault | The date, time when the recovery point that's being recovered   was created |
| RecoveryJobLocation            | Text          | Recovery Services vault, Backup vault | The location where the recovery point that's being recovered was stored |
| RecoveryLocationType           | Text          | Recovery Services vault | Type of the Recovery Location                                |
| SchemaVersion                  | Text          | Recovery Services vault, Backup vault | Current version of the schema, for example **V2**            |
| State                          | Text          | Recovery Services vault | Current state of the job object, for example, Active,   Deleted |
| VaultUniqueId                  | Text          | Recovery Services vault, Backup vault | Unique identifier of the protected vault associated with the job |
| SourceSystem                   | Text          | Recovery Services vault, Backup vault | Source system of the current data - Azure                    |
| DatasourceSetFriendlyName      | Text          | Backup vault | Friendly name of the datasource being backed up                    |
| DatasouceSetResourceId         | Text          | Backup vault | Azure Resource Manager (ARM) ID of the parent resource of the datasource (wherever applicable). For example, for an Azure PostgreSQL database, this field will contain the ARM ID of the PostgreSQL server                    |
| DatasourceSetType              | Text          | Backup vault | Type of the datasource being backed up, for example, Microsoft.DBforPostgreSQL/servers/databases                    |
| DatasourceResourceId           | Text          | Backup vault | Azure Resource Manager (ARM) ID of the datasource being backed up                    |
| DatasourceType                 | Text          | Backup vault | Type of the datasource being backed up, for example, Microsoft.DBforPostgreSQL/servers/databases                    |
| DatasourceFriendlyName         | Text          | Backup vault | Friendly name of the datasource being backed up                    |
| SubscriptionId                 | Text          | Backup vault | Subscription id of the vault                   |
| ResourceGroupName              | Text          | Backup vault | Resource Group of the vault                    |
| VaultName                      | Text          | Backup vault | Name of the vault                    |
| VaultTags                      | Text          | Backup vault | Tags of the vault                    |
| StorageReplicationType         | Text          | Backup vault | Type of storage replication for the vault. For example, GeoRedundant                    |
| AzureDataCenter                | Text          | Backup vault | Location of the vault                    |
| BackupItemId                   | Text          | Backup vault | Azure Resource Manager (ARM) ID of the backup item associated with the job                    |
| BackupItemFriendlyName         | Text          | Backup vault | Friendly name of the backup item associated with the job                    |

## AddonAzureBackupPolicy

This table provides details about policy-related fields.

| **Field**                       | **Data Type**  | **Applicable resource types** 		 | **Description**                                              |
| ------------------------------- | -------------- | ------- | ----------------------------------------------------- |
| ResourceId                      | Text           | Recovery Services vault, Backup vault | Unique identifier for the resource about which data is   collected. For example, a Recovery Services vault resource ID |
| OperationName                   | Text           | Recovery Services vault, Backup vault | Name of the operation, for example, Policy or PolicyAssociation |
| Category                        | Text           | Recovery Services vault, Backup vault | Category of diagnostics data pushed to Azure Monitor logs -   AddonAzureBackupPolicy |
| BackupDaysOfTheWeek             | Text           | Recovery Services vault, Backup vault | Days of the week when backups have been scheduled            |
| BackupFrequency                 | Text           | Recovery Services vault | Frequency with which backups are run. For example, daily, weekly |
| BackupManagementType            | Text           | Recovery Services vault | Provider type for server doing backup job. For example, IaaSVM, FileFolder |
| BackupManagementServerUniqueId  | Text           | Recovery Services vault | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupTimes                     | Text           | Recovery Services vault | Date and time when backups are scheduled                     |
| DailyRetentionDuration          | Integer  | Recovery Services vault | Total retention duration in days for configured backups      |
| DailyRetentionTimes             | Text           | Recovery Services vault | Date and time when daily retention was configured            |
| DiffBackupDaysOfTheWeek         | Text           | Recovery Services vault | Days of the week for Differential backups for SQL/HANA in Azure VM Backup |
| DiffBackupFormat                | Text           | Recovery Services vault | Format for Differential backups for SQL/HANA in Azure VM backup   |
| DiffBackupRetentionDuration     | Integer | Recovery Services vault | Retention duration for Differential backups for SQL/HANA in Azure VM Backup |
| DiffBackupTime                  | Time           | Recovery Services vault | Time for Differential backups for SQL/HANA in Azure VM Backup  |
| LogBackupFrequency              | Integer | Recovery Services vault | Frequency for Log backups for SQL                            |
| LogBackupRetentionDuration      | Integer | Recovery Services vault | Retention duration for Log backups for SQL in Azure VM   Backup |
| MonthlyRetentionDaysOfTheMonth  | Text           | Recovery Services vault, Backup vault | Weeks of the month when monthly retention is configured.  For example, First, Last |
| MonthlyRetentionDaysOfTheWeek   | Text           | Recovery Services vault, Backup vault | Days of the week selected for monthly retention              |
| MonthlyRetentionDuration        | Text           | Recovery Services vault, Backup vault | Total retention duration in months for configured backups    |
| MonthlyRetentionFormat          | Text           | Recovery Services vault, Backup vault | Type of configuration for monthly retention. For example, daily for day based, weekly for week based |
| MonthlyRetentionTimes           | Text           | Recovery Services vault, Backup vault | Date and time when monthly retention is configured           |
| MonthlyRetentionWeeksOfTheMonth | Text           | Recovery Services vault, Backup vault | Weeks of the month when monthly retention is configured.   For example, First, Last |
| PolicyName                      | Text           | Recovery Services vault, Backup vault | Name of the policy defined                                   |
| PolicyUniqueId                  | Text           | Recovery Services vault, Backup vault | Unique ID to identify the policy                             |
| PolicyTimeZone                  | Text           | Recovery Services vault, Backup vault | Timezone in which the Policy Time Fields are specified in   the logs |
| RetentionDuration               | Text           | Recovery Services vault | Retention duration for configured backups                    |
| RetentionType                   | Text           | Recovery Services vault | Type of retention                                            |
| SchemaVersion                   | Text           | Recovery Services vault, Backup vault | This field denotes current version of the schema, it   is **V2** |
| State                           | Text           | Recovery Services vault | Current state of the policy object. For example, Active, Deleted |
| SynchronisationFrequencyPerDay  | Whole Number   | Recovery Services vault | Number of times in a day a file backup is synchronized for SC DPM and MABS |
| VaultUniqueId                   | Text           | Recovery Services vault, Backup vault | Unique ID of the vault that this policy belongs to          |
| WeeklyRetentionDaysOfTheWeek    | Text           | Recovery Services vault, Backup vault | Days of the week selected for weekly retention               |
| WeeklyRetentionDuration         | Decimal Number | Recovery Services vault, Backup vault | Total weekly retention duration in weeks for configured backups |
| WeeklyRetentionTimes            | Text           | Recovery Services vault, Backup vault | Date and time when weekly retention is configured            |
| YearlyRetentionDaysOfTheMonth   | Text           | Recovery Services vault, Backup vault | Dates of the month selected for yearly retention             |
| YearlyRetentionDaysOfTheWeek    | Text           | Recovery Services vault, Backup vault | Days of the week selected for yearly retention               |
| YearlyRetentionDuration         | Decimal Number | Recovery Services vault, Backup vault | Total retention duration in years for configured backups     |
| YearlyRetentionFormat           | Text           | Recovery Services vault, Backup vault | Type of configuration for yearly retention, for example, daily for day based, weekly for week based |
| YearlyRetentionMonthsOfTheYear  | Text           | Recovery Services vault, Backup vault | Months of the year selected for yearly retention             |
| YearlyRetentionTimes            | Text           | Recovery Services vault, Backup vault | Date and time when yearly retention is configured            |
| YearlyRetentionWeeksOfTheMonth  | Text           | Recovery Services vault, Backup vault | Weeks of the month selected for yearly retention             |
| SourceSystem                    | Text           | Recovery Services vault, Backup vault | Source system of the current data - Azure                    |
| PolicySubType                   | Text           | Recovery Services vault | Subtype of the policy, for example, Standard or Enhanced                  |
| BackupIntervalInHours           | Integer        | Recovery Services vault, Backup vault | Interval of time between successive backup jobs. Applicable for Azure VM and Azure Disk backup                |
| ScheduleWindowDuration          | Integer        | Recovery Services vault | Duration of the daily window in which backups can be run. Applicable for enhanced policy for Azure VM backup | 
| ScheduleWindowStartTime         | DateTime       | Recovery Services vault | Start time of the daily window in which backups can be run. Applicable for enhanced policy for Azure VM backup        |
| FullBackupDaysOfTheWeek         | String         | Backup vault	| Days of the week when full backup runs. Currently applicable for Azure PostgreSQL backup                    |
| FullBackupFrequency             | String           | Backup vault | Frequency of full backup. Currently applicable for Azure PostgreSQL backup                    |                     
| FullBackupTimes                 | String           | Backup vault | Time of the day at which full backup is taken. Currently applicable for Azure PostgreSQL backup                    |                  
| IncrementalBackupDaysOfTheWeek  | String           | Backup vault | Days of the week when incremental backup runs. Currently applicable for Azure Disk backup                     |
| IncrementalBackupFrequency      | String           | Backup vault | Frequency of incremental backup. Currently applicable for Azure Disk backup                     |
| IncrementalBackupTimes          | String           | Backup vault | Time of the day at which incremental backup is taken. Currently applicable for Azure Disk backup                     |                  
| PolicyId                    	  | String           | Backup vault | Azure Resource Manager (ARM) ID of the backup policy                    |
| SnapshotTierDailyRetentionDuration    | Integer    | Backup vault | Retention duration in days for daily snapshots. Applicable for Azure Blob and Azure Disk backup                     |
| SnapshotTierWeeklyRetentionDuration   | Integer    | Backup vault | Retention duration in weeks for weekly snapshots. Applicable for Azure Blob and Azure Disk backup                    |
| SnapshotTierMonthlyRetentionDuration  | Integer    | Backup vault | Retention duration in months for monthly snapshots. Applicable for Azure Blob and Azure Disk backup                    |
| SnapshotTierYearlyRetentionDuration   | Integer    | Backup vault | Retention duration in years for yearly snapshots. Applicable for Azure Blob and Azure Disk backup                    |
| StandardTierDefaultRetentionDuration  | Integer    | Backup vault | Default retention duration in the standard tier in days. Applicable for Azure PostgreSQL backup                    |
| SnapshotTierDefaultRetentionDuration  | Integer    | Backup vault | Default retention duration in the snapshot tier in days. Applicable for Azure Blob and Azure Disk backup                    |
| DatasourceType 		 				| String     | Backup vault | Datasource type of the backup policy                     |
| VaultTags 			 				| String     | Backup vault | Tags of the vault associated with the backup policy                    |
| AzureDataCenter 		 				| String     | Backup vault | Location of the vault associated with the backup policy                     |
| VaultType				 				| String     | Backup vault | Type of the vault associated with the backup policy. For Backup vaults, the value is Microsoft.DataProtection/backupVaults. For Recovery Services vaults, this field is currently empty                      |
| StorageReplicationType 				| String     | Backup vault | Storage replication type of the vault associated with the backup policy                     |
| SubscriptionId		 				| String     | Backup vault | Subscription ID of the vault associated with the backup policy                     |
| ResourceGroupName 					| String     | Backup vault | Resource group of the vault associated with the backup policy                    |
| VaultName 							| String     | Backup vault | Name of the vault associated with the backup policy                     |

## AddonAzureBackupStorage

This table provides details about storage-related fields.

| **Field**                      | **Data Type** |	**Applicable Resource Types** | **Description**                                              |
| ------------------------------ | ------------- | -------------------------------|----------------------------------------------- |
| ResourceId                     | Text          | Recovery Services vault | Resource identifier for data being collected. For example,   Recovery Services vault resource ID |
| OperationName                  | Text          | Recovery Services vault | This field represents name of the current operation -   Storage or StorageAssociation |
| Category                       | Text          | Recovery Services vault | This field represents category of diagnostics data pushed   to Azure Monitor logs - AddonAzureBackupStorage |
| BackupItemUniqueId             | Text          | Recovery Services vault | Unique ID used to identify the backup item for VMs backed   up using DPM, MABS |
| BackupManagementServerUniqueId | Text          | Recovery Services vault | Field to uniquely identify the Backup Management Server the   Backup Item is protected through, if applicable |
| BackupManagementType           | Text          | Recovery Services vault | Provider type for server doing backup job. For example,   IaaSVM, FileFolder |
| PreferredWorkloadOnVolume      | Text          | Recovery Services vault | Workload for which this volume is the preferred storage      |
| ProtectedContainerUniqueId     | Text          | Recovery Services vault | Unique identifier of the protected container associated with the backup item |
| SchemaVersion                  | Text          | Recovery Services vault | Version of the schema. For example, **V2**                   |
| State                          | Text          | Recovery Services vault | State of the backup item object. For example, Active,   Deleted |
| StorageAllocatedInMBs          | Number        | Recovery Services vault | Size of storage allocated by the corresponding backup item   in the corresponding storage of type Disk |
| StorageConsumedInMBs           | Number        | Recovery Services vault | Size of storage consumed by the corresponding backup item   in the corresponding storage |
| StorageName                    | Text          | Recovery Services vault | Name of storage entity. For example, E:\                      |
| StorageTotalSizeInGBs          | Text          | Recovery Services vault | Total size of storage, in GB, consumed by storage entity     |
| StorageType                    | Text          | Recovery Services vault | Type of Storage, for example Cloud, Volume, Disk             |
| StorageUniqueId                | Text          | Recovery Services vault | Unique ID used to identify the storage entity                |
| VaultUniqueId                  | Text          | Recovery Services vault | Unique ID used to identify the vault related to the storage entity |
| VolumeFriendlyName             | Text          | Recovery Services vault | Friendly name of the storage volume                          |
| SourceSystem                   | Text          | Recovery Services vault | Source system of the current data - Azure                    |

## Valid Operation Names for each table

Each record in the above tables has an associated **Operation Name**. An Operation Name describes the type of record (and also indicates which fields in the table are populated for that record). Each table (category) supports one or more distinct Operation Names. Below is a summary of the supported Operation Names for each of the above tables.

**Choose a vault type**:

# [Recovery Services vaults](#tab/recovery-services-vaults)

| **Table Name / Category**                   | **Supported Operation Names** | **Description**              |
| ------------------------------------------- | ------------------------------|----------------------------- |
| CoreAzureBackup | BackupItem | Represents a record containing all details of a given backup item, such as ID, name, type, etc. |
| CoreAzureBackup | BackupItemAssociation | Represents a mapping between a backup item and its associated protected container (if applicable). |
| CoreAzureBackup | BackupItemFrontEndSizeConsumption | Represents a mapping between a backup item and its front end size. |
| CoreAzureBackup | ProtectedContainer | Represents a record containing all details of a given protected container, such as ID, name, type etc. |
| CoreAzureBackup | ProtectedContainerAssociation | Represents a mapping between a protected container and the vault used for its backup. |
| CoreAzureBackup | Vault | Represents a record containing all details of a given vault eg. ID, name, tags, location etc. |
| CoreAzureBackup | RecoveryPoint | Represents a record containing the oldest and latest recovery point for a given backup item. |
| AddonAzureBackupJobs | Job |  Represents a record containing all details of a given job. For example, job operation, start time, status etc. |
| AddonAzureBackupAlerts | Alert | Represents a record containing all details of a given alert. For example, alert creation time, severity, status etc.  |
| AddonAzureBackupStorage | Storage | Represents a record containing all details of a given storage entity. For example, storage name, type etc. |
| AddonAzureBackupStorage | StorageAssociation | Represents a mapping between a backup item and the total cloud storage consumed by the backup item. |
| AddonAzureBackupProtectedInstance | ProtectedInstance | Represents a record containing the protected instance count for each container or backup item. For Azure VM backup, the protected instance count is available at the backup item level, for other workloads it is available at the protected container level. |
| AddonAzureBackupPolicy | Policy |  Represents a record containing all details of a backup and retention policy. For example, ID, name, retention settings, etc. |
| AddonAzureBackupPolicy | PolicyAssociation | Represents a mapping between a backup item and the backup policy applied to it. |   

# [Backup vaults](#tab/backup-vaults)

| **Table Name / Category**                   | **Supported Operation Names** | **Description**              |
| ------------------------------------------- | ------------------------------|----------------------------- |
| CoreAzureBackup | BackupItem | Represents a record containing all details of a given backup item, such as ID, name, type, etc. |
| CoreAzureBackup | Vault | Represents a record containing all details of a given vault eg. ID, name, tags, location etc. |
| AddonAzureBackupJobs | Job |  Represents a record containing all details of a given job. For example, job operation, start time, status etc. |
| AddonAzureBackupProtectedInstance | ProtectedInstance | Represents a record containing the protected instance count for each container or backup item. For Azure VM backup, the protected instance count is available at the backup item level, for other workloads it is available at the protected container level. |
| AddonAzureBackupPolicy | Policy |  Represents a record containing all details of a backup and retention policy. For example, ID, name, retention settings, etc. |

Often, you will need to perform joins between different tables as well as different sets of records that are part of the same table (differentiated by Operation Name) to get all the fields required for your analysis. Refer to the [sample queries](./backup-azure-monitoring-use-azuremonitor.md#sample-kusto-queries) to get started. 

## Next steps

- [Learn how to send diagnostics data to Log Analytics](./backup-azure-diagnostic-events.md)
- [Learn how to write queries on Resource specific tables](./backup-azure-monitoring-use-azuremonitor.md#sample-kusto-queries)