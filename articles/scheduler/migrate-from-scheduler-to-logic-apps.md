---
title: Migrate from Azure Scheduler to Azure Logic Apps
description: Learn how you can replace jobs in Azure Scheduler, which is being retired, with Azure Logic Apps 
services: scheduler
ms.service: scheduler 
ms.suite: infrastructure-services
author: derek1ee
ms.author: deli
ms.reviewer: klam, estfan
ms.topic: article
ms.date: 02/29/2020
---

# Migrate Azure Scheduler jobs to Azure Logic Apps

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) is replacing Azure Scheduler, 
> which is [being retired](#retire-date). To continue working with the jobs that you set 
> up in Scheduler, please migrate to Azure Logic Apps as soon as possible by following this article. 
>
> Scheduler is no longer available in the Azure portal, but the [REST API](/rest/api/scheduler) 
> and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) remain available 
> at this time so that you can manage your jobs and job collections.

This article shows how you can schedule one-time and recurring jobs by creating automated workflows with Azure Logic Apps, rather than with Azure Scheduler. When you create scheduled jobs with Logic Apps, you get these benefits:

* Build your job by using a visual designer and [ready-to-use connectors](../connectors/apis-list.md) from hundreds of services, such as Azure Blob Storage, Azure Service Bus, Office 365 Outlook, and SAP.

* Manage each scheduled workflow as a first-class Azure resource. You don't have to worry about the concept of a *job collection* because each logic app is an individual Azure resource.

* Run multiple one-time jobs by using a single logic app.

* Set schedules that support time zones and automatically adjust to daylight savings time (DST).

To learn more, see [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md) or try creating your first logic app in this quickstart: [Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* To trigger your logic app by sending HTTP requests, use a tool such as the [Postman desktop app](https://www.getpostman.com/apps).

## Migrate by using a script

Each Scheduler job is unique, so no one-size-fits-all tool exists for migrating Scheduler jobs to Azure Logic Apps. However, you can [edit this script](https://github.com/Azure/logicapps/tree/master/scripts/scheduler-migration) to meet your needs.

## Schedule one-time jobs

You can run multiple one-time jobs by creating just a single logic app.

1. In the [Azure portal](https://portal.azure.com), create a blank logic app in Logic App Designer.

   For the basic steps, follow [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

1. In the search box, enter `when a http request` to find the Request trigger. From the triggers list, select this trigger: **When a HTTP request is received**

   ![Add "Request" trigger](./media/migrate-from-scheduler-to-logic-apps/request-trigger.png)

1. For the Request trigger, you can optionally provide a JSON schema, which helps the Logic App Designer understand the structure for the inputs included in the inbound call to the Request trigger and makes the outputs easier for you to select later in your workflow.

   In the **Request Body JSON Schema** box, enter the schema, for example:

   ![Request schema](./media/migrate-from-scheduler-to-logic-apps/request-schema.png)

   If you don't have a schema, but you have a sample payload in JSON format, you can generate a schema from that payload.

   1. In the Request trigger, select **Use sample payload to generate schema**.

   1. Under **Enter or paste a sample JSON payload**, provide your sample payload, and select **Done**, for example:

      ![Sample payload](./media/migrate-from-scheduler-to-logic-apps/sample-payload.png)

      ```json
      {
         "runat": "2012-08-04T00:00Z",
         "endpoint": "https://www.bing.com"
      }
      ```

1. Under the trigger, select **Next step**.

1. In the search box, enter `delay until` as your filter. Under the actions list, select this action: **Delay until**

   This action pauses your logic app workflow until a specified date and time.

   ![Add "Delay until" action](./media/migrate-from-scheduler-to-logic-apps/delay-until.png)

1. Enter the timestamp for when you want to start the logic app's workflow.

   When you click inside the **Timestamp** box, the dynamic content list appears so that you can optionally select an output from the trigger.

   ![Provide "Delay until" details](./media/migrate-from-scheduler-to-logic-apps/delay-until-details.png)

1. Add any other actions you want to run by selecting from [hundreds of ready-to-use connectors](../connectors/apis-list.md).

   For example, you can include an HTTP action that sends a request to a URL, or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![HTTP action](./media/migrate-from-scheduler-to-logic-apps/request-http-action.png)

1. When you're done, save your logic app.

   ![Save your logic app](./media/migrate-from-scheduler-to-logic-apps/save-logic-app.png)

   When you save your logic app for the first time, the endpoint URL for your logic app's Request trigger appears in the **HTTP POST URL** box. When you want to call your logic app and send 
   inputs to your logic app for processing, use this URL as the call destination.

   ![Save Request trigger endpoint URL](./media/migrate-from-scheduler-to-logic-apps/request-endpoint-url.png)

1. Copy and save this endpoint URL so you can later send a manual request that triggers your logic app.

## Start a one-time job

To manually run or trigger a one-time job, send a call to the endpoint URL for your logic app's Request trigger. In this call, specify the input or payload to send, which you might have described earlier by specifying a schema.

For example, using the Postman app, you can create a POST request with the settings similar to this sample, and then select **Send** to make the request.

| Request method | URL | Body | Headers |
|----------------|-----|------|---------|
| **POST** | <*endpoint-URL*> | **raw** <p>**JSON(application/json)** <p>In the **raw** box, enter the payload that you want to send in the request. <p>**Note**: This setting automatically configures the **Headers** values. | **Key**: Content-Type <br>**Value**: application/json |
|||||

![Send request to manually trigger your logic app](./media/migrate-from-scheduler-to-logic-apps/postman-send-post-request.png)

After you send the call, the response from your logic 
app appears under the **raw** box on the **Body** tab. 

<a name="workflow-run-id"></a>

> [!IMPORTANT]
>
> If you want to cancel the job later, select the **Headers** tab. 
> Find and copy the **x-ms-workflow-run-id** header value in the response. 
>
> ![Response](./media/migrate-from-scheduler-to-logic-apps/postman-response.png)

## Cancel a one-time job

In Logic Apps, each one-time job executes as a single logic app run instance. To cancel a one-time job, you can use [Workflow Runs - Cancel](https://docs.microsoft.com/rest/api/logic/workflowruns/cancel) in the Logic Apps REST API. When you send a call to the trigger, provide the [workflow run ID](#workflow-run-id).

## Schedule recurring jobs

1. In the [Azure portal](https://portal.azure.com), create a blank logic app in Logic App Designer.

   For the basic steps, follow [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

1. In the search box, enter "recurrence" as your filter. From the triggers list, select this trigger:
**Recurrence**

   ![Add "Recurrence" trigger](./media/migrate-from-scheduler-to-logic-apps/recurrence-trigger.png)

1. Set up a more advanced schedule, if you want.

   ![Advanced schedule](./media/migrate-from-scheduler-to-logic-apps/recurrence-advanced-schedule.png)

   For more information about advanced scheduling options, see [Create and run recurring tasks and workflows with Azure Logic Apps](../connectors/connectors-native-recurrence.md).

1. Add other actions you want by selecting from [hundreds of ready-to-use](../connectors/apis-list.md). Under the trigger, select **Next step**. Find and select the actions you want.

   For example, you can include an HTTP action that sends a request to a URL, or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![HTTP action](./media/migrate-from-scheduler-to-logic-apps/recurrence-http-action.png)

1. When you're done, save your logic app.

   ![Save your logic app](./media/migrate-from-scheduler-to-logic-apps/save-logic-app.png)

## Advanced setup

Here are other ways you can customize your jobs.

### Retry policy

To control the way that an action tries to rerun in your logic app when intermittent failures happen, you can set the [retry policy](../logic-apps/logic-apps-exception-handling.md#retry-policies) in each action's settings, for example:

1. Open the action's ellipses (**...**) menu, and select **Settings**.

   ![Open action settings](./media/migrate-from-scheduler-to-logic-apps/action-settings.png)

1. Select the retry policy that you want. For more information about each policy, see [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies).

   ![Select retry policy](./media/migrate-from-scheduler-to-logic-apps/retry-policy.png)

## Handle exceptions and errors

In Azure Scheduler, if the default action fails to run, you can run an alterative action that addresses the error condition. In Azure Logic Apps, you can also perform the same task.

1. In Logic App Designer, above the action that you want to handle, move your pointer over the arrow between steps, and select **Add a parallel branch**.

   ![Add parallel branch](./media/migrate-from-scheduler-to-logic-apps/add-parallel-branch.png)

1. Find and select the action you want to run instead as the alternative action.

   ![Add parallel action](./media/migrate-from-scheduler-to-logic-apps/add-parallel-action.png)

1. On the alternative action, open the ellipses (**...**) menu, and select **Configure run after**.

   ![Configure run after](./media/migrate-from-scheduler-to-logic-apps/configure-run-after.png)

1. Clear the box for the **is successful** property. Select these properties: **has failed**, **is skipped**, and **has timed out**

   ![Set up "run after" properties](./media/migrate-from-scheduler-to-logic-apps/select-run-after-properties.png)

1. When you're finished, select **Done**.

To learn more about exception handling, see [Handle errors and exceptions - RunAfter property](../logic-apps/logic-apps-exception-handling.md#control-run-after-behavior).

## FAQ

<a name="retire-date"></a>

**Q**: When is Azure Scheduler retiring? <br>
**A**: Azure Scheduler is scheduled to fully retire on December 31, 2019. For important steps to take before this date and a detailed timeline, see [Extending retirement date for Scheduler to December 31, 2019](https://azure.microsoft.com/updates/extending-retirement-date-of-scheduler/). For general updates, see [Azure updates - Scheduler](https://azure.microsoft.com/updates/?product=scheduler).

**Q**: What happens to my job collections and jobs after the service retires? <br>
**A**: All Scheduler job collections and jobs stop running and are deleted from the system.

**Q**: Do I have to back up or perform any other tasks before migrating my Scheduler jobs to Logic Apps? <br>
**A**: As a best practice, always back up your work. Check that the logic apps you created are running as expected before deleting or disabling your Scheduler jobs.

**Q**: Is there a tool that can help me migrate my jobs from Scheduler to Logic Apps? <br>
**A**: Each Scheduler job is unique, so a one-size-fits-all tool doesn't exist. However, based on your needs, you can [edit this script to migrate Azure Scheduler jobs to Azure Logic Apps](https://github.com/Azure/logicapps/tree/master/scripts/scheduler-migration).

**Q**: Where can I get support for migrating my Scheduler jobs? <br>
**A**: Here are some ways to get support:

**Azure portal**

If your Azure subscription has a paid support plan, you can create a technical support request in the Azure portal. Otherwise, you can select a different support option.

1. On the [Azure portal](https://portal.azure.com) main menu, select **Help + support**.

1. From the **Support** menu, select **New support request**. Provide this information about for your request:

   | Property | Value |
   |---------|-------|
   | **Issue type** | **Technical** |
   | **Subscription** | <*your-Azure-subscription*> |
   | **Service** | Under **Monitoring & Management**, select **Scheduler**. If you can't find **Scheduler**, select **All services** first. |
   ||| 

1. Select the support option you want. If you have a paid support plan, select **Next**.

**Community**

* [Microsoft Q&A question page for Azure Logic Apps](https://docs.microsoft.com/answers/topics/azure-logic-apps.html)
* [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-scheduler)

## Next steps

* [Create regularly running tasks and workflows with Azure Logic Apps](../connectors/connectors-native-recurrence.md)