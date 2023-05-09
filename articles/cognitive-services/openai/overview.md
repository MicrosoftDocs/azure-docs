---
title: What is Azure OpenAI Service?
titleSuffix: Azure Cognitive Services
description: Apply advanced language models to variety of use cases with Azure OpenAI
manager: nitinme
author: ChrisHMSFT
ms.author: chrhoder
ms.service: cognitive-services
ms.subservice: openai
ms.topic: overview
ms.date: 05/01/2023
ms.custom: event-tier1-build-2022
recommendations: false
keywords:  
---

# What is Azure OpenAI Service?

Azure OpenAI Service provides REST API access to OpenAI's powerful language models including the GPT-3, Codex and Embeddings model series. In addition, the new GPT-4 and ChatGPT (gpt-35-turbo) model series are now available in preview. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. Users can access the service through REST APIs, Python SDK, or our web-based interface in the Azure OpenAI Studio.

### Features overview

| Feature | Azure OpenAI |
| --- | --- |
| Models available | **NEW GPT-4 series (preview)** <br> GPT-3 base series <br>**NEW ChatGPT (gpt-35-turbo) (preview)**<br> Codex series <br> Embeddings series <br> Learn more in our [Models](./concepts/models.md) page.|
| Fine-tuning | Ada <br> Babbage <br> Curie <br> Cushman* <br> Davinci* <br> \* Currently unavailable. \*\*East US and West Europe Fine-tuning is currently unavailable to new customers. Please use US South Central for US based training|
| Price | [Available here](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) |
| Virtual network support & private link support | Yes | 
| Managed Identity| Yes, via Azure Active Directory | 
| UI experience | **Azure Portal** for account & resource management, <br> **Azure OpenAI Service Studio** for model exploration and fine tuning |
| Regional availability | East US <br> South Central US <br> West Europe |
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

### Prompts & Completions

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

### In-context learning

The models used by Azure OpenAI use natural language instructions and examples provided during the generation call to identify the task being asked and skill required. When you use this approach, the first part of the prompt includes natural language instructions and/or examples of the specific task desired. The model then completes the task by predicting the most probable next piece of text. This technique is known as "in-context" learning. These models aren't retrained during this step but instead give predictions based on the context you include in the prompt.

There are three main approaches for in-context learning: Few-shot, one-shot and zero-shot. These approaches vary based on the amount of task-specific data that is given to the model:

**Few-shot**: In this case, a user includes several examples in the call prompt that demonstrate the expected answer format and content. The following example shows a few-shot prompt where we provide multiple examples (the model will generate the last answer):

```
    Convert the questions to a command:
    Q: Ask Constance if we need some bread.
    A: send-msg `find constance` Do we need some bread?
    Q: Send a message to Greg to figure out if things are ready for Wednesday.
    A: send-msg `find greg` Is everything ready for Wednesday?
    Q: Ask Ilya if we're still having our meeting this evening.
    A: send-msg `find ilya` Are we still having a meeting this evening?
    Q: Contact the ski store and figure out if I can get my skis fixed before I leave on Thursday.
    A: send-msg `find ski store` Would it be possible to get my skis fixed before I leave on Thursday?
    Q: Thank Nicolas for lunch.
    A: send-msg `find nicolas` Thank you for lunch!
    Q: Tell Constance that I won't be home before 19:30 tonight — unmovable meeting.
    A: send-msg `find constance` I won't be home before 19:30 tonight. I have a meeting I can't move.
    Q: Tell John that I need to book an appointment at 10:30.
    A: 
```

The number of examples typically range from 0 to 100 depending on how many can fit in the maximum input length for a single prompt. Maximum input length can vary depending on the specific models you use. Few-shot learning enables a major reduction in the amount of task-specific data required for accurate predictions. This approach will typically perform less accurately than a fine-tuned model.

**One-shot**: This case is the same as the few-shot approach except only one example is provided. 

**Zero-shot**: In this case, no examples are provided to the model and only the task request is provided.

### Models

The service provides users access to several different models. Each model provides a different capability and price point.

GPT-4 models are the latest available models. These models are currently in preview. For access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/get-gpt4).

The GPT-3 base models are known as Davinci, Curie, Babbage, and Ada in decreasing order of capability and increasing order of speed.

The Codex series of models is a descendant of GPT-3 and has been trained on both natural language and code to power natural language to code use cases. Learn more about each model on our [models concept page](./concepts/models.md).

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
