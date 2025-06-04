---
title: Back Up PostgreSQL Databases by Using Azure PowerShell
description: Learn how to back up Azure Database for PostgreSQL by using Azure PowerShell.
ms.topic: how-to
ms.date: 05/20/2025
ms.custom:
  - devx-track-azurepowershell
  - build-2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to back up PostgreSQL databases using PowerShell so that I can ensure data protection and manage backup policies efficiently."
---

# Back up PostgreSQL databases by using Azure PowerShell

This article describes how to back up  [Azure Database for PostgreSQL](/azure/postgresql/overview#azure-database-for-postgresql---single-server) by using Azure PowerShell. You can also configure backup using [Azure portal](backup-azure-database-postgresql.md), [Azure CLI](backup-postgresql-cli.md), and [REST API](backup-azure-data-protection-use-rest-api-backup-postgresql.md) for PostgreSQL databases. 

Learn more about the [supported scenarios](backup-azure-database-postgresql-support-matrix.md) and [frequently asked questions](/azure/backup/backup-azure-database-postgresql-server-faq) for backing up PostgreSQL databases in Azure Database for PostgreSQL.

## Create a Backup vault

A Backup vault is a storage entity in Azure. It stores the backup data for various new workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers, Azure disks, and Azure blobs. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, you create a Backup vault named `TestBkpVault`, in the `westus` region, under the resource group `testBkpVaultRG`. Use the [`New-AzDataProtectionBackupVault`](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault) command to create a Backup vault. [Learn more about creating a Backup vault](./create-manage-backup-vault.md#create-a-backup-vault).

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

## Create a backup policy

After you create a vault, you can create a backup policy to help protect PostgreSQL databases. You can also [create a backup policy for PostgreSQL databases using REST API](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md).

### Understand the PostgreSQL backup policy

Whereas disk backup offers multiple backups per day and blob backup is a *continuous* backup with no trigger, PostgreSQL backup offers archive protection. The backup data that's first sent to the vault can be moved to the archive tier in accordance with a defined rule or a life cycle.

In this context, the following hierarchy can help you understand the backup policy object for PostgreSQL:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all scheduled backups to the retention rule)
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)

The policy object defines what types of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of their data in a datastore.

The default PowerShell object for PostgreSQL says to trigger a *full* backup every week. The backups reach the vault, where they're stored for three months.

If you want to add the archive tier to the policy, you have to decide when the data will be moved from the vault to the archive, how long the data will stay in the archive, and which of the scheduled backups should be tagged as archivable. You have to add a retention rule that defines the life cycle of the backup data from the vault datastore to the archive datastore. The retention rule also defines how long the backup data will stay in the archive datastore. Then you need to add a tag that marks the scheduled backups as eligible to be archived.

The resultant PowerShell object is as follows:

- Policy rule
  - Backup rule
    - Backup parameter
      - Backup type (a full database backup in this case)
      - Initial datastore (where the backups land initially)
      - Trigger (how the backup is triggered)
        - Schedule
        - Default tagging criteria (a default tag that links all the scheduled backups to the retention rule)
        - New tagging criteria for the new retention rule with the same name
  - Default retention rule (a rule that's applied to all backups, by default, on the initial datastore)
  - New retention rule
    - Life cycle
      - Source datastore
      - Time period for deletion in the source datastore
      - Copy to the target datastore

### Retrieve the policy template

To understand the inner components of a backup policy for PostgreSQL database backup, retrieve the policy template by using the [`Get-AzDataProtectionPolicyTemplate`](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) command. This command returns the default policy template for a data-source type. Use this policy template to create a new policy.

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

The policy template consists of a trigger (which decides what triggers the backup) and a life cycle (which decides when to delete, copy, or move the backup). In a PostgreSQL database backup, the default value for the trigger is a scheduled weekly trigger (one backup every seven days). Each backup is retained for three months.

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

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To change the schedule, use the [`Edit-AzDataProtectionPolicyTriggerClientObject`](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytriggerclientobject) command.

The following example modifies the weekly backup to Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week for those dates are taken as days of the week. You also need to specify that these schedules should repeat every week. So, the schedule interval is `1` and the interval type is `Weekly`.

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

If you want to add archive protection, you need to modify the policy template.

The default template has a life cycle for the initial datastore under the default retention rule. In this scenario, the rule says to delete the backup data after three months. You should add a new retention rule that defines when the data is moved to the archive datastore. That is, backup data is first copied to the archive datastore, and then it's deleted in the vault datastore.

Also, the rule should define how long to keep the data in the archive datastore. To create new life cycles, use the [`New-AzDataProtectionRetentionLifeCycleClientObject`](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) command. To associate those life cycles with new or existing rules, use the [`Edit-AzDataProtectionPolicyRetentionRuleClientObject`](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject) command.

The following example creates a new retention rule named `Monthly`. In this rule, the first successful backup of every month is retained in the vault for six months, moved to the archive tier, and kept in the archive tier for 24 months.

```azurepowershell-interactive
$VaultToArchiveLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 6 -TargetDataStore ArchiveStore -CopyOption CopyOnExpiryOption

$OnArchiveLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore ArchiveStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 24

Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $policyDefn -Name Monthly -LifeCycles $VaultToArchiveLifeCycle, $OnArchiveLifeCycleLifeCycle -IsDefault $false
```

#### Add a tag and the relevant criteria

After you create a retention rule, you have to create a corresponding tag in the `Trigger` property of the backup policy. To create new tagging criteria, use the [`New-AzDataProtectionPolicyTagCriteriaClientObject`](/powershell/module/az.dataprotection/new-azdataprotectionpolicytagcriteriaclientobject) command. To update the existing tag or create a new tag, use the [Edit-AzDataProtectionPolicyTagClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytagclientobject) command.

The following example creates a new tag along with the criteria, which is the first successful backup of the month. The tag has the same name as the corresponding retention rule to be applied.

In this example, the tag criteria are named `Monthly`:

```azurepowershell-interactive
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -AbsoluteCriteria FirstOfMonth
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

If the schedule is multiple backups per week (every Sunday, Wednesday, and Thursday, as specified in the preceding example) and you want to archive the Sunday and Friday backups, you can change the tagging criteria as follows:

```azurepowershell-interactive
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -DaysOfWeek @("Sunday", "Friday")
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria
```

### Create a new PostgreSQL backup policy

After you modify the template according to the requirements, use the [`New-AzDataProtectionBackupPolicy`](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) command to create a policy by using the modified template:

```azurepowershell-interactive
$polOss = New-AzDataProtectionBackupPolicy -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Name "TestOSSPolicy" -Policy $policyDefn
```

## Configure backup

After you create the vault and policy, you need to consider three critical points to back up a PostgreSQL database in Azure Database for PostgreSQL.

### Understand key entities

#### PostgreSQL database to be backed up

Fetch the Resource Manager ID of the PostgreSQL database to be backed up. This ID serves as the identifier of the database. The following example uses a database named `empdb11` under the PostgreSQL server `testposgresql`, which is present in the resource group `ossrg` under a different subscription:

```azurepowershell-interactive
$ossId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/servers/archive-postgresql-ccy/databases/empdb11"
```

#### Key vault

The Azure Backup service doesn't store the username and password to connect to the PostgreSQL database. Instead, the backup admin seeds the *keys* into the key vault. The Azure Backup service then accesses the key vault, reads the keys, and accesses the database. Note the secret identifier of the relevant key.

```azurepowershell-interactive
$keyURI = "https://testkeyvaulteus.vault.azure.net/secrets/ossdbkey"
```

#### Backup vault

You need to connect the Backup vault to the PostgreSQL server and then access the database via the keys present in the key vault. So, the Backup vault requires access to the PostgreSQL server and the key vault. Access is granted to the Backup vault's managed identity.

[Read about the appropriate permissions](./backup-azure-database-postgresql-overview.md#permissions-needed-for-postgresql-database-backup) that you should grant to the Backup vault's managed identity on the PostgreSQL server and Azure Key Vault, where the keys to the database are stored.

### Prepare the request

After you set all the relevant permissions, perform the configuration of the backup in two steps:

1. Prepare the request by using the relevant vault, policy, and PostgreSQL database in the [`Initialize-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) command.
1. Submit the request to back up the database by using the [`New-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) command.

```azurepowershell-interactive
$instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPostgreSQL -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId -SecretStoreURI $keyURI -SecretStoreType AzureKeyVault
ConvertTo-Json -InputObject $instance -Depth 4 
New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

Name                        Type                                         BackupInstanceName
----                        ----                                          ------------------
ossrg-empdb11       Microsoft.DataProtection/backupVaults/backupInstances ossrg-empdb11
```

## Run an on-demand backup

Fetch the relevant backup instance on which you need to trigger a backup by using the [`Get-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command:

```azurepowershell-interactive
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId "xxxx-xxx-xxx" -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "BackupInstanceName"
```

You can specify a retention rule while triggering a backup. To view the retention rules in a policy, browse through the policy object. In the following example, the rule with the name `Default` is displayed. This article uses that example rule for the on-demand backup.

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

To trigger an on-demand backup, use the [`Backup-AzDataProtectionBackupInstanceAdhoc`](/powershell/module/az.dataprotection/backup-azdataprotectionbackupinstanceadhoc) command:

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"
```

## Track jobs

Track all jobs by using the [`Get-AzDataProtectionJob`](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use `Az.ResourceGraph` to track all jobs across all Backup vaults. Use the [`Search-AzDataProtectionJobInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to fetch the relevant jobs across any Backup vault:

```azurepowershell-interactive
  $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDisk -Operation OnDemandBackup
```

## Related content

- [Restore a PostgreSQL database using Azure PowerShell](restore-postgresql-database-ps.md).
- Restore a PostgreSQL database using [Azure portal](restore-azure-database-postgresql.md), [Azure CLI](restore-postgresql-database-cli.md), and [REST API](restore-postgresql-database-use-rest-api.md).
