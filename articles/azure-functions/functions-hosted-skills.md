---
title: Azure Functions hosted skills
description: "Learn how Azure Functions hosted skills bring a Markdown and natural-language programming model for intelligent, event-driven workloads to Azure Functions."
ms.topic: concept-article
ms.date: 08/27/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to understand Azure Functions hosted skills so that I can decide when to use this programming model for my event-driven AI workloads.
---

# Azure Functions hosted skills

Azure Functions hosted skills is a programming model for building cloud-hosted, event-driven intelligent capabilities on Azure Functions. You define behavior with Markdown, natural-language instructions, and declarative configuration. You can integrate hosted skills with your applications through Azure Functions triggers and bindings, or bring your own code as tools when needed.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

An Azure Functions hosted skills app is a function app that uses the hosted skills programming model. It contains AI tasks defined in `.agent.md` files, and tasks can optionally use reusable Markdown guidance from `SKILL.md` files. In this article, *hosted skills* refers to the programming model, *task* refers to an individual runnable unit, and *skill* refers to reusable Markdown guidance.

## Scenarios

Azure Functions hosted skills work best for event-driven, tool-rich AI workloads. Common scenarios include:

+ **HTTP tasks** that receive a request, call tools, and return a structured response.
+ **Scheduled tasks** that run daily reports, digests, cleanup, or reconciliation workflows.
+ **Queue or message tasks** that process work items needing model reasoning or tool calls.
+ **Data-change tasks** that react to new or changed files, records, or database rows.
+ **Connector-triggered tasks** that react to events from [managed connectors](functions-connectors-overview.md), such as Teams messages, Outlook mail, or calendar events.

> [!TIP]
> To try Azure Functions hosted skills, see [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md). By using an `azd` template, you can have a working app deployed to Azure in minutes.

## Why use Functions for your AI apps?

Production AI workloads need more than a prompt and a model. They need reliable ways to start work, call external systems, persist conversation history, run untrusted code safely, authenticate without secrets, emit telemetry, and scale on demand.

Functions provides an event-driven compute model for these operational concerns. Azure Functions hosted skills apply that same model to your AI code. Benefits include:

+ **AI tasks are the unit of work.** Each task is defined in a separate `.agent.md` file with declarative configuration and natural-language instructions.
+ **Events start tasks.** Functions triggers start AI tasks from schedules, HTTP requests, queue messages, blob changes, Event Grid events, Service Bus messages, and other [supported events](./functions-hosted-skills-reference.md#trigger-configuration).
+ **Capabilities are configured first, with code when you need it.** You can configure tasks to use remote MCP servers, MCP servers hosted in connector namespaces, skills, and sandboxed code executions. Write your own Python-based tools for app-specific logic.
+ **Azure Functions hosting is built in.** Azure Functions hosted skills support [Flex Consumption](flex-consumption-plan.md), [Premium](functions-premium-plan.md), and [Dedicated (App Service)](./dedicated-plan.md) plans. Flex Consumption provides scale-to-zero, per-second billing, and automatic scaling. All plans support managed identity, virtual network integration, and Application Insights.
+ **Operational plumbing is handled for you.** The runtime manages task discovery, trigger registration, tool assembly, session history, and optional built-in endpoints.

## Works with other Microsoft AI platforms

Azure Functions hosted skills are complementary to other Microsoft AI offerings and can be used alongside them. Their sweet spot is building cloud-hosted, event-driven intelligent capabilities on Azure Functions through an approachable programming model. Hosted skills can expose capabilities through HTTP or MCP for use by other applications, agents, and agent harnesses.

Choose the Azure capability that best fits your scenario:

| Scenario | Option |
| --- | --- |
| Expose deterministic functions as tools for another AI client | [Azure Functions MCP extension](functions-create-ai-enabled-apps.md) |
| Long-running, multi-step orchestration with human-in-the-loop approvals | [Durable Functions](../durable-task/durable-functions/durable-functions-overview.md) |
| Create and manage AI agents without custom hosting | [Microsoft Foundry](/azure/ai-foundry/agents/overview) or [Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) |

## Project definition

An Azure Functions hosted skills app is a standard Python v2 function app project deployed along with [runtime-specific files](#agent-runtime-files). The following project files are always required for Python function apps:

| File | Purpose |
| --- | --- |
| `function_app.py` | Imports `create_function_app()` and returns the configured Azure Functions app. |
| `host.json` | Configures the Azure Functions host. |
| `requirements.txt` | Includes the hosted skills runtime package and any app-specific Python dependencies. |

For more information, see the [Azure Functions developer reference guide for Python apps](./functions-reference-python.md#folder-structure).

## Agent runtime files

The runtime discovers these files and folders, which deploy with the app project:

| File or folder | Purpose |
| --- | --- |
| `*.agent.md` | Defines AI tasks. YAML front matter configures the task, and the markdown body becomes the instructions. Your project must have at least one `.agent.md` file. |
| `agents.config.yaml` | (Optional) Defines app-wide runtime defaults, such as model, timeout, and sandbox settings. |
| `mcp.json` | Defines the remote HTTP MCP servers that AI tasks can use as tools, including connector tools for actions such as sending email or working with Teams. |
| `tools/` | (Optional) Contains any custom Python tools you create to provide capabilities not already provided by MCP servers, connections, skills, or sandboxed executions. |
| `skills/` | (Optional) Contains reusable `SKILL.md` prompt assets that AI tasks can load as needed. |

Each `.agent.md` file uses YAML front matter followed by markdown instructions. This example defines a timer-triggered AI task that runs daily at 3 PM (UTC):

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

The front matter declares how the task is invoked. The markdown body is the instruction block that the runtime passes to the model during execution. Environment variable substitution lets instructions and configuration values reference app settings such as `$TO_EMAIL`.

Each `.agent.md` file defines one AI task. The file name derives the Azure Function name and the route segment for built-in endpoints. The `name` field is a display name for logs, labels, and documentation.

For the full list of agent file fields, app configuration options, and variable substitution rules, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md).

## App startup process

When the Functions host loads the app, the [`create_function_app`](https://github.com/Azure/azure-functions-agents-runtime/blob/main/src/azure_functions_agents/app.py#L90) method discovers `.agent.md` files, MCP servers, skills, and custom tools in the project. It validates the configuration, assembles the tools for each task, and registers the required triggers and endpoints.

When a trigger fires, the runtime builds the task with its resolved instructions, model, tools, and session history, then executes it by using the [Microsoft Agent Framework](/agent-framework/overview).

## Trigger AI tasks from events

The runtime supports multiple triggers in your app, but only one trigger per `.agent.md` file. A trigger definition has a `type` and an `args` object. The `type` identifies the trigger binding, and `args` contains the trigger-specific settings that configure which event starts the AI task.

Common trigger patterns include:

| Pattern | Example |
| --- | --- |
| HTTP task | Receive a request, call tools, and return a structured response. |
| Scheduled task | Run a daily report, digest, cleanup, or reconciliation workflow. |
| Queue or message task | Process work items that need model reasoning or tool calls. |
| Storage or database event task | React to changed files, records, or events. |
| Connector-triggered task | React to events from [managed connectors](functions-connectors-overview.md), such as Teams messages, Outlook mail, or calendar events supported by the connector. |

For trigger configuration details, supported types, and `args` reference, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md#trigger-configuration).

## Supported AI tools

The Azure Functions hosted skills support several types of tools. Start with configured capabilities, and use custom Python tools for app-specific logic that doesn't fit those options.

### Remote MCP servers

Define remote HTTP or streamable HTTP MCP servers in `mcp.json`. The runtime discovers these servers and makes their tools available to all AI tasks. Use remote MCP servers when tasks need to call tools hosted by another service or compose capabilities across app boundaries.

### Azure connectors

Connectors let AI tasks work with external services without custom API client code. A [Connector Namespace](../connector-namespace/connector-namespace-overview.md) hosts connections, triggers, and MCP servers for services such as Microsoft 365 Outlook, Teams, Salesforce, SAP, or SQL. Use connector triggers to start tasks from external events, and connector MCP tools to call service actions from task instructions.

### Skills

Store reusable prompt assets under the `skills/` folder. Each skill folder contains a `SKILL.md` file with a name, description, and markdown instructions. The runtime automatically discovers skills and makes them available to AI tasks. Skills help keep base instructions small while making domain-specific guidance available when needed.


### Sandboxed execution

The runtime can use Azure Container Apps dynamic sessions to give AI tasks an `execute_python` tool. This tool runs Python in an isolated session pool, which is useful for code execution and data analysis. Configure the session pool endpoint in `agents.config.yaml`.

### Custom Python tools

Use custom Python tools for app-specific capabilities. Add `.py` files to the `tools/` folder and decorate functions with `@tool` from the runtime package. The runtime automatically discovers and registers these tools.

For configuration details, field tables, and code examples for each tool type, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md#mcp-server-configuration-mcpjson).

## Sessions and state

Multi-turn interactions need session history. In Azure, the runtime stores session history in Blob Storage through the function app's `AzureWebJobsStorage` account. For local development, the runtime falls back to file-based session history. Sandboxed execution is also session-aware and uses isolated sessions for unrelated runs.

## Observability

Starting with `azure-functions-agents-runtime` version `0.1.0b6`, the runtime includes an observability feature set that's still in active development and subject to change.

For the latest configuration details, telemetry fields, and usage guidance, use the runtime repository documentation:

+ [Observability in azure-functions-agents-runtime](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md)

## Related content

+ [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)
+ [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
