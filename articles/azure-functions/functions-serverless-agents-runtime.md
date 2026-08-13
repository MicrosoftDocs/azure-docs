---
title: Serverless agents runtime in Azure Functions
description: "Learn how the Azure Functions serverless agents runtime lets you build event-driven AI agents with markdown, Functions triggers, MCP tools, connectors, sandboxed execution, and managed hosting."
ms.topic: concept-article
ms.date: 07/21/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to understand the Azure Functions serverless agents runtime so that I can decide when to use it and how to structure an event-driven agent app.
---

# Serverless agents runtime in Azure Functions

The Azure Functions serverless agents runtime is a programming model for building event-driven AI agents as Azure Functions apps. Agents can start from HTTP requests, timers, queues, blobs, database changes, or Connector events. You define agents in `.agent.md` files, configure tools and runtime defaults alongside your project, and deploy the app like any other function app. The runtime handles trigger registration, model calls, tool assembly, session history, and observability on serverless infrastructure.

[!INCLUDE [serverless-agents-runtime-preview](../../includes/functions-serverless-agents-runtime-preview.md)]

## When to use the serverless agents runtime

Use the serverless agents runtime when your agent is event-driven, tool-rich, or operationally close to Azure Functions workloads. Scenarios for the serverless agent runtime include:

+ Scheduled background agents that summarize, monitor, reconcile, or report.
+ Event-driven assistants that react to messages, emails, alerts, queue messages, or data changes.
+ Cross-system agents that use connectors to coordinate work across SaaS and enterprise applications.
+ Conversational front ends that expose the same agent through HTTP, chat UI, or MCP.
+ Agents that should scale to zero and use managed identity, monitoring, deployment slots, and other Azure hosting capabilities.

In the following scenarios, the serverless agent runtime might not be the best option:

| Scenario | Better option |
| --- | --- |
| Expose deterministic functions as tools for another AI client | [Azure Functions MCP extension](functions-create-ai-enabled-apps.md) |
| Long-running, multi-step orchestration with human-in-the-loop approvals | [Durable Functions](../durable-task/durable-functions/durable-functions-overview.md) |
| No-code agent builder | [Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) or [Foundry prompt agents](/azure/ai-foundry/agents/overview) |

For a detailed comparison with other Microsoft agent options, see [Compare the serverless agents runtime with other Microsoft agent options](compare-serverless-agents-runtime.md).

> [!TIP]
> To try the serverless agents runtime, see [Build serverless agents using Azure Functions](scenario-serverless-agents-runtime.md). By using an `azd` template, you can have a working app deployed to Azure in minutes.

## Why build agents on Azure Functions?

Production agents need more than a prompt and a model. They need reliable ways to start work, call external systems, persist conversation history, run untrusted code safely, authenticate without secrets, emit telemetry, and scale on demand.

Functions provides an event-driven compute model for these operational concerns. The serverless agents runtime simply applies that same model to your agent code. Here are some benefits of using the serverless agents runtime to build and run your agent code:

+ **Agents are the unit of work.** Each agent is defined in a separate markdown file.
+ **Events start agents.** Functions triggers start agents from schedules, HTTP requests, queue messages, blob changes, Event Grid events, Service Bus messages, and other [supported events](./functions-serverless-agents-runtime-reference.md#trigger-configuration).
+ **Capabilities are configured first, with code when you need it.** You can configure agents to use remote MCP servers, MCP servers hosted in connector namespaces, skills, and sandboxed code executions. Write your own Python-based tools for app-specific logic.
+ **Serverless hosting is available.** The serverless agents runtime supports both [Flex Consumption](flex-consumption-plan.md) and [Dedicated (App Service)](./dedicated-plan.md) plans. The Flex Consumption plan provides scale-to-zero, per-second billing, and automatic scaling. Both plans support managed identity, virtual network integration, and Application Insights integration.
+ **Operational plumbing is built in.** The runtime handles agent discovery, trigger registration, tool assembly, session history, and optional built-in endpoints.

## Project definition

A serverless agents app is a standard Python v2 function app project deployed along with [agent-specific files](#agent-runtime-files). The following project files are always required for Python function apps:

| File | Purpose |
| --- | --- |
| `function_app.py` | Imports `create_function_app()` and returns the configured Azure Functions app. |
| `host.json` | Configures the Azure Functions host. |
| `requirements.txt` | Includes the serverless agents runtime package and any app-specific Python dependencies. |

For more information, see the [Azure Functions developer reference guide for Python apps](./functions-reference-python.md#folder-structure).

## Agent runtime files

The runtime discovers these agent-specific files and folders, which deploy with the app project:

| File or folder | Purpose |
| --- | --- |
| `*.agent.md` | Defines agents. YAML front matter configures the agent, and the markdown body becomes the instructions. Your project must have at least one agent definition file. |
| `agents.config.yaml` | (Optional) Defines app-wide runtime defaults, such as model, timeout, and sandbox settings. |
| `mcp.json` | Defines the remote HTTP MCP servers that agents can use as tools, including connector tools for tasks such as sending email or working with Teams. |
| `tools/` | (Optional) Contains any custom Python tools you create to provide capabilities not already provided by MCP servers, connections, skills, or sandboxed executions. |
| `skills/` | (Optional) Contains reusable `SKILL.md` prompt assets that agents can load as needed. |

Each agent file uses YAML front matter followed by markdown instructions. This example defines a timer-triggered agent that runs daily at 3 PM (UTC):

```markdown
---
name: Daily Tech News Email
description: Fetches top tech news and emails a summary daily.

trigger:
  type: timer_trigger
  args:
    schedule: "0 0 15 * * *"
---

You are a news assistant. When triggered, do the following:

1. Gather today's top technology news from reputable sources.
1. Summarize the stories in a concise HTML email body.
1. Email the summary to $TO_EMAIL with the subject "Daily Tech News Summary".
```

The front matter declares how the agent is invoked. The markdown body is the instruction block that the runtime passes to the model during execution. Environment variable substitution lets instructions and configuration values reference app settings such as `$TO_EMAIL`.

Each `.agent.md` file defines one agent. The file name derives the Azure Function name and the route segment for built-in endpoints. The `name` field is a display name for logs, labels, and documentation.

For the full list of agent file fields, app configuration options, and variable substitution rules, see [Serverless agents runtime reference](functions-serverless-agents-runtime-reference.md).

## App startup process

When the Functions host loads the app, the [`create_function_app`](https://github.com/Azure/azure-functions-agents-runtime/blob/main/src/azure_functions_agents/app.py#L90) method discovers agent files (triggers), MCP servers, skills, and custom tools in the project. It validates the configuration, assembles the tools for each agent, and registers the required triggers and endpoints. 

When an agent-specific trigger fires, the runtime builds the agent with its resolved instructions, model, tools, and session history, then executes it by using the [Microsoft Agent Framework](/agent-framework/overview).

## Trigger agents from events

The runtime supports multiple agent triggers in your app, but only one trigger per agent file. A trigger definition has a `type` and an `args` object. The `type` identifies the trigger binding, and `args` contains the trigger-specific settings that configure which event starts the agent.

Common trigger patterns include:

| Pattern | Example |
| --- | --- |
| HTTP agent | Receive a request, call tools, and return a structured response. |
| Scheduled agent | Run a daily report, digest, cleanup, or reconciliation workflow. |
| Queue or message agent | Process work items that need model reasoning or tool calls. |
| Storage or database event agent | React to changed files, records, or events. |
| Connector-triggered agent | React to events from [managed connectors](functions-connectors-overview.md), such as Teams messages, Outlook mail, or calendar events supported by the connector. |

For trigger configuration details, supported types, and `args` reference, see [Serverless agents runtime reference](functions-serverless-agents-runtime-reference.md#trigger-configuration).

## Give agents tools

The serverless agents runtime supports several types of tools. Start with configured capabilities, and use custom Python tools for app-specific logic that doesn't fit those options.

### Remote MCP servers

Define remote HTTP or streamable HTTP MCP servers in `mcp.json`. The runtime discovers these servers and makes their tools available to all agents. Use remote MCP servers when agents need to call tools hosted by another service or compose agents and tools across app boundaries.

### Azure connectors

Connectors let agents work with external services without custom API client code. A [Connector Namespace](../connector-namespace/connector-namespace-overview.md) hosts connections, triggers, and MCP servers for services such as Microsoft 365 Outlook, Teams, Salesforce, SAP, or SQL. Use connector triggers to start agents from external events, and connector MCP tools to call service actions from agent instructions.

### Skills

Store reusable prompt assets under `skills/`. Each skill folder contains a `SKILL.md` file with a name, description, and markdown instructions. The runtime automatically discovers skills and makes them available to agents. Skills help keep base agent instructions small while making domain-specific guidance available when needed.

### Sandboxed execution

The runtime can use Azure Container Apps dynamic sessions to give agents an `execute_python` tool. This tool runs Python in an isolated session pool, which is useful for code execution and data analysis tasks. Configure the session pool endpoint in `agents.config.yaml`.

### Custom Python tools

Use custom Python tools for app-specific capabilities. Add `.py` files to the `tools/` folder and decorate functions with `@tool` from the runtime package. The runtime automatically discovers and registers these tools.

For configuration details, field tables, and code examples for each tool type, see [Serverless agents runtime reference](functions-serverless-agents-runtime-reference.md#mcp-server-configuration-mcpjson).

## Sessions and state

Multi-turn agent interactions need session history. In Azure, the runtime stores session history in Blob Storage through the function app's `AzureWebJobsStorage` account. For local development, the runtime falls back to file-based session history. Sandboxed execution is also session-aware and uses isolated sessions for unrelated agent runs.

## Observability

Starting with `azure-functions-agents-runtime` version `0.1.0b6`, the runtime includes an observability feature set that's still in active development and subject to change.

For the latest configuration details, telemetry fields, and usage guidance, use the runtime repository documentation:

+ [Observability in azure-functions-agents-runtime](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md)

## Related content

+ [Serverless agents runtime reference](functions-serverless-agents-runtime-reference.md)
+ [Build serverless agents using Azure Functions](scenario-serverless-agents-runtime.md)
+ [Compare the serverless agents runtime with other Microsoft agent options](compare-serverless-agents-runtime.md)
+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
