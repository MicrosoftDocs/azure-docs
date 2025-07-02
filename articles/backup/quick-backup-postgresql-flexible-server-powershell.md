---
title: "Quickstart: Create a backup policy for an Azure PostgreSQL - Flexible Server using PowerShell"
description: Learn how to create a backup policy for your Azure PostgreSQL - Flexible Server with PowerShell.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 02/28/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to create a backup policy for Azure Database for PostgreSQL - Flexible Server using PowerShell, so that I can ensure reliable data protection and recovery according to our organization's standards."
---

# Quickstart: Create a backup policy for Azure Database for PostgreSQL - Flexible Server using Azure PowerShell

This quickstart describes how to create a backup policy to protect Azure Database for PostgreSQL - Flexible Server using Azure PowerShell.

Azure Backup policy for Azure Database for PostgreSQL - Flexible Server defines how and when backups are created, the retention period for recovery points, and the rules for data protection and recovery. [Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible Server using multiple clients, such as [Azure portal](tutorial-create-first-backup-azure-database-postgresql-flex.md), [PowerShell](back-up-azure-database-postgresql-flex-backup-powershell.md), [CLI](back-up-azure-database-postgresql-flex-backup-cli.md), [Azure Resource Manager](quick-backup-postgresql-flexible-server-arm.md), [Bicep](quick-backup-postgresql-flexible-server-bicep.md), [Terraform](quick-backup-postgresql-flexible-server-terraform.md), and so on. 

## Prerequisites

Before you create a backup policy for Azure Database for PostgreSQL Flexible Server, ensure that the following prerequisites are met:

- Review the [supported scenarios and limitations for backing up Azure Database for PostgreSQL - Flexible Servers](backup-azure-database-postgresql-flex-support-matrix.md).
- [Create a Backup vault](back-up-azure-database-postgresql-flex-backup-powershell.md#create-a-backup-vault) to store the recovery points for the database.

## Create a backup policy

To create a backup policy for  PostgreSQL – Flexible Server, follow these steps:

1. Understand PostgreSQL - Flexible Server backup policy
1. Retrieve the policy template
1. Modify the policy template
1. Create the policy

### Understand PostgreSQL – Flexible Server backup policy

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

So, this object defines:

- The type of backups triggered
- The way the policy are triggered (via a schedule)
- The tags implemented to the Backup policy
- The location where the data is stored (a datastore)
- The life cycle of the backup data in a datastore

 The default PowerShell object for PostgreSQL – Flexible Server triggers a full backup every week and they reach the vault, where they're stored for *three months*.

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

The policy template consists of a trigger (which decides what triggers the backup) and a lifecycle (which decides when to delete, copy, move the backup). In Azure PostgreSQL – Flexible Server database backup, the default value for trigger is a scheduled **Weekly** trigger (one backup every 7 days) and to retain each backup for **three months**.

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

The default template has a lifecycle for the initial datastore under the default retention rule. In this scenario, the rule deletes the backup data after *three months*. Use the [`New-AzDataProtectionRetentionLifeCycleClientObject`](/powershell/module/az.dataprotection/new-azdataprotectionretentionlifecycleclientobject) cmdlet to create new lifecycles and use the [`Edit-AzDataProtectionPolicyRetentionRuleClientObject`](/powershell/module/az.dataprotection/edit-azdataprotectionpolicyretentionruleclientobject) cmdlet to associate them with the new rules or to the existing rules.

The following example creates a new retention rule named *Monthly*, where the first successful backup of every month should be retained in vault for *six months*.

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

### Create the policy

Once the template is modified as per the requirements, use the [New-AzDataProtectionBackupPolicy](/powershell/module/az.dataprotection/new-azdataprotectionbackuppolicy) cmdlet to create a policy using the modified template.

```azurepowershell
az dataprotection backup-policy create --backup-policy-name FinalOSSPolicy --policy AddedRetentionRuleAndTag.JSON --resource-group testBkpVaultRG --vault-name TestBkpVault

```

## Next steps

[Configure backup for Azure Database for PostgreSQL - flexible server using Azure PowerShell](back-up-azure-database-postgresql-flex-backup-powershell.md#configure-backup).

