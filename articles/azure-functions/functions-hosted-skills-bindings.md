---
title: Hosted Skill bindings for Python in Azure Functions
description: Invoke Markdown-defined hosted skills from Python functions while keeping control of triggers, validation, application logic, and responses in code.
ms.topic: concept-article
ms.date: 10/27/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a Python developer, I want to invoke hosted skills from my functions so that I can combine deterministic application logic with Markdown-defined AI reasoning.
---

# Hosted Skill bindings for Python in Azure Functions

By using Hosted Skill bindings, you can invoke [Azure Functions hosted skills](functions-hosted-skills.md) from your own Python functions. The runtime injects a `HostedSkill` object into your handler, and your code decides when to call it. You keep control of the function's trigger, input validation, branching, error handling, and response, while the hosted skill's instructions and capabilities remain in Markdown and configuration files.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

Hosted Skill bindings are available in version **0.1.0b17** and later of the `azurefunctions-agents-runtime` package.

## When to use Hosted Skill bindings

Use a Hosted Skill binding when deterministic application code should coordinate a workflow, but part of the work benefits from AI reasoning. Common scenarios include:

+ **Validate before invoking a model.** Check an HTTP request, apply business rules, and invoke a hosted skill only when reasoning is needed.
+ **Enrich an event.** Receive a queue message or other trigger payload, ask a hosted skill to summarize or classify it, and write the result from code.
+ **Customize a response.** Combine a hosted skill's result with application data and return an application-specific HTTP response.
+ **Reuse a configured hosted skill.** Invoke the same Markdown-defined behavior from your own handler without calling its HTTP endpoint.


## How a Hosted Skill binding works

`HostedSkillFunctionApp()` creates an enhanced Azure Functions app with a `hosted_skill` decorator. The binding uses the Hosted Skills programming model, so you define instructions in the hosted skill's `.agent.md` file and configure properties such as `model`, `timeout`, and tools in its YAML front matter. The binding uses that configuration when your function invokes the hosted skill.

The runtime handles setup and execution so your function can focus on application logic:

1. Loads the hosted skill you select with `agent_name` and checks its configuration, helping you catch configuration errors before processing requests.
1. Manages the hosted skill object's lifecycle and provides it to your function, so you don't need to construct the object or wire up model clients and tools yourself.
1. Starts AI work only when your code calls `skill.run()` or `skill.stream()`, so you control when reasoning is needed.
1. Applies the hosted skill's configured instructions, model, and tools, and manages conversation history so you can continue a conversation by passing its session ID.

Injecting a `HostedSkill` doesn't itself invoke a model. Your handler can complete without calling the hosted skill.

## Prerequisites

+ A Python v2 function app using Python 3.13 or later.
+ The `azurefunctions-agents-runtime` package, version 0.1.0b17 or later.
+ At least one hosted skill definition in the app root or its `agents/` directory.
+ Provider credentials, model access, and storage settings configured for the hosted skills runtime.

For local setup and a runnable project, see the [hybrid Hosted Skill sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/hybrid-hosted-skill).

## Define a Hosted Skill binding

The following steps build an HTTP-triggered function that summarizes text. Your Python code handles the request and response, while a Markdown file defines the hosted skill's behavior.

### Create the function app

In your Python function app project, create a `HostedSkillFunctionApp` object in `function_app.py`:

```python
from azurefunctions.extensions.http.fastapi import Request, Response

from azure_functions_agents import (
    HostedSkill,
    HostedSkillFunctionApp,
)

app = HostedSkillFunctionApp()
```

Use this project structure for the walkthrough:

```text
<app_root>/
├── function_app.py
├── host.json
├── local.settings.json
├── requirements.txt
└── agents/
    └── summarizer.agent.md
```

Include `azurefunctions-agents-runtime` version 0.1.0b17 or later in `requirements.txt`, and configure your provider and storage settings as described in the prerequisites. Keep local credentials in `local.settings.json` out of source control.

### Add the binding decorator

Add an HTTP route and a `hosted_skill` decorator to your handler. The `arg_name` value identifies the parameter that receives the hosted skill, and `agent_name` selects the hosted skill to use:

```python
@app.route(route="summarize", methods=["POST"])
@app.hosted_skill(arg_name="skill", agent_name="summarizer")
async def summarize(req: Request, skill: HostedSkill) -> Response:
```

This handler doesn't invoke the hosted skill yet. You add that call after creating its Markdown definition in the next section.

### Decorator requirements

| Parameter | Description |
| --- | --- |
| `arg_name` | Required. Names the handler parameter that receives the `HostedSkill`. |
| `agent_name` | Required. Selects a discovered hosted skill by its filename-derived identity slug. |

Keep these requirements in mind:

+ Place `@app.hosted_skill` immediately above the handler, below all Azure Functions trigger and binding decorators.
+ Use a plain `async def` handler, not a synchronous function or generator.
+ If you're using type annotations, annotate the injected parameter exactly as `HostedSkill`.

## Configure the hosted skill

Create `agents/summarizer.agent.md` to define the hosted skill selected by the decorator:

```markdown
---
name: Summarizer
description: Produces concise summaries for application-owned routes
model: gpt-6.1-terra
timeout: 60
---

Summarize the supplied text in one precise sentence. Preserve important names,
numbers, and qualifications. Do not add facts that are not present in the text.
```

The `agent_name="summarizer"` value selects the filename-derived identity, not the `name` display field. The front matter selects the `gpt-6.1-terra` model and sets a 60-second execution timeout. Set `model` to a model available through your configured provider. You can also place the Hosted Skill definition in the app root instead of the `agents/` directory.

The binding reuses the hosted skill's resolved configuration, including:

+ Markdown instructions, model, timeout, and provider settings.
+ Custom Python tools, reusable skills, and remote MCP servers selected for the hosted skill.
+ Sandbox and web request capabilities, when enabled.

For configuration fields and examples, see the [Hosted Skills reference](functions-hosted-skills-reference.md).

## Invoke a turn and manage sessions

Call `await skill.run(prompt, session_id=...)` to execute one turn and receive an `AgentResult`. The result includes `content`, `session_id`, `model`, and tool-call evidence in `tool_calls`.

Update `function_app.py` with the following code to validate the request, invoke the hosted skill, and return its result:

```python
body = await req.json()
session_id = body.get("session_id")
result = await skill.run(prompt, session_id=session_id)
return JSONResponse(
    {"session_id": result.session_id, "summary": result.content},
)
```

Start the local Functions host and send a JSON body to `http://localhost:7071/api/summarize`:

```json
{
  "prompt": "Azure Functions runs event-driven code without managing servers."
}
```

The response contains the summary in `summary` and the conversation ID in `session_id`. Your handler controls this response shape.

+ **Omit `session_id`** to start a new conversation and receive its generated ID in the result.
+ **Supply a valid `session_id`** to continue persisted history. If no persisted state exists, the runtime starts a conversation under that ID.

For example, send a later request to the sample handler with the ID returned by the first request:

```json
{
  "prompt": "Make it even shorter.",
  "session_id": "<session-id-from-the-first-response>"
}
```

Blank or nonstring prompts and invalid session IDs raise `ValueError` before execution. Storage and session errors propagate rather than silently resetting the conversation.

> [!IMPORTANT]
> A session ID is a conversation-continuity key, not proof of ownership. Your application must authenticate callers and authorize session continuation when conversations belong to individual users or tenants. Format validation alone doesn't provide that isolation.

## Stream a turn

Use `skill.stream(prompt, session_id=...)` to consume typed `HostedSkillEvent` values with `async for`. Events describe session creation, response content, tool execution, completion, and errors. They aren't HTTP Server-Sent Events (SSE) text.

To send events to an HTTP caller as they arrive, add this helper to `function_app.py`. It serializes each event as a separate JSON line:

```python
import json
from collections.abc import AsyncIterator
from contextlib import aclosing

from azurefunctions.extensions.http.fastapi import StreamingResponse

from azure_functions_agents import HostedSkill


def stream_summary(
  skill: HostedSkill,
  prompt: str,
  session_id: str | None = None,
) -> StreamingResponse:
  async def response_events() -> AsyncIterator[str]:
    async with aclosing(skill.stream(prompt, session_id=session_id)) as events:
      async for event in events:
        yield json.dumps(event.to_dict()) + "\n"

  return StreamingResponse(
    response_events(),
    media_type="application/x-ndjson",
  )
```

In the `summarize` handler, keep the request validation, but replace the `skill.run()` call and final response with `return stream_summary(skill, prompt, session_id)`. Update the handler's return annotation to `JSONResponse | StreamingResponse`, because validation failures still return a JSON response.

The caller now receives a stream of JSON events instead of a single summary response. Capture the session ID from the session event to continue the conversation. Handle error and truncated-stream events instead of treating partial content as a successful completed response. The `aclosing` context manager closes the event generator if the response stops early.

## Validate structured responses

When a hosted skill defines `response_schema` or `response_example`, the runtime adds formatting instructions and validates the completed output. For `run()`, an invalid response raises `HostedSkillResponseError`. For `stream()`, response validation failure produces an error event instead of a successful completion event.

Validation occurs after the model turn completes. Invalid assistant content might already be persisted in conversation history, and streamed content might already have reached the caller. Retrying with the same session ID continues that history; it doesn't roll back the failed turn.

## Use with Durable Functions

`HostedSkillDFApp` provides the same binding for ordinary functions and Durable Activity handlers in a Durable Functions app. Invoke the hosted skill in an asynchronous activity, not inside a replayed orchestrator.

## Validation and limitations

The runtime validates the selected hosted skill and handler when the decorator is applied. An unknown identity, invalid handler signature, or invalid provider configuration can prevent the function module from indexing, including unrelated deterministic functions in that module.

## Related articles

+ [Azure Functions hosted skills overview](functions-hosted-skills.md)
+ [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)
+ [Agent bindings for Python in Azure Functions](functions-agent-bindings.md)
+ [Hybrid Hosted Skill sample](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/hybrid-hosted-skill)