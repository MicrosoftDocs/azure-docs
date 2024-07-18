---
title: 'How to generate reproducible output with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to generate reproducible output (preview) with Azure OpenAI Service.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 04/09/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false

---

# Learn how to use reproducible output (preview)

By default if you ask an Azure OpenAI Chat Completion model the same question multiple times you're likely to get a different response. The responses are therefore considered to be non-deterministic. Reproducible output is a new  preview feature that allows you to selectively change the default behavior to help product more deterministic outputs.

## Reproducible output support

Reproducible output is only currently supported with the following:

### Supported models

* `gpt-35-turbo` (1106) - [region availability](../concepts/models.md#gpt-35-turbo-model-availability)
* `gpt-35-turbo` (0125) - [region availability](../concepts/models.md#gpt-35-turbo-model-availability)
* `gpt-4` (1106-Preview) - [region availability](../concepts/models.md#gpt-4-and-gpt-4-turbo-model-availability)
* `gpt-4` (0125-Preview) - [region availability](../concepts/models.md#gpt-4-and-gpt-4-turbo-model-availability)

### API Version

Support for reproducible output was first added in API version [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json)

## Example

First we'll generate three responses to the same question to demonstrate the variability that is common to Chat Completion responses even when other parameters are the same:

# [Python](#tab/pyton)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version="2024-02-01"
)

for i in range(3):
  print(f'Story Version {i + 1}\n---')
    
  response = client.chat.completions.create(
    model="gpt-35-turbo-0125", # Model = should match the deployment name you chose for your 0125-preview model deployment
    #seed=42,
    temperature=0.7,
    max_tokens =50, 
    messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Tell me a story about how the universe began?"}
    ]
  )
  
  print(response.choices[0].message.content)
  print("---\n")
  
  del response
```

# [PowerShell](#tab/powershell)

```powershell-interactive
$openai = @{
   api_key     = $Env:AZURE_OPENAI_API_KEY
   api_base    = $Env:AZURE_OPENAI_ENDPOINT # like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
   api_version = '2024-02-01' # may change in the future
   name        = 'YOUR-DEPLOYMENT-NAME-HERE' # name you chose for your deployment
}

$headers = @{
  'api-key' = $openai.api_key
}

$messages  = @()
$messages += @{
  role     = 'system'
  content  = 'You are a helpful assistant.'
}
$messages += @{
  role     = 'user'
  content  = 'Tell me a story about how the universe began?'
}

$body         = @{
  #seed       = 42
  temperature = 0.7
  max_tokens  = 50
  messages    = $messages
} | ConvertTo-Json

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

for ($i=0; $i -le 2; $i++) {
  $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
  write-host "Story Version $($i+1)`n---`n$($response.choices[0].message.content)`n---`n"
}
```

---

### Output

```output
Story Version 1
---
Once upon a time, before there was time, there was nothing but a vast emptiness. In this emptiness, there existed a tiny, infinitely dense point of energy. This point contained all the potential for the universe as we know it. And
---

Story Version 2
---
Once upon a time, long before the existence of time itself, there was nothing but darkness and silence. The universe lay dormant, a vast expanse of emptiness waiting to be awakened. And then, in a moment that defies comprehension, there
---

Story Version 3
---
Once upon a time, before time even existed, there was nothing but darkness and stillness. In this vast emptiness, there was a tiny speck of unimaginable energy and potential. This speck held within it all the elements that would come
```

Notice that while each story might have similar elements and some verbatim repetition the longer the response goes on the more they tend to diverge.

Now we'll run the same code as before but this time uncomment the line for the parameter that says `seed=42`

# [Python](#tab/pyton)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version="2024-02-01"
)

for i in range(3):
  print(f'Story Version {i + 1}\n---')
    
  response = client.chat.completions.create(
    model="gpt-35-turbo-0125", # Model = should match the deployment name you chose for your 0125-preview model deployment
    seed=42,
    temperature=0.7,
    max_tokens =50, 
    messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Tell me a story about how the universe began?"}
    ]
  )
  
  print(response.choices[0].message.content)
  print("---\n")
  
  del response
```

# [PowerShell](#tab/powershell)

```powershell-interactive
$openai = @{
   api_key     = $Env:AZURE_OPENAI_API_KEY
   api_base    = $Env:AZURE_OPENAI_ENDPOINT # like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
   api_version = '2024-02-01' # may change in the future
   name        = 'YOUR-DEPLOYMENT-NAME-HERE' # name you chose for your deployment
}

$headers = @{
  'api-key' = $openai.api_key
}

$messages  = @()
$messages += @{
  role     = 'system'
  content  = 'You are a helpful assistant.'
}
$messages += @{
  role     = 'user'
  content  = 'Tell me a story about how the universe began?'
}

$body         = @{
  seed        = 42
  temperature = 0.7
  max_tokens  = 50
  messages    = $messages
} | ConvertTo-Json

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

for ($i=0; $i -le 2; $i++) {
  $response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
  write-host "Story Version $($i+1)`n---`n$($response.choices[0].message.content)`n---`n"
}
```

---

### Output

```
Story Version 1
---
In the beginning, there was nothing but darkness and silence. Then, suddenly, a tiny point of light appeared. This point of light contained all the energy and matter that would eventually form the entire universe. With a massive explosion known as the Big Bang
---

Story Version 2
---
In the beginning, there was nothing but darkness and silence. Then, suddenly, a tiny point of light appeared. This point of light contained all the energy and matter that would eventually form the entire universe. With a massive explosion known as the Big Bang
---

Story Version 3
---
In the beginning, there was nothing but darkness and silence. Then, suddenly, a tiny point of light appeared. This was the moment when the universe was born.

The point of light began to expand rapidly, creating space and time as it grew.
---
```

By using the same `seed` parameter of 42 for each of our three requests, while keeping all other parameters the same, we're able to produce much more consistent results.

> [!IMPORTANT]  
> Determinism is not guaranteed with reproducible output. Even in cases where the seed parameter and `system_fingerprint` are the same across API calls it is currently not uncommon to still observe a degree of variability in responses. Identical API calls with larger `max_tokens` values, will generally result in less deterministic responses even when the seed parameter is set.

## Parameter details

`seed` is an optional parameter, which can be set to an integer or null.

This feature is in Preview. If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result. Determinism isn't guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.

`system_fingerprint` is a string and is part of the chat completion object.

This fingerprint represents the backend configuration that the model runs with.

It can be used with the seed request parameter to understand when backend changes have been made that might affect determinism.

To view the full chat completion object with `system_fingerprint`, you could add ` print(response.model_dump_json(indent=2))` to the previous Python code next to the existing print statement, or `$response | convertto-json -depth 5` at the end of the PowerShell example. This change results in the following additional information being part of the output:

### Output

```JSON
{
  "id": "chatcmpl-8LmLRatZxp8wsx07KGLKQF0b8Zez3",
  "choices": [
    {
      "finish_reason": "length",
      "index": 0,
      "message": {
        "content": "In the beginning, there was nothing but a vast emptiness, a void without form or substance. Then, from this nothingness, a singular event occurred that would change the course of existence forever—The Big Bang.\n\nAround 13.8 billion years ago, an infinitely hot and dense point, no larger than a single atom, began to expand at an inconceivable speed. This was the birth of our universe, a moment where time and space came into being. As this primordial fireball grew, it cooled, and the fundamental forces that govern the cosmos—gravity, electromagnetism, and the strong and weak nuclear forces—began to take shape.\n\nMatter coalesced into the simplest elements, hydrogen and helium, which later formed vast clouds in the expanding universe. These clouds, driven by the force of gravity, began to collapse in on themselves, creating the first stars. The stars were crucibles of nuclear fusion, forging heavier elements like carbon, nitrogen, and oxygen",
        "role": "assistant",
        "function_call": null,
        "tool_calls": null
      },
      "content_filter_results": {
        "hate": {
          "filtered": false,
          "severity": "safe"
        },
        "self_harm": {
          "filtered": false,
          "severity": "safe"
        },
        "sexual": {
          "filtered": false,
          "severity": "safe"
        },
        "violence": {
          "filtered": false,
          "severity": "safe"
        }
      }
    }
  ],
  "created": 1700201417,
  "model": "gpt-4",
  "object": "chat.completion",
  "system_fingerprint": "fp_50a4261de5",
  "usage": {
    "completion_tokens": 200,
    "prompt_tokens": 27,
    "total_tokens": 227
  },
  "prompt_filter_results": [
    {
      "prompt_index": 0,
      "content_filter_results": {
        "hate": {
          "filtered": false,
          "severity": "safe"
        },
        "self_harm": {
          "filtered": false,
          "severity": "safe"
        },
        "sexual": {
          "filtered": false,
          "severity": "safe"
        },
        "violence": {
          "filtered": false,
          "severity": "safe"
        }
      }
    }
  ]
}
```

## Additional considerations

When you want to use reproducible outputs, you need to set the `seed` to the same integer across chat completions calls. You should also match any other parameters like `temperature`, `max_tokens`, etc.