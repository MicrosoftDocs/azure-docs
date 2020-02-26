---
title: Monitor logic apps by using Azure Monitor logs
description: Troubleshoot logic apps by setting up Azure Monitor logs and collecting diagnostics data for Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: divswa, logicappspm
ms.topic: article
ms.date: 01/30/2020
---

# Set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps

To get richer debugging information about your logic apps during runtime, you can set up and use [Azure Monitor logs](../azure-monitor/platform/data-platform-logs.md) to record and store information about runtime data and events, such as trigger events, run events, and action events in a [Log Analytics workspace](../azure-monitor/platform/resource-logs-collect-workspace.md). [Azure Monitor](../azure-monitor/overview.md) helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. By using Azure Monitor logs, you can create [log queries](../azure-monitor/log-query/log-query-overview.md) that help you collect and review this information. You can also [use this diagnostics data with other Azure services](#extend-data), such as Azure Storage and Azure Event Hubs.

To set up logging for your logic app, you can [enable Log Analytics when you create your logic app](#logging-for-new-logic-apps), or you can [install the Logic Apps Management solution](#install-management-solution) in your Log Analytics workspace for existing logic apps. This solution provides aggregated information for your logic app runs and includes specific details such as status, execution time, resubmission status, and correlation IDs. Then, to enable logging and creating queries for this information, [set up Azure Monitor logs](#set-up-resource-logs).

This article shows how to enable Log Analytics when you create logic apps, how to install and set up the Logic Apps Management solution, and how to set up and create queries for Azure Monitor logs.

## Prerequisites

Before you start, you need a [Log Analytics workspace](../azure-monitor/platform/resource-logs-collect-workspace.md). If you don't have a workspace, learn [how to create a Log Analytics workspace](../azure-monitor/learn/quick-create-workspace.md).

<a name="logging-for-new-logic-apps"></a>

## Enable Log Analytics for new logic apps

You can turn on Log Analytics when you create your logic app.

1. In the [Azure portal](https://portal.azure.com), on the pane where you provide the information to create your logic app, follow these steps:

   1. Under **Log Analytics**, select **On**.

   1. From the **Log Analytics workspace** list, select the workspace where you want to send the data from your logic app runs.

      ![Provide logic app information](./media/monitor-logic-apps-log-analytics/create-logic-app-details.png)

      After you finish this step, Azure creates your logic app, which is now associated with your Log Analytics workspace. Also, this step automatically installs the Logic Apps Management solution in your workspace.

1. When you're done, select **Create**.

1. After you run your logic app, to view your logic app runs, [continue with these steps](#view-logic-app-runs).

<a name="install-management-solution"></a>

## Install Logic Apps Management solution

If you turned on Log Analytics when you created your logic app, skip this step. You already have the Logic Apps Management solution installed in your Log Analytics workspace.

1. In the [Azure portal](https://portal.azure.com)'s search box, enter `log analytics workspaces`, and then select **Log Analytics workspaces**.

   ![Select "Log Analytics workspaces"](./media/monitor-logic-apps-log-analytics/find-select-log-analytics-workspaces.png)

1. Under **Log Analytics workspaces**, select your workspace.

   ![Select your Log Analytics workspace](./media/monitor-logic-apps-log-analytics/select-log-analytics-workspace.png)

1. On the **Overview** pane, under **Get started with Log Analytics** > **Configure monitoring solutions**, select **View solutions**.

   ![On overview pane, select "View solutions"](./media/monitor-logic-apps-log-analytics/log-analytics-workspace.png)

1. Under **Overview**, select **Add**.

   ![On overview pane, add new solution](./media/monitor-logic-apps-log-analytics/add-logic-apps-management-solution.png)

1. After the **Marketplace** opens, in the search box, enter `logic apps management`, and select **Logic Apps Management**.

   ![From Marketplace, select "Logic Apps Management"](./media/monitor-logic-apps-log-analytics/select-logic-apps-management.png)

1. On the solution description pane, select **Create**.

   ![Select "Create" to add "Logic Apps Management" solution](./media/monitor-logic-apps-log-analytics/create-logic-apps-management-solution.png)

1. Review and confirm the Log Analytics workspace where you want to install the solution, and select **Create** again.

   ![Select "Create" for "Logic Apps Management"](./media/monitor-logic-apps-log-analytics/confirm-log-analytics-workspace.png)

   After Azure deploys the solution to the Azure resource group that contains your Log Analytics workspace, the solution appears on your workspace's summary pane.

   ![Workspace summary pane](./media/monitor-logic-apps-log-analytics/workspace-summary-pane-logic-apps-management.png)

<a name="set-up-resource-logs"></a>

## Set up Azure Monitor logs

When you store information about runtime events and data in [Azure Monitor logs](../azure-monitor/platform/data-platform-logs.md), you can create [log queries](../azure-monitor/log-query/log-query-overview.md) that help you find and review this information.

1. In the [Azure portal](https://portal.azure.com), find and select your logic app.

1. On your logic app menu, under **Monitoring**, select **Diagnostic settings** > **Add diagnostic setting**.

   ![Under "Monitoring", select "Diagnostic settings" > "Add diagnostic setting"](./media/monitor-logic-apps-log-analytics/logic-app-diagnostics.png)

1. To create the setting, follow these steps:

   1. Provide a name for the setting.

   1. Select **Send to Log Analytics**.

   1. For **Subscription**, select the Azure subscription that's associated with your Log Analytics workspace.

   1. For **Log Analytics Workspace**, select the workspace that you want to use.

   1. Under **log**, select the **WorkflowRuntime** category, which specifies the event category that you want to record.

   1. To select all metrics, under **metric**, select **AllMetrics**.

   1. When you're done, select **Save**.

   For example:

   ![Select Log Analytics workspace and data for logging](./media/monitor-logic-apps-log-analytics/send-diagnostics-data-log-analytics-workspace.png)

<a name="view-logic-app-runs"></a>

## View logic app runs status

After your logic app runs, you can view the data about those runs in your Log Analytics workspace.

1. In the [Azure portal](https://portal.azure.com), find and open your Log Analytics workspace.

1. On your workspace's menu, select **Workspace summary** > **Logic Apps Management**.

   ![Logic app run status and count](./media/monitor-logic-apps-log-analytics/logic-app-runs-summary.png)

   > [!NOTE]
   > If the Logic Apps Management tile doesn't immediately show results after a run, 
   > try selecting **Refresh** or wait for a short time before trying again.

   Here, your logic app runs are grouped by name or by execution status. This page also shows details about failures in actions or triggers for the logic app runs.

   ![Status summary for your logic app runs](./media/monitor-logic-apps-log-analytics/logic-app-runs-summary-details.png)

1. To view all the runs for a specific logic app or status, select the row for that logic app or status.

   Here is an example that shows all the runs for a specific logic app:

   ![View logic app runs and status](./media/monitor-logic-apps-log-analytics/logic-app-run-details.png)

   For actions where you [set up tracked properties](#extend-data), you can also view those properties by selecting **View** in the **Tracked Properties** column. To search the tracked properties, use the column filter.

   ![View tracked properties for a logic app](./media/monitor-logic-apps-log-analytics/logic-app-tracked-properties.png)

   > [!NOTE]
   > Tracked properties or completed events might experience 10-15 minute 
   > delays before appearing in your Log Analytics workspace.
   > Also, the **Resubmit** capability on this page is currently unavailable.

1. To filter your results, you can perform both client-side and server-side filtering.

   * **Client-side filter**: For each column, select the filters that you want, for example:

     ![Example column filters](./media/monitor-logic-apps-log-analytics/filters.png)

   * **Server-side filter**: To select a specific time window or to limit the number of runs that appear, use the scope control at the top of the page. By default, only 1,000 records appear at a time.

     ![Change the time window](./media/monitor-logic-apps-log-analytics/change-interval.png)

1. To view all the actions and their details for a specific run, select the row for a logic app run.

   Here is an example that shows all the actions and triggers for a specific logic app run:

   ![View actions for a logic app run](./media/monitor-logic-apps-log-analytics/logic-app-action-details.png)

<!-------------
   * **Resubmit**: You can resubmit one or more logic apps runs that failed, succeeded, or are still running. Select the check boxes for the runs that you want to resubmit, and then select **Resubmit**.

     ![Resubmit logic app runs](./media/monitor-logic-apps-log-analytics/logic-app-resubmit.png)
--------------->

<a name="extend-data"></a>

## Send diagnostic data to Azure Storage and Azure Event Hubs

Along with Azure Monitor logs, you can extend how you use your logic app's diagnostic data with other Azure services, for example:

* [Archive Azure resource logs to storage account](../azure-monitor/platform/resource-logs-collect-storage.md)
* [Stream Azure platform logs to Azure Event Hubs](../azure-monitor/platform/resource-logs-stream-event-hubs.md)

You can then get real-time monitoring by using telemetry and analytics from other services, like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) and [Power BI](../azure-monitor/platform/powerbi.md). For example:

* [Stream data from Event Hubs to Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md)
* [Analyze streaming data with Stream Analytics and create a real-time analytics dashboard in Power BI](../stream-analytics/stream-analytics-power-bi-dashboard.md)

Based on the locations where you want to send diagnostic data, make sure that you first [create an Azure storage account](../storage/common/storage-create-storage-account.md) or [create an Azure event hub](../event-hubs/event-hubs-create.md). 
You can then select the destinations where you want to send that data. Retention periods apply only when you use a storage account.

![Send data to Azure storage account or event hub](./media/monitor-logic-apps-log-analytics/diagnostics-storage-event-hub-log-analytics.png)

<a name="diagnostic-event-properties"></a>

## Azure Monitor diagnostics events

Each diagnostic event has details about your logic app and that event, for example, the status, start time, end time, and so on. To programmatically set up monitoring, tracking, and logging, you can use this information with the [REST API for Azure Logic Apps](https://docs.microsoft.com/rest/api/logic) and the [REST API for Azure Monitor](../azure-monitor/platform/metrics-supported.md#microsoftlogicworkflows). You can also use the `clientTrackingId` and `trackedProperties` properties, which appear in 

* `clientTrackingId`: If not provided, Azure automatically generates this ID and correlates events across a logic app run, including any nested workflows that are called from the logic app. You can manually specify this ID in a trigger by passing a `x-ms-client-tracking-id` header with your custom ID value in the trigger request. You can use a request trigger, HTTP trigger, or webhook trigger.

* `trackedProperties`: To track inputs or outputs in diagnostics data, you can add a `trackedProperties` section to an action either by using the Logic App Designer or directly in your logic app's JSON definition. Tracked properties can track only a single action's inputs and outputs, but you can use the `correlation` properties of events to correlate across actions in a run. To track more than one property, one or more properties, add the `trackedProperties` section and the properties that you want to the action definition.

  Here's an example that shows how the **Initialize variable** action definition includes tracked properties from the action's input where the input is an array, not a record.

  ``` json
  {
     "Initialize_variable": {
        "type": "InitializeVariable",
        "inputs": {
           "variables": [
              {
                 "name": "ConnectorName", 
                 "type": "String", 
                 "value": "SFTP-SSH" 
              }
           ]
        },
        "runAfter": {},
        "trackedProperties": { 
           "myTrackedPropertyName": "@action().inputs.variables[0].value"
        }
     }
  }
  ```

  This example show multiple tracked properties:

  ``` json
  "HTTP": {
     "type": "Http",
     "inputs": {
        "body": "@triggerBody()",
        "headers": {
           "Content-Type": "application/json"
        },
        "method": "POST",
        "uri": "http://store.fabrikam.com",
     },
     "runAfter": {},
     "trackedProperties": {
        "myActionHTTPStatusCode": "@action()['outputs']['statusCode']",
        "myActionHTTPValue": "@action()['outputs']['body']['<content>']",
        "transactionId": "@action()['inputs']['body']['<content>']"
     }
  }
  ```

This example shows how the `ActionCompleted` event includes the `clientTrackingId` and `trackedProperties` attributes:

```json
{
   "time": "2016-07-09T17:09:54.4773148Z",
   "workflowId": "/subscriptions/XXXXXXXXXXXXXXX/resourceGroups/MyResourceGroup/providers/Microsoft.Logic/workflows/MyLogicApp",
   "resourceId": "/subscriptions/<subscription-ID>/resourceGroups/MyResourceGroup/providers/Microsoft.Logic/workflows/MyLogicApp/runs/<run-ID>/actions/Http",
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
         "workflowId": "<logic-app-workflow-ID>",
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
         "myTrackedPropertyName": "<value>"
      }
   }
}
```

## Next steps

* [Create monitoring and tracking queries](../logic-apps/create-monitoring-tracking-queries.md)
* [Monitor B2B messages with Azure Monitor logs](../logic-apps/monitor-b2b-messages-log-analytics.md)
