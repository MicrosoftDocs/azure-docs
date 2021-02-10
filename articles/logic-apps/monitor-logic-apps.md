---
title: Monitor status, view history, and set up alerts
description: Troubleshoot logic apps by checking run status, reviewing trigger history, and enabling alerts in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: divswa, logicappspm
ms.topic: article
ms.date: 05/04/2020
---

# Monitor run status, review trigger history, and set up alerts for Azure Logic Apps

After you [create and run a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md), you can check that logic app's run status, [runs history](#review-runs-history), [trigger history](#review-trigger-history), and performance. To get notifications about failures or other possible problems, set up [alerts](#add-azure-alerts). For example, you can create an alert that detects "when more than five runs fail in an hour."

For real-time event monitoring and richer debugging, set up diagnostics logging for your logic app by using [Azure Monitor logs](../azure-monitor/overview.md). This Azure service helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. You can then find and view events, such as trigger events, run events, and action events. By storing this information in [Azure Monitor logs](../azure-monitor/platform/data-platform-logs.md), you can create [log queries](../azure-monitor/log-query/log-query-overview.md) that help you find and analyze this information. You can also use this diagnostic data with other Azure services, such as Azure Storage and Azure Event Hubs. For more information, see [Monitor logic apps by using Azure Monitor](../logic-apps/monitor-logic-apps-log-analytics.md).

> [!NOTE]
> If your logic apps run in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) 
> that was created to use an [internal access endpoint](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#endpoint-access), 
> you can view and access inputs and outputs from logic app's runs history *only from inside your virtual network*. Make sure that you have network 
> connectivity between the private endpoints and the computer from where you want to access runs history. For example, your client computer can exist 
> inside the ISE's virtual network or inside a virtual network that's connected to the ISE's virtual network, for example, through peering or a virtual 
> private network. For more information, see [ISE endpoint access](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#endpoint-access). 

<a name="review-runs-history"></a>

## Review runs history

Each time that the trigger fires for an item or event, the Logic Apps engine creates and runs a separate workflow instance for each item or event. By default, each workflow instance runs in parallel so that no workflow has to wait before starting a run. You can review what happened during that run, including the status for each step in the workflow plus the inputs and outputs for each step.

1. In the [Azure portal](https://portal.azure.com), find and open your logic app in the Logic App Designer.

   To find your logic app , in the main Azure search box, enter `logic apps`, and then select **Logic Apps**.

   ![Find and select "Logic Apps" service](./media/monitor-logic-apps/find-your-logic-app.png)

   The Azure portal shows all the logic apps that are associated with your Azure subscriptions. You can filter this list based on name, subscription, resource group, location, and so on.

   ![View logic apps associated with subscriptions](./media/monitor-logic-apps/logic-apps-list-in-subscription.png)

1. Select your logic app, and then select **Overview**.

   On the overview pane, under **Runs history**, all the past, current, and any waiting runs for your logic app appear. If the list shows many runs, and you can't find the entry that you want, try filtering the list.

   > [!TIP]
   > If the run status doesn't appear, try refreshing the overview page by selecting **Refresh**. 
   > No run happens for a trigger that's skipped due to unmet criteria or finding no data.

   ![Overview, runs history, and other logic app information](./media/monitor-logic-apps/overview-pane-logic-app-details-run-history.png)

   Here are the possible run statuses:

   | Run status | Description |
   |------------|-------------|
   | **Aborted** | The run stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | The run was triggered and started but received a cancellation request. |
   | **Failed** | At least one action in the run failed. No subsequent actions in the workflow were set up to handle the failure. |
   | **Running** | The run was triggered and is in progress, but this status can also appear for a run that is throttled due to [action limits](logic-apps-limits-and-config.md) or the [current pricing plan](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Tip**: If you set up [diagnostics logging](monitor-logic-apps-log-analytics.md), you can get information about any throttle events that happen. |
   | **Succeeded** | The run succeeded. If any action failed, a subsequent action in the workflow handled that failure. |
   | **Timed out** | The run timed out because the current duration exceeded the run duration limit, which is controlled by the [**Run history retention in days** setting](logic-apps-limits-and-config.md#run-duration-retention-limits). A run's duration is calculated by using the run's start time and run duration limit at that start time. <p><p>**Note**: If the run's duration also exceeds the current *run history retention limit*, which is also controlled by the [**Run history retention in days** setting](logic-apps-limits-and-config.md#run-duration-retention-limits), the run is cleared from the runs history by a daily cleanup job. Whether the run times out or completes, the retention period is always calculated by using the run's start time and *current* retention limit. So, if you reduce the duration limit for an in-flight run, the run times out. However, the run either stays or is cleared from the runs history based on whether the run's duration exceeded the retention limit. |
   | **Waiting** | The run hasn't started or is paused, for example, due to an earlier workflow instance that's still running. |
   |||

1. To review the steps and other information for a specific run, under **Runs history**, select that run.

   ![Select a specific run to review](./media/monitor-logic-apps/select-specific-logic-app-run.png)

   The **Logic app run** pane shows each step in the selected run, each step's run status, and the time taken for each step to run, for example:

   ![Each action in the specific run](./media/monitor-logic-apps/logic-app-run-pane.png)

   To view this information in list form, on the **Logic app run** toolbar, select **Run Details**.

   ![On the toolbar, select "Run Details"](./media/monitor-logic-apps/select-run-details-on-toolbar.png)

   The Run Details view shows each step, their status, and other information.

   ![Review details about each step in the run](./media/monitor-logic-apps/review-logic-app-run-details.png)

   For example, you can get the run's **Correlation ID** property, which you might need when you use the [REST API for Logic Apps](/rest/api/logic).

1. To get more information about a specific step, select either option:

   * In the **Logic app run** pane select the step so that the shape expands. You can now view information such as inputs, outputs, and any errors that happened in that step, for example:

     ![In logic app run pane, view failed step](./media/monitor-logic-apps/specific-step-inputs-outputs-errors.png)

   * In the **Logic app run details** pane, select the step that you want.

     ![In run details pane, view failed step](./media/monitor-logic-apps/select-failed-step-in-failed-run.png)

     You can now view information such as inputs and outputs for that step, for example:

   > [!NOTE]
   > All runtime details and events are encrypted within the Logic Apps service. 
   > They are decrypted only when a user requests to view that data. 
   > You can [hide inputs and outputs in run history](../logic-apps/logic-apps-securing-a-logic-app.md#obfuscate) 
   > or control user access to this information by using 
   > [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

<a name="review-trigger-history"></a>

## Review trigger history

Each logic app run starts with a trigger. The trigger history lists all the trigger attempts that your logic app made and information about the inputs and outputs for each trigger attempt.

1. In the [Azure portal](https://portal.azure.com), find and open your logic app in the Logic App Designer.

   To find your logic app , in the main Azure search box, enter `logic apps`, and then select **Logic Apps**.

   ![Find and select "Logic Apps" service](./media/monitor-logic-apps/find-your-logic-app.png)

   The Azure portal shows all the logic apps that are associated with your Azure subscriptions. You can filter this list based on name, subscription, resource group, location, and so on.

   ![View logic apps associated with subscriptions](./media/monitor-logic-apps/logic-apps-list-in-subscription.png)

1. Select your logic app, and then select **Overview**.

1. On your logic app's menu, select **Overview**. In the **Summary** section, under **Evaluation**, select **See trigger history**.

   ![View trigger history for your logic app](./media/monitor-logic-apps/overview-pane-logic-app-details-trigger-history.png)

   The trigger history pane shows all the trigger attempts that your logic app has made. Each time that the trigger fires for an item or event, the Logic Apps engine creates a separate logic app instance that runs the workflow. By default, each instance runs in parallel so that no workflow has to wait before starting a run. So if your logic app triggers on multiple items at the same time, a trigger entry with the same date and time appears for each item.

   ![Multiple trigger attempts for different items](./media/monitor-logic-apps/logic-app-trigger-history.png)

   Here are the possible trigger attempt statuses:

   | Trigger status | Description |
   |----------------|-------------|
   | **Failed** | An error occurred. To review any generated error messages for a failed trigger, select that trigger attempt and choose **Outputs**. For example, you might find inputs that aren't valid. |
   | **Skipped** | The trigger checked the endpoint but found no data that met the specified criteria. |
   | **Succeeded** | The trigger checked the endpoint and found available data. Usually, a **Fired** status also appears alongside this status. If not, the trigger definition might have a condition or `SplitOn` command that wasn't met. <p><p>This status can apply to a manual trigger, recurrence trigger, or polling trigger. A trigger can run successfully, but the run itself might still fail when the actions generate unhandled errors. |
   |||

   > [!TIP]
   > You can recheck the trigger without waiting for the next recurrence. On the overview toolbar, select **Run trigger**, 
   > and select the trigger, which forces a check. Or, select **Run** on Logic Apps Designer toolbar.

1. To view information about a specific trigger attempt, on the trigger pane, select that trigger event. If the list shows many trigger attempts, and you can't find the entry that you want, try filtering the list. If you don't find the data that you expect, try selecting **Refresh** on the toolbar.

   ![View specific trigger attempt](./media/monitor-logic-apps/select-trigger-event-for-review.png)

   You can now review information about the selected trigger event, for example:

   ![View specific trigger information](./media/monitor-logic-apps/view-specific-trigger-details.png)

<a name="add-azure-alerts"></a>

## Set up monitoring alerts

To get alerts based on specific metrics or exceeded thresholds for your logic app, set up [alerts in Azure Monitor](../azure-monitor/platform/alerts-overview.md). Learn about [metrics in Azure](../azure-monitor/platform/data-platform.md). To set up alerts without using [Azure Monitor](../azure-monitor/log-query/log-query-overview.md), follow these steps.

1. On your logic app menu, under **Monitoring**, select **Alerts** > **New alert rule**.

   ![Add an alert for your logic app](./media/monitor-logic-apps/add-new-alert-rule.png)

1. On the **Create rule** pane, under **Resource**, select your logic app, if not already selected. Under **Condition**, select **Add** so that you can define the condition that triggers the alert.

   ![Add a condition for the rule](./media/monitor-logic-apps/add-condition-for-rule.png)

1. On the **Configure signal logic** pane, find and select the signal for which you want to get an alert. You can use the search box, or to sort the signals alphabetically, select the **Signal name** column header.

   For example, if you want to send an alert when a trigger fails, follow these steps:

   1. In the **Signal name** column, find and select the **Triggers Failed** signal.

      ![Select signal for creating alert](./media/monitor-logic-apps/find-and-select-signal.png)

   1. On the information pane that opens for the selected signal, under **Alert logic**, set up your condition, for example:

   1. For **Operator**, select **Greater than or equal to**.

   1. For **Aggregation type**, select **Count**.

   1. For **Threshold value**, enter `1`.

   1. Under **Condition preview**, confirm that your condition appears correct.

   1. Under **Evaluated based on**, set up the interval and frequency for running the alert rule. For **Aggregation granularity (Period)**, select the period for grouping the data. For **Frequency of evaluation**, select how often you want to check the condition.

   1. When you're ready, select **Done**.

   Here's the finished condition:

   ![Set up condition for alert](./media/monitor-logic-apps/set-up-condition-for-alert.png)

   The **Create rule** page now shows the condition that you created and the cost for running that alert.

   ![New alert on the "Create rule" page](./media/monitor-logic-apps/finished-alert-condition-cost.png)

1. Specify a name, optional description, and severity level for your alert. Either leave the **Enable rule upon creation** setting turned on, or turn off until you're ready to enable the rule.

1. When you're done, select **Create alert rule**.

> [!TIP]
> To run a logic app from an alert, you can include the 
> [request trigger](../connectors/connectors-native-reqres.md) in your workflow, 
> which lets you perform tasks like these examples:
> 
> * [Post to Slack](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
> * [Send a text](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)
> * [Add a message to a queue](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)

## Next steps

* [Monitor logic apps by using Azure Monitor](../logic-apps/monitor-logic-apps-log-analytics.md)
