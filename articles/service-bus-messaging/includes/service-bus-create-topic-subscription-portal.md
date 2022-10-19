---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 10/11/2021
 ms.author: spelluru
 ms.custom: include file
---

## Create a topic using the Azure portal
1. On the **Service Bus Namespace** page, select **Topics** on the left menu.
2. Select **+ Topic** on the toolbar. 
4. Enter a **name** for the topic. Leave the other options with their default values.
5. Select **Create**.

    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-topic.png" alt-text="Image showing the Create topic page.":::

## Create a subscription to the topic
1. Select the **topic** that you created in the previous section. 
    
    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/select-topic.png" alt-text="Image showing the selection of topic from the list of topics.":::
2. On the **Service Bus Topic** page, select **+ Subscription** on the toolbar. 

    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/add-subscription-button.png" alt-text="Image showing the Add subscription button.":::    
3. On the **Create subscription** page, follow these steps:
    1. Enter **S1** for **name** of the subscription.
    1. Enter **3** for **Max delivery count**.
    1. Then, select **Create** to create the subscription. 

        :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-subscription-page.png" alt-text="Image showing the Create subscription page.":::
