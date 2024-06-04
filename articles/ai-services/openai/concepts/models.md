---
title: Azure OpenAI Service models
titleSuffix: Azure OpenAI
description: Learn about the different model capabilities that are available with Azure OpenAI.
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 05/13/2024
ms.custom: references_regions, build-2023, build-2023-dataai, refefences_regions
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
---

# Azure OpenAI Service models

Azure OpenAI Service is powered by a diverse set of models with different capabilities and price points. Model availability varies by region. For GPT-3 and other models retiring in July 2024, see [Azure OpenAI Service legacy models](./legacy-models.md).

| Models | Description |
|--|--|
| [GPT-4o & GPT-4 Turbo **NEW**](#gpt-4o-and-gpt-4-turbo) | The latest most capable Azure OpenAI models with multimodal versions, which can accept both text and images as input. |
| [GPT-4](#gpt-4) | A set of models that improve on GPT-3.5 and can understand and generate natural language and code. |
| [GPT-3.5](#gpt-35) | A set of models that improve on GPT-3 and can understand and generate natural language and code. |
| [Embeddings](#embeddings-models) | A set of models that can convert text into numerical vector form to facilitate text similarity. |
| [DALL-E](#dall-e-models) | A series of models that can generate original images from natural language. |
| [Whisper](#whisper-models) | A series of models in preview that can transcribe and translate speech to text. |
| [Text to speech](#text-to-speech-models-preview) (Preview) | A series of models in preview that can synthesize text to speech. |

## GPT-4o and GPT-4 Turbo

GPT-4o is the latest model from OpenAI. GPT-4o integrates text and images in a single model, enabling it to handle multiple data types simultaneously. This multimodal approach enhances accuracy and responsiveness in human-computer interactions. GPT-4o matches GPT-4 Turbo in English text and coding tasks while offering superior performance in non-English languages and vision tasks, setting new benchmarks for AI capabilities.

### How do I access the GPT-4o model?

GPT-4o is available for **standard** and **global-standard** model deployment.

You need to [create](../how-to/create-resource.md) or use an existing resource in a [supported standard](#gpt-4-and-gpt-4-turbo-model-availability) or [global standard](#global-standard-model-availability-preview) region where the model is available.

When your resource is created, you can [deploy](../how-to/create-resource.md#deploy-a-model) the GPT-4o model. If you are performing a programmatic deployment, the **model** name is `gpt-4o`, and the **version** is `2024-05-13`.

### GPT-4 Turbo

GPT-4 Turbo is a large multimodal model (accepting text or image inputs and generating text) that can solve difficult problems with greater accuracy than any of OpenAI's previous models. Like GPT-3.5 Turbo, and older GPT-4 models GPT-4 Turbo is optimized for chat and works well for traditional completions tasks.

[!INCLUDE [GPT-4 Turbo](../includes/gpt-4-turbo.md)]

## GPT-4

GPT-4 is the predecessor to GPT-4 Turbo. Both the GPT-4 and GPT-4 Turbo models have a base model name of `gpt-4`. You can distinguish between the GPT-4 and Turbo models by examining the model version.

- `gpt-4` **Version** `0314`
- `gpt-4` **Version** `0613`
- `gpt-4-32k` **Version** `0613`

You can see the token context length supported by each model in the [model summary table](#model-summary-table-and-region-availability).

## GPT-4 and GPT-4 Turbo models

- These models can only be used with the Chat Completion API.

See [model versions](../concepts/model-versions.md) to learn about how Azure OpenAI Service handles model version upgrades, and [working with models](../how-to/working-with-models.md) to learn how to view and configure the model version settings of your GPT-4 deployments.

|  Model ID  | Description | Max Request (tokens) | Training Data (up to)  |
|  --- |  :--- |:--- |:---: |
|`gpt-4o` (2024-05-13) <br> **GPT-4o (Omni)** | **Latest GA model** <br> - Text, image processing <br> - JSON Mode <br> - parallel function calling <br> - Enhanced accuracy and responsiveness <br> - Parity with English text and coding tasks compared to GPT-4 Turbo with Vision <br> - Superior performance in non-English languages and in vision tasks <br> - **Does not support enhancements** |Input: 128,000  <br> Output: 4,096| Oct 2023 |
| `gpt-4` (turbo-2024-04-09) <br>**GPT-4 Turbo with Vision** | **New GA model** <br> - Replacement for all previous GPT-4 preview models (`vision-preview`, `1106-Preview`, `0125-Preview`). <br> - [**Feature availability**](#gpt-4o-and-gpt-4-turbo) is currently different depending on method of input, and deployment type. <br> - **Does not support enhancements**. | Input: 128,000  <br> Output: 4,096  | Dec 2023 |
| `gpt-4` (0125-Preview)*<br>**GPT-4 Turbo Preview** | **Preview Model** <br> -Replaces 1106-Preview <br>- Better code generation performance <br> - Reduces cases where the model doesn't complete a task <br> - JSON Mode <br> - parallel function calling <br> - reproducible output (preview) | Input: 128,000  <br> Output: 4,096           | Dec 2023         |
| `gpt-4` (vision-preview)<br>**GPT-4 Turbo with Vision Preview**  | **Preview model** <br> - Accepts text and image input. <br> - Supports enhancements <br> - JSON Mode <br> - parallel function calling <br> - reproducible output (preview) | Input: 128,000  <br> Output: 4,096              | Apr 2023       |
| `gpt-4` (1106-Preview)<br>**GPT-4 Turbo Preview** | **Preview Model** <br> - JSON Mode <br> - parallel function calling <br> - reproducible output (preview) | Input: 128,000  <br> Output: 4,096 | Apr 2023         |
| `gpt-4-32k` (0613) | **Older GA model** <br> - Basic function calling with tools  | 32,768               | Sep 2021         |
| `gpt-4` (0613)     | **Older GA model** <br> - Basic function calling with tools | 8,192                | Sep 2021         |
| `gpt-4-32k`(0314)  | **Older GA model** <br> - [Retirement information](./model-retirements.md#current-models) | 32,768               | Sep 2021         |
| `gpt-4` (0314) | **Older GA model** <br> - [Retirement information](./model-retirements.md#current-models)  | 8,192 | Sep 2021         |

> [!CAUTION]
> We don't recommend using preview models in production. We will upgrade all deployments of preview models to either future preview versions or to the latest stable/GA version. Models designated preview do not follow the standard Azure OpenAI model lifecycle.

> [!NOTE]
> Version `0314` of `gpt-4` and `gpt-4-32k` will be retired no earlier than July 5, 2024.  Version `0613` of `gpt-4` and `gpt-4-32k` will be retired no earlier than September 30, 2024.  See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.

- GPT-4 version 0125-preview is an updated version of the GPT-4 Turbo preview previously released as version 1106-preview.  
- GPT-4 version 0125-preview completes tasks such as code generation more completely compared to gpt-4-1106-preview. Because of this, depending on the task, customers may find that GPT-4-0125-preview generates more output compared to the gpt-4-1106-preview.  We recommend customers compare the outputs of the new model.  GPT-4-0125-preview also addresses bugs in gpt-4-1106-preview with UTF-8 handling for non-English languages. 
- GPT-4 version `turbo-2024-04-09` is the latest GA release and replaces `0125-Preview`, `1106-preview`, and `vision-preview`.

> [!IMPORTANT]
>
> - `gpt-4` versions 1106-Preview, 0125-Preview, and vision-preview will be upgraded with a stable version of `gpt-4` in the future. Deployments of `gpt-4` versions 1106-Preview, 0125-Preview, and vision-preview set to "Auto-update to default" and "Upgrade when expired" will start to be upgraded after the stable version is released. For each deployment, a model version upgrade takes place with no interruption in service for API calls.  Upgrades are staged by region and the full upgrade process is expected to take 2 weeks. Deployments of `gpt-4` versions 1106-Preview, 0125-Preview, and vision-preview set to "No autoupgrade" will not be upgraded and will stop operating when the preview version is upgraded in the region. See [Azure OpenAI model retirements and deprecations](./model-retirements.md) for more information on the timing of the upgrade.

## GPT-3.5

GPT-3.5 models can understand and generate natural language or code. The most capable and cost effective model in the GPT-3.5 family is GPT-3.5 Turbo, which has been optimized for chat and works well for traditional completions tasks as well. GPT-3.5 Turbo is available for use with the Chat Completions API. GPT-3.5 Turbo Instruct has similar capabilities to `text-davinci-003` using the Completions API instead of the Chat Completions API.  We recommend using GPT-3.5 Turbo and GPT-3.5 Turbo Instruct over [legacy GPT-3.5 and GPT-3 models](./legacy-models.md).


|  Model ID   | Description | Max Request (tokens) | Training Data (up to) |
|  --------- |:---|:------:|:----:|
| `gpt-35-turbo` (0125) **NEW** | **Latest GA Model** <br> - JSON Mode <br> - parallel function calling <br> - reproducible output (preview) <br> - Higher accuracy at responding in requested formats. <br> - Fix for a bug which caused a text encoding issue for non-English language function calls.  | Input: 16,385<br> Output: 4,096  | Sep 2021 |
| `gpt-35-turbo` (1106) | **Older GA Model** <br> - JSON Mode <br> - parallel function calling <br> - reproducible output (preview) | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo-instruct` (0914) | **Completions endpoint only** <br> - Replacement for [legacy completions models](./legacy-models.md) | 4,097 |Sep 2021 |
| `gpt-35-turbo-16k` (0613) | **Older GA Model** <br> - Basic function calling with tools | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | **Older GA Model** <br> - Basic function calling with tools   | 4,096 | Sep 2021 |
| `gpt-35-turbo`**<sup>1</sup>** (0301) |  **Older GA Model**  <br> - [Retirement information](./model-retirements.md#current-models) | 4,096 | Sep 2021 |

To learn more about how to interact with GPT-3.5 Turbo and the Chat Completions API check out our [in-depth how-to](../how-to/chatgpt.md).

**<sup>1</sup>** This model will accept requests > 4,096 tokens. It is not recommended to exceed the 4,096 input token limit as the newer version of the model are capped at 4,096 tokens. If you encounter issues when exceeding 4,096 input tokens with this model this configuration is not officially supported.

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
> This article primarily covers model/region availability that applies to all Azure OpenAI customers with deployment types of **Standard**. Some select customers have access to model/region combinations that are not listed in the unified table below. For more information on Provisioned deployments, see our [Provisioned guidance](./provisioned-throughput.md).

### Standard deployment model availability

[!INCLUDE [Standard Models](../includes/model-matrix/standard-models.md)]

This table doesn't include fine-tuning regional availability, consult the dedicated [fine-tuning section](#fine-tuning-models) for this information.

### Standard deployment model quota

[!INCLUDE [Quota](~/reusable-content/ce-skilling/azure/includes/ai-services/openai/includes/model-matrix/quota.md)]

### Provisioned deployment model availability

[!INCLUDE [Provisioned](../includes/model-matrix/provisioned-models.md)]

> [!NOTE]
> The provisioned version of `gpt-4` **Version:** `turbo-2024-04-09` is currently limited to text only.

### How do I get access to Provisioned?

You need to speak with your Microsoft sales/account team to acquire provisioned throughput. If you don't have a sales/account team, unfortunately at this time, you cannot purchase provisioned throughput.

For more information on Provisioned deployments, see our [Provisioned guidance](./provisioned-throughput.md).

### Global standard model availability (preview)

**Supported models:**

- `gpt-4o` **Version:** `2024-05-13`  

**Supported regions:**

 - eastus
 - eastus2
 - northcentralus
 - southcentralus
 - westus
 - westus3

### GPT-4 and GPT-4 Turbo model availability

#### Public cloud regions

[!INCLUDE [GPT-4](../includes/model-matrix/standard-gpt-4.md)]

#### Select customer access

In addition to the regions above which are available to all Azure OpenAI customers, some select pre-existing customers have been granted access to versions of GPT-4 in additional regions:

| Model | Region |  
|---|:---|  
| `gpt-4` (0314) <br> `gpt-4-32k` (0314) | East US <br> France Central <br> South Central US <br> UK South |  
| `gpt-4` (0613) <br> `gpt-4-32k` (0613) | East US <br> East US 2 <br> Japan East <br> UK South |  

#### Azure Government regions

The following GPT-4 models are available with [Azure Government](/azure/azure-government/documentation-government-welcome):

|Model ID | Model Availability |
|--|--|
| `gpt-4` (1106-Preview) | US Gov Virginia<br>US Gov Arizona |

### GPT-3.5 models

> [!IMPORTANT]
> The NEW `gpt-35-turbo (0125)`  model has various improvements, including higher accuracy at responding in requested formats and a fix for a bug which caused a text encoding issue for non-English language function calls.

GPT-3.5 Turbo is used with the Chat Completion API. GPT-3.5 Turbo version 0301 can also be used with the Completions API, though this is not recommended.  GPT-3.5 Turbo versions 0613 and 1106 only support the Chat Completions API.

GPT-3.5 Turbo version 0301 is the first version of the model released.  Version 0613 is the second version of the model and adds function calling support.

See [model versions](../concepts/model-versions.md) to learn about how Azure OpenAI Service handles model version upgrades, and [working with models](../how-to/working-with-models.md) to learn how to view and configure the model version settings of your GPT-3.5 Turbo deployments.

> [!NOTE]
> Version `0613` of `gpt-35-turbo` and `gpt-35-turbo-16k` will be retired no earlier than August 1, 2024. Version `0301` of `gpt-35-turbo` will be retired no earlier than August 1, 2024.  See [model updates](../how-to/working-with-models.md#model-updates) for model upgrade behavior.

### GPT-3.5-Turbo model availability

#### Public cloud regions

[!INCLUDE [GPT-35-Turbo](../includes/model-matrix/standard-gpt-35-turbo.md)]

#### Azure Government regions

The following GPT-3.5 turbo models are available with [Azure Government](/azure/azure-government/documentation-government-welcome):

|Model ID | Model Availability |
|--|--|
| `gpt-35-turbo` (1106-Preview) | US Gov Virginia |

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

`gpt-35-turbo` - fine-tuning of this model is limited to a subset of regions, and is not available in every region the base model is available.  

|  Model ID  | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to) |
|  --- | --- | :---: | :---: |
| `babbage-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `davinci-002` | North Central US <br> Sweden Central  <br> Switzerland West | 16,384 | Sep 2021 |
| `gpt-35-turbo` (0613) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 4,096 | Sep 2021 |
| `gpt-35-turbo` (1106) | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | Input: 16,385<br> Output: 4,096 |  Sep 2021|
| `gpt-35-turbo` (0125)  | East US2 <br> North Central US <br> Sweden Central <br> Switzerland West | 16,385 | Sep 2021 |
| `gpt-4` (0613) <sup>**1**<sup> | North Central US <br> Sweden Central | 8192 | Sep 2021 |

**<sup>1<sup>** GPT-4 fine-tuning is currently in public preview. See our [GPT-4 fine-tuning safety evaluation guidance](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-python#safety-evaluation-gpt-4-fine-tuning---public-preview) for more information.

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

| Region | `gpt-35-turbo (0613)` | `gpt-35-turbo (1106)`| `fine tuned gpt-3.5-turbo-0125` | `gpt-4 (0613)` | `gpt-4 (1106)` | `gpt-4 (0125)` |
|-----|---|---|---|---|---|---|
| Australia East | ✅ | ✅ | | ✅ |✅ | |
| East US  | ✅ | | | | | ✅ |
| East US 2 | ✅ |  | ✅ | ✅ |✅ | |
| France Central  | ✅ | ✅ | | ✅ |✅ |  |
| Japan East | ✅ |  | | | | | 
| Norway East | |  | | | ✅ |  |
| Sweden Central  | ✅ |✅ | ✅ |✅ |✅| |
| UK South | ✅  | ✅ | | | ✅ | ✅ |  
| West US |  | ✅ | | | ✅ | | 
| West US 3 |  |  | | |✅ | | 


## Next steps

- [Learn more about working with Azure OpenAI models](../how-to/working-with-models.md)
- [Learn more about Azure OpenAI](../overview.md)
- [Learn more about fine-tuning Azure OpenAI models](../how-to/fine-tuning.md)
