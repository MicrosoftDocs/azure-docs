---
title: Message Analysis with Azure OpenAI
titleSuffix: Azure Communication Services
description: "In this quickstart, you learn how to enable Message Analysis with Azure OpenAI"
author: gelli
manager: camilo.ramirez
ms.author: gelli
ms.service: azure-communication-services
ms.topic: quickstart 
ms.date: 07/05/2024
---

# Quickstart: Enable Message Analysis with Azure OpenAI

Azure Communication Services now enables you to ...

## Prerequisites

- [Azure account with an active subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Register Event Grid Resource Provider](../../sms/handle-sms-events.md#register-an-event-grid-resource-provider).
- [Create an Azure Communication Services resource](../../create-communication-resource.md).
- [WhatsApp Channel under Azure Communication Services resource](../whatsapp/connect-whatsapp-business-account.md).
- [Azure OpenAI resource](../../../../ai-services/openai/how-to/create-resource.md).

## Setup

1. **Connect Azure Communication Services with Azure OpenAI Services:**
   - To set up the connection between your Azure Communication Services and Azure OpenAI Services, follow the instructions on the [Azure Communication Services and Azure Cognitive Services Integration page](../../../../communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md#azure-portal-experience).

2. **Enable Message Analysis:**
   - Go to the **Channels** page of the **Advanced Messaging** tab in your Azure Communication Services resource.

     :::image type="content" source="./media/message-analysis/channels-page.png" lightbox="./media/message-analysis/channels-page.png" alt-text="Screenshot that shows the channels page.":::
   

   - Click on the channel you would like to enable Message Analysis on and a channel details page should pop up.

     :::image type="content" source="./media/message-analysis/channel-details-list.png" lightbox="./media/message-analysis/channel-details-list.png" alt-text="Screenshot that shows the channel details page.":::


   - Toggle **Allow Message Analysis**, select one of the connected Azure OpenAI services, then choose the desired deployment model for the Message Analysis feature. Then click **Save**.

     :::image type="content" source="./media/message-analysis/enable-message-analysis.png" lightbox="./media/message-analysis/enable-message-analysis.png" alt-text="Screenshot that shows how to enable Message Analysis.":::


3. **Set up Event Grid subscription:**

   - Subscribe to Advanced Message Analysis Completed event by creating or modifying an event subscription. See [Subscribe to Advanced Messaging events](../whatsapp/handle-advanced-messaging-events.md#set-up-event-grid-viewer) for more details on creating event subscriptions.   
      :::image type="content" source="./media/message-analysis/create-event-subscription-message-analysis.png" lightbox="./media/message-analysis/create-event-subscription-message-analysis.png" alt-text="Screenshot that shows how to create Message Analysis event subscription properties.":::
      
5. **See Message Analysis in action**
   - Send a message from WhatsApp Customer to Contoso business phone number.
   
      :::image type="content" source="./media/message-analysis/send-a-message.png" lightbox="./media/message-analysis/send-a-message.png" alt-text="Screenshot that shows sending a message from Customer to Contoso.":::

6. **Receive the Message Analysis event**
   - Receive the Message Analysis event in the Event Grid Viewer that you set up in Step **3**.

      :::image type="content" source="./media/message-analysis/event-grid-viewer.png" lightbox="./media/message-analysis/event-grid-viewer.png" alt-text="Screenshot that shows Message Analysis event being received at Event Grid Viewer.":::

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).


## Next steps

In this quickstart, you learned how to enable Message Analysis for a WhatsApp channel. Next you might also want to see the following articles:

- [Get Started With Advanced Communication Messages SDK](./get-started.md)
- [AdvancedMessaging for WhatsApp Overview](../../../concepts/advanced-messaging/whatsapp/whatsapp-overview.md)
- [Advanced Messaging for WhatsApp Terms of Services](../../../concepts/advanced-messaging/whatsapp/whatsapp-terms-of-service.md)

