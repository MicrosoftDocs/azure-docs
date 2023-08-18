---
title: How to switch between OpenAI and Azure OpenAI Service endpoints with Python
titleSuffix: Azure OpenAI Service
description: Learn about the changes you need to make to your code to swap back and forth between OpenAI and Azure OpenAI endpoints.
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: cognitive-services
ms.subservice: openai
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 07/20/2023
manager: nitinme
---

# How to switch between OpenAI and Azure OpenAI endpoints with Python

While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), there are small changes you need to make to your code in order to swap back and forth between endpoints. This article walks you through the common changes and differences you'll experience when working across OpenAI and Azure OpenAI.

> [!NOTE]
> This library is maintained by OpenAI and is currently in preview. Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

## Authentication

We recommend using environment variables. If you haven't done this before our [Python quickstarts](../quickstart.md) walk you through this configuration.

### API key

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
import openai

openai.api_key = "sk-..."
openai.organization = "..."


```

</td>
<td>

```python
import openai

openai.api_type = "azure"
openai.api_key = "..."
openai.api_base = "https://example-endpoint.openai.azure.com"
openai.api_version = "2023-05-15"  # subject to change
```

</td>
</tr>
</table>

### Azure Active Directory authentication

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
import openai

openai.api_key = "sk-..."
openai.organization = "..."






```

</td>
<td>

```python
import openai
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://cognitiveservices.azure.com/.default")

openai.api_type = "azure_ad"
openai.api_key = token.token
openai.api_base = "https://example-endpoint.openai.azure.com"
openai.api_version = "2023-05-15"  # subject to change
```

</td>
</tr>
</table>

## Keyword argument for model

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of [deployments](create-resource.md?pivots=web-portal#deploy-a-model) and uses the `deployment_id` keyword argument to describe which model deployment to use. Azure OpenAI also supports the use of `engine` interchangeably with `deployment_id`.

For OpenAI `engine` still works in most instances, but it's deprecated and `model` is preferred.

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
completion = openai.Completion.create(
    prompt="<prompt>",
    model="text-davinci-003"
)
  
chat_completion = openai.ChatCompletion.create(
    messages="<messages>",
    model="gpt-4"
)

embedding = openai.Embedding.create(
  input="<input>",
  model="text-embedding-ada-002"
)




```

</td>
<td>

```python
completion = openai.Completion.create(
    prompt="<prompt>",
    deployment_id="text-davinci-003"
    #engine="text-davinci-003" 
)
  
chat_completion = openai.ChatCompletion.create(
    messages="<messages>",
    deployment_id="gpt-4"
    #engine="gpt-4"

)

embedding = openai.Embedding.create(
  input="<input>",
  deployment_id="text-embedding-ada-002"
  #engine="text-embedding-ada-002"
)
```

</td>
</tr>
</table>

## Azure OpenAI embeddings multiple input support

OpenAI currently allows a larger number of array inputs with text-embedding-ada-002. Azure OpenAI currently supports input arrays up to 16 for text-embedding-ada-002 Version 2. Both require the max input token limit per API request to remain under 8191 for this model.

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
inputs = ["A", "B", "C"] 

embedding = openai.Embedding.create(
  input=inputs,
  model="text-embedding-ada-002"
)


```

</td>
<td>

```python
inputs = ["A", "B", "C"] #max array size=16

embedding = openai.Embedding.create(
  input=inputs,
  deployment_id="text-embedding-ada-002"
  #engine="text-embedding-ada-002"
)
```

</td>
</tr>
</table>

## Next steps

* Learn more about how to work with GPT-35-Turbo and the GPT-4 models with [our how-to guide](../how-to/chatgpt.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
