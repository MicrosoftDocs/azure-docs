---
title: Azure OpenAI Service models
titleSuffix: Azure OpenAI
description: Learn about the different model capabilities that are available with Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 10/04/2023
ms.custom: event-tier1-build-2022, references_regions, build-2023, build-2023-dataai
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# Azure OpenAI Service models

Azure OpenAI Service is powered by a diverse set of models with different capabilities and price points. Model availability varies by region.  For GPT-3 and other models retiring in July 2024, see [Azure OpenAI Service legacy models](./legacy-models.md).

| Models | Description |
|--|--|
| [GPT-4](#gpt-4) | A set of models that improve on GPT-3.5 and can understand and generate natural language and code. |
| [GPT-3.5](#gpt-35) | A set of models that improve on GPT-3 and can understand and generate natural language and code. |
| [Embeddings](#embeddings-models) | A set of models that can convert text into numerical vector form to facilitate text similarity. |
| [DALL-E](#dall-e-models-preview) (Preview) | A series of models in preview that can generate original images from natural language. |
| [Whisper](#whisper-models-preview) (Preview) | A series of models in preview that can transcribe and translate speech to text. |

## GPT-4

 GPT-4 can solve difficult problems with greater accuracy than any of OpenAI's previous models. Like GPT-3.5 Turbo, GPT-4 is optimized for chat and works well for traditional completions tasks. Use the Chat Completions API to use GPT-4. To learn more about how to interact with GPT-4 and the Chat Completions API check out our [in-depth how-to](../how-to/chatgpt.md).

- `gpt-4`
- `gpt-4-32k`

You can see the token context length supported by each model in the [model summary table](#model-summary-table-and-region-availability).

## GPT-3.5

GPT-3.5 models can understand and generate natural language or code. The most capable and cost effective model in the GPT-3.5 family is GPT-3.5 Turbo, which has been optimized for chat and works well for traditional completions tasks as well. GPT-3.5 Turbo is available for use with the Chat Completions API. GPT-3.5 Turbo Instruct has similar capabilities to `text-davinci-003` using the Completions API instead of the Chat Completions API.  We recommend using GPT-3.5 Turbo and GPT-3.5 Turbo Instruct over [legacy GPT-3.5 and GPT-3 models](./legacy-models.md).

- `gpt-35-turbo`
- `gpt-35-turbo-16k`
- `gpt-35-turbo-instruct`

You can see the token context length supported by each model in the [model summary table](#model-summary-table-and-region-availability).

To learn more about how to interact with GPT-3.5 Turbo and the Chat Completions API check out our [in-depth how-to](../how-to/chatgpt.md).

## Embeddings models

> [!IMPORTANT]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.

The previous embeddings models have been consolidated into the following new replacement model:

`text-embedding-ada-002`

## DALL-E (Preview)

The DALL-E models, currently in preview, generate images from text prompts that the user provides.

## Whisper (Preview)

The Whisper models, currently in preview, can be used for speech to text.

You can also use the Whisper model via Azure AI Speech [batch transcription](../../speech-service/batch-transcription-create.md) API. Check out [What is the Whisper model?](../../speech-service/whisper-overview.md) to learn more about when to use Azure AI Speech vs. Azure OpenAI Service. 

## Model summary table and region availability

> [!IMPORTANT]
> Due to high demand:
>
> - South Central US is temporarily unavailable for creating new resources and deployments.

### GPT-4 models

GPT-4 and GPT-4-32k are now available to all Azure OpenAI Service customers.  Availability varies by region.  If you don't see GPT-4 in your region, please check back later.

These models can only be used with the Chat Completion API.

GPT-4 version 0314 is the first version of the model released.  Version 0613 is the second version of the model and adds function calling support.

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| `gpt-4` <sup>2</sup> (0314)     | East US<sup>1</sup>, France Central<sup>1</sup>  |  N/A<sup>3</sup>                 | 8,192                | September 2021         |
| `gpt-4-32k` <sup>2</sup> (0314)  |  East US<sup>1</sup>, France Central<sup>1</sup> |  N/A<sup>3</sup>                | 32,768               | September 2021         |
| `gpt-4` (0613)     |  Australia East<sup>1</sup>, Canada East, East US<sup>1</sup>, East US 2<sup>1</sup>, France Central<sup>1</sup>, Japan East<sup>1</sup>, Sweden Central, Switzerland North, UK South<sup>1</sup> |  N/A<sup>3</sup>                | 8,192                | September 2021         |
| `gpt-4-32k` (0613)  |  Australia East<sup>1</sup>, Canada East, East US<sup>1</sup>, East US 2<sup>1</sup>, France Central<sup>1</sup>, Japan East<sup>1</sup>, Sweden Central, Switzerland North, UK South<sup>1</sup> |  N/A<sup>3</sup>                | 32,768               | September 2021         |

<sup>1</sup> Due to high demand, availability is limited in the region<br>
<sup>2</sup> Version `0314` of gpt-4 and gpt-4-32k will be retired no earlier than July 5, 2024. See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.<br>
<sup>3</sup> Fine-tuning is not supported for GPT-4 models.

### GPT-3.5 models

GPT-3.5 Turbo is used with the Chat Completion API. GPT-3.5 Turbo (0301) can also be used with the Completions API.  GPT3.5 Turbo (0613) only supports the Chat Completions API.

GPT-3.5 Turbo version 0301 is the first version of the model released.  Version 0613 is the second version of the model and adds function calling support.

|  Model ID  |   Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --------- |  --------------------- | ------------------- | -------------------- | ---------------------- |
| `gpt-35-turbo`<sup>1</sup> (0301) | East US, France Central, South Central US, UK South, West Europe | N/A | 4,096 | Sep 2021 |
| `gpt-35-turbo` (0613) | Australia East, Canada East, East US, East US 2, France Central, Japan East, North Central US, Sweden Central, Switzerland North, UK South | North Central US, Sweden Central | 4,096 | Sep 2021 |
| `gpt-35-turbo-16k` (0613) | Australia East, Canada East, East US, East US 2, France Central, Japan East, North Central US, Sweden Central, Switzerland North, UK South | N/A | 16,384 | Sep 2021 |
| `gpt-35-turbo-instruct` (0914) | East US, Sweden Central | N/A | 4,097 | Sep 2021 |

<sup>1</sup> Version `0301` of gpt-35-turbo will be retired no earlier than July 5, 2024.  See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.

### Embeddings models

These models can only be used with Embedding API requests.

> [!NOTE]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.

|  Model ID  |  Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  | Output dimensions |
|  --- | --- | --- | --- | --- |
| text-embedding-ada-002 (version 2) | Australia East, Canada East, East US, East US2, France Central, Japan East, North Central US, South Central US, Switzerland North, UK South, West Europe | N/A |8,191 | Sep 2021 | 1536 |
| text-embedding-ada-002 (version 1) | East US, South Central US, West Europe | N/A |2,046 | Sep 2021 | 1536 |

### DALL-E models (Preview)

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (characters) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| dalle2 | East US | N/A | 1000 | N/A |

### Fine-tuning models (Preview)

`babbage-002` and `davinci-002` are not trained to follow instructions. Querying these base models should only be done as a point of reference to a fine-tuned version to evaluate the progress of your training.

`gpt-35-turbo-0613` - fine-tuning of this model is limited to a subset of regions, and is not available in every region the base model is available.  

|  Model ID  | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to) |
|  --- | --- | --- | --- | --- |
| `babbage-002` | North Central US, Sweden Central | 16,384 | Sep 2021 |
| `davinci-002` | North Central US, Sweden Central | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | North Central US, Sweden Central | 4096 | Sep 2021 |

### Whisper models (Preview)

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (audio file size) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| whisper | North Central US, West Europe | N/A | 25 MB | N/A |

## Next steps

- [Learn more about working with Azure OpenAI models](../how-to/working-with-models.md)
- [Learn more about Azure OpenAI](../overview.md)
- [Learn more about fine-tuning Azure OpenAI models](../how-to/fine-tuning.md)
