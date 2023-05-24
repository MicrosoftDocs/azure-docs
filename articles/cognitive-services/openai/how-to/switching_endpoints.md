---
title: How to between OpenAI and Azure OpenAI Service endpoints with Python.
titleSuffix: Azure OpenAI Service
description: Learn about the changes you need to make to your code to swap back and forth between OpenAI and Azure OpenAI endpoints.
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: cognitive-services
ms.custom: 
ms.topic: how-to
ms.date: 05/24/2023
manager: nitinme
---

# How to switch between OpenAI and Azure OpenAI endpoints with Python

While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python) there are small changes you need to make to your code in order to swap back and forth between endpoints. This article will walk you through the common changes and differences you will experience when working across OpenAI and Azure OpenAI.

> [!NOTE]
> This library is maintained by OpenAI and is currently in preview. Refer to the [release history](https://github.com/openai/openai-python/releases) or the [version.py commit history](https://github.com/openai/openai-python/commits/main/openai/version.py) to track the latest updates to the library.

## Authentication

We recommend using environment variables. If you haven't done this before our [Python quickstarts](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/quickstart?pivots=programming-language-python&tabs=command-line) walk you through this configuration.

### API key

:::row:::
    :::column:::
        **OpenAI**
            import openai
            openai.api_key = "sk-..."
    :::column-end:::
    :::column span="2":::
        **Azure OpenAI**
            import openai
            
            openai.api_type = "azure"
            openai.api_key = "..."
            openai.api_base = "https://example-endpoint.openai.azure.com"
            openai.api_version = "2023-05-15"  # subject to change
    :::column-end:::
:::row-end:::

### API key

<table>
<tr>
<td> OAI </td> <td> AOAI </td>
</tr>
<tr>
<td>

```python
import openai

openai.api_key = "sk-..."
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
<td> OAI </td> <td> AOAI </td>
</tr>
<tr>
<td>

```python
import openai

openai.api_key = "sk-..."
```

</td>
<td>

```python
import openai
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://cognitiveservices.azure.com/.default")

openai.api_type = "azuread"
openai.api_key = token.token
openai.api_base = "https://example-endpoint.openai.azure.com"
openai.api_version = "2023-05-15"  # subject to change
```

</td>
</tr>
</table>

## Keyword argument for model

OAI uses the `model` keyword argument to specify what model to use. AOAI has the concept of [deployments](https://learn.microsoft.com/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) and uses the `deployment_id` keyword argument to describe which model deployment to use.

<table>
<tr>
<td> OAI </td> <td> AOAI </td>
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
)
  
chat_completion = openai.ChatCompletion.create(
    messages="<messages>",
    deployment_id="gpt-4"
)

embedding = openai.Embedding.create(
  input="<input>",
  deployment_id="text-embedding-ada-002"
)
```

</td>
</tr>
</table>


## AOAI embeddings does not support multiple inputs yet

Many examples show passing multiple inputs into the embeddings API. For AOAI, currently we must pass a single text input per call.

<table>
<tr>
<td> OAI </td> <td> AOAI </td>
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
inputs = ["A", "B", "C"]

for text in inputs:
    embedding = openai.Embedding.create(
        input=text,
        deployment_id="text-embedding-ada-002"
    )
```

</td>
</tr>
</table>
