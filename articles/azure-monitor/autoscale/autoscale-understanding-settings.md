---
title: Understand autoscale settings in Azure Monitor
description: This article explains autoscale settings, how they work, and how they apply to Azure Virtual Machines, Azure Cloud Services, and the Web Apps feature of Azure App Service.
author: EdB-MSFT
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 11/02/2022
ms.subservice: autoscale
ms.custom: ignite-2022
ms.author: edbaynash
ms.reviewer: akkumari

---
# Understand autoscale settings

Autoscale settings help ensure that you have the right amount of resources running to handle the fluctuating load of your application. You can configure autoscale settings to be triggered based on metrics that indicate load or performance, or triggered at a scheduled date and time.

This article explains the autoscale settings.

## Autoscale setting schema

The following example shows an autoscale setting with these attributes:

- A single default profile.
- Two metric rules in this profile: one for scale-out, and one for scale-in.
  - The scale-out rule is triggered when the virtual machine scale set's average percentage CPU metric is greater than 85% for the past 10 minutes.
  - The scale-in rule is triggered when the virtual machine scale set's average is less than 60% for the past minute.

> [!NOTE]
> A setting can have multiple profiles. To learn more, see the [profiles](#autoscale-profiles) section. A profile can also have multiple scale-out rules and scale-in rules defined. To see how they're evaluated, see the [evaluation](#autoscale-evaluation) section.

```JSON
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
        "name": "Auto created default scale condition",
        "capacity": {
          "minimum": "1",
          "maximum": "4",
          "default": "1"
        },
        "rules": [
          {
            "metricTrigger": {
              "metricName": "Percentage CPU",
              "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
              "timeGrain": "PT1M",
              "statistic": "Average",
              "timeWindow": "PT10M",
              "timeAggregation": "Average",
              "operator": "GreaterThan",
              "threshold": 85
            },
            "scaleAction": {
              "direction": "Increase",
              "type": "ChangeCount",
              "value": "1",
              "cooldown": "PT5M"
            }
          },
          {
            "metricTrigger": {
              "metricName": "Percentage CPU",
              "metricResourceUri": "/subscriptions/abc123456-987-f6e5-d43c-9a8d8e7f6541/resourceGroups/rg-vmss1/providers/Microsoft.Compute/virtualMachineScaleSets/VMSS1",
              "timeGrain": "PT1M",
              "statistic": "Average",
              "timeWindow": "PT10M",
              "timeAggregation": "Average",
              "operator": "LessThan",
              "threshold": 60
            },
            "scaleAction": {
              "direction": "Decrease",
              "type": "ChangeCount",
              "value": "1",
              "cooldown": "PT5M"
            }
          }
        ]
      }
    ]
  }
}
```

The following table describes the elements in the preceding autoscale setting's JSON.

| Section | Element name |Portal name| Description |
| --- | --- | --- |--- |
| Setting | ID | |The autoscale setting's resource ID. Autoscale settings are an Azure Resource Manager resource. |
| Setting | name | |The autoscale setting name. |
| Setting | location | |The location of the autoscale setting. This location can be different from the location of the resource being scaled. |
| properties | targetResourceUri | |The resource ID of the resource being scaled. You can only have one autoscale setting per resource. |
| properties | profiles | Scale condition |An autoscale setting is composed of one or more profiles. Each time the autoscale engine runs, it executes one profile. Configure up to 20 profiles per autoscale setting. |
| profiles | name | |The name of the profile. You can choose any name that helps you identify the profile. |
| profiles | capacity.maximum | Instance limits - Maximum |The maximum capacity allowed. It ensures that autoscale doesn't scale your resource above this number when it executes the profile. |
| profiles | capacity.minimum | Instance limits - Minimum  |The minimum capacity allowed. It ensures that autoscale doesn't scale your resource below this number when it executes the profile |
| profiles | capacity.default | Instance limits - Default  |If there's a problem reading the resource metric, and the current capacity is below the default, autoscale scales out to the default. This action ensures the availability of the resource. If the current capacity is already higher than the default capacity, autoscale doesn't scale in. |
| profiles | rules | Rules |Autoscale automatically scales between the maximum and minimum capacities by using the rules in the profile. Define up to 10 individual rules in a profile. Typically rules are defined in pairs, one to determine when to scale out, and the other to determine when to scale in. |
| rule | metricTrigger | Scale rule |Defines the metric condition of the rule. |
| metricTrigger | metricName | Metric name |The name of the metric. |
| metricTrigger |  metricResourceUri | |The resource ID of the resource that emits the metric. In most cases, it's the same as the resource being scaled. In some cases, it can be different. For example, you can scale a virtual machine scale set based on the number of messages in a storage queue. |
| metricTrigger | timeGrain | Time grain (minutes) |The metric sampling duration. For example, **timeGrain = "PT1M"** means that the metrics should be aggregated every 1 minute, by using the aggregation method specified in the statistic element. |
| metricTrigger | statistic | Time grain statistic |The aggregation method within the timeGrain period. For example, **statistic = "Average"** and **timeGrain = "PT1M"** means that the metrics should be aggregated every 1 minute, by taking the average. This property dictates how the metric is sampled. |
| metricTrigger | timeWindow | Duration |The amount of time to look back for metrics. For example, **timeWindow = "PT10M"** means that every time autoscale runs, it queries metrics for the past 10 minutes. The time window allows your metrics to be normalized and avoids reacting to transient spikes. |
| metricTrigger | timeAggregation |Time aggregation |The aggregation method used to aggregate the sampled metrics. For example, **timeAggregation = "Average"** should aggregate the sampled metrics by taking the average. In the preceding case, take the ten 1-minute samples, and average them. |
| rule | scaleAction | Action |The action to take when the metricTrigger of the rule is triggered. |
| scaleAction | direction | Operation |"Increase" to scale out, or "Decrease" to scale in.|
| scaleAction | value |Instance count |How much to increase or decrease the capacity of the resource. |
| scaleAction | cooldown | Cool down (minutes)|The amount of time to wait after a scale operation before scaling again. For example, if **cooldown = "PT10M"**, autoscale doesn't attempt to scale again for another 10 minutes. The cooldown is to allow the metrics to stabilize after the addition or removal of instances. |

## Autoscale profiles

Define up to 20 different profiles per autoscale setting.  
There are three types of autoscale profiles:

- **Default profile**: Use the default profile if you don't need to scale your resource based on a particular date and time or day of the week. The default profile runs when there are no other applicable profiles for the current date and time. You can only have one default profile.
- **Fixed-date profile**: The fixed-date profile is relevant for a single date and time. Use the fixed-date profile to set scaling rules for a specific event. The profile runs only once, on the event's date and time. For all other times, autoscale uses the default profile.

    ```json
        ...
        "profiles": [
            {
                "name": " regularProfile",
                "capacity": {
                    ...
                },
                "rules": [
                    ...
                ]
            },
            {
                "name": "eventProfile",
                "capacity": {
                ...
                },
                "rules": [
                    ...
                ],
                "fixedDate": {
                    "timeZone": "Pacific Standard Time",
                    "start": "2017-12-26T00:00:00",
                    "end": "2017-12-26T23:59:00"
                }
            }
        ]
    ```

- **Recurrence profile**: A recurrence profile is used for a day or set of days of the week. The schema for a recurring profile doesn't include an end date. The end of date and time for a recurring profile is set by the start time of the following profile. When the portal is used to configure recurring profiles, the default profile is automatically updated to start at the end time that you specify for the recurring profile. For more information on configuring multiple profiles, see [Autoscale with multiple profiles](./autoscale-multiprofile.md)

    The partial schema example here shows a recurring profile. It starts at 06:00 and ends at 19:00 on Saturdays and Sundays. The default profile has been modified to start at 19:00 on Saturdays and Sundays.
    
    ``` JSON
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "resources": [
                {
                    "type": "Microsoft.Insights/    autoscaleSettings",
                    "apiVersion": "2015-04-01",
                    "name": "VMSS1-Autoscale-607",
                    "location": "eastus",
                    "properties": {
        
                        "name": "VMSS1-Autoscale-607",
                        "enabled": true,
                        "targetResourceUri": "/subscriptions/    abc123456-987-f6e5-d43c-9a8d8e7f6541/    resourceGroups/rg-vmss1/providers/    Microsoft.Compute/    virtualMachineScaleSets/VMSS1",
                        "profiles": [
                            {
                                "name": "Weekend profile",
                                "capacity": {
                                    ...
                                },
                                "rules": [
                                    ...
                                ],
                                "recurrence": {
                                    "frequency": "Week",
                                    "schedule": {
                                        "timeZone": "E. Europe     Standard Time",
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
                                   ...
                                },
                                "recurrence": {
                                    "frequency": "Week",
                                    "schedule": {
                                        "timeZone": "E. Europe     Standard Time",
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
                                  ...
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

## Autoscale evaluation

Autoscale settings can have multiple profiles. Each profile can have multiple rules. Each time the autoscale job runs, it begins by choosing the applicable profile for that time. Autoscale then evaluates the minimum and maximum values, any metric rules in the profile, and decides if a scale action is necessary. The autoscale job runs every 30 to 60 seconds, depending on the resource type.

### Which profile will autoscale use?

Each time the autoscale service runs, the profiles are evaluated in the following order:

1. Fixed-date profiles
1. Recurring profiles
1. Default profile

The first suitable profile that's found is used.

### How does autoscale evaluate multiple rules?

After autoscale determines which profile to run, it evaluates the scale-out rules in the profile, that is, where **direction = "Increase"**. If one or more scale-out rules are triggered, autoscale calculates the new capacity determined by the **scaleAction** specified for each of the rules. If more than one scale-out rule is triggered, autoscale scales to the highest specified capacity to ensure service availability.

For example, assume that there are two rules: Rule 1 specifies a scale-out by three instances, and rule 2 specifies a scale-out by five. If both rules are triggered, autoscale scales out by five instances. Similarly, if one rule specifies scale-out by three instances and another rule specifies scale-out by 15%, the higher of the two instance counts is used.

If no scale-out rules are triggered, autoscale evaluates the scale-in rules, that is, rules with **direction = "Decrease"**. Autoscale only scales in if all the scale-in rules are triggered.

Autoscale calculates the new capacity determined by the **scaleAction** of each of those rules. To ensure service availability, autoscale scales in by as little as possible to achieve the maximum capacity specified. For example, assume two scale-in rules, one that decreases capacity by 50% and one that decreases capacity by three instances. If the first rule results in five instances and the second rule results in seven, autoscale scales in to seven instances.

Each time autoscale calculates the result of a scale-in action, it evaluates whether that action would trigger a scale-out action. The scenario where a scale action triggers the opposite scale action is known as flapping. Autoscale might defer a scale-in action to avoid flapping or might scale by a number less than what was specified in the rule. For more information on flapping, see [Flapping in autoscale](./autoscale-custom-metric.md).

## Next steps

Learn more about autoscale:

* [Overview of autoscale](./autoscale-overview.md)
* [Azure Monitor autoscale common metrics](./autoscale-common-metrics.md)
* [Autoscale with multiple profiles](./autoscale-multiprofile.md)
* [Flapping in autoscale](./autoscale-custom-metric.md)
* [Use autoscale actions to send email and webhook alert notifications](./autoscale-webhook-email.md)
* [Autoscale REST API](/rest/api/monitor/autoscalesettings)
