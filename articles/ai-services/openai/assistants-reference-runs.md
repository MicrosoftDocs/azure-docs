---
title: Azure OpenAI Service Assistants Python & REST API runs reference 
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API runs with Assistants.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/01/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Assistants API (Preview) runs reference

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
| `model` | string or null | Optional | The model deployment name to be used to execute this run. If a value is provided here, it will override the model deployment name associated with the assistant. If not, the model deployment name associated with the assistant will be used. |
| `instructions` | string or null | Optional | Overrides the instructions of the assistant. This is useful for modifying the behavior on a per-run basis. |
| `tools` | array or null | Optional | Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis. |
| `metadata` | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long. |

### Returns

A run object.

### Example create run request

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

## Create thread and run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/runs?api-version=2024-02-15-preview
```

Create a thread and run it in a single request.

**Request Body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `assistant_id` | string  | Required | The ID of the assistant to use to execute this run.|
| `thread` | object  | Optional | |
| `model` | string or null  | Optional | The ID of the Model deployment name to be used to execute this run. If a value is provided here, it will override the model deployment name associated with the assistant. If not, the model deployment name associated with the assistant will be used.|
| `instructions` | string or null  | Optional | Override the default system message of the assistant. This is useful for modifying the behavior on a per-run basis.|
| `tools` | array or null  | Optional | Override the tools the assistant can use for this run. This is useful for modifying the behavior on a per-run basis.|
| `metadata` | map  | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|

### Returns

A run object.

### Example create thread and run request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.create_and_run(
  assistant_id="asst_abc123",
  thread={
    "messages": [
      {"role": "user", "content": "Explain deep learning to a 5 year old."}
    ]
  }
)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/runs?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
      "assistant_id": "asst_abc123",
      "thread": {
        "messages": [
          {"role": "user", "content": "Explain deep learning to a 5 year old."}
        ]
      }
    }'
```

---

## List runs

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-02-15-preview
```

Returns a list of runs belonging to a thread.

**Path parameter**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that the run belongs to. |

**Query Parameters**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `limit` | integer | Optional - Defaults to 20 |A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.|
| `order` | string | Optional - Defaults to desc |Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.|
| `after` | string | Optional | A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.|
| `before` | string | Optional | A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.|

### Returns

A list of [run](#run-object) objects.

### Example list runs request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

runs = client.beta.threads.runs.list(
  "thread_abc123"
)
print(runs)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## List run steps

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps?api-version=2024-02-15-preview
```

Returns a list of steps belonging to a run.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that the run belongs to. |
|`run_id` | string | Required | The ID of the run associated with the run steps to be queried. |

**Query parameters**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `limit` | integer | Optional - Defaults to 20 |A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.|
| `order` | string | Optional - Defaults to desc |Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.|
| `after` | string | Optional | A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.|
| `before` | string | Optional | A cursor for use in pagination. before is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include before=obj_foo in order to fetch the previous page of the list.|

### Returns

A list of [run step](#run-step-object) objects.

### Example list run steps request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run_steps = client.beta.threads.runs.steps.list(
    thread_id="thread_abc123",
    run_id="run_abc123"
)
print(run_steps)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve run

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-02-15-preview
```

Retrieves a run.

**Path parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that was run. |
|`run_id` | string | Required | The ID of the run to retrieve. |

### Returns

The [run](#run-object) object matching the specified run ID.

### Example list run steps request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.runs.retrieve(
  thread_id="thread_abc123",
  run_id="run_abc123"
)
print(run)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve run step

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps/{step_id}?api-version=2024-02-15-preview
```

Retrieves a run step.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to which the run and run step belongs. |
|`run_id` | string | Required | The ID of the run to which the run step belongs. |
|`step_id`| string | Required | The ID of the run step to retrieve.|

### Returns

The [run step](#run-step-object) object matching the specified ID.

### Example retrieve run steps request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run_step = client.beta.threads.runs.steps.retrieve(
    thread_id="thread_abc123",
    run_id="run_abc123",
    step_id="step_abc123"
)
print(run_step)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps/{step_id}?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Modify run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-02-15-preview
```

Modifies a run.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread that was run. |
|`run_id` | string | Required | The ID of the run to modify. |

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `metadata` | map | Optional | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|

### Returns

The modified [run](#run-object) object matching the specified ID.

### Example modify run request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.runs.update(
  thread_id="thread_abc123",
  run_id="run_abc123",
  metadata={"user_id": "user_abc123"},
)
print(run)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' 
  -d '{
    "metadata": {
      "user_id": "user_abc123"
    }
  }'
```

---

## Submit tool outputs to run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/submit_tool_outputs?api-version=2024-02-15-preview
```

When a run has the status: "requires_action" and required_action.type is submit_tool_outputs, this endpoint can be used to submit the outputs from the tool calls once they're all completed. All outputs must be submitted in a single request.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to which this run belongs.|
|`run_id` | string | Required | The ID of the run that requires the tool output submission. |

**Request body**

|Name | Type | Required | Description |
|---  |---   |---       |--- |
| `tool_outputs | array | Required | A list of tools for which the outputs are being submitted. |

### Returns

The modified [run](#run-object) object matching the specified ID.

### Example submit tool outputs to run request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.runs.submit_tool_outputs(
  thread_id="thread_abc123",
  run_id="run_abc123",
  tool_outputs=[
    {
      "tool_call_id": "call_abc123",
      "output": "28C"
    }
  ]
)
print(run)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/submit_tool_outputs?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "tool_outputs": [
      {
        "tool_call_id": "call_abc123",
        "output": "28C"
      }
    ]
  }'

```

---

## Cancel a run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/cancel?api-version=2024-02-15-preview
```

Cancels a run that is in_progress.

**Path Parameters**

|Parameter| Type | Required | Description |
|---|---|---|---|
|`thread_id` | string | Required | The ID of the thread to which this run belongs.|
|`run_id` | string | Required | The ID of the run to cancel. |

### Returns

The modified [run](#run-object) object matching the specified ID.

### Example submit tool outputs to run request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

run = client.beta.threads.runs.cancel(
  thread_id="thread_abc123",
  run_id="run_abc123"
)
print(run)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/cancel?api-version=2024-02-15-preview \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -H 'Content-Type: application/json' \
  -X POST
```

---

## Run object

Represents an execution run on a thread.

|Name | Type | Description |
|---  |---   |---         |
| `id`| string | The identifier, which can be referenced in API endpoints.|
| `object` | string | The object type, which is always thread.run.|
| `created_at` | integer | The Unix timestamp (in seconds) for when the run was created.|
| `thread_id` | string | The ID of the thread that was executed on as a part of this run.|
| `assistant_id` | string | The ID of the assistant used for execution of this run.|
| `status` | string | The status of the run, which can be either `queued`, `in_progress`, `requires_action`, `cancelling`, `cancelled`, `failed`, `completed`, or `expired`.|
| `required_action` | object or null | Details on the action required to continue the run. Will be null if no action is required.|
| `last_error` | object or null | The last error associated with this run. Will be null if there are no errors.|
| `expires_at` | integer | The Unix timestamp (in seconds) for when the run will expire.|
| `started_at` | integer or null | The Unix timestamp (in seconds) for when the run was started.|
| `cancelled_at` | integer or null | The Unix timestamp (in seconds) for when the run was canceled.|
| `failed_at` | integer or null | The Unix timestamp (in seconds) for when the run failed.|
| `completed_at` | integer or null | The Unix timestamp (in seconds) for when the run was completed.|
| `model` | string | The model deployment name that the assistant used for this run.|
| `instructions` | string | The instructions that the assistant used for this run.|
| `tools` | array | The list of tools that the assistant used for this run.|
| `file_ids` | array | The list of File IDs the assistant used for this run.|
| `metadata` | map | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|


## Run step object

Represent a step in execution of a run.

|Name | Type | Description |
|---  |---   |---         |
| `id`| string | The identifier of the run step, which can be referenced in API endpoints.|
| `object`| string | The object type, which is always thread.run.step.|
| `created_at`| integer | The Unix timestamp (in seconds) for when the run step was created.|
| `assistant_id`| string | The ID of the assistant associated with the run step.|
| `thread_id`| string | The ID of the thread that was run.|
| `run_id`| string | The ID of the run that this run step is a part of.|
| `type`| string | The type of run step, which can be either message_creation or tool_calls.|
| `status`| string | The status of the run step, which can be either `in_progress`, `cancelled`, `failed`, `completed`, or `expired`.|
| `step_details`| object | The details of the run step.|
| `last_error`| object or null | The last error associated with this run step. Will be null if there are no errors.|
| `expired_at`| integer or null | The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if the parent run is expired.|
| `cancelled_at`| integer or null | The Unix timestamp (in seconds) for when the run step was cancelled.|
| `failed_at`| integer or null | The Unix timestamp (in seconds) for when the run step failed.|
| `completed_at`| integer or null | The Unix timestamp (in seconds) for when the run step completed.|
| `metadata`| map | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|
