---
title: Get started with AI services in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article describes how to get started with AI services in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 2/5/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Get started with AI services in Azure AI Studio

This article describes how to get started with AI services in Azure AI Studio. You can connect to AI services in Azure AI Studio to use AI capabilities such as Speech, Language, Translator, Vision, Document Intelligence, and Content Safety.

After your create a hub with AI services, you can use the AI services connection via the AI Studio UI, APIs, and SDKs. For example, you can try out AI services via **Home** > **AI Services** in the AI Studio UI as shown here.

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

### Use the AI services connection in APIs and SDKs

You can use the AI services connection via the APIs and SDKs for a subset of AI services: Speech, Language, Translator, Vision, Document Intelligence, and Content Safety.

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