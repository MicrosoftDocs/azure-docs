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

The Azure Functions serverless agents runtime is a markdown-first programming model for building AI agents as Azure Functions apps. Instead of stitching together hosting, triggers, model clients, tools, session storage, identity, and observability, you define agents in `.agent.md` files and deploy them as a function app.

The runtime is designed for agents that react to events, call tools, and run on serverless infrastructure. Agents can start from HTTP requests, schedules, queues, messages, database changes, and other events; use MCP servers, MCP-enabled connections, reusable skills, and sandboxed execution; and run with the same deployment, identity, monitoring, and scale features used by other Azure Functions apps. For app-specific logic, you can write custom Python tools in the same function app.

> [!NOTE]
> The serverless agents runtime is in preview. Features, configuration names, and supported connectors can change before general availability.

## Why build agents on Azure Functions?

Production agents need more than a prompt and a model. They need reliable ways to start work, call external systems, persist conversation history, run untrusted code safely, authenticate without secrets, emit telemetry, and scale on demand.

Azure Functions already provides an event-driven compute model for those operational concerns. The serverless agents runtime applies that model to agents:

+ **Agents are the unit of work.** A `.agent.md` file defines the trigger and the instructions for one agent.
+ **Events start agents.** Functions triggers let agents run on a schedule, react to queues and events, or expose HTTP endpoints.
+ **Capabilities are configured first, with code when you need it.** Agents can use remote MCP servers, MCP-enabled connections, skills, and sandboxed code execution from configuration. Use custom Python tools for app-specific logic.
+ **Hosting is serverless.** Flex Consumption supports scale-to-zero, per-second billing, managed identity, virtual network integration, and Application Insights.
+ **Operational plumbing is built in.** The runtime handles agent discovery, trigger registration, tool assembly, session history, and optional debug endpoints.

## Project anatomy

A serverless agents app is a Python Azure Functions app with agent-specific files beside the normal Functions project files.

| File or folder | Required | Purpose |
| --- | --- | --- |
| `function_app.py` | Yes | Imports `create_function_app()` and returns the configured Azure Functions app. |
| `*.agent.md` | Yes | Defines agents. YAML front matter configures the agent, and the markdown body becomes the instructions. |
| `agents.config.yaml` | Yes | Defines app-wide runtime defaults, such as model, timeout, and sandbox settings. |
| `mcp.json` | When using MCP servers | Defines remote HTTP MCP servers that agents can use as tools. This file exists only at the root of the function app project when the app uses MCP servers. |
| `tools/` | No | Contains custom Python tools for capabilities that aren't covered by MCP servers, connections, skills, or sandboxed execution. |
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

Each `.agent.md` file defines one agent. The file name is used to derive the Azure Function name and optional debug route slug. The `name` field is a display name used in logs, labels, and documentation.

Use these front matter fields to configure an agent:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Display name for the agent. |
| `description` | Yes | Short description of what the agent does and when it should be used. |
| `trigger` | Yes, except for `main.agent.md` | Defines how the agent is invoked. Only one trigger is allowed per agent file. |
| `model` | No | Overrides the default model configured in `agents.config.yaml` or app settings. |
| `timeout` | No | Overrides the default execution timeout, in seconds. |
| `debug` | No | Enables optional debug surfaces. Use `true` to enable all debug surfaces, or configure `chat`, `http`, and `mcp` individually. |
| `logger` | No | Controls whether runtime logging is enabled for the agent. Defaults to `true`. |
| `mcp` | No | Controls access to MCP servers discovered from `mcp.json`. Use `false` to disable MCP servers for this agent, or use `exclude` to remove specific servers. |
| `skills` | No | Controls access to discovered skills. Use `false` to disable skills for this agent, or use `exclude` to remove specific skills. |
| `tools` | No | Controls access to discovered custom Python tools. Use `false` to disable custom tools for this agent, or use `exclude` to remove specific tools. |
| `system_tools` | No | Lets an agent opt out of configured system tools, such as sandboxed execution. |
| `input_schema` | No | JSON Schema used to validate HTTP request bodies for HTTP-triggered agents. |
| `response_schema` | No | JSON Schema used to validate structured responses returned by HTTP-triggered agents. |
| `response_example` | No | Example response shape used to guide structured responses from HTTP-triggered agents. |
| `metadata` | No | Custom metadata for your own organization or tooling. |
| `substitute_variables` | No | Controls whether environment variable substitution is applied to the front matter and instructions. Defaults to `true`. |

A trigger definition has a `type` and an `args` object. The `args` object is passed to the corresponding Azure Functions binding registration.

```yaml
trigger:
  type: timer_trigger
  args:
    schedule: "0 0 15 * * *"
```

Common trigger types include `http_trigger`, `timer_trigger`, `queue_trigger`, `blob_trigger`, `event_grid_trigger`, and `service_bus_trigger`. Connection-backed triggers can also start agents from connector events, such as a new email or message, when supported by the connection. A separate connector trigger article will describe those trigger schemas in more detail.

By default, an agent inherits the discovered MCP servers, skills, and custom Python tools in the app. Use exclude lists when one agent shouldn't use a shared capability:

```yaml
mcp:
  exclude:
    - microsoft-learn
skills:
  exclude:
    - incident-response
tools:
  exclude:
    - submit_ticket
```

### Runtime defaults in agents.config.yaml

Use `agents.config.yaml` for app-wide runtime defaults that every agent can inherit. In the preview templates, this file is required because it configures settings such as the model deployment and sandbox execution endpoint.

This file is one app-level input. The runtime also discovers MCP servers from `mcp.json`, skills from `skills/`, and custom Python tools from `tools/`. Those capabilities are enabled on agents by default. Agent front matter can override runtime defaults or filter inherited MCP servers, skills, and tools.

```yaml
system_tools:
  execute_in_sessions:
    session_pool_management_endpoint: $ACA_SESSION_POOL_ENDPOINT

model: $AZURE_OPENAI_DEPLOYMENT
timeout: 900
```

Individual agents can override supported runtime settings in their own front matter.

Use these top-level fields in `agents.config.yaml`:

| Field | Required | Description |
| --- | --- | --- |
| `model` | Yes in the preview templates | Default model or model deployment used by agents that don't set `model` in their own front matter. |
| `timeout` | No | Default execution timeout, in seconds. The runtime default is 900 seconds. |
| `system_tools.execute_in_sessions.session_pool_management_endpoint` | When using sandboxed execution | Management endpoint for the Azure Container Apps dynamic session pool used by sandbox tools. |
| `tools.exclude` | No | Global exclude list for custom Python tools discovered from the `tools/` folder. |

The runtime resolves values from agent front matter first, then `agents.config.yaml`, then app settings and runtime defaults. String values in `agents.config.yaml` can reference app settings, such as `$AZURE_OPENAI_DEPLOYMENT` or `$ACA_SESSION_POOL_ENDPOINT`.

Keep model, timeout, and system tool defaults in `agents.config.yaml`. Keep remote MCP server and connection MCP endpoint definitions in `mcp.json`.

### Variable substitution

The runtime can substitute app settings and environment variables into string values in agent front matter, agent instruction bodies, `agents.config.yaml`, and `mcp.json`. Use `$SETTING_NAME` or `%SETTING_NAME%`. Variable names must start with a letter or underscore and can contain letters, numbers, and underscores.

```yaml
model: $AZURE_OPENAI_DEPLOYMENT
system_tools:
  execute_in_sessions:
    session_pool_management_endpoint: %ACA_SESSION_POOL_ENDPOINT%
```

```markdown
Email the summary to $TO_EMAIL.
```

```json
{
  "servers": {
    "office365": {
      "type": "http",
      "url": "$O365_MCP_SERVER_URL"
    }
  }
}
```

Substitution applies to string values, including strings nested in objects or lists. It doesn't apply to object keys. Fenced code blocks in agent instruction bodies aren't substituted, so examples can include literal `$VALUE` or `%VALUE%` text.

Use `$$SETTING_NAME` or `%%SETTING_NAME%%` when you need a literal placeholder in substituted content. Missing environment variables are left unchanged, empty values resolve to empty strings, and substitution is a single pass. The `${SETTING_NAME}` syntax isn't supported.

To disable substitution for one agent's front matter and instructions, set `substitute_variables: false` in the agent file. This setting doesn't disable substitution in `agents.config.yaml` or `mcp.json`.

### MCP servers and connections

When an app uses remote MCP servers, add `mcp.json` to the root of the function app project. The runtime discovers remote HTTP or streamable HTTP MCP servers from this file and makes their tools available to agents, subject to any per-agent filters.

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

Use these fields in each `servers` entry:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Use `http` or `streamable-http`. Local `stdio` MCP servers aren't supported by the runtime. |
| `url` | Yes | Remote MCP server endpoint. Environment variable substitution is supported. |
| `headers` | No | Static headers for a generic remote MCP server. Don't use static secrets for Azure connection MCP endpoints. |
| `auth.scope` | For connection MCP endpoints | Microsoft Entra token scope used to authenticate calls to the MCP endpoint. |
| `auth.client_id` | No | Client ID of the managed identity to use for this MCP server. Omit this field to use the app-wide identity selection. |

Azure connectors and connections are related but different. A connector defines the integration type, such as Microsoft Teams or Microsoft 365. A connection is an authenticated instance of a connector. The runtime uses connections in two ways:

+ **Connection-backed triggers** start agents from connector events, such as a new email, Teams message, or calendar event. Connector trigger schemas are documented separately as those triggers become available.
+ **Connection MCP tools** let an agent call actions exposed by an authenticated connection. Infrastructure can create the connection, enable its MCP endpoint, and add the endpoint to `mcp.json`.

A connection MCP server entry stores the endpoint and managed identity authentication settings. Use the Azure API Hub scope when the agent consumes a connection MCP endpoint. Don't store user secrets in `mcp.json`.

```json
{
  "servers": {
    "office365-outlook": {
      "type": "http",
      "url": "$O365_MCP_SERVER_URL",
      "auth": {
        "scope": "https://apihub.azure.com/.default",
        "client_id": "$O365_MCP_CLIENT_ID"
      }
    }
  }
}
```

In apps that use a specific user-assigned managed identity for a connection MCP endpoint, set `auth.client_id` to that managed identity's client ID. If `auth.client_id` is omitted or empty, the runtime uses the app-wide identity selection. The identity used by the function app in Azure, or your local developer identity when you run locally, must be allowed to call the connection.

## How the runtime starts an app

When the Azure Functions host imports the app, `create_function_app()` builds a configured `FunctionApp` from the project files:

1. Resolve the app root.
1. Load `agents.config.yaml`.
1. Load each `.agent.md` file.
1. Discover MCP servers, skills, and custom tools.
1. Compose app-wide defaults and per-agent configuration.
1. Validate the resolved agent configuration.
1. Build the final tool and skill capabilities for each agent.
1. Register Azure Functions triggers and optional debug endpoints.

After startup, the Azure Functions host indexes the registered triggers just like it does for other function apps. When a trigger fires, the runtime builds the agent with its instructions, model setting, tools, skills, and session history, then executes it through Microsoft Agent Framework.

## Trigger agents from events

Serverless agents are useful when the event that starts work is as important as the model call. The runtime supports one trigger per agent file.

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

Agents become useful when they can act. Start with configured capabilities: remote MCP servers, MCP-enabled connections, skills, and sandboxed execution. Use custom Python tools for app-specific capabilities that don't fit those options.

### Remote MCP servers

MCP servers provide tools over a standard protocol. The runtime discovers remote HTTP or streamable HTTP MCP servers from `mcp.json` and passes them to the agent during execution.

Use remote MCP servers when agents need to call tools hosted by another service, use an MCP-enabled connection, or compose agents and tools across app boundaries.

### Azure connectors

Azure connectors let agents work with Microsoft and third-party services such as Microsoft 365, Teams, Salesforce, SAP, and SQL. In a serverless agents app, infrastructure can create a connection from a connector, enable the connection's MCP endpoint, and grant the function app identity access to call it.

This approach keeps connection authorization and service-specific API details out of your agent instructions and custom code.

### Skills

Skills are reusable prompt assets stored under `skills/`. They help keep the base agent instructions small while making domain-specific instructions available when needed. The runtime uses the [Agent Skills](https://agentskills.io/) format.

The runtime scans `skills/` in the function app project root and recursively discovers folders that contain `SKILL.md`:

```text
skills/
  incident-response/
    SKILL.md
    triage-checklist.md
    escalation-policy.md
```

The `SKILL.md` file contains YAML front matter followed by markdown instructions:

```markdown
---
name: incident-response
description: Triage production incidents, summarize impact, and recommend next steps. Use when the task mentions incidents, outages, alerts, or severity levels.
---

Follow the incident response checklist in [triage-checklist.md](triage-checklist.md).
```

Use these skill authoring rules:

+ Every skill folder must contain a `SKILL.md` file.
+ The `name` and `description` fields are required.
+ Skill names must use lowercase letters, numbers, and single hyphens. Don't use spaces, underscores, uppercase letters, leading hyphens, trailing hyphens, or repeated hyphens.
+ Skill names must be unique across the app.
+ The description should explain both what the skill does and when the agent should use it. The runtime loads skill names and descriptions first so the agent can decide when to load the full skill.
+ Skills can include multiple markdown files in the same skill folder. Reference those files from `SKILL.md` by using relative links.
+ Only markdown files are supported as skill content in the serverless agents runtime. If a skill needs executable behavior, package that code as a custom Python tool and refer to the tool by name from the skill instructions.

Agents inherit all discovered skills by default. Disable or exclude skills in an agent file when a specific agent shouldn't use them:

```yaml
skills: false
```

```yaml
skills:
  exclude:
    - incident-response
```

### Sandboxed execution

For code execution or browser automation, the runtime can use [Azure Container Apps dynamic sessions](../container-apps/sessions.md). Dynamic sessions provide isolated environments from [session pools](../container-apps/session-pool.md). The runtime uses [code interpreter sessions](../container-apps/sessions-code-interpreter.md) to provide an `execute_python` tool to agents.

Configure sandboxed execution in `agents.config.yaml`:

```yaml
system_tools:
  execute_in_sessions:
    session_pool_management_endpoint: $ACA_SESSION_POOL_ENDPOINT
```

Use these sandbox requirements:

+ The session pool must be a Python code interpreter session pool, such as a pool created with `--container-type PythonLTS`.
+ The `session_pool_management_endpoint` value is the pool management endpoint.
+ In Azure, the managed identity used by the function app must have the role assignments required to execute code in the session pool. Azure Container Apps code interpreter sessions require the `Azure ContainerApps Session Executor` and `Contributor` roles on the session pool.
+ When running locally, your developer identity must have the same required access to the session pool.
+ To use a user-assigned managed identity for sandboxed execution, set `AZURE_CLIENT_ID` to the client ID of the identity that has the required role assignments. If this setting isn't set, the runtime uses the default credential chain.

The sandbox tool runs Python in an isolated session. Variables, imports, and files can persist across tool calls in the same agent session. When no agent session ID is available, the runtime uses a fresh sandbox session so unrelated executions don't share state.

Agents inherit sandboxed execution when it's configured globally. Disable it for a specific agent when that agent shouldn't run code:

```yaml
system_tools:
  execute_in_sessions: false
```

### Custom Python tools

Use custom Python tools for app-specific capabilities that don't fit MCP servers, MCP-enabled connections, skills, or sandboxed execution. Custom tools let you use Azure Functions and Python packages from the same function app.

Add tool files to the `tools/` folder in the function app project root:

```text
tools/
  submit_ticket.py
  lookup_customer.py
```

The runtime discovers `.py` files in `tools/` whose file names don't start with `_`. In the current preview, the runtime registers the first supported tool from each file. Use one tool per file to keep discovery predictable.

You can define a tool by decorating a function with `@tool` from the runtime package:

```python
from azure_functions_agents import tool


@tool(name="submit_ticket", description="Create a support ticket with a title and summary.")
async def submit_ticket(title: str, summary: str) -> str:
    return f"Created ticket for {title}: {summary}"
```

For richer parameter descriptions and validation, use a Pydantic model as the tool schema:

```python
from pydantic import BaseModel, Field
from azure_functions_agents import tool


class LookupCustomerParams(BaseModel):
    customer_id: str = Field(description="Customer identifier from the CRM system.")


@tool(schema=LookupCustomerParams, description="Look up customer details by customer ID.")
async def lookup_customer(params: LookupCustomerParams) -> str:
    return f"Customer details for {params.customer_id}"
```

You can also define a plain Python function without the decorator. The runtime wraps the first plain function it finds in the file, uses the function name as the tool name, and uses the docstring as the tool description.

```python
def summarize_order(order_id: str) -> str:
    """Summarize an order by order ID."""
    return f"Summary for order {order_id}"
```

Tool names, descriptions, type hints, and Pydantic field descriptions help the model decide when and how to call the tool. Add any package dependencies used by custom tools to `requirements.txt`, just as you would for other Python code in an Azure Functions app.

Agents inherit discovered custom tools by default. Disable or exclude custom tools in an agent file when a specific agent shouldn't use them:

```yaml
tools: false
```

```yaml
tools:
  exclude:
    - submit_ticket
```

## Configure model providers

The runtime uses Microsoft Agent Framework to call model providers. Preview support includes Azure OpenAI, Azure AI Foundry, and OpenAI.

Provider selection is based on app settings. You can pin the provider with `MAF_PROVIDER`, or let the runtime infer the provider from settings such as `AZURE_OPENAI_ENDPOINT`, `FOUNDRY_PROJECT_ENDPOINT`, or `OPENAI_API_KEY`.

Model selection uses this general precedence:

1. The model requested by the agent or runtime call.
1. Provider-specific settings, such as `AZURE_OPENAI_DEPLOYMENT` or `FOUNDRY_MODEL`.
1. `MAF_MODEL`.
1. The provider default.

For production apps, prefer managed identity where supported. When an app should use a user-assigned managed identity, set `AZURE_CLIENT_ID` so model providers and sandboxed execution use that identity.

## Configure managed identities

The runtime uses managed identity for Azure resources that support Microsoft Entra authentication. Use `AZURE_CLIENT_ID` as the app's default identity selector. Connection MCP endpoints and blob-backed session history can use more specific identity settings.

For model providers and sandboxed execution, set `AZURE_CLIENT_ID` when you want the runtime to use a user-assigned managed identity. If `AZURE_CLIENT_ID` isn't set, the runtime uses the standard Azure SDK credential behavior, which can include the system-assigned managed identity when one is available.

Use these settings to select managed identities:

| Runtime feature | Identity setting | Fallback |
| --- | --- | --- |
| Azure OpenAI model provider | `AZURE_CLIENT_ID` | Default credential behavior |
| Azure AI Foundry model provider | `AZURE_CLIENT_ID` | Default credential behavior |
| Azure Container Apps dynamic sessions sandbox | `AZURE_CLIENT_ID` | Default credential behavior |
| Connection MCP endpoints | The `auth.client_id` value in the server entry in `mcp.json` | `AZURE_CLIENT_ID`, then default credential behavior |
| Blob-backed session history | `AzureWebJobsStorage__clientId` when using identity-based storage | `AZURE_CLIENT_ID`, then default credential behavior |

For Azure OpenAI, these identity settings apply only when `AZURE_OPENAI_API_KEY` isn't set. If an API key is configured, the model provider uses the key instead of managed identity.

Session history uses the same storage identity configuration as the Azure Functions host. Use `AzureWebJobsStorage`, `AzureWebJobsStorage__blobServiceUri`, and `AzureWebJobsStorage__clientId` to configure identity-based storage for blob-backed history. The runtime doesn't use a separate agent-specific identity setting for session history.

## Sessions and state

Multi-turn agent interactions need session history. In Azure, the runtime stores session history in Blob Storage by using the function app's `AzureWebJobsStorage` account. This design avoids a separate session database for many apps and works with connection-string or identity-based storage configuration.

For local development without Azure storage configuration, the runtime can fall back to file-based session history under the local agents configuration directory.

Sandboxed execution is also session-aware. When the runtime creates sandbox tools without an explicit session ID, it uses an isolated session for the invocation instead of sharing state across unrelated agent runs.

## Built-in debug endpoints

The runtime can expose debug and composition endpoints without additional application code. Use the chat UI and chat APIs for development, testing, and diagnostics, not as the primary production application interface.

| Surface | Route | Azure key |
| --- | --- | --- |
| Chat UI | `/` for `main.agent.md`; `/agents/<AGENT_NAME>/` for other agents with `debug.chat: true` | No key required by the runtime. |
| HTTP chat API | `POST /agent/chat` for `main.agent.md`; `POST /agents/<AGENT_NAME>/chat` for other agents with `debug.chat: true` or `debug.http: true` | Function key. |
| Streaming chat API | `POST /agent/chatstream` for `main.agent.md`; `POST /agents/<AGENT_NAME>/chatstream` for other agents with `debug.chat: true` or `debug.http: true` | Function key. |
| MCP endpoint | `/runtime/webhooks/mcp` | `mcp_extension` system key. |

The default `main.agent.md` can expose these surfaces automatically. Other agent files can opt in through debug settings in their front matter. For non-main agents, `<AGENT_NAME>` is derived from the `.agent.md` file name, not the display `name` field.

When hosted in Azure, get a function key for the HTTP chat APIs:

```azurecli
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "functionKeys.default" \
  --output tsv
```

Pass the key in the `x-functions-key` header or the `code` query string parameter. To connect an MCP client, get the MCP extension system key instead:

```azurecli
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "systemKeys.mcp_extension" \
  --output tsv
```

The MCP endpoint requires this system key unless the app configures anonymous access.

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

Start with the quickstart to deploy a serverless agents app with a chat agent, a timer-triggered blog summary agent, a model deployment, sandboxed execution, and optional connection MCP tools:

> [!div class="nextstepaction"]
> [Build serverless agents using Azure Functions](scenario-serverless-agents-runtime.md)

## Related content

+ [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md)
+ [Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Connect an MCP server on Azure Functions to Foundry Agent Service](functions-mcp-foundry-tools.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
