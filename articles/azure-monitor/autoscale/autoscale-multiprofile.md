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

* Recurring profiles. A recurring profile is valid for a specific time range and repeats on the selected days of the week.
* Fixed date and time profiles. A profile that is valid for a specific date and time range.
* The default profile. The default profile is created automatically and isn't dependent on a schedule. The default profile can't be deleted.
  
Each time the autoscale service runs, the profiles are evaluated in the following order:

1. Fixed date profiles
1. Recurring profiles
1. Default profile

If a profile's date and time conditions are met, autoscale will apply that profile's limits and rules. Only the first applicable profile is used. All other profiles are ignored until the next run. If you have a rule that you want to use at all times, include the rule in all of your profiles.

:::image type="content" source="./media/autoscale-multiple-profiles/autoscale-default-recurring-profiles.png" alt-text="A screenshot showing an autoscale setting with default and recurring profile or scale condition":::

The example above shows an autoscale setting with a default profile and recurring profile as follows.

Default profile:

* Minimum instances = 2
* Maximum instances = 10
* Scale out when the average request count is greater than 10
* Scale in when the average request count is less than three

Recurring profile:

* Minimum instances = 3
* Maximum instances = 10
* Scale out when CPU% exceeds 50
* Scale in when CPU% is below 20
* Repeat this profile every Monday, between 6 AM and 6 PM Eastern Time

On Monday after 6 AM, the next time the autoscale service runs, the recurring profile will be used. If the instance count is two, autoscale scales to the new minimum of three. Autoscale continues to use this profile and scales based on CPU% until Monday at 6 PM.

At all other times scaling will be done according to the default profile, based on the number of requests.
After 6 PM on Monday, autoscale switches to the default profile. If, for example the number of instances at the time is 12, autoscale scales in to 10, which the maximum allowed for the default profile.

## Multiple profiles using templates and CLI

When creating multiple profiles using templates and the CLI, 

#### [ARM templates](#tab/templates)

Follow the tules below when using tARM templates to create autoscale setting with multiple profiles:

* Create a default profile for each recurring profile.
    * The default profile must contain a `recurrence` section that is the same as the recurring profile, with the `hours` and `minuted` elements set for the end time of the recurring profile.
    * The `name` element for the default profile is an object with the follwoing format: `"name": "{\"name\":\"Auto created default scale condition\",\"for\":\"Recurring profile name\"}"` where the recurring profile name is the value of the `name` element for the recurring profile.

If you do not specify a default profile recurrence with a start time, the last recurrence rule will remain in effect.

These rules do not apply for a non-recurring scheduled profile.
The example below shows the JSON for  recurring profile for weekends that begins at 06:00 on a Saturday and Sunday, and ends at 19:00 for the same days.

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
                            "name": "Weekend profile",
                            "capacity": {
                                "minimum": "2",
                                "maximum": "3",
                                "default": "2"
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
                                "default": "3"
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

<!--- Content here  -->

--- 
