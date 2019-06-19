---
title: Connect to MQ server - Azure Logic Apps
description: Send and retrieve messages with an Azure or on-premises MQ server and Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: valrobb
ms.author: valthom
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 06/19/2019
tags: connectors
---

# Connect to an IBM MQ server from logic apps using the MQ connector

The IBM MQ connector sends and retrieves messages stored in an MQ server on premises or in Azure. This connector includes a Microsoft MQ client that communicates with a remote IBM MQ server across a TCP/IP network. This article provides a starter guide to use the MQ connector. You can start by browsing a single message on a queue and then try other actions.

The MQ connector includes these actions but provides no triggers:

- Browse a single message without deleting the message from the IBM MQ Server
- Browse a batch of messages without deleting the messages from the IBM MQ Server
- Receive a single message and delete the message from the IBM MQ Server
- Receive a batch of messages and delete the messages from the IBM MQ Server
- Send a single message to the IBM MQ Server

## Prerequisites

* If using an on-premises MQ server, [install the on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) on a server within your network. If the MQ server is publicly available, or available within Azure, then the data gateway is not used or required.

  > [!NOTE]
  > The server where the on-premises data gateway is installed must also have .NET Framework 4.6 installed for the MQ connector to function.

* Create the Azure resource for the on-premises data gateway. For more information, see [Set up the data gateway connection](../logic-apps/logic-apps-gateway-connection.md).

* Officially supported IBM WebSphere MQ versions:

  * MQ 7.5
  * MQ 8.0
  * MQ 9.0

* The logic app where you want to add the MQ action. This logic app must use the same location as your on-premises data gateway connection and must already have a trigger that starts your workflow. 

  The MQ connector doesn't have any triggers, so add a trigger to your logic app first, for example, the Recurrence trigger. If you're new to logic apps, try this [quickstart to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Browse a single message

1. Select **+ New step**, and select **Add an action**.

2. In the search box, type "mq", and then select this action: **Browse message**

   ![Browse message](media/connectors-create-api-mq/Browse_message.png)

3. If there isn't an existing MQ connection, then create the connection:  

   1. Select **Connect via on-premises data gateway**, and enter the properties of your MQ server.  
   For **Server**, you can enter the MQ server name, or enter the IP address followed by a colon and the port number.
    
   2. The **gateway** dropdown lists any existing gateway connections that have been configured. Select your gateway.
    
   3. Select **Create** when finished. Your connection looks similar to the following:  

      ![Connection Properties](media/connectors-create-api-mq/Connection_Properties.png)

4. In the action properties, you can:  

    * Use the **Queue** property to access a different queue name than what is defined in the connection
    * Use the **MessageId**, **CorrelationId**, **GroupId**, and other properties to browse for a message based on the different MQ message properties
    * Set **IncludeInfo** to **True** to include additional message information in the output. Or, set it to **False** to not include additional message information in the output.
    * Enter a **Timeout** value to determine how long to wait for a message to arrive in an empty queue. If nothing is entered, the first message in the queue is retrieved, and there is no time spent waiting for a message to appear.  
    ![Browse Message Properties](media/connectors-create-api-mq/Browse_message_Props.png)

5. **Save** your changes, and then **Run** your logic app:  

   ![Save and run](media/connectors-create-api-mq/Save_Run.png)

6. After a few seconds, the steps of the run are shown, and you can look at the output. Select the green checkmark to see details of each step. Select **See raw outputs** to see additional details on the output data.  

   ![Browse message output](media/connectors-create-api-mq/Browse_message_output.png)  

   Raw output:

   ![Browse message raw output](media/connectors-create-api-mq/Browse_message_raw_output.png)

7. When the **IncludeInfo** option is set to true, the following output is displayed:  

   ![Browse message include info](media/connectors-create-api-mq/Browse_message_Include_Info.png)

## Browse multiple messages

The **Browse messages** action includes a **BatchSize** option to indicate how many messages should be returned from the queue.  If **BatchSize** has no entry, all messages are returned. The returned output is an array of messages.

1. When adding the **Browse messages** action, the first connection that is configured is selected by default. Select **Change connection** to create a new connection, or select a different connection.

2. The output of Browse messages shows:  

   ![Browse messages output](media/connectors-create-api-mq/Browse_messages_output.png)

## Receive a single message

The **Receive message** action has the same inputs and outputs as the **Browse message** action. When using **Receive message**, the message is deleted from the queue.

## Receive multiple messages

The **Receive messages** action has the same inputs and outputs as the **Browse messages** action. When using **Receive messages**, the messages are deleted from the queue.

If there are no messages in the queue when doing a browse or a receive, the step fails with the following output:  
![MQ No Message Error](media/connectors-create-api-mq/MQ_No_Msg_Error.png)

## Send a message

1. When adding the **Send message** action, the first connection that is configured is selected by default. Select **Change connection** to create a new connection, or select a different connection. The valid **Message Types** are **Datagram**, **Reply**, or **Request**.  

   ![Send Msg Props](media/connectors-create-api-mq/Send_Msg_Props.png)

2. The output of Send message looks like the following:  

   ![Send Msg Output](media/connectors-create-api-mq/Send_Msg_Output.png)

## Connector reference

For technical details about actions and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/mq/).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
