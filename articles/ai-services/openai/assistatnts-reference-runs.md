---
title: Azure OpenAI Service Assistants Python & REST API runs reference 
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API runs with Assistants
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/01/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

 Assistants API (Preview) runs reference

This article provides reference documentation for Python and REST for the new Assistants API (Preview). More in-depth step-by-step guidance is provided in the [getting started guide](./how-to/assistant.md).

## Create run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-02-15-preview
```

Create a run.

**Path parameter**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to create a message for. |

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `assistant_id` | string | Required | The ID of the assistant to use to execute this run. |
| `model` | string or null | Optional | The ID of the Model to be used to execute this run. If a value is provided here, it will override the model associated with the assistant. If not, the model associated with the assistant will be used. |
| `instructions` | string or null | Optional | Overrides the instructions of the assistant. This is useful for modifying the behavior on a per-run basis. |
| `additional_instructions` | string or null | Optional | Appends additional instructions at the end of the instructions for the run. This is useful for modifying the behavior on a per-run basis without overriding other instructions. |
| `tools` | array or null | Optional | Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis. |
| `metadata` | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maxium of 512 characters long. |

### Returns

A run object.

### Example create message request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.runs.create(
  thread_id="thread_abc123",
  assistant_id="asst_abc123"
)
print(run)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "assistant_id": "asst_abc123"
  }'
```

---