---
title: Migrate from Azure Scheduler to Azure Logic Apps
description: Replace Azure Scheduler jobs with Azure Logic Apps.
services: scheduler
ms.service: scheduler
ms.suite: infrastructure-services
author: ecfan
ms.author: estfan
ms.reviewer: deli, azla
ms.topic: how-to
ms.date: 02/15/2022
---

# Migrate Azure Scheduler jobs to Azure Logic Apps

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) has replaced Azure Scheduler, which is fully 
> retired since January 31, 2022. Please migrate your Azure Scheduler jobs by recreating them as workflows 
> in Azure Logic Apps following the steps in this article. Azure Scheduler is longer available in the Azure portal. 
> The [Azure Scheduler REST API](/rest/api/scheduler) and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) no longer work.

This article shows how you can schedule one-time and recurring jobs by creating automated workflows with Azure Logic Apps, rather than with Azure Scheduler. When you create scheduled jobs with Azure Logic Apps, you get the following benefits:

* Build your job by using a visual designer and [ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) from hundreds of services, such as Azure Blob Storage, Azure Service Bus, Office 365 Outlook, and SAP.

* Manage each scheduled workflow as a first-class Azure resource. You don't have to worry about the concept of a *job collection* because each logic app is an individual Azure resource.

* Run multiple one-time jobs by using a single logic app workflow.

* Set schedules that support time zones and automatically adjust to daylight savings time (DST).

To learn more, see [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md) or try creating your first logic app workflow by following the [Quickstart: Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md).

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* To trigger your logic app workflow by sending HTTP requests, use a tool such as the [Postman desktop app](https://www.getpostman.com/apps).

## Migrate by using a script

Each Scheduler job is unique, so no one-size-fits-all tool exists for migrating Azure Scheduler jobs to Azure Logic Apps. However, you can [edit this script](https://github.com/Azure/logicapps/tree/master/scripts/scheduler-migration) to meet your needs.

## Schedule one-time jobs

You can run multiple one-time jobs by creating just a single logic app workflow.

1. In the [Azure portal](https://portal.azure.com), create a blank logic app workflow using the designer.

   For the basic steps, follow [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md).

1. In the designer search box, enter **when a http request** to find the **Request** trigger. From the **Triggers** list, select the trigger named **When a HTTP request is received**.

   ![Screenshot showing the Azure portal and the workflow designer with the "Request" trigger selected.](./media/migrate-from-scheduler-to-logic-apps/request-trigger.png)

1. For the Request trigger, you can optionally provide a JSON schema, which helps the workflow designer understand the structure for the inputs included in the inbound call to the Request trigger and makes the outputs easier for you to select later in your workflow.

   In the **Request Body JSON Schema** box, enter the schema, for example:

   ![Screenshot showing the Request trigger with a sample JSON request schema.](./media/migrate-from-scheduler-to-logic-apps/request-schema.png)

   If you don't have a schema, but you have a sample payload in JSON format, you can generate a schema from that payload.

   1. In the Request trigger, select **Use sample payload to generate schema**.

   1. Under **Enter or paste a sample JSON payload**, provide your sample payload, and select **Done**, for example:

      ![Screenshot showing a sample JSON payload.](./media/migrate-from-scheduler-to-logic-apps/sample-payload.png)

      ```json
      {
         "runat": "2012-08-04T00:00Z",
         "endpoint": "https://www.bing.com"
      }
      ```

1. Under the trigger, select **Next step**.

1. In the designer search box, enter **delay until**. From the **Actions** list, select the action named **Delay until**.

   This action pauses your logic app workflow until a specified date and time, for example:

   ![Screenshot showing the "Delay until" action.](./media/migrate-from-scheduler-to-logic-apps/delay-until.png)

1. Enter the timestamp for when you want to start the logic app's workflow.

   When you click inside the **Timestamp** box, the dynamic content list appears so that you can optionally select an output from the trigger.

   ![Screenshot showing the "Delay until" action details with the dynamic content list open and the "runAt" property selected.](./media/migrate-from-scheduler-to-logic-apps/delay-until-details.png)

1. Add any other actions you want to run by selecting from [hundreds of ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

   For example, you can include an HTTP action that sends a request to a URL or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![Screenshot showing the "Delay until" action followed by an H T T P action with a POST method.](./media/migrate-from-scheduler-to-logic-apps/request-http-action.png)

1. When you're done, save your logic app workflow.

   ![Screenshot showing the designer toolbar with "Save" selected.](./media/migrate-from-scheduler-to-logic-apps/save-logic-app.png)

   When you save your logic app workflow for the first time, the endpoint URL for your logic app workflow's Request trigger appears in the **HTTP POST URL** box. To trigger your logic app workflow and send inputs to your workflow for processing, send a request to the generated URL as the call destination, for example:

   ![Screenshot showing the generated Request trigger endpoint URL.](./media/migrate-from-scheduler-to-logic-apps/request-endpoint-url.png)

1. Copy and save the endpoint URL so that you can later send a manual request to trigger your logic app workflow.

## Start a one-time job

To manually run or trigger a one-time job, send a call to the endpoint URL for your logic app's Request trigger. In this call, specify the input or payload to send, which you might have described earlier by specifying a schema.

For example, using the Postman app, you can create a POST request with the settings similar to this sample, and then select **Send** to make the request.

| Request method | URL | Body | Headers |
|----------------|-----|------|---------|
| **POST** | <*endpoint-URL*> | **raw** <p>**JSON(application/json)** <p>In the **raw** box, enter the payload that you want to send in the request. <p>**Note**: This setting automatically configures the **Headers** values. | **Key**: Content-Type <br>**Value**: application/json |
|||||

![Screenshot showing the request to send for manually triggering your logic app workflow.](./media/migrate-from-scheduler-to-logic-apps/postman-send-post-request.png)

After you send the call, the response from your logic app workflow appears under the **raw** box on the **Body** tab.

<a name="workflow-run-id"></a>

> [!IMPORTANT]
>
> If you want to cancel the job later, select the **Headers** tab. 
> Find and copy the **x-ms-workflow-run-id** header value in the response. 
>
> ![Screenshot showing the response.](./media/migrate-from-scheduler-to-logic-apps/postman-response.png)

## Cancel a one-time job

In Azure Logic Apps, each one-time job executes as a single workflow run instance. To cancel a one-time job, you can use [Workflow Runs - Cancel](/rest/api/logic/workflowruns/cancel) in the Azure Logic Apps REST API. When you send a call to the trigger, provide the [workflow run ID](#workflow-run-id).

## Schedule recurring jobs

1. In the [Azure portal](https://portal.azure.com), create a blank logic app workflow in the designer.

   For the basic steps, follow [Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md).

1. In the designer search box, enter **recurrence**. From the **Triggers** list, select the trigger named **Recurrence**.

   ![Screenshot showing the Azure portal and workflow designer with the "Recurrence" trigger selected.](./media/migrate-from-scheduler-to-logic-apps/recurrence-trigger.png)

1. If you want, set up a more advanced schedule.

   ![Screenshot showing the "Recurrence" trigger with an advanced schedule.](./media/migrate-from-scheduler-to-logic-apps/recurrence-advanced-schedule.png)

   For more information about advanced scheduling options, review [Create and run recurring tasks and workflows with Azure Logic Apps](../connectors/connectors-native-recurrence.md).

1. Add other actions you want by selecting from [hundreds of ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors). Under the trigger, select **Next step**. Find and select the actions you want.

   For example, you can include an HTTP action that sends a request to a URL, or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![Screenshot showing an H T T P action with a POST method.](./media/migrate-from-scheduler-to-logic-apps/recurrence-http-action.png)

1. When you're done, save your logic app workflow.

   ![Screenshot showing the designer toolbar with the "Save" button selected.](./media/migrate-from-scheduler-to-logic-apps/save-logic-app.png)

## Advanced setup

The following sections describe other ways that you can customize your jobs.

### Retry policy

To control the way that an action tries to rerun in your logic app workflow when intermittent failures happen, you can set the [retry policy](../logic-apps/logic-apps-exception-handling.md#retry-policies) in each action's settings, for example:

1. Open the action's ellipses (**...**) menu, and select **Settings**.

   ![Screenshot showing an action's "Settings" selected.](./media/migrate-from-scheduler-to-logic-apps/action-settings.png)

1. Select the retry policy that you want. For more information about each policy, review [Retry policies](../logic-apps/logic-apps-exception-handling.md#retry-policies).

   ![Screenshot showing the selected "Default" retry policy.](./media/migrate-from-scheduler-to-logic-apps/retry-policy.png)

## Handle exceptions and errors

In Azure Scheduler, if the default action fails to run, you can run an alterative action that addresses the error condition. In Azure Logic Apps, you can also perform the same task.

1. In the workflow designer, above the action that you want to handle, move your pointer over the arrow between steps, and select **Add a parallel branch**.

   ![Screenshot showing "Add a parallel branch" selected.](./media/migrate-from-scheduler-to-logic-apps/add-parallel-branch.png)

1. Find and select the action you want to run instead as the alternative action.

   ![Screenshot showing the selected parallel action.](./media/migrate-from-scheduler-to-logic-apps/add-parallel-action.png)

1. On the alternative action, open the ellipses (**...**) menu, and select **Configure run after**.

   ![Screenshot showing "Configure run after" selected.](./media/migrate-from-scheduler-to-logic-apps/configure-run-after.png)

1. Clear the box for the **is successful** property. Select the properties named **has failed**, **is skipped**, and **has timed out**.

   ![Screenshot showing the selected "run after" properties.](./media/migrate-from-scheduler-to-logic-apps/select-run-after-properties.png)

1. When you're finished, select **Done**.

To learn more about exception handling, see [Handle errors and exceptions - RunAfter property](../logic-apps/logic-apps-exception-handling.md#control-run-after-behavior).

## FAQ

<a name="retire-date"></a>

**Q**: When is Azure Scheduler retiring? <br>
**A**: Azure Scheduler fully retired on January 31, 2022. For general updates, see [Azure updates - Scheduler](https://azure.microsoft.com/updates/?product=scheduler).

**Q**: What happens to my job collections and jobs after Azure Scheduler retires? <br>
**A**: All Azure Scheduler job collections and jobs stop running and are deleted from the system.

**Q**: Do I have to back up or perform any other tasks before migrating my Azure Scheduler jobs to Azure Logic Apps? <br>
**A**: As a best practice, always back up your work. Check that the logic app workflows that you created are running as expected before deleting or disabling your Azure Scheduler jobs.
   
**Q**: What will happen to my scheduled Azure Web Jobs from Azure Scheduler? <br>
**A**: Web Jobs that use this way of [Scheduling Web Jobs](https://github.com/projectkudu/kudu/wiki/WebJobs#scheduling-a-triggered-webjob) aren't internally using Azure Scheduler: "For the schedule to work it requires the website to be configured as Always On and is not an Azure Scheduler but an internal implementation of a scheduler." The only affected Web Jobs are those that specifically use Azure Scheduler to run the Web Job using the Web Jobs API. You can trigger these WebJobs from a logic app workflow by using the **HTTP** action.

**Q**: Is there a tool that can help me migrate my jobs from Azure Scheduler to Azure Logic Apps? <br>
**A**: Each Azure Scheduler job is unique, so no one-size-fits-all tool exists. However, based on your needs, you can [edit this script to migrate Azure Scheduler jobs to Azure Logic Apps](https://github.com/Azure/logicapps/tree/master/scripts/scheduler-migration).

**Q**: Where can I get support for migrating my Azure Scheduler jobs? <br>
**A**: Here are some ways to get support:

**Azure portal**

If your Azure subscription has a paid support plan, you can create a technical support request in the Azure portal. Otherwise, you can select a different support option.

1. On the [Azure portal](https://portal.azure.com) main menu, select **Help + support**.

1. From the **Support** menu, select **New support request**. Provide the following information about your request:

   | Property | Value |
   |----------|-------|
   | **Issue type** | **Technical** |
   | **Subscription** | <*your-Azure-subscription*> |
   | **Service** | Under **Monitoring & Management**, select **Scheduler**. If you can't find **Scheduler**, select **All services** first. |
   |||

1. Select the support option that you want. If you have a paid support plan, select **Next**.

## Next steps

* [Create an example Consumption logic app workflow in multi-tenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md)