---
title: Azure AI Model Inference API
titleSuffix: Azure AI Studio
description: Learn about how to use the Azure AI Model Inference API
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: fasantia 
reviewer: santiagxf
ms.author: mopeakande
author: msakande
ms.custom: 
 - build-2024
---

# Azure AI Model Inference API | Azure AI Studio

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

The Azure AI Model Inference is an API that exposes a common set of capabilities for foundational models and that can be used by developers to consume predictions from a diverse set of models in a uniform and consistent way. Developers can talk with different models deployed in Azure AI Studio without changing the underlying code they are using.

## Benefits

Foundational models, such as language models, have indeed made remarkable strides in recent years. These advancements have revolutionized various fields, including natural language processing and computer vision, and they have enabled applications like chatbots, virtual assistants, and language translation services.

While foundational models excel in specific domains, they lack a uniform set of capabilities. Some models are better at specific task and even across the same task, some models may approach the problem in one way while others in another. Developers can benefit from this diversity by **using the right model for the right job** allowing them to:

> [!div class="checklist"]
> * Improve the performance in a specific downstream task.
> * Use more efficient models for simpler tasks.
> * Use smaller models that can run faster on specific tasks.
> * Compose multiple models to develop intelligent experiences.

Having a uniform way to consume foundational models allow developers to realize all those benefits without sacrificing portability or changing the underlying code.

## Availability

The Azure AI Model Inference API is available in the following models:

Models deployed to [serverless API endpoints](../how-to/deploy-models-serverless.md):

> [!div class="checklist"]
> * [Cohere Embed V3](../how-to/deploy-models-cohere-embed.md) family of models
> * [Cohere Command R](../how-to/deploy-models-cohere-command.md) family of models
> * [Meta Llama 2 chat](../how-to/deploy-models-llama.md) family of models
> * [Meta Llama 3 instruct](../how-to/deploy-models-llama.md) family of models
> * [Mistral-Small](../how-to/deploy-models-mistral.md)
> * [Mistral-Large](../how-to/deploy-models-mistral.md)
> * [Jais](../how-to/deploy-jais-models.md) family of models
> * [Jamba](../how-to/deploy-models-jamba.md) family of models
> * [Phi-3](../how-to/deploy-models-phi-3.md) family of models

Models deployed to [managed inference](../concepts/deployments-overview.md):

> [!div class="checklist"]
> * [Meta Llama 3 instruct](../how-to/deploy-models-llama.md) family of models
> * [Phi-3](../how-to/deploy-models-phi-3.md) family of models
> * Mixtral famility of models

The API is compatible with Azure OpenAI model deployments.

> [!NOTE]
> The Azure AI model inference API is available in managed inference (Managed Online Endpoints) for __models deployed after June 24th, 2024__. To take advance of the API, redeploy your endpoint if the model has been deployed before such date.

## Capabilities

The following section describes some of the capabilities the API exposes. For a full specification of the API, view the [reference section](reference-model-inference-info.md).

### Modalities

The API indicates how developers can consume predictions for the following modalities:

* [Get info](reference-model-inference-info.md): Returns the information about the model deployed under the endpoint.
* [Text embeddings](reference-model-inference-embeddings.md): Creates an embedding vector representing the input text.
* [Text completions](reference-model-inference-completions.md): Creates a completion for the provided prompt and parameters.
* [Chat completions](reference-model-inference-chat-completions.md): Creates a model response for the given chat conversation.
* [Image embeddings](reference-model-inference-images-embeddings.md): Creates an embedding vector representing the input text and image.


### Inference SDK support

You can use streamlined inference clients in the language of your choice to consume predictions from models running the Azure AI model inference API.

# [Python](#tab/python)

Install the package `azure-ai-inference` using your package manager, like pip:

```bash
pip install azure-ai-inference
```

Then, you can use the package to consume the model. The following example shows how to create a client to consume chat completions:

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZUREAI_ENDPOINT_URL"],
    credential=AzureKeyCredential(os.environ["AZUREAI_ENDPOINT_KEY"]),
)
```

If you are using an endpoint with support for Entra ID, you can create your client as follows:

```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.identity import AzureDefaultCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZUREAI_ENDPOINT_URL"],
    credential=AzureDefaultCredential(),
)
```

Explore our [samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/ai/azure-ai-inference/samples) and read the [API reference documentation](https://aka.ms/azsdk/azure-ai-inference/python/reference) to get yourself started.

# [JavaScript](#tab/javascript)

Install the package `@azure-rest/ai-inference` using npm:

```bash
npm install @azure-rest/ai-inference
```

Then, you can use the package to consume the model. The following example shows how to create a client to consume chat completions:

```javascript
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new ModelClient(
    process.env.AZUREAI_ENDPOINT_URL, 
    new AzureKeyCredential(process.env.AZUREAI_ENDPOINT_KEY)
);
```

For endpoint with support for Microsoft Entra ID, you can create your client as follows:

```javascript
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureDefaultCredential } from "@azure/identity";

const client = new ModelClient(
    process.env.AZUREAI_ENDPOINT_URL, 
    new AzureDefaultCredential()
);
```

Explore our [samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/ai/ai-inference-rest/samples) and read the [API reference documentation](https://aka.ms/AAp1kxa) to get yourself started.

# [REST](#tab/rest)

Use the reference section to explore the API design and which parameters are available. For example, the reference section for [Chat completions](reference-model-inference-chat-completions.md) details how to use the route `/chat/completions` to generate predictions based on chat-formatted instructions:

__Request__

```HTTP/1.1
POST /chat/completions?api-version=2024-04-01-preview
Authorization: Bearer <bearer-token>
Content-Type: application/json
```
---

### Extensibility

The Azure AI Model Inference API specifies a set of modalities and parameters that models can subscribe to. However, some models may have further capabilities that the ones the API indicates. On those cases, the API allows the developer to pass them as extra parameters in the payload.

By setting a header `extra-parameters: pass-through`, the API will attempt to pass any unknown parameter directly to the underlying model. If the model can handle that parameter, the request completes.

The following example shows a request passing the parameter `safe_prompt` supported by Mistral-Large, which isn't specified in the Azure AI Model Inference API. 

# [Python](#tab/python)

```python
from azure.ai.inference.models import SystemMessage, UserMessage

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    model_extras={
        "safe_mode": True
    }
)

print(response.choices[0].message.content)
```

> [!TIP]
> When using Azure AI Inference SDK, using `model_extras` configures the request with `extra-parameters: pass-through` automatically for you.

# [JavaScript](#tab/javascript)

```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    "extra-parameters": "pass-through",
    body: {
        messages: messages,
        safe_mode: true
    }
});

console.log(response.choices[0].message.content)
```

# [REST](#tab/rest)

__Request__

```HTTP/1.1
POST /chat/completions?api-version=2024-04-01-preview
Authorization: Bearer <bearer-token>
Content-Type: application/json
extra-parameters: pass-through
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

---

> [!NOTE]
> The default value for `extra-parameters` is `error` which returns an error if an extra parameter is indicated in the payload. Alternatively, you can set `extra-parameters: drop` to drop any unknown parameter in the request. Use this capability in case you happen to be sending requests with extra parameters that you know the model won't support but you want the request to completes anyway. A typical example of this is indicating `seed` parameter.

### Models with disparate set of capabilities

The Azure AI Model Inference API indicates a general set of capabilities but each of the models can decide to implement them or not. A specific error is returned on those cases where the model can't support a specific parameter.

The following example shows the response for a chat completion request indicating the parameter `reponse_format` and asking for a reply in `JSON` format. In the example, since the model doesn't support such capability an error 422 is returned to the user. 

# [Python](#tab/python)

```python
import json
from azure.ai.inference.models import SystemMessage, UserMessage, ChatCompletionsResponseFormat
from azure.core.exceptions import HttpResponseError

try:
    response = model.complete(
        messages=[
            SystemMessage(content="You are a helpful assistant."),
            UserMessage(content="How many languages are in the world?"),
        ],
        response_format={ "type": ChatCompletionsResponseFormat.JSON_OBJECT }
    )
except HttpResponseError as ex:
    if ex.status_code == 422:
        response = json.loads(ex.response._content.decode('utf-8'))
        if isinstance(response, dict) and "detail" in response:
            for offending in response["detail"]:
                param = ".".join(offending["loc"])
                value = offending["input"]
                print(
                    f"Looks like the model doesn't support the parameter '{param}' with value '{value}'"
                )
    else:
        raise ex
```

# [JavaScript](#tab/javascript)

```javascript
try {
    var messages = [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: "How many languages are in the world?" },
    ];
    
    var response = await client.path("/chat/completions").post({
        body: {
            messages: messages,
            response_format: { type: "json_object" }
        }
    });
}
catch (error) {
    if (error.status_code == 422) {
        var response = JSON.parse(error.response._content)
        if (response.detail) {
            for (const offending of response.detail) {
                var param = offending.loc.join(".")
                var value = offending.input
                console.log(`Looks like the model doesn't support the parameter '${param}' with value '${value}'`)
            }
        }
    }
    else 
    {
        throw error
    }
}
```

# [REST](#tab/rest)

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
---

> [!TIP]
> You can inspect the property `details.loc` to understand the location of the offending parameter and `details.input` to see the value that was passed in the request.

## Content safety

The Azure AI model inference API supports [Azure AI Content Safety](../concepts/content-filtering.md). When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.

The following example shows the response for a chat completion request that has triggered content safety. 

# [Python](#tab/python)

```python
from azure.ai.inference.models import AssistantMessage, UserMessage, SystemMessage
from azure.core.exceptions import HttpResponseError

try:
    response = model.complete(
        messages=[
            SystemMessage(content="You are an AI assistant that helps people find information."),
            UserMessage(content="Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."),
        ]
    )

    print(response.choices[0].message.content)

except HttpResponseError as ex:
    if ex.status_code == 400:
        response = json.loads(ex.response._content.decode('utf-8'))
        if isinstance(response, dict) and "error" in response:
            print(f"Your request triggered an {response['error']['code']} error:\n\t {response['error']['message']}")
        else:
            raise ex
    else:
        raise ex
```

# [JavaScript](#tab/javascript)

```javascript
try {
    var messages = [
        { role: "system", content: "You are an AI assistant that helps people find information." },
        { role: "user", content: "Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills." },
    ]

    var response = await client.path("/chat/completions").post({
        body: {
            messages: messages,
        }
    });
    
    console.log(response.body.choices[0].message.content)
}
catch (error) {
    if (error.status_code == 400) {
        var response = JSON.parse(error.response._content)
        if (response.error) {
            console.log(`Your request triggered an ${response.error.code} error:\n\t ${response.error.message}`)
        }
        else
        {
            throw error
        }
    }
}
```

# [REST](#tab/rest)

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
        "content": "Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."
    }
    ],
    "temperature": 0,
    "top_p": 1,
}
```

__Response__

```JSON
{
    "status": 400,
    "code": "content_filter",
    "message": "The response was filtered",
    "param": "messages",
    "type": null
}
```
---

## Getting started

The Azure AI Model Inference API is currently supported in certain models deployed as [Serverless API endpoints](../how-to/deploy-models-serverless.md) and Managed Online Endpoints. Deploy any of the [supported models](#availability) and use the exact same code to consume their predictions.

# [Python](#tab/python)

The client library `azure-ai-inference` does inference, including chat completions, for AI models deployed by Azure AI Studio and Azure Machine Learning Studio. It supports Serverless API endpoints and Managed Compute endpoints (formerly known as Managed Online Endpoints).

Explore our [samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/ai/azure-ai-inference/samples) and read the [API reference documentation](https://aka.ms/azsdk/azure-ai-inference/python/reference) to get yourself started.

# [JavaScript](#tab/javascript)

The client library `@azure-rest/ai-inference` does inference, including chat completions, for AI models deployed by Azure AI Studio and Azure Machine Learning Studio. It supports Serverless API endpoints and Managed Compute endpoints (formerly known as Managed Online Endpoints).

Explore our [samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/ai/ai-inference-rest/samples) and read the [API reference documentation](https://aka.ms/AAp1kxa) to get yourself started.

# [REST](#tab/rest)

Explore the reference section of the Azure AI model inference API to see parameters and options to consume models, including chat completions models, deployed by Azure AI Studio and Azure Machine Learning Studio. It supports Serverless API endpoints and Managed Compute endpoints (formerly known as Managed Online Endpoints).

* [Get info](reference-model-inference-info.md): Returns the information about the model deployed under the endpoint.
* [Text embeddings](reference-model-inference-embeddings.md): Creates an embedding vector representing the input text.
* [Text completions](reference-model-inference-completions.md): Creates a completion for the provided prompt and parameters.
* [Chat completions](reference-model-inference-chat-completions.md): Creates a model response for the given chat conversation.
* [Image embeddings](reference-model-inference-images-embeddings.md): Creates an embedding vector representing the input text and image.

---
