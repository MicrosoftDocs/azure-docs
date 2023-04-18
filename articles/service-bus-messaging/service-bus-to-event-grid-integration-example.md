---
title: Handle Service Bus events via Event Grid using Azure Logic Apps
description: This article provides steps for handling Service Bus events via Event Grid using Azure Logic Apps.
documentationcenter: .net
author: spelluru
ms.topic: tutorial
ms.date: 12/08/2022
ms.author: spelluru
---

# Tutorial: Respond to Azure Service Bus events received via Azure Event Grid by using Azure Logic Apps
In this tutorial, you learn how to respond to Azure Service Bus events that are received via Azure Event Grid by using Azure Logic Apps. 

[!INCLUDE [service-bus-event-grid-prerequisites](./includes/service-bus-event-grid-prerequisites.md)]

## Receive messages by using Logic Apps
In this step, you create an Azure logic app that receives Service Bus events via Azure Event Grid. 

1. Create a logic app in the Azure portal.
    1. Select **+ Create a resource**, select **Integration**, and then select **Logic App**. 
    2. Select your Azure **subscription**. 
    3. Select **Use existing** for the **Resource group**, and select the resource group that you used for other resources (like Azure function, Service Bus namespace) that you created earlier. 
    1. For **Type**, select **Consumption**. 
    1. Enter a **name** for the logic app.
    1. Select the **Region** for the logic app. 
    1. Select **Review + Create**. 
    1. On the **Review + Create** page, select **Create** to create the logic app. 
    1. On the **Deployment complete** page, select **Go to resource**. 
1. On the **Logic Apps Designer** page, select **Blank Logic App** under **Templates**. 

### Add a step receive messages from Service Bus via Event Grid
1. On the designer, do the following steps:
    1. Search for **Event Grid**. 
    2. Select **When a resource event occurs - Azure Event Grid**. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-apps-event-grid-trigger.png" alt-text="Screenshot of showing the Logic Apps Designer with Event Grid trigger selected.":::
4. Select **Sign in**, enter your Azure credentials, and select **Allow Access**. 
5. On the **When a resource event occurs** page, do the following steps:
    1. Select your Azure subscription. 
    2. For **Resource Type**, select **Microsoft.ServiceBus.Namespaces**. 
    3. For **Resource Name**, select your Service Bus namespace. 
    4. Select **Add new parameter**, select **Suffix Filter**, and then move the focus outside drop-down list.
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/add-new-parameter-suffix-filter.png" alt-text="Image showing the addition of a suffix filter.":::
    1. For **Suffix Filter**, enter the name of your Service Bus topic subscription. 
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-apps-event-grid-trigger.png" alt-text="Screenshot of showing the Logic Apps Designer with connection configuration for the Service Bus namespace.":::
1. Select **+ New Step** in the designer, and do the following steps:
    1. Search for **Service Bus**.
    2. Select **Service Bus** in the list. 
    3. Select for **Get messages** in the **Actions** list. 
    4. Select **Get messages from a topic subscription (peek-lock)**. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/service-bus-get-messages-step.png" alt-text="Screenshot of showing the Logic Apps Designer with Get messages from a topic subscription selected.":::
    5. Follow these steps:
        1. Enter a **name for the connection**. For example: **Get messages from the topic subscription**. 
        1. Confirm that **Authentication Type** is set to **Access Key**.
        1. For **Connection String**, copy and paste the connection string to the Service Bus namespace that you saved earlier.
        1. Select **Create**. 
    
            :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-shared-access-key.png" alt-text="Screenshot of showing the Logic Apps Designer with the Service Bus connection string specified.":::
    8. Select your **topic** and **subscription**. 
    

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-shared-access-key.png" alt-text="Screenshot of showing the Logic Apps Designer with the Service Bus topic and subscription specified.":::

### Add a step to process and complete received messages
In this step, you'll add steps to send the received message in an email and then complete the message. In a real-world scenario, you'll process a message in the logic app before completing the message.

#### Add a foreach loop
1. Select **+ New step**.
1. Search for and then select **Control**.  

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-control.png" alt-text="Image showing selection of Control category":::
1. In the **Actions** list, select **For each**.

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-for-each.png" alt-text="Image showing selection of For each control":::    
1. For **Select an output from previous steps** (click inside text box if needed), select **Body** under **Get messages from a topic subscription (peek-lock)**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-input-for-each.png" alt-text="Image showing the selection of input to For each":::    

#### Add a step inside the foreach loop to send an email with the message body

1. Within **For Each** loop, select **Add an action**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-add-action.png" alt-text="Image showing the selection of add an action button inside the for each loop":::        
1. In the **Search connectors and actions** text box, enter **Office 365**. 
1. Select **Office 365 Outlook** in the search results. 
1. In the list of actions, select **Send an email (V2)**. 
1. In the **Send an email (V2)** window, follow these steps: 
1. Select inside the text box for **Body**, and follow these steps:
    1. For **To**, enter an email address. 
    1. For **Subject**, enter **Message received from Service Bus topic's subscription**.  
    1. Switch to **Expression**.
    1. Enter the following expression:
    
        ```
        base64ToString(items('For_each')?['ContentData'])
        ``` 
    1. Select **OK**. 
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/specify-expression-email.png" alt-text="Image showing the expression for Body of the Send an email activity.":::

#### Add another action in the foreach loop to complete the message         
1. Within **For Each** loop, select **Add an action**. 
    1. Select **Service Bus** in the **Recent** list.
    2. Select **Complete the message in a topic subscription** from the list of actions. 
    3. Select your Service Bus **topic**.
    4. Select a **subscription** to the topic.
    5. For **Lock token of the message**, select **Lock Token** from the **Dynamic content**. 

        ![Logic Apps Designer - complete the message](./media/service-bus-to-event-grid-integration-example/logic-app-complete-message.png)
8. Select **Save** on the toolbar on the Logic Apps Designer to save the logic app. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/save-logic-app.png" alt-text="Save logic app":::

## Test the app
1. If you haven't already sent test messages to the topic, follow instructions in the [Send messages to the Service Bus topic](#send-messages-to-the-service-bus-topic) section to send messages to the topic. 
1. Switch to the **Overview** page of your logic app and then switch to the **Runs history** tab in the bottom pane. You see the logic app runs messages that were sent to the topic. It could take a few minutes before you see the logic app runs. Select **Refresh** on the toolbar to refresh the page. 

    ![Logic Apps Designer - logic app runs](./media/service-bus-to-event-grid-integration-example/logic-app-runs.png)
1. Select a logic app run to see the details. Notice that it processed 5 messages in the for loop. 
    
    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-run-details.png" alt-text="Logic app run details"::: 
2. You should get an email for each message that's received by the logic app.    

## Troubleshoot
If you don't see any invocations after waiting and refreshing for sometime, follow these steps: 

1. Confirm that the messages reached the Service Bus topic. See the **incoming messages** counter on the **Service Bus Topic** page. In this case, I ran the **MessageSender** application twice, so I see 10 messages (5 messages for each run).

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/topic-incoming-messages.png" alt-text="Service Bus Topic page - incoming messages":::    
1. Confirm that there are **no active messages** at the Service Bus subscription. 
    If you don't see any events on this page, verify that the **Service Bus Subscription** page doesn't show any **Active message count**. If the number for this counter is greater than zero, the messages at the subscription aren't forwarded to the handler function (event subscription handler) for some reason. Verify that you've set up the event subscription properly. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/subscription-active-message-count.png" alt-text="Active message count at the Service Bus subscription":::    
1. You also see **delivered events** on the **Events** page of the Service Bus namespace. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/event-subscription-page.png" alt-text="Events page - delivered events" lightbox="./media/service-bus-to-event-grid-integration-example/invocation-details.png":::
1. You can also see that the events are delivered on the **Event Subscription** page. You can get to this page by selecting the event subscription on the **Events** page. 
    
    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/event-subscription-delivered-events.png" alt-text="Event subscription page - delivered events":::
## Next steps

* Learn more about [Azure Event Grid](../event-grid/index.yml).
* Learn more about [Azure Functions](../azure-functions/index.yml).
* Learn more about the [Logic Apps feature of Azure App Service](../logic-apps/index.yml).
* Learn more about [Azure Service Bus](/azure/service-bus/).


[2]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid2.png
[3]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid3.png
[7]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid7.png
[8]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid8.png
[9]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid9.png
[10]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid10.png
[11]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid11.png
[12]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12.png
[12-1]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12-1.png
[12-2]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid12-2.png
[13]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid13.png
[14]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid14.png
[15]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid15.png
[16]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid16.png
[17]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid17.png
[18]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid18.png
[20]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal.png
[21]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal2.png