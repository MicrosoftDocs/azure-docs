---
 title: Create a topic and three subscriptions
 description: Provides instructions to create a topic and three subscriptions to the topic. 
 author: spelluru
 ms.service: azure-service-bus
 ms.topic: include
 ms.date: 06/18/2025
 ms.author: spelluru
 ms.custom: include file
---

## Create a topic using the Azure portal

1. On the **Service Bus Namespace** page, expand **Entities** on the navigational menu to the left, and select **Topics**.
1. Select **+ Topic**. 
1. Enter a **name** for the topic. Leave the other options with their default values.
1. Select **Create**.

   :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-topic.png" lightbox="./media/service-bus-create-topics-subscriptions-portal/create-topic.png" alt-text="Screenshot of the Create topic page.":::

## Create subscriptions to the topic

1. Select the **topic** that you created in the previous section. 
    
   :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/select-topic.png" lightbox="./media/service-bus-create-topics-subscriptions-portal/select-topic.png" alt-text="Screenshot of the Topics page with your topic selected.":::

1. On the **Service Bus Topic** page, select **+ Subscription**. 

    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/add-subscription-button.png" alt-text="Screenshot of the Subscriptions page with the Add subscription button selected." lightbox="./media/service-bus-create-topics-subscriptions-portal/add-subscription-button.png":::

1. On the **Create subscription** page, follow these steps:

   1. Enter *S1* as the name of the subscription.
   1. Then, select **Create** to create the subscription. 

      :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-subscription-page.png" alt-text="Screenshot of the Create subscription page.":::

1. Repeat the previous step twice to create subscriptions named *S2* and *S3*.