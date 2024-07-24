---
title: How to use Phi-3 chat models with vision with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Phi-3 chat models with vision with Azure AI studio.
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/24/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples-chat
---

# How to use Phi-3 chat models with vision with Azure AI studio

In this guide, you learn about Phi-3 chat models with vision and how to use them with Azure AI studio.
The Phi-3 family of small language models (SLMs) is a collection of instruction-tuned generative text models.





::: zone pivot="programming-language-python"

## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models with vision model

**Deployment to a self-hosted managed compute**

Phi-3 chat models with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)



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

In this section, you use the Azure AI model inference API with a chat-completions model for chat.



### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.



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
    "model_name": "Phi-3-vision-128k-Instruct",
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
> Phi-3-vision-128k-Instruct don't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```python
print("Response:", response.choices[0].message.content)
print("Model:", response.model)
print("Usage:", response.usage)
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



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

To stream completions, set `stream=True` when you call the model.



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

We can visualize how streaming generates content:



```python
print_stream(result)
```

#### Explore more parameters supported by the inference client

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
> Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```http
POST /chat/completions HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
extra-parameters: pass-through
```



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

## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both inputs. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:



> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. Adding multiple images results in an error.



To see this capability, download an image and encode the information as base64 string:



```python
from urllib.request import urlopen, Request
import base64

image_url = "https://news.microsoft.com/source/wp-content/uploads/2024/04/The-Phi-3-small-language-models-with-big-potential-1-1900x1069.jpg"
image_format = "jpeg"

request = Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
image_data = base64.b64encode(urlopen(request).read()).decode("utf-8")
data_url = f"data:image/{image_format};base64,{image_data}"
```

Visualize the image:



```python
import requests
import IPython.display as Disp

Disp.Image(requests.get(image_url).content)
```

Now, create a chat completion request with the image:



```python
from azure.ai.inference.models import TextContentItem, ImageContentItem, ImageUrl
response = model.complete(
    messages=[
        SystemMessage("You are a helpful assistant that can generate responses based on images."),
        UserMessage(content=[
            TextContentItem(text="Which conclusion can be extracted from the following chart?"),
            ImageContentItem(image=ImageUrl(url=data_url))
        ]),
    ],
    temperature=0,
    top_p=1,
    max_tokens=2048,
)
```

The response is as follows, where you can see the model's usage statistics:



```python
print(f"{response.choices[0].message.role}:\n\t{response.choices[0].message.content}\n")
print("finish reason:", response.choices[0].finish_reason)
print("model:", response.model)
print("usage:", response.usage)
```

::: zone-end


::: zone pivot="programming-language-javascript"

## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models with vision model

**Deployment to a self-hosted managed compute**

Phi-3 chat models with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)



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

In this section, you use the Azure AI model inference API with a chat-completions model for chat.



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
    "model_name": "Phi-3-vision-128k-Instruct",
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
> Phi-3-vision-128k-Instruct don't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



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

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



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

To stream completions, use `.asNodeStream()` when you call the model.



We can visualize how streaming generates content:



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

#### Explore more parameters supported by the inference client

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](https://aka.ms/azureai/modelinference).


```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        presence_penalty: "0.1",
        frequency_penalty: "0.8",
        max_tokens: 2048,
        stop: ["<|endoftext|>"],
        temperature: 0,
        top_p: 1,
        response_format: { type: "text" },
    }
});
```

> [!WARNING]
> Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```http
POST /chat/completions HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
extra-parameters: pass-through
```



```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    headers: {
        "extra-params": "pass-through"
    },
    body: {
        messages: messages,
        logprobs: true
    }
});
```

## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both inputs. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:



> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. Adding multiple images results in an error.



To see this capability, download an image and encode the information as base64 string:



```javascript
const image_url = "https://news.microsoft.com/source/wp-content/uploads/2024/04/The-Phi-3-small-language-models-with-big-potential-1-1900x1069.jpg";
const image_format = "jpeg";

const response = await fetch(image_url, { headers: { "User-Agent": "Mozilla/5.0" } });
const image_data = await response.arrayBuffer();
const image_data_base64 = Buffer.from(image_data).toString("base64");
const data_url = `data:image/${image_format};base64,${image_data_base64}`;
```

Visualize the image:



```javascript
const img = document.createElement("img");
img.src = data_url;
document.body.appendChild(img);
```

Now, create a chat completion request with the image:



```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant that can generate responses based on images." },
    { role: "user", content: 
        [
            { type: "text", text: "Which conclusion can be extracted from the following chart?" },
            { type: "image_url", image:
                {
                    url: data_url
                }
            } 
        ] 
    }
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        temperature: 0,
        top_p: 1,
        max_tokens: 2048,
    }
});
```

The response is as follows, where you can see the model's usage statistics:



```javascript
console.log(response.body.choices[0].message.role + ": " + response.body.choices[0].message.content)
console.log("Finish reason:" + response.body.choices[0].finish_reason)
console.log("Model:", response.body.model)
console.log("usage:", response.body.usage)
```

::: zone-end


::: zone pivot="programming-language-csharp"

## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models with vision model

**Deployment to a self-hosted managed compute**

Phi-3 chat models with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)



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

In this section, you use the Azure AI model inference API with a chat-completions model for chat.



### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.



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
> Phi-3-vision-128k-Instruct don't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```csharp
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
Console.WriteLine($"Model: {response.Value.Model}");
Console.WriteLine($"Usage: {response.Value.Usage.TotalTokens}");
```

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



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

To stream completions, use `CompleteStreamingAsync` method when you call the model. Notice that in this example we have wrapped the call in an asynchronous method.



To visualize the output, define an asynchronous method to print the stream in the console.


```csharp
static async void printStream(StreamingResponse<StreamingChatCompletionsUpdate> response)
{
    StringBuilder contentBuilder = new();
    await foreach (StreamingChatCompletionsUpdate chatUpdate in response)
    {
        if (chatUpdate.Role.HasValue)
        {
            Console.Write($"{chatUpdate.Role.Value.ToString().ToUpperInvariant()}: ");
        }
        if (!string.IsNullOrEmpty(chatUpdate.ContentUpdate))
        {
            Console.Write(chatUpdate.ContentUpdate);
        }
    }
}
```

We can visualize how streaming generates content:



```csharp
// In this case we are using Nito.AsyncEx package
AsyncContext.Run(() => RunAsync(client));
```

#### Explore more parameters supported by the inference client

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
> Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```http
POST /chat/completions HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
extra-parameters: pass-through
```



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

## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both inputs. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:



> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. Adding multiple images results in an error.



To see this capability, download an image and encode the information as base64 string:



Visualize the image:



Now, create a chat completion request with the image:



The response is as follows, where you can see the model's usage statistics:



::: zone-end


::: zone pivot="programming-language-rest"

## Prerequisites

To use Phi-3 models with Azure AI studio, you need the following prerequisites:



### A deployed Phi-3 chat models with vision model

**Deployment to a self-hosted managed compute**

Phi-3 chat models with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](../concepts/deployments-overview.md)



### A REST client

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name`` is your unique model deployment host name and `your-azure-region`` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.



## Work with chat completions

In this section, you use the Azure AI model inference API with a chat-completions model for chat.



### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.



When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



```console
{
    "model_name": "Phi-3-vision-128k-Instruct",
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
> Phi-3-vision-128k-Instruct don't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.



The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "Phi-3-vision-128k-Instruct",
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

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format). Extract chunks from the delta field, rather than the message field.



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

We can visualize how streaming generates content:



```json
{
    "id": "23b54589eba14564ad8a2e6978775a39",
    "object": "chat.completion.chunk",
    "created": 1718726371,
    "model": "Phi-3-vision-128k-Instruct",
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

The last message in the stream will have `finish_reason` set, indicating the reason for the generation process to stop.



```json
{
    "id": "23b54589eba14564ad8a2e6978775a39",
    "object": "chat.completion.chunk",
    "created": 1718726371,
    "model": "Phi-3-vision-128k-Instruct",
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

#### Explore more parameters supported by the inference client

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
    "model": "Phi-3-vision-128k-Instruct",
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
> Phi-3 doesn't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.



### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following example shows how to pass the extra parameter `logprobs` to the model. Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters.



```http
POST /chat/completions HTTP/1.1
Host: <ENDPOINT_URI>
Authorization: Bearer <TOKEN>
Content-Type: application/json
extra-parameters: pass-through
```



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

## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both inputs. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:



> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. Adding multiple images results in an error.



To see this capability, download an image and encode the information as base64 string:



Visualize the image:



Now, create a chat completion request with the image:



```json
{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Which peculiar conclusion about LLMs and SLMs can be extracted from the following chart?"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/jpg;base64,0xABCDFGHIJKLMNOPQRSTUVWXYZ..."
                    }
                }
            ]
        }
    ],
    "temperature": 0,
    "top_p": 1,
    "max_tokens": 2048
}
```

The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "Phi-3-vision-128k-Instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "The chart illustrates that larger models tend to perform better in quality, as indicated by their size in billions of parameters. However, there are exceptions to this trend, such as Phi-3-medium and Phi-3-small, which outperform smaller models in quality. This suggests that while larger models generally have an advantage, there may be other factors at play that influence a model's performance.",
                "tool_calls": null
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 2380,
        "completion_tokens": 126,
        "total_tokens": 2506
    }
}
```

::: zone-end

## Cost and quotas

Quota is managed per deployment. Each deployment has a rate limit of 200,000 tokens per minute and 1,000 API requests per minute. However, we currently limit one deployment per model per project. Contact Microsoft Azure Support if the current rate limits aren't sufficient for your scenarios.    



### Cost and quota considerations for Phi-3 family of models deployed to managed compute

Phi-3 models deployed to managed compute are billed based on core hours of the associated compute instance. The cost of the compute instance is determined by the size of the instance, the number of instances running, and the run duration.

It is a good practice to start with a low number of instances and scale up as needed. You can monitor the cost of the compute instance in the Azure portal.



## Related content


* [Azure AI Model Inference API](../reference/reference-model-inference-api.md)
* [Deploy models as serverless APIs](deploy-models-serverless.md)
* [Consume serverless API endpoints from a different Azure AI Studio project or hub](deploy-models-serverless-connect.md)
* [Region availability for models in serverless API endpoints](deploy-models-serverless-availability.md)
* [Plan and manage costs (marketplace)](costs-plan-manage.md#monitor-costs-for-models-offered-through-the-azure-marketplace)

