---
title: Migrate QnA Maker to Azure OpenAI on your data 
titleSuffix: Azure AI services
description: Learn how to migrate your QnA Maker projects to Azure OpenAI.
ms.service: azure-ai-language
author: aahill
ms.author: aahi
ms.topic: how-to
ms.date: 09/08/2023
---

# Migrate QnA Maker to Azure OpenAI on your data 

QnA Maker was designed to be a cloud-based Natural Language Processing (NLP) service that allowed users to create a natural conversational layer over their data. This service is being retired, having been replaced by [custom question answering](../../language-service/question-answering/overview.md). AI runtimes however, are evolving due to the development of Large Language Models (LLMs), such as GPT-35-Turbo and GPT-4 offered by [Azure OpenAI](../../openai/overview.md), which can address many chat-based use cases. Use this article to learn how to migrate your existing QnA Maker projects to Azure OpenAI. 


## Prerequisites

* A QnA Maker project. 
* An existing Azure OpenAI resource. If you don't already have an Azure OpenAI resource, then [create one and deploy a model](../../openai/how-to/create-resource.md).
    * Azure OpenAI requires registration and is currently only available to approved enterprise customers and partners. See [Limited access to Azure OpenAI Service](/legal/cognitive-services/openai/limited-access?context=/azure/ai-services/openai/context/context) for more information. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue.
    * Be sure that you are assigned at least the [Cognitive Services OpenAI Contributor role](/azure/role-based-access-control/built-in-roles#cognitive-services-openai-contributor) for the Azure OpenAI resource.

## Migrate to Azure OpenAI

1. Log into the [Azure portal](https://portal.azure.com/) and navigate to an existing QnA Maker project. Then select it to open the **Overview** section.

    :::image type="content" source="../media/openai/project-overview.png" alt-text="A screenshot showing a QnA Maker project in the Azure portal." lightbox="../media/openai/project-overview.png":::

1. Verify that the QnA Maker project you've selected is the one you want to migrate, including its Azure subscription and resource group. 

1. Go to the associated resource group and filter the resources by **search service** to find the associated Cognitive Search service. 

    :::image type="content" source="../media/openai/search-service.png" alt-text="A screenshot showing a QnA Maker project's search service in the Azure portal." lightbox="../media/openai/search-service.png":::

1. Select the search service and open its **Overview** section. Note down the details, such as the Azure Search resource name, subscription, and location. You will need this information when you migrate to Azure OpenAI.

    :::image type="content" source="../media/openai/search-service-details.png" alt-text="A screenshot showing a QnA Maker project's search service details in the Azure portal." lightbox="../media/openai/search-service-details.png":::

1. Navigate to the **Search management** > **Indexes** section on the left menu and note the index that you want to migrate to Azure OpenAI.

    :::image type="content" source="../media/openai/index-name.png" alt-text="A screenshot showing a search index name in the Azure portal." lightbox="../media/openai/index-name.png":::

1. Go to [Azure OpenAI Studio](https://oai.azure.com/) and select **Bring your own data**. 

    :::image type="content" source="../media/openai/studio-homepage.png" alt-text="A screenshot showing the Azure OpenAI studio." lightbox="../media/openai/studio-homepage.png":::

    You can also select **Chat playground** and then select **Add your data**.

    :::image type="content" source="../media/openai/chat-playground.png" alt-text="A screenshot showing the chat playground in Azure OPenAI studio." lightbox="../media/openai/chat-playground.png":::


1. In the pane that appears, select **Azure Cognitive Search** under **Select or add data source**. This will update the screen with **Data field mapping** options depending on your data source. Select the subscription, Azure AI Search service and Azure AI Search Index associated with your QnA maker project. Select the acknowledgment that connecting it will incur usage on your account. Then select **Next**.

    :::image type="content" source="../media/openai/azure-search-data-source.png" alt-text="A screenshot showing the data source selections in Azure OpenAI Studio." lightbox="../media/openai/azure-search-data-source.png":::

1. On the **Index data field mapping** screen, select *answer* for **Content data** field. The other fields such as **File name**, **Title** and **URL** are optional depending on the nature of your data source.

    :::image type="content" source="../media/openai/data-field-mapping.png" alt-text="A screenshot showing index field mapping information for Azure AI Search in Azure OpenAI Studio." lightbox="../media/openai/data-field-mapping.png":::

1. Select **Next**. Select a search type from the dropdown menu. You can choose **Keyword** or **Semantic**. semantic” search requires an existing semantic search configuration, which may or may not be available for your project.  
    
    :::image type="content" source="../media/openai/data-management.png" alt-text="A screenshot showing the data management options for Azure AI Search indexes." lightbox="../media/openai/data-management.png":::
    
1. Review the information you provided, and select **Save and close**. 

    :::image type="content" source="../media/openai/confirm-details.png" alt-text="A screenshot showing the confirmation screen." lightbox="../media/openai/confirm-details.png":::

1. Your data source has now been added. Select your model's deployment name under the **Configuration** > **Deployment** tab on the menu to the right. 

    :::image type="content" source="../media/openai/chat-playground-after-deployment.png" alt-text="A screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/openai/chat-playground-after-deployment.png":::

You can now start exploring Azure OpenAI capabilities with a no-code approach through the chat playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. You can also launch a [web app](../../openai/concepts/use-your-data.md#using-the-web-app) to chat with the model over the web.

## Next steps
* [Using Azure OpenAI on your data](../../openai/concepts/use-your-data.md) 
