---
title: Azure Event Grid - Subscribe to Microsoft Entra ID events
description: This article explains how to subscribe to events published by Microsoft Entra ID using the Azure Portal.
ms.topic: how-to
ms.custom: build-2024
ms.date: 05/08/2024
ms.author: jafernan
---

# Subscribe to events published by Microsoft Entra ID

This article describes steps to subscribe to events published by Microsoft Entra ID, a Microsoft Graph API event source.

## High-level steps

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Enable Microsoft Entra ID events to flow to a partner topic](#enable-events-to-flow-to-your-partner-topic).
1. [Activate the partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
1. [Subscribe to events](#subscribe-to-partner-events).

[!INCLUDE [register-provider](./includes/register-provider.md)]

## Enable events to flow to your partner topic

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Event Grid**, and then select **Event Grid** from the search results. 
1. On the **Event Grid** page, select **Available partners** on the left menu.
1. On the **Available partners** page, locate the **Microsoft Entra ID** card and select create. The **Microsoft Entra ID events - Enable Microsoft Graph API events** page is shown.
1. In the **Partner Topic Details** section, follow these steps:
    1. Select the **Azure subscription** in which you want to create the partner topic.
    1. Select an Azure **resource group** in which you want to create the partner topic. 
    1. Select the **location** for the partner topic.
    1. Enter a **name** for the partner topic.
1. In the **Microsoft Graph API subscription details** section, follow these steps:
    1. Select either **User** or **Group**.
    1. Select a **resource path pattern**. Your selection determines the resource scope for which events are received.
    1. Provide the resource identifier value (**Id**) if you selected a resource path with a placeholder for `id`.
    1. For **Change type**, select the type of event notifications you want to flow to the partner topic.
    1. For **Expiration time**, specify a date and time.
    1. For **Client state**, specify a value to validate requests.
    1. Select **Enable lifecycle events** if you want lifecycle events to be sent to your partner topic. Receiving lifecycle event allows you to know with anticipation when your Microsoft Graph API subscription is about to expire so that you can take actions for renewing it.
1. Select **Next: Partner Configuration** at the bottom of the page.
1. In the **Partner Authorizations** section, specify a default expiration time for all partner authorizations defined. You can provide a period between 1 and 365 days. You must grant your consent to the partner to create partner topics in a resource group that you designate. 
1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link.
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft.
    1. Select **MicrosoftGraphAPI**.
    1. Specify **authorization expiration time**.
    1. select **Add**.
        > [!IMPORTANT]
        > For a greater security stance, specify an expiration time that is short yet provides enough time to create your Microsoft Graph API subscription(s) and related partner topic(s). If you create several Microsoft Graph API subscriptions through this portal experience, you should account for the time it takes to create all resources. The operation fails if there is an attempt to create a partner topic after the authorization expiration time.
1. On the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom.
1. Select **Review + create** at the bottom of the page.
1. On the **Review** page, review all settings, and then select **Create**.
1. You should see a partner topic created in the specified Azure subscription and resource group.

[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-partner-events-event-enablement.md)]

## Test the event flow

You're now ready to test your Microsoft Graph API subscription, partner topic and its event subscription. According to the change type provided when you created the Microsoft Graph API subscription, create, update, or delete the resource that you're tracking. You should see an event displayed on the Event Viewer application for every resource change you make.

## Next steps

- Build your own partner event handler application
  - Use the [sample applications](subscribe-to-graph-api-events.md#samples-with-detailed-instructions) as a way to expedite your development effort. After you have your application, you can update the event subscription endpoint with your application's endpoint.
  - For production purposes, you may want to automate the creation of the Microsoft Graph API subscription and hence the partner topic. To that end, the sample applications are also a good resource. You may want to consult the code snippets in section [How to create a Microsoft Graph API subscription](subscribe-to-graph-api-events.md#how-to-create-a-microsoft-graph-api-subscription) for quick reference.
  - The sample applications also show you how to renew Microsoft Graph API subscriptions to ensure a continuous flow of events. You should understand the concepts behind subscription renewal and the APIs called in section [How to renew a Microsoft Graph API subscription](subscribe-to-graph-api-events.md#how-to-renew-a-microsoft-graph-api-subscription)