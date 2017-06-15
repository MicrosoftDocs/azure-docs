---
title: Enable logging & alerts, check the run history, track inputs and outputs - Azure Logic Apps | Microsoft Docs
description: Monitor the status of your logic app workflows using logging, tracking, and viewing the history and diagnostics
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
ms.date: 10/18/2016
ms.author: LADocs; jehollan
---

# Check the performance, and start diagnostic logging and alerts of your workflows in logic apps
After you [create a logic app](../logic-apps/logic-apps-create-a-logic-app.md), you can see the full history of its execution in the Azure portal.  You can also set up services like Azure Diagnostics and Azure Alerts to monitor events real-time, and alert you for events like "when more than 5 runs fail within an hour."

## Monitor in the Azure Portal
To view the history, select **Browse**, and select **Logic Apps**. A list of all logic apps in your subscription is displayed.  Select the logic app you want to monitor.  You will see a list of all actions and triggers that have occurred for this logic app.

![Overview](media/logic-apps-monitor-your-logic-apps/overview.png)

There are a few sections on this blade that are helpful:

* **Summary** lists **All runs** and the **Trigger History**
  * **All runs** list the latest logic app runs.  You can click any row for details on the run, or click on the tile to list more runs.
  * **Trigger History** lists all the trigger activity for this logic app.  Trigger activity could be a "Skipped" check for new data (e.g. looking to see if a new file was added to FTP), "Succeeded" meaning data was returned to fire a logic app, or "Failed" corresponding an error in configuration.
* **Diagnostics** allows you to view runtime details and events, and subscribe to [Azure Alerts](#adding-azure-alerts)

> [!NOTE]
> All runtime details and events are encrypted at rest within the Logic App service. They are only decrypted upon a view request from a user. Access to these events can also be controlled by Azure Role-Based Access Control (RBAC).
> 
> 

### View the run details
This list of runs shows the **Status**, the **Start Time**, and the **Duration** of the particular run. Select any row to see details on that run.

The monitoring view shows you each step of the run, the inputs and outputs, and any error messages that may have occurre.

![Run and Actions](media/logic-apps-monitor-your-logic-apps/monitor-view.png)

If you need any additional details like the run **Correlation ID** (that can be used for the REST API), you can click the **Run Details** button.  This includes all steps, status, and inputs/outputs for the run.

## Azure Diagnostics and alerts
In addition to the details provided by the Azure Portal and REST API above, you can configure your logic app to use Azure Diagnostics for more rich details and debugging.

1. Click the **Diagnostics** section of the logic app blade
2. Click to configure the **Diagnostic Settings**
3. Configure an Event Hub or Storage Account to emit data to
   
    ![Azure Diagnostics settings](media/logic-apps-monitor-your-logic-apps/diagnostics.png)

### Adding Azure Alerts
Once diagnostics are configured, you can add Azure Alerts to fire when certain thresholds are crossed.  In the **Diagnostics** blade, select the **Alerts** tile and **Add alert**.  This will walk you through configuring an alert based on a number of thresholds and metrics.

![Azure Alert Metrics](media/logic-apps-monitor-your-logic-apps/alerts.png)

You can configure the **Condition**, **Threshold**, and **Period** as desired.  Finally, you can configure an email address to send a notification to, or configure a webhook.  You can use the [request trigger](../connectors/connectors-native-reqres.md) in a logic app to run on an alert as well (to do things like [post to Slack](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app), [send a text](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app), or [add a message to a queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)).

### Azure Diagnostics Settings
Each of these events contains details about the logic app and event like status.  Here is an example of a *ActionCompleted* event:

```javascript
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
                    "location": "eastus",
                    "actionName": "Http"
                },
                "correlation": {
                    "actionTrackingId": "e1931543-906d-4d1d-baed-dee72ddf1047",
                    "clientTrackingId": "my-custom-tracking-id"
                },
                "trackedProperties": {
                    "myProperty": "<value>"
                }
            }
        }
```

The two properties that are especially useful for tracking and monitoring are *clientTrackingId* and *trackedProperties*.  

#### Client tracking ID
The client tracking ID is a value that will correlate events across a logic app run, including any nested workflows called as a part of a logic app.  This ID will be auto-generated if not provided, but you can manually specify the client tracking ID from a trigger by passing a `x-ms-client-tracking-id` header with the ID value in the trigger request (request trigger, HTTP trigger, or webhook trigger).

#### Tracked properties
Tracked properties can be added onto actions in the workflow definition to track inputs or outputs in diagnostics data.  This can be useful if you wish to track data like an "order ID" in your telemetry.  To add a tracked property, include the `trackedProperties` property on an action.  Tracked properties can only track a single actions inputs and outputs, but you can use the `correlation` properties of the events to correlate across actions in a run.

```javascript
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
            "myActionHTTPValue": "@action()['outputs']['body']['foo']",
            "transactionId": "@action()['inputs']['body']['bar']"
        }
    }
}
```

### Extending your solutions
You can leverage this telemetry from the Event Hub or Storage into other services like [Operations Management Suite](https://www.microsoft.com/cloud-platform/operations-management-suite), [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/), and [Power BI](https://powerbi.com) to have real time monitoring of your integration workflows.

## Next Steps
* [Common examples and scenarios for logic apps](../logic-apps/logic-apps-examples-and-scenarios.md)
* [Creating a Logic App Deployment Template](../logic-apps/logic-apps-create-deploy-template.md)
* [Enterprise integration features](../logic-apps/logic-apps-enterprise-integration-overview.md)

