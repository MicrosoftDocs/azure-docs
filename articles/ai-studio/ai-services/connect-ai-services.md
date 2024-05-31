---
title: Connect AI services to your hub in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to use AI services connections to do more via Azure AI Studio, SDKs, and APIs.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Connect AI services to your hub in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

You can try out AI services for free in Azure AI Studio as described in the [getting started with AI services](get-started.md) article. This article describes how to use AI services connections to do more via Azure AI Studio, SDKs, and APIs. 

After you create a hub with AI services, you can use the AI services connection via the AI Studio UI, APIs, and SDKs. For example, you can try out AI services via **Home** > **AI Services** in the AI Studio UI as shown here.

:::image type="content" source="../media/ai-services/ai-services-home.png" alt-text="Screenshot of the AI Services page in Azure AI Studio." lightbox="../media/ai-services/ai-services-home.png":::

## Create a hub

You need a hub to connect to AI services in Azure AI Studio. When you create a hub, a connection to AI services is automatically created.

[!INCLUDE [Create Azure AI Studio hub](../includes/create-hub.md)]

## Connect to AI services

Your hub is now created and you can connect to AI services. From the **Hub overview** page, you can see the AI services connection that was created with the hub.

:::image type="content" source="../media/how-to/hubs/hub-connected-resources.png" alt-text="Screenshot of the hub's AI services connections." lightbox="../media/how-to/hubs/hub-connected-resources.png":::

You can use the AI services connection via the AI Studio UI, APIs, and SDKs. 

### Use the AI services connection in the AI Studio UI

No further configuration is needed to use the AI services connection in the AI Studio UI. You can try out AI services via **Home** > **AI Services** in the AI Studio UI.

Here are examples of more ways to use AI services in the AI Studio UI.

- [Get started with assistants and code interpreters in the AI Studio playground](../../ai-services/openai/assistants-quickstart.md?context=/azure/ai-studio/context/context)
- [Hear and speak with chat models in the AI Studio playground](../quickstarts/hear-speak-playground.md)
- [Analyze images and videos using GPT-4 Turbo with Vision](../quickstarts/multimodal-vision.md)
- [Use your image data with Azure OpenAI](../how-to/data-image-add.md)

### Use the AI services connection in APIs and SDKs

You can use the AI services connection via the APIs and SDKs for a subset of AI services: Azure OpenAI, Speech, Language, Translator, Vision, Document Intelligence, and Content Safety.

To use the AI services connection via the APIs and SDKs, you need to get the key and endpoint for the connection.

1. From the **Home** page in AI Studio, select **All hubs** from the left pane. Then select [the hub you created](#create-a-hub).
1. Select the **AI Services** connection from the **Hub overview** page.
1. You can find the key and endpoint for the AI services connection on the **Connection details** page.
    
    :::image type="content" source="../media/how-to/hubs/hub-connected-resource-key.png" alt-text="Screenshot of the AI services connection details." lightbox="../media/how-to/hubs/hub-connected-resource-key.png":::

The AI services key and endpoint are used to authenticate and connect to AI services via the APIs and SDKs.

For more information about AI services APIs and SDKs, see the [Azure AI services SDK reference documentation](../../ai-services/reference/sdk-package-resources.md?context=/azure/ai-studio/context/context) and [Azure AI services REST API](../../ai-services/reference/sdk-package-resources.md?context=/azure/ai-studio/context/context) reference documentation.

## Related content

- [What are Azure AI services?](../../ai-services/what-are-ai-services.md?context=/azure/ai-studio/context/context)
- [Azure AI Studio hubs](../concepts/ai-resources.md)
- [Connections in Azure AI Studio](../concepts/connections.md)
