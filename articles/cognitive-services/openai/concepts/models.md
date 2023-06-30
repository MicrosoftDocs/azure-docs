---
title: Azure OpenAI Service models
titleSuffix: Azure OpenAI
description: Learn about the different model capabilities that are available with Azure OpenAI. 
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 06/30/2023
ms.custom: event-tier1-build-2022, references_regions, build-2023, build-2023-dataai
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# Azure OpenAI Service models

Azure OpenAI provides access to many different models, grouped by family and capability. A model family typically associates models by their intended task. The following table describes model families currently available in Azure OpenAI. Not all models are available in all regions currently. Refer to the [model capability table](#model-capabilities) in this article for a full breakdown.

| Model family | Description |
|--|--|
| [GPT-4](#gpt-4-models) | A set of models that improve on GPT-3.5 and can understand as well as generate natural language and code. |
| [GPT-3](#gpt-3-models) | A series of models that can understand and generate natural language. This includes the new [ChatGPT model](#chatgpt-gpt-35-turbo). |
| [DALL-E](#dall-e-models-preview) (Preview) | A series of models in preview that can generate original images from natural language. |
| [Codex](#codex-models) | A series of models that can understand and generate code, including translating natural language to code. |
| [Embeddings](#embeddings-models) | A set of models that can understand and use embeddings. An embedding is a special format of data representation that can be easily utilized by machine learning models and algorithms. The embedding is an information dense representation of the semantic meaning of a piece of text. Currently, we offer three families of Embeddings models for different functionalities: similarity, text search, and code search. |

## Model capabilities

Each model family has a series of models that are further distinguished by capability. These capabilities are typically identified by names, and the alphabetical order of these names generally signifies the relative capability and cost of that model within a given model family. For example, GPT-3 models use names such as Ada, Babbage, Curie, and Davinci to indicate relative capability and cost. Davinci is more capable and more expensive than Curie, which in turn is more capable and more expensive than Babbage, and so on.

> [!NOTE]
> Any task that can be performed by a less capable model like Ada can be performed by a more capable model like Curie or Davinci.

## Naming convention

Azure OpenAI model names typically correspond to the following standard naming convention:

`{capability}-{family}[-{input-type}]-{identifier}`

| Element | Description |
| --- | --- |
| `{capability}` | The model capability of the model. For example, [GPT-3 models](#gpt-3-models) uses `text`, while [Codex models](#codex-models) use `code`.|
| `{family}` | The relative family of the model. For example, GPT-3 models include `ada`, `babbage`, `curie`, and `davinci`.|
| `{input-type}` | ([Embeddings models](#embeddings-models) only) The input type of the embedding supported by the model. For example, text search embedding models support `doc` and `query`.|
| `{identifier}` | The version identifier of the model. |

For example, our most powerful GPT-3 model is called `text-davinci-003`, while our most powerful Codex model is called `code-davinci-002`.

> The older versions of GPT-3 models named `ada`, `babbage`, `curie`, and `davinci` that don't follow the standard naming convention are primarily intended for fine tuning. For more information, see [Learn how to customize a model for your application](../how-to/fine-tuning.md).

## Finding what models are available

You can get a list of models that are available for both inference and fine-tuning by your Azure OpenAI resource by using the [Models List API](/rest/api/cognitiveservices/azureopenaistable/models/list).

## Model updates

Azure OpenAI now supports automatic updates for select model deployments. On models where automatic update support is available, a model version drop-down will be visible in Azure OpenAI Studio under **Create new deployment** and **Edit deployment**:

:::image type="content" source="../media/models/auto-update.png" alt-text="Screenshot of the deploy model UI of Azure OpenAI Studio." lightbox="../media/models/auto-update.png":::

### Auto update to default

When **Auto-update to default** is selected your model deployment will be automatically updated within two weeks of a new version being released.

If you are still in the early testing phases for completion and chat completion based models we recommend deploying models with **auto-update to default** set whenever it is available. For embeddings models while we recommend using the latest model version, you should choose when you want to upgrade since embeddings generated with an earlier model version will not be interchangeable with the new version.

### Specific model version

As your use of Azure OpenAI evolves, and you start to build and integrate with applications you will likely want to manually control model updates so that you can first test and validate that model performance is remaining consistent for your use case prior to upgrade.

When you select a specific model version for a deployment this version will remain selected until you either choose to manually update yourself, or once you reach the expiration date for the model. When the deprecation/expiration date is reached the model will auto-upgrade to the latest available version.

### GPT-35-Turbo 0301 and GPT-4 0314 expiration

The original `gpt-35-turbo` (`0301`) and both `gpt-4` (`0314`) models will expire no earlier than October 15th, 2023. Upon expiration, deployments will automatically be upgraded to the default version. If you would like your deployment to stop accepting completion requests rather than upgrading, then you will be able to set the model upgrade option to expire through the API. We will publish guidelines on this by September 1.  

### Viewing deprecation dates

For currently deployed models, from Azure OpenAI Studio select **Deployments**:

:::image type="content" source="../media/models/deployments.png" alt-text="Screenshot of the deployment UI of Azure OpenAI Studio." lightbox="../media/models/deployments.png":::

To view deprecation/expiration dates for all available models in a given region from Azure OpenAI Studio select **Models** > **Column options** > Select **Deprecation fine tune** and **Deprecation inference**:

:::image type="content" source="../media/models/column-options.png" alt-text="Screenshot of the models UI of Azure OpenAI Studio." lightbox="../media/models/column-options.png":::

### Update & deploy models via the API

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments/{deploymentName}?api-version=2023-05-01
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```acountname``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deploymentName``` | string | Required | The deployment name you chose when you deployed an existing model or the name you would like a new model deployment to have.   |
| ```resourceGroupName``` | string |  Required | The name of the associated resource group for this model deployment. |
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

**Request body**

This is only a subset of the available request body parameters. For the full list of the parameters you can refer to the [REST API spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json).

|Parameter|Type| Description |
|--|--|--|
|versionUpgradeOption | String | Deployment model version upgrade options:<br>`OnceNewDefaultVersionAvailable`<br>`OnceCurrentVersionExpired`<br>`NoAutoUpgrade`|
|capacity|integer|This represents the amount of [quota](../how-to/quota.md) you are assigning to this deployment. A value of 1 equals 1,000 Tokens per Minute (TPM)|

#### Example request

```Bash
curl -X PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/text-embedding-ada-002-test-1" \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{"sku":{"name":"Standard","capacity":1},"properties": {"model": {"format": "OpenAI","name": "text-embedding-ada-002","version": "2"},"versionUpgradeOption":"OnceCurrentVersionExpired"}}'
```

> [!NOTE]
> There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from https://portal.azure.com. Then run [`az account get-access-token`](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true). You can use this token as your temporary authorization token for API testing.

#### Example response

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/text-embedding-ada-002-test-1",
  "type": "Microsoft.CognitiveServices/accounts/deployments",
  "name": "text-embedding-ada-002-test-1",
  "sku": {
    "name": "Standard",
    "capacity": 1
  },
  "properties": {
    "model": {
      "format": "OpenAI",
      "name": "text-embedding-ada-002",
      "version": "2"
    },
    "versionUpgradeOption": "OnceCurrentVersionExpired",
    "capabilities": {
      "embeddings": "true",
      "embeddingsMaxInputs": "1"
    },
    "provisioningState": "Succeeded",
    "ratelimits": [
      {
        "key": "request",
        "renewalPeriod": 10,
        "count": 2
      },
      {
        "key": "token",
        "renewalPeriod": 60,
        "count": 1000
      }
    ]
  },
  "systemData": {
    "createdBy": "docs@contoso.com",
    "createdByType": "User",
    "createdAt": "2023-06-13T00:12:38.885937Z",
    "lastModifiedBy": "docs@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-06-13T02:41:04.8410965Z"
  },
  "etag": "\"{GUID}\""
}
```

## Finding the right model

We recommend starting with the most capable model in a model family to confirm whether the model capabilities meet your requirements. Then you can stay with that model or move to a model with lower capability and cost, optimizing around that model's capabilities.

## GPT-4 models

 GPT-4 can solve difficult problems with greater accuracy than any of OpenAI's previous models. Like gpt-35-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks.

Due to high demand access to this model series is currently only available by request. To request access, existing Azure OpenAI customers can [apply by filling out this form](https://aka.ms/oai/get-gpt4)

- `gpt-4`
- `gpt-4-32k`

The `gpt-4` supports 8192 max input tokens and the `gpt-4-32k` supports up to 32,768 tokens.

## GPT-3 models

The GPT-3 models can understand and generate natural language. The service offers four model capabilities, each with different levels of power and speed suitable for different tasks. Davinci is the most capable model, while Ada is the fastest. In the order of greater to lesser capability, the models are:

- `text-davinci-003`
- `text-curie-001`
- `text-babbage-001`
- `text-ada-001`

While Davinci is the most capable, the other models provide significant speed advantages. Our recommendation is for users to start with Davinci while experimenting, because it produces the best results and validate the value that Azure OpenAI can provide. Once you have a prototype working, you can then optimize your model choice with the best latency/performance balance for your application.

### <a id="gpt-3-davinci"></a>Davinci

Davinci is the most capable model and can perform any task the other models can perform, often with less instruction. For applications requiring deep understanding of the content, like summarization for a specific audience and creative content generation, Davinci produces the best results. The increased capabilities provided by Davinci require more compute resources, so Davinci costs more and isn't as fast as other models.

Another area where Davinci excels is in understanding the intent of text. Davinci is excellent at solving many kinds of logic problems and explaining the motives of characters. Davinci has been able to solve some of the most challenging AI problems involving cause and effect.

**Use for**: Complex intent, cause and effect, summarization for audience

### Curie

Curie is powerful, yet fast. While Davinci is stronger when it comes to analyzing complicated text, Curie is capable for many nuanced tasks like sentiment classification and summarization. Curie is also good at answering questions and performing Q&A and as a general service chatbot.

**Use for**: Language translation, complex classification, text sentiment, summarization

### Babbage

Babbage can perform straightforward tasks like simple classification. It’s also capable when it comes to semantic search,  ranking how well documents match up with search queries.

**Use for**: Moderate classification, semantic search classification

### Ada

Ada is usually the fastest model and can perform tasks like parsing text, address correction and certain kinds of classification tasks that don’t require too much nuance. Ada’s performance can often be improved by providing more context.

**Use for**: Parsing text, simple classification, address correction, keywords

### ChatGPT (gpt-35-turbo)

The ChatGPT model (gpt-35-turbo) is a language model designed for conversational interfaces and the model behaves differently than previous GPT-3 models. Previous models were text-in and text-out, meaning they accepted a prompt string and returned a completion to append to the prompt. However, the ChatGPT model is conversation-in and message-out. The model expects a prompt string formatted in a specific chat-like transcript format, and returns a completion that represents a model-written message in the chat.

To learn more about the ChatGPT model and how to interact with the Chat API check out our [in-depth how-to](../how-to/chatgpt.md).

### DALL-E models (Preview)

The DALL-E models, currently in preview, generate images from text prompts that the user provides.

## Codex models

The Codex models are descendants of our base GPT-3 models that can understand and generate code. Their training data contains both natural language and billions of lines of public code from GitHub.

They’re most capable in Python and proficient in over a dozen languages, including C#, JavaScript, Go, Perl, PHP, Ruby, Swift, TypeScript, SQL, and Shell. In the order of greater to lesser capability, the Codex models are:

- `code-davinci-002`
- `code-cushman-001`

### <a id="codex-davinci"></a>Davinci

Similar to GPT-3, Davinci is the most capable Codex model and can perform any task the other models can perform, often with less instruction. For applications requiring deep understanding of the content, Davinci produces the best results. Greater capabilities require more compute resources, so Davinci costs more and isn't as fast as other models.

### Cushman

Cushman is powerful, yet fast. While Davinci is stronger when it comes to analyzing complicated tasks, Cushman is a capable model for many code generation tasks. Cushman typically runs faster and cheaper than Davinci, as well.

## Embeddings models

> [!IMPORTANT]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.

Currently, we offer three families of Embeddings models for different functionalities:

- [Similarity](#similarity-embedding)
- [Text search](#text-search-embedding)
- [Code search](#code-search-embedding)

Each family includes models across a range of capability. The following list indicates the length of the numerical vector returned by the service, based on model capability:

|  Base Model  |  Model(s)  |  Dimensions  |
|---|---|---|
| Ada | models ending in -001 (Version 1) | 1024 |
| Ada | text-embedding-ada-002 (Version 2) | 1536 |
| Babbage |  | 2048 |
| Curie |  | 4096 |
| Davinci |  | 12288 |

Davinci is the most capable, but is slower and more expensive than the other models. Ada is the least capable, but is both faster and cheaper.

### Similarity embedding

These models are good at capturing semantic similarity between two or more pieces of text.

| Use cases | Models |
|---|---|
| Clustering, regression, anomaly detection, visualization | `text-similarity-ada-001` <br> `text-similarity-babbage-001` <br> `text-similarity-curie-001` <br> `text-similarity-davinci-001` <br>|

### Text search embedding

These models help measure whether long documents are relevant to a short search query. There are two input types supported by this family: `doc`, for embedding the documents to be retrieved, and `query`, for embedding the search query.

| Use cases | Models |
|---|---|
| Search, context relevance, information retrieval | `text-search-ada-doc-001` <br> `text-search-ada-query-001` <br> `text-search-babbage-doc-001` <br> `text-search-babbage-query-001` <br> `text-search-curie-doc-001` <br> `text-search-curie-query-001` <br> `text-search-davinci-doc-001` <br> `text-search-davinci-query-001` <br> |

### Code search embedding

Similar to text search embedding models, there are two input types supported by this family: `code`, for embedding code snippets to be retrieved, and `text`, for embedding natural language search queries.

| Use cases | Models |
|---|---|
| Code search and relevance | `code-search-ada-code-001` <br> `code-search-ada-text-001` <br> `code-search-babbage-code-001` <br> `code-search-babbage-text-001` |

When using our embeddings models, keep in mind their limitations and risks.

## Model Summary table and region availability

> [!IMPORTANT]
> South Central US is temporarily unavailable for creating new resources due to high demand.

### GPT-3 Models

These models can be used with Completion API requests. `gpt-35-turbo` is the only model that can be used with both Completion API requests and the Chat Completion API.

|  Model ID  |   Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --------- |  --------------------- | ------------------- | -------------------- | ---------------------- |
| ada        |	N/A	                  | N/A | 2,049 | Oct 2019|
| text-ada-001 | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019|
| babbage | N/A | N/A | 2,049 | Oct 2019 |
| text-babbage-001 | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019 |
| curie | N/A | N/A | 2,049 | Oct 2019 |
| text-curie-001  | East US, South Central US, West Europe | N/A | 2,049 | Oct 2019 |
| davinci | N/A | N/A | 2,049 | Oct 2019|
| text-davinci-001 | South Central US, West Europe | N/A |  |  |
| text-davinci-002 | East US, South Central US, West Europe | N/A | 4,097 | Jun 2021 |
| text-davinci-003 | East US, West Europe | N/A | 4,097 | Jun 2021 |
| text-davinci-fine-tune-002 | N/A | N/A |  |  |
| gpt-35-turbo<sup>1</sup> (0301) | East US, France Central, South Central US, UK South, West Europe | N/A | 4,096 | Sep 2021 |
| gpt-35-turbo (0613) | East US, France Central, UK South | N/A | 4,096 | Sep 2021 |
| gpt-35-turbo-16k (0613) | East US, France Central, UK South | N/A | 16,384 | Sep 2021 |

<br><sup>1</sup> Version `0301` of gpt-35-turbo will be deprecated no earlier than October 15th, 2023 in favor of version `0613`.

### GPT-4 Models

These models can only be used with the Chat Completion API.

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| `gpt-4` <sup>1,</sup><sup>2</sup> (0314)     |  East US, France Central |  N/A                | 8,192                | September 2021         |
| `gpt-4-32k` <sup>1,</sup><sup>2</sup> (0314)  |  East US, France Central |  N/A                | 32,768               | September 2021         |
| `gpt-4` <sup>1</sup> (0613)     |  East US, France Central |  N/A                | 8,192                | September 2021         |
| `gpt-4-32k` <sup>1</sup> (0613)  |  East US, France Central |  N/A                | 32,768               | September 2021         |

<sup>1</sup> The model is [only available by request](https://aka.ms/oai/get-gpt4).<br>
<sup>2</sup> Version `0301` of gpt-4 and gpt-4-32k will be deprecated no earlier than October 15th, 2023 in favor of version `0613`.

### Dall-E Models

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (characters) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| dalle2 | East US | N/A | 1000 | N/A |


### Codex Models

These models can only be used with Completions API requests.

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| code-cushman-001<sup>1</sup> | South Central US, West Europe | Currently unavailable | 2,048 | |
| code-davinci-002 | East US,  West Europe |  N/A | 8,001 | Jun 2021 |

<sup>1</sup> The model is available for fine-tuning by request only. Currently we aren't accepting new requests to fine-tune the model.

### Embeddings Models

These models can only be used with Embedding API requests.

> [!NOTE]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.

|  Model ID  |  Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- | --- | --- | --- | --- |
| text-embedding-ada-002 (version 2) | East US, South Central US | N/A |8,191 | Sep 2021 |
| text-embedding-ada-002 (version 1) | East US, South Central US, West Europe | N/A |2,046 | Sep 2021 |
| text-similarity-ada-001| East US, South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-similarity-babbage-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-similarity-curie-001 | East US, South Central US, West Europe | N/A |  2046 | Aug 2020 |
| text-similarity-davinci-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-ada-doc-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-ada-query-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-babbage-doc-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-babbage-query-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-curie-doc-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-curie-query-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-davinci-doc-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| text-search-davinci-query-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-ada-code-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-ada-text-001  | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-babbage-code-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |
| code-search-babbage-text-001 | South Central US, West Europe | N/A | 2,046 | Aug 2020 |

## Next steps

- [Learn more about Azure OpenAI](../overview.md)
- [Learn more about fine-tuning Azure OpenAI models](../how-to/fine-tuning.md)
