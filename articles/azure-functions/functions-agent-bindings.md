---
title: Agent bindings for Python in Azure Functions
description: Add agentic behaviors to existing Python functions while keeping deterministic application logic in code.
ms.topic: concept-article
ms.date: 11/06/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a Python developer, I want to invoke agents from my existing functions so that I can combine deterministic application logic with agentic reasoning.
---

# Agent bindings for Python in Azure Functions

Agent bindings for Python function apps let you add agentic behaviors to existing functions. When the function runs, the extension constructs an SDK-specific agent or session from Markdown instructions and injects it into your handler as a typed parameter. Your code decides when and how to invoke the agent alongside your deterministic application logic.

[!INCLUDE [functions-agent-bindings-preview](../../includes/functions-agent-bindings-preview.md)]

To compare agent bindings with other AI-related features, such as Azure Functions hosted skills and Model Context Protocol (MCP) tools, see [AI integration options for Azure Functions](functions-create-ai-enabled-apps.md).

## What is an agent binding?

An *agent binding* is an input binding that provides a configured agent or session as a typed parameter to a Python function. The extension combines Markdown instructions with the app's provider configuration and tools, so your handler doesn't need to construct and wire the agent for each invocation.

The binding doesn't replace your function or its trigger. Your code still validates inputs, decides when to invoke the agent, handles errors, and produces the output. Instructions live in an `.agent.md` file, while client, model, and tool configuration remain in application code and settings. Provider packages connect this shared binding model to different agent SDKs.

## When to use agent bindings

Use agent bindings when an Azure Function needs agentic reasoning for part of a workflow, but your application must retain control over its trigger, validation, branching, error handling, and response. Common scenarios include:

+ **Assess an HTTP request.** Validate an order with deterministic code, ask an agent to assess fulfillment risk, and use the result to construct the HTTP response.
+ **Enrich or classify events.** Receive a queue message, Event Grid event, or other trigger payload and use an agent to classify, summarize, or enrich the data before your function writes the result.
+ **Add reasoning to a durable workflow.** Call an agent from a Durable Functions orchestrator through the replay-safe `context.call_agent()` API, then use the result in later orchestration steps.

The function remains the coordinator: it prepares the task, invokes the agent, and decides what to do with the result. Bindings reduce setup code, separate Markdown instructions from runtime configuration, and work with familiar Azure Functions triggers and local debugging tools.

If you prefer to define behavior and triggers primarily through Markdown and declarative configuration instead of a Python handler, consider [Azure Functions hosted skills](functions-hosted-skills.md).

## Available packages

Provider-specific extension packages connect the shared binding model to an agent SDK. The following packages are available in preview and require Python 3.13 or later:

| SDK | Package | Get started |
| --- | --- | --- |
| Microsoft Agent Framework | [azurefunctions-agents-extensions-agent-framework](https://pypi.org/project/azurefunctions-agents-extensions-agent-framework/) | [Python function quickstart](functions-agent-bindings-agent-framework.md) · [Durable orchestration quickstart](functions-agent-bindings-agent-framework-durable.md) |
| GitHub Copilot SDK | [azurefunctions-agents-extensions-copilot-sdk](https://pypi.org/project/azurefunctions-agents-extensions-copilot-sdk/) | [Python function quickstart](functions-agent-bindings-copilot-sdk.md) · [HTTP and queue sample](https://github.com/Azure/azure-functions-python-extensions/tree/dev/azurefunctions-agents-extensions-copilot-sdk/samples/agent_samples_copilot-sdk) · [Durable orchestration sample](https://github.com/Azure/azure-functions-python-extensions/tree/dev/azurefunctions-agents-extensions-copilot-sdk/samples/agent_samples_copilot-sdk_durable) |

Each package defines its supported types, authentication, model configuration, and invocation API. Follow its quickstart or sample for SDK-specific setup and deployment requirements.

## How an agent binding works

`AgentFunctionApp` extends `azure.functions.FunctionApp`, so it has the same capabilities as `FunctionApp`. The `markdown_agent` decorator adds an agent input to a function.

For each agent binding, the extension performs the following operations:

1. Resolves the requested `.agent.md` file from the function app root or its `agents/` directory.
1. Loads the complete file as raw UTF-8 instructions.
1. Combines the instructions with provider configuration, explicit tools, and discovered agent skills and MCP servers.
1. Creates a fresh SDK-specific agent or session and opens invocation-owned resources.
1. Injects the agent or session into the handler parameter.
1. Closes invocation-owned resources when execution ends.

The provider manages its client lifecycle. Invocation-owned resources are closed after success, failure, or cancellation.

## Define an agent binding

To add a binding to a Python v2 function app:

1. Install a provider package and import its `AgentFunctionApp`.
1. Configure the client, model, authentication, and tools as required by that package.
1. Add an `.agent.md` instructions file in the app root or `agents/` directory. The file is raw UTF-8 text; the system doesn't parse YAML front matter or runtime configuration.
1. Add `markdown_agent` to a triggered function. Set `arg_name` to match the typed handler parameter and `agent_name` to identify the instructions file.
1. Invoke the injected object through its SDK API and handle the result in your function code.

For example, `agent_name="order-fulfillment"` can identify `order-fulfillment.agent.md` in either supported directory, but not both. Names must resolve unambiguously within the app root and can't contain path separators or traversal components. To inject multiple agents, stack decorators with distinct `arg_name` values and matching handler parameters.

For complete code examples, see the [package quickstarts and samples](#available-packages).

## Shared agent skills and MCP servers

The extension automatically discovers shared agent capabilities from the application root:

| Capability | Location | Behavior |
| --- | --- | --- |
| Agent skills | `skills/<skill-name>/SKILL.md` or `Skills/<skill-name>/SKILL.md` | The provider package loads and validates the file-based agent skill. |
| Remote MCP servers | `mcp.json` | The extension configures supported HTTP or streamable HTTP servers and optional tool allowlists. |
| Provider tools | Application or binding configuration | SDK-specific tools or Python callables supported by the provider are explicitly supplied instead of discovered. |

Keep these considerations in mind when you use shared agent capabilities:

+ Every agent binding in the function app receives all discovered agent skills and MCP servers.
+ File-based agent skills are capabilities that an agent can load. They aren't [Azure Functions hosted skills](functions-hosted-skills.md), which use a separate execution model.
+ The current preview of the agent extension doesn't support selecting a subset of capabilities for an app or individual binding.
+ Agent skills and MCP tools can perform privileged operations. Place only capabilities that every agent in the app is allowed to use, and use separate function apps when agents require different capability boundaries.

MCP configuration can reference environment variables for URLs, headers, authentication scopes, and client IDs. References are resolved for each invocation, before the extension connects to the server. Don't store secrets directly in a source-controlled `mcp.json` file.

Local-process and standard input/output (stdio) MCP servers aren't supported. MCP support is an optional dependency and normal package imports remain safe when it isn't installed.

## Use agent bindings with Durable Functions

When you install a provider's optional Durable Functions integration, a synchronous generator orchestrator yields `context.call_agent(agent_name, input_)`. The extension runs agent work in a hidden activity, keeping model calls, tools, and other nondeterministic operations outside orchestrator replay.

Inputs and outputs must be JSON serializable. Calls use the provider and shared capabilities configured by the app. See the [package quickstarts and samples](#available-packages) for installation and orchestration examples.

## Project files

An agent-enabled application is a standard Python v2 function app with agent extension dependencies and one or more instruction files:

| File or folder | Purpose |
| --- | --- |
| `function_app.py` | Defines `AgentFunctionApp`, standard Functions triggers, agent bindings, client factories, and explicitly configured provider tools. |
| `host.json` | Configures the Azure Functions host. |
| `requirements.txt` | Includes a provider package and its required dependencies. Optional extras can enable Durable Functions and MCP support. |
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
+ [Use a GitHub Copilot SDK agent in a Python function](functions-agent-bindings-copilot-sdk.md)
+ [Use a Microsoft Agent Framework agent binding in a Durable orchestration](functions-agent-bindings-agent-framework-durable.md)
+ [Hybrid hosted-skill sample in the Azure Functions agents runtime (AFAR) repository](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples/hybrid-hosted-skill) — a separate model for invoking a hosted skill from ordinary function code.
