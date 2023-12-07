---
title: 'How to use JSON mode with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to improve your chat completions with Azure OpenAI JSON mode
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 12/05/2023
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords: 

---

# Learn how to use JSON mode

JSON mode allows you to set the models response format to return a valid JSON object as part of a chat completion. While generating valid JSON was possible previously, there could be issues with response consistency that would lead to invalid JSON objects being generated.

## JSON mode support

JSON mode is only currently supported with the following models:

### Supported models

- `gpt-4-1106-preview` ([region availability](../concepts/models.md#gpt-4-and-gpt-4-turbo-preview-model-availability))
- `gpt-35-turbo-1106` ([region availability)](../concepts/models.md#gpt-35-turbo-model-availability))

### API version

- `2023-12-01-preview`

## Example

# [Python](#tab/python)

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

### Output

```json
{
  "winner": "Los Angeles Dodgers",
  "event": "World Series",
  "year": 2020
}
```

# [PowerShell](#tab/powershell)

In this example, the user asks for historical information in a specific JSON schema
because they plan to use the output for further scripting.

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
  content  = 'You are a helpful assistant designed to output JSON.'
}
$messages += @{
  role     = 'user'
  content  = 'Who through the final pitch during the world series each year from 1979 to 1989?'
}
$messages += @{
  role     = 'user'
  content  = 'Respond using schema. response:{year, team, player, player_height}.'
}

$body      = @{
  response_format = @{type = 'json_object'}
  messages = $messages
} | ConvertTo-Json

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

$response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
$response.choices[0].message.content
```

### Output

The JSON output capability makes it easy for PowerShell to convert the response into a .NET object.
Pass the data through a `|` pipe to run more scripting steps such as sorting.

```powershell
if ($response.choices[0].finish_reason -eq 'stop') {
  $response.choices[0].message.content | ConvertFrom-Json | ForEach-Object response | Sort player_height -Descending
} else { write-warning 'the JSON response was incomplete'}

year team                  player           player_height
---- ----                  ------           -------------
1979 Pittsburgh Pirates    Kent Tekulve     6' 4"
1984 Detroit Tigers        Willie Hernandez 6' 3"
1988 Los Angeles Dodgers   Orel Hershiser   6' 3"
1982 St. Louis Cardinals   Bruce Sutter     6' 2"
1985 Kansas City Royals    Dan Quisenberry  6' 2"
1986 New York Mets         Jesse Orosco     6' 2"
1989 Oakland Athletics     Dennis Eckersley 6' 2"
1981 Los Angeles Dodgers   Steve Howe       6' 1"
1980 Philadelphia Phillies Tug McGraw       6' 0"
1987 Minnesota Twins       Jeff Reardon     6' 0"
1983 Baltimore Orioles     Tippy Martinez   5' 10"
```

---

There are two key factors that need to be present to successfully use JSON mode:

- `response_format={ "type": "json_object" }`
- We told the model to output JSON as part of the system message.

Including guidance to the model that it should produce JSON as part of the messages conversation is **required**. We recommend adding instruction as part of the system message. According to OpenAI failure to add this instruction can cause the model to *"generate an unending stream of whitespace and the request could run continually until it reaches the token limit."*

Failure to include "JSON" within the messages returns:

### Output

```output
BadRequestError: Error code: 400 - {'error': {'message': "'messages' must contain the word 'json' in some form, to use 'response_format' of type 'json_object'.", 'type': 'invalid_request_error', 'param': 'messages', 'code': None}}
```

## Other considerations

You should check `finish_reason` for the value `length` before parsing the response. The model might generate partial JSON. This means that output from the model was larger than the available max_tokens that were set as part of the request, or the conversation itself exceeded the token limit.

JSON mode produces JSON that is valid and parses without error. However, there's no guarantee for
output to match a specific schema, even if requested in the prompt.