---
title: Azure Functions hosted skills
description: "Add AI reasoning to your function apps with Azure Functions hosted skills. Define behavior in Markdown, respond to events, and connect to tools and services."
ms.topic: concept-article
ms.date: 09/01/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to understand Azure Functions hosted skills so that I can add AI reasoning to my event-driven function apps.
---

# Azure Functions hosted skills

Azure Functions hosted skills let you add AI reasoning to your function apps. Each hosted skill is defined in an `.agent.md` file that contains natural-language instructions, a trigger configuration, and optional tool bindings. When an event fires, the runtime calls a model, runs any tools the model requests, and returns a result. You deploy the app like any other function app.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

A *hosted skill* is a single unit of AI-powered work defined in an `.agent.md` file. Each hosted skill maps to one Azure Function. A *skill* on its own refers to reusable Markdown guidance stored in a `SKILL.md` file that hosted skills can load on demand.

## When to use hosted skills

Use Azure Functions hosted skills when a business event needs AI reasoning before an action is taken. For example:

+ **Triage incoming email.** A connector trigger fires when a complaint arrives in a shared mailbox. The hosted skill reads the message, classifies severity, and routes it to the right support queue.
+ **Enrich new CRM leads.** A connector trigger fires when a lead is added to Salesforce or Dynamics 365. The hosted skill searches the web for context about the lead and sends a summary to the assigned salesperson.
+ **Validate data changes.** A blob or database trigger fires when a revenue record is updated. The hosted skill checks whether revenue dropped below a threshold, generates an explanation, and starts a review workflow.
+ **Serve a domain-specific MCP tool.** An external agent or agent harness calls a hosted skill through HTTP or MCP. The hosted skill applies AI logic to data in storage or a database and returns a structured response, acting as a smart, domain-specific tool that other AI clients can consume.

Hosted skills are a good fit when you need event-driven triggers, AI reasoning with tools, and the operational features of Azure Functions (managed identity, monitoring, scale-to-zero, virtual network integration). They also work well for exposing AI capabilities through HTTP or MCP for other applications to consume.

> [!TIP]
> To try Azure Functions hosted skills, see [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md). By using an `azd` template, you can have a working app deployed to Azure in minutes.

## Why use Functions for your AI apps?

Production AI workloads need more than a prompt and a model. They need reliable ways to start work, call external systems, persist conversation history, run untrusted code safely, authenticate without secrets, emit telemetry, and scale on demand.

Functions provides an event-driven compute model for these operational concerns. Azure Functions hosted skills apply that same model to your AI code. Benefits include:

+ **Each hosted skill is one `.agent.md` file.** Declarative configuration and natural-language instructions live together. Each file maps to one Azure Function.
+ **Events start hosted skills.** Functions triggers start hosted skills from schedules, HTTP requests, queue messages, blob changes, Event Grid events, Service Bus messages, and other [supported events](./functions-hosted-skills-reference.md#trigger-configuration).
+ **Capabilities are configured first, with code when you need it.** You can configure hosted skills to use remote MCP servers, MCP servers hosted in connector namespaces, reusable skills, and sandboxed code execution. Write your own Python-based tools for app-specific logic.
+ **Azure Functions hosting is built in.** Azure Functions hosted skills support [Flex Consumption](flex-consumption-plan.md), [Premium](functions-premium-plan.md), and [Dedicated (App Service)](./dedicated-plan.md) plans. Flex Consumption provides scale-to-zero, per-second billing, and automatic scaling. All plans support managed identity, virtual network integration, and Application Insights.
+ **Operational plumbing is handled for you.** The runtime manages hosted skill discovery, trigger registration, tool assembly, session history, and optional built-in endpoints.

## Works with other Microsoft AI platforms

Azure Functions hosted skills are complementary to other Microsoft AI offerings and can be used alongside them. Their sweet spot is building cloud-hosted, event-driven intelligent capabilities on Azure Functions through an approachable programming model. Hosted skills can expose capabilities through HTTP or MCP for use by other applications, agents, and agent harnesses.

Choose the Azure capability that best fits your scenario:

| Scenario | Option |
| --- | --- |
| Expose deterministic functions as tools for another AI client | [Azure Functions MCP extension](functions-create-ai-enabled-apps.md) |
| Long-running, multi-step orchestration with human-in-the-loop approvals | [Durable Functions](../durable-task/durable-functions/durable-functions-overview.md) |
| Create and manage AI agents without custom hosting | [Microsoft Foundry](/azure/ai-foundry/agents/overview) or [Copilot Studio](/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) |

## Project definition

An Azure Functions hosted skills app is a standard Python v2 function app project deployed along with [hosted skills project files](#hosted-skills-project-files). The following project files are always required for Python function apps:

| File | Purpose |
| --- | --- |
| `function_app.py` | Imports `create_function_app()` and returns the configured Azure Functions app. |
| `host.json` | Configures the Azure Functions host. |
| `requirements.txt` | Includes the hosted skills runtime package and any app-specific Python dependencies. |

For more information, see the [Azure Functions developer reference guide for Python apps](./functions-reference-python.md#folder-structure).

## Hosted skills project files

The runtime discovers these files and folders, which deploy with the app project:

| File or folder | Purpose |
| --- | --- |
| `*.agent.md` | Defines hosted skills. YAML front matter configures the hosted skill, and the markdown body becomes the instructions. Your project must have at least one `.agent.md` file. |
| `agents.config.yaml` | (Optional) Defines app-wide runtime defaults, such as model, timeout, and sandbox settings. |
| `mcp.json` | Defines the remote HTTP MCP servers that hosted skills can use as tools, including connector tools for actions such as sending email or working with Teams. |
| `tools/` | (Optional) Contains any custom Python tools you create to provide capabilities not already provided by MCP servers, connections, skills, or sandboxed executions. |
| `skills/` | (Optional) Contains reusable `SKILL.md` prompt assets that hosted skills can load as needed. |

Each `.agent.md` file uses YAML front matter followed by markdown instructions. This example defines a timer-triggered hosted skill that runs daily at 3 PM (UTC):

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

The front matter declares how the hosted skill is invoked. The markdown body is the instruction block that the runtime passes to the model during execution. Environment variable substitution lets instructions and configuration values reference app settings such as `$TO_EMAIL`.

Each `.agent.md` file defines one hosted skill. The file name derives the Azure Function name and the route segment for built-in endpoints. The `name` field is a display name for logs, labels, and documentation.

For the full list of `.agent.md` file fields, app configuration options, and variable substitution rules, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md).

## App startup process

When the Functions host loads the app, the [`create_function_app`](https://github.com/Azure/azure-functions-agents-runtime/blob/main/src/azure_functions_agents/app.py#L90) method discovers `.agent.md` files, MCP servers, skills, and custom tools in the project. It validates the configuration, assembles the tools for each hosted skill, and registers the required triggers and endpoints.

When a trigger fires, the runtime builds the hosted skill with its resolved instructions, model, tools, and session history, then executes it.

## Trigger hosted skills from events

The runtime supports multiple triggers in your app, but only one trigger per `.agent.md` file. A trigger definition has a `type` and an `args` object. The `type` identifies the trigger binding, and `args` contains the trigger-specific settings that configure which event starts the hosted skill.

Common trigger patterns include:

| Pattern | Example |
| --- | --- |
| HTTP | Receive a request, call tools, and return a structured response. |
| Schedule | Run a daily report, digest, cleanup, or reconciliation workflow. |
| Queue or message | Process work items that need model reasoning or tool calls. |
| Storage or database event | React to changed files, records, or events. |
| Connector trigger | React to events from [managed connectors](functions-connectors-overview.md), such as Teams messages, Outlook mail, or calendar events supported by the connector. |

For trigger configuration details, supported types, and `args` reference, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md#trigger-configuration).

## Supported AI tools

The Azure Functions hosted skills support several types of tools. Start with configured capabilities, and use custom Python tools for app-specific logic that doesn't fit those options.

### Remote MCP servers

Define remote HTTP or streamable HTTP MCP servers in `mcp.json`. The runtime discovers these servers and makes their tools available to all hosted skills. Use remote MCP servers when hosted skills need to call tools hosted by another service or compose capabilities across app boundaries.

### Azure connectors

Connectors let hosted skills work with external services without custom API client code. A [Connector Namespace](../connector-namespace/connector-namespace-overview.md) hosts connections, triggers, and MCP servers for services such as Microsoft 365 Outlook, Teams, Salesforce, SAP, or SQL. Use connector triggers to start hosted skills from external events, and connector MCP tools to call service actions from hosted skill instructions.

### Skills

Store reusable prompt assets under the `skills/` folder. Each skill folder contains a `SKILL.md` file with a name, description, and markdown instructions. The runtime automatically discovers skills and makes them available to hosted skills. Skills help keep base instructions small while making domain-specific guidance available when needed.


### Sandboxed execution

The runtime can use Azure Container Apps dynamic sessions to give hosted skills an `execute_python` tool. This tool runs Python in an isolated session pool, which is useful for code execution and data analysis. Configure the session pool endpoint in `agents.config.yaml`.

### Custom Python tools

Use custom Python tools for app-specific capabilities. Add `.py` files to the `tools/` folder and decorate functions with `@tool` from the runtime package. The runtime automatically discovers and registers these tools.

For configuration details, field tables, and code examples for each tool type, see [Azure Functions hosted skills reference](functions-hosted-skills-reference.md#mcp-server-configuration-mcpjson).

### Dynamic workflows

Dynamic workflows let supported AI tasks start durable, multistep plans made of workflow-safe tool calls, subagent tasks, and waits. They extend the programmatic tool calling pattern with Durable Functions so a task can fan out work, run isolated specialists, wait on durable timers, survive worker restarts, and keep large intermediate results out of the conversation until a final summary is ready.

In the current experimental v1 surface, enable workflows in an independently runnable `.agent.md` file. Workflow tasks can call Python functions that you explicitly decorate with `@workflow_tool` or specialist tasks that you grant through `workflows.subagents`. For more information, see [Dynamic workflows in Azure Functions hosted skills](functions-hosted-skills-dynamic-workflows.md).

## Sessions and state

Multi-turn interactions need session history. In Azure, the runtime stores session history in Blob Storage through the function app's `AzureWebJobsStorage` account. For local development, the runtime falls back to file-based session history. Sandboxed execution is also session-aware and uses isolated sessions for unrelated runs.

## Observability

Starting with `azure-functions-agents-runtime` version `0.1.0b6`, the runtime includes an observability feature set that's still in active development and subject to change.

For the latest configuration details, telemetry fields, and usage guidance, use the runtime repository documentation:

+ [Observability in azure-functions-agents-runtime](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md)

## Related content

+ [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)
+ [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Dynamic workflows in Azure Functions hosted skills](functions-hosted-skills-dynamic-workflows.md)
+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
