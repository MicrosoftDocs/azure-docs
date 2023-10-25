---
title: Autoscale with multiple profiles
description: "Using multiple and recurring profiles in autoscale"
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: conceptual
ms.date: 06/20/2023
ms.reviewer: akkumari

# Customer intent: As a user or dev ops administrator, I want to understand how set up autoscale with more than one profile so I can scale my resources with more flexibility.
---

# Autoscale with multiple profiles

Scaling your resources for a particular day of the week, or a specific date and time can reduce your costs while still providing the capacity you need when you need it.

You can use multiple profiles in autoscale to scale in different ways at different times. If for example, your business isn't active on the weekend, create a recurring profile to scale in your resources on Saturdays and Sundays. If black Friday is a busy day, create a profile to automatically scale out your resources on black Friday.

This article explains the different profiles in autoscale and how to use them.

You can have one or more profiles in your autoscale setting.

There are three types of profile:

* The default profile. The default profile is created automatically and isn't dependent on a schedule. The default profile can't be deleted. The default profile is used when there are no other profiles that match the current date and time.
* Recurring profiles. A recurring profile is valid for a specific time range and repeats for selected days of the week.
* Fixed date and time profiles. A profile that is valid for a time range on a specific date.

Each time the autoscale service runs, the profiles are evaluated in the following order:

1. Fixed date profiles
1. Recurring profiles
1. Default profile

If a profile's date and time settings match the current time, autoscale will apply that profile's rules and capacity limits. Only the first applicable profile is used.

The example below shows an autoscale setting with a default profile and recurring profile.

:::image type="content" source="./media/autoscale-multiple-profiles/autoscale-default-recurring-profiles.png" lightbox="./media/autoscale-multiple-profiles/autoscale-default-recurring-profiles.png" alt-text="A screenshot showing an autoscale setting with default and recurring profile or scale condition.":::

In the above example, on Monday after 3 AM, the recurring profile will cease to be used. If the instance count is less than 3, autoscale scales to the new minimum of three. Autoscale continues to use this profile and scales based on CPU% until Monday at 8 PM. At all other times scaling will be done according to the default profile, based on the number of requests. After 8 PM on Monday, autoscale switches to the default profile. If for example, the number of instances at the time is 12, autoscale scales in to 10, which the maximum allowed for the default profile.

## Multiple contiguous profiles
Autoscale transitions between profiles based on their start times. The end time for a given profile is determined by the start time of the following profile.

In the portal, the end time field becomes the next start time for the default profile. You can't specify the same time for the end of one profile and the start of the next. The portal will force the end time to be one minute before the start time of the following profile. During this minute, the default profile will become active. If you don't want the default profile to become active between recurring profiles, leave the end time field empty.

> [!TIP]
> To set up multiple contiguous profiles using the portal, leave the end time empty. The current profile will stop being used when the next profile becomes active. Only specify an end time when you want to revert to the default profile. 
> Creating a recurring profile with no end time is only supported via the portal and ARM templates.

## Multiple profiles using templates, CLI, and PowerShell

When creating multiple profiles using templates, the CLI, and PowerShell, follow the guidelines below.

## [ARM templates](#tab/templates)

See the autoscale section of the [ARM template resource definition](/azure/templates/microsoft.insights/autoscalesettings) for a full template reference.

There is no specification in the template for end time. A profile will remain active until the next profile's start time.  


## Add a recurring profile using ARM templates

The example below shows how to create two recurring profiles. One profile for weekends from 00:01 on Saturday morning and a second Weekday profile starting on Mondays at 04:00. That means that the weekend profile will start on Saturday morning at one minute passed midnight and end on Monday morning at 04:00. The Weekday profile will start at 4am on Monday and end just after midnight on Saturday morning.

Use the following command to deploy the template:
`az deployment group create --name VMSS1-Autoscale-607 --resource-group rg-vmss1 --template-file VMSS1-autoscale.json`
where *VMSS1-autoscale.json* is the the file containing the JSON object below.

``` JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Insights/autoscaleSettings",
            "apiVersion": "2015-04-01",
            "name": "VMSS1-Autoscale-607",
            "location": "eastus",
            "properties": {

                "name": "VMSS1-Autoscale-607",
                "enabled": true,
                "targetResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                "profiles": [
                    {
                        "name": "Weekday profile",
                        "capacity": {
                            "minimum": "3",
                            "maximum": "20",
                            "default": "3"
                        },
                        "rules": [
                            {
                                "scaleAction": {
                                    "direction": "Increase",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT5M"
                                },
                                "metricTrigger": {
                                    "metricName": "Inbound Flows",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "GreaterThan",
                                    "statistic": "Average",
                                    "threshold": 100,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT10M",
                                    "Dimensions": [],
                                    "dividePerInstance": true
                                }
                            },
                            {
                                "scaleAction": {
                                    "direction": "Decrease",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT5M"
                                },
                                "metricTrigger": {
                                    "metricName": "Inbound Flows",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "LessThan",
                                    "statistic": "Average",
                                    "threshold": 60,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT10M",
                                    "Dimensions": [],
                                    "dividePerInstance": true
                                }
                            }
                        ],
                        "recurrence": {
                            "frequency": "Week",
                            "schedule": {
                                "timeZone": "E. Europe Standard Time",
                                "days": [
                                    "Monday"
                                ],
                                "hours": [
                                    4
                                ],
                                "minutes": [
                                    0
                                ]
                            }
                        }
                    },
                    {
                        "name": "Weekend profile",
                        "capacity": {
                            "minimum": "1",
                            "maximum": "3",
                            "default": "1"
                        },
                        "rules": [],
                        "recurrence": {
                            "frequency": "Week",
                            "schedule": {
                                "timeZone": "E. Europe Standard Time",
                                "days": [
                                    "Saturday"                                    
                                ],
                                "hours": [
                                    0
                                ],
                                "minutes": [
                                    1
                                ]
                            }
                        }
                    }
                ],
                "notifications": [],
                "targetResourceLocation": "eastus"
            }

        }
    ]
}    
```

## [CLI](#tab/cli)

The CLI can be used to create multiple profiles in your autoscale settings.

See the [Autoscale CLI reference](/cli/azure/monitor/autoscale) for the full set of autoscale CLI commands.

The following steps show how to create a recurring autoscale profile using the CLI.

1. Create the recurring profile using `az monitor autoscale profile create`. Specify the `--start` and `--end` time and the `--recurrence`
1. Create a scale out rule using `az monitor autoscale rule create` using `--scale out`
1. Create a scale in rule using `az monitor autoscale rule create` using `--scale in`

## Add a recurring profile using CLI

The example below shows how to add a recurring autoscale profile, recurring on Thursdays between 06:00 and 22:50.

``` azurecli

export autoscaleName=vmss-autoscalesetting=002
export resourceGroupName=rg-vmss-001


az monitor autoscale profile create \
--autoscale-name $autoscaleName \
--count 2 \
--name Thursdays \
--resource-group $resourceGroupName \
--max-count 10 \
--min-count 1 \
--recurrence week thu \
--start 06:00 \
--end 22:50 \
--timezone "Pacific Standard Time" 


az monitor autoscale rule create \
--autoscale-name $autoscaleName \
-g $resourceGroupName  \
--scale in 1 \
--condition "Percentage CPU < 25 avg 5m" \
--profile-name Thursdays

az monitor autoscale rule create \
--autoscale-name $autoscaleName \
-g $resourceGroupName   \
--scale out 2 \
--condition "Percentage CPU > 50 avg 5m"  \
--profile-name Thursdays


az monitor autoscale profile list \
--autoscale-name $autoscaleName \
--resource-group $resourceGroupName
                                  
```

> [!NOTE]  
> * The JSON for your autoscale default profile is modified by adding a recurring profile.  
> The `name` element of the default profile is changed to an object in the format: `"name": "{\"name\":\"Auto created default scale condition\",\"for\":\"recurring profile name\"}"` where *recurring profile* is the profile name of your recurring profile.
> The default profile also has a recurrence clause added to it that starts at the end time specified for the new recurring profile.
> * A new default profile is created for each recurring profile.  
> * If the end time is not specified in the CLI command, the end time will be defaulted to 23:59.

## Updating the default profile when you have recurring profiles

After you add recurring profiles, your default profile is renamed. If you have multiple recurring profiles and want to update your default profile, the update must be made to each default profile corresponding to a recurring profile.

For example, if you have two recurring profiles called *Wednesdays* and *Thursdays*, you need two commands to add a rule to the default profile.

```azurecli
az monitor autoscale rule create -g rg-vmss1--autoscale-name VMSS1-Autoscale-607 --scale out 8 --condition "Percentage CPU > 52 avg 5m"  --profile-name "{\"name\": \"Auto created default scale condition\", \"for\": \"Wednesdays\"}" 
 
az monitor autoscale rule create -g rg-vmss1--autoscale-name VMSS1-Autoscale-607 --scale out 8 --condition "Percentage CPU > 52 avg 5m"  --profile-name "{\"name\": \"Auto created default scale condition\", \"for\": \"Thursdays\"}"  
```

## [PowerShell](#tab/powershell)

PowerShell can be used to create multiple profiles in your autoscale settings.

See the [PowerShell Az.Monitor Reference](/powershell/module/az.monitor/#monitor) for the full set of autoscale PowerShell commands.

The following steps show how to create an autoscale profile using PowerShell.

1. Create rules using `New-AzAutoscaleRule`.
1. Create profiles using `New-AzAutoscaleProfile` using the rules from the previous step.
1. Use `Add-AzAutoscaleSetting` to apply the profiles to your autoscale setting.

## Add a recurring profile using PowerShell

The example below shows how to create default profile and a recurring autoscale profile, recurring on Wednesdays and Fridays between 09:00 and 23:00.
The default profile uses the  `CpuIn` and `CpuOut` Rules. The recurring profile uses the `BandwidthIn` and `BandwidthOut` rules.

```azurepowershell

$ResourceGroupName="rg-vmss-001"
$TargetResourceId="/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss-001/providers/Microsoft.Compute/virtualMachineScaleSets/vmss-001"
$ScaleSettingName="vmss-autoscalesetting=001"

$CpuOut=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "Percentage CPU" `
    -MetricTriggerMetricResourceUri "$TargetResourceId"  `
    -MetricTriggerTimeGrain ([System.TimeSpan]::New(0,1,0)) `
    -MetricTriggerStatistic "Average" `
    -MetricTriggerTimeWindow ([System.TimeSpan]::New(0,5,0)) `
    -MetricTriggerTimeAggregation "Average" `
    -MetricTriggerOperator "GreaterThan" `
    -MetricTriggerThreshold 50 `
    -MetricTriggerDividePerInstance $false `
    -ScaleActionDirection "Increase" `
    -ScaleActionType "ChangeCount" `
    -ScaleActionValue 1 `
    -ScaleActionCooldown ([System.TimeSpan]::New(0,5,0))


$CpuIn=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "Percentage CPU" `
    -MetricTriggerMetricResourceUri "$TargetResourceId"  `
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


$defaultProfile=New-AzAutoscaleProfileObject `
    -Name "Default" `
    -CapacityDefault 1 `
    -CapacityMaximum 5 `
    -CapacityMinimum 1 `
    -Rule $CpuOut, $CpuIn


$BandwidthIn=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "VM Cached Bandwidth Consumed Percentage" `
    -MetricTriggerMetricResourceUri "$TargetResourceId"  `
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


$BandwidthOut=New-AzAutoscaleScaleRuleObject `
    -MetricTriggerMetricName "VM Cached Bandwidth Consumed Percentage" `
    -MetricTriggerMetricResourceUri "$TargetResourceId"  `
    -MetricTriggerTimeGrain ([System.TimeSpan]::New(0,1,0)) `
    -MetricTriggerStatistic "Average" `
    -MetricTriggerTimeWindow ([System.TimeSpan]::New(0,5,0)) `
    -MetricTriggerTimeAggregation "Average" `
    -MetricTriggerOperator "GreaterThan" `
    -MetricTriggerThreshold 60 `
    -MetricTriggerDividePerInstance $false `
    -ScaleActionDirection "Increase" `
    -ScaleActionType "ChangeCount" `
    -ScaleActionValue 1 `
    -ScaleActionCooldown ([System.TimeSpan]::New(0,5,0))

$RecurringProfile=New-AzAutoscaleProfileObject `
    -Name "Wednesdays and Fridays" `
    -CapacityDefault 1 `
    -CapacityMaximum 10 `
    -CapacityMinimum 1 `
    -RecurrenceFrequency week `
    -ScheduleDay "Wednesday","Friday" `
    -ScheduleHour 09 `
    -ScheduleMinute 00  `
    -ScheduleTimeZone "Pacific Standard Time" `
    -Rule $BandwidthIn, $BandwidthOut



$DefaultProfile2=New-AzAutoscaleProfileObject `
    -Name "Back to default after Wednesday and Friday" `
    -CapacityDefault 1 `
    -CapacityMaximum 5 `
    -CapacityMinimum 1 `
    -RecurrenceFrequency week `
    -ScheduleDay "Wednesday","Friday" `
    -ScheduleHour 23 `
    -ScheduleMinute 00 `
    -ScheduleTimeZone "Pacific Standard Time" `
    -Rule $CpuOut, $CpuIn


Update-AzAutoscaleSetting  `
-name $ScaleSettingName `
-ResourceGroup $ResourceGroupName `
-Enabled $true `
-TargetResourceUri $TargetResourceId `
-Profile $DefaultProfile, $RecurringProfile, $DefaultProfile2

```

> [!NOTE] 
> You can't specify an end date for recurring profiles in PowerShell. To end a recurring profile, create a copy of default profile with the same recurrence parameters as the recurring profile. Set the start time to be the time you want the recurring profile to end. Each recurring profile requires its own copy of the default profile to specify an end time. 

## Updating the default profile when you have recurring profiles

If you have multiple recurring profiles and want to change your default profile, the change must be made to each default profile corresponding to a recurring profile.

For example, if you have two recurring profiles called *SundayProfile* and *ThursdayProfile*, you need two `New-AzAutoscaleProfile` commands to change to the default profile.

```azurepowershell


$DefaultProfileSundayProfile = New-AzAutoscaleProfile -DefaultCapacity "1" -MaximumCapacity "10" -MinimumCapacity "1" -Rule $CpuOut,$CpuIn -Name "Defalut for Sunday" -RecurrenceFrequency week  -ScheduleDay "Sunday" -ScheduleHour 19 -ScheduleMinute 00   -ScheduleTimeZone "Pacific Standard Time"`


$DefaultProfileThursdayProfile = New-AzAutoscaleProfile -DefaultCapacity "1" -MaximumCapacity "10" -MinimumCapacity "1" -Rule $CpuOut,$CpuIn -Name "Default for Thursday" -RecurrenceFrequency week  -ScheduleDay "Thursday" -ScheduleHour 19 -ScheduleMinute 00   -ScheduleTimeZone "Pacific Standard Time"`
```

---

## Next steps

* [Autoscale CLI reference](/cli/azure/monitor/autoscale)
* [ARM template resource definition](/azure/templates/microsoft.insights/autoscalesettings)
* [PowerShell Az PowerShell module.Monitor Reference](/powershell/module/az.monitor/#monitor)
* [REST API reference. Autoscale Settings](/rest/api/monitor/autoscale-settings).
* [Tutorial: Automatically scale a Virtual Machine Scale Set with an Azure template](/azure/virtual-machine-scale-sets/tutorial-autoscale-template)
* [Tutorial: Automatically scale a Virtual Machine Scale Set with the Azure CLI](/azure/virtual-machine-scale-sets/tutorial-autoscale-cli)
* [Tutorial: Automatically scale a Virtual Machine Scale Set with an Azure template](/azure/virtual-machine-scale-sets/tutorial-autoscale-powershell)
