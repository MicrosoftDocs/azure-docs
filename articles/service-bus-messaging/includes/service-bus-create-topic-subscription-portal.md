---
 title: Create an Azure Service Bus topic
 description: Shows you how to create an Azure Service Bus topic in the Azure portal. 
 author: spelluru
 ms.service: azure-service-bus
 ms.topic: include
 ms.date: 01/16/2025
 ms.author: spelluru
 ms.custom: include file
---

## Create a topic using the Azure portal
1. On the **Service Bus Namespace** page, expand **Entities** on the navigational menu to the left, and select **Topics** on the left menu.
2. Select **+ Topic** on the toolbar. 
4. Enter a **name** for the topic. Leave the other options with their default values.
5. Select **Create**.

    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-topic.png" alt-text="Screenshot that shows the Create topic page in the Azure portal.":::

## Create a subscription to the topic
1. Select the **topic** that you created in the previous section. 
    
    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/select-topic.png" alt-text="Screenshot that shows the selection of topic from the list of topics.":::
2. On the **Service Bus Topic** page, select **+ Subscription** on the toolbar. 

    :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/add-subscription-button.png" alt-text="Screenshot that shows the Add subscription button on the Topic page.":::    
3. On the **Create subscription** page, follow these steps:
    1. Enter **S1** for **name** of the subscription.
    1. Then, select **Create** to create the subscription. 

        :::image type="content" source="./media/service-bus-create-topics-subscriptions-portal/create-subscription-page.png" alt-text="Screenshot that shows the Create subscription page.":::
