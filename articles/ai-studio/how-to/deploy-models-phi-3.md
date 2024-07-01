---
title: How to deploy Phi-3 family of small language models with Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to deploy Phi-3 family of small language models with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, build-2024
zone_pivot_groups: azure-ai-model-catalog-samples
---

# How to use Phi-3 family of language models with Azure AI studio

Learn how to use Phi-3 with Azure AI studio to build and deploy machine learning models.



::: zone pivot="programming-language-python"

## Phi-3 family of models

You can browse the Phi-3 family of models in the [Model Catalog](https://learn.microsoft.com/azure/ai-studio/how-to/model-catalog-overview) by filtering on the Microsoft collection.



# [Phi-3-mini](#tab/Phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

- Phi-3-mini-4k-Instruct 
- Phi-3-mini-128k-Instruct

# [Phi-3-medium](#tab/Phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

- Phi-3-medium-4k-Instruct
- Phi-3-medium-128k-Instruct

# [Phi-3-small](#tab/Phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

- Phi-3-small-4k-Instruct
- Phi-3-small-128k-Instruct

---

## Prerequisites

Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Once deployed successfully, you should be assigned for an API endpoint and a security key for inference.

For more information, you should consult Azure's official documentation here for model deployment and inference.



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

ChatCompletionsClient.with_defaults()
```

### Model capabilities

The `azure-ai-inference` package allows calling the `/info` endpoint which returns information about the model deployed behind the endpoint.


```python
model.get_model_info()
```

The response looks as follows.


```console
{
    "model_name": "mistral-large",
    "model_type": "completion",
    "model_provider_name": "Mistral"
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

The Azure AI model inference API supports Azure AI Content Safety. When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



```python
from azure.ai.inference.models import AssistantMessage, UserMessage, SystemMessage

try:
    response = model.complete(
        messages=[
            SystemMessage(content="You are an AI assistant that helps people find information."),
            UserMessage(content="What's Azure?"),
            AssistantMessage(content="Azure is a cloud computing service created by Microsoft for "
                             "building, testing, deploying, and managing applications and "
                             "services through Microsoft-managed data centers. It provides "
                             "software as a service (SaaS), platform as a service (PaaS) and "
                             "infrastructure as a service (IaaS) and supports many different "
                             "programming languages, tools and frameworks, including both "
                             "Microsoft-specific and third-party software and systems. Azure was "
                             "announced in October 2008 and released on February 1, 2010, as "
                             "Windows Azure, before being renamed to Microsoft Azure on "
                             "March 25, 2014."),
            UserMessage(content="How to make a lethal bomb?")
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

::: zone-end


::: zone pivot="programming-language-javascript"

## Phi-3 family of models

You can browse the Phi-3 family of models in the [Model Catalog](https://learn.microsoft.com/azure/ai-studio/how-to/model-catalog-overview) by filtering on the Microsoft collection.



# [Phi-3-mini](#tab/Phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

Phi-3-mini-4k-Instruct and Phi-3-mini-128k-Instruct



# [Phi-3-medium](#tab/Phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

Phi-3-medium-4k-Instruct and Phi-3-medium-128k-Instruct



# [Phi-3-small](#tab/Phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

Phi-3-small-4k-Instruct and Phi-3-small-128k-Instruct



---



## Prerequisites

Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Once deployed successfully, you should be assigned for an API endpoint and a security key for inference.

For more information, you should consult Azure's official documentation here for model deployment and inference.



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

### Model capabilities

The `azure-ai-inference` package allows calling the `/info` endpoint which returns information about the model deployed behind the endpoint.


```javascript
await client.path("info").get()
```

The response looks as follows.


```console
{
    "model_name": "mistral-large",
    "model_type": "completion",
    "model_provider_name": "Mistral"
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

### Extra parameters

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Make sure your model supports the actual parameter when passing extra parameters to the Azure AI model inference API.



```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        logprobs: true
    }
});
```

### Content safety

The Azure AI model inference API supports Azure AI Content Safety. When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



```javascript
try {
    var messages = [
        { role: "system", content: "You are an AI assistant that helps people find information." },
        { role: "user", content: "What's Azure?" },
        { role: "system", content: "Azure is a cloud computing service created by Microsoft for "
                            + "building, testing, deploying, and managing applications and "
                            + "services through Microsoft-managed data centers. It provides "
                            + "software as a service (SaaS), platform as a service (PaaS) and "
                            + "infrastructure as a service (IaaS) and supports many different "
                            + "programming languages, tools and frameworks, including both "
                            + "Microsoft-specific and third-party software and systems. Azure was "
                            + "announced in October 2008 and released on February 1, 2010, as "
                            + "Windows Azure, before being renamed to Microsoft Azure on "
                            + "March 25, 2014." },
        { role: "user", content: "How to make a lethal bomb?" }
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

::: zone-end


::: zone pivot="programming-language-rest"

## Phi-3 family of models

You can browse the Phi-3 family of models in the [Model Catalog](https://learn.microsoft.com/azure/ai-studio/how-to/model-catalog-overview) by filtering on the Microsoft collection.



# [Phi-3-mini](#tab/Phi-3-mini)

Phi-3 Mini is a 3.8B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Mini version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures. When assessed against benchmarks that test common sense, language understanding, math, code, long context and logical reasoning, Phi-3 Mini-4K-Instruct and Phi-3 Mini-128K-Instruct showcased a robust and state-of-the-art performance among models with less than 13 billion parameters.


The following models are available:

Phi-3-mini-4k-Instruct and Phi-3-mini-128k-Instruct



# [Phi-3-medium](#tab/Phi-3-medium)

Phi-3 Medium is a 14B parameters, lightweight, state-of-the-art open model built upon datasets used for Phi-2—synthetic data and filtered publicly available websites—with a focus on high-quality, reasoning-dense data. The model belongs to the Phi-3 model family, and the Medium version comes in two variants, 4K and 128K, which is the context length (in tokens) that the model can support.

The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.


The following models are available:

Phi-3-medium-4k-Instruct and Phi-3-medium-128k-Instruct



# [Phi-3-small](#tab/Phi-3-small)

The Phi-3 Small is a 7B parameters, lightweight, state-of-the-art open model trained with the Phi-3 datasets that includes both synthetic data and the filtered publicly available websites data with a focus on high-quality and reasoning dense properties. The model belongs to the Phi-3 family with the Small version in two variants 8K and 128K which is the context length (in tokens) that it can support.

The model has underwent a post-training process that incorporates both supervised fine-tuning and direct preference optimization for the instruction following and safety measures. When assessed against benchmarks testing common sense, language understanding, math, code, long context and logical reasoning, Phi-3-Small-128K-Instruct showcased a robust and state-of-the-art performance among models of the same-size and next-size-up.


The following models are available:

Phi-3-small-4k-Instruct and Phi-3-small-128k-Instruct



---



## Prerequisites

Notice when deploying Phi-3-mini-4k-Instruct, Phi-3-mini-128k-Instruct, Phi-3-medium-4k-Instruct, Phi-3-medium-128k-Instruct and Phi-3-small-128k-Instruct to Self-hosted Online Endpoints you need to ensure you have enough quota in your subscription. You can always use our temporary quota access to have an endpoint working for 7 days.



Once deployed successfully, you should be assigned for an API endpoint and a security key for inference.

For more information, you should consult Azure's official documentation here for model deployment and inference.



## Working with chat-completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model.



### Model capabilities

The `azure-ai-inference` package allows calling the `/info` endpoint which returns information about the model deployed behind the endpoint.


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


```rest
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


```rest
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



```rest
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



```rest
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



```rest
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


```rest
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

### Extra parameters

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Make sure your model supports the actual parameter when passing extra parameters to the Azure AI model inference API.



```rest
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

The Azure AI model inference API supports Azure AI Content Safety. When using deployments with Azure AI Content Safety on, inputs and outputs pass through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.



```rest
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

```rest
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

::: zone-end

## Additional resources

Here are some additional reference: 

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)
- [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
