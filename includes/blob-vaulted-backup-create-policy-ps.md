---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

> [!IMPORTANT]
> Before you create the policy and configure backups for Azure Blobs, see the prerequisites. 

To retrieve the policy template, use the [Get-AzDataProtectionPolicyTemplate](/powershell/module/az.dataprotection/get-azdataprotectionpolicytemplate) command. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

`$defaultPol = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureBlob`

To create a vaulted backup policy, define the schedule and retention for backups. The following commands create a backup policy with backup frequency every week on Friday and Tuesday at 10 AM and default retention of 3 months.

```azurepowershell-interactive
$schDates = @( 

( 

    (Get-Date -Year 2023 -Month 08 -Day 18 -Hour 10 -Minute 0 -Second 0) 

), 

( 

    (Get-Date -Year 2023 -Month 08 -Day 22 -Hour 10 -Minute 0 -Second 0)  

)) 
 

$trigger =  New-AzDataProtectionPolicyTriggerScheduleClientObject -ScheduleDays $schDates -IntervalType Weekly -IntervalCount 1 

Edit-AzDataProtectionPolicyTriggerClientObject -Schedule $trigger -Policy $defaultPol  


$lifeCycleVault = New-AzDataProtectionRetentionLifeCycleClientObject -SourceDataStore VaultStore -SourceRetentionDurationType Months -SourceRetentionDurationCount 3  

 Edit-AzDataProtectionPolicyRetentionRuleClientObject -Policy $defaultPol -Name Default -LifeCycles $lifeCycleVault -IsDefault $true 

 New-AzDataProtectionBackupPolicy -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -ResourceGroupName "resourceGroupName" -VaultName "vaultName" -Name "MyPolicy" -Policy $defaultPol 
```


 

 
