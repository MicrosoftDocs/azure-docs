---
title: include file
description: include file
author: eur
ms.reviewer: eur
ms.author: eric-urban
ms.service: azure-ai-studio
ms.topic: include
ms.date: 2/22/2024
ms.custom: include
---

To chat with your deployed GPT model in the chat playground, follow these steps:

1. In the playground, make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/tutorials/chat/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/tutorials/chat/playground-chat.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the prompt for your scenario. For more information, see [the prompt catalog](../what-is-ai-studio.md#prompt-catalog). 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "How much do the TrailWalker hiking shoes cost", and then select the right arrow icon to send.

    :::image type="content" source="../media/tutorials/chat/chat-without-data.png" alt-text="Screenshot of the first chat question without grounding data." lightbox="../media/tutorials/chat/chat-without-data.png":::

1. The assistant replies that it doesn't know the answer. The model doesn't have access to product information about the TrailWalker hiking shoes. 

    :::image type="content" source="../media/tutorials/chat/assistant-reply-not-grounded.png" alt-text="Screenshot of the assistant's reply without grounding data." lightbox="../media/tutorials/chat/assistant-reply-not-grounded.png":::

In the next section, you'll add your data to the model to help it answer questions about your products.
