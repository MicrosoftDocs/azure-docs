---
title: Azure OpenAI Service models
titleSuffix: Azure OpenAI
description: Learn about the different model capabilities that are available with Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 09/15/2023
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

The `gpt-4` model supports 8192 max input tokens and the `gpt-4-32k` model supports up to 32,768 tokens.

## GPT-3.5

GPT-3.5 models can understand and generate natural language or code. The most capable and cost effective model in the GPT-3.5 family is GPT-3.5 Turbo, which has been optimized for chat and works well for traditional completions tasks as well. GPT-3.5 Turbo is available for use with the Chat Completions API. GPT-3.5 Turbo Instruct has similar capabilities to `text-davinci-003` using the Completions API instead of the Chat Completions API.  We recommend using GPT-3.5 Turbo and GPT-3.5 Turbo Instruct over [legacy GPT-3.5 and GPT-3 models](./legacy-models.md).

- `gpt-35-turbo`
- `gpt-35-turbo-16k`
- `gpt-35-turbo-instruct`

The `gpt-35-turbo` model supports 4096 max input tokens and the `gpt-35-turbo-16k` model supports up to 16,384 tokens.  `gpt-35-turbo-instruct` supports 4097 max input tokens.

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

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| `gpt-4` <sup>2</sup> (0314)     | East US<sup>1</sup>, France Central<sup>1</sup>  |  N/A                | 8,192                | September 2021         |
| `gpt-4-32k` <sup>2</sup> (0314)  |  East US<sup>1</sup>, France Central<sup>1</sup> |  N/A                | 32,768               | September 2021         |
| `gpt-4` (0613)     |  Australia East<sup>1</sup>, Canada East, East US<sup>1</sup>, East US 2<sup>1</sup>, France Central<sup>1</sup>, Japan East<sup>1</sup>, Sweden Central, Switzerland North, UK South<sup>1</sup> |  N/A                | 8,192                | September 2021         |
| `gpt-4-32k` (0613)  |  Australia East<sup>1</sup>, Canada East, East US<sup>1</sup>, East US 2<sup>1</sup>, France Central<sup>1</sup>, Japan East<sup>1</sup>, Sweden Central, Switzerland North, UK South<sup>1</sup> |  N/A                | 32,768               | September 2021         |

<sup>1</sup> Due to high demand, availability is limited in the region<br>
<sup>2</sup> Version `0314` of gpt-4 and gpt-4-32k will be retired no earlier than July 5, 2024. See [model updates](#model-updates) for model upgrade behavior.<br>

### GPT-3.5 models

GPT-3.5 Turbo is used with the Chat Completion API. GPT-3.5 Turbo (0301) can also be used with the Completions API.  GPT3.5 Turbo (0613) only supports the Chat Completions API.

|  Model ID  |   Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  |
|  --------- |  --------------------- | ------------------- | -------------------- | ---------------------- |
| `gpt-35-turbo`<sup>1</sup> (0301) | East US, France Central, South Central US, UK South, West Europe | N/A | 4,096 | Sep 2021 |
| `gpt-35-turbo` (0613) | Australia East, Canada East, East US, East US 2, France Central, Japan East, North Central US, Sweden Central, Switzerland North, UK South | N/A | 4,096 | Sep 2021 |
| `gpt-35-turbo-16k` (0613) | Australia East, Canada East, East US, East US 2, France Central, Japan East, North Central US, Sweden Central, Switzerland North, UK South | N/A | 16,384 | Sep 2021 |
| `gpt-35-turbo-instruct` (0914) | East US, Sweden Central | N/A | 4,097 | Sep 2021 |

<sup>1</sup> Version `0301` of gpt-35-turbo will be retired no earlier than July 5, 2024.  See [model updates](#model-updates) for model upgrade behavior.

### Embeddings models

These models can only be used with Embedding API requests.

> [!NOTE]
> We strongly recommend using `text-embedding-ada-002 (Version 2)`. This model/version provides parity with OpenAI's `text-embedding-ada-002`. To learn more about the improvements offered by this model, please refer to [OpenAI's blog post](https://openai.com/blog/new-and-improved-embedding-model). Even if you are currently using Version 1 you should migrate to Version 2 to take advantage of the latest weights/updated token limit. Version 1 and Version 2 are not interchangeable, so document embedding and document search must be done using the same version of the model.

|  Model ID  |  Base model Regions   | Fine-Tuning Regions | Max Request (tokens) | Training Data (up to)  | Output dimensions |
|  --- | --- | --- | --- | --- |
| text-embedding-ada-002 (version 2) | Canada East, East US, East US2, France Central, Japan East, North Central US, South Central US, Switzerland North, UK South, West Europe | N/A |8,191 | Sep 2021 | 1536 |
| text-embedding-ada-002 (version 1) | East US, South Central US, West Europe | N/A |2,046 | Sep 2021 | 1536 |

### DALL-E models (Preview)

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (characters) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| dalle2 | East US | N/A | 1000 | N/A |

### Whisper models (Preview)

|  Model ID  | Base model Regions   | Fine-Tuning Regions | Max Request (audio file size) | Training Data (up to)  |
|  --- |  --- | --- | --- | --- |
| whisper | North Central US, West Europe | N/A | 25 MB | N/A |

## Working with models

### Finding what models are available

You can get a list of models that are available for both inference and fine-tuning by your Azure OpenAI resource by using the [Models List API](/rest/api/cognitiveservices/azureopenaistable/models/list).

### Model updates

Azure OpenAI now supports automatic updates for select model deployments. On models where automatic update support is available, a model version drop-down will be visible in Azure OpenAI Studio under **Create new deployment** and **Edit deployment**:

:::image type="content" source="../media/models/auto-update.png" alt-text="Screenshot of the deploy model UI of Azure OpenAI Studio." lightbox="../media/models/auto-update.png":::

### Auto update to default

When **Auto-update to default** is selected your model deployment will be automatically updated within two weeks of a change in the default version.

If you are still in the early testing phases for inference models, we recommend deploying models with **auto-update to default** set whenever it is available.

### Specific model version

As your use of Azure OpenAI evolves, and you start to build and integrate with applications you may want to manually control model updates so that you can first test and validate that model performance is remaining consistent for your use case prior to upgrade.

When you select a specific model version for a deployment this version will remain selected until you either choose to manually update yourself, or once you reach the retirement date for the model. When the retirement date is reached the model will auto-upgrade to the default version at the time of retirement.

### GPT-35-Turbo 0301 and GPT-4 0314 retirement

The `gpt-35-turbo` (`0301`) and both `gpt-4` (`0314`) models will be retired no earlier than July 5, 2024. Upon retirement, deployments will automatically be upgraded to the default version at the time of retirement. If you would like your deployment to stop accepting completion requests rather than upgrading, then you will be able to set the model upgrade option to expire through the API. We will publish guidelines on this by September 1.

### Viewing deprecation dates

For currently deployed models, from Azure OpenAI Studio select **Deployments**:

:::image type="content" source="../media/models/deployments.png" alt-text="Screenshot of the deployment UI of Azure OpenAI Studio." lightbox="../media/models/deployments.png":::

To view deprecation/expiration dates for all available models in a given region from Azure OpenAI Studio select **Models** > **Column options** > Select **Deprecation fine tune** and **Deprecation inference**:

:::image type="content" source="../media/models/column-options.png" alt-text="Screenshot of the models UI of Azure OpenAI Studio." lightbox="../media/models/column-options.png":::

### Model deployment upgrade configuration

There are three distinct model deployment upgrade options which are configurable via REST API:

| Name | Description |
|------|--------|
| `OnceNewDefaultVersionAvailable` | Once a new version is designated as the default, the model deployment will auto-upgrade to the default version within two weeks of that designation change being made. |
`OnceCurrentVersionExpired` | Once the retirement date is reached the model deployment will auto-upgrade to the current default version. |
`NoAutoUpgrade` | The model deployment will never auto-upgrade. Once the retirement date is reached the model deployment will stop working. You will need to update your code referencing that deployment to point to a non-expired model deployment. |

To query the current model deployment settings including the deployment upgrade configuration for a given resource use [`Deployments List`](/rest/api/cognitiveservices/accountmanagement/deployments/list?tabs=HTTP#code-try-0)  

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments?api-version=2023-05-01
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```acountname``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```resourceGroupName``` | string |  Required | The name of the associated resource group for this model deployment. |
| ```subscriptionId``` | string |  Required | Subscription ID for the associated subscription. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD format. |

**Supported versions**

- `2023-05-01` [Swagger spec](https://github.com/Azure/azure-rest-api-specs/blob/1e71ad94aeb8843559d59d863c895770560d7c93/specification/cognitiveservices/resource-manager/Microsoft.CognitiveServices/stable/2023-05-01/cognitiveservices.json)

### Example response

```json
{
      "id": "/subscriptions/{Subcription-GUID}/resourceGroups/{Resource-Group-Name}/providers/Microsoft.CognitiveServices/accounts/{Resource-Name}/deployments/text-davinci-003",
      "type": "Microsoft.CognitiveServices/accounts/deployments",
      "name": "text-davinci-003",
      "sku": {
        "name": "Standard",
        "capacity": 60
      },
      "properties": {
        "model": {
          "format": "OpenAI",
          "name": "text-davinci-003",
          "version": "1"
        },
        "versionUpgradeOption": "OnceNewDefaultVersionAvailable",
        "capabilities": {
          "completion": "true",
          "search": "true"
        },
        "raiPolicyName": "Microsoft.Default",
        "provisioningState": "Succeeded",
        "rateLimits": [
          {
            "key": "request",
            "renewalPeriod": 10,
            "count": 60
          },
          {
            "key": "token",
            "renewalPeriod": 60,
            "count": 60000
          }
        ]
      }
```

You can then take the settings from this list to construct an update model REST API call as described below if you want to modify the deployment upgrade configuration.

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

This is only a subset of the available request body parameters. For the full list of the parameters, you can refer to the [REST API reference documentation](/rest/api/cognitiveservices/accountmanagement/deployments/create-or-update).

|Parameter|Type| Description |
|--|--|--|
|versionUpgradeOption | String | Deployment model version upgrade options:<br>`OnceNewDefaultVersionAvailable`<br>`OnceCurrentVersionExpired`<br>`NoAutoUpgrade`|
|capacity|integer|This represents the amount of [quota](../how-to/quota.md) you are assigning to this deployment. A value of 1 equals 1,000 Tokens per Minute (TPM)|

#### Example request

```Bash
curl -X PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-temp/providers/Microsoft.CognitiveServices/accounts/docs-openai-test-001/deployments/text-embedding-ada-002-test-1?api-version=2023-05-01 \
  -H "Content-Type: application/json" \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{"sku":{"name":"Standard","capacity":1},"properties": {"model": {"format": "OpenAI","name": "text-embedding-ada-002","version": "2"},"versionUpgradeOption":"OnceCurrentVersionExpired"}}'
```

> [!NOTE]
> There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account?view=azure-cli-latest#az-account-get-access-token&preserve-view=true). You can use this token as your temporary authorization token for API testing.

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

## Next steps

- [Learn more about Azure OpenAI](../overview.md)
- [Learn more about fine-tuning Azure OpenAI models](../how-to/fine-tuning.md)
