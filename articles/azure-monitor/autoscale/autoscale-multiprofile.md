---
title: Autoscale with multiple profiles
description: "Using multiple profiles in autoscale"
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.subservice: autoscale
ms.topic: conceptual
ms.date: 09/15/2022
ms.reviewer: akkumari


# Customer intent: As a user or dev ops administrator, I want to understand how set up autoscale with more than one profile so I can scale my resources with more flexibility.
---

# Autoscale with multiple profiles

This article explains the different profiles in autoscale and how to use them.

You can have one or more profiles in your autoscale setting.

There are three types of profile:

* Recurring profiles. A recurring profile is valid for a specific time range and repeats for selected days of the week.
* Fixed date and time profiles. A profile that is valid for a time range on a specific date.
* The default profile. The default profile is created automatically and isn't dependent on a schedule. The default profile can't be deleted.
  
Each time the autoscale service runs, the profiles are evaluated in the following order:

1. Fixed date profiles
1. Recurring profiles
1. Default profile

If a profile's date and time conditions match the current time, autoscale will apply that profile's limits and rules. Only the first applicable profile is used.

The example below shows an autoscale setting with a default profile and recurring profile as follows.

:::image type="content" source="./media/autoscale-multiple-profiles/autoscale-default-recurring-profiles.png" alt-text="A screenshot showing an autoscale setting with default and recurring profile or scale condition":::

On Monday after 6 AM, the recurring profile will be used. If the instance count is two, autoscale scales to the new minimum of three. Autoscale continues to use this profile and scales based on CPU% until Monday at 6 PM.

At all other times scaling will be done according to the default profile, based on the number of requests.
After 6 PM on Monday, autoscale switches to the default profile. If, for example the number of instances at the time is 12, autoscale scales in to 10, which the maximum allowed for the default profile.

## Multiple profiles using templates and CLI

When creating multiple profiles using templates and the CLI, follow the guidelines below.

#### [ARM templates](#tab/templates)

Follow the rules below when using ARM templates to create autoscale settings with multiple profiles:

* Create a default profile for each recurring profile. If you have two recurring profiles, create two matching default profiles.
* The default profile must contain a `recurrence` section that is the same as the recurring profile, with the `hours` and `minutes` elements set for the end time of the recurring profile. If you do not specify a recurrence with a start time for the default profile, the last recurrence rule will remain in effect.
These rules do not apply for a non-recurring scheduled profile.
* The `name` element for the default profile is an object with the following format: `"name": "{\"name\":\"Auto created default scale condition\",\"for\":\"Recurring profile name\"}"` where the recurring profile name is the value of the `name` element for the recurring profile. If this is not specified correctly, the default profile will appear as another recurring profile.

The example below shows the JSON for two recurring profiles. One for weekends between 06:00 and 19:00, Saturday and Sunday, and a second for Mondays between 04:00 and 15:00. Note the tow default profiles, one for each recurring profile.

This autoscale setting was created with the follwoing command:
` az deployment group create --name VMSS1-Autoscale-607 --resource-group rg-vmss1 --template-file VMSS1-autoscale.json`

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
                        "name": "Monday profile",
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
                                    "Saturday",
                                    "Sunday"
                                ],
                                "hours": [
                                    6
                                ],
                                "minutes": [
                                    0
                                ]
                            }
                        }
                    },
                    {
                        "name": "{\"name\":\"Auto created default scale condition\",\"for\":\"Weekend profile\"}",
                        "capacity": {
                            "minimum": "2",
                            "maximum": "10",
                            "default": "2"
                        },
                        "recurrence": {
                            "frequency": "Week",
                            "schedule": {
                                "timeZone": "E. Europe Standard Time",
                                "days": [
                                    "Saturday",
                                    "Sunday"
                                ],
                                "hours": [
                                    19
                                ],
                                "minutes": [
                                    0
                                ]
                            }
                        },
                        "rules": [
                            {
                                "scaleAction": {
                                    "direction": "Increase",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT3M"
                                },
                                "metricTrigger": {
                                    "metricName": "Percentage CPU",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "GreaterThan",
                                    "statistic": "Average",
                                    "threshold": 50,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT1M",
                                    "Dimensions": [],
                                    "dividePerInstance": false
                                }
                            },
                            {
                                "scaleAction": {
                                    "direction": "Decrease",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT3M"
                                },
                                "metricTrigger": {
                                    "metricName": "Percentage CPU",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "LessThan",
                                    "statistic": "Average",
                                    "threshold": 39,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT3M",
                                    "Dimensions": [],
                                    "dividePerInstance": false
                                }
                            }
                        ]
                    },
                    {
                        "name": "{\"name\":\"Auto created default scale condition\",\"for\":\"Monday profile\"}",
                        "capacity": {
                            "minimum": "2",
                            "maximum": "10",
                            "default": "2"
                        },
                        "recurrence": {
                            "frequency": "Week",
                            "schedule": {
                                "timeZone": "E. Europe Standard Time",
                                "days": [
                                    "Monday"
                                ],
                                "hours": [
                                    15
                                ],
                                "minutes": [
                                    0
                                ]
                            }
                        },
                        "rules": [
                            {
                                "scaleAction": {
                                    "direction": "Increase",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT3M"
                                },
                                "metricTrigger": {
                                    "metricName": "Percentage CPU",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "GreaterThan",
                                    "statistic": "Average",
                                    "threshold": 50,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT1M",
                                    "Dimensions": [],
                                    "dividePerInstance": false
                                }
                            },
                            {
                                "scaleAction": {
                                    "direction": "Decrease",
                                    "type": "ChangeCount",
                                    "value": "1",
                                    "cooldown": "PT3M"
                                },
                                "metricTrigger": {
                                    "metricName": "Percentage CPU",
                                    "metricNamespace": "microsoft.compute/virtualmachinescalesets",
                                    "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
                                    "operator": "LessThan",
                                    "statistic": "Average",
                                    "threshold": 39,
                                    "timeAggregation": "Average",
                                    "timeGrain": "PT1M",
                                    "timeWindow": "PT3M",
                                    "Dimensions": [],
                                    "dividePerInstance": false
                                }
                            }
                        ]
                    }
                ],
                "notifications": [],
                "targetResourceLocation": "eastus"
            }

        }
    ]
}
    
```

#### [CLI](#tab/cli)

The CLI can be used to create addition profiles in your autoscale settings.

To create a recurring profile
1. Create the profile using `az monitor autoscale profile create`. Specify the `--start` and `--end` time and the `--recurrence` 
1. Create a scale out rule using `az monitor autoscale rule create` using ``--scale out`
1. Create a scale in rule using `az monitor autoscale rule create` using ``--scale in`

The example below shows the addition of a recurring profile, recurring on Thursdays between 06:00 and 22:50.

``` azurecli

az monitor autoscale profile create --autoscale-name VMSS1-Autoscale-607 --count 2 --max-count 10 --min-count 1 --name Thursdays --recurrence week thu --resource-group rg-vmss1 --start 06:00 --end 22:50 --timezone "Pacific Standard Time" 

az monitor autoscale rule create -g rg-vmss1 --autoscale-name VMSS1-Autoscale-607 --scale in 1 --condition "Percentage CPU < 25 avg 5m" --profile-name Thursdays

az monitor autoscale rule create -g rg-vmss1 --autoscale-name VMSS1-Autoscale-607 --scale out 2 --condition "Percentage CPU > 50 avg 5m"  --profile-name Thursdays
```

> [!NOTE]  
> The JSON for your autoscale default profile is modified by adding a recurring profile.  
> The `name` of the default profile is changed to an object in the format: `"name": "{\"name\":\"Auto created default scale condition\",\"for\":\"recurring profile\"}"` where *recurring profile* is the profile name from the `az monitor autoscale profile create` command.  
> The default profile also has a recurrence clause added to it that starts at the end time specified for the new recurring profile.
> A new default profile is created for each recurring profile.  

After adding recurring profiles, your default profile is renamed. If you have multiple recurring profiles and want to update your default profile the update mast be made to each default profile that corresponds to a recurring profile.

For example, if you have two recurring profiles called *Wednesdays* and *Thursdays*, you need two commands to add a rule to the default profile.

```azurecli
az monitor autoscale rule create -g rg-vmss1--autoscale-name VMSS1-Autoscale-607 --scale out 8 --condition "Percentage CPU > 52 avg 5m"  --profile-name "{\"name\": \"Auto created default scale condition\", \"for\": \"Wednesdays\"}" 
 
az monitor autoscale rule create -g rg-vmss1--autoscale-name VMSS1-Autoscale-607 --scale out 8 --condition "Percentage CPU > 52 avg 5m"  --profile-name "{\"name\": \"Auto created default scale condition\", \"for\": \"Thursdays\"}"  
```


---
