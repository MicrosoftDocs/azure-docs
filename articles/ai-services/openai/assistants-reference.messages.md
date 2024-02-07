---
title: Azure OpenAI Service Assistants Python & REST API messages reference 
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API messages with Assistants
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/01/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Assistants API (Preview) messages reference

This article provides reference documentation for Python and REST for the new Assistants API (Preview). More in-depth step-by-step guidance is provided in the [getting started guide](./how-to/assistant.md).

## Create message

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages?api-version=2024-02-15-preview
```

Create a message.

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to create a message for. |

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |---          |
| `role` | string | Required | The role of the entity that is creating the message. Currently only user is supported.|
| `content` | string | Required | The content of the message. |
| `file_ids` | array | Optional | A list of File IDs that the message should use. There can be a maximum of 10 files attached to a message. Useful for tools like retrieval and code_interpreter that can access and use files. |
| `metadata` | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maxium of 512 characters long. |

### Returns

A message object.

### Example create message request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

thread_message = client.beta.threads.messages.create(
  "thread_abc123",
  role="user",
  content="How does AI work? Explain it in simple terms.",
)
print(thread_message)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
      "role": "user",
      "content": "How does AI work? Explain it in simple terms."
    }' 
```

---

## List messages

