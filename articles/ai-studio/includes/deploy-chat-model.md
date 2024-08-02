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

Follow these steps to deploy an Azure OpenAI chat model for your copilot. 

1. Sign in to [Azure AI Studio](https://ai.azure.com) and go to the **Home** page.
1. Go to your hub by selecting it from the list of hubs via **Home** > **All hubs**. If you don't have a hub, create one. For more information, see [how to create a hub](../how-to/create-azure-ai-resource.md).
1. From the left pane, select **Deployments** > **+ Create deployment**.
    
    :::image type="content" source="../media/tutorials/chat/deploy-create.png" alt-text="Screenshot of the deployments page with a button to create a new deployment." lightbox="../media/tutorials/chat/deploy-create.png":::

1. On the **Select a model** page, select the model you want to deploy from the list of models. For example, select **gpt-35-turbo-16k**. Then select **Confirm**.

    :::image type="content" source="../media/tutorials/chat/deploy-gpt-35-turbo-16k.png" alt-text="Screenshot of the model selection page." lightbox="../media/tutorials/chat/deploy-gpt-35-turbo-16k.png":::

1. On the **Deploy model** page, enter a name for your deployment, and then select **Deploy**. After the deployment is created, you see the deployment details page. Details include the date you created the deployment and the created date and version of the model you deployed.
1. On the deployment details page from the previous step, select **Open in playground**.

    :::image type="content" source="../media/tutorials/chat/deploy-gpt-35-turbo-16k-details.png" alt-text="Screenshot of the GPT chat deployment details." lightbox="../media/tutorials/chat/deploy-gpt-35-turbo-16k-details.png":::

For more information about deploying models, see [how to deploy models](../how-to/deploy-models-openai.md).
