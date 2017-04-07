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
ms.date: 03/30/2017
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
| #AlertsCreatedInPeriod |Number |Number of alerts created in selected time period |
| %ActiveAlertsCreatedInPeriod |Percentage |Percentage of active alerts in selected time period |
| %CriticalAlertsCreatedInPeriod |Percentage |Percentage of critical alerts in selected time period |
| AlertOccurenceDate |Date |Date when alert was created |
| AlertSeverity |String |Severity of the alert e.g. Critical |
| AlertStatus |String |Current status of the alert e.g. Active |
| AlertType |String |Type of the generated alert e.g. Backup |
| AlertUniqueId |String |Unique Id of the generated alert |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AvgResolutionTimeInMinsForAlertsCreatedInPeriod |Time |Average time it takes to resolve an alert in minutes for selected time period |
| State |String |Current state of the alert object e.g. Active, Deleted |
| VaultUniqueId |String |Unique Id of the vault for which alert is generated |

### Backup Item
This table provides basic fields and aggregations over various backup item related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #BackupItems |Number |Number of backup items |
| #UnprotectedBackupItems |Number |Number of backup items stopped for protection or with backups not started|
| AsOnDateTime |Time |Latest refresh time for the selected row |
| BackupItemId |String |Id of backup item |
| BackupItemName |String |Name of backup item |
| BackupItemType |String |Type of backup item e.g. VM, FileFolder |
| BackupItemUniqueId |String |Unique Id to identify backup item |
| LastBackupDateTime |Time |Time of last backup for selected backup item |
| LastBackupState |String |State of last backup for selected backup item e.g. Successful, Failed |
| LastSuccessfulBackupDateTime |Time |Time of last successful backup for selected backup item |
| ProtectedServerName |String |Name of protected server to which backup item belongs |
| ProtectionState |String |Current protection state of the backup item e.g. Protected, ProtectionStopped |
| State |String |Current state of the backup item object e.g. Active, Deleted |

### Calendar
This table provides details about calendar related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| Date |Date |Date selected for filtering data |
| DateKey |Number |Unique key for each date item |
| DayDiff |Number |Difference in day for filtering data e.g. 0 indicates current day's data, -1 indicates previous one day's data, 0 and -1 indicate data for current and previous day  |
| Month |String |Month of the year selected for filtering data, month begins on 1st day and ends on 31st day |
| MonthDate |Date |Date in the month when month ends, selected for filtering data |
| MonthDiff |Number |Difference in month for filtering data e.g. 0 indicates current month's data, -1 indicates previous month's data, 0 and -1 indicate data for current and previous month |
| Week |String |Week selected for filtering data, week begins on Sunday and ends on Saturday |
| WeekDate |Date |Date in the week when week ends, selected for filtering data |
| WeekDiff |Number |Difference in week for filtering data e.g. 0 indicates current week's data, -1 indicates previous week's data, 0 and -1 indicate data for current and previous week |
| Year |String |Calendar year selected for filtering data |
| YearDate |String |Date in the year when year ends, selected for filtering data |

### Job
This table provides basic fields and aggregations over various job related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #JobsCreatedInPeriod |Number |Number of jobs created in the selected time period |
| %FailuresForJobsCreatedInPeriod |Percentage |Percentage overall job failures in the selected time period |
| 80thPercentileDataTransferredInMBForBackupJobsCreatedInPeriod |Number |80th percentile value of data transferred in MB for **backup** jobs created in the selected time period |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AvgBackupDurationInMinsForJobsCreatedInPeriod |Number |Average time in minutes for **backup** jobs to **complete** created in selected time period |
| AvgRestoreDurationInMinsForJobsCreatedInPeriod |Number |Average time in minutes for **restore** jobs to **complete** created in selected time period |
| BackupItemUniqueId |String |Unique Id to identify backup item |
| BackupStorageDestination |String |Destination where backup is storage e.g. Cloud, Disk  |
| JobFailureCode |String |Failure Code string because of which job failure happened |
| JobOperation |String |Operation for which job is run e.g. Backup, Restore, Configure Backup |
| JobStartDate |Date |Date when job started running |
| JobStartTime |Time |Time when job started running |
| JobStatus |String |Status of the finished job e.g. Completed, Active |
| JobUniqueId |String |Unique Id to identify the job |
| State |String |Current state of the job object e.g. Active, Deleted |

### Policy
This table provides basic fields and aggregations over various policy related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #Policies |Number |Total number of policies that exist |
| #PoliciesInUse |Number |Number of policies currently being used for configuring backups |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| BackupDaysOfTheWeek |String |Days of the week when backups have been scheduled |
| BackupFrequency |String |Frequency with which backups are run e.g. daily, weekly |
| BackupTimes |Time |Date and time when backups are scheduled |
| DailyRetentionDuration |Number |Total daily retention duration for configured backups |
| DailyRetentionTimes |Time |Date and time when daily retention was configured |
| MonthlyRetentionDaysOfTheMonth |String |Dates of the month selected for monthly retention |
| MonthlyRetentionDaysOfTheWeek |String |Days of the week selected for monthly retention |
| MonthlyRetentionDuration |Number |Total monthly retention duration for configured backups |
| MonthlyRetentionFormat |String |Type of configuration for monthly retention e.g. daily for day based, weekly for week based |
| MonthlyRetentionTimes |Time |Date and time when monthly retention is configured |
| MonthlyRetentionWeeksOfTheMonth |String |Weeks of the month when monthly retention is configured e.g. First, Last etc. |
| PolicyName |String |Name of the policy defined |
| RetentionDuration |Number |Total duration of the retention policy |
| RetentionType |String |Type of retention policy e.g. Daily, Weekly, Monthly, Yearly |
| State |String |Current state of the policy object e.g. Active, Deleted |
| WeeklyRetentionDaysOfTheWeek |String |Days of the week selected for weekly retention |
| WeeklyRetentionDuration |Number |Total weekly retention duration(in week) for configured backups |
| WeeklyRetentionTimes |Time |Date and time when weekly retention is configured |
| YearlyRetentionDaysOfTheMonth |String |Dates of the month selected for yearly retention |
| YearlyRetentionDaysOfTheWeek |String |Days of the week selected for yearly retention |
| YearlyRetentionDuration |Number |Total yearly retention duration for configured backups |
| YearlyRetentionFormat |String |Type of configuration for yearly retention e.g. daily for day based, weekly for week based |
| YearlyRetentionMonthsOfTheYear |String |Months of the year selected for yearly retention |
| YearlyRetentionTimes |Time |Date and time when yearly retention is configured |
| YearlyRetentionWeeksOfTheMonth |String |Weeks of the month when yearly retention is configured e.g. First, Last etc. |


### Protected Server
This table provides basic fields and aggregations over various protected server related fields.

| Field | Data Type | Description |
| --- | --- | --- |
| #ProtectedServers |Number |Number of protected servers |
| AsOnDateTime |Time |Latest refresh time for the selected row |
| AzureBackupAgentOSType |String |OS Type of Azure Backup Agent |
| AzureBackupAgentOSVersion |String |OS Version of Azure Backup Agent |
| AzureBackupAgentUpdateDate |Date |Date when Agent Backup Agent was updated |
| AzureBackupAgentVersion |String |Version number of Agent Backup Version |
| BackupManagementType |String |Provider type for performing backup e.g. IaaSVM, FileFolder |
| ProtectedServerName |String |Name of protected server |
| ProtectedServerType |String |Type of protected server backed up e.g. IaaSVMContainer |
| LastSuccessfulBackupDateTime |Time |Time of last successful backup for selected backup item |
| ProtectedServerName |String |Name of protected server to which backup item belongs |
| RegisteredContainerId |String |Id of container registered for backup |
| State |String |Current state of the protected server object e.g. Active, Deleted |
