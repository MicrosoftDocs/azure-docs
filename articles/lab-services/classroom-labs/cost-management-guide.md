---
title: Cost management guide for Azure Lab Services
description: Understand the different ways to view costs for Lab Services.
services: lab-services
author: rbest

ms.author: rbest
ms.date: 05/09/2020
ms.topic: article
ms.service: lab-services
---

# Cost management for Azure Lab Services

Cost management can be broken down into two distinct areas: cost estimation and cost analysis.  Cost estimation occurs when setting up the lab to make sure that initial structure of the lab will fit within the expected budget.  Cost analysis usually occurs at the end of the month to analyze the costs and determine the necessary actions for the next month.

## Estimating the lab costs

Each lab dashboard has a **Costs & Billing** section that lays out a rough estimate of what the lab will cost for the month.  The cost estimate summarizes the hour usage with the maximum number of users by the estimated cost per hours.  To get the most accurate estimate set up the lab, including the [schedule](how-to-create-schedules.md), and the dashboard will reflect the estimated cost.  

This estimate may not be all the possible costs, there are a few resources that aren't included.  The template preparation cost isn't factored into the cost estimate.  It may vary significantly in the amount of time needed to create the template. The cost to run the template is the same as overall lab cost per hour. Any [Shared image gallery](how-to-use-shared-image-gallery.md) costs aren't included into the lab dashboard as a gallery may be shared between multiple labs.  Lastly, hours incurred when the lab creator starts a machine are excluded from this estimate.

> [!div class="mx-imgBorder"]
> ![Dashboard cost estimation](../media/cost-management-guide/dashboard-cost-estimation.png)

## Analyzing previous months usage

The cost analysis is for reviewing previous months usage to help determine any adjustments for the lab.  The breakdown of costs in the past can be found in the [Subscription Cost Analysis](https://docs.microsoft.com/azure/cost-management-billing/costs/quick-acm-cost-analysis).  In the Azure portal, you can type "Subscriptions" in the upper search field then select the Subscriptions option.  

> [!div class="mx-imgBorder"]
> ![Subscription search](../media/cost-management-guide/subscription-search.png)

Select the specific subscription that is to be reviewed.

> [!div class="mx-imgBorder"]
> ![Subscription selection](../media/cost-management-guide/subscription-select.png)

 Select "Cost Analysis" in the left-hand pane under **Cost Management**.

 > [!div class="mx-imgBorder"]
> ![Subscription cost analysis](../media/cost-management-guide/subscription-cost-analysis.png)

This dashboard will allow in-depth cost analysis, including the ability to export to different file types on a schedule.  The Cost Management has numerous capabilities for more information, see [Cost Management Billing Overview](https://docs.microsoft.com/azure/cost-management-billing/cost-management-billing-overview)

Filtering by the resource type: `microsoft.labservices/labaccounts` will show only the cost associated with Lab Services.

## Understanding the usage

Below is a sample of the cost analysis.

> [!div class="mx-imgBorder"]
> ![Subscription cost analysis](../media/cost-management-guide/cost-analysis.png)

By default there are six columns: Resource, Resource Type, Location, Resource group name, Tags, Cost.  The Resource column contains the information about the Lab account, Lab Name, and the VM.  The rows with Lab account / Lab Name / default is the cost for the lab, which can be seen on the second and third rows.  The used VMs will have a cost under the Lab account / Lab Name / default / VM name.  In this example, adding the first row with second row, both starting with "aaalab / dockerlab" will give you the total cost for the lab "dockerlab" in the "aaalab" Lab Account.

To get Shared image gallery information, change the resource type to `Microsoft.Compute/Galleries`, which will give you the overall cost for the image gallery.  The Share Image galleries may not show up in the costs depending on where the gallery is stored.

> [!NOTE]
> Shared Image Gallery is connected to the lab account.  That means multiple labs could use the same image.

## Separating costs

Some universities have used the lab account and the resource group as ways to separate out the different classes.  Each class will have its own lab account and resource group. In the cost analysis pane, add a filter based on the resource group name with the appropriate resource group name for the class and only the costs for that class will be visible.  This allows a clearer delineation between the different classes when viewing the costs.  The [scheduled export](https://docs.microsoft.com/azure/cost-management-billing/costs/tutorial-export-acm-data) feature of the Cost analysis allows for the costs of each class to be downloaded in separate files.

## Managing costs

Depending on the type of class, there are ways to manage costs to reduce that the VMs are running without a student using the machine.

### Auto-shutdown on disconnect

At the lab creation, the lab owner can set the VMs in the lab to [shut down when the RDP connection to the VM is disconnected](how-to-enable-shutdown-disconnect.md).  This setting reduces the scenario where the student disconnects but forgets to stop the VM.

### Quota vs scheduled time

Understanding [quota time](classroom-labs-concepts.md#quota) vs [scheduled time](classroom-labs-concepts.md#schedules) will allow the lab owner to configure the lab to better fit the needs of the professor and the students.  Scheduled time is a set time where all the student VMs have been started and are available to connect to.  Commonly scheduled is used in the situation when all the students will have their own VM, and are following the professor's directions at a set time during the day like  class hours.  The downside is that all the student VMs are started and are accruing costs, even if a student doesn't log in to the VM.  Quota time is time allocated to each student that they can use at their discretion and is often used for independent studying. The VMs are not started until the student starts the VM.  

A lab may use either quota time, scheduled time, or a combination of both. If a class doesn't need the scheduled time, then use only quota time for the most effective use of the VMs.

### Scheduled event - stop only

In the Schedule you can add a stop only event type, which will stop all machines at a specific time.  Some lab owners have set a stop only event for every day at midnight to reduce the cost and quota usage when a student forgets to shut down the VM they are using.  The downside to this type of event is that all VMs will be shut down even if the student is using the VM.

### Other costs related to Labs 

There are costs that aren't rolled into the Lab Services, but can be tied to a lab service.  A shared image gallery can be connected to labs but doesn't show under the Lab services costs and does have costs.  To help keeps overall costs down you should remove any unused images from the gallery as the images have an inherit storage cost.  Labs can have connections to other Azure resource by a virtual network (VNet) when a lab is removed you should remove the VNet and the other resources.

## Conclusion

Hopefully, the information above will give you a better understanding of the usage costs and how to use the tools provide to reduce excess costs.
