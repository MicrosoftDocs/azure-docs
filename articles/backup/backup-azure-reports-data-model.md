---
title: Data model for Azure Backup
description: This article talks about Power BI data model details for Azure Backup reports.
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 0767c330-690d-474d-85a6-aa8ddc410bb2
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 04/11/2017
ms.author: pajosh
ms.custom: H1Hack27Feb2017

---
# Data model for Azure Backup reports
This article describes Power BI data model used for creating Azure Backup reports. Using this data model, you can filter existing reports based on relevant fields and more importantly, create your own reports by using tables and fields in the model. 

## Creating new reports in Power BI
Power BI provides customization features using which you can [create reports using data model](https://powerbi.microsoft.com/documentation/powerbi-service-create-a-new-report/).

## Using Azure Backup data model
You can use the following fields provided as part of data model to create new reports and customize existing reports.

### Alert
This table provides basic fields and aggregations over various alert related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #AlertsCreatedInPeriod |Whole Number |Number of alerts created in selected time period |
| %ActiveAlertsCreatedInPeriod |Percentage |Percentage of active alerts in selected time period |
| %CriticalAlertsCreatedInPeriod |Percentage |Percentage of critical alerts in selected time period |
| AlertOccurenceDate |Date |Date when alert was created |
| AlertSeverity |Text |Severity of the alert e.g. Critical |
| AlertStatus |Text |Current status of the alert e.g. Active |
| AlertType |Text |Type of the generated alert e.g. Backup |
| AlertUniqueId |Text |Unique Id of the generated alert |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AvgResolutionTimeInMinsForAlertsCreatedInPeriod |Whole Number |Average time it takes to resolve an alert in minutes for selected time period |
| State |Text |Current state of the alert object e.g. Active, Deleted |
| VaultUniqueId |Text |Unique Id of the vault for which alert is generated |

### Backup Item
This table provides basic fields and aggregations over various backup item related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #BackupItems |Whole Number |Number of backup items |
| #UnprotectedBackupItems |Whole Number |Number of backup items stopped for protection or with backups not started|
| AsOnDateTime |Time |Latest refresh time for the selected row |
| BackupItemId |Text |Id of backup item |
| BackupItemName |Text |Name of backup item |
| BackupItemType |Text |Type of backup item e.g. VM, FileFolder |
| BackupItemUniqueId |Text |Unique Id to identify backup item |
| LastBackupDateTime |Time |Time of last backup for selected backup item |
| LastBackupState |Text |State of last backup for selected backup item e.g. Successful, Failed |
| LastSuccessfulBackupDateTime |Time |Time of last successful backup for selected backup item |
| ProtectedServerName |Text |Name of protected server to which backup item belongs |
| ProtectionState |Text |Current protection state of the backup item e.g. Protected, ProtectionStopped |
| State |Text |Current state of the backup item object e.g. Active, Deleted |

### Calendar
This table provides details about calendar related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| Date |Date |Date selected for filtering data |
| DateKey |Text |Unique key for each date item |
| DayDiff |Text |Difference in day for filtering data e.g. 0 indicates current day's data, -1 indicates previous one day's data, 0 and -1 indicate data for current and previous day  |
| Month |Text |Month of the year selected for filtering data, month begins on 1st day and ends on 31st day |
| MonthDate |Text |Date in the month when month ends, selected for filtering data |
| MonthDiff |Text |Difference in month for filtering data e.g. 0 indicates current month's data, -1 indicates previous month's data, 0 and -1 indicate data for current and previous month |
| Week |Text |Week selected for filtering data, week begins on Sunday and ends on Saturday |
| WeekDate |Text |Date in the week when week ends, selected for filtering data |
| WeekDiff |Text |Difference in week for filtering data e.g. 0 indicates current week's data, -1 indicates previous week's data, 0 and -1 indicate data for current and previous week |
| Year |Text |Calendar year selected for filtering data |
| YearDate |Text |Date in the year when year ends, selected for filtering data |

### Job
This table provides basic fields and aggregations over various job related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #JobsCreatedInPeriod |Whole Number |Number of jobs created in the selected time period |
| %FailuresForJobsCreatedInPeriod |Percentage |Percentage overall job failures in the selected time period |
| 80thPercentileDataTransferredInMBForBackupJobsCreatedInPeriod |Whole Number |80th percentile value of data transferred in MB for **backup** jobs created in the selected time period |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AvgBackupDurationInMinsForJobsCreatedInPeriod |Decimal Number |Average time in minutes for **backup** jobs to **complete** created in selected time period |
| AvgRestoreDurationInMinsForJobsCreatedInPeriod |Decimal Number |Average time in minutes for **restore** jobs to **complete** created in selected time period |
| BackupItemUniqueId |Text |Unique Id to identify backup item |
| BackupStorageDestination |Text |Destination where backup is storage e.g. Cloud, Disk  |
| JobFailureCode |Text |Failure Code string because of which job failure happened |
| JobOperation |String |Operation for which job is run e.g. Backup, Restore, Configure Backup |
| JobStartDate |Date |Date when job started running |
| JobStartTime |Time |Time when job started running |
| JobStatus |Text |Status of the finished job e.g. Completed, Active |
| JobUniqueId |Text |Unique Id to identify the job |
| State |Text |Current state of the job object e.g. Active, Deleted |

### Policy
This table provides basic fields and aggregations over various policy related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #Policies |Whole Number |Total number of policies that exist |
| #PoliciesInUse |Whole Number |Number of policies currently being used for configuring backups |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| BackupDaysOfTheWeek |Text |Days of the week when backups have been scheduled |
| BackupFrequency |Text |Frequency with which backups are run e.g. daily, weekly |
| BackupTimes |Text |Date and time when backups are scheduled |
| DailyRetentionDuration |Decimal Number |Total daily retention duration for configured backups |
| DailyRetentionTimes |Text |Date and time when daily retention was configured |
| MonthlyRetentionDaysOfTheMonth |Text |Dates of the month selected for monthly retention |
| MonthlyRetentionDaysOfTheWeek |Text |Days of the week selected for monthly retention |
| MonthlyRetentionDuration |Decimal Number |Total monthly retention duration for configured backups |
| MonthlyRetentionFormat |Text |Type of configuration for monthly retention e.g. daily for day based, weekly for week based |
| MonthlyRetentionTimes |Text |Date and time when monthly retention is configured |
| MonthlyRetentionWeeksOfTheMonth |Text |Weeks of the month when monthly retention is configured e.g. First, Last etc. |
| PolicyName |Text |Name of the policy defined |
| RetentionDuration |Decimal Number |Total duration of the retention policy |
| RetentionType |Text |Type of retention policy e.g. Daily, Weekly, Monthly, Yearly |
| State |Text |Current state of the policy object e.g. Active, Deleted |
| WeeklyRetentionDaysOfTheWeek |Text |Days of the week selected for weekly retention |
| WeeklyRetentionDuration |Decimal Number |Total weekly retention duration(in week) for configured backups |
| WeeklyRetentionTimes |Text |Date and time when weekly retention is configured |
| YearlyRetentionDaysOfTheMonth |Text |Dates of the month selected for yearly retention |
| YearlyRetentionDaysOfTheWeek |Text |Days of the week selected for yearly retention |
| YearlyRetentionDuration |Decimal Number |Total yearly retention duration for configured backups |
| YearlyRetentionFormat |Text |Type of configuration for yearly retention e.g. daily for day based, weekly for week based |
| YearlyRetentionMonthsOfTheYear |Text |Months of the year selected for yearly retention |
| YearlyRetentionTimes |Text |Date and time when yearly retention is configured |
| YearlyRetentionWeeksOfTheMonth |Text |Weeks of the month when yearly retention is configured e.g. First, Last etc. |


### Protected Server
This table provides basic fields and aggregations over various protected server related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #ProtectedServers |Whole Number |Number of protected servers |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AzureBackupAgentOSType |Text |OS Type of Azure Backup Agent |
| AzureBackupAgentOSVersion |Text |OS Version of Azure Backup Agent |
| AzureBackupAgentUpdateDate |Date |Date when Agent Backup Agent was updated |
| AzureBackupAgentVersion |Text |Version number of Agent Backup Version |
| BackupManagementType |Text |Provider type for performing backup e.g. IaaSVM, FileFolder |
| ProtectedServerName |Text |Name of protected server |
| ProtectedServerType |Text |Type of protected server backed up e.g. IaaSVMContainer |
| ProtectedServerName |Text |Name of protected server to which backup item belongs |
| RegisteredContainerId |Text |Id of container registered for backup |
| State |Text |Current state of the protected server object e.g. Active, Deleted |

### Storage
This table provides basic fields and aggregations over various storage related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #ProtectedInstances |Whole Number |Number of protected instances used for calculating frontend storage in billing, calculated based on latest value in selected time |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| CloudStorageInMB |Text |Cloud backup storage used by backups, calculated based on latest value in selected time |
| LastUpdatedDate |Date |Date when selected row was last updated |
| State |Text |Current state of the protected server object e.g. Active, Deleted |

### Time
This table provides details about time related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| Hour |Time |Hour of the day e.g. 1:00:00 PM |
| HourNumber |Text |Hour number in the day e.g. 13.00 |
| Minute |Text |Minute of the hour |
| PeriodOfDay |Text |Time period slot in the day e.g. 12-3 AM |
| Time |Time |Time of the day e.g. 12:00:01 AM |
| TimeKey |Text |Key value to represent time |

### Vault
This table provides basic fields and aggregations over various vault related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #Vaults |Whole Number |Number of vaults |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AzureDataCenter |Text |Data center where vault is located |
| State |Text |Current state of the protected server object e.g. Active, Deleted |
| StorageReplicationType |Text |Type of storage replication for the vault e.g. GeoRedundant |
| SubscriptionId |Text |Subscription Id of the customer selected for generating reports |
| VaultName |Text |Name of the vault |
| VaultTags |Text |Tags associated with the vault |
