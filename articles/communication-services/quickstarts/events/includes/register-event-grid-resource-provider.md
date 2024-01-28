---
author: pgrandhi
ms.service: azure-communication-services
ms.topic: include
ms.date: 01/26/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).

## Register the Event Grid Resource Provider

This article describes how to register Event Grid Resource Provider. If you have used Event Grid before in the same subscription, skip to the next section.

In the Azure portal, do the following steps:

1. On the left menu, select **Subscriptions**.
1. Select the **Subscription** you want to use for Event Grid from the subscription list.  
1. On the **Subscription** page, select **Resource providers** under **Settings** on the left menu. 
1. Search for **Microsoft.EventGrid**, and confirm that the **Status** is **Not Registered**. 
1. Select **Microsoft.EventGrid** in the provider list. 
1. Select **Register** on the command bar. 

    :::image type="content" source="../media/register-provider/register-provider.png" alt-text="Image showing the registration of Microsoft.EventGrid provider with the Azure subscription.":::

1. Refresh to make sure the status of **Microsoft.EventGrid** is changed to **Registered**. 

    :::image type="content" source="../media/register-provider/registered.png" alt-text="Image showing the successful registration of Microsoft.EventGrid provider with the Azure subscription.":::