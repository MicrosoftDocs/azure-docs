---
title: Message Analysis with Azure OpenAI
titleSuffix: Azure Communication Services
description: "In this quickstart, you learn how to enable message analysis with Azure OpenAI"
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
   Follow the instructions on the [Azure Communication Services and Azure Cognitive Services Integration page](../../../../communication-services/concepts/call-automation/azure-communication-services-azure-cognitive-services-integration) to set up the connection between your Azure Communication Services and Azure OpenAI Services.

2. **Enable Message Analysis:**
   - Go to the **Channels** page of the **Advanced Messaging** tab in your Azure Communication Services resource.

     :::image type="content" source="./media/message-analysis/channels-page.png" lightbox="./media/message-analysis/channels-page.png" alt-text="Screenshot that shows the channels page.":::
   

   - Click on the channel you would like to enable message analysis on and a channel details page should pop up.

     :::image type="content" source="./media/message-analysis/channel-details-list.png" lightbox="./media/message-analysis/channel-details-list.png" alt-text="Screenshot that shows the channel details page.":::


   - Toggle on **Allow Message Analysis**, select one of the connected Azure OpenAI services and select the desired deployment model for the message analysis feature. Then click **Save** button.

     :::image type="content" source="./media/message-analysis/enable-message-analysis.png" lightbox="./media/message-analysis/enable-message-analysis.png" alt-text="Screenshot that shows how to enable message analysis.":::


3. **Set Up Event Grid Subscription:**
   - Follow the instruction on [Handle Advanced Messaging events](../whatsapp/handle-advanced-messaging-events.md)
   - Create an Event Grid subscription for `advancedmessageanalysiscompleted` event.
      
      :::image type="content" source="./media/message-analysis/create-event-subscription-message-analysis.png" lightbox="./media/message-analysis/create-event-subscription-message-analysis.png" alt-text="Screenshot that shows how to create message analysis event subscription properties.":::
      
4. **See Message analysis in action**
   - Send a message from WhatsApp Customer to Contoso business phone number.
   
      :::image type="content" source="./media/message-analysis/send-a-message.png" lightbox="./media/message-analysis/send-a-message.png" alt-text="Screenshot that shows sending a message from Customer to Contoso.":::

5. **Receive the message analysis event**
   - Receive the message analysis event in the Event Grid Viewer that has been set up in Step 3.

      :::image type="content" source="./media/message-analysis/event-grid-viewer.png" lightbox="./media/message-analysis/event-grid-viewer.png" alt-text="Screenshot that shows message analysis event being received at Event Grid Viewer.":::

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

Advance to the next article to learn how to use Advanced Messaging SDK for WhatsApp messaging.
> [!div class="nextstepaction"]
> [Get Started With Advanced Communication Messages SDK](./get-started.md).

