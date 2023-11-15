---
title: Hear and speak with chat models in the Azure AI Studio playground
titleSuffix: Azure AI Studio
description: Hear and speak with chat models in the Azure AI Studio playground.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: quickstart
ms.date: 11/15/2023
ms.author: eur
---

# Quickstart: Hear and speak with chat models in the Azure AI Studio playground

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Give your app the ability to hear and speak by pairing Azure OpenAI Service with Azure AI Speech to enable richer interactions.

In this quickstart, you use Azure OpenAI Service and Azure AI Speech to:

- Speak to the assistant via speech to text.
- Hear the assistant's response via text to speech.

The speech to text and text to speech features can be used together or separately in the Azure AI Studio playground. You can use the playground to test your chat model before deploying it. 

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An Azure AI resource with a chat model deployed. For more information about model deployment, see the [resource deployment guide](../../ai-services/openai/how-to/create-resource.md).


## Configure the playground

Before you can start a chat session, you need to configure the playground to use the speech to text and text to speech features.

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio).
1. Select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. Make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/quickstarts/hear-speak/playground-config-deployment.png" alt-text="Screenshot of the chat playground with mode and deployment highlighted." lightbox="../media/quickstarts/hear-speak/playground-config-deployment.png":::

1. Select the **Playground Settings** button. 

    :::image type="content" source="../media/quickstarts/hear-speak/playground-settings-select.png" alt-text="Screenshot of the chat playground with options to get to the playground settings." lightbox="../media/quickstarts/hear-speak/playground-settings-select.png":::

    > [!NOTE]
    > You should also see the options to select the microphone or speaker buttons. If you select either of these buttons, but haven't yet enabled speech to text or text to speech, you are prompted to enable them in **Playground Settings**. 

1. On the **Playground Settings** page, select the box to acknowledge that usage of the speech feature will incur additional costs. For more information, see [Azure AI Speech pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

1. Select **Enable speech to text** and **Enable text to speech**.  

    :::image type="content" source="../media/quickstarts/hear-speak/playground-settings-enable-speech.png" alt-text="Screenshot of the playground settings page." lightbox="../media/quickstarts/hear-speak/playground-settings-enable-speech.png":::

1. Select the language locale and voice you want to use for speaking and hearing. The list of available voices depends on the locale that you select.

    :::image type="content" source="../media/quickstarts/hear-speak/playground-settings-select-language.png" alt-text="Screenshot of the playground settings page with a voice that speaks Japanese selected." lightbox="../media/quickstarts/hear-speak/playground-settings-select-language.png":::

1. Optionally you can enter some sample text and select **Play** to try the voice.

1. Select **Save**.
 

## Start a chat session

In this chat session, you use both speech to text and text to speech. You use the speech to text feature to speak to the assistant, and the text to speech feature to hear the assistant's response. 

1. Complete the steps in the [Configure the playground](#configure-the-playground) section if you haven't already done so. To complete this quickstart you need to enable the speech to text and text to speech features.
1. Select the microphone button and speak to the assistant. For example, you can say "Do you know where I can get an Xbox".

    :::image type="content" source="../media/quickstarts/hear-speak/chat-session-speaking.png" alt-text="Screenshot of the chat session with the enabled microphone icon and send button highlighted." lightbox="../media/quickstarts/hear-speak/chat-session-speaking.png":::


1. Select the send button (right arrow) to send your message to the assistant. The assistant's response is displayed in the chat session pane.

    :::image type="content" source="../media/quickstarts/hear-speak/chat-session-hear-response.png" alt-text="Screenshot of the chat session with the assistant's response." lightbox="../media/quickstarts/hear-speak/chat-session-hear-response.png":::

    > [!NOTE]
    > If the speaker button is turned on, you'll hear the assistant's response. If the speaker button is turned off, you won't hear the assistant's response, but the response will still be displayed in the chat session pane.

1. You can change the system prompt to change the assistant's response format or style. 

    For example, enter:

    ```
    "You're an AI assistant that helps people find information. Answers shouldn't be longer than 20 words because you are on a phone. You could use 'um' or 'let me see' to make it more natural and add some disfluency."
    ```

    The response is shown in the chat session pane. Since the speaker button is turned on, you also hear the response.

    :::image type="content" source="../media/quickstarts/hear-speak/chat-session-hear-response-natural.png" alt-text="Screenshot of the chat session with the system prompt edited." lightbox="../media/quickstarts/hear-speak/chat-session-hear-response-natural.png":::


## View sample code

You can select the **View Code** button to view and copy the sample code, which includes configuration for Azure OpenAI and Speech services. You can use the sample code to enable speech to text and text to speech in your application.

:::image type="content" source="../media/quickstarts/hear-speak/chat-session-view-code.png" alt-text="Screenshot of viewing the code in the playground." lightbox="../media/quickstarts/hear-speak/chat-session-view-code.png":::

> [!TIP]
> For another example, see the [speech to speech chat code example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/SpokenChat).

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

- [Create a project in Azure AI Studio](../how-to/create-projects.md)
- [Deploy a web app for chat on your data](../tutorials/deploy-chat-web-app.md)
- [Learn more about Azure AI Speech](../../ai-services/speech-service/overview.md)


