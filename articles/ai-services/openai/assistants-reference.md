---
title: Azure OpenAI Service Assistants Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API with Assistants.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 07/25/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Assistants API (Preview) reference


[!INCLUDE [Assistants v2 note](includes/assistants-v2-note.md)]

This article provides reference documentation for Python and REST for the new Assistants API (Preview). More in-depth step-by-step guidance is provided in the [getting started guide](./how-to/assistant.md).

## Create an assistant

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview
```

Create an assistant with a model and instructions.

### Request body

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| model| string | Required | Model deployment name of the model to use.|
| name | string or null | Optional | The name of the assistant. The maximum length is 256 characters.|
| description| string or null | Optional | The description of the assistant. The maximum length is 512 characters.|
| instructions | string or null | Optional | The system instructions that the assistant uses. The maximum length is 256,000 characters.|
| tools | array | Optional | Defaults to []. A list of tools enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can currently be of types `code_interpreter`, or `function`. A `function` description can be a maximum of 1,024 characters. |
| file_ids | array | Optional | Defaults to []. A list of file IDs attached to this assistant. There can be a maximum of 20 files attached to the assistant. Files are ordered by their creation date in ascending order.|
| metadata | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|
| temperature | number or null | Optional | Defaults to 1. Determines what sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. |
| top_p | number or null | Optional | Defaults to 1. An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both. |
| response_format | string or object | Optional | Specifies the format that the model must output. Compatible with GPT-4 Turbo and all GPT-3.5 Turbo models since gpt-3.5-turbo-1106. Setting this parameter to `{ "type": "json_object" }` enables JSON mode, which guarantees the message the model generates is valid JSON. Importantly, when using JSON mode, you must also instruct the model to produce JSON yourself using a system or user message. Without this instruction, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Additionally, the message content may be partially cut off if you use `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length. |

### Returns

An [assistant](#assistant-object) object.

### Example create assistant request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

assistant = client.beta.assistants.create(
  instructions="You are an AI assistant that can write code to help answer math questions",
  model="<REPLACE WITH MODEL DEPLOYMENT NAME>", # replace with model deployment name. 
  tools=[{"type": "code_interpreter"}]
)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "instructions": "You are an AI assistant that can write code to help answer math questions.",
    "tools": [
      { "type": "code_interpreter" }
    ],
    "model": "gpt-4-1106-preview"
  }'
```

---

## List assistants

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview
```

Returns a list of all assistants.

**Query parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
| `limit` | integer | Optional | A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.|
| `order` | string | Optional - Defaults to desc | Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.|
| `after` | string | Optional | A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list. |
|`before`| string | Optional | A cursor for use in pagination. `before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list. |

### Returns

A list of [assistant](#assistant-object) objects

### Example list assistants

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

my_assistants = client.beta.assistants.list(
    order="desc",
    limit="20",
)
print(my_assistants.data)

```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview  \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---


## Retrieve assistant

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant_id}?api-version=2024-05-01-preview
```

Retrieves an assistant.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|--|
| `assistant_id` | string | Required | The ID of the assistant to retrieve. |

**Returns**

The [assistant](#assistant-object) object matching the specified ID.

### Example retrieve assistant

# [Python 1.x](#tab/python)

```python
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

my_assistant = client.beta.assistants.retrieve("asst_abc123")
print(my_assistant)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant-id}?api-version=2024-05-01-preview  \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Modify assistant

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant_id}?api-version=2024-05-01-preview
```

Modifies an assistant.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
| assistant_id | string | Required | The ID of the assistant the file belongs to. |

**Request Body**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | | Optional | The model deployment name of the model to use. |
| `name` | string or null | Optional | The name of the assistant. The maximum length is 256 characters. |
| `description` | string or null | Optional | The description of the assistant. The maximum length is 512 characters. |
| `instructions` | string or null | Optional | The system instructions that the assistant uses. The maximum length is 32768 characters. |
| `tools` | array | Optional | Defaults to []. A list of tools enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types code_interpreter, or function. A `function` description can be a maximum of 1,024 characters. |
| `file_ids` | array | Optional | Defaults to []. A list of File IDs attached to this assistant. There can be a maximum of 20 files attached to the assistant. Files are ordered by their creation date in ascending order. If a file was previously attached to the list but does not show up in the list, it will be deleted from the assistant. |
| `metadata` | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long. |

**Returns**

The modified [assistant object](#assistant-object).

### Example modify assistant

# [Python 1.x](#tab/python)

```python
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

my_updated_assistant = client.beta.assistants.update(
  "asst_abc123",
  instructions="You are an HR bot, and you have access to files to answer employee questions about company policies. Always respond with info from either of the files.",
  name="HR Helper",
  tools=[{"type": "code-interpreter"}],
  model="gpt-4", #model = model deployment name
  file_ids=["assistant-abc123", "assistant-abc456"],
)

print(my_updated_assistant)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant-id}?api-version=2024-05-01-preview  \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
      "instructions": "You are an HR bot, and you have access to files to answer employee questions about company policies. Always response with info from either of the files.",
      "tools": [{"type": "code-interpreter"}],
      "model": "gpt-4",
      "file_ids": ["assistant-abc123", "assistant-abc456"]
    }'
```

---

## Delete assistant

```http
DELETE https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant_id}?api-version=2024-05-01-preview
```

Delete an assistant.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
| `assistant_id` | string | Required | The ID of the assistant the file belongs to. |

**Returns**

Deletion status.

### Example delete assistant

# [Python 1.x](#tab/python)

```python
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

response = client.beta.assistants.delete("asst_abc123")
print(response)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants/{assistant-id}?api-version=2024-05-01-preview  \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X DELETE
```

---

## File upload API reference

Assistants use the [same API for file upload as fine-tuning](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-05-01-preview&tabs=HTTP&preserve-view=true). When uploading a file you have to specify an appropriate value for the [purpose parameter](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-05-01-preview&tabs=HTTP#purpose&preserve-view=true).


## Assistant object

| Field  | Type  | Description   |
|---|---|---|
| `id` | string | The identifier, which can be referenced in API endpoints.|
| `object` | string | The object type, which is always assistant.|
| `created_at` | integer | The Unix timestamp (in seconds) for when the assistant was created.|
| `name` | string or null | The name of the assistant. The maximum length is 256 characters.|
| `description` | string or null | The description of the assistant. The maximum length is 512 characters.|
| `model` | string | Name of the model deployment name to use.|
| `instructions` | string or null | The system instructions that the assistant uses. The maximum length is 32768 characters.|
| `tools` | array | A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant. Tools can be of types code_interpreter, or function. A `function` description can be a maximum of 1,024 characters.|
| `file_ids` | array | A list of file IDs attached to this assistant. There can be a maximum of 20 files attached to the assistant. Files are ordered by their creation date in ascending order.|
| `metadata` | map | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|
