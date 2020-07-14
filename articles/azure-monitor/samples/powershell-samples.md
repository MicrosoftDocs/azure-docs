---
title: Azure Monitor PowerShell samples
description: Use PowerShell to access Azure Monitor features such as autoscale, alerts, webhooks and searching Activity logs.
ms.subservice: ""
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 2/14/2018

---

# Azure Monitor PowerShell samples
This article shows you sample PowerShell commands to help you access Azure Monitor features.

> [!NOTE]
> Azure Monitor is the new name for what was called "Azure Insights" until Sept 25th, 2016. However, the namespaces and thus the following commands still contain the word *insights*.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Set up PowerShell
If you haven't already, set up PowerShell to run on your computer. For more information, see [How to Install and Configure PowerShell](/powershell/azure/overview).

## Examples in this article
The examples in the article illustrate how you can use Azure Monitor cmdlets. You can also review the entire list of Azure Monitor PowerShell cmdlets at [Azure Monitor (Insights) Cmdlets](https://docs.microsoft.com/powershell/module/az.applicationinsights).

## Sign in and use subscriptions
First, log in to your Azure subscription.

```powershell
Connect-AzAccount
```

You'll see a sign in screen. Once you sign in your Account, TenantID, and default Subscription ID are displayed. All the Azure cmdlets work in the context of your default subscription. To view the list of subscriptions you have access to, use the following command:

```powershell
Get-AzSubscription
```

To see your working context (which subscription your commands are run against), use the following command:

```powershell
Get-AzContext
```
To change your working context to a different subscription, use the following command:

```powershell
Set-AzContext -SubscriptionId <subscriptionid>
```


## Retrieve Activity log for a subscription
Use the [Get-AzLog](https://docs.microsoft.com/powershell/module/az.monitor/get-azlog) cmdlet.  The following are some common examples. The Activity Log holds the last 90 days of operations. Using dates before this time results in an error message.  

See what the current date/time are to verify what times to use in the commands below:
```powershell
Get-Date
```

Get log entries from this time/date to present:

```powershell
Get-AzLog -StartTime 2019-03-01T10:30
```

Get log entries between a time/date range:

```powershell
Get-AzLog -StartTime 2019-01-01T10:30 -EndTime 2015-01-01T11:30
```

Get log entries from a specific resource group:

```powershell
Get-AzLog -ResourceGroup 'myrg1'
```

Get log entries from a specific resource provider between a time/date range:

```powershell
Get-AzLog -ResourceProvider 'Microsoft.Web' -StartTime 2015-01-01T10:30 -EndTime 2015-01-01T11:30
```

Get all log entries with a specific caller:

```powershell
Get-AzLog -Caller 'myname@company.com'
```

The following command retrieves the last 1000 events from the activity log:

```powershell
Get-AzLog -MaxRecord 10
```

`Get-AzLog` supports many other parameters. See the `Get-AzLog` reference for more information.

> [!NOTE]
> `Get-AzLog` only provides 15 days of history. Using the **-MaxRecords** parameter allows you to query the last N events, beyond 15 days. To access events older than 15 days, use the REST API or SDK (C# sample using the SDK). If you do not include **StartTime**, then the default value is **EndTime** minus one hour. If you do not include **EndTime**, then the default value is current time. All times are in UTC.
> 
> 

## Retrieve alerts history
To view all alert events, you can query the Azure Resource Manager logs using the following examples.

```powershell
Get-AzLog -Caller "Microsoft.Insights/alertRules" -DetailedOutput -StartTime 2015-03-01
```

To view the history for a specific alert rule, you can use the `Get-AzAlertHistory` cmdlet, passing in the resource ID of the alert rule.

```powershell
Get-AzAlertHistory -ResourceId /subscriptions/s1/resourceGroups/rg1/providers/microsoft.insights/alertrules/myalert -StartTime 2016-03-1 -Status Activated
```

The `Get-AzAlertHistory` cmdlet supports various parameters. More information, see [Get-AlertHistory](https://msdn.microsoft.com/library/mt282453.aspx).

## Retrieve information on alert rules
All of the following commands act on a Resource Group named "montest".

View all the properties of the alert rule:

```powershell
Get-AzAlertRule -Name simpletestCPU -ResourceGroup montest -DetailedOutput
```

Retrieve all alerts on a resource group:

```powershell
Get-AzAlertRule -ResourceGroup montest
```

Retrieve all alert rules set for a target resource. For example, all alert rules set on a VM.

```powershell
Get-AzAlertRule -ResourceGroup montest -TargetResourceId /subscriptions/s1/resourceGroups/montest/providers/Microsoft.Compute/virtualMachines/testconfig
```

`Get-AzAlertRule` supports other parameters. See [Get-AlertRule](https://msdn.microsoft.com/library/mt282459.aspx) for more information.

## Create metric alerts
You can use the `Add-AlertRule` cmdlet to create, update, or disable an alert rule.

You can create email and webhook properties using  `New-AzAlertRuleEmail` and `New-AzAlertRuleWebhook`, respectively. In the Alert rule cmdlet, assign these properties as actions to the **Actions** property of the Alert Rule.

The following table describes the parameters and values used to create an alert using a metric.

| parameter | value |
| --- | --- |
| Name |simpletestdiskwrite |
| Location of this alert rule |East US |
| ResourceGroup |montest |
| TargetResourceId |/subscriptions/s1/resourceGroups/montest/providers/Microsoft.Compute/virtualMachines/testconfig |
| MetricName of the alert that is created |\PhysicalDisk(_Total)\Disk Writes/sec. See the `Get-MetricDefinitions` cmdlet about how to retrieve the exact metric names |
| operator |GreaterThan |
| Threshold value (count/sec in for this metric) |1 |
| WindowSize (hh:mm:ss format) |00:05:00 |
| aggregator (statistic of the metric, which uses Average count, in this case) |Average |
| custom emails (string array) |'foo@example.com','bar@example.com' |
| send email to owners, contributors and readers |-SendToServiceOwners |

Create an Email action

```powershell
$actionEmail = New-AzAlertRuleEmail -CustomEmail myname@company.com
```

Create a Webhook action

```powershell
$actionWebhook = New-AzAlertRuleWebhook -ServiceUri https://example.com?token=mytoken
```

Create the alert rule on the CPU% metric on a classic VM

```powershell
Add-AzMetricAlertRule -Name vmcpu_gt_1 -Location "East US" -ResourceGroup myrg1 -TargetResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.ClassicCompute/virtualMachines/my_vm1 -MetricName "Percentage CPU" -Operator GreaterThan -Threshold 1 -WindowSize 00:05:00 -TimeAggregationOperator Average -Action $actionEmail, $actionWebhook -Description "alert on CPU > 1%"
```

Retrieve the alert rule

```powershell
Get-AzAlertRule -Name vmcpu_gt_1 -ResourceGroup myrg1 -DetailedOutput
```

The Add alert cmdlet also updates the rule if an alert rule already exists for the given properties. To disable an alert rule, include the parameter **-DisableRule**.

## Get a list of available metrics for alerts
You can use the `Get-AzMetricDefinition` cmdlet to view the list of all metrics for a specific resource.

```powershell
Get-AzMetricDefinition -ResourceId <resource_id>
```

The following example generates a table with the metric Name and the Unit for it.

```powershell
Get-AzMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

A full list of available options for `Get-AzMetricDefinition` is available at [Get-MetricDefinitions](https://msdn.microsoft.com/library/mt282458.aspx).

## Create and manage Activity Log alerts
You can use the `Set-AzActivityLogAlert` cmdlet to set an Activity Log alert. An Activity Log alert requires that you first define your conditions as a dictionary of conditions, then create an alert that uses those conditions.

```powershell

$condition1 = New-AzActivityLogAlertCondition -Field 'category' -Equal 'Administrative'
$condition2 = New-AzActivityLogAlertCondition -Field 'operationName' -Equal 'Microsoft.Compute/virtualMachines/write'
$additionalWebhookProperties = New-Object "System.Collections.Generic.Dictionary``2[System.String,System.String]"
$additionalWebhookProperties.Add('customProperty', 'someValue')
$actionGrp1 = New-AzActionGroup -ActionGroupId '/subscriptions/<subid>/providers/Microsoft.Insights/actiongr1' -WebhookProperty $additionalWebhookProperties
Set-AzActivityLogAlert -Location 'Global' -Name 'alert on VM create' -ResourceGroupName 'myResourceGroup' -Scope '/subscriptions/<subid>' -Action $actionGrp1 -Condition $condition1, $condition2

```

The additional webhook properties are optional. You can get back the contents of an Activity Log Alert using `Get-AzActivityLogAlert`.

## Create and manage AutoScale settings
A resource (a Web app, VM, Cloud Service, or Virtual Machine Scale Set) can have only one autoscale setting configured for it.
However, each autoscale setting can have multiple profiles. For example, one for a performance-based scale profile and a second one for a schedule-based profile. Each profile can have multiple rules configured on it. For more information about Autoscale, see [How to Autoscale an Application](../../cloud-services/cloud-services-how-to-scale-portal.md).

Here are the steps to use:

1. Create rule(s).
2. Create profile(s) mapping the rules that you created previously to the profiles.
3. Optional: Create notifications for autoscale by configuring webhook and email properties.
4. Create an autoscale setting with a name on the target resource by mapping the profiles and notifications that you created in the previous steps.

The following examples show you how you can create an Autoscale setting for a Virtual Machine Scale Set for a Windows operating system based by using the CPU utilization metric.

First, create a rule to scale out, with an instance count increase.

```powershell
$rule1 = New-AzAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -Operator GreaterThan -MetricStatistic Average -Threshold 60 -TimeGrain 00:01:00 -TimeWindow 00:10:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Increase -ScaleActionValue 1
```        

Next, create a rule to scale in, with an instance count decrease.

```powershell
$rule2 = New-AzAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -Operator GreaterThan -MetricStatistic Average -Threshold 30 -TimeGrain 00:01:00 -TimeWindow 00:10:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Decrease -ScaleActionValue 1
```

Then, create a profile for the rules.

```powershell
$profile1 = New-AzAutoscaleProfile -DefaultCapacity 2 -MaximumCapacity 10 -MinimumCapacity 2 -Rules $rule1,$rule2 -Name "My_Profile"
```

Create a webhook property.

```powershell
$webhook_scale = New-AzAutoscaleWebhook -ServiceUri "https://example.com?mytoken=mytokenvalue"
```

Create the notification property for the autoscale setting, including email and the webhook that you created previously.

```powershell
$notification1= New-AzAutoscaleNotification -CustomEmails ashwink@microsoft.com -SendEmailToSubscriptionAdministrators SendEmailToSubscriptionCoAdministrators -Webhooks $webhook_scale
```

Finally, create the autoscale setting to add the profile that you created previously. 

```powershell
Add-AzAutoscaleSetting -Location "East US" -Name "MyScaleVMSSSetting" -ResourceGroup big2 -TargetResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -AutoscaleProfiles $profile1 -Notifications $notification1
```

For more information about managing Autoscale settings, see [Get-AutoscaleSetting](https://msdn.microsoft.com/library/mt282461.aspx).

## Autoscale history
The following example shows you how you can view recent autoscale and alert events. Use the activity log search to view the autoscale history.

```powershell
Get-AzLog -Caller "Microsoft.Insights/autoscaleSettings" -DetailedOutput -StartTime 2015-03-01
```

You can use the `Get-AzAutoScaleHistory` cmdlet to retrieve AutoScale history.

```powershell
Get-AzAutoScaleHistory -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/microsoft.insights/autoscalesettings/myScaleSetting -StartTime 2016-03-15 -DetailedOutput
```

For more information, see [Get-AutoscaleHistory](https://msdn.microsoft.com/library/mt282464.aspx).

### View details for an autoscale setting
You can use the `Get-Autoscalesetting` cmdlet to retrieve more information about the autoscale setting.

The following example shows details about all autoscale settings in the resource group 'myrg1'.

```powershell
Get-AzAutoscalesetting -ResourceGroup myrg1 -DetailedOutput
```

The following example shows details about all autoscale settings in the resource group 'myrg1' and specifically the autoscale setting named 'MyScaleVMSSSetting'.

```powershell
Get-AzAutoscalesetting -ResourceGroup myrg1 -Name MyScaleVMSSSetting -DetailedOutput
```

### Remove an autoscale setting
You can use the `Remove-Autoscalesetting` cmdlet to delete an autoscale setting.

```powershell
Remove-AzAutoscalesetting -ResourceGroup myrg1 -Name MyScaleVMSSSetting
```

## Manage log profiles for activity log
You can create a *log profile* and export data from your activity log to a storage account and you can configure data retention for it. Optionally, you can also stream the data to your Event Hub. This feature is currently in Preview and you can only create one log profile per subscription. You can use the following cmdlets with your current subscription to create and manage log profiles. You can also choose a particular subscription. Although PowerShell defaults to the current subscription, you can always change that using `Set-AzContext`. You can configure activity log to route data to any storage account or Event Hub within that subscription. Data is written as blob files in JSON format.

### Get a log profile
To fetch your existing log profiles, use the `Get-AzLogProfile` cmdlet.

### Add a log profile without data retention
```powershell
Add-AzLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -Location global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia
```

### Remove a log profile
```powershell
Remove-AzLogProfile -name my_log_profile_s1
```

### Add a log profile with data retention
You can specify the **-RetentionInDays** property with the number of days, as a positive integer, where the data is retained.

```powershell
Add-AzLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -Location global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia -RetentionInDays 90
```

### Add log profile with retention and EventHub
In addition to routing your data to storage account, you can also stream it to an Event Hub. In this preview release the storage account configuration is mandatory but Event Hub configuration is optional.

```powershell
Add-AzLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Location global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia -RetentionInDays 90
```

## Configure diagnostics logs
Many Azure services provide additional logs and telemetry that can do one or more of the following: 
 - be configured to save data in your Azure Storage account
 - sent to Event Hubs
 - sent to a Log Analytics workspace. 

The operation can only be performed at a resource level. The storage account or event hub should be present in the same region as the target resource where the diagnostics setting is configured.

### Get diagnostic setting
```powershell
Get-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp
```

Disable diagnostic setting

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $false
```

Enable diagnostic setting without retention

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $true
```

Enable diagnostic setting with retention

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $true -RetentionEnabled $true -RetentionInDays 90
```

Enable diagnostic setting with retention for a specific log category

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/sakteststorage -Categories NetworkSecurityGroupEvent -Enable $true -RetentionEnabled $true -RetentionInDays 90
```

Enable diagnostic setting for Event Hubs

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Enable $true
```

Enable diagnostic setting for Log Analytics

```powershell
Set-AzDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -WorkspaceId /subscriptions/s1/resourceGroups/insights-integration/providers/providers/microsoft.operationalinsights/workspaces/myWorkspace -Enabled $true

```

Note that the WorkspaceId property takes the *resource ID* of the workspace. You can obtain the resource ID of your Log Analytics workspace using the following command:

```powershell
(Get-AzOperationalInsightsWorkspace).ResourceId

```

These commands can be combined to send data to multiple destinations.

