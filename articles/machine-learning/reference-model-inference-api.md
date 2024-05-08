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
---

# Azure AI Model Inference API

The Azure AI Model Inference is an API that exposes a common set of capabilities for foundational models and that can be used by developers to consume predictions from a diverse set of models in a uniform and consistent way. Developers can talk with different models deployed in Azure Machine Learning without changing the underlying code they are using.

## Benefits


## Availability

The Azure AI Model Inference API is available in the following models:

Models deployed to [serverless API endpoints](how-to-deploy-models-serverless.md):

> [!div class="checklist"]
> * [Cohere Embed V3](how-to-deploy-models-cohere-embed.md) family of models
> * [Cohere Command R+](how-to-deploy-models-cohere-command.md)
> * [Llama2](how-to-deploy-models-llama.md) family of models
> * [Llama3](how-to-deploy-models-llama.md) family of models
> * [Mistral-Small](how-to-deploy-models-mistral.md)
> * [Mistral-Large](how-to-deploy-models-mistral.md)
> * [Phi-3](how-to-deploy-models-phi3.md) family of models

The API is compatible with Azure OpenAI model deployments.

## Capabilities

### Modalities

The API indicates how developers can consume predictions for the following modalities:

* [Text embeddings](reference-model-inference-embeddings.md): Creates an embedding vector representing the input text.
* [Text completions](reference-model-inference-completions.md): Creates a completion for the provided prompt and parameters.
* [Chat completions](reference-model-inference-chat.md): Creates a model response for the given chat conversation.
* [Image embeddings](reference-model-inference-images-embeddings.md): Creates an embedding vector representing the input text and image.

### Models with dispare set of capabilities

The Azure AI Model Inference API indicates a general set of capabilities but each of the models can decide to implement them or not. On those cases were the model can't support an specific parameter, a response error indicating that will be returned

The following example shows the response for a chat completions request indicating the parameter `reponse_format` and asking for a reply in `JSON` format. In the example, since the model doesn't support such capability an error 422 is returned to the user. 

> [!TIP]
> You can inspect the property `details.loc` to understand the location of the offending parameter and `details.input` to see the value that was passed in the request.

```HTTP 422 Unprocessable content
{
    "code": "parameter_not_supported",
    "detail": {
        "loc": [ "body", "response_format" ],
        "input": "json_object"
    },
    "message": "One of the parameters contain invalid values.",
    "status": 422
}
```

### Extensibility

The Azure AI Model Inference API specify a set of modalities and parameters that models can subscribe to. However, some models may have further capabilities that the API indicates and on those cases the API allow the developer to pass them as "extras".

By setting a header `extra-parameters: allow`, the API will attempt to pass any unknown parameter directly to the underlying model. If the model can handle that parameter, the request completes.

The following example shows a request passing the parameter `safe_prompt` supported by Mistral-Large, yet no specified in the Azure AI Model Inference API:

```http POST
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

