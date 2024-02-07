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


```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages?api-version=2024-02-15-preview
```

Returns a list of messages for a given thread.

**Path Parameters**


|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that messages belong to. |

**Query Parameters**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `limit` | integer | Optional - Defaults to 20 |A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.|
| `order` | string | Optional - Defaults to desc |Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.|
| `after` | string | Optional | A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.|
| `before` | string | Optional | A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.|

### Returns

A list of message objects.

### Example list messages request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

thread_messages = client.beta.threads.messages.list("thread_abc123")
print(thread_messages.data)

```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## List message files

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages/{message_id}/files?api-version=2024-02-15-preview
```

Returns a list of message files.

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that the message and files belong to. |
|`message_id`| string | Required | The ID of the message that the files belongs to. |

**Query Parameters**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `limit` | integer | Optional - Defaults to 20 |A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.|
| `order` | string | Optional - Defaults to desc |Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.|
| `after` | string | Optional | A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.|
| `before` | string | Optional | A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.|

### Returns

A list of message file objects

### Example list message files request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

message_files = client.beta.threads.messages.files.list(
  thread_id="thread_abc123",
  message_id="msg_abc123"
)
print(message_files)

```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages/files?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve message

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages/{message_id}?api-version=2024-02-15-preview
```

Retrieves a message file.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that the message belongs to. |
|`message_id`| string | Required | The ID of the message to retrieve. |


### Returns

The message file object.

### Example retrieve message request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

message = client.beta.threads.messages.retrieve(
  message_id="msg_abc123",
  thread_id="thread_abc123",
)
print(message)

```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/messages/{message_id}?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve message file