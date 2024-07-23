---
title: How to use Phi-3 chat models with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Phi-3 chat models with Azure AI studio.
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/23/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples
---

# How to use Phi-3 chat models with Azure AI studio

In this guide, you learn about Phi-3 chat models and how to use them with Azure AI studio.
The Phi-3 family of small language models (SLMs) is a collection of instruction-tuned generative text models.





::: zone pivot="programming-language-python"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model. Phi-3-Mini was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Mini-4K-Instruct and Phi-3-Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model. Phi-3-Medium was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Medium-4k-Instruct and Phi-3-Medium-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3-Small is a 7B parameters, lightweight, state-of-the-art open model. Phi-3-Small was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Small version comes in two variants, 8K and 128K. The numbers (8K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-8k-Instruct and Phi-3-Small-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models model

Phi-3 chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Phi-3 chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Phi-3 chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `azure-ai-inference` package with Python. To install this package, you need the following prerequisites:

* Python 3.8 or later installed, including pip.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.
  
Once you have these prerequisites, install the Azure AI inference package with the following command:

```bash
pip install azure-ai-inference
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```python

import os
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["AZURE_INFERENCE_CREDENTIAL"]),
)

```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```python

import os
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```python

model.get_model_info()

```

The response is as follows:



```console

{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}

```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```python

from azure.ai.inference.models import SystemMessage, UserMessage

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
)

```

> [!NOTE]
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-small-4k-Instruct, Phi-3-small-128k-Instruct and Phi-3-medium-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```python

print("Response:", response.choices[0].message.content)
print("Model:", response.model)
print("Usage:", response.usage)

```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```python

result = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    temperature=0,
    top_p=1,
    max_tokens=2048,
)

```

To visualize the output, define a helper function to print the stream.


```python

def print_stream(result):
    """
    Prints the chat completion with streaming. Some delay is added to simulate 
    a real-time conversation.
    """
    import time
    for update in result:
        print(update.choices[0].delta.content, end="")
        time.sleep(0.05)

```

When you use streaming, responses look as follows:



```python

print_stream(result)

```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```python

from azure.ai.inference.models import ChatCompletionsResponseFormat

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    presence_penalty=0.1,
    frequency_penalty=0.8,
    max_tokens=2048,
    stop=["<|endoftext|>"],
    temperature=0,
    top_p=1,
    response_format={ "type": ChatCompletionsResponseFormat.TEXT },
)

```

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```python

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    model_extras={
        "logprobs": True
    }
)

```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```python

from azure.ai.inference.models import AssistantMessage, UserMessage, SystemMessage

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

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end


::: zone pivot="programming-language-javascript"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model. Phi-3-Mini was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Mini-4K-Instruct and Phi-3-Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model. Phi-3-Medium was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Medium-4k-Instruct and Phi-3-Medium-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3-Small is a 7B parameters, lightweight, state-of-the-art open model. Phi-3-Small was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Small version comes in two variants, 8K and 128K. The numbers (8K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-8k-Instruct and Phi-3-Small-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models model

Phi-3 chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Phi-3 chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Phi-3 chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure ModelClient REST client REST client library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```javascript

import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const client = new ModelClient(
    process.env.AZURE_INFERENCE_ENDPOINT, 
    new AzureKeyCredential(process.env.AZURE_INFERENCE_CREDENTIAL)
);

```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```javascript

import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { DefaultAzureCredential }  from "@azure/identity";

const client = new ModelClient(
    process.env.AZURE_INFERENCE_ENDPOINT, 
    new DefaultAzureCredential()
);

```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```javascript

await client.path("info").get()

```

The response is as follows:



```console

{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}

```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```javascript

var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
    }
});

```

> [!NOTE]
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-small-4k-Instruct, Phi-3-small-128k-Instruct and Phi-3-medium-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```javascript

if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.body.choices[0].message.content);
console.log(response.body.model);
console.log(response.body.usage);

```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```javascript

var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
    }
}).asNodeStream();

```

When you use streaming, responses look as follows:



```javascript

var stream = response.body;
if (!stream) {
    throw new Error("The response stream is undefined");
}

if (response.status !== "200") {
    throw new Error(`Failed to get chat completions: ${response.body.error}`);
}

var sses = createSseStream(stream);

for await (const event of sses) {
    if (event.data === "[DONE]") {
        return;
    }
    for (const choice of (JSON.parse(event.data)).choices) {
        console.log(choice.delta?.content ?? "");
    }
}

```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```javascript

var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        presence_penalty = "0.1",
        frequency_penalty = "0.8",
        max_tokens = 2048,
        stop =["<|endoftext|>"],
        temperature = 0,
        top_p = 1,
        response_format = { "type": "text" },
    }
});

```

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```javascript

var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    headers: {
        "extra-params": "passthrough"
    },
    body: {
        messages: messages,
        logprobs: true
    }
});

```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



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

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end


::: zone pivot="programming-language-csharp"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model. Phi-3-Mini was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Mini-4K-Instruct and Phi-3-Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model. Phi-3-Medium was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Medium-4k-Instruct and Phi-3-Medium-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3-Small is a 7B parameters, lightweight, state-of-the-art open model. Phi-3-Small was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Small version comes in two variants, 8K and 128K. The numbers (8K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-8k-Instruct and Phi-3-Small-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models model

Phi-3 chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Phi-3 chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Phi-3 chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `Azure.AI.Inference` package from [Nuget](https://www.nuget.org/). To install this package, you need the following prerequisites:

* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure AI inference library with the following command:

```dotnetcli
dotnet add package Azure.AI.Inference --prerelease
```

You can also authenticate with Microsoft Entra ID (formerly Azure Active Directory). To use credential providers provided with the Azure SDK, please install the `Azure.Identity` package:

```dotnetcli
dotnet add package Azure.Identity
```



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



```csharp

ChatCompletionsClient client = null;

client = new ChatCompletionsClient(
    new Uri(Environment.GetEnvironmentVariable("AZURE_INFERENCE_ENDPOINT")),
    new AzureKeyCredential(Environment.GetEnvironmentVariable("AZURE_INFERENCE_CREDENTIAL"))
);

```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



```csharp

client = new ChatCompletionsClient(
    new Uri(Environment.GetEnvironmentVariable("AZURE_INFERENCE_ENDPOINT")),
    new DefaultAzureCredential(includeInteractiveCredentials: true)
);

```

> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```csharp

Response<ModelInfo> modelInfo = client.GetModelInfo();

```

The response is as follows:



```console

Console.WriteLine($"Model name: {modelInfo.Value.ModelName}");
Console.WriteLine($"Model type: {modelInfo.Value.ModelType}");
Console.WriteLine($"Model provider name: {modelInfo.Value.ModelProviderName}");

```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```csharp

ChatCompletionsOptions requestOptions = null;
Response<ChatCompletions> response = null;

requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
};

response = client.Complete(requestOptions);

```

> [!NOTE]
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-small-4k-Instruct, Phi-3-small-128k-Instruct and Phi-3-medium-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```csharp

Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
Console.WriteLine($"Model: {response.Value.Model}");
Console.WriteLine($"Usage: {response.Value.Usage.TotalTokens}");

```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```csharp

static async Task RunAsync(ChatCompletionsClient client)
{
    ChatCompletionsOptions requestOptions = null;
    Response<ChatCompletions> response = null;

    requestOptions = new ChatCompletionsOptions()
    {
        Messages = {
            new ChatRequestSystemMessage("You are a helpful assistant."),
            new ChatRequestUserMessage("How many languages are in the world?")
        },
    };

    StreamingResponse<StreamingChatCompletionsUpdate> streamResponse = await client.CompleteStreamingAsync(requestOptions);

    printStream(streamResponse);
}

```

When you use streaming, responses look as follows:



```csharp

static async Task RunWithAsyncContext(ChatCompletionsClient client)
{
    // In this case we are using Nito.AsyncEx package
    AsyncContext.Run(() => RunAsync(client));
}

```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```csharp

requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
    //PresencePenalty = 0.1f,
    //FrequencyPenalty = 0.8f,
    MaxTokens = 2048,
    StopSequences = { "<|endoftext|>" },
    Temperature = 0,
    NucleusSamplingFactor = 1,
    //ResponseFormat = ChatCompletionsResponseFormat.Text
};

response = client.Complete(requestOptions);
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");

```

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```csharp

requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
    // AdditionalProperties = { { "logprobs", BinaryData.FromString("true") } },
};

response = client.Complete(requestOptions, extraParams: ExtraParameters.PassThrough);
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");

```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```csharp

try
{
    requestOptions = new ChatCompletionsOptions()
    {
        Messages = {
            new ChatRequestSystemMessage("You are an AI assistant that helps people find information."),
            new ChatRequestUserMessage("Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."),
        },
    };

    response = client.Complete(requestOptions);
    Console.WriteLine(response.Value.Choices[0].Message.Content);
}
catch (RequestFailedException ex)
{
    if (ex.ErrorCode == "content_filter")
    {
        Console.WriteLine($"Your query has trigger Azure Content Safeaty: {ex.Message}");
    }
    else
    {
        throw;
    }
}

```

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end


::: zone pivot="programming-language-rest"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model. Phi-3-Mini was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Mini-4K-Instruct and Phi-3-Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model. Phi-3-Medium was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K. The numbers (4K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Medium-4k-Instruct and Phi-3-Medium-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3-Small is a 7B parameters, lightweight, state-of-the-art open model. Phi-3-Small was trained with Phi-3 datasets that include both synthetic data and the filtered, publicly available websites data, with a focus on high quality and reasoning-dense properties.

The model belongs to the Phi-3 model family, and the Small version comes in two variants, 8K and 128K. The numbers (8K and 128K) indicate the context length (in tokens) that each model variant can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-8k-Instruct and Phi-3-Small-128k-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models model

Phi-3 chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).

> [!div class="nextstepaction"]
> [Deploy the model to serverless API endpoints](deploy-models-serverless.md)



Phi-3 chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Phi-3 chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### A REST client

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



> [!NOTE]
> Currently, serverless API endpoints do not support using Microsoft Entra ID for authentication.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



```console
{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}
```

### Create a chat completion request

Create a chat completion request to see the output of the model.


```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "How many languages are in the world?"
        }
    ]
}
```

> [!NOTE]
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-small-4k-Instruct, Phi-3-small-128k-Instruct and Phi-3-medium-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "Phi-3-mini-4k-Instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "As of now, it's estimated that there are about 7,000 languages spoken around the world. However, this number can vary as some languages become extinct and new ones develop. It's also important to note that the number of speakers can greatly vary between languages, with some having millions of speakers and others only a few hundred.",
                "tool_calls": null
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 19,
        "total_tokens": 91,
        "completion_tokens": 72
    }
}
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when you call the model. This setting returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "How many languages are in the world?"
        }
    ],
    "stream": true,
    "temperature": 0,
    "top_p": 1,
    "max_tokens": 2048
}
```

When you use streaming, responses look as follows:



```json
{
    "id": "23b54589eba14564ad8a2e6978775a39",
    "object": "chat.completion.chunk",
    "created": 1718726371,
    "model": "Phi-3-mini-4k-Instruct",
    "choices": [
        {
            "index": 0,
            "delta": {
                "role": "assistant",
                "content": ""
            },
            "finish_reason": null,
            "logprobs": null
        }
    ]
}
```

The last message in the stream will have `finish_reason` set indicating the reason for the generation process to stop.



```json
{
    "id": "23b54589eba14564ad8a2e6978775a39",
    "object": "chat.completion.chunk",
    "created": 1718726371,
    "model": "Phi-3-mini-4k-Instruct",
    "choices": [
        {
            "index": 0,
            "delta": {
                "content": ""
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 19,
        "total_tokens": 91,
        "completion_tokens": 72
    }
}
```

#### Explore more parameters

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "How many languages are in the world?"
        }
    ],
    "presence_penalty": 0.1,
    "frequency_penalty": 0.8,
    "max_tokens": 2048,
    "stop": ["<|endoftext|>"],
    "temperature" :0,
    "top_p": 1,
    "response_format": { "type": "text" }
}
```

```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "Phi-3-mini-4k-Instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "As of now, it's estimated that there are about 7,000 languages spoken around the world. However, this number can vary as some languages become extinct and new ones develop. It's also important to note that the number of speakers can greatly vary between languages, with some having millions of speakers and others only a few hundred.",
                "tool_calls": null
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 19,
        "total_tokens": 91,
        "completion_tokens": 72
    }
}
```

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "How many languages are in the world?"
        }
    ],
    "logprobs": true
}
```

### Content safety

The Azure AI model inference API supports [Azure AI content safety](https://aka.ms/azureaicontentsafety). Inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content when you use deployments with Azure AI content safety turned on. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



The following example shows how to handle events when the model detects harmful content in the input prompt and content safety is enabled.



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are an AI assistant that helps people find information."
        },
                {
            "role": "user",
            "content": "Chopping tomatoes and cutting them into cubes or wedges are great ways to practice your knife skills."
        }
    ]
}
```

```json
{
    "error": {
        "message": "The response was filtered due to the prompt triggering Microsoft's content management policy. Please modify your prompt and retry.",
        "type": null,
        "param": "prompt",
        "code": "content_filter",
        "status": 400
    }
}
```

> [!TIP]
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



> [!NOTE]
> Azure AI content safety is only available for models deployed as serverless API endpoints.



::: zone-end

## Cost and quotas

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 



### Cost and quota considerations for Phi-3 family of models deployed to managed compute

Phi-3 models deployed to managed compute are billed based on core hours of the associated compute instance. The cost of the compute instance is determined by the size of the instance, the number of instances running, and the duration it is running.

We recommend starting with a low number of instances and scaling up as needed. You can monitor the cost of the compute instance in the Azure portal.



## Additional resources

Here are some additional reference: 

* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)

