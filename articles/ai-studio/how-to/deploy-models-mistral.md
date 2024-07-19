---
title: How to use Mistral premium chat models with Azure AI studio
titleSuffix: Azure AI studio
description: Learn how to use Mistral premium chat models with Azure AI studio.
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/19/2024
ms.reviewer: kritifaujdar
reviewer: fkriti
ms.author: mopeakande
author: msakande
ms.custom: references_regions, generated
zone_pivot_groups: azure-ai-model-catalog-samples
---

# How to use Mistral family of language models with Azure AI studio

In this guide, you learn about Mistral models and how to use them with Azure AI studio.
Mistral AI offers two categories of models. Premium models including Mistral Large and Mistral Small, available as serverless APIs with pay-as-you-go token-based billing. Open models including Mixtral-8x7B-Instruct-v01, Mixtral-8x7B-v01, Mistral-7B-Instruct-v01, and Mistral-7B-v01; available to also download and run on self-hosted managed endpoints.




::: zone pivot="programming-language-python"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral Large](#tab/mistral-large)

Mistral Large is Mistral AI's most advanced Large Language Model (LLM). It can be used on any language-based task, thanks to its state-of-the-art reasoning and knowledge capabilities.

Additionally, Mistral Large is:

* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32-K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Large



# [Mistral Small](#tab/mistral-small)

Mistral Small is Mistral AI's most efficient Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency.

Mistral Small is:

* **A small model optimized for low latency**. Very efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model, it outperforms Mixtral-8x7B and has lower latency.
* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model, and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Small



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Mistral premium chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Install the inference package

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



## Chat completions

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

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```python
model.get_model_info()
```

The response is as follows:



```console
{
    "model_name": "Mistral-Large",
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
    presence_penalty="0.1",
    frequency_penalty="0.8",
    max_tokens=2048,
    stop=["<|endoftext|>"],
    temperature=0,
    top_p=1,
    response_format={ "type": ChatCompletionsResponseFormat.TEXT },
)
```

#### JSON outputs

Mistral premium chat models can create JSON outputs. Setting `response_format` to `json_object` enables JSON mode, which guarantees the message the model generates is valid JSON. You must also instruct the model to produce JSON yourself via a system or user message. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.



```python
response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant that always generate responses in JSON format, using."
                      " the following format: { ""answer"": ""response"" }."),
        UserMessage(content="How many languages are in the world?"),
    ],
    response_format={ "type": ChatCompletionsResponseFormat.JSON_OBJECT }
)
```

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

### Safe mode

Mistral premium chat models supports the parameter `safe_prompt`. Toggling the safe prompt will prepend your messages with the following system prompt:

> Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.

The Azure AI Model Inference API allows you to pass this extra paramter in the following way:



```python
response = model.complete(
    messages=[
        SystemMessage(content="You are a helpful assistant."),
        UserMessage(content="How many languages are in the world?"),
    ],
    model_extras={
        "safe_mode": True
    }
)
```

### Tools

Mistral premium chat models supports the use of tools, which can be an extraordinary resource when you need to offload specific tasks from the language model and instead rely on a more deterministic system or even a different language model. The Azure AI Model Inference API allows you define tools in the following way.

In this example, we are creating a tool definition that is able to look from flight information from two different cities.



```python
from azure.ai.inference.models import FunctionDefinition, ChatCompletionsFunctionToolDefinition

flight_info = ChatCompletionsFunctionToolDefinition(
    function=FunctionDefinition(
        name="get_flight_info",
        description="Returns information about the next flight between two cities. This includes the name of the airline, flight number and the date and time of the next flight",
        parameters={
            "type": "object",
            "properties": {
                "origin_city": {
                    "type": "string",
                    "description": "The name of the city where the flight originates",
                },
                "destination_city": {
                    "type": "string",
                    "description": "The flight destination city",
                },
            },
            "required": ["origin_city", "destination_city"],
        },
    )
)

tools = [flight_info]
```

In this simple example, we will implement this function in a simple way by just returning that there is no flights available for the selected route, but the user should consider taking a train.



```python
def get_flight_info(loc_origin: str, loc_destination: str):
    return { 
        "info": f"There are no flights available from {loc_origin} to {loc_destination}. You should take a train, specially if it helps to reduce CO2 emissions."
    }
```

Let's prompt the model to help us booking flights with the help of this function:



```python
messages = [
    SystemMessage(
        content="You are a helpful assistant that help users to find information about traveling, how to get"
                " to places and the different transportations options. You care about the environment and you"
                " always have that in mind when answering inqueries.",
    ),
    UserMessage(
        content="When is the next flight from Miami to Seattle?",
    ),
]

response = model.complete(
    messages=messages, tools=tools, tool_choice="auto"
)
```

You can find out if a tool needs to be called by inspecting the response. When a tool needs to be called, you will see `finish_reason` is `tool_calls`.



```python
response_message = response.choices[0].message
tool_calls = response_message.tool_calls

print("Finish reason:", response.choices[0].finish_reason)
print("Tool call:", tool_calls)
```

Let's append this message to the chat history:



```python
messages.append(
    response_message
)
```

Now, it's time to call the appropiate function to handle the tool call. In the following code snippet we iterate over all the tool calls indicated in the response and call the corresponding function with the approapriate parameters. Notice also how we append the response to the chat history.



```python
import json
from azure.ai.inference.models import ToolMessage

for tool_call in tool_calls:

    # Get the tool details:

    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments.replace("\'", "\""))
    tool_call_id = tool_call.id

    print(f"Calling function `{function_name}` with arguments {function_args}")

    # Call the function defined above using `locals()`, which returns the list of all functions 
    # available in the scope as a dictionary. Notice that this is just done as a simple way to get
    # the function callable from its string name. Then we can call it with the corresponding
    # arguments.

    callable_func = locals()[function_name]
    function_response = callable_func(**function_args)

    print("->", function_response)

    # Once we have a response from the function and its arguments, we can append a new message to the chat 
    # history. Notice how we are telling to the model that this chat message came from a tool:

    messages.append(
        ToolMessage(
            tool_call_id=tool_call_id,
            content=json.dumps(function_response)
        )
    )
```

Let's see the response from the model now:



```python
response = model.complete(
    messages=messages,
    tools=tools,
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



::: zone-end


::: zone pivot="programming-language-javascript"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral Large](#tab/mistral-large)

Mistral Large is Mistral AI's most advanced Large Language Model (LLM). It can be used on any language-based task, thanks to its state-of-the-art reasoning and knowledge capabilities.

Additionally, Mistral Large is:

* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32-K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Large



# [Mistral Small](#tab/mistral-small)

Mistral Small is Mistral AI's most efficient Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency.

Mistral Small is:

* **A small model optimized for low latency**. Very efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model, it outperforms Mixtral-8x7B and has lower latency.
* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model, and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Small



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Mistral premium chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Install the inference package

You can consume predictions from this model by using the `@azure-rest/ai-inference` package from `npm`. To install this package, you need the following prerequisites:

* LTS versions of `Node.js` with `npm`.
* The endpoint URL. To construct the client library, you need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where `your-host-name` is your unique model deployment host name and `your-azure-region` is the Azure region where the model is deployed (for example, eastus2).
* Depending on your model deployment and authentication preference, you need either a key to authenticate against the service, or Microsoft Entra ID credentials. The key is a 32-character string.

nce you have these prerequisites, install the Azure ModelClient REST client REST client library for JavaScript with the following command:

```bash
npm install @azure-rest/ai-inference
```



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



## Chat completions

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

### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



```javascript
await client.path("info").get()
```

The response is as follows:



```console
{
    "model_name": "Mistral-Large",
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

#### JSON outputs

Mistral premium chat models can create JSON outputs. Setting `response_format` to `json_object` enables JSON mode, which guarantees the message the model generates is valid JSON. You must also instruct the model to produce JSON yourself via a system or user message. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.



```javascript
var messages = [
    { role: "system", content: "You are a helpful assistant that always generate responses in JSON format, using."
        + " the following format: { \"answer\": \"response\" }." },
    { role: "user", content: "How many languages are in the world?" },
];

var response = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        response_format: { type: "json_object" }
    }
});
```

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

### Safe mode

Mistral premium chat models supports the parameter `safe_prompt`. Toggling the safe prompt will prepend your messages with the following system prompt:

> Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.

The Azure AI Model Inference API allows you to pass this extra paramter in the following way:



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
        safe_mode: true
    }
});
```

### Tools

Mistral premium chat models supports the use of tools, which can be an extraordinary resource when you need to offload specific tasks from the language model and instead rely on a more deterministic system or even a different language model. The Azure AI Model Inference API allows you define tools in the following way.

In this example, we are creating a tool definition that is able to look from flight information from two different cities.



```javascript
const flight_info = {
    name: "get_flight_info",
    description: "Returns information about the next flight between two cities. This includes the name of the airline, flight number and the date and time of the next flight",
    parameters: {
        type: "object",
        properties: {
            origin_city: {
                type: "string",
                description: "The name of the city where the flight originates",
            },
            destination_city: {
                type: "string",
                description: "The flight destination city",
            },
        },
        required: ["origin_city", "destination_city"],
    },
}

const tools = [
    {
        type: "function",
        function: flight_info,
    },
];
```

In this simple example, we will implement this function in a simple way by just returning that there is no flights available for the selected route, but the user should consider taking a train.



```javascript
function get_flight_info(loc_origin, loc_destination) {
    return {
        info: "There are no flights available from " + loc_origin + " to " + loc_destination + ". You should take a train, specially if it helps to reduce CO2 emissions."
    }
}
```

Let's prompt the model to help us booking flights with the help of this function:



```javascript
var result = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        tools: tools,
        tool_choice: "auto"
    }
});
```

You can find out if a tool needs to be called by inspecting the response. When a tool needs to be called, you will see `finish_reason` is `tool_calls`.



```javascript
const response_message = response.body.choices[0].message
const tool_calls = response_message.tool_calls

console.log("Finish reason: " + response.body.choices[0].finish_reason)
console.log("Tool call: " + tool_calls)
```

Let's append this message to the chat history:



```javascript
messages.push(response_message);
```

Now, it's time to call the appropiate function to handle the tool call. In the following code snippet we iterate over all the tool calls indicated in the response and call the corresponding function with the approapriate parameters. Notice also how we append the response to the chat history.



```javascript
function applyToolCall({ function: call, id }) {
    // Get the tool details:
    const tool_params = JSON.parse(call.arguments);
    console.log("Calling function " + call.name + " with arguments " + tool_params)

    // Call the function defined above using `window`, which returns the list of all functions 
    // available in the scope as a dictionary. Notice that this is just done as a simple way to get
    // the function callable from its string name. Then we can call it with the corresponding
    // arguments.
    const function_response = tool_params.map(window[call.name]);
    console.log("-> " + function_response)

    return function_response
}

for (const tool_call of tool_calls) {
    var tool_response = tool_call.apply(applyToolCall)

    messages.push(
        {
            role: "tool",
            tool_call_id = tool_call.id,
            content = tool_response
        }
    )
}
```

Let's see the response from the model now:



```javascript
var result = await client.path("/chat/completions").post({
    body: {
        messages: messages,
        tools: tools,
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



::: zone-end


::: zone pivot="programming-language-rest"

## Mistral family of models

The Mistral family of models includes the following models:



# [Mistral Large](#tab/mistral-large)

Mistral Large is Mistral AI's most advanced Large Language Model (LLM). It can be used on any language-based task, thanks to its state-of-the-art reasoning and knowledge capabilities.

Additionally, Mistral Large is:

* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32-K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Large



# [Mistral Small](#tab/mistral-small)

Mistral Small is Mistral AI's most efficient Large Language Model (LLM). It can be used on any language-based task that requires high efficiency and low latency.

Mistral Small is:

* **A small model optimized for low latency**. Very efficient for high volume and low latency workloads. Mistral Small is Mistral's smallest proprietary model, it outperforms Mixtral-8x7B and has lower latency.
* **Specialized in RAG**. Crucial information isn't lost in the middle of long context windows (up to 32K tokens).
* **Strong in coding**. Code generation, review, and comments. Supports all mainstream coding languages.
* **Multi-lingual by design**. Best-in-class performance in French, German, Spanish, Italian, and English. Dozens of other languages are supported.
* **Responsible AI compliant**. Efficient guardrails baked in the model, and extra safety layer with the safe_mode option.


The following models are available:

- Mistral-Small



---



## Prerequisites

To use Mistral models with Azure AI studio, you need the following prerequisites:



### Deploy the model

Mistral premium chat models can be deployed to Servereless API endpoints. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription. If your model isn't deployed already, use the Azure AI Studio, Azure Machine Learning SDK for Python, the Azure CLI, or ARM templates to [deploy the model as a serverless API](deploy-models-serverless.md).



### Use the Azure AI model inference API

Models deployed with the [Azure AI model inference API](https://aka.ms/azureai/modelinference) can be consumed using any REST client. To use the REST client, you need the following prerequisites:

* To construct the requests, you will need to pass in the endpoint URL. The endpoint URL has the form `https://your-host-name.your-azure-region.inference.ai.azure.com`, where your-host-name is your unique model deployment host name and your-azure-region is the Azure region where the model is deployed (e.g. eastus2).
* Depending on your model deployment and authentication preference, you either need a key to authenticate against the service, or Entra ID credentials. The key is a 32-character string.



> [!TIP]
> Additionally, MistralAI supports the use of a tailored API that can be used to exploit specific features from the model. To use the model-provider specific API, check [MistralAI documentation](https://docs.mistral.ai/).



## Chat completions

The following example shows how to make basic usage of the Azure AI Model Inference API with a chat-completions model for chat.

First, let's create a client to consume the model.



### Get the model's capabilities

The `/info` route returns information about the model that is deployed to the endpoint. Return the model's information by calling the following method:



The response is as follows:



```console
{
    "model_name": "Mistral-Large",
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

The response is as follows, where you can see the model's usage statistics:



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726686,
    "model": "Mistral-Large",
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
    "model": "Mistral-Large",
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
    "model": "Mistral-Large",
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

#### JSON outputs

Mistral premium chat models can create JSON outputs. Setting `response_format` to `json_object` enables JSON mode, which guarantees the message the model generates is valid JSON. You must also instruct the model to produce JSON yourself via a system or user message. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant that always generate responses in JSON format, using the following format: { \"answer\": \"response\" }"
        },
        {
            "role": "user",
            "content": "How many languages are in the world?"
        }
    ],
    "response_format": { "type": "json_object" }
}
```

```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718727522,
    "model": "Mistral-Large",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "{\"answer\": \"There are approximately 7,117 living languages in the world today, according to the latest estimates. However, this number can vary as some languages become extinct and others are newly discovered or classified.\"}",
                "tool_calls": null
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 39,
        "total_tokens": 87,
        "completion_tokens": 48
    }
}
```

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

### Safe mode

Mistral premium chat models supports the parameter `safe_prompt`. Toggling the safe prompt will prepend your messages with the following system prompt:

> Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.

The Azure AI Model Inference API allows you to pass this extra paramter in the following way:



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
    "safemode": true
}
```

### Tools

Mistral premium chat models supports the use of tools, which can be an extraordinary resource when you need to offload specific tasks from the language model and instead rely on a more deterministic system or even a different language model. The Azure AI Model Inference API allows you define tools in the following way.

In this example, we are creating a tool definition that is able to look from flight information from two different cities.



```json
{
    "type": "function",
    "function": {
        "name": "get_flight_info",
        "description": "Returns information about the next flight between two cities. This includes the name of the airline, flight number and the date and time of the next flight",
        "parameters": {
            "type": "object",
            "properties": {
                "origin_city": {
                    "type": "string",
                    "description": "The name of the city where the flight originates"
                },
                "destination_city": {
                    "type": "string",
                    "description": "The flight destination city"
                }
            },
            "required": [
                "origin_city",
                "destination_city"
            ]
        }
    }
}
```

In this simple example, we will implement this function in a simple way by just returning that there is no flights available for the selected route, but the user should consider taking a train.



Let's prompt the model to help us booking flights with the help of this function:



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant that help users to find information about traveling, how to get to places and the different transportations options. You care about the environment and you always have that in mind when answering inqueries"
        },
        {
            "role": "user",
            "content": "When is the next flight from Miami to Seattle?"
        }
    ],
    "tool_choice": "auto",
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "get_flight_info",
                "description": "Returns information about the next flight between two cities. This includes the name of the airline, flight number and the date and time of the next flight",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "origin_city": {
                            "type": "string",
                            "description": "The name of the city where the flight originates"
                        },
                        "destination_city": {
                            "type": "string",
                            "description": "The flight destination city"
                        }
                    },
                    "required": [
                        "origin_city",
                        "destination_city"
                    ]
                }
            }
        }
    ]
}
```

You can find out if a tool needs to be called by inspecting the response. When a tool needs to be called, you will see `finish_reason` is `tool_calls`.



```json
{
    "id": "0a1234b5de6789f01gh2i345j6789klm",
    "object": "chat.completion",
    "created": 1718726007,
    "model": "Mistral-Large",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    {
                        "id": "abc0dF1gh",
                        "type": "function",
                        "function": {
                            "name": "get_flight_info",
                            "arguments": "{\"origin_city\": \"Miami\", \"destination_city\": \"Seattle\"}",
                            "call_id": null
                        }
                    }
                ]
            },
            "finish_reason": "tool_calls",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 190,
        "total_tokens": 226,
        "completion_tokens": 36
    }
}
```

Let's append this message to the chat history:



Now, it's time to call the appropiate function to handle the tool call. In the following code snippet we iterate over all the tool calls indicated in the response and call the corresponding function with the approapriate parameters. Notice also how we append the response to the chat history.



Let's see the response from the model now:



```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant that help users to find information about traveling, how to get to places and the different transportations options. You care about the environment and you always have that in mind when answering inqueries"
        },
        {
            "role": "user",
            "content": "When is the next flight from Miami to Seattle?"
        },
        {
            "role": "assistant",
            "content": "",
            "tool_calls": [
                {
                    "id": "abc0DeFgH",
                    "type": "function",
                    "function": {
                        "name": "get_flight_info",
                        "arguments": "{\"origin_city\": \"Miami\", \"destination_city\": \"Seattle\"}",
                        "call_id": null
                    }
                }
            ]
        },
        {
            "role": "tool",
            "content": "{ \"info\": \"There are no flights available from Miami to Seattle. You should take a train, specially if it helps to reduce CO2 emissions.\" }",
            "tool_call_id": "abc0DeFgH" 
        }
    ],
    "tool_choice": "auto",
    "tools": [
        {
            "type": "function",
            "function": {
            "name": "get_flight_info",
            "description": "Returns information about the next flight between two cities. This includes the name of the airline, flight number and the date and time of the next flight",
            "parameters":{
                "type": "object",
                "properties": {
                    "origin_city": {
                        "type": "string",
                        "description": "The name of the city where the flight originates"
                    },
                    "destination_city": {
                        "type": "string",
                        "description": "The flight destination city"
                    }
                },
                "required": ["origin_city", "destination_city"]
            }
            }
        }
    ]
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
> To learn more about how you can configure and control Azure AI content safety settings, check the [Azure AI content safety documentation](https://aka.ms/azureaicontentsafety).



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

Mistral models deployed as a serverless API are offered by MistralAI through the Azure Marketplace and integrated with Azure AI Studio for use. You can find the Azure Marketplace pricing when deploying the model.

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

