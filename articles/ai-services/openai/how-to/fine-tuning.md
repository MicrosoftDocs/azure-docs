---
title: 'Customize a model with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using Python, the REST APIs, or Azure OpenAI Studio.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai, devx-track-python
ms.topic: how-to
ms.date: 01/30/2024
author: mrbullwinkle
ms.author: mbullwin
zone_pivot_groups: openai-fine-tuning
---

# Customize a model with fine-tuning

Azure OpenAI Service lets you tailor our models to your personal datasets by using a process known as *fine-tuning*. This customization step lets you get more out of the service by providing:

- Higher quality results than what you can get just from [prompt engineering](../concepts/prompt-engineering.md)
- The ability to train on more examples than can fit into a model's max request context limit.
- Lower-latency requests, particularly when using smaller models.

A fine-tuned model improves on the few-shot learning approach by training the model's weights on your own data. A customized model lets you achieve better results on a wider number of tasks without needing to provide examples in your prompt. The result is less text sent and fewer tokens processed on every API call, potentially saving cost and improving request latency.

::: zone pivot="programming-language-studio"

[!INCLUDE [Studio fine-tuning](../includes/fine-tuning-studio.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK fine-tuning](../includes/fine-tuning-python.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API fine-tuning](../includes/fine-tuning-rest.md)]

::: zone-end

## Function calling

> [!IMPORTANT]
> The `functions` and `function_call` parameters have been deprecated with the release of the [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json) version of the API. However, the fine-tuning API currently requires use of the legacy parameters.

Models that use the chat completions API support [function calling](../how-to/function-calling.md). Unfortunately, functions defined in your chat completion calls don't always perform as expected. Fine-tuning your model with function calling examples can improve model output by enabling you to:

* Get similarly formatted responses even when the full function definition isn't present. (Allowing you to potentially save money on prompt tokens.)
* Get more accurate and consistent outputs.

When constructing a training file of function calling examples, you would take a function definition like this:

```json
{
    "messages": [
        {"role": "user", "content": "What is the weather in San Francisco?"},
        {"role": "assistant", "function_call": {"name": "get_current_weather", "arguments": "{\"location\": \"San Francisco, USA\", \"format\": \"celsius\"}"}
    ],
    "functions": [{
        "name": "get_current_weather",
        "description": "Get the current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The city and country, eg. San Francisco, USA"},
                "format": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location", "format"]
        }
    }]
}
```

And express the information as a single line within your `.jsonl` training file as below:

```jsonl
{"messages": [{"role": "user", "content": "What is the weather in San Francisco?"}, {"role": "assistant", "function_call": {"name": "get_current_weather", "arguments": "{\"location\": \"San Francisco, USA\", \"format\": \"celsius\"}"}}], "functions": [{"name": "get_current_weather", "description": "Get the current weather", "parameters": {"type": "object", "properties": {"location": {"type": "string", "description": "The city and country, eg. San Francisco, USA"}, "format": {"type": "string", "enum": ["celsius", "fahrenheit"]}}, "required": ["location", "format"]}}]}
```

As with all fine-tuning training your example file requires at least 10 examples.

### Optimize for cost

OpenAI recommends that if you're trying to optimize to use fewer prompt tokens post fine-tuning your model on the full function definitions you can experiment with:

* Omit function and parameter descriptions: remove the description field from function and parameters.
* Omit parameters: remove the entire properties field from the parameters object.
* Omit function entirely: remove the entire function object from the functions array.

### Optimize for quality

Alternatively, if you're trying to improve the quality of the function calling output, it's recommended that the function definitions present in the fine-tuning training dataset and subsequent chat completion calls remain identical.

### Customize model responses to function outputs

Fine-tuning based on function calling examples can also be used to improve the model's response to function outputs. To accomplish this, you include examples consisting of function response messages and assistant response messages where the function response is interpreted and put into context by the assistant.

```json
{
    "messages": [
        {"role": "user", "content": "What is the weather in San Francisco?"},
        {"role": "assistant", "function_call": {"name": "get_current_weather", "arguments": "{\"location\": \"San Francisco, USA\", \"format\": \"celcius\"}"}}
        {"role": "function", "name": "get_current_weather", "content": "21.0"},
        {"role": "assistant", "content": "It is 21 degrees celsius in San Francisco, CA"}
    ],
    "functions": [...] // same as before
}
```

As with the example before, this example is artificially expanded for readability. The actual entry in the `.jsonl` training file would be a single line:

```jsonl
{"messages": [{"role": "user", "content": "What is the weather in San Francisco?"}, {"role": "assistant", "function_call": {"name": "get_current_weather", "arguments": "{\"location\": \"San Francisco, USA\", \"format\": \"celcius\"}"}}, {"role": "function", "name": "get_current_weather", "content": "21.0"}, {"role": "assistant", "content": "It is 21 degrees celsius in San Francisco, CA"}], "functions": []}
```

## Troubleshooting

### How do I enable fine-tuning? Create a custom model is greyed out in Azure OpenAI Studio?

In order to successfully access fine-tuning, you need **Cognitive Services OpenAI Contributor assigned**. Even someone with high-level Service Administrator permissions would still need this account explicitly set in order to access fine-tuning. For more information, please review the [role-based access control guidance](/azure/ai-services/openai/how-to/role-based-access-control#cognitive-services-openai-contributor).
 
## Next steps

- Explore the fine-tuning capabilities in the [Azure OpenAI fine-tuning tutorial](../tutorials/fine-tune.md).
- Review fine-tuning [model regional availability](../concepts/models.md#fine-tuning-models)
