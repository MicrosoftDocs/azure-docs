---
title: Back up Azure Database for PostgreSQL - flexible server using Azure PowerShell
description: Learn how to back up Azure Database for PostgreSQL - flexible server using Azure PowerShell.
ms.topic: how-to
ms.date: 10/01/2024
ms.custom: devx-track-azurepowershell, ignite-2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Database for PostgreSQL - flexible server using Azure PowerShell (preview)

This article explains how to back up **Azure PostgreSQL database** using Azure PowerShell.

In this article, you learn how to:

- Create a Backup vault

- Create a backup policy

- Configure a backup of an Azure Database for PostgreSQL - flexible server

- Run an on-demand backup job

For information on Azure Database for PostgreSQL - flexible server supported scenarios and limitations, see the [support matrix](backup-azure-database-postgresql-flex-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure. This stores the backup data for new workloads that Azure Backup supports. For example, Azure Database for PostgreSQL – Flexible servers, blobs in a storage account, and Azure Disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, we create a Backup vault *TestBkpVault*, in *westus* region, under the resource group *testBkpVaultRG*. Use the [New-AzDataProtectionBackupVault](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) command to create a Backup vault. Learn more about [creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

```azurepowershell
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore
New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
$TestBKPVault | fl
ETag                :
Id                  : /subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault
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

After the vault is created, let's create a Backup policy to protect Azure PostgreSQL – Flexible server databases.

## Create a backup policy

### Understand PostgreSQL – Flexible server backup policy

Let's understand the backup policy object for PostgreSQL – Flexible server.

-  PolicyRule
   -  BackupRule
      -  BackupParameter
         -  BackupType (A full server backup in this case)
         -  Initial Datastore (Where the backups land initially)
         -  Trigger (How the backup is triggered)
            -  Schedule based
            -  Default Tagging Criteria (A default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
   -  Default Retention Rule (A rule that is applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of the backup data in a datastore. The default object for PostgreSQL – Flexible server says to trigger a full backup _every week_ and they reach the vault, where they're stored for three months.

### Retrieving the Policy template

To understand the inner components of a backup policy for Azure PostgreSQL – Flexible server database backup, retrieve the policy template using the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurepowershell
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureDatabaseForPGFlexServer
$policyDefn | fl


DatasourceType : {Microsoft.DBforPostgreSQL/flexibleServers/databases}
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

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete/copy/move the backup). In Azure PostgreSQL – Flexible server database backup, the default value for trigger is a scheduled Weekly trigger (one backup every seven days) and to retain each backup for three months.

```azurepowershell
 $policyDefn.PolicyRule[0].Trigger | fl


ObjectType                    : ScheduleBasedTriggerContext
ScheduleRepeatingTimeInterval : {R/2021-08-22T02:00:00+00:00/P1W}
ScheduleTimeZone              : UTC
TaggingCriterion              : {Default}
```

```azurepowershell
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

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. Therefore, the schedule interval is "1" and the interval type is "Weekly."

```azurepowershell
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

The default template has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. Use the [New-AzDataProtectionRetentionLifeCycleClientObject](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) command to create new lifecycles and use the [Edit-AzDataProtectionPolicyRetentionRuleClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject) command to associate them with new the rules or to the existing rules.

The following example creates a new retention rule named *Monthly* where the first successful backup of every month should be retained in vault for six months.

```azurepowershell
$VaultLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 6

Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $policyDefn -Name Monthly -LifeCycles $VaultLifeCycle -IsDefault $false
```

#### Add a tag and the relevant criteria

Once a retention rule is created, you've to create a corresponding *tag* in the *Trigger* property of the backup policy. Use the [New-AzDataProtectionPolicyTagCriteriaClientObject](/powershell/module/az.dataprotection/new-azdataprotectionpolicytagcriteriaclientobject) command to create a new tagging criteria and use the [Edit-AzDataProtectionPolicyTagClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytagclientobject) command to update the existing tag or create a new tag.

The following example creates a new *tag* along with the criteria (which is the first successful backup of the month) with the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named *Monthly*.

```azurepowershell
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -AbsoluteCriteria FirstOfMonth
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

If the schedule is multiple backups per week (every Sunday, Wednesday, Thursday as specified in the example) and you want to archive the Sunday and Friday backups, then the tagging criteria can be changed as follows:

```azurepowershell
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -DaysOfWeek @("Sunday", "Friday")
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

### Create a new PostgreSQL - flexible server backup policy

Once the template is modified as per the requirements, use the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) command to create a policy using the modified template.

```azurepowershell
$polOss = New-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Name "TestOSSPolicy" -Policy $policyDefn
```

## Configure backup

Once the vault and policy are created, there are three critical points that you need to consider to protect an Azure PostgreSQL database.

### Key entities involved

#### PostgreSQL - flexible server to be protected

Fetch the Azure Resource Manager ID (Azure Resource Manager ID) of PostgreSQL - flexible server to be protected. This ID serves as the identifier of the database server. We use an example of PostgreSQL - flexible server **testpgflex**, which is present in the resource group **ossrg** under a different subscription.

```azurepowershell
$ossId = "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/testpgflex

#### Backup vault

You need to connect the Backup vault to the PostgreSQL - flexbile server. Access is granted to the Backup vault's MSI.

See the [permissions] (/backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) you should grant to the Managed System Identity (MSI) of the Backup Vault on the PostgreSQL - flexible server.

### Prepare the request

Once all the relevant permissions are set, the configuration of the backup is performed in two steps.

1. We prepare the relevant request by using the relevant vault, policy, PostgreSQL - flexible server using the [Initialize-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) command.
1. We submit the request to protect the database server using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) command.

```azurepowershell
$instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPostgreSQLFlexibleServer -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId ConvertTo-Json -InputObject $instance -Depth 4 

New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

Name                        Type                                         BackupInstanceName
----                        ----                                          ------------------
ossrg-testpgflex       Microsoft.DataProtection/backupVaults/backupInstances ossrg-testpgflex
```

## Run an on-demand backup

Fetch the relevant backup instance on which you need to trigger a backup using the [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command.

```azurepowershell
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e -ResourceGroupName testBkpVaultRG -VaultName $TestBkpVault.Name -Name BackupInstanceName
```

You can specify a retention rule while triggering backup. To view the retention rules in policy, navigate through the policy object for retention rules. In the following example, the rule with name *default* is displayed. We use that rule for the on-demand backup.

```azurepowershell
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

```azurepowershell
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"
```

## Track jobs

Track all jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use _Az.ResourceGraph_ to track all jobs across all backup vaults. Use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to fetch the relevant jobs that are across any backup vault.

```azurepowershell
  $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -Operation OnDemandBackup
```

## Next steps

- [Restore Azure Database for PostgreSQL - flexible server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md)
