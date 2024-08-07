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

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include-document.md)]

Azure Communication Services enables you to receive Message Analysis results using your own Azure OpenAI resource.

## Prerequisites

- [Azure account with an active subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Register Event Grid Resource Provider](../../sms/handle-sms-events.md#register-an-event-grid-resource-provider).
- [Create an Azure Communication Services resource](../../create-communication-resource.md).
- [WhatsApp Channel under Azure Communication Services resource](../whatsapp/connect-whatsapp-business-account.md).
- [Azure OpenAI resource](../../../../ai-services/openai/how-to/create-resource.md).

## Setup

1. **Connect Azure Communication Services with Azure OpenAI Services:**

   a. Open your Azure Communication Services resource and click the **Cognitive Services** tab.
   b. If system-assigned managed identity isn't enabled, you'll need to enable it.
   c. In the Cognitive Services tab, click **Enable Managed Identity**.
   
      :::image type="content" source="./media/get-started/enabled-identity.png" lightbox="./media/get-started/enabled-identity.png" alt-text="Screenshot of Enable Managed Identity button.":::

   d. Enable system assigned identity. This action begins the creation of the identity. A pop-up alert notifies you that the request is being processed.
   
      :::image type="content" source="./media/get-started/enable-system-identity.png" lightbox="./media/get-started/enable-system-identity.png" alt-text="Screenshot of enable managed identity.":::

   
   e. When managed identity is enabled, the Cognitive Service tab displays a **Connect cognitive service** button to connect the two services.
   
      :::image type="content" source="./media/get-started/cognitive-services.png" lightbox="./media/get-started/cognitive-services.png" alt-text="Screenshot of Connect cognitive services button.":::

   f. Click **Connect cognitive service**, then select the Subscription, Resource Group, and Resource, and click **Connect** in the context pane.
   
      :::image type="content" source="./media/get-started/choose-options.png" lightbox="./media/get-started/choose-options.png" alt-text="Screenshot of Subscription, Resource Group, and Resource in pane.":::

2. **Enable Message Analysis:**
   a. Go to the **Channels** page of the **Advanced Messaging** tab in your Azure Communication Services resource.

     :::image type="content" source="./media/get-started/channels-page.png" lightbox="./media/get-started/channels-page.png" alt-text="Screenshot that shows the channels page.":::
   

   b. Select the channel of your choice to enable Message Analysis on. The system displays a channel details dialog.

     :::image type="content" source="./media/get-started/channel-details-list.png" lightbox="./media/get-started/channel-details-list.png" alt-text="Screenshot that shows the channel details page.":::


   c. Toggle **Allow Message Analysis**. Select one of the connected Azure OpenAI services and choose the desired deployment model for the Message Analysis feature. Then click **Save**.

     :::image type="content" source="./media/get-started/enable-message-analysis.png" lightbox="./media/get-started/enable-message-analysis.png" alt-text="Screenshot that shows how to enable Message Analysis.":::


3. **Set up Event Grid subscription:**

   Subscribe to Advanced Message Analysis Completed event by creating or modifying an event subscription. See [Subscribe to Advanced Messaging events](../whatsapp/handle-advanced-messaging-events.md#set-up-event-grid-viewer) for more details on creating event subscriptions.

      :::image type="content" source="./media/get-started/create-event-subscription-message-analysis.png" lightbox="./media/get-started/create-event-subscription-message-analysis.png" alt-text="Screenshot that shows how to create Message Analysis event subscription properties.":::
      
5. **See Message Analysis in action**
   Send a message from WhatsApp Customer to Contoso business phone number.
   
      :::image type="content" source="./media/get-started/send-a-message.png" lightbox="./media/get-started/send-a-message.png" alt-text="Screenshot that shows sending a message from Customer to Contoso.":::

6. **Receive the Message Analysis event**
   Receive the Message Analysis event in the Event Grid Viewer that you set up in Step **3**. Details on the AdvancedMessageAnalysisCompleted event schema can be found at [Azure Communication Services - Advanced Messaging events](../../../../../articles/event-grid/communication-services-advanced-messaging-events.md#microsoftcommunicationadvancedmessageanalysiscompletedpreview-event)

      :::image type="content" source="./media/get-started/event-grid-viewer.png" lightbox="./media/get-started/event-grid-viewer.png" alt-text="Screenshot that shows Message Analysis event being received at Event Grid Viewer.":::

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).


## Learn more about responsible AI
- [Message Analysis Transparency FAQ](../../../concepts/advanced-messaging/message-analysis/message-analysis-transparency-faq.md)
- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on responsible AI](https://learn.microsoft.com/training/paths/responsible-ai-business-principles)