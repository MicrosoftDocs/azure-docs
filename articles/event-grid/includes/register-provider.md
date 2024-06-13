---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 03/31/2022
 ms.author: spelluru
 ms.custom: include file
---

## Register the Event Grid resource provider
Unless you've used Event Grid before, you'll need to register the Event Grid resource provider. If you’ve used Event Grid before, skip to the next section.

In the Azure portal, do the following steps: 

1. On the left menu, select **Subscriptions**.
1. Select the **subscription** you want to use for Event Grid from the subscription list.  
1. On the **Subscription** page, select **Resource providers** under **Settings** on the left menu. 
1. Search for **Microsoft.EventGrid**, and confirm that the **Status** is **Not Registered**. 
1. Select **Microsoft.EventGrid** in the provider list. 
1. Select **Register** on the command bar. 

    :::image type="content" source="./media/register-provider/register-provider.png" alt-text="Image showing the registration of Microsoft.EventGrid provider with the Azure subscription.":::
1. Refresh to make sure the status of **Microsoft.EventGrid** is changed to **Registered**. 

    :::image type="content" source="./media/register-provider/registered.png" alt-text="Image showing the successful registration of Microsoft.EventGrid provider with the Azure subscription.":::

