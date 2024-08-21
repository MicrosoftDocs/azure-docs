---
title: Azure OpenAI Service Assistants Python & REST API runs reference 
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's Python & REST API runs with Assistants.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 04/16/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Assistants API (Preview) runs reference

[!INCLUDE [Assistants v2 note](includes/assistants-v2-note.md)]

This article provides reference documentation for Python and REST for the new Assistants API (Preview). More in-depth step-by-step guidance is provided in the [getting started guide](./how-to/assistant.md).

## Create run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "assistant_id": "asst_abc123"
  }'
```

---

## Create thread and run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/runs?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/runs?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
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
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

runs = client.beta.threads.runs.list(
  "thread_abc123"
)
print(runs)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## List run steps

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve run

# [Python 1.x](#tab/python)

```python
from openai import OpenAI
client = OpenAI()

run = client.beta.threads.runs.retrieve(
  thread_id="thread_abc123",
  run_id="run_abc123"
)

print(run)
```

# [REST](#tab/rest)

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-05-01-preview
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Retrieve run step

```http
GET https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps/{step_id}?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/steps/{step_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' 
```

---

## Modify run

```http
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
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
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/submit_tool_outputs?api-version=2024-05-01-preview
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
| `tool_outputs` | array | Required | A list of tools for which the outputs are being submitted. |

### Returns

The modified [run](#run-object) object matching the specified ID.

### Example submit tool outputs to run request

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/submit_tool_outputs?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
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
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/cancel?api-version=2024-05-01-preview
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
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
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
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/{thread_id}/runs/{run_id}/cancel?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
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
| `tool_choice` | string or object | Controls which (if any) tool is called by the model. `none` means the model won't call any tools and instead generates a message. `auto` is the default value and means the model can pick between generating a message or calling a tool. Specifying a particular tool like `{"type": "file_search"}` or `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool. |
| `max_prompt_tokens` | integer or null | The maximum number of prompt tokens specified to have been used over the course of the run. |
| `max_completion_tokens` | integer or null | The maximum number of completion tokens specified to have been used over the course of the run. |
| `usage` | object or null | Usage statistics related to the run. This value will be null if the run is not in a terminal state (for example `in_progress`, `queued`). |


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
| `cancelled_at`| integer or null | The Unix timestamp (in seconds) for when the run step was canceled.|
| `failed_at`| integer or null | The Unix timestamp (in seconds) for when the run step failed.|
| `completed_at`| integer or null | The Unix timestamp (in seconds) for when the run step completed.|
| `metadata`| map | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys can be a maximum of 64 characters long and values can be a maximum of 512 characters long.|

## Stream a run result (preview)

Stream the result of executing a Run or resuming a Run after submitting tool outputs. You can stream events after:
* [Create Thread and Run](#create-thread-and-run) 
* [Create Run](#create-run)
* [Submit Tool Outputs](#submit-tool-outputs-to-run) 

To stream a result, pass `"stream": true` while creating a run. The response will be a [Server-Sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events) stream.

### Streaming example

```python
from typing_extensions import override
from openai import AssistantEventHandler
 
# First, we create a EventHandler class to define
# how we want to handle the events in the response stream.
 
class EventHandler(AssistantEventHandler):    
  @override
  def on_text_created(self, text) -> None:
    print(f"\nassistant > ", end="", flush=True)
      
  @override
  def on_text_delta(self, delta, snapshot):
    print(delta.value, end="", flush=True)
      
  def on_tool_call_created(self, tool_call):
    print(f"\nassistant > {tool_call.type}\n", flush=True)
  
  def on_tool_call_delta(self, delta, snapshot):
    if delta.type == 'code_interpreter':
      if delta.code_interpreter.input:
        print(delta.code_interpreter.input, end="", flush=True)
      if delta.code_interpreter.outputs:
        print(f"\n\noutput >", flush=True)
        for output in delta.code_interpreter.outputs:
          if output.type == "logs":
            print(f"\n{output.logs}", flush=True)
 
# Then, we use the `create_and_stream` SDK helper 
# with the `EventHandler` class to create the Run 
# and stream the response.
 
with client.beta.threads.runs.stream(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="Please address the user as Jane Doe. The user has a premium account.",
  event_handler=EventHandler(),
) as stream:
  stream.until_done()
```


## Message delta object

Represents a message delta. For example any changed fields on a message during streaming.

|Name | Type | Description |
|---  |---   |---         |
| `id` | string | The identifier of the message, which can be referenced in API endpoints. |
| `object` | string | The object type, which is always `thread.message.delta`. |
| `delta` | object | The delta containing the fields that have changed on the Message. |

## Run step delta object

Represents a run step delta. For example any changed fields on a run step during streaming.

|Name | Type | Description |
|---  |---   |---         |
| `id` | string | The identifier of the run step, which can be referenced in API endpoints. |
| `object` | string | The object type, which is always `thread.run.step.delta`. |
| `delta` | object | The delta containing the fields that have changed on the run step.

## Assistant stream events

Represents an event emitted when streaming a Run. Each event in a server-sent events stream has an event and data property:

```json
event: thread.created
data: {"id": "thread_123", "object": "thread", ...}
```

Events are emitted whenever a new object is created, transitions to a new state, or is being streamed in parts (deltas). For example, `thread.run.created` is emitted when a new run is created, `thread.run.completed` when a run completes, and so on. When an Assistant chooses to create a message during a run, we emit a `thread.message.created` event, a `thread.message.in_progress` event, many thread.`message.delta` events, and finally a `thread.message.completed` event.

|Name | Type | Description |
|---  |---   |---         |
| `thread.created` | `data` is a thread. | Occurs when a new thread is created. |
| `thread.run.created` | `data` is a run. | Occurs when a new run is created. |
| `thread.run.queued` | `data` is a run. | Occurs when a run moves to a queued status. |
| `thread.run.in_progress` | `data` is a run. | Occurs when a run moves to an in_progress status. |
| `thread.run.requires_action` | `data` is a run. | Occurs when a run moves to a `requires_action` status. |
| `thread.run.completed` | `data` is a run. | Occurs when a run is completed. |
| `thread.run.failed` | `data` is a run. | Occurs when a run fails. |
| `thread.run.cancelling` | `data` is a run. | Occurs when a run moves to a `cancelling` status. |
| `thread.run.cancelled` | `data` is a run. | Occurs when a run is canceled. |
| `thread.run.expired` | `data` is a run. | Occurs when a run expires. |
| `thread.run.step.created` | `data` is a run step. | Occurs when a run step is created. |
| `thread.run.step.in_progress` | `data` is a run step. | Occurs when a run step moves to an `in_progress` state. | 
| `thread.run.step.delta` | `data` is a run step delta. | Occurs when parts of a run step are being streamed. |
| `thread.run.step.completed` | `data` is a run step. | Occurs when a run step is completed. |
| `thread.run.step.failed` | `data` is a run step. | Occurs when a run step fails. |
| `thread.run.step.cancelled` | `data` is a run step. | Occurs when a run step is canceled. |
| `thread.run.step.expired` | `data` is a run step. | Occurs when a run step expires. |
| `thread.message.created` | `data` is a message. | Occurs when a message is created. |
| `thread.message.in_progress` | `data` is a message. | Occurs when a message moves to an in_progress state. | 
| `thread.message.delta` | `data` is a message delta. | Occurs when parts of a Message are being streamed. |
| `thread.message.completed` | `data` is a message. | Occurs when a message is completed. |
| `thread.message.incomplete` | `data` is a message. | Occurs when a message ends before it is completed. |
| `error` | `data` is an error. | Occurs when an error occurs. This can happen due to an internal server error or a timeout. |
| `done` | `data` is `[DONE]` | Occurs when a stream ends. |