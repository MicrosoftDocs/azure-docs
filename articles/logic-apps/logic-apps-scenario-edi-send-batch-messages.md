---
title: Batch process EDI messages as a group
description: Send and receive EDI messages as batches, groups, or collections by using batch processing in Azure Logic Apps.
services: logic-apps
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/04/2024
---

# Exchange EDI messages as batches or groups between trading partners in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

In business to business (B2B) scenarios, partners often exchange messages in groups or *batches*. When you build a batching solution with Azure Logic Apps, you can send messages to trading partners and process those messages together in batches. This article shows how you can batch process EDI messages, using X12 as an example, by creating a "batch sender" logic app and a "batch receiver" logic app. 

Batching X12 messages works like batching other messages. You use a batch trigger that collects messages into a batch and a batch action that sends messages to the batch. Also, X12 batching includes an X12 encoding step before the messages go to the trading partner or other destination. To learn more about the batch trigger and action, see [Batch process messages](logic-apps-batch-process-send-receive-messages.md).

In this article, you'll build a batching solution by creating two logic apps within the same Azure subscription, Azure region, and following this specific order:

* A ["batch receiver"](#receiver) logic app, which accepts and collects messages into a batch until your specified criteria is met for releasing and processing those messages. In this scenario, the batch receiver also encodes the messages in the batch by using the specified X12 agreement or partner identities.

  Make sure that you first create the batch receiver so you can later select the batch destination when you create the batch sender.

* A ["batch sender"](#sender) logic app workflow, which sends the messages to the previously created batch receiver.

Make sure that your batch receiver and batch sender logic app workflows use the same Azure subscription *and* Azure region. If they don't, you can't select the batch receiver when you create the batch sender because they're not visible to each other.

## Prerequisites

* An Azure subscription. If you don't have a subscription, you can [start with a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about how to create logic app workflows. For more information, see [Create an example Consumption logic app workflow in multitenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md).

* An existing [integration account](logic-apps-enterprise-integration-create-integration-account.md) that's associated with your Azure subscription and is linked to your logic apps.

* At least two existing [partners](logic-apps-enterprise-integration-partners.md) in your integration account. Each partner must use the X12 (Standard Carrier Alpha Code) qualifier as a business identity in the partner's properties.

* An existing [X12 agreement](logic-apps-enterprise-integration-x12.md) in your integration account.

* To use Visual Studio rather than the Azure portal, make sure you [set up Visual Studio for working with Azure Logic Apps](quickstart-create-logic-apps-with-visual-studio.md).

[!INCLUDE [api-test-http-request-tools-bullet](../../includes/api-test-http-request-tools-bullet.md)]

<a name="receiver"></a>

## Create X12 batch receiver

Before you can send messages to a batch, that batch must first exist as the destination where you send those messages. So first, you must create the "batch receiver" logic app, which starts with the **Batch** trigger. That way, when you create the "batch sender" logic app, you can select the batch receiver logic app. The batch receiver continues collecting messages until your specified criteria is met for releasing and processing those messages. While batch receivers don't need to know anything about batch senders, batch senders must know the destination where they send the messages.

For this batch receiver, you specify the batch mode, name, release criteria, X12 agreement, and other settings. 

1. In the [Azure portal](https://portal.azure.com), Visual Studio, or Visual Studio Code, create a logic app with the following name: **BatchX12Messages**

1. [Link your logic app to your integration account](logic-apps-enterprise-integration-create-integration-account.md#link-account).

1. In workflow designer, add the **Batch** trigger, which starts your logic app workflow. 

1. [Follow these general steps to add a **Batch** trigger named **Batch messages**](create-workflow-with-trigger-or-action.md?tab=consumption#add-trigger).

1. Set the batch receiver properties: 

   | Property | Value | Notes |
   |----------|-------|-------|
   | **Batch Mode** | Inline | |
   | **Batch Name** | TestBatch | Available only with **Inline** batch mode |
   | **Release Criteria** | Message count based, Schedule based | Available only with **Inline** batch mode |
   | **Message Count** | 10 | Available only with **Message count based** release criteria |
   | **Interval** | 10 | Available only with **Schedule based** release criteria |
   | **Frequency** | minute | Available only with **Schedule based** release criteria |

   ![Provide batch trigger details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receiver-release-criteria.png)

   > [!NOTE]
   >
   > This example doesn't set up a partition for the batch, so each batch 
   > uses the same partition key. To learn more about partitions, see 
   > [Batch process messages](logic-apps-batch-process-send-receive-messages.md#batch-sender).

1. Now add an action that encodes each batch:

   1. [Follow these general steps to add an **X12** action named: **Batch encode <*any-version*>**](create-workflow-with-trigger-or-action.md?tab=consumption#add-action) 

   1. If you didn't previously connect to your integration account, create the connection now. Provide a name for your connection, select the integration account you want, and then select **Create**.

      ![Create connection between batch encoder and integration account](./media/logic-apps-scenario-EDI-send-batch-messages/batch-encoder-connect-integration-account.png)

   1. Set these properties for your batch encoder action:

      | Property | Description |
      |----------|-------------|
      | **Name of X12 agreement** | Open the list, and select your existing agreement. <p>If your list is empty, make sure you [link your logic app to the integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account) that has the agreement you want. | 
      | **BatchName** | Click inside this box, and after the dynamic content list appears, select the **Batch Name** token. | 
      | **PartitionName** | Click inside this box, and after the dynamic content list appears, select the **Partition Name** token. | 
      | **Items** | Close the item details box, and then click inside this box. After the dynamic content list appears, select the **Batched Items** token. | 

      ![Batch Encode action details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-encode-action-details.png)

      For the **Items** box:

      ![Batch Encode action items](./media/logic-apps-scenario-EDI-send-batch-messages/batch-encode-action-items.png)

1. Save your logic app workflow.

1. If you're using Visual Studio, make sure that you [deploy your batch receiver logic app to Azure](quickstart-create-logic-apps-with-visual-studio.md#deploy-logic-app-to-azure). Otherwise, you can't select the batch receiver when you create the batch sender.

### Test your workflow

To make sure your batch receiver works as expected, you can add an HTTP action for testing purposes, and send a batched message to the 
[Request Bin service](https://requestbin.com/).

1. [Follow these general steps to add the **HTTP** action named **HTTP**](create-workflow-with-trigger-or-action.md?tab=consumption#add-action).

1. Set the properties for the HTTP action:

   | Property | Description |
   |----------|-------------|
   | **Method** | From this list, select **POST**. |
   | **Uri** | Generate a URI for your request bin, and then enter that URI in this box. |
   | **Body** | Click inside this box, and after the dynamic content list opens, select the **Body** token, which appears in the section, **Batch encode by agreement name**. <p>If you don't see the **Body** token, next to **Batch encode by agreement name**, select **See more**. |

   ![Provide HTTP action details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receiver-add-http-action-details.png)

1. Save your workflow.

   Your batch receiver logic app looks like the following example: 

   ![Save your batch receiver logic app](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receiver-finished.png)

<a name="sender"></a>

## Create X12 batch sender

Now create one or more logic apps that send messages to the batch receiver logic app. In each batch sender, you specify the batch receiver logic app and batch name, message content, and any other settings. You can optionally provide a unique partition key to divide 
the batch into subsets to collect messages with that key.

* Make sure that you already [created your batch receiver](#receiver). That way, when you create your batch sender, you can select the existing batch receiver as the destination batch. While batch receivers don't need to know anything about batch senders, batch senders must know where to send messages.

* Make sure that your batch receiver and batch sender logic app workflows use the same Azure subscription *and* Azure region. If they don't, you can't select the batch receiver when you create the batch sender because they're not visible to each other.

1. Create another logic app with the following name: **SendX12MessagesToBatch**

1. [Follow these general steps to add the **Request** trigger named **When a HTTP request is received**](create-workflow-with-trigger-or-action.md?tab=consumption#add-trigger).

1. To add an action for sending messages to a batch, [follow these general steps to add a **Send messages to batch** action named **Choose a Logic Apps workflow with batch trigger**](create-workflow-with-trigger-or-action.md?tab=consumption#add-action).

   1. Select the **BatchX12Messages** logic app that you previously created.

   1. Select the **BatchX12Messages** action named **Batch_messages - <*your-batch-receiver*>**.

1. Set the batch sender's properties.

   | Property | Description | 
   |----------|-------------| 
   | **Batch Name** | The batch name defined by the receiver logic app, which is "TestBatch" in this example <p>**Important**: The batch name gets validated at runtime and must match the name specified by the receiver logic app. Changing the batch name causes the batch sender to fail. | 
   | **Message Content** | The content for the message you want to send, which is the **Body** token in this example | 
   
   ![Set batch properties](./media/logic-apps-scenario-EDI-send-batch-messages/batch-sender-set-batch-properties.png)

1. Save your workflow.

   Your batch sender logic app looks like this example:

   ![Save your batch sender logic app](./media/logic-apps-scenario-EDI-send-batch-messages/batch-sender-finished.png)

## Test your workflows

To test your batching solution, post X12 messages to your batch sender logic app workflow using your HTTP request tool and its instructions. Soon, you start getting X12 messages in your request bin, either every 10 minutes or in batches of 10, all with the same partition key.

## Next steps

* [Process messages as batches](../logic-apps/logic-apps-batch-process-send-receive-messages.md) 
