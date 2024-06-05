---
title: Back up Azure Database for PostgreSQL with long-term-retention using Azure PowerShell
description: Learn how to back up Azure Database for PostgreSQL using Azure PowerShell.
ms.topic: conceptual
ms.date: 01/24/2022
ms.custom: devx-track-azurepowershell
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure PostgreSQL databases using Azure PowerShell

This article explains how to back up [Azure PostgreSQL database](../postgresql/overview.md#azure-database-for-postgresql---single-server) using Azure PowerShell.

In this article, you'll learn how to:

- Create a Backup vault

- Create a backup policy

- Configure a backup of an Azure PostgreSQL database

- Run an on-demand backup job

For information on the Azure PostgreSQL databases supported scenarios and limitations, see the [support matrix](backup-azure-database-postgresql-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure that stores the backup data for various new workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, Azure Disks, and Azure Blobs. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you creat a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the backup vault with that storage redundancy and the location.

In this article, we'll create a Backup vault *TestBkpVault*, in *westus* region, under the resource group *testBkpVaultRG*. Use the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) command to create a Backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurepowershell-interactive
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore
New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
$TestBKPVault | fl
ETag                :
Id                  : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault
Identity            : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.DppIdentityDetails
IdentityPrincipalId :
IdentityTenantId    :
IdentityType        :
Location            : westus
Name                : TestBkpVault
ProvisioningState   : Succeeded
StorageSetting      : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.StorageSetting}
SystemData          : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.SystemData
Tag                 : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.DppTrackedResourceTags
Type                : Microsoft.DataProtection/backupVaults
```

After creating the vault, let's create a backup policy to protect Azure PostgreSQL databases.

## Create a backup policy

### Understand PostgreSQL backup policy

While disk backup offers multiple backups per day and blob backup is a *continuous* backup with no trigger, PostgreSQL backup offers Archive protection. The backup data that's first sent to the vault can be moved to the *archive* tier as per a defined rule or a *lifecycle*. In this context, let's understand the backup policy object for PostgreSQL.

-  PolicyRule
   -  BackupRule
      -  BackupParameter
         -  BackupType (A full database backup in this case)
         -  Initial Datastore (Where will the backups land initially)
         -  Trigger (How the backup is triggered)
            -  Schedule based
            -  Default Tagging Criteria (A default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they are triggered (via a schedule), what they are tagged with, where they land (a datastore), and the lifecycle of the backup data in a datastore. The default PowerShell object for PostgreSQL says to trigger a *full* backup every week, and they'll reach the vault, where they are stored for three months.

If you want to add the *archive* tier to the policy, you have to decide when the data will be moved from vault to archive, how long will the data stay in the archive, and which of the scheduled backups should be *tagged* as _archivable_. So, you've to add a *retention rule*, where the lifecycle of the backup data will be defined from vault datastore to archive datastore and how long they'll stay in the *archive* datastore. Then you need to add a *tag* that'll mark the scheduled backups as _eligible to be archived_.

The resultant PowerShell object is as follows:


-  PolicyRule
   -  BackupRule
      -  BackupParameter
         -  BackupType (A full database backup in this case)
         -  Initial Datastore (Where will the backups land initially)
         -  Trigger (How the backup is triggered)
            -  Schedule based
            -  Default Tagging Criteria (A default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
            -  New Tagging criteria for the new retention rule with the same name 'X'
   -  Default Retention Rule (A rule that will be applied to all backups, by default, on the initial datastore)
   -  A new Retention rule named as 'X'
      -  Lifecycle
         -  Source datastore
         -  Delete After time period in source datastore
         -  Copy to target datastore

### Retrieving the Policy template

To understand the inner components of a backup policy for Azure PostgreSQL database backup, retrieve the policy template using the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurepowershell-interactive
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureDatabaseForPostgreSQL
$policyDefn | fl


DatasourceType : {Microsoft.DBforPostgreSQL/servers/databases}
ObjectType     : BackupPolicy
PolicyRule     : {BackupWeekly, Default}

$policyDefn.PolicyRule | fl


BackupParameter           : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210701.AzureBackupParams
BackupParameterObjectType : AzureBackupParams
DataStoreObjectType       : DataStoreInfoBase
DataStoreType             : VaultStore
Name                      : BackupWeekly
ObjectType                : AzureBackupRule
Trigger                   : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210701.ScheduleBasedTriggerCo
                            ntext
TriggerObjectType         : ScheduleBasedTriggerContext

IsDefault  : True
Lifecycle  : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210701.SourceLifeCycle}
Name       : Default
ObjectType : AzureRetentionRule
```

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete/copy/move the backup). In Azure PostgreSQL database backup, the default value for trigger is a scheduled Weekly trigger (1 backup every 7 days) and to retain each backup for three months.

```azurepowershell-interactive
 $policyDefn.PolicyRule[0].Trigger | fl


ObjectType                    : ScheduleBasedTriggerContext
ScheduleRepeatingTimeInterval : {R/2021-08-22T02:00:00+00:00/P1W}
ScheduleTimeZone              : UTC
TaggingCriterion              : {Default}
```

```azurepowershell-interactive
$policyDefn.PolicyRule[1].Lifecycle | fl


DeleteAfterDuration        : P3M
DeleteAfterObjectType      : AbsoluteDeleteOption
SourceDataStoreObjectType  : DataStoreInfoBase
SourceDataStoreType        : VaultStore
TargetDataStoreCopySetting : {}
```

### Modify the policy template

#### Modify the schedule

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To change the schedule, use the [Edit-AzDataProtectionPolicyTriggerClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytriggerclientobject) command.

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. Therefore, the schedule interval is "1" and the interval type is "Weekly".

```azurepowershell-interactive
$schDates = @(
	(
		(Get-Date -Year 2021 -Month 08 -Day 15 -Hour 22 -Minute 0 -Second 0)
	), 
	(
		(Get-Date -Year 2021 -Month 08 -Day 18 -Hour 22 -Minute 0 -Second 0)
	),
  (
		(Get-Date -Year 2021 -Month 08 -Day 20 -Hour 22 -Minute 0 -Second 0)
	)
)
$trigger = New-AzDataProtectionPolicyTriggerScheduleClientObject -ScheduleDays $schDates -IntervalType Weekly -IntervalCount 1 
Edit-AzDataProtectionPolicyTriggerClientObject -Schedule $trigger -Policy $policyDefn   
```

#### Add a new retention rule

So, if you want to add the _archive_ protection, you need to modify the policy template as below.

The default template will have a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is *moved* to *archive* datastore, that is, backup data is first copied to archive datastore, and then deleted in vault datastore. Also, the rule should define for how long the data is kept in the *archive* datastore. Use the [New-AzDataProtectionRetentionLifeCycleClientObject](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) command to create new lifecycles and use the [Edit-AzDataProtectionPolicyRetentionRuleClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject) command to associate them with new the rules or to the existing rules.

The following example creates a new retention rule named *Monthly* where the first successful backup of every month should be retained in vault for six months, moved to archive tier and kept in archive tier 24 months.

```azurepowershell-interactive
$VaultToArchiveLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 6 -TargetDataStore ArchiveStore -CopyOption CopyOnExpiryOption

$OnArchiveLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore ArchiveStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 24

Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $policyDefn -Name Monthly -LifeCycles $VaultToArchiveLifeCycle, $OnArchiveLifeCycleLifeCycle -IsDefault $false
```

#### Add a tag and the relevant criteria

Once a retention rule is created, you've to create a corresponding *tag* in the *Trigger* property of the backup policy. Use the [New-AzDataProtectionPolicyTagCriteriaClientObject](/powershell/module/az.dataprotection/new-azdataprotectionpolicytagcriteriaclientobject) command to create a new tagging criteria and use the [Edit-AzDataProtectionPolicyTagClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytagclientobject) command to update the existing tag or create a new tag.

The following example creates a new *tag* along with the criteria (which is the first successful backup of the month) with the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named *Monthly*.

```azurepowershell-interactive
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -AbsoluteCriteria FirstOfMonth
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

If the schedule is multiple backups per week (every Sunday, Wednesday, Thursday as specified in the above example) and you want to archive the Sunday and Friday backups, then the tagging criteria can be changed as follows:

```azurepowershell-interactive
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -DaysOfWeek @("Sunday", "Friday")
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

### Create a new PostgreSQL backup policy

Once the template is modified as per the requirements, use the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) command to create a policy using the modified template.

```azurepowershell-interactive
$polOss = New-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Name "TestOSSPolicy" -Policy $policyDefn
```

## Configure backup

Once the vault and policy are created, there are three critical points that you need to consider to protect an Azure PostgreSQL database.

### Key entities involved

#### PostgreSQL database to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL to be protected. This serves as the identifier of the database. We'll use an example of a database named **empdb11** under a PostgreSQL server **testposgresql**, which is present in the resource group **ossrg** under a different subscription.

```azurepowershell-interactive
$ossId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/servers/archive-postgresql-ccy/databases/empdb11"
```

#### Azure key vault

Azure Backup service doesn't store the username and password to connect to the PostgreSQL database. Instead, the backup admin seeds the *keys* into the key vault, and then the backup service will access the key vault, read the keys, and access the database. Note the secret identifier of the relevant key.

```azurepowershell-interactive
$keyURI = "https://testkeyvaulteus.vault.azure.net/secrets/ossdbkey"
```

#### Backup vault

You need to connect the Backup vault to the PostgreSQL server, and then access the database via the keys present in the key vault. So, it requires access to the PostgGreSQL server and the key vault. Access is granted to the Backup vault's MSI.

[Read about the appropriate permissions](./backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-backup) that you should grant to the Backup vault's MSI on the PostgreSQL server and the Azure key vault, where the keys to the database are stored.

### Prepare the request

Once all the relevant permissions are set, the configuration of the backup is performed in two steps.

1. We prepare the relevant request by using the relevant vault, policy, PostgreSQL database using the [Initialize-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) command.
1. We submit the request to protect the database using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) command.

```azurepowershell-interactive
$instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPostgreSQL -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId -SecretStoreURI $keyURI -SecretStoreType AzureKeyVault
ConvertTo-Json -InputObject $instance -Depth 4 
New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

Name                        Type                                         BackupInstanceName
----                        ----                                          ------------------
ossrg-empdb11       Microsoft.DataProtection/backupVaults/backupInstances ossrg-empdb11
```

## Run an on-demand backup

Fetch the relevant backup instance on which you need to trigger a backup using the [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command.

```azurepowershell-interactive
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId "xxxx-xxx-xxx" -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "BackupInstanceName"
```

You can specify a retention rule while triggering backup. To view the retention rules in policy, navigate through the policy object for retention rules. In the following example, the rule with name *default* is displayed. We'll use that rule for the on-demand backup.

```azurepowershell-interactive
$ossPol.PolicyRule | fl


BackupParameter           : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.AzureBackupParams
BackupParameterObjectType : AzureBackupParams
DataStoreObjectType       : DataStoreInfoBase
DataStoreType             : OperationalStore
Name                      : BackupHourly
ObjectType                : AzureBackupRule
Trigger                   : Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.ScheduleBasedTriggerContext
TriggerObjectType         : ScheduleBasedTriggerContext

IsDefault  : True
Lifecycle  : {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.SourceLifeCycle}
Name       : Default
ObjectType : AzureRetentionRule
```

To trigger an on-demand backup, use the [Backup-AzDataProtectionBackupInstanceAdhoc](/powershell/module/az.dataprotection/backup-azdataprotectionbackupinstanceadhoc) command.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"
```

## Track jobs

Track all jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use _Az.ResourceGraph_ to track all jobs across all backup vaults. Use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to fetch the relevant jobs that are across any backup vault.

```azurepowershell-interactive
  $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDisk -Operation OnDemandBackup
```

## Next steps

- [Restore Azure PostgreSQL database using Azure PowerShell](restore-managed-disks-ps.md)