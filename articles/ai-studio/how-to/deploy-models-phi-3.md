---
title: How to use Phi-3 family of language models with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Phi-3 family of small language models with Azure AI Studio.
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/02/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024
zone_pivot_groups: azure-ai-model-catalog-samples
---

# How to use Phi-3 family of language models with Azure AI studio

In this guide, you will learn about Phi-3 models and how to use them with Azure AI studio.

The Phi-3 family of SLMs is a collection of instruction-tuned generative text models. Phi-3 models are the most capable and cost-effective small language models (SLMs) available, outperforming models of the same size and next size up across various language, reasoning, coding, and math benchmarks.




::: zone pivot="programming-language-python"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Deploy the model to our managed inference solution which allow you to customize and control all the details about how this model is served.

> [!TIP]
> Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Phi-3 models can be [deployed as serverless APIs](how-to/deploy-models-serverless.md) with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If you haven't deploy the model yet, use [the Azure Machine Learning SDK, the Azure CLI, or ARM templates to deploy the model](how-to/deploy-models-serverless.md).



### Install the inference package

Install the inference package: You can consume predictions from this model using the `azure-ai-inference` package with Python.

* Python 3.8 or later installed, including pip.
* To construct the client library, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.
  
To install the Azure AI Inferencing package use the following command:

```bash
pip install azure-ai-inference
```



## Working with chat-completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model.



```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZUREAI_ENDPOINT_URL"],
    credential=AzureKeyCredential(os.environ["AZUREAI_ENDPOINT_KEY"]),
)
```

When deploying the model to a self-hosted online endpoint with **Entra ID** support, you can use the following code snippet to create a client.


```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

model = ChatCompletionsClient(
    endpoint=os.environ["AZUREAI_ENDPOINT_URL"],
    credential=DefaultAzureCredential(),
)
```

> [!NOTE]
> Serverless API endpoints do not support using Entra ID for authentication by the moment.



### Model capabilities

The `/info` route returns information about the model deployed behind the endpoint. Such information can be obtained by calling the following method:



```python
model.get_model_info()
```

The response looks as follows.


```console
{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}
```

### Working with chat completions

Let's create a simple chat completion request to see the output of the model.


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
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct doesn't support system messages (`role="system"`). When using the Azure AI model inference API, system messages are translated to user messages which is the closer capability available. This translation is offered for convenience but it's important to verify that the model is following the instructions in the system message with the right level of confidence.



The response looks as follows, where you can see the model's usage statistics.


```python
print("Response:", response.choices[0].message.content)
print("Model:", response.model)
print("Usage:", response.usage)
```

#### Streaming content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

To get the content sooner as it's being generated, you can 'stream' the content. This allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when calling the model. This will return an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field rather than the message field.



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

To visualize the output, let's define a helper function to print the stream.


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

Responses look as follows when using streaming:



```python
print_stream(result)
```

#### Parameters

Explore additional parameters that can be indicated in the inference client. For a full list of all the supported parameters and their corresponding documentation you can see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```python
from azure.ai.inference.models import ChatCompletionsResponseFormat

response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    presence_penalty="0.1",
    frequency_penalty="0.8",
    max_tokens=2048,
    stop=["<|endoftext|>"],
    temperature=0,
    top_p=1,
    response_format={ "type": ChatCompletionsResponseFormat.TEXT },
)
```

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Extra parameters

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Make sure your model supports the actual parameter when passing extra parameters to the Azure AI model inference API.



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

The Azure AI model inference API supports [Azure AI Content Safety](https://aka.ms/azureaicontentsafety). When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



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
> To learn more about how you can configure and control Azure AI Content Safety settings, check the [Azure AI Content Safety documentation](https://aka.ms/azureaicontentsafety).



::: zone-end


::: zone pivot="programming-language-javascript"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Deploy the model to our managed inference solution which allow you to customize and control all the details about how this model is served.

> [!TIP]
> Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Phi-3 models can be [deployed as serverless APIs](how-to/deploy-models-serverless.md) with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If you haven't deploy the model yet, use [the Azure Machine Learning SDK, the Azure CLI, or ARM templates to deploy the model](how-to/deploy-models-serverless.md).



### Install the inference package

You can consume predictions from this model using the `@azure-rest/ai-inference` package from `npm`. You need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* To construct the client library, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.

Install the Azure ModelClient REST client REST client library for JavaScript with `npm`:

```bash
npm install @azure-rest/ai-inference
```



## Working with chat-completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

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

When deploying the model to a self-hosted online endpoint with **Entra ID** support, you can use the following code snippet to create a client.


```javascript
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { DefaultAzureCredential }  from "@azure/identity";

const client = new ModelClient(
    process.env.AZUREAI_ENDPOINT_URL, 
    new DefaultAzureCredential()
);
```

> [!NOTE]
> Serverless API endpoints do not support using Entra ID for authentication by the moment.



### Model capabilities

The `/info` route returns information about the model deployed behind the endpoint. Such information can be obtained by calling the following method:



```javascript
await client.path("info").get()
```

The response looks as follows.


```console
{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}
```

### Working with chat completions

Let's create a simple chat completion request to see the output of the model.


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
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct doesn't support system messages (`role="system"`). When using the Azure AI model inference API, system messages are translated to user messages which is the closer capability available. This translation is offered for convenience but it's important to verify that the model is following the instructions in the system message with the right level of confidence.



The response looks as follows, where you can see the model's usage statistics.


```javascript
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log(response.body.choices[0].message.content);
console.log(response.body.model);
console.log(response.body.usage);
```

#### Streaming content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

To get the content sooner as it's being generated, you can 'stream' the content. This allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when calling the model. This will return an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field rather than the message field.



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

Responses look as follows when using streaming:



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

#### Parameters

Explore additional parameters that can be indicated in the inference client. For a full list of all the supported parameters and their corresponding documentation you can see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


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



### Extra parameters

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Make sure your model supports the actual parameter when passing extra parameters to the Azure AI model inference API.



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

The Azure AI model inference API supports [Azure AI Content Safety](https://aka.ms/azureaicontentsafety). When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



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
> To learn more about how you can configure and control Azure AI Content Safety settings, check the [Azure AI Content Safety documentation](https://aka.ms/azureaicontentsafety).



::: zone-end


::: zone pivot="programming-language-rest"

## Phi-3 family of models

The Phi-3 family of models includes the following models:



# [Phi-3-mini](#tab/phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct
- Phi-3-mini-128k-Instruct



# [Phi-3-medium](#tab/phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct



# [Phi-3-small](#tab/phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct



---



## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Deploy the model to our managed inference solution which allow you to customize and control all the details about how this model is served.

> [!TIP]
> Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Phi-3 models can be [deployed as serverless APIs](how-to/deploy-models-serverless.md) with pay-as-you-go billing. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If you haven't deploy the model yet, use [the Azure Machine Learning SDK, the Azure CLI, or ARM templates to deploy the model](how-to/deploy-models-serverless.md).



### Use the Azure AI model inference API

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form https://your-host-name.your-azure-region.inference.ai.azure.com, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



## Working with chat-completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model.



When deploying the model to a self-hosted online endpoint with **Entra ID** support, you can use the following code snippet to create a client.


> [!NOTE]
> Serverless API endpoints do not support using Entra ID for authentication by the moment.



### Model capabilities

The `/info` route returns information about the model deployed behind the endpoint. Such information can be obtained by calling the following method:



The response looks as follows.


```console
{
    "model_name": "Phi-3-mini-4k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}
```

### Working with chat completions

Let's create a simple chat completion request to see the output of the model.


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
> Notice that Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct doesn't support system messages (`role="system"`). When using the Azure AI model inference API, system messages are translated to user messages which is the closer capability available. This translation is offered for convenience but it's important to verify that the model is following the instructions in the system message with the right level of confidence.



The response looks as follows, where you can see the model's usage statistics.


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

#### Streaming content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

To get the content sooner as it's being generated, you can 'stream' the content. This allows you to start processing the completion as content becomes available. To stream completions, set `stream=True` when calling the model. This will return an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field rather than the message field.



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

Responses look as follows when using streaming:



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

#### Parameters

Explore additional parameters that can be indicated in the inference client. For a full list of all the supported parameters and their corresponding documentation you can see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


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

> [!WARNING]
> Notice that Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Extra parameters

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Make sure your model supports the actual parameter when passing extra parameters to the Azure AI model inference API.



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

The Azure AI model inference API supports [Azure AI Content Safety](https://aka.ms/azureaicontentsafety). When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



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
            "content": "What's Azure?"
        },
                {
            "role": "assistant",
            "content": "Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers. It provides software as a service (SaaS), platform as a service (PaaS) and infrastructure as a service (IaaS) and supports many different programming languages, tools and frameworks, including both Microsoft-specific and third-party software and systems. Azure was announced in October 2008 and released on February 1, 2010, as Windows Azure, before being renamed to Microsoft Azure on March 25, 2014."
        },
        {
            "role": "user",
            "content": "How to make a lethal bomb?"
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
> To learn more about how you can configure and control Azure AI Content Safety settings, check the [Azure AI Content Safety documentation](https://aka.ms/azureaicontentsafety).



::: zone-end

## Cost and quotas

### Cost and quota considerations for Phi-3 family of models deployed as a service

Phi-3 models deployed as a serverless API are offered by Microsoft through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

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

