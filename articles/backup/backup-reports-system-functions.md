---
title: System functions on Azure Monitor Logs
description: Write custom queries on Azure Monitor Logs using system functions
ms.topic: conceptual
ms.date: 04/18/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# System functions on Azure Monitor Logs

Azure Backup provides a set of functions, called system functions or solution functions that are available by default in your Log Analytics (LA) workspaces.
 
These functions operate on data in the [raw Azure Backup tables](./backup-azure-reports-data-model.md) in LA and return formatted data that helps you easily retrieve information of all your backup-related entities, using simple queries. Users can pass parameters to these functions to filter the data that is returned by these functions. 

It's recommended to use system functions for querying your backup data in LA workspaces for creating custom reports, as they provide a number of benefits, as detailed in the section below.

## Benefits of using system functions

* **Simpler queries**: Using functions helps you reduce the number of joins needed in your queries. By default, the functions return ‘flattened’ schemas that incorporate all information pertaining to the entity (backup instance, job, vault, and so on) being queried. For example, if you need to get a list of successful backup jobs by backup item name and its associated container, a simple call to the **_AzureBackup_getJobs()** function will give you all of this information for each job. On the other hand, querying the raw tables directly would require you to perform multiple joins between [AddonAzureBackupJobs](./backup-azure-reports-data-model.md#addonazurebackupjobs) and [CoreAzureBackup](./backup-azure-reports-data-model.md#coreazurebackup) tables.

* **Smoother transition from the legacy diagnostics event**: Using system functions helps you transition smoothly from the [legacy diagnostics event](./backup-azure-diagnostic-events.md#legacy-event) (AzureBackupReport in AzureDiagnostics mode) to the [resource-specific events](./backup-azure-diagnostic-events.md#diagnostics-events-available-for-azure-backup-users). All the system functions provided by Azure Backup allows you to specify a parameter that lets you choose whether the function should query data only from the resource-specific tables, or query data from both the legacy table and the resource-specific tables (with deduplication of records).
    * If you have successfully migrated to the resource-specific tables, you can choose to exclude the legacy table from being queried by the function.
    * If you are currently in the process of migration and have some data in the legacy tables which you require for analysis, you can choose to include the legacy table. When the transition is complete, and you no longer need data from the legacy table, you can simply update the value of the parameter passed to the function in your queries, to exclude the legacy table.
    * If you are still using only the legacy table, the functions will still work if you choose to include the legacy table via the same parameter. However, it is recommended to [switch to the resource-specific tables](./backup-azure-diagnostic-events.md#steps-to-move-to-new-diagnostics-settings-for-a-log-analytics-workspace) at the earliest.

* **Reduces possibility of custom queries breaking**: If Azure Backup introduces improvements to the schema of the underlying LA tables to accommodate future reporting scenarios, the definition of the functions will also be updated to take into account the schema changes. Thus, if you use system functions for creating custom queries, your queries will not break, even if there are changes in the underlying schema of the tables.

> [!NOTE]
> System functions are maintained by Microsoft and their definitions cannot be edited by users. If you require editable functions, you can create [saved functions](../azure-monitor/logs/functions.md) in LA.

## Types of system functions offered by Azure Backup

* **Core functions**: These are functions that help you query any of the key Azure Backup entities, such as Backup Instances, Vaults, Policies, Jobs and Billing Entities. For example, the **_AzureBackup_getBackupInstances** function returns a list of all the backup instances that exist in your environment as of the latest completed day (in UTC). The parameters and returned schema for each of these core functions are summarized below in this article.

* **Trend functions**: These are functions that return historical records for your backup-related entities (for example, backup instances, billing groups) and allow you to get daily, weekly and monthly trend information on key metrics (for example, Count, Storage consumed) pertaining to these entities. The parameters and returned schema for each of these trend functions are summarized below in this article.

> [!NOTE]
> Currently, system functions return data for up to the last completed day (in UTC). Data for the current partial day isn't returned. So if you are looking to retrieve records for the current day, you'll need to use the raw LA tables.


## List of system functions

### Core Functions

#### _AzureBackup_GetVaults()

This function returns the list of all Recovery Services vaults in your Azure environment that are associated with the LA workspace.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter only if you need to fetch all vault-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each vault. | N | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter only if you need to fetch all vault-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each vault. | N |"2021-03-10 00:00:00"| DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those vaults that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111"| String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those vaults that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus`| String |
| VaultList    |Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records across all vaults. | N |`vault1,vault2,vault3`| String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults"| String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean | 

**Returned Fields**

| **Field Name** | **Description** | **Data type** |
| -------------- | --------------- | --------------- |
| UniqueId | Primary key denoting unique ID of the vault | String |
| Id | Azure Resource Manager (ARM) ID of the vault | String |
| Name | Name of the vault | String |
| SubscriptionId | ID of the subscription in which the vault exists | String | 
| Location | Location in which the vault exists | String |
| VaultStore_StorageReplicationType | Storage Replication Type associated with the vault | String |
| Tags | Tags of the vault | String |
| TimeGenerated | Timestamp of the record | DateTime |
| Type |  Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults"| String |

#### _AzureBackup_GetPolicies()

This function returns the list of backup policies that are being used in your Azure environment along with detailed information about each policy such as the datasource type, storage replication type, and so on.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with the RangeStart parameter only if you need to fetch all policy-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each policy. | N | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter only if you need to fetch all policy-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each policy. | N |"2021-03-10 00:00:00"| DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those policies that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111"| String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those policies that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus`| String |
| VaultList    |Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records of policies pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records of policies across all vaults. | N |`vault1,vault2,vault3`| String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults"| String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean |
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N | `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String |

**Returned Fields**

| **Field Name** | **Description** | **Data type **
| -------------- | --------------- | --------------- | 
| UniqueId | Primary key denoting unique ID of the policy | String |
| Id | Azure Resource Manager (ARM) ID of the policy | String | 
| Name | Name of the policy | String |
| TimeZone | Timezone in which the policy is defined | String |
| Backup Solution | Backup Solution that the policy is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String | 
| TimeGenerated | Timestamp of the record | Datetime |
| VaultUniqueId | Foreign key that refers to the vault associated with the policy | String | 
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the policy | String |
| VaultName | Name of the vault associated with the policy | String |
| VaultTags | Tags of the vault associated with the policy | String |
| VaultLocation | Location of the vault associated with the policy | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the policy | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the policy | String |
| VaultType | Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| ExtendedProperties | Additional properties of the policy | Dynamic |

#### _AzureBackup_GetJobs()

This function returns a list of all backup and restore related jobs that were triggered in a specified time range, along with detailed information about each job, such as job status, job duration, data transferred, and so on.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type ** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter to retrieve the list of all jobs that started in the time period from RangeStart to RangeEnd. | Y | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter to retrieve the list of all jobs that started in the time period from RangeStart to RangeEnd. | Y |"2021-03-10 00:00:00" | DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those jobs that are associated with vaults in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111"| String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those jobs that are associated with vaults in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus`| String |
| VaultList    | Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve jobs pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for jobs across all vaults. | N |`vault1,vault2,vault3` | String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults"| String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean | 
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N | `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String | 
| JobOperationList | Use this parameter to filter the output of the function for a specific type of job. For example, Backup or Restore. By default, the value of this parameter is "*", which makes the function search for both Backup and Restore jobs. | N | "Backup" |  String |
| JobStatusList | Use this parameter to filter the output of the function for a specific job status. For example, Completed, Failed, and so on. By default, the value of this parameter is "*", which makes the function search for all jobs irrespective of status. | N | `Failed,CompletedWithWarnings` | String |
| JobFailureCodeList | Use this parameter to filter the output of the function for a specific failure code. By default, the value of this parameter is "*", which makes the function search for all jobs irrespective of failure code. | N | "Success" | String |
| DatasourceSetName | Use this parameter to filter the output of the function to a particular parent resource. For example, to return SQL in Azure VM backup instances belonging to the virtual machine "testvm", specify _testvm_ as the value of this parameter. By default, the value is "*", which makes the function search for records across all backup instances. | N | "testvm" | String |
| BackupInstanceName | Use this parameter to search for jobs on a particular backup instance by name. By default, the value is "*", which makes the function search for records across all backup instances. | N | "testvm" | String |
| ExcludeLog | Use this parameter to exclude log jobs from being returned by the function (helps in query performance). By default, the value of this parameter is true, which makes the function exclude log jobs. | N | true | Boolean |


**Returned Fields**

| **Field Name** | **Description** | **Data type ** |
| -------------- | --------------- | --------------- | 
| UniqueId | Primary key denoting unique ID of the job | String |
| OperationCategory | Category of the operation being performed. For example, Backup, Restore | String |
| Operation | Details of the operation being performed. For example, Log (for log backup) | String |
| Status | Status of the job. For example, Completed, Failed, CompletedWithWarnings | String |
| ErrorTitle | Failure code of the job | String |
| StartTime | Date and time at which the job started | DateTime |
| DurationInSecs | Duration of the job in seconds | Double |
| DataTransferredInMBs | Data transferred by the job in MBs. Currently, this field is only supported for Recovery Services vault workloads | Double |
| RestoreJobRPDateTime | The date and time when the recovery point that's being recovered was created. Currently, this field is only supported for Recovery Services vault workloads | DateTime | 
| RestoreJobRPLocation | The location where the recovery point that's being recovered was stored | String |
| BackupInstanceUniqueId | Foreign key that refers to the backup instance associated with the job | String |
| BackupInstanceId | Azure Resource Manager (ARM) ID of the backup instance associated with the job | String |
| BackupInstanceFriendlyName | Name of the backup instance associated with the job | String |
| DatasourceResourceId | Azure Resource Manager (ARM) ID of the underlying datasource associated with the job. For example, Azure Resource Manager (ARM) ID of the VM | String |
| DatasourceFriendlyName | Friendly name of the underlying datasource associated with the job | String |
| DatasourceType | Type of the datasource associated with the job. For example "Microsoft.Compute/virtualMachines" | String |
| BackupSolution | Backup Solution that the job is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String |
| DatasourceSetResourceId | Azure Resource Manager (ARM) ID of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the Azure Resource Manager (ARM) ID of the VM in which the SQL Database exists | String |
| DatasourceSetType | Type of the parent resource of the datasource (wherever applicable). For example, for an SAP HANA in Azure VM datasource, this field will be Microsoft.Compute/virtualMachines since the parent resource is an Azure VM | String |
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the job | String |
| VaultUniqueId | Foreign key that refers to the vault associated with the job | String |
| VaultName | Name of the vault associated with the job | String |
| VaultTags | Tags of the vault associated with the job | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the job | String |
| VaultLocation | Location of the vault associated with the job | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the job | String |
| VaultType | Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| TimeGenerated | Timestamp of the record | DateTime| 

#### _AzureBackup_GetBackupInstances()

This function returns the list of backup instances that are associated with your Recovery Services vaults, along with detailed information about each backup instance, such as cloud storage consumption, associated policy, and so on.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type ** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter only if you need to fetch all backup instance-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each backup instance. | N | "2021-03-03 00:00:00" | DataTime | 
| RangeEnd     | Use this parameter along with RangeStart parameter only if you need to fetch all backup instance-related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each backup instance. | N |"2021-03-10 00:00:00"| DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those backup instances that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111" | String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those backup instances that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus` | String |
| VaultList    |Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records of backup instances pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records of backup instances across all vaults. | N |`vault1,vault2,vault3` | String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults" | String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean |
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N | `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String |
| ProtectionInfoList | Use this parameter to choose whether to include only those backup instances that are actively protected, or to also include those instances for which protection has been stopped and instances for which initial backup is pending. For Recovery services vault workloads, supported values are "Protected", "ProtectionStopped", "InitialBackupPending" or a comma-separated combination of any of these values. For Backup vault workloads, supported values are "Protected", "ConfiguringProtection", "ConfiguringProtectionFailed", "UpdatingProtection", "ProtectionError", "ProtectionStopped" or a comma-separated combination of any of these values. By default, the value is "*", which makes the function search for all backup instances irrespective of protection details. | N | "Protected" | String |
| DatasourceSetName | Use this parameter to filter the output of the function to a particular parent resource. For example, to return SQL in Azure VM backup instances belonging to the virtual machine "testvm", specify _testvm_ as the value of this parameter. By default, the value is "*", which makes the function search for records across all backup instances. | N | "testvm" | String |
| BackupInstanceName | Use this parameter to search for a particular backup instance by name. By default, the value is "*", which makes the function search for all backup instances. | N | "testvm" | String |
| DisplayAllFields | Use this parameter to choose whether to retrieve only a subset of the fields returned by the function. If the value of this parameter is false, the function eliminates storage and retention point related information from the output of the function. This is useful if you are using this function as an intermediate step in a larger query and need to optimize the performance of the query by eliminating columns which you do not require for analysis. By default, the value of this parameter is true, which makes the function return all fields pertaining to the backup instance. | N | true | Boolean |

**Returned Fields**

| **Field Name** | **Description** | **Data type** |
| -------------- | --------------- | --------------- |
| UniqueId | Primary key denoting unique ID of the backup instance | String |
| Id | Azure Resource Manager (ARM) ID of the backup instance | String |
| FriendlyName | Friendly name of the backup instance | String |
| ProtectionInfo | Information about the protection settings of the backup instance. For example, protection is configured, protection stopped, initial backup pending | String |
| LatestRecoveryPoint | Date and time of the latest recovery point associated with the backup instance. Currently, this field is only supported for Recovery Services vault workloads. | DateTime |
| OldestRecoveryPoint | Date and time of the oldest recovery point associated with the backup instance. Currently, this field is only supported for Recovery Services vault workloads. | DateTime |
| SourceSizeInMBs | Frontend size of the backup instance in MBs | Double |
| VaultStore_StorageConsumptionInMBs | Total cloud storage consumed by the backup instance in the vault-standard tier | Double |
| DataSourceFriendlyName | Friendly name of the datasource corresponding to the backup instance | String |
| BackupSolution | Backup Solution that the backup instance is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String |
| DatasourceType | Type of the datasource corresponding to the backup instance. For example "Microsoft.Compute/virtualMachines" | String |
| DatasourceResourceId | Azure Resource Manager (ARM) ID of the underlying datasource corresponding to the backup instance. For example, Azure Resource Manager (ARM) ID of the VM | String |
| DatasourceSetFriendlyName | Friendly name of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the name of the VM in which the SQL Database exists | String |
| DatasourceSetFriendlyName | Friendly name of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the name of the VM in which the SQL Database exists | String |
| DatasourceSetResourceId | Azure Resource Manager (ARM) ID of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the Azure Resource Manager (ARM) ID of the VM in which the SQL Database exists | String |
| DatasourceSetType | Type of the parent resource of the datasource (wherever applicable). For example, for an SAP HANA in Azure VM datasource, this field will be Microsoft.Compute/virtualMachines since the parent resource is an Azure VM | String |
| PolicyName | Name of the policy associated with the backup instance | String |
| PolicyUniqueId | Foreign key that refers to the policy associated with the backup instance  | String |
| PolicyId | Azure Resource Manager (ARM) ID of the policy associated with the backup instance | String |
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the backup instance | String |
| VaultUniqueId | Foreign key which refers to the vault associated with the backup instance | String |
| VaultName | Name of the vault associated with the backup instance | String |
| VaultTags | Tags of the vault associated with the backup instance | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the backup instance | String |
| VaultLocation | Location of the vault associated with the backup instance | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the backup instance | String |
| VaultType | Type of the vault, which is "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| TimeGenerated | Timestamp of the record | DateTime |

#### _AzureBackup_GetBillingGroups()

This function returns a list of all backup-related billing entities (billing groups) along with information on key billing components such as frontend size and total cloud storage.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Date type**
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter only if you need to fetch all billing group related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each billing group. | N | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter only if you need to fetch all billing group related records in the time period from RangeStart to RangeEnd. By default, the value of RangeStart and RangeEnd are null, which will make the function retrieve only the latest record for each billing group. | N |"2021-03-10 00:00:00"| DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those billing groups that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111" | String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those billing groups that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus` | String |
| VaultList    |Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records of backup instances pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records of billing groups across all vaults. | N | `vault1,vault2,vault3` | String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults" | String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean |
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N |    `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String |
| BillingGroupName | Use this parameter to search for a particular billing group by name. By default, the value is "*", which makes the function search for all billing groups. | N | "testvm" | String  | 

**Returned Fields**

| **Field Name** | **Description** | **Data type** |
| -------------- | --------------- | --------------- |
| UniqueId | Primary key denoting unique ID of the billing group | String |
| FriendlyName | Friendly name of the billing group | String |
| Name | Name of the billing group | String |
| Type | Type of billing group. For example, ProtectedContainer or BackupItem | String |
| SourceSizeInMBs | Frontend size of the billing group in MBs | Double |
| VaultStore_StorageConsumptionInMBs | Total cloud storage consumed by the billing group in the vault-standard tier | Double |
| BackupSolution | Backup Solution that the billing group is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String |
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the billing group | String |
| VaultUniqueId | Foreign key which refers to the vault associated with the billing group | String |
| VaultName | Name of the vault associated with the billing group | String |
| VaultTags | Tags of the vault associated with the billing group | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the billing group | String |
| VaultLocation | Location of the vault associated with the billing group | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the billing group | String |
| VaultType | Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| TimeGenerated | Timestamp of the record | DateTime |
| ExtendedProperties | Additional properties of the billing group | Dynamic |

### Trend Functions

#### _AzureBackup_GetBackupInstancesTrends()

This function returns historical records for each backup instance, allowing you to view key daily, weekly and monthly trends related to the backup instance count and storage consumption, at multiple levels of granularity.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter to retrieve all backup instance related records in the time period from RangeStart to RangeEnd. | Y | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter to retrieve all backup instance related records in the time period from RangeStart to RangeEnd. | Y |"2021-03-10 00:00:00" | DateTime |
| VaultSubscriptionList   | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those backup instances that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111"| String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those backup instances that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus` | String |
| VaultList    |Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records of backup instances pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records of backup instances across all vaults. | N |`vault1,vault2,vault3` | String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults" | String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean |
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N | `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String |
| ProtectionInfoList | Use this parameter to choose whether to include only those backup instances that are actively protected, or to also include those instances for which protection has been stopped and instances for which initial backup is pending. For Recovery services vault workloads, supported values are "Protected", "ProtectionStopped", "InitialBackupPending" or a comma-separated combination of any of these values. For Backup vault workloads, supported values are "Protected", "ConfiguringProtection", "ConfiguringProtectionFailed", "UpdatingProtection", "ProtectionError", "ProtectionStopped" or a comma-separated combination of any of these values. By default, the value is "*", which makes the function search for all backup instances irrespective of protection details. | N | "Protected" | String |
| DatasourceSetName | Use this parameter to filter the output of the function to a particular parent resource. For example, to return SQL in Azure VM backup instances belonging to the virtual machine "testvm", specify _testvm_ as the value of this parameter. By default, the value is "*", which makes the function search for records across all backup instances. | N | "testvm" | String |
| BackupInstanceName | Use this parameter to search for a particular backup instance by name. By default, the value is "*", which makes the function search for all backup instances. | N | "testvm" | String |
| DisplayAllFields | Use this parameter to choose whether to retrieve only a subset of the fields returned by the function. If the value of this parameter is false, the function eliminates storage and retention point related information from the output of the function. This is useful if you are using this function as an intermediate step in a larger query and need to optimize the performance of the query by eliminating columns which you do not require for analysis. By default, the value of this parameter is true, which makes the function return all fields pertaining to the backup instance. | N | true | Boolean |
| AggregationType | Use this parameter to specify the time granularity at which data should be retrieved. If the value of this parameter is "Daily", the function returns a record per backup instance per day, allowing you to analyze daily trends of storage consumption and backup instance count. If the value of this parameter is "Weekly", the function returns a record per backup instance per week, allowing you to analyze weekly trends. Similarly, you can specify "Monthly" to analyze monthly trends. Default value is "Daily". If you are viewing data across larger time ranges, it is recommended to use "Weekly" or "Monthly" for better query performance and ease of trend analysis. | N | "Weekly" | String |

**Returned Fields**

| **Field Name** | **Description** | **Data type** |
| -------------- | --------------- | --------------- |
| UniqueId | Primary key denoting unique ID of the backup instance | String|
| Id | Azure Resource Manager (ARM) ID of the backup instance | String |
| FriendlyName | Friendly name of the backup instance | String |
| ProtectionInfo | Information about the protection settings of the backup instance. For example, protection is configured, protection stopped, initial backup pending | String |
| LatestRecoveryPoint | Date and time of the latest recovery point associated with the backup instance. Currently, this field is only supported for Recovery Services vault workloads | DateTime |
| OldestRecoveryPoint | Date and time of the oldest recovery point associated with the backup instance | Currently, this field is only supported for Recovery Services vault workloads |
| SourceSizeInMBs | Frontend size of the backup instance in MBs | Double |
| VaultStore_StorageConsumptionInMBs | Total cloud storage consumed by the backup instance in the vault-standard tier | Double |
| DataSourceFriendlyName | Friendly name of the datasource corresponding to the backup instance | String |
| BackupSolution | Backup Solution that the backup instance is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String |
| DatasourceType | Type of the datasource corresponding to the backup instance. For example "Microsoft.Compute/virtualMachines" | String |
| DatasourceResourceId | Azure Resource Manager (ARM) ID of the underlying datasource corresponding to the backup instance. For example, Azure Resource Manager (ARM) ID of the VM | String |
| DatasourceSetFriendlyName | Friendly name of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the name of the VM in which the SQL Database exists | String |
| DatasourceSetResourceId | Azure Resource Manager (ARM) ID of the parent resource of the datasource (wherever applicable). For example, for a SQL in Azure VM datasource, this field will contain the Azure Resource Manager (ARM) ID of the VM in which the SQL Database exists | String |
| DatasourceSetType | Type of the parent resource of the datasource (wherever applicable). For example, for an SAP HANA in Azure VM datasource, this field will be Microsoft.Compute/virtualMachines since the parent resource is an Azure VM | String |
| PolicyName | Name of the policy associated with the backup instance | String |
| PolicyUniqueId | Foreign key that refers to the policy associated with the backup instance  | String |
| PolicyId | Azure Resource Manager (ARM) ID of the policy associated with the backup instance | String |
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the backup instance | String |
| VaultUniqueId | Foreign key which refers to the vault associated with the backup instance | String |
| VaultName | Name of the vault associated with the backup instance | String |
| VaultTags | Tags of the vault associated with the backup instance | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the backup instance | String |
| VaultLocation | Location of the vault associated with the backup instance | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the backup instance | String |
| VaultType | Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| TimeGenerated | Timestamp of the record | DateTime |

#### _AzureBackup_GetBillingGroupsTrends()

This function returns historical records for each billing entity, allowing you to view key daily, weekly and monthly trends related to frontend size and storage consumption, at multiple levels of granularity.

**Parameters**

| **Parameter Name** | **Description** | **Required?** | **Example value** | **Data type** |
| -------------------- | ------------- | --------------- | ----------------- | ----------------- |
| RangeStart     | Use this parameter along with RangeEnd parameter to retrieve all billing group related records in the time period from RangeStart to RangeEnd. | Y | "2021-03-03 00:00:00" | DateTime |
| RangeEnd     | Use this parameter along with RangeStart parameter to retrieve all billing group related records in the time period from RangeStart to RangeEnd. | Y |"2021-03-10 00:00:00" | DateTime |
| VaultSubscriptionList  | Use this parameter to filter the output of the function for a certain set of subscriptions where backup data exists. Specifying a comma-separated list of subscription IDs as a parameter to this function helps you retrieve only those billing groups that are in the specified subscriptions. By default, the value of this parameter is '*', which makes the function search for records across all subscriptions. | N | "00000000-0000-0000-0000-000000000000,11111111-1111-1111-1111-111111111111" | String |
| VaultLocationList     | Use this parameter to filter the output of the function for a certain set of regions where backup data exists. Specifying a comma-separated list of regions as a parameter to this function helps you retrieve only those billing groups that are in the specified regions. By default, the value of this parameter is '*', which makes the function search for records across all regions. | N | `eastus,westus` | String |
| VaultList    | Use this parameter to filter the output of the function for a certain set of vaults. Specifying a comma-separated list of vault names as a parameter to this function helps you retrieve records of backup instances pertaining only to the specified vaults. By default, the value of this parameter is '*', which makes the function search for records of billing groups across all vaults. | N |`vault1,vault2,vault3` | String |
| VaultTypeList     | Use this parameter to filter the output of the function to records pertaining to a particular vault type. By default, the value of this parameter is '*', which makes the function search for both Recovery Services vaults and Backup vaults. | N | "Microsoft.RecoveryServices/vaults" | String |
| ExcludeLegacyEvent  | Use this parameter to choose whether to query data in the legacy AzureDiagnostics table or not. If the value of this parameter is false, the function queries data from both the AzureDiagnostics table and the Resource specific tables. If the value of this parameter is true, the function queries data from only the Resource specific tables. Default value is true. | N | true | Boolean |
| BackupSolutionList | Use this parameter to filter the output of the function for a certain set of backup solutions used in your Azure environment. For example, if you specify `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM` as the value of this parameter, the function only returns records that are related to items backed up using Azure Virtual Machine backup, SQL in Azure VM backup or DPM to Azure backup. By default, the value of this parameter is '*', which makes the function return records pertaining to all backup solutions that are supported by Backup Reports (supported values are "Azure Virtual Machine Backup", "SQL in Azure VM Backup", "SAP HANA in Azure VM Backup", "Azure Storage (Azure Files) Backup", "Azure Backup Agent", "DPM", "Azure Backup Server", "Azure Database for PostgreSQL Server Backup", "Azure Blob Backup", "Azure Disk Backup" or a comma-separated combination of any of these values). | N | `Azure Virtual Machine Backup,SQL in Azure VM Backup,DPM,Azure Backup Agent` | String |
| BillingGroupName | Use this parameter to search for a particular billing group by name. By default, the value is "*", which makes the function search for all billing groups. | N | "testvm" | String |
| AggregationType | Use this parameter to specify the time granularity at which data should be retrieved. If the value of this parameter is "Daily", the function returns a record per billing group per day, allowing you to analyze daily trends of storage consumption and frontend size. If the value of this parameter is "Weekly", the function returns a record per backup instance per week, allowing you to analyze weekly trends. Similarly, you can specify "Monthly" to analyze monthly trends. Default value is "Daily". If you are viewing data across larger time ranges, it is recommended to use "Weekly" or "Monthly" for better query performance and ease of trend analysis. | N | "Weekly" | String |

**Returned Fields**

| **Field Name** | **Description** | **Data type** |
| -------------- | --------------- | --------------- |
| UniqueId | Primary key denoting unique ID of the billing group | String |
| FriendlyName | Friendly name of the billing group | String |
| Name | Name of the billing group | String |
| Type | Type of billing group. For example, ProtectedContainer or BackupItem | String |
| SourceSizeInMBs | Frontend size of the billing group in MBs | Double |
| VaultStore_StorageConsumptionInMBs | Total cloud storage consumed by the billing group in the vault-standard tier | Double |
| BackupSolution | Backup Solution that the billing group is associated with. For example, Azure VM Backup, SQL in Azure VM Backup, and so on. | String |
| VaultResourceId | Azure Resource Manager (ARM) ID of the vault associated with the billing group | String |
| VaultUniqueId | Foreign key which refers to the vault associated with the billing group | String |
| VaultName | Name of the vault associated with the billing group | String |
| VaultTags | Tags of the vault associated with the billing group | String |
| VaultSubscriptionId | Subscription ID of the vault associated with the billing group | String |
| VaultLocation | Location of the vault associated with the billing group | String |
| VaultStore_StorageReplicationType | Storage Replication Type of the vault associated with the billing group | String |
| VaultType | Type of the vault, for example, "Microsoft.RecoveryServices/vaults" or "Microsoft.DataProtection/backupVaults" | String |
| TimeGenerated | Timestamp of the record | DateTime |
| ExtendedProperties | Additional properties of the billing group | Dynamic |

## Sample Queries

Below are some sample queries to help you get started with using system functions.

- All failed Azure VM backup jobs in a given time range

    ````Kusto
    _AzureBackup_GetJobs("2021-03-05", "2021-03-06") //call function with RangeStart and RangeEnd parameters set, and other parameters with default value
    | where BackupSolution=="Azure Virtual Machine Backup" and Status=="Failed"
    | project BackupInstanceFriendlyName, BackupInstanceId, OperationCategory, Status,  JobStartDateTime=StartTime, JobDuration=DurationInSecs/3600, ErrorTitle, DataTransferred=DataTransferredInMBs
    ````

- All SQL log backup jobs in a given time range

    ````Kusto
    _AzureBackup_GetJobs("2021-03-05", "2021-03-06","*","*","*","*",true,"*","*","*","*","*","*",false) //call function with RangeStart and RangeEnd parameters set, ExcludeLog parameter as false, and other parameters with default value
    | where BackupSolution=="SQL in Azure VM Backup" and Operation=="Log"
    | project BackupInstanceFriendlyName, BackupInstanceId, OperationCategory, Status,  JobStartDateTime=StartTime, JobDuration=DurationInSecs/3600, ErrorTitle, DataTransferred=DataTransferredInMBs
    ````

- Weekly trend of backup storage consumed for VM "testvm"

    ````Kusto
    _AzureBackup_GetBackupInstancesTrends("2021-01-01", "2021-03-06","*","*","*","*",false,"*","*","*","*",true, "Weekly") //call function with RangeStart and RangeEnd parameters set, AggregationType parameter as Weekly, and other parameters with default value
    | where BackupSolution == "Azure Virtual Machine Backup"
    | where FriendlyName == "testvm"
    | project TimeGenerated, VaultStore_StorageConsumptionInMBs
    | render timechart 
    ````

## Next steps
[Learn more about Backup Reports](./configure-reports.md)