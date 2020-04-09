---
title: Understanding autoscale settings in Azure Monitor
description: "A detailed breakdown of autoscale settings and how they work. Applies to Virtual Machines, Cloud Services, Web Apps"
ms.topic: conceptual
ms.date: 12/18/2017
ms.subservice: autoscale
---
# Understand Autoscale settings
Autoscale settings help ensure that you have the right amount of resources running to handle the fluctuating load of your application. You can configure Autoscale settings to be triggered based on metrics that indicate load or performance, or triggered at a scheduled date and time. This article takes a detailed look at the anatomy of an Autoscale setting. The article begins with the schema and properties of a setting, and then walks through the different profile types that can be configured. Finally, the article discusses how the Autoscale feature in Azure evaluates which profile to execute at any given time.

## Autoscale setting schema
To illustrate the Autoscale setting schema, the following Autoscale setting is used. It is important to note that this Autoscale setting has:
- One profile. 
- Two metric rules in this profile: one for scale out, and one for scale in.
  - The scale-out rule is triggered when the virtual machine scale set's average percentage CPU metric is greater than 85 percent for the past 10 minutes.
  - The scale-in rule is triggered when the virtual machine scale set's average is less than 60 percent for the past minute.

> [!NOTE]
> A setting can have multiple profiles. To learn more, see the [profiles](#autoscale-profiles) section. A profile can also have multiple scale-out rules and scale-in rules defined. To see how they are evaluated, see the [evaluation](#autoscale-evaluation) section.

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
| profile | name | The name of the profile. You can choose any name that helps you identify the profile. |
| profile | Capacity.maximum | The maximum capacity allowed. It ensures that Autoscale, when executing this profile, does not scale your resource above this number. |
| profile | Capacity.minimum | The minimum capacity allowed. It ensures that Autoscale, when executing this profile, does not scale your resource below this number. |
| profile | Capacity.default | If there is a problem reading the resource metric (in this case, the CPU of “vmss1”), and the current capacity is below the default, Autoscale scales out to the default. This is to ensure the availability of the resource. If the current capacity is already higher than the default capacity, Autoscale does not scale in. |
| profile | rules | Autoscale automatically scales between the maximum and minimum capacities, by using the rules in the profile. You can have multiple rules in a profile. Typically there are two rules: one to determine when to scale out, and the other to determine when to scale in. |
| rule | metricTrigger | Defines the metric condition of the rule. |
| metricTrigger | metricName | The name of the metric. |
| metricTrigger |  metricResourceUri | The resource ID of the resource that emits the metric. In most cases, it is the same as the resource being scaled. In some cases, it can be different. For example, you can scale a virtual machine scale set based on the number of messages in a storage queue. |
| metricTrigger | timeGrain | The metric sampling duration. For example, **TimeGrain = “PT1M”** means that the metrics should be aggregated every 1 minute, by using the aggregation method specified in the statistic element. |
| metricTrigger | statistic | The aggregation method within the timeGrain period. For example, **statistic = “Average”** and **timeGrain = “PT1M”** means that the metrics should be aggregated every 1 minute, by taking the average. This property dictates how the metric is sampled. |
| metricTrigger | timeWindow | The amount of time to look back for metrics. For example, **timeWindow = “PT10M”** means that every time Autoscale runs, it queries metrics for the past 10 minutes. The time window allows your metrics to be normalized, and avoids reacting to transient spikes. |
| metricTrigger | timeAggregation | The aggregation method used to aggregate the sampled metrics. For example, **TimeAggregation = “Average”** should aggregate the sampled metrics by taking the average. In the preceding case, take the ten 1-minute samples, and average them. |
| rule | scaleAction | The action to take when the metricTrigger of the rule is triggered. |
| scaleAction | direction | "Increase" to scale out, or "Decrease" to scale in.|
| scaleAction | value | How much to increase or decrease the capacity of the resource. |
| scaleAction | cooldown | The amount of time to wait after a scale operation before scaling again. For example, if **cooldown = “PT10M”**, Autoscale does not attempt to scale again for another 10 minutes. The cooldown is to allow the metrics to stabilize after the addition or removal of instances. |

## Autoscale profiles

There are three types of Autoscale profiles:

- **Regular profile:** The most common profile. If you don’t need to scale your resource based on the day of the week, or on a particular day, you can use a regular profile. This profile can then be configured with metric rules that dictate when to scale out and when to scale in. You should only have one regular profile defined.

	The example profile used earlier in this article is an example of a regular profile. Note that it is also possible to set a profile to scale to a static instance count for your resource.

- **Fixed date profile:** This profile is for special cases. For example, let’s say you have an important event coming up on December 26, 2017 (PST). You want the minimum and maximum capacities of your resource to be different on that day, but still scale on the same metrics. In this case, you should add a fixed date profile to your setting’s list of profiles. The profile is configured to run only on the event’s day. For any other day, Autoscale uses the regular profile.

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
	
- **Recurrence profile:** This type of profile enables you to ensure that this profile is always used on a particular day of the week. Recurrence profiles only have a start time. They run until the next recurrence profile or fixed date profile is set to start. An Autoscale setting with only one recurrence profile runs that profile, even if there is a regular profile defined in the same setting. The following two examples illustrate how this profile is used:

    **Example 1: Weekdays vs. weekends**
    
	Let’s say that on weekends, you want your maximum capacity to be 4. On weekdays, because you expect more load, you want your maximum capacity to be 10. In this case, your setting would contain two recurrence profiles, one to run on weekends and the other on weekdays.
    The setting looks like this:

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

    The preceding setting shows that each recurrence profile has a schedule. This schedule determines when the profile starts running. The profile stops when it’s time to run another profile.

    For example, in the preceding setting, “weekdayProfile” is set to start on Monday at 12:00 AM. That means this profile starts running on Monday at 12:00 AM. It continues until Saturday at 12:00 AM, when “weekendProfile”  is scheduled to start running.

    **Example 2: Business hours**
    
	Let's say you want to have one metric threshold during business hours (9:00 AM to 5:00 PM), and a different one for all other times. The setting would look like this:
	
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
	
    The preceding setting shows that “businessHoursProfile” begins running on Monday at 9:00 AM, and continues to 5:00 PM. That’s when “nonBusinessHoursProfile” starts running. The “nonBusinessHoursProfile” runs until 9:00 AM Tuesday, and then the “businessHoursProfile” takes over again. This repeats until Friday at 5:00 PM. At that point, “nonBusinessHoursProfile” runs all the way to Monday at 9:00 AM.
	
> [!Note]
> The Autoscale user interface in the Azure portal enforces end times for recurrence profiles, and begins running the Autoscale setting's default profile in between recurrence profiles.
	
## Autoscale evaluation
Given that Autoscale settings can have multiple profiles, and each profile can have multiple metric rules, it is important to understand how an Autoscale setting is evaluated. Each time the Autoscale job runs, it begins by choosing the profile that is applicable. Then Autoscale evaluates the minimum and maximum values, and any metric rules in the profile, and decides if a scale action is necessary.

### Which profile will Autoscale pick?

Autoscale uses the following sequence to pick the profile:
1. It first looks for any fixed date profile that is configured to run now. If there is, Autoscale runs it. If there are multiple fixed date profiles that are supposed to run, Autoscale selects the first one.
2. If there are no fixed date profiles, Autoscale looks at recurrence profiles. If a recurrence profile is found, it runs it.
3. If there are no fixed date or recurrence profiles, Autoscale runs the regular profile.

### How does Autoscale evaluate multiple rules?

After Autoscale determines which profile to run, it evaluates all the scale-out rules in the profile (these are rules with **direction = “Increase”**).

If one or more scale-out rules are triggered, Autoscale calculates the new capacity determined by the **scaleAction** of each of those rules. Then it scales out to the maximum of those capacities, to ensure service availability.

For example, let's say there is a virtual machine scale set with a current capacity of 10. There are two scale-out rules: one that increases capacity by 10 percent, and one that increases capacity by 3 counts. The first rule would result in a new capacity of 11, and the second rule would result in a capacity of 13. To ensure service availability, Autoscale chooses the action that results in the maximum capacity, so the second rule is chosen.

If no scale-out rules are triggered, Autoscale evaluates all the scale-in rules (rules with **direction = “Decrease”**). Autoscale only takes a scale-in action if all of the scale-in rules are triggered.

Autoscale calculates the new capacity determined by the **scaleAction** of each of those rules. Then it chooses the scale action that results in the maximum of those capacities to ensure service availability.

For example, let's say there is a virtual machine scale set with a current capacity of 10. There are two scale-in rules: one that decreases capacity by 50 percent, and one that decreases capacity by 3 counts. The first rule would result in a new capacity of 5, and the second rule would result in a capacity of 7. To ensure service availability, Autoscale chooses the action that results in the maximum capacity, so the second rule is chosen.

## Next steps
Learn more about Autoscale by referring to the following:

* [Overview of autoscale](../../azure-monitor/platform/autoscale-overview.md)
* [Azure Monitor autoscale common metrics](../../azure-monitor/platform/autoscale-common-metrics.md)
* [Best practices for Azure Monitor autoscale](../../azure-monitor/platform/autoscale-best-practices.md)
* [Use autoscale actions to send email and webhook alert notifications](../../azure-monitor/platform/autoscale-webhook-email.md)
* [Autoscale REST API](https://msdn.microsoft.com/library/dn931953.aspx)

