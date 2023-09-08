---
title: What is Azure OpenAI Service?
titleSuffix: Azure AI services
description: Apply advanced language models to variety of use cases with Azure OpenAI
manager: nitinme
author: mrbullwinkle    
ms.author: mbullwin
ms.service: cognitive-services
ms.subservice: openai
ms.topic: overview
ms.date: 07/06/2023
ms.custom: event-tier1-build-2022, build-2023, build-2023-dataai
recommendations: false
keywords:  
---

# What is Azure OpenAI Service?

Azure OpenAI Service provides REST API access to OpenAI's powerful language models including the GPT-4, GPT-35-Turbo, and Embeddings model series. In addition, the new GPT-4 and gpt-35-turbo model series have now reached general availability. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. Users can access the service through REST APIs, Python SDK, or our web-based interface in the Azure OpenAI Studio.

### Features overview

| Feature | Azure OpenAI |
| --- | --- |
| Models available | **GPT-4 series** <br>**GPT-35-Turbo series**<br> Embeddings series <br> Learn more in our [Models](./concepts/models.md) page.|
| Fine-tuning | Ada <br> Babbage <br> Curie <br> Cushman <br> Davinci <br>**Fine-tuning is currently unavailable to new customers**.|
| Price | [Available here](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) |
| Virtual network support & private link support | Yes, unless using [Azure OpenAI on your data](./concepts/use-your-data.md).  | 
| Managed Identity| Yes, via Azure Active Directory | 
| UI experience | **Azure portal** for account & resource management, <br> **Azure OpenAI Service Studio** for model exploration and fine tuning |
| Model regional availability | [Model availability](./concepts/models.md) |
| Content filtering | Prompts and completions are evaluated against our content policy with automated systems. High severity content will be filtered. |

## Responsible AI

At Microsoft, we're committed to the advancement of AI driven by principles that put people first. Generative models such as the ones available in Azure OpenAI have significant potential benefits, but without careful design and thoughtful mitigations, such models have the potential to generate incorrect or even harmful content. Microsoft has made significant investments to help guard against abuse and unintended harm, which includes requiring applicants to show well-defined use cases, incorporating Microsoft’s <a href="https://www.microsoft.com/ai/responsible-ai?activetab=pivot1:primaryr6" target="_blank">principles for responsible AI use</a>, building content filters to support customers, and providing responsible AI implementation guidance to onboarded customers.

## How do I get access to Azure OpenAI?

How do I get access to Azure OpenAI?

Access is currently limited as we navigate high demand, upcoming product improvements, and <a href="https://www.microsoft.com/ai/responsible-ai?activetab=pivot1:primaryr6" target="_blank">Microsoft’s commitment to responsible AI</a>. For now, we're working with customers with an existing partnership with Microsoft, lower risk use cases, and those committed to incorporating mitigations. 

More specific information is included in the application form. We appreciate your patience as we work to responsibly enable broader access to Azure OpenAI.

Apply here for access:

<a href="https://aka.ms/oaiapply" target="_blank">Apply now</a>

## Comparing Azure OpenAI and OpenAI

Azure OpenAI Service gives customers advanced language AI with OpenAI GPT-4, GPT-3, Codex, and DALL-E models with the security and enterprise promise of Azure. Azure OpenAI co-develops the APIs with OpenAI, ensuring compatibility and a smooth transition from one to the other.

With Azure OpenAI, customers get the security capabilities of Microsoft Azure while running the same models as OpenAI. Azure OpenAI offers private networking, regional availability, and responsible AI content filtering.  

## Key concepts

### Prompts & completions

The completions endpoint is the core component of the API service. This API provides access to the model's text-in, text-out interface. Users simply need to provide an input  **prompt** containing the English text command, and the model will generate a text **completion**.

Here's an example of a simple prompt and completion:

>**Prompt**:
        ```
        """
        count to 5 in a for loop
        """
        ```
>
>**Completion**:
        ```
        for i in range(1, 6):
            print(i)
        ```

### Tokens

Azure OpenAI processes text by breaking it down into tokens. Tokens can be words or just chunks of characters. For example, the word “hamburger” gets broken up into the tokens “ham”, “bur” and “ger”, while a short and common word like “pear” is a single token. Many tokens start with a whitespace, for example “ hello” and “ bye”.

The total number of tokens processed in a given request depends on the length of your input, output and request parameters. The quantity of tokens being processed will also affect your response latency and throughput for the models.

### Resources

Azure OpenAI is a new product offering on Azure. You can get started with Azure OpenAI the same way as any other Azure product where you [create a resource](how-to/create-resource.md), or instance of the service, in your Azure Subscription. You can read more about Azure's [resource management design](../../azure-resource-manager/management/overview.md).

### Deployments

Once you create an Azure OpenAI Resource, you must deploy a model before you can start making API calls and generating text. This action can be done using the Deployment APIs. These APIs allow you to specify the model you wish to use.

### Prompt engineering

GPT-3, GPT-3.5, and GPT-4 models from OpenAI are prompt-based. With prompt-based models, the user interacts with the model by entering a text prompt, to which the model responds with a text completion. This completion is the model’s continuation of the input text.

While these models are extremely powerful, their behavior is also very sensitive to the prompt. This makes [prompt engineering](./concepts/prompt-engineering.md) an important skill to develop.

Prompt construction can be difficult. In practice, the prompt acts to configure the model weights to complete the desired task, but it's more of an art than a science, often requiring experience and intuition to craft a successful prompt.

### Models

The service provides users access to several different models. Each model provides a different capability and price point.

GPT-4 models are the latest available models. Due to high demand access to this model series is currently only available by request. To request access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/get-gpt4)

The DALL-E models, currently in preview, generate images from text prompts that the user provides.

Learn more about each model on our [models concept page](./concepts/models.md).

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
