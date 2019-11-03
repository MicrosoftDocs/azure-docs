---
title: Monitor status, set up logging, and get alerts - Azure Logic Apps
description: View the run history, turn on diagnostic logging, and set up alerts for monitoring your logic apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: jonfan, estfan, LADocs
ms.topic: article
ms.date: 11/04/2019
---

# Monitor status, set up diagnostics logging, and turn on alerts for Azure Logic Apps

After you [create and run a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md), you can check that logic app's run history, trigger history, status, and performance. For real-time event monitoring and richer debugging, set up [diagnostics logging](#azure-diagnostics) for your logic app. That way, you can [find and view events](#find-events), such as trigger events, run events, and action events. You can also use this [diagnostics data with other Azure services](#extend-diagnostic-data), such as Azure Storage and Azure Event Hubs.

To get notifications about failures or other possible problems, set up [alerts](#add-azure-alerts). For example, you can create an alert that detects "when more than five runs fail in an hour." You can also set up monitoring, tracking, and logging programmatically by using [Azure Diagnostics event settings and properties](#diagnostic-event-properties).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Review runs history

1. In the [Azure portal](https://portal.azure.com), find and open your logic app in the Logic App Designer.

   To find your logic app , in the main Azure search box, enter `logic apps`, and then select **Logic Apps**.

   ![Find and select "Logic Apps" service](./media/logic-apps-monitor-your-logic-apps/find-your-logic-app.png)

   The Azure portal shows all the logic apps that are associated with your Azure subscriptions. You can filter this list based on name, subscription, resource group, location, and so on.

   ![View logic apps associated with subscriptions](./media/logic-apps-monitor-your-logic-apps/logic-apps-list-in-subscription.png)

1. Select your logic app, and then select **Overview**.

   On the overview pane, under **Runs history**, all the past, current, and any waiting runs for your logic app appear, for example:

   ![Overview, runs history, and other logic app information](media/logic-apps-monitor-your-logic-apps/overview-pane-logic-app-details-run-history.png)

   > [!TIP]
   > If you don't find all the data that you expect, on the toolbar, select **Refresh**.

   For status definitions and descriptions, see [Troubleshoot your logic app](../logic-apps/logic-apps-diagnosing-failures.md).

1. To review the steps and other information for a specific run, under **Runs history**, select that run.

   ![Select a specific run to review](media/logic-apps-monitor-your-logic-apps/select-specific-logic-app-run.png)

   The **Logic app run** pane shows each step in the selected run, each step's run status, and the time taken for each step to run, for example:

   ![Each action in the specific run](media/logic-apps-monitor-your-logic-apps/logic-app-run-pane.png)

1. To get more information about a specific step, select that step so that the shape expands. You can now view details such as inputs, outputs, and any errors that happened in that step, for example:

   ![View the details for a specific step](media/logic-apps-monitor-your-logic-apps/specific-step-inputs-outputs-errors.png)

   > [!NOTE]
   > All runtime details and events are encrypted within the Logic Apps service. 
   > They are decrypted only when a user requests to view that data. 
   > You can [hide inputs and outputs in run history](../logic-apps/logic-apps-securing-a-logic-app.md#obfuscate) 
   > or control user access to this information by using 
   > [Azure Role-Based Access Control (RBAC)](../role-based-access-control/overview.md).

1. To get more information about the run itself, on the toolbar, select **Run Details**.

   ![On the toolbar, select "Run Details"](media/logic-apps-monitor-your-logic-apps/select-run-details-on-toolbar.png)

   This information summarizes the steps, status, inputs, and outputs for the run.

   ![Review information about the run](media/logic-apps-monitor-your-logic-apps/review-logic-app-run-details.png)

   For example, you can get the run's **Correlation ID** property, which you might need when you use the 
   [REST API for Logic Apps](https://docs.microsoft.com/rest/api/logic).

## Review trigger history

1. To view all the trigger activity for your logic app, on your logic app's menu, select **Overview**.
In the **Summary** section, under **Evaluation**, select **See trigger history**.

   ![View trigger history for your logic app](media/logic-apps-monitor-your-logic-apps/overview-pane-logic-app-details-trigger-history.png)

1. To view information about a specific trigger event, on the trigger pane, select the specific trigger event that you want to review.

   ![View trigger history for your logic app](media/logic-apps-monitor-your-logic-apps/select-trigger-event-for-review.png)

   You can now review information about the selected trigger event, for example:

   ![View specific trigger information](media/logic-apps-monitor-your-logic-apps/view-specific-trigger-details.png)

<a name="azure-diagnostics"></a>

## Set up diagnostics logging

For richer debugging with runtime details and events, you can set up diagnostics logging with [Azure Monitor logs](../log-analytics/log-analytics-overview.md). Azure Monitor is a service in Azure that monitors your cloud and on-premises environments to help you maintain their availability and performance.

Before you start, you need to have a Log Analytics workspace. Learn [how to create a Log Analytics workspace](../azure-monitor/learn/quick-create-workspace.md).

1. In the [Azure portal](https://portal.azure.com), find and select your logic app.

1. On your logic app menu, under **Monitoring**, select **Diagnostic settings** > **Add diagnostic setting**.

   ![Under "Monitoring", select "Diagnostic settings" > "Add diagnostic setting"](media/logic-apps-monitor-your-logic-apps/logic-app-diagnostics.png)

1. To create the setting, follow these steps:

   1. Provide a name for the setting.

   1. Select **Send to Log Analytics**.

   1. For **Subscription**, select the Azure subscription for your Log Analytics workspace.

   1. For **Log Analytics Workspace**, select the workspace that you want to use.

   1. Under **log**, select the **WorkflowRuntime** category, which specifies the event category that you want to record.

   1. To select all metrics, under **metric**, select **AllMetrics**.

   1. When you're done, select **Save**.

   ![Select Log Analytics workspace and data for logging](media/logic-apps-monitor-your-logic-apps/send-diagnostics-data-log-analytics-workspace.png)

Now, you can find events and other data for trigger events, run events, and action events.

<a name="find-events"></a>

## Review logged events and data

To find and review the events and data from your logic app, such as trigger events, run events, and action events, follow these steps.

1. In the [Azure portal](https://portal.azure.com) search box, enter "log analytics workspaces" as your filter, and select **Log Analytics workspaces**.

   ![Find and select "Log Analytics workspaces"](media/logic-apps-monitor-your-logic-apps/find-select-log-analytics-workspaces.png)

1. On the **Log Analytics workspaces** pane, select your workspace.

   ![Select your Log Analytics workspace](media/logic-apps-monitor-your-logic-apps/select-log-analytics-workspace.png)

1. On your workspace's menu, select **Logs**.

   ![On workspace menu, select "Logs"](media/logic-apps-monitor-your-logic-apps/log-search.png)

4. In the search box, specify a field that you want to find, and press **Enter**. 
When you start typing, you see possible matches and operations that you can use. 

   For example, to find the top 10 events that happened, 
   enter and select this search query: **search Category == "WorkflowRuntime" | limit 10**

   ![Enter search string](media/logic-apps-monitor-your-logic-apps/oms-start-query.png)

   Learn more about [how to find data in Azure Monitor logs](../log-analytics/log-analytics-log-searches.md).

5. On the results page, in the left bar, choose the timeframe that you want to view.
To refine your query by adding a filter, choose **+Add**.

   ![Choose timeframe for query results](media/logic-apps-monitor-your-logic-apps/query-results.png)

6. Under **Add Filters**, enter the filter name so you can find the filter you want. 
Select the filter, and choose **+Add**.

   This example uses the word "status" to find failed events under **AzureDiagnostics**.
   Here the filter for **status_s** is already selected.

   ![Select filter](media/logic-apps-monitor-your-logic-apps/log-search-add-filter.png)

7. In the left bar, select the filter value that you want to use, and choose **Apply**.

   ![Select filter value, choose "Apply"](media/logic-apps-monitor-your-logic-apps/log-search-apply-filter.png)

8. Now return to the query that you're building. 
Your query is updated with your selected filter and value. 
Your previous results are now filtered too.

   ![Return to your query with filtered results](media/logic-apps-monitor-your-logic-apps/log-search-query-filtered-results.png)

9. To save your query for future use, choose **Save**. 
Learn [how to save your query](../logic-apps/logic-apps-track-b2b-messages-omsportal-query-filter-control-number.md#save-oms-query).

<a name="extend-diagnostic-data"></a>

## Extend how and where you use diagnostic data with other services

Along with Azure Monitor logs, you can extend how you use your logic app's 
diagnostic data with other Azure services, for example: 

* [Archive Azure Diagnostics Logs in Azure Storage](../azure-monitor/platform/archive-diagnostic-logs.md)
* [Stream Azure Diagnostics Logs to Azure Event Hubs](../azure-monitor/platform/resource-logs-stream-event-hubs.md) 

You can then get real-time monitoring by using telemetry and analytics from other services, 
like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) 
and [Power BI](../azure-monitor/platform/powerbi.md). For example:

* [Stream data from Event Hubs to Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md)
* [Analyze streaming data with Stream Analytics and create a real-time analytics dashboard in Power BI](../stream-analytics/stream-analytics-power-bi-dashboard.md)

Based on the options that you want set up, make sure that you first 
[create an Azure storage account](../storage/common/storage-create-storage-account.md) 
or [create an Azure event hub](../event-hubs/event-hubs-create.md). 
Then select the options for where you want to send diagnostic data:

![Send data to Azure storage account or event hub](./media/logic-apps-monitor-your-logic-apps/storage-account-event-hubs.png)

> [!NOTE]
> Retention periods apply only when you choose to use a storage account.

<a name="add-azure-alerts"></a>

## Set up alerts for your logic app

To monitor specific metrics or exceeded thresholds for your logic app, 
set up [alerts in Azure](../azure-monitor/platform/alerts-overview.md). 
Learn about [metrics in Azure](../monitoring-and-diagnostics/monitoring-overview-metrics.md). 

To set up alerts without 
[Azure Monitor logs](../log-analytics/log-analytics-overview.md), follow these steps. 
For more advanced alerts criteria and actions, [set up Azure Monitor logs](#azure-diagnostics) too.

1. On the logic app blade menu, under **Monitoring**, 
choose **Diagnostics** > **Alert rules** > **Add alert** as shown here:

   ![Add an alert for your logic app](media/logic-apps-monitor-your-logic-apps/set-up-alerts.png)

2. On the **Add an alert rule** blade, create your alert as shown:

   1. Under **Resource**, select your logic app, if not already selected. 
   2. Give a name and description for your alert.
   3. Select a **Metric** or event that you want to track.
   4. Select a **Condition**, specify a **Threshold** for the metric, 
   and select the **Period** for monitoring this metric.
   5. Select whether to send mail for the alert. 
   6. Specify any other email addresses for sending the alert. 
   You can also specify a webhook URL where you want to send the alert.

   For example, this rule sends an alert when five or more runs fail in an hour:

   ![Create metric alert rule](media/logic-apps-monitor-your-logic-apps/create-alert-rule.png)

> [!TIP]
> To run a logic app from an alert, you can include the 
> [request trigger](../connectors/connectors-native-reqres.md) in your workflow, 
> which lets you perform tasks like these examples:
> 
> * [Post to Slack](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
> * [Send a text](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)
> * [Add a message to a queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)

<a name="diagnostic-event-properties"></a>

## Azure Diagnostics event settings and details

Each diagnostic event has details about your logic app and that event, 
for example, the status, start time, end time, and so on. 
To programmatically set up monitoring, tracking, and logging, 
you can use these details with the 
[REST API for Azure Logic Apps](https://docs.microsoft.com/rest/api/logic) 
and the [REST API for Azure Diagnostics](../azure-monitor/platform/metrics-supported.md#microsoftlogicworkflows).

For example, the `ActionCompleted` event has the 
`clientTrackingId` and `trackedProperties` properties 
that you can use for tracking and monitoring:

``` json
{
    "time": "2016-07-09T17:09:54.4773148Z",
    "workflowId": "/SUBSCRIPTIONS/<subscription-ID>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/MYLOGICAPP",
    "resourceId": "/SUBSCRIPTIONS/<subscription-ID>/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/MYLOGICAPP/RUNS/08587361146922712057/ACTIONS/HTTP",
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
            "subscriptionId": "<subscription-ID>",
            "resourceGroupName": "MyResourceGroup",
            "workflowId": "cff00d5458f944d5a766f2f9ad142553",
            "workflowName": "MyLogicApp",
            "runId": "08587361146922712057",
            "location": "westus",
            "actionName": "Http"
        },
        "correlation": {
            "actionTrackingId": "e1931543-906d-4d1d-baed-dee72ddf1047",
            "clientTrackingId": "<my-custom-tracking-ID>"
        },
        "trackedProperties": {
            "myTrackedProperty": "<value>"
        }
    }
}
```

* `clientTrackingId`: If not provided, Azure automatically generates this ID 
and correlates events across a logic app run, 
including any nested workflows that are called from the logic app. 
You can manually specify this ID from a trigger by passing a 
`x-ms-client-tracking-id` header with your custom ID value 
in the trigger request. You can use a request trigger, 
HTTP trigger, or webhook trigger.

* `trackedProperties`: To track inputs or outputs in diagnostics data, 
you can add tracked properties to actions in your logic app's JSON definition. 
Tracked properties can track only a single action's inputs and outputs, 
but you can use the `correlation` properties of events to correlate across actions in a run.

  To track one or more properties, add the `trackedProperties` section and the 
  properties you want to the action definition. For example, 
  suppose you want to track data like an "order ID" in your telemetry:

  ``` json
  "myAction": {
    "type": "http",
    "inputs": {
        "uri": "http://uri",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": "@triggerBody()"
    },
    "trackedProperties": {
        "myActionHTTPStatusCode": "@action()['outputs']['statusCode']",
        "myActionHTTPValue": "@action()['outputs']['body']['<content>']",
        "transactionId": "@action()['inputs']['body']['<content>']"
    }
  }
  ```
  Here's another example that uses **Initialize variable** action. The example adds tracked properties from the action's input where the input is an array, not a record.  

  ``` json
  "actions": { 
   "Initialize_variable": { 
      "inputs": { 
         "variables": [{ 
            "name": "ConnectorName", 
            "type": "String", 
            "value": "SFTP-SSH" 
         }]
      },
      "runAfter": {},
      "trackedProperties": { 
         "Track1": "@action().inputs.variables[0].value"
      },
      "type": "InitializeVariable"
   } 
  }
  ```

## Next steps

* [Automate logic app deployment](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)
* [B2B scenarios with Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Monitor B2B messages](../logic-apps/logic-apps-monitor-b2b-message.md)
