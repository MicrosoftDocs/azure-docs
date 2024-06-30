---
title: Azure OpenAI Service Assistants Python & REST API threads reference 
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API threads with Assistants.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 05/20/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Assistants API (Preview) threads reference

[!INCLUDE [Assistants v2 note](includes/assistants-v2-note.md)]

This article provides reference documentation for Python and REST for the new Assistants API (Preview). More in-depth step-by-step guidance is provided in the [getting started guide](./how-to/assistant.md).

## Create a thread

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads?api-version=2024-05-01-preview
```

Create a thread.

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
|`messages`|array| Optional | A list of messages to start the thread with. |
|`metadata`| map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long. |

### Returns

A [thread object](#thread-object).

### Example: create thread request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

empty_thread = client.beta.threads.create()
print(empty_thread)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d ''
```

---

## Retrieve thread

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview
```

Retrieves a thread.

**Path parameters**


|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to retrieve |

### Returns

The thread object matching the specified ID.

### Example: retrieve thread request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

my_thread = client.beta.threads.retrieve("thread_abc123")
print(my_thread)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Modify thread

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview
```

Modifies a thread.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to modify. |

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| metadata| map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|

### Returns

The modified [thread object](#thread-object) matching the specified ID.

### Example: modify thread request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

my_updated_thread = client.beta.threads.update(
  "thread_abc123",
  metadata={
    "modified": "true",
    "user": "abc123"
  }
)
print(my_updated_thread)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }' 
```

---

## Delete thread

```http
DELETE https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview
```

Delete a thread.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to delete. |

### Returns

Deletion status.

### Example: delete thread request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

response = client.beta.threads.delete("thread_abc123")
print(response)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X DELETE
```

---
## Thread object

| Field  | Type  | Description   |
|---|---|---|
| `id` | string | The identifier, which can be referenced in API endpoints.|
| `object` | string | The object type, which is always thread. |
| `created_at` | integer | The Unix timestamp (in seconds) for when the thread was created. |
| `metadata` | map | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long. |
