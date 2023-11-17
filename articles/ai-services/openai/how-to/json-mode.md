---
title: 'How to use JSON mode with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to improve your chat completions with Azure OpenAI JSON mode
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

# Learn how to use JSON Mode

JSON mode allows you to set the models response format to return a valid JSON object as part of a chat completion. While generating valid JSON was possible previously, there could be issues with response consistency that would lead to invalid JSON objects being generated.

## JSON mode support

JSON mode is only currently supported with the following:

### Supported models

- `gpt-4-1106-preview`
- `gpt-35-turbo-1106`

### API Version

- `2023-12-01-preview`

## Example

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-12-01-preview"
)

response = client.chat.completions.create(
  model="gpt-4-1106-preview", # Model = should match the deployment name you chose for your 1106-preview model deployment
  response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Who won the world series in 2020?"}
  ]
)
print(response.choices[0].message.content)
```

```output
{
  "winner": "Los Angeles Dodgers",
  "event": "World Series",
  "year": 2020
}
```

There are two key factors that need to be present to successfully use JSON mode:

- `response_format={ "type": "json_object" }`
- We have told the model to output JSON as part of the system message.

Including guidance to the model that it should produce JSON as part of the messages conversation is **required**. We recommend adding this instruction as part of the system message. According to OpenAI failure to add this instruction can cause the model to *"generate an unending stream of whitespace and the request may run continually until it reaches the token limit."*

When using the [OpenAI Python API library](https://github.com/openai/openai-python) failure to include "JSON" within the messages array will return:

```output
BadRequestError: Error code: 400 - {'error': {'message': "'messages' must contain the word 'json' in some form, to use 'response_format' of type 'json_object'.", 'type': 'invalid_request_error', 'param': 'messages', 'code': None}}
```

## Additional considerations

You should check `finish_reason` for the value `length` before parsing the response. When this is present, you might have generated partial JSON. This means that output from the model was larger than the available max_tokens that were set as part of the request, or the conversation itself exceeded the token limit.

JSON mode will produce JSON that is valid and will parse without errors. However, this doesn't mean that output will match a specific schema.