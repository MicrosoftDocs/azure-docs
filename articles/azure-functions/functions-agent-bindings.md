---
title: Agent bindings for Python in Azure Functions
description: Add agentic behaviors to existing Python functions while keeping deterministic application logic in code.
ms.topic: concept-article
ms.date: 09/18/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a Python developer, I want to invoke agents from my existing functions so that I can combine deterministic application logic with agentic reasoning.
---

# Agent bindings for Python in Azure Functions

Agent bindings for Python function apps let you add agentic behaviors to existing functions. When the function runs, the extension constructs an `Agent` from Markdown instructions and injects it into your handler as a typed parameter. Your code decides when and how to invoke the agent alongside your deterministic application logic.

[!INCLUDE [functions-agent-bindings-preview](../../includes/functions-agent-bindings-preview.md)]

To compare agent bindings with other AI-related features, such as Azure Functions hosted skills and Model Context Protocol (MCP) tools, see [AI integration options for Azure Functions](functions-create-ai-enabled-apps.md).

An *agent binding* is an extension-owned input binding that provides a fully constructed `Agent` object to a Python function. The extension reads agent instructions as raw text from an `.agent.md` file. Your application code retains client and provider-specific tool configuration, while the function app project can discover file-based agent skills and remote MCP servers.

The agent binding architecture supports agent objects from different SDKs through provider-specific extension packages. Microsoft Agent Framework is the only agent SDK supported in the current preview. To use it, install the `azurefunctions-agents-extensions-agent-framework` package.

## When to use agent bindings

Use agent bindings when an Azure Function needs agentic reasoning for part of a workflow, but your application must retain control over its trigger, validation, branching, error handling, and response. Common scenarios include:

+ **Assess an HTTP request.** Validate an order with deterministic code, ask an agent to assess fulfillment risk, and use the result to construct the HTTP response.
+ **Enrich or classify events.** Receive a queue message, Event Grid event, or other trigger payload and use an agent to classify, summarize, or enrich the data before your function writes the result.
+ **Add reasoning to a durable workflow.** Call an agent from a Durable Functions orchestrator through the replay-safe `context.call_agent()` API, then use the result in later orchestration steps.

Agent bindings are a good fit when the function's deterministic code should remain the coordinator. The agent performs a bounded reasoning task and returns control to the handler or orchestration.

## Why use agent bindings?

Many production workflows combine steps that must be deterministic with steps that benefit from model reasoning. Agent bindings provide the following benefits for these hybrid workflows:

+ **Add agentic behavior to existing functions.** Use agent reasoning from HTTP-, timer-, queue-, Event Grid-, Service Bus-, and other triggered functions.
+ **Control agent invocation safely in code.** Decide when to invoke the agent, inspect its response, and determine the function output. The extension closes invocation-owned resources after success, failure, or cancellation.
+ **Reduce agent setup code.** Receive a configured `Agent` as a typed handler parameter instead of constructing and wiring it for each invocation.
+ **Separate instructions from runtime configuration.** Store natural-language instructions in an `.agent.md` file and configure clients and provider-specific tools explicitly in Python.
+ **Use shared agent capabilities.** The extension discovers file-based agent skills and HTTP-based MCP servers from the application root and makes them available to each agent binding.
+ **Call agents from durable orchestrations.** The extension runs agent work in a hidden activity so that orchestration replay remains deterministic.
+ **Debug locally with familiar tools.** Run and debug the app locally like any other Python function app. You can set breakpoints and step through both the deterministic function logic and the code that invokes the agent.

## How an agent binding works

`AgentFunctionApp` extends `azure.functions.FunctionApp`, so it has the same capabilities as `FunctionApp`. The `markdown_agent` decorator adds an agent input to a function.

For each agent binding, the extension performs the following operations:

1. Resolves the requested `.agent.md` file from the function app root or its `agents/` directory.
1. Loads the complete file as raw UTF-8 instructions.
1. Combines the instructions with the configured client factory, explicitly configured provider tools, and discovered agent skills and MCP servers.
1. Creates a fresh `Agent` and opens invocation-owned resources.
1. Injects the `Agent` into the handler parameter.
1. Closes invocation-owned resources when execution ends.

The extension can cache provider discovery and compiled binding definitions. It doesn't cache or reuse live invocation resources across function invocations.

## Define an agent binding

The following example uses the currently supported Microsoft Agent Framework provider to add an `Agent` to an HTTP-triggered function. The function constructs the task in code, invokes the agent, and returns the agent response:

```python
import azure.functions as func
from agent_framework import Agent
from azurefunctions.agents.extensions.agent_framework import AgentFunctionApp


app = AgentFunctionApp(client_factory=create_chat_client)


@app.function_name(name="ProcessOrder")
@app.route(route="orders/{orderId}", methods=["POST"])
@app.markdown_agent(
    arg_name="order_agent",
    agent_name="order-fulfillment",
)
async def process_order(
    req: func.HttpRequest,
    order_agent: Agent,
) -> func.HttpResponse:
    task = (
        "Validate the order and return fulfillment guidance for "
        f"{req.route_params['orderId']}."
    )
    response = await order_agent.run(task)
    return func.HttpResponse(response.text)
```

The `arg_name` value must match the injected handler parameter. To inject multiple agents into the same function, stack `markdown_agent` decorators and use a unique `arg_name` and handler parameter for each agent binding. The `agent_name` value identifies the instructions file. In this example, `order-fulfillment` must resolve to exactly one of these locations:

```text
<app_root>/order-fulfillment.agent.md
<app_root>/agents/order-fulfillment.agent.md
```

If both files exist, the definition is ambiguous and app startup fails. Agent names can't contain absolute paths, path separators, or traversal components. Files that resolve outside the application root aren't allowed.

## Configure the agent client and tools

Configure a zero-argument `client_factory` when you construct `AgentFunctionApp`. The factory returns a fresh client supported by the provider package. You can also pass Microsoft Agent Framework tool objects or Python callables through the `tools` parameter at the app level. A binding can override the app-level client factory and tools when it requires different behavior.

For example, the following HTTP-triggered function uses an agent binding that makes `lookup_inventory` available as a tool only to `order_agent`:

```python
def lookup_inventory(product_id: str) -> str:
    """Return the available inventory for a product."""
    return f"Inventory is available for {product_id}."


@app.markdown_agent(
    arg_name="order_agent",
    agent_name="order-fulfillment",
    tools=[lookup_inventory],
)
async def process_order(
    req: func.HttpRequest,
    order_agent: Agent,
) -> func.HttpResponse:
    response = await order_agent.run(req.get_body().decode())
    return func.HttpResponse(response.text)
```

Keep these considerations in mind when you configure the agent client and tools:

+ The base agent extension is provider-neutral. A provider package integrates a specific agent SDK and defines the supported client and agent types.
+ The currently supported Microsoft Agent Framework provider package doesn't select or configure a model provider for your application. Your client factory determines which supported Microsoft Agent Framework chat client and model the agent uses.
+ The extension passes the entire `.agent.md` file to the configured provider as agent instructions. It doesn't parse model settings, tools, YAML front matter, or other runtime configuration from the file.

## Shared agent skills and MCP servers

The extension automatically discovers shared agent capabilities from the application root:

| Capability | Location | Behavior |
| --- | --- | --- |
| Agent skills | `skills/<skill-name>/SKILL.md` or `Skills/<skill-name>/SKILL.md` | The provider package loads and validates the file-based agent skill. |
| Remote MCP servers | `mcp.json` | The extension configures supported HTTP or streamable HTTP servers and optional tool allowlists. |
| Provider tools | Application or binding configuration | Microsoft Agent Framework tool objects or Python callables are explicitly supplied instead of discovered. |

Keep these considerations in mind when you use shared agent capabilities:

+ Every agent binding in the function app receives all discovered agent skills and MCP servers.
+ File-based agent skills are capabilities that an agent can load. They aren't [Azure Functions hosted skills](functions-hosted-skills.md), which use a separate execution model.
+ The current preview of the agent extension doesn't support selecting a subset of capabilities for an app or individual binding.
+ Agent skills and MCP tools can perform privileged operations. Place only capabilities that every agent in the app is allowed to use, and use separate function apps when agents require different capability boundaries.

MCP configuration can reference environment variables for URLs, headers, authentication scopes, and client IDs. References are resolved for each invocation, before the extension connects to the server. Don't store secrets directly in a source-controlled `mcp.json` file.

Local-process and standard input/output (stdio) MCP servers aren't supported. MCP support is an optional dependency and normal package imports remain safe when it isn't installed.

## Use agent bindings with Durable Functions

Agent bindings support hybrid, long-running workflows through an optional Durable Functions integration. A synchronous generator orchestrator calls `context.call_agent()` and yields the resulting task:

```python
from typing import Any

from azurefunctions.agents.extensions.agent_framework import AgentFunctionApp


app = AgentFunctionApp(client_factory=create_chat_client)


@app.orchestration_trigger(context_name="context")
def order_orchestrator(context: Any):
    assessment = yield context.call_agent(
        "order-fulfillment",
        {"order": context.get_input()},
    )
    return assessment
```

`call_agent()` schedules a hidden activity that resolves the agent definition and performs all model, file system, credential, tool, and network operations. The orchestrator only creates a deterministic, JSON-serializable schema-v1 request. As a result, orchestration replay doesn't repeat nondeterministic agent operations.

Durable agent calls use the provider and shared capabilities configured by `AgentFunctionApp`. Inputs and outputs must be JSON serializable.

Durable Functions support is optional. Applications that don't use it don't need to install or import Durable Functions. To use `orchestration_trigger` and `context.call_agent()`, install the supported provider package with its Durable dependency extra.

## Project files

An agent-enabled application is a standard Python v2 function app with agent extension dependencies and one or more instruction files:

| File or folder | Purpose |
| --- | --- |
| `function_app.py` | Defines `AgentFunctionApp`, standard Functions triggers, agent bindings, client factories, and explicitly configured provider tools. |
| `host.json` | Configures the Azure Functions host. |
| `requirements.txt` | Includes a supported agent provider package and any SDK-specific client package. For the current preview, use `azurefunctions-agents-extensions-agent-framework`. Optional extras enable Durable Functions and MCP support. |
| `*.agent.md` or `agents/*.agent.md` | Contains raw UTF-8 instructions for an agent. Each referenced name must resolve to exactly one file. |
| `skills/` or `Skills/` | (Optional) Contains file-based agent skills shared by all agent bindings. |
| `mcp.json` | (Optional) Defines remote HTTP-based MCP servers shared by all agent bindings. |

For the standard Python project structure, see the [Azure Functions Python developer guide](functions-reference-python.md#folder-structure).

## Validation and diagnostics

The extension validates agent definitions before or during binding compilation so configuration problems fail with actionable errors. Validation covers:

+ Missing or ambiguous `.agent.md` files.
+ Invalid handler signatures, including a missing or mismatched injected parameter.
+ Unsupported provider options or capabilities.
+ Invalid skill directories and malformed MCP configuration.
+ Unsupported MCP transports and missing environment values.
+ Invalid Durable payloads or values that aren't JSON serializable.

Where available, the extension preserves the Azure Function name, invocation ID, and Durable instance ID at the provider boundary to support correlation and diagnostics.

## Related articles

+ [AI integration options for Azure Functions](functions-create-ai-enabled-apps.md)
+ [Use a Microsoft Agent Framework agent in a Python function](functions-agent-bindings-agent-framework.md)
+ [Use a Microsoft Agent Framework agent binding in a Durable orchestration](functions-agent-bindings-agent-framework-durable.md)
+ [Microsoft Agent Framework overview](/agent-framework/overview/agent-framework-overview)
