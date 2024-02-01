---
title: 'How to generate reproducible output with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to generate reproducible output (preview) with Azure OpenAI Service
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 11/17/2023
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords: 

---

# Learn how to use reproducible output (preview)

By default if you ask an Azure OpenAI Chat Completion model the same question multiple times you are likely to get a different response. The responses are therefore considered to be non-deterministic. Reproducible output is a new  preview feature that allows you to selectively change the default behavior towards producing more deterministic outputs.

## Reproducible output support

Reproducible output is only currently supported with the following:

### Supported models

- `gpt-4-1106-preview` ([region availability](../concepts/models.md#gpt-4-and-gpt-4-turbo-preview-model-availability))
- `gpt-35-turbo-1106` ([region availability)](../concepts/models.md#gpt-35-turbo-model-availability))

### API Version

- `2023-12-01-preview`

## Example

First we'll generate three responses to the same question to demonstrate the variability that is common to Chat Completion responses even when other parameters are the same:

# [Python](#tab/pyton)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-12-01-preview"
)

for i in range(3):
  print(f'Story Version {i + 1}\n---')
    
  response = client.chat.completions.create(
    model="gpt-4-1106-preview", # Model = should match the deployment name you chose for your 1106-preview model deployment
    #seed=42,
    temperature=0.7,
    max_tokens =200, 
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
   api_key     = $Env:AZURE_OPENAI_KEY
   api_base    = $Env:AZURE_OPENAI_ENDPOINT # like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
   api_version = '2023-12-01-preview' # may change in the future
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
  max_tokens  = 200
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
In the beginning, there was nothingness, a vast expanse of empty space, a blank canvas waiting to be painted with the wonders of existence. Then, approximately 13.8 billion years ago, something extraordinary happened, an event that would mark the birth of the universe – the Big Bang.

The Big Bang was not an explosion in the conventional sense but rather an expansion, an incredibly rapid stretching of space that took place everywhere in the universe at once. In just a fraction of a second, the universe grew from smaller than a single atom to an incomprehensibly large expanse.

In these first moments, the universe was unimaginably hot and dense, filled with a seething soup of subatomic particles and radiant energy. As the universe expanded, it began to cool, allowing the first particles to form. Protons and neutrons came together to create the first simple atomic nuclei in a process known as nucleosynthesis.

For hundreds of thousands of years, the universe continued to cool and expand
---

Story Version 2
---
Once upon a time, in the vast expanse of nothingness, there was a moment that would come to define everything. This moment, a tiny fraction of a second that would be forever known as the Big Bang, marked the birth of the universe as we know it.

Before this moment, there was no space, no time, just an infinitesimally small point of pure energy, a singularity where all the laws of physics as we understand them did not apply. Then, suddenly, this singular point began to expand at an incredible rate. In a cosmic symphony of creation, matter, energy, space, and time all burst forth into existence.

The universe was a hot, dense soup of particles, a place of unimaginable heat and pressure. It was in this crucible of creation that the simplest elements were formed. Hydrogen and helium, the building blocks of the cosmos, came into being.

As the universe continued to expand and cool, these primordial elements began to co
---

Story Version 3
---
Once upon a time, in the vast expanse of nothingness, there was a singularity, an infinitely small and infinitely dense point where all the mass and energy of what would become the universe were concentrated. This singularity was like a tightly wound cosmic spring holding within it the potential of everything that would ever exist.

Then, approximately 13.8 billion years ago, something extraordinary happened. This singularity began to expand in an event we now call the Big Bang. In just a fraction of a second, the universe grew exponentially during a period known as cosmic inflation. It was like a symphony's first resounding chord, setting the stage for a cosmic performance that would unfold over billions of years.

As the universe expanded and cooled, the fundamental forces of nature that we know today – gravity, electromagnetism, and the strong and weak nuclear forces – began to take shape. Particles of matter were created and began to clump together under the force of gravity, forming the first atoms
---
```

Notice that while each story might have similar elements and some verbatim repetition the longer the response goes on the more they tend to diverge.

Now we'll run the same code as before but this time uncomment the line for the parameter that says `seed=42`

# [Python](#tab/pyton)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-12-01-preview"
)

for i in range(3):
  print(f'Story Version {i + 1}\n---')
    
  response = client.chat.completions.create(
    model="gpt-4-1106-preview", # Model = should match the deployment name you chose for your 1106-preview model deployment
    seed=42,
    temperature=0.7,
    max_tokens =200, 
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
   api_key     = $Env:AZURE_OPENAI_KEY
   api_base    = $Env:AZURE_OPENAI_ENDPOINT # like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
   api_version = '2023-12-01-preview' # may change in the future
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
  max_tokens  = 200
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
In the beginning, there was nothing but a vast emptiness, a void without form or substance. Then, from this nothingness, a singular event occurred that would change the course of existence forever—The Big Bang.

Around 13.8 billion years ago, an infinitely hot and dense point, no larger than a single atom, began to expand at an inconceivable speed. This was the birth of our universe, a moment where time and space came into being. As this primordial fireball grew, it cooled, and the fundamental forces that govern the cosmos—gravity, electromagnetism, and the strong and weak nuclear forces—began to take shape.

Matter coalesced into the simplest elements, hydrogen and helium, which later formed vast clouds in the expanding universe. These clouds, driven by the force of gravity, began to collapse in on themselves, creating the first stars. The stars were crucibles of nuclear fusion, forging heavier elements like carbon, nitrogen, and oxygen
---

Story Version 2
---
In the beginning, there was nothing but a vast emptiness, a void without form or substance. Then, from this nothingness, a singular event occurred that would change the course of existence forever—The Big Bang.

Around 13.8 billion years ago, an infinitely hot and dense point, no larger than a single atom, began to expand at an inconceivable speed. This was the birth of our universe, a moment where time and space came into being. As this primordial fireball grew, it cooled, and the fundamental forces that govern the cosmos—gravity, electromagnetism, and the strong and weak nuclear forces—began to take shape.

Matter coalesced into the simplest elements, hydrogen and helium, which later formed vast clouds in the expanding universe. These clouds, driven by the force of gravity, began to collapse in on themselves, creating the first stars. The stars were crucibles of nuclear fusion, forging heavier elements like carbon, nitrogen, and oxygen
---

Story Version 3
---
In the beginning, there was nothing but a vast emptiness, a void without form or substance. Then, from this nothingness, a singular event occurred that would change the course of existence forever—The Big Bang.

Around 13.8 billion years ago, an infinitely hot and dense point, no larger than a single atom, began to expand at an inconceivable speed. This was the birth of our universe, a moment where time and space came into being. As this primordial fireball grew, it cooled, and the fundamental forces that govern the cosmos—gravity, electromagnetism, and the strong and weak nuclear forces—began to take shape.

Matter coalesced into the simplest elements, hydrogen and helium, which later formed vast clouds in the expanding universe. These clouds, driven by the force of gravity, began to collapse in on themselves, creating the first stars. The stars were crucibles of nuclear fusion, forging heavier elements like carbon, nitrogen, and oxygen
---
```

By using the same `seed` parameter of 42 for each of our three requests we're able to produce much more consistent (in this case identical) results.

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