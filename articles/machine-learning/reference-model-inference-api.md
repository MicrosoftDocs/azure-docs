---
title: Azure AI Model Inference API
titleSuffix: Azure Machine Learning
description: Learn about how to use the Azure AI Model Inference API
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
ms.date: 05/03/2024
ms.reviewer: msakande 
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
---

# Azure AI Model Inference API | Azure Machine Learning

The Azure AI Model Inference is an API that exposes a common set of capabilities for foundational models and that can be used by developers to consume predictions from a diverse set of models in a uniform and consistent way. Developers can talk with different models deployed in Azure Machine Learning without changing the underlying code they are using.

## Benefits

Foundational models, such as language models, have indeed made remarkable strides in recent years. These advancements have revolutionized various fields, including natural language processing and computer vision, and they have enabled applications like chatbots, virtual assistants, and language translation services.

While foundational models excel in specific domains, they lack a uniform set of capabilities. Some models are better at specific task and even across the same task, some models may approach the problem in one way while others in another. Developers can benefit from this diversity by **using the right model for the right job** allowing them to:

> [!div class="checklist"]
> * Improve the performance in a specific downstream task.
> * Use more efficient models for simpler tasks.
> * Use smaller models that can run faster on specific tasks.
> * Compose multiple models to develop intelligent experiences.

Having a uniform way to consume foundational models allow developers to realize all those benefits without changing a single line of code on their applications.

## Availability

The Azure AI Model Inference API is available in the following models:

Models deployed to [serverless API endpoints](how-to-deploy-models-serverless.md):

> [!div class="checklist"]
> * [Cohere Embed V3](how-to-deploy-models-cohere-embed.md) family of models
> * [Cohere Command R](how-to-deploy-models-cohere-command.md) family of models
> * [Llama2](how-to-deploy-models-llama.md) family of models
> * [Llama3](how-to-deploy-models-llama.md) family of models
> * [Mistral-Small](how-to-deploy-models-mistral.md)
> * [Mistral-Large](how-to-deploy-models-mistral.md)
> * Phi-3 family of models

The API is compatible with Azure OpenAI model deployments.

## Capabilities

The following section describes some of the capabilities the API exposes. For a full specification of the API, view the [reference section](reference-model-inference-info.md).

### Modalities

The API indicates how developers can consume predictions for the following modalities:

* [Get info](reference-model-inference-info.md): Returns the information about the model deployed under the endpoint.
* [Text embeddings](reference-model-inference-embeddings.md): Creates an embedding vector representing the input text.
* [Text completions](reference-model-inference-completions.md): Creates a completion for the provided prompt and parameters.
* [Chat completions](reference-model-inference-chat-completions.md): Creates a model response for the given chat conversation.
* [Image embeddings](reference-model-inference-images-embeddings.md): Creates an embedding vector representing the input text and image.

### Extensibility

The Azure AI Model Inference API specifies a set of modalities and parameters that models can subscribe to. However, some models may have further capabilities that the ones the API indicates. On those cases, the API allows the developer to pass them as extra parameters in the payload.

By setting a header `extra-parameters: allow`, the API will attempt to pass any unknown parameter directly to the underlying model. If the model can handle that parameter, the request completes.

The following example shows a request passing the parameter `safe_prompt` supported by Mistral-Large, which isn't specified in the Azure AI Model Inference API:

__Request__

```HTTP/1.1
POST /chat/completions?api-version=2024-04-01-preview
Authorization: Bearer <bearer-token>
Content-Type: application/json
extra-parameters: allow
```

```JSON
{
    "messages": [
    {
        "role": "system",
        "content": "You are a helpful assistant"
    },
    {
        "role": "user",
        "content": "Explain Riemann's conjecture in 1 paragraph"
    }
    ],
    "temperature": 0,
    "top_p": 1,
    "response_format": { "type": "text" },
    "safe_prompt": true
}
```

> [!TIP]
> Alternatively, you can set `extra-parameters: drop` to drop any unknown parameter in the request. Use this capability in case you happen to be sending requests with extra parameters that you know the model won't support but you want the request to completes anyway. A typical example of this is indicating `seed` parameter.

### Models with disparate set of capabilities

The Azure AI Model Inference API indicates a general set of capabilities but each of the models can decide to implement them or not. A specific error is returned on those cases where the model can't support a specific parameter.

The following example shows the response for a chat completion request indicating the parameter `reponse_format` and asking for a reply in `JSON` format. In the example, since the model doesn't support such capability an error 422 is returned to the user. 

__Request__

```HTTP/1.1
POST /chat/completions?api-version=2024-04-01-preview
Authorization: Bearer <bearer-token>
Content-Type: application/json
```

```JSON
{
    "messages": [
    {
        "role": "system",
        "content": "You are a helpful assistant"
    },
    {
        "role": "user",
        "content": "Explain Riemann's conjecture in 1 paragraph"
    }
    ],
    "temperature": 0,
    "top_p": 1,
    "response_format": { "type": "json_object" },
}
```

__Response__

```JSON
{
    "status": 422,
    "code": "parameter_not_supported",
    "detail": {
        "loc": [ "body", "response_format" ],
        "input": "json_object"
    },
    "message": "One of the parameters contain invalid values."
}
```

> [!TIP]
> You can inspect the property `details.loc` to understand the location of the offending parameter and `details.input` to see the value that was passed in the request.


## Getting started

The Azure AI Model Inference API is currently supported in models deployed as [Serverless API endpoints](how-to-deploy-models-serverless.md). Deploy any of the [supported models](#availability) to a new [Serverless API endpoints](how-to-deploy-models-serverless.md) to get started. Then you can consume the API in the following ways: 

# [Studio](#tab/azure-studio)

You can use the Azure AI Model Inference API to run evaluations or while building with *Prompt flow*. Create a [Serverless Model connection](how-to-connect-models-serverless.md) to a *Serverless API endpoint* and consume its predictions. The Azure AI Model Inference API is used under the hood.

# [Python](#tab/python)

Since the API is OpenAI-compatible, you can use any supported SDK that already supports Azure OpenAI. In the following example, we show how you can use LiteLLM with the common API:

```python
import litellm

client = litellm.LiteLLM(
    base_url="https://<endpoint-name>.<region>.inference.ai.azure.com",
    api_key="<key>",
)

response = client.chat.completions.create(
    messages=[
        {
            "content": "Who is the most renowned French painter?", 
            "role": "user"
        }
    ],
    model="azureai",
    custom_llm_provider="custom_openai",
)

print(response.choices[0].message.content)
```

# [REST](#tab/rest)

Models deployed in Azure Machine Learning and Azure AI studio in Serverless API endpoints support the Azure AI Model Inference API. Each endpoint exposes the OpenAPI specification for the modalities the model support. Use the **Endpoint URI** and the **Key** to download the OpenAPI definition for the model. In the following example, we download it from a bash console. Replace `<TOKEN>` by the **Key** and `<ENDPOINT_URI>` for the **Endpoint URI**.

```bash
wget -d --header="Authorization: Bearer <TOKEN>" <ENDPOINT_URI>/swagger.json
```

Use the **Endpoint URI** and the **Key** to submit requests. The following example sends a request to a Cohere embedding model:

```HTTP/1.1
POST /embeddings?api-version=2024-04-01-preview
Authorization: Bearer <bearer-token>
Content-Type: application/json
```

```JSON
{
      "input": [
        "Explain the theory of strings"
      ],
      "input_type": "query",
      "encoding_format": "float",
      "dimensions": 1024
}
```

__Response__

```json
{
    "id": "ab1c2d34-5678-9efg-hi01-0123456789ea",
    "object": "list",
    "data": [
        {
            "index": 0,
            "object": "embedding",
            "embedding": [
                0.001912117,
                0.048706055,
                -0.06359863,
                //...
                -0.00044369698
            ]
        }
    ],
    "model": "",
    "usage": {
        "prompt_tokens": 7,
        "completion_tokens": 0,
        "total_tokens": 7
    }
}
```


---
