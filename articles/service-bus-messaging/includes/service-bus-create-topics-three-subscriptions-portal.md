---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 02/20/2019
 ms.author: spelluru
 ms.custom: include file
---

## Create a topic using the Azure portal
1. On the **Service Bus Namespace** page, select **Topics** on the left menu.
2. Select **+ Topic** on the toolbar. 
4. Enter a **name** for the topic. Leave the other options with their default values.
5. Select **Create**.

    ![Create topic](./media/service-bus-create-topics-subscriptions-portal/create-topic.png)

## Create subscriptions to the topic
1. Select the **topic** that you created in the previous section. 
    
    ![Select topic](./media/service-bus-create-topics-subscriptions-portal/select-topic.png)
2. On the **Service Bus Topic** page, select **Subscriptions** from the left menu, and then select **+ Subscription** on the toolbar. 
    
    ![Add subscription button](./media/service-bus-create-topics-subscriptions-portal/add-subscription-button.png)
3. On the **Create subscription** page, enter **S1** for **name** for the subscription, and then select **Create**. 

    ![Create subscription page](./media/service-bus-create-topics-subscriptions-portal/create-subscription-page.png)
4. Repeat the previous step twice to create subscriptions named **S2** and **S3**.