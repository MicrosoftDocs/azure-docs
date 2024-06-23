---
title: include file
description: include file
author: eur
ms.reviewer: eur
ms.author: eric-urban
ms.service: azure-ai-studio
ms.topic: include
ms.date: 5/21/2024
ms.custom: include, build-2024
---

To chat with your deployed GPT model in the chat playground, follow these steps:

1. Go to your project in [Azure AI Studio](https://ai.azure.com). 
1. Select **Playgrounds** > **Chat** from the left pane.
1. Select your deployed chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/tutorials/chat/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/tutorials/chat/playground-chat.png":::

1. In the **System message** text box, provide this prompt to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the prompt for your scenario. For more information, see [the prompt catalog](../what-is-ai-studio.md#prompt-catalog).
1. Optionally, add a safety system message by selecting the **Add section** button, then **Safety system messages**. Choose from the prebuilt messages, and then edit them to your needs.
    :::image type="content" source="../media/tutorials/chat/safety-system-message.png" alt-text="Screenshot of the Safety system message menu item.":::
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "How much do the TrailWalker hiking shoes cost", and then select the right arrow icon to send.

    :::image type="content" source="../media/tutorials/chat/chat-without-data.png" alt-text="Screenshot of the first chat question without grounding data." lightbox="../media/tutorials/chat/chat-without-data.png":::

1. The assistant either replies that it doesn't know the answer or provides a generic response. For example, the assistant might say, "The price of TrailWalker hiking shoes can vary depending on the brand, model, and where you purchase them." The model doesn't have access to current product information about the TrailWalker hiking shoes. 

    :::image type="content" source="../media/tutorials/chat/assistant-reply-not-grounded.png" alt-text="Screenshot of the assistant's reply without grounding data." lightbox="../media/tutorials/chat/assistant-reply-not-grounded.png":::
