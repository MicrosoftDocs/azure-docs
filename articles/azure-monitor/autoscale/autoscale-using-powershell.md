---
title: Configure autoscale with PowerShell
description: Configure autoscale for a Virtal Machine Scale Set using PowerShell
author: EdB-MSFT
ms.author: edbaynash
ms.topic: how-to
ms.date: 01/05/2023
ms.subservice: autoscale
ms.reviewer: akkumari

# Customer intent: As a user or dev ops administrator, I want to use powershell to set up autoscale so I can scale my VMSS.


1-sentence Intro to autoscale
Benefits of using Poowershell to configurye autoscale
Prereqs 
  - give powershell to create VMSS ? ( how do they create load ?)
  - Windows or linux ? ( linux) 
  - provide a vm image ? (git , galery ?  which user owns it ?)
  - assume VMSS exists ?
  - create an image - too complicated

Define the scenario 
scripts  to create the objects.
For each Object define what is required with example


---

# Configure autoscale with PowerShell
    
Autoscale settings help ensure that you have the right amount of resources running to handle the fluctuating load of your application.Cyou can configure autoscale using the Azure portal, Azure CLI, PowerShell or ARM or Bicep templates. 

This article shows you haw to configure autoscale for a Virtual Machine Scale Set using Powershell

## Prerequisites 

To configure autoscale using PowerShell, you need an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free).

## Overview

+ Start by creating a scale set that you can autoscle
+ Create rules to scale in and scale out
+ Create a profile that uses your rules
+ Apply the autoscale settings
+ Make some changes
+ Update your autoscale settings

## Create a Virtual Machine Scale Set

Create a scale set using the following commands

```azurepowershell

$vmPassword = ConvertTo-SecureString "ChangeThisPassword1" -AsPlainText -Force
$vmCred = New-Object System.Management.Automation.PSCredential('azureuser', $vmPassword)

$resourceGroupName="rg-powershell-autoscale"
$VMSSName="vmss-001"

# create a new resource group

New-AzResourceGroup -ResourceGroupName $resourceGroupName -Location "EastUS"

New-AzVmss `
  -ResourceGroupName $resourceGroupName `
  -Location "EastUS" `
  -VMScaleSetName $VMSSName `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic"


New-AzVmss `
  -ResourceGroupName $resourceGroupName `
  -Location "EastUS" `
  -VMScaleSetName $VMSSName `
  -Credential $vmCred `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic" `
```

## Create autoscale settings.

To create autoscale setting using Powershell, follow the sequence below:
1. Create rules using `New-AzAutoscaleScaleRuleObject`
1. Create a profile using `New-AzAutoscaleProfileObject`
1. Create or update the autoscale settings using `Update-AzAutoscaleSetting`

### Create rules

Create scale in and scale out rules then associated them with a profile.
Rules are created using the [`New-AzAutoscaleScaleRuleObject`](https://learn.microsoft.com/powershell/module/az.monitor/new-azautoscalescaleruleobject).

The wolloing Powershell script created two rules.

+ Scale out when Percentage CPU exceeds 70%
+ Scale in when Percentage CPU is less than 30%

```azurepowershell

$resourceGroupName="rg-powershell-autoscale"
$VMSSName="vmss-001"

$rule1=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "Percentage CPU" `
    -MetricTriggerMetricResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$VMSSName"  `
    -MetricTriggerTimeGrain ([System.TimeSpan]::New(0,1,0)) `
    -MetricTriggerStatistic "Average" `
    -MetricTriggerTimeWindow ([System.TimeSpan]::New(0,5,0)) `
    -MetricTriggerTimeAggregation "Average" `
    -MetricTriggerOperator "GreaterThan" `
    -MetricTriggerThreshold 70 `
    -MetricTriggerDividePerInstance $false `
    -ScaleActionDirection "Increase" 
    -ScaleActionType "ChangeCount" ` 
    -ScaleActionValue 1 `
    -ScaleActionCooldown ([System.TimeSpan]::New(0,5,0))


$rule2=New-AzAutoscaleScaleRuleObject `
-MetricTriggerMetricName "Percentage CPU" `
-MetricTriggerMetricResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/$VMSSName"  `
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

### Common parameters

Set the autoscale trigger metric using `MetricTriggerMetricName` and `MetricTriggerMetricResourceUri`. The `MetricTriggerMetricResourceUri` can be any resource and not just the resource that is being scaled. For example, you can scale your VMSS based on metrics created by a load balancer, database, or the VMSS itself. The `MetricTriggerMetricName` must exist for the specified `MetricTriggerMetricResourceUri`.

`MetricTriggerTimeGrain` is the sampling frequency of the metric that the rule monitors. `MetricTriggerTimeGrain` must be one of the predefined values for the specified metric and must be between 12 hours and 1 minute. For example, `MetricTriggerTimeGrain` = *PT1M*"* means that the metrics are sampled every 1 minute and aggregated using the aggregation method specified in `MetricTriggerStatistic`.

`MetricTriggerTimeAggregation` is the aggregation method within the timeGrain period. For example, statistic = "Average" and timeGrain = "PT1M" means that the metrics will be aggregated every 1 minute by taking the average.

`MetricTriggerStatistic` is the aggregation method used to aggregate the sampled metrics. For example, TimeAggregation = "Average" will aggregate the sampled metrics by taking the average.

`MetricTriggerTimeWindow` is amount of time that the autoscale engine looks back to aggregate the metric. This value must be greater than the delay in metric collection, which varies by resource. It must be between 5 minutes and 12 hours. For example, 10 minutes means that every time autoscale runs, it queries metrics for the past 10 minutes. This allows your metrics to stabilize and avoids reacting to transient spikes.

`MetricTriggerThreshold` defines the value of the metric that triggers a scale event.

`MetricTriggerOperator` specifies the logical comparative operating to use when evaluating the metric value.

`MetricTriggerDividePerInstance`, when st to `true` divides the trigger metric by the total number of instances. Gor example, If message count is 300 and there are 5 instances running, the calculated metric value is 60 messages per instance. This property isn't applicable for all metrics.

Specify scaling in or out using `ScaleActionDirection`. Valid values are *Increase* and *Decrease*

Use `ScaleActionType` to scale by a number of instance, to a specific instance count, or by percentage of the current instance count. Valid value include `ChangeCount`, `ExactCount`, and `PercentChangeCount`.

`ScaleActionValue` spefices the value of the `ScaleActionType` to scale the reource by, for example, When `ScaleActionType` is *PercentChangeCount* setting `ScaleActionValue` to *50* scales the resource by 50% of the current instance count.

`ScaleActionCooldown` is the minimum amount of time to wait between scale operations. This is to allow the metrics to stabilize and avoiuds [flapping](./autoscale-flapping.md). For example, if `ScaleActionCooldown` is 10 minutes and a scale operation just occurred, Autoscale won't attempt to scale again for 10 minutes.


### Create an autoscale profile and associate the rules

After defining the scale rules, create a profile. The profile specifies the default, upper, and lower instance count limits, and the times that the associated rules can be applied. Use thew [`New-AzAutoscaleProfileObject`](https://learn.microsoft.com/powershell/module/az.monitor/new-azautoscaleprofileobject) command to create a new autoscale profile. 

```azurecli
$profile1=New-AzAutoscaleProfileObject `
    -Name "profile1" `
    -CapacityDefault 1 `
    -CapacityMaximum 10 `
    -CapacityMinimum 1 `
    -RecurrenceFrequency week  `
    -ScheduleDay "Wednesday","Friday" `
    -ScheduleHour 7   `
    -ScheduleMinute 00  `
    -ScheduleTimeZone  "Pacific Standard Time" `
    -Rule $rule1, $rule2
```
Parameters
-FixedDateStart
the start time for the profile in ISO 8601 format.
- `CapacityDefault` the number of instances that will be set if metrics are not available for evaluation. The default is only used if the current instance count is lower than the default.
- `CapacityMaximum` the maximum number of instances for the resource. The maximum number of instances is further limited by the number of cores that are available in the subscription.
- `CapacityMinimum` the minimum number of instances for the resource.
-`FixedDateEnd` the end time for the profile in ISO 8601 format.
-`FixedDateStart` the start time for the profile in ISO 8601 format.
- `Rule` a collection of rules that provide the triggers and parameters for the scaling action when this profile is active. A maximum of 10, comma separated rules can be specified.
-`RecurrenceFrequency`  How often the scheduled profile takes effect. This value must be *week*. 
-`ScheduleDay` A collection of days that the profile takes effect on when specifying a recurring schedule. Possible values are Sunday through Saturday. For more information on recurring schedules see [Add a recurring profile using CLI](./autoscale-multiprofile.md?tabs=powershell#add-a-recurring-profile-using-powershell)
- `ScheduleHour` A collection of hours that the profile takes effect on. Values supported are 0 to 23.
-  `ScheduleMinute` A collection of minutes at which the profile takes effect at.
- `ScheduleTimeZone` The timezone for the hours of the profile.