---
title: Create replication tasks for Azure resources
description: Replicate Azure resources using replication task templates based on workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/22/2021
---

# Create replication tasks for Azure resources using Azure Logic Apps (preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To reduce the impact that unpredictable events can have on your Azure resources, you can replicate content in these resources to help you maintain business continuity. You can create a [*replication task*](#replication-task) that moves the data, events, or messages from a source in one region to a target in another region. That way, you can have the target readily available if the source goes offline and the target has to take over. Each replication task that you create is powered by a stateless workflow in a **Logic App (Standard)** resource, which is hosted in single-tenant Azure Logic Apps. If you're new to logic apps and workflows, review [What is Azure Logic Apps](logic-apps-overview.md) and [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

> [!NOTE]
> Currently, [replication task templates](#replication-task-templates) are available for 
> [Azure Event Hubs](../event-hubs/event-hubs-about.md) and [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md).

This article provides an overview about replication tasks powered by Azure Logic Apps and shows how to create an example replication task for Azure Service Bus queues.

<a name="replication-task"></a>

## What is a replication task?

A replication task receives data, events, or messages from a source, moves that content to a target, and then deletes that content from the source. Most replication tasks move the content unchanged. At most, if the source and target protocols differ, these tasks perform mappings between metadata structures. Replication tasks are generally stateless, meaning that they don't share states or other side-effects across parallel or sequential executions of a task.

Replication doesn't aim to exactly create exact 1:1 clones of a source to a target. Instead, replication focuses on preserving the relative order of events where required by grouping related events with the same partition key and arranges messages with the same partition key sequentially in the same partition.

<a name="replication-task-templates"></a>

## Replication task templates

The following table lists the replication task templates currently available in this preview:

| Resource type | Replication task templates |
|---------------|----------------------------|
| Azure Event Hubs | - **Replicate to Event Hubs instance**: Replicate content between two Event Hubs instances, or event hubs. <br>- **Replicate from Event Hubs instance to Service Bus queue** <br>- **Replicate from Event Hubs instance to Service Bus topic** |
| Azure Service Bus | - **Replicate to Service Bus queue**: Replicate content between two Service Bus queues. <br>- **Replicate from service Bus queue to Event Hub instance** <br>- **Replicate from Service Bus queue to Service Bus topic** <br>- **Replicate from Service Bus topic subscription to Service Bus queue** <br>- **Replicate from Service Bus topic subscription to Event Hubs instance** |
|||

## Replication tasks with Azure Logic Apps versus Azure Functions

### Replication topology for Event Hubs

![Conceptual diagram showing topology for replication task powered by a "Logic App (Standard)" workflow between Event Hubs instances.](media/create-replication-tasks-azure-resources/replication-topology-event-hubs.png)

For more information about replication and federation in Azure Event Hubs with Azure Functions, review the following documentation:

- [Multi-site and multi-region federation for Event Hubs](../event-hubs/event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks and applications with Azure Functions](../event-hubs/event-hubs-federation-replicator-functions.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)

### Replication topology for Service Bus

![Conceptual diagram showing topology for replication task powered by "Logic App (Standard)" workflow between Service Bus queues.](media/create-replication-tasks-azure-resources/replication-topology-service-bus-queues.png)

For more information about replication and federation in Azure Service Bus with Azure Functions, review the following documentation:

- [Message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks and applications](../service-bus-messaging/service-bus-federation-replicator-functions.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

## Naming conventions

For example, if you want to create a replication task between Service Bus queues, you can use the following suggested naming convention:

| Source name | Example | Replication app | Example | Target name | Example |
|-------------|---------|-----------------|---------|-------------|---------|
| Namespace: `<name>-sb-<region>` | `fabrikam-sb-weu` | Logic app: `<name-source-region-target-region>` | `fabrikam-rep-weu-wus` | Namespace: `<name>-sb-<region>` | `fabrikam-sb-wus` |
| Queue: `<name>` | `jobs-transfer` | Workflow: `<name>` | `jobs-transfer-workflow` | Queue: `<name>` | `jobs` |
|||||||

<a name="pricing"></a>

## Pricing

Underneath, a replication task is powered by a stateless workflow in a **Logic App (Standard)** resource that's hosted in single-tenant Azure Logic Apps. When you create this replication task, charges start incurring immediately. Usage, billing, and the pricing model follows the [Standard plan](logic-apps-pricing.md) and [Standard plan rates](https://azure.microsoft.com/pricing/details/logic-apps/). Metering and billing are based on the hosting plan and pricing tier that's used for the underlying logic app resource and workflow.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The source and target resources or entities, which should exist in different Azure regions and vary based on the task template that you want to use. The example in this article uses two Service Bus queues, which are located in different namespaces and Azure regions.

<a name="create-replication-task"></a>

## Create a replication task

This example shows how to create a replication task for Service Bus queues.

1. In the [Azure portal](https://portal.azure.com), find the Service Bus namespace that you want to use as the source.

1. On the namespace navigation menu, in the **Automation** section, and select **Tasks (preview)**.

   ![Screenshot showing Azure portal and Azure Service Bus namespace menu with "Tasks (preview)" selected.](./media/create-replication-tasks-azure-resources/service-bus-automation-menu.png)

1. On the **Tasks** pane, select **Add a task** so that you can select a task template.

   ![Screenshot showing the "Tasks (preview)" pane with "Add a task" selected.](./media/create-replication-tasks-azure-resources/add-replication-task.png)

1. On the **Add a task** pane, under **Select a template**, in the template for the replication task that you want to create, select **Select**. If the next page doesn't appear, select **Next: Authenticate**.

   This example continues by selecting the **Replicate to Service Bus queue** task template, which replicates content between Service Bus queues.

   ![Screenshot showing the "Add a task" pane with "Replicate to Service Bus" template selected.](./media/create-replication-tasks-azure-resources/select-replicate-service-bus-template.png)

1. Under **Authenticate**, in the **Connections** section, select **Create** for every connection that appears in the task so that you can provide authentication credentials for all the connections. The types of connections in each task vary based on the task.

   This example shows the prompt to create the connection to the target Service Bus namespace where the target queue exists. The connection already exists for the source Service Bus namespace.

   ![Screenshot showing selected "Create" option for the connection to the target Service Bus namespace.](./media/create-replication-tasks-azure-resources/create-authenticate-connections.png)

1. Provide the necessary information about the target.

   For this example, provide a display name for the connection, and then select the Service Bus namespace where the target queue exists.

   ![Screenshot showing "Connect" pane with the specified connection display name and the Service Bus namespace selected.](./media/create-replication-tasks-azure-resources/connect-target-service-bus-namespace.png)

   The following example shows the successfully created connection:

   ![Screenshot showing "Add a task" pane with finished connection to Service Bus namespace.](./media/create-replication-tasks-azure-resources/connected-service-bus-namespaces.png)

1. After you finish all the connections, select **Next: Configure**.

1. Under **Configure**, provide a name for the task and any other information required for the task. When you're done, select **Review + create**.

   > [!NOTE]
   > You can't change the task name after creation, so consider a name that still applies if you 
   > [edit the underlying workflow](#edit-task-workflow). Changes that you make to the underlying 
   > workflow apply only to the task that you created, not the task template.
   >
   > For example, if you name your task `fabrikam-rep-weu-wus`, but you later edit the underlying 
   > workflow for a different purpose, you can't change the task name to match.

   ![Screenshot showing "Add a task" pane with replication task information, such as task name, source and target queue names, and name to use for the logic app resource.](./media/create-replication-tasks-azure-resources/configure-replication-task.png)

1. On **Review + create** pane, review and confirm the logic app resource information.

   ![Screenshot showing "Review + create" pane with logic app information for confirmation.](./media/create-replication-tasks-azure-resources/validate-replication-task.png)

   > [!NOTE]
   > If your source, target, or both are behind a virtual network, you have to set up permissions and access 
   > after you create the task. In this scenario, this step is required so that the logic app workflow can 
   > access those resources or entities and perform the replication task.

1. When you're ready, select **Create**.

   The task that you created, which is automatically live and running, now appears on the **Tasks** list.

   > [!TIP]
   > If the task doesn't appear immediately, try refreshing the tasks list or wait a little before you refresh. On the toolbar, select **Refresh**.

   ![Screenshot showing "Tasks" pane with created replication task.](./media/create-replication-tasks-azure-resources/created-replication-task.png)

1. If your resources are behind a virtual network, remember to set up permissions for the logic app resource and workflow to access those resources.

## Set up retry policy

To avoid data loss during an availability event on either side of a replication relationship, you need to configure the retry policy for robustness. Refer to the Azure Functions documentation on retries to configure the retry policy.

The policy settings chosen for the example projects in the sample repository configure an exponential backoff strategy with retry intervals from 5 seconds to 15 minutes with infinite retries to avoid data loss.

For Service Bus, review the "using retry support on top of trigger resilience" section to understand the interaction of triggers and the maximum delivery count defined for the queue.

<a name="review-task-history"></a>

## Review task history

This example shows how to view a task's history of workflow runs along with their statuses, inputs, outputs, and other information and continues using the example for a Service Bus queue replication task.

1. In the [Azure portal](https://portal.azure.com), find the Azure resource or entity that has the task history that you want to review.

   For this example, this resource is a Service Bus namespace.

1. On the resource navigation menu, under **Settings**, in the **Automation** section, select **Tasks (preview)**.

1. On the **Tasks** pane, find the task that you want to review. In that task's **Runs** column, select **View**.

   ![Screenshot showing the "Tasks" pane, a replication task, and the selected "View" option.](./media/create-replication-tasks-azure-resources/view-runs-for-task.png)

   This step opens the **Overview** pane for the underlying stateless workflow, which is included in a Standard logic app resource.

1. To view run history for a stateless workflow, on the **Overview** pane toolbar, select **Enable debug mode**.

   The **Run History** tab shows any previous, in progress, and waiting runs for the task along with their identifiers, statuses, start times, and run durations.

   ![Screenshot showing a task's runs, their statuses, and other information.](./media/create-replication-tasks-azure-resources/run-history-list.png)

   The following table describes the possible statuses for a run:

   | Status | Description |
   |--------|-------------|
   | **Cancelled** | The task was cancelled while running. |
   | **Failed** | The task has at least one failed action, but no subsequent actions existed to handle the failure. |
   | **Running** | The task is currently running. |
   | **Succeeded** | All actions succeeded. A task can still finish successfully if an action failed, but a subsequent action existed to handle the failure. |
   | **Waiting** | The run hasn't started yet and is paused because an earlier instance of the task is still running. |
   |||

1. To view the statuses and other information for each step in a run, select that run.

   The run details pane opens and shows the underlying workflow that ran.

   - A workflow always starts with a [*trigger*](../connectors/apis-list.md#triggers). For this task, the workflow starts with the [**Recurrence** trigger](../connectors/connectors-native-recurrence.md).

   - Each step shows its status and run duration. Steps that have 0-second durations took less than 1 second to run.

   ![Screenshot showing each step in the run, status, and run duration.](./media/create-replication-tasks-azure-resources/run-history-details.png)

1. To review the inputs and outputs for each step, select the step, which expands.

   This example shows the inputs for the Service Bus trigger.

   ![Screenshot showing the expanded trigger and inputs.](./media/create-replication-tasks-azure-resources/view-trigger-inputs.png)

   In contrast, the Service Bus action action has inputs from earlier actions in the workflow and outputs.

   ![Screenshot showing an expanded action, inputs, and outputs.](./media/create-replication-tasks-azure-resources/view-action-inputs-outputs.png)

To learn how you can build your own automated workflows so that you can integrate apps, data, services, and systems apart from the context of automation tasks for Azure resources, see [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md).

<a name="edit-task"></a>

## Edit the task

To change a task, you have these options:

- [Edit the task "inline"](#edit-task-inline) so that you can change the task's properties, such as connection information or configuration information.

- [Edit the task's underlying workflow](#edit-task-workflow) in the designer.

<a name="edit-task-inline"></a>

### Edit the task inline

1. In the [Azure portal](https://portal.azure.com), find the resource that has the task that you want to update.

1. On the resource navigation menu, in the **Automation** section, select **Tasks (preview)**.

1. In the tasks list, find the task that you want to update. Open the task's ellipses (**...**) menu, and select **Edit in-line**.

   ![Screenshot showing the opened ellipses menu and the selected option, "Edit in-line".](./media/create-automation-tasks-azure-resources/view-task-inline.png)

   By default, the **Authenticate** tab appears and shows the existing connections.

1. To add new authentication credentials or select different existing authentication credentials for a connection, open the connection's ellipses (**...**) menu, and select either **Add new connection** or if available, different authentication credentials.

   ![Screenshot showing the "Authentication" tab, existing connections, and the selected ellipses menu.](./media/create-automation-tasks-azure-resources/edit-connections.png)

1. To update other task properties, select **Next: Configure**.

   For the task in this example, the only property available for edit is the email address.

   ![Screenshot showing the "Configure" tab.](./media/create-replication-tasks-azure-resources/edit-task-configuration.png)

1. When you're done, select **Save**.

<a name="edit-task-workflow"></a>

### Edit the task's underlying workflow

If you change the underlying workflow for a replication task, your changes affect the original configuration for the task instance that you created, but not the task template. After you make and save your changes, the name that you provided for your original task might not accurately describe the task anymore, so you might have to recreate the task with a different name.

1. In the [Azure portal](https://portal.azure.com), find the resource that has the task that you want to update.

1. On the resource navigation menu, in the **Automation** section, select **Tasks**.

1. In the tasks list, find the task that you want to update. Open the task's ellipses (**...**) menu, and select **Open in Logic Apps**.

   ![Screenshot showing the opened ellipses menu and the selected option, "Open in Logic Apps".](./media/create-replication-tasks-azure-resources/edit-task-logic-app-designer.png)

   The Azure portal changes context to the **Overview** pane for the underlying workflow in the Standard logic app resource, which is powered by Azure Logic Apps. The **Overview** pane shows the same run history that's available for the task.

   ![Screenshot showing the workflow in Azure Logic Apps view with the "Overview" pane selected.](./media/create-replication-tasks-azure-resources/task-logic-apps-view.png)

1. To open the underlying workflow in the designer, on the workflow navigation menu, select **Designer**.

   ![Screenshot showing the "Designer" menu option selected and designer surface with the underlying workflow.](./media/create-replication-tasks-azure-resources/view-task-workflow-logic-app-designer.png)

   You can now edit the properties for the workflow's trigger and actions as well as edit the trigger and actions that define the workflow itself.

1. To view the properties for the trigger or an action, expand that trigger or action.

   ![Screenshot showing the expanded Service Bus trigger.](./media/create-replication-tasks-azure-resources/edit-service-bus-trigger.png)

1. To save your changes, on the designer toolbar, select **Save**.

   ![Screenshot showing the designer toolbar and the selected "Save" command.](./media/create-replication-tasks-azure-resources/save-updated-workflow.png)

1. To test and run the updated workflow, on the workflow navigation menu, select **Overview** > **Run Trigger**.

   After the run finishes, the designer shows the workflow's run details.

   ![Screenshot showing the workflow's run details.](./media/create-replication-tasks-azure-resources/view-run-details-designer.png)

1. To disable the workflow so that the task doesn't continue running, on the **Overview** toolbar, select **Disable**. For more information, review [Disable or enable single-tenant workflows](create-single-tenant-workflows-azure-portal.md#disable-or-enable-workflows).

## Next steps