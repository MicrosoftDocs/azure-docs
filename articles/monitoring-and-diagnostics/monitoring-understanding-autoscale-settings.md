---
title: Understanding Autoscale Settings | Microsoft Docs
description: A detailed breakdown of autoscale settings and how they work.
author: ancav
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: ce2930aa-fc41-4b81-b0cb-e7ea922467e1
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/18/2017
ms.author: ancav

---
# Understand Autoscale Settings
Autoscale settings enable you to ensure you have the right amount of resources running to handle the fluctuating load of your application. You can configure autoscale settings to be triggered based on metrics that indicate load or performance, or trigger at a scheduled date and time. This article takes a detailed look at the anatomy of an autoscale setting. The article starts by understanding the schema and properties of a setting, then walks through the different profile types that can be configured, and finally discusses how autoscale evaluates which profile to execute at any given time.

## Autoscale setting schema
To illustrate the autoscale setting schema, the following autoscale setting is used. It is important to note that this autoscale setting has:
- One profile 
- It has two metric rules in this profile; one for scale-out and one for scale-in.
- The scale-out rule is triggered when the virtual machine scale set's average Percentage CPU metric is greater than 85% for the past 10 min.
- The scale-in rule is triggered when the virtual machine scale set's average is less than 60% for the past minute.

> [!NOTE]
> A setting can have multiple profiles, jump to the [profiles](#autoscale-profiles) section to learn more.
> A profile can also have multiple scale-out rules and scale-in rules defined, jump to the [evaluation section](#autoscale-evaluation) to see how they are evaluated

```JSON
{
  "id": "/subscriptions/s1/resourceGroups/rg1/providers/microsoft.insights/autoscalesettings/setting1",
  "name": "setting1",
  "type": "Microsoft.Insights/autoscaleSettings",
  "location": "East US",
  "properties": {
    "enabled": true,
    "targetResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/vmss1",
    "profiles": [
      {
        "name": "mainProfile",
        "capacity": {
          "minimum": "1",
          "maximum": "4",
          "default": "1"
        },
        "rules": [
          {
            "metricTrigger": {
              "metricName": "Percentage CPU",
              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/vmss1",
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
              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/vmss1",
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

| Section | Element name | Description |
| --- | --- | --- |
| Setting | ID | The Autoscale setting's resource ID. Autoscale settings are an Azure Resource Manager resource. |
| Setting | name | The Autoscale setting name. |
| Setting | location | The location of the Autoscale setting. This location can be different from the location of the resource being scaled. |
| properties | targetResourceUri | The resource ID of the resource being scaled. You can only have one Autoscale setting per resource. |
| properties | profiles | An Autoscale setting is composed of one or more profiles. Each time the Autoscale engine runs, it executes one profile. |
| profile | name | The name of the profile, you can choose any name that helps you identify the profile. |
| profile | Capacity.maximum | The maximum capacity allowed. It ensures that autoscale, when executing this profile, does not scale your resource above this number. |
| profile | Capacity.minimum | The minimum capacity allowed. It ensures that autoscale, when executing this profile, does not scale your resource below this number. |
| profile | Capacity.default | If there is a problem reading the resource metric (in this case, the cpu of “vmss1”) and the current capacity is below the default capacity, then to ensure the availability of the resource, Autoscale scales-out to the default. If the current capacity is already higher than the default capacity, Autoscale will not scale-in. |
| profile | rules | Autoscale automatically scales between the maximum and minimum capacities using the rules in the profile. You can have multiple rules in a profile. The basic scenario is to have two rules, one to determine when to scale-out and the other to determine when to scale-in. |
| rule | metricTrigger | Defines the metric condition of the rule. |
| metricTrigger | metricName | The name of the metric. |
| metricTrigger |  metricResourceUri | The resource ID of the resource that emits the metric. In most cases, it is the same as the resource being scaled. In some cases, it can be different, for example you can scale a virtual machine scale set based on the number of messages in a storage queue. |
| metricTrigger | timeGrain | The metric sampling duration. For example, TimeGrain = “PT1M” means that the metrics should be aggregated every 1 minute using the aggregation method specified in “statistic.” |
| metricTrigger | statistic | The aggregation method within the timeGrain period. For example, statistic = “Average” and timeGrain = “PT1M” means that the metrics should be aggregated every 1 minute by taking the average. This property dictates how the metric is sampled. |
| metricTrigger | timeWindow | The amount of time to look back for metrics. For example, timeWindow = “PT10M” means that every time Autoscale runs, it queries metrics for the past 10 minutes. The time window allows your metrics to be normalized and avoids reacting to transient spikes. |
| metricTrigger | timeAggregation | The aggregation method used to aggregate the sampled metrics. For example, TimeAggregation = “Average” should aggregate the sampled metrics by taking the average. In the case above take the ten 1-minute samples, and average them. |
| rule | scaleAction | The action to take when the metricTrigger of the rule is triggered. |
| scaleAction | direction | "Increase" to scale-out, "Decrease" to scale-in|
| scaleAction | value | How much to increase or decrease the capacity of the resource |
| scaleAction | cooldown | The amount of time to wait after a scale operation before scaling again. For example, if cooldown = “PT10M” then after a scale operation occurs, Autoscale will not attempt to scale again for another 10 minutes. The cooldown is to allow the metrics to stabilize after the addition or removal of instances. |

## Autoscale profiles

There are three types of Autoscale profiles:

1. **Regular profile:** Most common profile. If you don’t need to scale your resource differently based on the day of the week, or on a particular day, then you only need to set up a regular profile in your Autoscale setting. This profile can then be configured with metric rules that dictate when to scale-out and when to scale-in. You should only have one regular profile defined.

	The example profile used earlier in this article is an example of a regular profile. Do not it is also possible to set a profile to scale to a static instance count for your resource.

2. **Fixed date profile:** With the regular profile defined, let’s say you have an important event coming up on December 26, 2017 (PST) and you want the minimum/maximum capacities of your resource to be different on that day, but still scale on the same metrics. In this case, you should add a fixed date profile to your setting’s profiles list. The profile is configured to run only on the event’s day. For any other day, the regular profile is executed.

    ``` JSON
    "profiles": [{
	"name": " regularProfile",
	"capacity": {
	...
	},
	"rules": [{
	...
	},
	{
	...
	}]
	},
	{
	"name": "eventProfile",
	"capacity": {
	...
	},
	"rules": [{
	...
	}, {
	...
	}],
	"fixedDate": {
		"timeZone": "Pacific Standard Time",
	           "start": "2017-12-26T00:00:00",
      		   "end": "2017-12-26T23:59:00"
	}}
    ]
    ```
	
3. **Recurrence profile:** This type of profile enables you to ensure that this profile is always used on a particular day of the week. Recurrence profiles only have a start time, as a result they run until the next recurrence profile or fixed date profile is set to start. An autoscale setting with only one recurrence profile, executes that profile even if there is a regular profile defined in the same setting. The two examples below illustrate the usage of this profile:

    **Example 1 - Weekday vs. Weekends**
    Let’s say that on weekends you want your max capacity to be 4 but on weekdays, since you expect more load, you want your maximum capacity to be 10. In this case, your setting would contain two recurrence profiles, one to run on weekends and the other on weekdays.
    The setting would look like this:

    ``` JSON
    "profiles": [
    {
	"name": "weekdayProfile",
	"capacity": {
		...
	},
	"rules": [{
		...
	}],
	"recurrence": {
		"frequency": "Week",
		"schedule": {
			"timeZone": "Pacific Standard Time",
			"days": [
				"Monday"
			],
			"hours": [
				0
			],
			"minutes": [
				0
			]
		}
	}}
    },
    {
	"name": "weekendProfile",
	"capacity": {
		...
	},
	"rules": [{
		...
	}]
	"recurrence": {
		"frequency": "Week",
		"schedule": {
			"timeZone": "Pacific Standard Time",
			"days": [
				"Saturday"
			],
			"hours": [
				0
			],
			"minutes": [
				0
			]
		}
	}
    }]
    ```

    By looking at the preceding setting, you’ll notice that each recurrence profile has a schedule, this schedule determines when the profile starts executing. The profile stops executing when it’s time to execute another profile.

    For example, in the preceding setting, “weekdayProfile” is set to start on Monday at 12 a.m., that means this profile starts executing on Monday at 12.am. It continues executing until Saturday at 12a.m., when “weekendProfile”  is scheduled to start executing.

    **Example 2 - Business hours**
    Let’s take another example, maybe you want to have metric threshold = ‘x’ during business hours, 9 a.m. to 5 p.m., and then from 5 p.m. to 9 a.m. the next day, you want the metric threshold to be ‘y’.
    The setting would look like this:
	
    ``` JSON
    "profiles": [
    {
	"name": "businessHoursProfile",
	"capacity": {
		...
	},
	"rules": [{
		...
	}],
	"recurrence": {
		"frequency": "Week",
		"schedule": {
			"timeZone": "Pacific Standard Time",
			"days": [
				"Monday", “Tuesday”, “Wednesday”, “Thursday”, “Friday”
			],
			"hours": [
				9
			],
			"minutes": [
				0
			]
		}
	}
    },
    {
	"name": "nonBusinessHoursProfile",
	"capacity": {
		...
	},
	"rules": [{
		...
	}]
	"recurrence": {
		"frequency": "Week",
		"schedule": {
			"timeZone": "Pacific Standard Time",
			"days": [
				"Monday", “Tuesday”, “Wednesday”, “Thursday”, “Friday”
			],
			"hours": [
				17
			],
			"minutes": [
				0
			]
		}
	}
    }]
    ```
	
    By looking at the preceding setting , “businessHoursProfile” begins executing on Monday at 9 a.m. and keeps executing until 5 p.m. because that’s when “nonBusinessHoursProfile” starts executing. The “nonBusinessHoursProfile” executes until 9 a.m. Tuesday and then the “businessHoursProfile” takes over. This repeats till Friday 5 p.m., at that point “nonBusinessHoursProfile” executes all the way to Monday 9 a.m. since the “businessHoursProfile” does not start executing till Monday 9 a.m.
	
> [!Note]
> The autoscale UX in the Azure portal enforces end times for recurrence profiles, and begins executing the autoscale setting's default > profile in between recurrence profiles.
	
## Autoscale Evaluation
Given that autoscale settings can have multiple autoscale profiles, and each profile can have multiple metric rules it is important to understand how an autoscale setting is evaluated. Each time the autoscale job runs it begins by choosing the profile that is applicable, after choosing the profile autoscale evaluates the min, max values and any metric rules in the profile and decides if a scale action is necessary.

### Which profile will Autoscale pick?
- Autoscale first looks for any fixed date profile that is configured to run now, if there is, Autoscale executes it. If there are multiple fixed date profiles that are supposed to run, Autoscale will select the first one.
- If there are no fixed date profiles, Autoscale looks at recurrence profiles, if found, then it executes it.
- If there are no fixed or recurrence profiles, then Autoscale execute the regular profile.

### How does Autoscale evaluate multiple rules?

Once Autoscale determines which profile is supposed to execute, it starts by evaluating all the scale-out rule in the profile (rules with direction = “Increase”).
- If one or more scale-out rules are triggered, Autoscale  calculates the new capacity determined by the scaleAction of each of those rules. Then it scales-out to the maximum of those capacities to ensure service availability.
- For example: If there is a virtual machine scale set with a current capacity of 10 and there are two scale-out rules; one that increases capacity by 10%, and one that increases capacity by 3. The first rule would result in a new capacity of 11, and the second rule would result in a capacity of 13. To ensure service availability autoscale chooses the action that results in the max capacity, so the second rule is chosen.

If no scale-out rules are triggered, Autoscale  evaluates all the scale-in rules (rules with direction = “Decrease”). Autoscale only takes a scale-in action if all of the scale-in rules are triggered.
- Autoscale calculates the new capacity determined by the scaleAction of each of those rules. Then it chooses the scale action that results in the maximum of those capacities to ensure service availability.
- For example: If there is a virtual machine scale set with a current capacity of 10 and there are two scale-in rules; one that decreases capacity by 50%, and one that decreases capacity by 3. The first rule would result in a new capacity of 5, and the second rule would result in a capacity of 7. To ensure service availability autoscale chooses the action that results in the max capacity, so the second rule is chosen.

## Next Steps
To learn more about Autoscale refer to the following resources:

* [Overview of autoscale](monitoring-overview-autoscale.md)
* [Azure Monitor autoscale common metrics](insights-autoscale-common-metrics.md)
* [Best practices for Azure Monitor autoscale](insights-autoscale-best-practices.md)
* [Use autoscale actions to send email and webhook alert notifications](insights-autoscale-to-webhook-email.md)
* [Autoscale REST API](https://msdn.microsoft.com/library/dn931953.aspx)
