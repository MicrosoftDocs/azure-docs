---
title: Azure Monitor PowerShell quick start samples. | Microsoft Docs
description: Use PowerShell to access Azure Monitor features such as autoscale, alerts, webhooks and searching Activity logs.
author: kamathashwin
manager: carolz
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: c0761814-7148-4ab5-8c27-a2c9fa4cfef5
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/06/2017
ms.author: ashwink

---
# Azure Monitor PowerShell quick start samples
This article shows you sample PowerShell commands to help you access Azure Monitor features. Azure Monitor allows you to AutoScale Cloud Services, Virtual Machines, and Web Apps and to send alert notifications or call web URLs based on values of configured telemetry data.

> [!NOTE]
> Azure Monitor is the new name for what was called "Azure Insights" until Sept 25th, 2016. However, the namespaces and thus the commands below still contain the "insights".
> 
> 

## Set up PowerShell
If you haven't already, set up PowerShell to run on your computer. For more information, see [How to Install and Configure PowerShell](/powershell/azure/overview) .

## Examples in this article
The examples in the article illustrate how you can use Azure Monitor cmdlets. You can also review the entire list of Azure Monitor PowerShell cmdlets at [Azure Monitor (Insights) Cmdlets](https://msdn.microsoft.com/library/azure/mt282452#40v=azure.200#41.aspx).

## Sign in and use subscriptions
First, log into your Azure subscription.

```PowerShell
Login-AzureRmAccount
```

This requires you to sign in. Once you do, your Account, TenantId and default Subscription Id are displayed. All the Azure cmdlets work in the context of your default subscription. To view the list of subscriptions you have access to, use the following command.

```PowerShell
Get-AzureRmSubscription
```

To change your working context to a different subscription, use the following command.

```PowerShell
Set-AzureRmContext -SubscriptionId <subscriptionid>
```


## Retrieve Activity log for a subscription
Use the `Get-AzureRmLog` cmdlet.  Below are some common examples.

Get log entries from this time/date to present:

```PowerShell
Get-AzureRmLog -StartTime 2016-03-01T10:30
```

Get log entries between a time/date range:

```PowerShell
Get-AzureRmLog -StartTime 2015-01-01T10:30 -EndTime 2015-01-01T11:30
```

Get log entries from a specific resource group:

```PowerShell
Get-AzureRmLog -ResourceGroup 'myrg1'
```

Get log entries from a specific resource provider between a time/date range:

```PowerShell
Get-AzureRmLog -ResourceProvider 'Microsoft.Web' -StartTime 2015-01-01T10:30 -EndTime 2015-01-01T11:30
```

Get all log entries with a specific caller:

```PowerShell
Get-AzureRmLog -Caller 'myname@company.com'
```

The following command retrieves the last 1000 events from the activity log:

```PowerShell
Get-AzureRmLog -MaxEvents 1000
```

`Get-AzureRmLog` supports many other parameters. See the `Get-AzureRmLog` reference for more information.

> [!NOTE]
> `Get-AzureRmLog` only provides 15 days of history. Using the **-MaxEvents** parameter allows you to query the last N events, beyond 15 days. To access events older than 15 days, use the REST API or SDK (C# sample using the SDK). If you do not include **StartTime**, then the default value is **EndTime** minus one hour. If you do not include **EndTime**, then the default value is current time. All times are in UTC.
> 
> 

## Retrieve alerts history
To view all alert events, you can query the Azure Resource Manager logs using the following examples.

```PowerShell
Get-AzureRmLog -Caller "Microsoft.Insights/alertRules" -DetailedOutput -StartTime 2015-03-01
```

To view the history for a specific alert rule, you can use the `Get-AzureRmAlertHistory` cmdlet, passing in the resource ID of the alert rule.

```PowerShell
Get-AzureRmAlertHistory -ResourceId /subscriptions/s1/resourceGroups/rg1/providers/microsoft.insights/alertrules/myalert -StartTime 2016-03-1 -Status Activated
```

The `Get-AzureRmAlertHistory` cmdlet supports various parameters. More information, see [Get-AlertHistory](https://msdn.microsoft.com/library/mt282453.aspx).

## Retrieve information on alert rules
All of the following commands act on a Resource Group named "montest".

View all the properties of the alert rule:

```PowerShell
Get-AzureRmAlertRule -Name simpletestCPU -ResourceGroup montest -DetailedOutput
```

Retrieve all alerts on a resource group:

```PowerShell
Get-AzureRmAlertRule -ResourceGroup montest
```

Retrieve all alert rules set for a target resource. For example, all alert rules set on a VM.

```PowerShell
Get-AzureRmAlertRule -ResourceGroup montest -TargetResourceId /subscriptions/s1/resourceGroups/montest/providers/Microsoft.Compute/virtualMachines/testconfig
```

`Get-AzureRmAlertRule` supports other parameters. See [Get-AlertRule](https://msdn.microsoft.com/library/mt282459.aspx) for more information.

## Create alert rules
You can use the `Add-AlertRule` cmdlet to create, update or disable an alert rule.

You can create email and webhook properties using  `New-AzureRmAlertRuleEmail` and `New-AzureRmAlertRuleWebhook`, respectively. In the Alert rule cmdlet, assign these as actions to the **Actions** property of the Alert Rule.

The next section contains a sample that shows you how to create an Alert Rule with various parameters.

### Alert rule on a metric
The following table describes the parameters and values used to create an alert using a metric.

| parameter | value |
| --- | --- |
| Name |simpletestdiskwrite |
| Location of this alert rule |East US |
| ResourceGroup |montest |
| TargetResourceId |/subscriptions/s1/resourceGroups/montest/providers/Microsoft.Compute/virtualMachines/testconfig |
| MetricName of the alert that is created |\PhysicalDisk(_Total)\Disk Writes/sec. See the `Get-MetricDefinitions` cmdlet below about how to retrieve the exact metric names |
| operator |GreaterThan |
| Threshold value (count/sec in for this metric) |1 |
| WindowSize (hh:mm:ss format) |00:05:00 |
| aggregator (statistic of the metric, which uses Average count, in this case) |Average |
| custom emails (string array) |'foo@example.com','bar@example.com' |
| send email to owners, contributors and readers |-SendToServiceOwners |

Create an Email action

```PowerShell
$actionEmail = New-AzureRmAlertRuleEmail -CustomEmail myname@company.com
```

Create a Webhook action

```PowerShell
$actionWebhook = New-AzureRmAlertRuleWebhook -ServiceUri https://example.com?token=mytoken
```

Create the alert rule on the CPU% metric on a classic VM

```PowerShell
Add-AzureRmMetricAlertRule -Name vmcpu_gt_1 -Location "East US" -ResourceGroup myrg1 -TargetResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.ClassicCompute/virtualMachines/my_vm1 -MetricName "Percentage CPU" -Operator GreaterThan -Threshold 1 -WindowSize 00:05:00 -TimeAggregationOperator Average -Actions $actionEmail, $actionWebhook -Description "alert on CPU > 1%"
```

Retrieve the alert rule

```PowerShell
Get-AzureRmAlertRule -Name vmcpu_gt_1 -ResourceGroup myrg1 -DetailedOutput
```

The Add alert cmdlet also updates the rule if an alert rule already exists for the given properties. To disable an alert rule, include the parameter **-DisableRule**.

### Alert on activity log event
> [!NOTE]
> This feature is in preview and will be removed at some point in the future (it is being replaced).
> 
> 

In this scenario, you'll send email when a website is successfully started in my subscription in resource group *abhingrgtest123*.

Setup an email rule

```PowerShell
$actionEmail = New-AzureRmAlertRuleEmail -CustomEmail myname@company.com
```

Setup a webhook rule

```PowerShell
$actionWebhook = New-AzureRmAlertRuleWebhook -ServiceUri https://example.com?token=mytoken
```

Create the rule on the event

```PowerShell
Add-AzureRmLogAlertRule -Name superalert1 -Location "East US" -ResourceGroup myrg1 -OperationName microsoft.web/sites/start/action -Status Succeeded -TargetResourceGroup abhingrgtest123 -Actions $actionEmail, $actionWebhook
```

Retrieve the alert rule

```PowerShell
Get-AzureRmAlertRule -Name superalert1 -ResourceGroup myrg1 -DetailedOutput
```

The `Add-AlertRule` cmdlet allows various other parameters. More information, see [Add-AlertRule](https://msdn.microsoft.com/library/mt282468.aspx).

## Get a list of available metrics for alerts
You can use the `Get-AzureRmMetricDefinition` cmdlet to view the list of all metrics for a specific resource.

```PowerShell
Get-AzureRmMetricDefinition -ResourceId <resource_id>
```

The following example generates a table with the metric Name and the Unit for it.

```PowerShell
Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit
```

A full list of available options for `Get-AzureRmMetricDefinition` is available at [Get-MetricDefinitions](https://msdn.microsoft.com/library/mt282458.aspx).

## Create and manage AutoScale settings
A resource, such as a Web app, VM, Cloud Service or VM Scale Set can have only one autoscale setting configured for it.
However, each autoscale setting can have multiple profiles. For example, one for a performance-based scale profile and a second one for a schedule based profile. Each profile can have multiple rules configured on it. For more information about Autoscale, see [How to Autoscale an Application](../cloud-services/cloud-services-how-to-scale.md).

Here are the steps we will use:

1. Create rule(s).
2. Create profile(s) mapping the rules that you created previously to the profiles.
3. Optional: Create notifications for autoscale by configuring webhook and email properties.
4. Create an autoscale setting with a name on the target resource by mapping the profiles and notifications that you created in the previous steps.

The following examples show you how you can create an Autoscale setting for a VM scale set for a Windows operating system based by using the CPU utilization metric.

First, create a rule to scale-out, with an instance count increase .

```PowerShell
$rule1 = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -Operator GreaterThan -MetricStatistic Average -Threshold 60 -TimeGrain 00:01:00 -TimeWindow 00:10:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Increase -ScaleActionValue 1
```        

Next, create a rule to scale-in, with an instance count decrease.

```PowerShell
$rule2 = New-AzureRmAutoscaleRule -MetricName "Percentage CPU" -MetricResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -Operator GreaterThan -MetricStatistic Average -Threshold 30 -TimeGrain 00:01:00 -TimeWindow 00:10:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Decrease -ScaleActionValue 1
```

Then, create a profile for the rules.

```PowerShell
$profile1 = New-AzureRmAutoscaleProfile -DefaultCapacity 2 -MaximumCapacity 10 -MinimumCapacity 2 -Rules $rule1,$rule2 -Name "My_Profile"
```

Create a webhook property.

```PowerShell
$webhook_scale = New-AzureRmAutoscaleWebhook -ServiceUri "https://example.com?mytoken=mytokenvalue"
```

Create the notification property for the autoscale setting, including email and the webhook that you created previously.

```PowerShell
$notification1= New-AzureRmAutoscaleNotification -CustomEmails ashwink@microsoft.com -SendEmailToSubscriptionAdministrators SendEmailToSubscriptionCoAdministrators -Webhooks $webhook_scale
```

Finally, create the autoscale setting to add the profile that you created above.

```PowerShell
Add-AzureRmAutoscaleSetting -Location "East US" -Name "MyScaleVMSSSetting" -ResourceGroup big2 -TargetResourceId /subscriptions/s1/resourceGroups/big2/providers/Microsoft.Compute/virtualMachineScaleSets/big2 -AutoscaleProfiles $profile1 -Notifications $notification1
```

For more information about managing Autoscale settings, see [Get-AutoscaleSetting](https://msdn.microsoft.com/library/mt282461.aspx).

## Autoscale history
The following example shows you how you can view recent autoscale and alert events. Use the activity log search to view the autoscale history.

```PowerShell
Get-AzureRmLog -Caller "Microsoft.Insights/autoscaleSettings" -DetailedOutput -StartTime 2015-03-01
```

You can use the `Get-AzureRmAutoScaleHistory` cmdlet to retrieve AutoScale history.

```PowerShell
Get-AzureRmAutoScaleHistory -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/microsoft.insights/autoscalesettings/myScaleSetting -StartTime 2016-03-15 -DetailedOutput
```

For more information, see [Get-AutoscaleHistory](https://msdn.microsoft.com/library/mt282464.aspx).

### View details for an autoscale setting
You can use the `Get-Autoscalesetting` cmdlet to retrieve more information about the autoscale setting.

The following example shows details about all autoscale settings in the resource group 'myrg1'.

```PowerShell
Get-AzureRmAutoscalesetting -ResourceGroup myrg1 -DetailedOutput
```

The following example shows details about all autoscale settings in the resource group 'myrg1' and specifically the autoscale setting named 'MyScaleVMSSSetting'.

```PowerShell
Get-AzureRmAutoscalesetting -ResourceGroup myrg1 -Name MyScaleVMSSSetting -DetailedOutput
```

### Remove an autoscale setting
You can use the `Remove-Autoscalesetting` cmdlet to delete an autoscale setting.

```PowerShell
Remove-AzureRmAutoscalesetting -ResourceGroup myrg1 -Name MyScaleVMSSSetting
```

## Manage log profiles for activity log
You can create a *log profile* and export data from your activity log to a storage account and you can configure data retention for it. Optionally, you can also stream the data to your Event Hub. Note that this feature is currently in Preview and you can only create one log profile per subscription. You can use the following cmdlets with your current subscription to create and manage log profiles. You can also choose a particular subscription. Although PowerShell defaults to the current subscription, you can always change that using `Set-AzureRmContext`. You can configure activity log to route data to any storage account or Event Hub within that subscription. Data is written as blob files in JSON format.

### Get a log profile
To fetch your existing log profiles, use the `Get-AzureRmLogProfile` cmdlet.

### Add a log profile without data retention
```PowerShell
Add-AzureRmLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -Locations global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia
```

### Remove a log profile
```PowerShell
Remove-AzureRmLogProfile -name my_log_profile_s1
```

### Add a log profile with data retention
You can specify the **-RetentionInDays** property with the number of days, as a positive integer, where the data is retained.

```PowerShell
Add-AzureRmLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -Locations global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia -RetentionInDays 90
```

### Add log profile with retention and EventHub
In addition to routing your data to storage account, you can also stream it to an Event Hub. Note that in this preview release and the storage account configuration is mandatory but Event Hub configuration is optional.

```PowerShell
Add-AzureRmLogProfile -Name my_log_profile_s1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Locations global,westus,eastus,northeurope,westeurope,eastasia,southeastasia,japaneast,japanwest,northcentralus,southcentralus,eastus2,centralus,australiaeast,australiasoutheast,brazilsouth,centralindia,southindia,westindia -RetentionInDays 90
```

## Configure diagnostics logs
Many Azure services provide additional logs and telemetry that can be configured to save data in your Azure Storage account, send to Event Hubs, and/or sent to an OMS Log Analytics workspace. That operation can only be performed at a resource level and the storage account or event hub should be present in the same region as the target resource where the diagnostics setting is configured.

### Get diagnostic setting
```PowerShell
Get-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp
```

Disable diagnostic setting

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $false
```

Enable diagnostic setting without retention

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $true
```

Enable diagnostic setting with retention

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Logic/workflows/andy0315logicapp -StorageAccountId /subscriptions/s1/resourceGroups/Default-Storage-WestUS/providers/Microsoft.Storage/storageAccounts/mystorageaccount -Enable $true -RetentionEnabled $true -RetentionInDays 90
```

Enable diagnostic setting with retention for a specific log category

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/sakteststorage -Categories NetworkSecurityGroupEvent -Enable $true -RetentionEnabled $true -RetentionInDays 90
```

Enable diagnostic setting for Event Hubs

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Enable $true
```

Enable diagnostic setting for OMS

```PowerShell
Set-AzureRmDiagnosticSetting -ResourceId /subscriptions/s1/resourceGroups/insights-integration/providers/Microsoft.Network/networkSecurityGroups/viruela1 -WorkspaceId 76d785fd-d1ce-4f50-8ca3-858fc819ca0f -Enabled $true

```
