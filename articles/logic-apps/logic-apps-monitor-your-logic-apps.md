---
title: Monitor performance and log diagnostic data for Azure Logic Apps | Microsoft Docs
description: Check run history, performance, and status, and turn on diagnostic data logging for logic apps
author: jeffhollan
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 5c1b1e15-3b6c-49dc-98a6-bdbe7cb75339
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 06/23/2017
ms.author: LADocs; jehollan
---

# Monitor performance, log diagnostic data, and set up alerts for logic app workflows

After you [create a logic app](logic-apps-create-a-logic-app.md), 
you can check the performance and full run history in the Azure portal. 
You can also set up diagnostics data logging and alerts 
for monitoring real-time events, richer debugging, 
and notifications about events that might indicate failures or other problems. 
For example, you could create an alert for "when more than five runs fail within an hour."

## View history for runs and triggers in your logic app

1. To find your logic app in the [Azure portal](https://portal.azure.com), 
on the left menu, choose **More services**. Then, in the search box, 
find "logic apps", and choose **Logic apps**.

   ![Find your logic app](./media/logic-apps-monitor-your-logic-apps/find-your-logic-app.png)

   The Azure portal shows all the logic apps that are associated with your Azure subscription. 

2. Select the logic app that you want to monitor.

3. To view all the actions and triggers that fired for the selected logic app, 
choose **Overview**.

   * **Runs history** shows all the runs for the logic app. 
   * **Trigger History** shows all the trigger activity for the logic app.

   For example:

   ![Logic app runs history and trigger history](media/logic-apps-monitor-your-logic-apps/overview.png)

   You can filter either list to a specific date and timeframe. 
   To learn more about the statuses for each run and trigger, 
   see [Troubleshoot your logic app](logic-apps-diagnosing-failures.md).

4. To view the steps that ran for a specific run, select that run. 
The monitor view shows each step in that run.

   ![Actions for a specific run](media/logic-apps-monitor-your-logic-apps/monitor-view-updated.png)

   For more details about the run, like the run's **Correlation ID**, 
   which you can use with the 
   [REST API for Logic Apps](https://docs.microsoft.com/rest/api/logic), 
   choose **Run Details**. This information summarizes the steps, status, 
   inputs, and outputs for the run.

   ![Run Details](media/logic-apps-monitor-your-logic-apps/run-details.png)

5. To view the details about each step in the run, like inputs, 
outputs, and any error messages that might have happened for each step, 
expand the steps that you want. For example:

   ![Step details](media/logic-apps-monitor-your-logic-apps/monitor-view-details.png)
   
   > [!NOTE]
   > All runtime details and events are encrypted within the Logic App service. 
   > They are decrypted only when a user requests to view that data. 
   > You can also control access to these events with 
   > [Azure Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-what-is.md).

6. To view the details for a specific trigger event, like inputs and outputs, 
select that trigger event.

   ![Trigger event details](media/logic-apps-monitor-your-logic-apps/trigger-details.png)

<a name="azure-diagnostics-and-alerts"></a>

## Set up diagnostic data logging and alerts for your logic app

Along with monitoring in the Azure portal and the 
[REST API for Logic Apps](https://docs.microsoft.com/rest/api/logic), 
you can set up diagnostics data logging for richer debugging 
with runtime details and events. You can also subscribe to 
[alerts about logic app events](#add-azure-alerts). 

### Log diagnostic data with Azure Log Analytics

[Log Analytics](../log-analytics/log-analytics-overview.md) is a service 
in [Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md) 
that monitors your cloud and on-premises environments 
so you can maintain their availability and performance. 
Before you start, you first need a workspace in OMS. 
Learn more about [how to create an OMS workspace](../log-analytics/log-analytics-get-started.md).

1. On the logic app blade menu, under **Monitoring**, 
choose **Diagnostics** > **Diagnostic Settings**.

2. Under **Diagnostics settings**, and then **Status**, choose **On**.

   ![Turn on Azure Diagnostics](media/logic-apps-monitor-your-logic-apps/turn-on-diagnostics-logic-app.png)

3. Now perform these steps as shown:

   1. Select **Send to Log Analytics**. 
   2. Under **Log Analytics**, choose **Configure**. 
   3. Under **OMS Workspaces**, select the OMS workspace in Log Analytics 
   that you want to use for sending diagnostics data to a log.
   4. Under **Log**, select **IntegrationAccountTrackingEvents**.
   5. When you're done, choose **Save**.

   ![Set up Azure Log Analytics so you can send diagnostics data to a log](media/logic-apps-monitor-your-logic-apps/send-diagnostics-data-log-analytics-workspace.png)

### Extend how and where you use diagnostic data with other services

Along with Azure Log Analytics, you can set up your 
[logic app](logic-apps-monitor-your-logic-apps.md) so that diagnostics 
data is archived with [Azure Storage](../storage/storage-introduction.md) 
or streamed through [Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md). 
That way, you can get real-time monitoring for your workflows by using the telemetry 
sent to these Azure services with other services like 
[Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) 
and [Power BI](https://powerbi.microsoft.com). Learn more about 
[monitoring and diagnostics in Azure](../monitoring-and-diagnostics/monitoring-overview.md). 

Based on the options that you want to set up, make sure that you first 
[create an Azure storage account](../storage/storage-create-storage-account.md) 
or [create an Azure event hub](../event-hubs/event-hubs-create.md):

> [!NOTE]
> Retention periods apply only when you choose to use a storage account.

![Send data to Azure storage account or event hub](./media/logic-apps-monitor-your-logic-apps/storage-account-event-hubs.png)

<a name="add-azure-alerts"></a>

### Set up alerts for your logic app

To notify you about metrics that are met or thresholds 
that are crossed while your logic app runs, you can set up 
[alerts](../monitoring-and-diagnostics/monitoring-overview-alerts.md). 
Learn more about [metrics in Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md).

   > [!TIP]
   > To run a logic app from an alert, you can include the 
   > [request trigger](../connectors/connectors-native-reqres.md) in your workflow, 
   > which lets you perform tasks like these examples:
   > 
   > * [Post to Slack](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
   > * [Send a text](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)
   > * [Add a message to a queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)

1. On the logic app blade menu, under **Monitoring**, 
choose **Diagnostics** > **Alert rules** > **Add alert** as shown here:

   ![Add an alert for your logic app](media/logic-apps-monitor-your-logic-apps/set-up-alerts.png)

2. On the **Add an alert rule** blade, create your alert as shown:

   1. Under **Resource**, select your logic app, if not already selected. 
   2. Give a name and description for your alert.
   3. Select a **Metric** that you want to track.
   4. Select a **Condition**, specify a **Threshold** for the metric, 
   and select the **Period** for monitoring this metric.
   5. Select whether to send mail for the alert. 
   6. Specify any other email addresses for sending the alert. 
   You can also specify a webhook URL where you want to send the alert.

   For example, this rule sends an alert when five or more runs fail in an hour:

   ![Create metric alert rule](media/logic-apps-monitor-your-logic-apps/create-alert-rule.png)

### Azure Diagnostic settings for tracking and monitoring events

Each event contains details about your logic app and the event, 
like status. In this example for the `ActionCompleted` event, 
the `clientTrackingId` and `trackedProperties` properties 
are especially useful for tracking and monitoring:

```
{
    "time": "2016-07-09T17:09:54.4773148Z",
    "workflowId": "/SUBSCRIPTIONS/80D4FE69-ABCD-EFGH-A938-9250F1C8AB03/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/MYLOGICAPP",
    "resourceId": "/SUBSCRIPTIONS/80D4FE69-ABCD-EFGH-A938-9250F1C8AB03/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/MYLOGICAPP/RUNS/08587361146922712057/ACTIONS/HTTP",
    "category": "WorkflowRuntime",
    "level": "Information",
    "operationName": "Microsoft.Logic/workflows/workflowActionCompleted",
    "properties": {
        "$schema": "2016-06-01",
        "startTime": "2016-07-09T17:09:53.4336305Z",
        "endTime": "2016-07-09T17:09:53.5430281Z",
        "status": "Succeeded",
        "code": "OK",
        "resource": {
            "subscriptionId": "80d4fe69-ABCD-EFGH-a938-9250f1c8ab03",
            "resourceGroupName": "MyResourceGroup",
            "workflowId": "cff00d5458f944d5a766f2f9ad142553",
            "workflowName": "MyLogicApp",
            "runId": "08587361146922712057",
            "location": "westus",
            "actionName": "Http"
        },
        "correlation": {
            "actionTrackingId": "e1931543-906d-4d1d-baed-dee72ddf1047",
            "clientTrackingId": "<my-custom-tracking-id>"
        },
        "trackedProperties": {
            "myTrackedProperty": "<value>"
        }
    }
}
```

* `clientTrackingId`: This ID is auto-generated if not provided, 
and correlates events across a logic app run, 
including any nested workflows that are called from the logic app. 
You can manually specify this ID from a trigger by passing a 
`x-ms-client-tracking-id` header with your custom ID value 
in the trigger request. You can use a request trigger, 
HTTP trigger, or webhook trigger.

* `trackedProperties`: To track inputs or outputs in diagnostics data, 
you can add tracked properties to actions in the workflow definition. 

    For example, suppose you want to track data like an "order ID" in your telemetry. 
    To add a tracked property, include the `trackedProperties` property and the 
    properties that you want to track in the action definition. 
    Tracked properties can track only a single action's inputs and outputs, 
    but you can use the `correlation` properties of events to correlate across actions in a run.

    ``` 
    {
        "myAction": {
            "type": "http",
            "inputs": {
                "uri": "http://uri",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": "@triggerBody()"
            },
            "trackedProperties":{
                "myActionHTTPStatusCode": "@action()['outputs']['statusCode']",
                "myActionHTTPValue": "@action()['outputs']['body']['<content>']",
                "transactionId": "@action()['inputs']['body']['<content>']"
            }
        }
    }
    ```

## Next steps

* [Create templates for logic app deployment and release management](logic-apps-create-deploy-template.md)
* [B2B scenarios with Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md)
* [Monitor B2B messages](logic-apps-monitor-b2b-message.md)

