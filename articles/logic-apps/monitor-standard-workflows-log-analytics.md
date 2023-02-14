---
title: Monitor Standard workflows with Azure Monitor Logs
description: Set up Azure Monitor Logs and collect diagnostics data for Azure Logic Apps (Standard).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/18/2023
# As a developer, I want to collect diagnostics telemetry about my Standard logic app workflows to specific destinations, such as a Log Analytics workspace, storage account or event hub, for further analysis.
---

# Monitor Standard logic app workflows with Azure Monitor Logs (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To get more telemetry and richer information to debug your Standard workflows while they run, you can set up and use [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md) to monitor your workflow runs and send information about runtime data and events, such as trigger events, run events, and action events to a [Log Analytics workspace](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace). If you prefer, you can also send this information to an Azure storage account, Azure Event Hubs, another partner destination, or all these destinations.

After you collect diagnostic data, you can review that data in your Log Analytics workspace and create [queries](../azure-monitor/logs/log-query-overview.md) to find specific information.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A [Log Analytics workspace](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace). If you don't have a workspace, learn [how to create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).

* A [Standard logic app resource with at least one workflow](create-single-tenant-workflows-azure-portal.md)

## Add a diagnostic setting

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app resource menu, under **Monitoring**, select **Diagnostic settings**. On the **Diagnostic settings** page, select **Add diagnostic setting**.

   :::image type="content" source="media/monitor-standard-workflows-log-analytics/add-diagnostic-setting.png" alt-text="Screenshot showing Azure portal, Standard logic app resource menu with 'Diagnostic settings' selected and then 'Add diagnostic setting' selected.":::

1. For **Diagnostic setting name**, provide the name that you want for the setting.

1. Under **Logs** > **Categories**, select **Workflow Runtime Logs**. Under **Destination details**, select the one or more destinations, based on where you want to send the logs.

   | Destination | Directions |
   |-------------|------------|
   | **Send to Log Analytics workspace** | Select your Azure subscription and your Log Analytics workspace. |
   | **Archive to a storage account** | Select your Azure subscription and your Azure storage account. |
   | **Stream to an event hub** | Select your Azure subscription, your event hub namespace, event hub, and event hub policy name. For more information, see [Azure Monitor partner integrations](../azure-monitor/partners.md). |
   | **Send to partner solution** | Select your Azure subscription and the destination. For more information, see [Azure Native ISV Services overview](../partner-solutions/overview.md). |

   The following example selects a Log Analytics workspace as the destination:

   :::image type="content" source="media/monitor-standard-workflows-log-analytics/send-to-log-analytics-workspace.png" alt-text="Screenshot showing Azure portal, Standard logic app resource menu with log analytics options selected.":::

1. Optionally, to include telemetry for events such as **Host.Startup**, **Host.Bindings**, and **Host.LanguageWorkerConfig**, select **Function Application Logs**. For more information, see [Monitor Azure Functions with Azure Monitor Logs](../azure-functions/functions-monitor-log-analytics.md).

1. To finish setting up your diagnostic setting, select **Save**.

Azure Logic Apps now sends telemetry about your Standard logic app workflow runs to your Log Analytics workspace.

## Query the logs

1. In the [Azure portal](https://portal.azure.com), open your Log Analytics workspace.

1. On the workspace navigation menu, select **Logs**.

1. On the new query tab, in the left column, under **Tables**, expand **LogManagement**, and select **LogicAppWorkflowRuntime**.

   In the right pane, under **Results**, the table shows records related to the following events:

   * WorkflowRunStarted
   * WorkflowRunCompleted
   * WorkflowTriggerStarted
   * WorkflowTriggerEnded 
   * WorkflowActionStarted 
   * WorkflowActionCompleted 
   * WorkflowBatchMessageSend 
   * WorkflowBatchMessageRelease 

   For completed events, the **EndTime** column publishes the timestamp for when those finished. This value helps you determine the duration between the start event and the completed event.

   :::image type="content" source="media/monitor-standard-workflows-log-analytics/log-analytics-workspace-results.png" alt-text="Screenshot showing Azure portal, Log Analytics workspace, and captured telemetry for Standard logic app workflow run.":::

## Sample queries

In your Log Analytics workspace's query pane, you can enter your own queries to find specific data, for example:

* Select all events for a specific workflow run ID:

  ```
  LogicAppWorkflowRuntime
  | where RunId == "08585258189921908774209033046CU00"
  ```

* List all exceptions:

  ```
  LogicAppWorkflowRuntime
  | where Error != ""
  | sort by StartTime desc
  ```

* Identify actions that have experienced retries:

  ```
  LogicAppWorkflowRuntime
  | where RetryHistory != ""
  | sort by StartTime desc 
  ```

## Include custom properties in telemetry 

In your workflow, triggers and actions have the capability for you to add the following custom properties so that their values appear along with the emitted telemetry in your Log Analytics workspace.

* Custom tracking ID

  Most triggers have a **Custom Tracking Id** property where you can specify a tracking ID using an expression. You can use this expression to get data from the received message payload or to generate unique values, for example:

  :::image type="content" source="media/monitor-standard-workflows-log-analytics/custom-tracking-id.png" alt-text="Screenshot showing Azure portal, designer for Standard workflow, and Request trigger with custom tracking ID.":::

* Tracked properties

  Actions have a **Tracked Properties** section where you can specify a custom property name and value by entering an expression or hardcoded value, for example:

  :::image type="content" source="media/monitor-standard-workflows-log-analytics/tracked-properties.png" alt-text="Screenshot showing Azure portal, designer for Standard workflow, and HTTP action with tracked properties.":::

The following example shows where these custom properties appear in your Log Analytics workspace:

  :::image type="content" source="media/monitor-standard-workflows-log-analytics/custom-tracking-properties-workspace.png" alt-text="Screenshot showing Azure portal, Log Analytics workspace, and captured telemetry for Standard workflow run with custom tracking properties.":::

## Next steps

