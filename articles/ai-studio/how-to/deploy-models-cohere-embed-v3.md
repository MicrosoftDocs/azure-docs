---
title: How to use Cohere Command embedding models with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Cohere Command embeddings models with Azure AI studio.
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/19/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples
---

# How to use Cohere Command embedding models with Azure AI studio

In this guide, you learn about Cohere Command models and how to use them with Azure AI studio.
The Cohere family of models includes a variety of models optimized for different use cases, including chat completions and embeddings. Cohere models are optimized for a variety of use cases including reasoning, summarization, and question answering.





::: zone pivot="programming-language-python"

## Cohere Command embedding models

The Cohere Command family of models for embeddings includes the following models:



# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English has top performance on the HuggingFace MTEB benchmark and performs well on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens




# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports 100+ languages and can be used to search within a language (for example, search with a French query on French documents) and across languages (for example, search with an English query on Chinese documents). Embed multilingual has state-of-the-art performance on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens




---



## Prerequisites

To use Cohere Command models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Cohere Embed V3 models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Install the inference package

You can consume predictions from this model by using the `azure-ai-inference` package with Python. To install this package, you need the following prerequisites:

* Python 3.8 or later installed, including pip.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.
  
Once you have these prerequisites, install the Azure AI inference package with the following command:

```bash
pip install azure-ai-inference
```



> [!TIP]
> Additionally, Cohere supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.ai/).



## Working with embeddings

The following example shows how to make basic usage of the Azure AI Model Inference API with a embeddings model.

First, let's create a client to consume the model.



```python
import os
from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential

model = EmbeddingsClient(
    endpoint=os.environ["AZUREAI_ENDPOINT_URL"],
    credential=AzureKeyCredential(os.environ["AZUREAI_ENDPOINT_KEY"]),
)
```

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```python
model.get_model_info()
```

The response is as follows:



```console
{
    "model_name": "Cohere-embed-v3-english",
    "model_type": "embeddings",
    "model_provider_name": "Cohere"
}
```

### Create embeddings

Create an embedding request to see the output of the model.


```python
response = model.embed(
    input=["The ultimate answer to the question of life"],
)
```

> [!TIP]
> The context window for ${model_name} is 512. Make sure to not exceed this limit when creating embeddings.



The response is as follows, where you can see the model's usage statistics:



```python
import numpy as np

for embed in response.data:
    print("Embeding of size:", np.asarray(embed.embedding).shape)

print("Model:", response.model)
print("Usage:", response.usage)
```

It is usually useful to compute embeddings in batch of inputs. The parameter `inputs` can be a list of strings, where each string is a different input. The response will be a list of embeddings, where each embedding corresponds to the input in the same position.



```python
response = model.embed(
    input=[
        "The ultimate answer to the question of life", 
        "The largest planet in our solar system is Jupiter",
    ],
)
```

The response is as follows, where you can see the model's usage statistics:



```python
import numpy as np

for embed in response.data:
    print("Embeding of size:", np.asarray(embed.embedding).shape)

print("Model:", response.model)
print("Usage:", response.usage)
```

> [!TIP]
> ${model_name} can take batches of 1024 at a time. When creating batches make sure to not exceed this limit.



#### Embedding's types

${model_name} can generate multiple embeddings for the same input depending on how you plan to use them. This capability allow you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that is used to create an embedding for a document that will be stored in a vector database:



```python
from azure.ai.inference.models import EmbeddingInputType

response = model.embed(
    input=["The answer to the ultimate question of life, the universe, and everything is 42"],
    input_type=EmbeddingInputType.DCOUMENT,
)
```

When working on a query to retrieve such document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.



```python
from azure.ai.inference.models import EmbeddingInputType

response = model.embed(
    input=["What's the ultimate meaning of life?"],
    input_type=EmbeddingInputType.QUERY,
)
```

${model_name} can optimize the embeddings based on the intention of it.



::: zone-end


::: zone pivot="programming-language-javascript"

## Cohere Command embedding models

The Cohere Command family of models for embeddings includes the following models:



# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English has top performance on the HuggingFace MTEB benchmark and performs well on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens




# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports 100+ languages and can be used to search within a language (for example, search with a French query on French documents) and across languages (for example, search with an English query on Chinese documents). Embed multilingual has state-of-the-art performance on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens




---



## Prerequisites

To use Cohere Command models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Cohere Embed V3 models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Install the inference package

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

nce you have these prerequisites, install the Azure ModelClient REST client library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```



> [!TIP]
> Additionally, Cohere supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.ai/).



## Working with embeddings

The following example shows how to make basic usage of the Azure AI Model Inference API with a embeddings model.

First, let's create a client to consume the model.



```javascript
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new ModelClient(
    process.env.AZUREAI_ENDPOINT_URL, 
    new AzureKeyCredential(process.env.AZUREAI_ENDPOINT_KEY)
);
```

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```javascript
await client.path("info").get()
```

The response is as follows:



```console
{
    "model_name": "{$model_name}",
    "model_type": "{$model_type}",
    "model_provider_name": "{$model_provider}"
}
```

### Create embeddings

Create an embedding request to see the output of the model.


```javascript
var response = await client.path("/embeddings").post({
    body: {
        input=["The ultimate answer to the question of life"],
    }
});
```

> [!TIP]
> The context window for ${model_name} is 512. Make sure to not exceed this limit when creating embeddings.



The response is as follows, where you can see the model's usage statistics:



```javascript
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.embedding);
console.log(response.body.model);
console.log(response.body.usage);
```

It is usually useful to compute embeddings in batch of inputs. The parameter `inputs` can be a list of strings, where each string is a different input. The response will be a list of embeddings, where each embedding corresponds to the input in the same position.



```javascript
var response = await client.path("/embeddings").post({
    body: {
        input=[
            "The ultimate answer to the question of life", 
            "The largest planet in our solar system is Jupiter",
        ],
    }
});
```

The response is as follows, where you can see the model's usage statistics:



```javascript
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.embedding);
console.log(response.body.model);
console.log(response.body.usage);
```

> [!TIP]
> ${model_name} can take batches of 1024 at a time. When creating batches make sure to not exceed this limit.



#### Embedding's types

${model_name} can generate multiple embeddings for the same input depending on how you plan to use them. This capability allow you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that is used to create an embedding for a document that will be stored in a vector database:



```javascript
var response = await client.path("/embeddings").post({
    body: {
        input=["The answer to the ultimate question of life, the universe, and everything is 42"],
        input_type="document",
    }
});
```

When working on a query to retrieve such document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.



```javascript
var response = await client.path("/embeddings").post({
    body: {
        input=["What's the ultimate meaning of life?"],
        input_type="query",
    }
});
```

${model_name} can optimize the embeddings based on the intention of it.



::: zone-end


::: zone pivot="programming-language-rest"

## Cohere Command embedding models

The Cohere Command family of models for embeddings includes the following models:



# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English has top performance on the HuggingFace MTEB benchmark and performs well on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens




# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is the market's leading text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports 100+ languages and can be used to search within a language (for example, search with a French query on French documents) and across languages (for example, search with an English query on Chinese documents). Embed multilingual has state-of-the-art performance on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens




---



## Prerequisites

To use Cohere Command models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Cohere Embed V3 models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Use the Azure AI model inference API

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



> [!TIP]
> Additionally, Cohere supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.ai/).



## Working with embeddings

The following example shows how to make basic usage of the Azure AI Model Inference API with a embeddings model.

First, let's create a client to consume the model.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



```console
{
    "model_name": "Cohere-embed-v3-english",
    "model_type": "embeddings",
    "model_provider_name": "Cohere"
}
```

### Create embeddings

Create an embedding request to see the output of the model.


```json
{
    "input": [
        "The ultimate answer to the question of life"
    ]
}
```

> [!TIP]
> The context window for ${model_name} is 512. Make sure to not exceed this limit when creating embeddings.



The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0ab1234c-d5e6-7fgh-i890-j1234k123456",
    "object": "list",
    "data": [
        {
            "index": 0,
            "object": "embedding",
            "embedding": [
                0.017196655,
                // ...
                -0.000687122,
                -0.025054932,
                -0.015777588
            ]
        }
    ],
    "model": "Cohere-embed-v3-english",
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 0,
        "total_tokens": 9
    }
}
```

It is usually useful to compute embeddings in batch of inputs. The parameter `inputs` can be a list of strings, where each string is a different input. The response will be a list of embeddings, where each embedding corresponds to the input in the same position.



```json
{
    "input": [
        "The ultimate answer to the question of life", 
        "The largest planet in our solar system is Jupiter"
    ]
}
```

The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0ab1234c-d5e6-7fgh-i890-j1234k123456",
    "object": "list",
    "data": [
        {
            "index": 0,
            "object": "embedding",
            "embedding": [
                0.017196655,
                // ...
                -0.000687122,
                -0.025054932,
                -0.015777588
            ]
        },
        {
            "index": 1,
            "object": "embedding",
            "embedding": [
                0.017196655,
                // ...
                -0.000687122,
                -0.025054932,
                -0.015777588
            ]
        }
    ],
    "model": "Cohere-embed-v3-english",
    "usage": {
        "prompt_tokens": 19,
        "completion_tokens": 0,
        "total_tokens": 19
    }
}
```

> [!TIP]
> ${model_name} can take batches of 1024 at a time. When creating batches make sure to not exceed this limit.



#### Embedding's types

${model_name} can generate multiple embeddings for the same input depending on how you plan to use them. This capability allow you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that is used to create an embedding for a document that will be stored in a vector database:



```json
{
    "input": [
        "The answer to the ultimate question of life, the universe, and everything is 42"
    ],
    "input_type": "document"
}
```

When working on a query to retrieve such document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.



```json
{
    "input": [
        "What's the ultimate meaning of life?"
    ],
    "input_type": "query"
}
```

${model_name} can optimize the embeddings based on the intention of it.



::: zone-end

## Cost and quotas

### Cost and quota considerations for Cohere Command family of models deployed as serverless API endpoints

Cohere Command models deployed as a serverless API are offered by Cohere through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see monitor costs for models offered throughout the Azure Marketplace.

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 



## Additional resources

Here are some additional reference: 

* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)

