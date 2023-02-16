---
title: Monitor Consumption workflows with Azure Monitor Logs
description: Set up Azure Monitor Logs and collect diagnostics data for Azure Logic Apps (Consumption).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/18/2023
# As a developer, I want to collect diagnostics telemetry about my Consumption logic app workflows to specific destinations, such as a Log Analytics workspace, storage account, or event hub, for further analysis.
---

# Monitor Consumption logic app workflows with Azure Monitor Logs

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

> [!NOTE]
> 
> This guide applies only to Consumption workflows. For information about monitoring Standard workflows, see 
> [Monitor Standard workflows with Azure Monitor Logs](monitor-standard-workflows-log-analytics.md).

To get more telemetry and richer information to debug your Consumption workflows while they run, you can set up and use [Azure Monitor Logs](../azure-monitor/logs/data-platform-logs.md) to monitor your workflow runs and send information about runtime data and events, such as trigger events, run events, and action events to a [Log Analytics workspace](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace). If you prefer, you can also send this information to an Azure storage account, Azure Event Hubs, another partner destination, or all these destinations.

After you collect diagnostic data, you can review that data in your Log Analytics workspace and create [queries](../azure-monitor/logs/log-query-overview.md) to find specific information.

This how-to guide shows how to complete the following tasks:

* [Enable Log Analytics when you create your logic app](#logging-for-new-logic-apps) or [install the Logic Apps Management solution](#install-management-solution) in your Log Analytics workspace for existing logic apps. This solution provides aggregated information for your logic app runs and includes specific details such as status, execution time, resubmission status, and correlation IDs.

* [Set up Azure Monitor Logs and create queries](#add-diagnostic-setting)

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Azure subscription Owner or Contributor permissions so you can install the Logic Apps Management solution from the Azure Marketplace. For more information, review [Permission to purchase - Azure Marketplace purchasing](/marketplace/azure-purchasing-invoicing#permission-to-purchase) and [Azure roles - Classic subscription administrator roles, Azure roles, and Azure AD roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles).

* A [Log Analytics workspace](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace). If you don't have a workspace, learn [how to create a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).

<a name="logging-for-new-logic-apps"></a>

## Enable Log Analytics for new logic apps

You can turn on Log Analytics when you create your [Consumption logic app](quickstart-create-first-logic-app-workflow.md).

1. In the [Azure portal](https://portal.azure.com), on the **Create Logic App** pane, follow these steps:

   1. Under **Plan**, make sure to select **Consumption** so that only the options for Consumption workflows appear.

   1. For **Enable log analytics**, select **Yes**.

   1. From the **Log Analytics workspace** list, select the workspace where you want to send the data from your workflow run.

      :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/create-logic-app-details.png" alt-text="Screenshot showing the Azure portal and Consumption logic app creation page.":::

 1. Finish creating your logic app resource. When you're done, your logic app is associated with your Log Analytics workspace. This step also automatically installs the Logic Apps Management solution in your workspace.

1. After you run your workflow, [view your workflow run status](#view-workflow-run-status).

<a name="install-management-solution"></a>

## Install Logic Apps Management solution

If you turned on Log Analytics when you created your logic app resource, skip this section. You already have the Logic Apps Management solution installed in your Log Analytics workspace. Otherwise, continue with the following steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter **log analytics workspaces**, and select **Log Analytics workspaces** from the results.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/find-select-log-analytics-workspaces.png" alt-text="Screenshot showing the Azure portal search box with log analytics workspaces selected.":::

1. Under **Log Analytics workspaces**, select your workspace.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/select-log-analytics-workspace.png" alt-text="Screenshot showing the Azure portal, the Log Analytics workspaces list, and a specific workspace selected.":::

1. On the **Overview** pane, under **Get started with Log Analytics** > **Configure monitoring solutions**, select **View solutions**.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/log-analytics-workspace.png" alt-text="Screenshot showing the Azure portal, the workspace's overview page, and View solutions selected.":::

1. Under **Overview**, select **Add**, which adds a new solution to your workspace.

1. After the **Marketplace** page opens, in the search box, enter **logic apps management**, and select **Logic Apps Management**.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/select-logic-apps-management.png" alt-text="Screenshot showing the Azure portal, the Marketplace page search box with 'logic apps management' entered and 'Logic Apps Management' selected.":::

1. On the **Logic Apps Management** tile, from the **Create** list, select **Logic Apps Management**.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/create-logic-apps-management-solution.png" alt-text="Screenshot showing the Azure portal, the Marketplace page, the 'Logic Apps Management' tile, with the Create list open, and Logic Apps Management (Preview) selected.":::

1. On the **Create Logic Apps Management (Preview) Solution** pane, select the Log Analytics workspace where you want to install the solution. Select **Review + create**, review your information, and select **Create**.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/confirm-log-analytics-workspace.png" alt-text="Screenshot showing the Azure portal, the Create Logic Apps Management (Preview) Solution page, and workspace information.":::

   After Azure deploys the solution to the Azure resource group that contains your Log Analytics workspace, the solution appears on your workspace summary pane under **Overview**.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/workspace-summary-pane-logic-apps-management.png" alt-text="Screenshot showing the Azure portal, the workspace summary pane with Logic Apps Management solution.":::

<a name="add-diagnostic-setting"></a>

## Add a diagnostic setting

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the logic app resource menu, under **Monitoring**, select **Diagnostic settings**. On the **Diagnostic settings** page, select **Add diagnostic setting**.

   :::image type="content" source="media/monitor-consumption-workflows-log-analytics/add-diagnostic-setting.png" alt-text="Screenshot showing Azure portal, Consumption logic app resource menu with 'Diagnostic settings' selected and then 'Add diagnostic setting' selected.":::

1. For **Diagnostic setting name**, provide the name that you want for the setting.

1. Under **Logs** > **Categories**, select **Workflow runtime diagnostic events**. Under **Metrics**, select **AllMetrics**.

1. Under **Destination details**, select one or more destinations, based on where you want to send the logs.

   | Destination | Directions |
   |-------------|------------|
   | **Send to Log Analytics workspace** | Select the Azure subscription for your Log Analytics workspace and the workspace. |
   | **Archive to a storage account** | Select the Azure subscription for your Azure storage account and the storage account. For more information, see [Send diagnostic data to Azure Storage and Azure Event Hubs](#other-destinations). |
   | **Stream to an event hub** | Select the Azure subscription for your event hub namespace, event hub, and event hub policy name. For more information, see [Send diagnostic data to Azure Storage and Azure Event Hubs](#other-destinations) and [Azure Monitor partner integrations](../azure-monitor/partners.md). |
   | **Send to partner solution** | Select your Azure subscription and the destination. For more information, see [Azure Native ISV Services overview](../partner-solutions/overview.md). |

   The following example selects a Log Analytics workspace as the destination:

   :::image type="content" source="media/monitor-consumption-workflows-log-analytics/send-diagnostics-data-log-analytics-workspace.png" alt-text="Screenshot showing Azure portal, Log Analytics workspace, and data to collect.":::

1. To finish adding your diagnostic setting, select **Save**.

Azure Logic Apps now sends telemetry about your Consumption logic app workflow runs to your Log Analytics workspace.

> [!NOTE]
>
> After you enable diagnostics settings, diagnostics data might not flow for up to 30 minutes to the logs 
> at the specified destination, such as Log Analytics, event hub, or storage account. This delay means that 
> diagnostics data from this time period might not exist for you to review. Completed events and 
> [tracked properties](#custom-tracking-properties) might not appear in your Log Analytics workspace for 10-15 minutes.

<a name="view-workflow-run-status"></a>

## View workflow run status

After your workflow runs, you can view the data about those runs in your Log Analytics workspace.

1. In the [Azure portal](https://portal.azure.com), open your Log Analytics workspace.

1. On your workspace menu, under **General**, select **Workspace summary** > **Logic Apps Management**.

   > [!NOTE]
   > 
   > If the Logic Apps Management tile doesn't immediately show results after a run, 
   > try selecting **Refresh** or wait for a short time before trying again.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/logic-app-runs-summary.png" alt-text="Screenshot showing Azure portal, Log Analytics workspace with Consumption logic app workflow run status and count.":::

   The summary page shows logic app workflow runs grouped by name or by execution status. The page also shows details about failures in the actions or triggers for the workflow runs.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/logic-app-runs-summary-details.png" alt-text="Screenshot showing status summary for Consumption logic app workflow runs.":::

1. To view all the runs for a specific Consumption logic app workflow or status, select the row for that logic app workflow or status.

   This example shows all the runs for a specific logic app workflow:

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/logic-app-run-details.png" alt-text="Screenshot showing runs and status for a specific Consumption logic app workflow.":::

   For actions where you added [tracked properties](#custom-tracking-properties), you can view those properties by selecting **View** in the **Tracked Properties** column. To search the tracked properties, use the column filter.

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/logic-app-tracked-properties.png" alt-text="Screenshot showing tracked properties for a specific Consumption logic app workflow.":::

1. To filter your results, you can perform both client-side and server-side filtering.

   * **Client-side filter**: For each column, select the filters that you want, for example:

     :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/filters.png" alt-text="Screenshot showing example client-side filter using column filters.":::

   * **Server-side filter**: To select a specific time window or to limit the number of runs that appear, use the scope control at the top of the page. By default, only 1,000 records appear at a time.

     :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/change-interval.png" alt-text="Screenshot showing example server-side filter that changes the time window.":::

1. To view all the actions and their details for a specific run, select the row for a logic app workflow run.

   The following example shows all the actions and triggers for a specific logic app workflow run:

   :::image type="content" source="./media/monitor-consumption-workflows-log-analytics/logic-app-action-details.png" alt-text="Screenshot showing all operations and details for a specific logic app workflow run.":::

<!-------------
   * **Resubmit**: You can resubmit one or more logic apps runs that failed, succeeded, or are still running. Select the check boxes for the runs that you want to resubmit, and then select **Resubmit**.

     ![Resubmit logic app runs](./media/monitor-consumption-workflows-log-analytics/logic-app-resubmit.png)
--------------->

<a name="other-destinations"></a>

## Send diagnostic data to Azure Storage and Azure Event Hubs

Along with Azure Monitor Logs, you can send the collected data to other destinations, for example:

* [Archive Azure resource logs to storage account](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage)
* [Stream Azure platform logs to Azure Event Hubs](../azure-monitor/essentials/resource-logs.md#send-to-azure-event-hubs)

You can then get real-time monitoring by using telemetry and analytics from other services, such as [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) and [Power BI](../azure-monitor/logs/log-powerbi.md), for example:

* [Stream data from Event Hubs to Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md)
* [Analyze streaming data with Stream Analytics and create a real-time analytics dashboard in Power BI](../stream-analytics/stream-analytics-power-bi-dashboard.md)

Based on the locations where you want to send diagnostic data, make sure that you first [create an Azure storage account](../storage/common/storage-account-create.md) or [create an Azure event hub](../event-hubs/event-hubs-create.md). You can then select the destinations where you want to send that data. Retention periods apply only when you use a storage account.

:::image type="content" source="media/monitor-consumption-workflows-log-analytics/diagnostics-storage-event-hub-log-analytics.png" alt-text="Screenshot showing Azure portal, Consumption logic app resource, diagnostic setting with storage account and event hub options.":::

<a name="custom-tracking-properties"></a>

## Include custom properties in telemetry 

In your workflow, triggers and actions have the capability for you to add the following custom properties so that their values appear along with the emitted telemetry in your Log Analytics workspace.

* Custom tracking ID

  Most triggers have a **Custom Tracking Id** property where you can specify a tracking ID using an expression. You can use this expression to get data from the received message payload or to generate unique values, for example:

  :::image type="content" source="media/monitor-consumption-workflows-log-analytics/custom-tracking-id.png" alt-text="Screenshot showing Azure portal, designer for Consumption workflow, and Request trigger with custom tracking ID.":::

  If you don't specify this custom tracking ID, Azure automatically generates this ID and correlates events across a workflow run, including any nested workflows that are called from the parent workflow. You can manually specify this ID in a trigger by passing a `x-ms-client-tracking-id` header with your custom ID value in the trigger request. You can use a Request trigger, HTTP trigger, or webhook-based trigger.

* Tracked properties

  Actions have a **Tracked Properties** section where you can specify a custom property name and value by entering an expression or hardcoded value to track specific inputs or outputs, for example:

  :::image type="content" source="media/monitor-consumption-workflows-log-analytics/tracked-properties.png" alt-text="Screenshot showing Azure portal, designer for Consumption workflow, and HTTP action with tracked properties.":::

  Tracked properties can track only a single action's inputs and outputs, but you can use the `correlation` properties of events to correlate across actions in a workflow run.

## Next steps

* [Create monitoring and tracking queries](create-monitoring-tracking-queries.md)
* [Monitor B2B messages with Azure Monitor Logs](monitor-b2b-messages-log-analytics.md)
