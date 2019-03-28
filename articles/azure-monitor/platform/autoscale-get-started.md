---
title: Get started with autoscale in Azure
description: "Learn how to scale your resource Web App, Cloud Service, Virtual Machine or Virtual Machine Scale set in Azure."
author: rajram
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/07/2017
ms.author: rajram
ms.subservice: autoscale
---
# Get started with Autoscale in Azure
This article describes how to set up your Autoscale settings for your resource in the Microsoft Azure portal.

Azure Monitor autoscale applies only to [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), and [API Management services](https://docs.microsoft.com/azure/api-management/api-management-key-concepts).

## Discover the Autoscale settings in your subscription
You can discover all the resources for which Autoscale is applicable in Azure Monitor. Use the following steps for a step-by-step walkthrough:

1. Open the [Azure portal.][1]
1. Click the Azure Monitor icon in the left pane.
  ![Open Azure Monitor][2]
1. Click **Autoscale** to view all the resources for which Autoscale is applicable, along with their current Autoscale status.
  ![Discover Autoscale in Azure Monitor][3]

You can use the filter pane at the top to scope down the list to select resources in a specific resource group, specific resource types, or a specific resource.

For each resource, you will find the current instance count and the Autoscale status. The Autoscale status can be:

- **Not configured**: You have not enabled Autoscale yet for this resource.
- **Enabled**: You have enabled Autoscale for this resource.
- **Disabled**: You have disabled Autoscale for this resource.

## Create your first Autoscale setting

Let's now go through a simple step-by-step walkthrough to create your first Autoscale setting.

1. Open the **Autoscale** blade in Azure Monitor and select a resource that you want to scale. (The following steps use an App Service plan associated with a web app. You can [create your first ASP.NET web app in Azure in 5 minutes.][4])
1. Note that the current instance count is 1. Click **Enable autoscale**.
  ![Scale setting for new web app][5]
1. Provide a name for the scale setting, and then click **Add a rule**. Notice the scale rule options that open as a context pane on the right side. By default, this sets the option to scale your instance count by 1 if the CPU percentage of the resource exceeds 70 percent. Leave it at its default values and click **Add**.
  ![Create scale setting for a web app][6]
1. You've now created your first scale rule. Note that the UX recommends best practices and states that "It is recommended to have at least one scale in rule." To do so:

    a. Click **Add a rule**.

    b. Set **Operator** to **Less than**.

    c. Set **Threshold** to **20**.

    d. Set **Operation** to **Decrease count by**.

   You should now have a scale setting that scales out/scales in based on CPU usage.
   ![Scale based on CPU][8]
1. Click **Save**.

Congratulations! You've now successfully created your first scale setting to autoscale your web app based on CPU usage.

> [!NOTE]
> The same steps are applicable to get started with a virtual machine scale set or cloud service role.

## Other considerations
### Scale based on a schedule
In addition to scale based on CPU, you can set your scale differently for specific days of the week.

1. Click **Add a scale condition**.
1. Setting the scale mode and the rules is the same as the default condition.
1. Select **Repeat specific days** for the schedule.
1. Select the days and the start/end time for when the scale condition should be applied.

![Scale condition based on schedule][9]
### Scale differently on specific dates
In addition to scale based on CPU, you can set your scale differently for specific dates.

1. Click **Add a scale condition**.
1. Setting the scale mode and the rules is the same as the default condition.
1. Select **Specify start/end dates** for the schedule.
1. Select the start/end dates and the start/end time for when the scale condition should be applied.

![Scale condition based on dates][10]

### View the scale history of your resource
Whenever your resource is scaled up or down, an event is logged in the activity log. You can view the scale history of your resource for the past 24 hours by switching to the **Run history** tab.

![Run history][11]

If you want to view the complete scale history (for up to 90 days), select **Click here to see more details**. The activity log opens, with Autoscale pre-selected for your resource and category.

### View the scale definition of your resource
Autoscale is an Azure Resource Manager resource. You can view the scale definition in JSON by switching to the **JSON** tab.

![Scale definition][12]

You can make changes in JSON directly, if required. These changes will be reflected after you save them.

### Disable Autoscale and manually scale your instances
There might be times when you want to disable your current scale setting and manually scale your resource.

Click the **Disable autoscale** button at the top.
![Disable Autoscale][13]

> [!NOTE]
> This option disables your configuration. However, you can get back to it after you enable Autoscale again.

You can now set the number of instances that you want to scale to manually.

![Set manual scale][14]

You can always return to Autoscale by clicking **Enable autoscale** and then **Save**.

## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)

<!--Reference-->
[1]:https://portal.azure.com
[2]: ./media/autoscale-get-started/azure-monitor-launch.png
[3]: ./media/autoscale-get-started/discover-autoscale-azure-monitor.png
[4]: https://docs.microsoft.com/azure/app-service/app-service-web-get-started-dotnet
[5]: ./media/autoscale-get-started/scale-setting-new-web-app.png
[6]: ./media/autoscale-get-started/create-scale-setting-web-app.png
[7]: ./media/autoscale-get-started/scale-in-recommendation.png
[8]: ./media/autoscale-get-started/scale-based-on-cpu.png
[9]: ./media/autoscale-get-started/scale-condition-schedule.png
[10]: ./media/autoscale-get-started/scale-condition-dates.png
[11]: ./media/autoscale-get-started/scale-history.png
[12]: ./media/autoscale-get-started/scale-definition-json.png
[13]: ./media/autoscale-get-started/disable-autoscale.png
[14]: ./media/autoscale-get-started/set-manualscale.png

