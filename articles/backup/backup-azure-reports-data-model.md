---
title: Data model for Azure Backup
description: This article talks about Power BI data model details for Azure Backup reports.
services: backup
author: adigan
manager: shivamg
ms.service: backup
ms.topic: conceptual
ms.date: 06/26/2017
ms.author: adigan
---
# Data model for Azure Backup reports
This article describes the Power BI data model used for creating Azure Backup reports. Using this data model, you can filter existing reports based on relevant fields and more importantly, create your own reports by using tables and fields in the model. 

## Creating new reports in Power BI
Power BI provides customization features using which you can [create reports using the data model](https://powerbi.microsoft.com/documentation/powerbi-service-create-a-new-report/).

## Using Azure Backup data model
You can use the following fields provided as part of the data model to create reports and customize existing reports.

### Alert
This table provides basic fields and aggregations over various alert related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #AlertsCreatedInPeriod |Whole Number |Number of alerts created in selected time period |
| %ActiveAlertsCreatedInPeriod |Percentage |Percentage of active alerts in selected time period |
| %CriticalAlertsCreatedInPeriod |Percentage |Percentage of critical alerts in selected time period |
| AlertOccurrenceDate |Date |Date when alert was created |
| AlertSeverity |Text |Severity of the alert for example, Critical |
| AlertStatus |Text |Status of the alert for example, Active |
| AlertType |Text |Type of the generated alert for example, Backup |
| AlertUniqueId |Text |Unique Id of the generated alert |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| AvgResolutionTimeInMinsForAlertsCreatedInPeriod |Decimal Number |Average time (in minutes) to resolve alert for selected time period |
| EntityState |Text |Current state of the alert object for example, Active, Deleted |

### Backup Item
This table provides basic fields and aggregations over various backup item-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #BackupItems |Whole Number |Number of backup items |
| #UnprotectedBackupItems |Whole Number |Number of backup items stopped for protection or configured for backups but backups not started|
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| BackupItemFriendlyName |Text |Friendly name of backup item |
| BackupItemId |Text |Id of backup item |
| BackupItemName |Text |Name of backup item |
| BackupItemType |Text |Type of backup item for example, VM, FileFolder |
| EntityState |Text |Current state of the backup item object for example, Active, Deleted |
| LastBackupDateTime |Date/Time |Time of last backup for selected backup item |
| LastBackupState |Text |State of last backup for selected backup item for example, Successful, Failed |
| LastSuccessfulBackupDateTime |Date/Time |Time of last successful backup for selected backup item |
| ProtectionState |Text |Current protection state of the backup item for example, Protected, ProtectionStopped |

### Calendar
This table provides details about calendar-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| Date |Date |Date selected for filtering data |
| DateKey |Text |Unique key for each date item |
| DayDiff |Decimal Number |Difference in day for filtering data for example, 0 indicates current day's data, -1 indicates previous one day's data, 0 and -1 indicate data for current and previous day  |
| Month |Text |Month of the year selected for filtering data, month begins on first day and ends on 31st day |
| MonthDate | Date |Date in the month when month ends, selected for filtering data |
| MonthDiff |Decimal Number |Difference in month for filtering data for example, 0 indicates current month's data, -1 indicates previous month's data, 0 and -1 indicate data for current and previous month |
| Week |Text |Week selected for filtering data, week begins on Sunday and ends on Saturday |
| WeekDate |Date |Date in the week when week ends, selected for filtering data |
| WeekDiff |Decimal Number |Difference in week for filtering data for example, 0 indicates current week's data, -1 indicates previous week's data, 0 and -1 indicate data for current and previous week |
| Year |Text |Calendar year selected for filtering data |
| YearDate |Date |Date in the year when year ends, selected for filtering data |

### Job
This table provides basic fields and aggregations over various job-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #JobsCreatedInPeriod |Whole Number |Number of jobs created in the selected time period |
| %FailuresForJobsCreatedInPeriod |Percentage |Percentage overall job failures in the selected time period |
| 80thPercentileDataTransferredInMBForBackupJobsCreatedInPeriod |Decimal Number |80th percentile value of data transferred in MB for **backup** jobs created in the selected time period |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| AvgBackupDurationInMinsForJobsCreatedInPeriod |Decimal Number |Average time in minutes for **completed backup** jobs created in selected time period |
| AvgRestoreDurationInMinsForJobsCreatedInPeriod |Decimal Number |Average time in minutes for **completed restore** jobs created in selected time period |
| BackupStorageDestination |Text |Destination of backup storage for example, Cloud, Disk  |
| EntityState |Text |Current state of the job object for example, Active, Deleted |
| JobFailureCode |Text |Failure Code string because of which job failure happened |
| JobOperation |Text |Operation for which job is run for example, Backup, Restore, Configure Backup |
| JobStartDate |Date |Date when job started running |
| JobStartTime |Time |Time when job started running |
| JobStatus |Text |Status of the finished job for example, Completed, Failed |
| JobUniqueId |Text |Unique Id to identify the job |

### Policy
This table provides basic fields and aggregations over various policy-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #Policies |Whole Number |Number of backup policies that exist in the system |
| #PoliciesInUse |Whole Number |Number of policies currently being used for configuring backups |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| BackupDaysOfTheWeek |Text |Days of the week when backups have been scheduled |
| BackupFrequency |Text |Frequency with which backups are run for example, daily, weekly |
| BackupTimes |Text |Date and time when backups are scheduled |
| DailyRetentionDuration |Whole Number |Total retention duration in days for configured backups |
| DailyRetentionTimes |Text |Date and time when daily retention was configured |
| EntityState |Text |Current state of the policy object for example, Active, Deleted |
| MonthlyRetentionDaysOfTheMonth |Text |Dates of the month selected for monthly retention |
| MonthlyRetentionDaysOfTheWeek |Text |Days of the week selected for monthly retention |
| MonthlyRetentionDuration |Decimal Number |Total retention duration in months for configured backups |
| MonthlyRetentionFormat |Text |Type of configuration for monthly retention for example, daily for day based, weekly for week based |
| MonthlyRetentionTimes |Text |Date and time when monthly retention is configured |
| MonthlyRetentionWeeksOfTheMonth |Text |Weeks of the month when monthly retention is configured for example, First, Last etc. |
| PolicyName |Text |Name of the policy defined |
| PolicyUniqueId |Text |Unique Id to identify the policy |
| RetentionType |Text |Type of retention policy for example, Daily, Weekly, Monthly, Yearly |
| WeeklyRetentionDaysOfTheWeek |Text |Days of the week selected for weekly retention |
| WeeklyRetentionDuration |Decimal Number |Total weekly retention duration in weeks for configured backups |
| WeeklyRetentionTimes |Text |Date and time when weekly retention is configured |
| YearlyRetentionDaysOfTheMonth |Text |Dates of the month selected for yearly retention |
| YearlyRetentionDaysOfTheWeek |Text |Days of the week selected for yearly retention |
| YearlyRetentionDuration |Decimal Number |Total retention duration in years for configured backups |
| YearlyRetentionFormat |Text |Type of configuration for yearly retention for example, daily for day based, weekly for week based |
| YearlyRetentionMonthsOfTheYear |Text |Months of the year selected for yearly retention |
| YearlyRetentionTimes |Text |Date and time when yearly retention is configured |
| YearlyRetentionWeeksOfTheMonth |Text |Weeks of the month when yearly retention is configured for example, First, Last etc. |

### Protected Server
This table provides basic fields and aggregations over various protected server-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #ProtectedServers |Whole Number |Number of protected servers |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| AzureBackupAgentOSType |Text |OS Type of Azure Backup Agent |
| AzureBackupAgentOSVersion |Text |OS Version of Azure Backup Agent |
| AzureBackupAgentUpdateDate |Text |Date when Agent Backup Agent was updated |
| AzureBackupAgentVersion |Text |Version number of Agent Backup Version |
| BackupManagementType |Text |Provider type for performing backup for example, IaaSVM, FileFolder |
| EntityState |Text |Current state of the protected server object for example, Active, Deleted |
| ProtectedServerFriendlyName |Text |Friendly name of protected server |
| ProtectedServerName |Text |Name of protected server |
| ProtectedServerType |Text |Type of protected server backed up for example, IaaSVMContainer |
| ProtectedServerName |Text |Name of protected server to which backup item belongs |
| RegisteredContainerId |Text |Id of container registered for backup |

### Storage
This table provides basic fields and aggregations over various storage-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #ProtectedInstances |Decimal Number |Number of protected instances used for calculating frontend storage in billing, calculated based on latest value in selected time |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| CloudStorageInMB |Decimal Number |Cloud backup storage used by backups, calculated based on latest value in selected time |
| EntityState |Text |Current state of the object for example, Active, Deleted |
| LastUpdatedDate |Date |Date when selected row was last updated |

### Time
This table provides details about time-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| Hour |Time |Hour of the day for example, 1:00:00 PM |
| HourNumber |Decimal Number |Hour number in the day for example, 13.00 |
| Minute |Decimal Number |Minute of the hour |
| PeriodOfTheDay |Text |Time period slot in the day for example, 12-3 AM |
| Time |Time |Time of the day for example, 12:00:01 AM |
| TimeKey |Text |Key value to represent time |

### Vault
This table provides basic fields and aggregations over various vault-related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #Vaults |Whole Number |Number of vaults |
| AsOnDateTime |Date/Time |Latest refresh time for the selected row |
| AzureDataCenter |Text |Data center where vault is located |
| EntityState |Text |Current state of the vault object for example, Active, Deleted |
| StorageReplicationType |Text |Type of storage replication for the vault for example, GeoRedundant |
| SubscriptionId |Text |Subscription Id of the customer selected for generating reports |
| VaultName |Text |Name of the vault |
| VaultTags |Text |Tags associated to the vault |

## Next steps
Once you review the data model for creating Azure Backup reports, refer the following articles for more details about creating and viewing reports in Power BI.

* [Creating reports in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-create-a-new-report/)
* [Filtering reports in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-about-filters-and-highlighting-in-reports/)
