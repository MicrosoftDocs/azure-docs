---
title: Connect Custom Question Answering with Azure OpenAI on your data 
titleSuffix: Azure AI services
description: Learn how to use Custom Question Answering with Azure OpenAI.
ms.service: azure-ai-language
author: jboback
ms.author: jboback
ms.topic: how-to
ms.date: 08/02/2023
---

# Connect Custom Question Answering with Azure OpenAI on your data 

Custom Question Answering enables you to create a conversational layer on your data based on sophisticated Natural Language Processing (NLP) capabilities with enhanced relevance using a deep learning ranker, precise answers, and end-to-end region support. Most use cases for Custom Question Answering rely on finding appropriate answers for inputs by integrating it with chat bots, social media applications and speech-enabled desktop applications. 

AI runtimes however, are evolving due to the development of Large Language Models (LLMs), such as GPT-35-Turbo and GPT-4 offered by [Azure OpenAI](../../../openai/overview.md) can address many chat-based use cases, which you may want to integrate with.

At the same time, customers often require a custom answer authoring experience to achieve more granular control over the quality and content of question-answer pairs, and allow them to address content issues in production. Read this article to learn how to integrate Azure OpenAI On Your Data (Preview) with question-answer pairs from your Custom Question Answering project, using your project's underlying Azure Cognitive Search indexes.

## Prerequisites

* An existing Azure OpenAI resource. If you don't already have an Azure OpenAI resource, then [create one and deploy a model](../../../openai/how-to/create-resource.md).
* An Azure Language Service resource and Custom Question Answering project. If you don’t have one already, then [create one](../quickstart/sdk.md). 
    * Azure OpenAI requires registration and is currently only available to approved enterprise customers and partners. See [Limited access to Azure OpenAI Service](/legal/cognitive-services/openai/limited-access?context=/azure/ai-services/openai/context/context) for more information. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.
    * Be sure that you are assigned at least the [Cognitive Services OpenAI Contributor role](/azure/role-based-access-control/built-in-roles#cognitive-services-openai-contributor) for the Azure OpenAI resource.


## Connect Azure OpenAI on your data and question answering

1.	Sign in to [Language Studio](https://aka.ms/languageStudio) and navigate to your Custom Question Answering project with an existing deployment.

    :::image type="content" source="../media/question-answering/deployment-sources.png" alt-text="A screenshot showing a Custom Question Answering deployment." lightbox="../media/question-answering/deployment-sources.png":::

1. Select the **Azure Search** tab on the navigation menu to the left.

1. Make a note of your Azure Search details, such as Azure Search resource name, subscription, and location. You will need this information when you connect your Azure Cognitive Search index to Azure OpenAI.

    :::image type="content" source="../media/question-answering/azure-search.png" alt-text="A screenshot showing the Azure search section for a Custom Question Answering project." lightbox="../media/question-answering/azure-search.png":::

1. Navigate to [Azure OpenAI Studio](https://oai.azure.com/) and sign-in with credentials that have access to your Azure OpenAI resource.

1. Select the **Bring your own data** tile to start connecting your search index. You can also select the **Chat playground** tile.

    :::image type="content" source="../../../openai/media/quickstarts/chat-playground-card.png" alt-text="A screenshot of the Azure OpenAI Studio landing page." lightbox="../../../openai/media/quickstarts/chat-playground-card.png":::

    And on the **Assistant setup** tile, select **Add your data (preview)** > **+ Add a data source**.

    :::image type="content" source="../../../openai/media/quickstarts/chatgpt-playground-add-your-data.png" alt-text="A screenshot showing the button for adding your data in Azure OpenAI Studio." lightbox="../../../openai/media/quickstarts/chatgpt-playground-add-your-data.png":::

1. In the pane that appears, select **Azure Cognitive Search** under **Select or add data source**. This will update the screen with **Data field mapping** options depending on your data source.
        
    :::image type="content" source="../media/question-answering/data-source-selection.png" alt-text="A screenshot showing data selection options in Azure OpenAI Studio." lightbox="../media/question-answering/data-source-selection.png":::
                    

1. Select the subscription, Azure Cognitive Search service and Azure Cognitive Search Index associated with your Custom Question Answering project. Select the acknowledgment that connecting it will incur usage on your account. Then select **Next**.

    :::image type="content" source="../media/question-answering/azure-search-data-source.png" alt-text="A screenshot showing selection information for Azure Cognitive Search in Azure OpenAI Studio." lightbox="../media/question-answering/azure-search-data-source.png":::

1. On the **Index data field mapping** screen, select *answer* for **Content data** field. The other fields such as **File name**, **Title** and **URL** are optional depending on the nature of your data source.

    :::image type="content" source="../media/question-answering/data-field-mapping.png" alt-text="A screenshot showing index field mapping information for Azure Cognitive Search in Azure OpenAI Studio." lightbox="../media/question-answering/data-field-mapping.png":::

1. Select **Next**. Select a search type from the dropdown menu. You can choose **Keyword** or **Semantic**. semantic” search requires an existing semantic search configuration which may or may not be available for your project.  
    
    :::image type="content" source="../media/question-answering/data-management.png" alt-text="A screenshot showing the data management options for Azure Cognitive Search indexes." lightbox="../media/question-answering/data-management.png":::
    
1. Review the information you provided, and select **Save and close**. 

    :::image type="content" source="../media/question-answering/confirm-details.png" alt-text="A screenshot showing the confirmation screen." lightbox="../media/question-answering/confirm-details.png":::

1. Your data source has now been added. Select your model's deployment name under the **Configuration** > **Deployment** tab on the menu to the right. 

    :::image type="content" source="../media/question-answering/chat-playground.png" alt-text="A screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/question-answering/chat-playground.png":::

You can now start exploring Azure OpenAI capabilities with a no-code approach through the chat playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. You can also launch a [web app](../../..//openai/concepts/use-your-data.md#using-the-web-app) to chat with the model over the web.

## Next steps
* [Using Azure OpenAI on your data](../../../openai/concepts/use-your-data.md) 
