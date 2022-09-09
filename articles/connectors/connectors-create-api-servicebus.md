---
title: Connect to Azure Service Bus from workflows
description: Connect to Azure Service Bus from Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/02/2021
tags: connectors
---

# Connect to Azure Service Bus from workflows in Azure Logic Apps

This article shows how to access Azure Service Bus from a workflow in Azure Logic Apps with the Service Bus connector. You can then create automated workflows that run when triggered by events in a service bus or run actions to manage service bus items, for example:

* Monitor when messages arrive (auto-complete) or are received (peek-lock) in queues, topics, and topic subscriptions.
* Send messages.
* Create and delete topic subscriptions.
* Manage messages in queues and topic subscriptions, for example, get, get deferred, complete, defer, abandon, and dead-letter.
* Renew locks on messages and sessions in queues and topic subscriptions.
* Close sessions in queues and topics.

You can use triggers that get responses from Azure Service Bus and make the output available to other actions in your workflows. You can also have other actions use the output from Service Bus actions.

<a name="connector-reference"></a>

## Connector technical reference

The Service Bus connector has different versions, based on [logic app workflow type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector (Standard class). For more information, review the following documentation: <br><br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Consumption** | Integration service environment (ISE) | Managed connector (Standard class) and ISE version, which has different message limits than the Standard class. For more information, review the following documentation: <br><br>- [SQL Server managed connector reference](/connectors/sql) <br>- [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector (Azure-hosted) and built-in connector, which is [service provider based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). The built-in version usually provides better performance, capabilities, pricing, and so on. <br><br>For more information, review the following documentation: <br><br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Service Bus built-in connector operations](#built-in-connector-operations) section later in this article <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Service Bus namespace and messaging entity, such as a queue. If you don't have these items, learn how to [create your Service Bus namespace](../service-bus-messaging/service-bus-create-namespace-portal.md).

* The logic app workflow where you connect to your Service Bus namespace and messaging entity. To start your workflow with a Service Bus trigger, you have to start with a blank workflow. To use a Service Bus action in your workflow, start your workflow with any trigger.

* If your logic app resource uses a managed identity to authenticate access to your Service Bus namespace and messaging entity, make sure that you've assigned role permissions at the corresponding levels. For example, to access a queue, the managed identity requires a role that has the necessary permissions for that queue.

  Each managed identity that accesses a *different* messaging entity should have a separate connection to that entity. If you use different Service Bus actions to send and receive messages, and those actions require different permissions, make sure to use different connections.

  For more information about managed identities, review [Authenticate access to Azure resources with managed identities in Azure Logic Apps](../logic-apps/create-managed-service-identity.md).

## Considerations for Azure Service Bus operations

### Infinite loops

[!INCLUDE [Warning about creating infinite loops](../../includes/connectors-infinite-loops.md)]

### Limit on saved sessions in connector cache

From a service bus, the Service Bus connector can save up to 1,500 unique sessions at a time to the connector cache, per [Service Bus messaging entity, such as a subscription or topic](../service-bus-messaging/service-bus-queues-topics-subscriptions.md). If the session count exceeds this limit, old sessions are removed from the cache. For more information, see [Message sessions](../service-bus-messaging/message-sessions.md).

### Large messages

Large message support is available only when you use the built-in Service Bus operations with [single-tenant Azure Logic Apps (Standard)](../logic-apps/single-tenant-overview-compare.md) workflows. You can send and receive large messages using the triggers or actions in the built-in version.

  For receiving a message, you can increase the timeout by [changing the following setting in the Azure Functions extension](../azure-functions/functions-bindings-service-bus.md#install-bundle):

  ```json
  {
     "version": "2.0",
     "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle.Workflows",
        "version": "[1.*, 2.0.0)"
     },
     "extensions": {
        "serviceBus": {
           "batchOptions": {
              "operationTimeout": "00:15:00"
           }
        }  
     }
  }
  ```

  For sending a message, you can increase the timeout by [adding the `ServiceProviders.ServiceBus.MessageSenderOperationTimeout` app setting](../logic-apps/edit-app-settings-host-settings.md).

<a name="permissions-connection-string"></a>

## Check permissions

Confirm that your logic app resource has permissions to access your Service Bus namespace.

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace menu, under **Settings**, select **Shared access policies**. Under **Claims**, check that you have **Manage** permissions for that namespace.

   ![Screenshot showing the Azure portal, Service Bus namespace, and 'Shared access policies' selected.](./media/connectors-create-api-azure-service-bus/azure-service-bus-namespace.png)

1. Get the connection string for your Service Bus namespace. You need this string when you later provide the connection information in your workflow.

   1. On the **Shared access policies** pane, select **RootManageSharedAccessKey**.

   1. Next to your primary connection string, select the copy button.

      ![Screenshot showing the Service Bus namespace connection string and the copy button selected.](./media/connectors-create-api-azure-service-bus/find-service-bus-connection-string.png)

      > [!NOTE]
      >
      > To check that the string is for the namespace, not a specific messaging entity. search the 
      > connection string for the `EntityPath` parameter. If you find this parameter, the connection 
      > string is for a specific entity, and isn't the correct string to use with your workflow.

   1. Save the connection string for later use.

## Add a Service Bus trigger

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. In the [Azure portal](https://portal.azure.com), and open your blank logic app workflow in the designer.

1. In the portal search box, enter `azure service bus`. From the triggers list that appears, select the trigger that you want.

   For example, to trigger your workflow when a new item gets sent to a Service Bus queue, select the **When a message is received in a queue (auto-complete)** trigger.

   ![Select Service Bus trigger](./media/connectors-create-api-azure-service-bus/select-service-bus-trigger.png)

   Here are some considerations for when you use a Service Bus trigger:

   * All Service Bus triggers are *long-polling* triggers. This description means that when the trigger fires, the trigger processes all the messages and then waits 30 seconds for more messages to appear in the queue or topic subscription. If no messages appear in 30 seconds, the trigger run is skipped. Otherwise, the trigger continues reading messages until the queue or topic subscription is empty. The next trigger poll is based on the recurrence interval specified in the trigger's properties.

   * Some triggers, such as the **When one or more messages arrive in a queue (auto-complete)** trigger, can return one or more messages. When these triggers fire, they return between one and the number of messages that's specified by the trigger's **Maximum message count** property.

     > [!NOTE]
     > The auto-complete trigger automatically completes a message, but completion happens only at the next call to Service Bus. 
     > This behavior can affect your workflow design. For example, avoid changing the concurrency on the auto-complete trigger 
     > because this change might result in duplicate messages if your workflow enters a throttled state. Changing the concurrency 
     > control creates these conditions: throttled triggers are skipped with the `WorkflowRunInProgress` code, the completion operation 
     > won't happen, and next trigger run occurs after the polling interval. You have to set the service bus lock duration to a value 
     > that's longer than the polling interval. However, despite this setting, the message still might not complete if your 
     > workflow remains in a throttled state at next polling interval.

   * If you [turn on the concurrency setting](../logic-apps/logic-apps-workflow-actions-triggers.md#change-trigger-concurrency) for a Service Bus trigger, the default value for the `maximumWaitingRuns`​ property is 10​. Based on the Service Bus entity's lock duration setting and the run duration for your workflow, this default value might be too large and might cause a "lock lost" exception. To find the optimal value for your scenario, start testing with a value of 1​ or 2​ for the `maximumWaitingRuns`​ property. To change the maximum waiting runs value, see [Change waiting runs limit](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs).

1. If your trigger is connecting to your Service Bus namespace for the first time, follow these steps when the workflow designer prompts you for connection information.

   1. Provide a name for your connection, and select your Service Bus namespace.

      ![Screenshot that shows providing connection name and selecting Service Bus namespace](./media/connectors-create-api-azure-service-bus/create-service-bus-connection-trigger-1.png)

      To manually enter the connection string instead, select **Manually enter connection information**. If you don't have your connection string, learn [how to find your connection string](#permissions-connection-string).

   1. Select your Service Bus policy, and select **Create**.

      ![Screenshot that shows selecting Service Bus policy](./media/connectors-create-api-azure-service-bus/create-service-bus-connection-trigger-2.png)

   1. Select the messaging entity you want, such as a queue or topic. For this example, select your Service Bus queue.

      ![Screenshot that shows selecting Service Bus queue](./media/connectors-create-api-azure-service-bus/service-bus-select-queue-trigger.png)

1. Provide the necessary information for your selected trigger. To add other available properties to the action, open the **Add new parameter** list, and select the properties that you want.

   For this example's trigger, select the polling interval and frequency for checking the queue.

   ![Screenshot that shows setting polling interval on the Service Bus trigger](./media/connectors-create-api-azure-service-bus/service-bus-trigger-details.png)

   For more information about available triggers and properties, see the connector's [reference page](/connectors/servicebus/).

1. Continue building your workflow by adding the actions that you want.

   For example, you can add an action that sends email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the found message.

## Add a Service Bus action

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. Under the step where you want to add an action, select **New step**.

   Or, to add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**) that appears, and select **Add an action**.

1. Under **Choose an action**, in the search box, enter `azure service bus`. From the actions list that appears, select the action that you want.

   For this example, select the **Send message** action.

   ![Screenshot that shows selecting the Service Bus action](./media/connectors-create-api-azure-service-bus/select-service-bus-send-message-action.png)

1. If your action is connecting to your Service Bus namespace for the first time, follow these steps when the workflow designer prompts you for connection information.

   1. Provide a name for your connection, and select your Service Bus namespace.

      ![Screenshot that shows providing a connection name and selecting a Service Bus namespace](./media/connectors-create-api-azure-service-bus/create-service-bus-connection-action-1.png)

      To manually enter the connection string instead, select **Manually enter connection information**. If you don't have your connection string, learn [how to find your connection string](#permissions-connection-string).

   1. Select your Service Bus policy, and select **Create**.

      ![Screenshot that shows selecting a Service Bus policy and selecting the Create button](./media/connectors-create-api-azure-service-bus/create-service-bus-connection-action-2.png)

   1. Select the messaging entity you want, such as a queue or topic. For this example, select your Service Bus queue.

      ![Screenshot that shows selecting a Service Bus queue](./media/connectors-create-api-azure-service-bus/service-bus-select-queue-action.png)

1. Provide the necessary details for your selected action. To add other available properties to the action, open the **Add new parameter** list, and select the properties that you want.

   For example, select the **Content** and **Content Type** properties so that you add them to the action. Then, specify the content for the message that you want to send.

   ![Screenshot that shows providing the message content type and details](./media/connectors-create-api-azure-service-bus/service-bus-send-message-details.png)

   For more information about available actions and their properties, see the connector's [reference page](/connectors/servicebus/).

1. Continue building your workflow by adding any other actions that you want.

   For example, you can add an action that sends email to confirm that your message was sent.

1. Save your logic app. On the designer toolbar, select **Save**.

<a name="sequential-convoy"></a>

## Send correlated messages in order

When you need to send related messages in a specific order, you can use the [*sequential convoy* pattern](/azure/architecture/patterns/sequential-convoy) by using the [Azure Service Bus connector](../connectors/connectors-create-api-servicebus.md). Correlated messages have a property that defines the relationship between those messages, such as the ID for the [session](../service-bus-messaging/message-sessions.md) in Service Bus.

When you create a Consumption logic app workflow, you can select the **Correlated in-order delivery using service bus sessions** template, which implements the sequential convoy pattern. For more information, see [Send related messages in order](../logic-apps/send-related-messages-sequential-convoy.md).

## Delays in updates to your workflow taking effect

If a Service Bus trigger's polling interval is small, such as 10 seconds, updates to your workflow might not take effect for up to 10 minutes. To work around this problem, you can disable the logic app resource, make the changes, and then enable the logic app resource again.

## Troubleshooting

Occasionally, operations such as completing a message or renewing a session produce the following error:

``` json
{
  "status": 400,
  "message": "No session available to complete the message with the lock token 'ce440818-f26f-4a04-aca8-555555555555'. clientRequestId: facae905-9ba4-44f4-a42a-888888888888",
  "error": {
    "message": "No session available to complete the message with the lock token 'ce440818-f26f-4a04-aca8-555555555555'."
  }
}
```

The Service Bus connector uses in-memory cache to support all operations associated with the sessions. The Service Bus message receiver is cached in the memory of the role instance (virtual machine) that receives the messages. To process all requests, all calls for the connection get routed to this same role instance. This behavior is required because all the Service Bus operations in a session require the same receiver that receives the messages for a specific session.

The chance exists that requests might not get routed to the same role instance, due to reasons such as an infrastructure update, connector deployment, and so on. If this event happens, requests fail because the receiver that performs the operations in the session isn't available in the role instance that serves the request.

As long as this error happens only occasionally, the error is expected. When the error happens, the message is still preserved in the service bus. The next trigger or workflow run tries to process the message again.

<a name="built-in-connector-app-settings"></a>

## Built-in connector app settings

In a Standard logic app resource, the Service Bus built-in connector includes app settings that control various thresholds, such as timeout for sending messages and number of message senders per processor core in the message pool. For more information, review [Reference for app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#reference-local-settings-json).

<a name="built-in-connector-operations"></a>

## Service Bus built-in connector operations

The Service Bus built-in connector is available only for Standard logic app workflows and provides the following triggers and actions:

| Trigger | Description |
|-------- |-------------|
| When messages are available in a queue | Start a workflow when one or more messages are available in a queue. |
| When messages are available in a topic subscription | Start a workflow when one or more messages are available in a topic subscription. |

| Action | Description |
|--------|-------------|
| Send message | Send a message to a queue or topic. |
| Send multiple messages | Send more than one message to a queue or topic. |

## Next steps

* Learn about other [Azure Logic Apps connectors](../connectors/apis-list.md)
