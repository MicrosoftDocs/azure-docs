---
title: Batch process messages as a group
description: Send and receive messages in groups between your workflows by using batch processing in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/05/2025
---

# Send, receive, and batch process messages in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To send and process messages together in a specific way as groups, you can create a batching solution. This solution collects messages into a *batch* and waits until your specified criteria are met before releasing and processing the batched messages. Batching can reduce how often your logic app processes messages.

This how-to guide shows how to build a batching solution by creating two logic apps within the same Azure subscription, Azure region, and in this order:

1. The ["batch receiver"](#batch-receiver) logic app, which accepts and collects messages into a batch until your specified criteria is met for releasing and processing those messages. Make sure that you first create this batch receiver so that you can later select the batch destination when you create the batch sender.

1. One or more ["batch sender"](#batch-sender) logic apps, which send the messages to the previously created batch receiver.

   The batch sender can specify a unique key that *partitions* or divides the target batch into logical subsets, based on that key. For example, a customer number is a unique key. That way, the receiver app can collect all items with the same key and process them together.

Your batch receiver and batch sender need to share the same Azure subscription *and* Azure region. If they don't, you can't select the batch receiver when you create the batch sender because they're not visible to each other.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An email account with any [email provider supported by Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)

  > [!IMPORTANT]
  >
  > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
  > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
  > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

* Basic knowledge about [logic app workflows](logic-apps-overview.md)

* To use Visual Studio Code rather than the Azure portal, make sure that you [set up Visual Studio Code for working with Azure Logic Apps](/azure/logic-apps/quickstart-create-logic-apps-visual-studio-code).

## Limitations

* You can only check the contents in a batch after release by comparing the released contents with the source.

* You can release a batch early only by changing the release criteria in the batch receiver, which is described in this guide, while the trigger still has the batch. However, the trigger uses the updated release criteria for any unsent messages.

<a name="batch-receiver"></a>

## Create batch receiver

Before you can send messages to a batch, that batch must first exist as the destination where you send those messages. So first, you must create the "batch receiver" logic app workflow, which starts with the **Batch Trigger**. That way, when you create the "batch sender" logic app workflow, you can select the batch receiver logic app workflow. The batch receiver continues collecting messages until your specified criteria is met for releasing and processing those messages. While batch receivers don't need to know anything about batch senders, batch senders must know the destination where they send the messages.

1. In the [Azure portal](https://portal.azure.com), create a logic app resource with a blank workflow.

   This example creates a batch receiver logic app and workflow named **BatchReceiver**.

1. In the workflow designer, select **Add a trigger**, and [follow these general steps to add the **Batch Operations** trigger named **Batch Trigger**](create-workflow-with-trigger-or-action.md#add-trigger).

1. Set the following trigger properties:

   | Property | Description |
   |----------|-------------|
   | **Mode** <br>(Consumption workflows only) | - **Inline**: For defining release criteria inside the batch trigger <br><br>- **Integration Account**: For defining multiple release criteria configurations through an integration account. With an integration account, you can maintain these configurations all in one place rather than in separate logic app resources. |
   | **Batch Name** | The name for your batch. In Consumption workflows, this property appears only when **Mode** is set to **Inline**. This example uses **TestBatch**. |
   | **Release Criteria** | The criteria to meet before processing each batch. By default, the batch trigger operates using "inline mode" where you define the batch release criteria inside the batch trigger. <br><br>- **Message count based**: Release the batch based on the number of messages collected by the batch. <br><br>- **Size based**: Release the batch based on the total size in bytes for all messages collected by that batch. <br><br>- **Schedule based**: Release the batch based on a recurrence schedule, which specifies an interval and frequency. You can optionally select a time zone and provide a start date and time. <br><br>To use all the specified criteria, select all the options. |
   | **Message Count** | The number of messages to collect in the batch, for example, 10 messages. The batch message limit is 8,000 messages. |
   | **Batch Size** | The total byte size for messages to collect in the batch, for example, 10 MB or 10,485,760 bytes. The batch size limit is 80 MB. |
   | **Recurrence** | The interval and frequency between batch releases, for example, 10 minutes. The minimum recurrence is 60 seconds or 1 minute. Fractional minutes are effectively rounded up to 1 minute. Optionally, you can select a time zone and provide a start date and time. |

   > [!NOTE]
   >
   > If you change the release criteria while the trigger still has batched but unsent messages, 
   > the trigger uses the updated release criteria for handling the unsent messages.

   This example shows all the criteria, but for your own testing, try just one criterion:

   :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-receiver-criteria.png" alt-text="Screenshot shows all criteria for Batch Trigger.":::

1. Now add one or more actions that process each batch.

   For this example, add an action that sends an email when the batch trigger fires. The trigger runs and sends an email when the batch either has 10 messages, reaches 10 MB, or after 10 minutes pass.

   1. Under the batch trigger, select the plus (**+**) sign > **Add an action**.

   1. [Follow these general steps to add an action that sends an email](create-workflow-with-trigger-or-action.md#add-action), based on your email provider.

      For example, if you have a work or school account, such as @fabrikam.com or @fabrikam.onmicrosoft.com, select the **Microsoft 365 Outlook** connector. If you have a personal account, such as @outlook.com or @hotmail.com, select the **Outlook.com** connector. This example uses the Microsoft 365 Outlook connector.

1. If prompted, sign in to your email account.

1. Set the following action properties:

   * In the **To** box, enter the recipient's email address. For testing purposes, you can use your own email address.

   * Select inside the **Subject** box to view the options for the dynamic content list (lightning icon) and expression editor (function icon). Select the lightning icon to open the dynamic content list, and select the field named **Partition Name**.

     :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/send-email-action-details.png" alt-text="Screenshot shows dynamic content list and selected field for Partition Name property.":::

     Later, in the batch sender, you can specify a unique partition key that divides the target batch into logical subsets where you can send messages. Each set has a unique number that's generated by the batch sender logic app workflow. This capability lets you use a single batch with multiple subsets and define each subset with the name that you provide.

     > [!IMPORTANT]
     >
     > A partition has a limit of 5,000 messages or 80 MB. If either condition is met, Azure Logic Apps 
     > might release the batch, even when your defined release condition isn't met.

   * Select inside the **Body** box, select the lightning icon to open the dynamic content list, and select the **Message Message Id** field.

     The workflow designer automatically adds a **For each** loop around the send email action because that action treats the output from the previous action as a collection, rather than a batch.

     The following example shows the information pane after you select the **For each** title box on the designer where **Batched Items** is the collection name:

     :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/send-email-action-details-for-each.png" alt-text="Screenshot shows Batched Items collection with previous operation outputs.":::

1. Save your workflow. You've now created a batch receiver.

   > [!IMPORTANT]
   >
   > If you're using Visual Studio Code, before you continue to the next section, make sure that you first 
   > [*deploy* your batch receiver logic app resource to Azure](/azure/logic-apps/quickstart-create-logic-apps-visual-studio-code). 
   > Otherwise, you can't select the batch receiver logic app workflow when you create the batch sender logic app workflow.

<a name="batch-sender"></a>

## Create batch sender

Now create one or more batch sender logic app workflows that send messages to the batch receiver logic app workflow. In each batch sender, you specify the batch receiver and batch name, message content, and any other settings. You can optionally provide a unique partition key to divide the batch into logical subsets for collecting messages with that key.

* Make sure that you previously [created and deployed your batch receiver](#batch-receiver) so when you create your batch sender, you can select the existing batch receiver as the destination batch. While batch receivers don't need to know anything about batch senders, batch senders must know where to send messages.

* Make sure that your batch receiver and batch sender share the same Azure region *and* Azure subscription. If they don't, you can't select the batch receiver when you create the batch sender because they're not visible to each other.

1. Create another logic app resource and workflow named **BatchSender**.

   > [!NOTE]
   >
   > If you have a Standard logic app resource, make sure to create a stateful workflow, not a 
   > stateless workflow because the **Recurrence** trigger is unavailable for stateless workflows.

1. [Follow these general steps to add the **Schedule** trigger named **Recurrence**](create-workflow-with-trigger-or-action.md#add-trigger).

   This example sets the interval and frequency to run the sender workflow every minute.

1. Add a new action for sending messages to a batch.

   1. Under the **Recurrence** trigger, select the plus (**+**) sign > **Add new action**.

   1. [Follow these general steps to add a **Batch Operations** action named **Send to batch trigger workflow** (Consumption workflow) or **Send to batch** (Standard workflow)](create-workflow-with-trigger-or-action.md#add-action).

   1. Based on whether you have a Consumption workflow or Standard workflow, follow the corresponding steps:

      **Consumption workflow**

      After you add the **Send to batch trigger workflow** action, a list appears and shows only the logic app resources with batch triggers that exist in the same Azure subscription *and* Azure region as your batch sender logic app resource.

      1. From the logic apps list, select the previously created logic app to use as the batch receiver. When the available triggers appear, select the trigger named **Batch_messages**.

         :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-select-batch-receiver-consumption.png" alt-text="Screenshot shows Consumption workflow with Recurrence trigger and batch sender action that selects a batch receiver logic app resource and trigger.":::

         > [!IMPORTANT]
         >
         > If you're using Visual Studio Code, and you don't see any batch receivers to select, check that 
         > you previously created and deployed your batch receiver to Azure. If you haven't, learn 
         > [how to deploy your batch receiver logic app resource to Azure](/azure/logic-apps/quickstart-create-logic-apps-visual-studio-code).

      1. When you're done, select **Add action**.

      **Standard workflow**

      After you add the **Send to batch** action, the action pane shows the following properties in the next step for you to specify the batch name, message content, workflow name, and trigger name. You can specify information only for a batch receiver logic app workflow with a batch trigger that exists in the same Azure subscription *and* Azure region as your batch sender logic app.

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-standard.png" alt-text="Screenshot shows Standard workflow with Recurrence trigger and action named Send to batch.":::

1. Set the following batch receiver action properties:

   | Property | Description |
   |----------|-------------|
   | **Batch Name** | The batch name defined by the receiver logic app, which is **TestBatch** in this example <br><br>**Important**: The batch name gets validated at runtime and must match the name specified by the batch receiver logic app. Changing the batch name causes the batch sender to fail. |
   | **Message Content** | The content for the message you want to send. See the following example for the value to use. |
   | **Workflow Name** <br>(Standard workflows only) | The name for the workflow that has the batch trigger. |
   | **Trigger Name** | The name for the batch trigger in the batch receiver logic app workflow. In Consumption workflows, this value is automatically populated from the selected batch receiver logic app. |
   | **Workflow Id** | The ID for the workflow that has the batch trigger name batch receiver logic app workflow. In Consumption workflows, this value is automatically populated from the selected batch receiver logic app. |

   In this example, for the **Message Content** property value, add the following expression, which inserts the current date and time into the message content that you send to the batch:

   1. Select inside the **Message Content** box to view the options for dynamic content (lightning icon) and expression editor (function icon).

   1. Select the function icon to open the expression editor.

   1. In the editor, enter the function named **utcnow()**, and select **Add**.

      **Consumption workflow**

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-details-consumption.png" alt-text="Screenshot shows Consumption workflow, batch sender action pane, Message Content box with cursor, expression editor with utcNow function, and other details.":::

      **Standard workflow**

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-details-standard.png" alt-text="Screenshot shows Standard workflow, batch sender action pane, Message Content box with cursor, expression editor with utcNow function, and other details.":::

1. Now set up a partition for the batch.

   1. In the batch sender action pane, from the **Advanced parameters** list, and select the following properties:

      | Property | Description |
      |----------|-------------|
      | **Partition Name** | An optional unique partition key to use for dividing the target batch into logical subsets and collect messages based on that key. <br><br>For this example, see the following steps to add an expression that generates a random number between one and five. |
      | **Message Id** | An optional message identifier that is a generated globally unique identifier (GUID) when empty. For this example, leave this value empty. |

   1. Select inside the **Partition Name** box, and select the option for the expression editor (function icon).

   1. In the expression editor, enter the function **rand(1,6)**, and select **Add**.

      This example generates a number between one and five. So, you're dividing this batch into five numbered partitions, which this expression dynamically sets.

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-partition.png" alt-text="Screenshot shows function named rand for dividing batch into partitions.":::

      When you're done, your batch sender workflow now looks similar to the following example, based on your logic app workflow type:

      **Consumption workflow**

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-finished-consumption.png" alt-text="Screenshot shows finished batch sender Consumption logic app workflow.":::

      **Standard workflow**

      :::image type="content" source="media/logic-apps-batch-process-send-receive-messages/batch-sender-finished-standard.png" alt-text="Screenshot shows finished batch sender Standard logic app workflow.":::

1. Save your workflow.

## Test your workflows

To test your batching solution, leave your logic app workflows running for a few minutes. Soon, you start getting emails in groups of five, all with the same partition key.

Your batch sender logic app runs every minute and generates a random number between one and five. The batch sender uses this random number as the partition key for the target batch where you send the messages. Each time the batch has five items with the same partition key, your batch receiver logic app fires and sends mail for each message.

> [!IMPORTANT]
>
> When you're done testing, make sure that you disable or delete your **BatchSender** 
> logic app workflow to stop sending messages and avoid overloading your inbox.

## Related content

* [Batch and send EDI messages](/azure/logic-apps/logic-apps-scenario-edi-send-batch-messages)
