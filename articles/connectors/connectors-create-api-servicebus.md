---
title: Connect to Azure Service Bus from Workflows
description: Connect workflows in Azure Logic Apps to Azure Service Bus by using the Service Bus connector to manage messages.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 03/18/2026
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want my workflow to access Azure Service Bus by using the Service Bus connector.
---

# Connect to Azure Service Bus from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how to access service bus resources in Azure Service Bus from automation and integration workflows in Azure Logic Apps by using the Service Bus connector. You can have service bus events trigger your workflow or run actions that interact with service bus items, for example:

- Monitor when messages arrive (auto-complete) or are received (peek-lock) in queues, topics, and topic subscriptions.
- Send messages.
- Create and delete topic subscriptions.
- Manage messages in queues and topic subscriptions, for example, get, get deferred, complete, defer, abandon, and dead-letter.
- Renew locks on messages and sessions in queues and topic subscriptions.
- Close sessions in queues and topics.

You can use triggers and actions that get responses from Azure Service Bus and then make the output available to other actions in your workflows.

<a name="connector-reference"></a>

## Connector technical reference

The Service Bus connector has different versions, based on [logic app workflow type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connector version |
|-----------|-------------|-------------------|
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**. <br><br>**Note**: Service Bus managed connector triggers follow the [*long-polling trigger* pattern](#service-bus-managed-triggers), which means that the trigger periodically checks for messages in the queue or topic subscription. For more information, see: <br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Managed connectors in Azure Logic Apps](managed.md) |
| **Standard** | Single-tenant Azure Logic Apps, App Service Environment v3 (Windows plans only), and hybrid deployment | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**, and built-in connector, which appears in the connector gallery under **Runtime** > **Built-in** and is [service provider based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). <br><br>**Note**: Service Bus managed connector triggers follow the [*long-polling trigger* pattern](#service-bus-managed-triggers), which means that the trigger periodically checks for messages in the queue or topic subscription. <br><br>Service Bus built-in connector non-session triggers follow a *continuous-polling trigger pattern* that the connector fully manages. In this pattern, the trigger constantly checks for messages in the queue or topic subscription. Session triggers follow the *long-polling trigger pattern*, but the Azure Functions setting named [**clientRetryOptions:tryTimeout**](../azure-functions/functions-bindings-service-bus.md#hostjson-settings) governs their configuration. The built-in connector generally provides better performance, capabilities, pricing, and so on. <br><br>For more information, see: <br><br>- [Service Bus managed connector reference](/connectors/servicebus/) <br>- [Service Bus built-in connector operations](/azure/logic-apps/connectors/built-in/reference/servicebus) <br>- [Built-in connectors in Azure Logic Apps](built-in.md) |

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Service Bus namespace and messaging entity, such as a queue.

  For more information, see: 

  - [Create a Service Bus namespace](../service-bus-messaging/service-bus-create-namespace-portal.md)
  - [Create a Service Bus namespace and queue](../service-bus-messaging/service-bus-quickstart-portal.md)
  - [Create a Service Bus namespace and topic with subscription](../service-bus-messaging/service-bus-queues-topics-subscriptions.md)

- The logic app resource and workflow where you want to access the Service Bus namespace and messaging entity.

  - To start your workflow with a Service Bus trigger, create a blank workflow. To use a Service Bus action in your workflow, start your workflow with any trigger that best suits your scenario.

  - If your logic app resource uses a managed identity to authenticate access to your Service Bus namespace and messaging entity, assign the necessary role permissions at the corresponding levels. For example, to access a queue, the managed identity requires a role with the necessary permissions for that queue.

    - Each logic app resource can use only one managed identity, even if the logic app workflow accesses different messaging entities.

    - Each managed identity that accesses a queue or topic subscription needs to use its own Service Bus API connection.

    - Each Service Bus operation that exchanges messages with different messaging entities and requires different permissions needs to use its own Service Bus API connection.

    For more information about managed identities, see [Authenticate access to Azure resources with managed identities in Azure Logic Apps](../logic-apps/create-managed-service-identity.md).

- By default, Service Bus built-in connector operations are *stateless*. To run these operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](../connectors/enable-stateful-affinity-built-in-connectors.md).

## Considerations for Azure Service Bus operations

### Infinite loops

[!INCLUDE [Warning about creating infinite loops](../../includes/connectors-infinite-loops.md)]

### Limit on saved sessions in connector cache

For each Service Bus messaging entity, such as a [subscription or topic](../service-bus-messaging/service-bus-queues-topics-subscriptions.md), the Service Bus connector can save up to 1,500 unique sessions at a time in the connector cache. If the session count exceeds this limit, the connector cache removes old sessions. For more information, see [Message sessions](../service-bus-messaging/message-sessions.md).

<a name="sequential-convoy"></a>

### Send correlated messages in order

When you need to send related messages in a specific order, create a workflow by using the Service Bus connector and the [*sequential convoy* pattern](/azure/architecture/patterns/sequential-convoy). Correlated messages have a property that defines the relationship between those messages, such as the ID for the [session](../service-bus-messaging/message-sessions.md) in Azure Service Bus.

When you create a Consumption logic app workflow, you can select the **Correlated in-order delivery using service bus sessions** template, which implements the sequential convoy pattern. For more information, see [Send related messages in order](../logic-apps/send-related-messages-sequential-convoy.md).

### Large message support

Large message support is available only for Standard workflows when you use the Service Bus built-in connector operations. For example, you can receive and handle large messages by using the built-in triggers and actions respectively.

For the Service Bus managed connector, the maximum message size is limited to 1 MB, even when you use a premium tier Service Bus namespace.

### Increase timeout for receiving and sending messages

In Standard workflows that use the Service Bus built-in operations, you can increase the timeout for receiving and sending messages. For example, to increase the timeout for receiving a message, change the setting in the following code example in the [Azure Functions extension](../azure-functions/functions-bindings-service-bus.md#install-bundle):

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

For the Service Bus managed connector, all triggers use the *long polling* pattern. This trigger type processes all the messages and then waits 30 seconds for more messages to appear in the queue or topic subscription. If no messages appear in 30 seconds, the trigger run is skipped. Otherwise, the trigger continues reading messages until the queue or topic subscription is empty. The next trigger poll is based on the recurrence interval specified in the trigger's properties.

Some triggers, such as the **When one or more messages arrive in a queue (auto-complete)** trigger, can return one or more messages. When these triggers fire, they return between one and the number of messages that's specified by the trigger's **Maximum message count** property.

> [!NOTE]
>
> The auto-complete trigger automatically completes a message, but completion happens only at the next call to Service Bus. This behavior can affect your workflow design. For example, avoid changing the concurrency on the auto-complete trigger because this change might result in duplicate messages if your workflow enters a throttled state. Changing the concurrency control creates the following conditions:
>
> - Throttled triggers are skipped with the `WorkflowRunInProgress` code.
> - The completion operation doesn't run.
> - The next trigger run occurs after the polling interval.
>
> You need to set the service bus lock duration to a value that's longer than the polling interval. However, despite this setting, the message still might not complete if your workflow remains in a throttled state at next polling interval.
>
> If you must change the concurrency on a Service Bus auto-complete trigger, don't make this change before you initially save your workflow. Create and save your workflow first before you edit the trigger to change the concurrency.

### Service Bus built-in connector triggers

For the Service Bus built-in connector, non-session triggers follow a *continuous-polling* trigger pattern, which the connector fully manages. In this pattern, the trigger constantly checks for messages in the queue or topic subscription. By contrast, session triggers follow the *long-polling* trigger pattern. The Azure Functions setting, [**clientRetryOptions:tryTimeout**](../azure-functions/functions-bindings-service-bus.md#hostjson-settings), governs their configuration. The [Azure Functions host extension](../azure-functions/functions-bindings-service-bus.md#hostjson-settings), defined in your logic app's [*host.json* file](../logic-apps/edit-app-settings-host-settings.md), and the trigger settings defined in your logic app's workflow, which you set up through the designer or code view, share configuration settings for the Service Bus built-in trigger. This section covers both settings locations. Note the following details about Service Bus triggers:

- Some built-in triggers, such as the **When messages are available in a queue** trigger, can return one or more messages. When these triggers fire, they return between one and the number of messages.

- The built-in trigger named **When messages are available in a queue (V1)** doesn't support the parameter named **Maximum message batch size**. If you use this parameter, you need to use the V2 version instead. To use a trigger where the parameter isn't supported, you can control the number of messages received by adding the `maxMessageBatchSize` parameter to the trigger definition in the *host.json* file. To find this file, see [Edit host and app settings for Standard logic apps](../logic-apps/edit-app-settings-host-settings.md).

  ```json
  "extensions": {
     "serviceBus": {
        "maxMessageBatchSize": 25
     }
  }
  ```

- You can enable concurrency on a Service Bus trigger, either through the designer or in code, for example:

  ```json
  "runtimeConfiguration": {
     "concurrency": {
          "runs": 50
      }
  }
  ```

  - If you set up concurrency by using a batch, keep the number of concurrent runs larger than the overall batch size. That way, read messages don't go into a waiting state and are always picked up when they're read. In some cases, the trigger can have up to twice the batch size.

  - If you enable concurrency on the trigger named **When messages are available in a queue (V1)**, and you send 100 or more messages to the queue, the trigger routes all messages to the [dead-letter queue](../service-bus-messaging/service-bus-dead-letter-queues.md).

  - If you enable concurrency, the limit for debatching or **Split on** behavior is reduced to 100 items. This behavior is true for all triggers, not just the Service Bus trigger. Make sure the specified batch size is less than this limit on any trigger where you enable concurrency.

  - If you enable concurrency, by default, a 30-second delay exists between batch reads. This delay slows down the trigger to achieve the following goals:

    - Reduce the number of storage calls sent to check the number of runs on which to apply concurrency.

    - Mimic the behavior of the Service Bus managed connector trigger, which has a 30-second long poll when no messages are found.

      Although you can change this delay, make sure that you carefully test any changes to the default value:

      ```json
       "workflow": {
          "settings": {
             "Runtime.ServiceProviders.FunctionTriggers.DynamicListenerEnableDisableInterval": "00:00:30"
          }
       }
       ```

  - [Some scenarios exist where the trigger can exceed the concurrency settings](../logic-apps/logic-apps-workflow-actions-triggers.md#change-waiting-runs-limit). Rather than fail these runs, Azure Logic Apps queues them in a waiting state until they can be started. The [`maximumWaitingRuns` setting](../logic-apps/edit-app-settings-host-settings.md#trigger-concurrency) controls the number of runs allowed in the waiting state:

    ```json
    "runtimeConfiguration": {
       "concurrency": {
          "runs": 100,
          "maximumWaitingRuns": 50
       }
    }
    ```

    With the Service Bus trigger, make sure that you carefully test these changes so that runs don't wait longer than the message lock timeout. For more information about the default values, see [Concurrency and de-batching limits here](../logic-apps/logic-apps-limits-and-config.md#concurrency-and-debatching).

## Step 1: Check access to Service Bus namespace

To confirm that your logic app resource has permissions to access your Service Bus namespace, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace sidebar, under **Settings**, select **Shared access policies**. Under **Claims**, check that you have **Manage** permissions for that namespace.

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/azure-service-bus-namespace.png" alt-text="Screenshot that shows the Azure portal, Service Bus namespace, and Shared access policies page open, and Manage setting highlighted.":::

## Step 2: Get connection authentication requirements

When you add a Service Bus trigger or action for the first time, you're prompted for connection information, including the connection authentication type. Based on your logic app workflow type, Service Bus connector version, and selected authentication type, you need the items described in the following sections.

<a name="managed-connector-auth"></a>

### Managed connector authentication (Consumption and Standard workflows)

| Authentication type | Required information |
|---------------------|----------------------|
| **Access Key** | The connection string for your Service Bus namespace. For more information, see [Get connection string for Service Bus namespace](#get-connection-string). |
| **Microsoft Entra integrated** | The endpoint URL for your Service Bus namespace. For more information, see [Get endpoint URL for Service Bus namespace](#get-endpoint-url). |
| **Logic Apps Managed Identity** | The endpoint URL for your Service Bus namespace. For more information, see [Get endpoint URL for Service Bus namespace](#get-endpoint-url). |

<a name="built-in-connector-auth"></a>

### Built-in connector authentication (Standard workflows only)

| Authentication type | Required information |
|---------------------|----------------------|
| **Connection String** | The connection string for your Service Bus namespace. For more information, see [Get connection string for Service Bus namespace](#get-connection-string). |
| **Active Directory OAuth** | The fully qualified name for your Service Bus namespace, for example, **<*your-Service-Bus-namespace*>.servicebus.windows.net**. For more information, see [Get fully qualified name for Service Bus namespace](#get-fully-qualified-namespace). For the other property values, see [OAuth with Microsoft Entra ID](../logic-apps/logic-apps-securing-a-logic-app.md#oauth-microsoft-entra). |
| **Managed identity** | The fully qualified name for your Service Bus namespace, for example, **<*your-Service-Bus-namespace*>.servicebus.windows.net**. For more information, see [Get fully qualified name for Service Bus namespace](#get-fully-qualified-namespace). |

<a name="get-connection-string"></a>

### Get connection string for Service Bus namespace

To create a connection when you add a Service Bus trigger or action, you need the connection string for your Service Bus namespace. The connection string starts with the **sb://** prefix.

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace sidebar, under **Settings**, select **Shared access policies**.

1. On the **Shared access policies** pane, select **RootManageSharedAccessKey**.

1. Next to the primary or secondary connection string, select the copy button.

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/find-service-bus-connection-string.png" alt-text="Screenshot that shows the Service Bus namespace, Shared access policies page open, the RootManageSharedAccessKey policy selected, and SAS Policy pane open. The copy button for the primary connection string is selected.":::

   > [!NOTE]
   >
   > To confirm that the string is for the namespace, not a specific messaging entity, search the connection string for the `EntityPath` parameter. If you find this parameter, the connection string is for a specific entity, and isn't the correct string to use with your workflow.

1. Save the connection string for later use.

<a name="get-endpoint-url"></a>

### Get endpoint URL for Service Bus namespace

If you use the Service Bus managed connector, you need this endpoint URL if you select either authentication type for **Microsoft Entra integrated** or **Logic Apps Managed Identity**. The endpoint URL starts with the **sb://** prefix.

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace sidebar, expand **Settings**, and then select **Properties**.

1. Under **Essentials**, next to **Id**, copy and save the endpoint URL for later use.

<a name="get-fully-qualified-namespace"></a>

### Get fully qualified name for Service Bus namespace

1. In the [Azure portal](https://portal.azure.com), open your Service Bus *namespace*.

1. On the namespace sidebar, select **Overview**.

1. On the **Overview** page, expand **Essentials**, and find the **Host name** property.

1. Copy and save the fully qualified name, which looks like **<*your-Service-Bus-namespace*>.servicebus.windows.net**, for later use.

<a name="add-trigger"></a>

## Step 3: Option 1 - Add a Service Bus trigger

The following steps use the Azure portal, but by using the corresponding Azure Logic Apps extension, you can use Visual Studio Code to create logic app workflows:

- Consumption workflows: [Create Consumption logic app workflows with Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)
- Standard workflows: [Create Standard logic app workflows with Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource. Open the blank workflow in the designer.

1. In the designer, follow the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-trigger) to add the Azure Service Bus trigger you want for your scenario.

   This example uses the trigger named **When a message is received in a queue (auto-complete)**.

1. Provide the following connection information:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type to use for accessing your Service Bus namespace. For more information, see [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, the following connection uses an access key for authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/trigger-connection-access-key-consumption.png" alt-text="Screenshot that shows the Create connection pane for a new Service Bus trigger that uses access key authentication in a Consumption workflow.":::

1. When you finish, select **Create new**.

1. In the trigger information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue name** | Yes | The selected queue to access |
   | **Queue type** | No | The type for the selected queue |
   | **How often do you want to check for items?** | Yes | The polling interval and frequency to check the queue for items |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-trigger-consumption.png" alt-text="Screenshot that shows the new Service Bus managed trigger with example information in a Consumption workflow.":::

1. Add any actions that your workflow needs.

   For example, you can add an action that sends an email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the new message.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

The steps to add and use a Service Bus trigger differ based on whether you want to use the built-in or managed connector.

- [**Built-in trigger**](#built-in-connector-trigger): Describes the steps to add the built-in trigger.

- [**Managed trigger**](#managed-connector-trigger): Describes the steps to add the managed trigger.

<a name="built-in-connector-trigger"></a>

#### Built-in connector trigger

By default, the Service Bus built-in connector is a stateless connector. To run this connector's operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](enable-stateful-affinity-built-in-connectors.md). Service Bus built-in non-session triggers follow the [*push-trigger* pattern](introduction.md#triggers), while session-based triggers provide polling capability.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open a blank workflow in the designer.

1. In the designer, follow the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-trigger) to add the Azure Service Bus built-in trigger you want for your scenario.

   This example uses the auto-complete trigger named **When messages are available in a queue**. This trigger reads the message from a service bus. If the logic app workflow receives the message and saves the trigger response to storage, the trigger automatically completes the message. However, if a failure happens, the trigger abandons the message. These behaviors apply only to stateful workflows. For stateless workflows, the auto-complete or abandon decision happens only after the run completes.

1. Provide the following connection information:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type for accessing your Service Bus namespace. For more information, see [Built-in connector authentication](#built-in-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses connection string authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/trigger-connection-string-built-in-standard.png" alt-text="Screenshot that shows the Create connection pane for a new Service Bus trigger that uses connection string authentication in a Standard workflow.":::

1. When you finish, select **Create new**.

1. In the trigger information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue name** | Yes | The queue to access. |
   | **IsSessionsEnabled** | No | - **No** (default), if not connecting to a session-aware queue <br>- **Yes**, if otherwise |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-trigger-built-in-standard.png" alt-text="Screenshot that shows the new Service Bus built-in trigger with example information in a Standard workflow.":::

1. Add any actions that your workflow needs.

   For example, you can add an action that sends an email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the new message.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-trigger"></a>

#### Managed connector trigger

Service Bus managed triggers follow the [*long-polling trigger* pattern](#service-bus-managed-triggers).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open the blank workflow in the designer.

1. In the designer, follow the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-trigger) to add the Azure Service Bus managed trigger you want for your scenario.

   This example uses the trigger named **When a message is received in a queue (auto-complete)**.

1. In the connection information pane, provide the following information:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type to use for accessing your Service Bus namespace. For more information, see [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/trigger-connection-string-managed-standard.png" alt-text="Screenshot that shows the Create connection pane for a new Service Bus trigger that uses access key authentication in a Standard workflow.":::

1. When you finish, select **Create new**.

1. In the trigger information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue name** | Yes | The queue to access. |
   | **Queue type** | No | The type for the selected queue. |
   | **How often do you want to check for items?** | Yes | The polling interval and frequency to check the queue for items. |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-trigger-managed-standard.png" alt-text="Screenshot that shows the new Service Bus managed trigger with example information in a Standard workflow.":::

1. To add any other available properties to the trigger, open the **Advanced parameters** list, and select the properties you want.

1. Add any actions that your workflow needs.

   For example, you can add an action that sends an email when a new message arrives. When your trigger checks your queue and finds a new message, your workflow runs your selected actions for the new message.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

---

<a name="add-action"></a>

## Step 3: Option 2 - Add a Service Bus action

The following steps use the Azure portal, but by using the appropriate Azure Logic Apps extension, you can use Visual Studio Code to build logic app workflows:

- Consumption workflows: [Create Consumption logic app workflows with Visual Studio Code](../logic-apps/quickstart-create-logic-apps-visual-studio-code.md)
- Standard workflows: [Create Standard logic app workflows with Visual Studio Code](../logic-apps/create-single-tenant-workflows-visual-studio-code.md)

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource. Open your workflow in the designer.

1. In the designer, follow the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=consumption#add-action) to add the Azure Service Bus action you want for your scenario.

   This example uses the action named **Send message**.

1. In the connection information pane, provide the following information:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type to use for accessing your Service Bus namespace. For more information, see [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/action-connection-access-key-consumption.png" alt-text="Screenshot that shows the Create connection pane for a new Service Bus action that uses access key authentication in a Consumption workflow.":::

1. When you finish, select **Create new**.

1. In the action information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue/Topic name** | Yes | The selected queue or topic destination for sending the message. |
   | **Session Id** | No | The session ID if sending the message to a session-aware queue or topic.  |
   | **System properties** | No | - **None** <br>- **Run Details**: Add metadata property information about the run as custom properties in the message. |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-action-consumption.png" alt-text="Screenshot that shows the Send message Service Bus action with example information in a Consumption workflow.":::

1. To add any other available properties to the action, open the **Advanced parameters** list, and select the properties that you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends an email to confirm that your message was sent.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

### [Standard](#tab/standard)

The steps to add and use a Service Bus action differ based on whether you want to use the built-in connector or the managed, Azure-hosted connector.

- [**Built-in action**](#built-in-connector-action): Describes the steps to add a built-in action.

- [**Managed action**](#managed-connector-action): Describes the steps to add a managed action.

<a name="built-in-connector-action"></a>

#### Built-in connector action

The built-in Service Bus connector is a stateless connector, by default. To run this connector's operations in stateful mode, see [Enable stateful mode for stateless built-in connectors](enable-stateful-affinity-built-in-connectors.md).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open your workflow in the designer.

1. In the designer, follow the [general steps](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-action) to add the Azure Service Bus built-in action you want for your scenario.

   This example uses the action named **Send message**.

1. In the connection information pane, provide the following information:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type to use for accessing your Service Bus namespace. For more information, see [Built-in connector authentication](#built-in-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses connection string authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/action-connection-string-built-in-standard.png" alt-text="Screenshot that shows the Create connection pane for a Service Bus built-in connector action in a Standard workflow.":::

1. When you finish, select **Create new**.

1. In the action information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue or topic name** | Yes | The selected queue to access. |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-action-built-in-standard.png" alt-text="Screenshot that shows information for a Service Bus built-in connector action in a Standard workflow.":::

1. To add any other available properties to the action, open the **Advanced parameters** list, and select the properties that you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends an email to confirm that your message was sent.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

<a name="managed-connector-action"></a>

#### Managed connector action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource. Open the workflow in the designer.

1. In the designer, [follow these general steps to add the Azure Service Bus managed action that you want](../logic-apps/add-trigger-action-workflow.md?tabs=standard#add-action).

   This example uses the action named **Send message**.

1. If prompted, provide the following information for your connection. When you're done, select **Create new**.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection Name** | Yes | A name for your connection. |
   | **Authentication Type** | Yes | The authentication type to use for accessing your Service Bus namespace. For more information, see [Managed connector authentication](#managed-connector-auth). |
   | **Connection String** | Yes | The connection string that you copied and saved earlier. |

   For example, this connection uses access key authentication and provides the connection string for a Service Bus namespace:

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/action-connection-string-managed-standard.png" alt-text="Screenshot that shows access key authentication and provides the connection string for a Service Bus namespace in a Standard workflow.":::

1. In the action information pane, provide the necessary information, for example:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Queue/Topic name** | Yes | The selected queue or topic destination for sending the message. |
   | **Session Id** | No | The session ID if sending the message to a session-aware queue or topic.  |
   | **System properties** | No | - **None** <br>- **Run Details**: Add metadata property information about the run as custom properties in the message. |

   :::image type="content" source="./media/connectors-create-api-azure-service-bus/service-bus-action-managed-standard.png" alt-text="Screenshot that shows the information for a Service Bus managed connector action in a Standard workflow.":::

1. To add any other available properties to the action, open the **Advanced parameters** list, and select the properties you want.

1. Add any other actions that your workflow needs.

   For example, you can add an action that sends an email to confirm that your message was sent.

1. When you finish, save your workflow. On the designer toolbar, select **Save**.

---

<a name="built-in-connector-app-settings"></a>

## Service Bus built-in connector app settings

In a Standard logic app resource, the Service Bus built-in connector includes app settings that control various thresholds. For example, these settings control the timeouts for sending messages and the number of message senders per processor core in the message pool. For more information, see [Reference for app settings - local.settings.json](../logic-apps/edit-app-settings-host-settings.md#reference-local-settings-json).

<a name="read-messages-dead-letter-queues"></a>

## Read messages from dead-letter queues by using Service Bus built-in triggers

In Standard workflows, to read a message from a dead-letter queue in a queue or a topic subscription, follow these steps by using the specified triggers:

1. In your blank workflow, based on your scenario, add the Service Bus *built-in* connector trigger named **When messages are available in a queue** or **When a message are available in a topic subscription (peek-lock)**.

1. In the trigger, set the following parameter values to specify your queue or topic subscription's default dead-letter queue, which you can access like any other queue:

   - **When messages are available in a queue** trigger: Set the **Queue name** parameter to `queuename/$deadletterqueue`.

   - **When a message are available in a topic subscription (peek-lock)** trigger: Set the **Topic name** parameter to `topicname/Subscriptions/subscriptionname/$deadletterqueue`.

   For more information, see [Service Bus dead-letter queues overview](../service-bus-messaging/service-bus-dead-letter-queues.md#path-to-the-dead-letter-queue).

## Troubleshoot problems

### Delays in updates to your workflow taking effect

If a Service Bus trigger's polling interval is small, such as 10 seconds, updates to your workflow might not take effect for up to 10 minutes. To work around this problem, disable the logic app resource, make the changes, and then re-enable the logic app resource.

### No session available or another receiver locked it

Occasionally, operations such as completing a message or renewing a session produce the following error in the managed connector:

``` json
{
  "status": 400,
  "error": {
    "message": "No session available to complete the message with the lock token 'ce440818-f26f-4a04-aca8-555555555555'."
  }
}
```

Occasionally, a session-based trigger might fail with the following error in the managed connector:

``` json
{
  "status": 400,
  "error": {
    "message": "Communication with the Service Bus namespace 'xxxx' and 'yyyy' entity failed. The requested session 'zzzz' cannot be accepted. It may be locked by another receiver."
  }
}
```

Occasionally, operations such as completing a message or renewing a session produce the following error in the built-in connector:

``` json
{
  "code": "ServiceProviderActionFailed",
  "message": "The service provider action failed with error code 'ServiceOperationFailed' and error message 'The Service Bus session was not found to perform operation 'getMessagesFromQueueSession' on session id '11115555'.'."
}
```

The Service Bus connector uses in-memory cache to support all operations associated with the sessions. The Service Bus message receiver is cached in the memory of the role instance (virtual machine) that receives the messages. To process all requests, all calls for the connection get routed to this same role instance. This behavior is required because all the Service Bus operations in a session require the same receiver that receives the messages for a specific session.

Due to reasons such as an infrastructure update, connector deployment, and so on, the possibility exists for requests to not get routed to the same role instance. If this event happens, requests fail for one of the following reasons:

- The receiver that performs the operations in the session isn't available in the role instance that serves the request.

- The new role instance tries to obtain the session, which either timed out in the old role instance or wasn't closed.

This behavior can happen in both the managed connector and the built-in connector. When the error happens, the message is still preserved in the service bus. The next trigger or workflow run tries to process the message again. As long as this error happens only occasionally, the error is expected.

## Related content

- [Managed connectors in Azure Logic Apps](managed.md)
- [Built-in connectors in Azure Logic Apps](built-in.md)
- [What are connectors in Azure Logic Apps](introduction.md)
