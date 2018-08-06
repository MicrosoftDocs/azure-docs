---
title: Batch process EDI messages as a group or collection - Azure Logic Apps | Microsoft Docs
description: Send EDI messages for batch processing in logic apps
services: logic-apps
ms.service: logic-apps
author: divswarnkar
ms.author: divswa
manager: jeconnoc
ms.topic: article
ms.date: 09/21/2017
ms.reviewer: estfan, LADocs
---

# Send X12 messages in batches to trading partners with Azure Logic Apps

In business to business (B2B) scenarios, 
partners often exchange messages in groups or batches. 
By creating a batching solution with Logic Apps, 
you can send messages in batches to trading partners 
and process those messages together in batches. 
This article shows how you can batch process X12 messages by creating 
a "batch sender" logic app and a "batch receiver" logic app. 

Batching X12 messages works like batching other messages; 
you use a batch trigger that collects messages into a batch and a batch action 
that sends messages to a batch. Also, X12 batching includes an X12 encoding step 
before the messages go to the trading partner or other destination. 
To learn more about the batch trigger and action, see 
[Batch process messages](../logic-apps/logic-apps-batch-process-send-receive-messages.md).

In this article, you'll perform these tasks in the following order:

* [Create a "batch receiver" logic app](#receiver), 
which accepts and collects messages into a batch 
until your specified criteria is met for releasing 
and processing those messages. In this scenario, 
the batch receiver also encodes the messages in the batch 
by using the specified X12 agreement or partner identities.

* [Create a "batch sender" logic app](#sender), 
which send the messages to the previously created batch receiver. 

## Prerequisites

To follow this example, you need these items:

* An Azure subscription. If you don't have a subscription, you can 
[start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* An existing [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
associated with your Azure subscription

* At least two existing [partners](../logic-apps/logic-apps-enterprise-integration-partners.md) 
in your integration account. Each partner must use the X12 (Standard Carrier Alpha Code) 
qualifier as a business identity in the partner's properties.

* An existing [X12 agreement](../logic-apps/logic-apps-enterprise-integration-x12.md) 
in your integration account

<a name="receiver"></a>

## Create X12 batch receiver

Before you can send messages to a batch, 
you must first create the "batch receiver" 
logic app, which starts with the **Batch** trigger. 
That way, when you create the "batch sender" logic app, 
you can select this receiver logic app. The batch 
receiver continues collecting messages until your 
specified criteria is met for releasing and processing those messages. 
While batch receivers don't need to know anything about batch senders, 
the batch senders must know where to send messages. 

For this batch receiver, you specify the batch mode, name, 
release criteria, X12 agreement, and other settings. 

1. In the [Azure portal](https://portal.azure.com), 
create a logic app with this name: "BatchX12Messages"

2. [Link your logic app to your integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account).

3. In Logic Apps Designer, add the **Batch** trigger, 
which starts your logic app workflow. 
In the search box, enter "batch" as your filter. 
Select this trigger: **Batch messages**

   ![Add Batch trigger](./media/logic-apps-scenario-EDI-send-batch-messages/add-batch-receiver-trigger.png)

4. Set the batch receiver properties: 

   | Property | Value | Notes | 
   |----------|-------|-------|
   | **Batch Mode** | Inline |  |  
   | **Batch Name** | TestBatch | Available only with **Inline** batch mode |  
   | **Release Criteria** | Schedule based | Available only with **Inline** batch mode | 
   | **Interval** | 10 | Available only with **Schedule based** release criteria | 
   | **Frequency** | minute | Available only with **Schedule based** release criteria | 
   ||| 

   ![Provide Batch trigger details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receiver-schedule-based.png)

5. Now add an action that encodes each batch: 

   1. Under the batch trigger, choose **New step**.

   2. In the search box, enter "X12 batch" as your filter, 
   and select this action (any version): **Batch encode <*version*> - X12** 

      ![Select X12 Batch Encode action](./media/logic-apps-scenario-EDI-send-batch-messages/add-batch-encode-action.png)

   3. Set these properties for your selected action:

      | Property | Description |
      |----------|-------------|
      | **Name of X12 agreement** | Select your existing agreement. <p>If your list is empty, make sure you [link your logic app to the integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account) that has the agreement you want. | 
      | **Batch Name** | Click inside this box, and after the dynamic content list appears, select the **Batch Name** token. | 
      | **Partition Name** | Click inside this box, and after the dynamic content list appears, select the **Partition Name** token. | 
      | **Items** | Click inside this box, and after the dynamic content list appears, select the **Batched Items** token. | 
      ||| 

      ![Batch Encode action details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-encode-action-details.png)

6. For testing purposes, add an HTTP action for sending the batched message to 
[Request Bin service](https://requestbin.fullcontact.com/). 

   1. Enter "HTTP" as your filter in the search box. Select this action: **HTTP - HTTP**
    
      ![Select HTTP action](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receive-add-http-action.png)

   2. From the **Method** list, select **POST**. For the **Uri** box, generate a URI for your request bin and enter that URI. In the 
   **Body** box, when the dynamic list opens, select the **Body** field under the **Batch encode by agreement name** section. If you don't see **Body**, choose **See more** next to **Batch encode by agreement name**.

      ![Provide HTTP action details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receive-add-http-action-details.png)

7.  Now that you created a receiver logic app, save your logic app.

    ![Save your logic app](./media/logic-apps-scenario-EDI-send-batch-messages/save-batch-receiver-logic-app.png)

    > [!IMPORTANT]
    > A partition has a limit of 5,000 messages or 80 MB. 
    > If either condition is met, the batch might be released, 
    > even when the user-defined condition is not met.

<a name="sender"></a>

## Create a logic app that sends X12 messages to a batch

Now create one or more logic apps that send items to the 
batch defined by the receiver logic app. For the sender, 
you specify the receiver logic app and batch name, message content, 
and any other settings. You can optionally provide a unique partition
key to divide the batch into subsets to collect items with that key.

Sender logic apps need to know where to send items, while receiver logic apps don't need to know anything about the senders.


1. Create another logic app with this name: "X12MessageSender". Add this trigger to your logic app: **Request / Response - Request** 
   
   ![Add the Request trigger](./media/logic-apps-scenario-EDI-send-batch-messages/add-request-trigger-sender.png)

1. Add a new step for sending messages to a batch.

   1. Choose **+ New step** > **Add an action**.

   1. In the search box, enter "batch" as your filter. 

1. Select this action: **Send messages to batch – Choose a Logic Apps workflow with batch trigger**

   ![Select "Send messages to batch"](./media/logic-apps-scenario-EDI-send-batch-messages/send-messages-batch-action.png)

1. Now select your "BatchX12Messages" logic app that you previously created, which now appears as an action.

   ![Select "batch receiver" logic app](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-select-batch-receiver.png)

   > [!NOTE]
   > The list also shows any other logic apps that have batch triggers.

1. Set the batch properties.

   * **Batch Name**: The batch name defined by the receiver logic app, 
   which is "TestBatch" in this example and is validated at runtime.

     > [!IMPORTANT]
     > Make sure that you don't change the batch name, 
     > which must match the batch name that's specified by the receiver logic app.
     > Changing the batch name causes the sender logic app to fail.

   * **Message Content**: The message content that you want to send to the batch
   
   ![Set batch properties](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-select-batch-properties.png)

1. Save your logic app. Your sender logic app now looks similar to this example:

   ![Save your sender logic app](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-finished.png)

## Test your logic apps

To test your batching solution, post X12 messages to your batch sender logic 
app from [Postman](https://www.getpostman.com/postman) or a similar tool. 
Soon, you start getting X12 messages in your request bin, 
either every 10 minutes or in batches of five, all with the same partition key.

## Next steps

* [Process messages as batches](../logic-apps/logic-apps-batch-process-send-receive-messages.md) 
