---
title: Handle Service Bus events via Event Grid using Azure Logic Apps
description: This article provides steps for handling Service Bus events via Event Grid using Azure Logic Apps.
documentationcenter: .net
author: spelluru
ms.topic: tutorial
ms.date: 10/10/2023
ms.author: spelluru
---

# Tutorial: Respond to Azure Service Bus events received via Azure Event Grid by using Azure Logic Apps
In this tutorial, you learn how to respond to Azure Service Bus events that are received via Azure Event Grid by using Azure Logic Apps. 

[!INCLUDE [service-bus-event-grid-prerequisites](./includes/service-bus-event-grid-prerequisites.md)]

## Receive messages by using Logic Apps
In this step, you create an Azure logic app that receives Service Bus events via Azure Event Grid. 

1. Select **+ Create a resource**, select **Integration**, and then select **Logic App**. 
    
    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/create-resource-logic-app.png" alt-text="Screenshot that shows the Create a resource -> Integration -> Logic app menu.":::
1. On the **Create Logic App** page, follow these steps:
    1. Select your Azure **subscription**. 
    1. Select **Use existing** for the **Resource group**, and select the resource group that you used for other resources (like Azure function, Service Bus namespace) that you created earlier. 
    1. Enter a **name** for the logic app.
    1. Select the **Region** for the logic app. 
    1. For **Plan type**, select **Consumption**. 
    1. Select **Review + Create**. 
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/create-logic-app-page.png" alt-text="Screenshot that shows the Create a logic app page.":::
    1. On the **Review + Create** page, select **Create** to create the logic app. 
1. On the **Deployment complete** page, select **Go to resource** to navigate to the **Logic app** page.
1. On the **Logic Apps Designer** page, select **Blank Logic App** under **Templates**. 

### Add a step receive messages from Service Bus via Event Grid
1. On the **Logic app** page, select **Logic app designer** on the left menu.
1. In the right pane, under **Templates**, select **Blank Logic App**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-blank-logic-app.png" alt-text="Screenshot that shows the Logic app designer page with the Blank logic app option selected.":::
1. On the designer, do the following steps:
    1. Search for **Event Grid**. 
    2. Select **When a resource event occurs - Azure Event Grid**. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-apps-event-grid-trigger.png" alt-text="Screenshot that shows the Logic Apps Designer with Event Grid trigger selected.":::
1. Select **Sign in**.

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/designer-credentials.png" alt-text="Screenshot that shows the Logic Apps Designer with the Sign-in button selected.":::
1. On the **Sign in to your account** page, select the account you want to use to sign in to Azure. 1. 
1. On the **When a resource event occurs** page, do the following steps:
    1. Select your Azure subscription. 
    2. For **Resource Type**, select **Microsoft.ServiceBus.Namespaces**. 
    3. For **Resource Name**, select your Service Bus namespace. 
    4. Select **Add new parameter**, select **Suffix Filter**, and then move the focus outside drop-down list.
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/add-new-parameter-suffix-filter.png" alt-text="Screenshot that shows adding of a new parameter of type Suffix filter.":::
    1. For **Suffix Filter**, enter the name of your Service Bus topic subscription. 
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/suffix-filter.png" alt-text="Screenshot that shows the Logic Apps Designer with connection configuration for the Service Bus namespace.":::
1. Select **+ New Step** in the designer, and do the following steps:
    1. Search for **Service Bus**.
    2. Select **Service Bus** in the list. 
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-service-bus.png" alt-text="Screenshot that shows the selection of Service Bus.":::        
    1. Select for **Get messages** in the **Actions** list. 
    1. Select **Get messages from a topic subscription (peek-lock)**. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/service-bus-get-messages-step.png" alt-text="Screenshot that shows the Logic Apps Designer with Get messages from a topic subscription selected.":::
    5. Follow these steps:
        1. Enter a **name for the connection**. For example: **Get messages from the topic subscription**. 
        1. Confirm that **Authentication Type** is set to **Access Key**.
        1. For **Connection String**, copy and paste the connection string to the Service Bus namespace that you saved earlier.
        1. Select **Create**. 
    
            :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-shared-access-key.png" alt-text="Screenshot that shows the Logic Apps Designer with the Service Bus connection string specified.":::
    8. Select your **topic** and **subscription**. 
 
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/specify-topic-subscription.png" alt-text="Screenshot that shows the Logic Apps Designer with the Service Bus topic and subscription specified.":::

### Add a step to process and complete received messages
In this step, you add steps to send the received message in an email and then complete the message. In a real-world scenario, you process a message in the logic app before completing the message.

#### Add a foreach loop
1. Select **+ New step**.
1. Search for and then select **Control**.  

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-control.png" alt-text="Screenshot that shows the Control category.":::
1. In the **Actions** list, select **For each**.

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-for-each.png" alt-text="Screenshot that shows the For-each operation selected.":::    
1. For **Select an output from previous steps** (click inside text box if needed), select **Body** under **Get messages from a topic subscription (peek-lock)**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-input-for-each.png" alt-text="Screenshot that shows the selection of For each input.":::    

#### Add a step inside the foreach loop to send an email with the message body

1. Within **For Each** loop, select **Add an action**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-add-action.png" alt-text="Screenshot that shows the selection of Add an action button in the For-each loop.":::        
1. In the **Search connectors and actions** text box, enter **Office 365**. 
1. Select **Office 365 Outlook** in the search results. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-office-365.png" alt-text="Screenshot that shows the selection of Office 365.":::            
1. In the list of actions, select **Send an email (V2)**. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-send-email.png" alt-text="Screenshot that shows the selection of Send an email operation.":::                
1. Select **Sign in**, and follow steps to create a connection to Office 365 Outlook.
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
    
        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/specify-expression-email.png" alt-text="Screenshot that shows the expression for Body of the Send an email activity.":::

#### Add another action in the foreach loop to complete the message         
1. Within **For Each** loop, select **Add an action**. 
    1. Select **Service Bus** in the **Recent** list.
    2. Select **Complete the message in a topic subscription** from the list of actions. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/select-complete-message.png" alt-text="Screenshot that shows the selection of Complete a message in a topic subscription.":::            
    1. Select your Service Bus **topic**.
    1. Select a **subscription** to the topic.
    1. For **Lock token of the message**, select **Lock Token** from the **Dynamic content**. 

        :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-complete-message.png" alt-text="Screenshot that shows the lock token field.":::            
8. Select **Save** on the toolbar on the Logic Apps Designer to save the logic app. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/save-logic-app.png" alt-text="Screenshot that shows the Save button in the Logic app designed.":::

## Test the app
1. If you haven't already sent test messages to the topic, follow instructions in the [Send messages to the Service Bus topic](#send-messages-to-the-service-bus-topic) section to send messages to the topic. 
1. Switch to the **Overview** page of your logic app and then switch to the **Runs history** tab in the bottom pane. You see the logic app runs messages that were sent to the topic. It could take a few minutes before you see the logic app runs. Select **Refresh** on the toolbar to refresh the page. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-runs.png" alt-text="Screenshot that shows the Logic app run history." lightbox="./media/service-bus-to-event-grid-integration-example/logic-app-runs.png":::
1. Select a logic app run to see the details. Notice that it processed 5 messages in the for loop. 
    
    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/logic-app-run-details.png" alt-text="Screenshot that shows the details for the selected logic app run."::: 
2. You should get an email for each message the logic app receives.

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/received-messages.png" alt-text="Screenshot of Outlook with the messages received from the topics' subscription." lightbox="./media/service-bus-to-event-grid-integration-example/received-messages.png":::


## Troubleshoot
If you don't see any invocations after waiting and refreshing for sometime, follow these steps: 

1. Confirm that the messages reached the Service Bus topic. See the **incoming messages** counter on the **Service Bus Topic** page. In this case, I ran the **MessageSender** application once, so I see 5 messages.

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/topic-incoming-messages.png" alt-text="Screenshot that shows the Service Bus Topic page with incoming message count selected." lightbox="./media/service-bus-to-event-grid-integration-example/topic-incoming-messages.png":::    
1. Confirm that there are **no active messages** at the Service Bus subscription. 
    If you don't see any events on this page, verify that the **Service Bus Subscription** page doesn't show any **Active message count**. If the number for this counter is greater than zero, the messages at the subscription aren't forwarded to the handler function (event subscription handler) for some reason. Verify that you've set up the event subscription properly. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/subscription-active-message-count.png" alt-text="Screenshot that shows the Service Bus Subscription page with the active message count selected.":::    
1. You also see **delivered events** on the **Events** page of the Service Bus namespace. 

    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/event-subscription-page.png" alt-text="Screenshot that shows the Events page of the Service Bus Namespace page." lightbox="./media/service-bus-to-event-grid-integration-example/event-subscription-page.png":::
1. You can also see that the events are delivered on the **Event Subscription** page. You can get to this page by selecting the event subscription on the **Events** page. 
    
    :::image type="content" source="./media/service-bus-to-event-grid-integration-example/event-subscription-delivered-events.png" alt-text="Screenshot that shows the Event Subscription page with the delivered event count selected." lightbox="./media/service-bus-to-event-grid-integration-example/event-subscription-delivered-events.png":::
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