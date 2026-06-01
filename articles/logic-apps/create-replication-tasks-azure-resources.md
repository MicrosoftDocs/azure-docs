---
title: Replicate Azure Resources
description: Learn how to replicate Azure resources by creating replication tasks based on workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/26/2026
ms.custom: sfi-image-nochange
#Customer intent: As a developer who owns or manages resources in Azure, I want replicate these resources to keep them available and running in case communication problems happen.
---

# Replicate Azure resources by creating replication tasks

Azure services prioritize maximum availability and reliability. However, random events can still disrupt or stop communication. For example, networking and name resolution problems, errors, or temporary unresponsiveness can happen. These conditions aren't serious enough to abandon regional deployment, which you might do in a disaster recovery situation. Yet, availability interruptions that last a few minutes or even seconds can still affect your business.

To reduce the impact on your Azure resources from such events, replicate the content in your resources from one Azure region to another region by creating *replication tasks*. A replication task moves data, events, or messages, from a source resource in one region to a target resource in another region. If the source goes offline, the target can take over.

You can also use replication tasks to move content between resources in the same region. However, if the entire region becomes unavailable or experiences disruption, both source and target resources are affected.

This guide includes an overview about replication tasks that are powered by Azure Logic Apps. The guide also shows how to create a replication task for Azure Service Bus queues as an example.

<a name="replication-task"></a>

## What is a replication task?

A replication task receives content, such as data, events, or messages, from a source resource, such as a Service Bus queue. The task then moves this content to a target resource, and then deletes the content from source, except when the source is an Azure Event Hubs entity. Replication tasks usually move content without any changes. These tasks are also stateless, so they don't share states or other side effects across parallel or sequential executions of a task. 

When you use the available templates to create replication tasks, each replication task is powered by single-tenant [Azure Logic Apps](logic-apps-overview.md). Behind the scenes, a [stateless workflow](single-tenant-overview-compare.md#stateful-stateless) in a Standard logic app resource drives each task. The logic app can include multiple workflows for replication tasks.

> [!NOTE]
>
> Replication tasks powered by Azure Logic Apps include *replication properties*. If the source and target protocols differ, the tasks perform mappings between source and target metadata structures.

The Azure Logic Apps platform is scalable and reliable for configuring and running serverless applications, including replication and federation tasks. The runtime for single-tenant Azure Logic Apps uses the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and is hosted as an extension on the Azure Functions runtime. This design provides portability, flexibility, and more performance for logic app workflows. Single-tenant Azure Logic Apps also provides other capabilities and benefits inherited from the Azure Functions and Azure App Service ecosystems.

For more information about replication and federation, see:

- [Event Hubs multi-site and multi-region federation](../event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)
- [Service Bus message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

<a name="replication-task-templates"></a>

## Replication task templates

The following table lists some example replication task templates that are available for [Azure Event Hubs](../event-hubs/event-hubs-about.md) and [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md):

| Resource type | Replication source and target |
|---------------|-------------------------------|
| Azure Event Hubs namespace | - Event Hubs instance to Event Hubs instance <br>- Event Hubs instance to Service Bus queue <br>- Event Hubs instance to Service Bus article |
| Azure Service Bus namespace | - Service Bus queue to Service Bus queue <br>- Service Bus queue to Service Bus topic <br>- Service Bus topic to Service Bus topic <br>- Service Bus queue to Event Hubs instance <br>- Service Bus topic to Service Bus queue <br>- Service Bus topic to Event Hubs instance <br><br>**Important**: When a queue is the source, a replication task doesn't copy messages but *moves* them from the source to the target and deletes them from the source. <br><br>To mirror messages instead, use a topic as your source where the "main" subscription acts like a queue endpoint. That way, the target gets a copy of each message from the source. <br><br>To route messages across different regions, create a queue where messages are sent from an app. The replication task transfers messages from that queue to a target queue in a namespace that's in another region. You can also use a topic subscription as the entity that acts as the transfer queue. For more information, see [Replication topology for ServiceBusCopy](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/functions/config/ServiceBusCopy#replication-topology).|

## Replication topology and workflow

To help you visualize how a replication task works when powered by a Standard logic app workflow, the following diagrams show the replication task structure and workflow for Event Hubs instances and for Service Bus queues.

### Replication topology for Event Hubs

The following diagram shows the topology and replication task workflow between Event Hubs instances:

:::image type="content" source="media/create-replication-tasks-azure-resources/replication-topology-event-hubs.png" alt-text="Diagram shows topology for replication task powered by a Standard logic app workflow between Event Hubs instances.":::

#### Metadata and property mappings for Event Hubs

New service-assigned values in the target Event Hubs namespace replace the following items from the source namespace:

- Service-assigned metadata of an event
- Original enqueue time
- Sequence number
- Offset

For [helper functions](https://github.com/Azure-Samples/azure-messaging-replication-dotnet/tree/main/src/Azure.Messaging.Replication) and the replication tasks in the Azure-provided samples, the original values are preserved in the following user properties:

- `repl-enqueue-time` (ISO8601 string)
- `repl-sequence`
- `repl-offset`

These properties have the `string` type and contain the stringified value of the respective original properties. If the event is forwarded multiple times, the service-assigned metadata of the immediate source is appended to any existing properties, with values separated by semicolons. For more information, see [Service-assigned metadata](../event-hubs/event-hubs-federation-patterns.md#service-assigned-metadata).

For information about replication and federation in Azure Event Hubs, see:

- [Multi-site and multi-region federation](../event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)

### Replication topology for Service Bus

The following diagram shows the topology and replication task workflow between Service Bus queues:

:::image type="content" source="media/create-replication-tasks-azure-resources/replication-topology-service-bus-queues.png" alt-text="Diagram shows topology for replication task powered by a Standard logic app workflow between Service Bus queues.":::

#### Metadata and property mappings for Service Bus

For Service Bus, new service-assigned values in the target Service Bus queue or topic replace the following items from the source queue or topic:

- Service-assigned metadata of a message
- Original enqueue time
- Sequence number

For the default replication tasks in the Azure-provided samples, the original values are preserved in the following user properties:

- `repl-enqueue-time` (ISO8601 string)
- `repl-sequence`

These properties have the `string` type and contain the stringified value of the respective original properties. If the message is forwarded multiple times, the service-assigned metadata of the immediate source is appended to any existing properties, with values separated by semicolons. For more information, see [Service-assigned metadata](../service-bus-messaging/service-bus-federation-patterns.md#service-assigned-metadata).

For information about replication and federation in Azure Service Bus, see:

- [Message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

<a name="replication-properties"></a>

### Metadata and property mappings between Service Bus and Event Hubs

When a task replicates from Service Bus to Event Hubs, the task maps only the `User Properties` property to the `Properties` property. When the task replicates from Event Hubs to Service Bus, the task maps the following properties:

| From Event Hubs | To Service Bus |
|-----------------|----------------|
| ContentType | ContentType |
| CorrelationId | CorrelationId |
| MessageId | MessageId |
| PartitionKey | PartitionKey SessionId |
| Properties | User Properties |
| ReplyTo | ReplyTo |
| ReplyToGroupName | ReplyToSessionId |
| Subject | Label |
| To | To |

<a name="order-preservation"></a>

## Order preservation

For Event Hubs, replication between the same number of [partitions](../event-hubs/event-hubs-features.md#partitions) creates one-to-one clones with no changes in the events, but can also include duplicates. For replication between different numbers of partitions, only the relative order of events is preserved based on the partition key. The result can also include duplicates. For more information, see [Streams and order preservation](../event-hubs/event-hubs-federation-patterns.md#streams-and-order-preservation).

For Service Bus, you must enable sessions. Message sequences with the same session ID from the source are submitted to the target queue or topic as a batch. The messages are in the original sequence and have the same session ID. For more information, see [Sequences and order preservation](../service-bus-messaging/service-bus-federation-patterns.md#sequences-and-order-preservation).

> [!IMPORTANT]
>
> Replication tasks don't track which messages were previously processed when the source experiences a disruptive event. To prevent reprocessing already processed messages, set up a way to track the already processed messages and resume processing with the unprocessed messages.
>
> For example, you can set up a database that stores the processing state for each message. When a message arrives, check the message's state and process only when the message is unprocessed. That way, no processing happens for an already processed message. 
>
> This pattern demonstrates the *idempotence* concept. Repeating an action on an input produces the same result without other side effects or doesn't change the input's value. 

To learn more about multiple site federation and multiple region federations for Azure services where you can create replication tasks, see:

- [Multi-site and multi-region federation](../event-hubs/event-hubs-federation-overview.md)
- [Event replication tasks patterns](../event-hubs/event-hubs-federation-patterns.md)
- [Message replication and cross-region federation](../service-bus-messaging/service-bus-federation-overview.md)
- [Message replication tasks patterns](../service-bus-messaging/service-bus-federation-patterns.md)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The source and target resources or entities.

  Make sure the source and target are in different Azure regions. That way, you can test for the geo-disaster recovery failover scenario. These entities can vary based on the task template that you want to use. The example in this guide uses two Service Bus queues, which are located in different namespaces and Azure regions.

- An empty Standard logic app resource that you can reuse when you create the replication task. That way, you can customize this resource for your replication task.

  The following list provides reasons and best practices for you to create a logic app resource in advance:

  - You can [choose the hosting plan and pricing tier](#billing) for your logic app, based on your replication scenario's needs, such as capacity, throughput, and scaling.
  
    Although you can create a logic app when you create the replication task, you can't change the region, hosting plan, and pricing tier during task creation.

  - You can create your logic app in a region that differs from the source and target entities in your replication task.

    Currently, this guidance is provided due to the replication task's native integration within Azure resources. When you create a replication task between entities and choose to create a new logic app resource rather than use an existing one, the *new logic app is created in the same region as the source entity*. If the source region becomes unavailable, the replication task also can't work. In a failover scenario, the task also can't start reading data from the new source, formerly the target entity, which is what the [active-passive replication pattern](../service-bus-messaging/service-bus-federation-overview.md#active-passive-replication) tries to achieve.

  - You can customize this logic app resource ahead of time by choosing the hosting plan and pricing tier, rather than using the default attributes. That way, your replication task can process more events or messages per second for faster replication. If you create this resource, when you create the replication task, these default attributes are fixed.

  - You can make sure that this logic app resource contains *only replication task workflows*, especially if you want to follow the active-passive replication pattern. When you use an existing logic app to create your replication task, this option adds the task (stateless workflow) to that logic app resource.

  For more information, see [Create a Standard logic app workflow using the Azure portal](create-single-tenant-workflows-azure-portal.md).

- Optional: The connection string for the target namespace. This option enables having the target exist in a different subscription, so that you can set up cross-subscription replication.

   To find the connection string for the target entity, follow these steps:

   1. In the [Azure portal](https://portal.azure.com), go to the target namespace.

   1. On the namespace sidebar menu, under **Settings**, select **Shared access policies**.

   1. On the **Shared access policies** page that opens, under **Policy**, select **RootManageSharedAccessKey**.

   1. On the **SAS Policy: RootManageSharedAccessKey** pane, copy the **Primary Connection String** value.

   1. Save the connection string so you can later use it to connect to the target namespace.

<a name="naming"></a>

## Naming conventions

Carefully consider the naming strategy you use for your replication tasks or entities. Make sure that the names are easy to identify and differentiate. For example, if you're working with Event Hubs namespace, the replication task replicates from every Event Hubs instance in the source namespace. If you're working with Service Bus queues, the following table provides an example for naming the entities and replication task:

| Source name | Example | Replication app | Example | Target name | Example |
|-------------|---------|-----------------|---------|-------------|---------|
| Namespace: `<name>-sb-<region>` | `fabrikam-sb-weu` | Logic app: `<name-source-region-target-region>` | `fabrikam-rep-weu-wus` | Namespace: `<name>-sb-<region>` | `fabrikam-sb-wus` |
| Queue: `<name>` | `jobs-transfer` | Workflow: `<name>` | `jobs-transfer-workflow` | Queue: `<name>` | `jobs` |

<a name="create-replication-task"></a>

## Create a replication task

This example shows how to create a replication task for Service Bus queues.

1. In the [Azure portal](https://portal.azure.com), find the Service Bus namespace that you want to use as the source.

1. On the namespace sidebar menu, in the **Automation** section, select **Tasks**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/service-bus-automation-menu.png" alt-text="Screenshot shows the Azure portal displaying an Azure Service Bus namespace with Tasks selected." lightbox="./media/create-replication-tasks-azure-resources/service-bus-automation-menu.png":::

1. On the **Tasks** page, select **Add a task** so that you can select a task template.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/add-replication-task.png" alt-text="Screenshot shows the Tasks page with Add a task highlighted." lightbox="./media/create-replication-tasks-azure-resources/add-replication-task.png":::

1. On the **Add a task** page, under **Select a template**, in the template for the replication task that you want to create, select **Select**. If the next page doesn't appear, select **Next: Authenticate**.

   This example uses the **Replicate from Service Bus queue to queue** task template, which replicates content between Service Bus queues.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/select-replicate-service-bus-template.png" alt-text="Screenshot shows the Add a task page with Replicate from Service Bus queue to queue template highlighted." lightbox="./media/create-replication-tasks-azure-resources/select-replicate-service-bus-template.png":::

1. On the **Authenticate** tab, in the **Connections** section, select **Create** for every connection that appears in the task. Provide authentication credentials for all the connections. The types of connections in each task vary based on the task.

   This example shows the prompt to create the connection to the target Service Bus namespace where the target queue exists. The connection exists for the source Service Bus namespace.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/create-authenticate-connections.png" alt-text="Screenshot shows the Create option for the connection to the target Service Bus namespace." lightbox="./media/create-replication-tasks-azure-resources/create-authenticate-connections.png":::

1. Provide the necessary information about the target, and then select **Create**.

   For this example, provide a display name for the connection, and then select the Service Bus namespace where the target queue exists.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/connect-target-service-bus-namespace.png" alt-text="Screenshot shows Connect pane with the specified connection display name and the Service Bus Namespace name.":::

   > [!TIP]
   >
   > You can create the connection with a connection string instead. This option enables having the target in a different subscription, so that you can set up cross-subscription replication. The target, or source based on where you started creating the replication task, is dynamically configured so that you only have to connect the target. To use a connection string, use the following steps:
   >
   > 1. On the **Connect** pane, select **Connect via connection string**.
   >
   > 1. In the **Connection String** box, enter the connection string for the target namespace.

   The following example shows the successfully created connection:

   :::image type="content" source="./media/create-replication-tasks-azure-resources/connected-service-bus-namespaces.png" alt-text="Screenshot shows Add a task pane with finished connection to Service Bus namespace." lightbox="./media/create-replication-tasks-azure-resources/connected-service-bus-namespaces.png":::

1. After you finish all the connections, select **Next: Configure**.

1. On the **Configure** tab, provide a name for the task and any other information required for the task.

   > [!NOTE]
   >
   > You can't change the task name after creation. Consider a name that still applies if you [edit the underlying workflow](#edit-task-workflow). Changes that you make to the underlying workflow apply only to the task that you created, not the task template.
   >
   > For example, if you name your task `fabrikam-rep-weu-wus`, but you later edit the underlying workflow for a different purpose, you can't change the task name to match.

   1. To add the task workflow to an existing Standard logic app, from the **Logic App** list, select that logic app. To create a new Standard logic app resource instead, under the **Logic App** list, select **Create new**, and provide the name to use for the new logic app.

      > [!NOTE]
      >
      > If you create a new logic app resource during replication task creation, the logic app is created in the *same region as the source entity*. This situation is problematic if the source region becomes unavailable and can't work in a failover scenario. The best practice is to create a Standard logic app in a different region than your source. When you create the replication task, select the existing logic app instead and add the underlying stateless workflow to the existing logic app. For more information, see the [Prerequisites](#prerequisites).

   1. When you're done, select **Review + create**.

      :::image type="content" source="./media/create-replication-tasks-azure-resources/configure-replication-task.png" alt-text="Screenshot shows Add a task pane with task name, source and target queue names, and name to use for the logic app resource." lightbox="./media/create-replication-tasks-azure-resources/configure-replication-task.png":::

1. On the **Review + create** tab, confirm the Azure resources that the replication task requires for operation.

   - If you chose to create a new logic app resource for the replication task, the tab shows the required Azure resources that the replication task creates to operate.
   
     For example, these resources include an Azure Storage account that contains configuration information for the logic app resource, workflow, and other runtime operations. With Event Hubs, this storage account contains checkpoint information. It also contains the position or *offset* in the stream where the source entity stops if the source region is disrupted or becomes unavailable.

     The following example shows the **Review + create** tab if you chose to create a new logic app:

     :::image type="content" source="./media/create-replication-tasks-azure-resources/validate-replication-task-new-logic-app.png" alt-text="Screenshot shows Review + create tab with resource information when creating a new logic app." lightbox="./media/create-replication-tasks-azure-resources/validate-replication-task-new-logic-app.png":::

   - If you chose to reuse an existing logic app resource for the replication task, the tab shows the Azure resources that the replication reuses to operate.

     The following example shows the **Review + create** tab if you chose to reuse an existing logic app:

     :::image type="content" source="./media/create-replication-tasks-azure-resources/validate-replication-task-existing-logic-app.png" alt-text="Screenshot shows Review + create tab with resource information when reusing an existing logic app." lightbox="./media/create-replication-tasks-azure-resources/validate-replication-task-existing-logic-app.png":::

   > [!NOTE]
   >
   > If your source, target, or both are on a virtual network, you need to set up permissions and access after you create the task. In this scenario, permissions and access are required so that the logic app workflow can perform the replication task.

1. When you're ready, select **Create**.

   The task that you created, which is automatically live and running, now appears on the **Tasks** list.

   > [!TIP]
   >
   > If the task doesn't appear immediately, try refreshing the tasks list or wait a little before you refresh. On the toolbar, select **Refresh**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/created-replication-task.png" alt-text="Screenshot shows Tasks page with created replication task." lightbox="./media/create-replication-tasks-azure-resources/created-replication-task.png":::

1. If your resources are behind a virtual network, remember to set up permissions for the logic app resource and workflow to access those resources.

## Set up retry policy

To avoid data loss during an availability event on either side of a replication relationship, configure the retry policy for robustness. To configure the retry policy for a replication task, see the [Retry policies](logic-apps-exception-handling.md#retry-policies) and the steps to [edit the underlying workflow](#edit-task-workflow).

<a name="review-task-history"></a>

## Review task history

This example shows how to view a task's history of workflow runs along with their statuses, inputs, outputs, and other information. It continues using the example for a Service Bus queue replication task.

1. In the [Azure portal](https://portal.azure.com), find the Azure resource or entity that has the task history that you want to review.

   For this example, this resource is a Service Bus namespace.

1. On the resource sidebar menu, under **Settings**, in the **Automation** section, select **Tasks**.

1. On the **Tasks** page, find the task that you want to review. In that task's **Runs** column, select **View**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/view-runs-for-task.png" alt-text="Screenshot shows the Tasks page with the created replication task and a link to view runs." lightbox="./media/create-replication-tasks-azure-resources/view-runs-for-task.png":::

   This step opens the designer for the underlying stateless workflow in a Standard logic app resource.

1. To view the run history for the stateless workflow, on workflow sidebar, under **Tools**, select **Run history**.

   The **Run history** tab shows any previous, in progress, and waiting runs for the task along with their identifiers, statuses, start times, and run durations.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/run-history-list.png" alt-text="Screenshot shows a task's runs, their statuses, and other information.":::

   The following table describes the possible statuses for a run:

   | Status label | Description |
   |--------------|-------------|
   | **Cancelled** | The task was canceled while running. |
   | **Failed** | The task has at least one failed action, but no subsequent actions existed to handle the failure. |
   | **Running** | The task is currently running. |
   | **Succeeded** | All actions succeeded. A task can still finish successfully if an action failed, but a subsequent action existed to handle the failure. |
   | **Waiting** | The run hasn't started yet and is paused because an earlier instance of the task is still running. |

1. To view each step in the run, its status, and other information, select that run.

   The run details page opens and shows each step that ran in the underlying workflow.

   - A workflow always starts with a [*trigger*](../connectors/introduction.md#triggers). For this task, the workflow starts with a Service Bus trigger that waits for messages to arrive in the source Service Bus queue.

   - Each step shows its status and run duration. Steps that have 0-second durations took less than one second to run.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/run-history-details.png" alt-text="Screenshot shows each step in the run, status, and run duration in the workflow.":::

1. To review the inputs and outputs for each step, select the step.

   This action opens a pane that shows the inputs, outputs, and properties details for that step.

   The following example shows the inputs, outputs, and properties for the Service Bus trigger.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/view-trigger-inputs-outputs-properties.png" alt-text="Screenshot shows the trigger inputs, outputs, and properties.":::

You can build your own automated workflows to integrate apps, data, services, and systems apart from the context of replication tasks for Azure resources. See [Create a Standard logic app workflow](create-single-tenant-workflows-azure-portal.md).

<a name="monitor"></a>

## Monitor replication tasks

To check the performance and health of your replication task or the underlying logic app workflow, use [Application Insights](/azure/azure-monitor/app/app-insights-overview). Azure Monitor provides this capability.

The [Application map](/azure/azure-monitor/app/app-map) is a useful visual tool that you can use to monitor replication tasks. Azure Monitor automatically generates this map from the captured monitoring information. You can explore the performance and reliability of the replication task source and target transfers. For immediate diagnostic insights and low latency visualization of log details, you can work with the [Live Metrics](/azure/azure-monitor/app/live-stream) portal tool. This tool is also part of Azure Monitor.

<a name="edit-task"></a>

## Edit the task

To change a task, choose an option:

- [Edit the task inline](#edit-task-inline) to change the task's properties, such as connection information or configuration information.

- [Edit the task's underlying workflow](#edit-task-workflow) in the designer.

<a name="edit-task-inline"></a>

### Edit the task inline

1. In the [Azure portal](https://portal.azure.com), find the resource that has the task you want to update.

1. On the resource sidebar menu, in the **Automation** section, select **Tasks**.

1. In the tasks list, find the task that you want to update. Open the task's ellipses (**...**) menu, and select **Edit in-line**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/edit-task-in-line.png" alt-text="Screenshot shows the opened context menu and the selected option, Edit in-line.":::

   By default, the **Authenticate** tab appears and shows the existing connections.

1. To add new authentication credentials or select different existing authentication credentials for a connection, open the connection's ellipses (**...**) menu. Select either **Add new connection** or, if available, different authentication credentials.

   > [!NOTE]
   >
   > You can edit only the target connection, not the source connection.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/edit-connections.png" alt-text="Screenshot shows the Authenticate tab, existing connections, and the selected context menu.":::

1. To update other task properties, select **Next: Configure**.

   For the task in this example, you can specify different source and target queues. However, the task name and underlying logic app and workflow remain the same.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/edit-task-configuration.png" alt-text="Screenshot shows the Configure tab and properties available to edit.":::

1. When you're done, select **Save**.

<a name="edit-task-workflow"></a>

### Edit the task's underlying workflow

You can edit the underlying workflow behind a replication task. Your edits change the original configuration for the task that you created but not the task template itself. After you make and save your changes, your edited task no longer performs the same function as the original task. If you want a task that performs the original functionality, you might have to create a new task with the same template.

If you don't want to recreate the original task, avoid changing the workflow behind the task by using the designer. Instead, create a Standard logic app resource and a stateless workflow to meet your integration needs. For more information, see [Create a Standard logic app workflow](create-single-tenant-workflows-azure-portal.md).

1. In the [Azure portal](https://portal.azure.com), find the resource that has the task you want to update.

1. On the resource sidebar menu, under **Automation**, select **Tasks**.

1. In the tasks list, find the task that you want to update. Open the task's ellipses (**...**) menu, and select **Open in Logic Apps**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/open-task-in-designer.png" alt-text="Screenshot shows the opened context menu and the selected option, Open in Logic Apps.":::

   The Azure portal changes context to the designer where you can edit the workflow.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/view-task-workflow-designer.png" alt-text="Screenshot shows the workflow designer with the underlying workflow.":::

   You can edit the workflow's trigger and actions.

1. To view the properties for the trigger or an action, select that trigger or action.

   The information pane for the trigger or action opens. You can edit the properties for the trigger or action.

   The following example adds a description in the trigger about the workflow.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/edit-service-bus-trigger.png" alt-text="Screenshot shows the Service Bus trigger properties pane.":::

1. To save any changes, on the designer toolbar, select **Save**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/save-updated-workflow.png" alt-text="Screenshot shows the designer toolbar and the Save icon.":::

1. To test and run the updated workflow, on the designer toolbar, select **Run** > **Run**.

   After the run finishes, the designer shows the workflow's run details.

1. To review the inputs and outputs for each step, select the step, which opens a pane that shows the inputs, outputs, and properties details for that step.

   The following example shows the selected Service Bus trigger's inputs, outputs, and properties:

   :::image type="content" source="./media/create-replication-tasks-azure-resources/view-updated-run-details-trigger-inputs.png" alt-text="Screenshot shows the workflow's run details with the trigger's inputs, outputs, and properties.":::

1. To disable the workflow so the task doesn't continue to run, on the workflow sidebar, under **Configuration**, select **Settings**. From the **Workflow state** list, select **Disabled**.

   For more information, see [Disable or enable a deployed logic app](manage-logic-apps-with-azure-portal.md#disable-or-enable-a-deployed-logic-app).

<a name="failover"></a>

## Set up failover for Azure Event Hubs

For Azure Event Hubs replication between the same entity types, geo-disaster recovery requires failing over from the source entity to the target entity. Then the process informs affected event consumers and producers to use the endpoint for the target entity. The target entity becomes the new source.

If a disaster happens, and the source entity fails over, consumers and producers, including your replication task, are redirected to the new source. Your replication task creates a storage account that contains checkpoint information. The storage account also contains the position or offset in the stream where the source entity stops if the source region is disrupted or becomes unavailable.

Manually clean up any legacy information from the original source and reconfigure the replication task. This action ensures that the storage account doesn't contain any legacy information from the original source. You also ensure that your replication task begins reading and replicating events from the start of the new source stream.

1. In the [Azure portal](https://portal.azure.com), open the logic app resource, and then open the underlying workflow for the replication task.

   > [!NOTE]
   >
   > The logic app resource should contain only replication task workflows.

1. On the workflow sidebar menu, under **Configuration**, select **Settings**. From the **Workflow state** list, select **Disabled**.

1. To find the storage account that the replication task's underlying logic app resource uses to store the checkpoint and stream offset information from the source entity, follow these steps:

   1. On the logic app sidebar menu, under **Settings**, select **Environment variables**.

   1. On the **Environment variables** page, on the **App settings** tab, find the **AzureWebJobsStorage** app setting, and select **Show value** to view the storage account name.

      This setting specifies the connection string and storage account used by the logic app resource.

      The following example shows how to find the name for this storage account, which is **storagefabrikamreplb0c**:

      :::image type="content" source="./media/create-replication-tasks-azure-resources/find-storage-account-name.png" alt-text="Screenshot shows the underlying logic app's Environment variables page, which has the app setting and connection string with the storage account name." lightbox="./media/create-replication-tasks-azure-resources/find-storage-account-name.png":::

   1. To confirm that the storage account resource exists, in the Azure portal search box, enter the name. Select the storage account:

      :::image type="content" source="./media/create-replication-tasks-azure-resources/find-storage-account.png" alt-text="Screenshot shows the Azure portal search box with the storage account name entered.":::

1. Delete the folder that contains the source entity's checkpoint and offset information by using the following steps:

   1. Download, install, and open the latest [Azure Storage Explorer desktop client](https://azure.microsoft.com/features/storage-explorer/), if you don't have the most recent version.

      > [!NOTE]
      >
      > For the delete cleanup task, you currently have to use the Azure Storage Explorer client, *not* the storage explorer, browser, editor, or management experience in the Azure portal.
      >
      > Although you can delete container folders by using the PowerShell [`Remove-AzStorageDirectory` command](/powershell/module/az.storage/remove-azstoragedirectory), this command works only on *empty* folders.

   1. If you haven't already, sign in by using your Azure account. Make sure that your Azure subscription for your storage account resource is selected. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

   1. In the Explorer window, under your Azure subscription name, go to **Storage Accounts** > **{*your-storage-account-name*}** > **Blob Containers** > **azure-webjobs-eventhub**.

      > [!NOTE]
      >
      > If the **azure-webjobs-eventhub** folder doesn't exist, the replication task hasn't run yet. The folder appears only after the replication task runs at least one time.

      :::image type="content" source="./media/create-replication-tasks-azure-resources/azure-webjobs-eventhub-storage-explorer.png" alt-text="Screenshot shows the Azure Storage Explorer with the storage account and blob container open to show the selected azure-webjobs-eventhub folder." lightbox="./media/create-replication-tasks-azure-resources/azure-webjobs-eventhub-storage-explorer.png":::

   1. In the **azure-webjobs-eventhub** pane that opens, select the Event Hubs namespace folder. The name has the following format: `<source-Event-Hubs-namespace-name>.servicebus.windows.net`.

   1. After the namespace folder opens, in the **azure-webjobs-eventhub** pane, select the <*former-source-entity-name*> folder. From either the toolbar or folder's shortcut menu, select **Delete**:

      :::image type="content" source="./media/create-replication-tasks-azure-resources/delete-former-source-entity-folder-storage-explorer.png" alt-text="Screenshot shows the former source Event Hubs entity folder selected with Delete also highlighted." lightbox="./media/create-replication-tasks-azure-resources/delete-former-source-entity-folder-storage-explorer.png":::

   1. Confirm that you want to delete the folder.

1. Return to the logic app resource or workflow behind the replication task. Restart the logic app or enable the workflow again.

Producers and consumers need to use the new source endpoint. Make information about the new source entity available in a location that's easy to reach and update. If producers or consumers encounter frequent or persistent errors, they should check that location and adjust their configuration. There are several ways to share that configuration. DNS and file shares are examples.

For more information about geo-disaster recovery, see the following documentation:

- [Azure Event Hubs - Geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md)
- [Azure Service Bus - Geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md)

<a name="edit-plan-scale-out-settings"></a>

## Edit hosting plan scale-out settings

### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), open the underlying logic app resource for your replication task.

1. On the logic app sidebar menu, under **App Service plan**, select **Scale out**.

   :::image type="content" source="./media/create-replication-tasks-azure-resources/edit-app-service-plan-settings.png" alt-text="Screenshot shows the app service plan settings for maximum bursts, minimum instances, always ready instances, and scale out limit enforcement." lightbox="./media/create-replication-tasks-azure-resources/edit-app-service-plan-settings.png":::

1. Based on your scenario's needs, under **Plan Scale out** and **App Scale out**, change the values for the maximum burst and always ready instances, respectively.

1. When you're done, on the **Scale out** page toolbar, select **Save**.

### [Azure CLI](#tab/azurecli)

You can also configure always ready instances for an app by using Azure CLI.

```azurecli-interactive
az resource update --resource-group <resource_group> --name <logic-app-app-name>/config/web --set properties.minimumElasticInstanceCount=<desired_always_ready_count> --resource-type Microsoft.Web/sites
```

---

For more information, review the following documentation. The Workflow Standard plan shares some aspects with the Azure Functions Premium plan:

- [Premium plan settings](../azure-functions/functions-premium-plan.md#plan-and-sku-settings)
- [What is cloud bursting](https://azure.microsoft.com/overview/what-is-cloud-bursting/)?
- [Always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances)

<a name="problems-failures"></a>

## Replication problems and failures

This section describes possible ways that replication can fail or stop working:

- Message size limits

    Make sure to send messages smaller than 1 MB because the replication task adds [replication properties](#replication-properties). Otherwise, if the message size is larger than the size of events that the replication task can send to an Event Hubs entity after the task adds replication properties, the replication process fails.

  For example, suppose the message size is 1 MB. After the replication task adds replication properties, the message size is larger than 1 MB. The outbound call that attempts to send the message fails.

- Partition keys

  If any partition keys exist in the events, replication between Event Hubs instances fails if those instances have the same number of partitions.

<a name="billing"></a>

## Billing model

A replication task is driven by a stateless workflow in a Standard logic app. So, after you create a replication task, charges might start to incur. Usage, metering, billing, and the pricing model follow the [Standard hosting plan](logic-apps-pricing.md#standard-pricing) and [Standard plan pricing tiers](logic-apps-pricing.md#standard-pricing-tiers).

<a name="scale-up"></a>

Your hosting plan might scale up or down based on the number of events that Event Hubs receives or messages that Service Bus handles. The plan keeps minimum vCPU usage and low latency during active replication. This behavior requires that you choose the right Standard plan pricing tier when you create a Standard logic app resource for your replication task. When you choose the right tier, Azure Logic Apps doesn't throttle or max out CPU usage and can still guarantee fast replication.

> [!NOTE]
>
> If your app starts with one instance of the WS1 plan and then scales out to two instances, the cost is twice the cost of WS1. This scenario assumes that the plans run all day. If you scale up your app to the WS2 plan and use one instance, the cost is the same as two WS1 plan instances. Likewise, if you scale up your app to the WS3 plan and use one instance, the cost is the same as two WS2 plan instances or four WS1 plan instances.

<a name="scale-out"></a>

The following examples show hosting plan pricing tier and configuration options that provide the best throughput and cost for specific replication task scenarios. Scenarios are Event Hubs or Service Bus and have different configuration values.

> [!NOTE]
>
> The examples in the following sections use 800 as the default value for the prefetch count, maximum event batch size for Event Hubs, and maximum message count for Service Bus. They assume that the event or message size is 1 KB. Based on your event sizes, you might want to change the prefetch count, maximum event batch size, or maximum message count. For example, if your event size or message size is over 1 KB, you might want to reduce the values for the prefetch count, and maximum event batch size or message count from 800.

### Event Hubs scale out

The following examples illustrate hosting plan pricing tier and configuration options for a replication task between two Event Hubs namespaces *in the same region*. It presents information based on the number of [partitions](../event-hubs/event-hubs-features.md#partitions), the number of events per second, and other configuration values.

| Pricing tier | Partition count | Events per second | Maximum bursts* | Always ready instances* | Prefetch count* | Maximum event batch size* |
|--------------|-----------------|-------------------|----------------|-------------------------|-----------------|-----------------|
| **WS1** | 1 | 1,000 | 1 | 1 | 800 | 800 |
| **WS1** | 2 | 2,000 | 1 | 1 | 800 | 800 |
| **WS2** | 4 | 4,000 | 2 | 1 | 800 | 800 |
| **WS2** | 8 | 8,000 | 2 | 1 | 800 | 800 |
| **WS3** | 16 | 16,000 | 2 | 1 | 800 | 800 |
| **WS3** | 32 | 32,000 | 3 | 1 | 800 | 800 |

\* For more information about the values that you can change for each pricing tier, see the following table:

| Value | Description |
|-------|-------------|
| **Maximum bursts** | The *maximum* number of elastic workers to scale out under load. If your underlying app requires instances beyond the *always ready instances* in the next table row, your app can continue to scale out until the number of instances hits the maximum burst limit. To change this value, see [Edit hosting plan scale out settings](#edit-plan-scale-out-settings) later in this article. <br>**Note**: Any instances beyond your plan size are billed *only* when they're running and allocated to you on a per-second basis. The platform makes a best effort to scale out your app to the defined maximum limit. <br>**Tip**: As a recommendation, select a maximum value that's higher than you might need so that the platform can scale out to handle a larger load. Unused instances aren't billed. <br>For more information, see the following documentation. The Workflow Standard plan shares some aspects with the Azure Functions Premium plan. <br>- [Premium plan settings](../azure-functions/functions-premium-plan.md#plan-and-sku-settings) <br>- [What is cloud bursting](https://azure.microsoft.com/overview/what-is-cloud-bursting/)? |
| **Always ready instances** | The minimum number of instances that are always ready and warm for hosting your app. The minimum number is always 1. To change this value, see [Edit hosting plan scale out settings](#edit-plan-scale-out-settings) later in this article. <br>**Note**: Any instances beyond your plan size are billed *whether or not* they're running when allocated to you. <br>For more information, see the following documentation. The Workflow Standard plan shares some aspects with the Azure Functions Premium plan: [Always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances). |
| **Prefetch count** | The default value for `AzureFunctionsJobHost__extensions__eventHubs__eventProcessorOptions__prefetchCount` app setting in your logic app resource that determines the prefetch count used by the underlying `EventProcessorHost` class. To add or specify a different value for this app setting, see [Manage app settings - local.settings.json](edit-app-settings-host-settings.md?tabs=azure-portal#manage-app-settings). For example: <br>- **Name**: `AzureFunctionsJobHost__extensions__eventHubs__eventProcessorOptions__prefetchCount` <br>- **Value**: `800` (no maximum limit) <br>For more information about the `prefetchCount` property, see: <br>- [host.json settings - Azure Event Hubs](../azure-functions/functions-bindings-event-hubs.md#hostjson-settings) <br>- [EventProcessorOptions.PrefetchCount property](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.prefetchcount) <br>- [Balance partition load across multiple instances](../event-hubs/event-processor-balance-partition-load.md) <br>- [Event processor host](../event-hubs/event-hubs-event-processor-host.md) <br>- [EventProcessorHost Class](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessorhost) |
| **Maximum event batch size** | The default value for the `AzureFunctionsJobHost__extensions__eventHubs__eventProcessorOptions__maxBatchSize` app setting in your logic app resource that determines the maximum event count received by each receive loop. To add or specify a different value for this app setting, see [Manage app settings - local.settings.json](edit-app-settings-host-settings.md?tabs=azure-portal#manage-app-settings). For example: <br>- **Name**: `AzureFunctionsJobHost__extensions__eventHubs__eventProcessorOptions__maxBatchSize` <br>- **Value**: `800` (no maximum limit) <br>For more information about the `maxBatchSize` property, see: <br>- [host.json settings - Azure Event Hubs trigger and bindings for Azure Functions](../azure-functions/functions-bindings-event-hubs.md#hostjson-settings) <br>- [EventProcessorOptions.MaxBatchSize property](/dotnet/api/microsoft.azure.eventhubs.processor.eventprocessoroptions.maxbatchsize) <br>- [Event processor host](../event-hubs/event-hubs-event-processor-host.md) |

### Service Bus scale out

The following examples illustrate hosting plan pricing tier and configuration options for a replication task between two Service Bus namespaces in the same region. They show information based on the number of messages per second and other configuration values.

The examples in this section use 800 as the default value for the prefetch count and maximum message count, assuming that the message size is 1 KB.

| Pricing tier | Messages per second | Maximum bursts* | Always ready instances* | Prefetch count* | Maximum message count* |
|--------------|---------------------|-----------------|-------------------------|-----------------|------------------------|
| **WS1** | 2,000 | 1 | 1 | 800 | 800 |
| **WS2** | 2,500 | 1 | 1 | 800 | 800 |
| **WS3** | 3,500 | 1 | 1 | 800 | 800 |

\* For more information about the values that you can change for each pricing tier, see the following table:

| Value | Description |
|-------|-------------|
| **Maximum bursts** | The maximum number of elastic workers to scale out under load. If your underlying app requires instances beyond the always-ready instances in the next table row, your app can continue to scale out until the number of instances hits the maximum burst limit. <br><br>To change this value, see [Edit hosting plan scale-out settings](#edit-plan-scale-out-settings) later in this article. <br><br>**Note**: You're charged for any instances beyond your plan size only when they're running and allocated to you on a per-second basis. The platform makes a best effort to scale out your app to the defined maximum limit. <br>**Tip**: Select a maximum value that's higher than you might need so that the platform can scale out to handle a larger load. You aren't charted for unused instances. The Workflow Standard plan shares some aspects with the Azure Functions Premium plan. <br><br>For more information, see: <br><br>- [Premium plan settings](../azure-functions/functions-premium-plan.md#plan-and-sku-settings) <br>- [What is cloud bursting?](https://azure.microsoft.com/overview/what-is-cloud-bursting/) |
| **Always ready instances** | The minimum number of instances that are always ready and warm for hosting your app. The minimum number is always 1. <br><br>To change this value, see [Edit hosting plan scale-out settings](#edit-plan-scale-out-settings) later in this article. <br><br>**Note**: You're charged for any instances beyond your plan size whether or not they're running when allocated to you. The Workflow Standard plan shares some aspects with the Azure Functions Premium plan: [Always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances). |
| **Prefetch count** | The default value for `AzureFunctionsJobHost__extensions__serviceBus__prefetchCount` app setting in your logic app resource that determines the prefetch count used by the underlying `ServiceBusProcessor` class. <br><br>To add or specify a different value for this app setting, see [Manage app settings - local.settings.json](edit-app-settings-host-settings.md?tabs=azure-portal#manage-app-settings), for example: <br><br>- **Name**: `AzureFunctionsJobHost__extensions__serviceBus__prefetchCount` <br>- **Value**: `800` (no maximum limit) <br><br>For more information about the `prefetchCount` property, see: <br>- [Azure Service Bus bindings for Azure Functions](../azure-functions/functions-bindings-service-bus.md) <br>- [ServiceBusProcessor.PrefetchCount property](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.prefetchcount) <br>- [ServiceBusProcessor Class](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) |
| **Maximum message count** | The default value for the `AzureFunctionsJobHost__extensions__serviceBus__batchOptions__maxMessageCount` app setting in your logic app resource that determines the maximum number of messages to send when triggered. <br><br>To add or specify a different value for this app setting, see [Manage app settings - local.settings.json](edit-app-settings-host-settings.md?tabs=azure-portal#manage-app-settings), for example: <br><br>- **Name**: `AzureFunctionsJobHost__extensions__serviceBus__batchOptions__maxMessageCount` <br>- **Value**: `800` (no maximum limit) <br><br>For more information about the `maxMessageCount` property, see [Azure Service Bus bindings for Azure Functions](../azure-functions/functions-bindings-service-bus.md).|

## Related content

- [Navigate the designer for Standard workflows in Azure Logic Apps](designer-overview.md)
- [Edit app and host settings for Standard logic apps](edit-app-settings-host-settings.md)
- [Create cross-environment parameters for workflow inputs](parameterize-workflow-app.md)
