---
 title: Register the Event Grid resource provider
 description: Include file that describes how to register the Event Grid resource provider in the Azure portal.
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 03/31/2022
 ms.author: spelluru
 ms.custom: include file
---

## Register the Event Grid resource provider
Unless you used Event Grid before, you need to register the Event Grid resource provider. If you used Event Grid before, skip to the next section.

In the Azure portal, follow these steps:

1. On the left menu, select **Subscriptions**.
1. Select the subscription you want to use for Event Grid from the subscription list.  
1. On the **Subscription** page, under **Settings** on the left menu, select **Resource providers**. 
1. Search for **Microsoft.EventGrid**, and confirm that the **Status** is **NotRegistered**. 
1. Select **Microsoft.EventGrid** in the provider list. 
1. On the command bar, select **Register**. 

    :::image type="content" source="./media/register-provider/register-provider.png" alt-text="Screenshot that shows the registration of the Microsoft.EventGrid provider with an Azure subscription." lightbox="./media/register-provider/register-provider.png":::
1. Refresh to make sure the status of **Microsoft.EventGrid** changed to **Registered**. 

    :::image type="content" source="./media/register-provider/registered.png" alt-text="Screenshot that shows the successful registration of the Microsoft.EventGrid provider with an Azure subscription." lightbox="./media/register-provider/registered.png":::

