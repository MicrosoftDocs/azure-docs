---
title: Create replication tasks for Azure resources
description: Replicate Azure resources using replication task templates based on workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/01/2021
---

# Create replication tasks for Azure resources using Azure Logic Apps (preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

While maximum availability and reliability are top operational priorities for Azure services, many ways still exist for communication to stop due to networking or name resolution problems, errors, or temporary unresponsiveness. Such conditions aren't "disastrous" such that you'll want to abandon the regional deployment altogether as you might do in disaster recovery situation. However, the business scenario for some apps might become impacted by availability events that last no more than a few minutes or even seconds.

To reduce the effect that unpredictable events can have on your Azure resources in an Azure region, you can replicate the content in these resources to help you maintain business continuity. You can create a [*replication task*](#replication-task) that moves the data, events, or messages from a source in one region to a target in another region. That way, you can have the target readily available if the source goes offline and the target has to take over.

Each replication task that you create is powered by a stateless workflow in a **Logic App (Standard)** resource where you can add multiple workflows. This resource is hosted in single-tenant Azure Logic Apps, which is a scalable and reliable execution environment for configuring and running serverless applications, including replication and federation tasks. If you're new to logic apps and workflows, review [What is Azure Logic Apps](logic-apps-overview.md) and [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md).

> [!NOTE]
> Currently, [replication task templates](#replication-task-templates) are available for 
> [Azure Event Hubs](../event-hubs/event-hubs-about.md) and [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md).

This article provides an overview about replication tasks powered by Azure Logic Apps and shows how to create an example replication task for Azure Service Bus queues.

<a name="replication-task-templates"></a>

## Replication task templates

The following table lists the replication task templates currently available in this preview:

| Resource type | Replication source and target |
|---------------|-------------------------------|
| Azure Event Hubs namespace | - Event Hubs instance to Event Hubs instance <br>- Event Hubs instance to Service Bus queue <br>- Event Hubs instance to Service Bus topic |
| Azure Service Bus namespace | - Service Bus queue to Service Bus queue <br>- Service Bus queue to Event Hub instance <br>- Service Bus queue to Service Bus topic <br>- Service Bus topic subscription to Service Bus queue <br>- Service Bus topic subscription to Event Hubs instance |
|||

<a name="replication-task"></a>

## What is a replication task?

A replication task receives data, events, or messages from a source, moves that content to a target, and then deletes that content from the source. Most replication tasks move the content unchanged. At most, if the source and target protocols differ, these tasks perform mappings between metadata structures. Replication tasks are generally stateless, meaning that they don't share states or other side effects across parallel or sequential executions of a task.

### Replication topology and workflow

To help you visualize how a replication task powered by Azure Logic Apps (Standard) works, the following diagrams show the replication task structure and workflow for Event Hubs instances and for Service Bus queues.

#### Replication topology for Event Hubs

The following diagram shows the topology and replication task workflow between Event Hubs instances:

![Conceptual diagram showing topology for replication task powered by a "Logic App (Standard)" workflow between Event Hubs instances.](media/create-replication-tasks-azure-resources/replication-topology-event-hubs.png)

For information about replication and federation in Azure Event Hubs, review the following documentation:

- [Event Hubs multi-site and multi-region federation](../event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)

#### Replication topology for Service Bus

The following diagram shows the topology and replication task workflow between Service Bus queues:

![Conceptual diagram showing topology for replication task powered by "Logic App (Standard)" workflow between Service Bus queues.](media/create-replication-tasks-azure-resources/replication-topology-service-bus-queues.png)

For information about replication and federation in Azure Service Bus, review the following documentation:

- [Service Bus message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

### Order preservation

Replication doesn't aim to exactly create exact 1:1 clones of a source to a target. Instead, the replication task focuses on preserving the relative order of events for Event Hubs or messages for Service Bus where required by grouping related events or messages respectively with the same partition key. For simple source-to-target replication patterns, you can have duplicate events in Event Hubs and messages in Service Bus.

- Event Hubs also sequentially [arranges messages with the same partition key in the same partition](../event-hubs/event-hubs-features.md#partitions). Event Hubs and Service Bus can also have duplicate events during replication.

  If the partition count in the source and target Event Hubs entities is identical, all streams in the target map to the same partitions as in the source. However, if the partition count differs, which matters in some of the patterns described in [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md), the mapping differs, but streams are always kept together and in order. For example, if the source has 10 partitions and the destination has 12 partitions, the relative order of events is preserved based on their partition key. The relative order of events belonging to different streams or of independent events without a partition key in a target partition might always differ from the source partition.

  For more information, review [Streams and order preservation](../event-hubs/event-hubs-federation-patterns.md#streams-and-order-preservation).

- For Service Bus, you must enable sessions so that message sequences with the same session ID retrieved from the source are submitted to the target queue or topic as a batch in the original sequence and with the same session ID. For more information, review [Sequences and order preservation](../service-bus-messaging/service-bus-federation-patterns.md#sequences-and-order-preservation).

To learn more about multi-site and multi-region federation for Azure services where you can create replication tasks, review the following documentation:

- [Event Hubs multi-site and multi-region federation](../event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)
- [Service Bus message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

### Service-assigned metadata

For Service Bus, the service-assigned metadata of a message obtained from the source Service Bus queue or topic, the original enqueue time, and sequence number are replaced by new service-assigned values in the target Service Bus queue or topic.

For Event Hubs, the service-assigned metadata of an event obtained from the source Event Hubs instance, the original enqueue time, sequence number, and offset are replaced by new service-assigned values in the target Event Hub instance.

<a name="pricing"></a>

## Pricing

Underneath, a replication task is powered by a stateless workflow in a **Logic App (Standard)** resource that's hosted in single-tenant Azure Logic Apps. When you create this replication task, charges start incurring immediately. Usage, metering, billing, and the pricing model follow the [Standard hosting plan](logic-apps-pricing.md) and [Standard plan rates](https://azure.microsoft.com/pricing/details/logic-apps/).

Based on the number of events that Event Hubs receives or messages that Service Bus handles, the Standard plan might scale up or down to maintain minimum CPU usage and low latency during active replication. This behavior requires that you change the Standard plan tier accordingly so that Azure Logic Apps doesn't throttle or start maxing out CPU usage and can still guarantee fast replication speed.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The source and target resources or entities, which should exist in different Azure regions and vary based on the task template that you want to use. The example in this article uses two Service Bus queues, which are located in different namespaces and Azure regions.

- Optional: A **Logic App (Standard)** resource to reuse when you create the replication task. Although you can create this resource when you create the task, a best practice is that you add the task (stateless workflow) to an existing logic app resource, especially if you want to follow the active-passive replication pattern. Make sure that this logic app resource is in a region that differs from the source and target entities in your replication task. For more information, review [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md).

  Currently, this guidance is provided due to the replication task's native integration within Azure resources. When you create a task between entities and choose to create a new logic app resource rather than use an existing one, the *new logic app is created in the same region as the source entity*. If the source region becomes unavailable, the replication task also can't work. In a failover scenario, the task also can't start reading data from the new primary source, formerly the target or secondary entity, which is what the active-passive replication pattern tries to achieve.

- Optional: The connection string for the target namespace of the replication destination. This option enables having the target exist in a different subscription, so that you can set up cross-subscription replication.

<a name="naming"></a>

## Naming conventions

Give careful consideration to the naming strategy you use for your replication tasks or entities, if you haven't created them yet. Make sure that the names are easily identifiable and differentiated. For example, if you're working with Event Hubs namespace, the replication task replicates from every event hub in the source namespace. If you're working with Service Bus queues, the following table provides an example for naming the entities and replication task:

| Source name | Example | Replication app | Example | Target name | Example |
|-------------|---------|-----------------|---------|-------------|---------|
| Namespace: `<name>-sb-<region>` | `fabrikam-sb-weu` | Logic app: `<name-source-region-target-region>` | `fabrikam-rep-weu-wus` | Namespace: `<name>-sb-<region>` | `fabrikam-sb-wus` |
| Queue: `<name>` | `jobs-transfer` | Workflow: `<name>` | `jobs-transfer-workflow` | Queue: `<name>` | `jobs` |
|||||||

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

   To use a connection string instead, the target, or source based on where you started creating the replication task, is dynamically configured so that you only have to connect the target. Just add the connection string for the target namespace. This option enables having the target exist in a different subscription, so that you can set up cross-subscription replication.

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

1. On **Review + create** pane, confirm the Azure resources that the replication task requires for operation.

   ![Screenshot showing "Review + create" pane with resource information for confirmation.](./media/create-replication-tasks-azure-resources/validate-replication-task.png)

   - If you chose to create a new logic app resource for the replication task, the pane shows the required resources that the replication task will create to operate. Although not listed, these resources include an Azure storage account that contains configuration information for the logic app resource, workflow, and other runtime operations. For example, this storage account contains the position or *offset* in the stream or sequence where the primary or source entity stops reading if the primary's region become unavailable.

     > [!NOTE]
     > If you create a new logic app resource during replication task creation, the logic app is created in the 
     > *same region as the source entity*, which is problematic if the source region becomes unavailable and won't 
     > work in a failover scenario. The best practice is to create a **Logic App (Standard)** resource in a different 
     > region than your source. When you create the replication task, select the existing logic app instead and 
     > add the underlying stateless workflow to the existing logic app. For more information, review the [Prerequisites](#prerequisites).

   - If you chose to use an existing logic app resource for the replication task, the pane shows the resources that the replication will reuse to operate.

   > [!NOTE]
   > If your source, target, or both are behind a virtual network, you have to set up permissions and access 
   > after you create the task. In this scenario, permissions and access are required so that the logic app 
   > workflow can perform the replication task.

1. When you're ready, select **Create**.

   The task that you created, which is automatically live and running, now appears on the **Tasks** list.

   > [!TIP]
   > If the task doesn't appear immediately, try refreshing the tasks list or wait a little before you refresh. On the toolbar, select **Refresh**.

   ![Screenshot showing "Tasks" pane with created replication task.](./media/create-replication-tasks-azure-resources/created-replication-task.png)

1. If your resources are behind a virtual network, remember to set up permissions for the logic app resource and workflow to access those resources.

## Set up retry policy

To avoid data loss during an availability event on either side of a replication relationship, you need to configure the retry policy for robustness. To configure the retry policy for a replication task, review the [documentation about retry policies in Azure Logic Apps](logic-apps-exception-handling.md#retry-policies) and the steps to [edit the underlying workflow](#edit-task-workflow).

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
   | **Cancelled** | The task was canceled while running. |
   | **Failed** | The task has at least one failed action, but no subsequent actions existed to handle the failure. |
   | **Running** | The task is currently running. |
   | **Succeeded** | All actions succeeded. A task can still finish successfully if an action failed, but a subsequent action existed to handle the failure. |
   | **Waiting** | The run hasn't started yet and is paused because an earlier instance of the task is still running. |
   |||

1. To view the statuses and other information for each step in a run, select that run.

   The run details pane opens and shows the underlying workflow that ran.

   - A workflow always starts with a [*trigger*](../connectors/apis-list.md#triggers). For this task, the workflow starts with a Service Bus trigger that waits for messages to arrive in the source Service Bus queue.

   - Each step shows its status and run duration. Steps that have 0-second durations took less than 1 second to run.

   ![Screenshot showing each step in the run, status, and run duration in the workflow.](./media/create-replication-tasks-azure-resources/run-history-details.png)

1. To review the inputs and outputs for each step, select the step, which opens a pane that shows the inputs, outputs, and properties details for that step.

   This example shows the inputs for the Service Bus trigger.

   ![Screenshot showing the trigger inputs, outputs, and properties.](./media/create-replication-tasks-azure-resources/view-trigger-inputs-outputs-properties.png)

To learn how you can build your own automated workflows so that you can integrate apps, data, services, and systems apart from the context of replication tasks for Azure resources, see [Create an integration workflow with single-tenant Azure Logic Apps (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md).

<a name="monitor"></a>

## Monitor replication tasks

To check the performance and health of your replication task, or underlying logic app workflow, you can use [Application Insights](../azure-monitor/app/app-insights-overview.md), which is capability in Azure Monitor. The [Application Insights Application Map](../azure-monitor/app/app-map.md) is a useful visual tool that you can use to monitor replication tasks. This map is automatically generated from the captured monitoring information so that you can explore the performance and reliability of the replication task source and target transfers. For immediate diagnostic insights and low latency visualization of log details, you can work with the [Live Metrics](../azure-monitor/app/live-stream.md) portal tool, also a capability in Azure Monitor.

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

   ![Screenshot showing the opened ellipses menu and the selected option, "Edit in-line".](./media/create-replication-tasks-azure-resources/edit-task-in-line.png)

   By default, the **Authenticate** tab appears and shows the existing connections.

1. To add new authentication credentials or select different existing authentication credentials for a connection, open the connection's ellipses (**...**) menu, and select either **Add new connection** or if available, different authentication credentials.

   > [!NOTE]
   > You can edit only the target connection, not the source connection.

   ![Screenshot showing the "Authenticate" tab, existing connections, and the selected ellipses menu.](./media/create-replication-tasks-azure-resources/edit-connections.png)

1. To update other task properties, select **Next: Configure**.

   For the task in this example, you can specify different source and target queues. However, the task name and underlying logic app and workflow remain the same.

   ![Screenshot showing the "Configure" tab and properties available to edit.](./media/create-replication-tasks-azure-resources/edit-task-configuration.png)

1. When you're done, select **Save**.

<a name="edit-task-workflow"></a>

### Edit the task's underlying workflow

If you change the underlying workflow for a replication task, your changes affect the original configuration for the task instance that you created, but not the task template. After you make and save your changes, the name that you provided for your original task might not accurately describe the task anymore, so you might have to recreate the task with a different name.

1. In the [Azure portal](https://portal.azure.com), find the resource that has the task that you want to update.

1. On the resource navigation menu, in the **Automation** section, select **Tasks**.

1. In the tasks list, find the task that you want to update. Open the task's ellipses (**...**) menu, and select **Open in Logic Apps**.

   ![Screenshot showing the opened ellipses menu and the selected option, "Open in Logic Apps".](./media/create-replication-tasks-azure-resources/open-task-in-designer.png)

   The Azure portal changes context to designer where you can now edit the workflow.

   ![Screenshot showing designer and underlying workflow.](./media/create-replication-tasks-azure-resources/view-task-workflow-designer.png)

   You can now edit the workflow's trigger and actions as well as the properties for the trigger and actions.

1. To view the properties for the trigger or an action, select that trigger or action.

   ![Screenshot showing the Service Bus trigger properties pane.](./media/create-replication-tasks-azure-resources/edit-service-bus-trigger.png)

   For this example, the trigger's **IsSessionsEnabled** property is changed to **Yes**.

1. To save your changes, on the designer toolbar, select **Save**.

   ![Screenshot showing the designer toolbar and the selected "Save" command.](./media/create-replication-tasks-azure-resources/save-updated-workflow.png)

1. To test and run the updated workflow, open the logic app resource that contains the updated workflow. On the workflow navigation menu, select **Overview** > **Run Trigger** > **Run**.

   After the run finishes, the designer shows the workflow's run details. To review the inputs and outputs for each step, select the step, which opens a pane that shows the inputs, outputs, and properties details for that step.

   This example shows the selected Service Bus trigger's inputs, outputs, and properties, along with the updated trigger property value.

   ![Screenshot showing the workflow's run details with the trigger's inputs, outputs, and properties.](./media/create-replication-tasks-azure-resources/view-updated-run-details-trigger-inputs.png)

1. To disable the workflow so that the task doesn't continue running, on the **Overview** toolbar, select **Disable**. For more information, review [Disable or enable single-tenant workflows](create-single-tenant-workflows-azure-portal.md#disable-or-enable-workflows).

<a name="edit-default-config"></a>

## Increase replication speed and performance

As previously stated, behind a replication task is a stateless workflow that's in a **Logic App (Standard)** resource. This resource is powered by the single-tenant Azure Logic Apps runtime, which uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This design provides portability, flexibility, and more performance for logic app workflows plus other capabilities and benefits inherited from the Azure Functions platform and Azure App Service ecosystem.

If you want your replication task to process more events or messages per second for faster replication, you can edit the default configuration for the trigger and actions in the task workflow.

- For Event Hubs, go to the `host.jon` file in the Event Hubs extension, and change the trigger's default configuration. For more information, review [Azure Event Hubs trigger and bindings](../azure-functions/functions-bindings-event-hubs.md#host-json)

- For Service Bus, go to the `host.json` file, and change the trigger's default configuration. For more information, review [Azure Service Bus bindings](../azure-functions/functions-bindings-service-bus.md#hostjson-settings).

<a name="failover"></a>

## Set up failover with replication tasks

If you set up the geo-disaster recovery capabilities in Azure Event Hubs or Azure Service Bus, you can use replication tasks to protect against regional availability incidents or network disruptions. Any such failure scenario requires performing a failover from the primary or source entity to the secondary or target entity and then telling any affected producers and consumers to use the endpoint for the secondary or target entity, which becomes the new primary or source. So, if a disaster happens, and the primary entity fails over, the event publishing or message sending applications are redirected to the new primary (formerly secondary) source.

When the region for the primary or source becomes unavailable, failover to the secondary or target entity isn't immediate. The *offset* is the position in the stream or sequence where the primary or source entity stopped reading. This offset is read by and kept in the Azure storage account that was created by the replication task. To make sure that your replication task starts reading can consume and replicate events from the new primary, you have to manually reconfigure the task to consume from the appropriate offset information at the start of the stream for the new primary namespace.

To enable failover from the primary or source entity and to make sure that the replication task starts reading from the secondary or target entity at the correct position, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open the logic app resource or underlying workflow behind the replication task.

1. On the resource or workflow's navigation menu, select **Overview**. On the **Overview** toolbar, either select **Disable** for the workflow or select **Stop** for the logic app resource.

1. Go to the Azure resource group that contains the replication task resources.

   This resource group includes the logic app resource and the Azure storage account that contains the position or *offset* in the stream or sequence where the primary or source entity stopped when the primary's region became unavailable.

1. Delete the storage account.

1. Return to the logic app resource or workflow behind the replication task. Start the logic app or enable the workflow again.

To force producers and consumers to use the secondary endpoint, you need to make information about the entity available to use and look up in a location that's easy to reach and update. If producers or consumers encounter frequent or persistent errors, they should consult that location and adjust their configuration. There are numerous ways to share that configuration, but DNS and file shares are examples.

For more information about geo-disaster recovery, review the following documentation:

- [Azure Event Hubs - Geo-disaster recovery]()

<a name="problems-failures"></a>

## Replication problems and failures

This section describes possible ways that replication can fail or stop working:

- Message size limits

  Make sure to send messages smaller than 1 MB. Otherwise, if the message size is larger than the size of events that can be sent to an Event Hubs entity after the task adds replication properties, the replication process fails.

  For example, suppose the event size is 1 MB. After the task adds replication properties, the message size is larger than 1 MB. The outbound call that attempts to send the message will fail.

- Partition keys

  If any replication keys exist in events, replication between Event Hubs instances fails if those instances have the same number of partitions.

## Next steps

- [About the workflow designer in single-tenant Azure Logic Apps](designer-overview.md)
- [Edit host and app settings for logic apps in single-tenant Azure Logic Apps](edit-app-settings-host-settings.md)
- [Create parameters to use in workflows across environments in single-tenant Azure Logic Apps](parameterize-workflow-app.md)