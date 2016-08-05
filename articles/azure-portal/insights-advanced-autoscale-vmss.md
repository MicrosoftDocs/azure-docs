<properties
	pageTitle="Azure Insights: Advanced Autoscale configuration using ARM templates for VM Scale Sets | Microsoft Azure"
	description="Configure autoscale for VM Scale Sets based on multiple rules and profiles with email and webhoook notifications for scale actions."
	authors="kamathashwin"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/04/2016"
	ms.author="ashwink"/>

# Advanced Autoscale configuration using Resource Manager templates for VM Scale Sets

You can scale out and in Virtual Machine Scale Sets (VMSS) based on performance metric thresholds, by a recurring schedule, or by a particular date. You can also configure email and webhook notifications for scale actions. This walkthrough will show an example of configuring all of the above using a Resource Manager template on a VM Scale Set.

>[AZURE.NOTE] While this walkthrough explains the steps for VM Scale Sets, you can apply the same for autoscaling Cloud Services and Web Apps.
If you want to have a simple scale in/out setting on a VM Scale Set based on a simple performance metric such as CPU, please refer to the [Linux](../virtual-machines/virtual-machine-scale-sets-linux-autoscale.md) and [Windows](../virtual-machines/virtual-machine-scale-sets-windows-autoscale.md) documents


## Walkthrough
In this walkthrough, we use [Azure Resource Explorer](https://resources.azure.com/) to configure and update the autoscale setting for a VMSS. Azure Resource Explorer is an easy way to manage Azure resources via Resource Manager templates. If you are new to Azure Resource Explorer, tool, please read [this introduction](https://azure.microsoft.com/blog/azure-resource-explorer-a-new-tool-to-discover-the-azure-api/).

1. Deploy a new VMSS with basic autoscale setting. This article uses the one from the Azure QuickStart Gallery which has a Windows VMSS with basic autoscale template. This works the same way for Linux VMSS instances too.

2. After the VMSS is created, navigate to the VMSS resource from Azure Resource Explorer. You will see the following under Microsoft.Insights node.

	![Azure Explorer](./media/insights-advanced-autoscale-vmss/azure_explorer_navigate.png)

	The template execution has created a default autoscale setting with the name **'autoscalewad'**.   On the right-hand side you can view the full definition of this autoscale setting. In this case, the default autoscale setting comes with a CPU% based scale-out and scale-in rule.

3. You can now add more profiles and rules based on the schedule or specific requirements. We create an autoscale setting with 3 profiles. To understand profiles and rules in autoscale, please review [Autoscale Best Practices](./insights-autoscale-best-practices.md). 

    | Profiles & Rules | Description |
	|---------|-------------------------------------|
	| **Profile** | **Performance/metric based**    |
	| Rule    | Service Bus Queue Message Count > x |
	| Rule    | Service Bus Queue Message Count < y |
	| Rule    | CPU%,< n                            |
	| Rule    | CPU% < p                            |
	| **Profile** | **Weekday morning hours,(no rules)**    |
	| **Profile** | **Product Launch day (no rules)**       |

4. Here is a hypothetical scaling scenario that we will use for the purpose of this walkthrough.
	- _**Load based** - I'd like to scale out or in based on the load on my application hosted on my VMSS._
	- _**Message Queue size** - I use a Service Bus Queue for the incoming messages to my application. I use the queue's message count and CPU% and configure a default profile to trigger a scale action if either of message count or CPU hits the threshold._
	- _**Time of week and day** - I want a weekly recurring 'time of the day' based profile called 'Weekday Morning Hours'. Based on historical data, I know it is better to have certain number of VM instances to handle my application's load during this time._
	- _**Special Dates** - I added a 'Product Launch Day' profile. I plan ahead for specific dates so my application is ready to handle the load due marketing announcements and when we put a new product in the application._
	- _The last two profiles can also have other performance metric based rules within them, but in my case I decided not to have one and rely on the default performance metric based rules. Rules are optional for the recurring and date based profiles._

	Autoscale engine's prioritization of the profiles and rules is also captured in the [autoscaling best practices](insights-autoscale-best-practices.md) article.
	For a list of common metrics for autoscale, please refer [Common metrics for Autoscale](insights-autoscale-common-metrics.md)

5. Make sure you are on the **Read/Write** mode in Resource Explorer

	![Autoscalewad, default autoscale setting](./media/insights-advanced-autoscale-vmss/autoscalewad.png)

6. Click on Edit. **Replace** the 'profiles' element in autoscale setting with the following:

	![profiles](./media/insights-advanced-autoscale-vmss/profiles.png)

	```
	{
	        "name": "Perf_Based_Scale",
	        "capacity": {
	          "minimum": "2",
	          "maximum": "12",
	          "default": "2"
	        },
	        "rules": [
	          {
	            "metricTrigger": {
	              "metricName": "MessageCount",
	              "metricNamespace": "",
	              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ServiceBus/namespaces/mySB/queues/myqueue",
	              "timeGrain": "PT5M",
	              "statistic": "Average",
	              "timeWindow": "PT5M",
	              "timeAggregation": "Average",
	              "operator": "GreaterThan",
	              "threshold": 10
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
	              "metricName": "MessageCount",
	              "metricNamespace": "",
	              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ServiceBus/namespaces/mySB/queues/myqueue",
	              "timeGrain": "PT5M",
	              "statistic": "Average",
	              "timeWindow": "PT5M",
	              "timeAggregation": "Average",
	              "operator": "LessThan",
	              "threshold": 3
	            },
	            "scaleAction": {
	              "direction": "Decrease",
	              "type": "ChangeCount",
	              "value": "1",
	              "cooldown": "PT5M"
	            }
	          },
	          {
	            "metricTrigger": {
	              "metricName": "\\Processor(_Total)\\% Processor Time",
	              "metricNamespace": "",
	              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/<this_vmss_name>",
	              "timeGrain": "PT5M",
	              "statistic": "Average",
	              "timeWindow": "PT30M",
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
	              "metricName": "\\Processor(_Total)\\% Processor Time",
	              "metricNamespace": "",
	              "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/<this_vmss_name>",
	              "timeGrain": "PT5M",
	              "statistic": "Average",
	              "timeWindow": "PT30M",
	              "timeAggregation": "Average",
	              "operator": "LessThan",
	              "threshold": 60
	            },
	            "scaleAction": {
	              "direction": "Increase",
	              "type": "ChangeCount",
	              "value": "1",
	              "cooldown": "PT5M"
	            }
	          }
	        ]
	      },
	      {
	        "name": "Weekday_Morning_Hours_Scale",
	        "capacity": {
	          "minimum": "4",
	          "maximum": "12",
	          "default": "4"
	        },
	        "rules": [],
	        "recurrence": {
	          "frequency": "Week",
	          "schedule": {
	            "timeZone": "Pacific Standard Time",
	            "days": [
	              "Monday",
	              "Tuesday",
	              "Wednesday",
	              "Thursday",
	              "Friday"
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
	        "name": "Product_Launch_Day",
	        "capacity": {
	          "minimum": "6",
	          "maximum": "20",
	          "default": "6"
	        },
	        "rules": [],
	        "fixedDate": {
	          "timeZone": "Pacific Standard Time",
	          "start": "2016-06-20T00:06:00Z",
	          "end": "2016-06-21T23:59:00Z"
	        }
	      }
	```
	For supported fields and their values, please refer [Autoscale REST API documentation](https://msdn.microsoft.com/en-us/library/azure/dn931928.aspx)

	Now your autoscale setting contains the 3 profiles explained above.

7. 	Finally let's look at the Autoscale **notification** section. Autoscale notifications allow you to do three things when a scale out or in action is successfully triggered.

	1. Notify the admin and co-admins of your subscription

	2. Email a set of users

	3. Trigger a webhook call. When fired, this webhook will send metadata about the autoscaling condition and the VMSS resource. To learn more about the payload of autoscale webhook, see [Configure Webhook & Email Notifications for Autoscale](./insights-autoscale-to-webhook-email.md).

	Add the following  to the Autoscale setting replacing your **notification** element whose value is null

	```
	"notifications": [
	      {
	        "operation": "Scale",
	        "email": {
	          "sendToSubscriptionAdministrator": true,
	          "sendToSubscriptionCoAdministrators": false,
	          "customEmails": [
	              "user1@mycompany.com",
	              "user2@mycompany.com"
	              ]
	        },
	        "webhooks": [
	          {
	            "serviceUri": "https://foo.webhook.example.com?token=abcd1234",
	            "properties": {
	              "optional_key1": "optional_value1",
	              "optional_key2": "optional_value2"
	            }
	          }
	        ]
	      }
	    ]

	```

	Hit **Put** button in Resource Explorer to update the autoscale setting.

You have updated an autoscale setting on a VM Scale set to include multiple scale profiles and scale notifications.

## Next Steps

Use these links to learn more about autoscaling.

[Common Metrics for Autoscale](./insights-autoscale-common-metrics.md)

[Best Practices for Azure Autoscale](./insights-autoscale-best-practices.md)

[Manage Autoscale using PowerShell](./insights-powershell-samples.md#create-and-manage-autoscale-settings)

[Manage Autoscale using CLI](./insights-cli-samples.md#autoscale)

[Configure Webhook & Email Notifications for Autoscale](./insights-autoscale-to-webhook-email.md)
