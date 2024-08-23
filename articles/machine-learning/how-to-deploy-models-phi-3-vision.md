---
title: How to use Phi-3 chat model with vision with Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use Phi-3 chat model with vision with Azure Machine Learning.
ms.service: azure-machine-learning
ms.subservice: inferencing
manager: scottpolly
ms.topic: how-to
ms.date: 08/19/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples-chat
---

# How to use Phi-3 chat model with vision with Azure Machine Learning

In this article, you learn about Phi-3 chat model with vision and how to use them.
The Phi-3 family of small language models (SLMs) is a collection of instruction-tuned generative text models.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

::: zone pivot="programming-language-python"

## Phi-3 chat model with vision

Phi-3 Vision is a lightweight, state-of-the-art, open multimodal model. The model was built upon datasets that include synthetic data and filtered, publicly available websites - with a focus on high-quality, reasoning-dense data, both on text and vision. The model belongs to the Phi-3 model family, and the multimodal version comes with 128K context length (in tokens) that it can support. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization, to ensure precise instruction adherence and robust safety measures.


You can learn more about the models in their respective model card:

* Phi-3-vision-128k-Instruct

## Prerequisites

To use Phi-3 chat model with vision with Azure Machine Learning, you need the following prerequisites:

### A model deployment

**Deployment to a self-hosted managed compute**

Phi-3 chat model with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](concept-model-catalog.md#deploy-models-for-inference-with-managed-compute)

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

## Work with chat completions

In this section, you use the [Azure AI Model Inference API](reference-model-inference-api.md) with a chat completions model for chat.

> [!TIP]
> The [Azure AI Model Inference API](reference-model-inference-api.md) allows you to talk with most models deployed in Azure Machine Learning studio with the same code and structure, including Phi-3 chat model with vision.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.


```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.core.credentials import AzureKeyCredential

client = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["AZURE_INFERENCE_CREDENTIAL"]),
)
```

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.


```python
import os
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

client = ChatCompletionsClient(
    endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
    credential=DefaultAzureCredential(),
)
```

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:


```python
model_info = client.get_model_info()
```

The response is as follows:


```python
print("Model name:", model_info.model_name)
print("Model type:", model_info.model_type)
print("Model provider name:", model_info.model_provider_name)
```

```console
Model name: Phi-3-vision-128k-Instruct
Model type: chat-completions
Model provider name: Microsoft
```

### Create a chat completion request

The following example shows how you can create a basic chat completions request to the model.

```python
from azure.ai.inference.models import SystemMessage, UserMessage

response = client.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
)
```

> [!NOTE]
> Phi-3-vision-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.

The response is as follows, where you can see the model's usage statistics:


```python
print("Response:", response.choices[0].message.content)
print("Model:", response.model)
print("Usage:")
print("\tPrompt tokens:", response.usage.prompt_tokens)
print("\tTotal tokens:", response.usage.total_tokens)
print("\tCompletion tokens:", response.usage.completion_tokens)
```

```console
Response: As of now, it's estimated that there are about 7,000 languages spoken around the world. However, this number can vary as some languages become extinct and new ones develop. It's also important to note that the number of speakers can greatly vary between languages, with some having millions of speakers and others only a few hundred.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 19
  Total tokens: 91
  Completion tokens: 72
```

Inspect the `usage` section in the response to see the number of tokens used for the prompt, the total number of tokens generated, and the number of tokens used for the completion.

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events). Extract chunks from the delta field, rather than the message field.


```python
result = client.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    temperature=0,
    top_p=1,
    max_tokens=2048,
    stream=True,
)
```

To stream completions, set `stream=True` when you call the model.

To visualize the output, define a helper function to print the stream.

```python
def print_stream(result):
    """
    Prints the chat completion with streaming.
    """
    import time
    for update in result:
        if update.choices:
            print(update.choices[0].delta.content, end="")
```

You can visualize how streaming generates content:


```python
print_stream(result)
```

#### Explore more parameters supported by the inference client

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](reference-model-inference-api.md).

```python
from azure.ai.inference.models import ChatCompletionsResponseFormat

response = client.complete(
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
> Phi-3 family models don't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.

If you want to pass a parameter that isn't in the list of supported parameters, you can pass it to the underlying model using *extra parameters*. See [Pass extra parameters to the model](#pass-extra-parameters-to-the-model).

### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following code example shows how to pass the extra parameter `logprobs` to the model. 

Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters. When the request is made to the underlying model, the header `extra-parameters` is passed to the model with the value `pass-through`. This value tells the endpoint to pass the extra parameters to the model. Use of extra parameters with the model doesn't guarantee that the model can actually handle them. Read the model's documentation to understand which extra parameters are supported.


```python
response = client.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    model_extras={
        "logprobs": True
    }
)
```

The following extra parameters can be passed to Phi-3 chat model with vision:

| Name           | Description           | Type            |
| -------------- | --------------------- | --------------- |
| `logit_bias` | Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. | `object` |
| `logprobs` | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. | `bool` |
| `top_logprobs` | An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. | `int` |
| `n` | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. | `int` |


## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both kinds of input. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:

> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. If you add multiple images, it results in an error.

To see this capability, download an image and encode the information as `base64` string. The resulting data should be inside of a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs):


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

:::image type="content" source="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg" alt-text="A chart displaying the relative capabilities between large language models and small language models." lightbox="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg":::

Now, create a chat completion request with the image:


```python
from azure.ai.inference.models import TextContentItem, ImageContentItem, ImageUrl
response = client.complete(
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
print("Model:", response.model)
print("Usage:")
print("\tPrompt tokens:", response.usage.prompt_tokens)
print("\tCompletion tokens:", response.usage.completion_tokens)
print("\tTotal tokens:", response.usage.total_tokens)
```

```console
ASSISTANT: The chart illustrates that larger models tend to perform better in quality, as indicated by their size in billions of parameters. However, there are exceptions to this trend, such as Phi-3-medium and Phi-3-small, which outperform smaller models in quality. This suggests that while larger models generally have an advantage, there might be other factors at play that influence a model's performance.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 2380
  Completion tokens: 126
  Total tokens: 2506
```

::: zone-end


::: zone pivot="programming-language-javascript"

## Phi-3 chat model with vision

Phi-3 Vision is a lightweight, state-of-the-art, open multimodal model. The model was built upon datasets that include synthetic data and filtered, publicly available websites - with a focus on high-quality, reasoning-dense data, both on text and vision. The model belongs to the Phi-3 model family, and the multimodal version comes with 128K context length (in tokens) that it can support. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization, to ensure precise instruction adherence and robust safety measures.


You can learn more about the models in their respective model card:

* Phi-3-vision-128k-Instruct


## Prerequisites

To use Phi-3 chat model with vision with Azure Machine Learning studio, you need the following prerequisites:

### A model deployment

**Deployment to a self-hosted managed compute**

Phi-3 chat model with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](concept-model-catalog.md#deploy-models-for-inference-with-managed-compute)

### The inference package installed

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure Inference library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```

## Work with chat completions

In this section, you use the [Azure AI Model Inference API](reference-model-inference-api.md) with a chat completions model for chat.

> [!TIP]
> The [Azure AI Model Inference API](reference-model-inference-api.md) allows you to talk with most models deployed in Azure Machine Learning studio with the same code and structure, including Phi-3 chat model with vision.

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
var model_info = await client.path("/info").get()
```

The response is as follows:


```javascript
console.log("Model name: ", model_info.body.model_name)
console.log("Model type: ", model_info.body.model_type)
console.log("Model provider name: ", model_info.body.model_provider_name)
```

```console
Model name: Phi-3-vision-128k-Instruct
Model type: chat-completions
Model provider name: Microsoft
```

### Create a chat completion request

The following example shows how you can create a basic chat completions request to the model.

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
> Phi-3-vision-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.

The response is as follows, where you can see the model's usage statistics:


```javascript
if (isUnexpected(response)) {
    throw response.body.error;
}

console.log("Response: ", response.body.choices[0].message.content);
console.log("Model: ", response.body.model);
console.log("Usage:");
console.log("\tPrompt tokens:", response.body.usage.prompt_tokens);
console.log("\tTotal tokens:", response.body.usage.total_tokens);
console.log("\tCompletion tokens:", response.body.usage.completion_tokens);
```

```console
Response: As of now, it's estimated that there are about 7,000 languages spoken around the world. However, this number can vary as some languages become extinct and new ones develop. It's also important to note that the number of speakers can greatly vary between languages, with some having millions of speakers and others only a few hundred.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 19
  Total tokens: 91
  Completion tokens: 72
```

Inspect the `usage` section in the response to see the number of tokens used for the prompt, the total number of tokens generated, and the number of tokens used for the completion.

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events). Extract chunks from the delta field, rather than the message field.


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

You can visualize how streaming generates content:


```javascript
var stream = response.body;
if (!stream) {
    stream.destroy();
    throw new Error(`Failed to get chat completions with status: ${response.status}`);
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

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](reference-model-inference-api.md).

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
> Phi-3 family models don't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.

If you want to pass a parameter that isn't in the list of supported parameters, you can pass it to the underlying model using *extra parameters*. See [Pass extra parameters to the model](#pass-extra-parameters-to-the-model).

### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following code example shows how to pass the extra parameter `logprobs` to the model. 

Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters. When the request is made to the underlying model, the header `extra-parameters` is passed to the model with the value `pass-through`. This value tells the endpoint to pass the extra parameters to the model. Use of extra parameters with the model doesn't guarantee that the model can actually handle them. Read the model's documentation to understand which extra parameters are supported.


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

The following extra parameters can be passed to Phi-3 chat model with vision:

| Name           | Description           | Type            |
| -------------- | --------------------- | --------------- |
| `logit_bias` | Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. | `object` |
| `logprobs` | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. | `bool` |
| `top_logprobs` | An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. | `int` |
| `n` | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. | `int` |


## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both kinds of input. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:

> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. If you add multiple images, it results in an error.

To see this capability, download an image and encode the information as `base64` string. The resulting data should be inside of a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs):


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

:::image type="content" source="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg" alt-text="A chart displaying the relative capabilities between large language models and small language models." lightbox="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg":::

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
console.log(response.body.choices[0].message.role + ": " + response.body.choices[0].message.content);
console.log("Model:", response.body.model);
console.log("Usage:");
console.log("\tPrompt tokens:", response.body.usage.prompt_tokens);
console.log("\tCompletion tokens:", response.body.usage.completion_tokens);
console.log("\tTotal tokens:", response.body.usage.total_tokens);
```

```console
ASSISTANT: The chart illustrates that larger models tend to perform better in quality, as indicated by their size in billions of parameters. However, there are exceptions to this trend, such as Phi-3-medium and Phi-3-small, which outperform smaller models in quality. This suggests that while larger models generally have an advantage, there might be other factors at play that influence a model's performance.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 2380
  Completion tokens: 126
  Total tokens: 2506
```

::: zone-end


::: zone pivot="programming-language-csharp"

## Phi-3 chat model with vision

Phi-3 Vision is a lightweight, state-of-the-art, open multimodal model. The model was built upon datasets that include synthetic data and filtered, publicly available websites - with a focus on high-quality, reasoning-dense data, both on text and vision. The model belongs to the Phi-3 model family, and the multimodal version comes with 128K context length (in tokens) that it can support. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization, to ensure precise instruction adherence and robust safety measures.


You can learn more about the models in their respective model card:

* Phi-3-vision-128k-Instruct


## Prerequisites

To use Phi-3 chat model with vision with Azure Machine Learning studio, you need the following prerequisites:

### A model deployment

**Deployment to a self-hosted managed compute**

Phi-3 chat model with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](concept-model-catalog.md#deploy-models-for-inference-with-managed-compute)

### The inference package installed

You can consume predictions from this model by using the `Azure.AI.Inference` package from [NuGet](https://www.nuget.org/). To install this package, you need the following prerequisites:

* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

Once you have these prerequisites, install the Azure AI inference library with the following command:

```dotnetcli
dotnet add package Azure.AI.Inference --prerelease
```

You can also authenticate with Microsoft Entra ID (formerly Azure Active Directory). To use credential providers provided with the Azure SDK, install the `Azure.Identity` package:

```dotnetcli
dotnet add package Azure.Identity
```

Import the following namespaces:


```csharp
using Azure;
using Azure.Identity;
using Azure.AI.Inference;
```

This example also uses the following namespaces but you may not always need them:


```csharp
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Reflection;
```

## Work with chat completions

In this section, you use the [Azure AI Model Inference API](reference-model-inference-api.md) with a chat completions model for chat.

> [!TIP]
> The [Azure AI Model Inference API](reference-model-inference-api.md) allows you to talk with most models deployed in Azure Machine Learning studio with the same code and structure, including Phi-3 chat model with vision.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.


```csharp
ChatCompletionsClient client = new ChatCompletionsClient(
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


```csharp
Console.WriteLine($"Model name: {modelInfo.Value.ModelName}");
Console.WriteLine($"Model type: {modelInfo.Value.ModelType}");
Console.WriteLine($"Model provider name: {modelInfo.Value.ModelProviderName}");
```

```console
Model name: Phi-3-vision-128k-Instruct
Model type: chat-completions
Model provider name: Microsoft
```

### Create a chat completion request

The following example shows how you can create a basic chat completions request to the model.

```csharp
ChatCompletionsOptions requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
};

Response<ChatCompletions> response = client.Complete(requestOptions);
```

> [!NOTE]
> Phi-3-vision-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.

The response is as follows, where you can see the model's usage statistics:


```csharp
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
Console.WriteLine($"Model: {response.Value.Model}");
Console.WriteLine("Usage:");
Console.WriteLine($"\tPrompt tokens: {response.Value.Usage.PromptTokens}");
Console.WriteLine($"\tTotal tokens: {response.Value.Usage.TotalTokens}");
Console.WriteLine($"\tCompletion tokens: {response.Value.Usage.CompletionTokens}");
```

```console
Response: As of now, it's estimated that there are about 7,000 languages spoken around the world. However, this number can vary as some languages become extinct and new ones develop. It's also important to note that the number of speakers can greatly vary between languages, with some having millions of speakers and others only a few hundred.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 19
  Total tokens: 91
  Completion tokens: 72
```

Inspect the `usage` section in the response to see the number of tokens used for the prompt, the total number of tokens generated, and the number of tokens used for the completion.

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events). Extract chunks from the delta field, rather than the message field.


```csharp
static async Task StreamMessageAsync(ChatCompletionsClient client)
{
    ChatCompletionsOptions requestOptions = new ChatCompletionsOptions()
    {
        Messages = {
            new ChatRequestSystemMessage("You are a helpful assistant."),
            new ChatRequestUserMessage("How many languages are in the world? Write an essay about it.")
        },
        MaxTokens=4096
    };

    StreamingResponse<StreamingChatCompletionsUpdate> streamResponse = await client.CompleteStreamingAsync(requestOptions);

    await PrintStream(streamResponse);
}
```

To stream completions, use `CompleteStreamingAsync` method when you call the model. Notice that in this example we the call is wrapped in an asynchronous method.

To visualize the output, define an asynchronous method to print the stream in the console.

```csharp
static async Task PrintStream(StreamingResponse<StreamingChatCompletionsUpdate> response)
{
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

You can visualize how streaming generates content:


```csharp
StreamMessageAsync(client).GetAwaiter().GetResult();
```

#### Explore more parameters supported by the inference client

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](reference-model-inference-api.md).

```csharp
requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
    PresencePenalty = 0.1f,
    FrequencyPenalty = 0.8f,
    MaxTokens = 2048,
    StopSequences = { "<|endoftext|>" },
    Temperature = 0,
    NucleusSamplingFactor = 1,
    ResponseFormat = new ChatCompletionsResponseFormatText()
};

response = client.Complete(requestOptions);
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
```

> [!WARNING]
> Phi-3 family models don't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.

If you want to pass a parameter that isn't in the list of supported parameters, you can pass it to the underlying model using *extra parameters*. See [Pass extra parameters to the model](#pass-extra-parameters-to-the-model).

### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following code example shows how to pass the extra parameter `logprobs` to the model. 

Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters. When the request is made to the underlying model, the header `extra-parameters` is passed to the model with the value `pass-through`. This value tells the endpoint to pass the extra parameters to the model. Use of extra parameters with the model doesn't guarantee that the model can actually handle them. Read the model's documentation to understand which extra parameters are supported.


```csharp
requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are a helpful assistant."),
        new ChatRequestUserMessage("How many languages are in the world?")
    },
    AdditionalProperties = { { "logprobs", BinaryData.FromString("true") } },
};

response = client.Complete(requestOptions, extraParams: ExtraParameters.PassThrough);
Console.WriteLine($"Response: {response.Value.Choices[0].Message.Content}");
```

The following extra parameters can be passed to Phi-3 chat model with vision:

| Name           | Description           | Type            |
| -------------- | --------------------- | --------------- |
| `logit_bias` | Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. | `object` |
| `logprobs` | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. | `bool` |
| `top_logprobs` | An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. | `int` |
| `n` | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. | `int` |


## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both kinds of input. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:

> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. If you add multiple images, it results in an error.

To see this capability, download an image and encode the information as `base64` string. The resulting data should be inside of a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs):


```csharp
string imageUrl = "https://news.microsoft.com/source/wp-content/uploads/2024/04/The-Phi-3-small-language-models-with-big-potential-1-1900x1069.jpg";
string imageFormat = "jpeg";
HttpClient httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0");
byte[] imageBytes = httpClient.GetByteArrayAsync(imageUrl).Result;
string imageBase64 = Convert.ToBase64String(imageBytes);
string dataUrl = $"data:image/{imageFormat};base64,{imageBase64}";
```

Visualize the image:

:::image type="content" source="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg" alt-text="A chart displaying the relative capabilities between large language models and small language models." lightbox="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg":::

Now, create a chat completion request with the image:


```csharp
ChatCompletionsOptions requestOptions = new ChatCompletionsOptions()
{
    Messages = {
        new ChatRequestSystemMessage("You are an AI assistant that helps people find information."),
        new ChatRequestUserMessage([
            new ChatMessageTextContentItem("Which conclusion can be extracted from the following chart?"),
            new ChatMessageImageContentItem(new Uri(dataUrl))
        ]),
    },
    MaxTokens=2048,
};

var response = client.Complete(requestOptions);
Console.WriteLine(response.Value.Choices[0].Message.Content);
```

The response is as follows, where you can see the model's usage statistics:


```csharp
Console.WriteLine($"{response.Value.Choices[0].Message.Role}: {response.Value.Choices[0].Message.Content}");
Console.WriteLine($"Model: {response.Value.Model}");
Console.WriteLine("Usage:");
Console.WriteLine($"\tPrompt tokens: {response.Value.Usage.PromptTokens}");
Console.WriteLine($"\tTotal tokens: {response.Value.Usage.TotalTokens}");
Console.WriteLine($"\tCompletion tokens: {response.Value.Usage.CompletionTokens}");
```

```console
ASSISTANT: The chart illustrates that larger models tend to perform better in quality, as indicated by their size in billions of parameters. However, there are exceptions to this trend, such as Phi-3-medium and Phi-3-small, which outperform smaller models in quality. This suggests that while larger models generally have an advantage, there might be other factors at play that influence a model's performance.
Model: Phi-3-vision-128k-Instruct
Usage: 
  Prompt tokens: 2380
  Completion tokens: 126
  Total tokens: 2506
```

::: zone-end


::: zone pivot="programming-language-rest"

## Phi-3 chat model with vision

Phi-3 Vision is a lightweight, state-of-the-art, open multimodal model. The model was built upon datasets that include synthetic data and filtered, publicly available websites - with a focus on high-quality, reasoning-dense data, both on text and vision. The model belongs to the Phi-3 model family, and the multimodal version comes with 128K context length (in tokens) that it can support. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization, to ensure precise instruction adherence and robust safety measures.


You can learn more about the models in their respective model card:

* Phi-3-vision-128k-Instruct


## Prerequisites

To use Phi-3 chat model with vision with Azure Machine Learning studio, you need the following prerequisites:

### A model deployment

**Deployment to a self-hosted managed compute**

Phi-3 chat model with vision can be deployed to our self-hosted managed inference solution, which allows you to customize and control all the details about how the model is served.

For deployment to a self-hosted managed compute, you must have enough quota in your subscription. If you don't have enough quota available, you can use our temporary quota access by selecting the option **I want to use shared quota and I acknowledge that this endpoint will be deleted in 168 hours.**

> [!div class="nextstepaction"]
> [Deploy the model to managed compute](concept-model-catalog.md#deploy-models-for-inference-with-managed-compute)

### A REST client

Models deployed with the [Azure AI Model Inference API](reference-model-inference-api.md) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name`` is your unique model deployment host name and `your-azure-region`` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

## Work with chat completions

In this section, you use the [Azure AI Model Inference API](reference-model-inference-api.md) with a chat completions model for chat.

> [!TIP]
> The [Azure AI Model Inference API](reference-model-inference-api.md) allows you to talk with most models deployed in Azure Machine Learning studio with the same code and structure, including Phi-3 chat model with vision.

### Create a client to consume the model

First, create the client to consume the model. The following code uses an endpoint URL and key that are stored in environment variables.

When you deploy the model to a self-hosted online endpoint with **Microsoft Entra ID** support, you can use the following code snippet to create a client.

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
    "model_name": "Phi-3-vision-128k-Instruct",
    "model_type": "chat-completions",
    "model_provider_name": "Microsoft"
}
```

### Create a chat completion request

The following example shows how you can create a basic chat completions request to the model.

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
> Phi-3-vision-128k-Instruct doesn't support system messages (`role="system"`). When you use the Azure AI model inference API, system messages are translated to user messages, which is the closest capability available. This translation is offered for convenience, but it's important for you to verify that the model is following the instructions in the system message with the right level of confidence.

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

Inspect the `usage` section in the response to see the number of tokens used for the prompt, the total number of tokens generated, and the number of tokens used for the completion.

#### Stream content

By default, the completions API returns the entire generated content in a single response. If you're generating long completions, waiting for the response can take many seconds.

You can _stream_ the content to get it as it's being generated. Streaming content allows you to start processing the completion as content becomes available. This mode returns an object that streams back the response as [data-only server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events). Extract chunks from the delta field, rather than the message field.


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

You can visualize how streaming generates content:


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

The last message in the stream has `finish_reason` set, indicating the reason for the generation process to stop.


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

Explore other parameters that you can specify in the inference client. For a full list of all the supported parameters and their corresponding documentation, see [Azure AI Model Inference API reference](reference-model-inference-api.md).

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
> Phi-3 family models don't support JSON output formatting (`response_format = { "type": "json_object" }`). You can always prompt the model to generate JSON outputs. However, such outputs are not guaranteed to be valid JSON.

If you want to pass a parameter that isn't in the list of supported parameters, you can pass it to the underlying model using *extra parameters*. See [Pass extra parameters to the model](#pass-extra-parameters-to-the-model).

### Pass extra parameters to the model

The Azure AI Model Inference API allows you to pass extra parameters to the model. The following code example shows how to pass the extra parameter `logprobs` to the model. 

Before you pass extra parameters to the Azure AI model inference API, make sure your model supports those extra parameters. When the request is made to the underlying model, the header `extra-parameters` is passed to the model with the value `pass-through`. This value tells the endpoint to pass the extra parameters to the model. Use of extra parameters with the model doesn't guarantee that the model can actually handle them. Read the model's documentation to understand which extra parameters are supported.

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

The following extra parameters can be passed to Phi-3 chat model with vision:

| Name           | Description           | Type            |
| -------------- | --------------------- | --------------- |
| `logit_bias` | Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. | `object` |
| `logprobs` | Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. | `bool` |
| `top_logprobs` | An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. | `int` |
| `n` | How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. | `int` |


## Use chat completions with images

Phi-3-vision-128k-Instruct can reason across text and images and generate text completions based on both kinds of input. In this section, you explore the capabilities of Phi-3-vision-128k-Instruct for vision in a chat fashion:

> [!IMPORTANT]
> Phi-3-vision-128k-Instruct supports only one image for each turn in the chat conversation and only the last image is retained in context. If you add multiple images, it results in an error.

To see this capability, download an image and encode the information as `base64` string. The resulting data should be inside of a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs):

> [!TIP]
> You will need to construct the data URL using an scripting or programming language. This tutorial use [this sample image](media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg) in JPEG format. A data URL has a format as follows: `data:image/jpg;base64,0xABCDFGHIJKLMNOPQRSTUVWXYZ...`.

Visualize the image:

:::image type="content" source="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg" alt-text="A chart displaying the relative capabilities between large language models and small language models." lightbox="media/how-to-deploy-models-phi-3-vision/small-language-models-chart-example.jpg":::

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

## More inference examples

For more examples of how to use Phi-3 family models, see the following examples and tutorials:

| Description                               | Language          | Sample                                                          |
|-------------------------------------------|-------------------|-----------------------------------------------------------------|
| CURL request                              | Bash              | [Link](https://aka.ms/phi-3/webrequests-sample)         |
| Azure AI Inference package for JavaScript | JavaScript        | [Link](https://aka.ms/azsdk/azure-ai-inference/javascript/samples)  |
| Azure AI Inference package for Python     | Python            | [Link](https://aka.ms/azsdk/azure-ai-inference/python/samples)  |
| Python web requests                       | Python            | [Link](https://aka.ms/phi-3/webrequests-sample)         |
| OpenAI SDK (experimental)                 | Python            | [Link](https://aka.ms/phi-3/openaisdk)                  |
| LangChain                                 | Python            | [Link](https://aka.ms/phi-3/langchain-sample)           |
| LiteLLM                                   | Python            | [Link](https://aka.ms/phi-3/litellm-sample)             | 


## Cost and quota considerations for Phi-3 family models deployed to managed compute

Phi-3 family models deployed to managed compute are billed based on core hours of the associated compute instance. The cost of the compute instance is determined by the size of the instance, the number of instances running, and the run duration.

It is a good practice to start with a low number of instances and scale up as needed. You can monitor the cost of the compute instance in the Azure portal.

## Related content

* [Azure AI Model Inference API](reference-model-inference-api.md)
* [Model Catalog and Collections](concept-model-catalog.md)
* [Deploy models as serverless API endpoints](how-to-deploy-models-serverless.md)
* [Plan and manage costs for Azure AI Studio](concept-plan-manage-cost.md)
* [Region availability for models in serverless API endpoints](concept-endpoint-serverless-availability.md)
