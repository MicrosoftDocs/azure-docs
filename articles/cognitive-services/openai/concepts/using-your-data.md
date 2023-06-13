---
title: 'Azure OpenAI on your data - Using your data with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Use this article to learn about using your data for better text generation in Azure OpenAI.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: quickstart
author: aahill
ms.author: aahi
ms.date: 06/01/2023
recommendations: false
---

# Azure OpenAI on your data (Preview)

Azure OpenAI on your data enables you to run OpenAI models such as ChatGPT and GPT-4 on your data without needing to train or fine-tune models. Running Azure OpenAI models on your data enables you to chat on top of, and analyze your data with greater accuracy and speed. By doing so, you can unlock valuable insights that can help you make better business decisions, identify trends and patterns, and optimize your operations. One of the key benefits of Azure OpenAI on your data is its conversational AI capabilities. With Azure OpenAI on your data, you can create a powerful conversational AI solution that streamlines communication, improves customer service, and boosts productivity throughout your organization. 

To get started, [connect your data source](../use-your-own-data.md) using [Azure AI studio](https://oai.azure.com/) and start asking questions and chatting on your data.

Because the model has access to, and can reference specific sources to support its responses, answers are not only based on its pre-trained knowledge but also on the latest available information. This grounding data also helps the model avoid generating responses based on outdated or incorrect information.

> [!NOTE]
> To get started, you need to already have been approved for [Azure OpenAI access](../overview.md#how-do-i-get-access-to-azure-openai) and have an [Azure OpenAI Service resource](../how-to/create-resource.md) with either the gpt-35-turbo or the gpt-4 models deployed.

## What is Azure OpenAI on your data

Azure OpenAI on your data provides access to OpenAI's powerful ChatGPT (gpt-35-turbo) and GPT-4 language models, enabling them to provide responses based on your data. You can access Azure OpenAI on your data using REST APIs, Python SDK, or the web-based interface in the [Azure AI studio](https://oai.azure.com/) to create a solution that connects to your data and provides a chat experience. 

One of the key features of Azure OpenAI on your data is its ability to retrieve and utilize data in a way that enhances the model's output. When using Azure OpenAI on your data, the service determines what data to be retrieved based on the user query and conversation history. This data is then augmented and resubmitted as a prompt to the OpenAI model, with the new information being appended to the original prompt. Although data is being appended to the prompt, the resulting input is still processed by the model like any other prompt, in accordance with the information provided by Azure OpenAI and the commitments made about prompt processing. Once the data has been retrieved and the prompt has been submitted to the model, the model uses this information to provide a completion. See the [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext) article for more information. 

## Data storage options

You can use Azure OpenAI on your data when it's stored in the following data sources:
* [An Azure Cognitive Search index](/azure/search/search-get-started-portal)
* [Azure Blob storage container](/azure/storage/blobs/storage-quickstart-blobs-portal)

The Azure AI portal enables you to upload files locally into a blob storage container. See the [quickstart article](../use-your-data-quickstart.md?pivots=programming-language-studio) for more information. 

## Supported Data Sources and file types

| **Data Sources** | Cognitive Search, Blob, Local file upload |
| --- | --- |
| **File Formats** | txt, md, html, Word files, PowerPoint, PDF |


### Conversation history for better results

When chatting with a model, providing a history of the chat will help the model understand the conversation and returns the high quality results. For more information, see the [Completions article](../how-to/completions.md#conversation). 


## Next steps
* [Get started using your data with Azure OpenAI](../use-your-own-data.md)
* [Introduction to prompt engineering](./prompt-engineering.md)
