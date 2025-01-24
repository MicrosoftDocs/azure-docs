---
title: Back up Azure Database for PostgreSQL - flexible server using Azure PowerShell
description: Learn how to back up Azure Database for PostgreSQL - flexible server using Azure PowerShell.
ms.topic: how-to
ms.date: 02/17/2025
ms.custom: devx-track-azurepowershell, ignite-2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Back up Azure Database for PostgreSQL - Flexible Server using Azure PowerShell

This article describes how to back up **Azure Database for PostgreSQL - Flexible Server** using Azure PowerShell.

Learn more about the [supported scenarios and limitations for Azure Database for PostgreSQL - flexible server backup](backup-azure-database-postgresql-flex-support-matrix.md).

## Create a Backup vault

Backup vault is a storage entity in Azure. This stores the backup data for new workloads that Azure Backup supports. For example, Azure Database for PostgreSQL – Flexible servers, blobs in a storage account, and Azure Disks. Backup vaults help to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data within the vault. Then proceed to create the Backup vault with that storage redundancy and the location.

In this article, let's create a Backup vault `TestBkpVault`, in the region `westus`, under the resource group `testBkpVaultRG`. Use the [`New-AzDataProtectionBackupVault`](/powershell/module/az.dataprotection/new-azdataprotectionbackupvault?view=azps-12.3.0&preserve-view=true) cmdlet to create a Backup vault. Learn more about [creating a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

```azurepowershell
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant/GeoRedundant -DataStoreType VaultStore
New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
$TestBKPVault | fl
ETag                :
Id                  : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/TestBkpVault
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

After the vault is created, let's create a Backup policy to protect Azure PostgreSQL – Flexible Server databases.

### Understand PostgreSQL – Flexible server backup policy

Disk backup offers multiple backups per day, and blob backup is a continuous backup with no trigger. Now, let's understand the backup policy object for PostgreSQL – Flexible Server.

- PolicyRule
  - BackupRule
    - BackupParameter
      - BackupType (A full database backup in this scenario)
      - Initial Datastore (Where the backups land initially)
      - Trigger (How the backup is triggered)
        - Schedule based
        - Default tagging criteria (a default 'tag' for all the scheduled backups. This tag links the backups to the retention rule)
  - Default Retention Rule (A rule that is applied to all backups, by default, on the initial datastore)

So, this object defines what type of backups are triggered, how they're triggered (via a schedule), what they're tagged with, where they land (a datastore), and the life cycle of the backup data in a datastore. The default PowerShell object for PostgreSQL – Flexible Server triggers a full backup every week and they reach the vault, where they're stored for *3 months*.

### Retrieve the Policy template

To understand the inner components of a backup policy for Azure PostgreSQL – Flexible server database backup, retrieve the policy template using the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) cmdlet. This cmdlet returns a default policy template for a given datasource type. Use this policy template to create a new policy.

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

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete, copy, move the backup). In Azure PostgreSQL – Flexible Server database backup, the default value for trigger is a scheduled **Weekly** trigger (one backup every 7 days) and to retain each backup for **3 months**.

```azurepowershell
JSON
$policyDefn.PolicyRule[0].Trigger | fl

ObjectType                    : ScheduleBasedTriggerContext
ScheduleRepeatingTimeInterval : {R/2021-08-22T02:00:00+00:00/P1W}
ScheduleTimeZone              : UTC
TaggingCriterion              : {Default}

```

**Default retention rule lifecycle:**:

```json
$policyDefn.PolicyRule[1].Lifecycle | fl

DeleteAfterDuration        : P3M
DeleteAfterObjectType      : AbsoluteDeleteOption
SourceDataStoreObjectType  : DataStoreInfoBase
SourceDataStoreType        : VaultStore
TargetDataStoreCopySetting : {}

```

### Modify the policy template

#### Modify the schedule

The default policy template offers a backup once per week. You can modify the schedule for the backup to happen multiple days per week. To modify the schedule, use the [`Edit-AzDataProtectionPolicyTriggerClientObject`](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytriggerclientobject) cmdlet.

The following example modifies the weekly backup to back up happening on every Sunday, Wednesday, and Friday of every week. The schedule date array mentions the dates, and the days of the week of those dates are taken as days of the week. Also, specify that these schedules should repeat every week. So, the schedule interval is *1* and the interval type is *Weekly*.

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

The default template has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule deletes the backup data after *3 months*. Use the [`New-AzDataProtectionRetentionLifeCycleClientObject`](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) cmdlet to create new lifecycles and use the [`Edit-AzDataProtectionPolicyRetentionRuleClientObject`](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject) cmdlet to associate them with the new rules or to the existing rules.

The following example creates a new retention rule named *Monthly*, where the first successful backup of every month should be retained in vault for *6 months*.

```azurepowershell
$VaultLifeCycle = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 6

Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $policyDefn -Name Monthly -LifeCycles $VaultLifeCycle -IsDefault $false

```

#### Add a tag and the relevant criteria

Once a retention rule is created, you've to create a corresponding *tag* in the *Trigger* property of the backup policy. Use the [New-AzDataProtectionPolicyTagCriteriaClientObject](/powershell/module/az.dataprotection/new-azdataprotectionpolicytagcriteriaclientobject) cmdlet to create a new tagging criteria and use the [Edit-AzDataProtectionPolicyTagClientObject](/powershell/module/az.dataprotection/edit-azdataprotectionpolicytagclientobject) cmdlet to update the existing tag or create a new tag.

The following example creates a new tag along with the criteria, the first successful backup of the month. The tag has the same name as the corresponding retention rule to be applied.

In this example, the tag criteria should be named *Monthly*.

```azurepowershell
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -AbsoluteCriteria FirstOfMonth
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria

```

If the schedule is multiple backups per week (every Sunday, Wednesday, Thursday as specified in the example) and you want to archive the Sunday and Friday backups, then the tagging criteria can be changed as follows, using the [`New-AzDataProtectionPolicyTagCriteriaClientObject`](/powershell/module/az.dataprotection/new-azdataprotectionpolicytagcriteriaclientobject?view=azps-12.3.0&preserve-view=true) cmdlet.
```azurepowershell
$tagCriteria = New-AzDataProtectionPolicyTagCriteriaClientObject -DaysOfWeek @("Sunday", "Friday")
Edit-AzDataProtectionPolicyTagClientObject -Policy $policyDefn -Name Monthly -Criteria $tagCriteria

```

### Create a new PostgreSQL - flexible server backup policy

Once the template is modified as per the requirements, use the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) cmdlet to create a policy using the modified template.

```azurepowershell
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault

```

## Configure backup

Once the vault and policy are created, consider the following  critical points to protect an Azure PostgreSQL - Flexible Server database:

- PostgreSQL – Flexible Server database for protection
- Backup vault to store the backup data
- Request for backup configuration

### Fetch the ID of the PostgreSQL - Flexible Server to be protected

Fetch the Azure Resource Manager ID (ARM ID) of PostgreSQL – Flexible Server to be protected. This ID serves as the identifier of the database. Let's use an example of a database named `empdb11` under a PostgreSQL - Flexible Server `testposgresql`, which is present in the resource group `ossrg` under a different subscription.

```azurepowershell
$ossId = "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/ossrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/archive-postgresql-ccy/databases/empdb11"
```

### Grant access to the Backup vault

Backup vault has to connect to the PostgreSQL – Flexible Server, and then access the database via the keys present in the key vault. So, it requires access to the PostgreSQL – Flexible Server and the key vault. Grant the required access to the Backup vault's **Managed Service Identity (MSI)**.

Check the [permissions](backup-azure-database-postgresql-flex-overview.md#permissions-for-backup) required for the Backup vault's **Managed Service Identity (MSI)** on the PostgreSQL – Flexible Server and Azure Key vault that stores keys to the database.

### Prepare the backup configuration request

Once all the relevant permissions are set, configure the backup by running following cmdlets:

1. Prepare the relevant request by using the relevant vault, policy, PostgreSQL - flexible Server using the [`Initialize-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell-interactive
    $instance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureDatabaseForPGFlexServer -DatasourceLocation $TestBkpvault.Location -PolicyId $polOss[0].Id -DatasourceId $ossId -SecretStoreURI $keyURI -SecretStoreType AzureKeyVault
    ConvertTo-Json -InputObject $instance -Depth 4 
    ```

1. Submit the request to protect the database server using the [`New-AzDataProtectionBackupInstance`](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) cmdlet.

    ```azurepowershell
    New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $instance

    Name                        Type                                         BackupInstanceName
    ----                        ----                                          ------------------
    ossrg-empdb11       Microsoft.DataProtection/backupVaults/backupInstances ossrg-empdb11

    ```

## Run an on-demand backup

Fetch the relevant backup instance on which you need to trigger a backup using the [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) cmdlet.

```azurepowershell
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e" -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "BackupInstanceName"

```

Specify a retention rule while triggering backup. To view the retention rules in policy, go to the policy object for retention rules. In the following example, the rule with name *default* appears. Let's use that rule for the on-demand backup.

```azurepowershell
Azure PowerShell
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

To trigger an on-demand backup, use the [`Backup-AzDataProtectionBackupInstanceAdhoc`](/powershell/module/az.dataprotection/backup-azdataprotectionbackupinstanceadhoc) cmdlet.

```azurepowershell
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"

```

## Track jobs

Track all jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) cmdlet. You can list all jobs and fetch a particular job detail.

You can also use the `Az.ResourceGraph` cmdlet to track all jobs across all Backup vaults. Use the  [`Search-AzDataProtectionJobInAzGraph`](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) cmdlet to fetch the relevant jobs that are across Backup vaults.

```azurepowershell
  $job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureDatabaseForPGFlexServer -Operation OnDemandBackup

```

## Next steps

- [Restore Azure Database for PostgreSQL - flexible server using Azure PowerShell](backup-azure-database-postgresql-flex-restore-powershell.md)
