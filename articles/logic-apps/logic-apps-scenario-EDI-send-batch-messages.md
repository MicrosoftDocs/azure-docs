---
title: Batch process EDI messages as a group or collection - Azure Logic Apps | Microsoft Docs
description: Send EDI messages for batch processing in logic apps
keywords: batch, batch process, batch encode
author: divswa
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/21/2017
ms.author: LADocs; estfan; divswa
---

# Send X12 messages in batch to trading partners

In business to business (B2B), partners often exchange messages in a group or a batch. To send messages in a batch or group to trading partners, you can create batch with multiple items and then use X12 batch action to process those items as a batch.


Batching for X12 messages, like other messages, uses batch trigger and action. In addtion, for X12, the batch goes through X12 Encode step before it can be sent to partner or any other destination. The batch trigger and action are covered in detail in [batching document](logic-apps-batch-process-send-receive-messages.md), and this document focuses on X12 batch processing.

This topic shows you how you can process X12 messages as a batch by performing these tasks:
* [Create a logic app that receives items and creates a batch](#receiver). This "receiver" logic app does two things:
 
   * Specifies the batch name and release criteria to meet before releasing the items as a batch.

   * Processes or encodes the items in batch using specified X12 agreeement.

* [Create a logic app that sends items to a batch](#sender). This "sender" logic app specifies where to send items to be batched, which must be an existing receiver logic app


## Before you start

To follow this example, you need these items:

* An Azure subscription. If you don't have a subscription, you can 
[start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* An [integration account](logic-apps-enterprise-integration-create-integration-account.md) that's already defined and associated with you Azure subscription

* At least two [partners](logic-apps-enterprise-integration-partners.md) that are defined in your integration account and configured with the X12 identifier under Business Identities

* An [X12 agreement](logic-apps-enterprise-integration-x12.md) that's already defined in your integration account

<a name="receiver"></a>

## Create a logic app that receives X12 messages and creates a batch

Before you can send messages to a batch, you must first create a "receiver" logic app with the **Batch** trigger. 
That way, you can select this receiver logic app when you create the sender logic app. 
For the receiver, you specify the batch name, release criteria, X12 agreement and other settings. 


1. In the [Azure portal](https://portal.azure.com), create a logic app with this name: "BatchX12Messages" 

2. In Logic Apps Designer, add the **Batch** trigger, which starts your logic app workflow. In the search box, enter "batch" as your filter. 
Select this trigger: **Batch – Batch messages**.

   ![Add Batch trigger](./media/logic-apps-scenario-EDI-send-batch-messages/add-batch-receiver-trigger.png)

3. Provide a name for the batch, 
and specify criteria for releasing the batch, for example:

   * **Batch Name**: The name used to identify the batch, 
   which is "TestBatch" in this example.
   * **Release Criteria**: The batch release criteria, which can be based on the message count, schedule, or both.
   
     ![Provide Batch trigger details](./media/logic-apps-batch-process-send-receive-messages/receive-batch-release-criteria.png)

   * **Message Count**: The number of messages to hold as a batch 
   before releasing for processing, which is "5" in this example.

     ![Provide Batch trigger details](./media/logic-apps-batch-process-send-receive-messages/receive-batch-count-based.png)

   * **Schedule**: The batch release schedule for processing, which is "every 10 minutes" in this example.

     ![Provide Batch trigger details](./media/logic-apps-scenario-EDI-send-batch-messages/receive-batch-schedule-based.png)


4. Add another action that takes the grouped or batches messages, encodes them and creates X12 batched message. 

   a. Select **+ New Step** > **Add an action**.

   b. In the search box, enter "X12 batch" as your filter and choose the action for X12 Batch Encode. Like X12 Encode, there are two variations of this actions. You can choose either of them.

   ![Select X12 Batch Encode Action](./media/logic-apps-scenario-EDI-send-batch-messages/add-batch-encode-action.png)
   
5. Set the properties for the action you just added.

   * In the Agreement box, select the agreement from the drop-down list. If your list is empty, check to ensure you have created a connection to your integration account.

   * In the Batch Name box, slect the batch from from the dynamic content picker
   
   * In the Partition box, select Parition Name from the dynamic content picker

   * In the Items box, select the Batched Items from the dynamic content picker

   ![Batch Encode Action Details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-encode-action-details.png)

6. For testing purposes, we are going to add HTTP action to send the batched message to request bin. 

   * Add HTTP as filter in the search box and select the action
    
     ![Select HTTP action](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receive-add-http-action.png)

   * In Method box select POST, in Uri generate and provide the request bin Uri. In Body select Body from the dynamic content picker

     ![Provide HTTP action details](./media/logic-apps-scenario-EDI-send-batch-messages/batch-receive-add-http-action-details.png)

7.  Now that you created receiver logic app, save your logic app.

    ![Save your logic app](./media/logic-apps-scenario-EDI-send-batch-messages/save-batch-receiver-logic-app.png)

<a name="sender"></a>

## Create logic apps that sends X12 messages to a batch

Now create one or more logic apps that send items to the 
batch defined by the receiver logic app. For the sender, 
you specify the receiver logic app and batch name, message content, 
and any other settings. You can optionally provide a unique partition
key to divide the batch into subsets to collect items with that key.

Sender logic apps need to know where to send items, 
while receiver logic apps don't need to know anything about the senders.


1. Create another logic app with this name: "X12MessageSender". Add the Request trigger to your Logic App 
   
   ![Add Request Trigger](./media/logic-apps-scenario-EDI-send-batch-messages/add-request-trigger-sender.png)

   
2. Add a new step for sending messages to a batch.

   * Choose **+ New Step** > **Add an action**.

   * In the search box, enter "batch" as your filter. 

3. Select this action:**Send messages to batch – Choose a Logic Apps workflow with batch trigger**

   ![Select "Send messages to batch"](./media/logic-apps-scenario-EDI-send-batch-messages/send-messages-batch-action.png)

4. Now select your "BatchX12Messages" logic app that you previously created, which now appears as an action.

   ![Select "batch receiver" logic app](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-select-batch-receiver.png)

   > [!NOTE]
   > The list also shows any other logic apps that have batch triggers.

5. Set the batch properties.

   * **Batch Name**: The batch name defined by the receiver logic app, 
   which is "TestBatch" in this example and is validated at runtime.

     > [!IMPORTANT]
     > Make sure that you don't change the batch name, 
     > which must match the batch name that's specified by the receiver logic app.
     > Changing the batch name causes the sender logic app to fail.

   * **Message Content**: The message content that you want to send to the batch
   
   ![Set batch properties](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-select-batch-properties.png)

6. Save your logic app. Your sender logic app now looks similar to this example:

   ![Save your sender logic app](./media/logic-apps-scenario-EDI-send-batch-messages/send-batch-finished.png)

## Test your logic apps

To test your batching solution, 
post X12 messages to your sender logic app from postman or other similar tool. 
Soon, you should start getting X12 messages in batch size of 5 or every 10 minutes, in your request bin, 
all with the same partition key.

## Next steps

* [Build on logic app definitions by using JSON](../logic-apps/logic-apps-author-definitions.md)
* [Build a serverless app in Visual Studio with Azure Logic Apps and Functions](../logic-apps/logic-apps-serverless-get-started-vs.md)
* [Exception handling and error logging for logic apps](../logic-apps/logic-apps-scenario-error-and-exception-handling.md)
