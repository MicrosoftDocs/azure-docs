---
title: Connect to Azure Service Bus from workflows
description: Connect to Azure Service Bus from Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/16/2024
ms.custom: engagement-fy23
---

# Connect to Azure Service Bus from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to access Azure Service Bus from a workflow in Azure Logic Apps using the Service Bus connector. You can then create automated workflows that run when triggered by events in a service bus or run actions to manage service bus items, for example:

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
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**. <br><br>**Note**: Service Bus managed connector triggers follow the [*long polling trigger* pattern](#service-bus-managed-triggers), which means that the trigger periodically checks for messages in the queue or topic subscription. For more information, review the following documentation: <br><br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps and App Service Environment v3 (Windows plans only) | Managed connector (Azure-hosted), which appears in the connector gallery under **Runtime** > **Shared**, and built-in connector, which appears in the connector gallery under **Runtime** > **In App** and is [service provider based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). <br><br>The Service Bus managed connector triggers follow the [*long polling trigger* pattern](#service-bus-managed-triggers), which means that the trigger periodically checks for messages in the queue or topic subscription. <br><br>The Service Bus built-in connector non-session triggers follow a *continuous polling trigger pattern* that is fully managed by the connector. This pattern has the trigger constantly check for messages in the queue or topic subscription. Session triggers follow the *long-polling trigger pattern*, but its configuration is governed by the Azure Functions setting named [**clientRetryOptions:tryTimeout**](../azure-functions/functions-bindings-service-bus.md#hostjson-settings). The built-in version usually provides better performance, capabilities, pricing, and so on.
<br><br>For more information, review the following documentation: <br><br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Service Bus built-in connector operations](/azure/logic-apps/connectors/built-in/reference/servicebus) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Service Bus namespace and messaging entity, such as a queue. For more information, review the following documentation:

  * [Create a Service Bus namespace](../service-bus-messaging/service-bus-create-namespace-portal.md)

  * [Create a Service Bus namespace and queue](../service-bus-messaging/service-bus-quickstart-portal.md)

  * [Create a Service Bus namespace and topic with subscription](../service-bus-messaging/service-bus-queues-topics-subscriptions.md)

* The logic app workflow where you connect to your Service Bus namespace and messaging entity. To start your workflow with a Service Bus trigger, you have to start with a blank workflow. To use a Service Bus action in your workflow, start your workflow with any trigger.

* If your logic app resource uses a managed identity for authenticating access to your Service Bus namespace and messaging entity, make sure that you've assigned role permissions at the corresponding levels. For example, to access a queue, the managed identity requires a role that has the necessary permissions for that queue.

  * Each logic app resource should use only one managed identity, even if the logic app's workflow accesses different messaging entities.

  * Each managed identity that accesses a queue or topic subscription should use its own Service Bus API connection.

  * Service Bus operations that exchange messages with different messaging entities and require different permissions should use their own Service Bus API connections.

  For more information about managed identities, see [Authenticate access to Azure resources with managed identities in Azure Logic Apps](../logic-apps/create-managed-service-identity.md).

* By default, the Service Bus built-in connector operations are *stateless*. To run these operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](../connectors/enable-stateful-affinity-built-in-connectors.md).

## Considerations for Azure Service Bus operations

### Infinite loops

[!INCLUDE [Warning about creating infinite loops](../../includes/connectors-infinite-loops.md)]

### Limit on saved sessions in connector cache

Per [Service Bus messaging entity, such as a subscription or topic](../service-bus-messaging/service-bus-queues-topics-subscriptions.md), the Service Bus connector can save up to 1,500 unique sessions at a time to the connector cache. If the session count exceeds this limit, old sessions are removed from the cache. For more information, see [Message sessions](../service-bus-messaging/message-sessions.md).

<a name="sequential-convoy"></a>

### Send correlated messages in order

When you need to send related messages in a specific order, you can create a workflow using Service Bus connector and the [*sequential convoy* pattern](/azure/architecture/patterns/sequential-convoy). Correlated messages have a property that defines the relationship between those messages, such as the ID for the [session](../service-bus-messaging/message-sessions.md) in Azure Service Bus.

When you create a Consumption logic app workflow, you can select the **Correlated in-order delivery using service bus sessions** template, which implements the sequential convoy pattern. For more information, see [Send related messages in order](../logic-apps/send-related-messages-sequential-convoy.md).

### Large message support

Large message support is available only for Standard workflows when you use the Service Bus built-in connector operations. For example, you can receive and large messages using the built-in triggers and actions respectively.

For the Service Bus managed connector, the maximum message size is limited to 1 MB, even when you use a premium tier Service Bus namespace.

### Increase timeout for receiving and sending messages

In Standard workflows that use the Service Bus built-in operations, you can increase the timeout for receiving and sending messages. For example, to increase the timeout for receiving a message, [change the following setting in the Azure Functions extension](../azure-functions/functions-bindings-service-bus.md#install-bundle):

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

To increase the timeout for sending a message, [add the **ServiceProviders.ServiceBus.MessageSenderOperationTimeout** app setting](../logic-apps/edit-app-settings-host-settings.md).

<a name="service-bus-managed-triggers"></a>
### Service Bus managed connector triggers

* For the Service Bus managed connector, all triggers are *long-polling*. This trigger type processes all the messages and then waits 30 seconds for more messages to appear in the queue or topic subscription. If no messages appear in 30 seconds, the trigger run is skipped. Otherwise, the trigger continues reading messages until the queue or topic subscription is empty. The next trigger poll is based on the recurrence interval specified in the trigger's properties.

* Some triggers, such as the **When one or more messages arrive in a queue (auto-complete)** trigger, can return one or more messages. When these triggers fire, they return between one and the number of messages that's specified by the trigger's **Maximum message count** property.

  > [!NOTE]
  >
  > The auto-complete trigger automatically completes a message, but completion happens only at the next call 
  > to Service Bus. This behavior can affect your workflow design. For example, avoid changing the concurrency 
  > on the auto-complete trigger because this change might result in duplicate messages if your workflow enters 
  > a throttled state. Changing the concurrency control creates the following conditions:
  >
  > * Throttled triggers are skipped with the `WorkflowRunInProgress` code.
  >
  > * The completion operation won't run.
  >
  > * The next trigger run occurs after the polling interval.
  >
  > You have to set the service bus lock duration to a value that's longer than the polling interval. 
  > However, despite this setting, the message still might not complete if your workflow remains in a 
  > throttled state at next polling interval.
  >
  > If you must change the concurrency on a Service Bus auto-complete trigger, don't make this change before 
  > you initially save your workflow. Create and save your workflow first before you edit the trigger to change the concurrency.
    ```

### Service Bus built-in connector triggers

For he Service Bus built-in connector, non-session triggers follow a *continuous polling trigger pattern* that is fully managed by the connector. This pattern has the trigger constantly check for messages in the queue or topic subscription. Session triggers follow the *long-polling trigger pattern*, with its configuration is governed by the Azure Functions setting named [**clientRetryOptions:tryTimeout**](../azure-functions/functions-bindings-service-bus.md#hostjson-settings). Currently, the configuration settings for the Service Bus built-in trigger are shared between the [Azure Functions host extension](../azure-functions/functions-bindings-service-bus.md#hostjson-settings), which is defined in your logic app's [**host.json** file](../logic-apps/edit-app-settings-host-settings.md), and the trigger settings defined in your logic app's workflow, which you can set up either through the designer or code view. This section covers both settings locations.

* In Standard workflows, some triggers, such as the **When messages are available in a queue** trigger, can return one or more messages. When these triggers fire, they return between one and the number of messages. For this type of trigger and where the **Maximum message count** parameter isn't supported, you can still control the number of messages received by using the **maxMessageBatchSize** property in the **host.json** file. To find this file, see [Edit host and app settings for Standard logic apps](../logic-apps/edit-app-settings-host-settings.md).

  
  ```json
  "extensions": {
    "serviceBus": {
        "maxMessageBatchSize": 25
    }
  }
  ```

* You can also enable concurrency on the Service Bus trigger, either through the designer or in code:

  ```json
  "runtimeConfiguration": {
      "concurrency": {
          "runs": 100
      }
  }
  ```

  When you set up concurrency using a batch, keep the number of concurrent runs larger than the overall batch size. That way, read messages don't go into a waiting state and are always picked up when they're read. In some cases, the trigger can have up to twice the batch size.

* If you enable concurrency, the **SplitOn** limit is reduced to 100 items. This behavior is true for all triggers, not just the Service Bus trigger. Make sure the specified batch size is less than this limit on any trigger where you enable concurrency.

* [Some scenarios exist where the trigger can exceed the concurrency settings](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs-limit). Rather than fail these runs, Azure Logic Apps queues them in a waiting state until they can be started. The [**maximumWaitingRuns** setting](../logic-apps/edit-app-settings-host-settings.md#trigger-concurrency) controls the number of runs allowed in the waiting state:

  ```json
  "runtimeConfiguration": {
      "concurrency": {
          "runs": 100,
          "maximumWaitingRuns": 50
      }
  }
  ```

  With the Service Bus trigger, make sure that you carefully test these changes so that runs don't wait longer than the message lock timeout. For more information about the default values, see [Concurrency and de-batching limits here](../logic-apps/logic-apps-limits-and-config.md#concurrency-and-debatching).

* If you enable concurrency, a 30-second delay exists between batch reads, by default. This delay slows down the trigger to achieve the following goals:

  - Reduce the number of storage calls sent to check the number of runs on which to apply concurrency.

  - Mimic the behavior of the Service Bus managed connector trigger, which has a 30-second long poll when no messages are found.

  You can change this delay, but make sure that you carefully test any changes to the default value:

  ```json
  "workflow": {
      "settings": {
          "Runtime.ServiceProviders.FunctionTriggers.DynamicListenerEnableDisableInterval": "00:00:30"
      }
  }

## Step 1: Check access to Service Bus namespace

To confirm that your logic app resource has permissions to access your Service Bus namespace, use the following steps:

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace menu, under **Settings**, select **Shared access policies**. Under **Claims**, check that you have **Manage** permissions for that namespace.

   ![Screenshot showing the Azure portal, Service Bus namespace, and 'Shared access policies' selected.](./media/connectors-create-api-azure-service-bus/azure-service-bus-namespace.png)

## Step 2: Get connection authentication requirements

Later, when you add a Service Bus trigger or action for the first time, you're prompted for connection information, including the connection authentication type. Based on your logic app workflow type, Service Bus connector version, and selected authentication type, you'll need the following items:

<a name="managed-connector-auth"></a>

### Managed connector authentication (Consumption and Standard workflows)

| Authentication type | Required information |
|---------------------|----------------------|
| **Access Key** | The connection string for your Service Bus namespace. For more information, review [Get connection string for Service Bus namespace](#get-connection-string) |
| **Microsoft Entra integrated** | The endpoint URL for your Service Bus namespace. For more information, review [Get endpoint URL for Service Bus namespace](#get-endpoint-url). |
| **Logic Apps Managed Identity** | The endpoint URL for your Service Bus namespace. For more information, review [Get endpoint URL for Service Bus namespace](#get-endpoint-url). |

<a name="built-in-connector-auth"></a>

### Built-in connector authentication (Standard workflows only)

| Authentication type | Required information |
|---------------------|----------------------|
| **Connection String** | The connection string for your Service Bus namespace. For more information, review [Get connection string for Service Bus namespace](#get-connection-string) |
| **Active Directory OAuth** | - The fully qualified name for your Service Bus namespace, for example, **<*your-Service-Bus-namespace*>.servicebus.windows.net**. For more information, review [Get fully qualified name for Service Bus namespace](#get-fully-qualified-namespace). For the other property values, see [OAuth with Microsoft Entra ID](../logic-apps/logic-apps-securing-a-logic-app.md#oauth-microsoft-entra). |
| **Managed identity** | The fully qualified name for your Service Bus namespace, for example, **<*your-Service-Bus-namespace*>.servicebus.windows.net**. For more information, review [Get fully qualified name for Service Bus namespace](#get-fully-qualified-namespace). |

<a name="get-connection-string"></a>

### Get connection string for Service Bus namespace

To create a connection when you add a Service Bus trigger or action, you need to have the connection string for your Service Bus namespace. The connection string starts with the **sb://** prefix.

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace menu, under **Settings**, select **Shared access policies**.

1. On the **Shared access policies** pane, select **RootManageSharedAccessKey**.

1. Next to the primary or secondary connection string, select the copy button.

   ![Screenshot showing the Service Bus namespace connection string and the copy button selected.](./media/connectors-create-api-azure-service-bus/find-service-bus-connection-string.png)

   > [!NOTE]
   >
   > To check that the string is for the namespace, not a specific messaging entity, search the 
   > connection string for the `EntityPath` parameter. If you find this parameter, the connection 
   > string is for a specific entity, and isn't the correct string to use with your workflow.

1. Save the connection string for later use.

<a name="get-endpoint-url"></a>

### Get endpoint URL for Service Bus namespace

If you use the Service Bus managed connector, you need this endpoint URL if you select either authentication type for **Microsoft Entra integrated** or **Logic Apps Managed Identity**. The endpoint URL starts with the **sb://** prefix.

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace menu, under **Settings**, select **Properties**.

1. Under **Properties**, next to the **Service Bus endpoint**, copy the endpoint URL, and save for later use when you have to provide the service bus endpoint URL.

<a name="get-fully-qualified-namespace"></a>

### Get fully qualified name for Service Bus namespace

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace menu, select **Overview**.

1. On the **Overview** pane, find the **Host name** property, and copy the fully qualified name, which looks like **<*your-Service-Bus-namespace*>.servicebus.windows.net**.

<a name="add-trigger"></a>

## Step 3: Option 1 - Add a Service Bus trigger

The following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to create logic app workflows:

* Consumption workflows: [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)
* Standard workflows: [Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource with blank workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger). 

   This example continues with the trigger named **When a message is received in a queue (auto-complete)**.

1. If prompted, provide the following information for your connection. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Consumption workflow, Service Bus trigger, and example connection information.](./media/connectors-create-api-azure-service-bus/trigger-connection-access-key-consumption.png)

1. After the trigger information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue name** | Yes | The selected queue to access |
   | **Queue type** | No | The type for the selected queue |
   | **How often do you want to check for items?** | Yes | The polling interval and frequency to check the queue for items |

   ![Screenshot showing Consumption workflow, Service Bus trigger, and example trigger information.](./media/connectors-create-api-azure-service-bus/service-bus-trigger-consumption.png)

1. To add any other available properties to the trigger, open the **Add new parameter** list, and select the properties that you want.

1. Add any actions that your workflow needs.

   For example, you can add an action that sends email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the found message.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

The steps to add and use a Service Bus trigger differ based on whether you want to use the built-in connector or the managed, Azure-hosted connector.

* [**Built-in trigger**](#built-in-connector-trigger): Describes the steps to add the built-in trigger.

* [**Managed trigger**](#managed-connector-trigger): Describes the steps to add the managed trigger.

<a name="built-in-connector-trigger"></a>

#### Built-in connector trigger

By default, the Service Bus built-in connector is a stateless connector. To run this connector's operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](enable-stateful-affinity-built-in-connectors.md). Also, Service Bus built-in non-session triggers follow the [*push trigger* pattern](introduction.md#triggers), while session-based triggers provide polling capability.

1. In the [Azure portal](https://portal.azure.com), and open your Standard logic app resource with blank workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus built-in trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the built-in auto-complete trigger named **When messages are available in a queue**. This trigger reads the message from a service bus. If the logic app can get the message and save the trigger response to storage, the trigger automatically completes the message. If a failure happens instead, the trigger abandons the message. These behaviors only apply to stateful workflows. For stateless workflows, the auto-complete or abandon decision happens only after the run completes.

1. If prompted, provide the following information for your connection. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Built-in connector authentication](#built-in-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses connection string authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Standard workflow, Service Bus built-in trigger, and example connection information.](./media/connectors-create-api-azure-service-bus/trigger-connection-string-built-in-standard.png)

1. After the trigger information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue name** | Yes | The selected queue to access |
   | **IsSessionsEnabled** | No | - **No** (default) if not connecting to a session-aware queue <br>- **Yes** if otherwise |

   ![Screenshot showing Standard workflow, Service Bus built-in trigger, and example trigger information.](./media/connectors-create-api-azure-service-bus/service-bus-trigger-built-in-standard.png)

1. Add any actions that your workflow needs.

   For example, you can add an action that sends email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the found message.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-trigger"></a>

#### Managed connector trigger

Service Bus managed triggers follow the [*long polling trigger* pattern](#service-bus-managed-triggers).

1. In the [Azure portal](https://portal.azure.com), and open your Standard logic app resource and blank workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus managed trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the trigger named **When a message is received in a queue (auto-complete)**.

1. In the connection box, provide the following information. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Standard workflow, Service Bus managed trigger, and example connection information.](./media/connectors-create-api-azure-service-bus/trigger-connection-string-managed-standard.png)

1. After the trigger information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue name** | Yes | The selected queue to access |
   | **Queue type** | No | The type for the selected queue |
   | **How often do you want to check for items?** | Yes | The polling interval and frequency to check the queue for items |

   ![Screenshot showing Standard workflow, Service Bus managed trigger, and example trigger information.](./media/connectors-create-api-azure-service-bus/service-bus-trigger-managed-standard.png)

1. To add any other available properties to the trigger, open the **Add new parameter** list, and select the properties that you want.

1. Add any actions that your workflow needs.

   For example, you can add an action that sends email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the found message.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="add-action"></a>

## Step 3: Option 2 - Add a Service Bus action

The following steps use the Azure portal, but with the appropriate Azure Logic Apps extension, you can also use the following tools to build logic app workflows:

* Consumption workflows: [Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)
* Standard workflows: [Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   This example continues with the **Send message** action.

1. If prompted, provide the following information for your connection. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Consumption workflow, Service Bus action, and example connection information.](./media/connectors-create-api-azure-service-bus/action-connection-access-key-consumption.png)

1. After the action information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue/Topic name** | Yes | The selected queue or topic destination for sending the message |
   | **Session Id** | No | The session ID if sending the message to a session-aware queue or topic  |
   | **System properties** | No | - **None** <br>- **Run Details**: Add metadata property information about the run as custom properties in the message. |

   ![Screenshot showing Consumption workflow, Service Bus action, and example action information.](./media/connectors-create-api-azure-service-bus/service-bus-action-consumption.png)

1. To add any other available properties to the action, open the **Add new parameter** list, and select the properties that you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends email to confirm that your message was sent.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

The steps to add and use a Service Bus action differ based on whether you want to use the built-in connector or the managed, Azure-hosted connector.

* [**Built-in action**](#built-in-connector-action): Describes the steps to add a built-in action.

* [**Managed action**](#managed-connector-action): Describes the steps to add a managed action.

<a name="built-in-connector-action"></a>

#### Built-in connector action

The built-in Service Bus connector is a stateless connector, by default. To run this connector's operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](enable-stateful-affinity-built-in-connectors.md).

1. In the [Azure portal](https://portal.azure.com), and open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus built-in action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

   This example continues with the action named **Send message**.

1. If prompted, provide the following information for your connection. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Built-in connector authentication](#built-in-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses connection string authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Standard workflow, Service Bus built-in action, and example connection information.](./media/connectors-create-api-azure-service-bus/action-connection-string-built-in-standard.png)

1. After the action information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue or topic name** | Yes | The selected queue to access |

   ![Screenshot showing Standard workflow, Service Bus built-in action, and example action information.](./media/connectors-create-api-azure-service-bus/service-bus-action-built-in-standard.png)

1. To add any other available properties to the action, open the **Add new parameter** list, and select the properties that you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends email to confirm that your message was sent.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-action"></a>

#### Managed connector action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus managed action that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

   This example continues with the action named **Send message**.

1. If prompted, provide the following information for your connection. When you're done, select **Create**.

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection name** | Yes | A name for your connection |
   | **Authentication Type** | Yes | The type of authentication to use for accessing your Service Bus namespace. For more information, review [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   ![Screenshot showing Standard workflow, Service Bus managed action, and example connection information.](./media/connectors-create-api-azure-service-bus/action-connection-string-managed-standard.png)

1. After the action information box appears, provide the necessary information, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Queue/Topic name** | Yes | The selected queue or topic destination for sending the message |
   | **Session Id** | No | The session ID if sending the message to a session-aware queue or topic  |
   | **System properties** | No | - **None** <br>- **Run Details**: Add metadata property information about the run as custom properties in the message. |

   ![Screenshot showing Standard workflow, Service Bus managed action, and example action information.](./media/connectors-create-api-azure-service-bus/service-bus-action-managed-standard.png)

1. To add any other available properties to the action, open the **Add new parameter** list, and select the properties that you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends email to confirm that your message was sent.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

<a name="built-in-connector-app-settings"></a>

## Service Bus built-in connector app settings

In a Standard logic app resource, the Service Bus built-in connector includes app settings that control various thresholds, such as timeout for sending messages and number of message senders per processor core in the message pool. For more information, review [Reference for app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#reference-local-settings-json).

<a name="read-messages-dead-letter-queues"></a>

## Read messages from dead-letter queues with Service Bus built-in triggers

In Standard workflows, to read a message from a dead-letter queue in a queue or a topic subscription, follow these steps using the specified triggers:

1. In your blank workflow, based on your scenario, add the Service Bus *built-in* connector trigger named **When messages are available in a queue** or **When a message are available in a topic subscription (peek-lock)**.

1. In the trigger, set the following parameter values to specify your queue or topic subscription's default dead-letter queue, which you can access like any other queue:

   * **When messages are available in a queue** trigger: Set the **Queue name** parameter to **queuename/$deadletterqueue**.

   * **When a message are available in a topic subscription (peek-lock)** trigger: Set the **Topic name** parameter to **topicname/Subscriptions/subscriptionname/$deadletterqueue**.

   For more information, see [Service Bus dead-letter queues overview](../service-bus-messaging/service-bus-dead-letter-queues.md#path-to-the-dead-letter-queue).

## Troubleshooting

### Delays in updates to your workflow taking effect

If a Service Bus trigger's polling interval is small, such as 10 seconds, updates to your workflow might not take effect for up to 10 minutes. To work around this problem, you can disable the logic app resource, make the changes, and then enable the logic app resource again.

### No session available or might be locked by another receiver

Occasionally, operations such as completing a message or renewing a session produce the following error:

``` json
{
  "status": 400,
  "error": {
    "message": "No session available to complete the message with the lock token 'ce440818-f26f-4a04-aca8-555555555555'."
  }
}
```

Occasionally, a session-based trigger might fail with the following error:

``` json
{
  "status": 400,
  "error": {
    "message": "Communication with the Service Bus namespace 'xxxx' and 'yyyy' entity failed. The requested session 'zzzz' cannot be accepted. It may be locked by another receiver."
  }
}
```

The Service Bus connector uses in-memory cache to support all operations associated with the sessions. The Service Bus message receiver is cached in the memory of the role instance (virtual machine) that receives the messages. To process all requests, all calls for the connection get routed to this same role instance. This behavior is required because all the Service Bus operations in a session require the same receiver that receives the messages for a specific session.

Due to reasons such as an infrastructure update, connector deployment, and so on, the possibility exists for requests to not get routed to the same role instance. If this event happens, requests fail for one of the following reasons:

- The receiver that performs the operations in the session isn't available in the role instance that serves the request.

 - The new role instance tries to obtain the session, which either timed out in the old role instance or wasn't closed.

As long as this error happens only occasionally, the error is expected. When the error happens, the message is still preserved in the service bus. The next trigger or workflow run tries to process the message again.

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [What are connectors in Azure Logic Apps](introduction.md)
