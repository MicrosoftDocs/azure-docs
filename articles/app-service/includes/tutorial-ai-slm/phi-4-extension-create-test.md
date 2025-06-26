---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
---

## Add the Phi-4 sidecar extension

In this section, you add the Phi-4 sidecar extension to your ASP.NET Core application hosted on Azure App Service.

1. Navigate to the Azure portal and go to your app's management page.
2. In the left-hand menu, select **Deployment** > **Deployment Center**.
3. On the **Containers** tab, select **Add** > **Sidecar extension**.
4. In the sidecar extension options, select **AI: phi-4-q4-gguf (Experimental)**.
5. Provide a name for the sidecar extension.
6. Select **Save** to apply the changes.
7. Wait a few minutes for the sidecar extension to deploy. Keep selecting **Refresh** until the **Status** column shows **Running**.

This Phi-4 sidecar extension uses a [chat completion API like OpenAI](https://platform.openai.com/docs/api-reference/chat/create) that can respond to chat completion response at `http://localhost:11434/v1/chat/completions`. For more information on how to interact with the API, see:

- [OpenAI documentation: Create chat completion](https://platform.openai.com/docs/api-reference/chat/create)
- [OpenAI documentation: Streaming](https://platform.openai.com/docs/api-reference/chat-streaming)

## Test the chatbot

1. In your app's management page, in the left-hand menu, select **Overview**.
1. Under **Default domain**, select the URL to open your web app in a browser.
1. Verify that the chatbot application is running and responding to user inputs.

    :::image type="content" source="../../media/tutorial-ai-slm-dotnet/fashion-store-assistant-live.png" alt-text="Screenshot showing the fashion assistant app running in the browser.":::

