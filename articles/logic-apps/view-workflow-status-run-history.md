---
title: Check workflow status, view run history, and set up alerts
description: Check your workflow status, view workflow run history, and enable alerts in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/07/2025
---

# Check workflow status, view run history, and set up alerts in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

After you run a logic app workflow, you can check that workflow's run status, trigger history, workflow run history, and performance.

This guide shows you how to perform the following tasks:

- [Review trigger history](#review-trigger-history).
- [Review workflow run history](#review-run-history).
- [Set up alerts](#add-azure-alerts) to get notifications about failures or other possible problems. For example, you can create an alert that detects "when more than five runs fail in an hour".

For real-time event monitoring and richer debugging, you can set up diagnostics logging for your logic app workflow by using [Azure Monitor logs](/azure/azure-monitor/overview). This Azure service helps you monitor your cloud and on-premises environments so that you can more easily maintain their availability and performance. You can then find and view events, such as trigger events, run events, and action events. By storing this information in [Azure Monitor logs](/azure/azure-monitor/logs/data-platform-logs), you can create [log queries](/azure/azure-monitor/logs/log-query-overview) that help you find and analyze this information. You can also use this diagnostic data with other Azure services, such as Azure Storage and Azure Event Hubs. For more information, see [Monitor logic apps by using Azure Monitor](monitor-workflows-collect-diagnostic-data.md).

<a name="review-trigger-history"></a>

## Review trigger history

Each workflow run starts with a trigger, which either fires on a schedule or waits for an incoming request or event. The trigger history lists all the trigger attempts that your workflow made and information about the inputs and outputs for each trigger attempt.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow in the designer.

1. On your logic app menu, select **Overview**. On the **Overview** page, select **Trigger history**.

   :::image type="content" source="media/view-workflow-status-run-history/trigger-history-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow, and Overview page with selected tab named Trigger history.":::

   Under **Trigger history**, all trigger attempts appear. Each time the trigger successfully fires, Azure Logic Apps creates an individual workflow instance and runs that instance. By default, each instance runs in parallel so that no workflow has to wait before starting a run. If your workflow triggers for multiple events or items at the same time, a trigger entry appears for each item with the same date and time.

   :::image type="content" source="media/view-workflow-status-run-history/triggers-history-consumption.png" alt-text="Screenshot shows Overview page with Consumption workflow and multiple trigger attempts for different items.":::

   The following table lists the possible trigger statuses:

   | Trigger status | Description |
   |----------------|-------------|
   | **Failed** | An error occurred. To review any generated error messages for a failed trigger, select that trigger attempt, and choose **Outputs**. For example, you might find inputs that aren't valid. |
   | **Skipped** | The trigger checked the endpoint but found no data that met the specified criteria. |
   | **Succeeded** | The trigger checked the endpoint and found available data. Usually, a **Fired** status also appears alongside this status. If not, the trigger definition might have a condition or **SplitOn** command that wasn't met. <br><br>This status can apply to a manual trigger, recurrence-based trigger, or polling trigger. A trigger can run successfully, but the run itself might still fail when the actions generate unhandled errors. |

   > [!TIP]
   >
   > You can recheck the trigger without waiting for the next recurrence. On the 
   > **Overview** page toolbar or on the designer toolbar, select **Run**, **Run**.

1. To view information about a specific trigger attempt, select that trigger event.

   :::image type="content" source="media/view-workflow-status-run-history/select-trigger-event-consumption.png" alt-text="Screenshot shows Consumption workflow trigger history and selected entry.":::

   If the list shows many trigger attempts, and you can't find the entry that you want, try filtering the list. If you don't find the data that you expect, try selecting **Refresh** on the toolbar.

   You can now review information about the selected trigger event, for example:

   :::image type="content" source="media/view-workflow-status-run-history/trigger-details-consumption.png" alt-text="Screenshot shows selected Consumption workflow trigger history information.":::

### [Standard](#tab/standard)

For a stateful workflow, you can review the trigger history for each run, including the trigger status along with inputs and outputs, separately from the [workflow's run history](#review-run-history). In the Azure portal, trigger history and run history appear at the workflow level, not the logic app level.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. On the workflow menu, under **Tools**, select **Run history**. On the **Run history** page, select **Trigger history**.

   :::image type="content" source="media/view-workflow-status-run-history/trigger-history-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow, and Overview page with selected tab named Trigger history.":::

   Under **Trigger history**, all trigger attempts appear. Each time the trigger successfully fires, Azure Logic Apps creates an individual workflow instance and runs that instance. By default, each instance runs in parallel so that no workflow has to wait before starting a run. If your workflow triggers for multiple events or items at the same time, a trigger entry appears for each item with the same date and time. 

   :::image type="content" source="media/view-workflow-status-run-history/triggers-history-standard.png" alt-text="Screenshot shows Standard workflow and Run history page with tab named Trigger history, which shows multiple trigger attempts for different items.":::

   The following table lists the possible trigger statuses:

   | Trigger status | Description |
   |----------------|-------------|
   | **Failed** | An error occurred. To review any generated error messages for a failed trigger, select that trigger attempt and choose **Outputs**. For example, you might find inputs that aren't valid. |
   | **Skipped** | The trigger checked the endpoint but found no data that met the specified criteria. |
   | **Succeeded** | The trigger checked the endpoint and found available data. Usually, a **Fired** status also appears alongside this status. If not, the trigger definition might have a condition or **SplitOn** command that wasn't met. <br><br>This status can apply to a manual trigger, recurrence-based trigger, or polling trigger. A trigger can run successfully, but the run itself might still fail when the actions generate unhandled errors. |

   > [!TIP]
   >
   > You can recheck the trigger without waiting for the next recurrence. On the 
   > **Run history** page toolbar, select **Run**, **Run**.

1. To view information about a specific trigger attempt, select the identifier for that trigger attempt.

   :::image type="content" source="media/view-workflow-status-run-history/select-trigger-event-standard.png" alt-text="Screenshot shows Standard workflow trigger entry selected.":::

   If the list shows many trigger attempts, and you can't find the entry that you want, try filtering the list. If you don't find the data that you expect, try selecting **Refresh** on the toolbar.

1. Check the trigger's inputs to confirm that they appear as you expect. On the **History** pane, under **Inputs link**, select the link, which opens the **Inputs** pane.

   :::image type="content" source="media/view-workflow-status-run-history/trigger-inputs-standard.png" alt-text="Screenshot shows Standard workflow trigger inputs.":::

1. Check the triggers outputs, if any, to confirm that they appear as you expect. On the **History** pane, under **Outputs link**, select the link, which opens the **Outputs** pane.

   Trigger outputs include the data that the trigger passes to the next step in your workflow. Reviewing these outputs can help you determine whether the correct or expected values passed on to the next step in your workflow.

   For example, the RSS trigger generated an error message that states that the RSS feed wasn't found.

   :::image type="content" source="media/view-workflow-status-run-history/trigger-outputs-standard.png" alt-text="Screenshot shows Standard workflow trigger outputs.":::

---

<a name="review-run-history"></a>

## Review workflow run history

Each time that a trigger successfully fires, Azure Logic Apps creates a workflow instance and runs that instance. By default, each instance runs in parallel so that no workflow has to wait before starting a run. You can review what happened during each run, including the status, inputs, and outputs for each step in the workflow.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow in the designer.

1. On your logic app menu, select **Overview**. On the **Overview** page, select **Runs history**.

   Under **Runs history**, all the past, current, and any waiting runs appear. If the trigger fires for multiple events or items at the same time, an entry appears for each item with the same date and time.

   > [!TIP]
   >
   > If the run status doesn't appear, try refreshing the **Overview** page by selecting **Refresh**.
   > No run happens for a trigger that is skipped due to unmet criteria or finding no data.

   :::image type="content" source="media/view-workflow-status-run-history/run-history-consumption.png" alt-text="Screenshot shows Consumption workflow and Overview page with selected tab named Runs history.":::

   The following table lists the possible run statuses:

   | Run status | Description |
   |------------|-------------|
   | **Aborted** | The run stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | The run was triggered and started, but received a cancellation request. |
   | **Failed** | At least one action in the run failed. No subsequent actions in the workflow were set up to handle the failure. |
   | **Running** | The run was triggered and is in progress. However, this status can also appear for a run that is throttled due to [action limits](logic-apps-limits-and-config.md) or the [current pricing plan](https://azure.microsoft.com/pricing/details/logic-apps/). <br><br>**Tip**: If you set up [diagnostics logging](monitor-workflows-collect-diagnostic-data.md), you can get information about any throttle events that happen. |
   | **Succeeded** | The run succeeded. If any action failed, a subsequent action in the workflow handled that failure. |
   | **Timed out** | The run timed out because the current duration exceeded the run duration limit, which is controlled by the [setting named **Run history retention in days**](logic-apps-limits-and-config.md#run-duration-retention-limits). The run duration is calculated by using the run's start time and run duration limit at that start time. <br><br>**Note**: If the run duration also exceeds the current *run history retention limit*, which is also controlled by the [setting named **Run history retention in days**](logic-apps-limits-and-config.md#run-duration-retention-limits), the run is cleared from the run history by a daily cleanup job. Whether the run times out or completes, the retention period is always calculated by using the run's start time and *current* retention limit. So, if you reduce the duration limit for an in-flight run, the run times out. However, the run either stays or is cleared from the run history based on whether the run duration exceeded the retention limit. |
   | **Waiting** | The run didn't start yet or is paused, for example, due to an earlier workflow instance that is still running. |

1. To review the steps and other information for a specific run, under **Runs history**, select that run. If the list shows many runs, and you can't find the entry that you want, try filtering the list.

   :::image type="content" source="media/view-workflow-status-run-history/select-run-consumption.png" alt-text="Screenshot shows a selected Consumption workflow run.":::

   The run history page opens and shows the status for each step in the selected run, for example:

   :::image type="content" source="media/view-workflow-status-run-history/run-history-pane-consumption.png" alt-text="Screenshot shows Consumption workflow run history with each action in the run.":::

   The following table shows the possible statuses that each workflow action can have and show in the portal:

   | Action status | Icon | Description |
   |---------------|------|-------------|
   | **Aborted** | ![Aborted icon][aborted-icon] | The action stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | ![Canceled icon][canceled-icon] | The action was running but received a cancel request. |
   | **Failed** | ![Failed icon][failed-icon] | The action failed. |
   | **Running** | ![Running icon][running-icon] | The action is currently running. |
   | **Skipped** | ![Skipped icon][skipped-icon] | The action was skipped because its **runAfter** conditions weren't met, for example, a preceding action failed. Each action has a `runAfter` object where you can set up conditions that must be met before the current action can run. |
   | **Succeeded** | ![Succeeded icon][succeeded-icon] | The action succeeded. |
   | **Succeeded with retries** | ![Succeeded-with-retries-icon][succeeded-with-retries-icon] | The action succeeded but only after a single or multiple retries. To review the retry history, on the run history page, select that action so that you can view the inputs and outputs. |
   | **Timed out** | ![Timed-out icon][timed-out-icon] | The action stopped due to the time-out limit specified by that action's settings. |
   | **Waiting** | ![Waiting icon][waiting-icon] | Applies to a webhook action that is waiting for an inbound request from a caller. |

   [aborted-icon]: media/view-workflow-status-run-history/aborted.png
   [canceled-icon]: media/view-workflow-status-run-history/cancelled.png
   [failed-icon]: media/view-workflow-status-run-history/failed.png
   [running-icon]: media/view-workflow-status-run-history/running.png
   [skipped-icon]: media/view-workflow-status-run-history/skipped.png
   [succeeded-icon]: media/view-workflow-status-run-history/succeeded.png
   [succeeded-with-retries-icon]: media/view-workflow-status-run-history/succeeded-with-retries.png
   [timed-out-icon]: media/view-workflow-status-run-history/timed-out.png
   [waiting-icon]: media/view-workflow-status-run-history/waiting.png

1. To view the information in list form, on the run history toolbar, select **Run details**.

   The **Logic app run details** pane lists each step, their status, and other information.

   :::image type="content" source="media/view-workflow-status-run-history/run-details-consumption.png" alt-text="Screenshot shows run details for each step in the Consumption workflow.":::

   For example, you can get the run's **Correlation Id** property, which you might need when you use the [REST API for Logic Apps](/rest/api/logic).

1. To get more information about a specific step, select either option:

   * On the run history page, select a step to open a pane that shows the inputs, outputs, and any errors that happened in that step.

     For example, suppose you have a workflow with a failed step. You want to review the inputs that might have caused the step to fail.

     In this scenario, the failure resulted from an invalid or missing connection to an email account that is used to send an email. 

     :::image type="content" source="media/view-workflow-status-run-history/inputs-outputs-errors-consumption.png" alt-text="Screenshot shows Consumption workflow run history page with selected failed example step plus inputs, outputs, and errors for the failed step.":::

   * On the run history page toolbar, select **Run details**. In the **Logic app run details** pane that opens, select the step that you want, for example:

     :::image type="content" source="media/view-workflow-status-run-history/select-failed-step-consumption.png" alt-text="Screenshot shows Consumption workflow, and pane named Logic app run details. The pane shows the selected example failed step.":::

   > [!NOTE]
   >
   > All runtime details and events are encrypted within Azure Logic Apps and 
   > are decrypted only when a user requests to view that data. You can 
   > [hide inputs and outputs in the workflow run history](logic-apps-securing-a-logic-app.md#obfuscate)
   > or control user access to this information by using
   > [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

### [Standard](#tab/standard)

You can view run history only for stateful workflows, not stateless workflows. To enable run history for a stateless workflow, see [Enable run history for stateless workflows](create-single-tenant-workflows-azure-portal.md#enable-run-history-stateless).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. On your workflow menu, under **Tools**, select **Run history**. On the **Run history** page, select **Run history**.

   Under **Run history**, all the past, current, and any waiting runs appear. If the trigger fires for multiple events or items at the same time, an entry appears for each item with the same date and time.

   > [!TIP]
   >
   > If the run status doesn't appear, on the **Run history** page toolbar, select **Refresh**. 
   > No run happens for a trigger that is skipped due to unmet criteria or finding no data.

   :::image type="content" source="media/view-workflow-status-run-history/run-history-standard.png" alt-text="Screenshot shows Standard workflow, run history page, and selected tab named Run history.":::

   The following table lists the possible final statuses that each workflow run can have and show in the portal:

   | Run status | Icon | Description |
   |------------|------|-------------|
   | **Aborted** | ![Aborted icon][aborted-icon] | The run stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | ![Canceled icon][canceled-icon] | The run was triggered and started, but received a cancellation request. |
   | **Failed** | ![Failed icon][failed-icon] | At least one action in the run failed. No subsequent actions in the workflow were set up to handle the failure. |
   | **Running** | ![Running icon][running-icon] | The run was triggered and is in progress. However, this status can also appear for a run that is throttled due to [action limits](logic-apps-limits-and-config.md) or the [current pricing plan](https://azure.microsoft.com/pricing/details/logic-apps/). <br><br>**Tip**: If you set up [diagnostics logging](monitor-workflows-collect-diagnostic-data.md), you can get information about any throttle events that happen. |
   | **Skipped** | ![Skipped icon][skipped-icon] | The trigger condition was checked but wasn't met, so the run never started. |
   | **Succeeded** | ![Succeeded icon][succeeded-icon] | The run succeeded. If any action failed, a subsequent action in the workflow handled that failure. |
   | **Timed out** | ![Timed-out icon][timed-out-icon] | The run timed out because the current duration exceeded the run duration limit, which is controlled by the [setting named **Run history retention in days**](logic-apps-limits-and-config.md#run-duration-retention-limits). The run duration is calculated by using the run's start time and run duration limit at that start time. <br><br>**Note**: If the run duration also exceeds the current *run history retention limit*, which is also controlled by the [setting named **Run history retention in days**](logic-apps-limits-and-config.md#run-duration-retention-limits), the run is cleared from the run history by a daily cleanup job. Whether the run times out or completes, the retention period is always calculated by using the run's start time and *current* retention limit. So, if you reduce the duration limit for an in-flight run, the run times out. However, the run either stays or is cleared from the run history based on whether the run duration exceeded the retention limit. |
   | **Waiting** | ![Waiting icon][waiting-icon] | The run didn't start yet or is paused, for example, due to an earlier workflow instance that is still running. |

1. To review the steps and other information for a specific run, on the **Run history** tab, select that run. If the list shows many runs, and you can't find the entry that you want, try filtering the list.

   :::image type="content" source="media/view-workflow-status-run-history/select-run-standard.png" alt-text="Screenshot shows selected Standard workflow run.":::

   The run history page opens and shows the status for each step in the selected run, for example:

   :::image type="content" source="media/view-workflow-status-run-history/run-history-pane-standard.png" alt-text="Screenshot shows Standard workflow and each action in the selected run.":::

   The following table shows the possible statuses that each workflow action can have and show in the portal:

   | Action status | Icon | Description |
   |---------------|------|-------------|
   | **Aborted** | ![Aborted icon][aborted-icon] | The action stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | ![Canceled icon][canceled-icon] | The action was running but received a cancel request. |
   | **Failed** | ![Failed icon][failed-icon] | The action failed. |
   | **Running** | ![Running icon][running-icon] | The action is currently running. |
   | **Skipped** | ![Skipped icon][skipped-icon] | The action was skipped because its **runAfter** conditions weren't met, for example, a preceding action failed. Each action has a `runAfter` object where you can set up conditions that must be met before the current action can run. |
   | **Succeeded** | ![Succeeded icon][succeeded-icon] | The action succeeded. |
   | **Succeeded with retries** | ![Succeeded-with-retries-icon][succeeded-with-retries-icon] | The action succeeded but only after a single or multiple retries. To review the retry history, on the run history page, select that action so that you can view the inputs and outputs. |
   | **Timed out** | ![Timed-out icon][timed-out-icon] | The action stopped due to the time-out limit specified by that action's settings. |
   | **Waiting** | ![Waiting icon][waiting-icon] | Applies to a webhook action that is waiting for an inbound request from a caller. |

   [aborted-icon]: media/view-workflow-status-run-history/aborted.png
   [canceled-icon]: media/view-workflow-status-run-history/cancelled.png
   [failed-icon]: media/view-workflow-status-run-history/failed.png
   [running-icon]: media/view-workflow-status-run-history/running.png
   [skipped-icon]: media/view-workflow-status-run-history/skipped.png
   [succeeded-icon]: media/view-workflow-status-run-history/succeeded.png
   [succeeded-with-retries-icon]: media/view-workflow-status-run-history/succeeded-with-retries.png
   [timed-out-icon]: media/view-workflow-status-run-history/timed-out.png
   [waiting-icon]: media/view-workflow-status-run-history/waiting.png

1. To get more information about a specific step, on the run history page, select a step to open a pane that shows the inputs, outputs, and any errors that happened in that step.

   For example, suppose you have a workflow with a failed step. You want to review the inputs that might have caused the step to fail.

   In this scenario, the failure resulted from not finding the specified RSS feed, for example:

   :::image type="content" source="media/view-workflow-status-run-history/failed-action-inputs-standard.png" alt-text="Screenshot shows Standard workflow with failed step inputs.":::

   The following screenshot shows the outputs from the failed step.

   :::image type="content" source="media/view-workflow-status-run-history/failed-action-outputs-standard.png" alt-text="Screenshot shows Standard workflow with failed step outputs.":::

   > [!NOTE]
   >
   > All runtime details and events are encrypted within Azure Logic Apps and 
   > are decrypted only when a user requests to view that data. You can 
   > [hide inputs and outputs in the workflow run history](logic-apps-securing-a-logic-app.md#obfuscate)
   > or control user access to this information by using
   > [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

---

<a name="resubmit-workflow-run"></a>

## Rerun a workflow with same inputs

You can rerun a previously finished workflow with the same inputs that the workflow used previously in the following ways:

- Rerun the entire workflow.

- Rerun the workflow starting at a specific action. The resubmitted action and all subsequent actions run as usual.

Completing this task creates and adds a new workflow run to your workflow's run history.

### Limitations and considerations

- By default, only Consumption workflows and Standard stateful workflows, which record and store run history, are supported. To use these capabilities with a stateless Standard workflow, enable stateful mode. For more information, see [Enable run history for stateless workflows](create-single-tenant-workflows-azure-portal.md#enable-run-history-for-stateless-workflows) and [Enable stateful mode for stateless connectors](../connectors/enable-stateful-affinity-built-in-connectors.md).

- The resubmitted run executes the same workflow version as the original run, even if you updated the workflow definition.

- You can rerun only actions from sequential workflows. Workflows with parallel paths are currently not supported.

- The workflow must have a completed state, such as Succeeded, Failed, or Cancelled.

- The workflow must have 40 or fewer actions for you to rerun from a specific action.

- If your workflow has operations such as create or delete operations, resubmitting a run might create duplicate data or try to delete data that no longer exists, resulting in an error.

- These capabilities currently are unavailable with Visual Studio Code or Azure CLI.

### [Consumption](#tab/consumption)

#### Rerun the entire workflow

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow in the designer.

1. On your logic app menu, select **Overview**. On the **Overview** page, select **Runs history**.

   Under **Runs history**, all the past, current, and any waiting runs appear. If the trigger fires for multiple events or items at the same time, an entry appears for each item with the same date and time.

1. On the **Runs history** page, select the run that you want to rerun, and then select **Resubmit**.

   The **Runs history** tab adds the resubmitted run to the runs list.

   > [!TIP]
   >
   > If the resubmitted run doesn't appear, on the **Runs history** page toolbar, select **Refresh**. 
   > No run happens for a trigger that is skipped due to unmet criteria or finding no data.

1. To review the inputs and outputs after the resubmitted run finishes, on the **Runs history** tab, select that run.

### Rerun from a specific action

The rerun action capability is available for most actions except for nonsequential workflows, complex concurrency scenarios, and the following limitations:

| Actions | Resubmit availability and limitations |
|---------|---------------------------------------|
| **Condition** action and actions in the **True** and **False** paths | - Yes for **Condition** action <br>- No for actions in the **True** and **False** paths |
| **For each** action plus all actions inside the loop and after the loop | No for all actions |
| **Switch** action and all actions in the **Default** path and **Case** paths | - Yes for **Switch** action <br>- No for actions in the **Default** path and **Case** paths |
| **Until** action plus all actions inside the loop and after the loop | No for all actions |

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the logic app resource menu, select **Overview**. On the **Overview** page, select **Runs history**, which shows the run history for the workflow.

1. On the **Runs history** tab, select the run that has the action from where you want to rerun the workflow.

   The run history page opens and shows the status for each step in the selected run.

1. To rerun the workflow starting from a specific action, choose either option:

   - Find the action from where to start rerunning the workflow, open the shortcut menu, and select **Submit from this action**.

   - Select the action from where to start rerunning the workflow. In the pane that opens, under the action name, select **Submit from this action**.

   The run history page refreshes and shows the resubmitted run. All the operations that precede the resubmitted action show a lighter-colored status icon, representing reused inputs and outputs. The resubmitted action and subsequent actions show the colored status icons. For more information, see [Review workflow run history](#review-run-history).

   > [!TIP]
   >
   > If the resubmitted run doesn't fully finish, on the run details page toolbar, select **Refresh**.

### [Standard](#tab/standard)

You can rerun only stateful workflows, not stateless workflows. To enable run history for a stateless workflow, see [Enable run history for stateless workflows](create-single-tenant-workflows-azure-portal.md#enable-run-history-stateless).

#### Rerun the entire workflow

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. On the workflow menu, under **Tools**, select **Run history**. On the **Run history** page, select **Run history**, which shows the run history for the current workflow.

1. On the **Run history** tab, select the run that you want to rerun, and then select **Resubmit**.

   The **Run history** tab adds the resubmitted run to the runs list.

   > [!TIP]
   >
   > If the resubmitted run doesn't appear, on the **Run history** page toolbar, select **Refresh**. 
   > No run happens for a trigger that is skipped due to unmet criteria or finding no data.

1. To review the inputs and outputs after the resubmitted run finishes, on the **Run history** tab, select that run.

### Rerun from a specific action

The rerun action capability is available for most actions except for nonsequential workflows, complex concurrency scenarios, and the following limitations:

| Actions | Resubmit availability and limitations |
|---------|---------------------------------------|
| **Condition** action and actions in the **True** and **False** paths | - Yes for **Condition** action <br>- No for actions in the **True** and **False** paths |
| **For each** action plus all actions inside the loop and after the loop | No for all actions |
| **Switch** action and all actions in the **Default** path and **Case** paths | - Yes for **Switch** action <br>- No for actions in the **Default** path and **Case** paths |
| **Until** action plus all actions inside the loop and after the loop | No for all actions |

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

1. On the workflow menu, under **Tools**, select **Run history**, and then select **Run history**, which shows the run history for the current workflow.

1. On the **Run history** tab, select the run that has the action from where you want to rerun the workflow.

   The run details page opens and shows the status for each step in the selected run.

1. To rerun the workflow starting from a specific action, choose either option:

   - Find the action from where to start rerunning the workflow, open the shortcut menu, and select **Submit from this action**.

   - Select the action from where to start rerunning the workflow. In the pane that opens, under the action name, select **Submit from this action**.

   On the run details page, all the operations that precede the resubmitted action show a lighter-colored status icon, representing reused inputs and outputs. The resubmitted action and subsequent actions show the colored status icons. For more information, see [Review workflow run history](#review-run-history).

   > [!TIP]
   >
   > If the resubmitted run doesn't fully finish, on the run details page toolbar, select **Refresh**.

1. Return to the run history page, which now includes the resubmitted run.

---

<a name="add-azure-alerts"></a>

## Set up monitoring alerts

To get alerts based on specific metrics or exceeded thresholds in your workflow, set up your logic app resource with [alerts in Azure Monitor](/azure/azure-monitor/alerts/alerts-overview). For more information, see [Metrics in Azure](/azure/azure-monitor/data-platform).

To set up alerts without using [Azure Monitor](/azure/azure-monitor/logs/log-query-overview), follow these steps, which apply to both Consumption and Standard logic app resources:

1. On your logic app resource menu, under **Monitoring**, select **Alerts**. On the toolbar, select **Create** > **Alert rule**.

1. On the **Create an alert rule** page, from the **Signal name** list, select the signal for which you want to get an alert.

   > [!NOTE]
   >
   > Alert signals differ between Consumption and Standard logic apps. For example, 
   > Consumption logic apps have many trigger-related signals, such as **Triggers Completed** 
   > and **Triggers Failed**, while Standard workflows have the **Workflow Triggers Completed Count** 
   > and **Workflow Triggers Failure Rate** signals.

   For example, to send an alert when a trigger fails in a Consumption workflow, follow these steps:

   1. From the **Signal name** list, select the **Triggers Failed** signal.

   1. Under **Alert logic**, set up your condition, for example:

      | Property | Example value |
      |----------|---------------|
      | **Threshold** | **Static** |
      | **Aggregation type** | **Count** |
      | **Operator** | **Greater than or equal to** |
      | **Unit** | **Count** |
      | **Threshold value** | **1** |

      The **Preview** section now shows the condition that you set up, for example:

      **Whenever the count Triggers Failed is greater than or equal to 1**

   1. Under **When to evaluate**, set up the schedule for checking the condition:

      | Property | Example value |
      |----------|---------------|
      | **Check every** | **1 minute** |
      | **Lookback period** | **5 minutes** |

      For example, the finished condition looks similar to the following example, and the **Create an alert rule** page now shows the cost for running that alert:

      :::image type="content" source="media/view-workflow-status-run-history/set-up-alert-condition.png" alt-text="Screenshot shows Consumption logic app resource with alert condition.":::

1. When you're ready, select **Review + Create**.

For general information, see [Create an alert rule from a specific resource - Azure Monitor](/azure/azure-monitor/alerts/alerts-create-new-alert-rule#create-or-edit-an-alert-rule-in-the-azure-portal).

## Related content

* [Monitor logic apps with Azure Monitor](monitor-workflows-collect-diagnostic-data.md)
