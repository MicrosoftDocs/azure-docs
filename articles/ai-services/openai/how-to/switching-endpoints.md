---
title: How to switch between OpenAI and Azure OpenAI Service endpoints with Python
titleSuffix: Azure OpenAI Service
description: Learn about the changes you need to make to your code to swap back and forth between OpenAI and Azure OpenAI endpoints.
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: azure-ai-openai
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 11/22/2023
manager: nitinme
---

# How to switch between OpenAI and Azure OpenAI endpoints with Python

While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), there are small changes you need to make to your code in order to swap back and forth between endpoints. This article walks you through the common changes and differences you'll experience when working across OpenAI and Azure OpenAI.

# [OpenAI Python 0.28.1](#tab/python)

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

<a name='azure-active-directory-authentication'></a>

### Microsoft Entra authentication

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

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of [deployments](create-resource.md?pivots=web-portal#deploy-a-model) and uses the `deployment_id` keyword argument to describe which model deployment to use. Azure OpenAI also supports the use of `engine` interchangeably with `deployment_id`. `deployment_id` corresponds to the custom name you chose for your model during model deployment. By convention in our docs, we often show `deployment_id`'s which match the underlying model name, but if you chose a different deployment name that doesn't match the model name you need to use that name when working with models in Azure OpenAI.

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
    deployment_id="text-davinci-003" # This must match the custom deployment name you chose for your model.
    #engine="text-davinci-003" 
)
  
chat_completion = openai.ChatCompletion.create(
    messages="<messages>",
    deployment_id="gpt-4" # This must match the custom deployment name you chose for your model.
    #engine="gpt-4"

)

embedding = openai.Embedding.create(
  input="<input>",
  deployment_id="text-embedding-ada-002" # This must match the custom deployment name you chose for your model.
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
  deployment_id="text-embedding-ada-002" # This must match the custom deployment name you chose for your model.
  #engine="text-embedding-ada-002"
)
```

</td>
</tr>
</table>

# [OpenAI Python 1.x](#tab/python-new)

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
from openai import OpenAI

client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY']  
)


```

</td>
<td>

```python
import os
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2023-10-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )
```

</td>
</tr>
</table>

<a name='azure-active-directory-authentication'></a>

### Microsoft Entra authentication

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
from openai import OpenAI

client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY']  
)






```

</td>
<td>

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

token_provider = get_bearer_token_provider(DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

api_version = "2023-12-01-preview"
endpoint = "https://my-resource.openai.azure.com"

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
)
```

</td>
</tr>
</table>

## Keyword argument for model

OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of [deployments](create-resource.md?pivots=web-portal#deploy-a-model) and uses the `deployment_id` keyword argument to describe which model deployment to use. Azure OpenAI also supports the use of `engine` interchangeably with `deployment_id`. `deployment_id` corresponds to the custom name you chose for your model during model deployment. By convention in our docs, we often show `deployment_id`'s which match the underlying model name, but if you chose a different deployment name that doesn't match the model name you need to use that name when working with models in Azure OpenAI.

For OpenAI `engine` still works in most instances, but it's deprecated and `model` is preferred.

<table>
<tr>
<td> OpenAI </td> <td> Azure OpenAI </td>
</tr>
<tr>
<td>

```python
completion = client.completions.create(
    model='gpt-3.5-turbo-instruct',
    prompt="<prompt>)
)

chat_completion = openai.chat.completions.create(
    model="gpt-4",
    messages="<messages>"
)

embedding = client.embeddings.create(
    input="<input>",
    model="text-embedding-ada-002"
)
```

</td>
<td>

```python
client.completions.create(
    model=gpt-35-turbo-instruct, # This must match the custom deployment name you chose for your model.
    prompt=<"prompt">
)

client.chat.completions.create(
    model="gpt-35-turbo", # model = "deployment_name".
    messages=<"messages">
)

client.embeddings.create(
    input = "<input>",
    model= "text-embedding-ada-002" # model = "deployment_name".
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

embedding = client.embeddings.create(
  input=inputs,
  model="text-embedding-ada-002"
)


```

</td>
<td>

```python
inputs = ["A", "B", "C"] #max array size=16

embedding = client.embeddings.create(
  input=inputs,
  model="text-embedding-ada-002" # This must match the custom deployment name you chose for your model.
  #engine="text-embedding-ada-002"
)
```

</td>
</tr>
</table>

---

## Next steps

* Learn more about how to work with GPT-35-Turbo and the GPT-4 models with [our how-to guide](../how-to/chatgpt.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
