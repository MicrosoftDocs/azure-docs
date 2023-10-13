---
title: Azure Event Grid - Subscribe to Microsoft Entra ID events
description: This article explains how to subscribe to events published by Microsoft Entra ID via Microsoft Graph API.
ms.topic: how-to
ms.date: 10/09/2023
---

# Subscribe to events published by Microsoft Entra ID
This article describes steps to subscribe to events published by Microsoft Entra ID, a Microsoft Graph API event source. 

## High-level steps

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
1. [Enable Microsoft Entra ID events to flow to a partner topic](#enable-events-to-flow-to-your-partner-topic).
4. [Activate the partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).

[!INCLUDE [register-provider](./includes/register-provider.md)]

[!INCLUDE [authorize-verified-partner-to-create-topic](includes/authorize-verified-partner-to-create-topic.md)]

## Enable events to flow to your partner topic

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Event Grid**, and then select **Event Grid** from the search results. 
1. On the **Event Grid** page, select **Available partners** on the left menu.
1. On the **Available partners** page, select **Microsoft Entra ID**. 
1. On the **Microsoft Graph API subscription** page, follow these steps:
    1. In the **Partner Topic Details** section, follow these steps:
        1. Select the **Azure subscription** in which you want to create the partner topic.
        1. Select an Azure **resource group** in which you want to create the partner topic. 
        1. Select the **location** for the partner topic. 
        1. Enter a **name** for the partner topic.
    1. In the **Microsoft Graph API subscription details** section, follow these steps:
        1. For **Change type**, select the event or events that you want to flow to the partner topic. For example, `Microsoft.Graph.UserUpdated` and `Microsoft.Graph.UserDeleted`.
        1. For **Resource**, select the path to the Azure Graph API resource for which the events will be received. Here are a few examples:
            - `/users` for all users
            - `/users{id}` for a specific Microsoft Entra ID user
            - `/groups` for all groups
            - `/groups/{id}` for a specific Microsoft Entra ID group
        1. For **Expiration time**, specify the date and time.
        1. For **Client state**, specify a value to validate requests. 
        1. Select **Enable lifecycle events** if you want lifecycle events to be included. 
        1. Select a resource. See the [list of supported resources](/graph/webhooks-lifecycle#supported-resources).
1. Select **Review + create** at the bottom of the page. 
1. Review the settings, and select **Create**. You should see a partner topic created in the specified Azure subscription and resource group. 

[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

## Next steps
See [subscribe to partner events](subscribe-to-partner-events.md).
