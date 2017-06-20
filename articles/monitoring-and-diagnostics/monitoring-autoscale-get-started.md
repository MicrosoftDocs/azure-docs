---
title: Get started with auto scale in Azure | Microsoft Docs
description: Learn how to scale your resource in Azure.
author: rajram
manager: rboucher
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: d37d3fda-8ef1-477c-a360-a855b418de84
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2017
ms.author: rajram

---
# Get started with auto scale in Azure
This article describes how to setup your auto scale setting for your resource in Azure portal.

Azure Monitor auto scale applies only to Virtual Machine Scale Sets (VMSS), cloud services, app service plans and app service environments. 

# Lets get started

## Discover the auto scale settings in your subscription(s)
You can discover all the resources for which auto scale is applicable in Azure Monitor. Follow the steps listed below for a step-by-step walkthrough.

- Open [Azure portal][1]
- Click on Azure Monitor icon in the left navigation pane.
  ![Launch Azure Monitor][2]
- Click on Autoscale setting to view all the resources for which auto scale is applicable, along with its current autoscale status
  ![Discover auto scale in Azure monitor][3]

You can use the filter pane at the top to scope down the list to select resources in a specific resource group, select specific resource types or select a specific resource.

For each resource, you will find the current instance count as well as its autoscale status. The auto scale status can be

- Not configured: You have not enabled auto scale setting yet for this resource
- Enabled: You have enabled auto scale setting for this resource
- Disabled: You have disabled auto scale setting for this resource

## Create your first auto scale setting

Lets now go through a simple step-by-step walkthrough to create your first autoscale setting.

- Open 'Autoscale' blade in Azure Monitor and select a resource you want to scale. (the steps below use an app service plan associated with a web app. You can [create your first ASP.NET web app in Azure in five minutes][4])
- In the scale setting blade for the resource, notice that the current instance count is 1. Click on 'Enable autoscale'.
  ![Scale setting for new web app][5]
- Provide a name for the scale setting, and the click on "Add a rule". Notice the scale rule options that opens as a context pane in the right hand side. By default, it sets the option to scale your instance count by 1 if the CPU percentage of the resource exceeds 70%. Leave it to its default values and click on Add.
  ![Create scale setting for a web app][6]
- You now created your first scale rule. Notice that the UX recommends best practices and states that 'It is recommended to have at least one scale in rule'. To do so, click on 'Add a rule' and set the 'Operator' to 'Less than', 'Threshold' to '20' and 'Operation' to 'Decrease count by'. You should now have a scale setting that scales out/scales in based on CPU usage.
  ![Scale based on cpu][8]
- Click on 'Save'

Congratulations. You now now succesfully created your first scale setting to auto scale your web app based on CPU usage.

> Note: The same steps are applicable to get started with a VMSS or cloud service role.

# Other considerations
## Scale based on a schedule
In addition to scale based on CPU always, you can also set your scale differently on specific days of the week.

- Click on 'Add a scale condition'
- Setting the scale mode and the rules is the same as the default condition
- Select 'Repeat specific days' for the schedule
- Select the days, and the start/end time when the scale condition should be applied for the selected days

![Scale condition based on schedule][9]
## Scale differently on specific dates
In addition to scale based on CPU always, you can also set your scale differently on specific dates.

- Click on 'Add a scale condition'
- Setting the scale mode and the rules is the same as the default condition
- Select 'Specify start/end dates' for the schedule
- Select the start/end dates, as well as the start/end time when the scale condition should be applied for the selected dates

![Scale condition based on dates][10]

## View the scale history of your resource
Whenever your resource is scaled up/down, there is an event logged in activity log. You can view the scale history of your resource for the last 24 hours by switching to the 'Run history' tab.

![Run history][11]

If you want to view the complete scale history (for upto 90 days), you can click on 'Click here to see more details'. This will launch the activity log with your resource and category as 'autoscale' pre-selected.

## View the scale definition of the resource
Auto scale setting is an ARM resource. You can view the scale definition in JSON by switching to the 'JSON' tab.

![Scale definition][12]

You can make changes in JSON directly, if required. These changes will get reflected on save.

## Disable autoscale and manually scale your instances
There might be times when you want to disbable your current scale setting and manually scale your resource.

Click on the 'Disable autoscale' button at the top.
![Disable autoscale][13]

Note that this option disables your configuration, and you can still get back to it once you enable auto scale again. You can now set the number of instances you want to scale to manually.

![Set manual scale][14]

You can always get back to autscale by clicking on 'Enable autoscale' and then 'save'.

<!--Reference-->
[1]:https://portal.azure.com
[2]: ./media/monitoring-autoscale-get-started/azure-monitor-launch.png
[3]: ./media/monitoring-autoscale-get-started/discover-autoscale-azure-monitor.png
[4]: https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-get-started-dotnet
[5]: ./media/monitoring-autoscale-get-started/scale-setting-new-web-app.png
[6]: ./media/monitoring-autoscale-get-started/create-scale-setting-web-app.png
[7]: ./media/monitoring-autoscale-get-started/scale-in-recommendation.png
[8]: ./media/monitoring-autoscale-get-started/scale-based-on-cpu.png
[9]: ./media/monitoring-autoscale-get-started/scale-condition-schedule.png
[10]: ./media/monitoring-autoscale-get-started/scale-condition-dates.png
[11]: ./media/monitoring-autoscale-get-started/scale-history.png
[12]: ./media/monitoring-autoscale-get-started/scale-definition-json.png
[13]: ./media/monitoring-autoscale-get-started/disable-autoscale.png
[14]: ./media/monitoring-autoscale-get-started/set-manualscale.png
