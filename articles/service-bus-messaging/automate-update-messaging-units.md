---
title: Azure Service Bus - Automatically update messaging units 
description: This article shows you how you can use automatically update messaging units of a Service Bus namespace.
ms.topic: how-to
ms.date: 05/16/2022
---

# Automatically update messaging units of an Azure Service Bus namespace 
Autoscale allows you to have the right amount of resources running to handle the load on your application. It allows you to add resources to handle increases in load and also save money by removing resources that are sitting idle. See [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md) to learn more about the Autoscale feature of Azure Monitor. 

Service Bus Premium Messaging provides resource isolation at the CPU and memory level so that each customer workload runs in isolation. This resource container is called a **messaging unit**. To learn more about messaging units, see [Service Bus Premium Messaging](service-bus-premium-messaging.md). 

By using the Autoscale feature for Service Bus premium namespaces, you can specify a minimum and maximum number of [messaging units](service-bus-premium-messaging.md) and add or remove messaging units automatically based on a set of rules. 

For example, you can implement the following scaling scenarios for Service Bus namespaces using the Autoscale feature. 

- Increase messaging units for a Service Bus namespace when the CPU usage of the namespace goes above 75%. 
- Decrease messaging units for a Service Bus namespace when the CPU usage of the namespace goes below 25%. 
- Use more messaging units during business hours and fewer during off hours. 

This article shows you how you can automatically scale a Service Bus namespace (update [messaging units](service-bus-premium-messaging.md)) using the Azure portal and an Azure Resource Manager template.

> [!IMPORTANT]
> This article applies to only the **premium** tier of Azure Service Bus. 

## Configure using the Azure portal
In this section, you learn how to use the Azure portal to configure autoscaling of messaging units for a Service Bus namespace. 

## Autoscale setting page
First, follow these steps to navigate to the **Autoscale settings** page for your Service Bus namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar, type **Service Bus**, select **Service Bus** from the drop-down list, and press **ENTER**. 
1. Select your **premium namespace** from the list of namespaces. 
1. Switch to the **Scale** page. 

    :::image type="content" source="./media/automate-update-messaging-units/scale-page.png" alt-text="Service Bus Namespace - Scale page":::

## Manual scale 
This setting allows you to set a fixed number of messaging units for the namespace. 

1. On the **Autoscale setting** page, select **Manual scale** if it isn't already selected. 
1. For **Messaging units** setting, select the number of messaging units from the drop-down list.
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/automate-update-messaging-units/manual-scale.png" alt-text="Manually scale messaging units":::       


## Custom autoscale - Default condition
You can configure automatic scaling of messaging units by using conditions. This scale condition is executed when none of the other scale conditions match. You can set the default condition in one of the following ways:

- Scale based on a metric (such as CPU or memory usage)
- Scale to specific number of messaging units

You can't set a schedule to autoscale on a specific days or date range for a default condition. This scale condition is executed when none of the other scale conditions with schedules match. 

> [!NOTE]
> To improve the receive throughput, Service Bus keeps some messages in its cache. Service Bus trims the cache only when memory usage exceeds a certain high threshold like 90%. So if an entity is sending messages but not receiving them, those messages are cached and it reflects in increased memory usage. There is nothing to concern about, as Service Bus trims the cache if needed, which eventually causes the memory usage to go down. Memory will not cause any issue unless there is performance or any other issues with the namespace. We recommend that you use the CPU usage metric for autoscaling with Service Bus. 

### Scale based on a metric
The following procedure shows you how to add a condition to automatically increase messaging units (scale out) when the CPU usage is greater than 75% and decrease messaging units (scale in) when the CPU usage is less than 25%. Increments are done from 1 to 2, 2 to 4, 4 to 8, and 8 to 16. Similarly, decrements are done from 16 to 8, 8 to 4, 4 to 2, and 2 to 1. 

1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. Select the **pencil** icon to edit the text. 
1. Select **Scale based on a metric** for **Scale mode**. 
1. Select **+ Add a rule**. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-add-rule-link.png" alt-text="Default - scale based on a metric":::    
1. On the **Scale rule** page, follow these steps:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they're **Greater than** and **75** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Increase**. 
    1. Then, select **Add**
    
        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-75.png" alt-text="Default - scale out if CPU usage is greater than 75%":::       

        > [!NOTE]
        > The autoscale feature increases the messaging units for the namespace if the overall CPU usage goes above 75% in this example. Increments are done from 1 to 2, 2 to 4, 4 to 8, and 8 to 16. 
1. Select **+ Add a rule** again, and follow these steps on the **Scale rule** page:
    1. Select a metric from the **Metric name** drop-down list. In this example, it's **CPU**. 
    1. Select an operator and threshold values. In this example, they're **Less than** and **25** for **Metric threshold to trigger scale action**. 
    1. Select an **operation** in the **Action** section. In this example, it's set to **Decrease**. 
    1. Then, select **Add** 

        :::image type="content" source="./media/automate-update-messaging-units/scale-rule-cpu-25.png" alt-text="Default - scale in if CPU usage is less than 25%":::       

        > [!NOTE]
        > The autoscale feature decreases the messaging units for the namespace if the overall CPU usage goes below 25% in this example. Decrements are done from 16 to 8, 8 to 4, 4 to 2, and 2 to 1. 
1. Set the **minimum** and **maximum** and **default** number of messaging units.

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-metric-based.png" alt-text="Default rule based on a metric":::
1. Select **Save** on the toolbar to save the autoscale setting. 
        
### Scale to specific number of messaging units
Follow these steps to configure the rule to scale the namespace to use specific number of messaging units. Again, the default condition is applied when none of the other scale conditions match. 

1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. In the **Default** section of the page, specify a **name** for the default condition. 
1. Select **Scale to specific messaging units** for **Scale mode**. 
1. For **Messaging units**, select the number of default messaging units. 

    :::image type="content" source="./media/automate-update-messaging-units/default-scale-messaging-units.png" alt-text="Default - scale to specific messaging units":::       

## Custom autoscale - additional conditions
The previous section shows you how to add a default condition for the autoscale setting. This section shows you how to add more conditions to the autoscale setting. For these additional non-default conditions, you can set a schedule based on specific days of a week or a date range. 

### Scale based on a metric
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
1. Confirm that the **Scale based on a metric** option is selected. 
1. Select **+ Add a rule** to add a rule to increase messaging units when the overall CPU usage goes above 75%. Follow steps from the [default condition](#custom-autoscale---default-condition) section. 
5. Set the **minimum** and **maximum** and **default** number of messaging units.
6. You can also set a **schedule** on a custom condition (but not on the default condition). You can either specify start and end dates for the condition (or) select specific days (Monday, Tuesday, and so on.) of a week. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** (as shown in the following image) for the condition to be in effect. 

       :::image type="content" source="./media/automate-update-messaging-units/custom-min-max-default.png" alt-text="Minimum, maximum, and default values for number of messaging units":::
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply. 

        :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days.png" alt-text="Repeat specific days":::
  
### Scale to specific number of messaging units
1. On the **Autoscale setting** page, select **Custom auto scale** for the **Choose how to scale your resource** option. 
1. Select **Add a scale condition** under the **Default** block. 

    :::image type="content" source="./media/automate-update-messaging-units/add-scale-condition-link.png" alt-text="Custom - add a scale condition link":::    
1. Specify a **name** for the condition. 
2. Select **scale to specific messaging units** option for **Scale mode**. 
1. Select the number of **messaging units** from the drop-down list. 
6. For the **schedule**, specify either start and end dates for the condition (or) select specific days (Monday, Tuesday, and so on.) of a week and times. 
    1. If you select **Specify start/end dates**, select the **Timezone**, **Start date and time** and **End date and time** for the condition to be in effect. 
    
    :::image type="content" source="./media/automate-update-messaging-units/scale-specific-messaging-units-start-end-dates.png" alt-text="scale to specific messaging units - start and end dates":::        
    1. If you select **Repeat specific days**, select the days of the week, timezone, start time, and end time when the condition should apply.
    
    :::image type="content" source="./media/automate-update-messaging-units/repeat-specific-days-2.png" alt-text="scale to specific messaging units - repeat specific days":::

    
    To learn more about how autoscale settings work, especially how it picks a profile or condition and evaluates multiple rules, see [Understand Autoscale settings](../azure-monitor/autoscale/autoscale-understanding-settings.md).          

    > [!NOTE]
    > - The metrics you review to make decisions on autoscaling may be 5-10 minutes old. When you are dealing with spiky workloads, we recommend that you have shorter durations for scaling up and longer durations for scaling down (> 10 minutes) to ensure that there are enough messaging units to process spiky workloads. 
    > 
    > - If you see failures due to lack of capacity (no messaging units available), raise a support ticket with us.  

## Run history
Switch to the **Run history** tab on the **Scale** page to see a chart that plots number of messaging units as observed by the autoscale engine. If the chart is empty, it means either autoscale wasn't configured or configured but disabled, or is in a cool down period.  

:::image type="content" source="./media/automate-update-messaging-units/run-history.png" alt-text="Screenshot showing **Run history** on the **Scale** page.":::

## Notifications
Switch to the **Notify** tab on the **Scale** page to:

- Enable sending notification emails to administrators, co-administrators, and any additional administrators. 
- Enable sending notification emails to an HTTP or HTTPS endpoints exposed by webhooks. 

    :::image type="content" source="./media/automate-update-messaging-units/notify-page.png" alt-text="Screenshot showing the **Notify** tab of the **Scale** page.":::

## Configure using a Resource Manager template
You can use the following sample Resource Manager template to create a Service Bus namespace with a queue, and to configure autoscale settings for the namespace. In this example, two scale conditions are specified. 

- Default scale condition: increase messaging units when the average CPU usage goes above 75% and decrease messaging units when the average CPU usage goes below 25%. 
- Assign two messaging units to the namespace on weekends.

### Template

```json
{
	"$schema": "https: //schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"serviceBusNamespaceName": {
			"type": "String",
			"metadata": {
				"description": "Name of the Service Bus namespace"
			}
		},
		"serviceBusQueueName": {
			"type": "String",
			"metadata": {
				"description": "Name of the Queue"
			}
		},
		"autoScaleSettingName": {
			"type": "String",
			"metadata": {
				"description": "Name of the auto scale setting."
			}
		},
		"location": {
			"defaultValue": "[resourceGroup().location]",
			"type": "String",
			"metadata": {
				"description": "Location for all resources."
			}
		}
	},
	"resources": [{
			"type": "Microsoft.ServiceBus/namespaces",
			"apiVersion": "2021-11-01",
			"name": "[parameters('serviceBusNamespaceName')]",
			"location": "[parameters('location')]",
			"sku": {
				"name": "Premium"
			},
			"properties": {}
		},
		{
			"type": "Microsoft.ServiceBus/namespaces/queues",
			"apiVersion": "2021-11-01",
			"name": "[format('{0}/{1}', parameters('serviceBusNamespaceName'), parameters('serviceBusQueueName'))]",
			"dependsOn": [
				"[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]"
			],
			"properties": {
				"lockDuration": "PT5M",
				"maxSizeInMegabytes": 1024,
				"requiresDuplicateDetection": false,
				"requiresSession": false,
				"defaultMessageTimeToLive": "P10675199DT2H48M5.4775807S",
				"deadLetteringOnMessageExpiration": false,
				"duplicateDetectionHistoryTimeWindow": "PT10M",
				"maxDeliveryCount": 10,
				"autoDeleteOnIdle": "P10675199DT2H48M5.4775807S",
				"enablePartitioning": false,
				"enableExpress": false
			}
		},
		{
			"type": "Microsoft.Insights/autoscaleSettings",
			"apiVersion": "2021-05-01-preview",
			"name": "[parameters('autoScaleSettingName')]",
			"location": "East US",
			"dependsOn": [
				"[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]"
			],
			"tags": {},
			"properties": {
				"name": "[parameters('autoScaleSettingName')]",
				"enabled": true,
				"predictiveAutoscalePolicy": {
					"scaleMode": "Disabled",
					"scaleLookAheadTime": null
				},
				"targetResourceUri": "[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]",
				"profiles": [{
						"name": "Increase messaging units to 2 on weekends",
						"capacity": {
							"minimum": "2",
							"maximum": "2",
							"default": "2"
						},
						"rules": [],
						"recurrence": {
							"frequency": "Week",
							"schedule": {
								"timeZone": "Eastern Standard Time",
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
						"name": "{\"name\":\"Scale Out at 75% CPU and Scale In at 25% CPU\",\"for\":\"Increase messaging units to 4 on weekends\"}",
						"capacity": {
							"minimum": "1",
							"maximum": "8",
							"default": "2"
						},
						"rules": [{
								"scaleAction": {
									"direction": "Increase",
									"type": "ServiceAllowedNextValue",
									"value": "1",
									"cooldown": "PT5M"
								},
								"metricTrigger": {
									"metricName": "NamespaceCpuUsage",
									"metricNamespace": "microsoft.servicebus/namespaces",
									"metricResourceUri": "[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]",
									"operator": "GreaterThan",
									"statistic": "Average",
									"threshold": 75,
									"timeAggregation": "Average",
									"timeGrain": "PT1M",
									"timeWindow": "PT10M",
									"Dimensions": [],
									"dividePerInstance": false
								}
							},
							{
								"scaleAction": {
									"direction": "Decrease",
									"type": "ServiceAllowedNextValue",
									"value": "1",
									"cooldown": "PT5M"
								},
								"metricTrigger": {
									"metricName": "NamespaceCpuUsage",
									"metricNamespace": "microsoft.servicebus/namespaces",
									"metricResourceUri": "[resourceId('Microsoft.ServiceBus/namespaces', parameters('serviceBusNamespaceName'))]",
									"operator": "LessThan",
									"statistic": "Average",
									"threshold": 25,
									"timeAggregation": "Average",
									"timeGrain": "PT1M",
									"timeWindow": "PT10M",
									"Dimensions": [],
									"dividePerInstance": false
								}
							}
						],
						"recurrence": {
							"frequency": "Week",
							"schedule": {
								"timeZone": "Eastern Standard Time",
								"days": [
									"Saturday",
									"Sunday"
								],
								"hours": [
									18
								],
								"minutes": [
									0
								]
							}
						}
					}
				],
				"notifications": [],
				"targetResourceLocation": "East US"
			}
		}
	]
}
```

You can also generate a JSON example for an autoscale setting resource from the Azure portal. After you configure autoscale settings in the Azure portal, select **JSON** on the command bar of the **Scale** page.

:::image type="content" source="./media/automate-update-messaging-units/auto-scale-json.png" alt-text="Image showing the selection of the JSON button on the command bar of the **Scale** page in the Azure portal.":::

Then, include the JSON in the `resources` section of a Resource Manager template as shown in the preceding example. 

## Additional considerations
When you use the **Custom autoscale** option with the **Default** condition or profile,  messaging units are increased (1 -> 2 -> 4 -> 8 -> 16) or decreased (16 -> 8 -> 4 -> 2 -> 1) gradually. 

When you create additional conditions, the messaging units may not be gradually increased or decreased. Suppose, you have two profiles defined as shown in the following example. At 06:00 UTC, messaging units are set to 16, and at 21:00 UTC, they're reduced to 1.

```json
{

	"Profiles": [
		{
			"Name": "standardProfile",
			"Capacity": {
				"Minimum": "16",
				"Maximum": "16",
				"Default": "16"
			},
			"Rules": [],
			"Recurrence": {
				"Frequency": "Week",
				"Schedule": {
					"TimeZone": "UTC",
					"Days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
					],
					"Hours": [6],
					"Minutes": [0]
				}
			}
		},
		{
			"Name": "outOfHoursProfile",
			"Capacity": {
				"Minimum": "1",
				"Maximum": "1",
				"Default": "1"
			},
			"Rules": [],
			"Recurrence": {
				"Frequency": "Week",
				"Schedule": {
					"TimeZone": "UTC",
					"Days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
					"Hours": [21],
					"Minutes": [0]
				}
			}
		}
	]
}
```

We recommend that you create rules such that messaging units are increased or decreases gradually. 

## Next steps
To learn about messaging units, see the [Premium messaging](service-bus-premium-messaging.md)
