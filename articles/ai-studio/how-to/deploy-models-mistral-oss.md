---
title: How to use Mistral open chat models with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Mistral open chat models with Azure AI studio.
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

# How to use Mistral open chat models with Azure AI studio

In this guide, you learn about Mistral open chat models and how to use them with Azure AI studio.
Mistral AI offers two categories of models. Premium models including Mistral Large and Mistral Small, available as serverless APIs with pay-as-you-go token-based billing. Open models including Mixtral-8x7B-Instruct-v01, Mixtral-8x7B-v01, Mistral-7B-Instruct-v01, and Mistral-7B-v01; available to also download and run on self-hosted managed endpoints.




::: zone pivot="programming-language-python"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral-7B-Instruct](#tab/mistral-7b-instruct)

The Mistral-7B-Instruct Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B, a transformer model with the following architecture choices:

* Grouped-Query Attention
* Sliding-Window Attention
* Byte-fallback BPE tokenizer


The following models are available:

- mistralai-Mistral-7B-Instruct-v01
- mistralai-Mistral-7B-Instruct-v02



# [Mixtral-8x7B-Instruct](#tab/mistral-8x7B-instruct)

The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks with 6x faster inference.

Mixtral-8x7B-v0.1 is a decoder-only model with 8 distinct groups or the "experts". At every layer, for every token, a router network chooses two of these experts to process the token and combine their output additively. Mixtral has 46.7B total parameters but only uses 12.9B parameters per token using this technique. This enables the model to perform with same speed and cost as 12.9B model.


The following models are available:

- mistralai-Mixtral-8x7B-Instruct-v01



# [Mixtral-8x22B-Instruct](#tab/mistral-8x22b-instruct)

The Mixtral-8x22B-Instruct-v0.1 Large Language Model (LLM) is an instruct fine-tuned version of the Mixtral-8x22B-v0.1. It is a sparse Mixture-of-Experts (SMoE) model that uses only 39B active parameters out of 141B, offering unparalleled cost efficiency for its size.

Mixtral 8x22B comes with the following strengths:

* It is fluent in English, French, Italian, German, and Spanish
* It has strong mathematics and coding capabilities
* It is natively capable of function calling; along with the constrained output mode implemented on la Plateforme, this enables application development and tech stack modernisation at scale
* Its 64K tokens context window allows precise information recall from large documents


The following models are available:

- mistralai-Mixtral-8x22B-Instruct-v0-1



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### A deployed Mistral open chat models model

Mistral open chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Mistral open chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `azure-ai-inference` package with Python. To install this package, you need the following prerequisites:

* Python 3.8 or later installed, including pip.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.
  
Once you have these prerequisites, install the Azure AI inference package with the following command:

```bash
pip install azure-ai-inference
```



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



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

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```python

model.get_model_info()

```

The response is as follows:



```console

{
    "model_name": "mistralai-Mistral-7B-Instruct-v01",
    "model_type": "chat-completions",
    "model_provider_name": "MistralAI"
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
> Notice that mistralai-Mistral-7B-Instruct-v01, mistralai-Mistral-7B-Instruct-v02 and mistralai-Mixtral-8x22B-Instruct-v0-1 doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



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
> Notice that Mistral doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



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

::: zone-end


::: zone pivot="programming-language-javascript"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral-7B-Instruct](#tab/mistral-7b-instruct)

The Mistral-7B-Instruct Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B, a transformer model with the following architecture choices:

* Grouped-Query Attention
* Sliding-Window Attention
* Byte-fallback BPE tokenizer


The following models are available:

- mistralai-Mistral-7B-Instruct-v01
- mistralai-Mistral-7B-Instruct-v02



# [Mixtral-8x7B-Instruct](#tab/mistral-8x7B-instruct)

The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks with 6x faster inference.

Mixtral-8x7B-v0.1 is a decoder-only model with 8 distinct groups or the "experts". At every layer, for every token, a router network chooses two of these experts to process the token and combine their output additively. Mixtral has 46.7B total parameters but only uses 12.9B parameters per token using this technique. This enables the model to perform with same speed and cost as 12.9B model.


The following models are available:

- mistralai-Mixtral-8x7B-Instruct-v01



# [Mixtral-8x22B-Instruct](#tab/mistral-8x22b-instruct)

The Mixtral-8x22B-Instruct-v0.1 Large Language Model (LLM) is an instruct fine-tuned version of the Mixtral-8x22B-v0.1. It is a sparse Mixture-of-Experts (SMoE) model that uses only 39B active parameters out of 141B, offering unparalleled cost efficiency for its size.

Mixtral 8x22B comes with the following strengths:

* It is fluent in English, French, Italian, German, and Spanish
* It has strong mathematics and coding capabilities
* It is natively capable of function calling; along with the constrained output mode implemented on la Plateforme, this enables application development and tech stack modernisation at scale
* Its 64K tokens context window allows precise information recall from large documents


The following models are available:

- mistralai-Mixtral-8x22B-Instruct-v0-1



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### A deployed Mistral open chat models model

Mistral open chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Mistral open chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### The inference package installed

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure ModelClient REST client REST client library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



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

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```javascript

await client.path("info").get()

```

The response is as follows:



```console

{
    "model_name": "mistralai-Mistral-7B-Instruct-v01",
    "model_type": "chat-completions",
    "model_provider_name": "MistralAI"
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
> Notice that mistralai-Mistral-7B-Instruct-v01, mistralai-Mistral-7B-Instruct-v02 and mistralai-Mixtral-8x22B-Instruct-v0-1 doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



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
> Notice that Mistral doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



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

::: zone-end


::: zone pivot="programming-language-csharp"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral-7B-Instruct](#tab/mistral-7b-instruct)

The Mistral-7B-Instruct Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B, a transformer model with the following architecture choices:

* Grouped-Query Attention
* Sliding-Window Attention
* Byte-fallback BPE tokenizer


The following models are available:

- mistralai-Mistral-7B-Instruct-v01
- mistralai-Mistral-7B-Instruct-v02



# [Mixtral-8x7B-Instruct](#tab/mistral-8x7B-instruct)

The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks with 6x faster inference.

Mixtral-8x7B-v0.1 is a decoder-only model with 8 distinct groups or the "experts". At every layer, for every token, a router network chooses two of these experts to process the token and combine their output additively. Mixtral has 46.7B total parameters but only uses 12.9B parameters per token using this technique. This enables the model to perform with same speed and cost as 12.9B model.


The following models are available:

- mistralai-Mixtral-8x7B-Instruct-v01



# [Mixtral-8x22B-Instruct](#tab/mistral-8x22b-instruct)

The Mixtral-8x22B-Instruct-v0.1 Large Language Model (LLM) is an instruct fine-tuned version of the Mixtral-8x22B-v0.1. It is a sparse Mixture-of-Experts (SMoE) model that uses only 39B active parameters out of 141B, offering unparalleled cost efficiency for its size.

Mixtral 8x22B comes with the following strengths:

* It is fluent in English, French, Italian, German, and Spanish
* It has strong mathematics and coding capabilities
* It is natively capable of function calling; along with the constrained output mode implemented on la Plateforme, this enables application development and tech stack modernisation at scale
* Its 64K tokens context window allows precise information recall from large documents


The following models are available:

- mistralai-Mixtral-8x22B-Instruct-v0-1



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### A deployed Mistral open chat models model

Mistral open chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Mistral open chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



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



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



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
> Notice that mistralai-Mistral-7B-Instruct-v01, mistralai-Mistral-7B-Instruct-v02 and mistralai-Mixtral-8x22B-Instruct-v0-1 doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



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
> Notice that Mistral doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



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

::: zone-end


::: zone pivot="programming-language-rest"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral-7B-Instruct](#tab/mistral-7b-instruct)

The Mistral-7B-Instruct Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B, a transformer model with the following architecture choices:

* Grouped-Query Attention
* Sliding-Window Attention
* Byte-fallback BPE tokenizer


The following models are available:

- mistralai-Mistral-7B-Instruct-v01
- mistralai-Mistral-7B-Instruct-v02



# [Mixtral-8x7B-Instruct](#tab/mistral-8x7B-instruct)

The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts. The Mixtral-8x7B outperforms Llama 2 70B on most benchmarks with 6x faster inference.

Mixtral-8x7B-v0.1 is a decoder-only model with 8 distinct groups or the "experts". At every layer, for every token, a router network chooses two of these experts to process the token and combine their output additively. Mixtral has 46.7B total parameters but only uses 12.9B parameters per token using this technique. This enables the model to perform with same speed and cost as 12.9B model.


The following models are available:

- mistralai-Mixtral-8x7B-Instruct-v01



# [Mixtral-8x22B-Instruct](#tab/mistral-8x22b-instruct)

The Mixtral-8x22B-Instruct-v0.1 Large Language Model (LLM) is an instruct fine-tuned version of the Mixtral-8x22B-v0.1. It is a sparse Mixture-of-Experts (SMoE) model that uses only 39B active parameters out of 141B, offering unparalleled cost efficiency for its size.

Mixtral 8x22B comes with the following strengths:

* It is fluent in English, French, Italian, German, and Spanish
* It has strong mathematics and coding capabilities
* It is natively capable of function calling; along with the constrained output mode implemented on la Plateforme, this enables application development and tech stack modernisation at scale
* Its 64K tokens context window allows precise information recall from large documents


The following models are available:

- mistralai-Mixtral-8x22B-Instruct-v0-1



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### A deployed Mistral open chat models model

Mistral open chat models can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)

> [!TIP]
> Notice when deploying Mistral open chat models to self-hosted managed compute you need to ensure you must have enough quota in your subscription. If you don't have enough quota available in the selected project, you can use the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours**



### A REST client

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



## Work with chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model. In this example, we assume the endpoint URL and key are stored in environment variables.



When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



```console
{
    "model_name": "mistralai-Mistral-7B-Instruct-v01",
    "model_type": "chat-completions",
    "model_provider_name": "MistralAI"
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
> Notice that mistralai-Mistral-7B-Instruct-v01, mistralai-Mistral-7B-Instruct-v02 and mistralai-Mixtral-8x22B-Instruct-v0-1 doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "mistralai-Mistral-7B-Instruct-v01",
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
    "model": "mistralai-Mistral-7B-Instruct-v01",
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
    "model": "mistralai-Mistral-7B-Instruct-v01",
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
    "model": "mistralai-Mistral-7B-Instruct-v01",
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
> Notice that Mistral doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



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

::: zone-end

## More inference examples

| **Sample Type**       | **Sample Notebook**                    |
|-----------------------|----------------------------------------|
| CLI using CURL and Python web requests    | [webrequests.ipynb](https://aka.ms/mistral-large/webrequests-sample) |
| OpenAI SDK (experimental)                 | [openaisdk.ipynb](https://aka.ms/mistral-large/openaisdk)            |
| LangChain                                 | [langchain.ipynb](https://aka.ms/mistral-large/langchain-sample)     |
| Mistral AI                                | [mistralai.ipynb](https://aka.ms/mistral-large/mistralai-sample)     |
| LiteLLM                                   | [litellm.ipynb](https://aka.ms/mistral-large/litellm-sample)         | 




## Cost and quotas

### Cost and quota considerations for Mistral family of models deployed as serverless API endpoints

Mistral models deployed as a serverless API are offered by MistralAI through the Azure Marketplace and integrated with Azure AI studio for use. You can find the Azure Marketplace pricing when deploying the model.

Each time a project subscribes to a given offer from the Azure Marketplace, a new resource is created to track the costs associated with its consumption. The same resource is used to track costs associated with inference; however, multiple meters are available to track each scenario independently.

For more information on how to track costs, see monitor costs for models offered throughout the Azure Marketplace.



Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios. 



### Cost and quota considerations for Mistral family of models deployed to managed compute

Mistral models deployed to managed compute are billed based on core hours of the associated compute instance. The cost of the compute instance is determined by the size of the instance, the number of instances running, and the duration it is running.

We recommend starting with a low number of instances and scaling up as needed. You can monitor the cost of the compute instance in the Azure portal.



## Additional resources

Here are some additional reference: 

* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)

