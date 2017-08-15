---
title: Monitor virtual machine changes - Azure Event Grid & Logic Apps | Microsoft Docs
description: Check for config changes in virtual machines (VMs) by using Azure Event Grid and Logic Apps
keywords: logic apps, event grids, virtual machine, VM
services: logic-apps
author: ecfan
manager: anneta

ms.assetid:
ms.workload: logic-apps
ms.service: logic-apps
ms.topic: article
ms.date: 08/16/2017
ms.author: LADocs; estfan
---

# Monitor virtual machine changes with Azure Event Grid and Logic Apps

You can start an automated [logic app workflow](../logic-apps/logic-apps-what-are-logic-apps.md) 
when specific events happen in Azure resources or third-party resources. 
These resources can publish those events to an [Azure event grid](../event-grid/overview.md). 
In turn, the event grid pushes those events to subscribers that have queues, webhooks, 
or [event hubs](../event-hubs/event-hubs-what-is-event-hubs.md) as endpoints. 
As a subscriber, your logic app can wait for those events from the event grid 
before running automated workflows to perform tasks.

For example, here are some events that publishers can send to subscribers 
through the Azure Event Grid service:

* Create, read, update, or delete a resource. 
For example, you can monitor changes that might 
incur charges on your Azure subscription and affect your bill.
* Your app performs a particular action.
* Add or remove a person from an Azure subscription.
* A new message appears in a queue.

This tutorial shows how you can create a logic app so you can monitor 
changes to a virtual machine and get emails about those changes. 
When a logic app has an event subscription for an Azure resource, 
events flow from that resource through an event grid to the logic app. 
Here's the logic app that you can build with this tutorial:

![Overview - monitor virtual machine with event grid and logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/monitor-virtual-machine-event-grid-logic-app-overview.png)

## Requirements

For this tutorial, you need:

* A virtual machine. 
[Learn how to create a virtual machine through the Azure portal](../virtual-machines/windows/quick-create-portal.md). 
To make the virtual machine publish events, 
you [don't need to do anything else](../event-grid/overview.md).

* An email account with 
[any email provider that's supported by Azure Logic Apps](../connectors/apis-list.md), 
such as Office 365 Outlook, Outlook.com, or Gmail. 
This tutorial uses an Office 365 Outlook email account.

> [!IMPORTANT]
> This tutorial uses resources and performs actions 
> that incur charges on your Azure subscription. 
> When you're done with the tutorial, 
> make sure that you disable or delete any resources 
> where you don't want to incur charges.

## Create a logic app that monitors events through an event grid

First, create a logic app that has an Event grid trigger, 
and set up that trigger so you can monitor the resource group for your virtual machine. 

1. In the [Azure portal](https://portal.azure.com), from the main Azure menu, 
choose **New** > **Enterprise Integration** > **Logic App** as shown:

   ![Create logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/azure-portal-create-logic-app.png)

2. Create your logic app:

   1. Provide a name for your logic app.

   2. Select the Azure subscription, resource group, 
   and location that you want to use for your logic app. 

   3. When you're ready, select **Pin to dashboard**, and choose **Create**.

      ![Provide logic app details](./media/monitor-virtual-machine-changes-event-grid-logic-app/create-logic-app-for-event-grid.png)

      You've now created an Azure resource for your logic app. 
      After Azure deploys your logic app, the Logic Apps Designer 
      shows you templates for common patterns so you can get started faster.

      > [!NOTE] 
      > When you select **Pin to dashboard**, 
      > your logic app automatically opens in Logic Apps Designer. 
      > Otherwise, you can manually find and open your logic app.

3. Now choose a logic app template. 
Under **Templates**, choose **Blank Logic App** 
so you can build your logic app from scratch.

   The Logic Apps Designer shows you [*connectors*](../connectors/apis-list.md) 
   and [*triggers*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts) 
   that you can use to start your logic app, 
   plus actions that you can add after a trigger to perform tasks. 
   A trigger is an event that creates a logic app instance and 
   starts your logic app workflow. Your logic app needs a trigger as the first item.

4. In the search box, enter "event grid" as your filter. 
Select this trigger: **Azure Event Grid - On a resource event**

   ![Select this trigger: "Azure Event Grid - On a resource event"](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-event-grid-trigger.png)

5. In the trigger, provide these event subscription details 
so that your logic app can receive events from the publisher resource:

   ![Provide details for event subscription](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-event-grid-trigger-details-generic.png)

   | Setting  | Description  |
   | :------- | :----------- |
   | **Subscription** | The publisher resource's Azure subscription. For this tutorial, select the Azure subscription used for your virtual machine. | 
   | **Resource Type** | The publisher's resource type. For this tutorial, select **Microsoft.Resources.resourceGroups** so that your logic app monitors only resource groups. |
   | **Resource Name** | The publisher resource's name. For this tutorial, select the name of the resource group for your virtual machine. |
   | For optional settings, choose **Show advanced options**. | * **Prefix Filter**: For this tutorial, leave this setting empty. The default behavior matches all values.    However, you can specify a prefix string as a filter, for example, a path and a parameter for a specific resource. <p>* **Suffix Filter**: For this tutorial, leave this setting empty. The default behavior matches all values. However, you can specify a suffix string as a filter, for example, a file name extension, when you want only specific file types.<p>* **Subscription Name**: Provide a name for your event subscription. |
   |||

   Your logic app trigger might look like this example:
   
   ![Example event grid trigger details](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-event-grid-trigger-details.png)

6. Save your logic app. On the designer toolbar, choose **Save**. 
To collapse and hide an action's details in your logic app, 
choose the action's title bar.

   ![Save your logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-event-grid-save.png)

When you save your logic app with an event grid trigger, 
Azure automatically creates an event subscription for the resource that you specified. 
So when the resource publishes an event to the event grid, 
that event grid automatically pushes the event to your logic app. 
This event triggers your logic app, which creates and starts 
running an instance of the workflow that you define in these next steps. 

Your logic app is now live, but doesn't do anything 
until you add actions to the workflow. 

## Add a condition that checks for virtual machine changes

To specify that your logic app runs only when a specific event happens, 
add a condition that checks for virtual machine "write" operations. 
When this condition is true, your logic app sends you email with details 
about the updated virtual machine.

1. In Logic App Designer, under the event grid trigger, 
choose **New step** > **Add a condition**.

   ![Add a condition to your logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-add-condition.png)

   The Logic App Designer adds a condition to your workflow, 
   including action paths to follow based whether the 
   condition is true or false.

2. In the condition box, choose **Edit in advanced mode**.
Enter this expression:

   `@equals(triggerBody()?['data']['operationName'], 'Microsoft.Compute/virtualMachines/write')`

   This expression checks the event `body` for a 
   `data` object whose `operationName` property is the 
   `Microsoft.Compute/virtualMachines/write` operation. 
   Learn more about [Event Grid event schema](../event-grid/event-schema.md).

3. Now choose **Edit in basic mode**.
To provide a description for your condition, 
choose the **ellipses** (**...**) button on the condition shape, 
then choose **Rename**.

   Now your condition looks like this example:

   ![Logic app condition](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-condition-1.png)

4. Save your logic app.

## Send email when your virtual machine changes

Now add an [*action*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts) 
so that you get an email when the specified condition is true.

1. Under the condition, in the **If true** box, choose **Add an action**.

   ![Add action for when condition is true](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-condition-2.png)

2. In the search box, enter "email" as your filter. 
Based on your email provider, find and select the matching connector. 
Then select the "send email" action for your connector. 
For example: 

   * For an Azure work or school account, 
   select the Office 365 Outlook connector. 

   * For personal Microsoft accounts, 
   select the Outlook.com connector. 

   * For Gmail accounts, select the Gmail connector. 

   For this tutorial, we're going to continue with the Office 365 Outlook connector. 
   If you use a different provider, the steps remain the same, but your UI might appear different. 
   
   The workflow now looks like this example:

   ![Select "send email" action](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-send-email.png)

4. If you don't already have a connection for your email provider, 
sign in to your email account when you're asked for authentication.

5. Provide details for the email. 
When the **Dynamic content** list appears, 
you can select from fields available in your workflow.

   * In the **To** box, enter the recipient's email address. 
   For testing purposes, use your own email address.

   * In the **Subject** and **Body** boxes, 
   select the fields that you want to include in the email. 
   For this tutorial:
   
     * **Subject**: Select the **Subject** field so that your email 
     includes the name for the updated resource.

     * **Body**: Select the **Topic**, **Event Time**, and **Event ID** 
     fields so that your email includes the resource group name, 
     event timestamp, and event ID for the update.

   * Optional: To provide a description for your email, 
   on the email shape, choose the **ellipses** (**...**) button, 
   then choose **Rename**.

   Your email action might look like this example:

   ![Select outputs to include in email](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-send-email-details.png)

   > [!NOTE] 
   > If you select a field that represents an array, 
   > the designer automatically adds a **For each** loop 
   > around the action that references the array. 
   > That way, your logic app performs that action on each array item.

   When you're done, your logic app might look like this example:

   ![Finished logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-completed.png)

5. Save your logic app. To collapse and hide each action's details in your logic app, 
choose the action's title bar.

   ![Save your logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/logic-app-event-grid-save-completed.png)

   Your logic app is now live, but waits for changes 
   to your virtual machine before doing anything. 
   To test your logic app now, continue to the next section.

## Test your logic app

1. To check that your logic app is getting the specified events, 
update your virtual machine. 

   For example, you can resize your virtual machine in the Azure portal 
   or [resize your VM with Azure PowerShell](../virtual-machines/windows/resize-vm.md). 

   After a few moments, you should get an email. For example:

   ![Email about virtual machine update](./media/monitor-virtual-machine-changes-event-grid-logic-app/email.png)

2. To review the runs and trigger history for your logic app, 
on your logic app menu, choose **Overview**.

Congratulations, you've now created and run a logic app 
that monitors resource events through an event 
grid and emails you when those events happen. 
You also learned how easily you can create workflows 
that automate processes and integrate systems and cloud services.

> [!IMPORTANT]
> When you're done testing, make sure that you disable any test 
> resources that incur unwanted charges. For example, disable your 
> logic app to stop running and sending email. 
> On your logic app menu, choose **Overview**. 
> On the toolbar, choose **Disable**.
>
> ![Turn off your logic app](./media/monitor-virtual-machine-changes-event-grid-logic-app/turn-off-disable-logic-app.png)

## FAQ

**Q**: What other virtual machine monitoring tasks can I perform with event grids and logic apps? </br>
**A**: You can monitor other configuration changes, for example:

* A virtual machine gets role-based access control (RBAC) rights.
* Changes are made to a network security group (NSG) on a network interface (NIC).
* Disks for a virtual machine are added or removed.
* A public IP address is assigned to a virtual machine NIC.

## Next steps

* [Event Grid Overview](../event-grid/overview.md)
* [Event Grid Concepts](../event-grid/concepts.md)
* [Quickstart: Create and route custom events with Event Grid](../event-grid/custom-event-quickstart.md)
* [Event Grid event schema](../event-grid/event-schema.md)
* [Create logic app workflows with predefined templates](../logic-apps/logic-apps-use-logic-app-templates.md)