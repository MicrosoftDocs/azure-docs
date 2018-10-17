---
title: Advanced Autoscale using Azure Virtual Machines
description: Uses Resource Manager and VM Scale Sets with multiple rules and profiles which send email and call webhook URLs with scale actions.
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 02/22/2016
ms.author: ancav
ms.component: autoscale
---

# Advanced autoscale configuration using Resource Manager templates for VM Scale Sets
You can scale-in and scale-out in Virtual Machine Scale Sets based on performance metric thresholds, by a recurring schedule, or by a particular date. You can also configure email and webhook notifications for scale actions. This walkthrough shows an example of configuring all these objects using a Resource Manager template on a VM Scale Set.

> [!NOTE]
> While this walkthrough explains the steps for VM Scale Sets, the same information applies to autoscaling [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), and [API Management services](https://docs.microsoft.com/azure/api-management/api-management-key-concepts)
> For a simple scale in/out setting on a VM Scale Set based on a simple performance metric such as CPU, refer to the [Linux](../virtual-machine-scale-sets/virtual-machine-scale-sets-linux-autoscale.md) and [Windows](../virtual-machine-scale-sets/virtual-machine-scale-sets-windows-autoscale.md) documents
>
>

## Walkthrough
In this walkthrough, we use [Azure Resource Explorer](https://resources.azure.com/) to configure and update the autoscale setting for a scale set. Azure Resource Explorer is an easy way to manage Azure resources via Resource Manager templates. If you are new to Azure Resource Explorer tool, read [this introduction](https://azure.microsoft.com/blog/azure-resource-explorer-a-new-tool-to-discover-the-azure-api/).

1. Deploy a new scale set with a basic autoscale setting. This article uses the one from the Azure QuickStart Gallery, which has a Windows scale set with a basic autoscale template. Linux scale sets work the same way.
2. After the scale set is created, navigate to the scale set resource from Azure Resource Explorer. You see the following under Microsoft.Insights node.

    ![Azure Explorer](./media/insights-advanced-autoscale-vmss/azure_explorer_navigate.png)

    The template execution has created a default autoscale setting with the name **'autoscalewad'**. On the right-hand side, you can view the full definition of this autoscale setting. In this case, the default autoscale setting comes with a CPU% based scale-out and scale-in rule.  

3. You can now add more profiles and rules based on the schedule or specific requirements. We create an autoscale setting with three profiles. To understand profiles and rules in autoscale, review [Autoscale Best Practices](insights-autoscale-best-practices.md).  

    | Profiles & Rules | Description |
    |--- | --- |
    | **Profile** |**Performance/metric based** |
    | Rule |Service Bus Queue Message Count > x |
    | Rule |Service Bus Queue Message Count < y |
    | Rule |CPU% > n |
    | Rule |CPU% < p |
    | **Profile** |**Weekday morning hours (no rules)** |
    | **Profile** |**Product Launch day (no rules)** |

4. Here is a hypothetical scaling scenario that we use for this walk-through.

    * **Load based** - I'd like to scale out or in based on the load on my application hosted on my scale set.*
    * **Message Queue size** - I use a Service Bus Queue for the incoming messages to my application. I use the queue's message count and CPU% and configure a default profile to trigger a scale action if either of message count or CPU hits the threshold.*
    * **Time of week and day** - I want a weekly recurring 'time of the day' based profile called 'Weekday Morning Hours'. Based on historical data, I know it is better to have certain number of VM instances to handle my application's load during this time.*
    * **Special Dates** - I added a 'Product Launch Day' profile. I plan ahead for specific dates so my application is ready to handle the load due marketing announcements and when we put a new product in the application.*
    * *The last two profiles can also have other performance metric based rules within them. In this case, I decided not to have one and instead to rely on the default performance metric based rules. Rules are optional for the recurring and date-based profiles.*

    Autoscale engine's prioritization of the profiles and rules is also captured in the [autoscaling best practices](insights-autoscale-best-practices.md) article.
    For a list of common metrics for autoscale, refer [Common metrics for Autoscale](insights-autoscale-common-metrics.md)

5. Make sure you are on the **Read/Write** mode in Resource Explorer

    ![Autoscalewad, default autoscale setting](./media/insights-advanced-autoscale-vmss/autoscalewad.png)

6. Click Edit. **Replace** the 'profiles' element in autoscale setting with the following configuration:

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
                  "metricName": "Percentage CPU",
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
                  "metricName": "Percentage CPU",
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
                  "direction": "Decrease",
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
    For supported fields and their values, see [Autoscale REST API documentation](https://msdn.microsoft.com/library/azure/dn931928.aspx). Now your autoscale setting contains the three profiles explained previously.

7. Finally, look at the Autoscale **notification** section. Autoscale notifications allow you to do three things when a scale-out or in action is successfully triggered.
   - Notify the admin and co-admins of your subscription
   - Email a set of users
   - Trigger a webhook call. When fired, this webhook sends metadata about the autoscaling condition and the scale set resource. To learn more about the payload of autoscale webhook, see [Configure Webhook & Email Notifications for Autoscale](insights-autoscale-to-webhook-email.md).

   Add the following to the Autoscale setting replacing your **notification** element whose value is null

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

[TroubleShoot Autoscale with Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-troubleshoot.md)

[Common Metrics for Autoscale](insights-autoscale-common-metrics.md)

[Best Practices for Azure Autoscale](insights-autoscale-best-practices.md)

[Manage Autoscale using PowerShell](insights-powershell-samples.md#create-and-manage-autoscale-settings)

[Manage Autoscale using CLI](insights-cli-samples.md#autoscale)

[Configure Webhook & Email Notifications for Autoscale](insights-autoscale-to-webhook-email.md)
