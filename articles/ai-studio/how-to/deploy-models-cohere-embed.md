---
title: How to use Cohere Embed V3 models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to use Cohere Embed V3 models with Azure AI Studio.
ms.service: azure-ai-studio
manager: scottpolly
ms.topic: how-to
ms.date: 08/08/2024
ms.reviewer: shubhiraj
reviewer: shubhirajMsft
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples-embeddings
---

# How to use Cohere Embed V3 models with Azure AI Studio

In this article, you learn about Cohere Embed V3 models and how to use them with Azure AI Studio.
The Cohere family of models includes various models optimized for different use cases, including chat completions, embeddings, and rerank. Cohere models are optimized for various use cases that include reasoning, summarization, and question answering.



::: zone pivot="programming-language-python"

## Cohere embedding models

The Cohere family of models for embeddings includes the following models:

# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English performs well on the HuggingFace (massive text embed) MTEB benchmark and on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens


# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports more than 100 languages and can be used to search within a language (for example, to search with a French query on French documents) and across languages (for example, to search with an English query on Chinese documents). Embed multilingual performs well on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens


---

## Prerequisites

To use Cohere Embed V3 models with Azure AI Studio, you need the following prerequisites:

### A model deployment

**Deployment to serverless APIs**

Cohere Embed V3 models can be deployed to serverless API endpoints with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. 

Deployment to a serverless API endpoint doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)

### The inference package installed

You can consume predictions from this model by using the `azure-ai-inference` package with Python. To install this package, you need the following prerequisites:

* Python 3.8 or later installed, including pip.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.
  
Once you have these prerequisites, install the Azure AI inference package with the following command:

```bash
pip install azure-ai-inference
```

Read more about the [Azure AI inference package and reference](https://aka.ms/azsdk/azure-ai-inference/python/reference).

> [!TIP]
> Additionally, Cohere supports the use of a tailored API for use with specific features of the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.com/reference/about).

## Work with embeddings

In this section, you use the [Azure AI model inference API](https://aka.ms/azureai/modelinference) with an embeddings model.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.


```python
import os
from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential

model = EmbeddingsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["AZURE_INFERENCE_CREDENTIAL"]),
)
```

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:


```python
model_info = model.get_model_info()
```

The response is as follows:


```python
print("Model name:", model_info.model_name)
print("Model type:", model_info.model_type)
print("Model provider name:", model_info.model_provider)
```

```console
Model name: Cohere-embed-v3-english
Model type": embeddings
Model provider name": Cohere
```

### Create embeddings

Create an embedding request to see the output of the model.

```python
response = model.embed(
    input=["The ultimate answer to the question of life"],
)
```

> [!TIP]
> The context window for Cohere Embed V3 models is 512. Make sure that you don't exceed this limit when creating embeddings.

The response is as follows, where you can see the model's usage statistics:


```python
import numpy as np

for embed in response.data:
    print("Embeding of size:", np.asarray(embed.embedding).shape)

print("Model:", response.model)
print("Usage:", response.usage)
```

It can be useful to compute embeddings in input batches. The parameter `inputs` can be a list of strings, where each string is a different input. In turn the response is a list of embeddings, where each embedding corresponds to the input in the same position.


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
> Cohere Embed V3 models can take batches of 1024 at a time. When creating batches, make sure that you don't exceed this limit.

#### Create different types of embeddings

Cohere Embed V3 models can generate multiple embeddings for the same input depending on how you plan to use them. This capability allows you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that are used to create an embedding for a document that will be stored in a vector database:


```python
from azure.ai.inference.models import EmbeddingInputType

response = model.embed(
    input=["The answer to the ultimate question of life, the universe, and everything is 42"],
    input_type=EmbeddingInputType.DOCUMENT,
)
```

When you work on a query to retrieve such a document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.


```python
from azure.ai.inference.models import EmbeddingInputType

response = model.embed(
    input=["What's the ultimate meaning of life?"],
    input_type=EmbeddingInputType.QUERY,
)
```

Cohere Embed V3 models can optimize the embeddings based on its use case.

::: zone-end


::: zone pivot="programming-language-javascript"

## Cohere embedding models

The Cohere family of models for embeddings includes the following models:

# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English performs well on the HuggingFace (massive text embed) MTEB benchmark and on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens


# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports more than 100 languages and can be used to search within a language (for example, to search with a French query on French documents) and across languages (for example, to search with an English query on Chinese documents). Embed multilingual performs well on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens


---

## Prerequisites

To use Cohere Embed V3 models with Azure AI Studio, you need the following prerequisites:

### A model deployment

**Deployment to serverless APIs**

Cohere Embed V3 models can be deployed to serverless API endpoints with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. 

Deployment to a serverless API endpoint doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)

### The inference package installed

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure Inference library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```

> [!TIP]
> Additionally, Cohere supports the use of a tailored API for use with specific features of the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.com/reference/about).

## Work with embeddings

In this section, you use the [Azure AI model inference API](https://aka.ms/azureai/modelinference) with an embeddings model.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.


```javascript
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new ModelClient(
    process.env.AZURE_INFERENCE_ENDPOINT, 
    new AzureKeyCredential(process.env.AZURE_INFERENCE_CREDENTIAL)
);
```

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:


```javascript
await client.path("/info").get()
```

The response is as follows:


```javascript
console.log("Model name: ", model_info.body.model_name);
console.log("Model type: ", model_info.body.model_type);
console.log("Model provider name: ", model_info.body.model_provider_name);
```

```console
Model name: Cohere-embed-v3-english
Model type": embeddings
Model provider name": Cohere
```

### Create embeddings

Create an embedding request to see the output of the model.

```javascript
var response = await client.path("/embeddings").post({
    body: {
        input: ["The ultimate answer to the question of life"],
    }
});
```

> [!TIP]
> The context window for Cohere Embed V3 models is 512. Make sure that you don't exceed this limit when creating embeddings.

The response is as follows, where you can see the model's usage statistics:


```javascript
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.embedding);
console.log(response.body.model);
console.log(response.body.usage);
```

It can be useful to compute embeddings in input batches. The parameter `inputs` can be a list of strings, where each string is a different input. In turn the response is a list of embeddings, where each embedding corresponds to the input in the same position.


```javascript
var response = await client.path("/embeddings").post({
    body: {
        input: [
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
> Cohere Embed V3 models can take batches of 1024 at a time. When creating batches, make sure that you don't exceed this limit.

#### Create different types of embeddings

Cohere Embed V3 models can generate multiple embeddings for the same input depending on how you plan to use them. This capability allows you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that are used to create an embedding for a document that will be stored in a vector database:


```javascript
var response = await client.path("/embeddings").post({
    body: {
        input: ["The answer to the ultimate question of life, the universe, and everything is 42"],
        input_type: "document",
    }
});
```

When you work on a query to retrieve such a document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.


```javascript
var response = await client.path("/embeddings").post({
    body: {
        input: ["What's the ultimate meaning of life?"],
        input_type: "query",
    }
});
```

Cohere Embed V3 models can optimize the embeddings based on its use case.

::: zone-end


::: zone pivot="programming-language-rest"

## Cohere embedding models

The Cohere family of models for embeddings includes the following models:

# [Cohere Embed v3 - English](#tab/cohere-embed-v3-english)

Cohere Embed English is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed English performs well on the HuggingFace (massive text embed) MTEB benchmark and on use-cases for various industries, such as Finance, Legal, and General-Purpose Corpora. Embed English also has the following attributes:

* Embed English has 1,024 dimensions.
* Context window of the model is 512 tokens


# [Cohere Embed v3 - Multilingual](#tab/cohere-embed-v3-multilingual)

Cohere Embed Multilingual is a text representation model used for semantic search, retrieval-augmented generation (RAG), classification, and clustering. Embed Multilingual supports more than 100 languages and can be used to search within a language (for example, to search with a French query on French documents) and across languages (for example, to search with an English query on Chinese documents). Embed multilingual performs well on multilingual benchmarks such as Miracl. Embed Multilingual also has the following attributes:

* Embed Multilingual has 1,024 dimensions.
* Context window of the model is 512 tokens


---

## Prerequisites

To use Cohere Embed V3 models with Azure AI Studio, you need the following prerequisites:

### A model deployment

**Deployment to serverless APIs**

Cohere Embed V3 models can be deployed to serverless API endpoints with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. 

Deployment to a serverless API endpoint doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)

### A REST client

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

> [!TIP]
> Additionally, Cohere supports the use of a tailored API for use with specific features of the model. To use the model-provider specific API, check [Cohere documentation](https://docs.cohere.com/reference/about).

## Work with embeddings

In this section, you use the [Azure AI model inference API](https://aka.ms/azureai/modelinference) with an embeddings model.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:

```http
GET /info HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

The response is as follows:


```json
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
> The context window for Cohere Embed V3 models is 512. Make sure that you don't exceed this limit when creating embeddings.

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

It can be useful to compute embeddings in input batches. The parameter `inputs` can be a list of strings, where each string is a different input. In turn the response is a list of embeddings, where each embedding corresponds to the input in the same position.


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
> Cohere Embed V3 models can take batches of 1024 at a time. When creating batches, make sure that you don't exceed this limit.

#### Create different types of embeddings

Cohere Embed V3 models can generate multiple embeddings for the same input depending on how you plan to use them. This capability allows you to retrieve more accurate embeddings for RAG patterns.

The following example shows how to create embeddings that are used to create an embedding for a document that will be stored in a vector database:


```json
{
    "input": [
        "The answer to the ultimate question of life, the universe, and everything is 42"
    ],
    "input_type": "document"
}
```

When you work on a query to retrieve such a document, you can use the following code snippet to create the embeddings for the query and maximize the retrieval performance.


```json
{
    "input": [
        "What's the ultimate meaning of life?"
    ],
    "input_type": "query"
}
```

Cohere Embed V3 models can optimize the embeddings based on its use case.

::: zone-end

## More inference examples

| Description                               | Language          | Sample                                                          |
|-------------------------------------------|-------------------|-----------------------------------------------------------------|
| Web requests                              | Bash              | [Command-R](https://aka.ms/samples/cohere-command-r/webrequests) - [Command-R+](https://aka.ms/samples/cohere-command-r-plus/webrequests) |
| Azure AI Inference package for JavaScript | JavaScript        | [Link](https://aka.ms/azsdk/azure-ai-inference/javascript/samples)  |
| Azure AI Inference package for Python     | Python            | [Link](https://aka.ms/azsdk/azure-ai-inference/python/samples)      |
| OpenAI SDK (experimental)                 | Python            | [Link](https://aka.ms/samples/cohere-command/openaisdk)             |
| LangChain                                 | Python            | [Link](https://aka.ms/samples/cohere/langchain)                     |
| Cohere SDK                                | Python            | [Link](https://aka.ms/samples/cohere-python-sdk)                    |
| LiteLLM SDK                               | Python            | [Link](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/litellm.ipynb) |

#### Retrieval Augmented Generation (RAG) and tool use samples

| Description | Packages   | Sample          |
|-------------|------------|-----------------|
| Create a local Facebook AI similarity search (FAISS) vector index, using Cohere embeddings - Langchain | `langchain`, `langchain_cohere` | [cohere_faiss_langchain_embed.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere_faiss_langchain_embed.ipynb) |
| Use Cohere Command R/R+ to answer questions from data in local FAISS vector index - Langchain |`langchain`, `langchain_cohere` | [command_faiss_langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_faiss_langchain.ipynb) |
| Use Cohere Command R/R+ to answer questions from data in AI search vector index - Langchain | `langchain`, `langchain_cohere` | [cohere-aisearch-langchain-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-langchain-rag.ipynb) |
| Use Cohere Command R/R+ to answer questions from data in AI search vector index - Cohere SDK | `cohere`, `azure_search_documents` | [cohere-aisearch-rag.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/cohere-aisearch-rag.ipynb) |
| Command R+ tool/function calling, using LangChain | `cohere`, `langchain`, `langchain_cohere` | [command_tools-langchain.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/cohere/command_tools-langchain.ipynb) |


## Cost and quota considerations for Cohere family of models deployed as serverless API endpoints

Cohere models deployed as a serverless API are offered by Cohere through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see monitor costs for models offered throughout the Azure Marketplace.

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 

## Related content


* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)