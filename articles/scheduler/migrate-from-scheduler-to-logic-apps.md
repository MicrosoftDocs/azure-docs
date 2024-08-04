---
title: Migrate from Azure Scheduler to Azure Logic Apps
description: Replace Azure Scheduler jobs with Azure Logic Apps.
services: scheduler
ms.service: azure-scheduler
ms.suite: infrastructure-services
author: ecfan
ms.author: estfan
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/11/2024
---

# Migrate Azure Scheduler jobs to Azure Logic Apps

> [!IMPORTANT]
>
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) has replaced Azure Scheduler, which is fully 
> retired since January 31, 2022. Please migrate your Azure Scheduler jobs by recreating them as workflows 
> in Azure Logic Apps following the steps in this article. Azure Scheduler is longer available in the Azure portal. 
> The [Azure Scheduler REST API](/rest/api/scheduler) and [Azure Scheduler PowerShell cmdlets](scheduler-powershell-reference.md) no longer work.

This guide shows how to schedule one-time and recurring jobs by creating automated workflows with Azure Logic Apps, rather than with Azure Scheduler. When you create scheduled jobs with Azure Logic Apps, you get the following benefits:

* Build your job by using a visual designer and select from [1000+ ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors), such as Azure Blob Storage, Azure Service Bus, Office 365 Outlook, SAP, and more.

* Manage each scheduled workflow as a first-class Azure resource. You don't have to worry about the concept of a *job collection* because each logic app is an individual Azure resource.

* Run multiple one-time jobs by using a single logic app workflow.

* Set schedules that support time zones and automatically adjust to daylight savings time (DST).

For more information, see [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md) or try creating your first logic app workflow by following either of the following steps:

* [Create an example Consumption logic app workflow in multitenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md)

* [Create an example Standard logic app workflow in single-tenant Azure Logic Apps](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [api-test-http-request-tools-bullet](../../includes/api-test-http-request-tools-bullet.md)]

## Migrate by using a script

Each Scheduler job is unique, so no one-size-fits-all tool exists for migrating Azure Scheduler jobs to Azure Logic Apps. However, you can [edit this script](https://github.com/Azure/logicapps/tree/master/scripts/scheduler-migration) to meet your needs.

## Schedule a one-time job

You can run multiple one-time jobs by creating just a single logic app workflow.

1. In the [Azure portal](https://portal.azure.com), create a logic app resource and blank workflow.

1. [Follow these general steps to add the **Request** trigger named **When a HTTP request is received**](../logic-apps/create-workflow-with-trigger-or-action.md#add-trigger).

1. In the **Request** trigger, you can optionally provide a JSON schema, which helps the workflow designer understand the structure for the inputs included in the inbound call to the **Request** trigger and makes the outputs easier for you to select later in your workflow.

   In the **Request Body JSON Schema** box, enter the schema, for example:

   ![Screenshot showing the Request trigger with a sample JSON request schema.](./media/migrate-from-scheduler-to-logic-apps/request-schema.png)

   If you don't have a schema, but you have a sample payload in JSON format, you can generate a schema from that payload.

   1. In the **Request** trigger, select **Use sample payload to generate schema**.

   1. Under **Enter or paste a sample JSON payload**, provide your sample payload, and select **Done**, for example:

      ![Screenshot showing a sample JSON payload.](./media/migrate-from-scheduler-to-logic-apps/sample-payload.png)

      ```json
      {
         "runat": "2012-08-04T00:00Z",
         "endpoint": "https://www.bing.com"
      }
      ```

1. Under the trigger, [add the **Schedule** action named **Delay until**](../logic-apps/create-workflow-with-trigger-or-action.md#add-action)

   This action pauses workflow execution until a specified date and time, for example:

   ![Screenshot showing the "Delay until" action.](./media/migrate-from-scheduler-to-logic-apps/delay-until.png)

1. Enter the timestamp for when you want to start the workflow.

   1. Select inside the **Timestamp** box, and then select the dynamic content list option (lightning icon), which lets you select an output from the previous operation, which is the **Request** trigger in this example.

   ![Screenshot showing the "Delay until" action details with the dynamic content list open and the "runAt" property selected.](./media/migrate-from-scheduler-to-logic-apps/delay-until-details.png)

1. Add any other actions you want to run by selecting from the [1000+ ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

   For example, you can include an **HTTP** action that sends a request to a URL or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![Screenshot showing the "Delay until" action followed by an H T T P action with a POST method.](./media/migrate-from-scheduler-to-logic-apps/request-http-action.png)

1. When you're done, on the designer toolbar, select **Save**.

   When you save your workflow for the first time, the endpoint URL for your workflow's **Request** trigger is generated and appears in the **HTTP POST URL** box, for example:

   ![Screenshot showing the generated Request trigger endpoint URL.](./media/migrate-from-scheduler-to-logic-apps/request-endpoint-url.png)

   To manually trigger your workflow with the inputs that you want the workflow to process, you can send an HTTP request to the endpoint URL.

1. Copy and save the endpoint URL so that you can test your workflow.

## Test your workflow

To manually trigger your workflow, send an HTTP request to the endpoint URL in your workflow's **Request** trigger. With this request, include the input or payload to send, which you might have described earlier by specifying a schema. You can send this request by using your HTTP request tool and its instructions.

For example, you can create and send an HTTP request that uses the method expected by the **Request** trigger, for example:

| Request method | URL | Body | Headers |
|----------------|-----|------|---------|
| **POST** | <*endpoint-URL*> | **raw** <p>**JSON(application/json)** <br><br>In the **raw** box, enter the payload that you want to send in the request. **Note**: This setting automatically configures the **Headers** values. | **Key**: Content-Type <br>**Value**: application/json |

<a name="workflow-run-id"></a>
<a name="cancel-one-time-job"></a>

## Cancel a one-time job

In Azure Logic Apps, each one-time job executes as a single workflow run instance. To manually cancel a one-time job, you can find and copy the **x-ms-workflow-run-id** header value returned in the workflow's response, and send another HTTP request with this workflow run ID to the workflow's endpoint URL by using the following REST APIs, based on your logic app:

- Consumption workflows: [Workflow Runs - Cancel](/rest/api/logic/workflow-runs/cancel)

- Standard workflows: [Workflow Runs - Cancel](/rest/api/appservice/workflow-runs/cancel)

## Schedule recurring jobs

1. In the [Azure portal](https://portal.azure.com), create a logic app resource and blank workflow.

1. [Follow these general steps to add the **Schedule** trigger named **Recurrence**](../logic-apps/create-workflow-with-trigger-or-action.md#add-trigger).

1. If you want, set up a more advanced schedule.

   For more information about advanced scheduling options, see [Create and run recurring tasks and workflows with Azure Logic Apps](../connectors/connectors-native-recurrence.md).

1. Add any other actions you want to run by selecting from the [1000+ ready-to-use connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

   For example, you can include an **HTTP** action that sends a request to a URL or actions that work with Storage Queues, Service Bus queues, or Service Bus topics:

   ![Screenshot showing an H T T P action with a POST method.](./media/migrate-from-scheduler-to-logic-apps/recurrence-http-action.png)

1. When you're done, on the designer toolbar, select **Save**.

## Advanced setup

The following sections describe other ways that you can customize your jobs.

### Retry policy

To control the way that an action tries to rerun in your workflow when intermittent failures happen, you can set the [retry policy](../logic-apps/logic-apps-exception-handling.md#retry-policies) in each action's settings.

## Handle exceptions and errors

In Azure Scheduler, if the default action fails to run, you can run an alterative action that addresses the error condition. In Azure Logic Apps, you can also perform the same task. For more information about exception handling in Azure Logic Apps, see [Handle errors and exceptions - RunAfter property](../logic-apps/logic-apps-exception-handling.md#control-run-after-behavior).

1. In the designer, above the action that you want to handle, [add a parallel branch](../logic-apps/logic-apps-control-flow-branches.md).

1. Find and select the action you want to run instead as the alternative action.

1. On the alternative action, find and select the **Configure run after** option.

1. Clear the box for the **is successful** property. Select the properties named **has failed**, **is skipped**, and **has timed out**.

1. When you're finished, select **Done**.

## FAQ

<a name="retire-date"></a>

**Q**: When did Azure Scheduler retire? <br>
**A**: Azure Scheduler fully retired on January 31, 2022. For general updates, see [Azure updates - Scheduler](https://azure.microsoft.com/updates/?product=scheduler).

**Q**: What happens to my job collections and jobs after Azure Scheduler retires? <br>
**A**: All Azure Scheduler job collections and jobs stop running and are deleted from the system.

**Q**: Do I have to back up or perform any other tasks before migrating my Azure Scheduler jobs to Azure Logic Apps? <br>
**A**: As a best practice, always back up your work. Check that the workflows you created are running as expected before deleting or disabling your Azure Scheduler jobs.
   
**Q**: What happens to my scheduled Azure Web Jobs from Azure Scheduler? <br>
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

1. Select the support option that you want. If you have a paid support plan, select **Next**.

## Next steps

* [Create an example Consumption logic app workflow in multitenant Azure Logic Apps](../logic-apps/quickstart-create-example-consumption-workflow.md)
