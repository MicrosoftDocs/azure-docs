---
title: Azure OpenAI Service models
titleSuffix: Azure OpenAI
description: Learn about the different model capabilities that are available with Azure OpenAI.
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 03/14/2024
ms.custom: references_regions, build-2023, build-2023-dataai, refefences_regions
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
---

# Azure OpenAI Service models

Azure OpenAI Service is powered by a diverse set of models with different capabilities and price points. Model availability varies by region.  For GPT-3 and other models retiring in July 2024, see [Azure OpenAI Service legacy models](./legacy-models.md).

| Models | Description |
|--|--|
| [GPT-4](#gpt-4-and-gpt-4-turbo-preview) | A set of models that improve on GPT-3.5 and can understand and generate natural language and code. |
| [GPT-3.5](#gpt-35) | A set of models that improve on GPT-3 and can understand and generate natural language and code. |
| [Embeddings](#embeddings-models) | A set of models that can convert text into numerical vector form to facilitate text similarity. |
| [DALL-E](#dall-e-models) | A series of models that can generate original images from natural language. |
| [Whisper](#whisper-models) | A series of models in preview that can transcribe and translate speech to text. |
| [Text to speech](#text-to-speech-models-preview) (Preview) | A series of models in preview that can synthesize text to speech. |

## GPT-4 and GPT-4 Turbo Preview

 GPT-4 is a large multimodal model (accepting text or image inputs and generating text) that can solve difficult problems with greater accuracy than any of OpenAI's previous models. Like GPT-3.5 Turbo, GPT-4 is optimized for chat and works well for traditional completions tasks. Use the Chat Completions API to use GPT-4. To learn more about how to interact with GPT-4 and the Chat Completions API check out our [in-depth how-to](../how-to/chatgpt.md).

 GPT-4 Turbo with Vision is the version of GPT-4 that accepts image inputs.  It is available as the `vision-preview` model of `gpt-4`.

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

## Embeddings

 `text-embedding-3-large` is the latest and most capable embedding model. Upgrading between embeddings models is not possible. In order to move from using `text-embedding-ada-002` to `text-embedding-3-large` you would need to generate new embeddings. 

- `text-embedding-3-large`
- `text-embedding-3-small`
- `text-embedding-ada-002`

In testing, OpenAI reports both the large and small third generation embeddings models offer better average multi-language retrieval performance with the [MIRACL](https://github.com/project-miracl/miracl) benchmark while still maintaining performance for English tasks with the [MTEB](https://github.com/embeddings-benchmark/mteb) benchmark.

|Evaluation Benchmark| `text-embedding-ada-002` | `text-embedding-3-small` |`text-embedding-3-large` |
|---|---|---|---|
| MIRACL average | 31.4 | 44.0 | 54.9 |
| MTEB average | 61.0 | 62.3 | 64.6 |

The third generation embeddings models support reducing the size of the embedding via a new `dimensions` parameter. Typically larger embeddings are more expensive from a compute, memory, and storage perspective. Being able to adjust the number of dimensions allows more control over overall cost and performance. The `dimensions` parameter is not supported in all versions of the OpenAI 1.x Python library, to take advantage of this parameter  we recommend upgrading to the latest version: `pip install openai --upgrade`.

OpenAI's MTEB benchmark testing found that even when the third generation model's dimensions are reduced to less than `text-embeddings-ada-002` 1,536 dimensions performance remains slightly better.

## DALL-E

The DALL-E models generate images from text prompts that the user provides. DALL-E 3 is generally available for use with the REST APIs. DALL-E 2 and DALL-E 3 with client SDKs are in preview.

## Whisper

The Whisper models can be used for speech to text.

You can also use the Whisper model via Azure AI Speech [batch transcription](../../speech-service/batch-transcription-create.md) API. Check out [What is the Whisper model?](../../speech-service/whisper-overview.md) to learn more about when to use Azure AI Speech vs. Azure OpenAI Service.

## Text to speech (Preview)

The OpenAI text to speech models, currently in preview, can be used to synthesize text to speech.

You can also use the OpenAI text to speech voices via Azure AI Speech. To learn more, see [OpenAI text to speech voices via Azure OpenAI Service or via Azure AI Speech](../../speech-service/openai-voices.md#openai-text-to-speech-voices-via-azure-openai-service-or-via-azure-ai-speech) guide. 

## Model summary table and region availability

> [!NOTE]
> This article only covers model/region availability that applies to all Azure OpenAI customers with deployment types of **Standard**. Some select customers have access to model/region combinations that are not listed in the unified table below. These tables also do not apply to customers using only **Provisioned** deployment types which have their own unique model/region availability matrix. For more information on **Provisioned** deployments refer to our [Provisioned guidance](./provisioned-throughput.md).

### Standard deployment model availability

[!INCLUDE [Standard Models](../includes/model-matrix/standard-models.md)]

### Standard deployment model quota

[!INCLUDE [Quota](../includes/model-matrix/quota.md)]

### GPT-4 and GPT-4 Turbo Preview models

GPT-4, GPT-4-32k, and GPT-4 Turbo with Vision are now available to all Azure OpenAI Service customers.  Availability varies by region.  If you don't see GPT-4 in your region, please check back later.

These models can only be used with the Chat Completion API.

GPT-4 version 0314 is the first version of the model released.  Version 0613 is the second version of the model and adds function calling support. 

See [model versions](../concepts/model-versions.md) to learn about how Azure OpenAI Service handles model version upgrades, and [working with models](../how-to/working-with-models.md) to learn how to view and configure the model version settings of your GPT-4 deployments.

> [!NOTE]
> Version `0314` of `gpt-4` and `gpt-4-32k` will be retired no earlier than July 5, 2024.  Version `0613` of `gpt-4` and `gpt-4-32k` will be retired no earlier than September 30, 2024.  See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.

GPT-4 version 0125-preview is an updated version of the GPT-4 Turbo preview previously released as version 1106-preview.  GPT-4 version 0125-preview completes tasks such as code generation more completely compared to gpt-4-1106-preview.  Because of this, depending on the task, customers may find that GPT-4-0125-preview generates more output compared to the gpt-4-1106-preview.  We recommend customers compare the outputs of the new model.  GPT-4-0125-preview also addresses bugs in gpt-4-1106-preview with UTF-8 handling for non-English languages. 

> [!IMPORTANT]
>
> - `gpt-4` versions 1106-Preview and 0125-Preview will be upgraded with a stable version of `gpt-4` in the future. The deployment upgrade of `gpt-4` 1106-Preview to `gpt-4` 0125-Preview scheduled for March 8, 2024 is no longer taking place.  Deployments of `gpt-4` versions 1106-Preview and 0125-Preview set to "Auto-update to default" and "Upgrade when expired" will start to be upgraded after the stable version is released.  For each deployment, a model version upgrade takes place with no interruption in service for API calls.  Upgrades are staged by region and the full upgrade process is expected to take 2 weeks. Deployments of `gpt-4` versions 1106-Preview and 0125-Preview set to "No autoupgrade" will not be upgraded and will stop operating when the preview version is upgraded in the region.

|  Model ID  | Max Request (tokens) | Training Data (up to)  |
|  --- |  :--- | :---: |
| `gpt-4` (0314) | 8,192 | Sep 2021         |
| `gpt-4-32k`(0314)  | 32,768               | Sep 2021         |
| `gpt-4` (0613)     | 8,192                | Sep 2021         |
| `gpt-4-32k` (0613) | 32,768               | Sep 2021         |
| `gpt-4` (1106-Preview)**<sup>1</sup>**<br>**GPT-4 Turbo Preview** | Input: 128,000  <br> Output: 4,096           | Apr 2023         |
| `gpt-4` (0125-Preview)**<sup>1</sup>**<br>**GPT-4 Turbo Preview** | Input: 128,000  <br> Output: 4,096           | Dec 2023         |
| `gpt-4` (vision-preview)**<sup>2</sup>**<br>**GPT-4 Turbo with Vision Preview**  | Input: 128,000  <br> Output: 4,096              | Apr 2023       |

**<sup>1</sup>** GPT-4 Turbo Preview = `gpt-4` (0125-Preview) or `gpt-4` (1106-Preview). To deploy this model, under **Deployments** select model **gpt-4**. Under version select (0125-Preview) or (1106-Preview).

**<sup>2</sup>** GPT-4 Turbo with Vision Preview = `gpt-4` (vision-preview). To deploy this model, under **Deployments** select model **gpt-4**. For **Model version** select **vision-preview**.

> [!CAUTION]
> We don't recommend using preview models in production. We will upgrade all deployments of preview models to future preview versions and a stable version. Models designated preview do not follow the standard Azure OpenAI model lifecycle.

> [!NOTE]
> Regions where GPT-4 (0314) & (0613) are listed as available have access to both the 8K and 32K versions of the model

### GPT-4 and GPT-4 Turbo Preview model availability

#### Public cloud regions

[!INCLUDE [GPT-4](../includes/model-matrix/standard-gpt-4.md)]

#### Select customer access

In addition to the regions above which are available to all Azure OpenAI customers, some select pre-existing customers have been granted access to versions of GPT-4 in additional regions:

| Model | Region |  
|---|:---|  
| `gpt-4` (0314) | East US <br> France Central <br> South Central US <br> UK South |  
| `gpt-4` (0613) | East US <br> East US 2 <br> Japan East <br> UK South |  

#### Azure Government regions

The following GPT-4 models are available with [Azure Government](/azure/azure-government/documentation-government-welcome):

|Model ID | Model Availability |
|--|--|
| `gpt-4` (1106-Preview) | US Gov Virginia<br>US Gov Arizona |

### GPT-3.5 models

> [!IMPORTANT]
> The NEW `gpt-35-turbo (0125)`  model has various improvements, including higher accuracy at responding in requested formats and a fix for a bug which caused a text encoding issue for non-English language function calls.

GPT-3.5 Turbo is used with the Chat Completion API. GPT-3.5 Turbo version 0301 can also be used with the Completions API.  GPT-3.5 Turbo versions 0613 and 1106 only support the Chat Completions API.

GPT-3.5 Turbo version 0301 is the first version of the model released.  Version 0613 is the second version of the model and adds function calling support.

See [model versions](../concepts/model-versions.md) to learn about how Azure OpenAI Service handles model version upgrades, and [working with models](../how-to/working-with-models.md) to learn how to view and configure the model version settings of your GPT-3.5 Turbo deployments.

> [!NOTE]
> Version `0613` of `gpt-35-turbo` and `gpt-35-turbo-16k` will be retired no earlier than June 13, 2024. Version `0301` of `gpt-35-turbo` will be retired no earlier than July 5, 2024.  See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.

|  Model ID   | Max Request (tokens) | Training Data (up to) |
|  --------- |:------:|:----:|
| `gpt-35-turbo`**<sup>1</sup>** (0301) | 4,096 | Sep 2021 |
| `gpt-35-turbo` (0613) | 4,096 | Sep 2021 |
| `gpt-35-turbo-16k` (0613) | 16,384 | Sep 2021 |
| `gpt-35-turbo-instruct` (0914) | 4,097 |Sep 2021 |
| `gpt-35-turbo` (1106) | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo` (0125) **NEW** | 16,385 | Sep 2021 |

### GPT-3.5-Turbo model availability

#### Public cloud regions

[!INCLUDE [GPT-35-Turbo](../includes/model-matrix/standard-gpt-35-turbo.md)]

**<sup>1</sup>** This model will accept requests > 4,096 tokens. It is not recommended to exceed the 4,096 input token limit as the newer version of the model are capped at 4,096 tokens. If you encounter issues when exceeding 4,096 input tokens with this model this configuration is not officially supported.

### Embeddings models

These models can only be used with Embedding API requests.

> [!NOTE]
> `text-embedding-3-large` is the latest and most capable embedding model. Upgrading between embedding models is not possible. In order to migrate from using `text-embedding-ada-002` to `text-embedding-3-large` you would need to generate new embeddings.  

|  Model ID | Max Request (tokens) | Output Dimensions |Training Data (up-to)
|---|---| :---:|:---:|:---:|
| `text-embedding-ada-002` (version 2) |8,191 | 1,536 | Sep 2021 |
| `text-embedding-ada-002` (version 1) |2,046 | 1,536 | Sep 2021 |
| `text-embedding-3-large` | 8,191 | 3,072 |Sep 2021 |
| `text-embedding-3-small` | 8,191|  1,536 | Sep 2021 |

> [!NOTE]
> When sending an array of inputs for embedding, the max number of input items in the array per call to the embedding endpoint is 2048.

#### Public cloud regions

[!INCLUDE [Embeddings](../includes/model-matrix/standard-embeddings.md)]

#### Azure Government regions

The following Embeddings models are available with [Azure Government](/azure/azure-government/documentation-government-welcome):

|Model ID | Model Availability |
|--|--|
|`text-embedding-ada-002` (version 2) |US Gov Virginia<br>US Gov Arizona |

### DALL-E models

|  Model ID  | Feature Availability | Max Request (characters) |
|  --- |  --- | :---: |
| dalle2 (preview) | East US | 1,000 |
| dall-e-3 | East US, Australia East, Sweden Central | 4,000 |

### Fine-tuning models

`babbage-002` and `davinci-002` are not trained to follow instructions. Querying these base models should only be done as a point of reference to a fine-tuned version to evaluate the progress of your training.

`gpt-35-turbo-0613` - fine-tuning of this model is limited to a subset of regions, and is not available in every region the base model is available.  

|  Model ID  | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to) |
|  --- | --- | :---: | :---: |
| `babbage-002` | North Central US <br> Sweden Central | 16,384 | Sep 2021 |
| `davinci-002` | North Central US <br> Sweden Central | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | North Central US <br> Sweden Central | 4,096 | Sep 2021 |
| `gpt-35-turbo` (1106) | North Central US <br> Sweden Central | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo` (0125)  | North Central US <br> Sweden Central  | 16,385 | Sep 2021 |

### Whisper models

|  Model ID  | Model Availability | Max Request (audio file size) |
|  --- |  --- | :---: |
| `whisper` | East US 2 <br> North Central US <br> Norway East <br> South India <br> Sweden Central <br> West Europe | 25 MB |

### Text to speech models (Preview)

|  Model ID  | Model Availability |
|  --- |  --- | :---: |
| `tts-1` | North Central US <br> Sweden Central |
| `tts-1-hd` | North Central US <br> Sweden Central |

### Assistants (Preview)

For Assistants you need a combination of a supported model, and a supported region. Certain tools and capabilities require the latest models. The following models are available in the Assistants API, SDK, Azure AI Studio and Azure OpenAI Studio. The following table is for pay-as-you-go. For information on Provisioned Throughput Unit (PTU) availability, see [provisioned throughput](./provisioned-throughput.md). 

| Region | `gpt-35-turbo (0613)` | `gpt-35-turbo (1106)` | `gpt-4 (0613)` | `gpt-4 (1106)` | `gpt-4 (0125)` | 
|-----|---|---|---|---|---|
| Australia East | ✅ | ✅ | ✅ |✅ | |
| East US  | ✅ | | | | ✅ |
| East US 2 | ✅ |  | ✅ |✅ | |
| France Central  | ✅ | ✅ |✅ |✅ |  |
| Norway East | |  | | ✅ |  |
| Sweden Central  | ✅ |✅ |✅ |✅| |
| UK South  | ✅ |  ✅ | ✅ |✅ | |




## Next steps

- [Learn more about working with Azure OpenAI models](../how-to/working-with-models.md)
- [Learn more about Azure OpenAI](../overview.md)
- [Learn more about fine-tuning Azure OpenAI models](../how-to/fine-tuning.md)
