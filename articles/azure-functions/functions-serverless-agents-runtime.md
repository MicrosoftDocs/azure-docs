---
title: Serverless agents runtime in Azure Functions
description: "Learn how the Azure Functions serverless agents runtime lets you build event-driven AI agents with markdown, Functions triggers, MCP tools, connectors, sandboxed execution, and managed hosting."
ms.topic: concept-article
ms.date: 05/20/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to understand the Azure Functions serverless agents runtime so that I can decide when to use it and how to structure an event-driven agent app.
---

# Serverless agents runtime in Azure Functions

The Azure Functions serverless agents runtime is a markdown-first programming model for building AI agents as a first-class workload on Azure Functions. Instead of stitching together a hosting layer, trigger handling, model client, tool wiring, session storage, identity, and observability, you define agents in `.agent.md` files and deploy them as a function app.

The runtime is designed for agents that react to events, call tools, and run on serverless infrastructure. You can trigger agents from HTTP requests, schedules, queues, messages, database changes, and other events; give agents tools from MCP servers, Azure connectors, custom Python code, reusable skills, and sandboxed execution; and operate them with the same deployment, identity, monitoring, and scale features used by other Azure Functions apps.

> [!NOTE]
> The serverless agents runtime is in preview. Features, configuration names, and supported connectors can change before general availability.

## Why build agents on Azure Functions

Production agents need more than a prompt and a model. They need reliable ways to start work, call external systems, persist conversation history, run untrusted code safely, authenticate without secrets, emit telemetry, and scale with demand.

Azure Functions already provides an event-driven compute model for those operational concerns. The serverless agents runtime applies that model to agents:

+ **Agents are the unit of work.** A `.agent.md` file defines the trigger and the instructions for one agent.
+ **Events start agents.** Functions triggers let agents run on a schedule, react to queues and events, or expose HTTP endpoints.
+ **Tools are declared, not hand-wired.** Agents can use remote MCP servers, MCP-enabled Azure connectors, custom tools, skills, and sandboxed code execution.
+ **Hosting is serverless.** Flex Consumption supports scale-to-zero, per-second billing, managed identity, virtual network integration, and Application Insights.
+ **Operational plumbing is built in.** The runtime handles agent discovery, trigger registration, tool assembly, session history, and optional debug endpoints.

## Project anatomy

A serverless agents app is a Python Azure Functions app with agent-specific files beside the normal Functions project files.

| File or folder | Required | Purpose |
| --- | --- | --- |
| `function_app.py` | Yes | Imports `create_function_app()` and returns the configured Azure Functions app. |
| `*.agent.md` | Yes | Defines agents. YAML front matter configures the agent, and the markdown body becomes the instructions. |
| `agents.config.yaml` | Yes | Defines required shared runtime configuration, including model settings, sandbox settings, and other app-wide runtime defaults. |
| `mcp.json` | When using MCP servers | Defines remote HTTP MCP servers that agents can use as tools. This file exists only at the root of the function app project when the app uses MCP servers. |
| `tools/` | No | Contains custom Python tools that are discovered by the runtime. |
| `skills/` | No | Contains reusable `SKILL.md` prompt assets that agents can load as needed. |
| `host.json` | Yes | Configures the Azure Functions host. |
| `requirements.txt` | Yes | Includes the serverless agents runtime package and any app-specific Python dependencies. |
| `infra/` | No | Contains infrastructure-as-code files used by deployment tooling such as `azd`. |

At the smallest useful size, a project has `function_app.py`, `host.json`, `requirements.txt`, `agents.config.yaml`, and at least one `.agent.md` file.

### Agent files

An agent file uses YAML front matter followed by markdown instructions. This example defines a timer-triggered agent:

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

### Shared runtime configuration

Use `agents.config.yaml` for shared runtime settings that every agent in the app can inherit. In the preview templates, this file is required because it configures runtime settings such as the model deployment and sandbox execution endpoint.

```yaml
system_tools:
  execute_in_sessions:
    session_pool_management_endpoint: $ACA_SESSION_POOL_ENDPOINT

model: $AZURE_OPENAI_DEPLOYMENT
timeout: 900
```

Individual agents can override supported runtime settings in their own front matter.

### MCP servers and connector tools

When your app uses remote MCP servers, add `mcp.json` to the root of the function app project. The runtime discovers remote HTTP or streamable HTTP MCP servers from this file and makes their tools available to agents, subject to any per-agent filters.

```json
{
  "servers": {
    "microsoft-learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp"
    }
  }
}
```

For Azure connectors, infrastructure can create a connection, enable its MCP endpoint, and provide that endpoint to the app. The agent then calls the connection through MCP tools instead of using service-specific integration code.

## How the runtime starts an app

When the Azure Functions host imports your app, `create_function_app()` builds a configured `FunctionApp` from the files in the project:

1. Resolve the app root.
1. Load `agents.config.yaml`.
1. Load each `.agent.md` file.
1. Discover custom tools, skills, and MCP servers.
1. Compose the shared configuration and per-agent configuration.
1. Validate the resolved agent configuration.
1. Build the final tool and skill capabilities for each agent.
1. Register Azure Functions triggers and optional debug endpoints.

After startup, the Azure Functions host indexes the registered triggers just like it does for other function apps. When a trigger fires, the runtime builds the agent with its instructions, model setting, tools, skills, and session history, then executes it through Microsoft Agent Framework.

## Trigger agents from events

Serverless agents are useful when the event that starts the work is as important as the model call itself. The runtime supports defining one trigger per agent file.

Common trigger patterns include:

| Pattern | Example |
| --- | --- |
| HTTP agent | Receive a request, call tools, and return a structured response. |
| Scheduled agent | Run a daily report, digest, cleanup, or reconciliation workflow. |
| Queue or message agent | Process work items that need model reasoning or tool calls. |
| Storage or database event agent | React to changed files, records, or events. |
| Connection-backed agent | React to events from connected services such as Teams messages, Outlook mail, or calendar events when supported by the connector. |

Because each agent is registered as an Azure Function, the app can use Functions hosting features such as scale rules, managed identity, networking, and monitoring.

## Give agents tools

Agents become useful when they can act. The serverless agents runtime provides several ways to give agents capabilities.

### Remote MCP servers

MCP servers provide tools over a standard protocol. The runtime discovers remote HTTP or streamable HTTP MCP servers from `mcp.json` and passes them to the agent during execution.

Use remote MCP servers when you want agents to call tools hosted by another service, use an MCP-enabled Azure connector, or compose agents and tools across app boundaries.

### Azure connectors

Azure connectors let agents work with Microsoft and third-party services such as Microsoft 365, Teams, Salesforce, SAP, SQL, and many others. In a serverless agents app, infrastructure can create the connection, enable its MCP endpoint, and grant the function app identity access to call it.

This approach keeps connector authentication and service-specific API details out of your agent instructions and custom code.

### Custom Python tools

Add app-specific tools in the `tools/` folder when the agent needs code that belongs with your function app. The runtime discovers supported Python tool functions and includes them in the tool set available to the agent.

### Skills

Skills are reusable prompt assets stored under `skills/`. They help keep the base agent instructions small while making domain-specific instructions available when needed.

### Sandboxed execution

For work that needs code execution or browser automation, the runtime can use Azure Container Apps dynamic sessions. The app configures the session pool endpoint in `agents.config.yaml`, and the runtime provides sandbox tools to the agent at execution time.

## Configure model providers

The runtime uses Microsoft Agent Framework to call model providers. Preview support includes Azure OpenAI, Azure AI Foundry, and OpenAI.

Provider selection is based on app settings. You can pin the provider with `MAF_PROVIDER`, or let the runtime infer the provider from settings such as `AZURE_OPENAI_ENDPOINT`, `FOUNDRY_PROJECT_ENDPOINT`, or `OPENAI_API_KEY`.

Model selection uses this general precedence:

1. The model requested by the agent or runtime call.
1. Provider-specific settings, such as `AZURE_OPENAI_DEPLOYMENT` or `FOUNDRY_MODEL`.
1. `MAF_MODEL`.
1. The provider default.

For production apps, prefer managed identity where supported. In apps with multiple managed identities, set `AZURE_CLIENT_ID` so the runtime and Azure SDK clients use the intended user-assigned managed identity.

## Sessions and state

Multi-turn agent interactions need session history. In Azure, the runtime persists session history by using Blob Storage in the function app's `AzureWebJobsStorage` account. This design avoids a separate session database for many apps and works with connection-string or identity-based storage configuration.

For local development without Azure storage configuration, the runtime can fall back to file-based session history under the local agents configuration directory.

Sandboxed execution is also session-aware. When the runtime creates sandbox tools without an explicit session ID, it uses an isolated session for the invocation instead of sharing state across unrelated agent runs.

## Built-in endpoints

The runtime can expose debug and composition endpoints without additional application code.

| Surface | Use |
| --- | --- |
| Chat UI | Interact with an agent in a browser during development or testing. |
| HTTP chat API | Call an agent programmatically with a JSON request. |
| Streaming chat API | Stream model and tool output to a client. |
| MCP endpoint | Expose an agent as an MCP tool for other agents or MCP clients. |

The default `main.agent.md` can expose these surfaces automatically. Other agent files can opt in through debug settings in their front matter.

## When to use the serverless agents runtime

Use the serverless agents runtime when your agent is event-driven, tool-rich, or operationally close to Azure Functions workloads.

Good fits include:

+ Scheduled background agents that summarize, monitor, reconcile, or report.
+ Event-driven assistants that react to messages, emails, alerts, queue messages, or data changes.
+ Cross-system agents that use connectors to coordinate work across SaaS and enterprise applications.
+ Conversational front ends that expose the same agent through HTTP, chat UI, or MCP.
+ Agents that should scale to zero and use managed identity, monitoring, deployment slots, and other Azure hosting capabilities.

If you only need to expose deterministic functions as tools for another AI client, the Azure Functions MCP extension might be a better starting point. For more information, see [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md).

## Get started

Start with the quickstart to deploy a complete serverless agent app with a timer trigger, model deployment, connector MCP tools, and email output:

> [!div class="nextstepaction"]
> [Build a serverless agent using Azure Functions](scenario-serverless-agents-runtime.md)

## Related content

+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Connect an MCP server on Azure Functions to Foundry Agent Service](functions-mcp-foundry-tools.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
