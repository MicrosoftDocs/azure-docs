---
title: Configure autoscale using PowerShell
description: Configure autoscale for a Virtual Machine Scale Set using PowerShell
author: EdB-MSFT
ms.author: edbaynash
ms.topic: how-to
ms.date: 01/05/2023
ms.subservice: autoscale
ms.custom: devx-track-azurepowershell
ms.reviewer: akkumari
# Customer intent: As a user or dev ops administrator, I want to use powershell to set up autoscale so I can scale my VMSS.
---

# Configure autoscale with PowerShell

Autoscale settings help ensure that you have the right amount of resources running to handle the fluctuating load of your application. You can configure autoscale using the Azure portal, Azure CLI, PowerShell or ARM or Bicep templates.  

This article shows you how to configure autoscale for a Virtual Machine Scale Set with PowerShell, using the following steps:

+ Create a scale set that you can autoscale
+ Create rules to scale in and scale out
+ Create a profile that uses your rules
+ Apply the autoscale settings
+ Update your autoscale settings with notifications

## Prerequisites  

To configure autoscale using PowerShell, you need an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free).

## Set up your environment

```azurepowershell
#Set the subscription Id, VMSS name, and resource group name
$subscriptionId = (Get-AzContext).Subscription.Id
$resourceGroupName="rg-powershell-autoscale"
$vmssName="vmss-001"
```

## Create a Virtual Machine Scale Set

Create a scale set using the following cmdlets. Set the `$resourceGroupName` and `$vmssName` variables to suite your environment.

```azurepowershell
# create a new resource group
New-AzResourceGroup -ResourceGroupName $resourceGroupName -Location "EastUS"

# Create login credentials for the VMSS
$vmPassword = ConvertTo-SecureString "ChangeThisPassword1" -AsPlainText -Force
$vmCred = New-Object System.Management.Automation.PSCredential('azureuser', $vmPassword)


New-AzVmss `
 -ResourceGroupName $resourceGroupName `
 -Location "EastUS" `
 -VMScaleSetName $vmssName `
 -Credential $vmCred `
 -VirtualNetworkName "myVnet" `
 -SubnetName "mySubnet" `
 -PublicIpAddressName "myPublicIPAddress" `
 -LoadBalancerName "myLoadBalancer" `
 -OrchestrationMode "Flexible"

```

## Create autoscale settings

To create autoscale setting using PowerShell, follow the sequence below:

1. Create rules using `New-AzAutoscaleScaleRuleObject`
1. Create a profile using `New-AzAutoscaleProfileObject`
1. Create the autoscale settings using `New-AzAutoscaleSetting`
1. Update the settings using `Update-AzAutoscaleSetting`

### Create rules

Create scale in and scale out rules then associated them with a profile.
Rules are created using the [`New-AzAutoscaleScaleRuleObject`](/powershell/module/az.monitor/new-azautoscalescaleruleobject).

The following PowerShell script creates two rules.

+ Scale out when Percentage CPU exceeds 70%
+ Scale in when Percentage CPU is less than 30%

```azurepowershell

$rule1=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "Percentage CPU" `
    -MetricTriggerMetricResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"  `
    -MetricTriggerTimeGrain ([System.TimeSpan]::New(0,1,0)) `
    -MetricTriggerStatistic "Average" `
    -MetricTriggerTimeWindow ([System.TimeSpan]::New(0,5,0)) `
    -MetricTriggerTimeAggregation "Average" `
    -MetricTriggerOperator "GreaterThan" `
    -MetricTriggerThreshold 70 `
    -MetricTriggerDividePerInstance $false `
    -ScaleActionDirection "Increase" `
    -ScaleActionType "ChangeCount" `
    -ScaleActionValue 1 `
    -ScaleActionCooldown ([System.TimeSpan]::New(0,5,0))


$rule2=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "Percentage CPU" `
    -MetricTriggerMetricResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"  `
    -MetricTriggerTimeGrain ([System.TimeSpan]::New(0,1,0)) `
    -MetricTriggerStatistic "Average" `
    -MetricTriggerTimeWindow ([System.TimeSpan]::New(0,5,0)) `
    -MetricTriggerTimeAggregation "Average" `
    -MetricTriggerOperator "LessThan" `
    -MetricTriggerThreshold 30 `
    -MetricTriggerDividePerInstance $false `
    -ScaleActionDirection "Decrease" `
    -ScaleActionType "ChangeCount" `
    -ScaleActionValue 1 `
    -ScaleActionCooldown ([System.TimeSpan]::New(0,5,0))
```
The table below describes the parameters used in the `New-AzAutoscaleScaleRuleObject` cmdlet.

|Parameter| Description|
|---|---|
|`MetricTriggerMetricName` |Sets the autoscale trigger metric 
|`MetricTriggerMetricResourceUri`| Specifies the resource that the `MetricTriggerMetricName` metric belongs to. `MetricTriggerMetricResourceUri` can be any resource and not just the resource that's being scaled. For example, you can scale your Virtual Machine Scale Sets based on metrics created by a load balancer, database, or the scale set itself. The `MetricTriggerMetricName` must exist for the specified `MetricTriggerMetricResourceUri`.
|`MetricTriggerTimeGrain`|The sampling frequency of the metric that the rule monitors. `MetricTriggerTimeGrain` must be one of the predefined values for the specified metric and must be between 12 hours and 1 minute. For example, `MetricTriggerTimeGrain` = *PT1M*"* means that the metrics are sampled every 1 minute and aggregated using the aggregation method specified in `MetricTriggerStatistic`.
|`MetricTriggerTimeAggregation` | The aggregation method within the timeGrain period. For example, statistic = "Average" and timeGrain = "PT1M" means that the metrics are aggregated every 1 minute by taking the average.
|`MetricTriggerStatistic` |The aggregation method used to aggregate the sampled metrics. For example, TimeAggregation = "Average" aggregates the sampled metrics by taking the average.
|`MetricTriggerTimeWindow` | The amount of time that the autoscale engine looks back to aggregate the metric. This value must be greater than the delay in metric collection, which varies by resource. It must be between 5 minutes and 12 hours. For example, 10 minutes means that every time autoscale runs, it queries metrics for the past 10 minutes. This feature allows your metrics to stabilize and avoids reacting to transient spikes.
|`MetricTriggerThreshold`|Defines the value of the metric that triggers a scale event.
|`MetricTriggerOperator` |Specifies the logical comparative operating to use when evaluating the metric value.
|`MetricTriggerDividePerInstance`| When set to `true` divides the trigger metric by the total number of instances. For example, If message count is 300 and there are 5 instances running, the calculated metric value is 60 messages per instance. This property isn't applicable for all metrics.
| `ScaleActionDirection`| Specify scaling in or out. Valid values are `Increase` and `Decrease`.
|`ScaleActionType` |Scale by a specific number of instances, scale to a specific instance count, or scale by percentage of the current instance count. Valid values include `ChangeCount`, `ExactCount`, and `PercentChangeCount`.
|`ScaleActionCooldown`| The minimum amount of time to wait between scale operations. This is to allow the metrics to stabilize and avoids [flapping](./autoscale-flapping.md). For example, if `ScaleActionCooldown` is 10 minutes and a scale operation just occurred, Autoscale won't attempt to scale again for 10 minutes.


### Create a default autoscale profile and associate the rules

After defining the scale rules, create a profile. The profile specifies the default, upper, and lower instance count limits, and the times that the associated rules can be applied. Use the [`New-AzAutoscaleProfileObject`](/powershell/module/az.monitor/new-azautoscaleprofileobject) cmdlet to create a new autoscale profile. As this is a default profile, it doesn't have any schedule parameters. The default profile is active at times that no other profiles are active

```azurepowershell
$defaultProfile=New-AzAutoscaleProfileObject `
    -Name "default" `
    -CapacityDefault 1 `
    -CapacityMaximum 10 `
    -CapacityMinimum 1 `
    -Rule $rule1, $rule2
```

The table below describes the parameters used in the `New-AzAutoscaleProfileObject` cmdlet.

|Parameter|Description|
|---|---|
|`CapacityDefault`| The number of instances that are if metrics aren't available for evaluation. The default is only used if the current instance count is lower than the default.
| `CapacityMaximum` |The maximum number of instances for the resource. The maximum number of instances is further limited by the number of cores that are available in the subscription.
| `CapacityMinimum` |The minimum number of instances for the resource.
|`FixedDateEnd`| The end time for the profile in ISO 8601 format for.
|`FixedDateStart` |The start time for the profile in ISO 8601 format.
| `Rule` |A collection of rules that provide the triggers and parameters for the scaling action when this profile is active. A maximum of 10, comma separated rules can be specified.
|`RecurrenceFrequency` | How often the scheduled profile takes effect. This value must be `week`. 
|`ScheduleDay`| A collection of days that the profile takes effect on when specifying a recurring schedule. Possible values are Sunday through Saturday. For more information on recurring schedules, see [Add a recurring profile using CLI](./autoscale-multiprofile.md?tabs=powershell#add-a-recurring-profile-using-powershell)
|`ScheduleHour`| A collection of hours that the profile takes effect on. Values supported are 0 to 23.
|`ScheduleMinute`| A collection of minutes at which the profile takes effect.
|`ScheduleTimeZone` |The timezone for the hours of the profile.

### Apply the autoscale settings

After fining the rules and profile, apply the autoscale settings using  [`New-AzAutoscaleSetting`](/powershell/module/az.monitor/new-azautoscalesetting). To update existing autoscale setting use [`Update-AzAutoscaleSetting`](/powershell/module/az.monitor/add-azautoscalesetting)

```azurepowershell
New-AzAutoscaleSetting `
    -Name vmss-autoscalesetting1 `
    -ResourceGroupName $resourceGroupName `
    -Location eastus `
    -Profile $defaultProfile `
    -Enabled `
    -PropertiesName "vmss-autoscalesetting1" `
    -TargetResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"
```

### Add notifications to your autoscale settings  

Add notifications to your sale setting to trigger a webhook or send email notifications when a scale event occurs.
For more information on webhook notifications, see [`New-AzAutoscaleWebhookNotificationObject`](/powershell/module/az.monitor/new-azautoscalewebhooknotificationobject)

Set a webhook using the following cmdlet;
```azurepowershell

  $webhook1=New-AzAutoscaleWebhookNotificationObject -Property @{} -ServiceUri "http://contoso.com/webhook1"
```

Configure the notification using the webhook and set up email notification using the [`New-AzAutoscaleNotificationObject`](/powershell/module/az.monitor/new-azautoscalenotificationobject) cmdlet:

```azurepowershell

    $notification1=New-AzAutoscaleNotificationObject `
    -EmailCustomEmail "jason@contoso.com" `
    -EmailSendToSubscriptionAdministrator $true `
    -EmailSendToSubscriptionCoAdministrator $true `
    -Webhook $webhook1
```

Update your autoscale settings to apply the notification

```azurepowershell

Update-AzAutoscaleSetting  `
    -Name vmss-autoscalesetting1 `
    -ResourceGroupName $resourceGroupName `
    -Profile $defaultProfile `
    -Notification $notification1 `
    -TargetResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"  

```

## Review your autoscale settings

To review your autoscale settings, load the settings into a variable using `Get-AzAutoscaleSetting` then output the variable as follows:

```azurepowershell
    $autoscaleSetting=Get-AzAutoscaleSetting  -ResourceGroupName $resourceGroupName -Name vmss-autoscalesetting1 
    $autoscaleSetting | Select-Object -Property *
```

Get your autoscale history using `AzAutoscaleHistory`
```azurepowershell
Get-AzAutoscaleHistory -ResourceId  /subscriptions/<subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName
```

## Scheduled and recurring profiles

### Add a scheduled profile for a special event

Set up autoscale profiles to scale differently for specific events. For example, for a day when demand will be higher than usual, create a profile with increased maximum and minimum instance limits.

The following example uses the same rules as the default profile defined above, but sets new instance limits for a specific date. You can also configure different rules to be used with the new profile.

```azurepowershell
$highDemandDay=New-AzAutoscaleProfileObject `
    -Name "High-demand-day" `
    -CapacityDefault 7 `
    -CapacityMaximum 30 `
    -CapacityMinimum 5 `
    -FixedDateEnd ([System.DateTime]::Parse("2023-12-31T14:00:00Z")) `
    -FixedDateStart ([System.DateTime]::Parse("2023-12-31T13:00:00Z")) `
    -FixedDateTimeZone "UTC" `
    -Rule $rule1, $rule2

Update-AzAutoscaleSetting  `
    -Name vmss-autoscalesetting1 `
    -ResourceGroupName $resourceGroupName `
    -Profile $defaultProfile, $highDemandDay `
    -Notification $notification1 `
    -TargetResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"  

```

### Add a recurring scheduled profile

Recurring profiles let you schedule a scaling profile that repeats each week. For example, scale to a single instance on the weekend from Friday night to Monday morning.

While scheduled profiles have a start and end date, recurring profiles don't have an end time. A profile remains active until the next profile's start time. Therefore, when you create a recurring profile you must create a recurring default profile that starts when you want the previous recurring profile to finish.

For example, to configure a weekend profile that starts on Friday nights and ends on Monday mornings, create a profile that starts on Friday night, then create recurring profile with your default settings that starts on Monday morning.

The following script creates a weekend profile and an addition default profile to end the weekend profile.
```azurepowershell
$fridayProfile=New-AzAutoscaleProfileObject `
    -Name "Weekend" `
    -CapacityDefault 1 `
    -CapacityMaximum 1 `
    -CapacityMinimum 1 `
    -RecurrenceFrequency week  `
    -ScheduleDay "Friday" `
    -ScheduleHour 22  `
    -ScheduleMinute 00  `
    -ScheduleTimeZone  "Pacific Standard Time" `
    -Rule $rule1, $rule2


$defaultRecurringProfile=New-AzAutoscaleProfileObject `
    -Name "default recurring profile" `
    -CapacityDefault 2 `
    -CapacityMaximum 10 `
    -CapacityMinimum 2 `
    -RecurrenceFrequency week  `
    -ScheduleDay "Monday" `
    -ScheduleHour 00  `
    -ScheduleMinute 00  `
    -ScheduleTimeZone  "Pacific Standard Time" `
    -Rule $rule1, $rule2

New-AzAutoscaleSetting  `
    -Location eastus `
    -Name vmss-autoscalesetting1 `
    -ResourceGroupName $resourceGroupName `
    -Profile $defaultRecurringProfile, $fridayProfile `
    -Notification $notification1 `
    -TargetResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"  

```

For more information on scheduled profiles, see [Autoscale with multiple profiles](./autoscale-multiprofile.md)

## Other autoscale commands

For a complete list of PowerShell cmdlets for autoscale, see the [PowerShell Module Browser](/powershell/module/?term=azautoscale)

## Clean up resources

To clean up the resources you created in this tutorial, delete the resource group that you created. 
The following cmdlet deletes the resource group and all of its resources.
```azurecli

Remove-AzResourceGroup -Name $resourceGroupName

```
